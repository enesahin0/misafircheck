S = {}
# 01 — KANCA: tek köpek silüeti → BAM ikiye yarılır: sol soğuk "KÂBUS" (tehdit + geri çekilen çocuk), sağ sıcak "AİLE" (dost + diz çöken yetişkin)
S[1] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 1.3) {
    o += `<rect width="1080" height="1920" fill="#0A0E1C"/><ellipse cx="540" cy="1150" rx="380" ry="60" fill="#FFFFFF" opacity=".08"/>` + K.glow({ x: 540, y: 900, r: 520, renk: '#8AA0D8', guc: .25 });
    o += KP.kopek(470, 1150, 1.5, { t, karanlik: .55 });
    o = kam(o, { y: 1000, k: 1 + .06 * t });
  } else {
    const sag = t > 3.2, q = E(A(t, 1.3, 1.6));
    let L = AU.zemin('#22345E', '#0E1830') + K.glow({ x: 300, y: 1000, r: 420, renk: '#3E6FD8', guc: .25 });
    L += KP.kopek(360 - 20 * q, 1170, 1.15, { yon: -1, mod: 'tehdit', t, karanlik: .6 });
    L += KP.cocuk(105 - 30 * E(A(t, 1.5, 2.6)), 1170, 1.15, { renk: '#C8D8EE', canta: '#5A6A9A', adim: t < 2.6 ? t * 1.5 : null, yon: 1 });
    L += grp(AU.cip('KÂBUS', 0, 0, KC.MAVI, '#FFFFFF', 44), 270, 520, pop(t, 1.5));
    let Rr = sag ? AU.zemin('#FFB25E', '#E0702E') + K.glow({ x: 780, y: 1000, r: 420, renk: '#FFE08A', guc: .35 }) : `<rect width="1080" height="1920" fill="#06080F"/>`;
    Rr += KP.kopek(720 + 20 * q, 1170, 1.15, { yon: 1, mod: sag ? 'dost' : 'notr', t, karanlik: sag ? 0 : .95 });
    if (sag) { Rr += KP.yetiskin(1000, 1160, .62, { renk: '#5A2A1E', poz: 'diz', yon: -1 }); Rr += grp(AU.cip('AİLE', 0, 0, KC.TURU, '#FFFFFF', 44), 810, 520, pop(t, 3.3));
      for (let i = 0; i < 3; i++) { const a = A(t, 3.6 + i * .3, 4.8 + i * .3); if (a > 0 && a < 1) Rr += KP.kalp(860 + i * 30, 980 - a * 200, .22, '#E8505B').replace('<g ', `<g opacity="${1 - a}" `); } }
    o += klip(L, 0, 0, 540, 1920) + klip(Rr, 540, 0, 540, 1920);
    o += `<path d="M540 0 V1920" stroke="#FFFFFF" stroke-width="8"/>`;
    o = kam(o, { y: 1000, k: 1 + .22 * (1 - back(A(t, 1.3, 1.75))) });
    o += bam(t, 1.3) + (sag ? bam(t, 3.2) : '');
  }
  $('dinamik').innerHTML = o;
};"""
# 02 — 4 EKİM takvimi (Gufi eski yaprağı koparır) → aşağı tilt → Türkiye haritası çatlayıp ikiye ayrılır → SOKAKTAKİ KÖPEKLER KİMİN?
S[2] = r"""
const MB = H.ciz({ ulkeler: H.ulke('Türkiye'), vurgu: { 'Türkiye': '#4A78C8' }, kutu: [70, 2160, 940, 520], proj: 'mercator' }).svg;
const MT = H.ciz({ ulkeler: H.ulke('Türkiye'), vurgu: { 'Türkiye': '#E8843E' }, kutu: [70, 2160, 940, 520], proj: 'mercator' }).svg;
window.renderAt = t => {
  let o = AU.zemin('#16224A', '#0B1433');
  for (let i = 0; i < 18; i++) o += KP.pati(80 + h(i) * 920, 200 + h(i + 4) * 3400, 1 + h(i + 2), h(i + 7) * 60 - 30, '#FFFFFF', .06);
  // takvim
  const tk = pop(t, 0, .4);
  o += grp(KP.takvim(0, 0, .95, '4', 'EKİM', E(A(t, .25, 1.0))), 560, 700, tk);
  o += AU.yaz('DÜNYA HAYVANLARI', 540, 1110, 64, '#FFFFFF', 900, `opacity="${A(t, .3, .6)}"`) + AU.yaz('KORUMA GÜNÜ', 540, 1190, 64, C.ALTA, 900, `opacity="${A(t, .5, .8)}"`);
  o += gufi(t, { x: 150, y: 960, boy: 170, duygu: 'mutlu', isaretHedef: t < .9 ? [360, 620] : null, bakHedef: [560, 700] });
  // harita (dünya y + 1500)
  const ay = E(A(t, 3.4, 5.0));
  o += klip(`<g transform="translate(${-34 * ay} 0)">${MB}</g>`, 0, 1900, 540, 1000) + klip(`<g transform="translate(${34 * ay} 0)">${MT}</g>`, 540, 1900, 540, 1000);
  if (t > 3.3) { const d = KP.catlakYol(540, 2120 - 20, 2120 + 600 * A(t, 3.3, 3.8), 26 + 30 * ay, 14); o += `<path d="${d}" stroke="#0B1433" stroke-width="${10 + 40 * ay}" fill="none" stroke-linejoin="round"/>`; }
  o += grp(AU.yaz('?', 0, 90, 300, '#FFFFFF'), 540, 2380, pop(t, 6.1) * .9);
  o += grp(AU.cip('SOKAKTAKİ KÖPEKLER KİMİN?', 0, 0, '#FFFFFF', C.LAC, 38), 540, 1960, pop(t, 6.2));
  if (t > 5.9) o += KP.kopek(-120 + 640 * E(A(t, 5.9, 7.9)), 2760, .6, { adim: t * 1.6, t, mod: 'notr' });
  o += gufi(t, { x: 210, y: 3260, boy: 220, duygu: 'uzgun', bakHedef: [850, 3000] }) + gubi(t, { x: 860, y: 3080, boy: 160, ust: GONULLU, duygu: 'uzgun', bakHedef: [210, 3150] });
  $('dinamik').innerHTML = kam(o, { dy: -1500 * E(A(t, 2.8, 3.7)) });
};"""
# 03 — GÜVENLİK: soğuk sabah, okul yolu; Gufi (veli) çocuğun elini tutar, köşedeki sürüyü gözler → BAM kartları (ısırılan çocuk / saldırıya uğrayan yaşlı) → kalkan
S[3] = r"""
window.renderAt = t => {
  const sh = Math.sin(t * 1.7) * 7 + Math.sin(t * 3.1) * 4, sv = Math.cos(t * 2.3) * 5;
  let o = KP.sokak(0, { ofs: t * 20, ufuk: 1020 });
  o += R(800, 640, 280, 380, 8, '#D8DEE8') + R(780, 610, 320, 50, 8, '#B04040') + AU.yaz('OKUL', 940, 720, 44, '#B04040') + R(880, 860, 120, 160, 6, '#3A4466') + R(830, 760, 60, 60, 4, '#A8C0E8') + R(990, 760, 60, 60, 4, '#A8C0E8');
  o += KP.lamba(300, 1230, 1, '#22305A');
  [[60, .55, 'kara'], [175, .6, 'sari'], [110, .5, 'benek']].forEach(([x, s, r], i) => o += KP.kopek(x, 1225 + i * 6, s, { renk: r, t: t + i, karanlik: .35, kupe: true }));
  const yol = 520 + 60 * E(A(t, 0, 3.6));
  o += KP.cocuk(yol + 230, 1235, .8, { renk: '#22305A', canta: '#F2B630', adim: t < 3.6 ? t * 1.4 : null });
  o += gufi(t, { x: yol, y: 1235, boy: 210, ust: VELI, duygu: 'uzgun', isaretHedef: [yol + 200, 1120], bakHedef: t > 1.8 ? [150, 1150] : [yol + 120, 1080] });
  o = kam(o, { k: 1.05, dx: sh, dy: sv });
  o += grp(AU.cip('BİR TARAF', 0, 0, KC.MAVI, '#FFFFFF', 36), 540, 400, pop(t, .3));
  const b = pop(t, 1.5); if (b > 0 && t < 3.65) o += KP.balonYaz(540, 620, ['“Çocuğum okula', 'korkarak gidiyor.”'], { fs: 50, sc: b, kx: 60 });
  // BAM kartları
  if (t >= 3.65 && t < 7.0) {
    const ikinci = t >= 5.0; o += `<rect width="1080" height="1920" fill="#0B1433" opacity=".55"/>`;
    let k = KP.kart(540, 820, 860, 640, { renk: '#1A2A4E', kenar: KC.MAVI });
    if (!ikinci) k += KP.cocuk(360, 1060, 1.45, { renk: '#C8D8EE', canta: '#5A6A9A', sargi: true, yon: 1 }) + KP.kopek(700, 1060, 1.15, { yon: -1, mod: 'tehdit', t, karanlik: .8 }) + AU.yaz('ISIRILAN ÇOCUKLAR', 540, 620, 56, '#FFFFFF');
    else { k += KP.yasli(340, 1060, 1.2, { renk: '#C8D8EE' }) + KP.kopek(720, 1060, 1.15, { yon: -1, mod: 'tehdit', t, karanlik: .8 }) + AU.yaz('SALDIRIYA UĞRAYAN YAŞLILAR', 540, 620, 46, '#FFFFFF');
      for (let i = 0; i < 3; i++) k += `<path d="M${560 - i * 26} ${880 - i * 30} q-20 30 0 60" stroke="#FFD34A" stroke-width="7" fill="none" stroke-linecap="round" opacity="${.5 + .5 * Math.sin(t * 20 + i)}"/>`; }
    const p = pop(t, ikinci ? 5.0 : 3.65, .3); o += olc(k, 540, 820, .8 + .2 * p) + bam(t, ikinci ? 5.0 : 3.65);
  }
  if (t >= 7.0) { o += `<rect width="1080" height="1920" fill="#0B1433" opacity="${.5 * A(t, 7.0, 7.3)}"/>` + grp(KP.kalkan(0, 0, 1.6), 540, 740, pop(t, 7.0)) + grp(AU.cip('MESELE: GÜVENLİK', 0, 0, KC.MAVI, '#FFFFFF', 46), 540, 1060, pop(t, 7.3)); }
  $('dinamik').innerHTML = o;
};"""
# 04 — VİCDAN: sıcak sabah; Gubi mama kabı koyar, köpek gelir yer → kışın kulübe çakılır (çekiç ritmi) → yetişkin, sargılı köpeği kucağında veterinere taşır → kalp
S[4] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 4.4) {
    o += KP.sokak(1, { ofs: 300 + t * 14, ufuk: 1020 });
    o += KP.lamba(820, 1230, 1, '#5A2A1E');
    if (t > 2.87) o += KP.mamaKabi(440, 1232, 1.0, 1 - .4 * A(t, 3.9, 4.4));
    const kx = 1200 - 600 * E(A(t, 2.9, 3.85)), yer = A(t, 3.8, 4.1);
    if (t > 2.9) o += KP.kopek(kx, 1235, .9, { yon: -1, mod: 'dost', t, adim: t < 3.85 ? t * 1.8 : null, bas: yer });
    o += gubi(t, { yol: [[0, 300, 860, 150], [2.6, 300, 860, 150], [3.0, 330, 1000, 150]], x: 300, y: 860, boy: 150, ust: GONULLU, duygu: 'mutlu', bakHedef: t > 2.9 ? [kx - 90, 1130] : [540, 640] });
    o = kam(o, { k: 1.04, dx: -20 + 30 * t / 4.4 });
    o += grp(AU.cip('DİĞER TARAF', 0, 0, KC.TURU, '#FFFFFF', 36), 540, 400, pop(t, .25));
    const b = pop(t, 1.65); if (b > 0) o += KP.balonYaz(560, 620, ['“Onlar da can.”'], { fs: 56, sc: b, op: 1 - A(t, 2.8, 3.1), kx: -80 });
  } else if (t < 6.0) {
    o += KP.sokak(.15, { ofs: 900, ufuk: 1020, kar: 1, t });
    o += R(0, 1100, 1080, 820, 0, '#EEF2F8', .9);
    const p = A(t, 4.4, 5.9); o += KP.kulube(520, 1235, 1.05, p, 1);
    const vur = Math.abs(Math.sin((t - 4.4) * Math.PI / .38)); o += KP.cekic(720, 1020, 1.2, -30 + 50 * vur);
    o += `<path d="M720 1020 Q760 960 800 940" stroke="#FFD27A" stroke-width="4" stroke-dasharray="6 10" fill="none" opacity=".8"/>`;
    o += gubi(t, { x: 830, y: 920, boy: 140, ust: GONULLU, duygu: 'kararli', bakHedef: [520, 1150] });
    o += KP.kopek(210, 1240, .7, { mod: 'dost', t, renk: 'kara' });
    o = kam(o, { k: 1.06 - .04 * A(t, 4.4, 6.0), dx: 10 });
    o += grp(AU.cip('KIŞIN KULÜBE', 0, 0, KC.TURU, '#FFFFFF', 34), 540, 400, pop(t, 4.45));
  } else {
    o += KP.sokak(1, { ofs: 600 + (t - 6) * 60, ufuk: 1020 });
    o += KP.vetKapi(860, 1235, .85, E(A(t, 7.4, 8.0)));
    const yx = 100 + 520 * E(A(t, 6.0, 8.6));
    const kucak = `<g transform="translate(30 -260) scale(.55)">${KP.kopek(0, 0, 1, { mod: 'notr', t, sargi: true, golge: false })}</g>`;
    o += KP.yetiskin(yx, 1235, .8, { renk: '#5A2A1E', adim: t < 8.6 ? t * 1.5 : null, kucak });
    o += gubi(t, { yol: [[6.0, 720, 860, 140], [7.3, 820, 900, 140]], x: 720, y: 860, boy: 140, ust: GONULLU, duygu: 'mutlu', bakHedef: [yx, 1000] });
    o = kam(o, { k: 1.03, dx: 30 - 60 * A(t, 6, 10.8) });
    o += grp(AU.cip('VETERİNERE', 0, 0, KC.TURU, '#FFFFFF', 34), 540, 400, pop(t, 6.05));
    if (t >= 9.0) o += `<rect width="1080" height="1920" fill="#4A1A08" opacity="${.45 * A(t, 9.0, 9.3)}"/>` + grp(KP.kalp(0, 0, 1.5), 540, 740, pop(t, 9.0)) + grp(AU.cip('MESELE: VİCDAN', 0, 0, KC.TURU, '#FFFFFF', 46), 540, 1060, pop(t, 9.3));
  }
  o += bam(t, 4.4) + bam(t, 6.0);
  $('dinamik').innerHTML = o;
};"""
# 05 — YASA: üstten masa; Resmî Gazete düşer → köşeye iğnelenir → üç madde kartı çakılır (TOPLA→BARINAK · ÖTANAZİ YOLU · SON TARİH 2028 sayacı)
S[5] = r"""
const barinak = (x, y) => `<g transform="translate(${x} ${y})">` + `<path d="M-50 -10 L0 -50 L50 -10Z" fill="#8A3A2A"/>` + R(-40, -10, 80, 50, 4, '#C48A50') + R(-12, 10, 24, 30, 4, '#2A1A10') + [-60, -48, 48, 60].map(fx => R(fx - 3, 4, 6, 36, 3, '#5A6070')).join('') + R(-64, 14, 128, 5, 2, '#5A6070') + '</g>';
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#8A5A3A"/>`;
  for (let i = 0; i < 26; i++) o += R(0, i * 76 + (h(i) * 20), 1080, 4 + h(i + 3) * 4, 2, '#6A4028', .5);
  const d = A(t, .3, .7), kucul = E(A(t, 2.5, 3.0));
  const gx = 540 + (215 - 540) * kucul, gy = 830 + (560 - 830) * kucul, gs = (1.3 - .45 * E(d)) * (1 - .55 * kucul), gr = -3 - 6 * kucul;
  if (t > .3) o += KP.gazete(gx, gy, gs, gr) + (kucul > .9 ? `<circle cx="${gx}" cy="${gy - 200}" r="14" fill="#E8505B"/>` : '');
  if (d > .95 && d < 1 || A(t, .7, .9) > 0 && A(t, .7, .9) < 1) o += `<ellipse cx="540" cy="830" rx="${400 + 200 * A(t, .7, 1)}" ry="${520 + 200 * A(t, .7, 1)}" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="${1 - A(t, .7, 1)}"/>`;
  const KY = [790, 975, 1160];
  const k1 = pop(t, 2.85, .35); if (k1 > 0) o += olc(KP.kart(560, KY[0], 860, 150, { renk: '#FBF7EC', kenar: '#3E6FD8' }) + KP.pati(220, KY[0], .9, 0, '#3A3A3A', .85) + `<path d="M270 ${KY[0]} h50 l-14 -12 m14 12 l-14 12" stroke="#3A3A3A" stroke-width="6" fill="none"/>` + barinak(380, KY[0]) + AU.yaz('TOPLA → BARINAK', 690, KY[0] + 16, 46, '#1A1A1A'), 560, KY[0], 1.6 - .6 * k1);
  const k2 = pop(t, 6.9, .35); if (k2 > 0) o += olc(KP.kart(560, KY[1], 860, 150, { renk: '#FBF7EC', kenar: '#6A6A7A' }) + `<path d="M220 ${KY[1] - 40} L265 ${KY[1] + 38} L175 ${KY[1] + 38}Z" fill="#F2B630"/>` + AU.yaz('!', 220, KY[1] + 30, 52, '#1A1A1A') + AU.yaz('SALDIRGAN / TEDAVİSİ YOK', 600, KY[1] - 6, 34, '#1A1A1A') + AU.yaz('→ ÖTANAZİ YOLU', 600, KY[1] + 42, 38, '#8A1C1C'), 560, KY[1], 1.6 - .6 * k2);
  const k3 = pop(t, 11.6, .35);
  if (k3 > 0) { const yil = 2024 + Math.min(4, Math.floor(A(t, 12.0, 13.6) * 4.999)); const bit = yil === 2028;
    o += olc(KP.kart(560, KY[2], 860, 150, { renk: bit ? '#FFF0E8' : '#FBF7EC', kenar: bit ? '#E8505B' : '#3E6FD8' }) + `<circle cx="220" cy="${KY[2]}" r="46" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="6"/><path d="M220 ${KY[2]} L220 ${KY[2] - 30} M220 ${KY[2]} L${220 + 26 * Math.cos(t * 6)} ${KY[2] + 26 * Math.sin(t * 6)}" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round"/>` +
      AU.yaz('BARINAK SON TARİH', 530, KY[2] + 14, 34, '#1A1A1A') + AU.yaz(String(yil), 830, KY[2] + 26, 76, bit ? '#E8505B' : '#1A1A1A'), 560, KY[2], 1.6 - .6 * k3); }
  o += grp(AU.cip('2024 · YASA DEĞİŞTİ', 0, 0, '#FFFFFF', C.LAC, 34), 640, 400, pop(t, .4) * (1 - A(t, 2.4, 2.6)));
  o += gufi(t, { x: 230, y: 1770, boy: 220, ust: VELI, duygu: 'merak', bakHedef: [560, t > 11.6 ? KY[2] : t > 6.9 ? KY[1] : KY[0]] });
  o += gubi(t, { x: 860, y: 1600, boy: 160, ust: GONULLU, duygu: t > 6.9 && t < 11 ? 'uzgun' : 'merak', bakHedef: [560, t > 11.6 ? KY[2] : t > 6.9 ? KY[1] : KY[0]] });
  const odak = t < 2.8 ? 0 : t < 6.9 ? 1 : t < 11.6 ? 2 : 3;
  $('dinamik').innerHTML = kam(o, { y: 980, k: 1 + .015 * odak + .01 * Math.sin(t * .8) }) + (t > .3 && t < .5 ? `<rect width="1080" height="1920" fill="#000" opacity="${.25 * (1 - A(t, .3, .5))}"/>` : '');
};"""
# 06 — İKİ TEPKİ: bölünmüş ekran, eşit boy/süre. Sol mavi: Gufi rahatlamış "GEÇ BİLE KALINDI"; sağ turuncu: Gubi gözleri dolu "BU ONLARIN SONU OLUR"
S[6] = r"""
window.renderAt = t => {
  const z = 1 + .06 * E(A(t, 0, 5.75));
  let L = AU.zemin('#2A4A8E', '#14244A') + KP.kalkan(270, 1000, .5, '#5A86E8');
  L += KP.balonYaz(270, 620, ['“GEÇ BİLE', 'KALINDI”'], { fs: 54, sc: pop(t, .2), kx: -40 });
  L += gufi(t, { x: 270, y: 1260, boy: 240, ust: VELI, duygu: 'kararli', bakHedef: 'kamera' });
  const on = t > 2.8;
  let Rr = on ? AU.zemin('#E8843E', '#8A3A14') + KP.kalp(810, 1000, .4, '#FFB27A') : `<rect width="1080" height="1920" fill="#120A06"/>`;
  if (on) Rr += KP.balonYaz(810, 620, ['“BU ONLARIN', 'SONU OLUR”'], { fs: 50, sc: pop(t, 3.8), kx: 40 }) + gubi(t, { x: 810, y: 1120, boy: 180, ust: GONULLU, duygu: 'aglamakli', bakHedef: 'kamera' });
  let o = klip(olc(L, 270, 900, z), 0, 0, 540, 1920) + klip(olc(Rr, 810, 900, z), 540, 0, 540, 1920) + `<path d="M540 0 V1920" stroke="#FFFFFF" stroke-width="8"/>`;
  o += grp(AU.cip('BİR TARAF', 0, 0, '#FFFFFF', KC.MAVIK, 30), 270, 400, pop(t, .1)) + (on ? grp(AU.cip('DİĞER TARAF', 0, 0, '#FFFFFF', KC.TURUK, 30), 810, 400, pop(t, 2.8)) : '');
  o += bam(t, 0) + bam(t, 2.8);
  $('dinamik').innerHTML = o;
};"""
# 07 — AYNI SOKAK: bölme çizgisi kayar; tek köpek ortada döner (yörünge); sol mavi göz "TEHLİKE", sağ turuncu göz "DOST"
S[7] = r"""
window.renderAt = t => {
  const th = E(A(t, .3, 4.95)) * Math.PI * 2;
  let o = KP.sokak(.5, { ofs: th * 260, ufuk: 1020 });
  o += `<ellipse cx="540" cy="1215" rx="300" ry="54" fill="#000" opacity=".15"/><ellipse cx="540" cy="1215" rx="300" ry="54" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="18 16" stroke-dashoffset="${-th * 120}" opacity=".6"/>`;
  const c = Math.cos(th), yon = c >= 0 ? 1 : -1, sx = Math.max(.12, Math.abs(c));
  o += `<g transform="translate(540 0) scale(${sx} 1) translate(-540 0)">` + KP.kopek(540 - 20 * yon, 1215, 1.35, { yon, t, mod: 'notr' }) + '</g>';
  const a = pop(t, 2.65), b = pop(t, 4.1);
  if (a > 0) o += grp(KP.goz(0, 0, 1, '#C8D8FF') + AU.cip('TEHLİKE', 0, 110, KC.MAVI, '#FFFFFF', 36), 200, 560, a) + `<path d="M260 680 Q360 820 430 930" stroke="${KC.MAVI}" stroke-width="10" fill="none" stroke-dasharray="20 14" opacity="${a}"/>`;
  if (b > 0) o += grp(KP.goz(0, 0, 1, '#FFE0C0') + AU.cip('DOST', 0, 110, KC.TURU, '#FFFFFF', 36), 880, 560, b) + `<path d="M820 680 Q720 820 650 930" stroke="${KC.TURU}" stroke-width="10" fill="none" stroke-dasharray="20 14" opacity="${b}"/>`;
  o += grp(AU.cip(t < 1.4 ? 'AYNI SOKAK' : 'AYNI KÖPEK', 0, 0, '#FFFFFF', C.LAC, 36), 540, 400, pop(t, .25) * (1 - A(t, 2.5, 2.7)));
  o += gufi(t, { x: 200, y: 1760, boy: 220, ust: VELI, duygu: 'merak', bakHedef: [540, 1100], isaretHedef: [460, 1080] });
  o += gubi(t, { x: 880, y: 1590, boy: 160, ust: GONULLU, duygu: 'merak', bakHedef: [540, 1100], isaretHedef: [620, 1080] });
  // açılış: önceki bölme çizgisi sola kayıp kaybolur
  const s = E(A(t, 0, .45)); if (s < 1) o += `<rect x="0" y="0" width="${540 * (1 - s)}" height="1920" fill="#14244A" opacity="${.7 * (1 - s)}"/><rect x="${540 + 540 * s}" y="0" width="${540 * (1 - s)}" height="1920" fill="#8A3A14" opacity="${.7 * (1 - s)}"/><path d="M${540 - 540 * s} 0 V1920" stroke="#FFFFFF" stroke-width="8"/>`;
  $('dinamik').innerHTML = o;
};"""
# 08 — ORTAK NOKTA: iki renk alanı yaklaşır, çatlak kapanır; Gubi & Gufi ortada yan yana; iki etiket tek kartta birleşir
S[8] = r"""
window.renderAt = t => {
  const yak = E(A(t, 1.2, 3.6));
  const sol = KP.mix('#2A4A8E', '#2E6A58', yak), sag = KP.mix('#C2551E', '#2E6A58', yak);
  let o = R(0, 0, 540, 1920, 0, sol) + R(540, 0, 540, 1920, 0, sag);
  for (let i = 0; i < 16; i++) o += KP.pati(80 + h(i) * 920, 240 + h(i + 4) * 1500, 1 + h(i + 2), h(i + 7) * 60 - 30, '#FFFFFF', .07);
  const gen = 60 * (1 - yak); if (gen > 1) o += `<path d="${KP.catlakYol(540, 0, 1920, gen, 16)}" stroke="#0B1433" stroke-width="${8 + 34 * (1 - yak)}" fill="none" stroke-linejoin="round"/>`;
  o += grp(AU.cip('AMA DİKKAT ET', 0, 0, '#FFFFFF', C.LAC, 34), 540, 400, pop(t, .2) * (1 - A(t, 1.1, 1.3)));
  o += grp(AU.cip('İKİ TARAF DA AYNI ŞEYİ İSTİYOR', 0, 0, '#FFFFFF', C.LAC, 30), 540, 400, pop(t, 1.3));
  const birles = E(A(t, 6.2, 6.8));
  if (birles > 0) o += KP.kart(540, 860, 920, 440, { renk: '#FFF3D6', kenar: C.YES, op: birles });
  const a = E(A(t, 4.0, 4.5)), b = E(A(t, 5.5, 6.0));
  if (a > 0) o += `<g transform="translate(${-900 * (1 - a)} 0)">` + (birles < 1 ? KP.kart(540, 760, 880, 150, { renk: '#DCE6FF', op: 1 - birles }) : '') + KP.kalkan(170, 760, .5) + AU.yaz('KİMSE ISIRILMASIN', 580, 778, 54, KC.MAVIK) + '</g>';
  if (b > 0) o += `<g transform="translate(${900 * (1 - b)} 0)">` + (birles < 1 ? KP.kart(540, 960, 880, 150, { renk: '#FFE6D2', op: 1 - birles }) : '') + KP.kalp(170, 960, .42) + AU.yaz('KİMSE ACI ÇEKMESİN', 585, 978, 52, KC.TURUK) + '</g>';
  o += gufi(t, { yol: [[0, 180, 1770, 220], [1.4, 180, 1770, 220], [3.4, 420, 1770, 220]], x: 180, y: 1770, boy: 220, ust: VELI, duygu: 'merak', bakHedef: t > 3.4 ? [660, 1600] : [540, 860] });
  o += gubi(t, { yol: [[0, 900, 1590, 160], [1.4, 900, 1590, 160], [3.4, 660, 1590, 160]], x: 900, y: 1590, boy: 160, ust: GONULLU, duygu: 'merak', bakHedef: t > 3.4 ? [420, 1650] : [540, 860] });
  $('dinamik').innerHTML = kam(o, { y: 960, k: 1.12 - .12 * E(A(t, 0, 7.05)) });
};"""
# 09 — SEN HANGİ TARAFTASIN? iki seçenek (kalkan / kalp) → yorum balonu → kulaklar "ÖNCE DİNLE" (iki ikon birbirine eğilir)
S[9] = r"""
window.renderAt = t => {
  let o = AU.zemin('#16224A', '#0B1433');
  for (let i = 0; i < 16; i++) o += KP.pati(80 + h(i) * 920, 240 + h(i + 4) * 1500, 1 + h(i + 2), h(i + 7) * 60 - 30, '#FFFFFF', .05);
  const p = pop(t, .2);
  o += grp(AU.yaz('SEN HANGİ', 0, 0, 92, '#FFFFFF') + AU.yaz('TARAFTASIN?', 0, 100, 92, C.ALTA), 540, 520, p);
  const egil = 14 * E(A(t, 3.9, 4.8));
  o += grp(KP.kalkan(0, 0, .9) + AU.yaz('GÜVENLİK', 0, 170, 40, '#C8D8FF'), 320, 870, pop(t, .5), egil);
  o += grp(KP.kalp(0, 0, .85) + AU.yaz('VİCDAN', 0, 170, 40, '#FFD2B0'), 760, 870, pop(t, .65), -egil);
  const yb = pop(t, 1.75); if (yb > 0 && t < 2.95) o += grp(AU.balon(0, 0, .7) + AU.yaz('YORUMLARA YAZ', 0, 150, 34, '#FFFFFF'), 540, 1120, yb);
  const d = pop(t, 2.9); if (d > 0) o += grp(KP.kulak(-330, 0, .7, '#FFF3D6', -1) + KP.kulak(330, 0, .7, '#FFF3D6', 1) + AU.cip('ÖNCE DİNLE', 0, 10, C.YES, '#FFFFFF', 44), 540, 1150, d);
  o += gufi(t, { x: 230, y: 1770, boy: 220, ust: VELI, duygu: 'merak', bakHedef: 'kamera' });
  o += gubi(t, { x: 850, y: 1600, boy: 160, ust: GONULLU, duygu: 'merak', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
# 10 — TAKİP ET kartı (Gubi + köpek + Gufi)
S[10] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#0E1626"/><circle cx="540" cy="760" r="520" fill="#2FBF71" opacity=".12"/>`;
window.renderAt = t => {
  let o = '';
  const p = pop(t, .3);
  if (p > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#2FBF71" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#2FBF71') + AU.yaz('+ TAKİP ET', 0, 98, 46, '#0B1433'), 540, 760, p);
  o += gubi(t, { x: 260, y: 1560, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' });
  o += KP.kopek(520, 1770, .75, { mod: 'dost', t });
  o += gufi(t, { x: 830, y: 1770, boy: 230, duygu: 'mutlu', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
