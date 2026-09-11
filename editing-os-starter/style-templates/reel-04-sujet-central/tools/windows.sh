#!/usr/bin/env bash
# Balayage des reprises en fenetres isolees (PROCESS.md, "Trois pieges de derush") :
# whisper fusionne une phrase dite deux fois quand il lit tout le fichier. On decoupe
# la source en fenetres de N secondes (chevauchement 2 s), on transcrit chaque morceau
# seul, en segmentation naturelle (jamais -ml 1 -sow), et on fait DEUX passes de
# tailles differentes. Sortie : assets/windows/pass-<N>s.txt
#   bash tools/windows.sh assets/rush.mp4 10
#   bash tools/windows.sh assets/rush.mp4 13
# whisper-cli : celui du PATH (brew install whisper-cpp), sinon WHISPER_CLI=<chemin>.
# Les modeles se telechargent a la premiere transcription (scripts/transcribe-whisper.mjs).
set -euo pipefail
SRC="${1:-assets/rush.mp4}"
WIN="${2:-10}"
LANG_="${3:-ar}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
WHISPER="${WHISPER_CLI:-whisper-cli}"
MODEL="$ROOT/models/ggml-large-v3-turbo.bin"
VAD="$ROOT/models/ggml-silero-v5.1.2.bin"
if [ ! -f "$MODEL" ] || [ ! -f "$VAD" ]; then
  echo "modeles absents dans $ROOT/models : lance d abord une transcription (node scripts/transcribe-whisper.mjs <rush>), elle les telecharge" >&2
  exit 2
fi
OUT_DIR="assets/windows"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/pass-${WIN}s.txt"
: > "$OUT"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
DUR=${DUR%.*}
TMP="$OUT_DIR/win.wav"
t=0
while [ "$t" -lt "$DUR" ]; do
  ffmpeg -y -v error -ss "$t" -t "$WIN" -i "$SRC" -vn -ac 1 -ar 16000 -c:a pcm_s16le "$TMP"
  echo "## window $t -> $((t + WIN))" >> "$OUT"
  "$WHISPER" -m "$MODEL" -f "$TMP" -l "$LANG_" --vad -vm "$VAD" -np -t 8 2>/dev/null \
    | grep -E "^\[" >> "$OUT" || true
  t=$((t + WIN - 2))
done
rm -f "$TMP"
echo "ecrit : $OUT"
