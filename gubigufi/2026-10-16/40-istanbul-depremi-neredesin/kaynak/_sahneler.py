S = {}
# 01 — KANCA (0–10,9): İstanbul silueti sarsılır, "BEKLENEN DEPREM OLDU"; 5 yer kartı VO ile (vapur 3,9 · metro 5,1 · köprü 6,0 · sokak 6,8 · ev 7,8); 8,7 "İLK REFLEKSİN YANLIŞ" → kartlarda ✕
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1A1228', alt: '#07060E', isik: [540, 640, '#FF8A4A', .22], ikinci: [200, 1500, '#3E6FB8', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 10.5, 'kamera']],
  sarsinti: [[.12, 26], [.5, 12], [8.7, 10]],
  ciz: t => {
    let o = '';
    const titre = t < 2.2 ? Math.sin(t * 60) * 5 * Math.exp(-t * 1.1) : 0;
    o += `<g transform="translate(${titre} 0)">` + istSil(790, '#1B1630', '#FFD27A', t) + `</g>`;
    // çatlak çizgisi
    const ck = MO.cl((t - .2) / .5);
    o += `<path d="M-20 812 L120 790 L180 830 L300 796 L420 840 L560 802 L700 846 L820 806 L960 838 L1100 800" stroke="#FF8A4A" stroke-width="7" fill="none" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="${(1400 * (1 - MO.E.outCubic(ck))).toFixed(0)}"/>`;
    o += MO.sar(etiket('BEKLENEN DEPREM OLDU', 0, 0, '#E8323C', '#FFFFFF', 62, -3, 1), MO.oge(t, { gir: .15, cik: 8.55, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 420, { golge: false });
    const kartlar = [['vapur', 'VAPUR', 3.9, 230, 930], ['metro', 'METRO', 5.08, 540, 930], ['kopru', 'KÖPRÜ', 6.0, 850, 930], ['sokak', 'SOKAK', 6.84, 385, 1160], ['ev', 'EV', 7.8, 695, 1160]];
    kartlar.forEach(([tur, ad, g, x, y], i) => {
      const bad = MO.E.outCubic(MO.ar(t, 8.7 + i * .13, 8.95 + i * .13));
      const ic = R(-130, -100, 260, 200, 30, '#0F1838') + `<rect x="-130" y="-100" width="260" height="200" rx="30" fill="none" stroke="${bad > .5 ? '#E8323C' : '#FF8A4A'}" stroke-width="5"/>` + ikon(tur, 0, -26, .85) + txt(ad, 0, 80, 36, '#FFF6E6') + (bad > .01 ? `<g opacity="${bad.toFixed(2)}">` + isaretX(96, -70, 1.1) + `</g>` : '');
      o += MO.sar(ic, MO.oge(t, { gir: g, agirlik: 'orta', giris: 'olcek', materyal: 'plastik', x }), x, y, { golge: false });
    });
    o += MO.sar(etiket('İLK REFLEKSİN YANLIŞ', 0, 0, '#FFD23F', '#1B2440', 54, -2, 1), MO.oge(t, { gir: 8.75, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 420, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: t > 8.7 ? 'saskin' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: t > 1 ? 'saskin' : 'merak', bakHedef: [540, 900] })
});"""

# 02 — VAPUR A (10,9–19,0): "ilk hissedeceğin şey sallanma değil" (0,2–2,9) → 3,2 SERT SARSINTI (deniz tabanından halkalar, vapur sıçrar) → 6,4 "DENİZ DEPREMİ"
S[2] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0E1B3A', alt: '#06101F', isik: [540, 900, '#3E8EDE', .20], ikinci: [900, 1500, '#FF8A4A', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 7.8, 'kamera']],
  sarsinti: [[3.2, 30], [3.55, 14]],
  ciz: t => {
    let o = '';
    const jolt = t > 3.2 ? Math.exp(-(t - 3.2) * 3) * Math.sin((t - 3.2) * 38) * 34 : 0;
    const rock = Math.sin(t * 1.9) * 3.2 * (t < 3.2 ? 1 : Math.exp(-(t - 3.2) * 2));
    // deniz tabanı + su
    o += R(-100, 1230, 1280, 700, 0, '#C9A86A') + R(-100, 1222, 1280, 14, 0, '#8A7248');
    o += `<path d="${suYol(940, t, { amp: 12, uz: 150, hiz: 1.4, h: 330 })}" fill="#2E78C8" opacity=".92"/>`;
    o += `<path d="${suYol(954, t + 1.1, { amp: 9, uz: 120, hiz: 1.8, h: 330 })}" fill="#1E5FA8" opacity=".8"/>`;
    // deniz tabanı çatlağı + şok halkaları
    const sk = MO.ar(t, 3.2, 3.5);
    if (sk > 0) { o += `<path d="M420 1224 L500 1262 L470 1300 L560 1330 L520 1380" stroke="#6A5430" stroke-width="9" fill="none" stroke-linejoin="round"/>`; for (let k = 0; k < 4; k++) { const q = t - 3.2 - k * .22; if (q > 0 && q < 1.8) o += halka(540, 1230, 70 + q * 520, 1 - q / 1.8, '#FF8A4A', 10); } }
    // vapur
    o += `<g transform="translate(540 ${870 + jolt}) rotate(${rock + (t > 3.2 ? Math.sin(t * 30) * 2.4 * Math.exp(-(t - 3.2) * 3) : 0)})">` + MO.sar('', {}, 0, 0) + ikon('vapur', 0, -30, 3.3) + '</g>';
    // karaya oturmuş gibi: kesik çizgili hayali kum
    const ka = MO.E.outCubic(MO.ar(t, 3.5, 4.0)) * (1 - MO.ar(t, 6.0, 6.4));
    if (ka > 0) o += `<g opacity="${ka.toFixed(2)}"><path d="M330 1000 Q540 940 750 1000" stroke="#FFE9A8" stroke-width="7" fill="none" stroke-dasharray="14 14"/><text x="540" y="1100" font-size="80" font-weight="900" text-anchor="middle" style="fill:#FFE9A8">?</text></g>`;
    // başlık + etiketler
    o += MO.sar(yerBas('vapur', 'VAPURDAYSAN', '#3E8EDE', 62), MO.oge(t, { gir: .1, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 420, { golge: false });
    o += MO.sar(zamanChip('SALLANMA', 0, 0, '#0B1433', '#C8D0DC', 40) + isaretX(160, -8, 1.1), MO.oge(t, { gir: 1.4, cik: 3.1, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 590, { golge: false });
    o += MO.sar(etiket('SERT SARSINTI', 0, 0, '#E8323C', '#FFFFFF', 74, -4, 1), MO.oge(t, { gir: 3.25, cik: 6.1, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 590, { golge: false });
    o += MO.sar(etiket('DENİZ DEPREMİ', 0, 0, '#FFD23F', '#1B2440', 80, -3, 1), MO.oge(t, { gir: 6.45, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 590, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: t > 3.3 ? 'saskin' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""

# 03 — VAPUR B (19,0–27,2): açık deniz/kıyı dalga (0,2–3,2) · kapılara üşüşme ✕ (3,3) · tutun/kaptan ✓ (4,6) · sahilden uzaklaş ✓ (6,6)
S[3] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0E1B3A', alt: '#06101F', isik: [540, 900, '#3E8EDE', .18] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 8.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'vapur', 'VAPURDAYSAN', '#3E8EDE');
    // A) açık deniz küçük dalga → kıyıda büyür
    const dal = MO.E.outCubic(MO.ar(t, 2.0, 3.0));
    let sea = 'M-470 340 L-470 90';
    for (let x = -470; x <= 470; x += 10) { const k = MO.cl((x + 100) / 470), amp = 7 + dal * 62 * k * k; sea += ` L${x} ${(70 - amp - amp * Math.sin(x / 55 - t * 3.2)).toFixed(1)}`; }
    sea += ' L470 340Z';
    const kiyi = `<path d="M-470 345 L-60 345 L170 300 L300 205 L470 150 L470 345Z" fill="#C9A86A"/>` + R(330, 70, 70, 120, 3, '#3A4A7A') + R(410, 40, 56, 150, 3, '#2A3A6A') + R(344, 90, 14, 14, 2, '#FFE9A8') + R(424, 70, 14, 14, 2, '#FFE9A8');
    const aIc = `<clipPath id="pk1"><rect x="-460" y="-320" width="920" height="640" rx="36"/></clipPath><g clip-path="url(#pk1)">` + `<path d="${sea}" fill="#2E78C8"/>` + kiyi + `<rect x="-460" y="-320" width="920" height="640" fill="#E8323C" opacity="${(.18 * dal).toFixed(2)}"/>` + `</g>` +
      zamanChip('AÇIK DENİZ', -240, -170, '#0B1433', '#FFFFFF', 30) + `<g opacity="${Math.min(1, dal * 3).toFixed(2)}">` + zamanChip('KIYI', 300, -170, '#E8323C', '#FFFFFF', 34) + `</g>` + `<path d="M-250 -110 V-10" stroke="#C8D0DC" stroke-width="6"/><path d="M330 ${(-110 + 60 * (1 - dal)).toFixed(0)} V70" stroke="#FFD23F" stroke-width="8"/>`;
    o += PK(t, .15, 3.2, aIc);
    // B) kapılara üşüşen kalabalık ✕
    const kal = [['#E8323C', -380], ['#3E8EDE', -280], ['#FBAC39', -180], ['#2FBF71', -80], ['#9B6BD6', 20]].map(([r, x], i) => ins(x + Math.sin(t * 9 + i) * 5, 230, .9, { renk: r, poz: 'kos', sal: Math.sin(t * 14 + i * 2) * 3 })).join('');
    const bIc = R(230, -190, 170, 380, 12, '#2A3A6A') + R(244, -176, 142, 350, 8, '#BFE0FF', .35) + R(250, -224, 130, 34, 8, '#1F9E5B') + txt('ÇIKIŞ', 315, -198, 22, '#FFFFFF') + R(-460, 230, 920, 12, 0, '#4A5578') + kal +
      `<path d="M150 20 H215" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/><path d="M215 20 l-26 -22 M215 20 l-26 22" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/>`;
    o += PK(t, 3.25, 4.55, bIc) + BN(t, 3.3, 4.55, 'x', 'KAPILARA ÜŞÜŞME');
    // C) sıkıca tut + kaptan anonsu ✓
    const cIc = R(-460, -320, 920, 640, 36, '#16264C') + R(-380, -250, 190, 140, 14, '#2E78C8') + R(-170, -250, 190, 140, 14, '#2E78C8') + R(-420, -26, 560, 18, 9, '#C8D0DC') + R(-370, -26, 16, 260, 6, '#C8D0DC') + R(60, -26, 16, 260, 6, '#C8D0DC') +
      ins(-110, 206, 1.0, { renk: '#3E8EDE', poz: 'tut', sal: Math.sin(t * 6) * 1.2 }) + hoparlor(260, -140, 1.2, t) + zamanChip('KAPTAN', 285, -40, '#0B1433', '#FFD23F', 30);
    o += PK(t, 4.5, 6.6, cIc) + BN(t, 4.6, 6.6, 'v', 'SIKICA TUTUN · KAPTANI DİNLE', 46);
    // D) sahilden uzaklaş ✓
    const wlk = MO.cl((t - 6.7) / 1.4);
    const dIc = `<clipPath id="pk4"><rect x="-460" y="-320" width="920" height="640" rx="36"/></clipPath><g clip-path="url(#pk4)"><path d="${suYol(110, t, { amp: 16, uz: 120, hiz: 1.6, h: 400, x0: -480, x1: -80 })}" fill="#2E78C8"/><path d="M-480 340 L-480 200 L-140 200 L40 190 L200 90 L300 -20 L460 -90 L460 340Z" fill="#C9A86A"/><path d="M200 90 L300 -20 L460 -90 L460 -150 L200 -60Z" fill="#6AA85A"/></g>` +
      ins(-90 + wlk * 320, 205 - wlk * 215 * 0 - wlk * 150, .85, { renk: '#FBAC39', poz: 'dur', sal: Math.sin(t * 9) * 2 }) + `<path d="M-100 40 Q60 30 200 -40" stroke="#FFFFFF" stroke-width="9" fill="none" stroke-dasharray="16 14" stroke-linecap="round"/><path d="M200 -40 l-30 4 M200 -40 l-12 26" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>` + zamanChip('YÜKSEK YER', 300, -230, '#1F9E5B', '#FFFFFF', 30);
    o += PK(t, 6.55, undefined, dIc) + BN(t, 6.65, undefined, 'v', 'SAHİLDEN UZAKLAŞ');
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""

# 04 — METRO A (27,2–34,8): tren sertçe durur (0–2,5) → sismik sensör algılar (2,9–4,6) → sinyal → en yakın istasyon (5,4–7,2)
S[4] = r"""
const tren = (xF, y) => `<g transform="translate(${xF - 540} ${y})">` + R(0, 0, 540, 190, 34, '#2A3A6A') + R(0, 112, 540, 16, 0, '#E8323C') + [0, 1, 2, 3, 4].map(i => R(26 + i * 98, 30, 78, 58, 10, '#BFE0FF')).join('') + R(506, 36, 34, 126, 17, '#1F2A52') + `<circle cx="522" cy="150" r="11" fill="#FFE9A8"/>` + [80, 170, 360, 450].map(x => `<circle cx="${x}" cy="196" r="28" fill="#14171F"/><circle cx="${x}" cy="196" r="11" fill="#8A94A8"/>`).join('') + `<circle cx="270" cy="150" r="20" fill="#E8323C"/><text x="270" y="158" font-size="24" font-weight="900" text-anchor="middle" style="fill:#fff">M</text></g>`;
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0F22', alt: '#05070F', isik: [540, 900, '#3E6FB8', .14] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 7.5, 'kamera']],
  sarsinti: [[1.5, 20]],
  ciz: t => {
    let o = yBas(t, 'metro', 'METRODAYSAN', '#FF8A4A');
    const sar = t > 1.4 && t < 2.8 ? Math.sin(t * 55) * 4 * Math.exp(-(t - 1.4) * .9) : 0;
    // tünel
    o += `<g transform="translate(${sar} 0)">` + R(-100, 640, 1280, 430, 0, '#141A33') + R(-100, 640, 1280, 18, 0, '#0B1024') + R(-100, 1060, 1280, 20, 0, '#0B1024');
    for (let i = 0; i < 8; i++) { const fl = t > 1.4 && t < 2.2 ? (Math.sin(t * 40 + i * 3) > 0 ? 1 : .15) : 1; o += R(-20 + i * 160, 664, 70, 10, 5, '#FFE9A8', .8 * fl); }
    o += R(-100, 1000, 1280, 10, 0, '#8A94A8') + R(-100, 1018, 1280, 6, 0, '#5A6478');
    for (let i = 0; i < 14; i++) o += R(-60 + i * 100, 1024, 56, 12, 2, '#2A3354');
    // istasyon (sağda)
    const ist = MO.E.outCubic(MO.ar(t, 5.1, 5.7));
    o += `<g opacity="${ist.toFixed(2)}">` + R(700, 960, 520, 50, 0, '#3A4670') + R(700, 954, 520, 8, 0, '#FFD23F') + R(760, 700, 14, 260, 0, '#5A6478') + R(1010, 700, 14, 260, 0, '#5A6478') + `</g>`;
    // tren
    const xF = 120 + 330 * Math.min(t, 1.5) + 95 * MO.E.outCubic(MO.ar(t, 1.5, 2.6)) + 400 * MO.E.inOutCubic(MO.ar(t, 5.2, 7.2));
    o += tren(xF + Math.sin(t * 50) * (t > 1.5 && t < 2.5 ? 3 : 0), 810 + sar * .5);
    o += `</g>`;
    // fren kıvılcımları
    if (t > 1.5 && t < 2.7) for (let k = 0; k < 9; k++) { const q = ((t - 1.5) * 3 + k * .37) % 1; o += `<circle cx="${xF - 540 + 80 + k * 46 + q * 30}" cy="${1005 - q * 50}" r="${(4 - q * 3).toFixed(1)}" fill="#FFB347" opacity="${(1 - q).toFixed(2)}"/>`; }
    o += MO.sar(etiket('SERT DURUŞ', 0, 0, '#E8323C', '#FFFFFF', 64, -4, 1), MO.oge(t, { gir: 1.6, cik: 2.9, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 580, { golge: false });
    // sismik sensör (tavan) + yer halkaları + sinyal
    const sg = MO.E.outCubic(MO.ar(t, 2.9, 3.4));
    if (sg > 0) {
      o += MO.sar(R(-14, -40, 28, 40, 6, '#C8D0DC') + `<circle cx="0" cy="-52" r="16" fill="#FFD23F"/>` + zamanChip('SİSMİK SENSÖR', 0, -112, '#0B1433', '#FFD23F', 26), MO.oge(t, { gir: 2.9, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 300 }), 300, 760, { golge: false });
      for (let k = 0; k < 3; k++) { const q = t - 3.5 - k * .3; if (q > 0 && q < 1.4) o += halka(300, 1060, 40 + q * 330, 1 - q / 1.4, '#FF8A4A', 8); }
    }
    const sgn = MO.ar(t, 4.5, 5.3);
    if (sgn > 0 && sgn < 1.02) { o += `<path d="M300 700 L${xF - 270} 800" stroke="#FFD23F" stroke-width="5" stroke-dasharray="12 12" fill="none" opacity=".8"/>`; const px = 300 + (xF - 270 - 300) * sgn, py = 700 + 100 * sgn; o += `<circle cx="${px}" cy="${py}" r="14" fill="#FFD23F"/>`; }
    o += MO.sar(zamanChip('EN YAKIN İSTASYON', 0, 0, '#1F9E5B', '#FFFFFF', 30), MO.oge(t, { gir: 5.4, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 800 }), 790, 600, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: t > 1.5 ? 'saskin' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 05 — METRO B (34,8–41,2): raya inme ✕ (0,2–3,9: elektrik 1,5 · karşıdan tren 2,5) → tutun · başını koru · anonsu bekle ✓ (4,0–6,4)
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0F22', alt: '#05070F', isik: [540, 900, '#3E6FB8', .14] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 6.4, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'metro', 'METRODAYSAN', '#FF8A4A');
    // A) raya inme
    const ap = MO.cl((t - 1.0) / 2.9), a2 = ap * ap, bolt = Math.sin(t * 24) > .2 ? 1 : .35;
    let aIc = R(-460, -320, 920, 640, 36, '#0A0D1C') + `<path d="M120 -40 L-80 320 M120 -40 L330 320" stroke="#8A94A8" stroke-width="8" fill="none"/><path d="M120 -40 L440 320" stroke="#FFD23F" stroke-width="10" fill="none" opacity="${bolt}"/>`;
    for (let i = 1; i < 7; i++) { const q = i / 7, y = -40 + 360 * q * q, x1 = 120 - 200 * q * q, x2 = 120 + 210 * q * q; aIc += `<path d="M${x1} ${y} L${x2} ${y}" stroke="#2A3354" stroke-width="${3 + 8 * q}" opacity=".8"/>`; }
    aIc += R(-460, 120, 300, 200, 0, '#2A3456') + R(-460, 110, 300, 12, 0, '#FFD23F') + ins(-310, 114, 1.0, { renk: '#3E8EDE', poz: 'dur' });
    aIc += `<path d="M-250 120 Q-170 200 -70 230" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-dasharray="14 12" stroke-linecap="round"/>`;
    const lr = 8 + 62 * a2, ld = 12 + 70 * a2;
    aIc += `<circle cx="${120 - ld}" cy="-34" r="${(lr * 2.6).toFixed(0)}" fill="#FFE9A8" opacity="${(.12 + .12 * a2).toFixed(2)}"/><circle cx="${120 + ld}" cy="-34" r="${(lr * 2.6).toFixed(0)}" fill="#FFE9A8" opacity="${(.12 + .12 * a2).toFixed(2)}"/><circle cx="${120 - ld}" cy="-34" r="${lr.toFixed(0)}" fill="#FFF6D6"/><circle cx="${120 + ld}" cy="-34" r="${lr.toFixed(0)}" fill="#FFF6D6"/>`;
    aIc += `<path d="M300 40 l-30 60 h26 l-22 70 l56 -84 h-28 l26 -46Z" fill="#FFD23F" opacity="${bolt}"/>`;
    o += PK(t, .15, 3.95, aIc);
    o += MO.sar(zamanChip('ELEKTRİK VAR', 0, 0, '#E8323C', '#FFFFFF', 32), MO.oge(t, { gir: 1.5, cik: 3.9, agirlik: 'orta', giris: 'yuksel', x: 860 }), 800, 560, { golge: false });
    o += MO.sar(zamanChip('KARŞIDAN TREN', 0, 0, '#0B1433', '#FFE9A8', 32), MO.oge(t, { gir: 2.5, cik: 3.9, agirlik: 'orta', giris: 'yuksel', x: 640 }), 380, 560, { golge: false });
    o += BN(t, .3, 3.95, 'x', 'RAYA İNME');
    // B) üç ✓
    const kart = (x, g, ic, ad) => { const p = MO.E.outCubic(MO.ar(t, g, g + .35)); return p <= 0 ? '' : `<g transform="translate(${x} 0) scale(${(.85 + .15 * p).toFixed(3)})" opacity="${p.toFixed(2)}">` + R(-140, -250, 280, 500, 28, '#16264C') + ic + txt(ad, 0, 214, 34, '#FFF6E6') + isaretV(100, -206, 1.0) + `</g>`; };
    const bIc = R(-460, -320, 920, 640, 36, '#0C1228', 0) +
      kart(-300, 4.05, R(-6, -220, 12, 330, 6, '#C8D0DC') + ins(-40, 130, .95, { renk: '#3E8EDE', poz: 'tut' }), 'TUTUN') +
      kart(0, 4.6, ins(0, 130, .95, { renk: '#FBAC39', poz: 'bas' }) + R(-34, -150, 68, 38, 10, '#7A4A2A', 1), 'BAŞINI KORU') +
      kart(300, 5.55, hoparlor(-70, -40, 1.25, t) + R(-60, 40, 120, 8, 4, '#FFD23F', .0), 'ANONSU BEKLE');
    o += PK(t, 3.95, undefined, bIc);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: t < 3.9 ? 'saskin' : 'merak', bakHedef: [540, 900] })
});"""
# 06 — İSTASYON (41,2–48,2): çıkışa koşma ✕ (0,2) · yürüyen merdivende bantlara tutun ✓ (2,5) · peronda sütun yanına çök ✓ (4,75)
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0A0F22', alt: '#05070F', isik: [540, 900, '#3E6FB8', .14] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 7.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'metro', 'İSTASYONDAYSAN', '#FF8A4A');
    // A) çıkışa koşan kalabalık ✕ + merdiven
    let st = ''; for (let i = 0; i < 6; i++) st += R(150 + i * 50, 170 - i * 50, 50, 160 + i * 50, 0, i % 2 ? '#3A4670' : '#46547F');
    const kal = [['#E8323C', -380], ['#3E8EDE', -290], ['#FBAC39', -200], ['#2FBF71', -110], ['#9B6BD6', -20]].map(([r, x], i) => ins(x + Math.sin(t * 9 + i) * 5, 230, .9, { renk: r, poz: 'kos', sal: Math.sin(t * 14 + i * 2) * 3 })).join('');
    const aIc = R(-460, 230, 920, 90, 0, '#2A3456') + st + R(300, -240, 150, 36, 8, '#1F9E5B') + txt('ÇIKIŞ', 375, -214, 26, '#FFFFFF') + kal + `<path d="M60 20 H140" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/><path d="M140 20 l-26 -22 M140 20 l-26 22" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/>`;
    o += PK(t, .15, 2.45, aIc) + BN(t, .25, 2.45, 'x', 'ÇIKIŞA KOŞMA');
    // B) yürüyen merdiven: korkuluk bandına tutun
    const bw = 300 - 0; let adim = '';
    for (let i = 0; i < 9; i++) { const f = (i + (t * .8) % 1) / 9, x = -300 + 600 * f, y = 200 - 360 * f; adim += `<path d="M${x - 40} ${y} h60 v14 h-60Z" fill="#5A6478"/>`; }
    const bIc = `<path d="M-340 230 L340 -180 L340 -100 L-340 310Z" fill="#2A3456"/>` + adim + `<path d="M-300 -10 L170 -292" stroke="#FFD23F" stroke-width="22" stroke-linecap="round" opacity=".95"/><path d="M-300 -10 L170 -292" stroke="#FFFFFF" stroke-width="5" stroke-dasharray="26 30" stroke-linecap="round" opacity="${(.5 + .5 * Math.sin(t * 6)).toFixed(2)}"/>` + ins(-20, 41, 1.0, { renk: '#3E8EDE', poz: 'tut', sal: Math.sin(t * 5) * 1 }) + zamanChip('KORKULUK BANDI', -220, -200, '#0B1433', '#FFD23F', 28);
    o += PK(t, 2.5, 4.7, bIc) + BN(t, 2.6, 4.7, 'v', 'BANTLARA TUTUN');
    // C) peron: sütunun yanına çök
    const cIc = R(-460, 150, 920, 170, 0, '#2A3456') + R(-460, 144, 640, 10, 0, '#FFD23F') + R(180, 150, 280, 170, 0, '#0A0D1C') + R(190, 220, 260, 8, 3, '#8A94A8') + R(190, 262, 260, 8, 3, '#8A94A8') + `<path d="M180 150 L460 150" stroke="#E8323C" stroke-width="10" stroke-dasharray="20 16"/>` +
      R(-130, -320, 130, 470, 0, '#5A6478') + R(-130, -320, 130, 14, 0, '#8A94A8') + ins(-215, 148, 1.05, { renk: '#FBAC39', poz: 'cok', sal: Math.sin(t * 40) * (t > 4.9 && t < 5.6 ? 1.2 : 0) }) + zamanChip('RAYLARDAN UZAK', 320, 60, '#E8323C', '#FFFFFF', 26) + `<g opacity="${(.6 + .4 * Math.sin(t * 5)).toFixed(2)}">${halka(-100, -60, 34, 0, '#fff')}</g>`;
    o += PK(t, 4.75, undefined, cIc) + BN(t, 4.85, undefined, 'v', 'SÜTUNUN YANINA ÇÖK');
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""

# 07 — KÖPRÜ A (48,2–58,2): en çok sallanacağın yer (0,1–2,8) · esneyecek şekilde yapılır (2,8–5,6) · yetkililer: dayanıklı (5,8–9,6; kaynak: Ulaştırma Bakanlığı)
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0E1B3A', alt: '#06101F', isik: [540, 800, '#FF8A4A', .12], ikinci: [900, 1500, '#3E8EDE', .10] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 10, 'kamera']],
  sarsinti: [[.4, 10]],
  ciz: t => {
    let o = yBas(t, 'kopru', 'KÖPRÜDEYSEN', '#FF8A4A');
    const env = MO.E.outCubic(MO.ar(t, .3, 1.2)) * (t < 5.6 ? 1 : 1 - .75 * MO.ar(t, 5.6, 6.6));
    const sw = (x) => Math.sin(t * 2.7 + x / 320) * 26 * env;
    const yDeck = x => 1010 + sw(x), yCab = x => x >= 270 && x <= 810 ? 900 - 260 * Math.pow((x - 540) / 270, 2) + sw(x) * .35 : (x < 270 ? 640 + (975 - 640) * (270 - x) / 330 + sw(x) * .3 : 640 + (975 - 640) * (x - 810) / 330 + sw(x) * .3);
    // su
    o += `<path d="${suYol(1160, t, { amp: 12, uz: 150, hiz: 1.2, h: 400 })}" fill="#1E5FA8" opacity=".9"/>`;
    // kuleler
    [270, 810].forEach(x => { o += `<g transform="rotate(${(sw(x) * .05).toFixed(2)} ${x} 1160)">` + R(x - 22, 620, 44, 560, 8, '#C8D0DC') + R(x - 34, 620, 68, 16, 4, '#8A94A8') + R(x - 34, 760, 68, 14, 4, '#8A94A8') + `</g>`; });
    // ana kablo + askılar + tabliye
    let cab = ''; for (let x = -100; x <= 1180; x += 20) cab += (x > -100 ? ' L' : 'M') + x + ' ' + yCab(x).toFixed(1);
    o += `<path d="${cab}" stroke="#E8323C" stroke-width="10" fill="none" stroke-linejoin="round"/>`;
    for (let x = 300; x <= 780; x += 36) o += `<path d="M${x} ${yCab(x).toFixed(1)} L${x} ${yDeck(x).toFixed(1)}" stroke="#E8323C" stroke-width="4" opacity=".8"/>`;
    let dk = ''; for (let x = -100; x <= 1180; x += 20) dk += (x > -100 ? ' L' : 'M') + x + ' ' + yDeck(x).toFixed(1);
    o += `<path d="${dk}" stroke="#8A94A8" stroke-width="26" fill="none" stroke-linejoin="round"/><path d="${dk}" stroke="#2A3354" stroke-width="14" fill="none" stroke-linejoin="round"/>`;
    // araçlar
    [[130, '#E8323C'], [420, '#FBAC39'], [660, '#3E8EDE'], [930, '#2FBF71']].forEach(([x, r], i) => { const y = yDeck(x) - 22; o += `<g transform="translate(${x} ${y.toFixed(1)}) rotate(${(Math.cos(t * 2.7 + x / 320) * 2.2 * env).toFixed(2)})">` + R(-34, -16, 68, 22, 8, r) + R(-20, -30, 40, 18, 6, r) + R(-14, -27, 28, 12, 3, '#BFE0FF') + `<circle cx="-18" cy="8" r="9" fill="#14171F"/><circle cx="18" cy="8" r="9" fill="#14171F"/></g>`; });
    // etiketler
    o += MO.sar(zamanChip('EN ÇOK SALLANAN YER', 0, 0, '#E8323C', '#FFFFFF', 32), MO.oge(t, { gir: .9, cik: 2.9, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 760, { golge: false });
    o += MO.sar(`<path d="M0 -10 V70" stroke="#E8323C" stroke-width="8"/><path d="M0 74 l-18 -22 M0 74 l18 -22" stroke="#E8323C" stroke-width="8" stroke-linecap="round"/>`, MO.oge(t, { gir: 1.1, cik: 2.9, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 810, { golge: false });
    o += MO.sar(etiket('ESNEYECEK ŞEKİLDE YAPILIR', 0, 0, '#FFD23F', '#1B2440', 48, -2, 1), MO.oge(t, { gir: 3.05, cik: 5.7, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 600, { golge: false });
    // yetkililer: dayanıklı (kalkan) + kaynak
    const shield = `<path d="M0 -92 L78 -64 Q78 36 0 92 Q-78 36 -78 -64Z" fill="#1F9E5B"/><path d="M0 -76 L64 -52 Q64 28 0 76 Q-64 28 -64 -52Z" fill="none" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="5"/><path d="M-26 0 L-8 20 L28 -22" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    o += MO.sar(shield + txt('DAYANIKLI', 0, 150, 44, '#FFF6E6'), MO.oge(t, { gir: 5.85, agirlik: 'kahraman', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 590, { golge: false });
    o += MO.sar(zamanChip('KAYNAK: ULAŞTIRMA BAKANLIĞI AÇIKLAMASI', 0, 0, '#0B1433', '#C8D0DC', 22), MO.oge(t, { gir: 7.2, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 540, 790, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: t > 5.9 ? 'merak' : 'saskin', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 08 — KÖPRÜ B (58,2–68,0): panik freni ✕ + arkadan çarpma (0,1–3,0) · yavaşla/sağa yanaş/içeride bekle ✓ (3,1–6,7) · bitince köprüde durma ✓ (6,8) · hasarlıysa kullanma ✕ (8,3)
S[8] = r"""
const oto = (x, y, r, fren, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})">` + R(-36, -64, 72, 128, 18, r) + R(-27, -30, 54, 28, 8, '#BFE0FF') + R(-27, 18, 54, 18, 6, '#BFE0FF') + R(-34, 54, 20, 9, 3, fren ? '#FF2A2A' : '#7A1A1A') + R(14, 54, 20, 9, 3, fren ? '#FF2A2A' : '#7A1A1A') + (fren ? `<circle cx="-24" cy="64" r="22" fill="#FF2A2A" opacity=".25"/><circle cx="24" cy="64" r="22" fill="#FF2A2A" opacity=".25"/>` : '') + `</g>`;
const yolKopru = (t, kay = 0) => R(-460, -320, 920, 640, 36, '#1E5FA8') + `<path d="${suYol(-300, t, { amp: 8, uz: 90, hiz: 1.6, h: 40, x0: -460, x1: 460 })}" fill="none"/>` + R(-190, -320 + kay * 0, 440, 640, 0, '#8A94A8') + R(-176, -320, 412, 640, 0, '#2A3354') + [-70, 66].map(x => `<path d="M${x} -320 V320" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="5" stroke-dasharray="40 30"/>`).join('') + R(170, -320, 6, 640, 0, '#FFD23F', .8);
MO.sahne({
  zemin: MO.zemin({ ust: '#0E1B3A', alt: '#06101F', isik: [540, 800, '#FF8A4A', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 9.8, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'kopru', 'KÖPRÜDEYSEN', '#FF8A4A');
    // A) panik freni: önde mavi araç sert frenler, arkadan kırmızı çarpar
    const yB = 20, yR = 330 - 215 * MO.E.outCubic(MO.ar(t, .5, 2.2)), hit = t > 2.2, sh = hit ? Math.sin(t * 50) * 5 * Math.exp(-(t - 2.2) * 5) : 0;
    let aIc = yolKopru(t) + `<path d="M-32 ${yB + 70} V${yB + 250}" stroke="#14171F" stroke-width="10" opacity=".55"/><path d="M32 ${yB + 70} V${yB + 250}" stroke="#14171F" stroke-width="10" opacity=".55"/>` + oto(-6 + sh, yB, '#3E8EDE', t > .5, hit ? -2 : 0) + oto(-6 - sh, yR + 130, '#E8323C', t > .5);
    if (hit) aIc += `<g opacity="${Math.max(0, 1 - (t - 2.2) / 1.0).toFixed(2)}"><path d="M-6 ${yB + 62} l-30 -20 l16 -4 l-10 -24 l28 14 l10 -22 l8 24 l24 -10 l-12 26 l24 6Z" fill="#FFD23F"/></g>`;
    aIc += `<g opacity="${MO.ar(t, .5, 1.0).toFixed(2)}">` + zamanChip('ARKANDAN ÇARPARLAR', 270, -170, '#E8323C', '#FFFFFF', 26) + `</g>`;
    o += PK(t, .15, 3.05, aIc) + BN(t, .25, 3.05, 'x', 'PANİK FRENİ');
    // B) yavaşla, sağa yanaş, içeride bekle
    const mv = MO.E.inOutCubic(MO.ar(t, 3.7, 5.3)), yc = 240 - 250 * MO.E.outCubic(MO.ar(t, 3.2, 5.3)), xc = -6 + 188 * mv, dur = t > 5.4;
    let bIc = yolKopru(t) + oto(xc, yc * 0 + 120 + (dur ? 0 : -60 * (1 - MO.E.outCubic(MO.ar(t, 3.2, 5.3)))), '#3E8EDE', t > 4.0 && t < 5.5, 0);
    if (dur) bIc += `<g opacity="${(Math.sin(t * 9) > 0 ? 1 : .15)}"><circle cx="${xc - 30}" cy="${120 - 62}" r="10" fill="#FFB02E"/><circle cx="${xc + 30}" cy="${120 - 62}" r="10" fill="#FFB02E"/><circle cx="${xc - 30}" cy="${120 + 62}" r="10" fill="#FFB02E"/><circle cx="${xc + 30}" cy="${120 + 62}" r="10" fill="#FFB02E"/></g>`;
    bIc += `<path d="M-6 240 Q-6 140 ${xc} 120" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-dasharray="14 12" opacity="${(1 - MO.ar(t, 5.3, 5.6)).toFixed(2)}"/>`;
    o += PK(t, 3.1, 6.7, bIc + (dur ? `<g>` + zamanChip('İÇERİDE BEKLE', -250, 60, '#1F9E5B', '#FFFFFF', 30) + `</g>` : '')) + BN(t, 3.2, 6.7, 'v', 'YAVAŞLA · SAĞA YANAŞ · BEKLE', 46);
    // C) bitince köprüde durma
    const go = MO.E.inCubic(MO.ar(t, 7.0, 8.2));
    let cIc = yolKopru(t) + R(-190, -320, 440, 110, 0, '#6AA85A') + oto(182, 150 - 480 * go, '#3E8EDE', false);
    o += PK(t, 6.75, 8.3, cIc) + BN(t, 6.85, 8.3, 'v', 'BİTİNCE KÖPRÜDE DURMA');
    // D) hasarlıysa kullanma
    const dIc = yolKopru(t) + `<path d="M-190 10 L-80 -20 L10 30 L100 -10 L250 20" stroke="#14171F" stroke-width="18" fill="none" stroke-linejoin="round"/>` + [-120, 20, 140].map(x => `<path d="M${x} 80 l-18 -52 h36Z" fill="#FF8A4A"/>`).join('') + `<g transform="translate(40 -170)">` + isaretX(0, 0, 2.0) + `</g>` + zamanChip('HASARLI KÖPRÜ', 330, -200, '#E8323C', '#FFFFFF', 28);
    o += PK(t, 8.25, undefined, dIc) + BN(t, 8.35, undefined, 'x', 'HASARLIYSA KULLANMA');
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: t < 3 ? 'korku' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""

# 09 — SOKAK A (68,0–74,9): asıl tehlike tepen (0,2–2,2) · cam 2,5 · tabela 3,0 · saçak 3,6 · baca 4,05 · herkes bina dibine koşuyor ✕ (4,6) · sakın 6,4
S[9] = r"""
const bina9 = (x, w, yt, renk, pen) => { let o = R(x, yt, w, 1130 - yt, 0, renk) + R(x - 6, yt - 8, w + 12, 14, 3, '#14182A'); for (let r = 0; (yt + 56 + r * 108) < 1060; r++) for (let c = 0; c < Math.floor((w - 20) / 82); c++) o += R(x + 22 + c * 82, yt + 56 + r * 108, 46, 62, 6, pen, .85); return o; };
MO.sahne({
  zemin: MO.zemin({ ust: '#101A38', alt: '#06080F', isik: [540, 760, '#FF8A4A', .14], ikinci: [900, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.9, 'kamera']],
  sarsinti: [[.1, 8]],
  ciz: t => {
    let o = yBas(t, 'sokak', 'SOKAKTAYSAN', '#FF8A4A');
    const tit = Math.sin(t * 50) * 2.5 * (t < 4.8 ? 1 : Math.exp(-(t - 4.8) * 3));
    // arka plan binalar + ana binalar
    o += `<g transform="translate(${tit} 0)">` + bina9(300, 150, 700, '#1A2347', '#2A3A6A') + bina9(640, 150, 650, '#1A2347', '#2A3A6A') + bina9(-40, 340, 520, '#2A3A6A', '#FFE9A8') + bina9(780, 340, 470, '#3A4A7A', '#FFE9A8') +
      R(40, 760, 262, 16, 4, '#8A4A3A') + R(786, 730, 140, 54, 6, '#0B1433') + txt('BAKKAL', 856, 768, 28, '#FFD23F') + R(960, 420, 40, 64, 4, '#6A3A2A') + `</g>`;
    o += R(-100, 1130, 1280, 220, 0, '#1C2340') + R(-100, 1122, 1280, 14, 0, '#2A3354');
    // 1) tepen uyarısı
    const up = MO.E.outCubic(MO.ar(t, .3, .9)) * (1 - MO.ar(t, 2.2, 2.6));
    if (up > 0) { o += `<g opacity="${up.toFixed(2)}">` + [300, 540, 780].map((x, i) => `<path d="M${x} ${640 - (Math.sin(t * 6 + i) + 1) * 14} l-34 50 h68Z" fill="#FFD23F"/>`).join('') + `</g>`; }
    o += MO.sar(zamanChip('TEHLİKE: TEPENDEN', 0, 0, '#E8323C', '#FFFFFF', 34), MO.oge(t, { gir: .5, cik: 2.4, agirlik: 'orta', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 560, { golge: false });
    // 2) düşen nesneler
    const dus = (t0, d, [x0, y0], [x1, y1], rt, ic, ad, cx, cy) => {
      const q = t - t0; let r = '';
      if (q > -.35 && q < 0) r += `<circle cx="${x0}" cy="${y0}" r="${(40 + (q + .35) * 90).toFixed(0)}" fill="none" stroke="#FF8A4A" stroke-width="6" opacity="${(1 + q * 2.8).toFixed(2)}"/>`;
      if (q >= 0) { const p = MO.cl(q / d), x = x0 + (x1 - x0) * p, y = y0 + (y1 - y0) * p * p, fade = q > d + 1.0 ? Math.max(0, 1 - (q - d - 1.0) * 2) : 1; r += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rt * p).toFixed(1)})" opacity="${fade.toFixed(2)}">${ic}</g>`; if (q > d && q < d + .7) { const z = (q - d) / .7; r += `<ellipse cx="${x1}" cy="${y1 + 8}" rx="${(30 + z * 90).toFixed(0)}" ry="${(8 + z * 12).toFixed(0)}" fill="#C8D0DC" opacity="${(.5 * (1 - z)).toFixed(2)}"/>`; } }
      return r + MO.sar(zamanChip(ad, 0, 0, '#E8323C', '#FFFFFF', 30), MO.oge(t, { gir: t0 - .3, cik: t0 + d + .4, agirlik: 'hafif', giris: 'yuksel', x: cx }), cx, cy, { golge: false });
    };
    o += dus(2.5, .85, [210, 640], [360, 1110], 200, `<g transform="scale(1.7)">` + R(-26, -34, 52, 68, 4, '#BFE0FF', .9) + `<path d="M-26 -34 L0 0 L26 -34 M0 0 V34" stroke="#FFFFFF" stroke-width="3" opacity=".8"/></g>`, 'CAM', 230, 560);
    o += dus(3.0, .85, [856, 758], [700, 1105], -40, `<g transform="scale(1.5)">` + R(-70, -26, 140, 52, 6, '#0B1433') + txt('BAKKAL', 0, 10, 26, '#FFD23F') + `</g>`, 'TABELA', 830, 560);
    o += dus(3.55, .8, [180, 770], [420, 1108], 150, R(-150, -14, 300, 28, 5, '#8A4A3A'), 'SAÇAK', 300, 650);
    o += dus(4.05, .85, [980, 450], [880, 1100], 240, `<g transform="scale(1.6)">` + R(-24, -32, 48, 64, 4, '#6A3A2A') + R(-14, -20, 28, 14, 2, '#3A1F16') + `</g>`, 'BACA', 880, 380);
    // 3) bina dibine koşan kalabalık ✕
    const kos = MO.E.inOutCubic(MO.ar(t, 4.7, 6.4)), xs = [700, 600, 500];
    if (t > 4.5) { o += `<g opacity="${MO.ar(t, 4.5, 5.0).toFixed(2)}"><rect x="-40" y="1000" width="380" height="130" fill="#E8323C" opacity=".22"/><path d="M-40 1130 L340 1000" stroke="#E8323C" stroke-width="4" opacity=".6"/></g>`; xs.forEach((x, i) => { o += ins(x - kos * (300 + i * 20), 1130, 1.0, { renk: ['#3E8EDE', '#FBAC39', '#2FBF71'][i], poz: 'kos', yon: -1, sal: Math.sin(t * 14 + i) * 3 }); }); }
    else xs.forEach((x, i) => { o += ins(x, 1130, 1.0, { renk: ['#3E8EDE', '#FBAC39', '#2FBF71'][i], poz: 'dur', sal: Math.sin(t * 40 + i) * 1.5 }); });
    o += BN(t, 5.0, undefined, 'x', 'BİNA DİBİNE KOŞMA', 54, 1215);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'saskin', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 10 — SOKAK B (74,9–79,8): parka · meydana · okul bahçesine geç ✓ (0,05–2,3) · direkten · kablodan · yamaçtan uzak dur ✕ (2,4–4,9)
S[10] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#101A38', alt: '#06080F', isik: [540, 760, '#FF8A4A', .12] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 4.9, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'sokak', 'SOKAKTAYSAN', '#FF8A4A');
    const kart = (x, g, ic, ad, tur) => { const p = MO.E.outCubic(MO.ar(t, g, g + .35)); return p <= 0 ? '' : `<g transform="translate(${x} 0) scale(${(.85 + .15 * p).toFixed(3)})" opacity="${p.toFixed(2)}">` + R(-140, -250, 280, 500, 28, '#16264C') + ic + txt(ad, 0, 214, 34, '#FFF6E6') + (tur === 'v' ? isaretV(100, -206, 1.0) : isaretX(100, -206, 1.0)) + `</g>`; };
    const agac = (x, y, s = 1) => R(x - 8 * s, y - 20 * s, 16 * s, 60 * s, 4, '#6A4A2A') + `<circle cx="${x}" cy="${y - 52 * s}" r="${46 * s}" fill="#2FA05A"/><circle cx="${x - 28 * s}" cy="${y - 28 * s}" r="${32 * s}" fill="#38B368"/>`;
    const a = R(-460, -320, 920, 640, 36, '#0C1228', 0) +
      kart(-300, .1, R(-130, 120, 260, 100, 0, '#4C8A4A') + agac(-70, 120, 1.0) + agac(60, 130, .8), 'PARK', 'v') +
      kart(0, .75, R(-130, 120, 260, 100, 0, '#8A94A8') + `<circle cx="0" cy="40" r="46" fill="#3E8EDE"/><path d="M-30 30 Q0 -40 30 30" stroke="#BFE0FF" stroke-width="6" fill="none"/><ellipse cx="0" cy="96" rx="96" ry="22" fill="none" stroke="#C8D0DC" stroke-width="5" stroke-dasharray="10 8"/>`, 'MEYDAN', 'v') +
      kart(300, 1.25, R(-130, 120, 260, 100, 0, '#6AA85A') + R(-86, -10, 172, 130, 6, '#E8B84A') + `<path d="M-100 -10 L0 -80 L100 -10Z" fill="#B8463A"/>` + R(-14, 60, 28, 60, 3, '#7A4A2A') + R(-60, 20, 30, 30, 4, '#7FB0E0') + R(30, 20, 30, 30, 4, '#7FB0E0') + R(60, -120, 6, 90, 2, '#C8D0DC') + R(66, -118, 40, 24, 2, '#E8323C'), 'OKUL BAHÇESİ', 'v');
    o += PK(t, .05, 2.35, a) + BN(t, .15, 2.35, 'v', 'AÇIK ALANA GEÇ');
    const zap = Math.sin(t * 22) > .3 ? 1 : .2;
    const b = kart(-300, 2.5, R(-9, -200, 18, 360, 6, '#8A94A8') + R(-70, -190, 140, 12, 4, '#8A94A8') + `<path d="M-70 -184 Q-30 -130 -60 -80" stroke="#1A1A22" stroke-width="5" fill="none"/><path d="M40 -60 l-18 34 h16 l-12 40 l34 -50 h-18 l16 -24Z" fill="#FFD23F" opacity="${zap}"/>`, 'DİREK', 'x') +
      kart(0, 3.15, `<path d="M-120 -140 Q0 -30 120 -140" stroke="#1A1A22" stroke-width="7" fill="none"/><path d="M-120 -90 Q0 20 120 -90" stroke="#1A1A22" stroke-width="7" fill="none"/><path d="M-10 -40 l-18 34 h16 l-12 40 l34 -50 h-18 l16 -24Z" fill="#FFD23F" opacity="${zap}"/>` + R(-130, -150, 14, 200, 3, '#8A94A8') + R(116, -150, 14, 200, 3, '#8A94A8'), 'KABLO', 'x') +
      kart(300, 3.8, `<path d="M-130 160 L-130 40 L-20 -60 L130 -140 L130 160Z" fill="#7A6A4A"/>` + [[-10, -30], [40, -70]].map(([x, y], i) => `<circle cx="${x}" cy="${(y + ((t * 90 + i * 70) % 160)).toFixed(0)}" r="${16 - i * 3}" fill="#9A8A6A"/>`).join(''), 'YAMAÇ', 'x');
    o += PK(t, 2.4, undefined, b) + BN(t, 2.5, undefined, 'x', 'DİREK · KABLO · YAMAÇTAN UZAK DUR', 34);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""

# 11 — EV A (79,8–87,3): önce gümbürtü (0–2,8) · saniyeler sonra asıl sarsıntı (3,1) · herkes aynı hatayı yapacak: koşar (5,5)
S[11] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1A1228', alt: '#07060E', isik: [540, 800, '#FF8A4A', .16] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 7.4, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'ev', 'EVDEYSEN', '#FF8A4A');
    const amp = t < 3.15 ? 9 * MO.E.outCubic(MO.ar(t, .1, .8)) : 70 * (1 - .15 * MO.ar(t, 3.15, 7.3)), sh = t < 3.15 ? amp * .12 : amp * .13;
    // sismograf şeridi
    let d = ''; const cur = MO.cl((t - .2) / 6.9) * 840; for (let x = 0; x <= cur; x += 6) { const tt = .2 + x / 840 * 6.9, a = tt < 3.15 ? 9 * MO.E.outCubic(MO.cl((tt - .1) / .7)) : 70 * (1 - .15 * MO.cl((tt - 3.15) / 4)); d += (x ? ' L' : 'M') + (100 + x) + ' ' + (630 + a * .9 * Math.sin(x * .55 + tt * 6) * Math.sin(x * .13)).toFixed(1); }
    o += R(70, 520, 940, 220, 28, '#0F1838') + `<path d="M90 630 H990" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="3"/><path d="${d}" stroke="#FF8A4A" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
    o += MO.sar(zamanChip('GÜMBÜRTÜ', 0, 0, '#0B1433', '#FFD23F', 28), MO.oge(t, { gir: .7, agirlik: 'hafif', giris: 'yuksel', x: 300 }), 250, 570, { golge: false });
    o += MO.sar(zamanChip('ASIL SARSINTI', 0, 0, '#E8323C', '#FFFFFF', 30), MO.oge(t, { gir: 3.2, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 760 }), 770, 570, { golge: false });
    // oda
    const ox = Math.sin(t * 41) * sh, oy = Math.sin(t * 33 + 1) * sh * .5;
    const kos = MO.ar(t, 5.6, 7.2), px = 460 + 340 * MO.E.inOutCubic(kos);
    let r = R(120, 780, 840, 350, 14, '#2A3456') + R(120, 1100, 840, 40, 0, '#4A5578') + R(160, 820, 150, 160, 8, '#7FB0E0') + R(166, 826, 138, 148, 6, '#BFE0FF', .5) + R(850, 840, 100, 260, 6, '#5A3A22') + R(862, 852, 76, 236, 4, '#7A4A2A') +
      R(470, 840, 120, 10, 4, '#8A94A8') + `<g transform="rotate(${(Math.sin(t * 7) * (t > 3.1 ? 14 : 2)).toFixed(1)} 530 850)"><path d="M530 850 V910" stroke="#8A94A8" stroke-width="5"/><path d="M500 940 L530 900 L560 940Z" fill="#FFD23F"/></g>` +
      R(330, 1050, 190, 50, 10, '#B8463A') + R(330, 1010, 190, 50, 14, '#C85A4A') + (t < 4.3 ? R(350, 880, 70, 90, 4, '#FFFFFF') + R(356, 886, 58, 78, 3, '#3E8EDE') : `<g transform="translate(${(385 - 30 * MO.ar(t, 4.3, 4.9)).toFixed(0)} ${(925 + 190 * MO.E.inCubic(MO.ar(t, 4.3, 4.9))).toFixed(0)}) rotate(${(70 * MO.ar(t, 4.3, 4.9)).toFixed(0)})">${R(-35, -45, 70, 90, 4, '#FFFFFF')}${R(-29, -39, 58, 78, 3, '#3E8EDE')}</g>`) +
      ins(px, 1100, 1.0, { renk: '#FBAC39', poz: t > 5.6 ? 'kos' : 'dur', sal: Math.sin(t * 38) * (t > 3.1 && t < 5.6 ? 2.5 : 0.8) });
    o += `<g transform="translate(${ox.toFixed(1)} ${oy.toFixed(1)})">` + r + `</g>`;
    o += MO.sar(zamanChip('ÇIKIŞ', 0, 0, '#1F9E5B', '#FFFFFF', 26), MO.oge(t, { gir: 5.5, agirlik: 'hafif', giris: 'yuksel', x: 900 }), 900, 800, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: t > 3.1 ? 'saskin' : 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 12 — EV B (87,3–91,0): koşmak (0,1) · balkon (1,0) · asansör (1,85) · merdiven (2,85) — dört ✕ kart
S[12] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#1A1228', alt: '#07060E', isik: [540, 800, '#E8323C', .14] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 3.7, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'ev', 'EVDEYSEN', '#FF8A4A');
    const kart = (x, y, g, ic, ad) => MO.sar(R(-200, -150, 400, 300, 30, '#16264C') + ic + txt(ad, 0, 118, 44, '#FFF6E6') + `<g transform="translate(150 -110)">` + isaretX(0, 0, 1.5) + `</g>`, MO.oge(t, { gir: g, agirlik: 'agir', giris: 'damga', materyal: 'lastik', x }), x, y, { golge: false });
    o += kart(310, 700, .1, ins(-20, 60, .72, { renk: '#3E8EDE', poz: 'kos' }) + ins(70, 60, .72, { renk: '#FBAC39', poz: 'kos' }), 'KOŞMAK');
    o += kart(770, 700, 1.0, R(-130, -10, 260, 12, 0, '#8A94A8') + [-110, -50, 10, 70, 130].map(x => R(x, -70, 8, 60, 2, '#C8D0DC')).join('') + R(-130, -76, 260, 10, 4, '#C8D0DC') + R(-150, 6, 300, 40, 0, '#3A4A7A'), 'BALKON');
    o += kart(310, 1060, 1.85, R(-70, -80, 140, 150, 8, '#8A94A8') + R(-60, -70, 56, 130, 4, '#C8D0DC') + R(4, -70, 56, 130, 4, '#C8D0DC') + `<path d="M-100 -40 l0 -30 M-114 -56 l14 -16 l14 16 M-100 40 l0 30 M-114 56 l14 16 l14 -16" stroke="#FFD23F" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(190 0)"/>`, 'ASANSÖR');
    o += kart(770, 1060, 2.85, [0, 1, 2, 3, 4].map(i => R(-130 + i * 50, 50 - i * 30, 70, 30 + i * 30, 0, i % 2 ? '#8A94A8' : '#A0AABC')).join(''), 'MERDİVEN');
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'saskin', bakHedef: [540, 900] })
});"""
# 13 — EV C (91,0–94,3): sağlam masanın altına çök (0,15) · kapan (2,1) · tutun (2,75)
S[13] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#14201C', alt: '#060A09', isik: [540, 800, '#2FBF71', .14] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 3.3, 'kamera']],
  sarsinti: [[.1, 6]],
  ciz: t => {
    let o = yBas(t, 'ev', 'EVDEYSEN', '#FF8A4A');
    const sh = Math.sin(t * 38) * 4;
    const gir = MO.E.inOutCubic(MO.ar(t, .3, 1.0)), px = -250 + 250 * gir;
    const poz = t < .9 ? 'dur' : 'cok';
    const ic = R(-460, 190, 920, 130, 0, '#3A4A7A') + `<g transform="translate(0 190) scale(1.55) translate(0 -190)">` + `<g transform="translate(${sh.toFixed(1)} 0)">` + R(-270, 0, 540, 26, 8, '#B8884A') + R(-250, 26, 26, 164, 4, '#9A6A3A') + R(224, 26, 26, 164, 4, '#9A6A3A') + R(-250, 40, 500, 8, 0, '#9A6A3A', .0) +
      (t > 2.7 ? `<circle cx="237" cy="120" r="14" fill="#F2C9A0"/>` : '') + `</g>` + ins(px + sh * .5, 190, .7, { renk: '#3E8EDE', poz }) + (t > 2.7 ? `<path d="M${px + 20} 118 L224 120" stroke="#3E8EDE" stroke-width="12" stroke-linecap="round"/>` : '') + `</g>`;
    o += PK(t, .1, undefined, ic);
    const adim = (g, n, ad) => MO.sar(R(-290, -50, 580, 100, 50, '#1F9E5B') + `<circle cx="-236" cy="0" r="34" fill="#FFFFFF"/>` + txt(String(n), -236, 16, 46, '#1F9E5B') + txt(ad, 30, 18, 52, '#FFFFFF'), MO.oge(t, { gir: g, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1170 + (n - 1) * 0, { golge: false });
    o += BN(t, .2, 1.95, 'v', '1 · ÇÖK', 56) + BN(t, 2.0, 2.65, 'v', '2 · KAPAN', 56) + BN(t, 2.7, undefined, 'v', '3 · TUTUN', 56);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 14 — EV D (94,3–97,7): gazı (0,05) · elektriği (1,0) · suyu kapat (1,7) · sonra çık (2,6)
S[14] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#14201C', alt: '#060A09', isik: [540, 800, '#2FBF71', .14] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.03, 540, 960, 3.4, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'ev', 'EVDEYSEN', '#FF8A4A');
    const kart = (x, g, ic, ad, k) => { const p = MO.E.outCubic(MO.ar(t, g, g + .35)); return p <= 0 ? '' : `<g transform="translate(${x} 0) scale(${(.85 + .15 * p).toFixed(3)})" opacity="${p.toFixed(2)}">` + R(-140, -250, 280, 500, 28, '#16264C') + ic + txt(ad, 0, 214, 36, '#FFF6E6') + (k > .8 ? isaretV(100, -206, 1.0) : '') + `</g>`; };
    const rot = k => k * 90;
    const k1 = MO.E.outCubic(MO.ar(t, .55, 1.0)), k2 = MO.E.outCubic(MO.ar(t, 1.4, 1.8)), k3 = MO.E.outCubic(MO.ar(t, 2.0, 2.4));
    const gaz = R(-110, 20, 220, 30, 12, '#8A94A8') + R(-12, -40, 24, 64, 4, '#8A94A8') + `<g transform="rotate(${rot(k1)} 0 -40)">` + R(-70, -52, 140, 20, 10, '#E8323C') + `</g>` + `<path d="M-70 -60 Q-82 -110 -56 -140 Q-52 -108 -30 -96 Q-34 -128 -10 -150 Q16 -112 -4 -60Z" fill="#FF8A4A" opacity="${(1 - k1).toFixed(2)}"/>`;
    const elk = R(-80, -150, 160, 270, 14, '#8A94A8') + R(-60, -130, 120, 230, 8, '#2A3354') + R(-16, -90, 32, 150, 10, '#0B1433') + R(-22, -90 + 100 * k2, 44, 50, 10, k2 > .5 ? '#E8323C' : '#2FBF71') + `<path d="M-30 -118 l-12 22 h12 l-8 24 l24 -30 h-12 l10 -16Z" fill="#FFD23F" opacity="${(1 - k2).toFixed(2)}"/>`;
    const su = R(-110, -20, 190, 30, 12, '#8A94A8') + R(-100, -70, 30, 56, 4, '#8A94A8') + `<path d="M80 -20 H112 V30" stroke="#8A94A8" stroke-width="30" fill="none" stroke-linecap="round"/>` + `<g transform="rotate(${rot(k3)} -20 -90)">` + R(-70, -100, 100, 18, 9, '#3E8EDE') + `</g>` + [0, 1, 2].map(i => `<path d="M112 ${60 + ((t * 120 + i * 40) % 120)} q-9 14 0 22 q9 -8 0 -22Z" fill="#7FD0FF" opacity="${(1 - k3).toFixed(2)}"/>`).join('');
    const ic = R(-460, -320, 920, 640, 36, '#0C1228', 0) + kart(-300, .1, gaz, 'GAZ', k1) + kart(0, 1.0, elk, 'ELEKTRİK', k2) + kart(300, 1.7, su, 'SU', k3);
    o += PK(t, .05, 2.55, ic);
    o += BN(t, .15, 2.55, 'v', 'GAZ · ELEKTRİK · SU: KAPAT', 48);
    // sonra çık
    const dr = MO.E.outCubic(MO.ar(t, 2.65, 3.1));
    o += PK(t, 2.6, undefined, R(-460, -320, 920, 640, 36, '#0C1228', 0) + R(-30, -250, 220, 470, 10, '#5A3A22') + `<path d="M-30 -250 L${(-30 + 200 * dr).toFixed(0)} -220 L${(-30 + 200 * dr).toFixed(0)} 190 L-30 220Z" fill="#7A4A2A"/>` + R(190 - 200 * dr, -240, 200 * dr, 20, 0, '#1F9E5B', 0) + ins(-190 + 220 * dr, 215, .95, { renk: '#FBAC39', poz: 'dur' }) + `<path d="M-330 -10 H-240" stroke="#FFFFFF" stroke-width="8" stroke-dasharray="14 12" opacity="0"/>`) + BN(t, 2.7, undefined, 'v', 'SONRA ÇIK', 58);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1640, boy: 120, duygu: 'merak', bakHedef: [540, 900] }) + gufi(t, { x: 200, y: 1790, boy: 170, duygu: 'merak', bakHedef: [540, 900] })
});"""

# 15 — STORY'NE AT (97,7–101,5): beş yerin beş kuralı tek kartta; paylaşılabilir; kâğıt uçak
S[15] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#15403A', alt: '#0A1E1C', isik: [540, 1000, '#2FBF71', .20], ikinci: [900, 1500, '#FF8A4A', .10] }),
  kamera: [[0, 1.05, 540, 960], [.05, 1.0, 540, 960, 1.6, 'kamera']],
  ciz: t => {
    const satirlar = [['vapur', 'VAPUR', 'SIKICA TUTUN · KAPTANI DİNLE'], ['metro', 'METRO', 'RAYA İNME · TUTUN, BEKLE'], ['kopru', 'KÖPRÜ', 'PANİK FRENİ YOK · SAĞA YANAŞ'], ['sokak', 'SOKAK', 'BİNA DİBİNE KOŞMA · AÇIK ALAN'], ['ev', 'EV', 'ÇÖK · KAPAN · TUTUN']];
    let kart = R(-440, -440, 880, 880, 44, '#0F1838') + R(-440, -440, 880, 120, 44, '#E8323C') + R(-440, -380, 880, 60, 0, '#E8323C') + txt('DEPREMDE NEREDESİN?', 0, -358, 56, '#FFFFFF');
    satirlar.forEach(([tur, ad, kural], i) => {
      const p = MO.E.outCubic(MO.ar(t, .35 + i * .22, .7 + i * .22)); if (p <= 0) return;
      const y = -230 + i * 144;
      kart += `<g opacity="${p.toFixed(2)}" transform="translate(${((1 - p) * 40).toFixed(0)} 0)">` + R(-410, y - 60, 820, 124, 24, '#16264C') + ikon(tur, -330, y + 6, .62) + `<text class="mono" x="-228" y="${y - 12}" font-size="26" letter-spacing="4" style="fill:#FFD23F">${ad}</text><text x="-228" y="${y + 36}" font-size="38" font-weight="900" style="fill:#FFF6E6">${kural}</text>` + `</g>`;
    });
    let o = MO.sar(`<g transform="scale(.93)">` + kart + `</g>`, MO.oge(t, { gir: .05, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 775, { golge: true });
    o += MO.sar(etiket('STORY\'NE AT', 0, 0, '#FFD23F', '#1B2440', 54, -3, 1), MO.oge(t, { gir: 1.4, agirlik: 'kahraman', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 1225, { golge: false });
    const u = MO.E.inOutCubic(MO.ar(t, 2.4, 3.3));
    if (u > 0) o += `<g transform="translate(${(760 + 330 * u).toFixed(0)} ${(1150 - 200 * u - 100 * Math.sin(Math.PI * u)).toFixed(0)}) rotate(${(-25 + 20 * u).toFixed(0)})" opacity="${(1 - MO.ar(t, 3.2, 3.5)).toFixed(2)}"><path d="M-50 0 L50 -30 L10 40 L0 10Z" fill="#FFFFFF"/><path d="M0 10 L50 -30" stroke="#C8D0DC" stroke-width="4"/></g>`;
    MO.olay('ucus', 2.4, { x: 540, agirlik: 'hafif' });
    return o;
  },
  onCiz: t => gubi(t, { x: 900, y: 1640, boy: 110, duygu: 'merak', bakHedef: 'kamera' }) + gufi(t, { x: 180, y: 1790, boy: 160, duygu: 'merak', bakHedef: [540, 900] })
});"""
# 16 — TAKİP (101,5–104,6)
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
