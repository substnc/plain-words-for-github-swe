/*
 * GitHub-for-dummies: pratbubblan.
 *
 * Lyssnar på var musen är på github.com. När musen har stått still över
 * något vi har en förklaring till i ungefär en halv sekund, visas en
 * pratbubbla. Bubblan ligger i en Shadow DOM så att GitHubs utseende inte
 * påverkar den.
 */
(function () {
  "use strict";

  if (window.__gfdLoaded) return;
  window.__gfdLoaded = true;

  // Safari använder "browser", Chrome använder "chrome".
  var api = typeof browser !== "undefined" && browser && browser.storage ? browser : chrome;

  var SHOW_DELAY_MS = 500;
  var MAX_DEPTH = 8;
  var MAX_TEXT_LENGTH = 60;
  var GAP = 10;
  var EDGE = 8;

  var INTERACTIVE =
    'a[href], button, summary, input, select, textarea, label, h2, h3, h4, li, span, div[role], ' +
    '[role="button"], [role="tab"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], ' +
    '[role="option"], [role="link"], [role="switch"], [role="checkbox"], [role="radio"], [tabindex], ' +
    '.discussion-sidebar-heading, [class*="sidebar-heading"], [class*="SidebarHeading"]';

  var STRATEGIES = ["ids", "aria", "href", "selectors", "texts"];

  // Text som folk själva har skrivit (README, kommentarer, kod). Där jämför vi inte knapptext.
  var USER_CONTENT = ".markdown-body, .comment-body, .blob-code, .react-code-lines, .react-blob-print-hide, .js-file-line-container, textarea";

  var enabled = true;
  var entries = prepareEntries(globalThis.GFD_EXPLANATIONS || []);

  var currentEl = null;
  var currentEntry = null;
  var suppressedEl = null;
  var timer = null;
  var visible = false;

  /* ---------- Hjälpfunktioner för text ---------- */

  // Tar bort siffror som "165k", "1,234", "51.5k" och "(8)" och gör allt till små bokstäver.
  function normalize(value) {
    if (!value) return "";
    return String(value)
      .replace(/\d[\d.,]*\s?[kmb]?(?![a-z])/gi, " ")
      .replace(/[()[\]{}·•|:]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function matchesAny(value, patterns) {
    if (!value || !patterns) return false;
    for (var i = 0; i < patterns.length; i++) {
      var p = patterns[i];
      if (p instanceof RegExp) {
        if (p.test(value)) return true;
      } else if (value === p) {
        return true;
      }
    }
    return false;
  }

  function safeClosest(el, selector) {
    try {
      return !!el.closest(selector);
    } catch (e) {
      return false;
    }
  }

  function safeMatches(el, selector) {
    try {
      return el.matches(selector);
    } catch (e) {
      return false;
    }
  }

  // Förklaringar med fler villkor provas först, eftersom de är mer exakta.
  function prepareEntries(list) {
    return list
      .map(function (entry, index) {
        var score = (entry.within ? 4 : 0) + (entry.page ? 2 : 0) + (entry.notWithin ? 1 : 0);
        return { entry: entry, score: score, index: index };
      })
      .sort(function (a, b) {
        return b.score - a.score || a.index - b.index;
      })
      .map(function (x) {
        return x.entry;
      });
  }

  /* ---------- Läs av ett element ---------- */

  function visibleText(el) {
    var text = el.innerText !== undefined ? el.innerText : el.textContent;
    if (!text || text.length > 200) text = el.textContent || "";
    return text;
  }

  function readElement(el) {
    var tag = el.tagName.toLowerCase();
    var info = { tag: tag, id: el.id || "", aria: [], path: null, text: null };

    ["aria-label", "title", "placeholder", "data-tooltip", "alt"].forEach(function (attr) {
      var v = el.getAttribute(attr);
      if (v) info.aria.push(normalize(v));
    });

    var href = el.getAttribute("href");
    if (href && href.charAt(0) !== "#" && href.indexOf("javascript:") !== 0) {
      try {
        var url = new URL(href, location.href);
        // Länkar med filter (till exempel ?q=is:open) är inte samma sak som själva fliken.
        var sameSite = url.hostname === "github.com" || url.hostname === location.hostname;
        if (sameSite && !url.search) info.path = url.pathname;
      } catch (e) {
        /* ogiltig adress, hoppa över */
      }
    }

    if (safeMatches(el, INTERACTIVE)) {
      var raw = visibleText(el);
      if (raw && raw.length <= 200) {
        var t = normalize(raw);
        if (t && t.length <= MAX_TEXT_LENGTH) info.text = t;
      }
      if (!info.text && (tag === "input" || tag === "textarea")) {
        info.text = normalize(el.value && el.type === "submit" ? el.value : "");
      }
    }
    return info;
  }

  function constraintsOk(entry, el, strategy, info) {
    if (entry.page && !entry.page.test(location.pathname)) return false;
    if (entry.within && !safeClosest(el, entry.within)) return false;
    if (entry.notWithin && safeClosest(el, entry.notWithin)) return false;
    if (strategy === "texts" && entry.tags && entry.tags.indexOf(info.tag) === -1) {
      // Tillåt också element som beter sig som knappar eller flikar.
      var role = (el.getAttribute("role") || "").toLowerCase();
      var roleTag = role === "tab" || role === "menuitem" || role === "menuitemradio" || role === "option" ? "li" : role === "button" ? "button" : role === "link" ? "a" : "";
      if (!roleTag || entry.tags.indexOf(roleTag) === -1) return false;
    }
    return true;
  }

  function strategyMatches(entry, strategy, el, info) {
    switch (strategy) {
      case "ids":
        return !!info.id && matchesAny(info.id, entry.ids);
      case "aria":
        if (!entry.aria) return false;
        for (var i = 0; i < info.aria.length; i++) {
          if (matchesAny(info.aria[i], entry.aria)) return true;
        }
        return false;
      case "href":
        return !!info.path && matchesAny(info.path, entry.href);
      case "selectors":
        if (!entry.selectors) return false;
        for (var j = 0; j < entry.selectors.length; j++) {
          if (safeMatches(el, entry.selectors[j])) return true;
        }
        return false;
      case "texts":
        return !!info.text && matchesAny(info.text, entry.texts);
    }
    return false;
  }

  function matchElement(el) {
    var info = readElement(el);
    if (info.text && safeClosest(el, USER_CONTENT)) info.text = null;
    for (var s = 0; s < STRATEGIES.length; s++) {
      var strategy = STRATEGIES[s];
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (!entry[strategy]) continue;
        if (!strategyMatches(entry, strategy, el, info)) continue;
        if (!constraintsOk(entry, el, strategy, info)) continue;
        return entry;
      }
    }
    return null;
  }

  // Börjar vid det musen pekar på och går utåt tills något känns igen.
  function findMatch(target) {
    var el = target && target.nodeType === 1 ? target : target && target.parentElement;
    for (var depth = 0; el && depth < MAX_DEPTH; depth++) {
      if (el === document.body || el === document.documentElement) break;
      if (el === host) return null;
      var entry = matchElement(el);
      if (entry) return { el: el, entry: entry };
      el = el.parentElement;
    }
    return null;
  }

  /* ---------- Pratbubblan ---------- */

  var host = document.createElement("div");
  host.id = "gfd-host";
  host.setAttribute("aria-hidden", "true");
  var shadow = host.attachShadow({ mode: "open" });
  // Utseende: sub.stnc® Dark (svart bakgrund, vit text, grå etikett, Helvetica Neue, 16px rundning).
  shadow.innerHTML =
    "<style>" +
    ":host{all:initial;}" +
    ".bubble{position:fixed;top:0;left:0;z-index:2147483647;box-sizing:border-box;" +
    "max-width:min(320px,calc(100vw - 16px));padding:14px 16px;border-radius:16px;" +
    "background:#000000;color:#ffffff;border:1px solid #26282b;box-shadow:none;pointer-events:none;" +
    "font:400 15px/22px 'Helvetica Neue',Helvetica,Arial,sans-serif;letter-spacing:0;" +
    "text-align:left;white-space:normal;overflow-wrap:break-word;opacity:0;visibility:hidden;" +
    "transition:opacity .12s ease;}" +
    ".bubble.show{opacity:1;visibility:visible;}" +
    ".name{display:block;font-weight:400;font-size:13px;line-height:18px;color:#7f7f7f;margin:0 0 8px;}" +
    ".text{display:block;margin:0;font-weight:400;}" +
    "@media (prefers-reduced-motion:reduce){.bubble{transition:none;}}" +
    "</style>" +
    '<div class="bubble" role="tooltip"><span class="name"></span><span class="text"></span></div>';

  var bubble = shadow.querySelector(".bubble");
  var nameEl = shadow.querySelector(".name");
  var textEl = shadow.querySelector(".text");

  function attachHost() {
    if (!host.isConnected) (document.body || document.documentElement).appendChild(host);
  }

  function place(el) {
    var r = el.getBoundingClientRect();
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var vh = document.documentElement.clientHeight || window.innerHeight;
    var b = bubble.getBoundingClientRect();
    var w = b.width;
    var h = b.height;

    var left = r.left + r.width / 2 - w / 2;
    left = Math.max(EDGE, Math.min(left, vw - w - EDGE));

    var top = r.bottom + GAP;
    if (top + h > vh - EDGE) {
      var above = r.top - GAP - h;
      top = above >= EDGE ? above : Math.max(EDGE, vh - h - EDGE);
    }
    bubble.style.left = Math.round(left) + "px";
    bubble.style.top = Math.round(top) + "px";
  }

  function show(el, entry) {
    if (!enabled || !el.isConnected) return;
    attachHost();
    nameEl.textContent = entry.name;
    textEl.textContent = entry.text;
    bubble.setAttribute("data-key", entry.key);
    bubble.classList.remove("show");
    bubble.style.left = "0px";
    bubble.style.top = "0px";
    place(el);
    bubble.classList.add("show");
    visible = true;
  }

  function hide() {
    clearTimeout(timer);
    timer = null;
    if (visible) {
      bubble.classList.remove("show");
      bubble.removeAttribute("data-key");
      visible = false;
    }
  }

  function reset() {
    hide();
    currentEl = null;
    currentEntry = null;
  }

  /* ---------- Musen och tangentbordet ---------- */

  function onMouseOver(event) {
    if (!enabled) return;
    var found = findMatch(event.target);
    if (!found) {
      suppressedEl = null;
      reset();
      return;
    }
    if (found.el === currentEl) return;
    if (found.el === suppressedEl) return;
    suppressedEl = null;
    reset();
    currentEl = found.el;
    currentEntry = found.entry;
    timer = setTimeout(function () {
      timer = null;
      if (currentEl === found.el) show(found.el, found.entry);
    }, SHOW_DELAY_MS);
  }

  function onMouseOut(event) {
    if (!currentEl) return;
    var to = event.relatedTarget;
    if (!to || !currentEl.contains(to)) {
      reset();
      if (!to) suppressedEl = null;
    }
  }

  function onKeyDown(event) {
    if (event.key === "Escape" || event.key === "Esc") {
      if (currentEl) suppressedEl = currentEl;
      reset();
    }
  }

  function onPress() {
    if (currentEl) suppressedEl = currentEl;
    reset();
  }

  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("mouseout", onMouseOut, true);
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("mousedown", onPress, true);
  window.addEventListener(
    "scroll",
    function (event) {
      // Bara när en synlig bubbla pekar på något som faktiskt flyttas.
      var t = event.target;
      if (!currentEl || !visible) return;
      if (t === document || t === window || t === document.documentElement || (t.contains && t.contains(currentEl))) reset();
    },
    true
  );
  window.addEventListener("blur", reset);
  window.addEventListener("resize", reset);
  // GitHub byter sida utan att ladda om. Då ska bubblan bort.
  document.addEventListener("turbo:load", reset);
  window.addEventListener("popstate", reset);

  /* ---------- På/av-knappen ---------- */

  function setEnabled(value) {
    enabled = value !== false;
    if (!enabled) reset();
  }

  function readSetting() {
    try {
      var result = api.storage.local.get({ enabled: true }, function (items) {
        if (items) setEnabled(items.enabled);
      });
      if (result && typeof result.then === "function") {
        result.then(function (items) {
          if (items) setEnabled(items.enabled);
        });
      }
    } catch (e) {
      try {
        api.storage.local.get({ enabled: true }).then(function (items) {
          setEnabled(items.enabled);
        });
      } catch (e2) {
        /* kan inte läsa inställningen, låt den vara på */
      }
    }
  }

  try {
    api.storage.onChanged.addListener(function (changes, area) {
      if (area === "local" && changes.enabled) setEnabled(changes.enabled.newValue);
    });
  } catch (e) {
    /* ingen lagring tillgänglig */
  }
  readSetting();
})();
