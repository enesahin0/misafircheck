/* #17 Orta Çağ köylü sofrası — köy, kulübe, kazan, malzemeler (OC) + detay planlar (OCD). Flat, kontursuz. */
const OC = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  function kulube(x, y, s = 1, duvar = '#E8D2A8', cati = '#B8894A') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-160, -200, 320, 200, 6, duvar) + [0, 1, 2].map(i => R(-160 + i * 120, -200, 14, 200, 0, '#8E6A3A')).join('') + R(-160, -110, 320, 12, 0, '#8E6A3A') +
      `<path d="M-200 -190 L0 -380 L200 -190Z" fill="${cati}"/><path d="M-200 -190 L0 -380 L-20 -190Z" fill="#000" opacity=".08"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-180 + i * 80} -190 l40 -60" stroke="#8E6A3A" stroke-width="5" opacity=".5"/>`).join('') + R(-40, -130, 80, 130, 36, '#6A4A2A') + R(70, -160, 60, 50, 6, '#3A2A1A') + '</g>'; }
  function koy(T, t = 0) {
    let o = `<rect width="1080" height="1920" fill="${T.isik}"/>` + CV.bulut(220, 220, .9) + CV.bulut(860, 300, .7);
    o += `<path d="M0 900 Q300 780 620 860 Q880 920 1080 820 V1920 H0Z" fill="${T.fon2}"/>` + `<g transform="translate(860 880)">` + R(-50, -240, 100, 240, 6, '#C8BEA8') + `<path d="M-60 -240 L0 -380 L60 -240Z" fill="#8A7A6A"/>` + R(-16, -170, 32, 50, 16, '#5A4A3A') + '</g>';
    o += `<path d="M0 1080 Q540 1000 1080 1080 V1920 H0Z" fill="${T.orta}"/>`;
    o += kulube(230, 1120, 1.0) + kulube(700, 1100, .85, '#F0DCB4', '#A8783A') + HK.agac(480, 1110, .7, T.orta, T.koyu) + HK.agac(1000, 1120, .8, T.fon2, T.koyu);
    for (let i = 0; i < 14; i++) o += R(20 + i * 76, 1180, 12, 90, 5, '#8E6A3A') ; o += R(0, 1200, 1080, 10, 5, '#8E6A3A') + R(0, 1240, 1080, 10, 5, '#8E6A3A');
    o += `<path d="M380 1920 Q480 1500 540 1270 L620 1270 Q640 1500 760 1920Z" fill="#9A7A5A"/>` + [0, 1, 2, 3].map(i => `<ellipse cx="${520 + i * 30}" cy="${1400 + i * 120}" rx="${50 + i * 10}" ry="14" fill="#7A5A3A" opacity=".6"/>`).join('');
    return o;
  }
  function kulubeIc(T) {
    let o = `<rect width="1080" height="1920" fill="#D8B888"/>` + [0, 1, 2, 3, 4, 5].map(i => R(i * 200 - 20, 0, 12, 1250, 0, '#A8845A', .6)).join('') + R(0, 180, 1080, 40, 0, '#6A4A2A') + R(0, 520, 1080, 30, 0, '#6A4A2A');
    o += R(80, 280, 260, 18, 6, '#6A4A2A') + [0, 1, 2].map(i => R(100 + i * 80, 200, 56, 80, 14, ['#A8683A', '#8A8A6A', '#C8A060'][i])).join('');
    for (let i = 0; i < 5; i++) o += `<path d="M${640 + i * 70} 220 v60" stroke="#6A4A2A" stroke-width="4"/>` + `<path d="M${640 + i * 70} 280 l-20 60 l40 0Z" fill="${['#6CA040', '#8FB050', '#5A8A3A'][i % 3]}"/>`;
    o += R(0, 1250, 1080, 670, 0, '#8E6A42') + [0, 1, 2, 3].map(i => R(0, 1300 + i * 150, 1080, 6, 0, '#6A4A2A', .4)).join('');
    return o;
  }
  function ates(x, y, s, t) { let o = `<g transform="translate(${x} ${y}) scale(${s})">` + [[-60, 10, 30], [60, 10, -30], [0, 20, 0]].map(([a, b, r]) => R(-80, -14, 160, 28, 14, '#6A4A2A').replace('<rect', `<rect transform="translate(${a} ${b}) rotate(${r})"`)).join('');
    for (let i = 0; i < 3; i++) { const f = 1 + .15 * Math.sin(t * 12 + i * 2); o += `<path d="M${-50 + i * 50} 0 Q${-70 + i * 50} ${-80 * f} ${-50 + i * 50} ${-140 * f} Q${-30 + i * 50} ${-80 * f} ${-50 + i * 50} 0Z" fill="${['#FF7A2A', '#FFB44C', '#FF7A2A'][i]}"/>`; }
    return o + `<circle cx="0" cy="-40" r="120" fill="#FFB44C" opacity=".2"/></g>`; }
  function kazan(x, y, s, t, renk = '#8FB050', { buhar = 1 } = {}) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + `<path d="M-230 -330 L-250 60 M230 -330 L250 60 M0 -380 L0 -300" stroke="#3A3A3A" stroke-width="16"/>` + R(-240, -390, 480, 20, 10, '#3A3A3A');
    o += `<path d="M-190 -230 Q-200 0 0 20 Q200 0 190 -230Z" fill="#2A2A30"/><path d="M-150 -220 Q-160 -40 -40 0" stroke="#FFFFFF" stroke-width="10" opacity=".12" fill="none"/>` + `<ellipse cx="0" cy="-230" rx="195" ry="40" fill="#3A3A40"/><ellipse cx="0" cy="-226" rx="170" ry="30" fill="${renk}"/>`;
    for (let i = 0; i < 6; i++) { const q = ((t * .9 + i / 6) % 1); o += `<circle cx="${-120 + i * 48}" cy="${-226 + 6 * Math.sin(i)}" r="${10 * Math.sin(q * Math.PI)}" fill="#FFFFFF" opacity=".35"/>`; }
    if (buhar) for (let i = 0; i < 4; i++) { const q = ((t * .35 + i / 4) % 1); o += `<path d="M${-80 + i * 55} ${-260 - q * 300} q20 -40 0 -80" stroke="#FFFFFF" stroke-width="${16 * (1 - q)}" fill="none" stroke-linecap="round" opacity="${.5 * Math.sin(q * Math.PI) * buhar}"/>`; }
    return o + '</g>' + ates(x, y + 70 * s, s * 1.1, t); }
  function kase(x, y, s, renk = '#8FB050', ic = '') { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="70" rx="120" ry="18" fill="#000" opacity=".15"/><path d="M-150 -20 Q-140 80 0 90 Q140 80 150 -20Z" fill="#A8683A"/><path d="M-110 50 Q0 80 110 50" stroke="#8E5226" stroke-width="10" fill="none"/><ellipse cx="0" cy="-20" rx="150" ry="32" fill="#8E5226"/><ellipse cx="0" cy="-18" rx="130" ry="24" fill="${renk}"/>${ic}</g>`; }
  const pottajIc = (tip) => tip === 'gri' ? '' : [[-60, -20, '#6CA040'], [40, -14, '#E8A060'], [-10, -24, '#F2E2B0'], [70, -24, '#6CC04A'], [-90, -14, '#C8623A']].map(([a, b, c]) => `<ellipse cx="${a}" cy="${b}" rx="14" ry="8" fill="${c}"/>`).join('');
  // malzeme ikonları (merkez 0,0; ~120px)
  const M_ = {
    yulaf: `<path d="M0 60 L0 -60" stroke="#C8A060" stroke-width="8"/>` + [0, 1, 2, 3, 4].map(i => `<ellipse cx="${i % 2 ? 18 : -18}" cy="${-50 + i * 22}" rx="12" ry="20" fill="#E8C878" transform="rotate(${i % 2 ? 25 : -25} ${i % 2 ? 18 : -18} ${-50 + i * 22})"/>`).join(''),
    bezelye: `<path d="M-70 0 Q0 -50 70 0 Q0 40 -70 0Z" fill="#6CC04A"/>` + [-40, -10, 20, 50].map(a => `<circle cx="${a}" cy="0" r="14" fill="#9FE07A"/>`).join(''),
    fasulye: [[-30, 0, -20], [10, 10, 30], [40, -10, -10]].map(([a, b, r]) => `<ellipse cx="${a}" cy="${b}" rx="26" ry="16" fill="#C8A0A0" transform="rotate(${r} ${a} ${b})"/><ellipse cx="${a}" cy="${b}" rx="10" ry="5" fill="#8A5A5A" transform="rotate(${r} ${a} ${b})"/>`).join(''),
    sogan: `<path d="M0 -60 Q20 -30 50 -10 Q70 20 50 45 Q30 60 0 62 Q-30 60 -50 45 Q-70 20 -50 -10 Q-20 -30 0 -60Z" fill="#C8783A"/><path d="M-4 -60 Q-6 -80 -16 -90" stroke="#8E5A2A" stroke-width="6" fill="none"/>`,
    pirasa: `<rect x="-14" y="-10" width="28" height="80" rx="12" fill="#F4F0DC"/><path d="M-14 -10 L-40 -80 L-10 -70 L0 -90 L10 -70 L40 -80 L14 -10Z" fill="#3FA35A"/>`,
    lahana: `<circle cx="0" cy="0" r="56" fill="#8FD65A"/><path d="M-50 10 Q0 -60 50 10" stroke="#6CC04A" stroke-width="8" fill="none"/><path d="M-30 30 Q0 -20 30 30" stroke="#6CC04A" stroke-width="7" fill="none"/>`,
    ot: [-20, 0, 20].map((a, i) => `<path d="M${a} 60 Q${a + (i - 1) * 20} 0 ${a + (i - 1) * 30} -60" stroke="#3FA35A" stroke-width="6" fill="none"/>` + [0, 1, 2].map(j => `<ellipse cx="${a + (i - 1) * (10 + j * 8)}" cy="${30 - j * 35}" rx="16" ry="9" fill="#5FB85A" transform="rotate(${(i - 1) * 40} ${a + (i - 1) * (10 + j * 8)} ${30 - j * 35})"/>`).join('')).join(''),
    sarimsak: `<path d="M0 -50 Q40 -20 44 20 Q40 55 0 58 Q-40 55 -44 20 Q-40 -20 0 -50Z" fill="#F4EEE0"/><path d="M0 -50 L0 58 M-20 -30 Q-30 20 -18 55 M20 -30 Q30 20 18 55" stroke="#D8CEB8" stroke-width="4" fill="none"/>`,
    hardal: `<path d="M-40 60 L-50 -30 L50 -30 L40 60Z" fill="#8E5A3A"/><ellipse cx="0" cy="-30" rx="52" ry="12" fill="#6A4A2A"/><ellipse cx="0" cy="-32" rx="42" ry="8" fill="#E8C020"/>`,
    maydanoz: `<path d="M0 60 L0 -10 M0 20 L-30 -30 M0 20 L30 -30" stroke="#3FA35A" stroke-width="6"/>` + [[0, -30], [-36, -44], [36, -44], [-20, -60], [20, -60]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="20" fill="#4FB050"/>`).join(''),
    adacayi: [-1, 0, 1].map(k => `<ellipse cx="${k * 26}" cy="${-10 - Math.abs(k) * -8}" rx="18" ry="46" fill="#9AB8A0" transform="rotate(${k * 25} ${k * 26} 30)"/>`).join('') + `<path d="M0 60 L0 0" stroke="#6A8A70" stroke-width="6"/>`,
  };
  const malzeme = (ad, x, y, s = 1, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${M_[ad] || ''}</g>`;
  function ekmek(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="130" ry="80" fill="#6A4020"/><ellipse cx="-6" cy="-10" rx="120" ry="66" fill="#8E5A30"/>` + [-60, 0, 60].map(a => `<path d="M${a - 20} -40 L${a + 20} 10" stroke="#5A3418" stroke-width="10" stroke-linecap="round"/>`).join('') + `<ellipse cx="-40" cy="-40" rx="30" ry="12" fill="#FFFFFF" opacity=".15"/></g>`; }
  function testi(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 Q-90 -100 -40 -160 L-30 -200 L30 -200 L40 -160 Q90 -100 60 0Z" fill="#B8683A"/><path d="M60 -150 Q120 -120 70 -60" stroke="#B8683A" stroke-width="18" fill="none"/><ellipse cx="0" cy="-200" rx="32" ry="10" fill="#8E4A26"/><path d="M-50 -90 Q0 -80 50 -90" stroke="#8E4A26" stroke-width="8" fill="none"/></g>`; }
  function kupa(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-50, -120, 100, 120, 14, '#8E6A3A') + R(-50, -120, 100, 22, 8, '#FFF6D6') + `<path d="M50 -90 Q90 -80 80 -40 Q70 -20 50 -20" stroke="#8E6A3A" stroke-width="14" fill="none"/>` + [0, 1].map(i => R(-50, -80 + i * 50, 100, 8, 0, '#6A4A2A')).join('') + '</g>'; }
  function masa(x, y, w, T) { return R(x - w / 2, y, w, 40, 10, '#8E5A30') + R(x - w / 2, y, w, 12, 6, '#FFFFFF', .12) + R(x - w / 2 + 30, y + 40, 30, 260, 8, '#6A4020') + R(x + w / 2 - 60, y + 40, 30, 260, 8, '#6A4020'); }
  function domuz(x, y, s, t = 0, yon = 1) { const b = Math.sin(t * 3) * 3; return `<g transform="translate(${x} ${y + b}) scale(${s * yon} ${s})"><ellipse cx="0" cy="-90" rx="150" ry="95" fill="#F4A8B0"/><ellipse cx="-20" cy="-110" rx="120" ry="60" fill="#FFC0C8" opacity=".6"/>` + [-90, -40, 50, 100].map(a => R(a - 18, -20, 36, 50, 12, '#E88A98')).join('') + `<circle cx="140" cy="-110" r="70" fill="#F4A8B0"/><ellipse cx="190" cy="-100" rx="30" ry="24" fill="#E88A98"/><circle cx="182" cy="-100" r="6" fill="#8A3A4A"/><circle cx="200" cy="-100" r="6" fill="#8A3A4A"/><circle cx="150" cy="-130" r="10" fill="#1B1640"/><path d="M110 -170 L130 -200 L150 -165Z" fill="#E88A98"/><path d="M-150 -110 q-40 -10 -30 20 q10 20 -10 30" stroke="#E88A98" stroke-width="8" fill="none"/></g>`; }
  function pastirma(x, y, s, t = 0) { const sw = Math.sin(t * 1.5) * 3; return `<g transform="translate(${x} ${y}) rotate(${sw}) scale(${s})"><path d="M0 -120 L0 0" stroke="#6A4A2A" stroke-width="5"/>` + R(-60, 0, 120, 200, 20, '#C8584A') + [0, 1, 2].map(i => R(-60, 40 + i * 50, 120, 14, 4, '#F4E0D0', .9)).join('') + '</g>'; }
  function sosis(x, y, s, t = 0) { let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-160 -80 Q0 -40 160 -80" stroke="#6A4A2A" stroke-width="5" fill="none"/>`; for (let i = 0; i < 5; i++) { const sw = Math.sin(t * 2 + i) * 4; o += `<ellipse cx="${-120 + i * 60}" cy="${-30 + Math.abs(i - 2) * -8 + sw}" rx="22" ry="54" fill="#A8483A"/><ellipse cx="${-126 + i * 60}" cy="${-46 + Math.abs(i - 2) * -8 + sw}" rx="7" ry="20" fill="#FFFFFF" opacity=".2"/>`; } return o + '</g>'; }
  function tavuk(x, y, s, t = 0) { const g = Math.abs(Math.sin(t * 4)) * 8; return `<g transform="translate(${x} ${y - g}) scale(${s})"><ellipse cx="0" cy="-60" rx="70" ry="56" fill="#FFFDF6"/><circle cx="50" cy="-110" r="34" fill="#FFFDF6"/><path d="M40 -150 q10 -20 20 0 q10 -20 20 0" fill="#E8323C"/><path d="M84 -110 l24 8 l-24 8Z" fill="#FFB44C"/><circle cx="60" cy="-116" r="6" fill="#1B1640"/><path d="M-60 -80 q-40 -30 -20 -60 q10 30 30 20" fill="#F4EEE0"/><path d="M-10 -6 v30 M20 -6 v30" stroke="#FFB44C" stroke-width="6"/></g>`; }
  function yumurta(x, y, s) { return [[-30, 0], [30, 4], [0, -24]].map(([a, b]) => `<ellipse cx="${x + a * s}" cy="${y + b * s}" rx="${24 * s}" ry="${32 * s}" fill="#F8EEDC"/><ellipse cx="${x + a * s - 8 * s}" cy="${y + b * s - 10 * s}" rx="${6 * s}" ry="${10 * s}" fill="#FFFFFF" opacity=".6"/>`).join(''); }
  function peynir(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="140" ry="44" fill="#E8B040"/>` + R(-140, -80, 280, 80, 0, '#FFD260') + `<ellipse cx="0" cy="-80" rx="140" ry="44" fill="#FFE080"/><path d="M0 -80 L140 -80 L140 0" fill="#FFC850" opacity=".4"/>` + [[-60, -80, 14], [30, -90, 10], [70, -70, 8]].map(([a, b, r]) => `<ellipse cx="${a}" cy="${b}" rx="${r}" ry="${r * .5}" fill="#E8B040"/>`).join('') + '</g>'; }
  function sut(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-70 0 L-80 -140 L80 -140 L70 0Z" fill="#8E6A3A"/>` + [0, 1].map(i => R(-80, -110 + i * 70, 160, 10, 0, '#5A4A3A')).join('') + `<ellipse cx="0" cy="-140" rx="80" ry="18" fill="#6A4A2A"/><ellipse cx="0" cy="-140" rx="66" ry="12" fill="#FFFDF6"/><path d="M-80 -140 Q0 -230 80 -140" stroke="#5A4A3A" stroke-width="6" fill="none"/></g>`; }
  function kilise(x, y, s, t, calis = 0) { const sw = calis ? Math.sin(t * 8) * 20 * calis : 0; return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-160, -300, 320, 300, 8, '#D8CEB8') + R(-70, -620, 140, 330, 6, '#C8BEA8') + `<path d="M-90 -620 L0 -820 L90 -620Z" fill="#8A7A6A"/><path d="M0 -860 v60 M-24 -836 h48" stroke="#6A5A4A" stroke-width="12"/>` + R(-40, -560, 80, 110, 40, '#3A2A1A') + `<g transform="rotate(${sw} 0 -540)"><path d="M-30 -520 Q-34 -470 -46 -450 L46 -450 Q34 -470 30 -520 Q0 -540 -30 -520Z" fill="#D8A032"/><circle cx="0" cy="-440" r="10" fill="#8E6A2A"/></g>` + R(-50, -130, 100, 130, 50, '#6A4A2A') + '</g>'; }
  function takvimPerhiz(x, y, s, p) { let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-240, -260, 480, 520, 24, '#FFFDF4') + R(-240, -260, 480, 90, 24, '#8A5A3A') + Tm('PERHİZ GÜNLERİ', 0, -202, 32, '#FFF3E0', 'letter-spacing="3"');
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const i = r * 7 + c, x2 = -200 + c * 66, y2 = -130 + r * 76, perhiz = c === 2 || c === 4 || c === 5; o += R(x2 - 26, y2 - 26, 52, 52, 8, perhiz ? '#F4D8C8' : '#F4EEE0'); if (perhiz && ar(p, i / 35 * .8, i / 35 * .8 + .1) > 0) o += `<path d="M${x2 - 16} ${y2 - 16} L${x2 + 16} ${y2 + 16} M${x2 + 16} ${y2 - 16} L${x2 - 16} ${y2 + 16}" stroke="#C8323C" stroke-width="7" stroke-linecap="round"/>`; }
    return o + '</g>'; }
  function tarla(T, t) { let o = `<rect width="1080" height="1920" fill="${T.isik}"/>` + CV.bulut(300, 220, .9) + `<path d="M0 820 Q540 740 1080 820 V1920 H0Z" fill="#E8C060"/>`;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) { const x = c * 96 + (r % 2) * 48, y = 860 + r * 60; o += `<path d="M${x} ${y} Q${x + 4 + Math.sin(t * 2 + c) * 4} ${y - 60} ${x + 8} ${y - 90}" stroke="#C89830" stroke-width="6" fill="none"/><ellipse cx="${x + 8}" cy="${y - 95}" rx="8" ry="18" fill="#E8B040"/>`; }
    o += R(0, 1300, 1080, 620, 0, '#C89830') + [0, 1, 2].map(i => `<ellipse cx="${200 + i * 320}" cy="${1250}" rx="80" ry="40" fill="#E8C060"/><path d="M${140 + i * 320} 1250 l60 -120 l60 120Z" fill="#D8A840"/>`).join('');
    return o; }
  function sikke(x, y, r) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="#B8862A"/><circle cx="${x - 3}" cy="${y - 3}" r="${r * .85}" fill="#E8B84A"/><circle cx="${x - 3}" cy="${y - 3}" r="${r * .55}" fill="none" stroke="#B8862A" stroke-width="${r * .12}"/>`; }
  function biber(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-90 0 Q-110 -120 -60 -170 L60 -170 Q110 -120 90 0Z" fill="#C8A878"/><path d="M-60 -170 Q0 -200 60 -170" stroke="#8E6A3A" stroke-width="10" fill="none"/>` + Tm('BİBER', 0, -70, 30, '#6A4A2A', 'letter-spacing="3"') + [[-30, -180], [0, -190], [30, -178]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="10" fill="#2A2020"/>`).join('') + '</g>'; }
  return { kulube, koy, kulubeIc, ates, kazan, kase, pottajIc, malzeme, ekmek, testi, kupa, masa, domuz, pastirma, sosis, tavuk, yumurta, peynir, sut, kilise, takvimPerhiz, tarla, sikke, biber };
})();
const OCD = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#1A1008', g = .5) => `<defs><radialGradient id="ocv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#ocv)"/>`;
  const cipO = (s, x, y, renk, yazi, fs = 34) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  // kazanın içi (üstten): malzemeler sırayla düşer; liste = [[d, ad, etiket], ...]
  function kazanIc(d, t, liste) {
    let o = `<rect width="1080" height="1920" fill="#2A1A10"/>` + bul(`<circle cx="540" cy="1700" r="500" fill="#FF7A2A" opacity=".5"/>`, 40);
    o += `<circle cx="540" cy="900" r="520" fill="#1A1A20"/><circle cx="540" cy="900" r="480" fill="#3A3A40"/><circle cx="540" cy="900" r="450" fill="#6A8A40"/>`;
    for (let i = 0; i < 10; i++) { const q = ((t * .8 + h(i)) % 1); o += `<circle cx="${340 + h(i + 3) * 400}" cy="${720 + h(i + 7) * 360}" r="${24 * Math.sin(q * Math.PI)}" fill="#FFFFFF" opacity=".25"/>`; }
    liste.forEach(([t0, ad, et], i) => { const p = ar(d, t0, t0 + .45); if (p <= 0) return; const a = i / liste.length * Math.PI * 2 + .4, r = 240 + (i % 2) * 90, x = 540 + Math.cos(a) * r, y = 900 + Math.sin(a) * r * .8, dy = (1 - FX.E.expo(p)) * -900;
      o += `<g transform="translate(${x} ${y + dy}) rotate(${(1 - p) * 180 + t * 20 * (i % 2 ? 1 : -1)}) scale(1.3)">` + OC.malzeme(ad, 0, 0, 1) + '</g>';
      if (p >= 1 && d - t0 < 1.4) o += `<g transform="translate(${x} ${y + 110})">` + cipO(et, 0, 0, '#FFF3E0', '#4A2A10', 28) + '</g>';
      if (p > .85 && p < 1) o += `<circle cx="${x}" cy="${y}" r="${90 * (p - .85) / .15}" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="${1 - (p - .85) / .15}"/>`; });
    for (let i = 0; i < 4; i++) { const q = ((t * .35 + i / 4) % 1); o += `<path d="M${380 + i * 110} ${800 - q * 700} q30 -60 0 -120" stroke="#FFFFFF" stroke-width="${30 * (1 - q)}" fill="none" stroke-linecap="round" opacity="${.3 * Math.sin(q * Math.PI)}"/>`; }
    o += `<g transform="translate(${760 + Math.cos(t * 2) * 60} ${900 + Math.sin(t * 2) * 40}) rotate(${-30 + Math.sin(t * 2) * 10})">` + R(-16, -500, 32, 520, 14, '#8E5A30') + `<ellipse cx="0" cy="30" rx="60" ry="40" fill="#6A4020"/></g>`;
    return o + vin('#1A0A04', .55);
  }
  function ringa(d, t) {
    let o = `<rect width="1080" height="1920" fill="#5A6A7A"/>` + bul(`<rect x="0" y="0" width="1080" height="700" fill="#8A9AAA"/><circle cx="200" cy="300" r="200" fill="#C8D8E0" opacity=".5"/>`, 30);
    o += `<ellipse cx="540" cy="1450" rx="480" ry="120" fill="#6A4A2A"/>` + R(60, 720, 960, 730, 40, '#8E5A30') + [0, 1, 2].map(i => R(60, 820 + i * 250, 960, 40, 12, '#4A4A50')).join('') + `<ellipse cx="540" cy="720" rx="480" ry="120" fill="#6A4020"/><ellipse cx="540" cy="720" rx="440" ry="100" fill="#EEF2F4"/>`;
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, x = 540 + Math.cos(a) * 240 * (i % 2 ? .6 : 1), y = 720 + Math.sin(a) * 60, p = ar(d, .1 + i * .06, .35 + i * .06); if (p <= 0) continue;
      o += `<g transform="translate(${x} ${y}) rotate(${a * 57 + 90}) scale(${p})"><path d="M-90 0 Q-40 -30 50 -10 L90 -30 L80 0 L90 30 L50 10 Q-40 30 -90 0Z" fill="#A8B8C8"/><path d="M-90 0 Q-40 -30 50 -10 L50 0 Q-40 -8 -90 0Z" fill="#E0E8F0"/><circle cx="-66" cy="-4" r="6" fill="#1B1640"/></g>`; }
    for (let i = 0; i < 30; i++) o += `<rect x="${140 + h(i) * 800}" y="${660 + h(i + 50) * 120}" width="12" height="12" fill="#FFFFFF" opacity=".9" transform="rotate(45 ${146 + h(i) * 800} ${666 + h(i + 50) * 120})"/>`;
    const c = ar(d, .8, 1.1); if (c > 0) o += `<g transform="translate(540 1650) scale(${c})">` + cipO('TUZLU RİNGA', 0, 0, '#1B2A3A', '#FFFFFF', 38) + '</g>';
    return o + vin('#0A1018', .5);
  }
  // hasat hesap defteri: 1348 öncesi / sonrası
  function defter(d) {
    let o = `<rect width="1080" height="1920" fill="#4A3020"/>` + bul(`<circle cx="850" cy="300" r="260" fill="#FFB44C" opacity=".4"/>`, 30);
    o += `<g transform="rotate(-2 540 950)">` + R(90, 330, 900, 1180, 20, '#000', .25) + R(70, 310, 900, 1180, 20, '#F2E2BC') + R(70, 310, 900, 60, 20, '#D8C090') + R(70, 1430, 900, 60, 20, '#D8C090');
    o += Tm('HASAT İŞÇİLERİNİN SOFRASI', 520, 440, 32, '#6A3A1A', 'letter-spacing="3"') + R(520, 480, 4, 900, 0, '#8E6A3A', .5);
    o += T_('1300', 290, 570, 70, '#6A3A1A') + T_('1400', 750, 570, 70, '#6A3A1A');
    const a = ar(d, .2, .6), b = ar(d, .9, 1.4);
    if (a > 0) o += `<g opacity="${a}">` + OC.ekmek(290, 760, .9) + OC.ekmek(290, 950, .9) + OC.ekmek(290, 1140, .9) + `<text x="290" y="1330" font-size="40" font-weight="700" text-anchor="middle" style="fill:#6A3A1A">bol ekmek</text></g>`;
    if (b > 0) o += `<g opacity="${b}">` + OC.pastirma(690, 640, .7) + OC.sosis(800, 900, .55) + OC.kupa(700, 1180, 1.1) + OC.kupa(830, 1180, 1.1) + `<text x="750" y="1330" font-size="40" font-weight="700" text-anchor="middle" style="fill:#6A3A1A">et + bira</text></g>`;
    const k = ar(d, 1.6, 2.0); if (k > 0) { const w = K.yaziGen('KARA ÖLÜM SONRASI', 44) + 70; o += `<g transform="translate(750 1400) rotate(-6) scale(${k})"><rect x="${-w / 2}" y="-44" width="${w}" height="88" rx="14" fill="none" stroke="#8E1B2F" stroke-width="10"/>` + T_('KARA ÖLÜM SONRASI', 0, 16, 44, '#8E1B2F') + '</g>'; }
    return o + '</g>' + vin('#1A0A04', .45);
  }
  return { kazanIc, ringa, defter, cipO };
})();
