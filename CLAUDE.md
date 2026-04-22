# Repository guide for Claude / automated routines

## The only skill file is `outreach/SKILL.md`

- **Load only `outreach/SKILL.md`**. That is the authoritative, up-to-date daily outreach pipeline. All rules, all steps, all improvements live there.
- **Never load anything under `outreach/versions/`**. Files in that folder (`SKILL_v2.md` through `SKILL_v9.md`, `SKILL_recap_v2.md`) are frozen archives kept only for historical reference. They are out of date by design.
- **Never edit archived versions**. If you want to change a rule, edit `outreach/SKILL.md`. If a rule fix seems to belong in multiple places, it belongs in `outreach/SKILL.md` — the archive stays untouched.

## One-off campaigns (not the daily pipeline)

- `outreach/EUROPE_300_ONESHOT.md` is a **one-night** campaign routine (300 emails across under-targeted European countries). It is **only** loaded when Mahdi explicitly triggers that campaign. It must never be loaded by the daily routine.
- The daily routine (`outreach/SKILL.md`) must ignore any files produced by one-offs: `outreach/europe_oneshot_*.md` and `outreach/europe_oneshot_*.csv`. These files do not feed the daily dedup or rotation state.
- One-offs must never write to `rotation_state.json`, `leads_master.csv`, `daily_reports/`, `gsheet_import_*.csv`, `EMAILS_DONE.txt`, or `followup_tracker.csv`. Tomorrow's daily run must start as if the one-off never happened.

## Before starting any run

1. `git pull --ff-only origin <current branch>` — this is Step -1 in `SKILL.md`. If it fails, HALT and email souebmahdi@gmail.com.
2. Read `outreach/SKILL.md` from disk (do not use a cached copy).
3. Read `outreach/rotation_state.json` — this is the sole source of truth for today's country × type. Do not infer rotation from HTML reports.

## After finishing a run

1. Update `outreach/rotation_state.json` (Step 11B).
2. `git add` only the day's artifacts (report, CSVs, rotation_state.json, trackers).
3. Commit with the standard message format, then `git push`. If push fails after 4 retries, the recap email must flag it.

## Local laptop sync

Mahdi's laptop pulls automatically via `scripts/sync_local.sh` (scheduled every 10 minutes by launchd / cron / Task Scheduler). As long as routines push to GitHub, the laptop gets the files. See `scripts/README.md` for one-time setup.

## Directory map

```
outreach/
  SKILL.md                         ← THE skill (load this and only this)
  rotation_state.json              ← rotation source of truth
  leads_master.csv                 ← cumulative lead database
  EMAILS_DONE.txt                  ← dedup input
  followup_tracker.csv             ← follow-up state
  daily_reports/                   ← HTML reports, one per run
  gsheet_import_*.csv              ← one per run, for Google Sheet import
  versions/                        ← ARCHIVE — do not load or edit
  EUROPE_300_ONESHOT.md            ← one-off campaign (load ONLY when Mahdi triggers it)
  europe_oneshot_*.md / .csv       ← artifacts of the one-off (ignored by daily routine)
leads/                             ← seed data (S1A/S1B/S1C/S1DE)
scripts/
  sync_local.sh                    ← laptop pull script
  README.md                        ← setup instructions for laptop sync
```
