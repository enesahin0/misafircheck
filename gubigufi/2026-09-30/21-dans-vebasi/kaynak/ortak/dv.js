/* #21 1518 Dans vebası — Strazburg 1518 (DV) + detay planlar (DVD).
   Dönem: yarı ahşap (fachwerk) evler, dik kiremit çatılar, arnavut kaldırımı, pembe kumtaşı tek kuleli katedral.
   Modern nesne YOK (tabela, lamba direği, cam vitrin vb.). */
const DV = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const cipO = (s, x, y, renk, yazi, fs = 30) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  const DUVAR = ['#F1E3C4', '#E9C98E', '#E8B39A', '#D5DDB8', '#EFD9B0', '#E3C2B6'], KIREMIT = ['#B4523A', '#9E4332', '#C0664A'], KIRIS = '#5A3A24';
  // pencere: kurşun çerçeveli küçük camlar + kepenk
  const pencere = (x, y, w, hh, gece = 0) => { const cam = gece ? '#FFC45C' : '#8FB4C8';
    return R(x - 10, y - 6, 10, hh + 12, 2, '#6A7A4A') + R(x + w, y - 6, 10, hh + 12, 2, '#6A7A4A') + R(x, y, w, hh, 4, cam) + `<path d="M${x + w / 2} ${y} L${x + w / 2} ${y + hh} M${x} ${y + hh / 2} L${x + w} ${y + hh / 2}" stroke="${KIRIS}" stroke-width="4"/>` + R(x - 4, y + hh, w + 8, 8, 2, KIRIS); };
  // fachwerk ev (sokağa bakan üçgen alınlık); x = sol, yT = taban, w, kat sayısı
  function ev(x, yT, w, kat, i, { gece = 0 } = {}) { const kh = 170, H = kat * kh, d = DUVAR[Math.floor(h(i * 3.1) * DUVAR.length)], c = KIREMIT[i % 3];
    let o = R(x, yT - H, w, H, 0, d);
    // alınlık
    const ay = yT - H, ah = w * .95;
    o += `<path d="M${x - 14} ${ay} L${x + w / 2} ${ay - ah} L${x + w + 14} ${ay}Z" fill="${c}"/><path d="M${x + 22} ${ay} L${x + w / 2} ${ay - ah + 40} L${x + w - 22} ${ay}Z" fill="${d}"/>`;
    o += `<path d="M${x + w / 2} ${ay - ah + 40} L${x + w / 2} ${ay} M${x + 22} ${ay} L${x + w - 22} ${ay} M${x + w * .3} ${ay - ah * .35} L${x + w * .7} ${ay - ah * .35}" stroke="${KIRIS}" stroke-width="12"/>` + pencere(x + w / 2 - 22, ay - ah * .3, 44, 56, gece);
    // kat kirişleri + dikmeler + çaprazlar
    for (let k = 0; k <= kat; k++) o += R(x, yT - k * kh - 7, w, 14, 0, KIRIS);
    const n = Math.max(2, Math.round(w / 90));
    for (let k = 0; k < kat; k++) { const y0 = yT - (k + 1) * kh, y1 = yT - k * kh;
      for (let j = 0; j <= n; j++) o += R(x + j * (w / n) - 6, y0, 12, kh, 0, KIRIS);
      for (let j = 0; j < n; j++) { const xa = x + j * (w / n), xb = xa + w / n, v = h(i * 17 + k * 5 + j);
        if (k === 0 && j === Math.floor(n / 2)) { o += `<path d="M${xa + 12} ${y1} L${xa + 12} ${y0 + 40} Q${(xa + xb) / 2} ${y0 + 10} ${xb - 12} ${y0 + 40} L${xb - 12} ${y1}Z" fill="#6A4028"/>` + R((xa + xb) / 2 - 3, y0 + 40, 6, kh - 40, 2, '#4A2A18'); continue; }
        if (v < .45) o += `<path d="M${xa + 6} ${y1 - 6} L${xb - 6} ${y0 + 6} M${xa + 6} ${y0 + 6} L${xb - 6} ${y1 - 6}" stroke="${KIRIS}" stroke-width="10"/>`;
        else o += pencere((xa + xb) / 2 - 24, y0 + 44, 48, 70, gece && v > .6); } }
    return o; }
  // Strazburg katedrali: pembe kumtaşı batı cephesi, gül pencere, SOL (kuzey) kulede tek sivri kule
  function katedral(x, yT, s, { gece = 0 } = {}) { const K1 = gece ? '#6A3E4A' : '#C9786C', K2 = gece ? '#553240' : '#B0625A', K3 = gece ? '#3E2432' : '#8E4A46';
    let o = `<g transform="translate(${x} ${yT}) scale(${s})">`;
    o += R(-200, -620, 400, 620, 0, K1) + R(-200, -620, 120, 620, 0, K2) + R(80, -620, 120, 620, 0, K2);
    o += R(80, -760, 120, 140, 0, K2) + R(70, -770, 140, 16, 0, K3);                                   // güney kulesi (düz biter)
    o += R(-200, -900, 120, 280, 0, K2) + `<path d="M-200 -900 L-140 -1320 L-80 -900Z" fill="${K2}"/><path d="M-140 -1320 L-140 -900" stroke="${K3}" stroke-width="6"/>`;  // kuzey kulesi + sivri kule
    for (let i = 0; i < 5; i++) o += `<path d="M${-196 + i * 4} ${-900 - i * 70} l${120 - i * 8} 0" stroke="${K3}" stroke-width="5"/>`;
    o += `<circle cx="0" cy="-420" r="80" fill="${K3}"/><circle cx="0" cy="-420" r="66" fill="${gece ? '#FFB45C' : '#6A8AB0'}"/>`;
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; o += `<path d="M0 -420 L${Math.cos(a) * 66} ${-420 + Math.sin(a) * 66}" stroke="${K3}" stroke-width="5"/>`; }
    [-140, 0, 140].forEach((px, i) => o += `<path d="M${px - (i === 1 ? 60 : 40)} 0 L${px - (i === 1 ? 60 : 40)} ${i === 1 ? -170 : -130} Q${px} ${i === 1 ? -260 : -200} ${px + (i === 1 ? 60 : 40)} ${i === 1 ? -170 : -130} L${px + (i === 1 ? 60 : 40)} 0Z" fill="${K3}"/>`);
    for (let i = 0; i < 6; i++) o += `<path d="M${-180 + i * 72} -560 l0 -40 l14 -20 l14 20 l0 40Z" fill="${K3}" opacity=".7"/>`;
    return o + '</g>'; }
  // arnavut kaldırımı
  function kaldirim(y0, renk = '#A8998A', koyu = '#8E8072') { let o = R(0, y0, 1080, 1920 - y0, 0, renk);
    for (let r = 0; r * 44 < 1920 - y0; r++) { const yy = y0 + r * 44 + r * r * .8, bw = 60 + r * 5; for (let c = -1; c * bw < 1080; c++) { const xx = c * bw + (r % 2) * bw / 2; o += `<rect x="${xx + 4}" y="${yy + 4}" width="${bw - 8}" height="${36 + r * 1.2}" rx="${10 + r * .5}" fill="${h(r * 13 + c) > .5 ? koyu : renk}" opacity=".55"/>`; } }
    return o; }
  // gök: yaz günü / gün batımı / gece
  function gok(tip = 'gun') { const G = { gun: ['#9FD0EA', '#F4E6C8'], aksam: ['#6A5A9A', '#F2A874'], gece: ['#1B1F3E', '#4A3A6A'], gri: ['#A8AAB0', '#D8D0C4'] }[tip];
    return `<defs><linearGradient id="dvg${tip}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${G[0]}"/><stop offset="1" stop-color="${G[1]}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#dvg${tip})"/>`; }
  // SOKAK: katedral arkada, iki yanda ev sırası, kaldırım
  function sokak({ gok: g = 'gun', y0 = 1180, katedralS = .95, gece = 0 } = {}) {
    let o = gok(g) + (g === 'gun' ? CV.bulut(210, 260, .8) + CV.bulut(860, 190, .6) : '');
    if (g === 'gece') for (let i = 0; i < 40; i++) o += `<circle cx="${h(i) * 1080}" cy="${h(i + 50) * 700}" r="${1.5 + h(i + 9) * 2}" fill="#FFF3D6" opacity=".8"/>`;
    o += katedral(560, y0 - 90, katedralS, { gece });
    [[-60, 250, 3, 0], [180, 190, 3, 1], [760, 200, 3, 2], [950, 220, 4, 3]].forEach(([x, w, k, i]) => o += ev(x, y0, w, k, i, { gece }));
    return o + kaldirim(y0); }
  // MEYDAN: katedral ortada büyük, evler yanlarda
  function meydan({ gok: g = 'gun', y0 = 1150, gece = 0 } = {}) {
    let o = gok(g) + (g === 'gun' ? CV.bulut(180, 230, .8) + CV.bulut(900, 300, .6) : '');
    o += katedral(540, y0 - 60, 1.05, { gece });
    [[-80, 260, 3, 6], [150, 150, 2, 7], [780, 150, 2, 8], [900, 260, 3, 9]].forEach(([x, w, k, i]) => o += ev(x, y0, w, k, i, { gece }));
    return o + kaldirim(y0); }
  // ahşap sahne (belediyenin kurduğu)
  function sahne(x, y, w, p = 1) { let o = '';
    const n = Math.ceil(8 * p); for (let i = 0; i < 8; i++) { if (i >= n) break; o += R(x - w / 2 + i * w / 8, y - 30, w / 8 - 4, 30, 3, i % 2 ? '#B8864A' : '#A87838'); }
    if (p > .3) o += R(x - w / 2, y, w, 90, 6, '#8E6030') + [0, 1, 2, 3].map(i => R(x - w / 2 + 20 + i * (w - 60) / 3, y + 10, 20, 70, 4, '#6A4020')).join('');
    return o; }
  // kalabalık dans eden halk (dönem giysisi); sira: 0 arka (küçük) → 2 ön
  function dansci(x, y, boy, t, i, o2 = {}) { const f = h(i * 7.3) * 6, bob = Math.abs(Math.sin(t * 5 + f)) * boy * .04, don = Math.sin(t * 3 + f) * 8;
    return `<g transform="translate(0 ${-bob}) rotate(${don} ${x} ${y})">` + KS.karakter(Object.assign({ x, y, boy, t: t + f, poz: 'dans', adim: t * 8 + f, ifade: h(i + 3) > .5 ? 'saskin' : 'notr', bak: [Math.sin(f) * .5, -.3] }, KS.donem(1518, i), o2)) + '</g>'; }
  function kalabalik(t, { n = 12, y = 1260, boy = 300, x0 = 60, x1 = 1020, bas = 0, seed = 0, gorunen = 1 } = {}) { let o = '';
    for (let k = 0; k < n; k++) { if (k >= n * gorunen) break; const x = x0 + (x1 - x0) * (k + .5) / n + (h(k + seed) - .5) * 40; o += dansci(x, y + (h(k * 3 + seed) - .5) * 30, boy, t, k + bas); }
    return o; }
  // Frau Troffea: 1518 kadın (uzun etek, önlük, beyaz başörtüsü)
  const TROFFEA = { ust: '#8A3A3A', alt: '#3A2A20', ayakkabi: '#3A2A1A', sac: { tip: 'kakul', renk: '#5A3A20' }, ten: '#F7B8A4', kiyafet: { etek: '#3A4A6A', etekBoy: 'uzun', onluk: '#EFE6D2', sapka: 'basortu', sapkaRenk: '#F6F0E2' } };
  // hekimler (1518): uzun koyu cübbe (ceket + uzun etek), siyah yuvarlak başlık yerine bere
  const HEKIM = i => ({ ust: '#2A2440', alt: '#1B1822', ayakkabi: '#1B1410', ten: ['#F2C6A0', '#E8B08A'][i % 2], sac: { tip: 'kisa', renk: ['#8A8A8A', '#4A3020'][i % 2] }, biyik: i % 2 ? '#4A3020' : '#9A9A9A', kiyafet: { ceket: '#2A2440', gomlek: '#EFE6D2', etek: '#2A2440', etekBoy: 'uzun', sapka: 'bere', sapkaRenk: '#1B1822' } });
  // güçlü adam: kolları sıvalı, yelekli
  const GUCLU = i => ({ ust: '#EFE6D2', alt: '#4A3A2A', ayakkabi: '#3A2A1A', ten: ['#E8B08A', '#F2C6A0'][i % 2], sac: { tip: 'kisa', renk: '#2A1E14' }, biyik: '#2A1E14', kiyafet: { yelek: '#6A3A2A' } });
  // matula (hekimin idrar şişesi) — Gufi'nin eli tutar
  function matula(x, y, s, t = 0) { const sw = Math.sin(t * 2) * 3;
    return `<g transform="translate(${x} ${y}) rotate(${sw}) scale(${s})"><circle cx="0" cy="30" r="46" fill="#F5E9A8" opacity=".85"/><circle cx="0" cy="30" r="46" fill="none" stroke="#FFFFFF" stroke-width="5" opacity=".7"/><rect x="-14" y="-50" width="28" height="50" rx="8" fill="#FFFFFF" opacity=".75"/><rect x="-18" y="-58" width="36" height="12" rx="5" fill="#FFFFFF" opacity=".9"/><path d="M-26 22 Q0 12 26 22 L26 40 Q0 70 -26 40Z" fill="#E8B83A" opacity=".8"/><circle cx="-18" cy="14" r="8" fill="#FFFFFF" opacity=".8"/></g>`; }
  // Gubi'nin davulu (tabor) + tokmak — Gubi elsiz: tokmak yanında süzülür
  function davul(x, y, s, t = 0, calar = true) { const vur = calar ? Math.abs(Math.sin(t * 9)) : .6, ang = -30 + vur * 40;
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="40" rx="70" ry="16" fill="#000" opacity=".15"/><rect x="-62" y="-50" width="124" height="90" rx="10" fill="#8E3A2A"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-62 + i * 31} -44 L${-46 + i * 31} 34" stroke="#F1E3C4" stroke-width="4"/>`).join('') + `<ellipse cx="0" cy="-50" rx="62" ry="18" fill="#F1E3C4"/><ellipse cx="0" cy="-50" rx="62" ry="18" fill="none" stroke="#6A2A1A" stroke-width="6"/><ellipse cx="0" cy="40" rx="62" ry="12" fill="none" stroke="#6A2A1A" stroke-width="6"/>`;
    o += `<g transform="rotate(${ang} 50 -110)"><rect x="46" y="-150" width="10" height="100" rx="5" fill="#6A4020"/><circle cx="51" cy="-150" r="15" fill="#F1E3C4"/></g>`;
    if (calar && vur < .15) o += [0, 1, 2].map(i => `<path d="M${-30 + i * 30} -80 l${-10 + i * 10} -30" stroke="#FFE9B8" stroke-width="6" stroke-linecap="round"/>`).join('');
    return o + '</g>'; }
  // flüt (fife) çalan müzisyen: karakter + flüt çubuğu
  function fluct(x, y, boy, t, i) { const s = boy / 700; return KS.karakter(Object.assign({ x, y, boy, t, poz: 'flut', ifade: 'notr', bak: [.4, 0] }, KS.donem(1518, i * 2), { kiyafet: { yelek: '#2E4A6A', sapka: 'bere', sapkaRenk: '#7E2E3A', tuy: '#FFF3D6' } })) +
      `<rect x="${x + 12 * s}" y="${y - 500 * s}" width="${190 * s}" height="${16 * s}" rx="${8 * s}" fill="#C89A5A" transform="rotate(${10 + Math.sin(t * 6) * 3} ${x + 12 * s} ${y - 500 * s})"/>`; }
  // nota
  const nota = (x, y, s, renk = '#FFF3D6', op = 1) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><circle cx="0" cy="0" r="16" fill="${renk}"/><rect x="11" y="-60" width="7" height="60" fill="${renk}"/><path d="M18 -60 Q40 -50 34 -26 Q30 -44 18 -42Z" fill="${renk}"/></g>`;
  const notaCarpi = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="90" fill="#1B1640" opacity=".85"/>` + nota(-6, 24, 1.4, '#FFF3D6') + `<path d="M-64 -64 L64 64" stroke="#E8505B" stroke-width="16" stroke-linecap="round"/></g>`;
  // HARİTA (kuşbakışı Strazburg 'Büyük Ada', Ill nehri ile çevrili); p: salgın yayılması 0–1
  function harita(t, p, { x = 540, y = 820, s = 1 } = {}) { let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
    o += R(-460, -520, 920, 1040, 30, '#E8D6AE') + R(-460, -520, 920, 1040, 30, 'none') + `<rect x="-440" y="-500" width="880" height="1000" rx="20" fill="none" stroke="#B8986A" stroke-width="6"/>`;
    o += `<path d="M-420 -120 Q-300 -420 20 -400 Q380 -380 420 -80 Q440 260 120 380 Q-260 440 -400 180 Q-460 40 -420 -120Z" fill="#9CC4D0"/>`;
    o += `<path d="M-370 -110 Q-270 -360 20 -345 Q330 -330 370 -80 Q385 220 110 330 Q-230 380 -350 160 Q-400 40 -370 -110Z" fill="#E0C8A0"/>`;
    for (let i = 0; i < 70; i++) { const a = h(i) * Math.PI * 2, r = Math.sqrt(h(i + 99)) * 300, bx = Math.cos(a) * r * 1.1, by = Math.sin(a) * r * .95; o += `<rect x="${bx - 14}" y="${by - 10}" width="28" height="20" rx="3" fill="#B4523A" opacity=".65" transform="rotate(${h(i + 5) * 40 - 20} ${bx} ${by})"/>`; }
    o += `<path d="M-300 -40 Q0 -20 300 -60 M-40 -300 Q-10 0 30 300 M-240 180 Q0 120 240 200" stroke="#F4E6C8" stroke-width="14" fill="none" opacity=".8"/>`;
    o += `<g transform="translate(20 -20) scale(.22)">${katedral(0, 0, 1)}</g>`;
    const n = Math.floor(120 * p); for (let i = 0; i < n; i++) { const a = h(i + 300) * Math.PI * 2, r = Math.pow(h(i + 400), .7) * 330 * Math.min(1, .2 + p), dx = Math.cos(a) * r, dy = Math.sin(a) * r * .9, puls = 1 + .25 * Math.sin(t * 8 + i);
      o += `<circle cx="${dx}" cy="${dy}" r="${10 * puls}" fill="#E8323C" opacity=".85"/><circle cx="${dx}" cy="${dy}" r="${22 * puls}" fill="#E8323C" opacity=".2"/>`; }
    o += Tm('STRAZBURG · 1518', 0, 470, 34, '#6A4A2A', 'letter-spacing="6"');
    return o + '</g>'; }
  // BELEDİYE kapısı: taş cephe, kemerli ahşap kapı
  function belediye() { let o = gok('gri') + R(0, 300, 1080, 1100, 0, '#C8B8A0');
    for (let r = 0; r < 14; r++) for (let c = 0; c < 8; c++) o += `<rect x="${c * 140 + (r % 2) * 70 - 70 + 6}" y="${300 + r * 80 + 6}" width="128" height="68" rx="6" fill="${h(r * 9 + c) > .5 ? '#BCA88E' : '#D2C2AA'}"/>`;
    o += `<path d="M260 1400 L260 760 Q540 520 820 760 L820 1400Z" fill="#8E7A62"/><path d="M290 1400 L290 780 Q540 570 790 780 L790 1400Z" fill="#6A4028"/>`;
    for (let i = 0; i < 6; i++) o += R(300 + i * 82, 790, 8, 610, 2, '#4A2A18', .6);
    [880, 1100, 1300].forEach(y => o += R(290, y, 500, 16, 3, '#2A1A10') + `<circle cx="320" cy="${y + 8}" r="10" fill="#8A8A8A"/><circle cx="760" cy="${y + 8}" r="10" fill="#8A8A8A"/>`);
    o += `<g transform="translate(540 450)"><path d="M-80 -100 L80 -100 L80 20 Q0 110 -80 20Z" fill="#C8232F"/><path d="M-60 -80 L60 60" stroke="#FFFDF6" stroke-width="30"/></g>`;   // Strazburg arması (kırmızı bant, beyaz kalkan)
    return o + kaldirim(1400, '#9A8A7A', '#7E7062'); }
  // DAĞ YOLU (Vosges, Saverne): katmanlı tepeler, kıvrımlı yol, tepede şapel
  function dag(t) { let o = gok('gun') + CV.bulut(820, 220, .7);
    o += `<path d="M0 900 Q200 620 420 760 Q640 520 860 700 Q980 620 1080 680 L1080 1920 L0 1920Z" fill="#8FA8C8"/>`;
    o += `<path d="M0 1080 Q260 820 540 960 Q800 820 1080 960 L1080 1920 L0 1920Z" fill="#6A9A6A"/>`;
    o += `<path d="M0 1300 Q300 1120 620 1240 Q860 1160 1080 1260 L1080 1920 L0 1920Z" fill="#4E8A52"/>`;
    o += `<path d="M720 1000 Q560 1080 700 1180 Q880 1300 560 1400 Q220 1500 420 1700 Q520 1800 480 1920" stroke="#D8C8A0" stroke-width="70" fill="none" stroke-linecap="round"/>`;
    o += `<g transform="translate(760 940)"><rect x="-60" y="-110" width="120" height="110" fill="#E8DCC4"/><path d="M-76 -110 L0 -190 L76 -110Z" fill="#9E4332"/><rect x="-10" y="-250" width="20" height="70" fill="#E8DCC4"/><path d="M-24 -230 L24 -230 M0 -260 L0 -200" stroke="#6A4020" stroke-width="8"/><path d="M-22 0 L-22 -50 Q0 -74 22 -50 L22 0Z" fill="#6A4028"/></g>`;
    for (let i = 0; i < 9; i++) { const x = 180 + (h(i + 70) - .5) * 60, y = 1100 + i * 90; o += `<circle cx="${x}" cy="${y - 80}" r="40" fill="${['#3E6E44', '#4E7E4E'][i % 2]}"/>` + R(x - 6, y - 50, 12, 50, 3, '#5A3A24'); }
    return o; }
  // TARLA (çavdar)
  function tarla(t) { let o = gok('gun') + CV.bulut(260, 240, .8) + `<path d="M0 1000 Q540 920 1080 1000 L1080 1920 L0 1920Z" fill="#D8B85A"/>`;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 22; c++) { const x = c * 52 + (r % 2) * 26, y = 1030 + r * r * 14 + r * 30, s = .5 + r * .14, sw = Math.sin(t * 2 + c * .4 + r) * 8 * s;
      o += `<path d="M${x} ${y} Q${x + sw * .5} ${y - 60 * s} ${x + sw} ${y - 110 * s}" stroke="#B8943A" stroke-width="${4 * s}" fill="none"/><ellipse cx="${x + sw}" cy="${y - 124 * s}" rx="${7 * s}" ry="${22 * s}" fill="#E8C868" transform="rotate(${sw} ${x + sw} ${y - 124 * s})"/>`; }
    return o; }
  // BEYİN
  function beyin(x, y, s, renk = '#F2A4B4') { const k = '#D87A92';
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-220 40 Q-260 -120 -140 -190 Q-60 -260 40 -230 Q180 -250 230 -120 Q280 0 200 90 Q120 160 0 140 Q-40 200 -110 180 Q-200 160 -220 40Z" fill="${renk}"/>` +
      `<path d="M-160 -120 Q-100 -80 -140 -20 M-60 -190 Q-20 -120 -80 -60 Q-40 0 -90 60 M40 -200 Q0 -120 60 -80 Q20 -20 70 30 M150 -150 Q100 -80 160 -30 Q120 30 170 80 M0 -230 L0 140" stroke="${k}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-20 140 Q0 220 40 260" stroke="${renk}" stroke-width="50" stroke-linecap="round" fill="none"/></g>`; }
  // mikrop (final 'mikrop değil')
  const mikrop = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="60" fill="#7AC86A"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return `<path d="M${Math.cos(a) * 55} ${Math.sin(a) * 55} L${Math.cos(a) * 85} ${Math.sin(a) * 85}" stroke="#5AA84A" stroke-width="10" stroke-linecap="round"/><circle cx="${Math.cos(a) * 88}" cy="${Math.sin(a) * 88}" r="10" fill="#5AA84A"/>`; }).join('') + `<circle cx="-18" cy="-10" r="10" fill="#2A3A20"/><circle cx="18" cy="-10" r="10" fill="#2A3A20"/></g>`;
  // Aziz Vitus sunağı (gotik çerçeve içinde aziz resmi — saygılı, sade)
  function sunak(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-220 300 L-220 -180 Q0 -420 220 -180 L220 300Z" fill="#6A4A2A"/><path d="M-190 280 L-190 -170 Q0 -380 190 -170 L190 280Z" fill="#E8C878"/>` +
      `<path d="M-170 270 L-170 -160 Q0 -350 170 -160 L170 270Z" fill="#4A6A9A"/><circle cx="0" cy="-120" r="90" fill="#FFE27A" opacity=".85"/>` +
      `<circle cx="0" cy="-110" r="55" fill="#F2C6A0"/><path d="M-55 -120 Q-50 -175 0 -172 Q50 -175 55 -120 Q30 -145 0 -142 Q-30 -145 -55 -120Z" fill="#6A4020"/><circle cx="-18" cy="-104" r="6" fill="#3A2350"/><circle cx="18" cy="-104" r="6" fill="#3A2350"/>` +
      `<path d="M-100 250 L-80 -40 Q0 -70 80 -40 L100 250Z" fill="#8E2A3A"/><path d="M-30 -50 L0 40 L30 -50" fill="#E8C878"/><path d="M70 -20 Q120 -120 90 -200" stroke="#3E7A3E" stroke-width="12" fill="none"/><ellipse cx="96" cy="-160" rx="16" ry="40" fill="#4E8A4E" transform="rotate(15 96 -160)"/></g>`; }
  return { ev, katedral, kaldirim, gok, sokak, meydan, sahne, dansci, kalabalik, TROFFEA, HEKIM, GUCLU, matula, davul, fluct, nota, notaCarpi, harita, belediye, dag, tarla, beyin, mikrop, sunak, cipO };
})();
const DVD = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#1A0A04', g = .45) => `<defs><radialGradient id="dvv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#dvv)"/>`;
  const cip = (s, c, y = 400, renk = '#1B1640', yazi = '#FFE45C', fs = 40) => c > 0 ? `<g transform="translate(540 ${y}) scale(${c})">` + DV.cipO(s, 0, 0, renk, yazi, fs) + '</g>' : '';
  // 1) GÜNLERCE: ahşap kapıya tebeşirle çentik çizilir (dönem: takvim yaprağı değil, çentik)
  function centik(d) { let o = R(0, 0, 1080, 1920, 0, '#6A4028');
    for (let i = 0; i < 9; i++) o += R(i * 124 - 10, 0, 118, 1920, 6, h(i) > .5 ? '#734530' : '#62391F') + `<path d="M${i * 124 + 30} 0 Q${i * 124 + 50} 900 ${i * 124 + 20} 1920" stroke="#4A2A18" stroke-width="3" fill="none" opacity=".5"/>`;
    o += R(0, 700, 1080, 40, 0, '#2A1A10', .8) + `<circle cx="140" cy="720" r="16" fill="#8A8A8A"/><circle cx="940" cy="720" r="16" fill="#8A8A8A"/>`;
    const n = Math.floor(ar(d, .1, 1.5) * 10); let s = '';
    for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), j = i % 5, x = 300 + g * 300 + j * 44;
      s += j === 4 ? `<path d="M${x - 190} 1060 L${x + 10} 880" stroke="#F4EEE0" stroke-width="16" stroke-linecap="round"/>` : `<path d="M${x} 860 L${x - 6} 1080" stroke="#F4EEE0" stroke-width="16" stroke-linecap="round"/>`; }
    o += `<g opacity=".92">${s}</g>`;
    o += cip('GÜNLERCE', ar(d, .5, .8), 1300, '#F4EEE0', '#3A2A1A', 44);
    return o + vin(); }
  // 2) AYAKKABILAR: 1518 'inek ağzı' geniş burunlu deri ayakkabı, arnavut taşında zıplar; delik taban
  function ayakkabi(d) { let o = R(0, 0, 1080, 1920, 0, '#8E8072');
    for (let r = 0; r < 12; r++) for (let c = 0; c < 6; c++) { const x = c * 200 - (r % 2) * 100, y = r * 170; o += `<rect x="${x + 8}" y="${y + 8}" width="184" height="154" rx="44" fill="${h(r * 5 + c) > .5 ? '#A8998A' : '#9A8B7C'}"/>`; }
    o = bul(o, 3);
    const ayak = (x, y, faz, ters) => { const z = Math.abs(Math.sin(d * 7 + faz)) * 110, yy = y - z;
      return `<ellipse cx="${x}" cy="${y + 40}" rx="${170 - z * .4}" ry="${30 - z * .08}" fill="#000" opacity="${.25 - z * .001}"/>` +
        `<g transform="translate(${x} ${yy}) scale(${ters ? -1 : 1} 1) rotate(${-8 + Math.sin(d * 7 + faz) * 6})">` +
        `<rect x="-60" y="-420" width="120" height="330" rx="40" fill="#5A4A6A"/><rect x="-60" y="-160" width="120" height="30" fill="#4A3A5A"/>` +
        `<path d="M-120 20 Q-150 -40 -110 -90 L60 -110 Q180 -110 190 -30 Q200 20 150 30Z" fill="#6A4028"/><path d="M-100 -80 Q20 -120 80 -100" stroke="#8E5A38" stroke-width="10" fill="none"/>` +
        `<path d="M-120 20 L150 30 Q170 34 150 44 L-110 40Z" fill="#3A2418"/><ellipse cx="40" cy="36" rx="26" ry="8" fill="#8E8072"/><path d="M-60 -60 Q-40 -30 -70 -10" stroke="#8E2A2A" stroke-width="8" fill="none" opacity=".55"/></g>`; };
    o += ayak(360, 1260, 0, false) + ayak(720, 1330, 1.6, true);
    for (let i = 0; i < 6; i++) { const q = (d * 1.4 + i / 6) % 1; o += `<circle cx="${300 + h(i) * 520}" cy="${1340 - q * 160}" r="${14 + q * 30}" fill="#D8C8B0" opacity="${.45 * (1 - q)}"/>`; }
    o += cip('AYAKLAR KANAYANA KADAR', ar(d, .3, .6), 420, '#1B1640', '#FFE45C', 36);
    return o + vin('#1A0A04', .5); }
  // 3) REÇETE: mühürlü parşömen, tüy kalem; TEŞHİS → ÇARE
  function recete(d) { let o = R(0, 0, 1080, 1920, 0, '#5A3A24') + bul(`<circle cx="860" cy="360" r="260" fill="#FFB45C" opacity=".35"/>${DV.matula(180, 500, 2.4)}`, 12);
    o += `<g transform="rotate(-3 540 960)">` + `<path d="M150 440 Q540 400 930 440 L950 1480 Q540 1520 130 1480Z" fill="#F1E3C4"/><path d="M150 440 Q540 400 930 440 L930 480 Q540 450 150 480Z" fill="#E0CCA4"/>`;
    o += `<text x="540" y="570" font-size="44" font-weight="900" text-anchor="middle" style="fill:#6A4A2A" letter-spacing="6">HEKİMLER KURULU</text>` + R(260, 600, 560, 6, 3, '#B8986A');
    const a = ar(d, .35, .6), b = 0;  // ÇARE geniş planda (Gufi) açıklanır
    o += `<text x="540" y="760" font-size="46" font-weight="800" text-anchor="middle" style="fill:#6A4A2A">TEŞHİS:</text><text x="540" y="880" font-size="${96 * (a > 0 ? 1 : 0)}" font-weight="900" text-anchor="middle" style="fill:#B8232F" opacity="${a}">SICAK KAN</text>`;
    o += `<text x="540" y="1060" font-size="46" font-weight="800" text-anchor="middle" style="fill:#6A4A2A">ÇARE:</text>` + (b > 0 ? `<text x="540" y="1180" font-size="92" font-weight="900" text-anchor="middle" style="fill:#1B1640" opacity="${b}">DAHA ÇOK DANS</text>` : `<text x="540" y="1180" font-size="92" font-weight="900" text-anchor="middle" style="fill:#B8986A">?</text>`);
    o += `<circle cx="780" cy="1360" r="70" fill="#B8232F"/><circle cx="780" cy="1360" r="50" fill="none" stroke="#8E1B2F" stroke-width="8"/><text x="780" y="1378" font-size="48" font-weight="900" text-anchor="middle" style="fill:#8E1B2F">S</text></g>`;
    o += `<g transform="translate(${900 - 40 * a} ${700 + 50 * a}) rotate(35)"><path d="M0 0 Q40 -200 10 -420 Q-40 -200 0 0Z" fill="#F4EEE0"/><path d="M0 0 L4 -380" stroke="#C8B89A" stroke-width="5"/><path d="M-4 0 L4 0 L0 40Z" fill="#1B1B1B"/></g>`;
    return o + vin(); }
  // 4) FERMAN: kapıya çakılı; çekiç iner
  function ferman(d) { let o = R(0, 0, 1080, 1920, 0, '#6A4028');
    for (let i = 0; i < 9; i++) o += R(i * 124 - 10, 0, 118, 1920, 6, h(i + 3) > .5 ? '#734530' : '#62391F');
    const g = FX.E.expo(ar(d, 0, .35));
    o += `<g transform="translate(540 ${980 - (1 - g) * 900}) rotate(${2 - (1 - g) * 10})"><path d="M-360 -520 L360 -520 L380 520 L-380 520Z" fill="#F1E3C4"/><path d="M-360 -520 L360 -520 L360 -470 L-360 -470Z" fill="#E0CCA4"/>`;
    o += `<text x="0" y="-380" font-size="40" font-weight="800" text-anchor="middle" style="fill:#6A4A2A" letter-spacing="6">STRAZBURG MECLİSİ</text><text x="0" y="-320" font-size="32" font-weight="700" text-anchor="middle" style="fill:#8E6A4A">AĞUSTOS 1518</text>`;
    o += `<text x="0" y="-120" font-size="104" font-weight="900" text-anchor="middle" style="fill:#B8232F">MÜZİK VE</text><text x="0" y="10" font-size="104" font-weight="900" text-anchor="middle" style="fill:#B8232F">DANS</text><text x="0" y="170" font-size="104" font-weight="900" text-anchor="middle" style="fill:#1B1640">YASAKTIR</text>`;
    o += [0, 1, 2, 3, 4].map(i => R(-280, 260 + i * 42, 560, 12, 6, '#C8B08A')).join('') + `<circle cx="-330" cy="-490" r="16" fill="#5A5A5A"/><circle cx="330" cy="-490" r="16" fill="#5A5A5A"/></g>`;
    const c = ar(d, .45, .7), up = Math.abs(Math.sin(ar(d, .45, 1.6) * Math.PI * 3)); if (c > 0 && d < 1.7) o += `<g transform="translate(${720} ${360 - up * 120}) rotate(${-30 + up * 40})"><rect x="-10" y="0" width="22" height="260" rx="8" fill="#8E5A30"/><rect x="-70" y="-40" width="150" height="60" rx="10" fill="#5A5A6A"/></g>`;
    return o + vin(); }
  // 5) KIRMIZI AYAKKABILAR + haç, mum ışığı (Aziz Vitus türbesi)
  function kirmizi(d) { let o = R(0, 0, 1080, 1920, 0, '#2A1A22') + bul(`<path d="M200 0 L880 0 L880 900 Q540 700 200 900Z" fill="#5A3A4A"/><circle cx="540" cy="520" r="300" fill="#FFB45C" opacity=".25"/>`, 20);
    o += R(80, 1180, 920, 740, 20, '#6A4028') + R(80, 1180, 920, 40, 20, '#8E5A30') + `<path d="M120 1220 L960 1220 L960 1300 L120 1300Z" fill="#F1E3C4" opacity=".9"/>`;
    o += `<g transform="translate(540 660)"><rect x="-18" y="-260" width="36" height="420" rx="6" fill="#E8C878"/><rect x="-120" y="-170" width="240" height="36" rx="6" fill="#E8C878"/></g>`;
    const sh = (x, r) => `<g transform="translate(${x} 1210) rotate(${r})"><path d="M-130 0 Q-150 -60 -110 -100 L40 -120 Q150 -120 160 -40 Q170 0 130 6Z" fill="#C8232F"/><path d="M-110 -100 Q-20 -40 60 -110" stroke="#8E1B2F" stroke-width="10" fill="none"/><path d="M-100 -90 Q0 -130 60 -112" stroke="#FF6A6A" stroke-width="8" fill="none" opacity=".7"/><path d="M-130 0 L130 6 L130 18 L-128 14Z" fill="#6A1020"/></g>`;
    o += sh(380, -4) + sh(720, 5);
    [[220, 1060], [880, 1060]].forEach(([x, y], i) => { const f = 1 + .08 * Math.sin(d * 12 + i); o += R(x - 22, y, 44, 160, 8, '#F4EEE0') + `<ellipse cx="${x}" cy="${y - 26 * f}" rx="${14 * f}" ry="${30 * f}" fill="#FFC45C"/><circle cx="${x}" cy="${y - 20}" r="${80 * f}" fill="#FFC45C" opacity=".18"/>`; });
    o += cip('KIRMIZI AYAKKABI + DUA', ar(d, .3, .6), 1560, '#F4EEE0', '#6A1020', 36);
    return o + vin('#000', .45); }
  // 6) ÇAVDAR MAHMUZU (ergot): başakta mor-siyah boynuzsu mantar
  function ergot(d) { let o = R(0, 0, 1080, 1920, 0, '#9FC8E0') + bul(`<path d="M0 1100 Q540 1000 1080 1100 L1080 1920 L0 1920Z" fill="#D8B85A"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<ellipse cx="${80 + i * 160}" cy="${1000 - (i % 2) * 80}" rx="30" ry="110" fill="#E8C868"/>`).join(''), 18);
    const sw = Math.sin(d * 2) * 3;
    o += `<g transform="rotate(${sw} 540 1900)"><path d="M540 1920 Q530 1400 540 820" stroke="#B8943A" stroke-width="22" fill="none"/>`;
    for (let i = 0; i < 12; i++) { const y = 400 + i * 38, sd = i % 2 ? 1 : -1, er = i === 4 || i === 7;
      o += `<ellipse cx="${540 + sd * 44}" cy="${y}" rx="30" ry="60" fill="#E8C868" transform="rotate(${sd * 22} ${540 + sd * 44} ${y})"/><path d="M${540 + sd * 60} ${y - 50} L${540 + sd * 130} ${y - 190}" stroke="#D8B050" stroke-width="4"/>`;
      if (er) { const g = ar(d, .3 + (i === 7 ? .3 : 0), .8 + (i === 7 ? .3 : 0)); o += `<path d="M${540 + sd * 40} ${y + 20} Q${540 + sd * 70} ${y - 60} ${540 + sd * 120} ${y - 60 - 110 * g} Q${540 + sd * 100} ${y - 40} ${540 + sd * 70} ${y + 30}Z" fill="#3A1E3A"/><path d="M${540 + sd * 75} ${y - 30} Q${540 + sd * 95} ${y - 70} ${540 + sd * 110} ${y - 50 - 90 * g}" stroke="#6A3A6A" stroke-width="6" fill="none"/>`; } }
    o += `<ellipse cx="540" cy="380" rx="36" ry="70" fill="#E8C868"/></g>`;
    o += cip('ÇAVDAR MAHMUZU', ar(d, .4, .7), 1480, '#3A1E3A', '#FFE45C', 42) + cip('ZEHİRLİ MANTAR', ar(d, .7, 1.0), 1600, '#F4EEE0', '#3A1E3A', 32);
    return o + vin('#0A1020', .35); }
  return { centik, ayakkabi, recete, ferman, kirmizi, ergot };
})();
