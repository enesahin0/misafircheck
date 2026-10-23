// capture_template.mjs — deterministic frame capture via headless Chrome
// usage: node capture.mjs preview | node capture.mjs render [start end]
// Requires: playwright-core (npm i playwright-core) + system Chrome or Edge
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'fs';

// ---------- EDIT THESE ----------
const EXE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
// Edge fallback: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const URL = 'file:///ABSOLUTE/PATH/TO/host.html';
const W = 1920, H = 1080;
const DUR = 15.0;                 // must match scene.js
const PREVIEW_AT = 'midpoints';   // 'midpoints' or explicit frame list

// ---------- resolve frame list ----------
const mode = process.argv[2] || 'render';
const midpoints = [];
const SECTION = 2.5;
for (let s = 0; s * SECTION < DUR; s++) midpoints.push(Math.round((s * SECTION + SECTION * 0.6) * 60));

let list;
if (mode === 'preview') list = PREVIEW_AT === 'midpoints' ? midpoints : PREVIEW_AT;
else {
  const a = process.argv[3] ? parseInt(process.argv[3]) : 0;
  const b = process.argv[4] ? parseInt(process.argv[4]) : Math.round(DUR * 60) - 1;
  list = [];
  for (let i = a; i <= b; i++) list.push(i);
}

const fmt = mode === 'preview' ? 'png' : 'jpg';
const outDir = mode === 'preview' ? 'preview' : 'frames';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXE,
  headless: true,
  args: ['--force-device-scale-factor=1', '--hide-scrollbars', '--mute-audio', '--disable-background-timer-throttling']
});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(URL);
await page.waitForFunction('window.__ready === true');

// batch evaluate — parallel dataURL extraction
const BATCH = 24;
let done = 0;
for (let b = 0; b < list.length; b += BATCH) {
  const chunk = list.slice(b, b + BATCH);
  const datas = await page.evaluate(({ idxs, f }) => idxs.map(i => window.renderFrame(i, f)), { idxs: chunk, f: fmt });
  datas.forEach((d, k) => {
    const i = chunk[k];
    const name = mode === 'preview' ? `t${String(i).padStart(4, '0')}.png` : `f_${String(i).padStart(4, '0')}.jpg`;
    writeFileSync(`${outDir}/${name}`, Buffer.from(d.split(',')[1], 'base64'));
  });
  done += chunk.length;
  console.log(`${done}/${list.length}`);
}
await browser.close();
console.log('DONE');
