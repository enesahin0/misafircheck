/* gubigufi ÇEVRE — referans tarz (marka/referans/stil_ref_*.png):
   1) TEK RENK AİLESİ: her sahne bir ana tonla boyanır (teal mutfak, sarı salon, yeşil orman, mavi-mor gece…); 1–2 tamamlayıcı vurgu (kırmızı/pembe/turuncu).
   2) DOLU, YAŞANMIŞ MEKÂN: raflar, vazolar, kitaplar, lamba, bitki, poster, tencere, pencere-perde… sahne boş durmaz.
   3) DERİNLİK: önde koyu-doygun yaprak/çalı silüetleri çerçeveler, orta planda aksiyon, arkada açık ve ışıklı fon (ışık hüzmesi/pus).
   4) ORGANİK FORMLAR: yuvarlak, hafif dalgalı; ot tutamları, küçük çiçekler, kabarık bulutlar. Kontur yok.
   Kullanım: const T = CV.ton('teal');  CV.oda(T) + CV.raf(...) + CV.bitki(...) + CV.onYaprak(T, 'alt') ...
   Tonlar: teal, sari, orman, gece, gunes (sahil), gul, lavanta, kum. Her ton: fon1 fon2 (açık), orta, koyu, cokKoyu, vurgu, vurgu2, isik. */
