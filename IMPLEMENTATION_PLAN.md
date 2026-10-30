# Phase-by-Phase Implementation Plan

## 1. Delivery contract

Date: 29 October 2026. Target: four working days, approximately 32 focused hours, one developer already familiar with React/TypeScript. **Phase 0 is implemented; Phases 1–8 remain unstarted.** See the Phase 0 verification record for actual checks; later phases remain an execution plan.

Build the requirements in [PRD.md](/Users/abishekpriyanm/projects/fdr/PRD.md) using [ARCHITECTURE.md](/Users/abishekpriyanm/projects/fdr/ARCHITECTURE.md). Those documents own behavior and technical invariants respectively. The supplied visual reference informs styling; it does not add screens or features to the schedule.

Complete phases in order. Each phase must leave a runnable, inspectable increment and satisfy its exit gate before dependent work starts. Add critical integration checks with the behavior they protect; Day 4 consolidates and exercises them rather than starting verification from zero.

## 2. Schedule and dependencies

| Day | Phase | Budget | Deliverable |
| --- | --- | --- | --- |
| 1 | 0. Bootstrap and fixed demo policy | 1h | Runnable app and local database; baseline decisions recorded |
| 1 | 1. Schema, authentication and access | 4h | Migrated database, four seeded accounts, scoped case skeleton |
| 1 | 2. Private submission and evidence | 3h | Institution can submit and reopen an FDR/PDF |
| 2 | 3. Verification, review and audit | 6h | Independent review/acceptance with current-version evidence |
| 2 | 4. Dashboard and due actions | 2h | Real case queue with next actions and maturity flags |
| 3 | 5. Renewal and coverage continuity | 4h | Accepted successor with preserved history and accurate intervals |
| 3 | 6. Release authorization and execution | 4h | Approval remains open until confirmed execution evidence |
| 4 | 7. Integration, browser checks and fixes | 6h | Critical checks pass; full journey and responsive states reviewed |
| 4 | 8. Demo packaging and rehearsal | 2h | Repeatable setup/reset, capability list and backup recording |
| | **Total** | **32h** | Full prototype target |

The estimate is aggressive and has no independent contingency reserve. Day 4 contains necessary correction time. Adding OCR, integrations or elaborate visual polish spends that time and puts the core demonstration at risk.

Dependency chain: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8. Although dashboard presentation is logically independent of release, keep delivery sequential for one developer and a consistent running application.

## 3. Phase 0: Bootstrap and fixed demo policy

**Budget:** Day 1, hour 1. **Requirements:** foundation for all FRs.

### Tasks

- [x] Initialize the Next.js/TypeScript app and package manager lockfile; resolve compatible stable dependencies.
- [x] Configure local PostgreSQL with persistent storage and an example environment file containing placeholders, never real secrets.
- [x] Establish server-only module boundaries and the standard command/error result shapes.
- [x] Define `DEMO-FDR-1`, INR, Asia/Kolkata dates, the 30-day demo window and the 10 MiB PDF limit.
- [x] Add shared visual tokens from the reference: white/gray surfaces, black pill actions, readable type and visible focus.

**Delivered artifacts:** application manifest/lockfile, initial app shell, `compose.yaml`, `.env.example`, `src/server/policy/`, shared command contracts, database probe, base styles and local setup instructions. See [Phase 0 verification](./docs/PHASE_0_VERIFICATION.md).

**Exit gate:** app starts, database connection succeeds and the initial page clearly identifies the synthetic demo. No bank, email, AI or cloud credential is needed for the core runtime.

**Cut rule:** no logo exploration, marketing page, animated intro, custom font sourcing or new component-library evaluation.

## 4. Phase 1: Schema, authentication and access

**Budget:** Day 1, hours 2-5. **Requirements:** FR-01, FR-10, FR-11 foundation; NFR-01/02/03/07.

### Tasks

- [ ] Implement the Prisma schema for institutions, profiles, requirements, instruments/submission versions, documents, verification attempts, recommendations, allocations, release requests and audit events.
- [ ] Add migrations, relationships, decimal money fields, revision tokens, unique command IDs and query indexes.
- [ ] Configure Better Auth email/password sessions and disable public signup at the server; use a separate local-only bootstrap instance and library APIs for seeded account creation/hashing, never an exposed signup route.
- [ ] Seed Institution A, Institution B, the assigned Officer and the separate office Approver. Seed owned requirements with explicit required amounts and coverage periods.
- [ ] Implement trusted actor lookup, case-scoped queries and centralized role/assignment/office checks. Check institution scope before revealing case metadata.
- [ ] Implement the transactional command wrapper: input hash, authorized replay, expected-revision claim, rollback, business effects and audit append.
- [ ] Add an initial integration check for cross-institution denial and two conflicting case-revision updates.

