Ölçüm ekleri (Araştırma B). Çalıştırma: bench.ts'i esbuild ile paketle (NODE_PATH=<proje>/node_modules), statik sunucuyla servis et,
runbench.mts (Remotion openBrowser; SwiftShader: gl=swangle, headless-shell) veya llvmpipe için:
  Xvfb :99 & DISPLAY=:99 LIBGL_ALWAYS_SOFTWARE=1 BROWSER=<tam chromium> MODE=chrome-for-testing node runbench.mts angle <url>?set=4&n=9 out.json
Not: kayıtlı kodlar araştırma amaçlıdır, projeye bağlı değildir. Mutlak süreler makineye özgüdür; oranlar önemlidir.
