# Sesten Videoya — Ana Üretim Hattı

Kullanıcı yalnızca **seslendirme dosyasını** gönderir; görselleri Claude kodla (SVG + CSS + JS) üretir, kare kare render eder ve sesle birleştirip MP4 teslim eder. Bu dosya o hattın adım adım tarifidir.

İçindekiler: 0) Girdiler · 1) Kurulum · 2) Ses analizi · 3) Sahne planı · 4) Stil karesi · 5) Sahne üretimi · 6) Render · 7) Teslim · 8) Uzun videolar · 9) Sorun giderme

---

## 0. Girdiler — Claude sesi duyamaz

Claude ses dosyasının içeriğini dinleyemez. Hangi cümlenin ne zaman söylendiğini bilmek için şu sırayla dene:

1. **Senaryo metni** (en iyisi): Kullanıcı sesle birlikte metni de verdiyse veya metin aynı konuşmada/projede varsa onu kullan.
2. **Otomatik transkript:** `scripts/transkript.py` (faster-whisper). Sadece ortamda internet açıksa kurulabilir. Dene; kurulamazsa 3'e geç.
3. **Kullanıcıdan iste:** "Sesi aldım; zamanlamayı çıkarabilmem için seslendirmede okuduğun metni de yapıştırır mısın?" Tek cümle, net.

Metin gelmeden sahne üretmeye başlama; yanlış senkron tüm işi çöpe atar.

## 1. Kurulum

```bash
mkdir -p ~/proje/{sahneler,ortak} && cd ~/proje
cp <skill>/scripts/*.py .
cp <skill>/assets/ortak/* ortak/
cp /mnt/user-data/uploads/<ses dosyası> ses.<uzantı>
which ffmpeg ffprobe && python3 -c "import playwright"   # ikisi de şart
```
Playwright tarayıcısı yoksa: `python3 -m playwright install chromium` (internet gerekir). Hiçbiri kurulamıyorsa kullanıcıya dürüstçe söyle ve sahneleri tek tek HTML/SVG olarak teslim et.

## 2. Ses analizi

```bash
python3 ses_analiz.py ses.mp3 --metin senaryo.txt --cikti timeline.json
```
- Çıktı: toplam süre, konuşma blokları, her cümlenin başlangıç/bitiş saniyesi.
- `[GÖRSEL: …]` notları ve `#` başlık satırları metinden otomatik atılır.
- Cümle sayısı ile duraklama sayısı çok uyumsuzsa `--esik` (−30…−45) ve `--min-sessizlik` (0.15…0.4) ile oyna.
- İlk sahne 0.0'dan başlar, son sahne `toplam_sure`'de biter (sondaki sessizlik de videoda olmalı).

## 3. Sahne planı (storyboard)

`timeline.json`'dan sahne listesi çıkar:
- Hedef sahne süresi **3–7 sn**. 2 sn'den kısa ardışık cümleleri birleştir; 8 sn'den uzun cümleyi aynı sahne içinde 2 "vuruşa" böl (sahne değişmez, yeni olay olur).
- Sahne sınırları cümle sınırlarına oturur. Sahne değişimi anlatımdaki yeni fikre denk gelsin.
- Sahne içindeki olay zamanları (pop-in, sayaç, etiket): anahtar kelimenin cümle içindeki konumunu karakter oranıyla tahmin et. Ör. 4 sn'lik cümlenin %60'ındaki kelime → cümle başı + 2.4 sn. Olay, kelimeden **0.1–0.2 sn önce** başlasın (göz sesi biraz önden takip eder).
- Aynı fikir süren ardışık sahnelerde aynı palet ve arka planı koru; bölüm değişince palet değiş (`paletler.md`).

