S = {}
# 01 — KANCA: İLK KARE su basmış sokak + araba; üç yer kartı (SOKAK · BODRUM · ARABA); "ÇOĞUMUZ TERSİNİ YAPIYOR"
S[1] = r"""
const kartYer = (x, y, ikon, ad, renk, p) => p <= 0 ? '' : grp(R(-150, -130, 300, 260, 30, '#000', .3) + R(-160, -140, 300, 260, 30, '#FFF8EE') + `<g transform="translate(-10 -40)">${ikon}</g>` + AU.yaz(ad, -10, 90, 40, renk), x, y, p);
window.renderAt = t => {
  const suY = 900 - 30 * E(A(t, 0, 10));
  let w = SE.selSokak(t, suY) + SE.araba(540, 1010 + 6 * Math.sin(t * 1.5), 1.3, { rot: -3 + 2 * Math.sin(t * 1.2) });
  w += R(0, suY + 70, 1080, 1150 - suY - 70, 0, SE.SU, .55);
  let o = kam(w, { y: 900, k: 1.08 - .08 * E(A(t, 0, 2.5)) });
  if (t > 2.4) o += `<rect width="1080" height="1920" fill="#0E1426" opacity="${.45 * A(t, 2.4, 2.8)}"/>`;
  o += kartYer(200, 600, KP.yetiskin(0, 70, .3, { renk: '#3A4664' }), 'SOKAK', '#2A6AB0', pop(t, 2.5));
  o += kartYer(540, 600, `<path d="M-60 40 L-60 -20 L0 -60 L60 -20 L60 40Z" fill="#3A4664"/><rect x="-60" y="40" width="120" height="40" fill="${SE.SU}"/>`, 'BODRUM', '#2A6AB0', pop(t, 3.4));
  o += kartYer(880, 600, `<g transform="translate(0 70)">${SE.araba(0, 0, .45)}</g>`, 'ARABA', '#2A6AB0', pop(t, 4.2));
  if (t > 8.2) { o += grp(AU.cip('ÇOĞUMUZ TAM TERSİNİ YAPIYOR', 0, 0, '#E8323C', '#FFFFFF', 32), 540, 880, pop(t, 8.2)); }
  o += gufi(t, { x: 190, y: 1770, boy: 190, duygu: 'saskin', bakHedef: [540, 600] }) + gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'merak', bakHedef: [540, 600] }) + semsiye(880, 1470, .8);
  $('dinamik').innerHTML = o + bam(t, 8.2, .3);
};"""
# 02 — SOKAKTAYSAN: akan su + insan (15 cm sendeler) → rögar kesiti (gizli → açığa çıkar) → direk + yüksek yer
S[2] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 5.9) {
    o += SE.selSokak(t, 1050, { akis: 1.6 });
    const sen = A(t, 3.0, 5.0), rot = 14 * Math.sin(sen * Math.PI) * (t > 3 ? 1 : 0);
    o += `<g transform="rotate(${rot} 520 1100)">` + KP.yetiskin(520, 1100, .9, { renk: '#C8D4E8', adim: t < 3 ? t * 1.2 : null }) + '</g>';
    o += R(0, 1050, 1080, 100, 0, SE.SU, .55);
    if (t > 2.6) o += SE.olcu(380, 1050, 1110, '15 cm');
    if (t > 1.3) o += grp(AU.cip('AKAN SUYA GİRME', 0, 0, '#E8323C', '#FFFFFF', 34), 540, 560, pop(t, 1.3));
  } else if (t < 10.4) {
    o += zeminK() + SE.rogar(60, 470, 960, 720, t, A(t, 8.3, 8.7));
    if (t < 8.3) o += grp(AU.yaz('?', 0, 0, 160, '#FFFFFF'), 640, 980, pop(t, 6.1) * .8);
    else o += `<circle cx="${60 + 960 * .62}" cy="${470 + 720 * .45 + 140}" r="${170 + 8 * Math.sin(t * 8)}" fill="none" stroke="#E8323C" stroke-width="10"/>` + grp(AU.cip('KAPAĞI KALKMIŞ RÖGAR', 0, 0, '#E8323C', '#FFFFFF', 30), 540, 1250, pop(t, 8.4));
    o += grp(AU.cip('GÖRMEDİĞİN TEHLİKE', 0, 0, '#FFFFFF', '#1B2440', 32), 540, 400, pop(t, 6.0));
  } else {
    o += SE.selSokak(t, 1060) + R(60, 640, 300, 420, 10, '#4A5A7A') + R(40, 620, 340, 40, 8, '#5A6A8A');
    o += SE.direk(820, 1060, 1.0, t);
    const c = pop(t, 10.5); o += KP.yetiskin(200, 640, .55 * (c > 0 ? 1 : 0), { renk: '#C8D4E8' });
    o += grp(AU.cip('↑ YÜKSEĞE ÇIK', 0, 0, '#2FBF71', '#FFFFFF', 32), 220, 560, c);
    o += grp(AU.cip('DİREKTEN UZAK DUR', 0, 0, '#E8A020', '#1B2440', 30), 760, 480, pop(t, 12.6));
    o += grp(AU.cip('ALT GEÇİDE GİRME', 0, 0, '#E8323C', '#FFFFFF', 30), 760, 560, pop(t, 13.4));
  }
  o += baslik(t, 'SOKAKTAYSAN', '#2A6AB0', .2);
  o += gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'kararli', bakHedef: [540, 900] }) + gufi(t, { x: 190, y: 1770, boy: 190, duygu: 'merak', bakHedef: [540, 900] });
  $('dinamik').innerHTML = o + bam(t, 5.9, .25) + bam(t, 10.4, .25);
};"""
# 03 — BODRUMDAYSAN: kesit; su sızar → hemen çık (eşyayı bırak) → kapı önünde su yükselir → AÇILMAZ → sigorta kuru ✓ / ıslak ✕
S[3] = r"""
window.renderAt = t => {
  let o = zeminK();
  const su = .45 * E(A(t, 1.0, 14)), ka = E(A(t, 5.4, 8.0));
  if (t < 9.3) {
    o += SE.bodrum(60, 470, 960, 760, t, su, ka);
    const cik = E(A(t, 1.2, 3.8)); const px = 60 + 960 - 300 + cik * 220 + 40, py = 470 + 760 - 40 - cik * (760 - 760 * .45 - 40);
    o += KP.yetiskin(px - 120 * (1 - cik), py, .42, { renk: '#C8D4E8', adim: t > 1.2 && t < 3.8 ? t * 2 : null });
    o += grp(AU.cip('HEMEN ÇIK', 0, 0, '#2FBF71', '#FFFFFF', 32), 300, 640, pop(t, 1.3));
    if (t > 3.0) o += grp(`<rect x="-60" y="-50" width="120" height="100" rx="10" fill="#C48A50"/><path d="M-70 -60 L70 60 M70 -60 L-70 60" stroke="#E8323C" stroke-width="14"/>` + AU.Tm('EŞYAYI BIRAK', 0, 90, 24, '#FFFFFF'), 300, 1050, pop(t, 3.0));
    if (t > 7.8) o += grp(AU.cip('KAPI AÇILMAYABİLİR', 0, 0, '#E8323C', '#FFFFFF', 30), 760, 560, pop(t, 7.8));
  } else {
    o += SE.bodrum(60, 470, 960, 760, t, su, 1) + `<rect x="60" y="470" width="960" height="760" rx="26" fill="#0E1426" opacity=".7"/>`;
    o += grp(SE.sigorta(0, 0, 1.4, true) + AU.yaz('AYAĞIN KURU', 0, 200, 40, '#BFE8B0'), 300, 820, pop(t, 9.4));
    o += grp(SE.sigorta(0, 0, 1.4, false) + AU.yaz('ISLAK ZEMİN', 0, 200, 40, '#FFB0A8'), 780, 820, pop(t, 12.0));
  }
  o += baslik(t, 'BODRUMDAYSAN', '#2A6AB0', .15);
  o += gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'kararli', bakHedef: [540, 900] }) + gufi(t, { x: 190, y: 1770, boy: 190, duygu: 'merak', bakHedef: [540, 900] });
  $('dinamik').innerHTML = o + bam(t, 9.3, .25);
};"""
# 04 — ARABADAYSAN: su basmış yol → GERİ DÖN; 30 cm araba yüzer; KEMER · CAM · ÇIK kartları
S[4] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 5.5) {
    const suY = 1030; o += SE.selSokak(t, suY, { akis: 1.3 });
    const yuz = E(A(t, 3.0, 5.0)); const ax = 540 - 40 * yuz, ay = 1080 - 40 * yuz;
    o += SE.araba(ax, ay, 1.2, { rot: -8 * yuz + 3 * Math.sin(t * 2) * yuz }) + R(0, suY + 30, 1080, 100, 0, SE.SU, .55);
    if (t > 1.2 && t < 2.9) o += grp(`<path d="M-120 40 L-120 -40 Q-120 -110 -40 -110 L80 -110" stroke="#FFFFFF" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M60 -150 L110 -110 L60 -70Z" fill="#FFFFFF"/>` + AU.cip('GERİ DÖN', 0, 90, '#E8323C', '#FFFFFF', 34), 540, 700, pop(t, 1.2));
    if (t > 2.9) o += SE.olcu(860, suY + 30, suY - 40, '30 cm') + grp(AU.cip('ARABA YÜZER', 0, 0, '#E8323C', '#FFFFFF', 34), 540, 640, pop(t, 3.4));
  } else {
    o += zeminK();
    o += grp(AU.cip('MAHSUR KALIRSAN', 0, 0, '#FFFFFF', '#1B2440', 34), 540, 520, pop(t, 5.6));
    const ik1 = `<path d="M-70 -20 L50 40" stroke="#4A5A7A" stroke-width="22" stroke-linecap="round"/><path d="M-30 -10 l30 30" stroke="#E8323C" stroke-width="10"/>`;
    const ik2 = `<rect x="-70" y="-30" width="120" height="70" rx="8" fill="#BFE0FF"/><path d="M-10 -20 v40 m-14 -14 l14 14 l14 -14" stroke="#1B2440" stroke-width="8" fill="none"/>`;
    const ik3 = `<path d="M-10 40 V-30 m-26 26 l26 -26 l26 26" stroke="#2FBF71" stroke-width="14" fill="none" stroke-linecap="round"/>`;
    [[7.55, 1, 'KEMER', ik1, '#E8A020', 220], [8.5, 2, 'CAM', ik2, '#3E8EDE', 545], [9.3, 3, 'ÇIK', ik3, '#2FBF71', 870]].forEach(([t0, n, b, ik, r, x]) => { const p = pop(t, t0); if (p > 0) o += SE.adim(x, 850, n, b, ik, r, p * .95); });
  }
  o += baslik(t, 'ARABADAYSAN', '#2A6AB0', .2);
  o += gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'kararli', bakHedef: [540, 900] }) + gufi(t, { x: 190, y: 1770, boy: 190, duygu: 'merak', bakHedef: [540, 900] });
  $('dinamik').innerHTML = o + bam(t, 5.5, .25);
};"""
# 05 — 112
S[5] = r"""
window.renderAt = t => {
  let o = AU.zemin('#2A1420', '#140A12');
  o += grp(R(-300, -170, 600, 340, 50, '#E8323C') + AU.yaz('112', 0, 70, 220, '#FFFFFF'), 540, 820, pop(t, .2, .35));
  o += grp(AU.cip('HER DURUMDA', 0, 0, '#FFFFFF', '#1B2440', 34), 540, 560, pop(t, .1));
  o += gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'kararli', bakHedef: [540, 820] }) + gufi(t, { x: 190, y: 1770, boy: 190, duygu: 'kararli', bakHedef: [540, 820] });
  $('dinamik').innerHTML = o + bam(t, 0, .3);
};"""
# 06 — PAYLAŞILABİLİR ÖZET KART + soru
S[6] = r"""
window.renderAt = t => {
  let o = zeminK();
  const p = pop(t, .1);
  let k = R(-450, -430, 900, 860, 40, '#FFF8EE') + R(-450, -430, 900, 110, 40, '#2A6AB0') + R(-450, -360, 900, 40, 0, '#2A6AB0') + AU.yaz('SEL ANINDA', 0, -350, 60, '#FFFFFF');
  const sat = [['SOKAK', 'Akan suya girme · yükseğe çık', 'Direk ve alt geçitten uzak dur'], ['BODRUM', 'Su sızınca hemen çık', 'Islak zeminde sigortaya dokunma'], ['ARABA', 'Su basmış yola girme', 'Mahsur kalırsan: KEMER · CAM · ÇIK']];
  sat.forEach(([b, a1, a2], i) => { const y = -220 + i * 190; k += R(-410, y - 50, 180, 70, 20, '#2A6AB0') + AU.yaz(b, -320, y - 2, 32, '#FFFFFF') + PR.T_(a1, 110, y - 8, 30, '#1B2440', 800) + PR.Tm(a2, 110, y + 36, 22, '#5A6478'); });
  k += R(-200, 310, 400, 90, 45, '#E8323C') + AU.yaz('ACİL: 112', 0, 372, 50, '#FFFFFF');
  o += grp(k, 540, 830, p * .9);
  o += grp(AU.cip('SEVDİĞİN BİRİNE GÖNDER', 0, 0, '#2FBF71', '#FFFFFF', 30), 540, 360, pop(t, .2));
  if (t > 2.1) o += grp(M.balon(0, 0, AU.yaz('SEN HİÇ SELDE KALDIN MI?', 0, 14, 32, '#1B1640'), { w: 560, h: 110, yon: 1 }), 600, 1520, pop(t, 2.1));
  o += gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: 'kamera' }) + gufi(t, { x: 170, y: 1790, boy: 170, duygu: 'merak', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
# 07 — TAKİP ET kartı
S[7] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#0E1626"/><circle cx="540" cy="760" r="520" fill="#3E8EDE" opacity=".14"/>`;
window.renderAt = t => {
  let o = '';
  const p = pop(t, .3);
  if (p > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#3E8EDE" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#3E8EDE') + AU.yaz('+ TAKİP ET', 0, 98, 46, '#FFFFFF'), 540, 760, p);
  o += gubi(t, { x: 300, y: 1560, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1770, boy: 230, duygu: 'mutlu', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
