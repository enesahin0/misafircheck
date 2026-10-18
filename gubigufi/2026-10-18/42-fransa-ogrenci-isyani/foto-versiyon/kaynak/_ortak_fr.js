
// ===== #42 FRANSA — ortak çizim yardımcıları (hepsi t'nin saf fonksiyonu; rastgelelik tohumlu) =====
const hh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const clmp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
// alev: (x,y) alt orta, w genişlik, h yükseklik, k 0..1 şiddet. Katmanlı turuncu-sarı-çekirdek + kıvılcım + hale
const alev = (x, y, w, h, t, sd = 1, k = 1) => {
  if (k <= .01) return '';
  let o = `<circle cx="${F1(x)}" cy="${F1(y - h * k * .35)}" r="${F1(w * .95)}" fill="#FF6A1F" opacity="${(.16 * k).toFixed(2)}"/>`;
  const n = Math.max(2, Math.round(w / 40));
  for (let i = 0; i < n; i++) {
    const cx = x - w / 2 + (i + .5) * w / n + Math.sin(t * 3 + i * 2 + sd) * 4, fw = w / n * 1.2;
    const fh = h * k * (.6 + .4 * hh(i * 7 + sd)) * (1 + .12 * Math.sin(t * 9 + i * 1.7 + sd)), tp = Math.sin(t * 7 + i + sd) * fw * .22;
    [[1, '#FF5A1A'], [.7, '#FF9B2E'], [.4, '#FFE27A']].forEach(([s, c]) => {
      const a = fw * s, b = fh * s;
      o += `<path d="M${F1(cx - a / 2)} ${F1(y)} C${F1(cx - a / 2)} ${F1(y - b * .45)} ${F1(cx - a * .18 + tp * .4)} ${F1(y - b * .62)} ${F1(cx + tp * s)} ${F1(y - b)} C${F1(cx + a * .2 + tp * .4)} ${F1(y - b * .6)} ${F1(cx + a / 2)} ${F1(y - b * .42)} ${F1(cx + a / 2)} ${F1(y)}Z" fill="${c}"/>`;
    });
  }
  for (let j = 0; j < 6; j++) { const q = (t * .7 + hh(j + sd * 3)) % 1, px = x + (hh(j * 3 + sd) - .5) * w * 1.1 + Math.sin(t * 4 + j) * 10, py = y - h * k * (.3 + q * 1.15);
    o += `<circle cx="${F1(px)}" cy="${F1(py)}" r="${F1(3.6 * (1 - q) + .6)}" fill="#FFD27A" opacity="${(1 - q).toFixed(2)}"/>`; }
  return o;
};
// duman: yükselen gri toplar
const duman = (x, y, w, t, sd = 1, k = 1, renk = '#59627A') => { let o = '';
  for (let i = 0; i < 7; i++) { const q = (t * .22 + hh(i + sd)) % 1, px = x + (hh(i * 5 + sd) - .5) * w + Math.sin(t * .8 + i) * 22 * q, py = y - q * 520, r = 40 + 120 * q;
    o += `<circle cx="${F1(px)}" cy="${F1(py)}" r="${F1(r)}" fill="${renk}" opacity="${(.34 * k * Math.sin(Math.PI * q)).toFixed(2)}"/>`; }
  return o; };
