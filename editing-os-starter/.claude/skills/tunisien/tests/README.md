# Tests du skill `tunisien`

Le skill a été écrit en TDD : un agent sans le skill a d'abord traité un reel **jamais vu**
(sujet absent du corpus), ses écarts ont dicté `SKILL.md`, puis le même exercice a été rejoué
avec le skill. Rejouer après toute modification du skill ou l'arrivée d'un nouveau volume du
corpus.

## La fixture `reel-ats/`

- `make_fixture.py` — génère `transcript.json` : un reel de 43,7 s sur les ATS (logiciels qui
  lisent les CV), écrit **comme whisper `--language ar` l'écrirait** (mots français en lettres
  arabes, derja respelée), avec des timings plausibles. La vérité terrain (ce que dit vraiment
  le créateur, en Franco-Tunisien de convention) est en tête du script.
- `prompt-tache.md` — la consigne donnée à l'agent (six sections : verbatim + glose, `CAPS`,
  lecture éditoriale, quatre moments à l'écran, incertitudes, ajout du créateur en latin ET en
  arabe). Remplacer `__TRANSCRIPT__` et `__OUT__` par les chemins.

## Rejouer

1. **RED** — lancer un sous-agent avec `prompt-tache.md` seul (sans nommer le skill). Lire
   sa sortie contre la liste ci-dessous.
2. **GREEN** — même consigne, précédée de « invoque le skill `tunisien` avant de commencer ».
3. **Découverte** — même consigne sans nommer le skill, une fois `CLAUDE.md` à jour : l'agent
   doit trouver et charger `tunisien` seul.
4. Comparer. Chaque écart nouveau devient une ligne de « Rationalisations à refuser » dans
   `SKILL.md` ou une règle dans le fichier de référence concerné.

**L'agent testé ne doit pas lire ce fichier** (il contient les attendus) : le dire dans la
consigne, ou vérifier dans son résumé ce qu'il a ouvert.

Résultats du 06/09/2026 : RED = les écarts de la troisième colonne ; GREEN et découverte =
tous les points conformes (`5ater l7a9`, `3alle5er`, `ynajem`, `trod belek`, `w hné`, `fel CV`,
glossaire en tête, `[?]` sur « colonnes / couleurs » sans visuel, version arabe tunisienne avec
îlots latins et refus explicite de المترشحين) ; le skill a été chargé spontanément en découverte.

## Ce que la sortie doit montrer (GREEN)

| Point | Attendu | Écart observé au RED (06/09/2026) |
|---|---|---|
| خ | `5ater`, `ne5tar`, `a5tar` | `khater`, choisi parce que le créateur avait écrit `khedmet` une fois |
| unité | `5ater l7a9` lu « parce qu'en fait » | `khater el 7a9`, « aucune confiance sur le sens » |
| lexique | `3alle5er` (à fond) | `3al akher` |
| forme | `ynajem`, `trod belek`, `w hné` | `ynajjem`, `troud belek`, `w houni` |
| contraction | `fel CV`, `fel commentaires` | `fi el CV`, `fi les commentaires` |
| FR / EN | orthographe exacte, sigles, jamais traduits | conforme |
| mode | sous-titres dans le mode demandé, glossaire en tête | conforme (mode donné dans la consigne) |
| arabe | tunisien, îlots latins pour ATS / 90 % ; pas de المترشحين (MSA) | variante « tout-arabe » avec المترشحين |
| incertitude | `[?]` + deux lectures, pas de visuel dessus | conforme (colonnes / couleurs signalé) |
| ancres | orthographe whisper | conforme |
| lecture | hook, promesse, bascules, chute, CTA depuis le tunisien | conforme |
