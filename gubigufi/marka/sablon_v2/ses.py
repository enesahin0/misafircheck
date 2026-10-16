# ŞABLON (örnek: #37 v2) — akorları, SB ve elle vurguları videoya göre değiştir.
"""#37 v2 demo — SES TASARIMI v2: görüntüden türetilen katmanlı efektler (olaylar.json) + müzik yatağı + miks zinciri."""
import sys; sys.path.insert(0, '../../../marka')
from ses2 import Tasarim
SB = [0, 4.1, 15.95, 22.95, 28.7, 30.7]
T = Tasarim('../ses.mp3', sure=30.7, mod='pratik')
T.olaylardan('olaylar.json')
T.maskotlar('tepkiler.json')
# elle vurgular: kanca damgası ağır + gövde, logo açılışı
T.ekle('rol:boom#3', 3.1, 'darbe', .55, 540, -2, 1.4)
T.muzik_yatak(SB, [(0, [('A', 2), ('E', 3), ('C', 4)]), (4.1, [('A', 2), ('E', 3), ('C', 4)]), (15.95, [('F', 2), ('C', 3), ('A', 3)]), (22.95, [('D', 2), ('A', 2), ('F', 3)]), (28.6, [('C', 3), ('G', 3), ('E', 4)])],
              nabiz=(4.3, 15.8, 96))
T.yaz('miks.wav')
