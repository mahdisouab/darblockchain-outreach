# scripts/

## `sync_local.sh`

Keeps your laptop's clone of this repo in sync with GitHub automatically. After
a nightly routine pushes its report + CSVs + `rotation_state.json`, this script
pulls them to your laptop on a schedule. No manual `git pull` needed.

### What it does
- `cd` into the repo
- checks you're on a branch
- refuses to pull if you have uncommitted local changes (protects your work)
- `git fetch origin <branch>`
- `git pull --ff-only origin <branch>`
- logs every run to stdout (captured by launchd / cron)

### One-time setup — macOS (launchd, recommended)

1. Edit `scripts/sync_local.sh` and either leave `REPO_PATH=""` (auto-detected)
   or set it to the absolute path of your clone.
2. Make it executable: `chmod +x scripts/sync_local.sh`.
3. Create `~/Library/LaunchAgents/com.darblockchain.sync.plist`:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
     "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0"><dict>
     <key>Label</key><string>com.darblockchain.sync</string>
     <key>ProgramArguments</key>
     <array>
       <string>/ABSOLUTE/PATH/TO/darblockchain-outreach/scripts/sync_local.sh</string>
     </array>
     <key>StartInterval</key><integer>600</integer>
     <key>StandardOutPath</key><string>/tmp/darblockchain-sync.log</string>
     <key>StandardErrorPath</key><string>/tmp/darblockchain-sync.err</string>
   </dict></plist>
   ```

   Replace `/ABSOLUTE/PATH/TO/...` with the real path.

4. Load it: `launchctl load ~/Library/LaunchAgents/com.darblockchain.sync.plist`.
5. Verify: `tail -f /tmp/darblockchain-sync.log` — you should see a sync line
   every 10 minutes.

### One-time setup — Linux (cron)

```
crontab -e
# add:
*/10 * * * * /ABSOLUTE/PATH/TO/darblockchain-outreach/scripts/sync_local.sh >> /tmp/darblockchain-sync.log 2>&1
```

### One-time setup — Windows (ONE-CLICK INSTALLER)

1. In **File Explorer**, navigate to `scripts\` inside your repo folder.
2. **Double-click `install_windows.bat`**.

That's it. The installer auto-detects your repo path and Git Bash location, registers a Windows scheduled task that runs every 10 minutes, and runs it once immediately to verify. Log lines show up in the terminal window. Press any key to close.

Requirements: Git for Windows must be installed (you already have it since you use `git` — if not, get it from <https://git-scm.com/download/win>).

Log file ends up at `C:\Users\<you>\darblockchain-sync.log` — open in Notepad any time to see sync history.

To remove the task later: double-click `scripts\uninstall_windows.bat`.

### One-time setup — Windows (manual, if the installer fails)

Use Task Scheduler to run `bash scripts/sync_local.sh` every 10 minutes via Git Bash. See the commit history of this README for the full manual steps — but try the one-click installer first.

### Troubleshooting

- **"local uncommitted changes on <branch> — skipping pull"**: you edited
  something on your laptop. Commit or stash, then the next sync will pull.
- **"non-fast-forward"**: your laptop's branch has diverged from origin. Run
  `git status` and sort it out manually (usually: rebase or merge).
- **"not on a branch"**: you're in a detached HEAD state. `git checkout <branch>`.
