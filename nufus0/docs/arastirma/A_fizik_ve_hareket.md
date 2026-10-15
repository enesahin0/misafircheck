# A) Fizik motorları, karakter/nesne hareketi, prosedürel animasyon, kalabalık/YZ yönlendirme

Araştırma tarihi: 2026-10-15. Hedef: Remotion 4.0.535 + React 19 + three 0.180 + R3F 9.4 + `@remotion/three` (ThreeCanvas), 1080x1920 / 30 fps / 60 sn, SwiftShader, tamamen deterministik ve kare-tabanlı.

---

## 0. Yöntem ve dürüstlük notu (önce bunu oku)

- GitHub REST API bu oturumda kapalıydı (`sessions are bound to configured repositories`). Bu yüzden veri şu kaynaklardan toplandı: (a) `github.com/OWNER/REPO` sayfası (yıldız, lisans, arşiv durumu), (b) `github.com/OWNER/REPO/commits/HEAD.atom` (son commit tarihi), (c) `registry.npmjs.org` + `api.npmjs.org` (sürüm, yayın tarihi, lisans, haftalık indirme), (d) `raw.githubusercontent.com` (README/kaynak/IDL okuma), (e) jsDelivr dosya listesi (boyut), (f) resmi dokümantasyon siteleri (curl ile).
- Yıldız sayıları sayfadan "olduğu gibi" alındı; sayfa `k` olarak yuvarlıyorsa öyle yazıldı (ör. 5.9k). Hiçbir sayı tahmin edilmedi. Atom'dan tarih alınamayan satırlarda `?` yazıldı ve mümkünse npm yayın tarihi eklendi.
- İndirilen hiçbir kod ÇALIŞTIRILMADI (kural gereği). Yani "determinizm" yargıları dokümantasyon + kaynak kodu okumaya dayanır, bizim ortamımızda ölçülmüş değildir. Üretimde mutlaka "iki kez pişir, hash karşılaştır" testi koyun (bkz. 4. bölüm).
- Doğrulama sütunu: **✔** = README/kaynak/doküman bu oturumda gerçekten okundu; **◐** = yalnızca repo sayfası özeti ya da arama sonucu (kod okunmadı); **✖** = DOĞRULANAMADI.
- Uyum sütunu: **✓** = kuralımızla (deterministik, kare-tabanlı, headless/SwiftShader) uyumlu; **△** = şartlı/ek iş gerekir; **✗** = uyumsuz.

---

## 1. YÖNETİCİ ÖZETİ (10 satır)

