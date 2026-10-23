S = {}
# 01 — KANCA (0–8,2): KADININ BEYANI ESASTIR → sırf bir sözle hapse mi? → cevap seni şaşırtacak
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1020', alt: '#0B0610', isik: [540, 820, '#E8323C', .22], ikinci: [900, 300, '#E8B04A', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.07, 540, 940, 8.0, 'kamera']],
  sarsinti: [[.05, 10], [.45, 10], [1.05, 16]],
  ciz: t => {
    let o = '';
    o += ET(t, .05, 2.0, 'KADININ', '#E8323C', '#FFFFFF', 104, 540, -3) + ET(t, .42, 2.0, 'BEYANI', '#FFFFFF', '#E8323C', 104, 710, 2) + ET(t, 1.0, 2.0, 'ESASTIR', ALTIN, MUREK, 124, 890, -2);
    const kk = fd(t, 2.1, 2.5) * (1 - fd(t, 5.1, 5.4));
    if (kk > .01) {
      o += `<g opacity="${kk.toFixed(2)}">`;
      o += `<g transform="translate(300 1080) scale(1.8)">` + silK('kadin', '#FFF6E6') + `</g>`;
      o += R(120, 760, 360, 130, 54, '#FFF6E6') + `<path d="M270 888 L300 940 L330 888Z" fill="#FFF6E6"/>` + [0, 1, 2].map(i => `<circle cx="${210 + i * 60}" cy="825" r="${F1(12 + 4 * Math.max(0, Math.sin(t * 6 - i)))}" fill="${MUREK}"/>`).join('');
      o += `<g transform="translate(770 1080) scale(1.8)">` + silK('adam', '#AEB8D0') + `</g>`;
      if (t > 3.95) o += `<g transform="translate(770 1040)">` + kafesK(300, 420, ob(fd(t, 3.9, 4.5))) + `</g>`;
      o += `</g>`;
      o += ET(t, 2.15, 5.0, 'SIRF BİR SÖZLE', '#FFD23F', MUREK, 76, 500, -2) + ET(t, 3.5, 5.1, 'HAPSE Mİ?', '#E8323C', '#FFFFFF', 116, 680, 2);
    }
    const q = fd(t, 5.1, 5.45);
    if (q > .01) {
      o += `<g opacity="${q.toFixed(2)}">`;
      for (let i = 0; i < 14; i++) { const a = i * Math.PI * 2 / 14 + t * .3; o += `<path d="M540 1040 L${F1(540 + Math.cos(a - .06) * 700)} ${F1(1040 + Math.sin(a - .06) * 700)} L${F1(540 + Math.cos(a + .06) * 700)} ${F1(1040 + Math.sin(a + .06) * 700)}Z" fill="${ALTIN}" opacity="${t > 7.1 ? .16 : .06}"/>`; }
      const pp = .9 + .1 * ob(fd(t, 5.5, 6.3));
      o += `<g transform="translate(540 1040) rotate(${F1(Math.sin(t * 3) * 6)}) scale(${(1.35 * pp).toFixed(3)})">` + (t > 7.15 ? `<g transform="scale(${(1 + .1 * ob(fd(t, 7.15, 7.5))).toFixed(3)})"><circle r="150" fill="#E8323C"/><text y="86" font-size="230" font-weight="900" text-anchor="middle" style="fill:#FFFFFF">!</text></g>` : soru(1)) + `</g></g>`;
      o += ET(t, 5.45, 8.1, 'CEVAP SENİ', '#FFFFFF', '#E8323C', 90, 470, -2) + ET(t, 6.2, 8.1, 'ŞAŞIRTACAK', '#FFD23F', MUREK, 106, 680, 2);
    }
    return o;
  },
  onCiz: t => ''
});"""

# 02 — KANUNDA YAZMIYOR (8,2–15,5)
S[2] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2B1B12', alt: '#0E0806', isik: [540, 860, '#E8B04A', .22], ikinci: [200, 1500, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 980, 7.2, 'kamera']],
  ciz: t => {
    let o = '';
    const bit = 1 - fd(t, 2.9, 3.3), kit = ob(fd(t, .05, .7));
    if (bit > .01) {
      o += `<g opacity="${bit.toFixed(2)}"><g transform="translate(540 ${F1(1010 + 70 * (1 - kit))}) rotate(${F1(-4 * (1 - kit))})">` + kitapK(1.32, 'KANUN', t > .75 ? 1 : 0) + `</g>`;
      if (t > .9) { const mx = 540 + (-230 + 460 * fd(t, 1.0, 2.2)), my = 960 + 40 * Math.sin(t * 5) + 30 * Math.floor((t - 1) * 2 % 2) * 0; o += `<g transform="translate(${F1(mx)} ${F1(my)})" opacity="${fd(t, .9, 1.1).toFixed(2)}">` + mercek(1.5) + `</g>`; }
      o += `</g>`;
      o += MO.sar(damga('KANUNDA YOK', '#E8323C', 96, -8), MO.oge(t, { gir: 2.2, cik: 3.0, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1010, { golge: false });
      o += ET(t, .2, 3.0, 'KANUNDA ARIYORUZ…', '#FFD23F', MUREK, 54, 480, -2);
    }
    const hb = fd(t, 3.0, 3.5) * (1 - fd(t, 5.3, 5.7));
    if (hb > .01) {
      o += `<g opacity="${hb.toFixed(2)}">` + kalab(540, 1330, 1400, 18, t, '#1B1626', 1, 1.25) + R(110, 640, 860, 230, 64, '#FFF6E6') + `<path d="M340 868 L380 960 L430 868Z" fill="#FFF6E6"/>` + txt('"Kadının beyanı', 540, 735, 62, MUREK) + txt('esastır"', 540, 820, 62, MUREK) + `</g>`;
      o += ET(t, 3.3, 5.45, 'HALK ARASINDA', '#FFD23F', MUREK, 58, 470, -2) + ET(t, 4.0, 5.45, 'KISA ÖZET', '#FFFFFF', '#E8323C', 76, 1010, 2);
    }
    const kn = fd(t, 5.75, 6.0);
    if (kn > .01) {
      o += `<g transform="translate(540 1030) scale(${(1.15 * ob(fd(t, 5.75, 6.35))).toFixed(3)}) rotate(${F1(Math.sin(t * 3) * 5)})">` + soru(1) + `</g>`;
      o += ET(t, 5.8, 99, 'PEKİ KURAL NE?', '#FFFFFF', '#E8323C', 86, 600, -2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 03 — 6284 SAYILI KANUN (15,5–23,5)
S[3] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#10262E', alt: '#060C10', isik: [540, 840, '#2FBFA8', .20], ikinci: [900, 300, '#E8B04A', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 8.0, 'kamera']],
  ciz: t => {
    let o = '';
    const a = 1 - fd(t, 2.2, 2.6);
    if (a > .01) {
      o += `<g opacity="${a.toFixed(2)}"><g transform="translate(540 ${F1(1030 + 60 * (1 - ob(fd(t, .1, .7))))}) rotate(${F1(3 * Math.sin(t))})">` + kitapK(1.1, 'KANUN') + `</g></g>`;
      o += MO.sar(R(-210, -90, 420, 180, 46, MUREK) + `<rect x="-210" y="-90" width="420" height="180" rx="46" fill="none" stroke="${ALTIN}" stroke-width="6"/>` + txt('6284', 0, 40, 130, ALTIN), MO.oge(t, { gir: .35, cik: 2.4, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 540, { golge: false });
      o += ET(t, 1.0, 2.4, 'SAYILI KANUN', '#FFFFFF', BORDO, 54, 700, -2);
    }
    o += ET(t, 2.3, 4.4, 'ŞİDDET GÖRENLER', '#E8323C', '#FFFFFF', 68, 480, -2) + ET(t, 3.3, 4.4, 'YA DA TEHLİKEDE', '#FFD23F', MUREK, 58, 640, 2);
    const ic = [
      `<g transform="translate(0 -4) scale(1.05)">` + silK('kadin', '#FFFFFF') + `</g>`,
      `<g transform="translate(0 20) scale(1.5)">` + silK('cocuk', '#FFFFFF') + `</g>`,
      `<g transform="translate(-34 -2) scale(.7)">` + silK('adam', '#FFFFFF') + `</g><g transform="translate(30 -2) scale(.7)">` + silK('kadin', '#FFFFFF') + `</g><g transform="translate(0 30) scale(.7)">` + silK('cocuk', '#FFFFFF') + `</g>`];
    [[4.6, 190, '#E8323C', 'KADIN'], [5.5, 540, '#3E8EDE', 'ÇOCUK'], [6.3, 890, ALTIN, 'AİLE']].forEach(([g, x, rk, ad], i) => {
      o += MO.sar(kalkanK(1.0, rk, ic[i]), MO.oge(t, { gir: g, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x }), x, 860, { golge: false });
      o += MO.sar(R(-130, -40, 260, 80, 40, '#0B1433', .92) + txt(ad, 0, 20, 44, '#FFF6E6'), MO.oge(t, { gir: g + .25, agirlik: 'hafif', giris: 'yuksel', x }), x, 1090, { golge: false });
    });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'endise' })
});"""

