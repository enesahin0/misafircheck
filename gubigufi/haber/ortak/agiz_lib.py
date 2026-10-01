"""GubiGufi HABER — dudak senkronu izi (yalnızca haber projesi)."""
import numpy as np
from ses_lib import SR


# =====================================================================
# DUDAK SENKRONU — konuşan maskotun ağız izi (30 fps). Haber formatında
# Gubi = sunucu sesleri (1, 3), Gufi = saha sesi (2). Hece hece açılıp kapanır.
def agiz_izi(v, toplam_s, fps=30, bas=0.0):
    """v: mono ses (SR), bas: sesin video içindeki başlangıç saniyesi → [0..1] listesi (toplam_s*fps uzunlukta)."""
    n = int(toplam_s * fps) + 1
    out = np.zeros(n)
    hop = SR // fps
    r = np.array([np.sqrt(np.mean(v[i:i + hop] ** 2)) if i < len(v) else 0 for i in range(0, len(v), hop)])
    if len(r) == 0: return [0.0] * n
    ref = np.percentile(r[r > 1e-4], 92) if np.any(r > 1e-4) else 1
    a = np.clip((r / (ref + 1e-9) - .12) / .88, 0, 1)
    sm = np.zeros_like(a); p = 0.0
    for i, x in enumerate(a):                     # hızlı açılış, orta kapanış
        p = x if x > p else p * .55 + x * .45
        sm[i] = p
    i0 = int(round(bas * fps))
    k = min(len(sm), n - i0)
    if k > 0: out[i0:i0 + k] = sm[:k]
    return [round(float(x), 3) for x in out]

def agiz_js_yaz(yol, izler):
    """izler: {'gubi': [...], 'gufi': [...]} → window.AGIZ js dosyası."""
    import json as _j
    open(yol, 'w').write('window.AGIZ = ' + _j.dumps(izler, separators=(',', ':')) + ';\n')
