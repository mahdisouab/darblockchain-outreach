# Montage — la compréhension du tunisien au service du storyboard

La chaîne est : **audio tunisien → sens → structure → visuels**. La traduction française n'est
pas une étape de cette chaîne : la glose sert à la relecture du créateur, pas à décider ce
qu'on montre. Illustrer une phrase depuis sa traduction, c'est illustrer un autre texte.

## 1. Lire le discours (avant `design-beats`)

Sur le verbatim reconstruit (`transcription.md` § 3), repérer et noter en tête du
storyboard :

| Élément | Indices dans une parole tunisienne |
|---|---|
| **Hook** | question sans « est-ce que » (`ynajem ykoun a5tar men … ?`, `3lech … ?`, `ta3ref … elli … ?`), comparaison inattendue (`X a5tar men Y`), adresse au public (`barcha menkom`, `na3ref elli`), chiffre choc |
| **Promesse centrale** | la phrase après le hook qui commence par `5ater l7a9`, `el mochkla hné`, `l7a9` |
| **Changement de sujet / étape** | `w hné`, `ama`, `donc`, `tawa`, `3lech ?`, `9bal ma`, `ba3d`, `7atta` + nouveau nom propre, `zid`, `mel a5er`, `ken 3andek` (CTA) |
| **Mécanisme** (« comment techniquement ») | `kifech`, `5ater ki`, `y9ra`, `ylawej 3la`, `ya3mel`, un outil ou un logiciel nommé (`logiciel esmou ATS`) |
| **Exemple / cas** | `mathalan`, `par exemple`, `kif`, `saret 7keya`, `famma rajel`, `7atta Samsung`, une année, un pays, un nom |
| **Preuve** | `saret`, `fi 2025`, `100 %`, marque, chiffre, `mna3et` |
| **Conséquence / verdict** | `ynajem ya3tik zéro`, `tqaddem lel ma7kma`, `ma yousalch`, `ma famma 7atta` |
| **Émotion / mise en garde** | `rod belek`, `lezem`, `5alli … 3andek`, `3omrou ma`, `t7ess rou7ek`, `a5tar`, `serr` |
| **Punchline** | dernière phrase courte après `mel a5er` / `kont bech n9oullek`, souvent un contraste (`y3awnek barcha, ama 5alli serrek 3andek`) |
| **CTA** | `ekteb « X » fel commentaires`, `nab3athlek`, `abonné`, `DM`, `partagé` |

