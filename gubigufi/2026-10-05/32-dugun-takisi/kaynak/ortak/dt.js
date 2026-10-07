/* #32 Düğün takısı kiti — salon, yüzsüz gelin/damat silüetleri, takı kurdelesi, kutular, merdiven, ikonlar. */
const DT = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const PEMBE = '#E86A9A', MOR = '#6A3A8E', LAC = '#1B2440';
  // düğün salonu: koyu mor, ışık zinciri, yuvarlak masalar, sahne
  function salon(t, { ton = 0 } = {}) {
    let o = `<rect width="1080" height="1920" fill="${ton ? '#2A1640' : '#3A1E52'}"/>` + R(0, 1180, 1080, 740, 0, '#24123A');
    o += `<ellipse cx="540" cy="760" rx="520" ry="380" fill="#FFD27A" opacity=".08"/>`;
    for (let k = 0; k < 3; k++) { let d = `M-20 ${300 + k * 110}`; for (let i = 0; i <= 8; i++) d += ` Q${i * 140 + 50} ${360 + k * 110} ${i * 140 + 120} ${300 + k * 110}`; o += `<path d="${d}" stroke="#5A3A70" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < 16; i++) { const x = i * 70 + 10 + k * 20, y = 300 + k * 110 + 28 * Math.sin((i % 2 ? .5 : 0) + 1.5) + (i % 2 ? 22 : 18); o += `<circle cx="${x}" cy="${y}" r="7" fill="#FFE9A8" opacity="${.55 + .45 * Math.sin(t * 3 + i + k)}"/>`; } }
    o += R(120, 1050, 840, 40, 12, '#6A3A8E') + R(120, 1050, 840, 10, 5, '#FFFFFF', .2);
    for (let i = 0; i < 9; i++) o += `<circle cx="${60 + i * 120}" cy="1240" r="6" fill="#FFE9A8" opacity=".5"/>`;
    return o;
  }
  // gelin silüeti (yüzsüz): beyaz kabarık elbise + duvak
  function gelin(x, y, s = 1, { renk = '#FFF6F0', golge = '#E8D8D0' } = {}) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="150" ry="18" fill="#000" opacity=".25"/>`;
    o += `<path d="M-150 0 Q-120 -200 -50 -260 L50 -260 Q120 -200 150 0Z" fill="${renk}"/><path d="M-150 0 Q-120 -200 -50 -260 L-20 -260 Q-70 -150 -60 0Z" fill="${golge}" opacity=".7"/>`;
    o += `<path d="M-56 -260 Q-60 -380 0 -390 Q60 -380 56 -260Z" fill="${renk}"/><circle cx="0" cy="-486" r="30" fill="#4A2A1A"/><path d="M-54 -420 Q-60 -470 -20 -480 L20 -480 Q60 -470 54 -420 Q50 -380 44 -372 L-44 -372 Q-50 -380 -54 -420Z" fill="#4A2A1A"/><circle cx="0" cy="-430" r="48" fill="#E8C8B0"/>` + `<path d="M-52 -418 Q-56 -484 -2 -482 Q-20 -462 -30 -446 Q-40 -428 -52 -418Z" fill="#5A3422"/><path d="M52 -418 Q56 -484 -2 -482 Q26 -470 34 -450 Q42 -430 52 -418Z" fill="#5A3422"/><path d="M-8 -478 Q18 -470 34 -452" stroke="#7A4A30" stroke-width="4" fill="none" opacity=".7"/>`;
    o += `<path d="M-40 -470 Q0 -500 40 -470 Q110 -300 90 -150 L-90 -150 Q-110 -300 -40 -470Z" fill="#FFFFFF" opacity=".45"/>`;
    o += `<path d="M-34 -472 Q0 -488 34 -472" stroke="#F2C230" stroke-width="8" fill="none"/>`;
    return o + '</g>';
  }
  // damat silüeti (yüzsüz) + kırmızı takı kurdelesi (çapraz); takılar: [{tip:'sikke'|'bilezik', u}] u 0..1 kurdele boyunca
  function damat(x, y, s = 1, { kurdele = false, takilar = [], renk = '#1E2238' } = {}) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="110" ry="16" fill="#000" opacity=".25"/>`;
    o += R(-48, -230, 40, 230, 16, renk) + R(8, -230, 40, 230, 16, renk);
    o += `<path d="M-90 -220 Q-96 -400 0 -410 Q96 -400 90 -220Z" fill="${renk}"/><path d="M-26 -410 L0 -330 L26 -410Z" fill="#FFFFFF"/><path d="M-20 -398 L0 -390 L20 -398 L20 -384 L0 -390 L-20 -384Z" fill="#111"/>`;
    o += `<circle cx="0" cy="-452" r="46" fill="#E8C8B0"/><path d="M-46 -468 Q0 -510 46 -468 L46 -478 Q0 -520 -46 -478Z" fill="#2A1A10"/>`;
    o += '</g>';
    if (kurdele) o += kurdeleCiz(x, y, s, takilar);
    return o;
  }
  const kP = (x, y, s, u) => [x + (-70 + 150 * u) * s, y + (-395 + 175 * u) * s];   // kurdele yolu
  function kurdeleCiz(x, y, s, takilar) {
    const [a1, b1] = kP(x, y, s, 0), [a2, b2] = kP(x, y, s, 1);
    let o = `<path d="M${a1} ${b1} L${a2} ${b2}" stroke="#D8283A" stroke-width="${46 * s}" stroke-linecap="round"/><path d="M${a1} ${b1 - 14 * s} L${a2} ${b2 - 14 * s}" stroke="#FF6A78" stroke-width="${6 * s}" opacity=".6"/>`;
    takilar.forEach(k => { const [px, py] = kP(x, y, s, k.u); if (k.gizli) return;
      o += `<g transform="translate(${k.dx || 0} ${k.dy || 0})" opacity="${k.op == null ? 1 : k.op}">` + (k.tip === 'bilezik' ? AL.bilezik(px, py + 6 * s, 30 * s, -15) : AL.sikke(px, py, 20 * s, { parla: k.parla || 0 })) + '</g>'; });
    return o;
  }
  function kutu(x, y, w, hh, baslik, renk, { op = 1, vurgu = 0 } = {}) {
    let o = `<g opacity="${op}">` + R(x - w / 2 + 8, y - hh / 2 + 12, w, hh, 30, '#000', .25) + R(x - w / 2, y - hh / 2, w, hh, 30, '#FFF8EE') + R(x - w / 2, y - hh / 2, w, 70, 30, renk) + R(x - w / 2, y - hh / 2 + 40, w, 30, 0, renk);
    o += T_(baslik, x, y - hh / 2 + 50, 38, '#FFFFFF', 900);
    if (vurgu > 0) o += `<rect x="${x - w / 2 - 8}" y="${y - hh / 2 - 8}" width="${w + 16}" height="${hh + 16}" rx="36" fill="none" stroke="#FFE45C" stroke-width="${10 * vurgu}"/>`;
    return o + '</g>';
  }
  function sepet(x, y, s = 1) { let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-160 -40 L160 -40 L130 90 L-130 90Z" fill="#B07A44"/>`;
    for (let i = 0; i < 6; i++) o += `<path d="M${-150 + i * 60} -40 L${-120 + i * 50} 90" stroke="#8A5A2A" stroke-width="6"/>`;
    return o + `<rect x="-170" y="-60" width="340" height="30" rx="14" fill="#C48A50"/></g>`; }
  function elSikis(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 10 L-30 -20 L20 10 L-20 40Z" fill="#F2C6A0"/><path d="M110 10 L30 -20 L-20 10 L20 40Z" fill="#E8B088"/><rect x="-150" y="-10" width="50" height="50" rx="10" fill="#4A8AD8"/><rect x="100" y="-10" width="50" height="50" rx="10" fill="#E8505B"/></g>`; }
  function telefon(x, y, s = 1, ic = '') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-110, -200, 220, 400, 34, '#1B1F3A') + R(-96, -180, 192, 360, 22, '#FFF3E0') + ic + R(-30, -194, 60, 8, 4, '#3A3F5C') + '</g>'; }
  function kamera(x, y, s = 1, rec = true, t = 0) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-140, -90, 220, 180, 26, '#2A2E40') + `<path d="M80 -50 L150 -90 L150 90 L80 50Z" fill="#2A2E40"/><circle cx="-30" cy="0" r="56" fill="#111"/><circle cx="-30" cy="0" r="34" fill="#3A5A9C"/><circle cx="-44" cy="-14" r="10" fill="#FFFFFF" opacity=".6"/>` +
    (rec ? `<circle cx="-110" cy="-60" r="12" fill="#E8323C" opacity="${Math.floor(t * 2) % 2 ? .3 : 1}"/>` + Tm('REC', -60, -50, 26, '#FFFFFF') : '') + '</g>'; }
  function muhur(x, y, s, yazi, renk = '#C8283A', rot = -12) { const w = Math.max(460, K.yaziGen(yazi, 66) + 90); return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="${-w / 2}" y="-70" width="${w}" height="140" rx="20" fill="none" stroke="${renk}" stroke-width="12"/>` + T_(yazi, 0, 22, 66, renk, 900) + '</g>'; }
  function merdiven(x, y, adim = 3, w = 260, hh = 130, renk = '#FFF3E0') { let o = ''; for (let i = 0; i < adim; i++) o += R(x + i * w, y - (i + 1) * hh, w, (i + 1) * hh, 10, renk) + R(x + i * w, y - (i + 1) * hh, w, 14, 7, '#FFFFFF', .5); return o; }
  return { PEMBE, MOR, LAC, salon, gelin, damat, kurdeleCiz, kP, kutu, sepet, elSikis, telefon, kamera, muhur, merdiven };
})();
