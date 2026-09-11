#!/usr/bin/env node
// Ligne de tête : pour chaque image du détourage (alpha), la première ligne opaque.
//   node tools/headline.mjs assets/rush-cutout.webm [assets/edl.json]
//   → stats globales, courbe par seconde, et avec l EDL : par plan [debut, min, p10, mediane]
//     (sert à calculer la compensation y par plan dans index.html, ligne de tête fixe).
import { readFileSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
const [file, edlFile] = process.argv.slice(2);
const W = 54, H = 96, SCALE = 20, FPS = 25, THR = 96;
const ff = spawn("ffmpeg", ["-v", "error", "-c:v", "libvpx-vp9", "-i", file, "-vf", `alphaextract,scale=${W}:${H}`, "-f", "rawvideo", "-pix_fmt", "gray", "-"]);
let buf = Buffer.alloc(0); const tops = [];
ff.stdout.on("data", (d) => {
  buf = Buffer.concat([buf, d]);
  while (buf.length >= W * H) {
    const f = buf.subarray(0, W * H); buf = buf.subarray(W * H);
    let top = null;
    for (let y = 0; y < H && top === null; y++) for (let x = 0; x < W; x++) if (f[y * W + x] > THR) { top = y; break; }
    tops.push(top === null ? null : top * SCALE);
  }
});
ff.on("close", () => {
  const seg = edlFile && existsSync(edlFile) ? JSON.parse(readFileSync(edlFile, "utf8")).seg : null;
  const kept = (i) => !seg || seg.some(([a, b]) => i / FPS >= a && i / FPS <= b);
  const vals = tops.map((v, i) => ({ v, i })).filter((o) => o.v !== null && kept(o.i));
  const ys = vals.map((o) => o.v).sort((a, b) => a - b);
  const pct = (arr, p) => arr[Math.min(arr.length - 1, Math.floor(p * arr.length))];
  console.log(`${tops.length} images · ${vals.length} retenues${seg ? " (dans l EDL)" : ""}`);
  console.log(`haut de tête (px source, 1920 de haut) : min ${ys[0]}  p5 ${pct(ys, 0.05)}  médiane ${pct(ys, 0.5)}  p95 ${pct(ys, 0.95)}  max ${ys.at(-1)}`);
  const line = [];
  for (let s = 0; s * FPS < tops.length; s++) {
    const w = tops.slice(s * FPS, (s + 1) * FPS).filter((v) => v !== null);
    line.push(`${String(s).padStart(3)}s:${w.length ? Math.min(...w) : "-"}`);
  }
  console.log(line.join("  "));
  if (seg) {
    console.log("\npar plan [debut, min, p10, mediane] :");
    const rows = seg.map(([a, b]) => {
      const w = tops.slice(Math.round(a * FPS), Math.round(b * FPS)).filter((v) => v !== null).sort((x, y) => x - y);
      return [a, w[0] ?? null, w.length ? pct(w, 0.1) : null, w.length ? pct(w, 0.5) : null];
    });
    console.log(JSON.stringify(rows));
  }
});
