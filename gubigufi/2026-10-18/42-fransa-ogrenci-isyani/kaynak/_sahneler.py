S = {}
# 01 — KANCA (0–10,5): gece okul cephesi; soru (0–4,7) · alevler başlar (4,6) · OKULLAR YANIYOR (6,5) · sokaklar alevler içinde (8,5) · İPUCU SONDA (9,5)
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A1022', alt: '#05070F', isik: [540, 900, '#FF6A1F', .10], ikinci: [200, 400, '#3E6FB8', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.1, 540, 900, 10.2, 'kamera']],
  sarsinti: [[6.5, 14], [7.0, 10], [8.2, 8]],
  ciz: t => {
    const k = fd(t, 4.6, 8.4); let o = '';
    for (let i = 0; i < 26; i++) o += `<circle cx="${(hh(i) * 1080).toFixed(0)}" cy="${(hh(i + 40) * 620).toFixed(0)}" r="${(1 + hh(i + 9) * 2).toFixed(1)}" fill="#FFF6E6" opacity="${Math.max(0, .25 + .4 * hh(i + 3) - .45 * k).toFixed(2)}"/>`;
    [[-30, 150, 360], [140, 120, 260], [820, 130, 300], [960, 160, 400]].forEach(([x, w, h]) => o += R(x, 1180 - h, w, h, 4, '#0F1530'));
    o += R(-100, 1180, 1280, 800, 0, '#141A2E') + R(-100, 1180, 1280, 8, 0, '#2E3A5C');
    o += okul(540, 1180, 800, 480, t, k) + duman(540, 780, 640, t, 3, k);
    o += `<ellipse cx="540" cy="1196" rx="${F1(300 + 260 * k)}" ry="${F1(40 + 30 * k)}" fill="#FF6A1F" opacity="${(.28 * k).toFixed(2)}"/>`;
    o += kalab(540, 1585, 1360, 22, t, '#070A14', clmp((t - 5.4) / 1.6), 1.3);
    o += ET(t, .2, 2.2, 'BİR LİSEDEN BAŞLAYAN İSYAN', '#E8323C', '#FFFFFF', 52, 470, -2);
    o += ET(t, 2.3, 4.6, 'FRANSA\'YI ERKEN SEÇİME', '#FFD23F', '#1B2440', 54, 440, -2) + ET(t, 2.5, 4.6, 'Mİ GÖTÜRECEK?', '#FFFFFF', '#E8323C', 74, 620, 2);
    o += MO.sar(R(-300, -46, 600, 92, 46, '#0B1433') + `<rect x="-300" y="-46" width="600" height="92" rx="46" fill="none" stroke="#7FA6FF" stroke-width="4"/><rect x="-262" y="-18" width="38" height="36" fill="#2A4FA8"/><rect x="-224" y="-18" width="38" height="36" fill="#F4F4F4"/><rect x="-186" y="-18" width="38" height="36" fill="#E8323C"/>` + txt('DEVRİMLERİN ÜLKESİ', 50, 14, 38, '#FFF6E6'), MO.oge(t, { gir: 4.9, cik: 6.3, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 470, { golge: false });
    o += ET(t, 6.5, 8.4, 'OKULLAR YANIYOR', '#E8323C', '#FFFFFF', 76, 470, -3);
    o += ET(t, 8.5, 9.5, 'SOKAKLAR ALEVLER İÇİNDE', '#FF8A4A', '#1B2440', 50, 470, -2);
    o += MO.sar(zamanChip('İPUCU SONDA', 0, 0, '#FFD23F', '#1B2440', 40), MO.oge(t, { gir: 9.6, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 470, { golge: false });
    return o;
  },
  onCiz: t => ''
});"""

# 02 — PARİS BANLİYÖSÜ (10,5–16,5): gerçek Fransa haritası → Paris/Créteil → lise
S[2] = r"""
const HMF = H.ciz({ ulkeler: H.ulke('Fransa', 'İspanya', 'Almanya', 'İtalya', 'İsviçre', 'Belçika', 'Lüksemburg', 'Birleşik Krallık', 'İrlanda', 'Hollanda', 'Portekiz', 'Andorra'),
  sigdir: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[-5.5, 41], [-5.5, 51.5], [9.5, 51.5], [9.5, 41], [-5.5, 41]]] } }],
  vurgu: { 'Fransa': '#E9DDC2' }, renk: '#26304F', rim: '#6F83B3', golge: '#05070F', sinir: '#6F83B3', kutu: [20, 380, 1040, 820], proj: 'mercator' });
