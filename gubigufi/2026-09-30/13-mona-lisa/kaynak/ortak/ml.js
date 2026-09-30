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

/* ---------- v2: referans tarz (tek renk ailesi, dolu mekân, ön plan çerçeve, nokta gözlü karakterler) ---------- */
const ML2 = (() => {
  const LOUVRE = { fon1: '#E2808A', fon2: '#C95F71', orta: '#A8465E', koyu: '#82304A', cokKoyu: '#5A1E34', acik: '#F9CFCB', vurgu: '#FFC24C', vurgu2: '#2E9A9C', isik: '#FFEDDC', ten: '#F7B39A' };
  const r = (x, y, w, h, rx, f, op = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" opacity="${op}"/>`;
  function kadife(x1, x2, y, T) { let o = ''; for (const x of [x1, x2]) o += r(x - 10, y - 150, 20, 150, 10, T.vurgu) + `<circle cx="${x}" cy="${y - 158}" r="18" fill="${T.vurgu}"/>` + r(x - 34, y - 12, 68, 16, 8, T.vurgu);
    return o + `<path d="M${x1} ${y - 130} Q${(x1 + x2) / 2} ${y - 60} ${x2} ${y - 130}" stroke="#C0283C" stroke-width="16" fill="none" stroke-linecap="round"/>`; }
  function heykel(x, y, s, T) { return `<g transform="translate(${x} ${y}) scale(${s})">` + r(-70, -260, 140, 260, 10, T.acik) + r(-86, -276, 172, 30, 10, T.isik) + r(-70, -260, 30, 260, 8, '#FFFFFF', .3) +
    `<path d="M-70 -276 Q-80 -380 0 -390 Q80 -380 70 -276Z" fill="${T.isik}"/><circle cx="0" cy="-450" r="62" fill="${T.isik}"/><path d="M-62 -470 Q-40 -530 20 -520 Q60 -500 62 -460 Q30 -490 -10 -488Z" fill="${T.acik}"/></g>`; }
  function bank(x, y, s, T) { return `<g transform="translate(${x} ${y}) scale(${s})">` + r(-160, -90, 320, 40, 16, T.cokKoyu) + r(-150, -50, 24, 50, 10, T.cokKoyu) + r(126, -50, 24, 50, 10, T.cokKoyu) + r(-150, -100, 300, 14, 7, T.vurgu, .9) + `</g>`; }
  function catiIsigi(T, t = 0) { let o = r(0, 0, 1080, 260, 0, T.koyu) + r(80, 40, 920, 180, 18, T.isik, .9); for (let i = 1; i < 6; i++) o += r(80 + i * 153, 40, 10, 180, 0, T.koyu, .5); o += r(80, 124, 920, 10, 0, T.koyu, .5);
    for (let i = 0; i < 4; i++) { const x0 = 160 + i * 230; o += `<path d="M${x0} 220 L${x0 + 110} 220 L${x0 + 260} 1250 L${x0 - 60} 1250Z" fill="${T.isik}" opacity="${.09 + .02 * Math.sin(t + i)}"/>`; } return o; }
  function muzeSalon(T, t = 0, { tablolar = true, zeminY = 1150 } = {}) {
    let o = `<rect width="1080" height="1920" fill="${T.fon2}"/>` + catiIsigi(T, t);
    o += r(0, 260, 1080, zeminY - 260, 0, T.fon1) + r(0, 330, 1080, 14, 0, T.vurgu, .8);
    for (let i = 0; i < 6; i++) o += r(20 + i * 180, 900, 150, zeminY - 920, 12, T.orta, .6);            // lambri panelleri
    if (tablolar) { o += CV.cerceveResim(60, 470, 140, 170, T, 'dag') + CV.cerceveResim(880, 470, 150, 190, T, 'yuz'); }
    // mermer zemin karoları
    o += r(0, zeminY, 1080, 1920 - zeminY, 0, T.acik);
    for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) if ((i + j) % 2) o += r(i * 160 - (j % 2) * 80, zeminY + j * 110, 160, 110, 0, T.isik, .55);
    o += r(0, zeminY, 1080, 16, 0, T.koyu, .5);
    return o;
  }
  function onCerceve(T) { return `<rect x="0" y="0" width="1080" height="80" fill="${T.cokKoyu}"/><path d="M0 0 H200 Q120 40 90 140 Q60 260 0 300Z" fill="${T.cokKoyu}"/><path d="M1080 0 H880 Q960 40 990 140 Q1020 260 1080 300Z" fill="${T.cokKoyu}"/>` +
    `<path d="M0 60 Q400 110 540 90 Q680 110 1080 60 V0 H0Z" fill="#C0283C"/><path d="M0 60 Q400 110 540 90 Q680 110 1080 60" stroke="${T.vurgu}" stroke-width="10" fill="none"/>`; }  // perde saçağı
  // atölye
  function atolye(T) { let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + r(0, 1100, 1080, 820, 0, T.orta);
    o += r(60, 330, 600, 380, 20, T.koyu, .35); for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) o += `<circle cx="${100 + i * 100}" cy="${370 + j * 90}" r="6" fill="${T.cokKoyu}" opacity=".5"/>`;
    o += `<path d="M120 380 L150 520 L180 380Z" fill="${T.cokKoyu}"/>` + r(240, 390, 20, 160, 10, T.cokKoyu) + r(220, 380, 60, 30, 10, T.vurgu) + `<circle cx="420" cy="450" r="50" fill="none" stroke="${T.cokKoyu}" stroke-width="12"/>` + r(520, 400, 100, 16, 8, T.cokKoyu);
    o += r(780, 300, 20, 820, 10, T.koyu) + r(920, 300, 20, 820, 10, T.koyu); for (let i = 0; i < 7; i++) o += r(780, 360 + i * 110, 160, 16, 8, T.koyu);   // merdiven
    o += r(40, 960, 700, 40, 12, T.cokKoyu) + r(60, 1000, 30, 200, 12, T.cokKoyu) + r(690, 1000, 30, 200, 12, T.cokKoyu);        // tezgâh
    for (let i = 0; i < 3; i++) o += `<rect x="${120 + i * 70}" y="${700 + i * 8}" width="120" height="260" rx="8" fill="#DFF6F4" opacity=".45" transform="rotate(${-8 + i * 4} ${180 + i * 70} 960)"/>`;
    return o + CV.lamba(620, 960, .7, T) + CV.kupa(480, 960, 1, T.vurgu, 1, 0) + CV.bitki(980, 1500, 1, T); }
  // Paris sokağı + gazete büfesi
  function sokak(T, t = 0) { let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>`;
    for (let b = 0; b < 3; b++) { const x = b * 380 - 40; o += r(x, 260 + (b % 2) * 60, 360, 1000, 10, b % 2 ? T.fon2 : T.acik) + r(x - 10, 240 + (b % 2) * 60, 380, 40, 10, T.koyu);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) o += r(x + 40 + i * 110, 330 + (b % 2) * 60 + j * 160, 70, 110, 10, T.isik) + r(x + 30 + i * 110, 440 + (b % 2) * 60 + j * 160, 90, 12, 6, T.cokKoyu); }
    o += r(0, 1180, 1080, 740, 0, T.orta); for (let j = 0; j < 8; j++) for (let i = 0; i < 12; i++) o += `<ellipse cx="${i * 100 + (j % 2) * 50}" cy="${1220 + j * 80}" rx="42" ry="22" fill="${T.koyu}" opacity=".35"/>`;
    o += r(870, 560, 22, 640, 11, T.cokKoyu) + `<circle cx="881" cy="545" r="46" fill="${T.vurgu}"/>` + K.glow({ x: 881, y: 545, r: 120, renk: T.vurgu, guc: .5 });
    return o; }
  function bufe(x, y, T) { let o = r(x - 220, y - 520, 440, 520, 20, T.koyu) + r(x - 250, y - 580, 500, 80, 30, T.vurgu); for (let i = 0; i < 6; i++) o += `<path d="M${x - 250 + i * 83} ${y - 500} L${x - 167 + i * 83} ${y - 500} L${x - 167 + i * 83} ${y - 450} Q${x - 208 + i * 83} ${y - 420} ${x - 250 + i * 83} ${y - 450}Z" fill="${i % 2 ? '#FFFFFF' : T.vurgu}"/>`;
    for (let i = 0; i < 4; i++) o += r(x - 190 + i * 95, y - 400, 80, 110, 6, '#F3E6CC') + r(x - 180 + i * 95, y - 390, 60, 10, 4, '#3A2A20'); return o; }
  // çatı katı odası
  function cati(T, t = 0) { let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + `<path d="M0 0 L1080 0 L1080 180 L0 560Z" fill="${T.orta}"/><path d="M0 560 L1080 180" stroke="${T.koyu}" stroke-width="30"/>`;
    o += `<circle cx="820" cy="470" r="130" fill="${T.koyu}"/><circle cx="820" cy="470" r="110" fill="#BFE3F2"/><path d="M790 580 L820 370 L850 580Z" fill="#6A6A80"/><rect x="760" y="520" width="120" height="70" fill="#9AA8B8"/>` + r(700, 466, 240, 10, 0, T.koyu) + r(815, 360, 10, 220, 0, T.koyu);
    o += r(0, 1180, 1080, 740, 0, T.orta); for (let i = 0; i < 6; i++) o += r(0, 1220 + i * 120, 1080, 8, 0, T.koyu, .3);
    o += r(40, 960, 360, 220, 30, T.vurgu2) + r(40, 900, 110, 180, 30, T.acik) + r(60, 1180, 20, 60, 8, T.cokKoyu) + r(360, 1180, 20, 60, 8, T.cokKoyu);   // yatak
    o += CV.kupa(560, 1180, 1, T.vurgu, 1, t) + r(620, 1110, 18, 70, 6, '#FFF6E0') + K.glow({ x: 629, y: 1100, r: 60, renk: '#FFD27A', guc: .7 }) + `<ellipse cx="629" cy="1100" rx="8" ry="16" fill="#FFB547"/>`;
    return o; }
  return { LOUVRE, kadife, heykel, bank, catiIsigi, muzeSalon, onCerceve, atolye, sokak, bufe, cati };
})();
