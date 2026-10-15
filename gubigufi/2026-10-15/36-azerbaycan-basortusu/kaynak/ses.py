"""#36 Azerbaycan'la aramızda ne oluyor — CİDDİ GÜNDEM tonu (çocuksu değil): koyu gerilim zemini (kayıtlı drone + pad), melodi yok;
efektler kullanıcının seçtiği KANAL SESLERİ (sfx_lib ROL). Maskot imza sesleri bu videoda KAPALI (ciddi haber, #23 hassas şablon gibi)."""
import sys, json, subprocess
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, '../../../marka')
from ses_lib import *
from sfx_lib import Y

FF = open('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath').read().strip()
LS = 59.77
M = Mix(LS + 2.95)
subprocess.run([FF, '-y', '-loglevel', 'error', '-i', '../ses.mp3', '-ac', '1', '-ar', str(SR), 'ses48.wav'], check=True)
_, v = wavfile.read('ses48.wav'); v = v.astype(np.float64) / 32768
voice = np.zeros(M.n); voice[:min(len(v), M.n)] = v[:M.n]

# --- MÜZİK YATAĞI: kayıtlı gerilim drone'u (döngü) + koyu pad; umut bölümünde (51.5–57.1) sıcak pad; sonda tek akor
def dongu(x, sure, xf=.4):
    n = int(sure * SR); o = np.zeros(n); f = int(xf * SR); p = 0
    while p < n:
        seg = x.copy(); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
        e = min(len(seg), n - p); o[p:p + e] += seg[:e]; p += len(seg) - f
    return o
dr = dongu(Y('mb:ambience/tension-drone-sub-03'), 51.6)
dr *= np.concatenate([np.linspace(0, 1, int(1.5 * SR)), np.ones(len(dr) - int(3.5 * SR)), np.linspace(1, 0, int(2 * SR))])
M.add('music', filt(dr, 'lowpass', 2500), 0, .55)
def pd(fs, a, d, g=.25, lp=1100): M.add('music', filt(pad(fs, d, .4), 'lowpass', lp) * adsr(int(d * SR), 1.2, 1.4), a, g)
pd([hz('A', 2), hz('E', 3), hz('C', 3)], 0, 15.1, .16, 800)
pd([hz('F', 2), hz('C', 3), hz('A', 3)], 15.0, 10.9, .16, 800)
pd([hz('D', 2), hz('A', 2), hz('F', 3)], 25.8, 22.2, .18, 700)
pd([hz('F', 2), hz('C', 3), hz('A', 3)], 47.9, 3.7, .16, 800)
pd([hz('C', 3), hz('G', 3), hz('E', 4)], 51.4, 6.0, .22, 1500)
pd([hz('C', 3), hz('G', 3), hz('E', 4), hz('C', 4)], 57.1, 5.5, .24, 1600)
# yavaş, ağır nabız (yalnız kriz bölümlerinde, kick — melodi yok)
for t in np.arange(33.6, 47.6, 60 / 72): M.add('music', soft_kick(.4), t, .12)

S = lambda x, at, g=.5: M.add('sfx', x, at, g)
# --- KANAL SESLERİ (kullanıcı seçimi): rol:gecis / pop / darbe / boom / riser / damga / kagit / dogru / yanlis
S(Y('rol:boom#3', 2.5), .0, .45)                                     # açılış: dramatik darbe
S(Y('rol:pop'), .3, .22); S(Y('rol:darbe#3', 1.0), 2.0, .3)          # "?" etiketi, "TEK MİLLET İKİ DEVLET"
S(Y('rol:riser#2', 2.0), 2.4, .25)                                   # çatlağa doğru gerilim
S(Y('mk:cam_kir', 1.4), 4.3, .4); S(Y('rol:boom#1', 2.2), 5.15, .5)  # fotoğraf çatlar + ayrılır
S(Y('rol:gecis'), 6.3, .3); S(Y('rol:kagit'), 8.3, .35)              # okul / karar kâğıdı
S(Y('rol:kagit#1', .8), 11.1, .25); S(Y('rol:yanlis'), 11.9, .3)     # büyüteç / "0 sonuç"
S(Y('mk:metal_izgara'), 12.8, .4); S(Y('mk:kapi_mandal'), 13.05, .35); S(Y('rol:darbe', 1.2), 13.2, .38)  # kapı kapanır, DERSE ALINMADI
S(Y('rol:gecis#1'), 15.05, .25); S(Y('rol:pop#1'), 18.05, .3)        # Gubi yaklaşır, "BEN!"
for i, a in enumerate((20.4, 21.0, 21.75)): S(Y(f'rol:pop#{i}'), a, .26)   # KIYAFET · İNANÇ · ÖZGÜRLÜK
S(Y('rol:boom#2', 1.8), 22.6, .38); S(Y('rol:pop#1'), 22.75, .16)    # 37 GÖZALTI (+ takip çipi)
for i in range(10): S(Y('rol:tik', .2), 22.65 + i * .12, .18)
S(Y('rol:yanlis'), 23.95, .25); S(Y('rol:pop'), 24.45, .22)          # erişim kısıtlandı
S(Y('rol:gecis#2'), 25.8, .28); S(Y('rol:pop#1'), 26.2, .2)          # Aliyev
S(Y('rol:darbe#1', 1.2), 28.7, .38); S(Y('rol:darbe#2', 1.2), 29.9, .35); S(Y('rol:darbe#3', 1.0), 30.3, .28)  # alıntılar
S(Y('rol:gecis#3', .6), 31.75, .2)                                   # Gufi öne (çizgi film sesi YOK)
S(Y('rol:riser', 1.6), 31.9, .25); S(Y('rol:boom', 3.0), 33.5, .58)  # ASIL BOMBA
S(Y('rol:kagit#1', .8), 34.65, .3); S(Y('rol:gecis#1'), 34.6, .22); S(Y('rol:darbe#3', 1.0), 34.75, .28)
for i in range(14): S(Y(f'kn:impact-sounds/impactMetal_light_00{i % 5}', .4), 36.15 + i * .115, .15)  # mermiler
S(Y('rol:damga'), 37.65, .5); S(Y('rol:pop'), 39.15, .25)            # ÖDENDİ / fiyat etiketi
for i, a in enumerate((40.05, 40.48, 40.91)): S(Y(f'rol:darbe#{i}', .8), a, .25 + .04 * i)  # ×2 ×3 ×5
S(Y('rol:kagit'), 41.75, .35); S(Y('rol:gecis#3'), 42.7, .28)        # zarf / harita
S(Y('rol:pop#1'), 43.45, .22); S(Y('rol:darbe#1', 1.0), 46.05, .3); S(Y('rol:kagit#1', .6), 46.35, .22)
S(Y('rol:gecis'), 47.95, .28); S(Y('rol:damga'), 49.15, .5); S(Y('rol:damga#1', .6), 50.35, .3)   # Ankara / damgalar
S(Y('rol:gecis#1'), 51.45, .22); S(Y('rol:pop'), 53.2, .25); S(Y('rol:dogru', 1.0), 53.3, .15)    # anket kartı
S(Y('rol:pop#1'), 55.0, .22); S(Y('rol:pop'), 55.3, .2)
S(Y('rol:gecis#2'), 57.1, .25); S(Y('rol:riser#2', 2.0), 58.6, .18)  # takip → logo

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
