"""#15 Maymun & Muz — özgün müzik + efektler + maymun sesleri + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 69.49
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- müzik: "Orman şakası" — marimba + bongo, 112 bpm, Fa majör (F–Dm–Bb–C);
#            1900'ler limanında ragtime piyano, sirkte kaliyope valsi, ağlama sahnesinde minör, salatada parlak dönüş ----------
B = 60 / 112
def marimba(f, d=.35): return ek(bell(f, d, .5) * .5, pluck(f, d, .9) * .5)
def bongo(f=320): tt = T(.18); return np.sin(2 * np.pi * f * tt * (1 + .4 * np.exp(-tt * 40))) * env(len(tt), .001, .1) * .6
PROG = (('F', ['F', 'A', 'C']), ('D', ['D', 'F', 'A']), ('A#', ['A#', 'D', 'F']), ('C', ['C', 'E', 'G']))
def orman_tema(a, b, g=1.0, prog=PROG, mel=True):
    t = a; i = 0
    while t < b - .05:
        kok, ch = prog[(i // 4) % len(prog)]
        M.add('music', pluck(hz(kok, 2), B * .9, .35), t, .4 * g)
        M.add('music', marimba(hz(ch[i % 3], 4), .3), t + B * .5, .22 * g)
        if mel and i % 2 == 0: M.add('music', marimba(hz(ch[(i // 2 + 1) % 3], 5), .3), t + (B * .25 if i % 4 else 0), .14 * g)
        M.add('music', bongo(360 if i % 2 else 260), t + (B * .5 if i % 2 else 0), .25 * g)
        if i % 4 == 3: M.add('music', bongo(420), t + B * .75, .18 * g)
        t += B; i += 1
orman_tema(0, 26.3, .9)
t = 26.3; i = 0                                                # 1900'ler: ragtime piyano
while t < 33.4:
    kok, ch = (('F', ['A', 'C', 'F']), ('C', ['G', 'C', 'E']))[(i // 4) % 2]
    M.add('music', pluck(hz(kok, 2) if i % 2 == 0 else hz(kok, 3), B * .45, .5), t, .35)
    if i % 2: M.add('music', ek(*[pluck(hz(n, 4), B * .4, .7) for n in ch]), t, .22)
    t += B / 1.0; i += 1
t = 33.4; i = 0                                                # sirk: kaliyope valsi
while t < 37.8:
    kok, ch = (('F', ['A', 'C']), ('C', ['G', 'E']))[(i // 3) % 2]
    if i % 3 == 0: M.add('music', pluck(hz(kok, 2), .4, .4), t, .4)
    else: M.add('music', ek(*[filt(pad([hz(n, 4)], .3, .9), 'bandpass', [400, 3000]) * adsr(int(.3 * SR), .01, .1) for n in ch]), t, .2)
    t += B * .75; i += 1
for k, n in enumerate(('C', 'E', 'G', 'C', 'G', 'E', 'C', 'G')): M.add('music', marimba(hz(n, 5), .2), 38.8 + k * .3, .14)   # çizgi film
orman_tema(41.6, 51.0, .9)
t = 51.0; i = 0                                                # ağlama: yavaş minör
while t < 58.6:
    kok = ('D', 'A#', 'G', 'A')[(i // 4) % 4]
    M.add('music', pluck(hz(kok, 2), B * 1.8, .3), t, .3); M.add('music', filt(pad([hz(kok, 3), hz(kok, 3) * 1.19], B * 1.8, .3), 'lowpass', 900) * adsr(int(B * 1.8 * SR), .1, .4), t, .15)
    t += B * 2; i += 1
orman_tema(58.6, LS, 1.0)
M.add('music', reverb(ek(*[marimba(hz(n, 4), 1.5) for n in ('F', 'A', 'C')]), .35), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def ooh(n=2, f0=420):
    o = np.zeros(int((n * .28 + .3) * SR))
    for k in range(n):
        tt = T(.24); f = f0 * (1 + .6 * tt / .24) * (1 + .05 * np.sin(2 * np.pi * 7 * tt)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) + .4 * np.sin(4 * np.pi * np.cumsum(f) / SR)
        x = filt(x, 'bandpass', [300, 2500]) * adsr(len(tt), .02, .08); i0 = int(k * .28 * SR); o[i0:i0 + len(x)] += x
    return o * .5
def aah(f0=600, d=.5): tt = T(d); f = f0 * (1.2 - .5 * tt / d); x = np.sin(2 * np.pi * np.cumsum(f) / SR) + .5 * np.sin(4 * np.pi * np.cumsum(f) / SR); return filt(x, 'bandpass', [300, 3000]) * adsr(len(tt), .03, .15) * .5
def hickir(d=.9):
    o = np.zeros(int(d * SR)); tt = T(.5); f = 520 * (1 - .35 * tt / .5) * (1 + .06 * np.sin(2 * np.pi * 9 * tt)); w = filt(np.sin(2 * np.pi * np.cumsum(f) / SR), 'bandpass', [300, 2000]) * adsr(len(tt), .05, .2) * .5
    o[:len(w)] += w; h = filt(noise(.06), 'bandpass', [600, 2000]) * env(int(.06 * SR), .002, .04) * .5
    for a in (.55, .7): i0 = int(a * SR); o[i0:i0 + len(h)] += h[:max(0, len(o) - i0)]
    return o
def munch(n=3):
    o = np.zeros(int((n * .16 + .1) * SR)); c = filt(noise(.07), 'bandpass', [900, 3500]) * env(int(.07 * SR), .002, .05) * .6
    for k in range(n): i0 = int(k * .16 * SR); o[i0:i0 + len(c)] += c
    return o
def boing(): tt = T(.5); f = 180 + 120 * np.sin(2 * np.pi * 9 * tt) * np.exp(-tt * 5); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), .005, .4) * .5
def dudukKay(d=.6, f0=500, f1=1500): tt = T(d); f = f0 + (f1 - f0) * tt / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * adsr(len(tt), .02, .1) * .4
def korna(): tt = T(1.2); x = sum(np.sin(2 * np.pi * f * tt) for f in (110, 165, 220)) / 3; return filt(x, 'lowpass', 900) * adsr(len(tt), .08, .4) * .6
def kaching():
    o = np.zeros(int(1.0 * SR)); a = bell(2637, .9, .9); b = bell(3520, .8, .9); c = tick(1500, .05) * 2
    o[:len(c)] += c; o[int(.08 * SR):int(.08 * SR) + len(a)] += a; o[int(.16 * SR):int(.16 * SR) + len(b)] += b; return o * .7
def hisirti(d=.6): return filt(noise(d), 'bandpass', [1500, 6000]) * adsr(int(d * SR), .05, .3) * .4
def tahta(): return ek(tick(600, .06) * 2, filt(noise(.08), 'bandpass', [300, 1200]) * env(int(.08 * SR), .002, .05))
S(hisirti(.8), .2, .15); S(whoosh(.5, 500, 2500), .2, .15); S(pop(700, .14), 1.0, .25); S(ek(pop(900, .14), bell(2637, 1.0, .7) * .5), 2.8, .3); S(ooh(2, 460), 3.0, .3)
S(whoosh(.35, 3000, 600), 3.7, .2)
S(pop(600, .15), 4.4, .25); S(pop(760, .12), 4.7, .2); S(whoosh(.8, 300, 1500, .4), 4.5, .12); S(pop(820, .12), 7.0, .25); S(scrape(.5, 400) * .5, 7.0, .15); S(pop(640, .14), 8.2, .25); S(scrape(.5, 600) * .5, 8.35, .2)
S(pop(760, .12), 9.8, .22); S(riser_hedefli(11.6, 12.2), 11.6, .12)
for k in range(5): S(bell(2093 + k * 300, .8, .8) * .5, 12.2 + k * .06, .15)
S(pop(860, .12), 12.5, .22)
S(tahta(), 16.1, .45); S(whoosh(.3, 2500, 800), 16.0, .15)
for k in range(12): S(pop(500 + (k % 4) * 90, .07), 16.2 + k * .06, .1)
S(pop(560, .14), 17.6, .28); S(pop(700, .14), 18.4, .28)
S(ooh(2, 440), 20.6, .22)
for a in (22.0, 22.7, 23.3, 23.9, 24.8): S(pop(780, .12), a, .22); S(munch(3), a + .15, .2)
S(pop(520, .18), 26.6, .25); S(korna(), 28.1, .3); S(hisirti(1.0), 28.3, .1); S(pop(760, .12), 28.9, .22)
for k in range(4): S(pop(600 + k * 60, .12), 30.1 + k * .25, .2)
S(kaching(), 31.0, .3)
S(pop(700, .12), 33.7, .22); S(pop(800, .12), 34.6, .22)
for k in range(14): S(ek(pop(420 + (k % 5) * 60, .1), tick(900, .03)), 35.6 + k * .1, .12)
S(filt(noise(1.6), 'bandpass', [500, 3000]) * adsr(int(1.6 * SR), .3, .6) * .5, 35.7, .12); S(ooh(3, 480), 35.8, .28)
S(tick(1200, .05) * 2, 37.9, .25); S(whoosh(.3, 2500, 700), 38.65, .15); S(boing(), 39.1, .3); S(dudukKay(.6, 500, 1500), 39.9, .2); S(boing(), 40.6, .25)
S(whoosh(.8, 600, 2600, .4), 42.2, .15); S(bell(2637, .9, .6) * .5, 42.3, .12); S(pop(820, .14), 43.4, .28); S(aah(640, .6), 43.5, .25)
S(whoosh(.3, 2500, 800), 44.05, .15); S(ooh(2, 520), 44.3, .3); S(bell(3136, 1.0, .6) * .5, 44.4, .12)
S(steps(.4, 8, 800) * .5, 45.7, .15); S(pop(700, .14), 45.9, .28); S(munch(3), 46.5, .2)
S(tahta(), 48.1, .4); S(scrape(.6, 150) * .6, 48.4, .15)
S(steps(.8, 9, 800) * .5, 50.3, .18); S(swish(.25), 51.1, .35); S(pop(900, .1), 51.15, .25); S(aah(760, .35), 51.25, .3); S(steps(.9, 9, 800) * .5, 51.3, .18)
for k in range(6): S(hickir(.9), 51.7 + k * 1.15, .25)
for a in (54.0, 55.0, 56.1, 56.9): S(pop(640, .14), a, .25)
S(steps(1.0, 8, 800) * .5, 58.7, .15); S(ek(bell(1568, .5, .8), tick(2000, .04)), 60.6, .25); S(munch(4), 60.9, .22); S(aah(560, .5), 60.8, .2)
for k in range(6): S(bell(2637 + k * 200, .6, .7) * .4, 61.5 + k * .08, .12)
S(pop(760, .12), 61.8, .22); S(pop(860, .12), 62.9, .22); S(whoosh(.35, 3000, 600), 64.2, .2)
S(ooh(2, 500), 65.3, .2); S(pop(900, .14), 68.5, .3)
S(bell(1397, 1.6), LS + .6, .3); S(bell(2093, 1.3), LS + .7, .25); S(pop(900, .12), LS + .72, .4)
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
