"""EL ÇİZİMİ MODU demosu (10 sn): kâğıt + titreme + rough.js eskiz + çizilerek belirme + kalem vurguları. Mevcut kitler (KP köpek, maskotlar) aynen."""
import json
SB = [0, 10]
TEP = {1: [('gufi', 3.6, 'zipla'), ('gubi', 6.0, 'aha'), ('gufi', 8.4, 'alkis')]}
exec(open('_head.py').read())
JS = r"""
const C = AU.C;
window.renderAt = t => {
  let w = EC.kagit();
  // eskiz şehir: binalar çizilerek belirir
  const B = [[40, 640, 200, 440, '#9AB0D8'], [250, 540, 170, 540, '#C9A0C8'], [430, 700, 220, 380, '#A8C8A0'], [665, 580, 170, 500, '#E8C08A'], [845, 660, 200, 420, '#9AB0D8']];
  B.forEach(([x, y, bw, bh, c], i) => { const p = A(t, .2 + i * .3, 1.3 + i * .3);
    w += EC.r('rectangle', [x, y, bw, bh], { fill: c, ciz: p, tohum: i * 5, hachureAngle: -41 + i * 7 }, t);
    if (p >= 1) for (let r = 0; r < Math.floor((bh - 60) / 110); r++) w += EC.r('rectangle', [x + 26, y + 40 + r * 110, 44, 56], { fill: '#FFF3D6', fillStyle: 'solid', strokeWidth: 2.2, tohum: i * 9 + r }, t); });
  w += EC.r('line', [0, 1085, 1080, 1078], { strokeWidth: 5, ciz: A(t, .1, 1.2) }, t);
  // köpek: eskiz gölge + mevcut köpek kiti
  const kx = 1250 - 640 * E(A(t, 2.2, 3.8));
  if (t > 2.2) { w += EC.r('ellipse', [kx + 10, 1092, 300, 34], { fill: '#2B2233', fillStyle: 'zigzag', hachureGap: 9, strokeWidth: 1.5, seedSabit: false }, t);
    w += KP.kopek(kx, 1085, 1.25, { yon: -1, mod: t > 3.8 ? 'dost' : 'notr', adim: t < 3.8 ? t * 1.8 : null, t, golge: false }); }
  // maskotlar (aynen)
  w += gufi(t, { yol: [[0, -150, 1770, 230], [3.2, -150, 1770, 230], [3.9, 230, 1770, 230]], x: -150, y: 1770, boy: 230, duygu: 'mutlu', bakHedef: [kx - 100, 960] });
  w += gubi(t, { yol: [[0, 1250, 1600, 160], [3.6, 1250, 1600, 160], [4.4, 860, 1600, 160]], x: 1250, y: 1600, boy: 160, duygu: 'merak', bakHedef: [kx - 100, 960] });
  // kalem vurguları: küpe etrafına daire + ok + etiket
  const kp = A(t, 5.4, 6.2); if (kp > 0 && kx < 700) { const ex = kx - 112 * 1.25 + 18, ey = 1085 - 150 * 1.25 - 40;
    w += EC.daire(ex, ey, 44, 36, kp) + EC.ok(ex + 230, ey - 230, ex + 50, ey - 40, A(t, 5.8, 6.6));
    w += `<g opacity="${A(t, 6.4, 6.7)}">` + AU.yaz('KÜPE', ex + 290, ey - 250, 52, '#E8505B') + '</g>'; }
  // eskiz grafik (sonradan çizilir)
  const g = A(t, 6.8, 9.2);
  if (g > 0) { w += EC.r('rectangle', [120, 1130, 840, 250], { fill: '#FFF8EA', fillStyle: 'solid', strokeWidth: 3, ciz: A(t, 6.8, 7.3), tohum: 77 }, t);
    [[.45, '#4A8AD8'], [.75, '#F2B630'], [1, '#E8505B']].forEach(([v, c], i) => { const hb = 170 * v * E(A(t, 7.2 + i * .45, 7.9 + i * .45)); if (hb > 4) w += EC.r('rectangle', [260 + i * 230, 1350 - hb, 140, hb], { fill: c, tohum: 40 + i, hachureGap: 9 }, t); });
    w += EC.altCiz(250, 830, 1360, A(t, 8.6, 9.3), '#2B2233', 6); }
  let o = EC.defs(t) + EC.titret(kam(w, { y: 1000, k: 1 + .04 * E(A(t, 0, 10)) }));
  // başlık (kendi fontumuz) + kalem alt çizgisi
  const b = pop(t, 4.4);
  if (b > 0) o += grp(AU.yaz('EL ÇİZİMİ MODU', 0, 0, 88, '#2B2233') , 540, 470, b) + EC.titret(EC.altCiz(200, 880, 510, A(t, 4.7, 5.4)));
  o += EC.gren(.55);
  $('dinamik').innerHTML = o;
};"""
JS = r"""
const R = PR.R, h = HK.hash;
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
""" + JS
tp = {'gubi': [[a, b] for k, a, b in TEP[1] if k == 'gubi'], 'gufi': [[a, b] for k, a, b in TEP[1] if k == 'gufi']}
open('sahneler/s01.html', 'w').write(HEAD.replace('__SB__', '0').replace('__TP__', json.dumps(tp)).replace('__JS__', JS))
json.dump({"fps": 30, "genislik": 1080, "yukseklik": 1920, "ses": "sessiz.wav", "cikti": "demo_svg.mp4", "sahneler": [{"dosya": "sahneler/s01.html", "baslangic": 0, "bitis": 10}]}, open('plan.json', 'w'), indent=1)
print('ok')
