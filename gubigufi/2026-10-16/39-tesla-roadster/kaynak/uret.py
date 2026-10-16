"""#39 Tesla Roadster — MOTION v2 + SES v2. Gerçek görüntü: Tesla (Instagram @teslamotors) fotoğrafı + reel kareleri (klip_cikar.py)."""
import json, re, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 10.9, 17.9, 25.4, 33.2, 38.4, 41.4, 45.1, 48.3, 51.4, 54.15, 57.3, 59.3]
TEP = {
    1: [('gubi', 4.7, 'gozle'), ('gufi', 8.0, 'sasir')],
    2: [('gufi', 2.0, 'say'), ('gubi', 6.1, 'sasir')],
    3: [('gubi', 1.5, 'gozle'), ('gufi', 6.0, 'sasir')],
    4: [('gufi', 4.0, 'sok'), ('gubi', 5.0, 'korku')],
    5: [('gufi', 3.4, 'aha')],
    6: [('gubi', 1.0, 'sasir')],
    7: [('gubi', 3.0, 'uzgun')],
    8: [('gufi', .3, 'goster'), ('gufi', 2.8, 'omuzSilk')],
    9: [('gubi', 1.7, 'aha')],
    10: [('gubi', .3, 'gel'), ('gufi', .6, 'goster')],
    11: [('gubi', .3, 'selam'), ('gufi', .5, 'selam')],
}
kontrol(TEP, SB)
# geçiş k → k+1: whip · odak · odak · push-through (araca dalış) · kes (iki gerçek klip) · odak · whip · odak · odak · kes · Gubi yıldızı → logo
GECIS = {1: {'tur': 'kayma'}, 2: {'tur': 'odak'}, 3: {'tur': 'odak'}, 4: {'tur': 'itme', 'merkez': [540, 900]}, 5: {'tur': 'kes'}, 6: {'tur': 'odak'},
         7: {'tur': 'kayma', 'yon': -1}, 8: {'tur': 'odak'}, 9: {'tur': 'odak'}, 10: {'tur': 'kes'}, 11: {'tur': 'yildiz', 'renk': '#141112', 'merkez': [540, 900]}}
ALT = {1: 2, 5: 2, 7: 2}
KLIPN = json.load(open('ortak/img/klip/bilgi.json'))
v1 = open('../../37-dask-odemez/kaynak/uret.py').read()
ORTAK = re.search(r'ORTAK = r"""(.*?)"""', v1, re.S).group(1)
ORTAK += r"""
const gosterge = (x, y, r, v, { vmax = 100, renk = '#FBAC39', birim = 'km/sa' } = {}) => {
  const f = Math.min(1, Math.max(0, v / vmax)), a = Math.PI * (1 - f), ex = x + r * Math.cos(a), ey = y - r * Math.sin(a), kal = r * .16;
  let o = `<path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}" fill="none" stroke="#2A3550" stroke-width="${kal}" stroke-linecap="round"/>`;
  if (f > .004) o += `<path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="${renk}" stroke-width="${kal}" stroke-linecap="round"/>`;
  o += `<line x1="${x}" y1="${y}" x2="${(x + r * .74 * Math.cos(a)).toFixed(1)}" y2="${(y - r * .74 * Math.sin(a)).toFixed(1)}" stroke="#FFF3D6" stroke-width="${r * .05}" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r * .07}" fill="#FFF3D6"/>`;
  return o + txt(String(Math.round(v)), x, y + r * .44, r * .42, '#FFFFFF') + `<text class="mono" x="${x}" y="${y + r * .66}" font-size="${r * .13}" text-anchor="middle" letter-spacing="2" style="fill:#7FA0D0">${birim}</text>`;
};
const zamanChip = (s, x, y, renk = '#0B1433', yazi = '#FFF3D6', fs = 34) => { const w = K.yaziGen(s, fs, { mono: true, ls: 2 }) + fs * 1.6; return R(x - w / 2, y - fs * .95, w, fs * 1.9, fs * .95, renk, .92) + `<text class="mono" x="${x}" y="${y + fs * .34}" font-size="${fs}" text-anchor="middle" letter-spacing="2" style="fill:${yazi}">${s}</text>`; };
let _sg = 0;
const scrim = (y0, y1, a0, a1, renk = '#05070F') => { const i = 'sg' + (++_sg); return `<defs><linearGradient id="${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${renk}" stop-opacity="${a0}"/><stop offset="1" stop-color="${renk}" stop-opacity="${a1}"/></linearGradient></defs><rect x="-200" y="${y0}" width="1480" height="${y1 - y0}" fill="url(#${i})"/>`; };
// sinematik görüntü katmanı: üstte hafif karartma, altta altyazıya kadar siyaha eriyen geçiş
const filmKat = () => scrim(-200, 420, .8, 0) + scrim(940, 1330, 0, 1) + R(-200, 1329, 1480, 800, 0, '#05070F', 1);
// sol hizalı alt üçlü: ince renkli çizgi + mono üst başlık + dev başlık (merkez x=540'a göre çizilir)
const altUc = (kucuk, buyuk, { renk = '#7FD0FF', fs = 78, etiket = '' } = {}) => `<g transform="translate(-470 0)"><rect x="0" y="-62" width="8" height="${fs + 58}" rx="4" fill="${renk}"/>` +
  `<text class="mono" x="32" y="-30" font-size="28" letter-spacing="5" style="fill:${renk}">${kucuk}</text>` +
  `<text x="30" y="${fs - 14}" font-size="${fs}" font-weight="900" style="fill:#FFF6E6">${buyuk}</text>` +
  (etiket ? zamanChip(etiket, 850, -38, '#E8323C', '#FFFFFF', 19) : '') + `</g>`;
const tas = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-46 8 L-30 -34 L8 -48 L44 -26 L52 14 L24 44 L-22 40Z" fill="#8A8F9C"/><path d="M-30 -34 L8 -48 L44 -26 L10 -8Z" fill="#B4B9C6"/><path d="M-46 8 L-22 40 L24 44 L52 14 L10 -8Z" fill="#6A6F7C"/></g>`;
const arkadas = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="40" width="140" height="150" rx="50" fill="#3E8EDE"/><circle cx="0" cy="-10" r="58" fill="#F2C9A0"/><path d="M-60 -20 Q-50 -78 0 -74 Q50 -78 60 -20 Q30 -48 0 -44 Q-30 -48 -60 -20Z" fill="#2A2A33"/><rect x="-44" y="-18" width="38" height="20" rx="8" fill="#14171F"/><rect x="6" y="-18" width="38" height="20" rx="8" fill="#14171F"/><rect x="-8" y="-12" width="16" height="6" fill="#14171F"/><path d="M-22 26 Q0 42 22 26" stroke="#8A4A3A" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
"""
HEAD_SRC = open('_head.py').read().replace('window.GECIS = __GECIS__;', 'window.GECIS = __GECIS__; window.KLIP_N = __KLIPN__;')
exec(HEAD_SRC)
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
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__TP__", json.dumps(tp)).replace("__GECIS__", json.dumps(g)).replace("__KLIPN__", json.dumps(KLIPN)).replace("__JS__", S[i])
    if i == N: html = html.replace('<script src="../ortak/kanal.js"></script>', '')
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append(dict({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]}, **({"alt_kare": ALT[i]} if i in ALT else {})))
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
json.dump(sorted(tum, key=lambda r: r[1]), open("tepkiler.json", "w"), ensure_ascii=False)
print("sahneler yazıldı")
