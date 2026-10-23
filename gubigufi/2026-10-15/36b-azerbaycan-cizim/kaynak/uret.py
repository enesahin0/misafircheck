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

// ---- #36b çizim yardımcıları (fotoğraf yerine)
const dalgaBayrak = (x, y, w, h, t, ic, faz = 0) => { const id = `db${Math.round(x)}_${Math.round(y)}`; let d = `M${x} ${y}`; const n = 12;
  for (let i = 0; i <= n; i++) { const q = i / n; d += ` L${x + w * q} ${y + Math.sin(q * 5 + t * 3 + faz) * h * .05 * q}`; }
  for (let i = n; i >= 0; i--) { const q = i / n; d += ` L${x + w * q} ${y + h + Math.sin(q * 5 + t * 3 + faz + .4) * h * .05 * q}`; }
  let gl = ''; for (let i = 0; i < 4; i++) gl += `<rect x="${x + w * (.15 + i * .22)}" y="${y - h * .1}" width="${w * .08}" height="${h * 1.2}" fill="#000" opacity="${.08 + .05 * Math.sin(t * 3 + i)}"/>`;
  return `<defs><clipPath id="${id}"><path d="${d}Z"/></clipPath></defs><g clip-path="url(#${id})">${ic}${gl}</g>`; };
