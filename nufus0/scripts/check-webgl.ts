// `npm run test:webgl` — tarayıcıda WebGL çalışıyor mu? (CLAUDE.md §4 performans #3)
import { openBrowser } from "@remotion/renderer";
import { findBrowserExecutable, glMode } from "./browser";

(async () => {
  const exe = findBrowserExecutable();
  console.log("Tarayıcı:", exe ?? "(Remotion varsayılanı)");
  console.log("GL modu :", glMode());
  const browser = await openBrowser("chrome", {
    browserExecutable: exe,
    chromiumOptions: { gl: glMode() },
    chromeMode: "headless-shell",
  });
  const page = await browser.newPage({ context: null as never, logLevel: "info", indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => undefined });
  const result = await page.evaluate(() => {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGL2RenderingContext | null;
    if (!gl) return { ok: false };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      ok: true,
      version: gl.getParameter(gl.VERSION),
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "?",
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close({ silent: true });
  process.exit(result.ok ? 0 : 1);
})();
