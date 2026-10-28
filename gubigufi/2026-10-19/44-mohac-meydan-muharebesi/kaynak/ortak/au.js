/* #27 Asgari ücret — AU: grafik/para kiti (flat, kontursuz, tonal gölge + açık rim; marka paleti) */
const AU = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let n = 0; const id = p => `au${p}${++n}`;
  const C = { LAC: '#0B1433', LAC2: '#16224A', KREM: '#FFF3D6', KIR: '#E8505B', ALT: '#F2B630', ALTA: '#FFD978', ALTK: '#B0802A', YES: '#2FBF71', YESK: '#1E7A4A', MAV: '#4A8AD8', MAVK: '#2A5A9C', GRI: '#8A90A8' };
  // zemin: dikey gradyan + soluk sembol deseni
  function zemin(ust, alt, { desen = '', op = .06, renk = '#FFFFFF' } = {}) {
    const g = id('z'); let o = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${g})"/>`;
    if (desen) for (let r = 0; r < 14; r++) for (let c = 0; c < 7; c++) o += T_(desen, c * 170 + (r % 2) * 85 + 30, r * 150 + 60, 54, renk, 900, `opacity="${op}" transform="rotate(-12 ${c * 170 + (r % 2) * 85 + 30} ${r * 150 + 60})"`);
    return o;
  }
  const yaz = (s, x, y, fs, renk = C.KREM, w = 900, ek = '') => T_(s, x, y, fs, renk, w, ek);
  const sigYaz = (s, x, y, fs, maxW, renk = C.KREM, w = 900) => { const g = K.yaziGen(s, fs); const f = g > maxW ? fs * maxW / g : fs; return T_(s, x, y, f, renk, w); };
  function cip(s, x, y, zemin, yazi = C.LAC, fs = 36) { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.6; return R(x - w / 2, y - fs * 1.15, w, fs * 2.2, fs * 1.1, zemin) + `<text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; }
  function panel(x, y, w, hh, renk = C.LAC, op = 1, r = 34) { return R(x + 10, y + 14, w, hh, r, '#000', .22 * op) + R(x, y, w, hh, r, renk, op) + R(x + 16, y + 10, w - 32, 10, 5, '#FFFFFF', .12 * op); }
  // altın külçe (taban ortası x,y)
  function kulce(x, y, s = 1, op = 1) { return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><path d="M-52 0 L52 0 L40 -30 L-40 -30Z" fill="${C.ALT}"/><path d="M-40 -30 L40 -30 L32 -40 L-32 -40Z" fill="${C.ALTA}"/><path d="M28 -30 L40 -30 L52 0 L40 0Z" fill="${C.ALTK}" opacity=".55"/><path d="M-30 -18 L10 -18" stroke="#FFF3C4" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>`; }
  // n külçelik piramit; görünür sayısı g (0..n, kesirli: sonuncu düşerek gelir); taban (x,y)
  function piramit(x, y, n, g = n, s = 1) {
    const pos = []; let w = 1; while (w * (w + 1) / 2 < n) w++;
    let r = 0, left = n; while (left > 0) { const m = Math.min(w - r, left); for (let i = 0; i < m; i++) pos.push([x + (i - (m - 1) / 2) * 104 * s, y - r * 40 * s]); left -= m; r++; }
    let o = ''; const tam = Math.floor(g), q = g - tam;
    pos.forEach(([px, py], i) => { if (i < tam) o += kulce(px, py, s); else if (i === tam && q > 0) o += kulce(px, py - 300 * (1 - q) * (1 - q), s, cl(q * 3)); });
    return o;
  }
  // çubuk (taban ortası x, y0; yükseklik hh)
  function cubuk(x, y0, w, hh, renk, koyu, { etiket = '', alt = '', fs = 46, yaziRenk = C.KREM } = {}) {
    if (hh <= 0) return alt ? yaz(alt, x, y0 + 56, 40, yaziRenk, 800) : '';
    return R(x - w / 2 + 10, y0 - hh + 12, w, hh, 18, '#000', .2) + R(x - w / 2, y0 - hh, w, hh, 18, renk) + R(x + w / 2 - w * .22, y0 - hh, w * .22, hh, 14, koyu, .5) + R(x - w / 2 + 14, y0 - hh + 12, w * .14, Math.max(0, hh - 24), 7, '#FFFFFF', .2) +
      (etiket ? yaz(etiket, x, y0 - hh - 24, fs, yaziRenk) : '') + (alt ? yaz(alt, x, y0 + 56, 40, yaziRenk, 800) : '');
  }
  // trafik levhası: azami (kırmızı halka) / asgari (mavi daire)
  function levha(x, y, s, tip, sayi) {
    const az = tip === 'azami';
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-10, 60, 20, 300, 6, '#8A90A8') + `<circle cx="6" cy="10" r="132" fill="#000" opacity=".2"/>` +
      (az ? `<circle r="130" fill="#D7262E"/><circle r="98" fill="#FFFFFF"/>` + T_(sayi, 0, 38, 112, '#1B1F3A') : `<circle r="130" fill="#1F5FBF"/><circle r="118" fill="none" stroke="#FFFFFF" stroke-width="6"/>` + T_(sayi, 0, 38, 112, '#FFFFFF')) + '</g>';
  }
  // silgi (merkez), rot derece
  function silgi(x, y, s = 1, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-150, -54, 300, 120, 22, '#000', .2) + R(-160, -64, 300, 120, 22, '#F7A6B8') + R(-30, -64, 110, 120, 0, '#3E6FD8') + R(-160, -64, 300, 20, 10, '#FFFFFF', .25) + Tm('SİL', 25, 10, 34, '#FFFFFF') + '</g>'; }
  // pasta dilimi
  function dilim(cx, cy, r, a0, a1, renk, ofs = 0) { const m = (a0 + a1) / 2, dx = Math.cos(m) * ofs, dy = Math.sin(m) * ofs; const x0 = cx + dx + Math.cos(a0) * r, y0 = cy + dy + Math.sin(a0) * r, x1 = cx + dx + Math.cos(a1) * r, y1 = cy + dy + Math.sin(a1) * r; return `<path d="M${cx + dx} ${cy + dy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}Z" fill="${renk}"/>`; }
  // yarış jetonu
  function jeton(x, y, s, tip, alev = 0, T = 0) {
    const r = { maas: [C.YES, C.YESK, '₺'], dolar: [C.MAV, C.MAVK, '$'], altin: [C.ALT, C.ALTK, ''] }[tip];
    let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
    if (alev > 0) for (let i = 0; i < 3; i++) { const L = (90 + 40 * Math.sin(T * 30 + i * 2)) * alev; o += `<path d="M-60 ${-26 + i * 26} Q${-60 - L * .6} ${-34 + i * 26} ${-60 - L} ${-13 + i * 13} Q${-60 - L * .6} ${8 + i * 20} -60 ${0 + i * 22}Z" fill="${['#FF7A2E', '#FFB020', '#FFE45C'][i]}" opacity=".9"/>`; }
    o += `<ellipse cx="6" cy="78" rx="60" ry="14" fill="#000" opacity=".2"/><circle r="70" fill="${r[1]}"/><circle cx="-6" cy="-6" r="64" fill="${r[0]}"/>`;
    o += tip === 'altin' ? kulce(-6, 18, .85) : T_(r[2], -6, 26, 80, '#FFFFFF');
    return o + '</g>';
  }
  // sözlük kitabı (merkez, açık)
  function sozluk(x, y, s = 1, acik = 1) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-330, -200, 660, 420, 26, '#000', .2);
    o += R(-320 * acik, -210, 320 * acik, 420, 20, '#F7F0E0') + R(0, -210, 320, 420, 20, '#FFFBF0') + R(-6, -210, 12, 420, 4, '#D8CBB0');
    for (let i = 0; i < 7; i++) o += R(-280 * acik, -150 + i * 46, 230 * acik, 10, 5, '#CFC3A8', .8) + R(40, -150 + i * 46, i === 2 ? 120 : 230, 10, 5, i === 2 ? C.KIR : '#CFC3A8', .8);
    return o + R(-326, 200, 652, 26, 10, '#8E2B3A') + '</g>';
  }
  // rozet
  function rozet(x, y, s, yazi, renk = C.ALT, yaziRenk = C.LAC, cizik = 0) { const w = K.yaziGen(yazi, 30, { mono: true, ls: 2 }) + 50; return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-w / 2, -28, w, 56, 28, renk) + `<text class="mono" x="0" y="11" font-size="30" text-anchor="middle" letter-spacing="2" style="fill:${yaziRenk}">${yazi}</text>` + (cizik > 0 ? `<path d="M${-w / 2 - 6} 0 L${-w / 2 - 6 + (w + 12) * cizik} 0" stroke="${C.KIR}" stroke-width="8" stroke-linecap="round"/>` : '') + '</g>'; }
  // yorum balonu
  function balon(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + `<path d="M-120 -80 h240 a30 30 0 0 1 30 30 v100 a30 30 0 0 1 -30 30 h-150 l-50 44 v-44 h-40 a30 30 0 0 1 -30 -30 v-100 a30 30 0 0 1 30 -30Z" fill="#FFFFFF"/>` + [-50, 0, 50].map(dx => `<circle cx="${dx}" cy="0" r="16" fill="${C.LAC}"/>`).join('') + '</g>'; }
  // makine: ₺ → $
  function cevirici(x, y, s, T) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-200, -150, 400, 300, 34, '#000', .2) + R(-210, -160, 400, 300, 34, '#3A4466') + R(-180, -130, 340, 120, 20, '#0B1433') + T_('₺ → $', -10, -48, 64, C.ALTA) + `<circle cx="-110" cy="60" r="30" fill="${C.KIR}"/><circle cx="-20" cy="60" r="30" fill="${C.YES}"/>` + R(50, 40, 100, 40, 12, '#22284A') + R(-230, -40, 40, 20, 8, '#22284A') + `<g transform="rotate(${T * 200} 100 -200)"></g></g>`; }
  return { C, zemin, yaz, sigYaz, cip, panel, kulce, piramit, cubuk, levha, silgi, dilim, jeton, sozluk, rozet, balon, cevirici, R, T_, Tm, cl };
})();
