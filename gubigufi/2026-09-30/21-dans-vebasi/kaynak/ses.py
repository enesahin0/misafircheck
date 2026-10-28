"""#21 1518 Dans vebası — özgün müzik (Rönesans flüt + tabor) + efektler + maskot sesleri + seslendirme miksi.
Anlatı: 'Müzik yok' kısmında gerçekten müzik YOK (tekinsiz drone + ayak sesleri); belediye müzisyen tutunca
flüt-davul dansı başlar ve çılgınlaşır; yasakla kesilir; türbede org akoru; bilim kısmında sakin lavta; finalde yavaş flüt."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 94.04
M = Mix(LS + 3.1)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]
def ek(*xs):
    o = np.zeros(max(len(x) for x in xs))
    for x in xs: o[:len(x)] += x
    return o

# ---------- enstrümanlar ----------
def flut(f, d, vib=5.5):                      # Rönesans flütü (fife): saf ton + hafif vibrato + nefes
    tt = T(d); ff = f * (1 + .006 * np.sin(2 * np.pi * vib * tt) * np.clip(tt / .15, 0, 1))
    x = np.sin(2 * np.pi * np.cumsum(ff) / SR) + .18 * np.sin(4 * np.pi * np.cumsum(ff) / SR) + filt(noise(d), 'bandpass', [f * .9, f * 1.3]) * .12
    return x * adsr(len(tt), .03, min(.12, d * .4)) * .5
def tabor(ag=1.0):                            # küçük davul: gövde + telli deri
    return ek(soft_kick(.25) * .7 * ag, filt(noise(.14), 'bandpass', [900, 4500]) * env(int(.14 * SR), .002, .09) * .45 * ag)
def drone(fs, d, g=1.0): return filt(pad(fs, d, .4), 'lowpass', 700) * adsr(int(d * SR), .8, 1.0) * g
def org(fs, d): return reverb(filt(pad(fs, d, .8), 'lowpass', 2400) * adsr(int(d * SR), .4, .9), .4)
def lavta(f, d=1.2): return pluck(f, d, .35)

# Re dorian dans ezgisi (saltarello havası) — (nota, oktav, vuruş)
EZGI = [('D', 5, 1), ('E', 5, .5), ('F', 5, .5), ('G', 5, 1), ('A', 5, 1), ('G', 5, .5), ('F', 5, .5), ('E', 5, 1), ('D', 5, 1),
        ('A', 5, 1), ('C', 6, .5), ('A', 5, .5), ('G', 5, 1), ('F', 5, .5), ('E', 5, .5), ('D', 5, 2)]
def dans(a, b, bpm, g=1.0, cilgin=0.0):
    B = 60 / bpm; t = a; i = 0
    while t < b - .05:
        n, o, L = EZGI[i % len(EZGI)]; d = L * B
        f = hz(n, o) * (1 + (cilgin * .03 * np.sin(i * 1.7)))
        M.add('music', flut(f, d * .95), t, .30 * g)
        t += d; i += 1
    t = a; k = 0
    while t < b - .05:                          # 6/8 davul: GÜM . tak GÜM tak tak
        M.add('music', tabor(1.0 if k % 3 == 0 else .55), t, .5 * g)
        if k % 6 == 0: M.add('music', drone([hz('D', 2), hz('A', 2)], B * 3, .5), t, .35 * g)
        t += B / 2 * (1 - cilgin * .15 * (k % 2)); k += 1

# 01: sokak — hafif ambiyans + kısa flüt nefesi yok; tek tük kuş
M.add('music', drone([hz('D', 3), hz('A', 3)], 8.3, .6), 0, .22)
# 02–05: MÜZİK YOK → tekinsiz drone + ritimsiz ayak sesleri (dansın gerçek sesi)
M.add('music', drone([hz('D', 2), hz('D#', 2)], 18.2, 1.0), 8.2, .22)
M.add('music', drone([hz('A', 2), hz('A#', 2)], 6.0, .8), 26.3, .2)
M.add('music', riser_hedefli(29.9, 31.0), 29.9, .15)
# 06: 'Daha çok dans!' → belediye müzisyenleri
dans(31.0, 40.0, 138, 1.0)
# 07: salgın büyür → hızlanır, bozulur
dans(40.0, 45.7, 164, 1.1, cilgin=1.0)
# 08: karar tersine → sessiz gerilim, 'yasak' vurgusu
M.add('music', drone([hz('D', 2), hz('G#', 2)], 3.9, .6), 45.75, .2)
# 09: türbe — org akoru
M.add('music', org([hz('D', 3), hz('A', 3), hz('F', 4)], 3.5), 49.65, .3)
M.add('music', org([hz('G', 3), hz('D', 4), hz('A#', 4)], 3.4), 53.1, .3)
# 10: eylül — sakinleşme
for k, (n, o) in enumerate([('D', 4), ('F', 4), ('A', 4), ('D', 5), ('A', 4), ('F', 4)]): M.add('music', lavta(hz(n, o), 1.4), 56.4 + k * .6, .3)
M.add('music', drone([hz('D', 3), hz('A', 3)], 4.4, .5), 56.3, .15)
# 11–13: bilim kısmı — lavta arpej, 92 bpm
B2 = 60 / 92
for k in range(int((77.9 - 60.7) / (B2 / 2))):
    t = 60.7 + k * B2 / 2; ch = [('D', 'F', 'A'), ('A#', 'D', 'F'), ('C', 'E', 'G'), ('A', 'C#', 'E')][(k // 8) % 4]
    M.add('music', lavta(hz(ch[k % 3], 4 if k % 4 else 3), .9), t, .22)
    if k % 8 == 0: M.add('music', drone([hz(ch[0], 2), hz(ch[2], 3)], B2 * 4, .5), t, .2)
# 14: lanet inancı — karanlık org
M.add('music', org([hz('D', 2), hz('A', 2), hz('D#', 3)], 4.8), 77.9, .28)
# 15: stres + inanç → beyin: yükselen nabız
for k in range(int((87.8 - 82.6) / .38)): M.add('music', soft_kick(.3), 82.6 + k * .38 * (1 - k * .008), .25 + k * .012)
M.add('music', drone([hz('D', 2), hz('A', 2), hz('F', 3)], 5.2, .8), 82.6, .22)
# 16: final — yavaş flüt reprizi + davul
dans(87.8, LS, 96, .8)
M.add('music', reverb(ek(*[pluck(hz(n, 4), 2.6, .6) for n in ('D', 'F', 'A')]), .4), LS, .5)

# ---------- efektler ----------
S = lambda x, at, g=.5: M.add('sfx', x, at, g)
def ayak(d, hiz=3.0): return steps(d, hiz, 700)
def kalabalik(d, g=1.0): tt = T(d); x = filt(noise(d), 'bandpass', [300, 2000]); return x * (.6 + .4 * np.sin(2 * np.pi * .4 * tt) ** 2) * adsr(len(tt), .5, .8) * .35 * g
def tebesir(): return filt(noise(.22), 'bandpass', [2500, 7000]) * adsr(int(.22 * SR), .01, .08) * .5
def cekic(): return ek(hit(.25, 1400) * .6, boom(.25, 120) * .4)
def tuy_kalem(d=.8): return filt(noise(d), 'bandpass', [3000, 8000]) * (np.abs(np.sin(2 * np.pi * 7 * T(d))) ** 3) * adsr(int(d * SR), .05, .2) * .3
S(ayak(5.0, 2.2), 2.7, .12)                                              # Troffea yürür
S(ek(pop(760, .14)), .35, .22); S(pop(700, .14), 3.05, .22)
for k in range(24): S(tick(500 + (k % 3) * 90, .06), 6.6 + k * .31, .18)   # dans adımları (müziksiz)
S(ek(hit(.2, 900) * .5, swish(.2)), 8.35, .25)                             # nota çarpı
S(whoosh(.3, 2500, 800), 9.85, .15)
for i in range(10): S(tebesir(), 9.9 + .1 * 1.9 + i * .135 * 1.0, .35)      # tebeşir çentikleri
S(whoosh(.3, 2500, 800), 11.65, .12)
S(kalabalik(14.6, .6), 11.7, .12); S(ayak(14.6, 5.0), 11.7, .1)
sayac_tiklari(M, 13.3, 1.8, 14)
S(pop(760, .14), 11.9, .22); S(pop(760, .14), 15.9, .22); S(pop(700, .14), 18.0, .22)
S(kalabalik(10.7, 1.3), 15.6, .16)
S(whoosh(.3, 2500, 800), 20.95, .15)
for k in range(6): S(ek(boom(.18, 90) * .6, tick(300, .05)), 21.0 + .12 + k * .449, .3)   # ayakkabı darbeleri
S(whoosh(.3, 2500, 800), 23.55, .12)
for k in range(6): S(pop(900 + k * 60, .1), 23.7 + k * .15, .15)
S(swish(.3), 26.3, .2); S(pop(760, .14), 26.6, .22)
S(whoosh(.3, 2500, 800), 28.35, .15); S(tuy_kalem(.9), 28.75, .5); S(ek(bell(1568, .5, .7) * .3, hit(.15, 1500) * .3), 28.9, .25)
S(whoosh(.3, 2500, 800), 30.8, .12); S(ek(bell(1760, .8, .8), pop(900, .12)), 30.95, .35)
for k in range(8): S(ek(tick(900, .04) * .8, boom(.12, 150) * .3), 32.45 + k * .2, .22)  # tahta sahne çakılır
S(pop(760, .14), 32.6, .22); S(pop(700, .14), 34.5, .22); S(pop(760, .14), 36.6, .22)
S(ek(scrape(.4, 300) * .4, boom(.3, 100) * .3), 36.4, .25)
S(swish(.3), 40.0, .2); S(pop(760, .14), 40.3, .22)
for k in range(30): S(tick(1800 + (k % 5) * 200, .03), 41.9 + k * .11, .08)   # haritada noktalar
S(ek(boom(.4, 70) * .5, hit(.2, 800) * .3), 44.35, .28)
S(pop(760, .14), 46.0, .22); S(whoosh(.8, 500, 1600, .5), 46.2, .15)
S(whoosh(.3, 2500, 800), 47.55, .15); S(ek(swish(.2), boom(.2, 110) * .4), 47.65, .3)
for k in range(3): S(cekic(), 47.6 + .5 + k * .36, .35)
S(ek(bell(880, 2.4, .6), bell(1320, 2.0, .6) * .5), 50.0, .28); S(pop(760, .14), 50.2, .22); S(ayak(3.4, 2.0), 49.9, .1)
S(whoosh(.3, 2500, 800), 53.05, .15); S(crackle_fire(3.2) * .5, 53.1, .2); S(bell(1760, 1.2, .8), 53.5, .15)
S(pop(760, .14), 56.6, .22); S(ek(pop(900, .14), bell(1320, .6, .7) * .3), 59.5, .3)
S(swish(.3), 60.7, .2); S(pop(760, .14), 60.9, .22)
S(whoosh(.3, 2500, 800), 61.85, .15); S(ek(scrape(.3, 500) * .3), 62.2, .2); S(pop(640, .14), 62.3, .22)
S(whoosh(.3, 2500, 800), 64.05, .12); S(ek(pop(700, .14), hit(.1, 1200) * .2), 64.2, .25); S(pop(760, .14), 66.2, .25); S(ek(bell(1976, .6, .8), pop(1000, .1)), 66.6, .3)
S(pop(760, .14), 68.5, .22); S(ek(boom(.4, 80) * .4, bell(1568, 1.0, .8) * .5), 71.65, .35)
S(pop(760, .14), 74.1, .25); S(pop(640, .14), 75.1, .25); S(pop(700, .14), 76.2, .25); S(kalabalik(4.0, .5), 73.8, .1)
S(ek(bell(587, 2.5, .5), bell(880, 2.2, .5) * .4), 78.1, .25); S(pop(760, .14), 78.4, .22); S(whoosh(1.5, 300, 900, .4), 78.9, .15)
S(pop(700, .14), 82.9, .25); S(pop(760, .14), 83.6, .25); S(whoosh(.5, 800, 2600, .5), 84.9, .2); S(ek(pop(900, .12), tick(1500, .05)), 85.1, .25)
S(swish(.3), 87.8, .2); S(pop(760, .14), 88.1, .22)
S(pop(700, .14), 91.6, .3); S(ek(swish(.25), hit(.15, 1400) * .3), 92.0, .3)
S(ek(boom(.6, 60) * .7, bell(1319, 1.4, .8) * .5), 93.0, .4)
S(bell(1319, 1.6), LS + .6, .3); S(bell(1976, 1.3), LS + .7, .25); S(pop(900, .12), LS + .72, .4)
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
