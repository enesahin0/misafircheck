"""#31 Hayvanları Koruma Günü — gergin La minör (güvenlik) / sıcak Fa majör (vicdan) / nötr (yasa) / çözülme Do majör; BAM kesmeleri derin davul + sessizlik."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 59.56
M = Mix(LS + 2.9)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
B = 60 / 92
def pd(fs, a, d, g=.25, lp=1200): M.add('music', filt(pad(fs, d, .5), 'lowpass', lp) * adsr(int(d * SR), .8, 1.0), a, g)
def nabiz(a, b, notalar, g=.9):
    t = a; k = 0
    while t < b - .05:
        if k % 4 == 0: M.add('music', soft_kick(.3), t, .16 * g)
        n, o = notalar[k % len(notalar)]; M.add('music', pluck(hz(n, o), .6, .45), t, .09 * g)
        t += B / 2; k += 1
pd([hz('D', 2), hz('A', 2), hz('F', 3)], 0, 10.6, .3, 900)
nabiz(10.6, 49.6, [('D', 5), ('F', 5), ('A', 5), ('F', 5), ('C', 5), ('E', 5), ('A', 5), ('E', 5)])
pd([hz('F', 2), hz('C', 3), hz('A', 3)], 49.6, 7.0, .3)
nabiz(56.6, 60.0, [('F', 5), ('A', 5), ('C', 6), ('A', 5)], 1.0)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('F', 'A', 'C')]), .4), 60.0, .4)
yag = filt(noise(LS + 2.5), 'bandpass', [800, 6000]) * .5
env = np.ones(len(yag)); env[:int(1.0 * SR)] = np.linspace(0, 1, int(1.0 * SR)); env[-int(2 * SR):] = np.linspace(1, 0, int(2 * SR))
M.add('music', yag * env, 0, .2)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def ding(): return ek(bell(988, .6, .8) * .5, bell(1318, .5, .8) * .25)
def uyari(): return ek(bell(880, .25, .9) * .5, bell(880, .25, .9) * .4)
def gok(): return ek(rumble(2.2) * .8, boom(1.0, 45) * .6)
S(gok(), .05, .45); S(filt(noise(10.5), 'lowpass', 600) * .4, 0, .2)
for i, a in enumerate((2.5, 3.4, 4.2)): S(pop(700 + i * 100, .14), a, .25)
S(uyari(), 8.2, .35)
S(pop(800, .14), 10.8, .22); S(uyari(), 11.9, .3); S(pop(900, .14), 13.2, .2); S(swish(.3), 13.6, .2)
S(whoosh(.6, 1500, 300), 16.5, .25); S(ek(boom(.5, 60) * .7, hit(.1, 500)), 18.9, .45)
S(pop(800, .14), 21.1, .2); S(ek(hit(.05, 3000), tick(2500, .03)) * .6, 23.2, .3); S(pop(900, .14), 24.0, .2)
S(pop(800, .14), 25.6, .22); S(uyari(), 26.7, .3); S(swish(.3), 28.4, .2); S(ek(boom(.4, 70) * .6, hit(.1, 400)), 33.2, .4)
S(ding(), 34.9, .25); S(uyari(), 37.5, .3)
S(pop(800, .14), 39.9, .22); S(whoosh(.8, 600, 1500), 40.9, .25); S(filt(noise(1.5), 'lowpass', 500) * .5, 42.6, .3)
S(pop(800, .14), 45.3, .2)
for a in (47.27, 48.25, 49.05): S(ek(pop(900, .14), tick(1500, .04)), a, .32)
S(ek(boom(.4, 70) * .5, uyari()), 51.0, .4)
S(ek(pop(800, .14), ding() * .6), 52.0, .3); S(pop(900, .14), 54.0, .22); S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 56.9, .3)
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
