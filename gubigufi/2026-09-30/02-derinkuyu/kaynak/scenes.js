// #2 Derinkuyu — sahneler (zamanlar ses.mp3'ten ölçüldü)
const CAT = { name: 'TÜRKİYE & ANADOLU', color: '#E07A3F' };
const TERRA = '#E07A3F', AUDIO_END = 63.79, END = 65.9;
const HITS = [1.55, 3.0, 4.62];
IMPACTS.push([1.55, 10], [3.0, 13], [4.62, 24], [12.95, 12], [14.75, 14], [43.9, 22], [34.2, 5]);

const CAP = [
  [0.0, 1.49, "*1963'te,*"], [1.68, 5.14, "*Nevşehir'de* bir adam evini tamir ederken bir *duvarı* yıktı."],
  [5.73, 6.78, 'Duvarın arkasında...'], [7.23, 8.74, '*karanlık* bir *tünel* vardı.'],
  [9.31, 10.67, 'Tünel *aşağı* iniyordu.'], [11.21, 12.09, 'Sonra bir *oda.*'], [12.56, 13.92, 'Sonra bir *kat* daha.'], [14.38, 15.54, 'Ve bir *kat* daha.'],
  [16.28, 17.51, 'Burası *Derinkuyu.*'], [17.98, 20.39, 'Yerin yaklaşık *seksen metre* altına inen,'], [20.53, 21.93, 'koca bir *yeraltı şehri.*'],
  [22.41, 23.42, 'İçinde *ahırlar,*'], [23.66, 24.80, '*şarap* mahzenleri,'], [25.11, 25.61, '*kuyular,*'], [25.92, 27.12, 'hatta bir *kilise* var.'],
  [27.63, 29.21, 'Tahminen *yirmi bin* kişi,'], [29.48, 32.01, 'hayvanlarıyla birlikte burada *saklanabiliyordu.*'],
  [32.50, 33.15, 'Peki *neden?*'], [33.65, 35.36, 'Çünkü yukarıda *savaş* vardı.'], [35.81, 36.90, '*Tehlike* geldiğinde,'], [37.17, 39.17, 'bütün kasaba *yerin altına* iniyordu.'],
  [39.63, 40.10, 'Kapılar,'], [40.37, 42.51, '*yüzlerce kiloluk* yuvarlak taşlardı.'], [42.97, 45.22, 'Ve sadece *içeriden* kapatılabiliyordu.'],
  [45.71, 46.91, 'Bacalar temiz *hava,*'], [47.18, 48.47, 'kuyular *su* taşıyordu.'],
  [48.94, 50.50, '*Rivayete* göre bir tünel,'], [50.84, 51.88, '*kilometrelerce* öteki'], [52.0, 54.69, '*Kaymaklı* yeraltı şehrine kadar uzanıyor.'],
  [55.11, 56.11, 'Ve bütün bunlar,'], [56.46, 57.35, '*yüzyıllarca,*'], [57.61, 60.26, 'sıradan bir evin *duvarının arkasında* bekledi.'],
  [60.85, 61.32, 'Peki...'], [61.65, 63.56, '*senin* duvarının arkasında ne var?'],
];
const TUFF = ['#e3c29a', '#c99d70', '#a97a52', '#7d5638', '#4e3322', '#2a1b12'];

