# MOTION UPGRADE — çalışma planı ve ilerleme kaydı

Brif: `YONETMEN_BRIEF.md`. Her uyanışta: bu dosyayı oku → ilk `[ ]` maddeden devam et → bitince `[x]` yap, kayda bir satır
yaz, commit + push. Bir madde yarım kaldıysa `[~]` + nerede kalındığı notu. Hepsi bitince zamanlanmış görevi kapat.

## 0. Teşhis — mevcut sistemin zayıflıkları (#37 üzerinden, Creative Director gözüyle)
- **Geçişler:** neredeyse her vuruşta sert kesme + beyaz flaş (`bam`). Ucuz duruyor, ritmi düzleştiriyor.
- **Sadece giriş var, çıkış yok:** öğeler `pop` ile girer, eşik zamanında (`if (t < 3.2)`) aniden kaybolur. Durumlar arası köprü yok.
- **Tek easing:** her şey aynı 0.45 sn back-pop → hareket hiyerarşisi yok, ağır/hafif nesne ayrımı yok, anticipation yok.
- **Kamera yok:** kareler statik; parallax, derinlik katmanı, push-in, match-cut yok.
- **Kompozisyon:** maskotlar her sahnede aynı köşelerde; sahne maskotlarla etkileşmiyor.
- **Tipografi:** bütün etiketler aynı çip/etiket; kritik sayılar (1.277, 600 bin) kinetik tipografiyle vurgulanmıyor.
- **Ses:** her kesmede whoosh + her öğede pop → tekrar eden kalıp. Katmanlama yok, materyal eşleşmesi yok,
  VO'ya göre EQ oyuğu yok, ortak "oda" (reverb send) yok, müzik statik pad.

## 1. Araştırma (kaynak + teknik + ses) → `ARASTIRMA.md`
- [x] 1a Animasyon/motion kütüphaneleri ve teknikleri (JS/SVG/canvas, Lottie, motion-canvas, theatre.js, rive, GSAP eklentileri,
      creative-coding toplulukları); bizim deterministik SVG→kare boru hattına uygunluk + lisans değerlendirmesi
- [x] 1b Profesyonel motion prensip kaynakları (stüdyo yazıları, easing/spring çalışmaları, geçiş katalogları) → uygulanabilir kurallar
- [x] 1c Ses kaynakları: Sonniss arşivinin geri kalanı, Freesound CC0, BBC, OpenGameArt, Kenney, ZapSplat, Pixabay, Free Firearm/Foley
      kütüphaneleri, GitHub'daki ses paketleri; lisans + erişim (hesap gerekenler kullanıcı onayına listelenir)
- [x] 1d Ses tasarım teknikleri: transient/body/tail katmanlama, materyal eşleme, EQ oyuğu, sidechain, reverb send, varyasyon

## 2. Motion sistemi v2 → `marka/ortak/motion2.js` (geriye uyumlu, yeni videolarda varsayılan)
- [x] 2a Koreografi çekirdeği: öğe yaşam döngüsü (giriş → bekleme/ikincil hareket → ÇIKIŞ), ağırlık sınıfları (hafif/orta/ağır/kahraman),
      anticipation, overshoot, stagger, follow-through; zaman çizelgesi tanımı (`TL` nesnesi)
- [x] 2b Kamera rig'i: sahne kamerası (push-in, pan, whip-pan + hareket bulanıklığı), parallax katmanları (arka/orta/ön), odak (DoF hissi)
- [x] 2c Geçiş sistemi: match-cut, nesne-üzerinden geçiş (kart büyüyüp sonraki sahne olur), maske açılışı; beyaz flaşın yerini alır
- [x] 2d Işık/derinlik/doku: tutarlı ışık yönü, yumuşak gölge, rim ışık, kâğıt grenı, renk derecelendirme (sahne başına LUT benzeri ton)
- [x] 2e Kinetik tipografi: sayı vurguları (sayaç + ölçek + renk), kelime vurgusu, maskeli yazı; altyazıyla çakışmayan yerleşim
- [x] 2f Olay yayını: her görsel olay `olaylar.json`'a yazılır (zaman, tür, ağırlık, materyal, hız, ekran konumu) → ses bunu okur

