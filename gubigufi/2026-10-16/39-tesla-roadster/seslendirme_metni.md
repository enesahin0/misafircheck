# #39 — "Tesla Roadster: dokuz yıl önce verilen söz vs bugün" (GÜNDEM · karşılaştırma)

**Hedef süre:** ~60 sn (≈131 kelime) · **Ton:** magazinsel, "hype'ı doğrula" · **Kategori:** GÜNDEM · TEKNOLOJİ (kitle: araba/teknoloji meraklıları, 18–34)
**Açı (neden "özellik listesi" değil):** 5 özelliği sıralayan videolar 8–12. sn'de kaybedilir. Bunun yerine **tek çatışma**: *2017'de söz verilen araba ≠ bugün tanıtılan araba* + "alabilir misin?" sorusu. Karşılaştırma tablosu ekranın kendisi.
**Kanca A (seçili):** "Tesla'nın dün tanıttığı araba havada takla atıyor. Sen onu alabilir misin?" — seslenme + soru; cevap (fiyat yok, 2028, en hızlısı yolda yasak) en sona kadar tutuyor.
**Alternatif kancalar:** B: "Tesla'nın uçan arabası geldi — ama uçmuyor." (Yanlış Bilinen: haberler "uçan araba" diyor; Tesla'nın kendi tarifi: havada zıplama/dönme) · C: "Bir arabanın sıfırdan yüze yarım saniyede çıktığını hayal et. Şimdi fiyatını sor." 
**Kapak önerisi:** büyük "0.59 sn" + Roadster silüeti havada ters dönmüş + küçük soru çipi; başlık: "SÖZ VERDİ AMA…" / alt: "TESLA ROADSTER"

## Seslendirme (düz metin)

Tesla'nın dün tanıttığı araba havada takla atıyor. Sen onu alabilir misin? Sıfırdan 96 kilometreye, yarım saniyede çıkıyor.

Ama asıl hikâye, dokuz yıl önceki söz.

İki bin on yedide dört kişilik, bin kilometre menzilli, saatte dört yüz diye tanıttılar. Bugün: iki koltuk, dört yüz seksen kilometre, üç yüz yetmiş.

Gubi, söz tutuldu mu? Menzil yarıya, koltuk yarıya. Ama hızlanma tam tersi: Tesla'ya göre bir buçuk saniyenin altı. Rimac Nevera bile bir yetmiş dört.

Bunu araba delisi birine gönder.

Sır, SpaceX'in soğuk gaz iticileri. Lastiğin tutabileceği gücün dört beş katı. Ama sadece davetli sürümde; en hızlısı yolda yasak.

Gufi, ayırtır mısın? Önce fiyata baktı.

Fiyat yok. Üretim, iki bin yirmi sekiz. Rezervasyon, elli bin dolar.

Sence Tesla sözünü tutar mı? Yorumlara A ya da B yaz.

Her gün bir merak için gubigufi'yi takip et.

## İZLEYİCİYİ TUTMA HARİTASI
| sn | Metin | Neden kalınır |
|---|---|---|
| 0–5 | "…havada takla atıyor. Sen onu alabilir misin?" | Kişisel soru + şaşırtıcı görsel (takla) |
| 5–9 | "Sıfırdan 96'ya yarım saniye" | Rakam şoku (ekranda 0.59 sn sayacı) |
| 9–12 | "Ama asıl hikâye, dokuz yıl önceki söz." | **Açık döngü**: hangi söz? |
| 12–22 | 2017 SÖZ ↔ 2026 GERÇEK (3 satır) | Karşılaştırma tablosu satır satır düşer: menzil, koltuk, hız |
| 22–33 | Gubi: "söz tutuldu mu?" → menzil/koltuk yarıya → AMA hızlanma tam tersi | **Gerilim–dönüş**: kötü haber → "ama" iyi haber (rekorun üstü) |
| ~33 | "Bunu araba delisi birine gönder." | Paylaşım çağrısı (ortada) |
| 34–44 | Sır: soğuk gaz iticileri 4–5× lastik gücü; ama davetli, yolda yasak | "Nasıl yapıyor?" ödülü + hemen ardından "ama" kısıtı |
| 44–48 | Gufi: "ayırtır mısın? — önce fiyata baktı" | Nefes + espri (paylaşılır) |
| 48–53 | Fiyat yok · 2028 · 50 bin $ rezervasyon | Vurucu gerçek (kart damgalanır) |
| 53–57 | A/B sorusu (🅰 Tutar 🅱 Tutmaz) | Yorum |
| 57–60 | Takip + logo (≤4 sn) | — |
Takip çipi ~20–24. sn (konuşma yok).

## Maskot anları (2)
| Seste | Ekranda |
|---|---|
| "Gubi, söz tutuldu mu?" (duraklama) | Gubi iki kartı karşılaştırır (`dusun`), "menzil yarıya" ile `uzgun`, "ama hızlanma" ile `sasir`/parlar. |
| "Gufi, ayırtır mısın? … Önce fiyata baktı." | Gufi cüzdan/sepet ikonuna uzanır (`goster`), fiyat etiketi "?" çıkar, geri çekilir (`omuzSilk`). |

## Storyboard (MOTION v2 / SES v2)
1. **0–9 Kanca:** İlk kare = Roadster silüeti havada ters dönmüş (flat çizim; gerçek Tesla görseli YOK — marka/telif). Kamera yakın → geri çekilir; "0 → 0.59 sn" sayacı (`MO.sayiVurgu`), damga sarsıntısı. Çip: KAYNAK: ELECTREK · TESLA/X · 15.10.2026
2. **9–22 Söz vs gerçek:** Ekran ikiye ayrılır (2017 SÖZ | 2026 GERÇEK); satırlar düşer: MENZİL 1000 km → 480 km · KOLTUK 4 → 2 · HIZ 400+ → 370+ (rakamlar sayaçla değişir; okla çizgi "yarıya" damgası).
3. **22–34 Gubi:** Gubi iki kartın arasında (yakın çekim); "HIZLANMA 1.9 sn → <1.6 sn" yeşil ↑; yanında Rimac Nevera 1.74 çubuğu (çubuk grafik, Tesla çubuğu daha kısa). Paylaş çağrısı ~33 sn (telefon + uçak).
4. **34–44 Sır:** Roadster kesiti: köşelerde soğuk gaz iticileri patlıyor (beyaz gaz), lastik izi vs. itici oku "4–5×"; kilit rozetleri: DAVETLİ ✓ · YOLDA YASAK ✕ (Rocket).
5. **44–48 Gufi:** Gufi + fiyat etiketi gag'i.
6. **48–57 Gerçek kartı:** "FİYAT: ?" damgası · "ÜRETİM 2028" · "REZERVASYON 50.000 $" — ekran görüntüsü alınabilir son kart; A/B soru kartı.
7. **57–60** takip kartı → logo.
Ses: mod `pratik`; iticiler için BigSoundBank/Sonniss "gaz/jet" katmanı; hızlanma anında riser→darbe; damgalarda `lastik`.

## DOĞRULAMA NOTLARI (md'de kalır; seste söylenmez)
Ana kaynak: **Electrek, 15.10.2026** "Tesla unveils Cyberfied new Roadster that can kickflip" (Tesla'nın X thread'ini aktarıyor) + Teslarati (aynı gün). Etkinlik: 15 Ekim 2026 (canlı yayın).
- Üç versiyon (Tesla): **Performance** (yola hazır, 2 kişilik, rezervasyon) 0–60 mph **<1,6 sn** · **Thrust** (yarışa hazır, 2 kişilik, arka soğuk gaz iticileri, sınırlı sürüm) **<0,9 sn** · **Rocket** (1 kişilik, çevrede iticiler, yalnız davet) **<0,59 sn**, tepe hız **>230 mph (≈370 km/s)**. Menzil **>300 mil (≈480 km)**. "Rocket yol kullanımı için onaylı değil" (Tesla Roadster sayfası). 
- 0–60 mph = **96,6 km/s** → videoda "sıfırdan 96 kilometre" (0–100 km/s DEĞİL). "Yarım saniyede" = Rocket iddiası (0,59). **Canlı gösteri ölçümü ≈0,81 sn** (etkinliğin kendi zamanlayıcısı; bağımsız doğrulanmadı) — videoda geçmiyor.
- 2017 sözü (Electrek): **620 mil (≈1.000 km)** menzil, **>250 mph (≈400 km/s)**, **2+2 (dört koltuk)**, 0–60 **1,9 sn**; 2017 depozito 50.000–250.000 $.
- Soğuk gaz iticiler: Tesla'ya göre **lastiklerin kaldırabileceği kuvvetin 4–5 katı**; her boşluk karbon fiber sargılı basınçlı tanklarla (COPV) dolu → daha çok gaz = daha çok "uçuş süresi". Fan "tavana tutunacak kadar" emiş. Track modunda Optimus tahrikçileriyle aktif kanatlar; "F1'e yaklaşan" yere basma kuvveti (iddia). Yoke + steer-by-wire; sabit koltuk, manuel kontroller; magnezyum/titanyum/karbon fiber.
- **Rimac Nevera 1,74 sn** 0–60 mph rekoru (bağımsız veri kaydedicilerle; 1 ayak "rollout" dahil; resmî eski değer 1,85). Electrek: Thrust/Rocket "Rimac Nevera dahil piyasadaki her şeyin çok ötesinde".
- **Fiyat yok.** Rezervasyon: bugün 5.000 $ (Tesla "tam iade" diyor) + 10 gün içinde 45.000 $ = **50.000 $**. Üretim: Musk'ın sözü **"2028, actually"**.
- Gecikme hikâyesi (videoda yok, açıklamada kullanılabilir): prototip Kasım 2017 → üretim sözü 2020; 2026'da demo Nisan → Nisan sonu → Ağustos → 1 Ekim → 15 Ekim.
- Yanlış Bilinen notu: Türk basınında "uçabilen araba" deniyor; Tesla/Electrek: itici ile **zıplama, takla ("kickflip")**; sürekli uçuş yok. Videoda "uçuyor" DENMEZ ("havada takla atıyor").
**AÇIK NOKTALAR (videoda iddia edilmez):** (1) Performance'ın tepe hızı ve gerçek menzil per-versiyon belli değil; "üç yüz yetmiş km/s" sadece Rocket iddiası olduğundan ekranda "EN HIZLI VERSİYON (ROCKET)" yazmalı. Seste "bugün: iki koltuk, 480 km, 370" = karşılaştırma için en kötü/ en iyi karışık; ekranda doğru etiketle verilecek. (2) Tüm hızlanma rakamları **Tesla iddiası** (seste "Tesla'ya göre" var). (3) Fiyat/üretim değişebilir.
Yorum notu: A/B → 🅰 Tutar 🅱 Tutmaz. Sabit yorum: "Sence Tesla sözünü tutar mı? 🅰 Tutar 🅱 Tutmaz — harfini yaz 👇"

## Kaynaklar (ekranda küçük çip)
- Electrek, 15.10.2026 · Tesla (X thread), 15.10.2026 · Rimac Nevera rekoru: Motor Authority
