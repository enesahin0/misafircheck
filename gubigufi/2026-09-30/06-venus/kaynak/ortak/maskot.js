/* gubigufi maskotları — Gubi (amber pırıltı) & Gufi (kırmızı kare)
   flat-bilim-animasyonu skill kurallarıyla: kontur yok, rim light (ışık sağ üstten), gövde gölgesi,
   büyük beyaz göz + lacivert göz bebeği, ağız yok (sadece duygu gerekince minik yay).
   Kullanım: sahnede kit.js'ten SONRA yükle → M.gubi({...}) / M.gufi({...}) SVG metni döndürür.
   duygu: 'merak' | 'saskin' | 'mutlu' | 'uzgun' | 'kararli' | 'korku'                           */
const M = (() => {
  let uid = 0; const id = p => `m${p}${++uid}`;
  const R = {
    gubi: { govde: '#FBAC39', golge: '#B4532A', rim: '#FFE9B8', glow: '#FFD27A' },
    gufi: { govde: '#EE312E', golge: '#8E1B3F', rim: '#FFC7BD', glow: '#FF7A6B' },
    bebek: '#1B1640',
  };
  // göz: beyaz oval + lacivert bebek + parlama; duyguya göre kapak
  function goz(x, y, s, bak, duygu, kapakRenk) {
    const rx = 15 * s, ry = (duygu === 'saskin' || duygu === 'korku' ? 21 : duygu === 'kararli' || duygu === 'uzgun' ? 14 : 18) * s, pr = (duygu === 'saskin' || duygu === 'korku' ? 5.5 : 8) * s;
    let o = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FFFFFF"/>` +
      `<circle cx="${x + bak[0] * 5 * s}" cy="${y + bak[1] * 5 * s + 2 * s}" r="${pr}" fill="${R.bebek}"/>` +
      `<circle cx="${x + bak[0] * 5 * s + 3 * s}" cy="${y + bak[1] * 5 * s - 2 * s}" r="${2.6 * s}" fill="#FFFFFF"/>`;
    if (duygu === 'mutlu') return `<path d="M${x - rx} ${y + 4 * s} Q${x} ${y - 20 * s} ${x + rx} ${y + 4 * s} Q${x} ${y - 8 * s} ${x - rx} ${y + 4 * s}Z" fill="${R.bebek}"/>`;
    if (duygu === 'uzgun') o += `<path d="M${x - rx - 2} ${y - ry - 2 * s} Q${x - rx * .2} ${y - ry - 12 * s} ${x + rx + 2} ${y - ry - 12 * s} L${x + rx + 2} ${y - ry - 4 * s} Q${x - rx * .2} ${y - ry - 4 * s} ${x - rx - 2} ${y - ry + 6 * s}Z" fill="${R.bebek}"/>`;
    if (duygu === 'kararli') o += `<path d="M${x - rx - 4} ${y - ry - 10 * s} L${x + rx + 4} ${y - ry + 2 * s} L${x + rx + 4} ${y - ry + 10 * s} L${x - rx - 4} ${y - ry - 2 * s}Z" fill="${R.bebek}"/>`;
    return o;
  }
  // iki göz grubu (kırpma animasyonu .kirp ile)
  const gozler = (x, y, s, ara, bak, duygu, kapak, kirp) =>
    `<g class="kirp" style="animation-delay:${kirp}s">${goz(x - ara, y, s, bak, duygu, kapak)}${goz(x + ara, y, s, bak, duygu, kapak)}</g>`;

  // Gubi: yuvarlak uçlu, tombul 4 köşeli yıldız (uçlar Q eğrisiyle yuvarlatılır)
  function gubiYol(cx, cy, r, ox = 0, oy = 0) {
    const k = .5 * r, d0 = .2, pt = (a, m) => [cx + ox + Math.cos(a) * m, cy + oy + Math.sin(a) * m];
    let d = '';
    for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * Math.PI / 2;
      const A = pt(a - d0, r * .82), T = pt(a, r * 1.06), B = pt(a + d0, r * .82), C = pt(a + Math.PI / 4, k);
      d += (i ? ` L` : `M`) + `${A[0]} ${A[1]} Q${T[0]} ${T[1]} ${B[0]} ${B[1]}`;
      const N = pt(a + Math.PI / 2 - d0, r * .82); d += ` Q${C[0]} ${C[1]} ${N[0]} ${N[1]}`; }
    return d + 'Z';
  }
  function gubi({ x, y, boy = 160, duygu = 'merak', bak = [0, 0], kirp = 0, parla = .6, agiz = false } = {}) {
    const r = boy / 2, c = id('gb'), g = id('gg'), C = R.gubi, s = boy / 160;
    return `<g class="gubi">` +
      `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${C.glow}" stop-opacity="${parla}"/><stop offset="1" stop-color="${C.glow}" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="${c}"><path d="${gubiYol(x, y, r)}"/></clipPath></defs>` +
      `<circle class="pulse" cx="${x}" cy="${y}" r="${r * 1.9}" fill="url(#${g})"/>` +
      `<g clip-path="url(#${c})"><path d="${gubiYol(x, y, r)}" fill="${C.rim}"/><path d="${gubiYol(x, y, r, -r * .07, r * .07)}" fill="${C.govde}"/>` +
      `<path d="${gubiYol(x, y, r * 1.05, -r * .55, r * .55)}" fill="${C.golge}" opacity=".45"/></g>` +
      gozler(x, y - r * .05, s, 20 * s, bak, duygu, C.govde, kirp) +
      (agiz ? `<path d="M${x - 9 * s} ${y + 28 * s} Q${x} ${y + 38 * s} ${x + 9 * s} ${y + 28 * s}" fill="${C.golge}"/>` : '') + `</g>`;
  }
  // Gufi: yuvarlak köşeli kare, minik ayaklar
  function gufi({ x, y, boy = 140, duygu = 'merak', bak = [0, 0], kirp = 0, agiz = false } = {}) {
    const w = boy, h = boy, rx = boy * .28, c = id('gf'), C = R.gufi, s = boy / 140;
    const kutu = (ox, oy, k = 1) => `<rect x="${x - w * k / 2 + ox}" y="${y - h * k + oy}" width="${w * k}" height="${h * k}" rx="${rx}"`;
    return `<g class="gufi">` +
      `<ellipse cx="${x}" cy="${y + 4}" rx="${w * .55}" ry="${h * .07}" fill="#000" opacity=".22"/>` +
      `<rect x="${x - w * .3}" y="${y - 6}" width="${w * .18}" height="${h * .12}" rx="${w * .09}" fill="${C.golge}"/><rect x="${x + w * .12}" y="${y - 6}" width="${w * .18}" height="${h * .12}" rx="${w * .09}" fill="${C.golge}"/>` +
      `<defs><clipPath id="${c}">${kutu(0, -h * .06)}/></clipPath></defs>` +
      `<g clip-path="url(#${c})">${kutu(0, -h * .06)} fill="${C.rim}"/>${kutu(-w * .07, -h * .06 + w * .07)} fill="${C.govde}"/><circle cx="${x - w * .75}" cy="${y + h * .05}" r="${w * .95}" fill="${C.golge}" opacity=".45"/></g>` +
      gozler(x, y - h * .62, s, 24 * s, bak, duygu, C.govde, kirp) +
      (agiz ? `<path d="M${x - 10 * s} ${y - h * .32} Q${x} ${y - h * .22} ${x + 10 * s} ${y - h * .32}" fill="${C.golge}"/>` : '') + `</g>`;
  }
  return { gubi, gufi, renk: R };
})();
