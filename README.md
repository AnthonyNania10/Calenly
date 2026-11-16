# OpenCal

OpenCal is an open scheduling application built with Next.js, TypeScript,
Tailwind CSS, shadcn/ui, date-fns, and browser-local persistence. This build is
a polished product shell for exploring OpenCal without accounts, credentials,
remote services, or a database.

## Run locally

Requirements:

- Node.js 22 or newer
- npm

```bash
npm install
npm run dev
```

Open [http://localhost:3741](http://localhost:3741). No environment variables
or external services are required.

## Local-first data

The profile, calendar events, weekly availability, booking preferences, and
incoming and outgoing request state are stored in `localStorage` under the
versioned `opencal.local-state` key.
`src/lib/local-state.ts` is the only module that reads or writes the serialized
shape. It provides:

- a Zod schema for the complete state and profile
- deterministic defaults
- explicit schema versioning
- migrations from the original profile schema through calendar, availability,
  and connection schema versions
- safe recovery from invalid JSON, stale versions, and unavailable storage
- validated writes and a complete reset operation

The React provider starts with the same default snapshot on the server and
client, then hydrates browser data after mount. This prevents server rendering
from depending on browser APIs or producing hydration mismatches.

## Architecture

- `src/app/(app)/` — dashboard, settings, navigation destinations, and loading
  state
- `src/components/app-shell.tsx` — responsive desktop and mobile navigation
- `src/components/dashboard-content.tsx` — schedule, requests, upcoming events,
  and quick actions
- `src/components/calendar-content.tsx` — responsive month calendar and local
  event creation, editing, and deletion
- `src/components/requests-content.tsx` — pending, accepted, and declined
  request management; accepted requests become local calendar events
- `src/components/availability-content.tsx` — weekly hours, meeting duration,
  booking buffer, and minimum-notice preferences
- `src/components/connections-content.tsx` — shared-link parsing, calendar
  previews, outgoing request composition, recent calendars, and request history
- `src/components/settings-content.tsx` — validated local profile editor,
  preview, public URL, and reset control
- `src/components/local-state-provider.tsx` — hydration-safe React state bridge
- `src/lib/local-state.ts` — versioned storage contract and validation
- `src/lib/calendar-links.ts` — safe calendar-link parsing and normalization
- `src/components/ui/` — shadcn/ui primitives

Server Components are the default. Client Components are limited to UI that
requires browser state or interaction.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Vitest covers persistence round trips, multi-version migration, recovery, reset
behavior, profile validation, calendar event validation, and availability
constraints. It also covers calendar-link parsing and outgoing request
validation. ESLint uses the Next.js recommended rules, and `tsc --noEmit`
enforces strict type safety.

## Current boundaries

This is a single-device prototype. It does not include authentication, remote
sync, multi-user collaboration, a database, external calendar synchronization,
recurrence, generated time slots, integrations, notifications, or public booking
pages. Connection requests are composed and tracked locally but are not delivered
to another person without a future shared backend. Clearing site data or
switching browsers removes local changes.
