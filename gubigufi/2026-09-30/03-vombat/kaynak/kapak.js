window.render = function () {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  ctx.save(); ctx.translate(0, -260); nightBG(0); rock(520, 1360, 720, 200); wombat(700, 1150, 1.2, { face: -1, happy: 1 }); cube(300, 1115, 80, { ry: .6, rx: -.45, eyes: 1 }); ctx.restore();
  sparkle(390, 720, 34, { glow: 40 }); sparkle(435, 680, 13, { glow: 20 });
  const g = ctx.createLinearGradient(0, 1050, 0, 1250); g.addColorStop(0, 'rgba(11,19,40,0)'); g.addColorStop(1, 'rgba(11,19,40,1)'); ctx.fillStyle = g; ctx.fillRect(0, 1050, W, 200); ctx.fillStyle = '#0b1328'; ctx.fillRect(0, 1250, W, 670);
  text('DOĞADA TEK', 540, 1235, { fam: 'JetBrains Mono', w: 700, size: 44, align: 'center', color: COL.amber, ls: 10 });
  text('KÜP KAKA', 540, 1390, { size: 160, align: 'center', shadow: 40 });
  text('Vombatın köşeli sırrı', 540, 1480, { w: 500, size: 58, align: 'center', alpha: .95 });
  const s = 150 / 233; ctx.save(); ctx.translate(540, 1600); ctx.scale(s, s); ctx.translate(-141.5, -141.5);
  for (const [id, p] of Object.entries(LOGO.P)) { ctx.fillStyle = p.fill === '#231f20' ? COL.cream : p.fill; ctx.fill(p.path); } ctx.restore();
  vignette(.4); grain(0, .05);
};
