
// ===== #41 İLK YARDIM — anatomik iskelet v2 =====
// Uzuv uzunlukları SABİT (kol 52+50, bacak 52+50); hedefe yetişmezse uzuv uzamaz. Her parça konturlu + hafif degrade gölgeli çizilir.
const KSZ = { A: 52, B: 50, T: 52, S: 50, GOV: 54 };
const OUT = '#0A1030';
let _gid = 0;
const gsh = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k))); return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => f(v).toString(16).padStart(2, '0')).join(''); };
const ik2 = (sx, sy, tx, ty, A, B, pref) => {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy) || 1; const mx = A + B - 1.5, mn = Math.abs(A - B) + 4;
  if (d > mx) { dx *= mx / d; dy *= mx / d; d = mx; } else if (d < mn) { dx *= mn / d; dy *= mn / d; d = mn; }
  const a = (A * A - B * B + d * d) / (2 * d), h = Math.sqrt(Math.max(0, A * A - a * a)), ux = dx / d, uy = dy / d;
  const c1 = [sx + ux * a - uy * h, sy + uy * a + ux * h], c2 = [sx + ux * a + uy * h, sy + uy * a - ux * h];
  const f = c => (c[0] - (sx + dx / 2)) * pref[0] + (c[1] - (sy + dy / 2)) * pref[1];
  return [f(c1) > f(c2) ? c1 : c2, [sx + dx, sy + dy]];
};
const F1 = v => v.toFixed(1);
const cap = (p, q, r1, r2) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const ci = (c, r) => `M${F1(c[0] - r)} ${F1(c[1])} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  return [`M${F1(p[0] + nx * r1)} ${F1(p[1] + ny * r1)} L${F1(q[0] + nx * r2)} ${F1(q[1] + ny * r2)} L${F1(q[0] - nx * r2)} ${F1(q[1] - ny * r2)} L${F1(p[0] - nx * r1)} ${F1(p[1] - ny * r1)}Z`, ci(p, r1), ci(q, r2)]; };
// parça listesi: önce kontur geçişi, sonra dolgu (birleşik dış kontur); r = köşe yuvarlama
const parca = (ds, hex, r = 1, grad = true, gp = null) => ds.map(d => `<path d="${d}" fill="${hex}" stroke="${hex}" stroke-width="${2 * r}" stroke-linejoin="round"/>`).join('');
// el: ön kol yönünde avuç + başparmak
const manoCiz = (h, ang, ten, sg = 1) => { const dx = Math.cos(ang), dy = Math.sin(ang), px = -dy * sg, py = dx * sg;
  return parca([...cap([h[0] + dx, h[1] + dy], [h[0] + dx * 11, h[1] + dy * 11], 8.6, 8), ...cap([h[0] + dx * 3 + px * 6, h[1] + dy * 3 + py * 6], [h[0] + dx * 14 + px * 9, h[1] + dy * 14 + py * 9], 3.8, 3.2)], ten, 1, false); };
const brazCiz = (s, t, pref, upCol, ten, sg) => { const [e, h] = ik2(s[0], s[1], t[0], t[1], KSZ.A, KSZ.B, pref), ang = Math.atan2(h[1] - e[1], h[0] - e[0]);
  return parca(cap(e, h, 8, 6.6), ten, 1, true, [e, h, 8]) + parca(cap(s, e, 10, 8.6), upCol, 1, true, [s, e, 10]) + manoCiz(h, ang, ten, sg); };
const ayakCiz = (a, tur, renk) => { let ds, ln = '';
  if (tur === 'yukari') { ds = [...cap([a[0] + 3, a[1] + 5], [a[0] - 4, a[1] - 20], 8.8, 8), ...cap([a[0] - 4, a[1] - 20], [a[0] - 5, a[1] - 26], 7.6, 6)]; ln = `<path d="M${F1(a[0] + 11)} ${F1(a[1] + 6)} L${F1(a[0] + 5)} ${F1(a[1] - 19)}" stroke="#8A93A8" stroke-width="3.2" stroke-linecap="round"/><circle cx="${F1(a[0] - 5)}" cy="${F1(a[1] - 24)}" r="5.5" fill="#BAC2D6"/>`; renk = gsh(renk, -.07); }
  else if (tur === 'sag') { ds = cap([a[0] - 5, a[1]], [a[0] + 19, a[1]], 8, 7); ln = `<path d="M${F1(a[0] - 12)} ${F1(a[1] + 7)} H${F1(a[0] + 22)}" stroke="#7C86A0" stroke-width="3" stroke-linecap="round"/>`; }
  else { ds = cap([a[0] - 11, a[1]], [a[0] + 11, a[1]], 8, 8); ln = `<path d="M${F1(a[0] - 17)} ${F1(a[1] + 7)} H${F1(a[0] + 17)}" stroke="#7C86A0" stroke-width="3" stroke-linecap="round"/>`; }
  return parca(ds, renk, 1, false) + ln; };
const bacakCiz = (hp, ay, pref, pant, ayakTur, ayakRenk) => { const [k, a] = ik2(hp[0], hp[1], ay[0], ay[1], KSZ.T, KSZ.S, pref);
  return parca([...cap(hp, k, 13, 10.5), ...cap(k, a, 10.5, 8.2)], pant, 1, true, [hp, a, 13]) + ayakCiz(a, ayakTur, ayakRenk); };
// yüz: ifade = normal | sasir | korku | odak | agri ; goz = acik|genis|kapali ; agiz = duz|acik|gulum|korku
const yuzCiz = (goz, agiz, ifade) => {
  let o = '';
  if (goz === 'kapali') o += `<path d="M-16 2 Q-10 8 -4 2 M4 2 Q10 8 16 2" stroke="#14171F" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else { const r = goz === 'genis' ? 4.6 : 3.6; o += `<circle cx="-10" cy="2" r="${r}" fill="#14171F"/><circle cx="10" cy="2" r="${r}" fill="#14171F"/>`; }
  const by = goz === 'genis' ? -15 : -11;
  if (ifade === 'korku') o += `<path d="M-19 ${by + 3} L-5 ${by - 5} M19 ${by + 3} L5 ${by - 5}" stroke="#3A2A22" stroke-width="3.4" stroke-linecap="round"/>`;
  else if (ifade === 'sasir') o += `<path d="M-18 ${by - 2} Q-11 ${by - 8} -4 ${by - 2} M18 ${by - 2} Q11 ${by - 8} 4 ${by - 2}" stroke="#3A2A22" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  else if (ifade === 'odak' || ifade === 'agri') o += `<path d="M-18 ${by - 4} L-5 ${by + 1} M18 ${by - 4} L5 ${by + 1}" stroke="#3A2A22" stroke-width="3.4" stroke-linecap="round"/>`;
  else o += `<path d="M-18 ${by} Q-11 ${by - 4} -4 ${by} M18 ${by} Q11 ${by - 4} 4 ${by}" stroke="#3A2A22" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
  o += `<path d="M-1.5 6 Q0 9 2.5 8" stroke="#C79A6E" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if (agiz === 'acik') o += `<ellipse cx="0" cy="19" rx="7.5" ry="8.5" fill="#5A1A1A" stroke="#14171F" stroke-width="1.6"/><ellipse cx="0" cy="23" rx="4.5" ry="3.4" fill="#D9626C"/>`;
  else if (agiz === 'korku') o += `<path d="M-11 15 Q0 10 11 15 Q10 29 0 29 Q-10 29 -11 15Z" fill="#5A1A1A" stroke="#14171F" stroke-width="1.8" stroke-linejoin="round"/><path d="M-7 16 H7" stroke="#fff" stroke-width="3"/>`;
  else if (agiz === 'gulum') o += `<path d="M-9 15 Q0 25 9 15" stroke="#5A1A1A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else o += `<path d="M-6 19 H6" stroke="#5A1A1A" stroke-width="3" stroke-linecap="round"/>`;
  if (ifade === 'korku') o += `<path d="M30 -16 q7 11 0 17 q-7 -6 0 -17Z" fill="#9FD8FF" stroke="#0A1030" stroke-width="1.6"/><path d="M-27 -2 q6 10 0 15 q-6 -5 0 -15Z" fill="#9FD8FF" stroke="#0A1030" stroke-width="1.6"/>`;
  return o; };
