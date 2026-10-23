S = {}
ZM = "MO.zemin({ ust: '#3A1A10', alt: '#120806', isik: [540, 860, '#F2B544', .22], ikinci: [900, 300, '#C9352B', .12] })"
# 01 — KANCA (0–5,0): bir krallığı bitirmek için kaç saat? · Mohaç'ta cevap: iki
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#3A1A10', alt: '#120806', isik: [540, 900, '#F2B544', .26], ikinci: [900, 300, '#C9352B', .14] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.07, 540, 940, 5.0, 'kamera']],
  sarsinti: [[4.4, 12]],
  ciz: t => {
    let o = '';
    const a = t < 4.4 ? t * 260 : 60, sek = ob(fd(t, 4.4, 4.9));
    o += `<g transform="translate(540 960)">` + saatT(1.8, a % 360, sek) + `</g>`;
    o += ET(t, .05, 2.6, 'BİR KRALLIĞI BİTİRMEK', '#FFFFFF', '#C9352B', 56, 440, -2) + ET(t, .4, 2.6, 'İÇİN KAÇ SAAT?', ALTN, KAHVE, 84, 590, 2);
    o += ET(t, 2.9, 99, "MOHAÇ'TA CEVAP:", '#FFFFFF', '#C9352B', 62, 440, -2);
    if (t > 4.3) o += MO.sar(R(-170, -110, 340, 220, 50, '#C9352B') + txt('İKİ', 0, 52, 150, '#FFFFFF'), MO.oge(t, { gir: 4.4, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1290 - 40, { golge: false });
    return o;
  },
  onCiz: t => ''
});"""

# 02 — 20 YAŞINDAKİ KRAL: ne ordusu, ne tacı, ne hayatı (5,0–12,6)
S[2] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 7.6, 'kamera']],
  sarsinti: [[5.5, 8]],
  ciz: t => {
    let o = '';
    const gri = fd(t, 6.6, 7.4), tk = 1 - ob(fd(t, 5.5, 6.2));
    o += `<g transform="translate(540 830) scale(1.42)">` + kartK(420, 500, MACAR, `<g transform="translate(0 -20)">${kralBust('lajos', t < 5.5 ? 1 : 0, gri)}</g>`) + `</g>`;
    if (t > 5.5) { const k = fd(t, 5.5, 6.4); o += `<g transform="translate(${F1(540 + 160 * k)} ${F1(480 + 560 * k * k)}) rotate(${F1(70 * k)}) scale(${(.75).toFixed(2)})" opacity="${(1 - fd(t, 6.0, 6.5)).toFixed(2)}">` + tacK(1) + `</g>`; }
    o += MO.sar(damga('20 YAŞINDA', '#C9352B', 70, -6), MO.oge(t, { gir: .3, cik: 2.6, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1220, { golge: false });
    const ord = 1 - fd(t, 3.4, 4.4);
    if (ord > .01) { let r = ''; for (let i = 0; i < 12; i++) r += `<g transform="translate(${-330 + i * 60} ${i % 2 ? 20 : 0}) scale(.5)" opacity="${Math.min(1, fd(t, 2.9 + i * .03, 3.1 + i * .03)) * (1 - fd(t, 3.4 + i * .06, 3.8 + i * .06))}">` + yenK(1, '#7A5A3A') + `</g>`; o += `<g transform="translate(560 1250) scale(1.15)">${r}</g>`; }
    o += ET(t, .2, 2.7, '20 YAŞINDAKİ KRAL', '#FFFFFF', '#C9352B', 56, 440, -2);
    o += ET(t, 2.8, 4.7, 'İKİ SAAT SONRA', ALTN, KAHVE, 54, 440, -2) + ET(t, 3.7, 5.6, 'NE ORDUSU?', '#FFFFFF', '#C9352B', 78, 1230 - 20, 2);
    o += ET(t, 5.5, 6.5, 'NE TACI?', '#FFFFFF', '#C9352B', 84, 440, -2) + ET(t, 6.5, 7.4, 'NE HAYATI?', '#FFFFFF', '#C9352B', 84, 440, 2);
    o += MO.sar(zamanChip('İPUCU SONDA', 0, 0, ALTN, KAHVE, 40), MO.oge(t, { gir: 7.5, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 1230, { golge: false });
    return o;
  },
  onCiz: t => ''
});"""

