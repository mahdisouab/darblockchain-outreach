# CORPUS DE FORMATION AU TUNISIEN ET À LA CRÉATION DE CONTENU TUNISIENNE

## Version 1 — Extraction du projet « Création de contenu Mahdi Souab »

---

# MÉTHODOLOGIE ET PROVENANCE

Ce corpus cherche à enseigner des **facultés**, et non à faire mémoriser quelques formulations.

Le modèle entraîné doit progressivement apprendre à :

1. décoder le tunisien sous plusieurs graphies ;
2. comprendre la logique d’une phrase tunisienne ;
3. produire une formulation réellement naturelle ;
4. translittérer sans rigidité académique ;
5. utiliser naturellement le français et l’anglais ;
6. transformer une idée brute en parole fluide ;
7. condenser sans dénaturer ;
8. produire des scripts courts adaptés à l’oral ;
9. reconnaître les formulations qui sonnent « traduites » ;
10. reproduire une méthode de création de contenu sans simplement imiter une personnalité.

Le principe central du projet est que le résultat doit rester une version améliorée de ce que Mahdi aurait effectivement pu dire, et non un texte générique substitué à sa voix.

La hiérarchie des données est importante : les propos de Mahdi et ses corrections explicites priment sur les anciennes productions de l’IA et sur les connaissances externes.

---

# PARTIE 1 — CARTOGRAPHIE DES COMPÉTENCES ACQUISES

## 1. Compréhension

### COMPÉTENCE : décoder le Franco-Tunisien

**Description**

Comprendre immédiatement des phrases telles que :

> l’historique mte3na fi ChatGPT ynajem ykoun a5tar men historiquena fl Instagram?

ou :

> Na3ref elli barcha menkom yesta3mlou Claude bech ye5dmou parties kbar mel PFE mte3hom.

Cela nécessite de traiter simultanément :

- chiffres phonétiques ;
- contractions ;
- orthographe non standard ;
- morphologie tunisienne ;
- mots français ;
- mots anglais ;
- références techniques.

**Importance : critique**

**Acquisition :** [PROJET — EXPLICITE] + [PROJET — OBSERVÉ]

---

### COMPÉTENCE : comprendre plusieurs graphies d’un même mot

Exemples :

- mte3 / mta3 / mté3 ;
- bech / bich ;
- barcha / barcha ;
- 5ater / khater ;
- 7aja / haja ;
- ynajem / ينجم.

Le système ne doit pas considérer une graphie différente comme un mot différent.

**Importance : critique**

**Acquisition :** [PROJET — EXPLICITE] + [DÉDUCTION]

---

### COMPÉTENCE : reconstruire une intention malgré une transcription imparfaite

Le projet comporte des vocaux et des transcriptions automatiques. Un terme mal transcrit ne doit pas être remplacé arbitrairement.

Cas réellement observé : une transcription incorrecte a dû être corrigée par Mahdi en **watermark**.

Le bon comportement est :

1. comprendre le sens global ;
2. détecter qu’un mot paraît incohérent ;
3. éviter de bâtir le script autour du mot douteux ;
4. utiliser la correction de Mahdi lorsqu’elle arrive.

**Importance : critique**

**Acquisition :** corrections + répétition.

Cette logique est explicitement inscrite dans le workflow du projet : ne pas inventer silencieusement un mot ambigu.

---

### COMPÉTENCE : distinguer idée et formulation

Une improvisation peut exprimer une bonne idée avec :

- répétitions ;
- phrases inachevées ;
- mauvais ordre ;
- digressions.

Le modèle doit identifier **l’idée sous-jacente** avant de réécrire la phrase.

**Importance : critique**

**Acquisition :** workflow + nombreuses demandes de restructuration.

---

## 2. Production

### COMPÉTENCE : produire du tunisien naturel au lieu de traduire le français

Entrée :

> Cette technologie peut influencer notre comportement.

Une mauvaise méthode consiste à traduire chaque mot.

Une meilleure logique tunisienne pourrait être :

> El technologie hedhi tnajem t2athar 3la kifech netصرفou.

Ou, dans un registre plus naturel correspondant au corpus :

> El technologie hedhi tnajem t2athar 3la kifech netصرفou w 7atta 3la les décisions mte3na.

L’objectif n’est pas la correspondance lexicale mais la production d’une phrase qu’un Tunisien pourrait réellement prononcer.

**Importance : critique**

**Acquisition :** [PROJET — EXPLICITE]

Le document impose un tunisien naturel, oral, moderne et non transformé artificiellement en arabe littéraire.

---

### COMPÉTENCE : conserver l’intention originale lors de l’amélioration

Le modèle doit améliorer :

- ordre ;
- clarté ;
- densité ;
- rythme.

Il ne doit pas automatiquement améliorer le **fond** en ajoutant ses propres arguments.

**Importance : critique**

**Acquisition :** correction répétée de Mahdi + règle explicite.

---

## 3. Translittération

### COMPÉTENCE : écrire du tunisien entièrement de gauche à droite

Format privilégié pour les scripts :

> 5ater l7a9, wallina n9oulou kol chay lel AI.

et non un mélange permanent entre :

> خاطر l7a9 wallina نقولو AI...

**Importance : critique**

**Acquisition :** [PROJET — EXPLICITE]

Le format par défaut du projet est explicitement le Franco-Tunisien en alphabet latin, notamment avec `3`, `7`, `9` et `5`.

---

### COMPÉTENCE : translittérer pour la lecture, non pour la linguistique

Le bon critère n’est pas :

> « Est-ce la romanisation académique parfaite ? »

mais :

> « Mahdi reconnaît-il immédiatement le mot et peut-il le réciter sans hésiter ? »

**Importance : critique**

**Acquisition :** [PROJET — EXPLICITE]

---

## 4. Vocabulaire

### COMPÉTENCE : reconnaître le vocabulaire tunisien oral de haute fréquence

Exemples particulièrement présents ou explicitement retenus dans le projet :

- na3ref ;
- barcha ;
- 7aja ;
- 5ater ;
- mte3 ;
- bech ;
- tawa ;
- 3alle5er ;
- ynajem ;
- yesta3mel ;
- kifech ;
- chkoun ;
- rod belou.

Ces formes sont explicitement données comme repères d’écriture.

**Importance : critique**

---

## 5. Syntaxe

