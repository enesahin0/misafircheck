# Birleşik Araştırma Raporu ve Uygulama Planı (2026-10-15)

Dört araştırmacı GitHub, npm ve resmî sayfaları taradı. Ayrıntılar: `A_fizik_ve_hareket.md`, `B_gorsel_kalite_ve_efekt.md` (+ `B_ek_benchmark/`), `C_video_altyapi_altyazi_ses.md`, `D_kaynaklar_ve_bosluklar.md`.
Bu dosya dördünün sonucunu birleştirir ve **ne sırayla uygulanacağını** söyler. Kural seti değişmez: her şey deterministik, kare-tabanlı (`useCurrentFrame`), `useFrame`/gerçek zaman/kontrolsüz rastgelelik yok.

## 0. Dürüstlük notu
- Araştırmacıların hiçbiri GitHub API'sine erişemedi (engelliydi). Yıldız/tarih/lisans bilgisi ungh.cc, ecosyste.ms, npm ve `git clone` ile alındı; yıldızlar yuvarlak.
- İndirilen üçüncü taraf kodu çalıştırılmadı, yalnızca okundu.
- **Ölçülenler:** yalnızca B'nin llvmpipe/SwiftShader GL ölçümleri ve C'nin yerel ffmpeg ölçümleri. Diğer her şey okuma ve doküman.
- **Ölçülmeyenler:** gerçek bir Remotion karesinin süresi (render yapmadık), llvmpipe'in farklı CPU'larda piksel birebirliği, Chromium 157 hız kazancı.

## 1. En önemli 8 bulgu (hepsinden)
1. **Render arka ucu en büyük kaldıraç (B).** Xvfb + tam Chromium + `gl:"angle"` ile Mesa llvmpipe, SwiftShader'dan sahnede ~4–6× hızlı ve deterministik (sahne 118→24 ms; tüm son-işlemler ~5× ucuz). Kare başına gerçek kazanç 5× olmayabilir (JPEG + React payı); tahmin 0.5 sn → 0.2–0.35 sn.
2. **Tarayıcı sürümü (C).** Projedeki Chromium 141; Remotion 4.0.534+ kendi Chromium 157'sini bekliyor (JPEG'siz FFmpeg aktarımı, efektler). B'nin llvmpipe yolu ile C'nin Chrome-for-Testing yolu çakışabilir: **önce ölçüp karar verilecek** (Faz 0).
3. **Yazılım WebGL'de darboğaz piksel işleme (B).** Draw call azaltmak yalnız %18–25; çözünürlük yarıya inince −%68. Her tam ekran geçiş pahalı: tek birleşik geçiş iyi, çok geçişli zincir kötü.
4. **Minyatür hissi için ilk 5 şey (B):** tilt-shift bandı + doygunluk, temas gölgesi/AO, renk derecesi + vinyet + kâğıt dokusu, ince kontur, atmosferik derinlik.
5. **Fizik: motoru önceden (bake) çalıştır (A).** `@react-three/rapier`, three eklentileri, drei Float/Cloud/Sparkles, cannon-es determinizm kuralına uymuyor (`ThreeCanvas` her karede gerçek zamanlı `advance` çağırıyor). Doğru yol: Rapier `3d-deterministic-compat` ile Node'da sabit adımla simüle et, JSON'a yaz, kareden indeksle. Çoğu efekt motor bile istemez: parabol, sönümlü yay, kapalı-form.
6. **Ses → zamanlama → altyazı hattı hazır tasarlandı (C).** ElevenLabs forced alignment / `convertWithTimestamps`, sahne bütçesi tam 1800 kareye oturur, test edilmiş iskelet var.
7. **Lisans riskleri (C, D).** BBC SFX ticari kullanıma kapalı; `@remotion/sfx`'in 32 sesinden yalnız 7'si CC0; Quaternius 2026-08'de lisansı değiştirdi (yeniden dağıtım yasak, kullanım serbest). Reklam gelmeden temizlenmeli.
8. **Hazır CC0 içerik (B, D):** Kenney "Mini" ailesi (aynı iskelet, 32 klip, 24 hayvan, bakkal içi), Quaternius Universal Animation Library, KayKit klipleri, Kenney Fantasy Town/Holiday/Hexagon/Mini Forest, Quaternius Downtown City / Stylized Nature MegaKit.

