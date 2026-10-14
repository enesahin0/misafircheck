// Ortak yardımcı: render için kullanılacak Chromium'u ve GL modunu bulur.
// Kullanıcı hiçbir şey ayarlamadan çalışsın diye sırayla dener:
//   1) NUFUS_BROWSER ortam değişkeni  2) Playwright'ın kurduğu Chromium  3) Remotion'un kendi indirdiği tarayıcı
import fs from "node:fs";

const CANDIDATES = [
  process.env.NUFUS_BROWSER,
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];

export const findBrowserExecutable = (): string | null => {
  for (const c of CANDIDATES) {
    if (c && fs.existsSync(c)) return c;
  }
  return null; // Remotion kendi tarayıcısını indirir
};

/**
 * WebGL modu. Linux sunucu/konteynerde (GPU yok) yazılım WebGL olan "swangle" çalışır.
 * Windows/macOS'ta (ekran kartı var) "angle" varsayılan; elle değiştirmek için NUFUS_GL=swangle|angle|egl ayarlayın.
 */
export const glMode = (): "swangle" | "angle" | "egl" | "swiftshader" | "vulkan" => {
  return (process.env.NUFUS_GL as "angle") || (process.platform === "linux" ? "swangle" : "angle");
};
