# GitHub-for-dummies

Ett tillägg till webbläsaren som förklarar GitHub på svenska. Håll musen still över en knapp, flik, meny eller länk på github.com i ungefär en halv sekund, så dyker en svart pratbubbla upp. Den berättar med vardagliga ord vad saken gör och när man använder den.

Allt finns redan i tillägget. Det behövs ingen AI, ingen nyckel och ingen internetanslutning för förklaringarna.

## Installera i Chrome

Det tar ungefär fem minuter. Du gör det bara en gång.

1. **Hämta filerna.** Gå till sidan för projektet på GitHub: https://github.com/substnc/GitHub-for-dummies. Klicka på den gröna knappen **Code** och sedan på **Download ZIP**.
2. **Packa upp.** Öppna mappen Hämtade filer och dubbelklicka på zip-filen. Nu får du en vanlig mapp. Flytta gärna den mappen till ett ställe där den får ligga kvar, till exempel Dokument. Om du raderar mappen slutar tillägget att fungera.
3. **Öppna Chromes tilläggssida.** Skriv `chrome://extensions` i adressfältet högst upp i Chrome och tryck Enter.
4. **Slå på utvecklarläget.** Uppe till höger finns en liten knapp som heter **Utvecklarläge** (på engelska **Developer mode**). Klicka så att den blir påslagen. Det låter farligt men betyder bara att du får lägga in tillägg från din egen dator.
5. **Lägg in tillägget.** Klicka på knappen **Läs in okomprimerat tillägg** (på engelska **Load unpacked**) som dök upp till vänster. Leta upp mappen från steg 2, öppna den och välj mappen som heter **extension**. Klicka **Välj**.
6. **Sätt fast ikonen.** Klicka på pusselbiten uppe till höger i Chrome. Klicka på nålen bredvid **GitHub-for-dummies**. Nu syns den svarta pratbubblan med frågetecken i verktygsfältet.
7. **Prova.** Gå till https://github.com/facebook/react och håll musen still över knappen **Star** eller fliken **Issues**.

Chrome kan ibland visa en ruta om att tillägg i utvecklarläge kan vara osäkra. Det gäller tillägg du inte känner till. Det här tillägget läser bara sidor på github.com och skickar ingenting någonstans.

## Installera i Safari

Safari är krångligare, eftersom Apple kräver att tillägg byggs om till en liten app med programmet Xcode. Den här delen är **inte testad**, eftersom jag inte hade någon Mac. Stegen följer Apples egna instruktioner.

**Det här behöver du installera först:**

- **Xcode**, gratis i App Store på din Mac. Sök på Xcode och klicka Hämta. Det är ett stort program (flera gigabyte), så det tar en stund.
- När Xcode är installerat: öppna det en gång, godkänn villkoren och låt det installera det som det ber om. Sedan kan du stänga det.

**Sedan gör du så här:**

1. **Hämta filerna** på samma sätt som i steg 1 och 2 för Chrome ovan.
2. **Öppna Terminal.** Tryck Cmd och mellanslag samtidigt, skriv `Terminal` och tryck Enter. Ett fönster där man skriver kommandon öppnas.
3. **Gå till mappen.** Skriv `cd` följt av ett mellanslag. Dra sedan in den uppackade mappen från Finder och släpp den i Terminal-fönstret. Tryck Enter.
4. **Bygg Safari-versionen.** Skriv `bash bygg-safari.sh` och tryck Enter. Vänta tills det står Klart.
5. **Öppna projektet i Xcode.** Gå in i den nya mappen **safari** och sedan **GitHub-for-dummies**, och dubbelklicka på filen **GitHub-for-dummies.xcodeproj**.
6. **Starta appen.** Klicka på Play-knappen (en triangel) uppe till vänster i Xcode. Om Xcode frågar om **Team** eller **Signing**: välj ditt namn om det finns, annars **Sign to Run Locally**. En liten app öppnas. Den kan du stänga.
7. **Tillåt tillägget i Safari.** Öppna Safari och gå till **Safari > Inställningar > Avancerat**. Bocka i **Visa funktioner för webbutvecklare**. Gå sedan till fliken **Utvecklare** i samma inställningsfönster och bocka i **Tillåt osignerade tillägg**. Safari frågar efter ditt lösenord.
8. **Slå på det.** Gå till fliken **Tillägg** i Safaris inställningar och bocka i **GitHub-for-dummies**. Klicka på tillägget och välj att det får köras på github.com.

Bra att veta: Safari glömmer **Tillåt osignerade tillägg** varje gång du startar om Safari. Då behöver du göra steg 7 igen. Det slipper man bara om tillägget signeras med ett betalt Apple-utvecklarkonto.

## Använda tillägget

- **Visa en förklaring:** håll musen still över något på github.com i ungefär en halv sekund.
- **Stänga bubblan:** flytta musen därifrån eller tryck på Esc.
- **Stänga av alla bubblor:** klicka på tilläggets ikon i verktygsfältet och slå av knappen **Förklaringar**. Valet sparas tills du slår på det igen.

## Om något inte fungerar

- **Ingen bubbla dyker upp:** ladda om sidan på GitHub. Kolla att knappen i tilläggets ruta är påslagen.
- **Ingen bubbla på en viss knapp:** den knappen saknar förklaring, eller så har GitHub ändrat hur den ser ut i koden. Det är normalt att vissa saker saknas.
- **Chrome säger att tillägget har fel:** kontrollera att du valde mappen **extension** i steg 5 och inte mappen utanför.

## Vad som får förklaring

