// ---------------- #43 hukuk görselleri (düz, konturlu değil; merkez orijin) ----------------
const ALTIN = '#E8B04A', BORDO = '#7A1F36', KAGIT = '#F4E9D2', MUREK = '#1B1626', YESIL = '#2FBFA8';
// kapalı kanun kitabı; 'ad' sırtta/üstte yazar
const kitapK = (s = 1, ad = 'KANUN', ac = 0) => {
  if (ac > .5) return `<g transform="scale(${s})">` + R(-310, -190, 310, 380, 14, '#E4D7BA') + R(0, -190, 310, 380, 14, KAGIT) + `<rect x="-6" y="-196" width="12" height="392" fill="#B49A66"/>` +
    Array.from({ length: 9 }, (_, i) => R(-270, -140 + i * 38, i % 3 === 2 ? 150 : 230, 12, 6, '#B8AC90')).join('') +
    Array.from({ length: 9 }, (_, i) => R(40, -140 + i * 38, i % 4 === 3 ? 130 : 230, 12, 6, '#B8AC90')).join('') + `</g>`;
  return `<g transform="scale(${s})">` + R(-200 + 12, -260 + 18, 400, 520, 20, '#000', .35) + R(-200, -260, 400, 520, 20, BORDO) + R(-200, -260, 34, 520, 14, '#5E1428') +
    `<rect x="-168" y="-228" width="352" height="456" rx="10" fill="none" stroke="${ALTIN}" stroke-width="6"/>` +
    `<g transform="translate(10 -80)"><rect x="-8" y="-86" width="16" height="170" rx="6" fill="${ALTIN}"/><rect x="-70" y="-90" width="140" height="12" rx="6" fill="${ALTIN}"/><path d="M-70 -84 L-100 -10 H-40Z M70 -84 L40 -10 H100Z" fill="${ALTIN}"/><rect x="-44" y="78" width="88" height="14" rx="7" fill="${ALTIN}"/></g>` +
    txt(ad, 10, 150, 54, ALTIN) + `</g>`;
};
// kâğıt kart: satırlar (gri çubuklar); vurgu: satır indisi → sarı fosforlu
const sayfaK = (w = 760, h = 520, n = 7, vurgu = -1, baslik = '') => {
  let o = R(-w / 2 + 10, -h / 2 + 16, w, h, 26, '#000', .35) + R(-w / 2, -h / 2, w, h, 26, KAGIT);
  if (baslik) o += R(-w / 2, -h / 2, w, 84, 26, BORDO) + R(-w / 2, -h / 2 + 50, w, 34, 0, BORDO) + txt(baslik, 0, -h / 2 + 58, 46, ALTIN);
  const y0 = -h / 2 + (baslik ? 130 : 70), gap = (h - (baslik ? 190 : 120)) / Math.max(1, n - 1);
  for (let i = 0; i < n; i++) {
    const ww = (i % 3 === 2 ? .55 : .86) * (w - 100);
    if (i === vurgu) o += R(-w / 2 + 38, y0 + i * gap - 22, w - 76, 44, 10, '#FFD23F', .85);
    o += R(-w / 2 + 50, y0 + i * gap - 7, ww, 14, 7, i === vurgu ? '#5A4A20' : '#BDB296');
  }
  return o;
};
const kapiK = (s = 1, ac = 0) => { const w = 248 * (1 - ac * .85); return `<g transform="scale(${s})">` + R(-150, -300, 300, 600, 10, '#2B1A14') + R(-124, -276, 248, 570, 6, '#0B0710') +
  `<path d="M-124 -276 H124 V294 H-124Z" fill="#FFD27A" opacity="${(.18 * ac).toFixed(2)}"/>` + R(-124, -276, w, 570, 6, '#6B4630') + R(-124 + w * .12, -240, w * .76, 210, 8, '#5A3A28') + R(-124 + w * .12, 0, w * .76, 250, 8, '#5A3A28') +
  `<circle cx="${(-124 + w - 30).toFixed(1)}" cy="10" r="14" fill="${ALTIN}"/><rect x="-124" y="286" width="248" height="8" fill="#FFD27A" opacity="${(.55 * (1 - ac)).toFixed(2)}"/></g>`; };
const saatK = (s, t, hiz = 1, renk = '#E8323C') => `<g transform="scale(${s})"><circle r="150" fill="#F4F1E8"/><circle r="150" fill="none" stroke="${MUREK}" stroke-width="14"/>` +
  Array.from({ length: 12 }, (_, i) => `<rect x="-5" y="-136" width="10" height="${i % 3 === 0 ? 28 : 16}" rx="4" fill="${MUREK}" transform="rotate(${i * 30})"/>`).join('') +
  `<rect x="-7" y="-92" width="14" height="100" rx="6" fill="${MUREK}" transform="rotate(${(t * 30 * hiz) % 360})"/><rect x="-5" y="-124" width="10" height="132" rx="5" fill="${renk}" transform="rotate(${(t * 360 * hiz) % 360})"/><circle r="14" fill="${renk}"/></g>`;
