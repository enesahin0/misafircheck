# Türkiye 81 İl Puzzle Modeli — Blender 5.2 üretim betiği

`turkiye_puzzle.py` tek başına çalıştırılabilir, eksiksiz bir Blender 5.2 betiğidir. Üretir:

| Nesne | STL | İçerik |
|---|---|---|
| `Turkiye_Taban` | `Turkiye_Taban.stl` | Dikdörtgen taban + **tek ve kesintisiz Türkiye yuvası** + **sabit** deniz yüzeyleri + **sabit** adalar + **sabit** komşu ülkeler (tek gövde) |
| `01_Adana` … `81_Düzce` | `01_Adana.stl` … | 81 çıkarılabilir il parçası: içe gömülü il adı, yuvarlatılmış üst kenar |

Önizleme: [`onizleme.png`](onizleme.png) (STL dosyalarından, montajlı yerleşim).

## ÖNEMLİ — mevcut projeniz hakkında

Bu depoda sizin Blender projeniz ya da Python üretim betiğiniz **yoktu** (depodaki tek dosya ilgisiz bir Streamlit uygulaması). Bu yüzden mevcut geometri incelenip korunamadı; model sıfırdan, kamuya açık verilerden üretildi. Kendi `.blend`/betiğinizi depoya yüklerseniz yuva/il geometrisini yeniden üretmek yerine onun üzerine uyarlayabilirim.

## Hızlı başlangıç

1. Depoyu klasör yapısı bozulmadan indirin (`data/`, `fonts/` betikle birlikte durmalı).
2. **Blender 5.2** → *Scripting* → *Open* → `turkiye_puzzle.py` → *Run Script*, **veya**
   `blender --background --python turkiye_puzzle.py`
3. Varsayılan `MODE = "TEST"`: 3 il (büyük **Konya**, küçük **Yalova**, dar/karmaşık **Hatay**) + taban üretilir (~3 sn). Raporu inceleyin.
4. Sonuç doğruysa betiğin başında `MODE = "FULL"` yapıp tekrar çalıştırın (81 il, ~35 sn).
   (Geçici: `TR_PUZZLE_MODE=FULL blender -b --python turkiye_puzzle.py`)

Çıktılar `cikti/` klasörüne yazılır: `stl/*.stl`, `rapor_<mod>.txt|json`, `rapor_iller_<mod>.csv`, `turkiye_puzzle_<mod>.blend` (**kopya**; açık dosyanız bozulmaz). Betik yeni bir sahne (`TR_PUZZLE_TEST/FULL`) oluşturur, mevcut sahnelerinize dokunmaz.

Ek bağımlılık gerekmez: varsayılan parametrelerle betik `data/` içindeki hazır önbellekleri kullanır (shapely gerekmez). 2D parametrelerden birini (`MAP_WIDTH_MM`, `POCKET_CLEARANCE_MM`, …) değiştirirseniz önbellek yeniden hesaplanır; bunun için `shapely` gerekir — yoksa betik Blender Python'una `pip` ile kurmayı dener (internet gerekir). Yalnızca 3B parametreleri (pah, gravür derinliği, yükseklikler) değiştirmek önbelleği geçersiz kılmaz.

## Parametreler (betiğin başı)

| Parametre | Varsayılan | Açıklama |
|---|---|---|
| `MAP_WIDTH_MM` | 360 | Türkiye doğu-batı uzunluğu |
| `FRAME_MARGIN_MM` | 30 | Taban çerçevesi payı → taban **420 × 212 × 6 mm** |
| `POCKET_CLEARANCE_MM` | **0,25** | Montaj toleransı, **TEK TARAFLI** (aşağıya bakın) |
| `PIECE_GAP_MM` | 0 | >0 ise komşu iller arasında **toplam** bu kadar boşluk |
| `BEVEL_WIDTH_MM` / `BEVEL_SEGMENTS` | 0,40 / 4 | Üst kenar pahı (dairesel profil) |
| `BEVEL_FALLBACK_WIDTHS` | 0,30 … 0,06 | Dar bölgede otomatik küçültme sırası |
| `ENGRAVE_DEPTH_MM` | 0,40 | Gravür derinliği |
| `TEXT_MIN_CAP_HEIGHT_MM` / `TEXT_MAX_…` | 1,6 / 6,0 | Büyük harf yüksekliği aralığı |
| `TEXT_WALL_MM` | 0,6 | Yazı ile pah arasında kalan düz yüzey |
| `TEXT_CASE` | `"upper"` | `"upper"` (Türkçe kurallı İ/I) veya `"title"` |
| `LAND_TOP_Z`, `SEA_DEPTH_MM`, `POCKET_DEPTH_MM`, `PIECE_HEIGHT_MM` | 6 / 1 / 3 / 5 | Yükseklikler |
| `COUNTRY_GROOVE_WIDTH_MM` / `_DEPTH_MM` | 0,5 / 0,3 | Komşu ülkeler arası sınır oluğu (0 = yok) |
| `FONT_PATH` | boş | Boşsa depodaki DejaVu Sans Bold (Türkçe tam) |

