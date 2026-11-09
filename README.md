# OpenCal

OpenCal is an open scheduling application built with Next.js, TypeScript,
Tailwind CSS, shadcn/ui, and Supabase. Phase 1 provides the polished application
shell, shared design system, environment-safe Supabase clients, and quality
tooling that later product work will build on.

## Run locally

Requirements:

- Node.js 22 or newer
- npm
- Docker (optional, for the local Supabase stack)
- Supabase CLI (optional, for local database services)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3741](http://localhost:3741). The app works without
Supabase credentials and shows a clear foundation-mode notice.

## Supabase setup

For a local stack:

```bash
supabase start
```

Copy the API URL and publishable key from the command output into `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-local-publishable-key
```

These are the only application environment variables in Phase 1. A service-role
key is intentionally not used or exposed. Browser and server clients both read
the public configuration through the same validated helper and return `null`
when configuration is unavailable.

`supabase/config.toml` contains the local service configuration.
`supabase/migrations/` is the future schema authority; the first migration lands
with the Phase 2 data model.

## Architecture

- `src/app/` — App Router entry point, metadata, global states, and route groups
- `src/app/(public)/` — future public scheduling surfaces
- `src/app/(auth)/` — future registration and sign-in surfaces
- `src/app/(app)/` — future authenticated application surfaces
- `src/components/` — reusable shell, landing, and shadcn/ui components
- `src/lib/supabase/` — validated configuration and typed client factories
- `src/types/database.ts` — placeholder for generated Supabase database types
- `supabase/` — local configuration and versioned migrations

Server Components are the default. Client Components are limited to UI that
requires browser interaction, such as the global error recovery action.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Vitest covers foundational utility and configuration behavior. ESLint uses the
Next.js recommended rules, and `tsc --noEmit` enforces strict type safety.

## Phase boundary

Phase 1 does not implement registration, login, profiles, protected routes,
calendar data, availability, or scheduling requests. Those remain in Phases
2–5 so each feature can arrive with its own schema migration, row-level security
policies, validation, and tests.
