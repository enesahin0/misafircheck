# ARAŞTIRMA D — Kaynaklar ve Boşluklar (A/B/C'nin kaçırabileceği her şey)

> Tarih: 2026-10-15 · Proje: Çınar Mahallesi (Remotion 4.0.535 · React 19 · three 0.180 · R3F 9.4) · Kapsam: varlık/font/emoji/ses, içerik-izleyici-NLP, AI üretim hattı, QA, geliştirici araçları, yayın-büyüme, kenar alanlar, benzer projeler, awesome listeleri.

## 0. Yöntem ve doğrulama sınırları (dürüstlük notu)

- Bu ortamdan `api.github.com/repos/...` **engelli** (oturum yalnızca bağlı depolara izin veriyor). Bu yüzden: yıldız/son commit/lisans için **shields.io** (yıldızlar yuvarlak: "5.9k"), tekil depolar için `git clone --depth 1` (gerçek son commit tarihi, dosya içeriği), `raw.githubusercontent.com` (LICENSE/README), `registry.npmjs.org`, `pypi.org`, `huggingface.co/api`, `kenney.nl`, `quaternius.com`, `kaylousberg.itch.io` ve Meta/TikTok/Google resmî dokümanları (curl) kullanıldı. İndirilen kod **çalıştırılmadı**, yalnızca okundu (tek istisna: kendi projenin betikleri ve `ffmpeg`).
- Tablolarda "son commit" = shields'in verdiği ay (yıl yazılmamışsa **2026**; "bugün/dün/geçen pazartesi" = 2026-10). "Arşiv" bilgisi yalnızca sayfadan bakılanlarda verildi; verilmeyenler için **arşiv: DOĞRULANAMADI**.
- Doğrulama sütunu: **D** = kaynağından (dosya/sayfa/komut çıktısı) doğrulandı · **K** = kısmen (bir yönü doğrulanamadı) · **X** = DOĞRULANAMADI.
- Erişilemeyenler: Poly Pizza (403), gameasset.net (DNS yok), developers.facebook.com'un bazı JS-render sayfaları (Insights metrik adları).
- Projede kendi çalıştırdığım testler: (a) `ffmpeg ebur128/freezedetect/blackdetect/silencedetect` ile `out/DOSYA001.mp4`; (b) `gundem.ts` BLOCK listesine örnek başlıklar; (c) Node `toUpperCase` testi; (d) Kenney GLB iskelet/klip karşılaştırması. Bunlar bölüm 1'de "Bonus bulgular"da.

---

## 1. YÖNETİCİ ÖZETİ

**HEMEN EKLE**
1. **Kenney "Mini" ailesi (CC0):** tüm `character-*` modelleri **aynı 7 eklemli iskelete** (root, leg-L/R, torso, arm-L/R, head) ve aynı 32 klibe (idle, walk, sprint, sit, pick-up, emote-yes/no, interact, wheelchair-*…) sahip → yeni skinler sıfır retarget ile 27'lik kadroya girer. Bizde olmayan: `mini-market` (bakkal içi + employee), `mini-arcade`, `mini-dungeon`/`mini-arena`/`mini-skate`/`mini-forest` karakterleri (human, orc, soldier, skate-boy/girl, archer), **`cube-pets` (24 hayvan: kedi, köpek, tilki… 8 klip)**. Toplam 34 yeni 3D paket + `music-jingles`, `emotes-pack` (bölüm 11).
2. **Türkçe glifleri doğrulanmış OFL fontlar** (fonttools ile Ğ ğ İ ı Ş ş test edildi): Anton, Bebas Neue, Archivo Black, Bangers, Baloo 2, Paytone One, Russo One, Rubik, Montserrat, Poppins, Inter, Oswald… **Eksik çıkanlar:** Lilita One, Fredoka, Titan One, Chango, Passion One, Knewave (bölüm 2.1).
3. **Çıktı denetimi `npm run check`'e:** mevcut `DOSYA001.mp4` **−20.2 LUFS, LRA 10.2 LU, true peak −0.1 dBFS** ölçüldü (klip eşiği yakın) → `ffmpeg ebur128` ölçümü + `loudnorm` master adımı; golden-still karşılaştırması (`odiff`/`pixelmatch`); güvenli alan lint'i.
4. **Gerçek bir hata:** `o.label.toUpperCase()` (DecisionScreen, ArchiveInterior, Overlay) Türkçede "GERİ GETİR" yerine **"GERI GETIR"** üretiyor → `toLocaleUpperCase("tr-TR")`.
5. **Gündem filtresine ikinci katman:** mevcut kök listesi "vefat, ölmüş, can verdi, kurşun, uyuşturucu, arbede" gibi başlıkları kaçırıyor; "maç/konser/festival/dizi" içerenler **UYGUN** çıkabiliyor (test: 8 başlıktan 6'sı BLOCK'u geçti).
6. **Yorum çekme için tek meşru yol: Meta Graph API** (`/{media-id}/comments`, sayfa başı ≤50, yalnız üst düzey yorum, `from.username`, `like_count`) — `tally-votes.ts` CSV'sine doğrudan eşlenir.

