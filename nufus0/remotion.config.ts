import { Config } from "@remotion/cli/config";
import fs from "node:fs";

// Tarayıcı + GL ayarları (render ve `remotion` CLI için). scripts/browser.ts ile aynı mantık.
const candidates = [
  process.env.NUFUS_BROWSER,
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
].filter((p): p is string => !!p && fs.existsSync(p));
if (candidates[0]) Config.setBrowserExecutable(candidates[0]);

Config.setChromiumOpenGlRenderer((process.env.NUFUS_GL as "angle") || (process.platform === "linux" ? "swangle" : "angle"));
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setConcurrency(Number(process.env.NUFUS_CONCURRENCY) || 2);
