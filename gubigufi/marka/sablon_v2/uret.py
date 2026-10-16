# ŞABLON (örnek: #37 v2). Yeni videoda SB/TEP/GECIS/ALT değerlerini ve ORTAK yardımcılarını kendi videona göre değiştir; ORTAK burada v1 klasöründen okunuyor — yeni videoda ORTAK = r"""...""" olarak doğrudan yaz.
"""#37 DASK — MOTION v2 A/B demosu (S1–S4, 0–28,7 sn + logo). Çizim yardımcıları v1'den (../kaynak/uret.py ORTAK) alınır."""
import json, re, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 4.1, 15.95, 22.95, 28.7, 30.7]
TEP = {
    1: [('gufi', .6, 'korku'), ('gubi', 3.2, 'sasir')],
    2: [('gubi', 1.0, 'gozle'), ('gufi', 4.2, 'endise')],
    3: [('gubi', .3, 'dusun'), ('gubi', 3.4, 'uzgun'), ('gufi', 6.0, 'evet')],
    4: [('gufi', .4, 'kafaKasi'), ('gubi', 3.3, 'aha'), ('gufi', 4.8, 'mutlu')],
}
kontrol(TEP, SB)
# k → k+1 kesmesi: su yükselip lensi kaplar → İstanbul'da su çekilir · odak kayması · whip · Gubi yıldızı logoya açılır
GECIS = {1: {'tur': 'perde', 'renk': '#3E8EDE', 'dalga': 1}, 2: {'tur': 'odak'}, 3: {'tur': 'kayma'}, 4: {'tur': 'yildiz', 'renk': '#141112', 'merkez': [540, 900]}}
ALT = {4: 2}
v1 = open('../kaynak/uret.py').read()
ORTAK = re.search(r'ORTAK = r"""(.*?)"""', v1, re.S).group(1)
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
N = len(SB) - 1
S[N] = open('_logo_sahne.js').read()
for k in range(1, N): S[k] = ORTAK + S[k]
plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "miks.wav", "cikti": "video_ham.mp4", "sahneler": []}
tum = []
for i in range(1, N + 1):
    tp = {'gubi': [[a, b] for kk, a, b in TEP.get(i, []) if kk == 'gubi'], 'gufi': [[a, b] for kk, a, b in TEP.get(i, []) if kk == 'gufi']}
    tum += [[kk, round(SB[i - 1] + a, 3), b] for kk, a, b in TEP.get(i, [])]
    g = {'gir': GECIS.get(i - 1), 'cik': GECIS.get(i)}
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__TP__", json.dumps(tp)).replace("__GECIS__", json.dumps(g)).replace("__JS__", S[i])
    if i == N: html = html.replace('<script src="../ortak/kanal.js"></script>', '')
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append(dict({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]}, **({"alt_kare": ALT[i]} if i in ALT else {})))
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
json.dump(sorted(tum, key=lambda r: r[1]), open("tepkiler.json", "w"), ensure_ascii=False)
print("v2 sahneler yazıldı")
