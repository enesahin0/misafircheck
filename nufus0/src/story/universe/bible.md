# EVREN İNCİLİ — KAPI (v2)

> Bu belge evrenin **okunabilir özeti**dir. Tek doğruluk kaynağı yanındaki JSON dosyalarıdır
> (`building.json`, `rules.json`, `characters.json`, `engagement.json`, `formats.json`, `roomKits.json`, `anomalySeeds.json`).
> Çelişki olursa JSON + `npm run validate:universe` geçerlidir. Üst belge: `../../../CLAUDE.md`.

## 1. Fikir (tek paragraf)
**ŞEHİR_0** haritada olmayan bir şehirdir. Şehrin geriye kalan tek kalıcı yapısı **Sıfır Apartmanı**'dır (14. Sokak No:0, kayıtlarda yok).
Her bölümde izleyiciler **hangi kapının açılacağını** seçer. Kapı açılır, cutaway (dollhouse) bir daire görünür, tek bir anormallik ve bir insani bedel vardır,
bölüm bir **A/B kararıyla** biter. Karar binayı **kalıcı** değiştirir. İzleyici = **Dış Hat**.

## 2. Neden bu çerçeve?
- **Sürdürülebilirlik:** Yeni bölüm = yeni kapı. Bina, kitler ve karakterler aynı kalır; yalnızca daire içeriği değişir. 42 daire ≈ 42+ bölüm, bina değişince sonsuz.
- **Tutarlılık:** Her şey aynı yerde geçer. Bina haritası ve kapı numaraları veridir; kapanan daire, değişen kat, kırılan lamba kalıcıdır.
- **Etkileşim:** Üç ayrı sebep: karar (A/B), kapı seçimi (KAPI 34), içerik önerisi (İHBAR). Paylaşım: "hangi kapıyı açardın?" Kaydetme: ipucu avı.
- **Üretim:** Bina kesiti bizim en güçlü 3D varlığımız (arşiv kesiti zaten var). Yeni daire = standart daire kitinin yeniden birleşimi.

## 3. Bina (kesit)
```
        ÇATI    anten · su deposu · çamaşır ipi
        7. KAT  71  72  73  74  75  76
        6. KAT  61  62  63  64  65  66      ← merdiven boşluğu + asansör ortada
        5. KAT  51  52  53  54  55  56
        4. KAT  41  42  43  44  45  46
        3. KAT  31  32  33  34  35  36
        2. KAT  21  22  23  24  25  26
        1. KAT  11  12  13  14  15  16
        ZEMİN   posta kutuları · kapıcı masası · asansör holü · nüfus tabelası (0)
        BODRUM  ARŞİV (Leyla) · 0 etiketli kapı
```
Kapı numarası = **kat × 10 + sıra**. Numara kalıcıdır, kaybolan dairenin numarası tekrar kullanılmaz.

## 4. Değişmez kurallar (özet; tam metin `rules.json`)
1. **Kapı:** her kapı bir kez açılır; açılan daire kalıcı olarak "kayıtlıdır".
2. **Denge:** bina bir şeyi geri verirse başka bir şeyi alır.
3. **03.17:** düzeltmeler yalnız 03.17'de uygulanır; öncesinde bina içi zil/anons.
4. **Hafıza:** sakinlerin anıları güncellenir; eskiyi yalnız bodrum arşivi ve kapıcı defteri korur.
5. **Dış Hat:** bina dışarıya mesaj gönderemez; arşiv terminali izleyiciden talimat alır.
6. **Süreklilik:** kararlar kalıcı; geri dönüş için `restoredAtEpisode` gerekçesi şart.
7. **Sıfır:** zemin tabelasında sakin sayısı 0; 1 olursa büyük eşik.
8. **Tek anomali:** bölümde tek anormallik; gerisi sıradan.

**Sezon gizemi:** 03.17 düzeltmelerini kim yapıyor? (kapıcı / bina / 0 kapısının ardındaki / izleyiciler). İlk bölümlerde çözülmez.

## 5. Karakterler (az ve sabit)
Leyla (bodrum arşivi, 63. kayıt çelişkisi), Mahir (teknik servis), Kapıcı (defter + yedek anahtarlar), Müfettiş 0 (yüzsüz). Daire sakinleri bölüm başına 1–3 kişi, bir kayıt olarak eklenir ve kalıcıdır.

## 6. Bölüm kalıbı (60.00 sn, 8 vuruş)
Kapı açılıyor → Kimlik (kat/kapı/sakin) → İçeri → Kural/bedel → İnsani yüz → A/B kararı → Büküm + ipucu → Kesilme + 3 mühürlü kapı (KAPI seçimi). Ayrıntı: `formats.json`.

## 7. Etkileşim sistemi
| Döngü | Yorum biçimi | Amaç |
|---|---|---|
| KARAR | `A` / `B` | yorum, ertesi bölümü belirler |
| KAPI | `KAPI 34` | yorum, sıradaki daire |
| İHBAR | `İHBAR: ...` | yorum + içerik (tohum bankası) |
| KİRACI | `KİRACI: takma ad` | paylaşım + aidiyet (izinle, takma ad, kalıcı isimlik) |
| İZ | (ipucu avı) | kaydetme + tekrar izleme |

Kurallar: kullanıcı başına ilk geçerli oy; gerçek veri gelmeden sayım uydurulmaz; kişisel veri yok; birebir kullanım için izin.

## 8. Anomali tohum bankası
16 tohum `anomalySeeds.json` içinde (ör. *Aynı Akşam Yemeği*, *Fazla Oda*, *Asansör 3,5*, *Yarının Gazetesi*...). Bunlar **fikirdir**, kesin bölüm değildir.
Bir tohum bölüme dönüştüğünde `status: USED` olur ve dairenin `anomalySeed` alanına bağlanır.

## 9. Süreklilik protokolü (her bölümde)
1. Oy/KAPI sonucu → `tally` (A/B) ve `building.json` (hangi daire `OPENED`).
2. `worldState.json` ve `building.json` güncellenir (açılan daire, değişen kat, yeni sakin, yeni ipucu).
3. Bölüm verisi yazılır (`episodes/episodeNNN.ts`).
4. `npm run check` (tip + evren + bölüm doğrulaması) geçmeden render yok.

## 10. Açık kararlar (kullanıcıya ait)
- Görsel stil: low-poly mi, piksel mi (`--pixel` modu hazır; karşılaştırma yapıldı).
- DOSYA 001 (sokak silme) kanonda nerede durur? Öneri: **Prolog** — 14. Sokak silindi, haritada yalnız Sıfır Apartmanı kaldı; 62 kişinin penceresi binanın ışıklı pencereleri olabilir. Bağlantı henüz **karara bağlanmadı**.
- İlk 10 kapı ve sezon yayı (tohumlardan seçilecek).
- Marka adı: NÜFUS_0 mı, başka bir ad mı (müsaitlik/tescil kontrol edilmedi).