// ======================================================================
// DUVAR (ön görünüm) — açılış ve kapanış
const BLOCKS = (() => { const R = rng(12), o = []; const bh = 118; for (let r = 0; r * bh < H + bh; r++) { const off = (r % 2) * 95; for (let x = -190 + off; x < W + 190; x += 190) { const w = 190 - 6, y = r * bh; o.push({ x: x + 3, y: y + 3, w, h: bh - 6, c: R(), vx: (R() - .5), vy: (R() - .5), vr: (R() - .5) * 4, d: R() }); } } return o; })();
const HOLE = { x: 500, y: 900, rx: 320, ry: 430 };
const inHole = b => { const cx = b.x + b.w / 2, cy = b.y + b.h / 2; return ((cx - HOLE.x) / HOLE.rx) ** 2 + ((cy - HOLE.y) / HOLE.ry) ** 2 < 1; };
const CRACKS = (() => { const R = rng(31), o = []; for (let k = 0; k < 3; k++) { const set = []; for (let b = 0; b < 4 + k * 2; b++) { let x = HOLE.x + (R() - .5) * 60, y = HOLE.y + (R() - .5) * 60; const pts = [[x, y]]; const a = R() * 6.28; for (let i = 0; i < 6; i++) { x += Math.cos(a + (R() - .5)) * (40 + k * 18); y += Math.sin(a + (R() - .5)) * (40 + k * 18); pts.push([x, y]); } set.push(pts); } o.push(set); } return o; })();
function tunnelView(t, depth = 0, lit = .5) { // karanlık tünel perspektifi
  ctx.fillStyle = '#070403'; ctx.fillRect(0, 0, W, H);
  const vx = HOLE.x, vy = HOLE.y + 80;
  const arch = (w, h, y) => { const x = vx - w / 2; ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(vx, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); };
  for (let i = 16; i >= 0; i--) {
    const z = i + 1 - (depth % 1); if (z < .15) continue; const k = 1 / (z * .42 + .12); const a = cl(lit * (1.5 - z * .1));
    const w = 560 * k, h = 760 * k, y = vy - h * .55 + z * 6;
    ctx.fillStyle = mix('#070403', i % 2 ? '#c99d70' : '#b08660', a); ctx.beginPath(); arch(w, h, y); arch(w * .9, h * .93, y + h * .05); ctx.fill('evenodd');
  }
}
function wallScene(t, { broken = -1, rebuild = -1, crackLight = 0, man = true, push = 1 } = {}) {
  // broken: kırılma anından beri geçen süre; rebuild: 0..1 geri örülme
  ctx.save(); ctx.translate(HOLE.x, HOLE.y); ctx.scale(push, push); ctx.translate(-HOLE.x, -HOLE.y);
  const holeOpen = broken >= 0 && rebuild < 1;
  if (holeOpen) { ctx.save(); tunnelView(t, 0, .35 + .15 * Math.sin(t * 2)); ctx.restore(); }
  for (const b of BLOCKS) {
    let x = b.x, y = b.y, r = 0, s = 1, a = 1;
    const fly = holeOpen && inHole(b);
    if (fly) {
      let p = broken; if (rebuild >= 0) p = (1 - ease.io(cl(rebuild * 1.15 - b.d * .15))) * 1.6;
      if (p > 1.6) continue; s = 1 + p * p * 2.2; const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      x = HOLE.x + (cx - HOLE.x) * s + b.vx * 500 * p - b.w / 2; y = HOLE.y + (cy - HOLE.y) * s + b.vy * 400 * p + 500 * p * p - b.h / 2; r = b.vr * p; a = cl(1.6 - p);
    }
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x + b.w / 2, y + b.h / 2); ctx.rotate(r); ctx.scale(s, s);
    ctx.fillStyle = mix('#b8906a', '#d9b48a', b.c); rr(-b.w / 2, -b.h / 2, b.w, b.h, 8); ctx.fill();
    ctx.fillStyle = 'rgba(80,50,30,.18)'; ctx.fillRect(-b.w / 2, b.h / 2 - 12, b.w, 12);
    ctx.restore();
  }
  // çatlaklar
  if (!holeOpen || rebuild >= 1) HITS.forEach((h, k) => { if (broken >= 0 && rebuild < 1) return; const p = ease.outC(pr(t, h, h + .25)); if (p <= 0) return; ctx.strokeStyle = 'rgba(40,22,12,.85)'; ctx.lineWidth = 5 - k; ctx.lineCap = 'round'; for (const c of CRACKS[k]) strokeProgress(c, p); });
  if (crackLight > 0) { ctx.save(); ctx.strokeStyle = COL.amber; ctx.shadowColor = COL.amber; ctx.shadowBlur = 40; ctx.lineCap = 'round'; ctx.lineWidth = 3 + 5 * crackLight; for (const c of CRACKS[2]) strokeProgress(c, cl(crackLight * 1.3)); ctx.restore(); glowCircle(HOLE.x, HOLE.y, 500 * crackLight, COL.amber, .5 * crackLight); }
  // lamba ışığı
  const g = ctx.createRadialGradient(150, 700, 50, 300, 900, 1300); g.addColorStop(0, 'rgba(251,172,57,.18)'); g.addColorStop(1, 'rgba(10,5,3,.72)'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  ctx.restore();
  if (man) { // ön planda balyozlu adam
    let ang = -2.6; for (const h of HITS) { if (t > h - .55 && t < h + .3) { const up = ease.io(pr(t, h - .55, h - .12)), dn = ease.inC(pr(t, h - .12, h)); ang = lerp(lerp(-1.2, -2.9, up), -.15, dn); if (t > h) ang = lerp(-.15, -1.0, pr(t, h, h + .3)); } }
    if (t > HITS[2] + .3) ang = -1.0;
    person(230, 1640, 620, { sledge: ang, color: '#0b0604', face: 1, hat: false, hair: false, tunic: false });
  }
}
// ======================================================================
// ODALAR (iniş)
function chamber(k, t) {
  const R = rng(100 + k);
  ctx.fillStyle = mix('#8a6446', '#5a3d28', k / 4); ctx.fillRect(0, 0, W, H);
  // oyulmuş tavan kemeri
  ctx.fillStyle = mix('#c99d70', '#8a6446', k / 4); ctx.beginPath(); ctx.moveTo(40, 1500); ctx.lineTo(40, 560); ctx.quadraticCurveTo(540, 260, 1040, 560); ctx.lineTo(1040, 1500); ctx.fill();
  // nişler
  for (let i = 0; i < 3; i++) { const x = 170 + i * 280, y = 760 + (R() - .5) * 60; ctx.fillStyle = 'rgba(40,22,12,.75)'; ctx.beginPath(); ctx.moveTo(x - 70, y + 190); ctx.lineTo(x - 70, y + 50); ctx.arc(x, y + 50, 70, Math.PI, 0); ctx.lineTo(x + 70, y + 190); ctx.fill();
    if (i === (k % 3)) { glowCircle(x, y + 120, 260, COL.amber, .5 + .1 * Math.sin(t * 13 + k)); ctx.fillStyle = '#6b3a1a'; ctx.fillRect(x - 22, y + 150, 44, 16); ctx.fillStyle = COL.amber; ctx.beginPath(); ctx.ellipse(x, y + 132 + Math.sin(t * 20) * 2, 9, 20, 0, 0, 7); ctx.fill(); } }
  // taş dokusu
  for (let i = 0; i < 220; i++) { ctx.fillStyle = R() < .5 ? 'rgba(255,230,190,.07)' : 'rgba(40,20,5,.10)'; ctx.beginPath(); ctx.arc(R() * W, 400 + R() * 1200, 2 + R() * 5, 0, 7); ctx.fill(); }
  // zemin + delik
  ctx.fillStyle = mix('#6e4d33', '#3e2a1b', k / 4); ctx.fillRect(0, 1500, W, 420);
  ctx.fillStyle = '#0a0503'; ctx.beginPath(); ctx.moveTo(360, 1560); ctx.lineTo(620, 1560); ctx.lineTo(680, 1700); ctx.lineTo(300, 1700); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3e2a1b'; ctx.lineWidth = 8; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(420, 1580 + i * 40); ctx.lineTo(560, 1580 + i * 40); ctx.stroke(); }
  const g = ctx.createRadialGradient(540, 900, 200, 540, 1000, 1100); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(8,4,2,.8)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function sceneDescent(t) {
  if (t < 11.21) { // tünelde dalış
    const d = ease.inQ(pr(t, 9.0, 11.21)) * 9 + (t - 9) * .6; tunnelView(t, d, .55);
    const fl = pr(t, 10.9, 11.21); if (fl > 0) { glowCircle(HOLE.x, HOLE.y, 900 * fl, '#f3d7a0', fl); }
    return;
  }
  const drops = [12.56, 14.38]; let lvl = 0, off = 0;
  for (const d of drops) { if (t >= d) { const p = ease.io(pr(t, d, d + .45)); if (p >= 1) lvl++; else off = p; } }
  const base = lvl;
  ctx.save(); ctx.translate(0, -off * H); chamber(base, t); ctx.translate(0, H); if (off > 0) chamber(base + 1, t); ctx.restore();
  if (off > 0 && off < 1) { ctx.strokeStyle = 'rgba(255,230,190,.25)'; ctx.lineWidth = 3; const R = rng(Math.floor(t * 30)); for (let i = 0; i < 24; i++) { const x = R() * W, y = R() * H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 200 * Math.sin(off * Math.PI)); ctx.stroke(); } }
  const fl = 1 - pr(t, 11.21, 11.5); if (fl > 0) { ctx.fillStyle = rgba('#f3d7a0', fl); ctx.fillRect(0, 0, W, H); }
  // kat etiketi
  const shown = off > .5 ? base + 2 : base + 1;
  const kp = ease.back(pr(t, [11.3, 12.8, 14.6][shown - 1] || 99, ([11.3, 12.8, 14.6][shown - 1] || 99) + .3));
  ctx.save(); ctx.translate(SAFE.cx, 520); ctx.scale(kp, kp); text('▼ ' + shown + '. KAT', 0, 0, { size: 96, align: 'center', shadow: 30 }); ctx.restore();
}

