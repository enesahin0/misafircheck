# Animasyon ve Kamera

Referans kanalın üretimi: sahneler vektör olarak çizilir, yüzlerce parçaya ayrılır, After Effects'te (bazen Cinema 4D desteğiyle) elle animasyonlanır ve zamanlama tamamen seslendirmeye göre yapılır. Aşağıdaki kurallar bu hissi yakalamak içindir; ister After Effects, ister AI video, ister SVG/CSS animasyonu kullanılsın.

İçindekiler: 1) Hareket felsefesi · 2) Easing · 3) Giriş/çıkış kalıpları · 4) Idle hareketler · 5) Kamera · 6) Geçişler · 7) Ritim ve zamanlama · 8) After Effects notları · 9) AI video için · 10) Kodla üretilen sahneler için

---

## 1. Hareket felsefesi
- **Sahne asla donmaz.** Anlatım durduğunda bile yıldızlar titrer, parçacıklar süzülür, karakter göz kırpar.
- **Hareket yumuşak ve ağırlıklı:** doğrusal (linear) hareket yok; her şey hızlanır ve yavaşlar.
- **Birincil + ikincil hareket:** Ana olay (gezegen döner) + ona eşlik eden küçük hareketler (atmosfer halkası hafif titreşir, uydular döner).
- **Takip hareketi (follow-through):** Karakter durduğunda uzuvları/antenleri bir an daha sallanır.
- **Stagger (kademeli giriş):** Çok sayıda öğe aynı anda değil, 2–4 kare arayla sırayla belirir.

