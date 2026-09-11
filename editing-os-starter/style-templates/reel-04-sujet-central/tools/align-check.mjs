#!/usr/bin/env node
// Calage de deux pistes audio : decalage (ms) entre A et B sur trois fenetres, par correlation
// des enveloppes (mono 8 kHz, enveloppe 5 ms, lags +/- 1 s). Sert a verifier qu'une voix
// re-traitee a l'exterieur (enhancer) est toujours a l'echantillon pres sur la voix montee.
//   node tools/align-check.mjs assets/voix.m4a "C:/.../voix-enhanced-v2.wav"
import { spawnSync } from "node:child_process";
const [A, B] = process.argv.slice(2);
const SR = 8000, HOP = 40; // 5 ms
function pcm(f) {
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", f, "-ac", "1", "-ar", String(SR), "-f", "s16le", "-acodec", "pcm_s16le", "-"], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error("ffmpeg " + f);
  const s = new Int16Array(r.stdout.buffer, r.stdout.byteOffset, Math.floor(r.stdout.length / 2));
  const env = new Float64Array(Math.floor(s.length / HOP));
  for (let i = 0; i < env.length; i++) { let acc = 0; for (let j = 0; j < HOP; j++) acc += Math.abs(s[i * HOP + j]); env[i] = acc / HOP; }
  return env;
}
const ea = pcm(A), eb = pcm(B);
console.log(`A ${(ea.length * HOP / SR).toFixed(3)} s · B ${(eb.length * HOP / SR).toFixed(3)} s`);
const maxLag = Math.round(1.0 * SR / HOP); // 1 s
function best(startSec, lenSec) {
  const s0 = Math.round(startSec * SR / HOP), n = Math.round(lenSec * SR / HOP);
  let bestLag = 0, bestC = -Infinity;
  for (let lag = -maxLag; lag <= maxLag; lag++) {
    let c = 0, na = 0, nb = 0;
    for (let i = 0; i < n; i++) { const a = ea[s0 + i] ?? 0, b = eb[s0 + i + lag] ?? 0; c += a * b; na += a * a; nb += b * b; }
    const r = c / (Math.sqrt(na * nb) || 1);
    if (r > bestC) { bestC = r; bestLag = lag; }
  }
  return { lagMs: bestLag * HOP / SR * 1000, r: bestC };
}
for (const [s, l] of [[0.5, 10], [45, 10], [88, 10]]) { const { lagMs, r } = best(s, l); console.log(`fenetre ${s}-${s + l} s : B en retard de ${lagMs.toFixed(1)} ms sur A (corr ${r.toFixed(3)})`); }
