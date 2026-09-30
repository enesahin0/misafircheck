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

### Kategori girişi denemesi İPTAL edildi (kullanıcı kararı): video başında ayrı kategori girişi YOK; kategori etiketi eskisi gibi sol üstte sade şekilde belirir.

### FRAGMAN / SERİ KANCASI YOK (kullanıcı kararı, KALICI)
Videoların sonunda "Bölüm 2'de…" gibi bir sonraki videoya fragman VERİLMEZ. Her video kendi içinde kapanır:
son 6–8 sn = konunun özünü bağlayan, akılda kalan bir kapanış cümlesi (+ gerekiyorsa ekranda kısa uyarı satırı).
(Seri adları — "Kanun Böyle Diyor", "Tıbbın Asileri" vb. — kategori kimliği olarak kullanılabilir ama "sonraki bölüm" sözü verilmez.)

### GERÇEKLİK KURALI — harita, kişi, yer (KALICI)
Tarzımız çizgi/flat kalır ama anlatılan şey GERÇEK şekline benzer:
- **Harita:** "benzer şekil" yok; gerçek coğrafya kullanılır → `marka/harita/harita.js` (Natural Earth verisi, Türkiye 10m detay).
  `H.ciz({ ulkeler: H.kita('AF') | H.ulke('Türkiye','Mısır') | H.dunya(), vurgu:{ 'Mısır':'#FF9F1C' }, kutu:[x,y,w,h], proj:'mercator'|'equalEarth'|'orthographic' })`,
  `H.kure({ x, y, r, donus:[-boylam,-enlem], vurgu })` gerçek kıtalı küre, `H.igne(x, y, renk, ölçek, 'Sivas')`, konum için `h.p([boylam, enlem])`.
  Ülke adları Türkçe veya İngilizce yazılabilir. Kıta kodları: AF, EU, AS, NA, SA, OC. Dosyalar sahne klasörüne `ortak/harita/` olarak kopyalanır.
- **Kişiler:** gerçek bir kişiden bahsediliyorsa, o kişiye BENZEYEN flat portre → `marka/ortak/kisi.js` (`KS.kisi({...})`):
  saç tipi/rengi, sakal-bıyık, kaş, gözlük, ten, yaş çizgileri, dönemine uygun kıyafet (önlük, ceket, papyon…). Referans fotoğraf varsa kullanıcıdan istenir ya da kullanıcı gönderir.
  Anonim/genel insanlar için yüzsüz siluet kullanılabilir. Atatürk gibi hassas figürler yalnızca saygılı, sade portre ile ve kullanıcı onayıyla.