**Expected artifacts:** `prisma/`, `src/server/auth/`, `src/server/access/`, `src/server/db/`, `src/server/audit/`, login and scoped case-page skeletons.

**Exit gate:** each account can log in through the real auth flow. A sees only A's cases; B cannot request A's case directly. Officer is limited to assigned cases; Approver has the seeded office scope. Mutations cannot accept client-chosen actor/role values. Conflicting writes do not both succeed.

**Cut rule:** keep one office and seeded memberships. Do not build account administration, invitations, password-reset email or public onboarding.

## 5. Phase 2: Private submission and evidence

**Budget:** Day 1, hours 6-8. **Requirements:** FR-02, FR-03; NFR-03/04/07.

### Tasks

- [ ] Build one manual form for bank, reference, depositor, amount, INR, issue date, maturity date and PDF upload against a pre-seeded requirement.
- [ ] Validate on the server; parse monetary strings into exact decimals and show specific field errors.
- [ ] Implement private generated file keys, staged writes, PDF parse/encryption/size rejection and safe authenticated streaming.
- [ ] Persist the instrument and immutable submission/document snapshot through the case transaction; clean up files if the database operation fails.
- [ ] Build case detail with declared fields and a PDF preview/download fallback; keep older versions addressable by authorized users.
- [ ] Generate small synthetic PDF fixtures and test direct file retrieval without a session and as Institution B.

**Expected artifacts:** reusable submission form, `src/server/documents/`, initial case-detail view, document route and `fixtures/`.

**Exit gate / Day 1 checkpoint:** Institution A submits, reloads and reopens an FDR and its PDF after app restart. B cannot read either. Missing/invalid/encrypted/oversized inputs fail visibly without a business record pointing at a missing file.

**Cut rule:** manual entry only; no OCR, drag/drop animation, bulk upload or multi-document classification. A standard file chooser is sufficient.

## 6. Phase 3: Verification, review and audit

**Budget:** Day 2, first 6 hours. **Requirements:** FR-04, FR-05, FR-10, FR-11; NFR-01/02.

### Tasks

- [ ] Implement fixture-based verification keyed by synthetic source/reference data. The officer triggers a check; the applicant does not choose its outcome.
- [ ] Persist match/mismatch/unavailable, compared values, submission ID, source fixture and timestamp. Always return `simulation: true` and render `SIMULATED` in every relevant component.
- [ ] Add clarification, immutable corrected resubmission, withdrawal where allowed, officer recommendation and approver acceptance/return/rejection with reasons.
- [ ] Bind recommendations to submission, verification attempt, evidence revision and demo policy. A changed document/field or new simulation invalidates dependent live decisions.
- [ ] On initial acceptance, create a requirement-sized allocation from today's application date through the applicable maturity boundary, without backdating.
- [ ] Commit transitions and audit events atomically; render the timeline with actor, reason, timestamp and linked evidence.
- [ ] Add integration cases for no match, insufficient amount, invalid dates, stale recommendation, wrong role, duplicate acceptance and rollback without a success audit event.

**Expected artifacts:** `src/server/verification/`, review commands, initial `src/server/coverage/`, audit timeline and role-specific action controls.

**Exit gate:** clean submission can be recommended by Officer and accepted by Approver. Mismatch, unavailable, insufficient amount or stale evidence blocks acceptance. A correction creates a new snapshot and requires new evidence. Refreshing/replaying an acceptance creates no second allocation.

**Cut rule:** do not add manual verification overrides, external source configuration, comparison AI or editable accepted financial fields.

## 7. Phase 4: Dashboard and due actions

**Budget:** Day 2, final 2 hours. **Requirements:** FR-06, FR-09; NFR-06.

### Tasks

- [ ] Query scoped cases with reference/institution search and a small set of maturity/next-action filters.
- [ ] Derive owner/action consistently for institution, officer and approver views; show current coverage, source state and maturity separately.
- [ ] Implement inclusive maturity dates, the demo 30-day window and required-period-aware coverage gaps through shared date/coverage helpers.
- [ ] Show the current application as-of date, requirement count and overlapping work categories without summing them into a false total.
- [ ] Style the compact shell, table and badges from the visual reference; show readable text for all semantic states.

**Expected artifacts:** `src/server/dashboard/`, case list, shared filters and summary components.

