/* #18 Kral seni kıskanırdı — saray (üst yarı: 1000 yıl önce) / bugün (alt yarı) eşyaları (KR) + detay planlar (KRD). */
const KR = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  // taş saray (0..y1), karanlik 0..1 (mum ışığı atmosferi)
  function saray(y0, y1, t, { karanlik = 0 } = {}) {
    let o = R(0, y0, 1080, y1 - y0, 0, '#8A8A9A');
    for (let r = 0; r * 70 < y1 - y0; r++) for (let c = 0; c < 9; c++) o += R(c * 130 + (r % 2) * 65 - 40, y0 + r * 70 + 4, 124, 64, 8, h(r * 9 + c) > .5 ? '#9A9AAA' : '#8E8EA0');
    [[180, y0 + 120], [900, y0 + 120]].forEach(([x, y]) => o += `<path d="M${x - 70} ${y + 260} V${y + 60} Q${x} ${y - 20} ${x + 70} ${y + 60} V${y + 260}Z" fill="#3A4A6A"/><path d="M${x} ${y} V${y + 260} M${x - 70} ${y + 140} H${x + 70}" stroke="#6A6A7A" stroke-width="8"/>`);
    [[360, '#B8232F'], [720, '#2E4A9A']].forEach(([x, c]) => o += `<path d="M${x - 70} ${y0 + 40} H${x + 70} V${y0 + 360} L${x} ${y0 + 310} L${x - 70} ${y0 + 360}Z" fill="${c}"/><circle cx="${x}" cy="${y0 + 170}" r="36" fill="#F2B82A"/><path d="M${x - 80} ${y0 + 40} H${x + 80}" stroke="#6A4A2A" stroke-width="12"/>`);
    [[70, y0 + 420], [1010, y0 + 420]].forEach(([x, y]) => { const f = 1 + .12 * Math.sin(t * 13 + x); o += R(x - 10, y, 20, 80, 6, '#6A4A2A') + `<ellipse cx="${x}" cy="${y - 20 * f}" rx="${18 * f}" ry="${34 * f}" fill="#FF8A2A"/><ellipse cx="${x}" cy="${y - 14}" rx="9" ry="18" fill="#FFE45C"/><circle cx="${x}" cy="${y - 20}" r="${110 + 10 * Math.sin(t * 9)}" fill="#FFB44C" opacity=".18"/>`; });
    o += R(0, y1 - 90, 1080, 90, 0, '#6A6A7A') + `<path d="M380 ${y1} L440 ${y1 - 90} L640 ${y1 - 90} L700 ${y1}Z" fill="#9A2A3A"/>`;
    if (karanlik > 0) o += R(0, y0, 1080, y1 - y0, 0, '#0A0A20', .55 * karanlik);
    return o;
  }
  function taht(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + `<path d="M-130 0 V-420 Q0 -520 130 -420 V0Z" fill="#C8901A"/><path d="M-100 -40 V-390 Q0 -470 100 -390 V-40Z" fill="#9A2A3A"/>` + R(-160, -150, 320, 60, 16, '#C8901A') + R(-160, -150, 320, 16, 8, '#FFF3A0', .4) + R(-150, -90, 40, 90, 10, '#A8781A') + R(110, -90, 40, 90, 10, '#A8781A') + `<circle cx="0" cy="-440" r="22" fill="#E8323C"/></g>`; }
  function sandik(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-100, -110, 200, 110, 14, '#8E5A30') + R(-100, -110, 200, 20, 8, '#6A4020') + [0, 1, 2, 3, 4, 5].map(i => `<circle cx="${-70 + i * 28}" cy="${-120 - (i % 2) * 14}" r="18" fill="#F2B82A"/><circle cx="${-74 + i * 28}" cy="${-124 - (i % 2) * 14}" r="6" fill="#FFF3A0"/>`).join('') + R(-14, -80, 28, 30, 6, '#C8901A') + '</g>'; }
  // bugünün evi (y0..1920)
  function ev(y0, T) { let o = R(0, y0, 1080, 1920 - y0, 0, T.fon1) + R(0, y0, 1080, 14, 0, '#FFFDF6');
    o += R(760, y0 + 60, 240, 220, 16, T.koyu) + R(776, y0 + 76, 208, 188, 10, '#DFF3FF') + R(876, y0 + 76, 8, 188, 0, T.acik);
    o += R(0, 1780, 1080, 140, 0, T.orta);
    if (y0 < 1200) { o += R(40, y0 + 120, 260, 18, 6, T.cokKoyu) + [0, 1, 2, 3, 4, 5].map(i => R(50 + i * 40, y0 + 40 - (i % 2) * 14, 32, 80 + (i % 2) * 14, 6, ['#E8505B', '#FFB44C', '#8A6FE0', '#3FA35A', '#2E9AD8', '#F2B82A'][i])).join('') + CV.cerceveResim(380, y0 + 70, 160, 120, T);
      o += `<ellipse cx="540" cy="1860" rx="440" ry="50" fill="${T.vurgu2}" opacity=".35"/>` + R(600, 1600, 440, 140, 40, '#6A8AD8') + R(620, 1540, 400, 110, 36, '#7E9CE8') + R(590, 1570, 60, 180, 26, '#5A78C8') + R(990, 1570, 60, 180, 26, '#5A78C8') + R(700, 1560, 90, 70, 20, '#FFB44C'); }
    o += CV.bitki(80, 1780, .7, T) + CV.lamba(1010, 1780, .7, T);
    return o; }
  function bolucu(y) { return R(0, y - 10, 1080, 20, 0, '#FFFDF6') + `<rect x="0" y="${y - 3}" width="1080" height="6" fill="#1B1640" opacity=".15"/>`; }
  const etiketler = (y, cipF) => cipF('1000 YIL ÖNCE', 190, 330, '#3A2A1A', '#F2CE7A', 26) + cipF('BUGÜN', 950, y + 60, '#2E9AD8', '#FFFFFF', 26);
  function mum(x, y, s, t) { const f = 1 + .12 * Math.sin(t * 14); return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-24, -160, 48, 160, 8, '#FFF6E0') + `<ellipse cx="0" cy="${-190}" rx="${12 * f}" ry="${26 * f}" fill="#FFB44C"/><ellipse cx="0" cy="-184" rx="6" ry="12" fill="#FFF3A0"/><circle cx="0" cy="-185" r="90" fill="#FFE9A8" opacity=".22"/></g>`; }
  function ilac(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-110, -150, 220, 150, 16, '#FFFFFF') + R(-110, -150, 220, 40, 16, '#2E9AD8') + R(-20, -95, 40, 70, 6, '#E8323C') + R(-45, -70, 90, 20, 6, '#E8323C') + `<g transform="translate(120 -30) rotate(-30)"><rect x="-40" y="-16" width="80" height="32" rx="16" fill="#E8505B"/><rect x="0" y="-16" width="40" height="32" rx="16" fill="#FFFFFF"/></g></g>`; }
  function kerpeten(x, y, s, rot) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 L-30 160 M0 0 L30 160" stroke="#6A6A7A" stroke-width="18" stroke-linecap="round"/><path d="M0 0 L-12 -70 L12 -70Z" fill="#8A8A9A"/><circle cx="0" cy="0" r="12" fill="#3A3A4A"/></g>`; }
  function kitap(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -10 Q-120 -40 -200 -10 V120 Q-120 90 0 120Z" fill="#F4E6C8"/><path d="M0 -10 Q120 -40 200 -10 V120 Q120 90 0 120Z" fill="#FFF6DC"/>` + [0, 1, 2, 3].map(i => `<path d="M-180 ${16 + i * 22} Q-100 ${6 + i * 22} -20 ${16 + i * 22} M20 ${16 + i * 22} Q100 ${6 + i * 22} 180 ${16 + i * 22}" stroke="#8A7A6A" stroke-width="5" fill="none"/>`).join('') + '</g>'; }
  function dugme(x, y, s, acik) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-50, -80, 100, 160, 16, '#FFFDF6') + R(-22, -44, 44, 88, 10, '#E8E0D0') + R(-22, acik ? -44 : 0, 44, 44, 10, '#FFFFFF') + '</g>'; }
  function ampul(x, y, s, acik) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -200 V-120" stroke="#3A3F5C" stroke-width="6"/>` + R(-20, -120, 40, 30, 6, '#8A8A9A') + `<circle cx="0" cy="-50" r="50" fill="${acik ? '#FFF3A0' : '#DDDDDD'}"/>` + (acik ? `<circle cx="0" cy="-50" r="200" fill="#FFF3A0" opacity=".25"/>` : '') + '</g>'; }
  function dus(x, y, s, t, acik) { let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-260 Q0 -300 60 -300 H90" stroke="#9AA0B0" stroke-width="16" fill="none"/><path d="M60 -300 L140 -300 L160 -270 L40 -270Z" fill="#C8D0DC"/>`;
    if (acik) for (let i = 0; i < 12; i++) { const q = ((t * 2 + h(i)) % 1); o += `<path d="M${50 + (i % 6) * 20} ${-260 + q * 300} v30" stroke="#6CC8F0" stroke-width="5" opacity="${1 - q}"/>`; }
    if (acik) for (let i = 0; i < 3; i++) { const q = ((t * .5 + i / 3) % 1); o += `<circle cx="${120 + i * 30}" cy="${-150 - q * 200}" r="${30 * (1 - q) + 10}" fill="#FFFFFF" opacity="${.3 * (1 - q)}"/>`; }
    return o + '</g>'; }
  function nefes(x, y, t) { const q = (t * .8) % 1; return `<circle cx="${x + q * 60}" cy="${y - q * 30}" r="${14 + 20 * q}" fill="#FFFFFF" opacity="${.6 * (1 - q)}"/>`; }
  function sofraEski(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-260, 0, 520, 30, 10, '#6A4020') + OC.ekmek(-140, -40, .6) + `<ellipse cx="40" cy="-20" rx="90" ry="30" fill="#C8C0B0"/><ellipse cx="40" cy="-30" rx="60" ry="30" fill="#A8683A"/><path d="M180 -10 L170 -100 L230 -100 L220 -10Z" fill="#C8901A"/><ellipse cx="200" cy="-100" rx="30" ry="8" fill="#7A1A2A"/></g>`; }
  const yiyecek = {
    domates: `<circle cx="0" cy="0" r="40" fill="#E8323C"/><path d="M-14 -38 l14 10 l14 -10 l-6 14Z" fill="#3FA35A"/>`,
    patates: `<ellipse cx="0" cy="0" rx="48" ry="34" fill="#C8984A"/><circle cx="-14" cy="-6" r="4" fill="#8E6A2A"/><circle cx="16" cy="8" r="4" fill="#8E6A2A"/>`,
    misir: `<ellipse cx="0" cy="0" rx="22" ry="54" fill="#FFD23F"/>` + [0, 1, 2, 3].map(i => `<path d="M-18 ${-36 + i * 22} H18" stroke="#E8B020" stroke-width="4"/>`).join('') + `<path d="M-24 40 Q-40 -20 -10 -60 M24 40 Q40 -20 10 -60" stroke="#6CC04A" stroke-width="10" fill="none"/>`,
    cikolata: R(-44, -30, 88, 60, 6, '#5A2A1A') + [0, 1, 2].map(i => R(-40 + i * 28, -26, 24, 24, 4, '#7A3A2A')).join('') + R(-44, 6, 88, 24, 4, '#E8323C'),
    kahve: `<path d="M-34 -34 L-28 34 L28 34 L34 -34Z" fill="#FFFDF6"/><ellipse cx="0" cy="-34" rx="34" ry="8" fill="#6A3A1A"/><path d="M34 -20 Q60 -10 34 16" stroke="#FFFDF6" stroke-width="8" fill="none"/>`,
  };
  const yiy = (ad, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${yiyecek[ad]}</g>`;
  function poset(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + `<path d="M-120 0 L-100 -220 L100 -220 L120 0Z" fill="#E8D8B8"/>` + yiy('misir', -40, -250, .9) + yiy('domates', 40, -230, .9) + yiy('patates', 80, -200, .8) + `<path d="M-120 0 L-100 -220 L100 -220 L120 0Z" fill="#E8D8B8" opacity=".0"/>` + R(-120, -120, 240, 120, 10, '#E8D8B8') + '</g>'; }
  function atli(x, y, s, t) { const g = Math.sin(t * 14); return `<g transform="translate(${x} ${y}) scale(${s})">` + `<ellipse cx="0" cy="-140" rx="150" ry="70" fill="#6A4020"/><path d="M110 -170 L190 -260 L230 -230 L160 -140Z" fill="#6A4020"/><path d="M190 -260 L180 -300 L205 -270Z" fill="#4A2A10"/>` + [-100, -60, 60, 100].map((a, i) => `<path d="M${a} -100 L${a + (i % 2 ? 30 : -30) * g} 0" stroke="#4A2A10" stroke-width="22" stroke-linecap="round"/>`).join('') + `<path d="M-150 -160 Q-220 -140 -210 -80" stroke="#3A2010" stroke-width="16" fill="none"/>` +
      R(-30, -300, 70, 110, 20, '#2E4A9A') + `<circle cx="10" cy="-330" r="36" fill="#F2C6A0"/><path d="M-26 -340 Q10 -390 46 -340Z" fill="#6A7A4A"/>` + R(40, -260, 60, 40, 6, '#F4E6C8') + '</g>'; }
  function telefon(x, y, s, t, ic = '') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-110, -220, 220, 440, 36, '#1B1640') + `<clipPath id="tlf"><rect x="-96" y="-200" width="192" height="400" rx="26"/></clipPath><g clip-path="url(#tlf)">` + R(-96, -200, 192, 400, 26, '#BFE3F0') + ic + '</g>' + R(-30, -212, 60, 8, 4, '#3A3F5C') + '</g>'; }
  function lavtaci(x, y, boy, t) { let o = KS.karakter(Object.assign({ x, y, boy, t, ifade: 'gulumse', bak: [.5, -.3] }, KS.donem(1000, 2))); const s = boy / 700;
    o += `<g transform="translate(${x + 40 * s} ${y - 300 * s}) rotate(-30)"><ellipse cx="0" cy="0" rx="${90 * s}" ry="${70 * s}" fill="#C8894A"/><circle cx="0" cy="0" r="${20 * s}" fill="#6A4020"/><rect x="${60 * s}" y="${-10 * s}" width="${200 * s}" height="${20 * s}" rx="${8 * s}" fill="#8E5A30"/></g>`;
    for (let i = 0; i < 3; i++) { const q = ((t * .8 + i / 3) % 1); o += T_('♪', x + 160 * s + i * 50 * s, y - 500 * s - q * 200 * s, 70 * s, '#F2B82A', 900, `opacity="${1 - q}"`); } return o; }
  return { saray, taht, sandik, ev, bolucu, etiketler, mum, ilac, kerpeten, kitap, dugme, ampul, dus, nefes, sofraEski, yiy, poset, atli, telefon, lavtaci };
})();
const KRD = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#10101A', g = .45) => `<defs><radialGradient id="krv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#krv)"/>`;
  const cipO = (s, x, y, renk, yazi, fs = 34) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  function antibiyotik(d) {
    let o = `<rect width="1080" height="1920" fill="#DDEFF6"/>` + bul(`<circle cx="200" cy="300" r="260" fill="#FFFFFF"/><rect x="0" y="1300" width="1080" height="620" fill="#A8C8D8"/>`, 30);
    o += `<g transform="rotate(-6 540 900)">` + R(250, 560, 580, 760, 30, '#000', .15) + R(230, 540, 580, 760, 30, '#FFFFFF') + R(230, 540, 580, 160, 30, '#2E9AD8') + R(230, 660, 580, 40, 0, '#2E9AD8') + T_('ANTİBİYOTİK', 520, 650, 64, '#FFFFFF') + R(480, 780, 80, 160, 10, '#E8323C') + R(440, 820, 160, 80, 10, '#E8323C') + Tm('500 mg', 520, 1080, 40, '#3A3F5C') + '</g>';
    for (let i = 0; i < 3; i++) { const p = ar(d, .2 + i * .15, .5 + i * .15); if (p <= 0) continue; o += `<g transform="translate(${300 + i * 230} ${1450 - 60 * (1 - p)}) rotate(${-20 + i * 20})"><rect x="-70" y="-26" width="140" height="52" rx="26" fill="#E8505B"/><rect x="0" y="-26" width="70" height="52" rx="26" fill="#FFFFFF"/></g>`; }
    const k = ar(d, .7, 1.1); if (k > 0) o += `<g transform="translate(540 440) scale(${k})">` + cipO('1928 · PENİSİLİN', 0, 0, '#1B1640', '#FFE45C', 40) + '</g>';
    return o + vin('#0A2030', .35);
  }
  function dugme(d) {
    const acik = d > .6, p = ar(d, .3, .6);
    let o = `<rect width="1080" height="1920" fill="${acik ? '#FFF3D6' : '#3A3A5A'}"/>` + (acik ? `<circle cx="540" cy="600" r="700" fill="#FFF3A0" opacity=".4"/>` : '');
    o += R(290, 560, 500, 800, 60, '#000', .15) + R(270, 540, 500, 800, 60, '#FFFDF6') + R(420, 700, 200, 480, 40, '#E8E0D0') + R(420, acik ? 700 : 940, 200, 240, 40, '#FFFFFF') + R(420, acik ? 700 : 940, 200, 30, 20, '#000', .06);
    const fy = acik ? 880 : 1400 - 400 * p; o += `<g transform="translate(560 ${fy})"><rect x="-70" y="0" width="140" height="700" rx="70" fill="#F2C6A0"/><ellipse cx="0" cy="40" rx="50" ry="36" fill="#F8DCC8"/></g>`;
    if (acik) o += `<circle cx="540" cy="900" r="${300 * ar(d, .6, 1)}" fill="none" stroke="#FFFFFF" stroke-width="${16 * (1 - ar(d, .6, 1))}"/>`;
    return o + vin(acik ? '#6A4A10' : '#000010', .35);
  }
  function harita(d, h1) {
    let o = `<rect width="1080" height="1920" fill="#BFE3F0"/>` + h1.svg;
    const [ax, ay] = h1.p([-75, 10]), [ex, ey] = h1.p([5, 45]);
    const p = FX.E.expo(ar(d, .2, 1.4)); const mx = (ax + ex) / 2, my = Math.min(ay, ey) - 260;
    let dd = `M${ax} ${ay}`; for (let i = 1; i <= 30 * p; i++) { const u = i / 30; dd += ` L${(1 - u) * (1 - u) * ax + 2 * (1 - u) * u * mx + u * u * ex} ${(1 - u) * (1 - u) * ay + 2 * (1 - u) * u * my + u * u * ey}`; }
    o += `<path d="${dd}" stroke="#E07A3F" stroke-width="12" stroke-dasharray="26 16" fill="none" stroke-linecap="round"/>`;
    ['domates', 'patates', 'misir', 'cikolata'].forEach((ad, i) => { const q = ar(d, .3 + i * .2, .9 + i * .2); if (q <= 0) return; const u = Math.min(1, q), x = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * mx + u * u * ex + (i - 1.5) * 70 * (1 - u), y = (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * my + u * u * ey - 120 - (i % 2) * 70;
      o += `<circle cx="${x}" cy="${y}" r="62" fill="#FFFDF6" opacity=".92"/>` + KR.yiy(ad, x, y, 1); });
    const k = ar(d, .6, 1.0); if (k > 0) o += `<g transform="translate(540 480) scale(${k})">` + cipO('1492 SONRASI', 0, 0, '#1B1640', '#FFE45C', 40) + `</g><g transform="translate(540 1520) scale(${k})">` + cipO('AMERİKA → AVRUPA', 0, 0, '#E07A3F', '#FFFFFF', 34) + '</g>';
    return o;
  }
  return { antibiyotik, dugme, harita, cipO };
})();
