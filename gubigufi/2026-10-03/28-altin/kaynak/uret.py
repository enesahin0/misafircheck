"""#28 Altın — uzaydan gelen servet: sahne HTML'leri + plan.json + tepkiler.json. Maskotlar oyuncu: Gufi KAŞİF/kervan, Gubi bilge/arkeolog/simyacı/bilimci."""
import json
SB = [0, 2.96, 12.84, 18.2, 29.64, 35.16, 44.83, 52.23, 64.43, 79.03, 85.93, 97.81, 106.02, 110.2, 114.6]
ALT = {}
TEP = {
    1: [('gufi', .3, 'mutlu'), ('gubi', 1.0, 'aha')],
    2: [('gubi', 4.5, 'sasir'), ('gufi', 4.6, 'korku'), ('gufi', 6.0, 'zipla')],
    3: [('gufi', 1.5, 'korku'), ('gubi', 3.0, 'sasir')],
    4: [('gubi', 2.0, 'aha'), ('gufi', 3.0, 'sasir'), ('gubi', 6.6, 'mutlu'), ('gufi', 9.0, 'zipla')],
    5: [('gufi', 1.5, 'sasir'), ('gubi', 2.0, 'aha')],
    6: [('gufi', 1.0, 'mutlu'), ('gufi', 5.6, 'sasir'), ('gufi', 7.7, 'korku'), ('gubi', 8.4, 'kahkaha')],
    7: [('gubi', 1.0, 'kararli'), ('gubi', 3.4, 'korku'), ('gufi', 3.4, 'sasir'), ('gufi', 4.8, 'omuzSilk')],
    8: [('gufi', 1.0, 'mutlu'), ('gubi', 3.1, 'sasir'), ('gufi', 8.4, 'selam'), ('gubi', 9.8, 'sasir')],
    9: [('gufi', 2.7, 'sasir'), ('gubi', 3.4, 'kahkaha'), ('gufi', 7.2, 'korku'), ('gubi', 11.8, 'zipla')],
    10: [('gufi', 1.0, 'sasir'), ('gubi', 1.8, 'mutlu'), ('gufi', 5.0, 'sasir')],
    11: [('gubi', 3.7, 'sasir'), ('gufi', 9.6, 'uzgun'), ('gubi', 10.0, 'kahkaha')],
    12: [('gufi', 2.8, 'isaret'), ('gubi', 3.8, 'aha'), ('gufi', 6.0, 'zipla')],
    13: [('gufi', .3, 'goster'), ('gubi', 2.0, 'selam'), ('gufi', 2.4, 'zipla')],
}
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C, G = AL.G;
const KASIF = KO.giy('gufi', [['kasket', { renk: '#C8823A', siper: '#8A5A2A' }]]);
const KERVAN = KO.giy('gufi', [['hasir', { renk: '#E8C878', bant: '#C8323C' }]]);
const BILGE = KO.giy('gubi', ['gozluk']);
const ARKEOLOG = KO.giy('gubi', [['hasir', { renk: '#E8C878', bant: '#6A4428' }], 'gozluk']);
const SIMYACI = KO.giy('gubi', [['parti', { renk: '#5A3A9C', nokta: '#FFE45C' }]]);
const TUCCAR = KO.giy('gubi', [['bere', { renk: '#7E2E3A', tuy: '#FFF3D6' }]]);
const BILIMCI = KO.giy('gubi', ['gozluk', ['papyon', { renk: '#4A8AD8' }]]);
// astronot: beyaz tulum + sırt çantası + kollar/bacaklar; maskot yuvarlak cam kaskın içinde ORTALI. y = ayak tabanı, r = kask yarıçapı
function astro(kim, t, { x, y, r = 90, duygu = 'merak', bakHedef = null, kolSol = 200, kolSag = -20, renk = '#F4F6FA', serit = '#E8505B', tepkiler = true } = {}) {
  const cy = y - 3.05 * r, ty = y - 2.25 * r, W = 1.7 * r, KOY = '#C8CED8';
  const el = (a, s) => { const rad = a * Math.PI / 180, sx = x + s * W * .5, sy = ty + .25 * r, L = 1.05 * r; return [sx, sy, sx + Math.cos(rad) * L, sy + Math.sin(rad) * L]; };
  const [l1, l2, l3, l4] = el(kolSol, -1), [r1, r2, r3, r4] = el(kolSag, 1);
  let o = `<ellipse cx="${x}" cy="${y + 6}" rx="${r * 1.1}" ry="${r * .18}" fill="#000" opacity=".2"/>`;
  o += R(x - W * .62, ty + .05 * r, W * 1.24, 1.25 * r, .3 * r, '#AEB6C4');
  o += `<path d="M${l1} ${l2} L${l3} ${l4}" stroke="${KOY}" stroke-width="${.46 * r}" stroke-linecap="round"/><path d="M${l1} ${l2} L${l3} ${l4}" stroke="${renk}" stroke-width="${.36 * r}" stroke-linecap="round"/><circle cx="${l3}" cy="${l4}" r="${.24 * r}" fill="${serit}"/>`;
  o += `<path d="M${r1} ${r2} L${r3} ${r4}" stroke="${KOY}" stroke-width="${.46 * r}" stroke-linecap="round"/><path d="M${r1} ${r2} L${r3} ${r4}" stroke="${renk}" stroke-width="${.36 * r}" stroke-linecap="round"/><circle cx="${r3}" cy="${r4}" r="${.24 * r}" fill="${serit}"/>`;
  [-1, 1].forEach(k => { o += R(x + k * .42 * r - .3 * r, y - 1.0 * r, .6 * r, .95 * r, .25 * r, renk) + R(x + k * .42 * r - .36 * r, y - .28 * r, .72 * r, .3 * r, .14 * r, '#5A607E'); });
  o += R(x - W / 2, ty, W, 1.45 * r, .5 * r, renk) + R(x + W / 2 - .3 * r, ty + .1 * r, .22 * r, 1.25 * r, .1 * r, KOY, .6) + R(x - .42 * r, ty + .35 * r, .84 * r, .5 * r, .1 * r, '#3A4466') + `<circle cx="${x - .2 * r}" cy="${ty + .6 * r}" r="${.08 * r}" fill="${serit}"/><circle cx="${x + .05 * r}" cy="${ty + .6 * r}" r="${.08 * r}" fill="#7CFFB2"/><circle cx="${x + .28 * r}" cy="${ty + .6 * r}" r="${.08 * r}" fill="#FFE45C"/>` + R(x - W / 2, ty + 1.05 * r, W, .14 * r, .07 * r, serit);
  o += R(x - .55 * r, cy + .78 * r, 1.1 * r, .32 * r, .14 * r, KOY);
  const cid = 'ak' + kim + Math.round(x) + Math.round(y);
  o += `<defs><clipPath id="${cid}"><circle cx="${x}" cy="${cy}" r="${r * .96}"/></clipPath></defs><circle cx="${x}" cy="${cy}" r="${r}" fill="#1B2A55" opacity=".55"/>`;
  const mb = r * (kim === 'gubi' ? 1.45 : 1.15);
  o += `<g clip-path="url(#${cid})">` + M.canli(kim, { t, x, y: cy + (kim === 'gubi' ? 0 : mb * .52), boy: mb, duygu, bakHedef, parla: 0, eller: false, tepkiler: tepkiler ? TP[kim] : [] }) + '</g>';
  o += `<circle cx="${x}" cy="${cy}" r="${r}" fill="#BFE8FF" opacity=".12"/><circle cx="${x}" cy="${cy}" r="${r}" fill="none" stroke="#E8F6FF" stroke-width="${r * .07}" opacity=".85"/><path d="M${x - r * .62} ${cy - r * .45} A${r * .78} ${r * .78} 0 0 1 ${x - r * .05} ${cy - r * .8}" stroke="#FFFFFF" stroke-width="${r * .08}" fill="none" opacity=".8" stroke-linecap="round"/>`;
  return { svg: o, sol: [l3, l4], sag: [r3, r4] };
}
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
