/*
 * GitHub-for-dummies: alla förklaringar.
 *
 * Varje förklaring har:
 *   key        en intern kod (används bara av programmet och testerna)
 *   name       vad saken heter på GitHub (visas fetstilt i pratbubblan)
 *   text       förklaringen på svenska, max två korta meningar
 *
 * Och ett eller flera sätt att känna igen saken på sidan. Programmet provar
 * dem i den här ordningen: ids, aria (aria-label, title, placeholder), href
 * (länkadressen), selectors (CSS) och sist texts (knapptexten).
 * Siffror som "165k" eller "1,234" tas bort från texten innan jämförelsen,
 * och allt jämförs med små bokstäver.
 *
 * Valfria begränsningar:
 *   tags       bara de här elementtyperna, t.ex. ["a"] eller ["button"]
 *   within     måste ligga inuti något som matchar den här CSS-väljaren
 *   notWithin  får inte ligga inuti något som matchar den här CSS-väljaren
 *   page       sidans adress (sökvägen) måste matcha det här mönstret
 */
(function () {
  // Första delen av adressen som INTE är ett projekt, t.ex. github.com/settings.
  var RESERVED =
    "(?!(?:settings|notifications|login|logout|signup|join|new|organizations|orgs|topics|marketplace|" +
    "explore|features|pulls|issues|search|sponsors|codespaces|dashboard|account|pricing|enterprise|" +
    "about|collections|trending|stars|watching|copilot|apps|security|site|contact|readme)/)";

  // Mönster för en adress inne i ett projekt: /ägare/projekt + resten.
  function repo(rest) {
    return new RegExp("^/" + RESERVED + "[^/]+/[^/]+" + (rest || "") + "/?$", "i");
  }
  function repoPrefix(rest) {
    return new RegExp("^/" + RESERVED + "[^/]+/[^/]+" + rest, "i");
  }

  var REPO_NAV = 'nav[aria-label="Repository"], .UnderlineNav, [data-pjax="#repo-content-pjax-container"], .js-repo-nav';
  var PR_TABS = '.tabnav-tabs, nav[aria-label="Pull request navigation"], nav[aria-label="Pull request navigation tabs"], [aria-label="Pull request tabs"], .js-pull-request-tabs';
  var FILE_TABLE = '[aria-labelledby="folders-and-files"], .react-directory-row, table[aria-labelledby], .js-navigation-container';
  var SEGMENTED = '[aria-label="File view"], .SegmentedControl, [class*="SegmentedControl"], segmented-control';
  var SIDEBAR = '.Layout-sidebar, .discussion-sidebar, [data-testid="sidebar-section"], [class*="SidebarSection"], [class*="sidebarSection"], [data-testid="issue-viewer-metadata-pane"], #partial-discussion-sidebar, aside';

  globalThis.GFD_EXPLANATIONS = [
    /* ---------------- Toppen av sidan (gäller överallt) ---------------- */
    {
      key: "search",
      name: "Sök",
      text: "Här söker du efter projekt, kod eller personer på hela GitHub. Tryck på snedstreck / på tangentbordet så hoppar du hit direkt.",
      aria: [/^search or jump to/, /^search github/],
      selectors: ['[data-target="qbsearch-input.inputButton"]', "qbsearch-input button", ".header-search-button"],
      texts: ["type / to search", "search or jump to", "search/"]
    },
    {
      key: "plus-menu",
      name: "Plus-menyn (Create new)",
      text: "Här skapar du något nytt, till exempel ett nytt projekt eller en ny issue (en lapp om något som ska fixas). Använd den när du vill starta något från början.",
      aria: ["create something new", "create new…", "create new...", "create new"]
    },
    {
      key: "notifications-bell",
      name: "Notiser (klockan)",
      text: "Klockan samlar allt som hänt i projekt du följer, till exempel nya svar till dig. En prick betyder att du har olästa notiser.",
      ids: ["AppHeader-notifications-button"],
      aria: [/unread notifications/, "notifications", "you have no unread notifications"],
      href: [/^\/notifications\/?$/],
      notWithin: ".pagehead-actions, #repository-details-container"
    },
    {
      key: "user-menu",
      name: "Din meny (profilbilden)",
      text: "Din egen meny med din profil, dina projekt och inställningar. Här loggar du också ut.",
      aria: ["open user navigation menu", "open user account menu", "view profile and more"]
    },
    {
      key: "global-menu",
      name: "Huvudmenyn",
      text: "Huvudmenyn med genvägar till startsidan, dina issues och dina pull requests (förslag på ändringar). Bra när du vill hoppa mellan saker snabbt.",
      aria: ["open global navigation menu", "open navigation menu", "toggle navigation", "close navigation menu", "global navigation menu"]
    },
    {
      key: "home-logo",
      name: "GitHub-loggan",
      text: "Tar dig tillbaka till din startsida på GitHub. Där ser du nyheter från projekt och personer du följer.",
      aria: ["homepage", "github homepage", "github"],
      selectors: ['a.AppHeader-logo', 'a.header-logo', 'a[data-hotkey="g d"]']
    },
    {
      key: "appearance",
      name: "Appearance settings",
      text: "Ändrar hur GitHub ser ut, till exempel mörkt eller ljust läge. Påverkar bara din skärm.",
      aria: ["appearance settings", "appearance"]
    },
    {
      key: "skip-to-content",
      name: "Skip to content",
      text: "Hoppar förbi menyerna direkt till sidans innehåll. Mest till hjälp för den som använder tangentbordet.",
      href: [],
      selectors: ['a[href="#start-of-content"]', "a.js-skip-to-content"],
      texts: ["skip to content"]
    },
    {
      key: "copilot",
      name: "Copilot",
      text: "Öppnar GitHubs AI-assistent som kan svara på frågor om kod. Bra när du inte förstår vad något i ett projekt gör.",
      aria: [/copilot/],
      texts: ["copilot", "ask copilot"]
    },
    {
      key: "your-issues",
      name: "Dina issues",
      text: "Visar alla issues som har med dig att göra, i alla projekt. En issue är en lapp om ett problem eller en idé som ska lösas.",
      aria: ["your issues"],
      href: [/^\/issues\/?$/]
    },
    {
      key: "your-pulls",
      name: "Dina pull requests",
      text: "Visar alla förslag på ändringar som du har gjort eller ska titta på. En pull request är när någon säger: kolla mina ändringar, vill ni lägga in dem?",
      aria: ["your pull requests"],
      href: [/^\/pulls\/?$/]
    },
    {
      key: "sign-in",
      name: "Sign in",
      text: "Logga in på ditt GitHub-konto. Du behöver vara inloggad för att till exempel ge stjärnor eller skriva kommentarer.",
      texts: ["sign in", "sign in to comment"],
      href: [/^\/login\/?$/],
      tags: ["a", "button"]
    },
    {
      key: "sign-up",
      name: "Sign up",
      text: "Skapa ett gratis konto på GitHub. Det behövs för att spara, kommentera och bidra till projekt.",
      texts: ["sign up", "sign up for free", "sign up for github"],
      href: [/^\/signup\/?$/, /^\/join\/?$/]
    },

    /* ---------------- Plus-menyn ---------------- */
    {
      key: "new-repository",
      name: "New repository",
      text: "Skapar ett nytt repo, alltså en projektmapp där kod och filer sparas tillsammans med hela sin historik. Börja här när du ska starta ett eget projekt.",
      texts: ["new repository", "create repository", "create a new repository"],
      href: [/^\/new\/?$/]
    },
    {
      key: "import-repository",
      name: "Import repository",
      text: "Flyttar in ett projekt som ligger någon annanstans till GitHub. Historiken följer med.",
      texts: ["import repository"],
      href: [/^\/new\/import\/?$/]
    },
    {
      key: "new-codespace",
      name: "New codespace",
      text: "Startar en dator i molnet där du kan skriva kod direkt i webbläsaren. Du behöver inte installera något.",
      texts: ["new codespace"],
      href: [/^\/codespaces\/new\/?$/]
    },
    {
      key: "new-gist",
      name: "New gist",
      text: "En gist är ett litet anteckningsblad för kodsnuttar som du kan dela med en länk. Bra för korta exempel.",
      texts: ["new gist"]
    },
    {
      key: "new-organization",
      name: "New organization",
      text: "Skapar en grupp där flera personer äger projekt tillsammans, som ett företag eller en klubb. Bra när ni är fler än en.",
      texts: ["new organization"],
      href: [/^\/account\/organizations\/new\/?$/, /^\/organizations\/plan\/?$/]
    },
    {
      key: "new-project",
      name: "New project",
      text: "Skapar en planeringstavla med lappar i kolumner, till exempel Att göra, Pågår och Klart. Bra för att hålla koll på jobbet.",
      texts: ["new project"]
    },

    /* ---------------- Din meny (profilbilden) ---------------- */
    {
      key: "your-profile",
      name: "Your profile",
      text: "Din egen sida som andra ser, med bild, beskrivning och dina projekt. Tänk det som ditt visitkort på GitHub.",
      texts: ["your profile", "profile"],
      tags: ["a", "li", "span", "button"]
    },
    {
      key: "your-repositories",
      name: "Your repositories",
      text: "En lista över alla dina projektmappar (repon). Här hittar du allt du har skapat eller kopierat.",
      texts: ["your repositories", "repositories"]
    },
    {
      key: "your-stars",
      name: "Your stars",
      text: "Alla projekt du har gett en stjärna, alltså sparat som favorit. Ett bra ställe att hitta tillbaka till saker du gillat.",
      texts: ["your stars", "stars"],
      notWithin: SIDEBAR + ", .BorderGrid"
    },
    {
      key: "account-settings",
      name: "Settings (ditt konto)",
      text: "Inställningar för ditt eget konto, som namn, bild, lösenord och vilka notiser du får. Påverkar inte projektens inställningar.",
      href: [/^\/settings(\/profile)?\/?$/]
    },
    {
      key: "sign-out",
      name: "Sign out",
      text: "Loggar ut dig från GitHub på den här datorn. Gör det på datorer som andra också använder.",
      texts: ["sign out"],
      href: [/^\/logout\/?$/]
    },

    /* ---------------- Projektets huvud (repo-sidan) ---------------- */
    {
      key: "tab-code",
      name: "Code",
      text: "Projektets startsida med alla filer och mappar. Här ser du själva koden och välkomsttexten.",
      selectors: ['a[data-tab-item="code"]', 'a[data-tab-item$="code-tab"]'],
      ids: ["code-tab"],
      href: [repo("(/tree/[^/]+)?")],
      texts: ["code"],
      tags: ["a"],
      within: REPO_NAV,
      notWithin: FILE_TABLE
    },
    {
      key: "tab-issues",
      name: "Issues",
      text: "Listan med frågor, felrapporter och idéer för projektet. En issue är som en lapp på anslagstavlan om något som ska fixas.",
      selectors: ['a[data-tab-item="issues"]', 'a[data-tab-item$="issues-tab"]'],
      ids: ["issues-tab"],
      href: [repo("/issues")],
      texts: ["issues"],
      tags: ["a", "li", "button"]
    },
    {
      key: "tab-pulls",
      name: "Pull requests",
      text: "Förslag på ändringar som väntar på att bli godkända. En pull request är när någon säger: titta på mina ändringar, vill ni lägga in dem?",
      selectors: ['a[data-tab-item="pull-requests"]', 'a[data-tab-item$="pull-requests-tab"]'],
      ids: ["pull-requests-tab"],
      href: [repo("/pulls")],
      texts: ["pull requests"],
      tags: ["a", "li", "button"]
    },
    {
      key: "tab-actions",
      name: "Actions",
      text: "Små robotar som automatiskt gör jobb åt projektet, till exempel testar koden varje gång något ändras. Grön bock betyder att det gick bra.",
      selectors: ['a[data-tab-item="actions"]', 'a[data-tab-item$="actions-tab"]'],
      ids: ["actions-tab"],
      href: [repo("/actions")],
      texts: ["actions"],
      tags: ["a", "li"]
    },
    {
      key: "tab-projects",
      name: "Projects",
      text: "Planeringstavlor där arbetet sorteras i kolumner, till exempel Att göra, Pågår och Klart. Bra för att se vem som gör vad.",
      selectors: ['a[data-tab-item="projects"]', 'a[data-tab-item$="projects-tab"]'],
      aria: ["select projects", "edit projects", "projects", "filter by projects", "filter by project"],
      ids: ["projects-tab"],
      href: [repo("/projects")],
      texts: ["projects", "project"],
      tags: ["a", "li", "button", "h2", "h3", "summary", "span"]
    },
    {
      key: "tab-wiki",
      name: "Wiki",
      text: "Projektets handbok med sidor som förklarar hur saker fungerar. Läs här när README-texten inte räcker.",
      selectors: ['a[data-tab-item="wiki"]', 'a[data-tab-item$="wiki-tab"]'],
      ids: ["wiki-tab"],
      href: [repo("/wiki")],
      texts: ["wiki"],
      tags: ["a", "li"]
    },
    {
      key: "tab-security",
      name: "Security",
      text: "Visar säkerhetsvarningar, till exempel om projektet använder en gammal del med kända hål. Här står också hur man rapporterar problem.",
      selectors: ['a[data-tab-item="security"]', 'a[data-tab-item$="security-tab"]', 'a[data-tab-item="security-and-quality"]'],
      ids: ["security-tab"],
      href: [repo("/security")],
      texts: ["security", "security and quality"],
      tags: ["a", "li"],
      notWithin: '.markdown-body, nav[aria-label="Repository files"]'
    },
    {
      key: "tab-insights",
      name: "Insights",
      text: "Statistik om projektet, till exempel hur många som jobbar i det och hur mycket som händer. Bra för att se om projektet lever.",
      selectors: ['a[data-tab-item="insights"]', 'a[data-tab-item$="insights-tab"]'],
      ids: ["insights-tab"],
      href: [repo("/pulse"), repo("/graphs")],
      texts: ["insights"],
      tags: ["a", "li"]
    },
    {
      key: "tab-settings",
      name: "Settings (projektet)",
      text: "Inställningar för projektet, som namn, vem som får vara med och vad som syns. Bara ägarna ser den här fliken.",
      selectors: ['a[data-tab-item="settings"]', 'a[data-tab-item$="settings-tab"]'],
      ids: ["settings-tab"],
      href: [repo("/settings")],
      texts: ["settings"],
      tags: ["a", "li"],
      within: REPO_NAV
    },
    {
      key: "tab-discussions",
      name: "Discussions",
      text: "Ett forum för frågor och idéer som inte är fel i koden. Här pratar man fritt i trådar, ungefär som i en chatt.",
      selectors: ['a[data-tab-item="discussions"]', 'a[data-tab-item$="discussions-tab"]'],
      ids: ["discussions-tab"],
      href: [repo("/discussions")],
      texts: ["discussions"],
      tags: ["a", "li"]
    },
    {
      key: "more-tabs",
      name: "Fler flikar",
      text: "Flikar som inte fick plats på skärmen ligger gömda här. Klicka för att se resten.",
      aria: ["more items", "more", "additional navigation options", "open more actions menu"],
      texts: ["more items", "more"],
      within: REPO_NAV + ', .AppHeader-localBar, nav[aria-label="Repository files"], [class*="UnderlineWrapper"]'
    },
    {
      key: "repo-name",
      name: "Projektets namn",
      text: "Namnet på projektet du tittar på. Klicka för att komma tillbaka till projektets startsida.",
      href: [repo("")],
      within: "nav[aria-label=\"Breadcrumbs\"], .AppHeader-context, .AppHeader-globalBar, [itemprop=\"name\"], #repository-container-header h1, .AppHeader-context-full"
    },
    {
      key: "owner-name",
      name: "Ägarens namn",
      text: "Personen eller gruppen som äger projektet. Klicka för att se deras andra projekt.",
      href: [/^\/[^/]+\/?$/],
      within: "nav[aria-label=\"Breadcrumbs\"], .AppHeader-context, .AppHeader-context-full, [itemprop=\"author\"], #repository-container-header h1"
    },
    {
      key: "star",
      name: "Star",
      text: "Sparar projektet bland dina favoriter och visar att du gillar det. Siffran visar hur många som har gjort samma sak.",
      aria: [/^star this repository/, /^unstar this repository/, "you must be signed in to star a repository", /^star /, /^unstar /],
      texts: ["star", "starred", "unstar"],
      tags: ["a", "button", "summary"]
    },
    {
      key: "star-list",
      name: "Stjärnlistor",
      text: "Lägg projektet i en egen lista bland dina favoriter, ungefär som en spellista. Bra när du har många stjärnor.",
      aria: ["add this repository to a list", /add .* to a list/, "lists"]
    },
    {
      key: "fork",
      name: "Fork",
      text: "Gör en egen kopia av hela projektet på ditt konto. Använd den när du vill ändra fritt utan att röra originalet.",
      ids: ["fork-button"],
      aria: [/^fork your own copy/, "you must be signed in to fork a repository"],
      href: [repo("/fork")],
      texts: ["fork"],
      tags: ["a", "button"]
    },
    {
      key: "fork-list",
      name: "Dina forks",
      text: "Visar om du redan har gjort en egen kopia av projektet. Härifrån kan du också skapa en ny.",
      aria: ["see your forks of this repository", /forks of this repository/]
    },
    {
      key: "watch",
      name: "Watch / Notifications",
      text: "Väljer hur mycket du vill höra om projektet, till exempel bara viktiga nyheter eller allt som händer. Notiserna hamnar i klockan uppe till höger.",
      aria: ["you must be signed in to change notification settings", /^watch/, /^unwatch/, /notification settings/],
      texts: ["watch", "unwatch", "notifications", "watching", "stop ignoring"],
      tags: ["a", "button", "summary"],
      notWithin: SIDEBAR
    },
    {
      key: "sponsor",
      name: "Sponsor",
      text: "Skickar pengar till dem som gör projektet, som ett tack. Helt frivilligt.",
      texts: ["sponsor"],
      aria: [/^sponsor/],
      tags: ["a", "button"]
    },
    {
      key: "pin",
      name: "Pin",
      text: "Fäster projektet på din profilsida så att besökare ser det först.",
      texts: ["pin", "unpin"],
      tags: ["button", "summary"]
    },
    {
      key: "edit-repo-details",
      name: "Ändra projektinfo (kugghjulet)",
      text: "Ändrar texten i About-rutan, som beskrivning, hemsida och ämnesord. Syns bara för ägarna.",
      aria: ["edit repository metadata", "edit repository details"]
    },

    /* ---------------- Filer och mappar ---------------- */
    {
      key: "branch-picker",
      name: "Branch-väljaren",
      text: "Visar vilken version av projektet du tittar på. En branch är en parallell version där man kan testa saker utan att röra huvudversionen.",
      ids: [/ref-picker/, /branch-picker/, /^branch-select-menu/],
      aria: [/^.+ branch$/, "switch branches or tags", /^switch branches/, /^change branch/, "branch"],
      selectors: ['[data-hotkey="w"]', 'summary[title="Switch branches or tags"]', 'button[aria-label$=" branch"]', '#branch-select-menu summary']
    },
    {
      key: "branches",
      name: "Branches",
      text: "Visar alla parallella versioner av projektet. En branch är som en kopia där man kan prova nya idéer i lugn och ro.",
      href: [repo("/branches(/[^/]+)?")],
      texts: ["branches", "branch"],
      tags: ["a", "button", "li"]
    },
    {
      key: "tags",
      name: "Tags",
      text: "Visar bokmärken på viktiga punkter i projektets historia, ofta en färdig version som 1.0. Bra för att hitta tillbaka till en viss version.",
      href: [repo("/tags")],
      texts: ["tags", "tag"],
      tags: ["a", "button", "li"]
    },
    {
      key: "go-to-file",
      name: "Go to file",
      text: "Söker fram en fil i projektet när du skriver en del av namnet. Snabbare än att klicka runt i mapparna.",
      aria: ["go to file", "go to file t", /^go to file/, "find file"],
      selectors: ['input[placeholder="Go to file"]', '[data-hotkey="t"]', '#file-tree-filter-field'],
      texts: ["go to file", "find file"]
    },
    {
      key: "add-file",
      name: "Add file",
      text: "Lägger till en ny fil eller laddar upp filer från din dator. Ändringen sparas som en commit, alltså en sparad punkt i historiken.",
      aria: ["add file", /^add file/],
      texts: ["add file"],
      tags: ["button", "summary", "a"]
    },
    {
      key: "create-new-file",
      name: "Create new file",
      text: "Skapar en tom fil direkt i webbläsaren som du kan skriva i. När du sparar blir det en commit, alltså en sparad punkt i historiken.",
      href: [repoPrefix("/new/")],
      texts: ["create new file", "new file"]
    },
    {
      key: "upload-files",
      name: "Upload files",
      text: "Laddar upp filer från din dator till projektet. Du kan dra in dem eller välja dem från en mapp.",
      href: [repoPrefix("/upload/")],
      texts: ["upload files", "upload file"]
    },
    {
      key: "more-actions",
      name: "Fler val (tre prickar)",
      text: "Fler val som inte fick plats, till exempel kopiera länken eller ladda ner. Klicka för att se dem.",
      aria: ["open more actions menu", "more options", "more file actions", "show more options", "more actions", "comment actions", "show options", "more items", "issue body actions", "pull request body actions", /^actions for .*comment/, /body actions$/],
      notWithin: REPO_NAV
    },

    /* ---------------- Den gröna Code-knappen och dess meny ---------------- */
    {
      key: "code-button",
      name: "Code (den gröna knappen)",
      text: "Visar hur du hämtar hem hela projektet till din dator. Härifrån kan du kopiera en adress eller ladda ner allt som en zip-fil.",
      ids: [/^code-button/, /get-repo/],
      selectors: ['get-repo summary', 'get-repo button', '[data-testid="code-button"]', '.js-get-repo-dropdown summary'],
      texts: ["code"],
      tags: ["button", "summary"],
      notWithin: SEGMENTED + ", " + REPO_NAV
    },
    {
      key: "code-local",
      name: "Local",
      text: "Visar sätt att hämta projektet till din egen dator. Vanligast är att kopiera adressen eller ladda ner en zip-fil.",
      texts: ["local"],
      tags: ["button", "a", "li", "span"]
    },
    {
      key: "code-codespaces",
      name: "Codespaces",
      text: "Öppnar projektet i en färdig dator i molnet, direkt i webbläsaren. Bra om du vill testa koden utan att installera något.",
      texts: ["codespaces", "codespace"],
      tags: ["button", "a", "li", "span"]
    },
    {
      key: "code-create-codespace",
      name: "Create codespace",
      text: "Startar en ny dator i molnet med projektet redan på plats. Du kan börja skriva kod direkt i webbläsaren.",
      texts: [/^create (a )?codespace( on .*)?$/],
      aria: [/^create (a )?codespace/]
    },
    {
      key: "code-https",
      name: "HTTPS",
      text: "En vanlig webbadress till projektet som du kan kopiera. Den fungerar oftast direkt utan extra inställningar.",
      texts: ["https"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "code-ssh",
      name: "SSH",
      text: "En adress som använder en hemlig nyckel på din dator i stället för lösenord. Kräver att du har lagt in nyckeln på ditt konto först.",
      texts: ["ssh"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "code-cli",
      name: "GitHub CLI",
      text: "Ett kommando till GitHubs eget program för terminalen, alltså fönstret där man skriver kommandon i stället för att klicka.",
      texts: ["github cli", "cli"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "code-clone-url",
      name: "Projektets adress",
      text: "Adressen du använder för att hämta en kopia av projektet till din dator. Det kallas att klona projektet.",
      aria: ["repository url", /clone url/, /^https url$/, /^ssh url$/],
      selectors: ['input[aria-label*="URL" i]', 'input#clone-with-https', 'input[data-autoselect]']
    },
    {
      key: "copy-url",
      name: "Kopiera",
      text: "Kopierar texten så att du kan klistra in den någon annanstans. Den hamnar i datorns urklipp.",
      aria: ["copy url to clipboard", "copy to clipboard", /^copy (?!head |branch ).*to clipboard$/, "copy", "copy path", "copy raw content", "copy raw file"],
      selectors: ["clipboard-copy"],
      notWithin: PR_TABS
    },
    {
      key: "open-desktop",
      name: "Open with GitHub Desktop",
      text: "Öppnar projektet i GitHub Desktop, ett vanligt program för datorn. Enklare än att skriva kommandon.",
      aria: ["open this file in github desktop", /in github desktop$/],
      texts: ["open with github desktop", "github desktop"]
    },
    {
      key: "open-visual-studio",
      name: "Open with Visual Studio",
      text: "Öppnar projektet direkt i kodprogrammet Visual Studio på din dator. Kräver att programmet är installerat.",
      texts: ["open with visual studio", "visual studio"]
    },
    {
      key: "download-zip",
      name: "Download ZIP",
      text: "Laddar ner hela projektet som en zip-fil, alltså en packad mapp. Bra om du bara vill titta, men du får inga uppdateringar.",
      href: [repoPrefix("/archive/")],
      texts: ["download zip"]
    },

    /* ---------------- Historik och innehåll ---------------- */
    {
      key: "commits",
      name: "Commits",
      text: "Visar historiken, alltså alla sparade ändringar i projektet. En commit är en sparad punkt med en kort text om vad som ändrades.",
      href: [repoPrefix("/commits(/|$)")],
      texts: ["commits", "commit", "history", /^commits on /],
      tags: ["a", "button", "h2", "h3"],
      notWithin: PR_TABS
    },
    {
      key: "commit-link",
      name: "En commit",
      text: "En sparad ändring i projektet. Klicka för att se exakt vad som ändrades, rad för rad.",
      href: [repoPrefix("/commit/[0-9a-f]{6,}"), repoPrefix("/pull/\\d+/commits/[0-9a-f]{6,}")],
      texts: ["latest commit"]
    },
    {
      key: "readme",
      name: "README",
      text: "Projektets välkomsttext som berättar vad det är och hur man använder det. Börja alltid läsa här.",
      selectors: ['a[href$="#readme-ov-file"]', 'a[href$="#readme"]', "#readme h2", "#readme-ov-file"],
      texts: ["readme", "readme.md"],
      tags: ["a", "h2", "h3", "button", "span", "li"],
      notWithin: FILE_TABLE
    },
    {
      key: "license",
      name: "License",
      text: "Licensen är reglerna för hur du får använda koden, till exempel om du får bygga vidare på den. Läs den innan du använder koden i eget arbete.",
      selectors: ['a[href*="-1-ov-file"]', 'a[href$="#license"]'],
      texts: ["license", /^[a-z0-9.\- ]+ license$/, "view license"],
      tags: ["a", "h3", "li"]
    },
    {
      key: "code-of-conduct",
      name: "Code of conduct",
      text: "Ordningsregler för hur man ska bete sig mot varandra i projektet. Tänk trivselregler.",
      selectors: ['a[href$="#coc-ov-file"]'],
      texts: ["code of conduct"]
    },
    {
      key: "contributing",
      name: "Contributing",
      text: "Instruktioner för dig som vill hjälpa till med projektet. Läs den innan du föreslår ändringar.",
      selectors: ['a[href$="#contributing-ov-file"]'],
      texts: ["contributing"]
    },
    {
      key: "security-policy",
      name: "Security policy",
      text: "Berättar hur du i hemlighet säger till ägarna om du hittar ett säkerhetshål. Sådant ska man inte skriva om öppet.",
      selectors: ['a[href$="#security-ov-file"]'],
      texts: ["security policy", "security"],
      tags: ["a", "li", "span", "button"]
    },
    {
      key: "about",
      name: "About",
      text: "Kort fakta om projektet: vad det är, länk till hemsidan och ämnesord. Ägaren skriver texten själv.",
      texts: ["about"],
      tags: ["h2", "h3"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "about-website",
      name: "Projektets hemsida",
      text: "En länk till projektets egen webbplats. Där finns ofta enklare guider än här på GitHub.",
      selectors: ['[class*="websiteRow"] a', '.BorderGrid-cell a[role="link"][href^="http"]', 'a[data-testid="repository-website-link"]']
    },
    {
      key: "custom-properties",
      name: "Custom properties",
      text: "Extra uppgifter som ägarna har lagt på projektet, till exempel vilket team som ansvarar. Mest för stora organisationer.",
      href: [repo("/custom-properties")],
      texts: ["custom properties"]
    },
    {
      key: "topics",
      name: "Topics",
      text: "Ämnesord som beskriver projektet. Klicka på ett ord för att hitta fler projekt om samma sak.",
      href: [/^\/topics\/[^/]+\/?$/],
      selectors: ["a.topic-tag"]
    },
    {
      key: "releases",
      name: "Releases",
      text: "Färdiga, utgivna versioner av projektet, ungefär som skivsläpp. Här finns ofta filer som är klara att ladda ner.",
      href: [repo("/releases"), repoPrefix("/releases/tag/")],
      texts: ["releases", "release", "latest"],
      tags: ["a", "h2", "h3", "span"]
    },
    {
      key: "packages",
      name: "Packages",
      text: "Färdigpaketerade delar av projektet som andra program kan hämta och använda. Många projekt har inga alls.",
      href: [/^\/(orgs|users)\/[^/]+\/packages/, /\/packages\/?$/],
      texts: ["packages"],
      tags: ["a", "h2", "h3"]
    },
    {
      key: "contributors",
      name: "Contributors",
      text: "Alla personer som har bidragit med ändringar i projektet. Ju fler, desto fler hjälps åt.",
      href: [repo("/graphs/contributors")],
      texts: ["contributors"],
      tags: ["a", "h2", "h3"]
    },
    {
      key: "languages",
      name: "Languages",
      text: "Visar vilka programspråk koden är skriven i och hur mycket av varje. Bra för att se vad du behöver kunna.",
      texts: ["languages"],
      tags: ["h2", "h3"]
    },
    {
      key: "stargazers",
      name: "Stars",
      text: "Hur många som har sparat projektet som favorit. Ett bra mått på hur populärt det är.",
      href: [repo("/stargazers")],
      texts: ["stars"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "watchers",
      name: "Watchers",
      text: "Hur många som följer projektet och får notiser när något händer.",
      href: [repo("/watchers")],
      texts: ["watching", "watchers"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "forks-count",
      name: "Forks",
      text: "Hur många som har gjort en egen kopia av projektet. Många kopior betyder ofta att många bygger vidare på det.",
      href: [repo("/forks"), repo("/network/members")],
      texts: ["forks"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "activity",
      name: "Activity",
      text: "En lista över allt som hänt i projektet nyligen, till exempel vem som sparade ändringar och när.",
      href: [repo("/activity")],
      texts: ["activity"],
      tags: ["a"]
    },
    {
      key: "report-repo",
      name: "Report repository",
      text: "Anmäler projektet till GitHub om det innehåller något olämpligt eller farligt.",
      texts: ["report repository", "report abuse", "report content", "report"],
      tags: ["a", "button", "li", "span"]
    },
    {
      key: "used-by",
      name: "Used by",
      text: "Hur många andra projekt som bygger på det här. Ett högt tal betyder att mycket hänger på det.",
      href: [repo("/network/dependents")],
      texts: ["used by"]
    },
    {
      key: "deployments",
      name: "Deployments",
      text: "Visar när projektet senast lades ut på riktigt, till exempel som en webbsida som alla kan besöka.",
      href: [repo("/deployments(/.*)?")],
      texts: ["deployments", "environments", "view deployment", "deployed", "show environments", "hide environments", "hide environments show environments", /successfully deployed$/, /^this branch was successfully deployed/],
      tags: ["a", "h2", "h3", "button", "summary"]
    },
    {
      key: "folder-row",
      name: "En mapp",
      text: "En mapp i projektet. Klicka för att öppna den och se vad som ligger i.",
      href: [repoPrefix("/tree/")],
      within: FILE_TABLE
    },
    {
      key: "file-row",
      name: "En fil",
      text: "En fil i projektet. Klicka för att läsa innehållet.",
      href: [repoPrefix("/blob/")],
      within: FILE_TABLE
    },
    {
      key: "view-all-files",
      name: "View all files",
      text: "Visar hela listan med filer och mappar när den har kortats ner.",
      selectors: ['[data-testid="view-all-files-row"] button'],
      texts: ["view all files"]
    },
    {
      key: "outline",
      name: "Outline",
      text: "Visar en innehållsförteckning över texten. Klicka på en rubrik för att hoppa dit.",
      aria: ["outline", "table of contents"]
    },
    {
      key: "view-code",
      name: "Code (visningsläge)",
      text: "Visar filens innehåll som text med radnummer. Bra när du vill läsa själva koden.",
      texts: ["code"],
      within: SEGMENTED
    },
    {
      key: "blame",
      name: "Blame",
      text: "Visar vem som senast ändrade varje rad och när. Bra för att förstå varför något ser ut som det gör.",
      href: [repoPrefix("/blame/")],
      texts: ["blame"]
    },
    {
      key: "preview",
      name: "Preview",
      text: "Visar hur texten kommer att se ut när den är klar, med rubriker och bilder. Bra för att kolla innan du sparar eller skickar.",
      texts: ["preview"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "raw",
      name: "Raw",
      text: "Visar filen som ren text utan färger och knappar. Bra om du vill kopiera allt eller spara filen.",
      href: [/^\/[^/]+\/[^/]+\/raw\//],
      texts: ["raw"],
      aria: ["view raw"]
    },
    {
      key: "download-raw",
      name: "Ladda ner filen",
      text: "Laddar ner just den här filen till din dator.",
      aria: ["download raw content", "download raw file", "download"]
    },
    {
      key: "edit-file",
      name: "Ändra filen (pennan)",
      text: "Ändrar filen direkt i webbläsaren. När du sparar blir det en commit, alltså en sparad punkt i historiken.",
      aria: ["edit file", "edit this file", /^edit the file/, "edit in place", /^you must be signed in and have push access/],
      href: [repoPrefix("/edit/")]
    },
    {
      key: "symbols",
      name: "Symbols",
      text: "Visar en innehållsförteckning över kodens delar, som namn på funktioner. Klicka för att hoppa dit.",
      aria: ["symbols", "open symbols panel", "toggle symbols panel"],
      texts: ["symbols"]
    },
    {
      key: "file-tree",
      name: "Filträdet",
      text: "Visar eller döljer listan med alla mappar och filer till vänster. Bra för att se var du är i projektet.",
      aria: ["expand file tree", "collapse file tree", "side panel", "open side panel", "close side panel", "toggle file tree"]
    },

    /* ---------------- Issues ---------------- */
    {
      key: "new-issue",
      name: "New issue",
      text: "Skapar en ny issue, alltså en lapp om ett problem, en fråga eller en idé. Beskriv tydligt vad som hänt så blir det lättare att hjälpa dig.",
      href: [repoPrefix("/issues/new")],
      texts: ["new issue", "create new issue", "submit new issue"],
      tags: ["a", "button", "summary"]
    },
    {
      key: "create-issue",
      name: "Create",
      text: "Skickar in din nya issue så att alla i projektet kan se den. Du kan ändra texten efteråt.",
      texts: ["create", "submit new issue"],
      tags: ["button"],
      page: repo("/issues/new(/choose)?")
    },
    {
      key: "issues-filter",
      name: "Sök och filtrera",
      text: "Söker bland issues eller förslag, till exempel bara öppna eller bara dina egna. Skriv ett ord för att hitta rätt snabbt.",
      aria: ["search issues", "search all issues", "filter issues", "clear filter", "search pull requests", "search all pull requests", "filter", "filter pull requests"],
      selectors: ['input#js-issues-search', 'input[name="q"][placeholder*="is:"]']
    },
    {
      key: "list-search-button",
      name: "Sök",
      text: "Söker bland issues eller förslag i just det här projektet med det du har skrivit i rutan.",
      aria: ["search"],
      texts: ["search"],
      tags: ["button"],
      page: repo("/(issues|pulls|discussions)")
    },
    {
      key: "issue-link",
      name: "En issue",
      text: "En issue, alltså en lapp om ett problem eller en idé. Klicka för att läsa hela och se svaren.",
      selectors: ['a[data-testid="issue-listitem-title-link"]', 'a[data-testid="listitem-title-link"][href*="/issues/"]', 'h3:has(> a[data-testid="issue-listitem-title-link"])', 'h3:has(> a[data-testid="listitem-title-link"][href*="/issues/"])', 'a[id^="issue_"][href*="/issues/"]'],
      href: [repo("/issues/\\d+")]
    },
    {
      key: "pull-link",
      name: "En pull request",
      text: "Ett förslag på ändringar. Klicka för att läsa det, se ändringarna och vad andra tycker.",
      selectors: ['a[data-testid="listitem-title-link"][href*="/pull/"]', 'h3:has(> a[data-testid="listitem-title-link"][href*="/pull/"])', 'a[data-testid="pr-listitem-title-link"]', 'a[id^="issue_"][href*="/pull/"]', "a.js-navigation-open[href*='/pull/']"],
      href: [repo("/pull/\\d+")],
      notWithin: PR_TABS
    },
    {
      key: "filter-by",
      name: "Filter",
      text: "Visar bara det som matchar ditt val, till exempel det som en viss person har skrivit. Resten göms tills du tar bort filtret.",
      aria: [/^filter by (?!labels?( |$)|milestones?$|assignees?$|projects?$)/, /^commits by /],
      texts: [/^filter by /],
      selectors: ['a[data-testid="author-filter-link"]']
    },
    {
      key: "sort-by",
      name: "Sortera",
      text: "Ändrar ordningen på listan, till exempel nyast eller flest kommentarer först.",
      aria: [/^sort by/, "sort"],
      texts: ["sort", "newest", "oldest"],
      tags: ["button", "summary"]
    },
    {
      key: "density",
      name: "Visningstäthet",
      text: "Ändrar hur tätt listan visas, luftigt eller kompakt. Påverkar bara hur det ser ut för dig.",
      aria: [/display density$/]
    },
    {
      key: "saved-views",
      name: "Färdiga filter",
      text: "Snabbval som visar issues som rör dig, till exempel sådana du skapat eller blivit nämnd i. Klicka för att filtrera listan.",
      texts: ["assigned to me", "created by me", "mentioned", "recent activity", "views", "your views", "open issues", "issues", "pull requests"],
      within: '[class*="SavedViews"], [aria-label="Issues sidebar"], aside, [class*="SidebarNavigation"], [data-testid="issues-sidebar"]'
    },
    {
      key: "collapse-sidebar",
      name: "Fäll ihop sidomenyn",
      text: "Döljer eller visar menyn till vänster, så att du får mer plats för listan.",
      aria: ["collapse sidebar", "expand sidebar"],
      texts: ["collapse sidebar", "expand sidebar"]
    },
    {
      key: "pagination",
      name: "Sidor",
      text: "Listan är uppdelad på flera sidor. Klicka för att bläddra till nästa eller en annan sida.",
      aria: ["page", "next page", "previous page", /^page /],
      texts: ["next", "previous"],
      selectors: ['nav[aria-label="Pagination"] a', ".pagination a", '[class*="Pagination"] a'],
      tags: ["a", "button"]
    },
    {
      key: "list-open",
      name: "Open",
      text: "Visar bara det som inte är klart än. Siffran visar hur många som väntar.",
      texts: ["open"],
      tags: ["a", "button", "li"],
      page: repo("/(issues|pulls)")
    },
    {
      key: "list-closed",
      name: "Closed",
      text: "Visar det som redan är löst eller stängt. Bra om du letar efter något som redan har fixats.",
      texts: ["closed"],
      tags: ["a", "button", "li"],
      page: repo("/(issues|pulls)")
    },
    {
      key: "state-badge",
      name: "Status",
      text: "Visar läget: Open betyder inte klart än, Closed betyder klart, och Merged betyder att ändringarna är inlagda. Draft betyder att det är ett utkast.",
      selectors: ['[title^="Status:"]', ".State", '[data-testid="header-state"]', '[class*="StateLabel"]', 'a[href*="state%3Aclosed%20reason"]', 'a[href*="reason%3Acompleted"]', 'a[href*="reason%3Anot-planned"]'],
      tags: ["span", "div", "a"]
    },
    {
      key: "labels",
      name: "Labels",
      text: "Etiketter är färgade lappar som sorterar ärenden, till exempel bugg eller idé. Här väljer eller ser du vilka som passar.",
      aria: ["edit labels", "select labels", "labels", "label", /^filter by labels?( |$)/],
      selectors: ['a[href*="label%3A"]', 'a[href*="label:"]', "a.IssueLabel", 'a[class*="IssueLabel"]', '[data-testid="issue-labels"] a'],
      href: [repo("/labels"), repoPrefix("/labels/")],
      texts: ["labels", "label"],
      tags: ["a", "button", "summary", "h2", "h3", "span", "li"]
    },
    {
      key: "milestones",
      name: "Milestones",
      text: "En milstolpe samlar ärenden som ska vara klara till ett visst mål, till exempel nästa version. Bra för att se hur långt man har kvar.",
      aria: ["edit milestone", "select milestones", "milestone", "milestones", /^filter by milestones?$/],
      href: [repo("/milestones"), repoPrefix("/milestone/")],
      texts: ["milestones", "milestone", "no milestone"],
      tags: ["a", "button", "summary", "h2", "h3", "span", "li"]
    },
    {
      key: "assignees",
      name: "Assignees",
      text: "Visar vem som ansvarar för att lösa det här. Du kan lägga till någon, eller dig själv.",
      aria: ["edit assignees", "select assignees", "assignees", "assignee", /^filter by assignees?$/, /^filter by assignee /],
      texts: ["assignees", "assignee", "assign yourself", "no one assigned"],
      tags: ["a", "button", "summary", "h2", "h3", "span", "li"]
    },
    {
      key: "issue-type",
      name: "Type",
      text: "Vilken sorts ärende det är, till exempel en bugg, en ny funktion eller en uppgift. Hjälper alla att sortera.",
      aria: ["edit type", "edit issue type", "select issue type"],
      texts: ["type", "issue type", "no type"],
      tags: ["button", "summary", "h2", "h3", "span"],
      within: SIDEBAR
    },
    {
      key: "development",
      name: "Development",
      text: "Kopplar ihop ärendet med en branch (en egen arbetskopia) eller en pull request som löser det. När förslaget läggs in stängs ärendet automatiskt.",
      aria: ["link a branch, pull request, or commit", "edit development", /^development/, "link issues"],
      texts: ["development"],
      tags: ["button", "summary", "h2", "h3", "span"]
    },
    {
      key: "create-branch",
      name: "Create a branch",
      text: "Skapar en ny branch, alltså en egen arbetskopia, för att lösa just det här ärendet. Då rör du inte huvudversionen.",
      texts: ["create a branch", "create branch", /^create a branch for this issue/]
    },
    {
      key: "relationships",
      name: "Relationships",
      text: "Kopplar ärendet till andra ärenden, till exempel om det är en del av ett större. Bra för att se helheten.",
      texts: ["relationships", "add parent", "create sub-issue", "add sub-issue", "sub-issues"]
    },
    {
      key: "subscribe",
      name: "Subscribe / Notifications",
      text: "Väljer om du vill få notiser när någon skriver här. Bra för att följa ett ärende utan att själv svara.",
      texts: ["subscribe", "unsubscribe", "notifications", "customize"],
      tags: ["button", "summary", "h2", "h3", "span"],
      within: SIDEBAR
    },
    {
      key: "participants",
      name: "Participants",
      text: "Alla som har skrivit eller deltagit i samtalet.",
      selectors: [".participation .discussion-sidebar-heading"],
      texts: ["participants", "participant"],
      tags: ["h2", "h3", "span", "div"]
    },
    {
      key: "lock",
      name: "Lock conversation",
      text: "Stänger för nya kommentarer, till exempel om samtalet blivit för hetsigt. Ägarna kan öppna igen.",
      texts: ["lock conversation", "unlock conversation"]
    },
    {
      key: "pin-issue",
      name: "Pin issue",
      text: "Fäster ärendet överst i listan så att alla ser det först.",
      texts: ["pin issue", "unpin issue"]
    },
    {
      key: "transfer-issue",
      name: "Transfer issue",
      text: "Flyttar ärendet till ett annat projekt, om det hamnat på fel ställe.",
      texts: ["transfer issue"]
    },
    {
      key: "delete-issue",
      name: "Delete issue",
      text: "Tar bort ärendet för alltid. Det går inte att ångra.",
      texts: ["delete issue"]
    },
    {
      key: "duplicate-issue",
      name: "Duplicate issue",
      text: "Gör en kopia av ärendet som du kan ändra i. Bra när ett nytt ärende liknar ett gammalt.",
      texts: ["duplicate issue"]
    },
    {
      key: "comment",
      name: "Comment",
      text: "Skickar din kommentar så att alla i samtalet kan läsa den. Var vänlig och tydlig.",
      texts: ["comment", "add comment", "add a comment", "reply"],
      tags: ["button"]
    },
    {
      key: "comment-box",
      name: "Kommentarsrutan",
      text: "Här skriver du ditt svar. Du kan dra in bilder, och @namn ser till att en person får en notis.",
      aria: ["markdown value", "comment body", "add a comment", "use markdown to format your comment"],
      selectors: ['textarea[name="comment[body]"]', 'textarea#new_comment_field', 'textarea[placeholder*="comment" i]']
    },
    {
      key: "write-tab",
      name: "Write",
      text: "Läget där du skriver din text. Byt till Preview för att se hur den blir.",
      texts: ["write", "edit"],
      tags: ["button", "a"],
      within: '[role="tablist"], .tabnav-tabs, [class*="MarkdownEditor"], .CommentBox-header, [class*="Toolbar"], .js-previewable-comment-form'
    },
    {
      key: "close-issue",
      name: "Close issue",
      text: "Markerar ärendet som klart, eller som något man inte ska göra. Det går att öppna igen senare.",
      texts: ["close issue", "close with comment", "close as completed", "close as not planned", "close as duplicate"],
      tags: ["button", "li", "span"]
    },
    {
      key: "close-options",
      name: "Fler sätt att stänga",
      text: "Välj varför ärendet stängs: för att det är klart, inte ska göras, eller redan finns.",
      aria: ["more options", "close issue options", /^close .*options/, "select a reason for closing"],
      within: '[class*="CommentBox"], .js-comment-form-actions, form, [class*="ActionBar"]'
    },
    {
      key: "reopen-issue",
      name: "Reopen issue",
      text: "Öppnar ett stängt ärende igen, till exempel om problemet kom tillbaka.",
      texts: ["reopen issue", "reopen", "reopen with comment"]
    },
    {
      key: "reactions",
      name: "Reaktioner (emoji)",
      text: "Svara med en emoji i stället för att skriva, till exempel tumme upp. Ett snabbt sätt att hålla med utan att skapa mer text.",
      aria: ["add or remove reactions", "add reaction", "all reactions", "reactions", /^react with/, /reactions?$/, /^reactions/],
      selectors: ['.social-reaction-summary-item', 'button[data-testid="reaction-button"]']
    },
    {
      key: "edit-generic",
      name: "Edit",
      text: "Ändrar texten. Bara den som skrev den eller projektets ägare kan göra det.",
      aria: ["edit title", "edit issue title", "edit pull request title", "edit comment", "edit issue body"],
      texts: ["edit"],
      tags: ["button"],
      notWithin: '[role="tablist"]'
    },
    {
      key: "timestamp",
      name: "Tidpunkt",
      text: "När texten skrevs. Klicka för att få en direktlänk till just den här kommentaren.",
      selectors: ['a[data-testid="issue-body-header-link"]', "a:has(> relative-time)", 'a[data-testid*="timestamp"]', "a.js-timestamp"]
    },
    {
      key: "edit-history",
      name: "Edited",
      text: "Visar att texten har ändrats efter att den skrevs. Klicka för att se vad som ändrades.",
      texts: [/^last edited by /, "edited", /^edited by /],
      tags: ["button", "summary", "span"]
    },
    {
      key: "load-more",
      name: "Load more",
      text: "Samtalet är långt, så en del är gömt. Klicka för att visa resten.",
      texts: ["load more", "remaining items", "hidden items", /^load more/],
      tags: ["button", "h3", "span"]
    },
    {
      key: "linked-issues",
      name: "Länkade issues",
      text: "Visar vilka issues som stängs automatiskt när det här förslaget läggs in.",
      aria: [/^linked issues? for /, /linked issues?$/],
      href: [repo("/issues/\\d+/linked_closing_reference")]
    },
    {
      key: "pr-stack",
      name: "Stack",
      text: "Förslaget är en del av en serie förslag som bygger på varandra. Siffrorna visar vilken i ordningen det är.",
      aria: [/^pull request stack/]
    },
    {
      key: "quote-reply",
      name: "Quote reply",
      text: "Svarar på kommentaren och citerar den, så att alla ser vad du svarar på.",
      texts: ["quote reply"]
    },
    {
      key: "copy-link",
      name: "Copy link",
      text: "Kopierar en direktlänk till just den här kommentaren, så att du kan skicka den till någon.",
      aria: ["copy link"],
      texts: ["copy link"]
    },
    {
      key: "mention",
      name: "Ett @namn",
      text: "Ett användarnamn på GitHub. Klicka för att se personens profil.",
      aria: [/'s profile$/],
      href: [new RegExp("^/" + RESERVED + "[^/]+/?$", "i")],
      notWithin: '[data-listview-component="items-list"], nav[aria-label="Breadcrumbs"], .AppHeader-context, #repository-container-header h1',
      selectors: ['a[data-testid="issue-body-header-author"]', 'a[data-testid="avatar-link"]', 'a[data-testid="actor-link"]', '[data-testid="comment-header"] a[class*="authorLink"]', '[data-testid="comment-header"] a[href^="/"]:not([href*="/issues/"]):not([href*="/pull/"])', "a.user-mention", "a.author", '[data-hovercard-type="user"]', 'a[data-testid="issue-body-header-author"]']
    },

    /* ---------------- Pull requests ---------------- */
    {
      key: "new-pull",
      name: "New pull request",
      text: "Föreslår att dina ändringar ska läggas in i projektet. En pull request är ett förslag som andra kan läsa, kommentera och godkänna.",
      href: [repo("/compare"), repoPrefix("/pull/new/")],
      texts: ["new pull request", "create pull request", "compare & pull request", "create draft pull request"],
      tags: ["a", "button"]
    },
    {
      key: "pr-conversation",
      name: "Conversation",
      text: "Samtalet om ändringsförslaget: kommentarer, granskningar och allt som hänt. Börja läsa här.",
      href: [repo("/pull/\\d+")],
      texts: ["conversation"],
      tags: ["a", "button", "li"],
      within: PR_TABS + ", nav, [role=\"tablist\"]"
    },
    {
      key: "pr-commits",
      name: "Commits (i förslaget)",
      text: "Alla sparade ändringar som ingår i förslaget, i den ordning de gjordes. En commit är en sparad punkt med en kort förklaring.",
      href: [repo("/pull/\\d+/commits")],
      texts: ["commits"],
      tags: ["a", "button", "li"],
      within: PR_TABS + ", nav, [role=\"tablist\"]"
    },
    {
      key: "pr-checks",
      name: "Checks",
      text: "Automatiska tester som körs på ändringarna. Grön bock betyder att allt gick bra, rött kryss att något gick fel.",
      href: [repo("/pull/\\d+/checks")],
      texts: ["checks"],
      tags: ["a", "button", "li"]
    },
    {
      key: "pr-files",
      name: "Files changed",
      text: "Visar exakt vilka rader som har ändrats. Grönt är nytt och rött är borttaget.",
      href: [repo("/pull/\\d+/files"), repo("/pull/\\d+/changes")],
      texts: ["files changed", "files", "changes"],
      tags: ["a", "button", "li"],
      within: PR_TABS + ", nav, [role=\"tablist\"]"
    },
    {
      key: "copy-branch",
      name: "Kopiera branch-namnet",
      text: "Kopierar namnet på den branch (arbetskopia) som ändringarna gjordes i. Bra om du vill hämta just den versionen.",
      aria: ["copy head branch name to clipboard", "copy branch name to clipboard", /branch name to clipboard/]
    },
    {
      key: "reviewers",
      name: "Reviewers",
      text: "Personer som ska läsa igenom och godkänna ändringarna innan de läggs in. En extra kontroll så att inget går sönder.",
      aria: ["request a review", "edit reviewers", "select reviewers", "reviewers", "request review", /^awaiting requested review/],
      texts: ["reviewers", "reviewer", "no reviews", /^more reviewers?$/],
      tags: ["a", "button", "summary", "h2", "h3", "span"]
    },
    {
      key: "review-changes",
      name: "Review changes",
      text: "Här lämnar du din granskning: godkänn, be om ändringar eller bara kommentera. Allt skickas på en gång.",
      texts: ["review changes", "submit review", "finish your review", "add your review", "review"],
      tags: ["button", "summary"]
    },
    {
      key: "approve",
      name: "Approve",
      text: "Säger att du tycker ändringarna är bra och kan läggas in.",
      texts: ["approve", "approve changes"],
      tags: ["label", "input", "button", "span", "li"]
    },
    {
      key: "request-changes",
      name: "Request changes",
      text: "Säger att något behöver fixas innan ändringarna kan läggas in. Skriv gärna vad.",
      texts: ["request changes"],
      tags: ["label", "input", "button", "span", "li"]
    },
    {
      key: "start-review",
      name: "Start a review",
      text: "Samlar dina kommentarer och skickar alla på en gång i stället för en i taget. Snällare mot den som får dem.",
      texts: ["start a review", "add review comment"]
    },
    {
      key: "single-comment",
      name: "Add single comment",
      text: "Skickar bara den här kommentaren direkt, utan att starta en hel granskning.",
      texts: ["add single comment"]
    },
    {
      key: "merge",
      name: "Merge pull request",
      text: "Lägger in ändringarna i huvudversionen av projektet. Gör det först när alla är nöjda och testerna är gröna.",
      texts: ["merge pull request", "merge", "merge when ready", "merge without waiting for requirements to be met"],
      tags: ["button", "summary"]
    },
    {
      key: "squash-merge",
      name: "Squash and merge",
      text: "Lägger in ändringarna men slår ihop alla sparpunkter till en enda. Då blir historiken renare.",
      texts: ["squash and merge", "create a merge commit"],
      tags: ["button", "li", "span", "label"]
    },
    {
      key: "rebase-merge",
      name: "Rebase and merge",
      text: "Lägger in varje sparpunkt för sig, i rad efter de senaste ändringarna. Historiken blir en rak linje.",
      texts: ["rebase and merge"],
      tags: ["button", "li", "span", "label"]
    },
    {
      key: "confirm-merge",
      name: "Confirm merge",
      text: "Sista steget. Klicka för att verkligen lägga in ändringarna i huvudversionen.",
      texts: ["confirm merge", "confirm squash and merge", "confirm rebase and merge"]
    },
    {
      key: "merge-method",
      name: "Välj sätt att lägga in",
      text: "Väljer hur ändringarna ska läggas in: som de är, ihopslagna till en, eller i rak följd. Välj det projektet brukar använda.",
      aria: ["select merge method", "merge options", /merge method/],
      selectors: ['.merge-box-button summary', '.BtnGroup-parent.js-merge-method-menu summary']
    },
    {
      key: "auto-merge",
      name: "Enable auto-merge",
      text: "Lägger in ändringarna automatiskt så fort alla tester är gröna och någon har godkänt. Du slipper vänta och trycka själv.",
      texts: ["enable auto-merge", "disable auto-merge"]
    },
    {
      key: "update-branch",
      name: "Update branch",
      text: "Hämtar in de senaste ändringarna från huvudversionen till ditt förslag, så att allt är i takt.",
      texts: ["update branch", "update with merge commit", "update with rebase"]
    },
    {
      key: "close-pull",
      name: "Close pull request",
      text: "Stänger förslaget utan att lägga in ändringarna. Det går att öppna igen.",
      texts: ["close pull request"]
    },
    {
      key: "ready-for-review",
      name: "Ready for review",
      text: "Säger att ditt utkast är klart att granskas av andra. Då får granskarna en notis.",
      texts: ["ready for review"]
    },
    {
      key: "convert-to-draft",
      name: "Convert to draft",
      text: "Gör förslaget till ett utkast igen, så att andra vet att du inte är klar än.",
      texts: ["convert to draft"]
    },
    {
      key: "delete-branch",
      name: "Delete branch",
      text: "Tar bort arbetskopian när ändringarna redan är inlagda. Det städar och inget av det inlagda försvinner.",
      texts: ["delete branch", "restore branch"]
    },
    {
      key: "revert",
      name: "Revert",
      text: "Skapar ett nytt förslag som tar tillbaka ändringarna, om något blev fel. Inget raderas, det läggs bara till en ångring.",
      texts: ["revert"]
    },
    {
      key: "resolve-conversation",
      name: "Resolve conversation",
      text: "Markerar att en fråga i granskningen är löst, så att den fälls ihop. Bra för att hålla ordning.",
      texts: ["resolve conversation", "unresolve conversation", "resolve"]
    },
    {
      key: "viewed",
      name: "Viewed",
      selectors: ["input.js-reviewed-checkbox", 'input[name="viewed"]'],
      text: "Bocka i när du har läst filen, så fälls den ihop och du vet var du är.",
      texts: ["viewed"],
      tags: ["label", "input", "button", "span"]
    },
    {
      key: "diff-unified",
      name: "Unified",
      text: "Visar gammal och ny kod i samma ruta, ovanför varandra.",
      selectors: ['input[value="unified"]'],
      texts: ["unified"]
    },
    {
      key: "diff-split",
      name: "Split",
      text: "Visar gammal kod till vänster och ny kod till höger, sida vid sida.",
      selectors: ['input[value="split"]'],
      texts: ["split"]
    },
    {
      key: "hide-whitespace",
      name: "Hide whitespace",
      text: "Döljer ändringar som bara är mellanslag och tomma rader, så att du ser det som verkligen ändrats.",
      texts: ["hide whitespace", "hide whitespace changes"]
    },
    {
      key: "suggest-change",
      name: "Suggest change",
      text: "Föreslår en exakt ändring av koden som den andra kan godkänna med ett klick.",
      aria: ["add a suggestion", "insert a suggestion", "suggest change"],
      texts: ["suggest change", "commit suggestion", "add suggestion to batch"]
    },

    {
      key: "branch-name",
      name: "Branch-namn",
      text: "Namnet på en branch, alltså en arbetskopia av projektet. Förslaget vill flytta ändringar från den ena till den andra.",
      selectors: ['a[data-component="BranchName"]', '[class*="BranchName"]', ".commit-ref a", ".head-ref a", ".base-ref a"]
    },
    {
      key: "force-pushed",
      name: "Force-pushed",
      text: "Någon har ersatt tidigare sparade ändringar i förslaget med nya. Klicka för att se skillnaden.",
      texts: ["force-pushed", "force pushed"]
    },
    {
      key: "page-title",
      name: "Rubrik",
      text: "Rubriken på den här issuen eller pull requesten. Den säger kort vad saken handlar om.",
      selectors: ['[data-testid="issue-title"]', "bdi.markdown-title", "h1.gh-header-title", 'h1[data-component="PH_Title"]', 'h2:has(> bdi.markdown-title)', '[class*="PageHeader"] h1', '[class*="PageHeader"] h2']
    },
    {
      key: "bot",
      name: "Robot",
      text: "En robot, alltså ett automatiskt program som hjälper projektet, till exempel med tester eller uppdateringar.",
      href: [/^\/apps\/[^/]+\/?$/],
      texts: [/ bot$/]
    },
    {
      key: "close-dialog",
      name: "Stäng",
      text: "Stänger rutan utan att ändra något.",
      aria: ["close dialog", "close", "dismiss", "close modal"]
    },
    {
      key: "view-reviewed-changes",
      name: "View reviewed changes",
      text: "Visar exakt vilka ändringar granskaren tittade på när hen lämnade sin granskning.",
      texts: ["view reviewed changes", "view changes"]
    },
    {
      key: "commit-message",
      name: "Hela beskrivningen",
      text: "Visar hela texten som skrevs när ändringen sparades. Ofta står det mer om varför.",
      aria: ["commit message body", "show commit message", "toggle commit message"]
    },
    {
      key: "copy-sha",
      name: "Kopiera commit-koden",
      text: "Kopierar den unika koden för den här sparade ändringen. Varje commit har en egen kod, ungefär som ett kvittonummer.",
      aria: [/^copy full sha/, /^copy the full sha/, /^copy sha/]
    },
    {
      key: "browse-at-commit",
      name: "Browse repository at this point",
      text: "Visar hur hela projektet såg ut precis efter den här ändringen. Som att bläddra tillbaka i tiden.",
      aria: ["browse repository at this point", /^browse the repository at this point/, "view code at this point"]
    },
    {
      key: "commit-range",
      name: "Välj commits",
      text: "Väljer vilka sparade ändringar (commits) du vill se. Från början visas alla.",
      texts: [/^changes from /, "all commits"],
      tags: ["summary", "button"]
    },
    {
      key: "file-filter",
      name: "File filter",
      text: "Visar bara vissa sorters filer, till exempel bara bilder eller bara kod.",
      texts: ["file filter"],
      tags: ["summary", "button"]
    },
    {
      key: "conversations-jump",
      name: "Conversations",
      text: "Hoppar mellan de kommentarer som granskarna har skrivit direkt i koden.",
      texts: ["conversations"],
      tags: ["summary", "button"]
    },
    {
      key: "jump-to",
      name: "Jump to",
      text: "Hoppar direkt till en viss fil eller version i listan.",
      texts: ["jump to", "jump to file", "jump to release"],
      tags: ["summary", "button"]
    },
    {
      key: "toggle-diff",
      name: "Fäll ihop filen",
      text: "Fäller ihop eller visar ändringarna i den här filen, så att listan blir kortare.",
      aria: ["toggle diff contents", "collapse file", "expand file"]
    },
    {
      key: "expand-all",
      name: "Expand all",
      text: "Visar hela filen, inte bara raderna runt det som ändrats.",
      aria: ["expand all", "expand all lines", /^expand (up|down)/],
      texts: ["expand all"]
    },
    {
      key: "diff-file-name",
      name: "Filnamn",
      text: "Namnet på en fil som har ändrats. Klicka för att hoppa till just den filen.",
      selectors: ['a[href^="#diff-"]', ".file-info a.Link--primary"]
    },
    {
      key: "file-breadcrumb",
      name: "Sökvägen",
      text: "Visar var i projektets mappar du är just nu. Klicka på ett namn för att gå tillbaka dit.",
      selectors: ['[data-testid="breadcrumbs"] a', '[data-testid="breadcrumbs-repo-link"]', "#repos-header-breadcrumb a", ".js-path-segment a"]
    },
    {
      key: "back-to-top",
      name: "Top",
      text: "Hoppar tillbaka till början av filen.",
      texts: ["top", "back to top"],
      tags: ["button", "a"]
    },
    /* ---------------- Actions och Releases ---------------- */
    {
      key: "new-workflow",
      name: "New workflow",
      text: "Skapar ett nytt automatiskt arbetsflöde, till exempel tester som körs varje gång någon sparar en ändring.",
      href: [repoPrefix("/actions/new")],
      texts: ["new workflow"]
    },
    {
      key: "run-workflow",
      name: "Run workflow",
      text: "Startar arbetsflödet direkt för hand i stället för att vänta på att det startar av sig självt.",
      texts: ["run workflow"]
    },
    {
      key: "rerun",
      name: "Re-run jobs",
      text: "Kör de automatiska jobben en gång till, till exempel om något stoppades av en tillfällighet.",
      texts: ["re-run jobs", "re-run all jobs", "re-run failed jobs", "re-run job", "re-run"]
    },
    {
      key: "new-release",
      name: "Draft a new release",
      text: "Ger ut en ny färdig version av projektet med namn, beskrivning och filer att ladda ner.",
      href: [repoPrefix("/releases/new")],
      texts: ["draft a new release", "create a new release", "new release"]
    },
    {
      key: "find-release",
      name: "Find a release",
      text: "Söker bland projektets utgivna versioner. Skriv till exempel ett versionsnummer.",
      aria: ["find a release", "search releases"]
    },
    {
      key: "release-name",
      name: "En version",
      text: "En utgiven version av projektet. Här står vad som är nytt i just den versionen.",
      selectors: ['a[href^="#release-"]', 'h2 a[href*="/releases/tag/"]', '[data-testid="release-card"] h2 a']
    },
    {
      key: "release-compare",
      name: "Compare",
      text: "Jämför två versioner av projektet och visar vad som har ändrats mellan dem.",
      texts: ["compare"],
      tags: ["button", "summary", "a"]
    },
    {
      key: "release-assets",
      name: "Assets",
      text: "Filerna som hör till versionen, till exempel färdiga program eller koden som zip-fil. Klicka för att visa dem.",
      texts: ["assets"],
      tags: ["summary", "button", "h2", "h3", "span"]
    },
    {
      key: "sync-fork",
      name: "Sync fork",
      text: "Hämtar in de senaste ändringarna från originalprojektet till din kopia, så att den inte blir gammal.",
      texts: ["sync fork"]
    },
    {
      key: "contribute",
      name: "Contribute",
      text: "Föreslår att dina ändringar i kopian ska läggas in i originalprojektet. Det blir en pull request.",
      texts: ["contribute", "open pull request"]
    }
  ];
})();
