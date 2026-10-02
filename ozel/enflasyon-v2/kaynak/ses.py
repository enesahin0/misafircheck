"""Enflasyon 60 sn — 120 BPM trap/hibrit müzik + tasarım sesleri (seslendirme yok; müzik anlatıyı taşır). E minör."""
import sys, numpy as np
from scipy.io import wavfile
sys.path.insert(0, '/home/user/misafircheck/gubigufi/marka')
from ses_lib import *
L = 61.0
M = Mix(L)
B = .5
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
def kick808(f=48, d=.9): tt = T(d); fr = f + 140 * np.exp(-tt * 28); ph = 2 * np.pi * np.cumsum(fr) / SR; return np.tanh(2.2 * np.sin(ph) * np.exp(-tt * 3.2)) * .9
def bas808(f, d): tt = T(d); fr = f * (1 + .25 * np.exp(-tt * 30)); ph = 2 * np.pi * np.cumsum(fr) / SR; return np.tanh(1.8 * np.sin(ph)) * adsr(int(d * SR), .005, .85) * .7
def clap(d=.25): x = filt(noise(d), 'bandpass', [900, 4500]); e = np.zeros(int(d * SR)); 
def clp(d=.28):
    x = filt(noise(d), 'bandpass', [900, 4800]); tt = T(d); e = (np.exp(-tt * 30) + .6 * np.exp(-np.maximum(tt - .012, 0) * 30) * (tt > .012) + .4 * np.exp(-np.maximum(tt - .024, 0) * 22) * (tt > .024)); return x * e * .8
def hat(d=.05, ac=False): tt = T(d); return filt(noise(d), 'highpass', 7500) * np.exp(-tt * (25 if ac else 70)) * .5
def siren(d, f0=600, f1=1400, hz_=2.2): tt = T(d); fr = f0 + (f1 - f0) * (.5 + .5 * np.sin(2 * np.pi * hz_ * tt)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * adsr(int(d * SR), .1, .8) * .3
def kasa(): return ek(bell(2093, .5, .9) * .5, bell(2637, .45, .9) * .4, hit(.05, 3000) * .5)
def impact(g=1.0): return ek(boom(1.4, 38) * 1.0, kick808(40, 1.2) * .7, shatter(.6) * .25, filt(noise(1.2), 'lowpass', 900) * np.exp(-T(1.2) * 3) * .5) * g
def damla(f): tt = T(.18); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-tt * 40))) / SR) * np.exp(-tt * 18) * .5
def ters_zil(d=1.2): x = filt(noise(d), 'highpass', 5000) * np.linspace(0, 1, int(d * SR)) ** 3; return x * .6
def stutter(x, n=8, d=.0625):
    seg = x[:int(d * SR)]; return np.concatenate([seg * (1 - i / (n + 2)) for i in range(n)])
