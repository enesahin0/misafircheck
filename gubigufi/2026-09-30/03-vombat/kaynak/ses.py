"""#3 Vombat — özgün müzik + efektler + seslendirme miksi."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 60.95
M = Mix(DUR)

# ---------- seslendirme ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik (F majör pentatonik, 100 bpm, neşeli) ----------
BEAT = 60 / 100
def marimba(f, d=.6):
    t = T(d); x = np.sin(2 * np.pi * f * t) * np.exp(-t * 7) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30) + .15 * np.sin(2 * np.pi * f * 10 * t) * np.exp(-t * 60)
    return x * np.minimum(1, t / .002) / 1.4
def boing(f0=180, f1=520, d=.45):
    t = T(d); fr = f0 + (f1 - f0) * (1 - np.exp(-t * 12)) + 40 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 5)
def shaker(d=.08):
    return filt(noise(d), 'highpass', 6000) * env(int(d * SR), .005, .03)
def bassnote(f, d=.5):
    t = T(d); return np.sin(2 * np.pi * f * t) * np.exp(-t * 5) + .3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 9)
SC = [hz('F', 4), hz('G', 4), hz('A', 4), hz('C', 5), hz('D', 5), hz('F', 5), hz('G', 5)]
CH = [('F', [0, 2, 3]), ('D', [4, 0, 2]), ('A#', [5, 1, 3]), ('C', [3, 6, 1])]
def groove(a, b, g=1.0, mel=True):
    t = a; i = 0; R = np.random.default_rng(3)
    while t < b:
        root = CH[(i // 8) % 4][0]
        if i % 4 == 0: M.add('music', bassnote(hz(root, 2), BEAT * 1.5), t, .55 * g)
        if i % 4 == 2: M.add('music', bassnote(hz(root, 2) * 1.5, BEAT), t, .35 * g)
        M.add('music', shaker(), t + BEAT / 2, .12 * g); M.add('music', shaker(.05), t, .06 * g)
        if mel and (i % 2 == 0 or R.random() < .35):
            idx = CH[(i // 8) % 4][1][(i // 2) % 3]; M.add('music', marimba(SC[idx] * (1 if R.random() < .8 else 2)), t + (BEAT / 2 if i % 3 == 2 else 0), .30 * g)
        t += BEAT; i += 1
groove(.9, 12.1, .8)
groove(12.1, 16.2, .55, False)             # röntgen: sade
groove(16.2, 30.8, .6)
groove(30.8, 38.4, .7)
groove(38.5, 47.9, .75)
groove(47.9, 58.8, .95)
M.add('music', marimba(hz('F', 5), 1.2), 58.6, .4); M.add('music', marimba(hz('C', 5), 1.2), 58.6, .3)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
S(whoosh(.8, 400, 3000, .6), .1, .2); S(boing(120, 400), 1.85, .45); S(pop(300, .2), 1.86, .4)
S(tick(1400), 3.6, .25); S(swish(.3), 2.95, .2)
S(whoosh(.35, 1200, 4000), 4.9, .3); S(np.sin(2 * np.pi * 1000 * T(.5)) * adsr(int(.5 * SR), .01, .05), 5.05, .12)   # sansür bip
S(whoosh(.5, 3000, 300), 6.27, .35); S(boing(250, 700, .5), 6.35, .5)
S(filt(noise(.6), 'bandpass', [300, 2000]) * adsr(int(.6 * SR), .05, .2) * (1 + np.sin(np.arange(int(.6 * SR)) / SR * 2 * np.pi * 18)), 6.9, .25)   # çalı hışırtısı
S(boing(150, 350, .6), 7.3, .35); S(pop(700, .12), 7.9, .3); S(bell(2640, .6, .3), 8.0, .12)
for i in range(12): S(pop(500 + i * 20, .1), 9.0 + (i + .5) / 12 * 2.7, .3)
S(steps(2.6, 8, 400), 9.05, .2)
S(whoosh(.6, 800, 3000), 12.1, .25); S(hum(3.5, 180), 12.4, .07); S(riser(.8, 300, 900), 14.4, .15); S(boing(400, 900, .4), 15.0, .3)
S(whoosh(.6, 300, 2000), 16.1, .25)
S(filt(noise(2.2), 'bandpass', [200, 900]) * adsr(int(2.2 * SR), .2, .3), 17.2, .15)      # balon kayar
S(riser(1.9, 200, 1400), 19.5, .3); S(filt(noise(1.9), 'bandpass', [1500, 5000]) * np.linspace(0, 1, int(1.9 * SR)) ** 2, 19.5, .12)  # şişme gıcırtısı
for i in range(8): S(tick(2800, .03), 19.7 + i * .2, .12)
S(bell(2640, 1.3), 21.98, .3); S(bell(3520, 1.0, .5), 22.06, .15)
S(swish(.4), 23.5, .2)
for i in range(8): S(pop(600 + (i % 2) * 300, .08), 25.17 + i * .07, .18)
S(whoosh(.5, 500, 2500), 27.1, .22); S(riser(.7, 300, 800), 28.15, .2); S(boing(300, 600, .4), 28.9, .3); S(riser(.8, 300, 1400), 29.2, .25); S(boing(250, 800, .45), 29.95, .35)
S(whoosh(.5, 400, 2500), 30.7, .22)
for i in range(6): S(filt(noise(.3), 'lowpass', 500) * env(int(.3 * SR), .05, .15), 30.9 + i * .9, .12)   # yavaş sıkışma
for i in range(12): S(pop(900, .06), 32.4 + i * .14, .1)                                                  # hızlı
S(filt(noise(2.8), 'lowpass', 400) * adsr(int(2.8 * SR), .3, .3) * (1 + .5 * np.sin(np.arange(int(2.8 * SR)) / SR * 2 * np.pi * 3)), 34.5, .2)  # yoğurma
S(pop(1200, .12), 37.4, .6); S(boing(300, 900, .4), 37.45, .4); S(bell(2640, .8, .4), 37.5, .2)
S(boing(500, 250, .4), 38.52, .35)
S(stamp_ := hit(.3, 1500), 40.2, .35); S(steps(1.2, 6, 500), 40.1, .2)
S(whoosh(.35, 2000, 500), 43.84, .3); S(pop(250, .2), 44.05, .45); S(boing(200, 350, .3), 44.1, .25)
S(pop(900, .1), 44.95, .3); S(swish(.25), 44.95, .2)
S(pop(300, .15), 45.8, .35)
S(filt(noise(1.2), 'lowpass', 300) * adsr(int(1.2 * SR), .1, .2) * (1 + np.sin(np.arange(int(1.2 * SR)) / SR * 2 * np.pi * 9)), 46.44, .3)   # yuvarlanma
S(whoosh(.6, 2000, 200, .3), 47.1, .3); S(boing(700, 200, .5), 47.3, .25)
S(boing(200, 600, .5), 48.0, .35); S(pop(700, .15), 48.8, .3)
S(pop(800, .12), 49.0, .25); S(pop(600, .12), 50.3, .25)
S(bell(1760, 1.2, .6), 52.3, .3); S(boing(300, 800, .4), 52.25, .3)
S(filt(noise(.15), 'bandpass', [800, 4000]) * env(int(.15 * SR), .002, .05), 52.2, .6)                  # konfeti patlaması
k = 52.25
while k < 53.6: S(filt(noise(.05), 'bandpass', [1500, 5000]) * env(int(.05 * SR), .002, .02), k, .15); k += .03   # alkış
S(hit(.3, 1500), 52.85, .3)
S(whoosh(.5, 400, 2500), 53.8, .22)
for i in range(16): S(hit(.15, 800), 54.2 + i * .28, .08)                                                  # makine
S(filt(noise(4.5), 'lowpass', 200) * adsr(int(4.5 * SR), .3, .5), 54.0, .15)
for i in range(6): S(pop(700, .08), 55.0 + i * .8, .15)
S(whoosh(1.2, 300, 3000, .6), 57.2, .3); S(boing(200, 700, .5), 58.3, .3)
S(whoosh(.45, 800, 4000, .7), LS := 58.9, .25)
S(bell(2349, 1.6), LS + .41, .4); S(bell(3136, 1.3), LS + .58, .32)
S(pop(900, .12), LS + .765, .5); S(pop(900, .08), LS + .89, .18); S(pop(900, .06), LS + .98, .08)

# ---------- miks ----------
ve = voice_env(voice)
duck = 1 - .62 * np.clip(ve * 2.2, 0, 1)
mus = M.bus['music'] * duck
mus = filt(mus, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-10)
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
