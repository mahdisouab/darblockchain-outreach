#!/usr/bin/env node
// Safe zone — VOIR les zones que l'interface (Instagram Reels) recouvre, sur un rendu ou une image.
//
//   node scripts/safe-zone.mjs <rendu.mp4> [--every 3] [--out <dossier>]      planche de contact zonée
//   node scripts/safe-zone.mjs <rendu.mp4> --t 1.5,12,40 [--out <dossier>]    images pleine résolution
//   node scripts/safe-zone.mjs <image.png> [--out <dossier>]                  une image zonée
//
// Zones (image de référence du créateur, 06/09/2026 — formats/04-sujet-central.md), en 1080×1920 :
//   rouge  : haut 0→220 · bas 1470→1920 · colonne d'icônes x 980→1080 pour y 1000→1470
//   vert   : la safe zone (marges 35 px)
//   cyan   : la cible de la ligne des yeux du format 04 (732, soit 38 %)
//   jaune  : la ligne de sous-titre du format 04 (1180)
// Tout se met à l'échelle de la taille réelle du fichier (un 720×1280 fonctionne aussi).
// Ne modifie jamais le fichier d'entrée ; écrit dans <dossier du fichier>/safe-zone/ par défaut.
//
// Ce que ça vérifie, à l'œil, sur la planche : le visage dans le vert avec les yeux près du
// cyan, aucun texte ni visuel important dans le rouge, le sous-titre sur le jaune. « Le CSS
// a l'air bon » n'est pas une vérification ; une image regardée en est une.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { findOnPath } from "./lib/platform.mjs";

const ZONES = { W: 1080, H: 1920, top: 220, bottom: 450, side: 35, colW: 100, colTop: 1000, eye: 732, cap: 1180 };

const argv = process.argv.slice(2);
const opt = { every: 3, t: null, out: null };
const files = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--every") opt.every = Number(argv[++i]);
  else if (a === "--t") opt.t = String(argv[++i]).split(",").map(Number).filter((n) => !Number.isNaN(n));
  else if (a === "--out") opt.out = argv[++i];
  else if (a === "--help" || a === "-h") { usage(); process.exit(0); }
  else files.push(a);
}
function usage() {
  console.log("usage : node scripts/safe-zone.mjs <rendu.mp4|image.png> [--every 3] [--t 1.5,12,40] [--out <dossier>]");
}
if (files.length !== 1) { usage(); process.exit(1); }

const input = resolve(files[0]);
if (!existsSync(input)) { console.error(`fichier introuvable : ${input}`); process.exit(2); }
const FFMPEG = findOnPath("ffmpeg") || "ffmpeg";
const FFPROBE = findOnPath("ffprobe") || "ffprobe";

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.error) throw r.error;
  if (r.status !== 0) { process.stderr.write(r.stderr || r.stdout || ""); throw new Error(`${basename(cmd)} a échoué (code ${r.status})`); }
  return r.stdout;
}

const info = JSON.parse(run(FFPROBE, ["-v", "error", "-select_streams", "v:0",
  "-show_entries", "stream=width,height:format=duration", "-of", "json", input]));
const W = info.streams?.[0]?.width, H = info.streams?.[0]?.height;
const duration = Number(info.format?.duration) || 0;
if (!W || !H) { console.error("dimensions illisibles"); process.exit(2); }
const kx = W / ZONES.W, ky = H / ZONES.H;
const px = (v, k) => Math.round(v * k);

const overlay = [
  `drawbox=x=0:y=0:w=${W}:h=${px(ZONES.top, ky)}:color=red@0.35:t=fill`,
  `drawbox=x=0:y=${px(ZONES.H - ZONES.bottom, ky)}:w=${W}:h=${px(ZONES.bottom, ky)}:color=red@0.35:t=fill`,
  `drawbox=x=${px(ZONES.W - ZONES.colW, kx)}:y=${px(ZONES.colTop, ky)}:w=${px(ZONES.colW, kx)}:h=${px(ZONES.H - ZONES.bottom - ZONES.colTop, ky)}:color=red@0.35:t=fill`,
  `drawbox=x=${px(ZONES.side, kx)}:y=${px(ZONES.top, ky)}:w=${px(ZONES.W - 2 * ZONES.side, kx)}:h=${px(ZONES.H - ZONES.top - ZONES.bottom, ky)}:color=lime@0.9:t=${Math.max(2, px(4, ky))}`,
  `drawbox=x=0:y=${px(ZONES.eye, ky)}:w=${W}:h=${Math.max(2, px(3, ky))}:color=cyan@0.9:t=fill`,
  `drawbox=x=0:y=${px(ZONES.cap, ky)}:w=${W}:h=${Math.max(1, px(2, ky))}:color=yellow@0.8:t=fill`,
].join(",");

const outDir = resolve(opt.out || join(dirname(input), "safe-zone"));
mkdirSync(outDir, { recursive: true });
const stem = basename(input, extname(input));
const isImage = /\.(png|jpe?g|webp|bmp)$/i.test(input);
const written = [];

if (isImage) {
  const out = join(outDir, `${stem}-safe.png`);
  run(FFMPEG, ["-v", "error", "-y", "-i", input, "-vf", overlay, "-frames:v", "1", "-update", "1", out]);
  written.push(out);
} else if (opt.t && opt.t.length) {
  for (const t of opt.t) {
    const out = join(outDir, `${stem}-${String(t).replace(".", "_")}s-safe.png`);
    run(FFMPEG, ["-v", "error", "-y", "-ss", String(t), "-i", input, "-vf", overlay, "-frames:v", "1", "-update", "1", out]);
    written.push(out);
  }
} else {
  const every = opt.every > 0 ? opt.every : 3;
  const n = Math.max(1, Math.ceil(duration / every));
  const cols = 4, rows = Math.ceil(n / cols);
  const out = join(outDir, `${stem}-planche-safe.png`);
  run(FFMPEG, ["-v", "error", "-y", "-i", input, "-vf", `fps=1/${every},${overlay},scale=270:-2,tile=${cols}x${rows}`,
    "-frames:v", "1", "-update", "1", out]);
  written.push(out);
  console.log(`${n} vignettes (une toutes les ${every} s sur ${duration.toFixed(1)} s), grille ${cols}×${rows}`);
}
console.log(`safe zone sur ${W}×${H} : rouge = interface, vert = safe zone, cyan = yeux à 38 %, jaune = ligne de sous-titre (04)`);
for (const f of written) console.log(f);
