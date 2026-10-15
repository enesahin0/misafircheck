# Araştırma C — Video altyapısı, altyazı, ses (rapor tarihi: 2026-10-15)

Kapsam: Remotion ekosistemi ve alternatifleri, render hızlandırma, kamera/sinematografi, altyazı ve kinetik tipografi, ses (TTS/STT/lip-sync/SFX/müzik), geçişler, içerik otomasyonu.
Durum kısaltmaları (tablolarda "Doğrulama" sütunu): **D** = kaynak sayfası/README/LICENSE/model kartı okundu; **K** = kısmen (yalnız meta veri ya da ikincil kaynak); **X** = DOĞRULANAMADI.
Uyum: ✓ doğrudan kullanılır · △ koşullu/emek ister · ✗ uymaz. Değer: 1 (düşük) – 5 (çok yüksek). Zorluk: D (düşük) / O (orta) / Y (yüksek).

---

## 0. YÖNETİCİ ÖZETİ

**Hemen ekle**
1. **Zamanlama kaynağı = ses.** Ses dosyaları + bilinen senaryo metni → kelime zamanı: ElevenLabs `forced-alignment` (SDK `client.forcedAlignment.create({file,text})` → `words[{text,start,end,loss}]`) ya da ses API ile üretiliyorsa `textToSpeech.convertWithTimestamps` (karakter zamanı, hem özgün hem normalize metin için). Whisper yalnız yedek. Türkçe sayı/kısaltma için `erdemtuna/normalizer-tr` (Apache-2.0). Tasarım ve test edilmiş kod: §6.
2. **Altyazı:** `@remotion/captions` (`Caption`, `createTikTokStyleCaptions`, `breakOnSilenceAfterMilliseconds` 4.0.514+) + `@remotion/layout-utils fitText`. **Türkçe tuzakları:** `toLocaleUpperCase('tr-TR')` (yerelde doğrulandı: `'iğdır'.toUpperCase()` → `IĞDIR`, doğrusu `İĞDIR`) ve yazı tipinde `latin-ext` alt kümesi (Anton, Bangers, Luckiest Guy, Lilita One, Montserrat, Bebas Neue uygun; Bowlby One, Permanent Marker, Boogaloo YOK).
3. **Render — en büyük ve ucuz kazanç tarayıcı değişikliği:** projedeki `remotion.config.ts` Playwright `chromium_headless_shell-1194` kullanıyor (yerelde `--version` = **Chromium 141.0.7390.37**). Remotion 4.0.534+ kendi **Chromium 157** build'ini kullanıyor; "shared-memory capture" (JPEG sıkıştırmasız kare aktarımı), HTML-in-canvas tabanlı efekt/geçişler yalnız onunla çalışır. İndirme adresi bu konteynerden erişilebilir (HEAD 200, 103,7 MB; glibc 2.39 ≥ 2.35 şartı sağlanıyor). Tek satır: tarayıcıyı Playwright'tan Remotion varsayılanına çevir, `--log=verbose` ile "shared-memory capture uses…" satırını gör, 30 karelik A/B ölç (§4).
4. **Sahne-bazlı hash önbelleği + parçalı render:** sahne başına video-only klip → `ffmpeg -c copy` birleştirme, ses tek seferde tek master'dan. Tek sahne değişince 14 dk yerine ≈ 14 dk × (o sahnenin payı) (aritmetik). Çok makineye bölme için Remotion'un resmî `combineChunks()` planı var (§4).
5. **Ses lisans temizliği (reklam öncesi şart):** `@remotion/sfx` içindeki 32 sesten yalnız **7'si CC0** (whip, whoosh, page-turn, ui-switch, mouse-click, shutter-modern, shutter-old); 25'i "açık lisansı yok, muhtemelen sorun olmaz" notlu internet meme sesleri → ticari yayında kullanma. Lisans defterindeki **BBC SFX = RemArc (ticari kullanım dışı)** → reklam öncesi çıkar.

