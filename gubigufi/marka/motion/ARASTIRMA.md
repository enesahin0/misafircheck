# Motion Upgrade — Araştırma ve kararlar (16.10.2026)

Değerlendirme ölçütü: (1) bizim deterministik boru hattımıza uygunluk (`renderAt(t)` saf fonksiyon → SVG → headless kare,
hareket bulanıklığı alt-kare örneklemesi), (2) estetik kalite, (3) özelleştirilebilirlik, (4) performans, (5) lisans.

## 1a. Animasyon motorları ve kütüphaneler

| Aday | Ne | Lisans | Karar |
|---|---|---|---|
| **Kendi motorumuz** (`renderAt(t)` + SVG) | Remotion'ın "zamanın saf fonksiyonu" modeliyle aynı; kare-kesin, alt-kare bulanıklık destekli | bizim | **Kalır.** Değişim maliyeti yüksek, kazanç yok. Eksik olan motor değil, koreografi/kamera/ses katmanı. |
| Remotion | React, DOM, `spring()` kare-deterministik | şirket > 1M$ gelirde ücretli | Model olarak referans; geçiş yok. |
| Motion Canvas / Revideo | imperatif, tek canvas | MIT | Paradigma uyumsuz (prosedürel generator, canvas). Fikirleri (sinyaller, `waitUntil` ritmi) alınır. |
| Theatre.js | görsel keyframe editörü | Apache-2 (core) | Editör odaklı, ajan iş akışına uygun değil. |
| GSAP 3.15 (+ CustomEase, CustomWiggle, MorphSVG, SplitText) | zaman çizelgesi; `tl.seek(t)` ile deterministik | "Standard no-charge" — ticari serbest (Webflow ile rakip araç yapmamak şartı) | **Kısmen.** Sadece *saf fonksiyon* olarak ease'leri (CustomEase bezier, CustomWiggle) kullanılabilir; tasarımcı eğrilerini birebir taşımak için. DOM tween'leri kullanılmaz (her karede innerHTML yeniden kuruluyor). |
| **flubber** 0.4.2 | iki SVG şekli arasında morf, `interpolate(a,b)(p)` → saf fonksiyon | MIT | **Alınır.** Match-cut / nesne dönüşümü geçişleri (kart → sahne, kalkan → ev) için. |
| **culori** 4.x | OKLCH/OKLab renk enterpolasyonu, ton eşleme | MIT | **Alınır.** Sahne renk derecelendirmesi ve renk geçişlerinde çamurlaşmayan ara tonlar (RGB lerp gri/kirli ton yapıyor). |
| simplex-noise 4.x | organik gürültü | MIT | Gerek yok: `FX.gurultu` (value noise) yeterli; ikincil hareket için 2 oktav eklenir. |
| bezier-easing | kübik bezier | MIT | Gerek yok: `FX.kubik` zaten aynı şey. |
| Lottie (bodymovin) | AE'den JSON | MIT | Hazır Lottie ikonları stilimize uymaz; kendi çizimimiz kalır. |
| react-spring, anime.js v4 | gerçek zamanlı (rAF) | MIT | Kare-deterministik değil → **elendi.** |

**Yay (spring) fiziği:** `FX.yay` kapalı-form ama kütle/sertlik/sönüm/başlangıç hızı parametresi yok. 2a'da analitik
sönümlü harmonik osilatör (alt/kritik/üst sönüm, v0 desteği) yazılacak — bağımlılık yok, kare-kesin.

## 1b. Profesyonel motion prensipleri → uygulanabilir kurallar

Kaynaklar: Issara Willenskomer "UX in Motion" 12 prensibi (easing, offset & delay, parenting, transformation, value change,
masking, overlay, cloning, obscuration, parallax, dimensionality, dolly & zoom); Disney 12 prensibi; repo içi
`motion-bang-bang/references/anti-ppt.md` + `techniques.md` (doğrulanmış stüdyo kuralları); stagger/süre rehberleri.

Bizim kanal için KURAL SETİ (2. aşamada koda dökülecek):
1. **Tek çekim = tek ifade.** Bir an'da ekranda tek baskın fikir. Göz 0,2 sn'de nereye bakacağını bilmeli.
2. **Dikkat hiyerarşisi:** konuşulan kelime/başlık → kahraman nesne → destek detayı. Asla ters sıra.
3. **Asimetrik giriş/çıkış:** giriş kararlı ve yumuşak iniş (0,5–0,9 sn, expo-out / yay), çıkış hızlı (0,25–0,4 sn, in-quad)
   + hareket yönünde bulanıklık. Simetrik ease robotik görünür. **Her öğenin bir çıkışı olur** (aniden yok olmak yasak).
