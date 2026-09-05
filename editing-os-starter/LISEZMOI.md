# Editing OS — prise en main

**Un studio de montage vidéo piloté par des agents IA, qui tourne entièrement sur ta
machine.** Tu déposes un rush face caméra, cinq agents s'enchaînent : couper les blancs,
couper les erreurs, vérifier que les coupes ont bien atterri, poser les animations, poser
la b-roll. Tu valides à chaque étape. Rien ne part dans le cloud, aucun abonnement.

La différence avec un auto-cut classique : **tout est piloté par la transcription mot à
mot**, pas par le volume audio. Un transcript avec les timestamps de chaque mot est
produit une fois, et chaque décision derrière (quelle coupe, à quelle image démarre une
animation, quand la b-roll entre) se cale sur ces timestamps. C'est pour ça que les
coupes tombent sur la syllabe et pas à côté.

---

## 1. Ce dont tu as besoin

| | Quoi | Vérifier / installer |
|---|---|---|
| Machine | **macOS** ou **Windows 10/11** | macOS est le chemin d'origine ; Windows est pris en charge depuis le 05/09 (voir § 2 bis) ; Linux devrait marcher |
| | **Node 20 ou plus** | `node -v` — sinon https://nodejs.org (Windows : `winget install -e --id OpenJS.NodeJS.LTS`) |
| | **FFmpeg** | `ffmpeg -version` — sinon `brew install ffmpeg` (Windows : `winget install -e --id Gyan.FFmpeg`) |
| | **Google Chrome** | c'est lui qui fait le rendu des compositions (Windows : `winget install -e --id Google.Chrome`) |
| | **whisper.cpp** | `brew install whisper-cpp` (transcription locale, gratuite) — Windows : binaires précompilés, voir § 2 bis |
| | **Python 3** | déjà présent sur macOS — Windows : `winget install -e --id Python.Python.3.12` — sert aux scripts de vérification |
| Outil | **Claude Code** | c'est l'interface : les agents sont des skills Claude Code (sous Windows, garde Git for Windows installé : Claude Code exécute ses commandes dans Git Bash) |

Pas de clé API obligatoire. La transcription tourne en local ; le modèle whisper
(~1,6 Go) se télécharge tout seul dans `models/` au premier usage.

---

## 2. Installation (5 minutes)

```bash
cd editing-os-starter
npm install
```

Puis la vérification d'environnement :

```bash
npx hyperframes doctor
```

Il te dit ligne par ligne ce qui manque (Node, FFmpeg, Chrome). Corrige, relance.

Les clés API sont **toutes optionnelles** :

```bash
cp .env.example .env
```

- `ELEVENLABS_API_KEY` — transcription hébergée en secours, si tu ne veux pas de whisper local
- `PEXELS_API_KEY` / `PIXABAY_API_KEY` / `UNSPLASH_ACCESS_KEY` — permettent à l'agent b-roll d'aller chercher des plans de stock sur le web. Sans elles il travaille avec ta bibliothèque locale.

Dernière étape, ouvre le tableau de bord :

```bash
npm run os
```

→ http://localhost:4200

(Sur Mac tu peux aussi double-cliquer `editing-os/Editing OS.command` ; sous Windows,
`editing-os\Editing OS.bat` — voir § 2 bis.)

---

## 2 bis. Sous Windows

**Le plus simple : double-clique `scripts\setup_windows.bat`.** Il vérifie et
installe ce qui manque (Node, FFmpeg, Chrome, Python, Git via `winget`,
whisper.cpp depuis le zip précompilé), corrige le PATH, fait `npm install` et
lance le contrôle HyperFrames. Il se relance sans risque : il ne refait que ce
qui manque. Si le téléchargement de whisper échoue chez toi, pose
`whisper-bin-x64.zip` dans Téléchargements (ou à côté du script) et relance.
Ferme et rouvre tes terminaux quand il a fini : le PATH n'est relu qu'à
l'ouverture. Ce qui suit est le détail, à la main, si tu préfères.

Tout se fait dans un terminal PowerShell (ou Git Bash). Les outils système
s'installent avec `winget`, livré avec Windows 10/11 :

```powershell
winget install -e --id OpenJS.NodeJS.LTS
winget install -e --id Gyan.FFmpeg
winget install -e --id Google.Chrome
winget install -e --id Python.Python.3.12
winget install -e --id Git.Git          # si tu ne l'as pas déjà
```

Ferme puis rouvre le terminal : le PATH n'est relu qu'à l'ouverture. Tant que
`node -v` ou `ffmpeg -version` répondent « n'est pas reconnu », c'est presque
toujours ça (ou une installation winget qui n'est pas allée au bout : relance-la).

**whisper.cpp** n'a pas de paquet winget. Les binaires précompilés sont sur
https://github.com/ggml-org/whisper.cpp/releases (vérifié sur la version
b4938 / v1.9.3) :

