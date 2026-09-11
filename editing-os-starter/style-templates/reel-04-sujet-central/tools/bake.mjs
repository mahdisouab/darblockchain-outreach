#!/usr/bin/env node
// Bake UNIQUE du montage parole depuis assets/edl.json ({ "seg": [[a,b],...] }, secondes
// SOURCE, ordre = ordre de la timeline, pas forcément chronologique).
//   → assets/edit.mp4 + assets/voix.m4a
//   → assets/edit-cutout.webm (même EDL appliqué à assets/rush-cutout.webm, alpha préservé)
//   → assets/transcript.json (mots de assets/rush.json re-timés sur le montage)
// Le MÊME EDL sert au bake, au détourage et à la composition (leçon v10) : le script
// vérifie que `const SEG = [...]` de index.html est identique à edl.json.
//   node tools/bake.mjs [--dry] [--no-cutout] [--only-cutout]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const A = (p) => resolve(PROJ, "assets", p);
const FPS = 25;
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry"), NO_CUTOUT = args.has("--no-cutout"), ONLY_CUTOUT = args.has("--only-cutout");

const edl = JSON.parse(readFileSync(A("edl.json"), "utf8"));
const snap = (t) => Math.round(t * FPS) / FPS;
const SEG = edl.seg.map(([a, b]) => [snap(a), snap(b)]);
for (const [a, b] of SEG) if (!(b > a)) throw new Error(`segment invalide ${a}-${b}`);
const STARTS = []; let acc = 0;
for (const [a, b] of SEG) { STARTS.push(acc); acc += b - a; }
const DUR = acc;
const ed = (src) => {
  for (let i = 0; i < SEG.length; i++)
    if (src >= SEG[i][0] - 1e-6 && src <= SEG[i][1] + 1e-6) return STARTS[i] + (src - SEG[i][0]);
  return null;
};
console.log(`EDL : ${SEG.length} plans · durée montée ${DUR.toFixed(2)}s`);
SEG.forEach(([a, b], i) => console.log(`  ${String(i + 1).padStart(2)}. ${a.toFixed(2).padStart(7)} → ${b.toFixed(2).padStart(7)}  (${(b - a).toFixed(2)}s)  @ ${STARTS[i].toFixed(2)}`));

// --- même EDL que la composition ? ---
const idx = existsSync(resolve(PROJ, "index.html")) ? readFileSync(resolve(PROJ, "index.html"), "utf8") : "";
const m = idx.match(/const SEG\s*=\s*(\[[^;]*\]);/);
if (m) {
  const inIndex = JSON.stringify(JSON.parse(m[1].replace(/\s+/g, "")));
  const inEdl = JSON.stringify(SEG);
  if (inIndex !== inEdl) console.warn(`\n!! index.html et edl.json DIVERGENT.\n   Coller dans index.html :\n   const SEG = ${inEdl};\n`);
  else console.log("index.html : SEG identique à edl.json OK");
} else console.log("index.html : pas de `const SEG` trouvé (composition pas encore câblée)");

function graph(withAudio) {
  const parts = [], vin = [], ain = [];
  SEG.forEach(([a, b], i) => {
    parts.push(`[0:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS[v${i}]`); vin.push(`[v${i}]`);
    if (withAudio) { parts.push(`[0:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS[a${i}]`); ain.push(`[a${i}]`); }
  });
  parts.push(withAudio
    ? `${vin.map((v, i) => v + ain[i]).join("")}concat=n=${SEG.length}:v=1:a=1[v][a]`
    : `${vin.join("")}concat=n=${SEG.length}:v=1:a=0[v]`);
  return parts.join(";");
}
function run(argv) {
  console.log("\n$ ffmpeg " + argv.map((x) => (x.length > 90 ? x.slice(0, 90) + "…" : x)).join(" "));
  if (DRY) return;
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-stats", "-y", ...argv], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg a échoué (${r.status})`);
}

if (!ONLY_CUTOUT) {
  writeFileSync(A("edl-filter-av.txt"), graph(true));
  run(["-i", A("rush.mp4"), "-/filter_complex", A("edl-filter-av.txt"), "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", A("edit.mp4")]);
  run(["-i", A("edit.mp4"), "-vn", "-c:a", "copy", A("voix.m4a")]);

  // transcript re-timé, dans l'ordre de la timeline
  const rush = JSON.parse(readFileSync(A("rush.json"), "utf8"));
  const words = rush.words.filter((w) => (w.type ?? "word") === "word");
  const out = [];
  SEG.forEach(([a, b]) => {
    for (const w of words) {
      const s = Math.max(w.start, a), e = Math.min(w.end, b);
      if (e - s < Math.min(0.04, (w.end - w.start) * 0.5)) continue; // mot hors du plan (ou effleuré)
      out.push({ text: w.text, start: +ed(s).toFixed(3), end: +ed(e).toFixed(3), type: "word", speaker_id: w.speaker_id ?? "speaker_0", src_start: w.start, src_end: w.end });
    }
  });
  if (!DRY) writeFileSync(A("transcript.json"), JSON.stringify({
    language_code: rush.language_code ?? "fr", text: out.map((w) => w.text).join(" "), words: out, audio_duration_secs: +DUR.toFixed(3),
    edl: SEG,
  }, null, 1));
  console.log(`\ntranscript.json : ${out.length} mots · dernier mot à ${out.at(-1)?.end}s / ${DUR.toFixed(2)}s`);
}

if (!NO_CUTOUT) {
  if (!existsSync(A("rush-cutout.webm"))) console.log("\n(pas de rush-cutout.webm : détourage sauté)");
  else {
    writeFileSync(A("edl-filter-v.txt"), graph(false));
    run(["-c:v", "libvpx-vp9", "-i", A("rush-cutout.webm"), "-/filter_complex", A("edl-filter-v.txt"), "-map", "[v]",
      "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-b:v", "0", "-crf", "22",
      "-row-mt", "1", "-deadline", "good", "-cpu-used", "3", "-threads", "8", A("edit-cutout.webm")]);
  }
}
console.log(`\nDUR = ${DUR.toFixed(3)}  ·  const SEG = ${JSON.stringify(SEG)};`);
