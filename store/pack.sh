#!/bin/bash
# Packar mappen extension/ till en zip-fil för Chrome Web Store. manifest.json hamnar överst i zip-filen.
set -e
cd "$(dirname "$0")/../extension"
VERSION=$(node -p 'require("./manifest.json").version')
OUT="../store/plain-words-for-github-swe-$VERSION.zip"
rm -f "$OUT"
zip -q -r -X "$OUT" . -x "*.DS_Store"
echo "Klart: store/plain-words-for-github-swe-$VERSION.zip"
