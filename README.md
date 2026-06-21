# World Cup FanPulse

**World Cup FanPulse** is a premium fan engagement platform built for the FIFA World Cup 2026. It gives fans a single destination to follow matches, make predictions, explore insights, and engage with the tournament throughout the event.

This is a standalone personal project — a polished consumer sports product, not a demo or client proposal.

## Product Vision

FanPulse is designed to be the ultimate companion experience for World Cup fans:

- Follow favorite teams and match schedules
- Track live scores and match status
- Explore group standings and host stadiums
- Vote in fan polls and submit predictions
- Discover tournament storylines through an Insights Dashboard
- Explore AI-style match and tournament observations (mocked for prototype)

Monetization areas (e.g. “Presented by Global Connect”) are subtle and integrated — the fan experience always comes first.

## Main Features

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured match, today’s matches, feature cards |
| `/matches` | Searchable/filterable full match schedule with group standings |
| `/matches/[id]` | Match center — comparison, prediction, AI explainer, stories |
| `/predictor` | Tournament predictor — group picks, bracket preview, champion |
| `/teams` | All 48 teams with search and group filter |
| `/stadiums` | Host stadiums and cities |

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **React**
- **CSS Modules** + global design tokens
- **npm**
- **[@khamudom/lumen-ui-react](https://www.npmjs.com/package/@khamudom/lumen-ui-react)** — published component library

Not used: Tailwind, Material UI, Chakra, Bootstrap.

## Lumen UI Integration

FanPulse composes UI from `@khamudom/lumen-ui-react` (Button, Card, Badge, Input, Select, Tabs, Table, Progress, Alert, etc.). Custom components wrap Lumen primitives rather than reimplementing them.

### Install the library

```bash
npm install @khamudom/lumen-ui-react
```

### Global styles

In `src/app/layout.tsx`:

```ts
import '@khamudom/lumen-ui-react/styles.css';
```

The package export `./styles.css` maps to `dist/lumen-react.css`. Next.js resolves the export path reliably; a direct `dist/` subpath import may fail depending on package `exports` configuration.

### Next.js config

`next.config.ts` includes `transpilePackages: ['@khamudom/lumen-ui-react']` so the library compiles correctly with Next.js.

## World Cup API Integration

All API access lives in **`src/services/worldCupApi.ts`** — pages and components never fetch directly.

**Base URL:** `https://worldcup26.ir/get`

| Endpoint | Service function |
|----------|------------------|
| `/teams` | `getTeams()` |
| `/games` | `getMatches()` |
| `/groups` | `getGroups()` |
| `/stadiums` | `getStadiums()` |

Responses are mapped to typed domain models with graceful fallback to mock data when the API is unavailable.

## Real vs Mocked Data

### Live API (when available)

- Teams (names, flags, groups, FIFA codes)
- Matches (schedule, scores, status, stadiums)
- Group standings
- Stadiums (venues, cities, capacity, match counts)

### Mock / prototype data

- Fan polls and vote percentages
- Prediction challenge and tournament predictor persistence (local React state only)
- AI match insights and tournament observations
- Articles and related stories
- Team comparison stats on match detail
- Insights dashboard KPIs, sentiment, trending teams, player storylines
- Analytics metrics and timeline narrative copy

## Project Structure

```
src/
  app/              # App Router pages
  components/       # Reusable UI (compose Lumen)
  data/             # Typed mock fallbacks
  services/         # worldCupApi.ts
  types/            # Shared TypeScript interfaces
```

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # production server
npm run lint    # ESLint
```

## Accessibility

- Semantic HTML (`main`, `nav`, headings, `time`)
- Real links and buttons for navigation/actions
- Form labels on inputs and selects
- Visible focus styles
- ARIA labels on polls, progress bars, and live regions
- Keyboard-accessible interactive controls

## Future Enhancements

- Real AI integration (LLM-backed insights)
- User accounts and saved predictions
- Real-time match updates (WebSocket / polling)
- Push notifications
- Personalization (favorite teams)
- Newsletter integration
- Sponsor/partner modules
- Analytics dashboard for operators
- Multi-sport expansion

## License

Private / personal project — see repository owner for usage terms.
