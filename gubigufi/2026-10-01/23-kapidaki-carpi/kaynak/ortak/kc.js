/* #23 Kapıdaki çarpı — HASSAS ŞABLON: şiddet çizilmez; kapı, boya, mum, ışık, harita.
   KC: koridor + kapı + boya çarpısı, 1978 kış sokağı (Maraş), gece silueti, üç kapı kartı.  KCD: detay planlar. */
const KC = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const cipO = (s, x, y, renk, yazi, fs = 30) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  const BOYA = '#C8232F';
  // boya çarpısı: p 0→1 iki fırça darbesi; s ölçek; damlalar
  function carpi(x, y, s, p, { renk = BOYA, op = 1 } = {}) { if (p <= 0) return ''; const a = cl(p * 2), b = cl(p * 2 - 1), L = 300;
    const darbe = (x1, y1, x2, y2, q) => `<path d="M${x1} ${y1} L${x1 + (x2 - x1) * q} ${y1 + (y2 - y1) * q}" stroke="${renk}" stroke-width="34" stroke-linecap="round" opacity=".95"/><path d="M${x1 + 8} ${y1 + 4} L${x1 + 8 + (x2 - x1) * q * .96} ${y1 + 4 + (y2 - y1) * q * .96}" stroke="#8E1018" stroke-width="8" stroke-linecap="round" opacity=".35"/>`;
    let o = `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">` + darbe(-110, -130, 110, 130, a) + (b > 0 ? darbe(110, -130, -110, 130, b) : '');
    if (p > .55) for (let i = 0; i < 4; i++) { const dx = [-80, -10, 60, 95][i], dl = 20 + 70 * cl((p - .55) * 2.5) * (.5 + h(i) * .8); o += `<path d="M${dx} ${40 + i * 20} L${dx} ${40 + i * 20 + dl}" stroke="${renk}" stroke-width="10" stroke-linecap="round"/><circle cx="${dx}" cy="${40 + i * 20 + dl}" r="8" fill="${renk}"/>`; }
    return o + '</g>'; }
  // ahşap kapı (günümüz apartman)
  function kapi(x, y, w, hh, { renk = '#8A5A3A', no = '3', acik = 0 } = {}) { const k = '#6A4028';
    let o = R(x - 18, y - 18, w + 36, hh + 18, 6, '#D8C8B0') + R(x, y, w, hh, 4, '#2A1A10');
    o += `<g transform="translate(${x} 0) scale(${1 - acik * .82} 1) translate(${-x} 0)">` + R(x, y, w, hh, 4, renk) + R(x + w * .12, y + hh * .08, w * .76, hh * .36, 6, k, .5) + R(x + w * .12, y + hh * .52, w * .76, hh * .4, 6, k, .5) + R(x, y, w * .06, hh, 0, '#FFFFFF', .08);
    o += `<circle cx="${x + w * .86}" cy="${y + hh * .52}" r="14" fill="#C8A040"/><rect x="${x + w * .82}" y="${y + hh * .5}" width="40" height="10" rx="5" fill="#C8A040"/>` + R(x + w * .42, y + hh * .2, w * .16, 46, 6, '#C8A040') + `<text x="${x + w * .5}" y="${y + hh * .2 + 34}" font-size="30" font-weight="900" text-anchor="middle" style="fill:#4A2A10">${no}</text></g>`;
    return o; }
  // koridor: sabah ışığı, iki kapı (hedef kapı + komşu), paspas, saksı
  function koridor(t, { komsuAcik = 0, isik = 1 } = {}) {
    let o = `<defs><linearGradient id="kcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EADFCB"/><stop offset="1" stop-color="#D8C8AE"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#kcd)"/>`;
    o += R(0, 1290, 1080, 630, 0, '#B8A48A') + [0, 1, 2, 3, 4, 5].map(i => R(0, 1290 + i * 110 + i * i * 6, 1080, 4, 0, '#A08A70', .6)).join('') + R(0, 1280, 1080, 16, 0, '#C8B49A');
    o += `<path d="M700 0 L1080 0 L1080 1290 L700 1290Z" fill="#FFF6E0" opacity="${.12 * isik}"/>`;               // pencereden vuran ışık
    o += `<ellipse cx="540" cy="90" rx="90" ry="22" fill="#FFF8D0" opacity=".9"/><path d="M450 100 L630 100 L760 700 L320 700Z" fill="#FFF8D0" opacity=".08"/>`;
    o += kapi(240, 540, 420, 740) + R(250, 1290, 400, 30, 8, '#6A5A4A');
    o += kapi(890, 540, 420, 740, { renk: '#7A6A5A', no: '4', acik: komsuAcik });
    o += `<g transform="translate(110 1290)">` + R(-40, -110, 80, 110, 10, '#C86A4A') + `<ellipse cx="0" cy="-130" rx="60" ry="50" fill="#4E8A52"/><ellipse cx="-30" cy="-170" rx="34" ry="40" fill="#5E9A62"/>` + '</g>';
    return o; }
  // 1978 kış sokağı (Maraş): tek/iki katlı evler, kiremit çatı, soba boruları ve duman, çıplak ağaç, elektrik direği, gri gök
  function sokak78(t, isaretP = 0) { let o = `<defs><linearGradient id="s78" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9AA0A8"/><stop offset="1" stop-color="#D8D4CC"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#s78)"/>`;
    o += `<path d="M0 760 Q200 680 420 720 Q700 660 1080 720 L1080 900 L0 900Z" fill="#7A8090" opacity=".5"/>`;   // uzak dağ
    const EV = [[-20, 300, 380, '#E8E0D0'], [270, 260, 330, '#D8C8A8'], [520, 300, 400, '#E0D8C8'], [810, 290, 360, '#D0C0A0']];
    EV.forEach(([x, w, hh, c], i) => { const y0 = 1240 - hh;
      o += R(x, y0, w, hh, 0, c) + `<path d="M${x - 20} ${y0} L${x + w / 2} ${y0 - 110} L${x + w + 20} ${y0}Z" fill="#A8503A"/>` + R(x + w * .7, y0 - 150, 18, 90, 2, '#5A5A60');
      const q = (t * .4 + i * .3) % 1; o += `<circle cx="${x + w * .7 + 9 + q * 40}" cy="${y0 - 160 - q * 120}" r="${18 + q * 30}" fill="#E8E8EC" opacity="${.5 * (1 - q)}"/>`;
      o += R(x + w * .15, y0 + 60, 70, 80, 4, '#6A8AA8') + `<path d="M${x + w * .15 + 35} ${y0 + 60} L${x + w * .15 + 35} ${y0 + 140}" stroke="#E8E0D0" stroke-width="5"/>`;
      const kx = x + w * .55, ky = 1240 - 210; o += R(kx, ky, 100, 210, 4, ['#5A6A7A', '#6A4A3A', '#4A5A4A', '#7A5A3A'][i]) + `<circle cx="${kx + 82}" cy="${ky + 110}" r="7" fill="#C8A040"/>`;
      if (i !== 1) o += carpi(kx + 50, ky + 90, .32, cl(isaretP * 1.6 - i * .2)); });
    o += `<g transform="translate(160 1240)"><path d="M0 0 L0 -330 M0 -200 L-70 -280 M0 -240 L60 -320 M0 -160 L50 -210" stroke="#4A3A30" stroke-width="16" stroke-linecap="round"/></g>`;
    o += R(980, 700, 16, 560, 3, '#5A4A40') + R(940, 720, 96, 10, 3, '#5A4A40') + `<path d="M0 760 Q500 800 1080 730" stroke="#2A2A30" stroke-width="3" fill="none"/>`;
    o += R(0, 1240, 1080, 680, 0, '#8A8478') + R(0, 1240, 1080, 40, 0, '#A8A296') + [0, 1, 2, 3].map(i => `<ellipse cx="${100 + i * 280}" cy="${1420 + (i % 2) * 120}" rx="110" ry="18" fill="#FFFFFF" opacity=".35"/>`).join('');   // karlı birikintiler
    for (let i = 0; i < 40; i++) { const q = (t * .18 + h(i)) % 1; o += `<circle cx="${h(i + 7) * 1080 + Math.sin(t + i) * 20}" cy="${q * 1300}" r="${2 + h(i + 3) * 3}" fill="#FFFFFF" opacity=".7"/>`; }   // hafif kar
    return o; }
  // gece şehir silueti, ufukta turuncu ışık (alev çizilmez)
  function gece(t) { let o = `<defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1226"/><stop offset=".7" stop-color="#2A1A2A"/><stop offset="1" stop-color="#6A2A1A"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#gc)"/>`;
    for (let i = 0; i < 50; i++) o += `<circle cx="${h(i) * 1080}" cy="${h(i + 40) * 700}" r="${1.5 + h(i + 9) * 2}" fill="#FFF3D6" opacity=".7"/>`;
    o += `<ellipse cx="620" cy="1180" rx="520" ry="200" fill="#E8742A" opacity="${.28 + .05 * Math.sin(t * 2)}"/><ellipse cx="620" cy="1180" rx="300" ry="110" fill="#F2A040" opacity=".2"/>`;
    for (let i = 0; i < 6; i++) { const q = (t * .12 + i / 6) % 1; o += `<ellipse cx="${520 + i * 40 + q * 80}" cy="${1100 - q * 600}" rx="${80 + q * 120}" ry="${40 + q * 60}" fill="#3A2A30" opacity="${.35 * (1 - q)}"/>`; }   // duman perdesi
    for (let b = 0; b < 24; b++) { const bx = b * 46 - 10, bh = 80 + h(b + 5) * 160; o += R(bx, 1240 - bh, 44, bh, 0, '#0A0A14') + `<path d="M${bx - 6} ${1240 - bh} L${bx + 22} ${1240 - bh - 30} L${bx + 50} ${1240 - bh}Z" fill="#0A0A14"/>`; }
    o += R(0, 1240, 1080, 680, 0, '#0A0A14');
    return o; }
  // üç kapı kartı
  function kart(x, y, yil, yer, ic, p, { kirmizi = 0 } = {}) { if (p <= 0) return ''; return `<g transform="translate(${x} ${y}) scale(${p})">` + R(-150, -260, 300, 520, 26, '#F4EEE2') + `<rect x="-150" y="-260" width="300" height="520" rx="26" fill="none" stroke="${BOYA}" stroke-width="${6 * kirmizi}" opacity="${kirmizi}"/>` + ic + cipO(yil, 0, 190, '#1B1640', '#FFE45C', 30) + `<text x="0" y="240" font-size="28" font-weight="800" text-anchor="middle" style="fill:#4A3A30">${yer}</text></g>`; }
  const kapiMini = (renk, isaret) => R(-80, -220, 160, 330, 6, renk) + R(-64, -200, 128, 120, 4, '#000', .12) + R(-64, -60, 128, 130, 4, '#000', .12) + `<circle cx="55" cy="-50" r="8" fill="#C8A040"/>` + isaret;
  const dukkanMini = () => R(-120, -220, 240, 300, 6, '#7A6A5A') + R(-100, -200, 200, 170, 4, '#BFD3DE') + `<path d="M-90 -120 L90 -150" stroke="#F4F4F4" stroke-width="20" stroke-linecap="round" opacity=".9"/><path d="M-80 -80 L60 -100" stroke="#F4F4F4" stroke-width="14" stroke-linecap="round" opacity=".8"/>` + R(-30, -10, 60, 90, 4, '#5A4A3A');
  function boyaYama(x, y) { let d = `M${x - 125} ${y - 140}`;
    for (let i = 0; i <= 10; i++) d += ` L${x - 125 + i * 25} ${y - 140 - (i % 2 ? 10 : 0)}`;
    for (let i = 0; i <= 10; i++) d += ` L${x + 125 + (i % 2 ? 12 : 0)} ${y - 140 + i * 28}`;
    for (let i = 0; i <= 10; i++) d += ` L${x + 125 - i * 25} ${y + 140 + (i % 2 ? 12 : 0)}`;
    for (let i = 0; i <= 10; i++) d += ` L${x - 125 - (i % 2 ? 10 : 0)} ${y + 140 - i * 28}`;
    return `<path d="${d}Z" fill="#F4F0E6"/>` + [0, 1, 2, 3, 4, 5, 6].map(k => `<path d="M${x - 115} ${y - 120 + k * 40} L${x + 115} ${y - 115 + k * 40}" stroke="#E2DCCC" stroke-width="5" opacity=".7"/>`).join('') + `<path d="M${x + 60} ${y + 150} L${x + 60} ${y + 190}" stroke="#F4F0E6" stroke-width="9" stroke-linecap="round"/><circle cx="${x + 60}" cy="${y + 192}" r="7" fill="#F4F0E6"/>`; }
  return { carpi, kapi, boyaYama, koridor, sokak78, gece, kart, kapiMini, dukkanMini, cipO, BOYA };
})();
const KCD = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const vin = (r = '#1A0A04', g = .5) => `<defs><radialGradient id="kcv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#kcv)"/>`;
  // ahşap üzerinde boya çarpısı yakın plan + alıntı kartı
  function carpiYakin(d, alinti = '') { let o = R(0, 0, 1080, 1920, 0, '#8A5A3A');
    for (let i = 0; i < 14; i++) o += `<path d="M0 ${i * 140 + 30} Q540 ${i * 140 + 10 + h(i) * 40} 1080 ${i * 140 + 40}" stroke="#6A4028" stroke-width="${4 + h(i + 3) * 6}" fill="none" opacity=".5"/>`;
    o += KC.carpi(540, 820, 2.3, 1) ;
    const a = cl((d - 2.6) / .4); if (a > 0 && alinti) o += `<g opacity="${a}">` + R(110, 360, 860, 170, 30, '#0B1433', .88) + `<text x="540" y="430" font-size="44" font-weight="800" text-anchor="middle" style="fill:#FFF3D6">“Burada kim yaşadığını</text><text x="540" y="490" font-size="44" font-weight="800" text-anchor="middle" style="fill:#FFF3D6">biliyoruz.”</text></g>`;
    return o + vin('#1A0A04', .55); }
  // 1978 kapı yakın plan: tokmak + taze boya
  function tokmak(d) { let o = R(0, 0, 1080, 1920, 0, '#5A6A7A') + R(140, 200, 800, 1500, 10, '#4A5A6A');
    o += `<g transform="translate(540 760)"><circle cx="0" cy="0" r="70" fill="none" stroke="#B8902A" stroke-width="22"/><circle cx="0" cy="-80" r="26" fill="#B8902A"/></g>`;
    o += KC.carpi(560, 1180, 1.5, cl(d / 1.2));
    return o + vin('#0A0A14', .55); }
  // mumlar + sayılar
  function mumlar(d) { let o = R(0, 0, 1080, 1920, 0, '#120C10') + `<g style="filter:blur(18px)"><circle cx="540" cy="1000" r="380" fill="#FFB45C" opacity=".22"/></g>`;
    for (let i = 0; i < 7; i++) { const x = 180 + i * 120, y = 1240 + (i % 2) * 40, f = 1 + .08 * Math.sin(d * 11 + i); o += R(x - 24, y - 200, 48, 200, 8, '#F4EEE0') + `<ellipse cx="${x}" cy="${y - 222 * f}" rx="${13 * f}" ry="${30 * f}" fill="#FFC45C"/><circle cx="${x}" cy="${y - 214}" r="${70 * f}" fill="#FFC45C" opacity=".12"/>`; }
    const a = cl((d - .3) / .4), b = cl((d - 3.4) / .4);
    o += `<text x="540" y="620" font-size="200" font-weight="900" text-anchor="middle" style="fill:#FFF3D6" opacity="${a}">${Math.round(111 * FX.E.expo(cl((d - .3) / 1.6)))}</text>` + `<text class="mono" x="540" y="700" font-size="34" text-anchor="middle" letter-spacing="4" style="fill:#C8B8A8" opacity="${a}">İDDİANAMEYE GÖRE</text>`;
    if (b > 0) o += `<g opacity="${b}">` + R(330, 760, 420, 90, 45, '#3A2A2A') + `<text x="540" y="822" font-size="46" font-weight="900" text-anchor="middle" style="fill:#FFC45C">559 EV YAKILDI</text></g>`;
    return o; }
  // beyaz boya fırçası darbesi yakın plan
  function firca(d) { let o = R(0, 0, 1080, 1920, 0, '#8A5A3A');
    for (let i = 0; i < 14; i++) o += `<path d="M0 ${i * 140 + 30} Q540 ${i * 140 + 10 + h(i) * 40} 1080 ${i * 140 + 40}" stroke="#6A4028" stroke-width="${4 + h(i + 3) * 6}" fill="none" opacity=".5"/>`;
    o += KC.carpi(540, 860, 2.3, 1);
    const p = FX.E.inOutQuart(cl(d / 1.3)), w = 1000 * p;
    for (let k = 0; k < 3; k++) o += R(40, 580 + k * 190, w, 180, 60, '#F6F2EA', .96);
    o += `<g transform="translate(${40 + w} ${770}) rotate(-8)">` + R(-30, -280, 60, 560, 14, '#E8E0D0') + R(-30, -40, 160, 80, 10, '#C8A060') + R(130, -18, 300, 36, 18, '#8A5A30') + '</g>';
    return o + vin('#1A0A04', .3); }
  return { carpiYakin, tokmak, mumlar, firca };
})();
