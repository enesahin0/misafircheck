"""Maskot demo v2 — el hareketleri, yol, kameraya yaklaşma; imza sesleri tepki.json'dan."""
import sys, json
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '..')
from ses_lib import *
DUR = 18.6
M = Mix(DUR)
T_ = json.load(open('tepki.json'))
for kim in ('gubi', 'gufi'):
    for at, tp in T_[kim]: M.add('sfx', maskot_ses(kim, tp), at, .5)
for kim, at in T_['yaklas']: M.add('sfx', maskot_ses(kim, 'yaklas'), at, .45); M.add('sfx', whoosh(.6, 400, 2500, .5), at, .2); M.add('sfx', whoosh(.5, 2500, 400, .5), at + 2.6, .15)
for i in range(4): M.add('sfx', maskot_ses('gufi', 'zipla') * .5, .1 + i * .35, .3)       # sahneye zıplayarak giriş
M.add('sfx', maskot_ses('gubi', 'yaklas'), .4, .3)
M.add('sfx', pop(700, .16), 3.1, .3); M.add('sfx', boom(.8, 70) * .6, 11.2, .4)
for a in range(0, 18, 4):
    M.add('music', filt(pad([hz(n, 3) for n in ('G', 'B', 'D')], 4.6, .3) * adsr(int(4.6 * SR), .8, 1.2), 'lowpass', 1300), a, .2)
    for j in range(8): M.add('music', pluck(hz(['G', 'B', 'D', 'B'][j % 4], 4), .5, .5) * .4, a + j * .5, .12)
mus = M.bus['music']; sfx = M.bus['sfx']
full = mus / (np.abs(mus).max() + 1e-9) * .14 + sfx / (np.abs(sfx).max() + 1e-9) * .8
wavfile.write('miks.wav', SR, (np.clip(np.stack([full, full], 1), -1, 1) * 32767).astype(np.int16))
print('ok')
