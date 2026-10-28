/* gubigufi HARİTA — gerçek coğrafya (Natural Earth, world-atlas) + bizim çizgi tarzımız.
   Yükleme sırası (sahne HTML'inde):
     ../ortak/harita/d3-array.min.js, d3-geo.min.js, topojson-client.min.js, dunya50.js (veya dunya110.js), ulke_tablo.js, turkiye10.js, harita.js
   Kullanım:
     const h = H.ciz({ ulkeler: H.kita('AF'), vurgu: { 'Mısır': '#FF9F1C' }, kutu: [80, 380, 920, 900], proj: 'mercator' });
     o += h.svg;  const [x, y] = h.p([31.2, 30.0]);   // Kahire'ye iğne koymak için
     H.kure({ x: 540, y: 800, r: 300, donus: [-35, -39] })  → gerçek kıtalı dünya küresi (Türkiye'ye dönük)
   Tarz: kontur yok (sınırlar ince, yarı saydam açık çizgi), rim light (sağ üstten), yumuşak düşen gölge, yuvarlak birleşimler. */
const H = (() => {
  let n = 0; const id = p => `h${p}${++n}`;
  const T = window.ULKE_TABLO || {};
  const topo = window.DUNYA50 || window.DUNYA110;
  const TUM = topojson.feature(topo, topo.objects.countries).features.filter(f => f.id !== '010'); // Antarktika hariç
  const TR10 = window.TURKIYE10 ? window.TURKIYE10.features : [];
  const kucuk = s => (s || '').toLocaleLowerCase('tr');
  function bul(q) {
    if (q && q.type === 'Feature') return q;
    const k = kucuk(String(q));
    let f = TUM.find(f => f.id === String(q)) || TUM.find(f => T[f.id] && (kucuk(T[f.id].tr) === k || kucuk(T[f.id].en) === k)) || TUM.find(f => kucuk(f.properties.name) === k);
    if (f && TR10.length) { const d = TR10.find(g => g.id === f.id); if (d) f = d; } // Türkiye/Kıbrıs yüksek çözünürlük
    return f;
  }
  const ulke = (...q) => q.flat().map(bul).filter(Boolean);
  const kita = k => TUM.filter(f => T[f.id] && T[f.id].kita === k).map(f => bul(f.id)); // AF, EU, AS, NA, SA, OC
  const dunya = () => TUM;
  const trAd = f => (T[f.id] && T[f.id].tr) || f.properties.name;
  const PROJ = { mercator: () => d3.geoMercator(), equalEarth: () => d3.geoEqualEarth(), naturalEarth: () => d3.geoNaturalEarth1(), orthographic: () => d3.geoOrthographic(), conic: () => d3.geoConicConformal() };

  // ciz: ülkeleri kutuya sığdırıp flat tarzda çizer. Döner: { svg, p(lonlat)->[x,y], yol(feature)->d }
  function ciz({ ulkeler = TUM, sigdir = null, vurgu = {}, kutu = [60, 300, 960, 1000], proj = 'mercator', donus = null, kenar = 0,
    renk = '#E9DDC2', rim = '#FFF6E0', golge = '#B9A98A', sinir = '#FFFFFF', sinirOp = .55, sinirKal = 1.6, golgeOp = .22, rimK = 6, arka = '' } = {}) {
    const pr = PROJ[proj]();
    if (donus) pr.rotate(donus);
    const [x, y, w, h] = kutu;
    pr.fitExtent([[x + kenar, y + kenar], [x + w - kenar, y + h - kenar]], { type: 'FeatureCollection', features: sigdir || ulkeler });
    const yol = d3.geoPath(pr), cid = id('cl'), vid = {};
    const vk = {}; for (const k in vurgu) { const f = bul(k); if (f) vk[f.id] = vurgu[k]; }
    const hepsi = ulkeler.map(f => yol(f) || '').join('');
    let s = arka;
    // düşen gölge
    s += `<path d="${hepsi}" fill="#000" opacity="${golgeOp}" transform="translate(${rimK * 1.4} ${rimK * 2})"/>`;
    // rim light: açık renk taban + ana renk sol-aşağı kaydırılmış, kara şekline kırpılmış
    s += `<defs><clipPath id="${cid}"><path d="${hepsi}"/></clipPath></defs><g clip-path="url(#${cid})"><path d="${hepsi}" fill="${rim}"/>`;
    for (const f of ulkeler) { const d = yol(f); if (!d) continue; s += `<path d="${d}" fill="${vk[f.id] || renk}" transform="translate(${-rimK} ${rimK})"/>`; }
    s += `<path d="${hepsi}" fill="${golge}" opacity=".0"/></g>`;
    // sınırlar (ince, yarı saydam — kontur değil, ülkeleri ayıran "dikiş")
    if (sinir) s += `<path d="${hepsi}" fill="none" stroke="${sinir}" stroke-opacity="${sinirOp}" stroke-width="${sinirKal}" stroke-linejoin="round"/>`;
    return { svg: s, p: ll => pr(ll), yol: f => yol(f), proj: pr, merkez: f => pr(d3.geoCentroid(f)) };
  }
  // gerçek kıtalı küre (orthographic); donus = [-boylam, -enlem] (o noktayı merkeze getirir)
  function kure({ x = 540, y = 800, r = 300, donus = [-35, -39], deniz = '#4FB3E8', denizK = '#2A7FC0', kara = '#8FD16A', karaRim = '#DDF7C4', vurgu = {}, atmosfer = '#BFE8FF', sinirOp = .35 } = {}) {
    const pr = d3.geoOrthographic().rotate(donus).translate([x, y]).scale(r).clipAngle(90);
    const yol = d3.geoPath(pr), c = id('kr'), g = id('kg'), a = id('ka');
    const vk = {}; for (const k in vurgu) { const f = bul(k); if (f) vk[f.id] = vurgu[k]; }
    let s = `<defs><radialGradient id="${g}" cx=".62" cy=".35" r=".8"><stop offset="0" stop-color="${deniz}"/><stop offset="1" stop-color="${denizK}"/></radialGradient>` +
      `<radialGradient id="${a}"><stop offset=".86" stop-color="${atmosfer}" stop-opacity=".55"/><stop offset="1" stop-color="${atmosfer}" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="${c}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs>`;
    s += `<circle cx="${x}" cy="${y}" r="${r * 1.12}" fill="url(#${a})"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})"/><g clip-path="url(#${c})">`;
    const hepsi = TUM.map(f => yol(f) || '').join('');
    s += `<path d="${hepsi}" fill="${karaRim}"/>`;
    for (const f of TUM) { const d = yol(f); if (!d) continue; s += `<path d="${d}" fill="${vk[f.id] || kara}" transform="translate(${-r * .012} ${r * .012})"/>`; }
    s += `<path d="${hepsi}" fill="none" stroke="#FFFFFF" stroke-opacity="${sinirOp}" stroke-width="${Math.max(.6, r / 300)}"/>`;
    // gece tarafı gölgesi (ışık sağ üstten) — yumuşak radyal geçiş
    const gg = id('gg');
    s += `</g><defs><radialGradient id="${gg}" cx=".7" cy=".28" r=".95"><stop offset=".45" stop-color="#0B1433" stop-opacity="0"/><stop offset="1" stop-color="#0B1433" stop-opacity=".5"/></radialGradient></defs>` +
      `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${gg})"/><ellipse cx="${x + r * .38}" cy="${y - r * .45}" rx="${r * .22}" ry="${r * .12}" fill="#FFFFFF" opacity=".18" transform="rotate(35 ${x + r * .38} ${y - r * .45})"/>`;
    return { svg: s, p: ll => { const v = pr(ll); const dd = d3.geoDistance(ll, [-donus[0], -donus[1]]); return dd < Math.PI / 2 ? v : null; }, proj: pr };
  }
  // şehir/konum iğnesi (flat damla iğne)
  function igne(x, y, renk = '#EE312E', s = 1, etiket = '', yaziRenk = '#1B1640') {
    let o = `<ellipse cx="${x}" cy="${y + 2}" rx="${12 * s}" ry="${5 * s}" fill="#000" opacity=".25"/>` +
      `<path d="M${x} ${y} Q${x - 30 * s} ${y - 38 * s} ${x - 26 * s} ${y - 58 * s} A${26 * s} ${26 * s} 0 1 1 ${x + 26 * s} ${y - 58 * s} Q${x + 30 * s} ${y - 38 * s} ${x} ${y}Z" fill="${renk}"/>` +
      `<circle cx="${x}" cy="${y - 60 * s}" r="${10 * s}" fill="#FFFFFF"/>`;
    if (etiket) o += `<rect x="${x + 30 * s}" y="${y - 84 * s}" width="${etiket.length * 17 * s + 30 * s}" height="${44 * s}" rx="${22 * s}" fill="#FFF3D6"/><text x="${x + 45 * s}" y="${y - 54 * s}" font-size="${28 * s}" font-weight="900" style="fill:${yaziRenk}">${etiket}</text>`;
    return o;
  }
  return { ulke, kita, dunya, bul, trAd, ciz, kure, igne };
})();
