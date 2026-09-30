"""gubigufi ses kütüphanesi: özgün müzik + efekt sentezi (numpy/scipy)."""
import numpy as np
from scipy import signal

SR = 48000
_rng = np.random.default_rng(7)


def T(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=0.2, curve=4.0):
    """Atak + üstel bırakma zarfı."""
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    t = np.arange(n - na) / SR
    e[na:] = np.exp(-t / max(r, 1e-4) * (curve / 4))
    return e


def adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    na, nr = min(na, n), min(nr, n)  # kısa seslerde zarf taşmasın
    if na:
        e[:na] = np.sin(np.linspace(0, np.pi / 2, na)) ** 2
    if nr:
        e[-nr:] *= np.cos(np.linspace(0, np.pi / 2, nr)) ** 2
    return e


def filt(x, kind, f, order=2):
    sos = signal.butter(order, f, btype=kind, fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def noise(d):
    return _rng.standard_normal(int(d * SR))


def sweep_filter(x, f0, f1, kind='bandpass', q=0.35, blocks=64):
    """Frekansı zamanla kayan filtre (blok blok)."""
    out = np.zeros_like(x)
    n = len(x)
    bs = max(1, n // blocks)
    zi = None
    for i in range(0, n, bs):
        k = i / max(1, n - 1)
        f = f0 * (f1 / f0) ** k
        if kind == 'bandpass':
            lo, hi = max(30, f * (1 - q)), min(SR / 2 - 100, f * (1 + q))
            sos = signal.butter(2, [lo, hi], btype='bandpass', fs=SR, output='sos')
        else:
            sos = signal.butter(2, min(f, SR / 2 - 100), btype=kind, fs=SR, output='sos')
        if zi is None or zi.shape != (sos.shape[0], 2):
            zi = np.zeros((sos.shape[0], 2))
        out[i:i + bs], zi = signal.sosfilt(sos, x[i:i + bs], zi=zi)
    return out


# ---------------- efektler ----------------
def whoosh(d=0.6, f0=300, f1=3000, peak=0.6):
    n = noise(d)
    x = sweep_filter(n, f0, f1, 'bandpass', 0.5)
    t = np.linspace(0, 1, len(x))
    e = np.sin(np.pi * np.clip(t / peak, 0, 1) / 2) ** 2 * np.where(t > peak, np.cos(np.pi / 2 * (t - peak) / (1 - peak)) ** 2, 1)
    return x * e / (np.abs(x).max() + 1e-9)


def boom(d=1.6, f=48, amt=1.0):
    t = T(d)
    fr = f * (1 + 1.5 * np.exp(-t * 18))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) * np.exp(-t * 3.2)
    nz = filt(noise(d), 'lowpass', 400) * np.exp(-t * 9) * 0.6
    y = (x + nz) * amt
    return y / (np.abs(y).max() + 1e-9)


def hit(d=0.5, bright=2500):
    t = T(d)
    x = filt(noise(d), 'lowpass', bright) * np.exp(-t * 25)
    x += np.sin(2 * np.pi * 90 * t) * np.exp(-t * 18) * 0.8
    return x / (np.abs(x).max() + 1e-9)


def tick(f=2200, d=0.05):
    t = T(d)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 90) + filt(noise(d), 'highpass', 3000) * np.exp(-t * 200) * 0.4
    return x / (np.abs(x).max() + 1e-9)


def pop(f=520, d=0.18):
    t = T(d)
    fr = f * (1 + 1.2 * np.exp(-t * 40))
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 22)
    return x / (np.abs(x).max() + 1e-9)


def bell(f=1760, d=1.6, bright=1.0):
    t = T(d)
    parts = [(1, 1), (2.76, .5 * bright), (5.4, .25 * bright), (8.93, .12 * bright)]
    x = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * (2.2 + m * 1.1)) for m, a in parts)
    x *= np.minimum(1, t / 0.002)
    return x / (np.abs(x).max() + 1e-9)