# 03 — 29 AĞUSTOS 1526 · Mohaç (12,6–16,4)
S[3] = r"""
const HMH = H.ciz({ ulkeler: H.ulke('Macaristan', 'Avusturya', 'Slovakya', 'Romanya', 'Sırbistan', 'Hırvatistan', 'Ukrayna', 'Slovenya', 'Çek Cumhuriyeti', 'Bosna Hersek', 'Bulgaristan', 'Polonya', 'Almanya', 'İtalya'),
  sigdir: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[13, 42.5], [13, 50.2], [26.5, 50.2], [26.5, 42.5], [13, 42.5]]] } }],
  vurgu: { 'Macaristan': '#F2B544' }, renk: '#3A2A22', rim: '#8A6A50', golge: '#050302', sinir: '#8A6A50', kutu: [20, 470, 1040, 700], proj: 'mercator' });
const MOH = HMH.p([18.68, 45.99]);
MO.sahne({
  zemin: MO.zemin({ ust: '#1F2A2A', alt: '#080D0D', isik: [540, 800, '#F2B544', .20] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, MOH[0], MOH[1], 3.8, 'kamera']],
  ciz: t => {
    let o = `<rect x="20" y="470" width="1040" height="700" rx="36" fill="#14201F"/>` + HMH.svg;
    const p = (t * 1.1) % 1; o += `<circle cx="${F1(MOH[0])}" cy="${F1(MOH[1])}" r="${F1(4 + 26 * p)}" fill="none" stroke="#C9352B" stroke-width="${F1(3 * (1 - p))}" opacity="${(1 - p).toFixed(2)}"/><circle cx="${F1(MOH[0])}" cy="${F1(MOH[1])}" r="5" fill="#C9352B"/>`;
    return o;
  },
  onCiz: t => ET(t, .15, 99, '29 AĞUSTOS 1526', ALTN, KAHVE, 78, 360 + 80, -2) + MO.sar(zamanChip('MOHAÇ', 0, 0, '#C9352B', '#FFFFFF', 44), MO.oge(t, { gir: 1.2, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 1230, { golge: false }) + MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 04 — LAJOS ↔ KANUNİ (16,4–22,5)
S[4] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 6.1, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(`<g transform="scale(1.05)">` + kartK(400, 560, MACAR, `<g transform="translate(0 -30)">${kralBust('lajos', 1, 0)}</g>` + txt('II. LAJOS', 0, 230, 50, KAHVE)) + `</g>`, MO.oge(t, { gir: .25, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 290, 900, { golge: false });
    o += MO.sar(`<g transform="scale(1.05)">` + kartK(400, 560, TURK, `<g transform="translate(0 -30)">${kralBust('kanuni', 1, 0)}</g>` + txt('KANUNİ', 0, 230, 50, KAHVE)) + `</g>`, MO.oge(t, { gir: 3.9, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 790, 900, { golge: false });
    o += MO.sar(R(-60, -46, 120, 92, 46, '#C9352B') + txt('VS', 0, 22, 54, '#FFFFFF'), MO.oge(t, { gir: 4.2, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 900, { golge: false });
    o += ET(t, .2, 3.8, 'MACAR KRALI', '#FFFFFF', '#B0302A', 54, 440, -2) + ET(t, 3.9, 99, 'OSMANLI SULTANI', '#FFFFFF', '#1F8F7A', 54, 440, 2);
    o += MO.sar(zamanChip('20 YAŞ', 0, 0, '#B0302A', '#FFFFFF', 40), MO.oge(t, { gir: 1.0, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 290, 1230, { golge: false });
    o += MO.sar(zamanChip('30\'LU YAŞLARIN BAŞI', 0, 0, '#1F8F7A', '#FFFFFF', 34), MO.oge(t, { gir: 4.6, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 790, 1230, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 05 — ŞÖVALYELER: hücum (22,5–30,2)
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#4A2A14', alt: '#150A06', isik: [540, 860, '#F2B544', .26], ikinci: [900, 300, '#C9352B', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 960, 7.7, 'kamera']],
  sarsinti: [[6.2, 10], [6.6, 8]],
  ciz: t => {
    let o = '';
    o += `<path d="M-100 1160 Q300 1120 540 1150 T1180 1140 V1400 H-100Z" fill="#3A1F10"/>`;
    const hiz = t < 6.1 ? 18 : 180;
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) {
      const k = fd(t, .2 + (i + r) * .1, .9 + (i + r) * .1); const x = -150 + i * 270 + (t < 6.1 ? t * hiz : 6.1 * 18 + (t - 6.1) * hiz) + r * 60, y = 760 + r * 150;
      if (x > -300 && x < 1380) o += `<g transform="translate(${F1(x)} ${F1(y)}) scale(${(.62 - r * .04).toFixed(2)})" opacity="${k.toFixed(2)}">` + atliK(1, ['#2B2230', '#3A2A34', '#2B3040'][r], ALTN) + `</g>`;
    }
    if (t > 6.1) for (let i = 0; i < 9; i++) o += `<circle cx="${F1(((i * 190 + t * 700) % 1300) - 100)}" cy="${F1(1100 + (i % 3) * 30)}" r="${F1(30 + (i % 4) * 14)}" fill="#C9A87A" opacity=".18"/>`;
    o += ET(t, .15, 3.6, 'MACAR ORDUSUNUN GURURU', '#FFFFFF', '#B0302A', 44, 440, -2) + ET(t, .6, 3.6, 'AĞIR ZIRHLI ŞÖVALYELER', ALTN, KAHVE, 52, 560, 2);
    o += ET(t, 4.2, 5.9, 'AVRUPA ONLARDAN KORKARDI', '#FFFFFF', '#C9352B', 46, 440, -2);
    o += ET(t, 6.1, 99, 'HÜCUM!', '#C9352B', '#FFFFFF', 130, 460, -3);
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'endise' })
});"""

