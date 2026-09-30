// Kullanım: node render.js <anim.html> stills <çıktıKlasörü> t1,t2,...
//           node render.js <anim.html> video <çıktı.mp4> [başlangıçSn bitişSn]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn, execSync } = require('child_process'); const fs = require('fs'); const path = require('path');
const FF = fs.readFileSync('/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad/ffpath', 'utf8').trim();
(async () => {
  const [html, mode, out, a, b] = process.argv.slice(2);
  const br = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const pg = await br.newPage({ viewport: { width: 540, height: 960 } });
  pg.on('pageerror', e => { console.error('SAYFA HATASI:', e.message); process.exit(1); });
  pg.on('console', m => { if (m.type() === 'error') console.error('konsol:', m.text()); });
  await pg.goto('file://' + path.resolve(html)); await pg.evaluate(() => window.ready);
  const grab = (t, q) => pg.evaluate(([t, q]) => { window.render(t); return document.getElementById('c').toDataURL('image/jpeg', q); }, [t, q]);
  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const t of a.split(',').map(Number)) { const d = await grab(t, .9); fs.writeFileSync(path.join(out, `t${t.toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64')); }
  } else {
    const dur = await pg.evaluate(() => window.DURATION); const t0 = a ? +a : 0, t1 = b ? +b : dur;
    const ff = spawn(FF, ['-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '30', out], { stdio: ['pipe', 'ignore', 'inherit'] });
    const n = Math.round((t1 - t0) * 30); const st = Date.now();
    for (let i = 0; i < n; i++) { const d = await grab(t0 + i / 30, .95); if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); if (i % 150 === 0) console.log(`kare ${i}/${n} ${((Date.now() - st) / 1000).toFixed(0)}sn`); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await br.close();
})();
