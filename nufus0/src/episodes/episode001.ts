// DOSYA 001 — 14. Sokak. Sahne, kamera, altyazı, ses ve dünya eğrileri BURADA; kodda sabit yok.
// Kareler 30 fps: 1 sn = 30 kare, toplam 1800 kare = 60.00 sn.
import { episodeSchema, type Episode } from "./schema";

// Belediye arşivi (oda) yerel → dünya: x-4, z-18. Kısayollar: kamera hedefleri dünya koordinatıdır.
const raw = {
  episodeId: "001",
  title: "14. Sokak",
  dossier: "DOSYA 001",
  durationFrames: 1800,
  fps: 30,
  width: 1080,
  height: 1920,
  branchFromPrevious: null,
  decision: {
    id: "street14_decision",
    options: [
      { id: "A", label: "Sokağı geri getir", cost: "Başka bir sokak kaybolur" },
      { id: "B", label: "62 kişiyi kurtar", cost: "Kimlikleri silinir" },
    ],
    status: "OPEN",
    closesAtLocal: null, // yayın zamanı belli olunca doldurulur (Europe/Istanbul)
    winner: null,
    votes: null,
  },
  persistentClues: ["RED_CAR", "AMBER_WINDOW_3F", "LEYLA_PERSON_63", "CLOCK_0317", "BROKEN_LAMP_14", "DOOR_ZERO", "LEYLA_PRESENT"],

  scenes: [
    {
      id: "street-deletion", name: "Sokak siliniyor", from: 0, to: 120, overlay: "streetDeletion", sway: 0.05,
      camera: [
        { f: 0, target: [16.5, 3.2, 17], zoom: 31 },
        { f: 120, target: [15, 3, 15.5], zoom: 36 },
      ],
      clue: { id: "STREET_SIGN_14", note: "14. SOKAK tabelası ilk saniyelerde silinen ilk nesnelerden biri." },
      lifeDetails: ["Havada kalan pencerelerde dururken sallanan silüetler", "Boşluğun kenarında nabız gibi atan kırmızı kayıt izi", "Boşlukta süzülen kayıt parçacıkları"],
    },
    {
      id: "announcement", name: "Anons", from: 120, to: 330, overlay: "announcement", sway: 0.04,
      camera: [
        { f: 120, target: [15, 3, 15.5], zoom: 36 },
        { f: 215, target: [7.5, 3.4, 6.5], zoom: 44 },
        { f: 330, target: [5.5, 3.6, 2.5], zoom: 52 },
      ],
      clue: { id: "BROKEN_LAMP_14", note: "Belediye hoparlörünün yanındaki sokak lambası bozuk; sonraki bölümlerde onarılmış görünmemeli." },
      lifeDetails: ["Çöp kutusunun kapağı arada kalkıp iner", "Rögar buharı", "Boş otobüs durağında tek kedi"],
    },
    {
      id: "trace", name: "İz", from: 330, to: 570, overlay: "trace", sway: 0.04,
      camera: [
        { f: 330, target: [5.5, 3.6, 2.5], zoom: 52 },
        { f: 410, target: [16.5, 1.5, 16], zoom: 33 },
        { f: 470, target: [16.5, 1.5, 16], zoom: 33 },
        { f: 570, target: [-14, 1.2, 3], zoom: 38 },
      ],
      clue: { id: "RED_CAR", note: "Kırmızı küçük araba Merkez Sk.'dan geçer. Konumu worldState.props.redCar içinde." },
      lifeDetails: ["Boşluğun içinde 3 yanan pencere", "Köşede yanıp sönen sokak lambası", "Kırmızı arabanın far ışığı yola vurur"],
    },
    {
      id: "population-zero", name: "Nüfus 0", from: 570, to: 810, overlay: "population", sway: 0.03,
      camera: [
        { f: 570, target: [-14, 1.2, 3], zoom: 38 },
        { f: 650, target: [0, -2, 0], zoom: 11.5 },
        { f: 720, target: [0, -2, 0], zoom: 11.5 },
        { f: 810, target: [-3, 7, -16], zoom: 30 },
      ],
      clue: { id: "AMBER_WINDOW_3F", note: "Belediyenin üçüncü katındaki tek amber pencere; sık sık yanıp söner." },
      lifeDetails: ["Antendeki kırmızı uyarı ışığı", "Şehir maketinin kenarındaki ince plinth çizgisi", "Uzakta tek kırmızı araba"],
    },
    {
      id: "archive", name: "Arşiv", from: 810, to: 1140, overlay: "archive", sway: 0.03,
      camera: [
        { f: 810, target: [-3, 7, -16], zoom: 30 },
        { f: 870, target: [-4, 2.4, -18.5], zoom: 44 },
        { f: 960, target: [-3.4, 2.0, -19.6], zoom: 62 },
        { f: 1060, target: [-3.4, 1.8, -20.4], zoom: 72 },
        { f: 1140, target: [-2.8, 1.8, -21.2], zoom: 64 },
      ],
      clue: { id: "CLOCK_0317", note: "Arşivdeki duvar saati sonsuza dek 03.17'de; duvar haritasında 14. Sokak boşluğu." },
      lifeDetails: ["Masa lambası titrer", "Açık bırakılmış kırmızı dosya", "Floresan arada kısa söner", "Köşede kırmızı uyarı ışığı beklemede"],
    },
    {
      id: "decision", name: "A / B kararı", from: 1140, to: 1470, overlay: "decision", sway: 0.02,
      camera: [
        { f: 1140, target: [-2.8, 1.8, -21.2], zoom: 64 },
        { f: 1215, target: [-0.8, -1.35, -24.0], zoom: 150 },
        { f: 1470, target: [-0.9, -1.45, -24.1], zoom: 158 },
      ],
      clue: { id: "DOOR_ZERO", note: "Üzerinde 0 yazan kapı ve üstündeki kırmızı gösterge: 008. dosyanın kapısı." },
      lifeDetails: ["Terminal tarama çizgileri", "Terminal imleci yanıp söner", "Floresan ışığı ekrana vurur"],
    },
    {
      id: "person-63", name: "63. kişi", from: 1470, to: 1710, overlay: "reveal", transitionIn: "glitch", sway: 0.03,
      camera: [
        { f: 1470, target: [-4, 2.2, -18.5], zoom: 46 },
        { f: 1530, target: [-5.6, 1.6, -22.4], zoom: 62 },
        { f: 1710, target: [-5.6, 1.4, -22.6], zoom: 58 },
      ],
      clue: { id: "LEYLA_PERSON_63", note: "Silinen sokak listesinin 63. kişisi Leyla. Uzun vadeli gizem." },
      lifeDetails: ["Açılan çekmece", "Dosya sayfalarının hafif kıpırtısı", "Beacon'dan dönen kırmızı ışın"],
    },
    {
      id: "cut", name: "Kesilme", from: 1710, to: 1800, overlay: "cut", sway: 0.03,
      camera: [
        { f: 1710, target: [-5.6, 1.4, -22.6], zoom: 58 },
        { f: 1766, target: [-8.4, 1.9, -21.6], zoom: 84 },
        { f: 1800, target: [-8.4, 1.9, -21.6], zoom: 84 },
      ],
      clue: { id: "LEYLA_PRESENT", note: "Leyla hem listede (silinmiş) hem odada (var). Çelişki." },
      lifeDetails: ["Beacon tam güçte", "Terminal kırmızı yanıp söner", "Leyla'nın başı hafifçe kameraya döner"],
    },
  ],

  captions: [
    { from: 0, to: 62, text: "Bu sokak dün gece silindi." },
    { from: 62, to: 120, text: "Ama içindeki 62 kişi hâlâ orada." },
    { from: 132, to: 232, text: "Saat 03.17'de belediye tek bir anons yaptı:" },
    { from: 232, to: 330, text: "“14. Sokak kayıtlardan çıkarılmıştır.”" },
    { from: 336, to: 422, text: "Sabah haritada boşluk vardı." },
    { from: 422, to: 468, text: "Kameralarda da." },
    { from: 468, to: 570, text: "Ama içeride ışıklar yanmaya devam ediyordu." },
    { from: 576, to: 652, text: "Burası ŞEHİR_0." },
    { from: 652, to: 732, text: "Burada 18.407 kişi yaşıyor." },
    { from: 732, to: 810, text: "Resmî nüfus ise sıfır." },
    { from: 816, to: 900, text: "Arşiv iki çözüm buldu." },
    { from: 900, to: 1020, text: "Sokağı geri getirirsek başka bir sokak kaybolacak." },
    { from: 1020, to: 1140, text: "İnsanları kurtarırsak kim olduklarını unutacaklar." },
    { from: 1146, to: 1232, text: "A: Sokağı geri getir." },
    { from: 1232, to: 1322, text: "B: İnsanları kurtar." },
    { from: 1322, to: 1398, text: "Yorumlara A ya da B yaz." },
    { from: 1398, to: 1470, text: "Çoğunluğun kararı yarın uygulanacak." },
    { from: 1476, to: 1562, text: "Bir dakika..." },
    { from: 1562, to: 1650, text: "Arşivde 62 değil, 63 kişi yazıyor." },
    { from: 1650, to: 1712, text: "Son kaydın adı Leyla." },
    { from: 1716, to: 1766, text: "Ama Leyla şu anda belediyede." },
  ],

  // Dünya parametrelerini süren eğriler: [kare, değer, "l"(doğrusal)|"s"(basamak)?]
  tracks: {
    street14Erase: [[0, 0.3], [26, 0.4, "l"], [112, 1.0]],
    speakerRed: [[0, 0], [166, 0], [172, 1], [560, 1], [620, 0.35], [810, 0.25]],
    redCarT: [[0, 0.1], [430, 0.1], [570, 0.62], [690, 0.99]],
    cutaway: [[0, 0], [812, 0], [872, 1]],
    redAlert: [[0, 0], [880, 0.18], [1560, 0.18], [1600, 0.6], [1650, 0.9], [1710, 1], [1800, 1]],
    drawerOpen: [[0, 0], [1508, 0], [1538, 1]],
    holdingFile: [[0, 0], [1545, 0], [1546, 1, "s"]],
    terminalMode: [[0, 0], [1138, 0], [1140, 1, "l"], [1466, 1], [1468, 0, "l"]],
    terminalReveal: [[0, 0], [1585, 0], [1600, 0.3], [1612, 0.5], [1630, 0.55], [1650, 0.8], [1700, 1]],
  },
  redCarRoute: "merkez",

  // Leyla (arşiv odası yerel koordinatı). Poz: sit/reach/hold/typing 0..1
  leyla: [
    { f: 0, pos: [0.5, -3.3], rot: 0, sit: 1, typing: 0.8 },
    { f: 1380, pos: [0.5, -3.3], rot: 0, sit: 1, typing: 0.8 },
    { f: 1400, pos: [0.5, -3.3], rot: 0, sit: 1, typing: 0 },
    { f: 1424, pos: [0.5, -3.3], rot: 0, sit: 0 },
    { f: 1434, pos: [0.5, -3.3], rot: -1.5708, sit: 0 },
    { f: 1512, pos: [-5.6, -3.4], rot: -1.5708, sit: 0 },
    { f: 1538, pos: [-5.6, -3.4], rot: -1.5708, reach: 0.75 },
    { f: 1568, pos: [-5.6, -3.4], rot: -1.5708, hold: 1 },
    { f: 1598, pos: [-5.6, -3.4], rot: 1.91, hold: 1, yaw: -0.3 },
    { f: 1740, pos: [-5.6, -3.4], rot: 1.91, hold: 1, yaw: 0 },
    { f: 1785, pos: [-5.6, -3.4], rot: 1.91, hold: 1, yaw: 0.9 },
  ],

  glitches: [
    { at: 6, len: 8, power: 1 },
    { at: 38, len: 6, power: 0.6 },
    { at: 70, len: 7, power: 0.7 },
    { at: 168, len: 8, power: 0.7 },
    { at: 600, len: 7, power: 0.8 },
    { at: 1468, len: 6, power: 0.7 },
    { at: 1598, len: 12, power: 1 },
    { at: 1700, len: 8, power: 0.8 },
    { at: 1745, len: 6, power: 0.7 },
  ],

  hud: {
    hook: { lines: ["BU SOKAK SİLİNDİ", "62 KİŞİ İÇERİDE"], clock: "03.17" },
    announce: { label: "BELEDİYE ANONSU · 03.17", quote: "14. SOKAK KAYITLARDAN ÇIKARILMIŞTIR." },
    trace: { tags: ["HARİTA ▸ 14. SOKAK: YOK", "KAMERA 14-03 ▸ SİNYAL YOK", "IŞIK ▸ 3 PENCERE AKTİF"] },
    population: { city: "ŞEHİR_0", believed: 18407, official: 0, believedLabel: "KİŞİ YAŞIYOR", officialLabel: "RESMÎ NÜFUS" },
    archive: { title: "ARŞİV · 2 ÇÖZÜM" },
    reveal: { counterLabel: "ARŞİVDE KAYITLI KİŞİ", from: 62, to: 63, name: "LEYLA", paradox: "KONUM: BELEDİYE" },
    finalCard: { brand: "NÜFUS_0", question: "A / B ?", when: "YARIN 20.00" },
    footer: "KURGUSAL · ANİMASYON · GERÇEK DUYURU DEĞİLDİR",
  },

  audio: {
    narration: [
      { id: "s1", file: "001_s1", from: 3, volume: 1 },
      { id: "s2", file: "001_s2", from: 132, volume: 1 },
      { id: "s3", file: "001_s3", from: 336, volume: 1 },
      { id: "s4", file: "001_s4", from: 576, volume: 1 },
      { id: "s5", file: "001_s5", from: 816, volume: 1 },
      { id: "s6", file: "001_s6", from: 1146, volume: 1 },
      { id: "s7", file: "001_s7", from: 1476, volume: 1 },
      { id: "s8", file: "001_s8", from: 1716, volume: 1 },
    ],
    sfx: [
      { id: "erase-hit", src: "sfx/_generated/hit_low.wav", from: 0, volume: 0.9 },
      { id: "glitch-6", src: "sfx/_generated/glitch.wav", from: 6, volume: 0.8 },
      { id: "glitch-38", src: "sfx/_generated/glitch.wav", from: 38, volume: 0.5 },
      { id: "glitch-70", src: "sfx/_generated/glitch.wav", from: 70, volume: 0.55 },
      { id: "pa-chime", src: "sfx/_generated/pa_chime.wav", from: 166, volume: 0.8 },
      { id: "glitch-168", src: "sfx/_generated/glitch.wav", from: 168, volume: 0.45 },
      { id: "counter", src: "sfx/_generated/counter_ticks.wav", from: 655, volume: 0.45 },
      { id: "zero-hit", src: "sfx/_generated/hit_low.wav", from: 740, volume: 0.7 },
      { id: "terminal-1", src: "sfx/_generated/terminal_beep.wav", from: 1142, volume: 0.5 },
      { id: "terminal-2", src: "sfx/_generated/terminal_beep.wav", from: 1232, volume: 0.4 },
      { id: "switch", src: "sfx/_generated/glitch.wav", from: 1468, volume: 0.6 },
      { id: "reveal-glitch", src: "sfx/_generated/glitch.wav", from: 1598, volume: 0.9 },
      { id: "reveal-hit", src: "sfx/_generated/hit_low.wav", from: 1650, volume: 0.9 },
      { id: "alarm", src: "sfx/_generated/alarm.wav", from: 1712, volume: 0.55 },
      { id: "cut", src: "sfx/_generated/cut.wav", from: 1766, volume: 1 },
    ],
    music: { src: "music/_generated/drone.wav", volume: 0.42 },
  },

  continuity: {
    requires: { streets: { "14": "PRESENT" } },
    sets: { streets: { "14": "ERASED" } },
  },

  publishing: {
    postLocal: "20:00 (Europe/Istanbul)",
    voteClosesLocal: "ertesi gün 14:00 (Europe/Istanbul)",
    caption:
      "DOSYA 001 — 14. Sokak dün gece haritadan silindi. İçindeki 62 kişi hâlâ orada.\n\nA: Sokağı geri getir → başka bir sokak kaybolur.\nB: 62 kişiyi kurtar → kimlikleri silinir.\n\nYorumlara A ya da B yaz. Oylama yarın 14.00'te kapanır; çoğunluğun kararı yarın 20.00'de yeni bölümde uygulanır.\n\nNÜFUS_0 kurgusal, animasyonla üretilmiş bir evrendir; gerçek bir kamu duyurusu değildir.",
    story: ["A mı B mi? Yorumlara yaz.", "Oylama yarın 14.00'te kapanır."],
  },
} satisfies Record<string, unknown>;

export const episode001: Episode = episodeSchema.parse(raw);
