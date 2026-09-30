/* #13 Mona Lisa hırsızlığı — tekrar eden çizimler (SVG metni). Işık sağ üstten. Kontur yok.
   OLGUN palet: bordo salon duvarı, altın çerçeve, krem mermer, sepya gazete, terrakota Floransa, adaçayı/zeytin manzara. */
const ML = (() => {
  let n = 0; const id = p => `ml${p}${++n}`;
  const P = { bordo: '#7A2E3A', bordoK: '#5E2230', krem: '#F6EBDD', mermer: '#EDE0CC', altin: '#D8A032', altinK: '#A8761C', altinA: '#F2CE7A', sepya: '#E9DDC4', murekkep: '#3A2A20',
    terrakota: '#C0583A', petrol: '#1F6F78', zeytin: '#6E7443', adacayi: '#8FAE8B', lacivert: '#1B1640' };
  function zemin(ust, alt) { const g = id('z'); return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${g})"/>`; }
  function salon(isik = 1) {
    let o = zemin('#8A3644', P.bordo);
    o += `<rect x="0" y="330" width="1080" height="16" fill="${P.altin}" opacity=".8"/>`;                  // tablo rayı
    o += `<rect x="0" y="1140" width="1080" height="780" fill="${P.mermer}"/><rect x="0" y="1140" width="1080" height="22" fill="#D9C7AA"/>`;
    for (let i = 0; i < 7; i++) o += `<rect x="${i * 180 - 20}" y="1162" width="4" height="758" fill="#D9C7AA" opacity=".6"/>`;
    o += `<rect x="0" y="1040" width="1080" height="100" fill="${P.bordoK}"/><rect x="0" y="1040" width="1080" height="10" fill="${P.altinK}" opacity=".6"/>`;
    o += K.glow({ x: 700, y: 300, r: 700, renk: '#FFE6B8', guc: .28 * isik });
    return o;
  }
  // altın çerçeve; icerik kırpılır; bos=true → duvar + 4 demir çivi
  function cerceve(x, y, w, h, icerik = '', bos = false, gorunur = 1) {
    const c = id('cr'), b = w * .1;
    let o = `<g opacity="${gorunur}"><rect x="${x - w / 2 - b + 10}" y="${y - h / 2 - b + 16}" width="${w + 2 * b}" height="${h + 2 * b}" rx="10" fill="#000" opacity=".25"/>` +
      `<rect x="${x - w / 2 - b}" y="${y - h / 2 - b}" width="${w + 2 * b}" height="${h + 2 * b}" rx="10" fill="${P.altinK}"/><rect x="${x - w / 2 - b * .8}" y="${y - h / 2 - b * .8}" width="${w + 1.6 * b}" height="${h + 1.6 * b}" rx="8" fill="${P.altin}"/>` +
      `<rect x="${x - w / 2 - b * .45}" y="${y - h / 2 - b * .45}" width="${w + .9 * b}" height="${h + .9 * b}" rx="6" fill="${P.altinA}"/><rect x="${x - w / 2 - b * .25}" y="${y - h / 2 - b * .25}" width="${w + .5 * b}" height="${h + .5 * b}" rx="4" fill="${P.altinK}"/>`;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) o += `<circle cx="${x + sx * (w / 2 + b * .6)}" cy="${y + sy * (h / 2 + b * .6)}" r="${b * .35}" fill="${P.altinA}"/>`;
    o += `<defs><clipPath id="${c}"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}"/></clipPath></defs>`;
    if (bos) { o += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="${P.bordoK}"/>`; for (const [sx, sy] of [[-.35, -.4], [.35, -.4], [-.35, .4], [.35, .4]]) o += `<rect x="${x + sx * w - 7}" y="${y + sy * h - 7}" width="14" height="14" rx="3" fill="#3A3A40"/><rect x="${x + sx * w - 2}" y="${y + sy * h - 22}" width="4" height="18" fill="#3A3A40"/>`; }
    else o += `<g clip-path="url(#${c})">${icerik}</g>`;
    return o + `</g>`;
  }
  // Mona Lisa (flat yorum): puslu manzara + koyu elbise + orta ayrık uzun koyu saç + kavuşturulmuş eller; kaşsız, hafif gülümseme
  function monaLisa(x, y, w, h) {
    const g = id('ms'); let o = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9B98E"/><stop offset=".55" stop-color="#7E8A5C"/><stop offset="1" stop-color="#5A5236"/></linearGradient></defs>`;
    o += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="url(#${g})"/>`;
    o += `<path d="M${x - w / 2} ${y - h * .08} Q${x - w * .3} ${y - h * .2} ${x - w * .15} ${y - h * .1} L${x - w / 2} ${y + h * .05}Z" fill="#6E7F5A" opacity=".8"/><path d="M${x + w / 2} ${y - h * .12} Q${x + w * .32} ${y - h * .22} ${x + w * .12} ${y - h * .08} L${x + w / 2} ${y + h * .02}Z" fill="#6E7F5A" opacity=".8"/>`;
    o += `<path d="M${x - w * .45} ${y + h * .02} Q${x - w * .3} ${y - h * .04} ${x - w * .2} ${y + h * .06}" stroke="#C9B98A" stroke-width="${w * .02}" fill="none" opacity=".7"/>`;  // kıvrılan yol
    o += `<ellipse cx="${x + w * .32}" cy="${y - h * .18}" rx="${w * .12}" ry="${h * .02}" fill="#C8D6C4" opacity=".7"/>`; // puslu göl
    const s = w / 420;
    o += KS.kisi({ x, y: y + h / 2 + 70 * s, boy: 430 * s, bak: [-.35, 0], ten: 'bugday', sac: { tip: 'uzun', renk: '#2B1D14' }, kas: { renk: '#D9A57C' }, ifade: 'notr', kiyafet: { renk: '#3B3024', yaka: 'elbise', rim: '#6B5A40' } });
    // kavuşturulmuş eller
    o += `<ellipse cx="${x - 40 * s}" cy="${y + h / 2 - 30 * s}" rx="${60 * s}" ry="${26 * s}" fill="#D9A57C"/><ellipse cx="${x + 30 * s}" cy="${y + h / 2 - 20 * s}" rx="${62 * s}" ry="${26 * s}" fill="#E4B48A"/>`;
    o += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="#C9A45C" opacity=".12"/>`; // eski vernik sıcaklığı
    return o;
  }
  // Peruggia (flat, benzeyen): koyu kısa saç, kalın bıyık, kasket, koyu ceket
  function peruggia(o = {}) {
    const { x = 540, y = 1150, boy = 420 } = o, s = boy / 360, hx = x, hy = y - 250 * s;
    let g = KS.kisi(Object.assign({ ten: 'acik', sac: { tip: 'kisa', renk: '#1E1612' }, biyik: { renk: '#1E1612' }, kas: { renk: '#1E1612', kalin: true }, ifade: 'notr', kiyafet: { renk: '#4A4A52', yaka: 'ceket', gomlek: '#E8E2D6' } }, o));
    g += `<path d="M${hx - 100 * s} ${hy - 70 * s} Q${hx - 90 * s} ${hy - 150 * s} ${hx} ${hy - 150 * s} Q${hx + 90 * s} ${hy - 150 * s} ${hx + 100 * s} ${hy - 70 * s}Z" fill="#5A4E44"/><path d="M${hx - 104 * s} ${hy - 72 * s} Q${hx + 20 * s} ${hy - 96 * s} ${hx + 150 * s} ${hy - 60 * s} Q${hx + 20 * s} ${hy - 58 * s} ${hx - 104 * s} ${hy - 60 * s}Z" fill="#453B33"/>`;
    return g;
  }
  function vitrin(x, y, w, h) {
    return `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="10" fill="#D8ECEA" opacity=".35"/><rect x="${x - w / 2}" y="${y - 30}" width="${w}" height="30" rx="8" fill="${P.altinK}"/><path d="M${x - w / 2 + 20} ${y - h + 20} L${x - w / 2 + 70} ${y - h + 20} L${x - w / 2 + 20} ${y - h + 120}Z" fill="#FFFFFF" opacity=".4"/>`;
  }
  // önlüklü silüet (yüzsüz), yürüme fazı; tasiyor: önlük altında dikdörtgen çıkıntı
  function onluklu(x, y, s = 1, faz = 0, tasiyor = 0) {
    const a = Math.sin(faz) * 16;
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-38" y="-150" width="30" height="150" rx="15" fill="#3A3230" transform="rotate(${a} -23 -150)"/><rect x="8" y="-150" width="30" height="150" rx="15" fill="#3A3230" transform="rotate(${-a} 23 -150)"/>`;
    o += `<path d="M-90 -140 Q-100 -380 -40 -400 L40 -400 Q100 -380 90 -140Z" fill="#F4F1EA"/><path d="M40 -400 Q100 -380 90 -140 L60 -140 Q70 -370 30 -392Z" fill="#DCD6CB"/>`;
    if (tasiyor > 0) o += `<rect x="-70" y="${-330}" width="${140 * tasiyor}" height="170" rx="18" fill="#E8E2D6"/>`;
    o += `<circle cx="0" cy="-460" r="58" fill="#E3B48E"/><path d="M-58 -470 Q-50 -530 0 -528 Q50 -530 58 -470 Q30 -500 0 -498 Q-30 -500 -58 -470Z" fill="#1E1612"/></g>`;
    return o;
  }
  function takvim(x, y, gun, ay = 'AĞUSTOS', s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-170" y="-150" width="340" height="310" rx="36" fill="#FFFFFF"/><rect x="-170" y="-150" width="340" height="84" rx="36" fill="${P.terrakota}"/><rect x="-170" y="-100" width="340" height="34" fill="${P.terrakota}"/>` +
      `<text x="0" y="-96" font-size="38" font-weight="900" text-anchor="middle" style="fill:#FFF3E0">${ay}</text><text x="0" y="100" font-size="150" font-weight="900" text-anchor="middle" style="fill:${P.lacivert}">${gun}</text></g>`;
  }
  function gazete(x, y, s, rot, manset, altManset = '', ic = '') {
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-300" y="-380" width="600" height="760" rx="10" fill="#000" opacity=".2" transform="translate(12 16)"/><rect x="-300" y="-380" width="600" height="760" rx="10" fill="${P.sepya}"/>`;
    o += `<text x="0" y="-320" font-size="40" font-weight="900" text-anchor="middle" letter-spacing="2" style="fill:${P.murekkep}">LE PETIT JOURNAL</text><rect x="-260" y="-300" width="520" height="6" fill="${P.murekkep}"/>`;
    o += manset + (altManset ? `<text x="0" y="-120" font-size="34" font-weight="700" text-anchor="middle" style="fill:${P.murekkep}">${altManset}</text>` : '') + ic;
    for (let i = 0; i < 7; i++) o += `<rect x="-260" y="${120 + i * 32}" width="${240 - (i % 3) * 30}" height="12" rx="6" fill="#B9A988"/><rect x="20" y="${120 + i * 32}" width="${240 - (i % 2) * 40}" height="12" rx="6" fill="#B9A988"/>`;
    return o + `</g>`;
  }
  function kuyrukKisi(x, y, s, renk, faz = 0) { // yüzsüz ziyaretçi silüeti (arkadan), y = zemin
    const b = Math.sin(faz) * 3;
    return `<g transform="translate(${x} ${y + b}) scale(${s})"><circle cx="0" cy="-330" r="46" fill="${renk}"/><path d="M-70 0 Q-80 -240 -30 -270 L30 -270 Q80 -240 70 0Z" fill="${renk}"/><rect x="-60" y="-40" width="120" height="40" rx="12" fill="#000" opacity=".12"/></g>`;
  }
  function sandik(x, y, s, acik = 0, ic = '') { // y = taban; acik 0..1 → kapak arkaya doğru açılır (dik durur)
    const kh = 70 + 90 * acik, ky = -200 - kh * acik;
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="8" rx="230" ry="20" fill="#000" opacity=".18"/>`;
    if (acik > .05) o += `<rect x="-205" y="${-200 - 150 * acik}" width="410" height="${150 * acik + 10}" rx="24" fill="#6E4630"/><rect x="-205" y="${-200 - 150 * acik}" width="410" height="16" rx="8" fill="${P.altinK}" opacity="${acik}"/>`;
    o += `<rect x="-210" y="-200" width="420" height="200" rx="18" fill="#8A5A3C"/><rect x="-190" y="-200" width="380" height="${40 * acik}" fill="#4A2E20"/>` + ic +
      `<rect x="-210" y="-120" width="420" height="18" fill="${P.altinK}"/><rect x="-20" y="-150" width="40" height="60" rx="8" fill="${P.altin}"/>`;
    if (acik <= .05) o += `<rect x="-210" y="-260" width="420" height="70" rx="30" fill="#9A6A48"/><rect x="-210" y="-230" width="420" height="16" fill="${P.altinK}"/>`;
    return o + `</g>`;
  }
  function flasPatlamasi(x, y, r, op) { let d = ''; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, b = a + Math.PI / 8; d += (i ? ' L' : 'M') + `${x + Math.cos(a) * r} ${y + Math.sin(a) * r} L${x + Math.cos(b) * r * .4} ${y + Math.sin(b) * r * .4}`; } return `<path d="${d}Z" fill="#FFF6E0" opacity="${op}"/>`; }
  return { P, zemin, salon, cerceve, monaLisa, peruggia, vitrin, onluklu, takvim, gazete, kuyrukKisi, sandik, flasPatlamasi };
})();
