/* #8 Limon suyu soyguncusu — tekrar eden çizimler (SVG metni). Işık sağ üstten. Kontur yok.
   Palet: gece şehir laciverti + limon sarısı + güvenlik kamerası yeşili + psikoloji pembesi. */
const L = (() => {
  let n = 0; const id = p => `l${p}${++n}`;
  const P = { z1: '#0B1433', z2: '#1E1B4B', orta: '#2E3A7A', limon: '#FFE14D', limonK: '#E0A91F', limonA: '#FFF6B8', yesil: '#6BF0A6', pembe: '#E056C1',
    kirmizi: '#FF4F6B', mavi: '#3C8CFF', krem: '#FFF3D6', kahve: '#8A4B22', gok1: '#3C6EA8', gok2: '#9CCBE6' };
  function bg({ ust = P.z1, alt = P.z2, neb = P.pembe, nx = 540, ny = 760, nr = 640, no = .16 } = {}) {
    const g = id('bg'), nb = id('nb');
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient>` +
      `<radialGradient id="${nb}"><stop offset="0" stop-color="${neb}" stop-opacity="${no}"/><stop offset="1" stop-color="${neb}" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="1080" height="1920" fill="url(#${g})"/><circle cx="${nx}" cy="${ny}" r="${nr}" fill="url(#${nb})"/>`;
  }
  const parca = (seed, adet, renk = P.krem) => K.yildizlar({ adet, seed, renk, alan: [0, 0, 1080, 1920] });
  // bütün limon (uçları sivri, tombul), rim light
  function limonYol(x, y, r, ox = 0, oy = 0) {
    x += ox; y += oy;
    return `M${x - r * 1.3} ${y} Q${x - r * .95} ${y - r * .98} ${x} ${y - r * .92} Q${x + r * .95} ${y - r * .98} ${x + r * 1.3} ${y} Q${x + r * .95} ${y + r * .98} ${x} ${y + r * .92} Q${x - r * .95} ${y + r * .98} ${x - r * 1.3} ${y}Z`;
  }
  function limon(x, y, r) {
    const c = id('lm');
    return `<defs><clipPath id="${c}"><path d="${limonYol(x, y, r)}"/></clipPath></defs><g clip-path="url(#${c})"><path d="${limonYol(x, y, r)}" fill="${P.limonA}"/>` +
      `<path d="${limonYol(x, y, r, -r * .08, r * .08)}" fill="${P.limon}"/><circle cx="${x - r * .9}" cy="${y + r * .9}" r="${r * 1.15}" fill="${P.limonK}" opacity=".5"/></g>` +
      `<circle cx="${x + r * .35}" cy="${y - r * .45}" r="${r * .12}" fill="#FFFFFF" opacity=".6"/>`;
  }
  // limon kesiti (yarım): dış kabuk + açık iç + dilim kamaları
  function dilim(x, y, r, rot = 0) {
    let o = `<g transform="rotate(${rot} ${x} ${y})"><circle cx="${x}" cy="${y}" r="${r}" fill="${P.limon}"/><circle cx="${x}" cy="${y}" r="${r * .88}" fill="${P.limonA}"/>`;
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, b = a + Math.PI * 2 / 9 - .12, rr = r * .78;
      o += `<path d="M${x + Math.cos(a + .06) * r * .12} ${y + Math.sin(a + .06) * r * .12} L${x + Math.cos(a + .06) * rr} ${y + Math.sin(a + .06) * rr} Q${x + Math.cos((a + b) / 2) * rr * 1.08} ${y + Math.sin((a + b) / 2) * rr * 1.08} ${x + Math.cos(b) * rr} ${y + Math.sin(b) * rr}Z" fill="#FFD83A"/>`; }
    return o + `<circle cx="${x}" cy="${y}" r="${r * .1}" fill="${P.limonA}"/></g>`;
  }
  const damla = (x, y, s = 1, renk = P.limon, op = 1) => `<path d="M${x} ${y - 22 * s} Q${x + 14 * s} ${y - 2 * s} ${x + 12 * s} ${y + 6 * s} A${12 * s} ${12 * s} 0 1 1 ${x - 12 * s} ${y + 6 * s} Q${x - 14 * s} ${y - 2 * s} ${x} ${y - 22 * s}Z" fill="${renk}" opacity="${op}"/>`;
  // Gufi'nin yüzündeki limon cilası (M.canli ust parametresi için): parlak sarı sürme izleri
  function cila(x, y, boy, k = 1, t = 0) { // x,y = Gufi ayak tabanı; yarı saydam limon parlaklığı + iki ince iz + pırıltı
    if (k <= 0) return ''; const s = boy / 140, w = boy, top = y - boy * 1.06, pr = .6 + .4 * Math.sin(t * 5);
    let o = `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${boy}" rx="${boy * .28}" fill="${P.limon}" opacity="${.22 * k}"/>`;
    for (const sx of [-.3, .3]) o += `<ellipse cx="${x + sx * w}" cy="${top + boy * .7}" rx="${w * .1 * k}" ry="${w * .045}" fill="${P.limonA}" opacity=".75"/>`;
    o += `<path d="M${x + boy * .3} ${top + boy * .12} l${5 * s} ${-12 * s} l${5 * s} ${12 * s} l${12 * s} ${5 * s} l${-12 * s} ${5 * s} l${-5 * s} ${12 * s} l${-5 * s} ${-12 * s} l${-12 * s} ${-5 * s}Z" fill="#FFFFFF" opacity="${k * pr}"/>`;
    return o;
  }
  function banka(x, y, s = 1, isim = 'BANKA', renk = '#E8E2D6') { // y = taban
    const w = 330 * s, h = 360 * s; let o = `<ellipse cx="${x}" cy="${y + 6}" rx="${w * .6}" ry="${16 * s}" fill="#000" opacity=".18"/>`;
    o += `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="${14 * s}" fill="${renk}"/><rect x="${x - w / 2}" y="${y - h}" width="${w * .14}" height="${h}" rx="${10 * s}" fill="#B9B2C9" opacity=".55"/>`;
    o += `<path d="M${x - w * .6} ${y - h} L${x} ${y - h - 110 * s} L${x + w * .6} ${y - h}Z" fill="${renk}"/><path d="M${x - w * .6} ${y - h} L${x} ${y - h - 110 * s} L${x - w * .2} ${y - h}Z" fill="#B9B2C9" opacity=".45"/>`;
    o += `<rect x="${x - w * .62}" y="${y - h - 6 * s}" width="${w * 1.24}" height="${22 * s}" rx="${11 * s}" fill="#CFC6DA"/>`;
    for (let i = 0; i < 4; i++) o += `<rect x="${x - w * .4 + i * w * .25}" y="${y - h + 70 * s}" width="${34 * s}" height="${h - 90 * s}" rx="${17 * s}" fill="#FFFFFF" opacity=".75"/>`;
    o += `<rect x="${x - 50 * s}" y="${y - 150 * s}" width="${100 * s}" height="${150 * s}" rx="${50 * s}" fill="${P.orta}"/>`;
    o += `<text x="${x}" y="${y - h + 48 * s}" font-size="${40 * s}" font-weight="900" text-anchor="middle" letter-spacing="${4 * s}" style="fill:${P.z2}">${isim}</text>`;
    return o;
  }
  function gunes(x, y, r, t = 0) { return K.glow({ x, y, r: r * 3, renk: '#FFD27A', guc: .7 }) + `<circle cx="${x}" cy="${y}" r="${r * (1.12 + .03 * Math.sin(t * 3))}" fill="#FFE9B8" opacity=".5"/>` + K.kure({ x, y, r, renk: '#FFC24A', rim: '#FFF1C9', golge: '#F08A2A', isikYon: [1, -1] }); }
  function bulut(x, y, s = 1, op = .9) { return `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${46 * s}" fill="#F4FAFF"/><circle cx="${x + 50 * s}" cy="${y + 10 * s}" r="${36 * s}" fill="#F4FAFF"/><circle cx="${x - 52 * s}" cy="${y + 14 * s}" r="${32 * s}" fill="#F4FAFF"/><rect x="${x - 84 * s}" y="${y + 10 * s}" width="${170 * s}" height="${36 * s}" rx="${18 * s}" fill="#F4FAFF"/></g>`; }
  function mum(x, y, t = 0, s = 1) { // y = taban
    const fl = 1 + .1 * Math.sin(t * 17) + .05 * Math.sin(t * 29);
    return `<rect x="${x - 26 * s}" y="${y - 150 * s}" width="${52 * s}" height="${150 * s}" rx="${18 * s}" fill="${P.krem}"/><rect x="${x - 26 * s}" y="${y - 150 * s}" width="${14 * s}" height="${150 * s}" rx="${7 * s}" fill="#D9CFC0"/>` +
      K.glow({ x, y: y - 190 * s, r: 150 * s, renk: '#FFB547', guc: .8 }) + `<ellipse cx="${x}" cy="${y - 190 * s}" rx="${16 * s}" ry="${34 * s * fl}" fill="#FFB547"/><ellipse cx="${x}" cy="${y - 182 * s}" rx="${8 * s}" ry="${16 * s}" fill="#FFF3D6"/>`;
  }
  function polaroid(x, y, s, dev, icerik = '', rot = 0) { // dev 0..1 banyo
    const w = 420 * s, h = 500 * s, c = id('pl'), iw = w - 50 * s, ih = iw;
    return `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - w / 2 + 10}" y="${y - h / 2 + 14}" width="${w}" height="${h}" rx="${14 * s}" fill="#000" opacity=".25"/>` +
      `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${14 * s}" fill="#FAF7F0"/>` +
      `<defs><clipPath id="${c}"><rect x="${x - iw / 2}" y="${y - h / 2 + 25 * s}" width="${iw}" height="${ih}" rx="${6 * s}"/></clipPath></defs>` +
      `<g clip-path="url(#${c})"><rect x="${x - iw / 2}" y="${y - h / 2 + 25 * s}" width="${iw}" height="${ih}" fill="#1A1622"/><g opacity="${dev}">${icerik}</g>` +
      `<rect x="${x - iw / 2}" y="${y - h / 2 + 25 * s}" width="${iw}" height="${ih}" fill="#3A3346" opacity="${.9 * (1 - dev)}"/></g></g>`;
  }
  function tavanLamba(x, y, s = 1, isik = 1) { // y = tavan
    return `<rect x="${x - 4 * s}" y="${y}" width="${8 * s}" height="${120 * s}" fill="#5E6FB8"/>` + K.glow({ x, y: y + 170 * s, r: 260 * s, renk: '#FFD27A', guc: .6 * isik }) +
      `<path d="M${x - 90 * s} ${y + 190 * s} Q${x - 70 * s} ${y + 110 * s} ${x} ${y + 110 * s} Q${x + 70 * s} ${y + 110 * s} ${x + 90 * s} ${y + 190 * s}Z" fill="#4A5AA8"/><path d="M${x + 20 * s} ${y + 116 * s} Q${x + 70 * s} ${y + 116 * s} ${x + 90 * s} ${y + 190 * s} L${x + 60 * s} ${y + 190 * s}Z" fill="#8FA2F0" opacity=".6"/>` +
      `<ellipse cx="${x}" cy="${y + 192 * s}" rx="${50 * s}" ry="${20 * s}" fill="#FFF3D6" opacity="${.5 + .5 * isik}"/>`;
  }
  function fotoMakine(x, y, s = 1, rot = 0, flas = 0) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-120" y="-80" width="240" height="160" rx="36" fill="#F6F1E7"/><rect x="-120" y="-80" width="240" height="44" rx="22" fill="#D9CFC0"/>` +
      `<rect x="-120" y="30" width="240" height="50" rx="20" fill="#2E3A7A"/><circle cx="0" cy="8" r="56" fill="#1E1B4B"/><circle cx="0" cy="8" r="36" fill="#0B1433"/><circle cx="-12" cy="-4" r="11" fill="#FFF3D6" opacity=".5"/>` +
      `<rect x="60" y="-66" width="40" height="24" rx="8" fill="${flas > 0 ? '#FFFFFF' : '#8FA2F0'}"/>` + (flas > 0 ? K.glow({ x: 80, y: -54, r: 240, renk: '#FFFFFF', guc: flas }) : '') + `</g>`;
  }
  function tv(x, y, s, icerik = '', t = 0) { // x,y = ekran merkezi
    const w = 700 * s, h = 520 * s, c = id('tv');
    let o = `<rect x="${x - 6 * s - 120 * s}" y="${y - h / 2 - 150 * s}" width="${8 * s}" height="${150 * s}" rx="4" fill="#5E6FB8" transform="rotate(-25 ${x} ${y - h / 2})"/><rect x="${x + 120 * s}" y="${y - h / 2 - 150 * s}" width="${8 * s}" height="${150 * s}" rx="4" fill="#5E6FB8" transform="rotate(25 ${x} ${y - h / 2})"/>`;
    o += `<rect x="${x - w / 2 - 40 * s}" y="${y - h / 2 - 40 * s}" width="${w + 80 * s}" height="${h + 80 * s}" rx="${60 * s}" fill="#6B3FA0"/><rect x="${x - w / 2 - 40 * s}" y="${y - h / 2 - 40 * s}" width="${w + 80 * s}" height="${40 * s}" rx="${20 * s}" fill="#A57FD8" opacity=".5"/>`;
    o += `<rect x="${x - 150 * s}" y="${y + h / 2 + 40 * s}" width="${60 * s}" height="${60 * s}" rx="${14 * s}" fill="#4A2A78"/><rect x="${x + 90 * s}" y="${y + h / 2 + 40 * s}" width="${60 * s}" height="${60 * s}" rx="${14 * s}" fill="#4A2A78"/>`;
    o += `<defs><clipPath id="${c}"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${36 * s}"/></clipPath></defs><g clip-path="url(#${c})"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="#0E2A22"/>${icerik}`;
    for (let i = 0; i < 26; i++) o += `<rect x="${x - w / 2}" y="${y - h / 2 + i * h / 26 + ((t * 40) % (h / 26))}" width="${w}" height="${3 * s}" fill="#000" opacity=".18"/>`;
    return o + `</g>` + K.glow({ x, y, r: w * .7, renk: P.yesil, guc: .18 });
  }
  function polisIsik(t, guc = 1) {
    const k = Math.sin(t * 9) > 0 ? 1 : 0;
    return K.glow({ x: 0, y: 700, r: 700, renk: P.kirmizi, guc: .55 * guc * k }) + K.glow({ x: 1080, y: 700, r: 700, renk: P.mavi, guc: .55 * guc * (1 - k) });
  }
  function kapi(x, y, s = 1, sars = 0) { // y = taban
    return `<g transform="translate(${sars} 0)"><rect x="${x - 110 * s}" y="${y - 440 * s}" width="${220 * s}" height="${440 * s}" rx="${20 * s}" fill="#5A3A5E"/><rect x="${x - 110 * s}" y="${y - 440 * s}" width="${36 * s}" height="${440 * s}" rx="${14 * s}" fill="#3E2642"/>` +
      `<rect x="${x - 70 * s}" y="${y - 400 * s}" width="${140 * s}" height="${150 * s}" rx="${16 * s}" fill="#6E4A72"/><rect x="${x - 70 * s}" y="${y - 220 * s}" width="${140 * s}" height="${160 * s}" rx="${16 * s}" fill="#6E4A72"/><circle cx="${x + 70 * s}" cy="${y - 220 * s}" r="${14 * s}" fill="#FFB547"/></g>`;
  }
  function gazete(x, y, s = 1, rot = 0, foto = '') {
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-300" y="-380" width="600" height="760" rx="14" fill="#EEE7D8"/><rect x="-300" y="-380" width="60" height="760" rx="10" fill="#D6CCB8" opacity=".6"/>`;
    o += `<text x="0" y="-310" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="3" style="fill:#2A2430">GÜNLÜK HABER</text><rect x="-260" y="-285" width="520" height="8" rx="4" fill="#2A2430"/>`;
    o += `<text x="0" y="-205" font-size="62" font-weight="900" text-anchor="middle" style="fill:#2A2430">LİMONLU</text><text x="0" y="-140" font-size="62" font-weight="900" text-anchor="middle" style="fill:#2A2430">SOYGUNCU</text>`;
    o += `<rect x="-250" y="-100" width="260" height="260" rx="10" fill="#1A1622"/>${foto}`;
    for (let i = 0; i < 9; i++) o += `<rect x="40" y="${-95 + i * 30}" width="${200 - (i % 3) * 30}" height="12" rx="6" fill="#B8AFA0"/>`;
    for (let i = 0; i < 5; i++) o += `<rect x="-250" y="${200 + i * 30}" width="${490 - (i % 2) * 90}" height="12" rx="6" fill="#B8AFA0"/>`;
    return o + `</g>`;
  }
  function gozluk(x, y, s = 1, parla = 0) {
    const cam = (cx) => `<circle cx="${cx}" cy="0" r="120" fill="#1E1B4B" opacity=".35"/><circle cx="${cx}" cy="0" r="120" fill="none" stroke="#2A2430" stroke-width="22"/><path d="M${cx + 20} -80 L${cx + 70} -40" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" opacity="${.35 + .5 * parla}"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${cam(-150)}${cam(150)}<path d="M-40 -10 Q0 -40 40 -10" fill="none" stroke="#2A2430" stroke-width="20" stroke-linecap="round"/></g>`;
  }
  function terazi(x, y, aci = 0, sol = '', sag = '') { // y = direk tepesi
    const r = aci * Math.PI / 180, dx = Math.cos(r) * 260, dy = Math.sin(r) * 260;
    let o = `<rect x="${x - 14}" y="${y}" width="28" height="360" rx="14" fill="#8FA2F0"/><rect x="${x - 110}" y="${y + 340}" width="220" height="40" rx="20" fill="#5E6FB8"/><circle cx="${x}" cy="${y}" r="26" fill="#FFB547"/>`;
    o += `<line x1="${x - dx}" y1="${y - dy}" x2="${x + dx}" y2="${y + dy}" stroke="#C9D3FF" stroke-width="18" stroke-linecap="round"/>`;
    for (const [px, py, ic] of [[x - dx, y - dy, sol], [x + dx, y + dy, sag]]) o += `<line x1="${px}" y1="${py}" x2="${px}" y2="${py + 130}" stroke="#C9D3FF" stroke-width="6"/><path d="M${px - 110} ${py + 130} Q${px} ${py + 210} ${px + 110} ${py + 130}Z" fill="#E8E2D6"/>` + ic.replace(/PX/g, px).replace(/PY/g, py + 110);
    return o;
  }
  function balon(x, y, w, h, kuyruk = [-1, 1]) {
    return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2.4}" fill="${P.krem}"/><path d="M${x + kuyruk[0] * w * .2} ${y + h / 2 - 6} L${x + kuyruk[0] * w * .34} ${y + h / 2 + 70} L${x + kuyruk[0] * w * .05} ${y + h / 2 - 6}Z" fill="${P.krem}"/>`;
  }
  return { P, bg, parca, limon, dilim, damla, cila, banka, gunes, bulut, mum, polaroid, tavanLamba, fotoMakine, tv, polisIsik, kapi, gazete, gozluk, terazi, balon };
})();
