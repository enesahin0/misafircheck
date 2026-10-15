// Ses altyapısı:
//  1) public/audio altındaki mevcut dosyaları tarar → src/generated/audioManifest.json
//  2) Dosya yoksa telifsiz YER TUTUCU SFX + müzik sentezler (public/audio/**/_generated). Tamamen prosedürel — lisans sorunu yok.
// Gerçek ses koymak için: public/audio/narration/001_s1.mp3 ... dosyalarını bırakmak yeterli; kod değişmez.
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..", "..");
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const MANIFEST = path.join(ROOT, "src", "generated", "audioManifest.json");
const EXT = new Set([".mp3", ".wav", ".m4a", ".aac", ".ogg"]);

/* ---------------------------------------------------------------- manifest */
const walk = (dir: string, out: string[] = []): string[] => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(e.name).toLowerCase())) out.push(p);
  }
  return out;
};

/** "impactMetal_heavy_002.ogg" → ["impact","metal","heavy"] (+ paket adı parçaları) */
const tagsFor = (file: string, pack: string): string[] => {
  const base = path.basename(file, path.extname(file));
  const parts = base
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/\d+/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return [...new Set([...parts, ...pack.replace(/^kenney\//, "").split("-")])];
};

export const writeLibraryIndex = () => {
  const lib = path.join(AUDIO_DIR, "library");
  const entries = walk(lib).map((p) => {
    const rel = path.relative(path.join(ROOT, "public"), p).split(path.sep).join("/");
    const pack = path.relative(lib, path.dirname(p)).split(path.sep).join("/");
    return { id: `${pack}/${path.basename(p, path.extname(p))}`, path: rel, pack, tags: tagsFor(p, pack) };
  });
  entries.sort((a, b) => a.id.localeCompare(b.id));
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(path.join(path.dirname(MANIFEST), "audioLibrary.json"), JSON.stringify({ entries }, null, 1) + "\n");
  // lisans defteri ile karşılaştır: defterde olmayan paket = HATA (lisanssız ses kullanılamaz)
  const ledgerPath = path.join(lib, "ledger.json");
  const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, "utf8")).packs : {};
  const unlicensed = [...new Set(entries.map((e) => e.pack))].filter((p) => !ledger[p]);
  return { count: entries.length, unlicensed };
};

export const writeManifest = (): string[] => {
  writeLibraryIndex();
  const files = walk(AUDIO_DIR)
    .map((p) => path.relative(path.join(ROOT, "public"), p).split(path.sep).join("/"))
    .sort();
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify({ files }, null, 2) + "\n");
  return files;
};

/* ---------------------------------------------------------------- WAV */
const writeWav = (file: string, data: Float32Array, sr: number) => {
  const n = data.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, data[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
};

/* ---------------------------------------------------------------- sentez yardımcıları */
let seed = 1234567;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const TAU = Math.PI * 2;
const SR = 44100;

const mk = (sec: number, sr = SR) => new Float32Array(Math.floor(sec * sr));
const normalize = (d: Float32Array, peak = 0.9) => {
  let m = 0;
  for (const v of d) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < d.length; i++) d[i] = (d[i] / m) * peak;
  return d;
};

const hitLow = () => {
  const d = mk(1.8);
  let ph = 0;
  let lp = 0;
  for (let i = 0; i < d.length; i++) {
    const t = i / SR;
    ph += (TAU * (36 + 90 * Math.exp(-t * 6))) / SR;
    const n = noise();
    lp += 0.08 * (n - lp);
    d[i] = Math.tanh(1.6 * Math.sin(ph) * Math.exp(-t * 2.1) + lp * 1.4 * Math.exp(-t * 28));
  }
  return normalize(d);
};

const glitch = () => {
  const d = mk(0.5);
  let i = 0;
  while (i < d.length) {
    const len = Math.floor((0.02 + rnd() * 0.05) * SR);
    const type = Math.floor(rnd() * 4);
    const f = 110 + rnd() * 900;
    const hold = 2 + Math.floor(rnd() * 10);
    let held = 0;
    for (let j = 0; j < len && i + j < d.length; j++) {
      const t = (i + j) / SR;
      let v = 0;
      if (type === 0) v = noise();
      else if (type === 1) v = Math.sign(Math.sin(TAU * f * t));
      else if (type === 2) v = 0;
      else v = Math.sin(TAU * f * 2 * t) * noise();
      if (j % hold === 0) held = v;
      v = held;
      v = Math.round(v * 6) / 6; // bit kırma
      d[i + j] = v * 0.7 * (1 - (i + j) / d.length);
    }
    i += len;
  }
  return normalize(d, 0.8);
};

const paChime = () => {
  const d = mk(3.6);
  const note = (f: number, at: number, dur: number, g: number) => {
    for (let i = Math.floor(at * SR); i < Math.min(d.length, Math.floor((at + dur) * SR)); i++) {
      const t = i / SR - at;
      const env = Math.exp(-t * 2.6) * Math.min(1, t * 80);
      d[i] += g * env * (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * f * 2.01 * t) + 0.15 * Math.sin(TAU * f * 3.02 * t));
    }
  };
  note(659.25, 0.05, 1.4, 0.5);
  note(523.25, 0.6, 1.8, 0.5);
  let lp = 0;
  for (let i = Math.floor(1.6 * SR); i < d.length; i++) {
    const t = i / SR;
    lp += 0.2 * (noise() - lp);
    const crackle = rnd() < 0.0009 ? noise() * 0.9 : 0;
    d[i] += (0.07 * Math.sin(TAU * 100 * t) + 0.05 * Math.sin(TAU * 50 * t) + 0.05 * lp + crackle * 0.4) * Math.min(1, (t - 1.6) * 3) * Math.min(1, (3.6 - t) * 3);
  }
  for (let i = 0; i < 400; i++) d[i] += noise() * 0.6 * (1 - i / 400);
  return normalize(d, 0.85);
};