const kafaCiz = (hc, rot, ten, sac, goz, agiz, ifade) => `<g transform="translate(${F1(hc[0])} ${F1(hc[1])}) rotate(${rot.toFixed(1)})"><circle r="30" fill="${ten}"/><path d="M-31 -4 Q-28 -34 0 -34 Q28 -34 31 -4 Q14 -18 -4 -14 Q-18 -12 -31 -4Z" fill="${sac}"/>`
  + (goz === 'kapali' ? `<path d="M-15 3 Q-10 7 -5 3 M5 3 Q10 7 15 3" stroke="#14171F" stroke-width="3" fill="none" stroke-linecap="round"/>` : `<circle cx="-10" cy="2" r="${goz === 'genis' ? 4.6 : 3.5}" fill="#14171F"/><circle cx="10" cy="2" r="${goz === 'genis' ? 4.6 : 3.5}" fill="#14171F"/>`)
  + (agiz === 'acik' || agiz === 'korku' ? `<ellipse cx="0" cy="17" rx="7" ry="8" fill="#5A1A1A"/>` : agiz === 'gulum' ? `<path d="M-8 14 Q0 22 8 14" stroke="#5A1A1A" stroke-width="3" fill="none" stroke-linecap="round"/>` : `<path d="M-6 17 H6" stroke="#5A1A1A" stroke-width="3" stroke-linecap="round"/>`) + `</g>`;
