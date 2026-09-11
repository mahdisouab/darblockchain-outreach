#!/usr/bin/env node
// Proposition de sous-titres (format 01) : groupes de 1 à 4 mots, 0,6 à 1,2 s par groupe,
// coupés sur la ponctuation et les pauses. Timecodes SOURCE (la composition passe par ed()).
// Sortie : les lignes `[src, "texte"],` à coller dans CAPS, à relire et à couper sur le SENS.
//   node tools/caps.mjs assets/transcript.json
import { readFileSync } from "node:fs";
const file = process.argv[2] ?? "assets/transcript.json";
const t = JSON.parse(readFileSync(file, "utf8"));
const words = t.words.filter((w) => (w.type ?? "word") === "word");
const MIN = 0.6, MAX = 1.2, MAXW = 4;
const groups = [];
let g = null;
for (let i = 0; i < words.length; i++) {
  const w = words[i];
  const prev = words[i - 1];
  const gap = prev ? w.start - prev.end : 0;
  if (g && (gap > 0.35 || g.words.length >= MAXW || (w.start - g.start) >= MAX)) { groups.push(g); g = null; }
  if (!g) g = { start: w.start, src: w.src_start ?? w.start, words: [], end: w.end };
  g.words.push(w.text); g.end = w.end;
  const punct = /[.!?,;:]$/.test(w.text);
  const dur = g.end - g.start;
  if (punct && dur >= MIN) { groups.push(g); g = null; }
}
if (g) groups.push(g);
for (let i = 0; i < groups.length; i++) {
  const a = groups[i], b = groups[i + 1];
  const shown = b ? b.start - a.start : a.end - a.start + 0.6;
  const flag = shown < MIN - 0.05 ? "   // court" : shown > MAX + 0.4 ? "   // long" : "";
  const text = a.words.join(" ").replace(/"/g, "\\\"");
  console.log(`        [${a.src.toFixed(2)}, "${text}"],${flag}`);
}
console.log(`\n// ${groups.length} groupes pour ${words.length} mots`);
