# Seri adı ve kullanıcı adı kontrolü (2026-10-15)

## Nasıl kontrol ettim / neyi kontrol EDEMEDİM
| Platform | Yöntem | Güvenilirlik |
|---|---|---|
| YouTube (@handle) | Profil sayfası 404 mü | ✓ güvenilir |
| TikTok (@handle) | Sayfa içindeki durum kodu (bulunamadı = boş) | ✓ güvenilir |
| X | Sayfa başlığı | ✗ güvenilir çıkmadı, sayılmadı |
| **Instagram** | Giriş duvarı: var olan ve olmayan hesap aynı sayfayı veriyor | ✗ **bu ortamdan okunamıyor — SENİN elle kontrol etmen gerekir** |
| Marka tescili | TÜRKPATENT arama arayüzü | ✗ yapılmadı — kullanıma almadan önce `turkpatent.gov.tr` marka sorgusunda ara (sınıf 9, 41, 38) |
| Benzer içerik | Web araması (yalnızca ABD sonuçları, zayıf sinyal) | Üç aday için çakışma bulunmadı; "Masumlar Apartmanı", "Kusursuz Kiracı" gibi mevcut apartman dizileri var (ad olarak çakışmıyor) |

Boş çıkması "kesin senindir" demek değildir: kontrol anındaki durumdur, ad başkasınca alınabilir. Bulduğunda hesabı hemen aç.

## Adaylar (taranan 25 addan en iyiler)
| Sıra | Seri adı | Gerekçe | Önerilen handle | YouTube | TikTok |
|---|---|---|---|---|---|
| 1 | **APARTMAN MECLİSİ** | Konsepti tek adla anlatır: izleyici = meclis. CTA'ya dönüşür ("Meclis oylamada"). | `apartman.meclisi` (`apartmanmeclisi` YouTube'da DOLU) | boş | boş |
| 2 | **YILDIZ APARTMANI** | Dünyanın adı; dizi hissi, marka olarak taşınabilir. | `yildizapartmani` | boş | boş |
| 3 | **DAİRE ON** | Merak: "boş kalan 10. daire". Kısa, akılda kalıcı. | `dairenon` | boş | boş |
| — | Diğer boş çıkanlar | KOMŞU DİZİSİ (`komsudizisi`), KAYIP AİDAT (`kayipaidat`), KAPICI DEFTERİ (`kapicidefteri`), APARTMAN KARARI (`apartmankarari`) | | boş | boş |
| ✗ | Dolu | `kimhakli` (3 platform), `daire10`, `merdivenbasi`, `apartmanmeclisi` (YouTube), `kapikomsusu` | | | |

## Kurallar
- Tüm platformlarda **aynı handle**. İlk tercih tutmazsa sıradaki.
- Handle'da Türkçe karakter ve boşluk kullanma; nokta/alt çizgi sade tut.
- Seri adı (ekranda) ile handle farklı olabilir ama yakın olmalı.
