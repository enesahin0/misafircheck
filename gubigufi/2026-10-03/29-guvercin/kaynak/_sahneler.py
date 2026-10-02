S = {}
# 01 — KANCA: park; güvercin yürür; Gufi "kafa sallayarak" taklit eder → YANLIŞ! → baş izleri: dur-atıl-dur
S[1] = r"""
window.renderAt = t => {
  let w = GV.park(t, 1180);
  const s = 1.5, P = .55, v = 110, Y = 1150, W = GV.yurur(t, 80, v, s, P);
  // baş izleri (her tutma anında bırakılan nokta)
  if (t > 2.6) { const n = Math.floor(t / P); for (let k = 0; k <= n; k++) { const hx = GV.yurur(k * P + .01, 80, v, s, P).basX + 4 * s; w += `<circle cx="${hx}" cy="${Y - 156 * s}" r="9" fill="${C.KIR}" opacity="${.85 * A(t, 2.6, 3.2)}"/>`; }
    w += `<path d="M0 ${Y - 156 * s} H1080" stroke="${C.KIR}" stroke-width="4" stroke-dasharray="14 12" opacity="${.7 * A(t, 2.6, 3.2)}"/>`; }
  w += GV.guvercin(W.gx, Y, s, { basX: W.basX, adim: t / P });
  const bob = Math.abs(Math.sin(t * 9)) * 30 * (t < 2.4 ? 1 : 0);
  w += gufi(t, { x: 250, y: 1730 - bob, boy: 250, duygu: t > 1.8 ? 'sasir' : 'mutlu', bakHedef: [W.basX, Y - 220] });
  w += gubi(t, { x: 860, y: 1560, boy: 170, ust: BILGE, duygu: 'merak', bakHedef: [W.basX, Y - 220] });
  let o = kam(w, { x: 540, y: 900, k: 1 + .18 * E(A(t, 3.4, 6.9)), dx: -60 * E(A(t, 3.4, 6.9)) });
  o += AU.cip('KAFA SALLIYOR MU?', 540, 420, '#FFF3D6', C.LAC, 34);
  const d = pop(t, 1.7, .35); if (d > 0) o += grp(`<rect x="-230" y="-70" width="460" height="140" rx="20" fill="none" stroke="${C.KIR}" stroke-width="12"/>` + AU.yaz('YANLIŞ!', 0, 30, 96, C.KIR), 540, 560, 1.8 - .8 * d, -10, d);
  const c = pop(t, 3.0); if (c > 0) o += grp(AU.cip('KAFA HAVADA SABİT DURUYOR', 0, 0, C.KIR, '#FFFFFF', 28), 540, 700, c);
  $('dinamik').innerHTML = o;
};"""
# 02 — AĞIR ÇEKİM: ölçü ızgarası önünde yavaş yürüyüş; baş SABİT (kilit + dikey çizgi) → ≈5 cm ileri fırlar → yine sabit; Gubi kameraman
S[2] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#1B2440"/>`;
  for (let i = 0; i < 20; i++) o += AU.R(i * 60, 300, 2, 1000, 0, '#FFFFFF', .12) + AU.R(0, 300 + i * 60, 1080, 2, 0, '#FFFFFF', .12);
  o += AU.R(0, 1160, 1080, 760, 0, '#2A3456');
  const s = 2.0, Y = 1150, gx = 230 + 26 * t, H0 = 230 + 78 * s + 20;
  const hx = H0 + 70 * E(A(t, 4.87, 5.45)) + 70 * E(A(t, 9.13, 9.7)) - 70 * (1 - E(A(t, 0, .6))) * 0;
  const hy = Y - 150 * s;
  // hayalet (önceki) baş konumları
  [[H0, 0], [H0 + 70, 5.45]].forEach(([x, t0]) => { if (t > t0 + .6) o += `<circle cx="${x}" cy="${hy}" r="${26 * s}" fill="#FFFFFF" opacity=".08"/>`; });
  const tut = (t > 1.4 && t < 4.87) || (t > 5.5 && t < 9.13) || t > 9.7;
  if (tut) { o += `<path d="M${hx + 4 * s} 380 V${Y}" stroke="${C.ALT}" stroke-width="5" stroke-dasharray="16 10"/>` + `<g transform="translate(${hx + 4 * s} 420)">` + AU.R(-26, -10, 52, 40, 8, C.ALT) + `<path d="M-14 -10 v-12 a14 14 0 0 1 28 0 v12" stroke="${C.ALT}" stroke-width="7" fill="none"/>` + '</g>' + AU.cip('BAŞ SABİT', hx + 4 * s, 500, C.ALT, C.LAC, 28); }
  o += GV.guvercin(gx, Y, s, { basX: hx, adim: t * .45 });
  // gövde ok (sürekli ilerliyor)
  o += `<path d="M${gx - 120} ${Y + 60} H${gx + 40}" stroke="#7CFFB2" stroke-width="8" stroke-linecap="round"/><path d="M${gx + 40} ${Y + 44} l22 16 l-22 16" fill="#7CFFB2"/>` + AU.Tm('GÖVDE', gx - 40, Y + 110, 28, '#7CFFB2');
  const th = A(t, 4.87, 6.6); if (th > 0 && th < 1) { const x0 = H0 + 4 * s, x1 = H0 + 74 + 4 * s; o += `<g opacity="${Math.sin(th * Math.PI)}"><path d="M${x0} ${hy - 90} H${x1}" stroke="#FFFFFF" stroke-width="6"/><path d="M${x0} ${hy - 110} v40 M${x1} ${hy - 110} v40" stroke="#FFFFFF" stroke-width="6"/>` + AU.cip('≈ 5 cm', (x0 + x1) / 2, hy - 150, '#FFFFFF', C.LAC, 30) + '</g>'; }
  o += AU.cip('AĞIR ÇEKİM · 0,25×', 540, 400, C.KIR, '#FFFFFF', 30);
  o += gubi(t, { x: 260, y: 1600, boy: 180, ust: KAMERACI, duygu: 'kararli', bakHedef: [hx, hy] }) + GV.kamera(370, 1560, .9, Math.floor(t * 2) % 2);
  o += gufi(t, { x: 840, y: 1740, boy: 250, duygu: t > 4.9 && t < 6.5 ? 'sasir' : 'merak', bakHedef: [hx, hy] });
  $('dinamik').innerHTML = o;
};"""
# 03 — PEKİ NEDEN? → 1978 koşu bandı deneyi: Gufi bandı çalıştırır; grafik: PARKTA baş merdiven gibi / BANTTA düz çizgi
S[3] = r"""
window.renderAt = t => {
  let o = '';
  if (t < 1.0) { o += AU.zemin('#2A3456', '#1B2440', { desen: '?', op: .08 }) + grp(AU.yaz('?', 0, 80, 420, C.ALTA), 540, 860, pop(t, 0, .4)); o += gubi(t, { x: 300, y: 1600, boy: 190, ust: BILGE, duygu: 'dusun', bakHedef: [540, 800] }) + gufi(t, { x: 780, y: 1740, boy: 250, duygu: 'dusun', bakHedef: [540, 800] }); $('dinamik').innerHTML = o; return; }
  const d = t - 1.0;
  o += `<rect width="1080" height="1920" fill="#E8EEF4"/>` + AU.R(0, 1180, 1080, 740, 0, '#C8D2DE');
  // iki grafik paneli
  const gr = (x0, bas, ciz, renk, sabit) => { let s = AU.panel(x0, 380, 440, 300, '#FFFFFF') + AU.Tm(bas, x0 + 220, 430, 26, C.LAC) + `<path d="M${x0 + 40} 640 H${x0 + 410} M${x0 + 40} 640 V470" stroke="#8A90A8" stroke-width="4"/>` + AU.Tm('zaman →', x0 + 340, 668, 18, '#8A90A8');
    let pth = ''; const N = 60; for (let i = 0; i <= N * ciz; i++) { const u = i / N, xx = x0 + 40 + u * 360; let yy; if (sabit) yy = 560; else { const k = Math.floor(u * 6), f = u * 6 - k, e = f < .7 ? 0 : (f - .7) / .3; yy = 610 - (k + e) * 22; } pth += (i ? 'L' : 'M') + xx + ' ' + yy; }
    return s + `<path d="${pth}" stroke="${renk}" stroke-width="6" fill="none" stroke-linejoin="round"/>`; };
  o += `<g transform="translate(0 70)">` + gr(60, 'PARKTA: BAŞ', A(d, .2, 4.5), C.KIR, false) + gr(580, 'BANTTA: BAŞ', A(d, 5.6, 8.2), C.YES, true) + '</g>';
  o += AU.cip('1978 · KOŞU BANDI DENEYİ', 540, 400, C.LAC, '#FFFFFF', 28);
  // koşu bandı
  const BY = 1130; o += AU.R(170, BY, 740, 50, 25, '#2A2E40'); for (let i = 0; i < 14; i++) { const x = 190 + ((i * 56 - d * 120) % 700 + 700) % 700; o += AU.R(x, BY + 8, 20, 34, 6, '#4A5068'); }
  o += AU.R(860, BY - 220, 30, 230, 10, '#5A607E') + AU.R(820, BY - 280, 120, 70, 14, '#3A3F5C') + `<circle cx="880" cy="${BY - 245}" r="16" fill="${d > .8 ? '#7CFFB2' : C.KIR}"/>`;
  const s = 1.4; o += GV.guvercin(450, BY, s, { adim: d * 1.8 });
  const c1 = pop(t, 7.0); if (c1 > 0) o += grp(AU.cip('ETRAF HİÇ DEĞİŞMİYOR', 0, 0, '#3A4466', '#FFFFFF', 28), 540, 820, c1);
  const c2 = pop(t, 9.6); if (c2 > 0) o += grp(AU.cip('KAFA SALLAMA YOK ✓', 0, 0, C.YES, '#FFFFFF', 32), 800, 760, c2);
  o += gufi(t, { yol: [[1, 700, 1760, 250], [1.6, 760, 1760, 250]], x: 760, y: 1760, boy: 250, duygu: 'mutlu', isaretHedef: d < 1.4 ? [880, BY - 245] : [450, BY - 200], bakHedef: [450, BY - 200] });
  o += gubi(t, { x: 200, y: 1600, boy: 180, ust: BILGE, duygu: t > 9.6 ? 'aha' : 'merak', bakHedef: [450, BY - 200] });
  $('dinamik').innerHTML = kam(o, { dx: 20 - 40 * E(A(t, 1, 13.7)) });
};"""
# 04 — GÖZLER: tepeden baş; iki yandaki gözler → 340° görüş konileri; dar ön alan (iki göz); kör nokta (Gubi gizlenir); yürürken görüntü kayar
S[4] = r"""
window.renderAt = t => {
  let o = AU.zemin('#2A3A2A', '#1A2A1A');
  const kay = A(t, 9.2, 11.2); for (let i = 0; i < 14; i++) { const y = ((i * 170 + kay * 1400 * (t - 9.2 > 0 ? 1 : 0)) % 1900) - 100 + (t > 9.2 ? (t - 9.2) * 600 : 0) % 170; o += `<circle cx="${i % 2 ? 140 : 940}" cy="${((i * 170 + (t > 9.2 ? (t - 9.2) * 700 : 0)) % 1900) - 100}" r="${50 + h(i) * 30}" fill="#3E6A3A"/>`; }
  if (t > 9.2) for (let i = 0; i < 16; i++) o += `<path d="M${60 + h(i) * 960} ${((i * 130 + (t - 9.2) * 1500) % 1700) + 200} v${80 + h(i + 3) * 80}" stroke="#FFFFFF" stroke-width="4" opacity=".35"/>`;
  const cx = 540, cy = 880, p = E(A(t, 2.6, 3.6));
  if (p > 0) o += GV.gorusAlani(cx, cy, 470, p, { vurguOn: A(t, 6.4, 7.0), vurguKor: A(t, 7.4, 8.0) });
  o += GV.basUstten(cx, cy, 1.5);
  const g = pop(t, .6); if (g > 0 && t < 2.6) [-60, 60].forEach(dx => o += `<circle cx="${cx + dx}" cy="${cy - 30}" r="${40 * g}" fill="none" stroke="${C.ALT}" stroke-width="6"/>`);
  const a = pop(t, 3.4); if (a > 0) o += grp(AU.panel(-150, -60, 300, 120, C.LAC) + AU.yaz('340°', 0, 26, 76, C.ALTA), 540, 420, a);
  const b = pop(t, 6.4); if (b > 0) o += grp(AU.cip('İKİ GÖZ: SADECE DAR BİR ÖN ALAN', 0, 0, C.YES, '#FFFFFF', 24), 540, 1290 - 760, b);
  const c = pop(t, 7.6); if (c > 0) o += grp(AU.cip('KÖR NOKTA', 0, 0, '#1B1F3A', '#FFFFFF', 26), 540, 1260, c);
  o += gubi(t, { yol: [[0, 940, 1640, 150], [7.0, 940, 1640, 150], [8.2, 540, 1190, 120]], x: 940, y: 1640, boy: 150, ust: BILGE, duygu: t > 8.2 ? 'mutlu' : 'merak', bakHedef: [cx, cy] });
  o += gufi(t, { x: 180, y: 1760, boy: 240, duygu: t > 9.3 ? 'sasir' : 'merak', isaretHedef: t > 3 && t < 6 ? [cx - 300, cy] : null, bakHedef: [cx, cy] });
  if (t > 9.4) { const q = pop(t, 9.4); o += grp(AU.cip('YÜRÜRKEN GÖRÜNTÜ KAYIYOR', 0, 0, C.KIR, '#FFFFFF', 26), 540, 1130 - 720, q); }
  $('dinamik').innerHTML = kam(o, { y: cy, k: 1 - .06 * E(A(t, 2.4, 4)) });
};"""
# 05 — DUR · BAK · İLERLE: her tutma anında deklanşör + polaroid; itme anında hız çizgileri; kamera güvercini takip eder
S[5] = r"""
window.renderAt = t => {
  const s = 1.5, P = .9, v = 90, Y = 1150, W = GV.yurur(t, 140, v, s, P);
  const dx = -AU.cl(W.gx - 360, 0, 1000);
  let w = GV.park(t, 1180) + `<g transform="translate(${dx * .5} 0)">` + [1300, 1600, 1900].map((x, i) => AU.R(x - 10, 900, 20, 90, 6, '#7A5232') + `<circle cx="${x}" cy="${870}" r="80" fill="#5E9A4A"/>`).join('') + '</g>';
  let g = GV.guvercin(W.gx, Y, s, { basX: W.basX, adim: t / P });
  if (W.faz === 'it') for (let i = 0; i < 4; i++) g += `<path d="M${W.basX - 70 - i * 10} ${Y - 236 + i * 14} h-${60 + i * 20}" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  w += kam(g, { dx });
  let o = w;
  const n = Math.floor(t / P), f = t / P - n; if (f < .12) o += `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${.35 * (1 - f / .12)}"/>`;
  for (let k = 0; k <= Math.min(n, 5); k++) { const q = pop(t, k * P + .05, .4); const ic = `<circle cx="-6" cy="-28" r="30" fill="#5E9A4A"/>` + AU.R(-10, -2, 8, 30, 3, '#7A5232') + AU.R(-74, 22, 136, 20, 0, '#C8C0B0'); o += GV.polaroid(140 + (k % 5) * 200, 520 + Math.floor(k / 5) * 40, .85 * q, -6 + 12 * h(k), ic); }
  const c = pop(t, 3.4); if (c > 0) o += grp(AU.panel(-280, -60, 560, 120, C.LAC) + AU.yaz('DUR · BAK · İLERLE', 0, 22, 54, C.ALTA), 540, 380, c);
  o += gufi(t, { x: 820, y: 1760, boy: 250, duygu: 'mutlu', isaretHedef: [700, 560], bakHedef: [600, 560] });
  o += gubi(t, { x: 250, y: 1620, boy: 180, ust: KAMERACI, duygu: 'mutlu', bakHedef: [400, 560] });
  $('dinamik').innerHTML = o;
};"""
# 06 — DERİNLİK (paralaks): her baş atılışında katmanlar farklı kayar — yakın çiçekler çok, ağaçlar orta, dağlar az; oklar hız gösterir
S[6] = r"""
window.renderAt = t => {
  const P = 1.2, k = Math.floor(t / P), f = t / P - k, e = f < .55 ? 0 : E((f - .55) / .45), u = k + e;
  let o = `<rect width="1080" height="1920" fill="#BFE3F0"/>`;
  const kat = (hiz, ciz, y0) => { const off = -u * hiz; let s = ''; for (let i = -1; i < 8; i++) s += ciz(((i * 300 + off) % 2400 + 2400) % 2400 - 300, y0, i); return s; };
  o += kat(14, (x, y) => `<path d="M${x - 220} ${y} L${x} ${y - 260} L${x + 220} ${y}Z" fill="#9AAAC8"/><path d="M${x - 60} ${y - 180} L${x} ${y - 260} L${x + 60} ${y - 180}Z" fill="#FFFFFF"/>`, 760);
  o += AU.R(0, 760, 1080, 400, 0, '#9ACB7A');
  o += kat(60, (x, y) => AU.R(x - 14, y - 60, 28, 120, 6, '#7A5232') + `<circle cx="${x}" cy="${y - 110}" r="90" fill="#5E9A4A"/>`, 960);
  o += AU.R(0, 1080, 1080, 840, 0, '#7AB85E');
  o += kat(170, (x, y, i) => GV.cicek(x, y, .55 + .1 * (i % 2), 0), 1180);
  // hız okları (atılış anında)
  const ok = (y, L, renk, et) => `<g opacity="${A(f, .5, .6) * (1 - A(f, .95, 1))}"><path d="M${700} ${y} h-${L}" stroke="${renk}" stroke-width="12" stroke-linecap="round"/><path d="M${700 - L} ${y - 18} l-26 18 l26 18" fill="${renk}"/></g>` + AU.cip(et, 880, y, renk, '#FFFFFF', 24);
  if (t > 1.0) o += ok(560, 30, '#5A6A9C', 'UZAK · YAVAŞ') + ok(800, 120, '#3E7A3A', 'ORTA') + ok(1250, 330, C.KIR, 'YAKIN · HIZLI');
  // sol altta: atılan baş (yan görünüş)
  o += GV.guvercin(150, 1560, 1.6, { basX: 150 + 1.6 * (60 + 50 * e), adim: 0 });
  const d = pop(t, 6.0); if (d > 0) o += grp(AU.panel(-260, -60, 520, 120, C.LAC) + AU.yaz('→ DERİNLİK', 0, 22, 60, C.ALTA), 540, 400, d);
  o += gufi(t, { x: 820, y: 1770, boy: 240, duygu: t > 6 ? 'aha' : 'merak', bakHedef: [540, 1000] });
  $('dinamik').innerHTML = o;
};"""
# 07 — TREN: Gufi pencereden bakar; gözü ağacı takip edip geri sıçrar (inset göz grafiği); güvercin aynı işi kafasıyla yapar
S[7] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#3A4466"/>`;
  o += AU.R(80, 360, 920, 760, 40, '#22283E') + `<defs><clipPath id="tw"><rect x="110" y="390" width="860" height="700" rx="30"/></clipPath></defs><g clip-path="url(#tw)">` + `<rect x="110" y="390" width="860" height="700" fill="#BFE3F0"/>` + AU.R(110, 860, 860, 230, 0, '#8CC06A');
  for (let i = 0; i < 8; i++) { const x = ((i * 260 - t * 520) % 2080 + 2080) % 2080 - 200; o += AU.R(x - 12, 760, 24, 120, 6, '#7A5232') + `<circle cx="${x}" cy="${730}" r="80" fill="#5E9A4A"/>`; }
  for (let i = 0; i < 12; i++) { const x = ((i * 180 - t * 1100) % 2160 + 2160) % 2160 - 200; o += AU.R(x, 980, 10, 110, 0, '#6A5A4A'); }
  o += `</g>` + AU.R(530, 360, 20, 760, 6, '#22283E');
  // göz takibi: testere dişi (takip → sıçra)
  const T0 = .9, q = (t % T0) / T0, tak = q < .82 ? q / .82 : 1 - (q - .82) / .18, bx = 820 - 520 * tak;
  o += AU.R(0, 1150, 1080, 770, 0, '#5A3A44') + AU.R(0, 1150, 1080, 30, 0, '#7A4A54');
  const ins = (x, y, et, kafa) => { let s = AU.panel(x - 170, y - 110, 340, 220, '#FFFFFF') + AU.Tm(et, x, y - 70, 22, C.LAC); if (!kafa) s += `<ellipse cx="${x}" cy="${y + 10}" rx="90" ry="54" fill="#FFFFFF" stroke="#1B1F3A" stroke-width="6"/><circle cx="${x + 60 - 120 * tak}" cy="${y + 10}" r="30" fill="#3A2A20"/><circle cx="${x + 60 - 120 * tak}" cy="${y + 10}" r="14" fill="#111"/>`; else s += GV.guvercin(x - 30, y + 90, .55, { basX: x - 30 + .55 * (110 - 90 * tak) }); return s; };
  o += ins(300, 1000, 'SEN: GÖZÜNLE', false);
  if (t > 6.0) o += grp(ins(0, 0, 'GÜVERCİN: KAFASIYLA', true), 780, 1000, pop(t, 6.0));
  o += gufi(t, { x: 300, y: 1800, boy: 230, duygu: 'merak', bakHedef: [bx, 700] });
  o += gubi(t, { x: 820, y: 1700, boy: 170, ust: BILGE, duygu: 'mutlu', bakHedef: [300, 1600] });
  const k = pop(t, 1.8); if (k > 0) o += grp(AU.cip('TAKİP ET → GERİ SIÇRA', 0, 0, C.ALT, C.LAC, 26), 540, 320, k);
  $('dinamik').innerHTML = kam(o, { dy: 3 * Math.sin(t * 31), dx: 2 * Math.sin(t * 23) });
};"""
# 08 — MORÖTESİ: aynı çiçek — SEN / GÜVERCİN (UV deseni) — süpürme ile ortaya çıkar
S[8] = r"""
window.renderAt = t => {
  let o = AU.zemin('#1B2A55', '#0B1433');
  const sw = E(A(t, 2.5, 3.6));
  o += GV.cicek(540, 820, 2.3, 0);
  o += `<defs><clipPath id="uvc"><rect x="${1080 - 1080 * sw}" y="0" width="1080" height="1920"/></clipPath></defs><g clip-path="url(#uvc)"><rect width="1080" height="1920" fill="#120A30"/>` + GV.cicek(540, 820, 2.3, 1) + '</g>';
  if (sw > 0 && sw < 1) o += AU.R(1080 - 1080 * sw - 4, 300, 8, 1040, 4, '#B89AE8');
  o += AU.cip('SEN', 220, 420, '#FFD23F', C.LAC, 30) + (sw > .5 ? AU.cip('GÜVERCİN · MORÖTESİ', 760, 420, '#B89AE8', '#1A0A3A', 26) : '');
  o += GV.guvercin(830, 1280, 1.2, { basX: 830 + 1.2 * 70, adim: 0 });
  o += gufi(t, { x: 260, y: 1770, boy: 240, duygu: sw > .5 ? 'sasir' : 'merak', bakHedef: [540, 820] });
  o += gubi(t, { x: 560, y: 1640, boy: 160, ust: BILGE, duygu: 'merak', bakHedef: [540, 820] });
  $('dinamik').innerHTML = o;
};"""
# 09 — SANAT ELEŞTİRMENİ: galeri — Monet tarzı nilüfer / Picasso tarzı kübist yüz (temsili); güvercin doğru tabloyu gagalar ✓
S[9] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#EADFCF"/>` + AU.R(0, 1180, 1080, 740, 0, '#B08A62') + AU.R(0, 1170, 1080, 14, 0, '#8A6A4A');
  const cer = (x, ic, et) => AU.R(x - 210, 430, 420, 500, 10, '#000', .2) + AU.R(x - 220, 420, 420, 500, 10, '#C8A050') + AU.R(x - 196, 444, 372, 452, 4, '#FFFFFF') + `<g transform="translate(${x - 10} 670)">${ic}</g>` + AU.cip(et, x - 10, 990, '#FFF3D6', C.LAC, 26);
  let mon = `<rect x="-186" y="-226" width="372" height="452" fill="#5A8AB8"/>`; for (let i = 0; i < 70; i++) mon += `<ellipse cx="${-170 + h(i) * 340}" cy="${-210 + h(i + 70) * 420}" rx="${12 + h(i + 5) * 16}" ry="${5 + h(i + 9) * 6}" fill="${['#7AB0D8', '#4A7AA8', '#8AC0A0', '#5A9A7A'][i % 4]}" opacity=".8"/>`;
  [[-80, 40], [60, -60], [20, 120], [-120, -120]].forEach(([x, y]) => mon += `<ellipse cx="${x}" cy="${y}" rx="44" ry="16" fill="#4A8A5A"/><circle cx="${x}" cy="${y - 8}" r="12" fill="#F2A0B8"/>`);
  let pic = `<rect x="-186" y="-226" width="372" height="452" fill="#E8C878"/><path d="M-120 -180 L60 -200 L140 40 L20 200 L-140 120Z" fill="#D8784A"/><path d="M-20 -200 L60 -200 L140 40 L40 40Z" fill="#4A6AA8"/><circle cx="-40" cy="-60" r="26" fill="#FFFFFF"/><circle cx="-40" cy="-60" r="10" fill="#111"/><path d="M60 -100 l40 20 l-40 20Z" fill="#111"/><path d="M-60 80 Q0 120 60 70" stroke="#8A2A2A" stroke-width="12" fill="none"/><path d="M-10 -40 L30 30 L-20 40" stroke="#3A2A2A" stroke-width="10" fill="none"/>`;
  o += cer(300, mon, 'MONET TARZI') + cer(800, pic, 'PICASSO TARZI');
  const pk = A(t, 1.6, 2.2), gx = 420, Y = 1260;
  o += GV.guvercin(gx, Y, 1.4, { basX: gx + 1.4 * 78, gagala: Math.sin(pk * Math.PI) * .9 });
  const ok = pop(t, 2.2); if (ok > 0) o += grp(`<circle r="60" fill="${C.YES}"/><path d="M-26 0 l18 20 l32 -36" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round"/>`, 300, 420, ok);
  o += AU.cip('1995 · DENEY: "HANGİSİ MONET?"', 540, 340, C.LAC, '#FFFFFF', 24);
  o += gubi(t, { x: 820, y: 1640, boy: 170, ust: REHBER, duygu: t > 2.2 ? 'mutlu' : 'merak', bakHedef: [gx, 1100] });
  o += gufi(t, { x: 640, y: 1780, boy: 230, duygu: t > 2.2 ? 'sasir' : 'merak', bakHedef: [gx, 1100] });
  $('dinamik').innerHTML = kam(o, { dx: -20 + 40 * E(A(t, 0, 4)) });
};"""
# 10 — LABORATUVAR: dokunmatik ekranda doku görüntüsü; güvercin gagalar; tek başına %85 → 4 güvercin oylar → %99; Gufi ödül yemi verir
S[10] = r"""
window.renderAt = t => {
  let o = `<rect width="1080" height="1920" fill="#E8EEF4"/>` + AU.R(0, 1180, 1080, 740, 0, '#C8D2DE');
  const ekran = (x, y, s, seed) => { let e = `<g transform="translate(${x} ${y}) scale(${s})">` + AU.R(-160, -130, 320, 260, 18, '#2A2E40') + AU.R(-146, -116, 292, 170, 8, '#F4E0EA'); for (let i = 0; i < 26; i++) e += `<circle cx="${-130 + h(i + seed) * 260}" cy="${-100 + h(i + 40 + seed) * 140}" r="${8 + h(i + 9 + seed) * 12}" fill="${i % 3 ? '#C890C0' : '#7A4A9A'}" opacity=".8"/>`; return e + AU.R(-130, 66, 120, 50, 10, '#4A8AD8') + AU.R(10, 66, 120, 50, 10, '#F2C24C') + '</g>'; };
  const tek = t < 5.4;
  if (tek) { o += ekran(540, 820, 1.6, 0); for (let k = 0; k < 6; k++) { const d = t - (.4 + k * .55); if (d > 0 && d < .3) o += `<circle cx="${k % 2 ? 700 : 380}" cy="${975}" r="${30 + 60 * d}" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="${1 - d / .3}"/>`; }
    const pk = (t % .55) / .55; o += GV.guvercin(470, 1250, 1.3, { basX: 470 + 1.3 * 78, gagala: t > .4 ? Math.max(0, Math.sin(pk * Math.PI)) * .6 : 0 }); }
  else { [[200, 0], [420, 1], [640, 2], [860, 3]].forEach(([x, i]) => { o += ekran(x, 820, .62, i * 7); const pk = ((t + i * .2) % .6) / .6; o += GV.guvercin(x - 30, 1150, .7, { basX: x - 30 + .7 * 78, gagala: Math.max(0, Math.sin(pk * Math.PI)) * .6 }); if (t > 6.8) o += `<circle cx="${x}" cy="${660}" r="20" fill="${C.YES}"/>`; }); }
  const yuzde = t < 3.5 ? Math.round(50 + 35 * E(A(t, .4, 3.4))) : t < 6.8 ? 85 : Math.round(85 + 14 * E(A(t, 6.8, 7.6)));
  o += AU.panel(330, 360, 420, 150, C.LAC) + AU.yaz('%' + yuzde, 540, 470, 96, yuzde >= 99 ? '#7CFFB2' : C.ALTA);
  o += AU.cip(tek ? 'TEK GÜVERCİN' : 'SÜRÜ OYLAMASI', 540, 560, tek ? '#FFF3D6' : C.YES, tek ? C.LAC : '#FFFFFF', 26);
  o += gufi(t, { x: 820, y: 1770, boy: 240, duygu: t > 7 ? 'mutlu' : 'merak', isaretHedef: [700, 1500], bakHedef: [540, 900] });
  if (t > 1) for (let i = 0; i < 5; i++) { const p = ((t * .8 + i / 5) % 1); o += `<ellipse cx="${700 - 120 * p}" cy="${1500 - 200 * p + 300 * p * p}" rx="6" ry="4" fill="#C8A060"/>`; }
  o += gubi(t, { x: 200, y: 1620, boy: 170, ust: BILIMCI, duygu: 'merak', bakHedef: [540, 900] });
  $('dinamik').innerHTML = o;
};"""
# 11 — KAPANIŞ: parkta dev güvercin yakın planı; Gufi yaklaşır; güvercinin gözü ona döner → irkilir; soru kartı + yorum balonu
S[11] = r"""
window.renderAt = t => {
  let o = GV.park(t + 90, 1180);
  o += GV.guvercin(760, 1500, 3.4, { basX: 760 + 3.4 * 70, gozBak: t > 4.6 ? -1.5 : 0 });
  if (t > 4.6 && t < 5.6) o += AU.yaz('!', 980, 820, 120, C.KIR);
  o += gufi(t, { yol: [[0, -150, 1780, 250], [3.0, 230, 1780, 250]], x: 230, y: 1780, boy: 250, duygu: t > 4.7 ? 'korku' : 'mutlu', bakHedef: [960, 980] });
  const k = pop(t, 6.6); if (k > 0) o += grp(AU.panel(-380, -90, 760, 180, C.LAC) + AU.yaz('SENCE GÜVERCİNLER', 0, -10, 52, C.KREM) + AU.yaz('NE KADAR ZEKİ?', 0, 56, 56, C.ALTA), 540, 430, k);
  const b = pop(t, 9.0); if (b > 0) o += grp(AU.balon(0, 0, .9), 300, 640, b);
  o += gubi(t, { x: 120, y: 1500, boy: 150, ust: BILGE, duygu: t > 4.7 ? 'kahkaha' : 'merak', bakHedef: [230, 1650] });
  $('dinamik').innerHTML = kam(o, { y: 1000, k: 1.08 - .08 * E(A(t, 0, 3)) });
};"""
