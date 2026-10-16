"""#13 Mona Lisa hırsızlığı — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy import signal
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 59.95
M = Mix(LS + 2.2)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik: "Paris 1911" — akordeon (musette) valsi, 3/4, Re minör, 132 bpm (gizemli-zarif);
#            hırsızlıkta yalnız pizzicato gerilim; Floransa'da mandolin tremolosu; finalde parlak akor ----------
B = 60 / 132
def akordeon(fs, d):
    t = T(d); x = sum(signal.sawtooth(2 * np.pi * f * t * (1 + .004 * np.sin(2 * np.pi * 5.5 * t))) + signal.sawtooth(2 * np.pi * f * 1.006 * t) for f in fs) / (2 * len(fs))
    return filt(x, 'bandpass', [300, 2600]) * adsr(len(t), .03, .08)
def vals(a, b, g=1.0, prog=(('D', ['D', 'F', 'A']), ('A', ['C#', 'E', 'A']), ('G', ['G', 'A#', 'D']), ('D', ['D', 'F', 'A']))):
    t = a; i = 0
    while t < b - .1:
        kok, ch = prog[(i // 3) % len(prog)]
        if i % 3 == 0: M.add('music', pluck(hz(kok, 2), .5, .3) * .8, t, .4 * g)
        else: M.add('music', akordeon([hz(n, 4) for n in ch], B * .8), t, .12 * g)
        if i % 6 == 0: M.add('music', akordeon([hz(ch[(i // 6) % 3], 5)], B * 2.5), t + B * .5, .08 * g)
        t += B; i += 1
vals(0, 20.9, .9)
t = 20.9                                           # hırsızlık: pizzicato gerilim
while t < 31.4:
    M.add('music', pluck(hz('D', 3) if int((t - 20.9) / B) % 4 else hz('A', 2), .3, .3), t, .3); t += B
M.add('music', filt(pad([hz('D', 3), hz('G#', 3)], 10.5, .2) * adsr(int(10.5 * SR), 2, 1), 'lowpass', 700), 20.9, .12)
vals(31.4, 47.6, .8)
t = 47.6                                           # Floransa: mandolin tremolosu
for nota, d in (('A', 1.4), ('F', 1.4), ('D', 1.4), ('E', 1.0)):
    k = 0
    while k < d: M.add('music', pluck(hz(nota, 4), .12, .6) * .6, t + k, .12); k += .07
    t += d
M.add('music', reverb(filt(pad([hz(n, 3) for n in ('D', 'F#', 'A', 'D')] + [hz('F#', 4)], 4.0, .5) * adsr(int(4 * SR), .2, 1.2), 'lowpass', 2600), .3), 52.7, .25)
vals(52.7 + 3.75, LS, 1.0, prog=(('D', ['D', 'F#', 'A']), ('A', ['C#', 'E', 'A'])))
M.add('music', reverb(akordeon([hz(n, 4) for n in ('D', 'F#', 'A')], 1.6), .3), LS - .05, .16)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def bloop(f=700): return pop(f, .16)
def whoomp(): return boom(1.0, 55) * .7
def shimmer(f=2600): return bell(f, 1.0, .5) * .7 + bell(f * 1.5, 1.0, .4) * .3
def foto():
    o = filt(noise(.08), 'highpass', 3500) * env(int(.08 * SR), .002, .03) * .6; a = tick(3400, .03); o[:len(a)] += a; return o
def kagit(): return filt(noise(.35), 'bandpass', [900, 4000]) * adsr(int(.35 * SR), .02, .15) * .6
def mirilti(d): x = filt(noise(d), 'bandpass', [200, 900]); tt = T(d); return x * (.6 + .4 * np.sin(2 * np.pi * 2.3 * tt) ** 2) * adsr(len(tt), .8, .8) * .5
def metal(): o = np.zeros(int(.8 * SR)); a = bell(3136, .5, .9); b = bell(4186, .4, .9); o[:len(a)] += a; o[int(.06 * SR):int(.06 * SR) + len(b)] += b; return o * .6
S(damga(), .3, .45); S(whoosh(.8, 400, 2500, .5), .4, .15)
S(whoosh(.35, 3000, 600), 4.1, .25); S(shimmer(1800), 4.25, .2)
for i in range(6): S(foto(), 6.5 + i * .25, .25)
S(whoosh(.4, 600, 3500, .6), 8.55, .22)
S(steps(6.5, 2.2, 700) * .5, 9.2, .1); S(bloop(820), 10.2, .25)
S(pop(560, .14), 16.1, .3); S(bloop(700), 17.05, .25); S(bloop(880), 19.35, .3); S(whoomp(), 20.5, .25)
S(hit(.2, 1200) * .6, 21.2, .25); S(bloop(640), 22.8, .25)
S(steps(3.0, 3.0, 600) * .6, 21.9, .18); S(scrape(1.4, 260) * .5, 25.7, .15); S(swish(.3), 27.7, .25)
S(steps(2.0, 5.0, 650) * .7, 29.2, .2); S(scrape(.8, 120) * .5, 30.9, .12)
S(kagit(), 32.1, .3)
for a in (34.5, 34.9, 35.3): S(kagit(), a, .3); S(pop(300, .1), a + .3, .2)
for i in range(22): S(tick(2200 + (i % 3) * 300, .02), 34.75 + i * .065, .09)
S(whoosh(.4, 3000, 500), 36.7, .2); S(mirilti(5.4), 37.1, .12)
for a in (38.5, 38.95, 39.4, 39.85): S(maskot_ses('gufi', 'zipla') * .5, a, .22)
S(scrape(.9, 180) * .6, 43.45, .15); S(damga(), 44.75, .35); sayac_tiklari(M, 44.75, 1.4, 6, kazanc=.14)
S(pop(560, .14), 47.6, .25)
for i in range(12): S(tick(1500, .02), 48.35 + i * .15, .08)
S(bloop(900), 50.15, .3); S(metal(), 50.85, .3)
S(shimmer(2200), 52.75, .3); S(riser_hedefli(52.0, 52.7), 52.0, .12)
for i in range(10): S(foto(), 52.9 + i * .33 + (i % 3) * .05, .2)
S(sidechain(filt(noise(3.4), 'bandpass', [900, 4000]) * adsr(int(3.4 * SR), .4, .8), [53.2 - 53.0 + k * .15 for k in range(20)], .7, .05) * .4, 53.0, .12)
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
