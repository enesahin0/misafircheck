"""#36 Azerbaycan'la aramızda ne oluyor — gergin La minör nabız (kriz) / sert vuruşlar (alıntılar, bomba) / Do majör umut (Gufi) → takip."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 59.77
M = Mix(LS + 2.95)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
B = 60 / 96
def pd(fs, a, d, g=.25, lp=1200): M.add('music', filt(pad(fs, d, .5), 'lowpass', lp) * adsr(int(d * SR), .8, 1.0), a, g)
def nabiz(a, b, notalar, g=.9, kick=True):
    t = a; k = 0
    while t < b - .05:
        if kick and k % 4 == 0: M.add('music', soft_kick(.3), t, .16 * g)
        n, o = notalar[k % len(notalar)]; M.add('music', pluck(hz(n, o), .6, .45), t, .09 * g)
        t += B / 2; k += 1
pd([hz('A', 2), hz('E', 3), hz('C', 3)], 0, 6.3, .3, 900)
nabiz(6.3, 33.15, [('A', 4), ('C', 5), ('E', 5), ('C', 5), ('G', 4), ('B', 4), ('E', 5), ('B', 4)], .85)
pd([hz('D', 2), hz('A', 2), hz('F', 3)], 33.15, 14.8, .32, 800)
nabiz(34.6, 47.95, [('D', 5), ('F', 5), ('A', 5), ('F', 5), ('E', 5), ('G', 5), ('A', 5), ('E', 5)], 1.0)
pd([hz('F', 2), hz('C', 3), hz('A', 3)], 47.95, 3.6, .26, 900)
pd([hz('C', 3), hz('E', 3), hz('G', 3)], 51.5, 5.6, .3, 1400)
nabiz(51.5, 60.2, [('C', 5), ('E', 5), ('G', 5), ('E', 5), ('F', 5), ('A', 5), ('C', 6), ('A', 5)], .9, kick=False)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('C', 'E', 'G')]), .4), 60.2, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def ding(): return ek(bell(988, .6, .8) * .5, bell(1318, .5, .8) * .25)
def uyari(): return ek(bell(880, .25, .9) * .5, bell(880, .25, .9) * .4)
def vur(): return ek(boom(.4, 70) * .6, hit(.1, 500))
def catla(): return ek(hit(.05, 3000), filt(noise(.35), 'highpass', 2000) * .6, tick(2500, .03))
S(boom(1.0, 45) * .6, .05, .4); S(pop(800, .14), .3, .22); S(pop(700, .14), 2.0, .25)
S(catla(), 4.3, .45); S(ek(boom(.6, 55) * .8, whoosh(.5, 400, 1600) * .4), 5.2, .45)
S(whoosh(.5, 1500, 300), 6.3, .2); S(swish(.3), 8.3, .25); S(tick(1800, .04), 11.1, .3); S(uyari(), 11.9, .3)
S(ek(hit(.12, 300), bell(220, .4, .9) * .3), 12.8, .45); S(vur(), 13.2, .4)
S(maskot_ses('gubi', 'yaklas'), 15.1, .3); S(pop(900, .14), 18.05, .25)
for a in (20.4, 21.0, 21.75): S(pop(800, .14), a, .22)
S(vur(), 22.6, .35); S(pop(700, .14), 22.75, .18)
for i in range(10): S(tick(2200, .03), 22.65 + i * .12, .2)
S(uyari(), 23.95, .3); S(pop(900, .14), 24.45, .2)
S(whoosh(.5, 1500, 300), 25.8, .2); S(pop(800, .14), 26.2, .2)
S(vur(), 28.7, .4); S(vur(), 29.9, .35); S(vur(), 30.3, .3); S(swish(.3), 31.75, .25)
S(ek(boom(1.0, 40) * .9, hit(.15, 300)), 33.55, .55); S(whoosh(.5, 600, 1500), 34.65, .22); S(pop(800, .14), 34.75, .22)
for i in range(14): S(tick(1500, .03), 36.15 + i * .115, .22)
S(ek(hit(.1, 400), boom(.3, 90) * .4), 37.65, .45); S(pop(800, .14), 39.15, .22)
for a in (40.05, 40.48, 40.91): S(ek(pop(900, .14), bell(1318, .3, .8) * .3), a, .3)
S(swish(.3), 41.75, .25); S(whoosh(.7, 400, 1400), 42.7, .22); S(pop(800, .14), 43.45, .22); S(pop(900, .14), 46.05, .22); S(pop(700, .14), 46.35, .18)
S(whoosh(.5, 1500, 300), 47.95, .2); S(ek(hit(.1, 400), boom(.3, 90) * .4), 49.15, .4); S(pop(800, .14), 50.35, .2)
S(maskot_ses('gufi', 'yaklas'), 51.5, .3); S(ek(pop(800, .14), ding() * .5), 53.2, .3); S(pop(900, .14), 55.0, .22); S(pop(900, .14), 55.3, .2)
S(whoosh(.5, 1500, 300), 57.1, .2); S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 57.4, .3)
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
