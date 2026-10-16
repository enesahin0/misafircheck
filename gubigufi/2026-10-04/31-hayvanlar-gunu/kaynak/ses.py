"""#31 Hayvanları Koruma Günü — gergin La minör (güvenlik) / sıcak Fa majör (vicdan) / nötr (yasa) / çözülme Do majör; BAM kesmeleri derin davul + sessizlik."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 74.11
M = Mix(LS + 2.9)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
B = 60 / 92
def bolum(a, b, mot, bas, g=1.0, kick=True):
    t = a; k = 0
    while t < b - .05:
        if kick and k % 4 == 0: M.add('music', soft_kick(.3), t, .22 * g)
        if k % 4 == 0: M.add('music', pluck(hz(bas, 2), B * 1.8, .45), t, .3 * g)
        n, o = mot[k % len(mot)]; M.add('music', pluck(hz(n, o), .5, .5), t, .12 * g)
        t += B / 2; k += 1
def pd(fs, a, d, g=.25, lp=1400): M.add('music', filt(pad(fs, d, .5), 'lowpass', lp) * adsr(int(d * SR), .8, 1.0), a, g)
MIN = [('A', 4), ('C', 5), ('E', 5), ('C', 5), ('B', 4), ('E', 5), ('G#', 4), ('E', 5)]
MAJ = [('F', 4), ('A', 4), ('C', 5), ('A', 4), ('G', 4), ('C', 5), ('E', 5), ('C', 5)]
DO = [('C', 5), ('E', 5), ('G', 5), ('E', 5), ('D', 5), ('G', 5), ('B', 5), ('G', 5)]
pd([hz('A', 2), hz('E', 3)], 0, 5.1, .32, 700)
pd([hz('A', 3), hz('C', 4), hz('E', 4)], 5.1, 8.0, .22)
bolum(13.1, 21.95, MIN, 'A', .9)
bolum(21.95, 32.8, MAJ, 'F', .95)
pd([hz('D', 3), hz('A', 3), hz('F', 4)], 32.8, 14.65, .26, 1000)
for k in range(int(14.6 / B)): M.add('music', tick(1400, .03), 32.8 + k * B, .05)
pd([hz('A', 3), hz('E', 4)], 47.45, 2.8, .2); pd([hz('F', 3), hz('C', 4)], 50.25, 2.95, .2)
pd([hz('E', 3), hz('B', 3), hz('G', 4)], 53.2, 4.95, .22)
bolum(58.15, 70.85, DO, 'C', .9, kick=False)
bolum(70.85, 74.4, DO, 'C', 1.0)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('C', 'E', 'G')]), .4), 74.4, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def bam(): return ek(boom(.6, 55) * .9, hit(.12, 700) * .5)
def ding(): return ek(bell(1568, .5, .8) * .5, bell(2093, .4, .8) * .3)
def tak(): return ek(hit(.06, 1200) * .7, tick(500, .05) * .6)
def hav(): tt = T(.18); return np.sin(2 * np.pi * (380 - 500 * tt) * tt) * adsr(int(.18 * SR), .01, .5) * .5 + filt(noise(.18), 'bandpass', [500, 1800]) * adsr(int(.18 * SR), .01, .4) * .25
# S1
for a in (1.3, 3.2): S(bam(), a, .55)
S(hav(), 1.5, .2); S(ek(bell(1318, .5, .8) * .3, pop(900, .14)), 3.6, .2)
# S2
S(swish(.3), 5.4, .3); S(ek(boom(.3, 90) * .5, hit(.08, 900) * .4), 5.2, .35); S(whoosh(1.0, 1800, 300), 7.9, .25)
S(ek(hit(.1, 300), boom(.4, 60) * .6), 8.5, .4)
for k in range(8): S(tick(1500, .02), 11.0 + k * .25, .08)
# S3
S(pop(800, .14), 13.4, .2); S(pop(700, .14), 14.6, .22)
for a in (16.75, 18.1): S(bam(), a, .5)
S(hav(), 17.0, .18); S(hav(), 18.5, .18); S(hav(), 18.8, .15)
S(ek(bell(988, .6, .8) * .4, boom(.3, 80) * .4), 20.1, .35)
# S4
S(pop(900, .14), 22.2, .2); S(ek(pop(800, .14), bell(1568, .5, .8) * .3), 23.6, .25)
S(ek(tick(900, .04), hit(.05, 600) * .5), 24.82, .3)
for k in range(6): S(tick(1800 + (k % 2) * 300, .02), 24.9 + k * .16, .08)
S(bam(), 26.35, .4)
for k in range(4): S(tak(), 26.4 + k * .38, .35)
S(filt(noise(1.6), 'lowpass', 600) * adsr(int(1.6 * SR), .3, .5) * .3, 26.35, .25)
S(bam(), 27.95, .35); S(swish(.3), 29.4, .2); S(ek(ding(), pop(900, .14)), 30.95, .3)
# S5
S(ek(boom(.4, 70) * .8, hit(.1, 400) * .6), 33.1, .5)
for a in (35.65, 39.7, 44.4): S(ek(boom(.3, 90) * .6, hit(.08, 900) * .5), a, .45)
for k in range(4): S(tick(2000, .03), 44.8 + k * .4, .25)
S(ding(), 46.4, .3)
# S6-S7
S(bam(), 47.45, .45); S(bam(), 50.25, .45)
S(whoosh(4.5, 400, 1200, .3), 53.5, .2); S(pop(700, .14), 55.85, .22); S(pop(900, .14), 57.3, .22)
# S8
S(whoosh(.5, 600, 1800), 62.15, .22); S(whoosh(.5, 600, 1800), 63.65, .22); S(ek(ding(), bell(2637, .6, .8) * .3), 64.35, .35)
# S9-S10
S(pop(800, .14), 65.4, .25); S(pop(900, .14), 66.95, .22); S(ek(pop(700, .14), bell(1318, .4, .8) * .3), 68.1, .25)
S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 71.15, .3); S(hav(), 72.0, .15)
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