### COMPÉTENCE : conserver les constructions tunisiennes

Exemples :

> barcha menkom

> mte3hom

> bech ye5dmou

> ynajem ykoun

> wallina n9oulou

Le système doit traiter ces constructions comme des unités naturelles et ne pas essayer de reconstruire une syntaxe d’arabe standard.

**Importance : critique**

---

## 6. Code-switching

### COMPÉTENCE : savoir quels termes ne doivent PAS être traduits

Exemples validés comme naturels dans le projet :

- Claude
- watermark
- logiciel
- copy-coller
- PFE
- Gemini
- script
- contenu
- feedback
- profil
- formulaire
- CV
- plateforme
- alternance



Le modèle doit comprendre que traduire systématiquement ces termes en arabe peut rendre le discours **moins tunisien**, pas plus tunisien.

**Importance : critique**

---

### COMPÉTENCE : intégrer morphologiquement des mots étrangers

Le mot peut rester français tout en entrant dans une structure tunisienne :

> parties kbar mel PFE mte3hom

> yesta3mlou Claude

> nعمل copy-coller

Le code-switching ne signifie donc pas juxtaposer deux langues indépendantes.

**Importance : critique**

---

## 7. Oralité

### COMPÉTENCE : écrire pour une bouche, pas pour une page

Un bon script doit permettre :

- respiration naturelle ;
- groupes courts ;
- mots immédiatement lisibles ;
- transitions simples ;
- absence de syntaxe inutilement complexe.

Mahdi a explicitement demandé que les présentations soient parfois **épurées, légères et simples à lire sans perdre le contenu et la valeur**.

**Importance : critique**

**Acquisition :** [PROJET — OBSERVÉ]

---

## 8. Adaptation du registre

### COMPÉTENCE : parler comme un jeune Tunisien sans caricaturer le tunisien

Éviter les deux extrêmes :

**Trop soutenu :**

> Il est indispensable de prendre conscience des conséquences inhérentes à cette technologie.

**Caricatural :**

> Ya bro hedhi wa7dha كارثة 3alle5er wallah!

Une forme correspondant davantage au projet :

> El mochkla hné ennek ki testa3melha sans vraiment comprendre chnowa ta3mel, tnajem ta3mel des erreurs sans même ma ta3ref.

Le registre recherché est :

- moderne ;
- clair ;
- oral ;
- crédible ;
- relativement sobre.

**Importance : critique**

---

# 9. Création de contenu

### COMPÉTENCE : trouver la promesse centrale

Avant l’écriture, réduire le sujet à une idée simple.

Exemple « historique ChatGPT » :

> Nos conversations avec une IA peuvent révéler plus sur nous qu’un historique de réseau social.

Exemple Claude :

> Utiliser une IA aveuglément pour un PFE peut créer des risques qu’un étudiant ne comprend même pas.

Exemple CAPTCHA :

> Une action banale que des millions de personnes ont faite peut contribuer à produire des données utiles aux machines.

**Importance : critique**

---

### COMPÉTENCE : sélectionner et condenser la matière brute

Le workflow réel du projet consiste à :

- conserver les idées fortes ;
- éliminer les répétitions ;
- éliminer les détours ;
- raccourcir les explications trop longues ;
- ne pas jeter une bonne idée uniquement parce qu’elle est mal formulée.



---

## 10. Storytelling

### COMPÉTENCE : faire émerger une histoire à partir d’un cas concret

Dans les échanges sur les sujets destinés aux jeunes, Mahdi a systématiquement poussé vers :

- exemples précis ;
- anecdotes ;
- cas réels ;
- mécanisme expliqué simplement.

Cela apparaît notamment dans ses retours sur :

- chantage impliquant l’IA ;
- CAPTCHA ;
- Airbnb ;
- IKEA ;
- Estonie.

**Importance : importante**

**Acquisition :** [PROJET — OBSERVÉ]

---

## 11. Hooks

### COMPÉTENCE : partir d’une contradiction ou d’un risque compréhensible immédiatement

Exemple provenant d’une formulation corrigée par Mahdi :

> l’historique mte3na fi ChatGPT ynajem ykoun a5tar men historiquena fl Instagram?

Cette construction est pédagogiquement importante.

Elle possède :

1. un objet connu : historique Instagram ;
2. un objet actuel : ChatGPT ;
3. une comparaison inattendue ;
4. une question ;
5. une promesse implicite d’explication.

**Importance : critique**

---

### COMPÉTENCE : éviter le hook artificiellement sensationnaliste

Le projet rejette explicitement :

- dramatisation gratuite ;
- slogans publicitaires ;
- phrases génériques ;
- « script IA ».



---

## 12. Vulgarisation

### COMPÉTENCE : traduire un mécanisme complexe en conséquence concrète

Mahdi ne cherche pas seulement :

> « attention, c’est dangereux ».

Il demande régulièrement :

> pourquoi ?

> comment techniquement ?

> donne-moi un exemple précis.

Le contenu Claude/watermark est un exemple clair de cette exigence.

**Importance : critique**

---

# PARTIE 2 — CONNAISSANCES FONDAMENTALES À ENSEIGNER

## A. Les niveaux de langue à distinguer

Le modèle doit apprendre qu’il existe au minimum quatre systèmes différents :

1. arabe standard ;
2. tunisien écrit en arabe ;
3. tunisien écrit en alphabet latin ;
4. tunisien oral avec code-switching français/anglais.

Ils ne sont pas interchangeables.

---

# B. Phonétique et chiffres

## 3 = ع

**Statut : [PROJET — EXPLICITE]**

Exemples :

- na3ref = نعرف
- mte3 = متاع
- yesta3mel = يستعمل
- 3lech = علاش
- 3alle5er = عالآخر

Erreur :

> naaref

possible à comprendre, mais moins immédiatement identifiable dans la convention retenue.

---

## 7 = ح

**Statut : [PROJET — EXPLICITE]**

Exemples :

- 7aja = حاجة
- l7a9 = الحق
- 7atta = حتى
- 7yetna = حياتنا

---

## 5 = خ

**Statut : [PROJET — EXPLICITE]**

Exemples :

- 5ater = خاطر
- ye5dem = يخدم
- 5edma = خدمة

La règle du projet nuance toutefois son utilisation : employer `5` lorsqu’il améliore la lisibilité.

---

## 9 = ق

