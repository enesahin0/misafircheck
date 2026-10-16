"""#39 Tesla Roadster — SES TASARIMI v2: görüntüden türetilen katmanlı efektler (olaylar.json) + müzik yatağı + miks zinciri."""
import sys; sys.path.insert(0, '../../../marka')
from ses2 import Tasarim
SB = [0, 13.3, 22.0, 26.65, 31.85, 35.0, 38.5, 41.8, 44.7, 47.2, 50.0, 52.3]
T = Tasarim('../ses.mp3', sure=52.3, mod='pratik')
T.olaylardan('olaylar.json')
T.maskotlar('tepkiler.json')
# elle vurgular: kalkış, 0,59 damgası, gerçek görüntülerdeki itici anları
T.ekle('rol:gecis_hizli', 9.35, 'whoosh', .85, 700, 3, .6)        # 0 → 96 çubuğu
T.ekle('rol:boom#3', 10.04, 'darbe', .65, 700, -2, 1.4)           # 0.59 SN damgası
T.ekle('rol:gecis_hizli#2', 19.85, 'whoosh', .75, 700, 3, .6)     # Roadster koşusu
T.ekle('rol:boom#2', 20.5, 'darbe', .6, 330, -2, 1.2)             # 4,6× damgası
T.ekle('rol:gecis#3', 28.4, 'whoosh', .75, 540, -3, .9)           # reel: iki mavi itici alevi
T.ekle('rol:boom#1', 29.9, 'darbe', .7, 540, -2, 1.2)             # römorku aşan itici jeti
T.ekle('rol:gecis_yumusak#1', 31.95, 'whoosh', .5, 540, -4, 1.4)  # fan emişi
T.ekle('rol:riser#2', 36.2, 'riser', .5, 540, 0, 1.1)             # yolda yasak öncesi gerilim
T.muzik_yatak(SB, [(0, [('A', 2), ('E', 3), ('C', 4)]), (13.3, [('F', 2), ('C', 3), ('A', 3)]), (22.0, [('D', 2), ('A', 2), ('F', 3)]), (26.65, [('A', 2), ('E', 3), ('C', 4)]),
                   (38.5, [('C', 3), ('G', 3), ('E', 4)]), (44.7, [('A', 2), ('E', 3), ('C', 4), ('E', 4)])], nabiz=(26.9, 38.4, 104))
T.yaz('miks.wav')
