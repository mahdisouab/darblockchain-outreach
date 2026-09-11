# Sous-titres d'une vidéo en tunisien

**Langue parlée ≠ langue des sous-titres.** La voix est en tunisien ; les sous-titres sont
dans le système d'écriture que le projet demande. Ne jamais supposer que c'est du français.

## 1. Le choix se déclare dans `meta.json`

```json
"captions": { "script": "franco" }
```

| `captions.script` | Sous-titres | Quand |
|---|---|---|
| `franco` | tunisien en alphabet latin, chiffres 3 7 5 9, mots FR/EN tels quels | **défaut d'une voix tunisienne** quand rien n'est déclaré ; le signaler « à valider » dans le storyboard |
| `arabe` | tunisien en alphabet arabe (jamais du MSA) | sur demande explicite (« sous-titres en arabe ») |
| `fr` | traduction française par groupe de sens | sur demande (« sous-titres en français ») |
| `en` | traduction anglaise par groupe de sens | sur demande |
| `none` | pas de sous-titres | formats sans sous-titres |

Le champ absent sur une voix tunisienne = `franco` + question au créateur. Un projet peut
demander deux versions (« fi les deux versions bech ne5tar ») : produire les deux listes
`CAPS`, en commenter une.

## 2. Règles communes (héritées de DESIGN.md et du format)

- Groupes de **1 à 4 mots**, remplacés en bloc, **0,6 à 1,2 s** par groupe, coupés sur le
  **sens** (le mot qui porte peut tenir seul 0,6 s).
- Timecode = `start` du premier mot whisper du groupe, en temps **source**, passé par
  `ed(src)` dans la composition.
- Mot-clé préfixé `*` → jaune : le mot qui porte le groupe — marque, chiffre, terme
  technique, verdict (`*zéro`, `*ATS`, `*100 %`, `*serrek`). Un par groupe au plus, pas dans
  chaque groupe.
- **Une seule ligne**, jamais sur le visage ni sur un visuel (mesuré sur images). À 62-66 px
  sur 1080 de large, un groupe tient sous **~24 caractères** ; au-delà, couper le groupe.
- Ponctuation minimale : virgule ou point final quand la phrase se ferme, `?` sur la question
  du hook, jamais de point-virgule ni de parenthèse.
- Le dernier sous-titre s'éteint avec le dernier mot (`tailMax`).

## 3. Mode `franco` (défaut)

**Fidélité à la bouche.** On écrit ce qu'il dit, dans l'ordre où il le dit, y compris les
mots français et anglais, les contractions et le registre. On ne corrige pas sa grammaire, on
ne remplace pas `rod belek` par « fais attention », on ne traduit pas `ma yousalch` par
« n'arrive pas ». On coupe seulement ce que le montage a coupé (tics, reprises).

Graphie : `graphies.md` § 3. Les décisions par projet vont dans un **glossaire** au-dessus de
`CAPS` dans `index.html` :

```js
/* GLOSSAIRE (une graphie par mot, tout le reel) : mte3 · bech · 5ater · elli · ynajem ·
   fl / mel / lel · l'IA (dit [i-a]) · ATS · CV · recruteur · mots-clés */
const CAPS = [
  [0.40, "Na3ref elli"], [1.04, "*barcha menkom"], [1.78, "yeb3thou fel CV"], ...
];
```

Découpage des groupes : ne jamais séparer `ma … ch` de son verbe, `el` de son nom, `mte3`
de ce qu'il possède, `bech` de son verbe, `5ater l7a9`, `rod belek`, `kol chay`, ni un
sigle de son article (`el ATS`). Une négation seule (`ma yjaweb`) est un groupe légitime de
0,6 s : c'est souvent la chute.

Chiffres en chiffres : `50 entreprise`, `100 %`, `2025`, `90 %`.

Exemple de reconstruction (reel du 05/09 ; temps du transcript monté `assets/transcript.json`,
un `CAPS` de composition porterait les temps source correspondants) :

| whisper | verbatim → CAPS |
|---|---|
| ومفهم حتى بلافثور محمية 100% في 2025 | `[26.1, "w ma famma"], [26.6, "7atta *plateforme"], [27.2, "ma7miya *100 %"], [28.2, "fi 2025"]` |

## 4. Mode `arabe` (sur demande)

