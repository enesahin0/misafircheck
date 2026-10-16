S = {}
# 01 — KANCA: düğün salonu, gelin & damat (yüzsüz); kurdeleye push-in → BAM: çeyrekler havalanır, "?" GELİN ← → DAMAT
S[1] = r"""
window.renderAt = t => {
  const B = 2.68, kalk = E(A(t, B, B + .8));
  const tak = [{ tip: 'sikke', u: .15 }, { tip: 'sikke', u: .35 }, { tip: 'bilezik', u: .55 }, { tip: 'sikke', u: .75 }, { tip: 'sikke', u: .92 }].map((k, i) => Object.assign(k, { dy: -kalk * (120 + 40 * (i % 2)), parla: kalk }));
  let w = DT.salon(t) + DT.gelin(400, 1190, .95) + DT.damat(690, 1190, .95, { kurdele: true, takilar: tak });
  w += gufi(t, { x: 240, y: 1770, boy: 210, duygu: 'mutlu', bakHedef: [690, 900] }) + gubi(t, { x: 860, y: 1600, boy: 150, duygu: 'merak', bakHedef: [690, 900] });
  const z = E(A(t, 0, 2.5)) * (1 - E(A(t, B, B + .5)));
  let o = kam(w, { x: 700, y: 900, k: 1 + .35 * z });
  if (t > B) { o += grp(AU.yaz('?', 0, 100, 320, '#FFFFFF'), 540, 560, pop(t, B + .1) * .9);
    o += grp(AU.cip('← GELİN', 0, 0, DT.PEMBE, '#FFFFFF', 40), 230, 760, pop(t, B + .3)) + grp(AU.cip('DAMAT →', 0, 0, '#2A3A6A', '#FFFFFF', 40), 850, 760, pop(t, B + .45)); }
  o += bam(t, B);
  $('dinamik').innerHTML = o;
};"""
# 02 — İKİ TARAF: bölünmüş ekran, eşit boy. Sol pembe: gelin tarafı "HEPSİ GELİNİN" + GÜVENCE kalkanı. Sağ lacivert: akrabalar takarken "BİZİM AKRABALAR TAKTI / NİYE ONDA KALSIN?"
S[2] = r"""
window.renderAt = t => {
  let L = AU.zemin('#F4A6C4', '#B8487A') + DT.gelin(270, 1190, .7);
  L += KP.balonYaz(270, 560, ['“HEPSİ', 'GELİNİN.”'], { fs: 56, sc: pop(t, 1.3), kx: -30 });
  L += grp(KP.kalkan(0, 0, .7, '#FFFFFF') + AU.cip('GÜVENCE', 0, 130, '#FFFFFF', '#B8487A', 30), 270, 840, pop(t, 2.4));
  L += gubi(t, { x: 270, y: 1590, boy: 160, ust: GELIN_T, duygu: 'kararli', bakHedef: 'kamera' });
  const on = t > 4.4;
  let Rr = on ? AU.zemin('#3A4A7A', '#141C38') : `<rect width="1080" height="1920" fill="#0A0E1C"/>`;
  if (on) { const tk = [{ tip: 'sikke', u: .2 }, { tip: 'sikke', u: .45 }, { tip: 'sikke', u: .7 }, { tip: 'sikke', u: .9 }].map((k, i) => Object.assign(k, { op: A(t, 4.6 + i * .35, 4.8 + i * .35) }));
    Rr += DT.damat(810, 1190, .7, { kurdele: true, takilar: tk });
    [[660, .5], [960, .48]].forEach(([x, s], i) => Rr += KP.yetiskin(x, 1190, s, { renk: '#0E1428', yon: i ? -1 : 1 }));
    const b2 = t > 7.2; Rr += KP.balonYaz(810, 560, b2 ? ['“NİYE ONDA', 'KALSIN?”'] : ['“BİZİM AKRABALAR', 'TAKTI.”'], { fs: b2 ? 56 : 44, sc: pop(t, b2 ? 7.2 : 5.75), kx: 30 });
    Rr += gufi(t, { x: 810, y: 1760, boy: 210, ust: DAMAT_T, duygu: 'kararli', bakHedef: 'kamera' }); }
  let o = klip(L, 0, 0, 540, 1920) + klip(Rr, 540, 0, 540, 1920) + `<path d="M540 0 V1920" stroke="#FFFFFF" stroke-width="8"/>`;
  o += grp(AU.cip('GELİN TARAFI', 0, 0, '#FFFFFF', '#B8487A', 30), 270, 380, pop(t, .15)) + (on ? grp(AU.cip('DAMAT TARAFI', 0, 0, '#FFFFFF', '#141C38', 30), 810, 380, pop(t, 4.45)) : '');
  o += bam(t, 0) + bam(t, 4.45);
  $('dinamik').innerHTML = o;
};"""
# 03 — ESKİ KURAL: tokmak iner (mahkemelik) → tüm takılar tek sepete "GELİNİN" → damga HEPSİ GELİNİN
S[3] = r"""
window.renderAt = t => {
  let o = AU.zemin('#6A3A22', '#24120A');
  for (let i = 0; i < 7; i++) o += R(0, 1060 + i * 130, 1080, 120, 6, i % 2 ? '#4A2614' : '#5A3018');
  o += grp(AU.cip('YILLARCA', 0, 0, '#F2CE7A', '#24120A', 36), 540, 400, pop(t, .3));
  const vur = d => d > 0 && d < .5 ? -35 * Math.sin(d / .5 * Math.PI) : 0;
  o += HK.tokmak(820, 640, 1.0, -20 + vur(t - .05) + vur(t - 7.6));
  const S0 = DT.sepet(540, 1110, 1.1);
  const IT = [['bilezik', 160, 520], ['sikke', 340, 470], ['sikke', 520, 560], ['bilezik', 260, 700], ['sikke', 420, 760], ['sikke', 620, 720]];
  IT.forEach(([tip, x0, y0], i) => { const p = E(A(t, 4.8 + i * .35, 5.6 + i * .35)); const x = x0 + (540 - 60 + i * 24 - x0) * p, y = y0 + (1060 - y0) * p - Math.sin(p * Math.PI) * 160;
    if (A(t, 4.4, 4.7) > 0) o += `<g opacity="${A(t, 4.4 + i * .05, 4.7 + i * .05)}">` + (tip === 'bilezik' ? AL.bilezik(x, y, 46, -10 + i * 7) : AL.sikke(x, y, 34, { parla: 1 - p })) + '</g>'; });
  o += S0 + grp(AU.cip('GELİNİN', 0, 0, DT.PEMBE, '#FFFFFF', 36), 540, 1230, pop(t, 6.6));
  if (t > 7.9) o += grp(DT.muhur(0, 0, 1, 'HEPSİ GELİNİN', '#F2CE7A'), 540, 900, pop(t, 7.9, .3));
  o += gufi(t, { x: 210, y: 1770, boy: 210, ust: DAMAT_T, duygu: 'merak', bakHedef: [540, 1000] }) + gubi(t, { x: 870, y: 1600, boy: 150, ust: GELIN_T, duygu: 'merak', bakHedef: [540, 1000] });
  o = kam(o, { y: 900, k: 1.0 + .03 * E(A(t, 0, 9)) }) + takipCip(t, 6.0) + bam(t, .3, .25) + bam(t, 7.9, .3);
  $('dinamik').innerHTML = o;
};"""
# 04 — 2024 DEĞİŞİMİ: damga 2024 → 3 basamaklı merdiven: ① ANLAŞMA ② YÖRE ADETİ ③ KİME TAKILDIYSA ONUN; Gubi basamakları çıkar
S[4] = r"""
const TRM = H.ciz({ ulkeler: H.ulke('Türkiye'), vurgu: { 'Türkiye': '#8C6CFF' }, kutu: [0, 0, 220, 110], proj: 'mercator' }).svg;
window.renderAt = t => {
  let o = AU.zemin('#EDE6FF', '#C8B8F0');
  o += grp(DT.muhur(0, 0, 1.1, '2024', '#8C6CFF', -8), 540, 420, pop(t, .25, .3) * (1 - A(t, 6.9, 7.1))) + grp(AU.cip('AMA ARTIK DEĞİŞTİ', 0, 0, '#1B1640', '#FFFFFF', 34), 540, 560, pop(t, .6) * (1 - A(t, 6.9, 7.1)));
  const X0 = 60, Y0 = 1240, W = 320, HH = 170;
  o += DT.merdiven(X0, Y0, 3, W, HH, '#FFFFFF');
  const st = [[1.55, '1', 'ANLAŞMA'], [3.9, '2', 'YÖRE ADETİ'], [5.75, '3', 'KİME TAKILDIYSA']];
  st.forEach(([t0, n, ad], i) => { const p = pop(t, t0); if (p <= 0) return; const cx = X0 + W * i + W / 2, top = Y0 - (i + 1) * HH;
    const ic = i === 0 ? DT.elSikis(0, 0, .75) : i === 1 ? `<g transform="translate(-110 -55)">${TRM}</g>` : DT.kutu(-70, 0, 130, 90, 'G', DT.PEMBE) + DT.kutu(70, 0, 130, 90, 'D', '#2A3A6A');
    o += grp(`<circle cx="0" cy="55" r="32" fill="#8C6CFF"/>` + AU.yaz(n, 0, 69, 38, '#FFFFFF') + AU.yaz(ad, 0, 130, 30, '#1B1640'), cx, top, p) + grp(ic, cx, top - 90, p); });
  const g = [[0, 120, 1560], [1.5, 120, 1560], [1.9, X0 + W / 2 + 90, Y0 - HH - 70], [3.9, X0 + W / 2 + 90, Y0 - HH - 70], [4.3, X0 + W * 1.5 + 90, Y0 - 2 * HH - 70], [5.75, X0 + W * 1.5 + 90, Y0 - 2 * HH - 70], [6.2, X0 + W * 2.5 - 100, Y0 - 3 * HH - 240]];
  o += gubi(t, { yol: g.map(([tt, x, y]) => [tt, x, y, 110]), x: 120, y: 1560, boy: 110, ust: GELIN_T, duygu: 'merak', bakHedef: [700, 800] });
  o += gufi(t, { x: 900, y: 1770, boy: 210, ust: DAMAT_T, duygu: 'merak', bakHedef: [600, 900] });
  if (t > 7.1) o += grp(AU.cip('YOKSA: KİME TAKILDIYSA ONUN', 0, 0, '#8C6CFF', '#FFFFFF', 34), 540, 440, pop(t, 7.15));
  $('dinamik').innerHTML = kam(o, { y: 900, dx: 30 - 60 * E(A(t, 0, 8.5)) });
};"""
# 05 — FARK ANI: yakın plan kurdele: bilezik → "KADINA ÖZGÜ" → GELİN kutusuna uçar; çeyrek parlar → DAMAT kutusunda kalır
S[5] = r"""
window.renderAt = t => {
  let o = DT.salon(t, { ton: 1 });
  const DX = 540, DY = 1570, DS = 1.7;
  const [bx, by] = DT.kP(DX, DY, DS, .32), [sx, sy] = DT.kP(DX, DY, DS, .72);
  const bu = E(A(t, 6.6, 7.6)), su = E(A(t, 8.7, 9.7));
  const GX = 250, GY = 640, MX = 830, MY = 640;
  o += DT.kutu(GX, GY, 330, 220, 'GELİN', DT.PEMBE, { op: A(t, 5.9, 6.2), vurgu: A(t, 7.4, 7.6) * (1 - A(t, 8.2, 8.5)) }) + DT.kutu(MX, MY, 330, 220, 'DAMAT', '#2A3A6A', { op: A(t, 8.3, 8.6), vurgu: A(t, 9.5, 9.7) * (1 - A(t, 10.3, 10.6)) });
  o += DT.damat(DX, DY, DS, { kurdele: true, takilar: [{ tip: 'sikke', u: .12 }, { tip: 'bilezik', u: .32, gizli: true }, { tip: 'sikke', u: .52 }, { tip: 'sikke', u: .72, gizli: true }, { tip: 'sikke', u: .9 }] });
  // bilezik (uçan)
  const bxx = bx + (GX - bx) * bu, byy = by + (GY + 20 - by) * bu - Math.sin(bu * Math.PI) * 200;
  if (t > 2.2 && t < 7.2) o += `<circle cx="${bx}" cy="${by}" r="${70 + 6 * Math.sin(t * 8)}" fill="none" stroke="#FFE45C" stroke-width="8" opacity="${A(t, 2.2, 2.5)}"/>`;
  o += AL.bilezik(bxx, byy + 10, 52 - 10 * bu, -15);
  if (t > 5.7 && t < 7.0) o += grp(AU.cip('KADINA ÖZGÜ', 0, 0, DT.PEMBE, '#FFFFFF', 34), bx - 40, by - 120, pop(t, 5.75));
  // çeyrek altın (kendi kutusuna)
  const sxx = sx + (MX - sx) * su, syy = sy + (MY + 20 - sy) * su - Math.sin(su * Math.PI) * 160;
  if (t > 8.3 && t < 8.9) o += `<circle cx="${sx}" cy="${sy}" r="${60 + 6 * Math.sin(t * 8)}" fill="none" stroke="#FFE45C" stroke-width="8"/>`;
  o += AL.sikke(sxx, syy, 34, { parla: t > 8.3 ? 1 : 0 });
  if (t > 10.0) o += grp(AU.cip('ÇEYREK → DAMATTA KALIR', 0, 0, '#2A3A6A', '#FFFFFF', 30), 540, 860, pop(t, 10.0));
  o += grp(AU.cip('İŞİN EN İLGİNÇ YANI', 0, 0, '#FFE45C', '#1B1640', 34), 540, 400, pop(t, .15) * (1 - A(t, 5.5, 5.8)));
  o += gubi(t, { x: 140, y: 1000, boy: 130, ust: GELIN_T, duygu: 'merak', bakHedef: [bxx, byy] }) + gufi(t, { x: 930, y: 1770, boy: 200, ust: DAMAT_T, duygu: t > 8.7 ? 'mutlu' : 'merak', bakHedef: [bx, by] });
  $('dinamik').innerHTML = kam(o, { x: 540, y: 1000, k: 1.06 - .06 * E(A(t, 0, 11.7)) });
};"""
# 06 — PAYLAŞIM: telefon, davetiye mesajı uçar
S[6] = r"""
window.renderAt = t => {
  let o = AU.zemin('#FFE0EC', '#F4A6C4');
  const ic = R(-80, -150, 160, 220, 18, '#FFFFFF') + `<path d="M-80 -150 L0 -80 L80 -150" stroke="#E86A9A" stroke-width="6" fill="none"/>` + AU.yaz('♥', 0, 10, 60, '#E86A9A') + AU.yaz('DÜĞÜN', 0, 60, 28, '#B8487A');
  const u = E(A(t, .8, 2.2));
  o += DT.telefon(540, 820, 1.2, ic) + `<g transform="translate(${u * 600} ${-u * 500}) rotate(${-20 * u} 540 820)" opacity="${1 - A(t, 1.8, 2.3)}">${R(460, 760, 160, 110, 14, '#E86A9A')}${`<path d="M460 760 L540 820 L620 760" stroke="#FFFFFF" stroke-width="6" fill="none"/>`}</g>`;
  o += grp(AU.cip('EVLENECEK ARKADAŞINA GÖNDER', 0, 0, '#1B1640', '#FFFFFF', 30), 540, 1180, pop(t, .2));
  o += gubi(t, { x: 230, y: 1580, boy: 150, ust: GELIN_T, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 850, y: 1770, boy: 200, ust: DAMAT_T, duygu: 'mutlu', bakHedef: [540, 820] });
  $('dinamik').innerHTML = o + bam(t, 0);
};"""
# 07 — TAVSİYE: kamera REC → takı töreni kaydı → "EN SAĞLAM DELİL" mührü
S[7] = r"""
window.renderAt = t => {
  let o = DT.salon(t);
  o += `<rect x="150" y="470" width="780" height="540" rx="30" fill="#000" opacity=".35"/>`;
  o += DT.gelin(420, 980, .55) + DT.damat(660, 980, .55, { kurdele: true, takilar: [{ tip: 'sikke', u: .3 }, { tip: 'bilezik', u: .6 }, { tip: 'sikke', u: .85 }] });
  [[170, 490], [910, 490], [170, 990], [910, 990]].forEach(([x, y], i) => o += `<path d="M${x} ${y + (i > 1 ? -50 : 50)} V${y} H${x + (i % 2 ? -50 : 50)}" stroke="#FFFFFF" stroke-width="8" fill="none"/>`);
  o += `<circle cx="215" cy="540" r="14" fill="#E8323C" opacity="${Math.floor(t * 2) % 2 ? .3 : 1}"/>` + AU.Tm('REC', 270, 550, 30, '#FFFFFF');
  o += grp(AU.cip('TAKI TÖRENİNİN VİDEOSUNU SAKLA', 0, 0, '#FFFFFF', '#1B1640', 28), 540, 380, pop(t, 1.4));
  if (t > 3.5) o += grp(DT.muhur(0, 0, .8, 'EN SAĞLAM DELİL', '#F2CE7A', -6), 540, 1130, pop(t, 3.5, .3));
  o += gufi(t, { x: 230, y: 1770, boy: 200, ust: DAMAT_T, duygu: 'kararli', isaretHedef: [540, 700], bakHedef: [540, 700] }) + gubi(t, { x: 860, y: 1590, boy: 150, ust: GELIN_T, duygu: 'merak', bakHedef: [540, 700] });
  $('dinamik').innerHTML = kam(o, { y: 800, k: 1 + .05 * E(A(t, 0, 5.8)) }) + bam(t, 3.5, .3);
};"""
# 08 — KAPANIŞ SORUSU: iki buton GELİNİN / TAKILANIN + yorum balonu
S[8] = r"""
window.renderAt = t => {
  let o = AU.zemin('#2A1E4A', '#120A24');
  for (let i = 0; i < 14; i++) o += AL.sikke(80 + h(i) * 920, 300 + h(i + 5) * 1400, 14 + h(i + 2) * 10, { aslan: false }).replace('<g ', '<g opacity=".18" ');
  o += grp(AU.yaz('SENCE TAKI', 0, 0, 88, '#FFFFFF') + AU.yaz('KİMİN HAKKI?', 0, 100, 88, '#F2CE7A'), 540, 480, pop(t, .25));
  o += grp(DT.kutu(0, 0, 360, 240, 'GELİNİN', DT.PEMBE) + AL.bilezik(0, 40, 50, -10), 290, 860, pop(t, 2.0));
  o += grp(DT.kutu(0, 0, 360, 240, 'TAKILANIN', '#3A4A9A') + AL.sikke(0, 40, 40), 790, 860, pop(t, 2.85));
  const yb = pop(t, 3.9); if (yb > 0) o += grp(AU.balon(0, 0, .7) + AU.yaz('YORUMLARA YAZ', 0, 150, 34, '#FFFFFF'), 540, 1110, yb);
  o += gufi(t, { x: 230, y: 1770, boy: 200, ust: DAMAT_T, duygu: 'merak', bakHedef: 'kamera' }) + gubi(t, { x: 860, y: 1590, boy: 150, ust: GELIN_T, duygu: 'merak', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
# 09 — TAKİP ET kartı
S[9] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#0E1626"/><circle cx="540" cy="760" r="520" fill="#8C6CFF" opacity=".14"/>`;
window.renderAt = t => {
  let o = '';
  const p = pop(t, .3);
  if (p > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#8C6CFF" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#8C6CFF') + AU.yaz('+ TAKİP ET', 0, 98, 46, '#FFFFFF'), 540, 760, p);
  o += gubi(t, { x: 300, y: 1560, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1770, boy: 230, duygu: 'mutlu', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
