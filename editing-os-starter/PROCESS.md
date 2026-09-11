# PROCESS — Le montage d'un reel, de A à Z

> Process validé le 17/08/2026 sur `video-projects/26-08-17-montage-video-par-ia`
> (17 versions, retours frame par frame). C'est LA recette pour toute
> prochaine vidéo courte. Les règles visuelles détaillées vivent dans
> `style-library/10-maison/DESIGN.md` ; ici on décrit l'enchaînement.

## Phase 0 — Préparation

0. **Choisir le format** avec le skill `reel-format` : `formats/README.md` (01 split
   carte / 02 avant-après / 03 recréer viral). Le projet naît du scaffold
   `style-templates/reel-0N-*`, la spec `formats/0N-*.md` s'ajoute à la checklist de
   la phase 4.
1. **Projet daté** : `video-projects/AA-MM-JJ-sujet/` (kebab-case).
2. **Rush** : réencoder en H.264 (`crf 20`, faststart). Recadrer par **crop**
   depuis un master 16:9 (jamais un scale qui déforme) ; un rush caméra vertical
   (canon : 1080×1920 à 25 i/s, rotation −90) se réencode tel quel. **Cadrage du
   sujet (06/09, `formats/04-sujet-central.md`)** : visage au centre-haut, ligne
   des yeux à 36–40 % de la hauteur, haut de tête jamais sous 300 px, rien
   d'important dans les 220 px du haut, les 450 px du bas ni la colonne d'icônes
   (x 980 → 1080, y 1000 → 1470). Mesurer avant de choisir `scale` et `y` :
   **une image détourée par plan** (`node tools/cutout-frames.mjs` après le bake,
   ≈ 1 min : haut de tête par plan, `EYES` prêt à coller, scale minimal) + une
   image du rush pour calibrer l'offset des yeux — jamais le détourage du rush
   entier (75 min mesurées le 09/09, retex du 10/09). Puis vérifier sur images :
   `node scripts/safe-zone.mjs`.
