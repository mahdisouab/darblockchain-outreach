#!/usr/bin/env node
/**
 * Paquet Premiere Pro (FCP7 XML / xmeml v4) construit depuis la composition — version 26-09-09.
 *
 *   node tools/premiere.mjs              # tout : clips alpha, détourage, SRT, XML, README
 *   node tools/premiere.mjs --no-encode  # ne ré-encode rien, réécrit XML / SRT / README
 *
 * Entrées (toutes lues dans index.html, jamais devinées) :
 *   SEG, CUTS, EYES (ligne des yeux par plan), N1 / N2 / STRONG_SCALE / DRIFT, STRONG (plans forts),
 *   les appels step(src, niveau), dimW(a, b), CAPS, les <audio> (voix + SFX, temps montés)
 *   renders/premiere/png/<couche>/   séquences PNG RGBA rendues à 25 i/s par carte d'isolation
 *   assets/edit-cutout.webm          le détourage (timeline montée)
 *   premiere/media/                  rush.mp4, voix.wav, sfx/*.wav, dim-25pct.png, reference-master-v1.mp4
 *
 * Le zoom du format (un pas à chaque coupe + dérive continue +2 % par plan) devient des images clés
 * Échelle / Position sur l'effet Trajectoire de V1 et V4 (interpolation linéaire, comme la composition).
 * transform-origin 50% 0% → Position = (540, EYE_TARGET + (960 − EYE_plan) × échelle).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const FPS = 25, W = 1080, H = 1920, EYE_TARGET = 732;
const NO_ENCODE = process.argv.includes("--no-encode");
const ROOT = process.cwd();
/* la version = celle du master le plus récent dans renders/ (v2 (10/09) : plus de "v1" codé en dur) */
const VERSION = (fs.readdirSync(path.join(ROOT, "renders")).filter((f) => /-master\.mp4$/.test(f)).map((f) => ({ f, t: fs.statSync(path.join(ROOT, "renders", f)).mtimeMs })).sort((x, y) => y.t - x.t)[0]?.f.match(/(v\d+)-master/)?.[1]) || "v1";
const OUT = path.join(ROOT, "premiere");
const MEDIA = path.join(OUT, "media");
const PNG = path.join(ROOT, "renders", "premiere", "png");
fs.mkdirSync(MEDIA, { recursive: true });

const src = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const need = (re, what) => { const m = src.match(re); if (!m) throw new Error("introuvable dans index.html : " + what); return m; };

/* ---------- l'EDL et le cadrage, lus dans la composition ---------- */
const SEG = JSON.parse(need(/const SEG = (\[\[[\s\S]*?\]\]);/, "SEG")[1]);
const CUTS = JSON.parse(need(/const CUTS = (\[[\s\S]*?\]);/, "CUTS")[1]);
if (CUTS.length) throw new Error("CUTS non vide : non géré par ce script");
const EYES = JSON.parse(need(/const EYES = (\[[\s\S]*?\]);/, "EYES")[1]);
if (EYES.length !== SEG.length) throw new Error("EYES et SEG n ont pas la meme longueur");
const lv = need(/const N1 = ([0-9.]+), N2 = ([0-9.]+), STRONG_SCALE = ([0-9.]+), DRIFT = ([0-9.]+);/, "niveaux de zoom");
const N1 = +lv[1], N2 = +lv[2], STRONG_SCALE = +lv[3], DRIFT = +lv[4];
/* STRONG : `new Set([indices])` (v1) ou `new Set([temps source].map(planOf))` (v2, robuste aux changements d EDL) */
const strongM = need(/const STRONG = new Set\((\[[^\]]*\])(\.map\(planOf\))?\)/, "STRONG");
const NAMED = { N1, N2, STRONG_SCALE };

const starts = []; let acc = 0;
for (const [a, b] of SEG) { starts.push(acc); acc += b - a; }
const DUR = +acc.toFixed(3);
function ed(t) {
  for (let i = 0; i < SEG.length; i++) {
    const [a, b] = SEG[i];
    if (t >= a - 0.01 && t <= b + 0.01) return +(starts[i] + Math.min(Math.max(t, a), b) - a).toFixed(3);
  }
  return null;
}
function planOf(t) { for (let i = 0; i < SEG.length; i++) if (t >= SEG[i][0] - 0.01 && t <= SEG[i][1] + 0.01) return i; throw new Error("hors EDL : " + t); }
const STRONG = new Set(strongM[2] ? JSON.parse(strongM[1]).map(planOf) : JSON.parse(strongM[1]));
const S = (t) => { const e = ed(t); if (e === null) throw new Error("hors EDL : " + t); return e; };
const F = (t) => Math.round(t * FPS);
const NF = F(DUR);

/* pas de zoom à l'intérieur d'un plan : step(src, niveau) dans la composition */
const steps = [];
for (const m of src.matchAll(/\bstep\(([0-9.]+),\s*([A-Z0-9_]+)\)/g)) {
  const scale = NAMED[m[2]]; if (scale === undefined) throw new Error("niveau inconnu dans step() : " + m[2]);
  steps.push({ src: +m[1], t: S(+m[1]), plan: planOf(+m[1]), scale });
}
steps.sort((x, y) => x.t - y.t);

