# Users App

En webbapp för att visa användarkonton, en användaröversikt och detaljer om enskilda användare.

## Aktuell status

Appen har en översikt, en användarlista och en detaljsida för varje användare.
Sidorna använder fyra fiktiva användare; demonstrationsdata är tydligt märkta.
Navigeringen visar aktuell sida och fungerar med länkar mellan listan och detaljerna.
Sökfältet är ännu inte aktiverat. En separat API-klient är klar, men ännu inte ansluten till sidorna.

## Teknik

React, TypeScript med `strict`, Vite, Tailwind CSS via Vite-plugin, lucide-react och react-router-dom.
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
- `src/data/demoUsers.ts` – tillfälliga demonstrationsdata.
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

Kontrollen använder demonstrationsdata och serverrendering utan API-anrop.
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

API:et har en gräns på **100 anrop per dag**. Sidorna använder fortfarande demonstrationsdata
och gör inga API-anrop. Felkontrollerna använder en mockad `fetch`:

```bash
node scripts/check-users-api.mjs
```
