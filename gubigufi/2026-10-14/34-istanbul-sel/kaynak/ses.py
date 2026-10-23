"""#31 Hayvanları Koruma Günü — gergin La minör (güvenlik) / sıcak Fa majör (vicdan) / nötr (yasa) / çözülme Do majör; BAM kesmeleri derin davul + sessizlik."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 62.85
M = Mix(LS + 2.9)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
B = 60 / 84
def pd(fs, a, d, g=.25, lp=1200): M.add('music', filt(pad(fs, d, .5), 'lowpass', lp) * adsr(int(d * SR), .8, 1.0), a, g)
def nabiz(a, b, notalar, g=.9):
    t = a; k = 0
    while t < b - .05:
        if k % 4 == 0: M.add('music', soft_kick(.3), t, .14 * g)
        n, o = notalar[k % len(notalar)]; M.add('music', pluck(hz(n, o), .7, .4), t, .08 * g)
        t += B; k += 1
pd([hz('D', 2), hz('A', 2), hz('F', 3)], 0, 20.7, .3, 900)
pd([hz('A#', 2), hz('F', 3), hz('D', 4)], 20.7, 17.9, .28, 1000)
pd([hz('G', 2), hz('D', 3), hz('A#', 3)], 38.6, 14.0, .28, 1000)
pd([hz('D', 2), hz('A', 2), hz('F', 3), hz('A', 3)], 52.6, 13.0, .3, 1100)
nabiz(8.6, 52.6, [('D', 5), ('F', 5), ('A', 5), ('F', 5)])
# yağmur yatağı
yag = filt(noise(LS + 2.5), 'bandpass', [800, 6000]) * .5
env = np.ones(len(yag)); env[:int(1.5 * SR)] = np.linspace(0, 1, int(1.5 * SR)); env[-int(2 * SR):] = np.linspace(1, 0, int(2 * SR))
M.add('music', yag * env, 0, .22)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def damla(): return ek(pop(1200, .08) * .6, tick(2600, .02))
def ding(): return ek(bell(988, .6, .8) * .5, bell(1318, .5, .8) * .25)
def gok(): return ek(rumble(2.2) * .8, boom(1.0, 45) * .6)
S(gok(), .1, .4); S(pop(800, .14), 1.7, .22)
for i in range(19): S(damla(), 4.8 + i * .16, .18)
S(ding(), 7.0, .25); S(pop(700, .14), 8.8, .2)
S(whoosh(2.0, 300, 1200, .3), 11.1, .25); S(whoosh(2.0, 1200, 300, .3), 13.5, .25); S(gok(), 15.6, .45)
S(whoosh(.5, 600, 1800), 16.9, .2); S(gok(), 19.2, .35)
for i in range(10): S(damla(), 21.3 + i * .3, .14)
for i in range(14): S(damla(), 25.6 + i * .22, .16)
S(ek(bell(659, .8, .8) * .5, pop(500, .14)), 28.3, .3)
for i in range(12): S(tick(1800, .02), 29.5 + i * .1, .12)
for i in range(12): S(tick(1600, .02), 32.8 + i * .1, .12)
S(tick(1400, .03), 34.8, .2); S(filt(noise(2.0), 'lowpass', 500) * adsr(int(2 * SR), .3, .6) * .6, 36.0, .3)
S(pop(700, .14), 38.8, .2); S(swish(.3), 47.0, .2); S(swish(.3), 49.9, .2)
S(ek(gok() * .5, pop(500, .14)), 52.9, .3); S(ding(), 54.5, .3); S(ding(), 58.0, .3); S(ding(), 60.6, .3)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .28)
ve = voice_env(voice)
duck = 1 - .6 * np.clip(ve * 2.2, 0, 1)
mus = filt(M.bus['music'] * duck, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-13)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 3.2
d = int(.012 * SR)
Lc = voice + sfx + mus; Rc = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
st = np.stack([Lc, Rc], 1); st = st / max(1.0, np.abs(st).max() / .95)
wavfile.write('miks.wav', SR, (st * 32767).astype(np.int16))
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
