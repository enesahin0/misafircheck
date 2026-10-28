"""#24 Fırlayan kitapçık (2001 krizi) — gergin, düşük sentezli müzik (nabız), efektler (kitapçık, kapı, flaş, borsa, para, tik) + maskot imza sesleri (endişe tonunda)."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 86.05
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
# gergin altlık: Mi minör drone + nabız (gerilim ilerledikçe hızlanır); bilim/toparlama kısmında yumuşar
def drone(fs, d, g=1.0): return filt(pad(fs, d, .4), 'lowpass', 800) * adsr(int(d * SR), .8, 1.2) * g
def nabiz(a, b, bpm0, bpm1, g=1.0):
    t = a
    while t < b - .05:
        bpm = bpm0 + (bpm1 - bpm0) * (t - a) / (b - a); B = 60 / bpm
        M.add('music', soft_kick(.28), t, .4 * g); M.add('music', soft_kick(.22), t + B * .28, .22 * g)
        t += B
M.add('music', drone([hz('E', 2), hz('B', 2), hz('G', 3)], 21.7, .8), 0, .3)
nabiz(0, 21.7, 70, 84, .7)
M.add('music', drone([hz('E', 2), hz('F', 2)], 16.0, .8), 21.7, .32)
nabiz(21.7, 51.25, 84, 124, 1.0)
M.add('music', riser_hedefli(41.0, 42.8, 200, 3200), 41.0, .22)
M.add('music', riser_hedefli(48.0, 50.6, 300, 5000), 48.0, .26)
M.add('music', ek(boom(.6, 52) * .7, hit(.2, 900) * .4), 50.62, .4)               # 7500 patlaması
M.add('music', drone([hz('E', 2), hz('B', 2), hz('D#', 3)], 8.7, .8), 51.25, .26)
nabiz(51.25, 68.1, 92, 132, .9)
M.add('music', ek(boom(.8, 48) * .8, hit(.25, 700) * .4), 66.91, .45)              # 940 bin
M.add('music', drone([hz('E', 2), hz('G', 2), hz('B', 2)], 4.5, .7), 68.1, .24)
M.add('music', filt(pad([hz('E', 3), hz('G', 3), hz('B', 3)], 10, .3) * adsr(int(10 * SR), 1.2, 2.0), 'lowpass', 1000), 72.6, .26)  # belirsizlik: sis
M.add('music', reverb(ek(*[pluck(hz(n, 4), 2.4, .5) for n in ('E', 'G', 'B')]), .4), 82.5, .3)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def flas(): return ek(filt(noise(.12), 'bandpass', [2000, 7000]) * env(int(.12 * SR), .001, .06) * .7, tick(3000, .04))
def kapi_kapan(): return ek(boom(.6, 70) * .9, filt(noise(.5), 'lowpass', 400) * adsr(int(.5 * SR), .02, .3) * .4)
def kagit(): return filt(noise(.35), 'bandpass', [2500, 7500]) * adsr(int(.35 * SR), .02, .2) * .35
def para_tik(): return ek(tick(2400, .05), bell(2637, .4, .6) * .15)
S(whoosh(.5, 400, 2400, .5), .1, .25)
for k in range(10): S(tick(1500 + k * 90, .03), 5.6 + k * .27, .1)                    # %7500 sayacı
S(pop(700, .14), 3.65, .2); S(whoosh(.4, 600, 200, .4), 9.0, .2)
S(whoosh(1.0, 300, 900, .3), 10.5, .12)
S(boom(.5, 60) * .5, 14.7, .3); S(kapi_kapan(), 20.5, .5)                              # kapılar
S(boom(.5, 55) * .4, 21.9, .25)
S(whoosh(.5, 800, 2600, .5), 24.8, .3); S(ek(hit(.2, 1200) * .6, kagit()), 25.65, .5)  # kitapçık düşer
for k in range(8): S(flas(), 27.9 + k * .5 + (k % 2) * .13, .3)                        # flaşlar
S(ek(boom(.5, 60) * .5, hit(.2, 1500) * .4), 32.2, .3)
S(swish(.4), 32.5, .2); S(kagit(), 32.7, .3)
S(ek(boom(.4, 80) * .6, scrape(.5, 120) * .5), 36.2, .35)                              # terazi: ağır taraf iner
S(ek(boom(.5, 70) * .6, rumble(1.2, 80) * .4), 38.2, .35)                              # borsa çöküyor
for k in range(12): S(tick(900 - k * 30, .04), 38.4 + k * .17, .1)
S(whoosh(.8, 300, 2600, .4), 40.9, .2)
for k in range(8): S(ek(tick(1800, .04), pop(900 - k * 50, .1) * .6), 41.1 + k * .22, .15)   # dolarlar uçar
for at in (45.7, 48.6): S(ek(pop(600, .14), hit(.12, 800) * .3), at, .25)
S(flas(), 50.7, .35); S(shatter(.6) * .5, 50.65, .25)
S(para_tik(), 51.8, .3)
S(whoosh(.5, 400, 1600, .4), 53.9, .15); S(pop(900, .14), 54.4, .22)
for k in range(10): S(ek(tick(2500, .03), bell(2200 + k * 70, .3, .5) * .12), 54.8 + k * .13, .22)   # +20 diskleri
S(ek(hit(.2, 1100) * .5, pop(1100, .1) * .4), 57.8, .3)
S(swish(.4), 60.35, .15); S(whoosh(.4, 2000, 600), 61.4, .12)
for k in range(10): S(tick(2000, .03), 64.6 + k * .12, .1)
for k in range(14): S(tick(1400 + k * 100, .03), 66.7 + k * .08, .16)                  # tabela dönüyor
S(ek(boom(.6, 48) * .6, bell(1109, .8, .5) * .3), 66.95, .4)
S(rumble(2.5, 70) * .5, 70.8, .2)                                                      # para eriyor
S(whoosh(.3, 2000, 700), 70.9, .12)
S(whoosh(.5, 300, 900, .3), 73.0, .12); S(hit(.2, 900) * .4, 74.1, .25)               # çarpı
S(rumble(2.0, 60) * .5, 79.4, .3); S(ek(boom(.6, 50) * .5, hit(.2, 1000) * .3), 80.5, .35)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .28)
S(ek(bell(1319, 1.4, .8), pop(900, .12)), LS + .3, .3)
ve = voice_env(voice)
duck = 1 - .6 * np.clip(ve * 2.2, 0, 1)
mus = filt(M.bus['music'] * duck, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-13)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 2.8
d = int(.012 * SR)
Lc = voice + sfx + mus; Rc = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
st = np.stack([Lc, Rc], 1); st = st / max(1.0, np.abs(st).max() / .95)
wavfile.write('miks.wav', SR, (st * 32767).astype(np.int16))
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
