# Araştırma B — 3D görüntü kalitesi: render, post-processing, shader, ışık/gölge, efekt, hava durumu, malzeme, performans, low-poly dünya üretimi

> Tarih: 2026-10-15 · Hedef yığın: Remotion 4.0.535 + React 19 + three 0.180 + @react-three/fiber 9.4 + @remotion/three (ThreeCanvas, `frameloop="never"`), ortografik izometrik kamera, 1080x1920 / 30 fps / 60 sn, yazılım WebGL.
> Kural seti: her şey deterministik ve kare-tabanlı (`useCurrentFrame()`), `useFrame`/rAF/gerçek zaman/kontrolsüz rastgelelik yok.

---

## 0. Yöntem ve doğrulama dürüstlüğü (önce bunu oku)

- Bu ortamda `api.github.com` ve `github.com` (curl) engelli; GitHub MCP kullanılmadı. Bunun yerine: **ungh.cc** (yıldız, son push), **repos.ecosyste.ms** (lisans, arşiv durumu), **registry.npmjs.org** (sürüm, tarih, `peerDependencies`), `raw.githubusercontent.com` ve `git clone --depth 1` (README/kaynak okuma) kullanıldı. Yıldız sayıları 15 Ekim 2026 itibarıyla ±%1 doğrulukta (bazı depolarda ecosyste.ms önbelleği ungh'tan birkaç gün geride; tabloda ungh/ecosyste hangisi varsa o). "Son commit" sütunu = `pushed_at` tarihi.
- İndirilen **hiçbir** üçüncü taraf kodu çalıştırılmadı (yalnızca okundu). Ölçümler, projedeki **three 0.180'in kendi `examples/jsm` passes/shader'ları** ve benim yazdığım sentetik sahne ile yapıldı (pmndrs/postprocessing, N8AO vb. çalıştırılmadı; onlar için maliyet "TAHMİN" diye işaretli).
- "Doğrulandı" = sayfadan/kaynaktan/ölçümden doğrudan görüldü. "Kısmen" = bir kısmı görüldü. "DOĞRULANAMADI" = erişilemedi/bakılamadı.
- Web arama sonuçları üçüncü taraf özet olduğu için, onlara dayanan satırlar "arama özeti" diye etiketlendi.

### 0.1 Ölçüm düzeneği (tekrarlanabilir)

Sentetik izometrik mahalle: ~570 mesh (~290 draw call), `MeshStandardMaterial flatShading`, hemisphere + directional, ortografik kamera 38° / 45°, 1080x1920, pixelRatio 1. Chromium 141 headless-shell (`/opt/pw-browsers`), Remotion'un `openBrowser` fonksiyonu ile `gl:"swangle"`. Her yapılandırma 9–15 kare, medyan + min; ayrıca **round-robin (araya girmeli)** koşu (set 4) çünkü bu makinede koşular arası ±%30–50 sürüklenme var (4 çekirdek, paylaşımlı). Her kare sonunda `readPixels` ile GPU işi zorlanır. Kod: `docs/arastirma/B_ek_benchmark/` (bench.ts, runbench.mts, runcdp.mjs).

> Mutlak süreler bu makineye özgü; **oranlar** önemli. Gerçek Remotion karesi (≈0.5 sn) = GL işi + React + JPEG ekran görüntüsü; aşağıdaki süreler yalnızca GL kısmıdır.

---

## 1. YÖNETİCİ ÖZETİ

**Tek cümle:** En büyük kazanç bir kütüphane değil, **render arka ucu**: Aynı Chromium'u Xvfb + tam Chromium + `gl:"angle"` ile Mesa **llvmpipe** üzerinde koşturmak, SwiftShader'a göre bu sahnede **4–6 kat** hızlı (ölçüldü) ve bit-bit deterministik (ölçüldü); bu, GTAO/gerçek gölge/bloom gibi "pahalı" şeyleri bile bütçeye sokar.

| # | Karar | Madde | Gerekçe (ölçüm/kanıt) |
|---|---|---|---|
| 1 | **HEMEN EKLE** | llvmpipe render hattı (Xvfb + `chrome-for-testing` modu + `gl:"angle"` + `LIBGL_ALWAYS_SOFTWARE=1`) | Sahne 118 ms → 24 ms; tüm post-processing ~5× ucuz; 5 kez tekrar + `LP_NUM_THREADS=1/2/varsayılan` aynı piksel hash'i. Tüm bölümü tek arka uçla render et (SwiftShader ile llvmpipe pikseli farklı). |
| 2 | **HEMEN EKLE** | **Tek geçişli birleşik "minyatür" son-işlem**: tilt-shift bandı + doygunluk/kontrast + vinyet + (isteğe bağlı) kâğıt/grain; UnsignedByte RT, MSAA yok | SwiftShader: +60 ms (%45), llvmpipe: +12 ms. Three'nin hazır 2 geçişli TiltShift'i +200 ms (3×) — birleşiği tercih et. |
| 3 | **HEMEN EKLE** | Sahte temas gölgesi/AO: önceden pişirilmiş "blob" decal'ler + köşe-rengi AO + (kalıp) tek lightmap dokusu | ~300 decal: SwiftShader +34 ms, llvmpipe +1 ms; GTAO ise SwiftShader +1.8 sn (%1500) |
| 4 | **HEMEN EKLE** | İnce **ters-kabuk (inverted-hull) kontur** (drei `<Outlines>` / three `OutlineEffect`) yalnız karakter/prop/ön plan | draw call 2×, ölçüm: SwiftShader +%12 (160 vs 132), llvmpipe +%30 (30 vs 23) — küçük mutlak değer |
| 5 | **HEMEN EKLE** | Analitik (kare→konum kapalı formül) parçacıklar: kar/yağmur/yaprak/kıvılcım; hazır parçacık kütüphanesi **kullanma** | 2000 instanced quad +22 ms, 1500 çizgi ≈ 0, 5 k–50 k Points SwiftShader +10–90 ms, llvmpipe ≤ +7 ms. Kütüphaneler durumlu (stateful) ve `Math.random`'lı |
| 6 | **DENE** | Gerçek güneş gölgesi (1024 PCF, sıkı frustum) yalnız llvmpipe ile | SwiftShader'da +120 ms (×2), llvmpipe'te +15 ms |
| 7 | **DENE** | N8AO / GTAO (yalnız llvmpipe, `halfRes`), "painterly" Kuwahara (yarım çözünürlük) | llvmpipe: GTAO +360 ms, Kuwahara-lite tam çözünürlük +69 ms / yarım +2 ms. N8AO `performance.now()` kullanır → sarmalayıcı şart |
| 8 | **DENE** | `@react-three/postprocessing@3.0.4` + `postprocessing@6.37.8–6.38.x` (R3F 9.4 ve three 0.180 ile uyumlu) | 3.2.0 R3F ≥ 9.7 ister; `EffectComposer` varsayılan `multisampling=4` → 0 yap (+%100–200 maliyet) |
| 9 | **UZAK DUR** | SSGI/TRAA (realism-effects), AccumulativeShadows (temporal), drei Sparkles/Stars (Math.random + saat), three.quarks/three-nebula (durumlu simülasyon), WebGPU/TSL (bu ortamda), SSAO/SAO/Bokeh (yazılım WebGL'de 6–15×), lamina (arşivli) | bkz. bölüm 9 |
| 10 | **KARAR TABLOSU** | Blender (Cycles CPU) yalnız kapak/hero still, AO/lightmap/simülasyon pişirme için; tüm 1800 kare için değil | bölüm 6 |

### Minyatür/diorama hissini en çok artıracak ilk 5 şey (sıralı)

1. **Tilt-shift bandı + yükseltilmiş doygunluk/kontrast** (tek geçiş). Ortografik kamerada derinlik-bazlı DOF "perspektif ipucu" vermediği için ekran-uzayı bant bulanıklığı doğru yoldur; maket etkisinin 1 numaralı ipucudur.
2. **Zemine oturtma:** yumuşak temas gölgeleri/AO (pişirilmiş blob'lar + köşe AO), sıcak güneş + soğuk gölge rengi.
3. **Renk derecesi + hafif vinyet + çok ince kâğıt/grain dokusu** (aynı birleşik geçişte): "oyuncak/boyalı" his.
4. **İnce, sıcak-kahve kontur çizgisi** (ters kabuk) karakter ve proplarda: mobilde okunurluk + oyuncak estetiği.
5. **Atmosferik derinlik ve "canlı detay":** gradyan gökyüzü + sis, zemine kayan bulut gölgesi (çarpan doku), küçük analitik animasyonlar (baca dumanı, bayrak, yapraklar).

---

## 2. Ölçüm sonuçları (SwiftShader vs llvmpipe)

1080x1920, aynı sahne, medyan (min) ms/kare, yalnız GL kısmı. SwiftShader = projenin şimdiki `swangle`; llvmpipe = Xvfb + tam Chromium 141 + `gl:"angle"`, `ANGLE (Mesa, llvmpipe (LLVM 20.1.2 256 bits), OpenGL 4.5)`.

### 2.1 Sahne / render ayarları

| Yapılandırma | SwiftShader | llvmpipe | Not |
|---|---|---|---|
| Referans: doğrudan render, MSAA yok (≈290 draw call) | **118 (103)** | **24 (19)** | |
| `antialias:true` (MSAA 4×) | 146 (127) | 52 (45) | llvmpipe'te göreli maliyet yüksek |
| Yarım çözünürlük 540x960 | 38 (31) | 10 (8) | maliyet ≈ piksel sayısı |
| Gerçek güneş gölgesi 1024 PCF | 235 (199) | 39 (37) | +%100 / +%60 |
| Gerçek güneş gölgesi 2048 PCF | 256 (212) | 46 (40) | |
| Geometri birleştirme (malzeme başına; 290→10 draw call) | 97 (89) | 18 (17) | −%18…−%25 |
| Tek InstancedMesh (2 draw call) | 98 (86) | 18 (17) | |
| Malzeme: Standard / Lambert / Toon / Phong / Basic | 118 / 124 / 126 / 218* / 77* | — | *gürültülü; fark küçük, Basic en ucuz |
| Sis + ACES ton eşleme (renderer içinde) | ≈ referans | 20 (18) | bedava |

**Sonuç 1:** Darboğaz **piksel (fragment) işleme**, draw call değil. Draw call'ı 290→2'ye indirmek yalnız ~%20 kazandırır; çözünürlüğü yarıya indirmek ~%68 kazandırır. Shadow map küçültmek çok az yardımcı olur (512 ≈ 1024).

### 2.2 Post-processing (UnsignedByte RT, three 0.180 `examples/jsm`, araya girmeli koşu)

| Efekt | SwiftShader | llvmpipe | SwiftShader'a göre not |
|---|---|---|---|
| Referans: doğrudan render | 132 (108) | 22 (18) | |
| **Birleşik tek geçiş (tilt-shift 9-tap + vinyet + doygunluk)** | **192 (142)** | **34 (27)** | +60 / +12 |
| Aynısı HalfFloat RT ile | 286 (183) | 49 (41) | HalfFloat RT SwiftShader'da +95 ms |
| `OutputPass` (UB / HF) | 167 / 205 | 34 / 37 | |
| three H+V TiltShift (2 geçiş) | 334 (262) | 62 (53) | birleşikten ~2–3× pahalı |
| Vignette (1 geçiş) | 183 (108)* | 27 (22) | *gürültülü |
| FilmPass (grain) | 178 (118) | 30 (26) | |
| 3D LUT (LUTPass 16³) | 208 (137) | 33 (31) | |
| FXAA | 245 (188) | 38 (32) | |
| SMAA (3 geçiş) | 495 (327) | 73 (68) | |
| UnrealBloom (+Output) | 412 (278) | 79 (64) | |
| OutlinePass (100 mesh) | 593 (414) | 117 (98) | uzak dur; ters kabuk çok daha ucuz |
| **GTAO** (+Output) | **2535 (1753)** | **384 (345)** | SwiftShader'da imkânsız |
| SAOPass / SSAOPass (set 1) | 1287 / 1434 | 256 / 260 | |
| BokehPass (DOF) | 938 (687) | 182 (168) | |
| F2: birleşik + GTAO + bloom | 2429 | 477 | |

### 2.3 Diğer teknikler (tek, sakin koşu; referans 132 / 23)

| Teknik | SwiftShader | llvmpipe |
|---|---|---|
| pmndrs-tarzı tilt-shift: 1/4 çözünürlükte ayrık H+V blur + kompozit (özel kod) | 140 | 34 |
| Kuwahara-lite (4 sektör, r=3) tam çözünürlük | 633 | 92 |
| Kuwahara-lite yarım çözünürlük (540x960) | 179 | 24 |
| Normal-tabanlı kenar çizgisi (2. sahne çizimi + Sobel) | 186 | 45 |
| Ters kabuk kontur (her mesh BackSide kopyası) | 160 | 30 |
| ~300 yarı saydam blob decal (temas gölgesi) | 166 | 24 |
| 1 büyük çarpan dokulu zemin (lightmap benzeri) | 147 | 27 |
| 1500 çizgi (yağmur) | 101 | 20 |
| 2000 instanced quad (kar/yaprak) | 154 | 21 |
| Points 5 k / 50 k | 126–189 / 145–207 | 22 / 29 |
| 40 büyük additive glow sprite | 177–200 | 29 |

### 2.4 Determinizm testi (ölçüldü)

Tam kare (1080x1920) FNV-1a hash'i: doğrudan ve birleşik zincir; aynı sayfada 5 tekrar ve ters sıra, ayrı süreçlerde 2 koşu:
- SwiftShader: tüm hash'ler birebir aynı (`8db9f785`, `b3c33554`). 
- llvmpipe: tüm hash'ler birebir aynı (`34d949f4`, `4b78e999`), `LP_NUM_THREADS=1`, `2`, varsayılan fark etmedi.
- **SwiftShader ≠ llvmpipe** (farklı hash): bir bölümün tamamı tek arka uçta render edilmeli. Farklı CPU (AVX2 vs AVX-512) üzerinde birebirlik **DOĞRULANAMADI** — bir bölümü tek makinede üret.

### 2.5 WebGPU yoklaması (ölçüldü, kısmen)
Tam Chromium + `--enable-unsafe-webgpu --enable-features=Vulkan --use-angle=vulkan --use-vulkan=swiftshader --use-webgpu-adapter=swiftshader --disable-vulkan-surface --enable-unsafe-swiftshader`: `navigator.gpu` var, adapter `swiftshader`, three `WebGPURenderer` WebGPU arka ucunu seçti. **Bayraksız:** `requestAdapter()` = null → three WebGL2 arka ucuna düşer. Render süresi ölçümüm geçersiz (`renderAsync` GPU bitişini beklemiyor) → hız **DOĞRULANAMADI**. Remotion 4.0.535 `chromiumOptions` içinde serbest `args` alanı görmedim (yalnız `gl` ön ayarları); dolayısıyla bu bayrakları Remotion üzerinden vermek şu an mümkün görünmüyor.

---

## 3. Alan tabloları

Sütunlar: Repo | ★ | son commit (`pushed_at`) | lisans | ne yapar | yazılım-WebGL maliyeti (SwiftShader/llvmpipe) + determinizm (✓/△/✗) | entegrasyon zorluğu | değer (1–5) | doğrulama.
Maliyet: düşük = < +%50 sahne süresi, orta = +%50–300, yüksek = > +%300 (SwiftShader'a göre, §2 ölçümleri).

### 3.1 Post-processing

| Repo | ★ | Son | Lisans | Ne yapar | Maliyet + determinizm | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| [mrdoob/three.js](https://github.com/mrdoob/three.js) `examples/jsm/postprocessing` | 116 375 | 2026-10-14 | MIT | EffectComposer, Bloom, GTAO, SAO, SSAO, SMAA, FXAA, LUT, Film, Outline, Bokeh, TiltShift shader'ları. Yerel 0.180'de mevcut (`OutlineEffect` da `examples/jsm/effects`'te) | §2 ölçüldü; ✓ (Film/Noise hariç: `time` uniform'u kare ile ayarla) | düşük (projede hazır) | 5 | Doğrulandı (ölçüm) |
| [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | 2 874 | 2026-10-05 | Zlib | EffectPass çok efekti **tek shader**'da birleştirir; TiltShiftEffect, LUT3D, Vignette, ToneMapping, SMAA, Outline, DOF, GodRays, SSAO, Pixelation… npm 6.39.5, peer `three >=0.168 <0.187` (0.180 ✓); 7.0 beta var | birleşik mantık ölçümüme göre düşük–orta (tahmin: §2.2 "birleşik" ≈ +60/+12 ms). ✓ **ama** `EffectPass.render` içinde `material.time += deltaTime*timeScale` → NoiseEffect/ShockWave/Water/Glitch gerçek zamana bağlı: `timeScale=0` yap, `time`'ı kare/fps'ten yaz | orta | 5 | Doğrulandı (kaynak okundu, ölçülmedi) |
| [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) | 1 399 | 2026-10-10 | MIT | R3F sarmalayıcı. `<EffectComposer>` `useFrame` ile `composer.render(delta)` çağırır; `ThreeCanvas`→`advance()` bunu tetikler. **Yeni efektler (main'de):** Kuwahara, Halftone, Linocut, Ramp, Sharpness, Water, LensFlare, TiltShift/TiltShift2, N8AO, LUT… npm **3.2.0 R3F ≥ 9.7 ister**; 3.0.4 R3F ^9.0 (projede 9.4.0) ile uyumlu | `multisampling` varsayılan **4** (ölçüm: MSAA'lı composer RT SwiftShader'da +%100–140) → 0. `frameBufferType` varsayılan HalfFloat (SwiftShader +95 ms) → UnsignedByte. `delta` gerçek zamanlı → zamanlı efektlerde ✗ (aşağıda yama) | düşük–orta | 5 | Doğrulandı (kaynak okundu) |
| [N8python/n8ao](https://github.com/N8python/n8ao) | 502 | 2026-08-10 | CC0-1.0 (GitHub LICENSE; **npm ISC** — uyuşmazlık) | Temporal-kararlı SSAO/AO, `halfRes`, `aoSamples`, `denoiseSamples`, N8AOPostPass (pmndrs ile) | tahmin: SAO–GTAO arası (SwiftShader 1.2–2.5 sn, llvmpipe 0.25–0.4 sn; `halfRes` ~/3). **✗→△:** kaynak `time = performance.now()/1000` ve bir `frame` sayacı (`accumulate`) kullanıyor → `composer.render` çevresinde `performance.now`'ı kareye sabitleyen geçici yama + `accumulate:false` gerekir | orta | 3 | Doğrulandı (kaynak), ölçülmedi |
| [0beqz/realism-effects](https://github.com/0beqz/realism-effects) | 1 554 | 2024-02-04 | MIT | SSGI, hareket bulanıklığı, TRAA | yüksek; temporal ✗ | yüksek | 1 | Elendi (bkz. §9) |
| [gkjohnson/three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer) | 1 912 | 2026-10-12 | MIT | GPU yol izleme (progressive) | çok yüksek; progressive ✗; npm peer `three >=0.185` | — | 1 | Elendi |
| [UstymUkhman/color-grading](https://github.com/UstymUkhman/color-grading) | 13 | 2026-10-13 | WTFPL | WebGL renk derecelendirme demosu | — (LUT zaten pmndrs/three'de) | — | 1 | Elendi |
| [pmndrs/react-three-lightmap](https://github.com/pmndrs/react-three-lightmap) | 157 | 2026-10-11 | MIT | Tarayıcı içi lightmap/AO pişirici (R3F) | pişirme yazılımda yavaş; sonuç statik doku ✓ (bir kez, hazırlık adımında). npm paketi `@react-three/lightmap` 0.0.8 (2022) eski | yüksek | 2 | Kısmen |

**Efekt bazında kısa karar (SwiftShader / llvmpipe, kare-tabanlı kullanım):**

| Efekt | Maliyet | Kare-tabanlı ✓/△/✗ | Öneri |
|---|---|---|---|
| Tilt-shift / minyatür | birleşik tek geçiş: düşük (+60 / +12 ms); three 2-geçiş orta | ✓ (statik uniform; `focus`/`band` kareden animasyonlanabilir) | **Ekle** |
| Bloom/glow | orta (+280 / +55 ms) | ✓ | additive sprite yeterli; llvmpipe ile hafif bloom denenebilir |
| SSAO/SAO | yüksek (×10) | ✓ (three SAO/SSAO sabit çekirdek) | Uzak dur; pişirilmiş AO kullan |
| GTAO / N8AO | yüksek (SwiftShader ×15–20; llvmpipe +0.4 sn) | GTAO ✓ (noise sabit, ölçüldü hash aynı); N8AO △ | yalnız llvmpipe, isteğe bağlı |
| Outline (OutlinePass) | yüksek | ✓ | yerine ters kabuk |
| Vinyet | düşük (birleşikte bedava) | ✓ | **Ekle** |
| Renk derecesi/LUT | düşük (birleşikte bedava; ayrı LUT +50 / +10) | ✓ | **Ekle** (LUT3D tek pass) |
| Ton eşleme | bedava (renderer içinde) / `ToneMappingEffect` (uyarlamalı sürüm gerçek zamanlı ✗) | ACES/AgX/Neutral ✓; **Adaptive** ✗ | sabit ACES/Neutral |
| Film grain | düşük (+45 / +8) | △ (`time` kareye bağla) | ince, isteğe bağlı |
| Kromatik sapma | düşük (birleşikte) | ✓ | kullanma (temiz maket hissine ters) |
| Pikselleştirme | düşük | ✓ | stil dışı |
| AA: SMAA / FXAA / MSAA | SMAA yüksek (+360 / +70), FXAA orta (+110 / +16), MSAA 4× düşük–orta (+28 / +28) | ✓ | llvmpipe'te MSAA veya FXAA; SwiftShader'da gerekirse render %75 + FXAA |

### 3.2 Toon / cel / stilize shader / çizgi

| Repo | ★ | Son | Lisans | Ne yapar | Maliyet + determinizm | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| [pmndrs/drei](https://github.com/pmndrs/drei) `<Outlines>` | 9 941 | 2026-10-05 | MIT | Ters kabuk kontur (mesh/skinnedMesh/instancedMesh), kalınlık, açı | ölçüm (eşdeğer): SwiftShader +%12, llvmpipe +%30 (mutlak +7 ms); statik ✓ | düşük | 4 | Doğrulandı (kaynak + ölçüm) |
| three.js `OutlineEffect` (`examples/jsm/effects`) | (three) | — | MIT | Malzeme başına ters kabuk geçişi, MeshToon uyumlu | düşük–orta; ✓ | düşük | 3 | Doğrulandı (dosya yerel) |
| [FarazzShaikh/THREE-CustomShaderMaterial](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) | 1 345 | 2025-10-12 | MIT | MeshStandard/Toon vb. üstüne kendi vertex/fragment kodun (rim, gradyan, rüzgâr) | shader maliyetin kadar; zamanı `uniforms.uTime={frame/fps}` ile ver ✓. npm 6.4.0, peer three ≥0.159, R3F ≥8 ✓ | düşük | 4 | Doğrulandı (npm) |
| [pmndrs/lamina](https://github.com/pmndrs/lamina) | 1 108 | 2025-06-22 | MIT | katmanlı malzeme | **arşivli** | — | 1 | Elendi |
| [FarazzShaikh/glNoise](https://github.com/FarazzShaikh/glNoise) | 253 | 2025-06-17 | MIT | GLSL noise fonksiyonları | düşük ✓ | düşük | 3 | Doğrulandı |
| [patriciogonzalezvivo/lygia](https://github.com/patriciogonzalezvivo/lygia) | 3 455 | 2026-09-14 | "other" (**özel/ikili lisans; ticari kullanım öncesi oku**) | GLSL/WGSL fonksiyon kütüphanesi | yok (kod parçası) | orta | 2 | Kısmen (lisans metni okunamadı) |
| [mochiya-labs/three-liltoon](https://github.com/mochiya-labs/three-liltoon) | 32 | 2026-10-15 | MIT | lilToon (VRM karakter) shader'ı | orta; ✓ | orta | 2 | Doğrulandı (metadata) |
| [Kenton-GMI/sakuragaoka-station](https://github.com/Kenton-GMI/sakuragaoka-station) | 102 | 2026-09-25 | **belirtilmemiş** (tüm haklar saklı varsay) | Düz three.js, tamamen prosedürel cel-shaded kasaba: toon rampa, ekran-uzayı renk-duyarlı kontur, mavi-mor gölge, bloom, light leak, **otomatik statik batching (vertex-color malzeme birleştirme + texture atlas)**, düşen taç yaprakları | referans okuma (kopyalama yok) | — | 4 (fikir) | Doğrulandı (README) |
| [brunosimon/folio-2025](https://github.com/brunosimon/folio-2025) | 1 943 | 2026-04-07 | MIT | low-poly stilize portfolyo dünyası (referans) | ölçülmedi | — | 3 (ilham) | Kısmen (yalnız metadata) |
| Kuwahara "painterly" | — | — | — | `react-postprocessing/src/effects/Kuwahara.tsx` (anizotropik Kuwahara; kaynak: Kyprianidis + Maxime Heckel) | benim lite sürümüm: SwiftShader tam çöz. +500 ms, yarım çöz. +47 ms; llvmpipe +69 / +1 ms; ✓ | orta | 3 | Doğrulandı (kaynak+ölçüm) |
| Kâğıt/gouache/akvarel | — | — | — | Hazır paket yok; birleşik son geçişte "çarpan kâğıt dokusu + hafif kenar kararması" (canvas ile üretilmiş sabit doku, +1 texture örneği) | ≈ bedava ✓ | düşük | 4 | Tasarım önerisi (DOĞRULANAMADI: hazır repo) |
| Susurrus (Codrops) akvarel/Kuwahara R3F makalesi | — | 2025 | — | R3F + Kuwahara geçişi vaka çalışması | — | — | 2 | Arama özeti (sayfa 403, okunamadı) |

### 3.3 Işık ve gölge

| Repo / teknik | ★ | Son | Lisans | Ne yapar | Maliyet + determinizm | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| drei `ContactShadows` | (drei) | — | MIT | Zemin altından derinlik RT'si + blur; `frames` prop'u | 1 ekstra 512² sahne çizimi + 2 blur (tahmin: SwiftShader +20–40 ms). `frames={Infinity}` her `advance`'te yeniden çizer: durumsuz ✓; `frames={1}` mount başına bir kez (her sekmede aynı sahne durumu şartı) △ | düşük | 3 | Kaynak okundu |
| drei `AccumulativeShadows`/`RandomizedLight` | (drei) | — | MIT | Çok kareli biriken yumuşak gölge, `temporal` | durumlu birikim ✗ (Remotion sekmeleri sıra dışı render eder). Yalnız hazırlıkta bir kez pişirip dokuya kaydedersen ✓ | orta | 2 | Kaynak okundu |
| drei `BakeShadows` | (drei) | — | MIT | Gölge haritasını bir kez render | △ (sekme başına bir kez; sahne o ana kadar sabitse) | düşük | 2 | Dosya var, ayrıntı okunmadı |
| Blob decal'ler (özel) | — | — | — | Radyal gradyanlı çarpan/alfa quad'lar | ölçüm: SwiftShader +34, llvmpipe +1; ✓ | düşük | 5 | Ölçüldü |
| Gerçek güneş gölgesi | — | — | — | `DirectionalLight.castShadow`, 1024 PCF, sıkı frustum | SwiftShader +120 ms, llvmpipe +15 ms; ✓ | düşük | 4 (llvmpipe ile) | Ölçüldü |
| Hemisphere + güneş + sıcak/soğuk | — | — | — | Zaten kullanılıyor | bedava | — | — | — |
| Environment/HDRI (drei) | (drei) | — | MIT | PMREM IBL | tek seferlik derleme; ✓. Düz-gölgeli maket için gerekmez | düşük | 2 | — |
| Volumetric/god-ray | — | — | — | pmndrs `GodRaysEffect` (radyal blur, ~60 örnek) | tahmin: yüksek; ✓. Yerine additive koni sprite/ince "ışık çubuğu" mesh | düşük | 2 | Tahmin |
| Pencere iç ışığı | — | — | — | Emissive pencere dokusu + küçük additive glow (zaten var) | ölçüm: 40 glow sprite +0…+70 ms | düşük | 4 | Ölçüldü (sprite) |
| Güneş konumu/gün döngüsü | [mourner/suncalc](https://github.com/mourner/suncalc) 3 495★, 2026-10-05, BSD-2 | | | Gerçek gök mekaniği | ✓ ama gerekmez; ön ayarlar yeter | düşük | 1 | Doğrulandı |
| Sky/Stars | [jeromeetienne/threex.daynight](https://github.com/jeromeetienne/threex.daynight) 34★, 2020 (eski) | | MIT | gün-gece | eski | — | 1 | Elendi |
| [takram-design-engineering/three-geospatial](https://github.com/takram-design-engineering/three-geospatial) | 1 738 | 2026-05-27 | MIT | Fiziksel atmosfer, bulut, gölge (R3F+postprocessing) — npm `@takram/three-atmosphere` 0.19.1, `-clouds` 0.7.6, peer three ≥0.170, R3F ≥9.0.4 | ağır LUT ön hesabı + volumetrik; yüksek; hedef stil dışı | yüksek | 1 | Kısmen (npm) |
| drei `Stars`, `Sparkles` | | | MIT | | **✗**: yerleşim `Math.random`, hareket `state.clock` | — | 1 | Kaynak okundu |
| drei `Cloud` | | | MIT | `seed` prop'u var; ama `config.rotation += delta*…` birikimli, `state.clock` | △ (`speed=0`, seed ver; animasyon için özel bileşen) | düşük | 3 | Kaynak okundu |
| three `Sky` / `SkyMesh` | (three) | | MIT | Preetham gökyüzü | statik ✓ düşük | düşük | 2 | Dosya yerel |

### 3.4 Atmosfer, hava, parçacık

| Repo | ★ | Son | Lisans | Ne yapar | Maliyet + determinizm | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| [Alchemist0823/three.quarks](https://github.com/Alchemist0823/three.quarks) | 1 041–1 053 | 2026-05-21 | MIT | Parçacık/VFX; BatchedRenderer; editör | durumlu simülasyon (`update(dt)`), kaynakta `Math.random` (ParticleSystem.ts, MeshSurfaceEmitter.ts) → rastgele-erişimli kareye uymaz ✗. **npm 0.17.x peer three ≥0.182 (0.180'e uymaz); 0.16.0 uyar** | orta | 2 | Doğrulandı (kaynak grep + npm) |
| [creativelifeform/three-nebula](https://github.com/creativelifeform/three-nebula) | 1 236 | 2026-10-03 | MIT | Parçacık motoru, JSON konfig | durumlu ✗; "determinizm desteği" iddiası **DOĞRULANAMADI** | orta | 2 | Kısmen |
| [NewKrok/three-particles](https://github.com/NewKrok/three-particles) | 45 | 2026-07-09 | MIT | parçacık sistemi | peer three ^0.182 ✗; durumlu | — | 1 | Elendi |
| [hmans/three-vfx](https://github.com/hmans/three-vfx) | 567 | 2026-02-27 | belirtilmemiş | GPU VFX (yarım kalmış, "üretime uygun değil") | — | — | 1 | Elendi (arama özeti) |
| [mustache-dev/Three-VFX](https://github.com/mustache-dev/Three-VFX) | 148 | 2026-02-24 | MIT | WebGPU parçacık | WebGPU-only ✗ | — | 1 | Elendi |
| [fand/vfx-js](https://github.com/fand/vfx-js) | 1 153 | 2026-09-10 | MIT | DOM öğesi efektleri | alakasız | — | 1 | Elendi |
| [Token-Gremlin/natural-disasters](https://github.com/Token-Gremlin/natural-disasters) | 286 | 2026-09-01 | MIT | Prosedürel okyanus + aşırı hava (WebGL2) | ağır; referans | — | 2 | Kısmen (metadata) |
| [JiangWeixian/threejs-weather](https://github.com/JiangWeixian/threejs-weather) | 63 | 2023-11-10 | MIT | R3F hava bileşenleri | eski | — | 1 | Elendi |
| Codrops "Immersive 3D Weather with R3F" (2025-09-18) | — | — | — | drei Sky/Cloud/Stars + yağmur/kar parçacık + gece/gündüz + şimşek ışığı eğitimi | örnek mantık; zamanı kareye çevir | — | 3 | Arama özeti |
| **Analitik parçacıklar (özel)** | — | — | — | `pos = f(hash(i), frame)`; `Points`/`InstancedMesh`/`LineSegments` | §2.3: 2000 quad +22; 1500 çizgi ≈0; Points llvmpipe ≤+7; ✓✓ | düşük | 5 | Ölçüldü |
| Kıvılcım/ateş/duman | — | — | — | Sprite sheet yok; additive yuvarlak sprite + yükselen yavaş dönen quad'lar, analitik | düşük ✓ | düşük | 4 | Tasarım |
| Islak zemin/yansıma | — | — | — | Yansıma (Reflector/MeshReflectorMaterial) ağır (2. sahne çizimi). Yerine: zemin dokusuna koyu/parlak "ıslak" maske + sahte yansıma gradyanı | önerilen: düşük ✓ | düşük | 3 | Tasarım |
| Su (göl/çeşme) | [three `Water`/`WaterMesh`](https://github.com/mrdoob/three.js) yerel | | MIT | yansıma+normal; **yansıma 2. çizim** | orta–yüksek; `time` kareye bağla | orta | 2 | Dosya yerel. Öneri: düz renk + vertex dalga + kenar köpük şeridi (toon su; PlayCanvas/Codrops "toon water" eğitim mantığı) |

### 3.5 Performans / optimizasyon

| Repo | ★ | Son | Lisans | Ne yapar | Etki | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|
| [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | 1 987 | 2026-10-13 | MIT | CLI/SDK: `optimize`, `join`, `instance`, `palette`, `dedup`, `prune`, `weld`, KTX2 | draw call ↓; yazılım GL'de kazanç sınırlı (§2.1: −%18…25) ama yükleme/bellek iyi | 3 | Doğrulandı (metadata) |
| [zeux/meshoptimizer / gltfpack](https://github.com/zeux/meshoptimizer) | 8 565 | 2026-10-14 | MIT | npm gltfpack/meshoptimizer 1.3.0 | dosya boyutu; render hızı değil | 2 | Doğrulandı |
| three `BufferGeometryUtils.mergeGeometries` | (three) | | MIT | Statik binaları malzeme başına birleştir | ölçüm −%18…−%25 | 4 | Ölçüldü |
| [agargaro/instanced-mesh](https://github.com/agargaro/instanced-mesh) (`@three.ez/instanced-mesh`) | 453 | 2026-10-06 | MIT | InstancedMesh2: örnek-başı frustum culling, BVH, LOD | tek bir InstancedMesh yeter; ihtiyaç sınırlı | 2 | Doğrulandı (metadata) |
| three `BatchedMesh` (dahili) | | | MIT | çoklu geometri tek çağrı | InstancedMesh/merge ile aynı sınıf kazanç | 2 | Arama özeti |
| [gkjohnson/three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | 3 515 | 2026-10-12 | MIT | BVH raycast/CSG | render için gereksiz; kesit/ışın testi için | 2 | Doğrulandı |
| [pmndrs/detect-gpu](https://github.com/pmndrs/detect-gpu) | 1 219 | 2026-10-11 | MIT | GPU sınıflandırma | alakasız (GPU yok) | 1 | Elendi |
| [KhronosGroup/KTX-Software](https://github.com/KhronosGroup/KTX-Software) | 1 385 | 2026-10-15 | "other" | KTX2 doku sıkıştırma | yerel render'da kazanç yok | 1 | Elendi |
| [pmndrs/three-stdlib](https://github.com/pmndrs/three-stdlib) | 861 | 2026-06-26 | MIT | three examples'in bağımsız kopyası | three 0.180 ile ayrı sürüm tutmak gereksiz | 1 | Elendi |

**Yazılım WebGL ipuçları (ölçülmüş):** (1) arka ucu llvmpipe yap; (2) MSAA kapalı, `antialias:false`; composer RT `UnsignedByteType`, `multisampling=0`; (3) mümkünse tek birleşik son geçiş; (4) çözünürlük tek büyük kaldıraç (0.75× ≈ −%30, 0.5× ≈ −%68; Remotion'da `ThreeCanvas` boyutunu düşürüp CSS ile büyütmek kalite kaybettirir, test et); (5) HalfFloat RT SwiftShader'da pahalı; (6) draw call azaltma ikincil; (7) shader'da `precision mediump` kazancı **ölçülmedi**; (8) `MeshBasicMaterial`/`Lambert` Standard'a göre ucuz ama fark çoğunlukla gürültü sınırında (Standard→Lambert −%5…−%25).

### 3.6 Malzeme / doku

| Kaynak | Lisans | Format | Not | Doğrulama |
|---|---|---|---|---|
| [ambientCG](https://ambientcg.com) | CC0 1.0 (docs.ambientcg.com/license) | JPG/PNG PBR, 1K–8K | API v2 belgeli; v3 uç noktaları **DOĞRULANAMADI**. Araçlar: [alvarognnzz/ambientcg-downloader](https://github.com/alvarognnzz/ambientcg-downloader) (0★, 2025-01, lisans yok → kullanma; kendi 20 satır script'ini yaz) | Lisans doğrulandı |
| [Poly Haven](https://polyhaven.com) | CC0 (polyhaven.com/license: "ticari dahil, atıf gerekmez") | HDRI/doku/model, glTF | [agmmnn/polydown](https://github.com/agmmnn/polydown) 105★, 2026-04-21, MIT — toplu indirici | Lisans doğrulandı |
| [pmndrs/market](https://github.com/pmndrs/market) | repo MIT; varlıklar "CC0" (README) | glTF/doku/HDRI | 286★, 2026-09-12; API uç noktası var | Kısmen |
| [nidorx/matcaps](https://github.com/nidorx/matcaps) | **lisans dosyası yok** (README'de "Pixologic ücretsiz veriyor" notu) | PNG | 3 358★; ticari kullanım belirsiz → **kullanma**; matcap yerine toon rampa | Kısmen |
| Kenney dokuları/kitleri | CC0 | PNG/GLB | bkz. §3.7 | Doğrulandı |
| Prosedürel dokular: canvas (mevcut) | — | — | Tuğla/ahşap/kaldırım için seed'li canvas üreticileri yeterli. Hazır npm paketi bulunamadı (arama: texgen-raub eski) | Arama özeti |
| [boytchev/tsl-textures](https://github.com/boytchev/tsl-textures) | MIT | TSL (WebGPU) | 269★, 2026-09-09; WebGL'de çalışması için `three/webgpu` + fallback gerekir; bu ortamda önerilmez | Kısmen |

### 3.7 Low-poly dünya/şehir/bina/ağaç üretimi ve varlık paketleri

**Prosedürel üreticiler**

| Repo | ★ | Son | Lisans | Ne yapar | Kare-tabanlı/seed | Zorluk | Değer | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| [mxgmn/WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) | 25 386 | 2026-03-22 | **MIT (LICENSE okundu)** (ecosyste "other" dedi) | Orijinal WFC (C#); simple-tiled/overlapping | referans algoritma | — | 3 | Doğrulandı |
| [kchapelier/wavefunctioncollapse](https://github.com/kchapelier/wavefunctioncollapse) | 526 | 2023-08-24 | MIT | JS port; `model.generate(rng)` — **RNG parametresi alır** (README) | seed'li RNG verirsen ✓ | orta | 4 | Doğrulandı (README) |
| [felixturner/hex-map-wfc](https://github.com/felixturner/hex-map-wfc) | 440 | 2026-03-10 | MIT | 4 100 hex karo, 30 karo tipi, geri-izleme, TSL/WebGPU, BatchedMesh (≈38 draw call), seed'li RNG, GTAO+DOF+vinyet+grain, KayKit Medieval Hexagon karoları | **seed'li ✓** (WFC çözümü bir kez üretilip JSON'a kaydedilir); render hattı WebGPU → bizde çalışmaz, mimari referans | yüksek | 3 | Doğrulandı (README) |
| [BorisTheBrave/DeBroglie](https://github.com/BorisTheBrave/DeBroglie) | 527 | 2025-12-21 | MIT | C# WFC (kısıtlar, geri-izleme) | hazırlık adımı olarak | orta | 2 | Doğrulandı (metadata) |
| [marian42/wavefunctioncollapse](https://github.com/marian42/wavefunctioncollapse) | 4 862 | 2021-03-28 | MIT | Unity C# sonsuz şehir | eski, Unity | — | 1 | Elendi |
| Townscaper-benzeri açık kaynak JS klonu | — | — | — | **bulunamadı** (arama: yalnız makale/grid eğitimleri) | — | — | — | DOĞRULANAMADI |
| [ProbableTrain/MapGenerator](https://github.com/ProbableTrain/MapGenerator) | 1 468 | 2024-05-09 | **LGPL-3.0** | Tensor-alanı yol ağı / şehir haritası (2D), 3D dışa aktarım iddiası **doğrulanamadı** | seed △ | orta | 3 | Kısmen |
| [watabou/TownGeneratorOS](https://github.com/watabou/TownGeneratorOS) | 1 940 | 2021-01-09 | **GPL-3.0** | Ortaçağ kasaba planı (Haxe) | GPL bulaşıcı → yalnız fikir | — | 1 | Elendi (lisans) |
| [jstrait/city-tour](https://github.com/jstrait/city-tour) | 86 | 2026-02-18 | MIT | Arazi→yol→parsel→bina boru hattı (three.js) | seed △ | orta | 2 | Kısmen |
| three.js `examples/jsm/generators` (`CityGenerator`, `TreeGenerator`) | (three) | dev dalı | MIT | Seed'li gökdelen kenti + ağaç; **TSL/WebGPU node malzemesi**; 0.180'de yok (yerel `generators/` klasörü yok), dev'de var | WebGPU-only → bizde kullanılamaz; mimari referans | — | 2 | Doğrulandı (raw dosya) |
| [dgreenheck/ez-tree](https://github.com/dgreenheck/ez-tree) | 1 703 | 2026-07-16 | MIT | Seed'li prosedürel ağaç, LOD; npm 1.1.0, peer three ≥0.167 | ✓ (seed); ağaçlar onbinlerce üçgen olabilir → LOD/`levels` düşür veya kendi ikosahedron+konik ağacın kalsın | düşük | 3 | Doğrulandı |
| [pajama-studio/lowpoly-tree-generator](https://github.com/pajama-studio/lowpoly-tree-generator) | 14 | 2026-07-10 | MIT | Parametrik low-poly ağaç + rig | küçük proje | düşük | 2 | Doğrulandı (metadata) |
| [nylki/lindenmayer](https://github.com/nylki/lindenmayer) | 199 | 2025-06-17 | MIT | L-sistem | ✓ (deterministik gramer) | orta | 2 | Doğrulandı (metadata) |
| three `VOXLoader` (dahili) | | | MIT | MagicaVoxel `.vox` | ✓ | düşük | 2 | Doğrulandı (yerel) |
| [mikolalysenko/greedy-mesher](https://github.com/mikolalysenko/greedy-mesher) | 54 | 2016 | MIT | greedy meshing | eski ama algoritma basit | — | 1 | Kısmen |
| [jpaver/opengametools](https://github.com/jpaver/opengametools) | 423 | 2026-10-06 | MIT | `.vox` okuma + greedy meshify (C++) | araç | — | 1 | Kısmen |
| [JannisX11/blockbench](https://github.com/JannisX11/blockbench) | 6 060 | 2026-10-10 | GPL-3.0 | Low-poly model editörü, glTF dışa aktarım | araç olarak kullan (GPL çıktıyı etkilemez) | — | 3 | Doğrulandı |

**Ücretsiz varlık paketleri (CC0)**

| Paket | Lisans | Format | Not | Doğrulama |
|---|---|---|---|---|
| **Kenney** (kenney.nl) | CC0, ticari serbest, atıf zorunlu değil (support sayfası + zip içi License.txt okundu) | Zip içi `Models/GLB format/*.glb` (city-kit-suburban'da doğrulandı); diğerlerinde aynı düzen beklenir | Sayfa sayıları (15 Eki 2026): City Kit Suburban 40, Commercial 50, Roads 90 (v2.2, 2026), Industrial 40, **Fantasy Town Kit 160**, Nature Kit 330, Retro Urban 120, **Mini Forest 20 (2026)**, Furniture 140, Building Kit 80, **Hexagon Kit 70**, **Holiday Kit 100**, Survival 80, Platformer 150, Pirate 70, Graveyard 90, Car Kit 45. **Projede zaten var** (ledger): blocky-characters, building-kit, car-kit, city-kit-*, food-kit, furniture-kit, graveyard-kit, mini-characters, modular-buildings, nature-kit, prototype-kit, retro-urban-kit, survival-kit. **Eksik ama faydalı:** fantasy-town-kit, holiday-kit (kış/bayram), hexagon-kit, mini-forest, 3d-road-tiles, castle-kit | Doğrulandı |
| **Quaternius** (quaternius.com) | CC0 (pack sayfalarında "License CC0") | Sayfa formatları: Downtown City MegaKit 315 model FBX/Blend/**glTF** (Mayıs 2026); Medieval Village MegaKit 304 (FBX/OBJ/Blend/glTF); Stylized Nature MegaKit 116 (glTF); Ultimate Stylized Nature 63 (glTF); Cube World Kit 108 (glTF); Simple Buildings 10 / Modular Streets 25 / Buildings 9 / Ultimate Home Interior 123 / Ultimate Textured Buildings 76: **glTF yok** (FBX/OBJ/Blend → Blender ile GLB'ye çevir) | "Paketin %60–70'i ücretsiz; Source sürümü ücretli (Patreon)"; ücretsiz kısım sınırı pakete göre değişir (itch: Stylized Nature standart sürümde 68 model — arama özeti) | Doğrulandı (sayfa) |
| **KayKit** (kaylousberg.itch.io) | CC0, "orijinalini satma" notu | .OBJ .FBX .GLTF | City Builder Bits (ücretsiz 32+ model), Restaurant Bits (140+), Medieval Hexagon (ücretsiz 200+ model); EXTRA/SOURCE ücretli | Doğrulandı (itch sayfaları) |
| Poly Pizza | CC0 **ve CC-BY** karışık; API anahtarı ister | GLB | Üçüncü taraf özetine dayanır, site 403 verdi → **DOĞRULANAMADI**; CC-BY için atıf tutulmalı | Arama özeti |
| Kenney Starter-Kit-City-Builder | MIT (kod) | Godot | 1 478★ — Godot, alakasız | Elendi |

---

## 4. Yükseltme planı (etki/maliyet sırasıyla)

> Tüm süreler §2 ölçümlerinin tahmini uzantısıdır (GL kısmı; gerçek Remotion karesi ayrıca JPEG/React maliyeti içerir). Sahne ağırlığı bu sentetik sahneden farklıysa oranlar geçerlidir.

### Adım 0 — Render arka ucunu llvmpipe'e al (en yüksek getiri)
- **Ne:** Xvfb + Playwright'ın tam Chromium'u (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, sürüm 141.0.7390.37) + `gl:"angle"` + `chrome-for-testing` modu.
- **Kanıt:** Remotion `openBrowser` ile bu bileşimde renderer = `ANGLE (Mesa, llvmpipe …)`; `angle-egl` ve `egl` bu ortamda **çalışmadı** (WebGL bağlamı alınamadı). Headless-shell ile `angle`/`egl`/`angle-egl` hepsi SwiftShader'a düştü (yani yalnız tam Chromium + X ekranı llvmpipe verir).
- **Kod iskeleti** (`remotion.config.ts`; env ile açılır, mevcut davranış korunur):
```ts
if (process.env.NUFUS_LLVMPIPE === "1") {
  Config.setBrowserExecutable(process.env.NUFUS_BROWSER ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome");
  Config.setChromeMode("chrome-for-testing");   // 4.0.535'te mevcut
  Config.setChromiumOpenGlRenderer("angle");
}
```
```bash
Xvfb :99 -screen 0 1280x2048x24 & export DISPLAY=:99 LIBGL_ALWAYS_SOFTWARE=1 NUFUS_LLVMPIPE=1
# gerekirse oversubscribe önlemek için: LP_NUM_THREADS=2 (ölçüm: sonuç piksel değişmiyor)
npm run render:001   # (kullanıcı isteyince)
```
- **Risk/yapılacak:** (a) uçtan uca Remotion `renderStill`/`renderMedia` ile 5–10 kare kıyas **yapılmadı** (kural: kullanıcı istemeden render yok) — ilk iş bu olmalı; (b) SwiftShader ve llvmpipe pikseli farklı: bir bölümün tamamı aynı arka uçla; (c) farklı CPU'da birebirlik doğrulanmadı; (d) kare süresinin GL dışı kısmı (JPEG, React) bu hızlanmadan etkilenmez → kare başına toplam süre 0.5 sn'den yaklaşık 0.2–0.35 sn'ye inebilir (**TAHMİN**, ölçülmedi), `--concurrency` yeniden ayarlanmalı (llvmpipe çok iş parçacıklı, sekme sayısı × thread sayısı).
- **Etki:** GL süresi ÷4–6, aşağıdaki tüm adımlar bedavaya yakın.

### Adım 1 — Birleşik "maket" son geçişi (tilt-shift + doygunluk + vinyet + kâğıt)
- Paketler: `@react-three/postprocessing@3.0.4`, `postprocessing@6.37.8` (peer three < 0.181 ✓; **doğrulanan sürüm eşleşmeleri:** 3.0.4 peer R3F ^9.0; 6.37.8 peer `>=0.157 <0.181`). Alternatif: paket eklemeden three'nin `ShaderPass`'ı ile kendi birleşik shader'ın (ölçülen kod bench.ts `FusedShader`).
```tsx
// ThreeCanvas içinde — pmndrs yolu
<EffectComposer multisampling={0} frameBufferType={UnsignedByteType} depthBuffer>
  <TiltShift2 blur={0.6} start={[0.5,0.30]} end={[0.5,0.70]} samples={6} />
  <HueSaturation saturation={0.18} />
  <BrightnessContrast contrast={0.08} />
  <Vignette offset={0.3} darkness={0.55} />
</EffectComposer>
```
- **Determinizm yaması** (Noise/Water vb. kullanılırsa): `useLayoutEffect(() => composerRef.current.passes.forEach(p => { if (p.fullscreenMaterial?.time !== undefined) { p.timeScale = 0; p.fullscreenMaterial.time = frame / fps; } }), [frame])`. Hiç zamanlı efekt kullanma ise gerekmez.
- Tahmini süre: SwiftShader +60…+140 ms, llvmpipe +12…+30 ms. `TiltShift2` iç blur'u yarım çözünürlüktedir (kaynakta `resolutionScale=0.5`); ölçtüğüm eşdeğer özel kod referansa göre SwiftShader +8 ms, llvmpipe +11 ms. 
- Alt-adım: `focus/band`'i kareye göre hafifçe değiştir (kamera hareketinde "odak kayması").

### Adım 2 — Zemine oturtma: blob + köşe AO + güneş yönü gölge rengi
- Her bina/ağaç/karakter altına `PlaneGeometry` blob (çarpan, `depthWrite:false`, `renderOrder`), ya da tek bir "zemin gölge dokusu" canvas'ına hazırlıkta çiz (Z9 ölçümü +15 ms SwiftShader).
- Bina kutusu köşelerine **vertex color AO** (alt kenar %12 koyu); kod: geometri üretiminde `color` attribute; maliyet 0.
- Tahmini: +1…+34 ms.

### Adım 3 — Kontur çizgisi
```tsx
<mesh castShadow><boxGeometry/><meshStandardMaterial flatShading/><Outlines thickness={0.03} color="#3a2418" angle={Math.PI}/></mesh>
```
(`<Outlines>` yalnız karakter ve ön plan proplarında; `screenspace` kapalı; statik → ✓). Tahmini +%10…30 sahne süresi.

### Adım 4 — Renk/ışık: sıcak güneş + soğuk gölge + dönemsel LUT
- Zaten ön ayarlar var → her ön ayar için `HueSaturation`/`BrightnessContrast` değerlerini ve gökyüzü gradyanını ayarla. LUT3D (`.cube`) gerekirse `LUT` efekti (tek geçiş; ölçüm +25 ms SwiftShader / +10 ms llvmpipe ayrı geçişse, birleşik EffectPass'te ~0).

### Adım 5 — Analitik parçacıklar
```tsx
const Snow = ({n=1500}) => { const f = useCurrentFrame(); const g = useMemo(buildGeo(n, seed), []);
  // konum = (hash(i)*W + wind*t, (1 - fract(hash2(i) + t*fall)) * H, …) — pozisyonu vertex shader'da uTime=f/30 ile hesapla
  return <points geometry={g}><shaderMaterial uniforms={{uTime:{value:f/30}}} …/></points> }
```
- `Math.random` yerine `mulberry32(seed)`; `uTime` her kare yeniden yazılır. Ölçüm: +10…90 ms (SwiftShader), ≤ +7 ms (llvmpipe).

### Adım 6 — Atmosfer: gradyan gökyüzü + sis + bulut gölgesi
- `scene.fog = new Fog(...)` (bedava); gökyüzü büyük gradyan küre/arka plan; bulut gölgesi = zemin shader'ında `texture(noise, uv*s + wind*t)` çarpanı (`onBeforeCompile` ile `MeshStandardMaterial`'e ya da CustomShaderMaterial).

### Adım 7 — Gerçek güneş gölgesi (llvmpipe ile)
- Sıkı ortografik shadow frustum, 1024, `PCFShadowMap`, yalnız zemin + büyük binalar `receiveShadow`. SwiftShader'da +120 ms; llvmpipe'te +15 ms.

### Adım 8 — İsteğe bağlı kalite: AO ve "painterly"
- llvmpipe'te GTAO (three `GTAOPass`, +360 ms) veya N8AO `halfRes` (sarmalayıcı: `const orig = performance.now; performance.now = () => frame*1000/30; try { composer.render() } finally { performance.now = orig }`). Kuwahara-lite yarım çözünürlük +2 ms. Yalnız statik/kapak karelerinde veya özel bölümlerde.

### Adım 9 — Varlık/üretim
- Kenney: **Fantasy Town Kit (160)**, **Holiday Kit (100)**, **Mini Forest (20)**, **Hexagon Kit (70)** ekle (CC0 doğrulandı; ledger'a yaz). Quaternius: **Downtown City MegaKit** (glTF var), **Stylized Nature MegaKit** (ağaç çeşitliliği). Bina varyasyonu için WFC değil, mevcut kit parçalarının seed'li birleştirilmesi; WFC (kchapelier, RNG parametreli) yalnız sokak/parsel döşemesi için hazırlıkta bir kez çalıştırıp JSON'a kaydet.
- Statik binaları malzeme başına birleştir (−%18…−%25).

### Adım 10 — Kalite kapısı (kullanıcı isteyince)
- Her yükseltmeden sonra: aynı kareyi iki kez render et, piksel hash'ini karşılaştır (`B_ek_benchmark/bench.ts` set 6 örneği). Sapma varsa zamana bağlı efekt/`Math.random` sızmıştır.

---

## 5. Alan 8 — İzometrik özellikler, dollhouse/cutaway

- İzometrik kamera: ortografik, yükseklik 35.264° (gerçek izometrik) ya da projedeki 38°/45°; `OrthographicCamera` sınırlarını aspect ile ölçekle (arama özeti: Scrapbox/Frontend Masters).
- Duvar kesme/dollhouse: hazır three.js kütüphanesi **bulunamadı**. Önerilen: `discard` + sıralı sapma (dither/alpha-hash) tabanlı özel `onBeforeCompile`; `transparent:true` kullanma (sıralama sorunu — three forum başlığı, arama özeti). Kare-tabanlı `uCut = ease(frame)`; kamera yönüne bakan iki duvara `uniform` ile uygula. Maliyet fragment `discard` ≈ ihmal edilebilir.
- Billboard sprite/parallax hibritleri: ölçülmedi; maket stiliyle uyumsuz, öneri değil.
- Sahne geçişleri (kamera dönüşü, fade): saf matematik, kare-tabanlı; kütüphane gerekmez. three `RenderTransitionPass` (yerel) iki sahneyi ayrı çizer → 2× maliyet.

## 6. Alan 9 — Blender hattı: karar tablosu

Blender bu makinede **kurulu değil** (denenemedi); Blender 5.0/5.1/5.2 sürüm klasörleri download.blender.org'da var (doğrulandı). Cycles CPU zamanı **ölçülmedi**; web aramasında bu tür bir kıyas bulunamadı → aşağıdaki süreler **TAHMİN**.

| İhtiyaç | Blender | three.js (llvmpipe) | Karar |
|---|---|---|---|
| 1800 kare/bölüm, günlük üretim | Cycles CPU 4 çekirdek: tahmini 3–15 sn/kare ⇒ 1.5–7.5 saat; Workbench/EEVEE GPU/OpenGL ister (yazılım OpenGL ile yavaş/belirsiz — **DOĞRULANAMADI**; 2026 vendor makalesi EEVEE-Next headless sorunlarını iddia ediyor, doğrulanamadı) | ölçüm: 24–130 ms GL/kare | **three.js** |
| Kapak/hero still (1–5 görsel), yüksek örnek, yumuşak GI | Cycles + denoise, 1 kare dakikalar | — | **Blender değerli** |
| AO/lightmap pişirme (statik binalar) → vertex color / doku → GLB | Blender "Bake" (Diffuse/AO), `glTF-Blender-IO` (1 664★, 2026-10-15, Apache-2.0) | Pişirilmiş çıktı runtime'da bedava | **Blender değerli (tek seferlik)** |
| Kumaş/bayrak/sıvı/uçuşan kâğıt simülasyonu | Fizik pişir → Vertex Animation Texture (Blender VAT eklentisi) ya da morph target (MDD→glTF); Codrops 2025-08-20 "cloth sim → three.js" eğitimi | VAT shader'ı kare-indeksli örnekler ✓ | **Blender değerli**, ama dosya/VRAM sınırı (yazılım GL'de doku okuması ucuz) |
| Karakter animasyonu | Kenney animasyonlu GLB (projede) | skinning CPU/GPU; ölçülmedi | mevcut yol |
| Düz gölgeli toon kontur | Freestyle/Workbench kontur | ters kabuk (ölçüm: ucuz) | three.js |
| Alternatifler (kısa) | **Godot** `--write-movie` (Vulkan/GL ister; lavapipe notu **DOĞRULANAMADI**), **Bevy** (wgpu; headless için lavapipe), **Unity batchmode** (`-nographics` render etmez; Xvfb+llvmpipe gerekir) | — | Kullanma: React/Remotion/hikâye hattını yeniden yazmak gerekir |

**Sonuç:** Blender, yazılım-WebGL darboğazını aşmaz çünkü darboğazı llvmpipe zaten ÷5 küçültüyor ve Blender CPU'da 10–100× daha yavaş. Blender'ı **ön üretim aracı** (pişirme, kapak, simülasyon) olarak kullan.

## 7. Alan 10 — WebGPU/TSL kullanılabilirliği

- Remotion: `<ThreeWebGPUCanvas>` (`@remotion/three/webgpu`, v4.0.503'ten beri, deneysel; three ≥0.167, R3F ≥9, React 19 ister). WebGPU yoksa three **WebGL2 arka ucuna düşer**. Remotion 5.0'da ANGLE varsayılan + otomatik SwiftShader yedeği; 4.0'da `--gl=angle` gerekir (boş canvas riski) — **doğrulandı** (Remotion belgesi).
- Bu ortamda ölçüm: bayraksız `requestAdapter()` = null (WebGL2 fallback); özel bayraklarla SwiftShader WebGPU adaptörü çalışıyor ama bayrakları Remotion'a verme yolu görünmüyor, performans **ölçülemedi**.
- Kazanç/risk: TSL (toon outline `ToonOutlinePassNode`, `RenderPipeline` r183 adlandırması, `three/addons/tsl/display`) cazip; fakat (1) deneysel, (2) fallback'te WebGL2'ye çevrilir ve ek derleme maliyeti olur, (3) tüm yeni üreticiler/boru hatları (CityGenerator, hex-map-wfc) WebGPU'ya bağlı, (4) llvmpipe ile WebGL2 yolu zaten hızlı. **Karar: şimdilik uzak dur; three'yi 0.180→0.186 yükseltmek ayrı bir iş** (yeni sürümlerde `Clock`→`Timer` kullanımdan kaldırma uyarıları).

## 8. Hazırlık: R3F/Remotion uyum notları

- `ThreeCanvas` render sırasında `frameloop="never"` zorlar ve her `useCurrentFrame` değişiminde `advance(performance.now())` çağırır (kaynak okundu) → tüm `useFrame` geri çağrıları (EffectComposer dahil) çalışır; `delta` **gerçek zamanlı** olduğundan zamanı kullanan her şey ✗ — kare numarasından hesapla.
- Remotion sekmeleri sıra dışı ve paylaşımsız render eder (Remotion belgesi): hiçbir durumlu birikim (TAA, AccumulativeShadows, N8AO `accumulate`, parçacık entegrasyonu) kullanma.
- `@react-three/postprocessing` 3.2.0 (2026-10-10) R3F ≥ 9.7 ister; projede 9.4.0 → ya 3.0.4'e sabitle ya da R3F'yi 9.8.2'ye yükselt (React peer `>=19 <19.4`, proje 19.3.1 ✓).
- `postprocessing` 6.39.5: three `>= 0.168 < 0.187` ✓.

## 9. Bakılıp ELENEN projeler ve nedenleri

| Proje | Neden |
|---|---|
| 0beqz/realism-effects | 2024'ten beri güncellenmedi; SSGI/TRAA temporal (durumlu) ✗; çok ağır |
| pmndrs/lamina | Arşivli (2025-06-22) |
| gkjohnson/three-gpu-pathtracer | Progressive yol izleme; yazılımda anlamsız; peer three ≥0.185 |
| drei Sparkles / Stars | `Math.random` yerleşimi + `state.clock` zamanı → kare-tabanlı değil |
| drei AccumulativeShadows (canlı) | Birikimli/temporal; yalnız hazırlıkta pişirilirse ✓ |
| three.quarks / three-nebula / @newkrok/three-particles | Durumlu simülasyon (rastgele-erişimli kareyle çelişir), `Math.random`; quarks 0.17 + three-particles three ≥0.182 ister |
| hmans/three-vfx, mustache-dev/Three-VFX, vfx-js | Yarım/WebGPU-only/DOM efekti |
| JiangWeixian/threejs-weather | 2023'ten beri durağan |
| SSAO/SAO/Bokeh/OutlinePass (three passes) | SwiftShader'da 6–20×; yerine pişirilmiş AO, ters kabuk |
| nidorx/matcaps | Lisans dosyası yok |
| watabou/TownGeneratorOS | GPL-3.0, Haxe, 2021 |
| marian42/wavefunctioncollapse | Unity, 2021 |
| Basinity/CitySimulator | Arşivli, Unity |
| takram three-geospatial | Hedef stil dışı, ağır ön hesap |
| three.js `CityGenerator`/`TreeGenerator` | WebGPU/TSL node malzemesi gerektirir (0.180'de yok) |
| boytchev/tsl-textures | WebGPU gerektirir |
| UstymUkhman/color-grading, pmndrs/detect-gpu, KTX-Software, three-stdlib | Gereksiz/alakasız |
| Poly Pizza (CC-BY içerik) | Lisans karışık; site okunamadı |
| lygia | Lisans "other" (ticari uyumluluk doğrulanamadı) |
| Kenton-GMI/sakuragaoka-station | Lisans yok → kod kopyalanamaz; yalnız okuma/ilham |
| Blender EEVEE yolu | Yazılım GL'de belirsiz; Cycles CPU kare başına saniyeler |
| Godot/Bevy/Unity batchmode | Projeyi yeniden yazmayı gerektirir |

## 10. Açık kalan / DOĞRULANAMADI listesi

1. Uçtan uca Remotion render süresi (llvmpipe vs swangle) — kullanıcı onayı olmadan render yapılmadı.
2. llvmpipe'in farklı CPU mimarilerinde piksel birebirliği.
3. pmndrs/postprocessing, N8AO, react-postprocessing'in gerçek çalışma maliyeti (kod çalıştırılmadı; tahminler three eşdeğerlerine dayanır).
4. WebGPU yolunun hızı ve Remotion'a bayrak geçirme olanağı.
5. Blender 5.x EEVEE/Workbench'in yazılım GL'de davranışı; Cycles CPU kare süresi.
6. Poly Pizza lisans/API, ambientCG v3 API, lygia lisans metni, MapGenerator 3D çıktısı, three-nebula determinizm iddiası.
7. KayKit/Quaternius paketlerinin indirilen GLB'lerinin iç yapısı (yalnız Kenney city-kit-suburban zip'i incelendi: `Models/GLB format/*.glb`, `License.txt` CC0).
8. mobil ekran okunurluğu/estetik değerlendirmesi (görsel karşılaştırma yapılmadı; yalnız performans ölçüldü).

## 11. Kaynaklar (URL)

**Remotion / three / R3F**
- https://www.remotion.dev/docs/three · https://www.remotion.dev/docs/three-webgpu-canvas · https://www.remotion.dev/docs/gl-options · https://www.remotion.dev/docs/flickering
- https://github.com/mrdoob/three.js · https://github.com/pmndrs/react-three-fiber · https://github.com/pmndrs/drei
- https://github.com/pmndrs/postprocessing · https://github.com/pmndrs/react-postprocessing · https://react-postprocessing.docs.pmnd.rs/effects/tilt-shift
- https://github.com/N8python/n8ao · https://github.com/FarazzShaikh/THREE-CustomShaderMaterial · https://github.com/FarazzShaikh/glNoise · https://github.com/pmndrs/lamina
- https://github.com/pmndrs/react-three-lightmap · https://github.com/0beqz/realism-effects · https://github.com/gkjohnson/three-gpu-pathtracer · https://github.com/gkjohnson/three-mesh-bvh
- https://threejs.org/docs/pages/ToonOutlinePassNode.html · https://threejs.org/docs/pages/CityGenerator.html · https://github.com/mrdoob/three.js/blob/dev/examples/jsm/generators/CityGenerator.js
- https://discourse.threejs.org/t/how-to-have-a-tilt-shift-effect-on-a-3d-scene/40606 · https://blog.maximeheckel.com/posts/on-crafting-painterly-shaders · https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web

**Yazılım WebGL**
- https://microlink.io/blog/webgl-without-a-gpu (SwiftShader→llvmpipe, `--use-angle=gl`, Xvfb) · https://agent-browser.dev/webgpu

**Parçacık / hava / doğa**
- https://github.com/Alchemist0823/three.quarks · https://github.com/creativelifeform/three-nebula · https://github.com/NewKrok/three-particles · https://github.com/hmans/three-vfx · https://github.com/mustache-dev/Three-VFX · https://github.com/fand/vfx-js
- https://github.com/Token-Gremlin/natural-disasters · https://github.com/JiangWeixian/threejs-weather · https://tympanus.net/codrops/2025/09/18/creating-an-immersive-3d-weather-visualization-with-react-three-fiber/
- https://github.com/dgreenheck/ez-tree · https://github.com/pajama-studio/lowpoly-tree-generator · https://github.com/nylki/lindenmayer
- https://github.com/takram-design-engineering/three-geospatial · https://github.com/mourner/suncalc · https://github.com/jeromeetienne/threex.daynight

**Stil / referans**
- https://github.com/Kenton-GMI/sakuragaoka-station · https://github.com/mochiya-labs/three-liltoon · https://github.com/brunosimon/folio-2025 · https://github.com/ektogamat/r3f-webgpu-starter · https://github.com/UstymUkhman/color-grading
- https://github.com/boytchev/tsl-textures · https://github.com/patriciogonzalezvivo/lygia

**Performans**
- https://github.com/donmccurdy/glTF-Transform · https://github.com/zeux/meshoptimizer · https://github.com/agargaro/instanced-mesh · https://github.com/pmndrs/detect-gpu · https://github.com/KhronosGroup/KTX-Software · https://github.com/pmndrs/three-stdlib

**Dünya üretimi / WFC / şehir**
- https://github.com/mxgmn/WaveFunctionCollapse · https://github.com/kchapelier/wavefunctioncollapse · https://github.com/felixturner/hex-map-wfc · https://github.com/BorisTheBrave/DeBroglie · https://github.com/marian42/wavefunctioncollapse
- https://github.com/ProbableTrain/MapGenerator · https://github.com/watabou/TownGeneratorOS · https://github.com/jstrait/city-tour · https://github.com/JannisX11/blockbench · https://github.com/mikolalysenko/greedy-mesher · https://github.com/jpaver/opengametools

**Varlık paketleri / doku**
- https://kenney.nl/support · https://kenney.nl/assets/category:3D · https://kenney.nl/assets/city-kit-suburban · https://kenney.nl/assets/fantasy-town-kit · https://kenney.nl/assets/holiday-kit · https://kenney.nl/assets/hexagon-kit · https://kenney.nl/assets/mini-forest
- https://quaternius.com/ · https://quaternius.com/packs/downtowncitymegakit.html · https://quaternius.com/packs/stylizednaturemegakit.html · https://quaternius.com/packs/medievalvillagemegakit.html · https://quaternius.com/packs/cubeworldkit.html
- https://kaylousberg.itch.io/city-builder-bits · https://kaylousberg.itch.io/kaykit-medieval-hexagon · https://kaylousberg.itch.io/restaurant-bits
- https://polyhaven.com/license · https://docs.ambientcg.com/license/ · https://github.com/agmmnn/polydown · https://github.com/alvarognnzz/ambientcg-downloader · https://github.com/pmndrs/market · https://github.com/nidorx/matcaps · https://poly.pizza

**Blender / alternatifler**
- https://github.com/KhronosGroup/glTF-Blender-IO · https://docs.blender.org/manual/en/4.5/advanced/command_line/arguments.html · https://download.blender.org/release/ · https://tympanus.net/codrops/2025/08/20/exporting-a-cloth-simulation-from-blender-to-an-interactive-three-js-scene/ · https://extensions.blender.org/add-ons/vat/ · https://docs.godotengine.org/en/4.2/classes/class_moviewriter.html

**Awesome listeleri (taranan)**
- https://github.com/AxiomeCG/awesome-threejs (1 001★, 2026-07-28, CC0) · https://github.com/gsimone/awesome-react-three-fiber (203★, son push 2021 — eski) · https://github.com/sjfricke/awesome-webgl (1 541★, 2026-04-02) · https://github.com/vanrez-nez/awesome-glsl (1 375★, 2023) · terkelg/awesome-creative-coding ve patriciogonzalezvivo/awesome-shaders README'leri raw'dan **indirilemedi** (DOĞRULANAMADI). Listeler genel olarak eski/ince; yeni bulgular topic sayfaları, npm ve arama ile bulundu.
