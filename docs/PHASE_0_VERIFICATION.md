# Phase 0 verification

Verified locally on 29 October 2026. Scope: bootstrap and fixed demo policy only.

## Delivered

- Next.js 16.4.3 / React 19.3.1 / TypeScript 5.9.3, npm lockfile and reproducible commands.
- PostgreSQL 18 in Docker Compose, loopback port 54329 and a named persistent volume at `/var/lib/postgresql`.
- Placeholder-only `.env.example`; ignored `.env.local` generated with local random credentials. No credentials are included in this record.
- Server-only environment/database/policy modules; browser-safe command/result contracts with field errors and a standard stale-case message.
- Frozen `DEMO-FDR-1` settings: INR, Asia/Kolkata, 30-day inclusive demo window, 10 MiB PDF limit and `SIMULATED` source mode.
- Monochrome responsive shell, explicit synthetic-demo notices, policy details, live database status and a working Refresh status control.

## Actual checks

| Check | Result |
| --- | --- |
| `npm ci --no-fund --no-audit` | Passed from the final lockfile without peer overrides |
| `npm run check` | Passed: ESLint, strict TypeScript and four policy/date tests |
| `npm run build` | Passed; home is rendered per request and icon is generated as a static route |
| `npm start` | Started the production build on loopback port 3000 |
| `npm run db:check` | Passed with an actual SQL query against local PostgreSQL |
| Stopped database | CLI returned exit code 1 with a safe message; browser Refresh status showed Database unavailable |
| Restarted database | CLI passed again; browser Refresh status showed Database connected |
| Persistent cluster | PostgreSQL `pg_control_system()` identifier matched before and after normal stop/start |
| Server module marker | Import outside the server runtime was rejected by `server-only`; all four server modules include the marker |
| Desktop, 1440 × 1000 | Reviewed rendered shell, labels, spacing and policy details |
| Mobile, 390 × 844 | Reviewed full page; document width measured 390px, matching the viewport without horizontal overflow |
| Keyboard | First Tab focused the visible Skip to content link with a solid outline; Enter navigated to `#main-content` |
| Production browser console | Zero errors and zero warnings in a fresh session |

The four automated tests cover India's midnight boundary relative to UTC, invalid calendar dates, leap/month/year arithmetic and runtime policy immutability. They do not test later acceptance, maturity classification or coverage workflows.

Local screenshots are stored in ignored `output/playwright/phase0-desktop.png` and `output/playwright/phase0-mobile.png`. The development browser initially requested a missing favicon; the final SVG app icon was added before the clean production check.

## Limits and next work

No business tables, migrations, seeded accounts, authentication, private document handling or lifecycle transitions exist yet. Cluster persistence is verified; persistence of case records awaits Phase 1/2. Constants declare the PDF/window limits; upload enforcement and maturity classification belong to their later phases. The command types define the contract; the transactional wrapper and authorization remain Phase 1 work.

ESLint 9.39.5 emits an upstream deprecation notice at installation. It is deliberately pinned because the chosen Next.js configuration's bundled import, React and accessibility plugins do not declare ESLint 10 compatibility. The final dependency tree installs without forcing peers. TypeScript 5.9.3 is retained for the selected tooling's compatibility.

No public deployment, cloud service, bank connection or regulatory validation was attempted. This directory was not a Git repository at implementation time, so no commit was created.
