"""#31 Dünya Hayvanları Koruma Günü — sokak köpekleri tartışması, iki tarafa eşit süre/sempati. Sahne HTML'leri + plan.json + tepkiler.json."""
import json, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 5.1, 13.1, 21.95, 32.8, 47.45, 53.2, 58.15, 65.2, 70.85, 74.4, 76.8]
ALT = {}
TEP = {
    2: [('gufi', .5, 'goster'), ('gubi', 3.4, 'dusun'), ('gufi', 6.3, 'kafaKasi')],
    3: [('gufi', 2.0, 'gozle'), ('gufi', 3.8, 'titre')],
    4: [('gubi', 1.8, 'ask'), ('gubi', 9.2, 'evet')],
    5: [('gufi', .6, 'dusun'), ('gubi', 7.0, 'gozKapa'), ('gufi', 11.8, 'say')],
    6: [('gufi', .6, 'evet'), ('gubi', 3.9, 'hayir')],
    7: [('gufi', 2.7, 'isaret'), ('gubi', 4.1, 'isaret')],
    8: [('gubi', 1.4, 'aha'), ('gufi', 6.3, 'kucakla'), ('gubi', 6.5, 'mutlu')],
    9: [('gufi', .4, 'kafaKasi'), ('gubi', 1.8, 'gel'), ('gufi', 3.0, 'sus')],
    10: [('gubi', .3, 'selam'), ('gufi', .5, 'selam')],
}
kontrol(TEP, SB)
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C, KC = KP.C;
const VELI = KO.giy('gufi', [['kasket', { renk: '#2A3A6A', siper: '#1B2440' }]]);
const GONULLU = KO.giy('gubi', [['bere', { renk: '#C2551E', tuy: '#FFE6B8' }]]);
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const klip = (s, x, y, w, hh) => { const i = 'kl' + Math.round(x) + '_' + Math.round(y) + '_' + Math.round(w); return `<defs><clipPath id="${i}"><rect x="${x}" y="${y}" width="${w}" height="${hh}"/></clipPath></defs><g clip-path="url(#${i})">${s}</g>`; };
const bam = (t, a, d = .35) => { const q = A(t, a, a + d); return q > 0 && q < 1 ? `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${.55 * (1 - q)}"/>` : ''; };
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