Tunisien en lettres arabes, pas de l'arabe standard : `graphies.md` § 4 (باش, ما…ش, اللي, متاع,
برشة, توّا, كيفاش ; jamais لقد, سوف, يجب أن, ليس). Marques, sigles et termes techniques restent
en latin dans la ligne (نستعمل Claude, الـATS, فايل PDF) sauf choix contraire du créateur.

Contraintes techniques, toutes bloquantes avant un rendu :

1. **Police** : les polices du scaffold (Garet, Inter Tight, Instrument Serif) n'ont pas de
   glyphes arabes — le texte sortirait en carrés ou en fallback système. Embarquer une police
   arabe lourde (Noto Sans Arabic, Cairo, Tajawal, IBM Plex Sans Arabic, graisse 800-900)
   dans `assets/fonts/`, la déclarer en `@font-face`, l'appliquer à `.cap`.
2. **Direction** : `.cap { direction: rtl; unicode-bidi: plaintext; text-align: center; }`.
   Les îlots latins (ATS, 100 %, Claude) se placent d'eux-mêmes avec `plaintext` ; vérifier
   sur une image extraite que « 100 % » et la ponctuation ne sautent pas en bout de ligne.
3. **Chiffres** : chiffres occidentaux (100 %, 2025) — c'est ainsi que le créateur les lit.
4. **Ponctuation** arabe : `،` `؟`.
5. **Longueur** : les mots arabes sont plus compacts ; garder 1 à 4 mots et ~24 caractères.
6. **Regarder une image** de chaque type de ligne (mot arabe seul, ligne avec îlot latin,
   ligne avec chiffre) avant de rendre l'ensemble : le shaping (liaisons des lettres) et le
   bidi ne se vérifient qu'à l'œil.

Même phrase que ci-dessus : `[26.1, "و ما فمّا"], [26.6, "حتّى *plateforme"], [27.2, "محمية *100 %"], [28.2, "في 2025"]`.

## 5. Modes `fr` / `en` (traduction)

Traduire **par groupe de sens**, pas mot à mot : garder la chute, l'ordre des révélations,
les marques, les chiffres et le mot-clé au même endroit que dans la parole. Le verbatim
Franco-Tunisien reste dans le storyboard (colonne « il dit ») : c'est lui qui ancre les beats
et qui permet au créateur de vérifier que la traduction ne dit pas autre chose.

Le reel du 05/09 a été livré en `fr` par défaut, faute de choix déclaré : c'est exactement ce
que ce skill évite — la traduction est un mode, pas un réflexe.

## 6. Textes à l'écran (slams, étiquettes, UI, cartes)

- Les **mots-chocs** (slam, tag jaune, compteur) suivent la langue des sous-titres par défaut
  (`franco` → `*ZÉRO`, `*ATS`, `SERREK` ; `arabe` → `سرّك`). Un mot français dans la bouche
  s'affiche en français quel que soit le mode.
- Les **interfaces redessinées** (ChatGPT, Google, LinkedIn) sont dans la langue de la vraie
  interface que l'audience voit (souvent le français), pas en Franco-Tunisien.
- Les **cartes-article** gardent le titre original de la source.
- Les **messages de chat vivant** et les exemples inventés pour illustrer suivent la langue
  dans laquelle le spectateur écrirait vraiment ce message (un étudiant tunisien écrit à
  ChatGPT en français ou en Franco-Tunisien : choisir par cohérence avec le mode des
  sous-titres, et le dire dans le storyboard).
- Une phrase tunisienne produite pour l'écran (CTA, étiquette) passe le test de
  `naturalite.md` § 3 avant d'être composée.

## 7. Validation avant rendu

- [ ] Chaque groupe relu à voix haute contre le transcript : c'est ce qu'il dit, dans cet ordre.
- [ ] Aucune graphie en double dans le glossaire ; aucun mot français « phonétisé ».
- [ ] Aucun groupe > 4 mots ni > ~24 caractères ; durée 0,6-1,2 s ; `*` sur le mot qui porte.
- [ ] Mode déclaré dans `meta.json` et rappelé en tête du storyboard (« sous-titres : franco,
  à valider »).
- [ ] Mode `arabe` : police embarquée, RTL, une image extraite regardée par type de ligne.
- [ ] Les incertitudes `[?]` du verbatim ne portent ni `*` ni visuel.
