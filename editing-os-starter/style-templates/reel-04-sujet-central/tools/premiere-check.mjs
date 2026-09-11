#!/usr/bin/env node
/**
 * Contrôle du paquet Premiere AVANT envoi — la structure validée par le créateur le 10/09/2026
 * (son export Premiere du XML corrigé donnait le rendu attendu). Lit premiere/<seq>.xml et
 * index.html, et vérifie ce qui avait cassé la première fois :
 *   1. la piste du bas est le fond noir texturé, un seul clip, sur toute la séquence ;
 *   2. le rush et le détourage ont EXACTEMENT les mêmes trous, et ces trous sont les scènes
 *      plein écran de la composition (takeover(sel, a, b) → [S(a), S(b) − 0,1]) ;
 *   3. le voile (dim) ne monte jamais au-dessus de 25 % d'opacité (PNG opaque) ;
 *   4. chaque média référencé existe sur le disque.
 *   node tools/premiere-check.mjs [premiere/reel-v2-premiere.xml]
 * Sort avec le code 1 au premier écart : un paquet qui ne passe pas ne part pas.
 */
import fs from "node:fs";
import path from "node:path";
const FPS = 25, EPS = 2; // tolérance en images
const ROOT = process.cwd();
const xmlPath = process.argv[2] || fs.readdirSync(path.join(ROOT, "premiere")).filter((f) => f.endsWith("-premiere.xml")).map((f) => path.join(ROOT, "premiere", f)).sort().at(-1);
if (!xmlPath || !fs.existsSync(xmlPath)) { console.error("aucun XML dans premiere/"); process.exit(1); }
const xml = fs.readFileSync(xmlPath, "utf8");
const src = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const errs = [], oks = [];
const ok = (m) => oks.push("✓ " + m), ko = (m) => errs.push("✗ " + m);

/* l'EDL de la composition, pour projeter les temps source des takeovers */
const SEG = JSON.parse(src.match(/const SEG = (\[\[[\s\S]*?\]\]);/)[1]);
const starts = []; let acc = 0; for (const [a, b] of SEG) { starts.push(acc); acc += b - a; }
const ed = (t) => { for (let i = 0; i < SEG.length; i++) { const [a, b] = SEG[i]; if (t >= a - 0.01 && t <= b + 0.01) return starts[i] + Math.min(Math.max(t, a), b) - a; } return null; };
const takeovers = [...src.matchAll(/\btakeover\("#[\w-]+",\s*([0-9.]+),\s*([0-9.]+)/g)].map((m) => [Math.round(ed(+m[1]) * FPS), Math.round((ed(+m[2]) - 0.1) * FPS)]);
const NF = Math.round(acc * FPS);

/* les pistes vidéo, dans l'ordre du fichier (V1 = première) */
const seqVideo = xml.split("<sequence")[1].split("<audio>")[0];
const tracks = seqVideo.split("<track>").slice(1).map((t) => t.split("</track>")[0]).filter((t) => /<clipitem /.test(t));
const clips = (t) => [...t.matchAll(/<clipitem [^>]*><name>([^<]*)<\/name>[\s\S]*?<start>(\d+)<\/start><end>(\d+)<\/end>/g)].map((m) => ({ name: m[1], start: +m[2], end: +m[3] }));
const byName = (re) => tracks.find((t) => re.test(clips(t)[0]?.name || ""));
const gaps = (t) => { const c = clips(t).sort((x, y) => x.start - y.start); const g = []; for (let i = 1; i < c.length; i++) if (c[i].start > c[i - 1].end) g.push([c[i - 1].end, c[i].start]); return g; };

/* 1. le fond */
const bg = clips(tracks[0]);
if (bg.length === 1 && /fond/i.test(bg[0].name) && bg[0].start === 0 && Math.abs(bg[0].end - NF) <= EPS) ok(`V1 = fond texturé, un clip, 0 → ${(bg[0].end / FPS).toFixed(2)} s`);
else ko(`V1 doit être le fond texturé sur toute la séquence (trouvé : ${bg.length} clip(s) « ${bg[0]?.name} » ${bg[0]?.start}→${bg[0]?.end}, attendu 0→${NF})`);

/* 2. rush et détourage : mêmes trous = scènes plein écran */
const rushT = byName(/^Rush /), cutT = byName(/^Détourage/);
if (!rushT) ko("piste du rush introuvable"); if (!cutT) ko("piste du détourage introuvable");
if (rushT && cutT) {
  const gr = gaps(rushT), gc = gaps(cutT);
  const same = gr.length === gc.length && gr.every((g, i) => Math.abs(g[0] - gc[i][0]) <= EPS && Math.abs(g[1] - gc[i][1]) <= EPS);
  if (same) ok(`rush et détourage : ${gr.length} trou(s) identiques`); else ko(`rush (${gr.length} trous) et détourage (${gc.length} trous) ne sont pas découpés pareil`);
  const fmt = (g) => g.map(([a, b]) => `${(a / FPS).toFixed(2)}→${(b / FPS).toFixed(2)}`).join(" ");
  const match = gr.length === takeovers.length && takeovers.every((tk) => gr.some((g) => Math.abs(g[0] - tk[0]) <= EPS && Math.abs(g[1] - tk[1]) <= EPS));
  if (match) ok(`les trous sont les ${takeovers.length} scènes plein écran : ${fmt(gr)}`); else ko(`trous du rush ${fmt(gr)} ≠ scènes plein écran ${fmt(takeovers)}`);
  /* hors scènes, le rush couvre tout */
  const c = clips(rushT).sort((x, y) => x.start - y.start);
  if (c[0].start > EPS) ko(`le rush commence à ${c[0].start} images au lieu de 0`);
  if (Math.abs(c.at(-1).end - NF) > EPS) ko(`le rush finit à ${c.at(-1).end} images au lieu de ${NF}`);
}

/* 3. le voile : opacité ≤ 25 */
const dimT = byName(/^dim /);
if (dimT) {
  const vals = [...dimT.matchAll(/<parameterid>opacity<\/parameterid>[\s\S]*?<\/parameter>/g)].flatMap((m) => [...m[0].matchAll(/<value>(\d+)<\/value>/g)].map((v) => +v[1]));
  const max = Math.max(...vals);
  if (vals.length && max <= 25) ok(`voile : ${clips(dimT).length} clips, opacité max ${max}`); else ko(`voile : opacité max ${max} (attendu ≤ 25 sur un PNG opaque — à 100 c'est un noir total sous le détourage)`);
  const dimPng = path.join(ROOT, "premiere", "media", "dim-25pct.png");
  if (!fs.existsSync(dimPng)) ko("dim-25pct.png absent");
}

/* 4. les médias existent */
const urls = [...new Set([...xml.matchAll(/<pathurl>([^<]+)<\/pathurl>/g)].map((m) => decodeURIComponent(m[1].replace(/^file:\/\/localhost\//, ""))))];
const missing = urls.filter((u) => !fs.existsSync(u));
if (missing.length) ko(`${missing.length} média(s) manquant(s) : ${missing.slice(0, 3).join(", ")}`); else ok(`${urls.length} médias présents`);

for (const m of oks) console.log(m);
for (const m of errs) console.log(m);
console.log(errs.length ? `PAQUET REFUSÉ — ${errs.length} écart(s)` : "PAQUET OK — structure validée par le créateur le 10/09/2026");
process.exit(errs.length ? 1 : 0);
