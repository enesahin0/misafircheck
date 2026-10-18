
// ===== #41 İLK YARDIM — anatomik iskelet (uzuv uzunlukları SABİT; hedefe yetişmezse uzamaz, el yerinde kalır) =====
// kol 52+50, bacak 52+50, gövde = omuz→kalça çizgisi (kalınlık 54), baş r30 omuzdan 42 yukarıda.
const KSZ = { A: 52, B: 50, T: 52, S: 50, GOV: 54 };
const ik2 = (sx, sy, tx, ty, A, B, pref) => {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy) || 1; const mx = A + B - 1.5, mn = Math.abs(A - B) + 4;
  if (d > mx) { dx *= mx / d; dy *= mx / d; d = mx; } else if (d < mn) { dx *= mn / d; dy *= mn / d; d = mn; }
  const a = (A * A - B * B + d * d) / (2 * d), h = Math.sqrt(Math.max(0, A * A - a * a)), ux = dx / d, uy = dy / d;
  const c1 = [sx + ux * a - uy * h, sy + uy * a + ux * h], c2 = [sx + ux * a + uy * h, sy + uy * a - ux * h];
  const f = c => (c[0] - (sx + dx / 2)) * pref[0] + (c[1] - (sy + dy / 2)) * pref[1];
  return [f(c1) > f(c2) ? c1 : c2, [sx + dx, sy + dy]];
};
const uz = (s, t, A, B, pref, renk, kal) => { const [e, h] = ik2(s[0], s[1], t[0], t[1], A, B, pref); return { yol: `<path d="M${s[0].toFixed(1)} ${s[1].toFixed(1)} L${e[0].toFixed(1)} ${e[1].toFixed(1)} L${h[0].toFixed(1)} ${h[1].toFixed(1)}" stroke="${renk}" stroke-width="${kal}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, el: h }; };
// kisi: sh omuz, hip kalça (yerel). elL/elR el hedefleri; ayL/ayR ayak hedefleri; prefK/prefB dirsek/diz bükülme yönü. shW/hipW: önden görünümde omuz/kalça yarı genişliği.
const kisi = ({ x = 0, y = 0, s = 1, sh, hip, elL = null, elR = null, ayL = null, ayR = null, prefK = [0, 1], prefB = [0, -1], shW = 24, hipW = 12, renk = '#3E8EDE', pant = '#2A3456', ten = '#F2C9A0', sac = '#2A2A33', goz = 'acik', agiz = 'duz', basEk = 0, bas = null, govdeOz = null, govde = true, kol = true, bacak = true, kafa = true, ayakRenk = '#14171F', yon = 1, kolRenk = null, govKal = null }) => {
  const ux = sh[0] - hip[0], uy = sh[1] - hip[1], L = Math.hypot(ux, uy) || 1;
  const hc = bas || [sh[0] + ux / L * 42, sh[1] + uy / L * 42];
  const rot = Math.atan2(hc[0] - sh[0], -(hc[1] - sh[1])) * 180 / Math.PI + basEk;
  let o = `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})">`;
  if (bacak) [[ayL, -1], [ayR, 1]].forEach(([ay, sg]) => { if (!ay) return; const p = uz([hip[0] + sg * hipW, hip[1]], ay, KSZ.T, KSZ.S, prefB, pant, 20); o += p.yol + `<ellipse cx="${(p.el[0] + sg * 4).toFixed(1)}" cy="${(p.el[1]).toFixed(1)}" rx="16" ry="8" fill="${ayakRenk}"/>`; });
  if (govde) o += govdeOz || `<path d="M${sh[0]} ${sh[1]} L${hip[0]} ${hip[1]}" stroke="${renk}" stroke-width="${govKal || KSZ.GOV}" stroke-linecap="round"/>`;
  if (kol) [[elL, -1], [elR, 1]].forEach(([el, sg]) => { if (!el) return; const p = uz([sh[0] + sg * shW, sh[1] + 4], el, KSZ.A, KSZ.B, prefK, kolRenk || renk, 17); o += p.yol + `<circle cx="${p.el[0].toFixed(1)}" cy="${p.el[1].toFixed(1)}" r="10" fill="${ten}"/>`; });
  if (kafa) o += `<g transform="translate(${hc[0].toFixed(1)} ${hc[1].toFixed(1)}) rotate(${rot.toFixed(1)})"><circle r="30" fill="${ten}"/><path d="M-31 -4 Q-28 -34 0 -34 Q28 -34 31 -4 Q14 -18 -4 -14 Q-18 -12 -31 -4Z" fill="${sac}"/>` + (goz === 'acik' ? `<circle cx="-10" cy="2" r="3.5" fill="#14171F"/><circle cx="10" cy="2" r="3.5" fill="#14171F"/>` : goz === 'genis' ? `<circle cx="-10" cy="2" r="6" fill="#fff"/><circle cx="10" cy="2" r="6" fill="#fff"/><circle cx="-10" cy="2" r="2.8" fill="#14171F"/><circle cx="10" cy="2" r="2.8" fill="#14171F"/>` : `<path d="M-15 3 Q-10 7 -5 3 M5 3 Q10 7 15 3" stroke="#14171F" stroke-width="3" fill="none" stroke-linecap="round"/>`) + (agiz === 'acik' ? `<ellipse cx="0" cy="17" rx="7" ry="8" fill="#5A1A1A"/>` : agiz === 'gulum' ? `<path d="M-8 14 Q0 22 8 14" stroke="#5A1A1A" stroke-width="3" fill="none" stroke-linecap="round"/>` : `<path d="M-6 17 H6" stroke="#5A1A1A" stroke-width="3" stroke-linecap="round"/>`) + `</g>`;
  return o + '</g>';
};
// ayakta duran (önden). Ayak tabanı y=0. hand targets verilmezse kollar yanda sarkar.
const dur = (x, y, s, o = {}) => kisi(Object.assign({ x, y, s, sh: [0, -160], hip: [0, -95], ayL: [-14, 0], ayR: [14, 0], elL: [-36, -66], elR: [36, -66], prefB: [0, -1], prefK: [0, 1] }, o));
// yatan (yandan; baş solda, zemin y=0). poz: sirtustu | bacakYukari | yan. k: 0..1 sirtustu→yan geçişi. d: göğüs çökmesi (px), nf: nefes yüksekliği
const gvYatan = (d, nf, renk) => {
  let top = '', x1 = 0, x2 = 70;
  for (let x = x1; x <= x2; x += 2) { const w = Math.abs(x - 34) < 22 ? (1 + Math.cos(Math.PI * (x - 34) / 22)) / 2 : 0; const lift = nf * ((1 + Math.cos(Math.PI * Math.min(1, Math.abs(x - 34) / 40))) / 2); top += ` L${x} ${(-54 + d * w - lift).toFixed(1)}`; }
  return `<path d="M${x1} -54${top} L${x2} -54 A27 27 0 0 1 ${x2} 0 L${x1} 0 A27 27 0 0 1 ${x1} -54Z" fill="${renk}"/>`;
};
const yatan = (x, y, s, o = {}) => {
  const poz = o.poz || 'sirtustu', k = poz === 'yan' ? (o.k == null ? 1 : o.k) : 0, L = (a, b) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const bk = o.bk != null ? o.bk : (poz === 'bacakYukari' ? 1 : 0), A = { ayL: [166 - 10 * bk, -14 - 62 * bk], ayR: [164 - 4 * bk, -30 - 38 * bk] };
  const Y = { ayL: [166, -12], ayR: [122, -40], elL: [-30, -16], elR: [-6, -52], bas: [-40, -34] };
  const c = { x, y, s, sh: [0, -27], hip: [70, -27], shW: 0, hipW: 0, prefK: [0, -1], prefB: [0, -1], ayL: L(A.ayL, Y.ayL), ayR: L(A.ayR, Y.ayR), elL: L([46, -12], Y.elL), elR: L([38, -6], Y.elR), bas: [-42 + k * 2, -27 + (o.basY || 0) - k * 7], goz: 'kapali' };
  if (o.k == null && poz === 'yan') c.k = 1;
  const cfg = Object.assign(c, o); delete cfg.poz; delete cfg.k; delete cfg.nf; delete cfg.d; delete cfg.basY; delete cfg.bk;
  if (poz !== 'yan' || k < .01) cfg.govdeOz = gvYatan(o.d || 0, o.nf || 0, o.renk || '#3E8EDE');
  return kisi(cfg);
};
// kalp masajı sahnesi: kurtarıcı karşı tarafta (önden), yatan yandan; d = çökme (px). Kurtarıcının alt gövdesi yatanın arkasında gizli.
const cprFig = (x, y, s, d, { ust = 0 } = {}) => {
  const hx = 34, hy = -54 + d - 9;            // eller göğüs yüzeyinde (yerel yatan koordinatı)
  const ky = hy - 93 - ust;                    // omuzlar ellerin tam üstünde: kollar dümdüz (erişim ≈ 98)
  const kur = kisi({ x, y, s, sh: [hx, ky], hip: [hx, -30], elL: [hx - 5, hy], elR: [hx + 5, hy], bacak: false, shW: 34, govKal: 46, kolRenk: '#C9582E', prefK: [0, 1], renk: '#E8774A', goz: 'acik', agiz: 'duz' });
  const yat = yatan(x, y, s, { d, poz: 'sirtustu', renk: '#3E8EDE' });
  const el = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${hx - 15}" y="${hy - 8}" width="30" height="17" rx="8" fill="#F2C9A0"/><path d="M${hx - 11} ${hy + 1} H${hx + 11}" stroke="#B88A5E" stroke-width="2.5" stroke-linecap="round"/></g>`;
  return kur + yat + el;
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
// ayaktan yere yığılma: th 0..1 (ayak tabanı pivot). th=1 → yatan(px-160s, py) ile aynı pozisyon
const dusus = (px, py, s, th, o = {}) => {
  const a = -th * Math.PI / 2, c = Math.cos(a), sn = Math.sin(a), R2 = (p) => [p[0] * c - p[1] * sn, p[0] * sn + p[1] * c - 27 * th];
  const hand = (p) => { const q = R2(p); return [q[0], Math.min(q[1], -12)]; };
  return kisi(Object.assign({ x: px, y: py, s, sh: R2([0, -160]), hip: R2([0, -95]), ayL: R2([-14, 0]), ayR: R2([14, 0]), elL: hand([-36, -66 + 20 * th]), elR: hand([36, -66 + 20 * th]), shW: 24 * (1 - th), hipW: 12 * (1 - th), prefB: [0, -1], prefK: [0, 1], goz: th > .5 ? 'kapali' : 'acik', agiz: th > .1 ? 'acik' : 'duz' }, o));
};
// iki el üst üste (önden/üstten küçük çizim)
const elIki = (x, y, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${rot})"><rect x="-58" y="-30" width="116" height="60" rx="26" fill="#E8B88C"/><rect x="-44" y="-44" width="112" height="60" rx="26" fill="#F2C9A0"/><path d="M-6 -36 V8 M14 -36 V8 M34 -34 V6" stroke="#C79A6E" stroke-width="3" stroke-linecap="round"/></g>`;
// yumruk (yandan)
const yumruk = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-16" y="-14" width="34" height="28" rx="10" fill="#F2C9A0"/><circle cx="0" cy="0" r="14" fill="#F2C9A0"/><path d="M-4 -12 V12 M6 -12 V12" stroke="#C79A6E" stroke-width="2.5"/></g>`;
const adim = (n, ad, renk = '#FF6B81') => `<g>` + R(-(K.yaziGen(ad, 46) + 150) / 2 + 6, -42 + 10, K.yaziGen(ad, 46) + 150, 84, 42, '#000', .3) + R(-(K.yaziGen(ad, 46) + 150) / 2, -42, K.yaziGen(ad, 46) + 150, 84, 42, '#0B1433', .96) + `<rect x="${-(K.yaziGen(ad, 46) + 150) / 2}" y="-42" width="${K.yaziGen(ad, 46) + 150}" height="84" rx="42" fill="none" stroke="${renk}" stroke-width="4"/><circle cx="${-(K.yaziGen(ad, 46) + 150) / 2 + 44}" cy="0" r="28" fill="${renk}"/>` + txt(String(n), -(K.yaziGen(ad, 46) + 150) / 2 + 44, 14, 38, '#FFFFFF') + txt(ad, 36, 15, 46, '#FFF6E6') + `</g>`;
const AD = (t, a, b, n, ad, y = 1215, renk) => MO.sar(adim(n, ad, renk), MO.oge(t, { gir: a, cik: b, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, y, { golge: false });
const ET = (t, a, b, s, bg, yz, fs, y, rot = -2) => MO.sar(etiket(s, 0, 0, bg, yz, fs, rot, 1), MO.oge(t, { gir: a, cik: b, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, y, { golge: false });
// kalp masajı çökme eğrisi: 2 Hz sürekli (t0'dan sonra) — tam geri yükselir
const cprD = (t, t0, f = 2, mx = 13) => { if (t < t0) return 0; const u = ((t - t0) * f) % 1; return mx * Math.pow(.5 - .5 * Math.cos(2 * Math.PI * u), .75); };
// aralıklı tek bas–bırak: [a, b] basılı aralıklar (bas hızlı, bırak hızlı)
const basBirak = (t, aralik, mx = 13) => { let d = 0; for (const [a, b] of aralik) { if (t >= a - .02 && t <= b + .18) d = Math.max(d, mx * MO.E.outQuad(MO.cl((t - a) / .14)) * (1 - MO.E.outQuad(MO.cl((t - b) / .16)))); } return d; };

const ob = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
