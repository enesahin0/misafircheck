/* #24 Fırlayan kitapçık (2001 krizi) — KK: salon, kitapçık, borsa, banka, faiz, para yığını, döviz bürosu, TV, terazi, belirsizlik.
   KKD: detay planlar (kitapçık düşüşü, gazete manşeti, para yığını, döviz tabelası).
   KURAL: gerçek kişiler çizilmez/karikatürize edilmez → toplantı sahnesi yalnızca arkadan siluetler (yüz yok). */
const KK = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const mono = (s, x, y, fs, renk, ek = '') => `<text class="mono" x="${x}" y="${y}" font-size="${fs}" style="fill:${renk}" ${ek}>${s}</text>`;
  const yaz = (s, x, y, fs, renk, w = 900, anc = 'middle', ek = '') => `<text x="${x}" y="${y}" font-size="${fs}" font-weight="${w}" text-anchor="${anc}" style="fill:${renk}" ${ek}>${s}</text>`;
  const cipO = (s, x, y, renk, yazi, fs = 30) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  const KIRMIZI = '#E8323C', ALTIN = '#F2C14E', YESIL = '#3AC878', LAC = '#0E1830';
  // ---------- kitapçık (Anayasa) ----------
  function kitapcik(x, y, s = 1, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-56, -80, 124, 172, 8, '#000', .22) + R(-62, -86, 124, 172, 8, '#6A1020') + R(-62, -86, 14, 172, 6, '#4A0A16') + R(-48, -72, 104, 144, 4, '#8E1B2F') + R(-30, -44, 60, 4, 2, '#E8C060') + R(-30, -30, 60, 4, 2, '#E8C060') + yaz('ANAYASA', 4, 6, 19, '#F2D88A', 800) + R(-30, 22, 60, 4, 2, '#E8C060') + R(-18, 36, 36, 22, 4, '#E8C060', .9) + '</g>'; }
  // ---------- salon (MGK toplantı salonu: SADECE siluet) ----------
  const sil = (x, y, s, ton = '#0A0710', yon = 1) => `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})"><ellipse cx="0" cy="0" rx="92" ry="62" fill="${ton}"/><circle cx="0" cy="-84" r="44" fill="${ton}"/><rect x="-18" y="-60" width="36" height="24" fill="${ton}"/></g>`;
  function salon(t, { gerilim = 0, sol = true } = {}) {
    let o = `<defs><linearGradient id="slg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1218"/><stop offset="1" stop-color="#2A1A1A"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#slg)"/>`;
    for (let i = 0; i < 6; i++) o += R(i * 190 - 20, 240, 170, 780, 6, i % 2 ? '#3A2418' : '#33201A') + R(i * 190, 270, 130, 300, 4, '#000', .15) + R(i * 190, 610, 130, 360, 4, '#000', .15);
    o += R(0, 232, 1080, 14, 0, '#6A4A30') + R(0, 1010, 1080, 18, 0, '#5A3A24');
    // perdeler
    o += `<path d="M60 240 Q90 600 70 1000 L180 1000 Q150 600 190 240Z" fill="#5A1A24" opacity=".8"/><path d="M890 240 Q930 600 900 1000 L1010 1000 Q990 600 1020 240Z" fill="#5A1A24" opacity=".8"/>`;
    // avize
    o += `<g transform="translate(540 120)"><path d="M0 -120 L0 0" stroke="#6A5A40" stroke-width="6"/><ellipse cx="0" cy="40" rx="160" ry="38" fill="#C8A040" opacity=".85"/>` + [-110, -55, 0, 55, 110].map(x => `<circle cx="${x}" cy="10" r="14" fill="#FFF3C0"/>`).join('') + `<ellipse cx="0" cy="60" rx="320" ry="120" fill="#FFE8A0" opacity="${.07 + .02 * Math.sin(t * 2)}"/></g>`;
    // masa (perspektif)
    o += `<path d="M300 1040 L780 1040 L1060 1560 L20 1560Z" fill="#5A3A24"/><path d="M300 1040 L780 1040 L790 1060 L290 1060Z" fill="#7A5236"/><path d="M20 1560 L1060 1560 L1060 1600 L20 1600Z" fill="#3A2416"/>`;
    for (let i = 0; i < 9; i++) { const k = i / 8, xx = 330 + (i % 3) * 140 + (i > 5 ? 20 : 0), yy = 1100 + Math.floor(i / 3) * 110; o += `<rect x="${xx}" y="${yy}" width="${70 + yy * .02}" height="${46 + yy * .015}" rx="3" fill="#F2EEE2" opacity=".85" transform="rotate(${(h(i) - .5) * 12} ${xx} ${yy})"/>`; }
    // karşı uçta iki siluet (yüzü bize; yüz çizilmez), kenarlarda arkadan
    o += sil(430, 1010, .55, '#120C14') + sil(650, 1010, .55, '#120C14');
    for (let i = 0; i < 3; i++) { const yy = 1150 + i * 150, s = .55 + i * .28; o += sil(250 - i * 70, yy + 20, s, '#0A0710') + sil(830 + i * 70, yy + 20, s, '#0A0710'); }
    if (gerilim > 0) { o += `<rect width="1080" height="1920" fill="#E8323C" opacity="${.12 * gerilim * (.7 + .3 * Math.sin(t * 7))}"/>`;
      for (let k = 0; k < 4; k++) { const x0 = 330 + k * 30, ph = Math.sin(t * 9 + k * 2); o += `<path d="M${x0} ${1120 + k * 40} l40 ${-24 + ph * 8} l-30 20 l44 ${-18 + ph * 8}" stroke="#FF6A6A" stroke-width="7" fill="none" stroke-linecap="round" opacity="${gerilim * .8}"/>`; } }
    return o; }
  // büyük kapılar (kapanma: p 0 açık → 1 kapalı)
  function kapilar(p) { const w = 540 * p; return R(0, 0, w, 1920, 0, '#3A2214') + R(1080 - w, 0, w, 1920, 0, '#3A2214') + [0, 1].map(k => { const x = k ? 1080 - w : 0; return R(x + 30, 200, Math.max(0, w - 60), 1500, 12, '#4A2E1C', p > .02 ? 1 : 0) + R(x + 60, 260, Math.max(0, w - 120), 560, 8, '#000', .15 * (p > .05 ? 1 : 0)) + R(x + 60, 880, Math.max(0, w - 120), 700, 8, '#000', .15 * (p > .05 ? 1 : 0)); }).join('') + (p > .95 ? `<circle cx="505" cy="960" r="18" fill="#C8A040"/><circle cx="575" cy="960" r="18" fill="#C8A040"/>` : '') + R(w - 6, 0, 6, 1920, 0, '#000', .4 * (p > .02 ? 1 : 0)); }
  // ---------- banka ----------
  function banka(x, y, s = 1, gece = 0) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-250, -26, 500, 26, 0, '#B8B0A0') + R(-230, -52, 460, 26, 0, '#C8C0B0') + [0, 1, 2, 3, 4].map(i => R(-190 + i * 96, -300, 44, 248, 10, '#E8E0D0') + R(-186 + i * 96, -300, 12, 248, 6, '#FFFFFF', .5)).join('') + R(-250, -330, 500, 30, 0, '#C8C0AC') + `<path d="M-250 -330 L0 -430 L250 -330Z" fill="#D8D0BC"/>` + yaz('BANKA', 0, -342, 22, '#6A5A40', 800) + R(-30, -140, 60, 88, 6, gece ? '#FFC45C' : '#3A2A20') + (gece ? `<circle cx="0" cy="-100" r="80" fill="#FFC45C" opacity=".18"/>` : '') + '</g>'; }
  // ---------- borsa panosu ----------
  function borsa(t, q, { x = 540, y = 620, w = 900, hh = 520 } = {}) {
    let o = `<g transform="translate(${x - w / 2} ${y - hh / 2})">` + R(-14, -14, w + 28, hh + 28, 26, '#05080F') + R(0, 0, w, hh, 16, '#0A1A22');
    for (let i = 1; i < 6; i++) o += R(0, i * hh / 6, w, 2, 0, '#1E3A44', .8);
    for (let i = 1; i < 8; i++) o += R(i * w / 8, 0, 2, hh, 0, '#1E3A44', .6);
    o += mono('İMKB · ULUSAL 100', 28, 44, 28, '#9FE0C8');
    const N = 22, nk = Math.floor(N * q); let d = '', alan = '';
    for (let i = 0; i <= nk; i++) { const u = i / N, px = 40 + u * (w - 80), py = hh * .2 + hh * .62 * Math.pow(u, 1.25) + (h(i * 3 + 1) - .5) * hh * .06 * (i > 2 ? 1 : 0); d += (i ? 'L' : 'M') + px + ' ' + py; if (i === nk) alan = `${d}L${px} ${hh - 24} L40 ${hh - 24}Z`; }
    if (nk >= 1) { o += `<path d="${alan}" fill="${KIRMIZI}" opacity=".18"/><path d="${d}" stroke="${KIRMIZI}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; const lp = d.split('L').pop().split(' '); o += `<circle cx="${lp[0]}" cy="${lp[1]}" r="${12 + 3 * Math.sin(t * 9)}" fill="#FFFFFF"/>`; }
    const e = ar(q, .6, .95); if (e > 0) o += `<g transform="translate(${w - 150} ${hh - 120}) scale(${e})">` + R(-140, -52, 280, 104, 26, KIRMIZI) + yaz('−%14,6', 0, 24, 66, '#FFFFFF') + '</g>';
    return o + '</g>'; }
  // dövizin ülkeden çıkışı: bankadan sağa uçan banknotlar
  function cikis(t, p, { x = 300, y = 1190 } = {}) { let o = banka(x, y, .95);
    for (let i = 0; i < 9; i++) { const u = cl(p * 1.5 - i * .1); if (u <= 0 || u >= 1) continue; const px = x + 80 + u * 840, py = y - 150 - Math.sin(u * Math.PI) * 220 - i * 8, rot = 20 + u * 400 * (i % 2 ? 1 : -1) * .4;
      o += `<g transform="translate(${px} ${py}) rotate(${rot})" opacity="${1 - ar(u, .85, 1)}">` + R(-44, -24, 88, 48, 6, '#5AA86A') + R(-40, -20, 80, 40, 4, '#7ACB8A') + yaz('$', 0, 11, 34, '#2A6A3A') + '</g>'; }
    return o; }
  // ---------- gece gökyüzü ----------
  function gece(t, p) { let o = `<defs><linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1030"/><stop offset=".7" stop-color="#1E2A5A"/><stop offset="1" stop-color="#3A3A6A"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#kg)"/>`;
    for (let i = 0; i < 46; i++) o += `<circle cx="${h(i) * 1080}" cy="${h(i + 40) * 900}" r="${1.4 + h(i + 9) * 2.4}" fill="#FFF3D6" opacity="${.5 + .4 * Math.sin(t * 2 + i)}"/>`;
    const ax = 130 + p * 820, ay = 760 - Math.sin(p * Math.PI) * 330;
    o += `<circle cx="${ax}" cy="${ay}" r="170" fill="#FFF3C0" opacity=".08"/><circle cx="${ax}" cy="${ay}" r="92" fill="#FFF3C0"/><circle cx="${ax + 30}" cy="${ay - 12}" r="84" fill="#0E1840" opacity=".92"/>`;
    return o; }
  // ---------- faiz çubukları (doğrusal ölçek: 760 → 57 px, 7500 → 560 px) ----------
  function faiz(t, a, b, { y0 = 1160 } = {}) { let o = '';
    o += R(110, y0, 860, 6, 3, '#9FB4D8');
    const h1 = 560 * 760 / 7500 * cl(a), h2 = 560 * cl(b);
    o += R(200, y0 - h1, 230, h1, 14, '#FFB44C') + R(200, y0 - h1, 230, Math.min(18, h1), 9, '#FFFFFF', .3);
    if (a > .1) o += yaz('%' + Math.round(760 * cl(a)), 315, y0 - h1 - 30, 66, '#FFFFFF') + mono('ÖNCE', 315 - K.yaziGen('ÖNCE', 30, { mono: true }) / 2, y0 + 56, 30, '#FFFFFF');
    o += R(560, y0 - h2, 230, h2, 14, KIRMIZI) + R(560, y0 - h2, 230, Math.min(18, h2), 9, '#FFFFFF', .25);
    if (b > .02) o += yaz('%' + Math.round(760 + (7500 - 760) * cl(b)), 675, y0 - h2 - 30, 80, '#FFFFFF') + mono('SONRA', 675 - K.yaziGen('SONRA', 30, { mono: true }) / 2, y0 + 56, 30, '#FFFFFF');
    return o; }
  // ---------- para yığını (her 10 TL = 1 disk) ----------
  function yigin(x, y, n, { yeni = 0, k = 1 } = {}) { let o = `<ellipse cx="${x}" cy="${y + 12}" rx="${90 * k}" ry="${22 * k}" fill="#000" opacity=".2"/>`;
    for (let i = 0; i < n; i++) { const ek = i >= n - yeni, c = ek ? '#3AC878' : '#C8962A', c2 = ek ? '#7AE8A8' : '#F2C14E', yy = y - i * 24 * k; o += R(x - 80 * k, yy - 18 * k, 160 * k, 26 * k, 12 * k, c) + `<ellipse cx="${x}" cy="${yy - 18 * k}" rx="${80 * k}" ry="${16 * k}" fill="${c2}"/>`; }
    return o; }
  // ---------- döviz tabelası (LED) ----------
  function led(x, y, w, hh, deger, { baslik = 'DOLAR ALIŞ', vurgu = '#FFB020' } = {}) { const fs = hh * .38, fz = Math.min(fs * 1.35, (w - 70) / (deger.length * .66));
    return R(x - w / 2 - 14, y - hh / 2 - 14, w + 28, hh + 28, 20, '#1B1B22') + R(x - w / 2, y - hh / 2, w, hh, 12, '#0A0A0E') + mono(baslik, x - w / 2 + 28, y - hh / 2 + hh * .24, hh * .13, '#9A7A30', 'letter-spacing="3"') +
      `<text class="mono" x="${x + w / 2 - 28}" y="${y + hh * .2}" font-size="${fz}" text-anchor="end" style="fill:${vurgu}" letter-spacing="2">${deger}</text>` +
      `<text class="mono" x="${x + w / 2 - 28}" y="${y + hh * .2}" font-size="${fz}" text-anchor="end" style="fill:${vurgu}" opacity=".18" letter-spacing="2">${deger.replace(/\d/g, '8')}</text>`; }
  const para = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // sokak + döviz bürosu
  function buro(t, v) { let o = `<defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8C4D0"/><stop offset="1" stop-color="#E0D8C8"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#bg2)"/>`;
    o += R(0, 340, 1080, 1020, 0, '#D8C8A8') + [0, 1, 2, 3, 4, 5].map(i => R(0, 340 + i * 170, 1080, 4, 0, '#B8A888', .5)).join('');
    o += R(120, 400, 840, 130, 20, '#1B3A6A') + yaz('DÖVİZ', 540, 495, 90, '#FFFFFF') + yaz('★', 190, 485, 60, '#FFD23F') + yaz('★', 890, 485, 60, '#FFD23F');
    o += R(120, 580, 840, 560, 18, '#5A6A7A') + R(150, 610, 780, 500, 10, '#9FC0D8') + R(150, 610, 780, 500, 10, '#FFFFFF', .12);
    o += led(540, 820, 700, 250, para(v));
    o += `<path d="M0 1360 L1080 1360 L1080 1920 L0 1920Z" fill="#8A8478"/>` + R(0, 1350, 1080, 22, 0, '#A8A296') + [0, 1, 2, 3].map(i => R(i * 300 + 30, 1560, 160, 12, 6, '#FFFFFF', .3)).join('');
    return o; }
  // ---------- TV (tüplü, 2001) ----------
  function tv(t, { flas = 1 } = {}) { let o = `<defs><linearGradient id="tvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A3A5A"/><stop offset="1" stop-color="#16203A"/></linearGradient></defs>`;
    o += R(150, 340, 780, 640, 56, '#2A2A30') + R(150, 340, 780, 24, 24, '#4A4A52') + R(190, 380, 700, 540, 40, '#0A0A10') + R(200, 390, 680, 520, 34, 'url(#tvg)');
    // ekran içeriği: mikrofon demeti + siluet
    o += `<g><ellipse cx="660" cy="760" rx="150" ry="120" fill="#0A0A14"/><circle cx="660" cy="590" r="76" fill="#0A0A14"/><rect x="610" y="640" width="100" height="60" fill="#0A0A14"/>`;
    for (let i = 0; i < 3; i++) o += `<g transform="translate(${420 + i * 20} ${620 + i * 60}) rotate(${-8 + i * 8})"><rect x="0" y="-9" width="130" height="18" rx="9" fill="#1B1B22"/><circle cx="-6" cy="0" r="26" fill="#5A607E"/></g>`;
    o += '</g>';
    const f = Math.abs(Math.sin(t * 13)) > .93 ? flas : 0; if (f) o += R(200, 390, 680, 520, 34, '#FFFFFF', .35);
    o += R(200, 390, 680, 520, 34, '#FFFFFF', .035) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(i => R(200, 400 + i * 26, 680, 2, 0, '#000', .12)).join('');
    o += R(240, 880, 600, 20, 6, KIRMIZI) + R(470, 980, 140, 36, 6, '#1B1B22') + R(380, 1010, 320, 26, 10, '#3A3A42') + `<circle cx="880" cy="640" r="14" fill="#6A6A72"/><circle cx="880" cy="700" r="14" fill="#6A6A72"/>`;
    return o; }
  // ---------- terazi: kitapçık ↔ tek cümle ----------
  function terazi(t, p) { const ang = 16 * FX.E.outExpo(cl(p)), rad = ang * Math.PI / 180, L = 330;
    const lx = 540 - Math.cos(rad) * L, rx = 540 + Math.cos(rad) * L;
    const yl = 700 - Math.sin(rad) * L, yr = 700 + Math.sin(rad) * L;      // sağ ucu aşağı
    let o = R(520, 700, 40, 760, 10, '#6A5A48') + R(380, 1440, 320, 40, 14, '#4A3A2C') + `<circle cx="540" cy="700" r="30" fill="#C8A040"/>`;
    o += `<path d="M${lx} ${yl} L${rx} ${yr}" stroke="#8A7A60" stroke-width="22" stroke-linecap="round"/>`;
    const plate = (x, y) => `<path d="M${x - 130} ${y + 280} L${x + 130} ${y + 280}" stroke="#8A7A60" stroke-width="8"/><path d="M${x} ${y} L${x - 130} ${y + 280} M${x} ${y} L${x + 130} ${y + 280}" stroke="#8A7A60" stroke-width="6"/><path d="M${x - 150} ${y + 280} Q${x} ${y + 360} ${x + 150} ${y + 280}Z" fill="#C8A040"/>`;
    o += plate(lx, yl) + plate(rx, yr);
    o += kitapcik(lx, yl + 200, .62, -6);
    const bw = 300, bx = rx, by = yr + 150;       // ağır tarafta büyük söz balonu
    o += `<g transform="translate(${bx} ${by})"><path d="M-150 -90 Q-150 -120 -120 -120 L120 -120 Q150 -120 150 -90 L150 60 Q150 90 120 90 L40 90 L-10 140 L0 90 L-120 90 Q-150 90 -150 60Z" fill="#FFF3D6"/>` + yaz('“…ciddi bir', 0, -30, 40, '#1B1640', 900) + yaz('kriz var.”', 0, 22, 40, '#1B1640', 900) + '</g>';
    return o; }
  // ---------- belirsizlik: sis + soru işaretleri ----------
  function sis(t) { let o = `<defs><radialGradient id="ssg" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#2A2A44"/><stop offset="1" stop-color="#0A0A14"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#ssg)"/>`;
    for (let i = 0; i < 9; i++) { const q = (t * .06 + i / 9) % 1; o += `<ellipse cx="${(h(i + 7) * 1500 - 200 + q * 300) % 1300 - 100}" cy="${700 + h(i) * 700}" rx="${240 + h(i + 2) * 160}" ry="${60 + h(i + 5) * 40}" fill="#8A8AAA" opacity="${.07 + .05 * Math.sin(t + i)}"/>`; }
    for (let i = 0; i < 9; i++) { const x = 100 + h(i + 20) * 880, y0 = 460 + h(i + 31) * 700, y = y0 - ((t * 24 + i * 40) % 160); o += yaz('?', x, y, 70 + h(i + 5) * 70, '#FFFFFF', 900, 'middle', `opacity="${.14 + .1 * h(i + 11)}"`); }
    return o; }
  return { kitapcik, salon, kapilar, banka, borsa, cikis, gece, faiz, yigin, led, para, buro, tv, terazi, sis, cipO, yaz, mono, sil, KIRMIZI, ALTIN, YESIL };
})();
const KKD = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#05060A', g = .5) => `<defs><radialGradient id="kkv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#kkv)"/>`;
  // kitapçık masaya düşer, kâğıtlar savrulur
  function dusus(d) { let o = R(0, 0, 1080, 1920, 0, '#3A2416');
    for (let i = 0; i < 12; i++) o += `<path d="M0 ${i * 170 + 40} Q540 ${i * 170 + 20 + h(i) * 50} 1080 ${i * 170 + 50}" stroke="#2A180E" stroke-width="${6 + h(i + 3) * 8}" fill="none" opacity=".5"/>`;
    o = bul(o, 3);
    o += `<ellipse cx="540" cy="1120" rx="360" ry="60" fill="#000" opacity=".25"/>`;
    const u = FX.E.outExpo(ar(d, 0, .35)), kx = 1020 - 480 * u, ky = 380 + 700 * u * u, kr = 620 - 600 * u;     // sağ üstten düşer
    for (let i = 0; i < 7; i++) { const q = ar(d, .3, 1.4), px = 540 + (h(i) - .5) * 900 * q, py = 1000 - 260 * Math.sin(q * Math.PI) * (.6 + h(i + 4)) + 100 * q, pr = (h(i + 9) - .5) * 360 * q;
      o += `<g transform="translate(${px} ${py}) rotate(${pr})" opacity="${.95 - .3 * q}">` + R(-80, -56, 160, 112, 4, '#F2EEE2') + R(-60, -30, 110, 8, 4, '#B8B4A8') + R(-60, -10, 90, 8, 4, '#B8B4A8') + '</g>'; }
    o += KK.kitapcik(kx, ky, 2.6, kr + (d > .3 ? Math.sin(d * 18) * 3 * Math.exp(-(d - .3) * 4) : 0));
    if (d > .33 && d < .7) o += `<circle cx="540" cy="1100" r="${(d - .33) * 900}" fill="none" stroke="#FFFFFF" stroke-width="10" opacity="${1 - ar(d, .33, .7)}"/>`;
    return o + vin('#000', .6); }
  // gazete manşeti
  function manset(d) { let o = R(0, 0, 1080, 1920, 0, '#4A3426') + bul(`<circle cx="860" cy="320" r="260" fill="#FFB45C" opacity=".35"/>`, 30);
    const a = ar(d, .2, .7);
    o += `<g transform="rotate(-2 540 960)">` + R(100, 340, 880, 1220, 6, '#E8DEC6') + R(100, 340, 880, 100, 6, '#1B1B1B') + KK.yaz('GÜNLÜK HABER', 540, 408, 56, '#E8DEC6', 800) + KK.mono('20 ŞUBAT 2001', 160, 480, 28, '#4A4034', 'letter-spacing="3"') + R(100, 500, 880, 6, 0, '#1B1B1B');
    o += `<text x="540" y="650" font-size="86" font-weight="900" text-anchor="middle" style="fill:#1B1B1B" opacity="${a}">DEVLET</text><text x="540" y="740" font-size="86" font-weight="900" text-anchor="middle" style="fill:#1B1B1B" opacity="${a}">YÖNETİMİNDE</text><text x="540" y="830" font-size="86" font-weight="900" text-anchor="middle" style="fill:#B8232F" opacity="${a}">CİDDİ BİR KRİZ VAR</text>`;
    o += R(150, 900, 380, 300, 6, '#B8B4A8') + `<ellipse cx="340" cy="1110" rx="120" ry="80" fill="#7A766C"/><circle cx="340" cy="1000" r="56" fill="#7A766C"/>`;     // fotoğraf: yüzsüz siluet
    for (let i = 0; i < 9; i++) o += R(570, 910 + i * 36, 360, 12, 6, '#A8A498');
    for (let i = 0; i < 7; i++) o += R(150, 1240 + i * 36, 780, 12, 6, '#A8A498');
    return o + '</g>' + vin('#1A0A04', .5); }
  // iki para yığını yan yana: akşam 10 disk (100 TL) → sabah 12 disk (120 TL)
  function yiginlar(d) { let o = R(0, 0, 1080, 1920, 0, '#1B2A3A') + bul(`<circle cx="540" cy="900" r="420" fill="#4A8AD8" opacity=".18"/>`, 30);
    const a = FX.E.outExpo(ar(d, 0, .6)), b = ar(d, .6, 1.2);
    o += `<g opacity="${a}">` + KK.yigin(300, 1250, 10, { k: 1.25 }) + KK.yaz('100 TL', 300, 1330, 64, '#FFFFFF') + KK.cipO('AKŞAM', 300, 410, '#1E2A5A', '#FFE45C', 30) + '</g>';
    if (b > 0) o += `<g opacity="${b}">` + KK.yigin(780, 1250, 12, { yeni: 2, k: 1.25 }) + KK.yaz('120 TL', 780, 1330, 64, '#FFFFFF') + KK.cipO('SABAH', 780, 410, '#B8782A', '#FFFFFF', 30) + '</g>';
    const c = ar(d, 1.5, 1.9); if (c > 0) o += `<g transform="translate(540 700) scale(${c})">` + R(-210, -70, 420, 140, 70, '#1B1640') + KK.yaz('+%20', 0, 28, 100, '#7AE8A8') + '</g>';
    return o + vin('#000', .35); }
  // döviz tabelası yakın plan: 685.000 → 940.000
  function tabela(d, v0 = 685000, v1 = 940000, t0 = 2.0, t1 = 3.0) { let o = R(0, 0, 1080, 1920, 0, '#141418') + bul(`<circle cx="540" cy="900" r="460" fill="#FFB020" opacity=".12"/>`, 40);
    const q = FX.E.inOutQuart(ar(d, t0, t1)), v = Math.round(v0 + (v1 - v0) * q);
    o += KK.led(540, 860, 960, 470, KK.para(v), { vurgu: q > .98 ? '#FF5A3A' : '#FFB020' });
    o += KK.cipO('1 DOLAR · ESKİ TL', 540, 460, '#2A2A34', '#FFB020', 30);
    const a = ar(d, t1 + .1, t1 + .5); if (a > 0) o += `<g transform="translate(540 1230) scale(${a})">` + R(-250, -60, 500, 120, 60, KK.KIRMIZI) + KK.yaz('BİR GECEDE', 0, 22, 66, '#FFFFFF') + '</g>';
    return o + vin('#000', .5); }
  return { dusus, manset, yiginlar, tabela };
})();
