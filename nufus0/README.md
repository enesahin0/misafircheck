# NÜFUS_0

Karanlık, izometrik **low-poly 3D** bir bürokratik korku serisi. Her bölüm 60 saniyelik dikey video (1080×1920, 30 fps, 1800 kare);
izleyici yorumlarla **A / B** kararı verir, ertesi bölüm bu karara göre değişir.

Bu depo **gerçek 3D geometri** (Three.js / React Three Fiber) ile kare kare render edilir — fotogerçekçi AI video, ücretli servis, API anahtarı yoktur.
Ürün ve sanat kuralları: [`CLAUDE.md`](./CLAUDE.md) (bağlayıcı belge).

## Hızlı başlangıç

Gereken: **Node.js 20+** ve internet (yalnızca ilk `npm install` için). Kod bilmeniz gerekmez.

```bash
cd nufus0
npm install

npm run dev                # Remotion Studio: tarayıcıda canlı önizleme (zaman çizelgesiyle)
npm run render:test        # 5 sn şehir testi  → out/NUFUS0_test_5sn.mp4
npm run render:001:draft   # DOSYA 001, yarı çözünürlük taslak → out/DOSYA001_draft.mp4
npm run render:001         # DOSYA 001, tam 1080x1920, 30 fps, 60.00 sn → out/DOSYA001.mp4
```

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Önizleme (Studio). `Nufus0Episode001` kompozisyonunu seçin. |
| `npm run render:test` | 5 saniyelik şehir testi (önce bunu deneyin). |
| `npm run render:001` | Üretim render'ı. Önce doğrular, sonra render eder, sonunda MP4'ü ffprobe ile denetler. |
| `npm run render:001:draft` | Hızlı taslak (540×960, düşük kalite). |
| `npm run stills` | Kontrol kareleri (`out/stills/*.png`). `-- --frames=0,300,1500` ile seçilebilir. |
| `npm run validate` | Bölüm verisi + süreklilik denetimi (süre, altyazı, ses, dünya durumu). |
| `npm run audio` | Yer tutucu SFX/müziği üretir ve ses manifestini yeniler. |
| `npm run tally` | A/B oylarını manuel CSV'den sayar (aşağıya bakın). |
| `npm run audio:audit -- 001` | Bölümde kullanılan kütüphane seslerinin lisans dökümü + atıf metni. `-- --commercial` ile ticari olmayan ses varsa hata verir (**reklam öncesi çalıştır**). |
| `npm run library:fetch` | Ağdan ses paketlerini indirir (Incompetech müzik, Mixkit, BBC). |
| `npm run models -- <etiket>` | 3D model ara (1.603 CC0 model). |
| `npm run sfx -- <etiket>` | Ses kütüphanesinde ara (ör. `npm run sfx -- door close`). Etiketsiz çalıştırırsan paketleri listeler. |
| `npm run test:webgl` | Bu makinede tarayıcı WebGL'i çalışıyor mu? |
| `npm run validate:universe` | KOMŞULAR evreni denetimi (karakter↔daire, ipucu adil oyun kuralı, tohumlar, marka yuvaları). |
| `npm run render:001:pixel` | Piksel stili (3D katman 1/4 çözünürlük). `npm run stills:pixel` ile kareler. |
| `npm run check` | Tip + evren + bölüm doğrulaması. **Render öncesi geçmeli.** |

### Render ortamı
- Render, Chromium + WebGL kullanır. **Ekran kartı yoksa** (sunucu/konteyner) yazılım WebGL (`swangle`) otomatik seçilir; yavaştır (≈2–3 kare/sn) ama çalışır.
  Windows/macOS'ta `angle` varsayılandır (GPU kullanır). Değiştirmek: `NUFUS_GL=swangle npm run render:001`.
- Tarayıcı: `NUFUS_BROWSER=/yol/chrome` ile belirtilebilir; yoksa Remotion kendi tarayıcısını indirir.
- Paralellik: `NUFUS_CONCURRENCY=4` veya `npm run render:001 -- --concurrency=4`.
- İlk çalıştırmada bir şey ters giderse önce `npm run test:webgl` çalıştırın.

## Seslendirmeyi değiştirmek (kod yazmadan)

Seslendirme dosyalarını **adıyla** bırakmanız yeterli:

```
public/audio/narration/001_s1.mp3   ← sahne 1  (0–4 sn)    "Bu sokak dün gece silindi..."
public/audio/narration/001_s2.mp3   ← sahne 2  (4–11 sn)
public/audio/narration/001_s3.mp3   ← sahne 3
...
public/audio/narration/001_s8.mp3   ← sahne 8
```

