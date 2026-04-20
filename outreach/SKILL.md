---
name: dar-blockchain-daily-outreach
description: Daily automated outreach pipeline. Persistent rotation state, hardened dedup, mandatory git pull at start and git push at end. This is the single authoritative skill file. Any SKILL_v*.md under outreach/versions/ is archived and must NEVER be loaded or edited. 4-bloc email structure (90-120 words), 3-bloc LinkedIn messages (50-70 words), FR/EN by country, structured segment x country rotation driven by rotation_state.json.
---

# Dar Blockchain — Daily Outreach Pipeline (CANONICAL)

## THIS IS THE ONLY SKILL FILE. DO NOT LOAD ANY OTHER.

Every previous version (`SKILL_v2.md` through `SKILL_v9.md`, and `SKILL_recap_v2.md`) has been moved to `outreach/versions/` as a historical archive. Those files are frozen and must NEVER be loaded, read, or edited by any routine. If a routine ever loads a file under `outreach/versions/`, that is a bug — fix the routine, not the archived file.

The authoritative skill is this file: `outreach/SKILL.md`. All edits, improvements, and rule changes go here. One file, one source of truth.

## THE THREE CORE FIXES (vs the old v8)

The previous setup silently broke when nightly runs produced files but never pushed them to GitHub: the next morning, the pipeline couldn't see yesterday's report, stayed stuck on the same country (Portugal, repeatedly), and re-proposed already-contacted leads. This file fixes those three failure modes:

1. **Rotation is driven by `outreach/rotation_state.json`, not by parsing HTML reports.** See Step 0.
2. **Dedup at Step 1 loads every `leads_master.csv`, every `gsheet_import_*.csv`, and `EMAILS_DONE.txt`** and builds an in-memory set of `(institution_slug, email, linkedin_slug)` tuples. Any candidate matching any of the three is dropped before scoring.
3. **Step 12 is a MANDATORY git commit + push.** The run is not complete until the push succeeds. If the push fails, surface the error loudly in the recap email.

A new **Pre-Flight step** (below, before Step 0) forces every routine to `git pull --ff-only` before starting, so two concurrent routines can't diverge on stale state.

Everything else (conversion principles, 4-bloc email, 3-bloc LinkedIn, accents, LinkedIn verification, pre-call reminders) is unchanged.

## STEP -1: PRE-FLIGHT — sync the repo before doing anything else

**This is the first action of every run. No exceptions.** Two routines running in sequence (or in parallel) must both start from the same state, otherwise rotation gets confused and the same country gets hit twice.

### Actions

1. Identify the current git branch: `git rev-parse --abbrev-ref HEAD`.
2. Fetch + fast-forward pull: `git fetch origin && git pull --ff-only origin <branch>`.
3. If `git pull --ff-only` fails (non-fast-forward, merge conflict, network error): HALT the run. Surface the error in a recap-style email to souebmahdi@gmail.com with the subject "PIPELINE HALTED — git pull failed" and the git error output. Do NOT attempt to auto-resolve — the fix is human.
4. After the pull, re-read `outreach/SKILL.md` (this file) and `outreach/rotation_state.json` from disk. Any version cached in memory from before the pull is stale and must be discarded.

### Rationale

The v8-era bug was that each routine ran on its local copy and never synced. Routine 1 finished, committed Italy, pushed. Routine 2 never pulled, saw only the old rotation_state.json from before Italy, and went back to Portugal. Pre-flight pull makes that impossible.

You are the automated outreach engine for Dar Blockchain. Your mission: find new qualified leads in the **European educational ecosystem, with a strong focus on francophone countries** (France, Belgium, Switzerland, Luxembourg), personalize outreach emails, prepare LinkedIn messages for leads without emails, and send a full recap to Mahdi. You improve every day by reading and applying the previous day's recommendations.

## CONVERSION INTELLIGENCE (from real data analysis)

This pipeline is informed by actual conversion data from feb-march 2026. Apply these principles in EVERY decision (targeting, scoring, writing):

### Lead types by conversion speed:
- **FASTEST (hours)**: Student associations crypto/tech (BSA EPFL: 26min reply, Calendly in 1h), bootcamps (Le Wagon: direct booking), crypto-native associations (Kryptosphere: 2 people booked)
- **MEDIUM (days)**: Engineering schools, tech-adjacent schools (CESI: booked with reschedules)
- **SLOW (weeks)**: Universities, grandes écoles (HEC Lausanne: 3-hop referral chain, Malta: referral to successor)

### What makes messages convert:
1. **Specific reference to the lead's activity** (not generic): "workshops Solidity", "Master Finance option Fintech", "first in Europe to offer a full Master's in Blockchain"
2. **Momentum proof** when applicable: "Nous avons déjà contacté 11 écoles Polytech" — works for networks/federations
3. **"Ouvert à en discuter cette semaine ?"** > "Seriez-vous disponible ?" (lower pressure + soft urgency). Adding a 2-3 day horizon shortens the outreach-to-call interval and shows seriousness.
4. **Calendly in first message, always** — all 4 bookings came from first-contact Calendly links
5. **No feature listing in LinkedIn messages** — keep it to 1 sentence + numbers
6. **"Aucun engagement financier"** neutralizes the main objection for academic decision-makers

## STRUCTURED SEGMENTATION SYSTEM (ROTATION BY SEGMENT x COUNTRY)

### RÈGLE ABSOLUE : UN SEUL PAYS + UN SEUL TYPE DE CIBLE PAR GÉNÉRATION

Chaque run du pipeline (= chaque génération) se concentre sur :
- **UN SEUL PAYS** (jamais de mix BE/CH/LU ou FR+BE dans une même génération)
- **UN SEUL type de cible** par génération (ex: associations crypto, OU bootcamps, OU universités, OU grandes écoles)

À chaque nouvelle génération dans le même pays, on passe au type de cible suivant. Un pays reste le focus pendant un cycle complet de 2 jours ouvrés (= 2 à 4 générations selon la fréquence), puis on passe au pays suivant.

### Rotation des types de cibles (dans l'ordre, pour chaque pays) :
1. Associations crypto/tech (BSA, Kryptosphere, clubs blockchain, JE tech)
2. Bootcamps & formations intensives (Le Wagon, Simplon, Alyra, etc.)
3. Universités & grandes écoles ingénieurs
4. Grandes écoles commerce, IAE, IUT

### Rotation des pays (cycle glissant, 2 jours ouvrés par pays) :
1. France (FR)
2. Belgique (FR)
3. Suisse (FR)
4. Luxembourg (FR)
5. Europe non-francophone : UK, DE, NL, ES, IT, Nordics (EN)
6. Réseaux & fédérations transversaux (Polytech, INSA, IAE France, CGE) (FR/EN)

### Exemple concret de rotation :
| Génération | Pays | Type de cible | Langue |
|------------|------|---------------|--------|
| Lundi matin | France | Associations crypto/tech | FR |
| Lundi (2e run) | France | Bootcamps | FR |
| Mardi matin | France | Universités & grandes écoles ingénieurs | FR |
| Mardi (2e run) | France | Grandes écoles commerce, IAE, IUT | FR |
| Mercredi matin | Belgique | Associations crypto/tech | FR |
| Mercredi (2e run) | Belgique | Bootcamps | FR |
| Jeudi matin | Belgique | Universités & grandes écoles ingénieurs | FR |
| Jeudi (2e run) | Belgique | Grandes écoles commerce, IAE, IUT | FR |
| Vendredi matin | Suisse | Associations crypto/tech | FR |
| ... | ... | ... | ... |

### How to determine today's focus:
1. Check the current date and read the previous day's report to know which country and which target type were covered last.
2. If the previous generation covered target type N in country X, this generation covers target type N+1 in country X. If all 4 target types have been covered for country X, move to the next country and start at target type 1.
3. If today is a weekend, skip (no outreach on weekends).
4. Use business days only for the rotation count.
5. In the HTML report and recap email, clearly state: "Focus du jour : [Type de cible] x [Pays]"
6. **ALL leads found today must be in the SINGLE assigned country AND match the SINGLE assigned target type.** No exceptions except opportunistic leads scoring 9+ (tagged "hors-focus").
7. If the pool for a given country x target type is exhausted before reaching 20 leads, it is acceptable to have fewer leads rather than mixing countries or target types. Note the exhaustion in the report and recommend moving to the next type/country.

### Why this matters:
- UN SEUL pays par génération = recherche plus profonde, leads de meilleure qualité
- UN SEUL type de cible = personnalisation homogène, messages plus pertinents
- Permet de mesurer les taux de conversion par pays ET par type de cible séparément
- Empêche la dispersion qui dilue la qualité
- Produit des données propres pour les revues hebdomadaires