// okul cephesi (gece). yan: 0..1 yangın / is. Pencere sayisi sabit; kapı altta ortada.
const okul = (cx, yb, w, h, t, yan = 0, ad = 'LYCÉE') => {
  const x0 = cx - w / 2, pw = w / 9, ph = h * .14; let o = '';
  o += R(x0, yb - h, w, h, 6, gsh('#2C3558', -.22 * yan)) + R(x0 - 18, yb - h - 24, w + 36, 30, 8, '#1C2340');
  o += `<path d="M${F1(x0 - 18)} ${F1(yb - h - 24)} L${F1(cx)} ${F1(yb - h - 120)} L${F1(x0 + w + 18)} ${F1(yb - h - 24)}Z" fill="#1C2340"/>`;
  o += R(cx - 105, yb - h - 74, 210, 44, 10, '#EDE4D2') + txt(ad, cx, yb - h - 41, 30, '#1C2340');
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const wx = x0 + pw * .7 + c * pw * 1.35 - (c > 2 ? 0 : 0), wy = yb - h + 40 + r * (ph + 30);
    if (c === 2 && r === 2 || c === 3 && r === 2) continue;
    const lit = hh(r * 6 + c + 3) > .4 ? .9 : .25, fl = clmp(yan * 1.6 - hh(r * 6 + c) * .8);
    o += R(wx, wy, pw * .95, ph, 6, '#0F1428') + R(wx + 4, wy + 4, pw * .95 - 8, ph - 8, 4, `#FFD27A`, (lit * (1 - yan * .6)).toFixed(2));
    if (fl > .02) o += alev(wx + pw * .47, wy + ph + 8, pw * 1.05, ph * 2.2, t, r * 6 + c, fl); }
  o += R(cx - 70, yb - 190, 140, 190, 8, '#0F1428') + R(cx - 6, yb - 190, 12, 190, 0, '#1C2340');
  const kf = clmp(yan * 2.2 - .9); if (kf > .02) o += alev(cx, yb - 4, 150, 230, t, 11, kf);
  o += `<g transform="translate(${F1(x0 + 40)} ${F1(yb - h - 40)})"><rect x="-3" y="-80" width="6" height="140" fill="#8A94A8"/>` + [['#2A4FA8', 0], ['#F4F4F4', 26], ['#E8323C', 52]].map(([c, d]) => `<rect x="${3 + d + Math.sin(t * 5 + d) * 2}" y="-80" width="26" height="50" fill="${c}"/>`).join('') + `</g>`;
  if (yan > .3) o += `<rect x="${F1(x0)}" y="${F1(yb - h)}" width="${F1(w)}" height="${F1(h)}" fill="#000" opacity="${(.28 * yan).toFixed(2)}"/>`;
  return o; };
// kalabalık siluetleri (alt kenar): x orta, yb taban, w genişlik, n kişi, yumruk k 0..1 (kolu kaldıran oranı)
const kalab = (x, yb, w, n, t, renk = '#070A14', yumruk = 0, boyk = 1) => { let o = '';
  for (let i = 0; i < n; i++) { const px = x - w / 2 + (i + .5 + (hh(i * 3) - .5) * .6) * w / n, sc = (.85 + .4 * hh(i * 9 + 1)) * boyk, hy = yb - 200 * sc + Math.sin(t * 2.2 + i) * 4;
    o += `<g transform="translate(${F1(px)} ${F1(hy)}) scale(${sc.toFixed(2)})"><circle cx="0" cy="0" r="26" fill="${renk}"/><path d="M-46 210 Q-46 40 0 32 Q46 40 46 210Z" fill="${renk}"/>`;
    if (hh(i * 4 + 2) < yumruk) { const ar = Math.sin(t * 5 + i * 2) * 8; o += `<path d="M30 70 L${F1(54 + ar)} -40" stroke="${renk}" stroke-width="22" stroke-linecap="round"/><circle cx="${F1(54 + ar)}" cy="-52" r="15" fill="${renk}"/>`; }
    o += `</g>`; }
  return o; };
// öğrenci ikonu (üstten sınıf): masa + kafa
const ogr = (x, y, s, i, k = 1) => { if (k <= .01) return ''; const sk = ['#F2C9A0', '#E8B88C', '#C98E5C', '#8A5A3A'][Math.floor(hh(i * 5 + 1) * 4)], sc = ['#2A2A33', '#5A3A24', '#C79A3C', '#1B1B22'][Math.floor(hh(i * 7 + 2) * 4)], cl = ['#3E8EDE', '#E8774A', '#2FBF71', '#9B6FE0', '#FFD23F'][Math.floor(hh(i * 3 + 4) * 5)];
  return `<g transform="translate(${F1(x)} ${F1(y)}) scale(${(s * ob(k)).toFixed(3)})"><rect x="-24" y="2" width="48" height="24" rx="5" fill="#C99A63"/><rect x="-24" y="2" width="48" height="6" rx="3" fill="#E1B77F"/><path d="M-17 4 Q-17 -14 0 -14 Q17 -14 17 4Z" fill="${cl}"/><circle cx="0" cy="-20" r="11" fill="${sk}"/><path d="M-11 -22 Q-11 -33 0 -33 Q11 -33 11 -22 Q4 -27 -11 -22Z" fill="${sc}"/></g>`; };
