// Logique pure du paquet pour les élèves : liste blanche, exclusions, contrôles.
// Aucune entrée-sortie ici, tout est testé par paquet.test.mjs ; la plomberie git
// (listing, index temporaire, archive) vit dans scripts/paquet-eleves.mjs.

// Ce qui part, et rien d'autre. Une liste noire oublie toujours le fichier qu'on vient
// d'ajouter ; une liste blanche oblige à décider. `video-projects/` ne part qu'avec son
// mode d'emploi : les projets sont le travail du créateur, pas le logiciel.
export const LISTE_BLANCHE = [
  "CLAUDE.md", "LISEZMOI.md", "README.md", "PROCESS.md", "MOTION_PHILOSOPHY.md", "LICENSE",
  "package.json", "package-lock.json", ".env.example", ".gitignore", ".gitattributes",
  ".claude/launch.json", ".claude/skills",
  "editing-os", "scripts", "formats", "style-library", "style-templates", "asset-library",
  "video-projects/README.md",
];

// Jamais, même si un chemin de la liste blanche les contient (défense en profondeur :
// le .gitignore les écarte déjà, sauf `.paquet-noms`, qui est suivi par git mais ne
// doit pas voyager).
const MOTIFS_INTERDITS = [
  /(^|\/)node_modules\//, /(^|\/)models\//, /(^|\/)renders\//, /(^|\/)\.cache\//,
  /(^|\/)worktrees\//, /(^|\/)dist-eleves\//, /(^|\/)\.hf-cli\//,
  /(^|\/)\.env$/, /(^|\/)\.env\.(?!example$)[^/]+$/, /(^|\/)\.paquet-noms$/,
  /(^|\/)\.DS_Store$/, /(^|\/)Thumbs\.db$/,
];

export const TAILLE_MAX = 6 * 1024 * 1024;

// Le corpus du skill tunisien est extrait des propres reels du créateur : son nom y est
// la matière du corpus, pas une fuite. Exempté du contrôle des noms, jamais des autres.
export const EXEMPTS_NOMS = [".claude/skills/tunisien/references/corpus/"];

// Le fichier de test du contrôle contient, par construction, ce que le contrôle cherche :
// exempté de tout, à condition que ses fixtures restent fictives.
export const EXEMPTS_TOUT = ["scripts/lib/paquet.test.mjs"];

