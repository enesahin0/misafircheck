S = {}
# 01 — KANCA (0–11,6): boş sokak, biri yığılıyor (0,98) · KİMSE YOK (3,3) · 112 (4,5) · DOĞRU (6,5) · ambulans + saat (7,2–9,6) · NE YAPACAKSIN? (10,1)
S[1] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#0F1B33', alt: '#05080F', isik: [420, 700, '#FFD27A', .16], ikinci: [900, 1500, '#E8323C', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 9.7, 'kamera'], [10.0, 2.8, 345, 880, 1.3, 'kamera']],
  sarsinti: [[1.5, 12], [10.2, 10], [10.6, 8], [11.0, 6]],
  ciz: t => {
    let o = '';
    [[-20, 120, 330], [110, 90, 250], [205, 130, 380], [700, 110, 300], [815, 150, 420], [975, 120, 260]].forEach(([x, w, h]) => o += R(x, 1180 - h, w, h, 3, '#10182C'));
    for (let i = 0; i < 18; i++) { const x = (i * 211) % 1060 + 10, y = 900 + (i * 97) % 240; if (Math.sin(t * 1.5 + i) > -.6) o += R(x, y, 8, 11, 2, '#FFD27A', .5); }
    o += `<path d="M175 1180 V760 Q175 720 215 720 H300" stroke="#2B3550" stroke-width="12" fill="none"/>` + R(280, 716, 70, 20, 8, '#FFE9A8') + `<path d="M280 736 L180 1180 H410 L350 736Z" fill="#FFE9A8" opacity=".10"/>`;
    o += R(-100, 1180, 1280, 800, 0, '#1A2238') + R(-100, 1180, 1280, 8, 0, '#2E3A5C') + R(-100, 1500, 1280, 6, 0, '#2B3550', .6);
    const ear = fd(t, 4.4, 4.7) * (1 - fd(t, 6.3, 6.6));
    const korku = t > 10.0, sas = t > .9, pls = korku ? 1 + .03 * Math.sin(t * 22) : 1;
    o += `<g transform="translate(340 1180) scale(${pls}) translate(-340 -1180)">` + dur(340, 1180, 1.55, { renk: '#3E8EDE', elR: ear > .01 ? [(24 * ear + 28 * (1 - ear)), (-190 * ear - 64 * (1 - ear))] : [28, -64], goz: sas ? 'genis' : 'acik', agiz: korku || sas ? 'acik' : 'duz', ifade: korku ? 'korku' : 'normal', basEk: t < .9 ? 0 : (t < 3.3 ? -8 : 0) }) + '</g>';
    const wob = t > .35 && t < .98 ? Math.sin(t * 24) * 2.5 * fd(t, .35, .9) : 0;
    if (t < 1.0) o += `<g transform="rotate(${wob} 840 1180)">` + dur(840, 1180, 1.55, { renk: '#E8774A', goz: 'kapali', agiz: 'duz', elL: [-34, -90], elR: [34, -90 + 14 * fd(t, .5, 1)] }) + '</g>';
    else { const th = MO.E.inQuad(fd(t, .98, 1.55)); o += th < 1 ? dusus(840, 1180, 1.55, th, { renk: '#E8774A' }) : yatan(840 - 168 * 1.55, 1180, 1.55, { renk: '#E8774A' }); }
    const dz = MO.ar(t, 1.55, 2.4); if (dz > 0 && dz < 1) for (let k = 0; k < 5; k++) o += `<circle cx="${620 + k * 55}" cy="${1170 - 20 * dz * (1 + k % 2)}" r="${14 + 30 * dz}" fill="#8A94A8" opacity="${(.4 * (1 - dz)).toFixed(2)}"/>`;
    o += ET(t, 3.25, 4.35, 'KİMSE YOK', '#E8323C', '#FFFFFF', 84, 520, -3);
    o += MO.sar(R(-210, -150, 420, 300, 40, '#0F1838') + `<rect x="-210" y="-150" width="420" height="300" rx="40" fill="none" stroke="#7FD0FF" stroke-width="5"/>` + ikon('tel', -90, 0, 1.9) + txt('112', 80, 34, 110, '#FFFFFF'), MO.oge(t, { gir: 4.4, cik: 6.45, agirlik: 'orta', giris: 'olcek', materyal: 'plastik', x: 540 }), 540, 620, { golge: false });
    o += MO.sar(R(-250, -62, 500, 124, 62, '#1F9E5B') + `<circle cx="-170" cy="0" r="38" fill="#FFFFFF"/><path d="M-188 2 L-176 14 L-152 -14" stroke="#1F9E5B" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + txt('DOĞRU', 40, 22, 62, '#FFFFFF'), MO.oge(t, { gir: 6.5, cik: 7.7, agirlik: 'hafif', giris: 'yuksel', materyal: 'lastik', x: 540 }), 540, 620, { golge: false });
    const ka = fd(t, 6.9, 7.4) * (1 - fd(t, 9.8, 10.2));
    if (ka > .01) {
      o += `<g opacity="${ka.toFixed(2)}">` + kusTrafik(t, 7.2) + `</g>`;
      o += `<g opacity="${ka.toFixed(2)}">` + MO.sar(saat(0, 0, 100, (t - 7.4) * .7), MO.oge(t, { gir: 7.5, cik: 9.8, agirlik: 'agir', giris: 'olcek', materyal: 'plastik', x: 540 }), 880, 560, { golge: false }) + '</g>';
      o += MO.sar(zamanChip('O DAKİKALAR', 0, 0, '#E8323C', '#FFFFFF', 40), MO.oge(t, { gir: 7.8, cik: 9.8, agirlik: 'hafif', giris: 'yuksel', x: 540 }), 400, 560, { golge: false });
    }
    return o;
  },
  onCiz: t => ET(t, 10.5, 99, 'NE YAPACAKSIN?', '#FFD23F', '#1B2440', 76, 520, -2)
});"""

# 02 — İLK 10 SANİYE (11,6–20,2): etrafa bak (2,5) · omzundan sars + seslen (4,8–7,6) · "İyi misin?" (7,9)
S[2] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 800, '#FF6B81', .16], ikinci: [200, 1500, '#3E6FB8', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 8.4, 'kamera']],
  sarsinti: [[4.9, 6]],
  ciz: t => {
    let o = yBas(t, 'kalp', 'İLK 10 SANİYE', '#FF6B81', .05, 400);
    const n = Math.max(0, Math.ceil(10 - 8.2 * fd(t, .3, 8.4)));
    o += MO.sar(`<circle r="46" fill="#0B1433" stroke="#FF6B81" stroke-width="6"/><path d="M0 -46 A46 46 0 1 1 -.01 -46" fill="none" stroke="#FFD23F" stroke-width="7" stroke-dasharray="${(289 * (1 - fd(t, .3, 8.4))).toFixed(1)} 300" transform="rotate(0)"/>` + txt(String(n), 0, 16, 46, '#FFFFFF'), MO.oge(t, { gir: .3, agirlik: 'hafif', giris: 'olcek', x: 540 }), 880, 590, { golge: false });
    const pa = fd(t, 3.0, 3.35);
    const ic = t => '';
    let c = yer(215);
    if (pa < 1) { // A: etrafa bak
      const a1 = 1 - pa, kafa = Math.sin(t * 2.4) * 26;
      c += `<g opacity="${a1.toFixed(2)}">` + yatan(-30, 215, 1.3, { renk: '#E8774A' }) + dur(-290, 215, 1.55, { renk: '#3E8EDE', basEk: kafa, goz: 'acik' });
      const pl = .75 + .25 * Math.sin(t * 8);
      c += `<g transform="translate(320 -80) scale(${1.1 * pl})"><path d="M0 -70 L70 52 H-70Z" fill="#FFD23F" stroke="#E8323C" stroke-width="10" stroke-linejoin="round"/><text x="0" y="36" font-size="80" font-weight="900" text-anchor="middle" style="fill:#1B2440">!</text></g>`;
      c += `<path d="M-250 40 L${-250 + 190 * Math.sin(t * 2.4 + .6)} -40" stroke="#FFD23F" stroke-width="3" stroke-dasharray="8 10" fill="none" opacity=".0"/></g>`;
    }
    if (pa > 0) { // B: sars + seslen
      const sh = fd(t, 4.9, 5.1) * (1 - fd(t, 7.6, 7.8)), sarsX = Math.sin(t * 40) * 5 * sh;
      const hx = -6, hy = -54, ky = hy - 93;
      const kur = kisi({ x: -170, y: 215, s: 2.1, sh: [hx + 14 + sarsX, ky + 20 * (1 - sh)], hip: [hx + 14, -30], elL: [hx - 4 + sarsX * 1.2, -58], elR: [hx + 12 + sarsX * 1.2, -58], bacak: false, shW: 24, prefK: [0, 1], renk: '#E8774A', agiz: t > 7.0 ? 'acik' : 'duz' });
      const yat = yatan(-170, 215, 2.1, { renk: '#3E8EDE' });
      c += `<g opacity="${pa.toFixed(2)}">` + kur.replace('#E8774A', '#E8774A') + yat + '</g>';
      c += `<g opacity="${(pa * fd(t, 7.0, 7.4)).toFixed(2)}">` + [0, 1, 2].map(i => `<path d="M${-100 + i * 18} ${-190 - i * 6} q30 -10 ${40} 6" stroke="#FFD23F" stroke-width="7" fill="none" stroke-linecap="round" transform="rotate(${-14 + i * 14} ${-60} ${-130})"/>`).join('') + '</g>';
      if (t > 7.9) c += bal('İYİ MİSİN?!', 190, -220, { fs: 52, renk: '#FFFFFF', kx: -90, ky: 70 });
    }
    o += PK(t, .2, 99, c);
    o += AD(t, .2, 2.95, 1, 'ETRAFA BAK · TEHLİKE VAR MI?');
    o += AD(t, 3.1, 99, 2, 'OMZUNDAN SARS · SESLEN');
    return o;
  },
  onCiz: t => MAS(t, { gd: 'merak', gf: 'merak', b: [['gubi', 1.0, 2.7, '10 saniye var!'], ['gufi', 5.1, 7.0, 'Sesin çıksın!']] })
});"""

# 03 — CEVAP VERİYORSA (20,2–26,2): gözünü açar (0,3) · kendine gelmiştir · sırtüstü yatır (3,7) · bacakları kaldır (4,8)
S[3] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#14282A', alt: '#06100F', isik: [540, 800, '#2FBF71', .16], ikinci: [900, 1500, '#FF6B81', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'kalp', 'CEVAP VERİYORSA', '#2FBF71', .05, 400);
    const bk = MO.E.inOutCubic(fd(t, 4.8, 5.5)), gozA = t > .45;
    let c = yer(215);
    c += `<g transform="translate(-250 215) scale(2.3)">` + R(144, -66, 62, 66, 14, '#8A5A3A', bk > .5 ? 1 : 0) + `<path d="M154 -66 V0" stroke="#6A4128" stroke-width="3" opacity="${bk > .5 ? 1 : 0}"/></g>`;
    c += yatan(-250, 215, 2.3, { renk: '#3E8EDE', goz: gozA ? 'acik' : 'kapali', agiz: gozA && t < 3.4 ? 'acik' : 'duz', bk, basY: gozA ? -3 : 0 });
    if (t > 1.0 && t < 3.6) c += bal('Ne oldu...?', 60, -170, { fs: 46, kx: -150, ky: 70 });
    o += PK(t, .2, 99, c);
    o += ET(t, 1.5, 3.5, 'BAYILIP KENDİNE GELDİ', '#FFD23F', '#1B2440', 52, 1215, -1);
    o += BN(t, 3.7, 99, 'v', 'SIRTÜSTÜ YATIR · BACAKLARI KALDIR', 38, 1215);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'mutlu', gf: 'mutlu', b: [['gufi', 1.3, 3.0, 'Uyandı, oh!'], ['gubi', 3.8, 5.6, 'Bacaklar yukarı!']] })
});"""

# 04 — AĞZINA BİR ŞEY VERME ✕ (0,1–2,6) · göğüs ağrısı (1,8) · toparlanamıyor (2,9) · yine de 112 (4,5)
S[4] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1620', alt: '#0B060A', isik: [540, 800, '#E8323C', .14], ikinci: [200, 1500, '#3E6FB8', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 5.3, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'kalp', 'AMA DİKKAT', '#E8323C', .05, 400);
    const kart = (ic, ad, x, a, renk = '#FF6B81') => MO.sar(R(-110, -110, 220, 250, 28, '#16204A') + `<rect x="-110" y="-110" width="220" height="250" rx="28" fill="none" stroke="${renk}" stroke-width="5"/>` + ic + txt(ad, 0, 120, 25, '#FFF6E6'), MO.oge(t, { gir: a, agirlik: 'orta', giris: 'olcek', materyal: 'plastik', x: 540 }), 0, 0, { golge: false }).replace(/^/, `<g transform="translate(${x} -20)">`) + '</g>';
    let c = '';
    const bd = 1 - fd(t, 1.55, 1.9);
    if (bd > 0) c += `<g opacity="${bd.toFixed(2)}" transform="translate(0 -20) scale(${.9 + .1 * bd})">` + bardak(-60, 20, 2.8) + `<ellipse cx="90" cy="70" rx="38" ry="22" fill="#FFFFFF" transform="rotate(-20 90 70)"/><path d="M52 62 L128 78" stroke="#E8323C" stroke-width="5" transform="rotate(-20 90 70)"/>` + isaretX(60, -140, 2.2) + '</g>';
    const k2 = fd(t, 1.8, 2.1);
    if (k2 > 0) {
      c += `<g opacity="${k2.toFixed(2)}">`;
      c += `<g transform="translate(-305 -10) scale(1.15)">` + R(-110, -120, 220, 270, 28, '#16204A') + `<rect x="-110" y="-120" width="220" height="270" rx="28" fill="none" stroke="#FF6B81" stroke-width="5"/>` + kalpAgri(0, -14, 1.0, t) + txt('GÖĞÜS AĞRISI', 0, 124, 25, '#FFF6E6') + '</g>';
      if (t > 2.9) c += `<g transform="translate(0 -10) scale(1.15)">` + R(-110, -120, 220, 270, 28, '#16204A') + `<rect x="-110" y="-120" width="220" height="270" rx="28" fill="none" stroke="#FFD23F" stroke-width="5"/>` + sersem(0, -14, 1.5, t) + txt('TOPARLANAMIYOR', 0, 124, 23, '#FFF6E6') + '</g>';
      if (t > 4.3) c += `<path d="M140 -10 H180 M164 -30 L182 -10 L164 10" stroke="#FFD23F" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + `<g transform="translate(305 -10) scale(${1.15 + .04 * Math.sin(t * 14)})">` + R(-110, -120, 220, 270, 28, '#16204A') + `<rect x="-110" y="-120" width="220" height="270" rx="28" fill="none" stroke="#2FBF71" stroke-width="6"/>` + ikon('tel', 0, -14, 1.9) + txt('112', 0, 124, 34, '#FFFFFF') + '</g>';
      c += '</g>';
    }
    o += PK(t, .2, 99, c);
    o += BN(t, .15, 1.9, 'x', 'AĞZINA BİR ŞEY VERME', 52, 1215);
    o += BN(t, 4.3, 99, 'v', 'YİNE DE 112', 56, 1215);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'saskin', gf: 'merak', b: [['gubi', .4, 2.0, 'Su da verme!'], ['gufi', 2.2, 4.4, 'Göğüs ağrısı ciddi!']] })
});"""

# 05 — CEVAP YOK → 112 + HOPARLÖR (31,5–37,5): cevap yok (0,1) · 112 çevrilir (1,0) · hoparlör (2,5) · sağlık görevlisi (3,5)
S[5] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#12203A', alt: '#060B16', isik: [540, 800, '#7FD0FF', .18], ikinci: [900, 1500, '#FF6B81', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'tel', 'CEVAP YOK MU?', '#E8323C', .05, 400);
    let c = yer(215);
    const yak = 1 - fd(t, .9, 1.3);
    c += yatan(-340, 215, 1.3, { renk: '#3E8EDE' });
    const ph = (x, y) => `<g transform="translate(${x} ${y})">` + R(-92, -170, 184, 340, 34, '#1B2442') + R(-80, -152, 160, 292, 20, '#0B1433') + `<rect x="-80" y="-152" width="160" height="292" rx="20" fill="none" stroke="#7FD0FF" stroke-width="3" opacity=".5"/>`;
    const d1 = t > 1.0 ? '1' : '', d2 = t > 1.25 ? '1' : '', d3 = t > 1.5 ? '2' : '';
    const spk = fd(t, 2.4, 2.7);
    c += ph(30, 10) + txt(d1 + d2 + d3, 0, -60, 66, '#FFFFFF') + (t > 1.9 && t < 2.5 ? txt('ARANIYOR...', 0, 8, 22, '#7FD0FF') : '') + `<g transform="translate(0 70)"><circle r="${34 + 4 * spk}" fill="${spk > .5 ? '#2FBF71' : '#2A3A6A'}"/>` + `<g transform="scale(.42)">` + hoparlor(0, 0, 1, t, '#FFFFFF').replace('translate(0 0) scale(1)', 'translate(-20 0) scale(1)') + '</g></g></g>';
    if (spk > .5) for (let i = 0; i < 3; i++) { const q = ((t * 1.1 + i / 3) % 1); c += `<circle cx="30" cy="80" r="${60 + 150 * q}" fill="none" stroke="#7FD0FF" stroke-width="5" opacity="${(.6 * (1 - q)).toFixed(2)}"/>`; }
    const op = ob(fd(t, 3.45, 3.9));
    if (op > 0) c += `<g transform="translate(290 -10) scale(${op})">` + R(-125, -140, 250, 270, 30, '#16204A') + `<rect x="-125" y="-140" width="250" height="270" rx="30" fill="none" stroke="#2FBF71" stroke-width="5"/><circle cy="-30" r="44" fill="#F2C9A0"/><path d="M-48 -34 Q-48 -84 0 -84 Q48 -84 48 -34" stroke="#2A2A33" stroke-width="12" fill="none"/><rect x="-62" y="-44" width="18" height="34" rx="8" fill="#2A2A33"/><path d="M-46 0 Q-40 24 -12 22" stroke="#2A2A33" stroke-width="6" fill="none"/><circle cx="-12" cy="22" r="7" fill="#2A2A33"/><circle cx="-14" cy="-32" r="4" fill="#14171F"/><circle cx="14" cy="-32" r="4" fill="#14171F"/><path d="M-9 -12 Q0 -4 9 -12" stroke="#5A1A1A" stroke-width="3.5" fill="none"/>` + R(-60, 40, 120, 60, 24, '#3E8EDE') + txt('SAĞLIK GÖREVLİSİ', 0, 124, 20, '#FFF6E6') + '</g>';
    if (t > 4.3) c += bal('Adım adım söylerim', 215, -190, { fs: 36, kx: 70, ky: 60 });
    o += PK(t, .2, 99, c);
    o += BN(t, 1.0, 99, 'v', '112 · HOPARLÖRE AL', 54, 1215);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'merak', gf: 'merak', ih: [540, 640], b: [['gubi', 1.1, 2.6, 'Ara, ara!'], ['gufi', 3.9, 5.8, 'Dinle, söyler']] })
});"""

