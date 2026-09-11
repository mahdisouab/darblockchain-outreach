#!/usr/bin/env node
/**
 * Voix retraitée à l'extérieur (enhancer, qualité studio) faite sur la voix MONTÉE d'une version
 * précédente : on la recoupe pour le nouvel EDL sans repasser par le rush.
 *   Chaque plan du nouvel EDL (secondes source) est projeté sur la timeline montée de l'ancien
 *   EDL (ed_old), découpé dans le fichier amélioré, puis tout est concaténé → assets/voix.m4a.
 *   Préalable : les plans du nouvel EDL sont inclus dans ceux de l'ancien (coupes plus serrées,
 *   retraits en plus, jamais un raccord rouvert) — vérifié, sinon le script s'arrête.
 *   Calage à vérifier avant : node tools/align-check.mjs assets/voix.m4a <wav>  (0 ms attendu).
 *
 *   node tools/voice-from-enhanced.mjs <voix-amelioree.wav> assets/edl-v1.json [assets/edl.json] [--out assets/voix.m4a]
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
const args = process.argv.slice(2);
const out = (() => { const i = args.indexOf("--out"); return i >= 0 ? args[i + 1] : "assets/voix.m4a"; })();
const pos = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1] === "--out"));
const [WAV, OLD, NEW = "assets/edl.json"] = pos;
if (!WAV || !OLD || !existsSync(WAV)) { console.error("usage : node tools/voice-from-enhanced.mjs <wav> <edl-ancien.json> [edl-nouveau.json]"); process.exit(1); }
/* même grille que tools/bake.mjs (25 i/s) : sinon la voix dérive de quelques ms par plan */
const snap = (t) => Math.round(t * 25) / 25;
const oldSeg = JSON.parse(readFileSync(OLD, "utf8")).seg.map(([a, b]) => [snap(a), snap(b)]);
const newSeg = JSON.parse(readFileSync(NEW, "utf8")).seg.map(([a, b]) => [snap(a), snap(b)]);
const starts = []; let acc = 0; for (const [a, b] of oldSeg) { starts.push(acc); acc += b - a; }
const edOld = (s) => { for (let i = 0; i < oldSeg.length; i++) if (s >= oldSeg[i][0] - 0.011 && s <= oldSeg[i][1] + 0.011) return { t: starts[i] + (s - oldSeg[i][0]), i }; return null; };
const parts = [];
for (const [a, b] of newSeg) {
  const A = edOld(a), B = edOld(b);
  if (!A || !B || A.i !== B.i) { console.error(`plan ${a}-${b} hors de l'ancien EDL ou à cheval sur deux anciens plans : il faut repartir du rush`); process.exit(1); }
  parts.push([Math.max(0, A.t), B.t]);
}
/* 15 ms de fondu à chaque bord : aucun clic de raccord, et l'attaque d'un clap coupé ne bave pas */
const F = 0.015;
const filt = parts.map(([s, e], i) => `[0:a]atrim=${s.toFixed(4)}:${e.toFixed(4)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${F},afade=t=out:st=${Math.max(0, e - s - F).toFixed(4)}:d=${F}[a${i}]`).join(";") + ";" + parts.map((_, i) => `[a${i}]`).join("") + `concat=n=${parts.length}:v=0:a=1[out]`;
const r = spawnSync("ffmpeg", ["-y", "-v", "error", "-i", WAV, "-filter_complex", filt, "-map", "[out]", "-c:a", "aac", "-b:a", "192k", out], { encoding: "utf8" });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
const total = parts.reduce((t, [s, e]) => t + (e - s), 0);
console.log(`${parts.length} morceaux de la voix améliorée → ${out} (${total.toFixed(2)} s)`);