Deux contrôles : (1) chaque idée principale a un mot qui la porte dans la bouche du
créateur (c'est ce mot qui ancre le beat) ; (2) aucune idée retenue ne repose sur un mot
marqué `[?]`.

## 2. Ce qui est nommé se montre — dans la langue où c'est dit

La grille de `design-beats` (« chaque chose nommée → son visuel ») s'applique aux **noms et
verbes tunisiens** exactement comme aux français. Les verbes d'action derja ont chacun leur
visuel :

| Il dit | On montre |
|---|---|
| `yeb3ath / yeb3thou / nab3athlek` (envoyer) | l'envoi : bulle qui part, mail qui file, DM qui se tape et se publie |
| `y9ra / y9rah` (lire) | balayage de lecture, ligne surlignée qui descend, scanner |
| `ylawej 3la` (chercher) | champ de recherche qui se tape, loupe, résultats qui tombent |
| `ya3tik zéro / man3 / mna3et` (rejeter, interdire) | croix rouge dessinée, badge ✕, chip qui passe au rouge |
| `3taw / 7ott / ta3mel copy-coller` (donner, mettre, coller) | drag & drop du chip dans l'interface |
| `saret fuite / saret 3al internet` | données qui s'échappent, résultats indexés qui apparaissent |
| `y7ki / ya7kilou / n9oulou kol chay` (raconter) | chat vivant, pile de confidences |
| `ya3ref` (savoir) | fiche qui se remplit, avatars « ? » |
| `t7ess rou7ek mertah` | réactions positives qui popent, checklist qui se coche |
| `rod belek / 5alli … 3andek` | cadenas qui se ferme, bouclier, mot-clé jaune slammé |
| `ynajem ykoun a5tar` | badge « ! » rouge, bouclier qui craque, compteur de risque |
| `barcha / 3alle5er / 100 %` | compteur qui monte, grille de chips qui se remplit |
| `9bal ma … / ba3d ma …` | timeline à deux étapes, flip avant/après |
| chiffre dit (50, 90 %, 2025) | compteur animé ou étiquette mono qui claque sur le mot |

Un mot français dans la phrase tunisienne (`ATS`, `PDF`, `recruteur`, `watermark`) est un
**nom propre du script** : il lance la course aux assets (logo, UI redessinée, capture) comme
n'importe quel nom propre.

## 3. Le storyboard d'une vidéo en tunisien

Même tableau que `design-beats`, avec la colonne « il dit » en deux temps :

```
| t_in–t_out | il dit — verbatim Franco-Tunisien — *glose FR* | on montre | entrée / entretien / sortie | SFX |
| 6,9–10,7 | « 5ater l7a9, el CV mte3ek ma yousalch lel *recruteur* » — *parce qu'en fait ton CV n'arrive pas au recruteur* | … | … | … |
```

En tête du storyboard : la langue de la voix, le mode des sous-titres (`captions.script`) et
son statut (déclaré / à valider), la liste des incertitudes `[?]`, et les noms propres
détectés (course aux assets). Le créateur relit sur la glose, arbitre sur le verbatim.

## 4. Les ancres et la synchronisation

- `BEATS[3]` et `data-anchor` = la chaîne **telle que whisper l'a écrite** dans
  `transcript.json` (arabe), jamais le verbatim latin. Deux ou trois mots consécutifs
  suffisent ; prendre des mots que whisper a bien isolés (éviter les fusions comme ينجميعونك).
- L'animation d'un mot démarre au `start` de ce mot ; le mot-clé jaune du sous-titre tombe
  sur le même `start`.
- La tolérance du validateur (entrée entre 0,2 s après et 1,8 s avant le mot) ne change pas.

## 5. Ce que le tunisien change dans les autres agents

| Agent | Ce qui change | Ce qui ne change pas |
|---|---|---|
| `cut-silences` | rien : les temps sont bons | pads, respirations, `clamp-stretched-tokens` |
| `cut-mistakes` | les reprises se comparent par le sens (deux orthographes possibles), les mots français ne sont jamais des ratés, `ya3ni` répété est un tic coupable | garder la dernière prise, fenêtres 8-14 s à deux tailles |
| `verify-cuts` / `autoverify` | re-transcription en `-l ar`, sentinelles = emprunts stables, `forbiddenRepeats` sur un mot stable | trois passes, silencedetect final, master -14 LUFS |
| `design-beats` | verbatim + glose, lecture par les marqueurs du § 1, visuels depuis le sens tunisien | grille, densité, SFX, storyboard avant composition |
| `motion-graphics` / composition | mots-chocs et étiquettes dans la langue des sous-titres ; UI redessinées dans la langue de la vraie UI | layout, carte, ligne de tête, zone haute |
| `insert-broll` | les noms propres dits en tunisien ou en français lancent la même course aux assets | — |

## 6. Une vidéo n'est pas forcément monolingue

Une voix française peut contenir une phrase en tunisien (une expression, un mot d'esprit) ;
une voix tunisienne contient des phrases entières en français (une citation, un titre de
presse lu). Le skill s'applique **passage par passage** : le mode des sous-titres reste celui
du projet, mais le décodage et la fidélité suivent ce qui est réellement dit à cet instant.
Ne jamais « tunisifier » un projet français, ni « franciser » un projet tunisien, pour
homogénéiser.
