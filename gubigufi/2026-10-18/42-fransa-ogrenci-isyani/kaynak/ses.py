"""#42 Fransa'da okullar yanıyor — SES: yalnızca KÜTÜPHANE efektleri (sentez/üretim YOK, müzik yatağı YOK).
Görüntüden türeyen olaylar (olaylar.json → BigSoundBank/kanal sesleri) + elle yerleştirilmiş az sayıda kütüphane efekti. Miks: ses2 (ducking, EQ, oda, limitör)."""
import sys; sys.path.insert(0, '../../../marka')
import numpy as np
from ses2 import Tasarim
from sfx_lib import Y
SB = [0, 10.5, 16.5, 20.6, 26.0, 31.0, 37.0, 43.4, 48.3, 56.6, 60.4, 64.0, 71.0, 76.3, 83.6, 86.4, 90.1, 92.3]
T = Tasarim('../ses.mp3', sure=92.3, mod='gundem')
T.olaylardan('olaylar.json')
def E(ad, t, aile, guc, x=540, perde=0, sure=None): T.ekle(Y(ad, sure=sure, perde=perde) if (sure or perde) else Y(ad), t, aile, guc, x, 0, None)
# --- 1: kanca — okul zili, alev, uzak patlama, kalabalık yatağı (sessiz) ---
E('mk:okul_zili', 0.15, 'aksan', .45)
E('mk:isyan_kalabalik', 4.4, 'doku', .55)                    # yangın başlarken yükselen uğultu
E('mk:ates_swoosh', 4.7, 'aksan', .5)
E('mk:ates_swoosh', 6.4, 'darbe', .55)
E('mk:uzak_patlama', 7.0, 'darbe', .5, 540, -3)
E('mk:gok_gecis', 9.3, 'riser', .45)
# --- 2–5: Paris, sınıf, termometre ---
E('mk:sehir_kalabalik', 10.6, 'doku', .35)
E('mk:tik_secim', 17.4, 'ui', .5); E('mk:tik_secim', 17.9, 'ui', .5); E('mk:tik_secim', 18.4, 'ui', .5)   # 36'ya sayım (seyrek)
E('mk:ton_yanlis', 21.2, 'ui', .55)                           # KADRO BOŞ
E('mk:bip_cift', 24.8, 'ui', .45)                             # 40 °C
E('mk:kalabalik_konusma', 26.0, 'doku', .45)                  # sıkışık sınıf uğultusu
# --- 6–7: kapılar, barikat, yangın ---
E('mk:kapi_kapan', 32.4, 'darbe', .6)
E('mk:metal_izgara', 33.5, 'darbe', .4)
E('mk:ates_swoosh', 35.0, 'aksan', .45)
E('mk:ates_swoosh', 36.4, 'darbe', .55)
E('mk:isyan_kalabalik', 36.0, 'doku', .5)
E('mk:tik_secim', 41.2, 'ui', .5)
# --- 8–11: hükümet, polis, gözaltı (sakin) ---
E('mk:kagit_kay', 43.8, 'kagit', .5)
E('mk:ton_yanlis', 47.5, 'ui', .55)
E('mk:isyan_cam_siren', 48.6, 'doku', .5)
for k, tt in enumerate([52.5, 53.1, 53.7]): E('mk:tik_secim', tt, 'ui', .4)
E('mk:kalp_derin', 56.8, 'darbe', .35)                        # 15 yaş: tek sessiz vuruş
# --- 12–15: 1968, seçim, 6 ay, soru ---
E('mk:slogan_devrim', 65.4, 'doku', .5)
E('mk:sayfa_cevir', 65.3, 'kagit', .5)
E('rol:damga', 66.1, 'damga', .5)
E('mk:kapi_mandal', 69.7, 'darbe', .4)                        # oy zarfı kutuya
E('mk:geri_sayim', 72.9, 'ui', .45)
E('rol:damga', 75.8, 'damga', .55)
E('mk:tik_balon', 81.6, 'ui', .4); E('mk:tik_balon', 82.7, 'ui', .4)
E('mk:pop_kabarcik', 84.0, 'ui', .45); E('mk:pop_kabarcik', 84.4, 'ui', .45)
T.yaz('miks.wav')
