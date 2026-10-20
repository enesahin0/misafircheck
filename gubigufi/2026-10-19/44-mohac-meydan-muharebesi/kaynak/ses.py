"""#44 Mohaç — SES (kullanıcı kuralı): otomatik efektler (kalin=True, ince ses yok), sentez YOK (yalnızca KÜTÜPHANE), arkada çok derin yavaş kütüphane yatağı, elle ek vurgu çok az."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim, SR
from sfx_lib import Y
SB = [0, 5.0, 12.6, 16.4, 22.5, 30.2, 33.8, 42.0, 48.5, 55.5, 60.2, 70.4, 74.6, 77.8, 80.0]
SURE = 80.0
T = Tasarim('../ses.mp3', sure=SURE, mod='gundem')
T.olaylardan('olaylar.json', sade=False, kalin=True)
def E(ad, t, aile, guc, x=540, perde=0, sure=None): T.ekle(Y(ad, sure=sure, perde=perde) if (sure or perde) else Y(ad), t, aile, guc, x, 0, None)
E('mk:kalp_derin', 4.4, 'darbe', .45)                        # "iki."
E('mk:uzak_patlama', 31.3, 'darbe', .45, 540, -2, 2.4)            # toplar (kütüphane)
E('mk:uzak_patlama', 32.0, 'darbe', .4, 540, -4, 2.0)
E('mk:kalp_derin', 52.2, 'darbe', .4)                        # "Macaristan oldu."
x = Y('mk:yatak_derin_ruzgar'); n = int(SURE * SR); yat = np.zeros(n); L = len(x); cf = int(3 * SR); pos = 0; kes = np.linspace(0, 1, cf)
yat[:min(n, L)] = x[:min(n, L)]
while pos + L - cf < n:
    bas = pos + L - cf; seg = x[:min(L, n - bas)].copy()
    yat[bas:bas + cf] = yat[bas:bas + cf] * (1 - kes) + seg[:cf] * kes if len(seg) >= cf else yat[bas:bas + len(seg)]
    if len(seg) > cf: yat[bas + cf:bas + len(seg)] = seg[cf:]
    pos = bas
tt = np.arange(n) / SR; yat *= np.clip(tt / 2.5, 0, 1) * np.clip((SURE - tt) / 3.5, 0, 1)
T.bus['muzik'][:, 0] += yat; T.bus['muzik'][:, 1] += yat
T.yaz('miks.wav', muzik_db=-23)
