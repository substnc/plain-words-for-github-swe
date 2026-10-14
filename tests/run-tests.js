/*
 * Testar tillägget i en riktig Chromium med tillägget laddat.
 *
 * Sidorna i tests/fixtures efterliknar github.com (samma id, aria-label,
 * länkadresser och knapptexter som GitHub använder). Webbläsaren tror att
 * den är på https://github.com/..., så tillägget startar precis som på riktigt.
 *
 * Kör:  NODE_PATH=$(npm root -g) node tests/run-tests.js
 */
const path = require("path");
const fs = require("fs");
const os = require("os");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const EXT = path.join(ROOT, "extension");
const FIX = path.join(__dirname, "fixtures");
const HEADER = fs.readFileSync(path.join(FIX, "_header.html"), "utf8");

const PAGES = {
  "/facebook/react": "repo.html",
  "/facebook/react/issues": "issues.html",
  "/facebook/react/issues/30000": "issue.html",
  "/facebook/react/pull/31000": "pr.html"
};

// [sida, CSS-väljare att hålla musen över, förväntad förklaring]
const CASES = [
  // Toppen
  ["/facebook/react", "qbsearch-input button span", "search"],
  ["/facebook/react", "#global-create-menu-anchor", "plus-menu"],
  ["/facebook/react", "#AppHeader-notifications-button svg", "notifications-bell"],
  ["/facebook/react", 'button[aria-label="Open user navigation menu"] img', "user-menu"],
  ["/facebook/react", "#dialog-show-global-nav", "global-menu"],
  ["/facebook/react", "a.AppHeader-logo", "home-logo"],
  ["/facebook/react", "#copilot-chat-header-button", "copilot"],
  ["/facebook/react", 'a[aria-label="Your issues"]', "your-issues"],
  ["/facebook/react", 'a[aria-label="Your pull requests"]', "your-pulls"],
  ["/facebook/react", '.AppHeader-context a[href="/facebook/react"] span', "repo-name"],
  ["/facebook/react", '.AppHeader-context a[href="/facebook"] span', "owner-name"],
  // Huvudmenyn (inloggad)
  ["/facebook/react", '#test-global-nav a[href="/dashboard"] span', "global-home"],
  ["/facebook/react", '#test-global-nav a[href="/issues"] span', "your-issues"],
  ["/facebook/react", '#test-global-nav a[href="/pulls"] span', "your-pulls"],
  ["/facebook/react", '#test-global-nav a[href$="tab=repositories"] span', "your-repositories"],
  ["/facebook/react", '#test-global-nav a[href$="tab=projects"] span', "global-projects"],
  ["/facebook/react", '#test-global-nav a[href="/discussions"] span', "global-discussions"],
  ["/facebook/react", '#test-global-nav a[href="/codespaces"] span', "global-codespaces"],
  ["/facebook/react", '#test-global-nav a[href="/copilot"] span', "copilot"],
  ["/facebook/react", '#test-global-nav a[href="/explore"] span', "global-explore"],
  ["/facebook/react", '#test-global-nav a[href="/explore"]', "global-explore"],
  ["/facebook/react", '#test-global-nav a[href="/marketplace"] span', "global-marketplace"],
  ["/facebook/react", '#test-global-nav a[href="/mcp"] span', "global-mcp"],
  ["/facebook/react", "#test-global-nav h2", "top-repositories"],
  // Ett projekt i listan Top repositories ska visa projektlänken, inte @namn
  ["/facebook/react", '#test-global-nav a[href="/octocat/hello-world"] span', "repo-link"],
  // Plus-menyn
  ["/facebook/react", '#test-plus-menu a[href="/new"] span', "new-repository"],
  ["/facebook/react", '#test-plus-menu a[href="/new/import"]', "import-repository"],
  ["/facebook/react", '#test-plus-menu a[href="/codespaces/new"]', "new-codespace"],
  ["/facebook/react", '#test-plus-menu a[href="https://gist.github.com/"]', "new-gist"],
  ["/facebook/react", '#test-plus-menu a[href="/account/organizations/new"]', "new-organization"],
  ["/facebook/react", '#test-plus-menu a[href$="/issues/new/choose"]', "new-issue"],
  // Användarmenyn
  ["/facebook/react", '#test-user-menu a[href="https://github.com/octocat"] span', "your-profile"],
  ["/facebook/react", '#test-user-menu a[href$="tab=repositories"] span', "your-repositories"],
  ["/facebook/react", '#test-user-menu a[href$="tab=stars"] span', "your-stars"],
  ["/facebook/react", '#test-user-menu a[href="/settings/profile"]', "account-settings"],
  ["/facebook/react", '#test-user-menu a[href="/logout"]', "sign-out"],
  // Flikarna
  ["/facebook/react", "#code-tab span", "tab-code"],
  ["/facebook/react", "#issues-tab .Counter", "tab-issues"],
  ["/facebook/react", "#pull-requests-tab", "tab-pulls"],
  ["/facebook/react", "#actions-tab", "tab-actions"],
  ["/facebook/react", "#projects-tab", "tab-projects"],
  ["/facebook/react", "#wiki-tab", "tab-wiki"],
  ["/facebook/react", "#security-tab", "tab-security"],
  ["/facebook/react", "#insights-tab", "tab-insights"],
  ["/facebook/react", "#settings-tab", "tab-settings"],
  ["/facebook/react", "#discussions-tab", "tab-discussions"],
  ["/facebook/react", 'button[aria-label="Additional navigation options"]', "more-tabs"],
  // Star, Fork, Watch
  ["/facebook/react", "#repo-stars-counter-star", "star"],
  ["/facebook/react", 'button[aria-label="Add this repository to a list"]', "star-list"],
  ["/facebook/react", "#repo-network-counter", "fork"],
  ["/facebook/react", 'a[aria-label="You must be signed in to change notification settings"]', "watch"],
  ["/facebook/react", 'a[aria-label="Sponsor @facebook"] span', "sponsor"],
  // Filer
  ["/facebook/react", "#ref-picker-repos-header-ref-selector span span", "branch-picker"],
  ["/facebook/react", 'a[href="/facebook/react/branches"]', "branches"],
  ["/facebook/react", 'a[href="/facebook/react/tags"]', "tags"],
  ["/facebook/react", "#test-go-to-file", "go-to-file"],
  ["/facebook/react", "button[aria-haspopup] >> text=Add file", "add-file"],
  ["/facebook/react", '#test-add-file-menu a[href$="/new/main"]', "create-new-file"],
  ["/facebook/react", '#test-add-file-menu a[href$="/upload/main"]', "upload-files"],
  ["/facebook/react", 'button[aria-label="Open more actions menu"]', "more-actions"],
  // Den gröna Code-knappen och menyn
  ["/facebook/react", "#code-button-test span[data-component=text]", "code-button"],
  ["/facebook/react", "#local-panel-tab", "code-local"],
  ["/facebook/react", "#test-code-menu >> role=tab[name='Codespaces']", "code-codespaces"],
  ["/facebook/react", "#test-code-menu >> role=tab[name='HTTPS']", "code-https"],
  ["/facebook/react", "#test-code-menu >> role=tab[name='SSH']", "code-ssh"],
  ["/facebook/react", "#test-code-menu >> role=tab[name='GitHub CLI']", "code-cli"],
  ["/facebook/react", 'input[aria-label="Repository URL"]', "code-clone-url"],
  ["/facebook/react", 'button[aria-label="Copy url to clipboard"]', "copy-url"],
  ["/facebook/react", "#test-code-menu >> text=Open with GitHub Desktop", "open-desktop"],
  ["/facebook/react", "#test-code-menu >> text=Download ZIP", "download-zip"],
  ["/facebook/react", "#test-code-menu >> text=Create codespace on main", "code-create-codespace"],
  // Historik, innehåll och sidopanelen
  ["/facebook/react", 'a[href="/facebook/react/commits/main/"] span span', "commits"],
  ["/facebook/react", 'a[href="/facebook/react/commit/3f1c7a1b2e4d"]', "commit-link"],
  ["/facebook/react", 'a[href="/facebook/react/tree/main/packages"]', "folder-row"],
  ["/facebook/react", 'a[href="/facebook/react/blob/main/package.json"]', "file-row"],
  ["/facebook/react", '#readme a[href="#readme-ov-file"] span', "readme"],
  ["/facebook/react", 'a[href="#coc-ov-file"]', "code-of-conduct"],
  ["/facebook/react", 'a[href="#contributing-ov-file"]', "contributing"],
  ["/facebook/react", 'a[href="#MIT-1-ov-file"] span', "license"],
  ["/facebook/react", 'a[href="#security-ov-file"]', "security-policy"],
  ["/facebook/react", ".BorderGrid h2 >> text=About", "about"],
  ["/facebook/react", 'a[href="/topics/react"]', "topics"],
  ["/facebook/react", 'a[href="/facebook/react/releases"] .Counter', "releases"],
  ["/facebook/react", 'a[href="/facebook/react/releases/tag/v19.2.0"]', "releases"],
  ["/facebook/react", 'a[href="/facebook/react/graphs/contributors"]', "contributors"],
  ["/facebook/react", ".BorderGrid h2 >> text=Languages", "languages"],
  ["/facebook/react", 'a[href="/facebook/react/stargazers"] strong', "stargazers"],
  ["/facebook/react", 'a[href="/facebook/react/watchers"]', "watchers"],
  ["/facebook/react", 'a[href="/facebook/react/forks"]', "forks-count"],
  ["/facebook/react", 'a[href="/facebook/react/activity"] span', "activity"],
  ["/facebook/react", "text=Report repository", "report-repo"],
  ["/facebook/react", 'a[href="/facebook/react/network/dependents"]', "used-by"],
  ["/facebook/react", "#test-far-right", "deployments"],
  ["/facebook/react", "a.author", "mention"],
  // Ska INTE visa något: vanlig text i README
  ["/facebook/react", "#test-readme-list-item", null],
  ["/facebook/react", ".markdown-body h1", null],

  // Issue-listan
  ["/facebook/react/issues", 'input[aria-label="Search Issues"]', "issues-filter"],
  ["/facebook/react/issues", 'main a[href="/facebook/react/labels"] span', "labels"],
  ["/facebook/react/issues", 'main a[href="/facebook/react/milestones"]', "milestones"],
  ["/facebook/react/issues", 'main a[href$="/issues/new/choose"] span', "new-issue"],
  ["/facebook/react/issues", "a[role=tab] >> text=Open", "list-open"],
  ["/facebook/react/issues", "a[role=tab] >> text=Closed", "list-closed"],
  ["/facebook/react/issues", 'main a[href="/facebook/react/compare"]', "new-pull"],

  // En issue
  ["/facebook/react/issues/30000", '[data-testid="issue-header"] button >> text=Edit', "edit-generic"],
  ["/facebook/react/issues/30000", '[data-testid="header-state"]', "state-badge"],
  ["/facebook/react/issues/30000", 'button[aria-label="All reactions"]', "reactions"],
  ["/facebook/react/issues/30000", 'button[aria-label="Add or remove reactions"]', "reactions"],
  ["/facebook/react/issues/30000", 'button[aria-label="Comment actions"]', "more-actions"],
  ["/facebook/react/issues/30000", "li[role=menuitem] >> text=Copy link", "copy-link"],
  ["/facebook/react/issues/30000", "li[role=menuitem] >> text=Quote reply", "quote-reply"],
  ["/facebook/react/issues/30000", "li[role=menuitem] >> text=Report content", "report-repo"],
  ["/facebook/react/issues/30000", "button[role=tab] >> text=Write", "write-tab"],
  ["/facebook/react/issues/30000", "button[role=tab] >> text=Preview", "preview"],
  ["/facebook/react/issues/30000", 'textarea[aria-label="Markdown value"]', "comment-box"],
  ["/facebook/react/issues/30000", ".ActionBar >> text=Close issue", "close-issue"],
  ["/facebook/react/issues/30000", '.ActionBar button[aria-label="More options"]', "close-options"],
  ["/facebook/react/issues/30000", ".ActionBar >> text=Comment", "comment"],
  ["/facebook/react/issues/30000", 'button[aria-label="Edit Assignees"]', "assignees"],
  ["/facebook/react/issues/30000", ".Layout-sidebar h3 >> text=Assignees", "assignees"],
  ["/facebook/react/issues/30000", 'button[aria-label="Edit Labels"]', "labels"],
  ["/facebook/react/issues/30000", ".Layout-sidebar h3 >> text=Type", "issue-type"],
  ["/facebook/react/issues/30000", ".Layout-sidebar h3 >> text=Projects", "tab-projects"],
  ["/facebook/react/issues/30000", ".Layout-sidebar h3 >> text=Milestone", "milestones"],
  ["/facebook/react/issues/30000", ".Layout-sidebar h3 >> text=Relationships", "relationships"],
  ["/facebook/react/issues/30000", 'button[aria-label="Link a branch, pull request, or commit"]', "development"],
  ["/facebook/react/issues/30000", ".Layout-sidebar button >> text=Create a branch", "create-branch"],
  ["/facebook/react/issues/30000", ".Layout-sidebar button >> text=Subscribe", "subscribe"],
  ["/facebook/react/issues/30000", ".Layout-sidebar h3 >> text=Participants", "participants"],
  ["/facebook/react/issues/30000", "text=Lock conversation", "lock"],
  ["/facebook/react/issues/30000", "text=Pin issue", "pin-issue"],
  ["/facebook/react/issues/30000", "text=Transfer issue", "transfer-issue"],
  ["/facebook/react/issues/30000", "text=Delete issue", "delete-issue"],
  ["/facebook/react/issues/30000", ".markdown-body p", null],

  // En pull request
  ["/facebook/react/pull/31000", 'button[aria-label="Edit Pull Request title"]', "edit-generic"],
  ["/facebook/react/pull/31000", ".gh-header-actions summary", "code-button"],
  ["/facebook/react/pull/31000", ".State", "state-badge"],
  ["/facebook/react/pull/31000", "clipboard-copy.js-copy-branch", "copy-branch"],
  ["/facebook/react/pull/31000", ".tabnav-tabs a >> text=Conversation", "pr-conversation"],
  ["/facebook/react/pull/31000", "#commits_tab_counter", "pr-commits"],
  ["/facebook/react/pull/31000", ".tabnav-tabs a >> text=Checks", "pr-checks"],
  ["/facebook/react/pull/31000", "#files_tab_counter", "pr-files"],
  ["/facebook/react/pull/31000", "text=Merge pull request", "merge"],
  ["/facebook/react/pull/31000", 'summary[aria-label="Select merge method"]', "merge-method"],
  ["/facebook/react/pull/31000", "text=Squash and merge", "squash-merge"],
  ["/facebook/react/pull/31000", "text=Rebase and merge", "rebase-merge"],
  ["/facebook/react/pull/31000", "text=Create a merge commit", "squash-merge"],
  ["/facebook/react/pull/31000", "text=Confirm merge", "confirm-merge"],
  ["/facebook/react/pull/31000", "text=Enable auto-merge", "auto-merge"],
  ["/facebook/react/pull/31000", "text=Update branch", "update-branch"],
  ["/facebook/react/pull/31000", "text=Ready for review", "ready-for-review"],
  ["/facebook/react/pull/31000", "text=Resolve conversation", "resolve-conversation"],
  ["/facebook/react/pull/31000", "text=Delete branch", "delete-branch"],
  ["/facebook/react/pull/31000", ".timeline-comment-actions >> text=Revert", "revert"],
  ["/facebook/react/pull/31000", "text=Close pull request", "close-pull"],
  ["/facebook/react/pull/31000", ".js-comment-form-actions >> text=Comment", "comment"],
  ["/facebook/react/pull/31000", "#new_comment_field", "comment-box"],
  ["/facebook/react/pull/31000", "summary >> text=Review changes", "review-changes"],
  ["/facebook/react/pull/31000", "#test-approve", "approve"],
  ["/facebook/react/pull/31000", "#test-request-changes", "request-changes"],
  ["/facebook/react/pull/31000", "text=Submit review", "review-changes"],
  ["/facebook/react/pull/31000", ".pr-toolbar >> text=Unified", "diff-unified"],
  ["/facebook/react/pull/31000", ".pr-toolbar >> text=Split", "diff-split"],
  ["/facebook/react/pull/31000", "text=Hide whitespace", "hide-whitespace"],
  ["/facebook/react/pull/31000", ".js-reviewed-toggle", "viewed"],
  ["/facebook/react/pull/31000", "text=Start a review", "start-review"],
  ["/facebook/react/pull/31000", "text=Add single comment", "single-comment"],
  ["/facebook/react/pull/31000", 'summary[aria-label="Request a review"]', "reviewers"],
  ["/facebook/react/pull/31000", ".discussion-sidebar summary >> text=Assignees", "assignees"],
  ["/facebook/react/pull/31000", ".discussion-sidebar summary >> text=Labels", "labels"],
  ["/facebook/react/pull/31000", ".discussion-sidebar summary >> text=Milestone", "milestones"],
  ["/facebook/react/pull/31000", ".discussion-sidebar summary >> text=Development", "development"],
  ["/facebook/react/pull/31000", ".discussion-sidebar >> text=Unsubscribe", "subscribe"],
  ["/facebook/react/pull/31000", ".discussion-sidebar-heading >> text=participants", "participants"]
];

