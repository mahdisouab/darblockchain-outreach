---
name: design-beats
description: Directeur artistique du reel. Écoute le transcript monté et propose une animation avancée quasi chaque seconde, comme un designer, AVANT toute composition. Déclencher après le montage parole (bake propre) et avant d'écrire la moindre ligne de composition HyperFrames — ou quand le créateur dit "storyboard", "propose les animations", "fais le designer".
---

# Design Beats — le designer qui écoute

## Pourquoi cette étape existe

Constat (17/08, reel montage-ia) : la v1 était loin du résultat final —
tout le niveau « designer » est arrivé par ses retours successifs (drag & drop montré,
timeline de nettoyage, croix rouges, PDF qui scrolle...). Cette étape fait ce travail
AVANT la première version : on écoute ce qu'il dit, seconde par seconde, et on propose
l'animation qui le MONTRE. La v1 doit ressembler à une v10.

Second constat (06/09, premier reel du créateur) : les animations étaient « excellentes »,
mais **lui** était mal placé — trop bas, dans la zone que l'interface recouvre — parce que
le storyboard décidait ce qu'on montre sans décider **où il est et où va le visuel**.
Depuis, chaque passage du storyboard porte son **mode d'écran** (§ 1bis) et le format par
défaut est `formats/04-sujet-central.md` : il reste le sujet principal.

## Entrées

1. Le transcript mot à mot du montage parole terminé (bake propre, temps édités via `ed(src)`).
2. `style-library/10-maison/DESIGN.md` — lu EN ENTIER avant de proposer quoi que ce soit.
3. `style-library/10-maison/PLAYBOOK.md` — la grammaire de montage (18/08, dérivée
   des corpus Nathan Hodgson et Nick Saraev). C'est lui qui fixe le choix
   ci-dessous et les trois lois (zéro frame morte, course aux assets, tout animé).
4. `PROCESS.md` et la mémoire persistante (règles gravées des retours précédents).
5. Si la voix est en tunisien : le skill `tunisien`, chargé AVANT. Il fournit le
   verbatim reconstruit (Franco-Tunisien + glose FR), le mode des sous-titres
   (`captions.script`) et la liste des mots incertains `[?]` — sur lesquels aucun
   beat, aucun mot-clé jaune et aucun texte à l'écran ne se posent.
6. **`formats/04-sujet-central.md`** (ou la spec du format choisi) : la safe zone, la
   géométrie du sujet, les poches autour de lui, les trois modes d'écran, la hiérarchie
   en cas de conflit. Lu avant de proposer le moindre beat — un beat sans place n'est pas
   un beat.

## La méthode

### 0. Choisir la grammaire (PLAYBOOK.md, « La règle de choix »)

Avant tout storyboard, lire le script et trancher :

- **WORKFLOW** (« voilà comment je fais X ») → plans de 3-6 s, chaque étape
  devient une séquence d'UI redessinée qui S'EXÉCUTE (`soc-ui-run`) ;
  15-18 beats/minute.
- **NEWS** (« X vient de sortir ») → plans de 1-3 s, captures RÉELLES en preuve,
  cycles NOM → PREUVE → MÉCANISME → BÉNÉFICE ; 25-30 beats/minute.

Annoncer le choix en tête du storyboard. Ensuite, **lancer la course aux
assets** : chaque nom propre du script → un asset web via `insert-broll`
(screenshot Playwright, page GitHub, logo). La beat-map liste l'asset requis
par beat ; rien ne se compose avant que les assets existent.

### 1. Écouter, pas survoler

Relire le texte monté phrase par phrase en se posant, pour chaque groupe de sens
(~1-3 s de parole), LA question du designer : **« qu'est-ce qu'on MONTRE pendant
qu'il dit ça ? »** Jamais « quel texte on affiche » — qu'est-ce qu'on montre.

