S = {}
# 01 — KANCA: ikiye bölünmüş ekran — DOLARLA yükselen çubuklar (Gubi tepede) / ALTINLA eriyen külçe yığını (Gufi kucaklar)
S[1] = r"""
window.renderAt = t => {
  let o = AU.zemin('#0E2A4A', '#123A66', { desen: '$', op: .05 });
  o += `<path d="M640 0 L1080 0 L1080 1920 L440 1920Z" fill="#3A2A12"/>` + `<g opacity=".05">` + [0,1,2,3,4,5,6,7,8,9,10,11].map(r => AU.kulce(760 + (r % 3) * 110, 180 + r * 150, .7)).join('') + '</g>';
  o += `<path d="M640 0 L440 1920" stroke="#FFF3D6" stroke-width="10" opacity=".85"/>`;
  o += AU.cip('DOLARLA', 250, 390, C.MAV, '#FFFFFF', 40) + AU.cip('ALTINLA', 850, 390, C.ALT, C.LAC, 40);
  const g = E(A(t, .2, 2.4)), H = [170, 250, 370, 560];
  H.forEach((v, i) => o += AU.cubuk(100 + i * 100, 1180, 74, v * g, i === 3 ? C.YES : C.MAV, i === 3 ? C.YESK : C.MAVK));
  const ok1 = pop(t, 2.0); if (ok1 > 0) o += grp(AU.cip('EN İYİ ↑', 0, 0, C.YES, '#FFFFFF', 36), 170, 480, ok1);
  // altın piramidi erir
  const kalan = 10 - 8 * E(A(t, 4.4, 6.2));
  o += AU.piramit(830, 1180, 10, kalan, 1.05);
  if (t > 4.4 && t < 6.8) for (let i = 0; i < 8; i++) { const d = t - 4.5 - i * .22; if (d > 0 && d < .9) o += `<ellipse cx="${760 + h(i) * 150}" cy="${1000 + d * d * 500}" rx="10" ry="16" fill="${C.ALT}" opacity="${1 - d / .9}"/>`; }
  const ok2 = pop(t, 4.5); if (ok2 > 0) o += grp(AU.cip('EN KÖTÜ ↓', 0, 0, C.KIR, '#FFFFFF', 36), 870, 480, ok2);
  o += gubi(t, { x: 400, y: 1180 - 560 * g, boy: 150, duygu: 'mutlu', bakHedef: t > 6.7 ? [540, 760] : [700, 900], ust: VEZNEDAR });
  o += gufi(t, { x: 820, y: 1760, boy: 270, duygu: t > 4.6 ? 'uzgun' : 'merak', bakHedef: t > 6.7 ? [540, 760] : [830, 1050], ust: VATANDAS, isaretHedef: t > 6.8 ? [540, 760] : null });
  const q = pop(t, 6.75, .5); if (q > 0) o += grp(`<circle r="120" fill="#FFF3D6"/><circle r="120" fill="none" stroke="${C.ALT}" stroke-width="10"/>` + AU.yaz('?', 0, 62, 180, C.LAC), 540, 760, q, 6 * Math.sin(t * 5));
  $('dinamik').innerHTML = kam(o, { y: 760, k: 1 + .06 * E(A(t, 6.7, 9.1)) });
};"""
# 02 — KELİME: sözlük açılır → DETAY madde; AZAMİ / ASGARİ levhaları; TABAN merdiveni
S[2] = r"""
window.renderAt = t => {
  let o = AU.zemin('#1B2A55', '#0B1433', { desen: 'Aa', op: .04 });
  if (t < 5.1) {
    o += AU.cip('KELİME ANLAMI', 540, 390, C.ALT, C.LAC, 38);
    o += AU.sozluk(540, 760, 1.15, E(A(t, .15, 1.0)));
    o += gubi(t, { x: 300, y: 1700, boy: 230, duygu: 'merak', bakHedef: [540, 760], ust: VEZNEDAR });
    o += gufi(t, { x: 790, y: 1770, boy: 260, bakHedef: [540, 760], ust: VATANDAS });
    o = kam(o, { y: 760, k: 1 + .12 * E(A(t, 0, 2.6)) });
  } else if (t < 8.2) {
    const a = pop(t, 5.15), b = pop(t, 6.2);
    o += AU.cip('İKİSİ TAM TERSİ', 540, 390, C.KREM, C.LAC, 38);
    if (a > 0) o += grp(AU.levha(0, 0, 1, 'azami', '50'), 300, 680, a) + grp(AU.cip('AZAMİ = EN ÇOK', 0, 0, '#D7262E', '#FFFFFF', 30), 300, 480, a);
    if (b > 0) o += grp(AU.levha(0, 0, 1, 'asgari', '30'), 780, 680, b) + grp(AU.cip('ASGARİ = EN AZ', 0, 0, '#1F5FBF', '#FFFFFF', 30), 780, 480, b);
    if (b > .5) o += `<path d="M470 880 h140 M490 860 l-24 20 l24 20 M590 860 l24 20 l-24 20" stroke="#FFF3D6" stroke-width="10" stroke-linecap="round" fill="none" opacity="${b}"/>`;
    o += gufi(t, { x: 300, y: 1770, boy: 250, ust: VATANDAS, isaretHedef: [300, 680], bakHedef: [300, 680] });
    o += gubi(t, { x: 780, y: 1700, boy: 220, ust: VEZNEDAR, bakHedef: [780, 680] });
  } else {
    const d = t - 8.2;
    o += AU.panel(140, 380, 800, 190, C.LAC2) + AU.yaz('ASGARİ ÜCRET', 540, 470, 76, C.ALTA) + AU.yaz('ödenebilecek EN DÜŞÜK ücret', 540, 535, 42, C.KREM, 700);
    const H = [130, 210, 290, 380, 470, 560];
    H.forEach((v, i) => { const g = E(A(d, .1 + i * .12, .6 + i * .12)); o += AU.cubuk(160 + i * 152, 1180, 120, v * g, i === 0 ? C.YES : '#3A4A7A', i === 0 ? C.YESK : '#26335A'); });
    const l = E(A(d, .9, 1.6)); o += `<path d="M90 ${1050} H${90 + 900 * l}" stroke="${C.KIR}" stroke-width="8" stroke-dasharray="22 14"/>`;
    if (l > .9) o += AU.cip('TABAN', 940, 1010, C.KIR, '#FFFFFF', 30);
    o += gufi(t, { x: 160, y: 1050, boy: 150, duygu: 'mutlu', ust: VATANDAS, bakHedef: [500, 700] });
    o += gubi(t, { x: 820, y: 1720, boy: 210, ust: VEZNEDAR, isaretHedef: [160, 1000], bakHedef: [160, 1000] });
    o = kam(o, { dy: -140 * (1 - E(A(d, 0, 1.4))) });
  }
  o += DP.sar(t, 2.6, 5.1, dd => {
    let s = `<rect width="1080" height="1920" fill="#F7F0E0"/>`; for (let i = 0; i < 26; i++) s += AU.R(80, 140 + i * 66, 920, 4, 2, '#E2D6BC');
    s += AU.R(80, 420, 920, 620, 30, '#FFFBF0') + AU.yaz('asgarî', 540, 650, 170, C.LAC) + AU.cip('(Ar.) as·ga·rî', 540, 740, C.KIR, '#FFFFFF', 34);
    s += AU.yaz('en az, en küçük', 540, 900, 76, '#3A2A1A', 800) + AU.yaz('zıddı: azamî (en çok)', 540, 990, 44, '#8A7A5A', 700);
    const m = E(A(dd, .4, 1.1)); s += `<path d="M300 920 H${300 + 480 * m}" stroke="${C.ALT}" stroke-width="16" stroke-linecap="round" opacity=".55"/>`;
    return s;
  });
  $('dinamik').innerHTML = o;
};"""
# 03 — DÜNYA: küre Yeni Zelanda'ya döner (1894 İLK) → Türkiye haritası, il il farklı rakam, 1951 damgası
S[3] = r"""
window.renderAt = t => {
  let o = AU.zemin('#0E2040', '#071026');
  for (let i = 0; i < 40; i++) o += `<circle cx="${h(i) * 1080}" cy="${h(i + 50) * 1200 + 200}" r="${1.5 + h(i + 9) * 2}" fill="#FFFFFF" opacity="${.2 + .2 * h(i + 3)}"/>`;
  if (t < 4.6) {
    const q = E(A(t, .1, 2.2)), dn = [-35 + (-174 + 35) * q, -39 + (41 + 39) * q];
    const K1 = H.kure({ x: 540, y: 780, r: 340, donus: dn });
    o += K1.svg; const p = K1.p([174.8, -41.3]);
    const a = pop(t, 2.2); if (p && a > 0) o += grp(H.igne(0, 0, '#EE312E', 1.4, ''), p[0], p[1], a);
    if (a > 0) o += grp(AU.cip('1894 · YENİ ZELANDA', 0, 0, C.KREM, C.LAC, 34), 540, 1180, a);
    o += AU.cip('DÜNYADA İLK ASGARİ ÜCRET', 540, 390, C.ALT, C.LAC, 32);
    o += gubi(t, { x: 870, y: 1700, boy: 210, ust: VEZNEDAR, isaretHedef: p || [540, 780], bakHedef: p || [540, 780] });
    o += gufi(t, { x: 220, y: 1770, boy: 250, ust: VATANDAS, duygu: t > 2.4 ? 'sasir' : 'merak', bakHedef: [540, 780] });
    o = kam(o, { y: 780, k: .95 + .1 * E(A(t, 0, 4.6)) });
  } else {
    const d = t - 4.6;
    const M = H.ciz({ ulkeler: H.ulke('Türkiye'), kutu: [50, 470, 980, 520], renk: '#E9DDC2' });
    o += M.svg;
    const IL = [[28.97, 41.01], [32.85, 39.93], [27.14, 38.42], [35.32, 37.0], [29.06, 40.18], [31.79, 41.45], [39.72, 41.0], [40.2, 37.9], [41.27, 39.9], [30.7, 36.9], [37.0, 39.75]];
    IL.forEach((ll, i) => { const [x, y] = M.p(ll), g = pop(d, .3 + i * .18); if (g <= 0) return; const hh = (40 + h(i * 3) * 110) * g; o += AU.R(x - 14, y - hh, 28, hh, 6, i % 3 ? C.YES : C.ALT) + `<circle cx="${x}" cy="${y}" r="9" fill="${C.LAC}"/>`; });
    o += AU.cip('HER İLİN RAKAMI AYRI', 540, 390, C.YES, '#FFFFFF', 34);
    const s = pop(d, .2, .5); if (s > 0) o += grp(AU.R(-230, -60, 460, 120, 18, 'none') + `<rect x="-230" y="-60" width="460" height="120" rx="18" fill="none" stroke="${C.KIR}" stroke-width="10"/>` + AU.yaz('1951 · İLK YÖNETMELİK', 0, 16, 40, C.KIR), 700, 1130, 1.6 - .6 * s, -8, s);
    o += AU.Tm('temsili', 960, 1060, 22, '#8A90A8');
    o += gufi(t, { yol: [[4.6, 180, 1770, 250], [9.9, 520, 1770, 250]], x: 180, y: 1770, boy: 250, ust: VATANDAS, bakHedef: [540, 700] });
    o += gubi(t, { x: 860, y: 1700, boy: 210, ust: VEZNEDAR, duygu: 'merak', bakHedef: [540, 700] });
    o = kam(o, { dx: 20 - 40 * E(A(d, 0, 5.3)) });
  }
  $('dinamik').innerHTML = o;
};"""
# 04 — SIFIR SİLGİSİ: 300.000.000 TL → dev silgi altı sıfırı siler, sıfırlar Gubi'nin kafasına düşer → 350 YTL
S[4] = r"""
window.renderAt = t => {
  let o = AU.zemin('#14224A', '#0B1433', { desen: '₺', op: .05 });
  const yeni = t > 6.4;
  o += AU.cip(yeni ? '1 OCAK 2005' : '2004', 540, 390, yeni ? C.YES : C.ALT, C.LAC, 40);
  o += AU.panel(90, 470, 900, 280, '#081028');
  const S0 = '300.000.000', fs = 112, cw = fs * .6, x0 = 540 - (S0.length * cw) / 2 + cw / 2 - 60, yy = 650;
  const sx = 1100 - 900 * E(A(t, 4.3, 6.2)); // silgi x
  if (!yeni) {
    for (let i = 0; i < S0.length; i++) { const cx = x0 + i * cw, ch = S0[i]; if (i < 3) { o += AU.Tm(ch, cx, yy, fs, C.ALTA); continue; }
      const td = 4.3 + (1100 - cx - 60) / 900 * 1.9; const dd = t - td;
      if (dd < 0) o += AU.Tm(ch, cx, yy, fs, C.ALTA);
      else if (ch === '0' && dd < 1.6) { const fy = yy + 1600 * dd * dd, tx = cx + (420 - cx) * Math.min(1, dd * 1.2); const yy2 = Math.min(fy, 1470 - Math.abs(Math.sin(dd * 9)) * 60 * Math.max(0, 1 - dd)); o += `<g opacity="${1 - A(dd, 1.2, 1.6)}">` + AU.Tm('0', tx, yy2, fs * .8, C.ALTA) + '</g>'; } }
    o += AU.Tm('TL', 905, yy, 60, C.KREM);
    if (t > 4.2 && t < 6.5) o += AU.silgi(sx, yy - 40, 1.05, -12 + 6 * Math.sin(t * 22));
  } else {
    const k = A(t, 6.6, 7.4), v = Math.round(300 + 50 * E(k));
    o += AU.Tm(String(v), 470, yy, 170, C.ALTA) + AU.Tm('YTL', 760, yy, 72, C.YES);
  }
  const hit = [0, 1, 2, 3, 4, 5].reduce((m, i) => { const d = t - (4.9 + i * .22); return m + (d > 0 && d < .25 ? (1 - d / .25) : 0); }, 0);
  o += gubi(t, { x: 420, y: 1700, boy: 230, ust: VEZNEDAR, duygu: t > 4.8 && t < 6.6 ? 'korku' : 'merak', bakHedef: [540, 560] });
  o += PR.tomar(940, 1790, .7, 10);
  o += gufi(t, { x: 760, y: 1770, boy: 260, ust: VATANDAS, duygu: yeni ? 'sasir' : 'mutlu', bakHedef: [540, 560] });
  o += AU.rozet(760, 1610, 1, 'MİLYONER', C.ALT, C.LAC, E(A(t, 6.3, 6.9)));
  $('dinamik').innerHTML = kam(o, { dx: 7 * hit * Math.sin(t * 60), dy: 5 * hit * Math.cos(t * 50) });
};"""
# 05 — ALTIN TERAZİSİ: 2005 kefesi 17 gram, 2026 kefesi 4 gram (birikme); terazi sola yatar
S[5] = r"""
window.renderAt = t => {
  let o = AU.zemin('#2A1E0E', '#120C06');
  o += `<circle cx="540" cy="760" r="520" fill="${C.ALT}" opacity=".07"/>`;
  o += AU.cip('1 MAAŞ = KAÇ GRAM ALTIN?', 540, 390, C.ALT, C.LAC, 34);
  const gs = 17 * E(A(t, .5, 3.6)), gr = 4 * A(t, 4.5, 6.0);
  const eg = -13 * E(A(t, .8, 3.6)) + 4 * E(A(t, 4.6, 6.0));
  const Tz = PR.terazi(540, 1230, 1.0, eg, { cokKoyu: '#3A2A12' });
  o += Tz.svg + AU.piramit(Tz.sol[0], Tz.sol[1] - 8, 17, gs, .44) + AU.piramit(Tz.sag[0], Tz.sag[1] - 8, 4, gr, .44);
  o += AU.panel(60, 450, 380, 150, C.LAC) + AU.yaz('2005 · 350 YTL', 250, 510, 38, C.KREM, 800) + AU.yaz('≈ ' + Math.floor(gs) + ' GRAM', 250, 575, 50, C.ALTA);
  if (t > 4.3) { const a = pop(t, 4.3); o += grp(AU.panel(-190, -75, 380, 150, C.LAC) + AU.yaz('2026 · 28.075 TL', 0, -15, 36, C.KREM, 800) + AU.yaz('≈ ' + Math.floor(gr) + ' GRAM', 0, 50, 50, C.ALTA), 830, 525, a); }
  o += gubi(t, { x: 220, y: 1700, boy: 210, ust: VEZNEDAR, duygu: 'mutlu', bakHedef: Tz.sol });
  o += gufi(t, { x: 850, y: 1770, boy: 260, ust: VATANDAS, duygu: t > 6 ? 'uzgun' : 'merak', bakHedef: Tz.sag });
  $('dinamik').innerHTML = kam(o, { dy: -130 * (1 - E(A(t, 0, 1.3))) });
};"""
# 06 — DOLAR: ₺→$ çevirici; 2005 ≈260 $ → 2026 ≈650 $ çubuk (Gubi tırmanır); kamera yukarı
S[6] = r"""
window.renderAt = t => {
  let o = AU.zemin('#0E2A4A', '#0B1433', { desen: '$', op: .05 });
  o += AU.cip('AYNI MAAŞ, DOLARLA', 540, 390, C.MAV, '#FFFFFF', 36);
  const mk = A(t, 2.0, 2.5);
  if (mk < 1) {
    o += grp(AU.cevirici(0, 0, 1, t), 540, 700, 1 - .4 * mk, 0, 1 - mk);
    const b = A(t, .3, 1.3); if (b < 1) o += PR.banknot(180 + 140 * E(b), 1450 - 820 * E(b), 260 * (1 - .5 * b), { deger: '350', birim: 'YTL', pal: 'yeni', rot: -10 + 20 * b });
    const c = A(t, 1.3, 2.0); if (c > 0) o += PR.banknot(700 + 200 * E(c), 760 - 120 * E(c), 260, { deger: '$', birim: 'DOLAR', pal: 'yesil', rot: 8 }, 1 - mk);
  }
  const g1 = E(A(t, 2.1, 3.1)), g2 = E(A(t, 5.0, 6.4)), K_ = 1.0;
  o += AU.cubuk(360, 1180, 180, 260 * K_ * g1, C.MAV, C.MAVK, { etiket: g1 > .05 ? '≈' + Math.round(260 * g1) + ' $' : '', alt: t > 2.1 ? '2005' : '', fs: 52 });
  o += AU.cubuk(720, 1180, 180, 650 * K_ * g2, C.YES, C.YESK, { alt: t > 5 ? '2026' : '' }) + (g2 > .05 ? AU.yaz('≈' + Math.round(650 * g2) + ' $', 915, 1180 - 650 * K_ * g2 + 60, 52) : '');
  const kt = pop(t, 7.0); if (kt > 0) o += grp(AU.cip('≈ 2,5 KAT', 0, 0, C.ALT, C.LAC, 34), 540, 640, kt);
  o += gufi(t, { x: 200, y: 1770, boy: 250, ust: VATANDAS, bakHedef: t > 5 ? [720, 600] : [540, 700], duygu: t > 6.4 ? 'sasir' : 'merak' });
  o += gubi(t, { yol: [[0, 880, 1700, 210], [5.0, 880, 1700, 210], [6.5, 720, 1180 - 650 * K_, 160]], x: 880, y: 1700, boy: 210, ust: VEZNEDAR, duygu: 'mutlu', bakHedef: [540, 1100] });
  $('dinamik').innerHTML = kam(o, { dy: 70 * E(A(t, 5.0, 7.0)) });
};"""
# 07 — SIR: yarış pisti — MAAŞ dolar'ı geçer; ALTIN roketle dünya rekoru; geri çekil: ALIM GÜCÜ = NEYLE ÖLÇTÜĞÜN
S[7] = r"""
window.renderAt = t => {
  let w = '';
  w += AU.R(-400, 380, 2600, 860, 0, '#2E7A4A') + AU.R(-400, 470, 2600, 640, 0, '#C8623A');
  [470, 683, 896, 1110].forEach(y => w += AU.R(-400, y - 4, 2600, 8, 0, '#FFF3D6', .8));
  for (let r = 0; r < 16; r++) for (let c = 0; c < 2; c++) w += AU.R(1500 + c * 20, 470 + r * 40, 20, 40, 0, (r + c) % 2 ? '#FFFFFF' : '#1B1F3A');
  w += AU.R(140, 470, 10, 640, 0, '#FFFFFF', .8);
  const gl = H.kure({ x: 1700, y: 300, r: 90, donus: [-30, -20] }); w += gl.svg;
  const p1 = E(A(t, .2, 2.4)), p2 = E(A(t, 2.6, 7.0)), roket = A(t, 2.46, 4.4);
  const xm = 200 + 700 * p1 + 200 * p2, xd = 200 + 560 * p1 + 150 * p2, xa = 200 + 300 * p1 + 1400 * E(roket);
  [['MAAŞ', 'maas', xm, 576, C.YES], ['DOLAR', 'dolar', xd, 790, C.MAV], ['ALTIN', 'altin', xa, 1003, C.ALT]].forEach(([ad, tip, x, y, r]) => {
    w += AU.jeton(x, y, .95, tip, tip === 'altin' && t > 2.46 && t < 4.6 ? 1 : 0, t) + AU.cip(ad, x, y - 100, r, tip === 'altin' ? C.LAC : '#FFFFFF', 26); });
  const rk = pop(t, 3.2); if (rk > 0) w += grp(AU.cip('DÜNYA REKORU', 0, 0, C.KIR, '#FFFFFF', 30), 1560, 430, rk);
  const lead = Math.max(xm, xd, Math.min(xa, 1750));
  const dxF = -AU.cl(lead - 620, 0, 1000), zq = E(A(t, 7.3, 8.4));
  const dx = dxF + (-186 - dxF) * zq, k = 1 - .4 * zq;
  let o = AU.zemin('#7EC8F0', '#BFE8FF') + kam(w, { x: 540, y: 900, k, dx });
  const a = pop(t, 1.6); if (a > 0 && t < 7.3) o += grp(AU.cip('MAAŞ > DOLAR', 0, 0, C.YES, '#FFFFFF', 34), 540, 390, a);
  const c = pop(t, 7.5); if (c > 0) o += grp(AU.panel(-400, -110, 800, 220, C.LAC) + AU.yaz('ALIM GÜCÜ =', 0, -20, 58, C.KREM) + AU.yaz('NEYLE ÖLÇTÜĞÜN', 0, 60, 66, C.ALTA), 540, 490, c);
  o += gubi(t, { x: 230, y: 1700, boy: 210, ust: VEZNEDAR, duygu: 'mutlu', bakHedef: [600, 800] });
  o += gufi(t, { x: 850, y: 1770, boy: 260, ust: VATANDAS, duygu: t > 2.6 && t < 7 ? 'sasir' : 'merak', bakHedef: [700, 900] });
  $('dinamik').innerHTML = o;
};"""
# 08 — MALİYET: hesap makinesi 40.874 → pasta; CEBE 28.075 dilimi cüzdana; primler (gelir vergisi yok)
S[8] = r"""
window.renderAt = t => {
  let o = AU.zemin('#1B2A55', '#0B1433', { desen: '₺', op: .04 });
  o += AU.cip('PATRONA MALİYET', 540, 390, C.ALT, C.LAC, 36);
  const cx = 540, cy = 790, r = 250;
  if (t < 1.9) o += grp(PR.hesapMakinesi(0, 0, 1.3, t > .4 ? '40.874' : '0'), 540, 780, 1 - .6 * A(t, 1.6, 1.9), 0, 1 - A(t, 1.6, 1.9));
  const sw = E(A(t, 1.75, 3.0)), F = [[28075.5, C.YES], [4954.5, C.MAV], [7844.6, '#8A6CFF']], TOP = 40874.6;
  if (sw > 0) {
    o += AU.yaz('40.874 TL', 540, 495, 64, C.KREM);
    let a = -Math.PI / 2; const son = -Math.PI / 2 + 2 * Math.PI * sw;
    F.forEach(([v, renk], i) => { const a1 = Math.min(a + 2 * Math.PI * v / TOP, son); if (a1 > a) { const ofs = i === 0 ? 50 * E(A(t, 6.24, 6.8)) : 28 * E(A(t, 7.99, 8.5)); o += AU.dilim(cx, cy, r, a, a1, renk, ofs); } a += 2 * Math.PI * v / TOP; });
    o += `<circle cx="${cx}" cy="${cy}" r="${r * .02}" fill="#FFF"/>`;
  }
  const L = (y, renk, s, v, p) => p > 0 ? `<g opacity="${p}"><circle cx="190" cy="${y - 12}" r="16" fill="${renk}"/>` + `<text x="225" y="${y}" font-size="34" font-weight="800" style="fill:#FFF3D6">${s}</text>` + `<text class="mono" x="900" y="${y}" font-size="34" text-anchor="end" style="fill:${renk}">${v}</text></g>` : '';
  o += L(1160, C.YES, 'CEBE GİREN (NET)', '28.075', A(t, 6.24, 6.6));
  o += L(1205, C.MAV, 'İŞÇİ PRİMİ (SGK+İŞSİZLİK)', '4.955', A(t, 7.99, 8.3));
  o += L(1250, '#8A6CFF', 'İŞVEREN PRİMİ', '7.845', A(t, 8.2, 8.5));
  const nv = pop(t, 8.8); if (nv > 0) o += grp(AU.cip('GELİR VERGİSİ YOK · 2022', 0, 0, '#FFF3D6', C.LAC, 24), 540, 1092, nv);
  o += PR.cuzdan(250, 1640, .55, E(A(t, 6.2, 6.7)));
  o += gufi(t, { x: 380, y: 1780, boy: 240, ust: VATANDAS, duygu: t > 6.5 ? 'mutlu' : 'merak', bakHedef: [540, 800] });
  o += gubi(t, { x: 840, y: 1700, boy: 220, ust: VEZNEDAR, duygu: 'merak', bakHedef: [540, 800] });
  $('dinamik').innerHTML = kam(o, { y: 800, k: 1 + .07 * E(A(t, 0, 6)) });
};"""
# 09 — AVRUPA: brüt asgari ücret sıralaması (Eurostat, Ocak 2026); Türkiye vurgulu; Almanya ↔ Türkiye 3,5 kat
S[9] = r"""
window.renderAt = t => {
  let o = AU.zemin('#0F1E3A', '#0B1433');
  o += AU.cip("AVRUPA'DA ASGARİ ÜCRET · BRÜT €", 540, 390, C.KREM, C.LAC, 28);
  o += AU.Tm('Eurostat · Ocak 2026 · zirvede Lüksemburg', 540, 460, 24, '#8A90A8');
  const RW = [['İrlanda', 2391], ['Almanya', 2343], ['Hollanda', 2295], ['Belçika', 2112], null, ['Letonya', 780], ['Sırbistan', 744], ['Karadağ', 670], ['TÜRKİYE', 654]];
  RW.forEach((r, i) => { const y = 490 + i * 82; if (!r) { o += AU.yaz('· · ·', 330, y + 40, 50, '#8A90A8'); return; }
    const g = E(A(t, .2 + i * .18, .9 + i * .18)), w = r[1] * .27 * g, tr = r[0] === 'TÜRKİYE', de = r[0] === 'Almanya' && t > 4.7;
    o += `<text x="310" y="${y + 46}" font-size="36" font-weight="${tr ? 900 : 700}" text-anchor="end" style="fill:${tr ? C.KIR : '#FFF3D6'}">${r[0]}</text>`;
    o += AU.R(330, y + 10, w, 50, 14, tr ? C.KIR : de ? C.ALT : '#3A5A9C') + (g > .9 ? `<text class="mono" x="${330 + w - 14}" y="${y + 46}" font-size="28" text-anchor="end" style="fill:#FFFFFF">${r[1].toLocaleString('tr-TR')}</text>` : ''); });
  const k = E(A(t, 4.8, 5.6));
  if (k > 0) { const y1 = 490 + 82 + 35, y2 = 490 + 8 * 82 + 35, yy = y1 + (y2 - y1) * k; o += `<path d="M1010 ${y1} V${yy}" stroke="${C.ALT}" stroke-width="10" stroke-linecap="round"/><path d="M990 ${y1} h40 M990 ${y2} h40" stroke="${C.ALT}" stroke-width="10" opacity="${k}"/>`; o += grp(AU.cip('3,5 KAT+', 0, 0, C.ALT, C.LAC, 34), 820, 860, pop(t, 5.4)); }
  o += gufi(t, { x: 700, y: 1150, boy: 160, ust: VATANDAS, duygu: t > 5 ? 'uzgun' : 'merak', bakHedef: [700, 500] });
  o += gubi(t, { x: 860, y: 1700, boy: 210, ust: VEZNEDAR, isaretHedef: t > 4.8 ? [700, 530] : null, bakHedef: [600, 800] });
  $('dinamik').innerHTML = kam(o, { dy: 80 * (1 - E(A(t, 0, 1.6))) });
};"""
# 10 — KAPANIŞ: dolar mı, altın mı, market fişi mi? + YORUMLARA YAZ
S[10] = r"""
window.renderAt = t => {
  let o = AU.zemin('#1B2A55', '#0B1433', { desen: '?', op: .04 });
  const tt = pop(t, .2); if (tt > 0) o += grp(AU.yaz('SEN NEYLE', 0, 0, 72, C.KREM) + AU.yaz('ÖLÇÜYORSUN?', 0, 80, 72, C.ALTA), 540, 440, tt);
  const kart = (x, p, ic, ad, renk) => p > 0 ? grp(AU.panel(-140, -170, 280, 340, renk) + ic + AU.yaz(ad, 0, 140, 34, '#FFFFFF'), x, 760, p, 0) : '';
  o += kart(200, pop(t, 2.2), AU.T_('$', 0, 50, 170, '#FFFFFF'), 'DOLAR', C.MAV);
  o += kart(540, pop(t, 3.0), AU.kulce(0, 40, 1.8), 'ALTIN', '#B8862A');
  o += kart(880, pop(t, 3.8), PR.fis(0, -140, 230, ['EKMEK', 'SÜT', 'PEYNİR', 'ÇAY'], 22), 'MARKET', C.KIR);
  const b = pop(t, 5.0); if (b > 0) o += grp(AU.balon(0, 0, 1) , 540, 1080, b) ;
  o += gubi(t, { x: 260, y: 1700, boy: 220, ust: VEZNEDAR, duygu: 'mutlu', bakHedef: t > 5 ? 'kamera' : [540, 760] });
  o += gufi(t, { x: 800, y: 1770, boy: 260, ust: VATANDAS, duygu: 'mutlu', bakHedef: t > 5 ? 'kamera' : [540, 760] });
  $('dinamik').innerHTML = o;
};"""