def shatter(d=0.9, metal=False):
    t = T(d)
    x = np.zeros(len(t))
    for i in range(26):
        st = int(abs(_rng.normal(0, 0.09)) * SR)
        ln = int(_rng.uniform(.02, .12) * SR)
        if st + ln >= len(x):
            continue
        b = filt(_rng.standard_normal(ln), 'bandpass', sorted([_rng.uniform(900, 3000), _rng.uniform(3200, 9000)]))
        x[st:st + ln] += b * np.exp(-np.arange(ln) / SR * 40) * _rng.uniform(.3, 1)
    x += hit(d, 1800) * 0.5
    if metal:
        for f in (1230, 1847, 2631, 3712):
            x += np.sin(2 * np.pi * f * t) * np.exp(-t * 6) * 0.25
    return x / (np.abs(x).max() + 1e-9)


def swish(d=0.22):
    return whoosh(d, 1500, 7000, 0.35)


def scrape(d=1.2, f=180):
    n = noise(d)
    mod = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * T(d)) * np.sin(2 * np.pi * 1.3 * T(d))
    x = filt(n, 'bandpass', [f, f * 5]) * mod * adsr(len(n), 0.1, 0.3)
    return x / (np.abs(x).max() + 1e-9)


def rumble(d=2.0, f=60):
    x = filt(noise(d), 'lowpass', f * 3) * adsr(int(d * SR), d * .3, d * .4)
    x += np.sin(2 * np.pi * f * T(d)) * adsr(int(d * SR), d * .3, d * .4) * .3
    return x / (np.abs(x).max() + 1e-9)


def riser(d=1.0, f0=200, f1=1600):
    t = T(d)
    fr = f0 * (f1 / f0) ** (t / d)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * (t / d) ** 2 * 0.4 + sweep_filter(noise(d), f0 * 2, f1 * 4, 'bandpass', .4) * (t / d) ** 2
    x *= adsr(len(t), 0.01, 0.05)
    return x / (np.abs(x).max() + 1e-9)


def rewind(d=1.5):
    t = T(d)
    fr = 900 + 700 * np.sin(2 * np.pi * (3 + 9 * t / d) * t)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * 0.25
    x += sweep_filter(noise(d), 6000, 400, 'bandpass', .5) * 0.8
    x *= adsr(len(t), 0.25, 0.2)
    return x / (np.abs(x).max() + 1e-9)


def steps(d=1.0, rate=4.0, f=900):
    x = np.zeros(int(d * SR))
    k = 0.0
    while k < d - 0.08:
        s = filt(noise(0.07), 'bandpass', [f * .5, f * 2]) * np.exp(-T(0.07) * 60)
        i = int(k * SR)
        x[i:i + len(s)] += s * _rng.uniform(.6, 1)
        k += 1 / rate
    return x / (np.abs(x).max() + 1e-9)


def flaps(d=1.0, rate=4.0):
    x = np.zeros(int(d * SR))
    k = 0.0
    while k < d - 0.2:
        s = filt(noise(0.18), 'lowpass', 900) * np.sin(np.pi * np.linspace(0, 1, int(.18 * SR))) ** 2
        i = int(k * SR)
        x[i:i + len(s)] += s * (0.4 + 0.6 * k / d)
        k += 1 / rate
    return x / (np.abs(x).max() + 1e-9)


def projector(d=6.0):
    t = T(d)
    clicks = (np.sin(2 * np.pi * 24 * t) > 0.92).astype(float)
    x = filt(clicks * noise(d), 'bandpass', [800, 5000]) * 0.7 + filt(noise(d), 'lowpass', 300) * 0.3
    crackle = (_rng.random(len(t)) > 0.9994) * _rng.standard_normal(len(t)) * 3
    x += filt(crackle, 'highpass', 1500)
    return x * adsr(len(t), .3, .5) / (np.abs(x).max() + 1e-9)


def crackle_fire(d=1.0):
    t = T(d)
    c = (_rng.random(len(t)) > 0.996) * _rng.standard_normal(len(t))
    x = filt(c, 'bandpass', [1500, 7000]) + filt(noise(d), 'bandpass', [200, 900]) * 0.15
    return x * adsr(len(t), d * .3, .2) / (np.abs(x).max() + 1e-9)


def hum(d=1.5, f=220):
    t = T(d)
    x = sum(np.sin(2 * np.pi * f * m * t * (1 + .002 * np.sin(2 * np.pi * 5 * t))) / m for m in (1, 2, 3))
    return x * adsr(len(t), .1, .3) / (np.abs(x).max() + 1e-9)