# 06 — NEFES KONTROLÜ (37,5–44,0): göğsüne bak (0,4) · 10 sn (2,5) · nabız aramaya kalkma ✕ (4,0)
S[6] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#142034', alt: '#060A14', isik: [540, 800, '#7FD0FF', .16], ikinci: [200, 1500, '#FF6B81', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.5, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'nefes', 'NEFES ALIYOR MU?', '#7FD0FF', .05, 400);
    const nf = t > .4 ? 8 * (.5 + .5 * Math.sin(t * 3.0)) : 0, st = t > 4.0 ? 0 : 1;
    let c = yer(215);
    c += yatan(-250, 215, 2.3, { renk: '#3E8EDE', nf });
    c += `<g opacity="${(.5 + .5 * Math.sin(t * 3.0 + .6)).toFixed(2)}">` + nefesOk(-250 + 34 * 2.3, 215 - 54 * 2.3 - 20, t) + '</g>';
    c += `<g transform="translate(-250 215) scale(2.3)"><path d="M-6 -90 L34 -112 L74 -90" stroke="#FFD23F" stroke-width="3" fill="none" stroke-dasharray="6 6" opacity="0"/></g>`;
    // göz: göğsüne bakan
    c += `<g transform="translate(${-250 + 34 * 2.3} -40)">` + `<path d="M-52 0 Q0 -46 52 0 Q0 46 -52 0Z" fill="#FFFFFF" stroke="#1B2440" stroke-width="6"/><circle cx="${Math.sin(t * 1.2) * 4}" cy="${6 + 4 * Math.sin(t * 3.0)}" r="19" fill="#3E8EDE"/><circle cx="${Math.sin(t * 1.2) * 4}" cy="${6 + 4 * Math.sin(t * 3.0)}" r="9" fill="#14171F"/></g>`;
    if (t < 4.0) c += `<g transform="translate(300 -60)">` + saat(0, 0, 100, fd(t, .8, 3.8) * .999, '#FFD23F') + txt('10 SN', 0, 150, 40, '#FFD23F') + '</g>';
    else c += `<g transform="translate(300 -60)">` + ikon('kalp', 0, 0, 1.0) + isaretX(60, -60, 1.5) + '</g>';
    o += PK(t, .2, 99, c);
    o += BN(t, 2.5, 3.9, 'v', 'EN FAZLA 10 SANİYE', 54, 1215);
    o += BN(t, 4.0, 99, 'x', 'NABIZ ARAMA · VAKİT KAYBI', 50, 1215);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'merak', gf: 'merak', b: [['gubi', .7, 2.3, 'Göğsünü izle!'], ['gufi', 4.2, 6.2, 'Nabızla uğraşma!']] })
});"""

# 07 — NEFES VAR → YAN YATIŞ (44,0–50,4): düzgün nefes (0,1) · kaza geçirmediyse (3,0) · yan çevir (4,1) · ağzı aşağı (5,2)
S[7] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#14282A', alt: '#06100F', isik: [540, 800, '#2FBF71', .16], ikinci: [900, 1500, '#FF6B81', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.4, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'nefes', 'NEFES VAR', '#2FBF71', .05, 400);
    const k = MO.E.inOutCubic(fd(t, 4.1, 5.4)), nf = 8 * (.5 + .5 * Math.sin(t * 3.0));
    let c = yer(215);
    c += yatan(-250, 215, 2.3, { renk: '#3E8EDE', poz: k > 0 ? 'yan' : 'sirtustu', k: k, nf: k > 0 ? 0 : nf, basY: 0 });
    if (k < .2) c += `<g opacity="${(1 - k * 5).toFixed(2)}">` + nefesOk(-250 + 34 * 2.3, 215 - 54 * 2.3 - 20, t, 1, '#2FBF71') + '</g>';
    if (t > 3.0 && t < 4.1) c += `<g transform="translate(290 -120)">` + R(-150, -56, 300, 112, 30, '#0B1433') + `<rect x="-150" y="-56" width="300" height="112" rx="30" fill="none" stroke="#FFD23F" stroke-width="5"/>` + txt('KAZA YOKSA', 0, 16, 46, '#FFD23F') + '</g>';
    if (k > .8) c += `<path d="M${-250 - 100} 100 q30 -50 80 -20" stroke="#FFD23F" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="1 14"/>`;
    o += PK(t, .2, 99, c);
    o += ET(t, 3.0, 4.1, 'KAZA YOKSA', '#FFD23F', '#1B2440', 66, 590, -2);
    o += BN(t, 4.2, 99, 'v', 'YAN ÇEVİR · AĞZI AŞAĞI', 54, 1215);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'mutlu', gf: 'mutlu', b: [['gufi', .9, 2.6, 'Nefes var, tamam!'], ['gubi', 4.5, 6.2, 'Yan yatır!']] })
});"""

