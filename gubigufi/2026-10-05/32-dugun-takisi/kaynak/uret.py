"""#32 Düğünde takılan altın kimin? — Yargıtay 2024 içtihat değişikliği; iki taraf eşit, fark anı: aynı kurdelede bilezik → gelin, çeyrek → damat."""
import json, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 4.3, 13.3, 22.3, 30.8, 42.5, 45.6, 51.4, 56.2, 60.0, 62.4]
ALT = {}
TEP = {
    1: [('gufi', .5, 'alkis'), ('gubi', 2.9, 'kafaKasi')],
    2: [('gubi', 1.4, 'evet'), ('gufi', 5.8, 'hayir')],
    3: [('gufi', .4, 'dusun'), ('gubi', 8.0, 'omuzSilk')],
    4: [('gubi', 1.6, 'aha'), ('gufi', 7.3, 'evet')],
    5: [('gufi', 2.5, 'sasir'), ('gubi', 6.0, 'aha'), ('gufi', 8.7, 'gurur')],
    6: [('gubi', .4, 'gel')],
    7: [('gufi', 1.5, 'isaret'), ('gubi', 3.6, 'evet')],
    8: [('gufi', .4, 'kafaKasi'), ('gubi', 3.9, 'begen')],
    9: [('gubi', .3, 'selam'), ('gufi', .5, 'selam')],
}
kontrol(TEP, SB)
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C;
const GELIN_T = KO.giy('gubi', [['papyon', { renk: '#E86A9A' }]]);
const DAMAT_T = KO.giy('gufi', [['papyon', { renk: '#1B2440' }]]);
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const klip = (s, x, y, w, hh) => { const i = 'kl' + Math.round(x) + '_' + Math.round(w); return `<defs><clipPath id="${i}"><rect x="${x}" y="${y}" width="${w}" height="${hh}"/></clipPath></defs><g clip-path="url(#${i})">${s}</g>`; };
const bam = (t, a, d = .35) => { const q = A(t, a, a + d); return q > 0 && q < 1 ? `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${.5 * (1 - q)}"/>` : ''; };
const takipCip = (t, a) => { const p = pop(t, a) * (1 - A(t, a + 1.6, a + 1.9)); return p > 0 ? grp(AU.cip('+ TAKİP ET', 0, 0, '#FFFFFF', '#1B1640', 28), 820, 540, p) : ''; };
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
