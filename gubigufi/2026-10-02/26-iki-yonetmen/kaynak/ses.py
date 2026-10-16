"""#26 İki yönetmen — gerilimli magazin müziği (Mi minör, pizzicato + nabız), projeksiyon makinesi, kart darbeleri, alkış/mısır, maskot sesleri."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 79.39
M = Mix(LS + 5.0)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o
def drone(fs, d, g=1.0): return filt(pad(fs, d, .5), 'lowpass', 900) * adsr(int(d * SR), .6, 1.0) * g
def pizz(f, d=.5): return pluck(f, d, .5)
# 104 bpm gossip-gerilim: bas nabzı + pizzicato motifi (Mi minör)
B = 60 / 104
MOTIF = [('E', 4), ('G', 4), ('B', 4), ('G', 4), ('E', 4), ('F#', 4), ('A', 4), ('F#', 4)]
def bolum(a, b, g=1.0, bas=True, pz=True):
    t = a; k = 0
    while t < b - .05:
        if bas and k % 2 == 0: M.add('music', soft_kick(.3), t, .38 * g)
        if bas and k % 4 in (1, 3): M.add('music', pluck(hz('E', 2), B * .8, .4), t, .3 * g)
        if pz: n, o = MOTIF[k % 8]; M.add('music', pizz(hz(n, o), .45), t, .2 * g)
        t += B / 2; k += 1
M.add('music', drone([hz('E', 2), hz('B', 2), hz('G', 3)], 7.3, .8), 0, .3)
M.add('music', riser_hedefli(0, 6.8, 200, 3200), 0, .12)
bolum(0.4, 7.3, .85)
bolum(7.3, 31.7, 1.0)
M.add('music', drone([hz('E', 2), hz('F', 2)], 8.3, .7), 31.7, .3)
bolum(31.7, 49.8, 1.1)
M.add('music', riser_hedefli(46.5, 49.8, 300, 4500), 46.5, .2)
bolum(49.8, 73.3, 1.2)
M.add('music', riser_hedefli(69.0, 73.3, 300, 4500), 69.0, .15)
M.add('music', drone([hz('E', 2), hz('B', 2), hz('D#', 3)], 4.0, .8), 73.3, .3)
# final: sen seç — majör açılım
for k, n in enumerate(['E', 'G#', 'B', 'E']): M.add('music', pluck(hz(n, 4 + (k // 3)), 1.6, .6), 77.3 + k * .28, .3)
M.add('music', reverb(ek(*[pluck(hz(n, 3), 3.0, .5) for n in ('E', 'G#', 'B')]), .4), 79.4, .4)
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def vur(): return ek(boom(.5, 70) * .7, hit(.18, 1100) * .5)            # alıntı kartı darbesi
def clap(): return ek(hit(.14, 2200) * .7, tick(1800, .05))              # klaket
def ooh(d=1.3): tt = T(d); return filt(noise(d), 'bandpass', [350, 1400]) * np.sin(np.pi * tt / d) ** 2 * .5
def alkis(d=1.6): return filt(noise(d), 'bandpass', [1500, 6000]) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 9 * T(d)))) * adsr(int(d * SR), .05, .6) * .5
def misir_pop(): return ek(*[pop(900 + 200 * (i % 3), .05) * .3 for i in range(5)])
S(projector(7.2) * .5, 0, .18)
S(vur(), .05, .55); S(clap(), .22, .45); S(whoosh(.4, 600, 2200, .5), .02, .2)
S(pop(760, .14), 2.6, .2); S(pop(700, .14), 4.55, .2); S(misir_pop(), 6.65, .3)
S(whoosh(.5, 500, 2400, .5), 7.4, .2); S(pop(900, .12), 9.6, .2); S(whoosh(.5, 500, 2400, .5), 10.2, .2)
S(whoosh(.3, 2500, 800), 11.85, .12); S(pop(700, .14), 12.2, .22)
S(ek(shatter(.7) * .6, boom(.4, 90) * .5), 14.3, .4); S(whoosh(.4, 1500, 500), 14.9, .15); S(pop(500, .2), 15.9, .2)
S(whoosh(.4, 800, 300), 16.5, .12); S(pop(780, .14), 16.8, .22)
S(ek(bell(1760, .8, .8) * .6, pop(900, .1)), 20.3, .3); S(ek(*[pop(1100 + 140 * i, .07) * .3 for i in range(6)]), 20.8, .4)
S(alkis(1.5), 20.9, .22)
for k in range(14): S(tick(1500 + (k % 5) * 100, .03), 23.6 + k * .12, .12)           # takvim yaprakları
S(ek(boom(.5, 80) * .6, scrape(.4, 300) * .4), 26.2, .3)                               # kitap gelir
S(ek(whoosh(.5, 400, 1800, .5), kagit := filt(noise(.4), 'bandpass', [2500, 7500]) * adsr(int(.4 * SR), .02, .2) * .35), 29.5, .25)
S(parazit := filt(noise(.5), 'highpass', 1500) * adsr(int(.5 * SR), .01, .2) * .4, 31.9, .3)
S(vur(), 34.15, .5); S(vur(), 36.75, .5); S(vur(), 38.3, .5)
S(ek(boom(.5, 60) * .7, hit(.25, 800) * .5), 41.95, .55); S(ooh(1.2), 42.2, .25)
S(ek(boom(.5, 60) * .7, hit(.25, 800) * .5), 48.35, .55); S(ooh(1.3), 48.6, .25)
for k in range(8): S(pop(600 + 120 * k, .1), 44.0 + k * .3, .1)
S(ek(shatter(.8) * .7, boom(.5, 70) * .6), 51.5, .5)
for k in range(24): S(tick(1800 + (k % 4) * 150, .03), 53.5 + k * .115, .1)           # yazılıyor
S(ek(swish(.3), pop(1200, .1)), 56.5, .3)
S(ek(boom(.6, 55) * .9, hit(.3, 700) * .6, shatter(.3) * .3), 58.7, .65); S(ooh(1.6), 58.9, .35); S(alkis(1.5), 59.2, .2)
S(misir_pop(), 59.5, .3); S(misir_pop(), 60.3, .25)
S(clap(), 62.4, .55); S(vur(), 64.2, .55)
for k in range(6): S(ek(pop(700 + 100 * k, .1), tick(2200, .04)), 70.2 + k * .5, .22)  # film karesi onayları
S(whoosh(.5, 500, 2000, .5), 73.4, .25); S(pop(760, .14), 73.5, .22); S(pop(860, .14), 74.3, .22)
S(ek(bell(1319, 1.2, .8), pop(900, .12)), 77.3, .35); S(misir_pop(), 78.2, .3); S(alkis(1.8), 78.0, .22)
S(ek(pop(900, .14), bell(1568, .6, .8) * .4), 79.7, .3)
for kim, at, tip in json.load(open('tepkiler.json')):
    S(maskot_ses(kim, tip), at, .3)
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