1. télécharge `whisper-bin-x64.zip` (processeur seul, ~8 Mo). Lien direct si la
   page des releases n'affiche pas ses fichiers :
   https://github.com/ggml-org/whisper.cpp/releases/download/b4938/whisper-bin-x64.zip
   Variantes : `whisper-blas-bin-x64.zip` (plus rapide sur CPU) ou
   `whisper-cublas-12.4.0-bin-x64.zip` (carte NVIDIA, 640 Mo) ;
2. décompresse-le, par exemple dans `%LOCALAPPDATA%\Programs\whisper-cpp\` (c'est
   là que l'installateur le pose) : le dossier `Release\` contient
   `whisper-cli.exe` et ses DLL ;
3. ajoute ce dossier `Release\` au PATH (Paramètres → « Modifier les variables
   d'environnement » → Path → Nouveau). Sans toucher au PATH, tu peux aussi
   poser la variable `WHISPER_CLI=<chemin complet de whisper-cli.exe>` ;
4. rouvre le terminal et vérifie : `whisper-cli --help`. S'il ne démarre pas
   (DLL manquante), installe le runtime Visual C++ :
   `winget install -e --id Microsoft.VCRedist.2015+.x64`.

Le modèle (~1,6 Go) se télécharge tout seul dans `models\` au premier
`node scripts/transcribe-whisper.mjs`, avec le `curl` livré avec Windows.

Ensuite comme sur Mac : `npm install`, `npx hyperframes doctor`, `npm run os`.
Le lanceur `editing-os\Editing OS.bat` enchaîne les trois : il installe les
dépendances la première fois, démarre le hub et ouvre le navigateur. Ferme sa
fenêtre pour arrêter le hub.

Ce qui a été adapté pour Windows le 05/09, utile si un message te renvoie ici :

- `npm run verify`, `verif-montage` et `master` passent par `scripts/py.mjs`,
  qui trouve `python3`, `python` ou `py -3` et force l'UTF-8. Sans ça, Python
  lit les transcripts en cp1252 sous Windows et les accents tombent faux. Pour
  lancer un script Python à la main : `$env:PYTHONUTF8 = 1` dans PowerShell
  (ou `setx PYTHONUTF8 1` une fois pour toutes), puis `python scripts\autoverify.py …`.
- Le hub lance la CLI HyperFrames avec `node` directement, jamais `npx`, qui ne
  se lance pas sans shell sous Windows ; Python comme ci-dessus.
- « Ne garder que les 3 derniers » envoie à la Corbeille Windows ; « Révéler »
  ouvre l'Explorateur sur le fichier.
- `scripts/transcribe-whisper.mjs` cherche `whisper-cli.exe` sur le PATH
  lui-même (`which` n'existe pas ici) et lit `WHISPER_CLI`.
- Les deux scripts de `cut-silences` qui passaient par `sh` appellent `ffmpeg`
  directement.

Ces adaptations ont été validées sous Linux et relues pour Windows, pas encore
exécutées sur une machine Windows. Si quelque chose casse, le message d'erreur
dit désormais quoi installer.

---

## 3. Ton premier montage

### a. Créer le projet

Ouvre **Claude Code** dans ce dossier, et lance :

```
/reel-format
```

Il te pose une seule question — *qu'est-ce que le spectateur doit avoir compris à la
seconde 3 ?* — choisit le format, crée `video-projects/AA-MM-JJ-ton-sujet/` et pose le
squelette de composition.

Tu peux aussi le faire à la main : voir `video-projects/README.md`.

### b. Déposer le rush

Ré-encode ton enregistrement en H.264 avant de le référencer (ça évite 90 % des
problèmes de lecture) :

```bash
ffmpeg -i rush.mov -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k \
  -movflags +faststart video-projects/<ton-projet>/assets/clip.mp4
