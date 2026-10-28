window.render = function () {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  const g = ctx.createRadialGradient(540, 700, 100, 540, 800, 1300); g.addColorStop(0, '#2a4a86'); g.addColorStop(1, '#0e1830'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  inkStamp('HİNDİ', 250, 420, 1, { size: 70, rot: -.18 }); inkStamp('DINDE', 830, 380, 1, { size: 60, rot: .14, col: '#9ec6e8' }); inkStamp('PERU', 880, 990, 1, { size: 56, rot: -.1, col: '#6fd39a' });
  turkey(520, 1000, 1.15, { tagTxt: 'TURKEY', hat: 1 });
  const g2 = ctx.createLinearGradient(0, 1080, 0, 1250); g2.addColorStop(0, 'rgba(14,24,48,0)'); g2.addColorStop(1, 'rgba(14,24,48,1)'); ctx.fillStyle = g2; ctx.fillRect(0, 1080, W, 170); ctx.fillStyle = '#0e1830'; ctx.fillRect(0, 1250, W, 670);
  text('KELİMENİN HİKÂYESİ #1', 540, 1235, { fam: 'JetBrains Mono', w: 700, size: 40, align: 'center', color: COL.amber, ls: 6 });
  text('TURKEY = HİNDİ?', 540, 1380, { size: 108, align: 'center', shadow: 40 });
  text('Kuş aslında Amerikalı', 540, 1470, { w: 500, size: 58, align: 'center', alpha: .95 });
  const s = 150 / 233; ctx.save(); ctx.translate(540, 1600); ctx.scale(s, s); ctx.translate(-141.5, -141.5);
  for (const [id, p] of Object.entries(LOGO.P)) { ctx.fillStyle = p.fill === '#231f20' ? COL.cream : p.fill; ctx.fill(p.path); } ctx.restore();
  vignette(.35); grain(0, .05);
};
