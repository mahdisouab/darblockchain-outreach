#!/usr/bin/env node
// EDL depuis la carte des silences (PROCESS.md phase 1, convention du 26-09-05) :
// silencedetect -40 dB (>= MIN s) sur assets/rush.mp4 -> chaque run de parole devient un
// plan [debut - PRE, fin + POST] (~0,30 s de respiration a chaque raccord) ; les plans
// separes de moins de BREATH sont fusionnes ; des exclusions (faux departs, reprises) se
// retirent en temps source ; le dernier plan recoit TAIL apres la fin de parole.
//   node tools/edl-from-silences.mjs --end 126.53 [--start 2.19] [--drop 101.53-102.05 ...]
//        [--noise -40] [--min 0.25] [--pre 0.12] [--post 0.18] [--tail 0.45] [--breath 0.30]
import { writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const A = (p) => resolve(PROJ, "assets", p);
const argv = process.argv.slice(2);
const num = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? Number(argv[i + 1]) : d; };
const NOISE = num("--noise", -40), MIN = num("--min", 0.25), PRE = num("--pre", 0.12), POST = num("--post", 0.18);
const TAIL = num("--tail", 0.45), BREATH = num("--breath", 0.30), MINCUT = num("--mincut", 0.15);
const END = num("--end", NaN), START = num("--start", NaN);
const drops = [];
argv.forEach((a, i) => { if (a === "--drop") { const [x, y] = argv[i + 1].split("-").map(Number); drops.push([x, y]); } });

const r = spawnSync("ffmpeg", ["-hide_banner", "-i", A("rush.mp4"), "-vn", "-af", `silencedetect=noise=${NOISE}dB:d=${MIN}`, "-f", "null", "-"], { encoding: "utf8" });
const sil = []; let s = null;
for (const line of r.stderr.split(/\r?\n/)) {
  const a = line.match(/silence_start:\s*(-?[\d.]+)/); if (a) s = Number(a[1]);
  const b = line.match(/silence_end:\s*(-?[\d.]+)/); if (b && s !== null) { sil.push([s, Number(b[1])]); s = null; }
}
const durLine = r.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);
const DUR = durLine ? (+durLine[1]) * 3600 + (+durLine[2]) * 60 + (+durLine[3]) : Infinity;
// runs de parole = complement des silences
const runs = []; let cur = 0;
for (const [a, b] of sil) { if (a > cur + 0.01) runs.push([cur, a]); cur = b; }
if (cur < DUR - 0.01) runs.push([cur, DUR]);
const first = Number.isNaN(START) ? runs[0][0] : START;
const last = Number.isNaN(END) ? runs.at(-1)[1] : END;
let seg = runs.filter(([a, b]) => b > first && a < last).map(([a, b]) => [Math.max(a, first), Math.min(b, last)]);
// exclusions
for (const [x, y] of drops) {
  const out = [];
  for (const [a, b] of seg) {
    if (y <= a || x >= b) { out.push([a, b]); continue; }
    if (x > a) out.push([a, x]);
    if (y < b) out.push([y, b]);
  }
  seg = out;
}
// pads puis fusion
seg = seg.map(([a, b]) => [Math.max(0, a - PRE), b + POST]);
const merged = [];
for (const [a, b] of seg) {
  const p = merged.at(-1);
  /* une coupe qui retire moins de MINCUT ne vaut pas un raccord (eclat) : on fusionne */
  if (p && a - p[1] < MINCUT) p[1] = Math.max(p[1], b);
  else merged.push([a, b]);
}
// dernier plan : TAIL au lieu de POST
merged.at(-1)[1] = merged.at(-1)[1] - POST + TAIL;
const total = merged.reduce((t, [a, b]) => t + (b - a), 0);
const removed = (last - first) - total;
console.log(`${sil.length} silences (${NOISE} dB, >= ${MIN}s) · parole ${first.toFixed(2)} -> ${last.toFixed(2)}`);
merged.forEach(([a, b], i) => console.log(`  ${String(i + 1).padStart(2)}. ${a.toFixed(2).padStart(7)} -> ${b.toFixed(2).padStart(7)}  (${(b - a).toFixed(2)}s)`));
console.log(`${merged.length} plans · ${total.toFixed(2)}s montes · ${removed.toFixed(2)}s de silences/exclusions retires`);
const note = `SEG en secondes SOURCE (assets/rush.mp4), tools/edl-from-silences.mjs : carte des silences ${NOISE} dB (>= ${MIN}s), attaque -${PRE}s, fin +${POST}s (respiration ~${BREATH}s a chaque raccord, ${TAIL}s apres la chute), une coupe n existe que si elle retire >= ${MINCUT}s (sinon fusion). Exclusions : ${drops.map(([x, y]) => x + "-" + y).join(", ") || "aucune"}. Debut ${first}, fin ${last}.`;
writeFileSync(A("edl.json"), JSON.stringify({ note, seg: merged.map(([a, b]) => [+a.toFixed(2), +b.toFixed(2)]) }, null, 1));
console.log("assets/edl.json ecrit");