/* les morceaux du rush : un par plan, coupé en plus à chaque step ; échelle de début et de fin
   (dérive linéaire +2 % sur le plan, ou depuis le step jusqu'à la fin du plan, comme la composition) */
const levelOf = (i) => (STRONG.has(i) ? STRONG_SCALE : (i % 2 === 0 ? N1 : N2));
const pieces = [];
SEG.forEach(([a, b], i) => {
  const e0 = starts[i], e1 = starts[i] + (b - a), base = levelOf(i);
  const inner = steps.filter((s) => s.plan === i && s.t > e0 + 1e-6 && s.t < e1 - 1e-6);
  const cuts = [e0, ...inner.map((s) => s.t), e1];
  for (let k = 0; k < cuts.length - 1; k++) {
    const t0 = cuts[k], t1 = cuts[k + 1];
    /* la dérive en cours sur ce morceau : depuis le début du plan (base) ou depuis le step */
    const from = k === 0 ? { t: e0, scale: base, drifts: (e1 - e0) >= 0.9 } : { t: inner[k - 1].t, scale: inner[k - 1].scale, drifts: (e1 - inner[k - 1].t) >= 0.6 };
    const sAt = (t) => from.drifts ? from.scale * (1 + (DRIFT - 1) * (t - from.t) / (e1 - from.t)) : from.scale;
    const s0 = sAt(t0), s1 = sAt(t1);
    const py = (s) => +(EYE_TARGET + (H / 2 - EYES[i]) * s).toFixed(2);
    pieces.push({ plan: i + 1, srcIn: a + (t0 - e0), srcOut: a + (t1 - e0), edIn: t0, edOut: t1, s0, s1, posX: W / 2, y0: py(s0), y1: py(s1), strong: STRONG.has(i) || k > 0 });
  }
});

/* v2 (10/09, retour du créateur sur l'export) : pendant une scène plein écran, le groupe « lui » (rush +
   détourage) disparaît dans la composition (takeover(sel, a, b) : sortie 0,28 s à a, retour à b − 0,1).
   Les morceaux de V1/V4 sont coupés sur ces plages ; le fond texturé (piste du bas) apparaît dessous. */
const takeovers = [...src.matchAll(/\btakeover\("#[\w-]+",\s*([0-9.]+),\s*([0-9.]+)/g)].map((m) => [S(+m[1]), S(+m[2]) - 0.1]);
{
  const cut = [];
  for (const p of pieces) {
    let parts = [[p.edIn, p.edOut]];
    for (const [ra, rb] of takeovers) {
      const next = [];
      for (const [x, y] of parts) {
        if (rb <= x || ra >= y) { next.push([x, y]); continue; }
        if (ra > x) next.push([x, ra]);
        if (rb < y) next.push([rb, y]);
      }
      parts = next;
    }
    const sAt = (t) => p.s0 + (p.s1 - p.s0) * ((t - p.edIn) / Math.max(1e-6, p.edOut - p.edIn));
    const py = (s) => +(EYE_TARGET + (H / 2 - EYES[p.plan - 1]) * s).toFixed(2);
    for (const [x, y] of parts) {
      if (y - x < 1 / FPS) continue;
      const s0 = sAt(x), s1 = sAt(y);
      cut.push({ ...p, edIn: x, edOut: y, srcIn: p.srcIn + (x - p.edIn), srcOut: p.srcIn + (y - p.edIn), s0, s1, y0: py(s0), y1: py(s1) });
    }
  }
  pieces.length = 0; pieces.push(...cut);
}

/* dim : 25 % de noir sur la vidéo pendant les beats AUTOUR (fondus 0,25 s) ; les dimW(x, null) se
   ferment par un tl.to explicite dans la composition, retrouvé ici par le temps source qui suit */
/* v2 (10/09) : les fermetures explicites `tl.to("#dim", { opacity: 0, … }, S(t) - 0.25)` sont lues dans
   la composition (plus de table codée en dur : elle cassait dès que l'EDL bougeait) ; un dimW(x, null)
   prend la première fermeture qui le suit, sinon la fin */
const closes = [...src.matchAll(/tl\.to\("#dim",\s*\{\s*opacity:\s*0\b[^}]*\},\s*S\(([0-9.]+)\)\s*-\s*[0-9.]+\)/g)].map((m) => +m[1]).sort((x, y) => x - y);
const dims = [];
for (const m of src.matchAll(/\bdimW\(([0-9.]+),\s*(null|[0-9.]+)\)/g)) {
  const x = +m[1];
  const close = m[2] === "null" ? closes.find((c) => c > x) : +m[2];
  dims.push({ a: S(x), b: close === undefined ? DUR : S(close) });
}

