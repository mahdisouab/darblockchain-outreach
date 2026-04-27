#!/usr/bin/env bash
# Rebuilds the static export and force-pushes it to the gh-pages branch.
# Run from repo root: ./scripts/deploy_gh_pages.sh
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$PWD"
SRC="$ROOT/bistro-oberkampf-demo"
STAGE="$(mktemp -d)"
INDEX="$(mktemp)"

echo "[1/4] Static export..."
(cd "$SRC" && NEXT_EXPORT=1 pnpm build >/dev/null)

echo "[2/4] Stage out/ -> $STAGE"
cp -a "$SRC/out/." "$STAGE/"
touch "$STAGE/.nojekyll"

echo "[3/4] Build commit object"
GIT_INDEX_FILE="$INDEX" git --work-tree="$STAGE" add -A
TREE=$(GIT_INDEX_FILE="$INDEX" git --work-tree="$STAGE" write-tree)
COMMIT=$(echo "deploy: static export $(date -u +%Y-%m-%dT%H:%M:%SZ)" | git commit-tree "$TREE")

echo "[4/4] Push gh-pages"
git update-ref refs/heads/gh-pages "$COMMIT"
git push -f origin gh-pages

echo "Done. URL: https://mahdisouab.github.io/darblockchain-outreach/"
