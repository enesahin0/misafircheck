# audio_template.py — deterministic synthesized soundtrack
# Adapt per project: BPM, root notes, patterns, section boundaries, DUR.
# Usage: python audio.py  ->  showreel_audio.wav  (SR x DUR samples, stereo)
# Rules: exact duration match to video; scene boundaries on bar lines;
#        layered structure (kick/hat/clap/bass/arp/riser/impact/sidechain).
import numpy as np
import wave

SR = 48000
DUR = 15.0                     # EDIT — match video exactly
N = int(SR * DUR)
BPM = 120                      # EDIT — match edit rhythm
BEAT = 60.0 / BPM
SECTION = 2.5                  # EDIT — seconds per scene
rng = np.random.default_rng(20260927)   # EDIT seed per project

def sec(t): return min(999, int(t / SECTION))

def env_exp(n, decay):
    return np.exp(-np.arange(n) / (SR * decay))

def place(buf, sig, start):
    s = int(start * SR)
    if s >= N: return
    L = min(len(sig), N - s)
    if L > 0: buf[s:s + L] += sig[:L]

# ---------- instrument generators (KEEP, tweak params) ----------
def kick(amp=1.0, f0=160.0, f1=45.0, dec=0.32):
    n = int(SR * dec)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 22)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-tt / (dec * 0.42))
    cl = int(SR * 0.004)
    x[:cl] += rng.normal(0, 0.5, cl) * np.exp(-np.arange(cl) / (SR * 0.0012))
    return x * amp

def hat(dec=0.05, amp=1.0):
    n = int(SR * dec)
    nz = rng.normal(0, 1, n)
    x = np.diff(nz, prepend=nz[0]) * 0.5
    x *= env_exp(n, dec * 0.4)
    return x * amp

def clap(amp=1.0):
    n = int(SR * 0.22)
    nz = rng.normal(0, 1, n)
    x = nz * env_exp(n, 0.055)
    for off in (0.012, 0.024):
        s = int(off * SR)
        if s < n: x[s:] += nz[:n - s] * env_exp(n - s, 0.05) * 0.7
    y = x - np.convolve(x, np.ones(9) / 9, mode='same')
    return y * amp

def bass(freq, dur=0.42, amp=1.0):
    n = int(SR * dur)
    tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * freq * tt)
         + 0.35 * np.sin(4 * np.pi * freq * tt)
         + 0.15 * np.sin(6 * np.pi * freq * tt))
    x *= env_exp(n, 0.15) * (1 - np.exp(-tt * 400))
    return x * amp

def arp(freq, amp=1.0, dec=0.16):
    n = int(SR * dec)
    tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * freq * tt)
         + 0.3 * np.sin(6 * np.pi * freq * tt)
         + 0.15 * np.sin(10 * np.pi * freq * tt))
    x *= env_exp(n, 0.055) * (1 - np.exp(-tt * 900))
    return x * amp

def boom(amp=1.0):
    return kick(amp, 110.0, 32.0, 1.15)

def crash(amp=1.0, dec=1.2):
    n = int(SR * dec)
    nz = rng.normal(0, 1, n)
    x = np.diff(nz, prepend=nz[0]) * 0.5
    x *= env_exp(n, dec * 0.30)
    return x * amp

def riser(dur=0.9, amp=0.16):
    n = int(SR * dur)
    tt = np.arange(n) / SR
    x = rng.normal(0, 1, n) * (0.25 + 0.75 * (tt / dur) ** 2) * amp
    f0 = 200 * 2 ** (tt / dur * 5)
    x += np.sin(2 * np.pi * np.cumsum(f0) / SR) * amp * 0.55 * (tt / dur) ** 2
    return x

def pad(amp=0.10, start=12.6, mid=14.0, end=14.6):
    tt = np.arange(N) / SR
    x = np.zeros(N)
    for f in (220.0, 277.18, 329.63, 440.0):   # EDIT — chord tones
        a = amp / 4
        x += a * np.sin(2 * np.pi * f * tt + f) * (0.9 + 0.1 * np.sin(2 * np.pi * 0.15 * tt))
    envl = np.clip((tt - start) / 0.8, 0, 1) * np.clip((end - tt) / 0.6, 0, 1)
    return x * envl

