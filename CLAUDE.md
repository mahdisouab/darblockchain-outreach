# Repository guide for Claude / automated routines

## The only skill file is `outreach/SKILL.md`

- **Load only `outreach/SKILL.md`**. That is the authoritative, up-to-date daily outreach pipeline. All rules, all steps, all improvements live there.
- **Never load anything under `outreach/versions/`**. Files in that folder (`SKILL_v2.md` through `SKILL_v9.md`, `SKILL_recap_v2.md`) are frozen archives kept only for historical reference. They are out of date by design.
- **Never edit archived versions**. If you want to change a rule, edit `outreach/SKILL.md`. If a rule fix seems to belong in multiple places, it belongs in `outreach/SKILL.md` — the archive stays untouched.

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
leads/                             ← seed data (S1A/S1B/S1C/S1DE)
scripts/
  sync_local.sh                    ← laptop pull script
  README.md                        ← setup instructions for laptop sync
editing-os-starter/                ← Editing OS: separate video-editing workspace (see below)
```

## Editing OS (`editing-os-starter/`) — separate workspace, not part of outreach

`editing-os-starter/` is the Editing OS starter (AI agents that edit talking-head videos,
built on HyperFrames). It is self-contained: its own `CLAUDE.md`, its own skills under
`editing-os-starter/.claude/skills/`, its own `package.json`. Start with
`editing-os-starter/LISEZMOI.md`.

- **Outreach routines never read, write, or commit anything under `editing-os-starter/`.**
- Work on videos from inside that folder (`cd editing-os-starter`), so its `CLAUDE.md`
  and skills apply and the HyperFrames CLI resolves paths correctly.
- Setup: `npm install`, then `npx hyperframes doctor` (needs Node 20+, FFmpeg, Chrome,
  whisper-cpp on the machine), then `npm run os` for the dashboard on :4200. On Windows:
  `winget` for Node/FFmpeg/Chrome/Python, whisper.cpp prebuilt zip, and the launcher
  `editing-os-starter/editing-os/Editing OS.bat`; steps in `editing-os-starter/LISEZMOI.md` § 2 bis.
- `node_modules/`, `models/`, renders and raw media are gitignored there; the SFX bank
  (`asset-library/sfx/*.wav`) and the shipped style preview posters are tracked on purpose.