// dolmuş (yandan): dolu 0..18 koltuk noktası
const dolmus = (x, y, s, dolu = 0) => { let o = `<g transform="translate(${F1(x)} ${F1(y)}) scale(${s})">`;
  o += R(-170, -120, 340, 100, 22, '#F4F6FA') + R(-170, -48, 340, 28, 8, '#FFD23F') + `<path d="M118 -120 H150 Q170 -120 170 -96 V-70 H118Z" fill="#F4F6FA"/>`;
  for (let i = 0; i < 6; i++) o += R(-150 + i * 46, -108, 38, 40, 6, '#1B2A55');
  o += R(-150, -122, 300, 12, 4, '#E8323C') + `<circle cx="-100" cy="-8" r="26" fill="#14171F"/><circle cx="100" cy="-8" r="26" fill="#14171F"/><circle cx="-100" cy="-8" r="11" fill="#8A94A8"/><circle cx="100" cy="-8" r="11" fill="#8A94A8"/>`;
  for (let i = 0; i < 18; i++) { const k = clmp(dolu - i); if (k > 0) o += `<circle cx="${F1(-140 + (i % 6) * 46 + 19)}" cy="${F1(-88 + Math.floor(i / 6) * 0 + (i % 2) * 6)}" r="${F1(8 * ob(k))}" fill="${['#FFD23F', '#FF8A4A', '#7FD0FF'][i % 3]}"/>`; }
  return o + '</g>'; };
// termometre: deg 20..45
const termo = (x, y, s, deg) => { const f = clmp((deg - 20) / 25), h = 360;
  let o = `<g transform="translate(${F1(x)} ${F1(y)}) scale(${s})">` + R(-26, -h, 52, h, 26, '#E7EBF2') + `<circle cx="0" cy="22" r="46" fill="#E7EBF2"/>` + R(-14, -h + 20, 28, h - 20, 14, '#3A1A1A') + `<circle cx="0" cy="22" r="34" fill="#E8323C"/>` + R(-14, -h * f - 4 + 20 * (1 - f) , 28, h * f + 4, 14, '#E8323C');
  for (let d = 20; d <= 45; d += 5) o += `<path d="M30 ${F1(-h * (d - 20) / 25)} h22" stroke="#C8D0DC" stroke-width="4"/><text x="64" y="${F1(-h * (d - 20) / 25 + 8)}" font-size="26" font-weight="800" style="fill:#C8D0DC">${d}</text>`;
  return o + '</g>'; };
