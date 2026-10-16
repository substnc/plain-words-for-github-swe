// Ritar tilläggets ikoner i alla storlekar från extension/icons/icon.svg.
// Kör från projektets rot: node tools/make_icons.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const dir = path.resolve(__dirname, "../extension/icons");
  const svg = fs.readFileSync(path.join(dir, "icon.svg"), "utf8");
  const browser = await chromium.launch();
  for (const size of [16, 32, 48, 128]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
    await page.screenshot({ path: path.join(dir, `icon-${size}.png`), omitBackground: true });
    await page.close();
  }
  await browser.close();
  console.log("Klart: extension/icons/icon-16, 32, 48 och 128.png");
})();