**Statut : [PROJET — EXPLICITE]**

Exemples potentiels :

- 9bal = قبل
- 9addech = قداش
- 9al = قال

Important : la réalisation phonétique du ق varie selon les mots et les locuteurs tunisiens. Le corpus ne doit pas imposer artificiellement `9` à tous les mots historiquement contenant ق si l’usage oral de Mahdi indique autre chose.

---

## 2

**Statut : [TUNISIEN GÉNÉRAL], non établi comme convention importante du projet**

Il peut servir à représenter une hamza dans certaines écritures Arabizi.

Mais le corpus actuel n’apporte pas assez d’éléments pour en faire une règle stylistique de Mahdi.

**Instruction pédagogique :**

Reconnaître `2`, mais ne pas l’imposer spontanément.

---

## 6

**Statut : [TUNISIEN GÉNÉRAL], non établi dans le projet**

Peut représenter ط dans certaines conventions Arabizi.

Même principe : compréhension > imposition.

---

## 8

**Statut : variable et non établi dans le projet**

Différentes communautés Arabizi utilisent `8` différemment.

**Règle pour ce corpus :**

Ne pas créer de convention spécifique avec `8` faute de données suffisantes.

C’est un exemple important de discipline pédagogique : **absence de preuve ≠ permission d’inventer une norme.**

---

# C. Articles et contractions

## `el / l`

[TUNISIEN GÉNÉRAL]

Article défini courant.

Exemples :

> el mochkla

> el 7aja

> l7a9

Dans l’écriture rapide, l’article peut fusionner avec le mot.

---

## `fi` → parfois `fl`

Exemple réellement visible :

> fi ChatGPT

mais également :

> fl Instagram

La contraction `fl` représente souvent `fi + el`.

---

## `men el` → `mel`

Exemple :

> parties kbar mel PFE mte3hom.

---

# D. Possession avec `mte3`

Un des éléments les plus importants.

Exemples :

> l’historique mte3na

notre historique

> PFE mte3hom

leur PFE

> les décisions mte3ek

tes décisions

Variantes fréquentes :

- mte3i ;
- mte3ek ;
- mte3ou ;
- mte3ha ;
- mte3na ;
- mte3kom ;
- mte3hom.

Le modèle ne doit pas traduire mécaniquement `de` par `mte3` partout. Dans de nombreuses constructions tunisiennes, l’état construit ou une expression lexicalisée est préférable.

---

# E. Futur / finalité avec `bech`

Exemple :

> yesta3mlou Claude bech ye5dmou parties kbar mel PFE mte3hom.

`bech` peut introduire :

- futur ;
- intention ;
- finalité.

Exemples :

> bech na3mel video

> bech nefhem

> nesta3mlouh bech ne5dmou

---

# F. Possibilité avec `ynajem`

Forme extrêmement utile dans le corpus :

> ynajem ykoun

> ynajem yesta3mel

> tnajem ta3mel

Permet de vulgariser un risque sans transformer chaque affirmation en certitude absolue.

---

# G. `5ater`

Connecteur causal très fréquent.

> 5ater l7a9...

> 5ater ki testa3mel...

L’usage est beaucoup plus naturel dans ce registre que des équivalents littéraires lourds.

---

# H. `elli`

[TUNISIEN GÉNÉRAL + visible dans le corpus]

Exemple :

> Na3ref elli barcha menkom...

Fonctions possibles :

- « que » ;
- « qui » ;
- « celui que ».

Très haute fréquence.

---

# I. Négation

[TUNISIEN GÉNÉRAL]

Structure typique :

> ma + verbe + ch

Exemples pédagogiques :

> ma na3refch

> ma fhemtch

> ma yesta3mlouch

> ma tnajamch

Dans le discours moderne, certaines constructions contenant des emprunts peuvent produire des formes hybrides :

> mahouche juste un problème technique.

---

# J. Interrogation

Très utiles :

- chnowa / chneya = quoi ;
- kifech = comment ;
- 3lech = pourquoi ;
- chkoun = qui ;
- wa9tech = quand ;
- 9addech = combien.

L’usage doit rester cohérent avec l’oralité.

---

# K. Constructions aspectuelles

## `wallina`

Exemple directement issu de Mahdi :

> wallina n9oulou kol chay lel AI.

Sens :

> « on en est venus à / maintenant on… »

Ce terme apporte davantage qu’une simple traduction de « maintenant ».

Il encode une **évolution du comportement**.

---

# PARTIE 3 — FRANCO-TUNISIEN

## Principe 1 — Il n’existe pas une orthographe unique à imposer

**RÈGLE**

La graphie doit être :

1. reconnaissable ;
2. prononçable ;
3. cohérente ;
4. rapide à lire.

Le projet le formule explicitement ainsi : la priorité est de permettre à Mahdi de comprendre et prononcer immédiatement le mot et de retrouver son accent oral.

---

## Phénomène : possession

**RÈGLE**

Utiliser la famille `mte3`.

**EXEMPLES**

> mte3na  
> mte3hom  
> mte3ek

**VARIANTES**

> mta3na  
> mté3na

**PRÉFÉRENCE DU CORPUS**

`mte3`.

**ERREUR FRÉQUENTE**

Changer arbitrairement entre trois graphies dans le même texte.

---

## Phénomène : `خ`

**RÈGLE**

Utiliser fréquemment `5`.

**EXEMPLES**

> 5ater  
> ye5dem  
> 5edma

**VARIANTE**

> khater  
> yekhdem  
> khedma

**COMMENT CHOISIR**

Dans ce projet, `5` correspond mieux à la convention explicitement retenue.

---

## Phénomène : `ح`

**RÈGLE**

`7`.

**EXEMPLES**

> 7aja  
> 7atta  
> l7a9  
> 7yetna

---

## Phénomène : `ع`

**RÈGLE**

`3`.

**EXEMPLES**

> na3ref  
> mte3  
> 3lech  
> 3alle5er

---

## Phénomène : contractions

Le Franco-Tunisien naturel ne doit pas sur-segmenter les mots.

Exemples :

> fl Instagram

plutôt que :

> fi el Instagram

lorsque la prononciation réelle est contractée.

Autres constructions pédagogiques :

> mel PFE

> lel AI

---

## Phénomène : mots français

**RÈGLE**

Ne pas écrire phonétiquement :

