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
6. **Sätt fast ikonen.** Klicka på pusselbiten uppe till höger i Chrome. Klicka på nålen bredvid **Plain Words for GitHub SWE**. Nu syns ikonen, en vit pratbubbla med en markör på svart botten, i verktygsfältet.
7. **Prova.** Gå till https://github.com/facebook/react och håll musen still över knappen **Star** eller fliken **Issues**.

Chrome kan ibland visa en ruta om att tillägg i utvecklarläge kan vara osäkra. Det gäller tillägg du inte känner till. Det här tillägget läser bara sidor på github.com och skickar ingenting någonstans.

## Installera i Safari

Det finns två sätt. Det första är enklast och kräver ingenting extra, men tillägget är bara tillfälligt. Det andra är permanent men kräver programmet Xcode.

### Snabbt och tillfälligt, utan Xcode

Kräver Safari 26 eller senare. Testat i Safari 27.

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
