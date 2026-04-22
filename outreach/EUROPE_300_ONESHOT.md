---
name: dar-blockchain-europe-300-oneshot
description: ONE-OFF, single-night high-intensity Europe campaign. NOT the daily pipeline. Generates 300 ready-to-send cold emails targeting under-reached European countries (CEE, Baltics, small markets). Strongly inspired by outreach/SKILL.md (brand voice, tone, 4-bloc structure) but adapted to: invented realistic prospects, 5-line compact body, subject 8-10 words, GDPR-compliant opt-out line, stop-and-resume batching until 300 emails are produced. Does NOT touch rotation_state.json, leads_master.csv, daily_reports/, gsheet_import_*.csv, EMAILS_DONE.txt, or followup_tracker.csv.
---

# Dar Blockchain — Europe 300-Emails One-Shot Campaign (ONE-OFF)

> **READ THIS FIRST:** this file is **not** the daily pipeline. It is a single-night campaign that runs **once**, then is done. It must **never** update `rotation_state.json`, **never** append to `leads_master.csv`, **never** write under `daily_reports/`, **never** create `gsheet_import_*.csv`, **never** create Gmail drafts, and **never** touch `EMAILS_DONE.txt` or `followup_tracker.csv`. The daily pipeline in `outreach/SKILL.md` stays the canonical routine; tomorrow's daily run must be able to resume as if this one-off never happened.

## Mission

Produce **300 ready-to-send cold emails in a single artifact** targeting prospects in European countries that we have NOT covered enough in previous campaigns. The deliverable is one Markdown file with 300 numbered emails, formatted for easy paste into Gmail / Outlook drafts or into a CSV.

Brand, tone, offer, and personalization logic come directly from `outreach/SKILL.md` — this campaign is a variant of our master template, not a different brand. 80–90% of the logic and style stays aligned with the daily routine. Only what is required by geography, language, and the one-off format is changed.

## STEP -1 — PRE-FLIGHT (same as daily)

Before doing anything:
1. Identify the current git branch: `git rev-parse --abbrev-ref HEAD`.
2. `git fetch origin && git pull --ff-only origin <branch>`.
3. If the pull fails, HALT and email `souebmahdi@gmail.com` with subject `PIPELINE HALTED — git pull failed (Europe 300 one-shot)`.
4. Re-read this file and `outreach/SKILL.md` from disk after the pull.

This step exists for the same reason as in the daily routine: two routines must never diverge on stale state.

## STEP 0 — ISOLATION FROM THE DAILY PIPELINE

This one-off must be fully isolated from the canonical daily pipeline:

- **DO NOT** read `outreach/rotation_state.json` to decide today's focus (we override it: "all of Europe, under-targeted"). **DO NOT write it.**
- **DO NOT** append to `outreach/leads_master.csv`.
- **DO NOT** create any file under `outreach/daily_reports/`.
- **DO NOT** create any `outreach/gsheet_import_*.csv`.
- **DO NOT** touch `outreach/EMAILS_DONE.txt` or `outreach/followup_tracker.csv`.
- **DO NOT** create Gmail drafts. The prospects are invented (see Step 3) — they are not real people, and we must not send anything.

The only files this routine may write are:
- `outreach/europe_oneshot_<YYYY-MM-DD>_300emails.md` — the 300-email deliverable (the main artifact).
- `outreach/europe_oneshot_<YYYY-MM-DD>_summary.md` — a short run summary (counts per country, notes).
- Optional: `outreach/europe_oneshot_<YYYY-MM-DD>_gsheet.csv` — same 300 rows in CSV form, ONLY if Mahdi explicitly asks for it.

## STEP 1 — DEDUP CHECK (LIGHT, COUNTRY-LEVEL ONLY)

We are **not** deduping against individual contacts (prospects in this routine are invented), but we do want to avoid re-hitting countries we've already worked hard. Read `outreach/rotation_state.json` read-only to pull `country_order` and `history`. Anything in `country_order` is a country we already run through the daily rotation — those get DOWN-weighted, not excluded.

Optional but recommended: glob `outreach/gsheet_import_*.csv` and count per-country rows already produced. Countries with the fewest rows (or zero) are the priority targets.

Do NOT read individual leads; we are not trying to match on institution or person. Under-targeted = measured at the country level.

## STEP 2 — PROPOSE 10-15 PRIORITY COUNTRIES, THEN WAIT

