# NÜFUS_0 — CLAUDE.md

> **Proje aktarım ve uygulama talimatı.** Bu dosyayı Claude Code ile çalışılacak deponun köküne `CLAUDE.md` adıyla koy. Claude'u bu dosyanın ürün sahibi / teknik uygulayıcısı olarak düşün. Bu dosya hem yaratıcı evrenin kanonu hem de ilk MVP için uygulama brifidir.

## 0. Projenin tek cümlelik tanımı

**NÜFUS_0**, tamamı **karanlık, izometrik low-poly 3D** estetiğinde üretilen, Instagram Reels'te **her gün tam 60 saniyelik** bölümler hâlinde yayımlanan ve izleyicinin yorumlarla aldığı kararların ertesi gün hikâyeyi değiştirdiği interaktif bir gizem / bürokratik korku serisidir.

### Değiştirilemez ürün ilkeleri

1. **Fotogerçekçi AI video üretimi YOK.** Karmaşık generatif video API'lerine bağımlı olma.
2. **Bütün hikâye görselleri aynı karanlık low-poly evrene ait olacak.** Dış mekân da iç mekân da izometrik olacak. 2D tipografi, HUD ve dosya ekranları üst katman olarak kullanılabilir.
3. **İç mekânlar cutaway / dollhouse maketi:** Binanın iki duvarı çıkarılmış veya gizlenmiş gibi görünen, ortografik kamera ile izlenen gerçek 3D odalar.
4. **Evren kalıcıdır:** Bir bölümde kaybolan bina, kapatılan sokak, kırılan lamba, değişen kayıt sonraki bölümlerde kaybolmaz / düzelmez; ancak senaryoda gerekçeli bir değişiklik varsa değişebilir.
5. **Her gün bir bölüm, her bölüm 60 saniye:** 1080×1920 (9:16), 30 FPS, toplam 1800 kare, seslendirme + SFX + müzik + okunaklı altyazı.
6. **İlk 1–3 saniye olayın içinde başlamalı:** Uzun intro, kanal tanıtımı ve lore dökümü yok.
7. **Bölüm finali izleyiciye somut A/B kararı sunar** ve takip / geri gelme için gerçek bir sebep yaratır.
8. **Yorumların sonucu dürüstçe yansıtılır.** Gerçek veri gelmeden sayım veya galip uydurulmaz.
9. **Kodların çoğunu AI (Claude) yazacak.** Kullanıcı için basit komutlar, yeniden kullanılabilir bileşenler, anlaşılır dosyalar ve çalışır örnekler sağla.
10. Dışarıdan ücretli görsel / model / müzik zorunlu olmasın; mümkün olduğunca **prosedürel geometrilerle** çalış. Motion Array ve benzeri varlıklar isteğe bağlıdır, lisansları kontrol edilir.

---

## 1. Marka ve format

- **Marka:** `NÜFUS_0` (Instagram kullanıcı adı müsaitliği ve marka tescili kontrol edilmedi).
- **Evren:** `ŞEHİR_0`.
- **Katılımcıların adı:** `Dış Hat`.
- **Bölüm adı:** `DOSYA 001`, `DOSYA 002`... 
- **Ana cümle:** “Bu şehir haritada yok. Ama verdiğiniz her karar burada iz bırakıyor.”
- **Slogan:** “Kayıtlarda yaşamıyorlar. Kararları sen veriyorsun.”
- **Tür:** Bürokratik korku, gizem, psikolojik gerilim, az miktarda sürreal bilimkurgu.
- **Anlatım biçimi:** Belediye arşivi / sızdırılmış kayıt; tek, tutarlı anlatıcı; gizli resmî evrak dili.
- **Hedef:** İzleyici “Bu nasıl oldu?” → “A mı B mi?” → “Benim seçimimin sonucu yarın ne olacak?” diye düşünmeli.
- **Kurgu açıklığı:** Profil/sabit içerikte bunun kurgusal ve animasyonla üretilmiş bir dünya olduğu belirtilir. Gerçek kamu duyurusu gibi yanıltılmaz.