## 3. Ses tasarımı v2 → `marka/ses2.py`
- [x] 3a Katmanlı efekt üreteci: transient + gövde + kuyruk; materyal sözlüğü (kâğıt, kart/plastik, metal, cam, su, kumaş, hava)
- [x] 3b Olay→ses eşleyici: `olaylar.json` → hareket hızı/ağırlığına göre ses seçimi, perde/hız varyasyonu, tekrar yasağı, panorama (ekran x'i)
- [x] 3c Miks zinciri: VO için EQ oyuğu (2–5 kHz), sidechain, ortak kısa oda reverb'i, bus kompresör, müzik dinamiği (bölüm geçişlerinde nefes)
- [x] 3d Müzik yatağı v2: statik pad yerine bölüm yapısına uyan, ritmik ama melodisiz/ciddi seçenekler + "gündem" ve "pratik" modları

## 4. Test: #37'nin ilk 4 sahnesi v2 ile yeniden (A/B demo)
- [x] 4a S1–S4 v2 sistemle kurulur, render
- [x] 4b CD kalite kontrolü (kare şeritleri, hareket eğrileri, ses spektrumu); zayıf noktalar yeniden tasarlanır
- [ ] 4c Kullanıcıya A/B (eski vs yeni) gönderilir

## 5. Kalıcılaştırma
- [ ] 5a MARKA.md'ye "MOTION v2" bölümü + şablon (`_head.py`/`ses.py` iskeletleri v2'yi varsayılan kullanır)
- [ ] 5b Zamanlanmış görev kapatılır, özet kullanıcıya

## İlerleme kaydı
- 16.10.2026 — brif ve plan yazıldı; saatlik devam görevi kuruldu.
- 16.10.2026 — Aşama 1 bitti: ARASTIRMA.md (motor kararı: kendi motorumuz + flubber + culori; kural seti 13 madde; yeni ses kaynağı BigSoundBank CC0; ses tasarım kuralları 11 madde).
- 16.10.2026 — Aşama 2 bitti: `ortak/motion2.js` (analitik yay, 5 ağırlık sınıfı + anticipation/çıkış, kamera rig + parallax, 6 geçiş türü: odak/itme/yildiz/kayma/perde/kes, katmanlı zemin + gölge filtreleri + film greni + ton, kinetik başlık/sayaç/çizgi, flubber morf, culori OKLCH), `vendor/` (flubber, culori; MIT), `olay_tara.py` → olaylar.json. Lab: `motion/lab/` (3 sahnelik test, kareler doğrulandı).
- 16.10.2026 — Aşama 3 bitti: `ses2.py` (Tasarim: olaylar.json → materyal eşlemeli katmanlı efekt [BigSoundBank kesiti + sub + ön-whoosh], ağırlık→perde/aile, kare tohumlu varyasyon, panorama, maske/aile/yoğunluk budaması, stagger→doku; miks: ducking, 2–5 kHz EQ oyuğu, ortak oda, bus kompresör, limitör; müzik yatağı + kesme nefesi). `bsb_indir.py` ile 299 CC0 materyal kaydı (yerel, .gitignore), `sfx_lib` bs: öneki.
- 16.10.2026 — 4a/4b: `37-dask-odemez/kaynak_v2/` (S1–S4 v2: geri çekilen kamera + damga sarsıntısı, su perdesiyle geçiş, sayaç, örtüşen kart koreografisi, SEL satırına yakınlaşma, Gubi'ye yakın çekim → geniş plan, dikey dünya + aşağı pan, yıldız maskeyle logo). CD kontrolünde düzeltilen: eski .kamera CSS animasyonu SVG kamerayı eziyordu (motion2'de kapatıldı), kart üst üste binmesi (cikYon eklendi), S4 başında ölü kare, S3 yakın çekimde kadraj taşması. Ses: olay/sn 0,88, −14,0 LUFS. Çıktılar: video_v2_demo.mp4, ab_karsilastirma.mp4.
