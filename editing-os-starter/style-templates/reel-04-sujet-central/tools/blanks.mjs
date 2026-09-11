#!/usr/bin/env node
// Passe FINALE au niveau SONORE (PROCESS.md §6) : silencedetect sur le rush dans les plans
// gardés, rabote le MILIEU de chaque blanc >= MIN en laissant BREATH de respiration.
// Réécrit assets/edl.json (sauvegarde edl.bak.json). Sans --apply : rapport seulement.
//   node tools/blanks.mjs [--apply] [--noise -40] [--min 0.5] [--breath 0.25]
//   node tools/blanks.mjs --check assets/edit.mp4   → blancs restants dans le bake (preuve)
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const A = (p) => resolve(PROJ, "assets", p);
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? Number(argv[i + 1]) : d; };
const NOISE = opt("--noise", -40), MIN = opt("--min", 0.5), BREATH = opt("--breath", 0.25);
const APPLY = argv.includes("--apply");
const checkIdx = argv.indexOf("--check");

function silences(file, minDur) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-vn", "-af", `silencedetect=noise=${NOISE}dB:d=${minDur}`, "-f", "null", "-"], { encoding: "utf8" });
  const out = []; let s = null;
  for (const line of r.stderr.split(/\r?\n/)) {
    const a = line.match(/silence_start:\s*(-?[\d.]+)/); if (a) s = Number(a[1]);
    const b = line.match(/silence_end:\s*(-?[\d.]+)/); if (b && s !== null) { out.push([s, Number(b[1])]); s = null; }
  }
  if (s !== null) out.push([s, Infinity]);
  return out;
}

if (checkIdx >= 0) {
  const file = argv[checkIdx + 1];
  const sil = silences(file, 0.2);
  console.log(`blancs >= 0.2s dans ${file} (seuil ${NOISE} dB) :`);
  let bad = 0;
  for (const [s, e] of sil) {
    const d = e - s; const flag = d > BREATH + 0.12 ? "  <-- RESTE" : ""; if (flag) bad++;
    console.log(`  ${s.toFixed(2).padStart(7)} → ${(e === Infinity ? "fin" : e.toFixed(2)).padStart(7)}  ${d.toFixed(2)}s${flag}`);
  }
  console.log(bad ? `${bad} blanc(s) au-dessus de la respiration` : "aucun blanc au-dessus de la respiration OK");
  process.exit(bad ? 1 : 0);
}

const edl = JSON.parse(readFileSync(A("edl.json"), "utf8"));
const sil = silences(A("rush.mp4"), 0.25);
const seg = [];
let removed = 0, cuts = 0;
for (const [a, b] of edl.seg) {
  let cur = a;
  const pieces = [];
  for (const [s, e] of sil) {
    if (s <= a + 0.05 || e >= b - 0.05) continue; // touche une borne : géré par les pads
    if (e - s < MIN) continue;
    const c1 = s + BREATH / 2, c2 = e - BREATH / 2;
    console.log(`  plan ${a.toFixed(2)}-${b.toFixed(2)} : blanc ${s.toFixed(2)}→${e.toFixed(2)} (${(e - s).toFixed(2)}s) → coupe ${c1.toFixed(2)}→${c2.toFixed(2)}`);
    pieces.push([cur, c1]); cur = c2; removed += c2 - c1; cuts++;
  }
  pieces.push([cur, b]);
  seg.push(...pieces);
}
const dur = (l) => l.reduce((t, [a, b]) => t + (b - a), 0);
console.log(`\n${cuts} micro-blanc(s) rabotés · ${removed.toFixed(2)}s retirées · ${dur(edl.seg).toFixed(2)}s → ${dur(seg).toFixed(2)}s · ${seg.length} plans`);
if (APPLY) {
  copyFileSync(A("edl.json"), A("edl.bak.json"));
  writeFileSync(A("edl.json"), JSON.stringify({ ...edl, seg: seg.map(([a, b]) => [+a.toFixed(3), +b.toFixed(3)]), blanks: { noise: NOISE, min: MIN, breath: BREATH, cuts, removed: +removed.toFixed(3) } }, null, 1));
  console.log("edl.json réécrit (sauvegarde edl.bak.json)");
} else console.log("(rapport seulement : relancer avec --apply)");
