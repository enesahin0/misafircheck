# KAYNAK KÜTÜPHANELERİ (ses + görsel)

> Karar: Şu an reklam/monetizasyon yok → geniş kaynak toplanır. Her paketin lisansı **etiketlenir** (`commercialOk`, `attributionRequired`),
> böylece reklam zamanı `npm run audio:audit -- 001 --commercial` hangi sesin değişmesi gerektiğini söyler.
> Lisanssız / korsan içerik **alınmaz**. Resmî kayıt: `public/audio/library/ledger.json`, `public/models/ledger.json`.

## SES — edinildi
| Paket | İçerik | Lisans | Ticari? | Atıf | Repoda mı? |
|---|---|---|---|---|---|
| Kenney (6 paket) | 470 SFX (impact, interface, ui, digital, sci-fi, rpg) | CC0 | ✓ | gerekmez | ✓ (12 MB) |
| Incompetech (Kevin MacLeod) | 40 karanlık/gerilim/ambient müzik | CC BY 4.0 | ✓ | **zorunlu** (`audio:audit` üretir) | ✗ indirilir |
| Mixkit | 1.232 SFX (61 kategori) | Mixkit SFX Free License | ✓ (tek başına dağıtılamaz) | gerekmez | ✗ indirilir |
| BBC Sound Effects | 217 SFX (oda sesi, kapı, adım, saat, rüzgâr...) | RemArc | **✗ yalnız ticari olmayan** | zorunlu | ✗ indirilir |

İndirme: `npm run library:fetch` (internet gerekir; betik `scripts/acquire/fetch_library.py`). Arama: `npm run sfx -- <etiket>`.
**Karar (2026-10-15):** kullanıcı BBC seslerini kullanma sorumluluğunu üstlendi; DOSYA 001'de kullanılıyor. **Uyarı (BBC):** ticari olmayan lisans. Herkese açık bir hesapta kullanmak kişisel kullanımın ötesine geçebilir; reklam alınmadan önce mutlaka değiştirilir.
**Uyarı (Incompetech):** Kevin MacLeod müziği platformlarda otomatik telif (Content ID) işaretine takılabilir; itiraz adımları kaynak sitede.

## SES — erişilemedi / elenen
| Kaynak | Durum |
|---|---|
| Freesound, Pixabay, Zapsplat, Sonniss, Chosic, Musopen | Bu ortamdan 403 (bot engeli/ağ). İstersen indirdiklerini `public/audio/library/<paket>/` altına bırak + `ledger.json`'a ekle. |
| FreePD | Site kapanmış. |
| OpenGameArt, SoundBible, ccMixter, Free Music Archive | Erişilebilir ama bu turda alınmadı (Kenney ile çakışıyor / lisansları dosya bazında değişiyor). İstenirse tek tek eklenir. |

## GÖRSEL — 3D modeller (edinildi)
**Kenney 3D, CC0, ticari ✓, atıf gerekmez, repoda ✓ (42 MB):** 16 paket, **1.603 GLB model**: furniture-kit (mobilya: iç mekân dairesi için ideal), city-kit-commercial / suburban / industrial / roads,
building-kit, modular-buildings, retro-urban-kit, food-kit, nature-kit, survival-kit, car-kit, graveyard-kit, prototype-kit, blocky-characters, mini-characters.
- Arama: `npm run models -- sofa`  ·  Kullanım: `<Model tag="sofa" pos={[0,0,0]} />` (`src/world/Model.tsx`). Modeller yüklenirken **palete uydurulur** (düz gölge, düşük doygunluk, soğuk ton).
- Görsel test: `npx remotion still src/index.ts Nufus0ModelTest out/stills/models.png`.
- Not: Kenney modelleri prosedürel dünyamızla **karışık** kullanılabilir; bina kabuğu ve karakterler yine kendi kodumuzdan, mobilya/aksesuar kütüphaneden gelir.

## GÖRSEL — elenen / elle
| Kaynak | Durum |
|---|---|
| Poly Haven modelleri | CC0 ama foto-gerçekçi (5.000+ üçgen, 4K doku) → stilimize uymaz; CDN bu ortamdan da 404/521. Elendi. |
| Quaternius (CC0 benzeri QAL, ticari ✓) | Site açık; indirmeler **Google Drive klasörlerinde** (otomatik indirme güvenilir değil). Elle indirip `public/models/quaternius/<paket>/` altına bırak + `public/models/ledger.json`'a ekle. En faydalısı: *Animated Man/Woman* (animasyonlu insan), *Furniture*, *Downtown City Mega Kit*. Yeniden dağıtım yasak → repoya eklenmez (gitignore'a ekle). |
| Poly Pizza, ambientCG, Sketchfab | Poly Pizza 403, ambientCG bağlanamadı; Sketchfab lisansları model bazında → otomatik alınmadı. |
| Yazı tipleri | IBM Plex Mono + Barlow Condensed zaten yerel (OFL). Başka font istenirse `@fontsource/*` paketleri npm'den gelir. |

## Kural
Bir paket **ledger'da yoksa** ses/model dizini `npm run audio`/`npm run models` hata verir. Yeni paket: dosyalar → `ledger.json` satırı (kaynak, lisans, tarih, ticari mi, atıf) → `npm run audio` / `npm run models`.
