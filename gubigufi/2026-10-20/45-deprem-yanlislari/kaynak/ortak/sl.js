/* #34 İstanbul sel kiti — yağmur, kova, ölçü kabı, kesitler (hava kütlesi, metro/alt geçit, toprak/beton, dere, kanal), uyarı kartları. */
const SL = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const SU = '#3E8EDE', SUK = '#1E5A9C', SUA = '#8CC8F4';
  function yagmur(t, { x0 = 0, x1 = 1080, y0 = 0, y1 = 1920, n = 90, hiz = 1800, renk = '#BFE0FF', op = .6, egim = -.12 } = {}) {
    let o = ''; const H = y1 - y0;
    for (let i = 0; i < n; i++) { const x = x0 + h(i) * (x1 - x0), y = y0 + ((h(i + 7) * H + t * hiz * (.8 + .4 * h(i + 3))) % H), L = 30 + 30 * h(i + 5);
      o += `<path d="M${x} ${y} l${L * egim} ${L}" stroke="${renk}" stroke-width="3" stroke-linecap="round" opacity="${op}"/>`; }
    return o;
  }
  function bulut(x, y, s = 1, renk = '#5A6A88') { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="160" ry="70" fill="${renk}"/><circle cx="-70" cy="-30" r="70" fill="${renk}"/><circle cx="40" cy="-60" r="90" fill="${renk}"/><circle cx="110" cy="-10" r="60" fill="${renk}"/><ellipse cx="0" cy="30" rx="170" ry="30" fill="#000" opacity=".12"/></g>`; }
  // 10 litrelik kova; d 0..1 doluluk
  function kova(x, y, s = 1, d = 0) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="46" ry="8" fill="#000" opacity=".2"/><path d="M-40 -90 L40 -90 L32 0 L-32 0Z" fill="#C8D0DC"/>`;
    if (d > 0) { const hh = 86 * d, w = 32 + 8 * d; o += `<path d="M${-w} ${-hh - 2} L${w} ${-hh - 2} L32 -2 L-32 -2Z" fill="${SU}"/><ellipse cx="0" cy="${-hh - 2}" rx="${w}" ry="6" fill="${SUA}"/>`; }
    o += `<path d="M-40 -90 L40 -90 L32 0 L-32 0Z" fill="none" stroke="#8A94A8" stroke-width="5"/><path d="M-40 -90 Q0 -150 40 -90" stroke="#8A94A8" stroke-width="5" fill="none"/>`;
    return o + '</g>';
  }
  // ölçü kabı (silindir); d 0..1 (1'den büyükse taşar)
  function kap(x, y, w, hh, d, renk = SU, { etiket = '', alt = '' } = {}) {
    const dd = Math.min(1, d), su = hh * dd;
    let o = R(x - w / 2 + 8, y - hh + 10, w, hh, 18, '#000', .2) + R(x - w / 2, y - hh, w, hh, 18, '#EAF2FA', .9);
    if (su > 0) o += R(x - w / 2 + 8, y - su, w - 16, su - 8, 10, renk) + `<ellipse cx="${x}" cy="${y - su}" rx="${w / 2 - 8}" ry="10" fill="${SUA}"/>`;
    for (let i = 1; i < 6; i++) o += R(x + w / 2 - 34, y - hh * i / 6, 24, 4, 2, '#8A94A8');
    if (d > 1) { const k = Math.min(1, (d - 1) * 2); o += `<path d="M${x - w / 2 + 6} ${y - hh} q-40 ${hh * .4 * k} -30 ${hh * k}" stroke="${renk}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M${x + w / 2 - 6} ${y - hh} q40 ${hh * .4 * k} 30 ${hh * k}" stroke="${renk}" stroke-width="22" fill="none" stroke-linecap="round"/>`; }
    if (etiket) o += T_(etiket, x, y - hh - 70, 40, '#FFFFFF', 900);
    if (alt) o += Tm(alt, x, y + 60, 26, '#C8D8EE');
    return o;
  }
  // hava kütlesi kesiti: soğuk kama altta sağa ilerler, nemli hava yukarı itilir, bulut büyür; p 0..1
  function cepheKesit(x, y, w, hh, p, t) {
    let o = `<g transform="translate(${x} ${y})">` + R(0, 0, w, hh, 30, '#1A2440') + R(0, hh - 40, w, 40, 0, '#3A4A30');
    const kx = w * (.15 + .45 * p);
    o += `<path d="M0 ${hh - 40} L${kx} ${hh - 40} Q${kx * .55} ${hh - 40 - 220} 0 ${hh - 40 - 260}Z" fill="#4A8AD8" opacity=".85"/>` + Tm('SOĞUK', 70, hh - 80, 30, '#FFFFFF');
    o += `<path d="M${kx + 10} ${hh - 50} L${w} ${hh - 50} L${w} ${hh - 260} L${kx + 120} ${hh - 260}Z" fill="#E8843E" opacity=".55"/>` + Tm('NEMLİ', w - 90, hh - 90, 30, '#FFFFFF');
    for (let i = 0; i < 4; i++) { const ax = kx + 60 + i * 70, q = (t * .8 + i * .25) % 1; o += `<path d="M${ax} ${hh - 90 - q * 160} l0 -60 m-16 16 l16 -16 l16 16" stroke="#FFE0B0" stroke-width="7" fill="none" stroke-linecap="round" opacity="${(1 - q) * Math.min(1, p * 3)}"/>`; }
    const bs = .5 + 1.0 * p; o += bulut(kx + 180, 120, bs * .8, '#8A94B0');
    if (p > .55) o += yagmur(t, { x0: kx + 60, x1: kx + 320, y0: 180, y1: hh - 50, n: 40, op: (p - .55) * 2 });
    return o + '</g>';
  }
  // şehir kesiti panelleri (w×hh kutu içinde), p 0..1 animasyon
  function panelToprak(x, y, w, hh, t, p) {
    let o = `<g transform="translate(${x} ${y})">` + R(0, 0, w, hh, 24, '#22304E');
    const yer = hh * .58, yar = w / 2;
    o += R(0, yer, yar, hh - yer, 0, '#6A4A2A') + R(yar, yer, yar, hh - yer, 0, '#8A94A8') + R(yar, yer, yar, 16, 0, '#A8B0C0');
    for (let i = 0; i < 5; i++) o += `<path d="M${30 + i * 45} ${yer - 6} q6 -26 0 -40" stroke="#4A9A4A" stroke-width="7" fill="none"/>`;
    o += yagmur(t, { x0: 0, x1: w, y0: 20, y1: yer, n: 26, op: .7 });
    for (let i = 0; i < 4; i++) { const q = (t * .9 + i * .25) % 1; o += `<path d="M${40 + i * 55} ${yer + 20 + q * 110} l0 30 m-12 -12 l12 12 l12 -12" stroke="${SUA}" stroke-width="6" fill="none" opacity="${(1 - q) * p}"/>`; }
    const ak = p * (w * .45); o += R(yar, yer - 14, ak, 14, 7, SU) + `<path d="M${yar + ak - 30} ${yer - 36} l40 0 m-14 -14 l14 14 l-14 14" stroke="#FFFFFF" stroke-width="6" fill="none" opacity="${p}"/>`;
    o += Tm('TOPRAK: EMER', yar / 2, 50, 26, '#BFE8B0') + Tm('BETON: AKAR', yar * 1.5, 50, 26, '#FFD0A0');
    return o + '</g>';
  }
  function panelDere(x, y, w, hh, t, p) {
    let o = `<g transform="translate(${x} ${y})">` + R(0, 0, w, hh, 24, '#22304E');
    const yer = hh * .5; o += R(0, yer, w, hh - yer, 0, '#5A4A3A');
    o += R(w * .2, yer + 30, w * .6, 70, 35, '#2A3A5A') + R(w * .2, yer + 30, w * .6, 70 * Math.min(1, .4 + p), 35, SU);
    o += R(0, yer - 20, w, 24, 0, '#8A94A8') + R(w * .1, yer - 140, 120, 120, 6, '#C8B8A0') + R(w * .6, yer - 180, 140, 160, 6, '#B8A890');
    if (p > .5) { const k = (p - .5) * 2; o += `<path d="M${w * .5} ${yer + 30} Q${w * .5 + 20} ${yer - 40 * k} ${w * .5 + 120 * k} ${yer - 30}" stroke="${SU}" stroke-width="${26 * k}" fill="none" stroke-linecap="round"/>` + R(0, yer - 34, w, 16 * k, 8, SU, .9); }
    o += Tm('ÜSTÜ KAPATILAN DERE', w / 2, 50, 26, '#BFD8FF');
    return o + '</g>';
  }
  function panelKanal(x, y, w, hh, t, p) {
    let o = `<g transform="translate(${x} ${y})">` + R(0, 0, w, hh, 24, '#22304E');
    const yer = hh * .42; o += R(0, yer, w, hh - yer, 0, '#5A4A3A') + R(0, yer - 14, w, 14, 0, '#8A94A8');
    const cx = w / 2, cy = yer + 130, r = 70; o += `<circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="#6A7488"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#1A2238"/>`;
    const d = Math.min(1, p * 1.3); o += `<clipPath id="kclp"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><rect x="${cx - r}" y="${cy + r - 2 * r * d}" width="${2 * r}" height="${2 * r * d}" fill="${SU}" clip-path="url(#kclp)"/>`;
    o += R(cx - 14, yer - 14, 28, cy - r - yer + 14, 0, '#6A7488');
    if (p > .75) { const k = (p - .75) * 4; o += `<ellipse cx="${cx}" cy="${yer - 18}" rx="${40 + 160 * k}" ry="${12 + 10 * k}" fill="${SU}" opacity=".9"/>` + `<path d="M${cx} ${yer - 20} l0 ${-60 * k}" stroke="${SUA}" stroke-width="16" stroke-linecap="round"/>`; }
    o += yagmur(t, { x0: 0, x1: w, y0: 20, y1: yer - 14, n: 24, op: .7 });
    o += Tm('KANAL KAPASİTESİ', w / 2, 50, 26, '#BFD8FF');
    return o + '</g>';
  }
  // metro girişi + alt geçit kesiti, su seviyesi s 0..1
  function metro(x, y, s, su) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-220, -40, 440, 40, 0, '#8A94A8') + R(-170, -230, 340, 190, 16, '#2A3A6A') + R(-150, -210, 300, 60, 10, '#E8323C') + T_('M', 0, -165, 48, '#FFFFFF', 900);
    for (let i = 0; i < 6; i++) o += R(-120 + i * 20, -140 + i * 16, 260 - i * 40, 14, 4, '#5A6478');
    o += R(-130, -140 + (1 - su) * 100, 260, su * 100, 0, SU, .85);
    return o + '</g>';
  }
  function kart(x, y, w, hh, ikon, satir1, satir2, renk = '#E8323C', op = 1) {
    return `<g opacity="${op}">` + R(x - w / 2 + 8, y - hh / 2 + 12, w, hh, 30, '#000', .3) + R(x - w / 2, y - hh / 2, w, hh, 30, '#FFF8EE') + R(x - w / 2, y - hh / 2, 150, hh, 30, renk) + R(x - w / 2 + 110, y - hh / 2, 40, hh, 0, renk) +
      T_(ikon, x - w / 2 + 75, y + (ikon.length > 1 ? 18 : 26), ikon.length > 1 ? 46 : 76, '#FFFFFF', 900) + T_(satir1, x + 75, y - 6, 38, '#1B1640', 900) + Tm(satir2, x + 75, y + 42, 26, '#5A6478') + '</g>';
  }
  return { SU, SUK, SUA, yagmur, bulut, kova, kap, cepheKesit, panelToprak, panelDere, panelKanal, metro, kart };
})();
