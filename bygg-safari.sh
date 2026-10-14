#!/bin/bash
# Gör om tillägget till en Safari-app. Körs på en Mac med Xcode installerat.
# Resultatet hamnar i mappen "safari" bredvid det här skriptet.
set -e
cd "$(dirname "$0")"

if ! command -v xcrun >/dev/null 2>&1; then
  echo "Hittar inte xcrun. Installera Xcode från App Store och öppna det en gång först."
  exit 1
fi

xcrun safari-web-extension-converter extension \
  --project-location safari \
  --app-name "Plain Words SWE" \
  --bundle-identifier com.anthonbackstrom.PlainWordsSWE \
  --swift \
  --macos-only \
  --copy-resources \
  --no-prompt \
  --force

echo ""
echo "Klart. Öppna "safari/Plain Words SWE/Plain Words SWE.xcodeproj" i Xcode och tryck på Play."
