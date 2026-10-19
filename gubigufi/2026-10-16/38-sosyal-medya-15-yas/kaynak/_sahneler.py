S = {}
# 01 — KANCA (0–6,0): sosyal medya KISITLANIYOR → hesabın bu işin içinde olabilir → kontrol et
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1245', alt: '#0E0618', isik: [540, 860, '#FF4F9A', .26], ikinci: [900, 300, '#FF8A3D', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 930, 6.0, 'kamera']],
  sarsinti: [[.05, 10], [.4, 14]],
  ciz: t => {
    let o = '';
    const fd1 = 1 - fd(t, 2.2, 2.5);
    const ic = (fd1 > .01 ? `<g opacity="${fd1.toFixed(2)}">` + feedK(t) + `</g>` : '') + `<g opacity="${fd(t, 2.2, 2.6).toFixed(2)}">` + profilK(1, ob(fd(t, 3.4, 3.9))) + `</g>`;
    o += `<g transform="translate(540 ${F1(1010 + 40 * (1 - ob(fd(t, .0, .6))))})">` + telK(1.28, ic) + `</g>`;
    o += ET(t, .05, 2.4, 'SOSYAL MEDYA', '#FFFFFF', '#D8222E', 84, 450, -2) + ET(t, .4, 2.4, 'KISITLANIYOR', SARI, '#2A1245', 100, 620, 2);
    o += ET(t, 2.45, 4.4, 'HESABIN BU İŞİN İÇİNDE', '#FFFFFF', '#6A2BD9', 50, 450, -2) + ET(t, 3.1, 4.4, 'OLABİLİR', SARI, '#2A1245', 84, 600, 2);
    if (t > 4.5) { const q = fd(t, 4.5, 5.0), mx = 540 + 150 - 300 * fd(t, 4.6, 5.8), my = 930 + 60 * Math.sin(t * 4); o += `<g transform="translate(${F1(mx)} ${F1(my)})" opacity="${q.toFixed(2)}">` + mercekK(1.7) + `</g>`; o += ET(t, 4.55, 6.0, 'BİR KONTROL ET', MINT, '#0B1433', 66, 450, -2); }
    return o;
  },
  onCiz: t => ''
});"""

# 02 — ÜÇ ŞEY VAR (6,0–10,0)
S[2] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1B1240', alt: '#0A0718', isik: [540, 800, '#7E5BFF', .22], ikinci: [900, 1300, '#FF4F9A', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.0, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('3', 0, 150, 420, '#FFFFFF') + `<ellipse cx="0" cy="190" rx="170" ry="24" fill="#000" opacity=".25"/>`, MO.oge(t, { gir: .1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 650, { golge: false });
    o += ET(t, .3, 3.9, 'ÜÇ ŞEY VAR', SARI, '#2A1245', 86, 430, -2);
    [[1, 270, .5, '#6A2BD9'], [2, 540, .8, '#FF4F9A'], [3, 810, 1.1, '#FF8A3D']].forEach(([n, x, g, rk]) => {
      const sar3 = n === 3 && t > 1.5 ? Math.sin(t * 22) * 5 * Math.max(0, 1 - (t - 1.5) * .6) : 0;
      o += MO.sar(R(-110, -110, 220, 220, 44, rk) + (n === 3 && t > 1.4 ? `<g transform="translate(${sar3.toFixed(1)} 0)">` + kilitK(1.2, '#fff') + `</g>` : txt(String(n), 0, 40, 130, '#fff')), MO.oge(t, { gir: g, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x }), x, 920, { golge: false });
    });
    o += ET(t, 1.5, 3.9, 'SONUNCUSU SENİ', '#FFFFFF', '#D8222E', 48, 1100, -2) + ET(t, 2.2, 3.9, 'ŞAŞIRTACAK', SARI, '#2A1245', 68, 1205, 2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 03 — 1 KASIM + e-DEVLET (10,0–15,0)
S[3] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241040', alt: '#0B0618', isik: [540, 820, '#D8222E', .18], ikinci: [200, 1400, '#6A2BD9', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 940, 5.0, 'kamera']],
  ciz: t => {
    let o = '';
    const takv = ob(fd(t, .7, 1.3)) * (1 - fd(t, 2.0, 2.4));
    if (takv > .01) o += `<g transform="translate(540 ${F1(800 + 60 * (1 - takv))}) rotate(${F1(-5 * (1 - takv))}) scale(${takv.toFixed(3)})">` + takvimK('KASIM', '1', '2026') + `</g>`;
    const f = fd(t, 1.9, 2.4);
    if (f > .01) {
      o += `<g opacity="${f.toFixed(2)}">` + R(210, 610, 660, 520, 40, '#F7F2EA') + `<rect x="210" y="610" width="660" height="520" rx="40" fill="none" stroke="#6A2BD9" stroke-width="6"/>` + txt('HESAP AÇ', 540, 710, 66, '#1B1626') +
        R(270, 750, 540, 70, 18, '#E7E1F3') + `<text x="294" y="797" font-size="30" font-weight="800" style="fill:#7A7490" text-anchor="start">kullanıcı adı</text>` + R(270, 840, 540, 70, 18, '#E7E1F3') + `<text x="294" y="887" font-size="30" font-weight="800" style="fill:#7A7490" text-anchor="start">yaşın kaç?</text>` + R(270, 950, 540, 90, 45, '#C9C2DA') + txt('DEVAM', 540, 1012, 50, '#fff') + `</g>`;
    }
    if (t > 2.9) { const k = ob(fd(t, 2.9, 3.5)); o += `<g transform="translate(${F1(540 + 250 * (1 - k))} 960) scale(${(1.1 * k).toFixed(3)})">` + edevlet(1.15) + `</g>`; }
    if (t > 3.6) o += MO.sar(damga('YAŞ DOĞRULAMA', MINT, 62, -6), MO.oge(t, { gir: 3.7, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1200, { golge: false });
    o += ET(t, .1, 99, '1 KASIM', SARI, '#2A1245', 100, 450, -2);
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'dusun' })
});"""

