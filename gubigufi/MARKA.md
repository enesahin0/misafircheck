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

## Yapılanlar kaydı (tekrar etme!)
Her yeni videoda konu, kategori, açılış ve görsel teknikler bu listeyle karşılaştırılır; aynı fikir iki kez kullanılmaz.

| # | Konu | Kategori | Kullanılan başlıca görsel teknikler |
|---|---|---|---|
| 1 | Göbeklitepe | Türkiye & Anadolu | Parçacıklarla zaman geri sarma (Stonehenge dağılır), halatla dikilen sütun, freeze + gri + kırmızı parantez odak, nesnelerin kırmızı çizgiyle parçalanması, kıvılcımdan beyaz flaş, kuşbakışı topoğrafik harita, dikey zaman şeridi, hayalet insan silueti taraması, oymaların ışıkla çizilmesi, oymadan canlanan hayvanlar, sepya polaroid → renkli gerçeklik, kazma + ışık çatlakları, ders kitabı kart yer değişimi, tarama çizgisiyle gömülü halkalar, toprak katmanlarına iniş |
| 2 | Derinkuyu | Türkiye & Anadolu | Balyozla ön cephe duvar yıkımı (taşlar kameraya uçar), kemerli tünel içinde uçuş, zeminden kat kat düşüş (▼ KAT sayacı), kesitte karınca yuvası şehir + derinlik cetveli, odaların tek tek ışıklanması, nokta-insan akışı, yüzeyde atlı akını/ok yağmuru, yuvarlanan sürgü taş, taş deliğinden açılış, yatay tünel pan'ı ile ikinci şehir, gün-gece hızlandırma, duvarın geri örülmesi, çatlaktan ışık |
| 3 | Vombat küp kaka | Doğa & Hayvanlar | Esprili/tatlı ton; sevimli karakter (vombat, gözlü küp), 3B dönen küp, iğneli harita çizimi, pikselli SANSÜR bandı şakası, koku çizgileri, yürürken arkada küp bırakma + sayaç, büyüteçle röntgen, mavi laboratuvar şeması (blueprint), bağırsakta balon şişirme + manometre, ısı haritası bantları, çubuk grafik 1×→2×/4×, uçtan kesitte süperelips (daire→kare) dönüşümü, 'ÇIT!' patlaması, eğimli kayada top vs küp, kürsü + madalya + konfeti, fabrika bandı + VOMBAT-3000 makinesi, sahneler arası yana kayan geçiş; müzik: neşeli marimba/F pentatonik |
| 4 | Turkey = Hindi (Kelimenin Hikâyesi #1) | Kelimelerin Hikâyesi | Pasaport + eski harita teması; kuşta dönen bavul etiketi (TURKEY→HİNDİ→?), dil konuşma balonları, düşen kovboy şapkası/bere, pasaport kapağından sahneye açılış, parşömen haritada kesikli rota + yürüyen beç tavuğu, mürekkep damgaları (dokulu, çarpma), okyanusta gemiyle gelen hindi, etiketin uçup yapışması, Kolomb'un haritasında üstü çizilen HİNDİSTAN, sayfa çevirme, renkli rotaların yumağa dönmesi, başı dönen kuş, BM isim plakası değişimi; sahneler arası iris (daire) açılışı; müzik: pizzicato + akordeon 3/4 vals |

Sonraki videolarda kaçınılacaklar: aynı kategoriyi arka arkaya kullanmak, "geri çekilip kesit/kuşbakışı gösterme" açılımını 3. kez yapmak, sepya/eski fotoğraf, kırma-parçalama geçişi, toprağa iniş, büyüteç/röntgen, sansür şakası, kürsü-konfeti, pasaport/damga, iris geçişi.

## Instagram açıklama kuralları
- En fazla **5 hashtag**. Sıra: 1 konuya özel, 1 kategori/seri, 1-2 genel keşif, en sonda her zaman #gubigufi.
- İlk satır = kanca (akışta sadece o görünür). Sonda yorum sorusu + kaynak + "gubigufi ✦ 1 dakikada bir merak".
