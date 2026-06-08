# Budget Vibes

Offline-first Expo (React Native) budgeting app with presets, multi-currency support, animated charts, and local persistence.

## Features

- **Home** — Enter a budget amount, select a preset, view pie/bar breakdown
- **Presets** — Create and edit category splits (must total 100%), saved to AsyncStorage
- **Profile** — Name, email, currency, profile photo from device
- **Settings** — Dark/light mode, larger text, chart type, FAQ (nested under Settings)

## Run

```bash
npm install
npx expo start -c
```

Requires **Expo Go SDK 54** (matches `expo@~54` in package.json). If you upgraded from SDK 53, run:

```bash
npm install
npx expo install --fix
npx expo start -c
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

## Color palette

| Token | Hex |
|-------|-----|
| Primary | `#7286A0` |
| Secondary | `#7D6F86` |
| Background | `#FFF4E9` |
| Accent | `#F9564F` |
| Text | `#0A0908` |

## Key files

- `src/services/storage.ts` — AsyncStorage load/save
- `src/services/budget.ts` — Preset creation and breakdown calculation
- `src/components/BudgetChart.tsx` — Animated SVG chart + share export
