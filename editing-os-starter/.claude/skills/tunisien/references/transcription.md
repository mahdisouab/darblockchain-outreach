# Transcription — whisper sur une voix tunisienne, et comment en tirer le verbatim

## 1. Détecter la langue AVANT de transcrire

Le défaut du process (`--language fr`) **détruit silencieusement** un transcript tunisien :
mesuré le 05/09 sur le rush MVI_3476, `--language fr` a produit une boucle d'hallucination
(« Tu vas te faire un peu de temps » répété quarante fois), avec des timings inutilisables.
Rien ne prévient : le fichier a l'air d'un transcript.

Procédure obligatoire sur tout nouveau rush dont la langue n'est pas déclarée :

```bash
# 15 s au milieu du rush, décodage en langue automatique
ffmpeg -y -v error -ss 20 -t 15 -i assets/rush.mp4 -vn -ac 1 -ar 16000 -c:a pcm_s16le /tmp/lang.wav
whisper-cli -m models/ggml-large-v3-turbo.bin -f /tmp/lang.wav -l auto -np --vad -vm models/ggml-silero-v5.1.2.bin
```

| Sortie du test | Langue | Transcription complète |
|---|---|---|
| lettres arabes, mots français en lettres arabes | tunisien (derja) | `node scripts/transcribe-whisper.mjs assets/rush.mp4 --language ar` |
| français cohérent | français | `--language fr` |
| anglais cohérent | anglais | `--language en` |
| une phrase répétée en boucle | mauvaise langue forcée | refaire en `-l auto` |

Consigner le résultat dans `meta.json` (`verify.language`, et une ligne dans `notes` : « voix en
derja tunisienne avec mots français »). Sur Windows, `whisper-cli` se trouve via `WHISPER_CLI`
(voir `LISEZMOI.md` § 2 bis).

## 2. Ce que whisper `--language ar` produit sur de la derja

- **Les timings sont bons** (VAD + align) : les `start` / `end` des mots servent aux coupes,
  aux ancres et aux sous-titres sans correction.
- **Le texte n'est pas fiable** : les mots français sont écrits à l'oreille en lettres
  arabes, les mots derja sont orthographiés différemment d'une passe à l'autre, des mots sont
  fusionnés ou éclatés, et quelques-uns sont de pures hallucinations sur un souffle.

Cas réels du reel du 05/09 (`26-09-05-historique-claude-instagram`) :

| whisper a écrit | il disait | type |
|---|---|---|
| الستوريك | l'historique | français en lettres arabes |
| الانستغراب | Instagram | marque |
| شات جي بيتي · للشات جي بيتي | ChatGPT · lel ChatGPT | marque, avec contraction collée |
| لليا · لياي · للاقيعي | lel AI / l'IA | même mot, trois graphies dans un seul transcript |
| بلافثور | plateforme | français |
| تفوية | fuite | français |
| دي دوني | des données | article français + nom |
| بلخصونيل · برسونيل · بروفسيونيل | personnelles · personnel · professionnel | français |
| كونفرساسيون | conversation | français |
| كونفيدنسي | confidentielles | français, tronqué |
| سامسونج | Samsung | marque |
| البيلوماني | la pyromanie | français, déformé |
| بيسر | b-yesser (de loin) | derja |
| متاحهم · ممتاعو · تمتاعو | mte3hom · mte3ou · mte3ou | derja respelée avec le mot voisin collé |
| ينجميعونك | ynajem y3awnek | deux mots fusionnés |
| بيلكش | n9oullek | derja mal entendue |
| بازيو | basou (ils ont basé) | derja + emprunt |
| ترنا | *(inconnu — probablement un souffle ou « tawa »)* | à signaler, pas à deviner |

Conséquences :

1. **Jamais de comparaison de chaînes sur un mot derja entre deux passes** (montage vs draft
   vs master) : `2025` est devenu « alfin w 5amsa w 3echrin » d'une passe à l'autre. Les
   **sentinelles d'`autoverify`** sont des emprunts stables (marques, sigles, mots français
   longs, chiffres écrits en chiffres) sortis identiques sur trois transcriptions ; jamais
   un mot purement derja. `scripts/autoverify.py` normalise hamza, ta marbuta, alef maqsura et
   harakat des deux côtés.
2. **Les ancres de beats (`data-anchor`, `BEATS[3]`) reprennent l'orthographe de whisper
   telle quelle** (`"في شات"`, `"وعلى حاجات"`), jamais la graphie corrigée : le validateur
   cherche la chaîne dans `transcript.json`.
3. **Le verbatim des sous-titres et du storyboard se reconstruit**, il ne se copie pas.

## 3. Reconstruire le verbatim (Franco-Tunisien) depuis le transcript

