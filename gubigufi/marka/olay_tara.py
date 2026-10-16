"""MOTION v2 ses olayı tarayıcısı: her sahneyi kare kare (render etmeden) renderAt(t) ile oynatır,
motion2.js'in kaydettiği window.MO_OLAY olaylarını toplar → olaylar.json (global saniye, sıralı).
Kullanım (video kaynak klasöründe):  python3 ../../../marka/olay_tara.py plan.json  [--fps 30]
"""
import asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright

async def tara(plan_yolu, fps=30):
    plan = json.load(open(plan_yolu)); kok = Path(plan_yolu).resolve().parent; tum = []
    async with async_playwright() as pw:
        tar = await pw.chromium.launch(args=["--disable-gpu"])
        for s in plan["sahneler"]:
            sure = s["bitis"] - s["baslangic"]
            sf = await tar.new_page(viewport={"width": 1080, "height": 1920})
            await sf.add_init_script(f"window.SAHNE_SURESI={sure};")
            await sf.goto((kok / s["dosya"]).as_uri()); await sf.wait_for_load_state("load")
            olay = await sf.evaluate("""([n, fps]) => { for (let i = 0; i <= n; i++) { try { window.renderAt && window.renderAt(i / fps); } catch (e) {} }
                return Object.values(window.MO_OLAY || {}); }""", [int(sure * fps), fps])
            tum += [o for o in olay if s["baslangic"] - .5 <= o["t"] <= s["bitis"] + .5]
            await sf.close()
        await tar.close()
    tum.sort(key=lambda o: o["t"])
    json.dump(tum, open(kok / "olaylar.json", "w"), ensure_ascii=False, indent=0)
    from collections import Counter
    print(len(tum), "olay →", dict(Counter(o["tur"] for o in tum)), "| olay/sn:", round(len([o for o in tum if not o.get("doku")]) / max(1, plan["sahneler"][-1]["bitis"]), 2))

if __name__ == "__main__":
    fps = int(sys.argv[sys.argv.index("--fps") + 1]) if "--fps" in sys.argv else 30
    asyncio.run(tara(sys.argv[1], fps))
