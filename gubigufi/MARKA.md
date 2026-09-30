# gubigufi — Marka ve Üretim Kuralları

## İş akışı (her video)
1. Kullanıcı konu numarasını seçer.
2. `gubigufi/<YYYY-AA-GG>/<NN>-<konu-adi>/` klasörü açılır.
3. Claude `seslendirme_metni.md` dosyasını yazar (ElevenLabs'e yapıştırmaya hazır).
4. Kullanıcı ElevenLabs'te seslendirir, ses dosyasını gönderir → `ses.mp3` olarak klasöre konur.
5. Claude videoyu sese göre kurar → `video.mp4` aynı klasöre, kullanıcıya gönderilir.

## Format
- 1080×1920 (9:16), 30 fps, H.264 + AAC, ~60 sn.
- Safe alan (Instagram + YouTube kesişimi): üst 250 px, alt 480 px, sağ 190 px, sol 60 px.
  Okunması gereken hiçbir şey bu bölgelere girmez; arka plan tüm kareyi kullanır.

## Görsel prensipler
- Görsel her şeydir. Slayt yok. "Kesme, dönüştür": her sahne bir öncekinin içinden doğar.
- Geçişler her videoda konuya özel tasarlanır — maksimum yaratıcılık.
- Yazı yalnızca vurgu: büyük rakam, kilit kelime, kaynak damgası. Yazı sahnenin parçası olur.
- Her kategorinin kendi vurgu rengi var (logo gelince palet netleşecek).
- Sabit markalar: renk sistemi, font çifti, 60 sn sayacı, kaynak damgası, EFSANE/GERÇEK mührü,
  "BİLİM HÂLÂ TARTIŞIYOR" rozeti, sondaki ses logosu.

## Anlatı kalıbı
0–3 kanca · 3–10 soru · 10–40 üç adım (her biri mini kancayla biter) · 40–52 ters köşe ·
52–57 kapanış + kaynak · 57–60 döngü (son kare ilk cümleye bağlanır).
Anlatıcı: "sen" diye hitap eden, merakını paylaşan arkadaş.

## Ses
- Seslendirme: ElevenLabs (her videoda aynı ses ve aynı ayarlar).
- Müzik: özgün, sade, yormayan; anlatının altında kalır (konuşma sırasında kısılır).
- Efektler anlatıyı destekler, bastırmaz.

## Logo ve renkler (logo: `marka/logo.svg`, parçalar: `marka/logo_paths.json`)
- Logo: "gubi / gufi" iki satır, geometrik yuvarlak harfler (#231F20).
  "gubi"deki i'nin noktası iki amber pırıltı (#FBAC39), "gufi"deki i'nin noktası kırmızı kare (#EE312E).
- Koyu zeminde harfler krem (#F6F1E7) kullanılır.
- Marka renkleri: Gece #141112 (zemin) · Krem #F6F1E7 (yazı) · Pırıltı #FBAC39 · Kırmızı kare #EE312E
- Motifler: pırıltı ✦ = merak/aha anı ve geçiş; kırmızı kare ■ = dikkat/zaman (60 sn sayacının ucu).
- Ses logosu: pırıltılar "ting-ting", kırmızı kare "pıt".

## Kategori renkleri
Türkiye & Anadolu #E07A3F · Osmanlı & Türk Tarihi #16A39A · Kelimelerin Hikâyesi #3D8BFD ·
Uzay #7B61FF · İnsan Vücudu #FF6B81 · Doğa & Hayvanlar #6CC04A · Psikoloji & Beyin #E056C1 ·
Yanlış Bilinen #EE312E · Gündelik Şeyler #FFD23F · Bilim & Teknoloji #00C2E0 · Sinema & Perde Arkası #E8E2D6

## Tipografi (`marka/fonts/`)
Outfit (Black: başlık/rakam, Light: altyazı) · JetBrains Mono (kaynak damgası, tarih, veri)