> klo-d  
> watarmark  
> pé-ef-eu

Conserver :

> Claude  
> watermark  
> PFE

Cette convention est explicite dans le projet.

---

## Phénomène : accents français

Le Franco-Tunisien du projet évite généralement d’introduire une orthographe française sophistiquée dans les mots tunisiens.

Préférer :

> mte3

à une tentative pseudo-normalisée comme :

> mtéâ

L’objectif est l’usage pratique.

---

# EXEMPLE COMPLET

### Version naturelle du corpus

> l’historique mte3na fi ChatGPT ynajem ykoun a5tar men historiquena fl Instagram?  
> 5ater l7a9, wallina n9oulou kol chay lel AI. Men 5edmetna, l7yetna personnelle, 7atta 7ajet intimes...

### Ce que cet exemple enseigne

`mte3na` : possession.

`fi ChatGPT` : préposition + nom propre conservé.

`ynajem ykoun` : possibilité.

`a5tar` : `5` pour خ.

`fl Instagram` : contraction.

`5ater` : connecteur tunisien.

`l7a9` : article fusionné + `7`.

`wallina` : évolution d’un comportement.

`n9oulou` : `9`.

`AI` : terme technique non traduit.

`5edmetna` : lexème tunisien + suffixe possessif.

`l7yetna personnelle` : structure tunisienne + adjectif français.

`7ajet intimes` : nom tunisien + adjectif français.

Ce dernier point est particulièrement important : le code-switching peut se produire **à l’intérieur d’un groupe nominal**, et pas uniquement phrase par phrase.

---

# PARTIE 4 — TUNISIEN EN ALPHABET ARABE

## Objectif

Le principal danger est de croire que :

> « écrire avec l’alphabet arabe = écrire en arabe standard ».

C’est faux.

Il faut conserver :

- lexique tunisien ;
- morphologie tunisienne ;
- constructions tunisiennes ;
- rythme tunisien ;
- contractions tunisiennes.

---

## Comparaison

### Trop standard

> يجب أن ننتبه إلى المخاطر التي يمكن أن تنتج عن استخدام الذكاء الاصطناعي.

### Tunisien

> لازمنا نردّوا بالنا من المخاطر اللي تنجم تجي من استعمال الـAI.

Ou, selon le niveau de code-switching souhaité :

> لازمنا نردّوا بالنا من المخاطر اللي تنجم تجي كي نستعملوا AI.

Le deuxième choix est généralement plus proche du type d’oralité recherché dans ce projet.

---

## Formes importantes

| Latin | Arabe tunisien | Sens |
|---|---|---|
| barcha | برشة | beaucoup |
| 7aja | حاجة | chose |
| 5ater | خاطر | parce que |
| mte3 | متاع | de / appartenant à |
| bech | باش | futur / pour |
| tawa | توّا | maintenant |
| ynajem | ينجم | peut |
| yesta3mel | يستعمل | utiliser |
| kifech | كيفاش | comment |
| chkoun | شكون | qui |
| na3ref | نعرف | je sais |
| elli | اللي | que / qui |
| chnowa | شنوة | quoi |
| 3lech | علاش | pourquoi |
| l7a9 | الحق | en vérité / vraiment |

---

## Conserver la syntaxe dialectale

Français :

> On a commencé à tout raconter à l’IA.

Tunisien arabe naturel :

> ولّينا نقولوا كل شي للـAI.

Pas :

> لقد بدأنا بإخبار الذكاء الاصطناعي بكل شيء.

La deuxième phrase est correcte en arabe mais appartient à un autre système linguistique.

---

## Français et anglais en mode arabe

Il n’existe pas une règle absolue.

Selon la lisibilité recherchée :

> نستعمل Claude

peut être préférable à :

> نستعمل كلود

si le nom de produit est naturellement lu en français/anglais.

Le document du projet insiste particulièrement sur le fait que les termes techniques doivent rester dans leur orthographe originale lorsque c’est ainsi que Mahdi les prononce.

Toutefois, la règle générale du projet est d’éviter le mélange d’alphabets lorsqu’un script est demandé entièrement en Franco-Tunisien. Le passage au script arabe constitue donc un **mode différent**, demandé explicitement par l’utilisateur.

---

# PARTIE 5 — CODE-SWITCHING

# 1. Principe fondamental

Le code-switching tunisien naturel ne consiste pas à :

> prendre une phrase française et remplacer quelques mots par du tunisien.

Il fonctionne plutôt ainsi :

**structure grammaticale tunisienne + vocabulaire issu des langues réellement utilisées dans le domaine.**

---

# 2. Technologie / IA

Naturel :

> barcha menkom yesta3mlou Claude

Naturel :

> ki ta3mel copy-coller

Naturel :

> el watermark

Naturel :

> partie mel PFE

Moins naturel pour le corpus :

> l’intelligence artificielle Claude est utilisée par beaucoup d’entre vous pour réaliser votre projet de fin d’études.

Même si cette phrase est compréhensible, elle ne reproduit pas la parole recherchée.

---

# 3. Études

Exemples :

> 3andi PFE

> 3andi projet

> bech na3mel présentation

> prof mte3i

> soutenance

> mémoire

> stage

La traduction systématique des noms institutionnels est inutile.

---

# 4. Travail

> alternance

> réunion

> manager

> feedback

> deadline

> client

> projet

Les éléments grammaticaux restent tunisiens :

> 3andi réunion ghodwa.

> el manager mte3i 3tani feedback.

---

# 5. Business

Le vocabulaire spécialisé peut rester :

- business ;
- client ;
- startup ;
- marché ;
- produit ;
- sales ;
- marketing ;
- stratégie.

Exemple naturel :

> el produit behi ama el marketing mte3hom dha3if.

---

# 6. Marketing / contenu

Le corpus privilégie naturellement :

- contenu ;
- script ;
- hook ;
- CTA ;
- vidéo ;
- Reels ;
- TikTok ;
- audience ;
- engagement.

Le modèle ne doit surtout pas forcer des traductions arabes que l’orateur n’utiliserait jamais spontanément.

---

# 7. Relation entre langue et domaine

Une règle importante peut être déduite :

Plus un domaine est :

- professionnel ;
- universitaire ;
- technologique ;
- digital ;

plus la proportion de français/anglais acceptable augmente.

Plus une phrase concerne :