3. **Langue, puis transcription locale.** D'abord 15 s en `-l auto` (skill
   `tunisien`, `references/transcription.md`) : la voix du créateur est en
   français, en anglais ou en **derja tunisienne**, et `--language fr` sur de la
   derja fabrique une boucle d'hallucination qui a l'air d'un transcript (mesuré
   le 05/09). Puis la transcription **par morceaux coupés dans les grands
   silences** (`tools/chunks.sh`, contexte remis à zéro à chaque morceau, VAD +
   align actifs) — jamais le fichier entier : en derja il boucle après 40 s
   (mesuré le 09/09), et le fichier entier est de toute façon plus lent. Avec le
   **script du créateur** (brief § 1) une seule passe suffit ; sans script, une
   réécoute en fenêtres de 7 s sur les zones floues seulement, pas trois
   balayages. Déclarer dans `meta.json` : `verify.language`
   et le mode des sous-titres `captions.script` (`franco` par défaut sur une voix
   tunisienne, « à valider » tant que le créateur n'a pas tranché).

## Phase 1 — La parole (le montage invisible)

4. **Grandes coupes au transcript** : segments `SEG` posés sur les VRAIS
   `start`/`end` des mots. Pads : ~0.3s avant la première attaque, +0.4-0.7s
   après les fins de mots. **Répétitions : garder uniquement la DERNIÈRE
   prise** — et vérifier chaque gap suspect avec une re-transcription
   naturelle (whisper fusionne les retakes et les masque).
5. **Bake unique** : un seul `ffmpeg trim/concat` → `assets/edit.mp4`.
   Le bake et la composition utilisent le MÊME EDL (leçon v10 : tout
   désaccord bake/composition produit mots coupés + karaoké désynchro).
6. **Micro-blancs au niveau SONORE** (le transcript ne les voit pas —
   whisper étire les mots sur les pauses) : `silencedetect noise=-36dB:d=0.25`
   sur l'audio monté (parole ~-26 dB), raboter le MILIEU de chaque blanc en
   laissant ~0.25s de respiration. Preuve : re-silencedetect → il ne doit
   rester que les respirations voulues. Le recalage de la composition passe
   par `shiftCut(t)` dans `ed()` + décalage des temps littéraux.
7. **Détourage ciblé** (10/09, retex validé par le créateur) : on ne détoure
   plus le rush entier (75 min de CPU pour dix secondes d'usage, la carte
   graphique n'aide pas ce modèle). Après le storyboard, `node tools/cutout-ranges.mjs
   --range <nom>=<début>-<fin>` sur les seuls passages **DERRIÈRE** lui (mots,
   halo), en secondes montées du bake, avec poignées → `assets/cut/<nom>.webm` et
   les balises `<video>` à coller dans `#cutwrap`. Ça tourne pendant la
   composition, ça ne bloque rien. Le voile des beats AUTOUR couvre toute
   l'image (0,18), il n'a plus besoin du détourage.
7bis. **Voix retraitée par le créateur** (10/09 : il a passé la voix montée de la
   v1 dans un enhancer « qualité studio » et l'a renvoyée) : elle est faite sur
   la timeline MONTÉE d'une version, pas sur le rush. D'abord `node
   tools/align-check.mjs assets/voix.m4a <wav>` (0 ms attendu sur trois
   fenêtres), puis `node tools/voice-from-enhanced.mjs <wav> assets/edl-v1.json
   assets/edl.json` recoupe la voix améliorée pour le nouvel EDL sur la grille
   25 i/s du bake, avec 15 ms de fondu par bord — à condition que les nouveaux
   plans soient inclus dans les anciens (coupes plus serrées, retraits en plus ;
   sinon repartir du rush). Garder l'EDL de chaque version (`edl-v1.json`).
   Quand on serre les respirations, `node tools/edges.mjs` mesure le niveau dans
   les 60 ms de chaque bord de plan : un bord au-dessus de −30 dB est une coupe
   sur un mot.

## Phase 2 — Direction artistique (le designer qui écoute)

> Ajoutée le 17/08 à la demande : « le système écoute ce que je dis
> et propose des animations avancées, quasi chaque seconde, comme un designer »
> — parce que la v1 du premier reel était loin du résultat final.

7bis. **Invoquer le skill `design-beats`** sur le transcript monté, AVANT toute
   composition. Il écoute phrase par phrase, applique la grille « chaque chose
   nommée → son visuel » (drag & drop, timeline animée, croix rouge, compteur,
   doc qui scrolle, mascotte, chat vivant...), vise un événement visuel
   toutes les ~1-2 s quand le script est dense — jamais pour remplir —, décide
   pour chaque passage le **mode d'écran** (SOLO / AUTOUR / PLEIN ÉCRAN / RETOUR,
   `formats/04-sujet-central.md`) et produit un **storyboard timecodé** (t_in ancré
   sur les mots, mode et place, entrée/entretien/sortie, SFX). Voix en tunisien : le skill `tunisien`
   est chargé avant ; la colonne « il dit » porte le verbatim Franco-Tunisien
   reconstruit **et** sa glose FR, les visuels se décident sur le sens tunisien
   (jamais sur la glose), les mots incertains `[?]` ne portent aucun beat, et le
   mode des sous-titres (`captions.script`) est rappelé en tête du storyboard.
7ter. **le créateur arbitre le storyboard** (il est le DA final), et seulement
   ensuite on compose. La v1 doit ressembler à une v10.

## Phase 3 — La composition (HyperFrames)

8. **Layout par défaut = format 04** (`formats/04-sujet-central.md`, 06/09) : lui
   en plein cadre dès la frame 1, deux couches (fond + détourage) aux transforms
   STRICTEMENT identiques, ligne des yeux à 732 (38 %) tenue par `frame()`
   (un punch-in fait grandir le visage sans le déplacer), éléments légers dans
   les poches autour de lui (`around()` / `behind()`), scènes plein écran
   temporaires puis retour sur lui (`takeover()`), sous-titres sur la ligne
   1180 sous le menton — jamais sur le visage, jamais devant quelque chose.
   LA CARTE de DESIGN.md (split, carte tiers bas, karaoké dans l'interstice)
   ne vaut que pour le format 01, sur demande explicite.
9. **Beats** : un élément visuel nouveau chaque ~1-2s ; tout ce qui est
   nommé est MONTRÉ (fichier → drag & drop, opération de montage → timeline
   animée, outil rejeté → croix rouge dessinée, argent → compteur, doc →
   PDF qui scrolle). Mascotte Claude en intro + callbacks. Zéro flottement.
   SFX du pack (`asset-library/sfx/`) aux volumes du README, jamais sur les
   swaps karaoké.
10. **Tous les temps de parole passent par `ed(src)`** (source → monté) ;
    les beats se calent sur les mots, jamais à l'oreille.
10bis. **Contrôle de la composition dans le navigateur avant tout rendu** (10/09) :
    la charger nue dans Playwright (script `check.mjs` : `window.__timelines`
    enregistré, durée ≤ parole, zéro erreur de page, largeur de chaque groupe de
    sous-titres mesurée par un `Range` ≤ 860 px, captures `tl.seek()` aux
    moments clés, en avançant seulement) et regarder la planche de ces captures.
    Trente secondes qui ont évité trois rendus le 09/09 : une ancre hors EDL
    (rendu muet), un descendant `visibility: visible` qui perçait ses parents
    cachés, un sous-titre de 923 px. Règle de code qui va avec : `visibility:
    inherit`, jamais `visible`.
10ter. **Pas de propriété `filter`** (blur, brightness, grayscale) dans une
    composition de reel : elle force le moteur à photographier chaque image
    (« fast capture: falling back to screenshot capture — filter:blur detected »,
    12 min pour 100 s). Les flous se remplacent par des dégradés, les whips par
    scale + x + rotation + alpha (scaffold mis à jour le 10/09). Gain à mesurer
    sur le prochain rendu ; il porte sur le draft, la publication et les cinq
    passes du paquet Premiere.

## Phase 4 — Vérification (avant TOUT envoi à Maison)

11. `npx hyperframes lint`, le contrôle 10bis, puis rendu draft. **Le draft ne
    passe pas par `verify`** (10/09) : il n'est pas masterisé par définition et
    la re-transcription ne dit rien de plus que la planche et le contrôle
    Playwright. Sur le draft : planche safe-zone, `verif-montage`, images clés.
12. **Regarder les frames** : extraire les moments clés (chaque beat, chaque
    point de coupe, le cadrage) et les regarder vraiment. « Le CSS a
    l'air bon » n'est pas une vérification.
12ter. **La safe zone, sur images** (06/09) : `node scripts/safe-zone.mjs
    renders/<rendu>.mp4 --every 3` dessine sur une planche de contact les zones
    que l'interface recouvre (rouge), la safe zone (vert), la cible des yeux
    (cyan) et la ligne de sous-titre (jaune). Regarder toute la planche : le
    visage dans le vert avec les yeux près du cyan, rien à lire dans le rouge,
    le sous-titre sur sa ligne, aucun élément « autour » sur le visage. Le
    premier reel est parti avec le menton sous la limite ; cette planche
    existe pour que ça ne se reproduise pas.
13. `npm run verify -- --project <slug> --master` **une fois, sur le master**
    (10/09) : re-transcription (mots-sentinelles, répétitions, queue morte),
    zone haute jamais vide, niveau audio. **Le script vit dans `scripts/`, pas
    dans le projet** — il n'y a plus de copie à adapter. Sa configuration tient
    dans le `meta.json` du projet (bloc `verify`) ; sans configuration il déduit
    ses mots-sentinelles du transcript **du montage** (jamais du rush, qui
    contient les phrases coupées exprès), et il saute la zone haute sur un
    format horizontal. **Sur une voix tunisienne, les sentinelles sont les mots
    latins exacts du script** (Claude, PFE, watermark…) : whisper réorthographie
    les mots derja à chaque passe (كلاود / « Claude », بجيميني / بجميني —
    deux faux échecs le 09/09) ; sans script, trois mots stables et le rapport se
    lit en le sachant. La preuve qu'aucun mot n'est coupé reste la carte des
    silences + `blanks --check`, pas whisper.
12bis. **Le fps se déclare, il ne se tape pas.** `data-fps="30"` sur la racine
    de la composition, et `"fps": 30` dans le `meta.json`. **30 pour tous les
    verticaux** : c'est la cadence native d'Instagram et de TikTok, et le
    format enchaîne punch-ins, zooms et swaps karaoké — du mouvement continu,
    que le 24 fait juddérer. Les masters v15 à v19 sont sortis en 24 parce que
    quelqu'un avait tapé `-f 24` un jour, sans que rien ne le déclare : c'est
    exactement le genre d'écart que ce process existe pour empêcher.
13bis. **Le rendu de publication n'est pas un draft** : `--quality high
    --video-bitrate 12M` (mesuré : un draft sort à 547 kbps de vidéo en
    1080x1920, un standard à 1,8 Mbps ; ça se voit sur les dégradés sombres,
    et les plateformes ré-encodent par-dessus). Réglable par projet dans
    `meta.json`, bloc `render`.
14. **Master de publication** : `npm run master -- --project <slug>` → **-14 LUFS,
    true peak -1 dBTP** (un mix brut sort vers -23 : trop bas pour IG/TikTok).
15. `verify` sur le **master** : PASS obligatoire (23/23 sur le reel de
    référence). C'est ce fichier qu'on envoie, pas le draft. Sur un draft, le
    niveau audio n'est qu'un avertissement — un draft n'est pas censé être
    masterisé.
15 bis. **Le master part d'abord, le paquet Premiere Pro suit** (règles du créateur,
    09 et 10/09/2026 : il ajuste lui-même le montage dans Premiere Pro 2021, et
    il veut la vidéo dès qu'elle existe pour préparer ses retours). Dès que le
    master passe `verify` et `verif-montage` : **l'envoyer avec sa planche
    safe-zone**, puis seulement lancer le paquet, en tâche détachée, et livrer
    le XML dans un second message. Le paquet : `node tools/premiere-cards.mjs` (cartes d'isolation, une
    par couche), rendu de chaque carte en séquence PNG alpha à 25 i/s
    (`npx hyperframes render -c premiere-cards/layer-<couche>.html --format
    png-sequence --fps 25 --workers auto --browser-gpu -o renders/premiere/png/<couche>`,
    ~4 min par couche, en tâche détachée), puis `node tools/premiere.mjs` →
    `premiere/<seq>.xml` (FCP7 xmeml : rush plan par plan avec la Trajectoire
    du cadrage et du zoom en images clés, détourage, un clip ProRes 4444 alpha
    par beat, sous-titres, voix, SFX avec leur gain, master en référence),
    `sous-titres.srt`, `README.md`. On envoie le XML et le README ; `media/`
    (plusieurs Go) reste sur la machine. Les deux outils vivent dans le
    scaffold du format 04 (`tools/`) ; recette détaillée dans le README généré.
    **La structure validée par le créateur (10/09/2026, son export Premiere du XML
    corrigé donnait le rendu du master)** : la piste du bas est le **fond noir
    texturé** (`tools/bg-still.mjs`, image fixe sur toute la séquence) ; le rush et
    le détourage sont **coupés pendant les scènes plein écran** (les `takeover(sel,
    a, b)` de la composition, de S(a) à S(b) − 0,1) pour que la scène se pose sur
    le fond comme dans l'original ; le voile est un **PNG noir opaque monté à
    25 % d'opacité** (à 100 %, c'était un noir total sous le détourage sur chaque
    beat AUTOUR : le premier export du créateur l'a montré). Tout est lu dans la
    composition, plus rien n'est codé en dur. **`node tools/premiere-check.mjs`**
    tourne à la fin de `premiere.mjs` et refuse le paquet si le fond, les trous
    du rush et du détourage, l'opacité du voile ou un média manquent : un paquet
    refusé ne part pas. Différences connues et acceptées : à l'entrée et à la
    sortie d'une scène plein écran, Premiere coupe net là où l'original fait un
    fondu de 0,28 s, et les whips n'ont pas de flou.

> **Le budget temps (retex du 10/09, `video-projects/26-09-09-claude-watermark/RETEX.md`).**
> Rush de deux minutes, script fourni : transcription par morceaux 12 min ·
> EDL + bake 5 · cadrage sur une image par plan 2 · storyboard 12 · validation
> du créateur · composition + détourage ciblé en parallèle 25 · contrôle
> Playwright 3 · draft + planche 15 · publication + master + verify 22 · envoi,
> puis paquet Premiere 35 min en fond. **≈ 1 h 35 de rush à master** (contre
> 3 h 31 le 09/09, dont 75 min de détourage inutile et 35 min de veilles mal
> réglées). Une correction après retours ≈ 25 min, sans repasser par un draft.
> L'objectif fixé par le créateur : que le premier master soit quasi prêt à
> publier, et que chaque vidéo rapproche de ce point.

> Depuis le hub (`npm run os`), la phase 4 tient en un bouton : **Finaliser**
> sur la page projet enchaîne rendu qualité publication, master et vérification
> du master. Pendant le montage, c'est **Rendu draft + vérif** qui sert à
> chaque itération.

## Phase 5 — La boucle de review

16. `review.html` pointé sur le dernier rendu (serveur `npx serve` sur :8080,
    jamais Python http.server). le créateur note ses retours horodatés → « Copier
    pour Claude » → corrections chirurgicales par timecode → re-render →
    re-master → re-verify → renvoi.
17. **Chaque retour généralisable devient une règle** : mémoire persistante +
    `DESIGN.md`. Le retour vaut pour toutes les vidéos suivantes, pas pour
    celle-là seulement.

## Les pièges qui ont coûté des versions

- Le sujet dans la zone que l'interface recouvre (premier reel du créateur,
  format 01 : menton sous 1470 px, 06/09) → format 04 par défaut + planche
  `scripts/safe-zone.mjs` regardée avant tout envoi.
- Bake et composition sur des EDL différents (v10) → autoverify le détecte.
- Couches détourage/vidéo à des scales différents → « 4 oreilles » (v12).
- Sous-titres sur le visage quand la tête monte pendant un zoom (v12).
- Micro-blancs invisibles au transcript (v14) → silencedetect systématique.
- Audio à -23 LUFS envoyé tel quel (v15) → master systématique.
- Heredoc python qui échoue en silence → script avec `assert` sur chaque ancre.

---

# Les garde-fous de livraison (02/09/2026)

Sept défauts sont partis chez le créateur sur cette vidéo. Aucun n'était une
question de goût : chacun était mécaniquement détectable, et aucun ne l'a été
parce que la seule barrière automatique — `autoverify` — ne regarde que le son.
Cette section existe pour qu'ils ne repartent pas.

```bash
npm run verify        -- --project <slug> --master   # le son, la parole, la fin
npm run verif-montage -- --project <slug> --master   # ce qui se voit
```

`verif-montage` vérifie, dans cet ordre :

| vérification | le défaut qu'elle attrape |
|---|---|
| `DOCTYPE en tête de composition` | casse `data-composition-src` : **toutes** les sous-compositions disparaissent du rendu, sans erreur, sans avertissement au lint |
| `éclats isolés dans les EDL` | plans de moins de 0,6 s isolés dans la source — les « micro-plans » qu'il voit clignoter |
| `départ vidéo à zéro` | `start_pts` vidéo > 0 avec l'audio à 0 : le lecteur ouvre sur une image noire |
| `format et bandes noires` | 16/9 exact, et aucune colonne noire sur les bords |
| `cartes visibles` | filet derrière le DOCTYPE : une animation déclarée qui ne change rien à l'image |

## Ce que la machine ne peut pas faire à ma place

Trois choses restent manuelles, et sauter l'une des trois coûte un aller-retour :

**La planche de contact complète, regardée en entier.** Une vignette toutes les
5 s sur toute la durée. C'est elle — et rien d'autre — qui a trouvé WhatsApp à
l'image, Tella pendant un téléchargement, TextEdit avec le script, et les six
cartes absentes d'un master qui passait `autoverify` 20/20.

**Le balayage des reprises en fenêtres isolées, à DEUX tailles.** whisper fusionne
une phrase dite deux fois quand il lit tout le fichier, et il n'est pas stable
vis-à-vis de la longueur de fenêtre : sur une vidéo longue, « peu importe la / peu importe
l'option » n'apparaît qu'en fenêtre de 8 s — ni en 12 s, ni en 16 s. Une seule
passe rate des reprises réelles quelle que soit sa taille.

**La relecture pleine résolution des raccords.** Une couverture doit CHEVAUCHER
ce qui la suit : arrêtée au bord d'une carte, elle laisse voir l'écran pendant
les 0,4 s de fondu d'entrée — une douzaine d'images, largement assez pour lire
ce qu'on voulait masquer.

## Trois pièges de derush, pour mémoire

**Un EDL n'est pas forcément chronologique.** Trier ses plans par temps source
annule le travail de « garder la dernière prise » en silence.

**Un EDL n'est pas forcément l'EDL d'un rush.** Un CTA monté ici décrivait une passe
décibel appliquée à un assemblage de deux rushes. Vérifier de quoi un EDL est
l'EDL avant de le réutiliser.

**Une ancre de parole peut disparaître d'un bake à l'autre.** Le micro capte les
haut-parleurs à −45 dB quand la voix est à −20 : whisper transcrit ce filet une
fois sur deux. Les bornes d'une lecture à l'écran se mesurent **au décibel**, pas
sur des mots.
