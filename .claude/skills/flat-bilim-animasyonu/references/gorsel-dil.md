# Görsel Dil — Detaylı Analiz

İçindekiler: 1) Genel his · 2) Şekil dili · 3) Renk mantığı · 4) Işık ve gölge · 5) Glow ve atmosfer · 6) Derinlik ve katmanlar · 7) Kompozisyon · 8) Doku · 9) Ölçek ve detay seviyesi · 10) Tipografi ve veri · 11) Ortam türleri · 12) Thumbnail · 13) Yapma listesi

---

## 1. Genel his

Stilin özü: **"Koyu bir sahnede parlayan, yumuşak, oyuncak gibi bilimsel dünya."** Her kare bir poster gibi tek başına durabilir. Görseller bilgi vermekten çok bilgiyi *hissettirmek* için vardır: bir virüs tehditkâr değil ama rahatsız edici; bir gezegen devasa ama sevimli.

Üç kelime: **yuvarlak, parlak, katmanlı.**

## 2. Şekil dili

- **Temel ilkeller:** daire, elips, kapsül (hap), köşeleri yarıçapın %20–50'si kadar yuvarlatılmış dikdörtgen, yumuşak üçgen (köşeleri yuvarlatılmış).
- **Kontur yok.** Nesneler dolgu rengiyle tanımlanır. İki nesne aynı renkteyse aralarına ton farkı veya ince bir gölge bandı konur, çizgi değil.
- **Siluet önce gelir.** Her nesne sadece siyah siluetiyle bile tanınabilmeli. Tanınmıyorsa şekli sadeleştir veya abart.
- **Basitleştirme oranı:** Gerçek nesnenin 3–5 ayırt edici özelliğini tut, gerisini at. (Ağaç = gövde + 3–4 yuvarlak yaprak kümesi. Roket = kapsül gövde + yuvarlak burun + 3 kanatçık + pencere dairesi.)
- **Tekrar ve ritim:** Kalabalık (hücreler, yıldızlar, insanlar) aynı temel şeklin boyut/renk/açı varyasyonlarıyla kurulur. Tam kopya değil, küçük farklarla.
- **Tehlike dili:** Tehdit anlatılırken şekiller keskinleşir (sivri dikenler, çatlaklar, zikzak), renkler kırmızı-mor-turuncuya kayar. Güven anlatılırken her şey yuvarlaklaşır.

## 3. Renk mantığı

(Hex paletler için `paletler.md`.)

- **Zemin koyu ve doygunluğu düşük:** lacivert, gece moru, petrol, koyu bordo. Hiçbir zaman #000000.
- **Vurgular çok doygun ve açık:** magenta-pembe, camgöbeği, sıcak amber-turuncu, limon yeşili, altın sarısı.
- **Tamamlayıcı kontrast:** Soğuk zemin + sıcak odak (lacivert uzayda turuncu güneş) veya sıcak zemin + soğuk odak. Stilin "neon" hissi buradan gelir.
- **Her nesne 3 tondan oluşur:** ana ton, gölge tonu (aynı rengin daha koyu ve biraz daha doygun/soğuk hali), ışık tonu (daha açık, biraz daha sıcak hali). Dördüncü ton sadece önemli nesnelerde (parlama/specular).
- **Gölgeler griye değil renge kayar:** Turuncu bir nesnenin gölgesi gri-kahve değil, koyu kırmızı-bordodur. Mavi nesnenin gölgesi mor-laciverttir.
- **Her videonun/bölümün kendi baskın paleti** vardır ama video içinde bölüm değişince palet de değişebilir (uzay bölümü lacivert, yaşam bölümü yeşil-turkuaz).
- **Atmosferik perspektif:** Uzaktaki nesneler zemin rengine yaklaşır (daha soluk, daha az kontrast).

## 4. Işık ve gölge

Stilin "flat ama hacimli" görünmesinin sırrı ışık kurgusudur.

