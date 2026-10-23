"""#29 Güvercin — oyuncu doğa belgeseli teması (Sol majör), adım tıkırtıları, deklanşör, kanat/guguk, tren ritmi, ding, maskot sesleri."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 97.31
M = Mix(LS + 5.6)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
# 108 bpm oyuncu "doğa belgeseli" teması: Sol majör pluck + staccato bas; ağır çekimde yavaşlayan pad
B = 60 / 108
MOT = [('G', 5), ('B', 5), ('D', 6), ('B', 5), ('C', 6), ('A', 5), ('F#', 5), ('A', 5)]
def bolum(a, b, g=1.0, mot=MOT, bas='G', tik=True):
    t = a; k = 0
    while t < b - .05:
        if k % 4 == 0: M.add('music', soft_kick(.3), t, .24 * g); M.add('music', pluck(hz(bas, 2), B * 1.6, .45), t, .3 * g)
        if tik and k % 2 == 1: M.add('music', tick(5200, .02), t, .045 * g)
        n, o = mot[k % len(mot)]; M.add('music', pluck(hz(n, o), .4, .55), t, .14 * g)
        t += B / 2; k += 1
def pd(fs, a, d, g=.25): M.add('music', filt(pad(fs, d, .5), 'lowpass', 1400) * adsr(int(d * SR), .8, 1.0), a, g)
bolum(0, 6.97, .9)
pd([hz('G', 3), hz('D', 4), hz('B', 4)], 6.97, 10.6, .28)
bolum(17.54, 42.55, .85)
bolum(42.55, 68.65, 1.0, mot=[('G', 5), ('A', 5), ('B', 5), ('D', 6), ('E', 6), ('D', 6), ('B', 5), ('A', 5)])
pd([hz('E', 3), hz('B', 3), hz('G', 4)], 68.65, 5.3, .24)
bolum(73.96, 98.0, 1.05)
for k, n in enumerate(['G', 'B', 'D', 'G']): M.add('music', pluck(hz(n, 5 + (k // 3)), 1.6, .6), 96.0 + k * .2, .26)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('G', 'B', 'D')]), .4), 98.0, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def kanat(): return filt(noise(.35), 'bandpass', [400, 2500]) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 14 * T(.35)))) * adsr(int(.35 * SR), .02, .3) * .5
def gu(): tt = T(.6); return np.sin(2 * np.pi * (300 + 40 * np.sin(2 * np.pi * 5 * tt)) * tt) * adsr(int(.6 * SR), .05, .4) * .35   # "gugu"
def deklansor(): return ek(hit(.05, 3000) * .6, tick(2000, .03), hit(.06, 1500) * .4)
def ding(): return ek(bell(1568, .5, .8) * .5, bell(2093, .4, .8) * .3)
def damga(): return ek(boom(.3, 90) * .6, hit(.1, 900) * .5)
# S1
for i in range(12): S(tick(1100 + (i % 2) * 200, .025), .2 + i * .55, .12)
S(gu(), .5, .25); S(damga(), 1.7, .45); S(pop(800, .14), 3.0, .2)
# S2 ağır çekim
S(whoosh(1.0, 2400, 200, .3), 6.97, .2); S(ek(pop(500, .2), tick(900, .05)), 8.5, .25); S(swish(.25), 11.84, .3); S(pop(900, .14), 12.2, .2); S(ek(pop(500, .2), tick(900, .05)), 16.1, .2)
# S3
S(pop(600, .18), 17.6, .25); S(ek(hit(.08, 1800), tick(1200, .04)), 19.4, .3); S(rumble(12.0) * .12, 19.5, .2)
S(pop(760, .14), 24.55, .2); S(ding(), 27.1, .3)
# S4
S(pop(900, .12), 31.9, .2); S(pop(1000, .12), 32.0, .2); S(whoosh(1.0, 300, 1500, .4), 33.9, .2); S(ek(pop(800, .14), bell(1318, .4, .8) * .3), 34.7, .25)
S(pop(700, .14), 37.7, .2); S(swish(.3), 38.9, .25); S(whoosh(1.4, 1600, 400), 40.6, .25)
# S5 deklanşörler
for k in range(10): S(deklansor(), 42.55 + k * .9, .3)
S(ek(pop(800, .14), ding() * .4), 45.95, .25)
# S6 paralaks atılışları
for k in range(7): S(swish(.25), 51.34 + k * 1.2 + .66, .18)
S(ek(pop(700, .14), bell(1318, .4, .8) * .3), 57.34, .25)
# S7 tren
S(ek(rumble(9.0) * .5, filt(noise(9.0), 'lowpass', 400) * .3), 59.38, .25)
for k in range(9): S(ek(tick(700, .04), tick(600, .04)), 59.6 + k * 1.0, .15)
S(pop(800, .14), 65.4, .2)
# S8 UV
S(ek(whoosh(.9, 300, 3000, .4), bell(2637, .6, .8) * .3), 71.2, .3)
# S9 galeri
S(ek(tick(1800, .03), tick(1600, .03)), 75.6, .3); S(ding(), 76.2, .35)
# S10 laboratuvar
for k in range(6): S(tick(2000, .03), 78.4 + k * .55, .18)
S(ding(), 81.5, .3); S(whoosh(.5, 600, 1800), 83.4, .2)
for k in range(8): S(tick(2200 + (k % 4) * 100, .03), 83.8 + k * .3, .14)
S(ek(ding(), pop(900, .14)), 84.8, .35)
# S11
S(kanat(), 87.2, .3); S(gu(), 88.5, .3); S(ek(pop(400, .2), hit(.08, 1200) * .4), 91.6, .3); S(pop(800, .14), 93.6, .22); S(ek(pop(900, .14), bell(1568, .5, .8) * .4), 96.0, .3)
S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 98.2, .3)
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
