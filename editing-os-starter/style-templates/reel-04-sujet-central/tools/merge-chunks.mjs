#!/usr/bin/env node
// Recolle les transcripts par morceaux (tools/chunks.sh) en un seul transcript en temps
// SOURCE, meme schema que scripts/transcribe-whisper.mjs (words start/end en secondes).
// La duree totale est celle du dernier morceau decale de son offset.
//   node tools/merge-chunks.mjs assets/chunks assets/rush.json
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const [dir, out] = process.argv.slice(2);
if (!dir || !out) { console.error("usage: node tools/merge-chunks.mjs <chunks-dir> <out.json>"); process.exit(1); }
const files = readdirSync(dir).filter((f) => /^c\d+\.json$/.test(f)).sort();
const words = [];
let lang = "ar";
let dur = 0;
for (const f of files) {
  const j = JSON.parse(readFileSync(join(dir, f), "utf8"));
  const off = Number(readFileSync(join(dir, f.replace(/\.json$/, ".offset")), "utf8").trim());
  lang = j.language_code ?? lang;
  dur = Math.max(dur, off + (j.audio_duration_secs ?? 0));
  let n = 0;
  for (const w of j.words ?? []) {
    if ((w.type ?? "word") !== "word") continue;
    words.push({ text: w.text, start: +(w.start + off).toFixed(3), end: +(w.end + off).toFixed(3), type: "word", speaker_id: w.speaker_id ?? "speaker_0", chunk: f.replace(/\.json$/, "") });
    n++;
  }
  console.log(`${f} @ ${off.toFixed(2)}s : ${n} mots`);
}
words.sort((a, b) => a.start - b.start);
for (let i = 1; i < words.length; i++) if (words[i].start < words[i - 1].end - 0.05) console.warn(`chevauchement ${words[i - 1].text} / ${words[i].text} a ${words[i].start}`);
if (!dur) dur = words.at(-1)?.end ?? 0;
writeFileSync(out, JSON.stringify({ language_code: lang, text: words.map((w) => w.text).join(" "), words, audio_duration_secs: +dur.toFixed(3), chunked: files.length }, null, 1));
console.log(`${out} : ${words.length} mots, ${files.length} morceaux, dernier mot a ${words.at(-1)?.end}s, duree ${dur.toFixed(2)}s`);
