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

## 3. Mahalle haritası (düzensiz parseller + çeşitli yollar)
Tek doğruluk kaynağı: `map.json` (80×56 birim). Izgara yok: 21 farklı boyutta parsel, 9 yol.
- **Çift şerit (iki araba yan yana):** Çınar Sokak (ana cadde, doğu-batı) ve Gül Sokak.
- **Tek şerit:** Dut Sokak, Fırın Sokağı, Çarşı Arkası, Park Sokak, Kavak Sokak, Virane Çıkmazı (çıkmaz).
- **Patika:** esnafın arkasından geçen yaya yolu.
- **Büyük ağaçlık park (güneybatı):** gölet, patikalar, salıncak, satranç masası, piknik masaları. Doğu kenarından tek yol geçer.
- **Çarşı şeridi (ana caddenin kuzeyi):** bakkal – kuaför – dönerci yan yana, önlerinde kaldırım, arkalarında patika ve evler.
- **Meydan (ana caddenin güneyi):** çınar, çeşme, çay ocağı; üç yanından yol geçer.
- **Çınar İstasyonu (kuzeybatı köşe, haritanın en üst köşesi):** eski tarz küçük yerel istasyon: tuğla bina, tahta peron saçağı, saat, su kulesi, hemzemin geçit. İki kenarında tünel var: tren kuzey kenardaki tünelden gelir, istasyonda durur, batı kenardaki tünelden çıkar; böylece tren harita dışından gelip dışına gider. Günde 3 sefer (07.40, 12.15, 17.42). Hikâye: yeni gelenler, misafir karakterler, veda, kayıp bavul.
- **Yıldız Apartmanı** artık ana caddenin arkasında, haritanın kuzey ortasında; **Pasaj Han + TERAS 7** kuzeydoğuda; **Gül Apartmanı** güneydoğuda.
- **Virane (kuzeydoğu, çıkmazın ucu):** yıkık, çatısı çökmüş, pencereleri tahtayla kapatılmış terk edilmiş ev; ot basmış, karga konmuş, "TEHLİKE" levhası. Hikâye aracı: gizemli sesler, saklanma yeri, çocukların merakı, emlak/yıkım tartışması (güvenlik: çocuklar için tehlikeli yer olarak işlenir, korku değil merak).
- Bazı parsellere tek yol (virane, park), bazılarına bir yandan (esnaf şeridi), bazılarına iki-üç yandan (meydan, fırın) yol temas eder; kaldırım yalnızca yola bakan kenarda vardır.

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
