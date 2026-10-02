/* #7 Işık saçıyorsun — tekrar eden çizimler (SVG metni). Işık sağ üstten. Kontur yok.
   Paletler: DERİN UZAY (karanlık oda) · MİKRO DÜNYA (hücre içi) — skill paletler.md */
const I = (() => {
  let n = 0; const id = p => `i${p}${++n}`;
  const UZ = { z1: '#0B1433', z2: '#1E1B4B', orta: '#2E3A7A', mag: '#FF4F8B', cyan: '#3CD6F0', amber: '#FFB547', isik: '#FFF3D6' };
  const MK = { z1: '#0C2E3A', z2: '#10414F', orta: '#1C6170', pembe: '#FF6F91', lime: '#B8E05A', seftali: '#FFA26B', isik: '#E8FFF6' };
  function bg({ ust = UZ.z1, alt = UZ.z2, neb = UZ.cyan, nx = 540, ny = 700, nr = 620, no = .18 } = {}) {
    const g = id('bg'), nb = id('nb');
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient>` +
      `<radialGradient id="${nb}"><stop offset="0" stop-color="${neb}" stop-opacity="${no}"/><stop offset="1" stop-color="${neb}" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="1080" height="1920" fill="url(#${g})"/><circle cx="${nx}" cy="${ny}" r="${nr}" fill="url(#${nb})"/>`;
  }
  const parca = (seed, adet, renk = UZ.isik) => K.yildizlar({ adet, seed, renk, alan: [0, 0, 1080, 1920] });
  // insan silueti (yüzsüz): baş daire + yuvarlak köşeli yamuk gövde; rim light kırpma tekniğiyle
  function insan({ x, y, h = 600, renk = '#2E3A7A', rim = '#5E6FB8', golge = '#141B3F', parla = 0, parlaRenk = UZ.cyan }) {
    const s = h / 600, c = id('in');
    const yol = (ox, oy) => `M${x - 150 * s + ox} ${y + oy} Q${x - 160 * s + ox} ${y - 300 * s + oy} ${x - 95 * s + ox} ${y - 360 * s + oy} Q${x + ox} ${y - 395 * s + oy} ${x + 95 * s + ox} ${y - 360 * s + oy} Q${x + 160 * s + ox} ${y - 300 * s + oy} ${x + 150 * s + ox} ${y + oy}Z` +
      `M${x + 88 * s + ox} ${y - 480 * s + oy} A${88 * s} ${88 * s} 0 1 1 ${x + 87.9 * s + ox} ${y - 481 * s + oy}Z`;
    let o = '';
    if (parla > 0) o += K.glow({ x, y: y - 470 * s, r: 260 * s, renk: parlaRenk, guc: .55 * parla }) + K.glow({ x, y: y - 220 * s, r: 330 * s, renk: parlaRenk, guc: .25 * parla });
    o += `<defs><clipPath id="${c}"><path d="${yol(0, 0)}"/></clipPath></defs><g clip-path="url(#${c})"><path d="${yol(0, 0)}" fill="${rim}"/><path d="${yol(-10 * s, 10 * s)}" fill="${renk}"/><circle cx="${x - 260 * s}" cy="${y - 60 * s}" r="${330 * s}" fill="${golge}" opacity=".5"/></g>`;
    return o;
  }
  function gozCizik(x, y, s = 1, cizik = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-90 0 Q0 -70 90 0 Q0 70 -90 0Z" fill="#FFF3D6"/><circle r="32" fill="#1B1640"/><circle cx="10" cy="-10" r="9" fill="#FFF3D6"/>` +
      `<rect x="-110" y="-9" width="${220 * cizik}" height="18" rx="9" fill="${UZ.mag}" transform="rotate(-35)"/></g>`;
  }
  // kesit karanlık oda: 5 gönüllü sandalyede
  function oda(isik = 1) {
    let o = `<rect x="80" y="420" width="920" height="760" rx="60" fill="#141B3F"/><rect x="80" y="1100" width="920" height="80" rx="30" fill="#0E1433"/>`;
    for (let i = 0; i < 5; i++) { const x = 190 + i * 175; o += `<rect x="${x - 50}" y="1010" width="100" height="90" rx="20" fill="#2E3A7A"/>` + insan({ x, y: 1020, h: 230, renk: '#3A4C94', rim: '#8FA2F0', golge: '#141B3F' }); }
    o += `<rect x="880" y="700" width="90" height="400" rx="20" fill="#2E3A7A"/><circle cx="895" cy="910" r="9" fill="${UZ.amber}"/>`;
    o += `<circle cx="540" cy="480" r="26" fill="${UZ.amber}" opacity="${isik}"/>` + (isik > 0 ? K.glow({ x: 540, y: 520, r: 520, renk: UZ.amber, guc: .45 * isik }) : '');
    o += `<rect x="80" y="420" width="920" height="760" rx="60" fill="#02030A" opacity="${.82 * (1 - isik)}"/>`;
    return o;
  }
  // süper hassas soğutmalı kamera
  function kamera(x, y, s = 1, t = 0, flas = 0) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
    o += K.glow({ x: 0, y: 0, r: 420, renk: UZ.cyan, guc: .25 });
    o += `<rect x="-260" y="-190" width="520" height="380" rx="70" fill="#2E3A7A"/><rect x="-260" y="-190" width="520" height="90" rx="45" fill="#5E6FB8" opacity=".5"/>`;
    for (let i = 0; i < 6; i++) o += `<rect x="${-220 + i * 80}" y="-250" width="40" height="80" rx="20" fill="#1E2A5E"/>`;
    o += `<circle cx="0" cy="20" r="150" fill="#141B3F"/><circle cx="0" cy="20" r="112" fill="#0B1433"/><circle cx="0" cy="20" r="70" fill="#1B1640"/>` +
      `<circle cx="-35" cy="-15" r="26" fill="#FFF3D6" opacity=".35"/><circle cx="0" cy="20" r="${112 + 18 * flas}" fill="${UZ.cyan}" opacity="${.15 + .35 * flas}"/>`;
    const R = K.rnd(5); for (let i = 0; i < 16; i++) { const a = R() * 6.28, r = 170 + R() * 110, k = .6 + .4 * Math.sin(t * 3 + i); o += `<path d="${buz(Math.cos(a) * r, Math.sin(a) * r * .75, 8 + R() * 10)}" fill="#E8FBFF" opacity="${.5 * k}"/>`; }
    return o + `</g>`;
  }
  const buz = (x, y, r) => { let d = ''; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2, b = a + Math.PI / 4, c = a + Math.PI / 2; d += (i ? '' : `M${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`) + ` Q${x + Math.cos(b) * r * .2} ${y + Math.sin(b) * r * .2} ${x + Math.cos(c) * r} ${y + Math.sin(c) * r}`; } return d + 'Z'; };
  // foton: minik parlak ışık parçacığı
  const foton = (x, y, r = 10, renk = MK.lime, op = 1) => `<g opacity="${op}">` + K.glow({ x, y, r: r * 4, renk, guc: .7 }) + `<path d="${buz(x, y, r * 1.6)}" fill="#FFFFFF"/></g>`;
  function hucre({ x, y, r, t = 0, renk = MK.pembe }) {
    const c = id('hc'); let d = ''; for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr = r * (1 + .05 * Math.sin(a * 3 + t) + .03 * Math.sin(a * 5 - t * 1.3)); d += (i ? ' L' : 'M') + (x + Math.cos(a) * rr) + ' ' + (y + Math.sin(a) * rr); }
    return K.glow({ x, y, r: r * 1.7, renk, guc: .25 }) + `<defs><clipPath id="${c}"><path d="${d}Z"/></clipPath></defs><g clip-path="url(#${c})"><path d="${d}Z" fill="#FFD1DC"/><circle cx="${x - r * .06}" cy="${y + r * .06}" r="${r * 1.02}" fill="${renk}"/><circle cx="${x - r * .7}" cy="${y + r * .7}" r="${r * 1.05}" fill="#B23A62" opacity=".45"/></g>` +
      K.glow({ x: x + r * .15, y: y - r * .1, r: r * .6, renk: MK.seftali, guc: .8 }) + `<circle cx="${x + r * .15}" cy="${y - r * .1}" r="${r * .28}" fill="${MK.seftali}"/>`;
  }
  function molekul(x, y, s = 1, renk = MK.lime, a = 0) {
    const p = [[0, 0], [38, -22], [-40, -18], [6, 42]].map(([u, v]) => [x + (u * Math.cos(a) - v * Math.sin(a)) * s, y + (u * Math.sin(a) + v * Math.cos(a)) * s]);
    let o = ''; for (let i = 1; i < 4; i++) o += `<line x1="${p[0][0]}" y1="${p[0][1]}" x2="${p[i][0]}" y2="${p[i][1]}" stroke="${MK.isik}" stroke-opacity=".5" stroke-width="${9 * s}" stroke-linecap="round"/>`;
    o += `<circle cx="${p[0][0]}" cy="${p[0][1]}" r="${22 * s}" fill="${renk}"/>`; for (let i = 1; i < 4; i++) o += `<circle cx="${p[i][0]}" cy="${p[i][1]}" r="${13 * s}" fill="${i % 2 ? MK.seftali : MK.isik}"/>`;
    return o;
  }
  function saat(x, y, r, saatDeg) { // saatDeg: 0..24 saat
    const a = (saatDeg % 12) / 12 * Math.PI * 2 - Math.PI / 2, m = (saatDeg % 1) * Math.PI * 2 - Math.PI / 2;
    let o = K.kure({ x, y, r, renk: '#FFF3D6', rim: '#FFFFFF', golge: '#C9C2D8', isikYon: [1, -1] });
    for (let i = 0; i < 12; i++) { const b = i / 12 * Math.PI * 2; o += `<circle cx="${x + Math.cos(b) * r * .82}" cy="${y + Math.sin(b) * r * .82}" r="${i % 3 ? 6 : 11}" fill="${UZ.z2}"/>`; }
    o += `<line x1="${x}" y1="${y}" x2="${x + Math.cos(a) * r * .5}" y2="${y + Math.sin(a) * r * .5}" stroke="${UZ.z2}" stroke-width="18" stroke-linecap="round"/>` +
      `<line x1="${x}" y1="${y}" x2="${x + Math.cos(m) * r * .72}" y2="${y + Math.sin(m) * r * .72}" stroke="${UZ.mag}" stroke-width="10" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="16" fill="${UZ.mag}"/>`;
    return o;
  }
  return { UZ, MK, bg, parca, insan, gozCizik, oda, kamera, foton, hucre, molekul, saat, buz };
})();