const PRS = HMF.p([2.35, 48.86]), CRS = HMF.p([2.46, 48.78]);
MO.sahne({
  zemin: MO.zemin({ ust: '#0C1530', alt: '#060A18', isik: [540, 760, '#3E6FB8', .16] }),
  kamera: [[0, 1.0, 540, 790], [1.3, 3.2, PRS[0], PRS[1] + 10, 2.6, 'kamera']],
  ciz: t => {
    let o = `<rect x="20" y="380" width="1040" height="820" rx="36" fill="#0F1A38"/>` + HMF.svg;
    const pk = fd(t, 3.9, 4.3), pu = (t * 1.2) % 1;
    o += `<circle cx="${F1(PRS[0])}" cy="${F1(PRS[1])}" r="${F1(5 + 3 * Math.sin(t * 5))}" fill="#FFD23F"/>`;
    if (t > 3.0) o += `<circle cx="${F1(CRS[0])}" cy="${F1(CRS[1])}" r="${F1(3 + 22 * pu)}" fill="none" stroke="#FF6A1F" stroke-width="${F1(2.5 * (1 - pu))}" opacity="${(.9 * (1 - pu)).toFixed(2)}"/>` + `<circle cx="${F1(CRS[0])}" cy="${F1(CRS[1])}" r="3.2" fill="#FF6A1F"/>`;
    if (pk > 0) o += `<g transform="translate(${F1(CRS[0])} ${F1(CRS[1] - 10)}) scale(${(.2 * ob(pk)).toFixed(3)})">` + okulK(0, 0, 1, 0, t, 2) + `</g>`;
    return o;
  },
  onCiz: t => ET(t, .25, 2.4, 'EYLÜL 2026', '#0B1433', '#FFD23F', 50, 470, -2) + ET(t, 4.6, 6.2, 'KIVILCIM: BİR SINIF', '#E8323C', '#FFFFFF', 54, 470, -2) + MF(t, { gd: 'merak', ih: [PRS[0] > 0 ? 540 : 540, 700], bh: [540, 800] })
});"""

# 03 — 36 ÖĞRENCİ (16,5–20,6): sınıf üstten, sayaç 1→36 · "dolmuşun tam iki katı"
S[3] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203E', alt: '#070C1C', isik: [540, 700, '#FFD27A', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'sokak', 'BİR SINIF', '#FFD27A', .05, 420);
    let c = '';
    const n = clmp((t - .7) / 1.7) * 36;
    for (let i = 0; i < 36; i++) { const r = Math.floor(i / 6), q = i % 6; c += ogr(-215 + q * 86, -180 + r * 82, .82, i, clmp(n - i)); }
    o += PK(t, .15, 99, `<rect x="-420" y="-280" width="840" height="540" rx="30" fill="#1B2A55" opacity=".0"/>` + c, 700, 920, 600);
    o += MO.sar(R(-110, -52, 220, 104, 52, '#0B1433') + `<rect x="-110" y="-52" width="220" height="104" rx="52" fill="none" stroke="#FFD27A" stroke-width="5"/>` + txt(String(Math.max(0, Math.min(36, Math.floor(n + .0001)))), 0, 30, 84, '#FFFFFF'), MO.oge(t, { gir: .5, agirlik: 'orta', giris: 'olcek', x: 540 }), 540, 1090, { golge: false });
    const d1 = fd(t, 2.5, 2.9), d2 = fd(t, 3.1, 3.5);
    if (d1 > 0) o += `<g opacity="${d1.toFixed(2)}" transform="translate(${F1(-300 * (1 - ob(d1)))} 0)">` + dolmus(250, 1290, .62, clmp((t - 2.7) / .5) * 18) + `</g>`;
    if (d2 > 0) o += `<g opacity="${d2.toFixed(2)}" transform="translate(${F1(300 * (1 - ob(d2)))} 0)">` + dolmus(700, 1290, .62, clmp((t - 3.3) / .5) * 18) + `</g>`;
    if (d1 > 0) o += MO.sar(R(-52, -38, 104, 76, 38, '#E8323C') + txt('×2', 0, 20, 52, '#FFFFFF'), MO.oge(t, { gir: 3.3, agirlik: 'hafif', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1180, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'saskin', b: [['gufi', 2.6, 4.0, 'Çok kalabalık!']] })
});"""