const MOTIFS_CHEMIN = [
  /[A-Za-z]:[\\/]+Users[\\/]+[^\s"'`)<>]+/, // lecteur, Users, nom : barre simple, double (JSON) ou oblique
  /\/Users\/[A-Za-z][^\s"'`)<>]*/, // macOS
  /\/home\/[a-z][^\s"'`)<>]*/, // Linux
];

const MOTIFS_CLE = [
  /\bsk[-_][A-Za-z0-9]{16,}/, // OpenAI, ElevenLabs
  /\bghp_[A-Za-z0-9]{20,}/, // GitHub
  /\bAKIA[0-9A-Z]{16}\b/, // AWS
  /[A-Z0-9_]*(API_KEY|ACCESS_KEY)\s*[=:]\s*["']?[A-Za-z0-9_\-]{12,}/, // NOM_API_KEY=valeur
];

// Un email a une partie locale, un @, un domaine et un TLD en lettres. `@anthropic-ai/x`
// n'a pas de partie locale, `hyperframes@0.7.26` n'a pas de TLD en lettres.
const MOTIF_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/;

const EXTENSIONS_BINAIRES = new Set([
  "png", "jpg", "jpeg", "webp", "gif", "ico", "woff", "woff2", "ttf", "otf",
  "wav", "mp3", "m4a", "aac", "mp4", "mov", "webm", "mkv", "zip", "pdf", "bin",
]);

const LONGUEUR_NOM_MIN = 4;
const EXTRAIT_MAX = 80;

export function estEmbarquable(chemin) {
  return !MOTIFS_INTERDITS.some((m) => m.test(chemin));
}

export function filtrerChemins(chemins) {
  const gardes = [];
  const ecartes = [];
  for (const c of chemins) (estEmbarquable(c) ? gardes : ecartes).push(c);
  return { gardes, ecartes };
}

export function estBinaireParExtension(chemin) {
  const ext = chemin.slice(chemin.lastIndexOf(".") + 1).toLowerCase();
  return EXTENSIONS_BINAIRES.has(ext);
}

// Un octet nul dans les 8 premiers Ko : binaire.
export function estTexte(buffer) {
  const n = Math.min(buffer.length, 8000);
  for (let i = 0; i < n; i++) if (buffer[i] === 0) return false;
  return true;
}

export function controlerTaille(chemin, octets) {
  if (octets <= TAILLE_MAX) return null;
  return { chemin, ligne: 0, type: "taille", extrait: `${(octets / 1048576).toFixed(1)} Mo` };
}

function extrait(s) {
  s = s.trim();
  return s.length > EXTRAIT_MAX ? s.slice(0, EXTRAIT_MAX) + "…" : s;
}

// Un problème par ligne et par type, au plus. Les noms se cherchent en sous-chaîne,
// pas en mot : `\b` est une frontière ASCII en JavaScript et laisse passer « à Émile ».
export function controlerTexte(chemin, texte, noms) {
  const problemes = [];
  if (EXEMPTS_TOUT.includes(chemin)) return problemes;
  const exemptDesNoms = EXEMPTS_NOMS.some((p) => chemin.startsWith(p));
  const nomsActifs = (noms ?? []).filter((n) => n.length >= LONGUEUR_NOM_MIN);
  const lignes = texte.split(/\r?\n/);
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    const numero = i + 1;
    const chemin_ = MOTIFS_CHEMIN.map((m) => ligne.match(m)).find(Boolean);
    if (chemin_) problemes.push({ chemin, ligne: numero, type: "chemin-machine", extrait: extrait(chemin_[0]) });
    const cle = MOTIFS_CLE.map((m) => ligne.match(m)).find(Boolean);
    if (cle) problemes.push({ chemin, ligne: numero, type: "cle", extrait: extrait(cle[0]) });
    const email = ligne.match(MOTIF_EMAIL);
    if (email) problemes.push({ chemin, ligne: numero, type: "email", extrait: extrait(email[0]) });
    if (!exemptDesNoms && nomsActifs.length) {
      const bas = ligne.toLowerCase();
      const nom = nomsActifs.find((n) => bas.includes(n));
      if (nom) problemes.push({ chemin, ligne: numero, type: "nom", extrait: extrait(ligne) });
    }
  }
  return problemes;
}

// Les noms à bannir : le fichier `.paquet-noms` (un par ligne, `#` commente) puis
// l'identité git de la machine qui construit — user.name par mots, la partie locale de
// user.email, le propriétaire du dépôt distant. Minuscules, dédoublonnés, 4 caractères
// au moins pour ne pas bannir « ali » de tous les textes.
export function lireNoms(contenuFichier, identite = {}) {
  const bruts = [];
  for (const l of (contenuFichier ?? "").split(/\r?\n/)) {
    const t = l.trim();
    if (t && !t.startsWith("#")) bruts.push(t);
  }
  for (const mot of (identite.userName ?? "").split(/\s+/)) bruts.push(mot);
  const email = identite.email ?? "";
  if (email.includes("@")) bruts.push(email.slice(0, email.indexOf("@")));
  const remote = (identite.remote ?? "").replace(/\.git$/, "");
  const segments = remote.split(/[/:]/).filter(Boolean);
  if (segments.length >= 2) bruts.push(segments[segments.length - 2]);
  const vus = new Set();
  const noms = [];
  for (const b of bruts) {
    const n = b.toLowerCase();
    if (n.length < LONGUEUR_NOM_MIN || vus.has(n)) continue;
    vus.add(n);
    noms.push(n);
  }
  return noms;
}