# 06 — OSMANLI TOPLARI + YENİÇERİ ATEŞİ (30,2–33,8)
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1A14', alt: '#0E0806', isik: [540, 860, '#C9352B', .22], ikinci: [200, 400, '#F2B544', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 960, 3.6, 'kamera']],
  sarsinti: [[1.0, 18], [1.8, 12], [2.5, 12]],
  ciz: t => {
    let o = `<path d="M-100 1160 Q300 1120 540 1150 T1180 1140 V1400 H-100Z" fill="#2A1A10"/>`;
    const ateş = (t0) => { const k = t - t0; return k > 0 && k < .5 ? `<circle cx="${F1(570)}" cy="${F1(900)}" r="${F1(40 + 140 * Math.min(1, k * 4))}" fill="#FFB347" opacity="${(.8 * (1 - k * 2)).toFixed(2)}"/>` : ''; };
    o += `<g transform="translate(330 1000) scale(1.5)">` + topK(1, -8) + `</g>`;
    for (let i = 0; i < 5; i++) o += `<g transform="translate(${F1(660 + i * 110)} ${F1(1060 - (i % 2) * 14)}) scale(.9)">` + yenK(1, '#1F6F8F') + `</g>`;
    o += ateş(1.0) + ateş(1.8) + ateş(2.5);
    for (let i = 0; i < 14; i++) { const k = clmp((t - 1.0 - i * .05) / 1.6); if (k > 0) o += `<circle cx="${F1(600 + k * 320 + i * 8)}" cy="${F1(900 - 180 * k - (i % 4) * 22)}" r="${F1(30 + 70 * k)}" fill="#8A8A8A" opacity="${(.5 * (1 - k)).toFixed(2)}"/>`; }
    o += ET(t, .1, 99, 'OSMANLI TOPLARI', ALTN, KAHVE, 66, 460, -2) + ET(t, 1.8, 99, 've YENİÇERİ ATEŞİ', '#FFFFFF', '#1F6F8F', 56, 620, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'saskin' })
});"""

# 07 — ~2 SAAT · 14–20 BİN · KÜÇÜK BİR STADYUM (33,8–42,0)
S[7] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 8.2, 'kamera']],
  ciz: t => {
    let o = '';
    const A = 1 - fd(t, 2.0, 2.4), B = fd(t, 2.1, 2.6);
    if (A > .01) { o += `<g opacity="${A.toFixed(2)}"><g transform="translate(540 900)">` + saatT(1.5, Math.min(60, t * 40), ob(fd(t, .1, 1.6))) + `</g></g>`; o += ET(t, .1, 2.3, 'YAKLAŞIK İKİ SAAT', ALTN, KAHVE, 66, 460, -2); }
    if (B > .01) {
      const n = Math.round(14000 + 6000 * clmp((t - 2.9) / 1.8));
      o += `<g opacity="${B.toFixed(2)}">` + MO.sar(R(-330, -100, 660, 200, 50, '#1B0F0A') + `<rect x="-330" y="-100" width="660" height="200" rx="50" fill="none" stroke="#C9352B" stroke-width="6"/>` + txt((t < 2.9 ? '14.000' : (n >= 20000 ? '14.000–20.000' : n.toLocaleString('tr-TR'))), 0, 38, t > 4.6 ? 80 : 100, '#FFFFFF'), MO.oge(t, { gir: 2.2, agirlik: 'agir', giris: 'olcek', x: 540 }), 540, 640, { golge: false }) + `</g>`;
      o += ET(t, 2.2, 99, 'MACAR ASKERİ SAHADA KALDI', '#FFFFFF', '#B0302A', 44, 440, -2);
      if (t > 5.5) o += MO.sar(`<g transform="scale(1.15)">${stadyum(1)}</g>`, MO.oge(t, { gir: 5.6, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 980, { golge: false }) + ET(t, 5.9, 99, 'KÜÇÜK BİR STADYUM DOLUSU', ALTN, KAHVE, 50, 1230, -2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'saskin' })
});"""

