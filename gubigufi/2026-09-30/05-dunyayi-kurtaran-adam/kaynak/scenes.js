// #5 Dünyayı Kurtaran Adam — sahneler. P = ifadelerin [başla, bitir] zamanları (ses.mp3'ten ölçüldü)
const CAT = { name: 'SİNEMA & PERDE ARKASI', color: '#E8E2D6' };
const P = window.P_TIMES;
const AUDIO_END = window.AUDIO_END_T, LS = AUDIO_END + .1, END = LS + 2.1;
const WARM = '#ffd79a', RED = COL.red, SCREEN = '#dfe6f2';
const s = i => P[i][0], e = i => P[i][1];
IMPACTS.push([.28, 8], [s(17) + .35, 12], [s(7) + .1, 6]);

const CAP = [
  [s(0), e(0), "*1982'de,*"], [s(1), e(1), 'bir Türk filmi *uzay savaşı* çekmek istedi.'], [s(2), e(2), 'Ama ne *bütçe* vardı,'], [s(3), e(3), 'ne de *uzay gemisi.*'],
  [s(4), e(4), 'Çözüm?'], [s(5), e(5), "*Star Wars'u...*"], [s(6), e(6), '*izinsiz* aldılar.'],
  [s(7), e(7), "*Dünyayı Kurtaran Adam'da,*"], [s(8), e(8), "Star Wars'un uzay sahneleri oyuncuların arkasındaki *perdeye* yansıtıldı."],
  [s(9), e(9), 'Cüneyt Arkın *kokpitte* sallanırken,'], [s(10), e(10), "arkada *Hollywood'un* savaşı dönüyordu."],
  [s(11), e(11), '*Müzik* mi?'], [s(12), e(12), 'O da *ödünç.*'], [s(13), e(13), "Indiana Jones'un müzikleri ve başka filmlerin parçaları,"], [s(14), e(14), '*kesilip* eklendi.'],
  [s(15), e(15), 'Sonuç:'], [s(16), e(16), 'sahte kayaları *yumrukla* kıran,'], [s(17), e(17), '*trambolinle* zıplayan kahramanlar.'], [s(18), e(18), 'Ve dünyada *eşi olmayan* bir film.'],
  [s(19), e(19), 'Yurt dışında adı *"Türk Star Wars"* oldu.'], [s(20), e(20), '*Kült* bir klasik.'],
  [s(21), e(21), 'Ama hikâyenin en *şaşırtıcı* kısmı şu:'], [s(22), e(22), 'Filmin iyi bir kopyası yıllarca *bulunamadı.*'],
  [s(23), e(23), 'Sonunda *35 milimetrelik* bir kopya,'], [s(24), e(24), 'emekli bir *sinema makinistinden* satın alındı.'],
  [s(25), e(25), 'Yani dünyayı kurtaran adamı...'], [s(26), e(26), 'bir *makinist* kurtardı.'],
];

