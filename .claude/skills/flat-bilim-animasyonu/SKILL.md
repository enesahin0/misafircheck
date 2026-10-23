---
name: flat-bilim-animasyonu
description: Kurzgesagt (In a Nutshell) tarzından esinlenen flat vektör bilim/fikir animasyonu üretim sistemi. Kullanıcının gönderdiği seslendirme dosyasından, görselleri Claude'un kendisi SVG/CSS/JS ile çizerek, sesle senkronlu MP4 video üretir; ayrıca senaryo, storyboard, palet, karakter, animasyon, ses tasarımı ve thumbnail üretir. Kullanıcı bir ses/seslendirme dosyası (mp3, wav, m4a) yüklediğinde, "bu sese göre video yap", "videoyu üret", "sahneleri çiz", "animasyonu yap" dediğinde, kanal için video, bölüm, senaryo, storyboard, thumbnail istediğinde ya da "o tarzda", "kanalın tarzında", "Kurzgesagt gibi", "bilim anlatım videosu" gibi ifadeler kullandığında, açıkça skill adı geçmese bile MUTLAKA bu skill'i kullan.
---

# Flat Bilim Animasyonu — Kanal Stil Sistemi

Bu skill, kanal için Kurzgesagt'ın görsel ve anlatı dilinden **esinlenen ama ona ait hiçbir karakteri, logoyu veya markayı kopyalamayan** özgün videolar üretmek içindir. Hedef: izleyicinin "bu Kurzgesagt tarzında bir kanal" diye hissettiği ama kanalın kendi kimliği olan içerik.

**Çalışma modeli:** Kullanıcı yalnızca seslendirme dosyasını gönderir. Görselleri kullanıcı üretmez; **tüm görselleri Claude kodla (SVG + CSS + JS) çizer**, kare kare render eder ve sesle birleştirip MP4 teslim eder. Dış görsel araçlarına (Midjourney vb.) prompt yazmak varsayılan iş değildir; sadece kullanıcı özellikle isterse yapılır.

Varsayılan çıktı dili **Türkçe**.

## Önce oku: hangi referans dosyası ne zaman

| Dosya | Ne zaman oku |
|---|---|
| `references/sesten-videoya.md` | **Ses dosyası geldiğinde veya video istendiğinde ilk okunacak dosya.** Ana üretim hattı: ses analizi → sahne planı → sahne HTML'leri → render → MP4. |
| `references/gorsel-dil.md` | Herhangi bir görsel üretmeden, sahne tarif etmeden veya prompt yazmadan önce. Stilin kalbi burada. |
| `references/paletler.md` | Renk seçerken, SVG çizerken, prompt yazarken. Hazır hex paletleri içerir. |
| `references/karakterler.md` | Sahnede canlı, insan, hücre, hayvan ya da maskot varsa. |
| `references/animasyon-ve-kamera.md` | Storyboard, animasyon notu, After Effects/AI video talimatı yazarken. |
| `references/senaryo.md` | Senaryo, anlatım metni, kanca, kapanış yazarken. |
| `references/svg-rehberi.md` | Her sahne çiziminde: rim light, glow, gölge, göz vb. SVG teknikleri. |
| `references/prompt-sablonlari.md` | Sadece kullanıcı dış bir AI görsel/video aracı için prompt isterse. |
| `references/ses-tasarimi.md` | Müzik, SFX, seslendirme yönetimi istendiğinde. |

Tek bir sahne istense bile `gorsel-dil.md` + `paletler.md` her zaman okunur; tutarlılık bu iki dosyaya bağlı.

Hazır dosyalar:
- `scripts/ses_analiz.py` — sesten cümle zaman çizelgesi (ffmpeg duraklama tespiti + senaryo hizalama)
- `scripts/transkript.py` — isteğe bağlı otomatik yazıya dökme (internet gerekir)
- `scripts/render.py` — sahne HTML'lerini kare kare render eder, sesi ekler, MP4 üretir
- `assets/ortak/stil.css` + `assets/ortak/kit.js` — ortak animasyon sınıfları ve çizim fonksiyonları
- `assets/sahne-kit-ornek.html` — kit kullanan kısa sahne örneği (önerilen başlangıç)
- `assets/sahne-sablonu.html` — kitsiz, serbest SVG sahne örneği
- `assets/ornek-sahne.svg` — statik stil referansı

## Stilin 10 altın kuralı (özet)