Sur une voix tunisienne, l'écoute se fait sur le verbatim tunisien avec les marqueurs
de `tunisien/references/montage.md` § 1 (hook, promesse, bascules, mécanisme, preuve,
chute, CTA) — jamais depuis la glose française : illustrer la traduction, c'est
illustrer un autre texte. Les verbes derja ont leur visuel (`yeb3ath` → envoi,
`ylawej` → recherche, `ya3tik zéro` → croix rouge), les mots français de la phrase
sont des noms propres du script (course aux assets).

### 1bis. Décider le mode d'écran de chaque passage (format 04, 06/09)

Le créateur est le sujet principal. Pour chaque groupe de sens, après « qu'est-ce qu'on
montre ? », la deuxième question du designer : **« et où ça se passe ? »**

| Mode | On le choisit quand… | La place |
| --- | --- | --- |
| **SOLO** | rien à montrer, ou la phrase porte par elle-même : accroche, opinion, émotion, transition d'idée, CTA parlé | lui, plein cadre ; un punch-in ou un mot DERRIÈRE lui suffit à tenir 2–3 s |
| **AUTOUR** | le visuel **illustre** ce qu'il dit : chiffre clé, mot important, icône, logo, image, capture recadrée, mini-graphe, petite animation contextuelle | une poche (TÊTE-GAUCHE / TÊTE-DROITE / ÉPAULE-GAUCHE / ÉPAULE-DROITE / PIED) ou DERRIÈRE lui — jamais la boîte visage, jamais plus de deux éléments à la fois |
| **PLEIN ÉCRAN** | le visuel est **important, complexe ou chargé** : UI qui s'exécute, preuve (article, capture réelle), chat qui streame, comparaison, timeline, tableau de chiffres | la scène entière, lui absent ; contenu lisible entre y 220 et 1140 ; 2 à 6 s d'un coup |
| **RETOUR** | après chaque plein écran, avant l'idée suivante | calé sur un mot précis, jamais au milieu d'une phrase clé |

Le test en une question : *« posé à côté de sa tête en 280 px de large, est-ce qu'on le
comprend ? »* Oui → AUTOUR. Non → PLEIN ÉCRAN. Rien à montrer → SOLO, et c'est très bien.

Contraintes fermes : le reel **s'ouvre sur lui** (jamais un plein écran à la frame 1 :
son visage et le haut du corps doivent être visibles immédiatement) ; **total plein écran
≤ 40 %** de la durée ; deux plein écran ne s'enchaînent pas sans retour sur lui (sauf une
démo continue) ; le sous-titre reste sur sa ligne (1180) dans tous les modes.

Sur une posture particulière (il penche, il lève la main), la poche se choisit sur
l'image du plan, pas sur la géométrie canon : le storyboard le note.

### 2. La grille de traduction (chaque chose nommée → son visuel)

| Il dit... | On montre... |
| --- | --- |
| un fichier, une vidéo donnée à un outil | le chip du fichier qui se **drag & drop** dans l'interface, pièce jointe visible |
| un outil qu'il utilise | l'interface réaliste de l'outil (thème officiel), en train de FAIRE |
| un outil qu'il n'utilise PAS | sa carte + **croix rouge qui se dessine** (2 traits, buzzer) |
| couper les silences / ratés, caler, poser des SFX | la **timeline de montage animée** : gaps qui se referment, clip ✕ éjecté, pills qui tombent |
| un chiffre, de l'argent | **compteur animé** (count-up/down), gradient or |
| un document, un guide | la **carte doc qui scrolle** par pages (skeleton + code + checklist) |
| une action de tournage/création | la **mascotte Claude** qui la joue (pixel, blinks, pattes) |
| une conversation avec l'IA | le **chat vivant** : typewriter, envoi, réponse qui streame |
| un avant/après | stack comparatif A/B |
| un chiffre SUR une vraie page (prix, étoiles GitHub, leaderboard) | le **spotlight jaune** : la capture réelle floutée sauf la zone, cadre jaune (`soc-spotlight-jaune`, 1-2 par reel max) |
| un asset du web sans zone à pointer (site, logo, UI) | le **media-slam** : une des 5 entrées animées + dérive continue (`soc-media-slam`, alterner les variantes) |
| une étape de workflow (« dis à Claude de... ») | l'**UI rejouée qui s'exécute** : frappe 45 ms/car, statuts, badges jaunes, compteur (`soc-ui-run`, ne jamais couper avant la fin) |
| le CTA | mot-clé jaune géant + **barre de commentaire qui se tape et se publie** — TOUJOURS la même carte (`soc-cta-comment`), c'est la répétition qui fait l'actif de marque |