1. **KESİN KULLAN – Rapier** (`@dimforge/rapier3d-deterministic-compat` 0.21.0, Apache-2.0, wasm ≈3.1 MB): ham API ile, sabit adım, **Node'da önceden pişir (bake) → JSON**, Remotion'da sadece oku. 0.21'de ip/kumaş/jöle (soft body) ve `takeSnapshot/restoreSnapshot` var. `@react-three/rapier` KULLANMA.
2. **KESİN KULLAN – Remotion'un kendi deterministik araçları:** `spring()`, `random(seed)`, `@remotion/noise`, `@remotion/gsap` (yalnız DOM) + kendi kapalı-form "yay/sönümleyici" yardımcıların (yay doğrusal olduğundan bindirme/superposition ile her kare O(1) hesaplanır).
3. **KESİN KULLAN – three animasyon çekirdeği:** `AnimationMixer.setTime()` / elle `action.time + weight` + `SkeletonUtils.retargetClip` + `CCDIKSolver`; ayaklar için kendi iki-kemik analitik IK'n.
4. **KESİN KULLAN (içerik) – Quaternius Universal Animation Library 1/2 + Universal Base Characters** (glTF, insansı rig, 250+ klip) ve KayKit Character Animations (CC0): klipleri çevrimdışı örnekleyip `Humanoid` eklemlerine "bake" et. Lisans notu: Quaternius 2026-08-28'de QAL v1.0'a geçti (bkz. 3.4).
5. **DENE – crashcat** (saf JS, MIT, dünya durumu düz JSON → snapshot bedava) ve **Jolt JS** (`SaveState/RestoreState`, soft body, araç, 2 MB wasm): Rapier yetmezse / ikinci görüş.
6. **DENE – Kalabalık:** önce **parametrik yürüyüş** (spline + tohumlu ofset; kapalı-form, rastgele erişim). Etkileşim gerekirse **Yuka** (steering/flocking/FSM; 2 yerde `Math.random` var) veya **navcat/recast-navigation-js** Crowd; hepsi sabit adım + önbellek/bake.
7. **DENE – three-pinata** (çevrimdışı Voronoi kırma → parçalar Rapier'a), **GSAP/anime.js `seek`** ile prop/kamera zaman çizelgesi (Theatre.js ikinci planda).
8. **UZAK DUR (kanıtlı):** `three/addons/physics/RapierPhysics.js` ve `JoltPhysics.js` (`setInterval` + `Timer`), `@react-three/rapier` (R3F delta'lı birikimci döngü + rapier 0.19.2'ye sabit + son commit 2025-11-03), `drei` Float/Cloud/Sparkles/MeshWobbleMaterial (`useFrame` + `clock.elapsedTime` + `Math.random`). Neden: `@remotion/three` kare başına `advance(performance.now())` çağırıyor → `useFrame` duvar saatiyle çalışır.
9. **UZAK DUR:** Matter.js/cannon-es/use-cannon (determinizm kanıtsız ya da bakımsız), react-spring/framer-motion (Remotion'da entegrasyon yok), HY-Motion (26 GB VRAM + AB/UK/G.Kore hariç lisans), OpenPose/VideoPose3D (ticari olmayan), movsim trafik (GPL-3.0). Metinden-harekete/mocap bu proje için gereksiz.
10. **Asıl fırsat:** "Fiziksel" efektlerin çoğu motor bile istemez (parabol + sekme, sönümlü yay, kapı = yay-sönümleyici); motoru sadece çok cisimli etkileşim (saksı parçaları, domino, ip/kumaş) için kullan ve hep **çevrimdışı pişir**.

---

## 2. Bu araştırmanın en kritik teknik bulguları (kanıtlarıyla)

| # | Bulgu | Kanıt |
|---|---|---|
| K1 | `@remotion/three` ThreeCanvas her kare render'ında `advance(performance.now())` çağırır. Yani R3F `useFrame` kancaları çalışır ama **delta/clock duvar saatinden** gelir → deterministik değil. `frameloop="never"` bunu engellemez, sadece otomatik döngüyü kapatır. | `packages/three/src/ThreeCanvas.tsx` okundu (`ManualFrameRenderer`: `advance(performance.now())`) ✔ |
| K2 | three'nin resmi `RapierPhysics.js` ve `JoltPhysics.js` eklentileri `setInterval(step, 1000/60)` + `Timer.getDelta()` kullanır; Rapier'ı CDN'den dinamik import eder. Kare-tabanlı çıktı için kullanılamaz. | `examples/jsm/physics/*.js` okundu ✔ |
| K3 | `@react-three/rapier` `<Physics>`: `useFrame` içinde `accumulator += clampedDelta` ile adım sayısı delta'ya bağlı, `interpolate` ile lerp/slerp var; paketi `@dimforge/rapier3d-compat` **0.19.2'ye sabitlemiş**; son commit 2025-11-03. | `Physics.tsx` + npm `2.2.0` bağımlılıkları + atom ✔ |
| K4 | drei `Float`, `Cloud`, `Sparkles`, `MeshWobbleMaterial`: `useFrame` + `state.clock.elapsedTime` kullanır; `Float` ve `Cloud` varsayılan olarak `Math.random()` tohumlar (Cloud'da `seed` prop var). | `src/core|web/*.tsx` grep ✔ |
| K5 | Rapier JS, resmi sitede "tam çapraz-platform deterministik" diye anılıyor; ama `bindings/typescript/README.md` "ana derleme çapraz-platform determinizm GARANTİ ETMEZ (aynı makinede yereldir), `-deterministic` derleme garanti eder" diyor. İkisi çelişkili görünüyor → **`-deterministic-compat` paketini kullan**. Bizim senaryoda (aynı ikili, aynı konteyner) yerel determinizm zaten yeter. | rapier.rs/docs/user_guides/javascript/determinism + README ✔ |
| K6 | Rapier snapshot-geri-yükleme sonrası bit-bit farklılık hatası (BVH workspace) #910 Haziran 2026'da kapandı, düzeltme parry 0.26.1 / Rapier 0.33'te. JS 0.21.0 → Rapier 0.36 üstünde, yani düzeltmeyi içerir. Ama `@react-three/rapier` 0.19.2'ye pinli → düzeltmeden ÖNCE. | github issue #910 + CHANGELOG ✔ |
| K7 | Rapier JS **0.21.0 (2026-09-24)**: `SoftBodyDesc.rope / cloth / sphere / cuboid`, yırtılma/kesme, `SoftBody.particlePositions(): Float32Array`, snapshot'a soft body dahil. `rapier.js` deposu 2026-07-12'de arşivlendi; JS bağlamaları ana `dimforge/rapier` deposunun `bindings/typescript` klasörüne taşındı. npm paketleri yayınlanmaya devam ediyor (0.21.0, 2026-09-25). | CHANGELOG + soft_body.ts + softBodies.ts demo + repo sayfası ✔ |
| K8 | Remotion'un `spring()` fonksiyonu 0→1 arası, her kareyi sıfırdan (önbellekli) hesaplayan deterministik bir sönümlü yay. Doğrusal olduğu için **yeni hedef/itki = ötelenmiş spring'lerin toplamı** (superposition). | `spring-utils.ts` okundu ✔ |
| K9 | Remotion resmî olarak: GSAP için `@remotion/gsap` (v4.0.517+; duraklatılmış timeline'ı kareye seek eder, callback/play/seek'i yasaklar), Anime.js için örnek repo, Matter.js için "bake" örnekleri; Framer Motion entegrasyonu YOK; react-spring "doğrudan uyumlu değil, kendi spring()'ini kullan". | remotion.dev/docs/third-party + /docs/gsap ✔ |
| K10 | Remotion maintainer'ı (Jonny Burger) fizik için "bake" yaklaşımını onayladı: Matter.js ile 900 kareyi önceden simüle et, dizide sakla, zaman çizelgesinde indeksle; "kendi Matter.js fork'um fazla mühendislikti, senin yaklaşım daha iyi". | remotion-dev discussions #4373 ✔ |

---

## 3. Alan tabloları

### 3.1 Alan 1 – Fizik motorları (JS/WASM)

| Repo | ★ | son commit | lisans | ne yapar | determinizm / headless / Remotion uyumu | entegr. zorluğu | değer (1–5) | doğrulama |
|---|---|---|---|---|---|---|---|---|
| [dimforge/rapier](https://github.com/dimforge/rapier) (JS: `@dimforge/rapier3d(-compat)`, `-deterministic(-compat)`, `-simd`) | 5.9k | 2026-10-10 (npm JS 0.21.0: 2026-09-25) | Apache-2.0 | Rust 2D/3D motor; JS/WASM bağlamaları (artık `bindings/typescript`), CCD, eklemler, karakter denetleyici, soft body (ip/kumaş/jöle), snapshot | **✓** `-deterministic-compat` + sabit `world.timestep` + sabit oluşturma sırası + `takeSnapshot/restoreSnapshot` (BVH hatası düzeltildi). Dokümana göre Math.sin/cos ile üretilen başlangıç değerleri platformlar arası farklı olabilir (aynı makinede sorun yok). wasm 3.1 MB (compat js 4.3 MB base64). Node'da çalışır → bake | düşük–orta | **5** | ✔ (README, CHANGELOG, kaynak, doküman). Çalıştırılmadı. Soft body'nin determinizmi ayrıca belgelenmemiş → ✖ (hash testiyle doğrula) |
| [pmndrs/react-three-rapier](https://github.com/pmndrs/react-three-rapier) (`@react-three/rapier` 2.2.0) | 1.5k | 2025-11-03 | MIT | R3F sarmalayıcı: `<Physics>`, `<RigidBody>`, manuel `step` | **✗** `useFrame` + delta birikimcisi + lerp; Remotion'da delta duvar saati (K1); rapier 0.19.2'ye pinli; oluşturma sırası React efektlerine bağlı ("sıra değişirse gövdeler karışır" README uyarısı). | — | 1 | ✔ |
| [pmndrs/ecctrl](https://github.com/pmndrs/ecctrl) | 807 | 2026-09-06 | MIT | R3F+Rapier fizik tabanlı karakter/araç denetleyici | **✗** `useFrame` + klavye/etkileşim; gerçek zamanlı oyun için | — | 1 | ◐ |
| [jrouwe/JoltPhysics.js](https://github.com/jrouwe/JoltPhysics.js) (`jolt-physics` 1.1.0) | 579 | 2026-08-23 (npm 2026-07-11) | MIT | Jolt'un emscripten portu: 7 derleme (wasm-compat, asm, çok-iş-parçacıklı…), `SaveState/RestoreState`, soft body, kısıtlar, sanal karakter, araç | **△/✓** Jolt aynı ikili + aynı API sırası ile deterministik; çapraz-platform için `CROSS_PLATFORM_DETERMINISTIC=ON` (≈%8 yavaş) hazır pakette açık değil → ssadece aynı makinede güvenli. wasm 2.0 MB; "wasm-compat" tek dosya. IDL'de Ragdoll/Skeleton sınıfı YOK (eklem zincirini elle kurarsın). | orta | 4 | ✔ (README, IDL, Jolt docs "Deterministic Simulation") |
| [jrouwe/JoltPhysics](https://github.com/jrouwe/JoltPhysics) (C++ çekirdek) | 11.7k | ? | MIT | Horizon Forbidden West'te kullanılan motor | determinizm bölümü: aynı API sırası + aynı ikili; "Rolling Back" bölümü SaveState ile | — | (referans) | ✔ |
| [isaac-mason/crashcat](https://github.com/isaac-mason/crashcat) (`crashcat` 0.0.5) | 463 | 2026-07-20 (npm 2026-07-06) | MIT | **Saf JS/TS** 3D motor, ağaç-sallanabilir; kısıtlar+motor/yay, CCD, ragdoll/araç/karakter demoları, three debug renderer | **✓** WASM yok; dünya düz JSON (`JSON.stringify` = snapshot). README: aynı başlangıç + aynı işlem sırası + sabit dt; "determinizm derinlemesine test edilmedi" ve `Math.sin/cos` uyarısı. Alfa (0.0.x). Soft body yok. | düşük | 4 | ✔ (README bölümleri okundu) |
| [BabylonJS/havok](https://github.com/BabylonJS/havok) (`@babylonjs/havok` 1.3.14) | 38 | ? (npm 2026-07-29) | npm: MIT (sarmalayıcı); motor ikilisi kapalı kaynak, şartları DOĞRULANAMADI | Havok wasm, Babylon.js `HavokPlugin` ile | determinizm belgelenmemiş ✖; three ile doğrudan kullanım kolay değil | yüksek | 1 | ◐ |
| [kripken/ammo.js](https://github.com/kripken/ammo.js) (Bullet 2.82) | 4.6k | 2026-09-22 | zlib | Bullet portu; üç.js örnekleri (cloth/rope/break) bunu kullanır | △ determinizm belgelenmemiş ✖; 16 MB yığın; eski Bullet | orta | 2 | ◐ |
| [pmndrs/cannon-es](https://github.com/pmndrs/cannon-es) (`cannon-es` 0.20.0) | 2.1k | 2024-01-06 (npm 2022-08-12) | MIT | Saf JS, küçük (0.35 MB) | △ saf JS, adım sayısını sen yönetirsin; snapshot API yok, README determinizmden hiç söz etmiyor; bakım durdu | düşük | 2 | ✔ |
| [pmndrs/use-cannon](https://github.com/pmndrs/use-cannon) (`@react-three/cannon` 6.6.0) | 3.0k | 2024-02-25 | MIT | R3F kancaları + web worker | **✗** worker + useFrame; bakımsız | — | 1 | ✔ |
| [lo-th/Oimo.js](https://github.com/lo-th/Oimo.js) / [saharan/OimoPhysics](https://github.com/saharan/OimoPhysics) | 3.2k / 959 | 2021-07-08 / 2025-05-18 | MIT / MIT | Eski/hafif; OimoPhysics Haxe→JS (1.2.5) | ✖ determinizm belgesiz; Oimo.js "PHY"ye yönlendiriyor | orta | 1 | ◐ |
| [erincatto/box3d](https://github.com/erincatto/box3d) + [monteslu/box3d-wasm](https://github.com/monteslu/box3d-wasm) (`box3d-wasm` 0.2.0) | 6.6k / 29 | 2026-10-15 / 2026-07-31 | MIT / MIT | Box2D yazarının yeni 3D motoru (C17), özellik listesinde "Cross platform determinism" + "Recording and replay"; v0.1.0 etiketi; topluluk WASM bağlaması (SIMD, snapshot yok) | △ umut verici ama çok genç, JS bağlaması üç kişilik/29★; PR kapalı | yüksek | 2 (izle) | ◐ (README okundu: determinizm iddiası var, kapsamı belgesiz) |
| [fabmax/physx-js-webidl](https://github.com/fabmax/physx-js-webidl) (`physx-js-webidl` 2.8.0) | 183 | 2026-09-27 | MIT | NVIDIA PhysX 5.11 wasm: araç, eklem, articulation, karakter, sahne serileştirme | determinizm belgesiz ✖; paket 10 MB | yüksek | 2 | ◐ |
| [zalo/mujoco_wasm](https://github.com/zalo/mujoco_wasm) + resmi `@mujoco/mujoco` 3.16.0 (DeepMind) | 491 / – | 2026-08-21 / npm 2026-10-14 | MIT / Apache-2.0 | Eklemli sistemler/robotik; resmi WASM bağlaması | △ determinizm belgesiz; ragdoll/aktif ragdoll için bilimsel ama ağır, XML model gerekir | yüksek | 2 | ◐ |
| [piqnt/planck.js](https://github.com/piqnt/planck.js) (`planck` 1.5.1) | 5.3k | 2026-10-14 | MIT | Box2D 2D portu | △ sadece 2D; README determinizm demiyor; `planck-deterministic` fork'u (0★, kanıtsız) çıplak libm uyarısı yapıyor | düşük | 2 (yalnız 2D ihtiyaç) | ◐ |
| [erincatto/box2d](https://github.com/erincatto/box2d) / [Birch-san/box2d3-wasm](https://github.com/Birch-san/box2d3-wasm) (5.2.0) | 10.4k / 66 | ? / 2026-02-16 | MIT | 2D v3 (Soft Step solver) wasm | 2D; determinizm iddiası sayfada YOK ✖ | orta | 1 | ◐ |
| [liabru/matter-js](https://github.com/liabru/matter-js) (0.20.0) | 18.5k | 2026-09-30 (npm 2024-06-23) | MIT | 2D | **✗/△** #1190'da kullanıcılar sabit dt ile bile sapma bildirdi (cached pairs/detector), "çoklu oyuncuya uygun değil". Remotion "bake" örnekleri Matter.js ile var ama yalnız tek-süreçli pişirme ile güvenli. | düşük | 1 | ✔ (issue) |
| [schteppe/p2.js](https://github.com/schteppe/p2.js) / [pmndrs/p2-es](https://github.com/pmndrs/p2-es) | 2.7k / 143 | 2018-04-08 / ? | ? / ? | 2D | ölü/yarı ölü | — | 1 | ◐ |
| [subprotocol/verlet-js](https://github.com/subprotocol/verlet-js) | 3.8k | 2014-05-02 | MIT | parçacık+kısıt Verlet (kumaş, örümcek ağı) | ölü ama 200 satırlık fikir; kendi Verlet'ini yazmak daha güvenli | düşük | 2 (referans) | ✔ |
| [chandlerprall/Physijs](https://github.com/chandlerprall/Physijs), [enable3d/enable3d](https://github.com/enable3d/enable3d) | 2.9k / 1.2k | ? / 2026-08-31 | MIT / **LGPL-3.0** | ammo.js sarmalayıcıları | worker/oyun döngüsü; enable3d LGPL | — | 1 | ◐ |
| [three.js `RapierPhysics.js`/`JoltPhysics.js` eklentileri](https://github.com/mrdoob/three.js/tree/dev/examples/jsm/physics) | – | – | MIT | örnek sarmalayıcı | **✗** `setInterval` + `Timer` (K2) | — | 0 | ✔ |
| `three-jolt`, `@react-three/jolt` (0.0.1, 2024), `r3f-jolt` (7★) | – | – | – | `three-jolt` adlı paket bulunamadı (npm 404); `@react-three/jolt` "pre-alpha" | — | — | 0 | `three-jolt` ✖ |

### 3.2 Alan 2 – Remotion + fizik entegrasyon kalıpları

| Kaynak | ★ | son commit | lisans | ne yapar | uyum | zorluk | değer | doğrulama |
|---|---|---|---|---|---|---|---|---|
| [Remotion Discussion #4373 "Physics Engine, Baking"](https://github.com/orgs/remotion-dev/discussions/4373) | – | 2024-12 | – | Matter.js ile 900 kareyi önceden simüle et, dizide sakla, kareye göre indeksle; maintainer onayladı ve "third-party" dokümanına ekledi | ✓ (bake kalıbı) | düşük | 5 (kalıp) | ✔ |
| [hylarucoder/remotion-physics](https://github.com/hylarucoder/remotion-physics) | 16 | ? | ? | "Remotion + Matter.js": PhysicsAnimation, PoolGame, Fireworks videoları | △ yöntem README'de yok | düşük | 2 | ◐ (kaynak okunmadı) |
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion) `random()`, `spring()`, `@remotion/noise` 4.0.535, `@remotion/motion-blur` | 64.3k | 2026-10-12 (npm) | Remotion lisansı (özel) / MIT alt paketler | tohumlu rastgele, spring, simplex gürültü, hareket bulanıklığı | ✓ | düşük | 5 | ✔ |
| `@remotion/gsap` 4.0.535 (`useGsapTimeline`) | – | 2026-10-12 | MIT | duraklatılmış GSAP timeline'ını kareye seek eder; callback/play/seek yasak | ✓ DOM/SVG; three nesnelerine bağlama için düz JS nesnesi tween'leyip değer okuma → ✖ (örnek yok) | düşük | 3 | ✔ (doküman) |
| `@remotion/animation-utils` (4.0.92+) | – | – | MIT | **CSS stil** interpolasyonu (`interpolateStyles`, `makeTransform`) | △ yalnız DOM; three için işe yaramaz | – | 1 | ✔ |
| [remotion-dev/template-three](https://github.com/remotion-dev/template-three) | 113 | ? | MIT | telefon+video şablonu | ✓ ama fizik yok | – | 1 | ◐ |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | 5.2k | ? | ? | AI ajan becerileri; "3d"/"physics" kural dosyası sayfada görünmedi | – | – | 1 | ◐ (3d kuralı ✖) |
| Remotion docs: `ThreeCanvas` notu | – | – | – | `layout="none"` Sequence içinde; `gl: 'angle'`; `ThreeWebGPUCanvas` da var (TSL) | WebGPU, SwiftShader konteynerinde ✖ (test edilmedi) | – | – | ✔ |

### 3.3 Alan 3 – Yumuşak cisim / kumaş / ip / su / yıkım / ragdoll

| Repo | ★ | son commit | lisans | ne yapar | uyum | zorluk | değer | doğrulama |
|---|---|---|---|---|---|---|---|---|
| Rapier 0.21 `SoftBodyDesc.rope/cloth/sphere/cuboid` | (bkz. Rapier) | 2026-09/10 | Apache-2.0 | çamaşır ipi, bayrak, balon, jöle; yırtma/kesme; `particlePositions()` Float32Array | ✓ bake; soft-body determinizmi ayrıca test edilmeli | orta | **5** | ✔ (demo + kaynak) |
| Jolt JS soft body (IDL: `SoftBodySharedSettings`, `SoftBodyCreationSettings`, `SoftBodyVertex`) | – | – | MIT | kumaş/balon | △ | yüksek | 3 | ✔ (IDL) |
| [dgreenheck/three-pinata](https://github.com/dgreenheck/three-pinata) (`@dgreenheck/three-pinata` 2.0.1) | 448 | 2026-05-12 | MIT | Voronoi/düzlem ile mesh kırma; `seed` seçeneği; manifold mesh şart; 10–50 parça önerilir; parçalar için Rapier konveks gövde örneği | **✓** çevrimdışı çatlat → parça geometrisini sabitle → Rapier'a ver | orta | 4 | ✔ |
| [mattvb91/rapierjs-ragdoll](https://github.com/mattvb91/rapierjs-ragdoll) | 22 | 2026-05-10 | MIT | Rapier + küresel eklemlerle kemiğe-bağlı ragdoll | ✓ bake; kemik isimleri `Ragdoll.ts`'e göre | orta | 3 | ✔ |
| crashcat ragdoll örneği | – | – | MIT | ragdoll, araç, floating karakter demoları | ✓ | orta | 3 | ◐ |
| three.js örnekleri `physics_ammo_cloth/rope/break/volume` | – | – | MIT | referans uygulamalar (ammo.js) | △ referans | – | 2 | ✔ (files.json) |
| [subprotocol/verlet-js](https://github.com/subprotocol/verlet-js), [matthias-research/pages](https://github.com/matthias-research/pages) ("Ten Minute Physics": PBD/FLIP vb.) | 3.8k / 922 | 2014 / ? | MIT / LICENSE dosyası görünmedi | öğretici Verlet/PBD/FLIP demoları | △ fikir/algoritma al, kodu doğrudan alma (lisans ✖) | düşük | 3 | ◐ |
| [google/liquidfun](https://github.com/google/liquidfun) | 4.9k | arşiv 2026-02-13 | ? | 2D parçacık sıvı | ✗ arşivlenmiş | – | 0 | ✔ |
| [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) 16.7k MIT; [jeantimex/fluid](https://github.com/jeantimex/fluid) 136★ MIT (WebGPU SPH/FLIP) | – | ? | MIT | GPU gerçek-zamanlı sıvı | ✗ SwiftShader'da pahalı / WebGPU | – | 1 | ◐ |
| [google-deepmind/mujoco](https://github.com/google-deepmind/mujoco) `@mujoco/mujoco` | – | npm 2026-10-14 | Apache-2.0 | eklemli rijit sistem; aktif ragdoll için bilimsel | ağır | yüksek | 2 | ◐ |
| Su sıçraması önerisi | – | – | – | Motor yok: kapalı-form balistik parçacıklar `pos = p0 + v0·t + ½g·t²`, tohumlu `random()`, `points`/`InstancedMesh` | ✓ | düşük | 5 | tasarım önerisi |

### 3.4 Alan 4 – Karakter animasyonu (iskelet, IK, retarget, içerik)

| Repo / kaynak | ★ | son commit | lisans | ne yapar | uyum | zorluk | değer | doğrulama |
|---|---|---|---|---|---|---|---|---|
| three `AnimationMixer.setTime(t)` | – | dev | MIT | sıfırla + `update(t)`; elle `action.time`, `setEffectiveWeight` ile "pozu t anında hesapla" | **✓** fades yerine ağırlıkları kare fonksiyonu olarak ver; `mixer.update(0)` ile uygula (prototiple doğrula) | düşük | 4 | ✔ (kaynak) |
| three `SkeletonUtils.retargetClip/retarget` | – | dev | MIT | farklı iskelet isimlerine klip aktarımı | ✓ çevrimdışı bake | orta | 4 | ✔ |
| three `CCDIKSolver` | – | dev | MIT | CCD IK (MMD'den) | ✓ saf `update()` | düşük | 3 | ✔ |
| three örnekleri `webgl_animation_walk`, `_skinning_ik`, `_skinning_blending`, `_additive_blending`, `webgpu_animation_retargeting(_readyplayer)` | – | – | MIT | referans | – | – | 3 | ✔ (files.json) |
| [jsantell/THREE.IK](https://github.com/jsantell/THREE.IK) (`three-ik` 0.1.0, 2018) | 589 | ? (npm 2018) | MIT | FABRIK, WIP uyarısı | △ eski | orta | 2 | ✔ (sayfa) / son commit ✖ |
| [gkjohnson/closed-chain-ik-js](https://github.com/gkjohnson/closed-chain-ik-js) (0.0.3) | 322 | 2026-10-13 (yalnız bağımlılık bump) | Apache-2.0 | genel IK (DLS), çekirdek three'den bağımsız | ✓ saf hesap; insan ayağı için gereğinden ağır | orta | 2 | ✔ |
| [sketchpunklabs/ossos](https://github.com/sketchpunklabs/ossos) | 506 | 2023-03-30 | MIT | web karakter animasyon sistemi: IK (Limb, FABRIK, CCD, Spring…), kemik yayları, retarget, DQ skinning | ✓ saf hesap; **okunacak referans** (bakımsız) | orta | 3 | ✔ |
| [pixiv/three-vrm](https://github.com/pixiv/three-vrm) 3.5.5 + `three-vrm-animation` | 2.2k | 2026-09-09 | MIT | VRM yükleme, **spring bone** (`update(delta)` durumlu), VRMA klipleri | △ spring bone sıralı adım ister → bake/önbellek; VRM karakter yoksa gereksiz | orta | 2 | ✔ (spring bone kaynağı) |
| [jango-git/animouse](https://github.com/jango-git/animouse) (0.8.0) | 1 | 2026-01-31 | MIT | AnimationMixer üstüne durum makinesi + 1D/2D blend tree; zaman olayları animasyon zamanından | △ `update(dt)` ile sabit dt besle; 1★ → **fikir ödünç al** | düşük | 2 | ✔ (README) |
| [statelyai/xstate](https://github.com/statelyai/xstate) 5.33.2 | 30.3k | ? | MIT | durum makineleri | △ saf geçiş fonksiyonu kullanılabilir (doğrulanmadı) | orta | 2 | ◐ (saflık ✖) |
| **Quaternius Universal Animation Library 1 & 2** ([sayfa](https://quaternius.com/packs/universalanimationlibrary.html)) | – | 2025-03 / 2026-01 | CC0 (sayfada); **yeni QAL v1.0** (2026-08-28) | 120+ / 130+ klip, evrensel insansı rig; 8 yönlü yürüme/koşu/sprint, oturma, emote… FBX/GLB/Blend | ✓ içerik | orta (bake) | **5** | ✔ |
| **Quaternius Universal Base Characters** (2025-08) | – | 2025-08 | CC0 | 6 insan modeli, humanoid rig, FBX/glTF | ✓ | orta | 4 | ✔ |
| Quaternius Ultimate Animated Animals (12 hayvan, 12+ klip, 2021), Farm Animal, Animated Men/Women, Ultimate Animated Character (50+) | – | – | CC0 | hayvan/insan paketleri; **köpek/kedi içerip içermediği DOĞRULANAMADI** | ✓ | orta | 3 | ◐ |
| **KayKit Character Animations** ([itch](https://kaylousberg.itch.io/kaykit-character-animations)) + Adventurers | – | güncel (29 gün önce) | CC0 | ücretsiz sürümde 150+ insansı klip (yürüme, koşu, oturma, kalp/selam/emote), Rig_Medium/Large | ✓ | orta | 4 | ✔ |
| **Kenney Animated Characters 1/2/3** | – | – | CC0 | model başına 3 klip (idle, jump, run) | ✓ ama kısıtlı | düşük | 1 | ✔ (itch sayfası) |
| **Mixamo** | – | – | Adobe şartları: projelerde ticari kullanım serbest, ham dosya dağıtımı yasak | büyük klip kütüphanesi (dans dahil) | △ repoya ham dosya koyma riski; makine öğrenmesi eğitimi yasak (topluluk SSS, 2022) | düşük | 3 | ◐ |
| **Ready Player Me** | – | – | – | **2026-01-31'de kapandı** (Netflix devraldı 2025-12-19) | ✗ | – | 0 | ◐ (birden çok kaynak, bir kısmı rakip bloğu) |
| [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) 2.0k MIT, [pmndrs/gltfjsx](https://github.com/pmndrs/gltfjsx) 5.9k MIT, [facebookincubator/FBX2glTF](https://github.com/facebookincubator/FBX2glTF) 2.4k BSD-3 | – | – | – | glTF araçları: `resample`, `prune`, `dedup`; FBX→GLB | ✓ yapı araçları | düşük | 3 | ◐ |
| [mixamo_converter](https://github.com/enziop/mixamo_converter) (GPL-3.0) | 820 | ? | GPL-3.0 | Blender eklentisi | araç olarak ok, kodu karıştırma | – | 1 | ◐ |
| KeeMap (Blender retarget eklentisi) | – | – | – | – | – | – | – | ✖ (`nkeeline/Keemap-Blender-Rig-Transfer` 404; doğru repo adı bulunamadı) |
| [orangeduck/Motion-Matching](https://github.com/orangeduck/Motion-Matching) | 923 | ? | MIT | Learned Motion Matching referansı (C/C++) | ✗ web/Remotion için fazla; fikir | yüksek | 1 | ◐ |

**Proje kaynak politikası bağlantısı (CLAUDE.md):** kaynaklar `ledger.json`'a lisans etiketiyle yazılıyor ve reklam öncesi `npm run audio:audit -- <bölüm> --commercial` var. Bu araştırmadaki içerik paketleri (Quaternius UAL/UBC, KayKit, Kenney: CC0 ya da QAL; Mixamo: Adobe şartları) aynı deftere işlenmeli; özellikle Quaternius için "indirme tarihi + o günkü lisans sürümü (CC0 mu QAL v1.0 mı)" kaydedilmeli, Mixamo için "ham dosya dağıtılmadı" notu düşülmeli.

**Quaternius lisans notu:** UAL sayfaları hâlâ "CC0" yazıyor, ama `quaternius.com/license.html` 2026-08-28 tarihli **QAL v1.0**'ı yayımladı: projede kullanım/ticari kullanım serbest, atıf gerekmiyor, **varlıkları bağımsız varlık/paket olarak yeniden dağıtmak yasak**; "indirdiğin sürümün lisansı geçerlidir" maddesi var. Video üretimi için sorun yok; GLB'leri herkese açık bir depoya koymak gri alandır → depoyu özel tut ya da yalnızca bake edilmiş JSON'u koy.

### 3.5 Alan 5 – Hareket "his" kütüphaneleri

| Repo | ★ | son commit/sürüm | lisans | ne yapar | determinizm/kare uyumu | zorluk | değer | doğrulama |
|---|---|---|---|---|---|---|---|---|
| Remotion `spring()` + `measureSpring()` + `interpolate(Easing)` | – | 4.0.535 | özel/MIT | deterministik yay | **✓** | düşük | 5 | ✔ (kaynak) |
| Kendi kapalı-form "exact spring damper" (Daniel Holden, [spring-roll-call](https://theorangeduck.com/page/spring-roll-call): Exact Damper, Exact/Critical Spring Damper, half-life) | – | – | makale | kare-hızından bağımsız yaylar | **✓** | düşük | 5 | ✔ (makale okundu; kod kopyalanmadı) |
| [GSAP](https://github.com/greensock/GSAP) 3.15.0 | 29.3k | 2026-04-13 | "no charge" (Webflow; son kullanıcıdan ücret alınmayan her kullanım serbest; Webflow'la rekabet eden görsel animasyon araçları yasak) | timeline | **✓** `@remotion/gsap` ile seek | düşük | 3 | ✔ (lisans sayfası) |
| [anime.js](https://github.com/juliangarnier/anime) 4.5.0 | 73.6k | 2026-06-22 | MIT | timeline; `Timer.seek(ms)`, `engine.useDefaultMainLoop` (tip dosyalarında doğrulandı); `utils.random` `Math.random` kullanır | **✓** seek ile; Remotion örnek deposu var | düşük | 3 | ✔ (tip dosyaları) |
| [motiondivision/motion](https://github.com/motiondivision/motion) (framer-motion 14.3.0) | 34.2k | 2026-10-15 | MIT | React animasyon | **✗** Remotion: "entegrasyon yok" | – | 1 | ✔ |
| [pmndrs/react-spring](https://github.com/pmndrs/react-spring) (`@react-spring/three` 10.1.2) | 29.2k | 2026-10-01 | MIT | yaylar, rAF döngüsü | **✗** Remotion: "kendi spring()'ini kullan" | – | 1 | ✔ |
| popmotion 11.0.5 | – | 2022 | MIT | `spring({from,to,...})` jeneratörü **kapalı-form `resolveSpring(t)`** (kaynakta doğrulandı) | ✓ saf fonksiyon olarak | düşük | 2 | ✔ |
| [tweenjs/tween.js](https://github.com/tweenjs/tween.js) 25.0.0 | 10.1k | 2024-07-26 | MIT | `update(time)` dışarıdan zaman alır | ✓ | düşük | 2 | ◐ |
| [Theatre.js](https://github.com/theatre-js/theatre) 0.7.2 | 12.8k | 2024-04-11 (README: geliştirme geçici olarak özel depoda) | core Apache-2.0, studio **AGPL-3.0** | görsel zaman çizelgesi editörü + r3f | △ `sequence.position` kareyle sürülebilir (doğrulanmadı); stüdyo yalnız tasarımda | orta | 2 | ◐ |
| [pmndrs/maath](https://github.com/pmndrs/maath) | 1.3k | ? (npm 2024-07) | MIT | `easing.damp` (nesne üzerinde `__damp` durumu), tohumlu random | △ damp sıralı durum ister; `random` modülündeki bazı parçalar `Math.random` | düşük | 2 | ✔ (dist grep) |
| Disney 12 prensip "skill" paketleri (dylantarre/animation-principles) | – | – | ? | prompt rehberleri | – | – | 1 | ◐ |

### 3.6 Alan 6 – Kalabalık ve YZ yönlendirme

| Repo | ★ | son commit | lisans | ne yapar | determinizm / uyum | zorluk | değer | doğrulama |
|---|---|---|---|---|---|---|---|---|
| [Mugen87/yuka](https://github.com/Mugen87/yuka) (0.7.8) | 1.4k | **2023-01-16** (npm 2022-09) | MIT | steering (flocking, separation…), navmesh, grafik/A*, durum makinesi, bulanık mantık, JSON serileştirme | △/✓ `EntityManager.update(delta)` elle sürülür; `Math.random` yalnız `WanderBehavior` ve `NavMesh.getRandomRegion`'da (kaynakta doğrulandı) → yama/kullanma; sabit dt + önbellek. Bakımsız ama stabil. | düşük | 4 | ✔ |
| [isaac-mason/recast-navigation-js](https://github.com/isaac-mason/recast-navigation-js) (0.43.1) | 432 | 2026-02-04 | MIT | Recast/Detour wasm: navmesh üretimi, Crowd, TileCache engeller; README: "sabit adım + interpolasyon" deterministik, "değişken adım deterministik değil" | ✓ `crowd.update(sabit dt)` ile; yazar artık navcat'ı öneriyor | orta | 4 | ✔ |
| [isaac-mason/navcat](https://github.com/isaac-mason/navcat) (0.4.1) | 296 | 2026-07-09 | MIT | **saf JS** Recast benzeri navmesh + `navcat/blocks` crowd (ajan/duvar kaçınma, off-mesh), JSON-serileştirilebilir; rastgele nokta fonksiyonları `rand` parametresi alır | ✓ `Math.random` yerine tohumlu rand ver | orta | 4 | ✔ |
| [donmccurdy/three-pathfinding](https://github.com/donmccurdy/three-pathfinding) (1.3.0) | 1.4k | 2026-10-06 | MIT | navmesh yolu (huni algoritması) | ✓ saf sorgu | düşük | 3 | ✔ |
| [oguzeroglu/Kompute](https://github.com/oguzeroglu/Kompute) | 30 | 2021-10-18 | MIT | steering | bakımsız | – | 1 | ✔ |
| [qiao/PathFinding.js](https://github.com/qiao/PathFinding.js) 8.7k MIT; easystarjs 0.4.4 | – | npm 2016 / 2020 | MIT | ızgara A*, JPS | ✓ ama ızgara | düşük | 2 | ◐ |
| ORCA/RVO2: [snape/RVO2](https://github.com/snape/RVO2) (C++, 977★, Apache-2.0), [TNOCS/rvo2](https://github.com/TNOCS/rvo2) (node-gyp, 5★) | – | ? | Apache-2.0 | ORCA | **✗** tarayıcıya hazır, bakımlı **saf JS ORCA bulunamadı** (aramalarda yok); native eklenti Remotion paketine girmez. Gerekirse ~150 satır ORCA'yı kendin portla ya da navcat crowd kullan | – | 1 | ✔ (arama sonucu: bulunamadı) |
| [sweriko/Horde](https://github.com/sweriko/Horde) | 111 | ? | MIT | WebGPU/TSL oktahedral empostor kalabalık **render** | ✗ WebGPU, sadece çizim | – | 1 | ◐ |
| Boids: three örneği `webgl_gpgpu_birds` (GPU, pahalı), [Str4y-Cat/three-boids](https://github.com/Str4y-Cat/three-boids) (2★), `boids` npm (2016) | – | – | MIT | sürü | seed seçeneği yok → kendi tohumlu boids'ini yaz (Yuka Flocking de var) | düşük | 2 | ◐ |
| [movsim/traffic-simulation-de](https://github.com/movsim/traffic-simulation-de) | 1.1k | ? | **GPL-3.0** | IDM + MOBIL araç takibi/şerit değiştirme (2D canvas, `setInterval`) | ✗ GPL bulaşır; **modeller (IDM/MOBIL) kamu bilgisi**, formülü kendin yaz | – | 2 (fikir) | ✔ |

### 3.7 Alan 7 – Prosedürel hareket (rüzgâr, su, bulut, duman, ateş, kuş, böcek, balık)

| Repo / kaynak | ★ | son commit | lisans | ne yapar | uyum | zorluk | değer | doğrulama |
|---|---|---|---|---|---|---|---|---|
| [FarazzShaikh/THREE-CustomShaderMaterial](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) | 1.3k | ? | MIT | standart malzemeye `csm_Position` ile vertex kaydırma (rüzgâr) | **✓** `uTime = frame/fps` ver | düşük | 4 | ◐ |
| [dgreenheck/ez-tree](https://github.com/dgreenheck/ez-tree) | 1.7k | ? | MIT | prosedürel ağaç; `tree.update(time)` ile rüzgâr; `seed` | ✓ `time = frame/fps` ver; low-poly stilimize uymayabilir | düşük | 2 | ◐ |
| [Alchemist0823/three.quarks](https://github.com/Alchemist0823/three.quarks) (0.17.1) | 1.1k | 2026-05-21 | MIT | parçacık/VFX; `batchRenderer.update(delta)`; tohum seçeneği belgesiz | △ `Math.random` global yamalı + sabit dt + ön-ısıtma; yazılım GL'de pahalı olabilir | orta | 2 | ◐ |
| three-nebula 13.3.0 (npm 2026-09-19), wawa-vfx 1.2.10 (2025-09) | – | – | MIT | parçacık | ✖ incelenmedi | – | 1 | ✖ |
| three örnekleri: `webgl_shaders_ocean`, `webgpu_ocean/water`, `webgl_gpgpu_birds`, `webgpu_compute_*` (cloth, birds, snow, rain, fluid), `Water.js`, `Sky.js` | – | – | MIT | referans | `webgl_shaders_ocean` ✓ (uTime), compute/WebGPU örnekleri ✗ | düşük | 3 | ✔ (files.json) |
| drei `Float/Cloud/Sparkles/MeshWobbleMaterial` | 10.0k | – | MIT | hazır bileşenler | **✗** K4 (useFrame+clock+Math.random). Sadece mantığı kopyala, `useFrame` yerine `useCurrentFrame()` kullan | – | 1 | ✔ |
| [jbouny/fft-ocean](https://github.com/jbouny/fft-ocean) (354★ MIT) | – | ? | MIT | FFT okyanus | ✗ ağır fragment | – | 1 | ◐ |
| flag-cloth 0.1.2 (npm), skunami.js | – | – | MIT | bayrak Verlet / su etkileşimi | ✖ depo bulunamadı / incelenmedi | – | 1 | ✖ |
| **Öneri (kütüphanesiz):** baca dumanı, kar, yaprak, kuş, kelebek, balık = `pos(i,t) = f(seed_i, frame)` kapalı-form parçacıklar (doğum kareleri tohumlu, ömür döngüsel), `InstancedMesh`/`points`; rüzgârda çamaşır/bayrak = vertex shader sinüs + gürültü (uTime kare/fps) | – | – | – | – | ✓ | düşük | 5 | tasarım |

### 3.8 Alan 8 – Hareket yakalama / animasyon üretimi

| Repo | ★ | son commit | lisans | ne yapar | gerçekçi mi? | doğrulama |
|---|---|---|---|---|---|---|
| [Tencent-Hunyuan/HY-Motion-1.0](https://github.com/Tencent-Hunyuan/HY-Motion-1.0) | 2.6k | 2026-07-18 | Tencent Community (AB, Birleşik Krallık, G. Kore **hariç**; >1M MAU ise ayrı lisans) | 1B/0.46B DiT metinden-3B-insan hareketi | ✗ 24–26 GB VRAM; GPU yok | ✔ (lisans metni + README) |
| [EricGuo5513/momask-codes](https://github.com/EricGuo5513/momask-codes) | 1.3k | 2024-09 (arama) | MIT (SMPL/PyTorch3D bağımlılıkları kendi lisanslarıyla) | metinden hareket, **BVH + (nframe,22,3) eklem** çıktısı, 20 fps, WebUI **CPU'da çalışır** | △ çevrimdışı deney olarak mümkün; kalite/ayak kayması ("naive IK bazen başarısız"); Quaternius klipleri varken gereksiz | ✔ (README) |
| [GuyTevet/motion-diffusion-model](https://github.com/GuyTevet/motion-diffusion-model) | 4.1k | ? | MIT | MDM; CUDA GPU şart | ✗ | ✔ |
| [OpenMotionLab/MotionGPT](https://github.com/OpenMotionLab/MotionGPT) | 2.0k | 2025-07 (arama) | MIT (+bağımlılık lisansları) | LLM ile hareket | ✗ | ✔ |
| [google-ai-edge/mediapipe](https://github.com/google-ai-edge/mediapipe) | 37.3k | – | Apache-2.0 | video→poz (JS Tasks) | △ video girdi gerektirir; bizde kaynak video yok | ◐ |
| [yeemachine/kalidokit](https://github.com/yeemachine/kalidokit) | 5.7k | ? | MIT | MediaPipe→VRM/Live2D çözücü; **"officially deprecated"** | ✗ | ✔ |
| [facebookresearch/VideoPose3D](https://github.com/facebookresearch/VideoPose3D) | 4.0k | arşiv 2023-10-31 | **CC BY-NC** | 3B poz | ✗ ticari olmayan + arşiv | ✔ |
| [CMU OpenPose](https://github.com/CMU-Perceptual-Computing-Lab/openpose) | 34.5k | ? | ticari olmayan | 2B/3B poz | ✗ | ✔ |
| [zju3dv/GVHMR](https://github.com/zju3dv/GVHMR) | 2.1k | ? | LICENSE dosyası var, türü okunamadı | videodan SMPL | ✖ lisans + SMPL | ◐ |
| [cgtinker/BlendArMocap](https://github.com/cgtinker/BlendArMocap) | 1.1k | – | GPL-3.0 | Blender+MediaPipe; **"bakımı bıraktım"** | ✗ | ✔ |
| CMU mocap verisi (BVH) | – | – | "araştırma ve ticari projelerde serbest, kaynak göster; yeniden satma" (arama alıntısı) | ham BVH | △ ayak kayması/titreme; three `BVHLoader` var | ◐ |
| three `BVHLoader`, `AnimationClipCreator` | – | – | MIT | – | ✓ | ✔ |

**Dürüst değerlendirme:** Metinden-harekete ve video→poz bu proje için **gereksiz**: ihtiyaç duyulan klipler (yürü, koş, otur, el salla, tepki, dans) CC0/QAL paketlerde hazır; 27 yüzsüz figürde ince hareket kalitesi zaten stilize. En fazla "tek seferlik BVH deneyi" için MoMask denenebilir; öncelik değil.

### 3.9 Alan 9 – Oyun motoru tarafı (sadece anlamlıysa)

| Repo | ★ | lisans | kare-tabanlı deterministik render için | doğrulama |
|---|---|---|---|---|
| [BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js) | 26.2k | Apache-2.0 | Havok'a erişim; Remotion entegrasyonu yok; geçmeye değmez. Fikir: AnimationGroup/blend | ◐ |
| [playcanvas/engine](https://github.com/playcanvas/engine) | 17.0k | MIT | durum tabanlı animasyon grafiği, ammo.js; geçmeye değmez | ◐ |
| [phaserjs/phaser](https://github.com/phaserjs/phaser) 4.2.1 | 40.5k | MIT | 2D; gereksiz | ◐ |
| [kaplayjs/kaplay](https://github.com/kaplayjs/kaplay) | 1.8k | MIT | 2D; gereksiz | ◐ |
| [excaliburjs/Excalibur](https://github.com/excaliburjs/Excalibur) | 2.4k | BSD-2 | 2D; fizik detayı doğrulanamadı | ◐ |
| [godotengine/godot](https://github.com/godotengine/godot) | 118.5k | MIT | Web dışa aktarımı var ama Remotion/three ile birleşmez; Jolt entegrasyonu sayfada doğrulanamadı | ◐ |
| [bevyengine/bevy](https://github.com/bevyengine/bevy) (+ bevy_rapier artık `dimforge/rapier` içinde) | 49.0k | MIT/Apache | Rust; Remotion ile birleşmez | ◐ |
| [mrdoob/three.js](https://github.com/mrdoob/three.js) 0.186.1 | 116.5k | MIT | zaten kullanıyoruz; üstteki örnek listesi (3.4/3.7) bir **fikir madeni** | ✔ |

Sonuç: **Motor değiştirmeye değmez.** Ödünç alınacak olanlar: Rapier/Jolt/crashcat (fizik), navcat/recast (navmesh), three örnekleri, Babylon/PlayCanvas'ın animasyon durum grafiği fikri.

### 3.10 Alan 10 – Awesome listeleri (açıldı, tarandı)

| Liste | Sonuç |
|---|---|
| [AxiomeCG/awesome-threejs](https://github.com/AxiomeCG/awesome-threejs) | Fizik: cannon-es, Ammo.js, Oimo.js, Rapier. Yol bulma: Pathfinding.js, three-pathfinding, **Kompute**. Karakter: **ossos**, **mannequin.js** (boytchev, prosedürel karakter; incelenmedi ✖). Su: fft-ocean, skunami.js. three-mesh-bvh. Yeni (Jolt/crashcat/navcat) listede yok → liste güncel değil |
| [sjfricke/awesome-webgl](https://github.com/sjfricke/awesome-webgl) | Eski fizik listesi (Ammo, Cannon, p2, Planck, Whitestorm) → yeni bir şey yok |
| [Calinou/awesome-gamedev](https://github.com/Calinou/awesome-gamedev) | Box2D, **Box3D (MIT)**, Bullet, **Jolt**, Matter.js, Rapier, p2.js, Recast Navigation, mocapdata.com (çeşitli lisans) |
| [naranyala/awesome-motion-graphics](https://github.com/naranyala/awesome-motion-graphics) | Remotion, Motion Canvas, GSAP/anime/Motion, Matter/Planck "ikincil hareket için", Mixamo/Rokoko/DeepMotion/Cascadeur, 12 prensip sözlüğü |
| [jslee02/awesome-collision-detection](https://github.com/jslee02/awesome-collision-detection) | C++ ağırlıklı; JS için yeni bir şey yok |
| [Zilize/awesome-text-to-motion](https://github.com/Zilize/awesome-text-to-motion) (107★) | MDM, MoMask, MotionGPT, T2M-GPT, MotionLCM (3.8'e bak) |
| `sergey-pimenov/awesome-web-animation`, `Animatious/awesome-animation` (10 yıllık) | UI odaklı; ilgisiz. `awesome-physics`/`awesome-procedural-generation` adlı bakımlı bir liste **bulunamadı** |

---

## 4. "Remotion'da deterministik fizik" — somut tarif

### 4.0 Karar ağacı

1. **Motor gerekmiyor mu?** (tek top/saksı, kapı, sarkaç, araba çarpma sonrası sönüm) → **kapalı-form** (4.3). Kare başına O(1), rastgele erişim, sıfır risk.
2. **Çok cisim / etkileşim / kırık parçalar / ip-kumaş mı?** → **Rapier + Node'da bake (4.1)**. Üretimde bu yol.
3. **Bake çıktısını Studio'da canlı düzenlemek mi istiyorsun?** → **Tarayıcıda tembel önek-önbellek (4.2)**; sonra bake'e çevir.

### 4.1 Tarif A (ÖNERİLEN): Node'da önceden pişir → JSON/ikili → Remotion'da oku

Kütüphane: `@dimforge/rapier3d-deterministic-compat@0.21.0` (aynı sürümü sabitle, `^` kullanma). Kalıp: **sabit dt = 1/(fps×alt-adım)**, kare f = f×alt-adım adım sonrası durum.

```js
// scripts/bake-physics.mjs  (Node 20+, ESM) — ÇALIŞTIRILMADI, iskelet
import RAPIER from '@dimforge/rapier3d-deterministic-compat';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

await RAPIER.init();
const FPS = 30, SUB = 2, FRAMES = 1800;            // 60 sn
const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
world.timestep = 1 / (FPS * SUB);                  // SABİT; Remotion/duvar saati ASLA karışmaz

// Oluşturma SIRASI sabit olmalı (determinizm şartı). Rastgelelik: yalnız tohumlu PRNG.
world.createCollider(RAPIER.ColliderDesc.cuboid(50, 0.1, 50).setTranslation(0, -0.1, 0));
const pot = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(2, 12, 0));
world.createCollider(RAPIER.ColliderDesc.cylinder(0.25, 0.2).setRestitution(0.25).setDensity(1), pot);
const bodies = [pot];

const frames = [];                                  // frames[f] = [x,y,z,qx,qy,qz,qw] * gövde
const checks = {};                                  // kontrol noktalarında snapshot hash
for (let f = 0; f < FRAMES; f++) {
  frames.push(bodies.flatMap(b => { const t = b.translation(), r = b.rotation(); return [t.x,t.y,t.z,r.x,r.y,r.z,r.w]; }));
  for (let s = 0; s < SUB; s++) world.step();
  if (f % 300 === 0) checks[f] = createHash('sha256').update(world.takeSnapshot()).digest('hex');
}
writeFileSync('src/sim/baked/pot.json', JSON.stringify({ fps: FPS, n: bodies.length, frames, checks }));
```

Remotion tarafı (WASM yok, motor yok, sadece tablo):

```tsx
// src/sim/useBaked.ts
import baked from './baked/pot.json';
export const bakedPose = (frame: number, body = 0) => {
  const a = baked.frames[Math.min(Math.max(frame, 0), baked.frames.length - 1)], o = body * 7;
  return { p: [a[o], a[o+1], a[o+2]] as const, q: [a[o+3], a[o+4], a[o+5], a[o+6]] as const };
};
// <group position={p} quaternion={q}>…</group>   (useCurrentFrame() ile)
```

Kapı/ceza kuralları:
- **CI kapısı:** bake betiğini iki kez çalıştır, `checks` hash'lerini ve JSON `sha256`'sını karşılaştır; farklıysa derlemeyi kır. Bu, "bizde çalıştırdım" kanıtını üretir (ben ortamda çalıştıramadım).
- **Yasak:** `Math.random`, `Date.now`, `performance.now`, Remotion `delta`'sı; `parallel`/`simd` derlemeleri (yalnız `-deterministic`); başlangıç değerlerinde `Math.sin/cos` kullanıyorsan çıktısını tabloya yazıp sabitle (dokümanın uyarısı).
- **Boyut:** ip/kumaş için `softBody.particlePositions()` (Float32Array) pişir. Örn. 24×24 kumaş = 576 parçacık × 12 B = 6.9 KB/kare → 60 sn = **12.4 MB** (aritmetik); yalnız aktif aralığı pişir / int16 nicemle / `Float32Array` ikili dosya + `staticFile()`.
- **Parça kırma:** `@dgreenheck/three-pinata` ile saksıyı Node'da `seed` ile çatlat, parçaları (konveks gövde) Rapier'a ver, her parçanın pozunu pişir.
- **Soft body determinizmi** belgelenmemiş (✖) → ilk iş hash testi; tutmazsa ip/kumaşı shader-tabanlı sinüs/Verlet-önbellekle yap.

### 4.2 Tarif B: Tarayıcıda "tembel önek önbelleği" (kare N durumu = sıfırdan N'e simüle, modül düzeyinde önbellek)

Her Remotion sekmesi kendi JS bağlamıdır; sekme ilk kez N. kareyi isterse 0→N simüle eder ve sonuçları modül değişkeninde tutar. Maliyet: sekme başına bir kez O(N); N ≲ 1800 ve gövde sayısı küçükse saniyeler (ÖLÇÜLMEDİ, ölç).

```tsx
// src/sim/lazySim.ts — iskelet
import RAPIER from '@dimforge/rapier3d-deterministic-compat';
let ready: Promise<void> | null = null;
let world: RAPIER.World, bodies: RAPIER.RigidBody[] = [];
const frames: Float32Array[] = [];                 // modül düzeyi (React Strict/Fast Refresh'ten bağımsız değil: HMR'de sıfırlanır)
export const initSim = () => (ready ??= RAPIER.init().then(() => { /* world+bodies'i SABİT sırayla kur */ }));
export function stateAt(frame: number) {
  while (frames.length <= frame) { frames.push(snapshotPoses()); for (let s = 0; s < 2; s++) world.step(); }
  return frames[frame];
}
// Bileşen: const { delayRender, continueRender } = useDelayRender();  // Remotion ≥4.0.342
// initSim().then(() => continueRender(handle))  — hazır olana dek render'ı beklet.
```

İyileştirme (isteğe bağlı): her 150 karede `world.takeSnapshot()` sakla; sekme N'e atlarken en yakın kontrol noktasına `RAPIER.World.restoreSnapshot()` ile dön ve ileri sar. **Doğrulanmalı:** "restore + ileri sar" sonucu "kesintisiz koşu" ile bit-bit aynı mı (hash). #910 düzeltmesi 0.33'te geldi; 0.21.0 JS bunun üstünde.

Tuzaklar: dünyayı **bileşen içinde değil modül kapsamında** kur (React 19 StrictMode çift çağrı); `world.step()`'i render sırasında kare sırasına bağlı olmayan şekilde (her zaman `frames.length` üzerinden) ilerlet; `Sequence` içinde `layout="none"` unutma; `gl: 'angle'`.

### 4.3 Tarif C: Motorsuz kapalı-form "fizik"

- **Düşen saksı:** `y(t) = y0 − ½g·t²` (30 fps'te kare→saniye: `t = (frame − f0)/fps`), yere çarpma karesi `t_c = sqrt(2h/g)`; sekme: `v' = −e·v` ile parçalı parabol (n. sekme kapalı-form: `t_n` geometrik seri). Sönümlü yay ile "otur/titre".
- **Kapı çarpması, sarkaç, kafa/kol tepkisi, kamera overshoot:** sönümlü yay. Remotion `spring()` lineer olduğundan **bindirme**: her yeni itki Δ_i için `x(frame) = Σ Δ_i · spring({frame − t_i, …})`. Yani geriye dönük hedef değişimi (retarget) kare başına O(#itki), durum yok, rastgele erişim ✓.
- **Kare hızından bağımsız "exact damper":** `x' = g + (x − g)·2^(−dt/halflife)` (Holden); hedef kare-kare değişiyorsa sıralı ama O(1) ve önbellekle ✓.
- **Sürü/kuş/balık/kar/duman:** `pos(i, frame)` kapalı-form döngüsel parçacıklar, `random(seed + i)`.

---

## 5. Karakter hareketini yükseltme — yol haritası (öncelik sırasıyla, tahmini emek)

| # | Madde | Ne yapılır | Emek | Risk |
|---|---|---|---|---|
| 1 | **"Juice" yardımcıları** (`motion/juice.ts`) | kapalı-form exact spring/damper (Holden), `spring()` bindirme ile çok-itkili retarget, hızdan hacim-korumalı squash&stretch, anticipation (ters-yay kuyruğu) + overshoot, kamera sarsıntısı `@remotion/noise` (tohumlu) | 1–1.5 gün | düşük |
| 2 | **Yürüyüş v2** | faz = katedilen mesafe / adım uzunluğu (kayma yok), pelvis salınımı, gövde karşı-dönüşü, kol salınımı ∝ hız, hıza "eğilme" (yayla yumuşatılmış), duruşta nefes/ağırlık verme (gürültü); iki-kemik analitik IK ile ayak basma + zemin yüksekliği | 2–3 gün | orta (ayak kayması ölçümü: duruş fazında ayak dünya hızı ≈ 0 testi yaz) |
| 3 | **Klip→Humanoid "baker"** | Quaternius UAL/UBC (+KayKit) GLB'yi Node'da yükle, `SkeletonUtils.retargetClip` ya da kemik eşlemesiyle 30 fps örnekle, `Humanoid` pivotlarının yerel dönüşlerini JSON'a yaz (kök hareketi ayrı); çalışma zamanında yalnız tablo + kare-bazlı çapraz geçiş (iki pozu slerp, ağırlık = `interpolate` eğrisi) | 3–4 gün | orta–yüksek (T/A-poz farkı, pivot-bazlı figür vs. iskelet) |
| 4 | **Fizik bake hattı** (Rapier) | 4.1'deki betik + `useBaked` + hash CI; ilk prop'lar: saksı, top, kapı (menteşe+motor), araba çarpması; sonra kırık parçalar (three-pinata) | boru hattı 2 gün + prop başı 0.5 gün | düşük–orta |
| 5 | **İkincil hareket** | saç/palto/çanta/anten için yay zinciri: sıralı Verlet + önbellek (ya da 2. derece filtre kapalı-formu); isteğe bağlı VRM spring bone mantığı referans | 1 gün | düşük |
| 6 | **Kalabalık** | önce parametrik yaya akışı (spline/PCHIP + tohumlu hız/ofset + şerit ayrımı), sonra gerekirse Yuka/navcat crowd'u çevrimdışı koş → JSON; 27 karakter + yayalar için LOD | 1–2 gün | düşük |
| 7 | **Hayvanlar & araçlar** | köpek/kedi: 4 bacaklı faz ofsetli yürüyüş (ya da Quaternius hayvan klipleri bake); araba: yay boyunca ark uzunluğu + exact-spring süspansiyon, çarpmada fizik bake | 1–2 gün | düşük |
| 8 | **Durum makinesi** | kare-bazlı "zaman çizelgesi → durum" (hangi kare aralığında hangi klip); animouse'tan blend-tree fikri, XState gerekmez | 0.5–1 gün | düşük |
| 9 | (İsteğe bağlı) MoMask ile bir-kerelik BVH deneyi | – | 2+ gün | yüksek (kalite/lisans), önerilmez |

---

## 6. Kalabalık / araç — deterministik ön-hesaplama notu

- Yaya akışı için **simülasyon çoğu zaman gereksiz**: her yaya `s(t)=s0+v·t` ile bir yol üstünde ilerler; çarpışma önleme = şerit ofseti (tohumlu). Rastgele erişim ve sıfır durum.
- Etkileşim gerekiyorsa **Yuka** (`EntityManager.update(1/30)`; `WanderBehavior` yerine kendi tohumlu sapmanı koy; `NavMesh.getRandomRegion` kullanma) veya **navcat crowd** (`rand` parametresi tohumlu) → Node'da koş → `positions[frame][agent]` JSON.
- **recast-navigation-js** README'si de aynı şeyi söylüyor: sabit adım (+ görsel interpolasyon) deterministik; değişken adım değil.
- Trafik: IDM/MOBIL formüllerini kendin yaz (GPL kodu alma); yol grafiği + şeritler elle.

---

## 7. Bakılıp ELENEN projeler ve nedenleri

| Proje | Neden elendi |
|---|---|
| `@react-three/rapier` | useFrame + delta birikimcisi; rapier 0.19.2'ye pinli; son commit 2025-11-03 (K3) |
| three `RapierPhysics.js`/`JoltPhysics.js` eklentileri | `setInterval` + `Timer` + CDN (K2) |
| `@react-three/cannon`/`use-cannon`, `cannon-es` | son commit 2024-01 / npm 2022; snapshot yok; determinizm belgesiz |
| Matter.js, planck.js, p2.js, Box2D wasm, liquidfun | 2D; Matter.js determinizm sorunları (#1190); liquidfun arşivli; p2.js 2018'den beri ölü |
| ammo.js, Physijs, enable3d | eski Bullet 2.82, worker/oyun döngüsü, enable3d LGPL-3.0 |
| Oimo.js / OimoPhysics | bakımsız, determinizm belgesiz |
| Havok (`@babylonjs/havok`) | kapalı ikili, determinizm/lisans belgesiz |
| Box3D + `box3d-wasm` | çok genç (v0.1.0, 29★ bağlama); **izle**, şimdilik değil |
| PhysX wasm, MuJoCo wasm | ağır/gereksiz; determinizm belgesiz |
| drei Float/Cloud/Sparkles/Wobble | useFrame + clock + Math.random (K4) |
| react-spring, framer-motion/motion | Remotion'da entegrasyon yok / rAF saati |
| Theatre.js | AGPL stüdyo, geliştirme özel depoya taşınmış, son public commit 2024-04; 3.5'te ikinci sırada |
| Kenney Animated Characters | yalnız 3 klip |
| Ready Player Me | 2026-01-31'de kapandı |
| three-ik (THREE.IK) | 2018'den beri npm; WIP |
| ossos | 2023'ten beri durdu (referans olarak okunabilir) |
| Kompute, PathFinding.js, easystarjs | bakımsız / ızgara |
| rvo2 (TNOCS), snape/RVO2 | native C++/node-gyp; saf JS ORCA bulunamadı |
| Horde, WebGL-Fluid-Simulation, jeantimex/fluid, three `webgpu_compute_*` | GPU/WebGPU; SwiftShader'da pahalı/uygunsuz |
| HY-Motion, MDM, MotionGPT, GVHMR | GPU zorunlu / lisans |
| OpenPose, VideoPose3D, BlendArMocap, Kalidokit | ticari olmayan / arşivli / GPL / deprecated |
| movsim/traffic-simulation-de | GPL-3.0 |
| matthias-research/pages | LICENSE görünmedi → kod alma, algoritmayı öğren |
| Babylon/PlayCanvas/Phaser/Kaplay/Excalibur/Godot/Bevy | motor değiştirmeye değmez (3.9) |
| `three-jolt` | bu adla paket/depo bulunamadı |
| `planck-deterministic` fork'u | 0★, kanıtsız, yalnız 2D |
| Sorceress "Procedural Walk" | ticari ürün (arama sonucu), açık kaynak değil |

---

## 8. DOĞRULANAMAYAN / açık sorular

- Rapier soft body'nin ve `-deterministic-compat` paketinde soft body derlemesinin determinizmi (belgelenmemiş) → hash testi şart.
- `AnimationMixer` "elle `action.time` + `update(0)`" kalıbı kaynak okumasından çıkarıldı, çalıştırılmadı.
- `@remotion/gsap`'ın three nesnelerini (düz JS nesne tween'i) desteklediği belgelenmemiş; yalnız DOM örneği var.
- Bake'in kare başına boyutu/süresi, Remotion sekmelerinde 0→N önek maliyeti: ölçülmedi.
- WebGPU (`ThreeWebGPUCanvas`) SwiftShader konteynerinde: test edilmedi.
- Havok lisans/determinizm, PhysX/MuJoCo determinizmi, Quaternius hayvan paketinde köpek/kedi var mı, KeeMap'in doğru deposu, three-nebula/wawa-vfx/flag-cloth/skunami.js/mannequin.js içeriği, THREE.IK son commit tarihi, Theatre `sequence.position` ile kare sürme: ✖.
- Mixamo güncel Adobe şartları (yalnızca 2022 topluluk SSS'i ve 2026 üçüncü taraf rehber).

---

## 9. Kaynaklar (URL listesi)

Remotion
- https://www.remotion.dev/docs/three · https://www.remotion.dev/docs/third-party · https://www.remotion.dev/docs/gsap · https://www.remotion.dev/docs/gsap/use-gsap-timeline · https://www.remotion.dev/docs/use-delay-render
- https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/three/src/ThreeCanvas.tsx
- https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/core/src/spring/spring-utils.ts
- https://github.com/remotion-dev/remotion · https://github.com/remotion-dev/skills · https://github.com/remotion-dev/template-three
- https://github.com/orgs/remotion-dev/discussions/4373 · https://github.com/hylarucoder/remotion-physics

Fizik
- https://github.com/dimforge/rapier · https://github.com/dimforge/rapier.js (arşiv) · https://raw.githubusercontent.com/dimforge/rapier/master/bindings/typescript/README.md · .../CHANGELOG.md · .../testbed3d/src/demos/softBodies.ts · .../src.ts/dynamics/soft_body.ts
- https://rapier.rs/docs/user_guides/javascript/determinism · https://rapier.rs/docs/user_guides/javascript/serialization · https://github.com/dimforge/rapier/issues/910
- https://github.com/pmndrs/react-three-rapier · https://raw.githubusercontent.com/pmndrs/react-three-rapier/main/packages/react-three-rapier/src/components/Physics.tsx
- https://github.com/jrouwe/JoltPhysics.js · https://github.com/jrouwe/JoltPhysics · https://jrouwe.github.io/JoltPhysics/ (Deterministic Simulation, Rolling Back)
- https://github.com/isaac-mason/crashcat · https://github.com/pmndrs/cannon-es · https://github.com/pmndrs/use-cannon
- https://github.com/BabylonJS/havok · https://github.com/kripken/ammo.js · https://github.com/lo-th/Oimo.js · https://github.com/saharan/OimoPhysics
- https://github.com/erincatto/box3d · https://github.com/monteslu/box3d-wasm · https://github.com/erincatto/box2d · https://github.com/Birch-san/box2d3-wasm · https://github.com/piqnt/planck.js
- https://github.com/liabru/matter-js · https://github.com/liabru/matter-js/issues/1190 · https://github.com/caelum0x/planck-deterministic
- https://github.com/fabmax/physx-js-webidl · https://github.com/zalo/mujoco_wasm · https://github.com/schteppe/p2.js · https://github.com/pmndrs/p2-es · https://github.com/schteppe/cannon.js · https://github.com/chandlerprall/Physijs · https://github.com/enable3d/enable3d · https://github.com/sajal353/r3f-jolt · https://github.com/pmndrs/ecctrl
- https://github.com/mattvb91/rapierjs-ragdoll · https://github.com/dgreenheck/three-pinata · https://github.com/subprotocol/verlet-js · https://github.com/matthias-research/pages · https://github.com/google/liquidfun · https://github.com/PavelDoGreat/WebGL-Fluid-Simulation · https://github.com/jeantimex/fluid

three.js
- https://github.com/mrdoob/three.js · https://raw.githubusercontent.com/mrdoob/three.js/dev/src/animation/AnimationMixer.js · .../examples/jsm/physics/RapierPhysics.js · .../JoltPhysics.js · .../examples/jsm/utils/SkeletonUtils.js · .../examples/jsm/animation/CCDIKSolver.js · .../examples/files.json
- https://github.com/pmndrs/drei · https://github.com/pmndrs/react-three-fiber · https://github.com/gkjohnson/three-mesh-bvh · https://github.com/pmndrs/maath

Animasyon / his
- https://github.com/jsantell/THREE.IK · https://github.com/gkjohnson/closed-chain-ik-js · https://github.com/sketchpunklabs/ossos · https://github.com/pixiv/three-vrm · https://github.com/jango-git/animouse · https://github.com/statelyai/xstate
- https://github.com/greensock/GSAP · https://gsap.com/standard-license/ · https://github.com/juliangarnier/anime · https://github.com/motiondivision/motion · https://github.com/pmndrs/react-spring · https://github.com/tweenjs/tween.js · https://github.com/theatre-js/theatre
- https://theorangeduck.com/page/spring-roll-call · https://github.com/orangeduck/Motion-Matching

İçerik
- https://quaternius.com/packs/universalanimationlibrary.html · https://quaternius.com/packs/universalanimationlibrary2.html · https://quaternius.com/packs/universalbasecharacters.html · https://quaternius.com/packs/ultimateanimatedanimals.html · https://quaternius.com/license.html
- https://kaylousberg.itch.io/kaykit-character-animations · https://kaylousberg.itch.io/kaykit-adventurers · https://kenney-assets.itch.io/animated-characters-3
- https://community.adobe.com/t5/mixamo-discussions/mixamo-faq-licensing-royalties-ownership-eula-and-tos/m-p/13234775 · https://genies.com/blog/ready-player-me-shutdown
- https://github.com/donmccurdy/glTF-Transform · https://github.com/pmndrs/gltfjsx · https://github.com/facebookincubator/FBX2glTF · https://github.com/enziop/mixamo_converter

Kalabalık / YZ
- https://github.com/Mugen87/yuka · https://github.com/isaac-mason/recast-navigation-js · https://github.com/isaac-mason/navcat · https://github.com/donmccurdy/three-pathfinding · https://github.com/oguzeroglu/Kompute · https://github.com/qiao/PathFinding.js · https://github.com/snape/RVO2 · https://github.com/TNOCS/rvo2 · https://github.com/sweriko/Horde · https://github.com/Str4y-Cat/three-boids · https://github.com/movsim/traffic-simulation-de

Prosedürel
- https://github.com/FarazzShaikh/THREE-CustomShaderMaterial · https://github.com/dgreenheck/ez-tree · https://github.com/Alchemist0823/three.quarks · https://github.com/jbouny/fft-ocean

Hareket üretimi / yakalama
- https://github.com/Tencent-Hunyuan/HY-Motion-1.0 · https://raw.githubusercontent.com/Tencent-Hunyuan/HY-Motion-1.0/master/License.txt · https://github.com/EricGuo5513/momask-codes · https://github.com/GuyTevet/motion-diffusion-model · https://github.com/OpenMotionLab/MotionGPT · https://github.com/Zilize/awesome-text-to-motion
- https://github.com/google-ai-edge/mediapipe · https://github.com/yeemachine/kalidokit · https://github.com/facebookresearch/VideoPose3D · https://github.com/CMU-Perceptual-Computing-Lab/openpose · https://github.com/zju3dv/GVHMR · https://github.com/cgtinker/BlendArMocap

Motorlar / listeler
- https://github.com/BabylonJS/Babylon.js · https://github.com/playcanvas/engine · https://github.com/phaserjs/phaser · https://github.com/kaplayjs/kaplay · https://github.com/excaliburjs/Excalibur · https://github.com/godotengine/godot · https://github.com/bevyengine/bevy
- https://github.com/AxiomeCG/awesome-threejs · https://github.com/sjfricke/awesome-webgl · https://github.com/Calinou/awesome-gamedev · https://github.com/naranyala/awesome-motion-graphics · https://github.com/jslee02/awesome-collision-detection

Paket meta verisi: https://registry.npmjs.org/ (rapier3d-deterministic-compat 0.21.0, @react-three/rapier 2.2.0, jolt-physics 1.1.0, crashcat 0.0.5, navcat 0.4.1, recast-navigation 0.43.1, yuka 0.7.8, three 0.186.1, @remotion/gsap 4.0.535 …) ve https://data.jsdelivr.com/v1/packages/npm/…
