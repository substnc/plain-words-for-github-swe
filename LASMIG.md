# Plain Words for GitHub SWE

Ett tillägg till webbläsaren som förklarar GitHub på svenska. Håll musen still över en knapp, flik, meny eller länk på github.com i ungefär en halv sekund, så dyker en svart pratbubbla upp. Den berättar med vardagliga ord vad saken är, och under rubriken Nytta när du har användning av den.

Allt finns redan i tillägget. Det behövs ingen AI, ingen nyckel och ingen internetanslutning för förklaringarna.

## Installera i Chrome

Det tar ungefär fem minuter. Du gör det bara en gång.

1. **Hämta filerna.** Gå till sidan för projektet på GitHub: https://github.com/substnc/plain-words-for-github-swe. Klicka på den gröna knappen **Code** och sedan på **Download ZIP**.
2. **Packa upp.** Öppna mappen Hämtade filer och dubbelklicka på zip-filen. Nu får du en vanlig mapp. Flytta gärna den mappen till ett ställe där den får ligga kvar, till exempel Dokument. Om du raderar mappen slutar tillägget att fungera.
3. **Öppna Chromes tilläggssida.** Skriv `chrome://extensions` i adressfältet högst upp i Chrome och tryck Enter.
4. **Slå på utvecklarläget.** Uppe till höger finns en liten knapp som heter **Utvecklarläge** (på engelska **Developer mode**). Klicka så att den blir påslagen. Det låter farligt men betyder bara att du får lägga in tillägg från din egen dator.
5. **Lägg in tillägget.** Klicka på knappen **Läs in okomprimerat tillägg** (på engelska **Load unpacked**) som dök upp till vänster. Leta upp mappen från steg 2, öppna den och välj mappen som heter **extension**. Klicka **Välj**.
6. **Sätt fast ikonen.** Klicka på pusselbiten uppe till höger i Chrome. Klicka på nålen bredvid **Plain Words for GitHub SWE**. Nu syns den svarta pratbubblan med frågetecken i verktygsfältet.
7. **Prova.** Gå till https://github.com/facebook/react och håll musen still över knappen **Star** eller fliken **Issues**.

Chrome kan ibland visa en ruta om att tillägg i utvecklarläge kan vara osäkra. Det gäller tillägg du inte känner till. Det här tillägget läser bara sidor på github.com och skickar ingenting någonstans.

## Installera i Safari

Det finns två sätt. Det första är enklast och kräver ingenting extra, men tillägget är bara tillfälligt. Det andra är permanent men kräver programmet Xcode.

### Snabbt och tillfälligt, utan Xcode

Kräver Safari 26 eller senare.

1. **Hämta filerna** på samma sätt som i steg 1 och 2 för Chrome ovan.
2. **Visa utvecklarinställningarna.** Öppna Safari, tryck **Cmd + ,** och gå till fliken **Avancerat**. Bocka i **Visa funktioner för webbutvecklare**.
3. **Lägg till tillägget.** Gå till fliken **Utvecklare** i samma fönster och klicka på **Lägg till tillfälligt tillägg** (Add Temporary Extension). Godkänn med ditt lösenord eller Touch ID om Safari frågar. Välj mappen **extension** och klicka **Välj**.
4. **Slå på det.** Safari byter till fliken **Tillägg**, där **Plain Words for GitHub SWE** står under Tillfälliga. Bocka i det och tillåt det på github.com.

Ett tillfälligt tillägg försvinner efter en tid, eller när du startar om Safari. Då gör du steg 3 och 4 igen.

### Permanent, med Xcode

Det här sättet är inte testat än. Stegen följer Apples egna instruktioner.

**Det här behöver du installera först:**

- **Xcode**, gratis i App Store på din Mac. Sök på Xcode och klicka Hämta. Det är ett stort program (flera gigabyte), så det tar en stund.
- När Xcode är installerat: öppna det en gång, godkänn villkoren och låt det installera det som det ber om. Sedan kan du stänga det.

**Sedan gör du så här:**