1. Lire le transcript par **groupes de sens** (une idée = 1 à 3 s), pas mot à mot.
2. Pour chaque mot : est-ce de la derja (segmenter préfixe / racine / suffixe,
   `grammaire.md`) ou du français déguisé (`code-switching.md` § motifs) ? Prononcer la
   suite de lettres à voix haute : `دي دوني` → [dé doné] → « des données ».
3. Écrire le groupe en **Franco-Tunisien de convention** (`graphies.md` § 3), mots français
   et marques en orthographe exacte : `saret fuite kbira mte3 données bennesba lel ChatGPT`.
4. **Aligner** chaque groupe sur le `start` du premier mot whisper qui lui correspond (les
   mots restent dans l'ordre ; quand whisper a fusionné deux mots, prendre le début du mot
   fusionné ; quand il en a éclaté un, le début du premier fragment).
5. **Glose française** à côté, pour la relecture du créateur — la glose n'est ni le
   sous-titre ni la base du storyboard.
6. **Marquer `[?]`** tout mot dont la lecture reste incertaine, avec les hypothèses
   (`ترنا [?] — souffle ou « tawa »`), dans la section « incertitudes » du storyboard.

Quand l'audio est disponible, **écouter la fenêtre** vaut mieux que deviner :

```bash
ffmpeg -y -v error -ss <t-2> -t 7 -i assets/edit.mp4 -vn -ac 1 -ar 16000 -c:a pcm_s16le /tmp/w.wav
whisper-cli -m models/ggml-large-v3-turbo.bin -f /tmp/w.wav -l ar --vad -vm models/ggml-silero-v5.1.2.bin -np
# variante : orienter l'orthographe des emprunts attendus
whisper-cli ... --prompt "ChatGPT, Instagram, plateforme, données, recruteur, ATS"
```

Segmentation naturelle (sans `-ml 1 -sow`) : whisper relit la phrase entière et écrit souvent
mieux les mots français. **Le `--prompt` en alphabet latin est à proscrire avec `-l ar`** (mesuré le
06/09 sur le reel du 05/09) : un prompt Franco-Tunisien (« ChatGPT, Instagram, l’historique mte3ek… »)
fait dérailler le décodage vers du gallois (« Cymru, yn ystoriq, yn ystoriq… ») sur toute la fenêtre.
Un prompt en lettres arabes reste une piste à mesurer, pas une garantie.

## 4. Le protocole d'incertitude (le cas « watermark »)

Un terme technique mal transcrit peut changer le raisonnement, l'exemple, le hook et le
visuel. Le créateur a dû corriger une transcription en « je voulais dire watermark » : tout
ce qui avait été bâti autour du mot fautif était à refaire.

Donc, devant un mot douteux :

1. Chercher le sens global du passage, puis le mot qui **s'y attend** (voisins, sujet).
2. Essayer les variantes de graphie et les décodages français.
3. Si le doute reste **et** que le mot porte (marque, chiffre, terme technique, verdict) :
   le signaler `[?]` avec deux lectures, **ne pas** construire de visuel, de mot-clé jaune ni
   de texte à l'écran dessus, et poser la question au créateur dans le storyboard.
4. Si le doute reste et que le mot ne porte pas (particule, souffle) : choisir la lecture la
   plus plausible, la noter, et sous-titrer le groupe sans lui si nécessaire.
5. Ne jamais inventer un mot pour boucher un trou, ne jamais « lisser » un passage
   incompréhensible en le traduisant vaguement.

## 5. Coupes et reprises (cut-silences, cut-mistakes, verify-cuts)

- Les temps viennent du transcript whisper (fiables) ; le **contenu** des groupes vient du
  verbatim reconstruit. Les segments `SEG` / `edl.json` se posent sur les `start` / `end`
  réels des mots comme en français.
- **Un mot français n'est jamais un raté** : `hatta` gardé devant « Samsung », `men` devant
  « el a5er », `donc` en début de phrase sont de la parole, pas des hésitations.
- **Reprises** : whisper fusionne une phrase dite deux fois quand il lit tout le fichier
  (`PROCESS.md`). En derja, la difficulté double : la même phrase ressort avec deux
  orthographes. Balayer en fenêtres de 8 à 14 s, deux tailles, `-l ar`, segmentation
  naturelle, et comparer les candidats **par le sens** (glose), en s'appuyant sur les mots
  français et les chiffres comme repères stables. Garder la dernière prise.
- **Tics coupables** en derja : `ya3ni` répété, `euh`, `bon`, `donc donc`, faux départs
  (« elli f… » puis reprise), syllabe avalée après une coupe. `chouf`, `ya5i`, `rod belek` ne
  sont pas des tics : ils portent une fonction.
- **verify-cuts / autoverify sur le rendu** : re-transcrire en `-l ar` (le `verify.language`
  de `meta.json` y pourvoit), sentinelles = emprunts stables, `forbiddenRepeats` = un mot
  stable de la phrase reprise (`"بازيو"`), jamais un mot derja.