### Montaj toleransı — ne anlama geliyor?

* Yuva duvarı, birleşik harita dış kenarından **her yanda 0,25 mm** dışarıdadır (tek taraflı). Yuva toplamda haritadan **0,50 mm** geniştir. Ölçülen en küçük boşluk: **0,247 mm**.
* İl parçalarının **birbirine bakan sınırları birebir örtüşür** (boşluk 0, çakışma 0). Baskıda sıkı geliyorsa `PIECE_GAP_MM = 0.2` deneyin.

## Tasarım kararları

* **Tek ve kesintisiz yuva:** yalnızca anakaranın (Anadolu + Trakya) dış sınırı; 81 ayrı yuva yok, tabanda il sınırı çizgisi/oluğu yok. Boğazlar (İstanbul ≈ 0,17 mm, Çanakkale ≈ 0,3–1,7 mm ölçekte) tolerans içinde kaldığından yuva tek parça çıkar; Marmara Denizi yuvanın içinde sabit bir deniz yüzeyi olarak kalır.
* **Adalar, denizler, komşu ülkeler = tabana sabit.** Hiçbiri çıkarılabilir parça değil; hepsi aynı mesh'te (tek gövde, Euler sayısı 2). Seviyeler: kara/komşu ülke z=6, deniz z=5, yuva zemini z=3, ülke sınırı oluğu z=5,7. İl parçaları z=3'ten 5 mm yükselir.
* **Komşu ülkeler:** Natural Earth 1:10m (kamu malı), aynı izdüşümle çerçeveye kırpılmış; il verisiyle uyuşmayan sınır şeritleri onarıldı.
* **Adalar:** 242 adacıktan basılabilir olan **17'si** (≥ 0,15 mm²) tabana sabitlendi; 225 mikro adacık (toplam 3,3 mm²) atıldı. Adalar ilin parçası değil, tabanın parçasıdır (örn. Gökçeada).
* **Kaynak veri onarımı (en kritik risk):** tr-cities verisinde komşu iller birbirine **oturmuyor** — 620 çakışma yüzü + 541 boşluk yüzü + 525 delik. Düzlemsel-graf yöntemiyle onarıldı: sonuçta çakışma **0,0 mm²**, birleşim = toplam alan, ortak kenarlar birebir.
* **Pah güvenliği:** kısa kenarlar komşularla tutarlı birleştirildi, pah için güvensiz sivri uçlar (339 adet, ≤ ~0,04 mm² her biri) budandı, dar kıyı şeritlerinde pah uygulanmaz. Her il için pah **önce tam genişlikle**, kendi kendini kesme/manifold testi geçmezse daha küçük genişlikle denenir.
* **Gravür:** Boolean *Difference* (EXACT çözücü). Yazı çokgenleri `fonts/` içindeki DejaVu Sans Bold'dan çıkarılıp 2D'de birleştirilir (Ç, Ş gibi çakışan kontürler tek temiz çokgen olur); kesici kapalı manifold prizmadır. Yazı, ilin "kenara uzaklık haritasında" pahtan en az `0,4 + 0,6 + 0,15 mm` içeride aranır; dar illerde il eksenine döndürülür. Çıkarılan hacim = beklenen hacim (±%10) olarak doğrulanır.

## Son çalıştırma sonuçları (FULL, Blender 5.2.3)