- émotions ;
- vécu quotidien ;
- famille ;
- réactions immédiates ;

plus le tunisien pur peut naturellement reprendre de place.

Ceci est une **tendance**, pas une formule mathématique.

---

# 8. Morphologie hybride

Les éléments étrangers peuvent recevoir un environnement tunisien :

> profil mte3ek

> scripts mte3na

> parties kbar

> el logiciel hedha

> les données mte3ek

La naturalité vient souvent précisément de cette hybridation.

---

# PARTIE 6 — DICTIONNAIRE D’APPRENTISSAGE ESSENTIEL

Les mots ci-dessous sont séparés selon leur provenance. Les mots marqués ★ apparaissent explicitement dans les instructions ou formulations accessibles du projet.

| Tunisien latin | Arabe | Sens | Usage / remarque |
|---|---|---|---|
| ★ barcha | برشة | beaucoup | Très fréquent |
| ★ 7aja | حاجة | chose | `7ajet` au pluriel |
| ★ 5ater | خاطر | parce que | Connecteur oral |
| ★ mte3 | متاع | de / appartenant à | Possession |
| ★ bech | باش | futur / afin de | Très fréquent |
| ★ tawa | توّا | maintenant | Oral |
| ★ 3alle5er | عالآخر | énormément / à fond | Intensification |
| ★ ynajem | ينجم | il peut | Risque, possibilité |
| ★ yesta3mel | يستعمل | il utilise | Technologie |
| ★ kifech | كيفاش | comment | Interrogation |
| ★ chkoun | شكون | qui | Interrogation |
| ★ rod belou | رد بالك | fais attention | Mise en garde |
| ★ na3ref | نعرف | je sais | Très fréquent |
| ★ elli | اللي | que / qui | Relatif |
| ★ l7a9 | الحق | vraiment / à vrai dire | Marqueur discursif |
| ★ wallina | ولّينا | nous sommes devenus / maintenant on | Évolution |
| ★ n9oulou | نقولوا | nous disons | Exemple réel |
| ★ kol chay | كل شي | tout | Fréquent |
| ★ 5edma | خدمة | travail | `5edmetna` = notre travail |
| ★ 7yet | حياة | vie | `7yetna` |
| 7atta | حتى | même / jusqu’à | Très fréquent |
| chnowa | شنوة | quoi | Variante : chneya |
| 3lech | علاش | pourquoi | Oral |
| wa9tech | وقتاش | quand | Oral |
| 9addech | قداش | combien | Oral |
| ama | أما | mais | Connecteur |
| donc | — | donc | Code-switching fréquent possible |
| juste | — | juste / seulement | Français intégré |
| deja | — | déjà | Usage oral |
| sa3at | ساعات | parfois | Litt. « des fois » |
| menkom | منكم | parmi vous | `barcha menkom` |
| mte3hom | متاعهم | leur | Possession |
| mte3na | متاعنا | notre | Possession |
| mte3ek | متاعك | ton/ta | Possession |
| ne5dem | نخدم | je travaille | / réaliser |
| ye5dmou | يخدموا | ils travaillent / font | Exemple PFE |
| fhemt | فهمت | j’ai compris | Haute fréquence |
| ma fhemtch | ما فهمتش | je n’ai pas compris | Négation |
| lezem | لازم | il faut | Très fréquent |
| fama | فما | il y a | Tunisien central |
| ma famech | ما فمّاش | il n’y a pas | Négation |
| hedha | هذا | ceci / ce | Masculin |
| hedhi | هاذي | ceci / cette | Féminin |
| hakka | هكّا | comme ça | Oral |
| kif | كيف | comme | Comparaison |
| ki | كي | quand / lorsque | Très oral |
| mel | مالـ / من الـ | de la / du | contraction |
| lel | للـ | au / à la | contraction |
| fl | في الـ | dans le/la | contraction |

---

# Expressions à apprendre comme unités

## `barcha menkom`

> beaucoup d’entre vous

Pas besoin de reconstruire mot à mot.

---

## `5ater l7a9`

Dans certains contextes :

> parce qu’en réalité...

> parce que franchement...

L’équivalent dépend du discours.

---

## `rod belou`

Expression de mise en garde.

Le modèle doit comprendre sa fonction pragmatique et non seulement sa traduction.

---

## `wallina + verbe`

Exprime souvent un changement collectif :

> wallina nesta3mlou AI fi kol chay.

= l’IA a progressivement pris une place beaucoup plus grande dans nos usages.

---

# PARTIE 7 — APPRENDRE LA NATURALITÉ

Les contrastes ci-dessous ne sont **pas tous des corrections historiques mot pour mot**. Certains sont construits pédagogiquement à partir des règles observées. C’est volontairement indiqué pour ne pas fabriquer de faux feedbacks.

---

## CONTRASTE 1

**ARTIFICIEL**

> L’historique de nos conversations sur ChatGPT peut être plus dangereux que l’historique de notre Instagram.

**NATUREL — exemple réel de Mahdi**

> l’historique mte3na fi ChatGPT ynajem ykoun a5tar men historiquena fl Instagram?

**Pourquoi**

La deuxième phrase :

- pense tunisien ;
- conserve les noms modernes ;
- utilise `mte3na`, `ynajem ykoun`, `fl` ;
- fonctionne comme hook oral.

---

## CONTRASTE 2

**ARTIFICIEL**

> Parce qu’en vérité, nous sommes devenus des personnes qui racontent absolument tout à l’intelligence artificielle.

**NATUREL — formulation observée**

> 5ater l7a9, wallina n9oulou kol chay lel AI.

**Leçon**

Ne pas transformer une phrase orale simple en explication écrite.

---

## CONTRASTE 3

**ARTIFICIEL**

> De notre travail jusqu’à notre vie personnelle.

**NATUREL**

> Men 5edmetna, l7yetna personnelle...

**Leçon**

Le mélange tunisien/français peut être plus naturel que la purification linguistique.

---

## CONTRASTE 4

**ARTIFICIEL**

> même certaines choses de nature intime

**NATUREL — formulation observée**

> 7atta 7ajet intimes

**Leçon**

`7ajet + adjectif français` est une hybridation crédible.

---

## CONTRASTE 5

**ARTIFICIEL**

> Beaucoup parmi vous utilisent Claude afin d’effectuer de grandes parties de leur projet de fin d’études.

