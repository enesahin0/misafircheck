"""#43 Kadının beyanı esastır — SES: yalnızca KÜTÜPHANE efektleri (sentez/üretim YOK, müzik yatağı YOK).
Görüntüden türeyen olaylar (olaylar.json) + elle yerleştirilmiş az sayıda kütüphane efekti. Miks: ses2 (ducking, EQ, oda, limitör)."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim
from sfx_lib import Y
SB = [0, 8.2, 15.5, 23.5, 37.0, 43.9, 50.9, 57.6, 64.8, 72.9, 77.4, 80.3, 83.5, 85.7]
T = Tasarim('../ses.mp3', sure=85.7, mod='gundem')
T.olaylardan('olaylar.json')
def E(ad, t, aile, guc, x=540, perde=0, sure=None): T.ekle(Y(ad, sure=sure, perde=perde) if (sure or perde) else Y(ad), t, aile, guc, x, 0, None)
E('mk:gok_gecis', 5.0, 'riser', .40)                         # "cevabı seni de şaşırtacak" öncesi gerilim
E('mk:kalp_derin', 7.15, 'darbe', .40)                       # '!' vuruşu
E('mk:sayfa_cevir', 8.9, 'kagit', .45)                       # kanun kitabı açılır
E('mk:kagit_kay', 9.6, 'kagit', .35)                         # büyüteç tarar
E('mk:sehir_kalabalik', 11.3, 'doku', .25)                   # halk arasında
E('mk:kagit_kay', 23.8, 'kagit', .40)                        # madde 8 kartı
E('mk:kapi_kapan', 32.9, 'darbe', .55)                       # kapalı kapılar ardında
for k, tt in enumerate([34.5, 35.0, 35.4, 35.8, 36.1, 36.4]): E('mk:tik_secim', tt, 'ui', .35)   # saat (geç kalırsın)
E('mk:bip_cift', 36.2, 'ui', .40)
E('rol:damga', 37.45, 'damga', .55)                          # tokmak
E('mk:metal_izgara', 47.1, 'darbe', .45)                     # zorlama hapsi kafesi iner
E('mk:tik_balon', 73.8, 'ui', .4); E('mk:tik_balon', 75.0, 'ui', .4); E('mk:tik_balon', 76.4, 'ui', .4)
E('mk:pop_kabarcik', 79.4, 'ui', .40)
T.yaz('miks.wav')