### Etkileşim stratejisi

- **KARAR:** Videonun altına `A` veya `B` yazılır. Önceden ilan edilen süre sonunda çoğunluk seçilir.
- **İTİRAZ:** “Üçüncü yol...” içeren yaratıcı çözüm yorumları yan hikâyelere / alternatif dosyalara aday olur; ana oylama sonucunu keyfî değiştirmez.
- **İHBAR:** İzleyici şehirde yaşanmış olabilecek tuhaf olayı yazar; uygun öneriler yeni bölüme dönüştürülebilir.
- **İZ AVCILIĞI:** Her bölümde bir adet bulması mümkün ama bağırmayan arka plan ipucu bulunur. İpucu sonraki bölümlerde anlam kazanır.
- Kullanıcı adı veya gerçek bir yorum birebir videoya alınacaksa izin almayı tercih et; kişisel verileri ifşa etme.

---

## 2. Kanon: Şehrin değişmeyen kuralları

**Ön bilgi:** Şehirde **18.407 kişi** yaşadığı anlatılır; resmî nüfus **0** olarak görünür. Gizemin cevabı en başta açıklanmaz.

1. **03.17 Kuralı:** Gerçeklik düzeltmeleri yalnızca saat 03.17'de uygulanır. Öncesinde anons gelir.
2. **Denge Kuralı:** Şehir bir şeyi geri verirse karşılığında başka bir şeyi alır. Bedelsiz mucize yok.
3. **Hafıza Kuralı:** Değişen gerçeklikten sonra sıradan sakinlerin anıları güncellenir. Eski gerçeği analog arşiv belgeleri koruyabilir.
4. **Dış Hat Kuralı:** Şehir dış dünyaya mesaj gönderemez ama belediyenin eski arşiv terminalinden dışarıdan talimat alabilir.
5. **Süreklilik Kuralı:** Alınan kararlar dünyayı kalıcı biçimde etkiler. Önceden yazılmış bir sonraki bölüm, gelen oyla çelişemez.
6. **Sıfır Kuralı:** Nüfus tabelası normalde sıfırdır. Bir gün 1 görünürse, dış dünya ile ilgili büyük bir eşik aşılmış demektir.

**Sezon ana gizemi:** 03.17 anonslarını kim yapıyor? Müfettiş 0 mı, belediye sistemi mi, şehrin kendisi mi? İlk sezonda katman katman açıkla; ilk bölümde çözme.

### Karakterler

- **Leyla:** 32 yaşında arşiv memuru. Analog kayıtları tutar; dış hat mesajlarını keşfeder. İlk bölümde silinen sokak listesindeki **63. kişi** olarak görünür; bu çelişki uzun vadeli gizemdir.
- **Mahir:** 28 yaşında belediye teknik servis görevlisi; hoparlör / tünel / elektrik hatları üzerine bilgi sahibi. İlk bölümde ana karakter olmak zorunda değil.
- **Müfettiş 0:** Yüzü görülmeyen yönetici figürü. Onun hakkında bilgiler yavaş açılır.

**Konuşan fotogerçekçi yüz, dudak senkronu veya ayrıntılı mocap KULLANMA.** Karakterleri tek renk veya az renkli low-poly gövdeler, basit rig/pivot hareketleri, silüet ve jestlerle anlat. İfadeyi ses, kamera ve animasyon ritmi taşısın.

---

## 3. Sanat yönetimi — HER SAHNEDE AYNI LOW-POLY DÜNYA

### Palet (başlangıç değerleri)

| Ad | Hex | Kullanım |
|---|---|---|
| Deep night | `#0B0E12` | Arka plan / sis |
| Building slate | `#1E252D` | Binalar / paneller |
| Concrete | `#39444B` | Yol, duvar, kaldırım |
| Warning red | `#BD373F` | 03.17 anonsu, karar, anormallik |
| Text bone | `#E0DDD4` | Ana tipografi |
| Dim amber | `#967753` | Az sayıda yanan pencere / sokak lambası |