- **Tek ana ışık yönü** belirle (genelde sol üst veya sağ üst) ve sahne boyunca koru.
- **Rim light (kenar ışığı):** Işığa bakan kenarda ince, hilal şeklinde açık renkli bant. Kalınlığı nesne çapının %5–12'si. Bu, stilin en tanınır detaylarından biridir.
- **Gövde gölgesi:** Işığın tersindeki yarıda, sert kenarlı ama hafif yumuşatılmış daha koyu şekil. Genelde nesnenin %30–50'sini kaplar.
- **Düşen gölge (cast shadow):** Zemine uzun, hafif şeffaf (%20–40 opaklık), zemin renginin koyusu. Işık kaynağının tersine uzanır.
- **Ambient occlusion:** Nesnelerin birbirine veya zemine değdiği yerlerde küçük koyu bölge.
- **Gradyanlar:** Kullanılır ama ince: aynı rengin iki tonu arasında, genelde yukarıdan aşağı (üst açık, alt koyu) veya ışık yönünde. Gökkuşağı gradyan yok.
- **Speküler parlama:** Cam, su, göz, metal gibi yüzeylerde küçük beyaz oval veya iki nokta.

## 5. Glow ve atmosfer

- Enerji kaynakları, yıldızlar, ekranlar, hücre çekirdekleri, önemli nesneler **yumuşak dış parlama** alır: nesnenin renginin açık tonu, büyük yarıçaplı radyal gradyan, %20–50 opaklık, "screen/add" karışım modu.
- **Ortam ışığı:** Parlayan bir nesne yakınındaki diğer nesnelerin kenarını kendi rengiyle boyar (turuncu güneş yanındaki gezegenin rim light'ı turuncudur).
- **Parçacıklar:** Toz, yıldız, kabarcık, spor. Çok sayıda, çok küçük, farklı boyut ve opaklıkta. Bazıları glow'lu. Boşlukları doldurur ve derinlik hissi verir.
- **Hafif sis/haze:** Ufuk çizgisinde veya arka planda zemin renginin açık tonuyla yatay sis bandı.
- **Vignette:** Kadraj kenarları hafifçe koyulaşır, göz ortaya akar.

## 6. Derinlik ve katmanlar

Klasik sahne 3–5 katmandan oluşur:

1. **Ön plan (FG):** Kadrajın alt köşesinde veya kenarlarında koyu, neredeyse siluet nesneler (kaya, bitki, makine parçası). Hafif bulanık olabilir. Kamera hareketinde en hızlı kayar.
2. **Orta plan (MG):** Asıl oyuncu/konu. En detaylı, en kontrastlı, ışığı en iyi alan katman.
3. **Arka plan (BG):** Sade şekiller, düşük kontrast, zemin rengine yakın. Dağlar, şehir silueti, gezegen yüzeyi.
4. **Gök/uzak (FAR):** Gradyan gökyüzü, yıldız alanı, nebula bulutları.
5. **Parçacık katmanı:** Tüm katmanların arasına dağılmış.

Kamera hareket ederken her katman farklı hızda kayar (paralaks). Detaylar için `animasyon-ve-kamera.md`.

## 7. Kompozisyon

- **Merkez odaklı ve simetriğe yakın** kadrajlar çok yaygındır (bir gezegen tam ortada, çevresinde boşluk). Bu, bilgi aktarımını netleştirir.
- **Bol negatif alan:** Kadrajın %40–60'ı "boş" (sade zemin, gökyüzü, uzay) olabilir. Kalabalık kadraj ancak kalabalığın kendisi konuysa.
- **Ufuk çizgisi** genelde alt üçte birde; gökyüzü baskın.
- **Karşılaştırma kadrajları:** İki şeyin boyutunu/durumunu kıyaslarken yan yana, aynı zemin çizgisinde, aynı ölçek referansıyla.
- **Kesitler:** Gezegen, hücre, bina, vücut gibi şeyler sık sık kesit (yarım kesilmiş) olarak gösterilir; iç katmanlar farklı renk tonlarıyla halka halka.
- **Diyagram-sahne karışımı:** Oklar, noktalı yörüngeler, basit ikonlar sahnenin içine yerleştirilir ama aynı renk/ışık kuralına uyar.
- 16:9 kadrajda önemli öğeler güvenli alanda (kenarlardan %5–10 içeride). Shorts (9:16) için dikey yeniden kompozisyon: odak üst-orta, altyazıya alt %25 bırak.

## 8. Doku

- Temel yüzeyler düz renk.
- Yeni dönem estetiği için çok hafif **grain/noise** (%3–6) ve bazı büyük yüzeylerde ince **nokta/leke dokusu** (gezegen yüzeyi, kaya) kullanılabilir.
- Doku asla fotoğraf gerçekçiliğine gitmez; hep vektör hissini korur.

## 9. Ölçek ve detay seviyesi

- Detay miktarı **anlatımdaki öneme** göre belirlenir, gerçekteki karmaşıklığa göre değil. Önemsiz nesne 2 şekil, kahraman nesne 15–20 şekil.
- Bir nesne kadrajda küçükse detaylarını sil (uzaktaki şehir = yan yana dikdörtgenler + birkaç sarı pencere noktası).
- Ölçek referansı: devasa şeyleri anlatırken yanına tanıdık küçük bir nesne (insan, otobüs, Eyfel Kulesi silueti) koy.

## 10. Tipografi ve veri

- Ekranda yazı **az**. Anlatım zaten söylüyor. Yazı sadece: sayılar, terimler, bölüm başlıkları, etiketler.
- Font: kalın, geometrik, yuvarlak hatlı sans-serif (Türkçe karakter desteği şart: ç ğ ı İ ö ş ü). Örnek ücretsiz seçenekler: *Nunito*, *Quicksand* (başlık için kalın ağırlık), *Montserrat*, *Poppins*.
- Büyük sayılar dev punto ve tek başına: "**37 trilyon**" + altında küçük etiket "hücre".
- Etiketler ince, düz bir çizgiyle nesneye bağlanır (bu çizgi istisna olarak kullanılabilen tek "çizgi"dir); çizgi ucu küçük nokta.
- Grafikler: çubuk ve daireler yuvarlak köşeli, eksen çizgileri minimal, palet renkleriyle.

## 11. Ortam türleri (hazır reçeteler)

- **Uzay:** Koyu lacivert→mor dikey gradyan, üç boy yıldız (çoğu 1–2 px, azı glow'lu), 1–2 soluk nebula lekesi, gezegenler rim light'lı ve atmosfer halkalı.
- **Mikro dünya (hücre, vücut içi):** Petrol/koyu turkuaz veya bordo zemin, sıvı hissi için yavaş süzülen kabarcıklar, organik yuvarlak şekiller, arka planda bulanık büyük hücre siluetleri.
- **Dünya/doğa:** Gün batımı gradyanlı gökyüzü, katmanlı tepe siluetleri (her katman bir ton açık), basit ağaçlar, alçak ufuk.
- **Şehir/medeniyet:** Gece, lacivert zemin, yuvarlak köşeli bina blokları, sıcak sarı pencere noktaları, yollarda ışık izleri.
- **Soyut/fikir:** Tek renk zemin, ortada sembolik nesne (beyin, terazi, saat), çevresinde yörüngede küçük ikonlar.
- **Tarih/geçmiş:** Sepya-turuncu-kahve sıcak palet, aynı flat kurallar, kıyafet ve mimari 3–4 ayırt edici detayla.
- **Felaket/tehdit:** Kırmızı-mor palet, keskinleşen şekiller, titreyen kamera, glow'un kırmızıya dönmesi.

## 12. Thumbnail

- Tek, büyük, parlak merkezi nesne + güçlü kontrast (koyu zemin, parlak odak).
- Merak yaratan "imkânsız" veya "tehditkâr" an (Dünya'nın ikiye bölünmesi, dev bir göz, patlayan bir yıldız).
- Yazı en fazla 2–4 kelime veya hiç. Yazı varsa dev punto, beyaz veya sarı, zeminle yüksek kontrast.
- Kanalın küçük maskotu köşede tepki verirken (şaşkın, korkmuş) → kanal kimliği.
- Mobilde küçük görüntülendiğinde okunabilirliği test et: 160×90 px'e küçültünce hâlâ anlaşılıyor mu?

## 13. Yapma listesi

- Kontur, siyah çizgi, el çizimi titrek hat.
- Fotoğraf dokusu, gerçekçi 3D render, plastik parlaklık.
- Saf siyah (#000) veya saf gri zemin.
- Gökkuşağı gradyan, 6'dan fazla ana renk.
- Kalabalık, odaksız kadraj.
- Duvar gibi yazı blokları.
- Referans kanalın karakterleri, logosu, adı (bkz. SKILL.md → Telif).
