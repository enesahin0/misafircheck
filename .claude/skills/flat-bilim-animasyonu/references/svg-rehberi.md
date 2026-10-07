# SVG Sahne Rehberi (Claude'un doğrudan çizdiği sahneler)

Flat vektör stil SVG'ye çok uygundur. Claude bu rehberle storyboard karelerini, animatik taslaklarını, thumbnail eskizlerini veya After Effects'e aktarılabilecek vektör sahneleri doğrudan çizebilir. Başlamadan önce `assets/ornek-sahne.svg` dosyasını aç ve yapısını şablon olarak kullan.

## Temel ayarlar
- `viewBox="0 0 1920 1080"` (16:9). Shorts için `0 0 1080 1920`.
- Renkler yalnızca `paletler.md`'den. Kontur (`stroke`) kullanma; tek istisna etiket çizgileri ve yörünge çizgileri (ince, düşük opaklık, `stroke-linecap="round"`, gerekirse `stroke-dasharray`).
- Katman sırası (dosyada yukarıdan aşağıya = arkadan öne): gök → nebula/glow → yıldız/parçacık → BG → MG (odak) → FG siluetler → vignette.
- Her katmanı `<g>` ile grupla ve Türkçe yorum satırıyla adlandır (After Effects'e aktarımda katman adı olur).

## Teknikler

### Rim light (en önemli teknik)
Kırpma (clipPath) içinde:
1. Tam daire, rim rengiyle (ışık tonu, ör. `#FFE2A8` veya ışık kaynağının rengi).
2. Aynı daire, gövde rengiyle, **ışığın tersi yönüne** 10–20 px kaydırılmış.
Açıkta kalan hilal = rim light. Daire olmayan şekiller için aynı yolu (`path`) iki kez kullan, ikincisini `transform="translate(-12 12)"` ile kaydır.

### Gövde gölgesi
Kırpma içinde, gövdenin üstüne ışığın tersine çok daha fazla (nesne çapının %30–60'ı) kaydırılmış aynı şekil, gölge renginde (koyu mor/lacivert), `opacity=".45–.6"`.

### Glow
`radialGradient`: merkez renk opaklık .6–.9 → dış kenar opaklık 0. Nesnenin 2–4 katı yarıçaplı daire olarak nesnenin arkasına koy. `feGaussianBlur` filtresi de olur ama büyük sahnelerde ağırdır; gradyan tercih edilir.

### Atmosfer halkası
`radialGradient` ile, `offset` .78'den önce opaklık 0, .86'da tepe, 1'de tekrar 0. Nesneden %10–15 büyük daire.

### Düşen gölge
Nesnenin altında, ışığın tersine uzanan yassı `ellipse` veya `path`, zeminin koyu tonu, `opacity=".25–.4"`.

### Yıldız alanı
Üç boy (`r` 1–1.5, 2–2.5, glow'lu 3–4), tek ışık tonu, düzensiz dağılım; kümeler ve boşluklar olsun, ızgara gibi değil. 20–60 yıldız yeterli.

### Karakter gözleri
```svg
<g class="goz">
  <ellipse cx="0" cy="0" rx="14" ry="18" fill="#FFFFFF"/>
  <circle cx="2" cy="3" r="8" fill="#1B1640"/>
  <circle cx="5" cy="-1" r="2.5" fill="#FFFFFF"/>
</g>
```
Göz kırpma için beyaz elipsin `ry` değerini (veya grubun `scaleY`) kısa süre 0.1'e indir.

### Kesit görünümü
İç içe daireler, her biri bir öncekinden koyu/sıcak; en içteki glow'lu. Kesilen yüzeyi `clipPath` ile yarım daire yap.

### Yuvarlak köşeler
Dikdörtgenlerde `rx` = kısa kenarın %20–50'si. Path'lerde köşeleri `q` (kuadratik) eğrilerle yumuşat.

## Animasyon (video için)
Video sahneleri `render.py` ile kare kare render edilir; bu yüzden zamanlama sözleşmesine uy (ayrıntı: `sesten-videoya.md` → 5):
- Hazır sınıflar `assets/ortak/stil.css`'te: `.kamera` push-in · `.float` · `.twinkle` · `.pulse` · `.spin` · `.nefes` · `.kirp` (göz kırpma) · olaylar için `.popIn` `.fadeUp` `.fadeIn` `.popOut` `.fadeOut`.
- Olay = pozitif `animation-delay` (sahne içi saniye). Idle = negatif delay ile faz dağıtımı.
- `transform-box: fill-box; transform-origin: center;` ölçek/dönüş animasyonlarında şart (sınıflarda hazır).
- Sayaç, uzayan çizgi, ilerleyen huzme, kamera zoom, morph gibi hesaplı hareketler: `window.renderAt = t => {…}` içinde, `K.ease` ve `K.aralik` ile. Gerçek zamanlı döngü (requestAnimationFrame, setTimeout, Date.now) render'da çalışmaz.
- Tarayıcıda canlı önizleme için sahnenin sonunda `K.onizleme()` çağır (render'ı etkilemez).

## Çıktı
- Video sahnesi: `sahneler/sNN.html` (bkz. `assets/sahne-kit-ornek.html`).
- Tek statik görsel (thumbnail, stil karesi): HTML sahne + `render.py --kare`, ya da `.svg`.
- Kontrol: `render.py --kare N saniye` ile PNG al ve `view` ile bak. Kontrol listesi: kontur yok, tek odak, ışık yönü tutarlı, en az bir idle animasyon, palet dışı renk yok.