# 08 — KRAL KAÇARKEN ÖLDÜ · derede boğuldu (rivayet) · tartışılıyor (42,0–48,5)
S[8] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1F2A2A', alt: '#080D0D', isik: [540, 900, '#2FBFA8', .16], ikinci: [900, 300, '#F2B544', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 980, 6.5, 'kamera']],
  ciz: t => {
    let o = '';
    o += `<path d="${nehir(880, t, 700)}" fill="#1B5A52" opacity=".95"/><path d="${nehir(940, t + 1.3, 700)}" fill="#14403B" opacity=".95"/>`;
    const k = fd(t, 2.2, 3.4); o += `<g transform="translate(${F1(540 + 20 * Math.sin(t * 1.6))} ${F1(960 + 14 * Math.sin(t * 2.1) + 60 * k)}) rotate(${F1(10 * Math.sin(t * 1.2))}) scale(${(1.1 - .15 * k).toFixed(2)})" opacity="${(1 - .55 * k).toFixed(2)}">` + tacK(1) + `</g>`;
    for (let i = 0; i < 3; i++) { const p = ((t * .5 + i / 3) % 1); o += `<ellipse cx="540" cy="1010" rx="${F1(60 + 220 * p)}" ry="${F1(14 + 50 * p)}" fill="none" stroke="#BFF0E4" stroke-width="4" opacity="${(.5 * (1 - p)).toFixed(2)}"/>`; }
    if (t > 4.2) o += MO.sar(`<text y="120" font-size="320" font-weight="900" text-anchor="middle" style="fill:${ALTN}">?</text>`, MO.oge(t, { gir: 4.2, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 720, { golge: false });
    o += ET(t, .1, 1.9, 'KRAL LAJOS', '#FFFFFF', '#B0302A', 60, 440, -2) + ET(t, .5, 1.9, 'KAÇARKEN ÖLDÜ', ALTN, KAHVE, 74, 590, 2);
    o += ET(t, 2.0, 4.1, 'RİVAYETE GÖRE', '#FFFFFF', '#1F8F7A', 50, 440, -2) + ET(t, 2.4, 4.1, 'BİR DEREDE BOĞULDU', '#FFFFFF', '#1F6F8F', 56, 570, 2);
    o += ET(t, 4.3, 99, 'NASIL ÖLDÜĞÜ TARTIŞILIYOR', ALTN, KAHVE, 46, 1230 - 30, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'uzgun' })
});"""

# 09 — BİR ÜLKE TEK GÜNDE YOK OLABİLİR Mİ? · MACARİSTAN OLDU · TAHT BOŞALDI (48,5–55,5)
S[9] = r"""
const HMB = H.ciz({ ulkeler: H.ulke('Macaristan', 'Avusturya', 'Slovakya', 'Romanya', 'Sırbistan', 'Hırvatistan', 'Ukrayna', 'Slovenya', 'Çek Cumhuriyeti', 'Bosna Hersek', 'Bulgaristan', 'Polonya', 'Almanya', 'İtalya'),
  sigdir: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[13, 42.5], [13, 50.2], [26.5, 50.2], [26.5, 42.5], [13, 42.5]]] } }],
  vurgu: { 'Macaristan': '#C9352B' }, renk: '#3A2A22', rim: '#8A6A50', golge: '#050302', sinir: '#8A6A50', kutu: [20, 470, 1040, 700], proj: 'mercator' });
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1D2A', alt: '#0C080C', isik: [540, 800, '#C9352B', .20], ikinci: [900, 300, '#F2B544', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 7.0, 'kamera']],
  ciz: t => {
    let o = '';
    const M = 1 - fd(t, 4.7, 5.1), Th = fd(t, 4.9, 5.4);
    if (M > .01) o += `<g opacity="${M.toFixed(2)}"><rect x="20" y="470" width="1040" height="700" rx="36" fill="#1A1218"/>` + HMB.svg + `</g>`;
    o += ET(t, .1, 3.5, 'BİR ÜLKE TEK GÜNDE', '#FFFFFF', '#6A4FB3', 52, 400, -2) + ET(t, .5, 3.5, 'YOK OLABİLİR Mİ?', ALTN, KAHVE, 70, 520, 2);
    if (t > 3.5) o += MO.sar(damga('MACARİSTAN OLDU', '#C9352B', 70, -6), MO.oge(t, { gir: 3.6, cik: 4.8, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 860, { golge: false });
    if (Th > .01) { o += `<g opacity="${Th.toFixed(2)}"><g transform="translate(540 930) scale(2)">` + tahtK(1) + `</g>` + `<g transform="translate(540 760) scale(1.2)" opacity=".28">` + tacK(1) + `</g></g>`; }
    o += ET(t, 4.9, 6.3, 'KRALIN ÇOCUĞU YOKTU', '#FFFFFF', '#B0302A', 50, 440, -2);
    o += ET(t, 6.4, 99, 'TAHT BOŞALDI', ALTN, KAHVE, 82, 440, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'endise', b: [['gubi', .2, 2.9, 'Tek günde mi?']] })
});"""

# 10 — ÜLKE ÜÇE BÖLÜNDÜ: OSMANLI · HABSBURG · ERDEL (55,5–60,2)
S[10] = r"""
const HMC = H.ciz({ ulkeler: H.ulke('Macaristan', 'Avusturya', 'Slovakya', 'Romanya', 'Sırbistan', 'Hırvatistan', 'Ukrayna', 'Slovenya', 'Çek Cumhuriyeti', 'Bosna Hersek', 'Bulgaristan', 'Polonya', 'Almanya', 'İtalya'),
  sigdir: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[13, 42.5], [13, 50.2], [26.5, 50.2], [26.5, 42.5], [13, 42.5]]] } }],
  vurgu: { 'Macaristan': '#1F8F7A', 'Avusturya': '#C9A227', 'Slovakya': '#C9A227', 'Romanya': '#6A4FB3' }, renk: '#3A2A22', rim: '#8A6A50', golge: '#050302', sinir: '#8A6A50', kutu: [20, 470, 1040, 700], proj: 'mercator' });
