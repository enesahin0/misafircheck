// gg.js: gubigufi fırça boyama demosu (10 sn, dikey). Gubi (amber 4 köşeli pırıltı), Gufi (kırmızı kare), sokak köpeği.
// Shot A (0–5): boyalı sokak; köpek gelir, Gufi zıplayarak gelir, Gubi süzülür. Fırça silme.
// Shot B (5–10): yakın plan: Gufi ile köpek burun buruna, boyalı kalpler; Gubi parlar.
(() => {
  const GUBI = '#FBAC39', GUBI_K = '#B4532A', GUFI = '#EE312E', GUFI_K = '#8E1B3F', KOP = '#E0A866', KOP_K = '#A8693A', KOP_A = '#F6D7A6';
  function goz(x, y, r, bx = 0, by = 0, kapali = false) {
    if (kapali) { inkLine([[x - r, y], [x, y - r * .7], [x + r, y]], .9, PAL.ink, 'ink', .6); return; }
    paint(ellPts(x, y, r, r * 1.2, 16, .8), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 });
    paint(ellPts(x + bx * r * .35, y + by * r * .35, r * .5, r * .55, 12), { wash: '#1B1640', ink: null });
    paint(ellPts(x + bx * r * .35 + r * .18, y + by * r * .35 - r * .2, r * .15, r * .15, 8), { wash: '#FFFFFF', ink: null });
  }
  function gufi(x, y, u, t, o = {}) {   // y = ayak tabanı
    boilSeed('gufi');
    const sq = o.sq || 0, w = u * (1 + sq * .6), h = u * (1 - sq);
    for (const s of [-1, 1]) paint(ellPts(x + s * u * .28, y - u * .04, u * .16, u * .09, 12, .8), { wash: GUFI_K, ink: PAL.ink, sw: .6 });
    const top = y - u * .1 - h;
    paint(rrPts(x - w / 2, top, w, h, u * .28, 1.2), { wash: GUFI, hatch: { d: 9, a: .9, b: 'HB', c: GUFI_K, w: .7 }, ink: PAL.ink, sw: 1 });
    paint(rrPts(x - w / 2, top, w * .32, h, u * .2, 1), { wash: GUFI_K, washOp: 120, ink: null });
    const ey = top + h * .4;
    goz(x - u * .17, ey, u * .13, o.bx || 0, o.by || 0, o.mutlu); goz(x + u * .17, ey, u * .13, o.bx || 0, o.by || 0, o.mutlu);
    if (o.mutlu) inkLine([[x - u * .1, ey + u * .2], [x, ey + u * .28], [x + u * .1, ey + u * .2]], .8, PAL.ink, 'ink', .6);
  }
  function gubi(x, y, u, t, o = {}) {   // y = merkez
    glow(x, y, u * 1.5, '#FFD27A', .6);
    boilSeed('gubi');
    push(); translate(x, y); rotate(Math.sin(t * 2) * .08);
    paint(starPts(0, 0, u * .62, .42, 4), { wash: GUBI, hatch: { d: 9, a: -.8, b: 'HB', c: GUBI_K, w: .6 }, ink: PAL.ink, sw: 1, curv: .25 });
    goz(-u * .12, -u * .04, u * .09, o.bx || 0, 0, o.mutlu); goz(u * .12, -u * .04, u * .09, o.bx || 0, 0, o.mutlu);
    pop();
  }
  function kopek(x, y, u, t, o = {}) {   // y = ayak, yüz sağa (o.flip sola)
    boilSeed('kopek');
    push(); translate(x, y); if (o.flip) scale(-1, 1);
    const wag = Math.sin(t * 14) * .5, ad = o.adim, leg = (lx, ph) => { const a = ad == null ? 0 : Math.sin(ad * TAU + ph) * .4;
      push(); translate(lx * u, -u * .9); rotate(a); paint(rrPts(-u * .1, 0, u * .2, u * .92, u * .09, .6), { wash: KOP, ink: PAL.ink, sw: .7 }); pop(); };
    push(); translate(-u * .8, -u * 1.1); rotate(-.5 + wag); paint(ribbon([[0, 0], [-u * .3, -u * .3], [-u * .25, -u * .7]], u * .16, u * .05), { wash: KOP_K, ink: PAL.ink, sw: .7 }); pop();
    leg(-.55, Math.PI); leg(.55, 0);
    paint(ellPts(0, -u * 1.05, u * .9, u * .42, 26, 1.2), { wash: KOP, hatch: { d: 10, a: .3, b: 'HB', c: KOP_K, w: .6 }, ink: PAL.ink, sw: 1 });
    paint(ellPts(u * .55, -u * 1.0, u * .3, u * .32, 14), { wash: KOP_A, washOp: 200, ink: null });
    leg(-.35, 0); leg(.75, Math.PI);
    const hx = u * 1.05, hy = -u * 1.55 + (o.bas || 0);
    paint(ellPts(hx, hy, u * .38, u * .34, 20, 1), { wash: KOP, ink: PAL.ink, sw: 1 });
    paint(ellPts(hx + u * .38, hy + u * .1, u * .26, u * .17, 16, .8), { wash: KOP_A, ink: PAL.ink, sw: .8 });
    paint(ellPts(hx + u * .62, hy + u * .04, u * .08, u * .07, 10), { wash: '#3A2418', ink: null });
    paint([[hx - u * .25, hy - u * .18], [hx - u * .12, hy - u * .7], [hx + u * .06, hy - u * .24]], { wash: KOP_K, ink: PAL.ink, sw: .8 });
    paint(rectPts(hx - u * .2, hy - u * .45, u * .1, u * .08), { wash: '#F2C230', ink: null });   // kulak küpesi
    if (o.dil) paint(ellPts(hx + u * .4, hy + u * .3, u * .08, u * .14, 10), { wash: PAL.rose, ink: PAL.ink, sw: .5 });
    if (o.mutlu) inkLine([[hx + u * .02, hy - u * .06], [hx + u * .1, hy - u * .14], [hx + u * .18, hy - u * .06]], .9, PAL.ink, 'ink', .6);
    else paint(ellPts(hx + u * .1, hy - u * .08, u * .06, u * .07, 8), { wash: '#1B1640', ink: null });
    pop();
  }
  function kalp(x, y, r, k) {
    if (k <= 0 || k >= 1) return;
    boilSeed('kalp' + Math.round(x));
    const s = r * backOut(Math.min(1, k * 3)), p = [];
    for (let i = 0; i < 28; i++) { const a = i / 28 * TAU; p.push([x + s * 16 * Math.sin(a) ** 3 / 16, y - s * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16]); }
    paint(p, { wash: PAL.rose, washOp: 255 * (1 - seg(k, .7, 1)), ink: PAL.ink, sw: .7 });
  }
  function sokak(t) {
    boilSeed('gok'); paint(rectPts(-300, -300, W + 600, H * .62 + 300), { wash: PAL.sky, washOp: 150, ink: null });
    glow(820, 330, 220, '#FFE08A', .8);
    const EV = [[-40, 620, 300, 600, PAL.clayLt], [250, 520, 260, 700, PAL.teal], [500, 680, 300, 540, PAL.ochre], [790, 580, 330, 640, PAL.rose]];
    EV.forEach(([x, yy, w, h, c], i) => { boilSeed('ev' + i);
      paint(rectPts(x, yy, w, h, 2), { wash: mixCol(c, PAL.paper, .25), hatch: { d: 14, a: .7 + i * .2, b: 'HB', c: mixCol(c, PAL.ink, .35), w: .6 }, ink: PAL.ink, sw: .9 });
      for (let r = 0; r < Math.floor((h - 80) / 130); r++) for (let cc = 0; cc < 2; cc++) paint(rectPts(x + 40 + cc * (w - 130), yy + 50 + r * 130, 50, 70, 1.5), { wash: PAL.cream, ink: PAL.ink, sw: .6 }); });
    boilSeed('yer'); paint(rectPts(-200, H * .62, W + 400, H * .5), { wash: mixCol(PAL.sap, PAL.paper, .3), hatch: { d: 16, a: .1, b: 'HB', c: mixCol(PAL.sap, PAL.ink, .4), w: .7 }, ink: PAL.ink, sw: .9 });
  }
  shots([
    [0, (t, lt, dur) => {
      const cz = 1 + .05 * ease(seg(lt, 0, 5));
      camBegin(W / 2, H / 2, cz);
      sokak(t);
      const kx = lerp(1400, 700, ease(seg(lt, .4, 2.4)));
      kopek(kx, 1480, 165, t, { flip: true, adim: lt < 2.4 ? lt * 1.8 : null, mutlu: lt > 2.6, dil: lt > 2.6 });
      const j = jump(lt, 3.2, 3.75, 2.2), gx = lerp(-250, 250, ease(seg(lt, 1.4, 3.0)));
      gufi(gx, 1560 + j.dy * 60, 260, t, { sq: j.sq, bx: 1, mutlu: lt > 3.8 });
      gubi(lerp(1250, 880, ease(seg(lt, 2.0, 3.6))), 1040 + wob(t, .6) * 18, 210, t, { bx: -1, mutlu: lt > 3.9 });
      camEnd();
      if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [PAL.clayDk, PAL.clay]);
    }],
    [5, (t, lt, dur) => {
      camBegin(W / 2, H * .62, 1.35 + .08 * ease(seg(lt, 0, 5)));
      boilSeed('gok2'); paint(rectPts(-400, -400, W + 800, H + 800), { wash: mixCol(PAL.rose, PAL.paper, .55), ink: null });
      glow(540, 1050, 380, '#FFE08A', .7);
      boilSeed('yer2'); paint(rectPts(-400, 1560, W + 800, 900), { wash: mixCol(PAL.sap, PAL.paper, .3), hatch: { d: 16, a: .1, b: 'HB', c: mixCol(PAL.sap, PAL.ink, .4), w: .7 }, ink: PAL.ink, sw: .9 });
      kopek(700, 1560, 150, t, { flip: true, mutlu: true, dil: true, bas: Math.sin(t * 3) * 6 });
      const j = jump(lt, 1.6, 2.1, 1.2);
      gufi(300, 1570 + j.dy * 50, 210, t, { sq: j.sq, mutlu: true });
      gubi(520, 880 + wob(t, .5) * 20, 150, t, { mutlu: lt > .8 });
      [[430, 1100, 1.0], [560, 1000, 2.0], [380, 960, 2.8], [600, 1150, 3.5]].forEach(([x, y, t0]) => kalp(x, y - 160 * seg(lt, t0, t0 + 1.4), 46, seg(lt, t0, t0 + 1.4)));
      camEnd();
      if (lt < .3) brushWipe(.5 + lt / .6, [PAL.clayDk, PAL.clay]);
    }],
  ]);
})();
