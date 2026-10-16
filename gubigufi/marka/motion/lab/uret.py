"""MOTION v2 laboratuvarı — kamera, öğe yaşam döngüsü, sayaç, kinetik başlık, geçişler (yıldız maskesi, odak)."""
import json, sys
sys.path.insert(0, '../..')
SB = [0, 4.0, 8.0, 11.0]
TEP = {1: [('gubi', 1.0, 'sasir')], 2: [('gufi', .8, 'aha')], 3: []}
# geçiş: k → k+1 arasındaki kesme; renk perdeleme rengi, merkez maske/itme odağı
GECIS = {1: {'tur': 'yildiz', 'renk': '#FBAC39', 'merkez': [540, 820]}, 2: {'tur': 'odak'}}
ORTAK = r"""
const R = PR.R;
const kart = (w, h, renk) => R(-w / 2, -h / 2, w, h, 36, '#FFF8EE') + R(-w / 2, -h / 2, w, 70, 36, renk) + R(-w / 2, -h / 2 + 40, w, 30, 0, renk);
"""
S = {}
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1A2A50', alt: '#0B1428', isik: [540, 1500, '#3E6FB8', .35], ikinci: [200, 400, '#FBAC39', .12] }),
  kamera: [[0, 1.0, 540, 900], [1.6, 1.28, 540, 700, 1.0]],
  ciz: t => {
    let o = '';
    o += MO.sayiVurgu(t, .3, 1.6, 1277, 540, 640, { boyut: 170 });
    const alt = MO.oge(t, { gir: .5, agirlik: 'hafif', giris: 'yuksel', x: 540, materyal: 'plastik' });
    o += MO.sar(cip('SU BASKINI İHBARI', 0, 0, '#7FD0FF', '#0B1433', 28), alt, 540, 760);
    const k = MO.oge(t, { gir: 2.1, agirlik: 'agir', giris: 'dus', x: 540, materyal: 'plastik', bekle: 2 });
    o += MO.sar(kart(520, 300, '#2E78C8') + txt('DASK', 0, 40, 96, '#1B2440'), k, 540, 1020);
    o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] });
    return o;
  }
});"""
S[2] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#3A2440', alt: '#160E1C', isik: [540, 1300, '#E8323C', .25] }),
  kamera: [[0, 1.12, 540, 820], [1.2, 1.0, 540, 900, 1.2]],
  ciz: t => {
    let o = MO.baslik(t, .35, 'DASK *seli* ödemez', 540, 760, { boyut: 96 });
    for (let i = 0; i < 3; i++) { const s = MO.oge(t, { gir: 1.2 + MO.sira(i, 'orta'), cik: 3.2 + MO.sira(i, 'hafif'), agirlik: 'orta', giris: 'yan', yon: 1, x: 540 }); o += MO.sar(R(-380, -50, 760, 100, 50, '#FFF8EE') + txt(['Yangın ✓', 'Hırsızlık ✓', 'Sel ?'][i], 0, 16, 44, '#1B2440'), s, 540, 920 + i * 130); }
    o += gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 800] });
    return o;
  }
});"""
exec(open('_head.py').read())
N = len(SB) - 1
S[N] = open('_logo_sahne.js').read()
for k in range(1, N): S[k] = ORTAK + S[k]
plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "ses48.wav", "cikti": "lab.mp4", "sahneler": []}
for i in range(1, N + 1):
    tp = {'gubi': [[a, b] for kk, a, b in TEP.get(i, []) if kk == 'gubi'], 'gufi': [[a, b] for kk, a, b in TEP.get(i, []) if kk == 'gufi']}
    g = {'gir': GECIS.get(i - 1), 'cik': GECIS.get(i)}
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__TP__", json.dumps(tp)).replace("__GECIS__", json.dumps(g)).replace("__JS__", S[i])
    if i == N: html = html.replace('<script src="../ortak/kanal.js"></script>', '')
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]})
json.dump(plan, open("plan.json", "w"), indent=1)
print('lab yazıldı')
