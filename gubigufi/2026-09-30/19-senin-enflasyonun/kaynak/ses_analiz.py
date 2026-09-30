#!/usr/bin/env python3
"""
Seslendirme dosyasını analiz eder ve sahne zaman çizelgesi (timeline.json) üretir.

Kullanım:
  python ses_analiz.py SES_DOSYASI [--metin SENARYO.txt] [--cikti timeline.json]
                       [--esik -35] [--min-sessizlik 0.25]

Ne yapar:
  1) ffprobe ile toplam süreyi okur.
  2) ffmpeg silencedetect ile konuşma aralarındaki duraklamaları bulur.
  3) --metin verilirse senaryoyu cümlelere böler ve her cümleyi, karakter
     uzunluğuna göre tahmin edilen zamana EN YAKIN gerçek duraklamaya
     hizalayarak başlangıç/bitiş süreleri atar.
     Metin yoksa sadece konuşma blokları (duraklamayla ayrılmış) listelenir.

Claude sesi "duyamaz"; bu yüzden hangi cümlenin ne zaman söylendiğini
bilmek için ya senaryo metni (--metin) ya da transkript.py çıktısı gerekir.
"""
import argparse, json, re, subprocess, sys

def sure(ses):
    out = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
                          "-of","default=nw=1:nk=1",ses],capture_output=True,text=True).stdout
    return float(out.strip())

def sessizlikler(ses, esik, min_s):
    err = subprocess.run(["ffmpeg","-hide_banner","-nostats","-i",ses,"-af",
                          f"silencedetect=noise={esik}dB:d={min_s}","-f","null","-"],
                         capture_output=True,text=True).stderr
    bas = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    son = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    araliklar = []
    for i, b in enumerate(bas):
        e = son[i] if i < len(son) else None
        araliklar.append((b, e))
    return araliklar

def konusma_bloklari(toplam, sess):
    bloklar, t = [], 0.0
    for b, e in sess:
        if b - t > 0.05:
            bloklar.append((round(t,3), round(b,3)))
        t = e if e is not None else toplam
    if toplam - t > 0.05:
        bloklar.append((round(t,3), round(toplam,3)))
    return bloklar

def cumleler(metin):
    metin = re.sub(r"\[[^\]]*\]", " ", metin)          # [GÖRSEL: ...] gibi notları at
    metin = re.sub(r"^#.*$", " ", metin, flags=re.M)    # başlık satırlarını at
    metin = re.sub(r"\s+", " ", metin).strip()
    parca = re.split(r"(?<=[.!?…])\s+", metin)
    return [p.strip() for p in parca if len(p.strip()) > 1]

def hizala(bloklar, cumle_listesi):
    # Konuşma zamanını tek eksene diz (sessizlikleri çıkar)
    konusma = sum(e-b for b,e in bloklar)
    uzunluk = [len(c) for c in cumle_listesi]
    top = sum(uzunluk)
    # Aday sınırlar: blok bitişleri (duraklama başları) -> gerçek zaman
    aday = [e for _, e in bloklar[:-1]]
    def konusma_to_gercek(x):
        kalan = x
        for b, e in bloklar:
            if kalan <= e-b: return b + kalan
            kalan -= (e-b)
        return bloklar[-1][1]
    sinirlar, kullanilan, kum = [], set(), 0
    for u in uzunluk[:-1]:
        kum += u
        tahmin = konusma_to_gercek(konusma * kum / top)
        secim = None
        if aday:
            en = min((abs(a - tahmin), i) for i, a in enumerate(aday) if i not in kullanilan) if len(kullanilan) < len(aday) else None
            if en and en[0] < 1.5:
                secim = aday[en[1]]; kullanilan.add(en[1])
        sinirlar.append(secim if secim is not None else tahmin)
    # sıralılığı garanti et
    for i in range(1, len(sinirlar)):
        if sinirlar[i] <= sinirlar[i-1]: sinirlar[i] = sinirlar[i-1] + 0.3
    bas = [bloklar[0][0]] + sinirlar
    son = sinirlar + [bloklar[-1][1]]
    return [{"no": i+1, "baslangic": round(b,2), "bitis": round(e,2),
             "sure": round(e-b,2), "metin": c}
            for i,(b,e,c) in enumerate(zip(bas, son, cumle_listesi))]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ses"); ap.add_argument("--metin"); ap.add_argument("--cikti", default="timeline.json")
    ap.add_argument("--esik", type=float, default=-35); ap.add_argument("--min-sessizlik", type=float, default=0.25)
    a = ap.parse_args()
    toplam = sure(a.ses)
    bloklar = konusma_bloklari(toplam, sessizlikler(a.ses, a.esik, a.min_sessizlik))
    sonuc = {"ses": a.ses, "toplam_sure": round(toplam,2), "konusma_bloklari": bloklar}
    if a.metin:
        c = cumleler(open(a.metin, encoding="utf-8").read())
        sonuc["cumleler"] = hizala(bloklar, c)
        sonuc["not"] = "Cümle zamanları duraklamalara göre tahmini hizalandı; kritik anlarda ±0.5 sn sapma olabilir."
    json.dump(sonuc, open(a.cikti,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"Toplam süre: {toplam:.2f} sn | Konuşma bloğu: {len(bloklar)}"
          + (f" | Cümle: {len(sonuc['cumleler'])}" if a.metin else ""))
    print(f"Yazıldı: {a.cikti}")

if __name__ == "__main__":
    main()