# 08 — KUSARSA / KÖPÜRÜRSE (50,4–53,9): sıvı dışarı akar · nefesini izle (2,5)
S[8] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#14282A', alt: '#06100F', isik: [540, 800, '#2FBF71', .16], ikinci: [900, 1500, '#FF6B81', .06] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 3.5, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'bogaz', 'KUSARSA · KÖPÜRÜRSE', '#FFD23F', .05, 400);
    let c = yer(215);
    const ax = -250 - 42 * 2.3;
    c += yatan(-250, 215, 2.3, { renk: '#3E8EDE', poz: 'yan', k: 1 });
    const pd = fd(t, .5, 3.4);
    c += `<ellipse cx="${ax - 12}" cy="214" rx="${14 + 100 * pd}" ry="${3 + 7 * pd}" fill="#C9B24A" opacity=".85"/>`;
    for (let i = 0; i < 6; i++) { const q = ((t * 1.6 + i * .31) % 1.0); if (t > .3) c += `<circle cx="${ax - 18 + (i % 3) * 6 + 2 * Math.sin(i)}" cy="${150 + 62 * q}" r="${7 - 3 * q}" fill="#D8C45A" opacity="${(1 - q * .5).toFixed(2)}"/>`; }
    for (let i = 0; i < 5; i++) c += `<circle cx="${ax - 40 + i * 14}" cy="${112 + (i % 2) * 14}" r="${9 + (i % 3) * 3}" fill="#F4F6FA" opacity="${(.9 * (1 - fd(t, 1.2, 2.4))).toFixed(2)}"/>`;
    c += `<g opacity="${fd(t, 2.4, 2.8).toFixed(2)}">` + nefesOk(-250 + 40 * 2.3, 215 - 40 * 2.3 - 40, t, 1, '#2FBF71') + '</g>';
    o += PK(t, .2, 99, c);
    o += BN(t, .4, 2.4, 'v', 'SIVI DIŞARI AKAR', 54, 1215);
    o += BN(t, 2.5, 99, 'v', 'NEFESİNİ İZLE', 54, 1215);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'saskin', gf: 'merak', b: [['gubi', .5, 2.2, 'Boğulmasın!'], ['gufi', 2.5, 3.5, 'İzle!']] })
});"""

# 09 — KALBİ DURMUŞ SAY (53,9–59,4): nefes yok (0,3) · hırıltılı (1,7) · çok yavaş (2,5) · düzensiz (3,3) · kalbi durmuş say (4,0)
S[9] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1620', alt: '#0B060A', isik: [540, 800, '#E8323C', .2], ikinci: [200, 1500, '#FF6B81', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 5.5, 'kamera']],
  sarsinti: [[4.0, 14]],
  ciz: t => {
    let o = yBas(t, 'kalp', 'AMA ŞUNLARDAN BİRİ VARSA', '#E8323C', .05, 400);
    let c = '';
    const ch = [['NEFES YOK', .3, -215, -215], ['HIRILTILI', 1.65, 215, -215], ['ÇOK YAVAŞ', 2.48, -215, -130], ['DÜZENSİZ', 3.3, 215, -130]];
    ch.forEach(([ad, a, x, y]) => { const s = ob(fd(t, a, a + .3)); if (s > 0) c += `<g transform="translate(${x} ${y}) scale(${s})">` + R(-195, -40, 390, 80, 40, '#0B1433') + `<rect x="-195" y="-40" width="390" height="80" rx="40" fill="none" stroke="#FFD23F" stroke-width="5"/>` + txt(ad, 0, 15, 40, '#FFD23F') + '</g>'; });
    const dead = t > 4.0, ek = t < 4.0 ? (t < 1.6 ? 'normal' : 'duzensiz') : 'duz';
    c += `<g transform="translate(0 40) scale(${1.3 + (dead ? 0 : .05 * Math.sin(t * 8))})" opacity="${dead ? .45 : 1}">` + ikon('kalp', 0, 0, 1.0) + '</g>';
    c += ekg(0, 215, 800, t, ek);
    o += PK(t, .2, 99, c);
    o += ET(t, 4.0, 99, 'KALBİ DURMUŞ SAY', '#E8323C', '#FFFFFF', 74, 1215, -2);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'korku', gf: 'korku', b: [['gubi', 2.5, 4.0, 'Dikkat!'], ['gufi', 4.2, 5.4, 'Kalp durdu!']] })
});"""

