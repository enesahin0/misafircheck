"""#20 Sarı & kırmızı kart — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 73.56
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- müzik: "1966 twist" — shuffle bas + elektrik gitar (pluck) + snare, 132 bpm Mi majör;
#            dil kaosunda durak/gerilim, Londra'da sakin, trafik ışığında 'aha' açılışı, Meksika'da mariachi trompet ----------
B = 60 / 132
def trompet(f, d): tt = T(d); x = sum(np.sin(2 * np.pi * f * k * tt) / k for k in (1, 2, 3, 4)); return filt(x, 'lowpass', 3500) * adsr(len(tt), .03, .1) * .4
def snare(): return ek(filt(noise(.12), 'bandpass', [1500, 6000]) * env(int(.12 * SR), .002, .08) * .6, tick(200, .05))
def twist(a, b, g=1.0, P=(('E', ['E', 'G#', 'B']), ('A', ['A', 'C#', 'E']), ('B', ['B', 'D#', 'F#']), ('E', ['E', 'G#', 'B']))):
    t = a; i = 0
    while t < b - .05:
        kok, ch = P[(i // 8) % 4]
        M.add('music', pluck(hz(kok, 2) * (1.5 if i % 4 == 2 else 1), B * .8, .4), t, .4 * g)
        if i % 2: M.add('music', ek(*[pluck(hz(n, 4), B * .4, .8) for n in ch]), t, .12 * g)
        if i % 4 == 0: M.add('music', soft_kick(), t, .35 * g)
        if i % 4 == 2: M.add('music', snare(), t, .25 * g)
        t += B; i += 1
twist(0, 5.0, .8)
M.add('music', filt(pad([hz('E', 2), hz('F', 3)], 5.1, .3) * adsr(int(5.1 * SR), .3, .6), 'lowpass', 900), 5.0, .2)
twist(10.1, 24.1, 1.0)
M.add('music', filt(pad([hz('E', 2), hz('A#', 2)], 4.5, .3) * adsr(int(4.5 * SR), .2, .5), 'lowpass', 700), 24.1, .22)
twist(28.6, 42.1, .7, P=(('A', ['A', 'C#', 'E']), ('E', ['E', 'G#', 'B']), ('D', ['D', 'F#', 'A']), ('E', ['E', 'G#', 'B'])))
M.add('music', riser_hedefli(41.4, 42.2), 41.4, .15)
twist(42.2, 53.95, 1.1)
t = 53.95; i = 0                                              # Meksika: mariachi trompet
while t < 61.45:
    M.add('music', pluck(hz(('E', 'B')[(i // 6) % 2], 2), B * .9, .4), t, .35)
    if i % 3: M.add('music', ek(*[pluck(hz(n, 4), B * .4, .8) for n in ('E', 'G#', 'B')]), t, .12)
    if i % 12 == 0: M.add('music', trompet(hz(('B', 'G#', 'E')[(i // 12) % 3], 4), B * 2.5), t, .18)
    t += B * 1.0; i += 1
twist(61.45, LS, 1.0)
M.add('music', reverb(ek(*[pluck(hz(n, 3), 2.4, .6) for n in ('E', 'G#', 'B', 'E')]), .35), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def duduk(d=.5): tt = T(d); f = 2900 + 250 * np.sign(np.sin(2 * np.pi * 22 * tt)); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * .5 + filt(noise(d), 'bandpass', [2500, 4000]) * .15) * adsr(len(tt), .01, .08)
def kalabalik(d, g=1.0): tt = T(d); x = filt(noise(d), 'bandpass', [300, 2500]); return x * (.6 + .4 * np.sin(2 * np.pi * .3 * tt) ** 2) * adsr(len(tt), .5, .8) * .4 * g
def tezahurat(d=1.5): return ek(kalabalik(d, 1.4), filt(noise(d), 'bandpass', [1000, 4000]) * adsr(int(d * SR), .05, .8) * .3)
def korna(): tt = T(.35); return filt(np.sign(np.sin(2 * np.pi * 420 * tt)) + np.sign(np.sin(2 * np.pi * 530 * tt)), 'lowpass', 1500) * adsr(len(tt), .01, .05) * .15
def motor(d): tt = T(d); return filt(np.sin(2 * np.pi * (60 + 20 * np.sin(2 * np.pi * 3 * tt)) * tt) + noise(d) * .3, 'lowpass', 400) * adsr(len(tt), .2, .4) * .4
def fren(): return ek(filt(noise(.6), 'bandpass', [2000, 5000]) * adsr(int(.6 * SR), .02, .3) * .3, scrape(.5, 300) * .3)
def klik(): return ek(tick(1200, .04) * 2, pop(700, .06) * .5)
S(kalabalik(10.0), 0, .15); S(duduk(.6), .6, .35); S(pop(700, .14), 1.2, .25)
for a in (5.2, 5.8, 6.3, 7.5, 8.0): S(pop(560 + (a * 100) % 300, .14), a, .25)
S(kalabalik(14.0, 1.2), 10.1, .18); S(pop(760, .14), 10.4, .22); S(tezahurat(1.8), 12.5, .2)
S(duduk(.8), 16.7, .35); S(pop(640, .14), 18.15, .25); S(pop(700, .14), 20.75, .25); S(pop(500, .2), 22.85, .25)
S(kalabalik(4.5, .8), 24.1, .15); S(whoosh(.3, 2500, 800), 26.0, .15)
for k in range(10): S(tick(1500, .03), 26.2 + k * .22, .12)
S(pop(700, .14), 26.4, .22)
S(ek(scrape(.4, 400) * .4, bell(2093, .4, .7) * .2), 28.9, .2); S(filt(noise(.35), 'bandpass', [900, 4000]) * adsr(int(.35 * SR), .02, .15) * .6, 30.7, .3); S(whoosh(.3, 2500, 800), 30.65, .15); S(pop(820, .14), 33.6, .25)
S(motor(6.0), 35.9, .2); S(korna(), 36.2, .2); S(korna(), 36.45, .2); S(whoosh(1.4, 400, 1200, .4), 35.8, .15); S(pop(700, .14), 36.0, .22); S(pop(760, .14), 36.7, .22); S(fren(), 39.6, .3); S(klik(), 39.9, .3)
S(ek(bell(1568, 1.0, .8), bell(2349, .9, .8) * .6), 42.4, .35); S(klik(), 44.5, .4); S(pop(760, .14), 45.2, .25); S(klik(), 47.0, .4); S(ek(boom(.4, 90) * .5, hit(.2, 1000) * .4), 47.9, .3); S(pop(820, .14), 47.9, .25)
S(whoosh(.6, 600, 2600, .5), 49.2, .25); S(ek(pop(900, .12), pop(1100, .12)), 49.9, .3)
S(pop(700, .14), 50.9, .25)
for k in range(4): S(ek(pop(800 + k * 80, .1), bell(2600, .3, .6) * .2), 51.8 + k * .15, .2)
S(tezahurat(2.0), 53.95, .2); S(pop(760, .14), 54.25, .22); S(whoosh(.3, 2500, 800), 56.85, .15); S(ek(scrape(.4, 500) * .5, swish(.2)), 57.1, .3); S(duduk(.5), 57.6, .3); S(pop(640, .14), 59.6, .22)
S(kalabalik(7.0, .8), 61.45, .12); S(swish(.3), 62.7, .2); S(ek(boom(.5, 80) * .6, hit(.2, 900) * .4), 64.4, .35); S(ek(bell(1760, .8, .8), pop(900, .12)), 65.3, .3)
S(tezahurat(2.5), 69.3, .2); S(pop(900, .14), 69.6, .28)
S(duduk(.9), LS + .3, .25); S(bell(1319, 1.6), LS + .6, .3); S(bell(1976, 1.3), LS + .7, .25); S(pop(900, .12), LS + .72, .4)
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
