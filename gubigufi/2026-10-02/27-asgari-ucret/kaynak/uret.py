"""#27 Asgari ücret — dolar mı altın mı: sahne HTML'leri + plan.json + tepkiler.json. Grafik ağırlıklı; Gubi VEZNEDAR, Gufi VATANDAŞ."""
import json
SB = [0, 9.15, 21.58, 31.54, 40.15, 49.52, 58.36, 69.01, 79.42, 87.98, 95.0, 99.4]
ALT = {}
TEP = {
    1: [('gubi', 1.2, 'zipla'), ('gufi', 4.8, 'uzgun'), ('gubi', 6.8, 'dusun'), ('gufi', 7.0, 'isaret')],
    2: [('gubi', 1.0, 'aha'), ('gufi', 5.3, 'isaret'), ('gubi', 6.4, 'mutlu'), ('gufi', 9.6, 'zipla'), ('gubi', 9.8, 'isaret')],
    3: [('gubi', 2.3, 'isaret'), ('gufi', 2.5, 'sasir'), ('gubi', 6.0, 'dusun')],
    4: [('gufi', .6, 'mutlu'), ('gubi', 5.0, 'korku'), ('gufi', 6.5, 'sasir'), ('gubi', 7.2, 'omuzSilk')],
    5: [('gubi', 2.0, 'mutlu'), ('gufi', 6.1, 'uzgun')],
    6: [('gufi', .3, 'goster'), ('gubi', 6.7, 'zipla'), ('gufi', 6.9, 'sasir')],
    7: [('gubi', 1.6, 'alkis'), ('gufi', 2.7, 'sasir'), ('gufi', 7.6, 'aha')],
    8: [('gubi', .5, 'dusun'), ('gufi', 6.5, 'mutlu'), ('gubi', 8.2, 'omuzSilk')],
    9: [('gufi', 1.6, 'uzgun'), ('gubi', 4.9, 'isaret'), ('gufi', 5.2, 'sasir')],
    10: [('gubi', 2.2, 'isaret'), ('gufi', 3.0, 'dusun'), ('gubi', 5.1, 'selam'), ('gufi', 5.2, 'zipla')],
}
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C;
const VEZNEDAR = KO.giy('gubi', [['papyon', { renk: '#E8505B' }], 'gozluk']);
const VATANDAS = KO.giy('gufi', [['kasket', { renk: '#2A2E40', siper: '#1B1F2A' }]]);
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
