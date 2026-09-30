/* DETAY PLAN (insert shot) — anlatıdaki nesneyi merkeze alan, ayrı çizilmiş yakın plan kompozisyonları.
   Sahneyi büyütmek DEĞİL: kendi zemini, dokusu, alan derinliği (bulanık ön/arka plan), kendi mini animasyonu.
   DP.sar(t, t0, t1, fn) → t0–t1 arasında tam kadraj insert; kesme ile girer (hafif 'oturma' + yavaş push-in), kesme ile çıkar. */
const DP = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const eio = q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
  let n = 0; const id = p => `dp${p}${++n}`;
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vinyet = (renk = '#1B1030', g = .45) => { const i = id('v'); return `<defs><radialGradient id="${i}" cx=".5" cy=".45" r=".75"><stop offset=".5" stop-color="${renk}" stop-opacity="0"/><stop offset="1" stop-color="${renk}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#${i})"/>`; };
  function sar(t, t0, t1, fn) {
    if (t < t0 || t >= t1) return ''; const d = t - t0, L = t1 - t0;
    const otur = 1 + .06 * Math.exp(-d * 9) * Math.cos(d * 14), push = 1 + .035 * (d / L);
    const k = otur * push;
    return `<g transform="translate(540 900) scale(${k}) translate(-540 -900)">${fn(d, L)}</g>` + (d < .08 ? `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${.35 * (1 - d / .08)}"/>` : '');
  }
  // 1) kaldırımdaki cüzdan
  function kaldirim(d) {
    let o = `<rect width="1080" height="1920" fill="#8E857C"/>`;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) { const x = c * 300 - (r % 2) * 150 - 40, y = r * 230 - 60, v = h(r * 7 + c);
      o += R(x + 10, y + 10, 280, 210, 26, v > .5 ? '#B5ABA0' : '#A89E93') + R(x + 10, y + 10, 280, 18, 10, '#FFFFFF', .12) + `<circle cx="${x + 60 + v * 150}" cy="${y + 90}" r="4" fill="#7E756C" opacity=".6"/><circle cx="${x + 200 - v * 90}" cy="${y + 160}" r="3" fill="#7E756C" opacity=".6"/>`; }
    const yap = (x, y, s, r, c) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 -60 Q50 -20 0 60 Q-50 -20 0 -60Z" fill="${c}"/><path d="M0 -55 L0 58" stroke="#00000033" stroke-width="4"/></g>`;
    [[150, 520, 1.6, 30, '#E8505B'], [880, 700, 1.4, -40, '#FFB44C'], [260, 1200, 1.3, 70, '#C8623A'], [860, 1300, 1.7, 10, '#F28F3A'], [640, 480, 1.1, -70, '#FFB44C']].forEach(a => o += yap(...a));
    // Gufi'nin gölgesi üstten sokulur
    const g = eio(ar(d, .15, .7)); o += `<ellipse cx="560" cy="${-260 + 420 * g}" rx="520" ry="300" fill="#2A1830" opacity="${.28 * g}"/>`;
    // cüzdan (büyük, merkez, detaylı)
    const cx = 540, cy = 900, w = 640, hh = 420;
    o += `<g transform="rotate(-8 ${cx} ${cy})">` + R(cx - w / 2 + 16, cy - hh / 2 + 24, w, hh, 46, '#000', .25) +
      R(cx - 250, cy - hh / 2 - 70, 380, 170, 12, '#A8D5A0') + Tm('100', cx - 60, cy - hh / 2 - 10, 60, '#3E7A4E') + R(cx + 40, cy - hh / 2 - 40, 230, 140, 14, '#BFE3F0') + R(cx + 40, cy - hh / 2 - 40, 230, 32, 14, '#2E7FB8') +
      R(cx - w / 2, cy - hh / 2, w, hh, 46, '#6B3A2A') + R(cx - w / 2, cy - hh / 2, w, 150, 46, '#7E4634') + R(cx - w / 2 + 24, cy - hh / 2 + 24, w - 48, hh - 48, 32, 'none') +
      `<rect x="${cx - w / 2 + 24}" y="${cy - hh / 2 + 24}" width="${w - 48}" height="${hh - 48}" rx="32" fill="none" stroke="#D8A878" stroke-width="5" stroke-dasharray="16 12"/>` +
      R(cx - w / 2, cy - 30, w, 10, 4, '#4A2418', .6) + `<circle cx="${cx + w / 2 - 70}" cy="${cy + 40}" r="34" fill="#D8A032"/><circle cx="${cx + w / 2 - 70}" cy="${cy + 40}" r="16" fill="#F2CE7A"/>` +
      R(cx - w / 2 + 30, cy - hh / 2 + 20, 180, 16, 8, '#FFFFFF', .18) + '</g>';
    const pa = ar(d, .3, .9); if (pa > 0 && pa < 1) o += `<path d="M${200 + 700 * pa} 600 l80 0 l-160 600 l-80 0Z" fill="#FFFFFF" opacity="${.35 * Math.sin(pa * Math.PI)}"/>`;
    o += bul(yap(90, 1700, 3.2, 20, '#F28F3A') + yap(1000, 180, 2.8, -30, '#E8505B'), 14);
    return o + vinyet('#2A1830', .5);
  }
  // 2) Medeni Kanun sayfası, fosforlu kalem
  function kanun(d) {
    let o = `<rect width="1080" height="1920" fill="#5A3FA8"/>` + bul(R(-100, 1500, 1300, 600, 0, '#3A2A70'), 20);
    o += `<g transform="rotate(-3 540 900)">` + R(90, 180, 900, 1300, 18, '#000', .25) + R(70, 160, 900, 1300, 18, '#FFF8EA') + R(70, 160, 30, 1300, 0, '#EDE3CC');
    o += Tm('TÜRK MEDENİ KANUNU', 520, 260, 30, '#8A7A9E', 'letter-spacing="6"') + T_('Madde 769', 520, 400, 100, '#2A1E5E') + R(170, 440, 700, 8, 4, '#8C6CFF');
    const sat = [['Kaybolmuş bir eşyayı', 0], ['bulan kimse, durumu', 0], ['malikine bildirmek;', 1], ['malikini tanımıyorsa', 0], ['kolluk kuvvetine', 2], ['bildirmekle yükümlüdür.', 0]];
    sat.forEach(([s, v], i) => { const y = 580 + i * 110, fs = 64;
      if (v) { const p = eio(ar(d, v === 1 ? .15 : .5, v === 1 ? .45 : .8)), wd = K.yaziGen(s, fs, { agirlik: 700 }) + 30; o += R(520 - wd / 2, y - 58, wd * p, 80, 10, '#FFE45C', .85); }
      o += `<text x="520" y="${y}" font-size="${fs}" font-weight="700" text-anchor="middle" style="fill:#2A2440">${s}</text>`; });
    o += Tm('(özet)', 520, 1300, 30, '#8A7A9E') + T_('§', 860, 360, 120, '#8C6CFF', 900, 'opacity=".25"') + '</g>';
    o += bul(`<g transform="translate(900 1560) rotate(-35)">${R(-40, -260, 80, 520, 20, '#FFE45C')}${R(-40, -260, 80, 90, 20, '#2A2440')}</g>`, 10);
    return o + vinyet('#1B1040', .5);
  }
  // 3) tokmak vuruşu (vuruş d = vurus)
  function tokmak(d, vurus = .25) {
    let o = `<rect width="1080" height="1920" fill="#3A2016"/>` + bul(R(0, 0, 1080, 900, 0, '#6A3A20') + `<circle cx="820" cy="300" r="260" fill="#D8A032" opacity=".25"/>`, 26);
    for (let i = 0; i < 6; i++) o += R(0, 1000 + i * 160, 1080, 150, 6, i % 2 ? '#8E5226' : '#A8683A') + R(0, 1000 + i * 160, 1080, 8, 0, '#FFFFFF', .1);
    o += `<ellipse cx="540" cy="1230" rx="300" ry="70" fill="#000" opacity=".3"/>` + `<ellipse cx="540" cy="1190" rx="280" ry="70" fill="#5A2E18"/>` + R(260, 1110, 560, 80, 0, '#6A3A20') + `<ellipse cx="540" cy="1110" rx="280" ry="70" fill="#8E5226"/><ellipse cx="540" cy="1100" rx="240" ry="52" fill="#A8683A"/>`;
    const q = d < vurus ? -35 * eio(d / vurus) : -35 + 35 * Math.min(1, (d - vurus) / .06) - 6 * Math.exp(-(d - vurus) * 10) * Math.sin((d - vurus) * 40);
    o += '<g transform="translate(90 0)">'; const kalk = d < vurus ? d / vurus : 0, ang = d < vurus ? -35 + 10 * (1 - kalk) : q;
    o += `<g transform="rotate(${d < vurus ? -35 * (1 - (d / vurus) ** 3) - 5 : Math.max(-6, q + 35 - 35)} 1000 820)">` +
      R(600, 860, 520, 64, 32, '#D8A060') + R(600, 860, 520, 20, 10, '#FFFFFF', .25) + R(200, 780, 460, 240, 70, '#5A2A14') + R(200, 790, 460, 70, 35, '#FFFFFF', .14) + R(175, 820, 50, 160, 20, '#D8A032') + R(635, 820, 50, 160, 20, '#D8A032') + '</g></g>';
    const e = d - vurus - .06; if (e > 0 && e < .6) { const p = e / .6; o += `<ellipse cx="540" cy="1100" rx="${300 + 300 * p}" ry="${70 + 70 * p}" fill="none" stroke="#FFE9A8" stroke-width="${14 * (1 - p)}" opacity="${1 - p}"/>`;
      for (let i = 0; i < 10; i++) { const a = Math.PI + i / 9 * Math.PI; o += `<circle cx="${540 + Math.cos(a) * (260 + 200 * p)}" cy="${1090 + Math.sin(a) * (80 + 160 * p)}" r="${8 * (1 - p)}" fill="#F2CE7A" opacity="${1 - p}"/>`; } }
    return o + vinyet('#120806', .6);
  }
  // 4) kapıda teslim: paspas + Gufi'nin eli cüzdanı uzatır
  function teslim(d) {
    let o = `<rect width="1080" height="1920" fill="#2A1830"/>` + bul(`<rect x="200" y="0" width="680" height="1100" fill="#FFE0B8"/><circle cx="540" cy="400" r="300" fill="#FFF3D6"/>`, 30);
    o += R(0, 0, 200, 1920, 0, '#B84A78') + R(880, 0, 200, 1920, 0, '#B84A78') + R(180, 0, 30, 1920, 0, '#7E2E5A') + R(870, 0, 30, 1920, 0, '#7E2E5A');
    o += R(0, 1180, 1080, 740, 0, '#E86A93') + R(0, 1180, 1080, 24, 0, '#7E2E5A', .5);
    o += `<g transform="rotate(-4 540 1450)">` + R(170, 1320, 740, 300, 30, '#8E5A3A') + R(195, 1345, 690, 250, 20, '#A8704A') + `<text class="mono" x="540" y="1495" font-size="${K.yaziGen('HOŞ GELDİNİZ', 58, { mono: true, ls: 4 }) > 600 ? 50 : 58}" text-anchor="middle" letter-spacing="4" style="fill:#5A3020">HOŞ GELDİNİZ</text></g>`;
    const g = eio(ar(d, 0, .45)), x = -200 + 450 * g, y = 900 - 40 * g;
    o += `<g transform="translate(${x} ${y}) rotate(${-6 + 4 * g})">` + R(-40, 40, 620, 400, 60, '#000', .2) + R(-60, 0, 620, 400, 60, '#6B3A2A') + `<rect x="-36" y="24" width="572" height="352" rx="44" fill="none" stroke="#D8A878" stroke-width="5" stroke-dasharray="16 12"/>` + `<circle cx="480" cy="200" r="30" fill="#D8A032"/>` +
      `<circle cx="-40" cy="230" r="110" fill="#8E1B3F"/><circle cx="-50" cy="220" r="110" fill="#EE312E"/><circle cx="-10" cy="170" r="36" fill="#FFC7BD" opacity=".8"/>` + '</g>';
    return o + vinyet('#1B0A20', .45);
  }
  // 5) taş yüzeyinde ilerleyen çatlak
  function catlak(d) {
    let o = `<rect width="1080" height="1920" fill="#8A849E"/>`;
    for (let i = 0; i < 80; i++) o += `<circle cx="${h(i) * 1080}" cy="${h(i + 99) * 1920}" r="${2 + h(i + 5) * 8}" fill="${h(i + 7) > .5 ? '#6E6886' : '#A8A2BC'}" opacity=".7"/>`;
    o += `<path d="M300 -50 L300 1300 Q300 1400 400 1400 L1200 1400 L1200 -50Z" fill="#C9C3DA"/><path d="M340 -50 L340 1250 Q340 1350 440 1350 L1200 1350 L1200 -50Z" fill="#B5AFC8"/>` + T_('%10', 760, 1150, 760, '#9A94B0') + T_('%10', 745, 1135, 760, '#C9C3DA');
    const p = ar(d, 0, .55), pts = [[640, -40], [600, 180], [690, 360], [560, 560], [650, 760], [520, 980], [600, 1200], [540, 1500], [610, 1960]];
    let dd = `M${pts[0][0]} ${pts[0][1]}`; const nn = Math.max(1, Math.floor(p * (pts.length - 1)));
    for (let i = 1; i <= nn; i++) dd += ` L${pts[i][0]} ${pts[i][1]}`;
    const sx = Math.sin(d * 70) * 10 * Math.exp(-d * 3);
    o = `<g transform="translate(${sx} 0)">` + o + `<path d="${dd}" stroke="#1B1640" stroke-width="18" fill="none" stroke-linejoin="round"/><path d="${dd}" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".35" transform="translate(8 0)"/>`;
    if (nn >= 3) o += `<path d="M690 360 L820 300 L900 380" stroke="#1B1640" stroke-width="10" fill="none"/>`; if (nn >= 5) o += `<path d="M650 760 L480 700 L400 780" stroke="#1B1640" stroke-width="10" fill="none"/>`;
    for (let i = 0; i < 16; i++) { const k = ((d * 1.6 + h(i)) % 1), [bx, by] = pts[1 + (i % Math.max(1, nn))]; o += `<circle cx="${bx + (h(i + 3) - .5) * 300 * k}" cy="${by - 200 * k + 300 * k * k}" r="${6 + 6 * h(i)}" fill="#D8D2E6" opacity="${1 - k}"/>`; }
    return o + '</g>' + vinyet('#2A2440', .5);
  }
  // 6) danışma masasında teslim tutanağı + ÖDÜL YOK damgası (damga d = vur)
  function tutanak(d, vur = .3) {
    let o = `<rect width="1080" height="1920" fill="#1F7A80"/>` + bul(R(0, 0, 1080, 500, 0, '#5FC7C0') + `<circle cx="200" cy="200" r="200" fill="#D8F7EE" opacity=".5"/>`, 30);
    for (let i = 0; i < 12; i++) o += R(0, 480 + i * 130, 1080, 126, 0, i % 2 ? '#2E9A9C' : '#3FAFAE');
    o += `<g transform="rotate(4 540 900)">` + R(170, 360, 740, 1040, 14, '#000', .2) + R(150, 340, 740, 1040, 14, '#FFFDF6') + Tm('TESLİM TUTANAĞI', 520, 440, 42, '#155A63', 'letter-spacing="4"') + R(210, 470, 620, 6, 3, '#155A63', .5);
    [['Eşya', 'Cüzdan'], ['Bulunduğu yer', 'Kamu binası'], ['Teslim alan', 'Görevli'], ['Ödül', '—']].forEach(([a, b], i) => { const y = 580 + i * 120; o += `<text x="210" y="${y}" font-size="40" font-weight="700" style="fill:#5A8E8A">${a}:</text><text x="830" y="${y}" font-size="44" font-weight="900" text-anchor="end" style="fill:#155A63">${b}</text>` + R(210, y + 22, 620, 4, 2, '#155A63', .2); });
    const iz = ar(d, vur, vur + .05); if (iz > 0) { const w = K.yaziGen('ÖDÜL YOK', 90) + 90; o += `<g transform="rotate(-14 520 1130)" opacity="${.9 * iz}"><rect x="${520 - w / 2}" y="1060" width="${w}" height="140" rx="16" fill="none" stroke="#C8323C" stroke-width="14"/>` + T_('ÖDÜL YOK', 520, 1162, 90, '#C8323C') + `</g>`; }
    o += '</g>';
    const inis = d < vur ? eio(d / vur) : 1 - eio(ar(d, vur + .12, vur + .45));
    o += `<g transform="translate(520 ${1130 - 800 + 700 * inis})">` + `<ellipse cx="0" cy="-10" rx="170" ry="30" fill="#000" opacity=".2"/>` + R(-160, -80, 320, 80, 16, '#3A3F5C') + R(-40, -300, 80, 230, 30, '#6A3A20') + `<circle cx="0" cy="-320" r="80" fill="#8E5226"/>` + '</g>';
    if (d > vur && d < vur + .4) o += `<ellipse cx="520" cy="1130" rx="${420 * (d - vur) / .4 + 200}" ry="${120 * (d - vur) / .4 + 60}" fill="none" stroke="#FFFFFF" stroke-width="8" opacity="${1 - (d - vur) / .4}"/>`;
    return o + vinyet('#0A2A2E', .45);
  }
  // 7) bankta kurdeleli cüzdan + SENİN etiketi
  function kurdele(d, t) {
    let o = `<rect width="1080" height="1920" fill="#E8C890"/>` + bul(`<circle cx="850" cy="300" r="260" fill="#F28F3A"/><circle cx="200" cy="420" r="200" fill="#FFB44C"/>`, 34);
    for (let i = 0; i < 5; i++) o += R(-20, 700 + i * 230, 1120, 200, 30, i % 2 ? '#A8683A' : '#8E5226') + R(-20, 700 + i * 230, 1120, 14, 7, '#FFFFFF', .12);
    const cx = 540, cy = 880; o += R(cx - 330 + 18, cy - 210 + 26, 660, 420, 46, '#000', .25) + R(cx - 330, cy - 210, 660, 420, 46, '#6B3A2A') + `<rect x="${cx - 306}" y="${cy - 186}" width="612" height="372" rx="34" fill="none" stroke="#D8A878" stroke-width="5" stroke-dasharray="16 12"/>`;
    o += R(cx - 340, cy - 26, 680, 52, 8, '#E8505B') + R(cx - 26, cy - 220, 52, 440, 8, '#E8505B') + R(cx - 340, cy - 26, 680, 14, 0, '#FFFFFF', .2);
    const b = 1 + .08 * Math.exp(-d * 5) * Math.sin(d * 18);
    o += `<g transform="translate(${cx} ${cy - 30}) scale(${b})"><ellipse cx="-80" cy="-40" rx="100" ry="56" fill="#E8505B" transform="rotate(-25 -80 -40)"/><ellipse cx="80" cy="-40" rx="100" ry="56" fill="#E8505B" transform="rotate(25 80 -40)"/><ellipse cx="-80" cy="-40" rx="46" ry="22" fill="#C8323C" transform="rotate(-25 -80 -40)"/><ellipse cx="80" cy="-40" rx="46" ry="22" fill="#C8323C" transform="rotate(25 80 -40)"/><circle cx="0" cy="-26" r="40" fill="#C8323C"/></g>`;
    const sw = Math.sin(t * 2.2) * 5, tw = K.yaziGen('SENİN', 80) + 90;
    o += `<g transform="translate(${cx + 40} ${cy + 20}) rotate(${sw})"><path d="M0 0 Q20 80 60 120" stroke="#C8323C" stroke-width="8" fill="none"/><g transform="translate(60 120)">${R(-20, 0, tw, 130, 18, '#FFFDF6')}<circle cx="10" cy="65" r="14" fill="#E8C890"/>${T_('SENİN', -20 + tw / 2 + 12, 92, 80, '#C8323C')}</g></g>`;
    for (let i = 0; i < 5; i++) { const y = ((t * 120 + i * 400) % 2100) - 100, x = 100 + i * 220 + Math.sin(t + i) * 40; o += bul(`<ellipse cx="${x}" cy="${y}" rx="44" ry="22" fill="${['#F28F3A', '#E8505B', '#FFB44C'][i % 3]}" transform="rotate(${t * 60 + i * 50} ${x} ${y})"/>`, i % 2 ? 8 : 0); }
    const pa = ar(d, .2, .8); if (pa > 0 && pa < 1) o += `<path d="M${200 + 700 * pa} 800 l80 0 l-160 600 l-80 0Z" fill="#FFFFFF" opacity="${.3 * Math.sin(pa * Math.PI)}"/>`;
    return o + vinyet('#3A1E10', .45);
  }
  return { sar, kaldirim, kanun, tokmak, teslim, catlak, tutanak, kurdele };
})();
