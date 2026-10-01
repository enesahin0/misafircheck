"""#26 İki yönetmen (Ceylan–Demirkubuz) — sahne HTML'leri + plan.json + tepkiler.json. Merak sırası + magazin dili; yönetmenler BOŞ KOLTUK simgesi; maskotlar projeksiyoncu/arşivci/dedektif/seyirci rollerinde."""
import json

SB = [0, 7.3, 11.8, 16.4, 23.3, 31.7, 40.0, 49.8, 56.6, 62.1, 69.0, 73.3, 77.2, 81.9, 84.2]
ALT = {}
TEP = {
    1: [('gufi', .5, 'goster'), ('gubi', 2.8, 'sasir'), ('gufi', 4.6, 'sasir'), ('gubi', 6.3, 'mutlu')],
    2: [('gubi', .6, 'isaret'), ('gufi', 2.6, 'isaret')],
    3: [('gubi', 2.7, 'uzgun'), ('gufi', 3.2, 'kararli'), ('gufi', 4.2, 'sasir')],
    4: [('gubi', 4.3, 'mutlu'), ('gufi', 4.4, 'alkis')],
    5: [('gufi', .4, 'uzgun'), ('gubi', 3.0, 'sasir'), ('gufi', 6.2, 'sasir')],
    6: [('gufi', 2.5, 'isaret'), ('gubi', 5.0, 'sasir')],
    7: [('gubi', .6, 'sasir'), ('gufi', 4.2, 'dusun'), ('gubi', 6.6, 'korku')],
    8: [('gufi', 3.2, 'isaret'), ('gubi', 1.8, 'sasir')],
    9: [('gufi', 2.4, 'sasir'), ('gubi', 2.5, 'korku')],
    10: [('gufi', .4, 'kararli'), ('gubi', 2.1, 'dusun')],
    11: [('gufi', 1.0, 'isaret'), ('gubi', 3.4, 'aha')],
    12: [('gubi', .7, 'kararli'), ('gufi', 1.5, 'kararli')],
    13: [('gubi', 1.0, 'selam'), ('gufi', 1.2, 'mutlu'), ('gubi', 3.2, 'zipla'), ('gufi', 3.4, 'zipla')],
}
TPX = {}
ORTAK = r"""
const R = PR.R, h = HK.hash;
const PROJ = KO.giy('gufi', [['kasket', { renk: '#2A2E40', siper: '#1B1F2A' }]]);
const ARSIV = KO.giy('gubi', [['papyon', { renk: '#C8232F' }], 'gozluk']);
const DEDEKTIF = KO.giy('gufi', [['melon', { renk: '#5A4A3A', bant: '#1B1640' }], ['monokl', {}]]);
"""

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="kamYak"><g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g></g>
</svg>
<script>window.SB = __SB__; const TP = __TP__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/kisi.js"></script><script src="../ortak/zemin.js"></script><script src="../ortak/hareket.js"></script><script src="../ortak/cevre.js"></script><script src="../ortak/kostum.js"></script><script src="../ortak/para.js"></script><script src="../ortak/hk.js"></script><script src="../ortak/detay.js"></script><script src="../ortak/nb.js"></script>
<script src="../ortak/harita/d3-array.min.js"></script><script src="../ortak/harita/d3-geo.min.js"></script><script src="../ortak/harita/topojson-client.min.js"></script><script src="../ortak/harita/dunya50.js"></script><script src="../ortak/harita/ulke_tablo.js"></script><script src="../ortak/harita/turkiye10.js"></script><script src="../ortak/harita/harita.js"></script>
<script src="../ortak/logo_paths.js"></script><script src="../ortak/altyazi.js"></script>
<script>
const $ = i => document.getElementById(i), A = K.aralik, E = K.ease;
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const pop = (t, a, d = .45) => back(A(t, a, a + d));
const grp = (s, x, y, k = 1, r = 0, op = 1) => `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r})" opacity="${op}">${s}</g>`;
const olc = (s, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const txt = (s, x, y, size, renk = '#FFF3D6', w = 900, ek = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
const cip = (s, x, y, renk, yazi = '#0B1433', fs = 38) => { const w = K.yaziGen(s, fs, { mono: true, ls: 3 }) + fs * 1.7; return `<rect x="${x - w / 2}" y="${y - fs * 1.2}" width="${w}" height="${fs * 2.2}" rx="${fs * 1.1}" fill="${renk}"/><text class="mono" x="${x}" y="${y + fs * .36}" font-size="${fs}" text-anchor="middle" letter-spacing="3" style="fill:${yazi}">${s}</text>`; };
const gubi = (t, o) => M.canli('gubi', Object.assign({ t, tepkiler: TP.gubi }, o));
const gufi = (t, o) => M.canli('gufi', Object.assign({ t, tepkiler: TP.gufi }, o));
__JS__
</script>
<script src="../ortak/kanal.js"></script>
</body></html>"""





S = {}
# 01 — KANCA: "Cannes'ın muhtarı mısın, nesin sen?" dev alıntı; makara döner; klaket çarpar; mısın yağar
S[1] = r"""
window.renderAt = t => {
  const T = t;
  const kl = Math.abs(Math.sin(T * 5)) * (T < 1.4 ? 1 : 0);
  let o = NB.salon(T, '', { sallan: A(t, .2, .6) * (1 - A(t, .6, 1.0)) });
  const p = pop(t, .05, .4);
  o += NB.alinti(["CANNES'IN", "MUHTARI MISIN,", "NESİN SEN?"], 'Z. DEMİRKUBUZ', { x: 540, y: 645, w: 860, fs: 96, p: Math.max(.001, p), rot: -2 + Math.sin(T * 3) * .6 });
  const a = pop(t, 2.56); if (a > 0) o += grp(NB.cipO('17 YILLIK SESSİZLİK', 0, 0, '#B8232F', '#FFFFFF', 34), 540, 1130, a);
  const b = pop(t, 4.5); if (b > 0) o += grp(NB.cipO('TÜRK SİNEMASININ İKİ DEVİ', 0, 0, '#1B1640', '#FFE45C', 30), 540, 1190, b);
  o += NB.makara(150, 1650, 90, T * 260) + NB.makara(150, 1520, 60, -T * 300);
  o += NB.klaket(840, 1590, .8, kl, 'SAHNE 1', 'ÇEKİM 1');
  o += NB.misirYagmur(t, 6.6, 14, 760, 1560);
  o += gufi(t, { yol: [[0, 260, 1800, 280], [3, 260, 1800, 280]], x: 260, y: 1800, boy: 280, bakHedef: [540, 700], ust: PROJ });
  o += gubi(t, { yol: [[0, 760, 1600, 230], [1.2, 760, 1600, 230]], x: 760, y: 1600, boy: 230, bakHedef: [540, 700], ust: ARSIV });
  $('dinamik').innerHTML = o;
};"""
# 02 — Soran Zeki Demirkubuz. Soru, Nuri Bilge Ceylan'a: iki BOŞ yönetmen koltuğu; ışık soldan sağa
S[2] = r"""
window.renderAt = t => {
  const T = t + 7.3, g = FX.E.inOutQuart(A(t, 2.0, 3.0));
  const ic = `<text x="270" y="250" font-size="50" font-weight="900" text-anchor="middle" style="fill:#1B1640">ZEKİ</text><text x="270" y="312" font-size="50" font-weight="900" text-anchor="middle" style="fill:#1B1640">DEMİRKUBUZ</text><text x="640" y="250" font-size="50" font-weight="900" text-anchor="middle" style="fill:#1B1640">NURİ BİLGE</text><text x="640" y="312" font-size="50" font-weight="900" text-anchor="middle" style="fill:#1B1640">CEYLAN</text><path d="M300 470 L540 470" stroke="#C8232F" stroke-width="14" stroke-dasharray="26 16" /><path d="M515 440 L550 470 L515 500" stroke="#C8232F" stroke-width="14" fill="none" stroke-linecap="round"/><text x="420" y="580" font-size="120" font-weight="900" text-anchor="middle" style="fill:#C8232F" opacity="${A(t, 2.1, 2.7)}">?</text>`;
  let o = NB.salon(T, ic);
  o += NB.koltuk(300, 1250, 1.05, 'Z.D.', { vurgu: 1 - g }) + NB.koltuk(780, 1250, 1.05, 'N.B.C.', { vurgu: g });
  const sx = 300 + 480 * g; o += `<path d="M${sx - 40} 80 L${sx + 40} 80 L${sx + 150} 1250 L${sx - 150} 1250Z" fill="#FFF3C8" opacity=".12"/>`;
  o += gubi(t, { yol: [[0, 300, 1580, 220], [2.0, 300, 1580, 220], [3.0, 780, 1580, 220]], x: 300, y: 1580, boy: 220, bakHedef: [sx, 1100], isaretHedef: [sx, 1100], ust: ARSIV });
  o += gufi(t, { yol: [[0, 860, 1790, 270], [4.4, 860, 1790, 270]], x: 860, y: 1790, boy: 270, bakHedef: [sx, 1100], isaretHedef: [sx, 1100], ust: PROJ });
  $('dinamik').innerHTML = o;
};"""
# 03 — dostluk ↔ kırgınlık: kalp çatlar, Gufi bantlamaya çalışır
S[3] = r"""
window.renderAt = t => {
  const T = t + 11.8, k = A(t, 2.5, 3.2);
  const heart = (dx, rot, op) => `<g transform="translate(${450 + dx} 315) rotate(${rot})" opacity="${op}"><path d="M0 110 C-170 -10 -150 -170 -60 -170 C-20 -170 0 -140 0 -120 C0 -140 20 -170 60 -170 C150 -170 170 -10 0 110Z" fill="#E8505B"/><path d="M-70 -120 Q-100 -60 -50 -10" stroke="#FFF" stroke-width="12" fill="none" opacity=".5" stroke-linecap="round"/></g>`;
  const ic = k < .02 ? heart(0, 0, 1).replace('translate(450 315)', `translate(450 315) scale(${1 + .06 * Math.sin(T * 6)})`) : `<g clip-path="url(#nbl)"><defs><clipPath id="nbl"><path d="M0 0 L450 0 L470 120 L430 220 L470 330 L440 460 L0 630Z"/></clipPath><clipPath id="nbr"><path d="M900 0 L450 0 L470 120 L430 220 L470 330 L440 460 L900 630Z"/></clipPath></defs>` + heart(-70 * k, -10 * k, 1) + `</g><g clip-path="url(#nbr)">` + heart(70 * k, 10 * k, 1) + `</g>`;
  let o = NB.salon(T, ic, { sallan: A(t, 2.5, 2.8) * (1 - A(t, 2.8, 3.2)) });
  o += NB.koltuk(300 + 60 * k * -1 + 90 * (1 - k), 1250, 1.0, 'Z.D.') + NB.koltuk(780 - 90 * (1 - k) + 60 * k, 1250, 1.0, 'N.B.C.');
  const a = pop(t, .35); if (a > 0) o += grp(NB.cipO('ESKİ DOSTLUK', 0, 0, '#2E8A4A', '#FFFFFF', 36), 540, 1130, a);
  const b = pop(t, 2.6); if (b > 0) o += grp(NB.cipO('ESKİ KIRGINLIK', 0, 0, '#B8232F', '#FFFFFF', 36), 540, 1200, b);
  // bant: Gufi çatlağı kapatmaya çalışır, yapışmaz
  if (t > 3.1) { const bt = A(t, 3.1, 3.7), dus = A(t, 4.0, 4.6); o += `<g transform="translate(${540 + 40 * dus} ${700 + 260 * dus * dus}) rotate(${-14 + 90 * dus})" opacity="${bt}">` + NB.R(-120, -20, 240, 40, 6, '#E8D090') + NB.R(-120, -20, 240, 8, 4, '#FFF', .35) + '</g>'; }
  o += gufi(t, { yol: [[0, 240, 1800, 270], [2.9, 240, 1800, 270], [3.6, 470, 1720, 240]], x: 240, y: 1800, boy: 270, bakHedef: [540, 700], isaretHedef: [540, 700], ust: PROJ });
  o += gubi(t, { x: 840, y: 1620, boy: 220, duygu: t > 2.5 ? 'uzgun' : 'merak', bakHedef: [540, 700], ust: ARSIV });
  $('dinamik').innerHTML = o;
};"""
# 04 — 2006 Antalya Altın Portakal: DETAY heykel; Gubi sunucu zarf açar: KADER · EN İYİ FİLM
S[4] = r"""
window.renderAt = t => {
  const T = t + 16.4;
  const ic = `<text x="450" y="200" font-size="170" font-weight="900" text-anchor="middle" style="fill:#C8232F">2006</text><text x="450" y="270" font-size="44" font-weight="800" text-anchor="middle" style="fill:#1B1640">43. ALTIN PORTAKAL</text>` + (t > 4.4 ? `<rect x="150" y="310" width="600" height="180" rx="26" fill="#1B1640"/><text x="450" y="370" font-size="42" font-weight="900" text-anchor="middle" style="fill:#FFE45C">EN İYİ FİLM</text><text x="450" y="455" font-size="72" font-weight="900" text-anchor="middle" style="fill:#FFFFFF">KADER</text>` : '');
  let o = NB.salon(T, ic);
  o += NB.portakal(540, 1250, .95, 1);
  o += NB.konfeti(t, 4.4, 34, 540, 780);
  const e = A(t, 3.9, 4.4); // zarf
  o += `<g transform="translate(700 ${1640 - 80 * Math.sin(e * Math.PI)}) rotate(${-8 + 14 * e})">` + NB.R(-80, -50, 160, 100, 8, '#F4EEE2') + `<path d="M-80 -50 L0 10 L80 -50" stroke="#B8B4A8" stroke-width="6" fill="none"/>` + NB.R(-80, -50 - 70 * e, 160, 70 * e, 6, '#FFFFFF', e > .1 ? 1 : 0) + '</g>';
  o += gubi(t, { yol: [[0, 320, 1600, 230], [3.4, 320, 1600, 230], [4.2, 700, 1560, 230]], x: 320, y: 1600, boy: 230, bakHedef: [540, 1200], ust: ARSIV, tepkiler: TP.gubi });
  o += gufi(t, { x: 190, y: 1800, boy: 260, bakHedef: [540, 1200], ust: PROJ });
  o += DP.sar(t, 1.0, 2.8, d => NBD.odul(d));
  $('dinamik').innerHTML = o;
};"""
# 05 — on yedi yıl: takvim uçar, örümcek ağı; Kış Uykusu kitabı → DETAY; günlük sayfalar savrulur
S[5] = r"""
window.renderAt = t => {
  const T = t + 23.3, yil = Math.round(2006 + 17 * FX.E.inOutQuart(A(t, .2, 2.0)));
  const ic = `<text x="450" y="330" font-size="260" font-weight="900" text-anchor="middle" style="fill:#1B1640">${yil}</text><text x="450" y="450" font-size="48" font-weight="800" text-anchor="middle" style="fill:#C8232F" opacity="${A(t, 1.4, 2.0)}">17 YIL SONRA</text>`;
  let o = NB.salon(T, ic, { isik: .6 });
  // örümcek ağları koltuklarda (sessizlik)
  const ag = (x, y, s, yon) => `<g transform="translate(${x} ${y}) scale(${yon * s} ${s})" opacity="${A(t, .8, 1.6) * (1 - A(t, 2.8, 3.2))}"><path d="M0 0 L120 0 M0 0 L100 70 M0 0 L60 110 M0 0 L0 130 M40 0 Q50 30 0 40 M80 0 Q90 55 0 80 M120 0 Q130 80 0 120" stroke="#E8E0D0" stroke-width="3" fill="none"/></g>`;
  o += NB.koltuk(300, 1250, 1.0, 'Z.D.') + NB.koltuk(780, 1250, 1.0, 'N.B.C.') + ag(200, 880, 1.2, 1) + ag(880, 880, 1.2, -1);
  // uçan takvim yaprakları
  for (let i = 0; i < 8; i++) { const q = A(t, .1 + i * .2, .9 + i * .2); if (q > 0 && q < 1) o += `<g transform="translate(${540 + (i % 2 ? 1 : -1) * 260 * q} ${1000 - 500 * q + 140 * q * q}) rotate(${(i % 2 ? 1 : -1) * 180 * q})" opacity="${1 - q}">` + NB.R(-60, -70, 120, 140, 10, '#FFFDF6') + NB.R(-60, -70, 120, 36, 10, '#E8323C') + '</g>'; }
  // kitap geliyor (günlük sayfaları)
  const kg = A(t, 2.8, 3.5);
  if (t > 5.8) for (let i = 0; i < 6; i++) { const q = A(t, 6.0 + i * .12, 7.4 + i * .12); if (q > 0 && q < 1) o += `<g transform="translate(${540 + (h(i) - .5) * 700 * q} ${900 - 420 * Math.sin(q * 3) + 300 * q}) rotate(${(h(i + 3) - .5) * 360 * q})" opacity="${1 - q * .6}">` + NB.R(-70, -90, 140, 180, 8, '#F6F2E8') + [0, 1, 2, 3].map(k => NB.R(-50, -62 + k * 34, 100 - (k % 2) * 30, 8, 4, '#B8B4A8')).join('') + '</g>'; }
  const a = pop(t, .25); if (a > 0) o += grp(NB.cipO('SONRA…', 0, 0, '#1B1640', '#FFE45C', 36), 540, 1130, a);
  const b = pop(t, 6.2); if (b > 0) o += grp(NB.cipO('ESKİ YARA AÇILDI', 0, 0, '#B8232F', '#FFFFFF', 34), 540, 1130, b);
  o += gubi(t, { yol: [[0, 800, 1620, 230], [2.0, 800, 1620, 230], [2.6, 560, 1560, 230]], x: 800, y: 1620, boy: 230, duygu: t < 2.5 ? 'uzgun' : 'merak', bakHedef: [540, 900], ust: ARSIV });
  o += gufi(t, { x: 230, y: 1800, boy: 270, duygu: t < 2.5 ? 'uzgun' : 'merak', bakHedef: [540, 900], ust: PROJ });
  o += DP.sar(t, 3.0, 5.6, d => NBD.kitap(d));
  $('dinamik').innerHTML = o;
};"""
# 06 — Demirkubuz televizyona çıktı: DETAY TV; alıntı kartları (atıflı) panoya iğnelenir
S[6] = r"""
window.renderAt = t => {
  const T = t + 31.7;
  let o = NB.salon(T, '', { isik: .8, perdeRenk: '#E8E2D6' });
  const kart = (satir, kim, t0, t1, y, rot, renk) => { const p = pop(t, t0, .35) * (1 - A(t, t1, t1 + .3)); return p > .01 ? NB.alinti(satir, kim, { x: 540, y, w: 860, fs: 78, p, rot, serit: renk }) + `<circle cx="${540 + 300}" cy="${y - 150 * p}" r="18" fill="#C8232F"/>` : ''; };
  o += kart(["KÜSLÜĞÜ CEYLAN", "BAŞLATTI"], "Z. DEMİRKUBUZ'A GÖRE", 2.4, 4.6, 640, -2, '#FFE45C');
  o += kart(["CANNES'IN MUHTARI", "MISIN, NESİN SEN?"], 'Z. DEMİRKUBUZ', 5.0, 6.3, 640, 2, '#FFE45C');
  o += kart(["ADİLİK", "YAPMASIN"], 'Z. DEMİRKUBUZ', 6.5, 8.2, 640, -1.5, '#FFE45C');
  const a = pop(t, .3); if (a > 0) o += grp(NB.cipO('TELEVİZYON · 26 ARALIK', 0, 0, '#1B1640', '#FFE45C', 34), 540, 1130, a);
  // Gufi mikrofon uzatır (boş sandalyeye), Gubi kartları iğneler
  o += `<g transform="translate(540 1500)">` + NB.R(-6, -150, 12, 150, 6, '#1B1B22') + `<circle cx="0" cy="-160" r="30" fill="#5A607E"/><circle cx="0" cy="-160" r="30" fill="none" stroke="#2A2E40" stroke-width="5"/></g>`;
  o += gufi(t, { yol: [[0, 230, 1800, 270], [1.5, 420, 1800, 270]], x: 230, y: 1800, boy: 270, bakHedef: [540, 700], isaretHedef: [540, 1400], ust: PROJ });
  o += gubi(t, { yol: [[0, 860, 1600, 230], [2.0, 860, 1600, 230], [2.4, 700, 1540, 230]], x: 860, y: 1600, boy: 230, bakHedef: [540, 700], ust: ARSIV });
  o += DP.sar(t, .2, 2.2, d => NBD.tvDetay(d));
  $('dinamik').innerHTML = o;
};"""
# 07 — Üç Maymun: DETAY maymun + HİÇ İZLEMEDİM; iddia: DETAY senaryo İDDİA
S[7] = r"""
window.renderAt = t => {
  const T = t + 40.0;
  let o = NB.salon(T, '', { isik: .7 });
  o += NB.sorular(T, 8);
  const a = pop(t, 3.7); if (a > 0) o += grp(NB.cipO('YILLARDIR BİR İDDİA', 0, 0, '#B8232F', '#FFFFFF', 38), 540, 520, a);
  const q = pop(t, 4.7); if (q > 0) o += grp(NB.cipO('SENARYO ÇALINDI MI?', 0, 0, '#1B1640', '#FFE45C', 40), 540, 640, q);
  // dedektif Gufi, büyüteç; Gubi soru işaretlerini asar
  const lx = 330 + 460 * A(t, 4.0, 8.4);
  o += `<g transform="translate(${lx} 1470) rotate(-20)"><circle r="76" fill="#CFE8FA" opacity=".35"/><circle r="76" fill="none" stroke="#C8A040" stroke-width="14"/><rect x="60" y="62" width="110" height="20" rx="10" fill="#6A4A20" transform="rotate(40 60 62)"/></g>`;
  o += gufi(t, { yol: [[0, 230, 1800, 270], [3.8, 230, 1800, 270], [8.4, 780, 1800, 270]], x: 230, y: 1800, boy: 270, bakHedef: [540, 900], ust: DEDEKTIF });
  o += gubi(t, { x: 880, y: 1620, boy: 230, duygu: 'saskin', bakHedef: [540, 900], ust: ARSIV });
  o += DP.sar(t, .5, 3.4, d => NBD.maymun(d));
  o += DP.sar(t, 6.4, 9.6, d => NBD.senaryo(d));
  $('dinamik').innerHTML = o;
};"""
# 08 — Ceylan sessizliğini bozdu; X'ten yazdı → DETAY telefon (daktilo)
S[8] = r"""
window.renderAt = t => {
  const T = t + 49.8, c = A(t, 1.7, 2.1);
  let o = NB.salon(T, `<text x="450" y="330" font-size="120" font-weight="900" text-anchor="middle" style="fill:#C8232F">SESSİZLİK</text><text x="450" y="460" font-size="100" font-weight="900" text-anchor="middle" style="fill:#1B1640" opacity="${c}">BOZULDU</text><path d="M120 100 L320 330 L260 380 L420 600 M780 80 L610 300 L680 360 L520 560" stroke="#1B1640" stroke-width="8" fill="none" opacity="${c}"/>`, { sallan: A(t, 1.6, 1.9) * (1 - A(t, 1.9, 2.3)) });
  o += NB.koltuk(300, 1250, 1.0, 'Z.D.') + NB.koltuk(780, 1250, 1.0, 'N.B.C.', { vurgu: 1 });
  const a = pop(t, .3); if (a > 0) o += grp(NB.cipO('CEYLAN YANIT VERDİ', 0, 0, '#1B1640', '#FFE45C', 34), 540, 1130, a);
  o += gufi(t, { yol: [[0, 240, 1800, 270], [2.0, 240, 1800, 270], [3.0, 640, 1800, 270]], x: 240, y: 1800, boy: 270, bakHedef: [780, 900], isaretHedef: [780, 1000], ust: PROJ });
  o += gubi(t, { x: 860, y: 1620, boy: 230, duygu: t > 1.8 ? 'saskin' : 'merak', bakHedef: [780, 900], ust: ARSIV });
  o += DP.sar(t, 2.9, 6.9, d => NBD.xKart(d, 'Kendine şimdiden bir YouTube kanalı açarsa iyi eder.'));
  $('dinamik').innerHTML = o;
};"""
# 09 — Demirkubuz'un cevabı: kart sağdan çarpar; Gubi & Gufi mısırla seyreder
S[9] = r"""
window.renderAt = t => {
  const T = t + 56.6, g = FX.E.inOutQuart(A(t, 1.2, 2.2));
  let o = NB.salon(T, '', { sallan: A(t, 2.2, 2.5) * (1 - A(t, 2.5, 3.0)) });
  const sol = pop(t, .1, .3) * (1 - A(t, 1.8, 2.3));
  if (sol > .01) o += NB.alinti(["KENDİNE BİR YOUTUBE", "KANALI AÇSIN"], 'N. B. CEYLAN · X', { x: 300, y: 640, w: 540, fs: 52, p: sol, rot: -3, vurgu: '#4A8AD8', serit: '#4A8AD8' });
  const p = Math.max(.001, A(t, 2.1, 2.5)) * (1 + .08 * Math.exp(-(t - 2.5) * 8)) ;
  o += NB.alinti(["OTUR OTURDUĞUN", "YERDE VE DİŞİNİ", "SIKMAYA DEVAM ET"], 'Z. DEMİRKUBUZ', { x: 540, y: 600, w: 880, fs: 80, p: t > 2.1 ? p : .001, rot: 2 });
  o += NB.koltuk(300 - 60 * g, 1250, 1.0, 'Z.D.', { don: 0 }) + NB.koltuk(780 + 60 * g, 1250, 1.0, 'N.B.C.');
  const a = pop(t, 1.6); if (a > 0) o += grp(NB.cipO('CEVABI GECİKMEDİ', 0, 0, '#B8232F', '#FFFFFF', 36), 540, 1130, a);
  o += NB.misir(150, 1730, .9) + NB.misir(930, 1700, .9) + NB.misirYagmur(t, 2.3, 16, 540, 1500);
  o += gufi(t, { x: 300, y: 1800, boy: 270, duygu: t > 2.3 ? 'saskin' : 'merak', bakHedef: [540, 700], ust: PROJ, tepkiler: TP.gufi });
  o += gubi(t, { x: 780, y: 1610, boy: 230, duygu: t > 2.3 ? 'korku' : 'merak', bakHedef: [540, 700], ust: ARSIV, tepkiler: TP.gubi });
  $('dinamik').innerHTML = o;
};"""
# 10 — Ceylan son sözü: klaket SON SÖZ; kanıt yok kartı
S[10] = r"""
window.renderAt = t => {
  const T = t + 62.1, kl = Math.abs(Math.sin(A(t, .2, .5) * Math.PI));
  let o = NB.salon(T, '', { sallan: A(t, .4, .55) * (1 - A(t, .55, .9)) });
  const p = pop(t, 2.0, .4);
  o += NB.alinti(["HİÇBİR KANITI OLMAYAN", "BİR SÜRÜ HAYAL ÜRÜNÜ", "İDDİAYLA UĞRAŞMAK", "KOLAY DEĞİLMİŞ"], 'N. B. CEYLAN', { x: 540, y: 640, w: 880, fs: 78, p: Math.max(.001, p), rot: -1.5, vurgu: '#4A8AD8', serit: '#4A8AD8' });
  const a = pop(t, .3); if (a > 0) o += grp(NB.cipO('SON SÖZ', 0, 0, '#1B1640', '#FFE45C', 40), 540, 1130, a);
  o += NB.klaket(780, 1590, 1.0, kl, 'SON SÖZ', 'ÇEKİM 1');
  o += gufi(t, { yol: [[0, 230, 1800, 270], [.3, 480, 1800, 270]], x: 230, y: 1800, boy: 270, bakHedef: [540, 700], isaretHedef: [780, 1590], ust: PROJ });
  o += gubi(t, { x: 920, y: 1500, boy: 200, duygu: 'merak', bakHedef: [540, 700], ust: ARSIV });
  $('dinamik').innerHTML = o;
};"""
# 11 — Filmlerimin hiçbirinde sana yapılmış bir gönderme yok: film şeridi, büyüteçle tarama
S[11] = r"""
window.renderAt = t => {
  const T = t + 69.0, lx = 150 + 780 * A(t, .8, 3.6);
  let o = NB.salon(T, '', { isik: .8 });
  o += NB.alinti(["FİLMLERİMİN HİÇBİRİNDE", "SANA YAPILMIŞ BİR", "GÖNDERME YOK"], 'N. B. CEYLAN', { x: 540, y: 640, w: 880, fs: 80, p: Math.max(.001, pop(t, .6, .4)), rot: 1.5, vurgu: '#4A8AD8', serit: '#4A8AD8' });
  // film şeridi (altı kare), her karede "–" ; büyüteç tarar
  o += NB.R(40, 1040, 1000, 120, 8, '#1B1B22');
  for (let i = 0; i < 6; i++) { const x = 70 + i * 160, ok = lx > x + 70; o += NB.R(x, 1056, 130, 88, 6, ok ? '#2E8A4A' : '#3A3A44') + NB.yaz(ok ? 'YOK' : '', x + 65, 1114, 34, '#FFFFFF') + NB.R(x + 8, 1042, 20, 10, 3, '#F4EEE2') + NB.R(x + 8, 1148, 20, 10, 3, '#F4EEE2') + NB.R(x + 100, 1042, 20, 10, 3, '#F4EEE2') + NB.R(x + 100, 1148, 20, 10, 3, '#F4EEE2'); }
  o += `<g transform="translate(${lx} 1100) rotate(-20)"><circle r="82" fill="#CFE8FA" opacity=".35"/><circle r="82" fill="none" stroke="#C8A040" stroke-width="14"/><rect x="62" y="64" width="110" height="20" rx="10" fill="#6A4A20" transform="rotate(40 62 64)"/></g>`;
  const a = pop(t, .2); if (a > 0) o += grp(NB.cipO('VE EKLEDİ', 0, 0, '#1B1640', '#FFE45C', 34), 540, 960, a);
  o += NB.makara(130, 1640, 80, T * 200);
  o += gufi(t, { yol: [[0, 260, 1800, 270], [3.8, 700, 1800, 270]], x: 260, y: 1800, boy: 270, bakHedef: [lx, 1100], isaretHedef: [lx, 1100], ust: DEDEKTIF });
  o += gubi(t, { x: 900, y: 1620, boy: 220, duygu: 'merak', bakHedef: [lx, 1100], ust: ARSIV });
  $('dinamik').innerHTML = o;
};"""
# 12 — iki ayrı film: iki projeksiyon, iki anlatım
S[12] = r"""
window.renderAt = t => {
  const T = t + 73.3;
  let o = `<rect width="1080" height="1920" fill="#120E18"/>`;
  o += `<path d="M260 1700 L420 1700 L460 330 L60 330Z" fill="#FFF3C8" opacity=".08"/><path d="M660 1700 L820 1700 L1020 330 L620 330Z" fill="#FFF3C8" opacity=".08"/>`;
  const yarim = (x, baslik, alt, renk, p) => `<g transform="translate(${x} 700) scale(${p})">` + NB.R(-250, -300, 500, 560, 26, '#F4EEE2') + NB.R(-250, -300, 500, 90, 26, renk) + NB.yaz(baslik, 0, -234, 52, '#FFFFFF') + alt.map((s, i) => NB.yaz(s, 0, -80 + i * 74, 46, '#1B1640')).join('') + '</g>';
  o += yarim(270, '1. ANLATIM', ['KANITI', 'YOK', 'İDDİA'], '#4A8AD8', pop(t, .1, .4));
  o += yarim(810, '2. ANLATIM', ['FİLMİ', 'İZLEMEDİM', 'MESELE BAŞKA'], '#C8232F', pop(t, .9, .4));
  const a = pop(t, .1); if (a > 0) o += grp(NB.cipO('N. B. CEYLAN', 0, 0, '#1B1640', '#9FC8FF', 28), 270, 1010, a);
  const b = pop(t, .9); if (b > 0) o += grp(NB.cipO('Z. DEMİRKUBUZ', 0, 0, '#1B1640', '#FFB0B0', 28), 810, 1010, b);
  o += NB.makara(260, 1600, 80, T * 280) + NB.makara(820, 1600, 80, -T * 280);
  o += gubi(t, { yol: [[0, 190, 1700, 230], [.6, 190, 1700, 230]], x: 190, y: 1700, boy: 230, bakHedef: [270, 800], ust: ARSIV });
  o += gufi(t, { yol: [[0, 940, 1810, 270], [.6, 940, 1810, 270]], x: 940, y: 1810, boy: 270, bakHedef: [810, 800], ust: PROJ });
  $('dinamik').innerHTML = o;
};"""
# 13 — final: sen seç; takip kartı
S[13] = r"""
window.renderAt = t => {
  const T = t + 77.2;
  let o = NB.salon(T, t > 2.3 ? '' : `<text x="450" y="300" font-size="150" font-weight="900" text-anchor="middle" style="fill:#C8232F">SENCE?</text><text x="450" y="420" font-size="62" font-weight="800" text-anchor="middle" style="fill:#1B1640">1. ANLATIM mı</text><text x="450" y="500" font-size="62" font-weight="800" text-anchor="middle" style="fill:#1B1640">2. ANLATIM mı?</text>`);
  o += NB.koltuk(300, 1250, 1.0, 'Z.D.') + NB.koltuk(780, 1250, 1.0, 'N.B.C.');
  o += NB.misir(150, 1730, .9) + NB.misir(930, 1700, .9) + NB.misirYagmur(t, 1.0, 18, 540, 1500);
  const k = pop(t, 2.5, .45);
  if (k > 0) o += grp(R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#E8505B" stroke-width="6"/>` + NB.yaz('gubigufi', 0, -20, 96, '#FFFFFF') + R(-220, 40, 440, 80, 40, '#E8505B') + NB.yaz('+ TAKİP ET', 0, 98, 46, '#FFFFFF'), 540, 640, k);
  o += gufi(t, { x: 340, y: 1790, boy: 270, duygu: 'mutlu', bakHedef: 'kamera', ust: PROJ, tepkiler: TP.gufi });
  o += gubi(t, { x: 780, y: 1600, boy: 230, duygu: 'mutlu', bakHedef: 'kamera', ust: ARSIV, tepkiler: TP.gubi });
  $('dinamik').innerHTML = o;
};"""

N = len(SB) - 1
for k in range(1, N): S[k] = ORTAK + S[k]
S[N] = open('_logo_sahne.js').read()

plan = {"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "miks.wav", "cikti": "video_ham.mp4", "sahneler": []}
tum = []
for i in range(1, N + 1):
    tp = {'gubi': [[a, b] for k, a, b in TEP.get(i, []) if k == 'gubi'], 'gufi': [[a, b] for k, a, b in TEP.get(i, []) if k == 'gufi']}
    tum += [[k, round(SB[i - 1] + a, 3), b] for k, a, b in TEP.get(i, [])]
    html = HEAD.replace("__SB__", str(SB[i - 1])).replace("__TP__", json.dumps(tp)).replace("__JS__", S[i])
    if i == N: html = html.replace('<script src="../ortak/kanal.js"></script>', '')
    open(f"sahneler/s{i:02d}.html", "w").write(html)
    plan["sahneler"].append(dict({"dosya": f"sahneler/s{i:02d}.html", "baslangic": SB[i - 1], "bitis": SB[i]}, **({"alt_kare": ALT[i]} if i in ALT else {})))
json.dump(plan, open("plan.json", "w"), ensure_ascii=False, indent=1)
json.dump(sorted(tum, key=lambda r: r[1]), open("tepkiler.json", "w"), ensure_ascii=False)
print("sahneler + plan.json + tepkiler.json yazıldı")