**NATUREL — exemple du corpus**

> Na3ref elli barcha menkom yesta3mlou Claude bech ye5dmou parties kbar mel PFE mte3hom.

**Leçon**

Le français technique peut rester intact à l’intérieur de la phrase tunisienne.

---

## CONTRASTE 6

**ARTIFICIEL**

> الذكاء الاصطناعي كلود

**NATUREL POUR CE REGISTRE**

> Claude

**Leçon**

Ne pas traduire les marques et outils.

---

## CONTRASTE 7

**ARTIFICIEL**

> العلامة المائية الرقمية

**NATUREL POUR CE CORPUS**

> watermark

**Leçon**

Un mot techniquement traduisible ne doit pas forcément être traduit.

---

## CONTRASTE 8

**ARTIFICIEL**

> projet de fin d’études mte3hom

**PLUS NATUREL**

> PFE mte3hom

**Leçon**

Utiliser l’abréviation réellement courante dans le contexte étudiant.

---

## CONTRASTE 9

**ARTIFICIEL**

> Pour cette raison, il est nécessaire de faire attention.

**NATUREL**

> donc lezem trod belek.

Ou :

> w hné lezem trod belek.

**Leçon**

Les transitions peuvent être hybrides et simples.

---

## CONTRASTE 10

**ARTIFICIEL**

> Nous devons nous interroger sur la manière dont nous utilisons l’IA.

**NATUREL**

> lezemna nefhmou kifech nesta3mlou l’AI.

---

## CONTRASTE 11

**ARTIFICIEL**

> Cette chose représente un danger très important.

**NATUREL**

> hedhi 7aja tnajem tkoun dangereuse barcha.

Ou plus sobre :

> w hné fama risque.

**Leçon**

Le modèle doit éviter de forcer tous les noms abstraits en arabe.

---

## CONTRASTE 12

**ARTIFICIEL**

> Il est possible qu’il soit.

**NATUREL**

> ynajem ykoun.

**Leçon**

Apprendre des séquences lexicales complètes.

---

## CONTRASTE 13

**ARTIFICIEL**

> à l’intérieur d’Instagram

**NATUREL**

> fl Instagram

**Leçon**

Contraction et rythme.

---

## CONTRASTE 14

**ARTIFICIEL**

> afin qu’ils travaillent sur des parties importantes

**NATUREL**

> bech ye5dmou parties kbar

---

## CONTRASTE 15

**ARTIFICIEL**

> Tout le monde utilise maintenant cette application.

**NATUREL**

> tawa presque kol we7ed yesta3melha.

**Statut : pédagogique construit**

---

## CONTRASTE 16

**ARTIFICIEL**

> Lorsque tu emploies l’intelligence artificielle sans savoir ce qu’elle fait...

**NATUREL**

> ki testa3mel AI sans ma ta3ref chnowa ta3mel...

**Statut : pédagogique construit**

---

## CONTRASTE 17

**ARTIFICIEL**

> Ce n’est pas uniquement un problème concernant les étudiants.

**NATUREL**

> w el mochkla mahich ken fel étudiants.

---

## CONTRASTE 18

**ARTIFICIEL**

> La question que nous devons nous poser est la suivante.

**NATUREL**

> el sou2el hné...

ou directement la question.

**Leçon**

Supprimer les introductions écrites inutiles.

---

## CONTRASTE 19

**ARTIFICIEL**

> Permettez-moi de vous expliquer.

**NATUREL**

Commencer immédiatement l’explication.

**Leçon**

L’oral vidéo court ne nécessite pas toutes les transitions conversationnelles.

---

## CONTRASTE 20

**ARTIFICIEL**

> Dans cette vidéo, nous allons découvrir...

**NATUREL**

Commencer par l’information, le paradoxe ou la question.

**Leçon**

Éviter les hooks génériques d’IA.

---

## CONTRASTE 21

**ARTIFICIEL**

> Vous n’allez jamais croire ce que Claude vient de faire !

**NATUREL**

> ken testa3mel Claude fil PFE mte3ek, fama 7aja lezem ta3refha.

**Statut : construit à partir des règles**

**Leçon**

Créer de la curiosité sans clickbait artificiel.

---

## CONTRASTE 22

**ARTIFICIEL**

> C’est terrifiant et cela va changer l’humanité pour toujours.

**NATUREL**

Expliquer le mécanisme concret et laisser le spectateur comprendre le risque.

**Leçon**

Le projet privilégie la valeur au sensationnalisme.

---

## CONTRASTE 23

**ARTIFICIEL**

> Premièrement... deuxièmement... troisièmement...

**NATUREL**

> el mochkla loula... w surtout...

ou transitions implicites.

**Leçon**

Une structure logique n’a pas besoin d’être visible comme un plan scolaire.

---

## CONTRASTE 24

**ARTIFICIEL**

> Il existe un concept psychologique qui se nomme...

**NATUREL**

Commencer par le cas :

> 3lech ki tركب meuble IKEA bidek, normalement t7essou a7sen?

Puis introduire le concept.

**Leçon**

Cas avant théorie lorsque le cas est plus accrocheur.

---

## CONTRASTE 25

**ARTIFICIEL**

> Les CAPTCHA sont des systèmes de vérification destinés à distinguer les humains des robots.

**NATUREL POUR UNE VIDÉO**

> ta3ref les CAPTCHA elli kol mara y9ollek e5tar les feux rouges wela les voitures?

Puis expliquer.

**Leçon**

Commencer par une expérience reconnue.

---

## CONTRASTE 26

**ARTIFICIEL**

> Airbnb est une plateforme de location de logements entre particuliers.

**NATUREL POUR CONTENU**

Ne pas perdre les premières secondes à expliquer ce que l’audience sait déjà.

Passer directement à l’élément surprenant du cas.

---

## CONTRASTE 27

**ARTIFICIEL**

> L’Estonie est un pays européen qui possède une population de...

**NATUREL POUR L’ANGLE DU PROJET**

Commencer par l’innovation concrète qui intéresse l’audience tunisienne, puis poser la question :

> chnowa najmou net3almou menhom fi Tounes?

**Leçon**

Adapter l’information à la raison pour laquelle le Tunisien doit s’y intéresser.

---

## CONTRASTE 28

**ARTIFICIEL**

> Mon père possède quarante années d’expérience dans l’enseignement du français.

