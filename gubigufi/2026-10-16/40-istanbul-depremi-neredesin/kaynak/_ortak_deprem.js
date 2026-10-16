
// ===== #40 DEPREM — ortak çizim yardımcıları =====
const RK = { sakin: '#E8323C', yap: '#1F9E5B', mavi: '#3E8EDE', turuncu: '#FF8A4A', sari: '#FFD23F', koyu: '#0B1433', bej: '#FFF3D6' };
// insan: x,y = ayak tabanı ortası, boy ≈ 230*s. poz: dur | tut | kos | bas | cok.
// ANATOMİ: kollar iki parçalı (omuz→dirsek→el), toplam erişim SABİT (≈100 birim); hedef erişimin dışındaysa el hedefe UZANMAZ, yerinde kalır.
// elL/elR (yerel koordinat) ile el hedefi verilir; hedefe ulaşılamıyorsa kişiyi hedefe yaklaştır (sahne kodunda), kolu uzatma.
const ins = (x, y, s = 1, { renk = '#3E8EDE', poz = 'dur', yon = 1, ten = '#F2C9A0', sac = '#2A2A33', sal = 0, pant = '#2A3456', elL = null, elR = null } = {}) => {
  const P = {
    dur: { h: -95, sh: -160, hd: -200, l: [-40, -76], r: [40, -76], d: [[-14, -50, -14, 0], [14, -50, 14, 0]], r0: 0 },
    tut: { h: -95, sh: -160, hd: -200, l: [-40, -76], r: [44, -238], d: [[-14, -50, -14, 0], [14, -50, 14, 0]], r0: 0 },
    kos: { h: -95, sh: -158, hd: -198, l: [-54, -112], r: [56, -190], d: [[-30, -56, -40, 0], [30, -60, 40, -16]], r0: 14 },
    bas: { h: -95, sh: -160, hd: -200, l: [-22, -236], r: [22, -236], d: [[-14, -50, -14, 0], [14, -50, 14, 0]], r0: 0 },
    cok: { h: -58, sh: -106, hd: -146, l: [-24, -176], r: [24, -176], d: [[-34, -34, -26, 0], [34, -34, 26, 0]], r0: 5 },
  }[poz];
  const kol = (sx, sy, tx, ty, yan) => {
    const A = 52, B = 50; let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const mx = A + B - 2;
    if (d > mx) { dx *= mx / d; dy *= mx / d; d = mx; tx = sx + dx; ty = sy + dy; }
    if (d < 20) { d = 20; }
    const a = (A * A - B * B + d * d) / (2 * d), h = Math.sqrt(Math.max(0, A * A - a * a)), ux = dx / d, uy = dy / d;
    const c1 = [sx + ux * a - uy * h, sy + uy * a + ux * h], c2 = [sx + ux * a + uy * h, sy + uy * a - ux * h];
    const sk = c => c[1] * .6 + yan * c[0] * .5, e = sk(c1) > sk(c2) ? c1 : c2;
    return `<path d="M${sx} ${sy} L${e[0].toFixed(1)} ${e[1].toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)}" stroke="${renk}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="10" fill="${ten}"/>`;
  };
  let o = `<g transform="translate(${x} ${y}) scale(${yon * s} ${s}) rotate(${P.r0 + sal})">`;
  P.d.forEach(([kx, ky, fx, fy], i) => { const hx = i ? 12 : -12; o += `<path d="M${hx} ${P.h} L${kx} ${ky} L${fx} ${fy}" stroke="${pant}" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="${fx + (i ? 6 : -6)}" cy="${fy - 2}" rx="17" ry="8" fill="#14171F"/>`; });
  o += R(-30, P.sh, 60, P.h - P.sh + 8, 22, renk);
  const l = elL || P.l, r = elR || P.r;
  o += kol(-24, P.sh + 16, l[0], l[1], -1) + kol(24, P.sh + 16, r[0], r[1], 1);
  o += `<circle cx="0" cy="${P.hd}" r="30" fill="${ten}"/><path d="M-31 ${P.hd - 4} Q-28 ${P.hd - 34} 0 ${P.hd - 34} Q28 ${P.hd - 34} 31 ${P.hd - 4} Q14 ${P.hd - 18} -4 ${P.hd - 14} Q-18 ${P.hd - 12} -31 ${P.hd - 4}Z" fill="${sac}"/><circle cx="-10" cy="${P.hd + 2}" r="3.5" fill="#14171F"/><circle cx="10" cy="${P.hd + 2}" r="3.5" fill="#14171F"/>`;
  return o + '</g>';
};
// küçük ikonlar (merkez orijin, ≈170×130)
const ikon = (tur, x, y, s = 1) => {
  let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
  if (tur === 'vapur') o += `<path d="M-84 8 L84 8 L62 52 L-64 52Z" fill="#F4F6FA"/>` + R(-70, -34, 128, 42, 8, '#DDE3EE') + R(-12, -66, 30, 34, 6, '#E8323C') + R(-12, -70, 30, 8, 3, '#14171F') + [-56, -34, -12, 10, 32].map(a => R(a, -22, 14, 14, 4, '#3E8EDE')).join('') + `<path d="M-100 58 Q-76 44 -52 58 T-4 58 T44 58 T92 58" stroke="#3E8EDE" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  if (tur === 'metro') o += R(-70, -66, 140, 112, 24, '#2A3A6A') + R(-54, -48, 108, 44, 10, '#BFE0FF') + `<circle cx="0" cy="22" r="16" fill="#E8323C"/><text x="0" y="29" font-size="22" font-weight="900" text-anchor="middle" style="fill:#fff">M</text>` + R(-58, 26, 14, 10, 4, '#FFE9A8') + R(44, 26, 14, 10, 4, '#FFE9A8') + R(-96, 54, 192, 8, 3, '#8A94A8');
  if (tur === 'kopru') o += R(-64, -74, 12, 112, 4, '#C8D0DC') + R(52, -74, 12, 112, 4, '#C8D0DC') + R(-104, 12, 208, 12, 4, '#8A94A8') + `<path d="M-104 12 Q-76 -44 -58 -72 Q-22 -4 0 6 Q22 -4 58 -72 Q76 -44 104 12" stroke="#E8323C" stroke-width="6" fill="none"/>`;
  if (tur === 'sokak') o += R(-86, -50, 70, 104, 4, '#3A4A7A') + R(-4, -84, 80, 138, 4, '#2A3A6A') + [0, 1, 2].map(i => R(-72, -34 + i * 30, 16, 16, 3, '#FFE9A8') + R(10, -66 + i * 32, 16, 16, 3, '#FFE9A8') + R(40, -66 + i * 32, 16, 16, 3, '#FFE9A8')).join('') + R(-30, -20, 18, 12, 2, '#E8323C') + R(-24, 12, 12, 8, 2, '#E8323C');
  if (tur === 'ev') o += `<path d="M-84 -6 L0 -76 L84 -6Z" fill="#B8463A"/>` + R(-66, -6, 132, 62, 4, '#F4E8D8') + R(-14, 12, 28, 44, 4, '#7A4A2A') + R(-52, 8, 26, 24, 4, '#7FB0E0') + R(26, 8, 26, 24, 4, '#7FB0E0');
  return o + '</g>';
};
const panel = (w = 920, h = 640, renk = '#0F1838') => R(-w / 2 + 8, -h / 2 + 14, w, h, 36, '#000', .35) + R(-w / 2, -h / 2, w, h, 36, renk) + `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="36" fill="none" stroke="#FFFFFF" stroke-opacity=".10" stroke-width="3"/>`;
// "yer" başlığı: ikon + büyük yazı (merkez orijin)
const yerBas = (tur, ad, renk = '#FF8A4A', fs = 70) => { const w = K.yaziGen(ad, fs) + 210; return R(-w / 2 + 8, -62 + 12, w, 124, 62, '#000', .35) + R(-w / 2, -62, w, 124, 62, '#0B1433', .95) + `<rect x="${-w / 2}" y="-62" width="${w}" height="124" rx="62" fill="none" stroke="${renk}" stroke-width="5"/>` + ikon(tur, -w / 2 + 92, 4, .62) + txt(ad, 62, fs * .34, fs, '#FFF6E6'); };
// YAPMA / YAP bandı (merkez orijin). tur: 'x' | 'v'
const bant = (tur, s, fs = 54, w = 900) => { const kr = tur === 'x' ? RK.sakin : RK.yap; return R(-w / 2 + 8, -54 + 12, w, 108, 54, '#000', .35) + R(-w / 2, -54, w, 108, 54, kr) + `<circle cx="${-w / 2 + 62}" cy="0" r="34" fill="#FFFFFF"/>` + (tur === 'x' ? `<path d="M${-w / 2 + 50} -12 L${-w / 2 + 74} 12 M${-w / 2 + 74} -12 L${-w / 2 + 50} 12" stroke="${kr}" stroke-width="9" stroke-linecap="round"/>` : `<path d="M${-w / 2 + 47} 2 L${-w / 2 + 59} 14 L${-w / 2 + 79} -12" stroke="${kr}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`) + txt(s, 34, fs * .34, fs, '#FFFFFF'); };
// dalgalı su yüzeyi yolu: y seviyesi, genlik, uzunluk, faz → kapalı yol (aşağıya h kadar)
const suYol = (y, t, { amp = 14, uz = 170, hiz = 1.3, h = 700, x0 = -140, x1 = 1220 } = {}) => { let d = `M${x0} ${y + h} L${x0} ${y}`; for (let x = x0; x <= x1; x += 20) d += ` L${x} ${(y + amp * Math.sin((x / uz + t * hiz) * 2 * Math.PI / 2)).toFixed(1)}`; return d + ` L${x1} ${y + h}Z`; };
const halka = (cx, cy, r, op, renk = '#FF8A4A', kal = 8) => op <= 0 ? '' : `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${renk}" stroke-width="${kal}" opacity="${Math.min(1, op).toFixed(2)}"/>`;
// İstanbul silueti (sabit): kubbe + minareler + Galata + köprü kulesi + bloklar. y0 = zemin çizgisi
const istSil = (y0, renk = '#1B1630', pen = '#FFD27A', t = 0) => {
  let o = `<g>`;
  const blok = (x, w, h) => R(x, y0 - h, w, h + 60, 3, renk);
  [[-30, 90, 110], [60, 70, 150], [130, 80, 100], [210, 60, 130], [740, 70, 120], [810, 90, 170], [900, 70, 110], [970, 110, 140]].forEach(([x, w, h]) => o += blok(x, w, h));
  // kubbe
  o += `<path d="M300 ${y0} Q300 ${y0 - 120} 410 ${y0 - 124} Q520 ${y0 - 120} 520 ${y0}Z" fill="${renk}"/>` + R(290, y0 - 12, 240, 70, 3, renk);
  [[286, 220], [534, 220], [306, 180], [514, 180]].forEach(([x, h]) => o += R(x - 8, y0 - h, 16, h + 40, 4, renk) + `<path d="M${x - 11} ${y0 - h} L${x} ${y0 - h - 50} L${x + 11} ${y0 - h}Z" fill="${renk}"/>`);
  // Galata
  o += R(626, y0 - 230, 56, 250, 4, renk) + `<path d="M618 ${y0 - 230} L654 ${y0 - 300} L690 ${y0 - 230}Z" fill="${renk}"/>` + R(618, y0 - 236, 72, 14, 3, renk);
  // pencere ışıkları
  for (let i = 0; i < 26; i++) { const x = (i * 197) % 1000 + 20, h = 20 + (i * 53) % 90; if (Math.sin(t * 2 + i) > -.7) o += R(x, y0 - h, 7, 10, 2, pen, .55); }
  return o + '</g>';
};
const PK = (t, a, b, ic, y = 790, w = 920, h = 640) => MO.sar(panel(w, h) + ic, MO.oge(t, { gir: a, cik: b, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, y, { golge: false });
const BN = (t, a, b, tur, s, fs = 54, y = 1215) => MO.sar(bant(tur, s, fs), MO.oge(t, { gir: a, cik: b, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, y, { golge: false });
const yBas = (t, tur, ad, renk, a = .05, y = 400) => MO.sar(yerBas(tur, ad, renk, 50), MO.oge(t, { gir: a, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, y, { golge: false });
const hoparlor = (x, y, s, t, renk = '#FFD23F') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 -26 L10 -26 L60 -66 L60 66 L10 26 L-40 26Z" fill="${renk}"/>` + [0, 1, 2].map(i => { const q = (Math.sin(t * 7 - i * 1.1) + 1) / 2; return `<path d="M${84 + i * 30} -${24 + i * 14} Q${112 + i * 30} 0 ${84 + i * 30} ${24 + i * 14}" stroke="${renk}" stroke-width="9" fill="none" stroke-linecap="round" opacity="${(.35 + .65 * q).toFixed(2)}"/>`; }).join('') + `</g>`;
