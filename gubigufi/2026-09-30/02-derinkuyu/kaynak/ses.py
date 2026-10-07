"""#2 Derinkuyu — özgün müzik + efektler + seslendirme miksi."""
import sys, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
DUR = 65.9
M = Mix(DUR)

# ---------- seslendirme ----------
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav')
v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# ---------- müzik (D Hicaz, karanlık yeraltı) ----------
BAR = 3.75
CH = {'D': [hz('D', 3), hz('F#', 3), hz('A', 3)], 'Eb': [hz('D#', 3), hz('G', 3), hz('A#', 3)], 'Cm': [hz('C', 3), hz('D#', 3), hz('G', 3)], 'Gm': [hz('G', 2), hz('A#', 2), hz('D', 3)]}
PROG = ['D', 'Eb', 'Cm', 'D']
dr = pad([hz('D', 1), hz('A', 1), hz('D', 2)], DUR, .35)
dr *= np.concatenate([np.linspace(0, 1, SR), np.ones(M.n - SR)])[:len(dr)]
M.add('music', filt(dr, 'lowpass', 400), 0, .6)
def chords(a, b, bright=.6, gain=.5, lp=2200):
    t = a; i = 0
    while t < b - .5:
        d = min(BAR + 1.2, b - t + 1.0)
        x = pad(CH[PROG[i % 4]], d, bright) * adsr(int(d * SR), .9, 1.1)
        M.add('music', filt(x, 'lowpass', lp), t, gain); t += BAR; i += 1
chords(5.7, 16.3, .3, .32, 900)     # tünel: boğuk
chords(16.3, 32.4, .6, .42)
chords(32.4, 39.3, .7, .45, 2600)   # savaş
chords(39.3, 55.9, .55, .42)
chords(55.9, 63.9, .35, .36, 1200)
def heartbeat(a, b, g=.55, step=BAR / 2):
    t = a
    while t < b:
        M.add('music', soft_kick(), t, g); M.add('music', soft_kick(), t + .24, g * .55); t += step
heartbeat(9.3, 16.2, .5); heartbeat(16.3, 32.4, .45); heartbeat(32.5, 39.3, .7, BAR / 4); heartbeat(45.7, 55.0, .45)
def motif(at, notes, step=.235, g=.33, bright=.55):
    for k, n in enumerate(notes):
        M.add('music', pluck(hz(*n), 2.2, bright), at + k * step, g)
motif(16.35, [('D', 4), ('F#', 4), ('A', 4), ('D', 5)], .16, .38, .8)
motif(22.4, [('A', 4), ('A#', 4), ('A', 4), ('G', 4), ('F#', 4)], .28, .26)
motif(45.75, [('D', 4), ('D#', 4), ('F#', 4), ('G', 4), ('A', 4)], .22, .28)
motif(52.0, [('D', 5), ('A', 4), ('F#', 4), ('D', 4)], .16, .32, .8)
M.add('music', bell(hz('D', 5), 3.0, .6), 61.65, .22)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
S(filt(noise(5.0), 'lowpass', 500) * adsr(int(5 * SR), .5, 1.0), 0, .10)          # oda ambiyansı
for h in (1.55, 3.0, 4.62):
    S(swish(.3), h - .18, .3); S(hit(.5, 1800), h, .75); S(boom(.9, 70), h, .45)
S(shatter(1.3), 4.64, .7); S(rumble(1.2, 60), 4.7, .45)                              # duvar yıkılır
S(filt(noise(3.5), 'bandpass', [200, 900]) * adsr(int(3.5 * SR), 1.0, 1.2), 5.7, .22)  # soğuk rüzgâr
S(riser(1.7, 120, 900), 9.3, .3); S(whoosh(1.4, 200, 2500, .8), 9.8, .4); S(hit(.4, 6000), 11.2, .3)
for d in (12.56, 14.38): S(whoosh(.45, 3000, 300), d, .45); S(hit(.4, 1200), d + .42, .55); S(boom(.8, 55), d + .42, .4)
S(tick(1800), 11.35, .25); S(tick(1800), 12.95, .25); S(tick(1800), 14.8, .25)
S(whoosh(1.3, 3000, 200, .3), 15.9, .45); S(boom(1.4, 50), 16.35, .35)
for i in range(9): S(tick(1800 + i * 60, .04), 16.35 + i * .05 + .2, .15)
k = 18.0
while k < 20.2: S(tick(2600, .03), k, .15); k += .11
S(bell(1760, 1.2, .6), 20.25, .22)
for at in (22.41, 23.66, 25.11, 25.92): S(whoosh(.5, 500, 2500), at - .35, .25); S(bell(1320, 1.0, .4), at + .05, .14)
S(filt(noise(.6), 'bandpass', [150, 500]) * adsr(int(.6 * SR), .05, .3), 22.6, .2)   # ahır
S(bell(660, 1.2, .2), 25.2, .15)                                                       # kuyu
k = 27.65
while k < 28.9: S(tick(3000, .03), k, .18); k += .03 + (k - 27.65) * .06
S(steps(2.5, 14, 1300), 29.4, .12)
S(pop(300, .3), 32.5, .4); S(boom(1.5, 45), 33.65, .45); S(riser(.7, 400, 1800), 33.0, .2)
S(steps(1.6, 7, 400), 33.9, .35); S(rumble(2.0, 55), 33.9, .3)                       # atlılar
for i in range(8): S(swish(.2), 34.3 + i * .45, .15)                                    # oklar
S(steps(2.5, 9, 1000), 35.8, .2)
S(whoosh(.5, 3000, 400), 39.3, .4); S(scrape(1.0, 120), 42.97, .6); S(rumble(1.0, 45), 42.97, .45)
S(boom(1.6, 45), 43.9, .9); S(hit(.5, 1500), 43.9, .6)                               # taş kapı GÜM
S(tick(2600, .08), 43.95, .45); S(tick(2600, .08), 44.1, .25)
S(whoosh(.7, 300, 3000), 45.3, .35)
S(filt(noise(1.3), 'bandpass', [900, 3000]) * adsr(int(1.3 * SR), .3, .5), 45.71, .18)  # hava
S(filt(noise(1.2), 'bandpass', [300, 1200]) * adsr(int(1.2 * SR), .2, .5) * (1 + .5 * np.sin(np.arange(int(1.2 * SR)) / SR * 2 * np.pi * 6)), 47.18, .2)  # su
S(hit(.35, 1200), 49.2, .4); S(whoosh(4.0, 200, 1800, .5), 49.3, .35); S(bell(1760, 1.0, .5), 52.0, .2)
S(whoosh(1.2, 400, 3500, .8), 54.6, .4)
for i in range(8): S(filt(noise(.12), 'bandpass', [2000, 6000]) * env(int(.12 * SR), .002, .03), 56.35 + i * .16, .12)  # zaman akışı
for i in range(12): S(hit(.2, 2500), 57.95 + i * .14, .14)                             # duvar örülür
S(hit(.35, 1200), 58.3, .35)
S(riser(2.0, 150, 1800), 61.6, .25); S(crackle_fire(1.9), 61.7, .2)
S(whoosh(.45, 800, 4000, .7), 63.85, .25)
LS = 63.85
S(bell(2349, 1.6), LS + .41, .4); S(bell(3136, 1.3), LS + .58, .32)
S(pop(900, .12), LS + .765, .5); S(pop(900, .08), LS + .89, .18); S(pop(900, .06), LS + .98, .08)

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
