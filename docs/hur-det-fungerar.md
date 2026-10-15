# Hur det fungerar

Den här sidan är för dig som vill förstå hur tillägget är byggt, eller ändra i det. Vill du bara installera det, läs [LASMIG.md](../LASMIG.md).

## Vad som får förklaring

383 förklaringar finns i filen `extension/explanations.js`. De täcker bland annat:

- **Toppen av sidan:** sökfältet, plus-menyn och allt i den, notisklockan, din profilmeny, huvudmenyn, GitHub-loggan, Copilot, logga in och skapa konto.
- **Huvudmenyn (de tre strecken):** Home, All issues, All pull requests, All repositories, Projects, Discussions, Codespaces, Copilot, Explore, Marketplace, MCP registry och Top repositories.
- **Flikarna i ett projekt:** Code, Issues, Pull requests, Actions, Projects, Wiki, Security, Insights, Settings, Discussions och knappen för fler flikar.
- **Projektets huvud:** Star, stjärnlistor, Fork, Watch, Sponsor, Pin, projektets och ägarens namn.
- **Den gröna Code-knappen och dess meny:** Local, Codespaces, Create codespace, HTTPS, SSH, GitHub CLI, adressen, kopiera-knappen, Open with GitHub Desktop, Open with Visual Studio och Download ZIP.
- **Filer:** branch-väljaren, Branches, Tags, Go to file, Add file, Create new file, Upload files, mappar, filer, Blame, Raw, Preview, ändra fil, Symbols och filträdet.
- **Historik och fakta:** Commits, enskilda commits, README, License, Code of conduct, Contributing, Security policy, About, Topics, Releases, Packages, Contributors, Languages, Stars, Watchers, Forks, Activity, Used by, Deployments och Report repository.
- **Inne i en issue:** New issue, sökfältet, Open och Closed, status, Labels, Milestones, Assignees, Type, Projects, Development, Create a branch, Relationships, Subscribe, Participants, Lock, Pin, Transfer, Delete, Comment, Write, Preview, Close issue, Reopen, reaktioner, Edit, Quote reply och Copy link.
- **Inne i en pull request:** Conversation, Commits, Checks, Files changed, Reviewers, Review changes, Approve, Request changes, Start a review, Merge pull request, Squash and merge, Rebase and merge, Confirm merge, Enable auto-merge, Update branch, Close pull request, Ready for review, Convert to draft, Delete branch, Revert, Resolve conversation, Viewed, Unified, Split och Hide whitespace.
- **Listor med issues och pull requests:** varje rad i listan, filterknapparna (Author, Labels, Milestones, Assignees, Types, Reviews), sortering, visningstäthet, färdiga filter som Assigned to me, sidbläddring, länkade issues och stackar.
- **Inne i samtal:** författarens namn, tidpunkter, Edited, Load more, Copy link, rubriken, robotar, deployment-rutor, branch-namnen och Force-pushed.
- **Files changed och Commits:** Changes from all commits, File filter, Conversations, Jump to, Expand all, fäll ihop fil, filnamn, Kopiera commit-koden och Browse repository at this point.
- **Releases och filsidor:** Find a release, versionernas namn, Assets, Compare, sökvägen, Top, Raw, Blame, Symbols med flera.
- **Startsidan:** Copilot-rutan, Feed, Top repositories, listorna med dina ändringsförslag och ärenden, och GitHubs nyheter (changelog).
- **Notiser:** Inbox, Saved, Done, alla färdiga filter, sökning, sortering, gruppering och varje rad i listan.
- **Din profil och profilmenyn:** Set status, Gists, Edit profile, Customize your pins, rutnätet med aktivitet och Contribution activity.
- **Dina kontoinställningar:** varje rad i menyn till vänster och alla fält på sidan Public profile.
- **Inställningar för ett projekt:** varje rad i menyn till vänster och allt på sidan General, till exempel Features, Pull Requests och Danger Zone.
- **Kommentarsrutan:** verktygsraden med Bold, Italic, Link, listor, Mention och Saved replies, och knappen för att bifoga filer.
- **Lite till:** Appearance settings, Skip to content, projektets hemsida, Custom properties, Outline, View all files, New workflow, Run workflow, Re-run jobs, Draft a new release, Sync fork och Contribute.