Chaque ligne a son mode naturel : chip, croix rouge, compteur, mascotte, mot-choc, logo →
**AUTOUR** ; interface qui fait, chat vivant, doc qui scrolle, stack A/B, spotlight, UI
rejouée → **PLEIN ÉCRAN** ; le CTA → lui à l'écran + la barre de commentaire en chip de
PIED, ou plein écran sur les 3 dernières secondes si le mot-clé doit être lu en grand.

Si rien ne colle : INVENTER un pattern dans le style (le vocabulaire ci-dessus est
né comme ça). Interdits : carte-label statique, texte qui répète la parole, décor.

### 3. Rythme : la fonction d'abord

- **Chaque animation a une fonction** : maintenir l'attention, illustrer, faire
  comprendre, mettre en valeur une information. **Aucun effet pour remplir l'écran**
  (06/09). Tout ce qui est nommé est montré — c'est ça qui fait la densité, pas un
  métronome : sur un script dense on retombe naturellement vers un événement visuel
  toutes les 1 à 2 s ; sur une opinion, deux phrases en SOLO avec un punch-in sont
  légitimes. **Un passage SOLO n'est pas une frame morte.**
- Ce qui reste interdit : un graphique **figé** plus de ~0,5 s (entretien : playhead,
  curseur, shimmer, dérive, compteur) et une scène plein écran immobile.
- L'animation d'un mot **démarre quand le mot commence** et vit assez longtemps.
- Les mots-chocs slamment dans l'espace LIBRE (une poche, ou DERRIÈRE lui) — jamais sur
  le visage, jamais sur l'illustration en cours.
- Chaque beat note son SFX (rôles du pack : whoosh, pop, click, buzzer, cash,
  riser, shutter, typing) — jamais de SFX sur les swaps de sous-titres.

### 4. Le livrable : un storyboard timecodé, présenté AVANT de composer

Un tableau, une ligne par beat :

```
| t_in–t_out (monté) | il dit (verbatim) | MODE · place | on montre | entrée / entretien / sortie | SFX |
```

`MODE · place` vaut `SOLO`, `AUTOUR · tête-gauche` (ou tête-droite, épaule-gauche,
épaule-droite, pied, derrière), `PLEIN ÉCRAN`, `RETOUR`. En tête du storyboard : la
grammaire choisie, le mode des sous-titres, et **le compte** — secondes en plein écran
sur la durée totale (≤ 40 %), nombre de retours, et le mot sur lequel le reel s'ouvre
(lui à l'écran).

Chaque `t_in` est ancré sur un mot précis du transcript (via `ed`). Présenter le
storyboard complet au créateur **avant d'écrire la composition** — c'est lui le DA
final : il coche, corrige, remplace. Ne composer qu'après son passage.

### 5. Après accord

Dérouler la composition (PROCESS.md phase 3) beat par beat depuis le storyboard
approuvé. Tout écart en cours de route (place, lisibilité) se re-propose, ne se
décide pas en silence.

## La hiérarchie quand ça se bouscule

Pour chaque scène, dans cet ordre — un conflit se règle par le rang, jamais en essayant
de tout afficher (`formats/04-sujet-central.md`) :

1. la compréhension du message ;
2. son visage / sa présence comme point focal quand il est à l'écran ;
3. le respect des safe zones ;
4. des sous-titres lisibles ;
5. les animations et éléments graphiques ;
6. le dynamisme et l'esthétique.

Un mini-graphe toucherait le sous-titre → il remonte dans une poche épaule. Une scène
plein écran serait plus belle avec du contenu jusqu'à 1300 → non, 1140. Une carte serait
plus belle sur son visage → jamais.