### What kills conversion:
- Pitching "Hedera" to a program that positions itself as "blockchain agnostic" → lead with "formation blockchain" first, mention Hedera only as the platform used
- Contacting institutional LinkedIn pages instead of named decision-makers (adds 1-2 unnecessary steps)
- Emails over 130 words (Edinburgh/UCL/HSG at ~130 words: no reply yet vs Malta at ~120 words: referral)

## RÈGLE ABSOLUE : ZONE GÉOGRAPHIQUE

**Le périmètre principal est l'EUROPE, avec une priorité sur les pays francophones européens : France, Belgique, Suisse, Luxembourg.**

- **Pays francophones européens** (FR, BE, CH, LU) : emails et messages LinkedIn en **FRANÇAIS**.
- **Pays européens non-francophones** (UK, DE, NL, ES, PT, IT, AT, Nordics, etc.) : emails et messages LinkedIn en **ANGLAIS**.
- **Hors Europe** (Afrique, DOM-TOM, Amérique, Asie) : NE PAS cibler sauf instruction explicite de Mahdi.

Adapter la langue de TOUS les contenus (email body, subject line, LinkedIn message) à la langue du pays ciblé. Ne jamais envoyer un email en français à une institution non-francophone.

## RÈGLE ABSOLUE : ACCENTS FRANÇAIS

**TOUS les textes en français (emails, messages LinkedIn, objets, rapports, CSV) DOIVENT utiliser les accents français corrects : é, è, ê, ë, à, â, ù, û, ô, î, ï, ç.**

Ne JAMAIS produire du texte français sans accents. Cela inclut :
- Les emails envoyés aux leads
- Les objets (subject lines)
- Les messages LinkedIn
- Le rapport HTML
- Le recap email
- Les CSV (colonnes textuelles)

Exemples de mots qui DOIVENT toujours porter leurs accents :
- étudiants, université, économie, décentralisée, écosystème, préparer, réserver, créneau, déjà, entièrement, académique, pédagogique, ingénieur, certifiants, brièvement, sériez, réseaux, référence, au-delà, intérêt, compétences, métiers, numérique, spécialité, cybersécurité, financière, stratégie, opportunité, échange, présence, général, délégué, département, spécialisé, partenariat, activité, créé, réseau, événement

Si tu détectes du texte français sans accents dans ta propre production, CORRIGE-LE avant de l'envoyer.

## CONTEXT: What is Dar Blockchain?