Renk paleti sabit, materyaller çoğunlukla mat; düşük doygunluk, sert geometriler, küçük sıcak ışık kaynakları. Glitch efekti az ve anlamlı: her 2 saniyede rastgele görsel gürültü değil, sadece kayıt / düzeltme hatalarında.

### 3D estetik

- **Gerçek 3D sahneler** kur: basit prizma binalar, küp apartmanlar, konik veya box ağaçlar, basit insan silüetleri, düşük poligonlu araçlar.
- **OrthographicCamera** ile yaklaşık 35–45 derece yukarıdan ve çapraz bakış (izometrik his). Perspektif kaçışları abartma.
- **İç/dış mekân aynı ölçek, aynı materyal ve aynı ışık dili.** İç sahneler de 3D olmalı; düz 2D illüstrasyonla estetik kırma.
- Görünmeyen oda duvarlarını cutaway sisteminde gizle; kalan duvarlar, zemin, mobilya ve karakterler tam bir minyatür gibi dursun.
- İnsan silüetlerinin giysisi / ölçeği bölümden bölüme değişmesin.
- Statik sahne bile yaşayan diorama olmalı: pencere yanıp sönmesi, uzaktan tek arabanın geçmesi, çöp kutusu kapağının hafif hareketi, buhar, anten, tek bir kedi, bir odanın ışığının sönmesi.
- **Atmosferde boş alan bırak:** Kalabalık, sürekli hareketli ve parlak görüntüler yerine birkaç anlamlı mikro detay.

### Tekrarlayan çevre nesneleri / easter egg'ler

- Aynı **kırmızı küçük araba** farklı sokaklarda zaman zaman görünür. Konumu `worldState` içinde tutulur.
- Belediyenin üçüncü katında sık sık yanan **tek amber pencere**.
- **14. Sokak tabelası**; silinen sokak sonucuna göre gerçekten kaybolmalı.
- **Bozuk sokak lambası**; rastgele bir sonraki bölümde tamir olmuş görünmemeli.
- Üzerinde **0** olan arşiv dolabı / kapı.
- Arka planda bir **kedi** veya **boş durak**; arada bir gizemle bağlantı kurabilir.

**Her sahneye 1 anlamlı gizli ipucu + 2–4 küçük yaşam ayrıntısı** koy. Gizli ipucu senaryo veri modelinde tanımlansın, yanlışlıkla değişmesin.

### Kamera ve ekran kuralları

- Dikey çerçeve 1080x1920, 30fps. Metin ve kritik kararlar merkeze yakın, kolay okunur olsun.
- Instagram arayüzü tarafından kapanabilecek en alt alanı (özellikle son ~250–320px) kritik yazı için kullanma; sağ kenarda da paylaşım ikonları için boşluk bırak.
- Uzun metinler yerine 1–2 satırlık başlık, sayı, yer etiketi ve anlatım kullan.
- 0–3 saniye hook için hızla olay göster; devamında sakin, gerilimli hareket; ani kesmeler sadece dramatik noktada.
- Video üstü yazılar programatik çizilsin; görsel üretim servislerinden bozuk metin üretme.

---

## 4. Önerilen teknik yığın / MVP yaklaşımı

**Ana yaklaşım: TypeScript + React + Remotion + Three.js / React Three Fiber.**

- `remotion`: zaman çizelgesi, 60sn bileşimi, `useCurrentFrame`, ses, altyazı, render.
- `@remotion/three`: Remotion ile senkron 3D canvas (`ThreeCanvas`). Gerekli boyutları açık ver.
- `three`, `@react-three/fiber`: düşük poligon sahneler, ışıklar, kameralar.
- `zod` ya da basit TypeScript tipleri: bölüm JSON verisini doğrulama.
- `npm` komutlarıyla başlatma, preview ve MP4 render.
- Motion Array gibi stok materyalleri **isteğe bağlı** tut; indirilen varlıkların lisansını sakla, telifli sesleri gelişigüzel ekleme.

