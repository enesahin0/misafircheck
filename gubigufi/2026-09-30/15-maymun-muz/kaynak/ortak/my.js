/* #15 Maymun & Muz — maymun karakteri + sahne eşyaları (MY). Flat, kontursuz, tonal gölge + rim; gözler maskotlarla aynı dilde. */
const MY = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const C = { kurk: '#8E5A3A', kurkK: '#6A3E26', kurkA: '#B07A52', yuz: '#F2C6A0', yuzK: '#D9A57C', goz: '#1B1640' };
  // market muzu: (x,y) orta, s ölçek, rot derece
  function muz(x, y, s = 1, rot = 0, soyuk = 0) {
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`;
    o += `<path d="M-90 -20 Q-60 60 40 50 Q90 40 110 -10 Q80 20 30 22 Q-40 22 -70 -30Z" fill="#E0A020"/><path d="M-88 -22 Q-60 50 40 42 Q86 34 104 -6 Q70 12 30 12 Q-40 10 -70 -32Z" fill="#FFD23F"/><path d="M-60 -10 Q-30 30 30 30" stroke="#FFF3A0" stroke-width="6" fill="none" opacity=".7"/>`;
    o += `<path d="M-72 -30 L-92 -52 L-84 -58 L-66 -36Z" fill="#6A4A20"/><circle cx="108" cy="-10" r="7" fill="#4A3010"/>`;
    if (soyuk) o += `<path d="M-70 -32 Q-100 -10 -120 30 Q-90 10 -64 -18Z" fill="#FFD23F"/><path d="M-70 -32 Q-40 -70 -10 -80 Q-30 -40 -58 -22Z" fill="#E0A020"/><path d="M-70 -32 Q-60 -20 -40 -26" fill="#FFF6D6"/>`;
    return o + '</g>';
  }
  function yabaniMuz(x, y, s = 1, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-60 -18 Q-40 40 30 34 Q62 26 72 -6 Q50 10 20 12 Q-30 12 -46 -26Z" fill="#7FA640"/><path d="M-58 -20 Q-40 30 30 26 Q58 20 66 -2" stroke="#A8C860" stroke-width="5" fill="none"/>` + [[-30, 6], [-5, 14], [22, 14], [45, 6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="#4A6020" opacity=".6"/>`).join('') + `<path d="M-50 -22 L-66 -40 L-58 -44 L-44 -28Z" fill="#5A4020"/></g>`; }
  // MAYMUN: (x,y) = oturduğu taban; boy ≈ oturur yükseklik
  // o: { t, duygu: normal|mutlu|saskin|uzgun|agla, el: yan|uzat|yukari|agiz|kasi, hedef:[x,y], tutar: 'muz'|'yaprak'|'salata'|null, parlak:0..1, bak:[dx,dy] | 'kamera', yon: 1|-1 }
  function maymun(x, y, boy, o = {}) {
    const { t = 0, duygu = 'normal', el = 'yan', hedef = null, tutar = null, parlak = 0, bak = null, yon = 1 } = o;
    const s = boy / 420, hy = y - 300 * s, hx = x;
    let dy = Math.sin(t * 2.2) * 4 * s, sx = 1, sy = 1 + .015 * Math.sin(t * 2.2), rot = 0;
    const agla = duygu === 'agla'; if (agla) { const hk = Math.abs(Math.sin(t * 9)); dy += hk * 6 * s; sy *= 1 - .03 * hk; rot = Math.sin(t * 5) * 2; }
    let g = '';
    // kuyruk
    g += `<path d="M${x + 110 * s} ${y - 40 * s} Q${x + 260 * s} ${y - 20 * s} ${x + 250 * s} ${y - 160 * s} Q${x + 240 * s} ${y - 240 * s} ${x + 180 * s} ${y - 220 * s} Q${x + 150 * s} ${y - 200 * s} ${x + 180 * s} ${y - 180 * s}" stroke="${C.kurkK}" stroke-width="${26 * s}" fill="none" stroke-linecap="round"/>`;
    // gövde + karın
    g += `<ellipse cx="${x}" cy="${y - 110 * s}" rx="${140 * s}" ry="${130 * s}" fill="${C.kurkK}"/><ellipse cx="${x - 10 * s}" cy="${y - 118 * s}" rx="${132 * s}" ry="${124 * s}" fill="${C.kurk}"/><ellipse cx="${x}" cy="${y - 96 * s}" rx="${80 * s}" ry="${90 * s}" fill="${C.yuz}"/>`;
    // ayaklar
    g += `<ellipse cx="${x - 80 * s}" cy="${y - 10 * s}" rx="${56 * s}" ry="${26 * s}" fill="${C.kurkK}"/><ellipse cx="${x + 80 * s}" cy="${y - 10 * s}" rx="${56 * s}" ry="${26 * s}" fill="${C.kurkK}"/><ellipse cx="${x - 96 * s}" cy="${y - 12 * s}" rx="${24 * s}" ry="${14 * s}" fill="${C.yuzK}"/><ellipse cx="${x + 96 * s}" cy="${y - 12 * s}" rx="${24 * s}" ry="${14 * s}" fill="${C.yuzK}"/>`;
    // kollar: omuz → el
    const om = [[x - 110 * s, y - 190 * s], [x + 110 * s, y - 190 * s]];
    const ag = [hx + 8 * s, hy + 70 * s];
    let el2 = [[x - 150 * s, y - 60 * s], [x + 150 * s, y - 60 * s]];
    if (el === 'uzat' && hedef) el2[1] = [x + (hedef[0] - x) * .55, y - 190 * s + (hedef[1] - (y - 190 * s)) * .55];
    if (el === 'yukari') el2 = [[x - 150 * s, y - 60 * s], [x + 170 * s, y - 330 * s]];
    if (el === 'agiz') { const k = Math.abs(Math.sin(t * 5)); el2 = [[x - 150 * s, y - 60 * s], [ag[0] + 70 * s * k, ag[1] + 30 * s * k]]; }
    if (el === 'kasi') el2 = [[x - 150 * s, y - 60 * s], [hx + 120 * s, hy - 110 * s + Math.sin(t * 16) * 10 * s]];
    if (el === 'iki') el2 = [[x - 120 * s, y - 150 * s], [x + 120 * s, y - 150 * s]];
    if (agla) el2 = [[hx - 70 * s, hy + 40 * s], [hx + 70 * s, hy + 40 * s]];
    const kol = (a, b) => `<path d="M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2 + (b[0] > a[0] ? 20 : -20) * s} ${(a[1] + b[1]) / 2 + 30 * s} ${b[0]} ${b[1]}" stroke="${C.kurk}" stroke-width="${46 * s}" fill="none" stroke-linecap="round"/><circle cx="${b[0]}" cy="${b[1]}" r="${30 * s}" fill="${C.yuzK}"/>`;
    const esya = (p) => tutar === 'muz' ? muz(p[0] + 40 * s, p[1] - 20 * s, .9 * s, -40, el === 'agiz' ? 1 : 0) : tutar === 'yaprak' ? `<path d="M${p[0]} ${p[1]} q${60 * s} ${-80 * s} ${120 * s} ${-60 * s} q${-20 * s} ${70 * s} ${-120 * s} ${60 * s}Z" fill="#3FA35A"/>` : tutar === 'salata' ? salataKase(p[0] + 20 * s, p[1] - 10 * s, .45 * s) : '';
    // baş
    let b = `<circle cx="${hx - 150 * s}" cy="${hy - 10 * s}" r="${56 * s}" fill="${C.kurk}"/><circle cx="${hx - 150 * s}" cy="${hy - 10 * s}" r="${32 * s}" fill="${C.yuzK}"/><circle cx="${hx + 150 * s}" cy="${hy - 10 * s}" r="${56 * s}" fill="${C.kurk}"/><circle cx="${hx + 150 * s}" cy="${hy - 10 * s}" r="${32 * s}" fill="${C.yuzK}"/>`;
    b += `<circle cx="${hx}" cy="${hy}" r="${160 * s}" fill="${C.kurkK}"/><circle cx="${hx - 8 * s}" cy="${hy - 8 * s}" r="${154 * s}" fill="${C.kurk}"/><path d="M${hx - 70 * s} ${hy - 150 * s} q${40 * s} ${-40 * s} ${60 * s} ${10 * s} q${20 * s} ${-50 * s} ${60 * s} ${-10 * s}" fill="${C.kurkA}"/>`;
    // yüz maskesi (kalp)
    b += `<circle cx="${hx - 54 * s}" cy="${hy - 20 * s}" r="${70 * s}" fill="${C.yuz}"/><circle cx="${hx + 54 * s}" cy="${hy - 20 * s}" r="${70 * s}" fill="${C.yuz}"/><ellipse cx="${hx}" cy="${hy + 62 * s}" rx="${96 * s}" ry="${70 * s}" fill="${C.yuz}"/>`;
    // gözler
    let v = [0, 0]; if (bak === 'kamera') v = [0, .1]; else if (Array.isArray(bak)) v = bak;
    const kirp = (t % 4.3) < .13 ? .15 : 1;
    [-1, 1].forEach(k => { const ex = hx + k * 54 * s, ey = hy - 26 * s;
      if (duygu === 'mutlu') b += `<path d="M${ex - 28 * s} ${ey + 6 * s} Q${ex} ${ey - 26 * s} ${ex + 28 * s} ${ey + 6 * s}" stroke="${C.goz}" stroke-width="${10 * s}" fill="none" stroke-linecap="round"/>`;
      else { const ry = (duygu === 'saskin' ? 40 : 34) * s * kirp; b += `<ellipse cx="${ex}" cy="${ey}" rx="${30 * s}" ry="${ry}" fill="#FFFFFF"/>`;
        if (kirp > .5) b += `<circle cx="${ex + v[0] * 10 * s}" cy="${ey + (agla || duygu === 'uzgun' ? 8 : 0) * s + v[1] * 10 * s}" r="${(duygu === 'saskin' ? 11 : 16) * s}" fill="${C.goz}"/><circle cx="${ex + v[0] * 10 * s + 6 * s}" cy="${ey - 8 * s}" r="${5 * s}" fill="#FFFFFF"/>`;
        if (agla || duygu === 'uzgun') b += `<path d="M${ex - 32 * s} ${ey - 40 * s - k * 0} L${ex + 30 * s} ${ey - 40 * s + (k < 0 ? -14 : 14) * s * -1}" stroke="${C.kurkK}" stroke-width="${10 * s}" stroke-linecap="round"/>`; } });
    // burun + ağız
    b += `<ellipse cx="${hx - 12 * s}" cy="${hy + 38 * s}" rx="${7 * s}" ry="${5 * s}" fill="${C.kurkK}"/><ellipse cx="${hx + 12 * s}" cy="${hy + 38 * s}" rx="${7 * s}" ry="${5 * s}" fill="${C.kurkK}"/>`;
    const my = hy + 80 * s;
    if (duygu === 'mutlu') b += `<path d="M${hx - 50 * s} ${my - 8 * s} Q${hx} ${my + 50 * s} ${hx + 50 * s} ${my - 8 * s}Z" fill="#7E2E3A"/><path d="M${hx - 26 * s} ${my + 18 * s} Q${hx} ${my + 36 * s} ${hx + 26 * s} ${my + 18 * s}" fill="#E8505B"/>`;
    else if (duygu === 'saskin') b += `<ellipse cx="${hx}" cy="${my + 6 * s}" rx="${20 * s}" ry="${26 * s}" fill="#7E2E3A"/>`;
    else if (agla) { const a = Math.abs(Math.sin(t * 9)); b += `<path d="M${hx - 46 * s} ${my + 26 * s} Q${hx} ${my - 20 * s - 10 * a * s} ${hx + 46 * s} ${my + 26 * s}Z" fill="#7E2E3A"/>`; }
    else if (duygu === 'uzgun') b += `<path d="M${hx - 36 * s} ${my + 16 * s} Q${hx} ${my - 12 * s} ${hx + 36 * s} ${my + 16 * s}" stroke="#7E2E3A" stroke-width="${9 * s}" fill="none" stroke-linecap="round"/>`;
    else b += `<path d="M${hx - 30 * s} ${my} Q${hx} ${my + 22 * s} ${hx + 30 * s} ${my}" stroke="#7E2E3A" stroke-width="${9 * s}" fill="none" stroke-linecap="round"/>`;
    b += `<circle cx="${hx - 100 * s}" cy="${hy + 30 * s}" r="${18 * s}" fill="#E88A7A" opacity=".5"/><circle cx="${hx + 100 * s}" cy="${hy + 30 * s}" r="${18 * s}" fill="#E88A7A" opacity=".5"/>`;
    // gözyaşı
    let yas = '';
    if (agla) [-1, 1].forEach(k => { const ex = hx + k * 54 * s, ey = hy - 4 * s;
      yas += `<path d="M${ex + k * 14 * s} ${ey} Q${ex + k * 40 * s} ${ey + 60 * s} ${ex + k * 34 * s} ${ey + 200 * s}" stroke="#6CC8F0" stroke-width="${14 * s}" fill="none" stroke-linecap="round" opacity=".9"/>`;
      for (let i = 0; i < 3; i++) { const q = (t * 1.8 + i / 3 + (k > 0 ? .5 : 0)) % 1; yas += `<ellipse cx="${ex + k * (50 + 90 * q) * s}" cy="${ey + (20 + 160 * q) * s + 300 * q * q * s}" rx="${10 * s}" ry="${14 * s}" fill="#6CC8F0" opacity="${1 - q}"/>`; } });
    // katman sırası: kuyruk/gövde → baş → kollar (öne) → eşya
    let svg = g + b + kol(om[0], el2[0]) + kol(om[1], el2[1]) + esya(el2[1]) + yas;
    if (parlak > 0) { for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t, r = (180 + 30 * Math.sin(t * 3 + i)) * s; svg += `<path d="M0 -1 L.25 -.25 L1 0 L.25 .25 L0 1 L-.25 .25 L-1 0 L-.25 -.25Z" transform="translate(${x + Math.cos(a) * r} ${y - 200 * s + Math.sin(a) * r * .9}) scale(${(14 + 8 * Math.sin(t * 6 + i)) * s * parlak})" fill="#FFF3A0"/>`; }
      svg = `<path d="M${hx + 60 * s} ${hy - 140 * s} q${60 * s} ${30 * s} ${80 * s} ${90 * s}" stroke="#FFFFFF" stroke-width="${12 * s}" fill="none" opacity="${.5 * parlak}" stroke-linecap="round"/>` + svg; }
    const yer = `<ellipse cx="${x}" cy="${y + 4}" rx="${170 * s}" ry="${22 * s}" fill="#000" opacity=".18"/>`;
    return yer + `<g transform="translate(${x} ${y + dy}) rotate(${rot}) scale(${yon * sx} ${sy}) translate(${-x} ${-y})">${svg}</g>`;
  }
  function salataKase(x, y, s = 1) { let o = `<g transform="translate(${x} ${y}) scale(${s})">` + `<path d="M-200 -40 Q-190 120 0 130 Q190 120 200 -40Z" fill="#2E9A9C"/><path d="M-200 -40 Q0 -10 200 -40 Q190 -5 0 10 Q-190 -5 -200 -40Z" fill="#1F7A80"/>`;
    [[-140, -60, '#3FA35A'], [-60, -100, '#6CC04A'], [30, -90, '#3FA35A'], [120, -70, '#8FD65A'], [-100, -110, '#8FD65A'], [70, -120, '#6CC04A']].forEach(([a, b, c], i) => o += `<ellipse cx="${a}" cy="${b}" rx="80" ry="46" transform="rotate(${i * 30 - 60} ${a} ${b})" fill="${c}"/>`);
    o += `<circle cx="-30" cy="-70" r="22" fill="#E8505B"/><circle cx="60" cy="-60" r="18" fill="#E8505B"/><ellipse cx="0" cy="-110" rx="40" ry="16" fill="#FFB44C"/>`;
    return o + `<path d="M-180 -10 Q0 20 180 -10" stroke="#FFFFFF" stroke-width="10" fill="none" opacity=".25"/></g>`; }
  function pasta(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="10" rx="170" ry="30" fill="#FFFFFF"/><path d="M-130 0 L-130 -120 L120 -170 L120 -40Z" fill="#F7B8C8"/><path d="M-130 -120 L120 -170 L150 -160 L-100 -110Z" fill="#FFE6EE"/><path d="M-130 -60 L120 -105" stroke="#FFFFFF" stroke-width="16"/><path d="M120 -170 L120 -40 L150 -30 L150 -160Z" fill="#E88AA8"/><circle cx="20" cy="-190" r="26" fill="#E8505B"/><path d="M20 -214 q10 -20 24 -18" stroke="#3FA35A" stroke-width="6" fill="none"/></g>`; }
  // ORMAN (geniş plan): katmanlı yeşiller, sarmaşıklar, büyük yapraklar, ışık hüzmeleri; zemin y=zY
  function orman(T, t = 0, zY = 1200, { dal = null } = {}) {
    let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>`;
    for (let i = 0; i < 5; i++) o += `<path d="M${i * 260 - 40} 0 L${i * 260 + 60} 0 L${i * 260 + 300} ${zY} L${i * 260 + 160} ${zY}Z" fill="#FFFFFF" opacity=".08"/>`;
    for (let k = 0; k < 3; k++) { const c = [T.fon2, T.orta, T.koyu][k], yy = 300 + k * 260; for (let i = 0; i < 7; i++) o += `<circle cx="${i * 180 + (k % 2) * 90 - 40}" cy="${yy + (i % 2) * 40}" r="${170 - k * 20}" fill="${c}" opacity="${.5 + k * .2}"/>`; }
    [[90, 70], [960, 60], [720, 44]].forEach(([x, w]) => o += R(x - w / 2, 0, w, zY, w / 2, T.cokKoyu) + R(x - w / 2 + 8, 0, w * .25, zY, 8, '#FFFFFF', .08));
    for (let i = 0; i < 5; i++) { const x = 160 + i * 190, L = 300 + (i % 3) * 180; let d = `M${x} 0`; for (let j = 1; j <= 8; j++) d += ` Q${x + (j % 2 ? 30 : -30)} ${L * (j - .5) / 8} ${x + Math.sin(t + i + j) * 6} ${L * j / 8}`; o += `<path d="${d}" stroke="${T.koyu}" stroke-width="10" fill="none"/>`; for (let j = 1; j < 6; j++) o += `<ellipse cx="${x + (j % 2 ? 18 : -18)}" cy="${L * j / 6}" rx="22" ry="12" fill="${T.orta}" transform="rotate(${j % 2 ? 30 : -30} ${x} ${L * j / 6})"/>`; }
    if (dal) { const [x0, x1, y] = dal; o += `<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y - 30} ${x1} ${y + 10}" stroke="#6A3E26" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M${x0} ${y - 12} Q${(x0 + x1) / 2} ${y - 42} ${x1} ${y - 2}" stroke="#8E5A3A" stroke-width="14" fill="none" opacity=".6"/>`; }
    o += R(0, zY, 1080, 1920 - zY, 0, T.orta) + `<path d="M0 ${zY} Q540 ${zY - 60} 1080 ${zY} V${zY + 30} H0Z" fill="${T.koyu}" opacity=".4"/>`;
    for (let i = 0; i < 9; i++) o += CV.otTutami(60 + i * 120, zY + 40 + (i % 3) * 200, 1.2, T.koyu);
    return o;
  }
  const onYapraklar = (T, t) => { let o = ''; [[-80, 1860, 1.6, 40], [1160, 1820, 1.7, -45], [-90, 180, 1.2, 130], [1170, 240, 1.3, -135]].forEach(([x, y, s, r], i) => o += `<g transform="translate(${x} ${y}) rotate(${r + Math.sin(t * 1.5 + i) * 3}) scale(${s})"><path d="M0 0 Q90 -150 0 -330 Q-90 -150 0 0Z" fill="${T.cokKoyu}"/><path d="M0 0 L0 -320" stroke="${T.koyu}" stroke-width="6"/></g>`); return o; };
  // 1900'ler limanı: deniz, iskele, muz gemisi (x = gemi merkezi)
  function liman(T, gx) {
    let o = `<rect width="1080" height="1920" fill="${T.isik}"/><circle cx="820" cy="300" r="120" fill="#FFE9A8"/>` + CV.bulut(220, 240, .8) + R(0, 900, 1080, 400, 0, '#4FB3E8') + R(0, 900, 1080, 30, 0, '#9FE0F5', .6);
    for (let i = 0; i < 6; i++) o += R(i * 190 + 30, 980 + (i % 3) * 90, 120, 10, 5, '#FFFFFF', .4);
    o += `<g transform="translate(${gx} 960)">` + `<path d="M-330 0 L330 0 L280 140 L-290 140Z" fill="#2A2440"/><path d="M-330 0 L330 0 L322 24 L-322 24Z" fill="#E8505B"/>` + R(-200, -170, 300, 170, 14, '#FFF3E0') + [0, 1, 2, 3].map(i => `<circle cx="${-160 + i * 70}" cy="-110" r="18" fill="#4FB3E8"/>`).join('') + R(40, -300, 60, 140, 10, '#E8505B') + R(40, -300, 60, 26, 8, '#2A2440') + `<circle cx="80" cy="-340" r="${30}" fill="#DDDDDD" opacity=".7"/><circle cx="120" cy="-390" r="40" fill="#DDDDDD" opacity=".5"/>`;
    for (let i = 0; i < 5; i++) o += muzSalkim(-280 + i * 58, -10, .45);
    o += PR.Tm('MUZ GEMİSİ', 0, 90, 34, '#FFE45C', 'letter-spacing="4"') + '</g>';
    o += R(0, 1250, 1080, 670, 0, '#B07A52') + R(0, 1250, 1080, 30, 0, '#8E5A3A');
    for (let i = 0; i < 8; i++) o += R(i * 140, 1280, 6, 640, 0, '#000', .08);
    return o;
  }
  function muzSalkim(x, y, s = 1) { let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -150 L0 -60" stroke="#6A4A20" stroke-width="14"/>`; for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) o += muz(-50 + i * 34, -70 + r * 44, .38, -70 + i * 12); return o + '</g>'; }
  function sirk(T) { let o = `<rect width="1080" height="1920" fill="#3A1030"/>`; for (let i = 0; i < 12; i++) o += `<path d="M540 -100 L${i * 100 - 60} 1300 L${i * 100 + 40} 1300Z" fill="${i % 2 ? '#E8505B' : '#FFF3E0'}"/>`;
    o += `<ellipse cx="540" cy="1400" rx="720" ry="260" fill="#FFD23F"/><ellipse cx="540" cy="1400" rx="620" ry="210" fill="#C8623A"/><ellipse cx="540" cy="1380" rx="600" ry="190" fill="#E07A3A"/>`;
    for (let i = 0; i < 5; i++) o += `<path d="M${200 + i * 170} 0 L${130 + i * 170} 1300 L${270 + i * 170} 1300Z" fill="#FFF6C0" opacity=".08"/>`;
    return o; }
  function tabure(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-130 0 L-100 -220 L100 -220 L130 0Z" fill="#2E5AAC"/><rect x="-140" y="-250" width="280" height="40" rx="14" fill="#FFD23F"/>` + [0, 1, 2].map(i => `<circle cx="${-60 + i * 60}" cy="-110" r="18" fill="#FFD23F"/>`).join('') + `</g>`; }
  function oturma(T) { let o = CV.oda(T, { zeminY: 1250, pencere: [760, 300, 240, 300] }) + CV.cerceveResim(120, 420, 200, 150, T) + CV.lamba(80, 1250, .9, T) + CV.hali(540, 1520, 900, 160, T);
    return o; }
  function tv(x, y, s, ekran = '') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-260, -200, 520, 400, 40, '#8E5A3A') + R(-240, -180, 380, 320, 30, '#1B1640') + `<g><clipPath id="tvk"><rect x="-240" y="-180" width="380" height="320" rx="30"/></clipPath><g clip-path="url(#tvk)">${ekran}</g></g>` + `<circle cx="200" cy="-110" r="24" fill="#D8A032"/><circle cx="200" cy="-40" r="24" fill="#D8A032"/>` + R(170, 30, 60, 90, 8, '#6A3E26') + `<path d="M-120 -200 L-180 -300 M60 -200 L120 -310" stroke="#3A3F5C" stroke-width="8" stroke-linecap="round"/>` + R(-200, 200, 30, 60, 8, '#6A3E26') + R(170, 200, 30, 60, 8, '#6A3E26') + '</g>'; }
  function kafes(T) { let o = `<rect width="1080" height="1920" fill="${T.isik}"/>` + CV.bulut(200, 220, .8) + CV.bulut(880, 300, .6) + `<path d="M0 1000 Q540 900 1080 1000 V1920 H0Z" fill="${T.fon2}"/>`;
    o += CV.kaya(200, 1180, 1.1, T) + CV.kaya(900, 1170, .9, T) + HK.agac(880, 1150, 1.0, T.orta, T.koyu) + R(80, 700, 26, 500, 10, '#8E5A3A') + R(380, 700, 26, 500, 10, '#8E5A3A') + R(70, 690, 346, 26, 10, '#6A3E26') + `<path d="M150 716 Q170 900 160 1050" stroke="#C8A060" stroke-width="10" fill="none"/>` + R(0, 1200, 1080, 720, 0, T.orta) + R(0, 1200, 1080, 20, 0, T.koyu, .4);
    return o; }
  function citOn(T) { let o = ''; for (let i = 0; i < 12; i++) o += R(i * 96 + 20, 1560, 16, 360, 8, '#3A3F5C', .85); return o + R(0, 1600, 1080, 14, 7, '#3A3F5C', .85) + R(0, 1800, 1080, 14, 7, '#3A3F5C', .85); }
  function bahceTabela(x, y, s) { const w1 = K.yaziGen('HAYVANAT BAHÇESİ', 44) + 120; return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-20, 0, 40, 520, 12, '#6A3E26') + R(-w1 / 2, -300, w1, 330, 30, '#3FA35A') + R(-w1 / 2 + 16, -284, w1 - 32, 298, 20, '#2F8A4A') +
      Tm('PAIGNTON', 0, -220, 44, '#FFF3E0', 'letter-spacing="6"') + T_('HAYVANAT BAHÇESİ', 0, -160, 44, '#FFF3E0') + T_('2014', 0, -70, 80, '#FFE45C') + '</g>'; }
  return { muz, yabaniMuz, maymun, salataKase, pasta, orman, onYapraklar, liman, muzSalkim, sirk, tabure, oturma, tv, kafes, citOn, bahceTabela, C };
})();
