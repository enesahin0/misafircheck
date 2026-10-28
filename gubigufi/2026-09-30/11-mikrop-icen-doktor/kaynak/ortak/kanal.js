/* gubigufi kanal katmanı (skill sahnelerinin üstüne): vignette, kategori etiketi, 60 sn sayacı, kinetik altyazı.
   Sahne HTML'inde: <script>window.SB = <sahne başlangıç saniyesi>;</script> ve bu dosya EN SONDA yüklenir.
   Kontur yok: altyazı okunurluğu yarı saydam koyu hap zeminle sağlanır. */
(() => {
  // Türkçe harfler (latin-ext alt kümesi) ve tüm ağırlıklar önceden yüklensin; yoksa ilk karelerde ölçüm yedek fonta göre yapılır
  if (document.fonts) for (const w of [300, 500, 700, 900]) document.fonts.load(`${w} 54px Outfit`, 'ığüşöçİĞÜŞÖÇ Aa1'), document.fonts.load(`700 24px "JetBrains Mono"`, 'İĞÜŞÖÇ Aa1');
  const NS = 'http://www.w3.org/2000/svg', svg = document.querySelector('svg');
  const ust = document.createElementNS(NS, 'g'); ust.setAttribute('id', 'kanalKatmani'); svg.appendChild(ust);
  const olc = document.createElement('canvas').getContext('2d');
  const genislik = (s, f) => { olc.font = f; return olc.measureText(s).width; };
  const e = (a, b, t) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const back = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const P = (cx, cy, r) => { let d = ''; for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * Math.PI / 2, b = a + Math.PI / 4, n = a + Math.PI / 2; d += (i ? '' : `M${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`) + ` Q${cx + Math.cos(b) * r * .16} ${cy + Math.sin(b) * r * .16} ${cx + Math.cos(n) * r} ${cy + Math.sin(n) * r}`; } return d + 'Z'; };
  const vig = `<defs><radialGradient id="kVig" cx=".5" cy=".47" r=".72"><stop offset=".55" stop-color="#050A1C" stop-opacity="0"/><stop offset="1" stop-color="#050A1C" stop-opacity="${(window.KANAL && window.KANAL.vinyet != null) ? window.KANAL.vinyet : .6}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#kVig)"/>`;
  function altyazi(T) {
    const cur = (window.CAP || []).find(c => T >= c[0] - .05 && T < c[1] + .3); if (!cur) return '';
    const [a, b, ham] = cur, kel = ham.split(' '), top = ham.replace(/\*/g, '').length, F = '900 54px Outfit', bosluk = genislik(' ', F) + 10;
    let acc = 0; const it = kel.map(w => { const hl = w.includes('*'), s = w.replace(/\*/g, ''), st = a + (acc / top) * (b - a) * .92; acc += s.length + 1; return { s, hl, st, w: genislik(s, F) }; });
    const satir = [[]]; let lw = 0; for (const x of it) { if (lw + x.w > 760 && satir[satir.length - 1].length) { satir.push([]); lw = 0; } satir[satir.length - 1].push(x); lw += x.w + bosluk; }
    const cik = e(b + .12, b + .3, T), y0 = 1372 - (satir.length - 1) * 34; let o = '';
    satir.forEach((sa, i) => { const tw = sa.reduce((s, x) => s + x.w, 0) + bosluk * (sa.length - 1); let x = 475 - tw / 2; const y = y0 + i * 68;
      const gor = sa.filter(w => T >= w.st); if (gor.length) { const gw = gor.reduce((s, w) => s + w.w, 0) + bosluk * (gor.length - 1); o += `<rect x="${x - 22}" y="${y - 50}" width="${gw + 44}" height="68" rx="34" fill="#0B1433" opacity="${.62 * (1 - cik)}"/>`; }
      for (const w of sa) { const p = back(e(w.st, w.st + .16, T)); if (p > 0) { const cx = x + w.w / 2, k = .6 + .4 * p; o += `<text x="${x}" y="${y}" font-size="54" font-weight="700" opacity="${Math.min(1, p * 1.5) * (1 - cik)}" transform="translate(${cx} ${y - 18}) scale(${k}) translate(${-cx} ${-(y - 18)})" style="fill:${w.hl ? '#FBAC39' : '#FFF3D6'};font-weight:900">${w.s}</text>`; } x += w.w + bosluk; } });
    return o;
  }
  function katman(T) {
    const TX = 974; // sayaç sağa yaslı: dış kenar 1018 = 1080 − 62 (sol etiketle simetrik)
    const K_ = window.KANAL || {}, son = K_.sesSonu || 60, a = e(.15, .5, T) * (1 - e(son - .4, son, T));
    let o = vig;
    if (a > 0) {
      o += `<g opacity="${a * .95}"><rect x="62" y="268" width="${genislik(K_.kategori || '', '700 24px "JetBrains Mono"') + 80}" height="48" rx="24" fill="#0B1433" opacity=".55"/>` +
        `<path d="${P(88, 292, 13)}" fill="${K_.renk || '#FBAC39'}"/><text class="mono" x="112" y="301" font-size="24" letter-spacing="2" style="fill:#FFF3D6">${K_.kategori || ''}</text>` +
        `<circle cx="${TX}" cy="300" r="44" fill="#0B1433" opacity=".55"/>`;
      const p = Math.min(1, T / son), a1 = -Math.PI / 2 + p * Math.PI * 2, L = 2 * Math.PI * 28;
      o += `<circle cx="${TX}" cy="300" r="28" fill="none" stroke="#FFF3D6" stroke-opacity=".18" stroke-width="6"/>` +
        `<circle cx="${TX}" cy="300" r="28" fill="none" stroke="#FFF3D6" stroke-width="6" stroke-linecap="round" stroke-dasharray="${L * p} ${L}" transform="rotate(-90 ${TX} 300)"/>` +
        `<rect x="${TX + Math.cos(a1) * 28 - 5.5}" y="${300 + Math.sin(a1) * 28 - 5.5}" width="11" height="11" fill="#EE312E"/></g>`;
    }
    ust.innerHTML = o + altyazi(T);
  }
  const once = window.renderAt;
  window.renderAt = t => { if (once) once(t); katman((window.SB || 0) + t); };
  katman(window.SB || 0);
})();