## Hur rätt förklaring hittas

När musen har stått still i en halv sekund letar `content.js` efter en förklaring för saken under musen. Den letar i den här ordningen:

1. Elementets id.
2. Namnet för skärmläsare: aria-label, aria-labelledby, title, placeholder och den separata tooltip-text som GitHub ofta använder.
3. Länkadressen.
4. En CSS-väljare.
5. Knappens synliga text, där siffror som 165k tas bort före jämförelsen.

Några regler gör att bubblan inte dyker upp där den inte hör hemma:

- **Listor och menyer som helhet** får aldrig en bubbla för sitt namn. Annars skulle varje rad i issue-listan få förklaringen för hela listan.
- **Text som människor har skrivit**, som README-texten och kommentarer, får aldrig någon bubbla, även om ett ord råkar vara samma som en knapp.
- **Länkar med filter**, som listan över bara öppna issues, behandlas inte som själva fliken.
- **Bubblan försvinner** när du flyttar musen, trycker Esc, klickar, byter flik eller rullar. Efter Esc eller klick kommer den inte tillbaka förrän du har flyttat musen till något annat.
- **Tillägget körs bara på github.com**, inte på andra sidor och inte på gist.github.com.

## Val i utseende och språk

- **GitHubs namn står överst** i grått, till exempel Fork, och förklaringen under. Då lär man sig de engelska orden samtidigt.
- **Varje förklaring har en rad om nyttan** under rubriken Nytta. Den börjar alltid med "När du". Det är lättare att komma ihåg en knapp när man vet vad man ska ha den till.
- **Orden issue, branch, commit och pull request** står kvar på engelska, eftersom det är dem GitHub visar. De förklaras i stället.
- **Utseendet:** svart bakgrund, vit text, Helvetica Neue och 16 pixlars rundade hörn, utan skuggor. En tunn mörkgrå kant (`#26282b`) gör att bubblan syns även i GitHubs mörka läge.
- **GitHubs märke** står litet uppe till höger i rutan som öppnas från ikonen. GitHub tillåter det så länge märket visar att något fungerar med GitHub, är mindre än tilläggets eget namn och inte ändras. Det får inte användas som tilläggets ikon, så ikonen är en egen pratbubbla.

## Så är det testat

- **Textkontroll:** `node tests/check-texts.js` kontrollerar att alla förklaringar följer mallen, till exempel att raden Nytta börjar med "När".
- **Testsidor:** `npm test` kör tillägget i Chromium på egna sidor som härmar GitHub, även knappar som bara syns inloggad. Det kontrollerar också fördröjningen, Esc, att bubblan håller sig inom skärmen och att på/av-knappen sparar valet. Kräver Node och Playwright.
- **Utloggad mot riktiga sidor:** tio sparade sidor från github.com svepta med musen över varje knapp, flik, länk och rubrik. Siffror i [`tests/real/sweep-log.txt`](../tests/real/sweep-log.txt). En separat kontroll av 38 knappar live gav rätt förklaring på alla 38, se [`tests/real/live-result.json`](../tests/real/live-result.json). Kör om med `node tests/real/fetch-pages.js` och `node tests/real/sweep-real.js`. De sparade sidorna läggs inte upp här, eftersom det är andras innehåll.
- **Inloggad i en riktig Chrome:** nio sidor svepta med det riktiga tillägget, 15 oktober 2026. Siffror i [`tests/real/sweep-logged-in-log.txt`](../tests/real/sweep-logged-in-log.txt). Kör om genom att klistra in [`tests/real/sweep-in-browser.js`](../tests/real/sweep-in-browser.js) i konsolen i Chrome (Cmd + Alt + J) på en sida på github.com.
- **Safari:** testat som tillfälligt tillägg i Safari 27 på macOS 27. Den permanenta Safari-appen via `bygg-safari.sh` är inte testad, eftersom den kräver Xcode.

**Det som inte är testat:** Windows, Linux och Edge. Några förklaringar som lades till efter det inloggade svepet har bara testats på testsidorna. GitHub ändrar ofta sin sida, så en knapp kan sluta få bubbla utan att någon märker det direkt.
