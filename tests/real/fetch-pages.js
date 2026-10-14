/*
 * Hämtar riktiga sidor från github.com och sparar dem i tests/real/snapshots.
 * Skript-taggar tas bort (de behövs inte för testet och gör filerna stora).
 *
 * Kör: NODE_PATH=$(npm root -g) node tests/real/fetch-pages.js
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const PAGES = {
  repo: "https://github.com/facebook/react",
  "repo-nextjs": "https://github.com/vercel/next.js",
  issues: "https://github.com/facebook/react/issues",
  issue: "https://github.com/facebook/react/issues/24502",
  pulls: "https://github.com/facebook/react/pulls",
  pr: "https://github.com/facebook/react/pull/31000",
  "pr-files": "https://github.com/facebook/react/pull/31000/files",
  "pr-commits": "https://github.com/facebook/react/pull/31000/commits",
  file: "https://github.com/facebook/react/blob/main/package.json",
  releases: "https://github.com/facebook/react/releases"
};

(async () => {
  const out = path.join(__dirname, "snapshots");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: "en-US" });
  await page.route("https://github.githubassets.com/**", (r) => r.abort());
  const index = {};
  for (const [name, url] of Object.entries(PAGES)) {
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      let html = await page.content();
      html = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      fs.writeFileSync(path.join(out, name + ".html"), html);
      index[name] = { url, finalUrl: page.url(), status: res.status(), bytes: html.length };
      console.log(name, res.status(), page.url(), html.length);
    } catch (e) {
      console.log(name, "ERR", e.message.split("\n")[0]);
    }
  }
  fs.writeFileSync(path.join(out, "index.json"), JSON.stringify({ fetched: new Date().toISOString(), pages: index }, null, 1));
  await browser.close();
})();
