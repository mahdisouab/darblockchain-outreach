# Code-switching — le français et l'anglais font partie de la phrase tunisienne

## Le principe

Une phrase tunisienne naturelle, dans l'usage du créateur, c'est :

**une structure grammaticale tunisienne + le vocabulaire des langues réellement utilisées
dans le domaine dont il parle.**

Ce n'est pas une phrase française où l'on a remplacé quelques mots, ni deux langues
juxtaposées. Le mot étranger entre dans la morphologie tunisienne : il reçoit l'article
`el`, le possessif `mte3`, un verbe support tunisien, un adjectif tunisien ou français.

> Na3ref elli barcha menkom yesta3mlou Claude bech ye5dmou parties kbar mel PFE mte3hom.

Six mots sur seize sont français ou anglais. La phrase est entièrement tunisienne.

**Conséquence pour le montage** : un mot français ou anglais dans une voix tunisienne n'est
ni une erreur de transcription, ni un mot à traduire, ni un mot à couper, ni une anomalie.
C'est souvent le mot le plus important de la phrase (le terme technique, la marque, le
chiffre), donc le premier candidat au mot-clé jaune et au visuel.

## Ce qui reste en français / anglais (validé dans le corpus et les vidéos)

| Domaine | Mots qui restent tels quels |
|---|---|
| IA, tech | AI / l'IA, ChatGPT, Claude, Gemini, watermark, logiciel, copy-coller, prompt, détecteur, PDF, données, plateforme, internet, compte, profil, application, fuite, confidentiel, historique, conversation, algorithme, template, ATS, CAPTCHA |
| Études | PFE, projet, présentation, prof, soutenance, mémoire, stage, alternance, étudiants, la fac, cours, examen |
| Travail | réunion, manager, feedback, deadline, client, CV, recruteur, poste, entreprise, salaire, expérience, candidat, annonce, formulaire, entretien |
| Business | business, startup, marché, produit, sales, marketing, stratégie, boîte, chiffre d'affaires |
| Contenu | contenu, script, hook, CTA, vidéo, Reels, TikTok, Instagram, audience, engagement, vues, abonnés, commentaires, DM, live, story |
| Connecteurs | donc, juste, déjà, surtout, sans, même, par exemple, franchement, normalement, direct, en fait, bon, ok, voilà, presque |
| Quantités | pourcentages, années, grands nombres (100 %, 2025, 90 %, mille) |

Tendance (pas une formule) : plus le domaine est professionnel, universitaire, technique ou
digital, plus la part de français/anglais est naturelle ; plus la phrase touche l'émotion, le
quotidien, la famille, la réaction immédiate, plus le tunisien pur reprend la main
(`rod belek`, `5alli serrek 3andek`, `t7ess rou7ek mertah`).

## L'hybridation morphologique (à reconnaître, à reproduire)

| Patron | Exemples ★ |
|---|---|
| `el` + nom français | el watermark, el logiciel hedha, el CV, el marketing, el manager mte3i, el produit behi |
| nom français + `mte3` + suffixe | profil mte3ek, scripts mte3na, PFE mte3hom, l'historique mte3na, les décisions mte3ek |
| `les` / `des` français conservés dans la phrase tunisienne | les données mte3ek, les CAPTCHA elli…, des erreurs, des entreprises, des mots-clés |
| nom tunisien + adjectif français | 7ajet intimes, 7yetna personnelle, 7aja dangereuse barcha |
| nom français + adjectif tunisien | parties kbar, fuite kbira, données jdod |
| verbe support tunisien + nom français | na3mel copy-coller, ta3mel des erreurs, ya3mel un test, na3mel présentation |
| verbe tunisien + objet anglais | yesta3mlou Claude, nesta3mlou AI, ekteb « CV » |
| contraction + mot étranger | fl Instagram, mel PFE, lel AI, 3al internet, fel commentaires, bel PDF |
| adjectif ou groupe français en prédicat | el CV mte3ek design 3alle5er · mahouch juste un problème technique |
| chiffre français dans une structure tunisienne | ma famma 7atta plateforme ma7miya 100 %, fi 2025 saret fuite |

Le code-switching se produit **à l'intérieur du groupe nominal**, pas seulement de phrase à
phrase : `7ajet intimes`, `l7yetna personnelle`.

## Ce qu'on ne fait jamais

- Traduire une marque ou un sigle : `Claude` reste Claude, jamais كلود ni « l'IA d'Anthropic » ;
  `PFE` reste PFE, jamais « projet de fin d'études » ; `watermark` reste watermark, jamais
  « filigrane » ni العلامة المائية.
- Écrire un mot français phonétiquement (`dé-doné`, `rokroteur`, `pé-ef-eu`).
- « Purifier » vers l'arabe : `el mochkla mahich ken fel étudiants` ne devient pas
  المشكلة ليست فقط في الطلبة.
- Compter un mot français comme un raté à couper (`cut-mistakes`) ou comme un mot
  manquant (`autoverify`) parce qu'il n'est pas arabe.
- Supprimer les connecteurs français (`donc`, `juste`, `déjà`) dans les sous-titres au motif
  qu'ils « ne sont pas tunisiens ».
- Inversement : remplacer un mot tunisien par son équivalent français parce que ce serait
  « plus clair » (`rod belek` → « fais attention »). Le sous-titre suit la bouche.

## Reconnaître un mot français déguisé (transcript whisper en arabe)

Whisper `--language ar` écrit les mots français avec des lettres arabes, à l'oreille. Indices
de décodage (table des cas réels dans `transcription.md`) :

| Motif dans le transcript | Il cache souvent… | Exemples |
|---|---|---|
| finale ـيون / ـسيون | -tion | كونفرساسيون conversation, انفورماسيون information |
| finale ـور | -eur | روكروتور recruteur, سيرفور serveur |
| finale ـيال / ـيل | -iel, -el | لوجيسيال logiciel, بروفسيونيل professionnel, برسونيل personnel |
| finale ـينغ / ـينج | -ing | ماركتينغ marketing, ميتينغ meeting |
| finale ـاج | -age | ستاج stage, ماساج message |
| دي / لي / لو / لا / دو devant un nom | des / les / le / la / de | دي دوني des données, لي كومونتار les commentaires, جستيون دو بروجي gestion de projet |
| lettres épelées (اي تي اس, بي دي اف, سي في) | un sigle | ATS, PDF, CV |
| suite de syllabes sans racine arabe plausible, voyelles longues en rafale | un nom propre, une marque | سامسونج Samsung, الانستغراب Instagram, شات جي بيتي ChatGPT |
| ـيت / ـيك finale sur un mot court | -ité, -ique | سيكوريتي sécurité, تكنيك technique |

Quand un mot ne se laisse décoder ni comme tunisien ni comme français : **incertitude à
signaler** (voir `transcription.md` § protocole), pas une invention.
