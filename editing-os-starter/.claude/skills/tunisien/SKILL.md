---
name: tunisien
description: >
  Compréhension et écriture du dialecte tunisien (derja, tounsi) pour le montage vidéo.
  Déclencher dès qu'une voix, un transcript, un script ou un message est en tunisien :
  transcript whisper en lettres arabes (`--language ar`, `language_code: ar`, ou un rush dont
  la langue n'est pas encore connue), Franco-Tunisien en alphabet latin avec chiffres
  (3, 7, 9, 5), tunisien en alphabet arabe, ou mélange tunisien / français / anglais — et
  AVANT toute décision de sous-titres, de textes à l'écran, de storyboard, de coupe ou de
  mots-sentinelles sur un tel contenu. Ne s'applique pas aux vidéos entièrement en français
  ou en anglais : ne jamais y forcer du tunisien.
---

# Tunisien — une langue de travail du montage, pas une couche de sous-titrage

## Pourquoi ce skill existe

Premier reel en derja (05/09, `26-09-05-historique-claude-instagram`) : le montage, les
graphiques et le rythme étaient bons, mais les sous-titres sont partis en **traduction
française** faute de mode déclaré, et le verbatim du storyboard mélangeait les conventions
d'écriture. Le créateur a fourni un corpus d'apprentissage (`references/corpus/`) : ce skill en
extrait les mécanismes généralisables et les branche sur le pipeline. Il n'est pas un
dictionnaire ; il apprend à décoder, à écrire et à **raisonner directement sur ce qui est dit**.

## Le principe

```
audio tunisien → sens → structure (hook, promesse, bascules, mécanisme, preuve, chute, CTA)
              → sous-titres dans le mode demandé + textes, graphiques, B-roll, ancres
```

La traduction française n'est pas une étape : la glose sert à la relecture du créateur, jamais
à décider ce qu'on montre ni ce qu'on écrit. Le tunisien de ce créateur est **hybride par
nature** : structure tunisienne + mots français et anglais du domaine (`ChatGPT`, `PFE`, `CV`,
`ATS`, `watermark`, `feedback`, `donc`, `juste`). Ces mots sont la langue, pas des anomalies.

## Les huit règles

1. **Détecter la langue avant de transcrire.** 15 s en `-l auto` ; derja → `--language ar`,
   `"verify": {"language": "ar"}` dans `meta.json`, une ligne dans `notes`. `--language fr` sur
   de la derja fabrique un transcript qui a l'air vrai et qui est faux (`references/transcription.md`).
2. **Whisper donne le temps, pas le texte.** Les mots français sortent en lettres arabes
   (كونفرساسيون), la derja est réorthographiée à chaque passe. Le verbatim se **reconstruit**
   par groupes de sens ; les ancres (`BEATS`, `data-anchor`) reprennent l'orthographe de
   whisper telle quelle ; les sentinelles d'`autoverify` sont des emprunts stables, jamais un
   mot derja.
3. **Le code-switching est la langue.** Un mot français ou anglais se garde avec son
   orthographe exacte (accents, sigles, marques) : jamais traduit, jamais coupé comme un raté,
   jamais écrit phonétiquement, jamais remplacé par de l'arabe. Et l'inverse : un mot tunisien
   ne se remplace pas par son équivalent français « plus clair ».
4. **Langue parlée ≠ langue des sous-titres.** Le mode vient de `meta.json` →
   `captions.script` (`franco` · `arabe` · `fr` · `en` · `none`). Absent sur une voix
   tunisienne = `franco`, annoncé « à valider » en tête du storyboard. La traduction est un mode
   demandé, jamais un réflexe. Le tunisien en lettres arabes reste du tunisien, pas du MSA.
5. **Une convention d'écriture, tenue jusqu'au bout.** Celle du corpus (table ci-dessous),
   notée dans un glossaire au-dessus de `CAPS`. Elle prime sur une graphie isolée lue dans un
   message du créateur : il écrit `khedmet` et `ne5tar` dans la même phrase — on lit tout, on
   écrit `5`.
6. **Fidélité à la bouche.** Le sous-titre suit ce qu'il dit, dans l'ordre, avec ses
   contractions et son registre. Pas de correction grammaticale, pas d'embellissement, pas
   d'argument ni de fait ajouté, pas d'arabe littéraire. Un texte qu'on **produit** (CTA,
   étiquette, phrase proposée) passe le test de `references/naturalite.md`.
7. **L'incertitude se signale, elle ne s'invente pas.** Mot douteux → `[?]` avec deux
   lectures dans le storyboard ; s'il porte (marque, chiffre, terme technique, verdict) :
   aucun mot-clé jaune, aucun visuel, aucun texte à l'écran dessus tant que le créateur n'a
   pas tranché. Le précédent : une transcription fautive corrigée en « je voulais dire
   watermark » avait entraîné hook, exemple et visuel.
8. **Ce qui est nommé se montre, dans la langue où c'est dit.** La grille de `design-beats`
   s'applique aux verbes et noms tunisiens (`yeb3ath` → envoi animé, `ylawej` → recherche,
   `ya3tik zéro` → croix rouge) comme aux mots français ; la lecture éditoriale se fait sur
   les marqueurs tunisiens (`references/montage.md` § 1).

## Convention d'écriture (Franco-Tunisien, mode `franco`)