// ======================================================================
// ŞEHİR KESİTİ
const SURF = 330, LV = l => 440 + l * 118;
const RAMP = [[300, SURF], ...Array.from({ length: 8 }, (_, l) => [l % 2 ? 300 : 640, LV(l)])];
const ROOMS = (() => { const R = rng(71), o = [];
  for (let l = 0; l < 8; l++) { const rx = l % 2 ? 300 : 640; const cands = [150, 470, 800].filter(x => Math.abs(x - rx) > 120);
    for (const x0 of cands) { if (R() < .15) continue; o.push({ x: x0 + (R() - .5) * 50, y: LV(l) + (R() - .5) * 14, rx: 52 + R() * 26, ry: 30 + R() * 6, l, lx: rx }); } }
  return o; })();
const SPECIAL = { ahir: ROOMS.find(r => r.l === 1), sarap: ROOMS.find(r => r.l === 2 && r.x > 400) || ROOMS.find(r => r.l === 2), kilise: ROOMS.find(r => r.l === 5) };
const VENT = [[805, SURF], [805, 1330]], WELL = [[112, SURF], [112, 1330]];
function drawCity(t, { lit = {}, air = 0, water = 0, people = 0, dx = 0, scale = 1, surfaceFx = null, bg = true } = {}) {
  ctx.save(); ctx.translate(dx, 0);
  if (bg) {
  // gökyüzü
  const sky = ctx.createLinearGradient(0, -600, 0, SURF); sky.addColorStop(0, '#1d1230'); sky.addColorStop(1, '#e0874a'); ctx.fillStyle = sky; ctx.fillRect(-3000, -2000, 9000, SURF + 2000);
  if (surfaceFx) surfaceFx();
  // toprak katmanları
  for (let i = 0; i < 6; i++) { ctx.fillStyle = TUFF[i]; ctx.beginPath(); const y0 = SURF + i * 180; ctx.moveTo(-3000, y0); for (let x = -3000; x <= 6000; x += 60) ctx.lineTo(x, y0 + 10 * Math.sin(x * .01 + i)); ctx.lineTo(6000, 4000); ctx.lineTo(-3000, 4000); ctx.fill(); }
  }
  // evler
  for (const [x, w, h] of [[160, 110, 70], [300, 120, 90], [455, 100, 64], [610, 130, 80], [770, 110, 70]]) { ctx.fillStyle = '#e8cfa8'; ctx.fillRect(x - w / 2, SURF - h, w, h); ctx.fillStyle = '#c9a57a'; ctx.fillRect(x - w / 2 - 6, SURF - h - 10, w + 12, 12); ctx.fillStyle = '#3a2618'; ctx.fillRect(x - 12, SURF - 38, 24, 38); }
  // kazılmış boşluklar
  const dark = '#2a170c';
  ctx.strokeStyle = dark; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = 14; ctx.beginPath(); RAMP.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
  ctx.lineWidth = 10; for (const r of ROOMS) { ctx.beginPath(); ctx.moveTo(r.lx, LV(r.l)); ctx.lineTo(r.x, r.y); ctx.stroke(); }
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(...VENT[0]); ctx.lineTo(...VENT[1]); ctx.stroke(); ctx.beginPath(); ctx.moveTo(...WELL[0]); ctx.lineTo(...WELL[1]); ctx.stroke();
  for (const r of ROOMS) { ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(251,172,57,.10)'; ctx.beginPath(); ctx.ellipse(r.x, r.y + r.ry * .35, r.rx * .7, r.ry * .4, 0, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,230,190,.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  // kilise haç planı
  const K = SPECIAL.kilise; ctx.fillStyle = dark; ctx.fillRect(K.x - 22, K.y - 60, 44, 120); ctx.fillRect(K.x - 70, K.y - 22, 140, 44);
  // aydınlanan odalar
  for (const [key, a] of Object.entries(lit)) { if (a <= 0) continue; const r = SPECIAL[key]; if (!r) continue; ctx.save(); ctx.beginPath(); ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, 7); if (key === 'kilise') { ctx.rect(r.x - 22, r.y - 60, 44, 120); ctx.rect(r.x - 70, r.y - 22, 140, 44); } ctx.clip(); glowCircle(r.x, r.y, 160, COL.amber, .9 * a); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#2a160c';
    if (key === 'ahir') for (let i = 0; i < 3; i++) { const x = r.x - 40 + i * 38, y = r.y + 20; ctx.beginPath(); ctx.ellipse(x, y - 14, 15, 9, 0, 0, 7); ctx.fill(); ctx.fillRect(x + 10, y - 22, 8, 7); ctx.fillRect(x - 11, y - 8, 3, 10); ctx.fillRect(x + 8, y - 8, 3, 10); }
    if (key === 'sarap') { ctx.beginPath(); ctx.ellipse(r.x - 20, r.y + 18, 34, 10, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7a1f3d'; ctx.beginPath(); ctx.ellipse(r.x - 20, r.y + 16, 26, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2a160c'; ctx.beginPath(); ctx.ellipse(r.x + 40, r.y + 5, 12, 22, 0, 0, 7); ctx.fill(); }
    if (key === 'kilise') { ctx.fillStyle = COL.cream; ctx.fillRect(r.x - 3, r.y - 22, 6, 36); ctx.fillRect(r.x - 12, r.y - 12, 24, 6); }
    ctx.restore(); }
  // kuyu suyu
  if (water > 0) { const top = lerp(1330, 1060, ease.outC(water)); ctx.fillStyle = '#3d8bfd'; ctx.fillRect(WELL[0][0] - 8, top, 16, 1330 - top); glowCircle(WELL[0][0], top, 80, '#3d8bfd', .5 * water); }
  if (lit.kuyu > 0) { ctx.save(); ctx.globalAlpha = lit.kuyu; ctx.fillStyle = '#3d8bfd'; ctx.fillRect(WELL[0][0] - 8, 1280, 16, 50); glowCircle(WELL[0][0], 1300, 120, '#3d8bfd', .7); ctx.restore(); }
  // hava akımı
  if (air > 0) { ctx.save(); ctx.globalAlpha = air; ctx.strokeStyle = '#dff3ff'; ctx.lineWidth = 5; ctx.setLineDash([26, 34]); ctx.lineDashOffset = -t * 260; ctx.beginPath(); ctx.moveTo(...VENT[0]); ctx.lineTo(...VENT[1]); ctx.stroke();
    for (const r of ROOMS) { ctx.beginPath(); ctx.moveTo(r.lx, LV(r.l)); ctx.lineTo(r.x, r.y); ctx.stroke(); } ctx.setLineDash([]); ctx.restore(); }
  // insanlar (noktalar)
  if (people > 0) { const R = rng(90); ctx.fillStyle = COL.cream; for (let i = 0; i < 700; i++) { const st = R() * .7, room = ROOMS[Math.floor(R() * ROOMS.length)], ox = (R() - .5) * room.rx * 1.5, oy = (R() - .5) * room.ry * 1.2; const p = cl((people - st) / .3); if (p <= 0) continue;
      // girişten rampadan inip odaya
      const path = RAMP.slice(0, room.l + 2).concat([[room.x + ox, room.y + oy]]); const L = path.length - 1; const q = ease.io(p) * L; const k = Math.min(L - 1, Math.floor(q)), f = q - k;
      const x = lerp(path[k][0], path[k + 1][0], f), y = lerp(path[k][1], path[k + 1][1], f); ctx.fillRect(x - 2.5, y - 2.5, 5, 5); } }
  ctx.restore();
}
// kamera: dünya -> ekran
function cam(cx, cy, s) { ctx.translate(540, 900); ctx.scale(s, s); ctx.translate(-cx, -cy); }
const CAMKEYS = [ // [t, cx, cy, s]
  [16.28, SPECIAL.sarap.x, SPECIAL.sarap.y, 9], [17.5, 520, 860, 1], [22.2, 520, 860, 1],
  [22.7, SPECIAL.ahir.x, SPECIAL.ahir.y, 2.3], [23.4, SPECIAL.ahir.x, SPECIAL.ahir.y, 2.4], [23.9, SPECIAL.sarap.x, SPECIAL.sarap.y, 2.3], [24.9, SPECIAL.sarap.x, SPECIAL.sarap.y, 2.4],
  [25.3, 150, 1180, 2.0], [25.8, 150, 1180, 2.1], [26.3, SPECIAL.kilise.x, SPECIAL.kilise.y, 2.3], [27.1, SPECIAL.kilise.x, SPECIAL.kilise.y, 2.4], [27.7, 520, 860, 1],
  [32.3, 520, 860, 1], [33.2, 470, 330, 1.9], [39.3, 470, 330, 1.9],
];
function camAt(t, keys) { if (t <= keys[0][0]) return keys[0].slice(1); for (let i = 1; i < keys.length; i++) { if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i]; const p = ease.io((t - a[0]) / (b[0] - a[0])); const s = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), p)); return [lerp(a[1], b[1], p), lerp(a[2], b[2], p), s]; } } return keys[keys.length - 1].slice(1); }
// yüzeyde savaş
function raid(t) {
  const red = pr(t, 33.65, 34.4); if (red > 0) { ctx.fillStyle = `rgba(160,20,10,${.45 * red})`; ctx.fillRect(-3000, -2000, 9000, SURF + 2000); }
  // atlılar
  if (t > 33.9) { for (let i = 0; i < 5; i++) { const x = lerp(1250 + i * 90, 700 + i * 90, ease.outC(pr(t, 33.9 + i * .1, 35.5))) , y = SURF; ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); ctx.fillStyle = '#120806';
      const ph = t * 16 + i; ctx.beginPath(); ctx.ellipse(0, -32, 30, 13, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(24, -38); ctx.lineTo(44, -58); ctx.lineTo(50, -52); ctx.lineTo(32, -30); ctx.fill();
      ctx.lineWidth = 5; ctx.strokeStyle = '#120806'; for (const [lx, o] of [[-20, 0], [-12, 3], [16, 1.5], [22, 4.5]]) { ctx.beginPath(); ctx.moveTo(lx, -24); ctx.lineTo(lx + Math.sin(ph + o) * 10, 0); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(-2, -62, 7, 0, 7); ctx.fill(); ctx.fillRect(-6, -56, 10, 18); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, -50); ctx.lineTo(40, -95); ctx.stroke(); ctx.restore(); } }
  // oklar
  if (t > 34.2) { const R = rng(3); for (let i = 0; i < 26; i++) { const st = 34.2 + R() * 4, p = pr(t, st, st + .7); if (p <= 0 || p >= 1) continue; const x0 = 900 + R() * 400, x = lerp(x0, x0 - 500, p), y = lerp(-250, SURF - 10, p * p); ctx.strokeStyle = '#1a0c06'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 26, y - 20 + p * 10); ctx.stroke(); } }
  // kaçan köylüler
  if (t > 35.8) { const R = rng(5); for (let i = 0; i < 9; i++) { const x0 = 100 + R() * 650, st = 35.8 + R() * 1.6, p = ease.inQ(pr(t, st, st + 1.2)); if (p >= 1) continue; const x = lerp(x0, 300, p); person(x, SURF, 46, { phase: t * 18 + i, walk: 1, face: x0 > 300 ? -1 : 1, color: '#120806' }); } }
}
function sceneCity(t) {
  const [cx, cy, s] = camAt(t, CAMKEYS);
  ctx.save(); cam(cx, cy, s);
  drawCity(t, { lit: { ahir: pr(t, 22.41, 22.8), sarap: pr(t, 23.66, 24.0), kuyu: pr(t, 25.11, 25.4), kilise: pr(t, 25.92, 26.3) }, people: pr(t, 29.3, 32.0) * 1 + 0, surfaceFx: () => raid(t) });
  ctx.restore();
  // iniş odasından çıkış (içeriden uzaklaşma)
  const fo = 1 - pr(t, 16.28, 16.75); if (fo > 0) { ctx.save(); ctx.globalAlpha = fo; chamber(2, t); ctx.restore(); }
  // başlık + derinlik cetveli
  const ta = pr(t, 16.35, 16.5) * (1 - pr(t, 21.9, 22.3));
  if (ta > 0) {
    const title = 'DERİNKUYU'; font(900, 130); let x = SAFE.cx - ctx.measureText(title).width / 2;
    for (let i = 0; i < title.length; i++) { const p = ease.back(pr(t, 16.35 + i * .05, 16.65 + i * .05)); const cw = ctx.measureText(title[i]).width; if (p > 0) text(title[i], x, 430 - (1 - p) * 80, { size: 130, alpha: ta * cl(p * 2), shadow: 30 }); x += cw; font(900, 130); }
  }
  const ra = pr(t, 17.6, 17.9) * (1 - pr(t, 21.9, 22.3));
  if (ra > 0 && s < 1.2) {
    const fill = ease.io(pr(t, 17.98, 20.2)); const X = 60, y0 = (SURF - cy) * s + 900, y1 = (1330 - cy) * s + 900;
    ctx.save(); ctx.globalAlpha = ra; ctx.strokeStyle = rgba(COL.cream, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, y1); ctx.stroke();
    for (let m = 0; m <= 80; m += 10) { const y = lerp(y0, y1, m / 80); ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(X + (m % 40 ? 12 : 22), y); ctx.stroke(); }
    ctx.strokeStyle = COL.amber; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, lerp(y0, y1, fill)); ctx.stroke();
    ctx.restore();
    const my = lerp(y0, y1, fill); text(Math.round(80 * fill) + ' M', X + 30, my + 14, { fam: 'JetBrains Mono', w: 700, size: 44, color: COL.amber, alpha: ra, shadow: 20 });
  }
  // oda etiketleri
  const lab = (s_, key, a0, a1) => { const a = pr(t, a0, a0 + .25) * (1 - pr(t, a1, a1 + .25)); if (a <= 0) return; text(s_, SAFE.cx, 640, { fam: 'JetBrains Mono', w: 700, size: 48, align: 'center', alpha: a, color: COL.cream, ls: 6, shadow: 20 }); };
  ctx.save(); lab('AHIR', 'ahir', 22.5, 23.5); lab('ŞARAP MAHZENİ', 'sarap', 23.75, 24.95); lab('KUYU', 'kuyu', 25.15, 25.85); lab('KİLİSE', 'kilise', 25.95, 27.2); ctx.restore();
  // 20.000
  const cp = pr(t, 27.6, 27.8) * (1 - pr(t, 31.9, 32.3)); if (cp > 0) { ctx.fillStyle = `rgba(20,12,8,${.75 * cp})`; rr(SAFE.cx - 330, 400, 660, 260, 30); ctx.fill(); const v = fmt(Math.round(20000 * ease.outC(pr(t, 27.63, 28.9)) / 10) * 10); text('~' + v, SAFE.cx, 560, { size: 170, align: 'center', alpha: cp, shadow: 40 }); text('KİŞİ · TAHMİNİ', SAFE.cx, 630, { fam: 'JetBrains Mono', w: 700, size: 34, align: 'center', color: COL.amber, alpha: cp, ls: 4 }); }
  // Peki neden?
  const q = pr(t, 32.5, 32.7) * (1 - pr(t, 33.5, 33.8)); if (q > 0) { ctx.save(); ctx.translate(SAFE.cx, 800); const k = ease.back(pr(t, 32.5, 32.8)); ctx.scale(k, k); text('?', 0, 90, { size: 300, align: 'center', color: COL.amber, alpha: q, shadow: 40 }); ctx.restore(); }
  const war = pr(t, 33.7, 34.0) * (1 - pr(t, 36.0, 36.3)); if (war > 0) stamp('SAVAŞ', 380, 520, war, { color: COL.red, size: 60, rot: -.08 });
}