- **Yerler ve nesneler:** ünlü yapılar, cihazlar, belgeler gerçek silüet ve oranlarıyla (ör. Galata Kulesi'nin gerçek konik külahı, Mark II'nin gerçek dolap dizilimi).
- **Ölçek ve sayı:** karşılaştırmalarda oranlar gerçek (ör. 12'ye karşı 62 sütunu gerçekten 5 kat).
- Örnek sayfa: `marka/stil_ornek.png` (Afrika/Mısır, küre, Türkiye + Sivas, Akdeniz; Einstein, Curie, Kahlo, Edison benzeri portreler).

### YERE BASMA KURALI (KALICI)
Yere basan hiçbir şey havada durmaz: ağaç, bina, direk, masa, karakter… zemin/tepe çizgisi FONKSİYONLA tanımlanır ve nesne o çizgiye oturtulur
(`marka/ortak/zemin.js` → `const tepe = Z.tepe({...}); tepe.yol(renk); Z.agac(x, tepe.yer(x))`). Taban çizginin birkaç px altına gömülür, temas noktasına küçük gölge elipsi konur.
Önde duran tepe arkadaki nesnenin tabanını örtebilir ama tabanın ALTINDA boşluk kalamaz. Kontak sayfası kontrolünde her sahnede "yere basma" ayrıca kontrol edilir.
(Gubi uçan bir pırıltı olduğu için havada süzülebilir; Gufi her zaman yere basar ya da zıplama yayındadır.)

### REELS KAPAK KURALI (KALICI — kullanıcı kararı)
- **LOGO YERİ SABİT:** kapakta logo GÖRSEL olarak y≈1570–1640 aralığında durur (referans: #4 Turkey kapağı). SVG kapaklarda bu `translate(540 1576) scale(150/233)` demek; #13'teki güncel logo_paths ile `1600` aynı yere düşer. Her kapakta logo piksel aralığı ölçülüp kontrol edilir. Instagram ızgarası 3:4 kırpar (y≈240–1680 görünür), bu yüzden logo daha aşağı inmemeli.
- Kart şablonu (marka/kapak, v2) İPTAL. Kapaklar HER ZAMANKİ düzende: üstte tam genişlik illüstrasyon (video sahnesinden), altta düz renk yazı paneli (üst etiket · büyük başlık · vurgu satırı · logo).
- Alt panel BEYAZ/açık OLMAZ; her videoda farklı OLGUN renk: petrol #1F6F78, bordo #7A2E3A, orman #1F4D3A, terrakota #A8452B, çivit #33429A, mürdüm #56264F, zeytin #58642C, kahve #5B3A29, okyanus #0F6A80…
  Izgarada ardışık kapaklar aynı rengi almaz. Panel üstünde ince vurgu şeridi; başlık krem, alt satır + etiket vurgu renginde.

### GÖRSEL TARZ REHBERİ v3 (KALICI — kullanıcının referansları: marka/referans/stil_ref_1..5.png)
Referans: sahil yolu + kırmızı araba, yağmur ormanı, teal mutfak, sarı salon, mavi/mor ikili sahne. Referanslar ÇİZİM DİLİ ve RENK TONU KALİTESİ içindir — mekân ↔ renk eşleşmesi DEĞİL (mutfak hep teal, salon hep sarı olmayacak). Her videoda/sahnede ton konuya ve duyguya göre özgürce seçilir, videolar arasında çeşitlenir; CV.ton listesi sadece başlangıç paletidir, yeni tonlar türetilebilir. Hedef bu tarz:
1. **Sahne başına TEK RENK AİLESİ (monokrom/analog):** bütün sahne bir tonla boyanır (teal mutfak, sarı salon, yeşil orman, mavi-mor gece, gül, lavanta, kum, güneşli sahil). Doygun olabilir ama UYUMLU; üstüne 1–2 tamamlayıcı vurgu (kırmızı/pembe araba, tişört, turuncu çiçek). Rastgele "şeker renkleri" yan yana konmaz — "çocuk renkleri yok" kuralı budur.
   Hazır tonlar: `marka/ortak/cevre.js` → `CV.ton('teal'|'sari'|'orman'|'gece'|'gunes'|'gul'|'lavanta'|'kum')` (fon1, fon2, orta, koyu, cokKoyu, acik, vurgu, vurgu2, isik, ten).
2. **Dolu, yaşanmış mekân:** her mekân sahnesinde en az 8–12 eşya/detay (raf+kitap+vazo, lamba, saksı ve asma bitki, poster/çerçeveli resim, duvar saati, halı, sehpa, kupa (buharlı), sandalye, kutu yığını, yerde kitaplar; dışarıda sarmaşık, kelebek, çiçek, ot, kaya). Sahne asla boş fon + tek nesne değildir. Kit: `CV.oda, raf, bitki, asmaBitki, lamba, poster, cerceveResim, saat, hali, sehpa, kupa, sandalye, kutuYigini, yerdeKitap, tencere, sarmasik, kelebek`. Örnek: `marka/stil_ref_ornek2.png` (şeftali mutfak · lavanta salon · orman).
3. **Derinlik katmanı:** ÖNDE koyu-doygun yaprak/çalı silüetleri kenarları çerçeveler (`CV.onYaprak(T, 'alt'|'ust'|'yan')`), ortada aksiyon, ARKADA açık-ışıklı fon + ışık hüzmesi (`CV.huzme`), pus.
4. **Organik formlar:** yuvarlak, hafif dalgalı; ot tutamı, küçük çiçek, kabarık bulut, palmiye, kaya (`CV.otTutami`, `CV.cicek`, `CV.bulut`, `CV.palmiye`, `CV.kaya`). Kontur yok.
5. **İnsan karakterler:** büyük yuvarlak baş, kakül/atkuyruğu/uzun saç, parlamasız koyu mor NOKTA göz, pembe yanak, küçük burun, sade tişört-pantolon, kapsül kollar-bacaklar (`KS.karakter({... poz:'dur'|'selam'|'goster'})`). Gerçek kişi portreleri (`KS.kisi`) de aynı yüz diline geçti (nokta göz + yanak). Ten, sahnenin ışığına göre tonlanabilir (`T.ten`).
6. Maskotlar (Gubi amber, Gufi kırmızı) her tonda vurgu rengi gibi öne çıkar.
Örnek: `marka/stil_ref_ornek.png` (teal mutfak · sarı salon · yeşil orman).

### KATEGORİ ETİKETİ: hap şekli yazının GERÇEK çizilen genişliğine göre ölçülür (kanal.js svgGenislik), her kategoride tam oturur.

### ÇIKIŞ (LOGO) KONTROLÜ (KALICI)
- Her videonun sonunda logo sahnesi (Gubi pırıltıya, Gufi kırmızı kareye dönüşür) ZORUNLU. Teslimden önce son 1 sn'den kare alınıp logonun göründüğü kontrol edilir.
- render.py artık sahne JS hatasında durur (#12'de logo sahnesi değişken çakışması yüzünden boş çıkmıştı; logo kodu `LOGO_C` adını kullanır).

### HAREKET / MOTION EFEKTLERİ — ft-motion'dan uyarlandı (KALICI)
Kaynak: github.com/imserhatdemir/ft-motion (MIT). Motoru Canvas tabanlı; biz SVG + flat tarzımızda kaldık, yalnızca TEKNİKLERİ aldık:
- **Hareket bulanıklığı:** `plan.json` → `"hareket_bulanikligi": 3` (ya da sahne bazında `"alt_kare": 4`). Her kare, 180° obtüratörle N alt karenin ortalaması; hızlı hareketler doğal akar. Render süresi N katına çıkar → yalnız hızlı sahnelerde (zıplama, uçuş, kamera yaklaşması, geçiş) kullan. Önizlemede kapalı.
- **Easing sözlüğü** (`marka/ortak/hareket.js` → `FX`): girişler `FX.E.expo`, pop/beliriş `FX.yay(t - t0)` (back yerine), darbe/squash `FX.sallan`, büyük çıkış öncesi hazırlık `FX.E.inBack`, emilme `FX.E.inExpo`.
- **Geçişler:** `FX.gecis(t, { orta, renk, serit, kapat:{tur:'egik'|'serit'|'daire', merkez}, ac:{...} })` — ekran `orta` anında tam kapalı, sahne orada değişir. Komşu geçişlerde tür/yön/renk değiştir; renkler olgun paletten. "A, B'ye dönüşür": daireyi önceki sahnenin bir nesnesinden (ör. soru işaretinin noktası) büyüt.
- **Darbeler (idareli):** `FX.flas`, `FX.sokHalkasi`, `FX.sarsinti(t, [[zaman, px]])` kamera sarsıntısı.
- **Kinetik yazı:** `FX.harfHarf` (harfler sırayla yaylanır), `FX.maskeliYazi` (kutudan yükselir; Türkçe aksanlara pay bırakır), `FX.ustunuCiz`, `FX.sayac` (expo ile yavaşlayan sayma), `FX.dalgaNoktalar`, `FX.sogan` (soğan kabuğu izi).
- **Ses (ses_lib):** `reverb()` (pad/çanlara), `sidechain()` (vuruşlarda müziği kıs), `sayac_tiklari()` (FX.sayac ile eşli), `damga()` (büyük başlık çarpması), `riser_hedefli()` (tam patlama anında biten yükseliş). Her görsel olayın aynı zaman çizelgesinde bir sesi olur.
- ALINMAYANLAR (tarzımıza uymaz): glitch, kromatik sapma, HUD/editör çerçevesi, film greni, neon/teknoloji reklamı estetiği.
- Yeni video klasörüne `ortak/hareket.js` kopyalanır ve HEAD'de maskot.js'ten sonra yüklenir.

### ARKA PLAN / ATMOSFER KURALI (güncelleme, #10'dan itibaren geçerli)
- Skill'den aldığımız şey ÇİZİM TARZIDIR (flat vektör, konturyok, rim light, glow, yuvarlak formlar). Skill'in "koyu lacivert/uzay" atmosferi varsayılan DEĞİL.
- Videolar mavi-derin tonlara bürünmeyecek. Varsayılan: renkli, aydınlık, konuya ait doğal ortam/çevre arka planları (gündüz gökyüzü, orman, sahil, mutfak, mahkeme salonu, stadyum, atölye, pazar yeri, sokak…) + sıcak ve canlı palet.
- Koyu zemin yalnızca konu gerçekten gerektiriyorsa (uzay, gece, karanlık oda) ve o sahneyle sınırlı. Bir videoda koyu sahne oranı en fazla ~1/3; arka arkaya iki videonun baskın tonu aynı olamaz.
- Her videoda en az 2 farklı ortam/renk dünyası olsun (ör. sıcak mutfak → serin laboratuvar). #8'deki gündüz banka sahnesi doğru yönün örneği.

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
| 7 | Şu an ışık saçıyorsun | İnsan Vücudu | Skill hattı; parlayan yüzsüz insan silüeti + üstü çizili göz, karanlık oda kesiti (5 gönüllü, ışık söner), buz kristalli soğutmalı kamera + deklanşör flaşı + GÜN sayacı, kamera ekranında REC + parlayan silüet, 1000× çubuk karşılaştırma, ölçek dalışı yüz→hücre (Mikro Dünya paleti) + moleküller + foton kaçışları, yüz parıltı haritası, saat kadranı 08→16 + parıltı çubuğu, Gufi'nin Gubi'ye iltifatı ve kendisinin de parlaması; müzik: havadar ambient + camsı arpej + mikro sahnede nabız (La minör, 80 bpm) |
| 8 | Limon suyuyla görünmez olacağını sanan soyguncu (Dunning-Kruger) | Psikoloji | İLK CANLI MASKOT VİDEOSU (M.canli: göz takibi + tepkiler + imza sesleri, tepkiler.json ile ses senkronu); Gufi 'soyguncu' rolünde yüzüne limon sürer (limon cilası aksesuarı), GÜNDÜZ sahnesi (açık gökyüzü, iki banka, üstü çizili maske), limonla görünmez mürekkep + mum ısısıyla belirme, yarı saydam 'görünmez' Gufi + güvenlik kamerası, Polaroid banyo olur → fotoğrafta tavan lambası, görüş konisiyle açıklama, TV haberi (CCTV yeşili, SON DAKİKA bandı), kapı vuruşu + polis ışıkları, konuşma balonu, gazete + gözlük, baloncuklardan oluşan dev '?', gerçek-tahmin sütunları + ortalama çizgisi (Gufi sütunun tepesinde yükselir), terazi, ayna yansıması + 'EMİN OLMAK ≠ BİLMEK'; müzik: pizzicato yürüyen bas + fırça tıkırtısı (Re minör 104 bpm) → bilim kısmında pad + marimba (Fa majör) |
| 9 | İlk bilgisayar "bug"ı gerçek bir böcekti | Bilim & Teknoloji | Hata veren ekrandan uçan güve → deftere bantlanır; oda büyüklüğünde Mark II (zoom-out ölçek + lambaların sırayla kırmızıya dönmesi + ekran sarsıntısı); KARANLIKTA EL FENERİ (SVG maske ile ışık konisi gizli sahneyi açar) ile röle taraması, Röle 70'e zoom; cımbız + bant + kendini yazan el yazısı (clip reveal); 'actual' vurgusu + göz kırpan yüz; zaman şeridi + geri sayan yıl sayacı (1947→1878); Edison ampulü + mektupta daire içine alınan "bugs"; dünyayı saran konuşma balonları; müze vitrini + spot + camda buğu; D-E-B-U-G tuşları, ekran yeşile döner, güve dışarı uçar; müzik: röle groove (sinüs bas + filtreli kare arpej + tık, Mi minör 96 bpm), 1878'de müzik kutusu |
| 11 | Kendine mikrop içen doktor (Marshall & Warren, H. pylori) | Sağlık & Vücut | YENİ ATMOSFER KURALIYLA İLK VİDEO (aydınlık: güneşli laboratuvar kreması, 80'ler hastane mint'i, mide içi pembe, Nobel altın-bordo; vinyet .18); GERÇEK HARİTA ile Avustralya + Perth iğnesi; GERÇEK KİŞİYE BENZEYEN portreler (Warren: beyaz yanlar + gözlük; Marshall: kahverengi saç, önlük); içinde spiral bakteriler yüzen bardak, ders kitabı ÜLSER = STRES + ACI, mide kesitinde asitte eriyen bakteri, mikroskop görüş dairesi, çarpı damgalı silüetler + mutlu domuz yavrusu, bardağın eğilip boşalması (gulp), takvim GÜN sayacı, mide içi dünya + endoskop hortumu + flaş, reçetenin üstünü çizme + kapsüllerin bakterileri kovalaması, dönen Nobel madalyası; ekranda 'Tıbbi tavsiye değildir'; müzik: akustik tel vuruşları + shaker (Re majör 92 bpm), içme anında gerilim nabzı |
| 12 | Çapa etkisi (Tversky & Kahneman çarkı, hâkimler ve zar) | Psikoloji & Beyin | ETKİLEŞİM v2 İLK VİDEO: Gubi süzülerek girip çarkı işaret eder, Gufi zıplayarak kürsüye çıkar, düşünme balonu, kayıkta kürek çeken Gufi, sonda kameraya yaklaşıp izleyiciyi işaret eder (arka plan bulanık); aydınlık yarışma stüdyosu (ışık hüzmeleri, ampul şeridi), yavaşlayarak duran şans çarkı (tık sesleri), ikiye bölünmüş ekranda 10/65 çarkları, GERÇEK dünya haritasında Afrika ülkelerinin tek tek yanması, gerçek oranlı %25/%45 sütunları + ipli çark rozetleri, '10'un çapaya dönüşüp denize batması + ipe bağlı TAHMİN kayığı, GERÇEK Almanya haritası, ahşap mahkeme + cübbeli hâkim + yuvarlanan zar + 5/8 ay ceza çubukları, üstü çizili fiyat etiketi + asılı çapa, pazar tezgâhı; müzik: yarışma programı funk (slap bas + brass + el çırpma, Fa majör 110 bpm), denizde pad + dalga |
| 13 | Mona Lisa'yı ünlü yapan hırsızlık (1911, Peruggia) | Sanat & Tasarım | ft-motion teknikleriyle İLK VİDEO: hareket bulanıklığı (hırsızlık yürüyüşü, kuyruk, kameraya yaklaşma), sahneler arası eğik silme + daire geçişleri, gazete manşetlerinde harf harf yaylanan yazı, sayaç ('2 YIL'), damga sesi, flaş; bordo Louvre salonu + altın çerçeveler, flat ama tanınır Mona Lisa (kaşsız, orta ayrık saç, kavuşturulmuş eller, puslu manzara), çerçevenin boşalması + 4 demir çivi, duvar dolusu tablo içinde köşedeki küçük Mona Lisa, benzeyen Peruggia portresi (bıyık + kasket) + cam vitrin, beyaz önlüklü yüzsüz hırsız silüeti tabloyu önlüğe saklar, takvim 21→22, sepya 'Le Petit Journal' manşetleri, boş duvar önünde uzayan kuyruk (Gufi zıplayarak katılır), çatı katında sandık, GERÇEK harita Paris→Floransa kesikli yol + kelepçe, ışık huzmeli 'yıldız' dönüşü + foto flaşları; müzik: Paris akordeon valsi (3/4, Re minör 132 bpm), hırsızlıkta pizzicato gerilim, Floransa'da mandolin tremolosu · **v2 (tarz rehberi v3 ile yeniden yapıldı):** dolu mekânlar ve farklı tonlar (Louvre gül-bordo, lavanta tablo duvarı, kum atölye/çatı katı, şafak moru kapalı müze, şeftali bekçi odası, adaçayı Paris sokağı + büfe, sarı ışıklı 'yıldız' salonu), KS.karakter ziyaretçiler (yürüyüş adımı), bıyıklı beyaz önlüklü hırsız tabloyu taşır, kadife bariyer + heykel + bank + perde ön çerçeve, masadaki gerçek harita kartı; kapak paneli mürdüm |
| 14 | Altı Sıfır (2005, 1.000.000 TL = 1 YTL) | Ekonomi & Para | MASKOTLAR ÖNDE / ROL (MARKA v4) ilk video: yeni kostum.js (KO.giy: silindir, monokl, papyon, simitçi başlığı, kasket, kravat, gözlük, parti şapkası; M.canli ust fonksiyon olarak kabul eder) — Gufi 'milyoner' (silindir+monokl) tomarla tek simit alır, Gubi simitçi → döviz memuru → market kasiyeri (sıfır sayar, '9. sıfır?' balonu) → sunucu (papyon+mikrofon) → Merkez Bankası memuru (kravat+gözlük, makasla 6 sıfır keser, Gufi sıfırları kovalar); sarı İstanbul sokağı + simit arabası, lavanta oturma odası + cüzdan + döviz tabelası, şeftali market + uzayan fiş + hesap makinesi 'E', kırmızı perdeli sahnede Rekorlar Kitabı + REKOR damgası, gece şehir havai fişek + 1.000.000→1 YTL uçan sıfırlar + dönen banknot, çayır terazisi (maaş/simit birlikte küçülür, sıfırlar çöpe), 'YENİ' tabeladan düşer, sıfır kulesi patlar Gufi'nin şapkası uçar, çekmeceden eski milyonluk; müzik: retro Türk pop grubu 104 bpm Sol majör, rekor sahnesinde ironik minör marş; kapak paneli koyu çam yeşili |
| 10 | Bulduğun Cüzdan Kimin? (TMK 769–771, TCK 160) | Hukuk | maskotlar rolde: Gufi cüzdanı bulan vatandaş (önde, büyük), Gubi trafik polisi (lacivert kasket + düdük, SAHİBİ/POLİS tabelasını gösterir) → hakim (gözlük + papyon, tokmak, 'ADALET MÜLKÜN TEMELİDİR' duvarlı mahkeme, TCK 160 levhası) → cüzdan sahibi (melon şapka, No:7 apartman kapısı, hediye kutusu) → danışma görevlisi (bordo kasket); sonbahar sokağı + uçuşan yapraklar, cüzdan açılır (banknot + kimlik yelpazesi), Medeni Kanun kitabında 'BİLDİRMEK ZORUNLU' harf harf, duvara düşen parmaklık gölgesi, taştan '%10' → EFSANE damgası → çatlayıp parçalanır, bölünmüş ekran sokak ✓ / kamu binası ✗, bankta 5 yıl bekleyiş (mevsimler akar, kar yağar, takvim 2026→2031) + 'SENİN' kurdelesi; uyarı satırı 'Genel bilgilendirmedir, hukuki tavsiye değildir.'; müzik: akustik pena + ksilofon 96 bpm Do majör, mahkemede minör gerilim; kapak paneli koyu mürdüm-lacivert |

İptal edilen / listeden ÇIKARILAN konular (bir daha önerme): Divriği'nin Kapısında Beliren Adam (PDF #5).

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

### Canlı animasyon (KALICI — her videoda `M.canli` kullan, statik maskot koyma)
`M.canli('gubi'|'gufi', { t, x, y, boy, bakHedef:[x,y], tepkiler:[[t0,'tip'],...] })` her karede çağrılır:
- **Göz kırpma:** deterministik, karakterlere göre farklı ritim (seed); **nefes/idle:** Gubi süzülür + hafif sallanır, Gufi nefesle esner.
- **Göz takibi:** `bakHedef` ile göz bebekleri bir noktaya bakar → birbirlerine, anlatılan nesneye, izleyiciye (aşağı-ön) baktır. Sahne içinde bakışı ANLATIYA göre yönlendir (kim konuşuyorsa/ne gösteriliyorsa oraya).
- **Tepkiler:** `sasir` (sıçrama + turuncu ünlem + ter), `zipla` (squash/stretch, iniş basması), `mutlu` (^^ gözler + minik gülümseme + zıplama), `aha` (Gubi: glow patlaması + pırıltı halkası), `korku` (titreme + geri bakış + ter), `selam` (sallanma), `uzgun` (kaşlar + çökme), `kararli` (çatık kaş).

### Etkileşim kuralı v2 (KALICI) — maskotlar kenarda bekleyen süs değil, sahnenin oyuncusu
- **Eller:** YALNIZCA GUFİ'NİN yüzen yuvarlak elleri var (kolsuz; Gubi elsiz — işaret ederken eğilip hedefe pırıltı izi saçar, göz kapatırken gözlerini yumar) ve NORMALDE GÖRÜNMEZ; el gerektiren harekette gövdenin ARKASINDAN çıkar, bitince geri saklanır. Göz kapatmada iki karakter de EL KULLANMAZ, gözlerini sıkıca yumar. Tepkiler: `isaret` (isaretHedef'i gösterir), `alkis`, `gozKapa` (gözlerini yumar, el yok), `dusun` (el çenede + düşünce baloncukları), `omuzSilk`, `kahkaha`, `goster` ("ta-da"), `donus`, `selam` (el sallar) + eskiler.
- **Sahnede dolaşma:** `yol: [[t, x, y, boy], ...]` → Gufi zıplayarak, Gubi süzülerek (pırıltı izi) yer değiştirir; sahneye giriş/çıkışlar böyle.
- **Kameraya yaklaşma:** `M.yakinlas(t, t0, t1)` zarfıyla karakter ekranın ortasına büyür, `M.bulanik(k)` + `M.bulanikSar()` ile arka plan bulanıklaşır, karakter net kalır; `bakHedef: 'kamera'` ile izleyiciye bakar ve el sallar/konuşur. Ses: `maskot_ses(kim, 'yaklas')`.
- **Konuya dokunma:** karakterler anlatılan nesneyi eliyle gösterir, taşır, üstüne çıkar, düşünce balonunda konuyu hayal eder (`M.balon`).
- Her videoda EN AZ: 1 kameraya yaklaşma anı (kanca ya da kapanışta), 2+ el hareketi (işaret/gösterme), 1 sahneye giriş (yol) — konuya uygun seçilir.

### İmza sesler (KALICI — `marka/ses_lib.py` → `maskot_ses(kim, tip)`)
Her tepki, aynı anda kendi imza sesiyle çalınır: `M.add('sfx', maskot_ses('gubi','aha'), t, .5)`. Bu sesler değiştirilmez; kanalın "sesli logosu" gibidir.
- **Gubi:** kristal/cam "ting" ailesi — Mi majör pentatonik, hep yukarı kıvrılır (merak = yükselen soru); `aha` = parlak arpej.
- **Gufi:** lastik "bup/boing" ailesi — tombul, alçak (Sol3), perde düşüşü + yay titreşimi; `korku` = titrek "brrr", `mutlu` = "bup-bup-bup".
- Anlatıcı konuşurken tepki sesini −6 dB kısık kullan; seslendirmeyi asla örtmesin. Demo: `marka/maskot_demo/`.
Kullanım: her videoda 3–6 kısa rol. Gubi soruyu sorar / aha anında parlar, Gufi şaşırır / tepki verir; kapanışta ikisi logoya dönüşür.

## Logo kapanışı
Kapanıştaki gubigufi logosu ekranın TAM ORTASINDA durur (x 540, y ~940, genişlik ~660). Kapanışta altyazı/etiket olmadığı için
safe alan kaydırması uygulanmaz (kullanıcı geri bildirimi, #6 sonrası).

## Üst köşe yerleşimi (#7'den itibaren)
- Kategori etiketi sol üstte (x 62'den başlar, y ≈ 292).
- 60 sn sayaç halkası SAĞA YASLI: merkez x 974, y 300 (dış kenar 1018 = 1080 − 62, sol etiketle simetrik). Kullanıcı geri bildirimi.
- Güncel kanal katmanı: `marka/ortak/kanal.js` + `kanal.css` — her yeni videoda bunlar kopyalanır.

## MASKOTLAR ÖNDE — ROL VERME KURALI (v4)
Gubi ve Gufi arka planda köşede bekleyen süs DEĞİL; hikâyenin OYUNCULARI.
- Her videoda en az 3–4 sahnede maskotlara **rol** verilir: anlatılan kişiyi/nesneyi canlandırır (dedektif, hırsız, bekçi, doktor, hakem, müşteri…), deneyi kendileri yapar, kavramı kendi üzerlerinde gösterir.
- Kostüm/aksesuar ile rol: şapka, gözlük, bıyık, önlük, düdük, büyüteç vb. maskotun üstüne giydirilir (M.canli `ust` katmanı).
- Boyut: rol aldıkları sahnede büyük (boy 180–320), kadrajın ön/orta planında; en az bir sahnede kameraya yaklaşma.
- Aralarında diyalog/etkileşim: biri yapar diğeri tepki verir (şaşırır, güler, itiraz eder), birbirine nesne uzatır, kovalar, çarpışır.
- Konuşma balonları (M.balon) ile kısa laf/ünlem; altyazıyla çakışmayacak yerde.
- Sahne başına en az bir görünür tepki; hiçbir sahnede sadece köşede "duran" maskot olmaz.

## TESLİM LİSTESİ (her video)
video.mp4 · reels_kapak.jpg · Instagram açıklaması (en fazla 5 hashtag, "gubigufi ✦ 1 dakikada bir merak", kaynak) · YouTube Shorts başlığı · **YouTube etiketleri** (virgülle ayrılmış 12–20 anahtar kelime, sonda "gubigufi, shorts")

## ŞEKİLLİ YAZI KURALI (çip, etiket, damga, balon, tabela)
Arkasında şekil (hap/çip, kutu, damga çerçevesi, balon) olan HER yazı şeklin içine **düzgünce, iki yanda eşit boşlukla** sığmalı.
- Genişlik ASLA harf sayısından tahmin edilmez; `K.yaziGen(metin, fs, { mono, agirlik, ls })` ile gerçek ölçülür (SVG getComputedTextLength; mono yazı tipi + letter-spacing dahil).
- `cip()` artık ölçerek çizer (genişlik = ölçülen + 1.7×fs). Sabit genişlikli kutularda (balon, tabela, etiket kartı) yazı uzunsa kutu büyütülür ya da font küçültülür; kontak föyünde her şekilli yazı taşma için kontrol edilir.
