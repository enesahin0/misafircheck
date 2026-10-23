// Reels kapağı: yazılar 3:4 profil kırpımının (y 240–1680) içinde
window.render = function () {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  ctx.save(); ctx.translate(40, -140); wallScene(8, { broken: 2, man: false }); ctx.restore();
  glowCircle(540, 760, 520, COL.amber, .22);
  const g = ctx.createLinearGradient(0, 1000, 0, 1250); g.addColorStop(0, 'rgba(20,17,18,0)'); g.addColorStop(1, 'rgba(20,17,18,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 1000, W, 250); ctx.fillStyle = COL.ink; ctx.fillRect(0, 1250, W, 670);
  text('80 METRE AŞAĞIDA', 540, 1235, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', color: COL.amber, ls: 8 });
  text('DERİNKUYU', 540, 1390, { size: 150, align: 'center', shadow: 40 });
  text('Duvarın arkasında bir şehir', 540, 1480, { w: 500, size: 56, align: 'center', alpha: .95 });
  const s = 150 / 233; ctx.save(); ctx.translate(540, 1600); ctx.scale(s, s); ctx.translate(-141.5, -141.5);
  for (const [id, p] of Object.entries(LOGO.P)) { ctx.fillStyle = p.fill === '#231f20' ? COL.cream : p.fill; ctx.fill(p.path); } ctx.restore();
  vignette(.45); grain(0, .06);
};
