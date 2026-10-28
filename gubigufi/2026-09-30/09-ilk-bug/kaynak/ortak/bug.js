/* #9 İlk bug — tekrar eden çizimler (SVG metni). Işık sağ üstten. Kontur yok.
   Palet: makine dairesi koyu petrol + camgöbeği devre ışığı + el feneri amberi + hata kırmızısı. */
const B = (() => {
  let n = 0; const id = p => `b${p}${++n}`;
  const P = { z1: '#081A20', z2: '#0F2F38', orta: '#1C4A55', acik: '#2E6B78', cyan: '#00C2E0', amber: '#FFB547', kirmizi: '#FF4F6B', yesil: '#6BF0A6',
    krem: '#FFF3D6', kagit: '#F3E9D2', kagitG: '#DCCFB2', murekkep: '#27408B', guve: '#B9A58C', guveK: '#8A7560', guveA: '#E8DCC8' };
  function bg({ ust = P.z1, alt = P.z2, neb = P.cyan, nx = 540, ny = 760, nr = 640, no = .14 } = {}) {
    const g = id('bg'), nb = id('nb');
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient>` +
      `<radialGradient id="${nb}"><stop offset="0" stop-color="${neb}" stop-opacity="${no}"/><stop offset="1" stop-color="${neb}" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="1080" height="1920" fill="url(#${g})"/><circle cx="${nx}" cy="${ny}" r="${nr}" fill="url(#${nb})"/>`;
  }
  const parca = (seed, adet, renk = P.cyan) => K.yildizlar({ adet, seed, renk, alan: [0, 0, 1080, 1920] });
  // sevimli düz güve (maskot değil, sahne nesnesi): kanat çırpma = kanat(0..1)
  function guve(x, y, s = 1, kanat = 0, rot = 0, op = 1) {
    const k = .35 + .65 * Math.abs(Math.cos(kanat * Math.PI)); // 1 açık, .35 kapanık
    const kan = (sx) => `<g transform="scale(${sx * k} 1)"><path d="M0 -8 Q60 -70 110 -40 Q120 5 70 20 Q30 26 0 10Z" fill="${P.guveA}"/><path d="M0 -4 Q56 -60 100 -36 Q106 0 66 14 Q30 20 0 8Z" fill="${P.guve}"/><circle cx="62" cy="-16" r="12" fill="${P.guveK}" opacity=".7"/>` +
      `<path d="M0 8 Q46 20 70 56 Q50 80 20 60 Q4 40 0 18Z" fill="${P.guveK}"/></g>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}">${kan(-1)}${kan(1)}` +
      `<ellipse cx="0" cy="12" rx="16" ry="44" fill="#7A6450"/><ellipse cx="4" cy="4" rx="7" ry="30" fill="#A48C72" opacity=".7"/><circle cx="0" cy="-34" r="16" fill="#8E7760"/>` +
      `<path d="M-6 -46 Q-20 -80 -40 -86" stroke="#7A6450" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -46 Q20 -80 40 -86" stroke="#7A6450" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-7" cy="-37" r="4" fill="#1B1640"/><circle cx="7" cy="-37" r="4" fill="#1B1640"/></g>`;
  }
  function ekran(x, y, w, h, icerik = '', cer = '#2E6B78') {
    const c = id('ek');
    return `<rect x="${x - w / 2 - 30}" y="${y - h / 2 - 30}" width="${w + 60}" height="${h + 60}" rx="40" fill="${cer}"/><rect x="${x - w / 2 - 30}" y="${y - h / 2 - 30}" width="${w + 60}" height="34" rx="17" fill="#5FA3B0" opacity=".45"/>` +
      `<rect x="${x - 60}" y="${y + h / 2 + 30}" width="120" height="70" fill="${P.orta}"/><rect x="${x - 170}" y="${y + h / 2 + 95}" width="340" height="30" rx="15" fill="${P.acik}"/>` +
      `<defs><clipPath id="${c}"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="18"/></clipPath></defs><g clip-path="url(#${c})"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="#061418"/>${icerik}</g>`;
  }
  function kod(x0, y0, w, t, hata = 0, satir = 9) { // kayan kod satırları
    const R = K.rnd(4); let o = '';
    for (let i = 0; i < satir + 2; i++) { const yy = y0 + i * 44 - ((t * 30) % 44), ind = (i * 7 % 4) * 30, ln = 120 + ((i * 53) % 5) * 70;
      const kir = hata > 0 && (i % 3 === 1) ? hata : 0;
      o += `<rect x="${x0 + ind}" y="${yy}" width="${Math.min(ln, w - ind)}" height="16" rx="8" fill="${kir ? P.kirmizi : (i % 2 ? P.cyan : P.yesil)}" opacity="${kir ? .9 : .55}"/><rect x="${x0 + ind + Math.min(ln, w - ind) + 16}" y="${yy}" width="${60 + (i % 3) * 30}" height="16" rx="8" fill="${P.krem}" opacity=".3"/>`; }
    return o;
  }
  // defter sayfası (yerel koordinat, merkez 0,0; genişlik 760, yükseklik 560)
  function defter(icerik = '') {
    let o = `<rect x="-372" y="-268" width="760" height="560" rx="16" fill="#000" opacity=".25"/><rect x="-380" y="-280" width="760" height="560" rx="16" fill="${P.kagit}"/><rect x="-380" y="-280" width="80" height="560" rx="12" fill="${P.kagitG}" opacity=".6"/>`;
    for (let i = 0; i < 11; i++) o += `<rect x="-300" y="${-210 + i * 46}" width="660" height="3" fill="#9FB8D8" opacity=".6"/>`;
    o += `<rect x="-250" y="-280" width="4" height="560" fill="#E58B8B" opacity=".6"/>`;
    return o + icerik;
  }
  function elYazi(s, x, y, p, size = 38, renk = P.murekkep) { // p: 0..1 yazılma oranı
    if (p <= 0) return ''; const c = id('ey'), w = s.length * size * .52 + 20;
    return `<defs><clipPath id="${c}"><rect x="${x - 10}" y="${y - size * 1.2}" width="${w * p}" height="${size * 1.7}"/></clipPath></defs>` +
      `<text x="${x}" y="${y}" font-size="${size}" font-style="italic" font-weight="500" clip-path="url(#${c})" style="fill:${renk};font-weight:500">${s}</text>`;
  }
  const bant = (x, y, w, rot = 0, op = .55) => `<rect x="${x - w / 2}" y="${y - 22}" width="${w}" height="44" rx="4" fill="#F4F0D0" opacity="${op}" transform="rotate(${rot} ${x} ${y})"/><rect x="${x - w / 2}" y="${y - 22}" width="${w}" height="10" rx="4" fill="#FFFFFF" opacity="${op * .6}" transform="rotate(${rot} ${x} ${y})"/>`;
  // oda büyüklüğünde makine: dolaplar, lambalar, makaralar
  function makine(t, alarm = 0, x0 = 60, y0 = 430, w = 960, h = 720) {
    let o = `<rect x="${x0}" y="${y0 + h}" width="${w}" height="40" rx="12" fill="#06141A"/>`;
    const dol = 5, dw = w / dol;
    for (let d = 0; d < dol; d++) { const x = x0 + d * dw + 8;
      o += `<rect x="${x}" y="${y0}" width="${dw - 16}" height="${h}" rx="22" fill="${P.orta}"/><rect x="${x + dw - 16 - 26}" y="${y0}" width="26" height="${h}" rx="13" fill="#3E8594" opacity=".55"/><rect x="${x}" y="${y0}" width="${dw - 16}" height="30" rx="15" fill="#3E8594" opacity=".4"/>`;
      for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) { const lx = x + 30 + c * ((dw - 76) / 3), ly = y0 + 70 + r * 44;
        const on = Math.sin(t * (2 + (d * 7 + r * 3 + c) % 5) + d * 3 + r * 1.7 + c) > .2;
        const kir = alarm > 0 && ((d * 9 + r * 4 + c) % 36) / 36 < alarm;
        o += `<circle cx="${lx}" cy="${ly}" r="10" fill="${kir ? P.kirmizi : on ? P.cyan : '#0B2A31'}"/>` + (kir || on ? `<circle cx="${lx}" cy="${ly}" r="18" fill="${kir ? P.kirmizi : P.cyan}" opacity=".18"/>` : ''); }
      // kablo makarası
      const my = y0 + h - 140, mr = 46, a = t * (1.5 + d * .3);
      o += `<circle cx="${x + (dw - 16) / 2}" cy="${my}" r="${mr}" fill="#0B2A31"/><circle cx="${x + (dw - 16) / 2}" cy="${my}" r="${mr * .55}" fill="${P.acik}"/>`;
      for (let k = 0; k < 3; k++) { const b = a + k * 2.09; o += `<circle cx="${x + (dw - 16) / 2 + Math.cos(b) * mr * .78}" cy="${my + Math.sin(b) * mr * .78}" r="8" fill="${P.krem}" opacity=".6"/>`; }
    }
    return o;
  }
  // röle: kutu + bobin + titreşen kontak kolu
  function role(x, y, s, t, no = '', seed = 0, sik = 0) {
    const a = sik ? 0 : (Math.sin(t * 9 + seed * 2.3) > 0 ? -12 : 0);
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-90" width="140" height="180" rx="22" fill="${P.acik}"/><rect x="-70" y="-90" width="140" height="26" rx="13" fill="#5FA3B0" opacity=".5"/>` +
      `<rect x="-40" y="-40" width="44" height="100" rx="14" fill="#C9772E"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="-40" y="${-34 + i * 19}" width="44" height="7" rx="3.5" fill="#E8A052"/>`).join('') +
      `<g transform="rotate(${a} 30 -50)"><rect x="24" y="-56" width="14" height="100" rx="7" fill="${P.krem}"/></g><circle cx="31" cy="54" r="10" fill="${P.amber}"/>` +
      (no ? `<rect x="-40" y="66" width="80" height="18" rx="9" fill="#0B2A31"/><text class="mono" x="0" y="81" font-size="16" text-anchor="middle" style="fill:${P.krem}">${no}</text>` : '') + `</g>`;
  }
  function cimbiz(x, y, rot = 0, acik = 0) { // uç noktası x,y
    return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M-6 0 L${-14 - acik * 10} -260 L${-2 - acik * 10} -262 L0 -10Z" fill="#C9D3E0"/><path d="M6 0 L${14 + acik * 10} -260 L${2 + acik * 10} -262 L0 -10Z" fill="#9AA6B8"/><rect x="-18" y="-280" width="36" height="30" rx="10" fill="#9AA6B8"/></g>`;
  }
  function ampul(x, y, s = 1, parla = 1, t = 0) {
    return (parla > 0 ? K.glow({ x, y, r: 260 * s, renk: P.amber, guc: .7 * parla }) : '') +
      `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="0" r="110" fill="#FFF1C9" opacity="${.35 + .5 * parla}"/><circle cx="0" cy="0" r="110" fill="${P.amber}" opacity="${.25 * parla}"/>` +
      `<path d="M-50 90 Q-30 120 -34 150 L34 150 Q30 120 50 90Z" fill="#FFF1C9" opacity=".5"/>` +
      `<path d="M-24 60 L-24 10 Q-12 -30 0 10 Q12 -30 24 10 L24 60" stroke="${parla > .2 ? '#FFFFFF' : '#8A7560'}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<rect x="-42" y="150" width="84" height="80" rx="14" fill="#9AA6B8"/>` + [0, 1, 2].map(i => `<rect x="-46" y="${162 + i * 22}" width="92" height="9" rx="4.5" fill="#C9D3E0"/>`).join('') +
      `<circle cx="36" cy="-50" r="16" fill="#FFFFFF" opacity=".7"/></g>`;
  }
  function mektup(x, y, s = 1, rot = 0, bugP = 0, daire = 0) {
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-230" y="-300" width="460" height="600" rx="12" fill="#E9DBB8"/><rect x="-230" y="-300" width="460" height="60" rx="12" fill="#D8C79E" opacity=".6"/>`;
    o += `<text x="-190" y="-230" font-size="34" font-style="italic" font-weight="500" style="fill:#5A3A22;font-weight:500">Menlo Park, 1878</text>`;
    for (let i = 0; i < 9; i++) if (i !== 4) o += `<rect x="-190" y="${-180 + i * 50}" width="${360 - (i % 3) * 50}" height="10" rx="5" fill="#8A6A48" opacity=".55"/>`;
    o += `<rect x="-190" y="20" width="120" height="10" rx="5" fill="#8A6A48" opacity=".55"/>` + (bugP > 0 ? `<text x="-50" y="36" font-size="54" font-style="italic" font-weight="700" opacity="${bugP}" style="fill:#5A3A22;font-weight:700">“bugs”</text>` : '') + `<rect x="110" y="20" width="80" height="10" rx="5" fill="#8A6A48" opacity=".55"/>`;
    if (daire > 0) { const L = 2 * Math.PI * 110, d = L * (1 - daire); o += `<ellipse cx="30" cy="20" rx="110" ry="56" fill="none" stroke="${P.kirmizi}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${d}" transform="rotate(-6 30 20)"/>`; }
    return o + `<text x="100" y="250" font-size="40" font-style="italic" font-weight="700" style="fill:#5A3A22;font-weight:700">— T. A. Edison</text></g>`;
  }
  function dunya(x, y, r, t = 0) {
    const c = id('dn'); let ic = '';
    for (let i = 0; i < 5; i++) { const px = x - r + (((i * .43 + t * .06) % 1.4) - .2) * 2 * r; ic += `<ellipse cx="${px}" cy="${y - r * .5 + i * r * .25}" rx="${r * (.25 + (i % 2) * .12)}" ry="${r * .16}" fill="#5BC98B"/>`; }
    return K.kure({ x, y, r, renk: '#2F8FC8', rim: '#E8FBFF', golge: '#123C5C', isikYon: [1, -1], atmosfer: P.cyan, ic });
  }
  function balon(x, y, s = 1, ic = '', renk = P.krem) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-80" y="-56" width="160" height="112" rx="44" fill="${renk}"/><path d="M-30 50 L-50 90 L0 52Z" fill="${renk}"/>${ic}</g>`;
  }
  function tus(x, y, harf, bas = 0, renk = P.krem) {
    return `<g transform="translate(${x} ${y + bas * 14})"><rect x="-62" y="-50" width="124" height="${116 - bas * 14}" rx="24" fill="#0B2A31"/><rect x="-62" y="-62" width="124" height="112" rx="24" fill="${bas > .5 ? P.cyan : P.acik}"/><rect x="-62" y="-62" width="124" height="26" rx="13" fill="#FFFFFF" opacity=".15"/>` +
      `<text x="0" y="16" font-size="56" font-weight="900" text-anchor="middle" style="fill:${bas > .5 ? P.z1 : renk}">${harf}</text></g>`;
  }
  return { P, bg, parca, guve, ekran, kod, defter, elYazi, bant, makine, role, cimbiz, ampul, mektup, dunya, balon, tus };
})();
