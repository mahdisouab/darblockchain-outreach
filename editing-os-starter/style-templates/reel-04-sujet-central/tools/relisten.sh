#!/usr/bin/env bash
# Reecoute ciblee : fenetres courtes (WIN s, pas WIN/2) sur des zones floues, whisper -l ar en
# segmentation naturelle. Sortie : assets/windows/relisten-<WIN>s.txt
#   bash tools/relisten.sh 7 "22 34" "42 64" "84 102" "110 131"
# whisper-cli : celui du PATH (brew install whisper-cpp), sinon WHISPER_CLI=<chemin>.
# Les modeles se telechargent a la premiere transcription (scripts/transcribe-whisper.mjs).
set -euo pipefail
WIN="$1"; shift
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
WHISPER="${WHISPER_CLI:-whisper-cli}"
MODEL="$ROOT/models/ggml-large-v3-turbo.bin"
VAD="$ROOT/models/ggml-silero-v5.1.2.bin"
if [ ! -f "$MODEL" ] || [ ! -f "$VAD" ]; then
  echo "modeles absents dans $ROOT/models : lance d abord une transcription (node scripts/transcribe-whisper.mjs <rush>), elle les telecharge" >&2
  exit 2
fi
SRC="${SRC:-assets/rush.mp4}"
OUT="assets/windows/relisten-${WIN}s.txt"
TMP="assets/windows/relisten.wav"
mkdir -p assets/windows
: > "$OUT"
STEP=$(node -e "console.log(($WIN/2).toFixed(2))")
for zone in "$@"; do
  set -- $zone
  a="$1"; z="$2"
  t="$a"
  while node -e "process.exit($t < $z ? 0 : 1)"; do
    ffmpeg -y -v error -ss "$t" -t "$WIN" -i "$SRC" -vn -ac 1 -ar 16000 -c:a pcm_s16le "$TMP"
    echo "## window $t -> $(node -e "console.log(+($t + $WIN).toFixed(2))")" >> "$OUT"
    "$WHISPER" -m "$MODEL" -f "$TMP" -l ar --vad -vm "$VAD" -np -t 8 2>/dev/null | grep -E "^\[" >> "$OUT" || true
    t=$(node -e "console.log(+($t + $STEP).toFixed(2))")
  done
done
rm -f "$TMP"
echo "ecrit : $OUT"