```

### c. Transcrire

```bash
node scripts/transcribe-whisper.mjs video-projects/<ton-projet>/assets/clip.mp4
```

Ça écrit un `clip.json` à côté du fichier : le transcript mot à mot. C'est la matière
première de tout le reste. (~7× le temps réel sur un M4 Pro.)

### d. Lancer les agents, dans l'ordre

Dans Claude Code, en langage naturel :

```
coupe les silences de video-projects/<ton-projet>/assets/clip.mp4
```

puis

```
coupe les erreurs et les reprises
vérifie les coupes
ajoute les motion graphics
ajoute la b-roll
```

Trois de ces agents sont **review-gated** : ils te proposent chaque coupe avec son
contexte et sa raison, et ne rendent rien tant que tu n'as pas validé.

### e. Rendre et vérifier

```bash
cd video-projects/<ton-projet>
npx hyperframes lint                    # toujours avant un rendu
npx hyperframes render --quality draft --output renders/draft.mp4
```

Puis, depuis la racine :

```bash
npm run verify        -- --project <ton-projet>   # le son et la parole
npm run verif-montage -- --project <ton-projet>   # ce qui se voit
```

Le premier re-transcrit le rendu et prouve que rien n'a été perdu : mots de fin de
segment présents, aucune phrase jouée deux fois, pas de queue morte, pas de blanc
résiduel.

Le second regarde ce que le premier ne voit pas — parce qu'il ne regarde que le
son : un `<!DOCTYPE html>` en tête d'une composition (qui fait disparaître toutes
tes animations du rendu, sans aucun message d'erreur), des plans d'un dixième de
seconde isolés, un départ sur une image noire, une bande noire sur un bord, une
animation déclarée mais invisible.

Tant que les deux ne passent pas, le montage n'est pas fini.

Quand c'est bon :

```bash
npx hyperframes render --quality standard --output renders/final.mp4
npm run master -- --project <ton-projet>       # master à −14 LUFS
```

### f. Relire et corriger

Sur la page du projet dans le dashboard : **Apporter des modifications**. Tu navigues
image par image, tu notes tes retours horodatés, tu cliques « Copier pour Claude », tu
colles dans Claude Code. Les corrections se font au timecode, chirurgicalement.

---

## 4. Ce qu'il y a dans le dossier

```
LISEZMOI.md          ce fichier
README.md            la version courte, en anglais
CLAUDE.md            le guide que Claude Code lit automatiquement — le contrat de rendu
PROCESS.md           la recette complète d'un reel, de A à Z
MOTION_PHILOSOPHY.md l'esthétique motion design (à lire avant toute session créative)

