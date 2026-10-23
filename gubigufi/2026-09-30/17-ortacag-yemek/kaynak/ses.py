"""#17 Orta Çağ köylü sofrası — özgün müzik + efektler + maskot imza sesleri + seslendirme miksi."""
import sys, json, subprocess
import numpy as np
from scipy import signal
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 71.24
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- müzik: "Köy meydanı" — lavta (pluck) + flüt (kayar sinüs + nefes) + dem (drone) + tabor davulu, Re Dor, 100 bpm;
#            gri girişte kısık ve tek dem, POTTAJ'da renkli açılış, kilise çanı, Kara Ölüm'de ağır, şölende 6/8 jig ----------
B = 60 / 100
def flut(f, d):
    tt = T(d); x = np.sin(2 * np.pi * f * tt * (1 + .004 * np.sin(2 * np.pi * 5 * tt))) + .15 * np.sin(4 * np.pi * f * tt)
    return (x + filt(noise(d), 'bandpass', [f * .9, f * 1.3]) * .08) * adsr(len(tt), .04, .12) * .5
def tabor(): return ek(soft_kick() * .6, filt(noise(.08), 'bandpass', [150, 900]) * env(int(.08 * SR), .002, .06) * .6)
def dem(a, b, kok='D', g=1.0): M.add('music', filt(pad([hz(kok, 2), hz(kok, 3) * 1.5], b - a, .3) * adsr(int((b - a) * SR), .5, .5), 'lowpass', 700), a, .22 * g)
MEL = ['D', 'E', 'F', 'G', 'A', 'G', 'F', 'E', 'D', 'C', 'D', 'A', 'B', 'A', 'G', 'E']
def koy_tema(a, b, g=1.0, flutlu=True):
    dem(a, b, 'D', g); t = a; i = 0
    while t < b - .05:
        M.add('music', pluck(hz(('D', 'A', 'C', 'D')[(i // 4) % 4], 3), B * .8, .5), t, .25 * g)
        M.add('music', pluck(hz(('F', 'E', 'G', 'F')[(i // 4) % 4], 4), B * .5, .6), t + B * .5, .15 * g)
        if flutlu and i % 2 == 0: M.add('music', flut(hz(MEL[(i // 2) % len(MEL)], 5), B * 1.8), t, .13 * g)
        if i % 2 == 0: M.add('music', tabor(), t, .3 * g)
        t += B; i += 1
dem(0, 8.9, 'D', .7)                                            # gri giriş: yalnız dem + seyrek lavta
for k in range(5): M.add('music', pluck(hz(('D', 'A', 'F', 'E', 'D')[k], 3), 1.2, .3), 1.0 + k * 1.5, .18)
koy_tema(8.94, 22.25, 1.0)
koy_tema(22.25, 41.9, .9)
M.add('music', reverb(ek(*[bell(f, 3.5, .8) * .5 for f in (220, 330, 440)]), .5), 42.1, .25)   # kilise çanı
koy_tema(44.5, 54.1, .8, flutlu=False)
dem(54.1, 61.0, 'A', 1.0)                                       # Kara Ölüm: ağır
for k in range(6): M.add('music', pluck(hz(('A', 'G', 'F', 'E', 'D', 'E')[k], 3), 1.4, .25), 55.9 + k * .8, .2)
t = 61.0; i = 0                                                 # 6/8 jig: ücretler arttı → şölen
while t < LS:
    M.add('music', pluck(hz(('D', 'D', 'A', 'D', 'G', 'A')[i % 6], 3 if i % 3 == 0 else 4), B * .4, .6), t, .24)
    if i % 3 == 0: M.add('music', tabor(), t, .32)
    if i % 6 == 0: M.add('music', flut(hz(MEL[(i // 6) % len(MEL)], 5), B * 1.2), t, .14)
    t += B / 1.5; i += 1
dem(61.0, LS, 'D', .8)
M.add('music', reverb(ek(*[pluck(hz(n, 3), 2.4, .5) for n in ('D', 'F', 'A', 'D')]), .35), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def portal(): tt = T(1.2); f = 300 + 900 * tt / 1.2; return ek(np.sin(2 * np.pi * np.cumsum(f) / SR) * adsr(len(tt), .1, .4) * .3, filt(noise(1.2), 'bandpass', [800, 4000]) * adsr(len(tt), .2, .5) * .3)
def cop(): return ek(boom(.4, 90) * .5, filt(noise(.15), 'bandpass', [200, 900]) * env(int(.15 * SR), .002, .1) * .5)
def cip_() : return ek(tick(1800, .03), pop(900, .08))
def fokur(d=1.0):
    o = np.zeros(int(d * SR))
    for k in range(int(d * 7)): p = pop(200 + (k * 37) % 120, .08); i0 = int(k / 7 * SR); o[i0:i0 + len(p)] += p[:max(0, len(o) - i0)]
    return o * .6
def cip_domuz(): tt = T(.35); f = 500 * (1 + .3 * np.sin(2 * np.pi * 18 * tt)); return filt(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 'bandpass', [400, 2000]) * adsr(len(tt), .02, .1) * .3
def tavuk_ses():
    o = np.zeros(int(.7 * SR))
    for k, f in enumerate((900, 1100, 1300)): tt = T(.12); x = filt(np.sign(np.sin(2 * np.pi * f * tt)), 'bandpass', [600, 3000]) * adsr(len(tt), .005, .05) * .25; i0 = int(k * .18 * SR); o[i0:i0 + len(x)] += x
    return o
def cips(): return ek(tick(3000, .03), bell(2600, .3, .6) * .3)
S(portal(), .2, .3); S(whoosh(.6, 2000, 400, .5), .6, .2); S(cop(), 1.25, .35); S(pop(520, .18), 3.0, .25)
S(fokur(2.0), 6.6, .15); S(ek(bell(1568, 1.2, .8), bell(2349, 1.0, .8) * .6), 8.95, .35); S(riser_hedefli(8.3, 8.95), 8.3, .12); S(pop(820, .14), 10.15, .25)
S(pop(700, .12), 12.3, .2); S(pop(760, .12), 13.2, .2); S(whoosh(.3, 2500, 800), 14.6, .15); S(fokur(7.0), 14.8, .12)
for a in (15.0, 15.7, 16.3, 16.9, 17.4, 19.5): S(ek(pop(420, .12), filt(noise(.1), 'bandpass', [300, 1200]) * env(int(.1 * SR), .002, .08) * .4), a + .4, .3)
S(pop(900, .14), 21.1, .25)
for k in range(4): S(pop(600 + k * 80, .12), 22.45 + k * .45, .25)
S(whoosh(.35, 3000, 600), 24.8, .2)
S(pop(700, .12), 25.5, .22); S(ek(filt(noise(.3), 'bandpass', [1500, 5000]) * adsr(int(.3 * SR), .01, .15) * .4, pop(300, .1)), 26.7, .25); S(ek(filt(noise(.8), 'bandpass', [300, 1200]) * adsr(int(.8 * SR), .1, .3) * .3), 28.3, .2); S(pop(760, .12), 28.2, .2)
S(pop(560, .14), 30.4, .22); S(pop(700, .14), 31.5, .22); S(cip_domuz(), 32.5, .3); S(cip_domuz(), 34.2, .25)
S(pop(640, .12), 35.3, .22); S(pop(700, .12), 35.9, .22); S(whoosh(1.0, 300, 1200, .4) * .6, 35.2, .12)
S(tavuk_ses(), 38.0, .22); S(pop(700, .14), 38.3, .25); S(pop(780, .14), 39.3, .25); S(pop(860, .14), 40.3, .25)
S(pop(640, .12), 42.4, .2)
for k in range(10): S(tick(1200, .03), 42.6 + k * .2, .1)
S(pop(760, .14), 43.5, .25); S(whoosh(.3, 2500, 800), 44.85, .15); S(ek(scrape(.5, 140) * .4, tick(600, .05)), 44.9, .25)
for k in range(9): S(pop(1000 + k * 60, .06), 45.0 + k * .06, .1)
S(pop(700, .14), 45.8, .22)
S(pop(560, .14), 48.0, .22)
for k in range(3): S(ek(tick(2400, .04), bell(2800, .3, .7) * .3), 48.1 + k * .1, .15)
for a in (49.4, 51.2, 52.0, 53.0): S(ek(pop(720, .12), cips() * .5), a, .25)
S(pop(640, .14), 54.3, .22); S(reverb(bell(147, 3.0, .6), .5), 55.9, .3); S(pop(500, .16), 55.9, .2); S(pop(600, .14), 57.7, .2)
for k in range(8): S(ek(tick(2400, .03), bell(3136, .3, .7) * .3), 59.7 + k * .1, .15)
S(pop(760, .14), 59.7, .25); S(whoosh(.3, 2500, 800), 60.9, .15); S(kagit := filt(noise(.35), 'bandpass', [900, 4000]) * adsr(int(.35 * SR), .02, .15) * .6, 61.0, .25); S(damga(), 62.6, .45)
S(ek(filt(noise(1.5), 'bandpass', [500, 3000]) * adsr(int(1.5 * SR), .3, .6) * .4), 65.0, .15); S(pop(900, .14), 68.05, .3)
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
