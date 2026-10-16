/* #16 Soğan — mutfak/laboratuvar eşyaları (SG) + detay planlar (SGD). Flat, kontursuz, tonal gölge + rim. */
const SG = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  function mutfak(T, zY = 1180) {
    let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) o += R(c * 124 + (r % 2) * 62 - 40, 640 + r * 90, 116, 82, 10, T.fon2, .7);
    o += R(40, 120, 300, 360, 18, T.koyu) + R(58, 138, 264, 324, 12, T.isik) + R(186, 138, 8, 324, 0, T.acik) + R(58, 296, 264, 8, 0, T.acik);
    o += R(420, 170, 600, 22, 8, T.cokKoyu); [[470, '#E8505B'], [560, '#FFB44C'], [650, '#6CC04A'], [740, '#8A6FE0'], [830, '#2E9A9C'], [920, '#E8505B']].forEach(([x, c], i) => o += R(x - 28, 170 - 90 - (i % 2) * 20, 56, 90 + (i % 2) * 20, 12, c) + R(x - 20, 170 - 100 - (i % 2) * 20, 40, 18, 6, T.cokKoyu));
    o += R(420, 330, 600, 14, 6, T.cokKoyu); for (let i = 0; i < 4; i++) { const x = 480 + i * 150; o += `<path d="M${x} 344 v40" stroke="${T.cokKoyu}" stroke-width="6"/><circle cx="${x}" cy="${440}" r="${50 - i * 5}" fill="#3A3F5C"/><rect x="${x - 6}" y="380" width="12" height="20" fill="#3A3F5C"/>`; }
    o += R(0, zY, 1080, 1920 - zY, 0, T.koyu) + R(0, zY - 30, 1080, 50, 14, T.cokKoyu) + R(0, zY - 30, 1080, 12, 6, '#FFFFFF', .12);
    for (let i = 0; i < 4; i++) o += R(30 + i * 265, zY + 80, 240, 560, 18, T.orta, .6) + R(120 + i * 265, zY + 120, 60, 14, 7, T.cokKoyu, .6);
    return o;
  }
  function tahta(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-300, -40, 600, 80, 30, '#A8683A') + R(-300, -40, 600, 20, 10, '#C8894A') + `<circle cx="250" cy="0" r="16" fill="#6A3A20"/></g>`; }
  function sogan(x, y, s = 1, { yarim = 0, rot = 0 } = {}) {
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`;
    if (!yarim) { o += `<path d="M0 -150 Q30 -90 110 -40 Q150 10 120 70 Q80 120 0 125 Q-80 120 -120 70 Q-150 10 -110 -40 Q-30 -90 0 -150Z" fill="#C8783A"/><path d="M0 -140 Q24 -86 96 -40 Q134 4 106 62 Q70 108 0 112 Q-70 108 -106 62 Q-134 4 -96 -40 Q-24 -86 0 -140Z" fill="#E8A060"/>`;
      o += `<path d="M-40 -90 Q-70 20 -30 110 M40 -90 Q70 20 30 110 M0 -140 L0 112" stroke="#C8783A" stroke-width="5" fill="none" opacity=".6"/><path d="M-6 -150 Q-10 -190 -30 -210 M6 -150 Q14 -200 30 -216" stroke="#8E5A2A" stroke-width="10" stroke-linecap="round" fill="none"/>`;
      o += [-30, -15, 0, 15, 30].map(a => `<path d="M${a * .6} 122 q${a * .4} 30 ${a} 40" stroke="#E0C8A0" stroke-width="5" fill="none"/>`).join('') + `<ellipse cx="45" cy="-60" rx="18" ry="34" fill="#FFFFFF" opacity=".25" transform="rotate(30 45 -60)"/>`; }
    else { o += `<ellipse cx="0" cy="0" rx="140" ry="120" fill="#C8783A"/>`; for (let i = 0; i < 6; i++) o += `<ellipse cx="0" cy="${4 * i}" rx="${130 - i * 20}" ry="${110 - i * 18}" fill="${i % 2 ? '#FFF6E0' : '#F2E2C0'}"/>`; o += `<ellipse cx="0" cy="24" rx="16" ry="12" fill="#E8D8B0"/>`; }
    return o + '</g>';
  }
  function bicak(x, y, s = 1, rot = 0, kor = false) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-260 -20 L60 -26 L60 26 L-230 26 Q-270 10 -260 -20Z" fill="${kor ? '#9AA0B0' : '#D8E0EE'}"/><path d="M-260 -20 L60 -26 L60 -8 L-250 -6Z" fill="#FFFFFF" opacity="${kor ? .1 : .5}"/>` + (kor ? [0, 1, 2, 3].map(i => `<path d="M${-200 + i * 60} 26 l10 -8 l10 8" fill="#6A7080"/>`).join('') : '') + `<rect x="60" y="-30" width="200" height="60" rx="26" fill="#3A2440"/><circle cx="110" cy="0" r="8" fill="#D8A032"/><circle cx="200" cy="0" r="8" fill="#D8A032"/></g>`; }
  // yükselen gaz (tahtadan): güç 0..1
  function gaz(x, y, t, guc = 1, gen = 300) { let o = ''; for (let i = 0; i < 7; i++) { const q = ((t * .45 + i / 7) % 1), yy = y - q * 900, xx = x + Math.sin(t * 2 + i * 1.7) * 50 + (i - 3) * gen / 7;
      o += `<path d="M${xx - 40} ${yy} q20 -50 40 0 q20 50 40 0" stroke="#9FE07A" stroke-width="${14 * (1 - q) + 4}" fill="none" stroke-linecap="round" opacity="${.7 * guc * Math.sin(q * Math.PI)}"/>`; } return o; }
  function molekul(x, y, s = 1) { const at = [[-110, 0, '#2A2440', 34], [-30, -30, '#2A2440', 34], [50, 0, '#2A2440', 34], [120, -40, '#FFD23F', 40], [130, 50, '#E8505B', 32]];
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 0 L-30 -30 L50 0 L120 -40 M120 -40 L130 50" stroke="#8A849E" stroke-width="14"/>`; at.forEach(([a, b, c, r]) => o += `<circle cx="${a}" cy="${b}" r="${r}" fill="${c}"/><circle cx="${a + r * .3}" cy="${b - r * .3}" r="${r * .3}" fill="#FFFFFF" opacity=".35"/>`);
    return o + T_('S', 120, -26, 34, '#1B1640') + T_('O', 130, 62, 30, '#FFFFFF') + '</g>'; }
  function lab(T) { let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + R(80, 200, 520, 340, 18, '#FFFFFF') + R(96, 216, 488, 308, 10, '#F4F8FA');
    o += `<path d="M130 460 Q220 300 320 420 T520 300" stroke="#2E9A9C" stroke-width="8" fill="none"/>` + Tm('C₃H₆OS', 340, 280, 34, '#2A2440') + R(700, 200, 300, 340, 18, T.koyu) + R(716, 216, 268, 308, 10, '#1B3A4A') + T_('LFS', 850, 400, 80, '#7CFFB0');
    o += R(0, 1150, 1080, 60, 14, T.cokKoyu) + R(0, 1200, 1080, 720, 0, T.koyu);
    [[160, '#7CC8FF'], [300, '#FFB44C'], [880, '#9FE07A']].forEach(([x, c]) => o += `<path d="M${x - 20} 1030 v-40 h40 v40 l50 110 h-140Z" fill="${c}" opacity=".85"/><rect x="${x - 26}" y="980" width="52" height="16" rx="6" fill="#FFFFFF" opacity=".7"/>`);
    o += `<g transform="translate(560 1150)"><rect x="-70" y="-30" width="140" height="30" rx="8" fill="#3A3F5C"/><rect x="-14" y="-200" width="28" height="170" rx="10" fill="#5A607E"/><rect x="-50" y="-260" width="70" height="90" rx="14" fill="#3A3F5C" transform="rotate(-20 -15 -215)"/></g>`;
    return o; }
  function buzdolabi(x, y, s, acik, T) { let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-200, -760, 400, 760, 30, '#DDE6EE') + R(-200, -760, 400, 20, 10, '#FFFFFF', .5);
    o += R(-180, -740, 360, 720, 20, '#B8D8F0') + [0, 1, 2].map(i => R(-180, -560 + i * 180, 360, 12, 4, '#FFFFFF', .8)).join('') + `<rect x="-180" y="-740" width="360" height="720" rx="20" fill="#EAF6FF" opacity=".4"/>`;
    o += `<g transform="translate(-200 0) scale(${Math.cos(acik * 1.4)} 1) translate(200 0)">` + R(-200, -760, 400, 760, 30, '#E8EEF4') + R(140, -520, 22, 200, 11, '#9AA0B0') + '</g>';
    return o + '</g>'; }
  function ekmek(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 -40 Q-80 -80 -40 -80 Q0 -100 40 -80 Q80 -80 70 -40 L60 50 L-60 50Z" fill="#C8894A"/><path d="M-56 -36 Q-62 -64 -32 -64 Q0 -80 32 -64 Q62 -64 56 -36 L48 40 L-48 40Z" fill="#F2DDB0"/></g>`; }
  function mum(x, y, s, t) { const f = 1 + .1 * Math.sin(t * 20); return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-180" width="52" height="180" rx="10" fill="#FFF6E0"/><path d="M0 -180 v-20" stroke="#3A2A20" stroke-width="4"/><ellipse cx="0" cy="${-222}" rx="${14 * f}" ry="${30 * f}" fill="#FFB44C"/><ellipse cx="0" cy="-214" rx="7" ry="14" fill="#FFF3A0"/><circle cx="0" cy="-215" r="60" fill="#FFE9A8" opacity=".25"/></g>`; }
  function soganKahraman(x, y, s, t) { let o = sogan(x, y, s); const gy = y - 10 * s;
    [-1, 1].forEach(k => o += `<ellipse cx="${x + k * 40 * s}" cy="${gy}" rx="${22 * s}" ry="${26 * s}" fill="#FFFFFF"/><circle cx="${x + k * 40 * s + 4 * s}" cy="${gy + 2 * s}" r="${11 * s}" fill="#1B1640"/>`);
    o += `<path d="M${x - 70 * s} ${gy - 40 * s} L${x - 20 * s} ${gy - 28 * s} M${x + 70 * s} ${gy - 40 * s} L${x + 20 * s} ${gy - 28 * s}" stroke="#6A3A20" stroke-width="${8 * s}" stroke-linecap="round"/>`;
    o += `<g transform="translate(${x + 150 * s} ${y + 10 * s}) rotate(${Math.sin(t * 2) * 4})"><path d="M0 ${-110 * s} L${90 * s} ${-80 * s} Q${95 * s} ${40 * s} 0 ${110 * s} Q${-95 * s} ${40 * s} ${-90 * s} ${-80 * s}Z" fill="#2E9A9C"/><path d="M0 ${-80 * s} L${60 * s} ${-60 * s} Q${64 * s} ${30 * s} 0 ${80 * s}Z" fill="#FFFFFF" opacity=".2"/></g>`;
    return o; }
  // Gufi gözyaşı: gufi(x,y,boy) göz konumlarından akan yaş
  function gufiYas(x, y, boy, t, guc = 1) { const s = boy / 140, gy = y - boy * .62; let o = ''; [-1, 1].forEach(k => { const ex = x + k * 24 * s;
      o += `<path d="M${ex + k * 10 * s} ${gy + 10 * s} Q${ex + k * 20 * s} ${gy + 50 * s} ${ex + k * 16 * s} ${gy + 110 * s}" stroke="#6CC8F0" stroke-width="${8 * s}" fill="none" stroke-linecap="round" opacity="${.85 * guc}"/>`;
      for (let i = 0; i < 2; i++) { const q = (t * 1.6 + i / 2 + (k > 0 ? .3 : 0)) % 1; o += `<ellipse cx="${ex + k * (18 + 40 * q) * s}" cy="${gy + (40 + 120 * q) * s}" rx="${6 * s}" ry="${9 * s}" fill="#6CC8F0" opacity="${(1 - q) * guc}"/>`; } }); return o; }
  return { mutfak, tahta, sogan, bicak, gaz, molekul, lab, buzdolabi, ekmek, mum, soganKahraman, gufiYas };
})();
const SGD = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#1A1030', g = .5) => `<defs><radialGradient id="sgv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#sgv)"/>`;
  const cipO = (s, x, y, renk, yazi, fs = 36) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  const damla = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFD23F"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .3}" fill="#FFFFFF" opacity=".6"/>`;
  const enzim = (x, y, r, a = 0, rot = 0) => { const m = .4 + .3 * Math.abs(Math.sin(a)); return `<path d="M${x} ${y} L${x + Math.cos(rot - m) * r} ${y + Math.sin(rot - m) * r} A${r} ${r} 0 1 0 ${x + Math.cos(rot + m) * r} ${y + Math.sin(rot + m) * r}Z" fill="#8A6FE0"/><circle cx="${x - Math.cos(rot) * r * .3}" cy="${y - Math.sin(rot) * r * .3 - r * .35}" r="${r * .14}" fill="#1B1640"/>`; };
  // hücre: iki bölme (koful: kükürtlü madde · sitoplazma: enzim); kükürt / enzim etiket zamanları
  function hucre(d, t, tK = 3.0, tE = 4.3) {
    let o = `<rect width="1080" height="1920" fill="#F6E8C8"/>`;
    for (let r = -1; r < 5; r++) for (let c = -1; c < 4; c++) o += bul(R(c * 380 + (r % 2) * 190 - 60, r * 440 + 60, 360, 420, 70, '#EAD6A8'), 6);
    o += R(90, 400, 900, 1000, 110, '#D8BE88') + R(110, 420, 860, 960, 96, '#FFF6DC');
    o += R(200, 520, 480, 560, 80, '#FFF0B0') + `<rect x="200" y="520" width="480" height="560" rx="80" fill="none" stroke="#E8C860" stroke-width="12" stroke-dasharray="4 16" stroke-linecap="round"/>`;
    for (let i = 0; i < 14; i++) { const x = 260 + (i % 4) * 110 + (Math.floor(i / 4) % 2) * 50, y = 590 + Math.floor(i / 4) * 130 + Math.sin(t * 2 + i) * 8, p = ar(d, .1 + i * .05, .3 + i * .05); if (p > 0) o += damla(x, y, 26 * p); }
    for (let i = 0; i < 6; i++) { const x = 790 + (i % 2) * 90, y = 560 + Math.floor(i / 2) * 220 + Math.sin(t * 3 + i) * 12, p = ar(d, .6 + i * .08, .8 + i * .08); if (p > 0) o += enzim(x, y, 44 * p, t * 6 + i, Math.PI + Math.sin(t + i) * .3); }
    const a = ar(d, tK, tK + .3), b = ar(d, tE, tE + .3);
    if (a > 0) o += `<g transform="translate(440 1180) scale(${a})">` + cipO('KÜKÜRTLÜ MADDE', 0, 0, '#FFD23F', '#1B1640', 34) + '</g>';
    if (b > 0) o += `<g transform="translate(830 330) scale(${b})">` + cipO('ENZİM', 0, 0, '#8A6FE0', '#FFFFFF', 36) + '</g>';
    return o + vin('#6A4A20', .35);
  }
  // yırtılma: bıçak iner, zar yırtılır, damlacık + enzim karışır, küçük tepkime parlamaları, yeşil gaz kabarcıkları
  function yirtil(d, t) {
    let o = `<rect width="1080" height="1920" fill="#F6E8C8"/>` + R(90, 400, 900, 1000, 110, '#D8BE88') + R(110, 420, 860, 960, 96, '#FFF6DC');
    const k = ar(d, 0, .35), mix = ar(d, .3, 1.6);
    const by = -300 + 1300 * Math.min(1, d / .35);
    o += R(200, 520, 480, 560, 80, '#FFF0B0');
    if (k > .5) o += `<path d="M430 520 L470 700 L410 860 L460 1080" stroke="#F6E8C8" stroke-width="${30 * k}" fill="none"/>`;
    for (let i = 0; i < 14; i++) { const x0 = 260 + (i % 4) * 110, y0 = 590 + Math.floor(i / 4) * 130, tx = 500 + h(i) * 400, ty = 560 + h(i + 5) * 700, x = x0 + (tx - x0) * mix, y = y0 + (ty - y0) * mix; o += `<circle cx="${x}" cy="${y}" r="${26 * (1 - .6 * mix)}" fill="#FFD23F"/>`; }
    for (let i = 0; i < 6; i++) { const x0 = 790 + (i % 2) * 90, y0 = 560 + Math.floor(i / 2) * 220, tx = 380 + h(i + 9) * 460, ty = 600 + h(i + 13) * 650; const x = x0 + (tx - x0) * mix, y = y0 + (ty - y0) * mix; o += enzim(x, y, 44, t * 8 + i, Math.atan2(ty - y0, tx - x0)); }
    for (let i = 0; i < 10; i++) { const q = ar(d, .8 + i * .08, 1.3 + i * .08); if (q > 0 && q < 1) o += `<circle cx="${420 + h(i + 21) * 440}" cy="${600 + h(i + 31) * 600}" r="${40 * q}" fill="none" stroke="#FFFFFF" stroke-width="${8 * (1 - q)}"/>`; }
    for (let i = 0; i < 12; i++) { const q = ((d * .6 + h(i) ) % 1) * ar(d, 1.0, 1.4); if (q <= 0) continue; o += `<circle cx="${400 + h(i + 40) * 480 + Math.sin(t * 3 + i) * 20}" cy="${1100 - q * 800}" r="${20 + 16 * h(i)}" fill="#9FE07A" opacity="${.7 * (1 - q)}"/>`; }
    o += `<g transform="translate(560 ${by}) rotate(90)">` + SG.bicak(0, 0, 2.4, 0) + '</g>';
    return o + vin('#6A4A20', .35);
  }
  // göz → sinir → beyin alarm → gözyaşı; aşamalar d cinsinden
  function goz(d, t, tSinir = 1.9, tBeyin = 3.7, tYas = 5.9) {
    let o = `<rect width="1080" height="1920" fill="#F7B8A4"/>` + bul(`<circle cx="540" cy="900" r="700" fill="#F9C8B4"/>`, 30);
    // beyin (üstte) + sinir hattı
    const bx = 780, by = 330, sn = ar(d, tSinir, tSinir + 1.2), al = d > tBeyin ? (Math.sin((d - tBeyin) * 14) > 0 ? 1 : .6) : 0;
    o += `<g transform="translate(${bx} ${by})"><path d="M-150 20 Q-170 -110 -60 -130 Q0 -170 70 -130 Q170 -120 160 10 Q170 90 60 100 Q0 120 -60 100 Q-170 110 -150 20Z" fill="${al ? '#FF6F8E' : '#F4A0B4'}"/><path d="M-100 -40 q40 -30 70 0 q30 30 70 0 M-90 40 q40 -30 80 0 q40 30 80 0" stroke="#D86A88" stroke-width="10" fill="none"/></g>`;
    if (al) o += `<circle cx="${bx}" cy="${by}" r="${230 + 40 * Math.sin(d * 20)}" fill="#FF3B3B" opacity="${.18 * al}"/>` + T_('!', bx + 190, by - 60, 150, '#E8323C');
    const sy = [[540, 900], [620, 700], [700, 520], [bx - 40, by + 80]];
    let path = `M${sy[0][0]} ${sy[0][1]}`; for (let i = 1; i < sy.length; i++) path += ` L${sy[i][0]} ${sy[i][1]}`;
    o += `<path d="${path}" stroke="#E8C0A0" stroke-width="18" fill="none" stroke-linejoin="round"/>` + (sn > 0 ? `<path d="${path}" stroke="#FFE45C" stroke-width="14" fill="none" stroke-linejoin="round" stroke-dasharray="${900 * sn} 900"/>` : '');
    // göz
    o += `<ellipse cx="540" cy="1000" rx="360" ry="220" fill="#FFFFFF"/><circle cx="540" cy="1000" r="150" fill="#7E4A2A"/><circle cx="540" cy="1000" r="70" fill="#1B1410"/><circle cx="580" cy="950" r="30" fill="#FFFFFF" opacity=".8"/>`;
    const kapak = d > tBeyin ? .35 + .15 * Math.sin(d * 12) : 0; o += `<path d="M160 1000 Q540 ${760 + 240 * kapak} 920 1000 Q540 700 160 1000Z" fill="#E89A84"/><path d="M160 1000 Q540 1240 920 1000 Q540 1300 160 1000Z" fill="#E89A84"/>`;
    for (let i = 0; i < 7; i++) o += `<path d="M${260 + i * 90} ${790 + Math.abs(3 - i) * 14 + 240 * kapak * (1 - Math.abs(3 - i) / 4)} l${-10 + i * 3} -40" stroke="#3A2020" stroke-width="8" stroke-linecap="round"/>`;
    // gaz göze gelir
    for (let i = 0; i < 6; i++) { const q = ((t * .5 + i / 6) % 1); o += `<path d="M${-60 + q * 560} ${1500 - q * 520 + Math.sin(i + t * 3) * 30} q20 -40 40 0 q20 40 40 0" stroke="#9FE07A" stroke-width="12" fill="none" stroke-linecap="round" opacity="${.8 * Math.sin(q * Math.PI) * (1 - ar(d, tYas + 1, tYas + 1.5) * .6)}"/>`; }
    // gözyaşı bezi (dış üst köşe) + yaş
    const ya = ar(d, tYas, tYas + .6); o += `<ellipse cx="860" cy="850" rx="60" ry="36" fill="#9AD8F0" opacity="${.5 + .5 * ya}"/>`;
    if (ya > 0) { o += `<path d="M860 870 Q900 1000 880 1240 Q870 1400 900 1600" stroke="#6CC8F0" stroke-width="${26 * ya}" fill="none" stroke-linecap="round" opacity=".85"/>`; for (let i = 0; i < 3; i++) { const q = ((t * 1.3 + i / 3) % 1); o += `<ellipse cx="${890 + 10 * q}" cy="${1250 + 500 * q}" rx="20" ry="28" fill="#6CC8F0" opacity="${1 - q}"/>`; } }
    const c1 = ar(d, tSinir + .2, tSinir + .5), c2 = ar(d, tBeyin + .2, tBeyin + .5), c3 = ar(d, tYas + .3, tYas + .6);
    if (c1 > 0) o += `<g transform="translate(320 640) scale(${c1})">` + cipO('SİNİR', 0, 0, '#FFE45C', '#1B1640', 34) + '</g>';
    if (c2 > 0) o += `<g transform="translate(480 250) scale(${c2})">` + cipO('ALARM', 0, 0, '#E8323C', '#FFFFFF', 34) + '</g>';
    if (c3 > 0) o += `<g transform="translate(700 1560) scale(${c3})">` + cipO('GÖZ YIKANIYOR', 0, 0, '#2E9AD8', '#FFFFFF', 30) + '</g>';
    return o + vin('#5A2020', .35);
  }
  function defter(d) {
    let o = `<rect width="1080" height="1920" fill="#2E5A6A"/>` + bul(R(0, 0, 1080, 700, 0, '#5A8A9A') + `<circle cx="850" cy="300" r="200" fill="#9FE0F0" opacity=".5"/>`, 30);
    o += `<g transform="rotate(-4 540 950)">` + R(150, 380, 800, 1100, 20, '#000', .25) + R(130, 360, 800, 1100, 20, '#FFFDF4');
    for (let i = 0; i < 20; i++) o += R(170, 470 + i * 50, 720, 3, 0, '#9AC8E0', .7);
    o += R(230, 360, 4, 1100, 0, '#E8A0A0') + `<text x="300" y="480" font-size="56" font-weight="700" style="fill:#2A3A7A">Deney notu</text>` + `<text x="880" y="480" font-size="48" font-weight="900" text-anchor="end" style="fill:#C8323C">2002</text>`;
    const p = ar(d, .2, .9); o += SG.sogan(420, 800, .9) + `<path d="M560 780 L700 780" stroke="#2A3A7A" stroke-width="8" stroke-dasharray="${140 * p} 200"/><path d="M690 766 L710 780 L690 794" stroke="#2A3A7A" stroke-width="8" fill="none" opacity="${p}"/>`;
    o += `<text x="800" y="800" font-size="60" font-weight="900" text-anchor="middle" style="fill:#2E9A5A" opacity="${p}">LFS</text>`;
    const q = ar(d, .6, 1.1); o += `<g opacity="${q}">` + `<text x="300" y="1050" font-size="54" font-weight="700" style="fill:#2A3A7A">Yeni enzim:</text>` + `<text x="300" y="1130" font-size="46" font-weight="700" style="fill:#2A3A7A">gözyaşı faktörü</text><text x="300" y="1200" font-size="46" font-weight="700" style="fill:#2A3A7A">sentazı</text>` + '</g>';
    const k = ar(d, 1.0, 1.4); if (k > 0) { const w = K.yaziGen('YENİ ENZİM', 70) + 90; o += `<g transform="rotate(-10 660 1320) translate(660 1320) scale(${2 - k}) translate(-660 -1320)" opacity="${k}"><rect x="${660 - w / 2}" y="1250" width="${w}" height="130" rx="16" fill="none" stroke="#C8323C" stroke-width="14"/>` + T_('YENİ ENZİM', 660, 1340, 70, '#C8323C') + '</g>'; }
    return o + '</g>' + vin('#0A1A20', .45);
  }
  // kör vs keskin bıçak kesit kıyası
  function bicakKiyas(d, t) {
    let o = R(0, 0, 540, 1920, 0, '#F2D6C0') + R(540, 0, 540, 1920, 0, '#D6EEE0') + R(532, 0, 16, 1920, 0, '#FFFFFF');
    const in_ = Math.min(1, d / .9);
    const hucreler = (x0, ez) => { let s = ''; for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) { const x = x0 + c * 150, y = 700 + r * 150, merkez = Math.abs(x - (x0 + 150)) < 10, e = merkez ? ez : 0;
        s += R(x - 65, y - 60 + 20 * e, 130, 120 - 40 * e, 30, merkez && e > .5 ? '#E8C860' : '#FFF6DC') + (merkez && e > .5 ? '' : `<circle cx="${x}" cy="${y}" r="20" fill="#FFD23F"/>`); if (merkez && e > .5) for (let i = 0; i < 4; i++) { const q = ((t * .8 + i / 4) % 1); s += `<circle cx="${x + (i - 1.5) * 40}" cy="${y - q * 300}" r="${18 * (1 - q)}" fill="#9FE07A" opacity="${1 - q}"/>`; } } return s; };
    o += hucreler(120, in_ > .6 ? 1 : 0) + hucreler(660, 0);
    if (in_ > .6) o += R(670 + 150 - 3, 600, 6, 800, 3, '#FFFFFF', .9);
    o += `<g transform="translate(270 ${-100 + 700 * in_}) rotate(90)">` + SG.bicak(0, 0, 1.6, 0, true) + '</g>' + `<g transform="translate(810 ${-100 + 700 * in_}) rotate(90)">` + SG.bicak(0, 0, 1.6, 0, false) + '</g>';
    const e = ar(d, .9, 1.2); if (e > 0) o += `<g transform="translate(270 1560) scale(${e})">` + cipO('KÖR · EZER ✗', 0, 0, '#C8323C', '#FFFFFF', 30) + `</g><g transform="translate(810 1560) scale(${e})">` + cipO('KESKİN · KESER ✓', 0, 0, '#2E9A5A', '#FFFFFF', 30) + '</g>';
    return o;
  }
  return { hucre, yirtil, goz, defter, bicakKiyas, cipO };
})();