# 10 — KALP MASAJI POZİSYONU (59,4–65,4): göğüs ortası, iki el üst üste (0,2–2,7) · kollar dümdüz (2,9) · 5 santim sert bas (4,0–5,6)
S[10] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1620', alt: '#0B060A', isik: [540, 800, '#FF6B81', .2], ikinci: [900, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'kalp', 'KALP MASAJI', '#FF6B81', .05, 400);
    const pa = fd(t, 2.7, 3.0);
    let c = '';
    if (pa < 1) { // A: göğüs üstten — hedef ve iki el
      const el = MO.E.outCubic(fd(t, 1.0, 1.8));
      c += `<g opacity="${(1 - pa).toFixed(2)}" transform="translate(0 30) scale(.9)">` + gogusUst(t, elIki2(170 * (1 - el), -50 + 200 * (1 - el), 1.7, -30 * (1 - el))) + '</g>';
      c += `<g opacity="${(1 - pa).toFixed(2)}">` + R(-150, -306, 300, 46, 23, '#FFD23F') + txt('GÖĞSÜN ORTASI', 0, -273, 30, '#1B2440') + '</g>';
    }
    if (pa > 0) { // B: yandan — kollar dümdüz, 5 cm
      const d = basBirak(t, [[4.4, 4.8]], 13);
      c += `<g opacity="${pa.toFixed(2)}">` + yer(215) + cprFig(-150, 215, 2.0, d);
      const hy = 215 + 2.0 * (-54 + d - 9), top = 215 - 54 * 2.0;
      if (t > 3.0) c += `<g transform="translate(${-150 + 34 * 2.0 + 215} ${hy - 150})" opacity="${fd(t, 3.0, 3.4).toFixed(2)}">` + R(-100, -28, 200, 56, 28, '#FFD23F') + txt('DÜMDÜZ', 0, 14, 36, '#1B2440') + '</g>';
      if (t > 4.0) { const rx = -150 + 34 * 2.0 + 130; c += `<g opacity="${fd(t, 4.0, 4.3).toFixed(2)}"><path d="M${rx} ${top} H${rx + 26} M${rx} ${top + 13 * 2.0 * 1.0} H${rx + 26} M${rx + 13} ${top} V${top + 22}" stroke="#FFFFFF" stroke-width="5"/><line x1="${rx - 40}" y1="${top}" x2="${rx + 40}" y2="${top}" stroke="#7FD0FF" stroke-width="3" stroke-dasharray="8 8"/><line x1="${rx - 40}" y1="${top + 13 * 2.0}" x2="${rx + 40}" y2="${top + 13 * 2.0}" stroke="#E8323C" stroke-width="3"/>` + `<g transform="translate(${rx + 110} ${top + 18})">` + R(-78, -34, 156, 68, 34, '#E8323C') + txt('5 CM', 0, 16, 44, '#FFFFFF') + '</g></g>'; }
      c += '</g>';
    }
    o += PK(t, .2, 99, c);
    o += AD(t, .3, 2.7, 1, 'İKİ ELİN ÜST ÜSTE', 1215, '#FFD23F');
    o += AD(t, 2.9, 99, 2, 'KOLLAR DÜMDÜZ · 5 CM BAS', 1215, '#FFD23F');
    return o;
  },
  onCiz: t => MAS(t, { gd: 'merak', gf: 'kararli', ih: [540, 700], b: [['gubi', 1.3, 3.0, 'Tam ortaya!'], ['gufi', 3.7, 5.6, 'Kollar düz!']] })
});"""

# 11 — BAS–BIRAK (65,4–74,5): tam yüksel (0,3–2,7) · bas,bırak yavaş (3,24–5,2) · 2 Hz (5,9→) · ambulans gelene kadar durma (7,3 · 8,4)
S[11] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1620', alt: '#0B060A', isik: [540, 800, '#FF6B81', .22], ikinci: [900, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 9.1, 'kamera']],
  sarsinti: [[3.24, 6], [4.58, 6]],
  ciz: t => {
    let o = yBas(t, 'kalp', 'BAS · BIRAK', '#FF6B81', .05, 400);
    // demo: 0.3–3.1 yavaş bas-bırak (tam geri yükselme vurgusu); 3.24–5.2 VO ritmi; 5.9+ 2 Hz
    let d;
    if (t < 3.1) d = t < .3 ? 0 : 13 * Math.pow(.5 - .5 * Math.cos(2 * Math.PI * Math.min(1, (t - .3) / 2.4)), .8);
    else if (t < 5.7) d = basBirak(t, [[3.24, 3.84], [4.58, 5.22]], 13);
    else d = cprD(t, 5.9, 2, 13);
    const top = 215 - 54 * 2.0, cx = -150 + 34 * 2.0;
    let c = yer(215) + cprFig(-150, 215, 2.0, d);
    c += `<line x1="${cx - 120}" y1="${top}" x2="${cx + 120}" y2="${top}" stroke="#7FD0FF" stroke-width="3" stroke-dasharray="8 8" opacity=".7"/>`;
    if (t < 3.1) {
      const dn = d > 6 && t < 1.8 || (d > 6 && t > 2.0 && (t - .3) / 2.4 < .5), up = !dn && t > 1.2;
      if ((t - .3) / 2.4 < .5 && t > .3) c += `<g transform="translate(${cx + 230} ${top - 40})"><path d="M0 -50 V20 M-24 0 L0 26 L24 0" stroke="#FFD23F" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + txt('BAS', 0, 80, 40, '#FFD23F') + '</g>';
      else if (t > .3) c += `<g transform="translate(${cx + 230} ${top - 40})"><path d="M0 20 V-50 M-24 -26 L0 -52 L24 -26" stroke="#2FBF71" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + txt('TAM YÜKSELSİN', 0, 80, 34, '#2FBF71') + '</g>';
    } else if (t < 5.7) {
      c += `<g transform="translate(${cx + 230} ${top - 20})">` + txt(d > 6 ? 'BAS' : 'BIRAK', 0, 0, 56, d > 6 ? '#FFD23F' : '#2FBF71') + '</g>';
    } else {
      const bt = Math.floor((t - 5.9) * 4) % 2 === 0;
      c += `<g transform="translate(${cx + 230} ${top - 20}) scale(${1 + .08 * Math.sin((t - 5.9) * 4 * Math.PI)})">` + txt(d > 6 ? 'BAS' : 'BIRAK', 0, 0, 56, d > 6 ? '#FFD23F' : '#2FBF71') + '</g>';
      c += `<g transform="translate(${cx + 230} ${top + 70})">` + R(-100, -32, 200, 64, 32, '#E8323C') + txt('120 / DK', 0, 14, 38, '#FFFFFF') + '</g>';
    }
    if (t > 7.3) { const ax = -380 + 760 * fd(t, 7.3, 9.1); c += ambulans(ax, -190, .7, t); }
    o += PK(t, .2, 99, c);
    o += AD(t, .3, 3.1, 1, 'GÖĞÜS TAMAMEN YÜKSELSİN', 1215, '#FFD23F');
    o += AD(t, 3.2, 5.8, 2, 'BAS · BIRAK · BAS · BIRAK', 1215, '#FFD23F');
    o += AD(t, 5.9, 7.2, 3, 'SANİYEDE 2 KERE', 1215, '#FFD23F');
    o += ET(t, 7.3, 8.3, 'AMBULANS GELENE KADAR', '#0B1433', '#FFD23F', 50, 1215, -1);
    o += ET(t, 8.38, 99, 'DURMA', '#E8323C', '#FFFFFF', 86, 1215, -3);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'kararli', gf: 'kararli', b: [['gufi', 3.4, 5.4, 'Bas! Bırak!'], ['gubi', 7.5, 9.1, 'Durma, durma!']] })
});"""

