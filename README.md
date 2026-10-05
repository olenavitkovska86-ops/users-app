# Users App

En webbapp för att visa användarkonton, en användaröversikt och detaljer om enskilda användare.

## Aktuell status

Appen har en översikt, en användarlista och en detaljsida för varje användare.
Sidorna använder en gemensam användarlista från API:et via TanStack Query.
Navigeringen visar aktuell sida och fungerar med länkar mellan listan och detaljerna.
Laddning, tydliga felmeddelanden och tomma listor visas. Cachade data behålls vid fel under en uppdatering.
Manuella återförsök skyddas mot upprepade klick och begränsas vid HTTP 429.
Användarlistan har lokal sökning med möjlighet att rensa sökningen och ett meddelande utan träffar.
Detaljsidan visar även valt tema samt inställningar för e-post- och pushaviseringar.

## Teknik

React, TypeScript med `strict`, Vite, Tailwind CSS via Vite-plugin, lucide-react, react-router-dom och TanStack Query.
Projektet använder Oxlint för kodkontroll.

## Installation

Använd Node.js 22.12 eller senare inom version 22, och npm.

```bash
npm install
```

## Utveckling

```bash
npm run dev
```

Öppna adressen som visas i terminalen.

## Bygg

```bash
npm run build
```

Kommandot kontrollerar TypeScript och skapar produktionsfiler i `dist`.

## Kodkontroll

```bash
npm run lint
```

## Struktur

- `src/App.tsx` – appens huvudkomponent.
- `src/main.tsx` – startar React och kopplar appen till HTML-sidan.
- `src/index.css` – importerar Tailwind CSS.
- `src/components/layout` – sidopanel och sidhuvud.
- `src/components/users` – användarlista, kort, sökfält och rollmärken.
- `src/layouts/AppLayout.tsx` – gemensam layout med `Outlet` för aktuell sida.
- `src/pages` – översikt, användarlista, användardetaljer och sidan för okända adresser.
- `src/types/user.ts` – användarens TypeScript-typ.
- `src/api/users.ts` – HTTP-anrop, feltyper och kontroll av svarets struktur.
- `src/hooks/useUsers.ts` – gemensam query för användarna.
- `src/lib/queryClient.ts` – en gemensam QueryClient och cacheinställningar.
- `src/lib/usersError.ts` – användarvänliga felmeddelanden och väntetid för återförsök.
- `src/lib/filterUsers.ts` – lokal filtrering av användarlistan utifrån söktext.
- `src/components/states` – laddning, fel och tom användarlista.
- `src/data/demoUsers.ts` – testdata för mockkontroller; används inte av appens sidor.
- `src/assets` – mapp för framtida lokala resurser.

## Sidor och adresser

| Adress | Sida |
| --- | --- |
| `/` | Omdirigerar till `/dashboard` |
| `/dashboard` | Översikt med lokalt beräknade antal och fördelningar |
| `/users` | Användarlista |
| `/users/:userId` | Användardetaljer eller ett meddelande om att användaren inte finns |
| Övriga adresser | Sidan hittades inte |

Sidopanelen och sidhuvudet delas mellan sidorna. Vid driftsättning behöver webbservern
returnera `index.html` även för appens adresser, så att direktlänkar fungerar.

## Kontroll av sidornas innehåll

```bash
node scripts/check-routing.mjs
```

Kontrollen använder testdata i query-cachen och serverrendering utan API-anrop.
Den kontrollerar sidornas innehåll, länkar och aktiv navigering. Denna kontroll simulerar inte klick eller webbläsarens historik. Se även webbläsarkontrollerna nedan.

## API-klient

API-klienten använder `GET https://api-userapi.onrender.com/api/users/getUsers`
och skickar kursens API-nyckel i headern `x-api-key`.
Nyckeln finns för närvarande som en konstant i klienten och är synlig i frontend-koden.
Den är inte en skyddad hemlighet. Ingen lokal `.env` behövs med denna konfiguration. Om nyckeln senare flyttas till en
`VITE_*`-variabel är den fortfarande synlig i frontend-bundlen; variabeln skyddar inte nyckeln.

`fetchUsers` kontrollerar HTTP-status, läser JSON och validerar alla obligatoriska fält
innan svaret används som `User[]`. Tomma listor och nya rollnamn är tillåtna.
Klienten skiljer på nätverksfel, HTTP-fel, ogiltig JSON och felaktig datastruktur.
Ett valfritt `AbortSignal` stöds; avbrutna anrop omvandlas inte till nätverksfel.
För HTTP-fel sparas status och eventuell `Retry-After` för senare felhantering.

API:et har en gräns på **100 anrop per dag**. Appens första laddning använder API:et.
Felkontrollerna använder en mockad `fetch`:

```bash
node scripts/check-users-api.mjs
```

## Data och cache

Alla tre innehållssidor använder `useUsers` med samma `queryKey`: `["users"]`.
Detaljsidan söker efter användaren i den gemensamma listan och har inget eget API-anrop.
Statistiken räknas lokalt, och användare med flera roller räknas i varje relevant roll.

| Inställning | Värde | Betydelse |
| --- | --- | --- |
| `staleTime` | 1 timme | Hur länge data betraktas som färska |
| `gcTime` | 24 timmar | Hur länge inaktiva data behålls i minnet |
| `retry` och `retryOnMount` | `false` | Inga automatiska återförsök, även efter sidbyte |
| `refetchOnMount` | `false` | Sidbyten orsakar ingen uppdatering av cachade data |
| `refetchOnWindowFocus` | `false` | Ingen uppdatering när fönstret får fokus |
| `refetchOnReconnect` | `false` | Ingen automatisk uppdatering vid återanslutning |

