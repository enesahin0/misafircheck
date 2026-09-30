/* gubigufi maskotları v2 — Gubi (amber pırıltı) & Gufi (kırmızı kare)
   flat-bilim-animasyonu skill kurallarıyla: kontur yok, rim light (ışık sağ üstten), gövde gölgesi,
   büyük beyaz göz + lacivert göz bebeği, ağız yok (sadece duygu gerekince minik yay).

   İKİ KULLANIM:
   1) Statik:  M.gubi({x, y, boy, duygu, bak:[dx,dy], acik}) / M.gufi({...})  → SVG metni
   2) CANLI (önerilen, renderAt içinde her karede):
      M.canli('gubi' | 'gufi', {
        t,                         // sahne içi saniye
        x, y, boy,                 // Gubi: merkez · Gufi: ayak tabanı
        duygu: 'merak',            // varsayılan ifade
        bakHedef: [x, y] | null,   // göz takibi: göz bebekleri bu noktaya döner (yumuşak)
        bak: [dx, dy],             // ya da doğrudan yön (-1..1)
        tepkiler: [[t0, 'sasir'], [t1, 'mutlu'], ...],
        seed: 1                    // göz kırpma ritmi (her karakter farklı)
      })
      Tepkiler: sasir · zipla · mutlu · aha · korku · selam · uzgun · kararli
      Her tepki kendi hareketini + ifadesini + küçük efektini (ünlem, pırıltı, ter damlası) üretir.
      Aynı zamanlar ses_lib.maskot_ses(kim, tepki) ile İMZA SESLERİNE bağlanır.       */
