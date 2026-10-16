"""#35 Sel anında ne yapmalısın — sokak / bodrum / araba; ilk kare olayın kendisi, sonda paylaşılabilir özet kart."""
import json, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 10.6, 25.4, 39.7, 49.6, 51.9, 56.6, 60.0, 62.4]
ALT = {}
TEP = {
    1: [('gufi', 8.0, 'sok')],
    2: [('gubi', 1.4, 'dur'), ('gufi', 6.2, 'gozle')],
    3: [('gufi', 1.3, 'kos'), ('gubi', 12.0, 'hayir')],
    4: [('gufi', 7.6, 'say')],
    6: [('gubi', .5, 'gel'), ('gufi', 2.3, 'kafaKasi')],
    7: [('gubi', .3, 'selam'), ('gufi', .5, 'selam')],
}
kontrol(TEP, SB)
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C;
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const bam = (t, a, d = .35) => { const q = A(t, a, a + d); return q > 0 && q < 1 ? `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${.35 * (1 - q)}"/>` : ''; };
const semsiye = (x, y, s = 1, renk = '#3E8EDE') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 0 Q-110 -110 0 -110 Q110 -110 110 0 Q82 -22 55 0 Q27 -22 0 0 Q-27 -22 -55 0 Q-82 -22 -110 0Z" fill="${renk}"/><path d="M0 0 V110 Q0 130 -18 128" stroke="#2A2E40" stroke-width="7" fill="none"/></g>`;
const zeminK = () => AU.zemin('#1E2A44', '#0E1426');
const baslik = (t, s, renk, t0 = 0) => grp(AU.cip(s, 0, 0, renk, '#FFFFFF', 40), 540, 400, pop(t, t0) * (1 - A(t, 1.6, 1.9)));
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