Ingen polling används. En pågående query får slutföras även om en sida tillfälligt avmonteras,
så att navigation och utvecklingslägets StrictMode kan återanvända samma anrop.
API-klienten stöder fortfarande explicit avbrytning med `AbortSignal`.

Cachen finns bara i minnet och töms vid en fullständig omladdning. Den delas inte mellan
enheter och garanterar därför inte den totala dygnsgränsen. Att `staleTime` löper ut
startar ingen timerstyrd uppdatering; befintliga data visas tills de uppdateras eller cachen försvinner.

```bash
node scripts/check-users-query.mjs
```

Mockkontrollen verifierar delad cache, avmontering/återmontering, laddning, tomma listor,
initiala fel och bibehållna data vid uppdateringsfel. Den gör inga riktiga API-anrop.

## Fel och återförsök

Appen visar olika svenska meddelanden för nätverksfel, HTTP 401/403/429/5xx,
ogiltig JSON och felaktig datastruktur. Interna felmeddelanden och stack traces visas inte.
En okänd sida skiljs från en saknad användare; användaren söks först efter lyckad datahämtning.

Knappen **Försök igen** startar en manuell hämtning. Den är inaktiverad medan en hämtning
pågår eller väntar på anslutning. Vid HTTP 429 används `Retry-After`, om headern är tillgänglig,
som antal sekunder eller ett datum. Utan giltig header används 60 sekunders väntetid
för att undvika snabba upprepade anrop. Detta innebär inte att dygnsgränsen återställs efter en minut.
Väntetiden utgår från felets tidpunkt i den gemensamma cachen och börjar inte om vid sidbyte.
Nedräkningen uppdaterar bara gränssnittet; den skickar inga anrop och startar inget automatiskt återförsök.

Vid fel under en uppdatering visas en varning tillsammans med tidigare hämtade data.
En tom lista från API:et visas som **Inga användare**. En sökning utan träffar visas som **Inga sökresultat**.

```bash
node scripts/check-users-errors.mjs
```

Mockkontrollen verifierar felmeddelanden på de tre sidorna, `Retry-After`, spärrade återförsök,
skydd mot dubbla klick och bibehållna cachade data. Inga fel provoceras fram mot det riktiga API:et.

## Lokal sökning och användardetaljer

Sökningen matchar delar av namn, användarnamn, e-post och ort utan att skilja på stora och små bokstäver.
Blanksteg i början och slutet ignoreras. Tom söktext visar hela den hämtade listan.
Sökningen och knappen **Rensa sökning** arbetar enbart med lokala data och skickar inga API-anrop.
Resultatantalet visas ovanför listan. Söktexten återställs när användarsidan lämnas.

Detaljsidan visar namn, användarnamn, e-post, adress, roller, valt tema och inställningar
för e-post- och pushaviseringar. Inställningarna visas som information och kan inte ändras i appen.
Appens färger påverkas inte av användarens valda tema, och inga aviseringar skickas.

```bash
node scripts/check-user-search.mjs
```

Kontrollen verifierar söklogik, callbacks för inmatning och rensning, resultatmeddelanden
och inställningar på detaljsidorna. Den använder testdata utan API-anrop.
Denna kontroll simulerar inte användarens inmatning i en riktig webbläsare.

## Samlad verifiering

Kör kodkontroll, produktionsbygge och samtliga mockkontroller:

```bash
npm run lint
npm run build
node scripts/check-users-api.mjs
node scripts/check-routing.mjs
node scripts/check-users-query.mjs
node scripts/check-users-errors.mjs
node scripts/check-user-search.mjs
```

Dessa kommandon har körts med godkänt resultat. Bygget inkluderar TypeScript-kontroll.
Mockkontrollerna använder Node.js och Vites serverrendering, utan ett separat testframework
eller riktiga API-anrop.

I headless Chrome har följande kontrollerats med mockade API-svar: omdirigering,
inmatning i sökfältet, rensning, sökning utan träffar, tangentbordsfokus till rensningsknappen,
länkar mellan listan och detaljerna, bakåt/framåt, direktlänk och okända adresser/användare.
Sidhuvudet behölls under navigering och sidorna återanvände ett enda anrop även i utvecklingslägets
StrictMode. Vid 375 pixlars bredd fanns ingen horisontell överrullning.
Tomma svar, nätverksfel, HTTP 401/403/429/500, ogiltig JSON och felaktig struktur kontrollerades
också i webbläsaren. Väntetiden för 429 startade inget automatiskt återförsök och dubbla klick
startade endast en ny hämtning.

En integration med det riktiga API:et i Node.js hämtade en lista med 10 användare med ett anrop
som sedan återanvändes från cachen. Detta verifierar inte CORS i webbläsaren.
Webbläsarens anslutning till det riktiga API:et och en fullständig visuell bedömning återstår.

## Begränsningar

- Appen är en läsvy; den skapar, ändrar eller tar inte bort konton och har ingen inloggning.
- Sökningen gäller den hämtade listan och återställs när användarsidan lämnas.
- API:et erbjuder hela listan; inga separata detaljanrop används.
- Cachelagringen finns endast i minnet. Omladdning eller ett annat fönster/en annan enhet kan orsaka nya anrop.
- API-nyckeln är synlig för klienten. Appen kan inte ensam garantera den gemensamma dygnsgränsen.
- Produktionshosting är inte konfigurerad. Direktlänkar kräver en SPA-fallback till `index.html`.
- Gränssnittet har responsiv navigering, initialavatarer, fokusmarkeringar och skeleton-laddning. Slutlig regression återstår.
