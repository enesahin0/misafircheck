"""#37 DASK ödemez — sakin-ciddi bilgi tonu: melodisiz pad yatağı (Am → Do majör), kurallarda hafif nabız; efektler KANAL SESLERİ (sfx_lib ROL); maskot imza sesleri düşük (-10 dB)."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *
from sfx_lib import Y

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 57.66
M = Mix(59.9)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def pd(fs, a, d, g=.2, lp=1100): M.add('music', filt(pad(fs, d, .4), 'lowpass', lp) * adsr(int(d * SR), 1.0, 1.2), a, g)
pd([hz('A', 2), hz('E', 3), hz('C', 3)], 0, 16.9, .18, 900)
pd([hz('F', 2), hz('C', 3), hz('A', 3)], 16.8, 11.1, .18, 1000)
pd([hz('C', 3), hz('G', 3), hz('E', 4)], 27.7, 6.7, .2, 1300)
pd([hz('A', 2), hz('E', 3), hz('C', 4)], 34.3, 17.1, .18, 1100)
pd([hz('C', 3), hz('G', 3), hz('E', 4), hz('C', 4)], 51.3, 8.6, .22, 1500)
for t in np.arange(34.6, 51.2, 60 / 96): M.add('music', soft_kick(.35), t, .1)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
# S1 kanca
S(Y('rol:gecis_yumusak'), 0, .25); S(Y('mb:ambience/ocean-waves-coastal-03', 3.2), 0, .22); S(Y('rol:damga'), 3.22, .55)
# S2 gündem + DASK + konut poliçesi
S(Y('rol:gecis'), 4.2, .28); S(Y('rol:pop'), 4.4, .22)
for i in range(12): S(Y('rol:tik', .2), 4.45 + i * .2, .16)
S(Y('rol:gecis#1'), 7.7, .25); S(Y('rol:pop#1'), 7.8, .22); S(Y('rol:yanlis'), 8.8, .28)
S(Y('rol:gecis#2'), 10.5, .25); S(Y('rol:kagit'), 10.6, .3); S(Y('rol:darbe#3', .8), 13.6, .25); S(Y('rol:dogru', 1.0), 15.5, .25); S(Y('rol:pop'), 15.55, .2)
# S3 araba
S(Y('rol:gecis#3'), 16.85, .25); S(Y('rol:pop#1'), 17.75, .22); S(Y('rol:darbe', .8), 20.66, .25)
S(Y('rol:gecis'), 21.25, .25); S(Y('rol:kagit#1', .8), 21.3, .28); S(Y('rol:dogru', 1.0), 22.05, .22); S(Y('rol:yanlis'), 22.85, .25)
S(Y('rol:gecis#1'), 23.95, .25); S(Y('rol:kagit', .8), 24.0, .28); S(Y('rol:darbe#3', .8), 25.4, .22); S(Y('rol:dogru', 1.0), 26.25, .25)
# S4 paylaş
S(Y('rol:gecis#2'), 27.8, .25); S(Y('rol:pop'), 27.95, .22); S(Y('rol:gecis_hizli'), 28.35, .25)
# S5 Gufi
S(Y('rol:gecis'), 30.05, .22); S(Y('rol:kagit#1', .8), 31.95, .3); S(Y('rol:pop#1'), 32.95, .2)
# S6 3 kural
S(Y('rol:gecis#3'), 34.35, .25); S(Y('rol:pop'), 34.55, .22)
S(Y('rol:darbe', 1.0), 36.65, .32); S(Y('rol:darbe#1', 1.0), 42.75, .32); S(Y('rol:darbe#2', 1.0), 48.45, .32)
# S7 soru, S8 takip
S(Y('rol:gecis'), 51.35, .25); S(Y('rol:pop'), 51.45, .22); S(Y('rol:pop#1'), 53.55, .22)
S(Y('rol:gecis#2'), 54.55, .22); S(Y('rol:dogru', 1.0), 54.9, .2)
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