mp3 / wav / m4a / ogg olur. Dosya yoksa o satır sessiz geçilir (preview ve render yine çalışır). Eksik olanlar `npm run validate` ve render başında raporlanır.
Başlangıç kareleri `src/episodes/episode001.ts` → `audio.narration[].from` içindedir. Kayıt süresi sahneden uzun/kısaysa orada kaydırın veya altyazı kareleri `captions`'ta ayarlayın. **Çıkış süresi hep tam 60.00 sn kalır.**

### Ses kütüphanesi (CC0, 470 ses)
`public/audio/library/` altında **Kenney CC0 paketleri** var (impact, interface, ui, digital, sci-fi, rpg). Tüm paketler `ledger.json` lisans defterinde kayıtlıdır (kaynak, lisans, indirme tarihi); **defterde olmayan paket varsa `npm run audio` hata verir.**
Bölüm verisinde dosya yolu yerine **etiketle** çağrılır: `{ id: "adim", tag: "footstep carpet", pick: 2, from: 1440, volume: 0.25 }`. Aynı etiket + aynı kütüphane her zaman aynı dosyayı seçer (deterministik).
Yeni paket eklemek: dosyaları `public/audio/library/<kaynak>/<paket>/` altına koy, `ledger.json`'a satırını yaz, `npm run audio` çalıştır.

Şu an `public/audio/sfx/_generated` ve `public/audio/music/_generated` içindeki sesler **bu depodaki script ile sentezlenmiş yer tutuculardır** (telif sorunu yok).
Kendi SFX/müziğinizi koymak için `episode001.ts` içindeki `audio.sfx` / `audio.music` yollarını değiştirin. Üçüncü taraf ses kullanırsanız lisansını `public/audio/LICENSES.md` içine yazın.

## Kaynak kütüphaneleri
Tüm ses ve görsel kaynakların envanteri, lisansları ve durumu: [`docs/KAYNAKLAR.md`](docs/KAYNAKLAR.md). Ağdan indirilen paketler (Mixkit, BBC, Incompetech) repoya girmez; `npm run library:fetch` ile edinilir.

## Evren (KOMŞULAR)
Konsept: apartman kesiti, 17 komşu, günlük A/B kararı, sezon gizemi "Kayıp Aidat Kasası", haftalık özel "60 SANİYE ÖNCE". Tek doğruluk kaynağı `src/story/series/` (özet: `bible.md`): bina, karakterler, ilişkiler, sezon yayı, ipucu defteri, bölüm formülü + hook kalıpları, etkileşim döngüleri, marka yuvaları, 12 bölüm tohumu. `npm run validate:universe` tutarlılığı denetler. Eski NÜFUS_0/KAPI evreni `src/story/_arsiv_nufus0/` içinde arşivdedir; DOSYA 001 teknik prototiptir.

## Mimari (kısa)

```
src/
  episodes/    episode001.ts (TÜM sahne/kamera/altyazı/ses/eğri verisi) + schema.ts (zod)
  story/       worldState.json (kalıcı dünya) · decisions.json (karar + taslak etkiler) · canon.md
  world/       Gerçek 3D dünya: Apartment, CityBlock, CityStreet (silinen 14. Sokak), MunicipalArchive (cutaway arşiv),
               Props, Characters, camera (ortografik izometrik), palette, WorldScene
  video/       Episode.tsx (veriden bölüm birleştirir), Subtitle, Overlay, camera, params, glitch, transitions
  scenes/      Sahne üstü 2D HUD: StreetDeletion, Announcement, TraceOverlay, CityArchive, ArchiveInterior, DecisionScreen, LeylaReveal
scripts/       render-episode · validate-episode · tally-votes · make-audio · check-webgl
```

Önemli kurallar (kodda uygulanır):
- **Tek sürekli 3D dünya.** Şehir, 14. Sokak ve belediye/arşiv aynı sahnede, aynı kamera/ışık/materyalle; sahneler sadece kamera ve parametre farkıdır.
  Arşiv, belediyenin *zemin katıdır*: `cutaway` parametresi üst katları kaldırır, yakın iki duvarı indirir (dollhouse).
