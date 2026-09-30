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
  const back = x => { if (x <= 0) return 0; const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const P = (cx, cy, r) => { let d = ''; for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + i * Math.PI / 2, b = a + Math.PI / 4, n = a + Math.PI / 2; d += (i ? '' : `M${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`) + ` Q${cx + Math.cos(b) * r * .16} ${cy + Math.sin(b) * r * .16} ${cx + Math.cos(n) * r} ${cy + Math.sin(n) * r}`; } return d + 'Z'; };
  const vig = `<defs><radialGradient id="kVig" cx=".5" cy=".47" r=".72"><stop offset=".55" stop-color="#050A1C" stop-opacity="0"/><stop offset="1" stop-color="#050A1C" stop-opacity=".6"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#kVig)"/>`;
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
    const K_ = window.KANAL || {}, son = K_.sesSonu || 60, kat = K_.kategori || '', renk = K_.renk || '#FBAC39';
    const cik = 1 - e(son - .4, son, T);
    let o = vig;
    // KATEGORİ GİRİŞİ (animasyonlu): yıldız dönerek doğar + şok halkası + kıvılcımlar → hap açılır → harfler tek tek zıplar →
    // seri adı yazılır → 1.05 sn'de iz bırakarak sol üste uçar → yerine oturunca yıldız bir tur döner ve hafif esner
    const cw = genislik(kat, '700 24px "JetBrains Mono"') + 80, chW = genislik('M', '700 24px "JetBrains Mono"') + 2;
    const io = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const yer = e(1.05, 1.55, T), yk = io(yer);
    const BS = 2.3, bx = 540 - cw * BS / 2, by = 900;
    const konum = k => [bx + (62 - bx) * k, by + (292 - by) * k - Math.sin(k * Math.PI) * 120, BS + (1 - BS) * k];
    const [cx, cy, sc] = konum(yk);
    const girisVar = kat && K_.giris !== false;
    const yildizK = back(e(0, .3, T)), yildizR = (1 - e(0, .35, T)) * 200 + (T > 1.55 ? (1 - e(1.55, 1.95, T)) * 360 : 0);
    const hapK = girisVar ? io(e(.12, .42, T)) : 1;
    const oturma = T > 1.55 && T < 1.9 ? Math.sin(e(1.55, 1.9, T) * Math.PI) * .12 : 0;
    function cip(x, y, s, op, harfT) {
      const w = 52 + (cw - 52) * hapK; let h = `<g opacity="${op}" transform="translate(${x} ${y}) scale(${s * (1 + oturma)} ${s * (1 - oturma)})">` +
        `<rect x="0" y="-24" width="${w}" height="48" rx="24" fill="#0B1433" opacity="${.55 + .35 * (1 - yk)}"/>` +
        `<g transform="translate(26 0) rotate(${yildizR}) scale(${girisVar ? yildizK : 1})"><path d="${P(0, 0, 13)}" fill="${renk}"/></g>`;
      if (hapK > .05) { h += `<defs><clipPath id="kHap"><rect x="0" y="-30" width="${w}" height="60" rx="24"/></clipPath></defs><g clip-path="url(#kHap)">`;
        [...kat].forEach((c, i) => { const q = harfT ? back(e(.3 + i * .035, .5 + i * .035, T)) : 1; if (q <= 0) return;
          h += `<text class="mono" x="${50 + i * chW}" y="${9 + (1 - Math.min(1, q)) * 18}" font-size="24" opacity="${Math.min(1, q * 1.5)}" style="fill:#FFF3D6">${c === ' ' ? '&#160;' : c}</text>`; });
        h += `</g>`; }
      return h + `</g>`;
    }
    if (girisVar && T < 1.6) {
      const g = 1 - yk, gp = Math.min(1, e(0, .25, T) * 1.2);
      o += `<rect width="1080" height="1920" fill="#050A1C" opacity="${.38 * g * gp}"/>`;
      o += `<defs><radialGradient id="kGiris"><stop offset="0" stop-color="${renk}" stop-opacity=".5"/><stop offset="1" stop-color="${renk}" stop-opacity="0"/></radialGradient></defs><circle cx="${cx + cw * sc / 2}" cy="${cy}" r="${(300 + 140 * gp) * g + 1}" fill="url(#kGiris)" opacity="${g * gp}"/>`;
      // şok halkası + kıvılcımlar (yıldızın doğduğu yerden)
      const sx = bx + 26 * BS, sy = by, hr = e(.05, .6, T);
      if (hr > 0 && hr < 1) o += `<circle cx="${sx}" cy="${sy}" r="${30 + 260 * io(hr)}" fill="none" stroke="${renk}" stroke-width="${10 * (1 - hr)}" opacity="${1 - hr}"/>`;
      for (let i = 0; i < 10; i++) { const q = e(.06 + i * .012, .7 + i * .012, T); if (q <= 0 || q >= 1) continue; const a = i / 10 * Math.PI * 2 + .4, r = 40 + 300 * io(q) * (.7 + .3 * ((i * 7) % 3) / 2);
        o += `<path d="${P(sx + Math.cos(a) * r, sy + Math.sin(a) * r, 16 * (1 - q) + 2)}" fill="${i % 2 ? renk : '#FFF3D6'}" opacity="${1 - q}"/>`; }
      if (K_.seri) { const sp = e(.55, 1.0, T), sk = 1 - e(.95, 1.15, T), sw = genislik(K_.seri, '700 30px "JetBrains Mono"') + 5 * K_.seri.length;
        o += `<defs><clipPath id="kSeri"><rect x="${540 - sw / 2 - 10}" y="${by + 50}" width="${(sw + 20) * sp}" height="70"/></clipPath></defs>` +
          `<text class="mono" x="540" y="${by + 102}" font-size="30" text-anchor="middle" letter-spacing="5" clip-path="url(#kSeri)" opacity="${sk}" style="fill:#FFF3D6">${K_.seri}</text>` +
          (sp > 0 && sp < 1 ? `<rect x="${540 - sw / 2 + sw * sp}" y="${by + 72}" width="4" height="38" fill="${renk}" opacity="${sk}"/>` : ''); }
      // uçuş izi: önceki konumlarda silikleşen iki kopya
      if (yer > 0 && yer < 1) for (const [d, op] of [[.12, .25], [.24, .12]]) { const [tx, ty, ts] = konum(io(Math.max(0, yer - d))); o += cip(tx, ty, ts, op, false); }
    }
    const cA = (girisVar ? Math.min(1, e(0, .12, T) * 1.5) : e(.15, .5, T)) * cik;
    if (kat && cA > 0) o += cip(cx, cy, sc, cA * .95, girisVar);
    const a = e(1.3, 1.7, T) * cik;
    if (a > 0) {
      o += `<g opacity="${a * .95}"><circle cx="${TX}" cy="300" r="44" fill="#0B1433" opacity=".55"/>`;
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
