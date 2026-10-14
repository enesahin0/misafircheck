"""#34 İstanbul sel (14 Ekim 2026) — neden oldu: hava kütleleri, yağış kıyası, bilanço, şehir neden doldu, güvenlik. Ton ciddi; takip kartı YOK."""
import json, sys
sys.path.insert(0, '../../../marka')
from tepki_kontrol import kontrol
SB = [0, 8.6, 20.7, 29.3, 38.6, 52.6, 63.2, 65.6]
ALT = {}
TEP = {
    1: [('gubi', 5.0, 'say')],
    2: [('gufi', 2.6, 'gozle')],
    3: [('gufi', 6.0, 'sok')],
    4: [('gubi', 2.0, 'endise')],
    5: [('gufi', .4, 'dusun')],
    6: [('gufi', 2.0, 'dur'), ('gubi', 8.1, 'isaret')],
}
kontrol(TEP, SB)
ORTAK = r"""
const R = PR.R, h = HK.hash, C = AU.C;
const kam = (s, { x = 540, y = 900, k = 1, dx = 0, dy = 0 } = {}) => `<g transform="translate(${dx} ${dy}) translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${s}</g>`;
const bam = (t, a, d = .35) => { const q = A(t, a, a + d); return q > 0 && q < 1 ? `<rect width="1080" height="1920" fill="#FFFFFF" opacity="${.35 * (1 - q)}"/>` : ''; };
const semsiye = (x, y, s = 1, renk = '#3E8EDE') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-110 0 Q-110 -110 0 -110 Q110 -110 110 0 Q82 -22 55 0 Q27 -22 0 0 Q-27 -22 -55 0 Q-82 -22 -110 0Z" fill="${renk}"/><path d="M0 -110 Q-30 -60 -55 0 M0 -110 Q30 -60 55 0" stroke="#000" stroke-width="3" opacity=".15" fill="none"/><path d="M0 0 V110 Q0 130 -18 128" stroke="#2A2E40" stroke-width="7" fill="none"/></g>`;
const zeminK = () => AU.zemin('#1E2A44', '#0E1426');
"""
exec(open('_head.py').read())
exec(open('_sahneler.py').read())
exec(open('_tail.py').read())