const kalkanK = (s, renk, ic = '') => `<g transform="scale(${s})"><path d="M0 -150 L120 -104 V10 Q120 100 0 160 Q-120 100 -120 10 V-104Z" fill="#000" opacity=".3" transform="translate(8 14)"/><path d="M0 -150 L120 -104 V10 Q120 100 0 160 Q-120 100 -120 10 V-104Z" fill="${renk}"/><path d="M0 -150 L120 -104 V10 Q120 100 0 160Z" fill="#000" opacity=".12"/>${ic}</g>`;
const silK = (tur, renk = '#FFF6E6') => {
  if (tur === 'kadin') return `<circle cy="-62" r="26" fill="${renk}"/><path d="M-12 -34 H12 L46 60 H-46Z" fill="${renk}"/><rect x="-14" y="60" width="10" height="44" rx="4" fill="${renk}"/><rect x="4" y="60" width="10" height="44" rx="4" fill="${renk}"/>`;
  if (tur === 'adam') return `<circle cy="-66" r="26" fill="${renk}"/><path d="M-34 -34 H34 L28 38 H-28Z" fill="${renk}"/><rect x="-24" y="38" width="20" height="66" rx="6" fill="${renk}"/><rect x="4" y="38" width="20" height="66" rx="6" fill="${renk}"/>`;
  if (tur === 'cocuk') return `<circle cy="-18" r="20" fill="${renk}"/><path d="M-26 6 H26 L20 52 H-20Z" fill="${renk}"/><rect x="-16" y="52" width="12" height="34" rx="4" fill="${renk}"/><rect x="4" y="52" width="12" height="34" rx="4" fill="${renk}"/>`;
  return '';
};
const cekicK = (s, rot = 0) => `<g transform="rotate(${rot}) scale(${s})"><rect x="-14" y="-10" width="28" height="220" rx="10" fill="#8A5A3A"/><rect x="-80" y="-70" width="160" height="80" rx="16" fill="#5E3A24"/><rect x="-80" y="-70" width="160" height="22" rx="10" fill="#8A5A3A"/></g>`;
const kafesK = (w, h, k) => { let o = ''; const n = 7; for (let i = 0; i < n; i++) o += R(-w / 2 + i * (w / (n - 1)) - 9, -h / 2 - (1 - k) * 700, 18, h + 40, 8, '#9AA3B5'); return o + R(-w / 2 - 20, -h / 2 - 28 - (1 - k) * 700, w + 40, 30, 10, '#6C7488') + R(-w / 2 - 20, h / 2 + 8 - (1 - k) * 700, w + 40, 30, 10, '#6C7488'); };
const soru = (s, renk = '#FFD23F') => `<g transform="scale(${s})"><circle r="150" fill="${renk}"/><text y="86" font-size="230" font-weight="900" text-anchor="middle" style="fill:${MUREK}">?</text></g>`;
const mercek = (s) => `<g transform="scale(${s})"><circle r="70" fill="#BFE0FF" opacity=".35"/><circle r="70" fill="none" stroke="${ALTIN}" stroke-width="14"/><rect x="50" y="52" width="18" height="110" rx="9" fill="#8A5A3A" transform="rotate(-45 50 52)"/></g>`;
const damga = (s, renk = '#E8323C', fs = 80, rot = -8) => { const w = K.yaziGen(s, fs) + 70; return `<g transform="rotate(${rot})"><rect x="${-w / 2}" y="${-fs * .85}" width="${w}" height="${fs * 1.7}" rx="14" fill="none" stroke="${renk}" stroke-width="10"/>` + txt(s, 0, fs * .34, fs, renk) + `</g>`; };
const zarfK = (s) => `<g transform="scale(${s})">` + R(-130, -90, 260, 180, 14, KAGIT) + `<path d="M-130 -80 L0 20 L130 -80" stroke="#B8AC90" stroke-width="10" fill="none"/></g>`;
const ayKutu = (x, y, i, k, dolu, lab = 'AY', renk = ALTIN) => `<g transform="translate(${x} ${y}) scale(${ob(k).toFixed(3)})">` + R(-70, -70, 140, 140, 22, dolu ? renk : '#2B2240') + txt(String(i), 0, 26, 78, dolu ? MUREK : '#8A80A8') + txt(lab, 0, 56, 26, dolu ? MUREK : '#8A80A8') + `</g>`;