const counterTicks = () => {
  const d = mk(2.6);
  for (let k = 0; k * 0.07 < 1.9; k++) {
    const at = Math.floor(k * 0.07 * SR);
    const g = 0.25 + 0.6 * (k / 27);
    for (let i = 0; i < 220 && at + i < d.length; i++) d[at + i] += g * Math.sin(TAU * 2200 * (i / SR)) * Math.exp(-i / 40);
  }
  const at = Math.floor(2.0 * SR);
  for (let i = 0; at + i < d.length; i++) {
    const t = i / SR;
    d[at + i] += 0.9 * Math.sin(TAU * 60 * t) * Math.exp(-t * 6);
  }
  return normalize(d);
};

const terminalBeep = () => {
  const d = mk(0.3);
  const tone = (f: number, at: number, dur: number) => {
    for (let i = Math.floor(at * SR); i < Math.floor((at + dur) * SR); i++) {
      const t = i / SR - at;
      d[i] += Math.sin(TAU * f * t) * Math.min(1, t * 400) * Math.min(1, (dur - t) * 200);
    }
  };
  tone(1320, 0, 0.1);
  tone(880, 0.14, 0.12);
  return normalize(d, 0.6);
};

const alarm = () => {
  const d = mk(2.2);
  for (let k = 0; k < 4; k++) {
    const at = k * 0.6;
    for (let i = Math.floor(at * SR); i < Math.floor((at + 0.28) * SR) && i < d.length; i++) {
      const t = i / SR - at;
      const f = k % 2 ? 392 : 523;
      const saw = 2 * ((f * t) % 1) - 1;
      d[i] += (0.6 * saw + 0.4 * Math.sin(TAU * f * t)) * Math.min(1, t * 200) * Math.exp(-t * 5);
    }
  }
  return normalize(d, 0.7);
};

const cut = () => {
  const d = mk(1.3);
  let ph = 0;
  for (let i = 0; i < d.length; i++) {
    const t = i / SR;
    const burst = t < 0.06 ? noise() * (1 - t / 0.06) : 0;
    ph += (TAU * (40 + 760 * Math.exp(-t * 9))) / SR;
    d[i] = burst * 0.9 + Math.sin(ph) * Math.exp(-t * 3.2) * 0.9;
  }
  return normalize(d);
};

/** 60 sn karanlık ambiyans: alçak pad + kalp atışı gibi sub darbe + geç gelen yarım ton gerilimi. */
const drone = () => {
  const sr = 22050;
  const d = mk(60, sr);
  const notes = [55, 82.41, 110, 58.27];
  const phs = notes.map(() => 0);
  let lp = 0;
  let nlp = 0;
  for (let i = 0; i < d.length; i++) {
    const t = i / sr;
    const cutoff = 0.012 + 0.01 * (0.5 + 0.5 * Math.sin((TAU * t) / 24));
    let v = 0;
    notes.forEach((f, k) => {
      const detune = 1 + 0.003 * Math.sin((TAU * t) / (7 + k * 3));
      phs[k] += (TAU * f * detune) / sr;
      let s = 0;
      for (let h = 1; h <= 6; h++) s += Math.sin(phs[k] * h) / h;
      const g = k === 3 ? Math.max(0, (t - 38) / 14) * 0.5 : 1 / (1 + k * 0.4);
      v += s * g;
    });
    lp += cutoff * (v - lp);
    nlp += 0.02 * (noise() - nlp);
    const beatT = t % 1.8;
    const beatAmp = 0.15 + 0.3 * (t / 60);
    const beat = Math.sin(TAU * 45 * beatT) * Math.exp(-beatT * 9) * beatAmp + Math.sin(TAU * 45 * (beatT - 0.28)) * Math.exp(-(beatT - 0.28) * 11) * (beatT > 0.28 ? beatAmp * 0.6 : 0);
    d[i] = lp * 0.9 + nlp * 0.35 * (0.6 + 0.4 * Math.sin((TAU * t) / 13)) + beat;
  }
  return { data: normalize(d, 0.85), sr };
};

/* ---------------------------------------------------------------- dışa açık */
export const GENERATED = [
  "sfx/_generated/hit_low.wav",
  "sfx/_generated/glitch.wav",
  "sfx/_generated/pa_chime.wav",
  "sfx/_generated/counter_ticks.wav",
  "sfx/_generated/terminal_beep.wav",
  "sfx/_generated/alarm.wav",
  "sfx/_generated/cut.wav",
  "music/_generated/drone.wav",
];

export const generatePlaceholderAudio = (force = false): string[] => {
  const made: string[] = [];
  const out = (rel: string, make: () => Float32Array | { data: Float32Array; sr: number }) => {
    const file = path.join(AUDIO_DIR, rel);
    if (!force && fs.existsSync(file)) return;
    seed = 1234567; // her ses deterministik
    const r = make();
    if (r instanceof Float32Array) writeWav(file, r, SR);
    else writeWav(file, r.data, r.sr);
    made.push(rel);
  };
  out("sfx/_generated/hit_low.wav", hitLow);
  out("sfx/_generated/glitch.wav", glitch);
  out("sfx/_generated/pa_chime.wav", paChime);
  out("sfx/_generated/counter_ticks.wav", counterTicks);
  out("sfx/_generated/terminal_beep.wav", terminalBeep);
  out("sfx/_generated/alarm.wav", alarm);
  out("sfx/_generated/cut.wav", cut);
  out("music/_generated/drone.wav", drone);
  return made;
};
