# video-projects/

C'est ici qu'atterrit ton travail. Un dossier par tournage, daté :

    video-projects/AA-MM-JJ-sujet-en-kebab/

Le plus simple est de laisser le skill s'en charger — ouvre Claude Code à la
racine et lance `/reel-format`. Il pose une question, choisit le format et
crée le dossier avec son squelette.

À la main :

    mkdir video-projects/26-01-15-mon-sujet
    cp -R style-templates/reel-04-sujet-central/. video-projects/26-01-15-mon-sujet/   # le format par défaut (formats/04-sujet-central.md)
    cd video-projects/26-01-15-mon-sujet
    # puis édite meta.json, dépose ton rush dans assets/, remplis BRIEF.md (le script tel que
    # tu le dis, les sous-titres, le CTA, les preuves) et suis PROCESS.md

Chaque projet est autonome : `index.html`, `compositions/`, `assets/`,
`renders/`, `hyperframes.json`, `meta.json`.