**DENE**
7. glTF-Transform (`optimize`, `palette`, `join`, `meshopt`, `webp`) ile GLB'leri küçült → yazılım WebGL'de yükleme/çizim maliyeti; Quaternius *Universal Base Characters + Animation Library 1/2* (CC0, 120+130 klip, humanoid rig); KayKit (CC0; GitHub'da gltf aynaları); `@theatre/core` (kamera/animasyonu görsel kur, JSON çıkar — R3F bağlayıcısı R3F 8'e kilitli, **core'u elle sür**); LDtk/Tiled → mahalle yerleşim JSON'u; WFC (mxgmn/DeBroglie) sahne düzeni; Concordia/Dramatron/ConStory-Bench fikirleri (senaryo tutarlılığı); Detoxify `multilingual` + Zeyrek/Zemberek (yorum moderasyonu & gündem lemmalaştırma); `date-holidays` (TR resmî/dinî tatil takvimi); Meta Business Discovery (rakip analizi, resmî).

**UZAK DUR**
8. Instagram/TikTok **kazıyıcıları** (instaloader, TikTok-Api, gallery-dl, snscrape): ToS ihlali + hesap/IP riski + kırılgan; snscrape fiilen ölü, `pytrends` **arşivlendi (2025-04-17)**. Hunyuan3D-2 (lisans **AB/Birleşik Krallık/G.Kore'de geçersiz**, 1M MAU eşiği), Stable Fast 3D (yıllık gelir <1M$ şartı, kayıt), TRELLIS (≥16 GB NVIDIA GPU); `pmndrs/timeline` (delta toplayarak ilerler → Remotion'un rastgele kare erişimiyle uyumsuz); `fframes` (Rust/SVG, three yok); Perspective API (**31.12.2026'da kapanıyor**); `shixinzhang/tiktok-viral-hooks` (CC BY-NC-SA); Qwen3Guard'ı gündem filtresi olarak (kategori seti LLM-prompt güvenliği içindir, haber konusu değil).

---

## 1.1 En değerli 5 bulgu (kısa)
1. Kenney Mini ortak iskelet + 32 klip + cube-pets hayvanları + mini-market/arcade (CC0).
2. Gündem filtresi delikleri + katmanlı çözüm; Perspective API ölüyor; Detoxify Türkçe AUC 97.19 (README).
3. Resmî Meta API gerçekleri: yorum (50/sayfa, üst düzey), Business Discovery, Hashtag (30/7 gün); TikTok Research API Türkiye'ye kapalı; Content Posting API denetimsiz istemci = yalnız özel.
4. Ses/QA: −20.2 LUFS / TP −0.1 dBFS ölçümü, `toUpperCase` hatası, güvenli alan çelişkisi (kaynaklar 108–270 px üst, 250–670 px alt diyor; Meta piksel yayınlamıyor → X).
5. Doğrulanmış Türkçe font listesi + glTF-Transform fonksiyon seti (`palette/join/flatten/instance/simplify/unlit`) + Remotion 5.0 lisans değişikliği (müteahhitler ekip sayısına girer).

---

## 2. ALAN 1 — Hazır varlık / model / animasyon / font / emoji / ses

### 2.1 Fontlar (OFL; npm `@fontsource/<ad>` 5.3.0; Türkçe test = latin + latin-ext cmap'inde Ğ ğ İ ı Ş ş Ç ç Ö ö Ü ü)

Test yöntemi: her paketin en kalın ağırlığının `latin-ext` + `latin` woff2'si indirilip `fontTools` ile cmap okundu. **D** (komut çıktısı).

| Font | Ağırlıklar | Lisans | Türkçe | Not (dikey video) |
|---|---|---|---|---|
| Anton | 400 | OFL-1.1 | OK | Dar, çok güçlü başlık (hook) |
| Bebas Neue | 400 | OFL-1.1 | OK | Yalnız büyük harf görünümlü; etiket/HUD |
| Archivo Black | 400 | OFL-1.1 | OK | Kalın grotesk başlık |
| Bangers | 400 | OFL-1.1 | OK | Çizgi roman "PATLA" efekti |
| Baloo 2 | 400–800 | OFL-1.1 | OK | Yuvarlak, sıcak, mahalle tonu |
| Paytone One | 400 | OFL-1.1 | OK | Yumuşak kalın başlık |
| Russo One | 400 | OFL-1.1 | OK | Teknik/spor |
| Rubik | 300–900 | OFL-1.1 | OK | Altyazı için 800/900 iyi okunur |
| Montserrat | 100–900 | OFL-1.1 | OK | 800/900 başlık |
| Poppins | 100–900 | OFL-1.1 | OK | Altyazı/başlık |
| Inter | 100–900 | OFL-1.1 | OK | Küçük metin/HUD |
| Oswald, League Gothic, Fjalla One, Teko, Staatliches, Big Shoulders Display | çeşitli | OFL-1.1 | OK | Dar başlık alternatifleri |
| Alfa Slab One, Sigmar, Bungee, Rammetto One, Dela Gothic One, Black Ops One, Righteous, Modak, Shrikhand | 400 | OFL-1.1 | OK | **Bungee = tabela/dükkân levhası** (bakkal, dönerci) |
| Nunito, Quicksand, Comfortaa, Lexend, Outfit, Sora, Jost, Kanit, Space Grotesk, Bricolage Grotesque | çeşitli | OFL-1.1 | OK | Gövde metni |
| Pacifico, Lobster, Yellowtail, Caveat, Kalam, Patrick Hand, Amatic SC, Marck Script, Pattaya, Caveat Brush | çeşitli | OFL-1.1 | OK | El yazısı levha/not/menü |
| Special Elite, Courier Prime, VT323, Press Start 2P | 400/700 | OFL-1.1 | OK | Daktilo/CRT |
| Luckiest Guy | 400 | **Apache-2.0** | OK | Çizgi film başlığı |
| **Lilita One, Fredoka, Chango, Passion One** | — | OFL | **EKSİK: Ğ ğ İ Ş ş** | KULLANMA |
| **Titan One** | 400 | OFL | **EKSİK: İ** | KULLANMA |
| **Rubik Mono One** | 400 | OFL | **EKSİK: ı** | KULLANMA |
| **Knewave, Bagel Fat One, Pathway Extreme** | — | OFL | EKSİK | KULLANMA |
| Permanent Marker, Gochi Hand, Share Tech Mono, Chewy, Fugaz One, Squada One, Mochiy Pop One, Boogaloo, Bowlby One, Changa One | — | OFL | latin-ext alt kümesi **yok** → ş/ğ/İ yok sayıldı | KULLANMA |

Ek: `google/fonts` (~21k★, MIT-dışı: her fontun kendi OFL/Apache dosyası; GitHub lisansı "belirtilmemiş") ana depo; `fontsource/fontsource` (~6.2k★, MIT, dün). Meta veri: `fonts.google.com/metadata/fonts` (1950 aile, `subsets` alanı). **Arapça (gelecek sürüm) — fontsource'ta `arabic` alt kümesi doğrulandı:** Cairo, Tajawal, Almarai, IBM Plex Sans Arabic, Noto Naskh Arabic, Changa, Reem Kufi, El Messiri (hepsi OFL-1.1; Tajawal/Almarai'de latin-ext yok → karışık Latin-Türkçe için Cairo/IBM Plex Sans Arabic/Noto Naskh seç).

### 2.2 Emoji / ikon / reaksiyon balonu

| Kaynak | ★ | son commit | Lisans | Ne yapar | Uyum | Zorluk | Değer | Doğr. |
|---|---|---|---|---|---|---|---|---|
| [Kenney Emotes Pack](https://kenney.nl/assets/emotes-pack) | — | 2018 (zip 2023-02) | CC0 | 480 dosya, Pixel+Vector × 8 stil: anger, idea, heartBroken, question, exclamations, sleeps, drops, cash, laugh, faceHappy… (0,4 MB) | **Yüzsüz karakterlerin duygusunu karakter başı balonla verir** | Çok kolay (PNG, billboard sprite) | **5** | D (zip indirildi) |
| [googlefonts/noto-emoji](https://github.com/googlefonts/noto-emoji) | ~5.1k | 2026-09 | Font: OFL-1.1; görseller çoğunlukla Apache-2.0 | Düz emoji PNG/SVG | A/B oy ekranı, yorum balonu | Kolay | 3 | D (README) |
| [`@remotion/animated-emoji`](https://www.remotion.dev/docs/animated-emoji) (npm 4.0.535, MIT) | — | 2026-10 | **Emojiler CC BY 4.0 → atıf zorunlu** | Google animasyonlu emoji bileşeni | Kutlama/tepki | Çok kolay | 3 | D (docs) |
| [jdecked/twemoji](https://github.com/jdecked/twemoji) | ~1.9k | 2026-06 | Kod MIT; **grafikler CC-BY 4.0** | Düz emoji SVG | Atıf şart | Kolay | 2 | D (LICENSE-GRAPHICS) |
| [microsoft/fluentui-emoji](https://github.com/microsoft/fluentui-emoji) | ~10k | 2026-08 | MIT | 3D/Flat/Color emoji | 3D emoji PNG stili low-poly ile uyumlu | Kolay | 3 | K (lisans D; 3D klasörü sayfadan doğrulanmadı) |
| Kenney game-icons / board-game-icons / ranks / medals | — | — | CC0 | 105/250/70/27 ikon | HUD/rozet | Kolay | 2 | D |
| [LottieFiles/awesome-lottie](https://github.com/LottieFiles/awesome-lottie) | ~331 | 2026-04 | belirtilmemiş | Yalnızca liste | — | — | 1 | D |
| hfg-gmu/openmoji | — | — | CC BY-SA 4.0 (bilgi) | **Depo adı doğrulanamadı** | — | — | — | X |

### 2.3 3D model / animasyon depoları ve siteleri

| Repo / site | ★ | son commit | Lisans (ticari?) | Ne yapar | Uyum | Zorluk | Değer | Doğr. |
|---|---|---|---|---|---|---|---|---|
| [kenney.nl/assets](https://kenney.nl/assets) (GitHub deposu yok; ETdoFresh/kenney.nl aynası 4★, 2020 → eski) | — | zip'ler 2026-10'a kadar güncel | CC0 ✓ atıf yok | **50 adet 3D paket** (bizde 16, eksik 34), 10 ses, 10 doku, 145 2D | Ana omurga | Çok kolay (aynı yapı: `Models/GLB format`) | **5** | D (sayfalar+zip'ler) |
| [KayKit-Game-Assets/…](https://github.com/KayKit-Game-Assets) GitHub aynaları: City-Builder-Bits-1.0 (~39★), Furniture-Bits-1.0 (~10★), Restaurant-Bits-1.0 (~21★), Prototype-Bits-1.0 (~29★), Halloween-Bits-1.0 (~17★), Character-Pack-Adventures-1.0 (~59★), Skeletons-1.0 (~28★), Dungeon-Remastered-1.0 (~30★) | 10–60 | 2023-09…2024-02 (**eski sürüm**; itch.io'da "29 gün önce güncellendi") | **CC0** (LICENSE.txt klonda okundu), "kopya satma" ricası | gltf+bin (şehir 41, mobilya 53, restoran 144 gltf; 12–34 MB); Adventurers 5 **GLB**, ~3,5 MB, ~6k üçgen, **76 klip** (Idle, Walking_A/B/C, Cheer, Sit_Chair_*, Interact, PickUp, Throw, Use_Item, Hit, Death, Lie_Down…) | Mobilya/restoran/şehir bitleri düşük poligon; karakterlerin **yüzü var** (yüzsüz kuralıyla çelişir) ve üçgen sayısı yüksek | Kolay | 3 | D (klonlandı, GLB okundu) |
| [kaylousberg.itch.io](https://kaylousberg.itch.io) (güncel KayKit) | — | güncel | CC0; "Name your own price" (ücretsiz indirilebilir); *Mystery Monthly 4/5/6 ve Bundle'lar ücretli* | Character Animations (rig_medium/large, gltf), Restaurant/Furniture/Space Base/Holiday/Resource/Block Bits… | Animasyon kütüphanesi | Orta (elle indirme) | 3 | D (sayfa) |
| [quaternius.com](https://quaternius.com/) | — | güncel | **CC0** (her paket sayfasında CC0 bağlantısı) | **Universal Base Characters** (6 insan, Superhero/Regular/Teen, 20 saç; humanoid rig, glTF), **Universal Animation Library 1 (120+ klip) ve 2 (130+)**, **Modular Character Outfits – Fantasy** (12 kıyafet/62 parça), **Downtown City MegaKit** (300+ modüler parça), Zombie Apocalypse Kit (köpek+araç, glTF), Cube World Kit, Ultimate Animated Animals (12 hayvan, glTF), Sushi Restaurant Kit, Ultimate Modular Characters (11 karakter/24 klip, glTF). *Ultimate Home Interior, Modular Streets, Cars, Public Transport, Farm Animals: yalnız FBX/OBJ/Blend* | 27 farklı karakter için kıyafet+saç kombinasyonu; "Downtown" NYC/Boston stili bizim mahalleye **yabancı** | İndirme Drive/itch üzerinden elle (docs/KAYNAKLAR.md de aynısını söylüyor); yeniden dağıtma yasak notu | 4 | D (sayfa metinleri) — indirme akışı X |
| [ToxSam/open-source-3d-assets](https://github.com/ToxSam/open-source-3d-assets) + [cc0-models-Polygonal-Mind](https://github.com/ToxSam/cc0-models-Polygonal-Mind) | ~167 / ~9 | 2026-02-23 | CC0 (README+projects.json) | 18 koleksiyon, **991 GLB** (indeks JSON'da doğrudan `raw` GLB bağlantısı) | MomusPark (park/bank), medieval-fair, transit; Decentraland teması çoğunlukla yabancı | Kolay | 2 | D (klonlandı, 991 sayıldı) |
| [KenneyNL/Starter-Kit-City-Builder](https://github.com/KenneyNL/Starter-Kit-City-Builder) | ~1.5k | 2026-03 | MIT | Godot (GDScript) ızgara yerleştirme + Kenney modelleri | Yalnız fikir (yerleşim UX) | — | 1 | D (shields) |
| [3dassets-dev/3dassets](https://github.com/3dassets-dev/3dassets) | ~1 | 2026-09 | belirtilmemiş | Küçük GLB kayıt defteri | — | — | 1 | K |
| [pmndrs/market-assets](https://github.com/pmndrs/market-assets) | ~23 | 2023-01-04 | belirtilmemiş | 238 MB, 13 GLB | Eski | — | 1 | D (klonlandı) |
| Poly Pizza (poly.pizza) | — | — | model başına CC0/CC-BY | 6000+ model iddiası (magictools listesi) | — | — | ? | **X (403)** |

### 2.4 Ses / müzik / prosedürel SFX

| Kaynak | ★ | son commit | Lisans | Ne yapar | Uyum | Değer | Doğr. |
|---|---|---|---|---|---|---|---|
| Kenney **music-jingles** (85 dosya, 1,2 MB) | — | 2014 (zip 2023) | CC0 | Kısa müzik "stinger"ları | A/B oy ekranı & bölüm sonu tek vuruş | 4 | D |
| Kenney casino-audio (50), voiceover-pack (90, İngilizce kısa sesler), voiceover-pack-fighter (45) | — | — | CC0 | Zar/kart/jeton; İngilizce sesler | Voiceover **Türkçe değil** → düşük | 2 | D |
| [KilledByAPixel/ZzFX](https://github.com/KilledByAPixel/ZzFX) | ~802 | 2026-10 | MIT | Parametreli, sayı dizisinden **deterministik** SFX üretimi (bayt) | Yer tutucu/ek SFX'i koddan, lisans sorunu olmadan | 3 | D |
| [chr15m/jsfxr](https://github.com/chr15m/jsfxr) | ~456 | 2026-05 | Unlicense | sfxr tarayıcı sürümü | Retro SFX | 2 | D |
| [Tonejs/Tone.js](https://github.com/Tonejs/Tone.js) | ~15k | 2026-10 | MIT | WebAudio; `Tone.Offline` ile çevrimdışı render (**kareyle uyumlu**) | Prosedürel müzik | 2 | K (README-düzeyi bilgi; denenmedi) |
| gold-noir-video-creator `scripts/bgm.mjs` | — | 2026-10 | MIT | Zaman çizelgesinden **kodla sentezlenen WAV**, test ile determinist doğrulanıyor (bölüm 9) | Teknik fikir | 3 | D (kod okundu) |
| OpenGameArt, FMA, ccMixter, Incompetech | — | — | dosya bazında değişir | Zaten KAYNAKLAR.md'de | — | — | D (OGA 200 döndü) |

---

## 3. ALAN 2 — İçerik, izleyici etkileşimi, veri toplama, trend, Türkçe NLP

### 3.1 Resmî API'ler (önce bunlar) — hepsi **D** (doküman sayfası okundu)

| API | Gerçekler | Projeye etkisi |
|---|---|---|
| Instagram **Comment Moderation / IG Media comments** (Graph API v26.0; sayfa güncelleme 2025-06-02) | `GET /{IG_MEDIA_ID}/comments`; izin `instagram_business_manage_comments` (Instagram Login) veya `instagram_manage_comments`+`pages_read_engagement` (Facebook Login); **Standard Access = sahibi olduğun/uygulamana eklediğin hesaplar** (başkalarının hesapları için Advanced Access; App Review gereksinimi bu sayfadan doğrulanamadı → X); sayfa başı **en fazla 50**, **yalnız üst düzey yorum** (yanıtlar için `replies` alan genişletmesi), **zaman filtresi yok**, v3.2+ ters kronolojik; alanlar `from{id,username}`, `text`, `timestamp`, `like_count`, `hidden`; webhook `comments`/`live_comments` (Meta "rate limit'e takılmamak için webhook'u şiddetle öneriyor") | `tally-votes.ts` CSV'si (`user_id,option,timestamp`) için ince bir adaptör yeterli: tüm sayfaları çek → zaman artan sırala ("ilk geçerli oy" kuralı bunu gerektirir). Rate-limit sayıları üçüncü taraf bloglarda çelişiyor → **X** |
| Instagram **Business Discovery** (Facebook Login; güncelleme 2026-08-12) | Başka bir *profesyonel* hesabın `followers_count`, `media_count` ve `media` (beğeni/yorum sayıları) bilgisini döndürür; yaş kısıtlı hesaplar dönmez; telif sesli reel'lerde `media_url` gelmez | **Rakip/benzer hesap araştırmasının meşru yolu** (kazıma yerine) |
| Instagram **Hashtag Search** (güncelleme 2026-08-17) | Rolling 7 günde **en fazla 30 benzersiz hashtag**; App Review + "Instagram Public Content Access"; hassas/saldırgan hashtag'e genel hata; emoji yok | Hashtag keşfi için kota çok düşük; haftalık 30 etiket planla |
| YouTube Data API v3 | Varsayılan **10.000 birim/gün**; `commentThreads.list` = **1 birim**; `search.list` günde 100 çağrıyla ayrı kovada | Shorts yorumları için `youtube-comment-downloader` yerine bu |
| TikTok **Research API** | Yalnız ABD/AEA/BK/Kanada/İsviçre akademik kurumları veya AB'deki kar amacı gütmeyen kuruluşlar; **Türkiye listede yok**, ticari kullanım yok | **Kullanılamaz** |
| TikTok **Content Posting API** | "Denetlenmemiş (unaudited) istemcinin tüm gönderileri **özel (private)** görünür"; kamuya açmak için TikTok denetimi | Yayın otomasyonu aşamasında bilgi |
| **Google Trends API (alpha)** — 24 Tem 2025 duyuru | Yalnız başvuruyla; son 5 yıl, günlük/haftalık/aylık/yıllık, bölge kırılımı; fiyat/GA tarihi yayınlanmamış | Başvuru formu açık; şimdilik RSS (`trends.google.com/trending/rss?geo=TR` canlı çalışıyor, bugün test edildi) |

### 3.2 Toplayıcı / kazıyıcı araçlar (ToS & etik dürüst değerlendirme)

| Repo | ★ | son commit | Lisans | Ne yapar | Uyum / Risk | Değer | Doğr. |
|---|---|---|---|---|---|---|---|
| [yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp) | ~198k | 2026-10 | Unlicense | Video+metadata+yorum (`--skip-download --write-comments --dump-json`) | YouTube ToS indirmeyi kısıtlar; **yalnız metadata/halka açık analiz** için, kendi videonu dışında medya indirme | 3 | D |
| [egbertbouman/youtube-comment-downloader](https://github.com/egbertbouman/youtube-comment-downloader) | ~1.3k | bugün | MIT | API'siz yorum çekme | Resmî API varken gereksiz; kırılgan | 2 | D |
| [jdepoix/youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api) | ~8.5k | 2026-09 | MIT | Altyazı/transkript çekme | Rakip hook metinlerini analiz için; resmî olmayan uç nokta | 2 | D |
| [instaloader/instaloader](https://github.com/instaloader/instaloader) | ~14k | dün | MIT | Instagram profil/gönderi/yorum indirir | **Instagram ToS otomatik erişimi yasaklar**; hesap kısıtlama riski → **kullanma** (Business Discovery kullan) | 1 | D (ToS yorumu: ilke bilgisi, sayfa alıntılanmadı → K) |
| [davidteather/TikTok-Api](https://github.com/davidteather/TikTok-Api) | ~6.7k | 2026-08 | MIT | "Unofficial API wrapper"; Playwright + `ms_token` çerezi; bot engeli (`EmptyResponseException`) README'de | ToS ihlali, kırılgan → **uzak dur** | 1 | D (README) |
| [mikf/gallery-dl](https://github.com/mikf/gallery-dl) | ~20k | 2026-10 | GPL-2.0 | Görsel/medya indirici | Telif/ToS; bu proje için gereksiz | 1 | D |
| [JustAnotherArchivist/snscrape](https://github.com/JustAnotherArchivist/snscrape) | ~5.5k | **2023-06** | GPL-3.0 | Sosyal ağ kazıyıcı | Fiilen terk (arşiv: sayfada bildirim yok), Twitter erişimi kapandı → **eledim** | 0 | K |
| [GeneralMills/pytrends](https://github.com/GeneralMills/pytrends) | ~3.7k | 2023-04 | Apache 2.0 (PyPI) | Resmî olmayan Google Trends | **Arşivlendi 2025-04-17** ("Looking for maintainers!") → **eledim** | 0 | D (sayfa) |
| [sdil87/trendspy](https://github.com/sdil87/trendspy) | ~123 | 2024-12 | MIT | pytrends'in halefi benzeri (PyPI 0.1.6) | Resmî olmayan; RSS yeterli | 2 | D |
| [praw-dev/praw](https://github.com/praw-dev/praw) | ~4.3k | dün | BSD-2 | Reddit resmî API sarmalayıcısı | Türkçe gündem için zayıf | 1 | D |
| Wikimedia pageviews / GDELT | — | — | CC0 / açık | Gündem sinyali | Kontrol edilmedi | ? | X |

### 3.3 Hook / viral analiz (açık kaynak olarak zayıf alan)

| Repo | ★ | son | Lisans | Not | Değer | Doğr. |
|---|---|---|---|---|---|---|
| [ddaverse/shorts-reels-hook-analyzer](https://github.com/ddaverse/shorts-reels-hook-analyzer) | ~5 | 2026-03 | belirtilmemiş | İlk 3–5 sn hook kontrolü iddiası; yöntem README'de yok | 1 | K |
| [kariemoorman/tiktok-analyzer](https://github.com/kariemoorman/tiktok-analyzer) | ~49 | 2026-03 | GPL-3.0 | TikTok indir + çok kipli analiz (kazıma içerir) | 1 | K |
| [shixinzhang/tiktok-viral-hooks](https://github.com/shixinzhang/tiktok-viral-hooks) | ~34 | dün | **CC BY-NC-SA 4.0** (aramada belirtildi; GitHub "tanımsız") | Hook kütüphanesi (transkript+formül) | 1 (ticari değil) | K |
| [Agent-Field/reels-af](https://github.com/Agent-Field/reels-af) | ~116 | 2026-06 | Apache-2.0 | AI çoklu ajan reel üretici | Konsepte uymuyor | 1 | K |

Sonuç: Retention'ı ölçen açık araç **bulunamadı**; gerçek sinyal yalnız Instagram Insights'tan gelir (metrik adları dokümandan doğrulanamadı → **X**). Kendi hook ölçütümüz = `ffmpeg scdet` (kesim ritmi) + LLM ile ilk 3 sn kare/altyazı değerlendirmesi.

### 3.4 Türkçe NLP ve güvenlik (gündem + yorum)

| Repo / model | ★ | son | Lisans | Ne yapar | Uyum | Zorluk | Değer | Doğr. |
|---|---|---|---|---|---|---|---|---|
| [ahmetaa/zemberek-nlp](https://github.com/ahmetaa/zemberek-nlp) | ~1.4k | 2026-10 | Apache-2.0 | Türkçe morfoloji, lemma, normalizasyon (Java) | Gündem BLOCK kökleri yerine **lemma eşleşmesi** | Orta (Java) | 4 | D (LICENSE) |
| [Loodos/zemberek-python](https://github.com/Loodos/zemberek-python) | ~142 | 2025-06 | Apache-2.0 | Zemberek'in Python portu | Java istemezsen | Kolay | 3 | D |
| [obulat/zeyrek](https://github.com/obulat/zeyrek) | ~67 | 2024-07 | MIT | Hafif lemmatizer (PyPI) | Hızlı çözüm | Kolay | 3 | D (shields) |
| [snowballstem/snowball](https://github.com/snowballstem/snowball) | ~881 | dün | BSD-3 | Türkçe stemmer (npm `snowball-stemmers`) | Node'da hazır | Çok kolay | 2 | K |
| [google-research/turkish-morphology](https://github.com/google-research/turkish-morphology) | ~186 | 2022-03 | Apache-2.0 | FST morfoloji | Eski | Orta | 2 | D |
| [stanfordnlp/stanza](https://github.com/stanfordnlp/stanza) | ~7.9k | 2026-10 | Apache-2.0 | Türkçe UD (lemma, POS, NER) | Ağır | Orta | 2 | D |
| [turkish-nlp-suite/Turkish-Spacy-Models](https://github.com/turkish-nlp-suite/Turkish-Spacy-Models) | ~93 | 2025-11 | **CC-BY-SA-4.0** | spaCy-tr modelleri | Paylaşım-aynı koşullu | Orta | 2 | D |
| [unitaryai/detoxify](https://github.com/unitaryai/detoxify) | ~1.3k | dün | Apache-2.0 | `multilingual` model (xlm-roberta-base; **Türkçe dahil 7 dil**); README Türkçe alt küme: **14000 örnek, AUC 97.19** | **Yorum moderasyonu / sansür katmanı** | Orta (Python, CPU çalışır) | **4** | D (README) |
| [ViralLab/TurkishBERTweet](https://github.com/ViralLab/TurkishBERTweet) | ~41 | 2024-09 | MIT | LoRA: SA (42.476 tweet), **HS = nefret söylemi (4.683 tweet)** | Küçük veri; ikinci görüş | Orta | 2 | D |
| HF: `gokceuludogan/convbert-base-turkish-mc4-toxicity-uncased`, `Overfit-GM/*-turkish-*-offensive`, `ariyul/turkish-toxic-language-detection`… | — | 2023 | BSD / Apache / MIT | OffensEval-TR tarzı | İndirme sayıları çok düşük (≤270) → zayıf güven | Kolay | 2 | D (HF API) |
| [QwenLM Qwen3Guard-Gen 0.6B/4B/8B](https://huggingface.co/Qwen/Qwen3Guard-Gen-8B) | HF 205k indirme (0.6B) | 2025-11-07 | Apache-2.0 | 119 dil; Safe/Controversial/Unsafe; kategoriler: Violent, Non-violent Illegal Acts, Sexual, PII, Self-Harm, Unethical Acts, **Politically Sensitive Topics**, Copyright | **Yorum moderasyonu** için anlamlı; **haber konusu filtresi için değil** (kategori seti LLM-prompt güvenliği). Türkçe doğruluğu **X** | Orta | 3 | D (model kartı); Türkçe: X |
| [meta-llama/PurpleLlama](https://github.com/meta-llama/PurpleLlama) (Llama Guard) | ~4.4k | 2026-10 | Llama Community License | Çok dilli sınıflandırıcı | Türkçe desteği **X**; lisans kısıtları | Orta | 2 | K |
| [ibm-granite/granite-guardian](https://github.com/ibm-granite/granite-guardian) | ~185 | 2026-08 | Apache-2.0 | Guardrail modeli | Türkçe X | Orta | 1 | K |
| [NVIDIA/NeMo-Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) | ~7.3k | bugün | Apache-2.0 | Kural/LLM guardrail çerçevesi | Ağır | Zor | 1 | D |
| **Perspective API** (Jigsaw) | — | — | — | **"31 Aralık 2026'ya kadar aktif; sonrasında hizmet dışı, geçiş desteği yok"** (resmî sayfa) | Dramatron vb. README'ler hâlâ öneriyor → **bağlanma** | — | 0 | D |

**Gündem filtresi — ölçülmüş boşluklar** (`scripts/gundem.ts` BLOCK listesi, kendi projenin kodu, 8 başlık testi):
BLOCK'u **geçen** ve izinli konu kökü (maç/konser/festival/dizi/derbi) içerdiği için **UYGUN** çıkabilecekler: "Maç sonrası taraftarlar arasında **arbede** çıktı", "Ünlü sanatçı **vefat** etti, konser iptal edildi", "Festival alanında **uyuşturucu** operasyonu", "Dizi oyuncusu evinde **ölmüş** bulundu", "Derbi öncesi **kurşun**lama", "Konser sonrası **can verdi**". Yakalanan: "…bahis soruşturması, maç şikesi" ve "…hayatını kaybetti".
Önerilen katmanlama: (1) Zeyrek/Zemberek lemma + genişletilmiş kök listesi (vefat, ölmüş/ölen, can ver, kurşun, uyuşturucu, arbede, bahis, rüşvet, hırsız, kavga…); (2) **LLM ile sıfır-atış sınıflandırma** (proje zaten Claude ile yürüyor; gundem.json "block" listesi rubrik olarak verilir); (3) insan onayı (zaten var). Yorum tarafı için Detoxify.

### 3.5 Takvim / gündem yan veri

| Repo | ★ | son | Lisans | Ne yapar | Değer | Doğr. |
|---|---|---|---|---|---|---|
| [commenthol/date-holidays](https://github.com/commenthol/date-holidays) (npm 3.37.0) | ~1.1k | 2026-09 | **ISC AND CC-BY-3.0** (veri atfı) | `TR.yaml`: 23 Nisan, 19 Mayıs, 15 Temmuz, 30 Ağustos, 29 Ekim + hesaplanan dinî bayramlar (1 Şevval, 10 Zilhicce); Türkçe adlar | Olay takvimi/kıyafet-dekor mevsimleme | 3 | D (paket açıldı) |
| [nager/Nager.Date](https://github.com/nager/Nager.Date) | ~1.4k | dün | MIT | Resmî tatil API | 2 | K |
| [open-meteo/open-meteo](https://github.com/open-meteo/open-meteo) | ~6.4k | bugün | AGPL-3.0 (kod); API "kimlik doğrulamasız **ticari olmayan** kullanım" | Gerçek hava verisi → "hava" gündemleri | Ticari kullanımda ücretli plan → reklam sonrası kontrol | 2 | K |

---

## 4. ALAN 3 — Yapay zekâ destekli üretim hattı

| Repo | ★ | son | Lisans (ticari?) | Ne yapar | Uyum | Zorluk | Değer | Doğr. |
|---|---|---|---|---|---|---|---|---|
| [google-deepmind/concordia](https://github.com/google-deepmind/concordia) | ~1.8k | bugün | Apache-2.0 ✓ | **Game Master** deseni: varlıklar (bileşen+bellek) niyetini doğal dille söyler, GM sonucu çözer; LLM API ister | Günlük mahalle olayı/ilişki simülasyonu → olay JSON'u (çevrimdışı yazarlık aracı) | Orta (Python+LLM) | 3 | D (README) |
| [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town) | ~11k | 2026-08 | MIT ✓ | Küçük kasaba ajanları; Convex + Ollama/OpenAI | Mimari ilham (bellek, konuşma); Convex bağımlılığı ağır | Zor | 2 | D (README) |
| [joonspk-research/generative_agents](https://github.com/joonspk-research/generative_agents) | ~22k | **2023-08** | Apache-2.0 ✓ | Bellek akışı + yansıtma + planlama (Smallville) | Karakter hafızası kavramı | Referans | 2 | D (shields) |
| [google-deepmind/dramatron](https://github.com/google-deepmind/dramatron) | ~1.1k | 2024-07 | Apache-2.0 ✓ | Log-line → karakterler → olay örgüsü → mekânlar → diyalog (hiyerarşik), LLM'siz "unplugged" Colab | Bölüm JSON şemamıza (evren→olay→sahne) benzer yapı | Kolay (fikir) | 3 | D (README) |
| [Picrew/ConStory-Bench](https://github.com/Picrew/ConStory-Bench) | ~183 | 2026-04 | MIT ✓ | Uzun hikâyede tutarsızlık sınıflandırması (karakter/zaman çizgisi/dünya kuralı) | `validate-universe/script` kural fikirleri | Kolay | 2 | K |
| [zhennan1/NstAgent](https://github.com/zhennan1/NstAgent) | ~4 | 2026-09 | MIT | Yapılandırılmış anlatı durumu izleme (araştırma) | Çok küçük/yeni | — | 1 | K |
| [datacrystals/AIStoryWriter](https://github.com/datacrystals/AIStoryWriter) | ~258 | 2025-11 | **AGPL-3.0** | Uzun hikâye üretici | Gerek yok, AGPL | — | 0 | D |
| [Picrew/awesome-llm-story-generation](https://github.com/Picrew/awesome-llm-story-generation), [yingpengma/Awesome-Story-Generation](https://github.com/yingpengma/Awesome-Story-Generation) | ~115 / ~665 | 2026-10 | belirtilmemiş / CC-BY-4.0 | Makale+kod listeleri | Tarama için | 2 | D |
| [getzep/graphiti](https://github.com/getzep/graphiti), [mem0ai/mem0](https://github.com/mem0ai/mem0), [letta-ai/letta](https://github.com/letta-ai/letta) | ~32k / ~67k / ~25k | bugün/dün/2026-09 | Apache-2.0 | Zamansal bilgi grafı / bellek katmanları | Bizde zaten JSON dünya durumu var → **gereksiz**, `worldState.json` yeterli | Orta | 1 | D (shields) |
| [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp) | ~31k | 2026-10 | MIT ✓ | Claude ↔ Blender (Poly Haven, Sketchfab, Poly Pizza, Tripo/Hyper3D/Hunyuan3D bağlantıları); **telemetri**: varsayılan anonim kullanım kaydı; içerik opt-in; `DISABLE…` ortam değişkeniyle tamamen kapanır | Özgün low-poly prop'u LLM'e modelletme | Orta | 3 | D (README) |
| [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) | ~18k | 2026-10-08 | Apache-2.0 ✓ | **Agent skill**: referans görselden **kod-ile (prosedürel) three.js modeli**, aşama kapılı + "ekran görüntüsü ↔ referans" kendini düzeltme döngüsü; `forge/` Python betikleri, `.img2threejs/state.json` | Projenin "prosedürel geometri" ilkesiyle örtüşür; yöntem değerli, süreç ağır (Python, vision) | Orta | 3 | D (SKILL.md okundu) |
| [VAST-AI-Research/TripoSR](https://github.com/VAST-AI-Research/TripoSR) | ~7.1k | 2026-06 | MIT ✓ | Görsel→3D | Çıktı yüksek poligon, stile uymaz; GPU | Orta | 1 | D |
| [TencentARC/InstantMesh](https://github.com/TencentARC/InstantMesh) | ~4.6k | 2025-01 | Apache-2.0 | Görsel→3D | Aynı sorun | — | 1 | D |
| [microsoft/TRELLIS](https://github.com/microsoft/TRELLIS) | ~14k | 2025-11 | MIT (alt modüller farklı) | Görsel/metin→3D | README: **≥16 GB NVIDIA GPU** | Zor | 1 | D |
| [Tencent-Hunyuan/Hunyuan3D-2](https://github.com/Tencent-Hunyuan/Hunyuan3D-2) | ~15k | 2025-10 | **Tencent Hunyuan 3D 2.0 Community License: AB/BK/G.Kore'de geçerli değil; >1M MAU izin ister; çıktıyla başka AI modeli iyileştirmek yasak** | Metin/görsel→3D | **Uzak dur** (hukuki risk, GPU) | — | 0 | D (LICENSE okundu) |
| [Stability-AI/stable-fast-3d](https://github.com/Stability-AI/stable-fast-3d) | ~1.9k | 2025-01 | Stability Community License: **yıllık gelir >1M$ olursa lisans biter; ticari kullanımda kayıt şart** | Hızlı görsel→3D | Reklam geliri sonrası sorun | — | 0 | D |
| [allenai/Holodeck](https://github.com/allenai/Holodeck) | ~575 | 2024-08 | Apache-2.0 | LLM ile 3D iç mekân yerleşimi (Objaverse, AI2-THOR) | Fikir: LLM→yerleşim kısıtları; bizim varlıklarla çalışmaz | Zor | 2 | D (shields) |
| [princeton-vl/infinigen](https://github.com/princeton-vl/infinigen) | ~7.3k | dün | BSD-3 | Blender prosedürel dünya | Foto-gerçekçi; stile uymaz | — | 1 | D |
| [comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI) + [awesome-comfyui](https://github.com/ComfyUI-Workflow/awesome-comfyui) (~743★, 2025-07, GPL-3.0) | ~138k | bugün | GPL-3.0 | Konsept/referans görsel iş akışları | GPU, konsept aşaması; ana hat dışı | Orta | 1 | D |
| [lokesh/color-thief](https://github.com/lokesh/color-thief) (~14k, MIT), [Vibrant-Colors/node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) (~2.5k, lisans GitHub'da "belirtilmemiş") | — | 2026 | MIT | Görselden palet | Paletimiz sabit; düşük | Kolay | 1 | D |
| [SamG-Coder/ThreeBrowserStudio](https://github.com/SamG-Coder/ThreeBrowserStudio) | ~24 | 2026-09 | MIT | LLM-ilk three.js WebGPU sahne/animasyon + MCP | Çok küçük; WebGPU (bizde SwiftShader) | — | 1 | K |

**Kare analizi / yapay zekâ ile kalite denetimi:** Hazır açık araç bulunamadı. En iyi yol = `remotion still` ile seçili kareler → Claude vision (okunabilirlik, taşma, kontrast, güvenli alan). img2threejs'in "referans↔ekran görüntüsü, aşama başarısız olursa dur" kalıbı ödünç alınabilir. Deterministik taraf: DOM ölçümü (`getBoundingClientRect`) + renk kontrastı (bölüm 5).

---

## 5. ALAN 4 — Kalite kontrol / test (`npm run check` + render sonrası)

### 5.0 Mevcut render üzerinde ölçüm (kendi çalıştırmam, `out/DOSYA001.mp4`, ffmpeg 6.1.1 + Remotion'un paketli ffmpeg'i)
- Biçim: 1080×1920, 30 fps, 60.000 sn video; ses 60.011 sn.
- `ebur128=peak=true`: **Integrated −20.2 LUFS · LRA 10.2 LU · True peak −0.1 dBFS**.
- `freezedetect` (−60 dB, 1.5 sn), `blackdetect`, `silencedetect (−50 dB, 1 sn)`: **olay yok**.
- Sistem ffmpeg'inde `ebur128, loudnorm, silencedetect, volumedetect, astats, blackdetect, freezedetect, psnr, ssim, signalstats, scdet` var; **`libvmaf` yok**. `npx remotion ffmpeg/ffprobe` komutları dokümanda var; paketli ffmpeg'de `loudnorm` ve `silencedetect` görüldü (diğer filtreler çıktıda listelenmedi).
- Hedef LUFS için **resmî Instagram değeri yayınlanmamış → X**. Pratik: gold-noir şablonu `loudnorm=I=-16:TP=-1.5:LRA=11` (kendi seçimi) kullanıyor; tek kare yalnızca `-c:v copy` ile ses yeniden kodlanıyor.

### 5.1 Araç tablosu

| Repo | ★ | son | Lisans | Ne yapar | Uyum | Zorluk | Değer | Doğr. |
|---|---|---|---|---|---|---|---|---|
| ffmpeg yerleşik filtreler (`ebur128`, `loudnorm`, `freezedetect`, `blackdetect`, `silencedetect`, `scdet`) | — | — | LGPL/GPL (ffmpeg) | Ses/video kusur tespiti | **Sıfır bağımlılık**; `render-episode.ts` sonuna ekle | Çok kolay | **5** | D (çalıştırıldı) |
| [slhck/ffmpeg-normalize](https://github.com/slhck/ffmpeg-normalize) | ~1.5k | dün | MIT (LICENSE.md) | EBU R128 iki geçişli normalizasyon | `loudnorm` betiği yerine | Kolay (Python) | 3 | D |
| [slhck/ffmpeg-quality-metrics](https://github.com/slhck/ffmpeg-quality-metrics) | ~561 | dün | MIT | PSNR/SSIM/VMAF (referans gerekir) | Önceki render ↔ yeni render regresyonu | Orta | 2 | D |
| [Netflix/vmaf](https://github.com/Netflix/vmaf) | ~5.5k | 2026-10 | BSD-2-Clause-Patent | Algısal kalite | Referanssız; düşük değer | Zor | 1 | D |
| [csteinmetz1/pyloudnorm](https://github.com/csteinmetz1/pyloudnorm) | ~783 | 2026-01 | MIT | BS.1770 ölçüm | ffmpeg yeter | — | 1 | D |
| [jiixyj/libebur128](https://github.com/jiixyj/libebur128) | ~491 | 2021-02 | MIT | C kütüphane | Eski | — | 1 | D |
| [mapbox/pixelmatch](https://github.com/mapbox/pixelmatch) (npm 8.0.0, 2026-10-06) | ~7k | 2026-10 | ISC | PNG piksel farkı | **Golden still** karşılaştırması: `npm run stills` çıktısı ↔ `docs/golden/*.png` | Çok kolay (Node) | **4** | D |
| [dmtrKovalenko/odiff](https://github.com/dmtrKovalenko/odiff) (npm `odiff-bin` 4.5.0) | ~3.3k | 2026-10 | MIT | Hızlı yerel piksel farkı | Aynı | Çok kolay | 4 | D |
| [reg-viz/reg-suit](https://github.com/reg-viz/reg-suit), [lost-pixel/lost-pixel](https://github.com/lost-pixel/lost-pixel) | ~1.3k / ~1.7k | 2026-03/04 | MIT | Bulut depolu görsel regresyon | Fazla ağır | Orta | 1 | D |
| [microsoft/playwright](https://github.com/microsoft/playwright) | ~98k | bugün | Apache-2.0 | `toHaveScreenshot` | Remotion `renderStill` zaten var | — | 1 | D |
| [color-js/color.js](https://github.com/color-js/color.js) (npm `colorjs.io` 0.7.1) | ~2.3k | bugün | MIT | `contrast(a,b,"WCAG21"|"APCA")` | Altyazı/HUD kontrast lint'i (palet → piksel yerine tasarım zamanı) | Çok kolay | 3 | D (docs) |
| [Myndex/apca-w3](https://github.com/Myndex/apca-w3) | ~214 | 2026-05 | **W3 lisansı, "sınırlı" (LICENSE.md)** | APCA referansı | color.js yeter | — | 1 | K |
| [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | ~7.7k | bugün | MPL-2.0 | DOM erişilebilirlik (kontrast dahil) | Remotion bileşenleri DOM → `renderStill` sayfasında çalışabilir; WebGL tuval içini görmez | Orta | 2 | D |
| [naptha/tesseract.js](https://github.com/naptha/tesseract.js) (~39k, Apache-2.0), [JaidedAI/EasyOCR](https://github.com/JaidedAI/EasyOCR) (~30k, Apache-2.0) | — | 2026 | Apache | Karedeki yazıyı OCR → "gerçekten okunuyor mu / taşma var mı" | Türkçe diyakritik doğruluğu X | Orta | 2 | D (shields) |
| [Breakthrough/PySceneDetect](https://github.com/Breakthrough/PySceneDetect) | ~5.2k | 2026-10 | BSD-3 | Sahne kesim tespiti | Kesim ritmi/hook yoğunluğu; ffmpeg `scdet` ile aynı iş | Kolay | 2 | D |
| [m-bain/whisperX](https://github.com/m-bain/whisperX) (~25k, BSD-2), [MahmoudAshraf97/ctc-forced-aligner](https://github.com/MahmoudAshraf97/ctc-forced-aligner) (~569, BSD-2), [MontrealCorpusTools/Montreal-Forced-Aligner](https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner) (~1.9k, MIT), [stable-ts](https://github.com/jianfch/stable-ts) (~2.3k, MIT) | — | 2026 | — | Ses↔metin hizalama: altyazı kareleri gerçek ses konumuyla uyuşuyor mu | Altyazı-ses senkron denetimi (C alanı TTS sürelerini zaten biliyor; bu **bağımsız çapraz kontrol**) | Orta | 2 | D (shields) |
| [readbeyond/aeneas](https://github.com/readbeyond/aeneas) | ~2.9k | 2020 | **AGPL-3.0** | Zorunlu hizalama | Eski → eledim | — | 0 | D |

**Güvenli alan (safe zone) lint'i:** Meta piksel yayınlamıyor; üçüncü taraf kılavuzlar çelişiyor (Hopper HQ: üst %14 ≈270 px, alt %35 ≈670 px, sağ alt %40; First Pier: 108 üst/320 alt/60 sol/120 sağ; diğerleri 250/250 ya da 250/420). Projenin kuralı (son 250–320 px) **iyimser uçta**. → X (resmî değer yok); öneri: Remotion'da `<SafeZoneOverlay/>` ile en katı değerleri (alt 670, sağ-alt 40 %) **taslakta** göster ve `still` çıktısında metin kutularının (DOM `getBoundingClientRect`) sınırlar içinde kaldığını test et.

---

## 6. ALAN 5 — Geliştirici araçları

| Repo | ★ | son | Lisans | Ne yapar | Uyum | Zorluk | Değer | Doğr. |
|---|---|---|---|---|---|---|---|---|
| [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) (npm 4.5.1, 2026-09-28) | ~2k | 2026-10 | MIT | CLI+API. `optimize` tek komut; `meshopt`/`draco`; `webp`/KTX2 doku; `resize`. Fonksiyon listesi (kaynak `index.ts`): `dedup, flatten, join, instance, palette, prune, quantize, simplify, weld, unlit, inspect, resample, sparse, partition…` | **GLB kütüphanesini (1.603 model) küçült**, malzemeleri `palette` ile tek dokuya indir, statik sahneyi `join`/`instance` ile çizim çağrısına indir → yazılım WebGL'de kare süresi/yükleme. `inspect` = üçgen/doku raporu | Kolay (Node) | **4** | D (README + kaynak) |
| [KhronosGroup/glTF-Validator](https://github.com/KhronosGroup/glTF-Validator) (npm `gltf-validator` 2.0.0-dev.3.10, 2024-10) | ~476 | 2026-10 | Apache-2.0 | GLB şema/geometri doğrulama | `npm run models` ledger kontrolüne ek: bozuk GLB'yi renderdan önce yakala | Kolay | 3 | D |
| [mrdoob/three.js](https://github.com/mrdoob/three.js) `editor/` (threejs.org/editor) | ~116k | bugün | MIT | Tarayıcıda sahne editörü, GLB içe/dışa aktarım, JSON sahne | Prop yerleştirmeyi elle denemek; üretim hattı değil | Kolay | 2 | K |
| [donmccurdy/three-gltf-viewer](https://github.com/donmccurdy/three-gltf-viewer), [KhronosGroup/glTF-Sample-Viewer](https://github.com/KhronosGroup/glTF-Sample-Viewer) | ~2.5k / ~1.5k | 2026-10 / bugün | MIT / Apache-2.0 | GLB önizleme (klip dahil) | Yeni Kenney/Quaternius paketlerini göz atma | Çok kolay | 2 | D |
| [pmndrs/gltfjsx](https://github.com/pmndrs/gltfjsx) (npm 6.5.3, **2024-11-04**; klon: son commit 2024-11-04) | ~5.9k | 2024-11 | MIT | GLB → JSX bileşeni (+ `--transform` ile glTF-Transform) | Karakter/prop'ları tipli bileşene çevir; sayfada arşiv/taşındı notu yok | Kolay | 2 | D |
| [utsuboco/r3f-perf](https://github.com/utsuboco/r3f-perf) (npm 7.2.3, 2024-11-08), [RenaudRohlinger/stats-gl](https://github.com/RenaudRohlinger/stats-gl) (npm MIT, 2026-07) | ~780 / ~283 | — | MIT | Gerçek zamanlı FPS/çizim çağrısı | Remotion **render** süresini ölçmez; `renderer.info` log'u yeter | — | 1 | D |
| [BabylonJS/Spector.js](https://github.com/BabylonJS/Spector.js) | ~1.6k | 2026-10 | MIT | WebGL kare yakalama | Çizim çağrılarını say (SwiftShader yavaşlığı) | Orta | 2 | D |
| [zeux/meshoptimizer](https://github.com/zeux/meshoptimizer), [BinomialLLC/basis_universal](https://github.com/BinomialLLC/basis_universal), [KhronosGroup/KTX-Software](https://github.com/KhronosGroup/KTX-Software) | ~8.6k / ~3.1k / ~1.4k | 2026 | MIT / Apache-2.0 / karma (LICENSE.md) | Geometri/doku sıkıştırma | glTF-Transform içinden zaten | — | 1 | D |
| [agargaro/instanced-mesh](https://github.com/agargaro/instanced-mesh), [gkjohnson/three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) (npm 0.9.16) | ~453 / ~3.5k | 2026-10 | MIT | Gelişmiş InstancedMesh; BVH (ışın/çarpışma) | Kalabalık/ağaç çoğaltma (A alanıyla kesişir) | Orta | 2 | D |
| [pmndrs/drei](https://github.com/pmndrs/drei) (npm 10.7.9, R3F ^9 uyumlu), [pmndrs/maath](https://github.com/pmndrs/maath) | ~10k / ~1.3k | 2026 | MIT | Yardımcılar; maath = tohumlu rastgele/gürültü | Mevcut yığınla uyumlu | Kolay | 2 | D (peerDeps okundu) |
| [theatre-js/theatre](https://github.com/theatre-js/theatre) — `@theatre/core` 0.7.2 (Apache-2.0, **2024-05-19**), `@theatre/studio` (**AGPL-3.0**), `@theatre/r3f` 0.7.2 (**peer: R3F ^8**) | ~13k | **2024-04-11** ("temporarily moved development to a private repo"; arşivli değil) | Core Apache / Studio AGPL | Görsel zaman çizelgesi; `sheet.sequence.position = frame/fps` ile kareye bağlanabilir; JSON durum çıktısı | **Kamera yolu & karakter jestlerini görsel kurup JSON'a dök, Remotion'da yalnız core ile oynat** (Studio yalnız geliştirmede; AGPL üretim paketine girmez). `@theatre/r3f` R3F 9 ile **uyumsuz** | Orta | 3 | D (npm+klon) |
| [pmndrs/leva](https://github.com/pmndrs/leva) | ~6.3k | 2025-11 | MIT | Parametre paneli | Önizlemede ayar | Kolay | 1 | D |
| [mapeditor/tiled](https://github.com/mapeditor/tiled) (~13k, 2026-09; `COPYING`: dosya bazında karışık lisans → editör lisansı **X**) , [deepnight/ldtk](https://github.com/deepnight/ldtk) (~4.3k, 2026-10, **MIT**) | — | — | — | Izgara/seviye editörü, JSON çıktı (LDtk: IntGrid katmanı, entity'ler) | **Mahalle haritasını (parsel, yol, bina yeri, prop noktaları) LDtk'de çiz → `layout.json` → kitimizdeki yerleştirme.** LDtk'nin 3D desteği yok; 2D ızgara+yükseklik katmanıyla yeterli | Orta | 3 | D (shields+docs araması) |
| [mxgmn/WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) (~25k, **MIT**), [BorisTheBrave/DeBroglie](https://github.com/BorisTheBrave/DeBroglie) (~527, MIT, 2025-12; C#), [kchapelier/wavefunctioncollapse](https://github.com/kchapelier/wavefunctioncollapse) (~526, MIT, npm 2.1.0, **2021**), [marian42/wavefunctioncollapse](https://github.com/marian42/wavefunctioncollapse) (~4.9k, MIT, 2021, Unity) | — | — | MIT | Kuralla tohumlu yerleştirme (Townscaper/ "sonsuz şehir") | Mekânların **etrafındaki** dolgu (arka sokaklar, çatı detayı) → tohumlu, deterministik | Orta | 3 | D (lisans MIT mxgmn LICENSE okundu) |
| [KhronosGroup/glTF-Blender-IO](https://github.com/KhronosGroup/glTF-Blender-IO) | ~1.7k | bugün | Apache-2.0 | Blender↔glTF resmî dışa aktarıcı | Özgün prop modelleme boru hattı | Kolay | 2 | D |
| Blender low-poly eklentileri: [JulienVanelian/lowpolyzer](https://github.com/JulienVanelian/lowpolyzer) (~16★, 2021, GPL-3.0), [0x0bug/blender-lowpoly-assets](https://github.com/0x0bug/blender-lowpoly-assets) (~0★, MIT, Codex skill) | — | — | — | Remesh/Decimate; bpy iş akışı | Önemsiz | — | 1 | K |
| [google/swiftshader](https://github.com/google/swiftshader) | ~2.6k | 2026-10 | Apache-2.0 | Yazılım Vulkan (Chrome `swangle` arka ucu) | Bilgi: render yavaşlığının kaynağı | — | 1 | D |

---

## 7. ALAN 6 — Yayın ve büyüme (yalnız araştırma; yayın otomasyonu yok)

| Repo | ★ | son | Lisans | Ne yapar | Uyum | Değer | Doğr. |
|---|---|---|---|---|---|---|---|
| [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) | ~37k | bugün | **AGPL-3.0** ("özellik kilitlemiyoruz") | Zamanlama + analitik; Instagram/TikTok/YouTube; API, MCP; self-host'ta **her platform için kendi geliştirici uygulamanı** açıp onay almalısın (haftalar sürebilir) | Yayın aşamasında aday; şimdi gerekmez | 3 | D (README) |
| [inovector/mixpost](https://github.com/inovector/mixpost) | ~3.8k | 2026-03 | MIT (Lite; Pro/Enterprise ücretli) | Self-host zamanlayıcı | Lite sınırlı | 2 | D |
| [n8n-io/n8n](https://github.com/n8n-io/n8n) | ~207k | bugün | **Sustainable Use License** (OSI değil; `.ee.` dosyaları ayrı lisans) | İş akışı otomasyonu | Gündem→bildirim gibi hafif otomasyon; ticari yeniden satış kısıtı | 2 | D (LICENSE.md başlığı) |
| [activepieces/activepieces](https://github.com/activepieces/activepieces) | ~25k | bugün | MIT + `ee` dizini ayrı | n8n alternatifi | 1 | D |
| [growthbook/growthbook](https://github.com/growthbook/growthbook) (~8.5k, MIT + ee), [PostHog/posthog](https://github.com/PostHog/posthog) (~40k, MIT + ee), [umami-software/umami](https://github.com/umami-software/umami) (~39k, MIT), [plausible/analytics](https://github.com/plausible/analytics) (~29k, AGPL-3.0) | — | 2026 | — | A/B test, ürün/web analitiği | **Instagram Reels için A/B test aracı değil**; yalnız bio-linkli sayfa olursa | 1 | D |
| Instagram "Trial Reels" / A-B yayın testi, Insights metrik adları | — | — | — | Dokümanda JS-render, doğrulanamadı | — | ? | **X** |

Hashtag/açıklama araçları: açık kaynak ciddi bir seçenek bulunamadı; resmî Hashtag Search kotası 30/7 gün (bölüm 3.1).

---

## 8. ALAN 7 — Kenar alanlar

### 8.1 Kullanıcı adı / marka kontrol
| Repo | ★ | son | Lisans | Not | Değer | Doğr. |
|---|---|---|---|---|---|---|
| [sherlock-project/sherlock](https://github.com/sherlock-project/sherlock) | ~94k | 2026-09 | MIT | 482 site; **Instagram için `urlProbe: imginn.com` (üçüncü taraf ayna)**, TikTok için `statusCode:10221` mesajı — yani bizim yöntemle aynı + ayna; Instagram sonucu güvenilmez | 2 | D (data.json okundu) |
| [soxoj/maigret](https://github.com/soxoj/maigret) | ~39k | 2026-10 | MIT | Dosya/çapraz profil analizi | 2 | D (shields) |
| [WebBreacher/WhatsMyName](https://github.com/WebBreacher/WhatsMyName) | ~2.9k | bugün | CC BY-SA 4.0 | Site kural veritabanı | 1 | D |
| [snooppr/snoop](https://github.com/snooppr/snoop) | ~4k | 2026-10 | "Snoop Project License" (özel, COPYRIGHT dosyası) | Rus odaklı | 1 | K |
| Marka tescili | — | — | — | TÜRKPATENT sorgusu açık kaynak değil → elle (sınıf 9, 38, 41) | — | X |

Bu araçlar mevcut `ISIM_ONERILERI.md` yöntemini (YouTube 404 + TikTok durum) çok az ilerletir; **Instagram boşluğunu kapatmaz**.

### 8.2 Lisans / SBOM / telif
| Repo | ★ | son | Lisans | Ne yapar | Uyum | Değer | Doğr. |
|---|---|---|---|---|---|---|---|
| [fsfe/reuse-tool](https://github.com/fsfe/reuse-tool) (PyPI `reuse` 6.2.0) | ~593 | geçen pazartesi | Apache-2.0 AND CC0-1.0 AND CC-BY-SA-4.0 AND GPL-3.0-or-later (pyproject) | Dosya başı SPDX/`REUSE.toml` ile telif-lisans beyanı; `reuse lint` | **Model/ses defteri (ledger.json) yerine/yanında standart; ikili dosyalar için `.license`** | 3 | D |
| [nexB/scancode-toolkit](https://github.com/nexB/scancode-toolkit) | ~2.6k | 2026-10 | Apache-2.0 (+ referans veri CC-BY-4.0) | Koddan lisans/telif tespiti | Kitap bağımlılıkları tarama | 2 | D (README) |
| [licensee/licensee](https://github.com/licensee/licensee) | ~914 | 2026-10 | MIT | Tek depoda lisans tespiti (Ruby) | 1 | D |
| [rseidelsohn/license-checker-rseidelsohn](https://github.com/rseidelsohn/license-checker-rseidelsohn) (~201, BSD-3), [CycloneDX/cyclonedx-node-npm](https://github.com/CycloneDX/cyclonedx-node-npm) (~151, Apache-2.0), [anchore/syft](https://github.com/anchore/syft) (~9.7k), [google/osv-scanner](https://github.com/google/osv-scanner) (~11k), [oss-review-toolkit/ort](https://github.com/oss-review-toolkit/ort) (~2.1k) | — | 2026 | — | npm bağımlılık lisans özeti / SBOM / zafiyet | Reklam öncesi `npx license-checker-rseidelsohn --summary` yeterli | 2 | D |
| [acoustid/chromaprint](https://github.com/acoustid/chromaprint) | ~1.4k | bugün | MIT (LICENSE.md; FFT için ffmpeg notu) | Ses parmak izi | Incompetech/BBC müziğinin **Content ID benzeri eşleşme** riskini kabaca ölçmek; AcoustID veritabanı kapsamı X | 2 | D |
| **Remotion lisansı** (LICENSE.md, 2026) | — | — | Ücretsiz: bireyler, ≤3 çalışanlı kâr amaçlı şirketler, kâr amacı gütmeyenler; diğerleri Company License | **Remotion 5.0'da** (PR #3750, taslak) **müteahhitler ekip sayısına dahil olacak**, şirket lisansı kullanım koşullarına bağlanacak | Kişisel/tek kişi: serbest; ekip büyürse kontrol | — | D |

### 8.3 Çok dilli çıktı
| Repo | ★ | son | Lisans | Not |
|---|---|---|---|---|
| [argosopentech/argos-translate](https://github.com/argosopentech/argos-translate) | ~6.6k | 2026-08 | MIT | Çevrimdışı çeviri; senaryo TR→EN/AR taslağı (insan düzeltmesi şart) |
| [LibreTranslate/LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) | ~17k | 2026-10 | AGPL-3.0 | Aynı motor + API |
| [formatjs/formatjs](https://github.com/formatjs/formatjs), [i18next/i18next](https://github.com/i18next/i18next) (~8.6k, MIT) | — | — | — | Altyazı/etiket metin anahtarları; bizde JSON zaten veri-güdümlü → hafif bir `strings.<dil>.json` yeterli |
Arapça yazı tipleri: bölüm 2.1. RTL altyazıda `direction: rtl` + Arapça font (Chromium şekillendirmeyi yapar) — **denenmedi (X)**.
Altyazı erişilebilirlik stili: Remotion `@remotion/captions` C alanında.

---

## 9. ALAN 8 — Doğrudan benzer projeler (kodu okunanlar işaretli)

| Proje | ★ / son / lisans | Ne yapmış | Bizden farkı | Kopyalanacak / uyarlanacak teknik | Okundu mu |
|---|---|---|---|---|---|
| [uxfreak/walking-characters-remotion](https://github.com/uxfreak/walking-characters-remotion) | ~2★ · 2025-05-28 · GitHub'da lisans yok (package.json ISC) → **kod kopyalama, fikir al** | Remotion + ham three (R3F değil): ormanda yürüyen karakterler, **JSON ile video** (karakter, diyalog, ortam), OpenAI TTS, **14 adlandırılmış kamera planı**, `calculateMetadata` ile süre = ses süreleri toplamı (`parseMedia`), `--gl=angle` | Perspektif kamera, `Math.random` kullanıyor (determinizm ihlali), 365 dosya/51 MB | (1) Kamera planlarını **veri sözlüğü** yap (`wide, closeUp, overShoulder1/2, lowAngle, highAngle, walkingAlongside…` pozisyon+hedef+fov) — bizde ortografik karşılık: "kutuya sığan kamera planları" zaten var, ad+JSON yaklaşımı eklenebilir; (2) süreyi sesten türetme | Evet (README, CLAUDE.md, cameraShots.ts, metadataCalculator.ts) |
| [cpp285/gold-noir-video-creator](https://github.com/cpp285/gold-noir-video-creator) | ~3★ · 2026-10-04 · **MIT** | Claude skill + Remotion + three 0.186.1 + R3F 9.8.1; 60 sn / 30 fps; `npm run check` = typecheck + `node --test` (zaman çizelgesi 60 sn mi, toplam kare, WAV deterministik mi); **`master` = `loudnorm=I=-16:TP=-1.5:LRA=11` + `ebur128` doğrulaması**; `stills.mjs` ile kare seti; `bgm.mjs` zaman çizelgesinden **kodla sentezlenen müzik** | 1920×1080, Çince, bilgi videosu | **Test dosyası kalıbı** (`render-config.test.mjs`): sabit süre/sınır/determinizm testleri `check`'e; master betiği; `uvx edge-tts` ile ses (C alanı) | Evet (master.mjs, tests) |
| [remotion-dev/template-three](https://github.com/remotion-dev/template-three) | ~113★ · 2026-10 · MIT | Resmî R3F şablonu | Minimal | Resmî `ThreeCanvas` kalıbı; `<Sequence layout="none">` zorunluluğu (docs) | Docs |
| [remotion-dev/remotion-three-gltf-example](https://github.com/remotion-dev/remotion-three-gltf-example), [glb-example](https://github.com/remotion-dev/glb-example) | ~7★/~3★ · 2024-02 · MIT | GLB yükleme | Eski | Bilgi | Shields |
| [amilich/isometric-city](https://github.com/amilich/isometric-city) | ~2.3k★ · dün · MIT | Next.js + Canvas2D izometrik şehir/lunapark; trafik, yaya, bölgeleme | 2D canvas, gerçek zamanlı | Yaya/trafik **davranış kuralları** → arka plan yaşam döngüsü (A alanı) | Hayır (README özeti) |
| [KenneyNL/Starter-Kit-City-Builder](https://github.com/KenneyNL/Starter-Kit-City-Builder) | ~1.5k★ · 2026-03 · MIT | Godot ızgara yerleştirme | Godot | Yerleşim UX fikri | Hayır |
| [ken-guru/git-city issue #4](https://github.com/ken-guru/git-city/issues/4) | issue (kapalı, tamamlandı); depo ~0★, lisans yok | **Durumsuz** zaman animasyonu: her örnekte `tBorn/tDied` özniteliği + tek `uTime` uniform; mimari karar (three r186, `InstancedMesh` her arketip için, `flatShading` Lambert, CatmullRom kamera yolu) | Tasarım önerisi, kod yok | **Rastgele kare erişimiyle birebir uyumlu** desen: bina inşa/yıkım/silinme (14. sokak silinmesi gibi) yalnızca `uTime = frame/fps` ile → kare-bağımsız | Evet (issue metni) |
| [jstrait/city-tour](https://github.com/jstrait/city-tour) | ~88★ · geçen pazartesi · MIT | WebGL/three prosedürel şehir (arazi, yol, parsel, bina) + tur kamerası | Gerçek zamanlı | Parsel→bina üretim sırası | Hayır |
| [jasonsturges/three-low-poly](https://github.com/jasonsturges/three-low-poly) | ~59★ · geçen salı · ISC | Kodla low-poly sahne kütüphanesi, geçen süreye bağlı atmosfer | — | Atmosfer katmanları (B alanı) | Hayır |
| [brunosimon/folio-2025](https://github.com/brunosimon/folio-2025) | ~1.9k★ · 2026-04 · kod MIT (**varlık lisansı X**) | Stilize three.js dünyası | Etkileşimli | Görsel referans (B alanı) | Hayır |
| [dgreenheck/ez-tree](https://github.com/dgreenheck/ez-tree) | ~1.7k★ · 2026-07 · MIT | **Tohumlu** prosedürel ağaç üretici | — | Kenney ağaçlarına ek, determinist çeşitlilik (mevsim renkleri) | README satırı okundu (`options.seed` doğrulandı) |
| [a16z-infra/ai-town](https://github.com/a16z-infra/ai-town), [google-deepmind/concordia](https://github.com/google-deepmind/concordia), [joonspk-research/generative_agents](https://github.com/joonspk-research/generative_agents) | bkz. bölüm 4 | Ajan tabanlı kasaba simülasyonu | Videoya dönmüyor | **Simülasyon → olay JSON'u** (çevrimdışı, tohumlu) | Evet (README'ler) |

Not: "isometric diorama animation", "three.js short film", "browser-based animation studio" aramalarında **video üreten, hikâyeli, seri yapılı** hazır bir açık proje **bulunamadı**. GitHub `topics/remotion` (yıldıza göre ilk 20) içinde **three.js** geçen yok; çıkanlar ajan/Claude skill tabanlı genel video araçları (OpenMontage ~69k★ AGPL-3.0, video-shotcraft, claude-code-video-toolkit ~2.2k★ MIT, Remocn ~1.6k★ MIT, fframes ~2.8k★ MIT). Yani 3D izometrik dizi + oy mekanizması + veri güdümlü evren kombinasyonu açık kaynakta yok.

---

## 10. ALAN 9 — "awesome-*" meta listeleri

| Liste | ★ | son | Lisans | İçerik | Bizim için çıkanlar |
|---|---|---|---|---|---|
| [AxiomeCG/awesome-threejs](https://github.com/AxiomeCG/awesome-threejs) | ~1k | 2026-07 | CC0 | Kitap/kurs/araç | three-bvh-csg, cannon-es, Rapier (A alanı); yeni bir şey yok |
| [gsimone/awesome-react-three-fiber](https://github.com/gsimone/awesome-react-three-fiber) | ~203 | **2021-02** | belirtilmemiş | Eski | Eledim |
| [terkelg/awesome-creative-coding](https://github.com/terkelg/awesome-creative-coding) | ~15k | 2026-07 | — | Genel | JSCAD, Shader Park; marjinal |
| [Calinou/awesome-gamedev](https://github.com/Calinou/awesome-gamedev) | ~3.2k | 2026-08 | CC-BY-SA-4.0 | Varlık/ses/font kaynakları | rFXGen, jsfxr, CC0 Music; zaten var |
| [ellisonleao/magictools](https://github.com/ellisonleao/magictools) | ~17k | dün | MIT | Oyun yapım araçları | **Material Maker** (Godot tabanlı prosedürel doku), SFXMint (CC0 SFX), Poly Pizza, GameAsset.net (erişilemedi); AI/MCP bölümü |
| [transitive-bullshit/awesome-ffmpeg](https://github.com/transitive-bullshit/awesome-ffmpeg) | ~1.2k | 2026-09 | — | JS ffmpeg araçları | `ffmpeg-static`, `editly`, `gl-transitions` |
| [krzemienski/awesome-video](https://github.com/krzemienski/awesome-video) | ~1.9k | 2026-07 | CC0 | Çok geniş video | VMAF/PSNR/SSIM bölümü: **QCTools (BAVC)**, `psy-ex/metrics`, `ab-av1` (VMAF ile CRF seçimi); bizde yalnız referanslı karşılaştırma işe yarar |
| [LottieFiles/awesome-lottie](https://github.com/LottieFiles/awesome-lottie) | ~331 | 2026-04 | belirtilmemiş | Lottie araçları | Remotion `@remotion/lottie` C alanı |
| [filipecalegario/awesome-generative-ai](https://github.com/filipecalegario/awesome-generative-ai) | ~3.6k | 2025-12 | CC0 | Geniş | Yok |
| [sindresorhus/awesome](https://github.com/sindresorhus/awesome) ~519k, [awesome-nodejs](https://github.com/sindresorhus/awesome-nodejs) ~67k | — | 2026-09 | CC0 | Kök dizinler | Prosedürel üretim/shader için ayrı liste **bulunamadı** |
| awesome-procedural-generation, awesome-shaders (vorg), awesome-webgl (luruke/0x-sheep), awesome-lottie (awesome-lottie org) | — | — | — | Aranan adlarla depo **bulunamadı** | **X** |
| Remotion kaynak listesi: [remotion.dev/docs/resources](https://www.remotion.dev/docs/resources) (resmî), [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) (81 şablon) | — | — | — | C alanı | — |


---

## 11. HAZIR VARLIK ENVANTERİ (indirilebilir paketler)

### 11.1 Kenney 3D — bizde OLMAYAN 34 paket (hepsi CC0, ticari ✓, atıf yok; GLB + OBJ + FBX + doku; zip'ler hesapsız indirilir)

Bizde zaten var (16): furniture-kit, city-kit-commercial/suburban/industrial/roads, building-kit, modular-buildings, retro-urban-kit, food-kit, nature-kit, survival-kit, car-kit, graveyard-kit, prototype-kit, blocky-characters, mini-characters. "Dosya" = Kenney sayfasındaki "Files" sayısı; "Zip tarihi" = URL'deki güncelleme damgası. Önemli gözlem: GLB'leri doğrulananlar (mini-market, cube-pets, mini-arcade, mini-dungeon, mini-arena, mini-skate, mini-forest, holiday-kit) GLB formatı içerir; **animated-characters-* yalnız FBX**.

| Paket (sayfa) | Dosya | Anim. | MB | Yıl | Zip tarihi | Not | İndirme (zip) |
|---|---|---|---|---|---|---|---|
| [mini-skate](https://kenney.nl/assets/mini-skate) | 40 | evet | 2.1 | 2023 | 2026-10-12 | **character-skate-boy/girl** (36 klip, aynı iskelet), kaykay parkı, scooter | https://kenney.nl/media/pages/assets/mini-skate/00b0c2b304-1791798670/kenney_mini-skate.zip |
| [mini-dungeon](https://kenney.nl/assets/mini-dungeon) | 30 | evet | 1.8 | 2023 | 2026-07-29 | **character-human, character-orc** (32 klip, aynı iskelet) + sahne parçaları | https://kenney.nl/media/pages/assets/mini-dungeon/6cd72dc849-1785314274/kenney_mini-dungeon.zip |
| [mini-forest](https://kenney.nl/assets/mini-forest) | 20 | evet | 1.1 | 2026 | 2026-07-14 | character-archer (32 klip), ağaç, çadır, taş; park/kamp | https://kenney.nl/media/pages/assets/mini-forest/44a89aed7f-1784024079/kenney_mini-forest_1.0.zip |
| [modular-cave-kit](https://kenney.nl/assets/modular-cave-kit) | 40 | - | 7.0 | 2026 | 2026-07-10 |  | https://kenney.nl/media/pages/assets/modular-cave-kit/37ec3cb12d-1783667097/kenney_modular-cave-kit_1.0.zip |
| [factory-kit](https://kenney.nl/assets/factory-kit) | 140 | evet | 4.5 | 2023 | 2026-05-01 |  | https://kenney.nl/media/pages/assets/factory-kit/edaac9d4f6-1777639602/kenney_factory-kit_3.0.zip |
| [platformer-kit](https://kenney.nl/assets/platformer-kit) | 150 | evet | 4.6 | 2022 | 2026-04-02 | 150 parça, animasyonlu (kapı/tuzak) | https://kenney.nl/media/pages/assets/platformer-kit/1585cf62b4-1775122253/kenney_platformer-kit.zip |
| [cube-pets](https://kenney.nl/assets/cube-pets) | 24 | evet | 2.8 | 2026 | 2026-03-26 | **24 hayvan** (cat, dog, fox, bunny, pig, cow, parrot…), 8 klip (idle, walk, run, eat, dance, gesture-positive/negative); iskelet yok, düğüm animasyonu | https://kenney.nl/media/pages/assets/cube-pets/44e58e945f-1774520254/kenney_cube-pets_1.0.zip |
| [modular-dungeon-kit](https://kenney.nl/assets/modular-dungeon-kit) | 40 | evet | 6.9 | 2025 | 2026-02-24 |  | https://kenney.nl/media/pages/assets/modular-dungeon-kit/7bed87605b-1771926065/kenney_modular-dungeon-kit_1.0.zip |
| [pirate-kit](https://kenney.nl/assets/pirate-kit) | 70 | evet | 3.2 | 2018 | 2026-02-17 |  | https://kenney.nl/media/pages/assets/pirate-kit/e6d4bb1525-1771333093/kenney_pirate-kit.zip |
| [modular-space-kit](https://kenney.nl/assets/modular-space-kit) | 40 | evet | 7.0 | 2026 | 2026-02-15 |  | https://kenney.nl/media/pages/assets/modular-space-kit/8261428a47-1771146076/kenney_modular-space-kit_1.0.zip |
| [fantasy-town-kit](https://kenney.nl/assets/fantasy-town-kit) | 160 | - | 3.9 | 2022 | 2025-08-03 | ortaçağ kasaba (stile uymaz) | https://kenney.nl/media/pages/assets/fantasy-town-kit/efe948d309-1754222374/kenney_fantasy-town-kit_2.0.zip |
| [blaster-kit](https://kenney.nl/assets/blaster-kit) | 40 | evet | 1.7 | 2022 | 2025-07-31 |  | https://kenney.nl/media/pages/assets/blaster-kit/261d80a716-1753959510/kenney_blaster-kit_2.1.zip |
| [minigolf-kit](https://kenney.nl/assets/minigolf-kit) | 125 | - | 3.2 | 2022 | 2025-03-05 |  | https://kenney.nl/media/pages/assets/minigolf-kit/3ae60d8b01-1741163874/kenney_minigolf-kit.zip |
| [retro-fantasy-kit](https://kenney.nl/assets/retro-fantasy-kit) | 100 | - | 2.0 | 2021 | 2026-03-29 |  | https://kenney.nl/media/pages/assets/retro-fantasy-kit/cf3f41b752-1774770658/kenney_retro-fantasy-kit.zip |
| [toy-car-kit](https://kenney.nl/assets/toy-car-kit) | 100 | - | 5.2 | 2024 | 2025-01-08 | oyuncak araba pisti | https://kenney.nl/media/pages/assets/toy-car-kit/42e19cc426-1736346027/kenney_toy-car-kit.zip |
| [holiday-kit](https://kenney.nl/assets/holiday-kit) | 100 | evet | 4.5 | 2020 | 2024-12-11 | Noel/Hanuka/Kwanzaa/Festivus: kardan adam, hediye, ışık, kızak, kulübe, tren seti (kapı animasyonu); Bayram teması YOK | https://kenney.nl/media/pages/assets/holiday-kit/3976a6496a-1733923970/kenney_holiday-kit.zip |
| [coaster-kit](https://kenney.nl/assets/coaster-kit) | 180 | - | 6.7 | 2024 | 2024-11-13 | lunapark hız treni parçaları | https://kenney.nl/media/pages/assets/coaster-kit/546fdc554f-1731487890/kenney_coaster-kit.zip |
| [mini-market](https://kenney.nl/assets/mini-market) | 20 | evet | 1.1 | 2024 | 2024-10-25 | bakkal iç mekân: raf, kasa, dondurucu, sepet, **character-employee (32 klip)**; GLB doğrulandı | https://kenney.nl/media/pages/assets/mini-market/463f38da51-1729865423/kenney_mini-market.zip |
| [train-kit](https://kenney.nl/assets/train-kit) | 100 | - | 5.3 | 2024 | 2024-09-22 | raylar, lokomotif, vagon (istasyon/hat) | https://kenney.nl/media/pages/assets/train-kit/cf8521d625-1727040883/kenney_train-kit.zip |
| [tower-defense-kit](https://kenney.nl/assets/tower-defense-kit) | 160 | - | 5.4 | 2019 | 2024-09-16 |  | https://kenney.nl/media/pages/assets/tower-defense-kit/a402493eaa-1726471567/kenney_tower-defense-kit.zip |
| [mini-arcade](https://kenney.nl/assets/mini-arcade) | 20 | evet | 1.3 | 2024 | 2024-07-22 | oyun salonu: arcade/pinball/claw/dans makinesi; **character-employee, character-gamer (aynı iskelet)** | https://kenney.nl/media/pages/assets/mini-arcade/ece1e8f320-1721638600/kenney_mini-arcade.zip |
| [brick-kit](https://kenney.nl/assets/brick-kit) | 290 | - | 4.7 | 2024 | 2024-05-29 |  | https://kenney.nl/media/pages/assets/brick-kit/46a22f3d08-1716981002/kenney_brick-kit.zip |
| [marble-kit](https://kenney.nl/assets/marble-kit) | 160 | - | 5.3 | 2022 | 2024-05-22 |  | https://kenney.nl/media/pages/assets/marble-kit/56fd69e5ed-1716385090/kenney_marble-kit.zip |
| [watercraft-kit](https://kenney.nl/assets/watercraft-kit) | 45 | - | 1.9 | 2016 | 2024-04-19 | tekne, iskele (2016) | https://kenney.nl/media/pages/assets/watercraft-kit/a335cfed49-1713519620/kenney_watercraft-pack.zip |
| [space-station-kit](https://kenney.nl/assets/space-station-kit) | 90 | - | 1.8 | 2024 | 2024-04-10 |  | https://kenney.nl/media/pages/assets/space-station-kit/6475288f2e-1712749919/kenney_space-station-kit.zip |
| [castle-kit](https://kenney.nl/assets/castle-kit) | 75 | - | 2.2 | 2017 | 2024-03-27 |  | https://kenney.nl/media/pages/assets/castle-kit/a395102d20-1711543616/kenney_castle-kit.zip |
| [mini-arena](https://kenney.nl/assets/mini-arena) | 20 | evet | 0.7 | 2024 | 2024-02-29 | character-soldier (25 klip, aynı iskelet) | https://kenney.nl/media/pages/assets/mini-arena/88f977a0cb-1709220730/kenney_mini-arena.zip |
| [hexagon-kit](https://kenney.nl/assets/hexagon-kit) | 70 | evet | 2.4 | 2020 | 2024-01-23 | altıgen karo, animasyonlu | https://kenney.nl/media/pages/assets/hexagon-kit/fd3b63101b-1706007730/kenney_hexagon-kit.zip |
| [animated-characters-retro](https://kenney.nl/assets/animated-characters-retro) | 8 | - | 0.7 | 2022 | 2026-03-29 | **yalnız FBX** (GLB yok), 8 dosya | https://kenney.nl/media/pages/assets/animated-characters-retro/93305a3c49-1774772819/kenney_animated-characters-retro.zip |
| [space-kit](https://kenney.nl/assets/space-kit) | 150 | - | 6.7 | 2020 | 2023-03-01 |  | https://kenney.nl/media/pages/assets/space-kit/20874c75ac-1677698978/kenney_space-kit.zip |
| [animated-characters-protagonists](https://kenney.nl/assets/animated-characters-protagonists) | 8 | - | 0.6 | 2020 | 2026-03-29 | **yalnız FBX** (zip içinde characterMedium.fbx + idle/run/jump animasyonları) | https://kenney.nl/media/pages/assets/animated-characters-protagonists/608191acc4-1774773108/kenney_animated-characters-protagonists.zip |
| [animated-characters-survivors](https://kenney.nl/assets/animated-characters-survivors) | 8 | - | 0.7 | 2019 | 2026-03-29 | **yalnız FBX** | https://kenney.nl/media/pages/assets/animated-characters-survivors/27b16052a7-1774772958/kenney_animated-characters-survivors.zip |
| [racing-kit](https://kenney.nl/assets/racing-kit) | 110 | - | 6.1 | 2018 | 2023-02-28 | yol, bariyer, lastik, araç parçaları | https://kenney.nl/media/pages/assets/racing-kit/933b8fd9fd-1677580949/kenney_racing-kit.zip |
| [3d-road-tiles](https://kenney.nl/assets/3d-road-tiles) | 300 | - | 3.7 | 2015 | 2023-02-28 | 300 yol karosu (2015) | https://kenney.nl/media/pages/assets/3d-road-tiles/3fbfaa7ec8-1677581262/kenney_3d-road-tiles.zip |

### 11.2 Kenney — Mini karakter ailesi (kendi ölçümüm; GLB okundu)
- Aynı iskelet (7 eklem: `root, leg-left, leg-right, torso, arm-left, arm-right, head`) ve aynı 32 klip: bizdeki 12 `character-male/female-a…f` + mini-market `employee` + mini-arcade `employee`, `gamer` + mini-forest `archer` + mini-dungeon `human`, `orc`. `mini-arena/character-soldier` = 25 klip, `mini-skate/character-skate-boy|girl` = 36 klip (aynı 7 eklem). Üçgen sayısı 374–876.
- 32 klip: static, idle, walk, sprint, jump, fall, crouch, sit, drive, die, pick-up, emote-yes, emote-no, holding-right/left/both (+ `-shoot`), attack-melee-right/left, attack-kick-right/left, interact-right/left, **wheelchair-sit/look-left/look-right/move-forward/back/left/right**.
- Kapı animasyonları (`open`, `close`, `open-and-close`) mini-market `wall-door-rotate`, `fence-door-rotate` vb. içinde.
- Karakterler **yüzlü** (basit) — "yüzsüz" kuralı için doku/yüz maskeleme kararı gerekebilir (bizdeki mevcut işleme aynı).

### 11.3 Kenney — diğer faydalı paketler (CC0)
| Paket | İçerik | Boyut | Not |
|---|---|---|---|
| [emotes-pack](https://kenney.nl/assets/emotes-pack) | 480 dosya, 2D, Pixel+Vector, 8 stil | 0,4 MB | **Duygu balonları** (bölüm 2.2) |
| [music-jingles](https://kenney.nl/assets/music-jingles) | 85 ses, kısa müzik | 1,2 MB | A/B ekranı, bölüm sonu |
| [casino-audio](https://kenney.nl/assets/casino-audio), [voiceover-pack](https://kenney.nl/assets/voiceover-pack), [voiceover-pack-fighter](https://kenney.nl/assets/voiceover-pack-fighter) | ses | 0,9–1,9 MB | Voiceover İngilizce |
| [particle-pack](https://kenney.nl/assets/particle-pack) (80, 15 MB), [smoke-particles](https://kenney.nl/assets/smoke-particles) (70, 6 MB), [splat-pack](https://kenney.nl/assets/splat-pack), [light-masks](https://kenney.nl/assets/light-masks) (150, 15 MB; **2026**) | 2D VFX dokuları | — | Buhar/duman/ışık maskesi sprite'ları (B alanı ile kesişir) |
| [skyboxes](https://kenney.nl/assets/skyboxes) (5, 5 MB; **2026-07**), [skyboxes-space](https://kenney.nl/assets/skyboxes-space) | Gökyüzü | — | 4 günün saati için arka plan seçeneği |
| [pattern-pack](https://kenney.nl/assets/pattern-pack) (80), [road-textures](https://kenney.nl/assets/road-textures) (90), [prototype-textures](https://kenney.nl/assets/prototype-textures), [development-essentials](https://kenney.nl/assets/development-essentials) | Dokular | 0,4–1,2 MB | Yüzey dokularımızı tamamlar |
| [flag-pack](https://kenney.nl/assets/flag-pack) (230, **2026**) | Bayraklar | 0,5 MB | **Gerçek ülke bayrağı = gerçek kurum/siyaset çağrışımı; kullanmadan önce kural kontrolü** |
| [isometric-tiles-city/buildings/landscape/vehicles](https://kenney.nl/assets/isometric-tiles-city), [isometric-miniature-library/prototype](https://kenney.nl/assets/isometric-miniature-library) | 2D izometrik sprite | 1–6 MB | 3D'ye gerek duymayan arka plan/ikon |
| [ui-pack](https://kenney.nl/assets/ui-pack) (430), [input-prompts](https://kenney.nl/assets/input-prompts) (1500) | UI | — | Gereksiz |

Toplam kataloğ: 3D 50 · Ses 10 · Doku 10 · 2D 145 (Kenney `category:` sayfalarından sayıldı). Kenney "All-in-1" paketi ücretli (itch.io, fiyat sayfadan alınmadı → X); tekil zip'ler ücretsiz.

### 11.4 Quaternius (CC0; yalnız site; GitHub aynası bulunamadı)
Öncelikli: Universal Base Characters (6 model, humanoid rig), Universal Animation Library 1 (120+) / 2 (130+), Modular Character Outfits – Fantasy (12 kıyafet), Ultimate Animated Animals (12 hayvan, her biri 12+ klip), Cube World Kit, Zombie Apocalypse Kit (araç+köpek), Ultimate Modular Characters (11 karakter, 24 klip), Sushi Restaurant Kit, Downtown City MegaKit (300+ parça; NYC stili). FBX/OBJ/Blend-only: Ultimate Home Interior, Modular Streets, Cars, Public Transport, Farm Animals. Boyutlar sayfada yok (X). İndirme linkleri sayfada doğrudan görünmedi (Drive/itch) → elle.

### 11.5 KayKit (CC0)
GitHub aynaları (bölüm 2.3) + itch.io güncel sürümler. Ücretsiz: City Builder Bits, Furniture Bits, Restaurant Bits, Prototype Bits, Holiday Bits, Halloween Bits, Resource Bits, Block Bits, Character Animations (rig_medium/large), Adventurers, Skeletons, Platformer, Forest Nature, Dungeon, Medieval Hexagon, Board Game Bits, Fantasy Weapons Bits, RPG Tools Bits, Space Base Bits. Ücretli: Mystery Monthly Series 4/5/6 (~19,99$), Bits Bundle 1/2 (~19,95$), Complete (150$). "No generative AI was used" etiketi sayfada yazıyor.

### 11.6 Lisans notları
- CC0 = ticari serbest, atıf yok (Kenney `License.txt` ve KayKit `LICENSE.txt` okundu). KayKit "satmadan, değiştirmeden yeniden dağıtma" ricası taşır.
- CC BY 4.0 (atıf zorunlu): Twemoji grafikleri, Remotion animated emoji, date-holidays verisi (CC-BY-3.0).
- Yeniden dağıtma: Kenney CC0 (serbest); Quaternius için docs/KAYNAKLAR.md "repoya ekleme/gitignore" notunu koruyun.

---

## 12. BAKILIP ELENENLER (neden)

| Aday | Neden |
|---|---|
| ETdoFresh/kenney.nl (GitHub aynası) | ~4★, son commit 2020-07; kenney.nl doğrudan erişilebilir |
| pmndrs/market-assets | Son commit 2023-01, 238 MB, 13 GLB |
| gsimone/awesome-react-three-fiber | Son commit 2021-02 |
| snscrape | Terk, son commit 2023-06; Twitter erişimi yok |
| pytrends | **Arşivli** 2025-04-17 |
| Instaloader, TikTok-Api, gallery-dl | ToS riski + kırılganlık; resmî Business Discovery / Graph API var |
| TikTok Research API | Yalnız akademik/AB-ABD-BK… kurumlar; Türkiye listede yok |
| Hunyuan3D-2 | Lisans AB/BK/G.Kore'de geçersiz, 1M MAU eşiği, çıktıyla model eğitme yasağı, GPU |
| Stable Fast 3D | Gelir >1M$ olunca lisans biter; kayıt şartı |
| TRELLIS, TripoSR, InstantMesh | GPU gerekli; ağ çıktısı yüksek poligon, stile uymaz |
| ComfyUI | GPL-3.0, GPU; yalnız konsept aşaması |
| pmndrs/timeline | Çekirdek `delta` toplayıp ilerliyor (`clock.delta` kodda görüldü) → Remotion paralel/rastgele kare erişimiyle bozulur |
| @theatre/r3f | `@react-three/fiber ^8` peer; R3F 9 ile uyumsuz (core kullan) |
| fframes | Rust+SVG GPU; three.js yok, projeyi yeniden yazmak gerekir |
| Perspective API | 31.12.2026'da kapanıyor |
| Qwen3Guard / Llama Guard / Granite Guardian | LLM-çıktı güvenliği kategorileri; haber konusu filtresine uymaz; Türkçe başarımı doğrulanamadı |
| aeneas | AGPL-3.0, son commit 2020 |
| AIStoryWriter | AGPL-3.0 |
| shixinzhang/tiktok-viral-hooks | CC BY-NC-SA |
| OpenMontage | AGPL-3.0, ajan video sistemi — C alanı |
| mem0/letta/graphiti | Proje JSON dünya durumuyla zaten daha basit |
| Lilita One, Fredoka, Titan One, Chango, Passion One, Knewave, Rubik Mono One, Bagel Fat One, Pathway Extreme | Türkçe glif eksik (test) |
| Poly Pizza, gameasset.net, hfg-gmu/openmoji (ad), 3dassets-dev | Erişilemedi / küçük / doğrulanamadı |
| Kenney voiceover paketleri | İngilizce |

---

## 13. BONUS BULGULAR (proje içinde ölçülenler)

1. **Büyük/küçük harf hatası (Türkçe):** `DecisionScreen.tsx:36,38`, `ArchiveInterior.tsx:27,29`, `Overlay.tsx:59` — `"Sokağı geri getir".toUpperCase()` = `SOKAĞI GERI GETIR`; `toLocaleUpperCase("tr-TR")` = `SOKAĞI GERİ GETİR`. Node'da çalıştırılarak doğrulandı (ICU 77.1). Çözüm: `toLocaleUpperCase("tr-TR")` + ESLint `no-restricted-properties` kuralı (`toUpperCase`/`toLowerCase`); `src/utils/audioLibrary.ts` `norm` zaten ı→i yamasını uyguluyor.
2. **Ses seviyesi:** DOSYA001: −20.2 LUFS, LRA 10.2 LU, TP −0.1 dBFS (bölüm 5.0). Öneri: render sonrası ölç/uyar; ana karışımda true peak ≤ −1 dBTP, hedef LUFS'u kendiniz belirleyin (resmî Instagram değeri yok).
3. **Gündem BLOCK deliği:** bölüm 3.4 (8 başlık testi, 6 kaçak).
4. **Tally adaptörü:** Graph API yorumları ters kronolojik ve üst düzey → "ilk geçerli oy" kuralı için tüm sayfalar çekilip `timestamp` artan sıralanmalı; `from.username` = `user_id` yerine kullanılabilir (kimliği hash'lemek gizlilik için iyi).
5. **Dekor/olay takvimi:** `date-holidays` TR verisi dinî bayramlar dâhil hesaplıyor (ör. "1 Shawwal") — ancak CLAUDE.md "din" konusu gündemde yasak; sadece takvim/dekor mevsimi için, olay içeriği için değil.

---

## 14. KAYNAKLAR (URL)

- Kenney: https://kenney.nl/assets · https://kenney.nl/assets/category:3D · https://kenney.nl/feed
- Quaternius: https://quaternius.com/ · pack sayfaları `https://quaternius.com/packs/<ad>.html`
- KayKit: https://kaylousberg.itch.io · https://github.com/KayKit-Game-Assets
- ToxSam: https://github.com/ToxSam/open-source-3d-assets · https://github.com/ToxSam/cc0-models-Polygonal-Mind
- Fontlar: https://fonts.google.com/metadata/fonts · https://github.com/fontsource/fontsource · https://registry.npmjs.org/@fontsource/<ad>
- Emoji: https://github.com/googlefonts/noto-emoji · https://github.com/jdecked/twemoji · https://github.com/microsoft/fluentui-emoji · https://www.remotion.dev/docs/animated-emoji
- Meta: https://developers.facebook.com/documentation/instagram-platform/comment-moderation · …/instagram-graph-api/reference/ig-comment · …/ig-media/comments · …/instagram-api-with-facebook-login/business-discovery · …/hashtag-search
- TikTok: https://developers.tiktok.com/products/research-api/ · https://developers.tiktok.com/doc/about-research-api · https://developers.tiktok.com/doc/content-posting-api-get-started
- YouTube kota: https://developers.google.com/youtube/v3/determine_quota_cost
- Google Trends API: https://developers.google.com/search/apis/trends · https://developers.google.com/search/blog/2025/07/trends-api · https://trends.google.com/trending/rss?geo=TR
- Perspective sunset: https://perspectiveapi.com/
- Detoxify: https://github.com/unitaryai/detoxify · Qwen3Guard: https://huggingface.co/Qwen/Qwen3Guard-Gen-8B · https://arxiv.org/abs/2510.14276
- Remotion lisans: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md · https://github.com/remotion-dev/remotion/pull/3750 · https://www.remotion.dev/docs/cli/ffmpeg
- Benzer: https://github.com/uxfreak/walking-characters-remotion · https://github.com/cpp285/gold-noir-video-creator · https://github.com/ken-guru/git-city/issues/4 · https://github.com/amilich/isometric-city · https://github.com/img2threejs/img2threejs
- Theatre: https://github.com/theatre-js/theatre · glTF-Transform: https://github.com/donmccurdy/glTF-Transform
- Hunyuan3D lisansı: https://github.com/Tencent-Hunyuan/Hunyuan3D-2/blob/main/LICENSE · SF3D: https://github.com/Stability-AI/stable-fast-3d/blob/main/LICENSE.md
- Awesome listeleri: AxiomeCG/awesome-threejs, terkelg/awesome-creative-coding, Calinou/awesome-gamedev, ellisonleao/magictools, transitive-bullshit/awesome-ffmpeg, krzemienski/awesome-video, LottieFiles/awesome-lottie (hepsi GitHub)
- GitHub topics: https://github.com/topics/remotion
- Diğer tüm depolar: `https://github.com/<owner>/<repo>` (tablolardaki bağlantılar)