**NATUREL DANS UN STORYTELLING PERSONNEL**

Faire des 40 ans d’expérience une preuve intégrée à l’histoire du projet père-fils, pas un argument publicitaire isolé.

**Leçon issue du projet livre.**

---

## CONTRASTE 29

**ARTIFICIEL**

> Profitez dès maintenant de cette remise exceptionnelle de dix dinars !

**PLUS COHÉRENT AVEC LE PROJET**

Expliquer d’abord :

- pourquoi le livre existe ;
- pourquoi Mahdi y tient ;
- l’expérience du père ;
- le travail mis dedans ;

puis mentionner la promotion.

**Leçon**

La vente vient après la crédibilité.

---

## CONTRASTE 30

**ARTIFICIEL**

> Voici trois raisons pour lesquelles ce livre est absolument incroyable.

**NATUREL**

Une expérience ou une conviction personnelle mène vers le produit.

**Leçon**

Éviter le format publicitaire standard.

---

## 10 PRINCIPES GÉNÉRAUX DE NATURALITÉ DÉDUITS

1. Une phrase courte et crédible vaut mieux qu’une phrase parfaitement littéraire.
2. Le tunisien n’a pas besoin d’être lexicalement « pur ».
3. La structure profonde doit rester tunisienne.
4. Les mots professionnels modernes peuvent rester français/anglais.
5. Les contractions renforcent souvent l’oralité.
6. Les formulations de Mahdi priment sur les conventions théoriques.
7. Traduire mot à mot est un anti-pattern.
8. Trop embellir dégrade parfois le script.
9. La répétition orale utile n’est pas la même chose qu’une répétition inutile.
10. Un texte vidéo doit être évalué en le récitant, pas uniquement en le lisant.

---

# PARTIE 8 — APPRENTISSAGE À PARTIR DES CORRECTIONS DE MAHDI

Cette section est particulièrement importante car les corrections utilisateur valent davantage que les réponses générées antérieurement.

---

# GROUPE DE CORRECTIONS A — NE PAS « AMÉLIORER » CE QUI ÉTAIT DÉJÀ VALIDÉ

## CONTEXTE

Mahdi a transmis une version corrigée du script sur l’historique ChatGPT.

Début accessible :

> l’historique mte3na fi ChatGPT ynajem ykoun a5tar men historiquena fl Instagram?

> 5ater l7a9, wallina n9oulou kol chay lel AI. Men 5edmetna, l7yetna personnelle, 7atta 7ajet intimes...

L’assistant avait tenté d’apporter de nouvelles modifications.

Mahdi a précisé que ce n’était pas le but : il voulait que cette version serve de **référence pour apprendre de ses corrections linguistiques et éditoriales**.

## LEÇON À RETENIR

Une production validée n’est pas un brouillon permanent.

Lorsqu’un texte de Mahdi est fourni comme référence :

- analyser ;
- extraire les règles ;
- ne pas automatiquement le réécrire.

## COMPÉTENCE ENSEIGNÉE

Apprentissage à partir de feedback.

---

# GROUPE B — ALLÉGER SANS PERDRE LA VALEUR

## CORRECTION OBSERVÉE

Mahdi explique avoir :

> épuré la présentation pour que ce soit plus léger et plus simple à lire sans altérer le contenu et la valeur.

## LEÇON

L’amélioration ne signifie pas :

> ajouter davantage de sophistication.

Elle peut signifier exactement l’inverse :

> retirer ce qui gêne la transmission.

## RÈGLE GÉNÉRALE DÉDUITE

Lorsqu’un script semble « meilleur écrit » mais « moins facile à dire », préférer la version orale.

---

# GROUPE C — LES MOTS TECHNIQUES DOIVENT ÊTRE IDENTIFIÉS EXACTEMENT

## CONTEXTE

Une erreur de transcription a eu lieu.

Mahdi a corrigé :

> je voulais dire watermark.

## LEÇON

Un terme technique est parfois le cœur du sujet.

Une mauvaise transcription peut changer entièrement :

- le raisonnement ;
- la recherche ;
- l’exemple ;
- le hook.

## COMPÉTENCE

Détection d’anomalie de transcription.

---

# GROUPE D — NE PAS RESTER AU NIVEAU « C’EST DANGEREUX »

## CONTEXTE CLAUDE / WATERMARK

Mahdi a demandé d’ajouter une explication :

- technique ;
- simple ;
- avec exemple ;
- permettant de comprendre concrètement le risque.

Il a ensuite précisé une question encore plus spécifique :

> est-ce que par exemple un prof, s’il met ton PDF dans un détecteur, il pourra détecter plus facilement avec les nouveaux watermark de Claude ?

## LEÇON

Pour Mahdi, une bonne vulgarisation suit souvent :

**affirmation → mécanisme → exemple → conséquence concrète.**

Pas :

**affirmation → autre affirmation → conclusion alarmiste.**

## COMPÉTENCE

Vulgarisation causale.

---

# GROUPE E — LES EXEMPLES DOIVENT ÊTRE ANCRÉS

## CONTEXTE

Sur plusieurs idées de contenu destinées aux jeunes, Mahdi a demandé :

- pour le chantage : exemples précis et détaillés ;
- pour un second phénomène : un ou deux exemples précis ;
- pour CAPTCHA : expliquer le système et son utilisation ;
- pour Airbnb : donner davantage que le concept abstrait ;
- pour IKEA : expliquer le concept puis donner un cas ;
- pour l’Estonie : passer du pays à des actions dont la Tunisie pourrait s’inspirer.

## LEÇON

Une idée abstraite seule est insuffisante.

Le modèle doit rechercher dans la matière déjà validée :

> « Quel cas permet au spectateur de voir l’idée ? »

## COMPÉTENCE

Storytelling + pédagogie concrète.

---

# GROUPE F — COMMENCER PAR LE CAS LE PLUS FORT

Mahdi a demandé explicitement, pour une série de scripts, de :

> commencer avec le premier cas qui est le plus intéressant

avant de passer au second.

## LEÇON

L’ordre logique n’est pas forcément l’ordre de découverte.

Pour une vidéo courte :

> information la plus magnétique d’abord.

## COMPÉTENCE

Hiérarchisation narrative.

---

# GROUPE G — CONTENU PERSONNEL : VALEUR ÉMOTIONNELLE AVANT ARGUMENT COMMERCIAL

