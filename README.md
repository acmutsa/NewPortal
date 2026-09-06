# ClubKit

A small monorepo powering the ACM UTSA membership portal API. It exposes public
event data over HTTP and keeps the database schema under version control.

## Structure

| Path | Description |
| --- | --- |
| `apps/api` | Express server exposing a read-only public API for events |
| `packages/db` | Drizzle ORM schema, Zod schemas, and Turso (libSQL) migrations |
| `packages/config` | Shared club/university configuration (`config` package) |

The stack is a [pnpm](https://pnpm.io) workspace orchestrated by
[Turborepo](https://turbo.build). The database is [Turso](https://turso.tech)
(libSQL / SQLite).

## Requirements

- Node.js >= 20
- pnpm 8.9 (`corepack enable` or `npm i -g pnpm@8.9.0`)
- A Turso database (URL + auth token)

## Setup

```bash
pnpm install
```

Create a `.env` file in the repository root:

```bash
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-token"

# apps/api (all optional)
PORT=4000                                   # port the API listens on
PORTAL_BASE_URL="https://portal.acmutsa.org" # base URL used to resolve thumbnail links
```

## Development

```bash
pnpm dev            # run every app in watch mode (turbo)
```

Or just the API:

```bash
pnpm --filter=@newportal/api dev
```

The API listens on `http://localhost:4000` by default.

## API

Base URL: `http://localhost:4000`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Service banner |
| `GET` | `/api/health` | Health check with timestamp |
| `GET` | `/api/events` | All non-hidden events, ordered by start time |

`GET /api/events` returns:

```jsonc
[
  {
    "id": "abc123",
    "name": "Intro to Git",
    "description": "…",
    "thumbnailUrl": "https://portal.acmutsa.org/api/upload/view?key=…",
    "start": 1710000000000,          // epoch ms
    "end": 1710007200000,
    "checkinStart": 1709998200000,
    "checkinEnd": 1710008200000,
    "location": "NPB 1.202",
    "semesterId": 3
  }
]
```

CORS is restricted to the portal origins and `localhost` dev ports (see
`apps/api/src/index.ts`).

## Database

Schema lives in `packages/db/schema.ts`. Tables: `users`, `data`,
`event_categories`, `events`, `events_to_categories`, `checkins`, `semesters`.

Migrations are managed with `drizzle-kit` and run from the repo root:

```bash
pnpm migrations:generate   # create a migration from schema changes
pnpm migrations:apply      # apply pending migrations to the database
pnpm migrations:drop       # drop a migration
pnpm db-push               # push schema directly (no migration file)
pnpm studio                # open Drizzle Studio
```

## Scripts

```bash
pnpm build          # build all packages (turbo)
pnpm lint           # lint all packages (turbo)
pnpm format         # format the repo with Prettier
pnpm format-check   # verify formatting (run in CI)
```

## Deployment

`apps/api` builds to plain JavaScript:

```bash
pnpm --filter=@newportal/api build   # tsc -> apps/api/dist
pnpm --filter=@newportal/api start    # node dist/index.js
```

Provide `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in the environment.
