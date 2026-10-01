/* #25 Türkiye saatleri — SS: İstanbul gün doğumu/öğle silueti, saat kadranları, takvim, gün çubuğu, ampul, 45° boylam haritası.
   SSD: detay planlar (Resmî Gazete, harita ucu, 13:00 kadran). */
const SS = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const mono = (s, x, y, fs, renk, ek = '') => `<text class="mono" x="${x}" y="${y}" font-size="${fs}" style="fill:${renk}" ${ek}>${s}</text>`;
  const yaz = (s, x, y, fs, renk, w = 900, anc = 'middle', ek = '') => `<text x="${x}" y="${y}" font-size="${fs}" font-weight="${w}" text-anchor="${anc}" style="fill:${renk}" ${ek}>${s}</text>`;
  const cipO = (s, x, y, renk, yazi, fs = 30) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  const hx = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mix = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const ALT = '#F2C14E', MAVI = '#4A8AD8', KOYU = '#0E1830';
  // ---------- İstanbul silueti (Galata, cami + minareler, binalar) ----------
  function siluet(renk, y0) { let o = '';
    for (let b = 0; b < 16; b++) { const bx = b * 70 - 20, bh = 70 + h(b + 3) * 150; o += R(bx, y0 - bh, 62, bh, 0, renk); if (h(b + 11) > .6) o += `<path d="M${bx} ${y0 - bh} L${bx + 31} ${y0 - bh - 32} L${bx + 62} ${y0 - bh}Z" fill="${renk}"/>`; }
    // Galata Kulesi
    o += R(262, y0 - 330, 76, 330, 0, renk) + R(250, y0 - 350, 100, 26, 6, renk) + `<path d="M256 ${y0 - 350} L300 ${y0 - 420} L344 ${y0 - 350}Z" fill="${renk}"/>` + R(296, y0 - 450, 8, 34, 2, renk);
    // cami: kubbe + 4 minare
    o += `<path d="M590 ${y0} Q590 ${y0 - 200} 740 ${y0 - 200} Q890 ${y0 - 200} 890 ${y0}Z" fill="${renk}"/><path d="M660 ${y0 - 190} Q740 ${y0 - 320} 820 ${y0 - 190}Z" fill="${renk}"/><circle cx="740" cy="${y0 - 322}" r="8" fill="${renk}"/>`;
    [570, 910, 640, 840].forEach((x, i) => { const hh = i < 2 ? 380 : 300; o += R(x - 11, y0 - hh, 22, hh, 0, renk) + R(x - 18, y0 - hh * .72, 36, 10, 3, renk) + `<path d="M${x - 11} ${y0 - hh} L${x} ${y0 - hh - 70} L${x + 11} ${y0 - hh}Z" fill="${renk}"/>`; });
    return o; }
  // p: 0 şafak (lacivert→turuncu) … 1 gün (mavi); gunes: [x, y] ; sokak lambaları p<.6 yanar
  function istanbul(t, p, gunes, { lamba = true } = {}) {
    const ust = mix('#0E1A44', '#5AAEEA', p), alt = mix('#F08A4A', '#D2EBFA', p), sil = mix('#0A0F22', '#2A3A5E', p), su = mix('#1A2A52', '#5AA0D8', p);
    let o = `<defs><linearGradient id="isk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient></defs><rect width="1080" height="1500" fill="url(#isk)"/>`;
    if (p < .5) for (let i = 0; i < 28; i++) o += `<circle cx="${h(i) * 1080}" cy="${h(i + 40) * 560}" r="${1.2 + h(i + 9) * 2}" fill="#FFF3D6" opacity="${(.7 - p * 1.4) * (.5 + .5 * Math.sin(t * 2 + i))}"/>`;
    if (gunes) { const [sx, sy] = gunes; o += `<circle cx="${sx}" cy="${sy}" r="${200 - 60 * p}" fill="#FFD27A" opacity="${.2 + .1 * p}"/><circle cx="${sx}" cy="${sy}" r="${120 - 20 * p}" fill="#FFE9A8" opacity=".5"/><circle cx="${sx}" cy="${sy}" r="${72}" fill="${p > .6 ? '#FFF3B0' : '#FFB45C'}"/>`; }
    o += siluet(sil, 1180) + R(0, 1180, 1080, 190, 0, su);
    for (let i = 0; i < 10; i++) o += R(60 + h(i) * 940, 1200 + (i % 4) * 40, 90 + h(i + 5) * 140, 5, 3, '#FFFFFF', .1 + .1 * Math.sin(t * 2 + i));
    o += R(0, 1370, 1080, 550, 0, mix('#2A2A3A', '#8A8A94', p)) + R(0, 1360, 1080, 20, 0, mix('#3A3A4A', '#B0B0B8', p));
    if (lamba) [140, 540, 940].forEach(x => { const on = p < .62 ? 1 : .15; o += R(x - 5, 1020, 10, 350, 3, '#2A2A34') + `<circle cx="${x}" cy="1010" r="22" fill="#FFD98A" opacity="${on}"/><circle cx="${x}" cy="1010" r="110" fill="#FFD98A" opacity="${.15 * on}"/>`; });
    return o; }
  // ---------- saat kadranı ----------
  function kadran(x, y, r, hh, mm, { yuz = '#FFFDF6', cerceve = '#1B2240', akrep = '#1B2240', yelkovan = '#E8323C', ad = '' } = {}) {
    let o = `<circle cx="${x}" cy="${y}" r="${r + 14}" fill="${cerceve}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${yuz}"/>`;
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30 - Math.PI / 2, uz = i % 5 ? r * .05 : r * .12; o += `<path d="M${x + Math.cos(a) * (r - 8)} ${y + Math.sin(a) * (r - 8)} L${x + Math.cos(a) * (r - 8 - uz)} ${y + Math.sin(a) * (r - 8 - uz)}" stroke="${cerceve}" stroke-width="${i % 5 ? 2 : 6}" stroke-linecap="round"/>`; }
    for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6 - Math.PI / 2; o += yaz(i, x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72 + r * .075, r * .2, cerceve, 800); }
    const ah = ((hh % 12) + mm / 60) * Math.PI / 6 - Math.PI / 2, ym = mm * Math.PI / 30 - Math.PI / 2;
    o += `<path d="M${x} ${y} L${x + Math.cos(ah) * r * .5} ${y + Math.sin(ah) * r * .5}" stroke="${akrep}" stroke-width="${r * .08}" stroke-linecap="round"/><path d="M${x} ${y} L${x + Math.cos(ym) * r * .75} ${y + Math.sin(ym) * r * .75}" stroke="${yelkovan}" stroke-width="${r * .05}" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r * .06}" fill="${cerceve}"/>`;
    if (ad) o += yaz(ad, x, y + r + 76, 44, '#FFFFFF', 900);
    return o; }
  // ---------- ampul ----------
  function ampul(x, y, s, on = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-30" r="${200 * on}" fill="#FFD866" opacity="${.3 * on}"/><path d="M-70 -20 Q-110 -110 -70 -190 Q0 -270 70 -190 Q110 -110 70 -20 L45 40 L-45 40Z" fill="${on > .5 ? '#FFE27A' : '#C8D0DC'}"/><path d="M-30 -120 Q0 -170 30 -120" stroke="#FFFFFF" stroke-width="10" fill="none" opacity=".7"/>` + R(-45, 40, 90, 22, 6, '#8A8A94') + R(-40, 62, 80, 18, 6, '#6A6A74') + R(-28, 80, 56, 14, 6, '#4A4A54') + '</g>'; }
  // ---------- takvim yaprağı ----------
  function takvim(x, y, s, gun, ay, yil, renk = '#E8323C') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-210, -230, 420, 460, 30, '#000', .18) + R(-220, -240, 440, 460, 30, '#FFFDF6') + R(-220, -240, 440, 120, 30, renk) + R(-220, -180, 440, 60, 0, renk) + yaz(ay, 0, -150, 56, '#FFFFFF') + yaz(gun, 0, 60, 190, '#1B2240') + yaz(yil, 0, 160, 64, '#6A6A7A', 800) + [-130, 130].map(a => R(a - 10, -270, 20, 56, 10, '#2A2A34')).join('') + '</g>'; }
  // ---------- gün çubuğu (iki satır) ----------
  const X0 = 110, SAAT = 61.4, xs = (hh, mm) => X0 + ((hh + mm / 60) - 6) * SAAT;
  function gunCubugu(a, c) { let o = R(X0, 1130, 860, 6, 3, '#9FB4D8');
    for (let q = 6; q <= 20; q += 2) o += R(xs(q, 0) - 2, 1120, 4, 26, 2, '#9FB4D8') + mono(String(q).padStart(2, '0'), xs(q, 0) - 20, 1180, 28, '#9FB4D8');
    const satir = (y, h1, h2, renk, w, bas, son, etiket) => { if (w <= 0) return ''; const xa = xs(...h1), xb = xs(...h2), wb = (xb - xa) * cl(w); let r = '';
      r += mono(etiket, X0, y - 28, 30, '#C8D8F0') + R(xa, y, wb, 120, 18, renk) + R(xa, y, wb, 16, 8, '#FFFFFF', .25);
      r += `<g transform="translate(${xa} ${y + 60}) scale(${cl(w * 5)})"><circle r="44" fill="#FFB020"/>${yaz('☀', 0, 18, 52, '#FFFFFF')}</g>` + mono(bas, xa - 38, y + 168, 36, '#FFFFFF', 'font-weight="700"');
      if (w >= .98) r += `<g transform="translate(${xb} ${y + 60})"><circle r="44" fill="#6A5AB8"/>${yaz('☾', 0, 18, 52, '#FFFFFF')}</g>` + mono(son, xb - 38, y + 168, 36, '#FFFFFF', 'font-weight="700"');
      return r; };
    o += satir(620, [7, 29], [16, 50], '#3A5A8A', FX.E.outExpo(cl(a)), '07:29', '16:50', 'SAAT GERİ ALINSAYDI');
    o += satir(900, [8, 29], [17, 50], ALT, FX.E.outExpo(cl(c)), '08:29', '17:50', 'GERÇEK · UTC+3');
    return o; }
  // ---------- Türkiye haritası + 45° boylam çizgisi ----------
  function harita(t, p, { kutu = [60, 560, 940, 480] } = {}) {
    const h1 = H.ciz({ ulkeler: H.ulke('Türkiye'), kutu, renk: '#D8CCB4', rim: '#F4ECDC', sinir: false });
    const x45 = h1.p([45, 39])[0], yU = h1.p([45, 41.5])[1], yA = h1.p([45, 37])[1];
    let o = h1.svg;
    const q = FX.E.outExpo(p); o += `<path d="M${x45} ${kutu[1] - 140} L${x45} ${kutu[1] + kutu[3] + 150}" stroke="#E8323C" stroke-width="8" stroke-dasharray="26 14" opacity="${q}"/>`;
    const lx = Math.min(x45, 930); o += `<g opacity="${q}">` + R(lx - 130, kutu[1] - 200, 260, 72, 36, '#E8323C') + yaz('45° DOĞU', lx, kutu[1] - 150, 40, '#FFFFFF') + '</g>';
    return { svg: o, x45, h1 }; }
  return { mono, yaz, cipO, istanbul, kadran, ampul, takvim, gunCubugu, harita, mix, ALT, KOYU };
})();
const SSD = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#0A0A14', g = .5) => `<defs><radialGradient id="ssv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#ssv)"/>`;
  // Resmî Gazete sayfası: kalıcı yaz saati
  function gazete(d) { let o = R(0, 0, 1080, 1920, 0, '#3A2A20') + bul(`<circle cx="860" cy="300" r="260" fill="#FFB45C" opacity=".3"/>`, 30);
    o += `<g transform="rotate(-1.5 540 960)">` + R(100, 300, 880, 1300, 6, '#F2EEE2') + R(100, 300, 880, 130, 6, '#1B1B1B') + SS.yaz('Resmî Gazete', 540, 395, 76, '#F2EEE2', 800);
    o += SS.mono('8 EYLÜL 2016 · SAYI: 29825', 140, 480, 28, '#4A4034', 'letter-spacing="2"') + R(100, 500, 880, 5, 0, '#1B1B1B');
    o += SS.yaz('BAKANLAR KURULU KARARI', 540, 600, 50, '#1B1B1B', 900);
    for (let i = 0; i < 4; i++) o += R(150, 650 + i * 30, 780, 11, 5, '#B8B4A8');
    const v = FX.E.outExpo(ar(d, .8, 1.8));
    o += R(150, 800, 780 * v, 150, 8, '#FFE45C', .9) + SS.yaz('YAZ SAATİ UYGULAMASI', 540, 872, 56, '#1B1B1B', 900, 'middle', `opacity="${Math.min(1, v * 2)}"`) + SS.yaz('YIL BOYUNCA SÜRDÜRÜLECEK', 540, 930, 38, '#8E1B2F', 800, 'middle', `opacity="${Math.min(1, v * 2)}"`);
    for (let i = 0; i < 12; i++) o += R(150, 1010 + i * 38, 780 - (i % 3) * 120, 11, 5, '#B8B4A8');
    const dm = FX.E.outExpo(ar(d, 2.9, 3.3)); if (dm > 0) o += `<g transform="translate(720 1230) rotate(-14) scale(${1.6 - .6 * dm})" opacity="${dm}"><rect x="-190" y="-70" width="380" height="140" rx="16" fill="none" stroke="#C8232F" stroke-width="14"/>` + SS.yaz('KALICI', 0, 36, 100, '#C8232F') + '</g>';
    return o + '</g>' + vin('#1A0A04', .5); }
  // haritanın doğu ucu çizgiye varmıyor
  function dogu(d) { let o = R(0, 0, 1080, 1920, 0, '#16203A');
    const k = SS.harita(0, 1, { kutu: [-1800, 520, 2700, 900] }), p = ar(d, .2, 1.2);
    o += `<g transform="translate(${-0} 0)">` + k.svg + '</g>';
    const xe = k.h1.p([44.8, 39.9])[0], ye = k.h1.p([44.8, 39.9])[1];
    o += `<circle cx="${xe}" cy="${ye}" r="${24 + 6 * Math.sin(d * 6)}" fill="#E8323C" opacity=".35"/><circle cx="${xe}" cy="${ye}" r="12" fill="#E8323C"/>`;
    const g = ar(d, 1.0, 1.7); if (g > 0) o += `<g opacity="${g}">` + R(xe - 480, ye + 90, 520, 150, 30, '#1B1640') + SS.yaz('EN DOĞU UCU', xe - 220, ye + 150, 40, '#9FC8FF', 800) + SS.yaz('~44,8° DOĞU', xe - 220, ye + 205, 56, '#FFFFFF') + '</g>';
    const x45 = k.x45, w2 = ar(d, 1.6, 2.2), xm = (xe + x45) / 2; if (w2 > 0) o += `<g opacity="${w2}"><path d="M${x45 + 110} ${ye - 150} L${xm} ${ye - 12}" stroke="#FFE45C" stroke-width="7" stroke-linecap="round"/><path d="M${xm + 22} ${ye - 40} L${xm} ${ye - 12} L${xm + 34} ${ye - 20}" stroke="#FFE45C" stroke-width="7" fill="none" stroke-linecap="round"/>` + SS.cipO('~0,2° KALA', Math.min(x45 + 270, 790), ye - 180, '#B8232F', '#FFFFFF', 30) + '</g>';
    o += `<g transform="translate(540 1190)">` + SS.cipO('ÇİZGİYE VARMIYOR', 0, 0, '#B8232F', '#FFFFFF', 40) + '</g>';
    return o + vin('#000', .25); }
  // büyük kadran 13:00 + tepede güneş
  function ogle(d) { let o = `<defs><linearGradient id="ogg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AA0E8"/><stop offset="1" stop-color="#CFE8FA"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#ogg)"/>`;
    o += `<circle cx="540" cy="300" r="190" fill="#FFE27A" opacity=".3"/><circle cx="540" cy="300" r="110" fill="#FFF3B0"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; o += `<path d="M${540 + Math.cos(a) * 140} ${300 + Math.sin(a) * 140} L${540 + Math.cos(a) * 190} ${300 + Math.sin(a) * 190}" stroke="#FFE27A" stroke-width="12" stroke-linecap="round" opacity=".8"/>`; }
    const m = FX.E.inOutQuart(ar(d, .2, 1.4));
    o += SS.kadran(540, 860, 300, 12, 55 + 5 * m) + SS.yaz(m > .98 ? '13:00' : '12:' + String(55 + Math.floor(5 * m)).padStart(2, '0'), 540, 1480, 110, '#1B2240');
    return o + vin('#0A1A30', .25); }
  return { gazete, dogu, ogle };
})();
