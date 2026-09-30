"""#11 Kendine mikrop içen doktor — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
from functools import lru_cache
import numpy as np
from scipy import signal
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 60.68
DUR = LS + 2.2
M = Mix(DUR)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik: sıcak akustik "merak hikâyesi" — ukulele benzeri tel vuruşları + yumuşak shaker (Re majör, 92 bpm);
#            içme anında gerilim nabzı; Nobel'de açılan parlak akor. ----------
B = 60 / 92
@lru_cache(None)
def tel(f, d=.6): return pluck(f, d, .55) * env(int(d * SR), .002, .3)
def strum(notalar, at, g, yon=1):
    for k, f in enumerate(notalar[::yon]): M.add('music', tel(round(f, 2)), at + k * .018, g)
def shaker(): return filt(noise(.08), 'highpass', 5000) * adsr(int(.08 * SR), .02, .05)
AK = [('D', ['D', 'F#', 'A', 'D']), ('A', ['C#', 'E', 'A', 'E']), ('B', ['D', 'F#', 'B', 'F#']), ('G', ['D', 'G', 'B', 'G'])]
def akustik(a, b, g=1.0, sh=True):
    t = a; i = 0
    while t < b - .1:
        kok, ch = AK[(i // 8) % 4]; fs = [hz(n, 4 if n != ch[-1] else 4) for n in ch]
        if i % 8 in (0, 3, 6): strum(fs, t, .09 * g, 1 if i % 2 == 0 else -1)
        if i % 8 in (2, 5): strum(fs[1:], t, .05 * g, -1)
        if i % 4 == 0: M.add('music', filt(pad([hz(kok, 2)], B * 2, .2) * adsr(int(B * 2 * SR), .02, .6), 'lowpass', 300), t, .35 * g)
        if sh: M.add('music', shaker(), t + B / 4, .05 * g)
        t += B / 2; i += 1
akustik(0, 28.9, .9)
# gerilim: 1984 — içme (düşük nabız + tek nota tekrar)
t = 28.9
while t < 36.3:
    M.add('music', soft_kick() * .7, t, .35); M.add('music', tel(hz('D', 3), .4), t + B / 2, .06); t += B
M.add('music', filt(pad([hz('D', 3), hz('A', 3)], 7.6, .2) * adsr(int(7.6 * SR), 1.5, 1), 'lowpass', 700), 28.9, .14)
akustik(36.3, 50.0, .8)
# Nobel: parlak açılış
M.add('music', filt(pad([hz(n, 3) for n in ('D', 'F#', 'A', 'D')] + [hz('F#', 4)], 4.2, .5) * adsr(int(4.2 * SR), .3, 1.2), 'lowpass', 2600), 50.0, .24)
for k, n in enumerate(['D', 'F#', 'A', 'D']): M.add('music', bell(hz(n, 5 if k < 3 else 6), 1.5, .5), 50.2 + k * .12, .06)
akustik(53.8, LS, 1.0)
strum([hz(n, 4) for n in ('D', 'F#', 'A', 'D')], LS - .05, .12)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def bloop(f=700): return pop(f, .16)
def whoomp(): return boom(1.0, 55) * .7
def shimmer(f=2600): return bell(f, 1.0, .5) * .7 + bell(f * 1.5, 1.0, .4) * .3
def fizz(d): x = filt(noise(d), 'highpass', 4000); t = T(d); return x * (.4 + .6 * np.abs(np.sin(2 * np.pi * 13 * t))) * adsr(len(t), .2, .3) * .3
def gulp():
    t = T(.22); f = 420 * np.exp(-t * 6); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), .005, .08); return filt(x + .3 * filt(noise(.22), 'lowpass', 600) * env(len(t), .005, .05), 'lowpass', 1400)
def zap(): t = T(.3); f = 1400 * np.exp(-t * 8) + 200; return filt(signal.sawtooth(2 * np.pi * np.cumsum(f) / SR), 'lowpass', 3000) * env(len(t), .002, .1) * .4
def cizirti(d=.8): return filt(noise(d), 'highpass', 2500) * adsr(int(d * SR), .05, .5) * .4
def thud(): return filt(hit(.2, 500), 'lowpass', 900) + boom(.2, 80) * .4
def oink():
    t = T(.35); f = 330 + 180 * np.sin(np.pi * t / .35); x = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR); return filt(x, 'bandpass', [400, 1400]) * adsr(len(t), .03, .12) * .6
def alkis(d=2.2):
    x = np.zeros(int(d * SR)); R = np.random.default_rng(5)
    for k in range(80): i = int(R.random() * (d - .05) * SR); c = filt(noise(.03), 'bandpass', [900, 4000]) * env(int(.03 * SR), .001, .012); x[i:i + len(c)] += c * R.uniform(.3, 1)
    return x * adsr(len(x), .3, .8)
S(bloop(640), .05, .3); S(fizz(5.0), .1, .25); S(gulp(), 4.3, .3)
S(whoosh(.5, 3000, 400), 5.2, .2); S(bloop(700), 5.5, .3); S(swish(.3), 6.8, .25); S(pop(560, .14), 6.9, .3)
S(zap(), 8.8, .35); S(pop(760, .12), 10.2, .3); S(filt(noise(.4), 'highpass', 3000) * adsr(int(.4 * SR), .01, .2) * .4, 10.25, .2)
S(whoomp(), 11.5, .25); S(fizz(4.0) * 1.3, 11.7, .2); S(cizirti(1.0), 14.1, .3)
S(whoosh(.5, 3000, 400), 15.7, .2); S(pop(600, .14), 15.85, .3); S(bloop(900), 16.4, .3); S(bloop(620), 17.5, .3); S(bloop(760), 18.6, .3)
S(whoosh(.8, 300, 2500), 19.8, .25); S(shimmer(2600), 20.3, .22); S(bloop(820), 23.8, .3)
for a in (25.6, 25.8, 26.0): S(thud(), a, .4)
S(swish(.35), 26.75, .25); S(oink(), 27.3, .35); S(bloop(980), 27.6, .3)
S(pop(500, .12), 29.1, .3); S(bloop(640), 29.7, .3); S(bloop(820), 32.2, .3); S(riser(1.8, 150, 900), 33.3, .1)
for a in (34.9, 35.35, 35.8): S(gulp(), a, .45)
for i in range(8): S(tick(1800, .03), 36.35 + i * .22, .12)
S(filt(np.sin(2 * np.pi * 110 * T(1.2)) * (1 + .5 * np.sin(2 * np.pi * 5 * T(1.2))), 'lowpass', 400) * adsr(int(1.2 * SR), .2, .4) * .4, 36.8, .25)
S(whoosh(.6, 2500, 400), 38.2, .22); S(hum(2.4, 180) * .5, 38.7, .12); S(tick(3200, .04), 41.3, .45); S(filt(noise(.12), 'highpass', 3000) * env(int(.12 * SR), .002, .04), 41.31, .3); S(bloop(880), 41.4, .3)
S(swish(.3), 42.95, .25); S(filt(noise(.6), 'bandpass', [1800, 5000]) * adsr(int(.6 * SR), .03, .1) * .5, 46.1, .25); S(pop(760, .14), 48.1, .3)
S(whoosh(.6, 600, 3000, .5), 48.2, .2)
for a in (48.7, 48.95, 49.2): S(pop(1100, .08), a, .3)
S(shimmer(3000), 49.0, .2)
S(bloop(700), 50.1, .3); S(whoosh(.5, 800, 3500), 50.2, .2); S(shimmer(2400), 50.4, .3); S(bloop(620), 51.2, .25); S(bloop(760), 51.4, .25); S(alkis(2.6), 50.8, .1)
S(pop(560, .14), 53.85, .3); S(bloop(820), 55.0, .3); S(shimmer(2800), 55.1, .2)
S(whoosh(.5, 800, 3500, .6), LS - .4, .22)
S(bell(2349, 1.6), LS + .6, .35); S(bell(3136, 1.3), LS + .7, .28); S(pop(900, .12), LS + .72, .45); S(pop(900, .08), LS + .85, .15)
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