/* sous-titres (mode arabe, texte tel quel ; l'étoile = mot jaune) */
const capsRaw = need(/const CAPS = (\[[\s\S]*?\n\s*\]);/, "CAPS")[1];
const CAPS = new Function("return " + capsRaw)().map(([t, txt]) => ({ src: t, t: ed(t), text: txt })).filter((c) => c.t !== null);
/* fin du dernier sous-titre : le fondu explicite `tl.to(cap, { autoAlpha: 0, … }, S(t) - 0.15)` s'il existe, sinon la fin */
const capEndM = src.match(/tl\.to\(cap,\s*\{\s*autoAlpha:\s*0\b[^}]*\},\s*S\(([0-9.]+)\)\s*-\s*[0-9.]+\)/);
const capEnd = capEndM ? S(+capEndM[1]) : DUR;
CAPS.forEach((c, i) => { c.end = i + 1 < CAPS.length ? CAPS[i + 1].t : capEnd; });

/* audio : la voix et chaque SFX, aux temps montés déjà calculés par tools/sfx.mjs */
const audios = [];
for (const m of src.matchAll(/<audio [^>]*>/g)) {
  const tag = m[0];
  const g = (k) => { const r = tag.match(new RegExp("(?:^|\\s)" + k + "=\"([^\"]*)\"")); return r ? r[1] : null; };
  audios.push({ id: g("id"), src: g("src"), start: +g("data-start"), dur: +g("data-duration"), vol: +(g("data-volume") || 1) });
}
const voice = audios.find((a) => a.id === "voix");
if (!voice) throw new Error("balise <audio id=\"voix\"> introuvable");
const sfx = audios.filter((a) => a.id !== "voix");

/* ---------- outils ffmpeg ---------- */
function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 1 << 30, ...opts });
  if (r.status !== 0) throw new Error(cmd + " " + args.slice(0, 6).join(" ") + " …\n" + (r.stderr || "").slice(-2000));
  return r.stdout;
}
function probeSeconds(file) { return +run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).trim(); }
function probeFps(file) {
  const s = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", file]).trim();
  const [n, d] = s.split("/").map(Number); return n / (d || 1);
}
function pngSeq(dir) {
  const files = fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith(".png")).sort();
  if (!files.length) throw new Error("aucune image PNG dans " + dir);
  const m = files[0].match(/^(.*?)(\d+)\.png$/i);
  if (!m) throw new Error("nom de séquence PNG inattendu : " + files[0]);
  return { pattern: path.join(dir, `${m[1]}%0${m[2].length}d.png`), first: +m[2], count: files.length };
}
/* plages de frames où la couche est visible (alpha max ≥ seuil), fusionnées si l'écart est court */
function alphaRuns(dir, thr = 8, gapFrames = 12) {
  const seq = pngSeq(dir);
  const out = run("ffmpeg", ["-v", "error", "-framerate", String(FPS), "-start_number", String(seq.first), "-i", seq.pattern,
    "-vf", "alphaextract,signalstats,metadata=print:key=lavfi.signalstats.YMAX:file=-", "-f", "null", "-"]);
  const vis = [];
  let frame = -1;
  for (const line of out.split(/\r?\n/)) {
    const f = line.match(/^frame:(\d+)/); if (f) { frame = +f[1]; continue; }
    const y = line.match(/YMAX=([0-9.]+)/); if (y && frame >= 0) vis[frame] = +y[1] >= thr;
  }
  const runs = [];
  for (let i = 0; i < vis.length; i++) {
    if (!vis[i]) continue;
    if (runs.length && i - runs[runs.length - 1].b <= gapFrames) runs[runs.length - 1].b = i;
    else runs.push({ a: i, b: i });
  }
  return { seq, runs, total: seq.count };
}
function encodeProRes(seq, a, n, file) {
  if (fs.existsSync(file) || NO_ENCODE) return;
  run("ffmpeg", ["-y", "-v", "error", "-framerate", String(FPS), "-start_number", String(seq.first + a), "-i", seq.pattern,
    "-frames:v", String(n), "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", "-vendor", "apl0", file]);
}

