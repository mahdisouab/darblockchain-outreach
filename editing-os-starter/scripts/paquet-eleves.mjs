#!/usr/bin/env node
// Le paquet pour les élèves (et les amis) : reconstruit l'archive du workspace depuis une
// LISTE BLANCHE (scripts/lib/paquet.mjs) et refuse de la produire si un chemin machine,
// une clé, un email ou un nom personnel s'y est glissé, ou si un média dépasse 6 Mo.
//
//   node scripts/paquet-eleves.mjs           # contrôle seul, rien n'est écrit
//   node scripts/paquet-eleves.mjs --zip     # + dist-eleves/editing-os-starter.zip et MANIFESTE.txt
//   node scripts/paquet-eleves.mjs --liste   # affiche chaque fichier embarqué (+) et écarté (-)
//
// L'archive sort de « git archive » sur un index temporaire : les droits d'exécution des
// `.command` et `.sh` y sont posés, donc conservés jusqu'au Mac qui décompresse — une
// compression classique faite sous Windows les perd. Les fins de ligne suivent
// .gitattributes (`.sh` en LF, `.bat` en CRLF) quelle que soit la machine qui construit.
// Mesuré le 11/09 : lancé depuis un sous-dossier du dépôt, git archive évalue les attributs
// sur des chemins relatifs au sous-arbre et ne trouve donc jamais le .gitattributes du
// dossier (ni dans l'index, ni avec --worktree-attributes) ; avec core.autocrlf=true tout
// partait en CRLF, bash compris. D'où : le .gitattributes du dossier passé en
// core.attributesFile le temps de l'archive, et core.autocrlf=false pour ne convertir que
// ce que les attributs demandent. Les noms à bannir viennent de `.paquet-noms` (jamais
// embarqué) et de l'identité git.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LISTE_BLANCHE, EXEMPTS_NOMS, controlerTaille, controlerTexte, estBinaireParExtension,
  estTexte, filtrerChemins, lireNoms,
} from "./lib/paquet.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOM = "editing-os-starter";
const DIST = path.join(ROOT, "dist-eleves");
const ARGS = new Set(process.argv.slice(2));
const ZIP = ARGS.has("--zip");
const LISTE = ARGS.has("--liste");
const MAX_PROBLEMES_AFFICHES = 60;

function git(args, { env, input } = {}) {
  const r = spawnSync("git", args, {
    cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, ...env }, input,
  });
  if (r.error) throw r.error;
  const commande = args.find((a, i) => a !== "-c" && args[i - 1] !== "-c");
  if (r.status !== 0) throw new Error(`git ${commande} : ${(r.stderr || "").trim() || `code ${r.status}`}`);
  return r.stdout;
}

function gitFacultatif(args) {
  const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : "";
}

const mo = (octets) => `${(octets / 1048576).toFixed(1)} Mo`;

