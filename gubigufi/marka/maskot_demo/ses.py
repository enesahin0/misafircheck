"""Maskot demo — imza sesleri (maskot_ses) + hafif pad. Tepki zamanları s01.html ile aynı."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '..')
from ses_lib import *
DUR = 19.2
M = Mix(DUR)
TG = [(7.5, 'sasir'), (9.4, 'aha'), (12.6, 'uzgun'), (14.3, 'kararli'), (16.3, 'selam'), (17.2, 'mutlu')]
TF = [(7.62, 'sasir'), (9.9, 'sasir'), (11.0, 'mutlu'), (12.6, 'korku'), (14.3, 'zipla'), (15.1, 'zipla'), (16.45, 'selam'), (17.3, 'mutlu')]
for at, tp in TG: M.add('sfx', maskot_ses('gubi', tp), at, .5)
for at, tp in TF: M.add('sfx', maskot_ses('gufi', tp), at + .03, .55)
M.add('sfx', maskot_ses('gubi', 'merak'), 2.5, .35); M.add('sfx', maskot_ses('gufi', 'merak'), 2.75, .4)   # birbirine bakınca
M.add('sfx', pop(900, .12), 7.4, .3)
for a in (0, 8):
    M.add('music', filt(pad([hz(n, 3) for n in ('E', 'G#', 'B', 'D#')], 11, .3) * adsr(int(11 * SR), 1.5, 2), 'lowpass', 1200), a, .25)
mus = M.bus['music']; sfx = M.bus['sfx']
full = mus / (np.abs(mus).max() + 1e-9) * .12 + sfx / (np.abs(sfx).max() + 1e-9) * .8
full = np.stack([full, full], 1)
wavfile.write('miks.wav', SR, (np.clip(full, -1, 1) * 32767).astype(np.int16))
print('miks.wav')
