/* #20 Sarı & kırmızı kart — stadyum, kartlar, Londra, trafik ışığı (SK) + detay planlar (SKD). */
const SK = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const cipO = (s, x, y, renk, yazi, fs = 30) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  // stadyum: tribün (kalabalık, dönem şapkaları), skorbord, çim; zY = saha başlangıcı
  function stadyum(t, { zY = 1100, gok = '#9FD8F0', yazi = '1966', donem = 1966, gunes = false, sombrero = false } = {}) {
    let o = `<rect width="1080" height="1920" fill="${gok}"/>` + (gunes ? `<circle cx="880" cy="200" r="110" fill="#FFE45C"/><circle cx="880" cy="200" r="170" fill="#FFE45C" opacity=".25"/>` : CV.bulut(200, 180, .8));
    [[80, 120], [1000, 120]].forEach(([x, y]) => o += R(x - 10, y, 20, 420, 6, '#6A6A7A') + R(x - 60, y - 60, 120, 70, 12, '#3A3F5C') + [0, 1, 2].map(i => `<circle cx="${x - 36 + i * 36}" cy="${y - 25}" r="12" fill="#FFF3A0"/>`).join(''));
    o += `<path d="M0 360 L1080 360 L1080 ${zY} L0 ${zY}Z" fill="#8A8A9A"/>`;
    for (let r = 0; r < 12; r++) { const y = 400 + r * ((zY - 420) / 12); o += R(0, y + 30, 1080, 8, 0, '#6A6A7A', .5);
      for (let c = 0; c < 22; c++) { const x = c * 50 + (r % 2) * 25 + 10, v = h(r * 31 + c), dy = Math.sin(t * 6 + c + r) * (v > .8 ? 5 : 0), renk = ['#E8505B', '#FFFDF6', '#2E4A9A', '#FFB44C', '#6A4A2A', '#3FA35A'][Math.floor(v * 6)];
        o += `<rect x="${x - 14}" y="${y + dy + 6}" width="28" height="26" rx="10" fill="${renk}"/><circle cx="${x}" cy="${y + dy}" r="11" fill="${v > .5 ? '#F2C6A0' : '#E0A888'}"/>`;
        if (sombrero && v > .55) o += `<ellipse cx="${x}" cy="${y + dy - 8}" rx="20" ry="6" fill="#E8C060"/><path d="M${x - 8} ${y + dy - 8} Q${x} ${y + dy - 26} ${x + 8} ${y + dy - 8}Z" fill="#E8C060"/>`;
        else if (donem < 1975 && v > .45) o += `<ellipse cx="${x}" cy="${y + dy - 8}" rx="15" ry="5" fill="${v > .75 ? '#2A2A30' : '#5A4A3A'}"/><rect x="${x - 9}" y="${y + dy - 18}" width="18" height="10" rx="4" fill="${v > .75 ? '#2A2A30' : '#5A4A3A'}"/>`; } }
    o += R(360, 380, 360, 110, 14, '#1B1F3A') + R(376, 394, 328, 82, 8, '#0A2A1A') + `<text class="mono" x="540" y="452" font-size="52" text-anchor="middle" letter-spacing="6" style="fill:#FFE45C">${yazi}</text>`;
    o += R(0, zY, 1080, 1920 - zY, 0, '#3FA35A'); for (let i = 0; i < 6; i++) o += R(0, zY + i * 140, 1080, 70, 0, '#4FB86A', .7);
    o += `<path d="M0 ${zY + 380} Q540 ${zY + 300} 1080 ${zY + 380}" stroke="#FFFFFF" stroke-width="8" fill="none" opacity=".8"/>` + R(0, zY, 1080, 10, 0, '#FFFFFF', .8);
    return o; }
  function kart(x, y, s, renk, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-60, -86, 128, 180, 14, '#000', .18) + R(-66, -92, 132, 184, 14, renk) + R(-56, -82, 40, 120, 10, '#FFFFFF', .25) + '</g>'; }
  function oyuncu(x, y, boy, t, kod, i = 0, o2 = {}) { return KS.karakter(Object.assign({ x, y, boy, t }, KS.futbolcu(kod, i), o2)); }
  function kahvalti(T) { let o = CV.oda(T, { zeminY: 1250, pencere: [700, 280, 280, 340] }) + CV.cerceveResim(120, 420, 200, 150, T);
    o += R(80, 1080, 920, 40, 12, '#8E5A30') + R(120, 1120, 30, 200, 8, '#6A4020') + R(930, 1120, 30, 200, 8, '#6A4020') + CV.kupa(760, 1080, 1.2, '#E8505B', 1, 0) + `<ellipse cx="880" cy="1070" rx="70" ry="16" fill="#FFFDF6"/><rect x="840" y="1030" width="80" height="40" rx="10" fill="#E0A868"/>`;
    return o; }
  function gazete(x, y, s, rot, baslik, alt, p = 1) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-310, -400, 620, 800, 10, '#F3EEE2') + R(-310, -400, 620, 90, 10, '#1B1B1B') + Tm('THE DAILY · 1966', 0, -340, 34, '#F3EEE2', 'letter-spacing="4"') +
      `<text x="0" y="-230" font-size="${Math.min(86, 560 / (baslik.length * .58))}" font-weight="900" text-anchor="middle" style="fill:#1B1B1B" opacity="${p}">${baslik}</text>` + `<text x="0" y="-160" font-size="40" font-weight="700" text-anchor="middle" style="fill:#C8323C" opacity="${p}">${alt}</text>` +
      R(-270, -120, 300, 220, 8, '#9A9A9A') + `<circle cx="-170" cy="-30" r="40" fill="#6A6A6A"/><circle cx="-60" cy="-30" r="40" fill="#6A6A6A"/><rect x="-220" y="10" width="100" height="90" rx="20" fill="#6A6A6A"/><rect x="-110" y="10" width="100" height="90" rx="20" fill="#6A6A6A"/>` +
      [0, 1, 2, 3, 4, 5].map(i => R(60, -110 + i * 36, 210, 12, 6, '#8A8A8A')).join('') + [0, 1, 2, 3, 4, 5, 6].map(i => R(-270, 140 + i * 34, 540, 12, 6, '#8A8A8A')).join('') + '</g>'; }
  function londra(t) { let o = `<rect width="1080" height="1920" fill="#C8D8E8"/>` + CV.bulut(220, 220, .9, '#FFFFFF', '#DDE6EE') + CV.bulut(820, 160, .7, '#FFFFFF', '#DDE6EE');
    [[-20, 380, 300, '#B8A088'], [270, 300, 260, '#C8B8A0'], [520, 360, 280, '#A89080'], [790, 280, 310, '#B8A898']].forEach(([x, y, w, c]) => { o += R(x, y, w, 1250 - y, 0, c) + R(x, y - 20, w, 26, 4, '#6A5A4A');
      for (let yy = y + 50; yy < 1100; yy += 120) for (let xx = x + 30; xx < x + w - 50; xx += 80) o += R(xx, yy, 48, 80, 6, '#EEF4FA') + R(xx, yy + 38, 48, 5, 0, '#6A5A4A', .6); });
    o += R(0, 1250, 1080, 670, 0, '#6A6A78') + R(0, 1250, 1080, 30, 0, '#9A9AA8') + [0, 1, 2, 3, 4, 5].map(i => R(i * 200 + 40, 1560, 110, 14, 7, '#FFFFFF', .6)).join('');
    return o; }
  function otobus(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-260, -420, 520, 400, 30, '#C8232F') + R(-260, -420, 520, 20, 10, '#FFFFFF', .2) + [0, 1, 2, 3].map(i => R(-230 + i * 120, -390, 100, 80, 10, '#DDEEF8') + R(-230 + i * 120, -250, 100, 80, 10, '#DDEEF8')).join('') + R(-260, -290, 520, 16, 0, '#8E1B2F') + `<circle cx="-160" cy="-20" r="46" fill="#1B1B1B"/><circle cx="-160" cy="-20" r="18" fill="#9A9AA8"/><circle cx="170" cy="-20" r="46" fill="#1B1B1B"/><circle cx="170" cy="-20" r="18" fill="#9A9AA8"/>` + '</g>'; }
  function araba(x, y, s, sofor = '') { return `<g transform="translate(${x} ${y}) scale(${s})">` + `<path d="M-260 -60 Q-250 -150 -150 -160 L-90 -250 Q-40 -290 60 -290 Q150 -290 190 -200 L250 -160 Q290 -140 290 -60Z" fill="#2E9A9C"/>` + `<path d="M-70 -240 Q-30 -275 50 -275 Q120 -275 150 -200 L-110 -170Z" fill="#DDEEF8"/>` + sofor + `<circle cx="-150" cy="-50" r="56" fill="#1B1B1B"/><circle cx="-150" cy="-50" r="22" fill="#C9D2E0"/><circle cx="170" cy="-50" r="56" fill="#1B1B1B"/><circle cx="170" cy="-50" r="22" fill="#C9D2E0"/><circle cx="270" cy="-110" r="18" fill="#FFF3A0"/>` + '</g>'; }
  // trafik ışığı: yanan: 'sari'|'kirmizi'|'yesil'|null
  function isik(x, y, s, yanan, t = 0) { const L = (ad, cy, c) => { const on = yanan === ad; return `<circle cx="0" cy="${cy}" r="70" fill="${on ? c : '#3A3A40'}"/>` + (on ? `<circle cx="0" cy="${cy}" r="${140 + 10 * Math.sin(t * 8)}" fill="${c}" opacity=".25"/><circle cx="-22" cy="${cy - 22}" r="18" fill="#FFFFFF" opacity=".5"/>` : ''); };
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-18, 0, 36, 700, 10, '#3A3F5C') + R(-110, -520, 220, 520, 40, '#1B1F2A') + R(-130, -540, 260, 30, 14, '#1B1F2A') + L('kirmizi', -420, '#E8323C') + L('sari', -260, '#FFD23F') + L('yesil', -100, '#3FC85A') + '</g>'; }
  function tabelaSkor(x, y, s, satirlar) { let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-380, -60, 760, 120 + satirlar.length * 130, 26, '#1B1F3A');
    satirlar.forEach(([a, b, c], i) => { const yy = 40 + i * 130; o += R(-350, yy - 50, 700, 110, 16, '#0A2A1A') + `<text class="mono" x="-320" y="${yy + 18}" font-size="46" style="fill:#FFE45C">${a}</text><text class="mono" x="320" y="${yy + 18}" font-size="54" text-anchor="end" style="fill:${c || '#FFFFFF'}">${b}</text>`; });
    return o + '</g>'; }
  return { stadyum, kart, oyuncu, kahvalti, gazete, londra, otobus, araba, isik, tabelaSkor, cipO };
})();
const SKD = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#0A1020', g = .45) => `<defs><radialGradient id="skv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#skv)"/>`;
  function saat(d, t) { let o = `<rect width="1080" height="1920" fill="#2A3A2A"/>` + bul(`<rect x="0" y="0" width="1080" height="800" fill="#6A8A6A"/>`, 30);
    o += `<circle cx="540" cy="880" r="400" fill="#1B1F3A"/><circle cx="540" cy="880" r="360" fill="#FFFDF6"/>`;
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; o += R(540 + Math.cos(a) * 320 - 8, 880 + Math.sin(a) * 320 - 24, 16, 48, 8, '#1B1F3A').replace('<rect', `<rect transform="rotate(${a * 57.3 + 90} ${540 + Math.cos(a) * 320} ${880 + Math.sin(a) * 320})"`); }
    const ak = -Math.PI / 2 + d * 3.2, ay = -Math.PI / 2 + d * .27; o += `<path d="M540 880 L${540 + Math.cos(ay) * 180} ${880 + Math.sin(ay) * 180}" stroke="#1B1F3A" stroke-width="22" stroke-linecap="round"/><path d="M540 880 L${540 + Math.cos(ak) * 290} ${880 + Math.sin(ak) * 290}" stroke="#E8323C" stroke-width="12" stroke-linecap="round"/><circle cx="540" cy="880" r="24" fill="#1B1F3A"/>`;
    const c = ar(d, .3, .7); if (c > 0) o += `<g transform="translate(540 400) scale(${c})">` + SK.cipO('DAKİKALARCA', 0, 0, '#E8323C', '#FFFFFF', 44) + '</g>';
    return o + vin(); }
  function gazete(d) { let o = `<rect width="1080" height="1920" fill="#8E5A30"/>` + bul(`<circle cx="850" cy="300" r="240" fill="#FFB44C" opacity=".4"/>`, 30);
    o += SK.gazete(540, 900, 1.35, -3, "CHARLTON'LARA UYARI!", 'Kardeşler gazeteden öğrendi', ar(d, .2, .6));
    return o + vin('#1A0A04', .45); }
  function cepten(d) { let o = `<rect width="1080" height="1920" fill="#1B1B1B"/>` + bul(`<rect x="0" y="0" width="1080" height="1920" fill="#3A3A40"/><circle cx="540" cy="400" r="300" fill="#FFE45C" opacity=".2"/>`, 30);
    o += R(160, 900, 760, 1100, 60, '#2A2A30') + R(200, 900, 680, 90, 30, '#1B1B1B');
    const k = FX.E.expo(ar(d, .2, .9)); o += SK.kart(540, 1300 - 700 * k, 2.6, '#FFD23F', -8 + 8 * k);
    o += R(160, 980, 760, 1000, 0, '#2A2A30');
    const c = ar(d, 1.0, 1.3); if (c > 0) o += `<g transform="translate(540 400) scale(${c})">` + SK.cipO('İLK SARI KART', 0, 0, '#FFD23F', '#1B1640', 40) + '</g>';
    return o + vin('#000', .4); }
  return { saat, gazete, cepten };
})();
