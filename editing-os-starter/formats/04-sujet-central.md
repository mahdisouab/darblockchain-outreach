# Format 04 · Sujet central

> « Moi en plein cadre, le visage au centre-haut ; les animations viennent autour de moi sans me cacher, et quand un visuel mérite toute l'attention il prend l'écran, puis on revient sur moi. »
>
> Défini le **06/09/2026 par le créateur lui-même**, à partir de son retour sur le
> premier reel (`video-projects/26-09-05-historique-claude-instagram`, monté en
> format 01). **C'est le format PAR DÉFAUT de tout reel face caméra depuis cette date.**
> Les formats 01, 02 et 03 viennent des reels d'un autre créateur ; celui-ci est le sien.

---

## Pourquoi ce format existe — le retour du 06/09

Sur le premier reel (format 01, split carte) :

- **Ce qui était bon, à conserver tel quel :** les graphiques, animations et éléments
  visuels (« excellents ») et **le style des sous-titres** (typo, lisibilité, rythme,
  mots jaunes). Ce sont les références.
- **Ce qui ne l'était pas :** sa position à l'écran. La carte speaker du format 01
  (`top 1250 → 1878 px`) le plaçait **trop bas et trop près de la limite de la safe
  zone** : les 450 px du bas sont recouverts par l'interface Instagram (légende, nom,
  son). Mesuré sur le master v4 à 20 s : la ligne des yeux à ~1400 px, le menton
  sous 1470 px.

Le format 04 garde les animations et les sous-titres, et **remet le créateur au centre**.

---

## La safe zone (1080 × 1920) — l'image de référence du créateur

| Zone | Pixels | Ce qui s'y trouve sur la plateforme |
|---|---|---|
| **Haut interdit** | y 0 → 220 | barre de statut, titre « Reels », caméra |
| **Bas interdit** | y 1470 → 1920 | nom du compte, légende, son, bandeau |
| **Colonne droite interdite** | x 980 → 1080, y 1000 → 1470 | like, commentaire, partage, menu |
| **Marges latérales** | 35 px de chaque côté | bord d'écran, arrondis |
| **Safe zone** | **x 35 → 1045 · y 220 → 1470** (moins la colonne) | tout ce qui doit être vu |

Règle : **rien d'important ne vit dans une zone interdite** — ni le visage, ni un texte,
ni un chiffre, ni un élément d'interface redessiné qu'on doit lire. Le bas du corps
(torse, mains) peut passer sous 1470 px : c'est du sujet, pas de l'information.

Les tokens vivent dans `tokens-formats.css` (`--safe-top`, `--safe-bottom`,
`--safe-side`, `--safe-col-*`). Pour VOIR la safe zone sur un rendu :

```bash
node scripts/safe-zone.mjs renders/<rendu>.mp4 --every 3      # planche de contact zonée
node scripts/safe-zone.mjs renders/<rendu>.mp4 --t 1.5,12,40  # images pleine résolution
```

---

## Le cadre — la géométrie canonique

```
 0 %  ┌──────────────────────────┐
      │ ░░░░░ interdit 0–220 ░░░░ │
      │ ┌──────────────────────┐ │ 220 : haut de la safe zone
      │ │  poche    ┌────┐  poche│ │
      │ │  gauche   │TÊTE│ droite│ │ 384 : haut de tête (médiane) — jamais < 300
 38 % │ │           │ ●● │      │ │ 732 : LIGNE DES YEUX (36–40 % de la hauteur)
      │ │           └────┘      │ │ 996 : menton
      │ │  épaule ╱        ╲ épaule│ 1020–1160 : poches épaules (recouvrent l'épaule,
      │ │                       │░│              jamais le visage)
 61 % │ │ ═════ SOUS-TITRE ═════ │░│ 1180 : ligne de sous-titre, une ligne, ≤ 860 px
      │ │       pied (chips)     │░│ 1290–1460 : chip CTA / source
      │ └──────────────────────┘░│ 1470 : bas de la safe zone
      │ ░░░░░ interdit 1470–1920 ░ │
100 % └──────────────────────────┘        ░ = colonne d'icônes x 980–1080 (y 1000–1470)
```

