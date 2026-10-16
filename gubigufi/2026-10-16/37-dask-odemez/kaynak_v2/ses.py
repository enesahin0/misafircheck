"""#37 DASK v2 TAM VİDEO — SES TASARIMI v2: görüntüden türetilen katmanlı efektler (olaylar.json) + müzik yatağı + miks zinciri."""
import sys; sys.path.insert(0, '../../../marka')
from ses2 import Tasarim
SB = [0, 4.1, 15.95, 22.95, 28.7, 30.95, 34.85, 50.0, 53.15, 56.4, 58.4]
T = Tasarim('../ses.mp3', sure=58.4, mod='pratik')
T.olaylardan('olaylar.json')
T.maskotlar('tepkiler.json')
T.ekle('rol:boom#3', 3.1, 'darbe', .55, 540, -2, 1.4)           # kanca: ÖDEMİYOR damgası ağır vuruş
T.ekle('rol:dogru', 14.8, 'aksan', .5, 540, 0, 1.0)              # konut poliçesi ✓ oturması
T.ekle('rol:dogru', 21.9, 'aksan', .5, 330, 0, 1.0)              # kasko ✓
T.muzik_yatak(SB, [(0, [('A', 2), ('E', 3), ('C', 4)]), (15.95, [('F', 2), ('C', 3), ('A', 3)]), (22.95, [('D', 2), ('A', 2), ('F', 3)]), (28.6, [('C', 3), ('G', 3), ('E', 4)]),
                   (34.85, [('A', 2), ('E', 3), ('C', 4)]), (50.0, [('C', 3), ('G', 3), ('E', 4), ('C', 4)])], nabiz=(35.0, 49.9, 96))
T.yaz('miks.wav')
