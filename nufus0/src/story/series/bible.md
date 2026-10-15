# KOMŞULAR — Seri İncili (v3)

> Okunabilir özet. **Tek doğruluk kaynağı** yanındaki JSON dosyalarıdır; `npm run validate:universe` tutarlılığı denetler.
> Üst belge: `../../../CLAUDE.md`. Önceki konsept (NÜFUS_0 / KAPI) `../_arsiv_nufus0/` içinde arşivdedir.

## 1. Seri tek cümlede
**Bir apartmanın duvarını açıyoruz: 10 daire, 17 komşu, bitmeyen dedikodu. Her gün biri bir sır ya da kavga yaşıyor; kimin haklı olduğuna ve ne yapacaklarına SEN karar veriyorsun.**

## 2. Seyirciye vaat
1. Her gün 60 saniyede biten küçük bir komşuluk dramı.
2. Sonunda tek tuşluk seçim (A/B).
3. Kararın ertesi gün apartmanı gerçekten değiştiriyor.
4. Sezon boyunca çözülen gizem: **Kayıp Aidat Kasası**.

## 3. Bina — Yıldız Apartmanı (kesit)
```
  ÇATI    su deposu · çamaşır ipleri
  5. KAT  D9 Kerem & Ceren        | D10 KİRALIK (boş)
  4. KAT  D7 Rıza Amca            | D8 Aylin & Defne
  3. KAT  D5 Cemal & Güler (yönetici) | D6 Dilara & Pelin
  2. KAT  D3 Nermin, Kemal, Efe   | D4 Barış
  1. KAT  D1 Hacer Hanım (+Paşa)  | D2 Selin & Emre
  ZEMİN   giriş · posta kutuları · kapıcı Süleyman
  BODRUM  kazan · depo · (kasa odası)
```
Asansör **yok** (bilerek). Ön cephe açılır: kapak karesi her zaman bina kesiti + o günün parlayan penceresi.

## 4. Kadro
Hacer (71, emekli öğretmen) · Selin & Emre (29/31, yeni evli, **Emre işsiz**) · Nermin, Kemal (taksi), Efe (9, merdiven dedektifi) · Barış (kargo sırrı) ·
Cemal (yönetici) & Güler · Dilara (hemşire) & Pelin · Rıza Amca (denizci, mektup) · Aylin (avukat) & Defne (15) · Kerem (DJ) & Ceren (içerik üreticisi) ·
Süleyman Abi (kapıcı) · Paşa (kedi, tek tanık). Yeni kiracı D10'a izleyici kararıyla gelir.
Her karakter: tek baskın renk + imza nesne; yüzsüz low-poly; **giysi/ölçek değişmez**.

## 5. Bölüm formülü (60 sn)
HOOK (0–3) → KİM/NE → ÇATIŞMA (maket canlandırır) → BÜKÜM → KARAR (A/B, bedeller adil) → CLIFFHANGER + "yarın 20.00".
Her bölüm **dünkü oylamanın gerçek sonucunu** söyleyerek açılır. 8 hook kalıbı, her bölüm için 3 hook varyantı (`format.json`).

## 6. Haftalık özel: 60 SANİYE ÖNCE
Aynı 60 saniyelik olay tekrar tekrar oynar; izleyici her seferinde **tek bir ayrıntıyı** değiştirir (A/B/C). Hook: *"Bu 60 saniye 12. kez tekrarlanıyor."* Yan kanon (sezon gizemine ipucu verirse "kanon" damgalı).

## 7. Sezon 1 — Kayıp Aidat Kasası
Kasa 5. bölümde kayboluyor. 7 şüpheli, 12 ipucu. **Adil oyun kuralı:** 19. bölümdeki kilide kadar her ipucu en az iki şüpheyle uyumlu; izleyici SORGU oylarıyla yön verir; fail ipuçlarıyla çelişmeden kilitlenir. Oylamanın rolü açıkça söylenir. Kimse "kötü karakter" değildir.

## 8. Etkileşim
KIM HAKLI (A/B) · SORGU (kimi sorgulayalım) · KİRACI (D10'a kim taşınsın) · DEDİKODU (izleyici önerir, izinle) · DÖNGÜ (A/B/C) · İZ (ipucu avı). Kurallar: kullanıcı başına ilk geçerli oy, uydurma sayı yok, kişisel veri yok.

## 9. Para kazanma (şu an reklam yok)
Birikim → ürün yerleştirme (30 hazır yuva: çay, modem, kargo, kahve…) → sponsorlu daire/bölüm → ek gelir. Kurallar: ürün asla kötü sonucun sebebi olmaz; sponsor oyu belirleyemez; sezon gizemi para hırsızlığı olduğu için finans markalarıyla çakışma yönetilir; reklam etiketi yayın anında konur; reklam öncesi ses lisans kapısı (`audio:audit --commercial`).

## 10. Açık kararlar (kullanıcıya ait)
- Seri adı: KOMŞULAR mı, daha çarpıcı bir ad mı? (marka/kullanıcı adı müsaitliği kontrol edilmedi)
- ~~Görsel stil~~ **KARAR: low-poly izometrik** (palet: gece + sıcak amber pencereler).
- Pilot bölüm: `SAKSI` taslağı hazır (`episodes/ep001-saksi.json`); onay bekliyor.
- Sezon sonu: fail oylamayla mı belirlenecek, yazarla mı?
