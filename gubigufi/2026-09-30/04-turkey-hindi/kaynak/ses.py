"""#4 Turkey/Hindi — özgün müzik + efektler + seslendirme miksi."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 58.4
M = Mix(DUR)

# ---------- seslendirme ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik (G majör, 3/4 yolculuk valsi, pizzicato + akordeon) ----------
BEAT = 60 / 138
def pizz(f, d=.35):
    t = T(d); x = sum(a * np.sin(2 * np.pi * f * m * t) for m, a in ((1, 1), (2, .5), (3, .25), (4, .12))) * np.exp(-t * 11)
    return x * np.minimum(1, t / .003) / 1.8
def accordion(freqs, d):
    t = T(d); x = np.zeros(len(t))
    for f in freqs:
        for det in (-.07, .07):
            ff = f * 2 ** (det / 12) * (1 + .003 * np.sin(2 * np.pi * 5.5 * t))
            x += sum(np.sin(2 * np.pi * ff * m * t) / m ** 1.2 for m in (1, 2, 3, 4, 5))
    return filt(x, 'lowpass', 2500) * adsr(len(t), .08, .15) / (np.abs(x).max() + 1e-9)
def triangle_ding(d=.8):
    t = T(d); return (np.sin(2 * np.pi * 3520 * t) + .5 * np.sin(2 * np.pi * 5100 * t)) * np.exp(-t * 5) / 1.5
PR = [('G', ['G', 'B', 'D']), ('C', ['C', 'E', 'G']), ('D', ['D', 'F#', 'A']), ('G', ['G', 'B', 'D']), ('E', ['E', 'G', 'B']), ('C', ['C', 'E', 'G']), ('A', ['A', 'C', 'E']), ('D', ['D', 'F#', 'A'])]
MEL = [('D', 5), ('B', 4), ('G', 4), ('A', 4), ('C', 5), ('E', 5), ('D', 5), ('F#', 4), ('A', 4), ('G', 4), ('B', 4), ('D', 5), ('E', 5), ('G', 5), ('E', 5), ('C', 5), ('E', 5), ('G', 4), ('A', 4), ('C', 5), ('E', 5), ('F#', 5), ('D', 5), ('A', 4)]
def waltz(a, b, g=1.0, acc=True, mel=True):
    t = a; bar = 0
    while t < b:
        root, ch = PR[bar % 8]
        M.add('music', pizz(hz(root, 2), .5), t, .6 * g)
        for k in (1, 2): M.add('music', pizz(hz(ch[1], 3), .3), t + k * BEAT, .28 * g); M.add('music', pizz(hz(ch[2], 3), .3), t + k * BEAT, .22 * g)
        if acc: M.add('music', accordion([hz(n, 4) for n in ch], BEAT * 3), t, .13 * g)
        if mel:
            for k in range(3): n = MEL[(bar * 3 + k) % len(MEL)]; M.add('music', pizz(hz(*n), .4), t + k * BEAT, .30 * g)
        t += BEAT * 3; bar += 1
waltz(.3, 7.8, .8, acc=False)
waltz(8.2, 18.9, .9)
waltz(19.0, 26.1, .8, mel=False)
waltz(26.2, 37.0, .9)
waltz(37.0, 41.5, 1.0, acc=False)
waltz(41.5, 49.0, .75, mel=False)
waltz(49.1, 56.2, .95)
M.add('music', accordion([hz('G', 4), hz('B', 4), hz('D', 5)], 1.6), 56.2, .2)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def paper(d=.25): return sweep_filter(noise(d), 5000, 1500, 'bandpass', .6) * adsr(int(d * SR), .01, .1)
def thunk(): return hit(.5, 900) * .8 + boom(.5, 90) * .4
def chirp(f0=2400, f1=3600, d=.09): t = T(d); return np.sin(2 * np.pi * np.cumsum(f0 + (f1 - f0) * t / d) / SR) * adsr(len(t), .005, .03)
def gavel(): return hit(.25, 2500) + .6 * np.pad(hit(.2, 2500), (int(.12 * SR), 0))[:int(.25 * SR)]
S(pop(500, .2), 0.05, .35); S(chirp(), .3, .2); S(chirp(2600, 3900), .45, .15)
S(pop(800, .12), .2, .25); S(pop(800, .12), 2.68, .25)
S(swish(.3), 3.03, .3); S(swish(.3), 4.8, .3)
S(whoosh(.4, 3000, 300), 5.69, .3); S(pop(250, .25), 5.95, .45); S(tick(1500), 5.75, .2)
S(pop(900, .1), 6.75, .2); S(whoosh(.8, 300, 2500), 6.9, .35); S(paper(.3), 7.2, .3); S(paper(.35), 7.95, .35)
S(tick(1200, .05), 8.3, .2)
S(steps(3.5, 6, 1600), 8.5, .12); S(steps(2.5, 6, 1600), 12.3, .12); S(steps(.9, 6, 1600), 15.4, .12)
S(pop(400, .2), 14.1, .3)
S(thunk(), 16.45, .8); S(paper(.2), 16.4, .3); S(triangle_ding(), 17.9, .18)
S(filt(noise(7), 'lowpass', 600) * adsr(int(7 * SR), 1.0, 1.0), 19.0, .12)   # deniz
S(whoosh(1.5, 200, 1500, .6), 19.1, .25); S(triangle_ding(), 21.7, .15)
S(swish(.25), 23.4, .25); S(whoosh(1.2, 600, 3000, .5), 23.5, .25); S(pop(300, .18), 24.85, .5); S(chirp(3000, 2000, .12), 25.0, .2)
S(filt(noise(10.5), 'lowpass', 700) * adsr(int(10.5 * SR), .6, 1.0), 26.2, .18)   # dalgalar
S(paper(.3), 28.35, .3); S(scrape(.3, 2500), 30.6, .2); S(thunk(), 31.45, .75)
S(whoosh(.4, 3000, 300), 32.52, .25); S(pop(350, .2), 32.85, .4)
S(thunk(), 34.72, .75); S(triangle_ding(), 35.9, .15)
S(paper(.35), 37.0, .4); S(thunk(), 38.52, .7); S(paper(.35), 39.4, .4); S(thunk(), 40.45, .7)
for i in range(18): S(swish(.15), 41.6 + i * .2, .06)
S(boing(260, 180, .6) if 'boing' in dir() else pop(200, .3), 46.4, .3)
for i in range(4): S(chirp(1800 + i * 200, 2600, .1), 46.5 + i * .14, .12)
S(thunk(), 46.45, .4); S(triangle_ding(), 47.45, .15)
S(gavel(), 49.2, .55)
S(paper(.2), 50.05, .25)
S(swish(.3), 54.3, .3); S(hit(.4, 1500), 54.95, .45)
S(whoosh(.35, 2000, 400), 55.35, .25); S(thunk(), 55.55, .8); S(bell(2640, 1.0, .5), 55.62, .25)
S(chirp(2600, 3800, .08), 55.85, .15)
S(whoosh(.45, 800, 4000, .7), LS := 56.3, .25)
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
