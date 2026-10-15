// `npm run mahalle:stills -- --shots=genel,bakkal:orta --light=ogle,gece [--frame=30] [--highlight=teras7] [--market]`
// Mahalle kitini kontrol kareleriyle (out/mahalle/*.png) denetler. Video üretmez.
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { findBrowserExecutable, glMode } from "./browser";
import { ROOT } from "./lib/audio";
import { VENUES } from "../src/world/mahalle/layout";

const args = process.argv.slice(2);
const opt = (n: string) => args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1];
const flag = (n: string) => args.includes(`--${n}`);

const allShots = ["genel", ...VENUES.flatMap((v) => [`${v.id}:orta`])];
const allCards = VENUES.map((v) => `${v.id}:kart`);
const shots = (opt("shots") ?? "genel").split(",").flatMap((s) => (s === "hepsi" ? allShots : s === "kartlar" ? allCards : [s]));
const lights = (opt("light") ?? "ogle").split(",");
const frame = Number(opt("frame") ?? 0);
const highlight = opt("highlight") ?? null;

(async () => {
  const dir = path.join(ROOT, "out", "mahalle");
  fs.mkdirSync(dir, { recursive: true });
  console.log("Paketleniyor...");
  const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src", "index.ts"), publicDir: path.join(ROOT, "public") });
  const browserExecutable = findBrowserExecutable();
  const chromiumOptions = { gl: glMode() } as const;
  const browser = await openBrowser("chrome", { browserExecutable, chromiumOptions, chromeMode: "headless-shell" });
  for (const shot of shots) {
    for (const light of lights) {
      const inputProps = { shot, frame, params: { light, highlight, market: flag("market"), cast: flag("empty") ? "none" : "default", solo: shot.endsWith(":kart") ? shot.split(":")[0] : null } };
      const composition = await selectComposition({ serveUrl, id: "MahalleDebug", inputProps, browserExecutable, chromiumOptions, logLevel: "error" });
      const out = path.join(dir, `${shot.replace(":", "_")}__${light}.png`);
      await renderStill({ composition, serveUrl, inputProps, frame: 0, output: out, puppeteerInstance: browser, chromiumOptions, browserExecutable, logLevel: "error", timeoutInMilliseconds: 240000 });
      console.log(`  ${shot} · ${light} → ${path.relative(ROOT, out)}`);
    }
  }
  await browser.close({ silent: true });
})().catch((e) => {
  console.error("✗ mahalle-stills hatası:", e?.message ?? e);
  process.exit(1);
});
