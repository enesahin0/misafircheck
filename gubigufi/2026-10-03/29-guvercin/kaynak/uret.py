"""#29 Güvercin — kafa sabitleme ve görme: sahne HTML'leri + plan.json + tepkiler.json. Deneyler animasyonla anlatılır (ağır çekim, koşu bandı grafiği, görüş konileri, paralaks, tren göz takibi)."""
import json
SB = [0, 6.97, 17.54, 31.29, 42.55, 51.34, 59.38, 68.65, 73.96, 78.0, 86.97, 98.0, 102.4]
ALT = {}
TEP = {
    1: [('gufi', .3, 'zipla'), ('gufi', 1.8, 'sasir'), ('gubi', 3.0, 'aha')],
    2: [('gufi', 4.9, 'sasir'), ('gubi', 9.2, 'aha')],
    3: [('gubi', .1, 'dusun'), ('gufi', 1.8, 'isaret'), ('gubi', 9.6, 'aha'), ('gufi', 9.8, 'zipla')],
    4: [('gufi', .7, 'isaret'), ('gubi', 8.3, 'kahkaha'), ('gufi', 9.4, 'sasir')],
    5: [('gufi', 1.0, 'mutlu'), ('gubi', 3.5, 'aha')],
    6: [('gufi', 1.2, 'sasir'), ('gufi', 6.1, 'aha')],
    7: [('gubi', 2.0, 'mutlu'), ('gufi', 6.1, 'sasir')],
    8: [('gufi', 2.6, 'sasir'), ('gubi', 3.0, 'aha')],
    9: [('gubi', 2.3, 'alkis'), ('gufi', 2.3, 'sasir')],
    10: [('gufi', 3.6, 'mutlu'), ('gubi', 7.4, 'alkis'), ('gufi', 7.6, 'zipla')],
    11: [('gufi', 4.7, 'korku'), ('gubi', 5.0, 'kahkaha'), ('gufi', 9.2, 'selam')],
}
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C;
const BILGE = KO.giy('gubi', ['gozluk']);
const KAMERACI = KO.giy('gubi', [['kasket', { renk: '#2A2E40', siper: '#1B1F2A' }]]);
const REHBER = KO.giy('gubi', [['papyon', { renk: '#E8505B' }], 'gozluk']);
const BILIMCI = KO.giy('gubi', ['gozluk', ['papyon', { renk: '#4A8AD8' }]]);
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
