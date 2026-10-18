"""#41 İlk yardım — yanında biri yere yığıldı. MOTION v2 + SES v2 (tamamı çizim)."""
import json, re, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 11.6, 20.2, 26.2, 31.5, 37.5, 44.0, 50.4, 53.9, 59.4, 65.4, 74.5, 78.5, 85.1, 92.2, 95.4, 99.8, 103.0, 105.2]
TEP = {
    1: [('gufi', 1.2, 'sasir'), ('gubi', 7.5, 'korku')],
    2: [('gubi', 3.4, 'gozle')],
    3: [('gufi', 3.5, 'goster')],
    4: [('gubi', 2.0, 'say')],
    5: [('gufi', 1.5, 'gozle')],
    6: [('gubi', 3.8, 'sasir')],
    7: [('gufi', 3.0, 'aha')],
    8: [('gubi', 1.5, 'goster')],
    9: [('gufi', 3.4, 'korku')],
    10: [('gubi', 3.0, 'say')],
    11: [('gufi', 5.0, 'goster')],
    12: [('gubi', 1.0, 'gozle')],
    13: [('gufi', 1.5, 'korku')],
    14: [('gubi', 5.8, 'aha')],
    15: [('gufi', 1.0, 'say')],
    16: [('gubi', 1.0, 'gel'), ('gufi', 1.6, 'goster')],
    17: [('gubi', .3, 'selam'), ('gufi', .5, 'selam')],
}
kontrol(TEP, SB)
# geçiş k → k+1: whip · odak · odak · push-through (araca dalış) · kes (iki gerçek klip) · odak · whip · odak · odak · kes · Gubi yıldızı → logo
GECIS = {1: {'tur': 'kayma'}, 2: {'tur': 'odak'}, 3: {'tur': 'odak'}, 4: {'tur': 'odak'}, 5: {'tur': 'kayma', 'yon': -1}, 6: {'tur': 'odak'}, 7: {'tur': 'odak'}, 8: {'tur': 'odak'},
         9: {'tur': 'itme', 'merkez': [540, 900]}, 10: {'tur': 'odak'}, 11: {'tur': 'kayma'}, 12: {'tur': 'odak'}, 13: {'tur': 'odak'}, 14: {'tur': 'odak'}, 15: {'tur': 'kayma', 'yon': -1},
         16: {'tur': 'odak'}, 17: {'tur': 'yildiz', 'renk': '#141112', 'merkez': [540, 900]}}
ALT = {1: 2, 5: 2, 11: 2, 15: 2}
v1 = open('../../../2026-10-16/37-dask-odemez/kaynak/uret.py').read()
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
KLIPN = {}
ORTAK += open("_ortak_deprem.js").read() + open("_ortak_ilk.js").read()
HEAD_SRC = open('_head.py').read().replace('window.GECIS = __GECIS__;', 'window.GECIS = __GECIS__; window.KLIP_N = __KLIPN__;')
exec(HEAD_SRC)
exec(open('_sahneler.py').read())
N = len(SB) - 1
for _k in range(1, N):
    if _k not in S: S[_k] = "MO.sahne({ zemin: MO.zemin(), ciz: t => '' });"
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


# ---- kapak (reels_kapak.jpg): kanal.js'siz tek kare; profil ızgarası 3:4 güvenli alan (y 240–1680) ----
KAPAK_JS = r"""
const logo = () => { const S = 140 / 233; let l = `<g transform="translate(540 1650) scale(${S}) translate(-141.5 -141.5)">`; for (const p of window.LOGO_PATHS) l += `<path transform="${p.t}" d="${p.d}" fill="${p.fill === '#231f20' ? '#FFF3E0' : p.fill}"/>`; return l + '</g>'; };
const gTxt = (s, x, y, size, renk) => txt(s, x + 6, y + 8, size, '#000', 900, 'opacity=".45"') + txt(s, x, y, size, renk);
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1424', alt: '#0A0710', isik: [540, 760, '#FF6B81', .30], ikinci: [900, 300, '#E8323C', .14] }),
  kamera: [[0, 1.0, 540, 960]], gren: .04,
  ciz: t => {
    let o = `<g transform="translate(540 430) rotate(-3)">` + R(-460 + 10, -80 + 14, 920, 160, 30, '#000', .4) + R(-460, -80, 920, 160, 30, '#E8323C') + `<rect x="-440" y="-64" width="880" height="128" rx="20" fill="none" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="5"/>` + txt('YANINDA BİRİ YIĞILDI', 0, 22, 62, '#FFFFFF') + `</g>`;
    o += gTxt('NE', 540, 690, 150, '#FFF3E0') + gTxt('YAPACAKSIN?', 540, 830, 140, '#FFD23F');
    o += R(-100, 1160, 1280, 400, 0, '#1A2238') + R(-100, 1160, 1280, 6, 0, '#2E3A5C');
    o += dur(300, 1160, 1.15, { renk: '#3E8EDE', goz: 'genis', agiz: 'acik' }) + yatan(840 - 160 * 1.15, 1160, 1.15, { renk: '#E8774A' });
    o += `<text x="520" y="1040" font-size="130" font-weight="900" text-anchor="middle" style="fill:#FFD23F" opacity=".95">?</text>`;
    const f = 'cvf'; o += `<defs><linearGradient id="${f}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(8,10,24,0)"/><stop offset="1" stop-color="#080A18"/></linearGradient></defs><rect x="0" y="1040" width="1080" height="300" fill="url(#${f})" opacity=".0"/><rect x="0" y="1338" width="1080" height="582" fill="#080A18"/>`;
    const ust = 'SAĞLIK & VÜCUT · İLK YARDIM'; o += `<rect x="${540 - (ust.length * 21 + 70) / 2}" y="1215" width="${ust.length * 21 + 70}" height="56" rx="28" fill="#FF6B81"/><text class="mono" x="540" y="1253" font-size="28" text-anchor="middle" letter-spacing="4" style="fill:#080A18">${ust}</text>`;
    o += gTxt('112 GELENE KADAR', 540, 1412, 96, '#FFF6E6') + gTxt('SEN BİLİYOR MUSUN?', 540, 1520, 84, '#FF6B81') + logo();
    return o;
  }
});"""
kapak = HEAD.replace("__SB__", "0").replace("__TP__", json.dumps({'gubi': [], 'gufi': []})).replace("__GECIS__", json.dumps({'gir': None, 'cik': None})).replace("__KLIPN__", "{}").replace("__JS__", ORTAK + KAPAK_JS).replace('<script src="../ortak/kanal.js"></script>', '')
open("sahneler/kapak.html", "w").write(kapak)
