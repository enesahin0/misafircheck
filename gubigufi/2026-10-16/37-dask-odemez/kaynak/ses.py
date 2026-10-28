"""#37 DASK ödemez — sakin-ciddi bilgi tonu: melodisiz pad yatağı (Am → Do majör), kurallarda hafif nabız; efektler KANAL SESLERİ (sfx_lib ROL); maskot imza sesleri düşük (-10 dB)."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *
from sfx_lib import Y

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 56.1
M = Mix(58.4)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def pd(fs, a, d, g=.2, lp=1100): M.add('music', filt(pad(fs, d, .4), 'lowpass', lp) * adsr(int(d * SR), 1.0, 1.2), a, g)
pd([hz('A', 2), hz('E', 3), hz('C', 3)], 0, 16.1, .18, 900)
pd([hz('F', 2), hz('C', 3), hz('A', 3)], 15.9, 7.2, .18, 1000)
pd([hz('D', 2), hz('A', 2), hz('F', 3)], 22.9, 6.0, .18, 950)
pd([hz('C', 3), hz('G', 3), hz('E', 4)], 28.6, 6.4, .2, 1300)
pd([hz('A', 2), hz('E', 3), hz('C', 4)], 34.8, 15.4, .18, 1100)
pd([hz('C', 3), hz('G', 3), hz('E', 4), hz('C', 4)], 50.0, 8.4, .22, 1500)
for t in np.arange(35.0, 49.9, 60 / 96): M.add('music', soft_kick(.35), t, .1)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
# S1 kanca
S(Y('rol:gecis_yumusak'), 0, .25); S(Y('mb:ambience/ocean-waves-coastal-03', 3.1), 0, .22); S(Y('rol:damga'), 3.1, .55)
# S2 gündem + DASK + konut poliçesi
S(Y('rol:gecis'), 4.1, .28); S(Y('rol:pop'), 4.3, .22)
for i in range(12): S(Y('rol:tik', .2), 4.35 + i * .2, .16)
S(Y('rol:gecis#1'), 7.3, .25); S(Y('rol:pop#1'), 7.4, .22); S(Y('rol:yanlis'), 8.2, .28)
S(Y('rol:gecis#2'), 10.2, .25); S(Y('rol:kagit'), 10.3, .3); S(Y('rol:darbe#3', .8), 12.8, .25); S(Y('rol:dogru', 1.0), 14.7, .25); S(Y('rol:pop'), 14.75, .2)
# S3 araba (Gubi'ye soru)
S(Y('rol:gecis#3'), 15.95, .25); S(Y('rol:pop#1'), 16.85, .22); S(Y('rol:darbe', .8), 19.3, .25); S(Y('rol:pop'), 19.4, .16)
S(Y('rol:gecis'), 20.15, .25); S(Y('rol:kagit#1', .8), 20.2, .28); S(Y('rol:dogru', 1.0), 21.95, .25)
# S4 kaskon yoksa → belediyeye dava
S(Y('rol:gecis#1'), 22.95, .25); S(Y('rol:pop#1'), 23.05, .2); S(Y('mb:ambience/ocean-waves-coastal-03', 2.6), 23.2, .16)
S(Y('rol:darbe#3', .8), 24.05, .25); S(Y('rol:gecis#2'), 26.05, .25); S(Y('rol:damga#1'), 26.15, .3); S(Y('rol:pop'), 26.3, .18)
S(Y('rol:darbe#1', .9), 27.55, .26); S(Y('rol:para', .6), 27.6, .14)
# S5 paylaş
S(Y('rol:gecis'), 28.7, .25); S(Y('rol:pop'), 28.85, .22); S(Y('rol:gecis_hizli'), 29.2, .25)
# S6 Gufi
S(Y('rol:gecis#3'), 30.95, .22); S(Y('rol:kagit#1', .8), 32.75, .3); S(Y('rol:pop#1'), 33.55, .2)
# S7 3 kural
S(Y('rol:gecis'), 34.85, .25); S(Y('rol:pop'), 34.95, .22)
S(Y('rol:darbe', 1.0), 36.02, .32); S(Y('rol:darbe#3', .7), 39.76, .2); S(Y('rol:darbe#1', 1.0), 43.4, .32); S(Y('rol:darbe#2', 1.0), 47.15, .32)
# S8 soru, S9 takip
S(Y('rol:gecis#1'), 50.0, .25); S(Y('rol:pop'), 50.05, .22); S(Y('rol:pop#1'), 52.16, .22)
S(Y('rol:gecis#2'), 53.15, .22); S(Y('rol:dogru', 1.0), 53.45, .2)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .1)
ve = voice_env(voice)
duck = 1 - .55 * np.clip(ve * 2.2, 0, 1)
mus = filt(M.bus['music'] * duck, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-14)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 3.0
d = int(.012 * SR)
Lc = voice + sfx + mus; Rc = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
st = np.stack([Lc, Rc], 1); st = st / max(1.0, np.abs(st).max() / .95)
wavfile.write('miks.wav', SR, (st * 32767).astype(np.int16))
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
