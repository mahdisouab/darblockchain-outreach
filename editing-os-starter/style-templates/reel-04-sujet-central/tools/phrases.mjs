#!/usr/bin/env node
// Lecture du transcript : phrases groupées sur les pauses, timecodes SOURCE.
//   node tools/phrases.mjs assets/rush.json [gap=0.45]
import { readFileSync } from "node:fs";
const [file, gapArg] = process.argv.slice(2);
if (!file) { console.error("usage: node tools/phrases.mjs <transcript.json> [gap]"); process.exit(1); }
const GAP = Number(gapArg ?? 0.45);
const t = JSON.parse(readFileSync(file, "utf8"));
const words = t.words.filter((w) => (w.type ?? "word") === "word");
let cur = null; const out = [];
for (const w of words) {
  if (cur && w.start - cur.end > GAP) { out.push({ pause: w.start - cur.end }); cur = null; }
  if (!cur) { cur = { start: w.start, end: w.end, text: [] }; out.push(cur); }
  cur.text.push(w.text); cur.end = w.end;
}
for (const p of out) {
  if (p.pause !== undefined) console.log(`            ··· pause ${p.pause.toFixed(2)}s`);
  else console.log(`${p.start.toFixed(2).padStart(7)} → ${p.end.toFixed(2).padStart(7)}  ${p.text.join(" ")}`);
}
console.log(`\n${words.length} mots · dernier mot à ${words.at(-1).end.toFixed(2)}s · durée source ${t.audio_duration_secs}s`);
