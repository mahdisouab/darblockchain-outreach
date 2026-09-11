#!/usr/bin/env node
/**
 * Bords de coupe au décibel : pour chaque plan de l'EDL, le niveau max dans les 60 premières et
 * les 60 dernières millisecondes (sur le rush). Un bord au-dessus de HOT dB = une coupe posée
 * sur de la parole, donc un mot rogné : à corriger avant de baker. Complète blanks.mjs (qui ne
 * voit que les blancs restants) quand on serre les respirations.
 *   node tools/edges.mjs [assets/edl.json] [assets/rush.mp4] [--hot -30] [--win 0.06]
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
const pos = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const EDL = pos[0] || "assets/edl.json", SRC = pos[1] || "assets/rush.mp4";
const HOT = opt("--hot", -30), WIN = opt("--win", 0.06);
const seg = JSON.parse(readFileSync(EDL, "utf8")).seg;
function maxDb(t, d) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-ss", t.toFixed(3), "-t", d.toFixed(3), "-i", SRC, "-vn", "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" });
  const m = (r.stderr || "").match(/max_volume:\s*(-?[\d.]+)/);
  return m ? Number(m[1]) : null;
}
let hot = 0;
seg.forEach(([a, b], i) => {
  const inDb = maxDb(a, WIN), outDb = maxDb(Math.max(a, b - WIN), WIN);
  const flagIn = inDb !== null && inDb > HOT, flagOut = outDb !== null && outDb > HOT;
  if (flagIn || flagOut) hot++;
  console.log(`plan ${String(i + 1).padStart(2)} ${a.toFixed(2).padStart(7)} → ${b.toFixed(2).padStart(7)} · entrée ${String(inDb).padStart(6)} dB${flagIn ? " ◀ CHAUD" : ""} · sortie ${String(outDb).padStart(6)} dB${flagOut ? " ◀ CHAUD" : ""}`);
});
console.log(hot ? `${hot} bord(s) au-dessus de ${HOT} dB : déplacer la coupe ou élargir la respiration.` : `tous les bords sous ${HOT} dB : aucune coupe sur un mot.`);