1. **Kontur yok.** Şekiller çizgiyle değil, renk ve ton farkıyla ayrılır.
2. **Yuvarlak geometri.** Daire, kapsül, köşesi bol yuvarlatılmış dikdörtgen. Keskin köşe yalnızca tehlike/tehdit anlatırken.
3. **Koyu, doygunluğu düşük zemin + 2–3 parlak vurgu rengi.** Saf siyah (#000) asla kullanılmaz; en koyu ton lacivert, mor ya da petroldür.
4. **Işık hikâye anlatır.** Tek yönden gelen ışık: aydınlık kenarda ince "rim light" hilali, gölge tarafında aynı rengin koyu tonu, zemine uzanan yumuşak gölge. Önemli nesneler hafifçe **parlar** (glow).
5. **Tek sahne = tek fikir.** Kadrajda izleyicinin bakacağı tek bir odak vardır; geri kalan her şey daha koyu, daha küçük ya da bulanıktır.
6. **Derinlik katmanlarla kurulur:** koyu siluet ön plan → detaylı orta plan → sade, soluk arka plan. Katmanlar paralaks ile hareket eder.
7. **Hiçbir şey tamamen durmaz.** Yüzme, salınım, göz kırpma, parçacık akışı; sahne donmuş görünmemeli.
8. **Ölçek oyunu.** Mikrodan makroya (atom → hücre → insan → gezegen → galaksi) zoom geçişleri stilin imzasıdır.
9. **Sevimli ama ciddi.** Karakterler basit ve sevimli; konu ise ciddi, bilimsel ve kaynaklı. Kıyamet anlatırken bile ton sakin ve meraklı.
10. **Anlatım görüntüyü sürer.** Her cümle bir görsel fikre karşılık gelir; animasyon seslendirmenin ritmine kilitlenir.

## Telif ve özgünlük sınırı (kesin kural)

Stil esinlenilebilir; eser ve karakter kopyalanamaz. Bu yüzden:

- Referans kanalın **kuş maskotunu, köpeğini, ördeğini ya da tanınan herhangi bir karakterini** çizme, tarif etme, prompt'a yazma. Onlara benzeyen varyasyon da üretme (renk/poz değiştirmek karakteri özgün yapmaz).
- Referans kanalın **adını, logosunu, yazı stilini, jenerik/outro kartlarını** videoya koyma. (Dış araç promptu yazılırsa orada da "Kurzgesagt style" yerine `prompt-sablonlari.md`'deki tarifsel stil bloğu kullanılır.)
- Belirli bir videonun sahnesini birebir yeniden kurma. Aynı konuyu anlatmak serbest; aynı görsel çözümü kopyalamak değil.
- Kanalın **kendi maskotu** varsa (kullanıcı tanımladıysa) onu kullan. Yoksa `karakterler.md`'deki kurallarla özgün bir maskot öner ve kullanıcının onayını al.

## İş akışı A — Ses dosyası geldi (varsayılan)

`references/sesten-videoya.md`'yi aç ve adımlarını izle. Özet:

1. **Metni bul.** Claude sesi duyamaz. Senaryo metni konuşmada/projede varsa kullan; yoksa `transkript.py`'yi dene; o da olmazsa kullanıcıdan metni iste. Metin olmadan sahne üretme.
2. **Ses analizi:** `ses_analiz.py` → `timeline.json` (cümle başı/sonu saniyeleri).
3. **Sahne planı:** Cümleleri 3–7 sn'lik sahnelere grupla; her sahne için görsel fikir, palet, olay zamanları, geçiş. Tabloyu kullanıcıya kısaca göster, `plan.json`'a yaz.
4. **Stil karesi:** İlk 1–2 sahneyi üret, `render.py --kare` ile PNG al, `view` ile bak, kontrol listesinden geçir, düzelt.
5. **Sahneleri üret:** `sahneler/sNN.html`, tercihen kit ile. Zamanlama sözleşmesine uy (t=0 sahne başı; olaylar pozitif delay; JS hareketi sadece `renderAt(t)`).
6. **Render:** `render.py --sahne 1-8`, `--sahne 9-16`… parça parça; sonra `--birlestir`.
7. **Teslim:** MP4'ü outputs'a kopyala, `present_files` ile sun. Kısa not: süre, sahne sayısı, düzeltme için sahne numarası verebileceği.

Kullanıcı sadece sesi attıysa ve senaryo zaten konuşmada varsa, adım adım onay isteme; stil karesini gösterip devam et ve videoyu bitir.

## İş akışı B — Konu verildi, ses henüz yok

1. **Konu çerçevesi:** Tek cümlelik merak sorusu, hedef süre (belirtilmemişse 8–10 dk; Shorts 45–60 sn), 3–5 bölümlük omurga. Rakamları doğrula ya da "[doğrulanacak]" işaretle.
2. **Senaryo:** `senaryo.md` kurallarıyla seslendirmeye hazır Türkçe metin + kaynakça. Bu metni kullanıcı seslendirip geri gönderdiğinde İş akışı A başlar; aynı metin zamanlama için kullanılır.
3. İstenirse storyboard (aşağıdaki şablon), ses tasarımı notları (`ses-tasarimi.md`), başlık ve thumbnail konsepti.

Storyboard sahne şablonu:
```
SAHNE 07 — [00:42–00:47] — "Kısa sahne adı"
Anlatım: "…bu cümle…"
Görsel: Kadrajda ne var, odak ne, arka plan ne.
Palet: [paletler.md'den palet adı] + vurgu rengi
Olaylar: 0.4 sn gezegen pop-in, 1.8 sn sayaç başlar …
Idle: süzülme, yıldız titreşimi …
Kamera / Geçiş: push-in; sonunda match cut → sahne 08
```

## Thumbnail
Thumbnail'ı da Claude çizer: tek sahne HTML'i, 1280×720, `render.py --kare` ile PNG. Kurallar `gorsel-dil.md` → Thumbnail.

## Tutarlılık kontrol listesi (her çıktıdan önce)

- [ ] Hiçbir şeyde kontur/outline yok mu?
- [ ] Saf siyah yerine koyu renkli zemin mi kullanıldı?
- [ ] Sahnede tek net odak var mı ve en parlak/en kontrastlı öğe o mu?
- [ ] Işık yönü sahne boyunca tutarlı mı (rim light + gölge aynı yönden)?
- [ ] Palet `paletler.md`'deki bir paletten mi, en fazla 5–6 renk mi?
- [ ] Karakterler özgün mü, referans kanalın karakterlerine benzemiyor mu?
- [ ] Anlatım cümlesi ile görsel aynı şeyi mi söylüyor?
- [ ] Sahnede en az bir idle hareket tanımlandı mı?
- [ ] Olaylar anlatımdaki anahtar kelimeyle aynı anda (0.1–0.2 sn önce) mı oluyor?
- [ ] JS hareketleri yalnızca `renderAt(t)` içinde ve deterministik mi?
- [ ] Bilimsel rakamlar kaynaklı veya "[doğrulanacak]" işaretli mi?
