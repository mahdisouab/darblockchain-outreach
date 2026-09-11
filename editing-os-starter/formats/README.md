# Formats — les reels standard

> Trois formats standardisés le 2026-08-18 à partir des 6 reels publiés d'un autre
> créateur (chiffres dans [`MESURES.md`](MESURES.md)), **et un quatrième, défini le
> 2026-09-06 par le créateur lui-même** à partir de son retour sur son premier reel :
> [`04-sujet-central.md`](04-sujet-central.md). **C'est le format par défaut.**
>
> **Ce dossier est la source de vérité de la géométrie et de la structure d'un reel.**
> `style-library/10-maison/DESIGN.md` reste la source de vérité du *look* (palette,
> typo, motion). Quand les deux se croisent, la géométrie est ici, le look est là-bas.

## Choisir en une question

> **Qu'est-ce que le spectateur doit avoir compris à la seconde 3 ?**

| Réponse | Format | Fichier |
|---|---|---|
| « Il y a un problème / une idée, et il va me l'expliquer » | **04 · Sujet central** (défaut) | [04-sujet-central.md](04-sujet-central.md) |
| « Regarde la différence entre ces deux vidéos » | **02 · Avant/après** | [02-avant-apres.md](02-avant-apres.md) |
| « Ce truc est dingue, et je vais pouvoir le refaire » | **03 · Recréer ce contenu viral** | [03-recreer-viral.md](03-recreer-viral.md) |
| Le créateur demande explicitement la carte en tiers bas | **01 · Split carte** (sur demande seulement) | [01-split-carte.md](01-split-carte.md) |

Si la réponse est « je ne sais pas », le reel n'est pas prêt à être monté. Ce n'est
pas un problème de montage.

Quel que soit le format, **dès qu'il est à l'écran, les règles du 04 s'appliquent**
(visage au centre-haut, safe zone, sous-titres sous le menton). Les 02 et 03 gardent
leur structure (deux volets, hook muet) mais leurs plans face caméra se cadrent comme le
04 — et ils n'ont pas encore été validés par le créateur : on les propose, on ne les
impose pas.

## Les formats en une ligne

| | 04 · Sujet central | 01 · Split carte | 02 · Avant/après | 03 · Recréer viral |
|---|---|---|---|---|
| **Ce que ça vend** | une idée, portée par lui | un point de vue | un outil | une recette |
| **Ce qu'on voit d'abord** | lui, plein cadre, visage au centre-haut | l'illustration + lui | les deux volets qui divergent | le contenu viral, en grand, muet |
| **Il est à l'écran** | tout du long, sauf les scènes plein écran (≤ 40 %) | tout du long, carte tiers bas | jamais dans la démo ; carte dans la vente | 0–9 s en détouré, puis plus du tout |
| **Durée type** | 30–60 s | 30–60 s | 35–55 s | 30–65 s |
| **CTA** | en sortie, lui + chip de pied | en sortie (85–95 %) | en sortie (90–95 %) | **à ~20–25 %**, en étape 1 |
| **Densité** | la fonction d'abord : tout ce qui est nommé est montré, zéro remplissage | 1 chgt / ~0,8 s | démo continue | 1 chgt / ~1 s |
| **Référence** | le retour du créateur, 06/09 | F1a `DbQDB7Go39M` ×0,86 | F2b `DZS0GnEoeps` ×1,00 | F3a `Db578PhInhG` **×2,37** |
| **Exemple rendu** | le premier reel monté en 04 en tiendra lieu | [exemples/01](exemples/01-split-carte.mp4) | [exemples/02](exemples/02-avant-apres.mp4) | [exemples/03](exemples/03-recreer-viral.mp4) |
| **Scaffold** | `style-templates/reel-04-sujet-central/` | `.../reel-01-split-carte/` | `.../reel-02-avant-apres/` | `.../reel-03-recreer-viral/` |

## La colonne vertébrale commune

Ces cinq règles valent pour tous les formats. Elles ne se renégocient pas par vidéo.

