"""#25 Türkiye saatleri — meraklı, hafif piyano arpej + saat tik-takları; geçiş/kadran/damga efektleri; maskot imza sesleri."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 66.04
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
def piyano(f, d=2.0): return reverb(ek(pluck(f, d, .3), pluck(f * 2, d * .6, .2) * .22), .3)
# Re majör merak arpeji, 78 bpm; şafak (yumuşak) → karar/boylam (biraz gerilim) → takas (açılım)
B = 60 / 78
AK = [('D', 'F#', 'A'), ('B', 'D', 'F#'), ('G', 'B', 'D'), ('A', 'C#', 'E')]
def bolum(a, b, g=1.0, akorlar=AK, oktav=4):
    t = a; k = 0
    while t < b - .1:
        ch = akorlar[(k // 4) % len(akorlar)]
        M.add('music', piyano(hz(ch[k % 3], oktav), 2.2), t, .22 * g)
        if k % 4 == 0: M.add('music', filt(pad([hz(ch[0], 2), hz(ch[2], 3)], B * 4.2, .3) * adsr(int(B * 4.2 * SR), .6, 1.0), 'lowpass', 900), t, .2 * g)
        t += B; k += 1
bolum(0, 30.9, .9)
bolum(30.9, 43.8, 1.0, [('E', 'G', 'B'), ('C', 'E', 'G'), ('A', 'C', 'E'), ('B', 'D#', 'F#')])           # boylam: hafif minör gerilim
M.add('music', riser_hedefli(54.0, 55.7, 300, 3000), 54.0, .18)
bolum(43.8, LS, 1.1)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 2.6, .5) for n in ('D', 'F#', 'A')]), .4), LS + .1, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def tiktak(a, b, ara=1.0, g=.12):
    t = a; k = 0
    while t < b: S(tick(1700 if k % 2 == 0 else 1350, .04), t, g); t += ara / 2; k += 1
def damga(): return ek(boom(.4, 90) * .7, hit(.18, 700) * .5)
def kus(): return ek(*[pop(2600 + 400 * np.sin(i), .05) * .25 for i in range(3)])
S(kus(), .6, .15); S(pop(700, .14), .3, .22); S(steps(2.6, 2.4, 700), 4.0, .1)
S(whoosh(.4, 600, 1800, .4), 7.0, .2); S(pop(700, .14), 7.4, .22); S(ek(bell(1760, .8, .8) * .5, pop(900, .12)), 8.3, .3)
S(pop(760, .14), 9.3, .22); S(damga(), 10.3, .3)
tiktak(7.2, 11.6, 1.0, .1)
S(pop(700, .14), 11.85, .22); S(swish(.3), 13.1, .3); S(ek(hit(.12, 1500) * .4, pop(800, .12)), 14.0, .22)
S(whoosh(.5, 500, 2200, .5), 15.95, .25); S(scrape(.6, 400) * .4, 16.15, .2)
S(damga(), 18.9, .5)
S(whoosh(.4, 1500, 500), 21.2, .15)
S(ek(bell(1976, .8, .8) * .4, pop(1000, .12)), 22.4, .3); S(whoosh(.6, 300, 1200, .4), 22.5, .12)
S(pop(760, .14), 24.4, .2)
S(whoosh(.8, 300, 1500, .4), 26.1, .2); S(bell(1319, 1.2, .6) * .4, 26.4, .2)
S(ek(boom(.5, 70) * .5, hit(.15, 900) * .4), 29.75, .35)
S(whoosh(.3, 2500, 800), 30.8, .15); S(pop(760, .14), 31.4, .22); S(tick(2000, .05), 32.6, .2)
S(whoosh(.5, 600, 2000, .5), 33.9, .2); S(pop(700, .12), 35.1, .2); S(ek(pop(900, .12), tick(2500, .04)), 35.6, .25)
S(whoosh(.4, 800, 300), 37.3, .15); S(pop(760, .14), 37.6, .22)
S(pop(760, .14), 39.6, .22)
tiktak(41.5, 42.8, .5, .16); S(ek(bell(1047, 1.8, .8), bell(1568, 1.5, .5) * .5), 42.85, .4)   # 13:00
S(pop(700, .14), 44.2, .2); S(whoosh(.9, 300, 1400, .4), 44.3, .15); S(whoosh(.9, 300, 1400, .4), 48.0, .15)
S(pop(700, .14), 50.8, .22); S(whoosh(.5, 400, 1600, .4), 51.1, .15)
S(whoosh(.6, 600, 2200, .5), 53.5, .25); S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 54.4, .3)
S(rewind(1.8), 56.0, .3); tiktak(55.8, 58.4, .5, .14)
S(pop(760, .14), 58.8, .22); S(ek(bell(880, 1.2, .8), hit(.12, 900) * .3), 60.6, .3)
S(pop(700, .14), 62.4, .2)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .3)
S(ek(bell(1319, 1.4, .8), pop(900, .12)), LS + .3, .3)
ve = voice_env(voice)
duck = 1 - .6 * np.clip(ve * 2.2, 0, 1)
mus = filt(M.bus['music'] * duck, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-13)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 3.0
d = int(.012 * SR)
Lc = voice + sfx + mus; Rc = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
st = np.stack([Lc, Rc], 1); st = st / max(1.0, np.abs(st).max() / .95)
wavfile.write('miks.wav', SR, (st * 32767).astype(np.int16))
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