.claude/skills/      les agents + les références HyperFrames / GSAP
editing-os/          le tableau de bord (npm run os)
formats/             3 formats de reel documentés : géométrie, structure, CTA
style-templates/     squelettes de projet prêts à cloner
style-library/       12 styles de cartes motion, ~1700 cartes HTML
asset-library/       b-roll, logos, captures — et la banque de sound effects
scripts/             transcription, vérification, mastering
video-projects/      vide : c'est là que ton travail atterrit
```

Le paquet se reconstruit à l'identique avec `node scripts/paquet-eleves.mjs --zip`
(liste blanche + trois assertions qui refusent de produire l'archive si un nom,
un chemin machine ou une clé s'y est glissé).

Trois documents portent tout le savoir-faire, dans cet ordre :

1. **`formats/README.md`** — quelle forme donner au reel (et pourquoi, chiffres à l'appui dans `MESURES.md`)
2. **`PROCESS.md`** — l'enchaînement complet, phase par phase
3. **`MOTION_PHILOSOPHY.md`** — comment le motion doit se comporter (les 11 lois, la checklist pre-flight)

---

## 5. Personnaliser l'espace

Tout est prévu pour être repris. Rien n'est codé en dur dans les cartes.

### Ta charte graphique

Le **style 10 « Maison »** (`style-library/10-maison/`) est le style par défaut : c'est
celui avec lequel on monte. Les onze autres sont des références dont on s'inspire.

Pour le passer à tes couleurs, un seul fichier : `style-library/10-maison/tokens.css`.

```css
--jaune:  #FFD935;   /* l'accent — la SEULE couleur saturée du style */
--navy:   #02060F;   /* fond des cartes plein écran */
--cream:  #F7F5C9;   /* fond des montages typographiques */
```

Change ces trois valeurs, les 68 cartes du style suivent.

### Tes polices

Par défaut le style tourne sur **Outfit** (Google Fonts, gratuite). Pour poser ta police
de marque :

1. dépose tes `.woff2` dans `style-library/10-maison/fonts/`
2. remplace le bloc `@font-face` en haut de `tokens.css`
3. change `--font-display` et `--font-body`

Aucune carte ne code une police en dur, donc rien d'autre ne bouge.

### Tes sons

`asset-library/sfx/` contient une banque de sound effects prête à l'emploi (whoosh, pop,
click, impact, riser, cash, buzzer…). **Les noms de fichiers sont des rôles** : pour
changer un son, remplace le fichier en gardant son nom, rien d'autre ne bouge. Le mapping
son ↔ animation est documenté dans `asset-library/sfx/README.md`.

### Tes formats

`formats/` documente trois formats de reel vertical avec leur géométrie exacte. Si tu
tournes autre chose, écris ton propre `formats/04-mon-format.md` sur le même modèle et
clone un scaffold dans `style-templates/`. Le dashboard et le skill `reel-format` les
détectent automatiquement.

### L'interface du dashboard

`editing-os/public/style.css`, tout en haut : mêmes tokens, même logique.

---

## 6. Ce qui n'est pas dans le paquet (et pourquoi)

- **Les vidéos, rushes et rendus** — c'est le travail du créateur d'origine, pas du logiciel.
  `video-projects/`, `formats/exemples/` et `formats/references/` démarrent vides.
- **Les polices de marque sous licence** — remplacées par Outfit (libre). Voir §5.
- **Les planches de références** des styles (captures d'écran de vidéos d'autres créateurs,
  qui servaient de moodboard) — les specs `DESIGN.md` décrivent tout ce qu'il faut savoir.
- **Le modèle whisper** (1,6 Go) et `node_modules` — ils se téléchargent à l'installation.

---

## 7. Si ça coince

| Symptôme | Cause probable |
|---|---|
| `npx hyperframes doctor` échoue | FFmpeg ou Chrome manquant → `brew install ffmpeg` (Windows : `winget install -e --id Gyan.FFmpeg`, puis rouvrir le terminal ; Chrome introuvable → `npx hyperframes browser ensure`) |
| `python3` n'est pas reconnu (Windows) | l'installeur python.org ne crée que `python` et `py`. Passe par `npm run verify` / `verif-montage` / `master` (le relais `scripts/py.mjs` choisit tout seul), ou installe Python depuis le Microsoft Store, qui fournit `python3` |
| `whisper-cli not found on PATH` | le dossier `Release\` du zip whisper.cpp n'est pas dans le PATH, ou le terminal n'a pas été rouvert. Sinon pose `WHISPER_CLI=…\whisper-cli.exe`. Voir § 2 bis |
| Des accents faux dans un rapport de vérification (Windows) | Python tourne sans UTF-8. `npm run verify` le force ; à la main, `$env:PYTHONUTF8 = 1` |
| La transcription met des plombes | normal au 1er lancement : le modèle se télécharge (~1,6 Go) |
| Les coupes tombent à côté | ne désactive jamais `--vad` ni `--align` sur le transcript ; ces deux options corrigent des erreurs de plusieurs secondes |
| `lint` passe mais le rendu est cassé | « lint passe » ≠ « le design marche ». Extrait une image par scène et regarde-la vraiment. C'est écrit dans `CLAUDE.md`, c'est la règle la plus rentable du workspace |
| Le dashboard est vide | `video-projects/` est vide au départ — c'est normal |
| Un rendu part avec un défaut évident | tu as sauté `npm run verify` ou `npm run verif-montage` |
| Tes animations n'apparaissent pas dans le rendu | un `<!DOCTYPE html>` s'est glissé en tête d'une composition. Il casse `data-composition-src` sans le dire — `verif-montage` l'attrape |
| Des plans d'un dixième de seconde clignotent | des « éclats » : trop courts pour se lire, isolés dans le rush. Le nettoyage doit être la passe **finale** du montage parole, pas un pré-filtre |
| La vidéo s'ouvre sur une image noire | le flux vidéo ne démarre pas à zéro. `npm run master` le corrige tout seul depuis le 02/09 |

---

## 8. Les trois choses que la machine ne fera pas à ta place

Les deux scripts de vérification attrapent ce qui se mesure. Trois contrôles
restent manuels, et sauter l'un des trois coûte systématiquement un
aller-retour :

**Regarde ta vidéo en entier, en planche de contact.** Une vignette toutes les
cinq secondes, sur toute la durée. C'est le seul contrôle qui trouve ce qu'on ne
cherchait pas : une fenêtre restée ouverte à l'écran, une messagerie, un
document personnel, une animation qui manque. Aucun script ne sait qu'une
fenêtre n'aurait pas dû être là.

**Cherche les phrases dites deux fois en fenêtres isolées, à deux tailles.**
Whisper fusionne une phrase répétée quand il lit tout le fichier : les reprises
n'apparaissent tout simplement pas dans le transcript. Et il n'est pas stable
vis-à-vis de la longueur de fenêtre — une reprise peut sortir en fenêtre de 8 s
et disparaître en 12 s. Une seule passe en rate.

**Relis les raccords en pleine résolution.** Un cache doit CHEVAUCHER ce qui le
suit : arrêté au bord d'une animation, il laisse voir l'écran pendant les 0,4 s
de fondu d'entrée — une douzaine d'images, largement assez pour lire ce qu'on
voulait masquer.

---

## Licence

MIT. Fais-en ce que tu veux.