// kisi: sh omuz, hip kalça (yerel). Önden görünüm: shW>0 ; yandan: shW=0.
const uzv = (s0, t, pref, renk, kal) => { const [e, h] = ik2(s0[0], s0[1], t[0], t[1], KSZ.A, KSZ.B, pref); return { yol: `<path d="M${F1(s0[0])} ${F1(s0[1])} L${F1(e[0])} ${F1(e[1])} L${F1(h[0])} ${F1(h[1])}" stroke="${renk}" stroke-width="${kal}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, el: h }; };
const kisi = ({ x = 0, y = 0, s = 1, sh, hip, elL = null, elR = null, ayL = null, ayR = null, prefK = [0, 1], prefB = [0, -1], shW = 24, hipW = 12, renk = '#3E8EDE', pant = '#2A3456', ten = '#F2C9A0', sac = '#2A2A33', goz = 'acik', agiz = 'duz', ifade = 'normal', basEk = 0, bas = null, govdeOz = null, govde = true, kol = true, bacak = true, kafa = true, ayakRenk = '#14171F', ayak = 'on', yon = 1, kolRenk = null, govKal = null }) => {
  const ux = sh[0] - hip[0], uy = sh[1] - hip[1], L = Math.hypot(ux, uy) || 1, front = shW > 0;
  const hc = bas || [sh[0] + ux / L * 42, sh[1] + uy / L * 42];
  const rot = Math.atan2(hc[0] - sh[0], -(hc[1] - sh[1])) * 180 / Math.PI + basEk;
  let o = `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})">`;
  if (bacak) [[ayL, -1], [ayR, 1]].forEach(([ay, sg]) => { if (!ay) return; const p = uzv([hip[0] + sg * hipW, hip[1]], ay, prefB, sg < 0 ? gsh(pant, -.14) : pant, 20);
    o += p.yol + (ayak === 'yukari' ? `<ellipse cx="${F1(p.el[0] - 4)}" cy="${F1(p.el[1] - 11)}" rx="8" ry="16" fill="${ayakRenk}"/>` : ayak === 'sag' ? `<ellipse cx="${F1(p.el[0] + 8)}" cy="${F1(p.el[1] + 1)}" rx="17" ry="8" fill="${ayakRenk}"/>` : `<ellipse cx="${F1(p.el[0] + sg * 4)}" cy="${F1(p.el[1])}" rx="16" ry="8" fill="${ayakRenk}"/>`); });
  if (govde) o += govdeOz ? `<path d="${govdeOz}" fill="${renk}"/>` : `<path d="M${sh[0]} ${sh[1]} L${hip[0]} ${hip[1]}" stroke="${renk}" stroke-width="${govKal || KSZ.GOV}" stroke-linecap="round"/>`;
  if (kol) [[elL, -1], [elR, 1]].forEach(([el, sg]) => { if (!el) return; const pk = front && Math.abs(prefK[0]) < .01 ? [sg * .9, prefK[1] * .6] : prefK;
    const p = uzv([sh[0] + sg * shW, sh[1] + 4], el, pk, kolRenk || gsh(renk, -.16), 17); o += p.yol + `<circle cx="${F1(p.el[0])}" cy="${F1(p.el[1])}" r="10" fill="${ten}"/>`; });
  if (kafa) o += kafaCiz(hc, rot, ten, sac, goz, agiz, ifade);
  return o + '</g>';
};
// ayakta duran (önden). Ayak tabanı y=0, omuz −173, kalça −108 (bacak düz: 100)
const dur = (x, y, s, o = {}) => kisi(Object.assign({ x, y, s, sh: [0, -168], hip: [0, -103], ayL: [-14, -3], ayR: [14, -3], elL: [-28, -64], elR: [28, -64], prefB: [0, -1], prefK: [0, 1] }, o));
// yatan (yandan; baş solda, zemin y=0; gövde kalınlığı 54). poz: sirtustu | bacakYukari | yan. d: göğüs çökmesi, nf: nefes
const gvYatan = (d, nf) => { let top = '';
  for (let x = 0; x <= 65; x += 2) { const w = Math.abs(x - 34) < 22 ? (1 + Math.cos(Math.PI * (x - 34) / 22)) / 2 : 0, lift = nf * ((1 + Math.cos(Math.PI * Math.min(1, Math.abs(x - 34) / 40))) / 2); top += ` L${x} ${(-54 + d * w - lift).toFixed(1)}`; }
  return `M0 -54${top} L65 -54 A27 27 0 0 1 65 0 L0 0 A27 27 0 0 1 0 -54Z`; };
