"""#47 Cumhuriyet Bayramı — SES (kullanıcı kuralı): otomatik efektler (kalin=True, ince ses yok), sentez YOK (yalnızca KÜTÜPHANE), arkada çok derin yavaş kütüphane yatağı, elle ek vurgu çok az."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim, SR
from sfx_lib import Y
SB = [0, 7.3, 12.4, 20.2, 26.0, 31.7, 38.8, 47.0, 49.6, 56.0, 62.6, 70.2, 73.4, 76.5, 78.7]
SURE = 78.7
T = Tasarim('../ses.mp3', sure=SURE, mod='gundem')
T.olaylardan('olaylar.json', sade=False, kalin=True)
def E(ad, t, aile, guc, x=540, perde=0, sure=None): T.ekle(Y(ad, sure=sure, perde=perde) if (sure or perde) else Y(ad), t, aile, guc, x, 0, None)
E('rol:darbe', 21.75, 'darbe', .32)                          # hediye açılır ("bu sana ne verdi?")
E('mk:kalp_derin', 62.4, 'darbe', .35)                       # bayrak direğin tepesine ulaşır
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
