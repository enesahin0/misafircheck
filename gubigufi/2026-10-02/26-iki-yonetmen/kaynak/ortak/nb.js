/* #26 İki yönetmen — NB: sinema salonu dünyası (perde, kırmızı perde, sahne, projeksiyon ışını, boş yönetmen koltukları),
   alıntı kartları, makara, klaket, ödül heykeli, kitap, telefon, TV, üç maymun, senaryo, patlamış mısır.  NBD: detay planlar.
   KURAL: gerçek kişiler çizilmez → yönetmenler BOŞ KOLTUK simgesiyle (Z.D. / N.B.C.); sözler atıflı kartlarla. */
const NB = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const mono = (s, x, y, fs, renk, ek = '') => `<text class="mono" x="${x}" y="${y}" font-size="${fs}" style="fill:${renk}" ${ek}>${s}</text>`;
  const yaz = (s, x, y, fs, renk, w = 900, anc = 'middle', ek = '') => `<text x="${x}" y="${y}" font-size="${fs}" font-weight="${w}" text-anchor="${anc}" style="fill:${renk}" ${ek}>${s}</text>`;
  const cipO = (s, x, y, renk, yazi, fs = 30) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  const KIRMIZI = '#C8232F', ALTIN = '#F2C14E', PERDE = '#7A1626', KOYU = '#120E18';
  // ---------- salon ----------
  // ic: perdenin üstüne çizilen SVG (0 0 900 630 koordinatlı); ışık: projeksiyon ışını gücü; sallan: perde titremesi
  function salon(t, ic = '', { isik = 1, sallan = 0, perdeRenk = '#F4EEE2' } = {}) {
    const sx = Math.sin(t * 40) * 6 * sallan;
    let o = `<defs><linearGradient id="nbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17101E"/><stop offset=".6" stop-color="#2A1424"/><stop offset="1" stop-color="#120A14"/></linearGradient><radialGradient id="nbs" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#FFF8E0" stop-opacity=".5"/><stop offset="1" stop-color="#FFF8E0" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#nbg)"/>`;
    // projeksiyon ışını (arkadan perdeye)
    o += `<path d="M470 1700 L610 1700 L960 960 L120 960Z" fill="#FFF3C8" opacity="${.07 * isik}"/>`;
    for (let i = 0; i < 26; i++) { const q = (t * .06 + h(i)) % 1; o += `<circle cx="${300 + h(i + 5) * 480 + Math.sin(t + i) * 12}" cy="${1650 - q * 700}" r="${1.5 + h(i + 9) * 2.5}" fill="#FFF8D8" opacity="${.35 * isik * Math.sin(q * Math.PI)}"/>`; }
    // perde
    o += `<g transform="translate(${sx} 0)"><circle cx="540" cy="645" r="560" fill="url(#nbs)" opacity="${.5 * isik}"/>` + R(80, 320, 920, 650, 14, '#2A2A30') + R(90, 330, 900, 630, 8, perdeRenk);
    o += `<svg x="90" y="330" width="900" height="630" viewBox="0 0 900 630"><rect width="900" height="630" fill="${perdeRenk}"/>${ic}</svg>` + R(90, 330, 900, 630, 8, '#000', .04) + '</g>';
    // kırmızı perdeler (kıvrımlı)
    const kiv = (x0, yon) => { let d = ''; for (let i = 0; i < 4; i++) d += `<path d="M${x0 + yon * (i * 34)} 150 Q${x0 + yon * (i * 34 + 14)} 600 ${x0 + yon * (i * 34 + 4)} 1010" stroke="#4A0C18" stroke-width="10" fill="none" opacity=".6"/>`; return d; };
    o += `<path d="M0 100 L170 100 Q150 600 190 1010 L0 1010Z" fill="${PERDE}"/>` + kiv(10, 1) + `<path d="M1080 100 L910 100 Q930 600 890 1010 L1080 1010Z" fill="${PERDE}"/>` + kiv(1070, -1);
    o += `<path d="M0 90 Q540 190 1080 90 L1080 0 L0 0Z" fill="#5A0E1A"/><path d="M0 120 Q540 210 1080 120" stroke="#C8A040" stroke-width="8" fill="none"/>`;
    // sahne zemini + ayak ışıkları
    o += R(0, 1010, 1080, 280, 0, '#5A3A24') + R(0, 1010, 1080, 22, 0, '#7A5232') + [0, 1, 2, 3, 4, 5, 6, 7].map(i => R(i * 140 + 10, 1040 + 0, 120, 10, 0, '#3A2414', .6)).join('');
    for (let i = 0; i < 8; i++) o += `<ellipse cx="${70 + i * 134}" cy="1282" rx="30" ry="9" fill="#FFE8A0" opacity="${.7 * isik}"/><path d="M${40 + i * 134} 1280 L${100 + i * 134} 1280 L${130 + i * 134} 1030 L${10 + i * 134} 1030Z" fill="#FFE8A0" opacity="${.04 * isik}"/>`;
    o += R(0, 1290, 1080, 14, 0, '#2A1A10');
    // seyirci koltukları (ön plan siluet)
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { const x = 90 + c * 180 + r * 90, y = 1900 - r * 110; o += `<path d="M${x - 70} ${y} L${x - 70} ${y - 130} Q${x} ${y - 170} ${x + 70} ${y - 130} L${x + 70} ${y}Z" fill="${r ? '#3A0A14' : '#4A0E1C'}"/>`; }
    return o; }
  // ---------- boş yönetmen koltuğu ----------
  function koltuk(x, y, s, baş, { vurgu = 0, don = 0, renk = '#C8232F' } = {}) {
    const ay = `<g transform="translate(${x} ${y}) scale(${s * (1 - .9 * don) } ${s})" >`;
    let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
    o += `<ellipse cx="0" cy="8" rx="130" ry="18" fill="#000" opacity=".3"/>`;
    o += `<path d="M-90 0 L60 -170 M90 0 L-60 -170" stroke="#3A2414" stroke-width="16" stroke-linecap="round"/><path d="M-100 -190 L-100 -420 M100 -190 L100 -420" stroke="#3A2414" stroke-width="16" stroke-linecap="round"/>`;
    o += R(-118, -214, 236, 38, 8, '#5A3A24') + R(-110, -204, 220, 24, 6, renk) + R(-114, -430, 228, 190, 10, renk) + R(-114, -430, 228, 26, 8, '#000', .22) + R(-114, -430, 20, 190, 6, '#FFFFFF', .12);
    o += mono(baş, -baş.length * 11.5, -318, 46, '#FFF3E0', 'letter-spacing="3" style="font-weight:700"');
    if (vurgu > 0) o += `<ellipse cx="0" cy="-260" rx="${190 * vurgu}" ry="${300 * vurgu}" fill="#FFF3C8" opacity="${.14 * vurgu}"/>`;
    return o + '</g>'; }
  // ---------- makara / klaket / mısır ----------
  function makara(x, y, r, rot, renk = '#2A2A34') { let o = `<g transform="translate(${x} ${y}) rotate(${rot})"><circle r="${r}" fill="${renk}"/><circle r="${r * .88}" fill="none" stroke="#6A6A78" stroke-width="${r * .06}"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; o += `<circle cx="${Math.cos(a) * r * .55}" cy="${Math.sin(a) * r * .55}" r="${r * .2}" fill="#F4EEE2"/>`; }
    return o + `<circle r="${r * .14}" fill="#8A8A98"/></g>`; }
  function klaket(x, y, s, ac, yaz1 = '', yaz2 = '') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-130, -90, 260, 170, 10, '#1B1B22') + [0, 1, 2, 3, 4].map(i => R(-120 + i * 48, -76, 24, 28, 2, '#F4EEE2')).join('') + mono(yaz1, -118, 4, 30, '#F4EEE2') + mono(yaz2, -118, 48, 30, '#F4EEE2') +
      `<g transform="rotate(${-ac * 28} -130 -90)">` + R(-130, -140, 260, 50, 8, '#1B1B22') + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${-130 + i * 44} -140 l24 0 l-14 50 l-24 0Z" fill="#F4EEE2"/>`).join('') + '</g></g>'; }
  function misir(x, y, s, dolu = 1) { let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
    for (let i = 0; i < 9; i++) o += `<circle cx="${-60 + (i % 5) * 30 + (h(i) - .5) * 14}" cy="${-110 + Math.floor(i / 5) * 24 + (h(i + 3) - .5) * 10}" r="${22 + h(i + 6) * 8}" fill="${i % 3 ? '#FFF1B8' : '#FFE27A'}"/>`;
    o += `<path d="M-90 -90 L-70 90 L70 90 L90 -90Z" fill="#fff"/>` + [0, 1, 2, 3].map(i => `<path d="M${-82 + i * 44} -88 L${-60 + i * 28} 90 L${-32 + i * 28} 90 L${-38 + i * 44} -88Z" fill="${KIRMIZI}"/>`).join('') + '</g>'; return o; }
  // uçan mısır taneleri (deterministik)
  function misirYagmur(t, t0, adet = 14, x0 = 540, y0 = 1500) { let o = ''; const d = t - t0; if (d < 0 || d > 2.2) return '';
    for (let i = 0; i < adet; i++) { const vx = (h(i + 1) - .5) * 900, vy = -520 - h(i + 9) * 520, x = x0 + vx * d * .5, y = y0 + vy * d + 700 * d * d; o += `<circle cx="${x}" cy="${y}" r="${12 + h(i + 5) * 8}" fill="${i % 2 ? '#FFF1B8' : '#FFE27A'}" opacity="${1 - ar(d, 1.4, 2.2)}"/>`; }
    return o; }
  function konfeti(t, t0, adet = 30, x0 = 540, y0 = 700) { let o = ''; const d = t - t0; if (d < 0 || d > 2.4) return '';
    for (let i = 0; i < adet; i++) { const a = h(i + 2) * Math.PI * 2, v = 200 + h(i + 8) * 600, x = x0 + Math.cos(a) * v * d, y = y0 + Math.sin(a) * v * d + 500 * d * d; o += `<rect x="${x}" y="${y}" width="${14 + h(i) * 12}" height="${8 + h(i + 4) * 8}" fill="${['#F2C14E', '#E8505B', '#4A8AD8', '#FFFFFF', '#3FC878'][i % 5]}" transform="rotate(${d * 600 * (h(i) - .5)} ${x} ${y})" opacity="${1 - ar(d, 1.6, 2.4)}"/>`; }
    return o; }
  // ---------- alıntı kartı ----------
  function alinti(satirlar, kim, { x = 540, y = 640, w = 820, renk = '#FFF3E0', zemin = '#0B1433', vurgu = '#FFE45C', fs = 74, p = 1, rot = 0, serit = null } = {}) {
    let f = fs; for (const sa of satirlar) while (f > 30 && K.yaziGen(sa, f) > w - 100) f -= 2;
    const hh = satirlar.length * f * 1.2 + 190, y0 = -hh / 2;
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${p})">` + R(-w / 2 + 10, y0 + 12, w, hh, 36, '#000', .3) + R(-w / 2, y0, w, hh, 36, zemin) + `<rect x="${-w / 2}" y="${y0}" width="${w}" height="${hh}" rx="36" fill="none" stroke="${vurgu}" stroke-width="5"/>`;
    o += yaz('“', -w / 2 + 70, y0 + 120, 160, vurgu, 900, 'middle', 'opacity=".9"');
    satirlar.forEach((sa, i) => o += yaz(sa, 0, y0 + 100 + f * (.98 + i * 1.2) , f, renk, 900));
    o += `<g transform="translate(0 ${y0 + hh})">` + cipO(kim, 0, 0, serit || vurgu, '#0B1433', 28) + '</g>';
    return o + '</g>'; }
  // ---------- ödül heykeli (Altın Portakal: altın portakal + yaprak, kaide) ----------
  function portakal(x, y, s, parla = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">` + `<ellipse cx="0" cy="10" rx="150" ry="22" fill="#000" opacity=".3"/>` + R(-110, -60, 220, 70, 10, '#5A3A24') + R(-90, -90, 180, 38, 8, '#7A5232') + R(-70, -110, 140, 30, 8, '#C8A040') +
      `<circle cx="0" cy="-260" r="${150 * parla + 40}" fill="#FFE27A" opacity="${.18 * parla}"/><circle cx="0" cy="-230" r="130" fill="#E8A020"/><circle cx="-30" cy="-250" r="108" fill="#F2B83A"/><circle cx="-52" cy="-282" r="38" fill="#FFF3B0" opacity=".7"/>` +
      `<path d="M0 -360 Q40 -420 90 -380 Q50 -350 4 -358Z" fill="#4E9A4E"/><path d="M-4 -358 Q-50 -410 -96 -382 Q-50 -346 -4 -358Z" fill="#3E8A3E"/><rect x="-4" y="-372" width="8" height="26" rx="4" fill="#6A4A20"/>` + '</g>'; }
  // ---------- kitap (KIŞ UYKUSU) ----------
  function kitap(x, y, s, ac = 0, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-150, -210, 300, 420, 14, '#000', .25) + R(-155, -215, 300, 420, 14, '#1E3A5A') + R(-155, -215, 22, 420, 8, '#10243A') + R(-120, -170, 250, 6, 3, '#E8D090') + `<text x="-0" y="-70" font-size="62" font-weight="900" text-anchor="middle" style="fill:#F4EEE2" transform="translate(-4 0)">KIŞ</text><text x="-4" y="0" font-size="62" font-weight="900" text-anchor="middle" style="fill:#F4EEE2">UYKUSU</text>` + R(-120, 60, 250, 6, 3, '#E8D090') + `<path d="M-60 120 L0 90 L60 120 L0 150Z" fill="#E8D090" opacity=".8"/>` +
      (ac > 0 ? R(-140 + 280 * (1 - ac), -200, 280 * ac, 400, 8, '#F4EEE2') : '') + '</g>'; }
  // ---------- telefon + X kartı ----------
  function telefon(x, y, s, ic = '', ekr = '#0B0F1A') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-210, -400, 420, 800, 56, '#000', .3) + R(-216, -406, 432, 812, 56, '#1B1B22') + R(-200, -390, 400, 780, 44, ekr) + R(-60, -378, 120, 22, 11, '#05050A') + `<svg x="-200" y="-380" width="400" height="760" viewBox="0 0 400 760">${ic}</svg>` + '</g>'; }
  // ---------- eski tüplü TV ----------
  function tv(x, y, s, ic = '') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-300, -240, 600, 460, 50, '#2A2A30') + R(-300, -240, 600, 20, 20, '#4A4A52') + R(-262, -204, 450, 388, 34, '#0A0A10') + `<svg x="-254" y="-196" width="434" height="372" viewBox="0 0 434 372"><rect width="434" height="372" fill="#1E2A44"/>${ic}</svg>` + R(-254, -196, 434, 372, 28, '#FFFFFF', .05) + `<circle cx="242" cy="-100" r="22" fill="#6A6A72"/><circle cx="242" cy="-30" r="22" fill="#6A6A72"/>` + R(-100, 220, 200, 36, 8, '#3A3A42') + '</g>'; }
  // ---------- üç maymun (genel simge) ----------
  function maymun(x, y, s, kapat = 'goz') { const yuz = (cx, mod) => `<g transform="translate(${cx} 0)"><circle cx="-80" cy="-14" r="34" fill="#8A5A30"/><circle cx="80" cy="-14" r="34" fill="#8A5A30"/><circle r="100" cy="0" fill="#A8703C"/><ellipse cy="28" rx="66" ry="52" fill="#E8C898"/><circle cx="-34" cy="-18" r="14" fill="#FFF"/><circle cx="34" cy="-18" r="14" fill="#FFF"/><circle cx="-34" cy="-18" r="6" fill="#1B1640"/><circle cx="34" cy="-18" r="6" fill="#1B1640"/><path d="M-24 52 Q0 70 24 52" stroke="#5A3A20" stroke-width="7" fill="none" stroke-linecap="round"/>` +
        (mod === 'goz' ? `<ellipse cx="-34" cy="-18" rx="44" ry="26" fill="#8A5A30"/><ellipse cx="34" cy="-18" rx="44" ry="26" fill="#8A5A30"/>` : mod === 'kulak' ? `<circle cx="-100" cy="-14" r="40" fill="#8A5A30"/><circle cx="100" cy="-14" r="40" fill="#8A5A30"/>` : `<ellipse cy="52" rx="48" ry="26" fill="#8A5A30"/>`) + '</g>';
    return `<g transform="translate(${x} ${y}) scale(${s})">` + yuz(-250, 'goz') + yuz(0, 'kulak') + yuz(250, 'agiz') + '</g>'; }
  // ---------- senaryo sayfası ----------
  function senaryo(x, y, s, rot, damga = 0, yaziAd = 'SENARYO') { let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-190, -250, 380, 500, 10, '#000', .22) + R(-196, -256, 380, 500, 10, '#F6F2E8') + R(-196, -256, 380, 60, 10, '#E8E0D0') + mono(yaziAd, -170, -214, 30, '#4A4034', 'letter-spacing="4"');
    for (let i = 0; i < 9; i++) o += R(-160, -170 + i * 36, 320 - (i % 3) * 60, 12, 6, '#B8B4A8');
    if (damga > 0) o += `<g transform="translate(20 120) rotate(-16) scale(${2 - damga})" opacity="${damga}"><rect x="-150" y="-52" width="300" height="104" rx="14" fill="none" stroke="#C8232F" stroke-width="12"/>` + yaz('İDDİA', 0, 30, 84, '#C8232F') + '</g>';
    return o + '</g>'; }
  const sorular = (t, adet = 6) => { let o = ''; for (let i = 0; i < adet; i++) { const x = 140 + h(i + 20) * 800, y0 = 900 - h(i + 31) * 300, y = y0 - ((t * 30 + i * 50) % 180); o += yaz('?', x, y, 70 + h(i + 5) * 60, '#FFFFFF', 900, 'middle', `opacity="${.16 + .12 * h(i + 11)}"`); } return o; };
  return { R, mono, yaz, cipO, salon, koltuk, makara, klaket, misir, misirYagmur, konfeti, alinti, portakal, kitap, telefon, tv, maymun, senaryo, sorular, KIRMIZI, ALTIN, PERDE };
})();
const NBD = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#08040C', g = .5) => `<defs><radialGradient id="nbv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#nbv)"/>`;
  const zemin = (renk = '#17101E') => `<rect width="1080" height="1920" fill="${renk}"/>` + bul(`<circle cx="540" cy="860" r="460" fill="#FFB45C" opacity=".18"/>`, 40);
  // ödül heykeli yakın
  function odul(d) { return zemin('#1A1220') + NB.portakal(540, 1260, 2.1, 1 + .1 * Math.sin(d * 5)) + NB.konfeti(d, .3, 28, 540, 560) + NB.cipO('ALTIN PORTAKAL · 2006', 540, 420, '#1B1640', '#FFE45C', 38) + vin(); }
  // kitap yakın
  function kitap(d) { const a = ar(d, .6, 1.8); return zemin('#10202E') + NB.kitap(540, 960, 2.2, a, -4 + 4 * a) + NB.cipO('2023 · GÜNLÜK NOTLAR', 540, 420, '#1B1640', '#FFE45C', 38) + vin(); }
  // TV yakın: program başlığı + boş sandalye (kişi yok) + alıntı kartları
  function tvDetay(d) { let o = zemin('#141820');
    const ic = `<rect width="434" height="372" fill="#1E2A44"/><rect y="290" width="434" height="82" fill="#C8232F"/><text x="20" y="342" font-size="34" font-weight="900" style="fill:#FFF">TV PROGRAMI · 26 ARALIK 2023</text><circle cx="217" cy="150" r="56" fill="#0A0E1A"/><path d="M130 280 Q217 210 304 280Z" fill="#0A0E1A"/>`;
    o += NB.tv(540, 800, 1.45, ic) + NB.cipO('İLK KEZ KONUŞTU', 540, 420, '#1B1640', '#FFE45C', 40);
    return o + vin('#000', .45); }
  // telefon yakın: X kartı, yazı daktilo
  function xKart(d, metin, kimlik = 'N. B. CEYLAN · X') { const n = Math.floor(metin.length * ar(d, .5, 2.4));
    const satir = (s, i) => `<text x="36" y="${300 + i * 46}" font-size="34" font-weight="800" style="fill:#FFFFFF">${s}</text>`;
    const parca = []; let cur = ''; for (const w of metin.slice(0, n).split(' ')) { if ((cur + ' ' + w).length > 17) { parca.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } parca.push(cur);
    const ic = `<rect width="400" height="760" fill="#0B0F1A"/><circle cx="64" cy="130" r="36" fill="#2A3A5A"/>` + `<text x="116" y="124" font-size="30" font-weight="900" style="fill:#FFF">${kimlik}</text><text x="116" y="160" font-size="24" font-weight="600" style="fill:#7A8AA8">şimdi</text>` + parca.map(satir).join('') + `<text x="36" y="${300 + parca.length * 46 + 6}" font-size="36" style="fill:#FFFFFF" opacity="${Math.sin(d * 14) > 0 ? 1 : 0}">|</text>` + `<g transform="translate(200 640)"><rect x="-150" y="-40" width="300" height="80" rx="40" fill="#1D9BF0"/><text y="14" font-size="38" font-weight="900" text-anchor="middle" style="fill:#FFF">Gönder</text></g>`;
    return zemin('#101624') + NB.telefon(540, 790, 1.15, ic) + vin('#000', .4); }
  // üç maymun + İZLEMEDİM damgası
  function maymun(d) { const a = ar(d, 1.0, 1.4); let o = zemin('#241A14') + NB.maymun(540, 760, 1.15, 'goz');
    o += `<g transform="translate(540 1050) rotate(-8) scale(${1.8 - .8 * FX.E.outExpo(a)})" opacity="${a}"><rect x="-340" y="-70" width="680" height="140" rx="18" fill="none" stroke="#C8232F" stroke-width="14"/>` + NB.yaz('HİÇ İZLEMEDİM', 0, 34, 84, '#C8232F') + '</g>' + NB.cipO('ÜÇ MAYMUN', 540, 420, '#1B1640', '#FFE45C', 40);
    return o + vin('#000', .4); }
  // senaryo + İDDİA
  function senaryo(d) { const a = ar(d, 1.2, 1.9); let o = zemin('#1A1420') + NB.senaryo(540, 800, 1.9, -3, FX.E.outExpo(a)) + NB.cipO('SENARYO ÇALINDI MI?', 540, 410, '#1B1640', '#FFE45C', 38) + NB.sorular(d, 6);
    return o + vin('#000', .45); }
  return { odul, kitap, tvDetay, xKart, maymun, senaryo };
})();