| Son | On écrit | On lit aussi | Unités à ne pas décomposer |
|---|---|---|---|
| ع | `3` na3ref, mte3, 3lech | aa, a | `3alle5er` (à fond), `3andek` |
| ح | `7` 7aja, l7a9, 7atta | h | `5ater l7a9` (parce qu'en fait), `rod belek` / `trod belek` |
| خ | `5` 5ater, a5tar, ye5dem, ne5tar | kh | `mel a5er` (bref), `5alli … 3andek` |
| ق | `9` n9oulou, 9bal, y9ra, tal9a | q, g | `ynajem ykoun`, `kol chay`, `barcha menkom` |
| ء | `2` seulement si nécessaire (sou2el) | ', rien | `wallina` + verbe (on en est venus à) |
| contractions | `fl` / `fel`, `mel`, `lel`, `3al`, `bel`, `l7a9` | fi el, men el, l el | `w hné` (et là), `ma famma 7atta` |
| formes | `mte3` · `bech` · `elli` · `ynajem` · `lezem` · `hedha` / `hedhi` · `tawa` · `fama` · `mahouch` / `mahich` · `kifech` · `chnowa` · `chkoun` | mta3, bich, li, ynajjem, lazem, hadha, taw, famma… | doubler une consonne seulement si ça aide (7atta oui, ynajem non) |
| FR / EN | orthographe exacte : données, écran, zéro, recruteur, PDF, ATS, ChatGPT, Claude, l'IA / AI (celui qu'on entend) | — | jamais `dé-doné`, `rokroteur`, كلود |

Détail, variantes et mode arabe : `references/graphies.md`.

## Les fichiers de référence

| Fichier | L'ouvrir quand… |
|---|---|
| `references/transcription.md` | on reçoit un rush ou un transcript : détection, ce que whisper `ar` produit vraiment (table des cas réels), reconstruction du verbatim, protocole d'incertitude, reprises et sentinelles |
| `references/captions.md` | on écrit `CAPS` : modes, glossaire, découpage des groupes, mode arabe (police, RTL), textes à l'écran, checklist |
| `references/montage.md` | on prépare le storyboard : marqueurs du discours tunisien, verbes derja → visuels, format « verbatim — glose », ce qui change dans chaque agent |
| `references/graphies.md` | un mot est écrit autrement, on hésite sur une graphie, on passe en lettres arabes |
| `references/grammaire.md` | un mot résiste : découper préfixe / racine / suffixe, négation, `bech`, `elli`, `ki` / `ken` / `kif`, ce qui diffère du français et du MSA |
| `references/lexique.md` | vocabulaire de haute fréquence, expressions à lire comme des unités, nombres |
| `references/code-switching.md` | savoir quels mots restent en FR / EN, l'hybridation, reconnaître un mot français déguisé en lettres arabes |
| `references/naturalite.md` | on **produit** un texte : registre, test d'artificialité, patrons artificiel → naturel, façon de travailler avec les textes du créateur |
| `references/corpus/` | la source (volume 1, parties 1-8) ; les volumes suivants s'ajoutent à côté, sans réécrire les précédents |

## Rationalisations à refuser

| On se dit… | En réalité |
|---|---|
| « Il a écrit `khedmet`, j'adopte `kh` » | Il écrit aussi `ne5tar`. La convention du corpus (`5`) prime ; on lit toutes les graphies, on en écrit une. |
| « Les sous-titres en français, c'est plus sûr / plus lisible » | C'est un autre mode. Sans `captions.script`, c'est `franco` + question au créateur — jamais une traduction silencieuse. |
| « En lettres arabes, autant écrire un arabe correct » | Le MSA est une autre langue. باش, ما…ش, اللي, متاع, برشة restent ; لقد, سوف, يجب, ليس sortent. |
| « Ce mot français est sûrement une erreur de whisper » | Whisper *déguise* le français, il n'en invente pas : كونفرساسيون est « conversation ». Décoder avant de douter. |
| « Je ne comprends pas ce mot, je mets ce qui colle au contexte » | `[?]` + deux lectures + pas de visuel dessus. Le cas watermark a coûté un script entier. |
| « Sa phrase serait meilleure formulée ainsi » | Un sous-titre suit la bouche ; un texte validé n'est pas un brouillon ; la correction ponctuelle n'est pas une règle. |
| « J'ajoute la stat que j'ai trouvée, ça renforce » | Recherche et écriture sont séparées : on présente à part, il choisit. |
| « Le reel précédent était en français, celui-ci aussi sûrement » | Chaque rush passe par la détection. Une voix tunisienne sous `--language fr` donne une boucle d'hallucination qui ressemble à un transcript. |
| « Traduire en français d'abord m'aide à comprendre » | La glose vient *après* la lecture tunisienne, pour le créateur. Illustrer depuis la traduction, c'est illustrer un autre texte. |

## Avant de livrer un storyboard ou des `CAPS` sur une voix tunisienne

- [ ] Langue détectée et déclarée (`verify.language`), mode des sous-titres déclaré ou marqué « à valider ».
- [ ] Verbatim reconstruit par groupes de sens, glose FR à côté, incertitudes `[?]` listées avec leurs lectures.
- [ ] Une graphie par mot (glossaire), convention `3 7 5 9`, contractions écrites contractées, FR / EN en orthographe exacte.
- [ ] Ancres et sentinelles en orthographe whisper ; aucun mot derja en sentinelle.
- [ ] Aucun mot-clé jaune, visuel ni texte à l'écran posé sur un `[?]`.
- [ ] Tout texte produit (CTA, étiquette, phrase proposée) relu à voix haute : test d'artificialité passé.
- [ ] Rien de tunisien forcé dans un passage réellement en français ou en anglais, et inversement.

## Faire évoluer ce skill

Une correction du créateur vaut pour la vidéo en cours ; elle entre ici seulement s'il dit
« à partir de maintenant », « garde ça pour les prochains », « ajoute ça aux règles ». Un nouveau
volume du corpus se dépose dans `references/corpus/` et ses règles nouvelles se reportent dans
les fichiers de référence — en marquant ce qui est attesté (★) et ce qui est du tunisien
général. Re-tester avec `tests/README.md` après toute modification.