MO.sahne({
  zemin: MO.zemin({ ust: '#1F2A2A', alt: '#080D0D', isik: [540, 800, '#F2B544', .16] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.7, 'kamera']],
  ciz: t => {
    let o = `<rect x="20" y="470" width="1040" height="700" rx="36" fill="#14201F"/>` + HMC.svg;
    o += ET(t, .1, 99, 'YILLARCA BÖLÜNDÜ', '#FFFFFF', '#B0302A', 60, 400, -2);
    [[1.5, 'OSMANLI', '#14654F', 540, 905], [2.4, 'HABSBURG', '#8A6E10', 400, 740], [3.3, 'ERDEL', '#4A3590', 850, 840]].forEach(([g, ad, rk, x, y]) => o += MO.sar(zamanChip(ad, 0, 0, rk, '#FFFFFF', 34), MO.oge(t, { gir: g, agirlik: 'hafif', giris: 'yuksel', x }), x, y, { golge: false }));
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'dusun' })
});"""

# 11 — MOHAÇ FELAKETİ · ZAFER ↔ YAS · AYNI İKİ SAAT, İKİ AYRI TARİH (60,2–70,4)
S[11] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 10.2, 'kamera']],
  ciz: t => {
    let o = '';
    o += ET(t, .1, 4.8, 'MACARLAR BU SAVAŞA', '#FFFFFF', '#6A4FB3', 46, 440, -2) + ET(t, .5, 4.8, '"MOHAÇ FELAKETİ"', '#C9352B', '#FFFFFF', 76, 590, 2) + ET(t, 1.2, 4.8, 'DİYOR', ALTN, KAHVE, 60, 740, -2);
    const B = fd(t, 5.0, 5.5);
    if (B > .01) {
      o += MO.sar(R(-210, -200, 420, 400, 36, '#1F8F7A') + txt('ZAFER', 0, -20, 74, '#FFFFFF') + txt('OSMANLI', 0, 56, 40, '#BFF0E4') + `<g transform="translate(0 130) scale(.5)">${tacK(1, ALTN)}</g>`, MO.oge(t, { gir: 5.1, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 290, 900, { golge: false });
      o += MO.sar(R(-210, -200, 420, 400, 36, '#4A4A52') + txt('YAS', 0, -20, 74, '#FFFFFF') + txt('MACARİSTAN', 0, 56, 38, '#D0D0D8') + `<g transform="translate(0 130) scale(.5)">${tacK(1, '#9A9AA2')}</g>`, MO.oge(t, { gir: 5.4, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 790, 900, { golge: false });
    }
    if (t > 7.8) { o += `<g transform="translate(540 900)">` + saatT(.6, 60 * ob(fd(t, 7.8, 8.4)), 1) + `</g>`; o += ET(t, 7.9, 99, 'AYNI İKİ SAAT', ALTN, KAHVE, 62, 460, -2) + ET(t, 8.5, 99, 'İKİ AYRI TARİH', '#FFFFFF', '#C9352B', 62, 1230 - 20, 2); }
    return o;
  },
  onCiz: t => MF(t, { gd: 'uzgun', gf: 'dusun' })
});"""

