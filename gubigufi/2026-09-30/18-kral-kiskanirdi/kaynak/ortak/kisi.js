/* gubigufi KİŞİ — gerçek kişilere BENZEYEN, bizim flat çizgi tarzımızda büst portre.
   Benzerlik; saç şekli/rengi, sakal-bıyık, gözlük, kaş, ten, yaş çizgileri ve kıyafet gibi ayırt edici özelliklerle kurulur.
   Kontur yok · rim light sağ üstten · yuvarlak formlar · REFERANS TARZ yüz: parlamasız koyu mor nokta göz, pembe yanak, küçük burun, ağız çizgisi.
   Kullanım: KS.kisi({ x, y, boy: 360, ten: 'acik', sac: { tip: 'daginik', renk: '#EDEDED' }, biyik: { renk: '#DCDCDC' }, kiyafet: { renk: '#6B5B4B', yaka: 'ceket' } })
   x,y = büstün alt-orta noktası; boy = toplam büst yüksekliği.
   Saç tipleri: kisa, kisaYan (yandan ayrık), kel, yanlar (tepe kel), daginik, dalgali, uzun, topuz, kivircik, geriTarali
   Sakal: tam, keci, kirli · Bıyık: {renk, tip:'kalin'|'ince'} · Gözlük: {tip:'yuvarlak'|'kare', renk}
   Yaka: gomlek, ceket, onluk (beyaz önlük), bogazli, elbise · kravat/papyon: renk */
