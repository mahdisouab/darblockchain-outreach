# Dar Blockchain — Europe 300 one-shot — summary (2026-04-22)

## Outcome

- **300 / 300 emails produced** in `outreach/europe_oneshot_2026-04-22_300emails.md`.
- **15 countries** covered, all chosen for low or zero prior coverage in the daily pipeline.
- **Language:** English across the full run (B2B academic, international English).
- Numbering `#1` → `#300`, no gaps, no duplicate prospects, no duplicate subjects verbatim.

## Country allocation (final)

| Country | Emails | Range |
|---|---|---|
| Poland | 40 | #1–#40 |
| Czechia | 30 | #41–#70 |
| Estonia | 30 | #71–#100 |
| Romania | 30 | #101–#130 |
| Hungary | 25 | #131–#155 |
| Lithuania | 20 | #156–#175 |
| Finland | 20 | #176–#195 |
| Slovakia | 15 | #196–#210 |
| Bulgaria | 15 | #211–#225 |
| Latvia | 15 | #226–#240 |
| Ireland | 15 | #241–#255 |
| Greece | 15 | #256–#270 |
| Slovenia | 10 | #271–#280 |
| Croatia | 10 | #281–#290 |
| Austria | 10 | #291–#300 |
| **Total** | **300** | |

## Prioritization rationale

Country selection was driven by a country-level dedup against `outreach/gsheet_import_*.csv` and `outreach/rotation_state.json` (both read-only). Countries chosen were either:
- **zero prospects to date** in prior runs (CEE: Czechia, Romania, Hungary, Slovakia, Bulgaria, Slovenia, Croatia, Austria, Greece; Baltics: Estonia, Lithuania, Latvia; Poland had 1 prospect); or
- **near-zero and strategically under-targeted** Nordics / small markets (Finland with only 2 prior prospects; Ireland with 3).

Higher weights went to Poland, Czechia, Estonia and Romania based on market size, ecosystem depth and zero prior academic coverage.

## Targeting mix

Each country's 10–40 emails cover a balanced mix across the segment families used in the daily routine:
- Universities and technical universities (CS, informatics, distributed systems, cryptography, finance, economics, business administration, mathematics and statistics).
- Business schools, grandes écoles equivalents, specialized finance/fintech programmes.
- Bootcamps and intensive training providers (Kodilla, Coders Lab, Infoshare Academy, Czechitas, Engeto, SoftUni, Telerik Academy, Green Fox, Codecool, CodeAcademy, Code Institute, kood/Jõhvi, Proekspert Academy, Algebra, SDA, BaltiCCode, ITSchool, etc.).
- Research centres (NASK, ICS CAS, Kempelen Institute, ADAPT, TU Graz Blockchain Lab, blockchain research groups at UPB, AGH, BME, MFF UK, TalTech, KTU, UH, AUTh, etc.).
- Innovation hubs, accelerators, coworking / community spaces (Spherik, ClujHUB, Dogpatch Labs, Kiuas, ABC Accelerator, HUB385, Orange Grove, found.ation, Sofia Tech Park, Design Terminal, Startup Campus, Startup Lithuania, Startup Croatia, Startup Estonia, Tehnopol, Tartu Science Park, The Spot, Blockchain Centre Vilnius, Blockchain Hub Vienna, Blockchain Ireland, etc.).
- Student clubs, student unions, junior enterprises and blockchain student associations.
- Executive education / lifelong learning units.
- Career services teams.
- Educational cross-country programmes (JA Romania, JA Slovensko).

Roles include Head of Department, Dean, Vice-Rector, Programme Director, Director of International Relations, Director of Executive Education, Director of Career Services, Head of Research Group / Lab, President of a student association or junior enterprise, Accelerator / Incubator Director, Head of Lifelong Learning.

## Structure applied (per email)

- Subject line, 8–10 words, ≤ 80 chars, `:` as separator, no em dash.
- 5-line body:
  - Line 1: hook tied to the prospect's role, organization type and country context.
  - Line 2: who we are + value (Dar Blockchain = Web3 hub on Hedera; Governing Council mentions Google, IBM, Deutsche Telekom; 10,000+ students trained; 250+ partner institutions).
  - Line 3: pivot linking their context to our offer (workshop / guest lecture / joint programme / hackathon / certification / executive module).
  - Line 4: CTA ("15 to 20 minutes in the next couple of days"), with Calendly URL `https://calendly.com/souebmahdi/new-meeting` inline.
  - Line 5: GDPR-compliant opt-out sentence (identical across the 300).
- Greeting (`Hi [First Name],`) and sign-off (`Best regards, / Mahdi Souab — Dar Blockchain / Calendly URL`) live in the file header and are not counted in the 5-line body budget.

## Compliance notes (GDPR / ePrivacy)

- Every email includes clear identification of sender (`Head of Partnerships at Dar Blockchain`, with signature `Mahdi Souab — Dar Blockchain`) in line with B2B legitimate-interest cold outreach norms.
- Every email includes an explicit opt-out sentence as Line 5: `If you prefer not to receive any further emails on this topic, just reply 'unsubscribe' and I will remove you from my list.`
- No misleading subject lines, no fake urgency, no emojis, no em dashes in subject lines.

## Automated QA results

| Check | Result |
|---|---|
| Email blocks present | 300 |
| Numbering continuous 1–300, no gaps, no duplicate numbers | PASS |
| Country allocation matches plan | PASS (40/30/30/30/25/20/20/15/15/15/15/15/10/10/10) |
| Subjects ≤ 80 characters | PASS (one outlier at 84 chars for `#266` was shortened during QA) |
| Subjects use `:` (not em/en dash) | PASS |
| Em dashes in body content | PASS (none; em dash only in file header sign-off template) |
| Opt-out sentence present in every body | PASS (300/300) |
| Calendly URL present in every body | PASS (300 body occurrences + 2 in header) |
| Exact duplicate subject lines | PASS (none) |

## Anomalies

- **`#266`** subject was initially 84 chars (`Applied DLT module for your NTUA communications and information engineering students`). Shortened during QA to `Applied DLT module for NTUA information engineering students` (60 chars). No other subject exceeds 80 chars.
- **No other anomalies detected.**

## Isolation from the daily pipeline (confirmed)

This one-off run did not read or modify any of the following:
- `outreach/rotation_state.json` (only read-only dedup inspection of `country_order` / `history`).
- `outreach/leads_master.csv`.
- `outreach/EMAILS_DONE.txt`.
- `outreach/followup_tracker.csv`.
- Any file under `outreach/daily_reports/`.
- Any `outreach/gsheet_import_*.csv` (read-only count of rows per country for prioritization).

No Gmail drafts were created. All prospects are invented templates for Mahdi to map onto real people when he goes to send. No email addresses, phone numbers, or LinkedIn URLs were fabricated.

## Files produced

- `outreach/europe_oneshot_2026-04-22_300emails.md` — the 300-email deliverable.
- `outreach/europe_oneshot_2026-04-22_summary.md` — this summary.
- `outreach/EUROPE_300_ONESHOT.md` is **not** part of this run's output (it already exists on another branch and is not loaded into the current branch).

## Next steps for Mahdi

1. Open `outreach/europe_oneshot_2026-04-22_300emails.md`.
2. Prepend `Hi [First Name],` and append the sign-off block when pasting each email.
3. Before sending, replace each invented prospect with a real person at the same (or similar) role/organization. Populate real email addresses only at that step.
4. Tomorrow's daily run resumes from `rotation_state.json` exactly where Step 0A in `outreach/SKILL.md` left it (Italy × Bootcamps, Type 2/4).