# 12 — BOĞAZINI TUTUYORSA (74,5–78,5): yemek yerken (0,1) · öksürebiliyorsa karışma (2,4)
S[12] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A2214', alt: '#0B0905', isik: [540, 800, '#FFD23F', .18], ikinci: [200, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.05, 540, 960, 4.0, 'kamera']],
  ciz: t => {
    let o = yBas(t, 'bogaz', 'YEMEK YERKEN', '#FFD23F', .05, 400);
    let c = yer(215);
    // masa + tabak
    c += R(-420, 40, 300, 22, 6, '#8A5A3A') + R(-390, 62, 20, 153, 4, '#6A4128') + R(-170, 62, 20, 153, 4, '#6A4128');
    c += `<ellipse cx="-270" cy="34" rx="90" ry="14" fill="#F4F6FA"/><ellipse cx="-270" cy="30" rx="62" ry="9" fill="#E7EBF2"/><path d="M-310 24 Q-290 -4 -250 14 Q-230 24 -236 26Z" fill="#D58A3A"/>`;
    const sal = Math.sin(t * 9) * 2;
    const pan = fd(t, .2, .6);
    c += dur(120, 215, 1.9, { renk: '#E8774A', shW: 0, hipW: 5, ayak: 'sag', elL: [10, -183], elR: [22, -175], goz: 'genis', agiz: 'korku', ifade: 'korku', basEk: sal });
    c += `<g opacity="${pan.toFixed(2)}"><path d="M170 -125 L270 -150" stroke="#FFD23F" stroke-width="3" stroke-dasharray="8 8"/><g transform="translate(335 -170)"><circle r="104" fill="#2A3556" stroke="#FFD23F" stroke-width="6"/><rect x="-36" y="-90" width="72" height="180" rx="30" fill="#D9626C" stroke="none"/><rect x="-22" y="-84" width="44" height="168" rx="22" fill="#5A1A1A"/><circle cx="0" cy="8" r="25" fill="#D58A3A"/><circle cx="-8" cy="0" r="6" fill="#F0B070"/><path d="M-46 -52 v28 m-9 -9 l9 9 l9 -9 M46 -52 v28 m-9 -9 l9 9 l9 -9" stroke="#E8323C" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="0" y="132" font-size="30" font-weight="900" text-anchor="middle" style="fill:#FFD23F">LOKMA TAKILDI</text></g></g>`;
    for (let i = 0; i < 3; i++) c += `<path d="M${-10 - i * 14} ${-60 + i * 30} h-26 M${270 + i * 14} ${-60 + i * 30} h26" stroke="#FFD23F" stroke-width="6" stroke-linecap="round" opacity="${(.5 + .5 * Math.sin(t * 12 + i)).toFixed(2)}"/>`;
    if (t > 2.45) { for (let i = 0; i < 3; i++) { const q = ((t * 2 + i / 3) % 1); c += `<circle cx="${190 + 120 * q}" cy="${-50 - 16 * q + i * 8}" r="${6 + 8 * q}" fill="#FFFFFF" opacity="${(.7 * (1 - q)).toFixed(2)}"/>`; } c += bal('ÖKS! ÖKS!', 330, -200, { fs: 40, kx: -80, ky: 60 }); }
    o += PK(t, .2, 99, c);
    o += ET(t, .15, 2.35, 'BOĞAZINI TUTUYOR', '#E8323C', '#FFFFFF', 62, 1215, -2);
    o += ET(t, 2.45, 99, 'ÖKSÜREBİLİYORSA KARIŞMA', '#FFD23F', '#1B2440', 48, 1215, -1);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'korku', gf: 'merak', b: [['gubi', .6, 2.3, 'Lokma takıldı!'], ['gufi', 2.7, 4.0, 'Öksürsün!']] })
});"""

# 13 — SIRTA 5 VURUŞ (78,5–85,1): konuşamıyor (0,06) · arkasına geç (1,9) · öne eğ (3,3) · kürek kemikleri (4,0) · 5 vuruş (5,14–6,35)
S[13] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A2214', alt: '#0B0905', isik: [540, 800, '#FFD23F', .18], ikinci: [900, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 6.6, 'kamera']],
  sarsinti: [[5.14, 7], [5.45, 7], [5.75, 7], [6.05, 7], [6.35, 9]],
  ciz: t => {
    let o = yBas(t, 'bogaz', 'NEFES ALAMIYORSA', '#E8323C', .05, 400);
    const S = 1.95, cx = 40, k = MO.E.inOutCubic(fd(t, 3.3, 4.1)), phi = k * 50 * Math.PI / 180;
    const hip = [0, -108], u = [Math.sin(phi), -Math.cos(phi)], sh = [hip[0] + 65 * u[0], hip[1] + 65 * u[1]];
    const hc = [sh[0] + 42 * Math.sin(phi + .35 * k), sh[1] - 42 * Math.cos(phi + .35 * k)];
    const n = [-Math.cos(phi), -Math.sin(phi)];                        // sırt yüzü normali
    const P = [hip[0] + .66 * 65 * u[0] + n[0] * 37, hip[1] + .66 * 65 * u[1] + n[1] * 37];
    const VUR = [5.14, 5.45, 5.75, 6.05, 6.35];
    let vur = 0; VUR.forEach(a => { vur = Math.max(vur, MO.E.outQuad(fd(t, a - .14, a)) * (1 - MO.E.outQuad(fd(t, a, a + .14)))); });
    const rxu = -60 - 260 * (1 - MO.E.outCubic(fd(t, 1.7, 2.9)));
    const el = fd(t, 3.9, 4.4), hang = [rxu + 30, -80], hand = [P[0] - 46 * (1 - vur), P[1] - 56 * (1 - vur)];
    const tutan = [hand[0] * el + hang[0] * (1 - el), hand[1] * el + hang[1] * (1 - el)];
    let c = yer(215);
    c += kisi({ x: cx, y: 215, s: S, sh, hip, bas: hc, ayL: [-8, -8], ayR: [16, -8], elL: [hc[0] + 20, hc[1] + 30], elR: [hc[0] + 26, hc[1] + 24], shW: 0, hipW: 5, prefK: [0, 1], renk: '#E8774A', goz: 'genis', agiz: 'korku', ifade: 'korku', ayak: 'sag' });
    c += kisi({ x: cx, y: 215, s: S, sh: [rxu, -173], hip: [rxu, -108], ayL: [rxu - 8, -8], ayR: [rxu + 14, -8], elL: [rxu - 6, -80], elR: tutan, shW: 0, hipW: 5, renk: '#3E8EDE', agiz: 'duz', ifade: 'odak', prefK: [0, 1], ayak: 'sag' });
    if (t > 4.0) { const gl = .6 + .4 * Math.sin(t * 10); c += `<g transform="translate(${cx} 215) scale(${S})"><circle cx="${hip[0] + .66 * 65 * u[0] + n[0] * 27}" cy="${hip[1] + .66 * 65 * u[1] + n[1] * 27}" r="${20 + 4 * gl}" fill="none" stroke="#FFD23F" stroke-width="${4 / S}" opacity="${fd(t, 4.0, 4.3).toFixed(2)}"/></g>`; }
    let say = 0; VUR.forEach((a, i) => { if (t >= a) say = i + 1; });
    if (say) c += `<g transform="translate(370 -190)"><circle r="56" fill="#E8323C"/>` + txt(String(say), 0, 24, 70, '#FFFFFF') + `</g>`;
    if (k > .02 && k < .98) c += `<path d="M190 -180 q70 10 80 80 M240 -100 l24 14 l-6 -28" stroke="#FFD23F" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    o += PK(t, .2, 99, c);
    o += AD(t, 1.8, 3.3, 1, 'ARKASINA GEÇ', 1215, '#FFD23F');
    o += AD(t, 3.3, 5.0, 2, 'ÖNE EĞDİR', 1215, '#FFD23F');
    o += AD(t, 5.0, 99, 3, 'KÜREK KEMİKLERİ ARASI · 5 VURUŞ', 1215, '#FFD23F');
    return o;
  },
  onCiz: t => MAS(t, { gd: 'kararli', gf: 'kararli', ih: [540, 760], b: [['gubi', 4.1, 5.2, 'Kürek kemiği!'], ['gufi', 5.4, 6.6, '5 sert vuruş!']] })
});"""