// ======================================================================
// SÜRGÜ TAŞ KAPI
function sceneDoor(t) {
  ctx.fillStyle = '#3e2a1b'; ctx.fillRect(0, 0, W, H);
  // koridor yandan: üst ve alt kaya
  ctx.fillStyle = '#a97a52'; ctx.fillRect(0, 0, W, 560); ctx.fillStyle = '#7d5638'; ctx.fillRect(0, 1380, W, 540);
  ctx.fillStyle = '#1a0f09'; ctx.fillRect(0, 560, W, 820); glowCircle(200, 1000, 700, COL.amber, .35);
  // taş yuvası
  ctx.fillStyle = '#5a3d28'; ctx.fillRect(560, 560, 330, 820);
  // taş: yuvadan koridora yuvarlanır
  const roll = ease.io(pr(t, 42.97, 43.9)); const r = 300, cx = lerp(1060, 560, roll), cy = 1380 - r;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-roll * 1.9);
  const g = ctx.createRadialGradient(-80, -80, 40, 0, 0, r); g.addColorStop(0, '#e3c29a'); g.addColorStop(1, '#9c7450'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(80,50,30,.5)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, r - 30, 0, 7); ctx.stroke();
  ctx.fillStyle = '#1a0f09'; ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.fill();
  for (let i = 0; i < 9; i++) { ctx.strokeStyle = 'rgba(80,50,30,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 90 + i * 20, i, i + 1.2); ctx.stroke(); }
  ctx.restore();
  // ölçü
  const ma = pr(t, 40.4, 40.7) * (1 - pr(t, 42.8, 43.0));
  if (ma > 0) { ctx.strokeStyle = rgba(COL.cream, ma); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - r, cy - r - 50); ctx.lineTo(cx + r, cy - r - 50); ctx.stroke(); text('~1 M · YÜZLERCE KİLO', SAFE.cx, 470, { fam: 'JetBrains Mono', w: 700, size: 38, align: 'center', alpha: ma, ls: 2 }); }
  // içeride kişi iter
  const inside = pr(t, 42.97, 43.2); person(lerp(150, 230, roll), 1380, 230, { arm: -.1, lean: .25 * inside, color: '#0b0604', face: 1, tunic: true });
  // dışarıda: kolu uzanan ama itemeyen
  if (t > 44.0) { const p = pr(t, 44.0, 44.4); person(lerp(1150, 980, ease.outC(p)), 1380, 230, { arm: -.1, lean: -.2, color: '#0b0604', face: -1, spear: true }); }
  const ia = pr(t, 43.95, 44.2) * (1 - pr(t, 45.3, 45.6));
  if (ia > 0) { const q = ease.back(pr(t, 43.95, 44.15)) * 22; ctx.fillStyle = COL.red; ctx.fillRect(200 - q / 2, 1060 - q / 2, q, q); text('SADECE İÇERİDEN', 240, 1075, { fam: 'JetBrains Mono', w: 700, size: 36, alpha: ia, color: COL.cream, ls: 2, shadow: 20 }); }
  // giriş: savaş sahnesinden yarma
  const wipe = 1 - ease.io(pr(t, 39.3, 39.75)); if (wipe > 0) { ctx.fillStyle = '#0b0604'; ctx.fillRect(0, 0, W * wipe, H); }
}

