"""#9 İlk bug — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy import signal
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 58.31
LS = 56.11
M = Mix(DUR)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik: "röle groove" — yumuşak sinüs bas + filtreli kare dalga arpej + röle tık ritmi (Mi minör, 96 bpm);
#            1878 bölümü müzik kutusu; final Sol majör parlak. ----------
B = 60 / 96
def kare(f, d=.22, bright=1600):
    t = T(d); x = signal.square(2 * np.pi * f * t) * .5
    return filt(x, 'lowpass', bright) * env(len(t), .004, d * .4)
def sbas(f, d=.5):
    t = T(d); return np.sin(2 * np.pi * f * t) * env(len(t), .01, d * .6)
def kutu(f, d=1.2):  # müzik kutusu
    t = T(d); return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 9) + .2 * np.sin(2 * np.pi * f * 5.1 * t) * np.exp(-t * 16)) * np.exp(-t * 4) * np.minimum(1, t / .002)
AK = [('E', ['E', 'G', 'B']), ('C', ['C', 'E', 'G']), ('A', ['A', 'C', 'E']), ('B', ['B', 'D#', 'F#'])]
def groove(a, b, g=1.0, arp=True, tik=True):
    t = a; i = 0
    while t < b - .1:
        kok, ch = AK[(i // 8) % 4]
        if i % 2 == 0: M.add('music', sbas(hz(kok, 2) * (1.5 if i % 8 == 6 else 1)), t, .5 * g)
        if arp and i % 2 == 1: M.add('music', kare(hz(ch[(i // 2) % 3], 4 + (i % 4 == 3))), t, .1 * g)
        if tik: M.add('music', tick(1500 + 500 * (i % 2), .02), t + B / 4, .05 * g)
        if i % 8 == 0: M.add('music', filt(pad([hz(n, 3) for n in ch], B * 4 + 1, .25) * adsr(int((B * 4 + 1) * SR), .6, 1.0), 'lowpass', 1100), t, .16 * g)
        t += B / 2; i += 1
groove(0, 7.2, .7, tik=False)
groove(7.2, 14.9, 1.0)
groove(14.9, 22.4, .6, arp=False)          # karanlık arama: sadece bas + tık
groove(22.4, 32.8, .9)
MK = ['G', 'B', 'D', 'B', 'A', 'C', 'E', 'C', 'F#', 'A', 'D', 'A', 'G', 'B', 'D', 'G']
for i, n in enumerate(MK * 2):
    at = 33.0 + i * B / 2
    if at < 41.1: M.add('music', kutu(hz(n, 5)), at, .12)
M.add('music', filt(pad([hz(n, 3) for n in ('G', 'B', 'D')], 8.5, .2) * adsr(int(8.5 * SR), 1.5, 1.5), 'lowpass', 900), 32.9, .15)
AK = [('G', ['G', 'B', 'D']), ('D', ['D', 'F#', 'A']), ('E', ['E', 'G', 'B']), ('C', ['C', 'E', 'G'])]
groove(41.2, LS, 1.0)
M.add('music', kutu(hz('G', 5), 2.0), LS - .05, .2); M.add('music', kutu(hz('D', 6), 2.0), LS + .1, .14)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def bloop(f=700): return pop(f, .16)
def whoomp(): return boom(1.0, 55) * .7
def shimmer(f=2600): return bell(f, 1.0, .5) * .7 + bell(f * 1.5, 1.0, .4) * .3
def buzz(d=.18, f=110): t = T(d); return filt(signal.square(2 * np.pi * f * t), 'lowpass', 1200) * adsr(len(t), .005, .03) * .5
def cirt(): return sweep_filter(noise(.22), 1500, 5000, 'bandpass', .5) * adsr(int(.22 * SR), .01, .05)
def karala(d): x = filt(noise(d), 'bandpass', [1800, 5000]); t = T(d); return x * (.5 + .5 * np.sin(2 * np.pi * 7 * t) ** 2) * adsr(len(t), .03, .05) * .5
def bip(f=880, d=.12): t = T(d); return filt(signal.square(2 * np.pi * f * t), 'lowpass', 2500) * adsr(len(t), .005, .03) * .4
S(bloop(620), .05, .3); S(buzz(), .55, .35); S(buzz(), .8, .3)
S(flaps(3.4, 9) * .5, 2.1, .12); S(bloop(760), 4.2, .3); S(cirt(), 5.95, .4)
S(whoosh(.5, 3000, 400), 7.0, .2); S(bloop(700), 7.4, .3); S(hum(7.5, 60) * .5, 7.3, .12)
R = np.random.default_rng(3)
for k in range(30): S(tick(900 + R.random() * 800, .02), 7.4 + R.random() * 7.2, .06)
S(bloop(600), 10.25, .25)
for i in range(8): S(bip(880 if i % 2 else 660), 12.8 + i * .25, .18)
S(whoomp(), 14.9, .25); S(tick(1800, .04), 15.2, .35)
for k in range(45): S(tick(700 + R.random() * 600, .02), 15.0 + R.random() * 7.2, .07)
S(bloop(820), 18.0, .3); S(riser(1.2, 200, 1400), 19.1, .12); S(shimmer(2800), 20.25, .3)
S(swish(.3), 22.45, .25); S(pop(500, .12), 23.7, .3); S(cirt(), 23.95, .4)
S(karala(1.4), 24.8, .25); S(karala(1.6), 26.8, .25); S(bloop(700), 26.95, .25)
S(pop(900, .1), 29.8, .25); S(bloop(1000), 30.5, .3); S(bloop(760), 30.75, .25)
S(rewind(2.4), 32.9, .18)
for i in range(22): S(tick(2400, .02), 33.1 + i * .12, .07)
S(shimmer(1800), 36.0, .25); S(swish(.25), 36.3, .2); S(pop(640, .14), 38.1, .3); S(karala(.8), 38.8, .25)
S(whoomp(), 41.2, .25)
for i in range(9): S(bloop(600 + i * 60), 41.5 + i * .33, .15)
S(bloop(880), 43.1, .3)
S(shimmer(3000), 45.8, .25); S(bloop(700), 46.0, .25); S(filt(noise(.5), 'lowpass', 1500) * adsr(int(.5 * SR), .1, .3) * .5, 49.3, .12)
for i in range(5): S(tick(1300, .05) + filt(noise(.05), 'bandpass', [800, 3000]) * env(int(.05 * SR), .001, .02) * .5, 50.75 + i * .17, .35)
S(bloop(820), 51.8, .25); S(sweep_filter(noise(.4), 3000, 500, 'bandpass', .6) * adsr(int(.4 * SR), .02, .1), 52.8, .2)
S(flaps(1.5, 10) * .5, 54.5, .12)
for i, f in enumerate((1318, 1661, 1975)): S(bell(f, 1.2, .6), 54.85 + i * .08, .18)
S(whoosh(.5, 800, 3500, .6), LS - .4, .22)
S(bell(2349, 1.6), LS + .6, .35); S(bell(3136, 1.3), LS + .7, .28); S(pop(900, .12), LS + .72, .45); S(pop(900, .08), LS + .85, .15)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .32)

# ---------- miks ----------
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