Plan tablosu (kullanıcıya göster, `plan.json`'a dönüştür):
```
# | başlangıç–bitiş | anlatım | görsel fikir | olaylar (sahne içi sn) | geçiş
```

`plan.json`:
```json
{ "fps": 25, "genislik": 1920, "yukseklik": 1080, "ses": "ses.mp3", "cikti": "video.mp4",
  "muzik": null,
  "sahneler": [ {"dosya": "sahneler/s01.html", "baslangic": 0.0, "bitis": 4.8}, … ] }
```
Müzik dosyası varsa: `"muzik": {"dosya": "muzik.mp3", "ses_duzeyi": 0.12}`.

## 4. Önce stil karesi (atlama)

Seri üretime geçmeden önce **ilk 1–2 sahneyi** yap ve kontrol et:
```bash
python3 render.py plan.json --kare 1 2.5      # 1. sahnenin 2.5. saniyesi → PNG
```
PNG'yi `view` ile aç ve SKILL.md'deki tutarlılık listesine göre değerlendir. Beğenmediğin şeyi düzelt, sonra devam et. Kullanıcı konuşmadaysa bu kareyi gösterip onay almak iyi fikirdir; ama cevap bekleyerek işi durdurma, kullanıcı "direkt yap" dediyse devam et.

## 5. Sahne üretimi

Her sahne `sahneler/sNN.html` dosyasıdır. İki yol:
- **Kit ile (önerilen, kısa):** `assets/sahne-kit-ornek.html` yapısı. `ortak/stil.css` + `ortak/kit.js` (`K.gok`, `K.yildizlar`, `K.kure`, `K.glow`, `K.yaratik`, `K.goz`, `K.etiket`, `K.ease`, `K.aralik`, `K.sayi`). Sahne başına 30–60 satır.
- **Serbest SVG:** `assets/sahne-sablonu.html` yapısı. Kitin karşılamadığı özel sahneler için.

Zamanlama sözleşmesi (render.py bunu uygular):
- Sahnenin t=0'ı plandaki `baslangic`'tır. Tüm `animation-delay` değerleri **sahne içi saniye**.
- Olaylar: pozitif delay + `both` (ör. `class="popIn" style="animation-delay:1.8s"`).
- Idle döngüler: negatif delay (t=0'da hareket zaten sürüyor olsun).
- Kamera push-in `.kamera` sınıfı sahne süresine (`var(--sure)`) kendiliğinden yayılır.
- JS ile sürülen her şey (sayaç, huzme, yol çizimi, morph) `window.renderAt = t => {…}` içinde, **sadece t'ye bağlı** (Date.now, Math.random, setTimeout yasak; rastgelelik için `K.rnd(seed)`).
- Harici kaynak yok (Google Fonts, CDN, uzak görsel). Yazı tipi: `"Noto Sans CJK JP","DejaVu Sans"` (Türkçe karakterleri basar).
- Her id benzersiz (gradyan ile öğe aynı id'yi paylaşmasın).

Geçişler:
- Sahnenin son 0.3–0.4 sn'sinde çıkış olayı (`popOut`, `fadeOut`) veya bir sonraki sahnenin açılışıyla eşleşen konum/şekil (match cut: s05'in sonundaki daire, s06'nın başında aynı yerde aynı boyutta gezegen olur).
- Ölçek zoom: sahnenin sonunda kamerayı hedef nesneye doğru hızla büyüt (renderAt ile `#kamera` transform), yeni sahne o nesnenin içinden, aynı renkte tam ekranla açılsın.

Verimlilik: Sahneleri birbirinin kopyası gibi uzun uzun yazma. Tekrar eden öğeleri (arka plan, maskot, bölüm paleti) `ortak/` altına kendi fonksiyonu olarak ekle ve sahnelerden çağır.

## 6. Render

```bash
python3 render.py plan.json --sahne 1-8      # parça parça (araç zaman aşımına takılmamak için)
python3 render.py plan.json --sahne 9-16
…
python3 render.py plan.json --birlestir      # parçaları birleştir + sesi (ve müziği) ekle
```
- Hız ölçüsü: tek çekirdekte ~9–10 kare/sn → 1 dk video ≈ 2,5–3 dk render. Bir komutta ~60–90 sn'lik videoyu geçme.
- Hızlı kontrol: `--onizleme` (yarım çözünürlük, 12 fps). Tüm videoyu önizlemek yerine şüpheli sahnelerde `--kare` kullan; genelde daha verimli.
- Render sonrası 2–3 rastgele kareyi `ffmpeg -ss <sn> -i video.mp4 -frames:v 1 kontrol.png` ile çıkarıp bak.

## 7. Teslim

- `video.mp4`'ü `/mnt/user-data/outputs/`'a kopyala ve `present_files` ile sun.
- Yanına kısa not: süre, sahne sayısı, düzeltilmesi istenirse sahne numarasıyla söylemesi ("12. sahnede gezegen daha büyük olsun").
- Düzeltmede sadece ilgili sahneyi yeniden render et (`--sahne 12`), sonra `--birlestir`.

## 8. Uzun videolar (8+ dk)

- Bölüm bölüm çalış: her bölüm için planla → üret → render et. Render edilmiş parçaları her bölüm sonunda `/mnt/user-data/outputs/parcalar/` içine yedekle (çalışma klasörü sıfırlanabilir).
- Bağlam penceresini korumak için sahneleri kısa tut (kit kullan), aynı dosyayı tekrar tekrar ekrana yazdırma.
- Tek konuşmada bitmeyecekse: `plan.json`, `ortak/` ve biten parçaların listesini outputs'a kaydet; kullanıcı yeni konuşmada bunları yükleyerek kaldığı yerden devam edebilir.

## 9. Sorun giderme

| Belirti | Neden / Çözüm |
|---|---|
| Animasyon hiç oynamıyor | `animation` tanımı yok veya `transform-box` eksik; delay'ler sahne süresinden büyük olabilir |
| Her kare aynı | Hareket JS'te gerçek zamanlıysa (rAF, setTimeout) render'da çalışmaz → `renderAt(t)`'ye taşı |
| JS öğesi değişmiyor | Aynı id'li iki öğe (gradyan + şekil) |
| Türkçe harf kutucuk | Font yığını `Noto Sans CJK JP` ile başlamalı |
| Ses ile görüntü kayık | Sahne sınırlarını `timeline.json`'dan tekrar al; olayları 0.1–0.2 sn öne çek |
| Video sesten kısa/uzun | Son sahnenin `bitis` = `toplam_sure` olmalı; sahneler arası boşluk/çakışma olmamalı |
| Render çok yavaş | Blur filtresi (`feGaussianBlur`) yerine radyal gradyan; binlerce öğe yerine desen |