- **Deterministik animasyon.** `useFrame` / `requestAnimationFrame` / zamanlayıcı yok; her şey `useCurrentFrame()`'den türer. Rastgelelik tohumludur (`utils/deterministic.ts`). Aynı kare = aynı piksel.
- **Glitch sadece "kayıt hatası" anlarında** (`episode.glitches`), sürekli gürültü yok.
- **Her sahnede 1 gizli ipucu + 2–4 yaşam ayrıntısı** `episode001.ts` içinde tanımlıdır (`scene.clue`, `scene.lifeDetails`); `validate` bunu zorunlu kılar.
- **Süreklilik:** `story/worldState.json` kalıcıdır (silinen sokak, bozuk lamba, kırmızı arabanın konumu, ipuçları...). `npm run validate` yeni bölümün dünya durumuyla çelişip çelişmediğine bakar;
  kaybolan bir sokak geri geliyorsa `restoredAtEpisode` gerekçesi şarttır.

## Yeni bölüm (DOSYA 002...) nasıl eklenir

1. `src/episodes/episode001.ts` dosyasını `episode002.ts` olarak kopyalayın; `episodeId`, `title`, `dossier`, sahneler, kamera, altyazı, eğriler, `continuity` alanlarını yazın. 8 sahne / 1800 kare kuralı `schema.ts` ile denetlenir.
2. `src/Root.tsx` içine bir `<Composition id="Nufus0Episode002" ... episode={episode002} />` ekleyin.
3. `npm run validate -- 002`, sonra `npx tsx scripts/render-episode.ts 002`.

Yeni bir parametre (ör. yeni bir bina durumu) gerekiyorsa `world/WorldScene.tsx` (`WorldParams`) ve `video/params.ts` içine eklenir; eğri adı `tracks` altında verilir.

## Oylama akışı (Instagram entegrasyonu yok)

Yorumları **elle** `src/story/votes.csv` dosyasına aktarın (sütunlar: `user_id,option,timestamp`; kimlik hash/takma ad olabilir). Biçim için `votes.sample.csv`'ye bakın (örnek veridir, gerçek değildir).

```bash
npm run tally -- src/story/votes.csv           # sayar, kaydetmez
npm run tally -- src/story/votes.csv --save    # sonucu decisions.json'a yazar
npm run tally -- --apply --next 002            # kazanan kararın taslak etkilerini worldState'e uygular
```

Kurallar `decisions.json → voteRules` içindedir ve **yayından önce ilan edilir, sonradan değiştirilmez**: kullanıcı başına ilk geçerli oy; eşitlikte ilk geçerli oyu veren taraf;
hiç oy yoksa "Dış Hat'tan karar gelmedi; Leyla protokolü uyguladı". **Gerçek veri gelmeden sayım veya galip uydurulmaz.**
`decisions.json → draftEffects` yalnızca taslaktır; oy sonucu gelene kadar kesinleşmez.

Önerilen yayın düzeni: her gün 20.00 (Europe/Istanbul); oylama ertesi gün 14.00'te kapanır. Yayın metni ve Story kartı önerisi: `episode001.ts → publishing`.
Profil/sabit içerikte bunun **kurgusal, animasyonla üretilmiş** bir dünya olduğunu belirtin (gerçek kamu duyurusu gibi görünmemeli).

## Sorun giderme
- **"WebGL"/siyah kareler:** `npm run test:webgl`. Konteynerde `NUFUS_GL=swangle`, kendi bilgisayarınızda `NUFUS_GL=angle`.
- **`Failed to launch the browser`:** `NUFUS_BROWSER` ile `chrome-headless-shell` ya da yeni bir Chrome gösterin ya da Remotion'un indirmesine izin verin.
- **Yazı tipi/Türkçe karakter:** Yazı tipleri `public/fonts` içinde yereldir (IBM Plex Mono, Barlow Condensed — OFL lisanslı).
- **Studio'da ses yeni eklenen dosyayı görmüyor:** `npm run audio` ile manifesti yenileyin, sonra sayfayı yenileyin.

## Bilinen sınırlar (dürüst durum)
- Seslendirme dosyaları **henüz yok**; render'lar şimdilik yalnızca yer tutucu SFX + müzikle çıkar. Altyazı ve HUD metinleriyle konu sessiz de anlaşılır.
- Yazılım WebGL ile render uzun sürer (≈15 dk / bölüm); GPU'lu makinede belirgin hızlanır.
- Karakter hareketleri basit pivot/rig'dir (yüz/dudak senkronu bilinçli olarak yok).
- Marka/kullanıcı adı müsaitliği ve tescili kontrol edilmedi (`CLAUDE.md` §1).