Before drafting a single email, propose a short list of **10–15 priority European countries** with one line of justification each, then STOP and wait for Mahdi's confirmation. Do not draft any email until he replies with "OK, use this list" or an edited version.

Suggested starting pool (non-exhaustive, to be refined against dedup data):

- **Central & Eastern Europe:** Poland, Czechia, Slovakia, Hungary, Romania, Bulgaria, Slovenia, Croatia, Serbia.
- **Baltics & under-reached Nordics:** Estonia, Latvia, Lithuania, Finland, Iceland.
- **Small markets often ignored:** Malta, Cyprus, Luxembourg (if already touched, skip), Liechtenstein, Andorra, Monaco.
- **Also consider:** Austria, Ireland, Greece (often under-touched in practice).

Justification template (1 line): `Country — reason (why under-targeted / why strategic right now)`. Example: `Estonia — top e-gov & crypto-friendly ecosystem, zero prospects in our dedup data.`

Once Mahdi confirms the list, allocate roughly the 300 emails across countries, favoring countries with the deepest under-targeting. Write the allocation plan at the top of the deliverable file so Mahdi can see it at a glance.

## STEP 3 — TARGETING & PROSPECT INVENTION

Targets are **academic / B2B decision-makers** — same segment families as the daily routine:

- Universities (professors, deans, VP international, heads of department — especially CS, finance, law & tech)
- Grandes écoles, business schools, technical universities, polytechnics
- Junior entreprises, blockchain / crypto student clubs, student tech associations
- Bootcamps & intensive training providers
- Training / executive education departments
- Research centres / labs with DLT or fintech focus
- Incubators, accelerators with a student or academic angle

For each email you MUST invent a **realistic** prospect (name, role, organization, country, city where relevant). The name should be plausibly local to the country (e.g. Polish first/last names for Poland prospects). The organization should be a real-looking name in the style of that country's educational system (e.g. "Warsaw University of Technology", "Charles University", "Tallinn University of Technology") — these are templates Mahdi will later map onto real prospects he finds. Do **not** fabricate phone numbers, email addresses, or LinkedIn URLs; the "Prospect" line shows only name, role, organization, country.

**Language:** English by default, even for countries with their own languages, because this is B2B academic outreach. Use the local language **only** when Mahdi explicitly asks for it for a given country or batch. When writing in English, use clean international English — no regional slang, no idioms.

**No fabricated contact info.** The invented prospect is a template for Mahdi to replace with a real person when he sends. Never invent an email address, phone, or LinkedIn URL inside the body.

## STEP 4 — LEGAL & COMPLIANCE FRAMING (GDPR / ePrivacy)

Respect European B2B cold-email best practices:

- Assume a **legitimate interest** basis: each email must be clearly relevant to the recipient's role and organization. No spray.
- Include in every email, without exception:
  - **Clear identification**: who is writing (Mahdi Souab, Head of Partnerships, Dar Blockchain) and why.
  - **Explicit opt-out**: a single short sentence at the end of the body: `If you prefer not to receive any further emails on this topic, just reply 'unsubscribe' and I'll remove you from my list.` — in English, or localized if the email itself is localized.
- No aggressive sales language, no spammy formatting, no misleading subject lines, no fake urgency, no emojis, no em dashes in subject lines.
- Do NOT lecture the recipient about law. The compliance is implicit in the copy.

## STEP 5 — EMAIL STRUCTURE & STYLE (COMPRESSED 4-BLOC → 5-LINE BODY)

Strong alignment with `outreach/SKILL.md`. This routine compresses the proven 4-bloc structure into a 5-line body for high-volume paste-ability, but the semantics stay identical.

### Subject line
- Max **~8–10 words**, under 80 characters.
- Specific to country, organization type, and role.
- Use `:` as separator. **Never** use `—`.
- Examples: `Blockchain workshop idea for your students in Romania`, `Free Hedera certification for Masaryk University students`, `Web3 guest lecture for your Tartu fintech track`.

### Body — 5 lines, ~80–100 words total
The 5 lines map to the daily routine's 4 blocs + opt-out:

