# Yeni video şablonu — MOTION v2 (varsayılan, 16.10.2026'dan itibaren)

1. Video klasörünü aç: `gubigufi/<tarih>/<NN-ad>/kaynak/`. Önceki bir videonun `kaynak/ortak` + `render.py` + `_tail.py` + `_logo_sahne.js` kopyalanır.
2. `marka/ortak/motion2.js` ve `marka/ortak/vendor/` → `kaynak/ortak/` içine kopyala (güncel sürüm her zaman marka'dadır).
3. Bu klasördeki `_head.py` (motion2 + flubber + culori + `window.GECIS` yuvası), `uret.py` (SB, TEP, GECIS, ALT) ve `ses.py` (ses2 Tasarim) iskeletlerini al.
4. Sahne yaz: `MO.sahne({ zemin, kamera, sarsinti, ciz, onCiz })` — her öğe `MO.oge(...)` ile (giriş + ÇIKIŞ), maskotlar/ekrana sabit çipler `onCiz`'de.
5. `python3 uret.py` → kontrol kareleri (`render.py --kare`) → paralel render → `python3 ../../../marka/olay_tara.py plan.json` → `python3 ses.py` → `--birlestir` → loudnorm.
Kurallar ve gerekçeler: `marka/motion/ARASTIRMA.md`, brif: `marka/motion/YONETMEN_BRIEF.md`, örnek: `2026-10-16/37-dask-odemez/kaynak_v2/`.