### Le sujet : plein cadre, yeux à 38 %

Deux couches vidéo, **au même transform à tout instant** (règle des « 4 oreilles »,
héritée du format 01) : `assets/edit.mp4` (le fond, la pièce) et le détourage. **Depuis le
10/09 le détourage est ciblé** (retex du reel watermark, validé par le créateur) : il n'existe
que sur les passages où quelque chose passe DERRIÈRE lui (`tools/cutout-ranges.mjs`, un `<video>`
alpha par passage, en secondes montées), et le cadrage se mesure sur **une image détourée par
plan** (`tools/cutout-frames.mjs`, ≈ 1 min) au lieu du rush entier (75 min pour 10 s d'usage).
Le voile sombre des beats AUTOUR couvre toute l'image, lui compris (`--f04-dim: 0.18`).

| Élément | Valeur canonique (rush 1080 × 1920 du 26-09-05) |
|---|---|
| Cible : ligne des yeux | **y 732 (38,1 %)** — plage tolérée 36–40 % (690–770) |
| Cible : haut de tête | ~384 px ; **jamais sous 300 px** sur aucun plan |
| Cible : menton | ~996 px ; jamais sous 1080 (la ligne de sous-titre est à 1180) |
| Transform | `scale(1.20)` · `transform-origin: 50% 0%` · `y = EYE_TARGET − EYE_SRC × scale` |
| Constantes de CE rush | `EYE_SRC = 610` (ligne des yeux dans la source), haut de tête source médian 320 (p5 260, max 360) |
| Boîte visage (à ne jamais recouvrir) | **x 330 → 810 · y 290 → 1020** |
| Punch-in | 2–3 par minute, sur un mot d'emphase : `scale 1.28`, `y` recalculé par la même formule — **les yeux ne bougent pas, le visage grandit** |

**Comment on obtient ces chiffres sur un nouveau rush** (5 minutes, avant toute
composition) :

1. `node tools/headline.mjs assets/rush-cutout.webm assets/edl.json` → haut de tête
   médian, p5, max, et par plan (l'alpha du détourage fait foi, pas l'œil).
2. Extraire une image du rush (`ffmpeg -ss 12 -i assets/rush.mp4 -frames:v 1 -update 1 f.png`),
   lire la ligne des yeux → `EYE_SRC`. Chez ce créateur, `yeux ≈ haut de tête médian + 290`.
3. Choisir `scale` pour que `EYE_SRC × scale ≥ 732` (sinon `y > 0` ouvre une bande en
   haut du cadre) et que le haut de tête au p5 reste ≥ 300 px. 1,20 convient à un rush
   cadré comme le 26-09-05 ; un rush plus large demande 1,3–1,4.
4. La ligne de tête **peut flotter** de ±60 px d'un plan à l'autre (rien ne vit au-dessus
   de la tête) ; un plan hors de [300, 460] reçoit un `FRAMING` par plan (d'abord un
   surcroît de `scale`, ensuite seulement un `y`).
5. Vérifier sur images : `node scripts/safe-zone.mjs renders/draft.mp4 --every 3`.

### Les poches — où vivent les éléments « autour de moi »

| Poche | x | y | Pour | Taille max |
|---|---|---|---|---|
| **TÊTE-GAUCHE** | 35 → 320 | 240 → 1000 | chip, icône, chiffre clé, logo, mini-capture | 280 px de large |
| **TÊTE-DROITE** | 820 → 1045 | 240 → 1000 | idem | 220 px de large |
| **ÉPAULE-GAUCHE** | 35 → 420 | 900 → 1150 | mini-carte, étiquette, mini-graphe (recouvre l'épaule) | 380 × 250 |
| **ÉPAULE-DROITE** | 660 → 960 | 900 → 1150 | idem — s'arrête 20 px avant la colonne d'icônes (980) | 300 × 250 |
| **PIED** | 35 → 980 | 1290 → 1460 | chip CTA (« commente X »), source, progression | 940 × 150 |
| **DERRIÈRE** | tout le cadre | tout | grand mot, carte, forme, **entre le fond et le détourage** — le sujet l'occulte naturellement | libre |
| BANDEAU-HAUT | 35 → 1045 | 232 → 276 | une étiquette mono persistante, ≤ 44 px — seulement si la tête du plan est ≥ 360 | 1 ligne |

Un élément « autour » ne recouvre **jamais** la boîte visage. Il peut recouvrir une
épaule, un bras, la pièce. Sa position se choisit **par passage** selon l'espace que
laisse la posture du plan (les poches ci-dessus valent pour le cadrage canon ; un plan
où il penche à gauche ouvre la droite et ferme la gauche — le storyboard le note).

### La scène plein écran

Quand un visuel prend l'écran, **le sujet sort** (fond + détourage + ses graphiques
autour) et la scène occupe tout le cadre sur le fond noir texturé (`.reel-bg`) :

| Élément | Valeur |
|---|---|
| Contenu lisible | x 35 → 1045 · **y 220 → 1140** — et sous y 1000, x ≤ 980 (la colonne d'icônes). La scène peut peindre plein cadre, son contenu reste là |
| Ligne de sous-titre | inchangée (1180) — le sous-titre continue pendant le plein écran |
| Pied | 1290 → 1460 disponible pour une pastille source |
| Durée type | 2 à 6 s ; **total plein écran ≤ 40 % du reel** (il reste le sujet principal) |
| Entrée | 0,32 s : whip (`power4.out`, scale 1,3 → 1, blur 14 → 0, x ±120) pendant que le sujet part (scale 1 → 0,94, alpha → 0, 0,28 s `power2.in`) |
| Sortie | 0,22 s : la scène s'efface (scale → 1,06, blur, alpha → 0) pendant que le sujet revient (0,3 s `expo.out`) |
| SFX | whoosh à l'entrée, whoosh-2 au retour, volumes du pack |

Pas de plein écran à la frame 1 : **le reel s'ouvre sur lui** (SOLO ou AUTOUR) — son
visage et le haut du corps doivent être visibles immédiatement.

### Les couches (de bas en haut)

```
z0  .reel-bg          fond noir texturé (visible pendant le plein écran)
z1  #stage            ── le groupe « lui » (tout ce qui sort pendant un plein écran) ──
     ├ #vwrap  video   fond (edit.mp4)                          ─┐ MÊME transform,
     ├ #behind         éléments DERRIÈRE le sujet                  │ toujours
     ├ #cutwrap video  détourage CIBLÉ (assets/cut/<passage>.webm) ─┘ (10/09 : seulement sous #behind)
     ├ #dim            voile noir 0 → 0,18 sur toute l'image pendant un beat AUTOUR
     └ #around         éléments dans les poches
z6  #takeover         la scène plein écran
z7  #foot             chip de pied (CTA / source)
z8  #cap              le sous-titre
```

Le scaffold `style-templates/reel-04-sujet-central/index.html` porte cette structure et
les aides `frame()`, `punch()`, `around()`, `behind()`, `takeover()`, `foot()`.

---

## Les trois modes d'écran — et le retour

C'est la grammaire du format. **Chaque passage du storyboard porte son mode.**

| Mode | Ce qu'on voit | Quand | Ce qui est interdit |
|---|---|---|---|
| **SOLO** | lui, plein cadre, éventuellement un punch-in | l'accroche (première seconde), une opinion, une émotion, une transition d'idée, le CTA parlé | le laisser figé plus de ~3 s sans rien : un punch-in, un mot derrière lui, ou un chip suffisent |
| **AUTOUR** | lui + des éléments légers dans les poches ou derrière lui | l'animation **illustre** ce qu'il dit : chiffre clé, mot important, icône, logo, image, capture recadrée, mini-graphe, petite animation contextuelle | masquer le visage ; empiler plus de deux éléments à la fois ; un élément qui demande à être LU en grand |
| **PLEIN ÉCRAN** | la scène seule, lui absent | le visuel est **important, complexe ou chargé** : une interface qui s'exécute, une preuve (article, capture réelle), un chat qui streame, une comparaison, une timeline, un tableau de chiffres — tout ce qui a besoin de toute la largeur pour être compris | l'enchaîner deux fois sans revenir sur lui (sauf une démo continue) ; dépasser ~6 s d'un coup ; ouvrir le reel dessus |
| **RETOUR** | lui revient, la scène s'efface | après chaque plein écran, **avant** l'idée suivante | revenir en plein milieu d'une phrase clé si l'animation n'est pas terminée — on cale le retour sur un mot |

La logique visée : **lui → visuel important en plein écran → retour sur lui pour
poursuivre**. Le plein écran s'utilise quand il **améliore vraiment la compréhension ou
le rythme**, pas systématiquement. Une carte-article lisible en 300 px ? AUTOUR. Une
interface avec du texte à lire ? PLEIN ÉCRAN.

Comment choisir, en une question par passage : *« si je pose ce visuel à côté de sa
tête en 280 px de large, est-ce qu'on le comprend ? »* Oui → AUTOUR. Non → PLEIN ÉCRAN.
Rien à montrer → SOLO, et c'est très bien.

---

## Les sous-titres — le style validé, conservé

Le style du premier reel est **la référence** (« j'ai beaucoup aimé »). Il ne change pas :

- **Garet Black (900), 62 px, blanc, lettrage −0,05 em**, centré, **une seule ligne**
  (`white-space: nowrap`), ≤ 26 caractères par groupe.
- **Groupes de 1 à 4 mots, remplacés en bloc, 0,6 à 1,2 s** par groupe, coupés sur le
  sens (`tools/caps.mjs` du 26-09-05 propose le découpage ; on relit et on coupe au sens).
- **Mots importants en jaune `#FFD935`** (préfixe `*` dans `CAPS`), un par groupe au plus.
- Entrée : `scale 0,94 → 1`, alpha 0 → 1, 0,12 s `power3.out`. Pas de SFX.

Ce qui change avec le format : **la position**, et une garantie de lisibilité.

- **Ligne fixe à `top: 1180px`** (61 %), sous le menton (~996), dans la safe zone, au-dessus
  du pied. Elle ne bouge jamais, quel que soit le mode : c'est le repère de l'œil.
- **Largeur ≤ 860 px** (x 110 → 970) : la colonne d'icônes commence à 980.
- **Halo sombre** en plus de l'ombre portée (`text-shadow` empilée : `0 3px 8px`,
  `0 0 22px`, `0 0 44px`) — le sous-titre est posé sur un vêtement clair ou sur une
  scène blanche, plus sur un interstice noir. Une pastille sombre (`.cap.pill`) existe
  en option si un fond reste illisible ; par défaut, non.
- **Jamais sur le visage, jamais sur un visuel** : la scène plein écran arrête son contenu
  à 1140 ; un élément « autour » ne descend pas sous 1150. Si ça se bouscule, c'est le
  visuel qui bouge, pas le sous-titre (hiérarchie ci-dessous).

---

## Le rythme — la fonction d'abord

Le montage est **dynamique mais pas surchargé**. Chaque animation a une fonction :
maintenir l'attention, illustrer, faciliter la compréhension, mettre en valeur une
information. **Aucun effet pour remplir l'écran.**

- Tout ce qui est **nommé** est montré (grille de `design-beats`) : c'est ça qui fait la
  densité, pas un métronome. Sur un script dense on retombe naturellement vers un
  événement visuel toutes les 1 à 2 s ; sur un passage d'opinion, deux phrases en SOLO
  avec un punch-in sont légitimes. **Un passage SOLO n'est pas une frame morte.**
- Ce qui reste interdit : un **graphique figé** à l'écran (tout élément affiché plus de
  ~0,5 s porte une animation d'entretien — dérive, shimmer, curseur, compteur) et une
  **scène plein écran immobile**.
- Quand une phrase se comprend mieux avec un visuel pertinent, on **prend l'initiative**
  de l'ajouter — dans le mode qui convient.
- Le seuil « jamais plus de 1,5 s sans changement en zone haute » du format 01 **ne
  s'applique pas** ici : il mesurait les reels d'un autre créateur. La mesure qui compte
  pour ce format : pourcentage de plein écran (≤ 40 %) et zéro graphique figé.

---

## La hiérarchie quand ça se bouscule

Pour chaque scène, dans cet ordre. Un conflit se règle par le rang, jamais en essayant
de tout afficher :

1. **La compréhension du message.**
2. **Son visage / sa présence comme point focal** quand il est à l'écran.
3. **Le respect des safe zones.**
4. **Des sous-titres lisibles.**
5. **Les animations et éléments graphiques.**
6. **Le dynamisme et l'esthétique.**

Exemple : un mini-graphe « autour » toucherait le sous-titre → il remonte dans la poche
épaule (5 cède à 4). Une scène plein écran gagnerait en beauté avec du contenu jusqu'à
1300 → non, 1140 (6 cède à 3 et 4). Une carte serait plus belle sur son visage → jamais
(6 cède à 2).

---

## Adaptation intelligente

Ces règles définissent le style ; elles ne rigidifient pas le montage. Le storyboard
analyse chaque passage et choisit entre **lui seul**, **lui + éléments autour**,
**visuel plein écran**, **retour vers lui**, pour que la composition de l'écran évolue
avec ce qu'il raconte — naturel, moderne, rythmé.

Ses retours suivants affinent le style : **ce qui a été explicitement validé sur une
vidéo reste la référence** sauf indication contraire ; ce qui est corrigé devient une
règle ici, pas seulement une retouche de la vidéo en cours.

---

## Checklist avant envoi (en plus de la colonne vertébrale de `README.md`)

- [ ] Frame 1 : lui à l'écran (SOLO ou AUTOUR), jamais un plein écran
- [ ] Ligne des yeux entre 36 et 40 % ; haut de tête ≥ 300 px sur **tous** les plans (`tools/headline.mjs`)
- [ ] Rien d'important dans les zones interdites — vérifié sur la planche `scripts/safe-zone.mjs`, pas en CSS
- [ ] Aucun élément dans la boîte visage (x 330–810 · y 290–1020) à aucun moment
- [ ] Sous-titres : une ligne, ≤ 26 caractères, ≤ 860 px, sur leur ligne (1180), jamais sur un visuel
- [ ] Plein écran : ≤ 6 s d'un coup, ≤ 40 % du total, chaque plein écran se referme sur lui, retour calé sur un mot
- [ ] Chaque élément affiché > 0,5 s porte une animation d'entretien ; aucun effet « pour remplir »
- [ ] Deux couches vidéo au même transform sur toute la timeline (pas de « 4 oreilles »)
- [ ] Dernier mot à ≤ 0,3 s de la fin
- [ ] `npx hyperframes lint` propre · `npm run verify` PASS · `npm run verif-montage` PASS · master −14 LUFS / −1 dBTP
- [ ] Planche de contact complète **avec la safe zone**, regardée en entier

## Scaffold

```bash
cp -R style-templates/reel-04-sujet-central video-projects/AA-MM-JJ-mon-sujet
```

Le scaffold embarque `tools/` (issus du 26-09-05, tous génériques) : `headline.mjs`
(haut de tête par plan sur l'alpha), `caps.mjs` (proposition de groupes de sous-titres),
`phrases.mjs` (lecture du transcript par phrases), `bake.mjs` (bake unique EDL → edit.mp4 /
cutout / voix / transcript, avec vérification que `SEG` d'`index.html` est identique),
`blanks.mjs` (rabotage des micro-blancs au décibel) et `sfx.mjs` (les `<audio>` SFX depuis
`assets/sfx.json`).