**Exit gate / Day 2 checkpoint:** work queues use saved records and display the correct owner and next action for clean, clarification, mismatch, unavailable and approaching-maturity cases. Dashboard and case-detail coverage agree.

**Cut rule:** drop charts, advanced filters and decorative summary cards before reducing workflow correctness. No email or scheduled reminders are implied by the queue.

## 8. Phase 5: Renewal and coverage continuity

**Budget:** Day 3, first 4 hours. **Requirements:** FR-07, FR-09, FR-10, FR-11.

### Tasks

- [ ] Add `Submit renewal` using the existing form and latest accepted predecessor; permit only one open successor.
- [ ] Reuse versioned evidence, simulation, scrutiny, recommendation and acceptance rather than implementing a second review engine.
- [ ] In one case transaction, shorten only an unexpired predecessor allocation and open the accepted successor allocation; preserve already-ended intervals and rejected/withdrawn candidates.
- [ ] Render predecessor/successor links, decision dates, recorded intervals and coverage-gap flags.
- [ ] Test pending/rejected/insufficient successors, same-day replacement, renewal after maturity, and concurrent competing successor acceptance.
- [ ] Verify that a future or late acceptance is never silently backdated to make continuity appear complete.

**Expected artifacts:** successor command, renewal form reuse, interval transition helpers and renewal-history section.

**Exit gate:** renewing a synthetic INR 100,000 requirement keeps current allocated coverage at INR 100,000. A pending/insufficient successor cannot extend old dates. A late accepted successor leaves the gap observable. Original evidence and decisions remain readable.

**Cut rule:** no split/merged coverage, excess-principal accounting, automatic bank renewal or retrospective acceptance editor.

## 9. Phase 6: Release authorization and execution

**Budget:** Day 3, final 4 hours. **Requirements:** FR-08, FR-09, FR-10, FR-11.

### Tasks

- [ ] Add full-discharge request, officer clarification/recommendation, approver return/rejection/approval and permitted pre-approval withdrawal.
- [ ] Bind review/authorization to the current evidence revision and accepted instrument; require a current-version simulated match under the demo policy.
- [ ] Block renewal while release is open and release while renewal is open using the shared requirement revision protocol.
- [ ] Render `Approved - awaiting execution evidence` as an explicit intermediate state.
- [ ] Allow institution execution-evidence upload, then a distinct officer confirmation command. Upload changes case revision without invalidating its own financial authorization.
- [ ] Complete release only when evidence and approval are current; end still-active coverage, close the requirement and preserve history atomically.
- [ ] Test wrong-role/self-approval, missing evidence, stale authorization, verification changes, duplicate completion and concurrent renewal/release requests.

**Expected artifacts:** `src/server/releases/`, embedded release panel, evidence reuse and completion transition checks.

**Exit gate / Day 3 checkpoint:** approval alone cannot close the request. Execution upload alone cannot close it. Officer confirmation with current approval/evidence completes exactly once. A matured instrument cannot bypass the workflow. Conflicting renewal/release requests cannot both open.

**Cut rule:** only full discharge; no payment initiation, refund accounting, partial release or configurable clearance workflow.

## 10. Phase 7: Integration, browser checks and fixes

**Budget:** Day 4, first 6 hours: approximately 3h verification, 2h correction and 1h visual/error cleanup. **Requirements:** FR-01 through FR-11; all NFRs.

### Verification matrix

| Check | Required assertion | Requirement |
| --- | --- | --- |
| Tenant/role/assignment isolation | Direct reads, mutations and file URLs deny unauthorized access | FR-01, FR-03 |
| Submission persistence | Valid data and files reopen after restart; invalid files fail cleanly | FR-02, FR-03 |
| Evidence freshness | Old simulation/recommendation cannot authorize a corrected submission | FR-04, FR-05 |
| Truthful simulation | All outcomes remain visibly simulated in detail, lists and timeline | FR-05 |
| Work ownership | Each unresolved state has the correct owner/action and consistent dates | FR-06, FR-09 |
| Coverage boundaries | Pending successors add zero; accepted renewal counts once; gap and maturity boundaries are correct | FR-07 |
| Authorization/completion separation | Approval/upload alone do not close release; reviewer cannot self-approve | FR-08 |
| Revision conflicts and command replay | Stale commands fail; identical retries do not duplicate effects | FR-11 |
| Concurrent requests | Independent connections cannot commit conflicting renewal/release work | FR-11 |
| Transactional history | Failed mutations leave no success event; successful effects have linked events | FR-10, FR-11 |

### Tasks

