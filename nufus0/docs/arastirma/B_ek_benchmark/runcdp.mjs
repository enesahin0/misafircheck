import { spawn } from "node:child_process";
import fs from "node:fs";
const [exe, url, out, ...flags] = process.argv.slice(2);
const port = 9333;
const p = spawn(exe, ["--no-sandbox", "--disable-dev-shm-usage", `--remote-debugging-port=${port}`, "--window-size=1200,2000", "--user-data-dir=/tmp/cdp-profile-" + Date.now(), ...flags, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
let err = ""; p.stderr.on("data", (d) => (err += d));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" }); const j = await r.json(); ws = new WebSocket(j.webSocketDebuggerUrl); break; } catch { await sleep(500); } }
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const t0 = Date.now();
while (Date.now() - t0 < 600000) {
  await sleep(4000);
  const r = await send("Runtime.evaluate", { expression: "JSON.stringify({done:window.__DONE,err:window.__ERR,log:window.__LOG,res:window.__RESULTS})", returnByValue: true });
  const v = r.result?.result?.value; if (!v) continue;
  fs.writeFileSync(out, v);
  if (JSON.parse(v).done) break;
}
p.kill("SIGKILL");
console.log("finished", ((Date.now() - t0) / 1000).toFixed(0), "s", err.slice(0, 300));
process.exit(0);
