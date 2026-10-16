// Gör bilderna till Chrome Web Store: tre skärmbilder (1280 x 800) och en liten reklamruta (440 x 280).
// Kör från projektets rot: node store/make-images.js
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const root = path.resolve(__dirname, "..");

  // Skärmbilderna bygger på hero-animationen, i formatet 16:10 som butiken vill ha.
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 0.8 });
  await page.goto("file://" + root + "/docs/hero/hero-anim.html");
  await page.addStyleTag({ content: "html, body { height: 1000px !important; }" });
  const moments = [["copilot", 3.0], ["marketplace", 6.5], ["mcp", 10.0]];
  for (let i = 0; i < moments.length; i++) {
    await page.evaluate(t => window.setTime(t), moments[i][1]);
    await page.screenshot({ path: path.join(__dirname, `screenshot-${i + 1}-${moments[i][0]}.png`) });
  }

  // Den lilla reklamrutan.
  const tile = await browser.newPage({ viewport: { width: 440, height: 280 } });
  const icon = "data:image/png;base64," + require("fs").readFileSync(root + "/extension/icons/icon-128.png").toString("base64");
  await tile.setContent(`<!doctype html><html><body style="margin:0;width:440px;height:280px;background:#000;
    font-family:'TeX Gyre Heros','Helvetica Neue',Helvetica,Arial,sans-serif;display:flex;flex-direction:column;
    justify-content:space-between;box-sizing:border-box;padding:32px">
    <img src="${icon}" width="56" height="56">
    <div style="font-size:34px;line-height:38px;font-weight:500;letter-spacing:-0.02em;color:#fff">GitHub förklarat<br>
    <span style="color:#7f7f7f">med vardagliga ord</span></div></body></html>`);
  await tile.waitForLoadState("load");
  await tile.screenshot({ path: path.join(__dirname, "promo-small-440x280.png") });

  await browser.close();
  console.log("Klart: bilderna ligger i store/");
})();
