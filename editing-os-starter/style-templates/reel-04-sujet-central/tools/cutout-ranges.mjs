#!/usr/bin/env node
/**
 * Détourage CIBLÉ : seulement les passages où quelque chose passe DERRIÈRE lui (mots, halo).
 * Décidés par le storyboard (colonne MODE : DERRIÈRE), en secondes MONTÉES du bake.
 * ≈ 10 s de vidéo → 6 min de calcul, au lieu de 75 min pour le rush entier (retex du 10/09).
 *
 *   node tools/cutout-ranges.mjs --range b5word=11.9-13.2 --range halo=100.2-101.8 [--handle 0.3]
 *   node tools/cutout-ranges.mjs assets/cutout-ranges.json      # [{ "name", "start", "end" }, ...]
 *
 * Sortie : assets/cut/<name>.webm (alpha, timeline montée, poignées incluses) et les balises
 * <video> à coller dans #cutwrap (data-start = début − poignée, même piste 1, jamais chevauchées).
 * La composition ne change pas : les deux wrappers gardent le même transform, le détourage
 * n'existe simplement que là où on le voit.
 */
import { readFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const args = process.argv.slice(2);
const HANDLE = (() => { const i = args.indexOf("--handle"); return i >= 0 ? Number(args[i + 1]) : 0.3; })();
const VIDEO = "assets/edit.mp4", OUT = "assets/cut";
mkdirSync(OUT, { recursive: true });

const ranges = [];
args.forEach((a, i) => { if (a === "--range") { const m = args[i + 1].match(/^([\w-]+)=([\d.]+)-([\d.]+)$/); if (!m) throw new Error("--range name=a-b : " + args[i + 1]); ranges.push({ name: m[1], start: +m[2], end: +m[3] }); } });
const json = args.find((a) => a.endsWith(".json"));
if (json) ranges.push(...JSON.parse(readFileSync(json, "utf8")));
if (!ranges.length) { console.error("aucune plage : --range name=a-b ou un fichier .json"); process.exit(1); }
ranges.sort((x, y) => x.start - y.start);

const dur = +spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VIDEO], { encoding: "utf8" }).stdout.trim();
function run(cmd, a, opts = {}) {
  const r = spawnSync(cmd, a, { encoding: "utf8", maxBuffer: 1 << 28, ...opts });
  if (r.status !== 0) throw new Error(cmd + " " + a.slice(0, 5).join(" ") + "\n" + (r.stderr || "").slice(-1500));
  return r.stdout;
}
const tags = [];
let prevEnd = -1;
for (const r of ranges) {
  const a = Math.max(0, r.start - HANDLE, prevEnd), b = Math.min(dur, r.end + HANDLE);
  if (b <= a) { console.warn(`plage vide après fusion : ${r.name}`); continue; }
  prevEnd = b;
  const tmp = path.join(OUT, `${r.name}-src.mp4`), out = path.join(OUT, `${r.name}.webm`);
  if (!existsSync(out)) {
    run("ffmpeg", ["-y", "-v", "error", "-ss", a.toFixed(3), "-to", b.toFixed(3), "-i", VIDEO, "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", tmp]);
    const t0 = Date.now();
    run("npx", ["hyperframes", "remove-background", tmp, "-o", out], { shell: true });
    rmSync(tmp, { force: true });
    console.log(`${r.name} : ${a.toFixed(2)} → ${b.toFixed(2)} (${(b - a).toFixed(2)} s) détouré en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  } else console.log(`${r.name} : déjà là`);
  tags.push(`<video id="cut-${r.name}" src="${out.replace(/\\/g, "/")}" data-start="${a.toFixed(2)}" data-duration="${(b - a).toFixed(2)}" data-track-index="1" muted playsinline></video>`);
}
console.log("\nÀ coller dans #cutwrap (à la place de edit-cutout.webm) :\n" + tags.map((t) => "          " + t).join("\n"));