const firin = (x, y, s, t, isi = 1) => `<g transform="translate(${F1(x)} ${F1(y)}) scale(${s})">` + R(-120, -150, 240, 190, 20, '#6A7080') + R(-120, -150, 240, 36, 16, '#4A5060') + [-70, -30, 10, 50].map(a => `<circle cx="${a}" cy="-132" r="9" fill="#C8D0DC"/>`).join('') + R(-96, -100, 192, 118, 14, '#1A1218') + R(-86, -90, 172, 98, 10, `rgb(${Math.round(120 + 135 * isi)},${Math.round(40 + 30 * isi)},20)`) + [0, 1, 2].map(i => `<path d="M${-60 + i * 60} 30 q-14 -30 0 -60 q14 -30 0 -56" stroke="#FF9B2E" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(.5 * isi).toFixed(2)}" transform="translate(0 ${F1(-Math.sin(t * 4 + i) * 6)})"/>`).join('') + `</g>`;
const prefab = (x, y, s, t) => `<g transform="translate(${F1(x)} ${F1(y)}) scale(${s})">` + R(-230, -200, 460, 200, 10, '#B8BFCC') + R(-230, -214, 460, 22, 6, '#8A94A8') + [-170, -60, 50, 150].map(a => R(a, -160, 70, 70, 6, '#7FB0E0')).join('') + R(170, -150, 50, 150, 6, '#6A7080') + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${-210 + i * 80} -230 q10 -20 0 -40" stroke="#FFB84A" stroke-width="6" fill="none" stroke-linecap="round" opacity="${(.4 + .4 * Math.sin(t * 5 + i)).toFixed(2)}"/>`).join('') + `</g>`;
const gunes = (x, y, r, t) => `<g transform="translate(${F1(x)} ${F1(y)})">` + Array.from({ length: 12 }, (_, i) => `<line x1="${F1(Math.cos(i * Math.PI / 6 + t * .3) * r * 1.25)}" y1="${F1(Math.sin(i * Math.PI / 6 + t * .3) * r * 1.25)}" x2="${F1(Math.cos(i * Math.PI / 6 + t * .3) * r * 1.65)}" y2="${F1(Math.sin(i * Math.PI / 6 + t * .3) * r * 1.65)}" stroke="#FFD23F" stroke-width="10" stroke-linecap="round"/>`).join('') + `<circle r="${r}" fill="#FFD23F"/><circle r="${r * .8}" fill="#FFE27A"/></g>`;
// küçük okul ikonu (grid için): k 0..1 yanma
const okulK = (x, y, s, k, t, sd) => `<g transform="translate(${F1(x)} ${F1(y)}) scale(${s})">` + R(-60, -70, 120, 70, 6, gsh('#3A4470', -.4 * k)) + `<path d="M-72 -70 L0 -122 L72 -70Z" fill="${k > .5 ? '#2A1A20' : '#2A3156'}"/>` + R(-12, -40, 24, 40, 4, '#0F1428') + [-40, 28].map(a => R(a, -58, 22, 20, 3, k > .5 ? '#FF9B2E' : '#FFD27A')).join('') + (k > .02 ? alev(0, -66, 100, 110, t, sd, k) : '') + `</g>`;
const barikat = (x, y, s, p) => { let o = `<g transform="translate(${F1(x)} ${F1(y)}) scale(${s})">`;
  const parca = [
    [() => R(-190, -70, 120, 70, 8, '#2E6F4E') + R(-190, -78, 120, 14, 6, '#245A3E'), 0],                                 // çöp konteyneri
    [() => R(-60, -90, 150, 90, 6, '#B98A55') + R(-60, -90, 150, 12, 4, '#D4A672'), .14],                                 // masa
    [() => R(110, -80, 90, 80, 6, '#4A6FB5') + R(110, -80, 90, 12, 4, '#6F8FD0'), .28],
    [() => `<g transform="rotate(-8 -110 -120)">` + R(-170, -150, 110, 70, 8, '#C98E3C') + `</g>`, .42],
    [() => R(-20, -170, 130, 82, 6, '#8A5A3A') + R(-20, -170, 130, 12, 4, '#A87550'), .56],
    [() => `<g transform="rotate(12 130 -150)">` + R(70, -190, 100, 76, 6, '#B33A3A') + `</g>`, .7],
    [() => R(-150, -228, 120, 70, 8, '#E8E1D0') + R(-150, -236, 120, 12, 6, '#C8BEA6'), .84]];
  parca.forEach(([f, a]) => { const k = clmp((p - a) / .16); if (k > 0) o += `<g transform="translate(0 ${F1((1 - ob(k)) * -160)})" opacity="${Math.min(1, k * 3).toFixed(2)}">${f()}</g>`; });
  return o + '</g>'; };
const zarfOy = (x, y, s, p) => `<g transform="translate(${F1(x)} ${F1(y)}) scale(${s})">` + R(-120, -90, 240, 190, 16, '#C8323C') + R(-120, -90, 240, 36, 12, '#A02630') + R(-72, -66, 144, 12, 6, '#1A0F14') + `<g transform="translate(0 ${F1(-150 + 150 * clmp(p))})" opacity="${(clmp(p * 3) * (1 - clmp((p - .9) * 10))).toFixed(2)}">` + R(-54, -54, 108, 76, 8, '#F4F6FA') + `<path d="M-54 -54 L0 -14 L54 -54" stroke="#C8D0DC" stroke-width="4" fill="none"/></g>` + txt('SEÇİM', 0, 74, 38, '#FFFFFF') + `</g>`;
const teraziF = (x, y, sc, aci, solIc = '', sagIc = '') => { const a = aci * Math.PI / 180, L = 230, lx = -Math.cos(a) * L, ly = -Math.sin(a) * L, rx = Math.cos(a) * L, ry = Math.sin(a) * L;
  const kefe = (px, py, ic, renk) => `<g transform="translate(${F1(px)} ${F1(py)}) rotate(${F1(-aci * .0)})"><path d="M0 0 L-90 110 M0 0 L90 110" stroke="#C8D0DC" stroke-width="5"/>` + R(-110, 106, 220, 22, 11, renk) + `<g transform="translate(0 100)">${ic}</g></g>`;
  return `<g transform="translate(${F1(x)} ${F1(y)}) scale(${sc})">` + R(-12, -10, 24, 330, 8, '#8A94A8') + R(-120, 310, 240, 26, 12, '#6A7080') + `<path d="M${F1(lx)} ${F1(ly)} L${F1(rx)} ${F1(ry)}" stroke="#E7EBF2" stroke-width="16" stroke-linecap="round"/><circle cx="0" cy="0" r="24" fill="#FFD23F"/>` + kefe(lx, ly, solIc, '#3E8EDE') + kefe(rx, ry, sagIc, '#E8774A') + `</g>`; };
