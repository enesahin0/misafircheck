import { openBrowser } from "@remotion/renderer";
import fs from "node:fs";
const gl = (process.argv[2] || "swangle") as "swangle";
const url = process.argv[3] || "http://127.0.0.1:8765/index.html";
const out = process.argv[4] || "/tmp/bench-out.json";
const browser = await openBrowser("chrome", { browserExecutable: process.env.BROWSER || "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell", chromiumOptions: { gl }, chromeMode: (process.env.MODE || "headless-shell") as never });
const page = await browser.newPage({ context: null as never, logLevel: "info", indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => undefined });
await page.goto({ url, timeout: 60000, options: { waitUntil: "load" } } as never);
const t0 = Date.now();
while (true) {
  await new Promise((r) => setTimeout(r, 5000));
  const s = await page.evaluate(() => JSON.stringify({ done: (window as any).__DONE, err: (window as any).__ERR, log: (window as any).__LOG, res: (window as any).__RESULTS }));
  const o = JSON.parse(s as string);
  fs.writeFileSync(out, s as string);
  if (o.done || Date.now() - t0 > 1500000) break;
}
await browser.close({ silent: true });
console.log("finished", ((Date.now() - t0) / 1000).toFixed(0) + "s");
process.exit(0);
