/* #35 Sel anında ne yapmalısın kiti — su basmış sokak, araba, rögar kesiti, elektrik direği, bodrum kesiti, araç içi adımlar. (SL, KP ile birlikte) */
const SE = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const SU = '#3E8EDE', SUA = '#8CC8F4', SUK = '#2A6AB0';
  const dalga = (y, t, renk = SUA, w = 8, gen = 14) => { let d = `M-20 ${y}`; for (let x = -20; x <= 1100; x += 60) d += ` Q${x + 30} ${y + (Math.floor((x + 20) / 60) % 2 ? gen : -gen) * Math.sin(t * 2 + x * .01)} ${x + 60} ${y}`; return `<path d="${d}" stroke="${renk}" stroke-width="${w}" fill="none"/>`; };
  function siluet(t, ufuk = 1000) {
    let o = AU.zemin('#2A3656', '#121A30');
    for (let i = 0; i < 14; i++) { const x = i * 80 - 20, hh = 160 + h(i) * 220; o += R(x, ufuk - hh, 74, hh, 4, '#1A2440'); for (let r = 0; r < 3; r++) o += R(x + 16, ufuk - hh + 30 + r * 60, 16, 22, 3, '#FFD27A', h(i * 7 + r) > .6 ? .5 : .08); }
    return o;
  }
  // su basmış sokak: su seviyesi y (üst çizgi), akış hızı
  function selSokak(t, suY = 900, { akis = 1 } = {}) {
    let o = siluet(t, 1000) + SL.bulut(260, 250, 1.4, '#3A4664') + SL.bulut(800, 210, 1.6, '#323E5A');
    o += R(0, suY, 1080, 1150 - suY, 0, SU, .9) + dalga(suY, t);
    for (let i = 0; i < 10; i++) { const x = ((h(i) * 1200 + t * 160 * akis) % 1300) - 110, y = suY + 50 + h(i + 4) * (1100 - suY - 80); o += `<path d="M${x} ${y} l70 0 m-16 -12 l16 12 l-16 12" stroke="${SUA}" stroke-width="5" fill="none" opacity=".55"/>`; }
    return o + SL.yagmur(t, { n: 110, op: .5 });
  }
  function araba(x, y, s = 1, { rot = 0, renk = '#E8323C' } = {}) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-150 -20 L-150 -70 Q-140 -90 -110 -92 L-70 -140 Q-60 -150 -40 -150 L60 -150 Q80 -150 92 -138 L130 -92 Q150 -88 152 -70 L152 -20Z" fill="${renk}"/>` +
      `<path d="M-60 -132 L-34 -132 L-34 -96 L-92 -96Z M-20 -132 L52 -132 L82 -96 L-20 -96Z" fill="#BFE0FF"/>` + R(-150, -40, 302, 20, 6, '#000', .2) +
      `<circle cx="-90" cy="-20" r="30" fill="#1A1A22"/><circle cx="-90" cy="-20" r="13" fill="#8A94A8"/><circle cx="92" cy="-20" r="30" fill="#1A1A22"/><circle cx="92" cy="-20" r="13" fill="#8A94A8"/></g>`;
  }
  function olcu(x, y0, y1, etiket, renk = '#FFE45C') { return `<path d="M${x} ${y0} V${y1} M${x - 16} ${y0} H${x + 16} M${x - 16} ${y1} H${x + 16}" stroke="${renk}" stroke-width="6"/>` + AU.cip(etiket, x + 120, (y0 + y1) / 2 + 12, renk, '#1B2440', 34); }
  // rögar kesiti: yüzeyde akan su, altında açık rögar
  function rogar(x, y, w, hh, t, gor = 1) {
    let o = `<g transform="translate(${x} ${y})">` + R(0, 0, w, hh, 26, '#1A2440');
    const yer = hh * .45;
    o += R(0, yer, w, hh - yer, 0, '#5A4A3A') + R(0, yer - 6, w, 10, 0, '#8A94A8');
    o += R(0, yer - 110, w, 110, 0, SU, .85) + dalga(yer - 110, t).replace(/M-20/, 'M0');
    for (let i = 0; i < 5; i++) { const xx = ((i * 190 + t * 180) % (w + 100)) - 60; o += `<path d="M${xx} ${yer - 60} l70 0 m-16 -12 l16 12 l-16 12" stroke="${SUA}" stroke-width="5" fill="none" opacity=".6"/>`; }
    const rx = w * .62;
    o += `<g opacity="${gor}">` + R(rx - 70, yer - 4, 140, hh - yer - 20, 10, '#0A0E18') + R(rx - 70, yer - 4, 140, 14, 4, '#3A3F50') + `<ellipse cx="${rx + 150}" cy="${yer - 30}" rx="70" ry="14" fill="#6A7488" transform="rotate(-25 ${rx + 150} ${yer - 30})"/>` + '</g>';
    return o + '</g>';
  }
  function direk(x, y, s, t) {
    const k = Math.sin(t * 30) > .6 ? 1 : 0;
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-12, -520, 24, 520, 8, '#5A6478') + R(-90, -500, 180, 16, 6, '#5A6478') +
      `<path d="M80 -492 Q140 -300 120 -60" stroke="#1A1A22" stroke-width="7" fill="none"/>` +
      `<g opacity="${k}"><path d="M120 -60 l-22 -10 l14 -8 l-26 -20 M120 -60 l24 -14 l-6 20 l22 -6" stroke="#FFE45C" stroke-width="6" fill="none"/></g><circle cx="120" cy="-60" r="${20 + 8 * k}" fill="#FFE45C" opacity=".35"/></g>`;
  }
  // bodrum kesiti: zemin kat + bodrum; su seviyesi s (0..1), kapı önünde su ka (0..1)
  function bodrum(x, y, w, hh, t, su, ka) {
    let o = `<g transform="translate(${x} ${y})">` + R(0, 0, w, hh, 26, '#1A2440');
    const zem = hh * .45;
    o += R(20, 60, w - 40, zem - 60, 6, '#3A4A6A') + R(0, zem, w, 18, 0, '#8A94A8') + R(20, zem + 18, w - 40, hh - zem - 40, 6, '#2A3450');
    // merdiven
    for (let i = 0; i < 6; i++) o += R(w - 300 + i * 40, hh - 40 - (i + 1) * ((hh - zem - 40) / 6), 40, (i + 1) * ((hh - zem - 40) / 6), 0, '#5A6478');
    // kapı (merdiven başı)
    o += R(w - 70, zem - 170, 40, 170, 4, '#8A6A4A');
    // dışarıdaki su (kapı önü)
    if (ka > 0) o += R(w - 30, zem - 160 * ka, 30, 160 * ka, 0, SU) + `<path d="M${w - 5} ${zem - 80 * ka} l-40 0 m14 -12 l-14 12 l14 12" stroke="#FFFFFF" stroke-width="6" fill="none" opacity="${ka}"/>`;
    // bodrumdaki su
    const sy = hh - 22 - (hh - zem - 40) * su; if (su > 0) o += R(20, sy, w - 40, hh - 22 - sy, 0, SU, .85) + dalga(sy, t, SUA, 5, 6).replace(/M-20/, 'M20');
    // sızıntı
    for (let i = 0; i < 3; i++) { const q = (t * 1.2 + i * .33) % 1; o += `<circle cx="${60 + i * 30}" cy="${zem + 30 + q * 120}" r="7" fill="${SUA}" opacity="${1 - q}"/>`; }
    return o + '</g>';
  }
  function sigorta(x, y, s, kuru) {
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-70, -100, 140, 160, 12, '#C8D0DC') + [0, 1, 2].map(i => R(-50 + i * 36, -70, 24, 50, 4, '#3A3F50') + R(-46 + i * 36, -60, 16, 18, 3, '#FFFFFF')).join('') +
      (kuru ? `<circle cx="70" cy="70" r="36" fill="#2FBF71"/><path d="M52 70 l14 14 l24 -28" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round"/>` : `<circle cx="70" cy="70" r="36" fill="#E8323C"/><path d="M54 54 l32 32 M86 54 l-32 32" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>`) + '</g>';
  }
  // araç içi adım kartı
  function adim(x, y, n, baslik, ikon, renk, p = 1) {
    return `<g transform="translate(${x} ${y}) scale(${p})">` + R(-160, -150, 320, 300, 34, '#000', .3) + R(-170, -160, 320, 300, 34, '#FFF8EE') + `<circle cx="-10" cy="-90" r="46" fill="${renk}"/>` + T_(String(n), -10, -72, 54, '#FFFFFF', 900) + ikon + T_(baslik, -10, 120, 56, '#1B2440', 900) + '</g>';
  }
  return { SU, SUA, dalga, siluet, selSokak, araba, olcu, rogar, direk, bodrum, sigorta, adim };
})();
