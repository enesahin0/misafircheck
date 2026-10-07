/* #11 Kendine mikrop içen doktor — tekrar eden çizimler (SVG metni). Işık sağ üstten. Kontur yok.
   ATMOSFER (yeni kural): aydınlık ve renkli — güneşli laboratuvar kreması, 80'ler hastane mint'i, mide içi mercan-pembe, Nobel altın-bordo. */
const D = (() => {
  let n = 0; const id = p => `d${p}${++n}`;
  const P = { krem: '#FFF1DC', krem2: '#FFE3BF', mint: '#CFEDE0', mint2: '#A7DCC6', mintK: '#6FB9A0', pembe: '#FF9AAE', pembe2: '#FF7F98', mercan: '#FF6F7F', iltihap: '#E0344F',
    bakteri: '#8BD448', bakteriK: '#5FA72C', sivi: '#C9C77A', sivi2: '#A9A55C', altin: '#F4C542', altinK: '#C9951E', bordo: '#8E2B4A', lacivert: '#1B1640', ahsap: '#E2A868', ahsapK: '#C48445' };
  function zemin(ust, alt, isik = null) {
    const g = id('zg'); let o = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#${g})"/>`;
    if (isik) o += K.glow({ x: isik[0], y: isik[1], r: isik[2] || 700, renk: isik[3] || '#FFFFFF', guc: isik[4] || .45 });
    return o;
  }
  // güneşli pencere (sağ üst) + ışık hüzmesi
  function pencere(x, y, w, h, gok = '#9FD8F2') {
    return `<rect x="${x - 16}" y="${y - 16}" width="${w + 32}" height="${h + 32}" rx="26" fill="#FFFFFF"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${gok}"/>` +
      `<circle cx="${x + w * .72}" cy="${y + h * .3}" r="${w * .16}" fill="#FFE27A"/><rect x="${x + w / 2 - 6}" y="${y}" width="12" height="${h}" fill="#FFFFFF"/><rect x="${x}" y="${y + h / 2 - 6}" width="${w}" height="12" fill="#FFFFFF"/>` +
      `<path d="M${x} ${y + h} L${x + w} ${y + h} L${x + w - 380} ${y + h + 900} L${x - 380} ${y + h + 900}Z" fill="#FFFFFF" opacity=".16"/>`;
  }
  // sarmal bakteri (H. pylori: kıvrımlı gövde + tek uçta 4 kamçı)
  function bakteri(x, y, s = 1, t = 0, rot = 0, renk = P.bakteri, op = 1) {
    let d = '', dk = ''; const L = 120, A = 14;
    for (let i = 0; i <= 24; i++) { const u = i / 24, px = -L / 2 + u * L, py = Math.sin(u * Math.PI * 3 + t * 4) * A; d += (i ? ' L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); }
    for (let k = 0; k < 4; k++) { let f = ''; for (let i = 0; i <= 12; i++) { const u = i / 12, px = L / 2 + u * 90, py = (k - 1.5) * 9 * u + Math.sin(u * 9 + t * 12 + k) * 7 * u; f += (i ? ' L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); } dk += `<path d="${f}" stroke="${renk}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>`; }
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}">${dk}<path d="${d}" stroke="${P.bakteriK}" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(-3 4)"/>` +
      `<path d="${d}" stroke="${renk}" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#E4FFC8" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6" transform="translate(2 -6)"/></g>`;
  }
  // cam bardak: seviye 0..1, içinde bulanık sıvı + yüzen bakteriler + kabarcık
  function bardak(x, y, s = 1, seviye = 1, t = 0, bakteriVar = true) { // x,y = taban merkezi
    const w1 = 150, w2 = 120, h = 260, c = id('br');
    const yol = `M${-w1 / 2} ${-h} L${w1 / 2} ${-h} L${w2 / 2} 0 Q${w2 / 2} 12 ${w2 / 2 - 14} 12 L${-w2 / 2 + 14} 12 Q${-w2 / 2} 12 ${-w2 / 2} 0Z`;
    let o = `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="16" rx="${w1 * .55}" ry="12" fill="#000" opacity=".15"/>`;
    o += `<defs><clipPath id="${c}"><path d="${yol}"/></clipPath></defs><path d="${yol}" fill="#EAF7FF" opacity=".55"/><g clip-path="url(#${c})">`;
    const sy = -h * .92 * seviye;
    if (seviye > .01) { o += `<rect x="-100" y="${sy}" width="200" height="${h}" fill="${P.sivi}"/><path d="M-100 ${sy} Q-50 ${sy - 8 * Math.sin(t * 3)} 0 ${sy} T100 ${sy} V${sy + 14} H-100Z" fill="#E3E19A"/>`;
      if (bakteriVar) for (let i = 0; i < 6; i++) { const bx = -44 + (i % 3) * 44 + Math.sin(t * 1.3 + i) * 8, by = -30 - Math.floor(i / 3) * 70 - (i % 2) * 20 + Math.cos(t + i) * 6; if (by > sy + 20) o += bakteri(bx, by, .28, t + i, i * 40, '#9BE05A'); }
      for (let i = 0; i < 5; i++) { const q = (t * .5 + i * .21) % 1, by = -10 - q * (h * seviye * .9); o += `<circle cx="${-40 + i * 20}" cy="${by}" r="${4 + i % 3}" fill="#FFFFFF" opacity="${.5 * (1 - q)}"/>`; } }
    o += `</g><path d="M${w1 / 2 - 22} ${-h + 16} L${w2 / 2 - 12} -16" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".6"/></g>`;
    return o;
  }
  // mide (J şekli) — kesit; icerik ic dünyaya kırpılır
  function mideYol(x, y, s) {
    const k = (a, b) => `${x + a * s} ${y + b * s}`;
    return `M${k(-40, -220)} Q${k(-60, -120)} ${k(-150, -40)} Q${k(-240, 60)} ${k(-150, 170)} Q${k(-40, 270)} ${k(110, 190)} Q${k(200, 140)} ${k(210, 60)} L${k(250, 40)} Q${k(270, 10)} ${k(240, -10)} L${k(200, 0)} Q${k(150, 60)} ${k(80, 80)} Q${k(0, 100)} ${k(-40, 40)} Q${k(-70, -30)} ${k(10, -120)} Q${k(40, -170)} ${k(30, -220)}Z`;
  }
  function mide(x, y, s = 1, icerik = '', t = 0) {
    const c = id('md'); const d = mideYol(x, y, s);
    return `<path d="${d}" fill="#000" opacity=".12" transform="translate(10 14)"/><defs><clipPath id="${c}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${c})"><path d="${d}" fill="#FFD3DC"/>` +
      `<path d="${d}" fill="${P.pembe}" transform="translate(${-10 * s} ${10 * s})"/><circle cx="${x - 160 * s}" cy="${y + 200 * s}" r="${220 * s}" fill="${P.pembe2}" opacity=".6"/>${icerik}</g>`;
  }
  function kitap(x, y, s = 1, sol = '', sag = '', rot = 0) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-300 -180 Q-150 -210 0 -170 Q150 -210 300 -180 L300 200 Q150 170 0 210 Q-150 170 -300 200Z" fill="#2F6F8F"/>` +
      `<path d="M-280 -165 Q-140 -190 -6 -155 L-6 190 Q-140 158 -280 184Z" fill="#FFF8EC"/><path d="M280 -165 Q140 -190 6 -155 L6 190 Q140 158 280 184Z" fill="#FFF3E0"/>` +
      `<rect x="-8" y="-160" width="16" height="360" fill="#E8D9BE" opacity=".6"/>` +
      [0, 1, 2, 3].map(i => `<rect x="-250" y="${40 + i * 30}" width="${200 - (i % 2) * 40}" height="10" rx="5" fill="#CDBFA6"/><rect x="40" y="${40 + i * 30}" width="${200 - (i % 3) * 30}" height="10" rx="5" fill="#CDBFA6"/>`).join('') + sol + sag + `</g>`;
  }
  function mikroskop(x, y, s = 1) { // y = taban
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-120" y="-40" width="240" height="40" rx="18" fill="#3D5A80"/><rect x="-20" y="-300" width="40" height="270" rx="20" fill="#5B7BA6"/>` +
      `<rect x="-90" y="-150" width="180" height="24" rx="12" fill="#98B4D8"/><g transform="rotate(-25 0 -300)"><rect x="-26" y="-470" width="52" height="200" rx="22" fill="#E8EEF6"/><rect x="-34" y="-490" width="68" height="40" rx="16" fill="#3D5A80"/><rect x="-18" y="-280" width="36" height="70" rx="12" fill="#98B4D8"/></g>` +
      `<circle cx="60" cy="-240" r="26" fill="#98B4D8"/></g>`;
  }
  // mikroskop görüş dairesi
  function gorus(x, y, r, t, adet = 6) {
    const c = id('gr'); let o = `<circle cx="${x}" cy="${y}" r="${r + 18}" fill="#1B1640"/><defs><clipPath id="${c}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs><g clip-path="url(#${c})"><circle cx="${x}" cy="${y}" r="${r}" fill="#FFC2CE"/>`;
    for (let i = 0; i < 9; i++) o += `<circle cx="${x - r + ((i * 173) % (2 * r))}" cy="${y - r + ((i * 97) % (2 * r))}" r="${40 + (i % 3) * 20}" fill="#FFAFBF" opacity=".7"/>`;
    for (let i = 0; i < adet; i++) { const a = i * 2.2 + t * .3, rr = r * (.2 + .55 * ((i * 37) % 10) / 10); o += bakteri(x + Math.cos(a) * rr, y + Math.sin(a) * rr, .85, t + i, a * 57 + 90); }
    return o + `<circle cx="${x + r * .35}" cy="${y - r * .4}" r="${r * .25}" fill="#FFFFFF" opacity=".15"/></g>`;
  }
  function domuz(x, y, s = 1, t = 0) { // mutlu domuz yavrusu, y = taban
    const z = Math.sin(t * 6) * 3;
    return `<g transform="translate(${x} ${y + z}) scale(${s})"><ellipse cx="0" cy="6" rx="90" ry="14" fill="#000" opacity=".12"/>` +
      [-50, -20, 25, 55].map(a => `<rect x="${a - 10}" y="-30" width="20" height="36" rx="10" fill="#E88AA0"/>`).join('') +
      `<ellipse cx="0" cy="-70" rx="100" ry="70" fill="#FFB3C4"/><ellipse cx="20" cy="-90" rx="60" ry="30" fill="#FFD0DB" opacity=".7"/>` +
      `<circle cx="80" cy="-100" r="52" fill="#FFB3C4"/><path d="M60 -150 L70 -178 L92 -150Z M92 -150 L110 -172 L118 -140Z" fill="#E88AA0"/>` +
      `<ellipse cx="118" cy="-92" rx="22" ry="17" fill="#E88AA0"/><circle cx="112" cy="-92" r="4" fill="#9A3F57"/><circle cx="124" cy="-92" r="4" fill="#9A3F57"/>` +
      `<circle cx="72" cy="-112" r="6" fill="#1B1640"/><path d="M-98 -80 q-24 -10 -16 -30 q8 -18 20 -4" stroke="#E88AA0" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
  }
  function takvim(x, y, yil, s = 1, renk = P.mercan) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-170" y="-150" width="340" height="300" rx="36" fill="#FFFFFF"/><rect x="-170" y="-150" width="340" height="80" rx="36" fill="${renk}"/><rect x="-170" y="-100" width="340" height="30" fill="${renk}"/>` +
      `<rect x="-110" y="-180" width="22" height="60" rx="11" fill="${P.lacivert}"/><rect x="88" y="-180" width="22" height="60" rx="11" fill="${P.lacivert}"/>` +
      `<text x="0" y="70" font-size="120" font-weight="900" text-anchor="middle" style="fill:${P.lacivert}">${yil}</text></g>`;
  }
  function kapsul(x, y, rot = 0, s = 1, r1 = '#3D8BFD', r2 = '#FFFFFF') {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-44" y="-20" width="88" height="40" rx="20" fill="${r2}"/><path d="M0 -20 H24 A20 20 0 0 1 24 20 H0Z" fill="${r1}"/><rect x="-30" y="-12" width="44" height="7" rx="3.5" fill="#FFFFFF" opacity=".6"/></g>`;
  }
  function recete(x, y, s, cizik, yeni) {
    let o = `<g transform="translate(${x} ${y}) scale(${s}) rotate(-3)"><rect x="-300" y="-230" width="600" height="460" rx="24" fill="#FFFFFF"/><rect x="-300" y="-230" width="600" height="80" rx="24" fill="${P.mint2}"/><rect x="-300" y="-180" width="600" height="30" fill="${P.mint2}"/>` +
      `<text x="-260" y="-172" font-size="48" font-weight="900" style="fill:#FFFFFF">Rx</text><text class="mono" x="260" y="-176" font-size="26" text-anchor="end" style="fill:#FFFFFF">REÇETE</text>`;
    o += `<text x="-250" y="-60" font-size="46" font-weight="900" style="fill:${P.lacivert}">SADECE ANTASİT</text>`;
    if (cizik > 0) o += `<rect x="-262" y="-82" width="${540 * cizik}" height="12" rx="6" fill="${P.iltihap}"/>`;
    if (yeni > 0) o += `<g opacity="${yeni}"><text x="-250" y="40" font-size="46" font-weight="900" style="fill:#2E9E6B">ANTİBİYOTİK</text><text x="-250" y="100" font-size="40" font-weight="900" style="fill:#2E9E6B">+ ASİT BASKILAYICI</text></g>`;
    return o + `</g>`;
  }
  function madalya(x, y, r, don = 0) {
    const k = Math.abs(Math.cos(don)); const c = id('ml');
    return `<path d="M${x - r * .5} ${y - r * 1.55} L${x - r * .15} ${y - r * .7} L${x + r * .15} ${y - r * .7} L${x + r * .5} ${y - r * 1.55}Z" fill="${P.bordo}"/>` +
      `<g transform="translate(${x} ${y}) scale(${Math.max(.08, k)} 1)"><circle r="${r}" fill="${P.altinK}"/><circle r="${r * .96}" fill="${P.altin}" transform="translate(${-r * .04} ${r * .04})"/>` +
      `<circle r="${r * .78}" fill="#F9D86A"/><path d="M${-r * .25} ${-r * .45} Q${r * .2} ${-r * .55} ${r * .28} ${-r * .1} Q${r * .3} ${r * .2} ${r * .05} ${r * .35} L${-r * .05} ${r * .5} L${-r * .3} ${r * .45} Q${-r * .2} ${r * .1} ${-r * .35} ${-r * .05}Z" fill="${P.altinK}" opacity=".55"/>` +
      `<circle cx="${r * .35}" cy="${-r * .4}" r="${r * .18}" fill="#FFFFFF" opacity=".45"/></g>`;
  }
  function siluet(x, y, s = 1, renk = '#6FB9A0', kolKavus = 0) { // yüzsüz oturmuş kişi, y = masa hizası
    return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-190" r="52" fill="${renk}"/><path d="M-90 0 Q-95 -120 -40 -130 L40 -130 Q95 -120 90 0Z" fill="${renk}"/>` +
      (kolKavus > 0 ? `<rect x="${-80}" y="${-70 - 20 * kolKavus}" width="160" height="42" rx="21" fill="#FFFFFF" opacity=".35"/>` : '') + `</g>`;
  }
  // kişiler (flat portre, gerçek kişilere benzetme: 1980'ler)
  const marshall = (o = {}) => KS.kisi(Object.assign({ ten: 'acik', sac: { tip: 'kisaYan', renk: '#7A5536' }, kas: { renk: '#6B4A32' }, ifade: 'gulumse', kiyafet: { renk: '#8FB8E0', yaka: 'onluk', gomlek: '#D7E7F7' }, kravat: '#3D5A80' }, o));
  const warren = (o = {}) => KS.kisi(Object.assign({ ten: 'acik', sac: { tip: 'yanlar', renk: '#E4E4E4' }, kas: { renk: '#CFCFCF' }, gozluk: { tip: 'kare', renk: '#4A4A55' }, yas: .8, kiyafet: { renk: '#8FA2C9', yaka: 'onluk', gomlek: '#EDEFF5' }, kravat: '#8E2B4A' }, o));
  return { marshall, warren, P, zemin, pencere, bakteri, bardak, mide, mideYol, kitap, mikroskop, gorus, domuz, takvim, kapsul, recete, madalya, siluet };
})();
