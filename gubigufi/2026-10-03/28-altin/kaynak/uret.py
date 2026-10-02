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
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
