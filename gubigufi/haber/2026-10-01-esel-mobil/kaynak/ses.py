"""GubiGufi Haber #1 — haber jeneriği + bülten altlığı (nabız synth) + TV geçiş efektleri + seslendirme (2,0 sn gecikmeli)."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
OFS, LS = 2.0, 67.2
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); o0 = int(OFS * SR); n = min(len(v), M.n - o0); voice[o0:o0 + n] = v[:n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
def saw(f, d): tt = T(d); return filt(2 * ((f * tt) % 1) - 1, 'lowpass', 2200)
def stab(fs, d=.5): return ek(*[saw(f, d) for f in fs]) * adsr(int(d * SR), .005, .35) * .25
# jenerik: yükselen süpürme + dramatik akor vuruşları
M.add('music', riser_hedefli(0, 1.0, 200, 3000), 0, .25)
for k, at in enumerate([1.0, 1.25, 1.5]): M.add('music', ek(stab([hz('D', 3), hz('A', 3), hz('D', 4), hz('F', 4)], .6), boom(.5, 55) * .6), at, .45 - k * .05)
M.add('music', reverb(stab([hz('D', 3), hz('A', 3), hz('D', 4), hz('F#', 4)], 1.4), .4), 1.75, .4)
# bülten altlığı: 110 bpm nabız (sekizlik bas + hafif tik), stüdyo/saha boyunca
B = 60 / 110
def altlik(a, b, g=1.0, kok='D'):
    t = a; k = 0
    while t < b - .05:
        f = hz(kok, 2) * (1.5 if (k // 8) % 4 == 3 else 1)
        M.add('music', saw(f, B * .45) * adsr(int(B * .45 * SR), .005, .2) * .5, t, .3 * g)
        if k % 2 == 0: M.add('music', tick(3000, .03), t, .06 * g)
        if k % 8 == 0: M.add('music', filt(pad([hz(kok, 3), hz('A', 3), hz('F', 4)], B * 4, .5), 'lowpass', 1500) * adsr(int(B * 4 * SR), .3, .6), t, .14 * g)
        t += B / 2; k += 1
altlik(2.0, 22.0, .9); altlik(22.0, 47.0, 1.0); altlik(47.0, 62.2, 1.1, 'E'); altlik(62.2, LS, .8)
M.add('music', reverb(stab([hz('D', 3), hz('A', 3), hz('D', 4), hz('F#', 4)], 1.6), .4), LS + .1, .35)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def parazit(d=.5): tt = T(d); return filt(noise(d), 'highpass', 1500) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 23 * tt))) * adsr(len(tt), .01, .1) * .5
def sinyal(): return ek(*[tick(1600 + i * 400, .05) for i in range(3)])
S(whoosh(.8, 300, 3000, .6), .1, .3)
S(whoosh(.4, 2000, 600), 4.6, .15); S(pop(700, .14), 4.65, .2)                     # alt bant
S(whoosh(.3, 2500, 800), 9.15, .15); S(ek(scrape(.3, 600) * .3, pop(500, .14)), 9.6, .2)   # gazete
S(whoosh(.3, 2500, 800), 12.85, .12)
S(whoosh(1.1, 400, 2400, .5), 14.9, .2); S(parazit(.7), 16.05, .4); S(sinyal(), 16.8, .25)   # bağlantı
S(whoosh(.4, 2000, 600), 17.1, .15)
S(parazit(.4), 21.8, .3); S(ek(boom(.3, 120) * .4, hit(.15, 900) * .3), 23.4, .3); S(pop(800, .14), 24.0, .25)
S(swish(.4), 29.2, .25); S(ek(boom(.5, 70) * .6, hit(.2, 1200) * .4), 30.1, .35)
S(parazit(.4), 32.5, .3); S(whoosh(.4, 2000, 600), 32.9, .15)
S(parazit(.4), 35.2, .3)
for at in (38.85, 41.02, 43.45): S(ek(pop(700, .14), tick(2000, .05)), at, .3); S(whoosh(.5, 300, 1500, .4), at - .05, .12)
S(parazit(.4), 46.8, .3); S(whoosh(.4, 2000, 600), 47.1, .15); S(whoosh(.3, 2500, 800), 48.55, .15)
S(hum(4.6, 110) * .4, 48.6, .2); [S(tick(1400, .03), 48.7 + k * .12, .08) for k in range(38)]
S(pop(760, .14), 52.0, .2)
S(parazit(.4), 53.2, .3); S(whoosh(.4, 2000, 600), 53.5, .15); S(parazit(.4), 56.2, .3)
S(ek(swish(.25), hit(.15, 1400) * .3), 58.6, .3); S(ek(boom(.4, 80) * .4, bell(1568, .8, .8) * .4), 59.8, .3)
S(parazit(.5), 62.0, .35); S(ek(pop(900, .14), bell(1760, .6, .8) * .3), 62.6, .3)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .3)
ve = voice_env(voice)
duck = 1 - .6 * np.clip(ve * 2.2, 0, 1)
mus = filt(M.bus['music'] * duck, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-12)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 3.2
d = int(.012 * SR)
Lc = voice + sfx + mus; Rc = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
st = np.stack([Lc, Rc], 1); st = st / max(1.0, np.abs(st).max() / .95)
wavfile.write('miks.wav', SR, (st * 32767).astype(np.int16))
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