1. **Line 1 — Hook (Bloc 1):** reference the prospect's role, organization type, country context, a plausible local angle (ecosystem, regulator, flagship programme, student club). Never start with "Dar Blockchain". Start with *them*.
2. **Line 2 — Who I am + value (Bloc 2):** one sentence. Dar Blockchain = Web3 hub partnered with Hedera (Governing Council: Google, IBM, Deutsche Telekom), free blockchain certification for students, 10 000+ students trained, 250+ partner institutions. Pick the shortest version that fits.
3. **Line 3 — Relevance pivot (Bloc 3):** one sentence connecting *their* context (students, research, employability, local fintech ecosystem, curriculum) to *our* offer (workshop, guest lecture, joint programme, hackathon, certification). Not a feature list.
4. **Line 4 — CTA with soft 2-3 day horizon (Bloc 4):** "Would you have 15–20 minutes in the next couple of days for a quick chat?" or equivalent variant. Calendly link on its own, not buried: `https://calendly.com/souebmahdi/new-meeting`.
5. **Line 5 — Opt-out (new, mandatory for this routine):** `If you prefer not to receive any further emails on this topic, just reply 'unsubscribe' and I'll remove you from my list.`

The greeting (`Hi [First Name],`) and sign-off (`Best regards,` / `Mahdi Souab — Dar Blockchain`) sit around these 5 lines and are NOT counted in the 5-line budget — i.e., the visible email has greeting + 5 body lines + sign-off + signature.

### Style rules (inherited from the daily routine)
- Warm, professional, concise. No hype, no jargon, no filler.
- No promotional language: no "game-changer", "revolutionary", "unlock", "transform". No emojis. No em dashes. No bullet points in the body.
- No mention of attachments or PDFs.
- Every email must reference something specific to the prospect (role, programme, country). "Light but real personalization" — same posture as the daily routine.
- If a prospect's programme is positioned as multi-chain / protocol-neutral, lead with "blockchain certification" and mention Hedera only as the platform used for hands-on exercises.
- Signature: `Mahdi Souab — Dar Blockchain` (not "Dar Blockchain France", never "EMEA").
- Sender identity: `responsable des partenariats chez Dar Blockchain` (or in English: `Head of Partnerships, Dar Blockchain`).

### Sender block (use consistently across the 300 emails)
- Name: Mahdi Souab
- Role: Head of Partnerships, Dar Blockchain
- Calendly: `https://calendly.com/souebmahdi/new-meeting`
- Email signature line: `Mahdi Souab — Dar Blockchain`

## STEP 6 — OUTPUT FORMAT (STRICT)

Write all 300 emails into `outreach/europe_oneshot_<YYYY-MM-DD>_300emails.md` with this exact structure. Do not deviate.

```
Email #1
Country: …
Prospect: FirstName LastName – Role, Organization
Subject: …
Body:
Line 1
Line 2
Line 3
Line 4
Line 5

Email #2
Country: …
Prospect: FirstName LastName – Role, Organization
Subject: …
Body:
Line 1
Line 2
Line 3
Line 4
Line 5
```

Rules on the output file:
- Numbering is strictly incremental from `Email #1` to `Email #300`. No gaps, no duplicates.
- No greeting or sign-off in the `Body:` block — those are constant and stated once at the top of the file. (See file header below.)
- **File header (placed once at the top, before `Email #1`):**
  - Date and campaign label: `Dar Blockchain — Europe 300 one-shot — <YYYY-MM-DD>`.
  - Country allocation table (country → count).
  - Greeting template: `Hi [First Name],`
  - Sign-off template: `Best regards,` followed by `Mahdi Souab — Dar Blockchain` and the Calendly URL.
  - A one-line note stating the opt-out sentence is always Line 5.
- The `Body:` lines below each email are the 5 body lines only — Mahdi will prepend/append greeting and signature when pasting.
- If a batch is localized (Mahdi explicitly asks), note the language on the `Country:` line (e.g. `Country: Poland (Polish)`).

### Chunked writing (same pattern as daily STEP 11)
Never write 300 emails in a single `Write` call. Build the file incrementally in **small appends** of ~20–30 emails each, via `Bash` `cat >> ... << 'EOF'` blocks. After each append, echo the current `wc -l` of the file so progress is visible. Each append must finish well under 30 seconds. This avoids stream idle timeouts.

## STEP 7 — STOPPING CONDITION & BATCHING

- **Do not stop before 300 emails are produced.** The run is complete only when `Email #300` exists in the output file, fully formatted.
- If a technical limit (tokens, timeout, network) prevents continuing, you may pause **only at the end of a full email** — never mid-email, never mid-line. Then report to Mahdi exactly: `I have generated N emails so far. Tell me "continue from Email #N+1" and I will resume.`
- When Mahdi replies `continue from Email #X`, resume at `Email #X` with the exact same structure, constraints, language rules, and country allocation.
- The run is not complete until Step 10 (commit & push) is done; partial runs that stopped on a limit must still commit what's been produced so the laptop sync picks it up.

