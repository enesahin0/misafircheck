S = {}
Z1 = "MO.zemin({ ust: '#E8403A', alt: '#8E1426', isik: [540, 900, '#FFD27A', .34], ikinci: [900, 300, '#FFFFFF', .12] })"
Z2 = "MO.zemin({ ust: '#F6C979', alt: '#C9622E', isik: [540, 860, '#FFF3D6', .38], ikinci: [200, 1500, '#E30A17', .12] })"
Z3 = "MO.zemin({ ust: '#2E9C90', alt: '#0F4A4F', isik: [540, 860, '#BFF0E4', .26], ikinci: [200, 1500, '#F2B544', .18] })"
Z4 = "MO.zemin({ ust: '#F2A33C', alt: '#A8431F', isik: [540, 860, '#FFE9A8', .36], ikinci: [900, 1500, '#E30A17', .14] })"
Z5 = "MO.zemin({ ust: '#9B5FC0', alt: '#4A2670', isik: [540, 860, '#E8D4FF', .3], ikinci: [900, 300, '#F2B544', .14] })"
Z6 = "MO.zemin({ ust: '#2E9C6E', alt: '#0F4A3A', isik: [540, 860, '#C8F5D8', .26], ikinci: [200, 1500, '#F2B544', .16] })"
Z3B = "MO.zemin({ ust: '#6C5BB5', alt: '#2D2466', isik: [540, 860, '#D8D0FF', .3], ikinci: [200, 1500, '#F2B544', .16] })"
Z7 = "MO.zemin({ ust: '#79C6E8', alt: '#F8E3B0', isik: [540, 500, '#FFFFFF', .42], ikinci: [900, 1500, '#F2B544', .12] })"
Z8 = "MO.zemin({ ust: '#E8403A', alt: '#A8193A', isik: [540, 860, '#FFD27A', .3], ikinci: [200, 1500, '#FFFFFF', .1] })"
Z9 = "MO.zemin({ ust: '#F8D98A', alt: '#D98A3A', isik: [540, 860, '#FFF3D6', .4], ikinci: [200, 400, '#E30A17', .12] })"
Z11 = "MO.zemin({ ust: '#1F7F8C', alt: '#0E3F4A', isik: [540, 860, '#9FE6E0', .28], ikinci: [900, 1500, '#F2B544', .16] })"
Z12 = "MO.zemin({ ust: '#FFE9B0', alt: '#F2A33C', isik: [540, 760, '#FFFFFF', .5], ikinci: [900, 1500, '#E30A17', .14] })"
Z13 = "MO.zemin({ ust: '#0F3A3F', alt: '#071B1E', isik: [540, 760, '#F2B544', .22], supurme: .04 })"
# 01 — KANCA (0–7,3): takvim · TATİL damgası çizilir · normal saydığın 5 şey · hepsi o güne bağlanır
S[1] = r"""
const ik1 = [['oy', 150, 760, CB_K], ['kadin', 930, 760, CB_MOR], ['kanun', 120, 1090, CB_BORDO], ['okul', 960, 1090, CB_YESIL], ['esit', 540, 520, CB_TURUNCU]];
MO.sahne({
  zemin: """ + Z12 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 930, 7.2, 'kamera']],
  sarsinti: [[2.3, 10]],
  ciz: t => {
    let o = '';
    o += MO.sar(cbTakvim(), MO.oge(t, { gir: .05, agirlik: 'kahraman', giris: 'damga', materyal: 'plastik', x: 540, bekle: 3 }), 540, 930);
    o += MO.sar(cbDamga('TATİL', CB_KD, 96, -9), MO.oge(t, { gir: 1.4, cik: 3.6, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 970, { golge: false });
    const sl = fd(t, 2.25, 2.5);
    if (sl > 0) o += `<g opacity="${(1 - fd(t, 3.3, 3.6)).toFixed(2)}">` + MO.cizgiCiz('M300 880 L780 1070', sl, { renk: '#2A0A12', kal: 22, uzunluk: 620 }) + `</g>`;
    o += ET(t, .1, 3.0, 'CUMHURİYET SADECE', '#FFFFFF', CB_K, 64, 425, -2) + ET(t, .5, 3.0, 'BİR TATİL GÜNÜ DEĞİL', CB_ALTIN, '#3A1018', 54, 545, 2);
    ik1.forEach(([tur, x, y], i) => { const p = fd(t, 6.0 + i * .05, 6.7); if (p > 0) o += MO.cizgiCiz(`M${x} ${y} L${(540 + (x - 540) * .42).toFixed(0)} ${(930 + (y - 930) * .42).toFixed(0)}`, p, { renk: '#FFE9A8', kal: 8, uzunluk: 700 }); });
    ik1.forEach(([tur, x, y, rk], i) => { o += MO.sar(`<g>${cbIk(tur, 84, rk)}</g>`, MO.oge(t, { gir: 3.3 + i * .32, agirlik: 'hafif', giris: 'olcek', materyal: 'plastik', x, bekle: 5 }), x, y, { golge: false }); });
    if (t > 6.3 && t < 7.2) o += K.glow({ x: 540, y: 930, r: 330 * (1 - fd(t, 6.3, 7.2)) + 1, renk: '#FFD27A', guc: .55 });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 02 — KAÇINI BİLİYORSUN? · CUMHURİYET = HALKIN İŞİ (7,3–12,4)
S[2] = r"""
MO.sahne({
  zemin: """ + Z3 + r""",
  kamera: [[0, 1.04, 540, 940], [.1, 1.0, 540, 960, 5.0, 'kamera']],
  ciz: t => {
    let o = '';
    [['oy', CB_K], ['kadin', CB_MOR], ['kanun', CB_BORDO], ['okul', CB_YESIL], ['esit', CB_TURUNCU]].forEach(([tur, rk], i) => { const x = 130 + i * 205;
      o += MO.sar(`<g>${cbIk(tur, 80, rk)}</g>` + `<g transform="translate(46 -70)"><circle r="34" fill="#FFD23F"/><text y="22" font-size="56" font-weight="900" text-anchor="middle" style="fill:#2A0A12">?</text></g>`, MO.oge(t, { gir: .02 + i * .06, cik: 2.4, agirlik: 'hafif', giris: 'sabit', x, bekle: 4 }), x, 800, { golge: false }); });
    o += ET(t, .25, 2.4, 'KAÇINI BİLİYORSUN?', '#FFFFFF', CB_K, 66, 560, -2);
    o += MO.baslik(t, 2.8, 'CUMHURİYET', 540, 640, { boyut: 128, renk: '#3A1018', vurgu: CB_K, aralik: .1 });
    o += MO.baslik(t, 3.35, '= HALKIN *İŞİ*', 540, 790, { boyut: 100, renk: '#3A1018', vurgu: CB_K, aralik: .3 });
    o += MO.sar(cbChip('RES PUBLICA · ORTAK İŞ', '#3A1018', '#FFE9A8', 32), MO.oge(t, { gir: 4.3, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 900, { golge: false });
    o += `<rect x="-100" y="1232" width="1280" height="700" fill="#0B3A3F" opacity=".28"/>` + cbKal(540, 1232, 960, 9, t, 3.0, { kol: 1, set: 1 });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 03 — HANEDAN / TEK KİŞİ ✕ · HALKIN SEÇTİKLERİ · EGEMENLİK MİLLETİNDİR (12,4–20,2)
S[3] = r"""
MO.sahne({
  zemin: """ + Z3B + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 940, 7.7, 'kamera']],
  sarsinti: [[2.3, 12]],
  ciz: t => {
    let o = '';
    o += MO.sar(cbTaht(1.15), MO.oge(t, { gir: .05, cik: 3.0, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1060);
    o += MO.sar(cbTac(1.05), MO.oge(t, { gir: .4, cik: 3.0, agirlik: 'agir', giris: 'dus', materyal: 'plastik', x: 540 }), 540, 760);
    o += MO.sar(cbChip('HANEDAN', '#FFFFFF', '#3A1018', 40), MO.oge(t, { gir: .7, cik: 3.0, agirlik: 'orta', giris: 'yan', yon: -1, x: 200 }), 220, 640, { golge: false });
    o += MO.sar(cbChip('TEK KİŞİ', '#FFFFFF', '#3A1018', 40), MO.oge(t, { gir: 1.6, cik: 3.0, agirlik: 'orta', giris: 'yan', yon: 1, x: 860 }), 860, 640, { golge: false });
    o += MO.sar(cbCarpi(2.2), MO.oge(t, { gir: 2.3, cik: 3.0, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 900, { golge: false });
    const pz = (t > 3.3 && t < 6.9) ? ((t - 3.3) * 1.1) % 1 : -1;
    o += `<rect x="-100" y="1240" width="1280" height="500" fill="#0B3A3F" opacity=".35"/>`;
    o += cbKal(540, 1240, 1020, 8, t, 2.5, { kol: 0, set: 3 });
    o += `<ellipse cx="540" cy="1244" rx="210" ry="22" fill="#000" opacity=".28"/>` + MO.sar(cbSandik(1.1, pz), MO.oge(t, { gir: 2.9, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1053, { golge: false });
    o += ET(t, 4.8, 99, 'EGEMENLİK', '#FFFFFF', CB_K, 78, 430, -2) + ET(t, 5.55, 99, 'KAYITSIZ ŞARTSIZ', CB_ALTIN, '#3A1018', 48, 580, 2) + ET(t, 6.75, 99, 'MİLLETİNDİR', '#FFFFFF', CB_K, 88, 745, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 04 — PEKİ BU SANA NE VERDİ? hediye · 1: OY HAKKI (20,2–26,0)
S[4] = r"""
MO.sahne({
  zemin: """ + Z4 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.7, 'kamera']],
  ciz: t => {
    let o = '';
    const ac = MO.E.outCubic(fd(t, 1.35, 2.05));
    const hed = MO.oge(t, { gir: .05, cik: 2.55, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 3 });
    o += MO.sar(cbHediye(1.25, ac, t), hed, 540, 940);
    o += MO.sar(txt('1', 0, 125, 250, '#FFFFFF'), MO.oge(t, { gir: 2.2, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 110 }), 110, 505, { golge: false });
    const pz = (t > 3.2) ? Math.min(1, (t - 3.2) / 0.85) : -1;
    o += `<ellipse cx="540" cy="1190" rx="230" ry="24" fill="#000" opacity=".25"/>` + MO.sar(cbSandik(1.25, pz), MO.oge(t, { gir: 2.7, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 990, { golge: false });
    o += MO.sar(cbTik(1.1), MO.oge(t, { gir: 4.1, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 800 }), 820, 880, { golge: false });
    o += ET(t, 3.0, 99, 'OY HAKKI', '#FFFFFF', CB_K, 92, 520, -2) + ET(t, 4.0, 99, 'YÖNETİCİNİ SEN SEÇERSİN', '#3A1018', '#FFE9A8', 50, 670, 2);
    o += takipCip(t, 1.0, 3.2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 05 — 2: KADINLARA SEÇME VE SEÇİLME · FRANSA'DAN VE İTALYA'DAN ÖNCE (26,0–31,7)
S[5] = r"""
const sat5 = [['TÜRKİYE', 1934, 800], ['FRANSA', 1944, 980], ['İTALYA', 1945, 1160]];
MO.sahne({
  zemin: """ + Z5 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.5, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('2', 0, 125, 250, '#FFFFFF'), MO.oge(t, { gir: .1, cik: 2.95, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 110 }), 110, 505, { golge: false });
    const pz = (t > .9) ? Math.min(1, (t - .9) / .9) : -1;
    o += MO.sar(`<ellipse cy="${cbAyak('kadin') * 1.9 + 4}" rx="90" ry="14" fill="#000" opacity=".25"/><g transform="scale(1.9)">${cbSil('kadin', '#FFF6E6', '#2A1A22')}</g>`, MO.oge(t, { gir: .2, cik: 2.95, agirlik: 'agir', giris: 'yan', yon: -1, materyal: 'plastik', x: 330, bekle: 3 }), 330, 1230 - cbAyak('kadin') * 1.9, { golge: false });
    o += MO.sar(`<ellipse cx="0" cy="170" rx="190" ry="22" fill="#000" opacity=".25"/>` + cbSandik(1.0, pz), MO.oge(t, { gir: .5, cik: 2.95, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 740 }), 740, 1050, { golge: false });
    o += ET(t, 1.3, 2.95, 'SEÇME', '#FFFFFF', CB_MOR, 76, 520, -2) + ET(t, 1.95, 2.95, 'SEÇİLME', CB_ALTIN, '#3A1018', 76, 660, 2);
    o += MO.sar(cbChip('MİLLETVEKİLİ SEÇİMLERİ İÇİN', '#2A1245', '#E8D4FF', 30), MO.oge(t, { gir: 3.0, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 540, { golge: false });
    sat5.forEach(([ad, yil, y], i) => { const g0 = 2.95 + i * .6, p = MO.E.outCubic(fd(t, g0, g0 + .6)), len = (yil - 1930) * 36 * p;
      const fl = i === 0 ? trB(0, 0, 130) : i === 1 ? cbFrBayrak(0, 0, 130, '#2F5DBF', '#FFFFFF', '#E30A17') : cbFrBayrak(0, 0, 130, '#2F8F5C', '#FFFFFF', '#E30A17');
      if (p <= 0) return;
      o += `<g opacity="${Math.min(1, p * 3).toFixed(2)}"><g transform="translate(135 ${y})">${R(-65 + 6, -43 + 8, 130, 86, 8, '#000', .3)}${fl}</g>` + `<text class="mono" x="135" y="${y + 80}" font-size="26" text-anchor="middle" letter-spacing="2" style="fill:#E8D4FF">${ad}</text>` +
        R(230, y - 38, Math.max(8, len), 76, 38, i === 0 ? CB_K : '#C9B8F0') + `<text x="${(230 + len + 22).toFixed(0)}" y="${y + 20}" font-size="${i === 0 ? 64 : 56}" font-weight="900" style="fill:${i === 0 ? CB_ALTIN : '#FFFFFF'}">${Math.round(1930 + (yil - 1930) * p)}</text></g>`; });
    o += ET(t, 5.05, 99, '10 YIL ÖNCE', CB_ALTIN, '#3A1018', 72, 665, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'mutlu' })
});"""
# 06 — 3: MEDENİ KANUN · EŞİT · BOŞANMA · MİRAS (31,7–38,8)
S[6] = r"""
MO.sahne({
  zemin: """ + Z6 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 940, 6.9, 'kamera']],
  sarsinti: [[3.3, 8]],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('3', 0, 125, 250, '#FFFFFF'), MO.oge(t, { gir: .1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 110 }), 110, 505, { golge: false });
    const kit = MO.oge(t, { gir: .05, cik: 1.8, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 3 });
    o += MO.sar(cbKitap(1.0, 'MEDENİ KANUN', 0), kit, 540, 940);
    o += MO.sar(cbChip('1926', CB_ALTIN, '#3A1018', 40), MO.oge(t, { gir: .9, cik: 1.8, agirlik: 'hafif', giris: 'yuksel', x: 800 }), 800, 560, { golge: false });
    const aci = 16 * (1 - MO.yay(t - 3.15, { sure: .8, tasma: .14 }));
    const fig = (tur, rk) => `<g transform="translate(0 ${-cbAyak(tur) * 1.05})"><g transform="scale(1.05)">${cbSil(tur, rk, '#2A1A22')}</g></g>`;
    o += MO.sar(cbTerazi(.95, t < 3.15 ? 16 : aci, fig('kadin', '#FFF6E6'), fig('adam', '#BFE3F0')), MO.oge(t, { gir: 1.9, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 770, { golge: false });
    o += ET(t, 3.35, 4.4, 'EŞİT', '#FFFFFF', CB_BORDO, 100, 540, -2) + ET(t, 4.65, 99, 'BOŞANMA HAKKI', CB_ALTIN, '#3A1018', 58, 500, -2) + ET(t, 5.55, 99, 'MİRAS HAKKI', '#FFFFFF', CB_BORDO, 58, 625, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 07 — 4: EĞİTİM · TEK ÇATI · HERKESE AÇIK · YENİ HARFLER (38,8–47,0)
S[7] = r"""
MO.sahne({
  zemin: """ + Z7 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 8.0, 'kamera']],
  ciz: t => {
    let o = '';
    o += R(-200, 1180, 1480, 800, 0, '#6FBF73') + R(-200, 1180, 1480, 14, 0, '#8AD58C') + R(-200, 1194, 1480, 700, 0, '#5FAE66');
    o += MO.sar(txt('4', 0, 125, 250, CB_K), MO.oge(t, { gir: .1, cik: 5.0, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 110 }), 110, 505, { golge: false });
    o += ET(t, .75, 2.1, 'EĞİTİM', '#FFFFFF', CB_YESIL, 84, 520, -2);
    // küçük okullar tek çatıda toplanır
    const mv = MO.E.inOutCubic(fd(t, 2.4, 3.2));
    if (mv < 1) [[170, 1180], [915, 1180], [370, 1090]].forEach(([x0, y0], i) => { const g = ob(fd(t, 1.55 + i * .15, 2.1 + i * .15)); if (g <= 0) return; const x = x0 + (540 - x0) * mv, y = y0 + (1180 - y0) * mv, sc = (.34 - .1 * mv) * g;
      o += `<g opacity="${(1 - fd(t, 2.9, 3.2)).toFixed(2)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(3)})">${cbOkul(1, 0, t + i)}</g>`; });
    o += ET(t, 2.25, 3.75, 'TEK ÇATI ALTINDA', '#FFFFFF', CB_K, 56, 640, 2);
    const kapi = MO.E.outCubic(fd(t, 3.9, 4.5));
    o += `<ellipse cx="540" cy="1184" rx="360" ry="18" fill="#000" opacity=".2"/>` + MO.sar(cbOkul(.98, kapi, t), MO.oge(t, { gir: 3.0, cik: 5.15, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1180, { golge: false });
    o += ET(t, 3.95, 5.0, 'HERKESE AÇIK', CB_ALTIN, '#3A1018', 66, 640, -2);
    ['cocuk', 'kadin', 'cocuk', 'cocuk', 'kadin', 'cocuk'].forEach((tur, i) => { const g0 = 3.8 + i * .12, p = fd(t, g0, g0 + .75); if (p <= 0 || p >= 1) return; const yan = i < 3 ? -1 : 1, x0 = 540 + yan * (700 + (i % 3) * 110), x = x0 + (540 - x0) * MO.E.inOutSine(p), sc = tur === 'kadin' ? .62 : 1.0, ad = 1210 + (i % 2) * 8;
      o += `<g opacity="${(1 - fd(t, g0 + .55, g0 + .75)).toFixed(2)}" transform="translate(${x.toFixed(1)} ${(ad - cbAyak(tur) * sc - Math.abs(Math.sin(t * 9 + i)) * 12).toFixed(1)}) scale(${sc})">${cbSil(tur, ['#E30A17', '#7B5EA7', '#2F8F5C', '#E8903D', '#2F5DBF', '#8E2A45'][i], '#2A1A22')}</g>`; });
    // yeni harfler
    o += ET(t, 5.2, 99, 'YENİ HARFLER', '#FFFFFF', CB_YESIL, 76, 500, -2) + MO.sar(cbChip('1928', CB_ALTIN, '#3A1018', 38), MO.oge(t, { gir: 5.7, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 610, { golge: false });
    o += MO.sar(cbTahta(.98, 5.5, t), MO.oge(t, { gir: 5.1, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 940, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'mutlu', gf: 'merak' })
});"""
# 08 — 5: KANUN ÖNÜNDE EŞİTLİK (47,0–49,6)
S[8] = r"""
MO.sahne({
  zemin: """ + Z3 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.07, 540, 940, 2.4, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('5', 0, 125, 250, '#FFFFFF'), MO.oge(t, { gir: .1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 110 }), 110, 505, { golge: false });
    o += ET(t, .8, 99, 'KANUN ÖNÜNDE', '#FFFFFF', CB_K, 66, 480, -2) + ET(t, 1.45, 99, 'EŞİTLİK', CB_ALTIN, '#3A1018', 100, 630, 2);
    o += MO.sar(txt('=', 0, 120, 420, CB_ALTIN), MO.oge(t, { gir: .35, agirlik: 'kahraman', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 960, { golge: false });
    o += `<ellipse cx="540" cy="1236" rx="480" ry="26" fill="#000" opacity=".25"/>`;
    o += MO.sar(`<g transform="scale(2.0)">${cbSil('kadin', '#FFF6E6', '#2A1A22')}</g>`, MO.oge(t, { gir: .2, agirlik: 'agir', giris: 'yan', yon: -1, materyal: 'plastik', x: 230 }), 230, 1230 - cbAyak('kadin') * 2.0, { golge: false });
    o += MO.sar(`<g transform="scale(2.0)">${cbSil('adam', '#BFE3F0')}</g>`, MO.oge(t, { gir: .3, agirlik: 'agir', giris: 'yan', yon: 1, materyal: 'plastik', x: 850 }), 850, 1230 - cbAyak('adam') * 2.0, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'merak' })
});"""
# 09 — GUBİ, HEPSİ DEDİ · GUFİ DE KATILIYOR (49,6–56,0)
S[9] = r"""
const ik9 = [['oy', CB_K], ['kadin', CB_MOR], ['kanun', CB_BORDO], ['okul', CB_YESIL], ['esit', CB_TURUNCU]];
MO.sahne({
  zemin: """ + Z9 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.0, 'kamera']],
  ciz: t => {
    let o = '';
    const hep = fd(t, 3.6, 4.3), z = Math.sin(hep * Math.PI);
    ik9.forEach(([tur, rk], i) => { const x = 130 + i * 205, y = 640 - z * 26 * (1 + (i % 2) * .4), k = 1 + .22 * z;
      o += (hep > 0 && hep < 1 ? `<circle cx="${x}" cy="${y}" r="${(110 + 70 * hep).toFixed(0)}" fill="#FFD27A" opacity="${(.5 * (1 - hep)).toFixed(2)}"/>` : '') +
        MO.sar(`<g transform="scale(${k.toFixed(3)})">${cbIk(tur, 80, rk)}</g>`, MO.oge(t, { gir: .05 + i * .1, agirlik: 'hafif', giris: 'olcek', materyal: 'plastik', x, bekle: 4 }), x, y, { golge: false }); });
    o += ET(t, .25, 3.0, 'EN DEĞERLİSİ HANGİSİ?', '#FFFFFF', CB_K, 56, 820, -2);
    o += ET(t, 3.5, 99, 'HEPSİ!', CB_ALTIN, '#3A1018', 120, 830, 2);
    return o;
  },
  onCiz: t => gubi(t, { x: 320, y: 1050, boy: 300, duygu: t > 3.0 ? 'mutlu' : 'merak', bakHedef: t > 5 ? [760, 1200] : [540, 640] }) + gufi(t, { x: 770, y: 1235, boy: 320, duygu: t > 5.0 ? 'mutlu' : 'merak', bakHedef: t > 3.0 ? [320, 1090] : [540, 640] })
});"""
# 10 — BİR GECEDE KURULDU, BİR GECEDE KORUNMAZ · ORTAK BİR İŞ (56,0–62,6)
S[10] = r"""
const zemin10 = t => { const k = MO.E.inOutCubic(fd(t, 3.2, 5.9)), ust = MO.renkKaristir('#1E1B4B', '#F29A5A', k), alt = MO.renkKaristir('#3B2A6B', '#FFE0A6', k), gy = 1250 - 170 * k;
  let o = `<defs><linearGradient id="z10" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ust}"/><stop offset="1" stop-color="${alt}"/></linearGradient></defs><rect x="-200" y="-200" width="1480" height="2400" fill="url(#z10)"/>`;
  for (let i = 0; i < 46; i++) o += `<circle cx="${(hh(i * 3) * 1080).toFixed(0)}" cy="${(hh(i * 5 + 1) * 1000 + 200).toFixed(0)}" r="${(1.5 + hh(i) * 3).toFixed(1)}" fill="#FFF6E6" opacity="${((.4 + .5 * Math.abs(Math.sin(t * 1.5 + i))) * (1 - k)).toFixed(2)}"/>`;
  o += `<g opacity="${(1 - k).toFixed(2)}"><circle cx="820" cy="${(520 + 60 * k).toFixed(0)}" r="86" fill="#FFF6E6"/><circle cx="854" cy="${(500 + 60 * k).toFixed(0)}" r="78" fill="${ust}"/></g>`;
  o += `<circle cx="540" cy="${gy.toFixed(0)}" r="${(150 + 30 * k).toFixed(0)}" fill="#FFD27A" opacity="${(.9 * k).toFixed(2)}"/><circle cx="540" cy="${gy.toFixed(0)}" r="${(320 + 80 * k).toFixed(0)}" fill="#FFD27A" opacity="${(.3 * k).toFixed(2)}"/>`;
  return o + `<path d="M-100 1260 Q200 1160 450 1230 Q700 1150 1000 1230 Q1100 1250 1200 1240 L1200 2000 L-100 2000Z" fill="${MO.renkKaristir('#1A1740', '#3E7A52', k)}"/>`; };
MO.sahne({
  zemin: zemin10,
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 920, 6.4, 'kamera']],
  ciz: t => {
    let o = '';
    o += R(-100, 1236, 1280, 700, 0, '#2E5A3C', .45);
    const p = MO.E.inOutCubic(fd(t, 3.9, 6.3)), top = 1000 - 400 * p;
    o += R(532, 540, 16, 700, 8, '#EDE6D6') + `<circle cx="540" cy="534" r="20" fill="${CB_ALTIN}"/>`;
    o += cbBayrakli(548, top, 300, t, 0);
    o += cbKal(300, 1250, 480, 4, t, 3.5, { kol: 1, set: 2 }) + cbKal(790, 1250, 480, 4, t, 3.7, { kol: 1, set: 5 });
    o += ET(t, .45, 1.95, 'BİR GECEDE KURULDU', '#FFFFFF', CB_K, 56, 470, -2) + ET(t, 2.05, 3.7, 'BİR GECEDE KORUNMAZ', CB_ALTIN, '#3A1018', 52, 600, 2);
    o += ET(t, 5.75, 99, 'ORTAK BİR İŞ', '#FFFFFF', CB_K, 88, 480, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 11 — SENCE EN DEĞERLİ NE? · YORUMLARA YAZ · GÖNDER (62,6–70,2) — paylaşılabilir kart
S[11] = r"""
MO.sahne({
  zemin: """ + Z11 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 940, 7.5, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(`<g transform="scale(.92)">${cbKart(t, .15)}</g>`, MO.oge(t, { gir: .05, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 785, { golge: false });
    o += MO.sar(cbYorum(1.0), MO.oge(t, { gir: 3.55, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 880 }), 905, 1190, { golge: false });
    o += MO.sar(cbChip('YORUMLARA YAZ', '#FFD23F', '#1B2440', 44), MO.oge(t, { gir: 3.7, cik: 4.9, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 480, 1212, { golge: false });
    const u = fd(t, 5.1, 7.3);
    if (u > 0 && u < 1) { const e = MO.E.inOutSine(u), px = 480 + 700 * e, py = 1212 - 960 * e - Math.sin(u * Math.PI) * 120; o += `<g opacity="${(1 - fd(t, 7.0, 7.3)).toFixed(2)}" transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${(-38 + 20 * Math.sin(u * 6)).toFixed(1)})">${cbUcak(.75)}</g>`; }
    o += MO.sar(cbChip('BAYRAMINI PAYLAŞ', '#FFFFFF', CB_K, 40), MO.oge(t, { gir: 5.0, cik: 7.5, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 480, 1212, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'dusun' })
});"""
# 12 — CUMHURİYETİMİZİN 103. YILI KUTLU OLSUN (70,2–73,4)
S[12] = r"""
MO.sahne({
  zemin: """ + Z12 + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 930, 3.1, 'kamera']],
  ciz: t => {
    let o = '';
    o += ET(t, .25, 2.1, 'CUMHURİYET BAYRAMI', '#FFFFFF', CB_K, 60, 470, -2);
    o += MO.sar(R(-8, -80, 16, 620, 8, '#B8AC90') + `<circle cy="-90" r="18" fill="${CB_ALTIN}"/>`, MO.oge(t, { gir: .1, agirlik: 'agir', giris: 'yuksel', x: 212 }), 212, 620, { golge: false });
    o += MO.sar(cbBayrakli(0, 0, 640, t, 0), MO.oge(t, { gir: .3, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540 }), 220, 540, { golge: false });
    o += MO.sayiVurgu(t, .9, 1.0, 103, 345, 1105, { boyut: 240, renk: CB_K, vurgu: CB_ALTIN, bicim: n => String(n) });
    o += MO.sar(txt('. YIL', 0, 0, 130, '#3A1018'), MO.oge(t, { gir: 1.5, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 805 }), 805, 1189, { golge: false });
    o += ET(t, 2.15, 99, 'KUTLU OLSUN!', CB_K, '#FFFFFF', 84, 470, -2);
    o += cbKonfeti(t, 1.0, 70);
    return o;
  },
  onCiz: t => MF(t, { gd: 'mutlu', gf: 'mutlu' })
});"""
# 13 — TAKİP (73,4–76,5)
S[13] = r"""
MO.sahne({
  zemin: """ + Z13 + r""",
  kamera: [[0, 1.08, 540, 800], [.1, 1.0, 540, 900, 3.0, 'kamera']],
  ciz: t => {
    const kart = R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FFD23F" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF');
    let o = MO.sar(kart, MO.oge(t, { gir: .04, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 760);
    const bs = t > 2.65 && t < 2.8 ? .92 : 1;
    o += MO.sar(`<g transform="scale(${bs})">` + R(-220, -40, 440, 80, 40, '#FFD23F') + AU.yaz('+ TAKİP ET', 0, 18, 46, '#1B2440') + '</g>', MO.oge(t, { gir: 1.6, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 300, y: 1540, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1720, boy: 220, duygu: 'mutlu', bakHedef: 'kamera' })
});"""
