// Reels kapağı: 1080x1920; yazılar 3:4 profil kırpımının (y 240–1680) içinde
window.render = function () {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  ctx.fillStyle = '#1a0d08'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(65, -120); ctx.beginPath(); ctx.rect(-65, 0, W + 130, H + 240); ctx.clip(); ctx.translate(0, 0); scenePillar(28.95); ctx.restore();
  glowCircle(540, 560, 700, COL.amber, .18);
  const g = ctx.createLinearGradient(0, 960, 0, 1250); g.addColorStop(0, 'rgba(20,17,18,0)'); g.addColorStop(1, 'rgba(20,17,18,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 960, W, 290); ctx.fillStyle = 'rgba(20,17,18,1)'; ctx.fillRect(0, 1250, W, 670);
  sparkle(835, 330, 34, { glow: 40 }); sparkle(880, 290, 13, { glow: 20 });
  text('11.000 YIL ÖNCE', 540, 1235, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', color: COL.amber, ls: 8 });
  font(900, 150); const tw = ctx.measureText('GÖBEKLİTEPE').width; const fs = Math.min(150, 150 * 960 / tw);
  text('GÖBEKLİTEPE', 540, 1390, { size: fs, align: 'center', shadow: 40 });
  text('Önce tapınak mı geldi?', 540, 1480, { w: 500, size: 58, align: 'center', alpha: .95 });
  // küçük logo
  const s = 150 / 233; ctx.save(); ctx.translate(540, 1600); ctx.scale(s, s); ctx.translate(-141.5, -141.5);
  for (const [id, p] of Object.entries(LOGO.P)) { ctx.fillStyle = p.fill === '#231f20' ? COL.cream : p.fill; ctx.fill(p.path); } ctx.restore();
  vignette(.45); grain(0, .06);
};
