# Users App

En webbapp för att visa användarkonton, statistik och detaljer om enskilda användare.
Gränssnittet är på svenska och anpassat för mobil, surfplatta och dator.

## Funktioner

- Översikt med antal användare, roller, teman och aktiverade aviseringar. Statistiken länkar till filtrerade användarlistor.
- Lokal sökning efter namn, användarnamn, e-post och ort, kombinerad med URL-filter.
- Användardetaljer med adress, roller, valt tema och aviseringsinställningar. Sökning och filter bevaras vid återgång från profilen.
- Gemensam navigering, laddningsindikatorer, tomma tillstånd och svenska felmeddelanden.
- Manuella återförsök med skydd mot dubbla klick och väntetid vid HTTP 429. Tidigare data behålls vid uppdateringsfel.

## Teknik

React, TypeScript med `strict`, Vite, Tailwind CSS, React Router, TanStack Query och lucide-react.
Oxlint används för kodkontroll.

## Installation och körning

Använd Node.js 22.12 eller senare inom version 22, och npm.

```bash
npm install
npm run dev
```

Öppna adressen som visas i terminalen. Ingen lokal `.env` behövs.

```bash
npm run build    # TypeScript-kontroll och produktionsbygge i dist
npm run preview  # Förhandsvisa produktionsbygget lokalt
```

## Sidor

| Adress | Sida |
| --- | --- |
| `/` | Omdirigerar till `/dashboard` |
| `/dashboard` | Användaröversikt |
| `/users` | Användarlista med sökning och filter |
| `/users/:userId` | Användardetaljer |
| Övriga adresser | Sidan hittades inte |

## API och cache

Appen använder `GET https://api-userapi.onrender.com/api/users/getUsers` med kursens API-nyckel
i headern `x-api-key`. Nyckeln finns i klientkoden och är synlig i webbläsaren.
API-klienten validerar svarets struktur och hanterar nätverksfel, HTTP-fel och ogiltiga svar.

Alla sidor delar TanStack Query-cachen via `useUsers` och query-nyckeln `["users"]`.
Sökning, filter, statistik och användardetaljer beräknas lokalt utan extra API-anrop.
Data räknas som färska i en timme och inaktiv cache behålls i 24 timmar.
Automatiska återförsök, uppdateringar vid sidbyte/fokus/återanslutning och polling är avstängda.

API:et tillåter **100 anrop per dag**. Cachen finns bara i minnet, så omladdning och andra
fönster eller enheter kan orsaka nya anrop. Appen kan därför inte garantera den gemensamma dygnsgränsen.
Vid HTTP 429 används `Retry-After`, eller 60 sekunders väntetid om headern saknas eller är ogiltig.
Väntetiden startar inga automatiska anrop och betyder inte att dygnsgränsen återställs.

## Projektstruktur

- `src/pages` – översikt, lista, användardetaljer och felsida för okända adresser.
- `src/components` och `src/layouts` – återanvändbara komponenter och gemensam layout.
- `src/api`, `src/hooks` och `src/lib` – API-klient, query, cache, sökning, filter och felhantering.
- `src/types` – TypeScript-typer.
- `scripts` och `src/data/demoUsers.ts` – kontroller och testdata; testdata används inte av appens sidor.

## Kontroller

```bash
npm run lint
npm run build
node scripts/check-users-api.mjs
node scripts/check-routing.mjs
node scripts/check-users-query.mjs
node scripts/check-users-errors.mjs
node scripts/check-user-search.mjs
node scripts/check-user-filters.mjs
```

Samtliga kontroller har körts med godkänt resultat. Skripten använder mockade svar och
serverrendering utan riktiga API-anrop. Navigation, sökning, filter, felhantering och responsiv
layout har även kontrollerats i headless Chrome. Laddning från det riktiga API:et har bekräftats
manuellt i webbläsaren. Tester på fysiska enheter och en fullständig tillgänglighetsgranskning
har inte genomförts.

## Begränsningar och driftsättning

Appen är en läsvy utan inloggning eller möjlighet att skapa, ändra eller ta bort konton.
Profilens tema påverkar bara profilkortet; aviseringsinställningar visas som information.
En direktöppnad profil länkar tillbaka till den ofiltrerade användarlistan.

Produktionshosting är inte konfigurerad. Vid driftsättning måste webbservern returnera
`index.html` för appens adresser, så att direktlänkar fungerar.
