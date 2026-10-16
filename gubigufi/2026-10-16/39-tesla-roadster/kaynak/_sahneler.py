S = {}
# 01 — HOOK (0–13,3): Tesla gerçek görüntü (yavaş çekim) "yan yan gidebilirsin" → fotoğraf "uçuyor" → 0→96 çubuğu 9,45–10,04 → 0.59 SN damgası → TESLA İDDİASI
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0E1E', alt: '#05070F', isik: [540, 900, '#3E6FB8', .10] }),
  kamera: [[0, 1.0, 540, 900], [.05, 1.06, 540, 900, 4.4, 'kamera'], [4.6, 1.0, 540, 900, .4], [5.1, 1.05, 540, 900, 8.0, 'kamera']],
  sarsinti: [[10.04, 14]],
  ciz: t => {
    let o = '';
    // 0–4,6: Tesla'nın gerçek tanıtım görüntüsü (yavaş çekim) — "yan yan gidebilirsin"
    const e0 = 1 - MO.cl((t - 4.4) / .5);
    if (e0 > 0) o += MO.klip('a', t * .38, { x: 540, y: 760, w: 1200, h: 1500, r: 0, op: e0 });
    // 4,4'ten sonra: gerçek fotoğraf tüm kadraj ("uçuyor")
    if (t > 4.3) {
      const tit = t > 10.04 && t < 10.6 ? Math.sin(t * 95) * 7 : 0;
      o += MO.sar(MO.fotograf('foto1', { x: 0, y: 0, w: 1150, h: 1445, r: 0, kayma: [tit, 0], olcek: 1 + .06 * MO.E.outCubic(MO.ar(t, 4.6, 13.3)) }), MO.oge(t, { gir: 4.4, agirlik: 'kahraman', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 700, { golge: false });
    }
    o += filmKat();
    o += MO.sar(altUc('15 EKİM 2026 · TANITILDI', 'TESLA ROADSTER', { renk: '#FFD23F', fs: 78 }), MO.oge(t, { gir: 5.0, cik: 7.6, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1130, { golge: false });
    const rk = MO.cl((t - 9.45) / .59);
    const sat = `<text class="mono" x="70" y="0" font-size="30" letter-spacing="4" style="fill:#FFD23F">TESLA ROADSTER · 0 → 96 KM/SA</text><text class="mono" x="1010" y="0" font-size="30" text-anchor="end" letter-spacing="2" style="fill:#FFF3D6">${(.59 * rk).toFixed(2)} sn</text>` + R(70, 20, 940, 26, 13, '#2A3550', .85) + (rk > .003 ? R(70, 20, 940 * rk, 26, 13, '#FFD23F') : '');
    o += MO.sar(sat, MO.oge(t, { gir: 7.9, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 0, 1110, { golge: false });
    o += MO.sar(etiket('0.59 SN', 0, 0, '#E8323C', '#FFFFFF', 112, -5, 1), MO.oge(t, { gir: 10.04, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 440, { golge: false });
    o += MO.sar(zamanChip('TESLA İDDİASI', 0, 0, '#E8323C', '#FFFFFF', 22), MO.oge(t, { gir: 11.4, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 965, { golge: false });
    o += kredi('GÖRÜNTÜ: TESLA (@teslamotors)', 60, 1490);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: t > 10.1 ? 'saskin' : 'merak', bakHedef: [540, 900] })
});"""
# 02 — TAŞ vs ARABA (13,3–22,0): taş 15,6'da düşer (2,73 sn); 19,9'da Roadster 0,59 sn; 20,5 "4,6×"
S[2] = r"""
const kayalik = `<path d="M-60 560 L270 560 L270 1250 L-60 1250Z" fill="#4A4F5E"/><path d="M-60 560 L270 560 L270 590 L-60 590Z" fill="#6A7080"/>` + [640, 720, 800, 880, 960, 1040, 1120].map((y, i) => `<path d="M${-60 + (i % 2) * 40} ${y} L${270 - (i % 3) * 30} ${y + 10}" stroke="#3A3E4B" stroke-width="6"/>`).join('');
MO.sahne({
  zemin: MO.zemin({ ust: '#1C2447', alt: '#0A0E22', isik: [400, 1000, '#FBAC39', .12] }),
  kamera: [[0, 1.0, 540, 900]],
  ciz: t => {
    let o = '';
    const tau = t < 6.5 ? Math.max(0, Math.min(2.73, t - 2.3)) : Math.max(0, t - 6.6), fe = Math.min(1, tau / 2.73);
    const ty = 560 + 620 * fe * fe, vT = 96 * fe, tk = (t > 5.03 && t < 6.5) ? 1 : (t >= 6.5 ? MO.ar(t, 6.5, 6.7) : 1);
    o += MO.sar(kayalik, MO.oge(t, { gir: .2, agirlik: 'agir', giris: 'yan', yon: -1, materyal: 'ahsap', x: 130 }), 0, 0, { golge: false });
    o += `<g opacity="${tk.toFixed(3)}">` + tas(325, ty, 1.1) + '</g>';
    o += MO.sar(AU.cip('TAŞ · SERBEST DÜŞÜŞ', 0, 0, '#FFFFFF', '#1B2440', 22), MO.oge(t, { gir: .9, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 570, { golge: false });
    o += MO.sar(gosterge(0, 0, 120, vT, { renk: '#9AA4B8' }), MO.oge(t, { gir: 1.0, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 700 }), 700, 750);
    const tz = t < 6.5 ? (t > 5.03 ? 2.73 : tau) : (t - 6.6 > 0 ? t - 6.6 : 0);
    o += MO.sar(zamanChip(`${tz.toFixed(2)} sn`, 0, 0, '#0B1433', '#C8D0DC', 30), MO.oge(t, { gir: 1.1, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 870, { golge: false });
    o += MO.sar(AU.cip('ROADSTER', 0, 0, '#FFD23F', '#1B2440', 22), MO.oge(t, { gir: 6.1, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 935, { golge: false });
    const rk = MO.cl((t - 6.6) / .59);
    o += MO.sar(gosterge(0, 0, 120, 96 * rk, { renk: '#FBAC39' }), MO.oge(t, { gir: 6.2, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 700 }), 700, 1085);
    o += MO.sar(zamanChip(`${(.59 * rk).toFixed(2)} sn`, 0, 0, '#0B1433', '#FBAC39', 30), MO.oge(t, { gir: 6.3, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 1215, { golge: false });
    o += MO.sar(etiket('4,6×', 0, 0, '#E8323C', '#FFFFFF', 130, -6, 1), MO.oge(t, { gir: 7.2, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 320 }), 330, 900, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 03 — TRAFİK ESPRİSİ (22,0–26,65): kornalar, kızgın amca "İN AŞAĞI LAN!", havada Roadster, "KAVGA İPTAL"
S[3] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0F1630', alt: '#06080F', isik: [620, 600, '#3E6FB8', .18], ikinci: [200, 1200, '#E8323C', .12] }),
  kamera: [[0, 1.0, 540, 900], [.1, 1.05, 540, 900, 4.3, 'kamera']],
  ciz: t => {
    let o = '';
    // siluet + yol
    let sil = ''; [[-20, 150, 520], [150, 110, 600], [260, 140, 480], [400, 120, 560], [520, 170, 440], [690, 110, 580], [800, 150, 500], [950, 130, 560]].forEach(([x, w, y]) => sil += R(x, y + 60, w, 1110 - y - 60, 4, '#151C38'));
    o += sil + R(-100, 1060, 1280, 260, 0, '#161B30') + R(-100, 1052, 1280, 12, 0, '#2A3354');
    for (let i = 0; i < 9; i++) o += R(i * 140 - 40, 1190, 80, 10, 5, '#FFD23F', .6);
    // trafik: üç araba art arda
    const arabalar = [[230, '#E8323C', -1], [560, '#3E8EDE', 0], [890, '#FBAC39', 1]];
    arabalar.forEach(([x, rk, i], k) => { o += MO.sar(SE.araba(0, 0, 1.25, { renk: rk }), MO.oge(t, { gir: .1 + k * .12, agirlik: 'orta', giris: 'yan', yon: k === 0 ? -1 : 1, materyal: 'plastik', x }), x, 1175, { golge: false }); });
    // havada duran Roadster (fotoğraf kırpığı, ekran karışımı: koyu zemin şeffaflaşır)
    const bob = Math.sin(t * 2.1) * 14, cx = 650, cy = 520 + bob, sc = 1.9, u = MO.yukle('../ortak/img/foto1.jpg');
    const roadster = `<defs><radialGradient id="rgM"><stop offset=".45" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="mskR" maskUnits="userSpaceOnUse" x="${cx - 360}" y="${cy - 360}" width="720" height="720"><rect x="${cx - 360}" y="${cy - 360}" width="720" height="720" fill="url(#rgM)"/></mask></defs>` +
      `<g mask="url(#mskR)" style="mix-blend-mode:screen"><image href="${u}" x="${cx - 330 * sc}" y="${cy - 440 * sc}" width="${640 * sc}" height="${804 * sc}"/></g>`;
    o += MO.sar(roadster, MO.oge(t, { gir: .3, agirlik: 'kahraman', giris: 'olcek', materyal: 'plastik', x: 650 }), 0, 0, { golge: false });
    // kızgın amca: soldaki arabadan sarkar
    const sal = t > 2.46 && t < 4.4 ? Math.sin(t * 40) * 4 : 0;
    const amca = `<g transform="translate(${sal} 0)"><circle r="62" fill="#E0B48A"/><path d="M-62 -10 Q-60 -64 0 -66 Q60 -64 62 -10 Q40 -40 0 -38 Q-40 -40 -62 -10Z" fill="#2A2A33"/><path d="M-46 -26 L-12 -14 M46 -26 L12 -14" stroke="#2A2A33" stroke-width="10" stroke-linecap="round"/><circle cx="-24" cy="-4" r="7" fill="#14171F"/><circle cx="24" cy="-4" r="7" fill="#14171F"/><path d="M-34 20 Q0 4 34 20 Q10 26 0 24 Q-10 26 -34 20Z" fill="#2A2A33"/><ellipse cx="0" cy="42" rx="20" ry="${t > 2.46 ? 14 : 4}" fill="#5A1A1A"/></g>`;
    o += MO.sar(amca, MO.oge(t, { gir: .55, agirlik: 'orta', giris: 'yuksel', materyal: 'kumas', x: 230 }), 220, 945, { golge: false });
    o += MO.sar(`<g transform="rotate(-18)"><rect x="-22" y="-22" width="44" height="44" rx="14" fill="#E0B48A"/></g>`, MO.oge(t, { gir: 2.46, cik: 4.6, agirlik: 'hafif', giris: 'olcek', x: 140 }), 120, 915, { golge: false });
    // korna
    o += MO.sar(txt('BİİİP!', 0, 0, 56, '#FFD23F', 900), MO.oge(t, { gir: 1.35, cik: 2.3, agirlik: 'hafif', giris: 'olcek', materyal: 'plastik', x: 560 }), 600, 885, { golge: false });
    // "İN AŞAĞI LAN!" balonu
    o += MO.sar(M.balon(0, 0, txt('İN AŞAĞI', 0, -6, 52, '#1B2440', 900) + txt('LAN!', 0, 46, 60, '#E8323C', 900), { w: 400, h: 190, yon: -1 }), MO.oge(t, { gir: 2.46, agirlik: 'oyuncu', giris: 'olcek', materyal: 'plastik', x: 300 }), 330, 725, { golge: false });
    o += MO.sar(etiket('KAVGA İPTAL', 0, 0, '#E8323C', '#FFFFFF', 84, -6, 1), MO.oge(t, { gir: 3.9, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 560, 380, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: t > 1 ? 'saskin' : 'merak', bakHedef: [540, 900] })
});"""
# 04 — İTİCİLER (26,65–31,85): GERÇEK görüntü
S[4] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0E1E', alt: '#05070F', isik: [540, 900, '#3E6FB8', .10] }),
  kamera: [[0, 1.0, 540, 900], [.1, 1.05, 540, 900, 5.0, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.klip('c', t * .46, { x: 540, y: 760, w: 1200, h: 1500, r: 0 });
    o += filmKat();
    o += MO.sar(altUc('SPACEX', 'SOĞUK GAZ İTİCİSİ', { renk: '#7FD0FF', fs: 76 }), MO.oge(t, { gir: 1.35, cik: 3.2, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1130, { golge: false });
    const k1 = MO.E.outCubic(MO.ar(t, 3.5, 4.1)), k2 = MO.E.outCubic(MO.ar(t, 3.7, 4.5));
    const kart = `<g transform="translate(-470 0)"><text class="mono" x="0" y="-26" font-size="26" letter-spacing="4" style="fill:#C8D0DC">LASTİĞİN TUTABİLDİĞİ</text>` + R(0, -8, 940, 22, 11, '#2A3550', .85) + R(0, -8, 190 * k1, 22, 11, '#8A94A8') +
      `<text class="mono" x="0" y="72" font-size="26" letter-spacing="4" style="fill:#7FD0FF">İTİCİ KUVVETİ ~4–5×</text>` + R(0, 90, 940, 22, 11, '#2A3550', .85) + R(0, 90, 940 * k2, 22, 11, '#7FD0FF') + zamanChip('TESLA İDDİASI', 830, 62, '#E8323C', '#FFFFFF', 19) + `</g>`;
    o += MO.sar(kart, MO.oge(t, { gir: 3.3, cik: 5.1, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1090, { golge: false });
    o += kredi('GÖRÜNTÜ: TESLA (@teslamotors)', 60, 1490);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1700, boy: 100, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 160, y: 1800, boy: 140, duygu: 'saskin', bakHedef: [540, 900] })
});"""
# 05 — FAN / TAVANDA TERS (31,85–35,0)
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0E1E', alt: '#05070F', isik: [540, 900, '#3E6FB8', .10] }),
  kamera: [[0, 1.05, 540, 900], [.05, 1.0, 540, 900, 3.0, 'kamera']],
  ciz: t => {
    let o = MO.klip('b', t * .6, { x: 540, y: 760, w: 1200, h: 1500, r: 0 }) + filmKat();
    o += MO.sar(altUc('FAN · EMİŞ KUVVETİ', 'TAVANA TERS', { renk: '#7FD0FF', fs: 88, etiket: 'TESLA İDDİASI' }), MO.oge(t, { gir: .9, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1130, { golge: false });
    o += kredi('GÖRÜNTÜ: TESLA (@teslamotors)', 60, 1490);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1700, boy: 100, duygu: t > 1 ? 'saskin' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 160, y: 1800, boy: 140, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 06 — ROCKET: davetli, yolda yasak (35,0–38,5)
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0E1E', alt: '#05070F', isik: [540, 900, '#3E6FB8', .10] }),
  kamera: [[0, 1.0, 540, 900], [.1, 1.06, 540, 940, 3.5, 'kamera']],
  ciz: t => {
    let o = MO.klip('d', t * .5, { x: 540, y: 760, w: 1200, h: 1500, r: 0 }) + filmKat();
    o += MO.sar(`<g transform="translate(-470 0)"><rect x="0" y="-26" width="8" height="34" rx="4" fill="#7FD0FF"/><text class="mono" x="32" y="0" font-size="30" letter-spacing="6" style="fill:#7FD0FF">ROCKET SÜRÜMÜ</text></g>`, MO.oge(t, { gir: .35, agirlik: 'hafif', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1020, { golge: false });
    o += MO.sar(`<g transform="translate(-470 0)"><text x="100" y="0" font-size="72" font-weight="900" style="fill:#FFF6E6">SADECE DAVETLİ</text></g>`, MO.oge(t, { gir: 1.75, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1110, { golge: false });
    o += MO.sar(isaretV(0, 0, 1.5), MO.oge(t, { gir: 1.8, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 140 }), 110, 1088, { golge: false });
    const sl = MO.E.outCubic(MO.ar(t, 2.75, 3.1));
    o += MO.sar(`<g transform="translate(-470 0)"><text x="100" y="0" font-size="72" font-weight="900" style="fill:#C8D0DC">YOLDA KULLANIM</text>` + (sl > 0 ? `<rect x="96" y="-26" width="${(560 * sl).toFixed(0)}" height="9" rx="4" fill="#E8323C"/>` : '') + `</g>`, MO.oge(t, { gir: 2.5, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1215, { golge: false });
    o += MO.sar(isaretX(0, 0, 1.5), MO.oge(t, { gir: 2.6, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 140 }), 110, 1193, { golge: false });
    o += kredi('GÖRÜNTÜ: TESLA (@teslamotors)', 60, 1490);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1700, boy: 100, duygu: t > 2.6 ? 'uzgun' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 160, y: 1800, boy: 140, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 07 — GUFİ: ayırtır mısın / önce fiyata baktı (38,5–41,8)
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1F3C', alt: '#120C1E', isik: [540, 1100, '#E8323C', .18], ikinci: [900, 300, '#FBAC39', .08] }),
  kamera: [[0, 1.0, 540, 900], [1.8, 1.12, 540, 820, .9]],
  ciz: t => {
    let o = '';
    const bas = (t > .62 && t < .82) ? .93 : 1;
    const kart = R(-350, -150, 700, 300, 36, '#FFF8EE') + txt('ROADSTER · REZERVASYON', 0, -76, 40, '#1B2440') + `<g transform="translate(0 40) scale(${bas})">` + R(-200, -55, 400, 110, 55, '#2FBF71') + txt('AYIRT', 0, 18, 56, '#FFFFFF') + '</g>';
    o += MO.sar(kart, MO.oge(t, { gir: .05, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 600);
    const sw = 9 * Math.sin((t - 1.94) * 6) * Math.exp(-(t - 1.94) * 1.3);
    const tag = `<path d="M0 -700 V-90" stroke="#C8D0DC" stroke-width="6"/><g transform="rotate(${sw} 0 -90)"><path d="M-140 -90 h280 v200 q0 20 -20 20 h-240 q-20 0 -20 -20Z" fill="#E8323C"/><circle cx="0" cy="-60" r="12" fill="#14171F"/>` + txt('FİYAT', 0, 20, 54, '#FFFFFF') + txt('?', 0, 96, 70, '#FFD23F') + '</g>';
    o += MO.sar(tag, MO.oge(t, { gir: 1.94, agirlik: 'agir', giris: 'dus', materyal: 'kagit', x: 540 }), 540, 640);
    o += gufi(t, { x: 540, y: 1240, boy: 340, duygu: t > 1.94 ? 'saskin' : 'merak', bakHedef: [540, 640] });
    return o;
  },
  onCiz: t => gubi(t, { x: 900, y: 1640, boy: 110, duygu: 'merak', bakHedef: [540, 800] })
});"""
# 08 — FİYAT YOK / 2028 (41,8–44,7)
S[8] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#162040', alt: '#080B1C', isik: [540, 1000, '#3E6FB8', .22], ikinci: [900, 300, '#E8323C', .10] }),
  kamera: [[0, 1.0, 540, 900], [.2, 1.06, 540, 960, 3.0, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(etiket('FİYAT: ?', 0, 0, '#E8323C', '#FFFFFF', 150, -6, 1), MO.oge(t, { gir: .24, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 580, { golge: false });
    const tk = R(-270, -250, 540, 500, 40, '#FFF8EE') + R(-270, -250, 540, 120, 40, '#E8323C') + R(-270, -190, 540, 60, 0, '#E8323C') + txt('ÜRETİM', 0, -158, 64, '#FFFFFF') + txt('2028', 0, 100, 190, '#1B2440');
    o += MO.sar(tk, MO.oge(t, { gir: 1.2, agirlik: 'agir', giris: 'dus', materyal: 'kagit', x: 540 }), 540, 990);
    o += MO.sar(zamanChip('REZERVASYON: 50.000 $', 0, 0, '#0B1433', '#FFD23F', 30), MO.oge(t, { gir: 2.0, agirlik: 'hafif', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1290, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1600, boy: 120, duygu: t > 1.7 ? 'saskin' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 09 — PAYLAŞ (44,7–47,2)
S[9] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#15403A', alt: '#0A1E1C', isik: [540, 1000, '#2FBF71', .22], ikinci: [900, 1500, '#FBAC39', .08] }),
  kamera: [[0, 1.08, 540, 900], [.05, 1.0, 540, 900, 1.8, 'kamera']],
  ciz: t => {
    let o = '';
    let tel = R(-170, -320, 340, 640, 46, '#1B2440') + R(-150, -290, 300, 560, 28, '#2A3456') + MO.fotograf('foto1', { x: 0, y: -50, w: 270, h: 340, r: 16 }) + `<g transform="translate(0 200) scale(.8)">` + etiket('0.59 SN', 0, 0, '#E8323C', '#FFFFFF', 54, -4, 1) + '</g>';
    o += MO.sar(tel, MO.oge(t, { gir: .05, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 290, bekle: 2 }), 290, 960, { golge: false });
    o += MO.sar(arkadas(0, 0, 1.5), MO.oge(t, { gir: .6, agirlik: 'orta', giris: 'yan', yon: 1, materyal: 'kumas', x: 740 }), 740, 940, { golge: false });
    o += MO.sar(AU.cip('ARABASIYLA ÖVÜNEN ARKADAŞ', 0, 0, '#FFD23F', '#1B2440', 20), MO.oge(t, { gir: 1.3, agirlik: 'hafif', giris: 'yuksel', x: 740 }), 740, 1175, { golge: false });
    o += MO.sar(M.balon(0, 0, txt('Benim arabam', 0, -10, 40, '#1B2440') + txt('da hızlı!', 0, 38, 40, '#1B2440'), { w: 430, h: 180, yon: -1 }), MO.oge(t, { gir: 1.0, agirlik: 'oyuncu', giris: 'olcek', materyal: 'plastik', x: 700 }), 690, 610, { golge: false });
    const u = MO.E.inOutCubic(MO.ar(t, 1.85, 2.4));
    if (u > 0) o += `<g transform="translate(${430 + 260 * u} ${760 - 120 * u - 90 * Math.sin(Math.PI * u)}) rotate(${-25 + 20 * u})" opacity="${(1 - MO.ar(t, 2.3, 2.5)).toFixed(3)}"><path d="M-50 0 L50 -30 L10 40 L0 10Z" fill="#FFFFFF"/><path d="M0 10 L50 -30" stroke="#C8D0DC" stroke-width="4"/></g>`;
    MO.olay('ucus', 1.85, { x: 540, agirlik: 'hafif' });
    return o;
  },
  onCiz: t => gubi(t, { x: 900, y: 1640, boy: 110, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 180, y: 1790, boy: 160, duygu: 'mutlu', bakHedef: [540, 900] })
});"""
# 10 — TAKİP (47,2–50,0)
S[10] = r"""
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
