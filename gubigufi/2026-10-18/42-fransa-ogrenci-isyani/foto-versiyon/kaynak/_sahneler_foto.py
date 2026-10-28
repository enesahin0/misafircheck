# GERÇEK FOTOĞRAF VERSİYONU — _sahneler.py'deki sahnelerden fotoğraflı olanları değiştirir (S[2,3,4,5,10,13-16] çizim olarak kalır)

# 01 — KANCA: Grenoble lise barikatı → Bayonne öğrenci eylemi → Paris 17 Ekim yangın → duman
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A1022', alt: '#05070F', isik: [540, 900, '#FF6A1F', .10] }),
  kamera: [[0, 1.0, 540, 960]],
  sarsinti: [[4.9, 14], [6.5, 12], [8.2, 8]],
  ciz: t => {
    let o = '';
    o += fotoT(t, 'grenoble', 0, 2.4, { f0: [.5, .60], f1: [.5, .80], z: [1, 1.14], fi: 0, fo: .3 });
    o += fotoK(t, 'bayonne', 2.0, 5.0, { y: 905, w: 1010, hmax: 700, fi: .35, fo: .35 });
    o += fotoT(t, 'paris_yangin', 4.7, 8.0, { f0: [.42, .56], f1: [.64, .50], z: [1.0, 1.14], fi: .3, fo: .35, kar: .1 });
    o += fotoT(t, 'paris_17', 7.7, 10.7, { f0: [.30, .62], f1: [.52, .50], z: [1.0, 1.12], fi: .35, fo: 0 });
    o += ET(t, .2, 2.2, 'BİR LİSEDEN BAŞLAYAN İSYAN', '#E8323C', '#FFFFFF', 52, 470, -2);
    o += ET(t, 2.3, 4.8, 'FRANSA\'YI ERKEN SEÇİME', '#FFD23F', '#1B2440', 54, 410, -2) + ET(t, 2.5, 4.8, 'Mİ GÖTÜRECEK?', '#FFFFFF', '#E8323C', 74, 530, 2);
    o += MO.sar(R(-300, -46, 600, 92, 46, '#0B1433') + `<rect x="-300" y="-46" width="600" height="92" rx="46" fill="none" stroke="#7FA6FF" stroke-width="4"/><rect x="-262" y="-18" width="38" height="36" fill="#2A4FA8"/><rect x="-224" y="-18" width="38" height="36" fill="#F4F4F4"/><rect x="-186" y="-18" width="38" height="36" fill="#E8323C"/>` + txt('DEVRİMLERİN ÜLKESİ', 50, 14, 38, '#FFF6E6'), MO.oge(t, { gir: 4.9, cik: 6.3, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 470, { golge: false });
    o += ET(t, 6.5, 8.4, 'OKULLAR YANIYOR', '#E8323C', '#FFFFFF', 76, 470, -3);
    o += ET(t, 8.5, 9.5, 'SOKAKLAR ALEVLER İÇİNDE', '#FF8A4A', '#1B2440', 50, 470, -2);
    o += MO.sar(zamanChip('İPUCU SONDA', 0, 0, '#FFD23F', '#1B2440', 40), MO.oge(t, { gir: 9.6, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 470, { golge: false });
    return o;
  },
  onCiz: t => ''
});"""

# 06 — BARİKAT: Rennes sıralardan barikat → Grenoble kapı önü çöpler → Paris sokak yangını
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A1022', alt: '#05070F', isik: [540, 900, '#FF6A1F', .12] }),
  kamera: [[0, 1.0, 540, 960]],
  sarsinti: [[5.0, 12]],
  ciz: t => {
    let o = '';
    o += fotoT(t, 'rennes', 0, 3.3, { f0: [.80, .82], f1: [.62, .82], z: [1, 1.12], fi: 0, fo: .3 });
    o += fotoT(t, 'grenoble', 3.0, 5.0, { f0: [.46, .84], f1: [.40, .92], z: [1.15, 1.32], fi: .3, fo: .3 });
    o += fotoT(t, 'paris_yangin', 4.7, 6.0, { f0: [.60, .52], f1: [.68, .50], z: [1.04, 1.12], fi: .3, fo: 0, kar: .1 });
    o += ET(t, .3, 3.0, 'KAPILAR KAPANDI', '#FF8A4A', '#1B2440', 64, 470, -2);
    o += ET(t, 3.4, 4.8, 'ÇÖPLER', '#FFD23F', '#1B2440', 70, 470, 2);
    o += ET(t, 5.0, 6.0, 'KAPILAR TUTUŞTU', '#E8323C', '#FFFFFF', 62, 470, -3);
    return o;
  },
  onCiz: t => MF(t, { gd: 'saskin', gf: 'merak' })
});"""

# 07 — ONLARCA OKUL (çizim) → 4'TE 1: Paris 6 Ekim lise eylemi
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 760, '#FF6A1F', .18], ikinci: [900, 400, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960]],
  ciz: t => {
    let o = '';
    const g = 1 - fd(t, 3.0, 3.4);
    if (g > .01) { o += yBas(t, 'sokak', 'ONLARCA OKUL', '#E8323C', .05, 420);
      o += `<g opacity="${g.toFixed(2)}">`;
      for (let i = 0; i < 24; i++) { const r = Math.floor(i / 6), q = i % 6, k = clmp((t - .3 - i * .09) / .45); o += okulK(110 + q * 172, 740 + r * 165, .8, ob(k) * (k > 0 ? 1 : 0), t, i + 1); }
      o += `</g>`; }
    o += fotoT(t, 'paris_6', 2.9, 6.5, { f0: [.28, .66], f1: [.62, .60], z: [1.0, 1.14], fi: .4, fo: 0 });
    if (t > 3.2) o += ET(t, 3.3, 99, 'HER 4 LİSEDEN 1\'İ', '#FFD27A', '#1B2440', 58, 470, -2);
    if (t > 4.9) o += MO.sar(R(-130, -70, 260, 140, 70, '#E8323C') + txt('1/4', 0, 34, 86, '#FFFFFF'), MO.oge(t, { gir: 4.9, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1140, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'saskin' })
});"""

# 08 — HÜKÜMET / SENDİKA: 3.000 kartı → öğrencilerin pankartı (Perpignan)
S[8] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203E', alt: '#070C1C', isik: [540, 760, '#7FA6FF', .14], ikinci: [900, 1400, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960]],
  ciz: t => {
    let o = yBas(t, 'ev', 'HÜKÜMET', '#7FA6FF', .05, 420);
    const kk = ob(fd(t, .3, .9)) * (1 - fd(t, 2.9, 3.3));
    if (kk > .01) { o += `<g transform="translate(540 760) scale(${kk.toFixed(3)})">` + R(-380, -190, 760, 360, 36, '#F4F1E8') + R(-380, -190, 760, 70, 36, '#2A4FA8') + R(-380, -150, 760, 30, 0, '#2A4FA8') + txt('YEDEK ÖĞRETMEN', 0, -140, 40, '#FFFFFF') + txt('3.000', 0, 30, 150, '#1B2440');
      for (let i = 0; i < 9; i++) o += `<g transform="translate(${-240 + i * 60} 110)"><circle cy="-12" r="14" fill="#F2C9A0"/><path d="M-18 40 Q-18 6 0 4 Q18 6 18 40Z" fill="${['#3E8EDE', '#E8774A', '#2FBF71'][i % 3]}"/></g>`;
      o += `</g>`; }
    o += fotoK(t, 'perp_afis', 2.9, 5.0, { y: 700, w: 1010, hmax: 700, z: [1.0, 1.08], fi: .4, fo: 0 });
    if (t > 3.2) o += ET(t, 3.3, 99, '"SADECE BİR GELECEK İSTİYORUZ"', '#FFD23F', '#1B2440', 36, 1090, -1);
    const y = fd(t, 3.0, 3.5);
    if (y > 0) { o += MO.sar(R(-210, -70, 420, 140, 36, '#16204A') + `<rect x="-210" y="-70" width="420" height="140" rx="36" fill="none" stroke="#E8323C" stroke-width="6"/>` + txt('SENDİKALAR', 0, -14, 36, '#C8D0DC') + txt('"YETMEZ"', 0, 44, 62, '#FF6A6A'), MO.oge(t, { gir: 3.0, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1215, { golge: false }); }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""

# 09 — POLİS (Perpignan) → GÖZALTI sayacı (çizim)
S[9] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A1022', alt: '#05070F', isik: [540, 900, '#7FA6FF', .10], ikinci: [900, 400, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960]],
  sarsinti: [[1.8, 8], [2.2, 6]],
  ciz: t => {
    let o = '';
    const b = fd(t, 3.4, 3.9);
    o += fotoT(t, 'perp_polis', 0, 3.9, { f0: [.30, .55], f1: [.62, .55], z: [1.0, 1.10], fi: 0, fo: .4 });
    o += ET(t, .8, 3.4, 'GAZ + SERSEMLETİCİ BOMBA', '#7FA6FF', '#0B1433', 48, 470, -2);
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

# 11 — 900+ POLİS YARALI: Paris 17 Ekim fotoğrafı arka planda
S[11] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203E', alt: '#070C1C', isik: [540, 760, '#7FA6FF', .12] }),
  kamera: [[0, 1.0, 540, 960]],
  ciz: t => {
    let o = fotoT(t, 'paris_17', 0, 3.7, { f0: [.20, .66], f1: [.46, .60], z: [1.0, 1.1], fi: 0, fo: 0, kar: .42 });
    const n = Math.round(900 * ob(clmp((t - .9) / 1.6)));
    o += MO.sar(`<g>` + R(-300, -190, 600, 380, 40, '#16204A', .94) + `<rect x="-300" y="-190" width="600" height="380" rx="40" fill="none" stroke="#7FA6FF" stroke-width="5"/><path d="M-70 -50 Q-70 -150 0 -150 Q70 -150 70 -50 L90 -20 H-90Z" fill="#2A4FA8"/><rect x="-96" y="-24" width="192" height="26" rx="10" fill="#1F3B80"/><rect x="-14" y="-110" width="28" height="60" rx="8" fill="#FFFFFF" opacity=".8"/>` + txt(n + '+', 0, 150, 108, '#FFFFFF') + `</g>`, MO.oge(t, { gir: .4, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 840, { golge: false });
    o += MO.sar(zamanChip('HÜKÜMETE GÖRE', 0, 0, '#FFD23F', '#1B2440', 44), MO.oge(t, { gir: 2.2, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 1130, { golge: false });
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'saskin' })
});"""

