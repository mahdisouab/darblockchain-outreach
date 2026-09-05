#!/usr/bin/env node
// scripts/py.mjs — lance un script Python avec l'interpréteur de cette machine.
//
// `python3` n'existe pas toujours sous Windows (l'installeur python.org ne
// crée que `python` et le lanceur `py`). Ce relais évite d'écrire trois
// variantes dans package.json, et force le mode UTF-8 pour que les accents des
// transcripts passent intacts quel que soit l'encodage du système.
//
// Usage :  node scripts/py.mjs scripts/autoverify.py --project <slug>
//          npm run verify -- --project <slug>        (équivalent)

import { spawnSync } from 'node:child_process';
import { findPython, pythonEnv } from './lib/platform.mjs';

const py = findPython();
if (!py) {
  console.error(
    'Python 3 introuvable (ni python3, ni python, ni py).\n' +
      'Installe-le depuis https://www.python.org/downloads/ en cochant « Add python.exe to PATH », ' +
      'ou depuis le Microsoft Store, puis rouvre le terminal.',
  );
  process.exit(127);
}

const r = spawnSync(py.cmd, [...py.args, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: pythonEnv(),
  windowsHide: true,
});
if (r.error) {
  console.error(r.error.message);
  process.exit(1);
}
process.exit(r.status === null ? 1 : r.status);
