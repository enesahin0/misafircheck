/* #12 Çapa etkisi — tekrar eden çizimler (SVG metni). Işık sağ üstten. Kontur yok.
   ATMOSFER: aydınlık — şeker pembe/limon/turkuaz yarışma stüdyosu, gündüz deniz kıyısı, sıcak ahşap mahkeme, renkli pazar. */
const C = (() => {
  let n = 0; const id = p => `c${p}${++n}`;
  const P = { pembe: '#FF7EB6', pembe2: '#FFC2DD', limon: '#FFE14D', turkuaz: '#2EC4B6', mor: '#8C6CFF', lacivert: '#1B1640', krem: '#FFF3D6',
    deniz: '#4FB3E8', deniz2: '#2A8BD0', kum: '#F7D9A0', ahsap: '#C98A4B', ahsapK: '#A56A34', ahsapA: '#E2A868', yesil: '#6CC04A', kirmizi: '#EE312E' };
  function zemin(ust, alt) { const g = id('z'); return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${g})"/>`; }
  // yarışma stüdyosu: ışık hüzmeleri + ampul şeridi + sahne zemini
  function studyo(t) {
    let o = zemin('#FFD3E8', '#FFB3D6');
    for (let i = 0; i < 5; i++) { const x = 100 + i * 220, a = Math.sin(t * .8 + i) * 12; o += `<path d="M${x} 250 L${x - 140 + a * 6} 1300 L${x + 140 + a * 6} 1300Z" fill="${[P.limon, '#FFFFFF', P.turkuaz][i % 3]}" opacity=".16"/>`; }
    o += `<rect x="0" y="1180" width="1080" height="740" fill="#8C6CFF"/><rect x="0" y="1180" width="1080" height="30" fill="#B7A2FF"/>`;
    for (let i = 0; i < 18; i++) { const on = Math.sin(t * 6 + i * 1.3) > 0; o += `<circle cx="${30 + i * 60}" cy="1196" r="9" fill="${on ? P.limon : '#FFF3D6'}" opacity="${on ? 1 : .5}"/>`; }
    return o;
  }
  // şans çarkı: dilimler + sayılar; aci = derece; ibre üstte sabit
  const DILIM = [10, 25, 45, 65, 90, 5, 35, 55, 80, 15, 70, 40];
  function cark(x, y, r, aci = 0, vurgu = null) {
    const nD = DILIM.length, renk = [P.pembe, P.limon, P.turkuaz, P.mor, '#FF9F1C', '#6CC04A'];
    let o = `<circle cx="${x + 10}" cy="${y + 14}" r="${r + 30}" fill="#000" opacity=".15"/><circle cx="${x}" cy="${y}" r="${r + 30}" fill="#FFF3D6"/>`;
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; o += `<circle cx="${x + Math.cos(a) * (r + 15)}" cy="${y + Math.sin(a) * (r + 15)}" r="7" fill="${(i + Math.floor(aci / 15)) % 2 ? P.limon : '#FFFFFF'}"/>`; }
    o += `<g transform="rotate(${aci} ${x} ${y})">`;
    for (let i = 0; i < nD; i++) { const a0 = (i / nD) * Math.PI * 2 - Math.PI / 2 - Math.PI / nD, a1 = a0 + Math.PI * 2 / nD;
      o += `<path d="M${x} ${y} L${x + Math.cos(a0) * r} ${y + Math.sin(a0) * r} A${r} ${r} 0 0 1 ${x + Math.cos(a1) * r} ${y + Math.sin(a1) * r}Z" fill="${renk[i % renk.length]}"/>`;
      const am = (a0 + a1) / 2, tx = x + Math.cos(am) * r * .72, ty = y + Math.sin(am) * r * .72;
      o += `<text x="${tx}" y="${ty + r * .06}" font-size="${r * .17}" font-weight="900" text-anchor="middle" transform="rotate(${am * 57.3 + 90} ${tx} ${ty})" style="fill:${DILIM[i] === vurgu ? '#FFFFFF' : '#1B1640'}">${DILIM[i]}</text>`; }
    o += `</g><circle cx="${x}" cy="${y}" r="${r * .16}" fill="#FFF3D6"/><circle cx="${x - 3}" cy="${y + 3}" r="${r * .1}" fill="${P.mor}"/>`;
    o += `<path d="M${x - 26} ${y - r - 44} L${x + 26} ${y - r - 44} L${x} ${y - r + 16}Z" fill="${P.kirmizi}"/><circle cx="${x}" cy="${y - r - 44}" r="18" fill="${P.kirmizi}"/>`;
    return o;
  }
  // çarkın hedef sayıda durması için gereken açı (ibre üstte)
  const hedefAci = sayi => -(DILIM.indexOf(sayi) / DILIM.length) * 360;
  function kursu(x, y, s = 1, renk = P.turkuaz) { // y = zemin
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-120" y="-190" width="240" height="190" rx="24" fill="${renk}"/><rect x="-140" y="-210" width="280" height="40" rx="20" fill="#FFFFFF"/><rect x="-120" y="-190" width="50" height="190" rx="18" fill="#FFFFFF" opacity=".25"/><circle cx="0" cy="-100" r="36" fill="${P.limon}"/></g>`;
  }
  function cipa(x, y, s = 1, rot = 0, renk = '#5B6E9E') {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><circle cx="0" cy="-150" r="30" fill="none" stroke="${renk}" stroke-width="16"/><rect x="-11" y="-122" width="22" height="200" rx="11" fill="${renk}"/><rect x="-60" y="-100" width="120" height="20" rx="10" fill="${renk}"/>` +
      `<path d="M-110 20 Q-100 90 0 100 Q100 90 110 20 L130 40 L120 -10 L80 10 L100 22 Q90 70 0 76 Q-90 70 -100 22 L-80 10 L-120 -10 L-130 40Z" fill="${renk}"/><rect x="4" y="-120" width="7" height="190" rx="3.5" fill="#FFFFFF" opacity=".3"/></g>`;
  }
  function deniz(t, ufuk = 900) {
    let o = zemin('#9FDBF7', '#DFF4FF') + `<circle cx="820" cy="420" r="80" fill="#FFE27A"/>` + K.glow({ x: 820, y: 420, r: 300, renk: '#FFF3B0', guc: .7 });
    for (let i = 0; i < 6; i++) { const y = ufuk + i * 170, a = Math.sin(t * 1.5 + i) * 18; o += `<path d="M-40 ${y} Q135 ${y - 24 + a} 270 ${y} T540 ${y} T810 ${y} T1080 ${y} T1350 ${y} V${y + 400} H-40Z" fill="${i % 2 ? P.deniz2 : P.deniz}" opacity="${.9}"/>`; }
    return o;
  }
  function kayik(x, y, s = 1, rot = 0) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-160 -20 L160 -20 Q140 60 60 70 L-60 70 Q-140 60 -160 -20Z" fill="#E2703A"/><path d="M-160 -20 L160 -20 L150 0 L-150 0Z" fill="#FFB079"/><rect x="-120" y="10" width="240" height="10" rx="5" fill="#B8552A" opacity=".5"/></g>`;
  }
  function mahkeme() {
    let o = zemin('#F4D9B0', '#E9C38E');
    for (let i = 0; i < 6; i++) o += `<rect x="${i * 190 - 20}" y="200" width="170" height="900" rx="12" fill="${P.ahsapA}" opacity=".5"/>`;
    o += `<rect x="0" y="1100" width="1080" height="820" fill="${P.ahsapK}"/><rect x="0" y="1100" width="1080" height="24" fill="#D69A5B"/>`;
    o += `<rect x="140" y="760" width="800" height="340" rx="26" fill="${P.ahsap}"/><rect x="140" y="760" width="800" height="50" rx="24" fill="${P.ahsapA}"/><rect x="140" y="760" width="120" height="340" rx="22" fill="#E2A868" opacity=".45"/>`;
    o += `<circle cx="540" cy="930" r="70" fill="${P.ahsapA}"/><path d="M510 930 L570 930 M540 900 L540 960" stroke="${P.ahsapK}" stroke-width="12" stroke-linecap="round"/>`;
    return o;
  }
  function hakim(x, y, s = 1) { // cübbeli yüzsüz siluet, y = kürsü üstü
    return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-230" r="64" fill="#F2C9A6"/><path d="M-64 -250 Q-60 -310 0 -306 Q60 -310 64 -250 Q40 -280 0 -276 Q-40 -280 -64 -250Z" fill="#6B4A32"/>` +
      `<path d="M-130 0 Q-135 -150 -60 -165 L60 -165 Q135 -150 130 0Z" fill="#1B1640"/><path d="M-30 -165 L0 -110 L30 -165Z" fill="#FFFFFF"/><rect x="-6" y="-120" width="12" height="100" fill="#8C1D2F"/></g>`;
  }
  function zar(x, y, s, deger, rot = 0) {
    const pip = { 1: [[0, 0]], 3: [[-1, -1], [0, 0], [1, 1]], 6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]], 9: [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]] }[deger] || [[0, 0]];
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-60" y="-52" width="120" height="120" rx="26" fill="#000" opacity=".15"/><rect x="-60" y="-60" width="120" height="120" rx="26" fill="#FFFFFF"/><rect x="-60" y="-60" width="120" height="30" rx="15" fill="#FFFFFF"/>` +
      pip.map(([a, b]) => `<circle cx="${a * 32}" cy="${b * 32}" r="12" fill="${P.lacivert}"/>`).join('') + `</g>`;
  }
  function etiket(x, y, s, eski, yeni, cizik, yeniK, rot = -8) {
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-220 -120 L150 -120 L240 0 L150 120 L-220 120 Q-240 120 -240 100 L-240 -100 Q-240 -120 -220 -120Z" fill="${P.limon}"/><circle cx="160" cy="0" r="22" fill="#FFF3D6"/>` +
      `<text x="-30" y="-20" font-size="74" font-weight="900" text-anchor="middle" style="fill:${P.lacivert}" opacity="${1 - .45 * cizik}">${eski}</text>`;
    if (cizik > 0) o += `<rect x="${-200}" y="-44" width="${340 * cizik}" height="14" rx="7" fill="${P.kirmizi}" transform="rotate(-8 -30 -40)"/>`;
    if (yeniK > 0) o += `<text x="-30" y="${80}" font-size="${86 * yeniK}" font-weight="900" text-anchor="middle" style="fill:${P.kirmizi}">${yeni}</text>`;
    return o + `</g>`;
  }
  function tezgah(t) {
    let o = zemin('#BDE7FF', '#E8F7FF') + `<circle cx="850" cy="380" r="70" fill="#FFE27A"/>`;
    o += `<rect x="0" y="1150" width="1080" height="770" fill="#E9C38E"/>`;
    o += `<rect x="60" y="560" width="30" height="620" rx="15" fill="${P.ahsapK}"/><rect x="990" y="560" width="30" height="620" rx="15" fill="${P.ahsapK}"/>`;
    for (let i = 0; i < 8; i++) o += `<path d="M${40 + i * 125} 520 L${165 + i * 125} 520 L${165 + i * 125} 620 Q${102 + i * 125} 660 ${40 + i * 125} 620Z" fill="${i % 2 ? '#FFFFFF' : P.kirmizi}"/>`;
    o += `<rect x="40" y="480" width="1000" height="50" rx="20" fill="${P.kirmizi}"/>`;
    o += `<rect x="80" y="950" width="920" height="80" rx="24" fill="${P.ahsap}"/><rect x="100" y="1030" width="880" height="140" fill="${P.ahsapK}"/>`;
    [['#FF7043', 200], ['#FFB300', 330], ['#7CB342', 460], ['#E53935', 600], ['#FF7043', 740], ['#FDD835', 870]].forEach(([r, x], i) => { for (let k = 0; k < 3; k++) o += `<circle cx="${x + (k - 1) * 36}" cy="${920 - (k === 1 ? 26 : 0)}" r="34" fill="${r}"/><circle cx="${x + (k - 1) * 36 + 10}" cy="${910 - (k === 1 ? 26 : 0)}" r="9" fill="#FFFFFF" opacity=".35"/>`; });
    return o;
  }
  const tversky = (o = {}) => KS.kisi(Object.assign({ ten: 'acik', sac: { tip: 'dalgali', renk: '#2E2420' }, kas: { renk: '#2E2420', kalin: true }, ifade: 'gulumse', kiyafet: { renk: '#C98A4B', yaka: 'ceket', gomlek: '#F4E9D8' } }, o));
  const kahneman = (o = {}) => KS.kisi(Object.assign({ ten: 'acik', sac: { tip: 'yanlar', renk: '#3A2E28' }, kas: { renk: '#3A2E28' }, gozluk: { tip: 'kare', renk: '#2A2430' }, ifade: 'notr', kiyafet: { renk: '#5A6E8C', yaka: 'ceket', gomlek: '#EDEFF5' }, kravat: '#8E2B4A' }, o));
  return { P, zemin, studyo, cark, hedefAci, DILIM, kursu, cipa, deniz, kayik, mahkeme, hakim, zar, etiket, tezgah, tversky, kahneman };
})();