**Önemli Remotion kuralı:** Animasyonlar `useCurrentFrame()` ile kareye bağlı, deterministik ve yeniden üretilebilir olmalı. Remotion'un ThreeCanvas sahneleri içinde rastgele zamanlayıcı / `requestAnimationFrame` / R3F `useFrame` ile bağımsız animasyon döngüsü kurma. Aynı kare tekrar render edildiğinde aynı piksel düzeni ortaya çıkmalı. Rastgelelik gerekiyorsa seed kullan.

### Performans sınırları

1. İlk prototipte sade geometriler ve sınırlı ışık/gölge kullan. 60 saniye = 1800 kare; ağır shader ve parçacık efekti render'ı çok uzatabilir.
2. **Önce tek 5 saniyelik 3D şehir test videosu** oluştur, sonra 60 saniyeye geç.
3. Browser ve render ortamında WebGL desteğini kontrol et. Destek yoksa `react-three-fiber` sahnelerini uyumlu ortamda ayrı kısa kliplere render edip Remotion'da birleştiren **fallback** tasarla. Estetikten taviz verme; 2D çizgi filme dönüştürme.
4. Audio dosyaları yoksa preview ve sessiz render çalışmalı. Üretim render'ında eksik sesleri rapor et.
5. Kullanıcının bilgisayarı bilinmiyor; ilk çalıştırmada işletim sistemi, Node ve ekran kartını kontrol etmek gerekebilir. Kodu yazmadan uzun soru listesi çıkarma: mümkün olduğunca portatif kur.

### Hedef dosya yapısı

```text
nufus0/
  CLAUDE.md
  package.json
  tsconfig.json
  public/
    audio/
      narration/           # Kullanıcının ses dosyaları
      sfx/                 # Lisansı uygun sesler
      music/
  src/
    index.ts
    Root.tsx               # 1080x1920, 30fps, 1800 frame Composition
    video/
      Episode.tsx          # Veriden otomatik bölüm birleştirme
      Subtitle.tsx
      Overlay.tsx
      transitions.ts
    world/
      camera.tsx           # Ortografik/isometrik kamera
      palette.ts
      CityBlock.tsx
      CityStreet.tsx
      Apartment.tsx
      MunicipalArchive.tsx # Cutaway iç mekân
      Props.tsx            # Ağaç, kedi, araç, lamba, tabela
      Characters.tsx       # Leyla, Mahir, Müfettiş 0 placeholder
      WorldScene.tsx
    scenes/
      StreetDeletion.tsx
      CityArchive.tsx
      ArchiveInterior.tsx
      DecisionScreen.tsx
      LeylaReveal.tsx
    episodes/
      episode001.ts        # Sahne, ses ve subtitle girdileri
      schema.ts
    story/
      worldState.json
      decisions.json
      canon.md
    utils/
      deterministic.ts
      time.ts
  scripts/
    validate-episode.ts
    render-episode.ts
    tally-votes.ts          # Manuel CSV / JSON girişine dayalı
  out/                      # Git ignore
```

Büyük bir mimariyi boş dosyalarla taklit etmektense **önce gerçekten çalışan dikey video** üret. Yukarıdaki yapı hedef mimaridir, ilk adımda her dosyanın olması şart değildir.

---

## 5. İlk bölüm — DOSYA 001 / 14. Sokak

**Amaç:** İzleyici 3 saniyede tuhaf olayla karşılaşsın, 30 saniyede bedeli anlasın, 45–60 saniyede oy vermeye ve ertesi günü merak etmeye başlasın. Film fragmanı değil; kendi içinde küçük anlatı yayı olan tek bölüm.

**Kural:** Açılışta logo veya kanal tanıtımı yok. İlk pikselde imkânsız olayın görüntüsü.

### Sahne akışı (toplam 60.0 sn / 1800 kare)

