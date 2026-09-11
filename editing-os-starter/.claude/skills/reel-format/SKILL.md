---
name: reel-format
description: >
  Choisit le format standard d'un reel (04 sujet central — le défaut —, 02 avant/après,
  03 recréer viral, 01 split carte sur demande explicite), crée le projet daté depuis le
  scaffold correspondant et pose la checklist de la spec. Déclencher au démarrage de tout
  nouveau reel : « nouveau reel », « on monte un reel sur… », « quel format pour… »,
  « /reel-format ».
---

# reel-format — choisir et instancier le format d'un reel

Les formats standard vivent dans `formats/` (specs) et `style-templates/reel-0*`
(scaffolds). Ce skill est la porte d'entrée : il choisit, il instancie, il ne monte pas.

**Depuis le 06/09/2026, le format par défaut est le 04 · Sujet central**
(`formats/04-sujet-central.md`), défini par le créateur lui-même sur son retour du premier
reel : lui en plein cadre, visage au centre-haut dans la safe zone, éléments légers autour
de lui, scènes plein écran temporaires, sous-titres sous le menton. Les 01–03 viennent des
reels d'un autre créateur.

## Étape 1 — Choisir le format

Poser LA question : **qu'est-ce que le spectateur doit avoir compris à la seconde 3 ?**

| Réponse | Format |
|---|---|
| « Il y a un problème / une idée, et il va me l'expliquer » | **04 · sujet central** (défaut) |
| « Regarde la différence entre ces deux vidéos » | **02 · avant/après** |
| « Ce truc est dingue, et je vais pouvoir le refaire » | **03 · recréer viral** |
| Le créateur demande explicitement la carte en tiers bas | **01 · split carte** — jamais par défaut : sa carte met le visage dans l'interface |

Aides à la décision :
- Le sujet est une **sortie d'outil** dont l'effet se voit sur une vidéo → 02.
- Le sujet est un **contenu qui circule** (ou généré) qu'on va apprendre à reproduire,
  avec un doc/prompt à envoyer en DM → 03.
- Tout le reste (opinion, méthode, annonce, news, build-in-public) → 04.
- **Dès qu'il est à l'écran, quel que soit le format, les règles du 04 s'appliquent**
  (visage centre-haut, safe zone, sous-titres sur la ligne 1180). Les 02 et 03 gardent
  leur structure mais n'ont pas encore été validés par le créateur : les proposer avec
  une ligne d'argument, ne pas les imposer.

En cas de doute entre deux formats, présenter le choix au créateur avec une ligne
d'argument par option. Ne jamais mélanger deux formats dans un reel.

Si le reel ne rentre dans aucun format : le dire, monter à la main (avec la géométrie du
04 dès qu'il est à l'écran), et n'écrire un `05-*.md` que lorsque DEUX reels publiés se
ressemblent (règle du `formats/README.md`).

## Étape 2 — Instancier le projet

```bash
# depuis la racine editing-os-starter ; slug daté, convention AA-MM-JJ-sujet-kebab
cp -R style-templates/reel-04-sujet-central video-projects/AA-MM-JJ-<sujet>
cd video-projects/AA-MM-JJ-<sujet>
```

Puis, dans l'ordre :
0. **Lire `BRIEF.md`** (le scaffold l'embarque ; le créateur y répond avant de donner le rush :
   script tel que dit avec les mots jaunes marqués `*`, mode des sous-titres, CTA, preuves
   fournies, intention). Ses réponses priment sur tous les défauts ; une question sans
   réponse déclenche le défaut listé en bas du brief, sans demander.
1. Mettre à jour `meta.json` (slug, title, notes). Conserver le champ `format`.
   Déclarer la langue de la voix dès qu'elle est connue (`verify.language`, détectée
   en `-l auto` sur 15 s — voix tunisienne → skill `tunisien`) et le mode des
   sous-titres (`captions.script` : `franco` · `arabe` · `fr` · `en`) ; langue parlée
   ≠ langue des sous-titres.
2. **Cadrer le sujet** (format 04, § « Le cadre ») dès que le bake existe, sans
   détourer le rush : `node tools/cutout-frames.mjs` (le scaffold l'embarque dans
   `tools/`, avec `caps.mjs` pour proposer les groupes de sous-titres) détoure une image
   par plan (≈ 1 min) et sort le haut de tête par plan, `EYES` prêt à coller et le scale
   minimal ; une image du rush calibre l'offset des yeux (+275 sur MVI_3479, +290 sur
   MVI_3476). Poser `EYES` et les niveaux de zoom en tête du script d'`index.html`
   (`yeux × scale ≥ 732`, haut de tête ≥ 300 sur tous les plans). Le détourage vidéo
   n'arrive qu'après le storyboard, sur les seuls passages DERRIÈRE lui
   (`tools/cutout-ranges.mjs`). Vérifier sur images, jamais en CSS :
   `node scripts/safe-zone.mjs renders/draft.mp4 --every 3`.
3. La vérification et le master sont des scripts du **workspace**, pas du projet :
   `npm run verify -- --project <slug>`, `npm run verif-montage -- --project <slug>`,
   `npm run master -- --project <slug>`. Les mots-sentinelles et les réglages vivent dans
   le bloc `verify` de `meta.json`. **Format 03** : le hook et le payoff sont muets par
   design — `autoverify` ne connaît pas encore de zones muettes, relever `tailMax` pour le
   payoff et lire le rapport en le sachant.
4. Vérifier que les fonts sont là (`assets/fonts/`) — le scaffold les embarque.

## Étape 3 — Annoncer la suite

Le reste est le process standard, inchangé : **`PROCESS.md`** phase par phase
(transcription → montage parole → `design-beats` → composition → autoverify →
master → review). La spec du format (`formats/0N-*.md`) s'ajoute à la checklist
de la phase 4 — sa checklist finale doit passer en entier avant tout envoi.

Les différences de fabrication à ne pas rater :

- **04** : le reel **s'ouvre sur lui** ; chaque passage du storyboard porte son mode
  (SOLO / AUTOUR / PLEIN ÉCRAN / RETOUR), total plein écran ≤ 40 % ; la safe zone et la
  boîte visage se vérifient sur la planche `scripts/safe-zone.mjs` ; sous-titres une
  ligne, ≤ 26 caractères, ligne 1180.
- **01** : la densité (jamais > 1,5 s sans changement en zone haute) se vérifie sur
  le rendu avec `ffmpeg -vf "crop=iw:ih*0.5:0:0,select='gt(scene,0.15)',showinfo"` — et
  la carte remonte pour que le menton reste au-dessus de 1470 px.
- **02** : les deux volets = la même prise au même timecode ; vérifier sur images
  extraites que les gestes coïncident.
- **03** : la voix ne commence qu'à la fin du hook ; le CTA tombe entre 20 et 30 %
  de la durée totale ET la suite du script en dépend (« le lien que tu vas recevoir »).

## Ce que ce skill ne fait pas

- Il ne coupe pas la parole (skills `cut-silences`, `cut-mistakes`).
- Il ne fait pas le storyboard (skill `design-beats`).
- Il ne choisit pas les cartes (skill `motion-graphics` + `style-library/10-maison`).
- Il ne modifie jamais `formats/` pendant un montage : les specs n'évoluent que sur
  mesure de reels publiés — ou sur consigne explicite du créateur, comme le 04 le 06/09,
  et alors dans la spec, pas dans la vidéo en cours seulement.