# 04 — ÖĞRETMEN YOK + 40 DERECE (20,6–26,0)
S[4] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 760, '#FF8A4A', .16], ikinci: [900, 400, '#FFD23F', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.4, 'kamera']],
  sarsinti: [[2.5, 5]],
  ciz: t => {
    let o = '';
    const a = 1 - fd(t, 2.0, 2.3), b = fd(t, 2.0, 2.4);
    if (a > .01) { o += yBas(t, 'sokak', 'ÖĞRETMEN?', '#E8323C', .05, 420);
      o += `<g opacity="${a.toFixed(2)}">` + R(80, 560, 920, 520, 30, '#12203E') + R(130, 600, 820, 300, 12, '#1E5A46') + R(130, 600, 820, 300, 12, '#000', .0) + `<text x="540" y="770" font-size="64" font-weight="900" text-anchor="middle" style="fill:#FFFFFF" opacity=".25">?</text>` + R(330, 940, 420, 34, 8, '#B98A55') + R(350, 974, 24, 120, 4, '#8A5A3A') + R(706, 974, 24, 120, 4, '#8A5A3A') + R(430, 880, 220, 46, 10, '#6A4128') + R(500, 926, 12, 60, 3, '#6A4128') + R(560, 926, 12, 60, 3, '#6A4128') + `</g>`;
      o += MO.sar(etiket('KADRO BOŞ', 0, 0, '#E8323C', '#FFFFFF', 66, -4, 1), MO.oge(t, { gir: 1.1, cik: 2.1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 760, { golge: false }); }
    if (b > .01) { o += `<g opacity="${b.toFixed(2)}">` + prefab(480, 1060, 1.0, t) + gunes(850, 640, 70, t) + termo(110, 1130, .9, 22 + 18 * ob(clmp((t - 2.3) / 2.1))) + `</g>`;
      o += ET(t, 2.2, 5.5, 'PREFABRİK DERSLİK', '#FF8A4A', '#1B2440', 44, 470, -2);
      const dg = Math.round(22 + 18 * ob(clmp((t - 2.3) / 2.1)));
      o += MO.sar(R(-130, -64, 260, 128, 64, '#0B1433') + `<rect x="-130" y="-64" width="260" height="128" rx="64" fill="none" stroke="#FF8A4A" stroke-width="6"/>` + txt(dg + '°C', 0, 34, 84, dg >= 40 ? '#FF6A4A' : '#FFFFFF'), MO.oge(t, { gir: 2.3, agirlik: 'orta', giris: 'olcek', x: 540 }), 540, 590, { golge: false });
      if (t > 4.9) o += MO.sar(firin(0, 0, 1, t, ob(clmp((t - 4.9) / .4))) , MO.oge(t, { gir: 4.9, agirlik: 'agir', giris: 'olcek', x: 540 }), 800, 1000, { golge: false }); }
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'merak' })
});"""

# 05 — GUFİ ÖĞRENCİ (26,0–31,0): sıkışık sınıfta Gufi · "Bence dinleyemezdi"
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 800, '#FF8A4A', .16], ikinci: [200, 1500, '#3E6FB8', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.08, 540, 1000, 5.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'sokak', 'SINIFTA 36 KİŞİ', '#FFD27A', .05, 420);
    o += R(-100, 560, 1280, 800, 0, '#1B2A55') + R(-100, 1240, 1280, 14, 0, '#6A4128') + R(-100, 1254, 1280, 600, 0, '#3A2A24');
    o += R(60, 580, 960, 380, 12, '#1E5A46') + R(60, 580, 960, 380, 12, '#000', .0) + `<path d="M120 700 H400 M120 760 H320 M700 650 H940 M700 710 H880" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity=".35"/>`;
    o += kalab(540, 1250, 1300, 18, t, '#0B1330', 0, 1.1);
    o += kalab(540, 1290, 1100, 12, t, '#12204A', 0, 1.35);
    o += termo(940, 1260, .66, 40);
    o += gufi(t, { x: 540, y: 1330, boy: 340, duygu: 'merak', bakHedef: 'kamera', ust: KO.giy('gufi', ['gozluk', 'kep']) });
    o += `<g transform="translate(540 1330)"><path d="M-130 -150 q-26 40 -10 80 q26 -20 10 -80Z" fill="#9FD8FF" opacity="${(.5 + .5 * Math.sin(t * 4)).toFixed(2)}" transform="translate(-60 -20)"/></g>`;
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1650, boy: 150, duygu: t > 3.4 ? 'merak' : 'dusun', bakHedef: [540, 1100] }) + bm(t, 1.0, 2.8, 720, 1492, 'Gufi, ders?', { yon: 1 })
});"""

