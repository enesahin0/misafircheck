/* gubigufi KİŞİ — gerçek kişilere BENZEYEN, bizim flat çizgi tarzımızda büst portre.
   Benzerlik; saç şekli/rengi, sakal-bıyık, gözlük, kaş, ten, yaş çizgileri ve kıyafet gibi ayırt edici özelliklerle kurulur.
   Kontur yok · rim light sağ üstten · yuvarlak formlar · basit ama sevimli yüz (nokta göz + parlama, kaş, küçük burun, ağız çizgisi).
   Kullanım: KS.kisi({ x, y, boy: 360, ten: 'acik', sac: { tip: 'daginik', renk: '#EDEDED' }, biyik: { renk: '#DCDCDC' }, kiyafet: { renk: '#6B5B4B', yaka: 'ceket' } })
   x,y = büstün alt-orta noktası; boy = toplam büst yüksekliği.
   Saç tipleri: kisa, kisaYan (yandan ayrık), kel, yanlar (tepe kel), daginik, dalgali, uzun, topuz, kivircik, geriTarali
   Sakal: tam, keci, kirli · Bıyık: {renk, tip:'kalin'|'ince'} · Gözlük: {tip:'yuvarlak'|'kare', renk}
   Yaka: gomlek, ceket, onluk (beyaz önlük), bogazli, elbise · kravat/papyon: renk */
