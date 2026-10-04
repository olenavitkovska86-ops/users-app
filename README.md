# Users App

En webbapp för att visa användarkonton, en användaröversikt och detaljer om enskilda användare.

## Aktuell status

En statisk användarsida visar fyra fiktiva användare i återanvändbara kort.
Gränssnittet innehåller sidopanel, sidhuvud, rollmärken och ett sökfält som ännu inte är aktiverat.
Demonstrationsdata är tydligt märkta. Navigering och API-anslutning utvecklas i kommande steg.

## Teknik

React, TypeScript med `strict`, Vite, Tailwind CSS via Vite-plugin och lucide-react.
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
- `src/layouts/AppLayout.tsx` – gemensam layout med `children`.
- `src/pages/UsersPage.tsx` – användarsidan.
- `src/types/user.ts` – användarens TypeScript-typ.
- `src/data/demoUsers.ts` – tillfälliga demonstrationsdata.
- `src/assets` – mapp för framtida lokala resurser.
