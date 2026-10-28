"""#5 Dünyayı Kurtaran Adam — özgün müzik + efektler + seslendirme miksi."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 58.2
M = Mix(DUR)

# ---------- seslendirme ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik (80'ler retro synth, La minör, 112 bpm — özgün) ----------
AE = 55.95; LS = AE + .1
B = 60 / 112
def saw(f, d, cut=2500, dec=6.0):
    t = T(d); x = sum(np.sin(2 * np.pi * f * m * t) / m for m in range(1, 9))
    x = filt(x, 'lowpass', cut) * np.exp(-t * dec) * np.minimum(1, t / .004)
    return x / 1.7
def kick(): t = T(.35); return np.sin(2 * np.pi * np.cumsum(50 * (1 + 3 * np.exp(-t * 30))) / SR) * np.exp(-t * 9)
def snare(): return filt(noise(.22), 'bandpass', [1200, 6000]) * env(int(.22 * SR), .002, .07) * .8 + np.sin(2 * np.pi * 190 * T(.22)) * np.exp(-T(.22) * 30) * .4
def hat(): return filt(noise(.05), 'highpass', 7000) * env(int(.05 * SR), .001, .015)
CH = [('A', ['A', 'C', 'E']), ('F', ['F', 'A', 'C']), ('C', ['C', 'E', 'G']), ('G', ['G', 'B', 'D'])]
def groove(a, b, g=1.0, drums=True, arp=True, bass=True, pad_=True):
    t = a; i = 0
    while t < b:
        root, ch = CH[(i // 16) % 4]
        if drums:
            if i % 4 == 0: M.add('music', kick(), t, .7 * g)
            if i % 8 == 4: M.add('music', snare(), t, .45 * g)
            if i % 2 == 1: M.add('music', hat(), t, .18 * g)
        if bass and i % 2 == 0: M.add('music', saw(hz(root, 2) * (2 if i % 4 == 2 else 1), B * .45, 900, 8), t, .45 * g)
        if arp: n = ch[i % 3] if (i // 3) % 2 == 0 else ch[2 - i % 3]; M.add('music', saw(hz(n, 4 + (i % 6 == 5)), B * .45, 3200, 9), t, .16 * g)
        if pad_ and i % 16 == 0: M.add('music', filt(pad([hz(n, 3) for n in ch], B * 16 + .4, .5) * adsr(int((B * 16 + .4) * SR), .3, .5), 'lowpass', 1800), t, .22 * g)
        t += B / 2; i += 1
groove(.0, 7.7, .7, drums=False, bass=False)
groove(7.76, 11.0, .75, drums=False)
groove(11.1, 22.3, .85)
groove(22.4, 28.9, .7, arp=False)
groove(28.98, 36.4, 1.0)
groove(36.5, 40.7, .9)
groove(40.85, 49.3, .6, drums=False, bass=False)
groove(49.35, 54.4, .75, drums=False)
groove(54.5, AE + .2, .95)
M.add('music', saw(hz('A', 3), 1.5, 2000, 2), LS, .3); M.add('music', saw(hz('E', 4), 1.5, 2000, 2), LS, .2)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def clack(): return hit(.18, 5000) * 1.0
def proj_loop(d): t = T(d); c = (np.sin(2 * np.pi * 18 * t) > .9).astype(float); return filt(c * noise(d), 'bandpass', [900, 5000]) * .8 + filt(noise(d), 'lowpass', 250) * .3
S(clack(), .26, .8); S(boom(.6, 80), .27, .3)
S(filt(noise(1.2), 'lowpass', 600) * adsr(int(1.2 * SR), .2, .5), 1.7, .1); S(scrape(.6, 2500), 1.8, .1)
S(pop(400, .2), 4.7, .3)
for i in range(7): S(bell(2800 + (i % 3) * 400, .25, .3), 5.02 + i * .075, .10)   # kavanozda tıngırdayan para
S(filt(noise(.3), 'bandpass', [2000, 7000]) * env(int(.3 * SR), .005, .1), 5.6, .15)   # cam kapak
for k_, g_ in ((5.95, .3), (6.12, .16), (6.24, .08)): S(bell(3400, .5, .3), k_, g_)   # para yere düşer
S(pop(250, .25), 6.2, .3); S(scrape(.4, 800), 6.8, .2)
S(tick(900, .08), 7.8, .5); S(proj_loop(3.0), 7.85, .15)
S(whoosh(.7, 400, 2500), 8.55, .3); S(thunk_ := hit(.4, 1200), 9.85, .6); S(boom(.6, 70), 9.85, .35)
S(proj_loop(11.0), 11.1, .1)
for i in range(10): S(filt(noise(.18), 'bandpass', [1500, 4000]) * env(int(.18 * SR), .005, .06), 13.5 + i * .9, .12)   # lazer
for i in range(6): S(boom(.5, 90), 14.0 + i * 1.3, .12)
S(rumble(2.3, 70), 17.55, .25)
S(filt(noise(.2), 'bandpass', [300, 3000]) * env(int(.2 * SR), .002, .08), 22.4, .3)       # plak iğnesi
S(hit(.4, 1200), 23.45, .5)
for i in range(6): S(swish(.12), 25.0 + i * .5, .2)
S(filt(noise(.4), 'bandpass', [1500, 5000]) * adsr(int(.4 * SR), .02, .1), 28.0, .2)        # bant
S(steps(.6, 8, 500), 29.8, .25); S(hit(.3, 800), 30.55, .6); S(filt(noise(.8), 'lowpass', 1500) * env(int(.8 * SR), .01, .3), 30.57, .5)   # köpük POFF
S(pop(180, .5), 31.7, .6); S(whoosh(1.4, 300, 2500, .4), 31.75, .4)                          # BOİNG
S(bell(1760, 1.4, .6), 34.05, .25); S(bell(2640, 1.0, .4), 34.1, .15)
for i in range(14): S(filt(noise(.1), 'bandpass', [2000, 6000]) * env(int(.1 * SR), .005, .04), 36.6 + i * .1, .12)   # biletler
k = 37.0
while k < 39.0: S(filt(noise(.05), 'bandpass', [1500, 5000]) * env(int(.05 * SR), .002, .02), k, .12); k += .035   # gülme/alkış
for i in range(5): S(filt(noise(.06), 'highpass', 3000) * env(int(.06 * SR), .002, .02), 39.47 + i * .08, .25)    # neon cızırtı
S(hum(1.0, 120), 39.5, .12)
S(filt(noise(8.3), 'lowpass', 400) * adsr(int(8.3 * SR), 1.0, 1.0), 40.85, .15)             # depo
for i in range(8): S(tick(1400, .04), 41.0 + i * .8, .1)
S(bell(1320, 1.4, .4), 46.8, .25); S(whoosh(.6, 500, 2000), 46.85, .2)
S(bell(1760, 2.0, .3), 49.4, .15)
S(scrape(.8, 900), 52.2, .2); S(tick(900, .08), 54.55, .5); S(proj_loop(1.4), 54.6, .15); S(clack(), 54.95, .6)
S(pop(700, .15), 55.05, .3); S(bell(2640, 1.0, .5), 55.1, .2)
S(whoosh(.45, 800, 4000, .7), LS, .25)
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
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-11)
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
