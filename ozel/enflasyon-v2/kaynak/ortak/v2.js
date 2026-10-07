// ENFLASYON v2 — Three.js gerçek 3D + DOM kinetik tipografi. Deterministik: her şey T'nin saf fonksiyonu.
// 120 BPM (vuruş 0,5 sn) · 60 fps · 1080×1920. Kamera dili: dolly-in, vinç, yörünge, eğri boyunca uçuş, dolly-zoom, makro.
import * as THREE from 'three';
import { RoomEnvironment } from './RoomEnvironment.js';

const W = 1080, H = 1920;
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), A = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eO = q => q >= 1 ? 1 : 1 - Math.pow(2, -10 * q);              // expoOut
const qO = q => 1 - Math.pow(1 - q, 5);                              // quintOut
const io = q => q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2; // easeInOut (kamera)
const bO = q => { const s = 1.7; q -= 1; return q * q * ((s + 1) * q + s) + 1; };
const hs = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const fmt = (v, d = 0) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
const C = { bg: '#0B0B0E', ink: '#F2EFE6', red: '#FF3B2F', gold: '#F2C230', mute: '#8A8A94', green: '#3DDC84' };
const F = { num: "'Big Shoulders Display'", head: "'Bricolage Grotesque'", mono: "'Martian Mono'" };

// ---------------- RENDERER ----------------
const canvas = document.getElementById('gl');
const R = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false);
R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
const sc = new THREE.Scene();
const pm = new THREE.PMREMGenerator(R); sc.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
const cam = new THREE.PerspectiveCamera(35, W / H, .05, 300);
const amb = new THREE.AmbientLight(0xffffff, .25); sc.add(amb);
const key = new THREE.SpotLight(0xFFE6C8, 60, 40, Math.PI / 6, .5, 1.6); key.position.set(4, 9, 6); sc.add(key); sc.add(key.target);
const rim = new THREE.PointLight(0xFF3B2F, 30, 30, 1.8); rim.position.set(-5, 3, -4); sc.add(rim);
const fill = new THREE.DirectionalLight(0x9AB8FF, .6); fill.position.set(-4, 2, 6); sc.add(fill);
sc.fog = new THREE.Fog(0x0B0B0E, 14, 40);

