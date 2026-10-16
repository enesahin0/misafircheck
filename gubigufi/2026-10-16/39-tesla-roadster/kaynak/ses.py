"""#39 Tesla Roadster — SES TASARIMI v2: görüntüden türetilen katmanlı efektler (olaylar.json) + müzik yatağı + miks zinciri."""
import sys; sys.path.insert(0, '../../../marka')
from ses2 import Tasarim
SB = [0, 10.9, 17.9, 25.4, 33.2, 38.4, 41.4, 45.1, 48.3, 51.4, 54.15, 57.3, 59.3]
T = Tasarim('../ses.mp3', sure=59.3, mod='pratik')
T.olaylardan('olaylar.json')
T.maskotlar('tepkiler.json')
# elle vurgular: kalkış, 0,59 damgası, gerçek görüntülerdeki itici anları
T.ekle('rol:gecis_hizli', 7.30, 'whoosh', .85, 700, 3, .6)
T.ekle('rol:boom#3', 7.98, 'darbe', .65, 700, -2, 1.4)
T.ekle('rol:gecis#3', 34.95, 'whoosh', .75, 540, -3, .9)       # reel: iki mavi itici alevi
T.ekle('rol:boom#1', 36.45, 'darbe', .7, 540, -2, 1.2)         # römorku aşan itici jeti
T.ekle('rol:gecis_yumusak#1', 38.5, 'whoosh', .5, 540, -4, 1.4) # fan emişi
T.ekle('rol:riser#2', 44.1, 'riser', .5, 540, 0, 1.1)           # yolda yasak öncesi gerilim
T.muzik_yatak(SB, [(0, [('A', 2), ('E', 3), ('C', 4)]), (17.9, [('F', 2), ('C', 3), ('A', 3)]), (25.4, [('D', 2), ('A', 2), ('F', 3)]), (33.2, [('A', 2), ('E', 3), ('C', 4)]),
                   (45.1, [('C', 3), ('G', 3), ('E', 4)]), (51.4, [('A', 2), ('E', 3), ('C', 4), ('E', 4)])], nabiz=(33.4, 45.0, 104))
T.yaz('miks.wav')
