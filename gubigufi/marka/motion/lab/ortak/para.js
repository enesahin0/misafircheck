/* #14 Altı Sıfır — sahne eşyaları (PR). Referans tarz: flat, kontursuz, tonal gölge + açık rim. */
const PR = (() => {
  let n = 0; const id = p => `pr${p}${++n}`;
  const R = (x, y, w, h, r, f, op = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" opacity="${op}"/>`;
  const T_ = (s, x, y, fs, renk, w = 900, ek = '') => `<text x="${x}" y="${y}" font-size="${fs}" font-weight="${w}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
  const Tm = (s, x, y, fs, renk, ek = '') => `<text class="mono" x="${x}" y="${y}" font-size="${fs}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
  const PAL = { eski: ['#C9A2D8', '#7B4E96', '#F3E6F7'], yesil: ['#A8D5A0', '#3E7A4E', '#EAF6E4'], mavi: ['#9CC6E8', '#2E5A8C', '#E6F1FA'], turuncu: ['#F6C08A', '#B0602E', '#FFF1E0'], yeni: ['#F2A0A8', '#A8384A', '#FFEAEC'] };
  // banknot (kendi tasarımımız): deger metni, birim; w genişlik, merkez (x,y)
  function banknot(x, y, w, { deger = '20.000.000', birim = 'LİRA', pal = 'eski', rot = 0, ust = 'TÜRK LİRASI', vurguSifir = -1 } = {}) {
    const [a, k, c] = PAL[pal] || PAL.eski, h = w * .5, s = w / 600;
    let o = `<g transform="translate(${x} ${y}) rotate(${rot})">` + R(-w / 2 + 6 * s, -h / 2 + 8 * s, w, h, 18 * s, '#000', .18) + R(-w / 2, -h / 2, w, h, 18 * s, a) + R(-w / 2 + 16 * s, -h / 2 + 16 * s, w - 32 * s, h - 32 * s, 12 * s, c, .55);
    for (let i = 0; i < 9; i++) o += `<circle cx="${-w * .3}" cy="${0}" r="${(18 + i * 11) * s}" fill="none" stroke="${k}" stroke-width="${2.2 * s}" opacity="${.35 - i * .03}"/>`;
    o += `<circle cx="${-w * .3}" cy="0" r="${62 * s}" fill="${k}" opacity=".85"/>`;
    for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2; o += `<ellipse cx="${-w * .3 + Math.cos(an) * 30 * s}" cy="${Math.sin(an) * 30 * s}" rx="${16 * s}" ry="${7 * s}" transform="rotate(${an * 57.3} ${-w * .3 + Math.cos(an) * 30 * s} ${Math.sin(an) * 30 * s})" fill="${c}" opacity=".8"/>`; }
    o += Tm(ust, w * .12, -h * .26, 22 * s, k, `letter-spacing="${4 * s}"`);
    // değer: sıfırları tek tek (vurguSifir: kaçıncı sıfırdan itibaren vurgula)
    const fs = Math.min(84 * s, (w * .56) / Math.max(4, deger.length * .6)); o += T_(deger, w * .14, h * .1, fs, k);
    o += Tm(birim, w * .14, h * .32, 28 * s, k, `letter-spacing="${6 * s}"`);
    o += `<circle cx="${w * .42}" cy="${-h * .3}" r="${14 * s}" fill="${k}" opacity=".5"/>` + R(w * .3, h * .22, w * .14, 10 * s, 5 * s, k, .35);
    return o + '</g>';
  }
  function tomar(x, y, s, n = 8, pal = 'eski') { // y = taban
    let o = `<g transform="translate(${x} ${y}) scale(${s})">`; const [a, k, c] = PAL[pal];
    for (let i = 0; i < n; i++) o += R(-110 + (i % 2) * 6, -24 - i * 22, 220, 26, 6, i % 2 ? a : c) + R(-110 + (i % 2) * 6, -24 - i * 22 + 18, 220, 8, 3, k, .25);
    o += R(-18, -24 - n * 22, 36, n * 22 + 24, 6, '#E8505B') + R(-18, -24 - n * 22, 12, n * 22 + 24, 4, '#FFFFFF', .2);
    return o + '</g>';
  }
  // İstanbul-vari sokak: apartman cepheleri, tenteler, sokak lambası, ağaç; kaldırım y=zY
  function sokak(T, t = 0, zY = 1330) {
    const g = id('sk'); let o = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.isik}"/><stop offset="1" stop-color="${T.fon1}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${g})"/>`;
    o += CV.bulut(180 + (t * 12) % 60, 170, .8) + CV.bulut(820 - (t * 8) % 40, 110, .6);
    const bina = [[-20, 360, 300, T.fon2], [270, 250, 280, T.orta], [540, 330, 280, T.fon2], [810, 220, 300, T.koyu]];
    bina.forEach(([bx, by, bw, r], i) => { o += R(bx, by, bw, zY - by, 0, r) + R(bx, by - 26, bw, 30, 6, T.cokKoyu, .6);
      for (let yy = by + 50; yy < zY - 280; yy += 130) for (let xx = bx + 34; xx < bx + bw - 60; xx += 90) o += R(xx, yy, 56, 84, 8, T.isik, .9) + R(xx, yy + 40, 56, 6, 0, r, .6) + R(xx - 6, yy + 84, 68, 10, 4, T.cokKoyu, .4);
      // dükkân + tente
      const tr = [T.vurgu, T.vurgu2, T.vurgu, T.vurgu2][i]; o += R(bx + 20, zY - 230, bw - 40, 230, 6, T.cokKoyu, .75) + R(bx + 40, zY - 200, bw - 80, 150, 6, T.isik, .5);
      for (let j = 0; j < 6; j++) o += `<path d="M${bx + 10 + j * (bw - 20) / 6} ${zY - 270} h${(bw - 20) / 6} l-10 60 h${-(bw - 20) / 6 + 20}Z" fill="${j % 2 ? tr : '#FFF6E6'}"/>`; });
    o += R(0, zY, 1080, 1920 - zY, 0, T.acik) + R(0, zY, 1080, 16, 0, T.koyu, .4) + R(0, zY + 170, 1080, 1920 - zY - 170, 0, '#6B6A78');
    for (let i = 0; i < 6; i++) o += R(i * 200 + 60, zY + 300, 110, 14, 7, '#FFFFFF', .55);
    // sokak lambası
    o += R(96, zY - 520, 14, 520, 7, T.cokKoyu) + `<path d="M103 ${zY - 520} q0 -40 50 -40" stroke="${T.cokKoyu}" stroke-width="12" fill="none"/>` + `<ellipse cx="160" cy="${zY - 552}" rx="34" ry="18" fill="${T.cokKoyu}"/><circle cx="160" cy="${zY - 540}" r="14" fill="#FFE9A8"/>`;
    return o;
  }
  function simit(x, y, r, rot = 0) { return `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .82}" fill="#B8642A"/><ellipse cx="${x - r * .1}" cy="${y - r * .1}" rx="${r * .88}" ry="${r * .7}" fill="#D98A3C"/><ellipse cx="${x}" cy="${y}" rx="${r * .38}" ry="${r * .3}" fill="#8E4A20"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => { const a = i * .9; return `<circle cx="${x + Math.cos(a) * r * .66}" cy="${y + Math.sin(a) * r * .54}" r="${r * .05}" fill="#FFF3D6"/>`; }).join('') + `</g>`; }
  function simitTezgah(x, y, s, T, adet = 12) { // y = tekerlek tabanı
    let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
    o += `<circle cx="-120" cy="-40" r="40" fill="${T.cokKoyu}"/><circle cx="-120" cy="-40" r="16" fill="#C9C2B4"/><circle cx="120" cy="-40" r="40" fill="${T.cokKoyu}"/><circle cx="120" cy="-40" r="16" fill="#C9C2B4"/>`;
    o += R(-200, -250, 400, 190, 20, '#C8323C') + R(-200, -250, 400, 30, 14, '#E8505B') + R(-190, -110, 380, 16, 8, '#8E1B2F', .5);
    o += R(-180, -470, 360, 230, 16, '#EAF6FA', .55) + R(-180, -470, 360, 230, 16, 'none') + `<rect x="-180" y="-470" width="360" height="230" rx="16" fill="none" stroke="#C8323C" stroke-width="14"/>` + R(-172, -300, 344, 8, 4, '#C8323C', .6);
    for (let i = 0; i < adet; i++) { const r = i < 6 ? 0 : 1; o += simit(-130 + (i % 6) * 52, -272 - r * 80 - (i % 2) * 6, 34); }
    o += R(-200, -505, 400, 40, 14, '#C8323C') + T_('SİMİT', 0, -474, 34, '#FFF3E0');
    return o + '</g>';
  }
  function cuzdan(x, y, s, acik = 0, renk = '#6B3A2A') {
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-170, -10, 340, 200, 26, renk) + R(-160, 0, 320, 18, 9, '#FFFFFF', .12) +
      `<g transform="rotate(${-150 * acik} -170 -10)">` + R(-170, -10 - 190, 340, 190, 26, '#8A4E3A') + R(-150, -180, 300, 12, 6, '#FFFFFF', .12) + `</g>` + `<circle cx="150" cy="80" r="18" fill="#D8A032"/></g>`;
  }
  function dovizTabela(x, y, s, satirlar, T) { // satirlar: [[etiket, deger, renk], ...]
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-290, -40, 580, 90 + satirlar.length * 110, 26, '#1B1F3A') + R(-270, -20, 540, 60, 14, T.vurgu2) + Tm('DÖVİZ KURU · 2004', 0, 20, 30, '#1B1F3A', 'letter-spacing="4"');
    satirlar.forEach(([e, d, r], i) => { const yy = 110 + i * 110; o += R(-270, yy - 50, 540, 94, 14, '#2A2F55') + Tm(e, -170, yy + 14, 44, '#FFF3E0') + `<text class="mono" x="250" y="${yy + 14}" font-size="46" text-anchor="end" style="fill:${r || '#7CFFB0'}">${d}</text>`; });
    return o + '</g>';
  }
  // market rafları (arka plan)
  function market(T, zY = 1250) {
    let o = `<rect width="1080" height="1920" fill="${T.fon1}"/>` + R(0, 0, 1080, 90, 0, T.orta) + R(0, 90, 1080, 14, 0, T.koyu, .4);
    for (let i = 0; i < 9; i++) o += `<path d="M${i * 130} 104 l65 40 l65 -40Z" fill="${i % 2 ? T.vurgu : T.vurgu2}"/>`;
    const renk = ['#E8505B', '#FFB44C', '#2E9A9C', '#6CC04A', '#8A6FE0', '#F28F6A', '#FFE45C', '#3D8BFD'];
    for (const [sx, sw] of [[20, 480], [580, 480]]) { o += R(sx, 230, sw, zY - 230, 12, T.koyu) + R(sx + 14, 244, sw - 28, zY - 258, 8, T.orta);
      for (let r = 0; r < 4; r++) { const ry = 400 + r * 210; o += R(sx + 14, ry, sw - 28, 18, 4, T.cokKoyu);
        for (let k = 0; k < 7; k++) { const c = renk[(k * 3 + r + (sx > 100 ? 2 : 0)) % 8], px = sx + 34 + k * 62, tip = (k + r) % 3;
          if (tip === 0) o += R(px, ry - 120, 48, 120, 8, c) + R(px + 6, ry - 90, 36, 40, 4, '#FFFFFF', .7);
          else if (tip === 1) o += R(px + 8, ry - 150, 32, 150, 12, c) + R(px + 16, ry - 175, 16, 30, 4, c) + R(px + 10, ry - 100, 28, 30, 4, '#FFFFFF', .6);
          else o += `<ellipse cx="${px + 24}" cy="${ry - 40}" rx="26" ry="40" fill="${c}"/>` + R(px + 12, ry - 60, 24, 20, 4, '#FFFFFF', .6); } } }
    o += R(0, zY, 1080, 1920 - zY, 0, T.acik);
    for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) if ((i + j) % 2) o += R(i * 160, zY + j * 140, 160, 140, 0, T.fon2, .5);
    return o;
  }
  function kasa(x, y, s, T, ekran = '') { // y = tezgâh üstü
    return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-150, -150, 300, 150, 20, '#3A3F5C') + R(-150, -150, 300, 26, 12, '#51577A') + R(-120, -120, 240, 80, 10, '#262A40') +
      [0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => R(-110 + c * 46, -118 + r * 20, 36, 14, 4, (r + c) % 4 ? '#8B92B8' : T.vurgu2)).join('')).join('') +
      R(-90, -270, 180, 110, 12, '#3A3F5C') + R(-76, -256, 152, 70, 8, '#0F2A1E') + (ekran ? Tm(ekran, 0, -208, 34, '#7CFFB0') : '') + R(-14, -160, 28, 14, 4, '#3A3F5C') + '</g>';
  }
  // uzayan fiş (kasadan yukarı değil aşağı sarkar): x, y üst; uzunluk px
  function fis(x, y, uzunluk, satirlar = [], fs = 26) {
    let o = R(x - 90, y, 180, uzunluk, 4, '#FFFDF6') + R(x - 90, y, 12, uzunluk, 0, '#000', .05);
    let zz = ''; for (let i = 0; i < 9; i++) zz += `l10 14 l10 -14`; o += `<path d="M${x - 90} ${y + uzunluk} ${zz} v-2 h-180Z" fill="#FFFDF6"/>`;
    satirlar.forEach((s, i) => { const yy = y + 40 + i * 40; if (yy < y + uzunluk - 10) o += `<text class="mono" x="${x + 76}" y="${yy}" font-size="${fs}" text-anchor="end" style="fill:#3A3F5C">${s}</text>`; });
    return o;
  }
  function hesapMakinesi(x, y, s, ekran = '0', { hata = 0, renk = '#2E3350' } = {}) {
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-150, -210, 300, 420, 34, '#000', .15) + R(-160, -220, 300, 420, 34, renk) + R(-160, -220, 300, 20, 14, '#FFFFFF', .12);
    o += R(-136, -194, 252, 90, 12, hata > 0 ? '#E9B8B0' : '#BFD8B8') + `<text class="mono" x="104" y="-132" font-size="44" text-anchor="end" style="fill:#1E2A1E">${ekran}</text>`;
    const tus = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'];
    tus.forEach((k, i) => { const c = i % 4, r = Math.floor(i / 4), bx = -136 + c * 64, by = -84 + r * 70; o += R(bx, by, 54, 58, 12, c === 3 ? '#FFB44C' : '#4A5078') + T_(k, bx + 27, by + 40, 30, '#FFF3E0', 700); });
    return o + '</g>';
  }
  // büyük kitap (açık): sol/sağ sayfa içerikleri (merkez 0,0'a göre) — acik 0..1
  function kitap(x, y, s, acik = 1, sol = '', sag = '', kapak = '#C8323C') {
    const a = Math.max(0, Math.min(1, acik));
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + `<ellipse cx="0" cy="170" rx="${340 * (.5 + .5 * a)}" ry="26" fill="#000" opacity=".18"/>`;
    if (a < .5) { const k = 1 - a * 2; o += R(-10, -170, 300, 340, 16, kapak) + `<g transform="translate(-10 0) scale(${k} 1) translate(10 0)">` + R(-10, -170, 300, 340, 16, kapak) + R(20, -140, 240, 90, 10, '#FFC24C') + Tm('REKORLAR', 140, -104, 34, kapak) + Tm('KİTABI', 140, -64, 34, kapak) + `<circle cx="140" cy="60" r="60" fill="#FFC24C" opacity=".8"/>` + T_('★', 140, 84, 70, kapak) + '</g>'; }
    else { o += R(-330, -180, 660, 360, 18, kapak) + `<path d="M0 -168 Q-160 -190 -318 -164 L-318 168 Q-160 150 0 172Z" fill="#FFF8EC"/><path d="M0 -168 Q160 -190 318 -164 L318 168 Q160 150 0 172Z" fill="#FFFDF4"/>` + R(-6, -170, 12, 344, 6, '#E5D8BE') + `<g opacity="${(a - .5) * 2}">${sol}${sag}</g>`; }
    return o + '</g>';
  }
  function kursu(x, y, s, T, yazi = '') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-150, -260, 300, 260, 16, T.cokKoyu) + R(-170, -290, 340, 44, 14, T.koyu) + R(-120, -200, 240, 120, 10, T.vurgu, .85) + (yazi ? Tm(yazi, 0, -130, 34, '#FFF3E0') : '') + '</g>'; }
  function mikrofon(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-6, -200, 12, 200, 6, '#3A3F5C') + `<ellipse cx="0" cy="0" rx="60" ry="14" fill="#3A3F5C"/><rect x="-22" y="-260" width="44" height="70" rx="22" fill="#5A607E"/><rect x="-22" y="-260" width="44" height="30" rx="15" fill="#8B92B8"/></g>`; }
  function makas(x, y, s, acik = .5, rot = 0) { const a = 8 + 22 * acik;
    const kol = (k) => `<g transform="rotate(${k * a})"><path d="M0 -10 L300 -4 Q320 0 300 6 L0 12Z" fill="#C9D2E0"/><path d="M0 -10 L300 -4 L300 0 L0 0Z" fill="#FFFFFF" opacity=".5"/><path d="M0 -6 L-40 ${k * 30}" stroke="#E8505B" stroke-width="20" stroke-linecap="round"/><ellipse cx="-80" cy="${k * 44}" rx="52" ry="36" fill="none" stroke="#E8505B" stroke-width="20"/><ellipse cx="-72" cy="${k * 38}" rx="40" ry="24" fill="none" stroke="#FF8A8F" stroke-width="5" opacity=".7"/></g>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${kol(-1)}${kol(1)}<circle cx="0" cy="0" r="14" fill="#3A3F5C"/></g>`; }
  function sifir(x, y, fs, renk = '#7B4E96', rot = 0, op = 1) { return `<g transform="rotate(${rot} ${x} ${y})" opacity="${op}">` + T_('0', x, y + fs * .35, fs, renk) + '</g>'; }
  function fisek(x, y, t, t0, renk = '#FFE45C', r = 220) { const d = t - t0; if (d < 0 || d > 1.6) return ''; let o = '';
    if (d < .45) { const q = d / .45; return `<circle cx="${x}" cy="${y + 600 * (1 - q)}" r="8" fill="${renk}"/><path d="M${x} ${y + 600 * (1 - q)} l0 60" stroke="${renk}" stroke-width="5" opacity=".5"/>`; }
    const p = (d - .45) / 1.15, rr = r * (1 - Math.pow(1 - p, 3)), op = 1 - p;
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; o += `<circle cx="${x + Math.cos(a) * rr}" cy="${y + Math.sin(a) * rr + 60 * p * p}" r="${9 * (1 - p) + 2}" fill="${renk}" opacity="${op}"/>`; }
    return o + `<circle cx="${x}" cy="${y}" r="${rr * .5}" fill="${renk}" opacity="${.25 * op}"/>`; }
  function takvim(x, y, s, ust, alt, renk = '#E8505B') { return `<g transform="translate(${x} ${y}) scale(${s})">` + R(-150, -170, 300, 340, 22, '#000', .15) + R(-160, -180, 300, 340, 22, '#FFFDF6') + R(-160, -180, 300, 100, 22, renk) + R(-160, -110, 300, 30, 0, renk) +
      `<circle cx="-90" cy="-180" r="12" fill="#3A3F5C"/><circle cx="70" cy="-180" r="12" fill="#3A3F5C"/>` + Tm(ust, -10, -112, 36, '#FFF3E0', 'letter-spacing="3"') + T_(alt, -10, 100, 130, '#1B1640') + '</g>'; }
  // terazi: egim derece (+ sağ aşağı). Kefe merkezleri döner: {svg, sol:[x,y], sag:[x,y]}
  function terazi(x, y, s, egim = 0, T) { // y = taban
    const L = 330 * s, a = egim * Math.PI / 180, py = y - 520 * s, sx = x - Math.cos(a) * L, sy = py - Math.sin(a) * L, rx = x + Math.cos(a) * L, ry = py + Math.sin(a) * L, ip = 170 * s;
    const kefe = (cx, cy) => `<path d="M${cx} ${cy} L${cx - 120 * s} ${cy + ip} M${cx} ${cy} L${cx + 120 * s} ${cy + ip}" stroke="${T.cokKoyu}" stroke-width="${5 * s}"/><path d="M${cx - 150 * s} ${cy + ip} Q${cx} ${cy + ip + 70 * s} ${cx + 150 * s} ${cy + ip}Z" fill="#D8A032"/><path d="M${cx - 150 * s} ${cy + ip} h${300 * s}" stroke="#F2CE7A" stroke-width="${8 * s}"/>`;
    let o = `<ellipse cx="${x}" cy="${y}" rx="${200 * s}" ry="${24 * s}" fill="#000" opacity=".15"/>` + R(x - 150 * s, y - 50 * s, 300 * s, 50 * s, 20 * s, '#B0802A') + R(x - 22 * s, py, 44 * s, y - py - 40 * s, 14 * s, '#D8A032') + R(x - 6 * s, py, 12 * s, y - py - 40 * s, 6, '#F2CE7A', .6);
    o += `<path d="M${sx} ${sy} L${rx} ${ry}" stroke="#D8A032" stroke-width="${26 * s}" stroke-linecap="round"/>` + `<circle cx="${x}" cy="${py}" r="${34 * s}" fill="#B0802A"/><circle cx="${x}" cy="${py}" r="${14 * s}" fill="#F2CE7A"/>` + `<path d="M${x} ${py - 30 * s} L${x - 20 * s} ${py - 90 * s} L${x + 20 * s} ${py - 90 * s}Z" fill="#E8505B"/>`;
    return { svg: o + kefe(sx, sy) + kefe(rx, ry), sol: [sx, sy + ip + 10 * s], sag: [rx, ry + ip + 10 * s] };
  }
  function tabela(x, y, w, h, yazi, T, { fs = 60, renk = '#1B1F3A', zemin = '#FFC24C' } = {}) { return R(x - w / 2 + 8, y - h / 2 + 10, w, h, 18, '#000', .18) + R(x - w / 2, y - h / 2, w, h, 18, renk) + R(x - w / 2 + 14, y - h / 2 + 14, w - 28, h - 28, 10, zemin) + (yazi ? T_(yazi, x, y + fs * .35, fs, renk) : ''); }
  function cekmece(x, y, s, acik = 0, T, ic = '') { // y = zemin
    let o = `<g transform="translate(${x} ${y}) scale(${s})">` + R(-240, -440, 480, 440, 20, T.koyu) + R(-240, -460, 480, 40, 14, T.cokKoyu) + R(-226, -30, 40, 30, 6, T.cokKoyu) + R(186, -30, 40, 30, 6, T.cokKoyu);
    o += R(-210, -400, 420, 160, 12, T.orta) + `<circle cx="0" cy="-320" r="16" fill="#F2CE7A"/>`;
    const d = 150 * acik; o += R(-210, -220, 420, 170, 12, T.cokKoyu, .6) + `<g transform="translate(0 ${d * .35})">${ic}</g>` + R(-220, -220 + d * .35, 440, 60, 10, T.orta) + R(-220, -170 + d * .35, 440, 130, 12, T.orta) + `<circle cx="0" cy="${-110 + d * .35}" r="16" fill="#F2CE7A"/>` + R(-220, -220 + d * .35, 440, 10, 5, '#FFFFFF', .2);
    return o + '</g>';
  }
  return { banknot, tomar, sokak, simit, simitTezgah, cuzdan, dovizTabela, market, kasa, fis, hesapMakinesi, kitap, kursu, mikrofon, makas, sifir, fisek, takvim, terazi, tabela, cekmece, PAL, R, T_, Tm };
})();
