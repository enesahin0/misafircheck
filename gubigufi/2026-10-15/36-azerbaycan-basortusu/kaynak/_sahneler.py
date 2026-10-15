S = {}
# 01 — KANCA: İLK KARE gerçek fotoğraf (Bakü'de yan yana Türkiye–Azerbaycan bayrakları) + "TEK MİLLET İKİ DEVLET" → fotoğraf ortadan çatlayıp ayrılır
S[1] = r"""
$('zemin').innerHTML = zeminK('#1A2340', '#0B1022');
window.renderAt = t => {
  const k = 1.22 - .14 * E(A(t, 0, 6.3));
  let ic = foto('bayrak2', 90, 380, 900, 860, { k, oy: 40, r: 30 });
  ic += etiket('?', 860, 470, '#E8323C', '#FFFFFF', 90, 8, pop(t, .25));
  ic += etiket('TEK MİLLET İKİ DEVLET', 540, 1110, '#FFF3D6', '#0B1433', 50, -2, pop(t, 2.0));
  const c = A(t, 4.3, 4.7), ay = E(A(t, 5.2, 6.0));
  let o = '';
  if (c <= 0) o += ic;
  else {
    const z = [[560, 360], [520, 520], [590, 650], [500, 800], [575, 930], [515, 1080], [560, 1260]], n = Math.max(2, Math.ceil(c * z.length));
    const yol = z.map(p => p.join(' ')).join(' L');
    o += `<defs><clipPath id="sol"><path d="M0 0 L560 0 L${yol} L560 1920 L0 1920Z"/></clipPath><clipPath id="sag"><path d="M1080 0 L560 0 L${yol} L560 1920 L1080 1920Z"/></clipPath></defs>`;
    o += `<g transform="translate(${-70 * ay} ${10 * ay}) rotate(${-3 * ay} 300 900)"><g clip-path="url(#sol)">${ic}</g></g>`;
    o += `<g transform="translate(${70 * ay} ${-10 * ay}) rotate(${3 * ay} 780 900)"><g clip-path="url(#sag)">${ic}</g></g>`;
    if (ay < 1) o += `<path d="M${z.slice(0, n).map(p => p.join(' ')).join(' L')}" stroke="#FFFFFF" stroke-width="${8 * (1 - ay)}" fill="none" stroke-linejoin="round" opacity="${1 - ay}"/>`;
  }
  o += kredi('Foto: Aykhan Zayedzadeh · CC BY-SA 4.0', 100, 1258);
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: t > 5.2 ? 'saskin' : 'merak', bakHedef: [540, 800] });
  $('dinamik').innerHTML = o + bam(t, 4.4, .3);
};"""
# 02 — OKUL KAPISI: başörtülü öğrenci kapıya yürür → karar kâğıdı + büyüteç ("başörtüsü": 0 sonuç) → kapı kapanır, DERSE ALINMADI
S[2] = r"""
const okul = (t, kap) => {
  let o = `<defs><linearGradient id="gk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC8E8"/><stop offset="1" stop-color="#DCEAF2"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#gk)"/>`;
  o += CV.bulut ? CV.bulut(220, 470, .8) + CV.bulut(860, 430, .6) : '';
  o += R(120, 560, 840, 560, 10, '#E8D2B0') + R(100, 540, 880, 40, 8, '#B88A5A') + R(380, 590, 320, 70, 14, '#2E5A8C') + txt('MƏKTƏB', 540, 642, 44, '#FFFFFF');
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) if (!(r === 1 && (c === 2))) o += R(170 + c * 160, 700 + r * 170, 100, 120, 8, '#5A7AA8') + R(176 + c * 160, 706 + r * 170, 88, 50, 4, '#9CC8E8', .6);
  o += R(0, 1120, 1080, 160, 0, '#8A94A8') + R(0, 1120, 1080, 14, 0, '#A8B0C0');
  // kapı: iki sütun + parmaklık (kap 0 açık → 1 kapalı)
  o += R(300, 820, 60, 310, 6, '#6A5A4A') + R(720, 820, 60, 310, 6, '#6A5A4A') + R(290, 800, 80, 30, 6, '#5A4A3A') + R(710, 800, 80, 30, 6, '#5A4A3A');
  if (kap > 0) { o += R(360, 870, 360 * kap, 14, 4, '#2A2E40') + R(360, 1080, 360 * kap, 14, 4, '#2A2E40'); for (let i = 0; i < 8; i++) { const bx = 368 + i * 45 * kap; o += R(bx, 860, 10, 260, 4, '#2A2E40'); } }
  return o;
};
const kiz = (t, x, adim, ifade) => KS.karakter({ x, y: 1190, boy: 430, ten: '#F2C9A6', sac: { tip: 'kakul', renk: '#3A2A20' }, ust: '#FFFFFF', alt: '#2A3A5A', ayakkabi: '#1B1B22', poz: 'dur', t, adim, ifade, bak: [1, 0], kiyafet: { etek: '#2A3A5A', etekBoy: 'diz', sapka: 'basortu', sapkaRenk: '#C8A8D8' } });
const belge = (t, p) => {
  let k = R(-380, -360, 760, 720, 24, '#000', .3) + R(-390, -370, 760, 720, 24, '#FFFDF6') + R(-390, -370, 760, 100, 24, '#2E5A8C') + R(-390, -300, 760, 30, 0, '#2E5A8C');
  k += txt('KARAR · 21 EYLÜL', -10, -302, 44, '#FFFFFF');
  k += `<text class="mono" x="-10" y="-210" font-size="24" text-anchor="middle" style="fill:#5A6478">OKUL KIYAFETİNE DAİR</text>`;
  for (let i = 0; i < 9; i++) k += R(-330, -160 + i * 50, i % 3 === 2 ? 420 : 640, 16, 8, '#C8D0DC');
  k += R(-336, 30, 652, 60, 10, '#FFE45C', .55) + `<text x="-10" y="70" font-size="26" font-weight="800" text-anchor="middle" style="fill:#1B2440">"…laikliğe uygun olmayan kıyafetler…"</text>`;
  const m = A(t, 4.8, 6.3), mx = -260 + 520 * E(m), my = -120 + 260 * E(m);
  if (t > 4.6) k += `<g transform="translate(${mx} ${my})"><circle r="80" fill="#BFE0FF" opacity=".35"/><circle r="80" fill="none" stroke="#2A2E40" stroke-width="16"/><path d="M56 56 L130 130" stroke="#2A2E40" stroke-width="24" stroke-linecap="round"/></g>`;
  return grp(k, 540, 800, p);
};
window.renderAt = t => {
  const kap = E(A(t, 6.5, 7.1));
  let o = okul(t, kap);
  const yur = A(t, 0, 1.9), kx = 60 + 330 * E(yur);
  o += kiz(t, kx, t < 1.9 ? t * 6 : null, t > 6.9 ? 'saskin' : 'notr');
  const b = pop(t, 2.0) * (1 - A(t, 6.2, 6.5));
  if (b > 0) o += `<rect width="1080" height="1920" fill="#0B1022" opacity="${.55 * Math.min(1, b)}"/>` + belge(t, b);
  if (t > 5.6 && t < 6.4) o += grp(AU.cip('"BAŞÖRTÜSÜ" → 0 SONUÇ', 0, 0, '#E8323C', '#FFFFFF', 34), 540, 1215, pop(t, 5.6));
  if (t > 6.9) o += etiket('DERSE ALINMADI', 540, 470, '#E8323C', '#FFFFFF', 54, -3, pop(t, 6.9));
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: t > 6.9 ? 'uzgun' : 'merak', bakHedef: [kx, 1000] });
  $('dinamik').innerHTML = o + bam(t, 6.55, .25);
};"""
# 03 — GUBİ'YE SORU: Gubi kameraya yaklaşır, düşünür → "BEN!" (aha) → askıdaki kıyafetler: KIYAFET · İNANÇ · KİŞİSEL ÖZGÜRLÜK → 37 GÖZALTI + sosyal medya kısıtlandı
S[3] = r"""
$('zemin').innerHTML = zeminK('#2A2350', '#120E2A');
const askı = (t) => {
  let o = R(150, 640, 780, 14, 7, '#C8B8E0') + R(180, 640, 14, 520, 7, '#8A7AA8') + R(886, 640, 14, 520, 7, '#8A7AA8') + R(150, 1150, 780, 16, 8, '#8A7AA8');
  const ask = (x, ic, p) => p <= 0 ? '' : grp(`<path d="M0 -10 q0 -22 18 -22" stroke="#C8B8E0" stroke-width="6" fill="none"/><path d="M-70 40 L0 0 L70 40" stroke="#C8B8E0" stroke-width="7" fill="none"/>` + ic, x, 660, p);
  o += ask(320, `<path d="M-80 40 Q-90 -0 0 -2 Q90 0 80 40 L95 260 Q0 300 -95 260Z" fill="#C8A8D8"/><path d="M-45 60 Q0 40 45 60 L40 140 Q0 160 -40 140Z" fill="#2A2350" opacity=".25"/>`, pop(t, 4.4));
  o += ask(540, `<path d="M-90 40 L90 40 L110 300 L-110 300Z" fill="#2E5A8C"/><path d="M-30 40 L0 90 L30 40" fill="#FFFFFF"/>`, pop(t, 4.6));
  o += ask(760, `<ellipse cx="0" cy="70" rx="100" ry="22" fill="#E8A040"/><path d="M-62 70 Q-62 -10 0 -10 Q62 -10 62 70Z" fill="#E8A040"/><rect x="-62" y="44" width="124" height="16" fill="#8A4A2A"/>`, pop(t, 4.8));
  return o;
};
window.renderAt = t => {
  const yk = M.yakinlas(t, .05, 4.25, .6);
  let bg = askı(t);
  let o = M.bulanikSar(bg, yk);
  if (t > 5.3) {
    [['KIYAFET', '#C8A8D8', 5.35], ['İNANÇ', '#7FD0FF', 5.95], ['KİŞİSEL ÖZGÜRLÜK', '#FFD23F', 6.7]].forEach(([s, r, a], i) => o += etiket(s, 540, 470 + i * 0, r, '#120E2A', 50, [-4, 3, -2][i], pop(t, a) * (1 - A(t, [5.9, 6.6, 7.5][i], [6.0, 6.7, 7.6][i]))));
  }
  if (t > 7.5) {
    o += `<rect width="1080" height="1920" fill="#0B1022" opacity="${.7 * A(t, 7.5, 7.8)}"/>`;
    const n = Math.round(37 * E(A(t, 7.6, 8.8)));
    o += grp(txt(String(n), 0, 60, 240, '#FFFFFF') + AU.cip('GÖZALTI', 0, 130, '#E8323C', '#FFFFFF', 34), 330, 760, pop(t, 7.6));
    const g = A(t, 8.9, 9.5);
    let tel = R(-130, -230, 260, 460, 36, '#1B2440') + R(-112, -200, 224, 390, 20, '#2A3456');
    [['#E1306C', -60, -110], ['#25F4EE', 60, -110], ['#1877F2', -60, 10], ['#FFFFFF', 60, 10]].forEach(([r, x, y]) => tel += R(x - 42, y - 42, 84, 84, 22, r, 1 - .75 * g) + R(x - 42, y - 42, 84, 84, 22, '#8A94A8', .75 * g));
    if (g > 0) tel += `<g opacity="${g}"><circle cx="0" cy="-50" r="120" fill="none" stroke="#E8323C" stroke-width="16"/><path d="M-85 35 L85 -135" stroke="#E8323C" stroke-width="16"/></g>`;
    o += grp(tel, 790, 780, pop(t, 8.6));
    if (t > 9.4) o += grp(AU.cip('ERİŞİM KISITLANDI', 0, 0, '#FFFFFF', '#E8323C', 30), 790, 1100, pop(t, 9.4));
  }
  o += takipCip(t, 7.7, 10.7);
  if (t > 3.0 && t < 4.3) o += grp(M.balon(0, 0, txt('BEN!', 0, 22, 64, '#120E2A'), { w: 240, h: 120, yon: -1 }), 760, 520, pop(t, 3.0));
  const gb = { x: 880 + (540 - 880) * yk, y: 1600 + (900 - 1600) * yk, boy: 120 + 230 * yk };
  o += gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: yk > .3 ? [540, 900] : [540, 900] });
  o += gubi(t, Object.assign(gb, { duygu: 'merak', bakHedef: yk > .5 ? 'kamera' : [540, 800] }));
  $('dinamik').innerHTML = o;
};"""
# 04 — ALİYEV'İN ÇIKIŞI: gerçek portre + iki alıntı etiketi → "Gufi, sıkı tutun" (Gufi öne zıplar, titrer)
S[4] = r"""
$('zemin').innerHTML = zeminK('#1E2A44', '#0B1022') + `<rect x="0" y="0" width="1080" height="60" fill="#00B5E2" opacity=".5"/><rect x="0" y="60" width="1080" height="60" fill="#EF3340" opacity=".5"/><rect x="0" y="120" width="1080" height="60" fill="#509E2F" opacity=".5"/>`;
window.renderAt = t => {
  let o = foto('aliyev', 270, 450, 540, 720, { k: 1.04 + .05 * A(t, 0, 7), r: 30, op: Math.min(1, t / .3) });
  o += grp(AU.cip('2 EKİM · PARTİ KURULTAYI', 0, 0, '#FFFFFF', '#1B2440', 28), 540, 410, pop(t, .1));
  o += grp(AU.cip('İLHAM ALİYEV', 0, 0, '#0B1433', '#FFF3D6', 28), 540, 1180, pop(t, .4));
  o += etiket('"HERKES YERİNİ BİLSİN"', 520, 880, '#FFFFFF', '#E8323C', 50, -4, pop(t, 2.9));
  if (t > 4.1) { o += etiket('"YAŞAM TARZIMIZA', 560, 990, '#E8323C', '#FFFFFF', 46, 3, pop(t, 4.1)); o += etiket('BURNUNU SOKMASIN"', 560, 1080, '#E8323C', '#FFFFFF', 46, 3, pop(t, 4.5)); }
  o += kredi('Foto: Azerbaycan Cumhurbaşkanlığı · CC BY 4.0', 100, 1258);
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 900] });
  o += gufi(t, { x: 200, y: 1780, boy: 170, duygu: t > 5.9 ? 'korku' : 'merak', bakHedef: t > 5.9 ? 'kamera' : [540, 900], yol: [[0, 200, 1780, 170], [5.85, 200, 1780, 170], [6.4, 540, 1780, 210], [7.35, 540, 1780, 210]] });
  if (t > 5.9) o += grp(M.balon(0, 0, txt('?!', 0, 22, 64, '#E8323C'), { w: 170, h: 110, yon: -1 }), 720, 1540, pop(t, 6.1));
  $('dinamik').innerHTML = o;
};"""
# 05 — ASIL BOMBA: BOMBA kartı → TB2 fotoğrafı + "son mermisine kadar" (mermi sırası, ÖDENDİ damgası) → fiyat etiketi ×2 ×3 ×5 → adres yok → harita: Rusya mı, Türkiye mi?
S[5] = r"""
$('zemin').innerHTML = zeminK('#24161E', '#0E0A12');
const mermi = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-9" y="-10" width="18" height="40" rx="3" fill="#C8963A"/><path d="M-9 -10 Q0 -40 9 -10Z" fill="#E8B060"/></g>`;
window.renderAt = t => {
  let o = '';
  if (t < 1.55) {
    const d = E(A(t, .15, .45));
    o += grp(R(-330, -150, 660, 300, 40, '#E8323C') + txt('ASIL BOMBA', 0, 34, 96, '#FFFFFF'), 540 + (t > .45 && t < .9 ? 8 * Math.sin(t * 70) : 0), -200 + 1000 * d, 1, -3);
  } else if (t < 8.6) {
    const dim = A(t, 5.8, 6.1);
    o += foto('tb2_pist', 60, 520, 960, 400, { k: 1.1 - .06 * A(t, 1.5, 8.6), r: 28, op: 1 - .55 * dim });
    o += kredi('Foto: Bayhaluk · CC BY-SA 4.0', 80, 905);
    if (t < 5.9) {
      o += etiket('"BİZE KİMSE YARDIM ETMEDİ"', 540, 440, '#FFFFFF', '#E8323C', 44, -2, pop(t, 1.6));
      if (t > 3.0) { const n = Math.floor(A(t, 3.0, 4.6) * 14); for (let i = 0; i < 14; i++) if (i < n) o += mermi(130 + i * 63, 1010, 1.4); o += grp(AU.cip('SON MERMİSİNE KADAR · KENDİ PARAMIZLA', 0, 0, '#C8963A', '#1B1410', 26), 540, 1150, pop(t, 3.0)); }
      if (t > 4.5) o += etiket('ÖDENDİ ✓', 760, 600, '#2FBF71', '#FFFFFF', 64, -12, pop(t, 4.5));
    } else {
      const c = A(t, 6.9, 8.2), kat = c < .33 ? 2 : c < .66 ? 3 : 5;
      let tag = `<path d="M-200 -110 L160 -110 L240 0 L160 110 L-200 110Z" fill="#FFD23F"/><circle cx="170" cy="0" r="18" fill="#24161E"/>`;
      tag += `<text class="mono" x="-20" y="-40" font-size="30" text-anchor="middle" style="fill:#24161E">DÜNYA FİYATI</text>` + txt(t > 6.9 ? `× ${kat}` : '$', -20, 70, 110, '#E8323C');
      o += grp(tag, 520, 820, pop(t, 6.0) * (1 + .06 * (t > 6.9 ? Math.abs(Math.sin(t * 9)) : 0)), -6);
      if (t > 6.9) o += etiket('BİRKAÇ KATI FİYATINA', 540, 1110, '#E8323C', '#FFFFFF', 46, 2, pop(t, 6.95));
    }
  } else if (t < 9.55) {
    const p = pop(t, 8.65);
    o += grp(R(-260, -170, 520, 340, 24, '#FFF3E0') + `<path d="M-260 -170 L0 30 L260 -170" stroke="#C8B8A8" stroke-width="10" fill="none"/>` + R(-150, 60, 300, 70, 12, '#E8E0D4') + txt('?', 0, 118, 76, '#E8323C'), 540, 800, p, -4);
    o += grp(AU.cip('ADRES VERMEDİ', 0, 0, '#FFFFFF', '#1B2440', 34), 540, 1110, pop(t, 8.75));
  } else {
    const rus = A(t, 10.3, 10.8), tr = A(t, 12.9, 13.4);
    const mix = (a, b, q) => { const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return 'rgb(' + pa.map((v, i) => Math.round(v + (pb[i] - v) * q)).join(',') + ')'; };
    const hm = H.ciz({ ulkeler: H.ulke('Rusya', 'Türkiye', 'Azerbaycan', 'Gürcistan', 'Ermenistan', 'İran', 'Kazakistan', 'Ukrayna', 'Suriye', 'Irak', 'Türkmenistan', 'Bulgaristan', 'Yunanistan', 'Romanya', 'Moldova', 'Belarus', 'Özbekistan'), sigdir: H.ulke('Türkiye', 'Azerbaycan', 'Gürcistan', 'Ermenistan'),
      vurgu: { 'Azerbaycan': '#2E8BD6', 'Rusya': mix('#4A3A44', '#C8323C', rus * (1 - .5 * tr)), 'Türkiye': mix('#4A3A44', '#E30A17', tr) }, kutu: [70, 790, 940, 330], proj: 'mercator' });
    o += `<defs><clipPath id="hk"><rect x="40" y="470" width="1000" height="680" rx="30"/></clipPath></defs>` + R(40, 470, 1000, 680, 30, '#0E1A2E') + `<g clip-path="url(#hk)" opacity="${A(t, 9.55, 9.9)}">${hm.svg}</g>`;
    const az = hm.p([47.7, 40.3]), ru = hm.p([44.5, 46.2]), tu = hm.p([34, 39.2]);
    const ok = (a, b, q, r) => q <= 0 ? '' : `<path d="M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2 + 80} ${(a[1] + b[1]) / 2 - 60} ${a[0] + (b[0] - a[0]) * q} ${a[1] + (b[1] - a[1]) * q}" stroke="${r}" stroke-width="10" stroke-dasharray="26 16" fill="none" stroke-linecap="round"/>`;
    o += ok(az, ru, E(rus), '#FFFFFF') + ok(az, tu, E(tr), '#FFD23F');
    o += `<circle cx="${az[0]}" cy="${az[1]}" r="${16 + 4 * Math.sin(t * 6)}" fill="#FFFFFF"/>`;
    if (t > 10.3) o += grp(AU.cip('AZERBAYCAN BASINI: RUSYA', 0, 0, '#FFFFFF', '#C8323C', 28), 540, 430, pop(t, 10.3));
    if (t > 12.9) o += grp(AU.cip("TÜRKİYE'DE AKLA GELEN: SİHA", 0, 0, '#FFD23F', '#24161E', 28), 540, 1180, pop(t, 12.9)) + foto('tb2_pist', tu[0] - 200, tu[1] - 300, 300, 130, { r: 18, op: pop(t, 13.2) });
  }
  o += bam(t, .45, .3);
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: t > 9.5 ? 'merak' : 'saskin', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'saskin', bakHedef: [540, 800] });
  $('dinamik').innerHTML = o;
};"""
# 06 — ANKARA SAKİN: Erdoğan–Aliyev tokalaşma fotoğrafı + "YANLIŞ ANLAŞILMA" damgası + CEVAP YOK
S[6] = r"""
$('zemin').innerHTML = zeminK('#1A2340', '#0B1022');
window.renderAt = t => {
  let o = foto('erdogan_aliyev2', 60, 480, 960, 608, { k: 1.12 - .06 * A(t, 0, 3.55), ox: -40, r: 28, op: Math.min(1, t / .25) });
  o += grp(AU.cip('ANKARA SAKİN', 0, 0, '#FFFFFF', '#1B2440', 32), 540, 420, pop(t, .1));
  o += etiket('"YANLIŞ ANLAŞILMA"', 540, 800, '#FFD23F', '#1B2440', 58, -6, pop(t, 1.2));
  o += grp(AU.cip('CEVAP YOK', 0, 0, '#0B1433', '#FFF3D6', 32), 540, 1180, pop(t, 2.4));
  o += kredi('Foto: Azerbaycan Cumhurbaşkanlığı · CC BY 4.0', 80, 1070);
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 800] });
  $('dinamik').innerHTML = o + bam(t, 1.2, .25);
};"""
# 07 — GUFİ UMUTLU: Gufi öne gelir, iki bayrağı birbirine yaklaştırır → "Ya sen?" kameraya → anket kartı GEÇER / GEÇMEZ + yorum/paylaş çipleri
S[7] = r"""
$('zemin').innerHTML = zeminK('#1E3A44', '#0B1A22') + `<circle cx="540" cy="820" r="460" fill="#FFD23F" opacity=".08"/>`;
window.renderAt = t => {
  const yk = M.yakinlas(t, 0, 1.75, .5);
  let o = '';
  const yak = E(A(t, .3, 1.3)), fy = 660 - 40 * yk;
  if (yk > .02) o += `<g opacity="${Math.min(1, yk * 1.5)}">` + grp(trB(0, 0, 200), 300 + 120 * yak, fy, 1, -6 + 6 * yak) + grp(azB(0, 0, 220), 780 - 120 * yak, fy, 1, 6 - 6 * yak) + '</g>';
  if (t > 1.7) {
    const p = pop(t, 1.7);
    let k = R(-420, -250, 840, 500, 40, '#000', .3) + R(-430, -260, 840, 500, 40, '#FFF8EE') + txt('SENCE BU KRİZ', -10, -150, 52, '#1B2440') + txt('GEÇER Mİ?', -10, -80, 64, '#E8323C');
    k += R(-370, -20, 720, 96, 48, '#2FBF71') + txt('✓  GEÇER', -10, 46, 46, '#FFFFFF') + R(-370, 110, 720, 96, 48, '#E8323C') + txt('✕  GEÇMEZ', -10, 176, 46, '#FFFFFF');
    o += grp(k, 540, 790, p);
  }
  if (t > 3.5) o += grp(AU.cip('YORUMLARA YAZ', 0, 0, '#FFD23F', '#1B2440', 28), 330, 1170, pop(t, 3.5)) + grp(AU.cip('KONUŞAN BİRİNE GÖNDER', 0, 0, '#2FBF71', '#FFFFFF', 28), 700, 1170, pop(t, 3.8));
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: t > 1.1 ? 'kamera' : [540, 900] });
  o += gufi(t, { x: 200 + 340 * yk, y: 1780 - 620 * yk, boy: 170 + 150 * yk, duygu: 'mutlu', bakHedef: t > 1.1 ? 'kamera' : [540, 860] });
  $('dinamik').innerHTML = o;
};"""
# 08 — TAKİP ET kartı
S[8] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#0E1626"/><circle cx="540" cy="760" r="520" fill="#E8323C" opacity=".12"/>`;
window.renderAt = t => {
  let o = '';
  const p = pop(t, .3);
  if (p > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#E8323C" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#E8323C') + AU.yaz('+ TAKİP ET', 0, 98, 46, '#FFFFFF'), 540, 760, p);
  o += gubi(t, { x: 300, y: 1560, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1770, boy: 230, duygu: 'mutlu', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
