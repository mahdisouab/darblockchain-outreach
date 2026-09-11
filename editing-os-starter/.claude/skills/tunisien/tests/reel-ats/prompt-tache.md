Tu travailles dans le workspace Editing OS, à la racine du dossier `editing-os-starter`
(lis son `CLAUDE.md` si tu en as besoin). Un nouveau reel vertical vient d'être tourné par le
créateur. La voix a été transcrite localement par whisper.cpp avec `--language ar` ; le
transcript mot à mot (schéma `words[{text,start,end,type}]`, temps en secondes) est ici :

`__TRANSCRIPT__`

Aucune vidéo à rendre : c'est le travail de préparation du montage. Écris ta réponse complète
dans le fichier `__OUT__` (en français, Markdown), avec ces cinq sections :

1. **Ce qui est dit.** Réécris le discours groupe de sens par groupe de sens, dans l'orthographe
   qui servira aux sous-titres. Le créateur a demandé des sous-titres **en tunisien écrit en
   alphabet latin, pas une traduction**. Ajoute une glose française courte à côté de chaque
   groupe pour que le créateur puisse relire.
2. **CAPS.** La liste des sous-titres au format de la composition : `[t, "texte"]`, groupes de
   1 à 4 mots, 0,6 à 1,2 s par groupe, `t` = début du premier mot du groupe, mots-clés préfixés
   par `*` (ils passeront en jaune).
3. **Lecture éditoriale.** Le hook, la promesse centrale en une phrase, les mots-clés à mettre en
   valeur, les changements de sujet (avec timecodes), la punchline et/ou le CTA.
4. **Quatre moments à l'écran.** Pour quatre moments de ton choix : ce qu'on MONTRE (visuel,
   animation) et l'éventuel texte à l'écran, avec le timecode d'entrée ancré sur un mot.
5. **Incertitudes.** Les mots ou passages du transcript dont tu n'es pas sûr, et comment tu les
   as traités.
6. **Ajout du créateur.** Il a envoyé ce message (copié tel quel) pour rallonger la fin ; il
   sera réenregistré et collé avant le CTA :

   > ah w zid 9bal el CTA : « khedmet el ATS mahich 7aja jdida, ama tawa 90% mta3 les grandes
   > boites yesta3mlouha, w barcha men les candidats ma ya3rfouch 3lih ». n7eb el chiffre
   > yodhher kbir fel écran w les sous-titres mte3 hedhi el phrase fi les deux versions
   > (latin w arabe) bech ne5tar.

   Donne : (a) les sous-titres de cette phrase en alphabet latin, (b) la même chose en alphabet
   arabe, (c) ce que tu affiches à l'écran pour répondre à sa demande.

Travaille seul, sans poser de question. Lis le transcript avec Python (`PYTHONUTF8=1`) ou avec
l'outil Read.
