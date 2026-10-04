/* #31 Hayvanları Koruma Günü kiti — sokak köpeği (yan görünüm, kulak küpeli), sokak dekoru, yüzsüz silüet insanlar,
   mama kabı, kulübe, çekiç, veteriner kapısı, Resmî Gazete, kartlar, ikonlar. Flat, kontursuz, ışık sağ üstten. */
const KP = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  let uid = 0; const id = p => `kp${p}${++uid}`;
  const C = { MAVI: '#3E6FD8', MAVIK: '#1E3A78', TURU: '#FF8A3D', TURUK: '#C2551E', KREM: '#FFF3D6', LAC: '#0B1433', YES: '#2FBF71' };
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };

  // ---------------- KÖPEK ----------------
  // x, y = ayak tabanı orta; s ölçek (1 → ~250 px boy); yon 1 sağa bakar.
  // mod: 'dost' (kulak dik, dil, kuyruk yukarı sallanır) · 'tehdit' (kulak geri, tüy kabarık, baş alçak, kuyruk aşağı) · 'notr'
  // adim: yürüme fazı (null = duruyor), t: zaman (kuyruk/nefes), bas: 0..1 başı yere indir (mama yer), karanlik: 0..1 gölge-silüet
  function kopek(x, y, s = 1, { yon = 1, mod = 'notr', adim = null, t = 0, bas = 0, karanlik = 0, sargi = false, kupe = true, renk = 'sari', golge = true } = {}) {
    const P0 = { sari: ['#E0A866', '#A8693A', '#F6D7A6', '#7A4A2A'], kara: ['#4A4038', '#2A231E', '#8A7A6A', '#1E1814'], benek: ['#EDE3D2', '#B8A890', '#FFFFFF', '#6A5A4A'] }[renk];
    const D = '#141A2E', k = karanlik;
    const [G, GK, GA, BU] = P0.map(c => mix(c, D, k * .85));
    const tehdit = mod === 'tehdit', dost = mod === 'dost';
    let o = `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})">`;
    if (golge) o += `<ellipse cx="0" cy="4" rx="110" ry="12" fill="#000" opacity="${.22 * (1 - k * .5)}"/>`;
    // kuyruk
    const wag = dost ? Math.sin(t * 16) * 22 : tehdit ? 0 : Math.sin(t * 4) * 6;
    const kd = dost ? 'M0 0 Q-30 -40 -18 -78' : tehdit ? 'M0 0 Q-40 18 -62 46' : 'M0 0 Q-38 -10 -52 -40';
    o += `<g transform="translate(-76 -104) rotate(${wag})"><path d="${kd}" stroke="${GK}" stroke-width="16" fill="none" stroke-linecap="round"/></g>`;
    // bacaklar (arka katman: uzak taraf koyu)
    const leg = (lx, ph, uzak, on) => { const a = adim == null ? 0 : Math.sin(adim * Math.PI * 2 + ph) * 24; const c = uzak ? GK : G;
      const ust = on ? `M-13 0 L13 0 L10 60 L-9 60Z` : `M-16 0 Q14 6 12 36 L6 60 L-10 60 Q-6 30 -16 0Z`;
      return `<g transform="translate(${lx} -88) rotate(${a})"><path d="${ust}" fill="${c}"/><rect x="-9" y="52" width="18" height="34" rx="9" fill="${c}"/><ellipse cx="5" cy="86" rx="15" ry="7" fill="${uzak ? GK : BU}"/>` + (sargi && on && !uzak ? `<rect x="-11" y="50" width="22" height="24" rx="5" fill="#FFFFFF"/><path d="M-11 62 h22" stroke="#D6DCE2" stroke-width="3"/>` : '') + '</g>'; };
    o += leg(-50, Math.PI, true, false) + leg(56, 0, true, true);
    // gövde: derin göğüs, ince bel
    const by = tehdit ? -96 : -100;
    const gov = `M-86 ${by - 6} Q-90 ${by - 36} -50 ${by - 38} Q10 ${by - 34} 60 ${by - 40} Q92 ${by - 40} 92 ${by - 6} Q94 ${by + 34} 60 ${by + 38} Q20 ${by + 24} -20 ${by + 22} Q-60 ${by + 26} -78 ${by + 18} Q-92 ${by + 8} -86 ${by - 6}Z`;
    o += `<path d="${gov}" fill="${G}"/><path d="M-80 ${by + 4} Q-40 ${by + 24} 0 ${by + 16} Q40 ${by + 30} 70 ${by + 30} Q40 ${by + 40} -20 ${by + 24} Q-60 ${by + 28} -80 ${by + 10}Z" fill="${GK}" opacity=".45"/>` +
      `<path d="M-60 ${by - 30} Q0 ${by - 40} 60 ${by - 34}" stroke="${GA}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".5"/>`;
    if (tehdit) { let z = `M-52 ${by - 34}`; for (let i = 0; i < 9; i++) z += ` L${-46 + i * 11} ${by - 50 - (i % 2 ? 0 : 6)} L${-41 + i * 11} ${by - 36}`; o += `<path d="${z}Z" fill="${GK}"/>`; }
    o += leg(-34, 0, false, false) + leg(72, Math.PI, false, true);
    // boyun + göğüs
    const hb = bas * 92 + (tehdit ? 24 : 0) + (adim != null ? Math.abs(Math.sin(adim * Math.PI * 2)) * 4 : Math.sin(t * 2.2) * 2);
    const hx = 112 + bas * 14, hy = -150 + hb;
    o += `<path d="M44 ${by - 30} Q${hx - 30} ${hy - 20} ${hx - 6} ${hy - 4} L${hx + 6} ${hy + 26} Q80 ${by + 10} 70 ${by + 30} Q60 ${by} 44 ${by - 30}Z" fill="${G}"/>`;
    o += `<path d="M70 ${by - 4} Q96 ${by + 6} 88 ${by + 32} Q74 ${by + 30} 66 ${by + 20}Z" fill="${GA}" opacity=".75"/>`;
    // kafa: kafatası + sivrilen burun
    o += `<ellipse cx="${hx}" cy="${hy}" rx="34" ry="30" fill="${G}"/>`;
    o += `<path d="M${hx + 8} ${hy - 12} Q${hx + 44} ${hy - 6} ${hx + 54} ${hy + 6} Q${hx + 56} ${hy + 20} ${hx + 36} ${hy + 22} L${hx + 6} ${hy + 22} Q${hx - 6} ${hy + 6} ${hx + 8} ${hy - 12}Z" fill="${GA}"/>`;
    o += `<ellipse cx="${hx + 52}" cy="${hy + 4}" rx="9" ry="8" fill="${BU}"/>`;
    if (tehdit) o += `<path d="M${hx + 12} ${hy + 22} L${hx + 48} ${hy + 18}" stroke="${BU}" stroke-width="4"/><path d="M${hx + 18} ${hy + 21} l4 6 l4 -6 l4 6 l4 -6 l4 6 l4 -6" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="${.9 - k * .3}"/>`;
    else o += `<path d="M${hx + 18} ${hy + 20} Q${hx + 32} ${hy + 27} ${hx + 46} ${hy + 18}" stroke="${BU}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (dost) o += `<path d="M${hx + 24} ${hy + 22} q2 ${18 + Math.sin(t * 10) * 3} 10 ${18 + Math.sin(t * 10) * 3} q8 0 6 -18Z" fill="#F07A8C"/>`;
    // kulak (kafanın üstünde, katlanmış üçgen) + küpe
    const kul = dost ? `M${hx - 22} ${hy - 16} L${hx - 12} ${hy - 62} L${hx + 6} ${hy - 22}Z` : tehdit ? `M${hx - 16} ${hy - 20} L${hx - 60} ${hy - 30} L${hx - 12} ${hy - 2}Z` : `M${hx - 24} ${hy - 18} L${hx - 10} ${hy - 56} L${hx + 4} ${hy - 22} Q${hx - 4} ${hy - 30} ${hx - 2} ${hy - 6}Z`;
    o += `<path d="${kul}" fill="${GK}"/>`;
    if (kupe && k < .9) o += `<rect x="${(dost ? hx - 16 : tehdit ? hx - 44 : hx - 18) - 6}" y="${(dost ? hy - 40 : tehdit ? hy - 26 : hy - 36) - 5}" width="12" height="10" rx="2" fill="#F2C230" opacity="${1 - k}"/>`;
    // göz
    if (k > .5) o += `<ellipse cx="${hx + 16}" cy="${hy - 8}" rx="7" ry="${tehdit ? 4 : 6}" fill="#FFD34A"/><circle cx="${hx + 16}" cy="${hy - 8}" r="16" fill="#FFD34A" opacity=".18"/>`;
    else if (dost) o += `<path d="M${hx + 7} ${hy - 6} Q${hx + 16} ${hy - 15} ${hx + 21} ${hy - 6}" stroke="${BU}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    else o += `<circle cx="${hx + 16}" cy="${hy - 8}" r="6" fill="${BU}"/><circle cx="${hx + 18}" cy="${hy - 10}" r="2" fill="#FFFFFF"/>` + (tehdit ? `<path d="M${hx + 2} ${hy - 20} L${hx + 24} ${hy - 13}" stroke="${BU}" stroke-width="5" stroke-linecap="round"/>` : '');
    return o + '</g>';
  }

  // ---------------- DEKOR ----------------
  // sokak: gökyüzü + apartman sırası + kaldırım; ton 0 = soğuk mavi sabah, 1 = sıcak turuncu sabah
  function sokak(ton = 0, { ofs = 0, ufuk = 1240, kar = 0, t = 0 } = {}) {
    const g = id('sk'), gu = [mix('#7FA2D8', '#FFC07A', ton), mix('#C8D8EE', '#FFE6B8', ton)];
    let o = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${gu[0]}"/><stop offset="1" stop-color="${gu[1]}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${g})"/>`;
    o += `<circle cx="${820 - ofs * .1}" cy="560" r="90" fill="${mix('#E8F0FF', '#FFE08A', ton)}" opacity=".85"/>`;
    const BR = [mix('#4E6A9A', '#C9784A', ton), mix('#3E5888', '#B0643A', ton), mix('#5E7AAA', '#D98A5A', ton)], PEN = mix('#D8E6FF', '#FFE7A8', ton);
    let bx = -200 - (ofs * .5) % 1400;
    for (let i = 0; bx < 1300; i++) { const w = 180 + h(i * 7) * 120, hh = 360 + h(i * 13) * 380, c = BR[i % 3];
      if (bx + w > -10) { o += R(bx, ufuk - hh, w, hh, 6, c); for (let r = 0; r < Math.floor((hh - 60) / 90); r++) for (let cc = 0; cc < Math.floor((w - 30) / 60); cc++) o += R(bx + 24 + cc * 60, ufuk - hh + 40 + r * 90, 30, 44, 4, PEN, h(i * 31 + r * 7 + cc) > .45 ? .85 : .35); }
      bx += w + 6; }
    o += R(0, ufuk, 1080, 70, 0, mix('#9AA6BE', '#D8B48E', ton)) + R(0, ufuk + 70, 1080, 1920 - ufuk - 70, 0, mix('#5A6688', '#8A6A58', ton));
    for (let i = 0; i < 9; i++) { const x = ((i * 160 - ofs) % 1440 + 1440) % 1440 - 180; o += R(x, ufuk + 6, 4, 58, 2, '#000', .12); }
    for (let i = 0; i < 6; i++) { const x = ((i * 260 - ofs) % 1560 + 1560) % 1560 - 240; o += R(x, ufuk + 320, 120, 14, 7, '#FFFFFF', .35); }
    if (kar > 0) for (let i = 0; i < 70; i++) { const xx = (h(i) * 1080 + Math.sin(t + i) * 30), yy = ((h(i + 9) * 1920 + t * (60 + h(i + 3) * 80)) % 1920); o += `<circle cx="${xx}" cy="${yy}" r="${3 + h(i + 5) * 5}" fill="#FFFFFF" opacity="${.8 * kar}"/>`; }
    return o;
  }
  function lamba(x, y, s = 1, renk = '#2A3456') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-6, -420, 12, 420, 6, renk) + `<path d="M0 -420 Q0 -450 40 -450 L70 -450" stroke="${renk}" stroke-width="10" fill="none"/>` + R(54, -452, 40, 22, 8, renk) + `<ellipse cx="74" cy="-428" rx="16" ry="6" fill="#FFE9A8"/></g>`; }

  // ---------------- SİLÜETLER (yüzsüz, sade) ----------------
  function cocuk(x, y, s = 1, { renk = '#22305A', canta = '#F2B630', adim = null, yon = 1, sargi = false } = {}) {
    const a = adim == null ? 0 : Math.sin(adim * Math.PI * 2) * 22;
    let o = `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})">`;
    o += `<ellipse cx="0" cy="3" rx="46" ry="8" fill="#000" opacity=".2"/>`;
    o += `<g transform="translate(-10 -78) rotate(${a})">${R(-9, 0, 18, 78, 9, renk)}</g><g transform="translate(10 -78) rotate(${-a})">${R(-9, 0, 18, 78, 9, renk)}</g>`;
    o += R(-38, -70, 30, 56, 12, canta, 1) + R(-30, -168, 60, 100, 26, renk);
    o += `<g transform="translate(20 -150) rotate(${-a * .8 + 10})">${R(-8, 0, 16, 64, 8, renk)}` + (sargi ? R(-10, 28, 20, 18, 5, '#FFFFFF') : '') + '</g>';
    o += `<circle cx="0" cy="-196" r="30" fill="${renk}"/>`;
    return o + '</g>';
  }
  function yasli(x, y, s = 1, { renk = '#2A3050', yon = 1 } = {}) {
    let o = `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})">`;
    o += `<ellipse cx="0" cy="3" rx="60" ry="9" fill="#000" opacity=".2"/>`;
    o += R(-22, -110, 20, 110, 10, renk) + R(4, -110, 20, 110, 10, renk);
    o += `<path d="M-34 -100 Q-40 -220 10 -250 Q50 -250 46 -200 L40 -100Z" fill="${renk}"/>`;
    o += `<circle cx="34" cy="-262" r="32" fill="${renk}"/>`;
    o += `<path d="M40 -190 L74 -120" stroke="${renk}" stroke-width="16" stroke-linecap="round"/><path d="M74 -130 L84 0" stroke="#6A4A2A" stroke-width="9" stroke-linecap="round"/><path d="M66 -132 Q76 -146 88 -132" stroke="#6A4A2A" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    return o + '</g>';
  }
  // yetişkin: dur | diz (çömelmiş) ; kucak: köpek SVG'si (yerel koordinatta göğüse)
  function yetiskin(x, y, s = 1, { renk = '#3A2A40', poz = 'dur', adim = null, yon = 1, kucak = '' } = {}) {
    const a = adim == null ? 0 : Math.sin(adim * Math.PI * 2) * 20;
    let o = `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})">`;
    o += `<ellipse cx="0" cy="3" rx="70" ry="10" fill="#000" opacity=".2"/>`;
    if (poz === 'diz') {
      o += `<path d="M-30 0 L-30 -70 L30 -80 L50 -10 L70 -10 L70 0Z" fill="${renk}"/><path d="M-40 -60 Q-44 -200 0 -210 Q44 -200 40 -70Z" fill="${renk}"/><circle cx="6" cy="-244" r="38" fill="${renk}"/>`;
      o += `<path d="M30 -170 Q90 -150 110 -110" stroke="${renk}" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    } else {
      o += `<g transform="translate(-16 -150) rotate(${a})">${R(-13, 0, 26, 150, 13, renk)}</g><g transform="translate(16 -150) rotate(${-a})">${R(-13, 0, 26, 150, 13, renk)}</g>`;
      o += `<path d="M-48 -140 Q-54 -320 0 -330 Q54 -320 48 -140Z" fill="${renk}"/><circle cx="0" cy="-372" r="42" fill="${renk}"/>`;
      if (kucak) o += kucak + `<path d="M-40 -280 Q20 -200 70 -230" stroke="${renk}" stroke-width="24" fill="none" stroke-linecap="round"/>`;
      else o += `<g transform="translate(40 -300) rotate(${-a * .6 - 8})">${R(-11, 0, 22, 130, 11, renk)}</g>`;
    }
    return o + '</g>';
  }

  // ---------------- EŞYALAR ----------------
  function mamaKabi(x, y, s = 1, dolu = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="2" rx="62" ry="10" fill="#000" opacity=".2"/><path d="M-56 -34 L56 -34 L44 0 L-44 0Z" fill="#E8505B"/><ellipse cx="0" cy="-34" rx="56" ry="12" fill="#B8323E"/>` +
    (dolu > 0 ? Array.from({ length: Math.round(9 * dolu) }, (_, i) => `<circle cx="${-36 + (i % 5) * 18 + (i > 4 ? 9 : 0)}" cy="${-38 - (i > 4 ? 8 : 0)}" r="8" fill="#9A5A2A"/>`).join('') : '') + `<path d="M-40 -24 L36 -24" stroke="#FFFFFF" stroke-width="4" opacity=".3"/></g>`; }
  function kulube(x, y, s = 1, tamam = 1, kar = 0) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="170" ry="16" fill="#000" opacity=".2"/>`;
    const n = 6; for (let i = 0; i < n; i++) { const p = Math.max(0, Math.min(1, tamam * n * .8 - i)); if (p <= 0) continue; o += R(-140, -26 - i * 30, 280, 26, 4, i % 2 ? '#B07A44' : '#C48A50', p) + R(-130, -18 - i * 30, 6, 6, 3, '#5A3A1A', p) + R(120, -18 - i * 30, 6, 6, 3, '#5A3A1A', p); }
    if (tamam > .8) { const p = (tamam - .8) / .2; o += `<path d="M-170 -176 L0 ${-176 - 110 * p} L170 -176Z" fill="#8A3A2A" opacity="${p}"/>`; if (kar) o += `<path d="M-170 -176 L0 ${-176 - 110 * p} L170 -176 L150 -168 L0 ${-170 - 104 * p} L-150 -168Z" fill="#FFFFFF" opacity="${kar * p}"/>`; }
    o += `<path d="M-50 0 L-50 -80 Q0 -130 50 -80 L50 0Z" fill="#2A1A10" opacity="${Math.min(1, tamam * 2)}"/>`;
    return o + '</g>';
  }
  function cekic(x, y, s = 1, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-6, -10, 12, 110, 6, '#8A5A2A') + R(-34, -34, 68, 30, 6, '#5A6070') + R(-34, -34, 68, 8, 4, '#FFFFFF', .25) + '</g>'; }
  function vetKapi(x, y, s = 1, acik = 0) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-170, -420, 340, 420, 10, '#E8EEF4') + R(-150, -340, 300, 340, 6, '#2A3456');
    o += `<g transform="translate(-130 0) scale(${1 - acik * .8} 1)">` + R(0, -330, 260, 330, 6, '#4A8AD8') + R(200, -170, 16, 40, 8, '#FFF3D6') + '</g>';
    o += R(-110, -410, 220, 56, 12, '#FFFFFF') + Tm('VETERİNER', 0, -372, 30, '#1E7A4A') + R(130, -404, 14, 44, 3, '#2FBF71') + R(115, -389, 44, 14, 3, '#2FBF71');
    return o + '</g>';
  }
  function gazete(x, y, s = 1, rot = 0) {
    let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-330, -430, 660, 860, 8, '#000', .25) + R(-340, -440, 660, 860, 8, '#FBF7EC');
    o += T_('T.C.', -10, -380, 34, '#8A1C1C', 800) + T_('RESMÎ GAZETE', -10, -320, 72, '#8A1C1C', 900) + R(-300, -290, 580, 6, 3, '#8A1C1C');
    o += Tm('2 AĞUSTOS 2024 · CUMA', -10, -250, 26, '#3A3A3A');
    o += T_('KANUN', -10, -180, 46, '#1A1A1A', 900) + T_('7527 SAYILI KANUN', -10, -130, 34, '#1A1A1A', 800);
    for (let i = 0; i < 12; i++) o += R(-290, -90 + i * 34, i % 4 === 3 ? 380 : 560, 12, 6, '#C8C0AE');
    return o + '</g>';
  }
  function kart(x, y, w, hh, { renk = '#FFFFFF', kenar = null, op = 1 } = {}) { return R(x - w / 2 + 10, y - hh / 2 + 14, w, hh, 30, '#000', .25 * op) + R(x - w / 2, y - hh / 2, w, hh, 30, renk, op) + (kenar ? `<rect x="${x - w / 2 + 4}" y="${y - hh / 2 + 4}" width="${w - 8}" height="${hh - 8}" rx="27" fill="none" stroke="${kenar}" stroke-width="8" opacity="${op}"/>` : ''); }
  function kalkan(x, y, s = 1, renk = C.MAVI) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -110 L90 -76 Q90 40 0 110 Q-90 40 -90 -76Z" fill="${renk}"/><path d="M0 -110 L90 -76 Q90 40 0 110Z" fill="#000" opacity=".15"/><path d="M-36 0 L-8 28 L40 -28" stroke="#FFFFFF" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
  function kalp(x, y, s = 1, renk = C.TURU) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 90 C-110 10 -110 -80 -50 -90 C-20 -95 0 -70 0 -50 C0 -70 20 -95 50 -90 C110 -80 110 10 0 90Z" fill="${renk}"/><ellipse cx="-44" cy="-50" rx="18" ry="12" fill="#FFFFFF" opacity=".35"/></g>`; }
  function pati(x, y, s = 1, rot = 0, renk = '#FFFFFF', op = .2) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}"><ellipse cx="0" cy="10" rx="22" ry="18" fill="${renk}"/>` + [[-22, -16], [-8, -28], [8, -28], [22, -16]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="8" ry="10" fill="${renk}"/>`).join('') + '</g>'; }
  function goz(x, y, s = 1, renk = '#FFFFFF') { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0 Q0 -50 60 0 Q0 50 -60 0Z" fill="${renk}"/><circle cx="0" cy="0" r="22" fill="#0B1433"/><circle cx="8" cy="-8" r="7" fill="#FFFFFF"/></g>`; }
  function kulak(x, y, s = 1, renk = '#FFF3D6', yon = 1) { return `<g transform="translate(${x} ${y}) scale(${s * yon} ${s})"><path d="M-30 50 Q-60 -10 -20 -60 Q30 -100 60 -40 Q80 0 40 30 Q20 46 24 70 Q20 96 -10 90" stroke="${renk}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M-4 -10 Q20 -40 36 -14" stroke="${renk}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`; }
  // dikey zigzag çatlak (x ortası, y0..y1, genlik); kapan: 0..1 genliği sıfırlar
  function catlakYol(x, y0, y1, gen = 40, n = 12, tohum = 3) { let d = `M${x} ${y0}`; for (let i = 1; i <= n; i++) d += ` L${x + (i % 2 ? 1 : -1) * gen * (.5 + h(i + tohum) * .5)} ${y0 + (y1 - y0) * i / n}`; return d; }
  // konuşma balonu (yazılı); kuyruk yönü: 'sol' | 'sag' | 'alt'
  function balonYaz(x, y, satirlar, { fs = 44, renk = '#FFFFFF', yazi = '#0B1433', kuyruk = 'alt', kx = 0, op = 1, sc = 1 } = {}) {
    const w = Math.max(...satirlar.map(s => K.yaziGen(s, fs))) + fs * 1.6, hh = satirlar.length * fs * 1.25 + fs * 1.1;
    let o = `<g transform="translate(${x} ${y}) scale(${sc})" opacity="${op}">` + R(-w / 2 + 8, -hh / 2 + 10, w, hh, 34, '#000', .2) + R(-w / 2, -hh / 2, w, hh, 34, renk);
    if (kuyruk === 'alt') o += `<path d="M${kx - 26} ${hh / 2 - 2} L${kx + 30} ${hh / 2 - 2} L${kx - 10} ${hh / 2 + 50}Z" fill="${renk}"/>`;
    satirlar.forEach((s, i) => o += T_(s, 0, -hh / 2 + fs * .55 + fs * 1.25 * (i + .8), fs, yazi, 900));
    return o + '</g>';
  }
  function takvim(x, y, s = 1, gun = '4', ay = 'EKİM', yirt = 0) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-230, -250, 460, 520, 30, '#000', .25) + R(-240, -260, 460, 520, 30, '#FFFFFF') + R(-240, -260, 460, 120, 30, '#E8505B') + R(-240, -170, 460, 30, 0, '#E8505B');
    o += T_(ay, -10, -168, 64, '#FFFFFF', 900) + T_(gun, -10, 150, 260, '#0B1433', 900);
    [-120, 100].forEach(cx => o += R(cx - 10, -290, 20, 60, 10, '#5A6070'));
    if (yirt < 1) { const p = yirt; o += `<g transform="translate(${-240 + 600 * p} ${-140 + 700 * p * p}) rotate(${70 * p})" opacity="${1 - p}">` + R(0, 0, 460, 400, 0, '#F4F0E6') + T_('3', 230, 290, 260, '#8A90A8', 900) + '</g>'; }
    return o + '</g>';
  }
  return { C, mix, kopek, sokak, lamba, cocuk, yasli, yetiskin, mamaKabi, kulube, cekic, vetKapi, gazete, kart, kalkan, kalp, pati, goz, kulak, catlakYol, balonYaz, takvim };
})();