# 04 — 8. MADDE: DELİL ARANMAZ → neden → geç kalırsın (23,5–37,0)
S[4] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241A2E', alt: '#0A0710', isik: [540, 860, '#E8B04A', .18], ikinci: [900, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 13.5, 'kamera']],
  sarsinti: [[5.6, 8], [12.6, 12]],
  ciz: t => {
    let o = '';
    const A = 1 - fd(t, 5.3, 5.7), B = fd(t, 5.5, 5.9) * (1 - fd(t, 10.7, 11.1)), C = fd(t, 10.9, 11.3);
    if (A > .01) {
      o += `<g opacity="${A.toFixed(2)}">` + MO.sar(sayfaK(780, 560, 7, 3, 'MADDE 8'), MO.oge(t, { gir: .1, cik: 5.3, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 740, { golge: false }) + `</g>`;
      o += ET(t, 1.8, 5.3, 'KORUMA TEDBİRİ İÇİN', '#FFD23F', MUREK, 54, 440, -2);
      o += ET(t, 3.7, 5.3, 'DELİL YA DA BELGE', '#FFFFFF', '#E8323C', 54, 1090, -2) + ET(t, 4.9, 5.4, 'ARANMAZ', '#E8323C', '#FFFFFF', 74, 1200, 2);
    }
    if (B > .01) {
      o += `<g opacity="${B.toFixed(2)}">`;
      o += `<g transform="translate(540 900)">` + kapiK(1.1, Math.max(0, .8 * (1 - fd(t, 9.0, 9.8)))) + `</g>`;
      const ex = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${(1.2 * ob(k)).toFixed(3)})"><circle r="80" fill="#14101E"/>` + `<path d="M-52 0 Q0 -40 52 0 Q0 40 -52 0Z" fill="#FFF6E6"/><circle r="18" fill="${MUREK}"/>` + `</g>`;
      const kam = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${(1.2 * ob(k)).toFixed(3)})"><circle r="80" fill="#14101E"/>` + R(-44, -22, 66, 44, 8, '#FFF6E6') + `<path d="M22 -10 L48 -22 V22 L22 10Z" fill="#FFF6E6"/><circle cx="-12" cy="0" r="10" fill="${MUREK}"/></g>`;
      const x2 = (x, y, k) => k <= 0 ? '' : `<g transform="translate(${x} ${y}) scale(${ob(k).toFixed(3)})"><path d="M-46 -46 L46 46 M46 -46 L-46 46" stroke="#E8323C" stroke-width="14" stroke-linecap="round" opacity=".9"/></g>`;
      if (t > 7.0) o += ex(180, 800, fd(t, 7.0, 7.5)) + x2(180, 800, fd(t, 7.5, 7.9));
      if (t > 8.0) o += kam(900, 800, fd(t, 8.0, 8.5)) + x2(900, 800, fd(t, 8.5, 8.9));
      o += `</g>`;
      o += ET(t, 5.6, 7.0, 'ŞİDDET ÇOĞU ZAMAN', '#FFFFFF', '#E8323C', 52, 470, -2);
      o += ET(t, 7.1, 10.6, 'TANIKSIZ', '#FFD23F', MUREK, 62, 1090, -2) + ET(t, 8.1, 10.6, 'KAMERASIZ', '#FFD23F', MUREK, 62, 1200, 2);
      o += ET(t, 9.2, 10.7, 'KAPALI KAPILAR ARDINDA', '#E8323C', '#FFFFFF', 50, 470, -2);
    }
    if (C > .01) {
      o += `<g opacity="${C.toFixed(2)}"><g transform="translate(540 880) rotate(${F1(Math.sin(t * 20) * (t > 12.4 ? 4 : 0))})">` + saatK(1.7, Math.max(0, t - 11.0) * 1.6, 1) + `</g></g>`;
      o += ET(t, 11.0, 13.4, 'DELİL BEKLERSEN', '#FFD23F', MUREK, 62, 470, -2);
      o += ET(t, 12.5, 13.5, 'GEÇ KALIRSIN', '#E8323C', '#FFFFFF', 86, 1150, 2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'endise' })
});"""

# 05 — HÂKİM · UZAKLAŞTIRMA · 6 AY · MAHKÛMİYET DEĞİL (37,0–43,9)
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1D1530', alt: '#0A0714', isik: [540, 800, '#E8B04A', .20], ikinci: [200, 1400, '#2FBFA8', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 6.9, 'kamera']],
  sarsinti: [[.45, 14], [5.5, 8]],
  ciz: t => {
    let o = '';
    const A = 1 - fd(t, 3.3, 3.7), B = fd(t, 3.5, 3.9) * (1 - fd(t, 5.1, 5.5)), C = fd(t, 5.3, 5.7);
    if (A > .01) {
      const vur = Math.max(0, 1 - Math.abs(t - .45) * 6), rot = t < .45 ? -50 + 50 * ob(fd(t, .1, .45)) : 0 + 12 * Math.max(0, 1 - (t - .45) * 5);
      o += `<g opacity="${A.toFixed(2)}">` + R(-100 + 540, 1000, 200, 40, 12, '#5E3A24') + `<g transform="translate(560 ${F1(930 + 8 * vur)})">` + cekicK(.9, -rot) + `</g>`;
      o += `<g transform="translate(270 1140) scale(1.4)">` + silK('kadin', '#FFF6E6') + `</g>`;
      const mx = 560 + 260 * ob(fd(t, 1.6, 2.8));
      o += `<g transform="translate(${F1(mx)} 1140) scale(1.4)" opacity="${(1).toFixed(2)}">` + silK('adam', '#AEB8D0') + `</g>`;
      const ln = fd(t, 1.8, 3.0); o += `<path d="M340 1250 H${F1(340 + 520 * ln)}" stroke="${ALTIN}" stroke-width="10" stroke-dasharray="26 18" stroke-linecap="round"/>` + (ln > .1 ? `<path d="M${F1(340 + 520 * ln)} 1250 l-26 -20 v40Z" fill="${ALTIN}"/>` : '') + `</g>`;
      o += ET(t, .2, 3.4, 'HÂKİM', ALTIN, MUREK, 86, 470, -2) + ET(t, .8, 3.4, 'UZAKLAŞTIRMA', '#FFFFFF', '#E8323C', 76, 640, 2);
    }
    if (B > .01) {
      o += `<g opacity="${B.toFixed(2)}">`;
      for (let i = 0; i < 6; i++) o += ayKutu(130 + i * 164, 880, i + 1, fd(t, 3.9 + i * .1, 4.3 + i * .1), t > 4.1 + i * .16);
      o += `</g>` + ET(t, 3.6, 5.2, 'EN FAZLA', '#FFFFFF', '#E8323C', 64, 470, -2) + ET(t, 4.2, 5.2, '6 AY', ALTIN, MUREK, 130, 1140, 2);
    }
    if (C > .01) {
      o += `<g opacity="${C.toFixed(2)}">` + MO.sar(R(-210, -150, 420, 300, 30, '#14654F') + txt('TEDBİR', 0, -30, 70, '#FFFFFF') + txt('KORUMA', 0, 50, 44, '#BFF0E4'), MO.oge(t, { gir: 5.4, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 290, 960, { golge: false }) +
        MO.sar(R(-210, -150, 420, 300, 30, '#6A1830') + txt('MAHKÛMİYET', 0, -30, 52, '#FFFFFF') + txt('SUÇLU KARARI', 0, 50, 40, '#F0B8C4'), MO.oge(t, { gir: 5.6, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 790, 960, { golge: false }) + `</g>`;
      o += MO.sar(txt('≠', 0, 40, 160, ALTIN), MO.oge(t, { gir: 5.8, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 960, { golge: false });
      o += ET(t, 5.5, 99, 'MAHKÛMİYET DEĞİL', '#FFD23F', MUREK, 62, 470, -2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 06 — 2 HAFTA İTİRAZ · ZORLAMA HAPSİ 3–10 GÜN (43,9–50,9)
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12263A', alt: '#070C14', isik: [540, 820, '#3E8EDE', .16], ikinci: [900, 300, '#E8B04A', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 7.0, 'kamera']],
  ciz: t => {
    let o = '';
    const A = 1 - fd(t, 2.9, 3.3), B = fd(t, 3.0, 3.4);
    if (A > .01) {
      o += `<g opacity="${A.toFixed(2)}">`;
      for (let i = 0; i < 14; i++) { const r = Math.floor(i / 7), q = i % 7, k = fd(t, .9 + i * .09, 1.15 + i * .09); o += `<g transform="translate(${F1(180 + q * 120)} ${F1(800 + r * 130)}) scale(${ob(k).toFixed(3)})">` + R(-48, -48, 96, 96, 18, k >= 1 ? ALTIN : '#2B2240') + txt(String(i + 1), 0, 16, 46, k >= 1 ? MUREK : '#8A80A8') + `</g>`; }
      o += MO.sar(zarfK(.8) + R(-120, 20, 240, 60, 30, '#E8323C') + txt('İTİRAZ', 0, 64, 40, '#FFFFFF'), MO.oge(t, { gir: 1.9, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1170, { golge: false });
      o += `</g>`;
      o += ET(t, .25, 3.0, 'KARŞI TARAF:', '#FFFFFF', '#3E5AA8', 52, 410, -2) + ET(t, .8, 3.0, '2 HAFTA', ALTIN, MUREK, 120, 590, 2);
    }
    if (B > .01) {
      const n = Math.round(3 + 7 * ob(fd(t, 4.1, 5.5)));
      o += `<g opacity="${B.toFixed(2)}"><g transform="translate(540 880)">` + `<g transform="translate(0 30) scale(1.4)">` + silK('adam', '#8890A8') + `</g>` + kafesK(420, 400, ob(fd(t, 3.2, 3.8))) + `</g>`;
      o += MO.sar(R(-260, -90, 520, 180, 44, '#0B1433') + `<rect x="-260" y="-90" width="520" height="180" rx="44" fill="none" stroke="#E8323C" stroke-width="6"/>` + txt((n <= 3 ? '3' : (n < 10 ? '3–' + n : '3–10')) + ' GÜN', 0, 36, 100, '#FFFFFF'), MO.oge(t, { gir: 4.0, agirlik: 'agir', giris: 'olcek', x: 540 }), 540, 1170, { golge: false });
      o += `</g>` + ET(t, 3.1, 6.9, 'TEDBİRE UYMAYAN', '#FFD23F', MUREK, 54, 440, -2) + ET(t, 5.7, 6.9, 'ZORLAMA HAPSİ', '#E8323C', '#FFFFFF', 74, 570, 2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'merak' })
});"""

