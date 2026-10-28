S = {}
# 01 — KANCA: 1 m² ızgaraya yağmur → "193 L / m²" → 19 kova dolar "= 19 KOVA"
S[1] = r"""
window.renderAt = t => {
  let o = zeminK() + SL.bulut(300, 300, 1.2, '#3A4664') + SL.bulut(780, 260, 1.4, '#323E5A');
  o += SL.yagmur(t, { n: 120, op: .5 });
  // 1 m² zemin (eğik ızgara)
  const P = (u, v) => [540 + (u - v) * 230, 680 + (u + v) * 100];
  const k = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
  o += `<path d="M${k.map(p => p.join(' ')).join(' L')}Z" fill="#2A3A5A" stroke="#BFE0FF" stroke-width="4"/>`;
  for (let i = 1; i < 4; i++) { const a = P(i / 4, 0), b = P(i / 4, 1), c = P(0, i / 4), d = P(1, i / 4); o += `<path d="M${a.join(' ')} L${b.join(' ')} M${c.join(' ')} L${d.join(' ')}" stroke="#BFE0FF" stroke-width="2" opacity=".4"/>`; }
  const su = A(t, .4, 4.2); o += `<path d="M${k.map(p => [p[0], p[1] - 70 * su].join(' ')).join(' L')}Z" fill="${SL.SU}" opacity="${.55 * su}"/>`;
  o += AU.Tm('1 m²', 860, 790, 30, '#BFE0FF');
  o += grp(AU.yaz('193 L', 0, 0, 150, '#FFFFFF') + AU.Tm('METREKAREYE', 0, 60, 30, '#BFE0FF'), 540, 530, pop(t, 1.6));
  // 19 kova
  for (let i = 0; i < 19; i++) { const r = Math.floor(i / 7), c = i % 7, x = 180 + c * 120 + (r === 2 ? 120 : 0), y = 1000 + r * 92, d = A(t, 4.8 + i * .16, 5.2 + i * .16);
    if (t > 4.6) o += SL.kova(x, y, .7, d); }
  if (t > 7.0) o += grp(AU.cip('= 19 KOVA', 0, 0, '#FFFFFF', '#1B2440', 40), 540, 1540, pop(t, 7.0));
  o += gubi(t, { x: 920, y: 1580, boy: 140, duygu: 'merak', bakHedef: [540, 1120] }) + semsiye(920, 1460, .9);
  o += gufi(t, { x: 170, y: 1770, boy: 190, duygu: 'saskin', bakHedef: [540, 600] });
  $('dinamik').innerHTML = kam(o, { y: 900, k: 1.06 - .06 * E(A(t, 0, 8.6)) });
};"""
# 02 — NE OLDU: harita, soğuk hava (Balkanlar) + nemli sistem (Akdeniz) İstanbul'da çarpışır → kesit: soğuk kama nemi yukarı iter → sağanak
S[2] = r"""
const HR = H.ciz({ ulkeler: H.ulke('Türkiye', 'Yunanistan', 'Bulgaristan', 'Romanya', 'Sırbistan', 'Kuzey Makedonya', 'Arnavutluk', 'Karadağ', 'Bosna-Hersek', 'Kosova', 'Macaristan', 'Moldova', 'Ukrayna', 'Kıbrıs'), vurgu: { 'Türkiye': '#3A5A7A' }, kutu: [40, 380, 1000, 760], proj: 'mercator' });
const IST = HR.p([28.97, 41.01]), BAL = HR.p([20.5, 44.8]), AKD = HR.p([20.0, 35.6]);
window.renderAt = t => {
  let o = zeminK();
  if (t < 8.3) {
    o += `<rect x="40" y="380" width="1000" height="760" rx="30" fill="#163050"/>` + HR.svg;
    const ok = (a, b, p, renk, et) => { if (p <= 0) return ''; const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 60, x = a[0] + (b[0] - a[0]) * p, y = a[1] + (b[1] - a[1]) * p;
      return `<path d="M${a[0]} ${a[1]} Q${mx} ${my} ${x} ${y}" stroke="${renk}" stroke-width="22" fill="none" stroke-linecap="round" opacity=".9"/><circle cx="${x}" cy="${y}" r="22" fill="${renk}"/>` + grp(AU.cip(et, 0, 0, renk, '#FFFFFF', 26), a[0] + 40, a[1] - 50, Math.min(1, p * 3)); };
    o += ok(BAL, [IST[0] - 20, IST[1] - 10], E(A(t, 2.5, 4.6)), '#4A8AD8', 'SOĞUK HAVA · BALKANLAR');
    o += ok(AKD, [IST[0] - 10, IST[1] + 14], E(A(t, 4.9, 7.0)), '#E8843E', 'NEMLİ SİSTEM · AKDENİZ');
    o += H.igne(IST[0], IST[1], '#FFE45C', 1.2, 'İstanbul');
    if (t > 7.0) o += `<circle cx="${IST[0]}" cy="${IST[1]}" r="${40 + 120 * A(t, 7.0, 8.0)}" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="${1 - A(t, 7.0, 8.0)}"/>`;
    o += grp(AU.cip('NE OLDU?', 0, 0, '#FFFFFF', '#1B2440', 40), 540, 300 + 0, pop(t, .2) * (1 - A(t, 2.2, 2.4)));
    o = kam(o, { x: IST[0], y: IST[1], k: 1 + .25 * E(A(t, 6.5, 8.2)) });
  } else {
    o += SL.cepheKesit(60, 470, 960, 760, E(A(t, 8.3, 11.5)), t);
    o += grp(AU.cip('SOĞUK HAVA NEMİ YUKARI İTER', 0, 0, '#FFFFFF', '#1B2440', 30), 540, 400, pop(t, 8.5));
    if (t > 10.5) o += grp(AU.cip('→ SAĞANAK', 0, 0, SL.SU, '#FFFFFF', 34), 760, 1260, pop(t, 10.5));
  }
  o += gufi(t, { x: 200, y: 1770, boy: 190, duygu: 'merak', bakHedef: t < 8.3 ? [IST[0], IST[1]] : [540, 700] }) + gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'merak', bakHedef: [540, 700] });
  $('dinamik').innerHTML = o + bam(t, 8.3);
};"""
# 03 — KIYAS: Marmara Ekim ortalaması 72 L vs Beykoz tek gün 193,84 L (taşar)
S[3] = r"""
window.renderAt = t => {
  let o = zeminK() + SL.yagmur(t, { n: 40, op: .25 });
  const HH = 600, Y = 1150;
  const d1 = .36 * E(A(t, .6, 3.5)), d2 = .9692 * E(A(t, 4.9, 8.0));
  o += SL.kap(300, Y, 300, HH, d1 / 1.0, '#6AA8E8', { etiket: '%' === '' ? '' : (d1 > .01 ? Math.round(d1 * 200) + ' L' : ''), alt: 'MARMARA · EKİM AYI ORT.' });
  if (t > 4.5) o += SL.kap(780, Y, 300, HH, d2 / 1.0, SL.SU, { etiket: d2 > .01 ? (d2 * 200).toFixed(d2 > .968 ? 2 : 0).replace('.', ',') + ' L' : '', alt: 'BEYKOZ · TEK GÜN' });
  if (t > 7.6) o += grp(AU.cip('≈ 2,7 KATI', 0, 0, '#E8323C', '#FFFFFF', 40), 540, 420, pop(t, 7.6));
  o += gufi(t, { x: 540, y: 1770, boy: 190, duygu: t > 6 ? 'saskin' : 'merak', bakHedef: t < 4.5 ? [300, 800] : [780, 700] }) + gubi(t, { x: 120, y: 1560, boy: 120, duygu: 'merak', bakHedef: [780, 700] });
  $('dinamik').innerHTML = kam(o, { y: 900, dx: 40 - 80 * E(A(t, 0, 8.6)) });
};"""
# 04 — BİLANÇO: sayaçlar + su basmış metro girişi
S[4] = r"""
window.renderAt = t => {
  let o = zeminK() + SL.yagmur(t, { n: 60, op: .35 });
  const sat = (t0, deger, et, y, renk) => { const p = A(t, t0, t0 + 1.2); if (p <= 0) return ''; const v = Math.round(deger * E(p)).toLocaleString('tr-TR');
    return grp(AU.panel(-430, -70, 860, 140, '#16223E') + AU.yaz(v, -200, 30, 92, renk) + AU.Tm(et, 180, 14, 34, '#FFFFFF'), 540, y, pop(t, t0)); };
  o += sat(.2, 2518, 'İHBAR', 500, '#FFE45C') + sat(3.5, 1277, 'SU BASKINI', 670, SL.SUA) + sat(5.5, 15, 'HEYELAN', 840, '#E8A060');
  if (t > 6.4) o += SL.metro(540, 1230, 1.3, E(A(t, 6.6, 8.8)));
  o += AU.Tm('06.00–20.00 · İSTANBUL VALİLİĞİ', 540, 405, 24, '#8A94A8');
  o += gubi(t, { x: 140, y: 1580, boy: 120, duygu: 'uzgun', bakHedef: [540, 600] }) + gufi(t, { x: 930, y: 1770, boy: 180, duygu: 'uzgun', bakHedef: [540, 1100] });
  $('dinamik').innerHTML = kam(o, { y: 800, k: 1 + .04 * E(A(t, 0, 9.3)) });
};"""
# 05 — NEDEN ÇABUK DOLDU: tek tek büyük paneller (toprak/beton → dere → kanal)
S[5] = r"""
window.renderAt = t => {
  let o = zeminK();
  o += grp(AU.cip('ŞEHİR NEDEN ÇABUK DOLDU?', 0, 0, '#FFFFFF', '#1B2440', 32), 540, 400, pop(t, .2));
  const X = 90, Y = 470, W = 900, HH = 680;
  if (t < 8.4) o += SL.panelToprak(X, Y, W, HH, t, E(A(t, 3.2, 7.5)));
  else if (t < 11.3) o += SL.panelDere(X, Y, W, HH, t, E(A(t, 8.6, 10.8)));
  else o += SL.panelKanal(X, Y, W, HH, t, E(A(t, 11.5, 13.6)));
  if (t > 3.0) o += grp(AU.cip('UZMANLARA GÖRE', 0, 0, '#3A4664', '#BFD8FF', 24), 540, 1200, pop(t, 3.0));
  const n = t < 8.4 ? 1 : t < 11.3 ? 2 : 3; if (t > 3.0) o += AU.Tm(n + ' / 3', 930, 520, 26, '#8A94A8');
  o += gufi(t, { x: 200, y: 1770, boy: 190, duygu: 'merak', bakHedef: [540, 800] }) + gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'merak', bakHedef: [540, 800] });
  $('dinamik').innerHTML = o + bam(t, 8.4, .25) + bam(t, 11.3, .25);
};"""
# 06 — GÜVENLİK: yarın da sürecek + 3 kural kartı
S[6] = r"""
window.renderAt = t => {
  let o = zeminK() + SL.bulut(540, 330, 1.1, '#3A4664') + SL.yagmur(t, { y0: 380, n: 70, op: .35 });
  o += grp(AU.cip('YAĞIŞ YARIN DA SÜRECEK', 0, 0, '#FFE45C', '#1B2440', 34), 540, 480, pop(t, .3));
  const K = [[1.9, '!', 'ELEKTRİK DİREĞİNDEN', 'su birikintisinden uzak dur', '#E8A020', 640], [5.4, '✕', 'ALT GEÇİDE GİRME', 'bodrum katlara da', '#E8323C', 840], [8.0, '112', 'ACİL DURUMDA', '112\'yi ara', '#2FBF71', 1040]];
  K.forEach(([t0, ik, s1, s2, r, y]) => { const p = pop(t, t0); if (p > 0) o += grp(SL.kart(0, 0, 900, 160, ik, s1, s2, r), 540, y, p); });
  o += gufi(t, { x: 200, y: 1770, boy: 190, duygu: 'kararli', bakHedef: 'kamera' }) + gubi(t, { x: 880, y: 1590, boy: 130, duygu: 'kararli', bakHedef: [540, 1040], isaretHedef: t > 8 ? [540, 1040] : null }) + semsiye(880, 1470, .8);
  $('dinamik').innerHTML = o;
};"""
