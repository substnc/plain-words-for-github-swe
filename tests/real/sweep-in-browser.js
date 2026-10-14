/*
 * Svep i din egen webbläsare, inloggad.
 *
 * Kör det här i konsolen (Cmd + Alt + J i Chrome) på en sida på github.com,
 * med tillägget påslaget. Skriptet håller "musen" över varje knapp, flik, länk
 * och rubrik i tur och ordning med det riktiga tillägget, och listar allt som
 * inte fick någon förklaring. Det klickar aldrig på något.
 *
 * Öppna menyer (huvudmenyn, plus-menyn, profilmenyn, den gröna Code-knappen)
 * innan du kör, så kommer deras rader med.
 *
 * Resultatet hamnar i window.__gfdSweep när det är klart. Medan det körs visar
 * window.__gfdSweep.done hur långt det har kommit.
 */
(async function gfdSweep() {
  const SEL = 'a[href], button, summary, input, textarea, select, [role="tab"], [role="button"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"], [role="switch"], h2, h3, clipboard-copy';
  // Text som folk själva har skrivit, sidfoten och sådant som inte syns.
  const SKIP = 'footer, .footer, .markdown-body, .comment-body, .react-code-lines, .blob-code, .js-file-line-container, [data-testid="markdown-body"], .sr-only, [class*="VisuallyHidden"], [hidden], template, .diff-table, #gfd-host';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clean = (s, n) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);

  // Var på sidan elementet ligger, så att man hittar det igen.
  function where(el) {
    const parts = [];
    let cur = el.parentElement;
    while (cur && cur !== document.body && parts.length < 3) {
      const label = cur.getAttribute("aria-label");
      if (cur.id) parts.push("#" + cur.id);
      else if (label) parts.push(cur.tagName.toLowerCase() + '[aria-label="' + clean(label, 40) + '"]');
      else if (/^(nav|header|aside|main|dialog)$/i.test(cur.tagName)) parts.push(cur.tagName.toLowerCase());
      cur = cur.parentElement;
    }
    return parts.reverse().join(" > ");
  }

  const items = [];
  for (const el of document.querySelectorAll(SEL)) {
    if (el.closest(SKIP)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const parent = el.parentElement && el.parentElement.closest(SEL);
    if (parent && !parent.closest(SKIP)) continue;
    let label = el.getAttribute("aria-label") || el.getAttribute("title") || "";
    const lb = el.getAttribute("aria-labelledby");
    if (!label && lb) label = lb.split(/\s+/).map((id) => (document.getElementById(id) || {}).textContent || "").join(" ");
    items.push({
      el,
      tag: el.tagName.toLowerCase(),
      label: clean(label, 60),
      href: clean(el.getAttribute("href"), 80),
      text: clean(el.innerText || el.value || el.getAttribute("placeholder"), 50),
      where: where(el)
    });
  }

  const state = { page: location.pathname, total: items.length, done: 0, missing: [], found: {} };
  window.__gfdSweep = state;

  for (const it of items) {
    document.body.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(20);
    it.el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(560);
    const host = document.getElementById("gfd-host");
    const bubble = host && host.shadowRoot && host.shadowRoot.querySelector(".bubble");
    const key = bubble && bubble.classList.contains("show") ? bubble.getAttribute("data-key") : null;
    const row = { tag: it.tag, label: it.label, text: it.text, href: it.href, where: it.where };
    if (key) (state.found[key] = state.found[key] || []).push(row);
    else state.missing.push(row);
    state.done++;
  }
  document.body.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  state.finished = true;
  console.log(`GitHub-for-dummies: ${state.total - state.missing.length}/${state.total} med förklaring på ${state.page}`);
  console.table(state.missing);
  return state;
})();
