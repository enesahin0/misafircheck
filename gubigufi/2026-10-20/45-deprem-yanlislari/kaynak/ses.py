"""#45 Deprem hakkında 5 inanış — SES (kullanıcı kuralı): otomatik efektler (kalin=True, ince ses yok), sentez YOK (yalnızca KÜTÜPHANE), arkada çok derin yavaş kütüphane yatağı, elle ek vurgu çok az."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim, SR
from sfx_lib import Y
SB = [0, 7.6, 10.4, 18.4, 24.3, 33.8, 38.0, 48.6, 53.2, 62.0, 65.6, 70.1, 75.7, 82.5, 86.1, 89.2, 91.4]
SURE = 91.4
T = Tasarim('../ses.mp3', sure=SURE, mod='gundem')
T.olaylardan('olaylar.json', sade=False, kalin=True)
def E(ad, t, aile, guc, x=540, perde=0, sure=None): T.ekle(Y(ad, sure=sure, perde=perde) if (sure or perde) else Y(ad), t, aile, guc, x, 0, None)
E('mk:uzak_patlama', 0.1, 'darbe', .4, 540, -6, 2.6)        # kancada hafif yer sarsıntısı (kütüphane)
E('mk:kalp_derin', 13.9, 'darbe', .35)                       # "yanlış"
E('mk:kalp_derin', 72.4, 'darbe', .35)                       # tavan masaya iner
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