1. **Hämta filerna** på samma sätt som i steg 1 och 2 för Chrome ovan.
2. **Öppna Terminal.** Tryck Cmd och mellanslag samtidigt, skriv `Terminal` och tryck Enter. Ett fönster där man skriver kommandon öppnas.
3. **Gå till mappen.** Skriv `cd` följt av ett mellanslag. Dra sedan in den uppackade mappen från Finder och släpp den i Terminal-fönstret. Tryck Enter.
4. **Bygg Safari-versionen.** Skriv `bash bygg-safari.sh` och tryck Enter. Vänta tills det står Klart.
5. **Öppna projektet i Xcode.** Gå in i den nya mappen **safari** och sedan **Plain Words SWE**, och dubbelklicka på filen **Plain Words SWE.xcodeproj**.
6. **Starta appen.** Klicka på Play-knappen (en triangel) uppe till vänster i Xcode. Om Xcode frågar om **Team** eller **Signing**: välj ditt namn om det finns, annars **Sign to Run Locally**. En liten app öppnas. Den kan du stänga.
7. **Tillåt tillägget i Safari.** Öppna Safari och gå till **Safari > Inställningar > Avancerat**. Bocka i **Visa funktioner för webbutvecklare**. Gå sedan till fliken **Utvecklare** i samma inställningsfönster och bocka i **Tillåt osignerade tillägg**. Safari frågar efter ditt lösenord.
8. **Slå på det.** Gå till fliken **Tillägg** i Safaris inställningar och bocka i **Plain Words SWE**. Klicka på tillägget och välj att det får köras på github.com.

Bra att veta: Safari kan glömma **Tillåt osignerade tillägg** varje gång du startar om Safari. Då behöver du göra steg 7 igen. Det slipper man bara om tillägget signeras med ett betalt Apple-utvecklarkonto.

## Använda tillägget

- **Visa en förklaring:** håll musen still över något på github.com i ungefär en halv sekund.
- **Stänga bubblan:** flytta musen därifrån eller tryck på Esc.
- **Stänga av alla bubblor:** klicka på tilläggets ikon i verktygsfältet och slå av knappen **Förklaringar**. Valet sparas tills du slår på det igen.

## Om något inte fungerar

- **Ingen bubbla dyker upp:** ladda om sidan på GitHub. Kolla att knappen i tilläggets ruta är påslagen.
- **Ingen bubbla på en viss knapp:** den knappen saknar förklaring, eller så har GitHub ändrat hur den ser ut i koden. Det är normalt att vissa saker saknas.
- **Chrome säger att tillägget har fel:** kontrollera att du valde mappen **extension** i steg 5 och inte mappen utanför.

## Vad som får förklaring

Nästan 400 förklaringar finns i filen `extension/explanations.js`. De täcker bland annat:

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

## Ändra eller lägga till en förklaring

Öppna `extension/explanations.js` i en textredigerare. Varje förklaring ser ut ungefär så här:

```js
{
  key: "fork",
  name: "Fork",
  text: "Gör en egen kopia av hela projektet på ditt konto. Originalet påverkas inte.",
  use: "När du vill ändra fritt i någon annans projekt, eller bygga vidare på det.",
  ids: ["fork-button"],
  texts: ["fork"]
}
```

`text` säger vad saken är, med vardagliga ord. `use` säger när du har nytta av den och börjar alltid med "När". Ändra texten mellan citattecknen. Spara filen. I Chrome går du till `chrome://extensions` och klickar på den runda pilen på tillägget. Ladda sedan om GitHub-sidan.

## Val jag gjorde

