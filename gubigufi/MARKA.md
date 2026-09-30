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
| 5 | Dünyayı Kurtaran Adam (Türk Star Wars) | Sinema & Perde Arkası | Sinema salonu teması; klaket açılışı, spot ışığı, storyboard eskizi, BÜTÇE yazılı cam kavanoz (içinde tek altın para), kavanozun devrilip paranın düşmesi, karton uzay gemisi, projektör huzmesi + süzülen makara, İZİNSİZ damgası, perde + önde sallanan karton kokpit (arka projeksiyon kesiti), pikapta plakların makasla kesilip bantlanması, köpük kaya POFF + trambolin BOİNG, EŞİ YOK rozeti, yağan TURKISH STAR WARS biletleri + gülen seyirci, neon KÜLT tabelası, el fenerli arşiv araması, emekli makinist silueti, perdeye dönen klaket; geçiş: film şeridi gibi yukarı kayma (makara delikli); müzik: özgün 80'ler retro synth (La minör, 112 bpm) |
| 6 | Venüs'te bir gün > bir yıl | Uzay | İLK SKILL VİDEOSU (flat-bilim-animasyonu): Derin Uzay + Güneş Sistemi Sıcak paletleri; rim light'lı Venüs (kayan bulut bantları), Gubi & Gufi ilk görünüm (parti şapkası + mumlu pasta, konfeti), GÜN>YIL kartları, Güneş etrafında yörünge + iz + sayaç, dönüş oku + iki ilerleme çubuğu (225/243), YIL-GÜN yarışı, Dünya-Venüs zıt dönüş okları, Venüs yüzeyinde batıdan doğan Güneş (BATI/DOĞU tabelaları), kopan takvim yaprakları (117), Venüs'te kahvaltı + termometre 460°C + terleyen Gufi, terazi (pastalar vs tek sabah), maskotların logoya dönüşmesi; müzik: ambient synth pad + kristal arpej (D, 90 bpm) |

Sonraki videolarda kaçınılacaklar: aynı kategoriyi arka arkaya kullanmak, "geri çekilip kesit/kuşbakışı gösterme" açılımını 3. kez yapmak, sepya/eski fotoğraf, kırma-parçalama geçişi, toprağa iniş, büyüteç/röntgen, sansür şakası, kürsü-konfeti, pasaport/damga, iris geçişi, film şeridi geçişi, klaket, projektör.

## Instagram açıklama kuralları
- En fazla **5 hashtag**. Sıra: 1 konuya özel, 1 kategori/seri, 1-2 genel keşif, en sonda her zaman #gubigufi.
- İlk satır = kanca (akışta sadece o görünür). Sonda yorum sorusu + kaynak + "gubigufi ✦ 1 dakikada bir merak".

## #6'dan itibaren: `flat-bilim-animasyonu` skill'i
Bundan sonraki bütün videolar `.claude/skills/flat-bilim-animasyonu/` skill'ine göre üretilir.
Skill'in stil kuralları (kontur yok, yuvarlak geometri, koyu desatüre zemin + 2-3 parlak vurgu, rim light,
glow, parçacık, katmanlı derinlik/paralaks, her sahnede idle hareket, tek sahne = tek fikir) esastır.

Kanala özel uyarlamalar (skill'le çelişmez, üstüne eklenir):
- Format: dikey 1080×1920 (skill'in Shorts yönergesi). Odak üst-orta; alt %25 altyazıya ayrılır.
- Güvenli alan, kinetik altyazı, kategori etiketi, 60 sn sayacı ve gubigufi logo kapanışı korunur.
- Kanal imza renkleri: pırıltı amber #FBAC39 + kırmızı kare #EE312E (skill'in "imza rengi" kuralı).
- Paletler skill'in `paletler.md` dosyasından seçilir; kategori renkleri etiket rengi olarak kalır.
- Müzik: skill'e uygun ambient / sinematik synth (her videoya özgün), anlatımın altında alçak.
- Üretim hattı: skill'in `ses_analiz.py` → sahne planı → `sahneler/sNN.html` → `render.py` → birleştirme.
- Maskot: skill kuralı gereği özgün olmalı (kuş/ördek/köpek yok); seçim kullanıcı onayıyla yapılır.

## Maskotlar: Gubi & Gufi (çizim: `marka/ortak/maskot.js`, kart: `marka/maskot_karti.png`)

```
MASKOT KARTI — GUBİ
Ad: Gubi
Şekil: uçları yuvarlatılmış, tombul 4 köşeli yıldız (logodaki pırıltıdan doğar); arkasında yumuşak glow
Renkler: gövde #FBAC39, gölge #B4532A, rim light #FFE9B8, glow #FFD27A, göz bebeği #1B1640
Ayırt edici detay: sürekli hafif parlar; heyecanlanınca glow büyür
Kişilik: meraklı, soru soran, "aha!" anlarının sahibi — izleyicinin merakı
İngilizce prompt tarifi: "a small chubby four-pointed star character with rounded tips, warm amber #FBAC39 body, soft golden glow, big white oval eyes with navy pupils, no mouth, no outline, flat vector"

MASKOT KARTI — GUFİ
Ad: Gufi
Şekil: yuvarlak köşeli kırmızı kare gövde + iki minik yuvarlak ayak (logodaki kırmızı kareden doğar)
Renkler: gövde #EE312E, gölge #8E1B3F, rim light #FFC7BD, göz bebeği #1B1640
Ayırt edici detay: zıplayarak hareket eder, şaşırınca gözleri kocaman olur
Kişilik: tepkici, şaşıran, bazen yanılan — izleyicinin şaşkınlığı
İngilizce prompt tarifi: "a small rounded-square character, bright red #EE312E body, two tiny round feet, big white oval eyes with navy pupils, no mouth, no outline, flat vector"
```
Kullanım: her videoda 3–6 kısa rol. Gubi soruyu sorar / aha anında parlar, Gufi şaşırır / tepki verir; kapanışta ikisi logoya dönüşür.

## Logo kapanışı
Kapanıştaki gubigufi logosu ekranın TAM ORTASINDA durur (x 540, y ~940, genişlik ~660). Kapanışta altyazı/etiket olmadığı için
safe alan kaydırması uygulanmaz (kullanıcı geri bildirimi, #6 sonrası).

## Üst köşe yerleşimi (#7'den itibaren)
- Kategori etiketi sol üstte (x 62'den başlar, y ≈ 292).
- 60 sn sayaç halkası SAĞA YASLI: merkez x 974, y 300 (dış kenar 1018 = 1080 − 62, sol etiketle simetrik). Kullanıcı geri bildirimi.
- Güncel kanal katmanı: `marka/ortak/kanal.js` + `kanal.css` — her yeni videoda bunlar kopyalanır.
