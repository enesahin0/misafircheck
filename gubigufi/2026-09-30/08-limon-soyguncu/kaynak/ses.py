"""#8 Limon suyu soyguncusu — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
from functools import lru_cache
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 58.73
LS = 56.53
M = Mix(DUR)

subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik: 1. yarı "sinsi soygun" — pizzicato yürüyen bas + fırça tıkırtısı (Re minör, 104 bpm);
#            2. yarı (bilim) — yumuşak pad + marimba benzeri tınılar (Fa majör). Az ve sade. ----------
B = 60 / 104
@lru_cache(None)
def pz(f, d=.35): return pluck(f, d, .25) * env(int(d * SR), .002, .12)
def marimba(f, d=.6):
    t = T(d); return (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)) * np.exp(-t * 7) * np.minimum(1, t / .002)
BAS = ['D', 'F', 'A', 'G#', 'G', 'F', 'E', 'C#']
t = 0.0; i = 0
while t < 30.6:
    n = BAS[i % 8]; o = 2
    M.add('music', pz(round(hz(n, o), 2)), t, .55)
    if i % 2 == 1: M.add('music', filt(noise(.05), 'highpass', 6000) * env(int(.05 * SR), .001, .02), t + B / 2, .05)
    if i % 16 == 8: M.add('music', pz(round(hz('D', 4), 2), .5), t + B / 4, .18); M.add('music', pz(round(hz('A', 4), 2), .5), t + B * .75, .14)
    t += B; i += 1
M.add('music', filt(pad([hz(n, 3) for n in ('D', 'F', 'A')], 31, .25) * adsr(int(31 * SR), 2, 2), 'lowpass', 900), 0, .12)
# bilim bölümü
AK = [('F', ['F', 'A', 'C']), ('C', ['C', 'E', 'G']), ('D', ['D', 'F', 'A']), ('A#', ['A#', 'D', 'F'])]
t = 30.9; i = 0
while t < LS:
    kok, ch = AK[(i // 8) % 4]
    if i % 8 == 0:
        d = min(B * 8 + 1.5, LS - t + 1.5)
        M.add('music', filt(pad([hz(x, 3) for x in ch], d, .3) * adsr(int(d * SR), 1.2, 1.4), 'lowpass', 1300), t, .28)
        M.add('music', filt(pad([hz(kok, 2)], d, .2) * adsr(int(d * SR), .8, 1.2), 'lowpass', 260), t, .3)
    if i % 2 == 0: M.add('music', marimba(hz(ch[(i // 2) % 3], 5)), t, .07)
    t += B / 2; i += 1
M.add('music', marimba(hz('F', 5), 1.5), LS - .1, .2); M.add('music', marimba(hz('C', 6), 1.5), LS, .14)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def squish(): return filt(noise(.25), 'bandpass', [600, 2500]) * env(int(.25 * SR), .01, .08)
def bloop(f=700): return pop(f, .16)
def whoomp(): return boom(1.0, 55) * .7
def shimmer(f=2600): return bell(f, 1.0, .5) * .7 + bell(f * 1.5, 1.0, .4) * .3
def knock(): return filt(hit(.25, 400), 'lowpass', 900) + boom(.25, 90) * .5
def siren(d=2.4):
    tt = T(d); f = np.where((tt * 1.6) % 1 < .5, 740, 587); ph = 2 * np.pi * np.cumsum(f) / SR
    return filt(np.sin(ph) + .3 * np.sin(3 * ph), 'lowpass', 1800) * adsr(len(tt), .3, .6) * .5
S(tick(2400, .05), .25, .25); S(squish(), 1.2, .45)
for i in range(4): S(bloop(900 - i * 60), 1.55 + i * .3, .12)
for i in range(6): S(filt(noise(.12), 'bandpass', [1500, 4000]) * env(int(.12 * SR), .01, .04), 2.2 + i * .2, .12)   # sürme
S(whoosh(.5, 3000, 500), 3.8, .2); S(bloop(620), 5.85, .3); S(bloop(740), 6.2, .3)
S(whoomp(), 7.4, .25)
for i in range(5): S(tick(3000, .03), 8.8 + i * .24, .15)                      # limonla yazma
S(filt(noise(.4), 'lowpass', 1200) * env(int(.4 * SR), .02, .15), 10.0, .25)   # mum yanar
S(shimmer(2400), 10.4, .22); S(hum(.5, 160) * .6, 12.3, .15); S(bloop(820), 12.4, .3); S(bloop(520), 13.0, .3)
S(bloop(700), 14.7, .3)
S(tick(3200, .04), 16.6, .45); S(filt(noise(.12), 'highpass', 3000) * env(int(.12 * SR), .002, .04), 16.61, .3)   # deklanşör + flaş
S(filt(noise(.55), 'bandpass', [2000, 5000]) * adsr(int(.55 * SR), .05, .1) * .6, 16.9, .2)                    # polaroid vızz
S(shimmer(2200), 17.6, .18); S(bloop(900), 19.0, .3); S(whoosh(.7, 400, 2500), 19.6, .25)
S(bloop(500), 22.45, .3); S(hum(.8, 120), 22.45, .12)
for a in (25.6, 25.85, 26.1): S(knock(), a, .55)
S(siren(3.0), 25.5, .09)
S(whoomp(), 28.7, .3); S(bloop(760), 28.85, .35)
S(swish(.3), 30.95, .25); S(pop(380, .2), 31.8, .3); S(bloop(640), 32.2, .3)
for i in range(8): S(bloop(500 + i * 70), 34.7 + i * .15, .12)
S(bloop(980), 35.9, .35); S(bloop(620), 35.1, .25); S(bloop(820), 37.1, .3)
S(bloop(700), 39.3, .3)
for i in range(6): S(tick(2200, .03), 39.7 + i * .1, .1)
S(bloop(560), 40.6, .25); S(riser(1.6, 200, 1400), 42.9, .14); S(bloop(1000), 44.2, .3)
S(whoomp(), 45.75, .28); S(bloop(700), 45.85, .3); S(scrape(.8, 220) * .6, 48.1, .12)
S(shimmer(2800), 51.35, .22); S(whoomp(), 52.9, .25); S(bloop(820), 52.95, .3); S(bloop(620), 54.5, .3)
S(whoosh(.5, 800, 3500, .6), LS - .4, .22)
S(bell(2349, 1.6), LS + .6, .35); S(bell(3136, 1.3), LS + .7, .28); S(pop(900, .12), LS + .72, .45); S(pop(900, .08), LS + .85, .15)
# maskot imza sesleri (tepkiler.json — sahnelerle aynı zamanlar)
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
def w(name, l, r):
    st = np.stack([l, r], 1); st = st / max(1.0, np.abs(st).max() / .95)
    wavfile.write(name, SR, (st * 32767).astype(np.int16))
w('miks.wav', Lc, Rc)
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
