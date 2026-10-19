"""#38 Sosyal medya kısıtlanıyor — SES (kullanıcı, 19.10.2026): otomatik efektler GERİ (kalin=True: ince/parlak sesler elenir), sentez YOK (yalnızca KÜTÜPHANE) + arkada çok derin, yavaş kütüphane yatağı (Mixkit "Deep cinematic wind hum")."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim, SR
from sfx_lib import Y
SB = [0, 6.0, 10.0, 15.0, 21.2, 24.1, 29.2, 36.9, 46.2, 50.2, 56.0, 59.3, 62.4, 64.6]
SURE = 64.6
T = Tasarim('../ses.mp3', sure=SURE, mod='gundem')
T.olaylardan('olaylar.json', sade=False, kalin=True)       # otomatik efektler geri; ince/parlak sesler elenir (alçak geçiren, aşağı perde)
def E(ad, t, aile, guc, x=540, perde=0, sure=None): T.ekle(Y(ad, sure=sure, perde=perde) if (sure or perde) else Y(ad), t, aile, guc, x, 0, None)
# --- tek elle vurgu (damgalar otomatik olaylardan gelir) ---
E('mk:kalp_derin', 30.9, 'darbe', .4)                        # "yasağın asıl hedefi çocuklar"
# --- arka plan: çok derin, yavaş yatak (kütüphane; döngü + yumuşak giriş/çıkış) ---
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