async function bubbleState(page) {
  return page.evaluate(() => {
    const host = document.getElementById("gfd-host");
    if (!host || !host.shadowRoot) return { shown: false };
    const b = host.shadowRoot.querySelector(".bubble");
    const r = b.getBoundingClientRect();
    return {
      shown: b.classList.contains("show"),
      key: b.getAttribute("data-key"),
      name: host.shadowRoot.querySelector(".name").textContent,
      text: host.shadowRoot.querySelector(".text").textContent,
      rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
      vw: document.documentElement.clientWidth,
      vh: document.documentElement.clientHeight,
      bg: getComputedStyle(b).backgroundColor
    };
  });
}

async function park(page) {
  // Flytta musen till en tom plats och vänta tills bubblan är borta.
  await page.mouse.move(2, 400);
  await page.waitForTimeout(80);
}

async function main() {
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "gfd-test-"));
  const context = await chromium.launchPersistentContext(userDir, {
    channel: "chromium",
    headless: true,
    viewport: { width: 1280, height: 900 },
    args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`]
  });

  await context.route("https://github.com/**", (route) => {
    const url = new URL(route.request().url());
    const file = PAGES[url.pathname.replace(/\/$/, "")];
    if (!file) return route.fulfill({ status: 404, body: "not found" });
    const html = fs.readFileSync(path.join(FIX, file), "utf8").replace("<!--HEADER-->", HEADER);
    return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: html });
  });

  let sw = context.serviceWorkers()[0];
  const page = await context.newPage();
  const results = [];
  let current = null;

  for (const [url, selector, expected] of CASES) {
    if (url !== current) {
      await page.goto("https://github.com" + url);
      await page.waitForFunction(() => !!document.getElementById("gfd-host") || document.readyState === "complete");
      await page.waitForTimeout(300);
      current = url;
    }
    await park(page);
    let got = null;
    let err = null;
    try {
      const loc = page.locator(selector).first();
      await loc.scrollIntoViewIfNeeded({ timeout: 2000 });
      await park(page);
      await loc.hover({ timeout: 2000, force: true });
      await page.waitForTimeout(650);
      const st = await bubbleState(page);
      got = st.shown ? st.key : null;
    } catch (e) {
      err = e.message.split("\n")[0];
    }
    const ok = !err && got === expected;
    results.push({ ok, url, selector, expected, got, err });
  }

  // ---- Beteende ----
  const behaviour = [];
  async function check(name, fn) {
    try {
      const r = await fn();
      behaviour.push({ name, ok: r === true, info: r === true ? "" : String(r) });
    } catch (e) {
      behaviour.push({ name, ok: false, info: e.message.split("\n")[0] });
    }
  }

  await page.goto("https://github.com/facebook/react");
  await page.waitForTimeout(300);

  await check("Bubblan väntar ungefär en halv sekund", async () => {
    await park(page);
    await page.hover("#issues-tab");
    await page.waitForTimeout(250);
    const early = await bubbleState(page);
    await page.waitForTimeout(450);
    const late = await bubbleState(page);
    return !early.shown && late.shown ? true : `efter 250 ms: ${early.shown}, efter 700 ms: ${late.shown}`;
  });

  await check("Bubblan försvinner när musen går därifrån", async () => {
    await page.hover("#issues-tab");
    await page.waitForTimeout(700);
    await park(page);
    const st = await bubbleState(page);
    return !st.shown ? true : "syns fortfarande";
  });

  await check("Esc stänger bubblan och den kommer inte tillbaka direkt", async () => {
    await park(page);
    await page.hover("#pull-requests-tab");
    await page.waitForTimeout(700);
    const before = await bubbleState(page);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    const after = await bubbleState(page);
    await page.mouse.move((await page.locator("#pull-requests-tab").boundingBox()).x + 5, (await page.locator("#pull-requests-tab").boundingBox()).y + 5);
    await page.waitForTimeout(700);
    const again = await bubbleState(page);
    return before.shown && !after.shown && !again.shown ? true : `före ${before.shown}, efter ${after.shown}, igen ${again.shown}`;
  });

  await check("Bubblan håller sig inom skärmen (höger kant)", async () => {
    await park(page);
    await page.evaluate(() => {
      const a = document.getElementById("test-far-right");
      a.style.position = "fixed";
      a.style.right = "0px";
      a.style.top = "300px";
    });
    await page.hover("#test-far-right");
    await page.waitForTimeout(700);
    const st = await bubbleState(page);
    return st.shown && st.rect.left >= 0 && st.rect.right <= st.vw && st.rect.top >= 0 && st.rect.bottom <= st.vh ? true : JSON.stringify(st.rect) + " vw=" + st.vw;
  });

  await check("Bubblan håller sig inom skärmen (nederkant)", async () => {
    await park(page);
    await page.evaluate(() => {
      const a = document.getElementById("test-far-right");
      a.style.top = "auto";
      a.style.bottom = "0px";
    });
    await page.hover("#test-far-right");
    await page.waitForTimeout(700);
    const st = await bubbleState(page);
    return st.shown && st.rect.bottom <= st.vh && st.rect.top >= 0 ? true : JSON.stringify(st.rect) + " vh=" + st.vh;
  });

  await check("Bubblan har sub.stnc® Dark-bakgrund (svart)", async () => {
    const st = await bubbleState(page);
    return st.bg === "rgb(0, 0, 0)" ? true : st.bg;
  });

  await check("GitHubs CSS påverkar inte bubblan (Shadow DOM)", async () => {
    await page.addStyleTag({ content: "div, span { color: red !important; font-family: serif !important; background: yellow !important; line-height: 3 !important; }" });
    await park(page);
    await page.hover("#wiki-tab");
    await page.waitForTimeout(700);
    const color = await page.evaluate(() => {
      const s = document.getElementById("gfd-host").shadowRoot.querySelector(".text");
      const cs = getComputedStyle(s);
      return cs.color + " " + cs.fontSize;
    });
    return color === "rgb(255, 255, 255) 15px" ? true : color;
  });

  // På/av via popup-rutan
  if (!sw) sw = await context.waitForEvent("serviceworker", { timeout: 3000 }).catch(() => null);
  let extId = null;
  await check("På/av-knappen stänger av bubblorna och valet sparas", async () => {
    const tmp = await context.newPage();
    await tmp.goto("chrome://extensions/");
    extId = await tmp.evaluate(async () => {
      const list = await new Promise((res) => chrome.management.getAll(res));
      const me = list.find((e) => e.name === "GitHub-for-dummies");
      return me && me.id;
    }).catch(() => null);
    await tmp.close();
    if (!extId) return "hittade inte tilläggets id";
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extId}/popup.html`);
    await popup.waitForTimeout(200);
    const startText = await popup.textContent("#status");
    await popup.click("label.row");
    await popup.waitForTimeout(200);
    const offText = await popup.textContent("#status");

    await page.bringToFront();
    await park(page);
    await page.hover("#actions-tab");
    await page.waitForTimeout(700);
    const whenOff = await bubbleState(page);

    await popup.reload();
    await popup.waitForTimeout(200);
    const stillOff = !(await popup.isChecked("#toggle"));
    await popup.click("label.row");
    await popup.waitForTimeout(200);
    await popup.close();

    await park(page);
    await page.hover("#actions-tab");
    await page.waitForTimeout(700);
    const whenOn = await bubbleState(page);
    const ok = startText.includes("på") && offText.includes("av") && !whenOff.shown && stillOff && whenOn.shown;
    return ok ? true : JSON.stringify({ startText, offText, off: whenOff.shown, stillOff, on: whenOn.shown });
  });

  // Skärmdumpar
  const shots = path.join(ROOT, "tests", "screenshots");
  async function shotAround(target, file) {
    await park(page);
    await page.locator(target).first().scrollIntoViewIfNeeded();
    await park(page);
    await page.hover(target);
    await page.waitForTimeout(700);
    const st = await bubbleState(page);
    if (!st.shown) {
      console.log("  (ingen bubbla för skärmdump " + file + ")");
      return;
    }
    const el = await page.locator(target).first().boundingBox();
    const x = Math.max(0, Math.min(st.rect.left, el.x) - 30);
    const y = Math.max(0, Math.min(st.rect.top, el.y) - 30);
    const r = Math.min(st.vw, Math.max(st.rect.right, el.x + el.width) + 30);
    const b = Math.min(st.vh, Math.max(st.rect.bottom, el.y + el.height) + 30);
    await page.screenshot({ path: path.join(shots, file), clip: { x, y, width: r - x, height: b - y } });
  }
  fs.mkdirSync(shots, { recursive: true });
  await page.goto("https://github.com/facebook/react");
  await page.waitForTimeout(300);
  await shotAround("#fork-button", "repo-fork.png");
  await shotAround("#code-button-test", "repo-code-button.png");
  await page.goto("https://github.com/facebook/react/pull/31000");
  await page.waitForTimeout(300);
  await shotAround("text=Merge pull request", "pr-merge.png");
  if (extId) {
    const popup = await context.newPage();
    await popup.setViewportSize({ width: 300, height: 330 });
    await popup.goto(`chrome-extension://${extId}/popup.html`);
    await popup.waitForTimeout(200);
    await popup.screenshot({ path: path.join(shots, "popup.png") });
    await popup.close();
  }

  await context.close();

  // ---- Rapport ----
  const failed = results.filter((r) => !r.ok);
  const matchedKeys = new Set(results.filter((r) => r.ok && r.got).map((r) => r.got));
  console.log(`\nHovringstester: ${results.length - failed.length}/${results.length} rätt`);
  for (const f of failed) console.log(`  FEL  ${f.url}  ${f.selector}  väntade=${f.expected} fick=${f.got}${f.err ? "  (" + f.err + ")" : ""}`);
  console.log(`Olika förklaringar som testats och fungerar: ${matchedKeys.size}`);
  console.log("\nBeteende:");
  for (const b of behaviour) console.log(`  ${b.ok ? "OK " : "FEL"}  ${b.name}${b.info ? "  (" + b.info + ")" : ""}`);
  fs.writeFileSync(path.join(ROOT, "tests", "last-result.json"), JSON.stringify({ results, behaviour, keys: [...matchedKeys] }, null, 2));
  process.exit(failed.length || behaviour.some((b) => !b.ok) ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
