S = {}
ZM = "MO.zemin({ ust: '#3A2A1A', alt: '#120C08', isik: [540, 860, '#E8903D', .22], ikinci: [900, 300, '#2FA89A', .12] })"
ZY = "MO.zemin({ ust: '#1F3A32', alt: '#0A1412', isik: [540, 860, '#2FA89A', .20], ikinci: [200, 1400, '#E8903D', .10] })"
KART5 = r"""
const kart5 = (t, g0, y, sc, soru = 0, vur = -1) => { let o = ''; for (let i = 0; i < 5; i++) { const x = 140 + i * 200, k = ob(fd(t, g0 + i * .12, g0 + .45 + i * .12)), v = i === vur ? 1.18 : 1;
  o += `<g transform="translate(${x} ${y}) scale(${(k * sc * v).toFixed(3)})">` + R(-84, -100, 168, 200, 28, '#F3E3C3') + `<rect x="-84" y="-100" width="168" height="200" rx="28" fill="none" stroke="${i === vur ? '#D8402E' : '#E8903D'}" stroke-width="7"/>` + txt(String(i + 1), 0, 36, 110, '#3A2A1A') + (soru > 0 ? `<g opacity="${soru.toFixed(2)}">` + txt('?', 54, -52, 56, '#D8402E') + `</g>` : '') + `</g>`; } return o; };"""
