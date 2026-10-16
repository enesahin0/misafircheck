/* #15 detay planlar (insert) — DP.sar ile kullanılır */
const MYD = (() => {
  const R = PR.R, T_ = PR.T_, Tm = PR.Tm, h = HK.hash;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ar = (t, a, b) => cl((t - a) / (b - a));
  const bul = (s, px) => `<g style="filter:blur(${px}px)">${s}</g>`;
  const vin = (r = '#10201A', g = .5) => `<defs><radialGradient id="myv"><stop offset=".55" stop-color="${r}" stop-opacity="0"/><stop offset="1" stop-color="${r}" stop-opacity="${g}"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#myv)"/>`;
  const cipO = (s, x, y, renk, yazi, fs = 40) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
  // yabani muz kesiti: çekirdekler sırayla belirir; 'SERT' ve 'İRİ ÇEKİRDEK' çipleri
  function yabani(d, tSert = 1.5, tIri = 2.3) {
    let o = `<rect width="1080" height="1920" fill="#2F6A3A"/>` + bul(`<circle cx="200" cy="300" r="260" fill="#6CC04A"/><circle cx="900" cy="500" r="220" fill="#3FA35A"/>`, 30);
    o += R(-40, 520, 1160, 900, 60, '#C8894A') + R(-40, 520, 1160, 40, 30, '#E0A868');
    for (let i = 0; i < 8; i++) o += R(-40, 600 + i * 100, 1160, 4, 2, '#A86A34', .5);
    const yarim = (oy, flip) => { let s = `<g transform="translate(540 ${oy}) scale(1 ${flip})">` + `<path d="M-440 0 Q-400 -180 0 -190 Q400 -180 440 0 Q400 40 0 40 Q-400 40 -440 0Z" fill="#6E9A36"/><path d="M-410 0 Q-380 -150 0 -158 Q380 -150 410 0 Q380 20 0 22 Q-380 20 -410 0Z" fill="#F4E6B8"/>`;
      for (let i = 0; i < 22; i++) { const x = -350 + (i % 11) * 70 + (i > 10 ? 35 : 0), y = i > 10 ? -40 : -100, p = ar(d, .1 + i * .03, .3 + i * .03); if (p <= 0) continue; const r = 24 * p * (1 + .2 * Math.exp(-(d - .3 - i * .03) * 6));
        s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .9}" fill="#1B1410"/><circle cx="${x + r * .3}" cy="${y - r * .35}" r="${r * .25}" fill="#FFFFFF" opacity=".35"/>`; }
      return s + '</g>'; };
    o += yarim(860, 1) + yarim(1080, -1);
    const a = ar(d, tSert, tSert + .3), b = ar(d, tIri, tIri + .3);
    if (a > 0) o += `<g transform="translate(300 560) scale(${a})">` + cipO('SERT', 0, 0, '#1B1640', '#FFE45C', 44) + '</g>';
    if (b > 0) o += `<g transform="translate(700 1240) scale(${b})">` + cipO('İRİ ÇEKİRDEK', 0, 0, '#FFE45C', '#1B1640', 40) + '</g>';
    o += bul(`<g transform="translate(900 1700) rotate(-30)">${R(-40, -300, 80, 380, 20, '#C9D2E0')}${R(-50, 60, 100, 260, 30, '#3A3F5C')}</g>`, 12);
    return o + vin('#0E2012', .5);
  }
  // eski TV ekranı: çizgi film maymun muz yiyor
  function tvEkran(d, t) {
    let o = `<rect width="1080" height="1920" fill="#3A2016"/>` + R(40, 300, 1000, 1220, 120, '#6A3E26') + R(90, 350, 900, 1120, 100, '#1B1640');
    let e = `<rect x="90" y="350" width="900" height="1120" fill="#FFE45C"/>`;
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + t * .4; e += `<path d="M540 900 L${540 + Math.cos(a) * 1200} ${900 + Math.sin(a) * 1200} L${540 + Math.cos(a + .2) * 1200} ${900 + Math.sin(a + .2) * 1200}Z" fill="#FFB44C" opacity=".6"/>`; }
    e += `<g transform="translate(0 ${-Math.abs(Math.sin(t * 5)) * 30})">` + MY.maymun(540, 1330, 700, { t, duygu: 'mutlu', el: 'agiz', tutar: 'muz' }) + '</g>';
    for (let i = 0; i < 3; i++) { const q = (t * .8 + i / 3) % 1; e += T_('♪', 200 + i * 320, 800 - 300 * q, 90, '#E8505B', 900, `opacity="${1 - q}"`); }
    for (let i = 0; i < 56; i++) e += R(90, 350 + i * 20, 900, 6, 0, '#000', .12);
    o += `<defs><clipPath id="tvE"><rect x="90" y="350" width="900" height="1120" rx="100"/></clipPath></defs><g clip-path="url(#tvE)">${e}<rect x="90" y="350" width="900" height="1120" fill="#FFFFFF" opacity="${.04 + .03 * Math.sin(t * 40)}"/></g>`;
    o += `<path d="M150 400 Q300 370 500 380" stroke="#FFFFFF" stroke-width="18" fill="none" opacity=".25" stroke-linecap="round"/>`;
    return o + vin('#120806', .55);
  }
  // mutlu maymun yüzü yakın plan
  function mutluYuz(d, t) {
    let o = `<rect width="1080" height="1920" fill="#3FA35A"/>` + bul(`<circle cx="180" cy="300" r="300" fill="#8FD65A"/><circle cx="950" cy="1500" r="320" fill="#1F6B4E"/><circle cx="900" cy="250" r="200" fill="#E6F37A" opacity=".6"/>`, 34);
    o += MY.maymun(540, 1820, 1300, { t, duygu: 'mutlu', el: 'yukari', tutar: 'muz', parlak: .8 });
    return o + vin('#0E2012', .45);
  }
  // hayvanat bahçesi tabelası + MUZ YOK levhası
  function tabela(d, t) {
    let o = `<rect width="1080" height="1920" fill="#BFE3C0"/>` + bul(`<circle cx="200" cy="400" r="300" fill="#6CC04A"/><circle cx="950" cy="1200" r="300" fill="#3FA35A"/><rect x="0" y="1500" width="1080" height="420" fill="#86B98A"/>`, 30);
    o += `<g transform="translate(540 860) scale(1.3)">` + MY.bahceTabela(0, 0, 1).replace(/^<g transform="translate\(0 0\) scale\(1\)">/, '<g>') + '</g>';
    const p = ar(d, .35, .7), sw = Math.sin(t * 3) * 4 * p;
    o += `<g transform="translate(540 ${1000}) rotate(${sw}) scale(${p})">` + `<path d="M-120 -60 L-80 0 M120 -60 L80 0" stroke="#6A3E26" stroke-width="8"/>` + R(-230, 0, 460, 240, 26, '#FFFDF6') + MY.muz(-90, 120, 1.1, -10) + `<circle cx="-90" cy="120" r="95" fill="none" stroke="#C8323C" stroke-width="18"/><path d="M-158 52 L-22 188" stroke="#C8323C" stroke-width="18"/>` + T_('MUZ', 110, 110, 64, '#C8323C') + T_('YOK', 110, 180, 64, '#C8323C') + '</g>';
    return o + vin('#10301A', .4);
  }
  return { yabani, tvEkran, mutluYuz, tabela, cipO };
})();
