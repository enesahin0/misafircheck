#!/usr/bin/env python3
"""
(İsteğe bağlı) Seslendirmeyi kelime zamanlarıyla yazıya döker.
Yalnızca ortamda internet varsa veya faster-whisper kuruluysa çalışır.

  pip install faster-whisper --break-system-packages
  python transkript.py SES_DOSYASI [--model small] [--cikti transkript.json] [--metin-cikti senaryo.txt]

Çıktıdaki metin, ses_analiz.py --metin için de kullanılabilir; ama en iyi
sonuç kullanıcının kendi senaryo metnidir (yazım/terim hatası olmaz).
"""
import argparse, json, sys
try:
    from faster_whisper import WhisperModel
except ImportError:
    sys.exit("faster-whisper yok. İnternet açıksa: pip install faster-whisper --break-system-packages\n"
             "Değilse kullanıcıdan senaryo metnini iste ve ses_analiz.py --metin kullan.")
ap = argparse.ArgumentParser()
ap.add_argument("ses"); ap.add_argument("--model", default="small")
ap.add_argument("--cikti", default="transkript.json"); ap.add_argument("--metin-cikti", default="senaryo.txt")
a = ap.parse_args()
m = WhisperModel(a.model, device="cpu", compute_type="int8")
segs, _ = m.transcribe(a.ses, language="tr", word_timestamps=True, vad_filter=True)
out = []
for s in segs:
    out.append({"baslangic": round(s.start,2), "bitis": round(s.end,2), "metin": s.text.strip(),
                "kelimeler": [{"k": w.word.strip(), "b": round(w.start,2), "e": round(w.end,2)} for w in (s.words or [])]})
json.dump(out, open(a.cikti,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
open(a.metin_cikti,"w",encoding="utf-8").write(" ".join(o["metin"] for o in out))
print(f"{len(out)} segment yazıldı: {a.cikti}")
