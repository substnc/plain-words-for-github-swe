#!/bin/bash
# Gör hero.gif från hero-anim.html. Kräver Node, Playwright (npm install) och ffmpeg.
set -e
cd "$(dirname "$0")"
FRAMES=$(mktemp -d)
node -e '
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 800 }, deviceScaleFactor: 1.5 });
  await p.goto("file://" + process.cwd() + "/hero-anim.html");
  const n = Math.round(await p.evaluate(() => window.DURATION) * 25);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.setTime(t), i / 25);
    await p.screenshot({ path: process.argv[1] + "/f" + String(i).padStart(4, "0") + ".png" });
  }
  await b.close();
})();' "$FRAMES"
ffmpeg -loglevel error -y -framerate 25 -i "$FRAMES/f%04d.png" -vf "palettegen=max_colors=128:stats_mode=full" "$FRAMES/pal.png"
ffmpeg -loglevel error -y -framerate 25 -i "$FRAMES/f%04d.png" -i "$FRAMES/pal.png" -lavfi "paletteuse=dither=none:diff_mode=rectangle" -loop 0 hero.gif
rm -rf "$FRAMES"
echo "Klart: docs/hero/hero.gif"
