window.render = function () {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  theater(0, .35);
  const SX = 110, SY = 250, SW = 860, SH = 640; ctx.fillStyle = '#e9edf5'; ctx.fillRect(SX - 12, SY - 12, SW + 24, SH + 24); space(1.3, SX, SY, SW, SH, 1);
  beam(1000, 1180, SX + 20, SY + 30, SX + SW, SY + SH, .14); projector(1000, 1180, 1.0, 1, 0);
  glowCircle(330, 1000, 260, WARM, .35); hero(330, 1130, 360, { pose: 'fly', ph: 1, col: '#f3ead9' }); ctx.strokeStyle = '#1a1416'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(330, 806, 38, 0, 7); ctx.stroke(); ctx.fillStyle = '#f3ead9'; ctx.beginPath(); ctx.arc(330, 806, 35, 0, 7); ctx.fill();
  redStamp('İZİNSİZ', 700, 780, 1, { size: 70, rot: -.12 });
  const g2 = ctx.createLinearGradient(0, 1060, 0, 1250); g2.addColorStop(0, 'rgba(13,11,12,0)'); g2.addColorStop(1, 'rgba(13,11,12,1)'); ctx.fillStyle = g2; ctx.fillRect(0, 1060, W, 190); ctx.fillStyle = '#0d0b0c'; ctx.fillRect(0, 1250, W, 670);
  text('1982 · KÜLT FİLM', 540, 1235, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', color: COL.amber, ls: 6 });
  text('TÜRK STAR WARS', 540, 1380, { size: 116, align: 'center', shadow: 40, color: '#ffe8a8' });
  text('Dünyayı Kurtaran Adam', 540, 1470, { w: 500, size: 58, align: 'center', alpha: .95 });
  const s = 150 / 233; ctx.save(); ctx.translate(540, 1600); ctx.scale(s, s); ctx.translate(-141.5, -141.5);
  for (const [id, p] of Object.entries(LOGO.P)) { ctx.fillStyle = p.fill === '#231f20' ? COL.cream : p.fill; ctx.fill(p.path); } ctx.restore();
  vignette(.45); grain(0, .08);
};