# ---------- arrangement (EDIT per project) ----------
mix = np.zeros(N)
duck = np.zeros(N)
send = np.zeros(N)

# kick on every beat (edit: breakdown window, intro volume)
for b in range(int(DUR / BEAT) + 1):
    t0 = b * BEAT
    if t0 >= DUR - 0.5: break
    s = sec(t0)
    amp = 0.55 if s == 0 else 0.95
    k = kick(amp)
    place(mix, k, t0)
    place(duck, np.abs(k), t0)

# clap on beats 2&4 from second scene
for b in range(int(DUR / BEAT) + 1):
    t0 = b * BEAT
    if t0 < SECTION or b % 2 != 1: continue
    c = clap(0.5)
    place(mix, c, t0)
    place(send, c * 0.35, t0)

# hats: 8ths everywhere, 16ths in high-energy window
for e in range(int(DUR / (BEAT / 2)) + 1):
    t0 = e * BEAT / 2
    if t0 >= DUR - 0.5: break
    accent = e % 2 == 1
    amp = 0.32 if accent else 0.18
    place(mix, hat(0.045, amp), t0)

# bass: root notes per bar — EDIT roots
roots = [55.0, 55.0, 65.41, 49.0]
for b in range(int(DUR / BEAT) + 1):
    t0 = b * BEAT
    if t0 >= DUR - 1.0: break
    f = roots[(b // 2) % len(roots)]
    place(mix, bass(f, 0.42, 0.5), t0)

# arp 16ths — EDIT scale + pattern + section gains
pent = [220.0, 261.63, 329.63, 392.0, 440.0]
pat = [0, 2, 3, 1, 4, 2, 0, 3, 1, 4, 3, 2, 0, 1, 2, 4]
gains = [0.0, 0.15, 0.22, 0.13, 0.26, 0.09]
step = BEAT / 4
i = 0
t0 = 1.25
while t0 < DUR - 0.6:
    s = sec(t0)
    f = pent[pat[i % 16]]
    if s >= 3: f *= 2
    a = arp(f, gains[min(s, 5)], 0.16)
    place(mix, a, t0)
    place(send, a * 0.3, t0)
    i += 1
    t0 += step

# impacts at scene boundaries
for tb in np.arange(SECTION, DUR - 0.1, SECTION):
    place(mix, boom(0.5), tb)
    place(mix, crash(0.28), tb)
    place(send, crash(0.28) * 0.25, tb)

# risers into boundaries
for tb in np.arange(SECTION, DUR - 0.1, SECTION):
    place(mix, riser(0.9, 0.15), tb - 0.9)

# outro pad
mix += pad()

# ---------- mix bus (KEEP) ----------
# sidechain duck
duck /= (duck.max() + 1e-9)
mix *= (1 - 0.55 * np.clip(duck * 1.6, 0, 1))

# dotted-8th delay on send
dly = np.zeros(N)
ds = int(0.375 * SR)
s = send.copy()
fb = 0.38
for rep in range(6):
    if ds * (rep + 1) >= N: break
    shifted = np.zeros(N)
    L = N - ds * (rep + 1)
    shifted[ds * (rep + 1):] = s[:L] * (fb ** rep)
    dly += shifted
kern = np.exp(-np.arange(int(SR * 0.002)) / (SR * 0.0006))
kern /= kern.sum()
dly = np.convolve(dly, kern, mode='same')
mix += dly * 0.9

# master: soft clip, normalize, fades
mix = np.tanh(mix * 1.15)
mix /= max(np.abs(mix).max(), 1e-9) / 0.97
fi = int(SR * 0.02)
mix[:fi] *= np.linspace(0, 1, fi)
fo = int(SR * 0.18)
mix[-fo:] *= np.linspace(1, 0, fo)

# stereo (subtle haas)
stereo = np.zeros((N, 2))
stereo[:, 0] = mix
stereo[:, 1] = np.roll(mix, 170) * 0.995 + mix * 0.005

pcm = (stereo * 32767).astype('<i2')
with wave.open('showreel_audio.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(f'OK — {DUR}s, {N} samples, peak {np.abs(stereo).max():.3f}')