AKOR = ['E', 'C', 'D', 'B']   # i - VI - VII - V
def groove(a, b, g=1.0, bas=True, roll=True, yogun=1):
    t = a; k = 0
    while t < b - .01:
        adim = k % 16  # 16'lık değil: 8'lik adımlar (0.25 sn)
        if adim in (0, 6, 10) or (yogun > 1 and adim == 13): M.add('sfx', kick808(), t, .55 * g)
        if adim in (4, 12): M.add('sfx', clp(), t, .38 * g)
        M.add('sfx', hat(.05, adim % 4 == 2), t, .16 * g)
        if roll and adim == 15: [M.add('sfx', hat(.03), t + i * .0625, .12 * g) for i in range(4)]
        if bas and adim % 8 == 0: n = AKOR[(k // 8) % 4]; M.add('music', bas808(hz(n, 1) * (2 if n in 'BCD' else 1), 1.9), t, .5 * g)
        t += .25; k += 1
def pad_(a, d, notalar, g=.22): M.add('music', filt(pad([hz(n, o) for n, o in notalar], d, .5), 'lowpass', 1600) * adsr(int(d * SR), .6, 1.0), a, g)
def lead(a, b, g=.13):
    mot = [('E', 5), ('G', 5), ('B', 5), ('G', 5), ('F#', 5), ('E', 5), ('D', 5), ('B', 4)]; t = a; k = 0
    while t < b - .01: n, o = mot[k % 8]; M.add('music', pluck(hz(n, o), .3, .6), t, g); t += .5; k += 1
# ---- A 0–4 intro ----
pad_(0, 4, [('E', 2), ('B', 2), ('G', 3)], .3)
for i in range(4): M.add('sfx', kick808(42, .6) * .7, i * 1.0, .35)    # kalp atışı
M.add('music', riser_hedefli(0, 4, 120, 3000), 0, .14)
for at in (1.0, 2.0): M.add('sfx', ek(hit(.2, 1200) * .6, boom(.5, 60) * .6), at, .5)
M.add('sfx', impact(.9), 2.5, .6); M.add('sfx', stutter(clp(), 6, .05), 3.4, .3)
# ---- B 4–8 build ----
M.add('sfx', whoosh(.5, 300, 2400, .5), 3.9, .3); M.add('sfx', impact(.6), 4.0, .4)
t = 4.0
while t < 8: M.add('sfx', hat(.05, False), t, .14); t += .25
for i in range(16): M.add('sfx', clp(.15), 6.0 + i * .125, .06 + .02 * i)  # trampet rulosu
M.add('music', riser_hedefli(5.5, 8.0, 200, 5000), 5.5, .18)
M.add('sfx', ek(pop(800, .14), whoosh(.3, 900, 2200)), 5.5, .3); M.add('sfx', kasa(), 7.0, .35)
# ---- C 8–22 DROP 1 ----
M.add('sfx', impact(1.0), 8.0, .7)
groove(8.0, 21.0, 1.0); lead(8.0, 21.0)
for i in range(5):
    t0 = 8 + i * 2.6; M.add('sfx', ek(hit(.15, 900) * .6, boom(.4, 70) * .5, whoosh(.3, 2400, 600) * .4), t0, .45); M.add('sfx', ek(boom(.5, 55), hit(.2, 1500) * .5), t0 + .25, .5)
    for k in range(12): M.add('sfx', tick(1800 + k * 60, .025), t0 + .3 + k * .09, .14)
    M.add('sfx', kasa(), t0 + 1.4, .3)
    for k in range(3): M.add('sfx', ek(pop(300 - k * 40, .12), hit(.06, 800) * .3), t0 + .5 + k * .05, .18)
M.add('sfx', stutter(ek(kick808(), clp()), 8, .0625), 21.2, .45)
# ---- D 22–30 breakdown → DROP 2 ----
pad_(22, 3, [('E', 2), ('G', 2), ('C', 3)], .3); M.add('music', riser_hedefli(22.2, 25.0, 100, 6000), 22.2, .22)
for i in range(24): M.add('sfx', clp(.12), 23.0 + i * (2.0 / 24) ** 1, .05 + .25 * (i / 24))
M.add('sfx', impact(1.2), 25.0, .8); M.add('sfx', siren(2.5), 25.0, .35)
groove(25.0, 29.4, 1.15, yogun=2); lead(25.0, 29.4, .12)
M.add('sfx', ek(boom(.6, 50), hit(.2, 1100) * .5), 27.5, .5); M.add('sfx', stutter(clp(), 8, .05), 29.4, .35)
# ---- E 30–37 ----
M.add('sfx', impact(.8), 30.0, .5); groove(30.0, 36.4, 1.0)
for k in range(6): M.add('sfx', ek(pop(400 + 120 * k, .14), hit(.06, 1000 + 200 * k) * .3), 31 + k * .5, .3)
M.add('sfx', impact(1.0), 34.5, .6); M.add('sfx', stutter(ek(kick808(), clp()), 6, .0625), 36.5, .35)
# ---- F 37–43 dolar ----
M.add('sfx', impact(.7), 37.0, .5); groove(37.0, 42.5, .95); lead(37.0, 42.5, .1)
for k in range(40): M.add('sfx', tick(2400 + (k % 5) * 80, .02), 37.6 + k * .09, .12)
M.add('sfx', ek(impact(.9), kasa() * .6), 41.5, .6)
# ---- G 43–50 breakdown (erime) ----
pad_(43, 7, [('E', 3), ('G', 3), ('B', 3), ('D', 4)], .28)
for k, n in enumerate(['E', 'G', 'B', 'E', 'D', 'B', 'G', 'E']): M.add('music', pluck(hz(n, 4 + (k == 3)), 1.2, .5), 43.0 + k * .75, .16)
M.add('sfx', impact(.6), 43.0, .45); M.add('sfx', ek(hit(.15, 900), boom(.4, 70) * .4), 43.6, .35)
for k in range(14): M.add('sfx', damla(1400 - k * 70), 46.6 + k * .21, .3)
M.add('music', filt(pad([hz('E', 2)], 3.4, .5), 'lowpass', 400) * np.linspace(0, 1, int(3.4 * SR)), 46.6, .3)
# ---- H 50–56 build → AMA ----
M.add('sfx', impact(.5), 50.0, .4); M.add('music', riser_hedefli(50.3, 53.5, 150, 6000), 50.3, .22)
for k in range(30): M.add('sfx', tick(1600 - k * 25, .025), 50.3 + k * .065, .12)
for i in range(16): M.add('sfx', clp(.12), 52.3 + i * .075, .05 + .2 * i / 16)
M.add('sfx', impact(1.3), 53.5, .85); groove(53.5, 55.8, 1.2, yogun=2)
for at in (54.2, 54.5, 54.8): M.add('sfx', ek(hit(.15, 1000), boom(.35, 60) * .6), at, .4)
M.add('sfx', stutter(ek(kick808(), clp()), 8, .05), 55.6, .35)
# ---- I 56–60 final ----
M.add('sfx', impact(.8), 56.0, .5); M.add('sfx', ters_zil(1.0), 56.0, .35)
M.add('sfx', impact(1.4), 57.0, .9); pad_(57.0, 3.5, [('E', 2), ('B', 2), ('E', 3), ('G', 3)], .3)
M.add('sfx', ek(pop(900, .14), bell(1318, .8, .9) * .5), 58.2, .35)
M.add('music', reverb(ek(*[pluck(hz(n, 3), 2.5, .5) for n in ('E', 'G', 'B')]), .5), 58.6, .3)
# ---- miks ----
mus = filt(M.bus['music'], 'highpass', 30); sfx = M.bus['sfx']
mix = mus * 1.0 + sfx * 1.0
fade = np.ones(M.n); fn = int(1.0 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 2; mix *= fade
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.6) * .92
d = int(.011 * SR); Lc = mix; Rc = np.concatenate([np.zeros(d), mix[:-d]]) * .96 + mix * .04
st = np.stack([Lc, Rc], 1)
wavfile.write('miks.wav', SR, (st * 32767).astype(np.int16)); print('tamam', st.shape[0] / SR)
