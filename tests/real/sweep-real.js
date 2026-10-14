/*
 * Testar tillägget mot sparade RIKTIGA github.com-sidor (tests/real/snapshots).
 * Håller musen över varje knapp, flik, länk och rubrik i sidans viktiga delar
 * och skriver ner vilken förklaring som visades, eller att ingen visades.
 *
 * Kör: NODE_PATH=$(npm root -g) node tests/real/sweep-real.js [sidnamn ...]
 */
const path = require("path");
const fs = require("fs");
const os = require("os");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..", "..");
const EXT = path.join(ROOT, "extension");
const SNAP = path.join(__dirname, "snapshots");
const index = JSON.parse(fs.readFileSync(path.join(SNAP, "index.json"), "utf8")).pages;
const only = process.argv.slice(2);

const COLLECT = () => {
  const SEL = 'a[href], button, summary, input, textarea, [role="tab"], [role="button"], [role="menuitem"], h2, h3, clipboard-copy';
  // Hoppa över GitHubs reklammeny för utloggade, sidfoten och text som folk själva skrivit.
  const SKIP = 'nav[aria-label="Global"], footer, .footer, .markdown-body, .comment-body, .react-code-lines, .blob-code, .js-file-line-container, [data-testid="markdown-body"], .sr-only, [class*="VisuallyHidden"], [class*="InternalVisuallyHidden"], [hidden], template, .diff-table';
  const out = [];
  let n = 0;
  for (const el of document.querySelectorAll(SEL)) {
    if (el.closest(SKIP) || el.closest("#gfd-host")) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const parent = el.parentElement && el.parentElement.closest(SEL);
    if (parent && !parent.closest(SKIP)) continue;
    el.setAttribute("data-gfd-sweep", String(n));
    let label = el.getAttribute("aria-label") || "";
    const lb = el.getAttribute("aria-labelledby");
    if (!label && lb) label = lb.split(/\s+/).map((id) => (document.getElementById(id) || {}).textContent || "").join(" ");
    out.push({
      n: n++,
      tag: el.tagName.toLowerCase(),
      label: label.replace(/\s+/g, " ").trim().slice(0, 60),
      href: (el.getAttribute("href") || "").slice(0, 70),
      text: (el.innerText || el.value || el.getAttribute("placeholder") || "").replace(/\s+/g, " ").trim().slice(0, 50)
    });
  }
  return out;
};

async function main() {
  const ctx = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), "gfd-real-")), {
    channel: "chromium",
    headless: true,
    viewport: { width: 1400, height: 1000 },
    args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`]
  });
  const byPath = {};
  for (const [name, info] of Object.entries(index)) byPath[new URL(info.finalUrl).pathname] = name;
  await ctx.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "github.com" && byPath[url.pathname]) {
      const html = fs.readFileSync(path.join(SNAP, byPath[url.pathname] + ".html"), "utf8");
      return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: html });
    }
    return route.abort();
  });

  const page = await ctx.newPage();
  const report = {};
  for (const [name, info] of Object.entries(index)) {
    if (only.length && !only.includes(name)) continue;
    await page.goto(info.finalUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const items = await page.evaluate(COLLECT);
    for (const it of items) {
      try {
        await page.mouse.move(1, 1);
        await page.waitForTimeout(30);
        const loc = page.locator(`[data-gfd-sweep="${it.n}"]`);
        await loc.scrollIntoViewIfNeeded({ timeout: 1000 });
        await page.mouse.move(1, 1);
        await page.waitForTimeout(30);
        await loc.hover({ timeout: 1000, force: true });
        await page.waitForTimeout(580);
        it.key = await page.evaluate(() => {
          const h = document.getElementById("gfd-host");
          const b = h && h.shadowRoot.querySelector(".bubble");
          return b && b.classList.contains("show") ? b.getAttribute("data-key") : null;
        });
      } catch (e) {
        it.key = "ERR";
      }
    }
    report[name] = items;
    const hit = items.filter((i) => i.key && i.key !== "ERR").length;
    console.log(`${name}: ${hit}/${items.length} med förklaring`);
  }
  const outFile = path.join(__dirname, only.length ? `sweep-${only.join("-")}.json` : "sweep-result.json");
  fs.writeFileSync(outFile, JSON.stringify(report, null, 1));
  await ctx.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
