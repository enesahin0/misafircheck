# MAHALLE — Seri İncili (v4)

> Okunabilir özet. **Tek doğruluk kaynağı** yanındaki JSON dosyalarıdır; `npm run validate:universe` tutarlılığı denetler.
> Üst belge: `../../../CLAUDE.md`. Önceki konseptler (NÜFUS_0/KAPI, tek apartman) `../_arsiv_nufus0/` içinde veya Yıldız Apartmanı olarak mahallenin içinde yaşar.

## 1. Seri tek cümlede
**Çınar Mahallesi: bakkal, dönerci, çay ocağı, apartmanlar, çatıda bir gece kulübü. Her gün mahallede garip, komik ya da duygusal bir olay oluyor; bazen o günün gündemi mahalleye uğruyor. Kimin haklı olduğuna ve mahallenin ne yapacağına SEN karar veriyorsun.**
*(Çalışma adı: MAHALLE. Kesin ad ve kullanıcı adı kararı bekliyor.)*

## 2. Dört sütun
1. **Mahalle hayatı:** sabit mekânlar, sabit kadro, değişken ilişkiler (sevgi ↔ nefret).
2. **Gündem:** haberler MAHALLE ÖLÇEĞİNDE ve güvenli biçimde (hassas konular yok). `npm run gundem` adayları listeler, karar insanda.
3. **Misafir:** tek bölümlük ve 3–5 bölümlük konuklar; kalıcı olma kararını izleyici verir.
4. **Nadir anlar:** düğün (~40 bölümde 1), cenaze/yas (~60'ta 1, saygılı, ölüm gösterilmez), yeni taşınan, festival.

## 3. Mahalle haritası (6×4 blok)
```
        0           1            2             3            4              5
 0  .            Yıldız Apt.   .             .          PASAJ HAN        .
                 (5 kat)                                 └ TERAS 7 (çatı kulübü)
 1  .            BAKKAL     MEYDAN+ÇINAR   FERHAT USTA   .             FIRIN
                  (Nuri)    + ÇAY OCAĞI     DÖNER                        (Sönmez)
 2  .             .          .            NERMİN KUAFÖR   .              .
 3  PARK &        .          .              .          GÜL APT.        DURAK &
    OYUN ALANI                                           (yeni kiracılar) BEKÇİ KULÜBESİ
```
Kamera: karakterler hep okunur (geniş ≥70px, orta ≥140px, yakın = el/nesne/ekran). Işık: sabah/öğle/akşam/gece.

## 4. Kadro (27: 13 CORE, 14 REGULAR)
**Esnaf/mekân:** Hatice Abla (çaycı, 52) · Nuri Amca (bakkal, 63) + yeğeni Bülent (24) · Ferhat Usta (dönerci, 47) + çırağı Mert (19) · Nermin (kuaför, 41) · Nil Hanım (TERAS 7 sahibi, 38) + Koray (güvenlik) + Kerem (DJ).
**Mahalle:** Hacer Hanım (71, emekli öğretmen, kedisi Paşa) · Kemal (taksi) · Bekçi Recep (50) · Süleyman Abi (kapıcı) · Efe (9) · Cemal Bey (yönetici) & Güler · Selin & Emre · Barış · Dilara & Pelin · Rıza Amca · Aylin & Defne · Ceren · köpek Karabaş.
Her karakterin: geçmişi, erdemleri, kusurları, tikleri, sloganı, isteği/korkusu/sırrı, sesi. İlişkiler **yönlü** (A→B ≠ B→A), −5 nefret … +5 sevgi, güven 0–5, patlama noktalarıyla; kararlar bu değerleri değiştirir (haftalık **Mahalle Barometresi**).

## 5. Olaylar (eventCatalog.json)
Gündelik komik · Mahalle gerilimi · **Gündem uyarlaması** · Dedikodu zinciri · Festival · Yeni gelen · Duygusal · Mini gizem · **Düğün (nadir)** · **Yas (çok nadir, saygılı)** · Küçük mahalle krizi (elektrik/su/kar). Kurallar: ardışık iki bölüm aynı türde olmaz, haftada ≥2 mekân, aynı anda ≤3 aktif yay.

## 6. Gündem hattı (gundem.json)
Tara → Seç (insan) → Teyit (2 kaynak) → Mahalleye çevir → Güvenlik denetimi → Yaz. Yasak: ölüm/kaza/terör/savaş/siyaset/yargı/mağdurlu afet/din-etnik kimlik/istismar/gerçek kişi ve marka. Videoda "GÜNDEM" etiketi + açıklamada "gerçek bir haberden esinlenilmiştir; kurgusaldır".
Örnek: büyük maç → çay ocağında ortak ekran (takım adı yok) · sıcaklık rekoru → buzlu çay krizi · yeni uygulama → Bülent defteri dijitale taşımak istiyor, Nuri direniyor.

## 7. Yaylar (arcs.json)
Sezonluk: **Kayıp Aidat Kasası** (Yıldız Apartmanı, 7 şüpheli, adil oyun). Kısa (3–5 bölüm): Çay Ocağı Satılık mı? · Gürültü Savaşı → Çınar Şenliği (Hacer–Nil) · Yeni Gelen · Pelin–Kerem(–Ceren) · Bakkal ve Dijital.
**Konuklar:** TEK_BÖLÜM / KISA_YAY / KALICI (MİSAFİR oylamasıyla). Korkuluk: reşit olmayanlar (Efe 9, Defne 15) romantik/korkutucu içerikte yer almaz.

## 8. Bölüm formülü ve etkileşim
60 sn: HOOK → KİM/NE → ÇATIŞMA → BÜKÜM → KARAR → CLIFFHANGER. Döngüler: KİM HAKLI · SORGU · OLAY (mahalleye bugün ne olsun?) · MİSAFİR · KİRACI · DEDİKODU · DÖNGÜ (60 SANİYE ÖNCE, cumartesi) · İZ · BAROMETRE.

## 9. Para kazanma (şu an yok)
Esnaf mekânları en doğal ürün yerleştirme alanı: çay ocağı (çay), bakkal (market), dönerci (yemek/içecek), kuaför, TERAS 7 (içecek), durak/taksi. 53 marka yuvası. Kurallar: ürün asla kötü sonucun sebebi olmaz; sponsor oyu belirleyemez; gündem bölümlerinde haber+marka birleşmez; reklam etiketi yayın anında; reklam öncesi ses lisans kapısı.

## 10. Açık kararlar (kullanıcıya ait)
- **Seri adı** (MAHALLE çalışma adı): bkz. `docs/ISIM_ONERILERI.md`.
- Gündem bölümü sıklığı (ayda ~6) ve haber seçimini kimin yapacağı (öneri: her gün tarama listesinden kullanıcı seçer).
- Gündüz ışığı ön ayarı (pazar/festival sahneleri) için palet genişletmesi.
- Pilot: `SAKSI` (Yıldız Apartmanı, mahalle içinde) mı, yoksa mahalle tanıtım bölümü mü?
