# Dar Blockchain Outreach — 4x Daily Routines Setup

Create these 4 routines in Claude Code (web UI → Routines → New Routine).

## Routine 1 — Daily Outreach — 03h00 (Batch 1)

**Schedule:** Every day at 03:00
**Name:** `Daily Outreach — 03h00 (Batch 1)`
**Prompt:** (paste below)

```
Run the Dar Blockchain Daily Outreach Pipeline autonomously.

CRITICAL RULE (v8.1): Each generation focuses on ONE SINGLE COUNTRY and ONE SINGLE TARGET TYPE. Never mix countries. Never mix target types. Read the previous report to determine which country/target was last covered, then move to the next target type in the same country (or next country if all 4 types are done).

CLOUD MODE ADAPTATION: This routine runs in the cloud without browser access. For LinkedIn URL verification, use WebSearch and WebFetch only (no Chrome). Mark unverifiable URLs as "Non verifie (cloud)" in the report.

Read the full pipeline instructions from: outreach/SKILL_v8.md

Then execute ALL steps in order:
0. Read previous day's report and recommendations
1. Read existing leads for dedup (leads/ folder + outreach/leads_master.csv)
2. Search for 20 NEW leads (ONE country, ONE target type only)
2B. Verify ALL LinkedIn URLs via WebSearch/WebFetch (no Chrome available)
3. Qualify and score each lead
4. Write personalized emails (10 with email)
5. Write LinkedIn messages (10 without email)
6. Spell-check everything (accents obligatoires)
7. Create Gmail drafts (use create_draft)
8. Send recap email to souebmahdi@gmail.com (subject: "Recap", HTML format) - MANDATORY
8B. Create pre-call reminder drafts if any Calendly calls in next 24h
9. Generate gsheet_import CSV and commit to repo
10. Update leads_master.csv and commit to repo
11. Generate HTML monitoring report and commit to repo
12. Git push all changes to main branch

The user is not present. Do NOT ask questions. Execute the full pipeline.
```

---

## Routine 2 — Daily Outreach — 05h00 (Batch 2)

**Schedule:** Every day at 05:00
**Name:** `Daily Outreach — 05h00 (Batch 2)`
**Prompt:** Same prompt as Batch 1 (paste the same block above).

The pipeline reads the previous report via Step 0, so Batch 2 will automatically pick up where Batch 1 left off (next target type in the rotation).

---

## Routine 3 — Daily Outreach — 07h00 (Batch 3)

**Schedule:** Every day at 07:00
**Name:** `Daily Outreach — 07h00 (Batch 3)`
**Prompt:** Same prompt as Batch 1.

---

## Routine 4 — Daily Outreach — 09h00 (Batch 4)

**Schedule:** Every day at 09:00
**Name:** `Daily Outreach — 09h00 (Batch 4)`
**Prompt:** Same prompt as Batch 1.

---

## Expected Rotation (4 batches per day)

With 4 runs per day, a country cycle (4 target types) completes in a single day:

| Day | Batch | Time | Example (Portugal cycle) |
|-----|-------|------|--------------------------|
| Day N | 1 | 03h00 | Portugal × Associations Crypto/Tech |
| Day N | 2 | 05h00 | Portugal × Bootcamps |
| Day N | 3 | 07h00 | Portugal × Universities |
| Day N | 4 | 09h00 | Portugal × Business Schools |
| Day N+1 | 1 | 03h00 | Next country × Associations Crypto/Tech |
| ... | ... | ... | ... |

Each batch:
- Reads the previous report (Step 0) to know the last country/type covered
- Moves to the next target type in the rotation
- Never duplicates leads (dedup via `leads_master.csv`)

---

## Setup Steps (in Claude Code web UI)

1. Go to https://claude.ai/code → Routines (or click the clock icon in the sidebar)
2. Click "New Routine"
3. Name: `Daily Outreach — 03h00 (Batch 1)`
4. Paste the prompt above
5. Schedule: Daily at 03:00 (timezone: Europe/Paris or your local TZ)
6. Repository: `mahdisouab/darblockchain-outreach`
7. Save
8. Repeat steps 2-7 for 05h00, 07h00, 09h00 (rename accordingly)

Tip: You can also duplicate an existing routine if Claude Code's UI supports it — then just change the name and time.

---

## Notes

- **Timezone:** Set all 4 routines to the same timezone (recommended: Europe/Paris)
- **Weekends:** The pipeline auto-skips weekends (Saturday/Sunday)
- **Rate limiting:** With 2-hour gaps between batches, there's no risk of collision or rate limiting
- **Gmail API:** Each batch creates ~10 drafts (40 drafts/day total). Well within Gmail quotas.
- **Git conflicts:** Each batch commits to the same branch. With 2-hour gaps, there's no risk of conflicts.
