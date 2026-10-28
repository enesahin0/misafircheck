"""#19 Senin enflasyonun kaç — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 67.32
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- müzik: "Market müziği" — hafif funk: slap bas (pluck) + rhodes + clap, 100 bpm, La minör → Do majör;
#            hesap sahnelerinde tik-tak ostinato, finalde parlak ----------
B = 60 / 100
def ep(fs, d): return ek(*[ek(pluck(f, d, .6) * .6, bell(f * 2, d, .25) * .12) for f in fs]) / len(fs)
def clap(): return filt(noise(.1), 'bandpass', [900, 4000]) * env(int(.1 * SR), .002, .07) * .6
def funk(a, b, g=1.0, P=(('A', ['A', 'C', 'E']), ('F', ['F', 'A', 'C']), ('C', ['C', 'E', 'G']), ('G', ['G', 'B', 'D']))):
    t = a; i = 0
    while t < b - .05:
        kok, ch = P[(i // 4) % 4]
        M.add('music', pluck(hz(kok, 2), B * .35, .45), t, .45 * g); M.add('music', pluck(hz(kok, 3), B * .2, .6), t + B * .75, .2 * g)
        if i % 2: M.add('music', ep([hz(n, 4) for n in ch], B * .6), t + B * .5, .25 * g)
        if i % 2 == 0: M.add('music', soft_kick(), t, .35 * g)
        if i % 2: M.add('music', clap(), t, .25 * g)
        M.add('music', filt(noise(.04), 'highpass', 7000) * env(int(.04 * SR), .001, .025), t + B * .5, .12 * g)
        t += B; i += 1
def tiktak(a, b, g=1.0):
    t = a; k = 0
    while t < b: M.add('music', tick(2400 if k % 2 else 1800, .03), t, .12 * g); t += B / 2; k += 1
funk(0, 22.05, .9)
funk(22.05, 35.0, .8); tiktak(35.0, 38.55, 1.0)
funk(38.55, 54.15, .85, P=(('C', ['C', 'E', 'G']), ('A', ['A', 'C', 'E']), ('F', ['F', 'A', 'C']), ('G', ['G', 'B', 'D'])))
funk(54.15, 58.0, .6); tiktak(58.0, 62.55, .9)
funk(62.55, LS, 1.0, P=(('C', ['C', 'E', 'G']), ('F', ['F', 'A', 'C']), ('G', ['G', 'B', 'D']), ('C', ['C', 'E', 'G'])))
M.add('music', reverb(ep([hz(n, 4) for n in ('C', 'E', 'G', 'C')], 2.4), .35), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def kaching():
    o = np.zeros(int(1.0 * SR)); a = bell(2637, .9, .9); b = bell(3520, .8, .9); c = tick(1500, .05) * 2
    o[:len(c)] += c; o[int(.08 * SR):int(.08 * SR) + len(a)] += a; o[int(.16 * SR):int(.16 * SR) + len(b)] += b; return o * .7
def haber(): tt = T(.9); return ek(*[bell(f, .9, .8) * .4 for f in (880, 1175, 1760)])
def tuslar(n=6):
    o = np.zeros(int((n * .12 + .1) * SR))
    for k in range(n): x = tick(1300 + (k % 3) * 200, .03); i0 = int(k * .12 * SR); o[i0:i0 + len(x)] += x
    return o
def kalem(d): return filt(noise(d), 'bandpass', [2000, 6000]) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 7 * T(d)))) * adsr(int(d * SR), .05, .1) * .3
def cizgi(): return ek(whoosh(.3, 800, 2400, .5) * .5, pop(900, .08))
S(haber(), .1, .3); S(pop(700, .14), 2.1, .25); S(pop(820, .14), 5.6, .25)
S(whoosh(.9, 3000, 400, .6), 6.9, .25); S(ek(boom(.6, 80) * .6, hit(.2, 1000) * .5), 7.8, .35); S(ek(bell(1568, .8, .8), pop(900, .12)), 7.1, .25); S(pop(760, .14), 9.6, .22)
S(whoosh(.3, 2500, 800), 12.5, .15)
for a in (12.6, 13.4, 14.2, 15.0, 15.8): S(ek(pop(520, .14), tick(900, .04)), a, .28)
for k in range(5): S(ek(pop(900, .08), tick(2600, .03)), 17.8 + k * .12, .18)
S(whoosh(.3, 800, 2500), 19.2, .15); S(pop(700, .14), 19.3, .25)
S(pop(820, .14), 22.35, .25); S(scrape(.5, 400) * .5, 22.85, .25)
S(pop(700, .14), 25.1, .22); S(cizgi(), 26.8, .25); S(pop(760, .14), 29.0, .22)
S(riser(1.0, 300, 1500) * .4, 31.35, .15); S(pop(880, .14), 32.3, .25); S(riser(1.0, 300, 1500) * .4, 33.05, .15); S(pop(820, .14), 34.0, .25)
S(whoosh(.3, 2500, 800), 35.05, .15)
for k in range(4): S(ek(tuslar(3), pop(600 + k * 80, .08)), 35.3 + k * .35, .2)
S(kaching(), 37.1, .3)
S(pop(700, .14), 38.85, .22); S(ek(scrape(.4, 300) * .4, pop(420, .14)), 39.55, .25); S(cizgi(), 41.85, .25)
S(riser(3.0, 200, 1000) * .4, 46.4, .12); S(pop(820, .14), 49.3, .25)
S(riser(1.2, 200, 1200) * .4, 49.6, .12); S(pop(760, .14), 50.9, .2); S(pop(880, .14), 52.2, .25)
for k in range(5): S(kalem(.4), 54.5 + k * .5, .2)
S(whoosh(.3, 2500, 800), 57.95, .15); S(ek(bell(1568, .8, .8), pop(900, .12)), 58.2, .2); S(ek(bell(2093, .8, .8), pop(900, .12)), 58.8, .2); S(pop(820, .14), 59.6, .25)
for k in range(4): S(pop(600 + k * 90, .12), 60.2 + k * .3, .2)
S(pop(760, .14), 62.9, .25); S(scrape(.4, 200) * .4, 63.9, .2); S(kaching(), 64.9, .3)
S(bell(1568, 1.6), LS + .6, .3); S(bell(2093, 1.3), LS + .7, .25); S(pop(900, .12), LS + .72, .4)
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
