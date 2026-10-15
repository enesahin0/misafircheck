"""#36 Azerbaycan'la aramızda ne oluyor — gergin La minör nabız (kriz) / sert vuruşlar (alıntılar, bomba) / Do majör umut (Gufi) → takip."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 59.77
M = Mix(LS + 2.95)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
B = 60 / 96
def pd(fs, a, d, g=.25, lp=1200): M.add('music', filt(pad(fs, d, .5), 'lowpass', lp) * adsr(int(d * SR), .8, 1.0), a, g)
def nabiz(a, b, notalar, g=.9, kick=True):
    t = a; k = 0
    while t < b - .05:
        if kick and k % 4 == 0: M.add('music', soft_kick(.3), t, .16 * g)
        n, o = notalar[k % len(notalar)]; M.add('music', pluck(hz(n, o), .6, .45), t, .09 * g)
        t += B / 2; k += 1
pd([hz('A', 2), hz('E', 3), hz('C', 3)], 0, 6.3, .3, 900)
nabiz(6.3, 33.15, [('A', 4), ('C', 5), ('E', 5), ('C', 5), ('G', 4), ('B', 4), ('E', 5), ('B', 4)], .85)
pd([hz('D', 2), hz('A', 2), hz('F', 3)], 33.15, 14.8, .32, 800)
nabiz(34.6, 47.95, [('D', 5), ('F', 5), ('A', 5), ('F', 5), ('E', 5), ('G', 5), ('A', 5), ('E', 5)], 1.0)
pd([hz('F', 2), hz('C', 3), hz('A', 3)], 47.95, 3.6, .26, 900)
pd([hz('C', 3), hz('E', 3), hz('G', 3)], 51.5, 5.6, .3, 1400)
nabiz(51.5, 60.2, [('C', 5), ('E', 5), ('G', 5), ('E', 5), ('F', 5), ('A', 5), ('C', 6), ('A', 5)], .9, kick=False)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 3.0, .5) for n in ('C', 'E', 'G')]), .4), 60.2, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
from sfx_lib import Y
# GERÇEK EFEKTLER (marka/sfx_lib.py): Mixkit seçkisi + Kenney CC0 + motion-bang-bang
S(Y('mk:darbe_gerilim', 2.5), .0, .55); S(Y('rol:kart_pop'), .3, .3); S(Y('rol:etiket_vur'), 2.0, .35)
S(Y('rol:catlak', 1.6), 4.3, .5); S(Y('mk:darbe_derin', 2.0), 5.15, .55)
S(Y('rol:gecis'), 6.3, .35); S(Y('rol:kagit'), 8.3, .4); S(Y('mk:tik_secim'), 11.1, .3); S(Y('rol:yanlis'), 11.9, .35)
S(Y('mk:metal_izgara'), 12.8, .45); S(Y('mk:kapi_mandal'), 13.05, .4); S(Y('mk:davul_derin_ince', 1.5), 13.2, .4)
S(Y('mk:whoosh_hava'), 15.05, .25); S(Y('rol:balon_pop'), 18.05, .35); S(Y('rol:pirilti', 1.2), 18.0, .3)
for i, a in enumerate((20.4, 21.0, 21.75)): S(Y('mk:pop_kuru', perde=2 * i), a, .3)
S(Y('mk:bas_vurus', 1.5), 22.6, .45); S(Y('mk:tik_ton'), 22.75, .2)
for i in range(10): S(Y('rol:tik', .2), 22.65 + i * .12, .22)
S(Y('rol:uyari'), 23.95, .3); S(Y('rol:cip_pop'), 24.45, .3)
S(Y('rol:gecis'), 25.8, .3); S(Y('rol:cip_pop'), 26.2, .25)
S(Y('rol:darbe', 1.2), 28.7, .4); S(Y('rol:darbe', 1.2, perde=-2), 29.9, .38); S(Y('rol:etiket_vur'), 30.3, .3); S(Y('rol:boing'), 31.75, .3)
S(Y('mk:darbe_epik', 3.0), 33.5, .6); S(Y('rol:foto'), 34.65, .4); S(Y('rol:gecis_yumusak'), 34.6, .25); S(Y('rol:etiket_vur'), 34.75, .3)
for i in range(14): S(Y(f'kn:impact-sounds/impactMetal_light_00{i % 5}', .4), 36.15 + i * .115, .18)
S(Y('rol:damga'), 37.65, .55); S(Y('rol:kart_pop'), 39.15, .3)
for i, a in enumerate((40.05, 40.48, 40.91)): S(Y('mk:tik_ton', perde=3 * i), a, .35)
S(Y('rol:kagit'), 41.75, .4); S(Y('rol:gecis'), 42.7, .3); S(Y('rol:cip_pop'), 43.45, .28); S(Y('rol:cip_pop', perde=2), 46.05, .28); S(Y('rol:foto'), 46.35, .3)
S(Y('rol:gecis'), 47.95, .3); S(Y('rol:damga'), 49.15, .55); S(Y('rol:cip_pop'), 50.35, .25)
S(Y('mk:whoosh_hava'), 51.45, .25); S(Y('rol:kart_pop'), 53.2, .3); S(Y('mk:bildirim_olumlu', 1.2), 53.25, .22)
S(Y('rol:cip_pop'), 55.0, .25); S(Y('rol:cip_pop', perde=2), 55.3, .25)
S(Y('rol:gecis'), 57.1, .3); S(Y('mk:cingirak_kazan', 2.0), 57.4, .3)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .28)
ve = voice_env(voice)
duck = 1 - .6 * np.clip(ve * 2.2, 0, 1)
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