**Dene**
6. **Ortografik izometrik kamerada statik maket "plakası" pişirme** (kamera pan/zoom'u 2B afindir; az/el sabitken geçerli) — hipotez, 30 karelik spike ile ölç (§4.4).
7. **Açık kaynak Türkçe TTS yedeği (ticari izinli):** `openbmb/VoxCPM2` (Apache-2.0, 30 dil içinde Türkçe, yazarın raporunda Türkçe WER 0,817 / ElevenLabs 0,699), `freyavoice/Freya-TTS` (Apache-2.0, Türkçe'ye özel), `canberkkkkkk/ema-lightning` (Apache-2.0, 8,6 M parametre, CPU'da bile çalışır, tek ses), `Trendyol/Trendyol-TTS` (MIT, VoxCPM2 üzerine Türkçe LoRA). Bunlar taslak/yedek içindir; ElevenLabs'in oyunculuğu yerine geçtiği iddia edilmez (yalnız anlaşılırlık ölçüsü yayımlanmış).
8. **GPU "burst":** Remotion belgesi Chrome for Testing + `--gl=vulkan` ile EC2 g4dn.xlarge yolunu veriyor (`npx remotion gpu` ile doğrulama); kazanç sayısı yayımlanmamış, ölçülmeli.
9. Konuşma jesti için **ses zarfı** (RMS/`visualizeAudio`) → baş sallama/zıplama; Rhubarb yalnız `phonetic` kipinde Türkçe'ye uygulanabilir ama karakterler yüzsüz olduğundan gereksiz.

**Uzak dur**
10. `@theatre/r3f` (peer `@react-three/fiber ^8.13.6`; projede 9.4.0 → uyumsuz; npm'de son sürüm 2024-05), `<CameraMotionBlur>` 3B sahne çevresinde (çocukları `samples` kez yeniden çizer: ×5–10 maliyet), XTTS-v2 (CPML = yalnız ticari olmayan), MMS-TTS (CC-BY-NC), F5-TTS ağırlıkları (CC-BY-NC), MusicGen ağırlıkları (CC-BY-NC), Piper `tr_TR-dfki` (CC BY-NC-SA), OpenMontage (AGPL-3.0), `instagrapi` (özel API), `edge-tts` (resmî olmayan uç nokta; LGPL) ticari akışta; HyperFrames/Motion Canvas/Revideo'ya geçiş (kazanç yok, 3B yazılım-GL darboğazını çözmüyor).

---

## 1. Yöntem ve doğrulama sınırları

- **Kullanılan kanallar:** `ungh.cc` + `repos.ecosyste.ms` (yıldız, son push, lisans, arşiv), `registry.npmjs.org` ve `api.npmjs.org` (sürüm, yayın tarihi, lisans, haftalık indirme, peerDependencies), `huggingface.co` model API/kartları, `raw.githubusercontent.com` (README, LICENSE, Remotion docs kaynakları, kaynak kod), `github.com` sayfaları (topic/arama/org sayfaları). `api.github.com` bu oturumda arbitrer repolara kapalıydı.
- **Erişilemeyen alan adları** (bu yüzden ilgili iddialar X/K): `remotion.dev` (docs kaynağı GitHub'dan okundu — 4.0.536'ya doğru `main` olduğundan bazı özellikler henüz npm'de olmayabilir; npm en güncel **4.0.535**, 2026-10-12), `elevenlabs.io` (forced alignment dil listesi/fiyat), `freesound.org`, `coqui.ai`, `gsap.com`, `lottiefiles.com`.
- **Yıldız/commit sayıları** 2026-10-15 tarihli `ungh.cc` değerleridir; "son commit" = `pushedAt`. Topic sayfasındaki yuvarlak değerlerle birkaç yıldız fark edebilir.
- **Kod çalıştırılmadı** (indirilen hiçbir repo yürütülmedi). Yalnız kendi yazdığım iskelet (`sync-audio`) ve sistem `ffmpeg` komutları yerelde denendi (§6, §7).
- **Süre/kazanç tahminleri** "TAHMİN" etiketlidir; Remotion belgeleri sayısal kazanç yayımlamıyor.

### Projeden okunan ve öneriyi etkileyen gerçekler (salt okuma)
| Bulgu | Kaynak | Sonuç |
|---|---|---|
| Tarayıcı = Playwright `chromium_headless_shell-1194` = Chromium **141.0.7390.37** | `remotion.config.ts`, `scripts/browser.ts`, `--version` | Shared-memory capture ve HTML-in-canvas (≥149 + bayrak / Remotion 157) kullanılmıyor |
| GL = `swangle`, concurrency varsayılan `min(4, cpu/2)`, jpeg q95 | `scripts/render-episode.ts` | 4.x'te GPU'suz makinede `swangle` doğru seçim (kaynakta `angle` yalnız v5'te `--enable-unsafe-swiftshader` ekliyor) |
| Tek tam-kare `ThreeCanvas orthographic`, `dpr=1`, `antialias:false` yalnız `pixel` stilinde | `src/video/Episode.tsx` | Maket tek canvas'ta; plaka pişirme/ayrıştırma bu yapıda mümkün |
| Altyazı `{from,to,text}` cümle bazlı; ducking `speechLevel` altyazı aralığından | `Subtitle.tsx`, `Episode.tsx` | Kelime zamanı gelince hem altyazı hem ducking iyileşir |
| Ses etiketi `Html5Audio` | `Episode.tsx` | Belge yeni kodda `@remotion/media` `<Audio>` öneriyor; zorunlu değil |
| Kamera PCHIP + `sway` | `camera.ts`, `schema.ts` | Zaten saf fonksiyon (kare → poz): paralel/parçalı renderda güvenli |

---

## 2. Remotion ekosistemi

### 2.1 Çekirdek ve lisans (D)
- `remotion-dev/remotion` — ★64 257, son push 2026-10-15, lisans "Remotion License" (kaynak-açık değil, kaynağı görünür). LICENSE.md (okundu): **bireyler, ≤3 çalışanlı kâr amaçlı kuruluşlar, kâr amacı gütmeyenler ücretsiz (ticari kullanım dâhil)**; daha büyük kâr amaçlı şirketlere Company License. Türev Remotion satmak yasak. LICENSE.md başında **5.0'da lisans hafifçe değişecek** notu var (PR #3750: yüklenicilerin takım büyüklüğüne sayılması vb.). Telemetri belgesi: 5.0'da "Automators" şirket lisansı müşterileri için `licenseKey` ve telemetri zorunlu; ücretsiz lisans için `"free-license"` anahtarı. 5.0 henüz çıkmadı (migration belgesi "not yet released").
- Sonuç: Şu an tek kişi/≤3 kişilik yapı için reklam geliri **lisans engeli değil**. Ekip >3 olursa (yüklenici dâhil olabilir) Company License gerekir — **ticari karar noktası**.
- 4.0.534 (2026-10-07): Chromium 157, Chrome↔FFmpeg paylaşımlı bellek, paralel kodlama varsayılan, iç içe HTML-in-canvas SSR'de çalışıyor. 4.0.535 (2026-10-12): Studio premount, `renderFramesOnLambda`, Lambda `separateAudioTo`. 4.0.531: "Speed Lines" storytelling elementi. 4.0.529: HTML-in-canvas motion blur + `interpolatePaths()`.

### 2.2 `@remotion/*` paketleri (hepsi 4.0.535, 2026-10-12; npm meta + docs okundu → D)
| Paket | Lisans (npm) | Ne yapar | Uyum | Zorluk | Değer | Not |
|---|---|---|---|---|---|---|
| `captions` | MIT | `Caption` tipi, `createTikTokStyleCaptions`, `parseSrt`, `serializeSrt` | ✓ | D | **5** | Kelime-zamanlı altyazının omurgası; `pageBreakAfter` (4.0.517), `breakOnSilenceAfterMilliseconds` (4.0.514) |
| `elevenlabs` | MIT | ElevenLabs **Speech-to-Text** çıktısı → `Caption[]` (`elevenLabsTranscriptToCaptions`, `detectElevenLabsTranscriptFormat`) | ✓ | D | 4 | `timestamps_granularity:"word"` gerekir; forced-alignment yanıtını dönüştürmez (kendi 10 satırlık dönüştürücümüz yeter) |
| `layout-utils` | MIT | `fitText`, `measureText`, `fillTextBox` | ✓ | D | 4 | Altyazı otomatik sığdırma |
| `animation-utils` | metada yok (Remotion License) | `makeTransform`, `scale`, `translateY` | ✓ | D | 3 | |
| `noise` | MIT | `noise2D/3D/4D` | ✓ | D | **4** | Deterministik el-kamerası titremesi (drei `CameraShake` yerine) |
| `media-utils` | MIT | `getAudioData`, `visualizeAudio`, `useAudioData`, süre okuma | ✓ (projede var) | D | 4 | 5.0'da `visualizeAudio` varsayılanı `speed` olacak |
| `media` | metada yok | `<Video>`/`<Audio>` (Mediabunny/WebCodecs), "en hızlı" | △ | O | 4 | Plaka kompozitlemede `<Video>`; SSR'de desteklenmeyen kodekte `OffthreadVideo`'ya düşer |
| `three` | MIT | `ThreeCanvas` (render sırasında `frameloop='never'`), `useVideoTexture` | ✓ (var) | – | 5 | v4'te "default GL ile çalışmaz, `angle`/`swangle` ver" notu |
| `transitions` | metada UNLICENSED (Remotion License) | `TransitionSeries`; sunumlar: fade, slide, wipe, flip, clockWipe, iris, pushCut, none; **HTML-in-canvas sunumları** (zoomBlur, dreamyZoom, filmBurn, linearBlur, zoomInOut, dissolve, ripple, crosswarp, crossZoom, swap, blurSlide, bookFlip); `cube()` ücretli | △ | D | 4 | HTML-in-canvas olanlar Chromium ≥157 ister → mevcut 141'de çalışmaz |
| `effects` | metada UNLICENSED | GPU/WebGL efektleri: chromatic-aberration, scanlines, noise, white-noise, vignette, tv-signal-off, halftone, glow, light-leak, light-trail, starburst, lut, zoom-blur, tear, wave, … (60+) | △ | O | 3 | **Yazılım WebGL'de tam kare shader maliyeti** — ölçmeden kullanma; `effectsOutputSize` (4.0.536, henüz npm'de yok) çözünürlüğü düşürür |
| `motion-blur` | MIT | `<HtmlInCanvasMotionBlur>` (önerilen), `<CameraMotionBlur>`, `<Trail>` | △ | D | 2 | 3B üstünde kullanma (aşağıya bak) |
| `light-leaks`, `starburst` | Remotion License | **Sidebar'da "(deprecated)"** | ✗ | – | 1 | `@remotion/effects` karşılıklarını kullan |
| `rounded-text-box` | MIT | TikTok tarzı çok satırlı yuvarlak köşeli metin kutusu SVG yolu | ✓ | D | 4 | Altyazı arka planı |
| `rough-notation` | MIT | Elle çizilmiş kutu/daire/altı çizgi/üstü çizgi | ✓ | D | 3 | Vurgu kelimesi |
| `shapes`, `paths` | MIT | SVG şekil, yol ölçme/`warpPath`/`interpolatePaths` | ✓ | D | 3 | Oy kartı, ilerleme çubuğu, hız çizgisi |
| `gsap` | MIT (GSAP kendisi: "Standard no charge license", metin X) | GSAP timeline'ını kareye bağlar | △ | O | 2 | Gerekmiyor |
| `sfx` | MIT (paket); sesler tek tek | 32 SFX URL'si (`remotion.media`), -3 dB tepe | △ | D | 2 | **Yalnız 7 CC0** (§7.5) |
| `install-whisper-cpp` | Remotion License | whisper.cpp kur/çalıştır → `toCaptions` | △ | O | 3 | Yedek STT; `tokenLevelTimestamps` (DTW) için whisper.cpp ≥1.5.5; Türkçe için `.en` olmayan model |
| `openai-whisper` | MIT | OpenAI Whisper API çıktısı → `Caption[]` | △ | D | 2 | Bulut, ücretli |
| `whisper-web`, `whisper-webgpu` | UNLICENSED / MIT | Tarayıcıda Whisper (WASM / WebGPU) | ✗ | – | 1 | Sunucu akışımız var |
| `lottie`, `rive`, `gif`, `skia` | Remotion License / MIT(skia) | Lottie, Rive, GIF, RN-Skia gömme | △ | O | 2 | §8 |
| `animated-emoji` | kod MIT; emojiler **CC BY 4.0** | Google Noto animasyonlu emoji | △ | D | 2 | Atıf gerekir; client-side render desteklemez |
| `google-fonts`, `fonts` | Remotion License / MIT | Yazı tipi yükleme; `getInfo().subsets` ile `latin-ext` kontrol | ✓ | D | 4 | Projede `@fontsource` var; ikisi de olur |
| `preload` | MIT | Varlık ön yükleme | ✓ | D | 1 | |
| `renderer`, `bundler`, `cli` | Remotion License | `renderMedia`, `combineChunks`, `openBrowser`, `benchmark` | ✓ | – | 5 | §4 |
| `lambda`, `cloudrun`, `vercel` | Remotion License | Bulut dağıtık render | △ | Y | 2 | GPU yok; yine yazılım WebGL |
| `web-renderer`, `webcodecs`, `media-parser` | Remotion License (son ikisi "deprecated") | Tarayıcıda render/medya dönüştürme | ✗ | – | 1 | `ThreeCanvas` destekli ama tarayıcıda GPU'ya bağlı; `<OffthreadVideo>` yok |
| `video-matting` | MIT | Tarayıcıda ön plan ayırma | ✗ | – | 1 | |
| `svg-3d-engine`, `design`, `mcp`, `sdk`, `canvas`, `canvas-capture`, `player(-a11y)`, `studio*`, `tailwind*`, `zod-types`, `licensing`, `maptiler`, `mac-cursors`, `browser-bundler`, `drag-and-drop` | çeşitli | Studio/editör/ekosistem yardımcıları | ✗ | – | 1 | Bu iş için gerekmiyor |
| **Remotion "Elements" (Studio kütüphanesi)** | – | caption elementleri, Speed Lines (4.0.531), vb. | K | – | 3 | `remotion.dev/elements` erişilemedi (X); Studio'da "Browse Elements" |
| `remotion-dev/skills` (★5 133, push 2026-10-12) | lisans belirtilmemiş | Ajan becerileri (`remotion-best-practices`, `-markup`, `-render`…) | ✓ | D | 3 | Claude ile çalışırken yararlı; kodu etkilemez |

**`<CameraMotionBlur>` kanıtı (D):** belge: "children ... `samples` (varsayılan 10) kez farklı zaman ofsetleriyle render edilip ortalanır; renkleri bozucu". ThreeCanvas'ı sarmak maliyeti ≈ ×samples yapar → yazılım GL'de felaket. Hareket bulanıklığı gerekiyorsa yalnız 2B katmanlara (metin, HUD) veya pişirilmiş plakaya uygula.

### 2.3 `remotion-dev` organizasyonu (102 repo; 30+30 listelendi → D)
| Repo | ★ | son push | Lisans | Not | Değer |
|---|---|---|---|---|---|
| `template-tiktok` | 282 | 2026-09-29 | belirtilmemiş | `sub.mjs` + whisper.cpp 1.6.0 + `createTikTokStyleCaptions`; `SubtitlePage/Page.tsx` (fitText, 120 px, `-webkit-text-stroke:20px`, `paintOrder:stroke`, aktif kelime `#39E508`). **`textTransform:"uppercase"` Türkçe'de `i→I` hatası verir** (lang yok) | 4 (desen) |
| `template-audiogram` | 272 | 2026-10-12 | – | Ses dalga formu + altyazı | 2 |
| `template-three` | 110 | 2026-09-29 | MIT | R3F + `useVideoTexture` başlangıç | 2 |
| `template-prompt-to-video` | 153 | 2026-10-12 | – | Prompt → hikâye + seslendirme + görsel | 3 (mimari örneği) |
| `template-code-hike`, `template-skia`, `template-overlay`, `template-music-visualization`, `template-render-server` | 220/25/18/24/14 | 2026-09-29 | – | Konu dışı / referans | 1–2 |
| `template-next-app-dir`, `template-next-pages-dir`, `template-tailwind`, `template-helloworld-javascript` | – | – | – | **Arşivlenmiş** | 0 |
| `html-in-canvas` | 197 | 2026-05-03 | – | HTML-in-canvas deneyleri | 2 |
| `recorder` | 54 | 2026-09-29 | – | Geliştirici video üretimi | 1 |
| `gpu-scene` | 5 | 2025-01-10 | MIT | `npx remotion gpu` GPU kılavuzunun demo sahnesi | 3 |
| `webcodecs-benchmark` | 7 | 2024-12-29 | – | `@remotion/webcodecs` vs FFmpeg.wasm | 1 |
| `rust-ffmpeg-splitter`, `lambda-binaries` | 9/7 | 2026-09 | – | Lambda iç araçları | 1 |
| `morph-text`, `text-warping`, `tone-js-example`, `motion-blur-example`, `gl-transitions`, `d3-example`, `typewriter` | 11–27 | 2022–2024 | – | Eski örnekler (kinetik yazı, Tone.js, GL geçiş) | 2 |
| `cloudflare-containers-demo` | 23 | 2025-07-06 | – | "Proof of concept, üretime hazır değil" (belge) | 1 |
| `github-unwrapped` (+ `-2022`, `trailer`) | 1 327 (topic: 1,3k / 1,3k / 1,1k) | 2026-07-06 / 2023-04 / 2024-03 | – | Büyük üretim örnekleri | 1 |
| `skills`, `claude-code-plugin`, `codex-plugin` | 5 133 / 50 / 26 | 2026-10 | – | Ajan becerileri | 3 |

### 2.4 Topluluk (topic `remotion` = 1 266 repo; yıldıza göre ilk ~100'ü tarandı; hepsi D-meta, seçilenler README'li)
Genel gözlem: topic'in büyük kısmı 2026'da "Claude/Codex becerisi" depoları; kod kitaplığı değeri olanlar azınlık.

| Repo | ★ | son push | Lisans | Ne yapar | Uyum | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| `Remocn/remocn` | 1 606 | 2026-10-11 | MIT | shadcn tarzı kopyala-yapıştır animasyon/geçiş/arka plan/kinetik başlık; "Math.random tuzağı yok" | ✓ | D | 3 | D (README) |
| `av/remotion-bits` | 491 | 2026-09-15 | MIT (npm) | Grafik, geçiş, metin açılışı bileşenleri; CLI + MCP | △ | D | 3 | D (README/npm) |
| `stefanwittwer/remotion-animated` | 226 | 2025-02-22 | MIT | Bildirimsel `<Animated>` | △ | D | 2 | D |
| `reactvideoeditor/clippkit` | 67 | 2025-12-18 | MIT | Intro/metin/geçiş bileşenleri | △ | D | 2 | D |
| `shadcn-labs/snapcn` | 305 | 2026-10-12 | MIT | Ürün demo bileşenleri (metin açılışı, cihaz çerçevesi) | ✗ | – | 1 | D |
| `riaz37/remotion-ui` | 63 | 2026-09-29 | MIT | Hareket bileşen kaydı | △ | D | 1 | K |
| `lifeprompt-team/remotion-scenes` | 5 | 2026-02-05 | MIT | "201+ sahne" (topic'te 61★ gösteriyor, ungh 5) | △ | D | 1 | K (yıldız tutarsız) |
| `vshukla7/remotion-captions-themes` | 0 | 2026-06-21 | MIT | Tema'lı kelime altyazı, kinetik/karaoke | △ | D | 2 (fikir) | K |
| `marcusstenbeck/remotion-audio-visualizers` | 77 (topic) | 2022-08-15 | – | Ses görselleştirme bileşenleri | △ | D | 1 | K, eski |
| `satelllte/remotion-audio-visualizer` | 43 | 2023-10-01 | **GPL-3.0** | Minimal görselleştirme | ✗ | – | 0 | D (copyleft) |
| `calesthio/OpenMontage` | 68 534 | 2026-10-12 | **AGPL-3.0** | 12 hat/100+ araçlı ajan video sistemi | ✗ | – | 1 (ilham) | D |
| `Vincentwei1021/video-shotcraft` | 12 049 | 2026-10-13 | Apache-2.0 | Ürün videosu çekim reçeteleri (ajan becerisi) | ✗ | – | 1 | K |
| `Vincentwei1021/anything2explainer` / `video-talkcraft` | 2 521 / 1 595 | 2026-09/10 | – / other | Konu→anlatımlı video; **video-talkcraft: kelime düzeyinde senkron** | △ | O | 2 | K |
| `digitalsamba/claude-code-video-toolkit` | 2 244 | 2026-10-12 | MIT | Sahne başına ses (`public/audio/scenes`), ElevenLabs/Qwen3-TTS, "karaoke altyazı", ACE-Step müzik | △ | O | 3 (desen) | D (README) |
| `Agents365-ai/video-podcast-maker` | 1 680 | 2026-10-01 | MIT | Konu→4K anlatımlı video, yerel TTS | △ | O | 2 | D |
| `gyoridavid/short-video-maker` | 1 410 | 2025-06-21 | MIT | MCP+REST ile dikey kısa video (Kokoro + whisper.cpp + Pexels) | △ | O | 2 | D; Kokoro'da Türkçe yok; 16 aydır push yok |
| `noahgsolomon/brainrot.js` | 958 | 2026-10-13 | MIT | Metin→"brainrot" video | ✗ | – | 1 | K |
| `FelippeChemello/podcast-maker` | 709 | 2026-01-11 | MIT | Bülten→günlük YouTube videosu (TTS+hareketli grafik) — "günlük üretim" deseni | △ | O | 2 | K |
| `tsensei/OpenReels` | 216 | 2026-04-10 | MIT | Konu→YouTube/IG/TikTok Short boru hattı | △ | O | 2 | K |
| `ayush-that/jiang-clips` | 330 | 2026-03-18 | – | Uzun videodan altyazılı dikey klip | ✗ | – | 1 | K |
| `hassancs91/claude-faceless-shorts-creator` | 273 | 2026-08-18 | – | ElevenLabs + kelime altyazılı yüzsüz Shorts | △ | O | 2 | K |
| `remotion-superpowers`, `claude-video-kit`, `vanta`, `editor-pro-max`, `openshorts`, `Monet`, `AIEV`, `erduo-broll-loop`… | 40–330 | 2026 | çeşitli | Ajan eklentileri / uçtan uca boru hatları | ✗ | – | 1 | K |
| `trykimu/videoeditor`, `openvideodev/react-video-editor`, `mohyware/clip-js`, `0xsline/OpenChatCut` (AGPL), `timoncool/videosos`, `reactvideoeditor/free-react-video-editor` | 138–2 390 | 2025–2026 | karışık | Tarayıcı video editörleri | ✗ | – | 0 | K |
| `thecmdrunner/remotion-render-alternatives` | 0 | 2023-10-30 | – | "WIP Lambda alternatifi" | ✗ | – | 0 | D (terk) |
| `ahgsql/remotion-lottie` | 20 | 2021-07-31 | MIT | Eski Lottie kontrolcüsü | ✗ | – | 0 | D; resmî `@remotion/lottie` var |
| `zhuyansen/awesome-claude-video-skills`, `frankxai/awesome-motion-design-agent-skills` | 627 / 55 | 2026-10 | other / CC0 | Seçilmiş liste (180 repo güvenlik notlu) | – | – | 2 | K |

**"awesome-remotion"**: bu adla anlamlı bir depo bulunamadı (GitHub arama `awesome-remotion` yalnız "remote" eşleşmeleri döndürdü; `remotion-dev/awesome-remotion`, `JonnyBurger/awesome-remotion` 404). Pratik karşılık: topic sayfası, Remotion `/templates`, yukarıdaki iki "awesome" liste.

---

## 3. Alternatif / tamamlayıcı video framework'leri

| Repo / paket | ★ | son push (npm) | Lisans (ticari?) | Ne yapar | Uyum | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| `heygen-com/hyperframes` | 64 345 | 2026-10-15 | Apache-2.0 (✓) | HTML+GSAP/Lottie/**Three.js**/WAAPI adaptörleri → başsız Chrome seek + FFmpeg; Docker, AWS Lambda; Remotion'dan göç becerisi. README: "Remotion'dan ilham; tek makinede yerel + Lambda" | ✗ | Y | 1 | D (README). Yazılım-GL darboğazını çözmez; geçiş maliyeti yüksek |
| `dmtrKovalenko/fframes` | 2 763 | 2026-10-15 | MIT (✓) | Rust+SVG, Skia GPU (Metal/Vulkan) ~10× CPU'dan hızlı; `--draft`; ajan CLI'ı (`inspect`, `strip`, `audio analyze`) | ✗ | Y | 1 | D. **Three.js yok**, mevcut 3B maketi taşımaz. İlham: `audio analyze` (LUFS), `inspect` |
| `midrender/revideo` | 4 110 | 2026-07-15 (npm 0.11.0 2026-07-10) | MIT (✓) | Motion Canvas çatalı; başsız render API'si + React player | ✗ | Y | 1 | D. 2B kanvas; 3B yok |
| `motion-canvas/motion-canvas` | 19 344 | 2026-07-02 (npm son kararlı **3.17.2 = 2024-12-14**, son alpha 2025-02) | MIT (✓) | Üreteç tabanlı 2B anlatım animasyonu, editör | ✗ | Y | 1 | D. Yavaşlamış paket yayını |
| `ybouane/VideoFlow` | 151 | 2026-09-16 | Apache-2.0 (✓) | TS API → taşınabilir JSON → tarayıcı/sunucu render; 25+ hazır giriş/çıkış, WebGL efekt hattı | △ | O | 2 | D. "JSON→video" şema fikri için ilginç |
| `diffusion-studio/core` | 1 249 | 2025-11-18 (npm 4.0.3 2025-11-30) | MPL-2.0 (✓, dosya düzeyi copyleft) | WebCodecs tabanlı tarayıcı kompozitör | ✗ | O | 1 | D |
| `Vanilagy/mediabunny` | 7 307 | 2026-10-15 | MPL-2.0 (✓) | Saf TS medya okuma/yazma/dönüştürme (WebCodecs); Remotion `<Video>` ve web-renderer bunu kullanır | △ | O | 3 | D. Süre okuma (`computeDuration`) için kullanılabilir; Remotion docs örneği var |
| `mifi/editly` | 5 524 | 2025-05-12 (npm 0.14.2 2022-12) | MIT | Bildirimsel ffmpeg+canvas editörü | ✗ | – | 1 | D, durağan |
| `Zulko/moviepy` | 14 987 | 2026-08-26 | MIT | Python video düzenleme (ffmpeg) | △ | D | 2 | D. 2B kompozit/montaj yardımcı; 3B'ye alternatif değil |
| `fluent-ffmpeg/node-fluent-ffmpeg` | 8 230 | 2025-05-22 | MIT | ffmpeg sarmalayıcı | ✗ | – | 0 | D. **ARŞİVLENMİŞ** → `execFile('ffmpeg',…)` kullan |
| `arthenica/ffmpeg-kit` | 5 850 | 2026-07-02 | LGPL-3.0 | Mobil ffmpeg | ✗ | – | 0 | D. **ARŞİVLENMİŞ** |
| `ffmpegwasm/ffmpeg.wasm` | 17 880 | 2026-09-29 | MIT | Tarayıcıda ffmpeg | ✗ | – | 0 | D |
| `kkroening/ffmpeg-python` | 11 009 | 2024-08-04 | Apache-2.0 | Python ffmpeg bağlayıcı | ✗ | – | 1 | D (durağan) |
| `BtbN/FFmpeg-Builds` | 11 830 | 2026-10-15 | MIT (derleme betikleri; ikili GPL/LGPL varyantları) | Statik ffmpeg derlemeleri | △ | D | 2 | K. Sistem ffmpeg 6.1.1 yeterli (xfade 57 geçiş, libass, loudnorm, sidechaincompress yerelde doğrulandı) |
| `3b1b/manim`, `ManimCommunity/manim` | 95 115 / 41 557 | 2026-09 / 2026-10 | MIT | Matematik animasyonu | ✗ | – | 0 | D |
| `alexey-pelykh/puppeteer-capture` | 22 (npm ~3 200 indirme/hafta) | 2026-10-12 (npm 1.58.0 2026-08-07) | MIT | `HeadlessExperimental.beginFrame` ile deterministik kare yakalama | ✗ | O | 1 | D. Remotion zaten deterministik; yazılım-GL'yi hızlandırmaz |
| `tungs/timecut` / `timesnap` | 654 / 240 | 2023-07 / 2024-01 | BSD-3 | Zaman sanallaştırma ile kayıt | ✗ | – | 0 | D (terk) |
| `OpenCut-app/OpenCut` | 94 671 | 2026-09-24 | MIT | CapCut alternatifi editör | ✗ | – | 0 | D (render altyapısı değil) |
| `mltframework/mlt` / `shotcut` / `KDE/kdenlive` / `OpenShot` | 1 863 / 15 429 / 5 868 / 6 633 | 2026-10 | LGPL/GPL | Klasik NLE çekirdekleri | ✗ | – | 0 | D |
| `etro-js/etro` | 1 152 | 2026-10-12 | **GPL-3.0** | Tarayıcı video düzenleme kütüphanesi | ✗ | – | 0 | D |
| `shotstack/shotstack-studio-sdk`, `JSON2Video/json2video-nodejs-sdk` | 58 / 22 | 2026-10 / 2024-04 | other / MIT | Barındırılan servis SDK'ları (JSON→video) | ✗ | – | 0 | D (açık kaynak render motoru değil) |
| `sparticuz/chromium` | 1 655 | 2026-10-07 | MIT | Sunucusuz için küçültülmüş Chromium | ✗ | – | 0 | D |

**3B yazılım-GL darboğazına çözüm olur mu?** Hayır: WebCodecs tabanlı yollar (Remotion web-renderer, Diffusion Studio, VideoFlow tarayıcı render) kodlamayı hızlandırır, WebGL rasterizasyonunu hızlandırmaz; GPU yoksa tarayıcıda da SwiftShader çalışır. Çözüm: aynı tarayıcı render'ını (a) daha az piksel/daha az kare, (b) önbellek, (c) çok makine, (d) GPU'lu geçici makine ile yapmak (§4).

---
## 4. Render hattı hızlandırma

Başlangıç: 1 800 kare × ~0,5 sn = **~15 dk** (yazılım WebGL, tam kare 1080×1920 ortografik 3B). Hedef: (a) bir sahne değişince dakikalar değil saniyeler/1–3 dk, (b) günlük tam render ≤ 5 dk.

### 4.1 Sıralı öneriler ve beklenen kazanç
Kazanç sütunu: **A** = aritmetik (varsayımdan türetilmiş), **B** = belge/kaynaktan doğrulanmış mekanizma ama sayı yok, **T** = TAHMİN (ölçülmeli).

| # | Öneri | Nasıl | Kanıt | Beklenen kazanç | Risk |
|---|---|---|---|---|---|
| 1 | **Ölç**: kare süresi dağılımı ve concurrency taraması | `npx remotion render … --log=verbose` (en yavaş kareleri listeler; "ilk kareler ısınma yüzünden yavaş" notu), `npx remotion benchmark` ile concurrency 1/2/3/4/6 | Remotion "Performance Tips" (D) | Sonraki kararların temeli | – |
| 2 | **Remotion'un kendi Chromium 157'sine geç** (Playwright 141 yerine) | `npx remotion browser ensure`; `remotion.config.ts` içindeki `setBrowserExecutable` ve `scripts/browser.ts` adaylarını kaldır/`null` bırak; `--log=verbose` çıktısında `Parallel encoding is enabled.` ve `Remotion shared-memory capture uses…` satırlarını ara | shared-memory-capture.mdx (D): özel Chromium 157.0.8080.0, kareler JPEG/PNG sıkıştırması olmadan FFmpeg'e bitmap olarak gider; şart "Remotion'un varsayılan tarayıcısı" ve glibc ≥2.35 (konteyner 2.39 ✓); indirme adresi `remotion.media/chromium-headless-shell-linux-x64-157.0.8080.0.zip` erişilebilir (HEAD 200, 103 668 996 bayt) | B: JPEG kodlama+çözme ek yükü kalkar (`imageFormat/jpegQuality` etkisiz olur → projedeki `jpeg q95` ayarı artık kalite kaybı yaratmaz). Kare süresine etkisi **T: %5–20** (maliyet ağırlıkla GL'de). Ek kazanç: HTML-in-canvas efektleri/geçişleri açılır | 157'de `swangle` + `ThreeCanvas` davranışı doğrulanmadı → 30 kare A/B; paket sürümü sabitle |
| 3 | **3B sahne maliyetini düşür** (kod) | `gl={{antialias:false}}` (zaten `pixel` stilinde; `lowpoly`de açık), tek ışık+baked gölge, statik mesh birleştirme/`InstancedMesh`, doku boyutu, her karede yeniden oluşturulan geometri/materyal yok (`useMemo`), görünmeyen binaları kamera kutusuyla ele, `pixel` stilin mantığı (3B'yi 1/N çözünürlükte çizip büyütmek) görsel kabul edilebilirse bölüm-bazlı uygula | Performance Tips: WebGL/CSS gölge/blur/gradient GPU işi, GPU'suz bulutta darboğaz (D) | **T: 1,5–3×** (yazılım GL dolgu+köşe maliyeti; piksel sayısı 1/4 → dolgu ~1/4) | Estetik değişir |
| 4 | **Sahne-bazlı hash önbelleği** | §4.3 iskelet. Sahne video-only (sessiz) klibi `out/cache/<hash>.mp4`; değişmeyen sahneyi atla | Remotion'da `frameRange` + saf kare fonksiyonu → aynı kare aynı piksel (ThreeCanvas `frameloop='never'`, docs D) | **A:** 8 eşit sahneden 1'i değişirse ≈ 15 dk/8 ≈ 2 dk (+ concat birkaç sn). Günlük "senaryo düzeltme → yeniden render" döngüsünde en büyük kazanç | Anahtarın tam olması; sahne-yerel zaman (§4.3 not) |
| 5 | **Statik "maket plakası" pişirme** (ortografik) | §4.4 | Ortografik kamera ⇒ pan/zoom 2B afin (yerel çıkarım) | **T:** plakalı sahnede kare başı 0,5 sn → 0,05–0,15 sn (2B kompozit + az sayıda 3B hareketli nesne). Spike ile ölç | Oklüzyon, gölge, az/el değişimi |
| 6 | **Çok makineye/oturuma bölme** | Resmî plan: `frameRange` parçaları + `combineChunks` (docs `distributed-rendering`, D); ya da sahne klipleri farklı makinede, birleştirme `ffmpeg -c copy` | `distributed-rendering.mdx` kuralları (D): eşit kare sayılı parçalar, hepsinde aynı seçenekler, `h264-ts`, `compositionStart`, `separateAudioTo`, `forSeamlessAacConcatenation` | **A:** N makine, parça başı sabit yük ~Y sn ise süre ≈ 15 dk/N + Y. Y (bundle+tarayıcı açılışı) ölçülmeli: N=6, Y=60 sn varsayımıyla ≈ 3,5 dk | Her makinede aynı node_modules/tarayıcı/font; 3B GPU yok ⇒ makine başı hız aynı |
| 7 | **GPU'lu geçici makine** | Belge: AWS g4dn.xlarge + Chrome for Testing + `--gl=vulkan`; `npx remotion render --chrome-mode="chrome-for-testing" --gl=vulkan`; doğrulama `npx remotion gpu` | `cloud-gpu.mdx` (D): "render should be significantly faster"; makine "default yapılandırmayla ayda 375 $" (sürekli açık); sayısal hız yayımlanmamış | **T:** yazılım GL'e göre büyük (≥3–10×); tek bölüm için saatlik/spot kullanım | Kurulum karmaşık; Lambda'da GPU yok |
| 8 | **Taslak (draft) hattı** | Mevcut `--draft` (scale 0,5, crf 28) + 15 fps taslak kompozisyon (900 kare) + sahne-bazlı `frameRange` + `stills` kontrol kareleri | `--every-nth-frame` **yalnız GIF** (renderMedia docs D) → ayrı fps kompozisyonu gerekir | **T/A:** 0,5 ölçek (dolgu 1/4) × 15 fps (kare 1/2) ≈ 4–6× | Taslak hareket akıcılığı düşük |
| 9 | **Kodlama ayarları** | `x264Preset: 'veryfast'` (Remotion 5.0 Lambda'da varsayılan olacak; yerelde varsayılan `medium`), paralel kodlama açık (4.0.534+ varsayılan) | `5-0-migration.mdx`, `parallel-encoding.mdx` (D) | Kodlama zaten renderle örtüşüyor; **düşük** etki | – |
| 10 | **Son geçiş ffmpeg'de** (altyazı yakma / xfade) | `ass` filtresi, `xfade` (ffmpeg 6.1.1 yerelde: 57 geçiş), `loudnorm` | Yerel ölçüm (4 çekirdek, `veryfast`, crf 16): 60 sn 1080×1920 videoya ASS karaoke yakma + yeniden kodlama **23 sn** ≈ 0,013 sn/kare, yani 3B kareden **~38× ucuz**; iki 2 sn'lik klip xfade 2,5 sn | **A:** altyazı/geçiş iterasyonu 3B'den bağımsızlaşır | Stil sınırı: libass, React kadar esnek değil |

Diğer bulgular: Chromium bayrakları kaynaktan okundu (D): `swangle` = `--use-gl=angle --use-angle=swiftshader`; v4'te `angle` yalnız `--use-gl=angle` (SwiftShader'a otomatik düşüş yok; v5'te `--enable-unsafe-swiftshader` eklenecek); `vulkan` = `--use-angle=vulkan --use-vulkan=native … --enable-gpu`; `angle-egl` = `--use-gl=angle --use-angle=gl-egl` (sistem Mesa/EGL; **Mesa llvmpipe ile deneme değeri var, kazanç belirsiz — X**). Linux'ta `--single-process`'ten kaçınmak için çok işlem kipi 4.0.137'den beri varsayılan (`enableMultiProcessOnLinux`). `--gl` değerleri: `swangle, angle, egl, swiftshader, vulkan, angle-egl` (+ `null`).

### 4.2 `--gl` modları (kaynak: `packages/renderer/src/options/gl.tsx`, `open-browser.ts`)
| Mod | Anlamı | GPU'suz konteyner için |
|---|---|---|
| `swangle` | SwiftShader'ı ANGLE üzerinde zorla | **Önerilen/mevcut** (Lambda varsayılanı) |
| `angle` | Chrome seçsin (v5 varsayılanı) | v4'te GPU yoksa WebGL açılmayabilir |
| `swiftshader` | Eski doğrudan SwiftShader | Geriye uyum |
| `egl` | `--use-gl=egl` | Başsız sunucuda GPU/Mesa gerekir |
| `angle-egl` | ANGLE→sistem EGL/GL | Mesa varsa deneme adayı (X) |
| `vulkan` | GPU Vulkan yolu | GPU'lu makine + Chrome for Testing |
| `null` | Chrome karar verir | Üç boyutta önerilmez |

### 4.3 Sahne-bazlı önbellekli render iskeleti (kavramsal; çalıştırılmadı)
```ts
// scripts/render-scenes.ts  (taslak)
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderMedia, selectComposition } from "@remotion/renderer";

const codeHash = execFileSync("git", ["ls-files", "-s", "src", "package-lock.json"]).toString(); // blob sha listesi
const key = (scene: any, extra: object) =>
  createHash("sha256").update(JSON.stringify({ scene, extra, codeHash, ver: "remotion@4.0.535" })).digest("hex").slice(0, 16);

const serveUrl = await bundle({ entryPoint: "src/index.ts", publicDir: "public" });   // BİR kez
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "swangle" } }); // BİR kez, yeniden kullan
const comp = await selectComposition({ serveUrl, id: "Nufus0Episode001", inputProps: {}, puppeteerInstance: browser });

const clips: string[] = [];
for (const sc of episode.scenes) {
  const out = `out/cache/${sc.id}-${key(sc, { w: worldSlice(sc) })}.mp4`;
  clips.push(out);
  if (fs.existsSync(out)) continue;                                  // önbellek isabeti
  await renderMedia({
    composition: comp, serveUrl, codec: "h264", outputLocation: out,
    frameRange: [sc.from, sc.to - 1],                                // son dahil
    muted: true,                                                     // sahne klibi sessiz
    puppeteerInstance: browser, concurrency, crf: 17, pixelFormat: "yuv420p",
    // aynı seçenekler HER sahnede (Remotion dağıtık render kuralı)
  });
}
// 1) ses: tüm kompozisyonun sesini tek seferde (kare render etmeden) üret
await renderMedia({ composition: comp, serveUrl, codec: "aac", outputLocation: "out/master.aac" /* yalnız ses */ });
// 2) video-only klipleri kopyalayarak birleştir (aynı kodek/çözünürlük/GOP ⇒ -c copy)
fs.writeFileSync("out/list.txt", clips.map(c => `file '${c.replace("out/","")}'`).join("\n"));
execFileSync("ffmpeg", ["-y","-f","concat","-safe","0","-i","out/list.txt","-i","out/master.aac",
  "-map","0:v","-map","1:a","-c:v","copy","-c:a","aac","-b:a","192k","-movflags","+faststart","out/final.mp4"]);
```
Notlar:
- Yerelde `ffmpeg -f concat -c copy` ile iki h264 klip birleştirme çalıştı (60+60 kare → toplam doğru; AAC'li klipler birleşince ~2,02 sn: **AAC öncül örnek payı** — bu yüzden klipleri **sessiz** render edip sesi tek master'dan eklemek öneriliyor).
- Kare doğruluğu: `frameRange` ile tek parça render, tam render'la aynı pikseli üretmeli (kareler saf fonksiyon). Teyit için ilk uygulamada sınır karelerini `ffmpeg … -vf "select=eq(n\,K)"` ile tam render'dan karşılaştır.
- **Önbellek anahtarı doğruluğu kritik**: sahne JSON dilimi + o sahnenin dünya parametreleri (`resolveWorld` sonuçları: mevsim, `worldState`) + kod karması + bağımlılık sürümleri. Eksik anahtar = eski görüntü kalır. Yanlış-pozitif için `--no-cache` bayrağı koy.
- **Önbellek verimi için sahne-yerel zaman**: sahne içi anahtar kareleri sahne başına göreli yazılırsa, önceki sahnenin süresi (ses uzunluğu) değişse bile sonraki sahnelerin anahtarı değişmez; mutlak karelerle yazılırsa tüm aşağı akış geçersizleşir (doğru ama verimsiz).
- Resmî çok makine yolu için `distributed-rendering` belgesindeki kurallar (hepsi D): her parça aynı kare sayısı (sonuncu hariç), `h264-ts`, `compositionStart`, `audioCodec:'pcm-16'` + `forSeamlessAacConcatenation:false` (≥4 kare/parça ve aac değilse) ya da `separateAudioTo`; sonra `combineChunks({videoFiles, audioFiles, framesPerChunk, fps, compositionDurationInFrames, codec:'h264'})`. Belge bunu "zor API" olarak işaretler; video-only klip + ffmpeg concat yolu daha basit.

### 4.4 Statik maket plakası (hipotez; 30 karelik spike ile doğrula)
Fikir: kamera ortografik ve bir sahne boyunca `az/el` sabitse, kamera hareketi (hedef kayması + zoom) yalnız 2B öteleme+ölçek. Statik geometri (binalar, yollar, ağaçlar, kaldırım) bir kez yüksek çözünürlükte (örn. 2× ya da karo karo) PNG'ye pişirilir; bölümde `<Img>` + CSS `transform` ile kaydırılır; hareketli nesneler (insanlar, araç, ışıklar) ayrı, şeffaf zeminli küçük `ThreeCanvas` katmanında (ya da kendi küçük kanvasında) aynı ortografik kamerayla çizilir.
- Sorun 1 — **oklüzyon**: karakter bina arkasına girerse plaka onu örter. Çözüm: ön plan engelleyicileri (binanın ön yüzü, ağaç) ayrı "ön plaka"; z-sıralı ikinci PNG (alfa).
- Sorun 2 — **gölge/ışık animasyonu** (gün batımı, titreyen lamba): plaka sabit; yanıp sönen lamba/pencere ayrı küçük katman.
- Sorun 3 — `az/el` değişen sahneler (kamera dönüşü) plaka kullanmaz; mevcut yola düşer.
- Sorun 4 — çözünürlük: yakınlaştırmada plaka pikselleşir → zoom üst sınırına göre pişir (örn. maks zoom 2,5× ise 2,5× çözünürlük; bellek 1080×1920×6,25 ≈ 13 MP).
- Ölçüm: aynı sahnede (a) tam 3B, (b) plaka+küçük canvas; 30 kare, kare başına süre.
- Projede bu yapı mümkün: tek `ThreeCanvas`, kamera `sampleCamera` → `WorldScene`'e parametre.

### 4.5 Bulut seçenekleri
| Seçenek | Durum (kaynak) | Bizim için |
|---|---|---|
| Remotion Lambda | Lambda'da GPU yok (gpu.mdx D); `swangle` varsayılan; 5.0'da `x264Preset veryfast`; `framesPerLambda` ile parça; Python/Go/PHP/Ruby istemcileri | Parça başına yine yazılım GL; paralellik avantajı. Fiyat/hız sayıları belgelere erişilemediği için X |
| Cloud Run (`@remotion/cloudrun`) | Paket var (npm haftalık 7 528) | Benzer; AWS yerine GCP |
| Vercel Sandbox (`@remotion/vercel`) | Zaman aşımı 45 dk Hobby / 5 saat Pro; eşzamanlı 10 Hobby / 2 000 Pro (vercel-sandbox.mdx D) | Çok parça için ilginç; maliyet X |
| Cloudflare Containers | "Proof of concept, üretime hazır değil" | Hayır |
| Azure Container Apps | Belge mevcut (`azure-container-apps.mdx`) | Okunmadı (K) |
| EC2 GPU (g4dn) | Belgeli kılavuz | §4.1 #7 |
| Kendi oturum/konteyner fan-out'u | Bu ortamda N paralel oturum (create_session) ya da CI matrisi; sahne klibi + `-c copy` | Ek altyapı gerekmez; Y süresi ölçülmeli |

### 4.6 Özet yol haritası (gün sayısı yerine sıra)
1) #1 ölçüm + #2 tarayıcı A/B (yarım gün) → 2) #4 sahne önbelleği (1–2 gün; en çok iterasyon kazancı) → 3) #3 3B maliyet temizliği (ölçümle) → 4) #5 plaka spike (yarım gün) → 5) #6/#7 yalnız hâlâ yavaşsa.

## 5. Kamera ve sinematografi

**Temel kural (projede zaten doğru uygulanmış):** kamera = saf fonksiyon `kare → poz`. Durumlu (damping, `clock`) kamera kütüphaneleri parçalı/paralel renderda ve kare atlayarak renderda farklı sonuç verir. Mevcut PCHIP zinciri (`camera.ts`) bu kurala uyuyor.

| Aday | ★ / son sürüm | Lisans | Ne yapar | Uyum | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|
| `@remotion/noise` `noise2D/3D/4D(seed,x,y,z)` → [-1,1] | npm 4.0.535 | MIT | Tohumlu deterministik gürültü; el kamerası/`sway`, titreme, rüzgâr | **✓** | D | **4** | D (docs: "same seed + same inputs = same result") |
| `drei` `<CameraShake>` | drei ★9 941, npm 10.7.9 (2026-09-25, peer R3F ^9, React ^19 ✓) | MIT | Simplex gürültüyle sarsıntı | **✗** | – | 0 | D (kaynak: `useFrame` + `state.clock.elapsedTime`; Remotion `ThreeCanvas` render sırasında `frameloop='never'` → sarsıntı donar/gerçek zamana bağlanır). Yerine `noise3D(frame/…)` |
| `yomotsu/camera-controls` | ★2 433, push 2026-10-01, npm 3.1.2 (2025-11-17) | MIT | OrbitControls benzeri, yumuşatmalı, `setLookAt/fitToBox` geçişleri | △ | O | 2 | K (README bu oturumda okunamadı; zaman-adımlı `update(delta)` durumlu çalışır — doğrulanmadı). Mevcut PCHIP daha uygun |
| `theatre-js/theatre` (`@theatre/core` / `studio` / `r3f`) | ★12 738, **son push 2024-08-14; npm 0.7.2 = 2024-05-19** | core/r3f Apache-2.0; **studio AGPL-3.0** | Zaman çizelgesi + keyframe editörü, R3F entegrasyonu; `sequence.position = t` ile kare sürme mümkün (ikincil kaynak) | **✗** | Y | 1 | D: `@theatre/r3f@0.7.2` peer `@react-three/fiber ^8.13.6` (projede **9.4.0**); 2 yıldır sürüm yok. Yalnız `@theatre/core` (vanilla) kareyle sürülebilir ama editör (studio) AGPL |
| `pmndrs/drei` `OrthographicCamera/PerspectiveCamera` | – | MIT | Kamera bileşenleri | ✓ (R3F zaten) | D | 2 | D |
| `@remotion/paths` `getPointAtLength/getTangentAtLength` | 4.0.535 | MIT | SVG yolu üstünde nokta/teğet → kamera ya da nesne yolu | ✓ | D | 3 | D (5.0'da yol sonunu aşınca `null` döner) |
| `three` `CatmullRomCurve3`/`CubicBezierCurve3` | three 0.186.1 (npm; proje 0.180) | MIT | Yol eğrileri | ✓ | D | 2 | K (kaynak okunmadı; three çekirdeği) |
| `@remotion/motion-blur` `<CameraMotionBlur>`, `<HtmlInCanvasMotionBlur>` | 4.0.535 | MIT | Gerçekçi hareket bulanıklığı | **✗ (3B üstünde)** / △ (2B) | D | 2 | D: çocukları `samples` kez çizer |
| `@remotion/transitions` `zoomBlur/crossZoom/linearBlur` | 4.0.535 | Remotion License | "Whip pan/zoom" hissi veren geçiş sunumları | △ | D | 3 | D; HTML-in-canvas ⇒ Chromium ≥157 |

### 5.1 İzometrik ortografik kamerada anlamlı sinematografi
| Teknik | Ortografik izometrikte karşılığı | Uygulama | Maliyet |
|---|---|---|---|
| **Dolly in/out** | Perspektif parallaksı yok ⇒ saf `zoom` değişimi (ölçek) | `zoom` anahtar karesi + `Math.log` enterpolasyonu (projede var) | Yok |
| **Dolly-zoom (Vertigo)** | Yapılamaz (perspektif gerektirir) | Yerine hızlı zoom + FOV'suz "punch-in" | – |
| **Pan / follow** | Hedef noktayı karakteri izleyecek şekilde (yumuşatılmış, ileri-bakışlı) kaydır | `target(t) = actor(t + 8 kare)` PCHIP; tahmin = ileri örnekleme (saf) | Yok |
| **Crane / orbit** | `az`/`el` değişimi tek gerçek parallaks kaynağı | `az` ±15–25° yavaş; büyük `el` değişimi poligonları gösterir | Plaka tekniğini kapatır (§4.4) |
| **Handheld** | Hedefe küçük 2B gürültü | `target += [noise3D('x',f/40,0,0), noise3D('y',f/40,1,0), 0]*amp`, `zoom *= 1+noise*0.004` | Yok |
| **Whip pan** | Hızlı pan (6–10 kare) + yönlü bulanıklık + sahne değişimi bulanıklık tepe noktasında | Pan eğrisi `easeInOutExpo`; bulanıklık 2B katmanda (`filter: blur(x px)` tek yönlü için iki kopya ya da `linearBlur`), 3B'ye uygulama | Düşük |
| **Match cut** | İki sahnede aynı ekran noktasında aynı silüet/şekil | `anchorWorld` seç; iki sahnenin kamerasını anchor ekranda aynı px'te olacak şekilde çöz (ortografikte doğrusal) | Yok |
| **Rack focus** | Ortografikte doğal DOF yok | Plaka tekniğiyle arka plana 2B blur (CSS filter ucuz, düz PNG); 3B'de DOF post-process **önerilmez** (yazılım GL pahalı) | Plaka varsa düşük |
| **Smash cut / jump cut** | Sert kesme + ses çıkışı | Kamera zincirini kes (mevcut mantık: yeni zincir) | Yok |
| **Kamera sarsıntısı (patlama/çarpma)** | Sönümlü sinüs + gürültü | `amp = A*exp(-k*(f-f0))*noise3D(...)`; hit-stop: 2–3 kare dondur | Yok |

Not: 30 fps'de saniyede >≈600 px ekran hızı strobing yapar; hızlı pan'de bulanıklık şart (yalnız 2B katmanda).

### 5.2 Kod: deterministik el kamerası + kare dondurma
```ts
import { noise3D } from "@remotion/noise";
export const handheld = (f: number, amp = 0.15, seed = "cam") => ({
  dx: noise3D(seed + "x", f / 40, 0, 0) * amp,
  dz: noise3D(seed + "z", f / 40, 7.3, 0) * amp,
  dzoom: 1 + noise3D(seed + "s", f / 55, 3.1, 0) * 0.004,
});
// hit-stop: yerel kareyi 2 kare dondur
export const hitStop = (f: number, at: number, hold = 2) => (f < at ? f : f < at + hold ? at : f - hold);
```

## 6. Altyazı, tipografi ve "ses → zamanlama → altyazı → sahne" hattı

### 6.1 Kelime zamanı üretimi: araçlar (Türkçe odaklı)
| Araç | ★ / son commit | Lisans (ticari?) | Ne yapar | Türkçe | Uyum | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| **ElevenLabs Forced Alignment** (`client.forcedAlignment.create({file,text})`) | SDK `elevenlabs/elevenlabs-js` ★446, push 2026-10-15, npm 2.73.0 (MIT) | SDK MIT; API ücretli (STT ile aynı fiyat — K) | Ses + **bilinen metin** → `characters[]`, `words[{text,start,end,loss}]`, ortalama `loss`. Diyarizasyon yok | Resmî sayfa (ikincil kaynak/arama özeti): multilingual v2 modelleri, **29 dil**; Türkçe'nin listede olduğu **X** | ✓ | D | **5** | K: SDK tipleri okundu (D); limitler: sayfa özeti "3 GB / 10 saat / 675 000 karakter", SDK yorumu "<1 GB" (çelişki → 1 GB'ın altında kal); dil/fiyat X |
| **ElevenLabs `textToSpeech.convertWithTimestamps`** (`/v1/text-to-speech/{id}/with-timestamps`) | aynı SDK | aynı | Ses API ile üretilirse yanıtla birlikte **karakter** başlangıç/bitiş saniyeleri: `alignment` (özgün metin) ve `normalizedAlignment` (sayılar açılmış metin). Ek parametreler: `seed`, `previousText/nextText`, `previousRequestIds`, `pronunciationDictionaryLocators`, `applyTextNormalization`, `languageCode` | Türkçe TTS destekli (model kartı X) | ✓ | D | **5** | D (SDK `BodyTextToSpeechFullWithTimestamps.ts`, `CharacterAlignmentModel`). Kullanıcı sesi elle üretiyorsa uygulanmaz |
| ElevenLabs Scribe v2 STT + `@remotion/elevenlabs` | npm 4.0.535 (MIT) | MIT paket | `timestamps_granularity:"word"` → `elevenLabsTranscriptToCaptions` → `Caption[]` | Scribe 99/90+ dil (ikincil); Türkçe WER sayfası X | △ | D | 3 | D (docs), dil/WER K |
| **WhisperX** `m-bain/whisperX` | ★24 573 · 2026-09-26 | BSD-2 (✓) | faster-whisper + wav2vec2 zorla hizalama; kelime zamanı | `DEFAULT_ALIGN_MODELS_HF["tr"]="mpoyraz/wav2vec2-xls-r-300m-cv7-turkish"` (**CC-BY-4.0**, kart: Test WER 8,62 / CER 2,26, doğrulanmamış) | ✓ (yedek) | O | 4 | D (kaynak+kart). GPU önerilir; CPU'da yavaş |
| `SYSTRAN/faster-whisper` | ★25 876 · 2026-10-13 | MIT | CTranslate2 ile hızlı Whisper (`word_timestamps=True`) | large-v3 çok dilli (Whisper Apache-2.0/MIT) | ✓ | D | 4 | D |
| `ggml-org/whisper.cpp` (+ `@remotion/install-whisper-cpp`) | ★54 417 · 2026-10-12 | MIT (Remotion sargısı: Remotion License) | CPU'da Whisper; DTW token zamanı | `.en` olmayan model gerekir (`medium`, `large-v3(-turbo)`); `tokenLevelTimestamps` ≥1.5.5 | ✓ | D | 3 | D (docs) |
| `MahmoudAshraf97/ctc-forced-aligner` | ★569 · 2026-09-07 | BSD-2 (kod) | HF CTC modelleriyle metin–ses hizalama, 1130+ dil | Varsayılan model `mms-300m-1130-forced-aligner`: **lisans X** (kaynağı `facebook/mms-300m` = CC-BY-NC-4.0 ⇒ ticari risk). `--alignment_model mpoyraz/…-turkish` ile güvenli | △ | O | 3 | D/X |
| `Montreal-Forced-Aligner` | ★1 903 · 2026-10-08 | MIT | Kaldi tabanlı | Türkçe akustik model/sözlük varlığı **X** | ✗ | Y | 1 | K |
| `linto-ai/whisper-timestamped` | ★2 855 · 2026-09-28 | **AGPL-3.0** | Whisper + DTW kelime zamanı | Whisper | △ | D | 2 | D (kopyalama/servis etme riski; araç olarak çalıştırmak sorun değil) |
| `jianfch/stable-ts` | ★2 282 · 2026-05-30 | MIT | Whisper + hizalama | Whisper | ✗ | – | 1 | D: **ARŞİVLENMİŞ** |
| `readbeyond/aeneas` | ★2 870 · 2026-07-25 | **AGPL-3.0** | DTW + TTS sentezli hizalama | espeak | ✗ | – | 0 | D (eski yaklaşım, AGPL) |
| `lowerquality/gentle` | ★1 712 · 2026-07-24 | lisans belirtilmemiş | Kaldi; İngilizce | ✗ | ✗ | – | 0 | K |
| NVIDIA `parakeet-tdt-0.6b-v3`, `canary-1b-v2` | HF | CC-BY-4.0 | Hızlı ASR | **Türkçe YOK** (dil listesi okundu) | ✗ | – | 0 | D |
| OpenAI Whisper `large-v3` / `large-v3-turbo` | `openai/whisper` ★110 536 · 2026-08-31 | MIT / Apache-2.0 / MIT | Kaynak model | çok dilli; Türkçe WER sayısı X | ✓ | – | 4 | D (lisans) |
| `selimc/whisper-large-v3-turbo-turkish`, `emre/whisper-medium-turkish-2` | HF 22/19 ❤ | MIT / Apache-2.0 | Türkçe ince ayarlı Whisper | Türkçe | △ | D | 2 | K (kalite ölçülmedi) |

**Seçim:** (1) ses ElevenLabs'ten ve metin elimizde ⇒ **forced alignment** (Whisper'ın "duyduğunu yazma" hatası, noktalama/yazım farkı yok). (2) API ile üretiliyorsa **with-timestamps** (hizalama bile gerekmez, `normalizedAlignment` sayı okunuşunu da verir). (3) Yedek: WhisperX `align` (transkript verili) ya da Whisper large-v3 + senaryoya yaklaşık eşleme.

### 6.2 Altyazı tipografisi
| Konu | Bulgu / öneri | Kaynak |
|---|---|---|
| Sayfalama | `createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 900–1200, breakOnSilenceAfterMilliseconds: 350})`; `white-space: pre`; her `text` başında boşluk | docs (D) |
| Sığdırma | `@remotion/layout-utils fitText({fontFamily,text,withinWidth,textTransform})`; çevrimdışı doğrulama için `@chenglou/pretext` (MIT, DOM'suz çok satırlı ölçüm; ★50 795, npm 1.0.0 2026-10-14) | D |
| **Türkçe büyük harf** | CSS `text-transform:uppercase` dil bilmeden `i→I`; **`lang="tr"`** + ya da JS `toLocaleUpperCase('tr-TR')` (`iğdır`→`İĞDIR`, `ışık`→`IŞIK`); `fitText` ölçümü de aynı metinle. `template-tiktok` bu hataya açık | yerel Node testi (D) |
| **Yazı tipi glifleri** | Türkçe ğ ş İ ç ö ü ⇒ `latin-ext` alt kümesi (Ğ/Ş/İ U+011E/015E/0130 ∈ latin-ext, ı U+0131 ∈ latin). `@remotion/google-fonts` `subsets` ile kontrol edildi: **UYGUN** Anton, Bangers, Luckiest Guy, Lilita One, Montserrat, Poppins, Bungee, Fredoka, Baloo 2, Bebas Neue, Oswald, Archivo Black, Titan One, Passion One, Chango, Righteous, Nunito, Barlow (Condensed), Lexend, Russo One, Staatliches; **UYGUN DEĞİL (yalnız latin)** Bowlby One, Permanent Marker, Boogaloo, Fugaz One, Comic Neue. Projedeki `@fontsource/barlow-condensed` için `latin-ext` dosyasını import et | `google-fonts/src/*.ts` (D) |
| Güvenli alan (Instagram) | Kaynaklar **ikincil** (SEO/araç siteleri) ve çelişkili. Reklam (Meta yönergesinden türetildiği söylenen): üst %14 (~270 px), alt %35 (~672 px), yanlar %6 (~65 px). Organik Reels: üst ~108, alt ~310–320, sol ~60, sağ ~84–120 px; orta güvenli bant ≈ 1080×1320–1420. Mevcut `Subtitle.tsx`: alt 340 px, sol 60, sağ 120 ⇒ organik için uygun; **reklam yerleşimine** gidecekse alt sınır 1248 px'e çekilmeli. Resmî Meta sayfası **X** — canlı bir Reel'de telefonda doğrula | K |
| Okunabilirlik | Kelime ekranda ≥ 6–8 kare (200–270 ms); sayfa başına ≤ 4–5 kelime / 2 satır; aktif kelime rengi + hafif ölçek (spring `damping:200, durationInFrames:5` — template-tiktok'un değeri); kontur `-webkit-text-stroke` + `paint-order:stroke`; arka plan için `@remotion/rounded-text-box`; vurgu için `@remotion/rough-notation` | D |
| Kinetik tipografi kütüphaneleri | `Remocn/remocn` (blur-reveal vb., MIT, ★1 606), `av/remotion-bits` (metin açılışları), `@remotion/animation-utils`, GSAP SplitText (GSAP "no charge" lisansı — metin X), `split-type` (★733, son push 2023-12, durağan), `splitting` (npm 1.1.0 2024-05). Harf bölme için Türkçe'de `Intl.Segmenter('tr')` (tarayıcı yerleşik) yeterli; kütüphane gerekmez | D/K |
| Emoji / ikon | `@remotion/animated-emoji` (Noto, **CC BY 4.0** atıf), Twemoji/Noto statik emoji font; Lottie ikonları §8 | D |
| Ses kapalı izleme | İlk 3 sn'de 2 satır "kanca" metni ekran dilinde sabit ("BU SOKAK SİLİNDİ") — CLAUDE.md §5 kuralı ile uyumlu | proje |

### 6.3 Hat tasarımı: ses → kelime zamanı → altyazı → sahne olayları

```
public/audio/narration/<id>.mp3  ──┐
senaryo satırı (metin + [[cue:x]])─┼─► 1 normalize ─► 2 hizala ─► 3 eşle+temizle ─► 4 sahne bütçesi ─► 5 üret ─► 6 doğrula
sahne tanımı (id, sabit/absorb)  ──┘     (spoken)      (words)      (display+cue)     (60.00 sn=1800 kare)  (JSON)
```
1. **Girdi doğrulama:** `ffprobe` süre, kanal, örnekleme; sessiz baş/son ölçümü (`silencedetect`/`silenceremove`); aşırı uzun sessizlikleri raporla. Alignment için 16 kHz mono wav kopyası (yerel yol).
2. **Normalizasyon (okunuş metni):** `normalizer-tr` (Apache-2.0, ★47, push 2026-10-15; Python wheel + Rust; `25 TL; 5 kg` → `yirmi beş Türk lirası; beş kilogram`; "orijinal kaynak aralıkları + yapılandırılmış tanılama") ile her **belirteç** ayrı normalize edilir: `display:"25"` → `spoken:["yirmi","beş"]`. Marka/kısaltma sözlüğü (`TERAS 7`→`teras yedi`, `TL`) için proje içi `speak-overrides.json`; aynı sözlük ElevenLabs *pronunciation dictionary*'ye de yüklenir. **Önemli:** ElevenLabs sesi sayıyı kendi normalizasyonuyla okur; hizalayıcıya verilen metin *sesin gerçekte söylediği* olmalı. Emin değilsen (a) sayıları senaryoda yazıyla yaz ya da (b) `applyTextNormalization:'off'` ile üretip kendi normalizasyonumuzu ver (yalnız API'yle üretimde).
3. **Hizalama (öncelik sırası):** A) ElevenLabs forced alignment; B) with-timestamps (varsa); C) yerel WhisperX `align` (tr wav2vec2, CC-BY-4.0) ya da Whisper large-v3 transkripti + dizilim hizalaması (Needleman–Wunsch, `tr` küçük harf+noktalama atılmış). Çıktı: `[{text,start,end,loss?}]`. Boş/boşluk-yalnız girdileri süz (`w.text.trim()`); bu davranış ElevenLabs'te **X** (SDK tipinden belli değil).
4. **Eşleme + temizleme:** `mapAligned` (kelime sayısı tutmazsa `ALIGN_COUNT_MISMATCH`), `sanitize` (monoton, ses süresine kırp, ≥40 ms). Kalite kapıları: ortalama `loss` eşiği (kalibre edilecek), kelime başına süre 40 ms–1,5 sn, kapsama (son kelime bitişi ≥ ses süresi − 400 ms), ardışık boşluk >1,2 sn uyarısı.
5. **Sahne bütçesi:** `fitScenes` — sahne süresi = ses + `lead` (varsayılan 0,25 sn) + `tail` (0,35 sn); fazla boşluk esnek sahnelere orantılı, kalanı `absorb:true` sahneye (örn. oylama kartı); taşma ⇒ önce kuyruk payları minimuma, sonra `OVERFLOW` hatası + seçenekler: sesten sessizlik kırp, `atempo ≤ 1.06`, senaryoyu kısalt. Toplam **tam 1800 kare** garantisi testli.
6. **Üretilen veri (tek doğruluk kaynağı, `episodes/<id>.timing.json`):** `scenes[{id,from,frames}]`, `narration[{id,file,from}]`, `captions` (kelime düzeyi `Caption[]`, ms, sahne ofsetli), `cues[{cue,frame}]`, `speech[{from,to}]` (ducking için kelime kümeleri). `schema.ts`'e `words` alanı eklenir; mevcut `captions:{from,to,text}` cümle yedeği olarak kalır.
7. **Remotion tarafı:** `Subtitle` kelime düzeyine geçer (`createTikTokStyleCaptions` → sayfa → aktif token); `speechLevel` mevcut cümle aralıkları yerine `speech[]` kullanır (kelime arası kısa boşluklarda müzik/ortam yükselmez ⇒ `gap<350 ms` birleştir); SFX `cue` karelerine oturur (sahne olayı = kelime başlangıcı − 2–4 kare önceden "anticipation" payı); "konuşma jesti" ses zarfından (§7.3).
8. **Doğrulama (`validate-episode` eklentisi):** toplam=1800; her `cue` kendi sahnesi içinde; her sahnenin ses dosyası var ve `sahne süresi ≥ ses süresi`; altyazı kutusu `pretext`/`fitText` ile sığıyor; kelime min süre; `loudnorm` ölçümü (§7.2); reklam öncesi lisans denetimi.

**Hata durumları:**
| Durum | Belirti | Davranış |
|---|---|---|
| Hizalayıcı kelime sayısı ≠ beklenen | `ALIGN_COUNT_MISMATCH` | Dizilim hizalaması (fuzzy) dene; olmazsa karakter-orantılı yedek zamanlama + uyarı; yine de render'ı **bloke et** (`--force-fallback` ile aç) |
| Ses dosyası yok | manifest'te yok | Mevcut davranış korunur (sessiz geç) ama `timing.json` üretilmez ⇒ sahne süresi senaryodan *tahmin* (kelime×0,36 sn) ve rapor "TAHMİNİ ZAMAN" |
| Sesin süresi sahneye sığmıyor | `OVERFLOW` | §5. adım seçenekleri; otomatik `atempo` yalnız kullanıcı onayıyla |
| Çok boşluk | `UNDERFILL` | `absorb` sahne ekle / `extraMax` artır |
| API hatası / hız sınırı | HTTP 4xx/5xx | Yeniden dene (üstel geri çekilme), sonuç `timing.json` olarak önbellekle (ses karması anahtar) — ses değişmedikçe API'ye tekrar gitme |
| Düşük güven (`loss` yüksek) | uyarı | O kelimenin altyazısını sayfa düzeyine düşür (kelime vurgusu kapat) |
| Ses sonunda kesilme/clipping | `ebur128` peak > −1 dBTP | Normalizasyon yeniden |
| Sayı/okunuş farkı | gösterilen "25" ↔ söylenen "yirmi beş" | 2. adımdaki belirteç-başına normalizasyon; sözlük override |

### 6.4 Test edilmiş iskelet (`sync-audio`, saf fonksiyonlar)
Yerelde Node 22.22 ile yazıldı ve `assert` testleri **geçti** (sayı açılımı, cue→kare, sanitize, `ALIGN_COUNT_MISMATCH`, `UNDERFILL`, `OVERFLOW`, `absorb`, toplam 1800). Aşağıdaki (okunabilirlik için sıkıştırılmış) sürüm raporun içinden çıkarılıp aynı test dosyasıyla yeniden çalıştırıldı ve geçti:

```js
// sync-audio.mjs — saf fonksiyonlar (API/ağ çağrısı yok)
export const FPS = 30;
export const TOTAL_FRAMES = 1800; // 60.00 sn * 30

// "Muhtar [[cue:kapi]] saat 09:30'da 25 TL aldı." -> görünen belirteçler + her birinin okunuş kelimeleri
export function parseLine(raw, normalizeToken) {
  const tokens = []; let pendingCue = null;
  for (const part of raw.trim().split(/\s+/)) {
    const m = part.match(/^\[\[cue:([\w-]+)\]\]$/);
    if (m) { pendingCue = m[1]; continue; }
    tokens.push({ display: part, spoken: normalizeToken(part), cue: pendingCue }); // spoken: string[]
    pendingCue = null;
  }
  return tokens;
}
export const spokenText = (tokens) => tokens.flatMap((t) => t.spoken).join(" ");

// aligned: [{text,start,end}] saniye (ElevenLabs forced-alignment / WhisperX biçimi)
export function mapAligned(tokens, aligned, { toleranceWords = 0 } = {}) {
  const need = tokens.reduce((n, t) => n + t.spoken.length, 0);
  if (Math.abs(aligned.length - need) > toleranceWords) {
    const err = new Error(`ALIGN_COUNT_MISMATCH: beklenen ${need}, gelen ${aligned.length}`); err.code = "ALIGN_COUNT_MISMATCH"; throw err;
  }
  let k = 0;
  return tokens.map((t) => {
    const first = aligned[k], last = aligned[k + t.spoken.length - 1]; k += t.spoken.length;
    return { ...t, startMs: Math.round(first.start * 1000), endMs: Math.round(last.end * 1000) };
  });
}
export function sanitize(words, audioMs) {            // monoton, ses süresini aşmayan, ≥40 ms
  let prevEnd = 0;
  return words.map((w) => {
    const startMs = Math.max(prevEnd, Math.min(w.startMs, audioMs));
    const endMs = Math.max(startMs + 40, Math.min(w.endMs, audioMs)); prevEnd = endMs;
    return { ...w, startMs, endMs };
  });
}
export const trUpper = (s) => s.toLocaleUpperCase("tr-TR");
export const toCaptions = (words, { offsetMs = 0, upper = false } = {}) =>   // @remotion/captions Caption[]
  words.map((w) => ({ text: " " + (upper ? trUpper(w.display) : w.display),   // başta boşluk ZORUNLU
    startMs: w.startMs + offsetMs, endMs: w.endMs + offsetMs,
    timestampMs: Math.round((w.startMs + w.endMs) / 2) + offsetMs, confidence: null }));
export const cueFrames = (words, sceneStartFrame, offsetMs = 0, fps = FPS) =>
  words.filter((w) => w.cue).map((w) => ({ cue: w.cue, frame: sceneStartFrame + Math.round(((w.startMs + offsetMs) / 1000) * fps) }));

// scenes: [{id, audioSec, lead=.25, tail=.35, minTail=.10, extraMax=1.5, fixedFrames?, absorb?}]
export function fitScenes(scenes, { fps = FPS, total = TOTAL_FRAMES } = {}) {
  const base = scenes.map((s) => {
    if (s.fixedFrames != null) return { ...s, frames: s.fixedFrames, flex: 0, min: s.fixedFrames };
    const lead = s.lead ?? 0.25, tail = s.tail ?? 0.35, minTail = s.minTail ?? 0.1, speech = Math.ceil(s.audioSec * fps);
    return { ...s, leadFrames: Math.round(lead * fps),
      frames: speech + Math.round(lead * fps) + Math.round(tail * fps),
      min: speech + Math.round(lead * fps) + Math.round(minTail * fps),
      flex: Math.round((s.extraMax ?? 1.5) * fps) };
  });
  const diff = total - base.reduce((n, s) => n + s.frames, 0);
  const report = { total, diffFrames: diff, actions: [] };
  if (diff > 0) {
    const cap = base.reduce((n, s) => n + s.flex, 0), absorber = base.find((s) => s.absorb);
    if (cap < diff && !absorber) { const e = new Error(`UNDERFILL: ${diff - cap} kare doldurulamadı`); e.code = "UNDERFILL"; throw e; }
    let left = Math.min(diff, cap);
    for (const s of base) { const add = Math.min(s.flex, Math.floor((left * s.flex) / Math.max(1, cap))); s.frames += add; s.flex -= add; }
    left = total - base.reduce((n, s) => n + s.frames, 0);
    if (left > 0 && absorber) { absorber.frames += left; report.actions.push(`absorber(${absorber.id}) +${left}`); left = 0; }
    for (let i = 0; left > 0 && i < 1e4 && base.some((x) => x.flex > 0); i++) { const s = base[i % base.length]; if (s.flex > 0) { s.frames++; s.flex--; left--; } }
  } else if (diff < 0) {
    let over = -diff;
    for (const s of base) { if (over <= 0) break; const cut = Math.min(over, Math.max(0, s.frames - s.min)); s.frames -= cut; over -= cut; }
    if (over > 0) { const e = new Error(`OVERFLOW: ${over} kare (${(over / fps).toFixed(2)} sn) sığmıyor`); e.code = "OVERFLOW"; e.over = over; throw e; }
  }
  let cursor = 0;
  const out = base.map((s) => { const r = { id: s.id, from: cursor, frames: s.frames, leadFrames: s.leadFrames ?? 0 }; cursor += s.frames; return r; });
  if (cursor !== total) { const e = new Error(`FIT_FAILED: ${cursor} != ${total}`); e.code = "FIT_FAILED"; throw e; }
  return { scenes: out, report };
}
```
Gerçek hat için eksikler (bilerek dışarıda): ElevenLabs çağrısı ve önbellek, `normalizer-tr` köprüsü (Python/Rust → JSON), fuzzy dizilim hizalaması, `ffprobe` süre okuma, `schema.ts` genişletmesi. Hepsi ağ/ikili bağımlılık gerektirdiğinden test edilmedi.

### 6.5 Remotion altyazı bileşeni iskeleti (kavramsal; çalıştırılmadı)
```tsx
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

const pages = (captions: Caption[]) => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 1000, breakOnSilenceAfterMilliseconds: 350 }).pages;

export const WordCaptions: React.FC<{ pages: ReturnType<typeof pages> }> = ({ pages }) => {
  const frame = useCurrentFrame(); const { fps, width } = useVideoConfig();
  const t = (frame / fps) * 1000;
  const page = pages.find((p) => t >= p.startMs && t < p.startMs + p.durationMs);
  if (!page) return null;
  const { fontSize } = fitText({ fontFamily: "Anton", text: page.text, withinWidth: width * 0.85 });
  const enter = spring({ frame: frame - Math.round((page.startMs / 1000) * fps), fps, config: { damping: 200 }, durationInFrames: 5 });
  return (
    <div lang="tr" style={{ whiteSpace: "pre", fontSize: Math.min(110, fontSize), fontFamily: "Anton", textTransform: "none",
      transform: `scale(${0.85 + 0.15 * enter})`, WebkitTextStroke: "14px #000", paintOrder: "stroke" }}>
      {page.tokens.map((tk, i) => (
        <span key={i} style={{ color: t >= tk.fromMs && t < tk.toMs ? "#FFD23F" : "#fff" }}>{tk.text}</span>
      ))}
    </div>
  );
};
// Büyük harf: metni toCaptions({upper:true}) ile ÖNCEDEN tr-TR'ye çevir; CSS uppercase kullanma.
```

## 7. Ses (TTS, STT, lip-sync, ses tasarımı, müzik)

### 7.1 TTS: Türkçe destek ve ticari kullanım
Birincil üretim ElevenLabs'te kalır. Bu tablo yedek/taslak/maliyet seçeneklerini gösterir. **Kalite karşılaştırmaları yazar-raporludur; ElevenLabs'in oyunculuğuna eşdeğerlik doğrulanmadı.**

| Model / araç | ★ · son commit | Lisans → **ticari?** | Türkçe | Not | Doğrulama |
|---|---|---|---|---|---|
| **ElevenLabs API** + `elevenlabs-js` (MIT, v2.73.0, 2026-10-15), `elevenlabs-python` (★3 144) | – | SDK MIT; **ses/plan şartları X** (elevenlabs.io erişilemedi) | ✓ | `with-timestamps`, `textToDialogue`, `textToSoundEffects`, forced alignment, pronunciation dictionary, `seed`, `previousText/nextText` | SDK D; hizmet şartları X |
| `elevenlabs/skills` (★482, MIT) | 2026-10-09 | MIT | – | Ajan becerileri: TTS, STT, müzik, SFX, voice-isolator, dubbing | D |
| `elevenlabs/elevenlabs-mcp` (★1 535) | 2026-08-20 | MIT | – | **ARŞİVLENMİŞ** | D |
| **VoxCPM2** `OpenBMB/VoxCPM` | ★39 364 · 2026-10-08 | **Apache-2.0 → ✓** (README: "ticari kullanıma hazır") | ✓ (30 dilde listeli) | 2B parametre, 48 kHz, ses tasarımı + klon. Yazar tablosu (Minimax-MLS-test): Türkçe WER **0,817** (ElevenLabs 0,699, Fish S2 0,870, Minimax 1,52), SIM **87,1** (ElevenLabs 59,6). GPU gerekir | D (README) |
| **Trendyol-TTS** (HF `Trendyol/Trendyol-TTS`) | HF ❤41 | **MIT → ✓** | ✓ (yalnız Türkçe) | VoxCPM2 + ~20 saat özel Türkçe verisiyle LoRA birleştirilmiş; "araştırma sürümü, üretim için değil"; `cfg_value=2.0, inference_timesteps=16`; `cfg 2.5` tepe seviyesi riskli | D (kart) |
| `AlicanKiraz0/Kizagan-TTS-v1.0` | HF ❤65 | Apache-2.0 → ✓ | ✓ | VoxCPM2 + LoRA, referans sesle; tek konuşmacı özel korpus; CUDA | D (kart) |
| **FreyaTTS-small** (`freyavoiceai/FreyaTTS` ★167 · 2026-08-03; HF `freyavoice/Freya-TTS`) | – | **Apache-2.0 → ✓** (büyük model ticari/kapalı) | ✓ (yalnız) | 183M, tek ses, klon yok, 48 kHz; RTX 4090 RTF 0,10; kendi WER %8,0 | D |
| **EMA Lightning** (HF `canberkkkkkk/ema-lightning`, `pip install ema-lightning`) | HF ❤414 | **Apache-2.0 → ✓** | ✓ | 8,6M parametre/34 MB, CPU'da çalışır, tek ses, duygu/klon yok, akış; kendi tablosunda WER %0,92 (Whisper large-v3 ile ölçüm, **anlaşılırlık ölçüsü; doğallık değil**) | D (kart), benchmark yazar-raporlu |
| `cloud0day3/antalia-mini` (Antalia-2 Mini) | HF ❤42 | Apache-2.0 → ✓ | ✓ | 7,6M parametre, CPU, ham metinde sayı/tarih/kısaltma normalizasyonu dahili, tek sentetik erkek sesi | D (kart) |
| `erdemtuna/normalizer-tr` | ★47 · 2026-10-15 | Apache-2.0 → ✓ | ✓ | Metin normalizasyonu (TTS öncesi) | D |
| **MOSS-TTS v1.5** `OpenMOSS/MOSS-TTS` | ★4 213 · 2026-09-06 | Apache-2.0 → ✓ | ✓ (`tr` listede) | Uzun form, çok konuşmacı, klon | D (kart dil tablosu) |
| **OmniVoice** `k2-fsa/OmniVoice` | ★14 592 · 2026-10-12 | Apache-2.0 → ✓ | ✓ (600+ dil; Türkçe 125 saat veri) | Sıfır-atış klon; "ses tasarımı yalnız zh/en eğitimli" | D (README) |
| **Chatterbox Multilingual V3** `resemble-ai/chatterbox` | ★26 961 · 2026-07-21 | **MIT → ✓** | ✓ (23+ dil içinde Türkçe) | 0,5B; her çıktıda **PerTh filigranı** (görünmez) | D |
| **Supertonic-3** `Supertone-Inc/supertonic` | ★13 771 · 2026-09-09 | Örnek kod MIT; **model OpenRAIL-M** (kullanım kısıtları; ticari serbest ama davranış sınırları) | ✓ (31 dil, `tr`) | ONNX CPU/GPU, hafif; README: "güncelleme/destek verilmeyecek" (arşiv duyurusu) | D (README) |
| **Fish Audio S2 Pro** `fishaudio/fish-speech` | ★33 163 · 2026-10-14 | **Fish Audio Community License (v1.0, 2026-10-13)**: ticari kullanım yalnız **yıllık gelir < 500 000 USD**; barındırılan hizmet yasak; müşteriye yalnız *çıktı ses* teslimi serbest | ✓ (`tr`; 80+ dil) | Satır içi `[duygu]` etiketleri | D (LICENSE + kart). Gelir eşiği aşılınca ayrı sözleşme |
| **Higgs TTS 3** HF `bosonai/higgs-tts-3-4b` | HF ❤806 | **Araştırma/ticari-olmayan lisans**; *Creator Use Grant*: yaratıcılar para kazanan içerik üretebilir, **atıf şart** ("Boson AI's Higgs Audio"), API/ürüne gömme/yeniden satış için ayrı lisans; izinsiz klon yasak | ✓ | `boson-ai/higgs-audio` (v2 kodu) ★8 371 Apache-2.0 | D (kart) |
| **IndexTTS2** `index-tts/index-tts` | ★24 498 · 2026-09-29 | bilibili Model Use License: >100 M MAU veya >1 milyar RMB gelir ⇒ ayrı lisans; başka yapay zekâ modelini iyileştirmek yasak | Türkçe **X** | | D (LICENSE), dil X |
| `Qwen3-TTS` | ★13 808 · 2026-03-17 | Apache-2.0 → ✓ | **✗** (10 dil: zh,en,ja,ko,de,fr,ru,pt,es,it) | | D |
| `hexgrad/kokoro` (Kokoro-82M) | ★9 326 · 2025-08-06 | Apache-2.0 → ✓ | **✗** (HF kartı ve README'de "turk" geçmiyor; listelenen kodlar İngilizce, İtalyanca, Japonca, Çince vb.) | | D |
| Orpheus `canopyai/Orpheus-TTS` | ★6 354 · 2025-12-05 | Apache-2.0 | Resmî çok dilli sürümde Türkçe **X** (`canopylabs/3b-tr-pretrain-research_release` erişilemedi) | | X |
| Dia `nari-labs/dia` | ★19 407 · 2025-11-19 | Apache-2.0 | ✗ (İngilizce) | | K |
| `microsoft/VibeVoice` | ★54 833 · 2026-10-08 | MIT | ✗ (en/zh) | | K |
| MeloTTS, StyleTTS2, Spark-TTS, OpenVoice, Bark | 7 673 / 6 350 / 10 982 / 37 890 / 39 271 | MIT/MIT/Apache/MIT/MIT | MeloTTS & StyleTTS2: ✗; Spark: zh/en; OpenVoice: ton rengi aktarımı (yeni TTS değil), son push 2025-04; Bark: son push 2024-08, Türkçe kartta **doğrulanamadı** | | K |
| **XTTS-v2** (coqui) `idiap/coqui-ai-TTS` fork ★2 337 | – | **CPML: "yalnızca ticari olmayan kullanım — model ve çıktıları"** ⇒ **✗ TİCARİ KAPALI** | ✓ (17 dil içinde tr) | Coqui kapalı; fork MPL-2.0 ama ağırlıklar CPML | D (model kartı + LICENSE.txt) |
| MMS-TTS Türkçe `facebook/mms-tts-tur` | – | **CC-BY-NC-4.0 ⇒ ✗** | ✓ | | D |
| **F5-TTS** `SWivid/F5-TTS` | ★15 409 · 2026-10-14 | kod MIT; **ağırlıklar CC-BY-NC-4.0 ⇒ ✗** | Taban model Türkçe'de WER %77,8 (EMA tablosu); `marduk-ra/F5-TTS-Turkish` de CC-BY-NC | | D |
| **Piper**: `OHF-Voice/piper1-gpl` (★5 883, **GPL-3.0**), `rhasspy/piper` (arşiv) | – | **`tr_TR-dfki-medium` verisi CC BY-NC-SA 4.0 ⇒ ✗** (Piper-voices'ta başka Türkçe ses bulunamadı) | tek ses | | D (MODEL_CARD) |
| NVIDIA `magpie_tts_multilingual_357m` | HF ❤231 | NVIDIA Open Model License | **✗** (ar,de,en,es,fr,hi,it,ja,ko,pt,vi,zh) | | D |
| `rany2/edge-tts` (★12 251, LGPL-3.0; `srt_composer.py` MIT) | – | Microsoft Edge'in **resmî olmayan** çevrimiçi uç noktası; hizmet şartı riski ⇒ ticari akışta **önerilmez** | ✓ (ses listesi çalışma anında) | Kelime sınır olayları verir | K |

**Klonlama etiği/lisansı:** (1) gerçek kişi sesi klonlama yok (CLAUDE.md "gerçek kişi yok"); izin belgesi olmayan klon yasak — Higgs lisansı da açıkça yasaklıyor. (2) Üretilen sesin yapay olduğu açıklaması (EMA kartı AB Yapay Zekâ Yasası'na atıf yapıyor — kart iddiası; hukuki görüş değil). (3) Chatterbox'ta çıktıya filigran gömülür (istenmiyorsa değil, bilinmeli). (4) ElevenLabs kütüphane sesleri/klonları için plan lisansı X: reklam öncesi şartları kontrol et.

### 7.2 Temizleme, normalizasyon, ducking (yerelde denenen komutlar — ffmpeg 6.1.1)
```bash
# 1) iki geçişli loudnorm (hedef: kısa video için -14 LUFS / -1.5 dBTP — Instagram hedefi resmî değil, ikincil kaynaklar çelişkili)
ffmpeg -i vo.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2> pass1.txt   # JSON'dan input_i/tp/lra/thresh/offset
ffmpeg -i vo.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$T:offset=$O:linear=true" -ar 48000 vo_n.wav
# 2) müzik ducking (konuşma yan zincir) — Remotion'da zaten volume callback ile yapılıyorsa şart değil
ffmpeg -i mus.wav -i vo_n.wav -filter_complex "[0:a][1:a]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400:makeup=1[d];[d][1:a]amix=inputs=2:duration=longest:normalize=0[m]" -map "[m]" mix.wav
# 3) son ölçüm (nihai mix)
ffmpeg -i mix.wav -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary     # I: -15.9 LUFS test sinyalinde okundu
# 4) 30 fps ses zarfı (konuşma jesti için) — 16 kHz'te 533 örnek/kare
ffmpeg -i vo_n.wav -af "aresample=16000,asetnsamples=n=533:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=rms.txt" -f null -   # 5 sn → 151 değer
```
Denenenler çalıştı: loudnorm 2. geçiş, sidechain+amix, ebur128 özeti (sentetik sinyal), RMS zarfı. Sessizlik tespiti: `silencedetect`, kırpma: `silenceremove`.

| Araç | ★ · son commit | Lisans | Not |
|---|---|---|---|
| `slhck/ffmpeg-normalize` | ★1 539 · 2026-10-05 | lisans metni bu oturumda okunamadı (X; PyPI'de MIT bilinir) | loudnorm sarmalayıcı |
| `jiaaro/pydub` | ★9 799 · 2026-03-19 | MIT | Basit mix/kesme |
| `Rikorose/DeepFilterNet` | ★4 829 · **2024-10-17** | MIT **veya** Apache-2.0 (README) | Gürültü bastırma; ElevenLabs çıktısında gereksiz, kullanıcı kendi ses kaydederse |
| `xiph/rnnoise` | ★5 897 · 2025-02-22 | BSD-3 | Hafif gürültü bastırma |
| `adefossez/demucs` | ★3 385 · 2026-08-31 | MIT | Kaynak ayırma; `facebookresearch/demucs` **arşivli** |
| ElevenLabs *voice isolator* | – | API | `elevenlabs/skills`'te beceri var |

### 7.3 Lip-sync / konuşma animasyonu
| Seçenek | Lisans | Uyum | Karar |
|---|---|---|---|
| **Ses zarfı → jest** (yukarıdaki RMS dizisi, 30 fps, JSON) | – | **✓** | Önerilen: `speak = smoothstep(rms)`; gövde `scaleY += 0.02*speak`, baş `rotZ = noise*speak`, kelime başlangıç karesinde küçük "vurgu" (kelime zamanından). Tamamen deterministik |
| `DanielSWolf/rhubarb-lip-sync` (★2 632 · 2026-06-16) | MIT (LICENSE.md okundu; bağımlılıklar MIT/BSD) | △ | Ağız şekilleri (JSON/TSV/XML); `pocketSphinx` **yalnız İngilizce**, Türkçe için `--recognizer phonetic` (README); yüzsüz karakterlerde gereksiz |
| Wav2Lip, SadTalker, MuseTalk | lisans yok/other | ✗ | Fotogerçekçi yüz üretir; CLAUDE.md "dudak senkronu KULLANMA" |
| `@remotion/media-utils` `visualizeAudio` | MIT | △ | Çalışma anında FFT; önceden hesaplanmış JSON daha ucuz ve parçalı render'da güvenli |

### 7.4 Ses tasarımı / SFX / müzik: kaynaklar ve lisans
| Kaynak | Lisans / ticari | Not | Doğrulama |
|---|---|---|---|
| **Kenney** (kenney.nl) | CC0 ✓ | `@remotion/sfx` içindeki `page-turn`, `ui-switch` Kenney, "Creative Commons 0" (docs) | D (docs) |
| **Freesound** + `MTG/freesound-python` (★157, MIT, 2025-12-23) | Ses başına CC0 / CC-BY / CC-BY-NC; yalnız **CC0 filtresi** ile ticari güvenli; API v2 belirteçle arama, orijinal indirme OAuth2 (bilgi) | İndirme betiği yazılacaksa lisans alanı kaydedilmeli | Client D; API şartları X |
| `@remotion/sfx` | Paket MIT; **7 ses CC0** (whip, whoosh, page-turn, ui-switch, mouse-click, shutter-modern, shutter-old). **25 ses "açık bir lisansla yayımlanmadı, yaygın kullanımı nedeniyle muhtemelen sorun olmaz; sorumluluk kabul edilmez"** (ding, bruh, vine-boom, windows-xp-error, fah, spongebob-fail, omg-hell-nah, price-is-right-fail, romance-meme, bone-crack, anime-wow, yippee, loading-lag, wilhelm-scream, mac-quack, skedaddle, snapchat-notification, nelly-ahh, sanctuary-guardian-what, minecraft-hurt, oh-my-god-vine, illuminati-confirmed, dramatic-boomer, triggered, record-scratch) ⇒ **reklam/ticari yayında kullanma** | `docs/sfx/*.mdx` "Attribution" bölümleri tek tek okundu | D |
| **BBC Sound Effects (RemArc)** | **Ticari kullanım ücretsiz lisans kapsamında değil** (kişisel/eğitim/araştırma; ticari için ücretli lisans); haber/blog özetleri, BBC'nin resmî metni okunamadı | Lisans defterindeki BBC girdileri reklam öncesi çıkarılmalı | K (ikincil) |
| Mixkit SFX/müzik, incompetech (Kevin MacLeod), Pixabay | Mixkit/Pixabay: kendi lisansları (ticari ok, bağımsız yeniden dağıtım yok — bilgi); incompetech **CC BY 3.0 ⇒ açıklamada atıf şart** | Siteler erişilemedi | X |
| **ElevenLabs Sound Effects** (`textToSoundEffects.convert({text})`) | Plan lisansı X | Eksik SFX için hızlı üretim | SDK D, şartlar X |
| Prosedürel: `KilledByAPixel/ZzFX` (MIT ★802), `chr15m/jsfxr` (Unlicense ★456), `Tonejs/Tone.js` (MIT ★14 757, npm 15.1.22 2025-04), `ircam-ismm/node-web-audio-api` (BSD-3 ★265, npm 2.2.0 2026-08), `ffmpeg lavfi` | ✓ (kendi ürettiğin ses) | `node-web-audio-api` ile Node'da `OfflineAudioContext` render → WAV (Tone'u tarayıcısız çalıştırmak için); mevcut `scripts/sfx.ts` sentezi bu yolda | D (meta/npm); Tone+Node entegrasyonu denenmedi |
| **Müzik üretimi** | | | |
| `ace-step/ACE-Step-1.5` | ★13 415 · 2026-10-11 · **MIT** | Model kartı: "ticari kullanıma hazır; lisanslı + telifsiz veriyle eğitildi" — **yazar iddiası**, bağımsız doğrulanmadı | K |
| `facebookresearch/audiocraft` MusicGen | kod MIT; **ağırlıklar CC-BY-NC-4.0 ⇒ ✗** | | D (HF etiketi) |
| `Stability-AI/stable-audio-tools` / Stable Audio Open | kod MIT; model "other" (Stability Community License); kart bu oturumda okunamadı ⇒ gelir eşiği vb. **X** | | X |
| `multimodal-art-projection/YuE` | ★10 790 · Apache-2.0 | Şarkı üretimi, ağır GPU | K |

`visualizeAudio`: 5.0'da varsayılan `optimizeFor:"speed"` olacak (D); ses görselleştirme bu proje için gerekli değil.

### 7.5 ElevenLabs toplu üretim notları (kullanıcı şu an elle yapıyor; ileride)
`previousText/nextText` ve `previousRequestIds` ile sahneler arası sürekliliği korumak; `seed` (belirlenimcilik garanti değil); `pronunciationDictionaryLocators` (en çok 3) ile ürün adları; `with-timestamps` ile hizalamayı atlamak; yanıt `audioBase64` + `alignment`/`normalizedAlignment`. Çıktıyı karma anahtarıyla önbellekle (aynı metin+ses+ayar ⇒ yeniden çağrı yok).

## 8. Geçişler ve 2D efektler

**Önkoşul (tekrar):** `@remotion/transitions` HTML-in-canvas sunumları ve `@remotion/effects`, Chromium ≥157 (Remotion varsayılan tarayıcısı, 4.0.534+) ister; mevcut Playwright 141'de çalışmaz. Aşağıdaki "CSS/SVG" çözümleri tarayıcıdan bağımsızdır.

| Konu | Aday | ★ / sürüm · lisans | Uyum | Maliyet / not | Değer | Doğrulama |
|---|---|---|---|---|---|---|
| Sahne geçişi (basit) | `@remotion/transitions`: `fade, slide, wipe, flip, clockWipe, iris, pushCut, none` + `springTiming/linearTiming`; sese bağlama için `addSound` sarmalayıcı (docs) | 4.0.535 · Remotion License | ✓ | CSS tabanlı, ucuz; `TransitionSeries` iki sahneyi **aynı anda** render eder ⇒ 3B sahneler çakışma süresince 2× maliyet (çıkarım; ölçülmeli) | 3 | D |
| Sahne geçişi (shader) | `zoomBlur, dreamyZoom, filmBurn, linearBlur, zoomInOut, dissolve, ripple, crosswarp, crossZoom, swap, blurSlide, bookFlip`; özel: `makeHtmlInCanvasPresentation()` | aynı | △ | Chromium ≥157 + yazılım WebGL'de tam kare shader; `cube()` **ücretli** | 3 | D |
| gl-transitions | `gl-transitions/gl-transitions` ★2 151 (lisans "other"), npm `gl-transitions` 1.75.0 (2026-10-14) **MIT**; `gre/gl-transitions` **arşivli** (taşındı) | karma | △ | Remotion'un shader sunumları bunlardan türemiş; ayrıca eklemeye gerek yok. Tek tek shader lisansı X | 2 | D/X |
| ffmpeg `xfade` | ffmpeg 6.1.1 yerel: **57 geçiş** (`fade, wipeleft, slideleft, circleopen, pixelize, dissolve, radial, fadeblack, fadewhite…`) | LGPL/GPL | ✓ | İki 2 sn klip + `xfade=pixelize` 2,5 sn (yerel); sahne klibi hattında (§4.3) geçiş üst üste bindirme gerektirir | 3 | D (yerel) |
| Mevcut siyah/glitch geçişler | `transitions.ts`, `glitch.ts` | proje | ✓ | CSS tabanlı, ucuz — **koru** | – | – |
| Glitch / VHS / film greni / tarama çizgisi | `@remotion/effects`: `chromatic-aberration, scanlines, noise, white-noise, tv-signal-off, tear, wave, vignette, halftone, duotone, lut, light-leak, light-trail, glow, thermal-vision, pixel-dissolve…` (60+) | 4.0.535 | △ | GPU shader; yazılım GL maliyeti **ölçülmeli**; `effectsOutputSize` (4.0.536) düşük çözünürlükte çalıştırır. Düşük maliyet alternatifi: SVG `feTurbulence` (kare başına seed), CSS `mix-blend-mode` ile önceden üretilmiş grain PNG/video döngüsü | 3 | D (liste) |
| Hız çizgileri | Remotion **Speed Lines** elementi (4.0.531; ayrıntı X) ya da SVG: `@remotion/shapes`/`paths` ile ışınsal çizgiler, `noise` ile kalınlık | – | ✓ | Ucuz | 3 | K |
| Çizgi roman "POW/BAM" | Yazı tipi **Bangers** (latin-ext ✓) + `Star` (`@remotion/shapes`) + `rounded-text-box`/`rough-notation` | MIT/OFL | ✓ | Spring ile patlama ölçeği, 3–4 kare sarsıntı | 3 | D |
| Ekran sarsıntısı (2B) | `noise3D` ile `translate` + kısa sönüm | MIT | ✓ | Bedava | 4 | D |
| Split-screen / PiP | CSS `grid` + `<Sequence>`; video için `@remotion/media` `<Video>` (`cropLeft/Right/Top/Bottom`) | – | ✓ | 3B iki kez çizmek yerine plaka/klip | 2 | D |
| Oylama kartı, sayaç, ilerleme çubuğu | `spring/interpolate`; sayı biçimi `n.toLocaleString('tr-TR')` (18.407); yüzde için `@remotion/shapes` `Pie`; çubuk için `@remotion/paths` `evolvePath` | MIT | ✓ | Ucuz | 4 | D |
| Lottie | `@remotion/lottie` (Remotion License); `airbnb/lottie-web` ★32 237 (MIT, son push 2025-09-01); `LottieFiles/dotlottie-web` ★913 (MIT, 2026-10-14); `lottie-react` (MIT) | – | △ | Vektör, ucuz. Ücretsiz Lottie varlıklarının lisansı (LottieFiles) **X** — tek tek kontrol | 2 | D (kod), X (varlık) |
| Rive | `@remotion/rive`; `rive-app/rive-wasm` ★995 (MIT) | – | △ | WASM; `.riv` varlık lisansı X | 1 | D |
| React geçiş/animasyon kütüphaneleri | `motion` ★34 064 (MIT, v14.3.0), `anime.js` ★73 631 (MIT, 4.5.0), GSAP (npm "no charge" lisansı, metin X) | – | ✗ / △ | Gerçek zaman tabanlıdır ⇒ Remotion'da kareyle sürülmeli (`@remotion/gsap` bunu yapar); doğrudan kullanma | 1 | D/K |
| `@remotion/animation-utils` | `makeTransform`, `scale`, `translateY` | – | ✓ | Zaten template-tiktok kullanıyor | 3 | D |

---

## 9. İçerik otomasyonu

| Konu | Araç / yaklaşım | Durum | Not |
|---|---|---|---|
| Senaryo → video veri modeli | Mevcut `episodeSchema` (zod) + `scripts/validate-*`; Remotion `inputProps`, `calculateMetadata` (süre/props asenkron), `dataset-render` kılavuzu | ✓ (D) | Yeni alanlar: `timing.json` (§6.3), `cues`, `speech[]`. `calculateMetadata` yerine sabit 1800 kare kalsın (ürün kuralı) |
| JSON→video başka çerçeve | `ybouane/VideoFlow` (Apache-2.0 ★151): taşınabilir JSON, 25+ hazır giriş/çıkış | △ | Şema fikri için okunabilir; geçiş önerilmez |
| Toplu üretim / kuyruk | `renderMedia` döngüsü + sahne önbelleği (§4.3); tek `bundle()` + tek `openBrowser()` yeniden kullanımı (`puppeteerInstance`) | ✓ | Her bölüm için `out/cache` anahtarları |
| Küçük resim / kapak | Remotion `renderStill` (zaten var: `stills`), `sharp` (Apache-2.0 ★32 762) ile kırpma/yeniden boyutlandırma; `vercel/satori` (MPL-2.0 ★14 072, npm 0.60.0) HTML/CSS→SVG kapak şablonu (Türkçe için font ver) | ✓ | Reels kapağı için API alanı (`cover_url`, `thumb_offset`) **X** |
| Yayın (bu aşamada yok) | **Instagram API (Graph/Instagram Login)**: `POST /{ig-user-id}/media` `media_type=REELS` + `video_url` (herkese açık URL) **veya** resumable upload (`rupload.facebook.com`), sonra `media_publish`; yayımlanan Reel `media_type=VIDEO` döner, ayırt etmek için `media_product_type`; kota için `content_publishing_limit` uç noktası (Meta sayfaları, arama özeti) | K | "Günde 100 yayın", "en fazla 90 sn" ve H.264-yalnız iddiaları üçüncü taraf blogdan; **resmî sayfada doğrulanamadı (X)**. Yorumları okuma izinleri/uygulama incelemesi gereği ayrıca kontrol edilmeli |
| Zamanlama araçları | `gitroomhq/postiz-app` (★37 231, **AGPL-3.0**), `inovector/mixpost` (★3 818, MIT, son push 2026-03-16), `n8n-io/n8n` (★207 490, "fair-code") | △ | Resmî API üstünde çalışırlar; kendi servisinizi AGPL ile birleştirmeyin |
| Gayriresmî Instagram | `subzeroid/instagrapi` (★6 959) — özel API | **✗** | Hesap kısıtlama/ToS riski; kullanma |
| A/B kanca testi | Instagram'da yerel A/B video testi aracı yok (X); öneri: bölüm 1–3 sn kancası için 2 varyant, farklı günlerde yayımlayıp Insights'taki 3 sn/tutma metriklerini el ile karşılaştırma; web testleri için `GrowthBook` (lisans "other") | K | İstatistiksel güç düşük (tek hesap) |
| Oy sayımı | Mevcut `tally-votes.ts` + CSV; yorum çekme resmî API ile sonraya | ✓ | CLAUDE.md kuralı: sahte katılım yok |

## 10. Türkçe TTS/STT karar tablosu

| İhtiyaç | 1. tercih | 2. tercih | Yedek | Kaçın | Gerekçe |
|---|---|---|---|---|---|
| **Üretim sesi** (yayın) | ElevenLabs (mevcut akış) | – | Fish S2 Pro (gelir < 500 000 $/yıl) ya da Higgs TTS 3 (yaratıcı hibesi, atıf) — yalnız **kalite dinlenerek** | XTTS-v2, MMS-TTS, F5-TTS, Piper-dfki (hepsi ticari kapalı) | Lisans + Türkçe |
| **Taslak / dinleme sesi** (GPU yok) | EMA Lightning (8,6 M, CPU ok, Apache-2.0) | Antalia-2 Mini (7,6 M, Apache-2.0) | Supertonic-3 (OpenRAIL-M, ONNX) | Qwen3-TTS, Kokoro (Türkçe yok) | Zamanlama/sahne denemeleri için hızlı; yapay ses ayırt edilebilir |
| **Taslak / yedek ses** (GPU var) | VoxCPM2 (Apache-2.0; Türkçe WER 0,817 yazar-raporlu) | Trendyol-TTS (MIT) / Kizagan-TTS (Apache-2.0) | FreyaTTS-small (Apache-2.0), MOSS-TTS v1.5 (Apache-2.0), OmniVoice (Apache-2.0), Chatterbox MTL V3 (MIT, filigran) | IndexTTS2 (Türkçe X, lisans eşiği), Orpheus/Dia/VibeVoice (Türkçe yok/X) | Ticari izinli, Türkçe belgeli |
| **Kelime zamanı — metin biliniyor** | ElevenLabs forced alignment | `convertWithTimestamps` (API ile üretilirse) | WhisperX `align` + `mpoyraz/wav2vec2-xls-r-300m-cv7-turkish` (CC-BY-4.0) | `ctc-forced-aligner` varsayılan MMS modeli (lisans X, NC kökenli), aeneas (AGPL) | Metin kesin ⇒ ASR hatası yok |
| **STT — metin yok** | ElevenLabs Scribe v2 (+ `@remotion/elevenlabs`) | Whisper large-v3 (faster-whisper / whisper.cpp) | Türkçe ince ayarlı Whisper (kalite ölçülmeli) | Parakeet v3 / Canary v2 (Türkçe yok), `stable-ts` (arşiv) | Ölçülmüş Türkçe WER yok (X); kendi test setiyle kıyas |
| **Metin normalizasyonu** | `normalizer-tr` | proje içi sözlük + ElevenLabs pronunciation dictionary | `num2words` (LGPL-2.1, ★969, `lang_TR.py` var; son push 2025-05) | – | Sayı/tarih/para/kısaltma okunuşu |
| **Altyazı büyük harf** | `toLocaleUpperCase('tr-TR')` | `lang="tr"` | – | CSS `uppercase` (dil belirtmeden) | `i→İ`, `ı→I` |

**Kendi Türkçe test seti önerisi (karar öncesi 30 dk):** 10 cümle: sayı (25, 1.250.000 TL), saat (09:30'da), tarih, kısaltma ("TERAS 7", "WC", "TL"), ünlem/soru tonu, yabancı kelime ("baklava"), uzun eklemeli kelime ("Çekoslovakyalılaştıramadıklarımızdan"), harf okuması (A/B). Her aday için: WER (Whisper large-v3 ile), dinleme (1–5), kelime zamanı hatası (elle 20 kelime), RTF.

---

## 11. Bakılıp elenen projeler ve nedenleri

| Proje | Neden elendi |
|---|---|
| HyperFrames, fframes, Revideo, Motion Canvas, VideoFlow, Diffusion Studio, Etro, Editly | Mevcut Remotion+R3F 3B hattını taşımazlar; yazılım-GL darboğazını çözmezler; fframes'te Three.js yok, Revideo/Motion Canvas 2B; Etro GPL-3.0; Editly/Motion Canvas yayını durağan |
| `calesthio/OpenMontage` (AGPL-3.0), `0xsline/OpenChatCut` (AGPL-3.0), `postiz-app` (AGPL-3.0), `whisper-timestamped` (AGPL-3.0), `aeneas` (AGPL-3.0) | AGPL: koda dâhil etme/servis etme yükümlülükleri; ihtiyaç yok |
| `@theatre/r3f` | Peer `@react-three/fiber ^8.13.6` (projede 9.4.0); son sürüm 2024-05; studio AGPL |
| `drei CameraShake` | `useFrame` + gerçek zaman saati; Remotion'da deterministik değil |
| `<CameraMotionBlur>` (3B üstünde) | ×samples render maliyeti |
| `@remotion/light-leaks`, `@remotion/starburst`, `@remotion/webcodecs`, `@remotion/media-parser` | Sidebar'da "deprecated"; `@remotion/effects` kullan |
| `@remotion/whisper-web/-webgpu`, `@remotion/web-renderer`, `@remotion/video-matting` | Tarayıcı içi senaryolar; sunucu akışımızda yok |
| `@remotion/sfx` meme sesleri (25/32) | Açık lisans yok; ticari risk |
| BBC SFX (RemArc) | Ticari kullanım dışı |
| XTTS-v2 / MMS-TTS / F5-TTS ağırlıkları / Piper `tr_TR-dfki` / MusicGen ağırlıkları | CPML / CC-BY-NC / CC-BY-NC / CC BY-NC-SA / CC-BY-NC |
| Kokoro, Qwen3-TTS, Dia, VibeVoice, MeloTTS, StyleTTS2, Spark-TTS, NVIDIA Magpie | Türkçe desteği yok (ya da belgelenmemiş) |
| Orpheus (Türkçe sürüm), IndexTTS2 (Türkçe) | Doğrulanamadı; IndexTTS2 lisansı da kısıtlı |
| `fluent-ffmpeg` (arşiv), `ffmpeg-kit` (arşiv), `stable-ts` (arşiv), `rhasspy/piper` (arşiv), `facebookresearch/demucs` (arşiv), `elevenlabs-mcp` (arşiv), `gre/gl-transitions` (arşiv), `template-next-*` (arşiv) | Arşivlenmiş |
| `timecut` / `timesnap` | 2022–2024'ten beri durağan; Remotion zaten deterministik |
| `puppeteer-capture` | Güncel (npm 1.58.0, 2026-08) ama kare belirlenimciliği sorunumuz değil, GL hızını artırmaz |
| Wav2Lip / SadTalker / MuseTalk | Fotogerçekçi yüz; proje kuralı "dudak senkronu yok"; lisans belirsiz/other |
| `instagrapi` | Özel API; hesap riski |
| `edge-tts` | Resmî olmayan uç nokta, ticari riski |
| `rubberband-web` (GPL-2.0+, 2022), `satelllte/remotion-audio-visualizer` (GPL-3.0) | Copyleft/eski |
| Topic'teki ~60 "Claude/Codex becerisi" deposu (video-shotcraft, anything2explainer, motion-skills, editor-pro-max, vanta, …) | Bu projenin hattında kod bağımlılığı olmaz; fikir kaynağı olarak göz atıldı. Tüm topic (1 266 repo) sayfa sayfa taranmadı (ilk ~100) |
| `thecmdrunner/remotion-render-alternatives`, `ahgsql/remotion-lottie` | Terk edilmiş (2023 / 2021) |

---

## 12. DOĞRULANAMAYANLAR (açık liste)

1. ElevenLabs: forced alignment'ın **Türkçe** desteği, fiyatı ve kesin limitleri (sayfa özeti 3 GB/10 saat/675 000 karakter; SDK yorumu <1 GB); Scribe v2 Türkçe WER'i; TTS/ses lisans şartları (ticari kullanım, ses kütüphanesi/klon); `words[]` içinde boşluk/noktalama girdisi olup olmadığı. Hepsi `elevenlabs.io` erişilemediği için.
2. Remotion: `remotion.dev` sayfaları (gl-options, lambda fiyat/hız, Elements kütüphanesi, `compare-ssr`) erişilemedi; docs GitHub `main` kaynağından okundu (4.0.536'ya doğru; bazı özellikler npm 4.0.535'te olmayabilir). Remotion Chromium 157'sinin bu konteynerde `swangle` ile `ThreeCanvas`'ı sorunsuz çalıştırdığı **denenmedi**.
3. Kare başı hız kazançlarının **hiçbiri ölçülmedi** (kod çalıştırma yasağı + kısıt): §4.1'deki "T" etiketli sayılar tahmindir.
4. Instagram: güvenli bölge pikselleri, −14 LUFS hedefi, Reels API limitleri (100/24 sa, 90 sn, H.264) — resmî Meta sayfaları okunamadı/ikincil kaynak.
5. BBC RemArc resmî metni; Mixkit/Pixabay/incompetech/Freesound/LottieFiles/GSAP lisans metinleri (siteler erişilemedi).
6. Stable Audio Open lisansı (kart kapılı); ACE-Step "ticari hazır/lisanslı veri" iddiası yalnız model kartında.
7. `camera-controls` README'sinin durumsuz/durumlu davranışı (okunamadı); Theatre.js `sequence.position` ile kare sürme (ikincil kaynak).
8. Orpheus Türkçe araştırma sürümü, IndexTTS2 Türkçe, Bark Türkçe kalitesi, Montreal Forced Aligner Türkçe modeli.
9. `ctc-forced-aligner` varsayılan MMS hizalama modelinin lisansı (HF isteği 401).
10. EMA/Freya/Trendyol karşılaştırmaları yazar raporlarıdır (WER = ASR ile ölçülmüş anlaşılırlık; doğallık/oyunculuk değil); FreyaTTS'in kendi kartı WER %8,0, EMA'nın tablosu aynı model için %12,02 veriyor (tutarsız).
11. `gl-transitions` tek tek shader lisansları; `animated-emoji` dışı Lottie/Rive varlık lisansları.
12. GitHub topic `remotion` taramasında 1 266 repodan ilk ~100'ü incelendi; her biri için son commit/yıldız `ungh.cc` ile alındı (bazı eski değerler topic sayfasından farklı olabilir: ör. `lifeprompt-team/remotion-scenes` 61↔5).

---

## 13. Kaynaklar (URL)

**Remotion — belge kaynakları (GitHub `main`)**
- https://github.com/remotion-dev/remotion (LICENSE.md, `packages/docs/docs/*.mdx`, `packages/renderer/src/options/gl.tsx`, `open-browser.ts`, `get-chrome-download-url.ts`)
- https://github.com/remotion-dev/remotion/releases (4.0.528–4.0.535)
- https://github.com/orgs/remotion-dev/repositories ; https://github.com/topics/remotion?o=desc&s=stars
- Docs dosyaları: `distributed-rendering.mdx`, `parallel-encoding.mdx`, `shared-memory-capture.mdx`, `webgl.mdx`, `performance.mdx`, `gpu.mdx`, `miscellaneous/cloud-gpu.mdx`, `captions/*`, `elevenlabs/*`, `sfx/*`, `transitions/*`, `motion-blur/*`, `effects/index.mdx`, `remotion/html-in-canvas.mdx`, `5-0-migration.mdx`, `telemetry.mdx`, `client-side-rendering/limitations.mdx`, `vercel-sandbox.mdx`, `cloudflare-containers.mdx`
- npm: https://registry.npmjs.org/@remotion/captions (ve diğer `@remotion/*`)
- https://remotion.media/chromium-headless-shell-linux-x64-157.0.8080.0.zip (HEAD 200)

**Karşılaştırma / alternatifler:** https://github.com/heygen-com/hyperframes · https://github.com/dmtrKovalenko/fframes · https://github.com/midrender/revideo · https://github.com/motion-canvas/motion-canvas · https://github.com/ybouane/VideoFlow · https://github.com/Vanilagy/mediabunny · https://github.com/diffusion-studio/core · https://github.com/mifi/editly · https://github.com/Zulko/moviepy · https://github.com/alexey-pelykh/puppeteer-capture · https://github.com/calesthio/OpenMontage

**Kamera / tipografi / animasyon:** https://github.com/yomotsu/camera-controls · https://github.com/pmndrs/drei (CameraShake.tsx) · https://github.com/theatre-js/theatre · https://github.com/chenglou/pretext · https://github.com/Remocn/remocn · https://github.com/av/remotion-bits · https://github.com/gl-transitions/gl-transitions · https://github.com/airbnb/lottie-web · https://github.com/LottieFiles/dotlottie-web · https://github.com/rive-app/rive-wasm

**STT / hizalama:** https://github.com/openai/whisper · https://github.com/ggml-org/whisper.cpp · https://github.com/SYSTRAN/faster-whisper · https://github.com/m-bain/whisperX · https://github.com/MahmoudAshraf97/ctc-forced-aligner · https://github.com/linto-ai/whisper-timestamped · https://github.com/jianfch/stable-ts · https://github.com/readbeyond/aeneas · https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner · https://huggingface.co/mpoyraz/wav2vec2-xls-r-300m-cv7-turkish · https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3

**ElevenLabs:** https://github.com/elevenlabs/elevenlabs-js (reference.md, `src/api/types/ForcedAlignment*.ts`, `BodyTextToSpeechFullWithTimestamps.ts`) · https://github.com/elevenlabs/elevenlabs-python · https://github.com/elevenlabs/skills · https://github.com/elevenlabs/elevenlabs-mcp

**TTS / Türkçe:** https://github.com/OpenBMB/VoxCPM · https://huggingface.co/Trendyol/Trendyol-TTS · https://huggingface.co/AlicanKiraz0/Kizagan-TTS-v1.0 · https://huggingface.co/freyavoice/Freya-TTS · https://github.com/freyavoiceai/FreyaTTS · https://huggingface.co/canberkkkkkk/ema-lightning · https://huggingface.co/cloud0day3/antalia-mini · https://github.com/erdemtuna/normalizer-tr · https://github.com/OpenMOSS/MOSS-TTS · https://github.com/k2-fsa/OmniVoice · https://github.com/resemble-ai/chatterbox · https://github.com/Supertone-Inc/supertonic · https://github.com/fishaudio/fish-speech (LICENSE) · https://huggingface.co/bosonai/higgs-tts-3-4b · https://github.com/index-tts/index-tts (LICENSE) · https://github.com/QwenLM/Qwen3-TTS · https://github.com/hexgrad/kokoro · https://huggingface.co/coqui/XTTS-v2 · https://huggingface.co/facebook/mms-tts-tur · https://huggingface.co/SWivid/F5-TTS · https://huggingface.co/rhasspy/piper-voices (tr_TR/dfki MODEL_CARD) · https://github.com/OHF-Voice/piper1-gpl · https://github.com/rany2/edge-tts · https://huggingface.co/nvidia/magpie_tts_multilingual_357m

**Ses / SFX / müzik:** https://github.com/DanielSWolf/rhubarb-lip-sync (LICENSE.md, README.adoc) · https://github.com/MTG/freesound-python · https://github.com/KilledByAPixel/ZzFX · https://github.com/chr15m/jsfxr · https://github.com/Tonejs/Tone.js · https://github.com/ircam-ismm/node-web-audio-api · https://github.com/ace-step/ACE-Step-1.5 · https://huggingface.co/facebook/musicgen-small · https://github.com/Rikorose/DeepFilterNet · https://github.com/xiph/rnnoise · https://github.com/adefossez/demucs · https://github.com/slhck/ffmpeg-normalize

**Otomasyon:** https://github.com/gitroomhq/postiz-app · https://github.com/inovector/mixpost · https://github.com/n8n-io/n8n · https://github.com/subzeroid/instagrapi · https://github.com/vercel/satori · https://github.com/lovell/sharp · https://developers.facebook.com/docs/instagram-platform/content-publishing

**Liste/awesome taraması:** https://github.com/krzemienski/awesome-video · https://github.com/transitive-bullshit/awesome-ffmpeg · https://github.com/sindresorhus/awesome-whisper · https://github.com/ishandutta2007/Awesome-Text-to-Speech · https://github.com/terkelg/awesome-creative-coding · https://github.com/zhuyansen/awesome-claude-video-skills · https://github.com/frankxai/awesome-motion-design-agent-skills

**Instagram güvenli bölge / loudness (ikincil, çelişkili):** https://www.firstpier.com/resources/instagram-ad-safe-zones · https://www.outfy.com/blog/instagram-safe-zone/ · https://openclip.app/learn/audio-normalization
