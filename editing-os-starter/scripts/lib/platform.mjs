// scripts/lib/platform.mjs
// Les différences entre macOS, Linux et Windows, réunies en un seul endroit :
// trouver un binaire sur le PATH sans `which`, trouver Python, lancer la CLI
// HyperFrames sans passer par `npx`, révéler un fichier dans l'explorateur.
//
// Pourquoi : le starter a été construit sur macOS. Trois habitudes Unix
// cassaient tout sous Windows sans message clair — `which` n'existe pas,
// `python3` n'est pas créé par l'installeur python.org (seulement `python` et
// le lanceur `py`), et `npx` est un script .cmd que spawn() refuse de lancer
// sans shell. Aucun appel ne passe par un shell ici : les arguments restent
// des tableaux, comme partout ailleurs dans le workspace.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const isWindows = process.platform === 'win32';
export const isMac = process.platform === 'darwin';

const WORKSPACE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * `which` portable. Renvoie le chemin absolu du premier `name` trouvé sur le
 * PATH, ou null. Sous Windows, essaie les extensions de PATHEXT (.exe, .cmd…)
 * quand le nom n'en porte pas. Un chemin absolu est simplement vérifié.
 */
export function findOnPath(name) {
  if (!name) return null;
  if (path.isAbsolute(name)) return isFile(name) ? name : null;
  const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  const exts = isWindows
    ? (process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM').split(';').filter(Boolean)
    : [''];
  const hasExt = isWindows && exts.some((e) => name.toLowerCase().endsWith(e.toLowerCase()));
  for (const dir of dirs) {
    const candidates = hasExt ? [path.join(dir, name)] : exts.map((e) => path.join(dir, name + e));
    for (const c of candidates) {
      if (!isFile(c)) continue;
      if (isWindows) return c;
      try { fs.accessSync(c, fs.constants.X_OK); return c; } catch { /* pas exécutable */ }
    }
  }
  return null;
}

function isFile(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

let pythonCache;
/**
 * L'interpréteur Python 3 de cette machine : `python3`, sinon `python`, sinon
 * le lanceur Windows `py -3`. Renvoie { cmd, args } (args = préfixe à placer
 * avant le script), ou null si aucun ne répond « Python 3.x ».
 *
 * On exécute `--version` plutôt que de se fier au PATH : sous Windows,
 * `python3.exe` peut être l'alias du Microsoft Store, qui ouvre la boutique au
 * lieu d'exécuter quoi que ce soit — il ne répond pas « Python 3 », on passe.
 */
export function findPython() {
  if (pythonCache) return pythonCache;
  const tries = [['python3', []], ['python', []]];
  if (isWindows) tries.push(['py', ['-3']]);
  for (const [cmd, pre] of tries) {
    const r = spawnSync(cmd, [...pre, '--version'], { encoding: 'utf8', windowsHide: true, timeout: 15000 });
    const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
    if (!r.error && r.status === 0 && /^Python 3\./.test(out)) {
      pythonCache = { cmd, args: pre }; // un échec n'est pas mémorisé : Python peut arriver plus tard
      return pythonCache;
    }
  }
  return null;
}

/**
 * Environnement pour lancer nos scripts Python. Sous Windows, Python lit et
 * écrit en cp1252 par défaut : les accents des transcripts (« été », « à »)
 * ressortiraient faux dans les vérifications. Le mode UTF-8 règle stdin,
 * stdout, les fichiers ouverts sans `encoding=` et la sortie des sous-process.
 * Sans effet sur macOS et Linux, déjà en UTF-8.
 */
export function pythonEnv(base = process.env) {
  return { ...base, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' };
}

let hfCache;
/**
 * Comment lancer la CLI HyperFrames : { cmd, args } à compléter par la
 * sous-commande (`lint`, `render`, `preview`…). On lance node directement sur
 * le point d'entrée du paquet installé dans le workspace — exactement ce que
 * fait `npx hyperframes`, sans dépendre d'un shell ni du PATH.
 * Renvoie null si le paquet n'est pas installé (→ `npm install`).
 */
export function hyperframesCli() {
  if (hfCache) return hfCache;
  try {
    const pkgDir = path.join(WORKSPACE_ROOT, 'node_modules', 'hyperframes');
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
    const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin && pkg.bin.hyperframes;
    if (bin && isFile(path.join(pkgDir, bin))) {
      hfCache = { cmd: process.execPath, args: [path.join(pkgDir, bin)] }; // mémorisé seulement si trouvé
    }
  } catch { /* pas installé (npm install) : on réessaiera au prochain appel */ }
  return hfCache || null;
}

/**
 * Montre un fichier (ou un dossier) dans le gestionnaire de fichiers :
 * Finder, Explorateur Windows, ou le gestionnaire par défaut sous Linux.
 * `cb(err)` — sous Windows, explorer.exe renvoie un code de sortie non nul
 * même quand il a ouvert la fenêtre : seul un échec de lancement compte.
 */
export function revealPath(absPath, cb) {
  let cmd;
  let args;
  if (isMac) {
    cmd = 'open'; args = ['-R', absPath];
  } else if (isWindows) {
    cmd = 'explorer.exe'; args = [`/select,${absPath}`];
  } else {
    let dir = absPath;
    try { if (!fs.statSync(absPath).isDirectory()) dir = path.dirname(absPath); } catch { /* tel quel */ }
    cmd = 'xdg-open'; args = [dir];
  }
  const r = spawnSync(cmd, args, { stdio: 'ignore', windowsHide: true, timeout: 15000 });
  if (r.error) return cb(r.error);
  if (r.status !== 0 && !isWindows) return cb(new Error(`${cmd} exited with ${r.status}`));
  return cb(null);
}