// ======================================================================
// Hava + su, Kaymaklı tüneli, yüzyıllar, duvar
const KAY_X = 2900;
function sceneBreath(t) {
  // taşın deliğinden şehre açılış
  const [cx0, cy0] = [520, 860];
  const pan = ease.io(pr(t, 48.94, 53.2)), back = ease.io(pr(t, 54.6, 55.9));
  let cx = lerp(cx0, KAY_X + 450, pan), s = lerp(1, .62, Math.sin(pan * Math.PI) * .9 + pan * .1);
  let cy = lerp(cy0, 900, pan);
  if (t > 54.6) { cx = lerp(KAY_X + 450, 300, back); cy = lerp(900, SURF - 40, back); s = lerp(.62, 5.5, ease.inC(back)); }
  ctx.save(); cam(cx, cy, s);
  // Kaymaklı tüneli
  const tp = ease.io(pr(t, 49.3, 53.2));
  drawCity(t, { air: pr(t, 45.71, 46.1) * (1 - pr(t, 48.9, 49.3)), water: pr(t, 47.18, 48.2), people: 1, surfaceFx: () => dayNight(t) });
  ctx.save(); ctx.translate(KAY_X, 0); ctx.scale(.9, .9); ctx.translate(0, 60); drawCity(t, { people: 1, bg: false }); ctx.restore();
  // tünel
  const pts = []; for (let i = 0; i <= 60; i++) { const x = lerp(870, KAY_X + 60, i / 60); pts.push([x, LV(4) + 40 * Math.sin(i * .35)]); }
  ctx.strokeStyle = '#150c07'; ctx.lineWidth = 22; ctx.lineCap = 'round'; strokeProgress(pts, tp);
  ctx.strokeStyle = COL.amber; ctx.lineWidth = 6; ctx.setLineDash([20, 18]); ctx.lineDashOffset = -t * 120; strokeProgress(pts, tp); ctx.setLineDash([]);
  ctx.restore();
  // giriş: taş deliğinden açılma
  const ir = pr(t, 45.3, 45.9); if (ir < 1) { ctx.save(); ctx.fillStyle = '#9c7450'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(540, 900, lerp(58, 1400, ease.inC(ir)), 0, 7, true); ctx.fill('evenodd'); ctx.restore(); }
  const ka = pr(t, 52.0, 52.4) * (1 - pr(t, 54.5, 54.8)); if (ka > 0) text('KAYMAKLI', SAFE.cx, 560, { size: 120, align: 'center', alpha: ka, shadow: 30 });
  const da = pr(t, 50.9, 51.2) * (1 - pr(t, 54.5, 54.8)); if (da > 0) text('~9 KM', SAFE.cx, 660, { fam: 'JetBrains Mono', w: 700, size: 56, align: 'center', color: COL.amber, alpha: da, ls: 6 });
  stamp('RİVAYET', 110, 460, pr(t, 49.2, 49.45) * (1 - pr(t, 54.5, 54.8)), { color: COL.red, size: 44, rot: -.08 });
  // duvara yakınlaşma geçişi
  const wf = pr(t, 55.6, 55.95); if (wf > 0) { ctx.fillStyle = rgba('#d9b48a', wf); ctx.fillRect(0, 0, W, H); }
}
function dayNight(t) {
  const p = pr(t, 56.2, 57.5); if (p <= 0 || p >= 1) return;
  for (let k = 0; k < 4; k++) { const q = (p * 4 - k); if (q < 0 || q > 1) continue; const a = Math.PI * q; ctx.fillStyle = k % 2 ? '#dfe3ff' : '#f9c46e'; ctx.beginPath(); ctx.arc(300 + Math.cos(Math.PI - a) * 400, SURF - Math.sin(a) * 300, 22, 0, 7); ctx.fill(); }
  ctx.fillStyle = `rgba(10,10,30,${.4 * (.5 + .5 * Math.sin(p * Math.PI * 8))})`; ctx.fillRect(-3000, -2000, 9000, SURF + 2000);
}
function sceneWallEnd(t) {
  const rb = ease.io(pr(t, 57.9, 59.7));
  const push = lerp(1, 1.18, ease.io(pr(t, 60.5, 63.8)));
  wallScene(t, { broken: rb >= 1 ? -1 : 1.6, rebuild: rb, man: false, push, crackLight: pr(t, 61.65, 63.6) });
  if (t < 56.3) { const R = rng(Math.floor(t * 20)); }
  const fl = 1 - pr(t, 55.95, 56.4); if (fl > 0) { ctx.fillStyle = rgba('#d9b48a', fl); ctx.fillRect(0, 0, W, H); }
  // yüzyıllar sayacı
  const dn = pr(t, 56.3, 57.6); if (dn > 0 && dn < 1) { ctx.fillStyle = `rgba(5,5,20,${.55 * (.5 - .5 * Math.cos(dn * Math.PI * 8))})`; ctx.fillRect(0, 0, W, H); const sx = lerp(-200, 1300, (dn * 4) % 1); glowCircle(sx, 700, 500, '#f9c46e', .25 * (1 - dn)); }
  stamp('KAYNAK: HISTORY · ATLAS OBSCURA', 100, 1230, pr(t, 58.3, 58.55) * (1 - pr(t, 60.3, 60.6)), { size: 24, rot: -.04 });
}