# 01 — KANCA (0–7,6): bildiğin bir şey seni tehlikeye atabilir · 5 inanış
S[1] = KART5 + r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 950, 7.6, 'kamera']],
  sarsinti: [[.15, 12], [.6, 10], [1.2, 8]],
  ciz: t => {
    let o = '';
    const a = 1 - fd(t, 3.4, 3.8);
    if (a > .01) {
      o += `<g opacity="${a.toFixed(2)}"><g transform="translate(540 880) scale(.88) ${sallan(t, 8, 30)}">` + R(-360, -300, 720, 560, 30, '#F3E3C3') + R(-360, 150, 720, 110, 0, '#8A5A3A') + R(-200, -230, 180, 130, 10, '#2FA89A') + R(-174, -206, 130, 84, 6, '#BFE0FF') + R(100, -230, 140, 200, 10, '#C9A267') + `<path d="M-250 40 L-100 -40 L50 40 Z" fill="#E8903D"/>` + `<g transform="translate(-30 -30) rotate(${(Math.sin(t * 22) * 8).toFixed(1)})"><line x1="0" y1="-330" x2="0" y2="-250" stroke="#3A2A1A" stroke-width="5"/><ellipse cx="0" cy="-220" rx="60" ry="46" fill="#FFD23F"/></g></g>` + `<g transform="translate(540 650) scale(1.2)"><path d="M0 -90 L90 70 H-90Z" fill="#D8402E"/><path d="M0 -50 V20" stroke="#fff" stroke-width="14" stroke-linecap="round"/><circle cy="46" r="8" fill="#fff"/></g></g>`;
      o += ET(t, .1, 3.5, 'DEPREM HAKKINDA', '#FFFFFF', '#3A2A1A', 56, 440, -2) + ET(t, .5, 3.5, 'BİLDİĞİN BİR ŞEY', '#E8903D', '#3A2A1A', 84, 580, 2) + ET(t, 1.5, 3.5, 'SENİ TEHLİKEYE ATABİLİR', '#D8402E', '#FFFFFF', 52, 1150, -2);
    }
    o += kart5(t, 3.9, 900, 1, fd(t, 6.0, 6.6));
    o += ET(t, 3.95, 99, '5 YAYGIN İNANIŞ', '#FFFFFF', '#2FA89A', 66, 450, -2) + ET(t, 5.4, 99, 'DOĞRU MU, TUZAK MI?', '#FFD23F', '#3A2A1A', 44, 1180, 2);
    return o;
  },
  onCiz: t => ''
});"""
# 02 — 5'İNCİSİNDE BİLİM İNSANLARI BİLE AYRILIYOR (7,6–10,4)
S[2] = KART5 + r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 2.8, 'kamera']],
  ciz: t => {
    let o = kart5(t + 99, 0, 700, .6, 1, 4);
    o += ET(t, .1, 99, '5. İNANIŞTA', '#FFFFFF', '#2FA89A', 66, 450, -2) + ET(t, .5, 99, 'BİLİM İNSANLARI BİLE AYRILIYOR', '#E8903D', '#3A2A1A', 44, 580, 2);
    o += MO.sar(`<g transform="translate(-150 0) scale(1.7)">${silK('adam', '#FFF6E6')}</g><g transform="translate(150 0) scale(1.7)">${silK('kadin', '#FFF6E6')}</g>` + `<g transform="translate(-150 -190)"><rect x="-80" y="-50" width="160" height="100" rx="30" fill="#2FA89A"/><text y="26" font-size="76" font-weight="900" text-anchor="middle" style="fill:#fff">A</text></g><g transform="translate(150 -190)"><rect x="-80" y="-50" width="160" height="100" rx="30" fill="#D8402E"/><text y="26" font-size="76" font-weight="900" text-anchor="middle" style="fill:#fff">B</text></g>`, MO.oge(t, { gir: .5, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1050, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 03 — 1: KÜÇÜK DEPREMLER BÜYÜĞÜNÜ ÖNLER → YANLIŞ → 32 KAT (10,4–18,4)
S[3] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 8.0, 'kamera']],
  sarsinti: [[3.4, 12]],
  ciz: t => {
    let o = '';
    const A = 1 - fd(t, 4.0, 4.4), B = fd(t, 4.2, 4.7);
    o += MO.sar(txt('1', 0, 150, 340, '#FFFFFF'), MO.oge(t, { gir: .1, cik: 7.9, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 140 }), 140, 520, { golge: false });
    if (A > .01) { o += `<g opacity="${A.toFixed(2)}"><g transform="translate(540 930)">` + sismo(800, t, 70, 0) + `<g transform="translate(0 150)">` + sismo(800, t + 3, 22, 1) + `</g></g></g>`;
      o += ET(t, .8, 4.3, '"KÜÇÜK DEPREMLER', '#FFFFFF', '#2FA89A', 56, 470, -2) + ET(t, 1.3, 4.3, 'BÜYÜĞÜNÜ ÖNLER"', '#E8903D', '#3A2A1A', 62, 620, 2);
      o += MO.sar(damga('YANLIŞ', '#D8402E', 100, -8), MO.oge(t, { gir: 3.4, cik: 4.3, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 930, { golge: false }); }
    if (B > .01) {
      o += `<g opacity="${B.toFixed(2)}">`;
      [[5.0, 330, 'M5', 90, '#2FA89A'], [5.9, 540, 'M6', 160, '#E8903D'], [6.8, 750, 'M7', 250, '#D8402E']].forEach(([g, x, ad, sz, rk]) => o += MO.sar(R(-sz / 2, -sz / 2, sz, sz, 26, rk) + txt(ad, 0, 20, Math.max(40, sz * .3), '#fff'), MO.oge(t, { gir: g, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x }), x, 920 + (250 - sz) / 2 * .4, { golge: false }));
      o += MO.sar(txt('×32', 0, 22, 70, '#FFD23F'), MO.oge(t, { gir: 5.6, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 435 }), 435, 780, { golge: false }) + MO.sar(txt('×32', 0, 22, 70, '#FFD23F'), MO.oge(t, { gir: 6.5, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 645 }), 645, 760, { golge: false });
      o += ET(t, 4.4, 99, 'BÜYÜKLÜK +1', '#FFFFFF', '#3A2A1A', 56, 450, -2) + ET(t, 6.5, 99, 'ENERJİ ≈ 32 KAT', '#FFD23F', '#3A2A1A', 60, 1180, 2) + `</g>`;
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'merak' })
});"""
# 04 — 7'LİK = 1000 × 5'LİK (18,4–24,3)
S[4] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.9, 'kamera']],
  sarsinti: [[3.0, 14]],
  ciz: t => {
    let o = '';
    const g = 1 - fd(t, 2.9, 3.3), n = Math.round(1000 * ob(fd(t, .3, 2.8)));
    if (g > .01) { o += `<g opacity="${g.toFixed(2)}">`; for (let i = 0; i < 1000; i++) { if (i >= n) break; const c = i % 40, r = Math.floor(i / 40); o += `<rect x="${F1(100 + c * 22)}" y="${F1(560 + r * 22)}" width="17" height="17" rx="4" fill="#2FA89A"/>`; } o += `</g>`;
      o += ET(t, .1, 3.0, '1000 × M5', '#FFFFFF', '#2FA89A', 96, 440, -2); }
    if (t > 3.0) { o += MO.sar(R(-230, -230, 460, 460, 50, '#D8402E') + txt('M7', 0, 60, 190, '#FFFFFF'), MO.oge(t, { gir: 3.1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
      o += ET(t, 3.2, 99, 'M7 = 1000 × M5', '#FFD23F', '#3A2A1A', 80, 440, -2); }
    if (t > 3.7) o += ET(t, 3.8, 99, 'KÜÇÜKLER BÜYÜĞÜN YERİNİ TUTMAZ', '#FFFFFF', '#D8402E', 40, 1180, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'saskin' })
});"""
# 05 — 2: KAPI EŞİĞİ (24,3–33,8)
S[5] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 9.5, 'kamera']],
  sarsinti: [[2.8, 10], [7.4, 14]],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('2', 0, 150, 340, '#FFFFFF'), MO.oge(t, { gir: .1, cik: 9.4, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 140 }), 140, 520, { golge: false });
    const A = 1 - fd(t, 3.9, 4.3), B = fd(t, 4.1, 4.6) * (1 - fd(t, 7.0, 7.3)), C = fd(t, 7.1, 7.6);
    if (A > .01) { o += `<g opacity="${A.toFixed(2)}"><g transform="translate(540 1120) ${sallan(t, t > 2.8 ? 7 : 0, 30)}">` + R(-170, -420, 340, 440, 10, '#6B4630') + R(-134, -384, 268, 404, 6, '#14100C') + `<g transform="translate(0 -20) scale(2)">${silK('adam', '#FFF6E6')}</g>` + `</g></g>`;
      o += ET(t, .8, 3.9, '"KAPI EŞİĞİ', '#FFFFFF', '#2FA89A', 56, 440, -2) + ET(t, 1.3, 3.9, 'EN GÜVENLİ YERDİR"', '#E8903D', '#3A2A1A', 56, 580, 2);
      o += MO.sar(damga('YANLIŞ', '#D8402E', 100, -8), MO.oge(t, { gir: 2.8, cik: 3.9, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 900, { golge: false }); }
    if (B > .01) { o += `<g opacity="${B.toFixed(2)}">` + R(220, 640, 240, 420, 12, '#8A5A3A') + txt('DUVAR', 340, 1130, 46, '#FFF6E6') + R(620, 640, 40, 420, 8, '#C9A267') + txt('KAPI', 640, 1130, 46, '#FFF6E6') + `<text x="540" y="880" font-size="96" font-weight="900" text-anchor="middle" style="fill:#FFD23F">&gt;</text></g>`;
      o += ET(t, 4.2, 7.1, 'İÇ KAPILARIN ÇOĞU', '#FFFFFF', '#2FA89A', 48, 440, -2) + ET(t, 4.8, 7.1, 'DUVARDAN SAĞLAM DEĞİL', '#E8903D', '#3A2A1A', 50, 570, 2); }
    if (C > .01) { const sw = ob(fd(t, 7.4, 8.4)); o += `<g opacity="${C.toFixed(2)}"><g transform="translate(540 1120)">` + R(-170, -420, 340, 440, 10, '#6B4630') + R(-134, -384, 268, 404, 6, '#14100C') + `<g transform="translate(60 -20) scale(1.8) rotate(${F1(-10 * sw)})">${silK('adam', '#FFF6E6')}</g><g transform="translate(-134 -384) rotate(${F1(-70 * sw)})"><rect x="0" y="0" width="268" height="404" rx="6" fill="#8A5A3A"/><circle cx="236" cy="210" r="12" fill="#FFD23F"/></g></g></g>`;
      o += ET(t, 7.2, 99, 'KAPI SALLANIP SANA ÇARPABİLİR', '#FFFFFF', '#D8402E', 40, 440, -2); }
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'endise' })
});"""
# 06 — AFAD: çok sağlam olduğunu bilmediğin kapıyı kullanma (33,8–38,0)
S[6] = r"""
MO.sahne({
  zemin: """ + ZY + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.2, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(R(-170, -70, 340, 140, 36, '#F3E3C3') + `<rect x="-170" y="-70" width="340" height="140" rx="36" fill="none" stroke="#2FA89A" stroke-width="7"/>` + txt('AFAD', 0, 40, 110, '#1F3A32'), MO.oge(t, { gir: .2, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 700, { golge: false });
    o += ET(t, .6, 99, 'ÇOK SAĞLAM OLDUĞUNU', '#FFFFFF', '#2FA89A', 56, 900, -2) + ET(t, 1.2, 99, 'BİLMEDİĞİN KAPIYI', '#FFD23F', '#1F3A32', 60, 1030, 2) + ET(t, 2.0, 99, 'KULLANMA', '#D8402E', '#FFFFFF', 86, 1180, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 07 — 3: HAYVANLAR DEPREMİ ÖNCEDEN SEZER Mİ? (38,0–48,6)
S[7] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 10.6, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('3', 0, 150, 340, '#FFFFFF'), MO.oge(t, { gir: 3.2, cik: 10.5, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 140 }), 140, 520, { golge: false });
    o += ET(t, .1, 3.1, 'HAYVANLAR DEPREMİ', '#FFFFFF', '#2FA89A', 52, 450, -2) + ET(t, .5, 3.1, 'ÖNCEDEN SEZER Mİ?', '#E8903D', '#3A2A1A', 66, 600, 2);
    const tuhaf = t > 5.6 && t < 8.3, z = fd(t, 3.4, 4.0);
    o += `<g transform="translate(330 960) ${tuhaf ? sallan(t, 9, 34) : ''}" opacity="${z.toFixed(2)}">` + kedi(1.3) + `</g><g transform="translate(760 970) ${tuhaf ? sallan(t + 1, 9, 31) : ''}" opacity="${z.toFixed(2)}">` + kopek(1.2) + `</g>`;
    if (t > 3.4) o += `<text x="540" y="790" font-size="170" font-weight="900" text-anchor="middle" style="fill:#FFD23F" opacity="${fd(t, 3.4, 3.9).toFixed(2)}">?</text>`;
    if (t > 4.1) o += MO.sar(damga('KANITLANMADI', '#D8402E', 76, -6), MO.oge(t, { gir: 4.2, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1170, { golge: false });
    o += ET(t, 5.5, 8.3, 'DEPREM SIRASINDA TUHAF DAVRANABİLİR', '#FFFFFF', '#2FA89A', 38, 450, -2) + ET(t, 8.4, 99, 'ÖNCEDEN BİLDİKLERİ GÖSTERİLMEDİ', '#FFD23F', '#3A2A1A', 40, 450, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak', b: [['gubi', .1, 2.7, 'Hayvanlar sezer mi?']] })
});"""
# 08 — 4: "ŞU GÜN, ŞU SAATTE DEPREM OLACAK" paylaşımı (48,6–53,2)
S[8] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.6, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('4', 0, 150, 340, '#FFFFFF'), MO.oge(t, { gir: .1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 140 }), 140, 520, { golge: false });
    o += MO.sar(R(-370, -250, 740, 500, 40, '#F3E3C3') + R(-370, -250, 740, 90, 40, '#D8402E') + R(-370, -200, 740, 40, 0, '#D8402E') + txt('SON DAKİKA?!', 0, -178, 56, '#fff') + txt('ŞU GÜN, ŞU SAATTE', 0, -50, 62, '#1B1626') + txt('DEPREM OLACAK!', 0, 40, 74, '#D8402E') + `<g transform="translate(-250 150)"><circle r="26" fill="#FF4F6D"/><rect x="40" y="-10" width="110" height="20" rx="10" fill="#B8AC90"/></g><g transform="translate(130 150)"><rect x="0" y="-12" width="200" height="24" rx="12" fill="#B8AC90"/></g>`,
      MO.oge(t, { gir: .4, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 860, { golge: false });
    o += ET(t, .9, 99, 'BU PAYLAŞIMLARI GÖRDÜN MÜ?', '#FFFFFF', '#2FA89A', 48, 450, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'dusun' })
});"""
# 09 — HİÇBİR BİLİM İNSANI GÜN · SAAT · BÜYÜKLÜK SÖYLEYEMİYOR · YILLARA YAYILAN OLASILIK (53,2–62,0)
S[9] = r"""
MO.sahne({
  zemin: """ + ZY + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 8.8, 'kamera']],
  ciz: t => {
    let o = '';
    o += ET(t, .1, 5.5, 'HİÇBİR BİLİM İNSANI', '#FFFFFF', '#2FA89A', 56, 450, -2) + ET(t, .5, 5.5, 'ÖNCEDEN SÖYLEYEMİYOR', '#FFD23F', '#1F3A32', 56, 580, 2);
    [[2.4, 'GÜN', 740], [3.0, 'SAAT', 900], [3.9, 'BÜYÜKLÜK', 1060]].forEach(([g, ad, y]) => {
      o += MO.sar(R(-300, -66, 600, 132, 40, '#F3E3C3') + `<rect x="-300" y="-66" width="600" height="132" rx="40" fill="none" stroke="#D8402E" stroke-width="6"/>` + txt(ad, -60, 28, 70, '#1F3A32') + `<g transform="translate(220 0) scale(.8)"><circle r="60" fill="#D8402E"/><path d="M-24 -24 L24 24 M24 -24 L-24 24" stroke="#fff" stroke-width="14" stroke-linecap="round"/></g>`, MO.oge(t, { gir: g, cik: 5.6, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 540, y, { golge: false });
    });
    if (t > 5.6) {
      const p = ob(fd(t, 5.8, 6.8));
      o += `<g opacity="${fd(t, 5.6, 6.0).toFixed(2)}"><rect x="120" y="860" width="840" height="46" rx="23" fill="#14302A"/><rect x="120" y="860" width="${F1(840 * p * .55)}" height="46" rx="23" fill="#2FA89A"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${F1(120 + i * 140)}" y="840" width="4" height="86" fill="#F3E3C3" opacity=".5"/>`).join('') + txt('YILLAR', 540, 980, 50, '#BFF0E4') + `</g>`;
      o += ET(t, 5.8, 99, 'YALNIZCA YILLARA YAYILAN', '#FFFFFF', '#2FA89A', 46, 450, -2) + ET(t, 6.3, 99, 'OLASILIK HESAPLANIYOR', '#FFD23F', '#1F3A32', 54, 580, 2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'dusun' })
});"""
# 10 — 5: ÇÖK-KAPAN-TUTUN MU, HAYAT ÜÇGENİ Mİ? (62,0–65,6)
S[10] = r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 3.6, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('5', 0, 150, 340, '#FFFFFF'), MO.oge(t, { gir: .1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 140 }), 140, 520, { golge: false });
    o += MO.sar(R(-210, -170, 420, 340, 36, '#2FA89A') + txt('ÇÖK-KAPAN', 0, -20, 58, '#fff') + txt('-TUTUN', 0, 50, 62, '#fff'), MO.oge(t, { gir: .6, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 290, 900, { golge: false });
    o += MO.sar(R(-210, -170, 420, 340, 36, '#E8903D') + txt('HAYAT', 0, -20, 62, '#3A2A1A') + txt('ÜÇGENİ', 0, 50, 62, '#3A2A1A'), MO.oge(t, { gir: .95, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 790, 900, { golge: false });
    o += MO.sar(R(-60, -46, 120, 92, 46, '#D8402E') + txt('VS', 0, 22, 54, '#fff'), MO.oge(t, { gir: 1.4, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 900, { golge: false });
    o += ET(t, 1.2, 99, 'HANGİSİ?', '#FFD23F', '#3A2A1A', 90, 1180, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 11 — UZMANLAR AYRIŞIYOR · AFAD: ÇÖK-KAPAN-TUTUN (65,6–70,1)
S[11] = r"""
MO.sahne({
  zemin: """ + ZY + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.5, 'kamera']],
  ciz: t => {
    let o = '';
    o += ET(t, .1, 1.6, 'UZMANLAR AYRIŞIYOR', '#FFFFFF', '#D8402E', 62, 450, -2);
    o += MO.sar(R(-170, -64, 340, 128, 34, '#F3E3C3') + `<rect x="-170" y="-64" width="340" height="128" rx="34" fill="none" stroke="#2FA89A" stroke-width="7"/>` + txt('AFAD', 0, 34, 90, '#1F3A32'), MO.oge(t, { gir: 1.6, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 450, { golge: false });
    o += `<g transform="translate(540 1050)" opacity="${fd(t, 1.9, 2.4).toFixed(2)}">` + masaK(460, 260) + `<g transform="translate(0 -4) scale(1.4)">${cokK('#FFF6E6')}</g></g>`;
    o += ET(t, 2.1, 99, 'ÇÖK-KAPAN-TUTUN', '#FFD23F', '#1F3A32', 76, 640, -2) + ET(t, 2.8, 99, 'ANA ÖNERİ', '#FFFFFF', '#2FA89A', 56, 770, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 12 — AKUT GİBİ UZMANLAR: BİNA ÇÖKERSE MASANIN ALTI EZİLEBİLİR (70,1–75,7)
S[12] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#3A1F18', alt: '#120808', isik: [540, 860, '#D8402E', .18], ikinci: [900, 300, '#E8903D', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.6, 'kamera']],
  sarsinti: [[2.7, 16]],
  ciz: t => {
    let o = '';
    o += ET(t, .1, 99, 'AKUT GİBİ KURTARMA UZMANLARI', '#FFFFFF', '#D8402E', 40, 450, -2) + ET(t, .6, 99, 'MASANIN ALTI EZİLEBİLİR', '#FFD23F', '#3A1F18', 56, 590, 2);
    const ineT = ob(fd(t, 2.2, 3.0));
    o += `<g transform="translate(540 1130)">` + masaK(480, 270) + `<g transform="translate(0 -4) scale(1.5)">${cokK('#FFF6E6')}</g></g>`;
    o += `<g transform="translate(540 ${F1(660 + 150 * ineT)})"><rect x="-420" y="-40" width="840" height="86" rx="10" fill="#8A8A8A"/><rect x="-420" y="-40" width="840" height="20" rx="10" fill="#B0B0B0"/>` + (t > 3.0 ? `<path d="M-160 -40 L-120 20 L-170 46 M100 -40 L140 10 L90 46" stroke="#4A4A4A" stroke-width="7" fill="none"/>` : '') + `</g>`;
    if (t > 3.0) o += `<g transform="translate(540 1010)">${Array.from({ length: 6 }, (_, i) => `<circle cx="${(i - 2.5) * 70}" cy="${(i % 2) * 20}" r="${F1(20 + 30 * fd(t, 3.0, 4.2))}" fill="#C9A87A" opacity=".18"/>`).join('')}</g>`;
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'endise' })
});"""
# 13 — YANINA GEÇ, YAN YAT: HAYAT ÜÇGENİ (75,7–82,5)
S[13] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1F3A32', alt: '#0A1412', isik: [540, 860, '#2FA89A', .22], ikinci: [900, 300, '#E8903D', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 6.8, 'kamera']],
  sarsinti: [[1.6, 12]],
  ciz: t => {
    let o = '';
    const ine = ob(fd(t, 1.0, 2.2)), u = fd(t, 2.6, 3.4);
    o += `<rect x="-100" y="1150" width="1280" height="14" fill="#5A4636"/>`;
    o += `<g transform="translate(430 1150)">` + dolapK(200, 330) + `</g>`;
    o += `<g transform="translate(530 810) rotate(${F1(36 * ine)})"><rect x="-10" y="-28" width="540" height="56" rx="8" fill="#8A8A8A"/><rect x="-10" y="-28" width="540" height="14" rx="6" fill="#B0B0B0"/></g>`;
    if (u > 0) o += `<path d="M545 1150 L545 866 L1000 1150Z" fill="#2FA89A" opacity="${(.28 * u).toFixed(2)}"/><path d="M545 1150 L545 866 L1000 1150Z" fill="none" stroke="#7FFFD4" stroke-width="7" stroke-dasharray="22 14" opacity="${u.toFixed(2)}"/>`;
    o += `<g transform="translate(800 1128)" opacity="${fd(t, .8, 1.4).toFixed(2)}">${yatanK('#FFF6E6')}</g>`;
    o += ET(t, .1, 5.3, 'SAĞLAM MASANIN YA DA DOLABIN', '#FFFFFF', '#2FA89A', 40, 450, -2) + ET(t, .6, 5.3, 'YANINA GEÇ, YAN YAT', '#FFD23F', '#1F3A32', 62, 590, 2);
    o += ET(t, 3.1, 99, 'HAYAT ÜÇGENİ', '#2FA89A', '#FFFFFF', 76, 740, -2);
    o += ET(t, 5.4, 99, 'ALTINA DEĞİL, YANINA', '#D8402E', '#FFFFFF', 58, 500, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'dusun' })
});"""
# 14 — SEN HANGİSİNE İNANIYORDUN? (82,5–86,1)
S[14] = KART5 + r"""
MO.sahne({
  zemin: """ + ZM + r""",
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 3.6, 'kamera']],
  ciz: t => {
    let o = kart5(t, 0.1, 880, 1, fd(t, .8, 1.2));
    o += ET(t, .1, 99, 'HANGİSİNE', '#FFFFFF', '#D8402E', 80, 450, -2) + ET(t, .5, 99, 'İNANIYORDUN?', '#FFD23F', '#3A2A1A', 90, 620, 2);
    o += MO.sar(zamanChip('YORUMLARA YAZ', 0, 0, '#FFD23F', '#1B2440', 46), MO.oge(t, { gir: 2.4, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1180, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
# 15 — TAKİP (86,1–89,2)
S[15] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#101A30', alt: '#0A0F1C', isik: [540, 760, '#FFD23F', .22], supurme: .04 }),
  kamera: [[0, 1.08, 540, 800], [.1, 1.0, 540, 900, 3.1, 'kamera']],
  ciz: t => {
    const kart = R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FFD23F" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF');
    let o = MO.sar(kart, MO.oge(t, { gir: .04, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 760);
    const bs = t > 1.9 && t < 2.05 ? .92 : 1;
    o += MO.sar(`<g transform="scale(${bs})">` + R(-220, -40, 440, 80, 40, '#FFD23F') + AU.yaz('+ TAKİP ET', 0, 18, 46, '#1B2440') + '</g>', MO.oge(t, { gir: 1.3, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 300, y: 1540, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1720, boy: 220, duygu: 'mutlu', bakHedef: 'kamera' })
});"""