## 2. Easing
- Varsayılan: güçlü **ease-in-out** (After Effects'te hız grafiğinde %70–85 etki, "Easy Ease" sonrası grafik düzenlenmiş).
- Belirme: **overshoot** — ölçek 0 → %110 → %97 → %100 (toplam 10–14 kare, 25 fps'de).
- Kaybolma: hızlı ease-in, ölçek %100 → 0 (6–8 kare) veya opaklık ile.
- Ağır nesneler (gezegen, kaya) daha uzun ease; hafif nesneler (parçacık, küçük karakter) daha zıplayan.

## 3. Giriş/çıkış kalıpları
- **Pop-in:** ölçek overshoot + hafif dönüş (−8° → 0°).
- **Büyüme:** bitki, grafik çubuğu, yol → tabandan yukarı "trim path" veya ölçek-Y.
- **Kayma:** kadraj dışından ease-out ile girip hafif geri sekme.
- **Çoğalma:** bir hücre ikiye bölünür, sonra dört… (sayısal büyümeyi anlatmak için).
- **Dönüşüm (morph):** bir şekil başka bir şekle dönüşür (daire → gezegen → göz). Stilin anlatım gücünün önemli kısmı.

## 4. Idle (bekleme) hareketleri — her sahnede en az biri
- Süzülme: Y ekseninde ±4–10 px, 3–5 sn periyotlu sinüs.
- Nefes: ölçek %100 ↔ %102, 2–3 sn.
- Göz kırpma: 3–7 sn'de bir, düzensiz aralıklarla, 4–6 kare.
- Yıldız titreşimi: opaklık %40 ↔ %100, her yıldız farklı faz.
- Parçacık akışı: çok yavaş tek yönlü sürüklenme + hafif sinüs.
- Glow nabzı: glow opaklığı %70 ↔ %100.
- Dönme: gezegen/molekül çok yavaş sürekli dönüş.

## 5. Kamera
- **Yavaş push-in:** Sahne başından sonuna %100 → %105–110 ölçek. En yaygın kamera hareketi; statik kadrajı canlandırır.
- **Paralaks pan:** Katmanlar farklı hızda: FG %150, MG %100, BG %50, FAR %20.
- **Ölçek zoom (imza hareket):** Bir nesnenin içine/dışına kesintisiz dalış. Örn: insan eli → deri → hücre → DNA. Her ölçek seviyesinde palet değişebilir; geçiş anında önceki sahnenin bir öğesi yeni sahnenin zemini olur.
- **Zoom-out ile ölçek şoku:** Küçük bir şeyden geri çekilerek devasa bağlamı göstermek (Dünya → Güneş Sistemi → galaksi).
- **Sarsıntı:** Sadece çarpışma/patlama anlarında, kısa ve sönümlü (6–12 kare).
- **Takip:** Hareket eden nesneyi (roket, ışık) kamera yumuşak gecikmeyle izler.
- Hızlı ani kamera hareketi yok; her şey sakin ve kontrollü.

## 6. Geçişler
- **Eşleşme kesmesi (match cut):** Bir sahnedeki daire bir sonraki sahnedeki gezegen olur; şekil ve konum aynı kalır.
- **Nesne silmesi (wipe):** Kadrajı bir nesne (bulut, dev hücre, roket) kaplar, arkasından yeni sahne çıkar.
- **İçine dalış:** Kamera bir nesnenin karanlık/parlak bölümüne girer, o renk tam ekran olur, yeni sahne o renkten açılır.
- **Renk akışı:** Tam ekran renk alanından yeni sahne şekilleri pop-in ile belirir.
- **Bölüm geçişi:** Kısa başlık kartı (2–3 sn): koyu zemin, ortada bölüm adı, küçük sembol ikonu, hafif parçacık.
- Kaba "crossfade" ve hazır geçiş efektlerinden kaçın.

## 7. Ritim ve zamanlama
- Zamanlama **seslendirmeye kilitli**: önce ses kaydı, sonra animasyon.
- Her anlatım cümlesi ≈ 1 sahne ya da sahnede 1 yeni olay. Ortalama sahne süresi 3–7 sn.
- Önemli bir rakam veya "vay" anında **nefes payı**: anlatımdan sonra 0,5–1,5 sn görsel tutulur, müzik öne çıkar.
- Bilgi yoğun bölümlerde daha sık kesme; duygusal kapanışta daha uzun, yavaş sahneler.
- Şaka/espri anında hızlı kısa bir görsel gag (0,5–1 sn) ve hemen ciddi akışa dönüş.

## 8. After Effects notları (animatör/kullanıcı için)
- Kare hızı 25 veya 30 fps (hangi platforma göreyse), 1920×1080 (veya 3840×2160).
- Illustrator katmanlarını AE'ye aktar; her hareket edecek parça ayrı katman.
- Ölçek overshoot için "Overshoot/Bounce" ifadesi (expression) veya elle 3 anahtar kare.
- Idle süzülme için ifade: `wiggle(0.3, 6)` yerine sinüs daha temiz: `[value[0], value[1] + Math.sin(time*1.6 + index)*6]`
- Glow: *Glow* efekti yerine katmanı kopyala → Gaussian Blur 30–80 → Screen/Add modu; daha kontrollü.
- Rim light'ı ayrı şekil katmanı olarak çiz, nesneyle parent'la.
- Parçacıklar: CC Particle World veya elle çoğaltılmış küçük daireler + sinüs ifadesi.
- Hafif grain: en üstte *Noise* %3–5 veya grain overlay.
- Ölçek zoom geçişlerinde "precompose" edilmiş sahneleri iç içe yerleştirip üstteki kompozisyonu üstel ölçekle büyüt (logaritmik zoom hissi).

## 9. AI video (image-to-video) için
- Önce `prompt-sablonlari.md` ile **sabit bir kare** üret, sonra onu hareketlendir. Metinden doğrudan video, stil tutarlılığını bozar.
- Hareket promptu kısa ve tek fikirli olsun: bir ana hareket + bir idle + bir kamera.
- "subtle", "slow", "gentle" kelimelerini kullan; AI araçları varsayılan olarak aşırı hareket üretir.
- Karakterin şekil değiştirmesini (morphing bozulması) önlemek için: "character keeps the same shape and colors", "no morphing of the character".
- Sahne 4–5 sn'lik parçalar halinde üretilip kurguda birleştirilir.

## 10. Claude'un kodla ürettiği sahneler için
- Tüm kurallar yukarıdakiyle aynı; uygulama `assets/ortak/stil.css` sınıfları ve `renderAt(t)` ile yapılır (bkz. `svg-rehberi.md` → Animasyon, `sesten-videoya.md` → 5).
- Easing karşılıkları: ease-in-out `cubic-bezier(.45,0,.55,1)`, overshoot `cubic-bezier(.34,1.56,.64,1)`, JS'te `K.ease`.
- Ölçek zoom: `renderAt` içinde kamera grubunun `transform`'unu üstel büyüt: `scale = Math.pow(hedefOlcek, K.ease(K.aralik(t, a, b)))`, `transform-origin` hedef nesnenin merkezi.
