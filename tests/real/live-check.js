/*
 * Direkt test mot github.com (live, inte sparade kopior) av de delar som
 * uppdraget nämner. Utloggad, och utan GitHubs stil- och skriptfiler som är
 * blockerade i testmiljön.
 *
 * Kör: NODE_PATH=$(npm root -g) node tests/real/live-check.js
 */
const path = require("path");
const fs = require("fs");
const os = require("os");
const { chromium } = require("playwright");
const EXT = path.resolve(__dirname, "..", "..", "extension");

// [sida, beskrivning, sätt att hitta saken i GitHubs riktiga kod, förväntad förklaring]
const CHECKS = [
  ["https://github.com/microsoft/vscode", "Flik Code", 'nav[aria-label="Repository"] a[data-tab-item="code"]', "tab-code"],
  ["https://github.com/microsoft/vscode", "Flik Issues", 'nav[aria-label="Repository"] a[data-tab-item="issues"]', "tab-issues"],
  ["https://github.com/microsoft/vscode", "Flik Pull requests", 'nav[aria-label="Repository"] a[data-tab-item="pull-requests"]', "tab-pulls"],
  ["https://github.com/microsoft/vscode", "Flik Actions", 'nav[aria-label="Repository"] a[data-tab-item="actions"]', "tab-actions"],
  ["https://github.com/microsoft/vscode", "Flik Projects", 'nav[aria-label="Repository"] a[href$="/projects"]', "tab-projects"],
  ["https://github.com/microsoft/vscode", "Flik Wiki", 'nav[aria-label="Repository"] a[href$="/wiki"]', "tab-wiki"],
  ["https://github.com/microsoft/vscode", "Flik Security", 'nav[aria-label="Repository"] a[href$="/security"]', "tab-security"],
  ["https://github.com/microsoft/vscode", "Flik Insights", 'nav[aria-label="Repository"] a[href$="/pulse"]', "tab-insights"],
  ["https://github.com/vercel/next.js", "Flik Discussions", 'nav[aria-label="Repository"] a[href$="/discussions"]', "tab-discussions"],
  ["https://github.com/microsoft/vscode", "Star", 'a[href^="/login"]:has-text("Star")', "star"],
  ["https://github.com/microsoft/vscode", "Fork", '#fork-button, a[aria-label="You must be signed in to fork a repository"]', "fork"],
  ["https://github.com/microsoft/vscode", "Watch (Notifications)", 'a[aria-label="You must be signed in to change notification settings"]', "watch"],
  ["https://github.com/microsoft/vscode", "Gröna Code-knappen", 'button[data-variant="primary"]:has-text("Code")', "code-button"],
  ["https://github.com/microsoft/vscode", "Branch-väljaren", "#ref-picker-repos-header-ref-selector", "branch-picker"],
  ["https://github.com/microsoft/vscode", "Branches", 'a[href$="/branches"]', "branches"],
  ["https://github.com/microsoft/vscode", "Go to file", 'input[placeholder="Go to file"]', "go-to-file"],
  ["https://github.com/microsoft/vscode", "Commits", 'a[href*="/commits/"]:has-text("Commits")', "commits"],
  ["https://github.com/microsoft/vscode", "README", 'a[href="#readme-ov-file"]', "readme"],
  ["https://github.com/microsoft/vscode", "About", 'h2:has-text("About")', "about"],
  ["https://github.com/microsoft/vscode", "Releases", 'h2:has-text("Releases")', "releases"],
  ["https://github.com/microsoft/vscode", "Sökfältet", 'button[aria-label^="Search or jump to"]', "search"],
  ["https://github.com/microsoft/vscode", "Sign in", 'a[href^="/login"]:has-text("Sign in")', "sign-in"],
  ["https://github.com/microsoft/vscode/issues/1", "Issue: rubrik", '[data-testid="issue-title"]', "page-title"],
  ["https://github.com/microsoft/vscode/issues/1", "Issue: status", '[data-testid="header-state"]', "state-badge"],
  ["https://github.com/microsoft/vscode/issues/1", "Issue: New issue", 'a:has-text("New issue"), button:has-text("New issue")', "new-issue"],
  ["https://github.com/microsoft/vscode/issues/1", "Issue: Assignees", 'h3:has-text("Assignees")', "assignees"],
  ["https://github.com/microsoft/vscode/issues/1", "Issue: Labels", 'h3:has-text("Labels")', "labels"],
  ["https://github.com/microsoft/vscode/issues/1", "Issue: Milestone", 'h3:has-text("Milestone")', "milestones"],
  ["https://github.com/microsoft/vscode/issues/1", "Issue: Development", 'h3:has-text("Development")', "development"],
  ["https://github.com/facebook/react/pull/31000", "PR: Conversation", 'nav[aria-label="Pull request navigation"] a:has-text("Conversation"), .tabnav-tabs a:has-text("Conversation")', "pr-conversation"],
  ["https://github.com/facebook/react/pull/31000", "PR: Commits", 'a[href$="/pull/31000/commits"]', "pr-commits"],
  ["https://github.com/facebook/react/pull/31000", "PR: Checks", 'a[href$="/pull/31000/checks"]', "pr-checks"],
  ["https://github.com/facebook/react/pull/31000", "PR: Files changed", 'a[href$="/pull/31000/files"]', "pr-files"],
  ["https://github.com/facebook/react/pull/31000", "PR: Reviewers", 'h3:has-text("Reviewers")', "reviewers"],
  ["https://github.com/facebook/react/pull/31000", "PR: Labels", 'h3:has-text("Labels")', "labels"],
  ["https://github.com/facebook/react/pull/31000", "PR: Kopiera branch-namn", 'xpath=//span[normalize-space()="Copy head branch name to clipboard"]/preceding-sibling::button[1]', "copy-branch"],
  ["https://github.com/facebook/react/pull/31000", "PR: branch-namn", 'a[data-component="BranchName"]', "branch-name"],
  ["https://github.com/facebook/react/pull/31000", "PR: status (Merged)", '[data-testid="header-state"], .State', "state-badge"]
];