* 81 il işlendi: **80 OK, 1 UYARI, 0 hata**. Taban: OK. Ad/sayı denetimi: 81/81 nesne, yinelenen yok, eksik yok, 81 STL adı = nesne adı.
* Tüm parçalar: kapalı manifold, açık kenar 0, sıfır alanlı yüz 0, ters normal 0, kendi kendini kesme 0. Hepsi **bağımsız `trimesh`** ile de doğrulandı (su geçirmez, tutarlı yüz yönü, hacimler rapordaki ile birebir).
* Yuva uyumu: 81/81 parça yuvanın içinde, en küçük boşluk 0,247 mm.
* Pah: 74 il tam **0,40 mm**; 7 ilde dar bölge nedeniyle otomatik küçüldü (Denizli, Elazığ, Hatay, Van 0,30; Balıkesir, İzmir 0,22; Muğla 0,15).
* Yazı: **78 ilde il adı**, 2 ilde plaka kodu, 1 ilde yazı yok:
  * **Zonguldak (67), Osmaniye (80):** adın sığması için çok küçük → plaka kodu gravürlendi.
  * **Yalova (77): gravür yok.** İl içine sığan en büyük daire yarıçapı 1,46 mm; adı sığdırmak için harita ≈ 1,7 m genişlikte olmalı. Betik bunu **UYARI** olarak raporlar, parçayı yine üretir. Çözüm: Yalova'yı elle etiketleyin ya da tabana/ambalaja ad ekleyin.
* En küçük il adı yüksekliği 1,62 mm; DejaVu Bold gövde genişliği ≈ 0,41 mm (0,4 mm lüle sınırında). Reçine baskıda sorun yok; FDM'de `TEXT_MIN_CAP_HEIGHT_MM = 1.8` yapıp küçük illerde plaka koduna düşmeyi kabul edebilirsiniz.

## Üretim öncesi kontrol listesi

- [ ] `MODE="TEST"` çalıştırıldı; `cikti/rapor_test.txt` içinde 3 il + taban **OK**/beklenen UYARI.
- [ ] `MODE="FULL"`; raporda `AD / SAYI DOĞRULAMA: TAMAM`, `[HATALAR]` bölümü yok.
- [ ] Taban **420 × 212 mm**: yatağınıza sığmıyorsa `MAP_WIDTH_MM`'i küçültün (küçük illerde adlar plaka koduna düşer) ya da bölerek basın.
- [ ] Birimler mm; slicer'da ölçek %100.
- [ ] İl STL'lerini alt yüzü plakaya gelecek şekilde (z=0 taban) basın; gravür **üst** yüzde.
- [ ] Deneme: 1–2 komşu ili basıp yuvaya oturtun; sıkıysa `POCKET_CLEARANCE_MM` / `PIECE_GAP_MM` artırın.
- [ ] `Yalova` UYARI'sı ve plaka koduna düşen iller kabul edildi.

## Bilinen sınırlamalar

* Kaynak il verisi düşük çözünürlüklü (≈ 1–2 km); sınırlar `SIMPLIFY_TOL_MM = 0,08 mm` (≈ 0,3 km) ile sadeleştirildi, kıyı çıkıntı uçları pah için budandı (anakarada toplam ≈ −83 mm² = %0,2).
* 360 mm ölçekte 1 mm ≈ 4,2 km: İstanbul ve Çanakkale boğazları görünür değildir.
* Komşu ülke sınırı: il verisi ile Natural Earth sınırı birebir aynı değil; aradaki ≤ ~1,6 mm'lik şerit karaya çevrilerek kapatıldı.
* Bu ortamda Blender GUI/render yoktu: doğrulama `bpy` 5.2.3 (başsız) + bağımsız `trimesh` ile yapıldı; arayüzde "Run Script" yolunu ben çalıştıramadım.

## Veri kaynakları ve lisanslar

* İl sınırları: [alpers/Turkey-Maps-GeoJSON](https://github.com/alpers/Turkey-Maps-GeoJSON) (Apache-2.0) — `data/tr-cities.json`
* Komşu ülkeler: Natural Earth 1:10m Admin 0 (kamu malı) — `data/komsu_ulkeler_ne10m.json`
* Yazı tipi: DejaVu Sans Bold (Bitstream Vera lisansı, `fonts/DejaVu-LICENSE.txt`)
* `data/geometri_onbellek.json`, `data/yazi_onbellek.json`: betiğin ürettiği önbellekler (yeniden üretilebilir).