4. **Ağırlık sınıfları:** hafif (çip, ikon: 0,35 sn, yay 26/14), orta (kart, panel: 0,55 sn, yay 18/8),
   ağır (büyük başlık, kahraman nesne: 0,8 sn, yay 10/6, anticipation %4 geri çekilme), oyuncu (maskot: görünür taşma).
5. **Offset & delay / stagger:** çocuk öğeler ebeveyni 40–70 ms geriden izler (kart → başlık → satırlar → ikon).
   Parenting: kartın içindekiler kartla birlikte hareket eder, sonra kendi ikincil hareketini yapar.
6. **Follow-through / overlap:** bir öğe otururken bir sonraki zaten hareket halinde (%30–50 örtüşme). Ölü kare yok.
7. **Kamera birleştiricidir:** her sahnede kamera rig'i: sürekli nefes (±%1,5), anlatılan öğeye çekim ölçeği değişimi
   (geniş → orta yakın → geniş), sahne arası hareket kamerayla motive edilir. "Slayt değiştirme" hissi yasak.
8. **Geçiş menüsü (video başına ≥ 2 tür, beyaz flaş yasak, silme ≤ 2):** örtüşen koreografi (varsayılan), nesne-üstü
   silme (öndeki nesne lensten geçer), match-cut/morf (flubber), motive push-through (video başına ~1), rack-focus
   (çıkan sahne bulanıklaşıp geri çekilir), arka plan rengi kayması perdeleme anında.
9. **Arka plan asla düz değil:** ≥ 2 katman (taban gradyan + ışık/doku) ve yavaş canlılık (gren, ışık süpürmesi,
   parallax silüet). Metnin arkası karanlık cep (≤ %25 parlaklık).
10. **Pahalı anları rasyonla:** push-through, büyük kinetik başlık, ışık sızıntısı video başına 1–2 kez — sadece doruk.
11. **Hareket anlam taşır:** yakınlaş = vurgu/samimiyet; takip pan = aşamalı ifşa; geri çekil = bağlam; titreşim = uyarı.
12. **Kalite sınaması:** kare "kurumsal sunum slaytı" olarak kullanılabiliyorsa başarısız; metin gizlenince arka plan
    hâlâ canlı ama gürültüsüz olmalı; her geçişte KAMERADAN kaynaklanan hareket olmalı.
13. **Kinetik tipografi:** karede 3–7 kelime; kritik sayılar sayaç + ölçek + renk ile girer; altyazı bölgesiyle çakışmaz.

## 1c. Ses kaynakları

