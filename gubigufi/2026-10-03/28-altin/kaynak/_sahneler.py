S = {}
# 01 — KANCA: Gufi'nin yüzüğü; kamera halkanın içine dalar → uzay (match cut)
S[1] = r"""
window.renderAt = t => {
  let o = AU.zemin('#3A2A12', '#140C06');
  o += `<circle cx="540" cy="760" r="460" fill="${G.A}" opacity=".08"/>`;
  const cid = 'yk1'; o += `<defs><clipPath id="${cid}"><circle cx="540" cy="760" r="152"/></clipPath></defs><g clip-path="url(#${cid})" opacity="${.35 + .65 * A(t, 1.6, 2.6)}">` + AL.uzay(t) + AL.notron(500, 730, 14) + AL.notron(590, 790, 12) + '</g>';
  o += AL.yuzuk(540, 760, 170, t);
  o += gufi(t, { x: 790, y: 1730, boy: 290, duygu: 'mutlu', ust: KASIF, isaretHedef: [620, 820], bakHedef: [540, 760] });
  o += gubi(t, { x: 250, y: 1660, boy: 210, duygu: 'merak', ust: BILGE, bakHedef: [540, 760] });
  const k = 1 + 4.2 * Math.pow(A(t, 1.9, 2.96), 2.2);
  $('dinamik').innerHTML = kam(o, { y: 760, k });
};"""
# 02 — UZAY: iki nötron yıldızı döner, çarpışır (kilonova), Au saçılır; Gufi kavanozla toplar; 2017
S[2] = r"""
window.renderAt = t => {
  let o = AL.uzay(t + 3);
  const cx = 540, cy = 760, tc = 4.4;
  if (t < tc) { const q = A(t, 0, tc), r = 260 * Math.pow(1 - q, .6) + 6, a = 2 * Math.PI * (q * 3.2 + Math.pow(q, 6) * 4);
    o += AL.dalgalar(cx, cy, t, '#9ACCFF') + `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * .55}" fill="none" stroke="#9ACCFF" stroke-width="2" opacity=".25"/>`;
    o += AL.notron(cx + Math.cos(a) * r, cy + Math.sin(a) * r * .55, 34) + AL.notron(cx - Math.cos(a) * r, cy - Math.sin(a) * r * .55, 30);
    const c = pop(t, .3); if (c > 0) o += grp(AU.cip('2 NÖTRON YILDIZI', 0, 0, '#BFE8FF', C.LAC, 32), 540, 420, c); }
  o += AL.kilonova(cx, cy, t - tc);
  const s = pop(t, 6.25); if (s > 0) o += grp(AU.panel(-330, -70, 660, 140, C.LAC) + AU.yaz('2017 · İLK KEZ GÖZLENDİ', 0, 16, 44, C.ALTA), 540, 420, s);
  const dol = A(t, 5.0, 8.5);
  const gx = 800 + 30 * Math.sin(t * 1.2), gy = 1190 + 20 * Math.sin(t * 1.7), bx = 250 + 20 * Math.sin(t * 1.4 + 1), by = 1150 + 24 * Math.sin(t * 1.1);
  const AB = astro('gubi', t, { x: bx, y: by + 40, r: 82, duygu: t > tc ? 'sasir' : 'merak', bakHedef: [cx, cy], kolSol: 210, kolSag: -40 });
  const AF = astro('gufi', t, { x: gx, y: gy + 40, r: 92, duygu: t > 5 ? 'mutlu' : 'merak', bakHedef: [cx, cy], kolSol: 225, kolSag: 20 });
  o += AB.svg + AF.svg + AL.kavanoz(AF.sol[0], AF.sol[1] + 10, 1.0, dol);
  if (t > tc + .6) for (let i = 0; i < 6; i++) { const p = ((t - tc) * .8 + i / 6) % 1; o += `<circle cx="${cx + (AF.sol[0] - cx) * p}" cy="${cy + (AF.sol[1] - 60 - cy) * p}" r="7" fill="${G.AA}" opacity="${1 - p * .5}"/>`; }
  $('dinamik').innerHTML = `<g transform="rotate(${-4 + 8 * A(t, 0, 9.9)} 540 900)">` + o + '</g>';
};"""
# 03 — GÖKTAŞI YAĞMURU: genç Dünya; altınlı göktaşları; Gufi şemsiyeyle koşar; kamera aşağı iner
S[3] = r"""
window.renderAt = t => {
  let w = AL.uzay(t + 13, { ust: '#140A20', alt: '#3A1A2A' });
  for (let i = 0; i < 14; i++) { const p = ((t * .55 + h(i)) % 1), x = 1200 - p * 1400 + h(i + 9) * 600 - 200, y = -200 + p * 1350; w += AL.gokTasi(x, y, .7 + h(i + 3) * .7, 40); if (p > .9) w += AL.parilti(x, y + 30, 40 * (1 - (p - .9) * 10), .9); }
  w += AL.gencDunya(540, 2250, 1260, t);
  const c = pop(t, .4); if (c > 0) w += grp(AU.cip('MİLYARLARCA YIL ÖNCE', 0, 0, '#FFB45C', C.LAC, 32), 540, 420, c);
  const gx = 160 + 760 * E(A(t, .6, 5.0)), gy = 1000;
  const AF = astro('gufi', t, { x: gx, y: gy, r: 70, duygu: 'korku', kolSol: 210, kolSag: -80 });
  w += AF.svg + AL.semsiye(AF.sag[0], AF.sag[1] - 110, .9, '#4A8AD8');
  for (let i = 0; i < 4; i++) { const d = t - (1.2 + i * .9); if (d > 0 && d < .5) w += AL.parilti(AF.sag[0] + (i % 2 ? 50 : -50), AF.sag[1] - 220 + d * 60, 26, 1 - d * 2); }
  w += astro('gubi', t, { x: 820, y: 760 + 20 * Math.sin(t * 2), r: 64, duygu: 'sasir', bakHedef: [gx, gy], kolSol: 160, kolSag: -30 }).svg;
  $('dinamik').innerHTML = kam(w, { dy: -260 * (1 - E(A(t, 0, 2.2))) });
};"""
# 04 — PASLANMAZ + TEL: toprak kesiti, Gubi arkeolog kazar; demir paslanır, altın parlar; 5000 YIL; Gufi 1 gramdan km'lerce tel çeker (pan)
S[4] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 7.8) {
    o += `<rect width="1080" height="1920" fill="#9ED0F0"/>` + AL.toprak(640);
    const pas = A(t, 4.1, 7.0), yuk = E(A(t, 5.6, 7.4));
    o += AL.civi(340, 1000, 1.3, -12, Math.max(.2, pas)) + AU.cip('DEMİR', 340, 1120, '#8A90A8', '#FFFFFF', 28);
    o += AL.sikke(740, 1010 - 360 * yuk, 70, { parla: .6 + .4 * Math.sin(t * 5) }) + AU.cip('ALTIN', 740, 1120 - 360 * yuk, C.ALT, C.LAC, 28);
    const yil = Math.round(5000 * E(A(t, 4.1, 7.0)));
    if (t > 4.0) o += AU.panel(330, 360, 420, 120, C.LAC) + AU.Tm(yil.toLocaleString('tr-TR') + ' YIL', 540, 440, 54, C.ALTA);
    o += gubi(t, { x: 600, y: 630, boy: 170, duygu: t > 2 ? 'sasir' : 'merak', ust: ARKEOLOG, bakHedef: [740, 1000] }) + AL.firca(700, 660 + 10 * Math.sin(t * 12), 1, 30 + 20 * Math.sin(t * 12));
    o += gufi(t, { x: 200, y: 630, boy: 190, ust: KASIF, bakHedef: [340, 1000] });
    o = kam(o, { y: 1000, k: 1 + .12 * E(A(t, 4.0, 7.8)) });
  } else {
    const d = t - 7.8, L = 2600 * E(A(d, .3, 3.4)), gx = 220 + L;
    let w = `<rect x="-200" width="3600" height="1920" fill="#BFE3F0"/>` + AU.R(-200, 1000, 3600, 920, 0, '#8CC06A') + AU.R(-200, 1000, 3600, 20, 0, '#6AA04A');
    [1, 2].forEach(k => { const x = 220 + k * 1000; w += AU.R(x - 6, 820, 12, 190, 4, '#6A4428') + AU.cip(k + ' KM', x, 800, '#FFF3D6', C.LAC, 30); });
    w += `<path d="M220 960 Q${220 + L / 2} ${980} ${gx} 960" stroke="${G.AA}" stroke-width="5" fill="none"/>` + `<circle cx="220" cy="960" r="10" fill="${G.A}"/>` + AU.cip('1 GRAM', 220, 880, C.ALT, C.LAC, 28);
    w += gufi(t, { x: gx + 40, y: 1010, boy: 190, duygu: 'mutlu', ust: KASIF, isaretHedef: [gx, 960] });
    w += gubi(t, { x: 300, y: 1680, boy: 190, duygu: 'sasir', ust: ARKEOLOG, bakHedef: [700, 960] });
    o += kam(w, { dx: -AU.cl(gx - 640, 0, 2400) });
    o += AU.cip('BİR GRAM → KİLOMETRELERCE TEL', 540, 420, C.ALT, C.LAC, 28);
  }
  $('dinamik').innerHTML = o;
};"""
# 05 — MISIR: piramitler → mezar içi (Gufi meşale, Gubi arkeolog) → DETAY maske kantarda ≈10 KG
S[5] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 1.3) o += kam(AL.piramitler(t), { y: 900, k: 1 + .5 * E(A(t, .3, 1.3)), dx: 0 });
  else {
    o += AL.mezarIci(t) + AL.maske(540, 830, .8 * (.95 + .05 * pop(t, 1.3)));
    o += gufi(t, { x: 220, y: 1720, boy: 260, duygu: 'sasir', ust: KASIF, isaretHedef: [330, 1400], bakHedef: [540, 830] }) + AL.mesale(330, 1390, 1, t);
    o += gubi(t, { x: 850, y: 1660, boy: 210, duygu: 'merak', ust: ARKEOLOG, bakHedef: [540, 830] });
  }
  o += AU.cip('ESKİ MISIR', 540, 420, '#FFF3D6', C.LAC, 32);
  o += DP.sar(t, 2.6, 5.52, (d) => { let s = `<rect width="1080" height="1920" fill="#2A1A10"/><circle cx="540" cy="760" r="520" fill="${G.A}" opacity=".12"/>` + AL.maske(540, 700, 1.15) + AL.kantar(540, 1080, 1.1, Math.round(10 * E(AU.cl(d / 1.4))) + ' KG');
    return s + AU.cip('TUTANKAMON MASKESİ', 540, 360, G.A, C.LAC, 32); });
  $('dinamik').innerHTML = o;
};"""
# 06 — LİDYA: Sardes çarşısı; Gufi ilk sikkeyle alışveriş (DETAY sikke); EFSANE: Midas — dokundukları altın olur
S[6] = r"""
window.renderAt = t => {
  let w = AL.carsi(t);
  w += AL.tezgah(560, 1180, 1.05, '#C8323C', t);
  [[430, 1110], [520, 1100], [610, 1110]].forEach(([x, y], i) => { const ta = A(t, 5.4 + i * .7, 5.9 + i * .7); w += AL.elma(x, y, 34, ta); });
  w += AL.amfora(720, 1130, .8, A(t, 7.6, 8.0) > .5 ? G.A : '#C8723A');
  if (t > 7.6 && t < 8.2) w += AL.parilti(720, 1060, 60 * Math.sin((t - 7.6) / .6 * Math.PI), 1);
  const cx = AU.cl(1 - A(t, .5, 1.1)), coin = A(t, .4, 1.1);
  if (t > .3 && t < 1.2) w += AL.sikke(820 - 260 * E(coin), 1240 - 160 * Math.sin(coin * Math.PI), 26);
  w += gubi(t, { x: 560, y: 1000, boy: 150, duygu: t > 8.4 ? 'kahkaha' : 'mutlu', ust: TUCCAR, bakHedef: [820, 1300] });
  w += gufi(t, { yol: [[0, 900, 1640, 250], [4.2, 900, 1640, 250], [5.2, 740, 1600, 250]], x: 900, y: 1640, boy: 250, duygu: t > 5.5 ? 'sasir' : 'merak', ust: KASIF, isaretHedef: t > 5.2 && t < 8.2 ? [520, 1100] : [560, 1100], bakHedef: [520, 1100] });
  let o = kam(w, { dx: 30 - 60 * E(A(t, 0, 9.6)) });
  const e = pop(t, 3.9); if (e > 0) o += grp(AU.panel(-300, -70, 600, 140, '#6A2A5A') + AU.yaz('EFSANE: KRAL MİDAS', 0, 16, 46, C.ALTA), 540, 430, e);
  else o += AU.cip('LİDYA · MÖ 6. YÜZYIL', 540, 420, '#FFF3D6', C.LAC, 30);
  o += DP.sar(t, 1.2, 3.8, d => `<rect width="1080" height="1920" fill="#3A2A14"/><circle cx="540" cy="820" r="460" fill="${G.A}" opacity=".12"/>` + AL.sikke(540, 820, 300, { parla: .7 + .3 * Math.sin(d * 4), rot: -8 + 6 * d }) + AU.cip('DÜNYANIN İLK SİKKELERİ', 540, 360, G.A, C.LAC, 32) + AU.cip('SARDES · ANADOLU', 540, 1220, '#FFF3D6', C.LAC, 30));
  $('dinamik').innerHTML = o;
};"""
# 07 — SİMYA: Gubi simyacı kazanı karıştırır, Gufi körük basar; Pb atılır → PUF; yine kurşun; DETAY Newton'un simya defteri
S[7] = r"""
window.renderAt = t => {
  let o = AL.lab(t);
  const puf = A(t, 3.3, 5.2), sar = t > 3.3 && t < 3.9 ? (1 - (t - 3.3) / .6) : 0;
  o += AL.kazan(540, 1060, 1.1, t, t > 3.3 ? '#8A8A9A' : '#7CFFB2');
  const pb = A(t, .8, 1.4); if (t < 1.6) o += `<g transform="translate(${540 + 160 * (1 - pb)} ${780 + 200 * pb * pb})">` + AU.R(-50, -40, 100, 80, 12, '#7A808C') + AU.Tm('Pb', 0, 14, 40, '#FFFFFF') + '</g>';
  if (t > 5.0) { const a = pop(t, 5.0); o += grp(AU.R(-60, -45, 120, 90, 12, '#7A808C') + AU.Tm('Pb', 0, 16, 44, '#FFFFFF') + `<path d="M-70 -55 L70 55 M70 -55 L-70 55" stroke="${C.KIR}" stroke-width="14" stroke-linecap="round"/>`, 540, 760, a); }
  o += gubi(t, { x: 300, y: 1660, boy: 220, duygu: t > 3.3 ? 'korku' : 'kararli', ust: SIMYACI, bakHedef: [540, 1000] });
  o += gufi(t, { x: 820, y: 1720, boy: 250, duygu: t > 3.3 ? 'sasir' : 'kararli', ust: KASIF, isaretHedef: [700, 1500], bakHedef: [540, 1000] });
  const kb = Math.sin(t * 8) * (t < 3.3 ? 1 : 0); o += `<g transform="translate(690 1500) rotate(${-10 + 12 * kb})">` + AU.R(-70, -30, 140, 60, 20, '#8A5A3A') + AU.R(60, -8, 60, 16, 6, '#5A3A20') + '</g>';
  if (t > 3.3) { const k = Math.min(1, (t - 3.3) * 2); o += `<ellipse cx="300" cy="1560" rx="${50 * k}" ry="${26 * k}" fill="#2A2A30" opacity=".55"/><ellipse cx="820" cy="1600" rx="${60 * k}" ry="${30 * k}" fill="#2A2A30" opacity=".55"/>`; }
  o += AL.duman(540, 900, puf);
  if (t > 3.3 && t < 3.8) o += AU.yaz('PUF!', 540, 700, 140, '#FFF3D6');
  o += AU.cip('SİMYA', 540, 420, '#B8A0FF', C.LAC, 32);
  o += DP.sar(t, 5.6, 7.4, d => `<rect width="1080" height="1920" fill="#2A1E14"/><circle cx="540" cy="800" r="520" fill="#FFB020" opacity=".08"/>` + AL.defter(540, 820, 1.2) + AU.cip("NEWTON'UN SİMYA NOTLARI", 540, 380, '#E8D8B0', '#3A2414', 30));
  $('dinamik').innerHTML = kam(o, { dx: 10 * sar * Math.sin(t * 70), dy: 8 * sar * Math.cos(t * 60) });
};"""
# 08 — MANSA MUSA: harita rotası (Mali → Kahire → Mekke) + kervan (taç simgesi), Gufi devede; Kahire fiyat tabelası düşer
S[8] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 7.6) {
    let w = AL.col(t);
    for (let i = 0; i < 5; i++) { const x = 1300 - 260 * i - 120 * t, f = i * 1.3; w += AL.deve(x, 1230 + (i % 2) * 20, .95, t, { cuval: 2, faz: f }); if (i === 1) w += gufi(t, { x: x - 10, y: 1050 + 10 * Math.abs(Math.sin(t * 6)), boy: 150, duygu: 'mutlu', ust: KERVAN, bakHedef: [900, 600] }); if (i === 0) w += AL.tac(x, 1010 + 8 * Math.sin(t * 3), 1); }
    o += w;
    const M = H.ciz({ ulkeler: H.ulke('Mali', 'Moritanya', 'Cezayir', 'Nijer', 'Libya', 'Mısır', 'Çad', 'Sudan', 'Suudi Arabistan', 'Senegal', 'Burkina Faso', 'Gine'), kutu: [90, 470, 900, 380], renk: '#F2D8A0', rim: '#FFF0C8' });
    o += AU.panel(70, 450, 940, 420, '#FFF3D6', .9) + M.svg;
    const P = [[-8.0, 12.6], [31.2, 30.0], [39.8, 21.4]].map(M.p), q = E(A(t, .4, 6.5));
    const seg = q * 2, i0 = Math.min(1, Math.floor(seg)), f = seg - i0, ux = P[i0][0] + (P[i0 + 1][0] - P[i0][0]) * f, uy = P[i0][1] + (P[i0 + 1][1] - P[i0][1]) * f;
    o += `<path d="M${P[0][0]} ${P[0][1]} L${seg > 1 ? P[1][0] : ux} ${seg > 1 ? P[1][1] : uy}${seg > 1 ? ` L${ux} ${uy}` : ''}" stroke="${C.KIR}" stroke-width="7" stroke-dasharray="16 10" fill="none"/>`;
    [['MALİ', 0], ['KAHİRE', 1], ['MEKKE', 2]].forEach(([ad, k]) => { if (q * 2 >= k - .02) o += `<circle cx="${P[k][0]}" cy="${P[k][1]}" r="11" fill="${C.LAC}"/>` + AU.Tm(ad, P[k][0], P[k][1] - 22, 26, C.LAC); });
    const c = pop(t, 3.0); if (c > 0) o += grp(AU.cip('≈18 TON ALTIN · RİVAYET', 0, 0, G.A, C.LAC, 30), 540, 960, c);
    o += AU.cip('1324 · MALİ KRALI MANSA MUSA', 540, 400, '#FFF3D6', C.LAC, 28);
    o += gubi(t, { x: 880, y: 1700 + 10 * Math.sin(t * 2), boy: 190, duygu: 'sasir', ust: BILGE, bakHedef: [500, 1100] });
  } else {
    const d = t - 7.6;
    o += AU.zemin('#E8C890', '#C8A060') + AU.R(0, 1150, 1080, 770, 0, '#B08050');
    for (let i = 0; i < 4; i++) o += `<path d="M${i * 290 - 40} 1150 V700 q140 -120 280 0 V1150Z" fill="#D8B078"/>` + AU.R(i * 290 + 40, 880, 120, 270, 60, '#6A4428', .6);
    o += AU.panel(170, 460, 740, 420, C.LAC) + AU.yaz('KAHİRE · ALTIN', 540, 540, 46, C.ALTA);
    const q = E(A(d, .2, 3.0)); let pth = ''; for (let i = 0; i <= 20; i++) { const x = 240 + i * 30, y = 620 + (i / 20 <= q ? (i / 20) * 200 + 10 * Math.sin(i) : q * 200); pth += (i ? 'L' : 'M') + x + ' ' + y; }
    o += `<path d="${pth}" stroke="${C.KIR}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + (q > .9 ? AU.cip('↓ YILLARCA', 760, 820, C.KIR, '#FFFFFF', 28) : '');
    for (let i = 0; i < 16; i++) { const p = ((d * .9 + h(i)) % 1); o += AL.sikke(100 + h(i + 3) * 880, 900 + p * 450, 16, { aslan: false }); }
    o += gufi(t, { x: 300, y: 1720, boy: 250, duygu: 'mutlu', ust: KERVAN, isaretHedef: [420, 1100], bakHedef: [540, 700] });
    o += gubi(t, { x: 820, y: 1660, boy: 200, duygu: 'sasir', ust: BILGE, bakHedef: [540, 700] });
  }
  $('dinamik').innerHTML = o;
};"""
# 09 — KÜP: 18 ton → 1 m küp, Gufi aynı boy; geri çekil: tüm altın 22 m küp = 7 katlı apartman; Gubi tepeye uçar
S[9] = r"""
window.renderAt = t => {
  let o = AU.zemin('#9ED0F0', '#D8EEF8');
  const z = E(A(t, 6.6, 9.4)), s = 240 + (24 - 240) * z, ax = 380 + (408 - 380) * z, Y = 1180;
  o += AU.R(0, Y, 1080, 740, 0, '#8CC06A') + AU.R(0, Y, 1080, 14, 0, '#6AA04A');
  const X = m => ax + m * s;
  if (z > .02) { o += AL.apartman(X(-10), Y, 12 * s, 22 * s, 7); o += AL.kup(X(16), Y, 22 * s); }
  const kq = E(A(t, .6, 2.6)); if (kq > 0) o += AL.kup(X(1.4), Y, 1 * s * kq);
  if (t < 2.6) { for (let i = 0; i < 4; i++) o += `<g opacity="${1 - kq}">` + `<path d="M${X(1.4) - 60 + i * 40} ${Y - 30} q-24 10 -20 50 q24 14 50 0 q4 -40 -20 -50Z" fill="#C8A060" transform="translate(0 -40)"/>` + '</g>'; }
  if (z < .2 && kq > .9) o += `<g opacity="${1 - z * 5}"><path d="M${X(2.15)} ${Y} V${Y - s}" stroke="${C.LAC}" stroke-width="5"/><path d="M${X(2.05)} ${Y} h20 M${X(2.05)} ${Y - s} h20" stroke="${C.LAC}" stroke-width="5"/>` + AU.Tm('1 m', X(2.15) + 60, Y - s / 2, 40, C.LAC) + '</g>';
  o += gufi(t, { x: X(0), y: Y, boy: Math.max(30, s), duygu: kq > .9 && t < 6 ? 'sasir' : 'mutlu', ust: KASIF, bakHedef: [X(1.4), Y - s / 2] });
  const c1 = pop(t, 2.4); if (c1 > 0 && t < 6.6) o += grp(AU.cip('18 TON = 1 METRE KÜP', 0, 0, G.A, C.LAC, 32), 540, 420, c1);
  const c2 = pop(t, 7.0); if (c2 > 0) o += grp(AU.panel(-380, -70, 760, 140, C.LAC) + AU.yaz('TÜM ALTIN · 216.265 TON', 0, 16, 46, C.ALTA), 540, 430, c2);
  const c3 = pop(t, 12.8); if (c3 > 0) o += grp(AU.cip('7 KATLI APARTMAN', 0, 0, '#FFF3D6', C.LAC, 28), X(-10), Y - 22 * s - 50, c3) + grp(AU.cip('22 m', 0, 0, G.A, C.LAC, 28), X(16) + 11 * s * .35, Y - 22 * s - 60, c3);
  o += gubi(t, { yol: [[0, 860, 1660, 200], [9.6, 860, 1660, 200], [11.6, X(16), Y - 22 * s - 8, 110]], x: 860, y: 1660, boy: 200, duygu: 'mutlu', ust: BILGE, bakHedef: [540, 900] });
  $('dinamik').innerHTML = kam(o, { dy: 40 * E(A(t, 9.4, 12)) });
};"""
# 10 — YASTIK ALTI: Gufi yastığı kaldırır → bilezik/çeyrek; ≈5.000 ton; 6,4 m küp iki katlı evin yanında
S[10] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 4.0) {
    o += AL.oda(t) + AL.yatak(540, 1150, 1.1);
    const k = E(A(t, .4, 1.2));
    const pile = [[420, 1010, 'b', 60, -10], [520, 1000, 'c'], [600, 1015, 'b', 54, 12], [470, 990, 'c'], [660, 995, 'c'], [560, 1020, 'b', 48, 4], [380, 1000, 'c']];
    pile.forEach(([x, y, tp, r, rot], i) => { const g = A(t, .9 + i * .08, 1.3 + i * .08); if (g <= 0) return; o += tp === 'b' ? AL.bilezik(x, y - 20 * (1 - g), r, rot) : AL.sikke(x, y - 20 * (1 - g), 30, { aslan: false, parla: g }); });
    if (k > .5) o += AL.parilti(540, 940, 50 * Math.abs(Math.sin(t * 4)), .9);
    o += AL.yastik(520 + 150 * k, 1010 - 230 * k, 1.1, -18 * k);
    o += gufi(t, { x: 760, y: 1720, boy: 270, duygu: k > .5 ? 'sasir' : 'merak', ust: KASIF, isaretHedef: [680, 800], bakHedef: [520, 1000] });
    o += gubi(t, { x: 230, y: 1660, boy: 200, duygu: 'mutlu', ust: BILGE, bakHedef: [520, 1000] });
    const c = pop(t, 1.6); if (c > 0) o += grp(AU.panel(-330, -70, 660, 140, C.LAC) + AU.yaz('≈ 5.000 TON · TAHMİNİ', 0, 16, 44, C.ALTA), 540, 470, c);
    o = kam(o, { y: 1000, k: 1 + .08 * E(A(t, 0, 4)), dy: -40 * (1 - E(A(t, 0, 1.2))) });
  } else {
    const d = t - 4.0, s = 70, Y = 1180;
    o += AU.zemin('#9ED0F0', '#D8EEF8') + AU.R(0, Y, 1080, 740, 0, '#8CC06A');
    o += AL.ev(300, Y, 7 * s, 7.6 * s) + AL.kup(760, Y, 6.4 * s * E(A(d, .1, 1.0)));
    const c = pop(d, .9); if (c > 0) o += grp(AU.cip('6,4 m', 0, 0, G.A, C.LAC, 30), 760, Y - 6.4 * s - 70, c) + grp(AU.cip('İKİ KATLI EV', 0, 0, '#FFF3D6', C.LAC, 28), 300, Y - 7.6 * s - 40, c);
    o += gufi(t, { x: 520, y: Y, boy: 70, duygu: 'sasir', ust: KASIF, bakHedef: [760, 900] });
    o += gubi(t, { x: 880, y: 1700, boy: 200, duygu: 'mutlu', ust: BILGE, bakHedef: [760, 900] });
  }
  $('dinamik').innerHTML = o;
};"""
# 11 — CERN: hızlandırıcı; Pb çekirdekleri sıyırarak geçer → Au belirir; 29 pikogram; Gufi yakalamaya uzanır → pıt
S[11] = r"""
window.renderAt = t => {
  let o = AU.zemin('#0E1A3A', '#071026', { desen: '·', op: .1 });
  const cx = 540, cy = 760, rx = 400, ry = 230;
  o += AL.hizlandirici(cx, cy, rx, ry, t);
  const sp = 2.6, tg = 3.6;
  if (t < tg) { const a1 = -Math.PI / 2 + t * sp, a2 = Math.PI / 2 - t * sp; [a1, a2].forEach((a, i) => o += AL.cekirdek(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 40, 16, '#8A90A8', '#5A607E', i * 30) + AU.Tm('Pb', cx + Math.cos(a) * rx, cy + Math.sin(a) * ry - 62, 34, '#FFFFFF')); }
  const d = t - tg;
  if (d > 0) { o += `<circle cx="${cx}" cy="${cy}" r="${40 + 300 * (1 - Math.exp(-d * 4))}" fill="#FFFFFF" opacity="${Math.max(0, .6 - d)}"/>`;
    for (let i = 0; i < 3; i++) o += `<circle cx="${cx + Math.cos(i * 2.1) * d * 300}" cy="${cy + Math.sin(i * 2.1) * d * 300}" r="12" fill="${C.KIR}" opacity="${Math.max(0, 1 - d * .5)}"/>`;
    const yok = A(t, 9.4, 9.7); if (yok < 1) o += `<g opacity="${1 - yok}">` + AL.cekirdek(cx, cy, 56 * (1 - yok * .8), 16, G.A, G.AK, 5) + AU.Tm('Au', cx, cy - 86, 50, G.AA) + '</g>';
    if (t > 9.6 && t < 10.4) o += AU.yaz('pıt!', cx + 60, cy - 80, 70, '#FFF3D6'); }
  const c0 = pop(t, 2.1); o += c0 > 0 ? grp(AU.cip('CERN · 2025', 0, 0, '#8AD8FF', C.LAC, 32), 540, 420, c0) : '';
  const c1 = pop(t, 7.0); if (c1 > 0) o += grp(AU.panel(-330, -60, 660, 120, C.LAC) + AU.yaz('29 PİKOGRAM', 0, 18, 54, C.ALTA), 540, 1110, c1);
  o += gubi(t, { x: 220, y: 1660, boy: 200, duygu: d > 0 ? 'sasir' : 'merak', ust: BILIMCI, bakHedef: [cx, cy] });
  o += gufi(t, { yol: [[0, 860, 1730, 260], [8.4, 860, 1730, 260], [9.3, 700, 1700, 260]], x: 860, y: 1730, boy: 260, duygu: t > 9.6 ? 'uzgun' : 'mutlu', ust: KASIF, isaretHedef: t > 8.6 && t < 10 ? [cx, cy] : null, bakHedef: [cx, cy] });
  $('dinamik').innerHTML = kam(o, { y: cy, k: 1 + .1 * E(A(t, 0, 4)) - .1 * E(A(t, 6.5, 8.5)) });
};"""
# 12 — ÖZET: ALTINI DEĞERLİ YAPAN: AZ · BOZULMAZ · 5000 YIL GÜVEN — maskotlar kartları çevirir
S[12] = r"""
window.renderAt = t => {
  let o = AU.zemin('#3A2A12', '#140C06', { desen: '✦', op: .05 });
  const tt = pop(t, .3); if (tt > 0) o += grp(AU.yaz('ALTINI DEĞERLİ', 0, 0, 72, C.KREM) + AU.yaz('YAPAN 3 ŞEY', 0, 80, 72, C.ALTA), 540, 440, tt);
  const kart = (x, t0, ic, ad) => { const f = A(t, t0, t0 + .5), sx = Math.abs(Math.cos(f * Math.PI)), on = f > .5; return `<g transform="translate(${x} 860) scale(${sx} 1)">` + (on ? AU.panel(-150, -190, 300, 380, '#5A3E14') + ic + AU.yaz(ad, 0, 150, 38, '#FFFFFF') : AU.panel(-150, -190, 300, 380, C.LAC) + AU.yaz('?', 0, 40, 140, C.ALTA)) + '</g>'; };
  o += kart(190, 2.8, AL.kup(-10, 60, 120), 'AZ');
  o += kart(540, 3.7, AL.sikke(0, -10, 80, { parla: 1 }), 'BOZULMAZ');
  o += kart(890, 5.9, AU.yaz('5000', 0, 0, 74, G.AA) + AU.yaz('YIL', 0, 60, 40, G.AA), 'GÜVEN');
  o += gufi(t, { x: 260, y: 1730, boy: 260, duygu: 'mutlu', ust: KASIF, isaretHedef: t < 4.5 ? [190, 900] : [890, 900], bakHedef: [540, 860] });
  o += gubi(t, { x: 820, y: 1660, boy: 210, duygu: 'mutlu', ust: BILGE, bakHedef: [540, 860] });
  $('dinamik').innerHTML = o;
};"""
# 13 — KAPANIŞ: senin yastığının altında ne var? Gufi yastığı yavaşça kaldırır → "?"; yorum balonu
S[13] = r"""
window.renderAt = t => {
  let o = AL.oda(t + 80) + AL.yatak(540, 1150, 1.1);
  const k = E(A(t, .2, 1.4));
  o += `<g opacity="${k}">` + AU.yaz('?', 520, 1020, 120, C.ALT) + '</g>';
  o += AL.yastik(520 + 120 * k, 1010 - 200 * k, 1.1, -14 * k);
  const b = pop(t, 1.9); if (b > 0) o += grp(AU.balon(0, 0, 1.1), 540, 520, b);
  o += gufi(t, { x: 780, y: 1720, boy: 270, duygu: 'mutlu', ust: KASIF, isaretHedef: [650, 820], bakHedef: 'kamera' });
  o += gubi(t, { x: 240, y: 1660, boy: 210, duygu: 'mutlu', ust: BILGE, bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