# 12 — MOHAÇ OLMASAYDI? (70,4–74,6)
S[12] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1D2A', alt: '#0C080C', isik: [540, 780, '#F2B544', .20], ikinci: [900, 1300, '#C9352B', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.2, 'kamera']],
  ciz: t => {
    let o = ET(t, .1, 99, 'MOHAÇ OLMASAYDI', '#FFFFFF', '#C9352B', 82, 460, -2) + ET(t, .6, 99, 'AVRUPA NASIL OLURDU?', ALTN, KAHVE, 62, 640, 2);
    o += `<g transform="translate(540 1010) rotate(${F1(Math.sin(t * 3) * 5)}) scale(${(1.1 * ob(fd(t, .6, 1.2))).toFixed(2)})">` + `<circle r="150" fill="${ALTN}"/><text y="86" font-size="230" font-weight="900" text-anchor="middle" style="fill:${KAHVE}">?</text></g>`;
    o += MO.sar(zamanChip('YORUMLARA YAZ', 0, 0, '#FFD23F', '#1B2440', 46), MO.oge(t, { gir: 3.2, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1230, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 13 — TAKİP (74,6–77,8)
S[13] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#101A30', alt: '#0A0F1C', isik: [540, 760, '#FFD23F', .22], supurme: .04 }),
  kamera: [[0, 1.08, 540, 800], [.1, 1.0, 540, 900, 3.2, 'kamera']],
  ciz: t => {
    const kart = R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FFD23F" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF');
    let o = MO.sar(kart, MO.oge(t, { gir: .04, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 760);
    const bs = t > 2.0 && t < 2.15 ? .92 : 1;
    o += MO.sar(`<g transform="scale(${bs})">` + R(-220, -40, 440, 80, 40, '#FFD23F') + AU.yaz('+ TAKİP ET', 0, 18, 46, '#1B2440') + '</g>', MO.oge(t, { gir: 1.3, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 300, y: 1540, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1720, boy: 220, duygu: 'mutlu', bakHedef: 'kamera' })
});"""
