"""#23 Kapıdaki çarpı — HASSAS: yavaş, alçak minör müzik (piyano/bağlama havası), sade efektler; maskot imza sesi YOK."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 66.93
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
def piyano(f, d=2.4): return reverb(ek(pluck(f, d, .3), pluck(f * 2, d * .6, .2) * .25), .35)
# Re minör, 66 bpm; yavaş arpej + alçak drone; finalde Fa majör'e (umut) açılır
B = 60 / 66
AK = [('D', 'F', 'A'), ('A#', 'D', 'F'), ('G', 'A#', 'D'), ('A', 'C#', 'E')]
def bolum(a, b, g=1.0, akorlar=AK):
    t = a; k = 0
    while t < b - .1:
        ch = akorlar[(k // 4) % len(akorlar)]
        M.add('music', piyano(hz(ch[k % 3], 4), 2.6), t, .22 * g)
        if k % 4 == 0: M.add('music', filt(pad([hz(ch[0], 2), hz(ch[2], 3)], B * 4.2, .3) * adsr(int(B * 4.2 * SR), .6, 1.0), 'lowpass', 900), t, .2 * g)
        t += B; k += 1
bolum(0, 13.6, .9)
M.add('music', filt(pad([hz('D', 2), hz('A', 2)], 10.4, .2) * adsr(int(10.4 * SR), 1.0, 1.5), 'lowpass', 600), 13.6, .25)   # 1978: rüzgârlı, seyrek
bolum(15.0, 23.8, .7)
M.add('music', filt(pad([hz('D', 2), hz('D#', 2)], 7.6, .2) * adsr(int(7.6 * SR), 1.0, 1.5), 'lowpass', 500), 23.8, .25)    # gece: sadece alçak drone
bolum(31.3, 55.2, .85)
bolum(55.2, LS, 1.0, [('D', 'F', 'A'), ('A#', 'D', 'F'), ('F', 'A', 'C'), ('C', 'E', 'G')])
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.2, .3) for n in ('F', 'A', 'C')]), .45), LS + .1, .45)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def firca_ses(d=1.2): tt = T(d); return filt(noise(d), 'bandpass', [400, 2500]) * (np.abs(np.sin(2 * np.pi * 1.6 * tt)) ** 2) * adsr(len(tt), .05, .2) * .5
def ruzgar(d): tt = T(d); return filt(noise(d), 'bandpass', [200, 900]) * (.5 + .5 * np.sin(2 * np.pi * .2 * tt) ** 2) * adsr(len(tt), 1.0, 1.0) * .4
def kapi_gicirti(): return filt(sweep_filter(noise(.7), 600, 1400), 'bandpass', [500, 2000]) * adsr(int(.7 * SR), .05, .2) * .4
S(firca_ses(.8), .1, .45); S(firca_ses(.7), .8, .4)
S(kapi_gicirti(), 3.4, .3)
S(whoosh(.4, 1500, 500, .3), 8.55, .1)
S(ruzgar(10.2), 13.6, .25); S(whoosh(.4, 1500, 500, .3), 20.3, .1); S(firca_ses(1.0), 20.6, .3)
S(ruzgar(7.5), 23.8, .2); S(crackle_fire(5.4) * .4, 25.75, .2)
S(boom(.8, 50) * .4, 31.4, .2)
for at in (37.0, 38.0, 38.9, 39.8): S(tick(900, .05), at, .12)
S(whoosh(.5, 300, 900, .3), 43.4, .1); S(whoosh(.5, 300, 900, .3), 45.0, .1); S(whoosh(.5, 300, 900, .3), 48.0, .1)
S(boom(.6, 60) * .3, 50.8, .2)
S(whoosh(.4, 1500, 500, .3), 61.5, .1); S(firca_ses(1.3), 61.7, .5)
S(kapi_gicirti(), 63.7, .25); S(steps(1.5, 3.0, 700), 63.8, .12)
S(bell(1319, 1.6, .5), LS + .5, .2)
ve = voice_env(voice)
duck = 1 - .55 * np.clip(ve * 2.2, 0, 1)
mus = filt(M.bus['music'] * duck, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-15)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 2.4
d = int(.012 * SR)
Lc = voice + sfx + mus; Rc = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
st = np.stack([Lc, Rc], 1); st = st / max(1.0, np.abs(st).max() / .95)
wavfile.write('miks.wav', SR, (st * 32767).astype(np.int16))
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