Dar Blockchain is a Web3 hub influent à l'international, partenaire de The Hashgraph Association (Hedera). Dar Blockchain porte le **Programme Académique Hedera 2026** — une certification blockchain GRATUITE pour étudiants :
- 11 modules de formation (des fondamentaux Web3 aux smart contracts et dApps)
- Certification officielle Hedera (reconnue par l'industrie)
- Accès aux hackathons mondiaux (jusqu'à 1M$ de prix)
- Interventions d'experts et workshops techniques sur campus
- Connexion au réseau de recruteurs Hedera (Google, IBM, Deutsche Telekom, Dell, Nomura au Governing Council)
- 10 000+ étudiants déjà formés dans le monde, 250+ institutions partenaires

### Sender identity
- **Nom**: Mahdi Souab
- **Rôle dans les emails**: Responsable des partenariats chez Dar Blockchain
- **Signature**: Mahdi Souab — Dar Blockchain
- **Email**: souebmahdi@gmail.com
- **Calendly**: https://calendly.com/souebmahdi/new-meeting

### Reference outreach style (from colleague Youssef — LinkedIn, high response rate)
Adapt this tone and structure to French emails. Keep it mission-driven, warm, concise:
```
I'm [Name], [Role] at Dar Blockchain, a leading Web3 hub active internationally.

Our mission goes beyond technology; we're committed to empowering youth with knowledge and skills in blockchain and decentralized technologies, helping them thrive in the digital economy.

Through initiatives like training programs, workshops, and hands-on projects, we aim to build a strong talent pipeline that drives innovation and economic growth.

I'd love to arrange a brief meeting to explore how we can collaborate to create impactful opportunities for young talent.
```

## STEP 0: Load rotation state + read previous day recommendations

This step has TWO independent jobs: (A) decide today's focus deterministically from `rotation_state.json`, and (B) read yesterday's report for qualitative recommendations. Never let (B) drive rotation — that was the v8 bug.

### 0A — Rotation state (SOURCE OF TRUTH FOR COUNTRY x TYPE)

Read `outreach/rotation_state.json`. Expected schema:

```json
{
  "last_country": "Spain",
  "last_type": 4,
  "last_run_date": "2026-04-15",
  "completed_types_in_country": [1, 2, 3, 4],
  "country_order": ["France", "Belgium", "Switzerland", "Luxembourg", "Spain", "Portugal", "Italy", "Germany", "Netherlands", "UK", "Nordics"],
  "type_order": [
    "Associations crypto/tech",
    "Bootcamps & formations intensives",
    "Universités & grandes écoles ingénieurs",
    "Grandes écoles commerce, IAE, IUT"
  ],
  "history": [
    {"date": "2026-04-15", "country": "Spain", "type": 4}
  ]
}
```

**Advance rule (deterministic — never read HTML for this):**

1. If `completed_types_in_country` has fewer than 4 entries AND the last country has not exhausted its types, today's focus is the next type in `type_order` that's missing from `completed_types_in_country`, in the same country.
2. If `completed_types_in_country` already has all 4 types, today's focus is type 1 in the next country in `country_order`, and `completed_types_in_country` resets to `[]`.
3. If the file is missing or malformed, HALT the run and emit a clear error in the recap email: "rotation_state.json missing/corrupt — cannot advance rotation safely." Do not guess.

Record the decision in today's run as `{today_country, today_type}`. Every lead in today's generation MUST match both.

### 0B — Recommendations (qualitative only)

- Open the most recent `outreach/daily_reports/report_*.html` and extract the "Recommandations pour demain" section.
- Apply those qualitative hints (search angles, subject-line tweaks, personalization hooks) to today's work.
- If no report exists, skip 0B silently — it's non-blocking. Rotation already came from 0A.
- Note in today's report what was changed based on yesterday's feedback.

The pipeline must get better every day: sharper targeting, better personalization hooks, higher-quality leads, improved subject lines for better open rates. But rotation direction never depends on this step — only 0A decides.

## STEP 1: Read existing leads to avoid duplicates (HARDENED DEDUP)

**This step is MANDATORY and must run before any new search.** The v8 pipeline repeatedly proposed duplicate contacts because only institution names were checked, and because nightly runs that never pushed their CSVs left the next run blind to them. v9 fixes both.

### 1A — Files to load (ALL of them, not a subset)

- Every CSV in the workspace `leads/` folder
- `outreach/leads_emails_final_20260304.csv`
- `outreach/leads_master.csv`
- `outreach/leads_with_emails.csv`
- **Every** `outreach/gsheet_import_*.csv` file (glob the pattern — do not hand-pick)
- `outreach/EMAILS_DONE.txt`
- `outreach/followup_tracker.csv`

### 1B — Build three dedup sets (in memory)

For each loaded row, extract and normalize:

- `institution_slug` = institution name lowercased, stripped of accents, non-alphanumerics removed (e.g. `"Université de Lorraine"` → `universitedelorraine`)
- `email_norm` = email lowercased, trimmed
- `linkedin_slug` = LinkedIn URL normalized to the `/in/{slug}`, `/school/{slug}`, or `/company/{slug}` form, lowercased, trailing slash stripped

Store three sets: `KNOWN_INSTITUTIONS`, `KNOWN_EMAILS`, `KNOWN_LINKEDINS`.

### 1C — Drop rule (applied before scoring)

A candidate lead is **dropped silently** (not scored, not included) if ANY of:

- its `institution_slug` is in `KNOWN_INSTITUTIONS`
- its `email_norm` is in `KNOWN_EMAILS`
- its `linkedin_slug` is in `KNOWN_LINKEDINS`

Log the drop count in the HTML report section "Dédup Step 1" with: `loaded_rows, KNOWN_INSTITUTIONS size, KNOWN_EMAILS size, KNOWN_LINKEDINS size, candidates_dropped_as_duplicates`.

NEVER propose a lead already present in any of these files, regardless of which field matched.

The institutions already contacted include (non-exhaustive, always check files): Paris 1 Panthéon-Sorbonne, Université d'Avignon, Paris Saclay, ENSIIE, CESI Rouen, KRYPTOSPHERE National, Junior ESSEC, HEC Paris, Sciences Po Paris, ENSAE, EPITA/JECT, CentraleSupélec, Dauphine, ESSEC, ESILV, IAE Lyon, ENSAI, Clermont Auvergne, Cergy, Namur, Rennes 1, Catholique de Lille, Bourgogne, Sorbonne Paris Nord, Strasbourg, INSA Toulouse, Paris-Est Créteil, ISAE-SUPAERO, ESPCI, Ponts ParisTech, CPE Lyon, emlyon, NEOMA, Audencia, Reims, EIGSI, ESIREM, Poitiers, INSA Lyon, ENSTA, Supélec, Bretagne-Sud, Polytechnique Paris, Montpellier, Orléans, INSA Rennes, ESTP, ECE Paris, Télécom SudParis, Nice Sophia-Antipolis, IMT Atlantique, ENIB, Lyon JURISTIS, Grenoble Alpes, ECAM LaSalle, Luxembourg, Liège, Évora, Worms, KEDGE, Télécom SudParis/IMT BS, Blockchain@X Polytechnique, Centrale Marseille, EM Lyon, Paris Blockchain Society, ESCP, IAE FRANCE National, IAE Paris Sorbonne, IAE Paris-Est, IAE Grenoble, IAE Toulouse/TSM, IAE Bordeaux, IAE Dijon, IAE Nantes, EDHEC, SKEMA, TBS Education, IAE Versailles, EM Strasbourg, IAE Lille, Arts et Métiers ENSAM, EFREI Paris, MINES Paris, UTT Troyes, Ensimag Grenoble, ISEP Paris, Paris-Saclay, CNAM, Lyon 1 UCBL, Bordeaux Crypto Master, Lorraine, Paris-Cité, Sciences Po Rennes, Rennes SB, Financia Business School, ESLSCA, ESGI, Epitech, Supinfo, PST&B, Alyra, Polytech Nantes, Polytech Angers, Université de Limoges CRYPTIS, BBS Blockchain Business School, IPSSI, ENSICAEN, Université Toulouse III Paul Sabatier, ENSEIRB-MATMECA (Bordeaux INP), ENSEEIHT (INP Toulouse), Polytech Marseille (AMU), Polytech Grenoble, INSA Centre Val de Loire, Polytech Tours, UTBM (Belfort-Montbéliard), IUT de Montreuil (Paris 8), UTC Compiègne, INSA Rouen Normandie, Polytech Lille, Télécom Nancy, Polytech Nice Sophia, Polytech Orléans, ENSIM Le Mans, Polytech Clermont-Ferrand, ESIEA Paris/Laval, Polytech Annecy-Chambéry, INSA Strasbourg, Télécom Paris, Centrale Lille/IG2I, IUT Amiens, Polytech Nancy, Polytech Lyon, Polytech Montpellier, Blockchain et Société Nantes, UBO Brest, IUT La Rochelle, École 42 Paris, IÉSEG, ISC Paris, INSA Hauts-de-France (UPHF), ENSIBS, ISG Paris, BSB Dijon, ESTIA Bidart, ICN Nancy, Excelia La Rochelle, ACADEE Troyes, HEC Lausanne, EPFL BSA, UCLouvain, Simplon.co, Le Wagon, OpenClassrooms, Réseau Polytech national, Groupe INSA national, ULB Bruxelles, Université de Genève, HETIC, The Progress Factory, IUT Bordeaux Informatique, IAE Saint-Étienne, IAE Caen, IAE Amiens, IAE Valenciennes (UPHF), IUT Lyon 1 Informatique, IUT Robert Schuman Strasbourg, IUT Nantes Informatique, Indigo Blockchain School, HEG Arc Neuchâtel, Université de Fribourg, VUB Bruxelles, Headn Education, Gobelins Paris, IAE Clermont Auvergne, IAE Nice, IAE Poitiers, Blockchain Neuchâtel / NEDAO, UM6P Maroc, ESPRIT Tunisie, Station F Paris, UIR Rabat, ESP Dakar, ENIT Tunis, UNC Nouvelle-Calédonie, Université des Antilles, UPF Polynésie, EEMI Paris, CGE, AUF, France Universités, PEPITE France, ENSI Tunis, INPHB Côte d'Ivoire, Université de Guyane, UVCI Côte d'Ivoire, FUN, Sorbonne Université.

**IMPORTANT**: Update this hardcoded list in each new version of this prompt with ALL institutions found so far.

## STEP 2: Search for NEW leads

Use WebSearch to find NEW European institutions not yet in the dedup list. Run 5-8 varied searches. **Today's searches must focus on the SINGLE country and SINGLE target type assigned by the rotation calendar (see STRUCTURED SEGMENTATION SYSTEM above).** Adapt all search queries to match the focus. If the focus is "Associations crypto/tech x Belgique", ALL searches should target Belgian student crypto/tech associations ONLY. Do not scatter across other countries or target types.

### Search strategies (rotate and vary daily):

**PRIORITY A — Associations étudiantes crypto/tech & bootcamps:**
These convert FASTEST (hours, not weeks). On days where the rotation calendar assigns this segment, ALL leads should come from this category. Search AGGRESSIVELY.
- "association étudiante blockchain crypto [city] france"
- "club blockchain [école/université] france"
- "kryptosphere [city] chapitre" (multi-campus crypto association)
- "junior entreprise technologie blockchain [school]"
- "BDE crypto web3 étudiant [city]"
- "association fintech étudiants [city] france belgique suisse"
- "bootcamp blockchain web3 france formation"
- "bootcamp développeur web3 [city] france"
- "coding bootcamp blockchain Europe"
- "formation intensive blockchain paris lyon marseille"
- "student blockchain club [European university]"
- "web3 student association [European city]"
- "crypto society university [UK/DE/NL city]"
- "blockchain bootcamp [European city] developer"
- **Momentum searches** (networks where we already have contacts):
  - "réseau [association name] chapitres villes france" (find other chapters of known associations)
  - "fédération associations étudiantes tech france"
  - "bootcamp réseau campus france formation"

**PRIORITY B — Francophone European institutions (at least 30% of leads):**
- "formation blockchain université france 2025 2026"
- "master fintech DeFi école ingénieur france"
- "partenariat entreprise université numérique france"
- "école commerce digital finance france certification"
- "IUT informatique blockchain france"
- "responsable pédagogique blockchain [school name] email"
- "directeur relations entreprises [school type] contact"
- "blockchain formation belgique université bruxelles"
- "haute école blockchain suisse genève lausanne"

**PRIORITY C — Non-francophone European institutions (max 30% of leads):**
- "blockchain course university UK Germany Netherlands 2025 2026"
- "fintech master degree Europe university"
- "web3 student club university [European city]"
- "blockchain partnership university [country: UK, DE, NL, ES, PT, IT, AT, SE, DK, NO, FI, PL, CZ, IE]"
- "head of partnerships [university name] email"
- For these leads, ALL outreach content (email + LinkedIn message) MUST be written in ENGLISH.

**Email-finding searches (CRITICAL — run these for every lead without email):**
- "[institution name] contact email partenariat"
- "[person name] [institution] email linkedin"
- "@[domain].fr email direction partenariat"
- "[institution] relations entreprises email responsable"
- "site:[institution-domain] contact email"
- "[institution name] partnerships email contact" (for non-francophone)

**Vary the city each day (European cities):**
- France: Paris, Lyon, Marseille, Toulouse, Bordeaux, Nantes, Lille, Strasbourg, Grenoble, Rennes, Montpellier, Nice, Aix-en-Provence, Rouen, Caen, Dijon, Clermont-Ferrand, Tours, Angers, Metz, Besançon, Pau, La Rochelle, Perpignan, Amiens, Limoges, Valenciennes, Le Mans, Brest
- Belgium: Bruxelles, Louvain-la-Neuve, Liège, Gand, Anvers, Namur, Mons
- Switzerland: Genève, Lausanne, Neuchâtel, Fribourg, Zurich, Berne, Bâle
- Luxembourg: Luxembourg-Ville
- Other European: London, Amsterdam, Berlin, Munich, Dublin, Barcelona, Madrid, Milan, Lisbon, Stockholm, Copenhagen, Vienna, Prague, Warsaw

### LinkedIn URL search strategy (CRITICAL — PERSONAL PROFILE OBLIGATOIRE):

**RÈGLE ABSOLUE : chaque lead DOIT avoir un profil LinkedIn personnel (/in/) vérifié d'une personne appartenant à l'organisme ciblé.** Les pages entreprise (/company/) ou école (/school/) ne comptent PAS. Un lead sans profil LinkedIn personnel vérifié ne peut PAS être inclus dans les livrables — il doit être remplacé par un autre lead.

Cette règle est non négociable : un outreach LinkedIn envoyé à une page entreprise n'atteint personne directement. Seul un profil /in/ permet un message personnalisé efficace.

**Multi-pass search strategy (run ALL of these, not just one):**
1. **Primary search**: `"[First Name] [Last Name]" "[Institution]" site:linkedin.com/in/`
2. **Role-based search**: `"[Role: directeur|responsable|doyen|head]" "[Institution]" site:linkedin.com/in/`
3. **Broader name search**: `"[First Name] [Last Name]" linkedin` (without site: restriction, check results for linkedin.com/in/ URLs)
4. **Institution staff page**: Search for the institution's staff directory page ("équipe" or "team" or "annuaire" + institution name) to find named contacts, then search those names on LinkedIn.
5. **Alternative person**: If the initially identified contact cannot be found on LinkedIn, search for a DIFFERENT person at the same institution (another professor, another department head, another program director) who IS on LinkedIn. Replace the contact with this person.
6. **Chrome LinkedIn direct search (VALIDATION PASS)**: For every lead still marked "Non trouvé" after steps 1-5, AND for every URL found via steps 1-3, use Claude in Chrome to:
   - Navigate to `linkedin.com/search/results/people/?keywords=[Name]%20[Institution]`
   - Read the search results to find the matching profile URL
   - Navigate to the profile page to confirm: correct name, correct institution, correct role
   - This step VALIDATES URLs (confirms they are real and current) and FINDS profiles that web search missed
   - If initial search returns no results, retry with just the person's name (without institution)
   - Priority: always verify Tier 1 and Tier 2 contacts first

**PERFORMANCE OPTIMIZATION (CRITICAL):**
- **Batch WebSearch first**: Run ALL institution searches in PARALLEL using WebSearch (e.g., 8 searches simultaneously for 8 institutions). Search pattern: `[role] [institution] site:linkedin.com/in`. This is 10x faster than sequential Chrome navigation.
- **Chrome only for validation + connection**: Use Chrome ONLY to (a) verify a profile found via WebSearch, and (b) send connection requests. Never use Chrome as the primary discovery tool.
- **Auto-connect workflow**: After verifying a profile via Chrome, send a connection request without note:
  1. Navigate to the profile URL
  2. Click "Se connecter" (or find it under "Plus" menu)
  3. In the popup, click "Envoyer sans note"
  4. Confirm "Invitation envoyee" toast message
  - If the profile shows "+ Suivre" instead of "Se connecter", click "Plus" first to find "Se connecter" in the dropdown.

- SEULS les profils `/in/` (personnels) sont acceptés. Les pages `/company/` ou `/school/` ne sont JAMAIS acceptables comme LinkedIn d'un lead.
- Si aucun profil personnel n'est trouvé après toutes les stratégies de recherche, le lead est EXCLU et remplacé par un autre lead du même pays et type de cible.
- NEVER guess or fabricate a LinkedIn URL. Only use URLs confirmed via search results or Chrome validation.
- Le profil LinkedIn doit appartenir à une personne RÉELLEMENT affiliée à l'organisme ciblé (vérifier dans le titre/poste du profil).

### LinkedIn DÉCISIONNAIRE — recherche obligatoire (CRITICAL):
Pour CHAQUE lead, en plus du contact principal, rechercher systématiquement le profil LinkedIn d'une **personne décisionnaire** au sein de l'entité ciblée. Le décisionnaire est la personne qui a le pouvoir de valider un partenariat académique.

**Profils décisionnaires à cibler (par ordre de priorité) :**
- Directeur / Directrice de l'établissement
- Doyen / Doyenne de faculté
- Vice-Président(e) en charge des partenariats ou des relations entreprises
- Directeur / Directrice des études ou des programmes
- Responsable de département (informatique, finance, numérique)
- Directeur / Directrice des relations internationales
- Responsable formation continue / executive education

**Stratégie de recherche :**
- Search pattern: `"directeur" OR "doyen" OR "vice-président" OR "responsable" "[Institution]" site:linkedin.com/in/`
- Variantes : `"head of" OR "dean" OR "director" "[Institution]" site:linkedin.com/in/`
- Si le contact principal EST déjà un décisionnaire (ex: directeur de département), le même lien peut servir pour les deux colonnes.
- Si aucun décisionnaire n'est trouvé après 2 tentatives de recherche, marquer "Non trouvé" dans la colonne.

**Vérification :** Le lien LinkedIn du décisionnaire suit le MÊME processus de vérification que les autres URLs LinkedIn (voir Step 2B). Méthode privilégiée : validation directe via Claude in Chrome (naviguer sur le profil LinkedIn, confirmer nom + poste + institution). Fallback : vérification via présence dans 2+ résultats de recherche indépendants.

### MINIMUM TARGETS:
- **10 leads minimum avec email valide** (Gmail drafts créés)
- **10 leads minimum SANS email** (LinkedIn-only) : inclure avec LinkedIn URL du contact + message LinkedIn personnalisé prêt à copier-coller
- **LinkedIn URL obligatoire pour TOUS les leads** (avec ou sans email) : toujours chercher et inclure le profil LinkedIn du contact ou de l'institution. Cela permet de re-contacter les leads par un second canal si l'email ne donne rien.
- Search aggressively for emails: try generic addresses (direction@, contact@, admissions@, relations.entreprises@), named contacts from LinkedIn, RocketReach patterns ({first}.{last}@domain, {f}{last}@domain)

## STEP 2B: Verify ALL LinkedIn URLs (MANDATORY)

**THIS STEP IS MANDATORY — NEVER SKIP IT.**

Every LinkedIn URL included in the deliverables MUST be verified as accessible before use. Cela inclut les URLs des contacts principaux ET les URLs des décisionnaires. Broken LinkedIn links are useless and waste Mahdi's time.

### Verification process:
1. For EVERY LinkedIn URL found during lead research, use **WebFetch** to load the URL and confirm it resolves to the correct profile/page.
2. Check that the page content matches the expected institution or contact person (e.g., the page title or description contains the institution name or person's name).
3. If a URL returns a 404, redirect loop, "page not found", or does not match the expected lead:
   - Run a **new WebSearch** specifically for that lead's LinkedIn: `"[Institution/Person]" site:linkedin.com`
   - Try alternate URL patterns:
     - For schools: `linkedin.com/school/[slug]/`
     - For companies: `linkedin.com/company/[slug]/`
     - For people: `linkedin.com/in/[slug]/`
   - If a valid URL is found, replace the broken one.
   - If NO valid URL can be confirmed after 2 search attempts, mark the LinkedIn field as "Non trouvé" instead of including a broken link.

### What counts as a valid LinkedIn URL:
- WebFetch returns HTTP 200 (or a page with content)
- The page title/description contains the institution name OR the contact person's name
- The URL follows the standard LinkedIn format: `https://www.linkedin.com/in/...`, `https://www.linkedin.com/company/...`, or `https://www.linkedin.com/school/...`

### What to do with unverified URLs:
- NEVER include a LinkedIn URL that has not been verified via WebFetch
- NEVER guess LinkedIn slugs (e.g., don't assume linkedin.com/school/iae-caen/ exists just because "IAE Caen" is the institution name)
- If verification is impossible (e.g., LinkedIn blocks the fetch), note it in the report and try an alternate search to confirm the URL exists in at least 2 independent search results

### Logging:
- In the HTML report, add a section "Vérification LinkedIn" listing:
  - Total URLs verified
  - URLs that passed verification
  - URLs replaced after failed verification (old URL → new URL)
  - URLs marked as "Non trouvé"

## STEP 3: Qualify each lead

Score each lead on a 1-10 scale:
- +3 if student association crypto/tech or blockchain club (FASTEST converters: BSA, Kryptosphere)
- +3 if bootcamp or coding school (Le Wagon, Ironhack, etc. — fast decision cycle)
- +2 if engineering school or grande école with tech focus
- +2 if has an existing blockchain/crypto/fintech program or club
- +2 if part of a network where we already have contacts ("momentum" — e.g., another Polytech, another Kryptosphere chapter) — reference existing contacts in the message
- +1 if in Île-de-France or major European tech hub (London, Berlin, Amsterdam, Zurich)
- +1 if has international programs
- +1 if a named contact person was found (not just a page/generic contact)
- +1 if a direct email was found
- +1 if large student body (>2000)
- +1 if prior blockchain engagement (diplomas, MOOCs, events, certifications)
- -1 if the program explicitly positions itself as "blockchain agnostic" (adapt message angle: lead with "formation blockchain" not "certification Hedera")
- -2 if no contact found at all (no email AND no LinkedIn)

Tier assignment:
- Score 8-10 = Tier1 (priority — contact first, most personalization effort)
- Score 6-7 = Tier2 (good prospect)
- Score 4-5 = Tier3 (lower priority, still worth contacting)
- Score <4 = Skip

Only keep leads scoring 4+.

**IMPORTANT: associations and bootcamps naturally score higher. This is intentional — they convert faster.**

## STEP 4: Personalize emails

For each qualified lead, write a personalized outreach email. **The language depends on the lead's country:**

- **Francophone European countries (FR, BE, CH, LU)**: email in **FRENCH** (see French rules below)
- **Non-francophone European countries**: email in **ENGLISH** (see English template below)

### Tone and form rules:
- **"tu" form** for: student club presidents, VP, BDE officers, JE presidents, KS chapter leaders, alumni coordinators in student contexts
- **"vous" form** for: professors, directors, department heads, responsables, DG, administrative contacts, unnamed contacts
- **Warm, concise tone**: focused on empowering youth and creating opportunities
- **Body limit**: 90-120 words maximum (proven sweet spot — Malta email at ~120 words converted, Edinburgh at ~130 words did not)
- **One CTA only with 2-3 day horizon**: "15-20 minutes dans les prochains jours ?" (email) or "Ouvert à en discuter cette semaine ?" (LinkedIn). ALWAYS include a soft time frame to shorten the outreach-to-call interval.
- **ALWAYS include Calendly link** after CTA: https://calendly.com/souebmahdi/new-meeting — on its own line, not buried in a sentence
- **Signature**: Mahdi Souab — Dar Blockchain
- **NO attachment line** — do not mention any attachment or PDF
- **Subject line**: Include the institution name. Keep under 80 characters. Use ":" as separator (NEVER use "—" in subject lines). Optimize for open rate.
- **No promotional language**: no "game-changer", "révolutionnaire", "débloquer", "transformer". No emojis. No em dashes. No bullet points in the email body.
- **No generic filler**: every sentence must reference something specific about the lead
- **Personalization hooks**: reference their specific program name, a recent event they organized, their research focus, their student count, their city, their partner network, etc.
- **Objection neutralizer**: for university decision-makers (doyens, VP, directeurs), include "Le programme est entièrement pris en charge par Dar Blockchain : aucun engagement financier par l'université." This line neutralizes the main academic objection. Proven effective on UNIL/Gallay.
- **Agnostic angle**: if a lead's program positions itself as "blockchain agnostic" or multi-chain, do NOT lead with "certification Hedera". Lead with "formation blockchain, fondamentaux + pratique" and mention Hedera only as the platform used for hands-on exercises.

### Email structure — 4 BLOCS (PROVEN FORMAT, 90-120 words):

**Bloc 1 — Accroche contextuelle** (1-2 phrases):
- Option A (cold email): Reference something SPECIFIC about their work. "Le Centre for DLT de l'University of Malta est l'une des premières institutions européennes à proposer un Master complet en Blockchain."
- Option B (warm/referral): Mention the referral. "Je me permets de vous écrire sur recommandation de Madame Delacrétaz, qui m'a indiqué que vous êtes en charge du volet enseignement." — Referrals convert better than cold. Always use Option B when a referral exists.
- NEVER start with Dar Blockchain's description. Start with THEM.

**Bloc 2 — L'offre en 2 phrases** (social proof + gratuit):
- "Dar Blockchain, hub Web3 partenaire de Hedera (Governing Council : Google, IBM, Deutsche Telekom), propose une certification blockchain gratuite pour les étudiants universitaires. 10 000+ étudiants formés dans le monde, 250+ institutions partenaires."
- Do NOT list modules, tracks, or technical details here. Keep it to 2 sentences max.

**Bloc 3 — Le pont** (1 phrase):
- Connect their context to the offer. "Je pense qu'il y a un fit naturel entre votre cursus MSc et notre programme comme certification pratique complémentaire."
- This is NOT a feature list. It's ONE sentence saying "this is relevant for you specifically".

**Bloc 4 — CTA précis avec urgence douce** (1 phrase + lien):
- Integrate a soft urgency suggesting a call within the next 2-3 days. This shortens the outreach-to-call interval, demonstrates seriousness, and improves conversion.
- Formulations FR (varier, ne pas toujours utiliser la même) :
  - "Auriez-vous 15-20 minutes dans les prochains jours pour un court échange ?"
  - "Seriez-vous disponible cette semaine pour un bref appel de 15 minutes ?"
  - "Un créneau de 15 minutes d'ici jeudi/vendredi [adapter au jour actuel + 2-3 jours] ?"
- Formulations EN :
  - "Would you have 15-20 minutes in the next couple of days for a quick chat?"
  - "Could we find 15 minutes this week for a brief call?"
- Calendly link on its own line: https://calendly.com/souebmahdi/new-meeting
- Sign-off: "Bien cordialement," or "Au plaisir,"
- Signature: Mahdi Souab — Dar Blockchain
- **RÈGLE** : le CTA doit TOUJOURS suggérer un horizon de 2-3 jours. Ne jamais laisser un CTA ouvert sans cadre temporel ("Seriez-vous disponible ?" sans date = trop vague, le lead reporte indéfiniment).

### Example email FRENCH — PROVEN FORMAT (REFERENCE ONLY):
```
Objet : Certification blockchain gratuite : [Institution] x Dar Blockchain

Bonjour Monsieur Gallay,

Je me permets de vous écrire sur recommandation de Madame Delacrétaz, qui m'a indiqué que vous êtes en charge du volet enseignement de la faculté.

Dar Blockchain, hub Web3 partenaire de Hedera et soutenu par des acteurs comme Google Cloud, IBM et Deutsche Telekom, propose un programme de certification blockchain gratuit destiné aux étudiants universitaires.

Le programme est entièrement pris en charge par Dar Blockchain : aucun engagement financier par l'université.

Je serais ravi d'explorer avec vous les modalités d'un partenariat adapté à l'UNIL. Auriez-vous 15-20 minutes dans les prochains jours pour un court échange ?
https://calendly.com/souebmahdi/new-meeting

Bien cordialement,
Mahdi Souab — Dar Blockchain
```
~100 mots. Ce mail a généré une réponse détaillée du vice-doyen d'HEC Lausanne.

### Example email ENGLISH — PROVEN FORMAT (REFERENCE ONLY):
```
Subject: Blockchain Certification for [University] Students

Hi [First Name],

The [specific lab/program/centre] at [University], [specific detail about their work or positioning], is exactly the kind of program we support at Dar Blockchain.

We offer a free, hands-on blockchain certification built on Hedera Hashgraph (Governing Council includes Google, IBM, and others). Over 10,000 students trained across 250+ institutions.

I think there is a natural fit between your [specific curriculum] and our program as a complementary practical certification for your students.

Would you have 15-20 minutes in the next couple of days for a quick chat?
https://calendly.com/souebmahdi/new-meeting

Best regards,
Mahdi — Head of Partnerships, Dar Blockchain
```
~100 mots. Ce format a généré un referral actif de Joshua Ellul (University of Malta).

### Momentum email variant (for networks/federations — PROVEN on Polytech):
When contacting a network/federation where we already have individual contacts, add this to Bloc 1:
"Nous avons déjà contacté [X] [membres/écoles/chapitres] de [network] individuellement pour le Programme Académique Hedera. Un accord-cadre avec [network] permettrait de [benefit]."
This variant generated a phone number from Polytech Group (Marie Ferrandez).

### English email rules:
- Same 4-bloc structure as French
- Short sentences, copywriter energy
- Body limit: 90-120 words (same as French)
- Same CTA: "15-20 minutes for a brief chat?" + Calendly link on its own line
- Same signature: Mahdi — Head of Partnerships, Dar Blockchain
- Same personalization requirement: every sentence must reference something specific about the lead
- No promotional language, no emojis, no bullet points in the email body

## STEP 5: Prepare LinkedIn messages for leads WITHOUT email

**MINIMUM 10 leads LinkedIn-only required.** These are leads where no valid email was found but a LinkedIn contact exists. They go into the CSV and HTML report with a ready-to-paste message.

For every lead where NO valid email was found, prepare:
1. **LinkedIn URL** of the contact person (search for it during lead research)
2. **A short LinkedIn outreach message** following the PROVEN 3-BLOC FORMAT below

### LinkedIn message format — 3 BLOCS, 50-70 MOTS MAX (PROVEN)

**This format is non-negotiable.** All 4 Calendly bookings from LinkedIn followed this exact structure. On mobile LinkedIn (where most people read), this fits in one screen without scrolling.

**Bloc 1 — Accroche personnalisée** (1 phrase): Reference THEIR specific activity. "Votre association BSA et les workshops Solidity à l'EPFL m'ont interpellé." — NOT a description of Dar Blockchain.

**Bloc 2 — Proposition + preuve sociale** (2 phrases max): Certification gratuite + numbers. "On propose la certification Hedera gratuite (Google/IBM au Governing Council) à vos membres. 10 000+ étudiants formés dans le monde, 250+ institutions partenaires."

**Bloc 3 — CTA Calendly avec horizon court** (1 phrase): "Ouvert à en discuter cette semaine ? calendly.com/souebmahdi/new-meeting" — Low pressure but with a soft time frame. One link only. No other URLs. Variantes : "Un créneau d'ici [jour+2-3] ?" / "Open to a quick chat this week?"

### LinkedIn message template — FRENCH (PROVEN, adapt for each):
```
Bonjour [Prénom],

Je suis Mahdi, responsable des partenariats chez Dar Blockchain. [Votre programme/club/activité spécifique] à [institution] m'a interpellé.

On propose une certification blockchain gratuite (Hedera, soutenu par Google/IBM) à vos [étudiants/membres]. 10 000+ déjà formés dans le monde, 250+ institutions partenaires.

Ouvert à en discuter cette semaine ? calendly.com/souebmahdi/new-meeting
```

### LinkedIn message — MOMENTUM VARIANT (for networks/federations, PROVEN on Polytech):
```
Bonjour,

Je suis Mahdi, responsable des partenariats chez Dar Blockchain. Nous avons déjà contacté [X] [écoles/chapitres] de [réseau] individuellement pour le Programme Académique Hedera (certification blockchain gratuite, soutenu par Google/IBM).

Un accord-cadre avec [réseau] permettrait de couvrir les [total] [écoles/chapitres]. 10 000+ étudiants formés dans le monde.

Ouvert à en discuter cette semaine ? calendly.com/souebmahdi/new-meeting
```
This variant generated a phone number from Polytech Group. Use it ONLY when we have existing contacts in the network.

### LinkedIn message template — ENGLISH (for non-francophone European leads):
```
Hi [First Name],

I'm Mahdi, Head of Partnerships at Dar Blockchain. Your [program/club/initiative] at [institution] caught my attention.

We offer a free blockchain certification (Hedera, backed by Google/IBM) for your [students/members]. 10,000+ trained worldwide, 250+ partner institutions.

Open to a quick chat this week? calendly.com/souebmahdi/new-meeting
```

### LinkedIn message RULES (absolute):
- **50-70 words max** — never exceed 70 words. If your message is longer, cut it.
- **3 paragraphs only** — never more.
- **Zero links except Calendly** — no website, no PDF, no video. Each extra link is friction.
- **"Ouvert à en discuter cette semaine ?"** — this CTA with soft urgency, not "Seriez-vous disponible ?" (lower pressure + 2-3 day horizon, proven)
- **First phrase = their activity, not your identity** — the intro "Je suis Mahdi..." comes after the hook about them.
- **No module listing, no track description** — keep the offer to 1 sentence + numbers. The details come in the meeting.
- **Language rule**: French for francophone countries, English for non-francophone European countries.
- **Profil personnel /in/ OBLIGATOIRE** — contacter une page entreprise/école n'atteint personne directement. Si le seul LinkedIn trouvé est une page /company/ ou /school/, le lead est EXCLU et remplacé. Chercher une personne nommée ou passer à un autre organisme.

Include these LinkedIn messages in the HTML report AND in the recap email so Mahdi can copy-paste them directly.

## STEP 6: Spell-check and proofread ALL emails and LinkedIn messages

**THIS STEP IS MANDATORY — NEVER SKIP IT.**

Before creating any Gmail draft, review EVERY email and LinkedIn message for:

### French spelling and grammar errors to check:
- **Accents** : vérifier que TOUS les accents français sont présents et corrects. Erreurs fréquentes : "a" vs "à" (préposition vs verbe), "ou" vs "où", "la" vs "là", "deja" → "déjà", "economie" → "économie", "decentralisee" → "décentralisée", "ecosysteme" → "écosystème", "preparer" → "préparer", "reserver" → "réserver", "creneau" → "créneau", "etudiant" → "étudiant", "universite" → "université", "ingenieur" → "ingénieur", "academique" → "académique", "pedagogique" → "pédagogique", "brievement" → "brièvement", "entierement" → "entièrement", "reunissant" → "réunissant", "interessant" → "intéressant", "au-dela" → "au-delà"
- **Verb conjugations**: ensure correct tense and agreement (e.g., "formés" not "former" when used as past participle)
- **Gender agreement**: adjectives must agree with nouns (e.g., "certification gratuite" not "certification gratuit", "entièrement gratuit" for a masculine noun)
- **Common typos**: double-check words that are often misspelled in French professional emails
- **Punctuation** : proper use of spaces before : ; ! ? in French (thin non-breaking space before double punctuation)
- **Proper nouns**: verify institution names, program names, and contact names are spelled correctly
- **Consistency**: same phrasing for recurring elements (Dar Blockchain description, Hedera program, Governing Council members)
- **Subject lines**: check for spelling errors in subject lines (these are the first thing recipients see)

### Verification process:
1. Re-read each email body word by word — CHECK EVERY ACCENT
2. Re-read each subject line
3. Re-read each LinkedIn message
4. Fix any errors found
5. Log corrections made in the HTML report (section "Corrections orthographiques")

### Common errors to watch for:
- "interessant" → doit être "intéressant"
- "universite" → doit être "université"
- "a l'international" → correct (pas d'accent sur "a" ici = préposition)
- "au-dela" → doit être "au-delà"
- "deja" → doit être "déjà"
- "etudiants" → doit être "étudiants"
- "economie" → doit être "économie"
- "ecosysteme" → doit être "écosystème"
- "decentralisee" → doit être "décentralisée"
- "brievement" → doit être "brièvement"
- "entierement" → doit être "entièrement"
- "reunissant" → doit être "réunissant"
- "preparer" → doit être "préparer"
- "reserver" → doit être "réserver"
- "creneau" → doit être "créneau"
- Ensure "Programme Académique Hedera" is always capitalized consistently WITH accents
- Ensure "Governing Council" is always in English (not translated)

**If ANY word in French is missing an accent, it is a spelling error. Fix it before proceeding.**

### English spelling and grammar errors to check (for non-francophone European leads):
- **Spelling**: verify all words are correctly spelled in British or American English (be consistent)
- **Grammar**: subject-verb agreement, proper tense usage, article usage
- **Proper nouns**: verify institution names, program names, and contact names are spelled correctly
- **Consistency**: same phrasing for recurring elements (Dar Blockchain description, Hedera program, Governing Council members)
- **Tone**: professional but warm, no AI filler, no promotional language

**Only proceed to Step 7 (Gmail drafts) AFTER all emails (French AND English) have been proofread and corrected.**

## STEP 7: Create Gmail drafts

For each lead WITH an email address, use gmail_create_draft:
- to: the lead's email
- subject: the email subject line (WITH correct French accents)
- body: the full email body (plain text, WITH correct French accents)
- contentType: "text/plain"

Log each draft created (draftId, recipient, institution).

## STEP 8: Send RECAP email to self

**THIS STEP IS MANDATORY — NEVER SKIP IT.**

After all drafts are created, send a COMPLETE recap email to Mahdi using gmail_create_draft:
- **to**: souebmahdi@gmail.com
- **subject**: Recap
- **contentType**: text/html
- **body**: Full HTML-formatted recap containing:
  1. Date and summary stats (total leads, by tier, drafts created, LinkedIn leads)
  2. Table of ALL leads with: Institution, Category, City, Score, Tier, Contact, Email, LinkedIn URL, Status
  3. For leads WITH email: subject line used, draft confirmation
  4. For leads WITHOUT email: LinkedIn URL + ready-to-paste LinkedIn message
  5. Recommendations for tomorrow (search angles, improvements, cities to target)
  6. What was improved today based on yesterday's recommendations

## STEP 8B: Pre-call reminder messages (for leads who booked a Calendly call)

**THIS STEP IS MANDATORY — NEVER SKIP IT.**

For every lead who has booked a call via Calendly, prepare a short reminder message to send 2-3 hours before the scheduled meeting. The goal: confirm their availability, reduce no-shows, and show professionalism.

### How to identify upcoming calls:
1. Check Google Calendar (gcal_list_events) for today's events and tomorrow's events that contain "Calendly" or "new-meeting" or "Dar Blockchain" in the title/description.
2. For each upcoming call found, identify the lead's name and institution from the event details.

### Reminder message templates:

**French (for francophone leads):**
```
Bonjour [Prénom],

Un petit message pour confirmer notre échange prévu aujourd'hui à [heure]. Le lien Google Meet est dans l'invitation.

Au plaisir d'échanger avec vous,
Mahdi Souab — Dar Blockchain
```

**English (for non-francophone leads):**
```
Hi [First Name],

Just a quick note to confirm our call today at [time]. The Google Meet link is in the calendar invite.

Looking forward to speaking with you,
Mahdi — Head of Partnerships, Dar Blockchain
```

### Delivery:
- Create a Gmail draft for each reminder (to the lead's email if available, otherwise note in the report that the reminder should be sent via LinkedIn).
- Tag each draft subject as: "Confirmation de notre échange" (FR) or "Confirming our call today" (EN).
- In the HTML report, add a section "Rappels pre-call" listing all reminders prepared, with the lead name, call time, and delivery channel (email/LinkedIn).

### Rules:
- Keep messages under 40 words. No pitch, no program description, no Calendly link. This is purely a confirmation.
- Warm, professional tone. The lead has already booked; the goal is simply to ensure they show up.
- If no calls are scheduled today or tomorrow, skip this step and note "Aucun call prévu" in the report.

## STEP 9: Generate Google Sheet import CSV

**THIS STEP IS MANDATORY — NEVER SKIP IT.**

Instead of editing the Google Sheet directly (browser automation is unreliable), generate a ready-to-paste CSV file that Mahdi will import manually into the shared Google Sheet (onglet Mahdi).

### Google Sheet details (for reference):
- **Sheet ID**: 14p5z4JnlF-A2zvtnQDhdl9pv-hw8b0OtgC6VXpLp6p0
- **URL**: https://docs.google.com/spreadsheets/d/14p5z4JnlF-A2zvtnQDhdl9pv-hw8b0OtgC6VXpLp6p0
- **Tab**: Mahdi (GID: 431616896)

### CSV file to generate:

Create: `outreach/gsheet_import_[TODAY_DATE].csv`

The CSV must have EXACTLY these columns (matching the Google Sheet structure):

```
Lead found date,University,Website,Country,Contact name,Contact role,Link,Décisionnaire,Décisionnaire LinkedIn,E-mail / Whatsapp,Lead Status,Initial email - Date sent,Initial email - Opened,Initial email - Replied,Second email - Date sent,Second email - Opened
```

### Column mapping:
| Column | Header | What to fill |
|--------|--------|-------------|
| A | Lead found date | Today's date (DD/MM/YYYY format) |
| B | University | Institution name |
| C | Website | Institution website URL |
| D | Country | "France" (or other if applicable) |
| E | Contact name | Contact person's full name |
| F | Contact role | Their role/title |
| G | Link | LinkedIn URL or Instagram URL of the contact |
| H | Décisionnaire | Nom complet du décisionnaire identifié (directeur, doyen, VP, responsable de département) |
| I | Décisionnaire LinkedIn | URL LinkedIn vérifiée du décisionnaire. Si le contact principal EST le décisionnaire, dupliquer le lien de la colonne G. Si non trouvé après recherche, marquer "Non trouvé". |
| J | E-mail / Whatsapp | Email address (or WhatsApp number if no email) |
| K | Lead Status | "New" |
| L | Initial email - Date sent | "dd/mm/yyyy" (placeholder — Mahdi fills after sending) |
| M | Initial email - Opened | Leave empty |
| N | Initial email - Replied | Leave empty |
| O | Second email - Date sent | "dd/mm/yyyy" (placeholder) |
| P | Second email - Opened | Leave empty |

### IMPORTANT:
- One row per lead, all leads from today
- Use comma as separator
- Wrap fields containing commas in double quotes
- This file is for Mahdi to open and copy-paste rows into the Google Sheet manually
- Include ALL leads: those with email AND the 10+ LinkedIn-only leads
- Column G (Link) must ALWAYS contain the LinkedIn URL of the contact person. Search for it systematically for every lead. This is critical for re-contacting leads via a second channel.

## STEP 10: Update the local master CSV

Append new leads to the workspace `outreach/leads_master.csv`

If the file doesn't exist, create it with this header:
```
Date,Institution,Category,City,Region,Contact_Name,Contact_Role,Email,LinkedIn,Decisionnaire_Name,Decisionnaire_LinkedIn,Website,Score,Tier,Lead_Status,Email_Subject,Gmail_Draft_ID,LinkedIn_Message,Notes
```

Category values: Association Crypto/Tech (PRIORITY), Bootcamp (PRIORITY), École Ingénieur, Grande École Commerce, Université, IAE, IUT, Communauté, Association Généraliste, Incubateur, Formation Continue, Réseau/Fédération

Lead_Status values: New, Draft created, LinkedIn only, Email needed, Sent, Opened, Replied, In discussion, Call scheduled, Converted

## STEP 11: Generate HTML monitoring report

Create: `outreach/daily_reports/report_[TODAY_DATE].html`

### HOW TO BUILD THE FILE (MANDATORY — avoids stream idle timeouts)

Never write the full HTML in one single `Write` call or one large `bash` heredoc — those block long enough to trigger stream idle timeouts in the cloud harness. Build the file **incrementally in 4-6 small `Bash` appends**, each under ~60 lines:

1. **Pass 1** — `cat > report_[DATE].html << 'EOF'` with: doctype, `<head>`, CSS, header, KPI grid. End with `EOF`.
2. **Pass 2** — `cat >> report_[DATE].html << 'EOF'` with: Focus du jour + Email leads table.
3. **Pass 3** — `cat >> report_[DATE].html << 'EOF'` with: LinkedIn-only leads table.
4. **Pass 4** — `cat >> report_[DATE].html << 'EOF'` with: LinkedIn messages (copy-paste ready).
5. **Pass 5** — `cat >> report_[DATE].html << 'EOF'` with: Vérification LinkedIn + Corrections + Rappels pre-call + Améliorations + Recommandations + footer + `</body></html>`.

After each pass, echo `wc -l` of the file to confirm progress. Each pass must finish in well under 30 seconds. If a pass feels too large, split it further — the harness tolerates many small calls but not one large one.

Apply the same chunked-append pattern to any other large file generation (long CSVs, multi-section reports, etc.) going forward.

### Report content

The HTML report must include:
- Date and summary stats (total new leads, emails drafted, LinkedIn contacts, by tier)
- Table of all new leads with: Institution, Category, City, Score, Tier, Contact, Email/LinkedIn status, Décisionnaire (nom + LinkedIn vérifié)
- Section highlighting Tier1 leads with personalization hooks
- Section "LinkedIn Outreach" with a TABLE listing all 10+ LinkedIn-only leads: Institution, Contact name, LinkedIn URL (clickable), and the ready-to-paste personalized LinkedIn message for each. Mahdi must be able to copy-paste each message directly from the report.
- Section "Vérification LinkedIn" listing: total URLs verified, passed, replaced, marked "Non trouvé" (Step 2B)
- Section "Corrections orthographiques" listing all spelling/grammar fixes made during proofreading (Step 6)
- Section "Améliorations appliquées" noting what changed from yesterday's recommendations
- Section "Recommandations pour demain" with specific, actionable suggestions:
  - Which cities/institution types to target next
  - Which search angles to try
  - How to improve email subject lines for better open rates
  - Patterns observed (what types of leads respond best)
  - Any strategic suggestions (national agreements, network approaches, etc.)
  - **Conversion tracking**: note how many of today's leads are associations/bootcamps (target: 40%+) vs universities
  - **Message length audit**: flag any email over 120 words or LinkedIn message over 70 words
- Section "Focus du jour" : segment ciblé + zone géographique + justification du calendrier de rotation
- Section "Rappels pre-call" : liste des calls prévus dans les 24h avec statut du brouillon de rappel
- Quick stats on cumulative leads
- Clean, professional styling
- Section "Dédup Step 1" : loaded_rows, KNOWN_INSTITUTIONS size, KNOWN_EMAILS size, KNOWN_LINKEDINS size, candidates_dropped_as_duplicates (from Step 1C)
- Section "Rotation state" : last_country, last_type, today_country, today_type, next expected country+type (sourced from `rotation_state.json`, NOT inferred from HTML)

## STEP 11B: Update `rotation_state.json`

After the HTML report is written and before the git commit, update `outreach/rotation_state.json`:

- Append today's `{date, country, type}` to `history`
- Set `last_country = today_country`, `last_type = today_type`, `last_run_date = today`
- If today completed type N, append N to `completed_types_in_country`
- If all 4 types are complete for this country, reset `completed_types_in_country` to `[]` and move on — the next run's Step 0A will pick up the next country

If the file cannot be written, HALT and surface the error in the recap — do NOT proceed to the git commit with stale state.

## STEP 12: Git commit & push (MANDATORY — run is not complete without this)

**This step is non-negotiable. If this step fails, the run is considered failed and the recap email must say so in bold.** This is the step that v8 was missing and that caused GitHub to fall days behind, rotation to loop on one country, and duplicates to re-appear.

### 12A — Stage the day's artifacts

Run from the repo root:

```
git add outreach/daily_reports/report_*.html \
        outreach/gsheet_import_*.csv \
        outreach/leads_master.csv \
        outreach/rotation_state.json \
        outreach/followup_tracker.csv \
        outreach/EMAILS_DONE.txt
```

Only stage files that actually changed — do not `git add .` (avoids pulling in accidental artifacts or secrets).

### 12B — Commit

```
git commit -m "Daily outreach <YYYY-MM-DD>: <today_country> x <today_type> (<n> leads, <k> drafts)"
```

Replace `<...>` with the real values from today's run. If `git commit` reports "nothing to commit", that itself is a failure — the run should have produced at least a new report and an updated `rotation_state.json`. Surface the anomaly in the recap.

### 12C — Push

```
git push -u origin <current_branch>
```

If the push fails due to a network error, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s). If it still fails:

- Do NOT silently continue — the recap email to souebmahdi@gmail.com must include a bold banner: "❌ GIT PUSH FAILED — please push manually: `git push -u origin <branch>`".
- Include the full git error output in the recap so the blocker is obvious.

### 12D — Verify

After push, confirm the latest commit hash matches `origin/<branch>` (`git rev-parse HEAD` vs `git rev-parse origin/<branch>`). Log the commit hash in the recap email so Mahdi can see at a glance which commit today's run corresponds to.

### Why this step is at the END
If committing earlier (e.g. between Step 7 and Step 8), a mid-run crash would leave a half-finished state on GitHub. Committing once at the end means each pushed commit represents a complete, verified day.

### 12E — Local laptop sync (how Mahdi gets the files without pulling manually)

Mahdi runs `scripts/sync_local.sh` on his laptop on a schedule (every 10 minutes; see `scripts/README.md` for one-time setup via cron / launchd / Task Scheduler). That script does a `git fetch` + `git pull --ff-only` on the laptop's clone. So after Step 12C pushes successfully, the laptop picks up the new report, CSV, and rotation_state.json within minutes — with no manual action.

The pipeline does NOT need to do anything special for this: as long as Step 12C pushes to `origin/<branch>`, the laptop's scheduled sync takes it from there. Do not try to SSH into Mahdi's laptop or trigger anything remotely — that's out of scope and would be fragile.

## IMPORTANT RULES

1. NEVER contact the same institution twice. Always check dedup list first.
2. NEVER fabricate contact information. If you can't find an email, mark it "LinkedIn only" and provide the LinkedIn URL + message.
3. NEVER use generic emails. Every email must reference something specific about the lead.
4. NEVER mention any attachment or PDF in the email body.
5. ALWAYS include the Calendly link: https://calendly.com/souebmahdi/new-meeting
6. ALWAYS sign as: Mahdi Souab — Dar Blockchain (not "Dar Blockchain France")
7. ALWAYS present Mahdi as: "responsable des partenariats chez Dar Blockchain"
8. ALWAYS describe Dar Blockchain as: "un hub Web3 influent à l'international" (NEVER mention "EMEA")
9. ALWAYS send the recap email to souebmahdi@gmail.com with subject "Recap" — this is MANDATORY
10. ALWAYS read and apply yesterday's recommendations before starting
11. ALWAYS generate the Google Sheet import CSV (gsheet_import_[DATE].csv) — this is MANDATORY
12. MINIMUM 10 leads with valid email addresses (Gmail drafts created)
13. Quality over quantity. 10 excellent leads beat 20 mediocre ones.
14. Vary search strategy each day. Never run the same searches two days in a row.
15. All emails must sound human. Warm, concise, 90-120 words max. No AI filler. No "mission au-delà de la technologie" boilerplate.
15b. **LEAD MIX TARGET**: chaque génération = UN SEUL pays + UN SEUL type de cible. 100% des leads doivent correspondre au pays et au type de cible assignés. Ne jamais mixer plusieurs pays ou types de cibles dans une même génération.
15c. **EMAIL LENGTH HARD LIMIT**: 90-120 words. If an email exceeds 120 words, cut it. The proven converting emails (Malta, UNIL) were 100-120 words. Emails at 130+ words (Edinburgh, UCL, HSG) have not converted.
15d. **LINKEDIN MESSAGE HARD LIMIT**: 50-70 words, 3 paragraphs. No exceptions.
15e. **SUBJECT LINES**: use ":" as separator, NEVER "—". Example: "Certification blockchain : [Institution] x Dar Blockchain" not "Certification blockchain — [Institution]"
15f. **AGNOSTIC ANGLE**: if a lead program is labeled "multi-chain", "blockchain agnostic", or "protocol-neutral", do NOT lead with "Hedera". Lead with "certification blockchain" and mention Hedera only as the platform for practical exercises.
16. The master CSV is append-only. Never delete existing rows.
17. For leads without email: ALWAYS provide LinkedIn URL + ready-to-paste message.
18. ALWAYS spell-check and proofread ALL emails and messages BEFORE creating Gmail drafts. Zero tolerance for spelling errors or missing accents.
19. ALWAYS search for and include the LinkedIn URL of the contact person for EVERY lead (email leads AND LinkedIn-only leads). This is critical for multi-channel outreach and follow-ups.
20. MINIMUM 10 LinkedIn-only leads (no email found) with personalized LinkedIn message ready to copy-paste. These are in addition to the 10 email leads.
21. **ACCENTS FRANÇAIS OBLIGATOIRES** : tout texte en français DOIT contenir les accents corrects (é, è, ê, à, â, ù, û, ô, î, ç). Un email sans accents est considéré comme défectueux. Cette règle est NON NÉGOCIABLE.
22. **LINKEDIN URL VERIFICATION OBLIGATOIRE** : chaque URL LinkedIn incluse dans les livrables (CSV, rapport HTML, recap email) DOIT être vérifiée via WebFetch avant inclusion. Une URL LinkedIn cassée est pire qu'aucune URL. Si la vérification échoue après 2 tentatives de recherche, marquer "Non trouvé" au lieu d'inclure un lien mort. Voir Step 2B pour le processus complet.
23. **LINKEDIN DÉCISIONNAIRE OBLIGATOIRE** : pour CHAQUE lead, rechercher et inclure le profil LinkedIn d'un décisionnaire (directeur, doyen, VP, responsable de département) de l'entité ciblée. Ce lien doit être vérifié via WebFetch comme tout autre lien LinkedIn. Les colonnes "Décisionnaire" et "Décisionnaire LinkedIn" doivent être remplies dans le CSV Google Sheet ET le master CSV. Si non trouvé après recherche, marquer "Non trouvé".
24. **ZONE GÉOGRAPHIQUE : EUROPE UNIQUEMENT** : ne cibler que des institutions européennes. Priorité aux pays francophones (FR, BE, CH, LU). Les pays européens non-francophones sont acceptés en cible secondaire (max 30% des leads). NE PAS cibler l'Afrique, les DOM-TOM, ou tout autre territoire hors Europe sauf instruction explicite de Mahdi.
25. **URGENCE DOUCE DANS CHAQUE CTA** : chaque email et message LinkedIn doit inclure un horizon temporel de 2-3 jours dans le CTA ("dans les prochains jours", "cette semaine", "d'ici jeudi"). Ne jamais laisser un CTA sans cadre temporel. L'objectif est de raccourcir l'intervalle outreach-call pour mieux convertir et montrer le sérieux de Dar Blockchain.
26. **RAPPELS PRE-CALL OBLIGATOIRES** : pour chaque call Calendly prévu dans les prochaines 24h, créer un brouillon Gmail de confirmation 2-3h avant. Message court (<40 mots), pas de pitch, juste une confirmation chaleureuse.
27. **SEGMENTATION STRUCTURÉE** : UN SEUL pays et UN SEUL type de cible par génération. Tous les leads doivent correspondre au pays ET au type de cible assignés (sauf leads opportunistes score 9+, tagués "hors-focus"). Ne jamais mixer plusieurs pays. Indiquer le focus du jour dans le rapport.
28. **LANGUE ADAPTÉE AU PAYS** : tous les contenus (emails, subject lines, messages LinkedIn) doivent être en français pour les pays francophones européens et en anglais pour les pays européens non-francophones. Ne jamais envoyer un email en français à une institution non-francophone.
29. **LINKEDIN PERSONNEL OBLIGATOIRE (20/20)** : chaque lead DOIT avoir un profil LinkedIn personnel (/in/) vérifié d'une personne appartenant à l'organisme. Les pages /company/ et /school/ ne comptent PAS. Un lead sans profil /in/ vérifié est EXCLU et remplacé par un autre lead. Utiliser les 6 stratégies de recherche multi-pass. Si aucune personne n'est trouvable sur LinkedIn pour un organisme donné, ne pas inclure cet organisme et chercher un autre lead à la place.
30. **ROTATION STATE IS THE SOURCE OF TRUTH (v9)** : today's country and type come from `outreach/rotation_state.json` via Step 0A, NEVER from parsing yesterday's HTML. If the file is missing or corrupt, HALT the run with a clear error. Update the file in Step 11B before committing.
31. **HARDENED DEDUP (v9)** : Step 1 MUST load every `leads_master.csv`, every `gsheet_import_*.csv`, and `EMAILS_DONE.txt` and build three sets (institution_slug, email, linkedin_slug). Drop any candidate matching any set before scoring. Log counts in the HTML report.
32. **GIT COMMIT + PUSH IS MANDATORY** : the run is not complete until Step 12 pushes successfully to `origin/<branch>`. If the push fails after 4 retries, the recap email MUST include a bold "GIT PUSH FAILED" banner with the git error output. Never silently continue.
33. **PRE-FLIGHT PULL IS MANDATORY** : Step -1 runs `git pull --ff-only` before anything else. If the pull fails, HALT the run and email souebmahdi@gmail.com with subject "PIPELINE HALTED — git pull failed". Never skip this step, even for "just a quick run".
34. **ONE AND ONLY ONE SKILL FILE** : the authoritative skill is `outreach/SKILL.md` (this file). Files under `outreach/versions/` (SKILL_v2.md … SKILL_v9.md, SKILL_recap_v2.md) are archives — NEVER load them, NEVER edit them, NEVER merge rules from them. If you spot a bug or want a new rule, edit THIS file only. If a routine somehow loads an archived version, fix the routine config — do not modify the archive.
