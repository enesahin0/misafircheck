"""#18 Kral seni kıskanırdı — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 73.09
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- müzik: saray = lavta + boru fanfarı (Re Dor, ağırbaşlı); bugün = neşeli modern pop (elektrik piyano + ritim, Re majör);
#            iki dünya aynı tempoda (104 bpm) → karşılaştırma boyunca ikisi dönüşümlü; finalde ikisi birleşir ----------
B = 60 / 104
def boru(fs, d): tt = T(d); x = sum(np.sin(2 * np.pi * f * tt) + .5 * np.sin(4 * np.pi * f * tt) + .3 * np.sin(6 * np.pi * f * tt) for f in fs) / len(fs); return filt(x, 'lowpass', 2500) * adsr(len(tt), .04, .15) * .4
def ep(fs, d): return ek(*[ek(pluck(f, d, .6) * .6, bell(f * 2, d, .25) * .12) for f in fs]) / len(fs)
def saray_m(a, b, g=1.0):
    t = a; i = 0
    while t < b - .05:
        M.add('music', pluck(hz(('D', 'A', 'C', 'D')[(i // 4) % 4], 2), B, .4), t, .3 * g)
        M.add('music', pluck(hz(('F', 'E', 'G', 'F')[(i // 4) % 4], 4), B * .5, .6), t + B * .5, .15 * g)
        if i % 8 == 0: M.add('music', soft_kick(), t, .25 * g)
        t += B; i += 1
def bugun_m(a, b, g=1.0):
    t = a; i = 0; P = (('D', ['D', 'F#', 'A']), ('B', ['B', 'D', 'F#']), ('G', ['G', 'B', 'D']), ('A', ['A', 'C#', 'E']))
    while t < b - .05:
        kok, ch = P[(i // 4) % 4]
        M.add('music', pluck(hz(kok, 2), B * .8, .35), t, .4 * g)
        if i % 2: M.add('music', ep([hz(n, 4) for n in ch], B * .8), t, .3 * g)
        if i % 2 == 0: M.add('music', soft_kick(), t, .35 * g)
        M.add('music', filt(noise(.04), 'highpass', 7000) * env(int(.04 * SR), .001, .025), t + B * .5, .15 * g)
        t += B; i += 1
M.add('music', boru([hz('D', 4), hz('A', 4)], 1.2), 0.1, .25); M.add('music', boru([hz('D', 4), hz('F', 4), hz('A', 4)], 1.8), 1.4, .25)
saray_m(0, 6.6, 1.0)
saray_m(6.6, 11.5, .6); bugun_m(7.2, 11.5, .5)
for a, b in ((11.5, 19.85), (19.85, 24.6), (24.6, 29.1), (38.1, 48.15), (48.15, 56.4), (56.4, 62.3)):
    mid = a + (b - a) * .45; saray_m(a, mid, .8); bugun_m(mid, b, .8)
saray_m(29.1, 34.0, .5); bugun_m(34.0, 38.1, 1.0)
bugun_m(62.3, LS, 1.0); M.add('music', boru([hz('D', 4), hz('F#', 4), hz('A', 4)], 2.0), 66.7, .22)
M.add('music', reverb(ep([hz(n, 4) for n in ('D', 'F#', 'A', 'D')], 2.4), .35), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def sikke(): return ek(bell(2637, .5, .9) * .5, tick(3000, .03))
def kilic(): return filt(noise(.12), 'highpass', 3000) * env(int(.12 * SR), .002, .08) * .6
def nal(d):
    o = np.zeros(int(d * SR)); k = 0
    while k < d - .05:
        for j, dt in enumerate((0, .08, .2, .28)): x = ek(tick(500, .03) * 2, filt(noise(.03), 'bandpass', [300, 1200]) * .4); i0 = int((k + dt) * SR); o[i0:i0 + len(x)] += x[:max(0, len(o) - i0)]
        k += .45
    return o * .6
def cagri(): tt = T(1.2); return ek(*[np.sin(2 * np.pi * f * tt) * adsr(len(tt), .02, .1) * .15 for f in (440, 480)]) * (np.sin(2 * np.pi * 2 * tt) > 0)
def klik(): return ek(tick(1500, .03) * 2, pop(900, .05) * .5)
def su(d): return filt(noise(d), 'bandpass', [1500, 6000]) * adsr(int(d * SR), .1, .3) * .4
for k in range(6): S(sikke(), 4.3 + k * .12, .15)
S(pop(760, .14), 3.8, .25)
S(whoosh(.8, 300, 2500, .5), 6.8, .2); S(pop(820, .14), 9.9, .25)
S(kilic(), 13.0, .35); S(pop(420, .18), 13.2, .2); S(pop(700, .14), 13.7, .22); S(pop(640, .14), 13.9, .25)
S(whoosh(.3, 2500, 800), 16.4, .15); for_ = [S(pop(700 + k * 60, .1), 16.7 + k * .15, .2) for k in range(3)]; S(pop(900, .14), 17.3, .25)
S(scrape(.5, 300) * .5, 21.05, .25); S(ek(scrape(.6, 90) * .4, tick(700, .05)), 22.3, .25); S(pop(640, .14), 22.15, .2); S(pop(760, .14), 22.45, .2)
S(pop(700, .14), 26.2, .25); S(bell(2637, .6, .8) * .4, 26.3, .15)
S(ek(filt(noise(2.0), 'bandpass', [200, 900]) * adsr(int(2.0 * SR), .5, .8) * .4), 29.3, .15)
for a in (29.6, 30.7, 32.4): S(pop(640, .12), a, .2)
S(whoosh(.3, 2500, 800), 34.0, .15); S(klik(), 34.5, .5); S(ek(bell(1760, .8, .7), bell(2637, .6, .7) * .5), 35.05, .25); S(su(3.0), 35.2, .2)
for k, a in enumerate((38.3, 39.2, 39.9, 40.7, 41.8)): S(pop(600 + k * 80, .12), a, .25)
S(whoosh(.3, 2500, 800), 43.0, .15); S(whoosh(1.2, 400, 1500, .4), 43.2, .12)
for k in range(4): S(pop(700 + k * 70, .1), 43.5 + k * .2, .18)
S(ek(sikke(), pop(500, .15)), 45.75, .3); S(pop(760, .14), 46.65, .25)
S(nal(3.8), 48.35, .3); sayac_tiklari(M, 48.75, 3.0, 14, kazanc=.1)
S(cagri(), 52.3, .15); S(pop(820, .14), 52.6, .25); S(pop(700, .14), 53.15, .22)
S(ek(*[bell(f, .8, .8) * .3 for f in (1047, 1319, 1568)]), 57.4, .2); S(whoosh(.5, 600, 2000), 58.4, .15); S(pop(820, .14), 59.7, .25)
S(whoosh(.8, 600, 2400, .5), 63.1, .2); S(whoosh(.6, 800, 2600), 65.8, .2); S(ek(bell(1568, 1.0, .8), bell(2349, .8, .8) * .6), 66.8, .3); S(pop(700, .14), 65.7, .25); S(pop(820, .14), 65.9, .25)
S(pop(900, .14), 70.5, .28)
S(bell(1175, 1.6), LS + .6, .3); S(bell(1760, 1.3), LS + .7, .25); S(pop(900, .12), LS + .72, .4)
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