# 06 — BARİKAT (31,0–37,0): kapılar kapanır → barikat → çöp yangını → kapı tutuşur
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A1022', alt: '#05070F', isik: [540, 900, '#FF6A1F', .12], ikinci: [200, 400, '#3E6FB8', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.12, 540, 960, 6.0, 'kamera']],
  sarsinti: [[1.6, 10], [5.0, 12]],
  ciz: t => {
    let o = yBas(t, 'sokak', 'KAPILAR KAPANDI', '#FF8A4A', .05, 420);
    const kp = ob(fd(t, 1.2, 1.9)), f1 = fd(t, 3.7, 4.4), f2 = fd(t, 5.0, 5.9);
    o += R(-100, 1180, 1280, 800, 0, '#141A2E') + R(-100, 1180, 1280, 8, 0, '#2E3A5C');
    o += R(60, 560, 960, 640, 8, '#2C3558') + `<path d="M40 560 L540 440 L1040 560Z" fill="#1C2340"/>` + R(430, 700, 220, 480, 6, '#0F1428');
    // kapı kanatları
    o += `<g transform="translate(${F1(-250 * (1 - kp))} 0)">` + R(430, 700, 112, 480, 6, '#4A5272') + `</g><g transform="translate(${F1(250 * (1 - kp))} 0)">` + R(542, 700, 112, 480, 6, '#4A5272') + `</g>`;
    o += `<path d="M436 700 V1180 M648 700 V1180 M542 700 V1180" stroke="#8A94A8" stroke-width="5" opacity="${kp.toFixed(2)}"/>`;
    o += barikat(540, 1200, 1.45, clmp((t - 2.2) / 2.0));
    if (f1 > 0) o += alev(300, 1130, 150, 190, t, 4, f1);
    if (f2 > 0) o += alev(540, 1170, 200, 340, t, 7, f2) + duman(540, 840, 400, t, 2, f2);
    if (f1 > 0) o += `<ellipse cx="540" cy="1196" rx="${F1(280 + 200 * f2)}" ry="46" fill="#FF6A1F" opacity="${(.2 * (f1 + f2)).toFixed(2)}"/>`;
    o += kalab(540, 1620, 1400, 24, t, '#070A14', clmp((t - 3.2) / 1.2), 1.35);
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'merak' })
});"""

# 07 — ONLARCA OKUL + 4'TE 1 (37,0–43,4)
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 760, '#FF6A1F', .18], ikinci: [900, 400, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.4, 'kamera']],
  ciz: t => {
    let o = '';
    const g = 1 - fd(t, 3.0, 3.4), h = fd(t, 3.0, 3.5);
    if (g > .01) { o += yBas(t, 'sokak', 'ONLARCA OKUL', '#E8323C', .05, 420);
      o += `<g opacity="${g.toFixed(2)}">`;
      for (let i = 0; i < 24; i++) { const r = Math.floor(i / 6), q = i % 6, k = clmp((t - .3 - i * .09) / .45); o += okulK(110 + q * 172, 740 + r * 165, .8, ob(k) * (k > 0 ? 1 : 0), t, i + 1); }
      o += `</g>`; }
    if (h > .01) { o += `<g opacity="${h.toFixed(2)}">` + yBas(t, 'sokak', 'HER 4 LİSEDEN 1\'İ', '#FFD27A', .05, 420);
      for (let i = 0; i < 4; i++) { const k = i === 3 ? clmp((t - 4.3) / .6) : 0; o += `<g transform="translate(${F1(165 + i * 250)} 900)">` + R(-112, -250, 224, 380, 24, '#16204A', .9) + okulK(0, 40, 1.5, k, t, i + 5) + `</g>`; }
      o += `</g>`; }
    if (t > 4.9) o += MO.sar(R(-130, -70, 260, 140, 70, '#E8323C') + txt('1/4', 0, 34, 86, '#FFFFFF'), MO.oge(t, { gir: 4.9, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1140, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'saskin' })
});"""

