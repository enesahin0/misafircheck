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
      Tepkiler: sasir · zipla · mutlu · aha · korku · selam (el sallar) · uzgun · kararli ·
        isaret (isaretHedef'i eliyle gösterir) · alkis · gozKapa (gözlerini sıkıca yumar, büzülür) · dusun (el çenede + düşünce baloncukları) ·
        omuzSilk · kahkaha · goster ("ta-da", iki el açık) · donus (kendi etrafında döner)
      yol: [[t, x, y, boy], ...] anahtar karelerle hareket — Gufi ZIPLAYARAK gider, Gubi SÜZÜLEREK (pırıltı izi bırakır).
      bakHedef: 'kamera' → izleyiciye bakar.  eller: false → elleri gizle.
      ust: SVG metni ya da (x, y, boy, ifade, t) => SVG — KOSTÜM için KO.giy(kim, ['silindir','monokl',...]) kullan (kostum.js).
   ELLER: YALNIZCA GUFİ'DE (Gubi elsiz: işarette pırıltı izi + eğilme, göz kapatmada gözlerini sıkıca yumar). Normalde görünmez; el gerektiren harekette gövdenin arkasından çıkar, bitince geri saklanır.
   SAHNE YARDIMCILARI: M.yakinlas(t, t0, t1) → 0..1 zarf (kameraya yaklaşma), M.bulanik(k) arka planı bulanıklaştırır,
      M.bulanikSar(svg, k) dinamik katmanı bulanıklaştırır, M.balon(x, y, içerik, {w,h,yon}) konuşma balonu, M.hareket(kf, t).
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
  const SURE = { sasir: 1.2, zipla: .6, mutlu: 1.3, aha: 1.2, korku: 1.3, selam: 1.3, uzgun: 1.6, kararli: 1.2,
    isaret: 1.5, alkis: 1.3, gozKapa: 1.5, dusun: 1.9, omuzSilk: 1.2, kahkaha: 1.4, goster: 1.4, donus: .9 };
  const IFADE = { sasir: 'saskin', zipla: null, mutlu: 'mutlu', aha: 'saskin', korku: 'korku', selam: 'mutlu', uzgun: 'uzgun', kararli: 'kararli',
    isaret: 'merak', alkis: 'mutlu', gozKapa: 'korku', dusun: 'merak', omuzSilk: 'merak', kahkaha: 'mutlu', goster: 'mutlu', donus: 'mutlu' };
  // doğal göz kırpma: seed'e göre düzensiz aralık (3–5.5 sn), 0.14 sn kapanma
  function acikGoz(t, seed) {
    let k = 1; for (let i = -1; i < 40; i++) { const bt = i * 4.1 + ((seed * 7.3 + i * 2.17) % 2.3) + seed * .9; const d = t - bt; if (d > 0 && d < .16) k = Math.min(k, Math.abs(d - .08) / .08); }
    return k;
  }
  function yildizcik(x, y, r, renk, op) { let d = ''; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 - Math.PI / 2, b = a + Math.PI / 4, n = a + Math.PI / 2; d += (i ? '' : `M${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`) + ` Q${x + Math.cos(b) * r * .2} ${y + Math.sin(b) * r * .2} ${x + Math.cos(n) * r} ${y + Math.sin(n) * r}`; } return `<path d="${d}Z" fill="${renk}" opacity="${op}"/>`; }
  const lerp = (a, b, k) => a + (b - a) * k;
  // anahtar karelerle hareket: kf = [[t, x, y, boy?], ...] → { x, y, boy, hiz (0..1 hareket halinde), yon (-1/1) }
  function hareket(kf, t) {
    if (!kf || !kf.length) return null;
    if (t <= kf[0][0]) return { x: kf[0][1], y: kf[0][2], boy: kf[0][3], hiz: 0, yon: 1, q: 0 };
    for (let i = 0; i < kf.length - 1; i++) { const [t0, x0, y0, b0] = kf[i], [t1, x1, y1, b1] = kf[i + 1];
      if (t < t1) { const q = (t - t0) / (t1 - t0), k = eio(q); const hareketli = Math.hypot(x1 - x0, y1 - y0) > 2;
        return { x: lerp(x0, x1, k), y: lerp(y0, y1, k), boy: b0 == null ? b1 : lerp(b0, b1 == null ? b0 : b1, k), hiz: hareketli ? Math.sin(q * Math.PI) : 0, yon: x1 >= x0 ? 1 : -1, q, mesafe: Math.hypot(x1 - x0, y1 - y0) }; } }
    const l = kf[kf.length - 1]; return { x: l[1], y: l[2], boy: l[3], hiz: 0, yon: 1, q: 1 };
  }
  // kameraya yaklaşma zarfı: t0'da başlar, t1'de biter; 0→1→0
  function yakinlas(t, t0, t1, gecis = .55) { return eio(ar(t, t0, t0 + gecis)) * (1 - eio(ar(t, t1 - gecis, t1))); }
  // arka planı bulanıklaştır (yakın planlarda): #zemin/#sabit gruplarına CSS blur; dinamik katman için bulanikSar
  function bulanik(k, px = 12) {
    const f = k > .01 ? `blur(${(k * px).toFixed(2)}px) saturate(${1 - .25 * k})` : 'none';
    for (const i of ['zemin', 'sabit']) { const e = document.getElementById(i); if (e) { e.style.filter = f; e.style.transformOrigin = '540px 960px'; e.style.transform = k > .01 ? `scale(${1 + .05 * k})` : ''; } }
  }
  const bulanikSar = (svg, k, px = 12) => k > .01 ? `<g style="filter:blur(${(k * px).toFixed(2)}px) saturate(${1 - .25 * k});transform-origin:540px 960px;transform:scale(${1 + .05 * k})">${svg}</g><rect width="1080" height="1920" fill="#FFFFFF" opacity="${.1 * k}"/>` : svg;
  function balon(x, y, ic, { w = 260, h = 150, yon = -1, renk = '#FFF3D6', olcek = 1 } = {}) {
    return `<g transform="translate(${x} ${y}) scale(${olcek})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2.3}" fill="${renk}"/><path d="M${yon * w * .18} ${h / 2 - 4} L${yon * w * .32} ${h / 2 + 56} L${yon * w * .02} ${h / 2 - 4}Z" fill="${renk}"/>${ic}</g>`;
  }
  function canli(kim, o = {}) {
    let { t = 0, x, y, boy = kim === 'gubi' ? 160 : 140, duygu = 'merak', bakHedef = null, bak = [0, 0], tepkiler = [], seed = kim === 'gubi' ? 1 : 2, parla = .6, ust = '', yol = null, eller = kim === 'gufi', isaretHedef = null } = o;  // eller yalnızca Gufi'de (Gubi elsiz)
    // yol: anahtar karelerle yer değiştirme (Gufi zıplayarak, Gubi süzülerek + pırıltı izi)
    let iz = '', hopDy = 0, yolYon = 1;
    const hr = hareket(yol, t);
    if (hr) { x = hr.x; y = hr.y; if (hr.boy != null) boy = hr.boy; yolYon = hr.yon;
      if (hr.hiz > 0 && kim === 'gufi') { const n = Math.max(1, Math.round((hr.mesafe || 300) / 180)); hopDy = -Math.abs(Math.sin(hr.q * Math.PI * n)) * boy * .45; }
      if (hr.hiz > 0 && kim === 'gubi') for (let i = 1; i <= 5; i++) { const g = hareket(yol, t - i * .06); if (g) iz += yildizcik(g.x, g.y, boy * .09 * (1 - i / 6), '#FFE9B8', .8 * hr.hiz * (1 - i / 6)); } }
    const s = boy / (kim === 'gubi' ? 160 : 140), W = boy * .5;
    const kamera = bakHedef === 'kamera'; if (kamera) bakHedef = null;
    // aktif tepki
    let ak = null; for (const [t0, tip] of tepkiler) if (t >= t0 && t < t0 + (SURE[tip] || 1)) ak = { t0, tip, p: (t - t0) / (SURE[tip] || 1), d: t - t0, S: SURE[tip] || 1 };
    let dy = hopDy, dx = 0, rot = 0, sx = 1, sy = 1, ifade = duygu, efekt = '', glow = parla, gubiGozKapa = 0;
    if (hopDy < -2 && kim === 'gufi') { sy *= 1.06; sx *= .95; } else if (hr && hr.hiz > 0 && kim === 'gufi') { sy *= .92; sx *= 1.07; }
    if (hr && hr.hiz > 0 && kim === 'gubi') rot += 14 * hr.hiz * yolYon;
    // idle
    if (kim === 'gubi') { dy += Math.sin(t * 1.9 + seed) * 9 * s; rot += Math.sin(t * 1.3 + seed) * 4; }
    else { const n = Math.sin(t * 2.4 + seed); sy *= 1 + .025 * n; sx *= 1 - .015 * n; }
    // göz yönü
    const gy = kim === 'gubi' ? y : y - boy * .62, cy = kim === 'gubi' ? y : y - boy * .56;
    let v = kamera ? [0, .1] : bak; if (bakHedef) { const vx = bakHedef[0] - x, vy = bakHedef[1] - gy, L = Math.hypot(vx, vy) || 1; v = [vx / L, vy / L * .8]; }
    // eller: [x, y] gövde merkezine göre (W birimi); idle konum
    // eller normalde GÖRÜNMEZ: bir hareket el gerektirdiğinde gövdenin ARKASINDAN çıkar, bitince geri saklanır
    const merkezEl = sx0 => [sx0 * .15 * W, .15 * W];
    let EL = [merkezEl(-1), merkezEl(1)], ELK = [0, 0], parmak = [null, null];
    const elHedef = (tipEl, k) => { EL = EL.map((e, i) => tipEl[i] ? [lerp(e[0], tipEl[i][0], k), lerp(e[1], tipEl[i][1], k)] : e); ELK = ELK.map((q, i) => tipEl[i] ? Math.max(q, k) : q); };
    if (ak) {
      const { tip, p, d, S: SR } = ak; if (IFADE[tip]) ifade = IFADE[tip];
      const ke = Math.min(1, d / .18, (SR - d) / .22); // elin hedefe gidiş-dönüş zarfı
      if (tip === 'sasir') { const j = Math.sin(cl(d / .35) * Math.PI); dy -= j * 60 * s; sy *= 1 + .15 * j; sx *= 1 - .08 * j; v = [v[0] * .3, -.6];
        const e = back(ar(d, .05, .3)) * (1 - ar(p, .8, 1)); const ey = gy - boy * .95 - 30 * s * e; efekt += `<g opacity="${e}"><rect x="${x - 7 * s}" y="${ey - 50 * s}" width="${14 * s}" height="${36 * s}" rx="${7 * s}" fill="#FFB547"/><circle cx="${x}" cy="${ey}" r="${7.5 * s}" fill="#FFB547"/></g>`;
        elHedef([[-1.25 * W, -.6 * W], [1.25 * W, -.6 * W]], ke); }
      if (tip === 'zipla' || tip === 'mutlu') { const n = tip === 'mutlu' ? 2 : 1, q = (d * n / (SR * .8)) % 1, on = d < SR * .8; if (on) { dy -= Math.sin(q * Math.PI) * (tip === 'mutlu' ? 45 : 80) * s; if (q > .85 || q < .1) { sy *= .88; sx *= 1.1; } } if (kim === 'gubi' && tip === 'mutlu') rot += Math.sin(d * 14) * 10 * (1 - p);
        elHedef([[-1.05 * W, (-1.0 + .15 * Math.sin(d * 16)) * W], [1.05 * W, (-1.0 + .15 * Math.sin(d * 16 + 1)) * W]], ke); }
      if (tip === 'aha') { glow = parla + .9 * Math.sin(cl(p * 1.4) * Math.PI); dy -= Math.sin(cl(d / .4) * Math.PI) * 40 * s;
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + .3, r0 = boy * (.6 + 1.1 * eio(cl(p * 1.3))); efekt += yildizcik(x + Math.cos(a) * r0, gy + Math.sin(a) * r0, 14 * s * (1 - p), '#FFE9B8', 1 - p); }
        elHedef([null, [1.1 * W, -1.05 * W]], ke); parmak[1] = [0, -1]; }
      if (tip === 'korku') { dx += Math.sin(d * 70) * 7 * s * (1 - p); rot -= 6 * (1 - p); v = [-.7, .2]; elHedef([[-.55 * W, -.25 * W], [.55 * W, -.25 * W]], ke); }
      if (tip === 'selam') { rot += Math.sin(d * 13) * 6 * (1 - p); elHedef([null, [(1.15 + .18 * Math.sin(d * 14)) * W, -1.05 * W]], ke); }
      if (tip === 'uzgun') { sy *= 1 - .07 * Math.sin(cl(p * 1.5) * Math.PI / 2); v = [0, .8]; elHedef([[-.85 * W, .7 * W], [.85 * W, .7 * W]], ke); }
      if (tip === 'kararli') { rot += 5 * Math.sin(cl(p * 3) * Math.PI / 2); elHedef([[-1.1 * W, .35 * W], [1.1 * W, .35 * W]], ke); }
      if (tip === 'korku' || tip === 'sasir') { for (let i = 0; i < 2; i++) { const q = (d * 1.6 + i * .5) % 1; efekt += `<ellipse cx="${x + boy * .55 + i * 14 * s}" cy="${gy - boy * .2 + q * 60 * s}" rx="${6 * s}" ry="${9 * s}" fill="#3CD6F0" opacity="${(1 - q) * (1 - p)}"/>`; } }
      if (kim === 'gubi' && tip === 'isaret') { const h = isaretHedef || bakHedef || [x + 400, cy - 200]; const vx = h[0] - x, vy = h[1] - cy, L = Math.hypot(vx, vy) || 1, ux = vx / L, uy = vy / L;
        dx += ux * 14 * s * ke; dy += uy * 14 * s * ke; rot += ux * 12 * ke;
        for (let i = 0; i < 5; i++) { const q = (d * 1.4 + i / 5) % 1, r0 = W * (1.3 + q * 2.2); efekt += yildizcik(x + ux * r0, cy + uy * r0, 18 * s * (1 - q * .6) * ke, '#FFD27A', (1 - q) * ke); } }
      if (kim === 'gubi' && tip === 'gozKapa') { gubiGozKapa = ke; sy *= 1 - .08 * ke; }
      if (kim === 'gubi' && tip === 'alkis') { glow = parla + .5 * Math.abs(Math.sin(d * 9)); dy -= Math.abs(Math.sin(d * 9)) * 10 * s; }
      if (tip === 'isaret' && kim === 'gufi') { const h = isaretHedef || bakHedef || [x + 400, cy - 200]; const vx = h[0] - x, vy = h[1] - cy, L = Math.hypot(vx, vy) || 1, ux = vx / L, uy = vy / L;
        v = [ux, uy * .8]; const uz = 1.35 + .08 * Math.sin(d * 10); elHedef([null, [ux * uz * W, uy * uz * W]], ke); parmak[1] = [ux, uy]; rot += ux * 6 * ke; }
      if (tip === 'alkis') { const q = Math.abs(Math.sin(d * 9)), ax = (.18 + .7 * q) * W; elHedef([[-ax, -.15 * W], [ax, -.15 * W]], ke);
        if (q < .15 && ke > .5) for (let i = 0; i < 4; i++) { const a = i * 1.57 + .7; efekt += yildizcik(x + Math.cos(a) * W * .35, cy - .15 * W + Math.sin(a) * W * .35, 10 * s, '#FFE27A', .9); } }
      if (kim === 'gufi' && tip === 'gozKapa') { gubiGozKapa = ke; sy *= 1 - .08 * ke; sx *= 1 + .04 * ke; }
      if (tip === 'dusun') { elHedef([null, [.3 * W, (.55 + .04 * Math.sin(d * 8)) * W]], ke); v = [.5, -.7]; rot -= 5 * ke;
        for (let i = 0; i < 3; i++) { const q = ar(d, .3 + i * .25, .5 + i * .25) * (1 - ar(p, .85, 1)); if (q > 0) efekt += `<circle cx="${x + W * (.9 + i * .35)}" cy="${cy - W * (1.2 + i * .45)}" r="${(6 + i * 5) * s * q}" fill="#FFF3D6" opacity=".95"/>`; } }
      if (tip === 'omuzSilk') { const u = Math.sin(cl(p * 1.2) * Math.PI); dy -= 10 * s * u; elHedef([[-1.3 * W, -.25 * W], [1.3 * W, -.25 * W]], ke); v = [0, -.2]; }
      if (tip === 'kahkaha') { rot += Math.sin(d * 30) * 5 * (1 - p * .5); dy -= Math.abs(Math.sin(d * 15)) * 8 * s; elHedef([[-.45 * W, .55 * W], [.45 * W, .55 * W]], ke);
        const q = (d * 2) % 1; efekt += `<text x="${x + W * 1.1}" y="${cy - W * (1 + q * .6)}" font-size="${34 * s}" font-weight="900" opacity="${1 - q}" style="fill:#FFB547">ha</text>`; }
      if (tip === 'goster') { const u = back(ar(d, 0, .35)); elHedef([[-1.45 * W, -.35 * W], [1.45 * W, -.35 * W]], ke * Math.min(1, u)); dy -= 6 * s * Math.sin(cl(p) * Math.PI);
        for (let i = 0; i < 2; i++) efekt += yildizcik(x + (i ? 1 : -1) * 1.8 * W, cy - .6 * W, 12 * s * ke, '#FFE27A', ke); }
      if (tip === 'donus') { rot += 360 * eio(p); const j = Math.sin(p * Math.PI); sy *= 1 - .1 * j; sx *= 1 + .1 * j; dy -= 30 * s * j; }
    }
    const acik = ifade === 'mutlu' ? 1 : (gubiGozKapa > .5 ? 0 : acikGoz(t, seed));
    const ayak = kim === 'gufi' && ((ak && (ak.tip === 'zipla' || ak.tip === 'mutlu')) || (hr && hr.hiz > 0)) ? Math.sin((ak ? ak.d : t) * 20) : 0;
    const govde = kim === 'gubi' ? gubi({ x, y, boy, duygu: ifade, bak: v, parla: glow, acik, agiz: ifade === 'mutlu' }) : gufi({ x, y, boy, duygu: ifade, bak: v, acik, ayak, golge: false, agiz: ifade === 'mutlu' });
    // eller (yüzen yuvarlak eldivenler, kontur yok; rim light)
    let el = '';
    if (eller) { const C = R[kim], er0 = boy * (kim === 'gubi' ? .12 : .14);
      EL.forEach(([ex, ey], i) => { const k = ELK[i]; if (k <= .02) return; const er = er0 * (.35 + .65 * Math.min(1, k * 1.3)), hx = x + ex, hy = cy + ey;
        if (parmak[i] && k > .6) { const [ux, uy] = parmak[i]; el += `<ellipse cx="${hx + ux * er * 1.1}" cy="${hy + uy * er * 1.1}" rx="${er * .55}" ry="${er * .32}" transform="rotate(${Math.atan2(uy, ux) * 57.3} ${hx + ux * er * 1.1} ${hy + uy * er * 1.1})" fill="${C.govde}"/>`; }
        el += `<circle cx="${hx + er * .08}" cy="${hy + er * .1}" r="${er}" fill="${C.golge}"/><circle cx="${hx}" cy="${hy}" r="${er}" fill="${C.govde}"/><circle cx="${hx + er * .35}" cy="${hy - er * .35}" r="${er * .32}" fill="${C.rim}" opacity=".8"/>`; }); }
    const ustS = typeof ust === 'function' ? ust(x, y, boy, ifade, t) : ust; // kostüm: KO.giy(...) fonksiyonu konuma göre çizilir
    const onde = false; // eller hep gövdenin arkasından çıkar
    const px = x, py = y;
    const yer = kim === 'gufi' ? (() => { const k = 1 / (1 - dy / (boy * 1.2)); return `<ellipse cx="${x + dx}" cy="${y + 4}" rx="${boy * .55 * k}" ry="${boy * .07 * k}" fill="#000" opacity="${.22 * k}"/>`; })() : '';
    return iz + yer + `<g transform="translate(${dx} ${dy}) translate(${px} ${py}) rotate(${rot}) scale(${sx} ${sy}) translate(${-px} ${-py})">${onde ? govde + ustS + el : el + govde + ustS}</g><g transform="translate(${dx} ${dy})">${efekt}</g>`;
  }
  return { gubi, gufi, canli, hareket, yakinlas, bulanik, bulanikSar, balon, renk: R };
})();
