S = {}
# 01 — KANCA (0–10,9): "Senin araban 96'ya kaç saniyede?" Sol: senin araban (yavaş gösterge, 10 sn). 5,68'de sağda GERÇEK Tesla fotoğrafı + gösterge;
#   7,38'de fırlar, 0,59 sn damgası + sarsıntı. İki gösterge yan yana → "oha" kıyası.
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#161B38', alt: '#080B1C', isik: [540, 900, '#3E6FB8', .26], ikinci: [900, 250, '#E8323C', .10] }),
  kamera: [[0, 1.0, 540, 900], [.1, 1.05, 540, 900, 5.4, 'kamera'], [5.7, 1.0, 540, 900, .6]],
  sarsinti: [[7.98, 14]],
  ciz: t => {
    const b = Math.max(0, t - .4), vS = Math.min(96, 96 * b / 10), rk = MO.cl((t - 7.38) / .59), vR = 96 * rk;
    let o = '';
    // A) 0–5,6: tek büyük gösterge — senin araban
    const A = 1 - MO.E.outCubic(MO.ar(t, 5.3, 5.75));
    if (A > .01) {
      o += `<g opacity="${A.toFixed(3)}">`;
      o += MO.sar(AU.cip('SENİN ARABAN', 0, 0, '#FFFFFF', '#1B2440', 28), MO.oge(t, { gir: -.25, agirlik: 'hafif', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 385, { golge: false });
      o += MO.sar(SE.araba(0, 0, .75, { renk: '#E8323C' }), MO.oge(t, { gir: -.3, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 520);
      o += MO.sar(gosterge(0, 0, 280, vS, { renk: '#7FD0FF' }), MO.oge(t, { gir: -.2, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 860);
      o += MO.sar(zamanChip(`${Math.min(10, b).toFixed(1)} sn`, 0, 0, '#0B1433', '#7FD0FF', 40), MO.oge(t, { gir: -.1, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 1115, { golge: false });
      o += `</g>`;
    }
    // B) 5,68'den sonra: gerçek Tesla fotoğrafı tüm kadraj; altta iki çubuk yarışı
    if (t > 5.4) {
      const tit = t > 7.38 && t < 7.98 ? Math.sin(t * 95) * 7 : 0;
      o += MO.sar(MO.fotograf('foto1', { x: 0, y: 0, w: 1150, h: 1445, r: 0, kayma: [tit, 0], olcek: 1 + .06 * MO.E.outCubic(MO.ar(t, 5.7, 10.9)) }), MO.oge(t, { gir: 5.6, agirlik: 'kahraman', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 700, { golge: false });
      o += `<g opacity="${MO.E.outCubic(MO.ar(t, 5.6, 6.1)).toFixed(3)}">` + filmKat() + `</g>`;
      const sat = (ad, y, v, f, renk, vs, ts) => `<text class="mono" x="70" y="${y}" font-size="30" letter-spacing="4" style="fill:${renk}">${ad}</text><text class="mono" x="1010" y="${y}" font-size="30" text-anchor="end" letter-spacing="2" style="fill:#FFF3D6">${v} km/sa · ${ts} sn</text>` + R(70, y + 18, 940, 24, 12, '#2A3550', .85) + (f > .003 ? R(70, y + 18, 940 * f, 24, 12, renk) : '');
      o += MO.sar(sat('SENİN ARABAN', 1030, Math.round(vS), vS / 96, '#7FD0FF', 0, Math.min(10, b).toFixed(1)), MO.oge(t, { gir: 5.75, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 0, 0, { golge: false });
      o += MO.sar(sat('TESLA ROADSTER', 1135, Math.round(vR), rk, '#FFD23F', 0, (.59 * rk).toFixed(2)), MO.oge(t, { gir: 5.95, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 0, 0, { golge: false });
      o += MO.sar(zamanChip('ROCKET SÜRÜMÜ · TESLA İDDİASI', 0, 0, '#E8323C', '#FFFFFF', 21), MO.oge(t, { gir: 6.3, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 965, { golge: false });
      o += MO.sar(etiket('0.59 SN', 0, 0, '#E8323C', '#FFFFFF', 112, -5, 1), MO.oge(t, { gir: 7.98, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 440, { golge: false });
    }
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: t > 7.4 ? 'saskin' : 'merak', bakHedef: [540, 900] })
});"""
# 02 — 17 KERE (10,9–17,9): 10 sn çubuğu dolarken Roadster (gerçek fotoğraf kırpığı) 17 kez art arda çıkar; "17 KERE" damgası. Sonra Nevera çubuk grafiği, "3 KAT".
S[2] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1A1F40', alt: '#090C1E', isik: [540, 900, '#E8323C', .14], ikinci: [200, 400, '#3E6FB8', .16] }),
  kamera: [[0, 1.0, 540, 900]],
  ciz: t => {
    let o = '';
    o += MO.sar(zamanChip('SENİN ARABANIN 10 SANİYESİ', 0, 0, '#FFFFFF', '#1B2440', 26), MO.oge(t, { gir: .05, cik: 4.6, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 420, { golge: false });
    const dol = MO.E.inOutSine(MO.cl((t - .2) / 2.0)), sy = 10 * dol;
    o += MO.sar(txt(sy.toFixed(1), 0, 0, 230, '#7FD0FF') + `<text class="mono" x="0" y="70" font-size="40" text-anchor="middle" letter-spacing="6" style="fill:#C8D0DC">SANİYE</text>`, MO.oge(t, { gir: .15, cik: 2.3, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 820, { golge: false });
    o += MO.sar(R(-350, -17, 700, 34, 17, '#2A3550') + R(-350, -17, 700 * dol, 34, 17, '#7FD0FF'), MO.oge(t, { gir: .1, cik: 4.6, agirlik: 'hafif', giris: 'yan', x: 540 }), 540, 500, { golge: false });
    for (let i = 0; i < 17; i++) { const c = i % 4, r = Math.floor(i / 4);
      o += MO.sar(MO.fotograf('foto1_arac', { x: 0, y: 0, w: 190, h: 113, r: 14 }), MO.oge(t, { gir: 2.3 + i * .1, cik: 4.6 + i * .01, cikYon: 'asagi', agirlik: 'hafif', giris: 'olcek', materyal: 'plastik', x: 540 + (c - 1.5) * 215 }), 540 + (c - 1.5) * 215, 640 + r * 135, { golge: false }); }
    o += MO.sar(etiket('17 KERE', 0, 0, '#E8323C', '#FFFFFF', 140, -5, 1), MO.oge(t, { gir: 3.98, cik: 4.7, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 900, { golge: false });
    // Nevera kıyası
    o += MO.sar(zamanChip('0 → 96 km/sa', 0, 0, '#FFFFFF', '#1B2440', 26), MO.oge(t, { gir: 4.8, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 470, { golge: false });
    const n1 = MO.E.outCubic(MO.ar(t, 4.95, 5.5)), n2 = MO.E.outCubic(MO.ar(t, 5.3, 5.55));
    o += MO.sar(txt('RIMAC NEVERA', -340, -16, 30, '#FFF3D6', 900, 'text-anchor="start"') + R(-340, 0, 680 * n1, 56, 14, '#8A94A8') + txt('1,74 sn', -340 + 680 * n1 - 100, 42, 36, '#14171F'), MO.oge(t, { gir: 4.9, agirlik: 'orta', giris: 'yan', x: 540 }), 540, 680, { golge: false });
    o += MO.sar(txt('TESLA ROADSTER', -340, -16, 30, '#FFF3D6', 900, 'text-anchor="start"') + R(-340, 0, 230 * n2 + 2, 56, 14, '#E8323C') + txt('0,59 sn', -340 + 230 * n2 + 70, 42, 36, '#FFFFFF'), MO.oge(t, { gir: 5.2, agirlik: 'orta', giris: 'yan', x: 540 }), 540, 830, { golge: false });
    o += MO.sar(etiket('3 KAT HIZLI', 0, 0, '#FFD23F', '#1B2440', 96, -5, 1), MO.oge(t, { gir: 5.96, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1030, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 03 — TAŞ vs ARABA (17,9–25,4): uçurumdan düşen taş 2,73 sn'de 96'ya çıkar; 23,3'te yeniden: taş 0,59 sn'de ancak ~21'e, Roadster 96. "4,6×".
S[3] = r"""
const kayalik = `<path d="M-60 560 L270 560 L270 1250 L-60 1250Z" fill="#4A4F5E"/><path d="M-60 560 L270 560 L270 590 L-60 590Z" fill="#6A7080"/>` + [640, 720, 800, 880, 960, 1040, 1120].map((y, i) => `<path d="M${-60 + (i % 2) * 40} ${y} L${270 - (i % 3) * 30} ${y + 10}" stroke="#3A3E4B" stroke-width="6"/>`).join('');
MO.sahne({
  zemin: MO.zemin({ ust: '#1C2447', alt: '#0A0E22', isik: [400, 1000, '#FBAC39', .12] }),
  kamera: [[0, 1.0, 540, 900]],
  ciz: t => {
    let o = '';
    const tau = t < 5.2 ? Math.max(0, Math.min(2.73, t - 1.0)) : Math.max(0, t - 5.3), fe = Math.min(1, tau / 2.73);
    const ty = 560 + 620 * fe * fe, vT = 96 * fe, tk = (t > 3.73 && t < 5.2) ? 1 : (t >= 5.2 ? MO.ar(t, 5.2, 5.4) : 1);
    o += MO.sar(kayalik, MO.oge(t, { gir: .05, agirlik: 'agir', giris: 'yan', yon: -1, materyal: 'ahsap', x: 130 }), 0, 0, { golge: false });
    o += `<g opacity="${tk.toFixed(3)}">` + tas(325, ty, 1.1) + '</g>';
    o += MO.sar(AU.cip('TAŞ · SERBEST DÜŞÜŞ', 0, 0, '#FFFFFF', '#1B2440', 22), MO.oge(t, { gir: .3, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 600, { golge: false });
    o += MO.sar(gosterge(0, 0, 120, vT, { renk: '#9AA4B8' }), MO.oge(t, { gir: .4, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 700 }), 700, 780);
    const tz = t < 5.2 ? (t > 3.73 ? 2.73 : tau) : (t - 5.3 > 0 ? t - 5.3 : 0);
    o += MO.sar(zamanChip(`${tz.toFixed(2)} sn`, 0, 0, '#0B1433', '#C8D0DC', 30), MO.oge(t, { gir: .6, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 905, { golge: false });
    o += MO.sar(AU.cip('ROADSTER', 0, 0, '#FFD23F', '#1B2440', 22), MO.oge(t, { gir: 4.9, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 975, { golge: false });
    const rk = MO.cl((t - 5.3) / .59);
    o += MO.sar(gosterge(0, 0, 120, 96 * rk, { renk: '#FBAC39' }), MO.oge(t, { gir: 5.0, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 700 }), 700, 1130);
    o += MO.sar(zamanChip(`${(.59 * rk).toFixed(2)} sn`, 0, 0, '#0B1433', '#FBAC39', 30), MO.oge(t, { gir: 5.1, agirlik: 'hafif', giris: 'yuksel', x: 700 }), 700, 1265, { golge: false });
    o += MO.sar(etiket('4,6×', 0, 0, '#E8323C', '#FFFFFF', 130, -6, 1), MO.oge(t, { gir: 6.15, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 320 }), 330, 900, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 04 — G-FORCE (25,4–33,2): mekik 3 g, Roadster ~4,6 g; Gubi sıkışıp titrer.
S[4] = r"""
const sh = `<ellipse cx="0" cy="-30" rx="26" ry="82" fill="#F2F4F8"/><path d="M-26 20 L-62 74 L-26 56Z M26 20 L62 74 L26 56Z" fill="#C8D0DC"/><path d="M0 -112 L16 -80 L-16 -80Z" fill="#E8323C"/><path d="M-14 82 Q0 150 14 82Z" fill="#FBAC39"/>`;
MO.sahne({
  zemin: MO.zemin({ ust: '#1D1738', alt: '#0B0817', isik: [540, 1000, '#E8323C', .16], ikinci: [200, 500, '#3E6FB8', .12] }),
  kamera: [[0, 1.0, 540, 900], [2.9, 1.05, 560, 930, 1.2, 'kamera']],
  ciz: t => {
    let o = '';
    const taban = 1180, gp = 110, e1 = MO.E.outCubic(MO.ar(t, 1.9, 2.7)), e2 = MO.E.outCubic(MO.ar(t, 3.0, 4.4));
    // ölçek çizgileri
    for (let g = 1; g <= 5; g++) o += `<path d="M110 ${taban - g * gp} H900" stroke="#FFFFFF" stroke-opacity="${g === 3 ? .35 : .12}" stroke-width="${g === 3 ? 4 : 2}" ${g === 3 ? 'stroke-dasharray="14 12"' : ''}/>` + `<text class="mono" x="100" y="${taban - g * gp + 8}" font-size="24" text-anchor="end" style="fill:#7FA0D0">${g} g</text>`;
    o += MO.sar(sh, MO.oge(t, { gir: 1.6, agirlik: 'orta', giris: 'yuksel', materyal: 'metal', x: 200 }), 200, 560);
    o += MO.sar(R(-65, 0, 130, 330 * e1, 16, '#5A8EE0') + (e1 > .95 ? txt('3 g', 0, 56, 48, '#FFFFFF') : ''), MO.oge(t, { gir: 1.9, agirlik: 'agir', giris: 'sabit', x: 200, ses: false }), 200, taban - 330 * e1, { golge: false });
    o += MO.sar(AU.cip('UZAY MEKİĞİ', 0, 0, '#FFFFFF', '#1B2440', 22), MO.oge(t, { gir: 1.7, agirlik: 'hafif', giris: 'yuksel', x: 200 }), 200, 690, { golge: false });
    o += MO.sar(MO.fotograf('foto1_arac', { x: 0, y: 0, w: 200, h: 119, r: 14 }), MO.oge(t, { gir: 2.9, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 800 }), 790, 560, { golge: false });
    o += MO.sar(R(-65, 0, 130, 506 * e2, 16, '#E8323C') + (e2 > .95 ? txt('4,6 g', 0, 56, 44, '#FFFFFF') : ''), MO.oge(t, { gir: 3.0, agirlik: 'agir', giris: 'sabit', x: 790, ses: false }), 790, taban - 506 * e2, { golge: false });
    o += MO.sar(AU.cip('ROADSTER (ORT.)', 0, 0, '#FFD23F', '#1B2440', 22), MO.oge(t, { gir: 2.95, agirlik: 'hafif', giris: 'yuksel', x: 790 }), 790, 650, { golge: false });
    // Gubi sıkışır, titrer
    const am = 12 * MO.E.outCubic(MO.ar(t, 4.96, 7.4)), sq = MO.E.outCubic(MO.ar(t, 4.5, 6.0));
    const gx = 500 + Math.sin(t * 75) * am, gy = 1090;
    o += `<g transform="translate(${gx} ${gy}) scale(${1 + .07 * sq} ${1 - .13 * sq}) translate(${-gx} ${-gy})">` + gubi(t, { x: gx, y: gy, boy: 300, duygu: t > 4.9 ? 'korku' : 'merak', bakHedef: 'kamera' }) + '</g>';
    return o;
  },
  onCiz: t => gufi(t, { x: 200, y: 1780, boy: 170, duygu: t > 3.8 ? 'saskin' : 'merak', bakHedef: [540, 900] })
});"""
# 05 — İTİCİLER (33,2–38,4): GERÇEK görüntü (Tesla reel): karanlıkta iki mavi itici alevi (yavaş çekim) → römorkun üzerinden itici jetiyle atlayış.
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0E1E', alt: '#05070F', isik: [540, 900, '#3E6FB8', .10] }),
  kamera: [[0, 1.0, 540, 900], [.1, 1.05, 540, 900, 5.0, 'kamera']],
  ciz: t => {
    let o = '';
    const a = 1 - MO.cl((t - 3.0) / .25);
    if (a > 0) o += MO.klip('a', t * .55, { x: 540, y: 760, w: 1200, h: 1500, r: 0, op: a });
    if (a < 1) o += MO.klip('c', Math.max(0, t - 3.1), { x: 540, y: 760, w: 1200, h: 1500, r: 0, op: 1 - a });
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
# 06 — FAN / TAVANDA TERS (38,4–41,4): GERÇEK görüntü: ters dönmüş araç (yavaş çekim) + "TESLA İDDİASI" çipi.
S[6] = r"""
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
# 07 — ROCKET: davetli, yolda yasak (41,4–45,1): GERÇEK görüntü (dönen araç, mavi jetler) + üstte kart; 43,4 DAVETLİ ✓, 44,32 YOLDA YASAK ✕.
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0E1E', alt: '#05070F', isik: [540, 900, '#3E6FB8', .10] }),
  kamera: [[0, 1.0, 540, 900], [.1, 1.06, 540, 940, 3.5, 'kamera']],
  ciz: t => {
    let o = MO.klip('d', t * .5, { x: 540, y: 760, w: 1200, h: 1500, r: 0 }) + filmKat();
    o += MO.sar(`<g transform="translate(-470 0)"><rect x="0" y="-26" width="8" height="34" rx="4" fill="#7FD0FF"/><text class="mono" x="32" y="0" font-size="30" letter-spacing="6" style="fill:#7FD0FF">ROCKET SÜRÜMÜ</text></g>`, MO.oge(t, { gir: .35, agirlik: 'hafif', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1020, { golge: false });
    o += MO.sar(`<g transform="translate(-470 0)"><text x="100" y="0" font-size="72" font-weight="900" style="fill:#FFF6E6">SADECE DAVETLİ</text></g>`, MO.oge(t, { gir: 1.95, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1110, { golge: false });
    o += MO.sar(isaretV(0, 0, 1.5), MO.oge(t, { gir: 2.0, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 140 }), 110, 1088, { golge: false });
    const sl = MO.E.outCubic(MO.ar(t, 3.0, 3.35));
    o += MO.sar(`<g transform="translate(-470 0)"><text x="100" y="0" font-size="72" font-weight="900" style="fill:#C8D0DC">YOLDA KULLANIM</text>` + (sl > 0 ? `<rect x="96" y="-26" width="${(560 * sl).toFixed(0)}" height="9" rx="4" fill="#E8323C"/>` : '') + `</g>`, MO.oge(t, { gir: 2.85, agirlik: 'orta', giris: 'yuksel', x: 540 }), 540, 1215, { golge: false });
    o += MO.sar(isaretX(0, 0, 1.5), MO.oge(t, { gir: 2.92, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 140 }), 110, 1193, { golge: false });
    o += kredi('GÖRÜNTÜ: TESLA (@teslamotors)', 60, 1490);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1700, boy: 100, duygu: t > 2.9 ? 'uzgun' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 160, y: 1800, boy: 140, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 08 — GUFİ: "ayırtır mısın? önce fiyata baktı" (45,1–48,3): rezervasyon kartı + AYIRT düğmesi; 1,94'te FİYAT etiketi iner, kamera yaklaşır.
S[8] = r"""
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
# 09 — FİYAT YOK / 2028 (48,3–51,4)
S[9] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#162040', alt: '#080B1C', isik: [540, 1000, '#3E6FB8', .22], ikinci: [900, 300, '#E8323C', .10] }),
  kamera: [[0, 1.0, 540, 900], [.2, 1.06, 540, 960, 3.0, 'kamera']],
  ciz: t => {
    let o = '';
    o += MO.sar(etiket('FİYAT: ?', 0, 0, '#E8323C', '#FFFFFF', 150, -6, 1), MO.oge(t, { gir: .24, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 580, { golge: false });
    const tk = R(-270, -250, 540, 500, 40, '#FFF8EE') + R(-270, -250, 540, 120, 40, '#E8323C') + R(-270, -190, 540, 60, 0, '#E8323C') + txt('ÜRETİM', 0, -158, 64, '#FFFFFF') + txt('2028', 0, 100, 190, '#1B2440');
    o += MO.sar(tk, MO.oge(t, { gir: 1.32, agirlik: 'agir', giris: 'dus', materyal: 'kagit', x: 540 }), 540, 990);
    o += MO.sar(zamanChip('REZERVASYON: 50.000 $', 0, 0, '#0B1433', '#FFD23F', 30), MO.oge(t, { gir: 2.3, agirlik: 'hafif', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 1290, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1600, boy: 120, duygu: t > 1.7 ? 'saskin' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 10 — PAYLAŞ (51,4–54,15): telefonda gerçek fotoğraf + 0.59 SN; arabasıyla övünen arkadaş; kâğıt uçak
S[10] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#15403A', alt: '#0A1E1C', isik: [540, 1000, '#2FBF71', .22], ikinci: [900, 1500, '#FBAC39', .08] }),
  kamera: [[0, 1.08, 540, 900], [.05, 1.0, 540, 900, 1.8, 'kamera']],
  ciz: t => {
    let o = '';
    let tel = R(-170, -320, 340, 640, 46, '#1B2440') + R(-150, -290, 300, 560, 28, '#2A3456') + MO.fotograf('foto1', { x: 0, y: -50, w: 270, h: 340, r: 16 }) + `<g transform="translate(0 200) scale(.8)">` + etiket('0.59 SN', 0, 0, '#E8323C', '#FFFFFF', 54, -4, 1) + '</g>';
    o += MO.sar(tel, MO.oge(t, { gir: .05, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 290, bekle: 2 }), 290, 960, { golge: false });
    o += MO.sar(arkadas(0, 0, 1.5), MO.oge(t, { gir: .7, agirlik: 'orta', giris: 'yan', yon: 1, materyal: 'kumas', x: 740 }), 740, 940, { golge: false });
    o += MO.sar(AU.cip('ARABASIYLA ÖVÜNEN ARKADAŞ', 0, 0, '#FFD23F', '#1B2440', 20), MO.oge(t, { gir: 1.45, agirlik: 'hafif', giris: 'yuksel', x: 740 }), 740, 1175, { golge: false });
    o += MO.sar(M.balon(0, 0, txt('Benim arabam', 0, -10, 40, '#1B2440') + txt('da hızlı!', 0, 38, 40, '#1B2440'), { w: 430, h: 180, yon: -1 }), MO.oge(t, { gir: 1.14, agirlik: 'oyuncu', giris: 'olcek', materyal: 'plastik', x: 700 }), 690, 610, { golge: false });
    const u = MO.E.inOutCubic(MO.ar(t, 2.0, 2.65));
    if (u > 0) o += `<g transform="translate(${430 + 260 * u} ${760 - 120 * u - 90 * Math.sin(Math.PI * u)}) rotate(${-25 + 20 * u})" opacity="${(1 - MO.ar(t, 2.55, 2.75)).toFixed(3)}"><path d="M-50 0 L50 -30 L10 40 L0 10Z" fill="#FFFFFF"/><path d="M0 10 L50 -30" stroke="#C8D0DC" stroke-width="4"/></g>`;
    MO.olay('ucus', 2.0, { x: 540, agirlik: 'hafif' });
    return o;
  },
  onCiz: t => gubi(t, { x: 900, y: 1640, boy: 110, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 180, y: 1790, boy: 160, duygu: 'mutlu', bakHedef: [540, 900] })
});"""
# 11 — TAKİP (54,15–57,3)
S[11] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#101A30', alt: '#0A0F1C', isik: [540, 760, '#FFD23F', .22], supurme: .04 }),
  kamera: [[0, 1.08, 540, 800], [.1, 1.0, 540, 900, 2.6, 'kamera']],
  ciz: t => {
    const kart = R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FFD23F" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF');
    let o = MO.sar(kart, MO.oge(t, { gir: .04, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 760);
    const bs = t > 1.0 && t < 1.15 ? .92 : 1;
    o += MO.sar(`<g transform="scale(${bs})">` + R(-220, -40, 440, 80, 40, '#FFD23F') + AU.yaz('+ TAKİP ET', 0, 18, 46, '#1B2440') + '</g>', MO.oge(t, { gir: .55, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 300, y: 1540, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1720, boy: 220, duygu: 'mutlu', bakHedef: 'kamera' })
});"""
