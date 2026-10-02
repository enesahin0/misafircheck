/* gubigufi ZEMİN — tepe/arazi çizgisini fonksiyonla tanımla, nesneleri o çizgiye OTURT.
   Kural: ağaç, bina, karakter vb. yere basan her şey Z.yer(x) ile konumlanır (asla elle tahmin edilen y yok),
   temas noktasına küçük gölge elipsi konur; gövde tabanı çizginin biraz altına (gomme px) gömülür → havada durma olmaz.
   Kullanım: const tepe = Z.tepe({ y0: 1060, dalga: [[38, 520, 0], [16, 210, 1.3]] });
             o += tepe.yol('#9ED36A');  const y = tepe.yer(150);  o += Z.agac(150, tepe.yer(150), 1); */
const Z = (() => {
  function tepe({ y0 = 1060, dalga = [[38, 520, 0], [16, 210, 1.3]], alt = 1920 } = {}) {
    const yer = x => y0 + dalga.reduce((a, [A, L, f]) => a + A * Math.sin(x / L * Math.PI * 2 + f), 0);
    const yol = (renk, dy = 0, op = 1) => { let d = `M-20 ${yer(-20) + dy}`; for (let x = 0; x <= 1100; x += 20) d += ` L${x} ${(yer(x) + dy).toFixed(1)}`; return `<path d="${d} L1100 ${alt} L-20 ${alt}Z" fill="${renk}" opacity="${op}"/>`; };
    return { yer, yol };
  }
  const golge = (x, y, w) => `<ellipse cx="${x}" cy="${y + 2}" rx="${w}" ry="${w * .18}" fill="#000" opacity=".16"/>`;
  function agac(x, y, s = 1, g1 = '#5DAE3F', g2 = '#86D05E', govde = '#8A5A3C', gomme = 10) { // y = zemin çizgisi
    return golge(x, y, 46 * s) + `<rect x="${x - 12 * s}" y="${y - 120 * s}" width="${24 * s}" height="${120 * s + gomme}" rx="${10 * s}" fill="${govde}"/>` +
      `<circle cx="${x}" cy="${y - 170 * s}" r="${90 * s}" fill="${g1}"/><circle cx="${x + 30 * s}" cy="${y - 200 * s}" r="${50 * s}" fill="${g2}"/>`;
  }
  return { tepe, agac, golge };
})();
