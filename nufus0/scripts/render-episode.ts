// `npm run render:001` (tam), `render:001:draft` (yarı çözünürlük), `render:test` (5 sn şehir testi), `stills` (kontrol kareleri)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { findBrowserExecutable, glMode } from "./browser";
import { generatePlaceholderAudio, ROOT, writeManifest } from "./lib/audio";
import { loadEpisode, loadWorldState } from "./lib/load";
import { writeModelIndex } from "./lib/models";
import { printReport, validateEpisode } from "./lib/validate";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string) => args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];
const id = args.find((a) => !a.startsWith("-")) ?? "001";
const isTest = flag("test");
const draft = flag("draft");
const stills = flag("stills");
const pixel = flag("pixel"); // piksel stili: Nufus0Episode001Pixel

const STILL_FRAMES = [0, 45, 100, 200, 300, 450, 530, 640, 700, 780, 840, 900, 1040, 1200, 1400, 1500, 1580, 1650, 1700, 1745, 1780, 1799];

(async () => {
  const t0 = Date.now();
  fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });

  // 1) sesler + manifest
  generatePlaceholderAudio();
  writeManifest();
  writeModelIndex();

  // 2) doğrulama (test render'ı hariç)
  if (!isTest) {
    console.log(`\nDOSYA ${id} doğrulanıyor...`);
    const rep = validateEpisode(await loadEpisode(id), loadWorldState());
    printReport(rep);
    if (rep.errors.length) process.exit(1);
  }

  // 3) bundle
  const compositionId = isTest ? "Nufus0Test5s" : `Nufus0Episode${id}${pixel ? "Pixel" : ""}`;
  console.log(`\nPaketleniyor (${compositionId})...`);
  let lastPct = -1;
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src", "index.ts"),
    publicDir: path.join(ROOT, "public"),
    onProgress: (p) => {
      if (p % 25 === 0 && p !== lastPct) {
        lastPct = p;
        process.stdout.write(`  ${p}%\n`);
      }
    },
  });

  const browserExecutable = findBrowserExecutable();
  const chromiumOptions = { gl: glMode() } as const;
  const cpu = os.cpus().length;
  const concurrency = Number(opt("concurrency") ?? process.env.NUFUS_CONCURRENCY ?? Math.max(1, Math.min(4, Math.floor(cpu / 2))));
  console.log(`Tarayıcı: ${browserExecutable ?? "Remotion varsayılanı"} · GL: ${glMode()} · eşzamanlılık: ${concurrency}`);

  const composition = await selectComposition({ serveUrl, id: compositionId, browserExecutable, chromiumOptions, logLevel: "error" });
  console.log(`Kompozisyon: ${composition.id} ${composition.width}x${composition.height} @${composition.fps}fps, ${composition.durationInFrames} kare = ${(composition.durationInFrames / composition.fps).toFixed(2)} sn`);

  // 4a) kontrol kareleri
  if (stills) {
    const dir = path.join(ROOT, "out", "stills");
    fs.mkdirSync(dir, { recursive: true });
    const only = opt("frames")?.split(",").map(Number);
    const frames = only ?? STILL_FRAMES;
    const browser = await openBrowser("chrome", { browserExecutable, chromiumOptions, chromeMode: "headless-shell" });
    for (const f of frames) {
      const out = path.join(dir, `${pixel ? "px_" : ""}f${String(f).padStart(4, "0")}.png`);
      await renderStill({ composition, serveUrl, frame: f, output: out, puppeteerInstance: browser, chromiumOptions, browserExecutable, logLevel: "error", timeoutInMilliseconds: 240000 });
      console.log(`  kare ${f} → ${path.relative(ROOT, out)}`);
    }
    await browser.close({ silent: true });
    return;
  }

  // 4b) video
  const base = isTest ? "NUFUS0_test_5sn" : `DOSYA${id}${pixel ? "_pixel" : ""}${draft ? "_draft" : ""}`;
  const output = path.join(ROOT, "out", `${base}.mp4`);
  const frameRange = opt("frames")?.split("-").map(Number) as [number, number] | undefined;
  console.log(`\nRender başlıyor → ${path.relative(ROOT, output)}${draft ? "  (TASLAK: yarı çözünürlük)" : ""}`);
  let lastLog = 0;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: output,
    chromiumOptions,
    browserExecutable,
    concurrency,
    imageFormat: "jpeg",
    jpegQuality: draft ? 80 : 95,
    crf: draft ? 28 : 17,
    pixelFormat: "yuv420p",
    scale: draft ? 0.5 : 1,
    audioCodec: "aac",
    audioBitrate: "192k",
    timeoutInMilliseconds: 240000,
    frameRange: frameRange ?? null,
    logLevel: "error",
    onProgress: ({ renderedFrames, encodedFrames, progress }) => {
      const now = Date.now();
      if (now - lastLog > 5000) {
        lastLog = now;
        const el = (now - t0) / 1000;
        console.log(`  %${(progress * 100).toFixed(1)} · render ${renderedFrames}/${composition.durationInFrames} · encode ${encodedFrames} · ${el.toFixed(0)}s`);
      }
    },
  });

  // 5) doğrulama: dosya gerçekten oluştu mu, süre/çözünürlük/fps doğru mu?
  const size = fs.statSync(output).size;
  console.log(`\n✓ Dosya yazıldı: ${path.relative(ROOT, output)} (${(size / 1e6).toFixed(1)} MB)`);
  try {
    const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,duration", "-of", "default=nw=1", output], { encoding: "utf8" });
    console.log(out.trim().split("\n").map((l) => "  " + l).join("\n"));
  } catch {
    console.log("  (ffprobe bulunamadı; `npx remotion ffprobe " + path.relative(ROOT, output) + "` ile kontrol edebilirsiniz)");
  }
  console.log(`Toplam süre: ${((Date.now() - t0) / 60000).toFixed(1)} dk`);
})().catch((e) => {
  console.error("\n✗ Render hatası:", e?.message ?? e);
  process.exit(1);
});