(async () => {
  const ctx = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), "gfd-live-")), {
    channel: "chromium",
    headless: true,
    viewport: { width: 1400, height: 1000 },
    locale: "en-US",
    args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`]
  });
  await ctx.route("https://github.githubassets.com/**", (r) => r.abort());
  const page = await ctx.newPage();
  let current = null;
  const rows = [];
  for (const [url, what, sel, expected] of CHECKS) {
    if (url !== current) {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1500);
      current = url;
    }
    let got = null;
    let note = "";
    try {
      const loc = page.locator(sel).first();
      if (!(await loc.count())) throw new Error("finns inte på sidan");
      await loc.scrollIntoViewIfNeeded({ timeout: 2000 });
      await page.mouse.move(1, 1);
      await page.waitForTimeout(40);
      await loc.hover({ timeout: 2000, force: true });
      await page.waitForTimeout(650);
      got = await page.evaluate(() => {
        const h = document.getElementById("gfd-host");
        const b = h && h.shadowRoot.querySelector(".bubble");
        return b && b.classList.contains("show") ? b.getAttribute("data-key") : null;
      });
    } catch (e) {
      note = e.message.split("\n")[0];
    }
    const ok = got === expected;
    rows.push({ what, expected, got, ok, note });
    console.log(`${ok ? "OK " : "FEL"}  ${what.padEnd(26)} väntade=${expected} fick=${got}${note ? "  (" + note + ")" : ""}`);
  }
  const okCount = rows.filter((r) => r.ok).length;
  console.log(`\nLive mot github.com: ${okCount}/${rows.length} rätt (${new Date().toISOString()})`);
  fs.writeFileSync(path.join(__dirname, "live-result.json"), JSON.stringify({ at: new Date().toISOString(), rows }, null, 1));
  await ctx.close();
})();
