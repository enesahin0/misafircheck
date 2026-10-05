"""#31 Hayvanları Koruma Günü — gergin La minör (güvenlik) / sıcak Fa majör (vicdan) / nötr (yasa) / çözülme Do majör; BAM kesmeleri derin davul + sessizlik."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 59.64
M = Mix(LS + 2.9)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
B = 60 / 104
def bolum(a, b, mot, bas, g=1.0, kick=True):
    t = a; k = 0
    while t < b - .05:
        if kick and k % 4 == 0: M.add('music', soft_kick(.3), t, .22 * g)
        if k % 4 == 0: M.add('music', pluck(hz(bas, 2), B * 1.8, .45), t, .3 * g)
        n, o = mot[k % len(mot)]; M.add('music', pluck(hz(n, o), .5, .55), t, .12 * g)
        t += B / 2; k += 1
def pd(fs, a, d, g=.25, lp=1400): M.add('music', filt(pad(fs, d, .5), 'lowpass', lp) * adsr(int(d * SR), .8, 1.0), a, g)
DUG = [('D', 5), ('F#', 5), ('A', 5), ('F#', 5), ('G', 5), ('B', 5), ('A', 5), ('F#', 5)]
MIN = [('B', 4), ('D', 5), ('F#', 5), ('D', 5), ('A', 4), ('C#', 5), ('E', 5), ('C#', 5)]
bolum(0, 13.3, DUG, 'D', .9)
pd([hz('B', 2), hz('F#', 3)], 13.3, 9.0, .3, 800)
for k in range(int(9.0 / B)): M.add('music', tick(900, .03), 13.3 + k * B, .06)
bolum(22.3, 42.5, DUG, 'D', .85)
bolum(42.5, 56.2, MIN, 'B', .8, kick=False)
bolum(56.2, 60.0, DUG, 'D', 1.0)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('D', 'F#', 'A')]), .4), 60.0, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def bam(): return ek(boom(.6, 55) * .9, hit(.12, 700) * .5)
def ding(): return ek(bell(1568, .5, .8) * .5, bell(2093, .4, .8) * .3)
def sing(): return ek(bell(3136, .25, .9) * .4, bell(4186, .2, .9) * .25)   # altın şıngırtısı
def damga(): return ek(boom(.3, 90) * .6, hit(.1, 900) * .5)
for k in range(5): S(sing(), 2.7 + k * .08, .25)
S(bam(), 2.68, .5); S(bam(), 4.45, .4); S(bam(), 8.76, .4)
S(pop(800, .14), 5.6, .2); S(pop(900, .14), 6.7, .2); S(pop(800, .14), 10.1, .2); S(pop(900, .14), 11.6, .2)
for k in range(4): S(sing(), 4.9 + 4.4 + k * .35, .2)
S(ek(hit(.1, 300), boom(.4, 60) * .7), 13.4, .5); S(ek(hit(.1, 300), boom(.4, 60) * .7), 20.95, .45)
for k in range(6): S(sing(), 18.1 + k * .35 + .5, .25)
S(damga(), 21.2, .45); S(pop(900, .14), 19.3, .2)
S(damga(), 22.57, .45); S(pop(700, .14), 23.87, .22); S(pop(800, .14), 26.24, .22); S(pop(900, .14), 28.08, .22); S(ding(), 29.45, .3)
S(pop(900, .14), 30.97, .2); S(ek(bell(1318, .5, .8) * .4, pop(700, .14)), 33.0, .25); S(pop(800, .14), 36.55, .22)
S(whoosh(.9, 600, 2000), 37.4, .25); S(ding(), 38.2, .3); S(sing(), 39.1, .3); S(whoosh(.9, 600, 2000), 39.5, .25); S(ding(), 40.5, .3)
S(whoosh(1.2, 500, 2200), 43.3, .25); S(pop(800, .14), 42.7, .2)
S(ek(tick(1800, .03), tick(1500, .03)), 47.0, .25); S(damga(), 49.15, .45)
S(pop(800, .14), 51.65, .22); S(pop(900, .14), 53.4, .22); S(pop(1000, .14), 54.25, .22); S(ek(pop(700, .14), bell(1318, .4, .8) * .3), 55.3, .25)
S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 56.5, .3)
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