// ======================================================================
const BLINK = t => { const k = t % 3.3; return k < .12 ? Math.sin(k / .12 * Math.PI) : 0; };
function theater(t, light = .5) {
  ctx.fillStyle = '#0d0b0c'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(540, 700, 50, 540, 800, 1200); g.addColorStop(0, `rgba(80,55,40,${light})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // kırmızı perde kenarları
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd < 0 ? 0 : W, 0); ctx.scale(sd, 1); const cg = ctx.createLinearGradient(0, 0, 150, 0); cg.addColorStop(0, '#5a0f14'); cg.addColorStop(1, '#8e1c22'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(140, 0); for (let y = 0; y <= H; y += 80) ctx.quadraticCurveTo(120 + 30 * Math.sin(y * .01 + t), y + 40, 110 + 20 * Math.sin(y * .02), y + 80); ctx.lineTo(0, H); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 6; for (let x = 25; x < 130; x += 35) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 10, H); ctx.stroke(); } ctx.restore(); }
}
function beam(x0, y0, x1a, y1a, x1b, y1b, a = .25) { const g = ctx.createLinearGradient(x0, y0, (x1a + x1b) / 2, (y1a + y1b) / 2); g.addColorStop(0, `rgba(255,236,190,${a})`); g.addColorStop(1, `rgba(255,236,190,${a * .25})`); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1a, y1a); ctx.lineTo(x1b, y1b); ctx.closePath(); ctx.fill(); const R = rng(Math.floor(performance.now ? 0 : 0) + 5); for (let i = 0; i < 40; i++) { const k = R(), m = R(); ctx.fillStyle = `rgba(255,240,210,${.25 * R()})`; ctx.fillRect(lerp(x0, lerp(x1a, x1b, m), k), lerp(y0, lerp(y1a, y1b, m), k), 3, 3); } }
function projector(x, y, s, on = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#2b2a30'; rr(-110, -60, 220, 120, 16); ctx.fill(); ctx.fillStyle = '#3c3b43'; rr(-110, -60, 220, 30, [16, 16, 0, 0]); ctx.fill();
  for (const [rx, ry] of [[-60, -120], [60, -120]]) { ctx.save(); ctx.translate(rx, ry); ctx.rotate(t * 3 * on); ctx.fillStyle = '#4a4952'; ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.fill(); ctx.fillStyle = '#2b2a30'; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28; ctx.beginPath(); ctx.arc(Math.cos(a) * 30, Math.sin(a) * 30, 12, 0, 7); ctx.fill(); } ctx.fillStyle = '#8a8994'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#1b1a1f'; ctx.fillRect(-150, -18, 50, 36); ctx.fillStyle = on ? WARM : '#444'; ctx.beginPath(); ctx.arc(-150, 0, 18, 0, 7); ctx.fill(); if (on) glowCircle(-150, 0, 80, WARM, .6 * on);
  ctx.restore();
}
function clapper(x, y, s, close, txt1, txt2) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#1a1a1a'; rr(-230, -20, 460, 280, 12); ctx.fill();
  ctx.strokeStyle = '#e8e2d6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-230, 90); ctx.lineTo(230, 90); ctx.moveTo(0, 90); ctx.lineTo(0, 260); ctx.stroke();
  text(txt1, -210, 60, { size: 44, color: '#e8e2d6' }); text(txt2, -210, 170, { fam: 'JetBrains Mono', w: 700, size: 30, color: '#e8e2d6' }); text('ÇEKİM 1', 20, 170, { fam: 'JetBrains Mono', w: 700, size: 30, color: '#e8e2d6' });
  ctx.save(); ctx.translate(-230, -20); ctx.rotate(-.45 * (1 - close)); ctx.fillStyle = '#1a1a1a'; rr(0, -60, 460, 58, 8); ctx.fill(); ctx.fillStyle = '#e8e2d6'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(20 + i * 80, -60); ctx.lineTo(60 + i * 80, -60); ctx.lineTo(30 + i * 80, -2); ctx.lineTo(-10 + i * 80, -2); ctx.fill(); } ctx.restore();
  ctx.restore();
}
function hero(x, y, h, o = {}) { // pelerinli kahraman silueti
  const { pose = 'stand', ph = 0, face = 1, col = '#0b0a0c' } = o; const k = h / 100;
  ctx.save(); ctx.translate(x, y); ctx.scale(k * face, k); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.fillStyle = '#7a1418'; ctx.beginPath(); ctx.moveTo(-8, -78); ctx.quadraticCurveTo(-30 - 6 * Math.sin(ph * 3), -40, -26 - 10 * Math.sin(ph * 3), -8); ctx.lineTo(4, -44); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-13, -80); ctx.lineTo(13, -80); ctx.lineTo(9, -44); ctx.lineTo(-9, -44); ctx.fill(); ctx.beginPath(); ctx.arc(0, -90, 9.5, 0, 7); ctx.fill();
  ctx.lineWidth = 10;
  if (pose === 'punch') { ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(38, -72); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -72); ctx.lineTo(-14, -56); ctx.lineTo(-4, -50); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-3, -46); ctx.lineTo(-20, -22); ctx.lineTo(-24, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3, -46); ctx.lineTo(18, -24); ctx.lineTo(24, 0); ctx.stroke(); }
  else if (pose === 'fly') { ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(18, -110); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(-18, -108); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-3, -46); ctx.lineTo(-10, -20); ctx.lineTo(-4, 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3, -46); ctx.lineTo(16, -28); ctx.lineTo(10, -6); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(-16, -48); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -74); ctx.lineTo(16, -48); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-3, -46); ctx.lineTo(-8, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3, -46); ctx.lineTo(8, 0); ctx.stroke(); }
  ctx.restore();
}
function redStamp(txt, x, y, p, { size = 80, rot = -.12, col = RED } = {}) {
  if (p <= 0) return; const k = lerp(2.2, 1, ease.outC(pr(p, 0, .35)));
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); ctx.globalAlpha *= cl(p * 4) * .92; font(900, size); const w = ctx.measureText(txt).width + 60, h = size + 40;
  ctx.strokeStyle = col; ctx.lineWidth = 8; rr(-w / 2, -h / 2, w, h, 14); ctx.stroke(); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(txt, 0, size * .35);
  const R = rng(txt.length * 3); ctx.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(0,0,0,${.3 + R() * .5})`; ctx.beginPath(); ctx.arc((R() - .5) * w, (R() - .5) * h, 2 + R() * 5, 0, 7); ctx.fill(); }
  ctx.restore();
}
function space(t, x, y, w, h, fx = 1) { // perdedeki temsili uzay savaşı (genel şekiller)
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = '#05060f'; ctx.fillRect(x, y, w, h);
  const R = rng(9); for (let i = 0; i < 140; i++) { const sx = x + ((R() * w + t * (40 + R() * 160)) % w), sy = y + R() * h, z = R(); ctx.fillStyle = `rgba(255,255,255,${.3 + z * .6})`; ctx.fillRect(sx, sy, 2 + z * 2, 2 + z * 2); }
  ctx.fillStyle = '#6b4ea8'; ctx.beginPath(); ctx.arc(x + w * .8, y + h * .75, h * .35, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(x + w * .76, y + h * .7, h * .28, 0, 7); ctx.fill();
  if (fx > 0) for (let i = 0; i < 6; i++) { const ph = (t * .7 + i / 6) % 1; const lx = x + w * (.1 + .8 * ((i * .37) % 1)), ly = y + h * (.2 + .6 * ((i * .61) % 1)); ctx.strokeStyle = i % 2 ? '#ff4d5e' : '#5dff9b'; ctx.lineWidth = 5; ctx.globalAlpha = fx * Math.sin(ph * Math.PI); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 120 * ph, ly - 40 * ph); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#cfd6e6'; ctx.save(); ctx.translate(lx - 40 + ph * 30, ly + 10); ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(30, 0); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill(); ctx.restore();
    if (ph > .85) { glowCircle(lx + 120, ly - 40, 60, '#ffb347', fx * (1 - (ph - .85) / .15)); } }
  ctx.restore();
}

