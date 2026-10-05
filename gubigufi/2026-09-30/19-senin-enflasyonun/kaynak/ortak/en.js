/* #19 Senin enflasyonun kaç — sepet, harcama pastası, termometre, odalar (EN) + detay planlar (END). */
const EN = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const cipO = (s, x, y, renk, yazi, fs = 30) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  const IK = {
    gida: `<ellipse cx="0" cy="10" rx="60" ry="40" fill="#C8894A"/><ellipse cx="-4" cy="2" rx="54" ry="32" fill="#E0A868"/><circle cx="40" cy="-30" r="26" fill="#E8323C"/><path d="M34 -56 l6 10 l8 -8" stroke="#3FA35A" stroke-width="6" fill="none"/>`,
    kira: `<circle cx="-30" cy="0" r="34" fill="none" stroke="#F2B82A" stroke-width="16"/><rect x="0" y="-8" width="80" height="16" rx="6" fill="#F2B82A"/><rect x="50" y="8" width="12" height="20" fill="#F2B82A"/><rect x="68" y="8" width="12" height="14" fill="#F2B82A"/>`,
    ulasim: `<rect x="-60" y="-38" width="120" height="76" rx="14" fill="#2E9AD8"/><rect x="-46" y="-24" width="40" height="28" rx="6" fill="#FFE45C"/><rect x="6" y="12" width="40" height="8" rx="4" fill="#FFFFFF" opacity=".7"/>`,
    giyim: `<path d="M-30 -50 L-70 -30 L-56 0 L-40 -8 L-40 50 L40 50 L40 -8 L56 0 L70 -30 L30 -50 Q0 -30 -30 -50Z" fill="#8A6FE0"/>`,
    saglik: `<rect x="-50" y="-40" width="100" height="80" rx="12" fill="#FFFFFF"/><rect x="-50" y="-40" width="100" height="22" rx="12" fill="#2E9AD8"/><rect x="-10" y="-14" width="20" height="44" rx="4" fill="#E8323C"/><rect x="-22" y="-2" width="44" height="20" rx="4" fill="#E8323C"/>`,
    fatura: `<rect x="-44" y="-56" width="88" height="112" rx="8" fill="#FFFDF6"/>` + [0, 1, 2, 3].map(i => `<rect x="-30" y="${-38 + i * 20}" width="${50 - i * 6}" height="8" rx="4" fill="#9AA0B0"/>`).join('') + `<path d="M22 20 l-10 18 h10 l-8 16" stroke="#FFB44C" stroke-width="7" fill="none"/>`,
  };
  const ikon = (ad, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${IK[ad]}</g>`;
  function sepet(x, y, s, icler = []) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-220 -120 Q-220 -330 0 -330 Q220 -330 220 -120" stroke="#3A3F5C" stroke-width="22" fill="none"/>`;
    icler.forEach(([ad, dx, dy, k]) => o += ikon(ad, dx, dy, k));
    o += `<path d="M-260 -140 L260 -140 L220 120 L-220 120Z" fill="#E8505B"/><path d="M-260 -140 L260 -140 L254 -100 L-254 -100Z" fill="#C8323C"/>`;
    for (let i = 0; i < 8; i++) o += `<path d="M${-210 + i * 60} -90 L${-190 + i * 54} 110" stroke="#C8323C" stroke-width="10"/>`;
    return o + `<path d="M-240 -10 H240" stroke="#C8323C" stroke-width="10"/></g>`; }
  function salon(T) { let o = CV.oda(T, { zeminY: 1250, pencere: [740, 300, 240, 300] }) + CV.cerceveResim(120, 420, 200, 150, T) + CV.bitki(1000, 1250, .8, T);
    o += R(260, 560, 560, 360, 26, '#2A2440') + R(280, 580, 520, 320, 16, '#3A6A9A') + R(480, 920, 120, 60, 10, '#2A2440') + R(400, 970, 280, 20, 10, '#2A2440');
    o += R(120, 1320, 840, 170, 50, '#8A6FE0') + R(150, 1230, 780, 130, 44, '#A28AF0') + R(100, 1260, 80, 230, 30, '#6A4FC0') + R(900, 1260, 80, 230, 30, '#6A4FC0');
    return o; }
  function tvHaber(t) { let o = `<g><clipPath id="tvh"><rect x="280" y="580" width="520" height="320" rx="16"/></clipPath><g clip-path="url(#tvh)">` + R(280, 580, 520, 320, 0, '#2E5A8C') + `<circle cx="540" cy="700" r="60" fill="#F2C6A0"/>` + R(470, 760, 140, 140, 40, '#1B1F3A') + R(280, 820, 520, 80, 0, '#E8323C');
    const s = 'SON DAKİKA · EYLÜL ENFLASYONU AÇIKLANDI · YILLIK %29,73 · AYLIK %1,84 · '; o += R(300, 600, 230, 92, 12, '#FFFFFF') + `<text class="mono" x="415" y="632" font-size="22" text-anchor="middle" style="fill:#1B1640">TÜFE · YILLIK</text><text x="415" y="680" font-size="46" font-weight="900" text-anchor="middle" style="fill:#E8323C">%29,73</text>` + `<text class="mono" x="${800 - ((t * 140) % 1500)}" y="872" font-size="34" style="fill:#FFFFFF" letter-spacing="3">${s}</text>`;
    return o + '</g></g>'; }
  function karton(x, y, s, t) { let o = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 L-120 60 M40 0 L120 60" stroke="#8E6A3A" stroke-width="12"/>` + R(-230, -620, 460, 620, 14, '#D8B888') + R(-230, -620, 460, 16, 8, '#B8986A');
    o += KS.karakter({ x: -90, y: -40, boy: 480, t: 0, ust: '#9AA0B0', alt: '#6A6A7A', ifade: 'gulumse', sac: { tip: 'kisa', renk: '#8A7A6A' }, ten: '#D8C8B8' }) + KS.karakter({ x: 100, y: -40, boy: 440, t: 0, ust: '#B0A8B8', alt: '#6A6A7A', ifade: 'gulumse', sac: { tip: 'uzun', renk: '#8A7A6A' }, ten: '#D8C8B8' });
    return o + '</g>'; }
  // harcama pastası: dilimler [[etiket, pay(0..1), renk]]; p 0..1 çizim ilerlemesi
  function pasta(x, y, r, dilimler, p = 1, { etiket = true } = {}) {
    if (p <= 0) return ''; let o = `<circle cx="${x}" cy="${y + 10}" r="${r * Math.min(1, p * 3)}" fill="#000" opacity=".12"/>`; let a0 = -Math.PI / 2, top = 0;
    dilimler.forEach(([ad, pay, renk]) => { const a1 = a0 + pay * Math.PI * 2 * p; if (a1 - a0 > .001) { const buyuk = a1 - a0 > Math.PI ? 1 : 0;
      o += `<path d="M${x} ${y} L${x + Math.cos(a0) * r} ${y + Math.sin(a0) * r} A${r} ${r} 0 ${buyuk} 1 ${x + Math.cos(a1) * r} ${y + Math.sin(a1) * r}Z" fill="${renk}"/>`;
      if (etiket && p > .95) { const am = (a0 + a1) / 2, s = `${ad} %${Math.round(pay * 100)}`; o += `<g transform="translate(${x + Math.cos(am) * r * .62} ${y + Math.sin(am) * r * .62})">` + cipO(s, 0, 0, '#FFFDF6', '#1B1640', pay > .2 ? 24 : 20) + '</g>'; } }
      a0 = a1; });
    return o + `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#FFFDF6" stroke-width="6"/>`; }
  function termometre(x, y, s, deger, max, renk, etk) { const H = 600, dol = H * cl(deger / max);
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-50, -H - 40, 100, H + 40, 50, '#FFFDF6') + R(-30, -dol, 60, dol, 30, renk) + `<circle cx="0" cy="40" r="80" fill="#FFFDF6"/><circle cx="0" cy="40" r="60" fill="${renk}"/>`;
    for (let i = 1; i < 6; i++) o += R(50, -H * i / 6, 30, 6, 3, '#9AA0B0');
    o += T_(`%${Math.round(deger)}`, 0, -dol - 70, 90, renk) + (etk ? cipO(etk, 0, 180, renk, '#FFFFFF', 26) : '');
    return o + '</g>'; }
  function ogrenciOda(T) { let o = CV.oda(T, { zeminY: 1250, dolap: false, pencere: [700, 280, 260, 320] }) + CV.raf(60, 360, 420, T, 5) + CV.poster(560, 360, 110, 150, T, 6);
    o += R(80, 1040, 520, 30, 10, '#8E5A30') + R(110, 1070, 24, 180, 8, '#6A4020') + R(550, 1070, 24, 180, 8, '#6A4020') + CV.lamba(160, 1040, .5, T) + CV.yerdeKitap(420, 1040, .6, T) + CV.kupa(520, 1040, .9, T.vurgu);
    o += CV.hali(540, 1560, 900, 170, T) + CV.sandalye(700, 1250, .8, T) + CV.kutuYigini(900, 1250, .8, T) + CV.yerdeKitap(200, 1500, .9, T) + CV.yerdeKitap(210, 1470, .8, T);
    return o; }
  function emekliEv(T) { let o = CV.oda(T, { zeminY: 1250, pencere: [120, 300, 260, 320] }) + CV.cerceveResim(560, 420, 180, 140, T) + CV.saat(860, 360, 60, T, 3) + CV.bitki(980, 1250, .9, T) + CV.hali(540, 1500, 900, 160, T);
    o += R(620, 1000, 360, 260, 60, '#B8683A') + R(600, 940, 400, 140, 60, '#C8784A') + R(590, 1000, 70, 250, 30, '#A8582A') + R(940, 1000, 70, 250, 30, '#A8582A');
    return o; }
  return { ikon, sepet, salon, tvHaber, karton, pasta, termometre, ogrenciOda, emekliEv, cipO };
})();
const END = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#0A1A10', g = .4) => `<defs><radialGradient id="env"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#env)"/>`;
  const cipO = EN.cipO;
  // sepetin içi (üstten): kalemler sırayla düşer, sonra ağırlık etiketleri
  function sepetIc(d, L, tAg) {
    let o = `<rect width="1080" height="1920" fill="#C8323C"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => R(-40, 300 + i * 150, 1160, 24, 12, '#A82030')).join('') + [0, 1, 2, 3, 4, 5].map(i => R(80 + i * 190, 260, 24, 1400, 12, '#A82030')).join('');
    o += R(60, 300, 960, 1300, 40, '#E8505B', .35);
    L.forEach(([t0, ad, et, ag], i) => { const p = ar(d, t0, t0 + .4); if (p <= 0) return; const x = 270 + (i % 2) * 540, y = 520 + Math.floor(i / 2) * 400, dy = (1 - FX.E.expo(p)) * -900;
      o += `<g transform="translate(${x} ${y + dy}) rotate(${(1 - p) * 90 * (i % 2 ? 1 : -1)})"><circle cx="0" cy="0" r="150" fill="#FFFDF6" opacity=".92"/>` + EN.ikon(ad, 0, -10, 1.7) + '</g>';
      if (p >= 1) o += `<g transform="translate(${x} ${y + 180})">` + cipO(et, 0, 0, '#1B1640', '#FFFFFF', 30) + '</g>';
      const a = ar(d, tAg + i * .12, tAg + i * .12 + .35); if (a > 0) { const w = 200; o += `<g transform="translate(${x + 110} ${y - 120}) rotate(12) scale(${a})"><path d="M-10 0 L20 -40" stroke="#1B1640" stroke-width="4"/>` + R(0, -40, w, 90, 14, '#FFE45C') + `<circle cx="18" cy="-24" r="8" fill="#C8323C"/>` + Tm('AĞIRLIK', w / 2 + 10, -2, 22, '#1B1640', 'letter-spacing="2"') + R(30, 16, (w - 50) * ag, 14, 7, '#2FBF71') + R(30, 16, w - 50, 14, 7, '#1B1640', .15) + '</g>'; } });
    return o + vin('#40000A', .4);
  }
  // hesap tablosu: satırlar [[kalem, pay%, artış%]]
  function hesap(d, satir, sonuc, renk = '#2FBF71') {
    let o = `<rect width="1080" height="1920" fill="#1F4A3A"/>` + bul(`<circle cx="200" cy="300" r="260" fill="#2FBF71" opacity=".4"/>`, 30);
    o += `<g transform="rotate(-2 540 950)">` + R(110, 420, 880, 1100, 30, '#000', .2) + R(90, 400, 880, 1100, 30, '#FFFDF6') + Tm('ÖRNEK · ÖĞRENCİ', 530, 480, 30, '#8A7A9E', 'letter-spacing="4"');
    const kol = [200, 460, 640, 860]; ['KALEM', 'PAY', '× ARTIŞ', '= KATKI'].forEach((b, i) => o += `<text class="mono" x="${kol[i]}" y="570" font-size="30" text-anchor="middle" letter-spacing="2" style="fill:#1F4A3A">${b}</text>`);
    o += R(130, 590, 800, 4, 2, '#1F4A3A', .5);
    let top = 0; satir.forEach(([k, p, a], i) => { const q = ar(d, .2 + i * .35, .5 + i * .35); if (q <= 0) return; const y = 680 + i * 120, katki = p * a / 100; top += katki * (q >= 1 ? 1 : 0);
      o += `<g opacity="${q}"><text x="${kol[0]}" y="${y}" font-size="46" font-weight="700" text-anchor="middle" style="fill:#1B1640">${k}</text><text x="${kol[1]}" y="${y}" font-size="46" font-weight="700" text-anchor="middle" style="fill:#1B1640">%${p}</text><text x="${kol[2]}" y="${y}" font-size="46" font-weight="700" text-anchor="middle" style="fill:#C8323C">%${a}</text><text x="${kol[3]}" y="${y}" font-size="50" font-weight="900" text-anchor="middle" style="fill:${renk}">${katki.toFixed(1).replace('.', ',')}</text></g>`; });
    const tq = ar(d, .3 + satir.length * .35, .7 + satir.length * .35); if (tq > 0) o += R(130, 1210, 800, 6, 3, '#1B1640') + `<text x="220" y="1320" font-size="54" font-weight="900" text-anchor="middle" style="fill:#1B1640">TOPLAM</text>` + `<g transform="translate(760 1300) scale(${Math.min(1, FX.yayTip(d - .3 - satir.length * .35, 'agir'))})">` + R(-170, -80, 340, 140, 30, renk) + T_(`≈ %${sonuc}`, 0, 30, 90, '#FFFFFF') + '</g>';
    return o + '</g>' + vin('#06140E', .4);
  }
  function formul(d) {
    let o = `<rect width="1080" height="1920" fill="#FFF3D6"/>` + bul(`<circle cx="850" cy="300" r="260" fill="#FFB44C" opacity=".4"/>`, 30);
    o += R(110, 520, 860, 820, 40, '#000', .12) + R(90, 500, 860, 820, 40, '#1B3A4A');
    const a = ar(d, .1, .6); o += `<g opacity="${a}">` + T_('Σ', 250, 950, 260, '#FFE45C') + '</g>';
    const b = ar(d, .6, 1.1); o += `<g opacity="${b}">` + `<text x="400" y="870" font-size="70" font-weight="900" style="fill:#FFFFFF">PAY</text>` + `<text x="400" y="960" font-size="60" font-weight="900" style="fill:#FFB44C">×</text>` + `<text x="480" y="960" font-size="70" font-weight="900" style="fill:#E8505B">ARTIŞ</text>` + '</g>';
    const c = ar(d, 1.4, 1.9); if (c > 0) o += `<g transform="translate(540 1180) scale(${c})">` + EN.cipO('= SENİN ENFLASYONUN', 0, 0, '#2FBF71', '#FFFFFF', 38) + '</g>';
    for (let i = 0; i < 4; i++) { const q = ar(d, 2.0 + i * .3, 2.4 + i * .3); if (q > 0) o += `<g transform="translate(${220 + i * 210} 1450) scale(${q})"><circle cx="0" cy="0" r="80" fill="#FFFDF6"/>` + EN.ikon(['kira', 'gida', 'ulasim', 'giyim'][i], 0, 0, 1) + '</g>'; }
    return o + vin('#40300A', .3);
  }
  return { sepetIc, hesap, formul };
})();
