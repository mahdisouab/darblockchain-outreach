# Dar Blockchain Daily Outreach Automation

## What this system does

Every day at 9:00 AM, the scheduled task:

1. **Searches** for 10-20 new French university, school, bootcamp, community, or association leads
2. **Qualifies** each lead with a score (1-10) and tier (Tier1/Tier2/Tier3)
3. **Checks** against existing leads to avoid duplicates
4. **Personalizes** an email for each new qualified lead (following Dar Blockchain's proven style)
5. **Creates Gmail drafts** ready to review and send
6. **Updates** the master CSV with new leads
7. **Generates** an HTML monitoring report

## Files

- `leads_master.csv` - Cumulative lead database (updated daily)
- `daily_reports/report_YYYY-MM-DD.html` - Daily HTML monitoring dashboard
- `gmail_drafts_log.csv` - Log of all Gmail drafts created

## How to use

- Check Gmail drafts each morning after 9 AM
- Review and send the ones you approve
- The HTML report gives you a snapshot of pipeline health
- The master CSV is the single source of truth for all leads

## Pipeline skill — ONE FILE ONLY

The authoritative skill is **`outreach/SKILL.md`**. That is the only file any routine should ever load.

All previous versions (`SKILL_v2.md` through `SKILL_v9.md` and `SKILL_recap_v2.md`) have been moved to **`outreach/versions/`** as a frozen archive. Do NOT load, read, or edit anything under `outreach/versions/`. If you want to change a rule, edit `outreach/SKILL.md` directly.

See `CLAUDE.md` at the repo root for the full guide.

### Core safeguards in the skill

1. **Step -1 Pre-Flight** — every run starts with `git pull --ff-only`. No run uses stale state.
2. **Rotation state** — `outreach/rotation_state.json` is the single source of truth for today's country × type. Rotation is never inferred from HTML.
3. **Hardened dedup** — Step 1 loads every `leads_master.csv`, every `gsheet_import_*.csv`, and `EMAILS_DONE.txt`, and matches on institution, email, AND LinkedIn slug.
4. **Mandatory git commit + push** — Step 12 stages the day's artifacts, commits, and pushes. If the push fails, the recap email flags it in bold.

## Laptop sync

Your laptop pulls automatically via `scripts/sync_local.sh`, scheduled every 10 minutes. After a routine pushes, the laptop picks up the new report within minutes with no manual action. See `scripts/README.md` for one-time setup on macOS / Linux / Windows.