// ======================================================================
// A: klaket, stüdyo, kumbara, karton gemi
function sceneStudio(t) {
  theater(t, .35);
  // spot ışığı
  beam(540, -50, 260, 1500, 820, 1500, .12 + .05 * pr(t, .3, .8));
  ctx.fillStyle = '#1c1512'; ctx.fillRect(0, 1400, W, 520); ctx.fillStyle = 'rgba(255,220,160,.08)'; ctx.beginPath(); ctx.ellipse(540, 1420, 330, 50, 0, 0, 7); ctx.fill();
  // klaket
  const cl_ = pr(t, 0, .28), ca = 1 - pr(t, s(1) - .2, s(1) + .2);
  if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; clapper(SAFE.cx, 640, 1, ease.inC(cl_), 'SAHNE 1', 'YIL: 1982'); ctx.restore(); }
  // storyboard: uzay savaşı hayali
  const sb = ease.back(pr(t, s(1), s(1) + .4)) * (1 - pr(t, s(2) - .1, s(2) + .15));
  if (sb > 0) { ctx.save(); ctx.translate(SAFE.cx, 700); ctx.scale(sb, sb); ctx.rotate(-.03); ctx.fillStyle = '#f3ecdc'; rr(-330, -230, 660, 440, 10); ctx.fill(); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 5; rr(-300, -200, 600, 380, 6); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(160, 90, 70, 0, 7); ctx.stroke(); for (const [px, py] of [[-150, -60], [-40, 20], [60, -100]]) { ctx.beginPath(); ctx.moveTo(px, py - 14); ctx.lineTo(px + 50, py); ctx.lineTo(px, py + 14); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(px + 55, py); ctx.lineTo(px + 150, py - 30); ctx.stroke(); }
    text('UZAY SAVAŞI?', 0, 150, { size: 50, align: 'center', color: '#2a2a2a' }); ctx.restore(); }
  // kumbara
  const pb = ease.back(pr(t, s(2), s(2) + .3)) * (1 - pr(t, s(3) + .6, s(3) + .9));
  if (pb > 0) { const sh = Math.sin(t * 40) * 8 * pr(t, s(2) + .3, s(2) + .5) * (1 - pr(t, s(2) + 1.0, s(2) + 1.2)); ctx.save(); ctx.translate(360 + sh, 1180); ctx.scale(pb, pb); ctx.fillStyle = '#ef8fa6'; ctx.beginPath(); ctx.ellipse(0, 0, 150, 115, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(140, -10, 44, 36, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#c4637c'; for (const nx of [132, 150]) { ctx.beginPath(); ctx.arc(nx, -10, 7, 0, 7); ctx.fill(); } ctx.fillStyle = '#2a1d15'; ctx.beginPath(); ctx.arc(90, -50, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#c4637c'; ctx.fillRect(-40, -118, 80, 12); for (const lx of [-80, -30, 30, 80]) ctx.fillRect(lx - 14, 90, 28, 50);
    text('BÜTÇE', 0, 30, { fam: 'JetBrains Mono', w: 700, size: 36, align: 'center', color: '#fff' }); ctx.restore();
    const coin = pr(t, s(2) + 1.0, s(2) + 1.6); if (coin > 0) { const cy = lerp(1300, 1395, ease.bounce(coin)); ctx.fillStyle = '#e8b64a'; ctx.beginPath(); ctx.ellipse(360, cy, 22, 22 * Math.abs(Math.cos(coin * 10)) + 4, 0, 0, 7); ctx.fill(); } }
  // karton uzay gemisi
  const bx = ease.back(pr(t, s(3), s(3) + .35)) * (1 - pr(t, s(4) - .2, s(4) + .1));
  if (bx > 0) { ctx.save(); ctx.translate(760, 1200); ctx.scale(bx, bx); ctx.rotate(-.05); ctx.fillStyle = '#b98a55'; ctx.fillRect(-160, -120, 320, 220); ctx.fillStyle = '#a3773f'; ctx.beginPath(); ctx.moveTo(-160, -120); ctx.lineTo(-100, -170); ctx.lineTo(220, -170); ctx.lineTo(160, -120); ctx.fill(); ctx.fillRect(160, -120, 60, 220);
    const flap = pr(t, s(3) + .6, s(3) + 1.1); ctx.save(); ctx.translate(-160, -120); ctx.rotate(-flap * 2.2); ctx.fillStyle = '#c89b63'; ctx.fillRect(0, -70, 120, 70); ctx.restore();
    ctx.fillStyle = '#5fb3e0'; for (const wx of [-100, -20, 60]) { ctx.beginPath(); ctx.arc(wx, -40, 24, 0, 7); ctx.fill(); } ctx.strokeStyle = '#2a1d15'; ctx.lineWidth = 3; ctx.font = '700 34px Outfit'; ctx.fillStyle = '#2a1d15'; ctx.textAlign = 'center'; ctx.fillText('uzay gemisi :)', 0, 60); ctx.restore(); }
}
// B: projektör yanar, makara, İZİNSİZ
function sceneProjector(t) {
  theater(t, .2);
  const on = pr(t, s(4) + .05, s(4) + .15);
  if (on > 0) beam(880, 460, -100, 900, 500, 1600, .3 * on);
  projector(880, 460, 1.1, on, t);
  const rl = ease.outC(pr(t, s(5), s(5) + .6));
  if (rl > 0) { ctx.save(); ctx.translate(lerp(-200, 420, rl), lerp(900, 1000, rl) + Math.sin(t * 2) * 12); ctx.rotate(t * 1.5); ctx.fillStyle = '#9aa0ad'; ctx.beginPath(); ctx.arc(0, 0, 170, 0, 7); ctx.fill(); ctx.fillStyle = '#2b2a30'; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; ctx.beginPath(); ctx.arc(Math.cos(a) * 95, Math.sin(a) * 95, 36, 0, 7); ctx.fill(); } ctx.fillStyle = '#5a5f6b'; ctx.beginPath(); ctx.arc(0, 0, 26, 0, 7); ctx.fill(); ctx.restore();
    text('HOLLYWOOD · 1977', lerp(-200, 420, rl), 1230, { fam: 'JetBrains Mono', w: 700, size: 30, align: 'center', alpha: rl }); }
  redStamp('İZİNSİZ', 440, 1000, pr(t, s(6) + .1, s(6) + .8), { size: 110, rot: -.14 });
  const q = pr(t, s(4) - .05, s(4) + .1) * (1 - pr(t, s(5), s(5) + .2)); if (q > 0) text('ÇÖZÜM?', SAFE.cx, 700, { size: 130, align: 'center', color: WARM, alpha: q, shadow: 30 });
}
// C: perde + karton kokpit
function sceneSet(t) {
  theater(t, .25);
  const SX = 110, SY = 330, SW = 860, SH = 620;
  ctx.fillStyle = '#e9edf5'; ctx.fillRect(SX - 12, SY - 12, SW + 24, SH + 24);
  space(t, SX, SY, SW, SH, pr(t, s(8) + .3, s(8) + 1.0));
  const on = pr(t, s(7), s(7) + .3); ctx.fillStyle = `rgba(233,237,245,${1 - on})`; ctx.fillRect(SX, SY, SW, SH);
  beam(1080, 1250, SX + 20, SY + 40, SX + SW, SY + SH, .12 * on);
  // kokpit (karton)
  const shake = Math.sin(t * 23) * 18 * pr(t, s(9), s(9) + .3) + Math.sin(t * 17) * 6;
  ctx.save(); ctx.translate(540 + shake, 1240); ctx.rotate(shake * .004);
  ctx.fillStyle = '#9b7447'; ctx.beginPath(); ctx.moveTo(-380, 60); ctx.lineTo(-300, -120); ctx.lineTo(300, -120); ctx.lineTo(380, 60); ctx.lineTo(380, 260); ctx.lineTo(-380, 260); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#6f5231'; ctx.fillRect(-300, -20, 600, 60);
  for (let i = 0; i < 8; i++) { ctx.fillStyle = ['#ff4d5e', '#5dff9b', '#ffd23f', '#5fb3e0'][i % 4]; ctx.globalAlpha = .5 + .5 * Math.sin(t * 7 + i); ctx.beginPath(); ctx.arc(-240 + i * 68, 10, 12, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
  text('karton', 250, 200, { w: 700, size: 30, color: '#3e2a1b' });
  // pilot kafaları
  for (const px of [-120, 120]) { ctx.fillStyle = '#0b0a0c'; ctx.beginPath(); ctx.arc(px, -210, 58, 0, 7); ctx.fill(); ctx.fillRect(px - 70, -160, 140, 60); ctx.fillStyle = '#e8e2d6'; ctx.fillRect(px - 50, -225, 100, 16); }
  ctx.restore();
  // başlık + etiket
  const ta = pr(t, s(7), s(7) + .3) * (1 - pr(t, s(8) + 1, s(8) + 1.3)); if (ta > 0) { text('DÜNYAYI', SAFE.cx, 520, { size: 110, align: 'center', alpha: ta, shadow: 40, color: '#ffe8a8' }); text('KURTARAN ADAM', SAFE.cx, 630, { size: 92, align: 'center', alpha: ta, shadow: 40, color: '#ffe8a8' }); }
  const la = pr(t, s(8) + 1.2, s(8) + 1.5) * (1 - pr(t, e(10), e(10) + .2)); if (la > 0) { ctx.fillStyle = `rgba(0,0,0,${.6 * la})`; rr(SAFE.cx - 330, 870, 660, 60, 30); ctx.fill(); text('ARKA PLAN = BAŞKA FİLM', SAFE.cx, 912, { fam: 'JetBrains Mono', w: 700, size: 32, align: 'center', alpha: la, ls: 2 }); }
}
// D: pikap, plaklar kesilip yapıştırılır
function record(x, y, r, rot, lab) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = '#121114'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 2; for (let k = r * .4; k < r; k += 10) { ctx.beginPath(); ctx.arc(0, 0, k, 0, 7); ctx.stroke(); } ctx.fillStyle = lab; ctx.beginPath(); ctx.arc(0, 0, r * .33, 0, 7); ctx.fill(); ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, -.4, .2); ctx.fill(); ctx.restore(); }
function sceneMusic(t) {
  theater(t, .3);
  // pikap gövdesi
  ctx.fillStyle = '#6b4424'; rr(140, 820, 800, 620, 30); ctx.fill(); ctx.fillStyle = '#4a2e18'; rr(170, 850, 740, 560, 20); ctx.fill();
  const labs = ['#e0453a', '#3d8bfd', '#ffd23f'];
  const cut = pr(t, s(13) + .6, s(14) + .2), join = ease.io(pr(t, s(14) + .1, e(14)));
  if (cut < .01) record(540, 1130, 250, t * 3.5, labs[0]);
  else { for (let i = 0; i < 3; i++) { const a0 = i / 3 * Math.PI * 2 + t * (join > .99 ? 3.5 : 0), a1 = a0 + Math.PI * 2 / 3; const off = (1 - join) * 90; const mx = Math.cos(a0 + Math.PI / 3) * off, my = Math.sin(a0 + Math.PI / 3) * off; ctx.save(); ctx.translate(540 + mx, 1130 + my); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 250, a0, a1); ctx.closePath(); ctx.clip(); record(0, 0, 250, 0, labs[i]); ctx.restore(); }
    if (join > .9) { ctx.save(); ctx.translate(540, 1130); ctx.rotate(t * 3.5); ctx.fillStyle = 'rgba(240,220,160,.85)'; for (let i = 0; i < 3; i++) { ctx.save(); ctx.rotate(i / 3 * Math.PI * 2); ctx.fillRect(40, -12, 200, 24); ctx.restore(); } ctx.restore(); } }
  // kol
  ctx.strokeStyle = '#c9c9d1'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(870, 880); ctx.lineTo(850, 1100); ctx.lineTo(760, 1180); ctx.stroke();
  // makas
  const sc = pr(t, s(13) + .4, s(14) + .3); if (sc > 0 && sc < 1) { const a = sc * Math.PI * 2; ctx.save(); ctx.translate(540 + Math.cos(a) * 180, 1130 + Math.sin(a) * 180); ctx.rotate(a + Math.PI / 2); const o = Math.abs(Math.sin(t * 20)) * .4; ctx.strokeStyle = '#d9dde6'; ctx.lineWidth = 10; for (const sd of [-1, 1]) { ctx.save(); ctx.rotate(sd * o); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -110); ctx.stroke(); ctx.beginPath(); ctx.arc(sd * 16, 40, 22, 0, 7); ctx.stroke(); ctx.restore(); } ctx.restore(); }
  // uçan notalar
  const R = rng(3); for (let i = 0; i < 12; i++) { const ph = ((t - s(11)) * .5 + R()) % 1; if (t < s(11)) break; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI) * .9; ctx.translate(200 + R() * 700, 820 - ph * 500); ctx.rotate(Math.sin(t * 3 + i) * .3); text(i % 2 ? '♪' : '♫', 0, 0, { size: 70, color: [WARM, '#5fb3e0', '#ef8fa6'][i % 3] }); ctx.restore(); }
  redStamp('ÖDÜNÇ', 540, 560, pr(t, s(12), s(12) + .7), { size: 110, rot: .1, col: '#ffd23f' });
  const la = pr(t, s(13), s(13) + .3) * (1 - pr(t, e(14), e(14) + .2)); if (la > 0) text('BAŞKA FİLMLERİN MÜZİKLERİ', SAFE.cx, 740, { fam: 'JetBrains Mono', w: 700, size: 32, align: 'center', alpha: la, ls: 2 });
}
// E: köpük kaya + trambolin
function sceneAction(t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 1400); sky.addColorStop(0, '#2a1c3a'); sky.addColorStop(1, '#c46a3a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3a2418'; ctx.fillRect(0, 1380, W, 540);
  // köpük kaya
  const hit = s(16) + .75; const rockA = t < hit;
  if (rockA) { ctx.fillStyle = '#8a7a6a'; ctx.beginPath(); ctx.moveTo(620, 1380); ctx.lineTo(600, 1160); ctx.lineTo(700, 1060); ctx.lineTo(860, 1090); ctx.lineTo(900, 1250); ctx.lineTo(880, 1380); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.moveTo(640, 1180); ctx.lineTo(700, 1090); ctx.lineTo(760, 1100); ctx.fill(); }
  else { const d = Math.min(t - hit, 1.2), R = rng(4); for (let i = 0; i < 30; i++) { const a = -Math.PI * R(), v = 300 + R() * 700; ctx.fillStyle = mix('#8a7a6a', '#b8a898', R()); ctx.beginPath(); ctx.arc(750 + Math.cos(a) * v * d, 1220 + Math.sin(a) * v * d + 1300 * d * d, Math.max(1, 26 * (1 - d * .6) + R() * 10), 0, 7); ctx.fill(); } if (d < .5) text('POFF!', 750, 1000, { size: 110, align: 'center', color: '#ffe8a8', alpha: 1 - d * 2, shadow: 30 }); }
  const kl = pr(t, hit - .1, hit + .2) * (1 - pr(t, s(17), s(17) + .2)); if (kl > 0) redStamp('KÖPÜK', 760, 880, 1, { size: 70, rot: .1, col: '#ffe8a8' });
  // trambolin
  const tr = pr(t, s(17) - .3, s(17)); if (tr > 0) { ctx.save(); ctx.globalAlpha = tr; const dip = t > s(17) && t < s(17) + .3 ? Math.sin(pr(t, s(17), s(17) + .3) * Math.PI) * 40 : 0; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(250, 1380); ctx.lineTo(280, 1300); ctx.moveTo(530, 1380); ctx.lineTo(500, 1300); ctx.stroke(); ctx.strokeStyle = '#3d8bfd'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(270, 1300); ctx.quadraticCurveTo(390, 1300 + dip * 2, 510, 1300); ctx.stroke(); ctx.restore(); }
  // kahraman
  let hx, hy, pose = 'stand', hh = 340;
  if (t < s(17)) { const run = ease.outC(pr(t, s(16) - .3, hit - .1)); hx = lerp(200, 560, run); hy = 1380; pose = t > hit - .25 && t < hit + .5 ? 'punch' : 'stand'; }
  else { const j = pr(t, s(17), e(18) - .2); hx = lerp(390, 620, j); hy = 1300 - Math.sin(Math.min(j * 1.1, 1) * Math.PI) * 850; pose = 'fly'; if (j > .02) { ctx.strokeStyle = 'rgba(255,240,210,.35)'; ctx.lineWidth = 6; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(hx - 60 + i * 30, hy + 60); ctx.lineTo(hx - 60 + i * 30, hy + 260); ctx.stroke(); } } }
  if (t < s(18) + .25) { ctx.save(); ctx.globalAlpha = 1 - pr(t, s(18), s(18) + .25); hero(hx, hy, hh, { pose, ph: t }); ctx.restore(); }
  const bo = pr(t, s(17) + .05, s(17) + .2) * (1 - pr(t, s(17) + 1.0, s(17) + 1.3)); if (bo > 0) text('BOİNG!', 300, 1180, { size: 80, color: '#ffe8a8', alpha: bo, shadow: 20 });
  // eşsiz film rozeti
  const es = ease.back(pr(t, s(18), s(18) + .4)); if (es > 0) { ctx.save(); ctx.translate(SAFE.cx, 640); ctx.scale(es, es); ctx.rotate(Math.sin(t * 2) * .05); ctx.fillStyle = '#e8b64a'; ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r = i % 2 ? 190 : 220; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.fill(); ctx.fillStyle = '#7a1418'; ctx.beginPath(); ctx.arc(0, 0, 170, 0, 7); ctx.fill(); text('EŞİ', 0, -10, { size: 90, align: 'center', color: '#ffe8a8' }); text('YOK', 0, 80, { size: 90, align: 'center', color: '#ffe8a8' }); ctx.restore(); }
}
// F: VHS + kült
function sceneCult(t) {
  theater(t, .2);
  // salon: gülen seyirciler
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const x = 80 + i * 115 + (r % 2) * 55, y = 1260 + r * 150, b = Math.abs(Math.sin(t * 9 + i * 1.3 + r)) * 14 * pr(t, s(19) + .3, s(19) + .6); ctx.fillStyle = '#050405'; ctx.beginPath(); ctx.arc(x, y - b, 42, 0, 7); ctx.fill(); ctx.fillRect(x - 55, y + 20 - b, 110, 140); }
  // biletler
  const R = rng(6); for (let i = 0; i < 16; i++) { const st = s(19) + R() * 1.2, d = t - st; if (d < 0) continue; const x = 150 + R() * 780, y = -150 + d * (500 + R() * 300); if (y > 1300) continue; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(d * 3 + i) * .6); ctx.fillStyle = '#f2d15a'; rr(-110, -45, 220, 90, 8); ctx.fill(); ctx.fillStyle = '#c4a02a'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 110, 0, 14, 0, 7); ctx.fill(); } text('TURKISH', 0, -6, { fam: 'JetBrains Mono', w: 700, size: 22, align: 'center', color: '#3a2a10' }); text('STAR WARS', 0, 22, { fam: 'JetBrains Mono', w: 700, size: 22, align: 'center', color: '#3a2a10' }); ctx.restore(); }
  // neon KÜLT
  const na = pr(t, s(20), s(20) + .1); if (na > 0) { const fl = Math.sin(t * 50) > -.2 || t > s(20) + .6 ? 1 : .2; ctx.save(); ctx.globalAlpha = na * fl; ctx.shadowColor = '#ff4df0'; ctx.shadowBlur = 40; text('KÜLT', SAFE.cx, 700, { size: 200, align: 'center', color: '#ffb3f5' }); ctx.shadowColor = '#4dd2ff'; text('KLASİK', SAFE.cx, 860, { size: 110, align: 'center', color: '#b3ecff' }); ctx.restore(); }
  const ta = pr(t, s(19) + .2, s(19) + .5) * (1 - pr(t, s(20) - .2, s(20))); if (ta > 0) { text('"TURKISH', SAFE.cx, 640, { size: 130, align: 'center', color: '#f2d15a', alpha: ta, shadow: 30 }); text('STAR WARS"', SAFE.cx, 780, { size: 130, align: 'center', color: '#f2d15a', alpha: ta, shadow: 30 }); }
}
// G-H: arşiv, makinist, projektör
function sceneArchive(t) {
  ctx.fillStyle = '#07080b'; ctx.fillRect(0, 0, W, H);
  // raflar ve film kutuları
  const found = s(23) + .2;
  for (let r = 0; r < 5; r++) { const y = 420 + r * 220; ctx.fillStyle = '#1a1b20'; ctx.fillRect(60, y + 90, 960, 16); for (let i = 0; i < 7; i++) { const x = 130 + i * 135; const isIt = r === 2 && i === 4; if (isIt && t > found) continue; ctx.fillStyle = '#2b2d35'; ctx.beginPath(); ctx.ellipse(x, y + 50, 58, 40, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#3a3c46'; ctx.beginPath(); ctx.ellipse(x, y + 40, 58, 36, 0, 0, 7); ctx.fill(); } }
  // el feneri
  const fx = 540 + Math.sin(t * .9) * 360 * (1 - pr(t, found - .5, found)), fy = 860 + Math.cos(t * 1.3) * 300 * (1 - pr(t, found - .5, found));
  const tx = lerp(fx, 130 + 4 * 135, pr(t, found - .6, found)), ty = lerp(fy, 420 + 2 * 220 + 40, pr(t, found - .6, found));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; glowCircle(tx, ty, 260, '#fff0c8', .35); ctx.restore();
  // soru işaretleri
  const qa = pr(t, s(22), s(22) + .3) * (1 - pr(t, s(23), s(23) + .3)); if (qa > 0) { const R = rng(2); for (let i = 0; i < 5; i++) text('?', 150 + R() * 780, 500 + R() * 800, { size: 90, color: WARM, alpha: qa * .7 }); }
  // bulunan makara + makinist
  const lift = ease.outC(pr(t, found, found + .6)), mk = ease.outC(pr(t, s(24), s(24) + .8));
  const rx = lerp(130 + 4 * 135, 620, lift), ry = lerp(420 + 2 * 220 + 40, 900, lift);
  if (mk > 0) { ctx.save(); ctx.globalAlpha = mk; glowCircle(540, 1000, 800, '#ffb35a', .35); ctx.restore();
    // makinist silueti (kasket + gözlük)
    ctx.save(); ctx.translate(lerp(-200, 380, mk), 1500); ctx.scale(6.2, 6.2); ctx.fillStyle = '#120d0a'; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-24, -70); ctx.quadraticCurveTo(0, -84, 24, -70); ctx.lineTo(30, 0); ctx.fill(); ctx.beginPath(); ctx.arc(0, -94, 17, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(2, -108, 20, 7, 0, 0, 7); ctx.fill(); ctx.fillRect(4, -110, 22, 5);
    ctx.strokeStyle = '#e8e2d6'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(8, -94, 4.5, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(-3, -94, 4.5, 0, 7); ctx.stroke();
    ctx.fillStyle = '#e8e2d6'; ctx.globalAlpha = .9; ctx.beginPath(); ctx.moveTo(-6, -84); ctx.quadraticCurveTo(2, -80, 10, -84); ctx.lineTo(2, -78); ctx.fill(); ctx.restore(); }
  if (t > found) { ctx.save(); ctx.translate(rx, ry); ctx.rotate(t * .8); ctx.fillStyle = '#9aa0ad'; ctx.beginPath(); ctx.arc(0, 0, lerp(58, 150, lift), 0, 7); ctx.fill(); ctx.fillStyle = '#2b2a30'; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; ctx.beginPath(); ctx.arc(Math.cos(a) * lerp(30, 85, lift), Math.sin(a) * lerp(30, 85, lift), lerp(10, 30, lift), 0, 7); ctx.fill(); } ctx.restore(); sparkle(rx + 120, ry - 120, 30 * pr(t, found + .3, found + .6), { glow: 30 }); }
  const ma = pr(t, found + .3, found + .6) * (1 - pr(t, e(24), e(24) + .3)); if (ma > 0) { ctx.fillStyle = `rgba(0,0,0,${.6 * ma})`; rr(SAFE.cx - 160, 520, 320, 90, 20); ctx.fill(); text('35 MM', SAFE.cx, 588, { fam: 'JetBrains Mono', w: 700, size: 60, align: 'center', color: WARM, alpha: ma, ls: 6 }); }
  const ea = pr(t, s(24) + .6, s(24) + .9) * (1 - pr(t, e(24), e(24) + .3)); if (ea > 0) text('EMEKLİ MAKİNİST', SAFE.cx, 700, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', alpha: ea, ls: 4 });
  const fl = pr(t, s(21), s(21) + .3); if (fl < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - fl})`; ctx.fillRect(0, 0, W, H); }
}
function sceneFinale(t) {
  theater(t, .3);
  const on = pr(t, s(26), s(26) + .2);
  const SX = 170, SY = 330, SW = 740, SH = 520;
  ctx.fillStyle = '#e9edf5'; ctx.fillRect(SX - 10, SY - 10, SW + 20, SH + 20); ctx.fillStyle = on > 0 ? '#101014' : '#d9dde6'; ctx.fillRect(SX, SY, SW, SH);
  if (on > 0) { ctx.save(); ctx.beginPath(); ctx.rect(SX, SY, SW, SH); ctx.clip(); ctx.globalAlpha = on; clapper(SX + SW / 2, SY + SH / 2 - 60, .9, ease.inC(pr(t, s(26) + .4, s(26) + .7)), 'SAHNE 1', 'YIL: 1982'); ctx.restore(); beam(880, 1150, SX + 20, SY + 20, SX + SW - 20, SY + SH - 20, .15 * on); }
  projector(880, 1150, 1.0, on, t);
  // makinist makarayı takar
  const th = ease.io(pr(t, s(25), s(26)));
  ctx.save(); ctx.translate(lerp(380, 700, th), 1520); ctx.scale(5.2, 5.2); ctx.fillStyle = '#120d0a'; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-24, -70); ctx.quadraticCurveTo(0, -84, 24, -70); ctx.lineTo(30, 0); ctx.fill(); ctx.beginPath(); ctx.arc(0, -94, 17, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(2, -108, 20, 7, 0, 0, 7); ctx.fill(); ctx.fillRect(4, -110, 22, 5); ctx.restore();
  const badge = ease.back(pr(t, s(26) + .5, s(26) + .9)); if (badge > 0) { ctx.save(); ctx.translate(SAFE.cx, 1020); ctx.scale(badge, badge); ctx.rotate(-.05); ctx.fillStyle = '#e8b64a'; rr(-280, -50, 560, 100, 50); ctx.fill(); text('KAHRAMAN: MAKİNİST', 0, 16, { fam: 'JetBrains Mono', w: 700, size: 36, align: 'center', color: '#2a1d15' }); ctx.restore(); }
  stamp('KAYNAK: WIKIPEDIA · BİLİMKURGU KULÜBÜ · BEYAZPERDE', 80, 400, pr(t, s(25), s(25) + .25) * (1 - pr(t, AUDIO_END - .5, AUDIO_END)), { size: 18, rot: -.02 });
}

// ======================================================================
const SCENES = [
  [0, s(4) + .1, sceneStudio], [s(4) - .1, s(7) + .05, sceneProjector], [s(7) - .1, s(11) + .05, sceneSet], [s(11) - .1, s(15) + .05, sceneMusic],
  [s(15) - .1, s(19) + .05, sceneAction], [s(19) - .1, s(21) + .05, sceneCult], [s(21) - .1, s(25) + .05, sceneArchive], [s(25) - .1, LS + .1, sceneFinale],
];
// geçiş: film şeridi gibi yukarı kayma (kenarda makara delikleri)
function sprockets(y0, h) { ctx.fillStyle = '#050505'; ctx.fillRect(0, y0, 90, h); ctx.fillRect(W - 90, y0, 90, h); ctx.fillStyle = '#e8e2d6'; for (let y = y0 - ((y0 % 90) + 90) % 90; y < y0 + h; y += 90) { for (const x of [28, W - 62]) { ctx.beginPath(); ctx.roundRect(x, y + 25, 34, 44, 8); ctx.fill(); } } }
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.letterSpacing = '0px';
  ctx.fillStyle = COL.ink; ctx.fillRect(0, 0, W, H);
  const sh = shakeAt(t); ctx.save(); ctx.translate(sh.x, sh.y);
  let trans = null;
  SCENES.forEach(([a, b, f], i) => { if (t < a || t >= b) return; const nxt = SCENES[i + 1];
    let off = 0; if (i > 0 && t < a + .45) off = (1 - ease.io(pr(t, a, a + .45))) * (H + 40); // alttan gelir
    if (nxt && t > nxt[0] && t < nxt[0] + .45) { off = -ease.io(pr(t, nxt[0], nxt[0] + .45)) * (H + 40); trans = true; }
    if (off !== 0) trans = true;
    ctx.save(); ctx.translate(0, off); f(t); ctx.fillStyle = '#050505'; ctx.fillRect(0, H, W, 40); ctx.restore(); });
  if (trans) sprockets(0, H);
  ctx.restore();
  if (t > LS - .2) { ctx.fillStyle = COL.ink; ctx.globalAlpha = pr(t, LS - .2, LS); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; logoSting(t, LS, SAFE.cx, 860, 620, [880, 1150]); }
  vignette(.5); grain(t, .09);
  // film çizikleri
  const R = rng(Math.floor(t * 24)); if (R() < .35) { ctx.strokeStyle = 'rgba(255,245,220,.18)'; ctx.lineWidth = 2; const x = R() * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (R() - .5) * 20, H); ctx.stroke(); }
  if (t < AUDIO_END) { const a = pr(t, .15, .5) * (1 - pr(t, AUDIO_END - .4, AUDIO_END)); ctx.fillStyle = `rgba(20,17,18,${.55 * a})`; rr(62, 268, 450, 48, 24); ctx.fill(); ctx.beginPath(); ctx.arc(846, 300, 44, 0, 7); ctx.fill(); chip(CAT.name, CAT.color, a * .9); timer(t / AUDIO_END, a); }
  captions(t, CAP, COL.amber);
  const fo = pr(t, END - .3, END); if (fo > 0) { ctx.fillStyle = `rgba(20,17,18,${fo})`; ctx.fillRect(0, 0, W, H); }
}
window.DURATION = END; window.render = render;
window.ready = Promise.all(['300 20px Outfit', '500 20px Outfit', '700 20px Outfit', '900 20px Outfit', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map(f => document.fonts.load(f, 'ÇĞİÖŞÜçğıöşüÂâÎî'))).then(() => true);