function tex(w, h, ciz) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); ciz(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const MAT = (o) => new THREE.MeshStandardMaterial(o);

// ---------------- NESNELER ----------------
let NOT, URUNLER, SERIT, KULE, DOLAR, LIRALAR, ERI, ZEMIN, ERIBAZ, NOKTALAR;
const URUN = [['EKMEK', '#E8A45A'], ['SÜT', '#F4F1EA'], ['PEYNİR', '#FFE08A'], ['YUMURTA', '#F2D7B0'], ['YAĞ', '#FFD23F'], ['DOMATES', '#FF4A3A'], ['ÇAY', '#3FA35A'], ['ŞEKER', '#FFFFFF'], ['MAKARNA', '#F2C46A'], ['PİRİNÇ', '#EDE6D6'], ['ZEYTİN', '#4A4A2A'], ['SABUN', '#8AD8FF']];
const VERI = [[2020.95, 14.6], [2021.25, 16.2], [2021.5, 19.0], [2021.75, 21.3], [2021.95, 36.1], [2022.2, 61.1], [2022.45, 73.5], [2022.6, 79.6], [2022.8, 85.5], [2022.95, 64.3], [2023.25, 43.7], [2023.5, 38.2], [2023.75, 61.4], [2023.95, 64.8], [2024.2, 68.5], [2024.4, 75.5], [2024.7, 49.4], [2024.95, 44.4], [2025.3, 37.9], [2025.6, 33.3], [2025.95, 30.9], [2026.7, 29.7]];
const SX = y => (y - 2023.7) * 3.2, SY = v => v * .085;
let EGRI;

function kur() {
  // zemin (yansımalı koyu)
  ZEMIN = new THREE.Mesh(new THREE.CircleGeometry(40, 64), MAT({ color: 0x111116, metalness: .6, roughness: .35 }));
  ZEMIN.rotation.x = -Math.PI / 2; sc.add(ZEMIN);
  // 100 ₺ banknot destesi
  const nTex = tex(1024, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#2E8A62'); gr.addColorStop(1, '#174A35'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 8; g.strokeRect(28, 28, w - 56, h - 56); for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(250, 256, 30 + i * 13, 0, 7); g.strokeStyle = `rgba(200,255,220,${.25 - i * .015})`; g.lineWidth = 3; g.stroke(); }
    g.fillStyle = '#E8FFF2'; g.font = `900 250px ${F.num}`; g.textAlign = 'right'; g.fillText('100', w - 70, 300); g.font = `500 34px ${F.mono}`; g.fillText('TÜRK LİRASI  ₺', w - 74, 420); });
  NOT = new THREE.Group(); const nG = new THREE.BoxGeometry(3.2, 1.6, .012);
  for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(nG, [MAT({ color: 0x1E5A42 }), MAT({ color: 0x1E5A42 }), MAT({ color: 0x1E5A42 }), MAT({ color: 0x1E5A42 }), MAT({ map: nTex, roughness: .55, metalness: .05 }), MAT({ map: nTex, roughness: .55 })]); m.position.set((hs(i) - .5) * .06, i * .016, (hs(i + 9) - .5) * .06); m.rotation.set(-Math.PI / 2, 0, (hs(i + 3) - .5) * .12); NOT.add(m); }
  sc.add(NOT);
  // ürün kutuları
  URUNLER = URUN.map(([ad, renk], i) => { const t = tex(512, 512, (g, w, h) => { g.fillStyle = renk; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, h * .7, w, h * .3); g.fillStyle = ad === 'ZEYTİN' || ad === 'ÇAY' ? '#F2EFE6' : '#111'; g.font = `800 ${ad.length > 6 ? 84 : 104}px ${F.head}`; g.textAlign = 'center'; g.fillText(ad, w / 2, h * .52); g.font = `500 30px ${F.mono}`; g.fillText('₺ · 2021', w / 2, h * .86); });
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.15), MAT({ map: t, roughness: .45, metalness: .02 })); b.userData = { c: i % 4, r: Math.floor(i / 4) }; sc.add(b); return b; });
  // 3B enflasyon şeridi (alan + üst tüp)
  const pts = VERI.map(([y, v]) => new THREE.Vector2(SX(y), SY(v)));
  const sh = new THREE.Shape(); sh.moveTo(pts[0].x, 0); pts.forEach(p => sh.lineTo(p.x, p.y)); sh.lineTo(pts[pts.length - 1].x, 0); sh.lineTo(pts[0].x, 0);
  SERIT = new THREE.Group();
  const alan = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .45, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 2, curveSegments: 4 }), MAT({ color: 0x6A0A10, emissive: 0x2A0004, metalness: .5, roughness: .35, transparent: true, opacity: .92 }));
  alan.position.z = -.225; SERIT.add(alan);
  EGRI = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p.x, p.y + .04, 0)), false, 'centripetal', .5);
  SERIT.add(new THREE.Mesh(new THREE.TubeGeometry(EGRI, 400, .09, 12, false), MAT({ color: 0xFFE6A0, emissive: 0xFF8A3A, emissiveIntensity: .9, metalness: .2, roughness: .3 })));
  NOKTALAR = []; [[2022.8, 85.5], [2026.7, 29.7]].forEach(([y, v]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.22, 32, 16), MAT({ color: 0xFFFFFF, emissive: 0xFFD27A, emissiveIntensity: 1.4 })); s.position.set(SX(y), SY(v) + .05, 0); SERIT.add(s); NOKTALAR.push(s); });
  for (let y = 2021; y <= 2026; y++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.02, 8, .02), MAT({ color: 0x333340, emissive: 0x15151C })); m.position.set(SX(y), 4, -.5); SERIT.add(m); }
  sc.add(SERIT);
  // altın/para kuleleri (6 yıl)
  const lTex = tex(512, 512, (g, w, h) => { const gr = g.createRadialGradient(w * .4, h * .35, 20, w / 2, h / 2, w * .55); gr.addColorStop(0, '#FFE7A0'); gr.addColorStop(1, '#B98618'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#8A6010'; g.lineWidth = 14; g.beginPath(); g.arc(w / 2, h / 2, w * .42, 0, 7); g.stroke(); g.fillStyle = '#7A5208'; g.font = `900 300px ${F.num}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('₺', w / 2, h / 2 + 10); });
  const coinG = new THREE.CylinderGeometry(.5, .5, .09, 64), coinM = [MAT({ color: 0xD8A632, metalness: .95, roughness: .28 }), MAT({ map: lTex, metalness: .9, roughness: .3 }), MAT({ map: lTex, metalness: .9, roughness: .3 })];
  const M = [1, 1.36, 2.24, 3.68, 5.32, 6.96];
  KULE = M.map((m, k) => { const g = new THREE.Group(); const n = Math.round(m * 9); for (let i = 0; i < n; i++) { const c = new THREE.Mesh(coinG, coinM); c.position.set((hs(k * 50 + i) - .5) * .05, i * .095 + .045, (hs(k * 50 + i + 7) - .5) * .05); c.rotation.y = hs(i) * 6; g.add(c); } g.position.x = (k - 2.5) * 1.35; g.userData = { n, m }; sc.add(g); return g; });
  // dolar parası + lira yığını
  const dTex = tex(512, 512, (g, w, h) => { const gr = g.createRadialGradient(w * .4, h * .35, 20, w / 2, h / 2, w * .55); gr.addColorStop(0, '#F4F6F8'); gr.addColorStop(1, '#8C949E'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#5A626C'; g.lineWidth = 14; g.beginPath(); g.arc(w / 2, h / 2, w * .42, 0, 7); g.stroke(); g.fillStyle = '#3A424C'; g.font = `900 320px ${F.num}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', w / 2, h / 2 + 10); });
  DOLAR = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, .16, 96), [MAT({ color: 0xA8B0BA, metalness: 1, roughness: .22 }), MAT({ map: dTex, metalness: .95, roughness: .25 }), MAT({ map: dTex, metalness: .95, roughness: .25 })]); sc.add(DOLAR);
  LIRALAR = new THREE.InstancedMesh(coinG, coinM[0], 43); sc.add(LIRALAR);
  // eriyen lira (yüksek çözünürlüklü üst yüz)
  const eG = new THREE.CylinderGeometry(1.6, 1.6, .26, 128, 6, false); ERIBAZ = Float32Array.from(eG.attributes.position.array);
  ERI = new THREE.Mesh(eG, [MAT({ color: 0xD8A632, metalness: .95, roughness: .25 }), MAT({ map: lTex, metalness: .9, roughness: .28 }), MAT({ map: lTex, metalness: .9, roughness: .28 })]); sc.add(ERI);
}

// ---------------- KAMERA ----------------
function kamera(p, h, fov = 35) { cam.position.set(p[0], p[1], p[2]); cam.lookAt(h[0], h[1], h[2]); cam.fov = fov; cam.updateProjectionMatrix(); }
function ekrana(v) { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; }

// ---------------- TİPOGRAFİ (DOM) ----------------
const ext = (n, r) => { const a = []; for (let i = 1; i <= n; i++) a.push(`0 ${i}px 0 ${r}`); return a.join(','); };
function yaz(s, x, y, fs, { f = F.num, w = 900, renk = C.ink, op = 1, sc: k = 1, rot = 0, ls = 0, derin = 0, dr = '#000', blur = 0, ry = 0, rx = 0, gol = true } = {}) {
  return `<div class="t" style="left:${x}px;top:${y}px;font-family:${f};font-weight:${w};font-size:${fs}px;letter-spacing:${ls}px;color:${renk};opacity:${op};transform:translate(-50%,-50%) perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rot}deg) scale(${k});${blur ? `filter:blur(${blur}px);` : ''}text-shadow:${derin ? ext(derin, dr) + ',' : ''}${gol ? '0 18px 40px rgba(0,0,0,.55)' : 'none'}">${s}</div>`; }
// harf harf giriş (stagger 45ms, quintOut, y-düşüş)
function harf(T, t0, s, x, y, fs, o = {}) { if (T < t0) return ''; const cik = o.t1 ? A(T, o.t1, o.t1 + .2) : 0; if (cik >= 1) return ''; let i = 0, out = '';
  const parca = [...s].map(ch => { const p = qO(A(T, t0 + (i++) * .045, t0 + i * .045 + .45)); return `<span style="display:inline-block;transform:translateY(${(1 - p) * fs * .55}px) rotate(${(1 - p) * 8}deg);opacity:${p}">${ch === ' ' ? '&nbsp;' : ch}</span>`; }).join('');
  return yaz(parca, x, y - cik * 40, fs, Object.assign({}, o, { op: 1 - cik, blur: cik * 10 })); }
// slam: büyükten çarpar (0,16 sn expoOut) — sert vuruşlarda
function slam(T, t0, s, x, y, fs, o = {}) { const d = T - t0; if (d < 0) return ''; const cik = o.t1 ? A(T, o.t1, o.t1 + .18) : 0; if (cik >= 1) return ''; const q = eO(cl(d / .16));
  return yaz(s, x, y, fs, Object.assign({}, o, { sc: (o.sc || 1) * (1.7 - .7 * q) * (1 - .2 * cik), rot: (o.rot || 0) + (1 - q) * -6, op: Math.min(1, d / .05) * (1 - cik), blur: (1 - q) * 8 + cik * 14 })); }
function hud(T, sol, sag) { const pr = T / 60; return `<div class="hud" style="top:96px;left:64px">${sol}</div><div class="hud" style="top:96px;right:64px;text-align:right">${sag}</div><div style="position:absolute;left:64px;top:150px;width:952px;height:3px;background:rgba(242,239,230,.14)"><div style="width:${pr * 100}%;height:3px;background:${C.red}"></div></div>`; }

// ---------------- POST: gren (önceden üretilmiş tohumlu karolar) ----------------
const GREN = []; for (let k = 0; k < 8; k++) { const c = document.createElement('canvas'); c.width = 270; c.height = 480; const g = c.getContext('2d'), d = g.createImageData(270, 480); let s = 1234 + k * 977; const r = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); GREN.push(c.toDataURL()); }

// ---------------- ZAMAN ÇİZELGESİ ----------------
const VURUS = [1.0, 2.0, 2.5, 4.0, 7.0, 8.25, 10.85, 13.45, 16.05, 18.65, 25.0, 25.25, 27.5, 30.0, 34.5, 37.0, 41.5, 43.0, 53.5, 54.5, 57.0];
const FLAS = [2.5, 8.0, 25.0, 34.5, 41.5, 53.5, 57.0];
const SINIR = [4, 8, 22, 30, 37, 43, 50, 56];
const YIL = [[2021, 36.08, 136], [2022, 64.27, 224], [2023, 64.77, 368], [2024, 44.38, 532], [2025, 30.89, 696]];

function goster(...ler) { [NOT, SERIT, DOLAR, LIRALAR, ERI, ...URUNLER, ...KULE].forEach(o => o.visible = false); ler.flat().forEach(o => o.visible = true); }
function bgRenk(h) { sc.background = new THREE.Color(h); sc.fog.color = new THREE.Color(h); }

function cerceve(T) {
  let ui = '', solHud = 'ENFLASYON · TÜRKİYE', sagHud = '';
  sc.fog.near = 14; key.intensity = 60; rim.intensity = 30; rim.color.set(0xFF3B2F); amb.intensity = .25; ZEMIN.visible = true; ZEMIN.position.y = 0;
  // ===== A 0–4 HOOK =====
  if (T < 4) {
    goster(NOT); bgRenk('#08090B'); sagHud = '00 · BAŞLANGIÇ';
    const q = io(A(T, 0, 3.4)), ang = .9 - 1.3 * q;
    kamera([Math.sin(ang) * lerp(9, 4.6, q), lerp(4.2, 2.0, q), Math.cos(ang) * lerp(9, 4.6, q)], [0, .3, 0], lerp(35, 30, eO(A(T, 2.5, 2.7))));
    NOT.rotation.y = T * .25; NOT.position.y = .4 + Math.sin(T * 1.6) * .05;
    NOT.children.forEach((m, i) => { const d = A(T, 3.25 + i * .02, 4.0); m.position.y = i * .016 + d * d * (3 + i * .5); m.position.x = (hs(i) - .5) * .06 + d * (hs(i + 2) - .5) * 6; m.rotation.z = (hs(i + 3) - .5) * .12 + d * (hs(i + 5) - .5) * 8; });
    ui += harf(T, 1.0, 'BU 100 LİRA', 540, 420, 150, { derin: 8, dr: '#2A0000' });
    ui += slam(T, 2.0, 'NEREYE', 540, 1330, 260, { renk: C.gold, derin: 14, dr: '#5A4400' });
    ui += slam(T, 2.5, 'GİTTİ?', 540, 1590, 340, { renk: C.gold, derin: 18, dr: '#5A4400' });
  }
  // ===== B 4–8 SEPET =====
  else if (T < 8) {
    goster(URUNLER); bgRenk('#0E0E14'); sagHud = 'OCAK 2021';
    const q = io(A(T, 4, 7.6)); kamera([lerp(.5, -3.0, q), lerp(13, 5.2, q), lerp(3.5, 11.5, q)], [0, 2.6, 0], 34);
    URUNLER.forEach((b, i) => { const { c, r } = b.userData, d = bO(A(T, 4.2 + i * .07, 4.75 + i * .07)); b.position.set((c - 1.5) * 1.22, .6 + r * 1.2 + (1 - d) * 7, 0); b.rotation.set(0, (hs(i) - .5) * .25, (hs(i + 4) - .5) * .1 * (1 - d)); });
    ui += harf(T, 4.0, 'OCAK 2021', 540, 420, 190, { derin: 8, dr: '#222' });
    if (T > 5.5) { const r = qO(A(T, 5.5, 6.1)); ui += `<div class="tag" style="transform:translate(-50%,-50%) perspective(1400px) rotateY(${(1 - r) * 90}deg) rotate(-4deg)">100 ₺</div>`; }
    ui += slam(T, 7.0, '= DOLU SEPET', 540, 640, 120, { f: F.head, w: 800, renk: C.gold });
  }
  // ===== C 8–22 YIL YIL =====
  else if (T < 22) {
    goster(URUNLER);
    const i = Math.min(4, Math.floor((T - 8) / 2.6)), t0 = 8 + i * 2.6, [yil, yuzde, fiyat] = YIL[i], once = i ? YIL[i - 1][2] : 100;
    const kac = y => Math.max(2, Math.round(12 / (y / 100))), n = kac(fiyat), nOnce = i ? kac(once) : 12;
    const kz = yuzde / 85; bgRenk(new THREE.Color('#0E0E14').lerp(new THREE.Color('#3A0608'), kz * .85).getStyle()); sagHud = 'YIL ' + yil;
    const ang = lerp(-.55, .55, io(A(T, 8, 22))), sh = Math.exp(-Math.max(0, T - (t0 + .25)) * 14) * (T > t0 + .25 ? 1 : 0);
    kamera([Math.sin(ang) * 11.5 + (hs(Math.floor(T * 60)) - .5) * .3 * sh, 4.6 + (hs(Math.floor(T * 60) + 9) - .5) * .3 * sh, Math.cos(ang) * 11.5], [0, 2.9, 0], 34);
    URUNLER.forEach((b, k) => { const { c, r } = b.userData; b.position.set((c - 1.5) * 1.22, .6 + r * 1.2, 0); b.rotation.set(0, (hs(k) - .5) * .25, 0);
      // kaç yılında çıktı?
      let cikT = null; for (let j = 0; j <= i; j++) { const nj = kac(YIL[j][2]), nPrev = j ? kac(YIL[j - 1][2]) : 12; if (k >= nj && k < nPrev) cikT = 8 + j * 2.6 + .55 + (k - nj) * .06; }
      if (cikT != null) { const d = T - cikT; if (d > 0) { const yon = hs(k + 30) > .5 ? 1 : -1; b.position.x += yon * d * 7; b.position.y += d * 5 - 14 * d * d; b.position.z += d * 3; b.rotation.x += d * 7 * yon; b.rotation.z += d * 5; if (d > 1.2) b.visible = false; } } });
    rim.intensity = 30 + 90 * kz;
    const f = qO(A(T, t0, t0 + .4));
    ui += yaz(String(yil), 540, 330, 230, { op: f, rx: (1 - f) * 90, derin: 8, dr: '#300' });
    ui += slam(T, t0 + .25, '%' + fmt(yuzde, 2), 540, 590, 330, { renk: yuzde > 60 ? C.red : C.gold, derin: 16, dr: '#200' });
    const fv = once + (fiyat - once) * io(A(T, t0 + .35, t0 + 1.5)), hiz = A(T, t0 + .35, t0 + 1.5) > 0 && A(T, t0 + .35, t0 + 1.5) < 1;
    ui += `<div class="tag" style="top:1560px;transform:translate(-50%,-50%) rotate(-4deg)"><small>100 ₺'LİK SEPET</small><span style="${hiz ? 'filter:blur(1.5px)' : ''}">${fmt(Math.round(fv))} ₺</span></div>`;
    ui += yaz(`100 ₺ İLE: ${n}/12 ÜRÜN`, 540, 800, 36, { f: F.mono, w: 500, op: A(T, t0 + 1.0, t0 + 1.3), ls: 3, gol: false });
  }
  // ===== D 22–30 ZİRVE: şerit boyunca uçuş =====
  else if (T < 30) {
    goster(SERIT); bgRenk('#0A0A0D'); sagHud = '2021 → 2026'; ZEMIN.position.y = -.02;
    const u = io(A(T, 22.1, 25.0)) * .37, p = EGRI.getPointAt(Math.min(u, 1)), ileri = EGRI.getPointAt(Math.min(u + .04, 1));
    const pk = new THREE.Vector3(SX(2022.8), SY(85.5), 0);
    if (T < 25) kamera([p.x - 1.5, p.y * .6 + 2.6, 15.5], [p.x + 1.6, p.y * .7 + 1.2, 0], 46);
    else { const q = io(A(T, 25.6, 29.4)); kamera([lerp(pk.x - 2.0, pk.x + 2.5, q), lerp(pk.y + 1.4, pk.y + 4.5, q), lerp(6.0, 17, q)], [lerp(pk.x, SX(2023.8), q), lerp(pk.y - 1.6, 2.4, q), 0], lerp(40, 44, q)); }
    const alarm = T > 25 && T < 27.6 ? (Math.floor(T * 8) % 2 ? 1 : 0) : 0; rim.intensity = 40 + 260 * alarm; rim.position.set(pk.x - 2, pk.y + 2, 3);
    NOKTALAR[0].scale.setScalar(1 + .6 * Math.exp(-Math.max(0, T - 25) * 4) * (T > 25 ? 1 : 0)); NOKTALAR[1].visible = false;
    ui += slam(T, 22.2, 'ENFLASYONUN 5 YILI', 540, 380, 110, { f: F.head, w: 800, t1: 24.85 });
    ui += slam(T, 25.0, 'EKİM 2022', 540, 360, 120, { f: F.mono, w: 700, ls: 4 });
    ui += slam(T, 25.25, '%85,51', 540, 600, 400, { renk: C.red, derin: 18, dr: '#200' });
    ui += harf(T, 27.5, '24 YILIN ZİRVESİ', 540, 860, 110, { f: F.head, w: 800, renk: C.gold });
  }
  // ===== E 30–37 KULELER =====
  else if (T < 37) {
    goster(KULE); bgRenk('#0D0B10'); sagHud = '2020 → 2025';
    const q = io(A(T, 30, 36.8)), ang = lerp(-.7, .5, q); kamera([Math.sin(ang) * 10.5, lerp(1.1, 3.6, q), Math.cos(ang) * 10.5], [0, 2.3, 0], lerp(30, 38, q));
    KULE.forEach((g, k) => { const { n } = g.userData, gor = Math.floor(n * bO(A(T, 31 + k * .45, 31.9 + k * .45))); g.children.forEach((c, i) => c.visible = i < gor); });
    ui += harf(T, 30.0, '5 YILDA', 540, 380, 140, { derin: 6, dr: '#222' }) + harf(T, 30.4, 'FİYATLAR', 540, 540, 190, { renk: C.gold, derin: 10, dr: '#4A3800' });
    KULE.forEach((g, k) => { const { n, m } = g.userData, gor = n * bO(A(T, 31 + k * .45, 31.9 + k * .45)); if (gor < 1) return; const [x, y] = ekrana(new THREE.Vector3(g.position.x, gor * .095 + .45, 0)); ui += yaz(fmt(m, 2).replace(',00', '') + '×', x, y, 38, { f: F.mono, w: 700, renk: k === 5 ? C.red : C.ink, gol: false }); });
    ui += slam(T, 34.5, '≈ 7 KAT', 540, 760, 300, { renk: C.red, derin: 16, dr: '#200' });
    ui += yaz('2020 sonu → 2025 sonu · TÜİK TÜFE', 540, 1760, 26, { f: F.mono, w: 500, renk: C.mute, op: A(T, 35, 35.4), gol: false });
  }
  // ===== F 37–43 DOLAR (dolly-zoom) =====
  else if (T < 43) {
    goster(DOLAR, LIRALAR); bgRenk('#08100C'); sagHud = 'DÖVİZ'; rim.color.set(0x3DDC84); rim.intensity = 50;
    const q = io(A(T, 37, 42.8)), fov = lerp(22, 58, q), d = 14 * Math.tan(THREE.MathUtils.degToRad(22 / 2)) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    kamera([0, 1.7 + .6 * q, d], [0, 1.5, 0], fov);
    DOLAR.position.set(0, 1.7, 0); DOLAR.rotation.set(Math.PI / 2, 0, T * 2.2);
    const v = 7.4 + (43 - 7.4) * io(A(T, 37.6, 41.2)), adet = Math.floor(v); const mt = new THREE.Matrix4(), qq = new THREE.Quaternion(), sv = new THREE.Vector3(.55, .55, .55);
    for (let i = 0; i < 43; i++) { const yer = i < adet ? 1 : 0, kol = i % 8, kat = Math.floor(i / 8), tGel = 37.6 + (i / 43) * 3.6, dd = cl((T - tGel) / .35);
      const pos = new THREE.Vector3((kol - 3.5) * .62, .05 + kat * .06 + (1 - dd) * 4 * yer, -1.6 - kat * .02 + (hs(i) - .5) * .2); qq.setFromEuler(new THREE.Euler(0, hs(i) * 6, (1 - dd) * 3)); mt.compose(pos, qq, i < adet ? sv : new THREE.Vector3(0, 0, 0)); LIRALAR.setMatrixAt(i, mt); }
    LIRALAR.instanceMatrix.needsUpdate = true;
    const dev = A(T, 37.6, 41.2) > 0 && A(T, 37.6, 41.2) < 1;
    ui += harf(T, 37.0, '1 DOLAR', 540, 380, 170, { derin: 8, dr: '#0A2A1A' });
    ui += yaz(fmt(v, 2) + ' ₺', 540, 1330, 250, { renk: C.green, derin: 12, dr: '#062A16', blur: dev ? 1.4 : 0 });
    ui += yaz('OCAK ' + Math.round(2021 + 5 * io(A(T, 37.6, 41.2))), 540, 1500, 50, { f: F.mono, w: 500, ls: 4, op: A(T, 37.6, 37.9), gol: false });
    ui += slam(T, 41.5, '≈ 6 KAT', 540, 640, 260, { renk: C.gold, derin: 14, dr: '#4A3800' });
  }
  // ===== G 43–50 ERİME (makro, açık zemin) =====
  else if (T < 50) {
    goster(ERI); bgRenk('#EDE8DC'); sc.fog.near = 30; sagHud = 'TANIM'; amb.intensity = .8; key.intensity = 90; rim.intensity = 10; ZEMIN.visible = false;
    const q = io(A(T, 43, 49.8)); kamera([0, lerp(10, 7.2, q), lerp(9, 6.2, q)], [0, -.2, .1], lerp(34, 32, q));
    eriyor(A(T, 46.6, 49.8));
    ui += harf(T, 43.0, 'ENFLASYON', 540, 380, 200, { renk: '#141418', gol: false }) + slam(T, 43.6, 'NEDİR?', 540, 560, 130, { f: F.head, w: 800, renk: C.red, gol: false });
    ui += yaz('FİYATLARIN ARTMASI DEĞİL SADECE —', 540, 1560, 34, { f: F.mono, w: 500, renk: '#55555F', ls: 2, op: A(T, 44.5, 44.8), gol: false });
    ui += harf(T, 46.0, 'PARANIN ERİMESİ', 540, 1700, 120, { f: F.head, w: 800, renk: C.red, gol: false });
  }
  // ===== H 50–56 BUGÜN =====
  else if (T < 56) {
    goster(SERIT); bgRenk('#0A0A0D'); sagHud = 'EYLÜL 2026'; NOKTALAR[1].visible = true;
    const q = io(A(T, 50, 55.8)), son = new THREE.Vector3(SX(2026.7), SY(29.7), 0);
    kamera([lerp(SX(2022.4), son.x + 1.2, q), lerp(9.5, 4.2, q), lerp(9, 6.5, q)], [lerp(SX(2023.5), son.x - .8, q), lerp(4, 2.6, q), 0], 38);
    const ama = T > 53.5 && T < 54 ? 1 : 0; rim.intensity = 30 + 300 * ama * (Math.floor(T * 30) % 2);
    const v = 85.51 + (29.73 - 85.51) * io(A(T, 50.3, 52.2));
    ui += slam(T, 50.0, 'EYLÜL 2026', 540, 380, 70, { f: F.mono, w: 700, ls: 4 });
    ui += yaz('%' + fmt(v, 2), 540, 620, 330, { renk: v > 50 ? C.red : C.gold, derin: 16, dr: '#200', op: A(T, 50.3, 50.5) });
    ui += slam(T, 52.3, 'DÜŞÜYOR ↓', 540, 880, 120, { f: F.head, w: 800, renk: C.green, t1: 53.4 });
    ui += yaz('57 ay sonra ilk kez %30\'un altında', 540, 1000, 40, { f: F.mono, w: 600, renk: C.green, op: A(T, 52.6, 52.8) * (1 - A(T, 53.3, 53.45)), gol: false });
    ui += slam(T, 53.5, 'AMA', 540, 900, 280, { derin: 14, dr: '#222', t1: 54.1 });
    ui += harf(T, 54.2, 'PARAN HÂLÂ', 540, 1150, 120, { f: F.head, w: 800 }) + slam(T, 54.5, 'YILDA ~%23', 540, 1340, 220, { renk: C.red, derin: 12, dr: '#200' }) + slam(T, 54.8, 'ERİYOR', 540, 1540, 200, { renk: C.red, derin: 12, dr: '#200' });
    ui += yaz('%29,73 fiyat artışı ≈ alım gücünde %23 kayıp', 540, 1760, 26, { f: F.mono, w: 500, renk: C.mute, op: A(T, 55, 55.3), gol: false });
  }
  // ===== I 56–60 FİNAL =====
  else {
    goster(ERI); bgRenk('#09090B'); sagHud = 'SON'; ZEMIN.visible = false; key.intensity = 70; rim.intensity = 60;
    const q = io(A(T, 56, 59.8)); kamera([0, lerp(11, 17, q), lerp(7, 3, q)], [0, 0, .6], 36);
    eriyor(1 + .25 * A(T, 56, 58.5));
    ui += harf(T, 56.0, 'PARAN DURURSA', 540, 520, 130, { f: F.head, w: 800 });
    ui += slam(T, 57.0, 'ERİR.', 540, 760 + 60 * io(A(T, 57.3, 59)), 360, { renk: C.red, derin: 16, dr: '#200' });
    ui += harf(T, 58.2, 'SEN NE YAPIYORSUN?', 540, 1500, 80, { f: F.head, w: 800, renk: C.gold });
    ui += yaz('Kaynak: TÜİK TÜFE · döviz kurları yaklaşık', 540, 1770, 24, { f: F.mono, w: 500, renk: C.mute, op: A(T, 58.6, 59), gol: false });
  }
  return { ui, solHud, sagHud };
}
// eriyen para: üst yüz aşağı çöker, kenar dışa yayılır, damlalar
function eriyor(m) { const g = ERI.geometry, p = g.attributes.position.array; ERI.position.set(0, .13, 0); ERI.rotation.set(0, .3, 0);
  for (let i = 0; i < p.length; i += 3) { const x = ERIBAZ[i], y = ERIBAZ[i + 1], z = ERIBAZ[i + 2], r = Math.hypot(x, z), a = Math.atan2(z, x);
    const dalga = 1 + .18 * Math.sin(a * 5 + 1) * m + .1 * Math.sin(a * 11 + 2) * m, yay = 1 + .55 * m * m * dalga, cok = y > 0 ? 1 - .85 * m : 1;
    p[i] = x * yay; p[i + 2] = z * yay; p[i + 1] = (y + .13) * cok * (1 - .3 * m * (r / 1.6)) - .13; }
  g.attributes.position.needsUpdate = true; g.computeVertexNormals(); }

// ---------------- KARE ----------------
window.renderAt = t => {
  const T = (window.SB || 0) + t;
  const { ui, solHud, sagHud } = cerceve(T);
  // vuruş: zoom punch + sarsıntı (DOM + GL birlikte)
  let p = 0; for (const v of VURUS) { const d = T - v; if (d >= 0 && d < .4) p = Math.max(p, Math.exp(-d * 11)); }
  const sx = (hs(Math.floor(T * 60)) - .5) * 22 * p, sy = (hs(Math.floor(T * 60) + 77) - .5) * 22 * p;
  let fl = 0; for (const f of FLAS) { const d = T - f; if (d >= 0 && d < .1) fl = Math.max(fl, .85 * (1 - d / .1)); }
  let wb = 0, wx = 0; for (const s of SINIR) { const d = T - s; if (d > -.1 && d < .1) { const k = 1 - Math.abs(d) / .1; wb = 26 * k; wx = (d < 0 ? -1 : 1) * 160 * k; } }
  R.render(sc, cam);
  document.getElementById('sahne').style.transform = `translate(${sx + wx}px,${sy}px) scale(${1 + .045 * p})`;
  document.getElementById('sahne').style.filter = wb ? `blur(${wb}px)` : 'none';
  document.getElementById('ui').innerHTML = ui;
  document.getElementById('hudk').innerHTML = hud(T, solHud, sagHud);
  document.getElementById('flas').style.opacity = fl;
  document.getElementById('gren').style.backgroundImage = `url(${GREN[Math.floor(T * 24) % GREN.length]})`;
};

await document.fonts.ready;
await Promise.all([`900 100px ${F.num}`, `800 100px ${F.head}`, `500 30px ${F.mono}`, `700 30px ${F.mono}`].map(f => document.fonts.load(f, 'ĞÜŞİÖÇ₺$%0123')));
kur();
window.HAZIR = true;
