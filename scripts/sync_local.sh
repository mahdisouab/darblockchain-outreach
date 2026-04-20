#!/usr/bin/env bash
# sync_local.sh — keep Mahdi's laptop clone in sync with GitHub
#
# Run this on your laptop on a schedule. It does a non-destructive
# git fetch + ff-only pull on the current branch. If there are local
# uncommitted changes, it refuses to pull (so your work is never
# overwritten) and logs a notice instead.
#
# One-time setup (macOS, recommended — launchd):
#   1. Edit REPO_PATH below to your local clone path.
#   2. Save this file and `chmod +x scripts/sync_local.sh`.
#   3. Create ~/Library/LaunchAgents/com.darblockchain.sync.plist with:
#
#      <?xml version="1.0" encoding="UTF-8"?>
#      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
#        "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
#      <plist version="1.0"><dict>
#        <key>Label</key><string>com.darblockchain.sync</string>
#        <key>ProgramArguments</key>
#        <array>
#          <string>/absolute/path/to/darblockchain-outreach/scripts/sync_local.sh</string>
#        </array>
#        <key>StartInterval</key><integer>600</integer>
#        <key>StandardOutPath</key><string>/tmp/darblockchain-sync.log</string>
#        <key>StandardErrorPath</key><string>/tmp/darblockchain-sync.err</string>
#      </dict></plist>
#
#   4. Load it: `launchctl load ~/Library/LaunchAgents/com.darblockchain.sync.plist`
#
# One-time setup (Linux — cron):
#   crontab -e  and add:
#   */10 * * * * /absolute/path/to/darblockchain-outreach/scripts/sync_local.sh >> /tmp/darblockchain-sync.log 2>&1
#
# One-time setup (Windows):
#   Use Task Scheduler to run `bash scripts/sync_local.sh` every 10 minutes
#   (requires WSL or Git Bash).

set -u

# ---- CONFIG -----------------------------------------------------------------
# If you always run this from inside the repo, leave REPO_PATH empty and the
# script will cd to its own directory. Otherwise set the absolute path:
REPO_PATH=""
# -----------------------------------------------------------------------------

if [ -z "$REPO_PATH" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_PATH="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

cd "$REPO_PATH" || { echo "[sync] ERROR: cannot cd to $REPO_PATH"; exit 1; }

TIMESTAMP="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
if [ -z "$BRANCH" ] || [ "$BRANCH" = "HEAD" ]; then
  echo "[sync $TIMESTAMP] ERROR: not on a branch ($REPO_PATH). Skipping."
  exit 1
fi

# Refuse to pull if there are uncommitted local changes — protects your work.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "[sync $TIMESTAMP] local uncommitted changes on $BRANCH — skipping pull. Commit/stash first."
  exit 0
fi

echo "[sync $TIMESTAMP] fetching origin..."
if ! git fetch --quiet origin "$BRANCH"; then
  echo "[sync $TIMESTAMP] ERROR: git fetch failed."
  exit 1
fi

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$BRANCH")"

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "[sync $TIMESTAMP] already up to date on $BRANCH ($LOCAL)."
  exit 0
fi

echo "[sync $TIMESTAMP] pulling $BRANCH ($LOCAL -> $REMOTE)..."
if git pull --ff-only --quiet origin "$BRANCH"; then
  echo "[sync $TIMESTAMP] pulled successfully. Now at $(git rev-parse HEAD)."
else
  echo "[sync $TIMESTAMP] ERROR: non-fast-forward. Resolve manually:"
  echo "  cd $REPO_PATH && git status"
  exit 1
fi