const yatan = (x, y, s, o = {}) => {
  const poz = o.poz || 'sirtustu', k = poz === 'yan' ? (o.k == null ? 1 : o.k) : 0, L = (a, b) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const bk = o.bk != null ? o.bk : (poz === 'bacakYukari' ? 1 : 0), A = { ayL: [162 - 11 * bk, -14 - 60 * bk], ayR: [163 - 13 * bk, -36 - 30 * bk] };
  const Y = { ayL: [162, -12], ayR: [112, -40], elR: [-24, -58] };
  const c = { x, y, s, sh: [0, -27], hip: [65, -27], shW: 0, hipW: 0, prefK: [0, 1], prefB: [0, -1], ayL: L(A.ayL, Y.ayL), ayR: L(A.ayR, Y.ayR), elL: null, elR: L([72, -42], Y.elR), bas: [-42 + k * 2, -27 + (o.basY || 0) - k * 7], goz: 'kapali', ayak: 'yukari', basEk: k * 24 };
  const cfg = Object.assign(c, o); ['poz', 'k', 'nf', 'd', 'basY', 'bk'].forEach(q => delete cfg[q]);
  if (poz !== 'yan' || k < .01) cfg.govdeOz = gvYatan(o.d || 0, o.nf || 0);
  return kisi(cfg);
};
// ellerin üst üste yakın plan çizimi (yukarıdan; parmaklar iç içe, başparmaklar yan yana). (x,y)=avuç içi, rot=derece (parmak yönü: 0 = yukarı)
const elIki2 = (x, y, s = 1, rot = 0, ten = '#F2C9A0') => { const alt = gsh(ten, -.2), ust = ten;
  const par = (cx, cy, uz, w, col, ang) => parca(cap([cx, cy], [cx + Math.sin(ang) * uz, cy - Math.cos(ang) * uz], w, w - 1.1), col, 1, false);
  let o = `<g transform="translate(${x} ${y}) scale(${s}) rotate(${rot})">`;
  o += parca([...cap([-8, 14], [58, 52], 13, 12)], '#E8774A', 1, true, [[-8, 14], [58, 52], 13]) + parca(cap([-8, 14], [30, 34], 11, 10.5), ten, 1, false);  // kol (kol + ön kol)
  o += `<g transform="translate(-16 4) rotate(-26 0 10)">`;
  [[-21, 9, 38], [-7, 7, 44], [8, 8, 41], [22, 12, 33]].forEach(([cx, cy, uz]) => o += par(cx, cy, uz, 7.4, alt, -.05));     // alttaki el parmakları
  o += parca([`M-27 8 Q-30 38 -10 46 Q10 50 26 40 Q32 20 28 8 Q0 -2 -27 8Z`], alt, 4, false);
  o += `</g>`;
  [[-26, -4, 42], [-12, -8, 49], [3, -8, 47], [18, -4, 38]].forEach(([cx, cy, uz]) => o += par(cx, cy, uz, 7.6, ust, .06));    // üstteki el parmakları
  o += parca([`M-31 -6 Q-34 28 -14 38 Q10 44 28 32 Q34 8 30 -6 Q0 -16 -31 -6Z`], ust, 4, false);
  o += `<path d="M-20 4 Q-10 0 0 4 M4 4 Q14 0 24 4" stroke="${gsh(ten, -.32)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  o += parca(cap([-33, 22], [-38, -8], 7, 6.2), ust, 1, false) + parca(cap([-24, 28], [-26, -2], 6.4, 5.8), alt, 1, false);         // başparmaklar
  return o + '</g>'; };
// yandan CPR eli: avuç içi göğüste, parmaklar kalkık (hx,hy = temas noktası, yerel yatan koordinatı)
const elYanCPR = (hx, hy) => parca([...cap([hx - 16, hy + 1], [hx + 9, hy + 1], 6.5, 6.5), ...cap([hx + 9, hy - 1], [hx + 24, hy - 9], 4.6, 3.8), ...cap([hx + 9, hy - 5], [hx + 22, hy - 15], 4.2, 3.6)], '#F2C9A0', 1, false);
// kalp masajı: kurtarıcı karşı tarafta (önden), yatan yandan; d = çökme. Kurtarıcının alt gövdesi yatanın arkasında kalır.
const cprFig = (x, y, s, d, { ust = 0 } = {}) => {
  const hx = 34, hy = -54 + d - 8, ky = hy - 105 - ust;
  const kur = kisi({ x, y, s, sh: [hx, ky], hip: [hx, -30], elL: [hx - 3, hy - 2], elR: [hx + 3, hy - 2], bacak: false, shW: 22, govKal: 46, kolRenk: '#C9582E', prefK: [0, 1], renk: '#E8774A', goz: 'acik', agiz: 'duz' });
  const yat = yatan(x, y, s, { d, poz: 'sirtustu', renk: '#3E8EDE' });
  return kur + yat + `<g transform="translate(${x} ${y}) scale(${s})">` + elYanCPR(hx, hy) + `</g>`;
};
// yığılma: ayaktan yere (ayak tabanı pivot). th=1 → yatan(px-173s, py)
const dusus = (px, py, s, th, o = {}) => {
  const a = -th * Math.PI / 2, c = Math.cos(a), sn = Math.sin(a), R2 = (p) => [p[0] * c - p[1] * sn, p[0] * sn + p[1] * c - 27 * th];
  const hand = (p) => { const q = R2(p); return [q[0], Math.min(q[1], -14)]; };
  return kisi(Object.assign({ x: px, y: py, s, sh: R2([0, -168]), hip: R2([0, -103]), ayL: R2([-14, -3]), ayR: R2([14, -3]), elL: hand([-28, -64 + 20 * th]), elR: hand([28, -64 + 20 * th]), shW: 26 * (1 - th), hipW: 12 * (1 - th), prefB: [0, -1], prefK: [0, 1], goz: th > .5 ? 'kapali' : 'acik', agiz: th > .1 ? 'acik' : 'duz', ayak: th > .6 ? 'yukari' : 'on' }, o));
};

// ===== ek ikonlar / küçük çizimler =====
const bal = (s, x, y, { fs = 40, renk = '#FFFFFF', yazi = '#1B2440', kx = -30, ky = 70 } = {}) => { const w = K.yaziGen(s, fs) + 56, h = fs * 1.7; return `<g transform="translate(${x} ${y})">` + R(-w / 2 + 6, -h / 2 + 10, w, h, h / 2, '#000', .3) + R(-w / 2, -h / 2, w, h, h / 2, renk) + `<path d="M${kx - 14} ${h / 2 - 4} L${kx + 6} ${h / 2 + ky * .55} L${kx + 16} ${h / 2 - 4}Z" fill="${renk}"/>` + txt(s, 0, fs * .34, fs, yazi) + `</g>`; };
const nefesOk = (x, y, t, h = 1, renk = '#7FD0FF') => { const q = Math.sin(t * 3.2) * .5 + .5; return `<g transform="translate(${x} ${y})" opacity="${(.45 + .55 * q).toFixed(2)}"><path d="M0 ${-30 - 26 * q} V${-70 - 26 * q} M-18 ${-52 - 26 * q} L0 ${-74 - 26 * q} L18 ${-52 - 26 * q}" stroke="${renk}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; };
const saat = (x, y, r, tt, renk = '#FFD23F') => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#0B1433" stroke="${renk}" stroke-width="${r * .08}"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<line x1="0" y1="${-r * .82}" x2="0" y2="${-r * .72}" stroke="#FFF3D6" stroke-width="${r * .035}" transform="rotate(${i * 30})"/>`).join('') + `<line x1="0" y1="0" x2="0" y2="${-r * .62}" stroke="#FFF3D6" stroke-width="${r * .06}" stroke-linecap="round" transform="rotate(${tt * 360})"/><line x1="0" y1="0" x2="0" y2="${-r * .42}" stroke="${renk}" stroke-width="${r * .08}" stroke-linecap="round" transform="rotate(${tt * 30})"/><circle r="${r * .06}" fill="${renk}"/></g>`;
const ambulans = (x, y, s, t) => `<g transform="translate(${x} ${y}) scale(${s})">` + R(-100, -88, 200, 88, 14, '#F4F6FA') + R(-100, -52, 200, 10, 0, '#E8323C') + `<path d="M40 -88 H86 L106 -50 V0 H40Z" fill="#E7EBF2"/>` + R(52, -78, 30, 24, 4, '#7FD0FF') + `<path d="M-60 -76 H-40 V-62 H-26 V-48 H-40 V-34 H-60 V-48 H-74 V-62 H-60Z" fill="#E8323C"/>` + `<circle cx="-56" cy="2" r="17" fill="#14171F"/><circle cx="64" cy="2" r="17" fill="#14171F"/>` + R(-10, -102, 36, 14, 4, Math.sin(t * 14) > 0 ? '#E8323C' : '#3E8EDE') + `</g>`;
const sersem = (x, y, s, t) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="38" fill="#F2C9A0"/>` + `<path d="M-14 -2 Q-8 4 -2 -2 M6 -2 Q12 4 18 -2" stroke="#14171F" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M-10 18 Q4 10 14 20" stroke="#5A1A1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>` + [0, 1, 2].map(i => { const a = t * 3 + i * 2.1; return `<text x="${(Math.cos(a) * 56).toFixed(1)}" y="${(-52 + Math.sin(a) * 12).toFixed(1)}" font-size="28" text-anchor="middle" style="fill:#FFD23F">★</text>`; }).join('') + `</g>`;
const bardak = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -60 H30 L24 40 H-24Z" fill="#BFE0FF" opacity=".9"/><path d="M-27 -22 H27 L24 40 H-24Z" fill="#3E8EDE" opacity=".85"/></g>`;
const kalpAgri = (x, y, s, t) => `<g transform="translate(${x} ${y}) scale(${s * (1 + .06 * Math.sin(t * 9))})">` + ikon('kalp', 0, 0, 1) + [0, 1, 2].map(i => `<path d="M${-96 - i * 4} ${-30 + i * 28} l-22 -6 M${96 + i * 4} ${-30 + i * 28} l22 -6" stroke="#FFD23F" stroke-width="7" stroke-linecap="round"/>`).join('') + `</g>`;
const ekg = (x, y, w, t, mod) => { // mod: 'duz' | 'duzensiz' | 'normal'
  let d = `M${x - w / 2} ${y}`; const n = 80;
  for (let i = 1; i <= n; i++) { const u = i / n, px = x - w / 2 + u * w; let py = y;
    if (mod === 'duz') py = y + Math.sin(u * 40 + t * 3) * 1.5;
    else { const q = ((u * 5 - t * (mod === 'duzensiz' ? 1.9 : 1.1)) % 1 + 1) % 1; py = y + (q > .42 && q < .5 ? -60 * Math.sin((q - .42) / .08 * Math.PI) : q > .5 && q < .56 ? 26 * Math.sin((q - .5) / .06 * Math.PI) : 0) * (mod === 'duzensiz' ? (.4 + .6 * Math.abs(Math.sin(u * 17))) : 1); }
    d += ` L${px.toFixed(1)} ${py.toFixed(1)}`; }
  return `<path d="${d}" stroke="${mod === 'duz' ? '#E8323C' : '#2FBF71'}" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
};

const fd = (t, a, b) => MO.cl((t - a) / Math.max(.001, b - a));
// panel içi zemin (alt köşeler yuvarlak): y = zemin çizgisi (panel yerel), renk
const yer = (y, renk = '#1E2A52', w = 920, h = 640) => `<path d="M${-w / 2} ${y} H${w / 2} V${h / 2 - 36} Q${w / 2} ${h / 2} ${w / 2 - 36} ${h / 2} H${-w / 2 + 36} Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 36}Z" fill="${renk}"/><rect x="${-w / 2}" y="${y}" width="${w}" height="5" fill="#FFFFFF" opacity=".14"/>`;

const yumruk = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` + parca([...cap([-10, 2], [8, 2], 11, 11)], '#F2C9A0', 1, false) + `<path d="M-6 -9 V13 M1 -10 V14 M8 -8 V12" stroke="#B88A5E" stroke-width="2.2" stroke-linecap="round"/><path d="M8 -9 Q18 -2 10 8" stroke="#B88A5E" stroke-width="2.2" fill="none"/></g>`;
const adim = (n, ad, renk = '#FF6B81') => `<g>` + R(-(K.yaziGen(ad, 46) + 150) / 2 + 6, -42 + 10, K.yaziGen(ad, 46) + 150, 84, 42, '#000', .3) + R(-(K.yaziGen(ad, 46) + 150) / 2, -42, K.yaziGen(ad, 46) + 150, 84, 42, '#0B1433', .96) + `<rect x="${-(K.yaziGen(ad, 46) + 150) / 2}" y="-42" width="${K.yaziGen(ad, 46) + 150}" height="84" rx="42" fill="none" stroke="${renk}" stroke-width="4"/><circle cx="${-(K.yaziGen(ad, 46) + 150) / 2 + 44}" cy="0" r="28" fill="${renk}"/>` + txt(String(n), -(K.yaziGen(ad, 46) + 150) / 2 + 44, 14, 38, '#FFFFFF') + txt(ad, 36, 15, 46, '#FFF6E6') + `</g>`;
const AD = (t, a, b, n, ad, y = 1215, renk) => MO.sar(adim(n, ad, renk), MO.oge(t, { gir: a, cik: b, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, y, { golge: false });
const ET = (t, a, b, s, bg, yz, fs, y, rot = -2) => MO.sar(etiket(s, 0, 0, bg, yz, fs, rot, 1), MO.oge(t, { gir: a, cik: b, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, y, { golge: false });
// kalp masajı çökme eğrisi: 2 Hz sürekli (t0'dan sonra) — tam geri yükselir
const cprD = (t, t0, f = 2, mx = 13) => { if (t < t0) return 0; const u = ((t - t0) * f) % 1; return mx * Math.pow(.5 - .5 * Math.cos(2 * Math.PI * u), .75); };
// aralıklı tek bas–bırak: [a, b] basılı aralıklar (bas hızlı, bırak hızlı)
const basBirak = (t, aralik, mx = 13) => { let d = 0; for (const [a, b] of aralik) { if (t >= a - .02 && t <= b + .18) d = Math.max(d, mx * MO.E.outQuad(MO.cl((t - a) / .14)) * (1 - MO.E.outQuad(MO.cl((t - b) / .16)))); } return d; };

const ob = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);

// ===== kuş bakışı trafik (ambulans sıkışmış) — ekran koordinatları; t: sahne içi saniye, u: 0..1 ilerleme =====
const ustArac = (x, y, renk, w = 118, h = 205) => `<g transform="translate(${F1(x)} ${F1(y)})">` + parca([`M${-w / 2 + 30} ${-h / 2} H${w / 2 - 30} Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 30} V${h / 2 - 30} Q${w / 2} ${h / 2} ${w / 2 - 30} ${h / 2} H${-w / 2 + 30} Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 30} V${-h / 2 + 30} Q${-w / 2} ${-h / 2} ${-w / 2 + 30} ${-h / 2}Z`], renk, 1)
  + R(-w / 2 + 12, -h / 2 + 36, w - 24, 40, 12, '#10182C') + R(-w / 2 + 14, -h / 2 + 80, w - 28, 62, 12, gsh(renk, .22)) + R(-w / 2 + 12, h / 2 - 62, w - 24, 26, 10, '#10182C')
  + R(-w / 2 + 8, -h / 2 + 4, 20, 9, 4, '#FFE9A8') + R(w / 2 - 28, -h / 2 + 4, 20, 9, 4, '#FFE9A8') + R(-w / 2 + 8, h / 2 - 12, 22, 8, 3, '#E8323C') + R(w / 2 - 30, h / 2 - 12, 22, 8, 3, '#E8323C') + `</g>`;
const ustAmbulans = (x, y, t) => { const a = Math.sin(t * 13) > 0, w = 132, h = 262;
  let o = `<circle cx="${x}" cy="${y}" r="${210 + 14 * Math.sin(t * 13)}" fill="${a ? '#E8323C' : '#3E8EDE'}" opacity=".16"/><circle cx="${x}" cy="${y}" r="120" fill="${a ? '#E8323C' : '#3E8EDE'}" opacity=".14"/>`;
  o += `<g transform="translate(${x} ${y})">` + parca([`M${-w / 2 + 32} ${-h / 2} H${w / 2 - 32} Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 32} V${h / 2 - 22} Q${w / 2} ${h / 2} ${w / 2 - 22} ${h / 2} H${-w / 2 + 22} Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 22} V${-h / 2 + 32} Q${-w / 2} ${-h / 2} ${-w / 2 + 32} ${-h / 2}Z`], '#F4F6FA', 1)
    + R(-w / 2 + 12, -h / 2 + 34, w - 24, 44, 12, '#1B2A55') + R(-w / 2, -6, 12, 120, 3, '#E8323C') + R(w / 2 - 12, -6, 12, 120, 3, '#E8323C')
    + `<path d="M-10 18 H10 V38 H30 V58 H10 V78 H-10 V58 H-30 V38 H-10Z" fill="#E8323C" stroke="#fff" stroke-width="3" transform="translate(0 22)"/>`
    + R(-w / 2 + 10, -h / 2 + 90, w - 20, 16, 5, a ? '#E8323C' : '#7A1A22') + R(-w / 2 + 10, -h / 2 + 90, (w - 20) / 2, 16, 5, a ? '#7A1A22' : '#3E8EDE')
    + R(-w / 2 + 8, -h / 2 + 4, 22, 9, 4, '#FFE9A8') + R(w / 2 - 30, -h / 2 + 4, 22, 9, 4, '#FFE9A8') + `</g>`;
  return o; };
const kusTrafik = (t, t0) => {
  const u = t - t0, oy = 26 * u; let o = R(-120, -120, 1320, 2160, 0, '#252A3B');
  // yan şeritler + çatılar
  [[-120, 0], [1000, 1]].forEach(([x0, sg]) => { o += R(x0, -120, 200, 2160, 0, '#161B2B'); for (let i = 0; i < 8; i++) { const yy = ((i * 330 + oy * .6) % 2640) - 300; o += R(x0 + (sg ? 28 : 40), yy, 130, 250, 14, i % 2 ? '#2B3450' : '#364062') + R(x0 + (sg ? 46 : 58), yy + 20, 94, 70, 10, '#222A44'); } });
  // şerit çizgileri
  [405, 675].forEach(x => { for (let i = 0; i < 12; i++) { const yy = ((i * 220 + oy) % 2640) - 300; o += R(x - 4, yy, 8, 110, 3, '#C8D0DC', .55); } });
  const CR = ['#E8323C', '#3E8EDE', '#F4F6FA', '#FFD23F', '#2FBF71', '#8A94A8', '#FF8A4A', '#7B5EA7'];
  const lanes = [270, 540, 810];
  lanes.forEach((lx, li) => { for (let r = -3; r < 8; r++) {
    if (li === 1 && r >= 0 && r < 2) continue;                                                             // ambulansın bulunduğu boşluk
    const base = 1000 - 250 * r, yy = base + oy; let x = lx + ((r * 7 + li * 3) % 5 - 2) * 4;
    if (li === 1 && r < 0) { const k = MO.E.inOutCubic(fd(t, t0 + 1.4 + .25 * -r, t0 + 2.4 + .25 * -r)); x += (r % 2 ? -1 : 1) * 52 * k; }   // öndeki araçlar yol verir
    o += ustArac(x, yy, CR[(r * 3 + li * 5 + 16) % 8]); } });
  o += ustAmbulans(540, 1000 - 18 * Math.min(1, u / 2.8), t);
  // korna çubukları
  for (let i = 0; i < 3; i++) { const q = ((t * 2 + i * .33) % 1); o += `<path d="M${420 - 40 * q} ${760 - 30 * q} q-26 20 0 40" stroke="#FFD23F" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(.8 * (1 - q)).toFixed(2)}"/><path d="M${660 + 40 * q} ${760 - 30 * q} q26 20 0 40" stroke="#FFD23F" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(.8 * (1 - q)).toFixed(2)}"/>`; }
  return o; };
// ===== üstten göğüs (yatan kişi yukarıdan; panel yerel koordinat). Baş yukarıda =====
const gogusUst = (t, elP) => {
  const sk = '#F2C9A0', renk = '#3E8EDE', pant = '#2A3456', up = gsh(renk, -.12);
  let o = parca([...cap([-42, 84], [-52, 360], 40, 33), ...cap([42, 84], [52, 360], 40, 33)], pant, 1, true, [[0, 84], [0, 360], 80]);
  o += parca(cap([0, -190], [0, -158], 18, 22), gsh(sk, -.06), 1, false);
  o += parca([`M-92 -170 H92 L74 78 H-74Z`], renk, 30);
  o += `<path d="M-60 78 H60" stroke="${gsh(pant, -.4)}" stroke-width="8" opacity=".7" stroke-linecap="round"/>`;
  [-1, 1].forEach(sg => { const sx = sg * 112, ex = sg * 126, hx = sg * 122; o += parca(cap([ex, -8], [hx, 112], 20, 16), sk, 1, true, [[ex, -8], [hx, 112], 20]) + parca(cap([sx, -146], [ex, -8], 26, 21), up, 1, true, [[sx, -146], [ex, -8], 26]) + manoCiz([hx, 114], Math.PI / 2, sk, sg); });
  o += `<g transform="translate(0 -250) scale(1.65)">` + kafaCiz([0, 0], 0, sk, '#2A2A33', 'kapali', 'duz', 'normal') + `</g>`;
  o += `<path d="M0 -140 V-26" stroke="#FFFFFF" stroke-width="6" opacity=".26" stroke-linecap="round" stroke-dasharray="3 14"/>` + [0, 1, 2].map(i => `<path d="M-52 ${-130 + i * 34} Q0 ${-116 + i * 34} 52 ${-130 + i * 34}" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".13" stroke-linecap="round"/>`).join('');
  const pu = .5 + .5 * Math.sin(t * 7);
  o += `<circle cx="0" cy="-62" r="${40 + 7 * pu}" fill="none" stroke="#FFD23F" stroke-width="6" stroke-dasharray="11 9"/><circle cx="0" cy="-62" r="7" fill="#FFD23F"/>`;
  o += elP;
  return o; };

// ===== Gubi & Gufi: olayın içinde. bm = konuşma balonu, MAS = köşedeki oyuncular + balonlar =====
const bm = (t, a, b, x, y, metin, { yon = -1, fs = 38 } = {}) => { const k = fd(t, a, a + .22) * (1 - fd(t, b - .2, b)); if (k <= .01) return ''; const w = K.yaziGen(metin, fs) + 80, sc = .8 + .2 * ob(fd(t, a, a + .3));
  return `<g opacity="${k.toFixed(2)}" transform="translate(${x} ${y}) scale(${sc.toFixed(3)})">` + M.balon(0, 0, txt(metin, 0, fs * .34, fs, '#1B2440'), { w, h: fs * 2.3, yon }) + '</g>'; };
const MAS = (t, o = {}) => gubi(t, { x: 880, y: 1650, boy: 150, duygu: o.gd || 'merak', bakHedef: o.bh || [540, 800], isaretHedef: o.ih || null })
  + gufi(t, { x: 200, y: 1840, boy: 210, duygu: o.gf || 'merak', bakHedef: o.bh || [540, 800], isaretHedef: o.ih || null })
  + (o.b || []).map(([k, a, b, m]) => bm(t, a, b, k === 'gubi' ? 720 : 360, 1492, m, { yon: k === 'gubi' ? 1 : -1 })).join('');