- [ ] Run integration tests against a dedicated PostgreSQL test database, including concurrent commands through separate connections.
- [ ] Run the real login-to-submission-to-renewal-to-release browser journey; check actual downloaded files and persisted records.
- [ ] Exercise clarification, insufficient renewal, mismatch/unavailable and missing execution-evidence paths; avoid rehearsing only the happy path.
- [ ] Review 1440px desktop and 390px narrow layouts, long identifiers/names, table overflow, keyboard focus, dialog restoration, errors, loading and empty states.
- [ ] Run the production build and type/lint checks configured for this app; fix relevant failures.
- [ ] Restart app/database services normally and confirm persistence; separately check explicit reset behavior against the designated demo/test target.
- [ ] Record verification outcomes and limitations in a short checked-in report. Do not report a check as passing if it was not run.

**Expected artifacts:** integration/browser checks, final corrections and `docs/VERIFICATION.md` with actual results.

**Exit gate:** all critical checks above pass; failures are corrected or the scope is explicitly reduced. Browser evidence supports the same claims as the automated checks. There are no unexplained double totals, missing private files or false completion states.

**Cut rule:** do not trade this gate for OCR or additional screens. A reduced-scope submission-to-renewal demonstration must explicitly list release as deferred and cannot claim full PRD completion.

## 11. Phase 8: Demo packaging and rehearsal

**Budget:** Day 4, final 2 hours. **Requirements:** FR-12.

### Tasks

- [ ] Finalize six repeatable synthetic cases: new submission, amount mismatch, source unavailable, approaching maturity, renewal pending and release awaiting execution. Use seed-relative dates and a separate gap fixture/test.
- [ ] Seed accounts using library-supported APIs. Document local-only demo credentials and prevent the reset command from operating against an unintended database.
- [ ] Write `README.md` with prerequisites, environment variables, migration/start/seed/reset instructions, demo accounts and limitations.
- [ ] Define and verify a single local startup path and explicit seed/reset commands. Script names are chosen during bootstrap; instructions must match commands actually present in the repository.
- [ ] Write `docs/DEMO.md` with the five-minute sequence and a clear implemented/simulated/deferred capability table.
- [ ] Rehearse from a reset without database edits; make a short backup recording and note where it is stored.

**Exit gate:** a fresh local setup can follow the instructions and complete the demonstration. The recording and capability list match the application. Scope and test claims are honest.

### Five-minute sequence

1. Show the synthetic-demo banner and institution-owned requirement; upload an FDR with manual fields.
2. Switch to Officer, compare PDF/facts and run the simulation; show provenance.
3. Switch to Approver and accept; show recorded allocation and next action.
4. Use the prepared renewal case: show why an insufficient candidate remains unresolved, then accept a sufficient successor through both staff roles. Display both instruments and an unchanged INR 100,000 covered amount.
5. Request/recommend/approve full discharge. Pause on awaiting execution, attach synthetic evidence, and confirm completion as Officer.
6. Inspect history and demonstrate Institution B's denied access.

Prepared cases can shorten presentation, but each displayed mutation must use the real command path and persist. Do not present seeded history as evidence that a broken interactive transition works.

## 12. Progress tracking and slip decisions

| Phase | Current state | Completion evidence to attach during implementation |
| --- | --- | --- |
| 0 | Complete | [Startup, SQL connectivity, restart and bootstrap checks](./docs/PHASE_0_VERIFICATION.md) |
| 1 | Not started | Seeded login, scope denial and revision check |
| 2 | Not started | Saved/reopened submission and private PDF |
| 3 | Not started | Review/acceptance and current-version checks |
| 4 | Not started | Real dashboard and next-action mapping |
| 5 | Not started | Accurate renewal total and preserved gap |
| 6 | Not started | Separate approval/execution and conflict checks |
| 7 | Not started | Verification report and checked journey |
| 8 | Not started | Setup/reset rehearsal and demo recording |

If Day 1 slips, remove visual extras and investigate setup/access blockers before expanding behavior. If Day 2 slips, reduce search/filter polish. If Day 3 cannot complete release correctly, formally reduce the demo to submission-to-renewal and list FR-08 as unmet. Preserve role isolation, history, truthful provenance and coverage correctness in any version.

The full target is complete only when every required PRD acceptance check passes. A partial application, attractive screenshot or recorded walkthrough alone is not completion.

## 13. Follow-on work outside the four days

After the prototype is evaluated, separately scope: OCR on a labeled sample, authorized bank/AICTE access, policy publication, durable reminders/escalation, private cloud storage, stronger database constraints, privileged-user authentication, retention/backup recovery and production deployment. These are not automatically authorized implementation phases of this plan.
