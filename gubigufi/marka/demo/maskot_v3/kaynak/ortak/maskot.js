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
      v3 YENİ HAREKETLER: dans (♪ kalça + el) · kos (yerinde koşu + toz) · titre (üşüme/korku titremesi) · esne · uyu (zzz) · tokezle ·
        bayil (yan devrilir + yıldızlar) · evet (baş sallar) · hayir · sinir (buhar + öfke işareti, ayak vurur) · utan (pembe yanak) ·
        agla (gözyaşı) · ask (kalp göz + kalpler) · egil (selam vererek eğilir) · takla (ters takla) · yorgun (ter, çöker) ·
        saklan (büzülür) · kafaKasi (? ile kafa kaşır) · ayakTap (sabırsızlık, kol kavuşturur)
      v3 YENİ DUYGULAR (duygu:): sinirli · uykulu · uyu · asik · utangac · aglamakli (+ eskiler: merak, mutlu, saskin, korku, uzgun, kararli)
      v3 YAŞLI: yasli: true → solgun renk, beyaz gür kaşlar (duyguya göre şekil alır), sarkık göz kapağı, göz altı/kaz ayağı çizgileri,
        pembe yanak; Gufi'de beyaz bıyık + BASTON (baston: false ile kapatılır), Gubi'de beyaz perçem + sakal tutamı; daha yavaş, hafif titrek idle.
      v3 CANLILIK (varsayılan açık; canlilik: false kapatır): tepki yokken kendiliğinden etrafa bakma, minik zıplama, sallanma, derin nefes.
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
    gubiY: { govde: '#EFB868', golge: '#A8684A', rim: '#FFF0D0', glow: '#F2D6A0' },   // yaşlı: hafif solgun, sıcak
    gufiY: { govde: '#D24A4A', golge: '#7A2A3A', rim: '#F2C8C0', glow: '#E89A90' },
    sac: '#F4F2EE', sacG: '#C8C4BC', yanak: '#FF8FA3',
  };
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
  const ar = (t, a, b) => cl((t - a) / (b - a));
  const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

  // ---------- göz ----------
  function goz(x, y, s, bak, duygu, acik = 1, taraf = 1, yas = null) {
    const buyuk = duygu === 'saskin' || duygu === 'korku';
    const rx = 15 * s, ry = (buyuk ? 21 : (duygu === 'kararli' || duygu === 'uzgun' || duygu === 'sinirli' || duygu === 'aglamakli') ? 14 : 18) * s, pr = (buyuk ? 5.5 : 8) * s;
    if (duygu === 'uykulu') acik = Math.min(acik, .38);
    if (duygu === 'uyu') acik = 0;
    let o = '';
    if (duygu === 'mutlu' || duygu === 'utangac' && false) o = `<path d="M${x - rx} ${y + 4 * s} Q${x} ${y - 20 * s} ${x + rx} ${y + 4 * s} Q${x} ${y - 8 * s} ${x - rx} ${y + 4 * s}Z" fill="${R.bebek}"/>`;
    else if (acik < .25) o = `<path d="M${x - rx} ${y} Q${x} ${y + 9 * s} ${x + rx} ${y}" stroke="${R.bebek}" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>`; // kapalı göz (aşağı kavis)
    else {
      const bx = x + bak[0] * 7 * s, by = y + bak[1] * 7 * s + 2 * s;
      const bebek = duygu === 'asik' ? `<path transform="translate(${bx} ${by}) scale(${s * 1.15})" d="M0 9 C-14 -1 -11 -11 -5 -11 C-2 -11 0 -9 0 -7 C0 -9 2 -11 5 -11 C11 -11 14 -1 0 9Z" fill="#E8325A"/>` : `<circle cx="${bx}" cy="${by}" r="${pr}" fill="${R.bebek}"/><circle cx="${bx + 3 * s}" cy="${by - 4 * s}" r="${2.6 * s}" fill="#FFFFFF"/>`;
      o = `<g transform="translate(0 ${y}) scale(1 ${acik}) translate(0 ${-y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FFFFFF"/>${bebek}</g>`;
      // yaşlı: sarkık üst göz kapağı (gövde renginde)
      if (yas && !buyuk && acik > .5) { const c = id('gk'); o += `<defs><clipPath id="${c}"><ellipse cx="${x}" cy="${y}" rx="${rx + .5}" ry="${ry * acik + .5}"/></clipPath></defs><rect x="${x - rx - 2}" y="${y - ry - 2}" width="${2 * rx + 4}" height="${ry * .62}" fill="${yas.kapak}" clip-path="url(#${c})"/><path d="M${x - rx} ${y - ry * .45} Q${x} ${y - ry * .2} ${x + rx} ${y - ry * .45}" stroke="${yas.golge}" stroke-width="${2.2 * s}" fill="none" opacity=".7"/>`; }
    }
    if (duygu === 'uzgun' || duygu === 'aglamakli') o += `<path d="M${x - rx - 2} ${y - ry - 2 * s} Q${x - rx * .2} ${y - ry - 12 * s} ${x + rx + 2} ${y - ry - 12 * s} L${x + rx + 2} ${y - ry - 4 * s} Q${x - rx * .2} ${y - ry - 4 * s} ${x - rx - 2} ${y - ry + 6 * s}Z" fill="${R.bebek}"/>`;
    if (duygu === 'kararli') o += `<path d="M${x - rx - 4} ${y - ry - 10 * s} L${x + rx + 4} ${y - ry + 2 * s} L${x + rx + 4} ${y - ry + 10 * s} L${x - rx - 4} ${y - ry - 2 * s}Z" fill="${R.bebek}"/>`;
    if (duygu === 'sinirli' && !yas) { const ox = x + taraf * (rx + 4), ix = x - taraf * (rx + 2); o += `<path d="M${ox} ${y - ry - 14 * s} L${ix} ${y - ry + 1 * s} L${ix} ${y - ry + 8 * s} L${ox} ${y - ry - 6 * s}Z" fill="${R.bebek}"/>`; }
    // yaşlı: beyaz gür kaş + göz altı torbası + kaz ayağı
    if (yas) {
      const ox = x + taraf * (rx + 5 * s), ix = x - taraf * (rx - 2 * s), yb = y - ry - 9 * s;
      let yo = yb, yi = yb, kv = -7 * s;
      if (duygu === 'uzgun' || duygu === 'aglamakli' || duygu === 'uykulu') { yo = yb + 7 * s; yi = yb - 8 * s; kv = -3 * s; }
      else if (duygu === 'sinirli' || duygu === 'kararli') { yo = yb - 8 * s; yi = yb + 8 * s; kv = -2 * s; }
      else if (buyuk) { yo = yb - 12 * s; yi = yb - 12 * s; kv = -9 * s; }
      else if (duygu === 'mutlu') { yo = yb + 8 * s; yi = yb + 8 * s; }
      o += `<path d="M${ox} ${yo} Q${(ox + ix) / 2} ${(yo + yi) / 2 + kv} ${ix} ${yi}" stroke="${R.sacG}" stroke-width="${11 * s}" fill="none" stroke-linecap="round"/><path d="M${ox} ${yo - 1.5 * s} Q${(ox + ix) / 2} ${(yo + yi) / 2 + kv - 1.5 * s} ${ix} ${yi - 1.5 * s}" stroke="${R.sac}" stroke-width="${8 * s}" fill="none" stroke-linecap="round"/>` +
        `<path d="M${ox + taraf * 1 * s} ${yo + 1 * s} l${taraf * 6 * s} ${4 * s}" stroke="${R.sac}" stroke-width="${4 * s}" stroke-linecap="round"/>`;
      o += `<path d="M${x - rx * .7} ${y + ry + 3 * s} Q${x} ${y + ry + 9 * s} ${x + rx * .7} ${y + ry + 3 * s}" stroke="${yas.golge}" stroke-width="${2.4 * s}" fill="none" opacity=".75" stroke-linecap="round"/>`;
      const kx = x + taraf * (rx + 5 * s); o += `<path d="M${kx} ${y - 2 * s} l${taraf * 8 * s} ${-4 * s} M${kx} ${y + 3 * s} l${taraf * 8 * s} ${3 * s}" stroke="${yas.golge}" stroke-width="${2.2 * s}" stroke-linecap="round" opacity=".7"/>`;
    }
    return o;
  }
  const gozler = (x, y, s, ara, bak, duygu, kirp, acik, yas = null) => {
    const g = acik == null ? `<g class="kirp" style="animation-delay:${kirp}s">${goz(x - ara, y, s, bak, duygu, 1, -1, yas)}${goz(x + ara, y, s, bak, duygu, 1, 1, yas)}</g>`
      : goz(x - ara, y, s, bak, duygu, acik, -1, yas) + goz(x + ara, y, s, bak, duygu, acik, 1, yas);
    const yanak = duygu === 'utangac' ? .75 : yas ? .28 : 0;
    return g + (yanak ? [-1, 1].map(k => `<ellipse cx="${x + k * (ara + 8 * s)}" cy="${y + 26 * s}" rx="${11 * s}" ry="${6 * s}" fill="${R.yanak}" opacity="${yanak}"/>`).join('') : '');
  };

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
  function gubi({ x, y, boy = 160, duygu = 'merak', bak = [0, 0], kirp = 0, parla = .6, agiz = false, acik = null, yasli = false } = {}) {
    const r = boy / 2, c = id('gb'), g = id('gg'), C = yasli ? R.gubiY : R.gubi, s = boy / 160, yas = yasli ? { kapak: C.govde, golge: C.golge } : null;
    return `<g class="gubi">` +
      `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${C.glow}" stop-opacity="${parla}"/><stop offset="1" stop-color="${C.glow}" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="${c}"><path d="${gubiYol(x, y, r)}"/></clipPath></defs>` +
      `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="url(#${g})"/>` +
      `<g clip-path="url(#${c})"><path d="${gubiYol(x, y, r)}" fill="${C.rim}"/><path d="${gubiYol(x, y, r, -r * .07, r * .07)}" fill="${C.govde}"/>` +
      `<path d="${gubiYol(x, y, r * 1.05, -r * .55, r * .55)}" fill="${C.golge}" opacity=".45"/></g>` +
      gozler(x, y - r * .05, s, 20 * s, bak, duygu, kirp, acik, yas) +
      (agiz ? `<path d="M${x - 9 * s} ${y + 28 * s} Q${x} ${y + 38 * s} ${x + 9 * s} ${y + 28 * s}" fill="${C.golge}"/>` : '') +
      (yasli ? `<g fill="${R.sac}"><circle cx="${x - 7 * s}" cy="${y - r * 1.02}" r="${7 * s}"/><circle cx="${x + 4 * s}" cy="${y - r * 1.08}" r="${8 * s}"/><circle cx="${x + 12 * s}" cy="${y - r * .98}" r="${6 * s}"/><path d="M${x - 12 * s} ${y + r * .92} Q${x} ${y + r * 1.35} ${x + 12 * s} ${y + r * .92}Z"/></g><path d="M${x - 8 * s} ${y + r * .95} Q${x} ${y + r * 1.2} ${x + 6 * s} ${y + r * .98}" stroke="${R.sacG}" stroke-width="${2 * s}" fill="none"/>` : '') + `</g>`;
  }
  // ---------- Gufi ----------
  function gufi({ x, y, boy = 140, duygu = 'merak', bak = [0, 0], kirp = 0, agiz = false, acik = null, ayak = 0, golge = true, yasli = false } = {}) {
    const w = boy, h = boy, rx = boy * .28, c = id('gf'), C = yasli ? R.gufiY : R.gufi, s = boy / 140, yas = yasli ? { kapak: C.govde, golge: C.golge } : null;
    const kutu = (ox, oy, k = 1) => `<rect x="${x - w * k / 2 + ox}" y="${y - h * k + oy}" width="${w * k}" height="${h * k}" rx="${rx}"`;
    return `<g class="gufi">` +
      (golge ? `<ellipse cx="${x}" cy="${y + 4}" rx="${w * .55}" ry="${h * .07}" fill="#000" opacity=".22"/>` : '') +
      `<rect x="${x - w * .3}" y="${y - 6 - ayak * 8}" width="${w * .18}" height="${h * .12}" rx="${w * .09}" fill="${C.golge}"/><rect x="${x + w * .12}" y="${y - 6 + ayak * 8}" width="${w * .18}" height="${h * .12}" rx="${w * .09}" fill="${C.golge}"/>` +
      `<defs><clipPath id="${c}">${kutu(0, -h * .06)}/></clipPath></defs>` +
      `<g clip-path="url(#${c})">${kutu(0, -h * .06)} fill="${C.rim}"/>${kutu(-w * .07, -h * .06 + w * .07)} fill="${C.govde}"/><circle cx="${x - w * .75}" cy="${y + h * .05}" r="${w * .95}" fill="${C.golge}" opacity=".45"/></g>` +
      gozler(x, y - h * .62, s, 24 * s, bak, duygu, kirp, acik, yas) +
      (agiz && !yasli ? `<path d="M${x - 10 * s} ${y - h * .32} Q${x} ${y - h * .22} ${x + 10 * s} ${y - h * .32}" fill="${C.golge}"/>` : '') +
      (yasli ? (() => { const my = y - h * .36, dm = duygu === 'uzgun' || duygu === 'aglamakli' ? 5 * s : duygu === 'mutlu' ? -4 * s : 0; return `<path d="M${x} ${my - 4 * s} Q${x - 14 * s} ${my - 10 * s} ${x - 30 * s} ${my + dm} Q${x - 34 * s} ${my + 8 * s + dm} ${x - 22 * s} ${my + 10 * s} Q${x - 8 * s} ${my + 10 * s} ${x} ${my + 4 * s} Q${x + 8 * s} ${my + 10 * s} ${x + 22 * s} ${my + 10 * s} Q${x + 34 * s} ${my + 8 * s + dm} ${x + 30 * s} ${my + dm} Q${x + 14 * s} ${my - 10 * s} ${x} ${my - 4 * s}Z" fill="${R.sac}"/><path d="M${x - 20 * s} ${my + 4 * s} Q${x - 10 * s} ${my + 6 * s} ${x - 4 * s} ${my + 1 * s} M${x + 20 * s} ${my + 4 * s} Q${x + 10 * s} ${my + 6 * s} ${x + 4 * s} ${my + 1 * s}" stroke="${R.sacG}" stroke-width="${2 * s}" fill="none"/>`; })() : '') + `</g>`;
  }

  // ---------- canlı animasyon ----------
  const SURE = { sasir: 1.2, zipla: .6, mutlu: 1.3, aha: 1.2, korku: 1.3, selam: 1.3, uzgun: 1.6, kararli: 1.2,
    isaret: 1.5, alkis: 1.3, gozKapa: 1.5, dusun: 1.9, omuzSilk: 1.2, kahkaha: 1.4, goster: 1.4, donus: .9,
    dans: 2.0, kos: 1.4, titre: 1.3, esne: 1.7, uyu: 2.4, tokezle: 1.1, bayil: 2.0, evet: .9, hayir: .9, sinir: 1.5, utan: 1.5,
    agla: 2.0, ask: 1.8, egil: 1.3, takla: 1.0, yorgun: 1.8, saklan: 1.5, kafaKasi: 1.5, ayakTap: 1.8 };
  const IFADE = { sasir: 'saskin', zipla: null, mutlu: 'mutlu', aha: 'saskin', korku: 'korku', selam: 'mutlu', uzgun: 'uzgun', kararli: 'kararli',
    isaret: 'merak', alkis: 'mutlu', gozKapa: 'korku', dusun: 'merak', omuzSilk: 'merak', kahkaha: 'mutlu', goster: 'mutlu', donus: 'mutlu',
    dans: 'mutlu', kos: 'kararli', titre: 'korku', esne: 'uykulu', uyu: 'uyu', tokezle: 'saskin', bayil: 'uyu', evet: 'mutlu', hayir: 'kararli',
    sinir: 'sinirli', utan: 'utangac', agla: 'aglamakli', ask: 'asik', egil: 'merak', takla: 'mutlu', yorgun: 'uykulu', saklan: 'korku', kafaKasi: 'merak', ayakTap: 'sinirli' };
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
    let { t = 0, x, y, boy = kim === 'gubi' ? 160 : 140, duygu = 'merak', bakHedef = null, bak = [0, 0], tepkiler = [], seed = kim === 'gubi' ? 1 : 2, parla = .6, ust = '', yol = null, eller = kim === 'gufi', isaretHedef = null, yasli = false, baston = null, canlilik = true } = o;
    if (baston == null) baston = yasli && kim === 'gufi';  // eller yalnızca Gufi'de (Gubi elsiz)
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
    if (kim === 'gubi') { const f = yasli ? .6 : 1; dy += Math.sin(t * 1.9 * f + seed) * (yasli ? 5 : 9) * s + (yasli ? 6 * s : 0); rot += Math.sin(t * 1.3 * f + seed) * 4; }
    else { const n = Math.sin(t * (yasli ? 1.5 : 2.4) + seed); sy *= 1 + .025 * n; sx *= 1 - .015 * n; if (yasli) { sy *= .965; rot += 3; dx += Math.sin(t * 23 + seed) * .7 * s; } }
    // CANLILIK: tepki yokken kendiliğinden küçük hareketler (etrafa bakma, minik zıplama, sallanma, derin nefes) — sahne sahne aynı görünmesin
    let idleBak = null;
    if (canlilik) { const Pd = 4.6 + (seed % 3) * .7, u = t + seed * 1.93, ph = u % Pd, tip0 = Math.floor(u / Pd + seed * 1.7) % 4, aktif = !tepkiler.some(([t0, tp]) => t >= t0 - .3 && t < t0 + (SURE[tp] || 1) + .3);
      if (aktif && !(hr && hr.hiz > 0)) {
        if (tip0 === 0 && ph < 1.3) idleBak = [Math.sin(ph / 1.3 * Math.PI) * .9 * (Math.floor(u / Pd) % 2 ? 1 : -1), -.05];
        if (tip0 === 1 && ph < .5) { const j = Math.sin(ph / .5 * Math.PI); dy -= j * (yasli ? 5 : 12) * s; if (kim === 'gufi') { sy *= 1 + .05 * j; sx *= 1 - .03 * j; } }
        if (tip0 === 2 && ph < 1.4) rot += Math.sin(ph / 1.4 * Math.PI * 2) * 5;
        if (tip0 === 3 && ph < 1.0) { const j = Math.sin(ph / 1.0 * Math.PI); sy *= 1 + .05 * j; sx *= 1 + .02 * j; } } }
    // göz yönü
    const gy = kim === 'gubi' ? y : y - boy * .62, cy = kim === 'gubi' ? y : y - boy * .56;
    let v = kamera ? [0, .1] : bak; if (bakHedef) { const vx = bakHedef[0] - x, vy = bakHedef[1] - gy, L = Math.hypot(vx, vy) || 1; v = [vx / L, vy / L * .8]; }
    if (idleBak && !kamera) v = bakHedef ? [v[0] * .5 + idleBak[0] * .5, v[1]] : idleBak;
    // eller: [x, y] gövde merkezine göre (W birimi); idle konum
    // eller normalde GÖRÜNMEZ: bir hareket el gerektirdiğinde gövdenin ARKASINDAN çıkar, bitince geri saklanır
    const merkezEl = sx0 => [sx0 * .15 * W, .15 * W];
    let EL = [merkezEl(-1), merkezEl(1)], ELK = [0, 0], parmak = [null, null];
    if (baston && kim === 'gufi') { EL[1] = [1.08 * W, .42 * W]; ELK[1] = 1; }
    let ayakOzel = null;
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
      // ---------- v3 yeni hareketler ----------
      const nota = (i, q, renk = '#FFE27A') => `<text x="${x + W * (i % 2 ? 1.2 : -1.3) + Math.sin(q * 6) * 10 * s}" y="${cy - W * (.6 + q * 1.4)}" font-size="${(34 + 8 * (i % 2)) * s}" font-weight="900" opacity="${1 - q}" style="fill:${renk}">${i % 2 ? '♫' : '♪'}</text>`;
      if (tip === 'dans') { const b = d * 7.5, sg = Math.sin(b); rot += sg * 12; dx += sg * 16 * s; dy -= Math.abs(Math.cos(b)) * 16 * s; sy *= 1 + .05 * Math.abs(Math.cos(b)); ayakOzel = Math.sin(b * 2);
        elHedef([[-1.15 * W, (-.95 + .35 * sg) * W], [1.15 * W, (-.95 - .35 * sg) * W]], ke); for (let i = 0; i < 3; i++) efekt += nota(i, (d * .9 + i / 3) % 1); }
      if (tip === 'kos') { const b = d * 24; dy -= Math.abs(Math.sin(b)) * 16 * s; sy *= 1 - .05 * Math.abs(Math.cos(b)); rot += 8 * ke; ayakOzel = Math.sin(b);
        elHedef([[-.95 * W, (.15 + .4 * Math.sin(b)) * W], [.95 * W, (.15 - .4 * Math.sin(b)) * W]], ke);
        for (let i = 0; i < 3; i++) { const q = (d * 2.2 + i / 3) % 1; efekt += `<circle cx="${x - W * (1.0 + q * 1.4)}" cy="${(kim === 'gufi' ? y : y + W * .8) - 8 * s - q * 18 * s}" r="${(10 + q * 16) * s}" fill="#E8E0D0" opacity="${.7 * (1 - q)}"/>`; } }
      if (tip === 'titre') { dx += Math.sin(d * 95) * 4.5 * s; sy *= .96; elHedef([[-.42 * W, -.05 * W], [.42 * W, -.05 * W]], ke);
        for (const k of [-1, 1]) efekt += `<path d="M${x + k * W * 1.25} ${cy - W * .6} q${k * 8 * s} ${8 * s} 0 ${16 * s} q${-k * 8 * s} ${8 * s} 0 ${16 * s}" stroke="#9AD8F2" stroke-width="${4 * s}" fill="none" opacity="${.9 * (1 - p * .5)}"/>`; }
      if (tip === 'esne') { const u = Math.sin(cl(p * 1.15) * Math.PI); sy *= 1 + .13 * u; sx *= 1 - .06 * u; dy -= 10 * s * u; elHedef([[-.75 * W, -1.45 * W], [.75 * W, -1.45 * W]], ke * u);
        const my = kim === 'gufi' ? y - boy * .3 : y + W * .55; efekt += `<ellipse cx="${x}" cy="${my - dy * 0}" rx="${9 * s * u}" ry="${14 * s * u}" fill="#5A1A2A" opacity="${u}"/>`; }
      if (tip === 'uyu') { sy *= 1 + .04 * Math.sin(d * 3); rot -= 7 * ke; if (kim === 'gubi') dy += 10 * s * ke;
        for (let i = 0; i < 3; i++) { const q = (d * .55 + i / 3) % 1; efekt += `<text x="${x + W * (.9 + q * .9)}" y="${cy - W * (1.0 + q * 1.3)}" font-size="${(24 + 12 * q) * s}" font-weight="900" opacity="${(1 - q) * ke}" style="fill:#BFD8FF">z</text>`; } }
      if (tip === 'tokezle') { const a = p < .35 ? Math.sin(p / .35 * Math.PI / 2) : 1 - eio(cl((p - .35) / .5)); rot += 26 * a; dx += 26 * s * a; rot += Math.sin(d * 22) * 5 * (p > .5 ? 1 - p : 0);
        elHedef([[-1.25 * W, -.85 * W], [1.25 * W, -1.0 * W]], ke * (p < .7 ? 1 : 0)); }
      if (tip === 'bayil') { const a = eio(cl(p / .35)), geri = eio(cl((p - .82) / .18)); rot += 82 * a * (1 - geri); dy += (kim === 'gubi' ? 30 : 10) * s * a * (1 - geri); dx += 18 * s * a * (1 - geri);
        if (p > .3 && p < .85) for (let i = 0; i < 3; i++) { const an = d * 5 + i * 2.1; efekt += yildizcik(x + W * .9 + Math.cos(an) * W * .55, cy - W * .2 + Math.sin(an) * W * .2, 12 * s, '#FFE27A', .95); } }
      if (tip === 'evet') { const b = Math.sin(d * 15) * (1 - p); dy += b * 9 * s; v = [v[0] * .3, .25 + .45 * b]; }
      if (tip === 'hayir') { const b = Math.sin(d * 15) * (1 - p); rot += b * 9; dx += b * 7 * s; v = [b * .9, 0]; }
      if (tip === 'sinir') { dx += Math.sin(d * 55) * 5 * s * (1 - p * .5); sy *= .95; dy -= Math.abs(Math.sin(d * 12)) * 6 * s; glow = parla + .3; elHedef([[-1.0 * W, .5 * W], [1.0 * W, .5 * W]], ke); ayakOzel = Math.sin(d * 24) > 0 ? 1 : 0;
        for (const k of [-1, 1]) { const q = (d * 1.6 + (k > 0 ? .5 : 0)) % 1; efekt += `<circle cx="${x + k * W * (.55 + q * .3)}" cy="${cy - W * (1.15 + q * .7)}" r="${(10 + q * 14) * s}" fill="#FFFFFF" opacity="${.85 * (1 - q)}"/>`; }
        efekt += `<g transform="translate(${x + W * .95} ${cy - W * 1.0}) scale(${s})" opacity="${ke}"><path d="M-14 -4 L-4 -4 L-4 -14 M4 -14 L4 -4 L14 -4 M14 4 L4 4 L4 14 M-4 14 L-4 4 L-14 4" stroke="#E8323C" stroke-width="5" fill="none"/></g>`; }
      if (tip === 'utan') { rot += Math.sin(d * 4) * 5; dx += Math.sin(d * 4) * 4 * s; elHedef([[-.22 * W, .6 * W], [.22 * W, .6 * W]], ke); v = [.35, .55]; }
      if (tip === 'agla') { dy -= Math.abs(Math.sin(d * 10)) * 4 * s; elHedef([[-.9 * W, .6 * W], [.9 * W, .6 * W]], ke); v = [0, .6];
        const ex = kim === 'gubi' ? 20 * s : 24 * s, ey = gy + 14 * s;
        for (const k of [-1, 1]) { efekt += `<path d="M${x + k * ex} ${ey} Q${x + k * (ex + 6 * s)} ${ey + 40 * s} ${x + k * (ex + 2 * s)} ${ey + 70 * s}" stroke="#7AD0F2" stroke-width="${6 * s}" fill="none" opacity="${.85 * ke}" stroke-linecap="round"/>`;
          for (let i = 0; i < 2; i++) { const q = (d * 1.8 + i * .5 + (k > 0 ? .25 : 0)) % 1; efekt += `<ellipse cx="${x + k * (ex + 10 * s + q * 18 * s)}" cy="${ey + 70 * s + q * 60 * s}" rx="${5 * s}" ry="${7 * s}" fill="#7AD0F2" opacity="${1 - q}"/>`; } } }
      if (tip === 'ask') { rot += Math.sin(d * 5) * 4; glow = parla + .4; dy -= Math.abs(Math.sin(d * 6)) * 6 * s; elHedef([[-.35 * W, .1 * W], [.35 * W, .1 * W]], ke);
        for (let i = 0; i < 4; i++) { const q = (d * .8 + i / 4) % 1, hx = x + W * (-.9 + i * .6) + Math.sin(q * 7 + i) * 10 * s, hy = cy - W * (.8 + q * 1.4); efekt += `<path transform="translate(${hx} ${hy}) scale(${s * (1 + .4 * (i % 2))})" d="M0 9 C-14 -1 -11 -11 -5 -11 C-2 -11 0 -9 0 -7 C0 -9 2 -11 5 -11 C11 -11 14 -1 0 9Z" fill="#FF5A86" opacity="${1 - q}"/>`; } }
      if (tip === 'egil') { const u = Math.sin(cl(p * 1.1) * Math.PI); rot += 24 * u; dy += 6 * s * u; elHedef([null, [.15 * W, .15 * W]], ke); v = [.4, .7 * u]; }
      if (tip === 'takla') { const q = cl((p - .1) / .8); rot -= 360 * eio(q); dy -= Math.sin(cl(p) * Math.PI) * 120 * s; if (p < .12 || p > .9) { sy *= .86; sx *= 1.1; } elHedef([[-.6 * W, -.4 * W], [.6 * W, -.4 * W]], ke * Math.sin(q * Math.PI)); }
      if (tip === 'yorgun') { sy *= .92 + .025 * Math.sin(d * 16); dy += 6 * s; rot -= 4; elHedef([[-.95 * W, .85 * W], [.95 * W, .85 * W]], ke);
        for (let i = 0; i < 2; i++) { const q = (d * 1.2 + i * .5) % 1; efekt += `<ellipse cx="${x + W * (.85 + i * .2)}" cy="${gy - W * .4 + q * 50 * s}" rx="${6 * s}" ry="${9 * s}" fill="#7AD0F2" opacity="${1 - q}"/>`; } }
      if (tip === 'saklan') { const u = ke; sy *= 1 - .32 * u; sx *= 1 + .12 * u; if (kim === 'gubi') dy += boy * .18 * u; v = [Math.sin(d * 3) * .8, -.2]; elHedef([[-.6 * W, -.2 * W], [.6 * W, -.2 * W]], u); }
      if (tip === 'kafaKasi') { elHedef([null, [(.45 + .07 * Math.sin(d * 26)) * W, -1.28 * W]], ke); v = [.4, -.6]; rot -= 4 * ke;
        const q = (d * .9) % 1; efekt += `<text x="${x - W * 1.2}" y="${cy - W * (1.1 + q * .5)}" font-size="${40 * s}" font-weight="900" opacity="${(1 - q) * ke}" style="fill:#FFE27A">?</text>`; }
      if (tip === 'ayakTap') { elHedef([[.35 * W, .2 * W], [-.35 * W, .25 * W]], ke); ayakOzel = Math.max(0, Math.sin(d * 14)); rot += 3 * ke; if (kim === 'gubi') dy -= Math.max(0, Math.sin(d * 14)) * 6 * s; }
    }
    const acik = ifade === 'mutlu' ? 1 : (gubiGozKapa > .5 ? 0 : acikGoz(t, seed));
    const ayak = ayakOzel != null ? ayakOzel : kim === 'gufi' && ((ak && (ak.tip === 'zipla' || ak.tip === 'mutlu')) || (hr && hr.hiz > 0)) ? Math.sin((ak ? ak.d : t) * 20) : 0;
    const govde = kim === 'gubi' ? gubi({ x, y, boy, duygu: ifade, bak: v, parla: glow * (yasli ? .7 : 1), acik, agiz: ifade === 'mutlu', yasli }) : gufi({ x, y, boy, duygu: ifade, bak: v, acik, ayak, golge: false, agiz: ifade === 'mutlu', yasli });
    // eller (yüzen yuvarlak eldivenler, kontur yok; rim light)
    let el = '';
    if (eller) { const C = yasli ? R[kim + 'Y'] : R[kim], er0 = boy * (kim === 'gubi' ? .12 : .14);
      if (baston && kim === 'gufi') { const hx = x + EL[1][0], hy = cy + EL[1][1], er = er0, yer = y + 2; el += `<path d="M${hx + er * .1} ${hy} L${hx + er * .35} ${Math.max(yer, hy + er)}" stroke="#6A4428" stroke-width="${er * .42}" stroke-linecap="round"/><path d="M${hx - er * .9} ${hy - er * .2} Q${hx - er * .9} ${hy - er * 1.3} ${hx} ${hy - er * 1.2} Q${hx + er * .2} ${hy - er * .6} ${hx + er * .1} ${hy}" stroke="#6A4428" stroke-width="${er * .42}" fill="none" stroke-linecap="round"/><path d="M${hx + er * .1} ${hy + er * .3} L${hx + er * .3} ${Math.max(yer, hy + er)}" stroke="#8A6040" stroke-width="${er * .14}" stroke-linecap="round"/>`; }
      EL.forEach(([ex, ey], i) => { const k = ELK[i]; if (k <= .02) return; const er = er0 * (.35 + .65 * Math.min(1, k * 1.3)), hx = x + ex, hy = cy + ey;
        if (parmak[i] && k > .6) { const [ux, uy] = parmak[i]; el += `<ellipse cx="${hx + ux * er * 1.1}" cy="${hy + uy * er * 1.1}" rx="${er * .55}" ry="${er * .32}" transform="rotate(${Math.atan2(uy, ux) * 57.3} ${hx + ux * er * 1.1} ${hy + uy * er * 1.1})" fill="${C.govde}"/>`; }
        el += `<circle cx="${hx + er * .08}" cy="${hy + er * .1}" r="${er}" fill="${C.golge}"/><circle cx="${hx}" cy="${hy}" r="${er}" fill="${C.govde}"/><circle cx="${hx + er * .35}" cy="${hy - er * .35}" r="${er * .32}" fill="${C.rim}" opacity=".8"/>`; }); }
    const ustS = typeof ust === 'function' ? ust(x, y, boy, ifade, t) : ust; // kostüm: KO.giy(...) fonksiyonu konuma göre çizilir
    const onde = false; // eller hep gövdenin arkasından çıkar
    const px = x, py = y;
    const yer = kim === 'gufi' ? (() => { const k = 1 / (1 - dy / (boy * 1.2)); return `<ellipse cx="${x + dx}" cy="${y + 4}" rx="${boy * .55 * k}" ry="${boy * .07 * k}" fill="#000" opacity="${.22 * k}"/>`; })() : '';
    return iz + yer + `<g transform="translate(${dx} ${dy}) translate(${px} ${py}) rotate(${rot}) scale(${sx} ${sy}) translate(${-px} ${-py})">${onde ? govde + ustS + el : el + govde + ustS}</g><g transform="translate(${dx} ${dy})">${efekt}</g>`;
  }
  return { gubi, gufi, canli, hareket, yakinlas, bulanik, bulanikSar, balon, renk: R, SURE };
})();