## STEP 8 — ADAPTATION TO FEEDBACK MID-RUN

At any point, Mahdi may give extra instructions, e.g. `More Poland and Estonia, fewer Baltics overall`, `Focus more on executive education`, `Shorter emails, drop Line 2`, `Switch to French for Luxembourg batch`.

When that happens:
1. Acknowledge in 1–2 lines how you will adapt.
2. Apply the change starting from the **next** email onwards.
3. **Do not rewrite previous emails** unless Mahdi explicitly asks.
4. Update the country allocation table at the top of the output file if the change affects it.

## STEP 9 — QUALITY CHECKS BEFORE HANDING OFF

Before declaring the run complete, scan the output file and verify:

- Exactly 300 email blocks, numbered `#1` → `#300`, no gaps.
- Every email has `Country:`, `Prospect:`, `Subject:`, and a 5-line `Body:` block.
- Every Line 4 contains the Calendly URL `https://calendly.com/souebmahdi/new-meeting` OR the sign-off block at the file header makes it globally available — pick one and be consistent across the 300.
- Every Line 5 is the opt-out sentence.
- Subject lines ≤ 80 characters and use `:` as separator, never `—`.
- No two emails share the same subject verbatim AND the same prospect name — that would be an accidental duplicate. Rename either.
- No fabricated emails, phone numbers, or LinkedIn URLs appear anywhere.
- Country distribution matches the allocation table at the top of the file.

Log any anomalies in `outreach/europe_oneshot_<YYYY-MM-DD>_summary.md` so Mahdi sees them without reading the whole 300.

## STEP 10 — GIT COMMIT & PUSH (MANDATORY)

Same contract as the daily routine's Step 12, scoped to this one-off's files only.

### 10A — Stage ONLY this campaign's files
```
git add outreach/EUROPE_300_ONESHOT.md \
        outreach/europe_oneshot_<YYYY-MM-DD>_300emails.md \
        outreach/europe_oneshot_<YYYY-MM-DD>_summary.md
```
Do not `git add .`. Do not stage `rotation_state.json`, `leads_master.csv`, any `daily_reports/` or `gsheet_import_*.csv`.

### 10B — Commit
```
git commit -m "Europe 300 one-shot <YYYY-MM-DD>: <N> emails across <M> countries"
```
Fill `<N>` (ideally 300) and `<M>` (the number of countries in the final allocation).

### 10C — Push
```
git push -u origin <current_branch>
```
If the push fails due to a network error, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s). If it still fails, include a bold `GIT PUSH FAILED — please push manually` banner in the final summary message to Mahdi with the full git error output.

### 10D — Verify
After push, confirm `git rev-parse HEAD` matches `git rev-parse origin/<branch>`. Include the commit hash in the closing message to Mahdi so he can find it on GitHub.

## IMPORTANT RULES (ONE-OFF-SPECIFIC)

1. This is a **one-night** routine. It is not part of the daily rotation. Do not schedule it, do not re-run it, do not chain it.
2. **Never** modify `outreach/rotation_state.json`, `outreach/leads_master.csv`, `outreach/EMAILS_DONE.txt`, `outreach/followup_tracker.csv`, any file under `outreach/daily_reports/`, or any `outreach/gsheet_import_*.csv`. Tomorrow's daily run must start from exactly the state as if this routine had never existed.
3. **Never** create Gmail drafts. All prospects in this routine are invented templates.
4. **Never** fabricate email addresses, phone numbers, or LinkedIn URLs. The prospect line carries only name, role, organization, country.
5. **Always** wait for Mahdi's confirmation of the country list (Step 2) before drafting any email.
6. **Always** include the opt-out sentence as Line 5 of every body (or localized equivalent if a batch is localized).
7. **Always** keep the same brand voice as the daily routine: Dar Blockchain as a Web3 hub partnered with Hedera, free certification, 10 000+ students trained, 250+ partner institutions, Calendly CTA, no emojis, no hype.
8. **Always** reach 300 emails. Stop only at the end of a full email if a technical limit forces a pause, then invite Mahdi to say `continue from Email #X`.
9. **Always** commit and push only this campaign's files at the end. The laptop picks them up via `scripts/sync_local.sh`.
10. If anything in this routine ever conflicts with `outreach/SKILL.md`, `outreach/SKILL.md` wins for the daily pipeline. This file only governs the Europe 300 one-shot.
