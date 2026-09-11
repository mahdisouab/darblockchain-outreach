#!/usr/bin/env node
// Génère les <audio> SFX depuis assets/sfx.json ([src, role, volume, durée?] en secondes SOURCE)
// et les colle dans index.html entre <!-- SFX --> et <!-- /SFX -->. Temps convertis par le
// MÊME EDL que le bake (assets/edl.json), pistes uniques à partir de 10.
//   node tools/sfx.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const A = (p) => resolve(PROJ, "assets", p);
const FPS = 25;
const snap = (t) => Math.round(t * FPS) / FPS;
const SEG = JSON.parse(readFileSync(A("edl.json"), "utf8")).seg.map(([a, b]) => [snap(a), snap(b)]);
const STARTS = []; let acc = 0; for (const [a, b] of SEG) { STARTS.push(acc); acc += b - a; }
const DUR = acc;
const ed = (s) => { for (let i = 0; i < SEG.length; i++) if (s >= SEG[i][0] - 1e-6 && s <= SEG[i][1] + 1e-6) return STARTS[i] + (s - SEG[i][0]); return null; };
const DEFAULT_DUR = { whoosh: 0.64, "whoosh-2": 0.67, pop: 0.75, click: 0.14, typing: 6.5, shutter: 0.83, cash: 3.3, impact: 3.5, riser: 5.3, horloge: 9.6, buzzer: 2.9, ding: 0.82, "ding-synth": 0.82 };
const list = JSON.parse(readFileSync(A("sfx.json"), "utf8"));
const lines = [];
let track = 10, skipped = 0;
for (const [src, role, vol, dur] of list) {
  const t = ed(src);
  if (t === null) { skipped++; console.warn(`hors EDL, ignoré : ${src} ${role}`); continue; }
  const d = Math.min(dur ?? DEFAULT_DUR[role] ?? 1, DUR - t);
  lines.push(`      <audio id="sfx${track}" src="assets/sfx/${role}.wav" data-start="${t.toFixed(2)}" data-duration="${d.toFixed(2)}" data-volume="${vol}" data-track-index="${track}"></audio>`);
  track++;
}
const html = readFileSync(resolve(PROJ, "index.html"), "utf8");
const out = html.replace(/(<!-- SFX -->)[\s\S]*?(<!-- \/SFX -->)/, `$1\n${lines.join("\n")}\n      $2`);
if (out === html) { console.error("marqueurs <!-- SFX --> introuvables dans index.html"); process.exit(1); }
writeFileSync(resolve(PROJ, "index.html"), out);
console.log(`${lines.length} SFX écrits (${skipped} ignorés) · pistes 10-${track - 1} · DUR ${DUR.toFixed(2)}`);
