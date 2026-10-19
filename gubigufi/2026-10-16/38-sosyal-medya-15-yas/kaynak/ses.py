"""#38 Sosyal medya kısıtlanıyor — SES: yalnızca KÜTÜPHANE efektleri (sentez YOK, müzik yatağı YOK). Görüntüden türeyen olaylar + az sayıda elle efekt."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim
from sfx_lib import Y
SB = [0, 6.0, 10.0, 15.0, 21.2, 24.1, 29.2, 36.9, 46.2, 50.2, 56.0, 59.3, 62.4, 64.6]
T = Tasarim('../ses.mp3', sure=64.6, mod='pratik')
T.olaylardan('olaylar.json')
def E(ad, t, aile, guc, x=540, perde=0, sure=None): T.ekle(Y(ad, sure=sure, perde=perde) if (sure or perde) else Y(ad), t, aile, guc, x, 0, None)
E('mk:gok_gecis', 6.5, 'riser', .35)                         # "üç şey var; sonuncusu şaşırtacak"
E('mk:kagit_kay', 11.0, 'kagit', .35)                        # 1 Kasım takvim sayfası
E('rol:damga', 13.8, 'damga', .45)                           # YAŞ DOĞRULAMA damgası
E('mk:ton_yanlis', 19.7, 'ui', .45)                          # ad / kimlik yok
E('rol:damga', 35.6, 'damga', .5)                            # ebeveyn izni yetmez
E('mk:tik_secim', 40.9, 'ui', .3)                          # rozetler (tek vurgu)
E('mk:ton_yanlis', 55.6, 'ui', .45)                          # GİRME
T.yaz('miks.wav')