// sandık oyu / takvim
const takvim = (x, y, w, t0, t) => { const ay = ['KASIM', 'ARALIK', 'OCAK', 'ŞUBAT', 'MART', 'NİSAN']; let o = '';
  ay.forEach((a, i) => { const k = clmp((t - t0 - i * .22) / .3), cw = (w - 5 * 16) / 6, cx = x - w / 2 + i * (cw + 16);
    o += `<g transform="translate(${F1(cx)} ${F1(y)}) scale(1 ${ob(k).toFixed(3)})" opacity="${Math.min(1, k * 2).toFixed(2)}">` + R(0, -120, cw, 120, 14, i === 5 ? '#E8323C' : '#16204A') + R(0, -120, cw, 34, 14, i === 5 ? '#B02430' : '#2A3A6A') + `<text x="${F1(cw / 2)}" y="-94" font-size="20" font-weight="900" text-anchor="middle" style="fill:#FFF6E6">${a}</text><text x="${F1(cw / 2)}" y="-36" font-size="46" font-weight="900" text-anchor="middle" style="fill:${i === 5 ? '#FFFFFF' : '#7FD0FF'}">${i + 1}</text></g>`; });
  return o; };
// maskot + kısa balon (köşeler)
const MF = (t, o = {}) => gubi(t, { x: 880, y: 1650, boy: o.gb || 150, duygu: o.gd || 'merak', bakHedef: o.bh || [540, 800], isaretHedef: o.ih || null, ust: o.gu || '' })
  + gufi(t, { x: 200, y: 1840, boy: o.gfb || 210, duygu: o.gf || 'merak', bakHedef: o.bh || [540, 800], ust: o.fu || '' })
  + (o.b || []).map(([k, a, b, m]) => bm(t, a, b, k === 'gubi' ? 720 : 360, 1492, m, { yon: k === 'gubi' ? 1 : -1 })).join('');
// ---------------- GERÇEK FOTOĞRAFLAR (Wikimedia Commons; yazar + lisans ekranda) ----------------
const PH = {
  grenoble: [3024, 4032, 'David Monniaux', 'CC BY-SA 4.0', 'GRENOBLE · 30 EYLÜL'],
  paris_yangin: [3840, 2560, 'Jorge Jaramillo', 'CC BY-SA 4.0', 'PARİS · 17 EKİM'],
  paris_17: [3840, 2560, 'FreCha', 'CC BY-SA 4.0', 'PARİS · 17 EKİM'],
  paris_6: [3840, 2560, 'FreCha', 'CC BY-SA 4.0', 'PARİS · 6 EKİM'],
  rennes: [3840, 2880, 'Procrastineur49', 'CC BY 4.0', 'RENNES · 5 EKİM'],
  perp_afis: [2400, 1352, 'Aurelio Cárdenas', 'CC BY 4.0', 'PERPIGNAN · 2 EKİM'],
  perp_polis: [3840, 2163, 'Aurelio Cárdenas', 'CC BY 4.0', 'PERPIGNAN · 2 EKİM'],
  bayonne: [1200, 726, 'Patxi Beltzaitz / Berria', 'CC BY-SA 4.0', 'BAYONNE · 6 EKİM'],
  mai68: [1856, 1874, 'Tangopaso', 'kamu malı', 'BORDEAUX · MAYIS 1968']
};
const fkIm = ad => MO.yukle(`../ortak/img/${ad}.jpg`);
const fkKredi = (ad, x, y) => { const p = PH[ad], s = 'FOTO: ' + p[2] + ' · ' + p[3], w = K.yaziGen(s, 19, { mono: true, ls: 1 }) + 26;
  return R(x, y - 24, w, 36, 18, '#0B1433', .72) + `<text class="mono" x="${x + 13}" y="${y}" font-size="19" letter-spacing="1" style="fill:#FFF3D6;opacity:.9">${s}</text>`; };
const fkYer = (ad, x, y) => { const s = PH[ad][4], fs = 26, w = K.yaziGen(s, fs, { mono: true, ls: 2 }) + fs * 1.6;
  return R(x, y - fs, w, fs * 1.9, fs * .95, '#E8323C', .95) + `<text class="mono" x="${x + w / 2}" y="${y + fs * .34}" font-size="${fs}" text-anchor="middle" letter-spacing="2" style="fill:#FFFFFF">${s}</text>`; };