# 07 — CEZA DAVASI: bütün deliller, şüphe sanık lehine (50,9–57,6)
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241A2E', alt: '#0A0710', isik: [540, 700, '#E8B04A', .24], ikinci: [900, 1500, '#E8323C', .05] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 940, 6.7, 'kamera']],
  ciz: t => {
    let o = '';
    // salon: sütunlar + kürsü
    [[110, 1], [970, 1]].forEach(([x]) => o += R(x - 50, 420, 100, 900, 10, '#3A2C48') + R(x - 66, 400, 132, 36, 8, '#4A3A5C') + R(x - 66, 1300, 132, 36, 8, '#4A3A5C') + `<rect x="${x - 50}" y="420" width="30" height="900" fill="#fff" opacity=".05"/>`);
    o += R(160, 1210, 760, 150, 14, '#4A2F22') + R(160, 1210, 760, 22, 10, '#6B4630');
    const ang = t < 5.3 ? 3 * Math.sin(t * 2) : 3 + 11 * ob(fd(t, 5.4, 6.2));
    const doc = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">` + R(-52, -64, 104, 128, 8, KAGIT) + R(-34, -40, 68, 9, 4, '#B8AC90') + R(-34, -20, 52, 9, 4, '#B8AC90') + R(-34, 0, 68, 9, 4, '#B8AC90') + `</g>`;
    let sol = ''; [[ -30, 40, -6], [20, 8, 5], [-4, -28, -2]].forEach(([x, y, r], i) => { const k = fd(t, 2.5 + i * .4, 3.0 + i * .4); if (k > 0) sol += `<g transform="translate(0 ${F1((1 - ob(k)) * -200)})" opacity="${Math.min(1, k * 3).toFixed(2)}">` + doc(x, y, r) + `</g>`; });
    const sag = `<g transform="translate(0 20) scale(.75)">` + silK('adam', '#AEB8D0') + `</g>`;
    o += teraziF(540, 800, 1.0, ang, sol, sag);
    o += ET(t, .3, 2.3, 'CEZA DAVASI', ALTIN, MUREK, 90, 470, -2) + ET(t, 1.1, 2.3, 'AYRI BİR DÜNYA', '#FFFFFF', '#E8323C', 60, 650, 2);
    o += ET(t, 2.4, 4.4, 'BÜTÜN DELİLLER', '#FFD23F', MUREK, 66, 470, -2);
    o += ET(t, 4.55, 99, 'ŞÜPHE KALIRSA', '#FFFFFF', '#E8323C', 62, 470, -2) + ET(t, 5.35, 99, 'SANIK LEHİNE', ALTIN, MUREK, 88, 620, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 08 — İFTİRA: 1–4 YIL (57,6–64,8)
S[8] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1020', alt: '#0B0610', isik: [540, 820, '#E8323C', .18], ikinci: [200, 1400, '#E8B04A', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 7.2, 'kamera']],
  sarsinti: [[1.5, 10]],
  ciz: t => {
    let o = '';
    const A = 1 - fd(t, 3.3, 3.7), B = fd(t, 3.5, 3.9);
    if (A > .01) {
      o += `<g opacity="${A.toFixed(2)}">` + MO.sar(sayfaK(620, 480, 5, -1, 'ŞİKÂYET'), MO.oge(t, { gir: .15, cik: 3.4, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 900, { golge: false }) + `</g>`;
      o += MO.sar(damga('ASILSIZ', '#E8323C', 100, -10), MO.oge(t, { gir: 1.5, cik: 3.4, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 560, 900, { golge: false });
      o += ET(t, .1, 1.9, 'ASILSIZ SUÇLAMA?', '#FFD23F', MUREK, 66, 470, -2) + ET(t, 2.15, 3.4, 'BİLE BİLE YALAN', '#FFFFFF', '#E8323C', 70, 470, -2);
    }
    if (B > .01) {
      o += `<g opacity="${B.toFixed(2)}">`;
      for (let i = 0; i < 4; i++) o += ayKutu(255 + i * 190, 940, i + 1, fd(t, 3.9 + i * .08, 4.3 + i * .08), (i === 0 && t > 4.3) || (i > 0 && i < 3 && t > 4.5 + i * .12) || (i === 3 && t > 5.1), 'YIL', '#E8323C');
      o += `</g>`;
      o += ET(t, 3.6, 7.1, 'İFTİRA SUÇU', '#E8323C', '#FFFFFF', 76, 470, -2) + ET(t, 5.4, 7.1, '1–4 YIL HAPİS', ALTIN, MUREK, 76, 1190, 2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'saskin' })
});"""

# 09 — GUBİ HAKEM + TERAZİ (64,8–72,9)
S[9] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1D3A', alt: '#0B0814', isik: [540, 760, '#E8B04A', .20], ikinci: [200, 1400, '#2FBFA8', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 1000, 8.1, 'kamera']],
  ciz: t => {
    let o = '';
    const ang = t < 5.2 ? Math.sin(t * 1.3) * 5 : (t < 6.4 ? -12 * ob(fd(t, 5.2, 5.6)) : (t < 7.6 ? -12 + 24 * ob(fd(t, 6.4, 6.9)) : 12 * (1 - ob(fd(t, 7.6, 8.0)))));
    const sol = `<g transform="translate(0 -24)">` + silK('kadin', '#FFF6E6') + `</g>`, sag = `<g transform="translate(0 -10) scale(.9)">` + silK('adam', '#AEB8D0') + `</g>`;
    o += teraziF(540, 760, .95, ang, sol, sag);
    const bh = t < 2.4 ? 'kamera' : (t < 2.9 ? [140, 900] : (t < 3.5 ? [940, 900] : 'kamera'));
    o += gubi(t, { x: 540, y: 1215, boy: 270, duygu: 'merak', bakHedef: bh, ust: KO.giy('gubi', ['gozluk']) });
    o += ET(t, .15, 1.9, 'DENGE DOĞRU MU?', '#FFD23F', MUREK, 66, 470, -2) + ET(t, 3.9, 5.0, 'KOLAY CEVAP YOK', '#FFFFFF', '#E8323C', 62, 470, -2);
    o += MO.sar(zamanChip('ŞİDDET GERÇEK', 0, 0, '#2FBFA8', '#0B1433', 34), MO.oge(t, { gir: 5.1, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 230, 1105, { golge: false });
    o += MO.sar(zamanChip('HAKSIZ SUÇLAMA KORKUSU', 0, 0, '#E8774A', '#FFFFFF', 30), MO.oge(t, { gir: 6.4, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 800, 1105, { golge: false });
    return o;
  },
  onCiz: t => gufi(t, { x: 200, y: 1840, boy: 210, duygu: 'merak', bakHedef: [540, 1100] })
});"""

# 10 — YARDIM HATLARI (72,9–77,4)
S[10] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0F2A28', alt: '#050E0D', isik: [540, 800, '#2FBFA8', .26], ikinci: [900, 300, '#E8B04A', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.5, 'kamera']],
  ciz: t => {
    let o = ET(t, .1, 99, 'ŞİDDET VARSA', '#FFFFFF', '#14654F', 76, 450, -2);
    [[.9, '112', 'ACİL ÇAĞRI', 760], [2.1, 'KADES', 'KADIN ACİL DESTEK UYGULAMASI', 950], [3.4, 'ALO 183', 'SOSYAL DESTEK HATTI', 1140]].forEach(([g, ad, alt, y]) => {
      o += MO.sar(R(-410, -82, 820, 164, 60, '#14654F') + `<rect x="-410" y="-82" width="820" height="164" rx="60" fill="none" stroke="${YESIL}" stroke-width="5"/>` + txt(ad, 0, 12, 82, '#FFFFFF') + txt(alt, 0, 56, 28, '#BFF0E4'), MO.oge(t, { gir: g, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 540, y, { golge: false });
    });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 11 — SEN NE DERSİN? (77,4–80,3)
S[11] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 760, '#FFD23F', .18] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 2.9, 'kamera']],
  ciz: t => {
    let o = '';
    o += ET(t, .1, 99, 'DENGE', '#FFFFFF', '#E8323C', 112, 520, -2) + ET(t, .9, 99, 'DOĞRU MU?', '#FFD23F', MUREK, 112, 700, 2);
    o += `<g opacity="${fd(t, .5, 1.0).toFixed(2)}">` + teraziF(540, 880, .62, Math.sin(t * 2.4) * 8, '', '') + `</g>`;
    o += MO.sar(zamanChip('YORUMLARA YAZ', 0, 0, '#FFD23F', '#1B2440', 48), MO.oge(t, { gir: 1.9, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1220, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 12 — TAKİP (80,3–83,5)
S[12] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#101A30', alt: '#0A0F1C', isik: [540, 760, '#FFD23F', .22], supurme: .04 }),
  kamera: [[0, 1.08, 540, 800], [.1, 1.0, 540, 900, 3.2, 'kamera']],
  ciz: t => {
    const kart = R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FFD23F" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF');
    let o = MO.sar(kart, MO.oge(t, { gir: .04, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 760);
    const bs = t > 1.9 && t < 2.05 ? .92 : 1;
    o += MO.sar(`<g transform="scale(${bs})">` + R(-220, -40, 440, 80, 40, '#FFD23F') + AU.yaz('+ TAKİP ET', 0, 18, 46, '#1B2440') + '</g>', MO.oge(t, { gir: 1.3, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 300, y: 1540, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1720, boy: 220, duygu: 'mutlu', bakHedef: 'kamera' })
});"""
