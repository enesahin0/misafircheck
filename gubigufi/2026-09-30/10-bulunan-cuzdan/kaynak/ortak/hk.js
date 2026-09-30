/* #10 Bulduğun Cüzdan — hukuk sahnesi eşyaları (HK). Flat, kontursuz, tonal gölge + rim. */
const HK = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm;
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  // ağaç: gövde + katmanlı yuvarlak taç; y = zemin
  function agac(x, y, s, taç, koyu, govde = '#6A3A20', kar = 0) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-22, -260, 44, 260, 18, govde) + R(-22, -260, 14, 260, 8, '#FFFFFF', .12);
    if (taç) o += `<circle cx="0" cy="-330" r="150" fill="${koyu}"/><circle cx="-90" cy="-290" r="100" fill="${koyu}"/><circle cx="90" cy="-285" r="100" fill="${koyu}"/><circle cx="-20" cy="-360" r="120" fill="${taç}"/><circle cx="70" cy="-320" r="80" fill="${taç}"/><circle cx="-80" cy="-310" r="70" fill="${taç}"/><circle cx="30" cy="-400" r="50" fill="#FFFFFF" opacity=".15"/>`;
    else o += `<path d="M0 -240 L-90 -380 M0 -260 L80 -400 M-50 -320 L-110 -330 M40 -330 L110 -350" stroke="${govde}" stroke-width="16" stroke-linecap="round"/>`;
    if (kar > 0) o += `<ellipse cx="0" cy="-420" rx="${140 * kar}" ry="${40 * kar}" fill="#FFFFFF"/><ellipse cx="-90" cy="-360" rx="${70 * kar}" ry="${20 * kar}" fill="#FFFFFF"/>`;
    return o + '</g>';
  }
  function yapraklar(t, renkler, n = 14, alan = [0, 1080, 0, 1900], kar = false) {
    let o = ''; for (let i = 0; i < n; i++) { const h = hash(i + 1), sp = 90 + h * 90, y = ((t * sp + h * 2000) % (alan[3] - alan[2])) + alan[2], x = alan[0] + ((h * 977 + Math.sin(t * 1.3 + i) * 40) % (alan[1] - alan[0]));
      o += kar ? `<circle cx="${x}" cy="${y}" r="${5 + h * 6}" fill="#FFFFFF" opacity=".9"/>` : `<ellipse cx="${x}" cy="${y}" rx="${14 + h * 8}" ry="${7 + h * 3}" transform="rotate(${t * 120 * (h - .5) + i * 40} ${x} ${y})" fill="${renkler[i % renkler.length]}"/>`; }
    return o;
  }
  function kimlik(x, y, s, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-150, -95, 300, 190, 16, '#BFE3F0') + R(-150, -95, 300, 44, 16, '#2E7FB8') + R(-150, -60, 300, 10, 0, '#2E7FB8') + Tm('KİMLİK KARTI', 0, -64, 20, '#FFFFFF', 'letter-spacing="3"') +
      R(-130, -30, 90, 110, 10, '#8FB8D0') + `<circle cx="-85" cy="5" r="26" fill="#F7B39A"/><path d="M-120 80 Q-85 30 -50 80Z" fill="#2E5A8C"/>` + [0, 1, 2, 3].map(i => R(-20, -20 + i * 26, 150 - i * 20, 12, 6, '#2E5A8C', .45)).join('') + '</g>'; }
  // yol tabelası: kollar = [[yazi, yon(-1 sol / 1 sağ), y, yanik 0..1, renk]]
  function direk(x, y0, y1, kollar) {
    let o = R(x - 16, y0, 32, y1 - y0, 14, '#5A5F78') + R(x - 16, y0, 10, y1 - y0, 6, '#FFFFFF', .15) + `<ellipse cx="${x}" cy="${y1}" rx="70" ry="14" fill="#000" opacity=".18"/>`;
    kollar.forEach(([yz, yon, yy, yan, renk]) => { const w = 330, x0 = yon > 0 ? x : x - w, c = renk || '#FFFDF6';
      const d = yon > 0 ? `M${x0} ${yy - 50} H${x0 + w - 40} L${x0 + w + 10} ${yy} L${x0 + w - 40} ${yy + 50} H${x0}Z` : `M${x0 + w} ${yy - 50} H${x0 + 40} L${x0 - 10} ${yy} L${x0 + 40} ${yy + 50} H${x0 + w}Z`;
      if (yan > 0) o += `<path d="${d}" fill="${renk || '#FFE45C'}" opacity="${.35 * yan}" transform="translate(0 0)" style="filter:blur(10px)"/>`;
      o += `<path d="${d}" fill="${yan > .5 ? (renk || '#FFE45C') : c}"/>` + T_(yz, x0 + w / 2 + (yon > 0 ? -10 : 10), yy + 18, 50, '#1B1640'); });
    return o;
  }
  function mahkeme(T) {
    let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>`;
    for (let i = 0; i < 6; i++) o += R(i * 180 + 10, 180, 160, 860, 12, T.fon2) + R(i * 180 + 30, 200, 120, 380, 8, T.orta, .35) + R(i * 180 + 30, 620, 120, 380, 8, T.orta, .35);
    o += R(0, 150, 1080, 40, 0, T.koyu) + Tm('ADALET MÜLKÜN TEMELİDİR', 540, 290, 44, T.cokKoyu, 'letter-spacing="6"');
    o += R(0, 1250, 1080, 670, 0, T.koyu) + R(0, 1250, 1080, 20, 0, T.cokKoyu, .6);
    for (let i = 0; i < 8; i++) o += R(i * 140, 1270, 8, 650, 0, '#000', .08);
    return o;
  }
  function kursu(x, y, T, levha = '') { // y = zemin çizgisi; yüksek hakim kürsüsü
    return R(x - 360, y - 400, 720, 400, 18, T.cokKoyu) + R(x - 380, y - 430, 760, 50, 16, T.koyu) + R(x - 330, y - 360, 200, 300, 12, T.koyu, .6) + R(x + 130, y - 360, 200, 300, 12, T.koyu, .6) + (levha ? R(x - 120, y - 330, 240, 70, 10, '#D8A032') + Tm(levha, x, y - 283, 32, T.cokKoyu) : ''); }
  function tokmak(x, y, s, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-8, -10, 16, 160, 8, '#8E5226') + R(-60, -50, 120, 60, 22, '#6A3A20') + R(-60, -50, 120, 18, 10, '#FFFFFF', .15) + R(-70, -46, 14, 52, 7, '#D8A032') + R(56, -46, 14, 52, 7, '#D8A032') + '</g>'; }
  function parmaklik(x, y, w, h, op) { let o = ''; for (let i = 0; i <= 6; i++) o += R(x + i * w / 6 - 14, y, 28, h, 14, '#1B1640', op); return o + R(x - 14, y + h * .12, w + 28, 22, 11, '#1B1640', op) + R(x - 14, y + h * .8, w + 28, 22, 11, '#1B1640', op); }
  function apartman(T, acik = 0) {
    let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>`;
    for (let r = 0; r < 12; r++) o += R(0, r * 110, 1080, 6, 0, T.fon2, .6);
    o += R(40, 160, 260, 300, 14, T.koyu) + R(56, 176, 228, 268, 10, T.isik) + R(166, 176, 8, 268, 0, T.acik) + R(780, 160, 260, 300, 14, T.koyu) + R(796, 176, 228, 268, 10, T.isik) + R(906, 176, 8, 268, 0, T.acik);
    o += R(600, 560, 360, 740, 20, T.cokKoyu) + R(620, 580, 320, 700, 12, '#2A1830');
    o += `<g transform="translate(620 0) scale(${1 - .85 * acik} 1) translate(-620 0)">` + R(620, 580, 320, 700, 12, T.orta) + R(650, 620, 260, 280, 10, T.koyu, .5) + R(650, 940, 260, 300, 10, T.koyu, .5) + `<circle cx="900" cy="940" r="16" fill="#F2CE7A"/>` + '</g>';
    o += R(560, 1290, 440, 30, 10, T.koyu) + R(560, 1300, 440, 14, 0, '#000', .1) + R(700, 470, 160, 70, 10, '#FFFDF6') + T_('No: 7', 780, 518, 40, T.cokKoyu) + `<circle cx="990" cy="820" r="18" fill="#FFFDF6"/><circle cx="990" cy="820" r="8" fill="${T.vurgu}"/>`;
    o += R(0, 1320, 1080, 600, 0, T.acik) + R(0, 1320, 1080, 16, 0, T.koyu, .4);
    o += R(90, 900, 360, 260, 12, T.koyu) + [0, 1, 2].map(r => [0, 1, 2].map(c => R(110 + c * 112, 920 + r * 78, 96, 64, 6, T.orta) + R(130 + c * 112, 944 + r * 78, 56, 10, 5, T.cokKoyu, .6)).join('')).join('') + Tm('POSTA', 270, 1195, 26, T.cokKoyu, 'letter-spacing="4"');
    return o;
  }
  function hediye(x, y, s, renk = '#E8505B', kurdele = '#FFE45C') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-70, -60, 140, 110, 12, renk) + R(-80, -80, 160, 36, 10, renk) + R(-12, -80, 24, 130, 6, kurdele) + R(-80, -70, 160, 16, 0, '#000', .08) +
      `<ellipse cx="-28" cy="-92" rx="30" ry="18" fill="${kurdele}" transform="rotate(-25 -28 -92)"/><ellipse cx="28" cy="-92" rx="30" ry="18" fill="${kurdele}" transform="rotate(25 28 -92)"/><circle cx="0" cy="-86" r="12" fill="${kurdele}"/></g>`; }
  // taştan "%10": parca > 0 ise parçalanır (0..1)
  function tas(x, y, s, catlak = 0, parca = 0) {
    if (parca > 0) { let o = ''; for (let i = 0; i < 12; i++) { const h = hash(i + 3), a = (i / 12) * Math.PI * 2, vx = Math.cos(a) * (300 + h * 300), vy = Math.sin(a) * 200 - 500, px = x + vx * parca * s, py = y + (vy * parca + 1400 * parca * parca) * s;
      o += `<g transform="translate(${px} ${py}) rotate(${parca * 400 * (h - .5)})" opacity="${1 - parca}"><path d="M-40 -30 L35 -45 L50 20 L-10 45 L-50 10Z" fill="${i % 2 ? '#9A94AE' : '#7E7896'}" transform="scale(${(.8 + h) * s})"/></g>`; } return o; }
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + `<ellipse cx="0" cy="250" rx="360" ry="40" fill="#000" opacity=".15"/>` + `<path d="M-330 240 L-300 -200 Q-290 -250 -240 -255 L250 -262 Q300 -258 310 -210 L340 240Z" fill="#8A849E"/><path d="M-300 -200 Q-290 -250 -240 -255 L250 -262 Q300 -258 310 -210 L300 -150 L-296 -150Z" fill="#A8A2BC"/>` +
      T_('%10', 0, 90, 290, '#5E5874') + T_('%10', -6, 82, 290, '#C9C3DA');
    if (catlak > 0) o += `<path d="M-40 -262 L-10 -120 L-70 -20 L10 90 L-30 240" stroke="#2A2440" stroke-width="10" fill="none" stroke-dasharray="${900 * catlak} 900"/><path d="M120 -255 L90 -100 L160 20" stroke="#2A2440" stroke-width="8" fill="none" stroke-dasharray="${500 * catlak} 500"/>`;
    return o + '</g>';
  }
  function damgaYazi(x, y, s, yazi, renk = '#C8323C', rot = -12, op = 1) { const w = K.yaziGen(yazi, 96) + 90; return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}"><rect x="${-w / 2}" y="-70" width="${w}" height="140" rx="16" fill="none" stroke="${renk}" stroke-width="16"/>` + T_(yazi, 0, 30, 96, renk) + '</g>'; }
  function binaIci(T, x0 = 540, w = 540) {
    let o = R(x0, 0, w, 1920, 0, T.fon1) + R(x0, 1180, w, 740, 0, T.acik);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) o += R(x0 + i * w / 4, 1180 + j * 185, w / 4 - 4, 181, 0, (i + j) % 2 ? T.fon2 : T.isik, .6);
    o += R(x0 + 60, 200, 140, 900, 20, T.fon2) + R(x0 + w - 200, 200, 140, 900, 20, T.fon2) + R(x0 + 50, 180, 160, 50, 12, T.orta) + R(x0 + w - 210, 180, 160, 50, 12, T.orta);
    return o;
  }
  function danisma(x, y, s, T, yazi = 'DANIŞMA') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-230, -230, 460, 230, 18, T.koyu) + R(-250, -250, 500, 40, 14, T.cokKoyu) + R(-120, -180, 240, 70, 10, '#FFFDF6') + Tm(yazi, 0, -133, 30, T.cokKoyu, 'letter-spacing="3"') + '</g>'; }
  function bank(x, y, s, T) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-220, -150, 440, 30, 12, '#8E5226') + R(-220, -110, 440, 30, 12, '#A8683A') + R(-230, -60, 460, 34, 12, '#A8683A') + R(-200, -30, 22, 30, 6, '#3A3F5C') + R(178, -30, 22, 30, 6, '#3A3F5C') + R(-200, -150, 18, 100, 6, '#3A3F5C') + R(182, -150, 18, 100, 6, '#3A3F5C') + '</g>'; }
  function kurdele(x, y, s, yazi = 'SENİN') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-200, -18, 400, 36, 6, '#E8505B') + R(-18, -120, 36, 240, 6, '#E8505B') + `<ellipse cx="-40" cy="-30" rx="46" ry="26" fill="#E8505B" transform="rotate(-25 -40 -30)"/><ellipse cx="40" cy="-30" rx="46" ry="26" fill="#E8505B" transform="rotate(25 40 -30)"/><circle cx="0" cy="-22" r="18" fill="#C8323C"/>` +
      `<path d="M60 10 L200 110 L190 180 L50 80Z" fill="#FFFDF6"/>` + T_(yazi, 128, 108, 40, '#C8323C', 900, 'transform="rotate(35 128 108)"') + '</g>'; }
  return { agac, yapraklar, kimlik, direk, mahkeme, kursu, tokmak, parmaklik, apartman, hediye, tas, damgaYazi, binaIci, danisma, bank, kurdele, hash };
})();
