"""#28 Altın — hazine/merak teması (Re dorian pluck + pad), kilonova, göktaşları, külçe/sikke tıkırtıları, simya patlaması, CERN, maskot sesleri."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 109.32
M = Mix(LS + 5.8)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
# 96 bpm "hazine/merak" teması: Re dorian pluck + pad; bölümlere göre renk
B = 60 / 96
MOT = [('D', 5), ('F', 5), ('A', 5), ('C', 6), ('B', 5), ('A', 5), ('F', 5), ('E', 5)]
def bolum(a, b, g=1.0, mot=MOT, bas='D', tik=True):
    t = a; k = 0
    while t < b - .05:
        if k % 4 == 0: M.add('music', soft_kick(.3), t, .26 * g); M.add('music', pluck(hz(bas, 2), B * 1.8, .45), t, .3 * g)
        if tik and k % 2 == 1: M.add('music', tick(5200, .02), t, .045 * g)
        n, o = mot[k % len(mot)]; M.add('music', pluck(hz(n, o), .45, .55), t, .14 * g)
        t += B / 2; k += 1
def pd(fs, a, d, g=.25): M.add('music', filt(pad(fs, d, .5), 'lowpass', 1400) * adsr(int(d * SR), .8, 1.0), a, g)
pd([hz('D', 3), hz('A', 3), hz('F', 4)], 0, 2.96, .22)
pd([hz('D', 2), hz('A', 2), hz('E', 3)], 2.96, 15.24, .3)
bolum(12.84, 29.64, .85)
bolum(29.64, 52.23, .9, mot=[('D', 5), ('E', 5), ('F', 5), ('A', 5), ('G#', 5), ('A', 5), ('F', 5), ('E', 5)])
bolum(52.23, 64.43, .95)
bolum(64.43, 85.93, 1.0, mot=[('D', 5), ('F#', 5), ('A', 5), ('D', 6), ('C#', 6), ('A', 5), ('F#', 5), ('E', 5)], bas='D')
pd([hz('D', 2), hz('A', 2), hz('F', 3)], 85.93, 11.9, .26)
bolum(85.93, 97.81, .6, tik=False)
bolum(97.81, 110.2, 1.0, mot=[('D', 5), ('F#', 5), ('A', 5), ('D', 6), ('A', 5), ('F#', 5), ('E', 5), ('F#', 5)])
for k, n in enumerate(['D', 'F#', 'A', 'D']): M.add('music', pluck(hz(n, 5 + (k // 3)), 1.6, .6), 108.0 + k * .2, .26)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('D', 'F#', 'A')]), .4), 110.2, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def klink(f=2600): return ek(bell(f, .25, .9) * .5, tick(4000, .02) * .4)
def isilti(): return ek(*[bell(2200 + 300 * i, .5, .9) * (.5 - .08 * i) for i in range(4)])
def ooh(d=1.0): tt = T(d); return filt(noise(d), 'bandpass', [350, 1400]) * np.sin(np.pi * tt / d) ** 2 * .5
def alkis(d=1.5): return filt(noise(d), 'bandpass', [1500, 6000]) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 9 * T(d)))) * adsr(int(d * SR), .05, .6) * .5
# S1 yüzük
S(isilti(), .3, .25); S(riser_hedefli(1.9, 2.96, 300, 4000), 1.9, .2); S(whoosh(.6, 400, 2400, .5), 2.5, .25)
# S2 uzay: yörünge sesi + çarpışma
S(riser_hedefli(2.96, 7.36, 80, 1500), 2.96, .16); S(ek(boom(1.2, 45) * .9, shatter(.8) * .4, rumble(1.6) * .5), 7.36, .55); S(isilti(), 8.0, .2)
S(pop(800, .14), 9.2, .22)
for i in range(6): S(klink(2800 + 120 * i), 8.6 + i * .5, .08)
# S3 göktaşları
for i in range(10): S(whoosh(.35, 1400, 300), 13.0 + i * .5, .08)
for i in range(4): S(klink(2400), 14.04 + i * .9, .2)
S(ek(boom(.4, 60) * .5, rumble(.8) * .4), 16.6, .25)
# S4 kazı, paslanma, tel
for i in range(8): S(scrape(.15, 900), 18.4 + i * .3, .07)
S(isilti(), 20.3, .2)
for i in range(16): S(tick(1800, .03), 22.3 + i * .18, .08)
S(isilti(), 23.8, .2); S(whoosh(1.2, 300, 1600, .4), 26.3, .15); S(pop(700, .14), 27.6, .15); S(pop(800, .14), 28.5, .15)
# S5 Mısır
S(whoosh(.5, 300, 900), 29.7, .15); S(ek(boom(.5, 70) * .4, isilti()), 30.95, .25); S(ek(hit(.12, 2000), whoosh(.3, 700, 2000)), 32.26, .25)
for i in range(10): S(tick(2400, .03), 32.4 + i * .12, .08)
S(ek(pop(900, .14), bell(1046, .4, .8) * .4), 33.7, .25)
# S6 Lidya
S(klink(2200), 35.5, .3); S(klink(2600), 36.2, .25); S(ek(hit(.12, 2000), whoosh(.3, 700, 2000)), 36.36, .25); S(isilti(), 37.0, .2)
S(ek(bell(1568, .6, .8) * .4, whoosh(.5, 500, 1800)), 39.06, .25)
for i, at in enumerate([40.56, 41.26, 41.96, 42.76]): S(ek(isilti() * .7, pop(1200 + 100 * i, .1)), at, .22)
S(alkis(.9) * .5, 43.3, .12)
# S7 simya
for i in range(12): S(pop(300 + (i % 3) * 60, .12), 45.0 + i * .25, .07)
S(ek(pop(400, .14), boom(.3, 120) * .4), 45.9, .25); S(ek(boom(.8, 55) * .9, shatter(.5) * .5, noise_burst := filt(noise(.6), 'lowpass', 1500) * adsr(int(.6 * SR), .01, .3) * .6), 48.13, .55)
S(ooh(1.0), 48.6, .15); S(pop(300, .2), 49.85, .25)
S(kagit := filt(noise(.35), 'bandpass', [2500, 7500]) * adsr(int(.35 * SR), .02, .2) * .35, 50.45, .3); S(ek(hit(.12, 2000), whoosh(.3, 700, 2000)), 50.45, .2)
# S8 kervan + Kahire
for i in range(36): S(steps(.12, f=500) if True else 0, 52.4 + i * .2, .06)
for i in range(8): S(bell(1700 + (i % 2) * 200, .3, .9) * .4, 52.6 + i * .9, .1)
S(ek(pop(800, .14), isilti() * .6), 55.25, .25); S(whoosh(.4, 2000, 600), 59.8, .2)
for i in range(14): S(klink(2200 + (i % 5) * 200), 60.0 + i * .28, .1)
S(ek(whoosh(.8, 1400, 300), pop(400, .2)), 62.2, .2)
# S9 küp
S(ek(rumble(1.4) * .4, whoosh(1.2, 200, 1200)), 65.0, .2); S(ek(boom(.5, 70) * .5, klink(1800)), 66.8, .3); S(isilti(), 67.0, .2)
S(whoosh(1.6, 1800, 300, .5), 71.0, .25); S(ek(boom(.9, 45) * .9, rumble(1.2) * .5), 71.9, .45); S(ooh(1.3), 72.2, .2)
S(ek(pop(760, .14), bell(1318, .4, .8) * .3), 71.43, .22); S(whoosh(.8, 400, 2200, .5), 74.0, .2); S(ek(pop(900, .14), isilti() * .6), 76.2, .25); S(pop(700, .14), 77.2, .2)
# S10 yastık
S(swish(.4), 79.45, .25); S(isilti(), 79.95, .3)
for i in range(7): S(klink(2400 + i * 80), 79.95 + i * .08, .12)
S(ek(pop(800, .14), bell(1046, .4, .8) * .3), 80.65, .25); S(whoosh(.4, 2000, 600), 83.0, .15); S(ek(boom(.4, 70) * .4, klink(1800)), 83.2, .25)
# S11 CERN
S(ek(pad([hz('D', 3), hz('A', 3)], 3.6, .3) * .3, riser_hedefli(0, 3.6, 200, 3000) * .6), 85.93, .2)
S(ek(boom(.6, 60) * .7, shatter(.4) * .4, hit(.2, 2400) * .5), 89.53, .5); S(isilti(), 89.8, .25); S(pop(800, .14), 88.05, .2); S(pop(700, .14), 92.95, .22)
S(ek(pop(1600, .06), tick(4000, .02)), 95.35, .3); S(ooh(.8), 95.7, .12)
# S12 kartlar
S(pop(700, .14), 98.1, .2)
for at in (100.61, 101.51, 103.71): S(ek(swish(.25), pop(900, .14), isilti() * .5), at, .28)
# S13 kapanış
S(swish(.4), 106.2, .22); S(ek(pop(900, .14), bell(1568, .5, .8) * .4), 107.95, .3); S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 110.4, .3)
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
