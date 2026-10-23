#!/usr/bin/env python3
"""
HTML/SVG sahnelerini kare kare render edip seslendirmeyle birleştirerek MP4 üretir.

Kullanım:
  python render.py plan.json                  # tüm sahneler + birleştirme
  python render.py plan.json --sahne 3        # sadece 3. sahne (uzun videolarda parça parça)
  python render.py plan.json --sahne 3-6      # 3'ten 6'ya
  python render.py plan.json --birlestir      # render edilmiş parçaları birleştir + sesi ekle
  python render.py plan.json --onizleme       # yarım çözünürlük, 12 fps (hızlı kontrol)
  python render.py plan.json --kare 3 2.5     # 3. sahnenin 2.5. saniyesinden tek PNG (görsel kontrol)

plan.json:
{
  "fps": 25, "genislik": 1920, "yukseklik": 1080,
  "ses": "seslendirme.mp3",          # plan.json'a göre göreli yol olabilir
  "muzik": null,                      # isteğe bağlı: {"dosya": "muzik.mp3", "ses_duzeyi": 0.12}
  "cikti": "video.mp4",
  "sahneler": [
    {"dosya": "sahneler/s01.html", "baslangic": 0.0,  "bitis": 4.8},
    {"dosya": "sahneler/s02.html", "baslangic": 4.8,  "bitis": 9.1}
  ]
}

Sahne HTML sözleşmesi (assets/sahne-sablonu.html):
  - Sahnenin t=0'ı, sahnenin plandaki 'baslangic' anıdır.
  - Tüm CSS animasyonları (@keyframes) otomatik olarak t'ye sarılır: animation-delay
    değerleri sahne içindeki saniyelerdir. Gerçek zamanlı akış YOKTUR; her kare tek tek
    konumlanır, bu yüzden sonuç deterministiktir.
  - JS ile kontrol edilen şeyler için window.renderAt = function(t) {...} tanımla.
  - Harici kaynak (Google Fonts, CDN, uzak görsel) kullanma; her şey dosyanın içinde olsun.
"""
import argparse, asyncio, base64, json, os, shutil, subprocess, sys, time
from pathlib import Path

SEEK_JS = """
(t) => {
  for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; }
  if (typeof window.renderAt === 'function') window.renderAt(t);
}
"""

def yukle(plan_yolu):
    plan = json.load(open(plan_yolu, encoding="utf-8"))
    kok = Path(plan_yolu).resolve().parent
    plan.setdefault("fps", 25); plan.setdefault("genislik", 1920); plan.setdefault("yukseklik", 1080)
    plan.setdefault("cikti", "video.mp4")
    return plan, kok

def aralik(s, n):
    if s is None: return list(range(1, n+1))
    if "-" in s:
        a, b = s.split("-"); return list(range(int(a), int(b)+1))
    return [int(s)]

async def sayfa_ac(pw, w, h, olcek, sure):
    tarayici = await pw.chromium.launch(args=["--disable-gpu", "--force-color-profile=srgb"])
    sayfa = await tarayici.new_page(viewport={"width": w, "height": h}, device_scale_factor=olcek)
    # Sahne süresini sayfaya bildir: CSS'te var(--sure), JS'te window.SAHNE_SURESI
    sayfa._hatalar = []
    sayfa.on("pageerror", lambda e: sayfa._hatalar.append(str(e)))  # sahne JS hatası sessizce boş kare üretmesin
    await sayfa.add_init_script(f"window.SAHNE_SURESI={sure};document.addEventListener('DOMContentLoaded',()=>document.documentElement.style.setProperty('--sure','{sure}s'));")
    return tarayici, sayfa

async def sahne_render(pw, sahne_yolu, bas_kare, bit_kare, fps, w, h, olcek, cikti):
    tarayici, sayfa = await sayfa_ac(pw, w, h, olcek, (bit_kare - bas_kare) / fps)
    await sayfa.goto(sahne_yolu.resolve().as_uri())
    await sayfa.wait_for_load_state("load")
    if sayfa._hatalar: raise RuntimeError(f"SAHNE HATASI ({sahne_yolu.name}): {sayfa._hatalar}")
    await sayfa.evaluate("document.fonts ? document.fonts.ready : null")
    kare_sayisi = max(1, bit_kare - bas_kare)
    ow, oh = int(w*olcek), int(h*olcek)
    ff = subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(fps),
                           "-c:v","mjpeg","-i","-","-vf",f"scale={ow}:{oh},format=yuv420p",
                           "-c:v","libx264","-preset","veryfast","-crf","18","-r",str(fps),str(cikti)],
                          stdin=subprocess.PIPE)
    # CDP ile doğrudan ekran görüntüsü: Playwright screenshot'tan belirgin şekilde hızlı
    cdp = await sayfa.context.new_cdp_session(sayfa)
    t0 = time.time()
    for i in range(kare_sayisi):
        await sayfa.evaluate(SEEK_JS, i / fps)
        r = await cdp.send("Page.captureScreenshot", {"format": "jpeg", "quality": 92, "optimizeForSpeed": True})
        ff.stdin.write(base64.b64decode(r["data"]))
    ff.stdin.close(); ff.wait(); await tarayici.close()
    return kare_sayisi, time.time() - t0

