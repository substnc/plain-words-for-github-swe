# Texter till Chrome Web Store

Allt här är färdigt att klistra in i Chrome Web Stores utvecklarpanel.

## Paket

Ladda upp `store/plain-words-for-github-swe-1.0.2.zip`. Gör en ny zip med `bash store/pack.sh` efter varje ändring i `extension/`, och höj då `version` i `extension/manifest.json` först.

## Fliken Butikslista (Store listing)

**Namn** (hämtas från paketet): Plain Words for GitHub SWE

**Kort beskrivning** (hämtas från paketet): Förklarar knappar, flikar och menyer på github.com med vardagliga ord på svenska.

**Beskrivning:**

```
GitHub förklarat med vardagliga ord, på svenska.

Många som börjar bygga saker med AI hamnar förr eller senare på GitHub. Där tar det ofta stopp, för allt är fullt av ord som fork, branch och pull request.

Håll markören still över en knapp, flik eller meny på github.com i en halv sekund. Då visas en pratbubbla med tre delar:
• GitHubs eget namn på saken, så att du lär dig de engelska orden.
• Vad den är, med vardagliga ord.
• När du har nytta av den.

383 förklaringar täcker bland annat projektets flikar, den gröna Code-knappen, issues, pull requests, notiser, din profil och inställningar.

Ingen AI, inget konto och ingen internetanslutning behövs. Tillägget samlar inte in något och skickar ingenting någonstans. Stäng av bubblorna med en knapp när du inte behöver dem.

Öppen källkod: https://github.com/substnc/plain-words-for-github-swe
```

**Kategori:** Utvecklarverktyg (Developer Tools)

**Språk:** svenska

**Bilder:**
- Butiksikon 128 x 128: `store/icon-store-128.png` (96 x 96 bild med 16 px genomskinlig kant, som butiken vill ha)
- Skärmbilder 1280 x 800: `store/screenshot-1-copilot.png`, `store/screenshot-2-marketplace.png`, `store/screenshot-3-mcp.png`
- Liten reklamruta 440 x 280: `store/promo-small-440x280.png`

**Webbplats:** https://github.com/substnc/plain-words-for-github-swe

**Supportadress:** https://github.com/substnc/plain-words-for-github-swe/issues

## Fliken Integritet (Privacy practices)

**Enda syfte (Single purpose):**

```
Explains buttons, tabs and menus on github.com in plain Swedish, in a tooltip shown when the user hovers over them.
```

**Motivering för behörigheten storage:**

```
Saves one setting in the user's own browser: whether explanations are switched on or off.
```

**Motivering för åtkomst till github.com (host permission):**

```
The content script must read the github.com page to find the button under the cursor and show the matching explanation. It only runs on github.com.
```

**Fjärrkod (Remote code):** Nej, jag använder ingen fjärrkod.

**Datainsamling:** kryssa inte i någon typ av data. Kryssa i alla tre försäkringarna om att data inte säljs, inte används för annat än syftet och inte används för kreditbedömning.

**Länk till integritetspolicy:** https://github.com/substnc/plain-words-for-github-swe/blob/main/PRIVACY.md

## Fliken Distribution

**Synlighet:** Offentlig

**Länder:** alla (eller bara Sverige om du vill börja smått)

**Pris:** gratis
