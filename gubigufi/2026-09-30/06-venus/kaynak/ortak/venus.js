/* #6 Venüs — tekrar eden çizimler (SVG metni döndürür). Işık sağ üstten: isikYon [1,-1].
   Paletler: DERİN UZAY (zemin) + GÜNEŞ SİSTEMİ SICAK (Güneş/Venüs). Kontur yok. */
const V = (() => {
  let n = 0; const id = p => `v${p}${++n}`;
  const PAL = { z1: '#0B1433', z2: '#1E1B4B', orta: '#2E3A7A', mag: '#FF4F8B', cyan: '#3CD6F0', amber: '#FFB547', isik: '#FFF3D6',
    gunes: '#FF8A3D', altin: '#FFD166', mercan: '#FF5E5B', mor: '#6B2A5E', venus: '#E9B35C' };
  function bg({ ust = PAL.z1, alt = PAL.z2, neb = PAL.mag, nx = 820, ny = 420 } = {}) {
    const g = id('bg'), nb = id('nb');
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient>` +
      `<radialGradient id="${nb}"><stop offset="0" stop-color="${neb}" stop-opacity=".2"/><stop offset="1" stop-color="${neb}" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="1080" height="1920" fill="url(#${g})"/><circle cx="${nx}" cy="${ny}" r="620" fill="url(#${nb})"/>`;
  }
  const yildiz = (seed = 3, adet = 70) => K.yildizlar({ adet, seed, renk: PAL.isik, alan: [0, 0, 1080, 1920] });
  function glowDaire(x, y, r, renk, guc = .8) { return K.glow({ x, y, r, renk, guc }); }
  function venus({ x, y, r, faz = 0, glow = true }) {
    let ic = '';
    const bant = [[-.55, .09, '#F4CE86'], [-.25, .12, '#D99A48'], [.05, .08, '#F7DA9C'], [.32, .11, '#CC8A3E'], [.6, .08, '#EDC07A']];
    for (const [dy, h, c] of bant) for (let k = -1; k <= 1; k++) { const w = r * 1.4, bx = x - r + ((faz * r * 2) % (r * 2)) + k * r * 2 - w / 2 + r; ic += `<rect x="${bx}" y="${y + dy * r}" width="${w}" height="${h * r}" rx="${h * r / 2}" fill="${c}" opacity=".7"/>`; }
    return (glow ? glowDaire(x, y, r * 2.1, PAL.altin, .35) : '') + K.kure({ x, y, r, renk: PAL.venus, rim: '#FFF1C9', golge: PAL.mor, isikYon: [1, -1], atmosfer: PAL.altin, ic });
  }
  function gunes({ x, y, r }) {
    return glowDaire(x, y, r * 3.2, PAL.gunes, .75) + `<circle class="pulse" cx="${x}" cy="${y}" r="${r * 1.12}" fill="${PAL.altin}" opacity=".35"/>` +
      K.kure({ x, y, r, renk: PAL.gunes, rim: '#FFF1C9', golge: '#E0582B', isikYon: [1, -1] }) + `<circle cx="${x + r * .1}" cy="${y - r * .1}" r="${r * .62}" fill="${PAL.altin}" opacity=".85"/>`;
  }
  function dunya({ x, y, r }) {
    const ic = `<circle cx="${x - r * .3}" cy="${y - r * .2}" r="${r * .38}" fill="#5BC98B"/><circle cx="${x + r * .35}" cy="${y + r * .3}" r="${r * .3}" fill="#5BC98B"/><ellipse cx="${x + r * .2}" cy="${y - r * .55}" rx="${r * .35}" ry="${r * .12}" fill="#E8FBFF" opacity=".7"/>`;
    return K.kure({ x, y, r, renk: '#3AA8E0', rim: '#E8FBFF', golge: '#1E1B4B', isikYon: [1, -1], atmosfer: PAL.cyan, ic });
  }
  function pasta({ x, y, s = 1, mum = 3, t = 0 }) { // y = taban
    const w = 230 * s, h1 = 80 * s, h2 = 70 * s; let o = `<ellipse cx="${x}" cy="${y + 6 * s}" rx="${w * .62}" ry="${14 * s}" fill="#000" opacity=".25"/>`;
    o += `<rect x="${x - w / 2}" y="${y - h1}" width="${w}" height="${h1}" rx="${22 * s}" fill="${PAL.mag}"/><rect x="${x - w / 2}" y="${y - h1}" width="${w * .18}" height="${h1}" rx="${14 * s}" fill="#FFB0CB" opacity=".6"/>`;
    o += `<rect x="${x - w * .4}" y="${y - h1 - h2}" width="${w * .8}" height="${h2}" rx="${20 * s}" fill="#FFF1C9"/>`;
    for (let i = 0; i < 6; i++) o += `<circle cx="${x - w * .32 + i * w * .128}" cy="${y - h1 - 2 * s}" r="${11 * s}" fill="#FFF1C9"/>`;
    for (let i = 0; i < mum; i++) { const mx = x - (mum - 1) * 30 * s + i * 60 * s, my = y - h1 - h2; const fl = 1 + .12 * Math.sin(t * 17 + i * 2);
      o += `<rect x="${mx - 6 * s}" y="${my - 50 * s}" width="${12 * s}" height="${50 * s}" rx="${6 * s}" fill="${PAL.cyan}"/>` + glowDaire(mx, my - 66 * s, 40 * s, PAL.amber, .7) +
        `<ellipse cx="${mx}" cy="${my - 66 * s}" rx="${8 * s}" ry="${15 * s * fl}" fill="${PAL.amber}"/><ellipse cx="${mx}" cy="${my - 62 * s}" rx="${4 * s}" ry="${8 * s}" fill="#FFF3D6"/>`; }
    return o;
  }
  function sapka(x, y, s = 1) { // y = şapka tabanı
    return `<path d="M${x - 46 * s} ${y} Q${x - 8 * s} ${y - 120 * s} ${x} ${y - 128 * s} Q${x + 8 * s} ${y - 120 * s} ${x + 46 * s} ${y} Q${x} ${y + 12 * s} ${x - 46 * s} ${y}Z" fill="${PAL.cyan}"/>` +
      `<circle cx="${x - 12 * s}" cy="${y - 40 * s}" r="${7 * s}" fill="#FFF3D6"/><circle cx="${x + 14 * s}" cy="${y - 72 * s}" r="${6 * s}" fill="#FFF3D6"/><circle cx="${x}" cy="${y - 132 * s}" r="${13 * s}" fill="${PAL.mag}"/>`;
  }
  function donusOku(cx, cy, r, yon, renk, p = 1) { // yon 1: saat yönü
    const a0 = -2.4, a1 = a0 + 4.2 * p; const pts = []; for (let i = 0; i <= 30; i++) { const a = a0 + (a1 - a0) * i / 30; pts.push([cx + Math.cos(a * yon) * r, cy + Math.sin(a * yon) * r]); }
    const d = 'M' + pts.map(q => q.join(' ')).join(' L'); const [ex, ey] = pts[30], [px, py] = pts[28]; const ang = Math.atan2(ey - py, ex - px);
    return `<path d="${d}" fill="none" stroke="${renk}" stroke-width="16" stroke-linecap="round"/>` + (p > .05 ? `<path d="M${ex + Math.cos(ang) * 26} ${ey + Math.sin(ang) * 26} L${ex + Math.cos(ang + 2.3) * 26} ${ey + Math.sin(ang + 2.3) * 26} L${ex + Math.cos(ang - 2.3) * 26} ${ey + Math.sin(ang - 2.3) * 26}Z" fill="${renk}"/>` : '');
  }
  function termometre(x, y, h, p) { // y = hazne merkezi
    const w = 54; return `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="${w / 2}" fill="#FFF3D6"/><circle cx="${x}" cy="${y}" r="${w * .95}" fill="#FFF3D6"/>` +
      `<rect x="${x - w * .28}" y="${y - (h - 20) * p}" width="${w * .56}" height="${(h - 20) * p + 10}" rx="${w * .28}" fill="${PAL.mercan}"/><circle cx="${x}" cy="${y}" r="${w * .7}" fill="${PAL.mercan}"/>` +
      glowDaire(x, y, w * 2.4, PAL.mercan, .5 * p);
  }
  function takvim(x, y, sayi, ust = 'GÜN') {
    return `<rect x="${x - 170}" y="${y - 150}" width="340" height="330" rx="40" fill="#FFF3D6"/><rect x="${x - 170}" y="${y - 150}" width="340" height="90" rx="40" fill="${PAL.mercan}"/><rect x="${x - 170}" y="${y - 100}" width="340" height="40" fill="${PAL.mercan}"/>` +
      `<rect x="${x - 110}" y="${y - 180}" width="22" height="60" rx="11" fill="${PAL.orta}"/><rect x="${x + 88}" y="${y - 180}" width="22" height="60" rx="11" fill="${PAL.orta}"/>` +
      `<text x="${x}" y="${y - 88}" font-size="40" font-weight="700" text-anchor="middle" style="fill:#FFF3D6">${ust}</text><text x="${x}" y="${y + 120}" font-size="170" font-weight="900" text-anchor="middle" style="fill:${PAL.z2}">${sayi}</text>`;
  }
  function yuzey(t = 0, ara = '') { // Venüs yüzeyi: sarı-turuncu pus, yuvarlak tepeler
    const g = id('ys'); return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A3A2A"/><stop offset=".55" stop-color="#E0874A"/><stop offset="1" stop-color="#F6C27A"/></linearGradient></defs>` +
      `<rect width="1080" height="1920" fill="url(#${g})"/>` + ara +
      `<path d="M0 1080 Q180 980 360 1040 T720 1010 T1080 1060 V1920 H0Z" fill="#B5613A" opacity=".8"/>` +
      `<path d="M0 1160 Q240 1090 480 1140 T1080 1120 V1920 H0Z" fill="#8A3F2B"/>` +
      `<path d="M0 1250 Q300 1200 600 1240 T1080 1230 V1920 H0Z" fill="#5E2A22"/>`;
  }
  function yumurta(x, y, p) { const r = 34 + 26 * p; return `<ellipse cx="${x}" cy="${y}" rx="${r * 1.3}" ry="${r * .55}" fill="#FFF8EC"/><circle cx="${x + 4}" cy="${y - 6}" r="16" fill="${PAL.amber}"/><circle cx="${x + 9}" cy="${y - 11}" r="5" fill="#FFF3D6"/>`; }
  return { PAL, bg, yildiz, glowDaire, venus, gunes, dunya, pasta, sapka, donusOku, termometre, takvim, yuzey, yumurta };
})();