const alevKule = (x, y, s, renk) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-40 0 L40 0 L36 -180 Q30 -300 0 -340 Q-34 -300 -38 -180Z" fill="${renk}"/>` + `<g transform="translate(${x} ${y}) scale(${s})" opacity=".35">${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M-36 ${-30 - i * 42} L36 ${-30 - i * 42}" stroke="#FFB347" stroke-width="3"/>`).join('')}</g>`;
function bakuBalkon(t) {
  let o = `<defs><linearGradient id="gk1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5A65B"/><stop offset=".55" stop-color="#F7C98B"/><stop offset="1" stop-color="#9CC0E0"/></linearGradient></defs><rect x="0" y="300" width="1080" height="1000" fill="url(#gk1)"/>`;
  o += alevKule(200, 760, 1.0, '#6A4A6A') + alevKule(300, 760, .82, '#7A5A78') + alevKule(390, 760, .66, '#8A6A86');
  for (let i = 0; i < 9; i++) o += R(i * 130 - 20, 640 + (i % 3) * 30, 120, 200, 4, '#C8A890', .55);
  // eski Bakü binası: taş cephe + ahşap pencere + balkon
  o += R(470, 380, 560, 900, 0, '#E8D2B0') + R(470, 380, 560, 30, 0, '#5A6A7A');
  for (let r = 0; r < 9; r++) o += `<path d="M470 ${440 + r * 90} H1030" stroke="#D4BC98" stroke-width="3"/>`;
  o += R(600, 470, 300, 330, 10, '#7A4A2A') + R(616, 486, 130, 140, 6, '#5A7AA8') + R(754, 486, 130, 140, 6, '#5A7AA8') + R(616, 636, 130, 150, 6, '#5A7AA8') + R(754, 636, 130, 150, 6, '#5A7AA8');
  o += R(616, 486, 130, 40, 0, '#FFFFFF', .15) + R(754, 486, 130, 40, 0, '#FFFFFF', .15);
  o += R(540, 820, 430, 26, 6, '#4A3A30') + R(540, 1000, 430, 40, 4, '#5A4A3A') + R(530, 1040, 450, 30, 4, '#3A2E26');
  for (let i = 0; i < 10; i++) o += R(556 + i * 44, 846, 8, 154, 3, '#3A2E26');
  // balkondan sarkan iki bayrak (yan yana)
  o += dalgaBayrak(560, 846, 200, 135, t, trB(660, 913, 200), 0) + dalgaBayrak(770, 846, 200, 135, t, azB(870, 913, 200).replace('translate(870 913)', 'translate(870 913) scale(1 1.35)'), 1.3);
  o += `<path d="M0 1080 L470 1080 L470 1300 L0 1300Z" fill="#B89878"/>`;
  return o;
}
function tb2(x, y, s = 1) {  // Bayraktar TB2 yandan: ince gövde, ters V kuyruk, arkada pervane, burun altı kamera topu, üç teker
  return `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path d="M-330 -40 Q-350 -60 -310 -70 L180 -78 Q230 -78 250 -70 L300 -64 L300 -54 L240 -48 L-300 -36Z" fill="#E8ECF0"/>` +
    `<path d="M-300 -40 L240 -50 L240 -44 L-300 -36Z" fill="#B8C0CC"/>` +
    `<path d="M150 -76 L250 -150 L275 -150 L210 -74Z" fill="#D8DEE6"/><path d="M180 -60 L250 -6 L268 -6 L215 -58Z" fill="#C8D0DA"/>` +
    `<rect x="236" y="-140" width="22" height="16" fill="#E30A17"/><circle cx="244" cy="-132" r="5" fill="#FFFFFF"/>` +
    `<path d="M-60 -74 L120 -74 L130 -68 L-70 -66Z" fill="#9AA4B2"/>` +
    `<ellipse cx="305" cy="-59" rx="6" ry="40" fill="#5A6070" opacity=".75"/>` +
    `<circle cx="-270" cy="-28" r="16" fill="#3A3F50"/><circle cx="-274" cy="-30" r="6" fill="#6A7AA0"/>` +
    `<path d="M-240 -38 L-240 0 M60 -48 L50 0 M90 -48 L100 0" stroke="#4A4F60" stroke-width="7"/>` +
    `<circle cx="-240" cy="4" r="12" fill="#1A1A22"/><circle cx="50" cy="4" r="14" fill="#1A1A22"/><circle cx="100" cy="4" r="14" fill="#1A1A22"/>` +
    `<text x="-120" y="-50" font-size="18" font-weight="900" style="fill:#5A6478">BAYRAKTAR</text></g>`;
}
function pist(t) {
  let o = `<defs><linearGradient id="gk5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB8E0"/><stop offset="1" stop-color="#DCE8F2"/></linearGradient></defs><rect x="0" y="480" width="1080" height="480" fill="url(#gk5)"/>`;
  for (let i = 0; i < 12; i++) o += `<ellipse cx="${i * 100 - 20}" cy="${775 - (i % 3) * 8}" rx="70" ry="${30 + (i % 4) * 8}" fill="#5A7A4A" opacity=".8"/>`;
  o += R(0, 790, 1080, 200, 0, '#8A929C') + R(0, 790, 1080, 6, 0, '#C8CED6');
  for (let i = 0; i < 8; i++) o += R(i * 160 - ((t * 0) % 160), 860, 90, 10, 3, '#FFFFFF', .85);
  o += `<ellipse cx="520" cy="852" rx="330" ry="14" fill="#000" opacity=".22"/>` + tb2(520, 845, 1.0);
  return o;
}
function tokalasma(t) {  // bayraklar önünde iki lider (Aliyev solda, Erdoğan sağda) + el sıkışma
  let o = `<rect x="0" y="440" width="1080" height="700" fill="#2A3A5A"/>` + R(0, 440, 1080, 380, 0, '#3A4E72');
  o += R(160, 470, 10, 420, 4, '#C8B080') + dalgaBayrak(170, 480, 220, 150, t, azB(280, 555, 220).replace('translate(280 555)', 'translate(280 555) scale(1 1.36)'), 0);
  o += R(910, 470, 10, 420, 4, '#C8B080') + `<g transform="translate(1830 0) scale(-1 1)">` + dalgaBayrak(920, 480, 220, 150, t, `<g transform="translate(2060 0) scale(-1 1)">${trB(1030, 555, 225)}</g>`, 1) + '</g>';
  o += R(0, 1000, 1080, 140, 0, '#1E2A40');
  o += KS.kisi({ x: 370, y: 1080, boy: 470, ten: 'acik', sac: { tip: 'geriTarali', renk: '#4A4642' }, biyik: { renk: '#3E3A36', tip: 'kalin' }, kiyafet: { renk: '#1E2230', yaka: 'ceket', gomlek: '#FFFFFF' }, kravat: '#23395B', yas: 1, ifade: 'gulumse', bak: [.4, 0] });
  o += KS.kisi({ x: 720, y: 1080, boy: 500, ten: 'acik', sac: { tip: 'kisaYan', renk: '#C8C4BC' }, biyik: { renk: '#B0ABA2', tip: 'kalin' }, kiyafet: { renk: '#2A2E3A', yaka: 'ceket', gomlek: '#FFFFFF' }, kravat: '#4A2A3A', yas: 2, ifade: 'gulumse', bak: [-.4, 0] });
  // el sıkışma (ön planda): iki ceket kolu + beyaz manşet + kenetlenmiş eller
  const sal = Math.sin(t * 6) * 4;
  o += `<g transform="translate(0 ${sal})"><path d="M330 1060 Q420 1000 500 990 L510 1030 Q430 1040 360 1090Z" fill="#1E2230"/><path d="M760 1060 Q660 1000 580 990 L570 1030 Q650 1040 730 1090Z" fill="#2A2E3A"/>` +
    `<rect x="490" y="984" width="22" height="50" rx="6" fill="#FFFFFF" transform="rotate(-12 500 1008)"/><rect x="568" y="984" width="22" height="50" rx="6" fill="#FFFFFF" transform="rotate(12 580 1008)"/>` +
    `<path d="M505 990 Q540 970 575 990 Q585 1012 570 1030 Q540 1044 510 1030 Q496 1012 505 990Z" fill="#F2C9A6"/><path d="M520 996 Q545 990 565 1000 M518 1010 Q545 1004 568 1014 M520 1024 Q544 1020 562 1026" stroke="#D9A580" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
  return o;
}
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