- **GitHubs märke** står litet uppe till höger i rutan. GitHub tillåter det så länge märket visar att något fungerar med GitHub, är mindre än tilläggets eget namn och inte ändras. Det får aldrig användas som tilläggets ikon, så ikonen är en egen pratbubbla.
- **Rutan som öppnas från ikonen** är signerad med Anthon Bäckströms namnteckning längst ner.
- **Namnet byttes 15 oktober 2026** från GitHub-for-dummies till Plain Words for GitHub SWE, eftersom For Dummies är ett skyddat varumärke som förlaget Wiley äger. SWE visar att förklaringarna är på svenska.
- **Projektet på GitHub fanns redan** som `substnc/GitHub-for-dummies` när jag började, tomt. Jag försökte ändå skapa ett nytt som heter `github-for-dummies`, men GitHub nekade min koppling (felkod 403). Det hade heller inte gått, eftersom GitHub ser stora och små bokstäver som samma namn. Så allt ligger i det befintliga projektet.
- **Utseendet:** rent svart bakgrund, vit text, grå etikett ovanför, Helvetica Neue och 16 pixlars rundade hörn. Inga skuggor. Jag lade till en tunn mörkgrå kant (`#26282b`, samma som `tile-dim`) runt bubblan så att den syns mot GitHubs mörka läge. Ikonen är en svart pratbubbla med grå kant av samma skäl.
- **Bubblan visar GitHubs eget namn** på saken överst i grått (till exempel Fork), och förklaringen under. Då lär man sig de engelska orden samtidigt.
- **Varje förklaring har en rad om nyttan**, under en tunn linje och rubriken Nytta. Den börjar alltid med "När du" och berättar i vilken situation saken hjälper dig. Det är lättare att komma ihåg en knapp när man vet vad man ska ha den till.
- **Ordet "issue"** fick stå kvar, eftersom det är det GitHub skriver. Det förklaras som en lapp om något som ska fixas. Samma sak med branch, commit och pull request.
- **Knappar hittas på sex sätt**, i den här ordningen: id, aria-label (och title, placeholder och den separata tooltip-text som GitHub ofta använder, aria-labelledby), länkadress, CSS-väljare och sist knapptexten. Siffror som 165k tas bort före jämförelsen.
- **Listor och menyer som helhet** får aldrig en bubbla för sitt namn. Annars skulle till exempel varje rad i issue-listan få förklaringen för hela listan.
- **Text som människor har skrivit**, som README-texten och kommentarer, får aldrig någon bubbla även om ett ord råkar vara samma som en knapp.
- **Länkar med filter**, som listan över bara öppna issues, behandlas inte som själva fliken.
- **Bubblan försvinner** när du flyttar musen, trycker Esc, klickar, byter flik eller rullar sidan. Efter Esc eller klick kommer den inte tillbaka förrän du har flyttat musen till något annat.
- **Tillägget körs bara på github.com**, inte på andra sidor och inte på gist.github.com.

## Vad som är testat och inte

- **Svep inloggad i en riktig Chrome, 15 oktober 2026:** skriptet `tests/real/sweep-in-browser.js` höll musen över varje knapp, länk, flik och rubrik med det riktiga tillägget, inloggad som substnc. Det gällde nio sidor: startsidan med huvudmenyn öppen, ett eget projekt med Code-menyn öppen, ärendelistan, ett ärende och ett ändringsförslag i react/react, notiserna, profilen med profilmenyn öppen, kontoinställningarna och inställningarna för ett projekt. Siffrorna står i `tests/real/sweep-logged-in-log.txt`.

- **Testat live mot github.com i Chrome (Chromium):** tillägget laddades och musen hölls över 38 av delarna i uppdraget på riktiga sidor (projektet microsoft/vscode, en issue och en pull request i facebook/react, plus vercel/next.js för Discussions). Alla 38 gav rätt förklaring. Resultatet ligger i `tests/real/live-result.json`.
- **Svep över tio riktiga sidor:** jag sparade tio sidor från github.com (två projekt, issue-lista, en issue, pull request-lista, en pull request med Conversation, Commits och Files changed, en filsida och Releases) och lät musen gå över varenda knapp, flik, länk och rubrik på dem. Där jag hittade saker utan förklaring eller med fel förklaring rättade jag och körde om. Siffrorna står i `tests/real/sweep-log.txt`.
- **Testsidor med inloggade knappar:** 159 av 159 rätt på mina egna testsidor som härmar GitHub, även fördröjningen, Esc, att bubblan håller sig inom skärmen, att GitHubs utseende inte krockar och att på/av-knappen sparar valet.

**Begränsningar i testerna, ärligt:**

- **Utloggad:** jag kunde inte logga in. Knappar som bara syns inloggad är därför bara testade på mina egna testsidor, inte live: plus-menyn, notisklockan, profilmenyn, Settings-fliken, Add file, Merge-knapparna, Review changes, Approve, Comment-rutan och Close issue.
- **Utan GitHubs skript:** testmiljön blockerade filerna från github.githubassets.com. Sidorna laddades alltså med GitHubs riktiga innehåll men utan stil och utan skript. Därför kunde menyer som öppnas med ett klick (innehållet i den gröna Code-knappen, branch-listan, plus-menyn) inte öppnas live. De är testade på mina testsidor.
- **Inte testat i Safari:** det kräver en Mac med Xcode. Kommandot `xcrun` finns inte på Linux, så jag kunde bara skriva skriptet `bygg-safari.sh`.

Svepet inloggat kör du genom att klistra in `tests/real/sweep-in-browser.js` i konsolen i Chrome (Cmd + Alt + J) på en sida på github.com. Testerna går också att köra igen: `npm test` för testsidorna, `node tests/real/live-check.js` för live-kontrollen och `node tests/real/fetch-pages.js` följt av `node tests/real/sweep-real.js` för svepet (kräver Node och Playwright). De sparade sidorna läggs inte upp på GitHub, eftersom det är andras innehåll.
