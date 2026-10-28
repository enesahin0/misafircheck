"""#41 İlk yardım — SES TASARIMI v2: görüntüden türetilen olaylar (olaylar.json) + sentezlenmiş deprem dokuları + müzik yatağı + miks zinciri."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim
from ses_lib import filt
SR = 48000
SB = [0, 11.6, 20.2, 26.2, 31.5, 37.5, 44.0, 50.4, 53.9, 59.4, 65.4, 74.5, 78.5, 85.1, 92.2, 95.4, 99.8, 103.0, 105.2]
rng = np.random.default_rng(41)
def norm(x, tepe=.8): return x / (np.max(np.abs(x)) + 1e-9) * tepe
def gur(sure, zarf, f=70, tr=9, tohum=0):
    """derin gümbürtü: alçak geçiren gürültü + 38 Hz sinüs, tremolo; zarf(t) 0–1"""
    n = int(sure * SR); t = np.arange(n) / SR; g = np.random.default_rng(tohum).standard_normal(n)
    x = filt(g, 'lowpass', f) * 6 + np.sin(2 * np.pi * 38 * t) * .8 + np.sin(2 * np.pi * 52 * t + 1) * .4
    return norm(x * (1 + .4 * np.sin(2 * np.pi * tr * t)) * np.array([zarf(a) for a in t]), .7)
def cizirti(sure=1.0):
    n = int(sure * SR); t = np.arange(n) / SR; f = 2600 - 1300 * (t / sure) ** .7
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .5 + filt(rng.standard_normal(n), 'highpass', 2000) * .5
    return norm(x * np.minimum(1, t / .03) * np.exp(-2.2 * t / sure), .6)
def carpma(sure=1.2):
    n = int(sure * SR); t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 'highpass', 600) * np.exp(-9 * t) + np.sin(2 * np.pi * 62 * t) * np.exp(-5 * t) * 1.4
    for k in range(5): x[int((.12 + .09 * k) * SR):] += filt(rng.standard_normal(n - int((.12 + .09 * k) * SR)), 'highpass', 2500) * np.exp(-30 * t[:n - int((.12 + .09 * k) * SR)]) * .3
    return norm(x, .85)
def gicirti(sure=2.0, hz=190):
    n = int(sure * SR); t = np.arange(n) / SR; vib = np.sin(2 * np.pi * 5 * t) * 6 + np.sin(2 * np.pi * 1.3 * t) * 14
    ph = 2 * np.pi * np.cumsum(hz + vib) / SR; x = (np.sin(ph) + .5 * np.sin(2 * ph) + .3 * np.sin(3 * ph)) * (.6 + .4 * np.sin(2 * np.pi * 3.1 * t))
    return norm(filt(x, 'lowpass', 1400) * np.sin(np.pi * t / sure) ** 1.5, .5)
def elektrik(sure=.9):
    n = int(sure * SR); t = np.arange(n) / SR; x = np.sin(2 * np.pi * 100 * t) * .4 * np.sign(np.sin(2 * np.pi * 13 * t))
    k = filt(rng.standard_normal(n), 'highpass', 1800) * (rng.random(n) > .985) * 6
    return norm((x + k) * np.exp(-2 * t / sure), .6)
def bip(sure=.12, hz=880, g=.6):
    n = int(sure * SR); t = np.arange(n) / SR
    return norm(np.sin(2 * np.pi * hz * t) * np.minimum(1, t / .004) * np.exp(-6 * t / sure), g)
def tik(hz=2200):
    n = int(.05 * SR); t = np.arange(n) / SR
    return norm((np.sin(2 * np.pi * hz * t) + .5 * filt(rng.standard_normal(n), 'highpass', 3000)) * np.exp(-90 * t), .5)
def tup(sure=.22, hz=68):
    """göğüs basısı: alçak darbe + yumuşak gürültü"""
    n = int(sure * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * (hz + 40 * np.exp(-30 * t)) * t) * np.exp(-14 * t) + filt(rng.standard_normal(n), 'lowpass', 500) * np.exp(-40 * t) * .5
    return norm(x, .8)
def sille(sure=.2):
    n = int(sure * SR); t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 'bandpass', [900, 2200]) * np.exp(-38 * t) * .7 + np.sin(2 * np.pi * 95 * t) * np.exp(-22 * t)
    return norm(x, .85)
def siren(sure=3.0):
    n = int(sure * SR); t = np.arange(n) / SR; f = np.where((t * 1.2) % 1 < .5, 720, 960).astype(float)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return norm(filt(np.sin(ph) + .3 * np.sin(2 * ph), 'lowpass', 2400) * np.minimum(1, t / .3) * np.minimum(1, (sure - t) / .5), .5)
def duz(sure=1.6, hz=1000):
    n = int(sure * SR); t = np.arange(n) / SR
    return norm(np.sin(2 * np.pi * hz * t) * np.minimum(1, t / .01) * np.minimum(1, (sure - t) / .2), .35)
def ruzgar(sure=3.0, tohum=0):
    n = int(sure * SR); t = np.arange(n) / SR
    g = filt(np.random.default_rng(tohum).standard_normal(n), 'bandpass', [300, 900])
    return norm(g * (.6 + .4 * np.sin(2 * np.pi * .3 * t)) * np.sin(np.pi * t / sure), .35)
def kumas(sure=.7):
    n = int(sure * SR); t = np.arange(n) / SR
    return norm(filt(rng.standard_normal(n), 'bandpass', [1200, 2800]) * np.sin(np.pi * t / sure) ** 1.4, .4)
T = Tasarim('../ses.mp3', sure=105.2, mod='pratik')
T.olaylardan('olaylar.json')
T.maskotlar('tepkiler.json')
# --- 1: yığılma, sessiz sokak, 112, ambulans, saat ---
T.ekle(ruzgar(11.0, 1), .2, 'darbe', .22, 540, 0)
T.ekle('rol:boom#3', 1.5, 'darbe', .8, 540, -2, 1.4)
T.ekle(tup(.3, 55), 1.55, 'darbe', .8, 700, 0)
T.ekle(carpma(.9), 1.58, 'darbe', .35, 700, 2)
for k, tt in enumerate([4.5, 4.75, 5.0]): T.ekle(bip(.14, [697 + 280, 770 + 280, 852 + 330][k], .5), tt, 'ui', .5, 540, 0)   # 1-1-2 tuşları
T.ekle(siren(3.0), 7.1, 'aksan', .22, 300, 0)
for k in range(10): T.ekle(tik(), 7.5 + .25 * k, 'ui', .45, 540, 0)                                                    # saat
T.ekle('rol:riser#1', 9.3, 'riser', .5, 540, 0, 1.0)
T.ekle('rol:boom#1', 10.1, 'darbe', .8, 540, -3, 1.4)
# --- 2–4: kontrol, sesleniş, bayılma/kendine gelme ---
T.ekle(kumas(.6), 11.6 + 5.0, 'whoosh', .4, 480, 0)                                                                     # omuzdan sarsma
for k in range(4): T.ekle(sille(.12), 11.6 + 4.95 + .12 * k, 'darbe', .2, 560, 0)
T.ekle('rol:dogru', 20.2 + .5, 'ui', .6, 540, 0, .7)                                                                    # gözünü açtı
T.ekle(kumas(.8), 20.2 + 4.8, 'whoosh', .4, 520, 0)                                                                     # bacaklar kalkar
T.ekle('rol:yanlis', 26.35, 'ui', .9, 540, 0, .7)
# --- 5: 112 çevirme + hoparlör ---
for k, tt in enumerate([32.5, 32.75, 33.0]): T.ekle(bip(.12, [1209, 1209, 1336][k] - 300, .5), tt, 'ui', .5, 540, 0)
T.ekle(duz(.8, 440), 33.35, 'aksan', .4, 480, 0)
T.ekle(tik(1400), 33.95, 'ui', .7, 540, 0)
# --- 6–8: nefes kontrolü, yan yatış ---
for k in range(8): T.ekle(tik(), 38.3 + 1.0 * k * .5, 'ui', .35, 540, 0)                                                # 10 sn sayacı
T.ekle('rol:yanlis', 41.5, 'ui', .9, 540, 0, .7)
T.ekle(kumas(1.1), 48.1, 'whoosh', .5, 540, 0)                                                                          # yan çevirme
for tt in [51.3, 51.7, 52.15, 52.6]: T.ekle('rol:pop', tt, 'ui', .35, 420, 0, .3)
# --- 9: kalp durdu ---
for tt in [54.3, 55.0, 55.5, 56.4, 56.9, 57.4]: T.ekle(bip(.09, 880, .5), tt, 'ui', .4, 540, 0)
T.ekle(duz(1.6, 1000), 57.92, 'aksan', .5, 540, 0)
# --- 10–11: kalp masajı ---
T.ekle(tup(), 63.8, 'darbe', .8, 540, 0)
for tt in [68.64, 69.98]: T.ekle(tup(), tt, 'darbe', .85, 540, 0)
for k in range(int((74.5 - 71.3) / .5) + 1): T.ekle(tup(), 71.3 + .5 * k, 'darbe', .8, 540, 0)
T.ekle('rol:boom#2', 73.78, 'darbe', .6, 540, -3, 1.0)
# --- 12–14: boğulma ---
T.ekle(kumas(.5), 76.95, 'whoosh', .35, 600, 0)
for k, a in enumerate([83.64, 83.95, 84.25, 84.55, 84.85]): T.ekle(sille(), a, 'darbe', .85, 540, 0)
for k in range(5): T.ekle(tup(.2, 80), 88.8 + .3 * k, 'darbe', .8, 540, 0)
T.ekle('rol:boom#1', 90.84, 'darbe', .7, 540, -3, 1.2)
# --- 15: yığılma + masaj ---
T.ekle(tup(.3, 55), 93.2, 'darbe', .8, 540, 0)
for k in range(int((95.4 - 94.15) / .5) + 1): T.ekle(tup(), 94.15 + .5 * k, 'darbe', .8, 540, 0)
# --- ✓ vurguları ---
for tt in [23.9, 30.5, 32.5, 40.0, 48.2, 50.8, 52.9]: T.ekle('rol:dogru', tt, 'ui', .8, 540, 0, .7)
T.muzik_yatak(SB, [(0, [('A', 2), ('E', 3), ('C', 4)]), (11.6, [('D', 2), ('A', 2), ('F', 3)]), (31.5, [('A', 2), ('E', 3), ('C', 4)]), (53.9, [('F', 2), ('C', 3), ('A', 3)]),
                   (59.4, [('D', 2), ('A', 2), ('F', 3)]), (74.5, [('E', 2), ('B', 2), ('G', 3)]), (92.2, [('C', 3), ('G', 3), ('E', 4)]), (99.8, [('A', 2), ('E', 3), ('C', 4), ('E', 4)])], nabiz=(59.4, 74.5, 120))
T.yaz('miks.wav')