## 2. Çelişkiler ve nasıl çözüleceği
| Konu | B diyor | C diyor | Karar |
|---|---|---|---|
| Tarayıcı/GL | Tam Chromium 141 + Xvfb + llvmpipe | Remotion'un Chromium 157'si (shared-memory capture) | Faz 0'da 3 yapılandırma ölçülür: (a) swangle (şimdiki), (b) llvmpipe, (c) Chrome 157 + (a/b). En hızlı ve piksel-kararlı olan seçilir. |
| Post-processing kütüphanesi | `@react-three/postprocessing@3.0.4` olabilir ama çoğu geçiş pahalı | `@remotion/effects` / HTML-in-canvas efektleri 157 ister | Kendi tek geçişli "maket" shader'ımızı yaz (kütüphane bağımlılığı yok). |
| Theatre.js | — | `@theatre/r3f` R3F 8'e kilitli, uzak dur | D: `@theatre/core` ile JSON'a döküp kullanmak denenebilir. Öncelik düşük. |

## 3. Uygulama planı (öncelik sırasıyla)

### Faz 0 — Ölçüm (yarım gün, kullanıcı onayı gerekmez: yalnız 5–10 kontrol karesi)
- `npm run mahalle:stills` ile aynı 8 karenin süresini üç GL yapılandırmasında ölç. Piksel hash'ini iki süreçte karşılaştır.
- Çıktı: hangi arka uç, kare başına gerçek süre. **Sonraki tüm fazların bütçesi buna bağlı.**

### Faz 1 — Görsel yükseltme (en yüksek etki; B'ye göre)
1. **"Maket" son işlem:** tek geçiş (tilt-shift bandı + doygunluk/kontrast + vinyet + ince kâğıt dokusu), UnsignedByte RT, MSAA yok. Kare-tabanlı (zaman girdisi yok).
2. **Temas gölgesi/AO:** pişirilmiş blob decal'ler + köşe-rengi AO; sıcak güneş / soğuk gölge.
3. **İnce kontur** yalnız karakter/prop/ön plana (ters kabuk).
4. **Atmosfer:** gradyan gökyüzü, sis, zemine kayan bulut gölgesi, analitik parçacıklar (kar/yaprak zaten var).
5. Doğrulama: her adımdan önce/sonra aynı kareler, süre artışı kaydedilir. Bütçe: kare başına +%25'i geçmesin.

