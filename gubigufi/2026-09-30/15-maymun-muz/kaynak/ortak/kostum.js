/* gubigufi — maskot KOSTÜMLERİ (rol verme kuralı, MARKA v4)
   Kullanım: gubi(t, { ..., ust: KO.giy('gubi', ['kasket', 'papyon']) })
             gufi(t, { ..., ust: KO.giy('gufi', [['silindir', { renk: '#2A2440' }], 'monokl']) })
   Parçalar kafaya/gövdeye maskotun o anki konum ve boyuna göre oturur; zıplama/squash ile birlikte hareket eder.
   Parçalar: silindir · monokl · simitci (beyaz aşçı başlığı) · kasket (siperlikli) · kravat · papyon · gozluk · biyik · melon · kep (mezuniyet) · parti
*/
const KO = (() => {
  // kafa çapası: tepe (x, y), kafa genişliği, göz hattı, ölçek
  const capa = (kim, x, y, boy) => kim === 'gubi'
    ? { tx: x, ty: y - boy * .5 * .93, w: boy * .34, gy: y - boy * .5 * .05, ga: 20 * boy / 160, s: boy / 160, alt: y + boy * .5 * .5, gv: y + boy * .22 }
    : { tx: x, ty: y - boy * 1.06, w: boy * .78, gy: y - boy * .62, ga: 24 * boy / 140, s: boy / 140, alt: y - boy * .08, gv: y - boy * .34 };
  const P = {
    silindir: (c, { renk = '#2A2440', bant = '#E8505B', egim = -8 } = {}) => { const w = c.w * 1.05, h = w * 1.05, x = c.tx, y = c.ty + c.w * .12;
      return `<g transform="rotate(${egim} ${x} ${y})"><rect x="${x - w * .85}" y="${y - w * .14}" width="${w * 1.7}" height="${w * .2}" rx="${w * .1}" fill="${renk}"/><rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="${w * .08}" fill="${renk}"/><rect x="${x - w / 2}" y="${y - h * .32}" width="${w}" height="${h * .16}" fill="${bant}"/><rect x="${x + w * .18}" y="${y - h * .92}" width="${w * .14}" height="${h * .5}" rx="${w * .07}" fill="#FFFFFF" opacity=".18"/></g>`; },
    melon: (c, { renk = '#3A2A20', bant = '#1B1640' } = {}) => { const w = c.w * 1.1, x = c.tx, y = c.ty + c.w * .15;
      return `<rect x="${x - w * .8}" y="${y - w * .1}" width="${w * 1.6}" height="${w * .16}" rx="${w * .08}" fill="${renk}"/><path d="M${x - w * .5} ${y} Q${x - w * .5} ${y - w * .75} ${x} ${y - w * .75} Q${x + w * .5} ${y - w * .75} ${x + w * .5} ${y}Z" fill="${renk}"/><rect x="${x - w * .5}" y="${y - w * .2}" width="${w}" height="${w * .12}" fill="${bant}"/>`; },
    simitci: (c, { renk = '#FFFFFF' } = {}) => { const w = c.w * 1.05, x = c.tx, y = c.ty + c.w * .1;
      return `<rect x="${x - w * .55}" y="${y - w * .3}" width="${w * 1.1}" height="${w * .32}" rx="${w * .06}" fill="#E9E4DA"/><circle cx="${x - w * .3}" cy="${y - w * .5}" r="${w * .32}" fill="${renk}"/><circle cx="${x + w * .3}" cy="${y - w * .5}" r="${w * .32}" fill="${renk}"/><circle cx="${x}" cy="${y - w * .72}" r="${w * .38}" fill="${renk}"/>`; },
    kasket: (c, { renk = '#2E9A9C', siper = '#1F6B6E', yazi = '' } = {}) => { const w = c.w * 1.1, x = c.tx, y = c.ty + c.w * .2;
      return `<path d="M${x - w * .52} ${y} Q${x - w * .5} ${y - w * .62} ${x} ${y - w * .62} Q${x + w * .5} ${y - w * .62} ${x + w * .52} ${y}Z" fill="${renk}"/><path d="M${x + w * .1} ${y - w * .04} L${x + w * 1.0} ${y - w * .02} Q${x + w * 1.05} ${y + w * .1} ${x + w * .9} ${y + w * .12} L${x - w * .2} ${y + w * .06}Z" fill="${siper}"/><circle cx="${x}" cy="${y - w * .62}" r="${w * .07}" fill="${siper}"/>` + (yazi ? `<text x="${x}" y="${y - w * .18}" font-size="${w * .22}" font-weight="900" text-anchor="middle" style="fill:#FFF3E0">${yazi}</text>` : ''); },
    kep: (c, { renk = '#1B1640', puskul = '#FFC24C' } = {}) => { const w = c.w * 1.2, x = c.tx, y = c.ty + c.w * .15;
      return `<rect x="${x - w * .38}" y="${y - w * .2}" width="${w * .76}" height="${w * .26}" rx="${w * .05}" fill="${renk}"/><path d="M${x - w * .8} ${y - w * .28} L${x} ${y - w * .52} L${x + w * .8} ${y - w * .28} L${x} ${y - w * .06}Z" fill="${renk}"/><path d="M${x} ${y - w * .3} L${x + w * .6} ${y - w * .22} L${x + w * .62} ${y + w * .2}" stroke="${puskul}" stroke-width="${w * .05}" fill="none"/><circle cx="${x + w * .62}" cy="${y + w * .22}" r="${w * .07}" fill="${puskul}"/>`; },
    parti: (c, { renk = '#8A6FE0', nokta = '#FFE45C' } = {}) => { const w = c.w * .8, x = c.tx, y = c.ty + c.w * .12;
      return `<path d="M${x - w * .45} ${y} L${x + w * .05} ${y - w * 1.2} L${x + w * .45} ${y}Z" fill="${renk}"/><circle cx="${x + w * .05}" cy="${y - w * 1.2}" r="${w * .12}" fill="${nokta}"/><circle cx="${x - w * .1}" cy="${y - w * .4}" r="${w * .07}" fill="${nokta}"/><circle cx="${x + w * .15}" cy="${y - w * .7}" r="${w * .06}" fill="${nokta}"/>`; },
    hasir: (c, { renk = '#E8C878', bant = '#C8323C' } = {}) => { const w = c.w * 1.25, x = c.tx, y = c.ty + c.w * .18;
      return `<ellipse cx="${x}" cy="${y}" rx="${w * 1.05}" ry="${w * .22}" fill="${renk}"/><path d="M${x - w * .5} ${y} Q${x - w * .48} ${y - w * .62} ${x} ${y - w * .62} Q${x + w * .48} ${y - w * .62} ${x + w * .5} ${y}Z" fill="${renk}"/><rect x="${x - w * .5}" y="${y - w * .2}" width="${w}" height="${w * .13}" fill="${bant}"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${x - w * .9 + i * w * .45} ${y - w * .05} l${w * .2} ${w * .1}" stroke="#B89848" stroke-width="${w * .03}"/>`).join(''); },
    monokl: (c, { renk = '#FFC24C' } = {}) => { const x = c.tx + c.ga, y = c.gy, r = c.ga * .95;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity=".18"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${renk}" stroke-width="${r * .18}"/><path d="M${x + r * .7} ${y + r * .7} Q${x + r * 1.4} ${y + r * 2.4} ${x + r * .6} ${y + r * 3.6}" stroke="${renk}" stroke-width="${r * .08}" fill="none"/>`; },
    gozluk: (c, { renk = '#1B1640' } = {}) => { const r = c.ga * .95, y = c.gy;
      return [-1, 1].map(k => `<circle cx="${c.tx + k * c.ga}" cy="${y}" r="${r}" fill="#FFFFFF" opacity=".15" stroke="${renk}" stroke-width="${r * .2}"/>`).join('') + `<path d="M${c.tx - c.ga + r} ${y} Q${c.tx} ${y - r * .4} ${c.tx + c.ga - r} ${y}" stroke="${renk}" stroke-width="${r * .18}" fill="none"/>`; },
    biyik: (c, { renk = '#3A2A20' } = {}) => { const y = c.gy + c.ga * 1.25, w = c.ga * 1.3, x = c.tx;
      return `<path d="M${x} ${y} Q${x - w * .5} ${y - w * .35} ${x - w} ${y + w * .05} Q${x - w * .5} ${y + w * .25} ${x} ${y + w * .08} Q${x + w * .5} ${y + w * .25} ${x + w} ${y + w * .05} Q${x + w * .5} ${y - w * .35} ${x} ${y}Z" fill="${renk}"/>`; },
    papyon: (c, { renk = '#E8505B' } = {}) => { const x = c.tx, y = c.gv + c.ga * .6, w = c.ga * 1.1;
      return `<path d="M${x} ${y} L${x - w} ${y - w * .55} L${x - w} ${y + w * .55}Z M${x} ${y} L${x + w} ${y - w * .55} L${x + w} ${y + w * .55}Z" fill="${renk}"/><circle cx="${x}" cy="${y}" r="${w * .25}" fill="${renk}"/>`; },
    kravat: (c, { renk = '#2E5AAC', desen = '#FFC24C' } = {}) => { const x = c.tx, y = c.gv, w = c.ga * .7, h = c.ga * 3.2;
      return `<path d="M${x - w * .5} ${y} L${x + w * .5} ${y} L${x + w * .3} ${y + w * .6} L${x - w * .3} ${y + w * .6}Z" fill="${renk}"/><path d="M${x - w * .3} ${y + w * .6} L${x + w * .3} ${y + w * .6} L${x + w * .7} ${y + h} L${x} ${y + h + w * .6} L${x - w * .7} ${y + h}Z" fill="${renk}"/><path d="M${x - w * .45} ${y + h * .45} L${x + w * .45} ${y + h * .3} M${x - w * .55} ${y + h * .8} L${x + w * .55} ${y + h * .65}" stroke="${desen}" stroke-width="${w * .18}"/>`; },
  };
  // parcalar: ['silindir', ['kasket', {renk}], ...]
  const giy = (kim, parcalar) => (x, y, boy) => { const c = capa(kim, x, y, boy); return parcalar.map(p => { const [ad, op] = Array.isArray(p) ? p : [p, {}]; return P[ad] ? P[ad](c, op) : ''; }).join(''); };
  // uçan/düşen tek parça (ör. şapkanın uçması): konum ve açı serbest
  const tek = (kim, ad, x, y, boy, op = {}) => P[ad](capa(kim, x, y, boy), op);
  return { giy, tek, capa, P };
})();