# 14 — HEIMLICH (85,1–92,2): arkadan sarıl (0,14) · yumruk göbek üstü (1,84) · beş kere içe ve yukarı (3,7–5,2) · HEIMLICH (5,74)
S[14] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A2214', alt: '#0B0905', isik: [540, 800, '#FFD23F', .2], ikinci: [900, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 7.1, 'kamera']],
  sarsinti: [[3.7, 6], [4.0, 6], [4.3, 6], [4.6, 6], [4.9, 8], [5.74, 12]],
  ciz: t => {
    let o = yBas(t, 'bogaz', 'HEIMLICH MANEVRASI', '#FFD23F', .05, 400);
    const S = 1.95, cx = 30, phi = 12 * Math.PI / 180, hip = [0, -108], u = [Math.sin(phi), -Math.cos(phi)], sh = [hip[0] + 65 * u[0], hip[1] + 65 * u[1]], nr = [Math.cos(phi), Math.sin(phi)];
    const B = [hip[0] + .3 * 65 * u[0] + nr[0] * 35, hip[1] + .3 * 65 * u[1] + nr[1] * 35];
    const TH = [3.7, 4.0, 4.3, 4.6, 4.9];
    let ith = 0; TH.forEach(a => { ith = Math.max(ith, MO.E.outQuad(fd(t, a - .1, a + .08)) * (1 - MO.E.outQuad(fd(t, a + .08, a + .2)))); });
    const F = [B[0] - 20 * ith, B[1] - 18 * ith];
    const rxu = -46 - 330 * (1 - MO.E.outCubic(fd(t, .14, 1.3))), ar = fd(t, 1.1, 1.8);
    const hL = [rxu + 30, -80], hR = [rxu + 34, -76];
    const eL = [F[0] * ar + hL[0] * (1 - ar), (F[1] - 5) * ar + hL[1] * (1 - ar)], eR = [F[0] * ar + hR[0] * (1 - ar), (F[1] + 3) * ar + hR[1] * (1 - ar)];
    let c = yer(215);
    c += kisi({ x: cx, y: 215, s: S, sh, hip, ayL: [-8, -8], ayR: [16, -8], elL: [sh[0] + 22, sh[1] + 40], elR: [sh[0] + 26, sh[1] + 44], shW: 0, hipW: 5, renk: '#E8774A', goz: 'genis', agiz: 'korku', ifade: 'korku', bas: [sh[0] + 12, sh[1] - 40], ayak: 'sag' });
    c += kisi({ x: cx, y: 215, s: S, sh: [rxu, -171], hip: [rxu - 4, -108], ayL: [rxu - 10, -8], ayR: [rxu + 12, -8], elL: eL, elR: eR, shW: 0, hipW: 5, renk: '#3E8EDE', agiz: 'duz', ifade: 'odak', prefK: [0, 1], bas: [rxu + 10, -212], ayak: 'sag' });
    if (ar > .9) c += `<g transform="translate(${cx} 215) scale(${S})">` + yumruk(F[0] + 4, F[1], 1) + '</g>';
    if (t > 1.84 && t < 3.6) c += `<g transform="translate(${cx} 215) scale(${S})" opacity="${fd(t, 1.84, 2.1).toFixed(2)}"><path d="M${B[0] - 12} ${B[1] + 16} h24 M${B[0]} ${B[1] + 4} v24" stroke="#FFD23F" stroke-width="${4 / S}" stroke-linecap="round"/></g>` + `<g transform="translate(${cx + 150 * S * .5 + 120} ${215 - 70 * S - 20})" opacity="${fd(t, 1.84, 2.2).toFixed(2)}">` + R(-120, -30, 240, 60, 30, '#FFD23F') + txt('GÖBEK ÜSTÜ', 0, 14, 34, '#1B2440') + '</g>';
    if (t > 3.5 && t < 5.5) c += `<g transform="translate(${cx} 215) scale(${S})" opacity="${fd(t, 3.5, 3.8).toFixed(2)}"><path d="M${B[0] + 62} ${B[1] + 22} Q${B[0] + 40} ${B[1] + 6} ${B[0] + 20} ${B[1] - 8} Q${B[0] + 4} ${B[1] - 20} ${B[0] - 2} ${B[1] - 44} M${B[0] - 14} ${B[1] - 34} L${B[0] - 2} ${B[1] - 48} L${B[0] + 14} ${B[1] - 36}" stroke="#E8323C" stroke-width="${8 / S}" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    let say = 0; TH.forEach((a, i) => { if (t >= a) say = i + 1; });
    if (say) c += `<g transform="translate(370 -190)"><circle r="56" fill="#E8323C"/>` + txt(String(say), 0, 24, 70, '#FFFFFF') + `</g>`;
    o += PK(t, .2, 99, c);
    o += AD(t, .14, 1.8, 1, 'ARKADAN SARIL', 1215, '#FFD23F');
    o += AD(t, 1.84, 3.6, 2, 'YUMRUK GÖBEĞİN ÜSTÜNDE', 1215, '#FFD23F');
    o += AD(t, 3.65, 5.65, 3, '5 KERE İÇE + YUKARI ÇEK', 1215, '#FFD23F');
    o += ET(t, 5.74, 99, 'HEIMLICH', '#E8323C', '#FFFFFF', 96, 1215, -3);
    return o;
  },
  onCiz: t => MAS(t, { gd: 'kararli', gf: 'kararli', b: [['gubi', 3.8, 5.5, 'İçe ve yukarı!'], ['gufi', 5.9, 7.1, 'Heimlich!']] })
});"""

# 15 — BİLİNCİ KAPANIRSA (92,2–95,4): yığılır (0,3–1,0) · yatır (1,3) · kalp masajına geç (1,94)
S[15] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#2A1620', alt: '#0B060A', isik: [540, 800, '#FF6B81', .2], ikinci: [900, 1500, '#E8323C', .08] }),
  kamera: [[0, 1.0, 540, 960], [.1, 1.04, 540, 960, 3.2, 'kamera']],
  sarsinti: [[1.0, 8]],
  ciz: t => {
    let o = yBas(t, 'kalp', 'BİLİNCİ KAPANIRSA', '#E8323C', .05, 400);
    const S = 2.0, x0 = -170, px = x0 + 168 * S, th = MO.E.inQuad(fd(t, .3, 1.0));
    let c = yer(215);
    if (t < 1.9) c += th < 1 ? dusus(px, 215, S, th, { renk: '#3E8EDE', basEk: Math.sin(t * 20) * 3 * (1 - th) }) : yatan(x0, 215, S, { renk: '#3E8EDE' });
    else c += cprFig(x0, 215, S, cprD(t, 1.95, 2, 13));
    o += PK(t, .2, 99, c);
    o += AD(t, 1.2, 1.9, 1, 'YATIR', 1215, '#FF6B81');
    o += AD(t, 1.95, 99, 2, 'KALP MASAJINA GEÇ', 1215, '#FF6B81');
    return o;
  },
  onCiz: t => MAS(t, { gd: 'korku', gf: 'kararli', b: [['gubi', .6, 1.9, 'Bilinci kapandı!'], ['gufi', 2.2, 3.2, 'Hemen masaj!']] })
});"""

# 16 — STORY'NE AT (95,4–99,8): 4 adımlık özet kart · bilen kişi sen ol (3,0)
S[16] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#241528', alt: '#0A0710', isik: [540, 820, '#FF6B81', .22], ikinci: [900, 1500, '#FFD23F', .08] }),
  kamera: [[0, 1.04, 540, 900], [.1, 1.0, 540, 960, 4.4, 'kamera']],
  ciz: t => {
    let o = ET(t, .05, 99, 'BUNU HİKÂYENE AT', '#FF6B81', '#FFFFFF', 74, 400, -2);
    const satir = [['tel', 'CEVAP YOK → 112', 'HOPARLÖR · SORULARI DİNLE', .8], ['nefes', 'NEFES VAR → YAN ÇEVİR', 'KAZA YOKSA · NEFESİ İZLE', 1.3], ['kalp', 'NEFES YOK → BAS · BIRAK', '5 CM · SANİYEDE 2 · DURMA', 1.8], ['bogaz', 'BOĞULMA → 5 SIRT + 5 KARIN', 'ÖKSÜREMİYORSA · HEIMLICH', 2.3]];
    let c = R(-440 + 8, -320 + 14, 880, 640, 44, '#000', .35) + R(-440, -320, 880, 640, 44, '#0F1838') + `<rect x="-440" y="-320" width="880" height="640" rx="44" fill="none" stroke="#FF6B81" stroke-width="5"/>`;
    c += txt('İLK YARDIM · 4 ADIM', 0, -250, 46, '#FFD23F');
    satir.forEach(([ic, a, b, g], i) => { const s = ob(fd(t, g, g + .35)); if (s <= 0) return; const y = -130 + i * 118; c += `<g transform="translate(0 ${y}) scale(${s})">` + R(-400, -50, 800, 100, 28, '#16204A') + `<circle cx="-340" cy="0" r="34" fill="#FF6B81"/>` + txt(String(i + 1), -340, 14, 40, '#FFFFFF') + ikon(ic, -250, 0, .5) + txt(a, 30, -6, 33, '#FFF6E6') + `<text x="30" y="34" font-size="23" text-anchor="middle" style="fill:#9FB4DA">${b}</text></g>`; });
    o += MO.sar(c, MO.oge(t, { gir: .15, agirlik: 'agir', giris: 'yuksel', materyal: 'plastik', x: 540 }), 540, 800, { golge: false });
    o += ET(t, 3.0, 99, 'BİLEN KİŞİ SEN OL', '#FFD23F', '#1B2440', 54, 1180, -2);
    return o;
  },
  onCiz: t => gubi(t, { x: 880, y: 1650, boy: 150, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 200, y: 1840, boy: 210, duygu: 'mutlu', bakHedef: 'kamera' }) + bm(t, .9, 2.5, 360, 1492, 'Kaydet!', { yon: -1 }) + bm(t, 3.3, 4.4, 720, 1492, 'Sen de bil!', { yon: 1 })
});"""

# 17 — TAKİP (99,8–103,0)
S[17] = r"""
MO.sahne({
  zemin: MO.zemin({ ust: '#101A30', alt: '#0A0F1C', isik: [540, 760, '#FF6B81', .22], supurme: .04 }),
  kamera: [[0, 1.08, 540, 800], [.1, 1.0, 540, 900, 2.6, 'kamera']],
  ciz: t => {
    const kart = R(-380, -150, 760, 300, 40, '#0B1433') + `<rect x="-380" y="-150" width="760" height="300" rx="40" fill="none" stroke="#FF6B81" stroke-width="6"/>` + AU.yaz('gubigufi', 0, -20, 96, '#FFFFFF');
    let o = MO.sar(kart, MO.oge(t, { gir: .04, agirlik: 'kahraman', giris: 'yuksel', materyal: 'plastik', x: 540, bekle: 2 }), 540, 760);
    const bs = t > 2.1 && t < 2.25 ? .92 : 1;
    o += MO.sar(`<g transform="scale(${bs})">` + R(-220, -40, 440, 80, 40, '#FF6B81') + AU.yaz('+ TAKİP ET', 0, 18, 46, '#FFFFFF') + '</g>', MO.oge(t, { gir: 1.4, agirlik: 'orta', giris: 'damga', materyal: 'lastik', x: 540 }), 540, 840, { golge: false });
    return o;
  },
  onCiz: t => gubi(t, { x: 300, y: 1540, boy: 170, duygu: 'mutlu', bakHedef: 'kamera' }) + gufi(t, { x: 780, y: 1720, boy: 220, duygu: 'mutlu', bakHedef: 'kamera' })
});"""