# 08 — HÜKÜMET / SENDİKA (43,4–48,3)
S[8] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203E', alt: '#070C1C', isik: [540, 760, '#7FA6FF', .14], ikinci: [900, 1400, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.9, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'ev', 'HÜKÜMET', '#7FA6FF', .05, 420);
    const kk = ob(fd(t, .3, .9));
    o += `<g transform="translate(540 760) scale(${kk.toFixed(3)})">` + R(-380, -190, 760, 360, 36, '#F4F1E8') + R(-380, -190, 760, 70, 36, '#2A4FA8') + R(-380, -150, 760, 30, 0, '#2A4FA8') + txt('YEDEK ÖĞRETMEN', 0, -140, 40, '#FFFFFF') + txt('3.000', 0, 30, 150, '#1B2440');
    for (let i = 0; i < 9; i++) o += `<g transform="translate(${-240 + i * 60} 110)"><circle cy="-12" r="14" fill="#F2C9A0"/><path d="M-18 40 Q-18 6 0 4 Q18 6 18 40Z" fill="${['#3E8EDE', '#E8774A', '#2FBF71'][i % 3]}"/></g>`;
    o += `</g>`;
    const y = fd(t, 3.0, 3.5);
    if (y > 0) { o += MO.sar(R(-210, -70, 420, 140, 36, '#16204A') + `<rect x="-210" y="-70" width="420" height="140" rx="36" fill="none" stroke="#E8323C" stroke-width="6"/>` + txt('SENDİKALAR', 0, -14, 36, '#C8D0DC') + txt('"YETMEZ"', 0, 44, 62, '#FF6A6A'), MO.oge(t, { gir: 3.0, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1150, { golge: false }); }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 09 — POLİS / GAZ / GÖZALTI (48,3–56,6)
S[9] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A1022', alt: '#05070F', isik: [540, 900, '#7FA6FF', .10], ikinci: [900, 400, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 960, 8.2, 'kamera']],
  sarsinti: [[1.8, 8], [2.2, 6]],
  ciz: t => {
    let o = '';
    const a = 1 - fd(t, 3.4, 3.8), b = fd(t, 3.4, 3.9);
    if (a > .01) { o += yBas(t, 'sokak', 'SOKAKTA', '#7FA6FF', .05, 420) + `<g opacity="${a.toFixed(2)}">`;
      o += R(-100, 1100, 1280, 800, 0, '#141A2E') + R(-100, 1100, 1280, 8, 0, '#2E3A5C');
      const sp = ob(fd(t, .2, 1.2));
      for (let i = 0; i < 7; i++) o += `<g transform="translate(${F1(1300 - sp * 1130 + i * 150)} 1100)"><circle cy="-250" r="26" fill="#0E1838"/><path d="M-40 0 Q-40 -170 0 -210 Q40 -170 40 0Z" fill="#0E1838"/><rect x="-62" y="-190" width="46" height="150" rx="14" fill="#2A4FA8" opacity=".9"/></g>`;
      for (let i = 0; i < 3; i++) { const q = fd(t, 1.5 + i * .35, 2.6 + i * .35); if (q > 0 && q < 1) o += `<circle cx="${F1(260 + 300 * q + i * 140)}" cy="${F1(780 - 190 * Math.sin(Math.PI * q))}" r="14" fill="#C8D0DC"/>`; const g = fd(t, 2.5 + i * .35, 4.0); o += `<circle cx="${F1(560 + i * 150)}" cy="1000" r="${F1(40 + 170 * g)}" fill="#C8D0DC" opacity="${(.45 * (1 - g) * (g > 0 ? 1 : 0)).toFixed(2)}"/>`; }
      o += kalab(300, 1390, 800, 12, t, '#070A14', .7, 1.3) + `</g>`; }
    if (b > .01) { o += `<g opacity="${b.toFixed(2)}">` + yBas(t, 'kalp', 'GÖZALTI', '#E8323C', .05, 420);
      const n = Math.round(6000 * ob(clmp((t - 3.9) / 2.2)));
      for (let i = 0; i < 60; i++) { const r = Math.floor(i / 12), q = i % 12, k = clmp((t - 3.9 - i * .035) / .25); if (k > 0) o += `<g transform="translate(${F1(100 + q * 78)} ${F1(600 + r * 76)}) scale(${ob(k).toFixed(2)})"><circle cy="-14" r="14" fill="${i % 7 < 6 ? '#7FD0FF' : '#C8D0DC'}"/><path d="M-18 24 Q-18 0 0 -2 Q18 0 18 24Z" fill="${i % 7 < 6 ? '#7FD0FF' : '#C8D0DC'}"/></g>`; }
      o += MO.sar(R(-260, -90, 520, 180, 44, '#0B1433') + `<rect x="-260" y="-90" width="520" height="180" rx="44" fill="none" stroke="#E8323C" stroke-width="6"/>` + txt(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '+', 0, 38, 118, '#FFFFFF'), MO.oge(t, { gir: 3.9, agirlik: 'agir', giris: 'olcek', x: 540 }), 540, 1090, { golge: false });
      o += MO.sar(R(-260, -48, 520, 96, 48, '#FFD23F') + txt('ÇOĞU 18 YAŞ ALTI', 0, 18, 46, '#1B2440'), MO.oge(t, { gir: 6.4, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1250, { golge: false });
      o += `</g>`; }
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'saskin' })
});"""

# 10 — 15 YAŞINDA BİR GENÇ (56,6–60,4): sakin, sessiz
S[10] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0E1E', alt: '#04060E', isik: [540, 900, '#7FA6FF', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 3.8, 'kamera']],
  ciz: t => {
    let o = '';
    o += R(-100, 1100, 1280, 800, 0, '#10162A') + `<path d="M540 520 L400 1100 H680Z" fill="#FFE9A8" opacity=".10"/>` + `<ellipse cx="540" cy="1100" rx="260" ry="34" fill="#FFE9A8" opacity=".10"/>`;
    o += `<g transform="translate(470 1060)">` + R(-70, -200, 140, 200, 28, '#2A4FA8') + R(-56, -170, 112, 70, 14, '#1F3B80') + `<path d="M-52 -200 Q0 -280 52 -200" stroke="#1F3B80" stroke-width="14" fill="none"/>` + `<path d="M-40 -200 V-120 M40 -200 V-120" stroke="#E8323C" stroke-width="6" opacity=".0"/></g>`;
    o += `<g transform="translate(660 1090)"><path d="M-70 0 Q-70 -50 0 -54 L70 -30 Q96 -20 96 0Z" fill="#EEF1F8"/><path d="M-72 -4 H96" stroke="#8A94A8" stroke-width="8"/></g>`;
    o += MO.sar(R(-300, -66, 600, 132, 40, '#0B1433') + txt('15 YAŞINDA BİR GENÇ', 0, 14, 50, '#FFF6E6'), MO.oge(t, { gir: .2, cik: 2.4, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 520, { golge: false });
    o += MO.sar(etiket('OLAY SORUŞTURULUYOR', 0, 0, '#FFD23F', '#1B2440', 44, -2, 1), MO.oge(t, { gir: 2.6, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 520, { golge: false });
    o += `<rect x="0" y="0" width="1080" height="1920" fill="#000" opacity=".22"/>`;
    return o;
  },
  onCiz: t => MF(t, { gd: 'uzgun', gf: 'uzgun' })
});"""

# 11 — 900+ POLİS YARALI (60,4–64,0): dengeli anlatım
S[11] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203E', alt: '#070C1C', isik: [540, 760, '#7FA6FF', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 3.6, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'kalp', 'POLİS DE YARALI', '#7FA6FF', .05, 420);
    const n = Math.round(900 * ob(clmp((t - .9) / 1.6)));
    o += MO.sar(`<g>` + R(-300, -190, 600, 380, 40, '#16204A') + `<rect x="-300" y="-190" width="600" height="380" rx="40" fill="none" stroke="#7FA6FF" stroke-width="5"/><path d="M-70 -50 Q-70 -150 0 -150 Q70 -150 70 -50 L90 -20 H-90Z" fill="#2A4FA8"/><rect x="-96" y="-24" width="192" height="26" rx="10" fill="#1F3B80"/><rect x="-14" y="-110" width="28" height="60" rx="8" fill="#FFFFFF" opacity=".8"/>` + txt(n + '+', 0, 150, 108, '#FFFFFF') + `</g>`, MO.oge(t, { gir: .4, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 840, { golge: false });
    o += MO.sar(zamanChip('HÜKÜMETE GÖRE', 0, 0, '#FFD23F', '#1B2440', 44), MO.oge(t, { gir: 2.2, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 1130, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'saskin' })
});"""

# 12 — 1968 (64,0–71,0): ipucu → afiş → erken seçim
S[12] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241A10', alt: '#0A0806', isik: [540, 760, '#FFD27A', .16], ikinci: [900, 1400, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 960, 7.0, 'kamera']],
  ciz: t => {
    let o = '';
    const af = ob(fd(t, 1.2, 2.0)), sec = fd(t, 4.8, 5.8);
    o += MO.sar(zamanChip('İPUCU', 0, 0, '#FFD23F', '#1B2440', 44), MO.oge(t, { gir: .25, cik: 1.4, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 470, { golge: false });
    // 1968 afişi
    o += `<g transform="translate(540 ${F1(780 - 40 * (1 - af))}) rotate(-3) scale(${af.toFixed(3)})" opacity="${(1 - sec * .55).toFixed(2)}">` + R(-330, -300, 660, 600, 14, '#EBDDB8') + R(-300, -270, 600, 540, 6, '#D93A2B') + `<circle cx="0" cy="-40" r="160" fill="#EBDDB8"/><path d="M-52 110 L-40 -20 H40 L52 110Z" fill="#1B1B22"/><rect x="-62" y="-130" width="124" height="118" rx="30" fill="#1B1B22"/><path d="M-31 -118 V-72 M0 -122 V-72 M31 -118 V-72" stroke="#EBDDB8" stroke-width="5" stroke-linecap="round"/><rect x="-96" y="-86" width="46" height="30" rx="15" fill="#1B1B22" transform="rotate(-12 -73 -71)"/>` + txt('MAYIS 1968', 0, 220, 78, '#1B1B22') + txt('ÖĞRENCİ İSYANI', 0, 262, 34, '#EBDDB8') + `</g>`;
    o += MO.sar(etiket('1968', 0, 0, '#E8323C', '#FFFFFF', 96, -4, 1), MO.oge(t, { gir: 2.8, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1150, { golge: false });
    if (sec > 0) { o += `<g opacity="${sec.toFixed(2)}">` + zarfOy(540, 880, 1.25, ob(clmp((t - 5.0) / 1.2))) + `</g>`;
      o += MO.sar(etiket('ERKEN SEÇİM', 0, 0, '#2A4FA8', '#FFFFFF', 62, -2, 1), MO.oge(t, { gir: 5.6, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1150, { golge: false }); }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 13 — 6 AY KALA (71,0–76,3)
S[13] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203E', alt: '#070C1C', isik: [540, 760, '#7FA6FF', .14], ikinci: [900, 400, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.3, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'ev', 'CUMHURBAŞKANLIĞI SEÇİMİ', '#7FA6FF', .05, 420);
    o += takvim(540, 900, 1000, .6, t);
    o += MO.sar(R(-200, -76, 400, 152, 76, '#E8323C') + txt('6 AY', 0, 38, 108, '#FFFFFF'), MO.oge(t, { gir: 2.3, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1090, { golge: false });
    const q = ob(fd(t, 3.5, 4.1)) * (1 - fd(t, 4.6, 4.9));
    if (q > 0) o += `<text x="540" y="${F1(720 + 20 * (1 - q))}" font-size="${F1(360 * q)}" font-weight="900" text-anchor="middle" style="fill:#FFD23F" opacity=".92" transform="rotate(${F1(Math.sin(t * 6) * 6)} 540 720)">?</text>`;
    o += ET(t, 4.7, 99, 'KİMSE BİLMİYOR', '#0B1433', '#FFD23F', 60, 1250, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'saskin' })
});"""

# 14 — GUBİ HAKEM + TERAZİ (76,3–83,6)
S[14] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203E', alt: '#070C1C', isik: [540, 760, '#FFD23F', .14], ikinci: [200, 1400, '#3E6FB8', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 1000, 7.2, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'sokak', 'SENCE HAKLILAR MI?', '#FFD23F', .05, 420);
    const ang = t < 4.9 ? Math.sin(t * 1.3) * 5 : (t < 6.1 ? 14 : (t < 7.2 ? -14 : 0)) * ob(fd(t, 4.9, 5.2));
    const sol = `<g transform="scale(.8)"><g transform="translate(0 -20)">` + ogr(0, 0, 1.2, 3, 1) + `</g></g>`, sag = `<g transform="translate(0 -40)">` + alev(0, 30, 90, 100, t, 3, 1) + `</g>`;
    o += teraziF(540, 760, .95, ang, sol, sag);
    o += gubi(t, { x: 540, y: 1215, boy: 270, duygu: 'merak', bakHedef: 'kamera', ust: KO.giy('gubi', ['gozluk']) });
    o += MO.sar(zamanChip('SORUN GERÇEK', 0, 0, '#3E8EDE', '#FFFFFF', 34), MO.oge(t, { gir: 5.0, cik: 6.2, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 230, 1130, { golge: false });
    o += MO.sar(zamanChip('YÖNTEM TARTIŞMALI', 0, 0, '#E8774A', '#FFFFFF', 34), MO.oge(t, { gir: 6.2, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 850, 1130, { golge: false });
    return o;
  },
  onCiz: t => gufi(t, { x: 200, y: 1840, boy: 210, duygu: 'merak', bakHedef: [540, 1100] })
});"""

# 15 — YORUM (83,6–86,4): EVET / HAYIR
S[15] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 760, '#FFD23F', .16] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 2.8, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(R(-420, -86, 840, 172, 50, '#0B1433') + `<rect x="-420" y="-86" width="840" height="172" rx="50" fill="none" stroke="#FFD23F" stroke-width="6"/>` + txt('SENCE HAKLILAR MI?', 0, 30, 66, '#FFF6E6'), MO.oge(t, { gir: .1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 560, { golge: false });
    const pl = 1 + .03 * Math.sin(t * 7);
    o += MO.sar(R(-210, -110, 420, 220, 56, '#1F9E5B') + txt('EVET', 0, 38, 100, '#FFFFFF'), MO.oge(t, { gir: .5, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 310, 900, { golge: false });
    o += MO.sar(R(-210, -110, 420, 220, 56, '#E8323C') + txt('HAYIR', 0, 38, 100, '#FFFFFF'), MO.oge(t, { gir: .8, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 770, 900, { golge: false });
    o += MO.sar(zamanChip('YORUMLARA YAZ', 0, 0, '#FFD23F', '#1B2440', 46), MO.oge(t, { gir: 1.4, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1140, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 16 — TAKİP (86,4–90,1)
S[16] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#101A30', alt: '#0A0F1C', isik: [540, 760, '#FFD23F', .22], supurme: .04 }),
  kamera: [[0, 1.08, 540, 800], [.1, 1.0, 540, 900, 2.6, 'kamera']],
  ciz: t => {
    const kart = R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FFD23F" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF');
    let o = MO.sar(kart, MO.oge(t, { gir: .04, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 760);
    const bs = t > 2.1 && t < 2.25 ? .92 : 1;
    o += MO.sar(`<g transform="scale(${bs})">` + R(-220, -40, 440, 80, 40, '#FFD23F') + AU.yaz('+ TAKİP ET', 0, 18, 46, '#1B2440') + '</g>', MO.oge(t, { gir: 1.4, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 300, y: 1540, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1720, boy: 220, duygu: 'mutlu', bakHedef: 'kamera' })
});"""