# ---------------- müzik ----------------
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}


def hz(name, octv):
    return 440 * 2 ** ((NOTE[name] + 12 * (octv + 1) - 69) / 12)


def pad(freqs, d, bright=1.0):
    t = T(d)
    x = np.zeros(len(t))
    for f in freqs:
        for det in (-0.12, 0.0, 0.13):
            ff = f * 2 ** (det / 12)
            for m, a in ((1, 1), (2, .35 * bright), (3, .15 * bright), (4, .07 * bright)):
                x += a * np.sin(2 * np.pi * ff * m * t + _rng.uniform(0, 6.28))
    x *= 1 + 0.15 * np.sin(2 * np.pi * 0.23 * t)
    return x / (np.abs(x).max() + 1e-9)


def pluck(f, d=2.5, bright=0.5):
    """Karplus-Strong tel (kanun/ud benzeri)."""
    n = int(d * SR)
    p = int(SR / f)
    buf = _rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * (0.996 - 0.004 * (1 - bright))
    out = filt(out, 'lowpass', 2500 + 4000 * bright)
    return out * np.minimum(1, np.arange(n) / 40) / (np.abs(out).max() + 1e-9)


def soft_kick(d=0.5):
    t = T(d)
    fr = 55 * (1 + 2 * np.exp(-t * 35))
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 9)


# ---------------- miks ----------------
class Mix:
    def __init__(self, dur):
        self.n = int(dur * SR)
        self.bus = {k: np.zeros(self.n) for k in ('music', 'sfx')}
        self.pan = np.zeros(self.n)

    def add(self, bus, x, at, gain=1.0):
        i = int(at * SR)
        if i >= self.n:
            return
        j = min(self.n, i + len(x))
        self.bus[bus][max(i, 0):j] += (x * gain)[max(0, -i):j - i]


def db(v):
    return 10 ** (v / 20)


def voice_env(v, att=0.02, rel=0.35):
    """Seslendirme zarfı (ducking için)."""
    a = np.abs(v)
    a = filt(a, 'lowpass', 20)
    e = np.zeros_like(a)
    ka, kr = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR))
    prev = 0.0
    for i in range(0, len(a), 32):  # 32 örnekte bir (hızlı)
        x = a[i]
        k = ka if x > prev else kr ** 32
        prev = k * prev + (1 - k) * x if x > prev else kr ** 32 * prev + (1 - kr ** 32) * x
        e[i:i + 32] = prev
    return e / (e.max() + 1e-9)


# =====================================================================
# MASKOT İMZA SESLERİ — KALICI. Bütün videolarda aynı kalır, değiştirme.
# Gubi (amber pırıltı): camsı/kristal "ting" ailesi — saf sinüs + 2.76x
#   çan kısmisi, hep YUKARI kıvrılır (merak = yükselen soru), Mi majör pentatonik.
# Gufi (kırmızı kare): lastik/tombul "bup-boing" ailesi — alçak üçgen dalga,
#   hızlı perde düşüşü + yay titreşimi (vibrato), sıcak ve komik.
# Kullanım: M.add('sfx', maskot_ses('gubi', 'aha'), t, .5)  — tepki zamanıyla aynı an.
# Tipler: sasir · zipla · mutlu · aha · korku · selam · uzgun · kararli · merak ·
#         isaret · alkis · gozKapa · dusun · omuzSilk · kahkaha · goster · donus · yaklas (kameraya yaklaşma)
# =====================================================================
def _gubi_ton(f0, f1, d=.32, parla=1.0):
    t = T(d); f = f0 * (f1 / f0) ** np.minimum(1, t / (d * .45))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + .28 * parla * np.sin(2.76 * ph) * np.exp(-t * 14) + .12 * parla * np.sin(5.4 * ph) * np.exp(-t * 22)
    return x * env(len(t), .004, d * .45) / 1.3