function main() {
  // 1. Un dépôt git autour du dossier : git archive en a besoin, et le .gitignore fait
  //    le premier tri (rendus, médias, node_modules, models, caches, .env). Le dossier
  //    peut être la racine du dépôt ou un sous-dossier : toutes les commandes tournent
  //    depuis ROOT, et git archive se limite de lui-même au sous-arbre courant.
  if (!gitFacultatif(["rev-parse", "--show-toplevel"])) {
    console.error(`Ce dossier n'est pas dans un dépôt git. Le paquet sort de « git archive » : un « git init » à la racine de ${NOM} suffit.`);
    process.exit(2);
  }

  // 2. La liste blanche : fichiers suivis + non suivis non ignorés, sous chaque entrée.
  const entrees = LISTE_BLANCHE.filter((e) => existsSync(path.join(ROOT, e)));
  for (const e of LISTE_BLANCHE) if (!entrees.includes(e)) console.warn(`!! absent, ignoré : ${e}`);
  const listes = git(["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", ...entrees])
    .split("\0").filter(Boolean);
  const uniques = [...new Set(listes)].filter((f) => existsSync(path.join(ROOT, f))).sort();
  const { gardes, ecartes } = filtrerChemins(uniques);

  // 3. Les noms à bannir.
  const fichierNoms = path.join(ROOT, ".paquet-noms");
  const noms = lireNoms(existsSync(fichierNoms) ? readFileSync(fichierNoms, "utf8") : "", {
    userName: gitFacultatif(["config", "user.name"]),
    email: gitFacultatif(["config", "user.email"]),
    remote: gitFacultatif(["remote", "get-url", "origin"]),
  });

  // 4. Tous les contrôles avant d'écrire quoi que ce soit.
  const problemes = [];
  let octets = 0;
  for (const f of gardes) {
    const abs = path.join(ROOT, f);
    const taille = statSync(abs).size;
    octets += taille;
    const trop = controlerTaille(f, taille);
    if (trop) problemes.push(trop);
    if (estBinaireParExtension(f)) continue;
    const buf = readFileSync(abs);
    if (!estTexte(buf)) continue;
    problemes.push(...controlerTexte(f, buf.toString("utf8"), noms));
  }

  if (LISTE) {
    for (const f of gardes) console.log(`  + ${f}`);
    for (const f of ecartes) console.log(`  - ${f}`);
  }
  console.log(`${gardes.length} fichiers, ${mo(octets)} ; ${ecartes.length} écarté(s) par les motifs interdits.`);
  console.log(`Noms bannis : ${noms.length} (.paquet-noms + identité git) ; exempté du contrôle des noms : ${EXEMPTS_NOMS.join(", ")}.`);

  if (problemes.length) {
    console.error(`\nPaquet refusé : ${problemes.length} problème(s).`);
    for (const p of problemes.slice(0, MAX_PROBLEMES_AFFICHES)) {
      console.error(`  ${p.type.padEnd(15)} ${p.chemin}${p.ligne ? ":" + p.ligne : ""}  ${p.extrait}`);
    }
    if (problemes.length > MAX_PROBLEMES_AFFICHES) console.error(`  … et ${problemes.length - MAX_PROBLEMES_AFFICHES} de plus`);
    process.exit(1);
  }
  console.log("Contrôles OK : aucun chemin machine, aucune clé, aucun email, aucun nom hors corpus, aucun média de plus de 6 Mo.");
  if (!ZIP) {
    console.log("Rien n'est écrit sans --zip.");
    return;
  }

  // 5. L'archive : index temporaire → droits +x → arbre → git archive.
  mkdirSync(DIST, { recursive: true });
  const tmp = mkdtempSync(path.join(tmpdir(), "paquet-"));
  const env = { GIT_INDEX_FILE: path.join(tmp, "index") };
  try {
    // autocrlf=input : les blobs sont en LF quelle que soit la machine qui construit.
    git(["-c", "core.autocrlf=input", "update-index", "--add", "-z", "--stdin"], { env, input: gardes.join("\0") + "\0" });
    const executables = gardes.filter((f) => /\.(sh|command)$/i.test(f));
    if (executables.length) {
      git(["update-index", "--chmod=+x", "-z", "--stdin"], { env, input: executables.join("\0") + "\0" });
    }
    // L'arbre couvre tout le dépôt ; depuis un sous-dossier, git archive n'en prend que
    // le sous-arbre courant (lui donner `arbre:sous-dossier` produirait un zip vide).
    const arbre = git(["write-tree"], { env }).trim();
    const zip = path.join(DIST, `${NOM}.zip`);
    rmSync(zip, { force: true });
    const attributs = path.join(ROOT, ".gitattributes");
    const configArchive = ["-c", "core.autocrlf=false"];
    if (existsSync(attributs)) configArchive.push("-c", `core.attributesFile=${attributs}`);
    git([...configArchive, "archive", "--format=zip", `--prefix=${NOM}/`, "-o", zip, arbre]);
    const manifeste = [
      `# ${NOM} — ${gardes.length} fichiers, ${mo(octets)}, construit le ${new Date().toISOString().slice(0, 10)}`,
      `# exécutables (+x) : ${executables.join(", ") || "aucun"}`,
      ...gardes.map((f) => `${statSync(path.join(ROOT, f)).size}\t${f}`),
    ].join("\n") + "\n";
    writeFileSync(path.join(DIST, "MANIFESTE.txt"), manifeste);
    console.log(`Archive : ${path.relative(ROOT, zip)} (${mo(statSync(zip).size)}), +x sur ${executables.length} fichier(s) ; manifeste dans dist-eleves/MANIFESTE.txt.`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

main();