// tam ekran fotoğraf, Ken Burns: f0→f1 odak (görüntü oranı), z0→z1 yakınlık
const fotoT = (t, ad, a, b, { f0 = [.5, .5], f1 = [.5, .5], z = [1, 1.1], fi = .3, fo = .3, kredi = true, yer = true, kar = .22 } = {}) => {
  const g = (fi > 0 ? fd(t, a, a + fi) : 1) * (fo > 0 ? 1 - fd(t, b - fo, b) : 1); if (g <= .003 || t < a || t > b + .01) return '';
  const [pw, ph] = PH[ad], p = clmp((t - a) / (b - a)), pe = p * p * (3 - 2 * p), zz = z[0] + (z[1] - z[0]) * pe;
  const s = Math.max(1080 / pw, 1920 / ph) * zz, dw = pw * s, dh = ph * s;
  const fx = f0[0] + (f1[0] - f0[0]) * pe, fy = f0[1] + (f1[1] - f0[1]) * pe;
  const x0 = clmp(540 - fx * dw, 1080 - dw, 0), y0 = clmp(960 - fy * dh, 1920 - dh, 0);
  let o = `<g opacity="${g.toFixed(3)}"><image href="${fkIm(ad)}" x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${dw.toFixed(1)}" height="${dh.toFixed(1)}"/>`;
  o += scrim(-200, 520, .75, 0) + scrim(1000, 1960, 0, .86);
  if (kar > 0) o += `<rect width="1080" height="1920" fill="#05070F" opacity="${kar}"/>`;
  if (yer) o += fkYer(ad, 62, 372);
  if (kredi) o += fkKredi(ad, 62, 1258);
  return o + '</g>';
};
// fotoğraf kartı (çerçeveli; küçük çözünürlüklü fotoğraflar için yakınlaştırmasız), arkada aynı fotoğrafın bulanığı
const fotoK = (t, ad, a, b, { y = 830, w = 1010, hmax = 900, z = [1, 1], kay = [0, 0], fi = .3, fo = .3, bg = true, yer = true, kredi = true } = {}) => {
  const g = (fi > 0 ? fd(t, a, a + fi) : 1) * (fo > 0 ? 1 - fd(t, b - fo, b) : 1); if (g <= .003 || t < a || t > b + .01) return '';
  const [pw, ph] = PH[ad]; let h = w * ph / pw, ww = w; if (h > hmax) { h = hmax; ww = h * pw / ph; }
  const p = clmp((t - a) / (b - a)), zz = z[0] + (z[1] - z[0]) * p, pop = .965 + .035 * ob(fd(t, a, a + .5));
  const X = 540 - ww / 2, Y = y - h / 2, id = 'fk' + ad + Math.round(a * 10), u = fkIm(ad);
  let o = `<g opacity="${g.toFixed(3)}">`;
  if (bg) o += `<defs><filter id="fkB" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="34"/></filter></defs><image href="${u}" x="-260" y="-60" width="1600" height="2040" preserveAspectRatio="xMidYMid slice" filter="url(#fkB)" opacity=".5"/><rect width="1080" height="1920" fill="#05070F" opacity=".55"/>`;
  o += `<g transform="translate(540 ${y}) scale(${pop.toFixed(3)}) translate(-540 ${-y})"><rect x="${X + 10}" y="${Y + 16}" width="${ww}" height="${h}" rx="30" fill="#000" opacity=".45"/><defs><clipPath id="${id}"><rect x="${X}" y="${Y}" width="${ww}" height="${h}" rx="30"/></clipPath></defs>` +
    `<g clip-path="url(#${id})"><g transform="translate(${(540 + kay[0] * p).toFixed(1)} ${(y + kay[1] * p).toFixed(1)}) scale(${zz.toFixed(4)}) translate(-540 ${-y})"><image href="${u}" x="${X}" y="${Y}" width="${ww}" height="${h}"/></g></g>` +
    `<rect x="${X}" y="${Y}" width="${ww}" height="${h}" rx="30" fill="none" stroke="#FFF6E6" stroke-opacity=".4" stroke-width="3"/>`;
  if (yer) o += fkYer(ad, X + 20, Y + 44);
  if (kredi) o += fkKredi(ad, X, Y + h + 40);
  return o + '</g></g>';
};