const KS = (() => {
  let n = 0; const id = p => `k${p}${++n}`;
  const TEN = { cokAcik: ['#FBE3D0', '#E9C2A6', '#FFF3EA'], acik: ['#F2C9A6', '#D9A580', '#FFE6D2'], bugday: ['#DDA77A', '#BD8659', '#F6CDA8'], esmer: ['#B97A4E', '#955B35', '#DDA37A'], koyu: ['#7A4A2E', '#5C341E', '#A36A45'] };
  function kisi({ x = 540, y = 1300, boy = 360, ten = 'acik', sac = { tip: 'kisa', renk: '#3A2A20' }, sakal = null, biyik = null, gozluk = null, kas = null,
    ifade = 'notr', bak = [0, 0], kiyafet = { renk: '#3D5A80', yaka: 'gomlek' }, kravat = null, papyon = null, yas = 0, kupe = null, acik = 1, cicek = null, yanak = true, gozRenk = '#3A2350' } = {}) {
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
      // referans tarz: parlamasız koyu mor nokta göz + pembe yanak
      o += acik > .2 ? `<ellipse cx="${ex + bx}" cy="${gy + by}" rx="${10 * s}" ry="${(ifade === 'saskin' ? 14 : 12) * s * acik}" fill="${gozRenk}"/>` : `<rect x="${ex - 10 * s}" y="${gy - 2 * s}" width="${20 * s}" height="${4 * s}" rx="${2 * s}" fill="${gozRenk}"/>`;
      if (yanak) o += `<ellipse cx="${ex + sx * 12 * s}" cy="${gy + 34 * s}" rx="${17 * s}" ry="${10 * s}" fill="#FF6F8E" opacity=".35"/>`;
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
  // TAM BOY KARAKTER (referans tarz: büyük yuvarlak baş, kakül, nokta göz, yanak, sade gövde, kapsül kollar/bacaklar)
  // poz: 'dur' | 'selam' (sağ kol yukarı) | 'goster' (sağ kol yana) | 'otur'. x,y = ayak tabanı ortası; boy = toplam boy
  function karakter({ x = 540, y = 1400, boy = 700, ten = '#F7B8A4', sac = { tip: 'kakul', renk: '#1B1F5E' }, ust = '#E8505B', alt = '#1B1F5E', ayakkabi = '#FFFFFF', poz = 'dur', t = 0, bak = [0, 0], ifade = 'notr', gozRenk = '#3A2350', adim = null, biyik = null, yon = 1, kiyafet = {} } = {}) {
    const KY = Object.assign({ ceket: null, gomlek: '#FFFDF6', kravat: null, yelek: null, etek: null, etekBoy: 'uzun', sapka: null, sapkaRenk: '#2A2440' }, kiyafet);
    const s = boy / 700, hx = x, hy = y - 560 * s, hr = 118 * s, tenK = '#E0957E';
    let o = `<ellipse cx="${x}" cy="${y + 4}" rx="${120 * s}" ry="${18 * s}" fill="#000" opacity=".15"/>`;
    const kap = (x1, y1, x2, y2, w, r) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${r}" stroke-width="${w}" stroke-linecap="round"/>`;
    // arka saç (uzun/atkuyruğu)
    if (sac.tip === 'uzun') o += `<path d="M${hx - hr * 1.05} ${hy} Q${hx - hr * 1.2} ${hy + hr * 1.9} ${hx - hr * .5} ${hy + hr * 2} L${hx + hr * .5} ${hy + hr * 2} Q${hx + hr * 1.2} ${hy + hr * 1.9} ${hx + hr * 1.05} ${hy}Z" fill="${sac.renk}"/>`;
    if (sac.tip === 'atkuyrugu') o += `<path d="M${hx + hr * .8} ${hy - hr * .5} Q${hx + hr * 1.9} ${hy - hr * .6} ${hx + hr * 1.7} ${hy + hr * .5} Q${hx + hr * 1.3} ${hy} ${hx + hr * .9} ${hy - hr * .1}Z" fill="${sac.renk}"/>`;
    // bacaklar
    const ad = adim != null ? Math.sin(adim) * 60 * s : (poz === 'otur' ? 0 : Math.sin(t * 2) * 2);  // adim: yürüme fazı
    o += kap(x - 34 * s, y - 250 * s, x - 38 * s + ad, y - 20 * s, 44 * s, alt) + kap(x + 34 * s, y - 250 * s, x + 38 * s - ad, y - 20 * s, 44 * s, alt);
    o += `<ellipse cx="${x - 44 * s + ad}" cy="${y - 10 * s}" rx="${34 * s}" ry="${18 * s}" fill="${ayakkabi}"/><ellipse cx="${x + 44 * s - ad}" cy="${y - 10 * s}" rx="${34 * s}" ry="${18 * s}" fill="${ayakkabi}"/>`;
    // etek (dönem): bacakları örter — uzun (bilek) / diz
    if (KY.etek) { const ey = KY.etekBoy === 'uzun' ? y - 24 * s : y - 150 * s; o += `<path d="M${x - 80 * s} ${y - 250 * s} L${x - (KY.etekBoy === 'uzun' ? 150 : 120) * s} ${ey} Q${x} ${ey + 16 * s} ${x + (KY.etekBoy === 'uzun' ? 150 : 120) * s} ${ey} L${x + 80 * s} ${y - 250 * s}Z" fill="${KY.etek}"/><path d="M${x + 20 * s} ${y - 250 * s} L${x + 60 * s} ${ey + 6 * s}" stroke="#000" stroke-opacity=".08" stroke-width="${14 * s}"/>`; }
    // gövde (tişört)
    o += `<path d="M${x - 95 * s} ${y - 230 * s} Q${x - 105 * s} ${y - 420 * s} ${x - 60 * s} ${y - 440 * s} L${x + 60 * s} ${y - 440 * s} Q${x + 105 * s} ${y - 420 * s} ${x + 95 * s} ${y - 230 * s}Z" fill="${ust}"/>`;
    o += `<path d="M${x + 30 * s} ${y - 440 * s} L${x + 60 * s} ${y - 440 * s} Q${x + 105 * s} ${y - 420 * s} ${x + 95 * s} ${y - 230 * s} L${x + 60 * s} ${y - 230 * s}Z" fill="#FFFFFF" opacity=".12"/>`;
    // ceket / yelek / kravat (dönem)
    if (KY.ceket || KY.yelek) { const c = KY.ceket || KY.yelek;
      o += `<path d="M${x - 97 * s} ${y - 220 * s} Q${x - 107 * s} ${y - 420 * s} ${x - 62 * s} ${y - 442 * s} L${x - 18 * s} ${y - 442 * s} L${x} ${y - 330 * s} L${x + 18 * s} ${y - 442 * s} L${x + 62 * s} ${y - 442 * s} Q${x + 107 * s} ${y - 420 * s} ${x + 97 * s} ${y - 220 * s}Z" fill="${c}"/>`;
      o += `<path d="M${x - 18 * s} ${y - 442 * s} L${x} ${y - 330 * s} L${x + 18 * s} ${y - 442 * s}Z" fill="${KY.gomlek}"/><path d="M${x - 18 * s} ${y - 442 * s} L${x - 40 * s} ${y - 380 * s} L${x - 4 * s} ${y - 350 * s}" fill="#000" opacity=".12"/>`;
      o += [0, 1].map(i => `<circle cx="${x + 6 * s}" cy="${y - (300 - i * 45) * s}" r="${6 * s}" fill="#000" opacity=".25"/>`).join(''); }
    if (KY.kravat) o += `<path d="M${x - 8 * s} ${y - 440 * s} L${x + 8 * s} ${y - 440 * s} L${x + 12 * s} ${y - 360 * s} L${x} ${y - 340 * s} L${x - 12 * s} ${y - 360 * s}Z" fill="${KY.kravat}"/>`;
    // kollar
    const omz = [[x - 88 * s, y - 410 * s], [x + 88 * s, y - 410 * s]];
    const kolS = adim != null ? Math.sin(adim) * 40 * s : 0;
    const solEl = [x - 130 * s - kolS, y - 250 * s];
    let sagEl = [x + 130 * s, y - 250 * s];
    if (poz === 'selam') sagEl = [x + 170 * s + Math.sin(t * 9) * 25 * s, y - 600 * s];
    if (poz === 'goster') sagEl = [x + 260 * s, y - 420 * s];
    if (poz === 'tasi') { sagEl = [x + 40 * s, y - 300 * s]; }
    const solEl2 = poz === 'tasi' ? [x - 40 * s, y - 300 * s] : solEl;
    if (KY.ceket) { const kc = KY.ceket, ara = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      o += kap(omz[0][0], omz[0][1], ...ara(omz[0], solEl2, .8), 42 * s, kc) + kap(omz[1][0], omz[1][1], ...ara(omz[1], sagEl, .8), 42 * s, kc) + `<circle cx="${solEl2[0]}" cy="${solEl2[1]}" r="${20 * s}" fill="${ten}"/><circle cx="${sagEl[0]}" cy="${sagEl[1]}" r="${20 * s}" fill="${ten}"/>`; }
    else o += kap(omz[0][0], omz[0][1], solEl2[0], solEl2[1], 38 * s, ten) + kap(omz[1][0], omz[1][1], sagEl[0], sagEl[1], 38 * s, ten);

    o += `<circle cx="${omz[0][0]}" cy="${omz[0][1] + 10 * s}" r="${30 * s}" fill="${KY.ceket || ust}"/><circle cx="${omz[1][0]}" cy="${omz[1][1] + 10 * s}" r="${30 * s}" fill="${KY.ceket || ust}"/>`;
    // boyun + baş
    o += `<rect x="${hx - 22 * s}" y="${hy + hr * .8}" width="${44 * s}" height="${40 * s}" fill="${tenK}"/>`;
    o += `<circle cx="${hx}" cy="${hy}" r="${hr}" fill="${ten}"/><circle cx="${hx - hr * .9}" cy="${hy + 10 * s}" r="${18 * s}" fill="${ten}"/><circle cx="${hx + hr * .9}" cy="${hy + 10 * s}" r="${18 * s}" fill="${ten}"/>`;
    // ön saç: kakül / kısa
    if (sac.tip === 'kakul' || sac.tip === 'uzun' || sac.tip === 'atkuyrugu') o += `<path d="M${hx - hr * 1.08} ${hy + hr * .5} Q${hx - hr * 1.2} ${hy - hr * 1.15} ${hx} ${hy - hr * 1.12} Q${hx + hr * 1.2} ${hy - hr * 1.15} ${hx + hr * 1.08} ${hy + hr * .5} L${hx + hr * .85} ${hy + hr * .5} L${hx + hr * .8} ${hy - hr * .25} Q${hx} ${hy - hr * .3} ${hx - hr * .8} ${hy - hr * .25} L${hx - hr * .85} ${hy + hr * .5}Z" fill="${sac.renk}"/>`;
    else o += `<path d="M${hx - hr * 1.02} ${hy - hr * .1} Q${hx - hr * 1.1} ${hy - hr * 1.15} ${hx} ${hy - hr * 1.1} Q${hx + hr * 1.1} ${hy - hr * 1.15} ${hx + hr * 1.02} ${hy - hr * .1} Q${hx + hr * .6} ${hy - hr * .55} ${hx} ${hy - hr * .5} Q${hx - hr * .6} ${hy - hr * .55} ${hx - hr * 1.02} ${hy - hr * .1}Z" fill="${sac.renk}"/>`;
    // şapka (dönem): fotr · melon · kasket · fes · bone (1920'ler kadın) · hasir
    if (KY.sapka) { const c = KY.sapkaRenk, ty = hy - hr * .72;
      if (KY.sapka === 'fotr') o += `<ellipse cx="${hx}" cy="${ty + 6 * s}" rx="${hr * 1.55}" ry="${hr * .22}" fill="${c}"/><path d="M${hx - hr * .95} ${ty + 6 * s} Q${hx - hr} ${ty - hr * .75} ${hx} ${ty - hr * .82} Q${hx + hr} ${ty - hr * .75} ${hx + hr * .95} ${ty + 6 * s}Z" fill="${c}"/><path d="M${hx - hr * .4} ${ty - hr * .78} Q${hx} ${ty - hr * .55} ${hx + hr * .4} ${ty - hr * .78}" stroke="#000" stroke-opacity=".25" stroke-width="${8 * s}" fill="none"/><rect x="${hx - hr * .95}" y="${ty - hr * .22}" width="${hr * 1.9}" height="${hr * .2}" fill="#000" opacity=".3"/>`;
      if (KY.sapka === 'melon') o += `<ellipse cx="${hx}" cy="${ty + 6 * s}" rx="${hr * 1.35}" ry="${hr * .18}" fill="${c}"/><path d="M${hx - hr * .9} ${ty + 6 * s} Q${hx - hr * .9} ${ty - hr * 1.0} ${hx} ${ty - hr} Q${hx + hr * .9} ${ty - hr * 1.0} ${hx + hr * .9} ${ty + 6 * s}Z" fill="${c}"/>`;
      if (KY.sapka === 'kasket') o += `<path d="M${hx - hr * 1.05} ${ty + hr * .2} Q${hx - hr} ${ty - hr * .7} ${hx + hr * .2} ${ty - hr * .72} Q${hx + hr * 1.2} ${ty - hr * .6} ${hx + hr * 1.1} ${ty + hr * .15}Z" fill="${c}"/><path d="M${hx - hr * .2} ${ty + hr * .12} L${hx + hr * 1.5} ${ty + hr * .2} Q${hx + hr * 1.5} ${ty + hr * .38} ${hx + hr * 1.2} ${ty + hr * .36} L${hx - hr * .2} ${ty + hr * .3}Z" fill="${c}"/>`;
      if (KY.sapka === 'fes') o += `<path d="M${hx - hr * .62} ${ty + hr * .1} L${hx - hr * .5} ${ty - hr * .95} L${hx + hr * .5} ${ty - hr * .95} L${hx + hr * .62} ${ty + hr * .1}Z" fill="${c || '#B8232F'}"/><path d="M${hx} ${ty - hr * .95} Q${hx + hr * .6} ${ty - hr * .8} ${hx + hr * .55} ${ty - hr * .1}" stroke="#1B1640" stroke-width="${8 * s}" fill="none"/><circle cx="${hx + hr * .55}" cy="${ty - hr * .05}" r="${10 * s}" fill="#1B1640"/>`;
      if (KY.sapka === 'bone') o += `<path d="M${hx - hr * 1.12} ${ty + hr * .55} Q${hx - hr * 1.2} ${ty - hr * .75} ${hx} ${ty - hr * .8} Q${hx + hr * 1.2} ${ty - hr * .75} ${hx + hr * 1.12} ${ty + hr * .55} Q${hx} ${ty + hr * .05} ${hx - hr * 1.12} ${ty + hr * .55}Z" fill="${c}"/><rect x="${hx - hr * 1.08}" y="${ty - hr * .02}" width="${hr * 2.16}" height="${hr * .18}" fill="#000" opacity=".25"/><circle cx="${hx + hr * .8}" cy="${ty + hr * .05}" r="${16 * s}" fill="#E8505B"/>`;
      if (KY.sapka === 'kukuleta') o += `<path d="M${hx - hr * 1.25} ${hy + hr * 1.1} Q${hx - hr * 1.35} ${hy - hr * 1.3} ${hx} ${hy - hr * 1.3} Q${hx + hr * 1.5} ${hy - hr * 1.35} ${hx + hr * 1.9} ${hy - hr * .2} Q${hx + hr * 1.5} ${hy - hr * .5} ${hx + hr * 1.25} ${hy + hr * .2} L${hx + hr * 1.25} ${hy + hr * 1.1} Q${hx} ${hy + hr * 1.5} ${hx - hr * 1.25} ${hy + hr * 1.1}Z" fill="${c}"/><path d="M${hx - hr * .95} ${hy + hr * .75} Q${hx - hr * 1.0} ${hy - hr * .95} ${hx} ${hy - hr * .98} Q${hx + hr * 1.0} ${hy - hr * .95} ${hx + hr * .95} ${hy + hr * .75}" fill="${ten}"/><path d="M${hx - hr * .95} ${hy + hr * .75} Q${hx - hr} ${hy - hr * .95} ${hx} ${hy - hr * .98} Q${hx + hr} ${hy - hr * .95} ${hx + hr * .95} ${hy + hr * .75}" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="${8 * s}"/>`;
      if (KY.sapka === 'basortu') o += `<path d="M${hx - hr * 1.15} ${hy + hr * 1.3} Q${hx - hr * 1.3} ${hy - hr * 1.25} ${hx} ${hy - hr * 1.22} Q${hx + hr * 1.3} ${hy - hr * 1.25} ${hx + hr * 1.15} ${hy + hr * 1.3} L${hx + hr * .9} ${hy + hr * 1.3} Q${hx + hr * .95} ${hy - hr * .85} ${hx} ${hy - hr * .88} Q${hx - hr * .95} ${hy - hr * .85} ${hx - hr * .9} ${hy + hr * 1.3}Z" fill="${c}"/><rect x="${hx - hr * .95}" y="${hy - hr * .85}" width="${hr * 1.9}" height="${hr * .22}" rx="${hr * .1}" fill="${c}"/>`;
      if (KY.sapka === 'hasir') o += `<ellipse cx="${hx}" cy="${ty + 6 * s}" rx="${hr * 1.7}" ry="${hr * .26}" fill="${c}"/><path d="M${hx - hr * .9} ${ty + 6 * s} Q${hx - hr * .9} ${ty - hr * .75} ${hx} ${ty - hr * .75} Q${hx + hr * .9} ${ty - hr * .75} ${hx + hr * .9} ${ty + 6 * s}Z" fill="${c}"/><rect x="${hx - hr * .9}" y="${ty - hr * .2}" width="${hr * 1.8}" height="${hr * .16}" fill="#C8323C"/>`; }
    // yüz
    const gy = hy + hr * .15, bx = bak[0] * 5 * s, by = bak[1] * 5 * s;
    for (const sx of [-1, 1]) { o += `<ellipse cx="${hx + sx * 42 * s + bx}" cy="${gy + by}" rx="${16 * s}" ry="${(ifade === 'saskin' ? 20 : 17) * s}" fill="${gozRenk}"/><ellipse cx="${hx + sx * 52 * s}" cy="${gy + 40 * s}" rx="${22 * s}" ry="${13 * s}" fill="#FF6F8E" opacity=".35"/>`; }
    o += `<rect x="${hx - 3 * s}" y="${gy + 16 * s}" width="${6 * s}" height="${16 * s}" rx="${3 * s}" fill="${tenK}"/>`;
    if (biyik) o += `<path d="M${hx - 34 * s} ${gy + 50 * s} Q${hx - 20 * s} ${gy + 30 * s} ${hx} ${gy + 38 * s} Q${hx + 20 * s} ${gy + 30 * s} ${hx + 34 * s} ${gy + 50 * s} Q${hx} ${gy + 44 * s} ${hx - 34 * s} ${gy + 50 * s}Z" fill="${biyik}"/>`;
    o += ifade === 'gulumse' ? `<path d="M${hx - 20 * s} ${gy + 52 * s} Q${hx} ${gy + 72 * s} ${hx + 20 * s} ${gy + 52 * s}" stroke="#B8475A" stroke-width="${7 * s}" fill="none" stroke-linecap="round"/>` :
      ifade === 'saskin' ? `<ellipse cx="${hx}" cy="${gy + 60 * s}" rx="${11 * s}" ry="${14 * s}" fill="#B8475A"/>` : `<rect x="${hx - 12 * s}" y="${gy + 54 * s}" width="${24 * s}" height="${7 * s}" rx="${3.5 * s}" fill="#B8475A"/>`;
    return o;
  }
  // DÖNEM GİYSİSİ: yıl + kişi indeksi (çeşitlilik için) → karakter()'e Object.assign ile eklenecek parçalar
  //   KS.karakter(Object.assign({ x, y, boy, t }, KS.donem(1911, i)))
  function donem(yil, i = 0) {
    const k = i % 2 === 0, sec = a => a[i % a.length];
    if (yil < 1500) return k ? { ust: sec(['#8E6A3A', '#6A7A4A', '#A8683A', '#7A5A4A']), alt: sec(['#5A4A3A', '#4A3A2A']), ayakkabi: '#3A2A1A', biyik: i % 3 === 0 ? '#4A3020' : null, sac: { tip: 'kisa', renk: sec(['#5A3A20', '#3A2A1A', '#8A5A2A']) }, ten: sec(['#F2C6A0', '#E8B08A']),
        kiyafet: { yelek: null, sapka: sec(['kukuleta', null, 'kukuleta']), sapkaRenk: sec(['#6A7A4A', '#8E5A3A', '#5A6A8A']) } }
      : { ust: sec(['#8A5A6A', '#5A6A8A', '#7A6A3A']), alt: '#4A3A2A', ayakkabi: '#3A2A1A', sac: { tip: 'kakul', renk: '#5A3A20' }, ten: sec(['#F2C6A0', '#E8B08A']), kiyafet: { etek: sec(['#8A5A6A', '#5A6A8A', '#7A6A3A']), etekBoy: 'uzun', sapka: 'basortu', sapkaRenk: '#F4EEE0' } };
    if (yil < 1925) return k ? { ust: '#FFFDF6', alt: sec(['#3A2A20', '#2A2440', '#4A3A2A']), ayakkabi: '#1B1410', biyik: i % 4 === 0 ? '#2A1E14' : null, sac: { tip: 'kisa', renk: sec(['#2A1E14', '#3A2A20']) },
        kiyafet: { ceket: sec(['#3A2A20', '#2A2440', '#5A4A3A']), yelek: null, kravat: sec(['#7E2E3A', '#1B1640']), sapka: sec(['melon', 'kasket', 'fes']), sapkaRenk: sec(['#1B1410', '#4A3A2A', '#B8232F']) } }
      : { ust: sec(['#E8D8C8', '#C8B8D8', '#D8C8B0']), alt: '#3A2A20', ayakkabi: '#1B1410', sac: { tip: 'uzun', renk: sec(['#3A2A20', '#1B1410']) }, kiyafet: { etek: sec(['#5A3A4A', '#3A4A5A', '#4A3A2A']), etekBoy: 'uzun', sapka: yil < 1915 ? 'fotr' : 'bone', sapkaRenk: sec(['#7E5A6A', '#5A6A7E']) } };
    if (yil < 1960) return k ? { ust: '#FFFDF6', alt: sec(['#3A3A48', '#4A3A2A']), ayakkabi: '#1B1410', biyik: i % 3 === 0 ? '#2A1E14' : null, sac: { tip: 'kisa', renk: '#2A1E14' }, kiyafet: { ceket: sec(['#4A4A5A', '#5A4A3A', '#3A3A48']), kravat: sec(['#7E2E3A', '#2E5A8C']), sapka: 'fotr', sapkaRenk: sec(['#3A3A48', '#5A4A3A']) } }
      : { ust: sec(['#E8505B', '#2E9A9C', '#FFB44C']), alt: '#3A2A20', ayakkabi: '#7E2E3A', sac: { tip: 'kisa', renk: sec(['#3A2A20', '#8A5A3C']) }, kiyafet: { etek: sec(['#E8505B', '#2E9A9C', '#FFB44C']), etekBoy: 'diz' } };
    if (yil < 1980) return k ? { ust: sec(['#E8A040', '#8A6FE0', '#6CC04A']), alt: sec(['#3A5A8C', '#8E5226']), sac: { tip: 'kisa', renk: '#3A2A20' }, biyik: i % 2 ? '#2A1E14' : null }
      : { ust: sec(['#FFB44C', '#E8505B']), alt: '#3A2A20', ayakkabi: '#FFFFFF', sac: { tip: 'uzun', renk: sec(['#1B1410', '#8A5A3C']) }, kiyafet: { etek: sec(['#FFB44C', '#8A6FE0']), etekBoy: 'diz' } };
    if (yil < 2000) return { ust: sec(['#8A6FE0', '#2E9A9C', '#E8505B', '#FFB44C']), alt: sec(['#3A5A8C', '#2A2440']), ayakkabi: '#FFFFFF', sac: { tip: k ? 'kisa' : 'atkuyrugu', renk: sec(['#3A2A20', '#1B1410']) }, kiyafet: k && i % 3 === 0 ? { ceket: '#4A4A5A', kravat: '#E8505B' } : {} };
    return {};
  }
  return { kisi, karakter, TEN, donem };
})();
