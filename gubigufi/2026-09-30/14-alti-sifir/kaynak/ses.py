"""#14 Altı Sıfır — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 65.07
M = Mix(LS + 2.7)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik: "2004" — retro Türk pop grubu, 104 bpm, Sol majör (G–Em–C–D);
#            rekor sahnesinde ironik minör marş, makasta gerilim, 2005'te parlak kutlama, yanılsamada rüya padi ----------
B = 60 / 104
def ek(*xs):  # farklı uzunluktaki sesleri sıfır dizisine toplayarak birleştir
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
def ep(fs, d, g=1.0):  # elektrik piyano: pluck + hafif çan
    o = np.zeros(int(d * SR) + 1)
    for f in fs:
        a = ek(pluck(f, d, .6) * .6, bell(f * 2, d, .25) * .12); o[:min(len(o), len(a))] += a[:len(o)]
    return o / len(fs) * g
def hat(): return filt(noise(.05), 'highpass', 7000) * env(int(.05 * SR), .001, .03) * .5
PROG = (('G', ['G', 'B', 'D']), ('E', ['E', 'G', 'B']), ('C', ['C', 'E', 'G']), ('D', ['D', 'F#', 'A']))
def grup(a, b, g=1.0, davul=True, prog=PROG):
    t = a; i = 0
    while t < b - .05:
        kok, ch = prog[(i // 4) % len(prog)]
        M.add('music', pluck(hz(kok, 2), B * .9, .35), t, .5 * g)
        if i % 2: M.add('music', ep([hz(n, 4) for n in ch], B * .9), t, .35 * g)
        if i % 4 == 3: M.add('music', pluck(hz(ch[(i // 4) % 3], 5), B * .5, .7), t + B * .5, .12 * g)
        if davul:
            if i % 2 == 0: M.add('music', soft_kick(), t, .5 * g)
            M.add('music', hat(), t + B * .5, .25 * g)
            if i % 4 == 2: M.add('music', filt(noise(.12), 'bandpass', [1200, 5000]) * env(int(.12 * SR), .002, .08), t, .22 * g)
        t += B; i += 1
grup(0, 20.95, .9)
t = 20.95; i = 0                                        # rekor: ironik minör marş
while t < 28.7:
    kok = ('E', 'B', 'C', 'B')[(i // 4) % 4]
    M.add('music', filt(pad([hz(kok, 2), hz(kok, 3)], B * .9, .5), 'lowpass', 900) * adsr(int(B * .9 * SR), .02, .2), t, .35)
    if i % 2 == 0: M.add('music', soft_kick(), t, .45)
    if i % 4 == 1: M.add('music', filt(noise(.1), 'bandpass', [1500, 5000]) * env(int(.1 * SR), .002, .07), t, .2)
    t += B; i += 1
M.add('music', riser(4.0, 150, 1400) * .6, 28.7, .2)          # makas: gerilim
for k in range(8): M.add('music', pluck(hz('D', 3), .25, .5), 28.7 + k * B / 2, .25)
grup(32.85, 41.45, 1.0, prog=(('G', ['G', 'B', 'D']), ('C', ['C', 'E', 'G']), ('D', ['D', 'F#', 'A']), ('G', ['G', 'B', 'D'])))
grup(41.45, 56.8, .8)
M.add('music', reverb(filt(pad([hz(n, 3) for n in ('E', 'G', 'B', 'D')], 4.4, .4) * adsr(int(4.4 * SR), 1.0, 1.2), 'lowpass', 1800), .5), 56.8, .3)
for k in range(10): M.add('music', bell(hz(('B', 'D', 'G', 'E')[k % 4], 5), 1.2, .5) * .5, 56.9 + k * .42, .08)
grup(61.1, LS, .7, davul=False)
M.add('music', reverb(ep([hz(n, 4) for n in ('G', 'B', 'D')], 2.4), .35), LS, .45)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def kaching():
    o = np.zeros(int(1.0 * SR)); a = bell(2637, .9, .9); b = bell(3520, .8, .9); c = tick(1500, .05) * 2
    o[:len(c)] += c; o[int(.08 * SR):int(.08 * SR) + len(a)] += a; o[int(.16 * SR):int(.16 * SR) + len(b)] += b; return o * .7
def kagit(): return filt(noise(.35), 'bandpass', [900, 4000]) * adsr(int(.35 * SR), .02, .15) * .6
def yazici(d):
    o = np.zeros(int(d * SR)); k = 0
    while k < d - .03: a = tick(900 + (int(k * 40) % 3) * 150, .02); i0 = int(k * SR); o[i0:i0 + len(a)] += a; k += .035
    return o * .5
def bip(f=1800, d=.12): tt = T(d); return np.sin(2 * np.pi * f * tt) * adsr(len(tt), .005, .03) * .5
def hata(): tt = T(.45); return filt(np.sign(np.sin(2 * np.pi * 180 * tt)), 'lowpass', 1500) * adsr(len(tt), .01, .08) * .35
def makas():
    o = np.zeros(int(.2 * SR)); a = filt(noise(.08), 'highpass', 3000) * env(int(.08 * SR), .002, .05); b = tick(4200, .03)
    o[:len(a)] += a; o[int(.05 * SR):int(.05 * SR) + len(b)] += b * 1.5; return o * .8
def fisek_ses(t0, g=.3):
    S(whoosh(.45, 800, 4000, .5) * .6, t0, g * .6)
    S(ek(boom(1.2, 70) * .5, filt(noise(1.2), 'bandpass', [1500, 6000]) * adsr(int(1.2 * SR), .005, .9) * .3), t0 + .45, g)
    for k in range(6): S(tick(2500 + k * 300, .03), t0 + .55 + k * .09, g * .25)
def teneke(): return ek(bell(1200, .4, .7) * .5, tick(2400, .04))
S(pop(700, .16), .4, .3); S(whoosh(.6, 400, 2200, .5), 3.4, .2); S(kaching(), 4.05, .35); S(swish(.3), 4.3, .2); S(pop(820, .14), 4.9, .3)
S(whoosh(.35, 3000, 600), 6.0, .22)
S(pop(640, .15), 6.5, .3); S(scrape(.35, 300) * .5, 7.8, .2); S(kagit(), 8.2, .3); S(whoosh(.5, 500, 2500, .5), 11.2, .2); sayac_tiklari(M, 11.6, 1.3, 14, kazanc=.12)
S(yazici(4.4), 14.3, .22)
for a in (14.9, 15.6, 16.3, 17.0): S(bip(2000), a, .18)
S(pop(760, .14), 15.8, .25); S(whoosh(.4, 500, 2500), 18.2, .2)
for k in range(10): S(tick(1300 + (k % 3) * 200, .03), 18.8 + k * .08, .15)
S(hata(), 19.7, .35); S(pop(420, .2), 20.6, .2)
S(boom(1.4, 60) * .5, 21.0, .15); S(kagit(), 21.55, .35)
for k in range(3): S(pop(600 + k * 120, .12), 26.35 + k * .12, .2)
S(hit(.3, 1800) * .6, 26.25, .2); S(damga(), 27.25, .5)
S(whoosh(.3, 2500, 800), 30.5, .2)
for a in (30.8, 31.05, 31.3): S(makas(), a, .35)
S(pop(900, .14), 30.6, .3)
for k in range(6): S(pop(500 + k * 70, .12), 31.35 + k * .06, .22)
S(steps(1.0, 7, 700) * .5, 31.6, .15)
for t0 in (0, .5, 1.0, 1.6, 2.2, 5.0, 5.6): fisek_ses(32.85 + t0 - .0, .22 if t0 else .28)
S(pop(640, .15), 33.15, .3); S(pop(820, .12), 34.45, .25); S(pop(600, .15), 36.15, .25)
for k in range(6): S(pop(700 + k * 80, .1), 36.75 + k * .05, .2)
S(bell(1760, .9), 37.55, .3); S(swish(.3), 39.45, .25); S(bell(2637, 1.2, .8), 39.8, .25); S(riser_hedefli(38.7, 39.1), 38.7, .1)
S(pop(560, .14), 41.75, .25); S(pop(700, .14), 41.95, .25); S(pop(880, .14), 43.45, .3)
for k in range(12): S(swish(.15), 45.85 + k * .12, .1); S(teneke(), 47.15 + k * .12, .12)
S(bell(1568, .8), 46.45, .3); S(pop(760, .14), 49.05, .3)
for a in (51.25, 51.8, 52.35, 52.9): S(kagit() * .6, a, .25); S(tick(2000, .03), a, .2)
S(whoosh(.6, 2500, 400, .5), 53.25, .25); S(ek(boom(.6, 90) * .8, hit(.25, 900) * .5), 54.0, .35); S(pop(300, .12), 54.3, .2); S(pop(280, .1), 54.55, .12)
S(scrape(1.4, 200) * .6, 54.85, .2)
for k in range(6): S(ek(pop(900 - k * 60, .09), tick(3000, .02)), 58.8 + (5 - k) * .16, .25)
S(whoosh(.8, 600, 3000, .6), 59.6, .2); S(boom(.5, 110) * .6, 60.1, .3)
S(scrape(.6, 160) * .6, 61.7, .2); S(bell(2093, 1.2, .8) * .8, 62.3, .25); S(pop(820, .14), 64.1, .25)
S(bell(1568, 1.6), LS + .6, .3); S(bell(2349, 1.3), LS + .7, .25); S(pop(900, .12), LS + .72, .4)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .32)

ve = voice_env(voice)
duck = 1 - .62 * np.clip(ve * 2.2, 0, 1)
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