# 12 — 1968: Bordeaux barikatı (arşiv fotoğrafı) → ERKEN SEÇİM
S[12] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241A10', alt: '#0A0806', isik: [540, 760, '#FFD27A', .16], ikinci: [900, 1400, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960]],
  ciz: t => {
    let o = '';
    const sec = fd(t, 4.8, 5.8);
    o += MO.sar(zamanChip('İPUCU', 0, 0, '#FFD23F', '#1B2440', 44), MO.oge(t, { gir: .25, cik: 1.4, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 470, { golge: false });
    o += fotoK(t, 'mai68', 1.2, 5.2, { y: 830, hmax: 820, z: [1.0, 1.06], fi: .5, fo: .5 });
    if (t > 2.6 && sec < 1) o += MO.sar(etiket('1968', 0, 0, '#E8323C', '#FFFFFF', 96, -4, 1), MO.oge(t, { gir: 2.8, cik: 4.9, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1180, { golge: false });
    if (sec > 0) { o += `<g opacity="${sec.toFixed(2)}">` + zarfOy(540, 880, 1.25, ob(clmp((t - 5.0) / 1.2))) + `</g>`;
      o += MO.sar(etiket('ERKEN SEÇİM', 0, 0, '#2A4FA8', '#FFFFFF', 62, -2, 1), MO.oge(t, { gir: 5.6, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1150, { golge: false }); }
    return o;
  },
  onCiz: t => MF(t, { gd: 'merak', gf: 'merak' })
});"""