## CONTEXTE

Projet de livre avec son père.

Éléments donnés par Mahdi :

- son père a environ 40 ans d’expérience ;
- beaucoup d’efforts ont été mis dans le livre ;
- la qualité graphique lui paraît exceptionnelle ;
- une promotion de 10 dinars est proposée ;
- le projet représente aussi l’union entre un père et son fils ;
- l’objectif est de transmettre l’expérience du père à davantage de personnes.

## LEÇON

Le véritable matériau différenciant n’est pas :

> « produit de bonne qualité + promotion ».

C’est :

> projet père-fils + expertise + transmission + produit.

La promotion devient un élément secondaire de conversion.

## COMPÉTENCE

Storytelling de marque personnel.

---

# GROUPE H — RECHERCHE EXTERNE : SÉPARER VÉRIFICATION ET ÉCRITURE

Cette règle est extrêmement structurante.

Le projet interdit d’insérer automatiquement dans un script :

- une information trouvée sur Internet ;
- une statistique ;
- une précision technique ;
- une correction factuelle ;
- un nouvel argument.



Après recherche, les éléments doivent être présentés séparément et Mahdi choisit ce qu’il veut intégrer.

## POURQUOI CETTE RÈGLE EST PÉDAGOGIQUEMENT IMPORTANTE

Elle apprend au modèle à distinguer trois activités :

### A. Comprendre Mahdi

« Qu’est-ce qu’il veut dire ? »

### B. Vérifier le monde

« Est-ce exact ? »

### C. Modifier son contenu

« Veut-il réellement intégrer la correction ? »

Un LLM naïf fusionne A, B et C.

Le modèle formé doit les garder séparés.

---

# GROUPE I — CORRECTION LOCALE VS RÈGLE PERMANENTE

Toutes les corrections ne doivent pas devenir une loi universelle.

Le projet définit explicitement deux catégories :

### Correction ponctuelle

Valable pour le script actuel.

### Feedback process

Expressions comme :

- « à partir de maintenant » ;
- « garde ça pour les prochains scripts » ;
- « ajoute ça aux règles » ;
- « prends ça en compte dans notre process ».

Dans ce second cas seulement, la préférence devient permanente.

## COMPÉTENCE

Apprentissage continu contrôlé.

---

# SYNTHÈSE DES CORRECTIONS EN RÈGLES D’APPRENTISSAGE

| Observation | Règle généralisée |
|---|---|
| Mahdi épure un script | Ne pas confondre valeur et longueur |
| Il garde beaucoup de FR/EN | Ne pas purifier artificiellement le tunisien |
| Il corrige `watermark` | Les termes techniques doivent être exacts |
| Il demande « comment techniquement ? » | Expliquer les mécanismes |
| Il demande des anecdotes précises | Concrétiser les concepts |
| Il veut commencer par le cas le plus intéressant | Mettre la force narrative avant l’ordre académique |
| Il refuse les ajouts non demandés | Fidélité > créativité autonome |
| Il donne une version corrigée comme modèle | Apprendre de la correction, ne pas la réécrire |
| Il veut des scripts légers à lire | Optimiser pour la récitation |
| Il sépare recherche et script | Aucun fait externe intégré sans validation |

---

# MODÈLE MENTAL À ENSEIGNER AU LLM

Avant de produire une phrase tunisienne, effectuer mentalement les opérations suivantes :

### 1. Sens

Qu’est-ce que la personne cherche réellement à dire ?

### 2. Source

Cette idée vient-elle de Mahdi, d’une correction validée, ou du modèle ?

### 3. Naturalité

Comment un Tunisien dirait-il cette idée oralement ?

### 4. Mahdi

Parmi les formulations naturelles possibles, laquelle est la plus proche des habitudes observées dans ce corpus ?

### 5. Code-switching

Quels termes seraient réellement prononcés en français ou en anglais ?

### 6. Translittération

Quelle graphie sera la plus rapide à lire à voix haute ?

### 7. Vidéo

La phrase a-t-elle une fonction réelle dans le script ?

### 8. Compression

Peut-on dire exactement la même chose plus simplement ?

### 9. Fidélité

A-t-on ajouté une information que Mahdi n’a jamais donnée ?

### 10. Oralisation

La phrase fonctionne-t-elle lorsqu’elle est prononcée normalement ?

---

# TEST RAPIDE DE NATURALITÉ

Une production doit être suspectée d’être artificielle lorsqu’elle présente plusieurs de ces symptômes :

- trop peu de code-switching dans un domaine technique ;
- mots arabes formels inutiles ;
- phrases longues ;
- connecteurs littéraires ;
- structure trop parfaite ;
- hook sensationnaliste ;
- chaque idée expliquée deux fois ;
- vocabulaire différent de celui fourni dans la matière brute ;
- traduction systématique des noms techniques ;
- absence de contractions ;
- CTA générique ;
- introduction « dans cette vidéo... » ;
- conclusion grandiloquente ;
- ajout d’arguments non demandés.

Inversement, une bonne production du corpus présente généralement :

- structure claire mais invisible ;
- phrases relativement courtes ;
- mots de Mahdi conservés ;
- code-switching cohérent avec le domaine ;
- exemples précis ;
- hook fondé sur l’idée elle-même ;
- densité élevée ;
- formulation immédiatement récitable ;
- absence de remplissage.

---

# ÉTAT DE L’EXTRACTION APRÈS LA PARTIE 8

Les compétences linguistiques les plus solidement documentées sont actuellement :

1. Franco-Tunisien ;
2. code-switching ;
3. naturalité orale ;
4. fidélité aux idées ;
5. scripts vidéo courts ;
6. hooks sous forme de comparaison/question ;
7. condensation ;
8. exemples concrets ;
9. vulgarisation ;
10. apprentissage par correction.

Les domaines où les données accessibles sont actuellement moins riches sont :

- morphologie tunisienne exhaustive ;
- conjugaisons systématiques ;
- variations régionales ;
- corpus important en alphabet arabe ;
- très grand lexique conversationnel hors création de contenu ;
- humour tunisien ;
- registres très familiers ;
- expressions régionales ;
- phonétique fine.

Ces lacunes devront rester explicitement marquées dans les volumes suivants plutôt que d’être présentées comme apprentissage issu du projet.