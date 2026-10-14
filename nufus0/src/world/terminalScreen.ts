// Arşiv terminalinin ekranı — 2D canvas dokusu olarak kareye bağlı çizilir (3D ekran yüzeyine kaplanır).
export type TerminalState = {
  frame: number;
  /** 0 liste, 1 karar, 2 sayım */
  mode: number;
  /** 0..1: 62 → 63 → "63: LEYLA" */
  reveal: number;
  alert: number;
};

const BONE = "#E0DDD4";
const AMBER = "#B8935D";
const RED = "#E24A52";
const DIM = "#6C7378";

export const TERMINAL_W = 512;
export const TERMINAL_H = 384;

export const drawTerminal = (g: CanvasRenderingContext2D, s: TerminalState) => {
  const w = TERMINAL_W;
  const h = TERMINAL_H;
  g.fillStyle = "#06090B";
  g.fillRect(0, 0, w, h);
  g.textBaseline = "top";
  const mono = (px: number, wt = 500) => `${wt} ${px}px "IBM Plex Mono", monospace`;

  g.fillStyle = AMBER;
  g.font = mono(22, 700);
  g.fillText("ŞEHİR_0 // ARŞİV TERMİNALİ", 20, 16);
  g.fillStyle = DIM;
  g.font = mono(18);
  g.fillText("DOSYA 001 · 14. SOKAK", 20, 46);
  g.fillRect(20, 74, w - 40, 2);

  const flick = Math.floor(s.frame / 2) % 2 === 0;
  const phase = s.reveal;

  if (s.mode >= 1 && s.mode < 2) {
    g.fillStyle = BONE;
    g.font = mono(28, 700);
    g.fillText("KARAR BEKLENİYOR", 20, 96);
    g.fillStyle = AMBER;
    g.font = mono(24, 700);
    g.fillText("A  SOKAĞI GERİ GETİR", 20, 160);
    g.fillStyle = DIM;
    g.font = mono(18);
    g.fillText("   → BAŞKA BİR SOKAK KAYBOLUR", 20, 192);
    g.fillStyle = AMBER;
    g.font = mono(24, 700);
    g.fillText("B  62 KİŞİYİ KURTAR", 20, 244);
    g.fillStyle = DIM;
    g.font = mono(18);
    g.fillText("   → KİMLİKLERİ SİLİNİR", 20, 276);
    g.fillStyle = flick ? RED : "#7A2A2F";
    g.font = mono(20, 700);
    g.fillText("DIŞ HAT: OY BEKLENİYOR_", 20, 330);
  } else {
    // sayaç
    let count = 62;
    if (phase > 0.25 && phase <= 0.5) count = flick ? 63 : 62;
    if (phase > 0.5) count = 63;
    const hot = phase > 0.25;
    g.fillStyle = BONE;
    g.font = mono(20);
    g.fillText("KAYITLI KİŞİ", 20, 92);
    g.fillStyle = hot ? RED : BONE;
    g.font = mono(96, 700);
    g.fillText(String(count), 20, 118);
    g.fillStyle = DIM;
    g.font = mono(18);
    g.fillText("DURUM: SİLİNDİ / İÇERİDE", 210, 130);
    g.fillText("KONUM: YOK", 210, 156);

    // kayıt satırları (sabit liste, kareye bağlı kayma yok)
    const rows = [
      ["059", "GÜNEŞ A."], ["060", "H. KARA"], ["061", "R. ÇELİK"], ["062", "M. ODABAŞI"],
    ];
    g.font = mono(20);
    rows.forEach(([n, name], i) => {
      g.fillStyle = DIM;
      g.fillText(`${n}: ${name}`, 20, 238 + i * 28);
    });
    if (phase > 0.8) {
      const chars = Math.min(5, Math.ceil(((phase - 0.8) / 0.2) * 5));
      const name = "LEYLA".slice(0, chars);
      g.fillStyle = flick || phase > 0.95 ? RED : "#7A2A2F";
      g.fillRect(14, 348, w - 28, 30);
      g.fillStyle = "#06090B";
      g.font = mono(22, 700);
      g.fillText(`063: ${name}${chars < 5 ? "_" : ""}`, 22, 351);
    }
  }
  // tarama çizgileri
  g.fillStyle = "rgba(255,255,255,0.035)";
  for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1);
  if (s.alert > 0.2 && flick) {
    g.fillStyle = "rgba(189,55,63,0.12)";
    g.fillRect(0, 0, w, h);
  }
};