| Kaynak | Durum | Lisans | Erişim | Karar |
|---|---|---|---|---|
| Sonniss GDC 2015–2026 | ~80 paketlik seçki yerelde (`sonniss/`) | ticari serbest, atıfsız; 2024+ YZ eğitimi yasak (bizi etkilemez) | doğrudan indirme | Var; eksik kategori olursa seçki genişletilir. |
| **BigSoundBank** (Joseph Sardin, 3.500+ kayıt, 2005'ten beri) | **YENİ** | **CC0 / kamu malı eşdeğeri, ticari serbest, hesap gerekmez** | `/UPLOAD/bwf-en/<id>.wav` doğrudan WAV; UCS kategorileri (PAPR, PLAS, SWSH, UI, RUBR, METL, GLAS, WATR, CLOTH, FOLY, DSGN, TOON…) | **Alınır** → 3a'da `bsb_indir.py` (materyal foley'i tam bizim eksiğimiz: kâğıt, plastik kart, lastik damga, metal, cam, su, kumaş). Para kazanınca da kullanılabilir. |
| Kenney, uisfx, videoeditingsfx, rse/soundfx | yerelde | CC0 | — | Var. |
| Mixkit | seçki yerelde | Mixkit SFX Free License (ticari serbest) | — | Var. |
| BBC RemArc | `bbc_ara.py` | **ticari olmayan** | — | Para kazanılana kadar; sonra `bb:` çıkarılır. |
| motion-bang-bang (ElevenLabs) | repo içi | skill lisansı | — | Var. |
| 99Sounds "99 Sound Effects" | — | ticari serbest | Gumroad 0$ → e-posta ister | **Kullanıcı onayı gerekir** (hesap/e-posta). Listelendi, şimdilik gerek yok. |
| Freesound.org (CC0 filtreli) | — | dosya başına değişir | API anahtarı = hesap | **Kullanıcı onayı gerekir.** BigSoundBank + Sonniss yeterli olduğundan şimdilik gerek yok. |
| ZapSplat, Pixabay, Soundly | — | ticari serbest (koşullu) | hesap | Onaysız yapılmaz; ihtiyaç yok. |

Sonuç: kaynak sıkıntısı yok; asıl eksik **seçim/tasarım/miks yöntemi**. Yeni edinim yalnızca BigSoundBank materyal foley'i.

## 1d. Ses tasarım teknikleri → uygulanacak kurallar

Kaynaklar: `motion-bang-bang/references/sound-design.md` (doğrulanmış sayılar), Krotos whoosh tasarımı, Sonilo whoosh
rehberi, katmanlama/darbe sözlükleri.

1. **Anatomi:** her efekt = transient (keskin ön, 2–6 kHz tık) + gövde (orta, karakter) + kuyruk (sönüm). Hızlı hareket →
   kısa kuyruk. Katmanlar transient'ta aynı kareye hizalanır; üst katmanlarda alçak frekans kesilir (çamur önleme).
2. **Ağırlık ölçeği:** büyük nesne = daha alçak perde + daha yavaş; küçük = tiz + kısa. Perde ±%12 ile nesne boyutuna bağlanır.
3. **Hareketi izle:** whoosh hareketin hızlanma–varış eğrisini takip eder, **en güçlü noktası hareketin bittiği kareye**
   (iniş) oturur, başlangıca değil. Panorama ekran x'ini izler (stereo yol).
4. **Aile kazançları (oran = miks):** darbe −6 dB, damga −9, whoosh −10, riser −11 (doruk başına 1), aksan −12, kâğıt −13,
   UI −18, ambiyans −30. Güç parametresiyle ±3 dB.
5. **Yoğunluk:** olay hedefi 0,7–0,9 /sn (anlatım videosu); >1,2 /sn "eşek arısı yuvası". Doku (kelime tıkları) bütçeye sayılmaz.
   60 ms içindeki iki olaydan zayıfı düşer. Aile başına saniyede üst sınır.
6. **Tekrar önleme:** aynı kayıt ±%0,25–2 perde/hız varyasyonu, **kare numarasından tohumlanır** (deterministik); havuzdan döndürme.
7. **Ducking:** sürekli dokular (whoosh, kâğıt, UI) konuşma altında sidechain ile ~−12 dB; vurmalılar (darbe, damga) ducklanmaz.
   Efektler çoğunlukla cümle aralarındaki 0,4–1,4 sn nefeslerde duyulur — kamera hareketleri de oraya konur.
8. **EQ oyuğu:** efekt/müzik busunda 2–5 kHz'de konuşma varken −3/−4 dB dinamik çentik → anlaşılırlık.
9. **Ortak oda:** tüm efektlere kısa (0,3–0,5 sn) ortak reverb send (−18 dB) → aynı uzayda duyulur, "yapıştırma" hissi gider.
10. **Ölçüm, kulak değil:** entegre −14 LUFS, gerçek tepe < −1 dBTP, LRA < 8; yerleşim kontrolü `silencedetect` ile
    (medyan sapma 0, maks < 1 kare).
11. **Ses görüntüden çıkarılır:** el ile ipucu listesi yerine sahne kodu olayları `olaylar.json`'a yazar → ses bundan üretilir
    (sahne yeniden zamanlanınca ses kaymaz).

## Kaynakça
- Remotion vs Motion Canvas: https://www.remotion.dev/docs/compare/motion-canvas
- Remotion/Motion Canvas/Revideo 2026: https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026
- flubber: https://github.com/veltman/flubber · Popmotion morph: https://popmotion.io/learn/morph-svg/
- UX in Motion manifesto: https://uxmag.com/articles/creating-usability-with-motion-the-ux-in-motion-manifesto
- Toptal motion principles: https://toptal.com/designers/ux/motion-design-principles
- BigSoundBank lisans: https://bigsoundbank.com/licenses.html
- Sonniss GDC: https://gamefromscratch.com/sonniss-27-5gb-sound-effect-giveaway-at-gdc-2024/ · https://rekkerd.org/sonniss-releases-gdc-2026-game-audio-bundle/
- 99Sounds: https://99sounds.gumroad.com/l/sound-effects
- Whoosh/katmanlama: https://sonilo.com/ai-music/whoosh-sound-effect-guide · https://morphic.com/resources/how-to/how-to-layer-sound-effects · https://www.krotosaudio.com/?p=1006981 · https://sounddesign.irpr.agency/glossary/impact/
- Repo içi: `.claude/skills/motion-bang-bang/references/{anti-ppt,techniques,sound-design}.md`