### Faz 2 — Hareket ve karakter (A, D)
1. **Hareket "hissi" yardımcıları:** kapalı-form spring/overshoot, squash-stretch, anticipation (saf fonksiyonlar; `Humanoid`'e bağla).
2. **Karakter çeşitliliği:** Kenney Mini karakterleri (ortak iskelet + 32 klip) veya Quaternius/KayKit klipleri, çevrimdışı Humanoid eklemlerine çevrilmiş. Önce bir karakterle prototip.
3. **Fizik bake hattı:** Rapier deterministic, Node'da sabit adım → JSON → kareden okuma; hash CI kapısı. İlk kullanım: **SAKSI düşmesi** (pilot tohumu), sonra çamaşır ipi (soft body: determinizm belgelenmemiş, hash testi şart).
4. Kalabalık: önce parametrik yaya akışı (zaten var); Yuka/navcat yalnız gerekirse.

### Faz 3 — Ses, altyazı, üretim hattı (C)
1. **`sync-audio`:** ses + senaryo → kelime zamanları (ElevenLabs forced alignment; Whisper yedek) → `Caption[]` + sahne süreleri, toplam tam 1800 kare (`OVERFLOW`/`UNDERFILL` hata kodları).
2. **Altyazı:** `@remotion/captions` TikTok tarzı; Türkçe için `toLocaleUpperCase("tr-TR")`, yazı tipinde `latin-ext` (Anton, Bebas Neue, Montserrat vb.; Lilita One/Fredoka/Titan One gibi İ/Ş/Ğ eksik olanlar kullanılmaz).
3. **Sahne-bazlı hash önbelleği:** her sahne sessiz klip, `ffmpeg -c copy` ile birleştirme, tek ses ana dosyası. Tek sahne değişince tüm videoyu yeniden render etme.
4. **QA ffmpeg hattı:** loudness (`loudnorm`), dondurma/siyah kare/sessizlik denetimi `npm run check`'e.
5. Konuşma jesti: ses zarfı (30 fps RMS) → karakter baş sallaması.

### Faz 4 — Varlık ve lisans temizliği (C, D)
1. **Reklam öncesi şart:** BBC SFX ve `@remotion/sfx`'in CC0 olmayan 25 sesi kaynak listesinden çıkar veya `ledger.json`'da "ticari kapalı" işaretle; `audio:audit --commercial` zaten kapıdır.
2. Kenney eksik 34 paketi (özellikle Mini ailesi, cube-pets, music-jingles, emotes-pack) indir; lisans defterine yaz. Quaternius için yeni QAL şartlarını `ledger.json`'a not et.
3. glTF-Transform (`optimize`, `palette`, `join`) ile GLB'leri küçült.
4. Yazı tipi seti (Türkçe glifleri test edilmiş) `public/fonts` + `docs/KAYNAKLAR.md`.

### Faz 5 — İçerik/etkileşim araçları (D)
1. **Gündem filtresi katman 2:** 8 örnek başlığın 6'sı BLOCK'tan geçti ("vefat, ölmüş, can verdi, kurşun, uyuşturucu, arbede"). Zeyrek/Zemberek lemma + gerekirse sıfır-atış sınıflandırma.
2. **Yorum çekme:** resmî Meta Graph API (üst düzey yorumlar, sayfa başı ≤50, zaman filtresi yok) → `tally-votes.ts` CSV adaptörü.
3. Rakip/benzer analiz: Meta Business Discovery (resmî yol). Instaloader/TikTok-Api/gallery-dl/snscrape kullanılmaz (ToS, kırılganlık).

## 4. Kesinlikle kullanılmayacaklar (gerekçeli)
`@react-three/rapier`, three'nin RapierPhysics/JoltPhysics eklentileri, cannon-es, Matter.js (determinizm/gerçek zaman) · drei Float/Cloud/Sparkles/Stars/Wobble, three.quarks, three-nebula (`Math.random`/saat, durumlu) · `@theatre/r3f` (R3F 8'e kilitli), drei `CameraShake` · SSGI/TAA (realism-effects), canlı AccumulativeShadows, SSAO/SAO/Bokeh/OutlinePass (yazılım GL'de pahalı) · WebGPU/TSL (bu ortamda yok) · Blender'ı 1800 karenin tamamı için (yalnız kapak/hero still, AO/lightmap/simülasyon pişirme) · XTTS-v2, F5-TTS ağırlıkları, MusicGen, Piper `tr_TR-dfki` (ticari kapalı) · Hunyuan3D-2, Stable Fast 3D, TRELLIS (lisans/GPU) · Perspective API (31.12.2026 kapanıyor), TikTok Research API (TR yok) · HyperFrames, Motion Canvas, Revideo, fframes (GL darboğazını çözmüyor).

## 5. Önerilen ilk iş
**Faz 0 + Faz 1.1–1.2.** Gerekçe: en ucuz, en görünür kazanç; mahalle kitimiz zaten hazır; kontrol karesi üretmek video üretmek değil, kuralımıza aykırı değil. Faz 3 (sync-audio) ses geldiğinde zorunlu olacak; Faz 4.1 reklam gelmeden önce zorunlu.