| Süre | Sahne | Görsel üretim | Ses / metin |
|---|---|---|---|
| 00:00–00:04 | **Sokak siliniyor** | Gerçek izometrik low-poly blok; 14. Sokak'taki geometriler 03.17 anonsuyla eşzamanlı silinir, birkaç pencere karanlık boşlukta kalır | “Bu sokak dün gece silindi. Ama içindeki 62 kişi hâlâ orada.” |
| 00:04–00:11 | **Anons** | Minyatür sokak lambası, belediye hoparlörü, durak, yavaş kamera kayması; hoparlör kırmızı yanar | “Saat 03.17'de belediye tek bir anons yaptı: 14. Sokak kayıtlardan çıkarılmıştır.” |
| 00:11–00:19 | **İz** | Şehir maketinde sokak boşluğu, geride yanan 2–3 ışık, tanıdık kırmızı araç başka sokakta | “Sabah haritada boşluk vardı. Kameralarda da. Ama içeride ışıklar yanmaya devam ediyordu.” |
| 00:19–00:27 | **Nüfus 0** | Şehir bloklarının kuşbakışı maketi → isometrik belediye binası → az sayıda HUD rakamı | “Burası ŞEHİR_0. Burada 18.407 kişi yaşıyor. Resmî nüfus ise sıfır.” |
| 00:27–00:38 | **Arşiv** | Belediye arşivinin izometrik cutaway içi; Leyla masada, çekmeceler, ekran, kırmızı dosya | “Arşiv iki çözüm buldu. Sokağı geri getirirsek başka bir sokak kaybolacak. İnsanları kurtarırsak kim olduklarını unutacaklar.” |
| 00:38–00:49 | **A / B kararı** | Aynı evrenin low-poly terminali; üstüne okunur 2D seçenek overlay'i | “A: Sokağı geri getir. B: İnsanları kurtar. Yorumlara A ya da B yaz. Çoğunluğun kararı yarın uygulanacak.” |
| 00:49–00:57 | **63. kişi** | Arşiv odasına geri dönüş; Leyla dosya çıkarır, terminal `62 → 63`, ardından `63: LEYLA` | “Bir dakika... Arşivde 62 değil, 63 kişi yazıyor. Son kaydın adı Leyla.” |
| 00:57–01:00 | **Kesilme** | Leyla'nın oda maketinde durduğu görünür; kırmızı uyarı; hızlı siyah kesme | “Ama Leyla şu anda belediyede.” Son kartta `NÜFUS_0 · A / B? · YARIN 20.00`. |

> Bu metin ilk okuma senaryosudur; 60 saniyeye uydurmak için seslendirme kaydı üzerinden ayarla. Anlaşılabilirlik için hızla kelime sıkıştırma; gerekirse bazı cümleleri kısalt. **Tam 60 saniye çıkış süresi korunacak.**

### İlk bölüm için 3D varlık kontrol listesi

- [ ] 6–10 basit düşük poligon bina, kaldırım ve yol; aynı şehir ölçeği.
- [ ] 14. Sokak için ayrı aç/kapatılabilir bina/zemin grubu.
- [ ] 2–3 yanan pencere, 1 titreyen sokak lambası, 1 belediye hoparlörü.
- [ ] 1 otobüs durağı, 1 küçük kırmızı araba, 1 çöp kutusu veya kedi (mikro detay).
- [ ] Belediye binasının dış modeli ve ona bağlı **kesit arşiv iç mekânı**.
- [ ] Arşiv: masa, sandalye, basit terminal, dolaplar, bir adet `0` etiketli kapı, sarı floresan.
- [ ] Leyla için çok basit low-poly karakter (ör. saç, ceket, yüz detaysız kafa).
- [ ] Nüfus göstergesi, arşiv satırları, A/B kartları, DOSYA 001 ibaresi için okunur HUD.
- [ ] Ekran ve sokak değişiklikleri için kareye bağlı animasyonlar.
- [ ] İç/dış mekânda aynı kamera, malzeme ve gölge mantığı.

### Etkili hook için uygulanacak ölçütler

