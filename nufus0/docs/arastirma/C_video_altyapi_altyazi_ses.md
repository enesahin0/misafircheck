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
5. **Ses lisans temizliği (reklam öncesi şart):** `@remotion/sfx` içindeki 30 sesten yalnız **7'si CC0** (whip, whoosh, page-turn, ui-switch, mouse-click, shutter-modern, shutter-old); 23'ü "açık lisansı yok, muhtemelen sorun olmaz" notlu internet meme sesleri → ticari yayında kullanma. Lisans defterindeki **BBC SFX = RemArc (ticari kullanım dışı)** → reklam öncesi çıkar.

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
| `sfx` | MIT (paket); sesler tek tek | 30 SFX URL'si (`remotion.media`), -3 dB tepe | △ | D | 2 | **Yalnız 7 CC0** (§7.5) |
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
| `github-unwrapped` / `-2022` / `trailer` | 1 327 / 1 3xx / 1 1xx | 2026-07 / 2023 / 2024 | – | Büyük üretim örnekleri | 1 |
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
| `alexey-pelykh/puppeteer-capture` | 22 (npm 3 221/hf) | 2026-10-12 (npm 1.58.0 2026-08-07) | MIT | `HeadlessExperimental.beginFrame` ile deterministik kare yakalama | ✗ | O | 1 | D. Remotion zaten deterministik; yazılım-GL'yi hızlandırmaz |
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
(doldurulacak)

## 7. Ses (TTS, STT, lip-sync, ses tasarımı, müzik)
(doldurulacak)

## 8. Geçişler ve 2D efektler
(doldurulacak)

## 9. İçerik otomasyonu
(doldurulacak)

## 10. Türkçe TTS/STT karar tablosu
(doldurulacak)

## 11. Bakılıp elenenler
(doldurulacak)

## 12. Doğrulanamayanlar
(doldurulacak)

## 13. Kaynaklar
(doldurulacak)