async def tek_kare(pw, sahne_yolu, t, w, h, cikti, sure):
    tarayici, sayfa = await sayfa_ac(pw, w, h, 1.0, sure)
    await sayfa.goto(sahne_yolu.resolve().as_uri()); await sayfa.wait_for_load_state("load")
    await sayfa.evaluate(SEEK_JS, t)
    await sayfa.screenshot(path=str(cikti)); await tarayici.close()

def birlestir(plan, kok, parca_dir, onizleme):
    n = len(plan["sahneler"])
    liste = parca_dir / "liste.txt"
    eksik = [i for i in range(1, n+1) if not (parca_dir / f"parca_{i:03d}.mp4").exists()]
    if eksik: sys.exit(f"Eksik parçalar: {eksik}. Önce onları render et.")
    liste.write_text("".join(f"file 'parca_{i:03d}.mp4'\n" for i in range(1, n+1)))
    sessiz = parca_dir / "_birlesik.mp4"
    subprocess.run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(liste),"-c","copy",str(sessiz)], check=True)
    cikti = kok / (("onizleme_" if onizleme else "") + plan["cikti"])
    girdiler = ["-i", str(sessiz)]
    ses = plan.get("ses"); muzik = plan.get("muzik")
    if ses: girdiler += ["-i", str(kok / ses)]
    if muzik: girdiler += ["-i", str(kok / muzik["dosya"])]
    if ses and muzik:
        v = muzik.get("ses_duzeyi", 0.12)
        filtre = f"[2:a]volume={v}[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]"
        komut = ["ffmpeg","-y","-loglevel","error",*girdiler,"-filter_complex",filtre,"-map","0:v","-map","[a]"]
    elif ses:
        komut = ["ffmpeg","-y","-loglevel","error",*girdiler,"-map","0:v","-map","1:a"]
    else:
        komut = ["ffmpeg","-y","-loglevel","error",*girdiler,"-map","0:v"]
    komut += ["-c:v","copy","-c:a","aac","-b:a","192k","-shortest",str(cikti)]
    subprocess.run(komut, check=True)
    print(f"✅ Video hazır: {cikti}")
    return cikti

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plan"); ap.add_argument("--sahne"); ap.add_argument("--birlestir", action="store_true")
    ap.add_argument("--onizleme", action="store_true"); ap.add_argument("--kare", nargs=2, metavar=("SAHNE","SANIYE"))
    a = ap.parse_args()
    plan, kok = yukle(a.plan)
    from playwright.async_api import async_playwright
    fps = 12 if a.onizleme else plan["fps"]
    w, h = plan["genislik"], plan["yukseklik"]
    olcek = 0.5 if a.onizleme else 1.0
    parca_dir = kok / ("_parcalar_onizleme" if a.onizleme else "_parcalar"); parca_dir.mkdir(exist_ok=True)

    async with async_playwright() as pw:
        if a.kare:
            s = plan["sahneler"][int(a.kare[0])-1]
            out = kok / f"kare_s{int(a.kare[0]):02d}_{a.kare[1]}s.png"
            await tek_kare(pw, kok / s["dosya"], float(a.kare[1]), w, h, out, s["bitis"] - s["baslangic"])
            print(f"Kare: {out}"); return
        if not a.birlestir:
            for i in aralik(a.sahne, len(plan["sahneler"])):
                s = plan["sahneler"][i-1]
                bk, ek = round(s["baslangic"]*fps), round(s["bitis"]*fps)
                n, sure = await sahne_render(pw, kok / s["dosya"], bk, ek, fps, w, h, olcek, parca_dir / f"parca_{i:03d}.mp4")
                print(f"Sahne {i:02d}: {n} kare, {sure:.1f} sn ({n/max(sure,1e-6):.1f} kare/sn)")
    if a.birlestir or a.sahne is None:
        birlestir(plan, kok, parca_dir, a.onizleme)

if __name__ == "__main__":
    asyncio.run(main())
