# Prompt Şablonları (AI görsel & video)

Promptlar İngilizce yazılır, altına tek satır Türkçe açıklama eklenir. **"Kurzgesagt" kelimesi promptlarda kullanılmaz**; onun yerine aşağıdaki tarifsel stil bloğu kullanılır. Bu hem daha özgün sonuç verir hem de kanalı referans kanalın kopyası gibi göstermez.

İçindekiler: 1) Stil bloğu · 2) Görsel prompt yapısı · 3) Negatif prompt · 4) Araç notları · 5) Tutarlılık · 6) Video promptu · 7) Hazır örnekler

---

## 1. Ana stil bloğu (her görsel promptun sonuna ekle)

```
flat vector illustration, clean geometric rounded shapes, no outlines, no line art, bold saturated colors on a dark desaturated background, soft rim lighting on the edges, subtle gradients, soft outer glow on key elements, long soft cast shadows, layered depth with dark foreground silhouettes, tiny glowing particles, cute minimal characters with big white oval eyes and no mouth, science explainer animation still, 2D motion graphics style, crisp, high contrast, 16:9
```

Kısa versiyon (karakter sınırı olan araçlar için):
```
flat vector science explainer illustration, rounded shapes, no outlines, dark background, vivid neon accents, rim light, soft glow, particles
```

## 2. Görsel prompt yapısı

```
[SAHNE KONUSU — ne var, ne yapıyor], [KOMPOZİSYON — kadraj, odak konumu, kamera açısı], [ORTAM — zemin, arka plan katmanları], [IŞIK — yön, glow olan öğe], [PALET — 3–5 renk adı veya hex], [RUH HALİ], + STİL BLOĞU
```

Palet renklerini hem adıyla hem hex'iyle yaz: `deep navy #0B1433 background, magenta #FF4F8B and cyan #3CD6F0 accents`. Bazı araçlar hex'i tam uygulamaz ama tonu yaklaştırır.

## 3. Negatif prompt / kaçınılacaklar
(Negatif alanı olan araçlarda oraya, olmayanlarda promptun sonuna "avoid …" diye.)
```
photorealistic, 3D render, realistic texture, black outlines, line art, sketch, watercolor, anime, pure black background, text, watermark, logo, cluttered composition, bird mascot
```
("bird mascot" referans kanalın maskotuna benzeyen şeylerin kendiliğinden çıkmasını engellemek içindir.)

## 4. Araç notları
- **Midjourney:** Stil bloğunu kullan + `--ar 16:9 --style raw --s 150`. Tutarlılık için beğendiğin bir kareyi kendi `--sref`'in olarak kullan (kendi ürettiğin görsel; başkasının eseri değil). Karakterler için `--cref`/`--oref` ile maskot kartından üretilmiş referans görsel.
- **DALL·E / GPT görsel:** Doğal cümlelerle yaz; stil bloğunu cümleye çevir: "The image is a flat vector illustration with no outlines…". Hex'lere iyi uyar.
- **Flux / SDXL:** Virgülle ayrılmış anahtar kelimeler iyi çalışır; negatif prompt alanını kullan. Vektör/flat LoRA'ları varsa ekle.
- **Ideogram:** Yazılı thumbnail gerektiğinde yazıyı iyi basar; Türkçe karakterleri kontrol et.
- **Gemini / Imagen:** Doğal cümle + palet hex'leri; "no outlines" vurgusunu iki kez yap.
- **Vektör çıktı gerekiyorsa:** Recraft gibi SVG üreten araçlar veya Claude'a SVG çizdirme (`svg-rehberi.md`).

## 5. Tutarlılık
- Video boyunca aynı stil bloğunu kelimesi kelimesine kullan.
- Maskot ve tekrar eden karakterler için maskot kartındaki İngilizce tarifi kelimesi kelimesine kopyala.
- Aynı sahnenin varyasyonları için aynı seed (destekleyen araçlarda).
- Önce 3–4 "stil anahtar karesi" üret, en iyisini referans görsel olarak sabitle, sonraki tüm sahneleri ona göre üret.

## 6. Video promptu (image-to-video: Runway, Kling, Veo, Luma, Hailuo vb.)

Yapı:
```
[ANA HAREKET], [IDLE HAREKET], [KAMERA], [HIZ/HİS], keep flat vector 2D style, no outlines, characters keep the same shape and colors, no morphing, no new objects appearing
```

Örnek:
```
the planet slowly rotates, stars gently twinkle and tiny particles drift upward, slow smooth camera push-in, calm and smooth motion, keep flat vector 2D style, no outlines, no morphing, no new objects appearing
```
Türkçe: Gezegen yavaşça döner, yıldızlar titrer, parçacıklar süzülür; kamera yavaşça yaklaşır.

Kurallar: Bir klipte en fazla bir ana hareket. 4–5 sn. "slow", "gentle", "subtle" kelimeleri. Hızlı aksiyon gereken anları (patlama) ayrı klipte üret.

## 7. Hazır örnekler

**Uzay — kanca sahnesi**
```
Earth seen from space at the center of the frame, the Sun has just vanished leaving an empty dark spot on the left, Earth's day side slowly dimming, the Moon small in the upper right, deep navy #0B1433 to purple #1E1B4B gradient background, three sizes of stars, faint magenta #FF4F8B nebula haze, cyan #3CD6F0 rim light on Earth's edge, eerie but calm mood, flat vector illustration, clean geometric rounded shapes, no outlines, no line art, bold saturated colors on a dark desaturated background, soft rim lighting on the edges, subtle gradients, soft outer glow on key elements, tiny glowing particles, science explainer animation still, 2D motion graphics style, 16:9
```
Türkçe: Güneş'in kaybolduğu an; merkezde Dünya, solda boşluk, sakin ama tekinsiz.

**Mikro dünya — bağışıklık hücresi**
```
a round friendly white blood cell character with big white oval eyes and a determined look chasing three small spiky purple virus particles inside a blood vessel, the cell in the center-left, viruses fleeing to the right, dark teal #0C2E3A background with blurred large red blood cell silhouettes, soft pink #FF6F91 glow from the cell nucleus, floating bubbles, lime #B8E05A accents, playful but tense mood, + STİL BLOĞU
```

**Ölçek karşılaştırması**
```
side-by-side size comparison on a flat horizon line: a tiny human silhouette, a bus, a tall tower and a gigantic asteroid towering over them, labels as simple rounded tags, warm sunset gradient sky from indigo #2B2D6E to coral #F07C6B, layered hill silhouettes, + STİL BLOĞU
```

**Kesit**
```
cross-section of a planet cut in half, concentric glowing layers from crust to a bright orange #FF8A3D molten core, small rocket orbiting for scale, dark purple #1A1035 space background with stars, + STİL BLOĞU
```

**Thumbnail**
```
a giant glowing eye-shaped black hole in the center pulling a tiny cute round mascot character toward it, the mascot looks shocked with huge eyes, extreme contrast, deep navy background, magenta and amber glow, very simple composition readable at small size, empty space at top for large title text, + STİL BLOĞU
```
(Maskot tarifini maskot kartından koy.)
