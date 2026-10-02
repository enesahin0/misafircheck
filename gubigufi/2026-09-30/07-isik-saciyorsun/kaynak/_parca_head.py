"""#7 Işık saçıyorsun — sahne HTML'lerini ve plan.json'u üretir (flat-bilim-animasyonu skill sözleşmesi).
Her sahne: t=0 = sahne başı; hareketler renderAt(t) içinde, sadece t'ye bağlı. Global zaman = SB + t."""
import json

SB = [0, 3.17, 6.30, 12.97, 17.67, 22.0, 26.66, 32.07, 40.15, 47.39, 49.5]

HEAD = """<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../ortak/stil.css"><link rel="stylesheet" href="../ortak/kanal.css">
</head><body>
<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
  <g id="zemin"></g><g class="kamera"><g id="sabit"></g><g id="dinamik"></g></g>
</svg>
<script>window.SB = __SB__;</script>
<script src="../ortak/kit.js"></script><script src="../ortak/maskot.js"></script><script src="../ortak/isik.js"></script>
<script src="../ortak/logo_paths.js"></script><script src="../ortak/altyazi.js"></script>
<script>
const $ = i => document.getElementById(i), A = K.aralik, E = K.ease;
const back = x => { const c1 = 1.70158, c3 = c1 + 1; return x <= 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const pop = (t, a, d = .45) => back(A(t, a, a + d));
const grp = (s, x, y, k = 1, r = 0, op = 1) => `<g transform="translate(${x} ${y}) scale(${k}) rotate(${r})" opacity="${op}">${s}</g>`;
const txt = (s, x, y, size, renk = '#FFF3D6', w = 900, ek = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="middle" style="fill:${renk}" ${ek}>${s}</text>`;
__JS__
</script>
<script src="../ortak/kanal.js"></script>
</body></html>"""