const KS = (() => {
  let n = 0; const id = p => `k${p}${++n}`;
  const TEN = { cokAcik: ['#FBE3D0', '#E9C2A6', '#FFF3EA'], acik: ['#F2C9A6', '#D9A580', '#FFE6D2'], bugday: ['#DDA77A', '#BD8659', '#F6CDA8'], esmer: ['#B97A4E', '#955B35', '#DDA37A'], koyu: ['#7A4A2E', '#5C341E', '#A36A45'] };
  function kisi({ x = 540, y = 1300, boy = 360, ten = 'acik', sac = { tip: 'kisa', renk: '#3A2A20' }, sakal = null, biyik = null, gozluk = null, kas = null,
    ifade = 'notr', bak = [0, 0], kiyafet = { renk: '#3D5A80', yaka: 'gomlek' }, kravat = null, papyon = null, yas = 0, kupe = null, acik = 1, cicek = null } = {}) {
    const [T0, T1, T2] = TEN[ten] || TEN.acik; const s = boy / 360;
    const hx = x, hy = y - 250 * s, hw = 88 * s, hh = 110 * s; // baş merkezi + yarıçaplar
    const bas = (ox = 0, oy = 0) => `M${hx - hw + ox} ${hy - 10 * s + oy} Q${hx - hw + ox} ${hy - hh + oy} ${hx + ox} ${hy - hh + oy} Q${hx + hw + ox} ${hy - hh + oy} ${hx + hw + ox} ${hy - 10 * s + oy} Q${hx + hw * .95 + ox} ${hy + hh * .72 + oy} ${hx + ox} ${hy + hh + oy} Q${hx - hw * .95 + ox} ${hy + hh * .72 + oy} ${hx - hw + ox} ${hy - 10 * s + oy}Z`;
    const cb = id('cb'), ck = id('ck');
    let o = '';
    // --- saç (arka katman: uzun saç, topuz) ---
    const SR = sac && sac.renk || '#3A2A20';
    if (sac && sac.tip === 'uzun') o += `<path d="M${hx - hw * 1.15} ${hy - 20 * s} Q${hx - hw * 1.3} ${hy + hh * 1.6} ${hx - hw * .6} ${hy + hh * 1.75} L${hx + hw * .6} ${hy + hh * 1.75} Q${hx + hw * 1.3} ${hy + hh * 1.6} ${hx + hw * 1.15} ${hy - 20 * s}Z" fill="${SR}"/>`;
    if (sac && sac.tip === 'topuz') o += `<circle cx="${hx}" cy="${hy - hh * 1.12}" r="${hw * .5}" fill="${SR}"/>`;
    // --- gövde (büst) ---
    const KR = kiyafet.renk, gov = (ox = 0, oy = 0) => `M${x - 170 * s + ox} ${y + oy} Q${x - 175 * s + ox} ${y - 120 * s + oy} ${x - 70 * s + ox} ${y - 135 * s + oy} L${x + 70 * s + ox} ${y - 135 * s + oy} Q${x + 175 * s + ox} ${y - 120 * s + oy} ${x + 170 * s + ox} ${y + oy}Z`;
    o += `<rect x="${x - 34 * s}" y="${hy + hh * .6}" width="${68 * s}" height="${80 * s}" rx="${20 * s}" fill="${T1}"/>`; // boyun
    o += `<defs><clipPath id="${ck}"><path d="${gov()}"/></clipPath></defs><g clip-path="url(#${ck})"><path d="${gov()}" fill="${kiyafet.rim || '#FFFFFF'}" opacity=".9"/><path d="${gov(-8 * s, 8 * s)}" fill="${KR}"/>` +
      `<circle cx="${x - 210 * s}" cy="${y + 40 * s}" r="${190 * s}" fill="#000" opacity=".12"/></g>`;
    const yaka = kiyafet.yaka || 'gomlek', GR = kiyafet.gomlek || '#FFFFFF';
    if (yaka === 'gomlek' || yaka === 'ceket' || yaka === 'onluk') {
      o += `<path d="M${x - 44 * s} ${y - 134 * s} L${x} ${y - 70 * s} L${x + 44 * s} ${y - 134 * s} L${x + 22 * s} ${y - 134 * s} L${x} ${y - 104 * s} L${x - 22 * s} ${y - 134 * s}Z" fill="${GR}"/>`;
      o += `<path d="M${x - 22 * s} ${y - 134 * s} L${x} ${y - 104 * s} L${x + 22 * s} ${y - 134 * s} L${x + 24 * s} ${y - 118 * s} L${x} ${y - 70 * s} L${x - 24 * s} ${y - 118 * s}Z" fill="${GR}"/>`;
    }
    if (yaka === 'ceket' || yaka === 'onluk') { const L = yaka === 'onluk' ? '#F4F6F8' : KR, LK = yaka === 'onluk' ? '#D6DCE2' : '#000';
      if (yaka === 'onluk') o += `<path d="${gov()}" fill="#F4F6F8" clip-path="url(#${ck})"/><path d="M${x - 40 * s} ${y - 134 * s} L${x} ${y + 5} L${x + 40 * s} ${y - 134 * s}Z" fill="${kiyafet.renk}"/>`;
      o += `<path d="M${x - 70 * s} ${y - 135 * s} L${x - 8 * s} ${y - 20 * s} L${x - 40 * s} ${y - 70 * s} L${x - 60 * s} ${y - 90 * s}Z" fill="${LK}" opacity=".18"/><path d="M${x + 70 * s} ${y - 135 * s} L${x + 8 * s} ${y - 20 * s} L${x + 40 * s} ${y - 70 * s} L${x + 60 * s} ${y - 90 * s}Z" fill="${LK}" opacity=".12"/>`;
      if (yaka === 'onluk') o += `<rect x="${x + 60 * s}" y="${y - 70 * s}" width="${50 * s}" height="${8 * s}" rx="${4 * s}" fill="#D6DCE2"/><rect x="${x + 70 * s}" y="${y - 84 * s}" width="${8 * s}" height="${26 * s}" rx="${4 * s}" fill="#3D8BFD"/>`; }
    if (yaka === 'bogazli') o += `<rect x="${x - 50 * s}" y="${y - 150 * s}" width="${100 * s}" height="${40 * s}" rx="${20 * s}" fill="${KR}"/><rect x="${x - 50 * s}" y="${y - 150 * s}" width="${100 * s}" height="${12 * s}" rx="${6 * s}" fill="#FFFFFF" opacity=".25"/>`;
    if (yaka === 'elbise') o += `<path d="M${x - 60 * s} ${y - 134 * s} Q${x} ${y - 70 * s} ${x + 60 * s} ${y - 134 * s}Z" fill="${T1}"/>`;
    if (kravat) o += `<path d="M${x - 9 * s} ${y - 104 * s} L${x + 9 * s} ${y - 104 * s} L${x + 14 * s} ${y - 30 * s} L${x} ${y - 10 * s} L${x - 14 * s} ${y - 30 * s}Z" fill="${kravat}"/><rect x="${x - 11 * s}" y="${y - 112 * s}" width="${22 * s}" height="${16 * s}" rx="${6 * s}" fill="${kravat}"/>`;
    if (papyon) o += `<path d="M${x} ${y - 104 * s} L${x - 30 * s} ${y - 120 * s} Q${x - 36 * s} ${y - 104 * s} ${x - 30 * s} ${y - 88 * s}Z M${x} ${y - 104 * s} L${x + 30 * s} ${y - 120 * s} Q${x + 36 * s} ${y - 104 * s} ${x + 30 * s} ${y - 88 * s}Z" fill="${papyon}"/><circle cx="${x}" cy="${y - 104 * s}" r="${8 * s}" fill="${papyon}"/>`;
    // --- kulaklar + baş (rim light) ---
    o += `<ellipse cx="${hx - hw}" cy="${hy + 8 * s}" rx="${16 * s}" ry="${24 * s}" fill="${T1}"/><ellipse cx="${hx + hw}" cy="${hy + 8 * s}" rx="${16 * s}" ry="${24 * s}" fill="${T0}"/>`;
    if (kupe) o += `<circle cx="${hx - hw}" cy="${hy + 34 * s}" r="${7 * s}" fill="${kupe}"/><circle cx="${hx + hw}" cy="${hy + 34 * s}" r="${7 * s}" fill="${kupe}"/>`;
    o += `<defs><clipPath id="${cb}"><path d="${bas()}"/></clipPath></defs><g clip-path="url(#${cb})"><path d="${bas()}" fill="${T2}"/><path d="${bas(-6 * s, 6 * s)}" fill="${T0}"/>` +
      `<circle cx="${hx - hw * 1.1}" cy="${hy + hh * .9}" r="${hw * 1.05}" fill="${T1}" opacity=".45"/>`;
    // yaş çizgileri
    if (yas > 0) o += `<path d="M${hx - 34 * s} ${hy - 62 * s} q${34 * s} ${-8 * s} ${68 * s} 0" stroke="${T1}" stroke-width="${4 * s}" fill="none" stroke-linecap="round" opacity="${.7 * yas}"/><path d="M${hx - 26 * s} ${hy - 48 * s} q${26 * s} ${-6 * s} ${52 * s} 0" stroke="${T1}" stroke-width="${4 * s}" fill="none" stroke-linecap="round" opacity="${.6 * yas}"/>` +
      `<path d="M${hx - 50 * s} ${hy + 36 * s} q${-8 * s} ${22 * s} ${4 * s} ${40 * s}" stroke="${T1}" stroke-width="${4 * s}" fill="none" stroke-linecap="round" opacity="${.6 * yas}"/><path d="M${hx + 50 * s} ${hy + 36 * s} q${8 * s} ${22 * s} ${-4 * s} ${40 * s}" stroke="${T1}" stroke-width="${4 * s}" fill="none" stroke-linecap="round" opacity="${.6 * yas}"/>`;
    o += `</g>`;
    // --- saç (ön katman) ---
    const tip = sac && sac.tip;
    const tepe = (alt = .35) => `M${hx - hw * 1.04} ${hy - hh * alt} Q${hx - hw * 1.08} ${hy - hh * 1.18} ${hx} ${hy - hh * 1.14} Q${hx + hw * 1.08} ${hy - hh * 1.18} ${hx + hw * 1.04} ${hy - hh * alt} Q${hx + hw * .7} ${hy - hh * .78} ${hx} ${hy - hh * .8} Q${hx - hw * .7} ${hy - hh * .78} ${hx - hw * 1.04} ${hy - hh * alt}Z`;
    if (tip === 'kisa' || tip === 'uzun' || tip === 'topuz') o += `<path d="${tepe(.3)}" fill="${SR}"/>`;
    if (tip === 'kisaYan' || tip === 'geriTarali') { o += `<path d="${tepe(.3)}" fill="${SR}"/>`; o += tip === 'kisaYan' ? `<path d="M${hx - hw * .3} ${hy - hh * 1.14} Q${hx - hw * .2} ${hy - hh * .9} ${hx - hw * .35} ${hy - hh * .78}" stroke="${T0}" stroke-width="${5 * s}" fill="none" opacity=".35"/>` : `<path d="M${hx - hw * .5} ${hy - hh * .95} Q${hx} ${hy - hh * 1.1} ${hx + hw * .5} ${hy - hh * .95}" stroke="#FFFFFF" stroke-width="${6 * s}" fill="none" opacity=".25" stroke-linecap="round"/>`; }
    if (tip === 'yanlar') o += `<path d="M${hx - hw * 1.06} ${hy - hh * .1} Q${hx - hw * 1.1} ${hy - hh * .75} ${hx - hw * .7} ${hy - hh * .8} L${hx - hw * .8} ${hy - hh * .1}Z" fill="${SR}"/><path d="M${hx + hw * 1.06} ${hy - hh * .1} Q${hx + hw * 1.1} ${hy - hh * .75} ${hx + hw * .7} ${hy - hh * .8} L${hx + hw * .8} ${hy - hh * .1}Z" fill="${SR}"/>`;
    if (tip === 'daginik') { let d = ''; for (let i = 0; i < 11; i++) { const a = Math.PI * (1.05 + i * .09), r1 = hw * (1.18 + .22 * ((i * 7) % 3) / 2); d += `<ellipse cx="${hx + Math.cos(a) * r1}" cy="${hy - 20 * s + Math.sin(a) * r1 * 1.05}" rx="${34 * s}" ry="${26 * s}" fill="${SR}" transform="rotate(${a * 57} ${hx + Math.cos(a) * r1} ${hy - 20 * s + Math.sin(a) * r1 * 1.05})"/>`; }
      o += d + `<path d="M${hx - hw * 1.1} ${hy - hh * .2} Q${hx - hw * 1.2} ${hy + hh * .3} ${hx - hw * .95} ${hy + hh * .2}Z M${hx + hw * 1.1} ${hy - hh * .2} Q${hx + hw * 1.2} ${hy + hh * .3} ${hx + hw * .95} ${hy + hh * .2}Z" fill="${SR}"/>`; }
    if (tip === 'dalgali' || tip === 'kivircik') { const k = tip === 'kivircik' ? 14 : 8; for (let i = 0; i < k; i++) { const a = Math.PI * (1.02 + i * (.96 / (k - 1))); o += `<circle cx="${hx + Math.cos(a) * hw * 1.02}" cy="${hy - 16 * s + Math.sin(a) * hh * 1.02}" r="${(tip === 'kivircik' ? 26 : 36) * s}" fill="${SR}"/>`; } }
    if (cicek) for (let i = 0; i < 5; i++) { const a = Math.PI * (1.15 + i * .17); const cx = hx + Math.cos(a) * hw * 1.1, cy = hy - 20 * s + Math.sin(a) * hh * 1.08; o += `<circle cx="${cx}" cy="${cy}" r="${24 * s}" fill="${cicek[i % cicek.length]}"/><circle cx="${cx}" cy="${cy}" r="${8 * s}" fill="#FFE14D"/>`; }
    // --- yüz ---
    const gy = hy + 4 * s, ga = 34 * s, bx = bak[0] * 4 * s, by = bak[1] * 4 * s;
    const kr = kas && kas.renk || (sac && sac.renk) || '#3A2A20', kk = kas && kas.kalin ? 9 : 6;
    for (const sx of [-1, 1]) { const ex = hx + sx * ga;
      o += acik > .2 ? `<ellipse cx="${ex + bx}" cy="${gy + by}" rx="${9 * s}" ry="${(ifade === 'saskin' ? 13 : 11) * s * acik}" fill="#2A1E1A"/><circle cx="${ex + bx + 3 * s}" cy="${gy + by - 4 * s}" r="${3 * s}" fill="#FFFFFF"/>` : `<rect x="${ex - 10 * s}" y="${gy - 2 * s}" width="${20 * s}" height="${4 * s}" rx="${2 * s}" fill="#2A1E1A"/>`;
      const ky = gy - (ifade === 'saskin' ? 34 : 26) * s; o += `<path d="M${ex - 18 * s} ${ky + (kas && kas.cati ? sx * -4 * s : 3 * s)} Q${ex} ${ky - 6 * s} ${ex + 18 * s} ${ky + (kas && kas.cati ? sx * 4 * s : 3 * s)}" stroke="${kr}" stroke-width="${kk * s}" fill="none" stroke-linecap="round"/>`; }
    if (kas && kas.birlesik) o += `<path d="M${hx - 12 * s} ${gy - 28 * s} Q${hx} ${gy - 32 * s} ${hx + 12 * s} ${gy - 28 * s}" stroke="${kr}" stroke-width="${kk * s}" fill="none" stroke-linecap="round"/>`;
    o += `<path d="M${hx - 4 * s} ${gy + 10 * s} Q${hx - 12 * s} ${gy + 34 * s} ${hx - 2 * s} ${gy + 38 * s} Q${hx + 6 * s} ${gy + 40 * s} ${hx + 10 * s} ${gy + 34 * s}" fill="${T1}"/>`; // burun
    if (biyik) o += biyik.tip === 'ince' ? `<path d="M${hx - 26 * s} ${gy + 54 * s} Q${hx} ${gy + 42 * s} ${hx + 26 * s} ${gy + 54 * s} Q${hx} ${gy + 50 * s} ${hx - 26 * s} ${gy + 54 * s}Z" fill="${biyik.renk}"/>` :
      `<path d="M${hx - 44 * s} ${gy + 62 * s} Q${hx - 30 * s} ${gy + 36 * s} ${hx} ${gy + 44 * s} Q${hx + 30 * s} ${gy + 36 * s} ${hx + 44 * s} ${gy + 62 * s} Q${hx + 20 * s} ${gy + 56 * s} ${hx} ${gy + 58 * s} Q${hx - 20 * s} ${gy + 56 * s} ${hx - 44 * s} ${gy + 62 * s}Z" fill="${biyik.renk}"/>`;
    if (sakal) { const SK = sakal.renk || SR;
      if (sakal.tip === 'tam') o += `<path d="M${hx - hw * .98} ${hy + 4 * s} Q${hx - hw * .9} ${hy + hh * 1.25} ${hx} ${hy + hh * 1.3} Q${hx + hw * .9} ${hy + hh * 1.25} ${hx + hw * .98} ${hy + 4 * s} Q${hx + hw * .6} ${gy + 44 * s} ${hx} ${gy + 48 * s} Q${hx - hw * .6} ${gy + 44 * s} ${hx - hw * .98} ${hy + 4 * s}Z" fill="${SK}"/><path d="M${hx - 18 * s} ${gy + 66 * s} Q${hx} ${gy + 74 * s} ${hx + 18 * s} ${gy + 66 * s}" stroke="${T1}" stroke-width="${6 * s}" fill="none" stroke-linecap="round"/>`;
      if (sakal.tip === 'keci') o += `<path d="M${hx - 22 * s} ${gy + 70 * s} Q${hx} ${gy + 130 * s} ${hx + 22 * s} ${gy + 70 * s}Z" fill="${SK}"/>`;
      if (sakal.tip === 'kirli') o += `<path d="M${hx - hw * .9} ${hy + 20 * s} Q${hx - hw * .8} ${hy + hh * 1.02} ${hx} ${hy + hh * 1.02} Q${hx + hw * .8} ${hy + hh * 1.02} ${hx + hw * .9} ${hy + 20 * s} Q${hx + hw * .5} ${gy + 60 * s} ${hx} ${gy + 62 * s} Q${hx - hw * .5} ${gy + 60 * s} ${hx - hw * .9} ${hy + 20 * s}Z" fill="${SK}" opacity=".35"/>`; }
    if (!sakal || sakal.tip !== 'tam') {
      const ay = gy + 64 * s; o += ifade === 'gulumse' ? `<path d="M${hx - 26 * s} ${ay - 4 * s} Q${hx} ${ay + 22 * s} ${hx + 26 * s} ${ay - 4 * s} Q${hx} ${ay + 8 * s} ${hx - 26 * s} ${ay - 4 * s}Z" fill="#8E3B3B"/>` :
        ifade === 'saskin' ? `<ellipse cx="${hx}" cy="${ay + 4 * s}" rx="${11 * s}" ry="${14 * s}" fill="#8E3B3B"/>` : `<path d="M${hx - 18 * s} ${ay} Q${hx} ${ay + 6 * s} ${hx + 18 * s} ${ay}" stroke="#8E3B3B" stroke-width="${6 * s}" fill="none" stroke-linecap="round"/>`; }
    if (gozluk) { const GR = gozluk.renk || '#2A2430', w = 7 * s;
      for (const sx of [-1, 1]) { const ex = hx + sx * ga; o += gozluk.tip === 'kare' ? `<rect x="${ex - 26 * s}" y="${gy - 20 * s}" width="${52 * s}" height="${38 * s}" rx="${10 * s}" fill="#BFE8FF" fill-opacity=".18" stroke="${GR}" stroke-width="${w}"/>` : `<circle cx="${ex}" cy="${gy}" r="${24 * s}" fill="#BFE8FF" fill-opacity=".18" stroke="${GR}" stroke-width="${w}"/>`; }
      o += `<path d="M${hx - 10 * s} ${gy - 4 * s} Q${hx} ${gy - 10 * s} ${hx + 10 * s} ${gy - 4 * s}" stroke="${GR}" stroke-width="${w}" fill="none"/>`; }
    return o;
  }
  return { kisi, TEN };
})();
