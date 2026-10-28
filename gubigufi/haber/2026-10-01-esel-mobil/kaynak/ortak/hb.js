/* GubiGufi HABER — stüdyo, TV ekranı katmanı (canlı, alt bant, kayan şerit, saat), jenerik, parazit geçişi,
   akaryakıt istasyonu (saha), haber grafikleri (ÖTV yastığı, vergi merdiveni, pompa ekranı, LPG etiketi, Resmî Gazete). */
const HB = (() => {
  const R = PR.R, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const KR = '#E8323C', LAC = '#0B1E3A', LAC2 = '#13305A', AK = '#FFFFFF';
  const mono = (s, x, y, fs, renk, ek = '') => `<text class="mono" x="${x}" y="${y}" font-size="${fs}" style="fill:${renk}" ${ek}>${s}</text>`;
  const yaz = (s, x, y, fs, renk, w = 900, anc = 'middle', ek = '') => `<text x="${x}" y="${y}" font-size="${fs}" font-weight="${w}" text-anchor="${anc}" style="fill:${renk}" ${ek}>${s}</text>`;
  const gen = (s, fs, o) => K.yaziGen(s, fs, o);
  // ---------- logo / jenerik ----------
  function logo(x, y, s = 1) { const w1 = gen('GUBİGUFİ', 64) + 40, w2 = gen('HABER', 64) + 40;
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-(w1 + w2) / 2, -50, w1, 100, 0, AK) + yaz('GUBİGUFİ', -(w1 + w2) / 2 + w1 / 2, 23, 64, LAC) + R(-(w1 + w2) / 2 + w1, -50, w2, 100, 0, KR) + yaz('HABER', -(w1 + w2) / 2 + w1 + w2 / 2, 23, 64, AK) + '</g>'; }
  function kure(x, y, r, t, op = 1) { let o = `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#4A8AD8" stroke-width="6" opacity=".7"/>`;
    for (let i = 0; i < 6; i++) { const ph = (t * .6 + i / 6) % 1, rx = Math.abs(Math.cos(ph * Math.PI)) * r; o += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r}" fill="none" stroke="#4A8AD8" stroke-width="4" opacity=".45"/>`; }
    for (let i = 1; i < 4; i++) { const yy = y - r + i * r / 2, rr = Math.sqrt(r * r - (yy - y) ** 2); o += `<ellipse cx="${x}" cy="${yy}" rx="${rr}" ry="${rr * .12}" fill="none" stroke="#4A8AD8" stroke-width="4" opacity=".45"/>`; }
    return o + '</g>'; }
  function jenerik(t) { let o = `<defs><radialGradient id="jg" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="${LAC2}"/><stop offset="1" stop-color="#050C1C"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#jg)"/>`;
    for (let i = 0; i < 7; i++) { const q = (t * .9 + i / 7) % 1; o += `<path d="M${-400 + q * 1900} ${300 + i * 210} l500 -120 l30 0 l-500 120Z" fill="#4A8AD8" opacity="${.18 * Math.sin(q * Math.PI)}"/>`; }
    const k = FX.E.outExpo(ar(t, 0, .9)); o += `<g transform="translate(540 760) scale(${.4 + .6 * k}) rotate(${(1 - k) * -40})">` + kure(0, 0, 250, t) + '</g>';
    const l = FX.E.outExpo(ar(t, .5, 1.1)); if (l > 0) o += `<g opacity="${l}">` + logo(540 + (1 - l) * 300, 1120, 1.2) + '</g>';
    const r = ar(t, .8, 1.4); if (r > 0) o += R(540 - 400 * r, 1205, 800 * r, 8, 4, KR);
    return o; }
  // ---------- stüdyo ----------
  // duvar: dev ekran (x,y,w,h) — içine 'ic' çizilir
  const DUVAR = [130, 330, 820, 470];
  function studyo(t, ic = '', { duvarIsik = 1 } = {}) {
    let o = `<defs><linearGradient id="stg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#081630"/><stop offset=".6" stop-color="${LAC2}"/><stop offset="1" stop-color="#0A1A34"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#stg)"/>`;
    for (let i = 0; i < 9; i++) o += R(i * 130 - 20, 0, 6, 1920, 3, '#2A5A9A', .25);
    for (let i = 0; i < 5; i++) { const x = 60 + i * 240; o += `<path d="M${x} 0 L${x + 60} 0 L${x + 220} 1100 L${x + 100} 1100Z" fill="#4A8AD8" opacity=".05"/>`; }
    const [x, y, w, hh] = DUVAR;
    o += R(x - 18, y - 18, w + 36, hh + 36, 26, '#050C1C') + R(x - 18, y - 18, w + 36, hh + 36, 26, 'none') + `<rect x="${x - 18}" y="${y - 18}" width="${w + 36}" height="${hh + 36}" rx="26" fill="none" stroke="#4A8AD8" stroke-width="4" opacity=".6"/>`;
    o += `<svg x="${x}" y="${y}" width="${w}" height="${hh}" viewBox="0 0 ${w} ${hh}" preserveAspectRatio="xMidYMid slice"><rect width="${w}" height="${hh}" fill="#0A2448"/>${ic}</svg>`;
    o += R(x, y, w, hh, 0, '#FFFFFF', .04 * duvarIsik);
    // zemin
    o += `<path d="M0 1180 L1080 1180 L1080 1920 L0 1920Z" fill="#0A1A34"/><ellipse cx="540" cy="1400" rx="620" ry="140" fill="#4A8AD8" opacity=".12"/>`;
    return o; }
  function masa(t) { // Gubi'nin önüne
    return `<path d="M120 1060 Q540 1010 960 1060 L930 1300 Q540 1260 150 1300Z" fill="#E8EEF8"/><path d="M120 1060 Q540 1010 960 1060 L955 1100 Q540 1050 125 1100Z" fill="#FFFFFF"/>` +
      `<path d="M150 1300 Q540 1260 930 1300 L930 1320 Q540 1280 150 1320Z" fill="#9AA8C0"/>` + `<rect x="160" y="1100" width="760" height="6" fill="${KR}" opacity=".8"/>`; }
  // ---------- TV ekranı katmanı ----------
  // canli: ● CANLI rozeti; alt: [başlık, üst etiket]; serit: kayan haber; saat
  function ekran(t, { canli = true, alt = null, altP = 1, serit = null, saat = '20:00', yer = null } = {}) { let o = '';
    if (canli) { const nf = .55 + .45 * Math.abs(Math.sin(t * 3)); o += R(62, 336, 250, 44, 8, '#0B1433', .7) + `<circle cx="88" cy="358" r="9" fill="${KR}" opacity="${nf}"/>` + mono('CANLI', 106, 368, 24, AK, 'letter-spacing="2"') + mono(saat, 210, 368, 24, '#9FC0E8'); }
    if (alt && altP > 0) { const [bas, ust] = alt, fs = Math.min(46, 900 / (bas.length * .6)), w = Math.min(980, gen(bas, fs) + 70), k = FX.E.outExpo(altP);
      o += `<g transform="translate(${50 + (1 - k) * -900} 0)">` + (ust ? R(0, 1060, gen(ust, 24, { mono: true, ls: 2 }) + 50, 40, 0, KR) + mono(ust, 24, 1089, 24, AK, 'letter-spacing="2"') : '') + R(0, 1100, w, 84, 0, AK) + R(0, 1100, 14, 84, 0, KR) + `<text x="40" y="${1142 + fs * .36}" font-size="${fs}" font-weight="900" style="fill:${LAC}">${bas}</text></g>`; }
    if (serit) { const tw = gen(serit, 26, { mono: true, ls: 2 }) + 120, off = (t * 140) % tw;
      o += R(0, 1196, 1080, 48, 0, LAC) + R(0, 1196, 150, 48, 0, KR) + mono('SON DAKİKA', 14, 1228, 22, AK, 'letter-spacing="1"');
      o += `<svg x="150" y="1196" width="930" height="48"><g transform="translate(${20 - off} 0)">${[0, 1, 2].map(k => mono(serit, k * tw, 32, 26, AK, 'letter-spacing="2"')).join('')}</g></svg>`; }
    if (yer) o += R(62, 392, gen(yer, 22, { mono: true, ls: 2 }) + 40, 38, 8, KR, .9) + mono(yer, 82, 418, 22, AK, 'letter-spacing="2"');
    return o; }
  // parazit / sinyal geçişi: t0 merkezli, d süre
  function parazit(t, t0, d = .5) { const q = 1 - Math.abs((t - t0) / (d / 2)); if (q <= 0) return ''; const f = Math.floor(t * 30);
    let o = `<rect width="1080" height="1920" fill="#000" opacity="${.35 * q}"/>`;
    for (let i = 0; i < 26; i++) { const y = h(f * 31 + i) * 1920, hh = 6 + h(f * 7 + i) * 60, g = Math.floor(120 + h(f + i * 3) * 135); o += `<rect x="${-40 + h(i + f) * 80}" y="${y}" width="1160" height="${hh}" fill="rgb(${g},${g},${g})" opacity="${.5 * q * h(i * 9 + f)}"/>`; }
    o += `<rect x="0" y="${h(f + 99) * 1800}" width="1080" height="14" fill="#FF3A6A" opacity="${.5 * q}"/><rect x="0" y="${h(f + 77) * 1800}" width="1080" height="10" fill="#3AE0FF" opacity="${.5 * q}"/>`;
    if (q > .85) o += `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${(q - .85) * 2}"/>`;
    return o; }
  // sinyal çubukları (bağlantı)
  const sinyal = (x, y, n = 4) => [0, 1, 2, 3].map(i => R(x + i * 14, y - 10 - i * 8, 10, 10 + i * 8, 2, i < n ? AK : '#FFFFFF', i < n ? 1 : .3)).join('');
  // ---------- SAHA: akaryakıt istasyonu (akşam, markasız) ----------
  function pompa(x, y, s, { lpg = false, ekr = '' } = {}) { const c = lpg ? '#2E8A4A' : '#E8EEF4', b = lpg ? '#1F6A36' : KR;
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-90, -420, 180, 420, 16, c) + R(-90, -420, 180, 60, 16, b) + yaz(lpg ? 'LPG' : 'BENZİN', 0, -378, 34, AK) + R(-66, -330, 132, 100, 10, '#0B1E1A') + (ekr || [0, 1].map(i => R(-54, -316 + i * 46, 108, 30, 4, '#3AE08A', .7)).join('')) + R(-110, -40, 220, 40, 8, '#6A7484') + `<path d="M90 -200 Q150 -200 150 -120 L150 -40" stroke="#1B1B1B" stroke-width="12" fill="none"/>` + R(70, -250, 50, 90, 10, '#2A2A30') + '</g>'; }
  function istasyon(t, { lpg = false } = {}) { let o = `<defs><linearGradient id="isg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2A5A"/><stop offset=".55" stop-color="#C86A6A"/><stop offset="1" stop-color="#F2A874"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#isg)"/>`;
    o += `<path d="M0 900 L120 860 L200 880 L320 820 L460 860 L600 800 L760 850 L900 810 L1080 860 L1080 1080 L0 1080Z" fill="#3A3050" opacity=".7"/>`;
    // kanopi
    o += R(-20, 520, 1120, 90, 10, '#E8EEF4') + R(-20, 600, 1120, 24, 0, KR) + [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${100 + i * 180}" cy="626" rx="50" ry="10" fill="#FFF8D0"/><path d="M${60 + i * 180} 630 L${140 + i * 180} 630 L${200 + i * 180} 1060 L${0 + i * 180} 1060Z" fill="#FFF8D0" opacity=".08"/>`).join('');
    o += R(200, 624, 40, 460, 6, '#C8D0DC') + R(840, 624, 40, 460, 6, '#C8D0DC');
    // fiyat panosu (markasız)
    o += `<g transform="translate(960 640)">` + R(-60, 0, 120, 30, 4, '#5A6070') + R(-110, -260, 220, 260, 14, '#1B1F2A') + mono('BENZİN', -90, -212, 24, AK) + mono('MOTORİN', -90, -142, 24, AK) + mono('LPG', -90, -72, 24, AK) + [0, 1, 2].map(i => R(30, -238 + i * 70, 60, 34, 4, '#3AE08A', .25 + .1 * Math.sin(t * 4 + i))).join('') + '</g>';
    o += R(0, 1080, 1080, 840, 0, '#4A4A58') + R(0, 1080, 1080, 14, 0, '#6A6A78') + [0, 1, 2, 3, 4].map(i => R(i * 240 + 30, 1480, 120, 14, 7, '#FFFFFF', .35)).join('');
    o += R(330, 1060, 420, 40, 10, '#8A8A98') + pompa(440, 1070, 1.0) + pompa(660, 1070, 1.0, { lpg });
    return o; }
  // Gufi muhabir: mikrofon (sağ el) + mikrofon küpü
  function mikrofon(x, y, boy) { const k = boy / 330, mx = x + boy * .4, my = y - boy * .18;   // mikrofon başı ağzın sağ yanında
    return `<g transform="translate(${mx} ${my}) rotate(-28) scale(${k})"><rect x="-9" y="10" width="18" height="110" rx="8" fill="#1B1B22"/><rect x="-26" y="-30" width="52" height="46" rx="6" fill="${KR}"/><text class="mono" x="0" y="0" font-size="20" text-anchor="middle" style="fill:#FFFFFF">GG</text><circle cx="0" cy="-52" r="28" fill="#5A607E"/><circle cx="0" cy="-52" r="28" fill="none" stroke="#2A2E40" stroke-width="3"/><path d="M-20 -60 L20 -60 M-24 -48 L24 -48" stroke="#2A2E40" stroke-width="3"/></g>` +
      `<circle cx="${mx + boy * .075}" cy="${my + boy * .135}" r="${boy * .11}" fill="#8E1B3F"/><circle cx="${mx + boy * .065}" cy="${my + boy * .125}" r="${boy * .11}" fill="#EE312E"/><circle cx="${mx + boy * .095}" cy="${my + boy * .085}" r="${boy * .035}" fill="#FFC7BD" opacity=".8"/>`; }
  // ---------- haber grafikleri ----------
  function grafikZemin(baslik) { let o = `<rect width="1080" height="1920" fill="${LAC}"/>`;
    for (let i = 0; i < 20; i++) o += R(0, i * 100, 1080, 2, 0, '#2A5A9A', .25) + R(i * 100, 0, 2, 1920, 0, '#2A5A9A', .25);
    if (baslik) o += R(60, 450, gen(baslik, 34, { mono: true, ls: 3 }) + 60, 60, 0, KR) + mono(baslik, 90, 492, 34, AK, 'letter-spacing="3"');
    return o; }
  // ÖTV yastığı: varil → ZAM oku → yastık (ÖTV) → pompa; yastikP: 1 var, 0 kalktı; ezil: sıkışma
  function yastik(t, { yastikP = 1, ezil = 0, yuzde = 0, carp = 0 } = {}) { let o = grafikZemin('EŞEL MOBİL NASIL İŞLİYORDU?');
    o += `<g transform="translate(270 700)">` + R(-80, -110, 160, 220, 24, '#2A2A30') + R(-80, -55, 160, 14, 0, '#4A4A50') + R(-80, 45, 160, 14, 0, '#4A4A50') + yaz('PETROL', 0, 12, 30, '#FFD23F') + '</g>';
    o += `<g transform="translate(270 900)">` + `<path d="M0 50 L0 -40" stroke="${KR}" stroke-width="18" stroke-linecap="round"/><path d="M-30 -14 L0 -56 L30 -14" stroke="${KR}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + yaz('FİYAT', 0, 100, 28, AK) + '</g>';
    const zy = 990 + 50 * ezil + 150 * carp;
    o += `<g transform="translate(720 ${zy - 200})">` + R(-56, -120, 112, 160, 8, KR) + `<path d="M-100 40 L0 150 L100 40Z" fill="${KR}"/>` + yaz('ZAM', 0, -20, 38, AK) + '</g>';
    if (yastikP > 0) { const yx = 720 + (1 - yastikP) * 700, yb = 1060, eh = 110 - 50 * ezil;
      o += `<g opacity="${yastikP}"><path d="M${yx - 220} ${yb} Q${yx - 240} ${yb - eh / 2} ${yx - 200} ${yb - eh} L${yx + 200} ${yb - eh} Q${yx + 240} ${yb - eh / 2} ${yx + 220} ${yb} Q${yx} ${yb + 20} ${yx - 220} ${yb}Z" fill="#FFD23F"/><path d="M${yx - 150} ${yb - eh * .7} Q${yx} ${yb - eh * .85} ${yx + 150} ${yb - eh * .7}" stroke="#FFFFFF" stroke-width="8" fill="none" opacity=".5"/>` + yaz('ÖTV', yx, yb - eh / 2 + 16, 46, LAC) + '</g>';
      if (yuzde > 0) o += `<g transform="translate(300 1100) scale(${yuzde})">` + R(-180, -34, 360, 68, 34, '#1B1640') + yaz("ZAMMIN %75'İNE KADAR", 0, 13, 30, '#FFD23F') + '</g>'; }
    o += `<g transform="translate(720 1205)">` + R(-200, -55, 400, 110, 20, '#0B1E1A') + mono('POMPA', -185, -30, 20, '#9FC0E8') + `<text class="mono" x="0" y="30" font-size="56" text-anchor="middle" style="fill:${carp > .5 ? KR : '#3AE08A'}">${carp > .5 ? '▲ ARTIŞ' : 'SABİT'}</text>` + '</g>';
    return o; }
  // ÖTV merdiveni: 3 ay
  function merdiven(t, p) { let o = grafikZemin('BENZİNDE ÖTV · LİTRE BAŞINA');
    const V = [['EKİM', '7,90'], ['KASIM', '11,36'], ['ARALIK', '14,83']], hmax = 480, B0 = 1170;
    V.forEach(([ay, v], i) => { const q = FX.E.outExpo(cl(p[i] || 0)); if (q <= 0) return; const val = parseFloat(v.replace(',', '.')), bh = hmax * val / 14.83 * q, x = 140 + i * 280;
      o += R(x, B0 - bh, 230, bh, 14, i === 2 ? KR : (i === 1 ? '#E8743C' : '#FFB44C')) + R(x, B0 - bh, 230, 18, 9, '#FFFFFF', .3) + yaz(v + ' TL', x + 115, B0 - bh - 26, 54, AK) + mono(ay, x + 115 - gen(ay, 34, { mono: true }) / 2, B0 + 56, 34, AK); });
    o += R(100, 1170, 880, 6, 3, '#9FC0E8');
    return o; }
  // pompa ekranı yakın plan: rakamlar yukarı döner
  function pompaEkran(d) { let o = `<rect width="1080" height="1920" fill="#C8D0DC"/>` + `<g style="filter:blur(14px)">${R(0, 0, 1080, 600, 0, '#2A2A5A')}${R(0, 1500, 1080, 420, 0, '#4A4A58')}</g>`;
    o += R(120, 400, 840, 800, 40, '#E8EEF4') + R(120, 400, 840, 110, 40, KR) + yaz('BENZİN', 540, 478, 60, AK);
    const sat = [['TUTAR', 'TL'], ['LİTRE', 'L'], ['BİRİM FİYAT', 'TL/L']];
    sat.forEach(([ad, b], i) => { const y = 590 + i * 195; o += mono(ad, 180, y - 16, 28, '#4A5060') + R(180, y, 720, 120, 14, '#0B1E1A');
;      // gerçek fiyat YAZILMAZ: yalnızca litre sayacı döner, tutar/birim fiyat ↑ ile gösterilir
      const v = (d * 7.3).toFixed(2);
      o += i !== 1 ? `<text class="mono" x="860" y="${y + 88}" font-size="72" text-anchor="end" style="fill:#3AE08A">↑ ↑ ↑</text>` : `<text class="mono" x="860" y="${y + 88}" font-size="72" text-anchor="end" style="fill:#3AE08A">${v.replace('.', ',')}</text>`; });
    const c = cl((d - .5) / .3); if (c > 0) o += `<g transform="translate(540 1560) scale(${c})">` + R(-330, -48, 660, 96, 48, LAC) + yaz('HER AY YENİ ARTIŞ', 0, 18, 46, '#FFD23F') + '</g>';
    ['EKİM', 'KASIM', 'ARALIK'].forEach((ay, i) => { const q = cl((d - .9 - i * .35) / .25); if (q > 0) o += `<g transform="translate(${260 + i * 280} 1700) scale(${q})">` + R(-110, -40, 220, 80, 40, KR) + yaz(ay + ' ▲', 0, 14, 36, AK) + '</g>'; });
    return o; }
  // LPG etiketi: tek adım
  function lpgEtiket(d) { let o = grafikZemin('LPG · KİLOGRAM BAŞINA ÖTV');
    o += `<g transform="translate(540 980)">` + R(-200, -360, 400, 620, 160, '#2E8A4A') + R(-200, -360, 400, 120, 60, '#1F6A36') + yaz('LPG', 0, -270, 72, AK) + R(-150, -170, 300, 360, 30, '#E8F4EC') + mono('TL / KG', -60, -130, 26, '#4A5A50') + '</g>';
    const a = cl(d / .3), b = FX.E.outExpo(cl((d - 1.4) / .5));
    o += `<g transform="translate(540 945)">` + yaz('9,22', 0, 0, 90, '#4A5A50', 900, 'middle', `opacity="${a * (1 - b * .6)}"`) + (b > 0 ? `<path d="M-110 -30 L110 -30" stroke="${KR}" stroke-width="10" opacity="${b}"/>` : '') + '</g>';
    if (b > 0) o += `<g transform="translate(540 1110) scale(${b})">` + yaz('11,38', 0, 0, 110, KR) + '</g>' + `<g opacity="${b}"><path d="M780 1060 L780 840" stroke="#FFD23F" stroke-width="20" stroke-linecap="round"/><path d="M740 880 L780 830 L820 880" stroke="#FFD23F" stroke-width="20" fill="none" stroke-linecap="round"/></g>`;
    const c = cl((d - 2.6) / .3); if (c > 0) o += `<g transform="translate(540 1500) scale(${c})">` + R(-300, -48, 600, 96, 48, '#FFD23F') + yaz('TEK SEFERDE', 0, 18, 48, LAC) + '</g>';
    return o; }
  // Resmî Gazete yakın plan
  function gazete(d) { let o = `<rect width="1080" height="1920" fill="#3A2A20"/>` + `<g style="filter:blur(16px)"><circle cx="860" cy="300" r="260" fill="#FFB45C" opacity=".35"/></g>`;
    o += `<g transform="rotate(-2 540 960)">` + R(110, 360, 860, 1200, 6, '#F6F2E8') + yaz('T.C.', 540, 470, 40, '#1B1B1B') + yaz('Resmî Gazete', 540, 580, 92, '#1B1B1B', 800) + R(170, 620, 740, 4, 0, '#1B1B1B') + mono('1 EKİM 2026', 540 - gen('1 EKİM 2026', 30, { mono: true }) / 2, 670, 30, '#1B1B1B');
    for (let i = 0; i < 16; i++) o += R(170 + (i % 2) * 380, 730 + Math.floor(i / 2) * 44, 330, 14, 7, '#B8B4AA');
    const v = cl((d - .4) / .4); o += R(170, 1110, 740 * v, 150, 6, '#FFE45C', .85) + yaz('AKARYAKITTA EŞEL MOBİL', 540, 1170, 48, '#1B1B1B', 900, 'middle', `opacity="${Math.min(1, v * 2)}"`) + yaz('SİSTEMİ SONA ERDİ', 540, 1232, 48, '#1B1B1B', 900, 'middle', `opacity="${Math.min(1, v * 2)}"`);
    for (let i = 0; i < 6; i++) o += R(170, 1300 + i * 40, 740, 12, 6, '#B8B4AA');
    return o + '</g>'; }
  // takip kartı
  function takip(p) { return `<g transform="translate(540 565) scale(${p * .85})">` + R(-380, -170, 760, 340, 40, '#0B1433') + `<rect x="-380" y="-170" width="760" height="340" rx="40" fill="none" stroke="${KR}" stroke-width="6"/>` + logo(0, -60, .75) + R(-200, 40, 400, 90, 45, KR) + yaz('+ TAKİP ET', 0, 100, 46, AK) + '</g>'; }
  return { logo, kure, jenerik, studyo, masa, ekran, parazit, sinyal, istasyon, pompa, mikrofon, grafikZemin, yastik, merdiven, pompaEkran, lpgEtiket, gazete, takip, DUVAR };
})();