/* ---------- les couches : un clip ProRes 4444 alpha par animation (temps SOURCE des débuts de beat) ---------- */
const LABELS = {
  around: [[4.66, "B1 avatars des etudiants"], [5.88, "B2 carte Claude coche"], [8.12, "B3 ChatGPT et les autres"], [11.15, "B4 NEW"],
    [14.96, "B5 carte Claude"], [34.88, "B9 carte texte etoile"], [39.16, "B11 mots qui s allument"], [44.71, "B12 chip PFE"],
    [46.47, "B13 devoir docx"], [55.66, "B15 badge danger"], [64.94, "B16 Claude croix coche ampoule"], [67.69, "B17 parties reformulations"],
    [74.75, "B18 livrer declarer"], [82.86, "B19 doc compris"], [87.42, "B20 doc IA questions"], [92.13, "B21 badge pire cas"],
    [96.46, "B22 devoir et prof"], [105.82, "B24 la question"], [112.77, "B26 projets PFE"], [115.72, "B27 implication famille"],
    [119.52, "B27 checklist"], [124.40, "B27 declaration universites"], [127.46, "B28 mascotte"]],
  takeover: [[17.61, "T1 preuve Anthropic"], [26.14, "T2 exemple Gemini"], [49.62, "T3 copier coller"], [56.32, "T4 Help Center et detecteur"]],
  foot: [[17.61, "source anthropic"], [78.30, "3ASR JDID"], [107.94, "bulle points"], [125.66, "universites"]],
  behind: [[2.48, "point d exclamation"], [16.31, "WATERMARK"], [24.56, "point d interrogation"], [38.24, "INVISIBLE"], [127.46, "halo"]],
};
const layerClips = {};
for (const layer of Object.keys(LABELS)) {
  const dir = path.join(PNG, layer);
  if (!fs.existsSync(dir)) { console.warn("(couche absente : " + layer + ")"); layerClips[layer] = []; continue; }
  const { seq, runs: raw } = alphaRuns(dir);
  /* deux beats qui se touchent forment une seule plage visible : on coupe au début du beat suivant */
  const runs = [];
  for (const r of raw) {
    const inside = LABELS[layer].map(([srcT]) => ed(srcT)).filter((e) => e !== null).map((e) => F(e)).filter((f) => f > r.a + 3 && f < r.b - 3).sort((x, y) => x - y);
    let a = r.a;
    for (const f of inside) { runs.push({ a, b: f - 1 }); a = f; }
    runs.push({ a, b: r.b });
  }
  const clips = [];
  let prevEnd = -1;
  runs.forEach((r, i) => {
    const a = Math.max(0, r.a - 1, prevEnd), b = Math.min(seq.count - 1, r.b + 2);
    prevEnd = b + 1;
    const t0 = a / FPS;
    let label = "";
    for (const [srcT, lab] of LABELS[layer]) { const e = ed(srcT); if (e !== null && e >= t0 - 0.8 && e <= (b + 1) / FPS + 0.2) { label = lab; break; } }
    const name = `${layer}-${String(i + 1).padStart(2, "0")}-${(label || "clip").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
    const file = path.join(MEDIA, name + ".mov");
    encodeProRes(seq, a, b - a + 1, file);
    clips.push({ file, name: (label || name) + ` (${t0.toFixed(2)} s)`, a, n: b - a + 1 });
  });
  layerClips[layer] = clips;
  console.log(`${layer}: ${clips.length} clip(s) — ${clips.map((c) => (c.n / FPS).toFixed(1) + "s").join(", ")}`);
}
/* sous-titres : un seul fichier pleine longueur, découpé en items par groupe */
const capDir = path.join(PNG, "captions");
const capFile = path.join(MEDIA, "captions.mov");
if (fs.existsSync(capDir)) { const seq = pngSeq(capDir); encodeProRes(seq, 0, seq.count, capFile); }
/* le détourage : timeline montée, pleine longueur */
const cutFile = path.join(MEDIA, "cutout.mov");
if (!fs.existsSync(cutFile) && !NO_ENCODE) {
  run("ffmpeg", ["-y", "-v", "error", "-c:v", "libvpx-vp9", "-i", path.join(ROOT, "assets", "edit-cutout.webm"),
    "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", "-vendor", "apl0", cutFile]);
}

/* ---------- XML ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function pathurl(file) {
  const abs = path.resolve(file).replace(/\\/g, "/");
  return "file://localhost/" + abs.split("/").map((seg) => encodeURIComponent(seg)).join("/");
}
const files = new Map();
let fileN = 0, clipN = 0;
function fileRef(file, kind, extra = {}) {
  const abs = path.resolve(file);
  if (files.has(abs)) return { id: files.get(abs).id, first: false, meta: files.get(abs).meta };
  const id = "file-" + (++fileN);
  const meta = { seconds: 0, fps: FPS, frames: 0, rate: FPS };
  if (kind === "still") { meta.frames = 250 * 60; }
  else if (extra.frames) { meta.frames = extra.frames; meta.seconds = extra.frames / FPS; }
  else {
    meta.seconds = probeSeconds(abs);
    if (kind === "video") { meta.fps = probeFps(abs); meta.rate = Math.round(meta.fps); meta.frames = Math.round(meta.seconds * meta.fps); }
    else { meta.frames = Math.round(meta.seconds * FPS); }
  }
  const mediaXml = kind === "audio"
    ? `<media><audio><samplecharacteristics><depth>16</depth><samplerate>${extra.samplerate || 48000}</samplerate></samplecharacteristics><channelcount>${extra.channels || 2}</channelcount></audio></media>`
    : `<media><video><samplecharacteristics><rate><timebase>${meta.rate}</timebase><ntsc>FALSE</ntsc></rate><width>${W}</width><height>${H}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics></video>${extra.audio ? `<audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>2</channelcount></audio>` : ""}</media>`;
  const xml = `<file id="${id}"><name>${esc(path.basename(abs))}</name><pathurl>${esc(pathurl(abs))}</pathurl><rate><timebase>${meta.rate}</timebase><ntsc>FALSE</ntsc></rate><duration>${meta.frames}</duration>${mediaXml}</file>`;
  files.set(abs, { id, meta });
  return { id, first: true, xml, meta };
}
const rateXml = `<rate><timebase>${FPS}</timebase><ntsc>FALSE</ntsc></rate>`;
/* Trajectoire avec images clés (Échelle et Position) aux points d'entrée et de sortie du morceau ;
   <when> est en images du média (même domaine que <in>/<out>) */
function motionXml({ s0, s1, posX, y0, y1, inF, outF }) {
  const cx = ((posX - W / 2) / W).toFixed(6);
  const vert = (y) => ((y - H / 2) / H).toFixed(6);
  const scaleKeys = s0 === s1
    ? `<value>${(s0 * 100).toFixed(3)}</value>`
    : `<keyframe><when>${inF}</when><value>${(s0 * 100).toFixed(3)}</value></keyframe><keyframe><when>${outF}</when><value>${(s1 * 100).toFixed(3)}</value></keyframe>`;
  const centerKeys = y0 === y1
    ? `<value><horiz>${cx}</horiz><vert>${vert(y0)}</vert></value>`
    : `<keyframe><when>${inF}</when><value><horiz>${cx}</horiz><vert>${vert(y0)}</vert></value></keyframe><keyframe><when>${outF}</when><value><horiz>${cx}</horiz><vert>${vert(y1)}</vert></value></keyframe>`;
  return `<filter><effect><name>Basic Motion</name><effectid>basic</effectid><effectcategory>motion</effectcategory><effecttype>motion</effecttype><mediatype>video</mediatype>` +
    `<parameter><parameterid>scale</parameterid><name>Scale</name><valuemin>0</valuemin><valuemax>1000</valuemax>${scaleKeys}</parameter>` +
    `<parameter><parameterid>rotation</parameterid><name>Rotation</name><valuemin>-8640</valuemin><valuemax>8640</valuemax><value>0</value></parameter>` +
    `<parameter><parameterid>center</parameterid><name>Center</name>${centerKeys}</parameter>` +
    `<parameter><parameterid>centerOffset</parameterid><name>Anchor Point</name><value><horiz>0</horiz><vert>0</vert></value></parameter>` +
    `</effect></filter>`;
}
function opacityXml(keys) {
  return `<filter><effect><name>Opacity</name><effectid>opacity</effectid><effectcategory>motion</effectcategory><effecttype>motion</effecttype><mediatype>video</mediatype>` +
    `<parameter><parameterid>opacity</parameterid><name>opacity</name><valuemin>0</valuemin><valuemax>100</valuemax>` +
    keys.map(([f, v]) => `<keyframe><when>${f}</when><value>${v}</value></keyframe>`).join("") + `</parameter></effect></filter>`;
}
function levelXml(v) {
  return `<filter><effect><name>Audio Levels</name><effectid>audiolevels</effectid><effectcategory>audiolevels</effectcategory><effecttype>audiolevels</effecttype><mediatype>audio</mediatype>` +
    `<parameter><parameterid>level</parameterid><name>Level</name><valuemin>0</valuemin><valuemax>3.98109</valuemax><value>${v}</value></parameter></effect></filter>`;
}
function vclip({ name, file, kind, start, end, inF, outF, filters = "", enabled = true, label = "Iris", extra = {} }) {
  const f = fileRef(file, kind, extra);
  const id = "clipitem-" + (++clipN);
  return `<clipitem id="${id}"><name>${esc(name)}</name><enabled>${enabled ? "TRUE" : "FALSE"}</enabled><duration>${f.meta.frames}</duration>${rateXml}` +
    `<start>${start}</start><end>${end}</end><in>${inF}</in><out>${outF}</out>` +
    (f.first ? f.xml : `<file id="${f.id}"/>`) + filters +
    `<sourcetrack><mediatype>video</mediatype><trackindex>1</trackindex></sourcetrack><compositemode>Normal</compositemode><labels><label2>${label}</label2></labels></clipitem>`;
}
function aclip({ name, file, start, end, inF, outF, level = 1, enabled = true, label = "Cerulean", extra = {} }) {
  const f = fileRef(file, "audio", extra);
  const id = "clipitem-" + (++clipN);
  return `<clipitem id="${id}"><name>${esc(name)}</name><enabled>${enabled ? "TRUE" : "FALSE"}</enabled><duration>${f.meta.frames}</duration>${rateXml}` +
    `<start>${start}</start><end>${end}</end><in>${inF}</in><out>${outF}</out>` +
    (f.first ? f.xml : `<file id="${f.id}"/>`) + (level !== 1 ? levelXml(level) : "") +
    `<sourcetrack><mediatype>audio</mediatype><trackindex>1</trackindex></sourcetrack><labels><label2>${label}</label2></labels></clipitem>`;
}
const track = (items, enabled = true) => `<track>${items.join("")}<enabled>${enabled ? "TRUE" : "FALSE"}</enabled><locked>FALSE</locked></track>`;

const V = [];
/* V1 · le rush, plan par plan (+ un morceau par pas de zoom), Trajectoire = cadrage du format 04 + zoom */
/* v2 (10/09) : les médias de base se préparent ici, plus à la main (le paquet v2 a cassé dessus) :
   le rush, la voix montée en WAV 48 kHz, les SFX du projet, le voile PNG et le master de référence */
{
  const rushSrc = path.join(ROOT, "assets", "rush.mp4");
  if (!fs.existsSync(path.join(MEDIA, "rush.mp4")) && fs.existsSync(rushSrc)) fs.copyFileSync(rushSrc, path.join(MEDIA, "rush.mp4"));
  const voiceSrc = path.join(ROOT, "assets", "voix.m4a");
  if (!fs.existsSync(path.join(MEDIA, "voix.wav")) && fs.existsSync(voiceSrc) && !NO_ENCODE) run("ffmpeg", ["-y", "-v", "error", "-i", voiceSrc, "-ar", "48000", "-c:a", "pcm_s16le", path.join(MEDIA, "voix.wav")]);
  const sfxSrc = path.join(ROOT, "assets", "sfx");
  if (fs.existsSync(sfxSrc)) { fs.mkdirSync(path.join(MEDIA, "sfx"), { recursive: true }); for (const f of fs.readdirSync(sfxSrc)) if (f.endsWith(".wav") && !fs.existsSync(path.join(MEDIA, "sfx", f))) fs.copyFileSync(path.join(sfxSrc, f), path.join(MEDIA, "sfx", f)); }
  /* noir OPAQUE : c'est l'effet Opacité du clip (25) qui fait le voile, pas la couche alpha du PNG */
  if (!fs.existsSync(path.join(MEDIA, "dim-25pct.png")) && !NO_ENCODE) run("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", `color=c=black:s=${W}x${H}:r=1`, "-frames:v", "1", "-pix_fmt", "rgb24", "-update", "1", path.join(MEDIA, "dim-25pct.png")]);
  const masterSrc = path.join(ROOT, "renders", `reel-${VERSION}-master.mp4`);
  if (!fs.existsSync(path.join(MEDIA, `reference-master-${VERSION}.mp4`)) && fs.existsSync(masterSrc)) fs.copyFileSync(masterSrc, path.join(MEDIA, `reference-master-${VERSION}.mp4`));
}
const rush = path.join(MEDIA, "rush.mp4");
/* V1 (piste du bas) · le fond noir texturé (.reel-bg) sur toute la séquence — c'est lui qu'on voit sous les
   scènes plein écran quand le rush et le détourage sont coupés (v2, 10/09) */
const bgPng = path.join(MEDIA, "bg.png");
if (!fs.existsSync(bgPng)) run("node", [path.join(ROOT, "tools", "bg-still.mjs"), bgPng]);
V.push(track([vclip({ name: "Fond noir texturé (.reel-bg)", file: bgPng, kind: "still", start: 0, end: NF, inF: 0, outF: NF, label: "Gray" })]));
const pieceName = (p, what) => `${what} · plan ${String(p.plan).padStart(2, "0")} · ${(p.s0 * 100).toFixed(0)}→${(p.s1 * 100).toFixed(0)} %`;
V.push(track(pieces.map((p) => {
  const inF = Math.round(p.srcIn * FPS), outF = Math.round(p.srcOut * FPS);
  return vclip({ name: pieceName(p, `Rush ${p.srcIn.toFixed(2)}-${p.srcOut.toFixed(2)}`), file: rush, kind: "video", start: F(p.edIn), end: F(p.edOut), inF, outF,
    filters: motionXml({ ...p, inF, outF }), label: "Iris" });
})));
/* V2 · dim (image fixe noire à 25 %, fondus 0,25 s en images clés) */
const dimPng = path.join(MEDIA, "dim-25pct.png");
V.push(track(dims.map(({ a, b }) => {
  const n = F(b) - F(a); const ramp = Math.min(6, Math.floor(n / 3));
  return vclip({ name: `dim 25 % · ${a.toFixed(2)}-${b.toFixed(2)}`, file: dimPng, kind: "still", start: F(a), end: F(b), inF: 0, outF: n,
    /* v2 (10/09) : le PNG est un noir OPAQUE (rgb24) — l'opacité monte à 25, pas à 100 (à 100 c'était un noir total sous le détourage) */
    filters: opacityXml([[0, 0], [ramp, 25], [n - ramp, 25], [n, 0]]), label: "Gray" });
})));
/* V3 · derrière lui */
const clipsOf = (layer, label) => layerClips[layer].map((c) => vclip({
  name: c.name, file: c.file, kind: "video", start: c.a, end: c.a + c.n, inF: 0, outF: c.n, label, extra: { frames: c.n } }));
V.push(track(clipsOf("behind", "Lavender")));
/* V4 · le détourage (lui), même découpe et même Trajectoire que V1 (fichier en timeline montée) */
const cut = fs.existsSync(cutFile) ? cutFile : null;
V.push(track(cut ? pieces.map((p) => {
  const inF = F(p.edIn), outF = F(p.edOut);
  return vclip({ name: pieceName(p, "Détourage"), file: cut, kind: "video", start: inF, end: outF, inF, outF,
    filters: motionXml({ ...p, inF, outF }), label: "Caribbean" });
}) : []));
/* V5 autour · V6 plein écran · V7 pied · V8 sous-titres */
V.push(track(clipsOf("around", "Forest")));
V.push(track(clipsOf("takeover", "Rose")));
V.push(track(clipsOf("foot", "Mango")));
V.push(track(fs.existsSync(capFile) ? CAPS.map((c) => vclip({
  name: c.text.replace(/\*/g, ""), file: capFile, kind: "video", start: F(c.t), end: F(c.end), inF: F(c.t), outF: F(c.end), label: "Yellow" })) : []));
/* V9 · référence : le master, désactivé */
const ref = path.join(MEDIA, `reference-master-${VERSION}.mp4`);
const refMeta = { seconds: probeSeconds(ref), fps: probeFps(ref) };
V.push(track([vclip({ name: `RÉFÉRENCE master ${VERSION} (désactivé)`, file: ref, kind: "video", start: 0, end: NF, inF: 0, outF: Math.round(refMeta.seconds * refMeta.fps), enabled: false, label: "Tan", extra: { audio: true } })], false));

/* audio */
const A = [];
const voiceWav = path.join(MEDIA, "voix.wav");
A.push(track([aclip({ name: "Voix (montage)", file: voiceWav, start: 0, end: NF, inF: 0, outF: NF, label: "Violet" })]));
const lanes = [];
for (const s of [...sfx].sort((x, y) => x.start - y.start)) {
  const st = F(s.start), en = Math.max(st + 1, F(s.start + s.dur));
  let lane = lanes.find((l) => l.end <= st);
  if (!lane) { lane = { end: 0, items: [] }; lanes.push(lane); }
  lane.end = en;
  const wav = path.join(MEDIA, "sfx", path.basename(s.src));
  lane.items.push(aclip({ name: `${path.basename(s.src, ".wav")} ×${s.vol}`, file: wav, start: st, end: en, inF: 0, outF: en - st, level: s.vol, extra: { samplerate: 44100 } }));
}
for (const l of lanes) A.push(track(l.items));
A.push(track([aclip({ name: `RÉFÉRENCE master ${VERSION} (désactivé)`, file: ref, start: 0, end: NF, inF: 0, outF: NF, enabled: false, label: "Tan" })], false));

const seqName = `reel-${VERSION}-premiere`;
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
<sequence id="sequence-1"><name>${seqName}</name><duration>${NF}</duration>${rateXml}
<timecode>${rateXml}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>
<media>
<video><format><samplecharacteristics>${rateXml}<width>${W}</width><height>${H}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance><colordepth>24</colordepth></samplecharacteristics></format>
${V.join("\n")}
</video>
<audio><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
${A.join("\n")}
</audio>
</media>
</sequence>
</xmeml>
`;
fs.writeFileSync(path.join(OUT, `${seqName}.xml`), xml);

/* ---------- SRT ---------- */
const tc = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, x = ms % 1000; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(x).padStart(3, "0")}`; };
fs.writeFileSync(path.join(OUT, "sous-titres.srt"), "﻿" + CAPS.map((c, i) => `${i + 1}\n${tc(c.t)} --> ${tc(c.end)}\n${c.text.replace(/\*/g, "")}\n`).join("\n") + "\n");

/* ---------- README ---------- */
const mb = (f) => fs.existsSync(f) ? (fs.statSync(f).size / 1048576).toFixed(0) + " Mo" : "absent";
const motionTable = pieces.map((p) => `| ${String(p.plan).padStart(2, "0")}${p.strong ? " ★" : ""} | ${p.edIn.toFixed(2)} → ${p.edOut.toFixed(2)} | ${p.srcIn.toFixed(2)} → ${p.srcOut.toFixed(2)} | ${(p.s0 * 100).toFixed(1)} → ${(p.s1 * 100).toFixed(1)} % | 540, ${p.y0} → ${p.y1} |`).join("\n");
const totalMo = fs.readdirSync(MEDIA).filter((n) => n.endsWith(".mov") || n.endsWith(".mp4") || n.endsWith(".wav")).reduce((s, n) => s + fs.statSync(path.join(MEDIA, n)).size, 0) / 1048576;
const readme = `# Paquet Premiere Pro — reel « Claude watermark » ${VERSION}

Séquence **1080×1920 · 25 i/s · ${DUR.toFixed(2)} s** (${NF} images), reconstruite depuis le montage
livré le 09/09/2026. Tout est dans ce dossier : \`${seqName}.xml\` et \`media/\` (${totalMo.toFixed(0)} Mo).

## Importer

1. Premiere Pro 2021 → **Fichier → Importer** → \`${seqName}.xml\` (format « Final Cut Pro XML »).
2. La séquence \`${seqName}\` apparaît dans le panneau Projet avec ses médias. Si Premiere
   signale des médias hors ligne (dossier déplacé) : clic droit → **Relier le média** → pointer
   sur \`premiere/media/\`, il retrouve le reste tout seul.
3. Garder les réglages de séquence proposés (1080×1920, 25 i/s). Exporter en 25 ou 30 i/s, au choix.

## Les pistes, de bas en haut

| Piste | Contenu | Ce que tu peux faire |
| --- | --- | --- |
| V1 | **le fond noir texturé** du reel, image fixe sur toute la séquence : c'est lui qu'on voit sous les scènes plein écran | ne pas toucher |
| V2 | **le rush**, ${SEG.length} plans (${pieces.length} morceaux avec les pas de zoom et les coupes des scènes plein écran), effet Trajectoire = cadrage du format 04 + le zoom à chaque coupe (images clés Échelle / Position) | rallonger / raccourcir / déplacer les coupes (tout le rush est disponible en poignées). Pendant une scène plein écran il est coupé, comme dans l'original |
| V3 | **dim** : noir opaque monté à 25 % d'opacité pendant les beats autour de toi, fondus 0,25 s | supprimer la piste si tu n'en veux pas |
| V4 | **derrière toi** : « ! », WATERMARK, « ? », INVISIBLE, le halo final (alpha) | déplacer, couper |
| V5 | **ton détourage** (alpha, même découpe et même Trajectoire que V2) | il doit suivre V2 : sélectionne les deux pistes quand tu ripples |
| V6 | **autour de toi** : ${layerClips.around.length} animations, un clip par beat (alpha) | déplacer chaque beat, le raccourcir, l'atténuer |
| V7 | **plein écran** : ${layerClips.takeover.length} scènes (alpha) | idem |
| V8 | **le pied** : ${layerClips.foot.length} éléments (alpha) | idem |
| V9 | **sous-titres** : ${CAPS.length} groupes, un item par groupe (alpha, arabe + latin, Garet + Cairo) | décaler un groupe ; pour réécrire le texte, importer \`sous-titres.srt\` dans l'outil Sous-titres de Premiere et masquer V9 |
| V10 | **référence** : le master ${VERSION} tel que livré (désactivé) | activer pour comparer image par image |
| A1 | **la voix** montée (48 kHz) | — |
| A2 → A${1 + lanes.length} | **les SFX**, ${sfx.length} clips avec leur gain d'origine | déplacer, baisser, supprimer un par un |
| A${2 + lanes.length} | référence audio du master (désactivé) | — |

Tout démarre à 00:00:00:00 ; rien n'est à recaler. Les clips d'animation sont des **vidéos avec
transparence** (ProRes 4444) : tu les déplaces, tu les coupes, tu les atténues, mais leur texte et
leurs courbes ne s'éditent pas dans Premiere (c'est de l'HTML/GSAP à l'origine). Pour changer un
texte dans une carte, demande-le et la couche est re-rendue.

## Le zoom (consigne du 09/09) dans Premiere

Chaque plan de V1 et V4 porte deux images clés Trajectoire : l'échelle monte de 2 % du début à la
fin du plan (dérive continue), et change d'un cran à chaque coupe (${(N1 * 100).toFixed(0)} % / ${(N2 * 100).toFixed(0)} % en
alternance, ${(STRONG_SCALE * 100).toFixed(0)} % sur les plans marqués ★). La position suit l'échelle pour que **les yeux restent
sur la ligne ${EYE_TARGET} px** : y = ${EYE_TARGET} + (960 − yeux du plan) × échelle, x = 540, point d'ancrage au centre.
Si l'import perd les images clés, les valeurs à retaper :

| Plan | Séquence (s) | Rush (s) | Échelle début → fin | Position (x, y) début → fin |
| --- | --- | --- | --- | --- |
${motionTable}

## Ce qui n'est pas dans le paquet

- Le fond graphique sous la vidéo (grille sombre) : la vidéo couvre tout le cadre. Fond noir suffit.
- Les mots jaunes des sous-titres : le SRT est en texte simple, la couche V8 garde le style.
- La voix est mono (canal gauche du fichier), comme à l'enregistrement.

## Fichiers

${fs.readdirSync(MEDIA).filter((n) => !fs.statSync(path.join(MEDIA, n)).isDirectory()).map((n) => `- \`media/${n}\` · ${mb(path.join(MEDIA, n))}`).join("\n")}
- \`media/sfx/\` · ${fs.readdirSync(path.join(MEDIA, "sfx")).length} sons du pack
`;
fs.writeFileSync(path.join(OUT, "README.md"), readme);
console.log(`XML : ${pieces.length} morceaux de rush · ${dims.length} dims · ${CAPS.length} sous-titres · ${sfx.length} SFX sur ${lanes.length} pistes · ${NF} images`);
console.log(`→ premiere/${seqName}.xml · sous-titres.srt · README.md`);

/* contrôle final (structure validée par le créateur le 10/09/2026) : fond en V1, rush et détourage coupés
   sur les scènes plein écran, voile ≤ 25 %, médias présents — un paquet refusé ne part pas */
{
  const chk = spawnSync(process.execPath, [path.join(ROOT, "tools", "premiere-check.mjs"), path.join(OUT, `${seqName}.xml`)], { encoding: "utf8" });
  process.stdout.write(chk.stdout || ""); process.stderr.write(chk.stderr || "");
  if (chk.status !== 0) process.exit(chk.status || 1);
}