const CV = (() => {
  let n = 0; const id = p => `cv${p}${++n}`;
  const TON = {
    teal:    { fon1: '#5FC7C0', fon2: '#3FAFAE', orta: '#2E9A9C', koyu: '#1F7A80', cokKoyu: '#155A63', acik: '#9DE2D8', vurgu: '#E8505B', vurgu2: '#FFB44C', isik: '#D8F7EE', ten: '#F7B8A4' },
    sari:    { fon1: '#FFE45C', fon2: '#FFD23F', orta: '#FFB938', koyu: '#F08A24', cokKoyu: '#C85A1A', acik: '#FFF3A6', vurgu: '#E8505B', vurgu2: '#2E9A9C', isik: '#FFFBE0', ten: '#F7B39A' },
    orman:   { fon1: '#E6F37A', fon2: '#A9DB5A', orta: '#3FA35A', koyu: '#1F6B4E', cokKoyu: '#123E3A', acik: '#F4FAB0', vurgu: '#E8505B', vurgu2: '#9C6BD8', isik: '#FFFBD0', ten: '#F7B39A' },
    gece:    { fon1: '#5B6BF0', fon2: '#3E48C8', orta: '#2E36A8', koyu: '#22287F', cokKoyu: '#171B5A', acik: '#8FA2FF', vurgu: '#FF5FA8', vurgu2: '#FFB44C', isik: '#C9D2FF', ten: '#F58FC8' },
    gunes:   { fon1: '#9FE8F5', fon2: '#4FD0E8', orta: '#28B8D0', koyu: '#F6C860', cokKoyu: '#E08A3A', acik: '#E8FBFF', vurgu: '#E8505B', vurgu2: '#8E6BE8', isik: '#FFFFFF', ten: '#F7B39A' },
    gul:     { fon1: '#FFB7C9', fon2: '#F98FAE', orta: '#E86A93', koyu: '#B84A78', cokKoyu: '#7E2E5A', acik: '#FFDDE6', vurgu: '#2E9A9C', vurgu2: '#FFD23F', isik: '#FFF0F4', ten: '#F7B39A' },
    lavanta: { fon1: '#C8B4FF', fon2: '#A992F2', orta: '#8A6FE0', koyu: '#6A4FC0', cokKoyu: '#4A348E', acik: '#E6DCFF', vurgu: '#FFB44C', vurgu2: '#E8505B', isik: '#F4F0FF', ten: '#F5A0C8' },
    kum:     { fon1: '#FFE0B0', fon2: '#FBC98A', orta: '#F0A860', koyu: '#C97A3A', cokKoyu: '#8E5226', acik: '#FFF1D8', vurgu: '#2E9A9C', vurgu2: '#E8505B', isik: '#FFF8EC', ten: '#F7B39A' },
  };
  const ton = ad => TON[ad] || TON.teal;
  const dikdortgen = (x, y, w, h, r, f, op = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" opacity="${op}"/>`;
  // oda: duvar (dikey hafif şeritler) + zemin + üst dolaplar; isikYon: sağ üstten açık hüzme
  function oda(T, { zeminY = 1180, dolap = true, pencere = [720, 380, 280, 360] } = {}) {
    const g = id('od'); let o = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.fon1}"/><stop offset="1" stop-color="${T.fon2}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${g})"/>`;
    if (dolap) for (let i = 0; i < 4; i++) o += dikdortgen(40 + i * 250, 60, 230, 300, 18, T.orta, .55) + dikdortgen(52 + i * 250, 72, 206, 276, 12, T.fon2, .8) + dikdortgen(150 + i * 250, 200, 14, 40, 7, T.koyu, .6);
    if (pencere) { const [x, y, w, h] = pencere; o += dikdortgen(x - 20, y - 20, w + 40, h + 40, 20, T.koyu, .35) + dikdortgen(x, y, w, h, 12, T.isik) + dikdortgen(x + w / 2 - 7, y, 14, h, 0, T.acik) + dikdortgen(x, y + h / 2 - 7, w, 14, 0, T.acik);
      o += `<path d="M${x - 40} ${y - 30} Q${x + 10} ${y + h * .5} ${x - 20} ${y + h + 40} L${x - 70} ${y + h + 40} Q${x - 50} ${y + h * .5} ${x - 90} ${y - 30}Z" fill="${T.orta}"/><path d="M${x + w + 40} ${y - 30} Q${x + w - 10} ${y + h * .5} ${x + w + 20} ${y + h + 40} L${x + w + 70} ${y + h + 40} Q${x + w + 50} ${y + h * .5} ${x + w + 90} ${y - 30}Z" fill="${T.orta}"/>`;
      o += `<path d="M${x} ${y} L${x + w} ${y} L${x + w - 520} ${zeminY + 400} L${x - 700} ${zeminY + 400}Z" fill="${T.isik}" opacity=".12"/>`; }
    o += dikdortgen(0, zeminY, 1080, 1920 - zeminY, 0, T.orta) + dikdortgen(0, zeminY, 1080, 18, 0, T.koyu, .5);
    for (let i = 0; i < 6; i++) o += dikdortgen(i * 200 - 40, zeminY + 90 + (i % 2) * 120, 140, 10, 5, T.koyu, .25);
    return o;
  }
  // raf + kitaplar + vazolar
  function raf(x, y, w, T, seed = 1) {
    const R = K.rnd(seed); let o = dikdortgen(x, y, w, 20, 8, T.koyu) + dikdortgen(x + 10, y + 20, w - 20, 10, 4, T.cokKoyu, .35);
    let cx = x + 20;
    while (cx < x + w - 60) { const tip = R(); if (tip < .5) { const k = 2 + Math.floor(R() * 3); for (let i = 0; i < k; i++) { const h = 90 + R() * 50, bw = 22 + R() * 10; o += dikdortgen(cx, y - h, bw, h, 5, [T.koyu, T.orta, T.vurgu2, T.cokKoyu][Math.floor(R() * 4)]); cx += bw + 3; } cx += 18; }
      else { const h = 70 + R() * 60, r = 24 + R() * 14, renk = [T.vurgu, T.koyu, T.orta][Math.floor(R() * 3)]; o += `<path d="M${cx + r - 10} ${y - h} L${cx + r + 10} ${y - h} L${cx + r + 8} ${y - h * .65} Q${cx + 2 * r + 4} ${y - h * .5} ${cx + 2 * r} ${y - 6} Q${cx + r} ${y + 2} ${cx} ${y - 6} Q${cx - 4} ${y - h * .5} ${cx + r - 8} ${y - h * .65}Z" fill="${renk}"/>`; cx += 2 * r + 24; } }
    return o;
  }
  // saksı bitkisi (büyük yapraklı)
  function bitki(x, y, s, T, renk = null) { // y = saksı tabanı
    const L = renk || T.orta; let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
    const yap = [[-70, -260, -40], [60, -280, 30], [-20, -320, -5], [90, -200, 55], [-100, -180, -65], [20, -240, 12]];
    for (const [dx, dy, r] of yap) o += `<path d="M0 -90 Q${dx * .3} ${dy * .5} ${dx} ${dy} Q${dx * .8 + 30} ${dy * .7} ${dx * .2} -100Z" fill="${r % 2 ? '#3FA35A' : '#2E8A4E'}" transform="rotate(${r * .1} 0 -90)"/>`;
    o += `<path d="M-60 -100 L60 -100 L45 0 L-45 0Z" fill="${T.vurgu2}"/><rect x="-66" y="-112" width="132" height="22" rx="10" fill="${T.vurgu2}"/><rect x="-66" y="-112" width="132" height="8" rx="4" fill="#FFFFFF" opacity=".25"/></g>`;
    return o;
  }
  function lamba(x, y, s, T) { // ayaklı yay lamba, y = taban
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L0 -520 Q0 -600 90 -600 L260 -600" stroke="${T.cokKoyu}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<path d="M160 -600 Q260 -700 360 -600Z" fill="${T.vurgu}"/><ellipse cx="260" cy="-598" rx="100" ry="10" fill="${T.isik}"/><path d="M180 -598 L340 -598 L420 -300 L100 -300Z" fill="${T.isik}" opacity=".12"/><ellipse cx="0" cy="0" rx="70" ry="14" fill="${T.vurgu}"/></g>`;
  }
  function tencere(x, y, s, T) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-110" width="180" height="110" rx="18" fill="${T.koyu}"/><rect x="-100" y="-122" width="200" height="22" rx="11" fill="${T.cokKoyu}"/><rect x="-20" y="-142" width="40" height="20" rx="10" fill="${T.cokKoyu}"/><rect x="90" y="-90" width="40" height="16" rx="8" fill="${T.cokKoyu}"/><rect x="-130" y="-90" width="40" height="16" rx="8" fill="${T.cokKoyu}"/><rect x="-70" y="-100" width="30" height="80" rx="12" fill="#FFFFFF" opacity=".15"/></g>`; }
  function poster(x, y, w, h, T, rot = 6, ic = '') { return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">` + dikdortgen(x, y, w, h, 8, T.acik) + dikdortgen(x + 16, y + 16, w - 32, h - 32, 4, T.koyu, .25) + ic + `</g>`; }
  // ön plan yaprakları / çalılar: koyu, doygun; kenarları çerçeveler
  function onYaprak(T, taraf = 'alt', seed = 3) {
    const R = K.rnd(seed); let o = '';
    const yaprak = (x, y, s, r, renk) => `<path d="M0 0 Q${40 * s} ${-60 * s} 0 ${-150 * s} Q${-40 * s} ${-60 * s} 0 0Z" fill="${renk}" transform="translate(${x} ${y}) rotate(${r})"/>`;
    if (taraf === 'alt') for (let i = 0; i < 26; i++) { const x = R() * 1100 - 10, y = 1920 - R() * 140; o += yaprak(x, y + 60, 1 + R() * 1.3, -60 + R() * 120, R() < .5 ? T.cokKoyu : T.koyu); }
    if (taraf === 'sol' || taraf === 'yan') for (let i = 0; i < 14; i++) { const y = 200 + R() * 1500; o += yaprak(-20, y, 1.2 + R() * 1.4, 40 + R() * 70, R() < .5 ? T.cokKoyu : T.koyu); }
    if (taraf === 'sag' || taraf === 'yan') for (let i = 0; i < 14; i++) { const y = 200 + R() * 1500; o += yaprak(1100, y, 1.2 + R() * 1.4, -40 - R() * 70, R() < .5 ? T.cokKoyu : T.koyu); }
    if (taraf === 'ust') for (let i = 0; i < 22; i++) { const x = R() * 1100; o += yaprak(x, -30, 1.2 + R() * 1.4, 180 + (-40 + R() * 80), R() < .5 ? T.cokKoyu : T.koyu); }
    return o;
  }
  function otTutami(x, y, s, renk) { let o = ''; for (let i = -2; i <= 2; i++) o += `<path d="M${x + i * 10 * s} ${y} Q${x + i * 22 * s} ${y - 40 * s} ${x + i * 26 * s} ${y - (60 - Math.abs(i) * 10) * s} Q${x + i * 12 * s} ${y - 30 * s} ${x + i * 10 * s + 8 * s} ${y}Z" fill="${renk}"/>`; return o; }
  function cicek(x, y, s, renk, orta = '#FFE45C') { let o = ''; for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; o += `<circle cx="${x + Math.cos(a) * 9 * s}" cy="${y + Math.sin(a) * 9 * s}" r="${7 * s}" fill="${renk}"/>`; } return o + `<circle cx="${x}" cy="${y}" r="${5 * s}" fill="${orta}"/>`; }
  function bulut(x, y, s, renk = '#FFFFFF', golge = '#D8F3FF') {
    return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-90" cy="10" r="60" fill="${golge}"/><circle cx="0" cy="-30" r="90" fill="${golge}"/><circle cx="100" cy="0" r="70" fill="${golge}"/><rect x="-150" y="0" width="320" height="70" rx="35" fill="${golge}"/>` +
      `<circle cx="-95" cy="0" r="58" fill="${renk}"/><circle cx="-5" cy="-40" r="86" fill="${renk}"/><circle cx="95" cy="-8" r="66" fill="${renk}"/><rect x="-150" y="-10" width="310" height="60" rx="30" fill="${renk}"/></g>`;
  }
  function palmiye(x, y, s, T) { // y = taban
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-18 0 Q-10 -250 40 -480 L66 -476 Q16 -250 18 0Z" fill="#C97A3A"/><path d="M-4 0 Q2 -250 50 -478 L60 -477 Q12 -250 10 0Z" fill="#E09A50"/>`;
    for (const [r, l] of [[-150, 1], [-110, 1.1], [-60, 1], [-20, 1.05], [20, .95], [60, .9]]) o += `<g transform="translate(53 -480) rotate(${r})"><path d="M0 0 Q${110 * l} -40 ${230 * l} 30 Q${120 * l} -10 0 20Z" fill="#2E9A4E"/><path d="M0 4 Q${110 * l} -24 ${225 * l} 30 Q${120 * l} 0 0 18Z" fill="#46B85C"/></g>`;
    return o + `<circle cx="45" cy="-470" r="22" fill="#8A4A2A"/><circle cx="68" cy="-462" r="18" fill="#A55A34"/></g>`;
  }
  function agacGovde(x, y, w, h, T) { return dikdortgen(x - w / 2, y - h, w, h, w / 2, T.cokKoyu) + dikdortgen(x - w / 2 + w * .15, y - h, w * .25, h, w / 4, T.koyu, .6); }
  function kaya(x, y, s, T) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 0 Q-120 -70 -50 -90 Q20 -110 90 -70 Q130 -30 110 0Z" fill="${T.vurgu2}"/><path d="M-60 -80 Q10 -104 70 -70 Q20 -80 -40 -60Z" fill="#FFFFFF" opacity=".3"/></g>`; }
  // ışık hüzmeleri (orman/pencere): açık, yumuşak
  function huzme(x, y, T, adet = 4, aci = 18) { let o = ''; for (let i = 0; i < adet; i++) { const x0 = x + i * 120; o += `<path d="M${x0} ${y} L${x0 + 70} ${y} L${x0 + 70 + 700 * Math.tan(aci * Math.PI / 180)} 1920 L${x0 + 700 * Math.tan(aci * Math.PI / 180) - 60} 1920Z" fill="${T.isik}" opacity=".13"/>`; } return o; }
  return { TON, ton, oda, raf, bitki, lamba, tencere, poster, onYaprak, otTutami, cicek, bulut, palmiye, agacGovde, kaya, huzme };
})();
