"""#7 Işık saçıyorsun — özgün müzik + efektler + seslendirme miksi."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 51.8
M = Mix(DUR)

# ---------- seslendirme ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik (skill: ambient synth — havadar pad, camsı arpej, mikro sahnede yumuşak nabız; La minör/Do majör, 80 bpm) ----------
B = 60 / 80
def kristal(f, d=1.4):
    t = T(d); x = np.sin(2 * np.pi * f * t) * np.exp(-t * 3) + .35 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 7) + .1 * np.sin(2 * np.pi * f * 5.03 * t) * np.exp(-t * 12)
    return x * np.minimum(1, t / .003) / 1.45
def whoomp(): return boom(1.0, 55) * .7
def shimmer(f=2600): return bell(f, 1.0, .5) * .7 + bell(f * 1.5, 1.0, .4) * .3
def bloop(f=700): return pop(f, .16)
AKOR = [('A', ['A', 'C', 'E', 'B']), ('F', ['F', 'A', 'C', 'G']), ('C', ['C', 'E', 'G', 'D']), ('G', ['G', 'B', 'D', 'A'])]
def bolum(a, b, g=1.0, arp=True, bas=True, nabiz=False):
    t = a; i = 0
    while t < b - .3:
        kok, ch = AKOR[(i // 8) % 4]
        if i % 8 == 0:
            d = min(B * 8 + 1.2, b - t + 1.2)
            M.add('music', filt(pad([hz(n, 3) for n in ch], d, .35) * adsr(int(d * SR), 1.4, 1.6), 'lowpass', 1400), t, .32 * g)
            if bas: M.add('music', filt(pad([hz(kok, 2)], d, .2) * adsr(int(d * SR), .9, 1.2), 'lowpass', 280), t, .33 * g)
        if arp and i % 2 == 1: n = ch[(i // 2) % 4]; M.add('music', kristal(hz(n, 5), 1.6), t, .11 * g)
        if nabiz and i % 2 == 0: M.add('music', soft_kick() * .8, t, .4 * g)
        t += B / 2; i += 1
bolum(0, 11.1, .75, arp=False)
bolum(11.1, 25.0, .85)
bolum(25.0, 35.1, .95, nabiz=True)
bolum(35.1, 43.9, .85)
bolum(43.9, 49.7, 1.0)
M.add('music', kristal(hz('C', 5), 2.6), 49.7, .25); M.add('music', kristal(hz('G', 5), 2.6), 49.8, .18)

# ---------- efektler (skill ses tablosu) ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
S(shimmer(2200), .05, .2); S(whoosh(.5, 3000, 400), 2.1, .2); S(bloop(820), 2.05, .35); S(tick(2600, .05), 2.2, .25)
S(whoomp(), 3.7, .3); S(bloop(600), 3.95, .35); S(bloop(760), 5.6, .35); S(bloop(520), 5.8, .3)
S(hit(.3, 2500), 9.9, .35); S(filt(noise(.6), 'lowpass', 900) * env(int(.6 * SR), .01, .2), 10.3, .2)   # kapı + ışık sönüyor
S(tick(1200, .06), 10.4, .3)
S(whoomp(), 11.2, .3); S(bloop(640), 12.1, .35)
for a in (12.34, 14.54, 15.44): S(tick(3200, .04), a, .4); S(filt(noise(.1), 'highpass', 3000) * env(int(.1 * SR), .002, .03), a + .01, .2)   # deklanşör
for i in range(3): S(bloop(700 + i * 90), 14.4 + i * .45, .25)
S(riser(1.2, 200, 900), 16.3, .12); S(shimmer(2800), 17.4, .3); S(bloop(420), 18.2, .35)
S(bloop(560), 20.3, .35); S(riser(1.0, 300, 1200), 21.8, .12); S(shimmer(3200), 23.1, .25); S(bloop(900), 22.4, .3)
S(bloop(700), 25.3, .35); S(riser(2.2, 150, 1800), 27.3, .3); S(whoosh(1.5, 300, 4000, .8), 27.6, .3); S(whoomp(), 29.45, .35)
for j in range(9): S(shimmer(2400 + (j % 3) * 500), 25.07 + 5.9 + j * .38, .12)
S(shimmer(2600), 35.4, .3); S(bloop(620), 35.6, .3)
S(bloop(700), 37.6, .3)
for i in range(16): S(tick(2000, .03), 39.9 + i * .21, .08)
S(shimmer(3000), 42.9, .3); S(bloop(820), 43.5, .35)
S(bloop(600), 44.0, .3); S(bloop(720), 44.2, .3); S(bloop(900), 46.3, .4); S(shimmer(2600), 48.5, .3); S(bell(1760, 1.2, .5), 48.5, .2)
S(whoosh(.5, 800, 3500, .6), 49.3, .25)
LS = 49.71
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
