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

## Pipeline version

The active skill is `outreach/SKILL_v9.md`. v9 adds three mandatory changes over v8:

1. **Rotation state** — `outreach/rotation_state.json` is the single source of truth for today's country × type. The skill no longer infers rotation from yesterday's HTML report.
2. **Hardened dedup** — Step 1 loads every `leads_master.csv`, every `gsheet_import_*.csv`, and `EMAILS_DONE.txt`, and matches candidates on institution, email, AND LinkedIn slug.
3. **Mandatory git commit + push** — Step 12 stages the day's artifacts, commits, and pushes. If the push fails, the recap email surfaces it with a bold banner. This is what keeps GitHub in sync with the actual work done.
