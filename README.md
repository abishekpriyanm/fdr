# FDR portal

Local synthetic fixed deposit receipt prototype. **Phase 0 only:** runnable Next.js shell, persistent PostgreSQL, immutable demo settings and server/shared boundaries. Authentication, case records, uploads and workflow transitions are not implemented yet.

## Local setup

Prerequisites: Node.js 22.13+ (Node 24 recommended), npm, Docker Desktop with Compose, and available ports 3000 and 54329. Installation and the first PostgreSQL image pull need internet; the installed core runtime needs no bank, email, AI or cloud credentials.

```sh
npm ci
cp .env.example .env.local
```

Edit `.env.local`: replace both password placeholders with the same local, URL-safe password. Keep `DEMO_MODE=true`. Authentication/storage settings are reserved for later phases. The example contains placeholders, never real credentials.

Start Docker Desktop, then run the single startup command:

```sh
npm run local
```

This starts PostgreSQL, waits for readiness, checks a real SQL connection and starts the application. Open [localhost:3000](http://localhost:3000). The initial page identifies the synthetic demo and shows the live database status and application date in Asia/Kolkata.

For separate terminals:

```sh
npm run db:up
npm run db:check
npm run dev
```

`npm run db:down` stops the database without removing its named volume. Normal startup never resets data. PostgreSQL 18 mounts persistent storage at `/var/lib/postgresql`; see the [official image documentation](https://hub.docker.com/_/postgres). The database port binds only to loopback. Keep future private documents under `.data/`, never under `public/`.

If a database password changes after its volume was initialized, update the existing database role too; changing the Compose environment does not change an existing role's password. Do not delete a volume to fix credentials if it contains data you need.

## Checks

```sh
npm run check
npm run build
npm start
```

`check` runs ESLint, TypeScript and policy/date checks. `db:check` exits unsuccessfully when a real connection cannot be established. The page handles the same failure without exposing database credentials or driver details. Refresh status reruns the server-rendered connection probe.

## Foundation decisions

- Next.js App Router, React and strict TypeScript; npm lockfile records exact installed dependencies. TypeScript stays on stable 5.9 for compatibility with the selected lint tooling. See [Next.js installation](https://nextjs.org/docs/app/getting-started/installation).
- Every runtime module under `src/server/` imports `server-only`. Next.js rejects a client import of those modules. `src/shared/` contains browser-safe command contracts; linting rejects server/database imports there.
- Commands use a discriminated `CommandResult<T>` with safe errors and optional field errors. Inputs carry case/command IDs and expected revision; actor and role are never client fields. The transaction wrapper is Phase 1 work.
- `DEMO-FDR-1`: INR, Asia/Kolkata, 30 calendar days including the as-of date, maximum 10 MiB (10,485,760 bytes), simulated verification. These are demo settings, not regulatory rules. No requirement amount is invented at bootstrap.
- Date-only inputs use validated `YYYY-MM-DD`; application dates use the configured timezone. Calendar arithmetic uses date components, independent of host timezone. Maturity/coverage classifications arrive with their workflows.
- Plain CSS follows the supplied white/gray surfaces, black pill actions, system type and visible keyboard focus. No external font or UI library dependency.
- A read-only `pg` probe establishes connectivity without inventing a business schema. Prisma migrations and Better Auth belong to Phase 1.

Dependency limitation: ESLint 9.39.5 is pinned because the selected Next.js configuration's React, import and accessibility plugins do not declare ESLint 10 compatibility. npm reports its upstream deprecation notice. No peer-dependency override or legacy-peer-deps option is required.

The product, architecture and delivery documents remain the baseline: [PRD](./PRD.md), [architecture](./ARCHITECTURE.md), [implementation plan](./IMPLEMENTATION_PLAN.md).