- İlk 3 saniyede bir **gözle görülür yok oluş** veya onun çarpıcı sonucu görünmeli.
- Ses kapalıyken de `BU SOKAK SİLİNDİ` / `62 KİŞİ İÇERİDE` gibi 2 kısa satırla konu anlaşılabilmeli.
- İlk 15 saniyede giriş açıklaması yerine “ne oldu / neden tuhaf?” sorusu kurulmalı.
- Gerilim yalnız kırmızı ışık ve glitch ile değil, **normal detayın anormal sonuçla çarpışmasıyla** kurulmalı.
- Video kapanışında A/B seçeneklerinin bedeli tek bakışta anlaşılmalı.

---

## 6. Hikâye ve oylama veri modeli

Her bölüm kodda tek tek sabit yazılmasın. Yeni bölüm yaratmak için veri dosyası değiştirilebilsin.

Önerilen örnek:

```json
{
  "episodeId": "001",
  "title": "14. Sokak",
  "durationFrames": 1800,
  "fps": 30,
  "branchFromPrevious": null,
  "decision": {
    "id": "street14_decision",
    "options": [
      {"id": "A", "label": "Sokağı geri getir", "cost": "Başka bir sokak kaybolur"},
      {"id": "B", "label": "62 kişiyi kurtar", "cost": "Kimlikleri silinir"}
    ],
    "status": "OPEN",
    "closesAtLocal": null,
    "winner": null,
    "votes": null
  },
  "persistentClues": ["RED_CAR", "AMBER_WINDOW_3F", "LEYLA_PERSON_63"]
}
```

`worldState.json` en azından şunları saklamalı:

- `populationOfficial` (ilk değer `0`), `populationBelieved` (`18407`)
- `streets` ve her sokağın varlık / kayıp durumu
- `buildings` (hangi binanın ışığı yanıyor, hasar / kayıp durumu)
- `characters` (Leyla, Mahir, Müfettiş 0: durum, bilinen sırlar)
- `clues` (nerede göründüler, açıklandı mı?)
- `decisionHistory` (oy sayıları, hangi seçenek kazandı, bunun somut etkileri)
- `timeline` (dosya numarası, önceki bölüm sonucunun bağlandığı yer)

**Devamlılık kontrolü:** Yeni bölüm render edilmeden önce öncekilerle çelişen durumlar için en azından basit otomatik kontrol yaz. Kaybolan bina geri dönüyorsa senaryoda gerekçe / `restoredAtEpisode` bulunmalı.

### A/B oy yönetimi

- Başlangıç uygulaması: `votes.csv` veya `votes.json` **manuel giriş**; Instagram API / bot entegrasyonu olmadan çalışır.
- Önerilen yayın: her gün **20.00 (Europe/Istanbul)**. Oylama **ertesi gün 14.00'te** (18 saat sonra) kapanır. Sonucun geçtiği yeni bölüm **20.00'de** yayınlanır.
- Bir kullanıcıdan bir oy say; birden fazla yorum varsa, bilinen ve ilan edilmiş bir bağlayıcı kurala göre tek oy say (örn. ilk geçerli oy). Manuel CSV'de kullanıcı kimlikleri hash veya takma ID olabilir.
- Oylar aynıysa önceden duyurulmuş eşitlik kuralı uygula; ilk geçerli oy gibi. Seçimden sonra kural değiştirme.
- Hiç oy yoksa açıkça “Dış Hat'tan karar gelmedi; Leyla protokolü uyguladı” diye alternatif sonuç kullan. **Sahte katılım yaratma.**
- Çoğunluk her zaman ana olay yönünü belirler; yaratıcı alternatif yorumlar yan hikâyeye dönüşebilir.
- Instagram verisini otomatik çekme, yorum yapma veya yayınlama entegrasyonu ilk MVP kapsamı dışında. İleride gerekiyorsa yalnızca resmî API / izinli bağlantıyla planla.

### Günlük üretim hattı