160 förklaringar finns i filen `extension/explanations.js`. De täcker bland annat:

- **Toppen av sidan:** sökfältet, plus-menyn och allt i den, notisklockan, din profilmeny, huvudmenyn, GitHub-loggan, Copilot, logga in och skapa konto.
- **Flikarna i ett projekt:** Code, Issues, Pull requests, Actions, Projects, Wiki, Security, Insights, Settings, Discussions och knappen för fler flikar.
- **Projektets huvud:** Star, stjärnlistor, Fork, Watch, Sponsor, Pin, projektets och ägarens namn.
- **Den gröna Code-knappen och dess meny:** Local, Codespaces, Create codespace, HTTPS, SSH, GitHub CLI, adressen, kopiera-knappen, Open with GitHub Desktop, Open with Visual Studio och Download ZIP.
- **Filer:** branch-väljaren, Branches, Tags, Go to file, Add file, Create new file, Upload files, mappar, filer, Blame, Raw, Preview, ändra fil, Symbols och filträdet.
- **Historik och fakta:** Commits, enskilda commits, README, License, Code of conduct, Contributing, Security policy, About, Topics, Releases, Packages, Contributors, Languages, Stars, Watchers, Forks, Activity, Used by, Deployments och Report repository.
- **Inne i en issue:** New issue, sökfältet, Open och Closed, status, Labels, Milestones, Assignees, Type, Projects, Development, Create a branch, Relationships, Subscribe, Participants, Lock, Pin, Transfer, Delete, Comment, Write, Preview, Close issue, Reopen, reaktioner, Edit, Quote reply och Copy link.
- **Inne i en pull request:** Conversation, Commits, Checks, Files changed, Reviewers, Review changes, Approve, Request changes, Start a review, Merge pull request, Squash and merge, Rebase and merge, Confirm merge, Enable auto-merge, Update branch, Close pull request, Ready for review, Convert to draft, Delete branch, Revert, Resolve conversation, Viewed, Unified, Split och Hide whitespace.
- **Lite till:** New workflow, Run workflow, Re-run jobs, Draft a new release, Sync fork och Contribute.

## Ändra eller lägga till en förklaring

Öppna `extension/explanations.js` i en textredigerare. Varje förklaring ser ut ungefär så här:

```js
{
  key: "fork",
  name: "Fork",
  text: "Gör en egen kopia av hela projektet på ditt konto. Använd den när du vill ändra fritt utan att röra originalet.",
  ids: ["fork-button"],
  texts: ["fork"]
}
```

Ändra texten mellan citattecknen efter `text:`. Spara filen. I Chrome går du till `chrome://extensions` och klickar på den runda pilen på tillägget. Ladda sedan om GitHub-sidan.

## Val jag gjorde

- **Projektet på GitHub fanns redan** som `substnc/GitHub-for-dummies` när jag började, tomt. Jag använde det i stället för att skapa ett nytt. Stora och små bokstäver spelar ingen roll i adressen.
- **Utseendet följer sub.stnc® Dark:** rent svart bakgrund, vit text, grå etikett ovanför, Helvetica Neue och 16 pixlars rundade hörn. Inga skuggor. Jag lade till en tunn mörkgrå kant (`#26282b`, samma som `tile-dim`) runt bubblan så att den syns mot GitHubs mörka läge. Ikonen är en svart pratbubbla med grå kant av samma skäl.
- **Bubblan visar GitHubs eget namn** på saken överst i grått (till exempel Fork), och förklaringen under. Då lär man sig de engelska orden samtidigt.
- **Ordet "issue"** fick stå kvar, eftersom det är det GitHub skriver. Det förklaras som en lapp om något som ska fixas. Samma sak med branch, commit och pull request.
- **Knappar hittas på fem sätt**, i den här ordningen: id, aria-label (och title och placeholder), länkadress, CSS-väljare och sist knapptexten. Siffror som 165k tas bort före jämförelsen.
- **Text som människor har skrivit**, som README-texten och kommentarer, får aldrig någon bubbla även om ett ord råkar vara samma som en knapp.
- **Länkar med filter**, som listan över bara öppna issues, behandlas inte som själva fliken.
- **Bubblan försvinner** när du flyttar musen, trycker Esc, klickar, byter flik eller rullar sidan. Efter Esc eller klick kommer den inte tillbaka förrän du har flyttat musen till något annat.
- **Tillägget körs bara på github.com**, inte på andra sidor och inte på gist.github.com.

## Vad som är testat och inte

- **Testat i Chrome (Chromium):** tillägget laddades i en riktig Chromium och musen hölls över 159 olika saker på fyra sidor: ett projekt, en lista med issues, en issue och en pull request. Alla 159 gav rätt förklaring. Även fördröjningen, Esc, att bubblan håller sig inom skärmen, att GitHubs utseende inte krockar och att på/av-knappen sparar valet testades och fungerade.
- **Inte testat mot riktiga github.com:** min arbetsmiljö fick inte öppna github.com i en webbläsare. Testsidorna är därför byggda för att efterlikna GitHub, med samma id, knappnamn och länkar som GitHub använder. Jag kontrollerade knapptexterna mot riktiga GitHub-sidor i textform. Det kan ändå finnas knappar där GitHub gör annorlunda än jag trott. Prova själv och skriv ner vilka knappar som inte visar något.
- **Inte testat i Safari:** det kräver en Mac med Xcode.
- **Inte testat inloggad:** vissa knappar ser annorlunda ut när man är inloggad, till exempel Merge-knappen och Settings-fliken.

Testerna går att köra igen med `npm test` (kräver Node och Playwright).
