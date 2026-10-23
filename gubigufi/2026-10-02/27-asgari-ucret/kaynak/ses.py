"""#27 Asgari ücret — meraklı ekonomi teması (Do majör pluck), külçe tıkırtıları, kasa sesi, silgi, yarış roketi, maskot sesleri."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 94.35
M = Mix(LS + 5.5)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
# 112 bpm meraklı ekonomi teması (Do majör pluck motifi + yumuşak bas + hafif tık)
B = 60 / 112
MOTIF = [('C', 5), ('E', 5), ('G', 5), ('E', 5), ('D', 5), ('F', 5), ('A', 5), ('F', 5), ('E', 5), ('G', 5), ('C', 6), ('G', 5), ('D', 5), ('G', 5), ('B', 4), ('G', 5)]
BAS = ['C', 'C', 'F', 'F', 'A', 'A', 'G', 'G']
def bolum(a, b, g=1.0, pz=True, bas=True, tik=True):
    t = a; k = 0
    while t < b - .05:
        if bas and k % 4 == 0: M.add('music', soft_kick(.3), t, .3 * g)
        if bas and k % 4 == 0: M.add('music', pluck(hz(BAS[(k // 4) % 8], 2), B * 1.6, .45), t, .32 * g)
        if tik and k % 2 == 1: M.add('music', tick(5200, .02), t, .05 * g)
        if pz: n, o = MOTIF[k % 16]; M.add('music', pluck(hz(n, o), .4, .55), t, .16 * g)
        t += B / 2; k += 1
bolum(0.0, 9.15, .9)
bolum(9.15, 31.54, .85)
bolum(31.54, 58.36, 1.0)
M.add('music', riser_hedefli(55.5, 58.36, 300, 4200), 55.5, .14)
bolum(58.36, 87.98, 1.1)
bolum(87.98, 95.0, .9, tik=False)
for k, n in enumerate(['C', 'E', 'G', 'C']): M.add('music', pluck(hz(n, 5 + (k // 3)), 1.6, .6), 93.0 + k * .2, .28)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('C', 'E', 'G')]), .4), 95.0, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def kaching(): return ek(bell(2093, .6, .8) * .5, bell(2637, .5, .8) * .4, tick(3000, .04))
def klink(f=2600): return ek(bell(f, .25, .9) * .5, tick(4000, .02) * .4)
def ooh(d=1.0): tt = T(d); return filt(noise(d), 'bandpass', [350, 1400]) * np.sin(np.pi * tt / d) ** 2 * .5
def alkis(d=1.5): return filt(noise(d), 'bandpass', [1500, 6000]) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 9 * T(d)))) * adsr(int(d * SR), .05, .6) * .5
def kagit(): return filt(noise(.35), 'bandpass', [2500, 7500]) * adsr(int(.35 * SR), .02, .2) * .35
# S1
for i in range(4): S(pop(500 + 120 * i, .12), .3 + i * .45, .22)
S(pop(900, .14), 2.0, .25); S(whoosh(.6, 1800, 300), 4.4, .2); S(pop(420, .18), 4.5, .25)
for i in range(6): S(klink(1800 - i * 120), 4.6 + i * .25, .12)
S(ek(pop(700, .16), bell(1319, .5, .8) * .4), 6.75, .3)
# S2
S(kagit(), 9.35, .3); S(ek(hit(.12, 2000), whoosh(.3, 700, 2000)), 11.75, .3)
S(pop(600, .14), 14.3, .25); S(pop(800, .14), 15.35, .25)
for i in range(6): S(pop(520 + 90 * i, .1), 17.45 + i * .12, .18)
S(swish(.3), 18.25, .25)
# S3
S(whoosh(.9, 300, 1200, .4), 21.7, .2); S(ek(pop(900, .12), bell(1760, .5, .8) * .4), 23.8, .3)
S(whoosh(.3, 2000, 600), 26.18, .2); S(ek(boom(.4, 90) * .6, hit(.12, 1200) * .4), 26.4, .35)
for i in range(11): S(pop(600 + 60 * i, .08), 26.5 + i * .18, .13)
# S4
for i in range(9): S(tick(1600, .03), 31.7 + i * .1, .1)
S(scrape(1.9, 500), 35.84, .25)
for i in range(6): S(ek(pop(300 + 20 * i, .14), hit(.06, 900) * .3), 36.44 + i * .22, .25)
for i in range(8): S(tick(2200, .03), 38.14 + i * .1, .1)
S(kaching(), 38.95, .3)
# S5
for i in range(17): S(klink(2400 + (i % 4) * 160), 40.65 + i * .18, .14)
for i in range(4): S(klink(2000 + i * 120), 44.65 + i * .37, .16)
S(ooh(1.0), 46.3, .15)
# S6
S(whoosh(.5, 500, 1800, .5), 49.82, .2); S(kaching(), 50.8, .3); S(whoosh(.4, 1500, 2500), 50.9, .12)
S(riser_hedefli(51.62, 52.6, 300, 1600), 51.62, .1); S(pop(700, .14), 52.6, .2)
S(riser_hedefli(54.52, 55.9, 300, 2600), 54.52, .14); S(ek(pop(900, .14), bell(1568, .4, .8) * .4), 55.95, .3); S(pop(760, .14), 56.52, .22)
# S7
S(ek(bell(2800, .25, .9), tick(3000, .03)), 58.5, .3)
for i in range(10): S(steps(.12) if 'steps' in globals() else tick(900, .03), 58.6 + i * .2, .08)
S(ek(whoosh(1.4, 200, 3000, .4), rumble(1.6) * .5), 60.82, .3); S(alkis(1.6), 61.6, .18); S(pop(800, .14), 61.56, .22)
S(whoosh(.8, 2000, 400), 65.66, .2); S(ek(pop(700, .16), bell(1319, .4, .8) * .3), 65.86, .28)
# S8
for i in range(6): S(tick(2600, .03), 69.4 + i * .12, .14)
S(swish(.5), 70.76, .25); S(ek(pop(800, .14), whoosh(.3, 900, 1800)), 75.25, .28); S(kaching(), 75.5, .22)
S(pop(560, .14), 77.0, .22); S(pop(480, .14), 77.2, .22); S(pop(900, .12), 77.81, .2)
# S9
for i in range(9): S(pop(500 + 70 * i, .09), 79.62 + i * .18, .15)
S(swish(.4), 84.22, .22); S(ek(pop(760, .14), ooh(1.0) * .5), 84.82, .28)
# S10
S(pop(700, .14), 88.18, .22)
for i, at in enumerate([90.18, 90.98, 91.78]): S(ek(pop(650 + 120 * i, .14), bell(1046 * (1 + i * .25), .3, .8) * .3), at, .28)
S(ek(pop(900, .14), bell(1568, .5, .8) * .4), 92.98, .3)
S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 95.2, .3)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .3)
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
