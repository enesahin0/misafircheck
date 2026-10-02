"""#16 Soğan Neden Ağlatır — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 67.16
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- müzik: "Yemek programı" — pizzicato + ksilofon, 118 bpm, Sol majör; hücre/göz detaylarında
#            mikroskobik parıltılı ambiyans + alçak gerilim, laboratuvarda arpej, ipuçlarında neşeli dönüş ----------
B = 60 / 118
def ksilo(f, d=.3): return ek(bell(f, d, .9) * .55, pluck(f, d, .8) * .45)
PROG = (('G', ['G', 'B', 'D']), ('E', ['E', 'G', 'B']), ('C', ['C', 'E', 'G']), ('D', ['D', 'F#', 'A']))
def mutfak(a, b, g=1.0):
    t = a; i = 0
    while t < b - .05:
        kok, ch = PROG[(i // 4) % 4]
        M.add('music', pluck(hz(kok, 2), B * .5, .3), t, .42 * g)
        M.add('music', pluck(hz(ch[i % 3], 3), B * .4, .55), t + B * .5, .2 * g)
        if i % 2 == 0: M.add('music', ksilo(hz(ch[(i // 2) % 3], 5), .25), t + (B * .5 if i % 4 == 2 else 0), .12 * g)
        if i % 2 == 0: M.add('music', soft_kick(), t, .3 * g)
        M.add('music', filt(noise(.04), 'highpass', 7000) * env(int(.04 * SR), .001, .025), t + B * .5, .12 * g)
        t += B; i += 1
def ambiyans(a, b, g=1.0, kok=('G', 'D')):
    M.add('music', reverb(filt(pad([hz(kok[0], 3), hz(kok[1], 4), hz(kok[0], 4) * 1.5], b - a, .5) * adsr(int((b - a) * SR), .6, .8), 'lowpass', 2400), .5), a, .25 * g)
    k = 0
    while a + k < b - .2: M.add('music', bell(hz(('B', 'D', 'G', 'A', 'E')[int(k / .35) % 5], 6), .8, .5) * .5, a + k, .06 * g); k += .35
mutfak(0, 6.9, .9)
ambiyans(6.9, 12.85, 1.0)
t = 12.85                                                        # yırtılma + gaz: gerilim
M.add('music', filt(pad([hz('D', 2), hz('D#', 3)], 9.5, .3) * adsr(int(9.5 * SR), 1.0, 1.0), 'lowpass', 800), 12.85, .22)
while t < 22.35: M.add('music', pluck(hz('D', 3), .2, .5), t, .2); t += B
ambiyans(22.35, 30.3, .9, ('E', 'B'))
mutfak(30.3, 33.9, 1.0)
t = 33.9; i = 0                                                  # laboratuvar: arpej
while t < 42.2: M.add('music', pluck(hz(('G', 'B', 'D', 'F#', 'A', 'D')[i % 6], 4), B * .3, .8), t, .16); M.add('music', pluck(hz('G', 2) if (i // 8) % 2 == 0 else hz('C', 2), B * .3, .3), t, .2 if i % 4 == 0 else 0); t += B / 2; i += 1
mutfak(42.2, 61.9, 1.0)
mutfak(61.9, LS, 1.1)
M.add('music', reverb(ek(*[pluck(hz(n, 3), 2.4, .6) for n in ('G', 'B', 'D', 'G')]), .35), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def kes(): return ek(tick(1800, .03) * 1.5, filt(noise(.08), 'bandpass', [2000, 6000]) * env(int(.08 * SR), .002, .05))
def tak(): return ek(hit(.15, 900) * .6, tick(700, .04))
def burun(): return filt(noise(.4), 'bandpass', [300, 1200]) * adsr(int(.4 * SR), .05, .2) * .5
def hiss(d=1.0): return filt(noise(d), 'bandpass', [2000, 7000]) * adsr(int(d * SR), .2, .5) * .35
def alarm(d=1.2): tt = T(d); f = 900 + 300 * np.sign(np.sin(2 * np.pi * 6 * tt)); return filt(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 'lowpass', 2500) * adsr(len(tt), .02, .1) * .25
def damla(): return ek(pop(1400, .08), bell(2600, .3, .6) * .3)
def kapi(): return ek(scrape(.5, 120) * .5, tick(500, .06))
def buz(): return ek(*[bell(3000 + k * 400, .4, .9) * .3 for k in range(3)])
for k in range(9): S(ek(kes(), tak() * .6), .4 + k * .6, .22)
S(burun(), 2.1, .15); S(pop(700, .14), 3.6, .25)
S(whoosh(.35, 3000, 600), 6.6, .2)
S(whoosh(.3, 2500, 800), 7.5, .15); S(bell(2637, .9, .6) * .5, 7.6, .12)
for k in range(14): S(pop(700 + (k % 5) * 70, .07), 7.7 + k * .05, .1)
S(pop(560, .14), 10.5, .25); S(pop(640, .14), 12.0, .25)
S(ek(tak(), kes()), 13.3, .45); S(whoosh(.3, 2500, 800), 13.9, .15); S(shatter(.6) * .5, 14.0, .25)
for k in range(10): S(ek(pop(900, .06), tick(3000, .02)), 14.7 + k * .1, .1)
S(hiss(3.0), 16.5, .2); S(pop(700, .14), 17.9, .22); S(ek(boom(.6, 90) * .5, bell(1568, .6, .6) * .4), 20.65, .3)
S(whoosh(.3, 2500, 800), 22.5, .15); S(hiss(1.5), 22.6, .15); S(riser(1.0, 400, 2000) * .5, 24.0, .15); S(pop(640, .12), 24.2, .2)
S(alarm(1.4), 26.0, .3); S(pop(720, .12), 26.1, .2)
for k in range(5): S(damla(), 28.3 + k * .35, .2)
S(pop(760, .12), 28.6, .2); S(whoosh(.35, 3000, 600), 30.0, .2)
S(ek(boom(.8, 70) * .6, bell(1760, .8, .7) * .5), 30.5, .35); S(pop(820, .14), 31.5, .25)
S(pop(700, .14), 34.8, .25); S(whoosh(.3, 2500, 800), 36.4, .15)
for k in range(5): S(tick(2400, .02), 36.6 + k * .12, .1)
S(damga(), 37.4, .45); S(whoosh(.3, 800, 2500), 38.7, .15); S(ek(bell(2093, 1.0, .8), bell(2637, .9, .8) * .6), 40.0, .3)
S(pop(560, .14), 42.6, .22); S(kapi(), 44.8, .3); S(whoosh(.5, 600, 2000), 45.2, .15); S(kapi(), 46.4, .3); S(buz(), 45.4, .2)
sayac_tiklari(M, 45.5, 1.7, 10, kazanc=.12); S(pop(760, .14), 47.6, .25)
S(whoosh(.3, 2500, 800), 50.25, .15); S(ek(tak(), scrape(.4, 200) * .5), 50.6, .25); S(kes(), 50.65, .3); S(pop(640, .12), 51.2, .22)
S(pop(760, .14), 53.2, .25)
for k in range(4): S(tick(1500, .03), 53.5 + k * .25, .15)
S(ek(pop(500, .2), bell(1200, .5, .6) * .4), 55.4, .25)
S(pop(700, .14), 57.6, .25); S(munch := ek(*[filt(noise(.07), 'bandpass', [900, 3500]) * env(int(.07 * SR), .002, .05) * .6]), 57.8, .15); S(ek(hiss(.4), tick(1200, .05)), 58.6, .2)
S(ek(pop(300, .2), scrape(.5, 90) * .4), 60.3, .3); S(pop(640, .14), 60.35, .2)
S(whoosh(.35, 3000, 600), 61.6, .2); S(ek(bell(2093, .8, .8), pop(900, .12)), 62.3, .25); S(pop(820, .14), 65.1, .28)
S(bell(1568, 1.6), LS + .6, .3); S(bell(2349, 1.3), LS + .7, .25); S(pop(900, .12), LS + .72, .4)
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
