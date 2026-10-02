"""#12 Çapa etkisi — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy import signal
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 58.12
M = Mix(LS + 2.2)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik: "yarışma programı" funk — slap benzeri bas + sentez brass vuruşları + el çırpma (Fa majör, 110 bpm);
#            deniz bölümünde sadece pad + dalga; mahkemede bas + tık; finalde tam enerji ----------
B = 60 / 110
def bas(f, d=.22): t = T(d); x = signal.sawtooth(2 * np.pi * f * t) * .6 + np.sin(2 * np.pi * f * t); return filt(x, 'lowpass', 900) * env(len(t), .004, d * .45)
def brass(fs, d=.25):
    t = T(d); x = sum(signal.sawtooth(2 * np.pi * f * t * (1 + .003 * k)) for k, f in enumerate(fs)) / len(fs)
    return sweep_filter(x, 3500, 900, 'lowpass', .7) * adsr(len(t), .01, .1)
def clap(): x = filt(noise(.12), 'bandpass', [900, 3500]); return x * env(len(x), .001, .04)
AK = [('F', ['F', 'A', 'C']), ('D', ['D', 'F', 'A']), ('A#', ['A#', 'D', 'F']), ('C', ['C', 'E', 'G'])]
BASRIT = [0, None, 0, 7, None, 0, 10, 12]
def funk(a, b, g=1.0, brs=True, clp=True):
    t = a; i = 0
    while t < b - .05:
        kok, ch = AK[(i // 16) % 4]; r = BASRIT[i % 8]
        if r is not None: M.add('music', bas(hz(kok, 2) * 2 ** (r / 12)), t, .5 * g)
        if brs and i % 16 in (0, 6, 10): M.add('music', brass([hz(n, 4) for n in ch]), t, .12 * g)
        if clp and i % 8 == 4: M.add('music', clap(), t, .12 * g)
        if i % 2 == 0: M.add('music', filt(noise(.03), 'highpass', 7000) * env(int(.03 * SR), .001, .01), t, .04 * g)
        t += B / 2; i += 1
funk(0, 19.0, 1.0)
funk(19.0, 31.0, .75, brs=False)
M.add('music', filt(pad([hz(n, 3) for n in ('F', 'A', 'C', 'E')], 8.8, .25) * adsr(int(8.8 * SR), 1.2, 1.5), 'lowpass', 1000), 31.0, .3)
funk(39.5, 49.6, .6, brs=False, clp=False)
funk(49.6, LS, 1.0)
M.add('music', brass([hz(n, 4) for n in ('F', 'A', 'C')], .8), LS - .05, .2)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def bloop(f=700): return pop(f, .16)
def whoomp(): return boom(1.0, 55) * .7
def shimmer(f=2600): return bell(f, 1.0, .5) * .7 + bell(f * 1.5, 1.0, .4) * .3
def cark_tik(a, b):   # yavaşlayan çark tıkırtısı
    t = a; dt = .045
    while t < b: S(tick(2600, .02), t, .18); dt *= 1.09; t += dt
def splash(): x = filt(noise(.8), 'bandpass', [300, 3000]); return x * adsr(len(x), .01, .5) * .8 + boom(.8, 60) * .4
def ka_ching():
    o = np.zeros(int(1.0 * SR)); a = bell(2637, .9, .7) * .6; b = bell(3520, .8, .6) * .4; c = filt(noise(.15), 'highpass', 4000) * env(int(.15 * SR), .001, .05) * .5
    o[:len(a)] += a; o[:len(b)] += b; o[:len(c)] += c; return o
def knock(): return filt(hit(.25, 400), 'lowpass', 900) + boom(.25, 90) * .5
def dalga(d): x = filt(noise(d), 'lowpass', 700); t = T(d); return x * (.5 + .5 * np.sin(2 * np.pi * .35 * t) ** 2) * adsr(len(t), 1.0, 1.0) * .6
S(whoosh(.8, 400, 2500, .5), 0.0, .2); S(bloop(620), .05, .25)
for a in (.35, .75, 1.15): S(maskot_ses('gufi', 'zipla') * .5, a, .25)
cark_tik(.3, 3.55); S(bell(1760, 1.2, .7), 3.62, .35); S(shimmer(2800), 3.7, .2)
S(bloop(700), 7.5, .3); S(pop(560, .14), 9.6, .3); S(pop(640, .14), 10.6, .3); S(whoosh(.5, 3000, 400), 12.7, .2)
cark_tik(13.2, 16.15); cark_tik(13.25, 17.75); S(bell(1568, 1.0, .6), 16.2, .3); S(bell(2093, 1.0, .6), 17.8, .3); S(pop(700, .14), 16.3, .3); S(pop(900, .14), 17.9, .3)
S(pop(560, .14), 19.05, .3)
for i in range(12): S(pop(900 + (i % 4) * 80, .06), 19.6 + i * .23, .1)
S(bloop(820), 20.8, .3)
S(pop(600, .12), 25.7, .25); S(riser(1.1, 200, 900), 25.9, .12); S(bell(1318, .8, .5), 27.0, .2)
S(pop(760, .12), 28.8, .25); S(riser(1.2, 200, 1300), 29.0, .14); S(bell(1760, .8, .5), 30.2, .25)
S(dalga(8.5), 31.0, .25); S(bloop(700), 31.2, .3); S(pop(640, .14), 33.2, .3); S(shimmer(2200), 34.0, .2); S(splash(), 34.3, .35)
S(scrape(.6, 160) * .6, 36.8, .15); S(scrape(.6, 150) * .6, 38.0, .15)
S(pop(560, .14), 39.6, .25); S(bloop(760), 39.9, .25); S(whoomp(), 41.7, .25)
for i in range(9): S(tick(1200 + (i % 3) * 300, .03), 43.4 + i * .13, .2)
S(knock() * .6, 44.6, .35); S(pop(700, .12), 45.5, .25); S(riser(.8, 200, 800), 45.6, .1); S(pop(900, .12), 47.1, .25); S(riser(1.0, 200, 1100), 47.2, .12)
S(knock(), 48.95, .4); S(knock(), 49.2, .4)
S(pop(640, .14), 49.7, .3); S(filt(noise(.5), 'bandpass', [1800, 5000]) * adsr(int(.5 * SR), .03, .1) * .5, 51.9, .25); S(ka_ching(), 52.6, .35)
S(bloop(820), 54.7, .25)
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
