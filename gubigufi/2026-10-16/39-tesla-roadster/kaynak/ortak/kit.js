/* Ortak çizim kiti — her sahne: <script src="../ortak/kit.js"></script>
   Tüm fonksiyonlar SVG metni (string) döndürür; sahnede bir <g> içine innerHTML ile basılır.
   Rastgelelik tohumludur (seed) → her render aynı sonucu verir.            */
const K = (() => {
  let uid = 0; const id = p => `${p}${++uid}`;
  const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || v;
  const r = v => (typeof v === 'string' && v.startsWith('--')) ? css(v) : v;

  /* Gök: dikey gradyan + opsiyonel nebula lekesi */
  function gok({ ust='--zemin1', alt='--zemin2', nebula=null } = {}) {
    const g = id('gok'), n = id('neb');
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${r(ust)}"/><stop offset="1" stop-color="${r(alt)}"/></linearGradient>`;
    if (nebula) s += `<radialGradient id="${n}"><stop offset="0" stop-color="${r(nebula.renk)}" stop-opacity=".22"/><stop offset="1" stop-color="${r(nebula.renk)}" stop-opacity="0"/></radialGradient>`;
    s += `</defs><rect width="1920" height="1080" fill="url(#${g})"/>`;
    if (nebula) s += `<circle cx="${nebula.x}" cy="${nebula.y}" r="${nebula.r || 500}" fill="url(#${n})"/>`;
    return s;
  }

  /* Yıldız alanı: üç boy, titreşim fazları dağıtılmış, birkaçı glow'lu */
  function yildizlar({ adet=40, seed=7, renk='--isik', alan=[0,0,1920,1080] } = {}) {
    const R = rnd(seed); let s = `<g fill="${r(renk)}">`;
    for (let i = 0; i < adet; i++) {
      const x = alan[0] + R()*alan[2], y = alan[1] + R()*alan[3], b = R();
      const rr = b < .7 ? 1.2 + R() : b < .95 ? 2 + R() : 3.2;
      s += `<circle class="twinkle" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(1)}" style="animation-delay:-${(R()*3).toFixed(2)}s"/>`;
      if (b >= .95) s += `<circle class="pulse" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="14" opacity=".15"/>`;
    }
    return s + `</g>`;
  }

  /* Glow: radyal gradyan dairesi (nesnenin arkasına) */
  function glow({ x, y, r: rr, renk='--v3', guc=.8 }) {
    const g = id('glow');
    return `<defs><radialGradient id="${g}"><stop offset="0" stop-color="${r(renk)}" stop-opacity="${guc}"/><stop offset=".35" stop-color="${r(renk)}" stop-opacity="${guc*.4}"/><stop offset="1" stop-color="${r(renk)}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${rr}" fill="url(#${g})"/>`;
  }

  /* Işıklı küre: rim light + gövde gölgesi + opsiyonel atmosfer. isikYon: [dx,dy] ışığın geldiği yön */
  function kure({ x, y, r: rr, renk, rim='--rim', golge='--golge', isikYon=[1,-1], atmosfer=null, ic='' }) {
    const c = id('kes'), a = id('atm'); const [dx, dy] = isikYon;
    const k = rr * .05, g = rr * .8;
    let s = `<defs><clipPath id="${c}"><circle cx="${x}" cy="${y}" r="${rr}"/></clipPath>`;
    if (atmosfer) s += `<radialGradient id="${a}"><stop offset=".78" stop-color="${r(atmosfer)}" stop-opacity="0"/><stop offset=".86" stop-color="${r(atmosfer)}" stop-opacity=".35"/><stop offset="1" stop-color="${r(atmosfer)}" stop-opacity="0"/></radialGradient>`;
    s += `</defs>`;
    if (atmosfer) s += `<circle cx="${x}" cy="${y}" r="${rr*1.16}" fill="url(#${a})"/>`;
    s += `<g clip-path="url(#${c})"><circle cx="${x}" cy="${y}" r="${rr}" fill="${r(rim)}"/>` +
         `<circle cx="${x-dx*k}" cy="${y-dy*k}" r="${rr}" fill="${r(renk)}"/>${ic}` +
         `<circle cx="${x-dx*g}" cy="${y-dy*g}" r="${rr*1.1}" fill="${r(golge)}" opacity=".5"/></g>`;
    return s;
  }

  /* Göz: duygu = 'merak' | 'saskin' | 'mutlu' | 'uzgun' | 'kararli' | 'korku' */
  function goz({ x, y, olcek=1, bak=[0,0], duygu='merak' }) {
    const rx = 14*olcek, ry = (duygu==='saskin'||duygu==='korku' ? 20 : 18)*olcek;
    const pr = (duygu==='saskin'||duygu==='korku' ? 5.5 : 8)*olcek;
    let s = `<g class="goz"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FFFFFF"/>` +
            `<circle cx="${x+bak[0]*5*olcek}" cy="${y+bak[1]*5*olcek+2*olcek}" r="${pr}" fill="#1B1640"/>` +
            `<circle cx="${x+bak[0]*5*olcek+3*olcek}" cy="${y+bak[1]*5*olcek-2*olcek}" r="${2.4*olcek}" fill="#FFFFFF"/>`;
    if (duygu==='mutlu') s += `<rect x="${x-rx-2}" y="${y+2*olcek}" width="${2*rx+4}" height="${ry+4}" fill="currentColor"/>`;
    if (duygu==='uzgun'||duygu==='kararli') s += `<rect x="${x-rx-2}" y="${y-ry-4}" width="${2*rx+4}" height="${ry*.8}" fill="currentColor"/>`;
    return s + `</g>`;
  }

  /* Basit yaratık (kapsül gövde + iki göz + rim light). Kalabalık/örnek karakter içindir;
     kanal maskotu için karakterler.md'deki maskot kartına göre ayrı fonksiyon yaz. */
  function yaratik({ x, y, boy=120, renk='--v2', duygu='merak', bak=[0,0], sinif='nefes', kirpGecikme=0 }) {
    const w = boy*.75, h = boy, c = id('yk'), gz = boy/110, k = w*.06, g = w*.55;
    const govde = (ox, oy) => `<rect x="${x-w/2+ox}" y="${y-h+oy}" width="${w}" height="${h}" rx="${w/2}"`;
    return `<g class="${sinif}" style="color:${r(renk)}">` +
      `<ellipse cx="${x}" cy="${y}" rx="${w*.6}" ry="${h*.06}" fill="#000" opacity=".25"/>` +
      `<defs><clipPath id="${c}">${govde(0,0)}/></clipPath></defs>` +
      `<g clip-path="url(#${c})">${govde(0,0)} fill="${r('--rim')}"/>${govde(-k,k)} fill="${r(renk)}"/>${govde(-g,g)} fill="${r('--golge')}" opacity=".45"/></g>` +
      `<g class="kirp" style="animation-delay:${kirpGecikme}s">` +
      goz({ x: x-w*.2, y: y-h*.68, olcek: gz, bak, duygu }) + goz({ x: x+w*.2, y: y-h*.68, olcek: gz, bak, duygu }) +
      `</g></g>`;
  }

  /* Etiket: nesneye ince çizgiyle bağlı, yuvarlak köşeli */
  function etiket({ x, y, hedef, yazi, renk='--isik', boyut=34 }) {
    const w = yazi.length * boyut * .62 + 40, h = boyut + 26;
    let s = '';
    if (hedef) s += `<line x1="${x}" y1="${y}" x2="${hedef[0]}" y2="${hedef[1]}" stroke="${r(renk)}" stroke-width="3" stroke-linecap="round" opacity=".7"/><circle cx="${hedef[0]}" cy="${hedef[1]}" r="6" fill="${r(renk)}"/>`;
    s += `<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${h/2}" fill="${r('--zemin2')}" opacity=".85"/>` +
         `<text x="${x}" y="${y+boyut*.35}" font-size="${boyut}" text-anchor="middle" style="fill:${r(renk)}">${yazi}</text>`;
    return s;
  }

  /* Zaman yardımcıları (renderAt içinde) */
  const ease = x => x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
  const aralik = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const sayi = n => Math.round(n).toLocaleString('tr-TR');

  /* Önizleme: sahneyi tarayıcıda doğrudan açınca gerçek zamanlı oynat (render sırasında çalışmaz) */
  function onizleme() {
    if (navigator.webdriver || typeof window.renderAt !== 'function') return;
    const t0 = performance.now();
    (function d() { window.renderAt((performance.now() - t0) / 1000); requestAnimationFrame(d); })();
  }
  // yazı genişliğini GERÇEKTEN ölç (SVG getComputedTextLength) — arkasında şekil olan her yazı buna göre boyutlanır
  let _olc = null;
  function yaziGen(s, fs, { mono = false, agirlik = 900, ls = 0 } = {}) {
    try { if (!_olc) { const svg = document.querySelector('svg'); _olc = document.createElementNS('http://www.w3.org/2000/svg', 'text'); _olc.setAttribute('x', '-9999'); _olc.setAttribute('y', '-9999'); svg.appendChild(_olc); }
      _olc.setAttribute('class', mono ? 'mono' : ''); _olc.setAttribute('font-size', fs); _olc.setAttribute('font-weight', agirlik); _olc.setAttribute('letter-spacing', ls); _olc.textContent = s;
      const w = _olc.getComputedTextLength(); if (w > 0) return w; } catch (e) {}
    return s.length * fs * (mono ? .62 : .6) + s.length * ls;
  }
  return { gok, yildizlar, glow, kure, goz, yaratik, etiket, ease, aralik, sayi, onizleme, rnd, yaziGen };
})();
