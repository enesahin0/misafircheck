"""#10 Bulduğun Cüzdan — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 55.48
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- müzik: "Sonbahar sokağı" — akustik pena + ksilofon, 96 bpm, Do majör (C–Am–F–G);
#            mahkemede minör gerilim (alçak yaylı + tokmak), efsane sahnesinde komik fagot adımı, finalde parlak ----------
B = 60 / 96
def ksilo(f, d=.5): return ek(bell(f, d, .9) * .6, pluck(f, d, .8) * .4)
def akustik(a, b, g=1.0, prog=(('C', ['C', 'E', 'G']), ('A', ['A', 'C', 'E']), ('F', ['F', 'A', 'C']), ('G', ['G', 'B', 'D'])), mel=True):
    t = a; i = 0
    while t < b - .05:
        kok, ch = prog[(i // 4) % len(prog)]
        M.add('music', pluck(hz(kok, 2), B * 1.5, .3), t, .45 * g)
        for k, n in enumerate(ch): M.add('music', pluck(hz(n, 3 + (k == 2)), B * .8, .55), t + B * .5 + k * .025, .16 * g)
        if mel and i % 2 == 0: M.add('music', ksilo(hz(ch[(i // 2) % 3], 5), .4), t + (B * .5 if i % 4 == 2 else 0), .1 * g)
        if i % 4 == 0: M.add('music', soft_kick(), t, .3 * g)
        t += B; i += 1
akustik(0, 13.4, .9)
t = 13.4; i = 0                                          # saklarsan / mahkeme: minör gerilim
while t < 22.65:
    kok = ('A', 'A', 'F', 'E')[(i // 4) % 4]
    M.add('music', pluck(hz(kok, 2), B * .9, .4), t, .35)
    if i % 2: M.add('music', filt(pad([hz(kok, 3), hz(kok, 3) * 1.19], B * .9, .3), 'lowpass', 900) * adsr(int(B * .9 * SR), .02, .2), t, .18)
    t += B; i += 1
M.add('music', filt(pad([hz('A', 2), hz('E', 3)], 9.2, .2) * adsr(int(9.2 * SR), 1.5, 1.0), 'lowpass', 600), 13.4, .15)
akustik(22.65, 29.6, 1.0)
t = 29.6                                                  # efsane: komik adım
for k, n in enumerate(('C', 'E', 'G', 'E', 'C', 'G', 'C', 'E')): M.add('music', filt(pluck(hz(n, 2), B * .45, .2), 'lowpass', 700), t + k * B * .5, .45)
akustik(34.55, 44.65, .8, prog=(('F', ['F', 'A', 'C']), ('C', ['C', 'E', 'G']), ('G', ['G', 'B', 'D']), ('C', ['C', 'E', 'G'])))
M.add('music', reverb(filt(pad([hz(n, 3) for n in ('C', 'E', 'G', 'B')], 7.4, .4) * adsr(int(7.4 * SR), 1.0, 1.0), 'lowpass', 2200), .4), 44.65, .25)
for k in range(16): M.add('music', ksilo(hz(('C', 'E', 'G', 'B', 'A', 'G', 'E', 'D')[k % 8], 5), .6), 44.9 + k * B * .75, .08)
akustik(52.1, LS, 1.0)
M.add('music', reverb(ek(*[pluck(hz(n, 3), 2.4, .6) for n in ('C', 'E', 'G', 'C')]), .35), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def kagit(): return filt(noise(.35), 'bandpass', [900, 4000]) * adsr(int(.35 * SR), .02, .15) * .6
def duduk(d=.5):
    tt = T(d); f = 2900 + 250 * np.sign(np.sin(2 * np.pi * 22 * tt)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .5 + filt(noise(d), 'bandpass', [2500, 4000]) * .15
    return x * adsr(len(tt), .01, .08)
def gicirti(d=.6): tt = T(d); f = 300 + 180 * tt / d + 40 * np.sin(2 * np.pi * 9 * tt); return filt(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 'bandpass', [400, 2000]) * adsr(len(tt), .05, .15) * .25
def tokmak(): return ek(damga(95, .3), hit(.25, 1400) * .6, tick(900, .04) * 1.5)
def ding(f=1568): return ek(bell(f, .9, .8), bell(f * 1.5, .7, .6) * .4)
def ruzgar(d=1.0): return filt(noise(d), 'bandpass', [300, 1500]) * adsr(int(d * SR), d * .4, d * .5) * .5
S(steps(1.3, 3.2, 700) * .5, 0.0, .15); S(ruzgar(2.0), .2, .12); S(bell(2637, .8, .6) * .5, .6, .15)
S(scrape(.35, 300) * .5, 1.8, .2)
for k in range(3): S(kagit(), 2.3 + k * .12, .22)
S(pop(760, .14), 3.05, .28); S(pop(520, .18), 4.1, .28); S(whoosh(.35, 3000, 600), 4.7, .22)
S(kagit(), 5.3, .3); S(pop(640, .14), 5.35, .25)
for k in range(9): S(pop(700 + k * 40, .08), 6.9 + k * .04, .1)
S(whoosh(.4, 2500, 700), 5.4, .15); S(duduk(.45), 7.0, .3); S(ding(1568), 6.85, .25); S(duduk(.6), 11.3, .3); S(ding(2093), 11.45, .25)
for k in range(6): S(filt(pluck(hz('A', 3), .2, .4), 'lowpass', 1200), 13.9 + k * .22, .2)
S(boom(1.0, 55) * .6, 15.0, .25); S(whoosh(.5, 800, 3000), 15.55, .2)
for a in (16.4, 18.6, 19.7): S(tokmak(), a, .5)
for a in (18.4, 19.6, 21.0): S(pop(700, .14), a, .25)
S(pop(900, .12), 21.3, .25)
S(gicirti(.7), 24.2, .3); S(swish(.3), 25.25, .25); S(ding(1760), 27.05, .28); S(whoosh(.4, 600, 2500), 27.95, .2); S(ding(2349), 28.15, .28); S(ek(bell(2637, 1.0, .9), bell(3136, .9, .9)), 28.55, .22)
S(whoosh(.35, 3000, 600), 29.25, .2)
S(rumble(.8, 55) * .8, 29.7, .3); S(pop(700, .14), 30.2, .25); S(pop(640, .14), 31.6, .25)
S(whoosh(.3, 2500, 600), 33.4, .25); S(damga(), 33.7, .55); S(ek(hit(.3, 800), scrape(.3, 90) * .5), 33.6, .3); S(shatter(.9), 33.95, .45)
S(pop(820, .14), 34.85, .3); S(pop(640, .12), 36.15, .22); S(pop(700, .12), 36.95, .22); S(pop(760, .12), 37.95, .22)
S(steps(2.0, 5, 700) * .5, 35.95, .15); S(swish(.3), 39.95, .22); S(ding(1568), 40.85, .2); S(damga(), 43.15, .5)
S(pop(640, .14), 44.85, .28)
for k in range(5): S(kagit() * .7, 47.05 + k * .72, .25); S(tick(2000, .03), 47.05 + k * .72, .2); S(ruzgar(.7), 47.1 + k * .72, .12)
S(ek(bell(2093, 1.2, .8), bell(2637, 1.0, .8) * .6), 50.75, .3)
S(pop(760, .14), 53.1, .28); S(pop(900, .12), 53.4, .28); S(bell(2637, 1.0, .6) * .6, 53.5, .15)
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
