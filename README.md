# Users App

En webbapp för att visa användarkonton, en användaröversikt och detaljer om enskilda användare.

## Aktuell status

Appen har en översikt, en användarlista och en detaljsida för varje användare.
Sidorna använder en gemensam användarlista från API:et via TanStack Query.
Navigeringen visar aktuell sida och fungerar med länkar mellan listan och detaljerna.
Laddning, grundläggande fel och tomma listor visas. Cachade data behålls vid fel under en uppdatering.
Sökfältet är ännu inte aktiverat. Detaljerad felhantering och kontrollerad återhämtning utvecklas i nästa steg.

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
Den kontrollerar sidornas innehåll, länkar och aktiv navigering. Klick, omdirigeringen
från `/`, bakåt/framåt, tangentbordsfokus och responsiv layout behöver även kontrolleras i webbläsaren.

## API-klient

API-klienten använder `GET https://api-userapi.onrender.com/api/users/getUsers`
och skickar kursens API-nyckel i headern `x-api-key`.
Nyckeln finns för närvarande som en konstant i klienten och är synlig i frontend-koden.
Den är inte en skyddad hemlighet. Ingen lokal `.env` behövs i detta steg.

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