def _gufi_ton(f0, f1, d=.22, vib=0.0, vf=18):
    t = T(d); f = f0 * (f1 / f0) ** np.minimum(1, t / d) * (1 + vib * np.sin(2 * np.pi * vf * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = signal.sawtooth(ph, .5) * .8 + .5 * np.sin(ph)                # tombul üçgen gövde
    x = filt(x, 'lowpass', 1500)
    return x * env(len(t), .006, d * .5) / 1.1


def _dizi(parcalar):
    n = max(int(at * SR) + len(x) for at, x in parcalar)
    o = np.zeros(n)
    for at, x in parcalar:
        i = int(at * SR); o[i:i + len(x)] += x
    return o / max(1e-9, np.abs(o).max()) * .9


GUBI_NOTA = [659.3, 740.0, 830.6, 987.8, 1108.7, 1318.5, 1480, 1661, 1975.5]  # Mi majör pentatonik


def maskot_ses(kim, tip='merak'):
    g = GUBI_NOTA
    if kim == 'gubi':
        P = {
            'merak':   [(0, _gubi_ton(g[3], g[5], .35))],                                   # "ting?" yükselen
            'sasir':   [(0, _gubi_ton(g[2], g[7], .22)), (.12, _gubi_ton(g[7], g[8], .4))],
            'zipla':   [(0, _gubi_ton(g[4], g[6], .16))],
            'mutlu':   [(i * .07, _gubi_ton(g[3 + i], g[3 + i], .3)) for i in range(4)],     # parlak tril yukarı
            'aha':     [(i * .06, _gubi_ton(g[i * 2], g[i * 2], .5, 1.3)) for i in range(5)] + [(.32, _gubi_ton(g[8], g[8] * 1.06, .7, 1.4))],
            'korku':   [(i * .09, _gubi_ton(g[5] * (1 - i * .03), g[4], .14)) for i in range(4)],
            'selam':   [(0, _gubi_ton(g[3], g[5], .18)), (.14, _gubi_ton(g[5], g[6], .26))],
            'uzgun':   [(0, _gubi_ton(g[4], g[1], .6, .6))],
            'kararli': [(0, _gubi_ton(g[3], g[3], .12)), (.12, _gubi_ton(g[6], g[6], .35))],
            'isaret':  [(0, _gubi_ton(g[4], g[7], .18))],                                   # "tiu!" gösterir
            'alkis':   [(i * .11, _gubi_ton(g[5 + i % 2], g[5 + i % 2], .09, 1.4)) for i in range(5)],
            'gozKapa': [(0, _gubi_ton(g[5], g[2], .3, .6))],
            'dusun':   [(0, _gubi_ton(g[2], g[3], .35, .5)), (.4, _gubi_ton(g[3], g[4], .35, .5))],  # "hımm"
            'omuzSilk':[(0, _gubi_ton(g[4], g[5], .14)), (.16, _gubi_ton(g[5], g[3], .22))],
            'kahkaha': [(i * .09, _gubi_ton(g[6 - i % 2], g[6 - i % 2], .08)) for i in range(7)],
            'goster':  [(0, _gubi_ton(g[3], g[3], .1)), (.1, _gubi_ton(g[5], g[5], .1)), (.2, _gubi_ton(g[8], g[8], .5, 1.3))],  # "ta-da!"
            'donus':   [(0, _gubi_ton(g[1], g[8], .6, .8))],
            'yaklas':  [(0, _gubi_ton(g[0], g[5], .45, .7))],
        }
    else:
        b = 196.0  # Sol3 taban
        P = {
            'merak':   [(0, _gufi_ton(b * 1.2, b * 1.5, .2))],                              # "bup?"
            'sasir':   [(0, _gufi_ton(b * 2.2, b * .9, .16)), (.13, _gufi_ton(b * 1.1, b * 1.8, .3, .06))],  # "boi-yoing!"
            'zipla':   [(0, _gufi_ton(b * 1.6, b * .8, .14)), (.16, _gufi_ton(b * .9, b * .7, .12))],        # yay + iniş
            'mutlu':   [(i * .12, _gufi_ton(b * (1.3 + .2 * i), b * (1.1 + .2 * i), .12)) for i in range(3)],  # "bup-bup-bup"
            'aha':     [(0, _gufi_ton(b, b * 2, .25, .03))],
            'korku':   [(0, _gufi_ton(b * 1.4, b * 1.2, .7, .12, 22))],                     # titrek "brrr"
            'selam':   [(0, _gufi_ton(b * 1.5, b * 1.2, .12)), (.14, _gufi_ton(b * 1.2, b * 1.6, .2))],
            'uzgun':   [(0, _gufi_ton(b * 1.3, b * .7, .6, .02, 6))],                       # inen "wuuuh"
            'kararli': [(0, _gufi_ton(b * 1.2, b * 1.2, .1)), (.12, _gufi_ton(b * 1.2, b * 1.2, .16))],
            'isaret':  [(0, _gufi_ton(b * 1.3, b * 1.9, .16))],
            'alkis':   [(i * .11, _gufi_ton(b * 1.8, b * 1.5, .07)) for i in range(5)],
            'gozKapa': [(0, _gufi_ton(b * 1.6, b * 1.1, .4, .08, 14))],
            'dusun':   [(0, _gufi_ton(b * 1.1, b * 1.2, .45, .01, 5))],               # "hmmm"
            'omuzSilk':[(0, _gufi_ton(b * 1.3, b * 1.5, .12)), (.14, _gufi_ton(b * 1.5, b * 1.1, .2))],
            'kahkaha': [(i * .1, _gufi_ton(b * (1.6 - .05 * i), b * (1.3 - .05 * i), .08)) for i in range(7)],
            'goster':  [(0, _gufi_ton(b * 1.2, b * 1.2, .09)), (.1, _gufi_ton(b * 1.5, b * 1.5, .09)), (.2, _gufi_ton(b * 1.2, b * 2.0, .35, .03))],
            'donus':   [(0, _gufi_ton(b * .9, b * 1.9, .5, .05, 10))],
            'yaklas':  [(0, _gufi_ton(b * .8, b * 1.5, .4, .02))],
        }
    return _dizi(P.get(tip, P['merak']))



# =====================================================================
# ft-motion'dan uyarlananlar (github.com/imserhatdemir/ft-motion, MIT) — bizim miks yapımıza göre
# =====================================================================
def reverb(x, oran=.25, sure=2.2, sonum=.5, parlak=5500):
    """Hafif oda yankısı (gürültü IR ile konvolüsyon). Pad/çan gibi uzun seslerde; konuşmaya UYGULAMA."""
    rng = np.random.default_rng(11); t = T(sure)
    ir = rng.standard_normal(len(t)) * np.exp(-t / sonum); ir = filt(ir, 'lowpass', parlak); ir[: int(.015 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    wet = signal.fftconvolve(x, ir)[: len(x)]
    return x + oran * filt(wet, 'highpass', 200)


def sidechain(x, vurus_zamanlari, derinlik=.55, birakma=.11):
    """Vuruşlarda (kick/darbe) müziği kısa süre kıs → vuruş öne çıkar ('pompalama')."""
    t = np.arange(len(x)) / SR; sc = np.ones(len(x))
    for tk in vurus_zamanlari:
        m = t >= tk; sc[m] = np.minimum(sc[m], 1 - derinlik * np.exp(-(t[m] - tk) / birakma))
    return x * sc


def sayac_tiklari(M, t0, sure, adet, f0=1800, f1=3300, kazanc=.15, bus='sfx'):
    """FX.sayac ile eşleşen, expo gibi yavaşlayan ve inceleşen tıklar."""
    for k in range(adet):
        x = k / max(1, adet - 1); tt = t0 + sure * (x ** 2.2)
        M.add(bus, tick(f0 + (f1 - f0) * x, .025), tt, kazanc)


def damga(f=110, sure=.35):
    """Yazı çarpması ('stamp'): perdeli tom + kısa kick — büyük başlık/rakam inişinde."""
    t = T(sure); tom = np.sin(2 * np.pi * np.cumsum(f * (1 + .6 * np.exp(-t * 30))) / SR) * np.exp(-t / .13)
    return (tom + soft_kick(sure)[: len(t)] * .7) / 1.7


def riser_hedefli(t0, t1, f0=300, f1=4000):
    """TAM t1 anında biten yükseliş (ft-motion riser mantığı): M.add('sfx', riser_hedefli(a, b), a)."""
    return riser(max(.1, t1 - t0), f0, f1)
