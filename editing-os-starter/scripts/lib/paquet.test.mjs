// Tests de la logique pure du paquet (scripts/lib/paquet.mjs) :
//   npm test   (node --test scripts/lib/paquet.test.mjs)
// Les fixtures sont FICTIVES (Dupont, quelquun, exemple.com) : ce fichier est exempté du
// contrôle parce qu'il contient forcément ce que le contrôle cherche ; il ne doit jamais
// porter un vrai nom, un vrai chemin ni une vraie clé.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LISTE_BLANCHE, EXEMPTS_NOMS, EXEMPTS_TOUT, TAILLE_MAX,
  estEmbarquable, filtrerChemins, controlerTexte, controlerTaille, estTexte,
  estBinaireParExtension, lireNoms,
} from "./paquet.mjs";

test("estEmbarquable : refuse ce qui ne doit jamais partir", () => {
  for (const p of [
    "node_modules/x/index.js", "editing-os/node_modules/a.js", "models/ggml.bin",
    "style-templates/reel-04-sujet-central/renders/draft.mp4", "editing-os/.cache/t.png",
    ".claude/worktrees/x/CLAUDE.md", "dist-eleves/editing-os-starter.zip", ".env",
    "scripts/.env.local", ".paquet-noms", "asset-library/.DS_Store", "formats/Thumbs.db",
  ]) assert.equal(estEmbarquable(p), false, p);
});

test("estEmbarquable : accepte le reste, dont .env.example et la banque sfx", () => {
  for (const p of [
    ".env.example", "asset-library/sfx/typing.wav", "editing-os/server.mjs",
    "video-projects/README.md", "editing-os/Editing OS.command",
  ]) assert.equal(estEmbarquable(p), true, p);
});

test("filtrerChemins sépare gardés et écartés", () => {
  const r = filtrerChemins(["CLAUDE.md", "models/x.bin", "scripts/py.mjs"]);
  assert.deepEqual(r.gardes, ["CLAUDE.md", "scripts/py.mjs"]);
  assert.deepEqual(r.ecartes, ["models/x.bin"]);
});

test("controlerTexte : chemins machine, Windows et Unix, simple ou double barre", () => {
  const cas = [
    'ROOT="C:/Users/quelquun/mon-espace"',
    "chemin : `C:\\Users\\quelquun\\x`",
    '"C:\\\\Users\\\\quelquun\\\\x"',
    "cd /Users/quelquun/Movies",
    "HOME=/home/quelquun",
  ];
  for (const ligne of cas) {
    const f = controlerTexte("a.md", ligne, []);
    assert.equal(f.length, 1, ligne);
    assert.equal(f[0].type, "chemin-machine");
    assert.equal(f[0].ligne, 1);
  }
});

test("controlerTexte : clés renseignées, jamais les clés vides", () => {
  assert.equal(controlerTexte(".env.example", "ELEVENLABS_API_KEY=\nPEXELS_API_KEY=", []).length, 0);
  const f = controlerTexte("x", "ELEVENLABS_API_KEY=sk_0123456789abcdef0123", []);
  assert.equal(f.length, 1);
  assert.equal(f[0].type, "cle");
  assert.equal(controlerTexte("x", "token: sk-abcdefghijklmnopqrstuvwxyz", []).length, 1);
  assert.equal(controlerTexte("x", "ghp_abcdefghijklmnopqrstuvwxyz1234", []).length, 1);
});

test("controlerTexte : emails, mais pas les paquets npm à arobase", () => {
  const f = controlerTexte("x", "écris à quelquun@exemple.com", []);
  assert.equal(f.length, 1);
  assert.equal(f[0].type, "email");
  assert.equal(controlerTexte("x", "npm install -g @anthropic-ai/claude-code hyperframes@0.7.26", []).length, 0);
});

test("controlerTexte : noms insensibles à la casse, exemptés dans le corpus tunisien", () => {
  const noms = ["dupont", "ali"]; // "ali" : trop court, ignoré
  assert.equal(controlerTexte("a.md", "salut DUPONT", noms)[0].type, "nom");
  assert.equal(controlerTexte("a.md", "Ali est là", noms).length, 0);
  assert.equal(controlerTexte(EXEMPTS_NOMS[0] + "volume-1.md", "Dupont", noms).length, 0);
  // exempté du nom, pas du chemin machine
  assert.equal(controlerTexte(EXEMPTS_NOMS[0] + "v.md", "C:/Users/quelquun/x", noms).length, 1);
});

test("controlerTexte : le fichier de test est exempté de tout", () => {
  assert.equal(controlerTexte(EXEMPTS_TOUT[0], "C:/Users/quelquun/x dupont a@b.fr", ["dupont"]).length, 0);
});

test("controlerTexte : numéro de ligne et extrait", () => {
  const f = controlerTexte("a.md", "ok\nok\nvoir /Users/x/y\n", []);
  assert.equal(f.length, 1);
  assert.equal(f[0].ligne, 3);
  assert.match(f[0].extrait, /\/Users\/x\/y/);
});

test("controlerTaille : au-delà de 6 Mo", () => {
  assert.equal(controlerTaille("a.png", TAILLE_MAX), null);
  assert.equal(controlerTaille("a.png", TAILLE_MAX + 1)?.type, "taille");
});

test("estTexte : un NUL dans les premiers octets = binaire", () => {
  assert.equal(estTexte(Buffer.from("bonjour\n")), true);
  assert.equal(estTexte(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1])), false);
});

test("estBinaireParExtension : médias et polices, pas les svg ni les json", () => {
  assert.equal(estBinaireParExtension("a/b.woff2"), true);
  assert.equal(estBinaireParExtension("a/b.WAV"), true);
  assert.equal(estBinaireParExtension("a/b.svg"), false);
  assert.equal(estBinaireParExtension("a/b.json"), false);
});

test("lireNoms : fichier + identité git, dédoublonnés, minuscules, 4 caractères au moins", () => {
  const noms = lireNoms("# commentaire\nDupont\n\nMartin\ndupont\n", {
    userName: "Ma Dupont",
    email: "lea.dupont@exemple.com",
    remote: "https://github.com/leadupont/repo.git",
  });
  assert.deepEqual(noms, ["dupont", "martin", "lea.dupont", "leadupont"]);
  assert.deepEqual(lireNoms("", { userName: "", email: "", remote: "git@github.com:owner-x/r.git" }), ["owner-x"]);
});

test("LISTE_BLANCHE : video-projects ne part qu avec son README", () => {
  assert.ok(LISTE_BLANCHE.includes("video-projects/README.md"));
  assert.ok(!LISTE_BLANCHE.includes("video-projects"));
});
