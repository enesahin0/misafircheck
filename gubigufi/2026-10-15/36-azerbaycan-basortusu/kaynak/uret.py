"""#36 Azerbaycan'la aramızda ne oluyor? — bayrak fotoğrafı çatlar → okul kapısı → Gubi'ye soru (özgürlük) → Aliyev çıkışı → silah bombası → Ankara → Gufi umutlu; gerçek fotoğraflar (Wikimedia Commons) + flat çizim."""
import json, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 6.3, 15.05, 25.8, 33.15, 47.95, 51.5, 57.1, 60.2, 62.7]
ALT = {}
TEP = {
    1: [('gubi', 2.2, 'kafaKasi'), ('gufi', 5.3, 'sok')],
    2: [('gubi', 4.9, 'gozle'), ('gufi', 6.9, 'uzgun')],
    3: [('gubi', .4, 'dusun'), ('gubi', 3.0, 'aha'), ('gufi', 8.0, 'endise')],
    4: [('gubi', 3.0, 'sasir'), ('gufi', 6.0, 'titre')],
    5: [('gufi', .3, 'sok'), ('gubi', 4.6, 'evet'), ('gufi', 13.0, 'kafaKasi')],
    6: [('gubi', 1.3, 'kafaKasi'), ('gufi', 1.5, 'omuzSilk')],
    7: [('gufi', .2, 'goster'), ('gufi', 2.0, 'mutlu'), ('gubi', 3.6, 'gel')],
    8: [('gubi', .3, 'selam'), ('gufi', .5, 'selam')],
}
kontrol(TEP, SB)
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C;
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const bam = (t, a, d = .35) => { const q = A(t, a, a + d); return q > 0 && q < 1 ? `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${.35 * (1 - q)}"/>` : ''; };
const zeminK = (u = '#1A2340', a = '#0B1022') => AU.zemin(u, a);
const foto = (ad, x, y, w, hh, { k = 1, ox = 0, oy = 0, r = 28, op = 1, gri = 0 } = {}) => { const id = `f_${ad}_${Math.round(x)}_${Math.round(y)}`;
  return `<g opacity="${op}"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${r}"/></clipPath></defs>` + R(x + 10, y + 14, w, hh, r, '#000', .3) +
    `<g clip-path="url(#${id})"><g transform="translate(${x + w / 2 + ox} ${y + hh / 2 + oy}) scale(${k}) translate(${-(x + w / 2)} ${-(y + hh / 2)})"><image href="../ortak/img/${ad}.jpg" x="${x}" y="${y}" width="${w}" height="${hh}" preserveAspectRatio="xMidYMid slice" ${gri ? `style="filter:grayscale(${gri})"` : ''}/></g></g></g>`; };
const kredi = (s, x, y) => { const w = K.yaziGen(s, 17, { mono: true, ls: 1 }) + 24; return R(x, y - 20, w, 30, 15, '#0B1433', .7) + `<text class="mono" x="${x + 12}" y="${y}" font-size="17" letter-spacing="1" style="fill:#FFF3D6;opacity:.85">${s}</text>`; };
const trB = (x, y, w) => { const hh = w * 2 / 3, r = hh / 4; return `<g transform="translate(${x} ${y})">` + R(-w / 2, -hh / 2, w, hh, 6, '#E30A17') + `<circle cx="${-w * .14}" cy="0" r="${r}" fill="#FFFFFF"/><circle cx="${-w * .1}" cy="0" r="${r * .8}" fill="#E30A17"/>` + yildiz(w * .1, 0, r * .55, 5, '#FFFFFF') + '</g>'; };
const azB = (x, y, w) => { const hh = w / 2, s = hh / 3; return `<g transform="translate(${x} ${y})">` + R(-w / 2, -hh / 2, w, s, 0, '#00B5E2') + R(-w / 2, -hh / 2 + s, w, s, 0, '#EF3340') + R(-w / 2, -hh / 2 + 2 * s, w, s, 0, '#509E2F') + `<circle cx="${-w * .03}" cy="0" r="${s * .38}" fill="#FFFFFF"/><circle cx="${w * .0}" cy="0" r="${s * .31}" fill="#EF3340"/>` + yildiz(w * .07, 0, s * .2, 8, '#FFFFFF') + '</g>'; };
function yildiz(x, y, r, n, renk) { let d = ''; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * (n === 8 ? .55 : .42) : r; d += (i ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1); } return `<path d="${d}Z" fill="${renk}"/>`; }
const etiket = (s, x, y, renk = '#FFFFFF', yazi = '#E8323C', fs = 44, rot = -3, p = 1) => p <= 0 ? '' : grp(R(-(K.yaziGen(s, fs) + 70) / 2 + 8, -fs * .95 + 10, K.yaziGen(s, fs) + 70, fs * 1.9, 22, '#000', .35) + R(-(K.yaziGen(s, fs) + 70) / 2, -fs * .95, K.yaziGen(s, fs) + 70, fs * 1.9, 22, renk) + txt(s, 0, fs * .35, fs, yazi), x, y, p, rot);
const takipCip = (t, a, b) => { const p = pop(t, a) * (1 - A(t, b - .3, b)); return p > 0 ? grp(R(-250, -34, 500, 68, 34, '#0B1433', .85) + `<circle cx="-212" cy="0" r="20" fill="#E8323C"/><path d="M-221 0 h18 M-212 -9 v18" stroke="#FFF" stroke-width="5"/>` + `<text class="mono" x="20" y="9" font-size="24" text-anchor="middle" letter-spacing="2" style="fill:#FFF3D6">TAKİP ET · HER GÜN 1 MERAK</text>`, 540, 400, p) : ''; };
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