1. Dün kapanan oyların verisini içe aktar.
2. `worldState` üzerinde kazanan kararın etkilerini uygula.
3. Sonraki bölüm için **8 sahnelik / 60 saniyelik** hikâye yaz. Her sahnede anlatı, kamera, 3D olay, gizli ipucu, yazı ve ses tanımlı olsun.
4. Tekrar kullanılabilir low-poly sahneleri yeni bölüm verisiyle birleştir.
5. Önce hızlı/düşük çözünürlüklü **taslak preview**, sonra tam 1080x1920 MP4 render al.
6. Ses zamanlamasını, altyazıları, kesilen metinleri ve süreyi kontrol et.
7. Yayın için açıklama, A/B soru metni ve 1–2 Story kartı üret.
8. Yeni oylamanın sonucu kapanana kadar *sıradaki bölüm için her iki dalın da en az kısa taslağını* önceden hazırla.

---

## 7. İlk 10 dosyanın çekirdeği (kilitlenmiş final değil)

Bu fikirler kullanıcı kararlarına göre yeniden yazılabilir; önceki oy sonuçlarıyla çelişmemelidir.

1. **DOSYA 001 — Haritadan Silinen Sokak:** 62 kişi içeride; 63. isim Leyla.
2. **DOSYA 002 — Olmayan Altıncı Kat:** 5 katlı binadan 6. kata çağrı.
3. **DOSYA 003 — Her Fotoğraftaki Adam:** On yıllardır yaşlanmayan biri.
4. **DOSYA 004 — Son Durağı Olmayan Otobüs:** Mahir'in kayıp abisi içeride görülür.
5. **DOSYA 005 — Henüz Ölmemiş Kadının İlanı:** Leyla'nın ileri tarihli ölüm ilanı.
6. **DOSYA 006 — Hiç Yaşanmamış Salı:** Takvimden bir gün silinir; kamerada iz kalır.
7. **DOSYA 007 — Dış Hat'ın İlk Mesajı:** Gerçek bir izleyici kararının terminale ulaşması.
8. **DOSYA 008 — Arşivin Altındaki Kapı:** 0 numaralı kapıdan yarının anonsu gelir.
9. **DOSYA 009 — Nüfus Bir Oldu:** Nüfus göstergesi ilk kez 1 olur.
10. **DOSYA 010 — Yarın Vereceğiniz Kararı Dün Verdiniz:** Gelecek tarihte verilmiş karar arşivde bulunur.

Her dosyada: tek ana anormallik, bir insanî bedel, yeni soru, küçük ipucu ve izleyici kararı.

---

## 8. Claude'dan beklenen çalışma davranışı

**Kullanıcı kod yazmayabilir.** Bu nedenle yalnızca mimari öneri verip durma; dosyaları üret, kurulumu açıkla, komutları çalıştırılabilir biçimde sun, hataları çöz ve çalışan preview / render elde etmeye odaklan.

### İlk yanıt / ilk kodlama görevi

1. Proje klasörünü oluştur, package.json ve TypeScript yapılandırmasını hazırla. Sürüm uyumluluklarını kurulum anında resmî belgelerden kontrol et; rastgele eski sürümler dayatma.
2. `Root.tsx` içinde `Nufus0Episode001` adlı **1080×1920, 30fps, 1800 frame** composition tanımla.
3. Low-poly isometrik **14. Sokak dış mekânını** Three.js geometrileriyle kur; en az 6 bina, yol, sokak lambası, pencereler, kırmızı araç ve silinen bina grubu olsun.
4. Low-poly isometrik **belediye arşivi cutaway iç mekânını** kur; Leyla silüeti, masa, terminal, dolap ve kırmızı uyarı ışığı yer alsın.
5. İki sahneyi aynı kamera / sanat diliyle çalıştır. `useCurrentFrame()` ile basit hareket ve sokak silinmesini kodla.
6. `DOSYA 001` için 60 saniyelik timeline ve A/B ekranını uygula. Ses dosyası yoksa kolay değiştirilebilir placeholder / sessiz çalışma destekle.
7. `npm run dev` ile yerel preview; `npm run render:001` gibi anlaşılır komutla MP4. Projede `README.md` kullanım rehberi de yaz.
8. Gözle görülür hataları kontrol et: yanlış kamera kadrajı, tekstür/renk tutarsızlığı, okunamayan yazı, 60 saniye dışına çıkan uzunluk, boş kare.
9. Projenin erişemediğin sistem parçalarını dürüstçe belirt; “video hazır” demeden önce MP4 dosyasının gerçekten oluştuğunu doğrula.
10. Her adımdan sonra gerekirse kısa ilerleme özeti ver; ancak kullanıcıyı gereksiz teknik tercihlerle bunaltma.

