"""#40 Beklenen İstanbul depremi — SES TASARIMI v2: görüntüden türetilen olaylar (olaylar.json) + sentezlenmiş deprem dokuları + müzik yatağı + miks zinciri."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim
from ses_lib import filt
SR = 48000
SB = [0, 10.9, 19.0, 27.2, 34.8, 41.2, 48.2, 58.2, 68.0, 74.9, 79.8, 87.3, 91.0, 94.3, 97.7, 101.5, 104.6, 106.8]
rng = np.random.default_rng(40)
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
T = Tasarim('../ses.mp3', sure=106.8, mod='pratik')
T.olaylardan('olaylar.json')
T.maskotlar('tepkiler.json')
# --- deprem dokuları ---
T.ekle('rol:boom#3', .12, 'darbe', .8, 540, -2, 1.6)
T.ekle(gur(3.2, lambda a: np.exp(-a / 1.6) * min(1, a / .1), tohum=1), .1, 'darbe', .45, 540, 0)          # açılış sarsıntısı
T.ekle('rol:boom#1', 14.1, 'darbe', .85, 540, -3, 1.6)                                                  # deniz depremi çarpması
T.ekle(gur(2.4, lambda a: np.exp(-a / 1.1) * min(1, a / .05), tohum=2), 14.1, 'darbe', .5, 540, 0)
T.ekle(cizirti(1.0), 28.7, 'aksan', .7, 400, 0)                                                         # metro sert fren
T.ekle('rol:boom#2', 28.9, 'darbe', .55, 540, -4, 1.2)
T.ekle('rol:riser#1', 33.2, 'riser', .5, 540, 0, 1.4)                                                   # raya inme öncesi gerilim
T.ekle(elektrik(.9), 36.3, 'aksan', .85, 800, 0)                                                        # elektrik var
T.ekle('rol:gecis_hizli', 37.4, 'whoosh', .6, 300, 0, .8)                                               # karşıdan tren
T.ekle(gicirti(2.6, 170), 49.0, 'aksan', .75, 540, 0)                                                   # köprü esneme/gıcırtı
T.ekle(gicirti(2.2, 230), 52.2, 'aksan', .6, 540, 2)
T.ekle(cizirti(.8), 59.0, 'aksan', .65, 500, -2)                                                        # panik freni
T.ekle(carpma(1.2), 60.4, 'darbe', .85, 540, 0)                                                         # arkadan çarpma
for k, tt in enumerate([70.5, 71.0, 71.6, 72.05]):                                                      # düşen cam/tabela/saçak/baca
    T.ekle(carpma(.9), tt + .85, 'darbe', .55 + .05 * k, 300 + 150 * k, [3, -2, -5, -7][k])
T.ekle(gur(3.2, lambda a: min(1, a / 1.8) * .35, f=60, tr=7, tohum=3), 79.8, 'darbe', .35, 540, 0)     # evde: önce gümbürtü
T.ekle('rol:riser#2', 81.2, 'riser', .55, 540, 0, 1.8)
T.ekle('rol:boom#1', 83.0, 'darbe', .9, 540, -3, 1.6)                                                   # asıl sarsıntı
T.ekle(gur(4.6, lambda a: (1 - .25 * a / 4.6) * min(1, a / .08), f=85, tr=13, tohum=4), 83.0, 'darbe', .55, 540, 0)
T.ekle(carpma(1.0), 84.2, 'darbe', .6, 380, 2)                                                          # çerçeve düşer
# --- yanlış / doğru vurguları ---
for tt in [22.3, 35.1, 41.45, 58.45, 66.55, 73.0, 77.4, 87.45, 88.35, 89.2, 90.2]: T.ekle('rol:yanlis', tt, 'ui', .9, 540, 0, .7)
for tt in [23.6, 25.7, 43.9, 46.1, 61.4, 65.1, 75.1, 91.2, 93.05, 93.75, 94.5, 95.4, 96.1, 97.0]: T.ekle('rol:dogru', tt, 'ui', .9, 540, 0, .7)
T.muzik_yatak(SB, [(0, [('A', 2), ('E', 3), ('C', 4)]), (10.9, [('D', 2), ('A', 2), ('F', 3)]), (27.2, [('A', 2), ('E', 3), ('C', 4)]), (48.2, [('F', 2), ('C', 3), ('A', 3)]),
                   (68.0, [('D', 2), ('A', 2), ('F', 3)]), (79.8, [('E', 2), ('B', 2), ('G', 3)]), (94.3, [('C', 3), ('G', 3), ('E', 4)]), (101.5, [('A', 2), ('E', 3), ('C', 4), ('E', 4)])], nabiz=(79.8, 87.3, 84))
T.yaz('miks.wav')