1. **Cadre 1080×1920, 30 fps, et la safe zone du créateur** (son image de référence,
   06/09) : les **220 px du haut**, les **450 px du bas** et la **colonne d'icônes**
   (x 980 → 1080, y 1000 → 1470) sont recouverts par l'interface — rien d'indispensable
   n'y vit jamais, **et surtout pas le visage**, qui se cadre au centre-haut (ligne des
   yeux à 36–40 % de la hauteur). Marges latérales 35 px. `node scripts/safe-zone.mjs`
   le dessine sur n'importe quel rendu.
2. **Rien ne recouvre le visage.** Ni sous-titre, ni carte, ni étiquette. Si la place
   manque, on déplace le layout, jamais la règle.
3. **Zéro graphique mort.** Tout élément qui tient plus de ~0,5 s porte une animation
   d'entretien (curseur, playhead, shimmer, zoom lent, compteur). Un visuel figé est un
   bug de montage, pas un choix. Un passage sur lui seul (mode SOLO du 04) n'est pas
   une frame morte : c'est lui qui porte.
4. **La parole finit avec la vidéo** — dernier mot à ~0,2 s de la fin — *sauf* payoff
   muet volontaire (format 03). Pas de queue morte, jamais.
5. **Master à −14 LUFS / −1 dBTP**, vérifié par `autoverify` sur le master, pas sur le
   draft. C'est ce fichier-là qu'on publie.

Et une règle de fabrication : **tout se cale sur les timestamps de mots du transcript**,
jamais à l'oreille. Un beat entre 0,2 à 0,6 s *avant* le mot qu'il illustre.

## Ce qui change d'un format à l'autre

Seulement trois choses. Tout le reste est commun.

- **La division du cadre** — lui plein cadre + poches autour + scènes plein écran
  temporaires / une carte en tiers bas / deux volets empilés / un média plein cadre.
- **La place** — présent tout du long sauf plein écran / présent tout du long /
  absent puis présent / présent puis absent.
- **La place du CTA** — en sortie / en sortie / en sortie / en étape 1.

## Les exemples rendus

`exemples/` contient un rendu court par format (01 à 03), visible aussi dans le dashboard
(Bibliothèques → Formats de reel → clic sur un format). L'exemple 01 est un extrait du
reel v18 réel ; les exemples 02 et 03 sont montés depuis les scaffolds avec les rushes
du même projet. Ils montrent la structure, pas un produit fini. Le 04 n'a pas encore
d'exemple : le premier reel monté dans ce format en tiendra lieu.

## Les références Instagram

`references/` contient une frame par format, extraite du reel publié le plus
représentatif (le layout entier en une image). Elle s'affiche à côté de l'exemple
rendu sur la page du format dans le dashboard. Le reste de la matière brute est
dans `MESURES.md`. Pour le 04, la référence est la safe zone elle-même :
`node scripts/safe-zone.mjs <rendu>` la dessine sur une image.

## Comment on s'en sert

```bash
# 1. le skill choisit le format, crée le projet daté et instancie le scaffold
#    (dans Claude Code : /reel-format)

# 2. le reste est le process habituel, inchangé
cat PROCESS.md
```

Le skill `reel-format` ne remplace pas `PROCESS.md` : il pose la phase 0 et la phase 3
(le squelette de composition). Le montage parole, `design-beats`, la vérification et
la boucle de review restent identiques pour tous les formats.

## Ce qui n'est pas standardisé (volontairement)

- **Le fond de la zone haute** (01) — noir texturé par défaut, mais un média plein
  cadre est légitime.
- **La position exacte des éléments « autour »** (04) — elle se décide par passage,
  selon la posture du plan ; les poches de la spec sont le cadrage canon.
- **Le nombre de segments de parole.** Ça dépend du texte.
- **Les cartes.** Elles viennent de `style-library/10-maison/cards/social/` et se
  choisissent au storyboard, via le skill `design-beats`.

## Une nouvelle famille de reels ?

Si un reel ne rentre dans aucun des quatre, ne pas tordre un format existant : le
monter à la main, le publier, et **attendre d'en avoir deux qui se ressemblent**
avant d'écrire un `05-*.md`. Les formats 01 à 03 viennent chacun de deux reels
réels ; le 04 est la seule exception — il vient d'une consigne explicite du créateur
(06/09), parce que c'est **sa** géométrie. Ses retours suivants l'affinent dans le
même fichier.