### Minimum kabul kriterleri — MVP tamamlandı demek için

- [ ] Kullanıcı tek komutla önizleme açabiliyor.
- [ ] 5 saniyelik test render başarılı.
- [ ] Dışarıdaki **isometrik low-poly sokak** ile içerideki **isometrik cutaway arşiv** aynı estetikte.
- [ ] 14. Sokak silinmesi gözle görünür.
- [ ] Sabit mikro detaylardan en az üçü var (kırmızı araba, titreyen lamba, amber pencere vb.).
- [ ] `DOSYA 001` 1080×1920, 30fps, **60.00 saniyelik** MP4 olarak dışa aktarılabiliyor.
- [ ] Videoda ilk 3 saniyede hook, sonlarda A/B ekranı ve 63. kişi sürprizi var.
- [ ] Seslendirme dosyasını değiştirmek için kodu yeniden yazmak gerekmiyor.
- [ ] Sonraki bölüm için sahne ve hikâye verileri değiştirilebilir.
- [ ] Eski dünya durumu / kararlar JSON üzerinden korunabiliyor.

### İlk aşamada YAPMA

- Onlarca yeni karakter ve bina modeli üretmeye çalışma.
- Ücretli servisleri mecburi kılma.
- Fotogerçekçi AI video ve lipsync peşine düşme.
- Karmaşık web dashboard, bulut sunucu, otomatik Instagram yayınlama veya sosyal medya scraping ekleme.
- Sadece PNG ekranlarını kaydırıp “3D” deme; gerçek geometrilerle render edilen sahneler üret.
- Günün oyu gelmeden hikâyenin sonucunu önceden kesinleştirme.

---

## 9. Yeni Claude oturumunda işe başlama komutu

Aşağıdaki mesaj, bu dosya Claude'a verildikten sonra **ilk kullanıcı isteği** olarak kullanılabilir:

> `CLAUDE.md` dosyasını bu projenin bağlayıcı ürün ve sanat yönetimi belgesi olarak kabul et. Öncelikle NÜFUS_0'ın çalışan bir MVP'sini kodla. Gerçekçi AI video kullanma. Remotion + Three.js/React Three Fiber ile izometrik dark low-poly şehir ve aynı üslupta cutaway belediye arşivi kur. İlk olarak 5 saniyelik şehir testi üret; ardından DOSYA 001 için 1080x1920, 30fps, 60 saniye render alınabilecek, ilk 3 saniyesi güçlü hook içeren bölüm oluştur. Dosyaları gerçekten oluştur, kurulumu ve render komutlarını çalıştır, hataları gider, README hazırla. Otomatik Instagram entegrasyonu ya da ücretli API şart koşma. Kullanıcı kod bilmiyor varsay; çalışır sonuç ve net komutlar öncelikli.

---

## 10. Resmî teknik başvuru linkleri

- Remotion: https://www.remotion.dev/docs/
- Remotion ThreeCanvas: https://www.remotion.dev/docs/three-canvas
- Remotion Composition: https://www.remotion.dev/docs/composition
- Three.js OrthographicCamera: https://threejs.org/docs/pages/OrthographicCamera.html
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Motion Array: https://motionarray.com/ (isteğe bağlı, lisansa dikkat)

**Son söz:** Bu hesap video efektleri sergilemek için değil, gerçek davranışları ve kalıcı sonuçları olan izometrik bir şehir anlatmak için kuruluyor. Animasyon teknikleri hikâyeye hizmet etmeli. Her sahne sinematik, karanlık, okunaklı, tutarlı ve ayrıntılarla yaşayan bir diorama gibi hissettirmeli.
