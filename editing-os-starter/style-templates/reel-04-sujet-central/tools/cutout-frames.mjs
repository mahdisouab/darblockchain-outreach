#!/usr/bin/env node
/**
 * Cadrage sans détourer le rush entier : UNE image par plan, assemblées en une mini-vidéo de
 * N images, détourée en UN SEUL appel (le modèle se charge une fois : ≈ 10 s + 1,4 s par image),
 * puis le haut de tête lu sur l'alpha de chaque image. 35 plans ≈ 1 min au lieu de 75 min
 * pour 3 316 images (retex du 10/09).
 *
 *   node tools/cutout-frames.mjs [assets/edit.mp4] [assets/edl.json] [--at 0.3] [--eye 275]
 *
 * Sortie : assets/frames/plan-NN.png (l'image brute, pour calibrer l'offset des yeux à l'œil),
 * assets/frames/plans.webm (les N images détourées), la table par plan et, prêts à coller dans
 * index.html, EYES (haut de tête + offset yeux) et le scale minimal pour que yeux × scale ≥ 732
 * (jamais de bande noire en haut). L'offset yeux se calibre une fois par rush sur une image
 * (yeux ≈ haut de tête + 275 sur MVI_3479 ; + 290 sur MVI_3476).
 */
import { readFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
const pos = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const VIDEO = pos[0] || "assets/edit.mp4", EDL = pos[1] || "assets/edl.json";
const AT = opt("--at", 0.3), EYE_OFF = opt("--eye", 275), EYE_TARGET = 732;
const OUT = "assets/frames";
mkdirSync(OUT, { recursive: true });

const seg = JSON.parse(readFileSync(EDL, "utf8")).seg;
const starts = []; let acc = 0;
for (const [a, b] of seg) { starts.push(acc); acc += b - a; }

function run(cmd, a, opts = {}) {
  const r = spawnSync(cmd, a, { encoding: "utf8", maxBuffer: 1 << 28, ...opts });
  if (r.status !== 0) throw new Error(cmd + " " + a.slice(0, 5).join(" ") + "\n" + (r.stderr || "").slice(-1500));
  return r.stdout;
}

/* 1. une image par plan (PNG brut, gardé pour la calibration à l'œil) */
const t0 = Date.now();
seg.forEach(([a, b], i) => {
  const png = path.join(OUT, `plan-${String(i + 1).padStart(2, "0")}.png`);
  if (existsSync(png)) return;
  const t = starts[i] + Math.min(AT, (b - a) / 2);
  run("ffmpeg", ["-y", "-v", "error", "-ss", t.toFixed(3), "-i", VIDEO, "-frames:v", "1", "-update", "1", png]);
});
/* 2. les N images → une mini-vidéo à 25 i/s → un seul détourage */
const strip = path.join(OUT, "plans.mp4"), cut = path.join(OUT, "plans.webm");
if (!existsSync(cut)) {
  run("ffmpeg", ["-y", "-v", "error", "-framerate", "25", "-i", path.join(OUT, "plan-%02d.png"), "-c:v", "libx264", "-preset", "veryfast", "-crf", "12", "-pix_fmt", "yuv420p", strip]);
  run("npx", ["hyperframes", "remove-background", strip, "-o", cut], { shell: true });
  rmSync(strip, { force: true });
}
/* 3. haut de tête par image : première ligne où l'alpha dépasse THR (grille 54×96 → ×20 px) */
const W = 54, H = 96, THR = 96;
const raw = spawnSync("ffmpeg", ["-v", "error", "-c:v", "libvpx-vp9", "-i", cut, "-vf", `alphaextract,scale=${W}:${H}`, "-f", "rawvideo", "-pix_fmt", "gray", "-"], { maxBuffer: 1 << 26 });
if (raw.status !== 0) throw new Error("alpha illisible : " + cut);
const frames = Math.floor(raw.stdout.length / (W * H));
if (frames < seg.length) console.warn(`attention : ${frames} images détourées pour ${seg.length} plans`);
const rows = seg.map(([a], i) => {
  const f = raw.stdout.subarray(i * W * H, (i + 1) * W * H);
  let top = null;
  for (let y = 0; y < H && top === null; y++) for (let x = 0; x < W; x++) if (f[y * W + x] > THR) { top = y * 20; break; }
  return { plan: i + 1, src: a, head: top };
});
rows.forEach((r) => console.log(`plan ${String(r.plan).padStart(2, "0")} · src ${r.src.toFixed(2)} · tête ${r.head ?? "?"}`));
const heads = rows.map((r) => r.head).filter((v) => v !== null).sort((x, y) => x - y);
const pct = (arr, p) => arr[Math.min(arr.length - 1, Math.floor(p * arr.length))];
console.log(`\nhaut de tête (px source) : min ${heads[0]}  p5 ${pct(heads, 0.05)}  médiane ${pct(heads, 0.5)}  max ${heads.at(-1)}  · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
const eyes = rows.map((r) => (r.head ?? pct(heads, 0.5)) + EYE_OFF);
const minEye = Math.min(...eyes);
console.log(`EYES (tête + ${EYE_OFF}) : const EYES = [${eyes.join(",")}];`);
console.log(`scale minimal N1 pour yeux × scale ≥ ${EYE_TARGET} : ${(Math.ceil((EYE_TARGET + 4) / minEye * 100) / 100).toFixed(2)} (yeux min ${minEye})`);
console.log(`images : ${OUT}/plan-NN.png — vérifier l'offset yeux sur une image (yeux réels − haut de tête).`);
