"""#6 Venüs — özgün müzik + efektler + seslendirme miksi."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 49.5
M = Mix(DUR)

# ---------- seslendirme ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik (skill: ambient sinematik synth — yumuşak pad, kristal arpej, pluck; ~90 bpm, merak dolu) ----------
B = 60 / 90
def kristal(f, d=1.2):
    t = T(d); x = np.sin(2 * np.pi * f * t) * np.exp(-t * 3.5) + .3 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 6) + .12 * np.sin(2 * np.pi * f * 4.02 * t) * np.exp(-t * 10)
    return x * np.minimum(1, t / .003) / 1.4
AKOR = [('D', ['D', 'F#', 'A', 'E']), ('B', ['B', 'D', 'F#', 'A']), ('G', ['G', 'B', 'D', 'F#']), ('A', ['A', 'C#', 'E', 'G#'])]
def bolum(a, b, g=1.0, arp=True, bas=True):
    t = a; i = 0
    while t < b - .3:
        kok, ch = AKOR[(i // 8) % 4]
        if i % 8 == 0:
            d = min(B * 8 + 1.2, b - t + 1.2)
            M.add('music', filt(pad([hz(n, 3) for n in ch], d, .45) * adsr(int(d * SR), 1.2, 1.5), 'lowpass', 1600), t, .32 * g)
            if bas: M.add('music', filt(pad([hz(kok, 2)], d, .2) * adsr(int(d * SR), .8, 1.2), 'lowpass', 300), t, .35 * g)
        if arp and i % 2 == 0: n = ch[(i // 2) % 4]; M.add('music', kristal(hz(n, 5 if (i // 8) % 2 else 4) , 1.4), t, .13 * g)
        t += B / 2; i += 1
bolum(0, 6.3, .8)
bolum(6.3, 22.0, .9)
bolum(22.0, 32.1, .85, arp=False)
bolum(32.1, 40.2, .8)
bolum(40.2, 47.4, 1.0)
M.add('music', kristal(hz('D', 5), 2.5), 47.4, .25); M.add('music', kristal(hz('A', 5), 2.5), 47.5, .18)

# ---------- efektler (skill tablosu: pop-in "bloop", kayma whoosh, büyük giriş whoomp, parlama shimmer, UI tık) ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def bloop(f=700): return pop(f, .16)
def shimmer(f=2600): return bell(f, 1.0, .5) * .7 + bell(f * 1.5, 1.0, .4) * .3
def whoomp(): return boom(1.0, 55) * .7
def boing(f0=180, f1=520, d=.45):
    t = T(d); fr = f0 + (f1 - f0) * (1 - np.exp(-t * 12)) + 40 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 5)
S(whoomp(), .05, .35); S(bloop(520), .15, .4); S(bloop(640), .5, .35)
for i in range(3): S(shimmer(2200 + i * 300), .6 + i * .08, .08)
for i in range(10): S(filt(noise(.08), 'bandpass', [2500, 7000]) * env(int(.08 * SR), .003, .03), .7 + i * .12, .06)
S(whoosh(.5, 400, 2500), 2.8, .25)
S(bloop(600), 4.32, .4); S(bloop(760), 4.92, .4); S(whoosh(.4, 600, 2500), 5.37, .2); S(shimmer(), 5.47, .15); S(bloop(900), 3.47, .3)
S(whoomp(), 6.3, .35); S(riser(4.5, 200, 700), 6.6, .06)
k = 6.65
while k < 11.1: S(tick(3000, .025), k, .07); k += .09 + (k - 6.65) * .01
S(shimmer(2800), 11.1, .25); S(bloop(720), 11.5, .35)
S(whoosh(.6, 300, 2000), 12.5, .25); S(whoomp(), 12.97, .3)
for i in range(18): S(tick(2400, .025), 13.3 + i * .22, .05)
S(bloop(820), 16.0, .45); S(shimmer(3000), 16.05, .2)
S(whoosh(.5, 600, 3000), 17.7, .25); S(whoosh(1.1, 300, 2500, .7), 17.8, .2); S(bloop(900), 18.8, .3); S(shimmer(2600), 19.0, .2)
S(bloop(500), 19.7, .3); S(bloop(620), 20.7, .3)
S(whoosh(.8, 500, 3000), 22.2, .25); S(whoosh(.8, 3000, 500), 22.5, .25); S(bloop(800), 22.9, .4)
S(whoosh(.5, 2000, 400), 23.9, .25); S(riser(1.6, 150, 600), 24.6, .12); S(shimmer(2000), 26.2, .2); S(bloop(600), 25.2, .3)
S(whoosh(.5, 500, 2500), 26.5, .2); S(bloop(650), 26.8, .35); S(bloop(820), 27.2, .3)
for i in range(14): S(filt(noise(.15), 'bandpass', [1500, 6000]) * env(int(.15 * SR), .005, .06), 29.96 + i * .12, .12)
S(shimmer(2800), 31.7, .22)
S(whoomp(), 32.1, .3); S(bloop(500), 32.3, .35); S(bloop(700), 34.5, .45)
S(filt(noise(3.5), 'bandpass', [800, 4000]) * adsr(int(3.5 * SR), .6, .8), 36.6, .12)   # cızırtı
S(riser(1.8, 300, 1400), 36.7, .15); S(bloop(420), 37.1, .35); S(boing(300, 700, .4), 37.1, .2)
S(whoosh(.5, 3000, 400), 40.1, .2); S(bloop(520), 40.45, .35); S(bloop(640), 40.65, .3)
for i in range(7): S(bloop(600 + i * 60), 42.65 + i * .31, .3)
S(shimmer(2600), 45.05, .3); S(shimmer(3400), 45.15, .15)
S(whoosh(.5, 800, 3500, .6), 47.0, .25)
LS = 47.39
S(bell(2349, 1.6), LS + .6, .35); S(bell(3136, 1.3), LS + .7, .28); S(pop(900, .12), LS + .72, .45); S(pop(900, .08), LS + .85, .15)

# ---------- miks ----------
ve = voice_env(voice)
duck = 1 - .62 * np.clip(ve * 2.2, 0, 1)
mus = M.bus['music'] * duck
mus = filt(mus, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-12)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 3.2
bed = mus + sfx
full = voice + bed
# stereo: müzik için hafif Haas genişliği
d = int(.012 * SR)
L = voice + sfx + mus; R = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
def w(name, l, r):
    st = np.stack([l, r], 1); st = st / max(1.0, np.abs(st).max() / .95)
    wavfile.write(name, SR, (st * 32767).astype(np.int16))
w('miks.wav', L, R)
bl, br = sfx + mus, sfx + np.concatenate([np.zeros(d), mus[:-d]])
w('muzik_efekt.wav', bl, br)
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
