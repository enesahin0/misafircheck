"""#1 Göbeklitepe — özgün müzik + efektler + seslendirme miksi."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 61.75
M = Mix(DUR)

# ---------- seslendirme ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik (D Hicaz, 64 bpm) ----------
BAR = 3.75
CH = {'D': [hz('D', 3), hz('F#', 3), hz('A', 3)], 'Gm': [hz('G', 2), hz('A#', 2), hz('D', 3)], 'Eb': [hz('D#', 3), hz('G', 3), hz('A#', 3)], 'Dd': [hz('D', 3), hz('F#', 3), hz('A', 3), hz('D', 4)]}
PROG = ['D', 'Gm', 'Eb', 'D']
# drone
dr = pad([hz('D', 1), hz('D', 2), hz('A', 2)], DUR, .4)
dr *= np.concatenate([np.linspace(0, 1, SR), np.ones(M.n - SR)])[:len(dr)]
M.add('music', filt(dr, 'lowpass', 500), 0, .55)
# pad akorları (bölümlere göre)
def chords(a, b, bright=.6, gain=.5, lp=2200):
    t = a; i = 0
    while t < b - .5:
        d = min(BAR + 1.2, b - t + 1.0)
        x = pad(CH[PROG[i % 4]], d, bright) * adsr(int(d * SR), .9, 1.1)
        M.add('music', filt(x, 'lowpass', lp), t, gain); t += BAR; i += 1
chords(2.64, 33.1, .6, .42)
chords(33.1, 40.0, .25, .30, 900)      # sepya: ince, eski
chords(40.0, 53.9, .7, .45)
chords(53.9, 59.8, .4, .40, 1400)
# nabız (kalp atışı)
def heartbeat(a, b, g=.55):
    t = a
    while t < b:
        M.add('music', soft_kick(), t, g); M.add('music', soft_kick(), t + .24, g * .55); t += BAR / 2
heartbeat(7.15, 32.9); heartbeat(40.03, 53.8, .6)
# Hicaz tel motifleri
def motif(at, notes, step=.235, g=.33, bright=.55):
    for k, n in enumerate(notes):
        M.add('music', pluck(hz(*n), 2.2, bright), at + k * step, g)
motif(16.25, [('D', 4), ('F#', 4), ('A', 4), ('D', 5)], .16, .38, .8)
motif(23.0, [('A', 4), ('G', 4), ('F#', 4), ('D#', 4), ('D', 4)])
motif(29.0, [('D', 4), ('D#', 4), ('F#', 4), ('G', 4)], .3, .26)
motif(44.75, [('D', 4), ('F#', 4), ('A', 4), ('A#', 4), ('A', 4)], .22, .30)
motif(52.4, [('D', 5), ('A', 4), ('F#', 4), ('D', 4)], .14, .34, .8)
M.add('music', bell(hz('D', 5), 3.0, .6), 58.15, .30)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
S(filt(noise(1.3), 'bandpass', [300, 1500]) * adsr(int(1.3 * SR), .3, .6), 0, .10)        # rüzgâr
S(rewind(1.55), 1.1, .42); S(riser(.5, 300, 1200), 2.15, .25); S(whoosh(.7, 2500, 250), 2.45, .35)
S(tick(1500), 2.92, .3); S(tick(1300), 3.02, .18)                                            # iğne
S(scrape(1.2, 150), 3.72, .38); S(rumble(1.2, 45), 3.75, .35)                                # taş dikiliyor
S(whoosh(.3, 500, 4000, .8), 4.05, .35); S(hit(.4), 4.33, .45)                               # 10 TON
S(boom(1.8, 45), 4.85, .95); S(filt(noise(.8), 'lowpass', 900) * env(int(.8 * SR), .01, .25), 4.86, .35)
S(riser(.45, 900, 200), 5.36, .25)                                                            # donma
S(tick(2600, .08), 5.81, .5); S(tick(2600, .08), 5.95, .3)                                   # kırmızı kare
S(riser(.8, 150, 1500), 6.35, .35); S(hit(.4, 6000), 7.15, .32)                              # zoom + flaş
S(swish(.4), 7.9, .15); S(shatter(.7), 8.55, .25)                                           # tarla kırılır
for a, sl, sh, metal in [(9.47, 10.45, 10.6, False), (10.76, 11.6, 11.76, False), (12.0, 12.76, 12.92, True)]:
    S(pop(620), a, .45); S(swish(), sl, .4); S(shatter(.9, metal), sh, .6)
S(whoosh(.5, 3000, 300), 13.26, .3); S(hit(.5, 1500), 13.88, .6)                             # çakmaktaşı iner
S(steps(.9, 5, 700), 14.54, .22)
S(tick(4200, .05), 15.8, .4); S(bell(2640, 1.5), 15.98, .32); S(bell(3960, 1.2, .5), 16.05, .15)  # kıvılcım
S(whoosh(1.2, 200, 5000, .25), 16.1, .45); S(boom(1.5, 60), 16.2, .45)                       # açılış
for i in range(11): S(tick(1800 + i * 60, .04), 16.3 + i * .045 + .2, .16)
k = 17.8
while k < 18.65: S(tick(3000, .03), k, .22); k += .03 + (k - 17.8) * .09                    # sayaç
S(bell(1760, 1.2, .6), 18.66, .28)
S(whoosh(.5, 3000, 600), 19.0, .3); S(whoosh(.8, 200, 2500, .5), 19.5, .45)
S(pop(440), 19.95, .35); S(pop(560), 20.7, .35); S(whoosh(1.0, 3000, 400, .6), 21.3, .3); S(swish(.3), 21.85, .25)
S(riser(.6, 300, 2400), 22.45, .35); S(rumble(1.0, 50), 22.95, .3)
S(hum(.8, 330), 24.27, .12); S(bell(1320, 1.4, .4), 25.2, .15)                                # tarama
for at in (25.92, 26.67, 27.29): S(scrape(.5, 900), at, .15); S(bell(2200, .8, .3), at, .1)   # oyma
for at in (28.98, 30.52, 31.6): S(hit(.3, 3000), at, .28)                                     # kabartma
S(whoosh(.5, 800, 5000), 29.9, .3); S(steps(.7, 12, 1400), 30.0, .15)                          # tilki
S(rumble(.8, 70), 31.1, .35); S(whoosh(.7, 300, 1500), 31.1, .3); S(steps(.6, 9, 500), 31.15, .2)  # domuz
S(flaps(1.2, 3.5), 32.1, .4); S(whoosh(1.0, 200, 3000, .85), 32.35, .45)                     # akbaba
S(hit(.25, 5000), 33.08, .3); S(projector(6.9), 33.1, .12)                                   # fotoğraf
S(steps(2.4, 3.3, 1100), 33.25, .12); S(scrape(.7, 2500), 36.1, .08)
S(steps(.9, 9, 1100), 38.1, .16)
for i in range(5): S(tick(1600, .05), 39.4 + i * .12, .3)                                     # tarih döner
S(whoosh(1.0, 300, 3000, .4), 39.85, .35); S(steps(1.0, 3.5, 800), 40.05, .14)
S(whoosh(.8, 400, 2000, .8), 41.6, .25); S(swish(.25), 42.45, .4)
S(hit(.6, 4000), 42.72, .75); S(boom(1.4, 50), 42.72, .75); S(crackle_fire(1.1), 42.75, .35)   # kazma
S(riser(.9, 200, 3000), 43.0, .3); S(boom(1.2, 70), 43.88, .35); S(whoosh(.8, 3000, 400), 43.88, .3)
S(whoosh(.6, 400, 2000), 43.95, .25); S(whoosh(.45, 2000, 6000, .5), 44.75, .22)              # kitap
S(filt(noise(.7), 'bandpass', [2000, 6000]) * adsr(int(.7 * SR), .02, .1) * (np.sin(np.arange(int(.7 * SR)) / SR * 2 * np.pi * 30) > 0), 45.95, .06)
S(scrape(.4, 2500), 47.13, .14); S(scrape(.4, 2800), 48.33, .14)                             # fosforlu kalem
S(hit(.3, 2000), 50.05, .3)
for i in range(4): S(pop(700 + (i % 2) * 180, .1), 50.35 + i * .25, .12)                      # "konuşma"
S(whoosh(.35, 800, 2500), 51.63, .22); S(whoosh(.7, 400, 3500, .5), 51.95, .35)
for i in range(4): S(bell(2640 * (1 + i * .25), 1.0, .4), 52.55 + i * .05, .08)
S(hit(.35, 1200), 52.95, .45)                                                                 # damga
S(whoosh(.6, 2500, 300), 53.86, .3); S(hum(1.6, 110), 54.5, .1); S(hit(.3, 1200), 55.2, .35)
S(whoosh(.5, 3000, 200), 56.45, .3); S(rumble(2.8, 40), 56.8, .45)                           # iniş
S(riser(.7, 150, 900), 57.5, .15); S(bell(1175, 2.0, .5), 58.12, .2)
S(bell(2349, 1.4), 58.52, .22)
# logo: pırıltılar "ting-ting", kırmızı kare "pıt"
S(whoosh(.45, 800, 4000, .7), 59.72, .25)
S(bell(2349, 1.6), 60.13, .4); S(bell(3136, 1.3), 60.30, .32)
S(pop(900, .12), 60.485, .5); S(pop(900, .08), 60.61, .18); S(pop(900, .06), 60.70, .08)

# ---------- miks ----------
ve = voice_env(voice)
duck = 1 - .62 * np.clip(ve * 2.2, 0, 1)
mus = M.bus['music'] * duck
mus = filt(mus, 'highpass', 30)
sfx = M.bus['sfx']
def rms(x): return np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
vr = rms(voice)
mus *= vr / (rms(M.bus['music']) + 1e-9) * db(-12)
sfx *= vr / (np.abs(sfx).max() + 1e-9) * 3.2
bed = mus + sfx
full = voice + bed
# stereo: müzik için hafif Haas genişliği
d = int(.012 * SR)
L = voice + sfx + mus; R = voice + sfx + np.concatenate([np.zeros(d), mus[:-d]])
def w(name, l, r):
    st = np.stack([l, r], 1); st = st / max(1.0, np.abs(st).max() / .95)
    wavfile.write(name, SR, (st * 32767).astype(np.int16))
w('miks.wav', L, R)
bl, br = sfx + mus, sfx + np.concatenate([np.zeros(d), mus[:-d]])
w('muzik_efekt.wav', bl, br)
print('tamam', rms(voice), rms(mus), np.abs(sfx).max())
