S = {}
# 01 — KANCA: İLK KARE su basan ev + önünde DASK kalkanı; su kalkanın üstüne çıkar → "ÖDEMİYOR" damgası
S[1] = r"""
$('zemin').innerHTML = zeminK('#1A2A50', '#0B1428');
window.renderAt = t => {
  let o = SL.bulut(250, 430, 1.2, '#3A4A6E') + SL.bulut(830, 400, 1.4, '#34446A') + SL.yagmur(t, { n: 70, op: .4, y0: 380, y1: 1250 });
  o += ev(540, 1100, 1.55);
  o += daskKalkan(540, 960, 1.35 + .03 * Math.sin(t * 3));
  const sy = 1180 - 300 * E(A(t, 0, 3.1));
  o += suY(sy, t, .85);
  if (t > 3.1) o += etiket('ÖDEMİYOR', 540, 700, '#E8323C', '#FFFFFF', 92, -8, pop(t, 3.1, .3));
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 960] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'saskin', bakHedef: [540, 960] });
  $('dinamik').innerHTML = o + bam(t, 3.1, .25);
};"""
# 02 — GÜNDEM + DASK: İstanbul silüeti + 1.277 su baskını → DASK kartı (deprem ✓ / sel ✕) → konut sigortası poliçesi, "SEL VE SU BASKINI" satırı
S[2] = r"""
$('zemin').innerHTML = zeminK('#1A2A50', '#0B1428');
window.renderAt = t => {
  let o = '';
  if (t < 3.2) {
    o += SE.siluet(t, 1000) + suY(960 - 40 * E(A(t, 0, 3.2)), t, .8);
    const n = Math.round(1277 * E(A(t, .2, 2.6)));
    o += grp(R(-260, -110, 520, 220, 34, '#0B1433', .85) + txt(n.toLocaleString('tr-TR'), 0, 30, 120, '#FFFFFF') + `<text class="mono" x="0" y="82" font-size="26" text-anchor="middle" letter-spacing="3" style="fill:#7FD0FF">SU BASKINI İHBARI</text>`, 540, 600, pop(t, .2));
    o += grp(AU.cip('İSTANBUL · 14 EKİM', 0, 0, '#FFFFFF', '#1B2440', 28), 540, 420, pop(t, .1));
  } else if (t < 6.1) {
    const p = pop(t, 3.25);
    let k = R(-330, -330, 660, 660, 40, '#000', .3) + R(-340, -340, 660, 660, 40, '#FFF8EE') + daskKalkan(-10, -150, 1.1);
    k += deprem(-130, 90, 1.1) + `<text x="-20" y="104" font-size="40" font-weight="900" style="fill:#1B2440">DEPREM</text>` + isaretV(230, 90, 1.1);
    if (t > 4.1) k += `<g opacity="${A(t, 4.1, 4.4)}"><path d="M-170 200 q20 -24 40 0 t40 0 t40 0" stroke="${SE.SU}" stroke-width="10" fill="none" stroke-linecap="round"/><text x="-20" y="222" font-size="40" font-weight="900" style="fill:#1B2440">SEL</text>` + isaretX(230, 205, 1.1) + '</g>';
    o += grp(k, 540, 820, p);
  } else {
    o += grp(AU.cip('DASK = SADECE DEPREM', 0, 0, '#2E78C8', '#FFFFFF', 30), 540, 420, pop(t, 6.15));
    const vk = E(A(t, 8.7, 9.3)), d = t > 10.6 ? 1 : 2;
    o += grp(police(0, 0, 760, 'KONUT SİGORTASI', [['Yangın', 1], ['Hırsızlık', 1], ['Cam kırılması', 1], ['SEL VE SU BASKINI', d]], '#2FA060', 3, vk), 540, 840, pop(t, 6.15));
    if (t > 10.6) o += etiket('TEMİNAT VARSA ÖDER', 540, 1180, '#FFD23F', '#1B2440', 44, -2, pop(t, 10.6));
  }
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 800] });
  $('dinamik').innerHTML = o + bam(t, 3.2, .25) + bam(t, 6.1, .25);
};"""
# 03 — ARABA: Gubi'ye soru (yakın plan, düşünür, umutlanır → "Hayır" üzülür) → trafik sigortası: karşı taraf ✓ / senin araban ✕ → kasko + sel teminatı ✓
S[3] = r"""
$('zemin').innerHTML = zeminK('#1E2A48', '#0B1428');
const sahne = t => { let o = R(0, 1060, 1080, 300, 0, '#2A3450') + suY(1100, t, .7);
  o += SE.araba(330, 1110, 1.25, { renk: '#E8323C', rot: -2 }) + SE.araba(780, 1110, 1.1, { renk: '#3E8EDE' });
  o += AU.cip('SENİN ARABAN', 330, 1220, '#FFFFFF', '#1B2440', 24) + AU.cip('KARŞI TARAF', 780, 1220, '#FFFFFF', '#1B2440', 24); return o; };
window.renderAt = t => {
  const yk = M.yakinlas(t, 0, 3.3, .5);
  let o = M.bulanikSar(sahne(t), yk);
  if (t > 3.35) {
    if (t < 4.2) {
      o += grp(police(0, 0, 640, 'TRAFİK SİGORTASI', [['Karşı tarafın zararı', 1], ['Senin araban', 0]], '#5A6478'), 540, 640, pop(t, 3.35, .3));
      o += isaretX(330, 960, 1.3);
    } else {
      o += grp(police(0, 0, 640, 'KASKO', [['Çarpma, çalınma', 1], ['SEL TEMİNATI', t > 6.0 ? 1 : 2]], '#E8A020', 1, E(A(t, 4.7, 5.2))), 540, 640, pop(t, 4.2, .3));
      if (t > 6.0) o += KP.kalkan(330, 960, .9, '#2FBF71') + isaretV(330, 960, 1.1);
    }
  }
  o += takipCip(t, 3.4, 6.6);
  if (t > .6 && t < 3.2) o += grp(M.balon(0, 0, txt('ÖDER Mİ?', 0, 18, 48, '#1B2440'), { w: 300, h: 110, yon: -1 }), 760, 560, pop(t, .9));
  const gb = { x: 880 + (540 - 880) * yk, y: 1600 + (900 - 1600) * yk, boy: 120 + 230 * yk };
  o += gufi(t, { x: 200, y: 1780, boy: 170, duygu: t > 6.0 ? 'mutlu' : 'merak', bakHedef: [540, 800] });
  o += gubi(t, Object.assign(gb, { duygu: 'merak', bakHedef: yk > .5 ? 'kamera' : [540, 800] }));
  $('dinamik').innerHTML = o + bam(t, 4.2, .2);
};"""
# 04 — KASKON YOKSA: taşan rögar (altyapı yetersiz) → belediye + terazi (dava) → ₺ TAZMİNAT
S[4] = r"""
$('zemin').innerHTML = zeminK('#1E2A48', '#0B1428');
window.renderAt = t => {
  let o = grp(AU.cip('KASKON YOKSA?', 0, 0, '#E8A020', '#1B2440', 36), 540, 420, pop(t, .1) * (1 - A(t, 2.9, 3.15)));
  if (t < 3.1) {
    o += grp(SE.rogar(-450, -260, 900, 520, t, 1) + SE.araba(-200, -20 + 5 * Math.sin(t * 2), .8, { renk: '#E8323C', rot: -4 }), 540, 780, pop(t, .3, .4));
    if (t > 1.1) o += etiket('ALTYAPI YETERSİZ', 540, 1110, '#E8323C', '#FFFFFF', 44, -2, pop(t, 1.1));
  } else {
    o += `<circle cx="540" cy="740" r="360" fill="#FFE0A0" opacity=".08"/>` + grp(belediye(0, 0, 1.1).replace(/<rect x="-3" y="-420"[^]*?#E30A17"\/>/, ''), 540, 910, pop(t, 3.15, .4)) + terazi(540, 440, .95 * pop(t, 3.5), 7 * Math.sin(t * 2.2));
    o += grp(AU.cip('BELEDİYEYE DAVA', 0, 0, '#FFFFFF', '#1B2440', 32), 540, 1005, pop(t, 3.3));
    if (t > 4.6) o += etiket('₺ TAZMİNAT', 540, 1110, '#2FBF71', '#FFFFFF', 52, -3, pop(t, 4.6));
    o += kredi('KAYNAK: GZT · 15.10.2026', 60, 1215);
  }
  o += gubi(t, { x: 880, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 800] }) + gufi(t, { x: 200, y: 1780, boy: 170, duygu: 'merak', bakHedef: [540, 800] });
  $('dinamik').innerHTML = o + bam(t, 3.1, .25);
};"""
# 05 — PAYLAŞ: telefon + kâğıt uçak "gönder", "BİLMEYEN BİRİNE GÖNDER"
S[5] = r"""
$('zemin').innerHTML = zeminK('#15403A', '#0A1E1C');
window.renderAt = t => {
  let tel = R(-170, -320, 340, 640, 46, '#1B2440') + R(-150, -290, 300, 560, 28, '#2A3456');
  tel += R(-120, -200, 240, 90, 20, '#FFF8EE') + `<text x="0" y="-145" font-size="28" font-weight="900" text-anchor="middle" style="fill:#1B2440">DASK SELİ</text><text x="0" y="-115" font-size="28" font-weight="900" text-anchor="middle" style="fill:#E8323C">ÖDEMİYOR!</text>`;
  tel += R(-120, -80, 240, 70, 20, '#2FBF71') + `<text x="0" y="-35" font-size="30" font-weight="900" text-anchor="middle" style="fill:#FFFFFF">GÖNDER</text>`;
  let o = grp(tel, 540, 860, pop(t, .05));
  const u = E(A(t, .5, 1.6));
  if (u > 0) o += `<g transform="translate(${540 + 360 * u} ${780 - 360 * u}) rotate(-20)" opacity="${1 - A(t, 1.6, 2.0)}"><path d="M-50 0 L50 -30 L10 40 L0 10Z" fill="#FFFFFF"/><path d="M0 10 L50 -30" stroke="#C8D0DC" stroke-width="4"/></g>`;
  o += grp(AU.cip('BİLMEYEN BİRİNE GÖNDER', 0, 0, '#2FBF71', '#FFFFFF', 34), 540, 430, pop(t, .1));
  o += gubi(t, { x: 880, y: 1600, boy: 130, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 200, y: 1780, boy: 180, duygu: 'mutlu', bakHedef: [540, 860] });
  $('dinamik').innerHTML = o;
};"""
# 06 — GUFİ'YE SORU: Gufi yakın planda gözünü kaçırır, arkasından buruşuk poliçe düşer → "Tahmin etmiştim" (Gubi başını sallar)
S[6] = r"""
$('zemin').innerHTML = zeminK('#3A2440', '#160E1C');
window.renderAt = t => {
  let o = '';
  const d = E(A(t, 1.8, 2.5));
  if (d > 0) { let p = `<path d="M-110 -150 L95 -140 L118 -40 L100 70 L120 150 L-100 160 L-120 60 L-95 -30Z" fill="#FFF8EE"/>`; for (let i = 0; i < 6; i++) p += `<path d="M${-80 + h(i) * 10} ${-110 + i * 42} L${70 - h(i + 3) * 20} ${-104 + i * 42}" stroke="#C8D0DC" stroke-width="7"/>`;
    p += `<text x="0" y="-118" font-size="22" font-weight="900" text-anchor="middle" style="fill:#2E78C8">POLİÇE</text><path d="M-100 -20 L100 30 M-80 80 L90 50" stroke="#B8A890" stroke-width="3"/>`;
    o += grp(p, 820, 700 + 420 * d, .9, -18 + 40 * d); }
  if (t > 2.6) o += grp(M.balon(0, 0, txt('…', 0, 6, 64, '#1B2440'), { w: 170, h: 100, yon: 1 }), 330, 640, pop(t, 2.6));
  o += gubi(t, { x: 900, y: 1560, boy: 130, duygu: 'merak', bakHedef: [540, 1000] });
  o += gufi(t, { x: 540, y: 1250, boy: 380, duygu: 'utangac', bakHedef: [1100, 800] });
  $('dinamik').innerHTML = o;
};"""
# 07 — 3 KURAL: başlık + 1-2-3 kartları (motor ✕ · fotoğraf/video + atma ✕ · 5 iş günü) → ekran görüntüsü alınabilir özet
S[7] = r"""
$('zemin').innerHTML = zeminK('#1A2340', '#0B1022');
const kartK = (n, ikon, b1, b2, renk, y, p, alt) => p <= 0 ? '' : grp(R(-450, -105, 900, 210, 34, '#000', .3) + R(-460, -115, 900, 210, 34, '#FFF8EE') + R(-460, -115, 150, 210, 34, renk) + R(-340, -115, 30, 210, 0, renk) +
  txt(String(n), -385, 30, 90, '#FFFFFF') + `<g transform="translate(-220 -10)">${ikon}</g>` + `<text x="-120" y="-10" font-size="40" font-weight="900" style="fill:#1B2440">${b1}</text>` + (alt ? `<text x="-120" y="45" font-size="27" font-weight="700" style="fill:#5A6478">${b2}</text>` : ''), 540, y, p);
window.renderAt = t => {
  let o = grp(AU.cip('HASAR OLUNCA 3 KURAL', 0, 0, '#FFD23F', '#1B2440', 36), 540, 420, pop(t, .1));
  const anahtar = `<rect x="-26" y="-50" width="52" height="66" rx="16" fill="#3A3F50"/><rect x="-7" y="10" width="14" height="50" fill="#8A94A8"/>` + isaretX(36, 34, .8);
  const kamera = `<rect x="-50" y="-34" width="100" height="70" rx="14" fill="#3A3F50"/><circle cx="0" cy="2" r="22" fill="#8AB0E0"/><rect x="-20" y="-46" width="40" height="16" rx="5" fill="#3A3F50"/>`;
  o += kartK(1, anahtar, 'MOTORU ÇALIŞTIRMA', t > 6.85 ? 'çekiciyle servise götür' : 'masraf 600 bin TL\'ye çıkabilir', '#E8323C', 600, pop(t, 1.17), t > 3.65);
  o += kartK(2, kamera, 'FOTOĞRAF + VİDEO ÇEK', 'eksper gelmeden hiçbir şeyi atma', '#2E78C8', 840, pop(t, 8.55), t > 10.9);
  o += kartK(3, `<rect x="-46" y="-50" width="92" height="96" rx="12" fill="#FFFFFF" stroke="#C8D0DC" stroke-width="4"/><rect x="-46" y="-50" width="92" height="28" rx="10" fill="#E8323C"/><rect x="-28" y="-62" width="8" height="22" rx="4" fill="#3A3F50"/><rect x="20" y="-62" width="8" height="22" rx="4" fill="#3A3F50"/><text x="0" y="34" font-size="52" font-weight="900" text-anchor="middle" style="fill:#1B2440">5</text>`, '5 İŞ GÜNÜNDE BİLDİR', 'sigortana / acentene', '#2FA060', 1080, pop(t, 12.3), t > 13.6);
  o += gubi(t, { x: 920, y: 1600, boy: 120, duygu: 'merak', bakHedef: [540, 840] }) + gufi(t, { x: 180, y: 1780, boy: 160, duygu: 'kararli', bakHedef: [540, 840] });
  $('dinamik').innerHTML = o;
};"""
# 08 — SORU: "SİGORTAN SELİ KAPSIYOR MU?" kartı + YORUMLARA YAZ
S[8] = r"""
$('zemin').innerHTML = zeminK('#1E3A44', '#0B1A22');
window.renderAt = t => {
  let k = R(-420, -230, 840, 460, 40, '#000', .3) + R(-430, -240, 840, 460, 40, '#FFF8EE') + txt('SENİN SİGORTAN', -10, -110, 54, '#1B2440') + txt('SELİ KAPSIYOR MU?', -10, -30, 64, '#2E78C8');
  k += R(-370, 40, 340, 100, 50, '#2FBF71') + txt('✓ EVET', -200, 108, 46, '#FFFFFF') + R(10, 40, 340, 100, 50, '#E8A020') + txt('? BİLMİYORUM', 180, 108, 40, '#FFFFFF');
  let o = grp(k, 540, 820, pop(t, .05));
  if (t > 2.16) o += grp(AU.cip('YORUMLARA YAZ', 0, 0, '#FFD23F', '#1B2440', 32), 540, 1170, pop(t, 2.16));
  o += gubi(t, { x: 880, y: 1600, boy: 130, duygu: 'merak', bakHedef: 'kamera' }) + gufi(t, { x: 200, y: 1780, boy: 180, duygu: 'merak', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
# 09 — TAKİP ET kartı
S[9] = r"""
$('zemin').innerHTML = `<rect width="1080" height="1920" fill="#0E1626"/><circle cx="540" cy="760" r="520" fill="#FFD23F" opacity=".10"/>`;
window.renderAt = t => {
  let o = '';
  const p = pop(t, .3);
  if (p > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FFD23F" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#FFD23F') + AU.yaz('+ TAKİP ET', 0, 98, 46, '#1B2440'), 540, 760, p);
  o += gubi(t, { x: 300, y: 1560, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1770, boy: 230, duygu: 'mutlu', bakHedef: 'kamera' });
  $('dinamik').innerHTML = o;
};"""
