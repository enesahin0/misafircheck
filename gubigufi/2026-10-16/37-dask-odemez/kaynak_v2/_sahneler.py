S = {}
# 01 — KANCA (0–4,1): kamera DASK kalkanına yakın başlar, su yükselirken GERİ ÇEKİLİR (bağlam ifşası: ev su altında).
#   3,1 "Ödemiyor": damga iner + kamera sarsıntısı + kalkan griye döner ve çöker. Çıkış: su lensi kaplar (perde/dalga).
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#16244A', alt: '#0A1226', isik: [540, 1250, '#5A86C8', .28], ikinci: [880, 300, '#8FA8D8', .10], supurme: 0 }),
  kamera: [[0, 1.5, 540, 930], [.15, 1.0, 540, 960, 2.7, 'kamera']],
  sarsinti: [[3.1, 16]],
  ciz: t => {
    let o = SL.bulut(250 + t * 6, 430, 1.2, '#2E3E64') + SL.bulut(830 - t * 4, 400, 1.4, '#2A3A60') + SL.yagmur(t, { n: 80, op: .38, y0: 300, y1: 1300 });
    o += ev(540, 1100, 1.55);
    const cok = MO.E.inCubic(A(t, 3.12, 3.5)), gri = A(t, 3.1, 3.3);
    o += `<g style="filter:grayscale(${gri.toFixed(2)}) brightness(${(1 - .25 * gri).toFixed(2)})" transform="translate(0 ${(26 * cok).toFixed(1)}) rotate(${(4 * cok).toFixed(2)} 540 960)">` + daskKalkan(540, 960 + 6 * Math.sin(t * 2.2), 1.35) + '</g>';
    o += suY(1185 - 300 * MO.E.inOutSine(A(t, 0, 3.0)) - 10 * Math.sin(t * 1.3), t, .85);
    const dm = MO.oge(t, { gir: 3.1, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540, etiket: 'ODEMIYOR' });
    o += MO.sar(etiket('ÖDEMİYOR', 0, 0, '#E8323C', '#FFFFFF', 92, -8, 1), dm, 540, 700, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 960] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'saskin', bakHedef: [540, 960] })
});"""
# 02 — GÜNDEM + DASK (4,1–15,95): su çekilir → İstanbul silüeti, 1.277 sayacı (kinetik). 3,2: sayaç bloğu yukarı çıkar,
#   DASK kartı aşağıdan yükselir (örtüşen koreografi), satırlar sırayla; SEL ✕ damgalanır. 6,1: DASK kartı sola çekilir,
#   konut poliçesi sağdan girer; 8,6 kamera SEL satırına yaklaşır; 10,5 geri çekilir ve "TEMİNAT VARSA ÖDER" iner.
S[2] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#18264C', alt: '#0A1228', isik: [540, 1150, '#3E6FB8', .30], ikinci: [150, 500, '#FBAC39', .08] }),
  kamera: [[0, 1.06, 540, 900], [3.05, 1.0, 540, 900, .9], [8.55, 1.32, 540, 1000, .85], [10.45, 1.0, 540, 930, .9]],
  ciz: t => {
    let o = '';
    // A bloğu: şehir + sayaç (0–3,2)
    const sh = MO.oge(t, { gir: 0, cik: 3.05, agirlik: 'agir', giris: 'sabit', ses: false });
    if (sh.gor) o += `<g opacity="${sh.op.toFixed(3)}" transform="translate(0 ${(-sh.cikiyor * 80).toFixed(1)})">` + SE.siluet(t, 1000) + suY(960 - 40 * MO.E.outCubic(A(t, 0, 3.2)), t, .8) + '</g>';
    if (t < 3.4) { const cq = MO.E.inQuad(A(t, 3.0, 3.3)); o += `<g opacity="${(1 - cq).toFixed(3)}" transform="translate(0 ${(-cq * 120).toFixed(1)})">` + MO.sayiVurgu(t, .2, 2.3, 1277, 540, 600, { boyut: 150 }) + '</g>'; }
    const et = MO.oge(t, { gir: .55, cik: 3.0, agirlik: 'hafif', giris: 'yuksel', materyal: 'plastik', x: 540 });
    o += MO.sar(`<text class="mono" x="0" y="10" font-size="28" text-anchor="middle" letter-spacing="4" style="fill:#7FD0FF">SU BASKINI İHBARI</text>`, et, 540, 690, { golge: false });
    // B: DASK kartı (3,25–6,1)
    const kart = MO.oge(t, { gir: 3.25, cik: 5.9, cikYon: 'sol', agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 });
    if (kart.gor) {
      let k = R(-340, -330, 680, 640, 40, '#FFF8EE') + daskKalkan(0, -165, 1.0);
      const r1 = MO.oge(t, { gir: 3.6, agirlik: 'hafif', giris: 'yan', yon: -1, x: 540, ses: false }), r2 = MO.oge(t, { gir: 4.1, agirlik: 'hafif', giris: 'yan', yon: -1, x: 540, ses: false });
      k += MO.sar(deprem(-150, 0, 1.0) + `<text x="-40" y="14" font-size="42" font-weight="900" style="fill:#1B2440">DEPREM</text>` + isaretV(230, 0, 1.1), r1, 0, 85, { golge: false });
      k += MO.sar(`<path d="M-190 0 q20 -24 40 0 t40 0 t40 0" stroke="${SE.SU}" stroke-width="10" fill="none" stroke-linecap="round"/><text x="-40" y="14" font-size="42" font-weight="900" style="fill:#1B2440">SEL</text>`, r2, 0, 200, { golge: false });
      const x2 = MO.oge(t, { gir: 4.25, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 770 });
      k += MO.sar(isaretX(0, 0, 1.25), x2, 230, 200, { golge: false });
      o += MO.sar(k, kart, 540, 860);
    }
    // C: konut poliçesi (6,15–)
    o += MO.sar(AU.cip('DASK = SADECE DEPREM', 0, 0, '#2E78C8', '#FFFFFF', 30), MO.oge(t, { gir: 6.3, agirlik: 'hafif', giris: 'yuksel', x: 540, ses: false }), 540, 430, { golge: false });
    const pol = MO.oge(t, { gir: 6.2, agirlik: 'agir', giris: 'yan', yon: 1, materyal: 'kagit', x: 700, bekle: 1.5 });
    if (pol.gor) { const vk = MO.E.yumusak(A(t, 8.7, 9.3)), d = t > 10.6 ? 1 : 2; o += MO.sar(police(0, 0, 760, 'KONUT SİGORTASI', [['Yangın', 1], ['Hırsızlık', 1], ['Cam kırılması', 1], ['SEL VE SU BASKINI', d]], '#2FA060', 3, vk), pol, 540, 860, { golge: false }); }
    const tv = MO.oge(t, { gir: 10.6, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 });
    o += MO.sar(etiket('TEMİNAT VARSA ÖDER', 0, 0, '#FFD23F', '#1B2440', 46, -3, 1), tv, 540, 1185, { golge: false });
    return o;
  },
  onCiz: t => MO.sar(AU.cip('İSTANBUL · 14 EKİM', 0, 0, '#FFFFFF', '#1B2440', 28), MO.oge(t, { gir: .1, cik: 2.95, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 420, { golge: false }) +
    gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 800] })
});"""
# 03 — ARABA (15,95–22,95): kamera Gubi'ye YAKIN çekimde başlar (soru ona), "Hayır"da geniş plana açılır; trafik kartı düşer
#   (✕ kırmızı arabaya damgalanır), kasko kartı yandan girer, sel teminatı satırı vurgulanır, ✓ + kalkan.
S[3] = r"""
const yol = t => { let o = R(-400, 1060, 1900, 1400, 0, '#2A3450') + `<g transform="translate(-300 -440) scale(1.6 1.4)">` + suY(1100, t, .7) + '</g>';
  o += SE.araba(330, 1110 + 3 * Math.sin(t * 2), 1.25, { renk: '#E8323C', rot: -2 }) + SE.araba(780, 1110 + 3 * Math.sin(t * 2 + 1), 1.1, { renk: '#3E8EDE' });
  const c = MO.E.outCubic(A(t, 3.45, 3.8)); return o + `<g opacity="${c.toFixed(3)}">` + AU.cip('SENİN ARABAN', 330, 1220, '#FFFFFF', '#1B2440', 24) + AU.cip('KARŞI TARAF', 780, 1220, '#FFFFFF', '#1B2440', 24) + '</g>'; };
MO.sahne({
  zemin: MO.zemin({ ust: '#1C2A4C', alt: '#0B1428', isik: [860, 1500, '#FBAC39', .16] }),
  kamera: [[0, 2.1, 790, 1560], [3.25, 1.0, 540, 960, .75]],
  ciz: t => {
    let o = yol(t);
    o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: t < 3.2 ? 'kamera' : [540, 700] });
    o += gufi(t, { x: 200, y: 1780, boy: 170, duygu: t > 6.0 ? 'mutlu' : 'merak', bakHedef: [540, 800] });
    o += MO.sar(`<g transform="scale(.62)">` + M.balon(0, 0, txt('ÖDER Mİ?', 0, 18, 48, '#1B2440'), { w: 300, h: 110, yon: -1 }) + '</g>', MO.oge(t, { gir: .9, cik: 3.0, agirlik: 'oyuncu', giris: 'olcek', materyal: 'plastik', x: 760 }), 735, 1475, { golge: false });
    const tr = MO.oge(t, { gir: 3.35, cik: 4.05, cikYon: 'sol', agirlik: 'agir', giris: 'dus', materyal: 'kagit', x: 540 });
    o += MO.sar(police(0, 0, 640, 'TRAFİK SİGORTASI', [['Karşı tarafın zararı', 1], ['Senin araban', 0]], '#5A6478'), tr, 540, 640, { golge: false });
    o += MO.sar(isaretX(0, 0, 1.3), MO.oge(t, { gir: 3.55, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 330 }), 330, 960, { golge: false });
    const ks = MO.oge(t, { gir: 4.2, agirlik: 'agir', giris: 'yan', yon: 1, materyal: 'kagit', x: 700, bekle: 1.5 });
    o += MO.sar(police(0, 0, 640, 'KASKO', [['Çarpma, çalınma', 1], ['SEL TEMİNATI', t > 6.0 ? 1 : 2]], '#E8A020', 1, MO.E.yumusak(A(t, 4.7, 5.2))), ks, 540, 640, { golge: false });
    o += MO.sar(KP.kalkan(0, 0, .9, '#2FBF71') + isaretV(0, 0, 1.1), MO.oge(t, { gir: 6.0, agirlik: 'oyuncu', giris: 'olcek', materyal: 'cam', x: 330 }), 330, 945, { golge: false });
    return o;
  },
  onCiz: t => { const p = MO.oge(t, { gir: 3.4, cik: 6.5, agirlik: 'hafif', giris: 'yuksel', x: 540, ses: false }); return p.gor ? MO.sar(takipCip(5, 0, 99).replace(/translate\(540 400\)/, 'translate(0 0)'), p, 0, 0, { golge: false }) : ''; }
});"""
# 04 — KASKON YOKSA (22,95–28,7): dikey dünya. Üstte rögar kesiti (altyapı yetersiz) → 2,95'te kamera AŞAĞI PAN (aşamalı ifşa)
#   → belediye + terazi (dava) → ₺ TAZMİNAT damgası. Çıkış: Gubi yıldızı (koyu) logoya açılır.
S[4] = r"""
const D = 1150; // alt bölümün dünya ofseti
MO.sahne({
  zemin: MO.zemin({ ust: '#1E2A48', alt: '#0B1428', isik: [540, 900, '#FFE0A0', .10] }),
  kamera: [[0, 1.0, 540, 900], [2.95, 1.0, 540, 900 + D, .55, 'inOutCubic']],
  parallax: .1,
  ciz: t => {
    let o = '';
    const rg = MO.oge(t, { gir: -.6, agirlik: 'agir', giris: 'sabit', materyal: 'su', x: 540, ses: false });
    o += MO.sar(SE.rogar(-450, -260, 900, 520, t, 1) + SE.araba(-200, -20 + 5 * Math.sin(t * 2), .8, { renk: '#E8323C', rot: -4 }), rg, 540, 780);
    o += MO.sar(etiket('ALTYAPI YETERSİZ', 0, 0, '#E8323C', '#FFFFFF', 44, -2, 1), MO.oge(t, { gir: 1.1, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1110, { golge: false });
    // alt bölüm
    o += `<circle cx="540" cy="${740 + D}" r="360" fill="#FFE0A0" opacity=".07"/>`;
    o += MO.sar(belediye(0, 0, 1.1).replace(/<rect x="-3" y="-420"[^]*?#E30A17"\/>/, ''), MO.oge(t, { gir: 3.15, agirlik: 'kahraman', giris: 'yuksel', materyal: 'ahsap', x: 540 }), 540, 910 + D);
    o += MO.sar(terazi(0, 0, .95, 7 * Math.sin(t * 2.2)), MO.oge(t, { gir: 3.45, agirlik: 'oyuncu', giris: 'olcek', materyal: 'metal', x: 540 }), 540, 440 + D, { golge: false });
    o += MO.sar(AU.cip('BELEDİYEYE DAVA', 0, 0, '#FFFFFF', '#1B2440', 32), MO.oge(t, { gir: 3.35, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 1005 + D, { golge: false });
    o += MO.sar(etiket('₺ TAZMİNAT', 0, 0, '#2FBF71', '#FFFFFF', 52, -3, 1), MO.oge(t, { gir: 4.6, agirlik: 'agir', giris: 'damga', materyal: 'metal', x: 540 }), 540, 1110 + D, { golge: false });
    if (t > 3.6) o += kredi('KAYNAK: GZT · 15.10.2026', 60, 1215 + D);
    return o;
  },
  onCiz: t => MO.sar(AU.cip('KASKON YOKSA?', 0, 0, '#E8A020', '#1B2440', 36), MO.oge(t, { gir: .1, cik: 2.85, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 420, { golge: false }) +
    gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 800] })
});"""
