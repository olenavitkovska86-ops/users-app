# Users App

En webbapp för att visa användarkonton, en användaröversikt och detaljer om enskilda användare.

## Aktuell status

Projektets grund är klar. Appen visar rubriken **Users App**.
Navigering, användarlistor och API-anslutning utvecklas i kommande steg.

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
- `src/assets`, `src/components`, `src/layouts`, `src/pages` – mappar för kommande delar.