// ======================================================================
const SCENES = [
  [0, 9.35, t => { wallScene(t, { broken: t >= HITS[2] ? t - HITS[2] : -1, man: t < 6.5 }); const b = t - HITS[2]; if (b > 0 && b < 1.5) { const R = rng(2); for (let i = 0; i < 90; i++) { ctx.fillStyle = rgba('#d9b48a', .6 * cl(1 - b / 1.5)); const a = R() * 6.28, v = 200 + R() * 700; ctx.beginPath(); ctx.arc(HOLE.x + Math.cos(a) * v * b, HOLE.y + Math.sin(a) * v * b + 300 * b * b, 6 + R() * 20 * (1 + b), 0, 7); ctx.fill(); } }
      const br = pr(t, 5.73, 6.2) * (1 - pr(t, 9.0, 9.35)); if (br > 0) { const R = rng(4); for (let i = 0; i < 160; i++) { const ph = (t * (.25 + R() * .3) + R()) % 1; const a = R() * 6.28, d = ph * ph * 1100; ctx.fillStyle = rgba('#dfe8ff', .5 * br * Math.sin(ph * Math.PI)); ctx.beginPath(); ctx.arc(HOLE.x + Math.cos(a) * d, HOLE.y + Math.sin(a) * d * 1.2, 2 + ph * 7, 0, 7); ctx.fill(); } }
      const lb = pr(t, .2, .5) * (1 - pr(t, 4.3, 4.6)); if (lb > 0) { text('NEVŞEHİR · 1963', SAFE.cx, 420, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', alpha: lb, ls: 4, shadow: 20 }); } }],
  [9.0, 16.3, sceneDescent], [16.28, 39.4, sceneCity], [39.3, 45.9, sceneDoor], [45.3, 56.0, sceneBreath], [55.9, 64.0, sceneWallEnd],
];
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.letterSpacing = '0px';
  ctx.fillStyle = COL.ink; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t); ctx.save(); ctx.translate(sh.x, sh.y);
  for (const [a, b, f] of SCENES) { if (t < a || t >= b) continue; ctx.save(); if (f === sceneDescent) ctx.globalAlpha = pr(t, 9.0, 9.35); f(t); ctx.restore(); }
  ctx.restore();
  // son: çatlak ışığından pırıltı -> logo
  const LS = 63.85;
  if (t > 63.2 && t < LS + .05) { const p = ease.back(pr(t, 63.2, 63.6)); sparkle(HOLE.x, HOLE.y, 60 * p, { glow: 50, rot: t }); }
  if (t > LS - .2) { ctx.fillStyle = COL.ink; ctx.globalAlpha = pr(t, LS - .2, LS); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; logoSting(t, LS, SAFE.cx, 860, 620, [HOLE.x, HOLE.y]); }
  vignette(.55); grain(t, .07);
  if (t < AUDIO_END) { const a = pr(t, .15, .5) * (1 - pr(t, AUDIO_END - .4, AUDIO_END)); chip(CAT.name, CAT.color, a * .9); timer(t / AUDIO_END, a); }
  captions(t, CAP, COL.amber);
  const fo = pr(t, END - .3, END); if (fo > 0) { ctx.fillStyle = `rgba(20,17,18,${fo})`; ctx.fillRect(0, 0, W, H); }
}
window.DURATION = END; window.render = render;
window.ready = Promise.all(['300 20px Outfit', '500 20px Outfit', '700 20px Outfit', '900 20px Outfit', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map(f => document.fonts.load(f, 'ÇĞİÖŞÜçğıöşü'))).then(() => true);
