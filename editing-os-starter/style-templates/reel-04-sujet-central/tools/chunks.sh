#!/usr/bin/env bash
# Transcription PAR MORCEAUX : le contexte de whisper repart a zero a chaque morceau.
# Mesure du 09/09 : un rush en derja passe en entier avec --language ar boucle des 43 s
# (la meme phrase x60) et reecrit le debut en arabe standard. Les bornes sont le milieu
# des grands silences (-40 dB), donc aucun mot n est coupe. Chaque morceau passe par
# scripts/transcribe-whisper.mjs (VAD + align), puis tools/merge-chunks.mjs recolle les
# mots en temps SOURCE dans assets/rush.json.
#
#   BOUNDS="0 13.9 21.9 33.0 42.2 53.9" bash tools/chunks.sh     # bornes en secondes, 0 d abord
#   SRC=assets/rush.mp4 OUT=assets/rush.json bash tools/chunks.sh
#
# Les bornes se lisent dans les grands silences du rush :
#   ffmpeg -i assets/rush.mp4 -af silencedetect=n=-40dB:d=0.5 -f null - 2>&1 | grep silence_
# prendre le milieu de chaque silence, et jamais plus de ~35 s entre deux bornes.
# whisper-cli : celui du PATH (brew install whisper-cpp), sinon WHISPER_CLI=<chemin>.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="${SRC:-assets/rush.mp4}"
OUT_DIR="${OUT_DIR:-assets/chunks}"
OUT="${OUT:-assets/rush.json}"
if [ -z "${BOUNDS:-}" ]; then
  echo "BOUNDS manquant : BOUNDS=\"0 13.9 21.9 ...\" bash tools/chunks.sh (voir l en-tete du script)" >&2
  exit 2
fi
mkdir -p "$OUT_DIR"
prev=""
i=0
for b in $BOUNDS; do
  if [ -n "$prev" ]; then
    i=$((i + 1))
    n=$(printf "%02d" "$i")
    dur=$(node -e "console.log(($b - $prev).toFixed(3))")
    ffmpeg -y -v error -ss "$prev" -t "$dur" -i "$SRC" -vn -ac 1 -ar 16000 -c:a pcm_s16le "$OUT_DIR/c$n.wav"
    echo "== morceau $n : $prev -> $b ($dur s)"
    node "$ROOT/scripts/transcribe-whisper.mjs" "$OUT_DIR/c$n.wav" --language ar --output "$OUT_DIR/c$n.json" 2>&1 | tail -1
    echo "$prev" > "$OUT_DIR/c$n.offset"
  fi
  prev=$b
done
node "$TOOLS/merge-chunks.mjs" "$OUT_DIR" "$OUT"