const M = (() => {
  let uid = 0; const id = p => `m${p}${++uid}`;
  const R = {
    gubi: { govde: '#FBAC39', golge: '#B4532A', rim: '#FFE9B8', glow: '#FFD27A' },
    gufi: { govde: '#EE312E', golge: '#8E1B3F', rim: '#FFC7BD', glow: '#FF7A6B' },
    bebek: '#1B1640',
  };
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
  const ar = (t, a, b) => cl((t - a) / (b - a));
  const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

  // ---------- göz ----------
  function goz(x, y, s, bak, duygu, acik = 1) {
    const rx = 15 * s, ry = (duygu === 'saskin' || duygu === 'korku' ? 21 : duygu === 'kararli' || duygu === 'uzgun' ? 14 : 18) * s, pr = (duygu === 'saskin' || duygu === 'korku' ? 5.5 : 8) * s;
    if (duygu === 'mutlu') return `<path d="M${x - rx} ${y + 4 * s} Q${x} ${y - 20 * s} ${x + rx} ${y + 4 * s} Q${x} ${y - 8 * s} ${x - rx} ${y + 4 * s}Z" fill="${R.bebek}"/>`;
    if (acik < .25) return `<rect x="${x - rx}" y="${y - 3 * s}" width="${2 * rx}" height="${6 * s}" rx="${3 * s}" fill="${R.bebek}"/>`; // kapalı göz
    const bx = x + bak[0] * 7 * s, by = y + bak[1] * 7 * s + 2 * s;
    let o = `<g transform="translate(0 ${y}) scale(1 ${acik}) translate(0 ${-y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FFFFFF"/>` +
      `<circle cx="${bx}" cy="${by}" r="${pr}" fill="${R.bebek}"/><circle cx="${bx + 3 * s}" cy="${by - 4 * s}" r="${2.6 * s}" fill="#FFFFFF"/></g>`;
    if (duygu === 'uzgun') o += `<path d="M${x - rx - 2} ${y - ry - 2 * s} Q${x - rx * .2} ${y - ry - 12 * s} ${x + rx + 2} ${y - ry - 12 * s} L${x + rx + 2} ${y - ry - 4 * s} Q${x - rx * .2} ${y - ry - 4 * s} ${x - rx - 2} ${y - ry + 6 * s}Z" fill="${R.bebek}"/>`;
    if (duygu === 'kararli') o += `<path d="M${x - rx - 4} ${y - ry - 10 * s} L${x + rx + 4} ${y - ry + 2 * s} L${x + rx + 4} ${y - ry + 10 * s} L${x - rx - 4} ${y - ry - 2 * s}Z" fill="${R.bebek}"/>`;
    return o;
  }
  const gozler = (x, y, s, ara, bak, duygu, kirp, acik) => acik == null
    ? `<g class="kirp" style="animation-delay:${kirp}s">${goz(x - ara, y, s, bak, duygu)}${goz(x + ara, y, s, bak, duygu)}</g>`
    : goz(x - ara, y, s, bak, duygu, acik) + goz(x + ara, y, s, bak, duygu, acik);

  // ---------- Gubi ----------
  function gubiYol(cx, cy, r, ox = 0, oy = 0) {
    const k = .5 * r, d0 = .2, pt = (a, m) => [cx + ox + Math.cos(a) * m, cy + oy + Math.sin(a) * m];
    let d = '';
    for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * Math.PI / 2;
      const A = pt(a - d0, r * .82), T = pt(a, r * 1.06), B = pt(a + d0, r * .82), C = pt(a + Math.PI / 4, k);
      d += (i ? ` L` : `M`) + `${A[0]} ${A[1]} Q${T[0]} ${T[1]} ${B[0]} ${B[1]}`;
      const N = pt(a + Math.PI / 2 - d0, r * .82); d += ` Q${C[0]} ${C[1]} ${N[0]} ${N[1]}`; }
    return d + 'Z';
  }
  function gubi({ x, y, boy = 160, duygu = 'merak', bak = [0, 0], kirp = 0, parla = .6, agiz = false, acik = null } = {}) {
    const r = boy / 2, c = id('gb'), g = id('gg'), C = R.gubi, s = boy / 160;
    return `<g class="gubi">` +
      `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${C.glow}" stop-opacity="${parla}"/><stop offset="1" stop-color="${C.glow}" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="${c}"><path d="${gubiYol(x, y, r)}"/></clipPath></defs>` +
      `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="url(#${g})"/>` +
      `<g clip-path="url(#${c})"><path d="${gubiYol(x, y, r)}" fill="${C.rim}"/><path d="${gubiYol(x, y, r, -r * .07, r * .07)}" fill="${C.govde}"/>` +
      `<path d="${gubiYol(x, y, r * 1.05, -r * .55, r * .55)}" fill="${C.golge}" opacity=".45"/></g>` +
      gozler(x, y - r * .05, s, 20 * s, bak, duygu, kirp, acik) +
      (agiz ? `<path d="M${x - 9 * s} ${y + 28 * s} Q${x} ${y + 38 * s} ${x + 9 * s} ${y + 28 * s}" fill="${C.golge}"/>` : '') + `</g>`;
  }
  // ---------- Gufi ----------
  function gufi({ x, y, boy = 140, duygu = 'merak', bak = [0, 0], kirp = 0, agiz = false, acik = null, ayak = 0, golge = true } = {}) {
    const w = boy, h = boy, rx = boy * .28, c = id('gf'), C = R.gufi, s = boy / 140;
    const kutu = (ox, oy, k = 1) => `<rect x="${x - w * k / 2 + ox}" y="${y - h * k + oy}" width="${w * k}" height="${h * k}" rx="${rx}"`;
    return `<g class="gufi">` +
      (golge ? `<ellipse cx="${x}" cy="${y + 4}" rx="${w * .55}" ry="${h * .07}" fill="#000" opacity=".22"/>` : '') +
      `<rect x="${x - w * .3}" y="${y - 6 - ayak * 8}" width="${w * .18}" height="${h * .12}" rx="${w * .09}" fill="${C.golge}"/><rect x="${x + w * .12}" y="${y - 6 + ayak * 8}" width="${w * .18}" height="${h * .12}" rx="${w * .09}" fill="${C.golge}"/>` +
      `<defs><clipPath id="${c}">${kutu(0, -h * .06)}/></clipPath></defs>` +
      `<g clip-path="url(#${c})">${kutu(0, -h * .06)} fill="${C.rim}"/>${kutu(-w * .07, -h * .06 + w * .07)} fill="${C.govde}"/><circle cx="${x - w * .75}" cy="${y + h * .05}" r="${w * .95}" fill="${C.golge}" opacity=".45"/></g>` +
      gozler(x, y - h * .62, s, 24 * s, bak, duygu, kirp, acik) +
      (agiz ? `<path d="M${x - 10 * s} ${y - h * .32} Q${x} ${y - h * .22} ${x + 10 * s} ${y - h * .32}" fill="${C.golge}"/>` : '') + `</g>`;
  }

  // ---------- canlı animasyon ----------
  const SURE = { sasir: 1.2, zipla: .6, mutlu: 1.3, aha: 1.2, korku: 1.3, selam: 1.1, uzgun: 1.6, kararli: 1.2 };
  const IFADE = { sasir: 'saskin', zipla: null, mutlu: 'mutlu', aha: 'saskin', korku: 'korku', selam: 'mutlu', uzgun: 'uzgun', kararli: 'kararli' };
  // doğal göz kırpma: seed'e göre düzensiz aralık (3–5.5 sn), 0.14 sn kapanma
  function acikGoz(t, seed) {
    let k = 1; for (let i = -1; i < 40; i++) { const bt = i * 4.1 + ((seed * 7.3 + i * 2.17) % 2.3) + seed * .9; const d = t - bt; if (d > 0 && d < .16) k = Math.min(k, Math.abs(d - .08) / .08); }
    return k;
  }
  function yildizcik(x, y, r, renk, op) { let d = ''; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 - Math.PI / 2, b = a + Math.PI / 4, n = a + Math.PI / 2; d += (i ? '' : `M${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`) + ` Q${x + Math.cos(b) * r * .2} ${y + Math.sin(b) * r * .2} ${x + Math.cos(n) * r} ${y + Math.sin(n) * r}`; } return `<path d="${d}Z" fill="${renk}" opacity="${op}"/>`; }
  function canli(kim, o = {}) {
    const { t = 0, x, y, boy = kim === 'gubi' ? 160 : 140, duygu = 'merak', bakHedef = null, bak = [0, 0], tepkiler = [], seed = kim === 'gubi' ? 1 : 2, parla = .6 } = o;
    const s = boy / (kim === 'gubi' ? 160 : 140);
    // aktif tepki
    let ak = null; for (const [t0, tip] of tepkiler) if (t >= t0 && t < t0 + (SURE[tip] || 1)) ak = { t0, tip, p: (t - t0) / (SURE[tip] || 1), d: t - t0 };
    let dy = 0, dx = 0, rot = 0, sx = 1, sy = 1, ifade = duygu, efekt = '', glow = parla;
    // idle
    if (kim === 'gubi') { dy += Math.sin(t * 1.9 + seed) * 9 * s; rot += Math.sin(t * 1.3 + seed) * 4; }
    else { const n = Math.sin(t * 2.4 + seed); sy *= 1 + .025 * n; sx *= 1 - .015 * n; }
    // göz yönü
    const gy = kim === 'gubi' ? y : y - boy * .62;
    let v = bak; if (bakHedef) { const vx = bakHedef[0] - x, vy = bakHedef[1] - gy, L = Math.hypot(vx, vy) || 1; v = [vx / L, vy / L * .8]; }
    if (ak) {
      const { tip, p, d } = ak; if (IFADE[tip]) ifade = IFADE[tip];
      if (tip === 'sasir') { const j = Math.sin(cl(d / .35) * Math.PI); dy -= j * 60 * s; sy *= 1 + .15 * j; sx *= 1 - .08 * j; v = [v[0] * .3, -.6];
        const e = back(ar(d, .05, .3)) * (1 - ar(p, .8, 1)); const ey = gy - boy * .95 - 30 * s * e; efekt += `<g opacity="${e}"><rect x="${x - 7 * s}" y="${ey - 50 * s}" width="${14 * s}" height="${36 * s}" rx="${7 * s}" fill="#FFB547"/><circle cx="${x}" cy="${ey}" r="${7.5 * s}" fill="#FFB547"/></g>`; }
      if (tip === 'zipla' || tip === 'mutlu') { const n = tip === 'mutlu' ? 2 : 1, q = (d * n / (SURE[tip] * .8)) % 1, on = d < SURE[tip] * .8; if (on) { dy -= Math.sin(q * Math.PI) * (tip === 'mutlu' ? 45 : 80) * s; if (q > .85 || q < .1) { sy *= .88; sx *= 1.1; } } if (kim === 'gubi' && tip === 'mutlu') rot += Math.sin(d * 14) * 10 * (1 - p); }
      if (tip === 'aha') { glow = parla + .9 * Math.sin(cl(p * 1.4) * Math.PI); dy -= Math.sin(cl(d / .4) * Math.PI) * 40 * s;
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .3, r0 = boy * (.6 + 1.1 * eio(cl(p * 1.3))); efekt += yildizcik(x + Math.cos(a) * r0, gy + Math.sin(a) * r0, 14 * s * (1 - p), '#FFE9B8', 1 - p); } }
      if (tip === 'korku') { dx += Math.sin(d * 70) * 7 * s * (1 - p); rot -= 6 * (1 - p); v = [-.7, .2]; }
      if (tip === 'selam') rot += Math.sin(d * 13) * 13 * (1 - p);
      if (tip === 'uzgun') { sy *= 1 - .07 * Math.sin(cl(p * 1.5) * Math.PI / 2); v = [0, .8]; }
      if (tip === 'kararli') { rot += 5 * Math.sin(cl(p * 3) * Math.PI / 2); }
      if (tip === 'korku' || tip === 'sasir') { for (let i = 0; i < 2; i++) { const q = (d * 1.6 + i * .5) % 1; efekt += `<ellipse cx="${x + boy * .55 + i * 14 * s}" cy="${gy - boy * .2 + q * 60 * s}" rx="${6 * s}" ry="${9 * s}" fill="#3CD6F0" opacity="${(1 - q) * (1 - p)}"/>`; } }
    }
    const acik = ifade === 'mutlu' ? 1 : acikGoz(t, seed);
    const ayak = kim === 'gufi' && ak && (ak.tip === 'zipla' || ak.tip === 'mutlu') ? Math.sin(ak.d * 20) : 0;
    const govde = kim === 'gubi' ? gubi({ x, y, boy, duygu: ifade, bak: v, parla: glow, acik, agiz: ifade === 'mutlu' }) : gufi({ x, y, boy, duygu: ifade, bak: v, acik, ayak, golge: false, agiz: ifade === 'mutlu' });
    const px = x, py = kim === 'gubi' ? y : y; // Gufi ayak tabanından ölçeklenir
    const yer = kim === 'gufi' ? (() => { const k = 1 / (1 - dy / (boy * 1.2)); return `<ellipse cx="${x + dx}" cy="${y + 4}" rx="${boy * .55 * k}" ry="${boy * .07 * k}" fill="#000" opacity="${.22 * k}"/>`; })() : '';
    return yer + `<g transform="translate(${dx} ${dy}) translate(${px} ${py}) rotate(${rot}) scale(${sx} ${sy}) translate(${-px} ${-py})">${govde}</g><g transform="translate(${dx} ${dy})">${efekt}</g>`;
  }
  return { gubi, gufi, canli, renk: R };
})();
