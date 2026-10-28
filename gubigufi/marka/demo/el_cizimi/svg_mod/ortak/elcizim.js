/* EL ÇİZİMİ MODU — mevcut flat SVG kitlerinin üstüne katman (çizim tarzı ve renkler değişmez).
   EC.defs(t)            → titreme (boil) filtresi + kâğıt dokusu filtresi; tohum saniyede 8 kez değişir ("on threes")
   EC.kagit(renk)        → kâğıt zemin (lif + gren)
   EC.titret(svg)        → içeriği el çizimi titremesiyle sarar
   EC.r(tip, args, o, t) → rough.js eskiz şekil (rect/ellipse/line/polygon/path); o.ciz = 0..1 çizilerek belirme
   EC.ciz(d, p, renk, w) → herhangi bir yolu kalemle çiziliyormuş gibi gösterir
   EC.altCiz / EC.daire / EC.ok → kalem vurguları (dalgalı alt çizgi, elle daire, ok)          */
const EC = (() => {
  const G = rough.generator();
  const boilN = t => Math.floor(t * 8);
  const defs = (t, guc = 3.2) => `<defs>
    <filter id="ecBoil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="${boilN(t) % 97}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${guc}" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="ecGren"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .28  0 0 0 0 .2  0 0 0 -1.1 .62"/></filter>
    <filter id="ecLif"><feTurbulence type="fractalNoise" baseFrequency=".012 .06" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .32  0 0 0 -.9 .32"/></filter>
  </defs>`;
  const kagit = (renk = '#F3EBDC') => `<rect width="1080" height="1920" fill="${renk}"/><rect width="1080" height="1920" filter="url(#ecLif)" opacity=".55"/>`;
  const gren = (op = .5) => `<rect width="1080" height="1920" filter="url(#ecGren)" opacity="${op}" style="mix-blend-mode:multiply"/>`;
  const titret = s => `<g filter="url(#ecBoil)">${s}</g>`;
  function r(tip, args, o = {}, t = 0) {
    const op = Object.assign({ roughness: 1.3, bowing: 1.2, stroke: '#2B2233', strokeWidth: 3, fillStyle: 'hachure', hachureGap: 12, fillWeight: 2.2, seed: 1 + (o.seedSabit ? 0 : boilN(t) % 3) * 17 + (o.tohum || 0) }, o);
    const d = G[tip](...args, op), P = G.toPaths(d), k = o.ciz == null ? 1 : o.ciz;
    if (k <= 0) return '';
    return P.map((p, i) => { const fillP = p.fill && p.fill !== 'none';
      const dash = k < 1 ? ` pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${1 - Math.min(1, k * (fillP ? 1 : 1.0))}"` : '';
      return `<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${fillP ? p.fill : 'none'}" stroke-linecap="round" stroke-linejoin="round"${dash}${fillP && k < 1 ? ` fill-opacity="${Math.max(0, k * 2 - 1)}"` : ''}/>`; }).join('');
  }
  const ciz = (d, p, renk = '#2B2233', w = 6) => p <= 0 ? '' : `<path d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${1 - Math.min(1, p)}" stroke="${renk}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const altCiz = (x1, x2, y, p, renk = '#E8505B', w = 9) => { let d = `M${x1} ${y}`; const n = 6; for (let i = 1; i <= n; i++) d += ` Q${x1 + (x2 - x1) * (i - .5) / n} ${y + (i % 2 ? 10 : -10)} ${x1 + (x2 - x1) * i / n} ${y + (i === n ? -6 : 0)}`; return ciz(d, p, renk, w); };
  const daire = (cx, cy, rx, ry, p, renk = '#E8505B', w = 7) => { let d = ''; for (let i = 0; i <= 44; i++) { const a = -2.2 + i / 40 * Math.PI * 2, k = 1 + .08 * Math.sin(i * .7); d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * k) + ' ' + (cy + Math.sin(a) * ry * k); } return ciz(d, p, renk, w); };
  const ok = (x1, y1, x2, y2, p, renk = '#E8505B', w = 7) => { const mx = (x1 + x2) / 2 + (y2 - y1) * .25, my = (y1 + y2) / 2 - (x2 - x1) * .25, a = Math.atan2(y2 - my, x2 - mx);
    return ciz(`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, Math.min(1, p * 1.25), renk, w) + (p > .8 ? ciz(`M${x2 - 30 * Math.cos(a - .5)} ${y2 - 30 * Math.sin(a - .5)} L${x2} ${y2} L${x2 - 30 * Math.cos(a + .5)} ${y2 - 30 * Math.sin(a + .5)}`, (p - .8) * 5, renk, w) : ''); };
  return { defs, kagit, gren, titret, r, ciz, altCiz, daire, ok };
})();