# 04 — DOĞRULAMA KODU: sadece 15 / 18 (15,0–21,2)
S[4] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12263A', alt: '#070E18', isik: [540, 800, '#2FD6A8', .20], ikinci: [900, 300, '#7E5BFF', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 6.2, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(R(-350, -250, 700, 520, 40, '#F7F2EA') + R(-350, -250, 700, 100, 40, EDK) + R(-350, -190, 700, 40, 0, EDK) + txt('YAŞ DOĞRULAMA KODU', 0, -176, 46, '#fff') + `<g transform="translate(-270 -60)"><text font-size="26" font-weight="800" style="fill:#7A7490" text-anchor="start">KOD:</text></g>` + `<g transform="translate(-130 -78)">` + Array.from({ length: 6 }, (_, i) => R(i * 60, 0, 48, 56, 10, '#E7E1F3')).join('') + `</g>`,
      MO.oge(t, { gir: .1, cik: 99, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 760, { golge: false });
    const sat = (y, ad, ok, g) => t > g ? `<g opacity="${fd(t, g, g + .3).toFixed(2)}"><text x="220" y="${y + 14}" font-size="38" font-weight="900" style="fill:#1B1626" text-anchor="start">${ad}</text><g transform="translate(${F1(840)} ${y}) scale(${(.62 * ob(fd(t, g + .1, g + .5))).toFixed(3)})">` + (ok ? tik(1) : hayirK(1, '#9A94B0')) + `</g></g>` : '';
    o += sat(790, '15 YAŞINI DOLDURDU MU?', true, 1.3) + sat(880, '18 YAŞINI DOLDURDU MU?', false, 2.7);
    o += ET(t, .2, 99, 'SADECE İKİ BİLGİ', SARI, '#2A1245', 66, 440, -2);
    if (t > 4.5) {
      o += MO.sar(R(-290, -52, 580, 104, 26, '#1B1626') + `<text x="-250" y="14" font-size="40" font-weight="900" style="fill:#F4F1E8" text-anchor="start">AD: </text>` + R(-130, -18, 380, 36, 8, '#000') , MO.oge(t, { gir: 4.55, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1090, { golge: false });
      o += MO.sar(R(-290, -52, 580, 104, 26, '#1B1626') + `<text x="-250" y="14" font-size="40" font-weight="900" style="fill:#F4F1E8" text-anchor="start">KİMLİK NO: </text>` + R(60, -18, 190, 36, 8, '#000'), MO.oge(t, { gir: 5.0, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1200, { golge: false });
      o += MO.sar(damga('YOK', '#E8323C', 76, -10), MO.oge(t, { gir: 5.2, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 720, 1150, { golge: false });
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 05 — GUBİ SORUSU: eski hesaplar ne olacak? (21,2–24,1)
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1245', alt: '#0E0618', isik: [540, 800, '#FF4F9A', .20], ikinci: [900, 300, '#FF8A3D', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 2.9, 'kamera']],
  ciz: t => {
    let o = ET(t, .1, 99, 'ESKİ HESAPLAR', '#FFFFFF', '#6A2BD9', 66, 440, -2) + ET(t, .5, 99, 'NE OLACAK?', SARI, '#2A1245', 90, 600, 2);
    for (let i = 0; i < 3; i++) {
      const g = .2 + i * .22;
      o += MO.sar(R(-300, -86, 600, 172, 40, '#241A44') + `<rect x="-300" y="-86" width="600" height="172" rx="40" fill="none" stroke="${[PEMBE, TURUNCU, '#7E5BFF'][i]}" stroke-width="5"/><circle cx="-210" r="52" fill="${[PEMBE, TURUNCU, '#7E5BFF'][i]}"/><circle cx="-210" cy="-12" r="18" fill="#FFF6E6"/><path d="M-246 38 Q-210 6 -174 38Z" fill="#FFF6E6"/><rect x="-130" y="-26" width="240" height="20" rx="10" fill="#9A8FCB"/><rect x="-130" y="12" width="160" height="14" rx="7" fill="#6A5F95"/><text x="230" y="22" font-size="76" font-weight="900" text-anchor="middle" style="fill:${SARI}">?</text>`,
        MO.oge(t, { gir: g, agirlik: 'orta', giris: 'yan', materyal: 'plastik', x: 540 }), 540, 810 + i * 170, { golge: false });
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak', b: [['gubi', .3, 2.7, 'Hesabım kapanır mı?']] })
});"""

# 06 — İKİ: 31 MART · yetişkinsen kapanmaz (24,1–29,2)
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1D1450', alt: '#090620', isik: [540, 800, '#7E5BFF', .22], ikinci: [900, 1300, '#2FD6A8', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.1, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('2', 0, 90, 220, '#FFFFFF'), MO.oge(t, { gir: .1, cik: 5.0, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 140 }), 140, 520, { golge: false });
    const tk = ob(fd(t, .8, 1.4));
    o += `<g transform="translate(${F1(640 + 80 * (1 - tk))} 770) rotate(3) scale(${(.7 * tk).toFixed(3)})">` + takvimK('MART', '31', '2027', '#6A2BD9') + `</g>`;
    o += ET(t, .9, 99, 'ESKİ HESAPLAR DA', '#FFFFFF', '#6A2BD9', 46, 430, -2) + ET(t, 1.3, 99, 'DOĞRULANACAK', SARI, '#2A1245', 66, 540, 2);
    const ok = fd(t, 3.4, 3.9);
    if (ok > .01) {
      o += MO.sar(R(-300, -86, 600, 172, 40, '#241A44') + `<rect x="-300" y="-86" width="600" height="172" rx="40" fill="none" stroke="${MINT}" stroke-width="6"/><circle cx="-210" r="52" fill="${MINT}"/><circle cx="-210" cy="-12" r="18" fill="#FFF6E6"/><path d="M-246 38 Q-210 6 -174 38Z" fill="#FFF6E6"/><rect x="-130" y="-26" width="240" height="20" rx="10" fill="#9A8FCB"/><rect x="-130" y="12" width="160" height="14" rx="7" fill="#6A5F95"/><g transform="translate(230 0) scale(.75)">${tik(1)}</g>`, MO.oge(t, { gir: 3.45, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 1150, { golge: false });
      o += ET(t, 3.5, 99, 'YETİŞKİNSEN KAPANMAZ', MINT, '#0B1433', 46, 1005, -2);
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 07 — ÜÇ: yasağın asıl hedefi çocuklar (29,2–36,9)
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#33103A', alt: '#12061A', isik: [540, 820, '#FF4F9A', .24], ikinci: [200, 1400, '#FFD23F', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.06, 540, 960, 7.7, 'kamera']],
  sarsinti: [[1.3, 10], [3.0, 10]],
  ciz: t => {
    let o = '';
    o += MO.sar(txt('3', 0, 150, 340, '#FFFFFF'), MO.oge(t, { gir: .05, cik: 1.3, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 720, { golge: false });
    const A = fd(t, 1.3, 1.8) * (1 - fd(t, 3.0, 3.35));
    if (A > .01) {
      o += ET(t, 1.4, 99, 'YASAĞIN ASIL HEDEFİ', '#FFFFFF', '#D8222E', 52, 440, -2) + ET(t, 1.9, 6.0, 'ÇOCUKLAR', SARI, '#2A1245', 100, 600, 2);
      [[270, 1], [540, .9], [810, 1.1]].forEach(([x, s], i) => o += MO.sar(`<g transform="scale(${(1.9 * s).toFixed(2)})">` + silK('cocuk', ['#FFB3D4', '#FFE08A', '#9FE3C8'][i]) + `</g>`, MO.oge(t, { gir: 1.7 + i * .15, agirlik: 'orta', giris: 'yuksel', x }), x, 1040, { golge: false }));
    }
    if (t > 3.0) {
      const B = fd(t, 3.0, 3.4) * (1 - fd(t, 6.0, 6.3));
      o += `<g opacity="${B.toFixed(2)}">` + R(190, 760, 700, 360, 36, '#F7F2EA') + txt('HESAP AÇ', 540, 840, 56, '#1B1626') + R(250, 870, 580, 66, 16, '#E7E1F3') + R(250, 960, 580, 90, 45, '#C9C2DA') + txt('DEVAM', 540, 1022, 46, '#fff') + `</g>`;
      o += MO.sar(damga('HESAP AÇAMAZ', '#E8323C', 64, -8), MO.oge(t, { gir: 3.9, cik: 6.1, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1180, { golge: false });
    }
    if (t > 6.2) {
      o += `<g opacity="${fd(t, 6.2, 6.6).toFixed(2)}">` + `<g transform="translate(330 1010) scale(2)">` + silK('adam', '#AEB8D0') + `</g><g transform="translate(760 1050) scale(2.1)">` + silK('cocuk', '#FFB3D4') + `</g></g>`;
      o += MO.sar(R(-330, -78, 660, 156, 40, '#241A44') + `<rect x="-330" y="-78" width="660" height="156" rx="40" fill="none" stroke="#FF8A3D" stroke-width="6"/>` + txt('EBEVEYN İZNİ', 0, 6, 62, '#FFF6E6') + txt('YETMEZ', 0, 62, 54, '#FF8A3D'), MO.oge(t, { gir: 6.3, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 620, { golge: false });
      o += MO.sar(`<g transform="translate(0 0) scale(1.4)">${hayirK(1)}</g>`, MO.oge(t, { gir: 6.7, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1010, { golge: false });
    }
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'endise' })
});"""

# 08 — 15–17: gizli · canlı yok · görüldü yok · sonsuz kaydırma yok (36,9–46,2)
S[8] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1245', alt: '#0E0618', isik: [540, 780, '#FF4F9A', .22], ikinci: [900, 1500, '#7E5BFF', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 940, 9.3, 'kamera']],
  ciz: t => {
    let o = ET(t, .1, 99, '15 YAŞINI GEÇEN GENÇ', '#FFFFFF', '#6A2BD9', 46, 430, -2);
    o += MO.sar(R(-330, -110, 660, 220, 44, '#241A44') + `<rect x="-330" y="-110" width="660" height="220" rx="44" fill="none" stroke="${PEMBE}" stroke-width="6"/><circle cx="-220" r="70" fill="${PEMBE}"/><circle cx="-220" cy="-14" r="24" fill="#FFF6E6"/><path d="M-266 48 Q-220 6 -174 48Z" fill="#FFF6E6"/><rect x="-120" y="-40" width="300" height="26" rx="13" fill="#9A8FCB"/><rect x="-120" y="2" width="200" height="18" rx="9" fill="#6A5F95"/><rect x="-120" y="36" width="260" height="18" rx="9" fill="#6A5F95"/>` + `<g transform="translate(250 -62)">` + kilitK(.55, SARI) + `</g>`,
      MO.oge(t, { gir: .3, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 590, { golge: false });
    const R4 = [[2.2, 'kilit', 'GİZLİ HESAP', PEMBE, 0], [3.4, 'canli', 'CANLI YAYIN YOK', '#7E5BFF', 1], [4.6, 'goz', '"GÖRÜLDÜ" YOK', '#FF8A3D', 1], [5.6, 'kaydir', 'SONSUZ KAYDIRMA YOK', '#D8222E', 1]];
    R4.forEach(([g, ic, ad, rk, x], i) => {
      o += MO.sar(rozetK(ic, ad, rk), MO.oge(t, { gir: g, agirlik: 'agir', giris: 'yan', materyal: 'plastik', x: 540 }), 540, 750 + i * 135, { golge: false });
    });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 09 — GUFİ KAYDIRMA ŞAKASI (46,2–50,2)
S[9] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1245', alt: '#0E0618', isik: [540, 800, '#FF8A3D', .20], ikinci: [200, 1500, '#FF4F9A', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 980, 4.0, 'kamera']],
  ciz: t => {
    let o = '';
    o += `<g transform="translate(700 900)">` + telK(.85, feedK(t, 520 * (t < 2.8 ? 1 : .12))) + `</g>`;
    o += ET(t, .1, 99, 'KAYDIRMADAN DURABİLİR MİSİN?', '#FFFFFF', '#6A2BD9', 40, 450, -2);
    o += gufi(t, { x: 270, y: 1250, boy: 380, duygu: 'merak', bakHedef: [700, 900] });
    if (t > 2.8) o += ET(t, 2.9, 99, 'SANMIYORUM', SARI, '#2A1245', 80, 1100 + 30, 2);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1650, boy: 150, duygu: 'merak', bakHedef: [540, 1000] })
});"""

# 10 — UYARI: kodu sadece e-Devlet verir (50,2–56,0)
S[10] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1D1450', alt: '#090620', isik: [540, 800, '#D8222E', .18], ikinci: [900, 1300, '#2FD6A8', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.8, 'kamera']],
  ciz: t => {
    let o = ET(t, .1, 99, 'BİR UYARI', SARI, '#2A1245', 80, 440, -2);
    o += MO.sar(R(-330, -150, 660, 300, 40, '#F7F2EA') + `<rect x="-330" y="-150" width="660" height="300" rx="40" fill="none" stroke="${MINT}" stroke-width="7"/>` + `<g transform="translate(-200 0)">${edevlet(.85)}</g>` + txt('KODU SADECE', 100, -10, 42, '#1B1626') + txt('E-DEVLET VERİR', 100, 46, 46, EDK) + `<g transform="translate(270 -110) scale(.5)">${tik(1)}</g>`,
      MO.oge(t, { gir: .9, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 720, { golge: false });
    o += MO.sar(sahteSite(.9), MO.oge(t, { gir: 3.0, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1080, { golge: false });
    if (t > 3.2) o += MO.sar(R(-170, -50, 340, 100, 50, '#E8323C') + txt('GİRME!', 0, 22, 60, '#fff'), MO.oge(t, { gir: 5.2, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 780, 1190, { golge: false });
    if (t > 3.3) o += MO.sar(`<g transform="scale(.8)">${hayirK(1)}</g>`, MO.oge(t, { gir: 3.4, agirlik: 'orta', giris: 'olcek', x: 540 }), 880, 900, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'endise', gf: 'endise' })
});"""

# 11 — SENCE DOĞRU KARAR MI? + ARKADAŞINA GÖNDER (56,0–59,3)
S[11] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1245', alt: '#0E0618', isik: [540, 780, '#FFD23F', .18], ikinci: [900, 1300, '#FF4F9A', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 3.3, 'kamera']],
  ciz: t => {
    let o = ET(t, .1, 99, 'SENCE DOĞRU', '#FFFFFF', '#D8222E', 92, 520, -2) + ET(t, .6, 99, 'KARAR MI?', SARI, '#2A1245', 104, 700, 2);
    const u = fd(t, 1.4, 3.0);
    if (u > 0) { const x = 150 + 800 * ob(u), y = 1080 - 160 * Math.sin(Math.PI * u); o += `<g transform="translate(${F1(x)} ${F1(y)}) rotate(${F1(-14 + 20 * u)}) scale(.85)" opacity="${(Math.min(1, u * 4) * (1 - fd(t, 2.9, 3.2))).toFixed(2)}">` + ucakK(1) + `</g>`; }
    o += MO.sar(zamanChip('ARKADAŞINA GÖNDER', 0, 0, SARI, '#1B2440', 46), MO.oge(t, { gir: 1.5, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1230, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 12 — TAKİP (59,3–62,4)
S[12] = r"""
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
