/*
 * GitHub-for-dummies: alla förklaringar.
 *
 * Varje förklaring har:
 *   key        en intern kod (används bara av programmet och testerna)
 *   name       vad saken heter på GitHub (visas fetstilt i pratbubblan)
 *   text       vad saken är, på svenska med vardagliga ord, max två korta meningar
 *   use        när du har nytta av den, börjar med "När", visas under rubriken Nytta
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
  // Första delen av adressen som INTE är ett projekt eller en person, t.ex. github.com/settings.
  // Gäller både /explore och /explore/..., så ordet får följas av snedstreck eller ingenting.
  var RESERVED =
    "(?!(?:settings|notifications|login|logout|signup|join|new|organizations|orgs|topics|marketplace|" +
    "explore|features|pulls|issues|search|sponsors|codespaces|dashboard|account|pricing|enterprise|" +
    "about|collections|trending|stars|watching|copilot|apps|security|site|contact|readme|" +
    "discussions|projects|repositories|repos|models|mcp|spark|home|feed|events|team|solutions|" +
    "resources|customer-stories|partners|education|premium-support|github-copilot)(?:/|$))";

  // En länk till en av GitHubs egna sidor, med eller utan github.com framför.
  function link(path) {
    return 'a[href="' + path + '"], a[href="' + path + '/"], a[href="https://github.com' + path + '"]';
  }

  // En rad i menyn för dina kontoinställningar. Känns igen på länkens adress.
  function setting(key, path, name, text, use) {
    return { key: key, name: name, text: text, use: use, href: [new RegExp("^" + path + "/?$")], texts: [name.toLowerCase()], within: link(path) };
  }

  // En rad i menyn för ett projekts inställningar, till exempel /ägare/projekt/settings/hooks.
  function repoSetting(key, sub, name, text, use) {
    return { key: key, name: name, text: text, use: use, href: [repo("/settings" + sub)], texts: [name.toLowerCase()], within: 'a[href$="/settings' + sub + '"]' };
  }

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
  var FORMAT = '[aria-label="Formatting tools"], markdown-toolbar, [role="toolbar"]';
  var PROFILE_FORM = "#settings-frame";
  var SIDEBAR = '.Layout-sidebar, .discussion-sidebar, [data-testid="sidebar-section"], [class*="SidebarSection"], [class*="sidebarSection"], [data-testid="issue-viewer-metadata-pane"], #partial-discussion-sidebar, aside';

  globalThis.GFD_EXPLANATIONS = [
    /* ---------------- Toppen av sidan (gäller överallt) ---------------- */
    {
      key: "search",
      name: "Sök",
      text: "Sökrutan för hela GitHub. Du kan söka efter projekt, kod och personer.",
      use: "När du letar efter något och inte vet var det finns. Tryck / på tangentbordet för att hoppa hit.",
      aria: [/^search or jump to/, /^search github/, /^open quick search/],
      selectors: ['[data-target="qbsearch-input.inputButton"]', "qbsearch-input button", ".header-search-button"],
      texts: ["type / to search", "search or jump to", "search/"]
    },
    {
      key: "plus-menu",
      name: "Plus-menyn (Create new)",
      text: "En meny för att skapa något nytt, till exempel ett nytt projekt eller ett nytt ärende.",
      use: "När du vill starta något från början.",
      aria: ["create something new", "create new…", "create new...", "create new"]
    },
    {
      key: "notifications-bell",
      name: "Notiser (klockan)",
      text: "Dina notiser samlas här, till exempel när någon har svarat dig. En prick betyder att du har olästa.",
      use: "När du vill se om någon väntar på svar från dig.",
      ids: ["AppHeader-notifications-button"],
      aria: [/unread notifications/, "notifications", "you have no unread notifications"],
      href: [/^\/notifications\/?$/],
      notWithin: ".pagehead-actions, #repository-details-container"
    },
    {
      key: "user-menu",
      name: "Din meny (profilbilden)",
      text: "Din egen meny med profil, projekt och inställningar. Här loggar du också ut.",
      use: "När du vill till din profil, dina projekt eller dina inställningar.",
      aria: ["open user navigation menu", "open user account menu", "view profile and more"]
    },
    {
      key: "global-menu",
      name: "Huvudmenyn",
      text: "Huvudmenyn med genvägar till allt som är ditt på GitHub, till exempel dina ärenden och ändringsförslag.",
      use: "När du vill hoppa snabbt mellan dina saker, oavsett vilken sida du är på.",
      aria: ["open global navigation menu", "open navigation menu", "toggle navigation", "close navigation menu", "global navigation menu"]
    },
    {
      key: "home-logo",
      name: "GitHub-loggan",
      text: "GitHubs logga. Den tar dig till din startsida.",
      use: "När du har klickat dig vilse och vill börja om från start.",
      aria: ["homepage", "github homepage", "github"],
      selectors: ['a.AppHeader-logo', 'a.header-logo', 'a[data-hotkey="g d"]']
    },
    {
      key: "appearance",
      name: "Appearance settings",
      text: "Inställningar för hur GitHub ser ut, till exempel mörkt eller ljust läge. Det påverkar bara din skärm.",
      use: "När sidan är för ljus, för mörk eller svår att läsa.",
      aria: ["appearance settings", "appearance"]
    },
    {
      key: "skip-to-content",
      name: "Skip to content",
      text: "En genväg förbi menyerna, direkt till sidans innehåll.",
      use: "När du använder tangentbordet i stället för musen och vill slippa gå igenom alla menyer.",
      href: [],
      selectors: ['a[href="#start-of-content"]', "a.js-skip-to-content"],
      texts: ["skip to content"]
    },
    {
      key: "copilot",
      name: "Copilot",
      text: "GitHubs AI-assistent. Du kan ställa frågor på vanlig svenska om koden och projektet.",
      use: "När du inte förstår vad något i ett projekt gör och vill få det förklarat.",
      aria: [/copilot/],
      texts: ["copilot", "ask copilot"]
    },
    {
      key: "your-issues",
      name: "Dina issues",
      text: "Alla ärenden som har med dig att göra, från alla projekt. Ett ärende (issue) är en lapp om ett problem eller en idé.",
      use: "När du vill se allt du har skrivit eller ska ta hand om, samlat på ett ställe.",
      aria: ["your issues"],
      href: [/^\/issues\/?$/],
      texts: ["all issues"]
    },
    {
      key: "your-pulls",
      name: "Dina pull requests",
      text: "Alla ändringsförslag som du har gjort eller ska titta på. Ett ändringsförslag (pull request) är när någon säger: kolla mina ändringar, vill ni ta in dem?",
      use: "När du vill se vilka förslag som väntar på dig eller på svar från andra.",
      aria: ["your pull requests"],
      href: [/^\/pulls\/?$/],
      texts: ["all pull requests"]
    },

    /* ---------------- Huvudmenyn (de tre strecken uppe till vänster) ---------------- */
    {
      key: "global-home",
      name: "Home",
      text: "Din startsida på GitHub med det senaste från projekt och personer du följer.",
      use: "När du vill se vad som har hänt sedan sist.",
      aria: ["home", "dashboard"],
      href: [/^\/(dashboard)?\/?$/],
      texts: ["home", "dashboard"],
      within: link("/dashboard") + ', a[href="/"], a[href="https://github.com/"]'
    },
    {
      key: "global-projects",
      name: "Projects",
      text: "Alla dina planeringstavlor samlade. En tavla sorterar jobbet i kolumner som Att göra, Pågår och Klart.",
      use: "När du vill se hur arbetet går i alla projekt på en gång.",
      aria: ["projects"],
      href: [/^\/projects\/?$/],
      texts: ["projects", "all projects"],
      within: link("/projects") + ', a[href$="tab=projects"]'
    },
    {
      key: "global-discussions",
      name: "Discussions",
      text: "Alla diskussionstrådar du är med i, från alla projekt. Det fungerar ungefär som ett forum.",
      use: "När du vill hitta tillbaka till en fråga du har ställt eller svarat på.",
      aria: ["discussions"],
      href: [/^\/discussions\/?$/],
      texts: ["discussions", "all discussions"],
      within: link("/discussions")
    },
    {
      key: "global-codespaces",
      name: "Codespaces",
      text: "Dina datorer i molnet, där du kan öppna ett projekt och ändra i det direkt i webbläsaren.",
      use: "När du vill fortsätta jobba i en molndator du har startat, eller stänga av en du inte använder.",
      aria: ["codespaces"],
      href: [/^\/codespaces\/?$/],
      texts: ["codespaces"],
      within: link("/codespaces")
    },
    {
      key: "global-explore",
      name: "Explore",
      text: "Ett skyltfönster med populära och nya projekt på GitHub.",
      use: "När du letar efter inspiration eller vill se vad andra bygger.",
      aria: ["explore"],
      href: [/^\/explore\/?$/],
      texts: ["explore"],
      within: link("/explore")
    },
    {
      key: "global-marketplace",
      name: "Marketplace",
      text: "En butik med tillägg till GitHub, till exempel verktyg som testar koden automatiskt. Många är gratis.",
      use: "När du vill att GitHub ska göra något åt dig som det inte gör från början.",
      aria: ["marketplace"],
      href: [/^\/marketplace\/?$/],
      texts: ["marketplace"],
      within: link("/marketplace")
    },
    {
      key: "global-mcp",
      name: "MCP registry",
      text: "En katalog med kopplingar som låter AI-assistenter prata med andra tjänster, till exempel en kalender eller en databas.",
      use: "När du vill ge Copilot eller en annan AI tillgång till fler verktyg.",
      aria: ["mcp registry"],
      href: [/^\/mcp\/?$/],
      texts: ["mcp registry", "mcp"],
      within: link("/mcp")
    },
    {
      key: "top-repositories",
      name: "Top repositories",
      text: "Projekt du har jobbat i eller tittat på nyligen.",
      use: "När du snabbt vill tillbaka till ett projekt utan att söka efter det.",
      texts: ["top repositories"]
    },
    {
      key: "sign-in",
      name: "Sign in",
      text: "Logga in på ditt GitHub-konto.",
      use: "När du vill ge stjärnor, skriva kommentarer eller jobba i dina egna projekt.",
      texts: ["sign in", "sign in to comment"],
      href: [/^\/login\/?$/],
      tags: ["a", "button"]
    },
    {
      key: "sign-up",
      name: "Sign up",
      text: "Skapa ett gratis konto på GitHub.",
      use: "När du vill spara egna projekt eller vara med och bidra i andras.",
      texts: ["sign up", "sign up for free", "sign up for github"],
      href: [/^\/signup\/?$/, /^\/join\/?$/]
    },

    /* ---------------- Plus-menyn ---------------- */
    {
      key: "new-repository",
      name: "New repository",
      text: "Skapar ett nytt projekt, ett så kallat repo. Det är en mapp för filer som minns varje ändring som gjorts.",
      use: "När du ska starta ett eget projekt och vill ha en plats för filerna.",
      texts: ["new repository", "create repository", "create a new repository"],
      href: [/^\/new\/?$/]
    },
    {
      key: "import-repository",
      name: "Import repository",
      text: "Flyttar in ett projekt som ligger någon annanstans till GitHub, med hela historiken.",
      use: "När du har ett projekt på en annan tjänst och vill samla allt här.",
      texts: ["import repository"],
      href: [/^\/new\/import\/?$/]
    },
    {
      key: "new-codespace",
      name: "New codespace",
      text: "Startar en dator i molnet där du kan skriva kod direkt i webbläsaren.",
      use: "När du vill prova eller ändra något utan att installera något på din egen dator.",
      texts: ["new codespace"],
      href: [/^\/codespaces\/new\/?$/]
    },
    {
      key: "new-gist",
      name: "New gist",
      text: "En gist är ett litet anteckningsblad för text eller kod som du delar med en länk.",
      use: "När du vill dela en kort kodsnutt eller anteckning utan att skapa ett helt projekt.",
      texts: ["new gist"]
    },
    {
      key: "new-organization",
      name: "New organization",
      text: "Skapar en grupp där flera personer äger projekt tillsammans, som ett företag eller en klass.",
      use: "När ni är flera som ska jobba i samma projekt och dela ansvaret.",
      texts: ["new organization"],
      href: [/^\/account\/organizations\/new\/?$/, /^\/organizations\/plan\/?$/]
    },
    {
      key: "new-project",
      name: "New project",
      text: "Skapar en planeringstavla med lappar i kolumner, till exempel Att göra, Pågår och Klart.",
      use: "När du vill hålla koll på vad som ska göras och vem som gör vad.",
      texts: ["new project"]
    },

    /* ---------------- Din meny (profilbilden) ---------------- */
    {
      key: "your-profile",
      name: "Your profile",
      text: "Din egen sida som andra ser, med bild, beskrivning och dina projekt. Ungefär ditt visitkort på GitHub.",
      use: "När du vill se hur andra ser dig, eller ändra din presentation.",
      texts: ["your profile", "profile"],
      tags: ["a", "li", "span", "button"]
    },
    {
      key: "your-repositories",
      name: "Your repositories",
      text: "En lista över alla dina projekt (repon), både de du skapat och de du kopierat.",
      use: "När du letar efter ett av dina egna projekt.",
      aria: ["all repositories"],
      href: [/^\/repos\/?$/],
      texts: ["your repositories", "repositories", "all repositories"]
    },
    {
      key: "your-stars",
      name: "Your stars",
      text: "Alla projekt du har gett en stjärna, alltså sparat som favorit.",
      use: "När du vill hitta tillbaka till något du har sparat.",
      texts: ["your stars", "stars"],
      notWithin: SIDEBAR + ", .BorderGrid"
    },
    {
      key: "account-settings",
      name: "Settings (ditt konto)",
      text: "Inställningar för ditt eget konto, som namn, bild, lösenord och notiser. Projektens inställningar finns på ett annat ställe.",
      use: "När du vill byta bild, ändra lösenord eller få färre mejl från GitHub.",
      href: [/^\/settings(\/profile)?\/?$/]
    },
    {
      key: "sign-out",
      name: "Sign out",
      text: "Loggar ut dig från GitHub på den här datorn.",
      use: "När du har använt en dator som andra också använder.",
      texts: ["sign out"],
      href: [/^\/logout\/?$/]
    },

    /* ---------------- Projektets huvud (repo-sidan) ---------------- */
    {
      key: "tab-code",
      name: "Code",
      text: "Projektets startsida med alla filer och mappar, och välkomsttexten längre ner.",
      use: "När du vill se vad projektet innehåller eller komma tillbaka till början.",
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
      text: "Projektets lista med ärenden: frågor, felrapporter och idéer. Ett ärende (issue) är som en lapp på anslagstavlan.",
      use: "När du har hittat ett fel, har en fråga eller vill se om någon redan har rapporterat samma sak.",
      selectors: ['a[data-tab-item="issues"]', 'a[data-tab-item$="issues-tab"]'],
      ids: ["issues-tab"],
      href: [repo("/issues")],
      texts: ["issues"],
      tags: ["a", "li", "button"]
    },
    {
      key: "tab-pulls",
      name: "Pull requests",
      text: "Ändringsförslag som väntar på att bli godkända. Ett förslag (pull request) är när någon säger: titta på mina ändringar, vill ni ta in dem?",
      use: "När du vill se vad som är på väg att ändras, eller hur ditt eget förslag går.",
      selectors: ['a[data-tab-item="pull-requests"]', 'a[data-tab-item$="pull-requests-tab"]'],
      ids: ["pull-requests-tab"],
      href: [repo("/pulls")],
      texts: ["pull requests"],
      tags: ["a", "li", "button"]
    },
    {
      key: "tab-actions",
      name: "Actions",
      text: "Automatiska jobb som körs åt projektet, till exempel tester varje gång något ändras. Grön bock betyder att det gick bra.",
      use: "När du vill veta om något har gått sönder efter en ändring.",
      selectors: ['a[data-tab-item="actions"]', 'a[data-tab-item$="actions-tab"]'],
      ids: ["actions-tab"],
      href: [repo("/actions")],
      texts: ["actions"],
      tags: ["a", "li"]
    },
    {
      key: "tab-projects",
      name: "Projects",
      text: "Planeringstavlor där jobbet sorteras i kolumner, till exempel Att göra, Pågår och Klart.",
      use: "När du vill se vem som gör vad och hur långt arbetet har kommit.",
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
      text: "Projektets handbok, med sidor som förklarar hur saker fungerar.",
      use: "När välkomsttexten inte räcker och du vill läsa mer på djupet.",
      selectors: ['a[data-tab-item="wiki"]', 'a[data-tab-item$="wiki-tab"]'],
      ids: ["wiki-tab"],
      href: [repo("/wiki")],
      texts: ["wiki"],
      tags: ["a", "li"]
    },
    {
      key: "tab-security",
      name: "Security",
      text: "Säkerhetsvarningar för projektet, till exempel om det använder en gammal del med kända hål.",
      use: "När du vill veta om projektet är säkert att använda, eller hur du rapporterar ett problem.",
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
      text: "Statistik om projektet, till exempel hur många som jobbar i det och hur mycket som händer.",
      use: "När du vill veta om projektet lever eller har övergivits.",
      selectors: ['a[data-tab-item="insights"]', 'a[data-tab-item$="insights-tab"]'],
      ids: ["insights-tab"],
      href: [repo("/pulse"), repo("/graphs")],
      texts: ["insights"],
      tags: ["a", "li"]
    },
    {
      key: "tab-settings",
      name: "Settings (projektet)",
      text: "Inställningar för projektet, som namn, vem som får vara med och vad som syns. Bara ägarna ser fliken.",
      use: "När du äger projektet och vill bjuda in någon, byta namn eller göra det privat.",
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
      text: "Ett forum för projektet där man pratar fritt i trådar om frågor och idéer.",
      use: "När du har en fråga som inte är ett fel, till exempel hur man använder något.",
      selectors: ['a[data-tab-item="discussions"]', 'a[data-tab-item$="discussions-tab"]'],
      ids: ["discussions-tab"],
      href: [repo("/discussions")],
      texts: ["discussions"],
      tags: ["a", "li"]
    },
    {
      key: "more-tabs",
      name: "Fler flikar",
      text: "Flikar som inte fick plats på skärmen ligger gömda här.",
      use: "När du letar efter en flik som du inte ser.",
      aria: ["more items", "more", "additional navigation options", "open more actions menu"],
      texts: ["more items", "more"],
      within: REPO_NAV + ', .AppHeader-localBar, nav[aria-label="Repository files"], [class*="UnderlineWrapper"]'
    },
    {
      key: "repo-name",
      name: "Projektets namn",
      text: "Namnet på projektet du tittar på.",
      use: "När du vill tillbaka till projektets startsida.",
      href: [repo("")],
      within: "nav[aria-label=\"Breadcrumbs\"], .AppHeader-context, .AppHeader-globalBar, [itemprop=\"name\"], #repository-container-header h1, .AppHeader-context-full"
    },
    {
      key: "owner-name",
      name: "Ägarens namn",
      text: "Personen eller gruppen som äger projektet.",
      use: "När du vill se vad mer de har gjort.",
      href: [/^\/[^/]+\/?$/],
      within: "nav[aria-label=\"Breadcrumbs\"], .AppHeader-context, .AppHeader-context-full, [itemprop=\"author\"], #repository-container-header h1"
    },
    {
      key: "star",
      name: "Star",
      text: "Sparar projektet bland dina favoriter. Siffran visar hur många andra som har gjort samma sak.",
      use: "När du vill hitta tillbaka till projektet senare, eller visa att du gillar det.",
      aria: [/^star this repository/, /^unstar this repository/, "you must be signed in to star a repository", /^star /, /^unstar /],
      texts: ["star", "starred", "unstar"],
      tags: ["a", "button", "summary"]
    },
    {
      key: "star-list",
      name: "Stjärnlistor",
      text: "Lägger projektet i en egen lista bland dina favoriter, ungefär som en spellista.",
      use: "När du har många stjärnor och vill sortera dem.",
      aria: ["add this repository to a list", /add .* to a list/, "lists"]
    },
    {
      key: "fork",
      name: "Fork",
      text: "Gör en egen kopia av hela projektet på ditt konto. Originalet påverkas inte.",
      use: "När du vill ändra fritt i någon annans projekt, eller bygga vidare på det.",
      ids: ["fork-button"],
      aria: [/^fork your own copy/, "you must be signed in to fork a repository"],
      href: [repo("/fork")],
      texts: ["fork"],
      tags: ["a", "button"]
    },
    {
      key: "fork-list",
      name: "Dina forks",
      text: "Visar om du redan har en egen kopia av projektet.",
      use: "När du vill hitta din kopia eller skapa en ny.",
      aria: ["see your forks of this repository", /forks of this repository/]
    },
    {
      key: "watch",
      name: "Watch / Notifications",
      text: "Väljer hur mycket du vill höra om projektet, från allt som händer till bara det viktigaste. Notiserna hamnar i klockan.",
      use: "När du vill följa ett projekt utan att behöva gå in och kolla själv.",
      aria: ["you must be signed in to change notification settings", /^watch/, /^unwatch/, /notification settings/],
      texts: ["watch", "unwatch", "notifications", "watching", "stop ignoring"],
      tags: ["a", "button", "summary"],
      notWithin: SIDEBAR
    },
    {
      key: "sponsor",
      name: "Sponsor",
      text: "Skickar pengar till dem som gör projektet, som ett tack. Helt frivilligt.",
      use: "När du använder något mycket och vill hjälpa det att leva vidare.",
      texts: ["sponsor"],
      aria: [/^sponsor/],
      tags: ["a", "button"]
    },
    {
      key: "pin",
      name: "Pin",
      text: "Fäster projektet på din profilsida så att besökare ser det först.",
      use: "När du vill visa upp ett projekt du är stolt över.",
      texts: ["pin", "unpin"],
      tags: ["button", "summary"]
    },
    {
      key: "edit-repo-details",
      name: "Ändra projektinfo (kugghjulet)",
      text: "Ändrar texten i About-rutan: beskrivning, hemsida och ämnesord. Bara ägarna ser kugghjulet.",
      use: "När du vill att andra snabbt ska förstå vad ditt projekt är.",
      aria: ["edit repository metadata", "edit repository details"]
    },

    /* ---------------- Filer och mappar ---------------- */
    {
      key: "branch-picker",
      name: "Branch-väljaren",
      text: "Visar vilken version av projektet du tittar på. En branch är en parallell version där man testar saker utan att röra huvudversionen.",
      use: "När du vill se hur projektet ser ut i en annan version.",
      ids: [/ref-picker/, /branch-picker/, /^branch-select-menu/],
      aria: [/^.+ branch$/, "switch branches or tags", /^switch branches/, /^change branch/, "branch"],
      selectors: ['[data-hotkey="w"]', 'summary[title="Switch branches or tags"]', 'button[aria-label$=" branch"]', '#branch-select-menu summary']
    },
    {
      key: "branches",
      name: "Branches",
      text: "Alla parallella versioner av projektet. En branch är som en kopia där man provar idéer i lugn och ro.",
      use: "När du letar efter någons pågående arbete som inte är klart än.",
      href: [repo("/branches(/[^/]+)?")],
      texts: ["branches", "branch"],
      tags: ["a", "button", "li"]
    },
    {
      key: "tags",
      name: "Tags",
      text: "Bokmärken på viktiga punkter i projektets historia, ofta en färdig version som 1.0.",
      use: "När du behöver en viss äldre version av projektet.",
      href: [repo("/tags")],
      texts: ["tags", "tag"],
      tags: ["a", "button", "li"]
    },
    {
      key: "go-to-file",
      name: "Go to file",
      text: "Söker fram en fil i projektet när du skriver en del av namnet.",
      use: "När du vet vad filen heter men inte var den ligger.",
      aria: ["go to file", "go to file t", /^go to file/, "find file"],
      selectors: ['input[placeholder="Go to file"]', '[data-hotkey="t"]', '#file-tree-filter-field'],
      texts: ["go to file", "find file"]
    },
    {
      key: "add-file",
      name: "Add file",
      text: "Lägger till en ny fil eller laddar upp filer från din dator. Det sparas som en ändring i historiken.",
      use: "När du vill lägga in något i projektet utan att använda program på datorn.",
      aria: ["add file", /^add file/],
      texts: ["add file"],
      tags: ["button", "summary", "a"]
    },
    {
      key: "create-new-file",
      name: "Create new file",
      text: "Skapar en tom fil direkt i webbläsaren som du kan skriva i.",
      use: "När du snabbt vill lägga till en textfil, till exempel en anteckning eller instruktion.",
      href: [repoPrefix("/new/")],
      texts: ["create new file", "new file"]
    },
    {
      key: "upload-files",
      name: "Upload files",
      text: "Laddar upp filer från din dator till projektet. Du kan dra in dem eller välja dem.",
      use: "När du har filer på datorn som ska in i projektet.",
      href: [repoPrefix("/upload/")],
      texts: ["upload files", "upload file"]
    },
    {
      key: "more-actions",
      name: "Fler val (tre prickar)",
      text: "Fler val som inte fick plats, till exempel kopiera länk eller ladda ner.",
      use: "När du inte hittar det du letar efter bland knapparna.",
      aria: ["open more actions menu", "more options", "more file actions", "show more options", "more actions", "comment actions", "show options", "more items", "issue body actions", "pull request body actions", /list controls$/, "menu", /^actions for .*comment/, /body actions$/],
      selectors: ["summary.timeline-comment-action"],
      notWithin: REPO_NAV
    },

    /* ---------------- Den gröna Code-knappen och dess meny ---------------- */
    {
      key: "code-button",
      name: "Code (den gröna knappen)",
      text: "Visar hur du hämtar hem projektet till din dator, som en adress att kopiera eller som en zip-fil.",
      use: "När du vill ha projektet på din egen dator.",
      ids: [/^code-button/, /get-repo/],
      selectors: ['get-repo summary', 'get-repo button', '[data-testid="code-button"]', '.js-get-repo-dropdown summary'],
      texts: ["code"],
      tags: ["button", "summary"],
      notWithin: SEGMENTED + ", " + REPO_NAV
    },
    {
      key: "code-local",
      name: "Local",
      text: "Sätt att hämta projektet till din egen dator: kopiera adressen eller ladda ner en zip-fil.",
      use: "När du ska jobba med projektet i ett program på datorn.",
      texts: ["local"],
      tags: ["button", "a", "li", "span"]
    },
    {
      key: "code-codespaces",
      name: "Codespaces",
      text: "Öppnar projektet i en färdig dator i molnet, direkt i webbläsaren.",
      use: "När du vill testa koden utan att installera något.",
      texts: ["codespaces", "codespace"],
      tags: ["button", "a", "li", "span"]
    },
    {
      key: "code-create-codespace",
      name: "Create codespace",
      text: "Startar en ny dator i molnet med projektet redan på plats.",
      use: "När du vill börja ändra i projektet på en gång, direkt i webbläsaren.",
      texts: [/^create (a )?codespace( on .*)?$/],
      aria: [/^create (a )?codespace/]
    },
    {
      key: "code-https",
      name: "HTTPS",
      text: "En vanlig webbadress till projektet. Den fungerar oftast utan extra inställningar.",
      use: "När du ska hämta projektet till datorn och inte vet vilken adress du ska välja.",
      texts: ["https"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "code-ssh",
      name: "SSH",
      text: "En adress som använder en hemlig nyckel på din dator i stället för lösenord. Nyckeln måste läggas in på ditt konto först.",
      use: "När du hämtar och skickar ändringar ofta och vill slippa logga in varje gång.",
      texts: ["ssh"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "code-cli",
      name: "GitHub CLI",
      text: "Ett kommando för GitHubs eget program i Terminalen, fönstret där man skriver kommandon i stället för att klicka.",
      use: "När du redan använder Terminalen och vill hämta projektet därifrån.",
      texts: ["github cli", "cli"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "code-clone-url",
      name: "Projektets adress",
      text: "Adressen du använder för att hämta en egen kopia av projektet till datorn. Det kallas att klona.",
      use: "När ett program eller en guide ber dig om projektets adress.",
      aria: ["repository url", /clone url/, /^https url$/, /^ssh url$/],
      selectors: ['input[aria-label*="URL" i]', 'input#clone-with-https', 'input[data-autoselect]']
    },
    {
      key: "copy-url",
      name: "Kopiera",
      text: "Kopierar texten så att du kan klistra in den någon annanstans.",
      use: "När du ska klistra in adressen i ett program eller skicka den till någon.",
      aria: ["copy url to clipboard", "copy to clipboard", /^copy (?!head |branch ).*to clipboard$/, "copy", "copy path", "copy raw content", "copy raw file"],
      selectors: ["clipboard-copy"],
      notWithin: PR_TABS
    },
    {
      key: "open-desktop",
      name: "Open with GitHub Desktop",
      text: "Öppnar projektet i GitHub Desktop, ett program för datorn där du klickar i stället för att skriva kommandon.",
      use: "När du vill jobba med projektet på datorn utan att använda Terminalen.",
      aria: ["open this file in github desktop", /in github desktop$/],
      texts: ["open with github desktop", "github desktop"]
    },
    {
      key: "open-visual-studio",
      name: "Open with Visual Studio",
      text: "Öppnar projektet i kodprogrammet Visual Studio på din dator. Programmet måste vara installerat.",
      use: "När du ska ändra i koden och redan använder Visual Studio.",
      texts: ["open with visual studio", "visual studio"]
    },
    {
      key: "download-zip",
      name: "Download ZIP",
      text: "Laddar ner hela projektet som en zip-fil, alltså en packad mapp. Du får inga uppdateringar.",
      use: "När du bara vill titta på eller använda projektet, inte ändra i det.",
      href: [repoPrefix("/archive/")],
      texts: ["download zip"]
    },

    /* ---------------- Historik och innehåll ---------------- */
    {
      key: "commits",
      name: "Commits",
      text: "Projektets historik med alla sparade ändringar. En commit är en sparad ändring med en kort text om vad som ändrades.",
      use: "När du vill se vad som har ändrats och när.",
      href: [repoPrefix("/commits(/|$)")],
      texts: ["commits", "commit", "history", /^commits on /],
      tags: ["a", "button", "h2", "h3"],
      notWithin: PR_TABS
    },
    {
      key: "commit-link",
      name: "En commit",
      text: "En sparad ändring i projektet, en så kallad commit.",
      use: "När du vill se exakt vad som ändrades, rad för rad.",
      href: [repoPrefix("/commit/[0-9a-f]{6,}"), repoPrefix("/pull/\\d+/commits/[0-9a-f]{6,}")],
      texts: ["latest commit"]
    },
    {
      key: "readme",
      name: "README",
      text: "Projektets välkomsttext som berättar vad det är och hur man använder det.",
      use: "När du kommer till ett nytt projekt. Läs här först.",
      selectors: ['a[href$="#readme-ov-file"]', 'a[href$="#readme"]', "#readme h2", "#readme-ov-file"],
      texts: ["readme", "readme.md"],
      tags: ["a", "h2", "h3", "button", "span", "li"],
      notWithin: FILE_TABLE
    },
    {
      key: "license",
      name: "License",
      text: "Reglerna för hur du får använda koden, till exempel om du får bygga vidare på den.",
      use: "När du vill använda koden i något eget, särskilt i jobbet.",
      selectors: ['a[href*="-1-ov-file"]', 'a[href$="#license"]'],
      texts: ["license", /^[a-z0-9.\- ]+ license$/, "view license"],
      tags: ["a", "h3", "li"]
    },
    {
      key: "code-of-conduct",
      name: "Code of conduct",
      text: "Trivselregler för hur man beter sig mot varandra i projektet.",
      use: "När du ska skriva i projektet för första gången och vill veta vad som gäller.",
      selectors: ['a[href$="#coc-ov-file"]'],
      href: [/\/CODE_OF_CONDUCT(\.md)?$/i],
      texts: ["code of conduct"]
    },
    {
      key: "contributing",
      name: "Contributing",
      text: "Instruktioner för den som vill hjälpa till med projektet.",
      use: "När du vill föreslå en ändring och göra rätt från början.",
      selectors: ['a[href$="#contributing-ov-file"]'],
      href: [/\/CONTRIBUTING(\.md)?$/i],
      texts: ["contributing", "contributing guidelines"]
    },
    {
      key: "security-policy",
      name: "Security policy",
      text: "Berättar hur du i hemlighet säger till ägarna om du hittar ett säkerhetshål.",
      use: "När du har hittat något som kan missbrukas. Skriv inte om det öppet.",
      selectors: ['a[href$="#security-ov-file"]'],
      href: [repo("/security/policy"), /\/SECURITY(\.md)?$/i],
      texts: ["security policy", "security"],
      tags: ["a", "li", "span", "button"]
    },
    {
      key: "about",
      name: "About",
      text: "Kort fakta om projektet: vad det är, länk till hemsidan och ämnesord. Ägaren skriver texten själv.",
      use: "När du snabbt vill förstå vad projektet är utan att läsa allt.",
      texts: ["about"],
      tags: ["h2", "h3"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "about-website",
      name: "Projektets hemsida",
      text: "En länk till projektets egen webbplats.",
      use: "När du vill ha enklare guider än de som finns här på GitHub.",
      selectors: ['[class*="websiteRow"] a', '.BorderGrid-cell a[role="link"][href^="http"]', 'a[data-testid="repository-website-link"]']
    },
    {
      key: "custom-properties",
      name: "Custom properties",
      text: "Extra uppgifter som ägarna har lagt på projektet, till exempel vilket team som ansvarar.",
      use: "När du jobbar i en stor organisation och vill veta vem som äger vad.",
      href: [repo("/custom-properties")],
      texts: ["custom properties"]
    },
    {
      key: "topics",
      name: "Topics",
      text: "Ämnesord som beskriver projektet.",
      use: "När du vill hitta fler projekt om samma sak. Klicka på ett ord.",
      href: [/^\/topics\/[^/]+\/?$/],
      selectors: ["a.topic-tag"]
    },
    {
      key: "releases",
      name: "Releases",
      text: "Färdiga, utgivna versioner av projektet, ungefär som skivsläpp. Här finns ofta filer som är klara att ladda ner.",
      use: "När du vill ladda ner och använda programmet, inte koden.",
      href: [repo("/releases"), repoPrefix("/releases/tag/")],
      texts: ["releases", "release", "latest"],
      tags: ["a", "h2", "h3", "span"]
    },
    {
      key: "packages",
      name: "Packages",
      text: "Färdigpaketerade delar av projektet som andra program kan hämta. Många projekt har inga.",
      use: "När du bygger något eget och vill använda en del av projektet.",
      href: [/^\/(orgs|users)\/[^/]+\/packages/, /\/packages\/?$/],
      texts: ["packages"],
      tags: ["a", "h2", "h3"]
    },
    {
      key: "contributors",
      name: "Contributors",
      text: "Alla personer som har bidragit med ändringar i projektet.",
      use: "När du vill veta hur många som står bakom projektet.",
      href: [repo("/graphs/contributors")],
      texts: ["contributors"],
      tags: ["a", "h2", "h3"]
    },
    {
      key: "languages",
      name: "Languages",
      text: "Vilka programspråk koden är skriven i, och hur mycket av varje.",
      use: "När du vill veta vad du behöver kunna för att förstå eller ändra koden.",
      texts: ["languages"],
      tags: ["h2", "h3"]
    },
    {
      key: "stargazers",
      name: "Stars",
      text: "Hur många som har sparat projektet som favorit.",
      use: "När du vill veta hur populärt och beprövat projektet är.",
      href: [repo("/stargazers")],
      texts: ["stars"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "watchers",
      name: "Watchers",
      text: "Hur många som följer projektet och får notiser när något händer.",
      use: "När du vill se hur många som bryr sig om projektet.",
      href: [repo("/watchers")],
      texts: ["watching", "watchers"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "forks-count",
      name: "Forks",
      text: "Hur många som har gjort en egen kopia av projektet.",
      use: "När du vill veta om många bygger vidare på projektet.",
      href: [repo("/forks"), repo("/network/members")],
      texts: ["forks"],
      within: SIDEBAR + ", .BorderGrid, .Layout"
    },
    {
      key: "activity",
      name: "Activity",
      text: "En lista över det som hänt i projektet nyligen, till exempel vem som sparade ändringar och när.",
      use: "När du vill se om projektet är aktivt just nu.",
      href: [repo("/activity")],
      texts: ["activity"],
      tags: ["a"]
    },
    {
      key: "report-repo",
      name: "Report repository",
      text: "Anmäler projektet till GitHub om det innehåller något olämpligt eller farligt.",
      use: "När du hittar till exempel virus, bedrägerier eller kränkande innehåll.",
      texts: ["report repository", "report abuse", "report content", "report"],
      tags: ["a", "button", "li", "span"]
    },
    {
      key: "used-by",
      name: "Used by",
      text: "Hur många andra projekt som bygger på det här.",
      use: "När du vill veta hur viktigt och beprövat projektet är.",
      href: [repo("/network/dependents")],
      texts: ["used by"]
    },
    {
      key: "deployments",
      name: "Deployments",
      text: "När projektet senast lades ut på riktigt, till exempel som en webbsida som alla kan besöka.",
      use: "När du vill veta om den senaste ändringen har kommit ut på sajten.",
      href: [repo("/deployments(/.*)?")],
      texts: ["deployments", "environments", "view deployment", "deployed", "show environments", "hide environments", "hide environments show environments", /successfully deployed$/, /^this branch was successfully deployed/, /has not been deployed$/],
      tags: ["a", "h2", "h3", "button", "summary"]
    },
    {
      key: "folder-row",
      name: "En mapp",
      text: "En mapp i projektet.",
      use: "När du vill se vad som ligger i den. Klicka för att öppna.",
      href: [repoPrefix("/tree/")],
      within: FILE_TABLE
    },
    {
      key: "file-row",
      name: "En fil",
      text: "En fil i projektet.",
      use: "När du vill läsa vad som står i den. Klicka för att öppna.",
      href: [repoPrefix("/blob/")],
      within: FILE_TABLE
    },
    {
      key: "view-all-files",
      name: "View all files",
      text: "Visar hela listan med filer och mappar när den har kortats ner.",
      use: "När du inte hittar filen du letar efter i listan.",
      selectors: ['[data-testid="view-all-files-row"] button'],
      texts: ["view all files"]
    },
    {
      key: "outline",
      name: "Outline",
      text: "En innehållsförteckning över texten.",
      use: "När texten är lång och du vill hoppa till en viss rubrik.",
      aria: ["outline", "table of contents"]
    },
    {
      key: "view-code",
      name: "Code (visningsläge)",
      text: "Visar filens innehåll som text med radnummer.",
      use: "När du vill läsa själva koden, eller hänvisa till en viss rad.",
      texts: ["code"],
      within: SEGMENTED
    },
    {
      key: "blame",
      name: "Blame",
      text: "Visar vem som senast ändrade varje rad, och när.",
      use: "När du undrar varför något ser ut som det gör och vill veta vem du kan fråga.",
      href: [repoPrefix("/blame/")],
      texts: ["blame"]
    },
    {
      key: "preview",
      name: "Preview",
      text: "Visar hur texten kommer att se ut när den är klar, med rubriker och bilder.",
      use: "När du vill kolla att allt ser rätt ut innan du sparar eller skickar.",
      texts: ["preview"],
      tags: ["button", "a", "li", "span", "label"]
    },
    {
      key: "raw",
      name: "Raw",
      text: "Visar filen som ren text, utan färger och knappar.",
      use: "När du vill kopiera hela filen eller spara den.",
      href: [/^\/[^/]+\/[^/]+\/raw\//],
      texts: ["raw"],
      aria: ["view raw"]
    },
    {
      key: "download-raw",
      name: "Ladda ner filen",
      text: "Laddar ner just den här filen till din dator.",
      use: "När du bara behöver en fil och inte hela projektet.",
      aria: ["download raw content", "download raw file", "download"]
    },
    {
      key: "edit-file",
      name: "Ändra filen (pennan)",
      text: "Ändrar filen direkt i webbläsaren. När du sparar hamnar ändringen i historiken.",
      use: "När du vill rätta något litet, som ett stavfel, utan att använda program på datorn.",
      aria: ["edit file", "edit this file", /^edit the file/, "edit in place", /^you must be signed in and have push access/],
      href: [repoPrefix("/edit/")]
    },
    {
      key: "symbols",
      name: "Symbols",
      text: "En innehållsförteckning över kodens delar, till exempel namnen på funktioner.",
      use: "När filen är lång och du letar efter en viss del av koden.",
      aria: ["symbols", "open symbols panel", "toggle symbols panel"],
      texts: ["symbols"]
    },
    {
      key: "file-tree",
      name: "Filträdet",
      text: "Visar eller döljer listan med alla mappar och filer till vänster.",
      use: "När du vill se var i projektet du är, eller få mer plats.",
      aria: ["expand file tree", "collapse file tree", "side panel", "open side panel", "close side panel", "toggle file tree"]
    },

    /* ---------------- Issues ---------------- */
    {
      key: "new-issue",
      name: "New issue",
      text: "Skapar ett nytt ärende (issue), alltså en lapp om ett problem, en fråga eller en idé.",
      use: "När något inte fungerar eller du har en idé. Beskriv tydligt vad som har hänt.",
      href: [repoPrefix("/issues/new")],
      texts: ["new issue", "create new issue", "submit new issue"],
      tags: ["a", "button", "summary", "li"]
    },
    {
      key: "create-issue",
      name: "Create",
      text: "Skickar in ditt nya ärende så att alla i projektet kan se det. Du kan ändra texten efteråt.",
      use: "När du har skrivit klart och vill att någon ska se det.",
      texts: ["create", "submit new issue"],
      tags: ["button"],
      page: repo("/issues/new(/choose)?")
    },
    {
      key: "issues-filter",
      name: "Sök och filtrera",
      text: "Sök och filter för listan, till exempel bara öppna ärenden eller bara dina egna.",
      use: "När listan är lång och du letar efter något särskilt.",
      aria: ["search issues", "search all issues", "filter issues", "clear filter", "search pull requests", "search all pull requests", "filter", "filter pull requests"],
      selectors: ['input#js-issues-search', 'input[name="q"][placeholder*="is:"]']
    },
    {
      key: "list-search-button",
      name: "Sök",
      text: "Söker i listan med det du har skrivit i rutan.",
      use: "När du har skrivit ett sökord och vill se resultatet.",
      aria: ["search"],
      texts: ["search"],
      tags: ["button"],
      page: repo("/(issues|pulls|discussions)")
    },
    {
      key: "issue-link",
      name: "En issue",
      text: "Ett ärende (issue), alltså en lapp om ett problem eller en idé.",
      use: "När du vill läsa hela ärendet och se svaren.",
      selectors: ['a[data-testid="issue-listitem-title-link"]', 'a[data-testid="listitem-title-link"][href*="/issues/"]', 'h3:has(> a[data-testid="issue-listitem-title-link"])', 'h3:has(> a[data-testid="listitem-title-link"][href*="/issues/"])', 'a[id^="issue_"][href*="/issues/"]'],
      href: [repo("/issues/\\d+")]
    },
    {
      key: "pull-link",
      name: "En pull request",
      text: "Ett ändringsförslag (pull request).",
      use: "När du vill se vad som föreslås och vad andra tycker.",
      selectors: ['a[data-testid="listitem-title-link"][href*="/pull/"]', 'h3:has(> a[data-testid="listitem-title-link"][href*="/pull/"])', 'a[data-testid="pr-listitem-title-link"]', 'a[id^="issue_"][href*="/pull/"]', "a.js-navigation-open[href*='/pull/']"],
      href: [repo("/pull/\\d+")],
      notWithin: PR_TABS
    },
    {
      key: "filter-by",
      name: "Filter",
      text: "Visar bara det som matchar ditt val, till exempel det en viss person har skrivit. Resten göms.",
      use: "När du bara vill se en del av listan.",
      aria: [/^filter by (?!labels?( |$)|milestones?$|assignees?$|projects?$)/, /^commits by /],
      texts: [/^filter by /],
      selectors: ['a[data-testid="author-filter-link"]']
    },
    {
      key: "sort-by",
      name: "Sortera",
      text: "Ändrar ordningen på listan, till exempel nyast eller mest kommenterat först.",
      use: "När du vill se det senaste eller det mest omdiskuterade först.",
      aria: [/^sort by/, "sort"],
      texts: ["sort", "newest", "oldest", /^sort by/],
      tags: ["button", "summary"]
    },
    {
      key: "density",
      name: "Visningstäthet",
      text: "Ändrar hur tätt listan visas, luftigt eller kompakt. Det påverkar bara din skärm.",
      use: "När du vill se fler rader på en gång, eller tycker att det är för trångt.",
      aria: [/display density$/]
    },
    {
      key: "saved-views",
      name: "Färdiga filter",
      text: "Färdiga snabbval, till exempel ärenden du har skapat eller blivit nämnd i.",
      use: "När du snabbt vill se det som rör dig.",
      texts: ["assigned to me", "created by me", "mentioned", "recent activity", "views", "your views", "open issues", "issues", "pull requests"],
      within: '[class*="SavedViews"], [aria-label="Issues sidebar"], aside, [class*="SidebarNavigation"], [data-testid="issues-sidebar"]'
    },
    {
      key: "collapse-sidebar",
      name: "Fäll ihop sidomenyn",
      text: "Döljer eller visar menyn till vänster.",
      use: "När du vill ha mer plats för listan.",
      aria: ["collapse sidebar", "expand sidebar"],
      texts: ["collapse sidebar", "expand sidebar"]
    },
    {
      key: "pagination",
      name: "Sidor",
      text: "Listan är uppdelad på flera sidor.",
      use: "När du inte hittar det du letar efter på den här sidan.",
      aria: ["page", "next page", "previous page", /^page /, "previous", "next"],
      texts: ["next", "previous", "prev"],
      selectors: ['nav[aria-label="Pagination"] a', ".pagination a", '[class*="Pagination"] a'],
      tags: ["a", "button"]
    },
    {
      key: "list-open",
      name: "Open",
      text: "Visar det som inte är klart än. Siffran visar hur många som väntar.",
      use: "När du vill se vad som behöver göras.",
      texts: ["open"],
      tags: ["a", "button", "li"],
      page: repo("/(issues|pulls)")
    },
    {
      key: "list-closed",
      name: "Closed",
      text: "Visar det som redan är löst eller stängt.",
      use: "När du undrar om ett problem redan har fixats.",
      texts: ["closed"],
      tags: ["a", "button", "li"],
      page: repo("/(issues|pulls)")
    },
    {
      key: "state-badge",
      name: "Status",
      text: "Visar läget. Open betyder inte klart, Closed klart, Merged att ändringarna är inlagda och Draft att det är ett utkast.",
      use: "När du snabbt vill veta om något fortfarande pågår.",
      selectors: ['[title^="Status:"]', ".State", '[data-testid="header-state"]', '[class*="StateLabel"]', 'a[href*="state%3Aclosed%20reason"]', 'a[href*="reason%3Acompleted"]', 'a[href*="reason%3Anot-planned"]'],
      tags: ["span", "div", "a"]
    },
    {
      key: "labels",
      name: "Labels",
      text: "Färgade etiketter som sorterar ärenden, till exempel bugg eller idé.",
      use: "När du vill sortera ärenden eller hitta alla av samma sort.",
      aria: ["edit labels", "select labels", "labels", "label", /^filter by labels?( |$)/],
      selectors: ['a[href*="label%3A"]', 'a[href*="label:"]', "a.IssueLabel", 'a[class*="IssueLabel"]', '[data-testid="issue-labels"] a'],
      href: [repo("/labels"), repoPrefix("/labels/")],
      texts: ["labels", "label"],
      tags: ["a", "button", "summary", "h2", "h3", "span", "li"]
    },
    {
      key: "milestones",
      name: "Milestones",
      text: "En milstolpe samlar ärenden som ska vara klara till ett visst mål, till exempel nästa version.",
      use: "När du vill se hur långt det är kvar till nästa version.",
      aria: ["edit milestone", "select milestones", "milestone", "milestones", /^filter by milestones?$/],
      href: [repo("/milestones"), repoPrefix("/milestone/")],
      texts: ["milestones", "milestone", "no milestone"],
      tags: ["a", "button", "summary", "h2", "h3", "span", "li"]
    },
    {
      key: "assignees",
      name: "Assignees",
      text: "Den eller de som ansvarar för att lösa ärendet.",
      use: "När du vill veta vem du ska fråga, eller ta på dig ett ärende.",
      aria: ["edit assignees", "select assignees", "assignees", "assignee", /^filter by assignees?$/, /^filter by assignee /],
      texts: ["assignees", "assignee", "assign yourself", "no one assigned"],
      tags: ["a", "button", "summary", "h2", "h3", "span", "li"]
    },
    {
      key: "issue-type",
      name: "Type",
      text: "Vilken sorts ärende det är, till exempel en bugg, en ny funktion eller en uppgift.",
      use: "När du vill sortera ärenden så att rätt person hittar dem.",
      aria: ["edit type", "edit issue type", "select issue type"],
      texts: ["type", "issue type", "no type"],
      tags: ["button", "summary", "h2", "h3", "span"],
      within: SIDEBAR
    },
    {
      key: "development",
      name: "Development",
      text: "Kopplar ärendet till en arbetskopia (branch) eller ett ändringsförslag som löser det. När förslaget läggs in stängs ärendet av sig självt.",
      use: "När du vill se om någon redan jobbar på att lösa ärendet.",
      aria: ["link a branch, pull request, or commit", "edit development", /^development/, "link issues"],
      texts: ["development"],
      tags: ["button", "summary", "h2", "h3", "span"]
    },
    {
      key: "create-branch",
      name: "Create a branch",
      text: "Skapar en egen arbetskopia (branch) för att lösa just det här ärendet. Huvudversionen påverkas inte.",
      use: "När du ska börja jobba på ärendet och vill hålla isär det från annat.",
      texts: ["create a branch", "create branch", /^create a branch for this issue/]
    },
    {
      key: "relationships",
      name: "Relationships",
      text: "Kopplar ärendet till andra ärenden, till exempel om det är en del av ett större.",
      use: "När du vill se helheten som ärendet hör till.",
      texts: ["relationships", "add parent", "create sub-issue", "add sub-issue", "sub-issues"]
    },
    {
      key: "subscribe",
      name: "Subscribe / Notifications",
      text: "Väljer om du får notiser när någon skriver här.",
      use: "När du vill följa ett ärende utan att själv svara.",
      texts: ["subscribe", "unsubscribe", "notifications", "customize", "notifications customize"],
      tags: ["button", "summary", "h2", "h3", "span"],
      within: SIDEBAR
    },
    {
      key: "participants",
      name: "Participants",
      text: "Alla som har skrivit eller deltagit i samtalet.",
      use: "När du vill se vilka som är inblandade.",
      selectors: [".participation .discussion-sidebar-heading"],
      texts: ["participants", "participant"],
      tags: ["h2", "h3", "span", "div"]
    },
    {
      key: "lock",
      name: "Lock conversation",
      text: "Stänger för nya kommentarer. Ägarna kan öppna igen.",
      use: "När ett samtal har blivit för hetsigt eller spårat ur.",
      texts: ["lock conversation", "unlock conversation"]
    },
    {
      key: "pin-issue",
      name: "Pin issue",
      text: "Fäster ärendet överst i listan så att alla ser det först.",
      use: "När något är viktigt för alla att känna till.",
      texts: ["pin issue", "unpin issue"]
    },
    {
      key: "transfer-issue",
      name: "Transfer issue",
      text: "Flyttar ärendet till ett annat projekt.",
      use: "När ärendet har hamnat på fel ställe.",
      texts: ["transfer issue"]
    },
    {
      key: "delete-issue",
      name: "Delete issue",
      text: "Tar bort ärendet för alltid. Det går inte att ångra.",
      use: "När ärendet är skräp eller spam. Annars är det bättre att stänga det.",
      texts: ["delete issue"]
    },
    {
      key: "duplicate-issue",
      name: "Duplicate issue",
      text: "Gör en kopia av ärendet som du kan ändra i.",
      use: "När ett nytt ärende liknar ett gammalt och du vill slippa skriva allt igen.",
      texts: ["duplicate issue"]
    },
    {
      key: "comment",
      name: "Comment",
      text: "Skickar din kommentar så att alla i samtalet kan läsa den.",
      use: "När du har skrivit klart ditt svar.",
      texts: ["comment", "add comment", "add a comment", "reply"],
      tags: ["button"]
    },
    {
      key: "comment-box",
      name: "Kommentarsrutan",
      text: "Här skriver du ditt svar. Du kan dra in bilder, och skriver du @ och ett namn får personen en notis.",
      use: "När du vill svara, ställa en fråga eller be någon om hjälp.",
      aria: ["markdown value", "comment body", "add a comment", "use markdown to format your comment"],
      texts: ["add a comment"],
      selectors: ['textarea[name="comment[body]"]', 'textarea#new_comment_field', 'textarea[placeholder*="comment" i]']
    },
    {
      key: "write-tab",
      name: "Write",
      text: "Läget där du skriver din text.",
      use: "När du vill fortsätta skriva efter att ha tittat i Preview.",
      texts: ["write", "edit"],
      tags: ["button", "a"],
      within: '[role="tablist"], .tabnav-tabs, [class*="MarkdownEditor"], .CommentBox-header, [class*="Toolbar"], .js-previewable-comment-form'
    },
    {
      key: "close-issue",
      name: "Close issue",
      text: "Markerar ärendet som klart, eller som något som inte ska göras. Det går att öppna igen.",
      use: "När problemet är löst och ingen behöver göra mer.",
      texts: ["close issue", "close with comment", "close as completed", "close as not planned", "close as duplicate"],
      tags: ["button", "li", "span"]
    },
    {
      key: "close-options",
      name: "Fler sätt att stänga",
      text: "Väljer varför ärendet stängs: det är klart, ska inte göras, eller finns redan.",
      use: "När du vill att andra ska förstå varför ärendet stängdes.",
      aria: ["more options", "close issue options", /^close .*options/, "select a reason for closing"],
      within: '[class*="CommentBox"], .js-comment-form-actions, form, [class*="ActionBar"]'
    },
    {
      key: "reopen-issue",
      name: "Reopen issue",
      text: "Öppnar ett stängt ärende igen.",
      use: "När problemet har kommit tillbaka.",
      texts: ["reopen issue", "reopen", "reopen with comment"]
    },
    {
      key: "reactions",
      name: "Reaktioner (emoji)",
      text: "Svara med en emoji i stället för att skriva, till exempel tumme upp.",
      use: "När du vill hålla med eller tacka utan att fylla samtalet med text.",
      aria: ["add or remove reactions", "add reaction", "all reactions", "reactions", "react", /^react with/, /reactions?$/, /^reactions/],
      selectors: ['.social-reaction-summary-item', 'button[data-testid="reaction-button"]']
    },
    {
      key: "edit-generic",
      name: "Edit",
      text: "Ändrar texten. Bara den som skrev den eller ägarna kan göra det.",
      use: "När du har skrivit fel eller vill lägga till något.",
      aria: ["edit title", "edit issue title", "edit pull request title", "edit comment", "edit issue body"],
      texts: ["edit"],
      tags: ["button"],
      notWithin: '[role="tablist"]'
    },
    {
      key: "timestamp",
      name: "Tidpunkt",
      text: "När texten skrevs. Klicka för en direktlänk till just den här kommentaren.",
      use: "När du vill skicka någon till exakt den här kommentaren.",
      selectors: ['a[data-testid="issue-body-header-link"]', "a:has(> relative-time)", 'a[data-testid*="timestamp"]', "a.js-timestamp"]
    },
    {
      key: "edit-history",
      name: "Edited",
      text: "Visar att texten har ändrats efter att den skrevs. Klicka för att se vad som ändrades.",
      use: "När du undrar vad som stod där från början.",
      texts: [/^last edited by /, "edited", /^edited by /],
      tags: ["button", "summary", "span"]
    },
    {
      key: "load-more",
      name: "Load more",
      text: "Samtalet är långt, så en del är gömt.",
      use: "När du vill läsa hela samtalet.",
      texts: ["load more", "remaining items", "hidden items", /^load more/],
      tags: ["button", "h3", "span"]
    },
    {
      key: "linked-issues",
      name: "Länkade issues",
      text: "Ärenden som stängs automatiskt när det här förslaget läggs in.",
      use: "När du vill veta vilka problem förslaget löser.",
      aria: [/^linked issues? for /, /linked issues?$/],
      href: [repo("/issues/\\d+/linked_closing_reference")]
    },
    {
      key: "pr-stack",
      name: "Stack",
      text: "Förslaget är en del av en serie förslag som bygger på varandra. Siffrorna visar ordningen.",
      use: "När du vill granska förslagen i rätt ordning.",
      aria: [/^pull request stack/]
    },
    {
      key: "quote-reply",
      name: "Quote reply",
      text: "Svarar på kommentaren och citerar den.",
      use: "När du vill att alla ska se exakt vad du svarar på.",
      texts: ["quote reply"]
    },
    {
      key: "copy-link",
      name: "Copy link",
      text: "Kopierar en direktlänk till just den här kommentaren.",
      use: "När du vill skicka kommentaren till någon.",
      aria: ["copy link"],
      texts: ["copy link"]
    },
    {
      key: "mention",
      name: "Ett @namn",
      text: "Ett användarnamn på GitHub.",
      use: "När du vill veta vem personen är. Klicka för att se profilen.",
      aria: [/'s profile$/],
      href: [new RegExp("^/" + RESERVED + "[^/]+/?$", "i")],
      notWithin: '[data-listview-component="items-list"], nav, dialog, [role="dialog"], [role="menu"], .AppHeader-context, #repository-container-header h1',
      selectors: ['a[data-testid="issue-body-header-author"]', 'a[data-testid="avatar-link"]', 'a[data-testid="actor-link"]', '[data-testid="comment-header"] a[class*="authorLink"]', '[data-testid="comment-header"] a[href^="/"]:not([href*="/issues/"]):not([href*="/pull/"])', "a.user-mention", "a.author", '[data-hovercard-type="user"]', 'a[data-testid="issue-body-header-author"]']
    },

    /* ---------------- Pull requests ---------------- */
    {
      key: "new-pull",
      name: "New pull request",
      text: "Föreslår att dina ändringar ska läggas in i projektet. Ett förslag (pull request) kan andra läsa, kommentera och godkänna.",
      use: "När du har ändrat något i en kopia och vill att det ska in i originalet.",
      href: [repo("/compare"), repoPrefix("/pull/new/")],
      texts: ["new pull request", "create pull request", "compare & pull request", "create draft pull request"],
      tags: ["a", "button"]
    },
    {
      key: "pr-conversation",
      name: "Conversation",
      text: "Samtalet om förslaget: kommentarer, granskningar och allt som har hänt.",
      use: "När du vill förstå vad förslaget handlar om. Börja här.",
      href: [repo("/pull/\\d+")],
      texts: ["conversation"],
      tags: ["a", "button", "li"],
      within: PR_TABS + ", nav, [role=\"tablist\"]"
    },
    {
      key: "pr-commits",
      name: "Commits (i förslaget)",
      text: "Alla sparade ändringar som ingår i förslaget, i den ordning de gjordes.",
      use: "När du vill följa hur förslaget har vuxit fram steg för steg.",
      href: [repo("/pull/\\d+/commits")],
      texts: ["commits"],
      tags: ["a", "button", "li"],
      within: PR_TABS + ", nav, [role=\"tablist\"]"
    },
    {
      key: "pr-checks",
      name: "Checks",
      text: "Automatiska tester som körs på ändringarna. Grön bock betyder att allt gick bra, rött kryss att något gick fel.",
      use: "När du vill veta om förslaget är säkert att lägga in.",
      href: [repo("/pull/\\d+/checks")],
      texts: ["checks"],
      tags: ["a", "button", "li"]
    },
    {
      key: "pr-files",
      name: "Files changed",
      text: "Exakt vilka rader som har ändrats. Grönt är nytt och rött är borttaget.",
      use: "När du vill se vad förslaget faktiskt ändrar.",
      href: [repo("/pull/\\d+/files"), repo("/pull/\\d+/changes")],
      texts: ["files changed", "files", "changes"],
      tags: ["a", "button", "li"],
      within: PR_TABS + ", nav, [role=\"tablist\"], #issuecomment-new, .js-comment-form"
    },
    {
      key: "copy-branch",
      name: "Kopiera branch-namnet",
      text: "Kopierar namnet på arbetskopian (branch) där ändringarna gjordes.",
      use: "När du vill hämta just den versionen till datorn och prova den.",
      aria: ["copy head branch name to clipboard", "copy branch name to clipboard", /branch name to clipboard/]
    },
    {
      key: "reviewers",
      name: "Reviewers",
      text: "Personer som ska läsa och godkänna ändringarna innan de läggs in.",
      use: "När du vill att någon ska kolla ditt förslag så att inget går sönder.",
      aria: ["request a review", "edit reviewers", "select reviewers", "reviewers", "request review", /^awaiting requested review/],
      texts: ["reviewers", "reviewer", "no reviews", /^more reviewers?$/],
      tags: ["a", "button", "summary", "h2", "h3", "span"]
    },
    {
      key: "review-changes",
      name: "Review changes",
      text: "Här lämnar du din granskning: godkänn, be om ändringar eller kommentera.",
      use: "När du har läst förslaget och vill säga vad du tycker.",
      texts: ["review changes", "submit review", "finish your review", "add your review", "review"],
      tags: ["button", "summary"]
    },
    {
      key: "approve",
      name: "Approve",
      text: "Säger att ändringarna är bra och kan läggas in.",
      use: "När du har läst förslaget och inte hittat något fel.",
      texts: ["approve", "approve changes"],
      tags: ["label", "input", "button", "span", "li"]
    },
    {
      key: "request-changes",
      name: "Request changes",
      text: "Säger att något behöver fixas innan ändringarna kan läggas in.",
      use: "När du har hittat fel. Skriv gärna vad.",
      texts: ["request changes"],
      tags: ["label", "input", "button", "span", "li"]
    },
    {
      key: "start-review",
      name: "Start a review",
      text: "Samlar dina kommentarer och skickar alla på en gång.",
      use: "När du har flera saker att säga och inte vill skicka en notis per kommentar.",
      texts: ["start a review", "add review comment"]
    },
    {
      key: "single-comment",
      name: "Add single comment",
      text: "Skickar bara den här kommentaren direkt, utan en hel granskning.",
      use: "När du bara har en snabb fråga eller kommentar.",
      texts: ["add single comment"]
    },
    {
      key: "merge",
      name: "Merge pull request",
      text: "Lägger in ändringarna i huvudversionen av projektet.",
      use: "När alla är nöjda och testerna är gröna.",
      texts: ["merge pull request", "merge", "merge when ready", "merge without waiting for requirements to be met"],
      tags: ["button", "summary"]
    },
    {
      key: "squash-merge",
      name: "Squash and merge",
      text: "Lägger in ändringarna men slår ihop alla sparpunkter till en enda.",
      use: "När du vill att historiken ska vara kort och lätt att läsa.",
      texts: ["squash and merge", "create a merge commit"],
      tags: ["button", "li", "span", "label"]
    },
    {
      key: "rebase-merge",
      name: "Rebase and merge",
      text: "Lägger in varje sparpunkt för sig, efter de senaste ändringarna, så att historiken blir en rak linje.",
      use: "När projektet vill behålla varje steg men utan förgreningar.",
      texts: ["rebase and merge"],
      tags: ["button", "li", "span", "label"]
    },
    {
      key: "confirm-merge",
      name: "Confirm merge",
      text: "Sista steget, som verkligen lägger in ändringarna i huvudversionen.",
      use: "När du är säker på att förslaget ska in.",
      texts: ["confirm merge", "confirm squash and merge", "confirm rebase and merge"]
    },
    {
      key: "merge-method",
      name: "Välj sätt att lägga in",
      text: "Väljer hur ändringarna läggs in: som de är, ihopslagna till en, eller i rak följd.",
      use: "När du ska lägga in ett förslag. Är du osäker, välj det projektet brukar använda.",
      aria: ["select merge method", "merge options", /merge method/],
      selectors: ['.merge-box-button summary', '.BtnGroup-parent.js-merge-method-menu summary']
    },
    {
      key: "auto-merge",
      name: "Enable auto-merge",
      text: "Lägger in ändringarna automatiskt så fort testerna är gröna och någon har godkänt.",
      use: "När du inte vill sitta och vänta på att allt blir klart.",
      texts: ["enable auto-merge", "disable auto-merge"]
    },
    {
      key: "update-branch",
      name: "Update branch",
      text: "Hämtar in de senaste ändringarna från huvudversionen till ditt förslag.",
      use: "När GitHub säger att ditt förslag ligger efter.",
      texts: ["update branch", "update with merge commit", "update with rebase"]
    },
    {
      key: "close-pull",
      name: "Close pull request",
      text: "Stänger förslaget utan att lägga in ändringarna. Det går att öppna igen.",
      use: "När förslaget inte behövs längre.",
      texts: ["close pull request"]
    },
    {
      key: "ready-for-review",
      name: "Ready for review",
      text: "Säger att ditt utkast är klart att granskas. Granskarna får en notis.",
      use: "När du är klar och vill ha synpunkter.",
      texts: ["ready for review"]
    },
    {
      key: "convert-to-draft",
      name: "Convert to draft",
      text: "Gör förslaget till ett utkast igen.",
      use: "När du har mer att göra och inte vill att någon granskar än.",
      texts: ["convert to draft"]
    },
    {
      key: "delete-branch",
      name: "Delete branch",
      text: "Tar bort arbetskopian när ändringarna redan är inlagda. Inget av det inlagda försvinner.",
      use: "När förslaget är klart och du vill städa.",
      texts: ["delete branch", "restore branch"]
    },
    {
      key: "revert",
      name: "Revert",
      text: "Skapar ett nytt förslag som tar tillbaka ändringarna. Inget raderas, det läggs bara till en ångring.",
      use: "När en inlagd ändring ställde till problem.",
      texts: ["revert"]
    },
    {
      key: "resolve-conversation",
      name: "Resolve conversation",
      text: "Markerar att en fråga i granskningen är löst, så att den fälls ihop.",
      use: "När du har fixat det någon påpekade.",
      texts: ["resolve conversation", "unresolve conversation", "resolve"]
    },
    {
      key: "viewed",
      name: "Viewed",
      selectors: ["input.js-reviewed-checkbox", 'input[name="viewed"]'],
      text: "En bock som fäller ihop filen när du har läst den.",
      use: "När du granskar många filer och vill hålla koll på var du är.",
      texts: ["viewed"],
      tags: ["label", "input", "button", "span"]
    },
    {
      key: "diff-unified",
      name: "Unified",
      text: "Visar gammal och ny kod i samma ruta, ovanför varandra.",
      use: "När skärmen är smal eller ändringarna är små.",
      selectors: ['input[value="unified"]'],
      texts: ["unified"]
    },
    {
      key: "diff-split",
      name: "Split",
      text: "Visar gammal kod till vänster och ny kod till höger.",
      use: "När du vill jämföra före och efter sida vid sida.",
      selectors: ['input[value="split"]'],
      texts: ["split"]
    },
    {
      key: "hide-whitespace",
      name: "Hide whitespace",
      text: "Döljer ändringar som bara är mellanslag och tomma rader.",
      use: "När du bara vill se det som verkligen har ändrats.",
      texts: ["hide whitespace", "hide whitespace changes"]
    },
    {
      key: "suggest-change",
      name: "Suggest change",
      text: "Föreslår en exakt ändring i koden som den andra kan godkänna med ett klick.",
      use: "När du ser hur något borde se ut och vill göra det enkelt för den andra.",
      aria: ["add a suggestion", "insert a suggestion", "suggest change"],
      texts: ["suggest change", "commit suggestion", "add suggestion to batch"]
    },

    {
      key: "branch-name",
      name: "Branch-namn",
      text: "Namnet på en arbetskopia (branch). Förslaget vill flytta ändringar från den ena till den andra.",
      use: "När du vill veta var ändringarna kommer ifrån och vart de ska.",
      selectors: ['a[data-component="BranchName"]', '[class*="BranchName"]', ".commit-ref a", ".head-ref a", ".base-ref a"]
    },
    {
      key: "force-pushed",
      name: "Force-pushed",
      text: "Någon har ersatt tidigare sparade ändringar i förslaget med nya.",
      use: "När du vill se vad som ändrades sedan du tittade sist.",
      texts: ["force-pushed", "force pushed"]
    },
    {
      key: "page-title",
      name: "Rubrik",
      text: "Rubriken på ärendet eller förslaget.",
      use: "När du snabbt vill veta vad saken handlar om.",
      selectors: ['[data-testid="issue-title"]', "bdi.markdown-title", "h1.gh-header-title", 'h1[data-component="PH_Title"]', 'h2:has(> bdi.markdown-title)', '[class*="PageHeader"] h1', '[class*="PageHeader"] h2']
    },
    {
      key: "bot",
      name: "Robot",
      text: "En robot, alltså ett program som hjälper projektet automatiskt, till exempel med tester eller uppdateringar.",
      use: "När du undrar vem som skrev något. Det var inte en människa.",
      href: [/^\/apps\/[^/]+\/?$/],
      texts: [/ bot$/]
    },
    {
      key: "close-dialog",
      name: "Stäng",
      text: "Stänger rutan utan att ändra något.",
      use: "När du öppnade något av misstag.",
      aria: ["close dialog", "close", "dismiss", "close modal", "close menu", /^dismiss/, /^close .*menu$/],
      texts: ["dismiss"],
      tags: ["button"]
    },
    {
      key: "view-reviewed-changes",
      name: "View reviewed changes",
      text: "Visar vilka ändringar granskaren tittade på när granskningen lämnades.",
      use: "När du vill veta om granskningen gäller den senaste versionen.",
      texts: ["view reviewed changes", "view changes"]
    },
    {
      key: "commit-message",
      name: "Hela beskrivningen",
      text: "Hela texten som skrevs när ändringen sparades.",
      use: "När du vill veta varför ändringen gjordes.",
      aria: ["commit message body", "show commit message", "toggle commit message", "open commit details"]
    },
    {
      key: "copy-sha",
      name: "Kopiera commit-koden",
      text: "Kopierar den unika koden för den här sparade ändringen, ungefär som ett kvittonummer.",
      use: "När någon ber dig om exakt vilken ändring det gäller.",
      aria: [/^copy full sha/, /^copy the full sha/, /^copy sha/]
    },
    {
      key: "browse-at-commit",
      name: "Browse repository at this point",
      text: "Visar hur hela projektet såg ut precis efter den här ändringen.",
      use: "När du vill bläddra tillbaka i tiden.",
      aria: ["browse repository at this point", /^browse the repository at this point/, "view code at this point"]
    },
    {
      key: "commit-range",
      name: "Välj commits",
      text: "Väljer vilka sparade ändringar du vill se. Från början visas alla.",
      use: "När du bara vill granska det som är nytt sedan sist.",
      texts: [/^changes from /, "all commits"],
      tags: ["summary", "button"]
    },
    {
      key: "file-filter",
      name: "File filter",
      text: "Visar bara vissa sorters filer, till exempel bara bilder eller bara kod.",
      use: "När förslaget ändrar många filer och du bara bryr dig om några.",
      texts: ["file filter"],
      tags: ["summary", "button"]
    },
    {
      key: "conversations-jump",
      name: "Conversations",
      text: "Hoppar mellan kommentarerna som granskarna har skrivit direkt i koden.",
      use: "När du ska svara på eller fixa alla kommentarer.",
      texts: ["conversations"],
      tags: ["summary", "button"]
    },
    {
      key: "jump-to",
      name: "Jump to",
      text: "Hoppar direkt till en viss fil eller version i listan.",
      use: "När listan är lång och du vet vad du letar efter.",
      texts: ["jump to", "jump to file", "jump to release"],
      tags: ["summary", "button"]
    },
    {
      key: "toggle-diff",
      name: "Fäll ihop filen",
      text: "Fäller ihop eller visar ändringarna i filen.",
      use: "När du vill korta listan och fokusera på andra filer.",
      aria: ["toggle diff contents", "collapse file", "expand file"]
    },
    {
      key: "expand-all",
      name: "Expand all",
      text: "Visar hela filen, inte bara raderna runt det som ändrats.",
      use: "När du behöver mer sammanhang för att förstå ändringen.",
      aria: ["expand all", "expand all lines", /^expand (up|down)/],
      texts: ["expand all"]
    },
    {
      key: "diff-file-name",
      name: "Filnamn",
      text: "Namnet på en fil som har ändrats.",
      use: "När du vill hoppa till just den filen.",
      selectors: ['a[href^="#diff-"]', ".file-info a.Link--primary"]
    },
    {
      key: "file-breadcrumb",
      name: "Sökvägen",
      text: "Visar var i projektets mappar du är just nu.",
      use: "När du vill tillbaka till en mapp längre upp. Klicka på namnet.",
      selectors: ['[data-testid="breadcrumbs"] a', '[data-testid="breadcrumbs-repo-link"]', "#repos-header-breadcrumb a", ".js-path-segment a"]
    },
    {
      key: "back-to-top",
      name: "Top",
      text: "Hoppar tillbaka till början av filen.",
      use: "När du har scrollat långt ner.",
      texts: ["top", "back to top"],
      tags: ["button", "a"]
    },
    /* ---------------- Actions och Releases ---------------- */
    {
      key: "new-workflow",
      name: "New workflow",
      text: "Skapar ett nytt automatiskt arbetsflöde, till exempel tester som körs varje gång någon sparar en ändring.",
      use: "När du vill att något ska hända av sig självt i projektet.",
      href: [repoPrefix("/actions/new")],
      texts: ["new workflow"]
    },
    {
      key: "run-workflow",
      name: "Run workflow",
      text: "Startar arbetsflödet direkt för hand.",
      use: "När du inte vill vänta på att det startar av sig självt.",
      texts: ["run workflow"]
    },
    {
      key: "rerun",
      name: "Re-run jobs",
      text: "Kör de automatiska jobben en gång till.",
      use: "När något stoppades av en tillfällighet och du vill prova igen.",
      texts: ["re-run jobs", "re-run all jobs", "re-run failed jobs", "re-run job", "re-run"]
    },
    {
      key: "new-release",
      name: "Draft a new release",
      text: "Ger ut en ny färdig version av projektet, med namn, beskrivning och filer att ladda ner.",
      use: "När du är klar med en version och vill att andra ska kunna använda den.",
      href: [repoPrefix("/releases/new")],
      texts: ["draft a new release", "create a new release", "new release"]
    },
    {
      key: "find-release",
      name: "Find a release",
      text: "Söker bland projektets utgivna versioner.",
      use: "När du letar efter en viss version, till exempel 2.0.",
      aria: ["find a release", "search releases"]
    },
    {
      key: "release-name",
      name: "En version",
      text: "En utgiven version av projektet, med det som är nytt i just den.",
      use: "När du vill veta vad som har ändrats i en uppdatering.",
      selectors: ['a[href^="#release-"]', 'h2 a[href*="/releases/tag/"]', '[data-testid="release-card"] h2 a']
    },
    {
      key: "release-compare",
      name: "Compare",
      text: "Jämför två versioner av projektet och visar skillnaden.",
      use: "När du vill se vad som har hänt mellan två versioner.",
      texts: ["compare"],
      tags: ["button", "summary", "a"]
    },
    {
      key: "release-assets",
      name: "Assets",
      text: "Filerna som hör till versionen, till exempel färdiga program eller koden som zip-fil.",
      use: "När du vill ladda ner och installera programmet.",
      texts: ["assets"],
      tags: ["summary", "button", "h2", "h3", "span"]
    },
    {
      key: "sync-fork",
      name: "Sync fork",
      text: "Hämtar in de senaste ändringarna från originalprojektet till din kopia.",
      use: "När din kopia har blivit gammal.",
      texts: ["sync fork"]
    },
    {
      key: "contribute",
      name: "Contribute",
      text: "Föreslår att dina ändringar i kopian ska läggas in i originalprojektet.",
      use: "När du har förbättrat något och vill dela med dig.",
      texts: ["contribute", "open pull request"]
    },

    /* ---------------- Nya huvudet och startsidan (inloggad, hösten 2026) ---------------- */
    {
      key: "global-menu-open",
      name: "Huvudmenyn",
      text: "Huvudmenyn med genvägar till allt som är ditt på GitHub, till exempel dina ärenden och ändringsförslag.",
      use: "När du vill hoppa snabbt mellan dina saker, oavsett vilken sida du är på.",
      aria: ["open menu"],
      within: 'header[aria-label="Global navigation menu"], .AppHeader'
    },
    {
      key: "switch-repo",
      name: "Switch repository",
      text: "En snabbväljare för att hoppa till ett annat av dina projekt.",
      use: "När du jobbar i flera projekt och vill byta utan att gå via startsidan.",
      aria: [/^switch repository/]
    },
    {
      key: "global-feed",
      name: "Feed",
      text: "Ett flöde med det som händer hos personer och projekt du följer, till exempel nya stjärnor och versioner.",
      use: "När du vill hålla dig uppdaterad om vad andra bygger.",
      aria: ["feed"],
      href: [/^\/feed\/?$/],
      texts: ["feed"],
      within: link("/feed")
    },
    {
      key: "repo-link",
      name: "Ett projekt",
      text: "En länk till ett projekt, ett så kallat repo.",
      use: "När du vill öppna projektet och se vad det innehåller.",
      href: [repo("")]
    },
    {
      key: "show-more",
      name: "Show more",
      text: "Visar fler rader i listan. Bara de första visas från början.",
      use: "När det du letar efter inte syns i listan.",
      texts: ["show more", "show more activity", "see more", "show less"],
      tags: ["a", "button"]
    },
    {
      key: "changelog",
      name: "Changelog",
      text: "GitHubs egna nyheter om funktioner som har lagts till eller ändrats.",
      use: "När du undrar varför något på GitHub ser annorlunda ut än förut.",
      selectors: ['a[href^="https://github.blog/changelog"]'],
      texts: ["latest from our changelog", "view changelog →", "view changelog"]
    },
    {
      key: "feedback",
      name: "Give feedback",
      text: "Skickar synpunkter till GitHub om en ny eller ändrad funktion.",
      use: "När något i GitHub krånglar eller känns konstigt och du vill säga till.",
      selectors: ['a[href^="https://gh.io/"][href*="feedback"]'],
      texts: ["give feedback", "feedback preview", "feedback"],
      tags: ["a", "button"]
    },
    {
      key: "docs-link",
      name: "GitHub Docs",
      text: "En länk till GitHubs egen hjälp, där funktionerna förklaras mer i detalj.",
      use: "När du vill läsa mer om hur något fungerar.",
      selectors: ['a[href^="https://docs.github.com"]']
    },

    /* ---------------- Projektsidan ---------------- */
    {
      key: "language-link",
      name: "Ett språk",
      text: "Ett av programspråken koden är skriven i, och hur stor del av koden det är.",
      use: "När du vill se vilka filer som är skrivna i just det språket.",
      selectors: ['a[href*="/search?l="]']
    },
    {
      key: "suggested-workflows",
      name: "Suggested workflows",
      text: "Förslag från GitHub på automatiska jobb (Actions) som passar projektet, till exempel tester.",
      use: "När du vill att något ska köras av sig självt utan att du skriver allt från början.",
      selectors: ['a[href*="filename=.github"]'],
      texts: ["suggested workflows"]
    },
    {
      key: "good-first-issues",
      name: "Good first issues",
      text: "En lista med enkla ärenden som passar den som vill börja hjälpa till i projektet.",
      use: "När du vill bidra till ett projekt för första gången.",
      href: [repo("/contribute")],
      within: 'a[href$="/contribute"]'
    },

    /* ---------------- Ärenden och ändringsförslag ---------------- */
    {
      key: "linked-pulls",
      name: "Linked pull requests",
      text: "Ändringsförslag som är kopplade till ärendet och kan lösa det.",
      use: "När du vill se om någon redan har gjort något för att lösa ärendet.",
      aria: ["linked pull requests", "linked pull request"]
    },
    {
      key: "fmt-heading",
      name: "Heading",
      text: "Gör den markerade raden till en rubrik.",
      use: "När ett långt svar behöver delas upp så att det blir lättare att läsa.",
      aria: [/^heading\b/],
      within: FORMAT
    },
    {
      key: "fmt-bold",
      name: "Bold",
      text: "Gör den markerade texten fet.",
      use: "När något i texten är extra viktigt.",
      aria: [/^bold\b/],
      within: FORMAT
    },
    {
      key: "fmt-italic",
      name: "Italic",
      text: "Gör den markerade texten kursiv, alltså lutande.",
      use: "När du vill betona ett ord lite lätt.",
      aria: [/^italic\b/],
      within: FORMAT
    },
    {
      key: "fmt-quote",
      name: "Quote",
      text: "Gör den markerade texten till ett citat, med ett streck framför.",
      use: "När du svarar på något någon annan har skrivit.",
      aria: [/^quote\b/],
      within: FORMAT
    },
    {
      key: "fmt-code",
      name: "Code",
      text: "Visar den markerade texten som kod, med ett annat typsnitt.",
      use: "När du skriver ett filnamn, ett kommando eller en bit kod.",
      aria: [/^code\b/],
      within: FORMAT
    },
    {
      key: "fmt-link",
      name: "Link",
      text: "Gör den markerade texten till en länk.",
      use: "När du vill hänvisa till en webbsida utan att klistra in hela adressen.",
      aria: [/^link\b/],
      within: FORMAT
    },
    {
      key: "fmt-list",
      name: "Lista",
      text: "Gör raderna till en punktlista eller en numrerad lista.",
      use: "När du räknar upp flera saker eller beskriver steg i ordning.",
      aria: [/^unordered list/, /^numbered list/, /^bulleted list/],
      within: FORMAT
    },
    {
      key: "fmt-tasklist",
      name: "Task list",
      text: "Gör raderna till en lista med rutor som går att bocka i.",
      use: "När du vill hålla koll på vad som är gjort och vad som är kvar.",
      aria: [/^task list/],
      within: FORMAT
    },
    {
      key: "fmt-mention",
      name: "Mention",
      text: "Lägger in ett @ så att du kan nämna en person. Personen får en notis.",
      use: "När du vill att någon särskild ska läsa det du skriver.",
      aria: [/^mention\b/],
      within: FORMAT
    },
    {
      key: "fmt-reference",
      name: "Reference",
      text: "Lägger in ett # så att du kan länka till ett annat ärende eller ändringsförslag.",
      use: "När två saker hänger ihop och du vill att andra ska se det.",
      aria: [/^reference\b/],
      within: FORMAT
    },
    {
      key: "fmt-slash",
      name: "Slash commands",
      text: "Genvägar som börjar med snedstreck, till exempel för att lägga in en tabell.",
      use: "När du vill lägga in något krångligare utan att skriva det själv.",
      aria: [/^slash commands/],
      within: FORMAT
    },
    {
      key: "saved-replies",
      name: "Saved replies",
      text: "Färdiga svar som du har sparat och kan klistra in med ett klick.",
      use: "När du skriver samma sorts svar ofta.",
      aria: [/^saved replies/]
    },
    {
      key: "attach-files",
      name: "Attach files",
      text: "Lägger till bilder eller filer i det du skriver. Du kan också dra in dem eller klistra in dem.",
      use: "När en skärmbild säger mer än en lång förklaring.",
      aria: ["attach files", "add files", /^attach files/],
      texts: ["add files", /^paste, drop, or click to add files/]
    },
    {
      key: "review-status",
      name: "Review required",
      text: "Visar om förslaget har blivit granskat och godkänt. Står det Review required måste någon godkänna det först.",
      use: "När du undrar varför förslaget inte kan läggas in än.",
      texts: ["review required", "changes approved", "changes requested", /^review required/, /^changes (approved|requested)/],
      tags: ["h3", "h4", "span", "button", "summary"]
    },
    {
      key: "workflows-approval",
      name: "Workflows awaiting approval",
      text: "Automatiska tester som väntar på att en ansvarig ska tillåta dem. Det är en säkerhetsspärr för förslag från nya personer.",
      use: "När testerna inte startar på ett förslag.",
      texts: [/workflows? awaiting approval$/],
      tags: ["h3", "h4", "span"]
    },
    {
      key: "checks-group",
      name: "En grupp tester",
      text: "Automatiska tester grupperade efter hur det gick, till exempel lyckade eller överhoppade.",
      use: "När du vill se vilka tester som gick bra och vilka som inte gjorde det.",
      aria: [/checks group$/]
    },
    {
      key: "checks-settings",
      name: "Checks settings",
      text: "Inställningar för hur testerna i förslaget visas.",
      use: "När listan med tester är svår att överblicka.",
      aria: ["checks settings"]
    },
    {
      key: "check-run",
      name: "Ett automatiskt jobb",
      text: "Ett automatiskt jobb (Actions), till exempel ett test, och hur det gick.",
      use: "När något har misslyckats och du vill se varför.",
      selectors: ['a[href*="/actions/runs/"]', 'a[href*="/checks?check_run_id="]']
    },
    {
      key: "draft-help",
      name: "Draft",
      text: "Ett utkast (draft) är ett ändringsförslag som inte är klart än. Det kan inte läggas in förrän det markeras som klart.",
      use: "När du vill visa hur arbetet går utan att någon granskar det än.",
      texts: ["learn about draft prs", "learn about draft pull requests"]
    },

    /* ---------------- Notiser ---------------- */
    {
      key: "notif-saved",
      name: "Saved",
      text: "Notiser som du har sparat för att ta hand om senare.",
      use: "När du vill komma ihåg något utan att det försvinner i mängden.",
      texts: ["saved"],
      within: 'nav[aria-label="Inbox"]'
    },
    {
      key: "notif-done",
      name: "Done",
      text: "Notiser som du har markerat som klara.",
      use: "När du letar efter något du redan har tagit hand om.",
      texts: ["done"],
      within: 'nav[aria-label="Inbox"]'
    },
    {
      key: "notif-filter",
      name: "Färdigt filter",
      text: "Ett färdigt filter som bara visar en sorts notiser, till exempel där någon har nämnt dig.",
      use: "När du bara vill se det som verkligen kräver något av dig.",
      texts: [/assigned$/, /participating$/, /mentioned$/, /review requested$/, "filters"],
      within: 'nav[aria-label="Filters"]'
    },
    {
      key: "notif-add-filter",
      name: "Add new filter",
      text: "Skapar ett eget filter för notiserna.",
      use: "När de färdiga filtren inte räcker.",
      aria: ["customize filters"],
      texts: ["add new filter"]
    },
    {
      key: "notif-repo-filter",
      name: "Notiser från ett projekt",
      text: "Visar bara notiser från just det här projektet.",
      use: "När ett projekt drunknar bland alla andra.",
      selectors: ['nav[aria-label="Repositories"] a'],
      page: /^\/notifications/
    },
    {
      key: "notif-manage",
      name: "Manage notifications",
      text: "Inställningar för vilka notiser du får och vilka projekt du följer.",
      use: "När du får för många notiser.",
      texts: ["manage notifications"]
    },
    {
      key: "notif-all-unread",
      name: "All / Unread",
      text: "Växlar mellan alla notiser och bara de olästa.",
      use: "När du bara vill se det som är nytt.",
      texts: ["all", "unread"],
      within: 'ul[aria-label="Notification filters"]'
    },
    {
      key: "notif-search",
      name: "Sök bland notiser",
      text: "Söker bland dina notiser.",
      use: "När du letar efter en viss notis, till exempel från ett visst projekt.",
      aria: ["search notifications"],
      selectors: ['input[name="query"]'],
      page: /^\/notifications/
    },
    {
      key: "group-by",
      name: "Group by",
      text: "Grupperar listan, till exempel efter datum eller projekt.",
      use: "När du vill se notiserna samlade per projekt.",
      texts: [/^group by/],
      tags: ["button", "summary"]
    },
    {
      key: "notif-tips",
      name: "Clear out the clutter",
      text: "Ett tips från GitHub om hur du får ordning på notiserna.",
      use: "När listan har blivit för lång för att hinna med.",
      aria: ["get started clearing your notifications"],
      texts: [/^clear out the clutter/]
    },
    {
      key: "notif-select",
      name: "Markera notis",
      text: "En ruta som markerar notisen. Då kan du göra något med flera på en gång, till exempel markera dem som klara.",
      use: "När du vill städa bort många notiser samtidigt.",
      selectors: ['input[name="notification_ids[]"]', "input.js-notifications-mark-all-prompt"]
    },
    {
      key: "notif-row",
      name: "En notis",
      text: "En notis om något som har hänt, till exempel ett svar eller ett jobb som är klart.",
      use: "När du vill se vad som har hänt. Klicka för att öppna.",
      selectors: ["a.js-navigation-open"],
      within: ".notifications-list-item"
    },

    /* ---------------- Profilen och profilmenyn ---------------- */
    {
      key: "account-switcher",
      name: "Account switcher",
      text: "Byter mellan dina GitHub-konton, om du har flera.",
      use: "När du har ett jobbkonto och ett privat konto.",
      aria: ["account switcher"]
    },
    {
      key: "set-status",
      name: "Set status",
      text: "En kort statusrad på din profil, till exempel Semester eller Upptagen.",
      use: "När du vill att andra ska veta att du svarar långsamt.",
      aria: ["set status"],
      texts: ["set status", "edit status"]
    },
    {
      key: "gists",
      name: "Gists",
      text: "Dina gists, små anteckningsblad för kod och text som du har delat med en länk.",
      use: "När du letar efter en kodsnutt du har sparat.",
      selectors: ['a[href*="gist.github.com"]'],
      texts: ["gists", "your gists"]
    },
    {
      key: "feature-preview",
      name: "Feature preview",
      text: "Nya funktioner som GitHub testar. Du kan slå på dem innan alla andra får dem.",
      use: "När du är nyfiken på det som är på väg.",
      texts: ["feature preview", "feature preview new"]
    },
    {
      key: "try-enterprise",
      name: "Try Enterprise",
      text: "Reklam för GitHubs dyraste abonnemang, som är gjort för stora företag.",
      use: "När du jobbar på ett stort företag. Annars kan du strunta i den.",
      selectors: ['a[href*="enterprise_plan"]'],
      texts: ["try enterprise free", "try enterprise"]
    },
    {
      key: "change-avatar",
      name: "Change your avatar",
      text: "Byter din profilbild.",
      use: "När du vill ha en ny bild som andra ser.",
      aria: ["change your avatar"]
    },
    {
      key: "edit-profile",
      name: "Edit profile",
      text: "Ändrar namn, beskrivning och länkar på din profil.",
      use: "När du vill uppdatera vad det står om dig.",
      texts: ["edit profile"]
    },
    {
      key: "customize-pins",
      name: "Customize your pins",
      text: "Väljer vilka projekt som visas överst på din profil.",
      use: "När du vill visa upp dina bästa projekt först.",
      texts: ["customize your pins"]
    },
    {
      key: "popular-repos",
      name: "Popular repositories",
      text: "Projekt som visas överst på profilen, antingen de populäraste eller de som personen själv har valt.",
      use: "När du vill se vad personen är mest känd för.",
      texts: [/^popular repositories/, "pinned"],
      tags: ["h2", "span"]
    },
    {
      key: "contribution-settings",
      name: "Contribution settings",
      text: "Väljer vad som räknas och visas i rutnätet med din aktivitet.",
      use: "När du vill visa eller gömma arbete i privata projekt.",
      texts: ["contribution settings"]
    },
    {
      key: "contribution-graph",
      name: "Contributions",
      text: "Rutnätet visar hur mycket du har gjort på GitHub varje dag det senaste året. Mörkare grönt betyder mer.",
      use: "När du vill se hur aktiv någon har varit.",
      texts: [/contributions? in the last year$/, /contributions? in$/]
    },
    {
      key: "contribution-year",
      name: "Year",
      text: "Väljer vilket år aktiviteten ska visas för.",
      use: "När du vill se vad som hände ett tidigare år.",
      texts: ["year"],
      tags: ["button", "a"],
      within: "#js-contribution-activity, #user-profile-frame, .js-yearly-contributions"
    },
    {
      key: "contribution-activity",
      name: "Contribution activity",
      text: "En dagbok över vad du har gjort på GitHub, månad för månad.",
      use: "När du vill minnas vad du jobbade med en viss period.",
      texts: ["contribution activity", /^created /, /^opened /, /^reviewed /, "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
      within: "#js-contribution-activity"
    },

    /* ---------------- Dina kontoinställningar (/settings) ---------------- */
    setting("settings-profile", "/settings/profile", "Public profile", "Det andra ser på din profilsida: namn, bild, beskrivning och länkar.", "När du vill ändra hur du presenterar dig på GitHub."),
    setting("settings-account", "/settings/admin", "Account", "Ditt användarnamn, och möjligheten att byta namn, exportera eller ta bort kontot.", "När du vill byta användarnamn eller hämta ut en kopia av allt ditt."),
    setting("settings-appearance", "/settings/appearance", "Appearance", "Hur GitHub ser ut för dig, till exempel ljust eller mörkt läge.", "När sidan är för ljus, för mörk eller svår att läsa."),
    setting("settings-accessibility", "/settings/accessibility", "Accessibility", "Inställningar som gör GitHub lättare att använda, till exempel kortkommandon och rörelser på sidan.", "När något på sidan stör dig eller är svårt att se eller använda."),
    setting("settings-notifications", "/settings/notifications", "Notifications", "Vilka notiser du får, och om de kommer som mejl eller bara på GitHub.", "När du får för många mejl från GitHub, eller missar sådant som är viktigt."),
    setting("settings-billing", "/settings/billing", "Billing and licensing", "Allt om betalning: vad du använder, vad det kostar och hur du betalar.", "När du vill se vad GitHub kostar dig."),
    setting("settings-billing-usage", "/settings/billing/usage", "Usage", "Hur mycket du har använt av sådant som kostar, till exempel Actions och Codespaces.", "När du vill förstå varför räkningen blev som den blev."),
    setting("settings-billing-ai", "/settings/billing/ai_usage", "AI usage", "Hur mycket du har använt AI-funktioner som Copilot.", "När du vill hålla koll på vad AI kostar dig."),
    setting("settings-billing-budgets", "/settings/billing/budgets", "Budgets and alerts", "Tak för hur mycket du får använda, och varningar innan du når dem.", "När du vill vara säker på att inte få en oväntad räkning."),
    setting("settings-billing-licensing", "/settings/billing/licensing", "Licensing", "Vilka licenser och abonnemang kontot har, till exempel för Copilot.", "När du vill se vad som ingår i det du betalar för."),
    setting("settings-billing-payment", "/settings/billing/payment_information", "Payment information", "Ditt betalkort och dina fakturauppgifter.", "När du ska byta kort eller ändra adressen på kvittot."),
    setting("settings-billing-history", "/account/billing/history", "Payment history", "Alla dina tidigare betalningar och kvitton.", "När du behöver ett kvitto till bokföringen."),
    setting("settings-billing-subscriptions", "/settings/billing/subscriptions", "Subscriptions", "Abonnemang som du betalar för, till exempel tillägg från Marketplace.", "När du vill säga upp något du inte använder."),
    setting("settings-education", "/settings/education/benefits", "Education benefits", "Gratis förmåner för elever och lärare, till exempel Copilot.", "När du studerar och vill använda betalfunktioner gratis."),
    setting("settings-emails", "/settings/emails", "Emails", "Mejladresserna som hör till ditt konto, och vilken som är huvudadressen.", "När du byter mejl, eller vill dölja din adress i ändringar du sparar."),
    setting("settings-security", "/settings/security", "Password and authentication", "Ditt lösenord och inloggning i två steg, alltså en extra kod utöver lösenordet.", "När du vill göra kontot säkrare eller byta lösenord."),
    setting("settings-sessions", "/settings/sessions", "Sessions", "Datorer och mobiler där du är inloggad just nu.", "När du vill logga ut från en dator du inte använder längre."),
    setting("settings-keys", "/settings/keys", "SSH and GPG keys", "Hemliga nycklar som låter din dator prata med GitHub utan lösenord, och som visar att ändringar verkligen kommer från dig.", "När du ska koppla en ny dator till ditt konto."),
    setting("settings-credentials", "/settings/credentials", "Credentials", "Inloggningsuppgifter som program och tjänster använder för att komma åt ditt konto.", "När du vill se eller ta bort åtkomst som du har gett bort."),
    setting("settings-organizations", "/settings/organizations", "Organizations", "Grupper som du är medlem i, där flera äger projekt tillsammans.", "När du vill gå med i, lämna eller skapa en grupp."),
    setting("settings-enterprises", "/settings/enterprises", "Enterprises", "Stora företagskonton som du hör till.", "När du jobbar på ett företag som har köpt GitHub Enterprise."),
    setting("settings-blocked", "/settings/blocked_users", "Blocked users", "Personer du har blockerat, så att de inte kan kontakta dig eller röra dina projekt.", "När någon beter sig illa mot dig."),
    setting("settings-interaction-limits", "/settings/interaction_limits", "Interaction limits", "Tillfälliga gränser för vem som får kommentera i dina projekt.", "När ett projekt plötsligt får mycket ovälkommen uppmärksamhet."),
    setting("settings-review-limits", "/settings/code_review_limits", "Code review limits", "Begränsar vem som får godkänna eller underkänna ändringsförslag i dina projekt.", "När du vill att bara personer du litar på ska granska."),
    setting("settings-repositories", "/settings/repositories", "Repositories", "Standardval för nya projekt, till exempel vad huvudversionen ska heta.", "När du vill att alla nya projekt ska börja likadant."),
    setting("settings-codespaces", "/settings/codespaces", "Codespaces", "Inställningar för dina datorer i molnet, till exempel hur länge de får vara igång.", "När du vill undvika att betala för molndatorer som står oanvända."),
    setting("settings-packages", "/settings/packages", "Packages", "Inställningar för paket, alltså färdiga delar som du publicerar för andra program.", "När du publicerar paket och vill styra vem som får se dem."),
    {
      key: "settings-copilot",
      name: "Copilot",
      text: "Inställningar för AI-assistenten Copilot, till exempel vilka AI-modeller den får använda.",
      use: "När du vill styra vad Copilot får göra och vad den får läsa.",
      href: [/^\/settings\/copilot(\/.*)?$/],
      texts: ["copilot"],
      within: 'a[href^="/settings/copilot"], a[href^="https://github.com/settings/copilot"]'
    },
    setting("settings-pages", "/settings/pages", "Pages", "Inställningar för GitHub Pages, gratis webbsidor som byggs direkt från ett projekt.", "När du vill koppla en egen domän till dina sidor."),
    setting("settings-replies", "/settings/replies", "Saved replies", "Färdiga svar som du har sparat och kan klistra in i kommentarer.", "När du skriver samma sorts svar ofta."),
    setting("settings-code-security", "/settings/security_analysis", "Code security", "Automatisk koll efter säkerhetshål och läckta lösenord i dina projekt.", "När du vill bli varnad innan någon annan hittar problemet."),
    setting("settings-applications", "/settings/installations", "Applications", "Program och tjänster som du har gett tillgång till ditt konto.", "När du vill se vad som har åtkomst, eller ta bort något du inte använder."),
    setting("settings-reminders", "/settings/reminders", "Scheduled reminders", "Påminnelser i Slack eller Teams om ändringsförslag som väntar på granskning.", "När du vill bli påmind utan att behöva gå in på GitHub."),
    setting("settings-security-log", "/settings/security-log", "Security log", "En logg över allt som har hänt med säkerheten på ditt konto, till exempel inloggningar.", "När du misstänker att någon annan har varit inne på ditt konto."),
    setting("settings-sponsors-log", "/settings/sponsors-log", "Sponsorship log", "En logg över pengar du har skickat eller fått som sponsor.", "När du vill se vem du har stöttat och när."),
    setting("settings-developer", "/settings/apps", "Developer settings", "Verktyg för den som bygger egna program som pratar med GitHub, till exempel nycklar (tokens).", "När ett program ber dig om en nyckel till GitHub."),
    {
      key: "settings-billing-group",
      name: "Billing and licensing",
      text: "Allt om betalning: vad du använder, vad det kostar och hur du betalar.",
      use: "När du vill se vad GitHub kostar dig.",
      texts: ["billing and licensing"],
      within: 'nav[aria-label="User settings"]'
    },
    {
      key: "settings-moderation-group",
      name: "Moderation",
      text: "Verktyg för att hålla ordning, till exempel att blockera personer eller begränsa kommentarer.",
      use: "När någon beter sig illa i dina projekt.",
      texts: ["moderation"],
      within: 'nav[aria-label="User settings"]'
    },
    {
      key: "settings-heading",
      name: "En grupp inställningar",
      text: "En rubrik som samlar inställningar som hör ihop.",
      use: "När du letar efter en inställning och vill veta var den kan ligga.",
      texts: ["access", "code, planning, and automation", "security", "security and quality", "integrations", "archives"],
      tags: ["h2", "h3"],
      within: 'nav[aria-label="User settings"], nav[aria-label="General settings"]'
    },

    /* ---------------- Fälten på din profilsida i inställningarna ---------------- */
    {
      key: "profile-name",
      name: "Name",
      text: "Namnet som visas på din profil. Det kan vara ditt riktiga namn eller ett smeknamn.",
      use: "När du vill att folk ska känna igen dig.",
      selectors: ['input[name="user[display_name]"]', 'input[name="user[profile_name]"]'],
      texts: ["name"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-email",
      name: "Public email",
      text: "Vilken mejladress som syns på din profil, om någon alls.",
      use: "När du vill att folk ska kunna mejla dig.",
      selectors: ['select[name="user[profile_email]"]'],
      texts: ["public email"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-bio",
      name: "Bio",
      text: "En kort text om dig som visas på profilen.",
      use: "När du vill berätta vem du är och vad du gör.",
      selectors: ['textarea[name="user[profile_bio]"]'],
      texts: ["bio"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-pronouns",
      name: "Pronouns",
      text: "Vilka pronomen andra ska använda om dig, om du vill visa det.",
      use: "När du vill att folk ska skriva rätt om dig.",
      selectors: ['select[name="user[profile_pronouns]"]', 'select#user_profile_pronouns', 'form[id^="edit_user_"] select:not([name])'],
      texts: ["pronouns"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-url",
      name: "URL",
      text: "En länk till din webbsida.",
      use: "När du vill att besökare ska hitta din sajt eller portfolio.",
      selectors: ['input[name="user[profile_blog]"]'],
      texts: ["url"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-social",
      name: "Social accounts",
      text: "Länkar till dina konton på andra sajter, till exempel LinkedIn.",
      use: "När du vill att folk ska hitta dig på fler ställen.",
      selectors: ['input[name="user[profile_social_accounts][][url]"]'],
      texts: ["social accounts"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-company",
      name: "Company",
      text: "Var du jobbar. Skriver du @ och namnet på en organisation blir det en länk.",
      use: "När du vill visa var du jobbar.",
      selectors: ['input[name="user[profile_company]"]'],
      texts: ["company"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-location",
      name: "Location",
      text: "Var du bor eller jobbar, så exakt som du själv vill.",
      use: "När du vill att folk ska se ungefär var du finns.",
      selectors: ['input[name="user[profile_location]"]'],
      texts: ["location"],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-local-time",
      name: "Display current local time",
      text: "Visar vad klockan är hos dig på din profil.",
      use: "När du jobbar med folk i andra tidszoner.",
      selectors: ['input[name="user[profile_display_local_time_zone]"]'],
      texts: [/^display current local time/],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-private",
      name: "Make profile private",
      text: "Gömmer allt på din profil utom namn och bild för andra.",
      use: "När du vill vara mer anonym på GitHub.",
      selectors: ['input[name="user[private_profile]"]'],
      texts: [/^make profile private/],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-private-count",
      name: "Include private contributions",
      text: "Räknar med arbete i privata projekt i rutnätet på profilen, utan att visa vad det är.",
      use: "När du jobbar mest privat och vill att profilen ska visa att du är aktiv.",
      selectors: ['input[name="user[show_private_contribution_count]"]'],
      texts: [/^include private contributions/],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-achievements",
      name: "Show Achievements",
      text: "Visar märken som du har fått för saker du har gjort på GitHub.",
      use: "När du vill visa upp eller gömma dina märken.",
      selectors: ['input[name="user[achievements_enabled]"]'],
      texts: [/^show achievements/],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-hireable",
      name: "Available for hire",
      text: "Visar att du är öppen för nya jobb.",
      use: "När du letar efter uppdrag eller anställning.",
      selectors: ['input[name="user[profile_hireable]"]'],
      texts: [/^available for hire/],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "profile-trending-language",
      name: "Trending settings",
      text: "Vilket språk du talar, så att GitHub kan visa populära projekt på det språket.",
      use: "När du vill se vad som är populärt i din del av världen.",
      selectors: ['select[name="user[profile_spoken_language_preference_code]"]'],
      within: PROFILE_FORM,
      page: /^\/settings\/profile/
    },
    {
      key: "settings-save",
      name: "Spara",
      text: "Sparar ändringarna du har gjort i just den här delen av sidan.",
      use: "När du har ändrat något. Annars försvinner ändringen.",
      selectors: ['#settings-frame input[type="submit"]', '#options_bucket input[type="submit"]'],
      texts: ["update profile", "update preferences", "save jobs profile", "save changes", "update settings", "save"],
      tags: ["button", "input"],
      page: /^\/settings|^\/account|\/settings(\/|$)/
    },

    /* ---------------- Inställningar för ett projekt ---------------- */
    repoSetting("rsettings-general", "", "General", "Grundinställningar för projektet: namn, funktioner och farliga val som att ta bort det.", "När du vill byta namn, eller slå av och på delar som Wiki och Issues."),
    repoSetting("rsettings-access", "/access", "Collaborators", "Vilka som får jobba i projektet, och vad de får göra.", "När du vill bjuda in någon att jobba med dig."),
    repoSetting("rsettings-rules", "/rules", "Rulesets", "Regler som skyddar projektet, till exempel att ingen får ändra huvudversionen direkt.", "När ni är flera och vill undvika att något går sönder av misstag."),
    repoSetting("rsettings-branches", "/branches", "Branches", "Skydd för viktiga arbetskopior (branches), till exempel att ändringar måste godkännas först.", "När du vill skydda huvudversionen av projektet."),
    repoSetting("rsettings-tags", "/tag_protection", "Tags", "Skydd för bokmärken (tags) på färdiga versioner, så att ingen flyttar eller tar bort dem.", "När du ger ut versioner och vill att de ska ligga fast."),
    repoSetting("rsettings-actions", "/actions", "General", "Inställningar för automatiska jobb (Actions): vad som får köras och vem som får starta det.", "När du vill slå av, begränsa eller tillåta automatiska jobb."),
    repoSetting("rsettings-runners", "/actions/runners", "Runners", "Datorerna som kör de automatiska jobben. GitHub har egna, men du kan koppla in din egen.", "När jobben behöver en särskild dator eller går för långsamt."),
    repoSetting("rsettings-policies", "/actions/rules", "Policies", "Regler för vilka automatiska jobb som får köras i projektet.", "När du vill stoppa jobb som inte är godkända."),
    repoSetting("rsettings-policy-insights", "/actions/rules/insights", "Policy insights", "Statistik över hur reglerna för automatiska jobb har följts.", "När du vill se om något har stoppats av reglerna."),
    repoSetting("rsettings-oidc", "/actions/oidc-configuration", "OIDC", "En säker inloggning som låter automatiska jobb komma åt molntjänster utan sparade lösenord.", "När projektet ska publicera något i en molntjänst."),
    repoSetting("rsettings-hooks", "/hooks", "Webhooks", "Automatiska meddelanden till andra tjänster när något händer i projektet.", "När en annan tjänst ska reagera direkt, till exempel bygga om en sajt."),
    repoSetting("rsettings-copilot-review", "/copilot/code_review", "Code review", "Låter Copilot granska ändringsförslag och lämna kommentarer.", "När du vill ha en extra granskare som alltid är på plats."),
    repoSetting("rsettings-copilot-agent", "/copilot/coding_agent", "Cloud agent", "Låter Copilot jobba på egen hand i molnet, till exempel lösa ett ärende och lämna ett ändringsförslag.", "När du vill lämna över en uppgift till AI och granska resultatet efteråt."),
    repoSetting("rsettings-copilot-internet", "/copilot/internet_access", "Internet access", "Vilka webbplatser Copilot får besöka när den jobbar i projektet.", "När du vill begränsa vad AI:n kan hämta eller skicka."),
    repoSetting("rsettings-copilot-mcp", "/copilot/mcp", "MCP servers", "Kopplingar som ger Copilot tillgång till fler verktyg och tjänster i projektet.", "När Copilot behöver nå något utanför projektet."),
    repoSetting("rsettings-suggestions", "/suggestions", "Agent suggestions for issues", "Förslag från AI om hur ärenden kan sorteras och lösas.", "När du har många ärenden och vill ha hjälp att planera."),
    repoSetting("rsettings-environments", "/environments", "Environments", "Platser där projektet läggs ut, till exempel test och skarp drift, med egna regler.", "När du vill att något måste godkännas innan det går ut på riktigt."),
    repoSetting("rsettings-codespaces", "/codespaces", "Codespaces", "Inställningar för molndatorer i det här projektet.", "När du vill bestämma hur molndatorerna för projektet ska se ut."),
    repoSetting("rsettings-pages", "/pages", "Pages", "Gör projektet till en gratis webbsida med GitHub Pages.", "När du vill publicera en enkel sajt direkt från projektet."),
    repoSetting("rsettings-security", "/security_analysis", "Advanced Security", "Automatisk koll efter säkerhetshål, gamla delar och läckta lösenord.", "När du vill bli varnad innan någon annan hittar problemet."),
    repoSetting("rsettings-deploy-keys", "/keys", "Deploy keys", "Nycklar som ger en enskild server tillgång till just det här projektet.", "När en server ska kunna hämta projektet utan ditt lösenord."),
    repoSetting("rsettings-apps", "/installations", "GitHub Apps", "Program som har fått tillgång till projektet.", "När du vill se vad som har åtkomst, eller ta bort något."),
    repoSetting("rsettings-email", "/notifications", "Email notifications", "Skickar ett mejl till en adress varje gång någon sparar ändringar i projektet.", "När någon utanför GitHub vill hålla koll på ändringarna."),
    {
      key: "rsettings-secrets",
      name: "Secrets and variables",
      text: "Hemliga värden som lösenord och nycklar. Automatiska jobb får använda dem utan att de syns.",
      use: "När ett automatiskt jobb behöver logga in någonstans.",
      href: [repoPrefix("/settings/secrets/")],
      texts: ["actions", "agents", "codespaces", "dependabot"],
      within: 'a[href*="/settings/secrets/"]'
    },
    {
      key: "rsettings-secrets-group",
      name: "Secrets and variables",
      text: "Hemliga värden som lösenord och nycklar. Automatiska jobb får använda dem utan att de syns.",
      use: "När ett automatiskt jobb behöver logga in någonstans.",
      texts: ["secrets and variables"],
      within: 'nav[aria-label="General settings"]'
    },
    {
      key: "rsettings-group",
      name: "En grupp inställningar",
      text: "En grupp inställningar som hör ihop. Klicka för att visa eller dölja dem.",
      use: "När du letar efter en inställning och vill veta var den kan ligga.",
      texts: ["rulesets", "actions", "copilot", "planning"],
      tags: ["button"],
      within: 'nav[aria-label="General settings"]'
    },
    {
      key: "rsettings-name",
      name: "Repository name",
      text: "Projektets namn. Byter du namn skickas gamla länkar vidare automatiskt.",
      use: "När projektet har fått ett bättre namn.",
      selectors: ['input[name="new_name"]'],
      texts: ["repository name", "rename"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-template",
      name: "Template repository",
      text: "Gör projektet till en mall som andra kan starta nya projekt från.",
      use: "När du har byggt en bra grund som du vill återanvända.",
      selectors: ['input[name="template"]'],
      texts: ["template repository"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-immutable",
      name: "Release immutability",
      text: "Gör att färdiga versioner inte går att ändra i efterhand.",
      use: "När andra måste kunna lita på att en version alltid är densamma.",
      selectors: ['input[name="release_immutability"]'],
      texts: ["enable release immutability"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-default-branch",
      name: "Default branch",
      text: "Huvudversionen av projektet, den som visas först och dit ändringar läggs in.",
      use: "När ni har bytt vilken arbetskopia som är den viktigaste.",
      texts: ["default branch"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-features",
      name: "Features",
      text: "Slår på eller av en del av projektet, till exempel Wiki eller Projects. Det du stänger av försvinner från flikarna.",
      use: "När en flik bara står tom och gör projektet rörigt.",
      selectors: ['input[name="has_wiki"]', 'input[name="has_issues"]', 'input[name="has_discussions"]', 'input[name="memex_projects_enabled"]', 'input[name="has_projects"]', 'input[name="has_pull_requests"]', 'input[name="enable_repository_funding_links"]'],
      texts: ["wikis", "issues", "sponsorships", "discussions", "projects", "pull requests"],
      tags: ["label", "span", "input"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-section",
      name: "En del av inställningarna",
      text: "En rubrik för en grupp inställningar på sidan.",
      use: "När du letar efter en viss inställning och vill hitta rätt del av sidan.",
      texts: ["general", "features", "pull requests", "issues", "archives", "public profile", "contributions & activity", "profile settings", "github developer program", "jobs profile", "trending settings"],
      tags: ["h2"],
      within: "#options_bucket, #settings-frame"
    },
    {
      key: "rsettings-permissions",
      name: "Permissions",
      text: "Vem som får skapa nya ärenden eller ändringsförslag i projektet.",
      use: "När du vill att bara vissa ska kunna skriva till projektet.",
      texts: ["issue permissions", "pull request permissions", /^creation allowed by/],
      within: "#options_bucket"
    },
    {
      key: "rsettings-issue-templates",
      name: "Issue templates",
      text: "Färdiga mallar som hjälper folk att skriva tydliga ärenden.",
      use: "När ärendena du får saknar viktig information.",
      href: [repo("/issues/templates/edit")],
      texts: ["get organized with issue templates", "set up templates"]
    },
    {
      key: "rsettings-sponsor-button",
      name: "Sponsor button",
      text: "Lägger till en Sponsor-knapp så att folk kan skicka pengar till dig.",
      use: "När du vill kunna ta emot stöd för ditt arbete.",
      selectors: ['a[href*="repository_funding"]'],
      texts: ['display a "sponsor" button', "set up sponsor button"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-merge",
      name: "Pull Requests",
      text: "Hur ändringsförslag får läggas in, till exempel vilka sätt som är tillåtna och om färdiga arbetskopior städas bort.",
      use: "När ni vill att alla ska lägga in ändringar på samma sätt.",
      selectors: ['input[name="merge_types[]"]'],
      texts: ["allow merge commits", "allow squash merging", "allow rebase merging", "always suggest updating pull request branches", "allow auto-merge", "automatically delete head branches", "default commit message", "default message"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-signoff",
      name: "Sign off",
      text: "Kräver att den som sparar ändringar på webben intygar sin rätt att bidra med koden.",
      use: "När projektet har juridiska krav på vem som bidrar.",
      selectors: ['input[name="enable_dco_signoff"]', 'a[href*="developercertificate.org"]'],
      texts: [/^require contributors to sign off/],
      within: "#options_bucket"
    },
    {
      key: "rsettings-commit-comments",
      name: "Commit comments",
      text: "Låter folk kommentera enskilda sparade ändringar.",
      use: "När ni vill diskutera en ändring direkt där den gjordes.",
      selectors: ['input[name="has_commit_comments"]'],
      texts: ["allow comments on individual commits"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-lfs",
      name: "Git LFS i arkiv",
      text: "Tar med stora filer, till exempel bilder och video, när någon laddar ner projektet som zip-fil.",
      use: "När projektet har stora filer som måste följa med.",
      selectors: ['input[name="include_lfs_objects"]'],
      texts: ["include git lfs objects in archives"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-autoclose",
      name: "Auto-close issues",
      text: "Stänger ärenden av sig själva när ett kopplat ändringsförslag läggs in.",
      use: "När du vill slippa stänga ärenden för hand.",
      selectors: ['input[name="auto_close_issues"]'],
      texts: ["auto-close issues with merged linked pull requests"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-danger",
      name: "Danger Zone",
      text: "Val som är svåra eller omöjliga att ångra. Läs noga innan du klickar.",
      use: "När du verkligen menar att göra en stor förändring av projektet.",
      texts: ["danger zone"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-visibility",
      name: "Change visibility",
      text: "Gör projektet offentligt för alla, eller privat så att bara inbjudna ser det.",
      use: "När du vill visa upp projektet, eller gömma det.",
      texts: ["change visibility"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-disable-protection",
      name: "Disable branch protection rules",
      text: "Stänger tillfälligt av skydden för projektets arbetskopior.",
      use: "När ett skydd är i vägen och du vet exakt vad du gör.",
      texts: ["disable branch protection rules", "enable branch protection rules"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-transfer",
      name: "Transfer",
      text: "Flyttar projektet till en annan person eller grupp.",
      use: "När någon annan ska ta över projektet.",
      href: [repo("/transfer")],
      texts: ["transfer"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-archive",
      name: "Archive this repository",
      text: "Fryser projektet så att det bara går att läsa. Det går att ångra.",
      use: "När projektet är klart och ingen ska jobba mer i det.",
      texts: ["archive this repository", "unarchive this repository"],
      within: "#options_bucket"
    },
    {
      key: "rsettings-delete",
      name: "Delete this repository",
      text: "Tar bort projektet för alltid, med hela historiken. Det går inte att ångra.",
      use: "När projektet aldrig ska användas igen. Arkivera hellre om du är osäker.",
      texts: ["delete this repository"],
      within: "#options_bucket"
    },
    {
      key: "orcid",
      name: "ORCID",
      text: "ORCID är ett id för forskare som visar vad du har publicerat.",
      use: "När du forskar och vill koppla dina publikationer till profilen.",
      selectors: ['a[href*="orcid"]']
    },
    {
      key: "privacy",
      name: "Privacy statement",
      text: "GitHubs regler för hur de hanterar dina uppgifter.",
      use: "När du undrar vad GitHub gör med det du skriver in.",
      selectors: ['a[href$="/site/privacy"]']
    },
    {
      key: "developer-program",
      name: "GitHub Developer Program",
      text: "Ett program för den som bygger verktyg som kopplas till GitHub.",
      use: "När du gör en tjänst som andra GitHub-användare ska kunna koppla in.",
      selectors: ['a[href*="/developer/register"]']
    },
    {
      key: "trending",
      name: "Trending",
      text: "Projekt som är populära just nu.",
      use: "När du vill se vad alla pratar om.",
      href: [/^\/trending\/?$/]
    },
    {
      key: "upgrade",
      name: "Upgrade",
      text: "Uppgraderar ditt konto till ett betalt abonnemang.",
      use: "När du behöver en funktion som bara finns för betalande.",
      href: [/^\/account\/upgrade\/?$/]
    },
    {
      key: "discussions-setup",
      name: "Get started with Discussions",
      text: "Startar Discussions, ett forum för projektet, med en första välkomsttråd.",
      use: "När du vill att folk ska kunna ställa frågor utan att skapa ärenden.",
      texts: ["get started with discussions", "set up discussions"],
      within: "#options_bucket"
    },
    {
      key: "comment-header",
      name: "Kommentarens rubrik",
      text: "Rubriken på en kommentar: vem som skrev den och när.",
      use: "När du vill se vem som sa vad i samtalet.",
      texts: [/ commented$/, / commented on /],
      tags: ["h3", "h4", "span"]
    },
    {
      key: "commit-status",
      name: "Testernas status",
      text: "Visar hur de automatiska testerna gick för den här ändringen. Grön bock betyder att allt gick bra.",
      use: "När du vill veta om en ändring har fått något att gå sönder.",
      aria: [/checks? (ok|failing|failed|pending|passed|successful)$/],
      selectors: [".commit-build-statuses summary"]
    },
    {
      key: "dash-copilot-mode",
      name: "Ask / Agent",
      text: "Väljer hur Copilot ska jobba. Ask svarar på frågor, Agent gör jobbet åt dig och lämnar ett förslag.",
      use: "När du vill bestämma om Copilot bara ska svara eller också ändra något.",
      texts: ["ask", "agent", "plan"],
      tags: ["button"],
      within: "#dashboard"
    },
    {
      key: "copilot-usage",
      name: "View token usage",
      text: "Visar hur mycket du har använt Copilot, mätt i tokens, alltså bitar av text som AI:n läser och skriver.",
      use: "När du vill hålla koll på hur nära du är din gräns.",
      aria: ["view token usage"]
    },
    {
      key: "copilot-send",
      name: "Send",
      text: "Skickar din fråga eller uppgift till Copilot.",
      use: "När du har skrivit klart.",
      aria: [/^send now/]
    },
    {
      key: "copilot-attach",
      name: "Add files and spaces",
      text: "Lägger till filer, eller Spaces som är samlingar med material, som Copilot ska läsa.",
      use: "När Copilot behöver mer underlag för att svara rätt.",
      aria: [/^add files, and spaces/, /^add files and spaces/]
    },
    {
      key: "dash-suggestion",
      name: "Förslag till Copilot",
      text: "Ett förslag på vad du kan be Copilot om. Klicka så fylls rutan i.",
      use: "När du inte vet hur du ska börja fråga.",
      texts: ["debug", "create issue", "write code", "git", "explain", "summarize"],
      tags: ["button"],
      within: "#dashboard"
    },
    {
      key: "dash-sections",
      name: "Dina ändringsförslag och ärenden",
      text: "Dina senaste ändringsförslag eller ärenden, samlade på startsidan.",
      use: "När du snabbt vill se vad som väntar på dig.",
      texts: ["pull requests", "issues"],
      tags: ["button", "h2", "h3"],
      within: "#dashboard"
    },
    {
      key: "dash-section-options",
      name: "Listans inställningar",
      text: "Inställningar för vad listan på startsidan ska visa.",
      use: "När du vill se andra ärenden eller förslag än de som visas.",
      aria: ["pull request options", "issue options"]
    },
    {
      key: "dashboard-preview",
      name: "Dashboard preview",
      text: "Inställningar för den nya startsidan som GitHub testar just nu.",
      use: "När du vill byta tillbaka till den gamla startsidan eller säga vad du tycker.",
      aria: ["dashboard preview options"]
    },
    {
      key: "profile-overview",
      name: "Overview",
      text: "Översikten på en profil: utvalda projekt, aktivitet och en kort presentation.",
      use: "När du vill få en snabb bild av vem personen är.",
      texts: ["overview"],
      tags: ["a", "span"]
    }
  ];
})();
