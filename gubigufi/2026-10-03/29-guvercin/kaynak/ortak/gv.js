/* #29 Güvercin — GV: gerçekçi kaya güvercini (gri-mavi gövde, iki koyu kanat bandı, yeşil-mor boyun parlaklığı, turuncu-kırmızı göz, pembe-kırmızı ayak)
   Yan görünüş (sağa bakar): guvercin(x, y, s, {basDx, basDy, adim}) — (x,y) = gövde altı/ayak hizası; baş boynun ucunda ayrı konumlanır (kafa sabitleme animasyonu için). */
const GV = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  let n = 0; const id = p => `gv${p}${++n}`;
  const K = { govde: '#9AA3B8', govdeK: '#7C859C', kanat: '#B4BCCD', bant: '#3E4558', kuyruk: '#5E6678', boyunY: '#3FA27A', boyunM: '#8A5AA8', bas: '#8890A6', gaga: '#3A3A44', burun: '#F2EEE6', goz: '#F28A2A', ayak: '#E8606A' };
  // yürüme modeli: tutma (hold) %70, itme (thrust) %30; döner { gx: gövde x, bx: baş dünya x }
  function yuru(t, x0, v, P = .5, { sabit = false } = {}) {
    const gx = x0 + v * t; if (sabit) return { gx, bx: gx + 0, faz: 'tut', f: (t / P) % 1 };
    const k = Math.floor(t / P), f = t / P - k, L = v * P;
    const e = f < .7 ? 0 : (q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2)((f - .7) / .3);
    const bx = x0 + L * k + L * e + L * .55; // ortalama: baş gövdenin biraz önünde
    return { gx, bx, faz: f < .7 ? 'tut' : 'it', f };
  }
  // ekran koordinatlı yürüme: döner { gx, basX (baş merkezi), faz }; baş, gövdeye göre ±L/2 salınır ama dünyada tutma fazında SABİT
  function yurur(t, x0, v, s, P = .5) { const gx = x0 + v * t, k = Math.floor(t / P), f = t / P - k, L = v * P;
    const e = f < .7 ? 0 : (q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2)((f - .7) / .3);
    return { gx, basX: x0 + L * (k + e) + 78 * s - .35 * L, faz: f < .7 ? 'tut' : 'it', f }; }
  function guvercin(x, y, s = 1, { basX = null, basDy = 0, adim = 0, yon = 1, gozBak = 0, gagala = 0 } = {}) {
    const S = s; let o = `<g transform="translate(${x} ${y}) scale(${yon * S} ${S})">`;
    const hx = basX == null ? 78 : (basX - x) / S * yon, hy = -150 + basDy + gagala * 70;
    o += `<ellipse cx="0" cy="4" rx="78" ry="12" fill="#000" opacity=".18"/>`;
    // bacaklar (adım fazı)
    const a1 = Math.sin(adim * Math.PI * 2) * 16, a2 = -a1;
    [[-6, a1], [16, a2]].forEach(([lx, d]) => o += `<path d="M${lx} -40 L${lx + d} 0" stroke="${K.ayak}" stroke-width="7" stroke-linecap="round"/><path d="M${lx + d - 10} 0 h22 M${lx + d} 0 l-6 -6" stroke="${K.ayak}" stroke-width="5" stroke-linecap="round"/>`);
    // kuyruk + gövde
    o += `<path d="M-60 -60 L-140 -46 L-138 -30 L-56 -34Z" fill="${K.kuyruk}"/><path d="M-138 -46 L-140 -30" stroke="#2E3240" stroke-width="10"/>`;
    o += `<path d="M-72 -50 Q-66 -112 6 -116 Q58 -116 76 -84 Q86 -46 40 -30 Q-30 -22 -72 -50Z" fill="${K.govde}"/><path d="M40 -112 Q84 -100 82 -62 Q74 -36 44 -32 Q66 -60 40 -112Z" fill="${K.govdeK}" opacity=".35"/>`;
    o += `<path d="M-62 -52 Q-44 -98 14 -102 Q44 -100 34 -70 Q14 -46 -62 -52Z" fill="${K.kanat}"/><path d="M-38 -64 Q-8 -74 22 -72" stroke="${K.bant}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-48 -54 Q-16 -62 16 -60" stroke="${K.bant}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    o += `<path d="M-62 -52 L-94 -44 L-62 -40Z" fill="${K.govdeK}"/>`;
    // boyun: ense ve gerdan kenarları ayrı eğriler, parlak yeşil-mor
    const g = id('bn');
    o += `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${K.bas}"/><stop offset=".3" stop-color="${K.boyunY}"/><stop offset=".7" stop-color="${K.boyunM}"/><stop offset="1" stop-color="${K.govde}"/></linearGradient></defs>`;
    o += `<path d="M18 -108 Q${hx - 30} ${(hy - 108) / 2 + 4} ${hx - 20} ${hy + 4} L${hx + 14} ${hy + 18} Q${hx + 14} ${(hy - 60) / 2 + 14} 72 -72 Q50 -96 18 -108Z" fill="url(#${g})"/>`;
    // baş
    o += `<circle cx="${hx}" cy="${hy}" r="26" fill="${K.bas}"/><path d="M${hx + 20} ${hy - 4} L${hx + 52} ${hy + 4} L${hx + 20} ${hy + 10}Z" fill="${K.gaga}"/><ellipse cx="${hx + 24}" cy="${hy - 4}" rx="7" ry="5" fill="${K.burun}"/>`;
    o += `<circle cx="${hx + 4}" cy="${hy - 6}" r="8.5" fill="${K.goz}"/><circle cx="${hx + 5 + gozBak * 2}" cy="${hy - 6}" r="4" fill="#111"/><circle cx="${hx + 3}" cy="${hy - 9}" r="1.8" fill="#FFF"/>`;
    return o + '</g>';
  }
  // tepeden baş + görüş alanları (ileri = yukarı). Açılar SVG (saat yönü): ileri -90.
  function gorusAlani(x, y, R0, p = 1, { vurguOn = 0, vurguKor = 0 } = {}) {
    const yay = (a0, a1, renk, op) => { const r = R0 * p; const x0 = x + Math.cos(a0 * Math.PI / 180) * r, y0 = y + Math.sin(a0 * Math.PI / 180) * r, x1 = x + Math.cos(a1 * Math.PI / 180) * r, y1 = y + Math.sin(a1 * Math.PI / 180) * r; const buyuk = Math.abs(a1 - a0) > 180 ? 1 : 0, sw = a1 > a0 ? 1 : 0; return `<path d="M${x} ${y} L${x0} ${y0} A${r} ${r} 0 ${buyuk} ${sw} ${x1} ${y1}Z" fill="${renk}" opacity="${op}"/>`; };
    let o = yay(-75, -260, '#4A8AD8', .32) + yay(-105, 80, '#F2B630', .32);
    o += yay(-105, -75, '#2FBF71', .35 + .4 * vurguOn);
    o += yay(80, 100, '#1B1F3A', .55 + .35 * vurguKor);
    return o;
  }
  function basUstten(x, y, s = 1) { return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="40" rx="70" ry="90" fill="${K.govde}"/><path d="M-60 60 Q0 140 60 60 L40 130 L-40 130Z" fill="${K.kanat}"/><ellipse cx="0" cy="-20" rx="44" ry="50" fill="${K.bas}"/><path d="M-14 -62 L0 -104 L14 -62Z" fill="${K.gaga}"/><ellipse cx="0" cy="-66" rx="10" ry="8" fill="${K.burun}"/><circle cx="-40" cy="-20" r="11" fill="${K.goz}"/><circle cx="-43" cy="-20" r="5" fill="#111"/><circle cx="40" cy="-20" r="11" fill="${K.goz}"/><circle cx="43" cy="-20" r="5" fill="#111"/></g>`; }
  function park(T, zY = 1150) { let o = `<rect width="1080" height="1920" fill="#BFE3F0"/>` + `<circle cx="860" cy="430" r="90" fill="#FFF3C4" opacity=".9"/>`;
    o += `<path d="M0 ${zY - 260} Q200 ${zY - 340} 420 ${zY - 280} T860 ${zY - 300} T1080 ${zY - 270} V${zY} H0Z" fill="#8CC06A"/>`;
    [[120, zY - 230, 1.1], [330, zY - 260, .9], [760, zY - 250, 1.2], [960, zY - 230, .9]].forEach(([x, y, k]) => o += R(x - 10 * k, y, 20 * k, 90 * k, 6, '#7A5232') + `<circle cx="${x}" cy="${y - 30 * k}" r="${80 * k}" fill="#5E9A4A"/><circle cx="${x - 30 * k}" cy="${y - 10 * k}" r="${50 * k}" fill="#6AAA54"/>`);
    o += R(0, zY - 30, 1080, 1950 - zY, 0, '#C8C0B0');
    for (let i = 0; i < 9; i++) o += R(i * 130 - 20, zY - 30, 4, 1950 - zY, 0, '#B0A898');
    o += R(0, zY - 34, 1080, 8, 0, '#A89E90');
    return o; }
  function kamera(x, y, s, rec = 1) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-90, -60, 180, 120, 18, '#2A2E40') + `<circle cx="10" cy="0" r="44" fill="#1B1F2A"/><circle cx="10" cy="0" r="30" fill="#3A5A9C"/><circle cx="0" cy="-10" r="10" fill="#FFFFFF" opacity=".5"/>` + R(-80, -86, 60, 30, 8, '#2A2E40') + (rec ? `<circle cx="-62" cy="-40" r="9" fill="#E8323C"/>` : '') + '</g>'; }
  function polaroid(x, y, s, rot, ic) { return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` + R(-80, -90, 160, 190, 6, '#000', .2) + R(-86, -96, 160, 190, 6, '#FFFDF6') + R(-74, -84, 136, 126, 4, '#BFE3F0') + ic + '</g>'; }
  function cicek(x, y, s, uv = 0) { let o = `<g transform="translate(${x} ${y}) scale(${s})">`; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; o += `<ellipse cx="${Math.cos(a) * 70}" cy="${Math.sin(a) * 70}" rx="54" ry="22" transform="rotate(${a * 57.3} ${Math.cos(a) * 70} ${Math.sin(a) * 70})" fill="${uv ? '#B89AE8' : '#FFD23F'}"/>`; if (uv) o += `<ellipse cx="${Math.cos(a) * 40}" cy="${Math.sin(a) * 40}" rx="28" ry="14" transform="rotate(${a * 57.3} ${Math.cos(a) * 40} ${Math.sin(a) * 40})" fill="#3A1A6A"/>`; }
    return o + `<circle r="${uv ? 34 : 40}" fill="${uv ? '#1A0A3A' : '#8A5A20'}"/></g>`; }
  return { K, yuru, yurur, guvercin, gorusAlani, basUstten, park, kamera, polaroid, cicek, R, T_, Tm, cl };
})();