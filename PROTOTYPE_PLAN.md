# AICTE FDR portal: four-day prototype plan

Planning draft, 29 October 2026. No application has been implemented.

This is the earlier planning brief. The detailed delivery baseline is now [PRD.md](/Users/abishekpriyanm/projects/fdr/PRD.md), [ARCHITECTURE.md](/Users/abishekpriyanm/projects/fdr/ARCHITECTURE.md) and [IMPLEMENTATION_PLAN.md](/Users/abishekpriyanm/projects/fdr/IMPLEMENTATION_PLAN.md). Use those documents for exact requirements, state/date rules and phase budgets where this brief is less specific.

## Goal and assumptions

Build a working demonstration of one deposit case from submission through review, renewal and release. Prove that history survives renewal, the same principal is not counted twice, and approval alone does not close a release.

Assume one developer, four full working days (about 32 focused hours), existing React/TypeScript familiarity, and synthetic documents only. This is an aggressive prototype estimate, not a commitment to production readiness. If the developer is learning the stack or has only evenings available, reduce scope further.

The supplied eight-page proposal is the design input. Its references to the original problem statement and regulatory sources do not independently establish applicable AICTE rules. This prototype uses an explicitly labeled demonstration policy.

## Approach decision

| Approach | What it proves | Decision |
| --- | --- | --- |
| Clickable UI with fixtures | Navigation and presentation | Fallback if less than four full days are available; cannot demonstrate persistence or access controls |
| Small working application with synthetic cases | Persistent lifecycle, role checks, linked renewals and evidence-based closure | Recommended four-day target |
| Full proposal with OCR, bank APIs, scheduler and configurable policy | Broader operational integration | Outside this deadline; depends on data, access and domain review |

## Scope to freeze before coding

Support INR FDRs, one institution per case, one requirement per case, and at most one valid coverage allocation at any point in the prototype's recorded timeline. Multiple instruments can retain historical acceptance decisions after renewal. A renewal is a full replacement of that instrument's coverage. A release is a full discharge under the demo policy. Block partial releases, split or merged coverage and parallel renewal/release requests with a clear unsupported-case message.

Use three roles: institution user, scrutinizing officer and approver. Seed two separate institution accounts plus separate officer and approver accounts. There is no public registration, custom-role builder or user-management interface.

### Must work

1. **Submission:** institution uploads a synthetic PDF and manually enters bank, reference, depositor, amount, issue date and maturity date. The requirement is pre-seeded; no requirement editor is needed.
2. **Review:** officer sees the document alongside entered fields, requests clarification or recommends acceptance; approver accepts or returns the case. Preserve observations and reasons.
3. **Verification simulation:** deterministic adapter returns match, mismatch or unavailable from fixture data. Every response and display says `SIMULATED`; it never appears as real bank confirmation. A mismatch or unavailable result stays unresolved under the demo policy.
4. **Maturity visibility:** dashboard lists approaching maturity and overdue renewal actions, with an owner and next action. Calculate these on page load from saved dates. Show the as-of date and label the sample 30-day window as a demo setting.
5. **Renewal:** submit a successor linked to the old FDR. It remains pending until reviewed and accepted. Acceptance changes the effective coverage and retains both instruments and their evidence.
6. **Release:** request, officer recommendation, separate approver decision, then execution-evidence upload and officer confirmation. Until that final step, show `Approved - awaiting execution evidence`.
7. **History:** persist actor, time, action, reason, case revision and relevant before/after values. Display a chronological case timeline. No application endpoint edits or deletes these events; do not call this tamper-proof auditing.

### Exclude from the four-day commitment

- OCR, automatic field extraction, LLM summaries and fraud detection.
- Real bank or AICTE integration and independently verified bank facts.
- Email/SMS delivery, retry queues, background scheduler and escalation engine.
- Policy editor, regulatory compliance claims, payments and refunds.
- Auditor/admin dashboards, analytics charts, bulk imports and report generation.
- Multiple instrument types, multiple currencies and partial release.

An OCR spike is optional only after all required journeys pass. Time-box it to two hours, use one synthetic layout and retain manual entry. Report observed field correctness; do not promise an accuracy percentage. Tesseract's official documentation describes image-quality and layout limitations: [OCR quality guidance](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html).

## Architecture for this deadline

Use **Next.js + TypeScript + PostgreSQL + Prisma**, with a familiar component library and **Better Auth** for seeded email/password accounts. Keep UI and server operations in one application. This deliberately simplifies the proposal's React/FastAPI split and removes a separate worker from the prototype.

This is a recommendation based on the assumed TypeScript familiarity. If an existing working starter uses another stack, reuse it instead of spending the deadline migrating frameworks. There is currently no application in this workspace.

- Put workflow transitions and permission checks in server-side services shared by the UI operations.
- Authorize every read, mutation and document download by role and institution/case scope. Hidden buttons are insufficient; Next.js documents this explicitly for server operations: [authentication and authorization guide](https://nextjs.org/docs/app/guides/authentication).
- Use library-managed sessions; seed users with fixed server-assigned roles. Do not accept role or institution identity from a submitted form. Better Auth supports email/password and Next.js integration: [installation](https://better-auth.com/docs/installation).
- Store PDFs outside the public web directory in a private persistent local volume, with generated storage keys and authenticated download routes. Restrict size and accepted PDF format; reject malformed or encrypted inputs. Do not execute document content. Use synthetic files for this local demonstration.
- Run locally with PostgreSQL and persistent file storage. A public deployment is a separate deliverable requiring HTTPS, secrets, persistent private storage and deployment verification. Keep the local demonstration independent of external API availability.
- Use decimal money values and explicit currency. Use date-only values for instrument dates and timestamps for actions. Compare dates using one documented application timezone, Asia/Kolkata.

## Minimum data model

Keep these concepts distinct, even if some evidence is stored in structured JSON to save implementation time:

| Record | Essential contents |
| --- | --- |
| User / institution membership | Auth identity, fixed role, institution or staff scope |
| Deposit requirement | Institution, demo policy version, required amount/currency, current case revision |
| Instrument | Requirement, predecessor ID, declared fields, administrative review state |
| Document version | Instrument/request link, storage key, hash, uploader and timestamp; replacement never overwrites the original |
| Verification attempt | Instrument/document revision, simulated outcome, fixture source, compared fields and timestamp |
| Coverage allocation | Requirement, accepted instrument, amount, effective start/end dates |
| Release request | Case revision, requester, scrutiny, decision actor/reason, state and execution evidence |
| Audit event | Actor, action, case revision, timestamp, reason and evidence/change references |

Use the auth library's own account/session tables. Derive maturity and renewal work-list items from persisted cases rather than implementing a task engine.

## Rules that make the demonstration credible

- Administrative review, source verification, maturity and release have separate states. Avoid one overloaded `status` field.
- Simulated verification remains distinguishable from officer acceptance in the UI, data and timeline.
- For the demo policy, acceptance needs complete fields, valid dates, adequate amount and a simulated match against the current document revision. Explain that these are demo controls, not AICTE rules.
- A submitted successor does not replace accepted coverage. On acceptance, close the predecessor allocation at the recorded effective date and open the successor allocation in the same transaction. Do not erase a historical gap or silently backdate acceptance.
- Pending renewal evidence does not prove continuity. If the old instrument has matured and no valid accepted successor covers the as-of date, show the coverage gap. Label the monetary total as recorded accepted coverage, not independently verified available funds.
- A synthetic INR 100,000 requirement renewed into another INR 100,000 FDR counts as INR 100,000 at a covered as-of date, never INR 200,000. After completed full discharge, current coverage is zero while the history remains.
- A matured FDR never becomes released merely because its date passed.
- The officer who recommends a release cannot approve it. Enforce this on the server as well as through seeded roles.
- Freeze a release request's supporting case revision. Material changes invalidate its recommendation/approval and return it for review. An evidence upload for the execution step is recorded separately from changes to the approved financial facts.
- Protect all case transitions with a transaction and expected case revision. Concurrent renewal and release operations contend on that same revision; only one succeeds. Repeated approval or completion cannot create duplicate effects. Prisma documents transactions and revision-based concurrency control: [transaction guidance](https://docs.prisma.io/docs/orm/v7/prisma-client/queries/transactions).
- Under the simplified workflow, block renewal while release is in progress and block release while a renewal is pending. Return or withdraw the pending request before switching paths, preserving its history.
- Dashboard categories can overlap. Do not sum pending verification, approaching maturity and release counts into a supposed total number of cases.

## Screens: five shared views

1. **Login:** seeded demo accounts; clear demonstration banner.
2. **Dashboard and case list:** institution-scoped list, staff work queues, maturity filter and next action.
3. **Submission form:** reused for initial FDR and renewal; manual fields and PDF upload.
4. **Case detail:** document/fields side by side, verification result, renewal history, timeline and role-specific review actions.
5. **Release panel:** embedded in case detail; request, recommendation, approval and execution-evidence steps.

Use one shared case UI with role-dependent actions. Separate portals and elaborate chart layouts would consume time without proving more of the workflow.

## Visual direction from the supplied design reference

Reference: [DESIGN-mobbin.md](</Users/abishekpriyanm/Downloads/DESIGN-mobbin.md>). The supplied document describes Mobbin's gallery/marketing design language. Use it as the visual foundation for this portal; its marketing examples do not add product requirements or change the four-day functional scope. The adaptations below are proposed portal-specific decisions.

### Preserve

- White canvas `#ffffff`, near-black primary text/actions `#141414`, soft panels `#f3f3f3`, input fill `#f0f0f0`, and neutral dividers `#e0e0e0`.
- Black pill-shaped primary buttons, quiet secondary buttons, rounded badges and segmented filters.
- Flat surfaces, restrained borders and visible keyboard focus. Use 16-24px rounding on larger containers where space permits.
- Sentence-case labels, clear typography and an 8px spacing rhythm with 4px refinements.

### Adapt for financial case work

- **Application shell:** compact left navigation and a top bar showing institution/role context. Do not copy the floating marketing navigation, giant footer, pricing sections, testimonial cards or image marquees.
- **Typography:** page titles around 28-32px, section titles 18-20px, body/form text 16px, and table text 14px. Use tabular numerals and right alignment for amounts. Avoid the reference's 56-80px hero headings and large section gaps in work queues.
- **Font:** use a system sans-serif for the four-day baseline. Saans can be used if suitable licensed font assets are supplied; font sourcing must not become a dependency. Do not reduce line-height mechanically when substituting fonts; check actual legibility.
- **Operational states:** preserve neutral chrome, but allow restrained warning/error/success treatments for overdue work, mismatches and completed actions. Always include a readable label and, where useful, an icon; color alone must never determine meaning. Blue can indicate an informational or selected state rather than the reference's commercial promotions. A green treatment must not imply real bank confirmation for simulated evidence.
- **Readable fields:** keep permanent labels, darker supporting text for instructions and errors, and clear control boundaries. Do not reuse `#adadad` for essential information or rely on placeholders as labels.
- **Responsive case detail:** document on the left, declared facts and review actions on the right; stack these on narrow screens. Let tables scroll within their own container without hiding the case identifier or next action.
- **Decisive actions:** label buttons with the specific action, such as `Recommend release`, `Approve release` and `Record execution evidence`. Use a short confirmation dialog for a consequential transition; preserve the distinction between approval and closure in its wording.

The signature view is the case evidence workspace: a quiet monochrome shell framing the FDR document, field comparisons, linked predecessor/successor records and a chronological decision trail. This expresses the proposal's core idea without adding decorative screens.

During Day 4, visually check login, the work queue, submission, case review and release states at desktop and narrow widths, including keyboard focus, long bank/institution names, validation errors, empty results and persistent `SIMULATED` labels.

## Four-day execution schedule

| Day | Work budget | End-of-day acceptance gate |
| --- | --- | --- |
| **1: Foundation and submission** | 1h scaffold; 2h auth/scopes; 2h schema/migrations/seeds; 3h upload, manual form and case detail | Institution A submits a case; it survives restart. Institution B cannot read the case or fetch its PDF. |
| **2: Review and visibility** | 3h clarification/recommendation/acceptance; 1h simulated verification; 2h timeline and revision checks; 2h dashboard/maturity filters | Officer and approver complete review; mismatch/unavailable remain unresolved; history records each transition. |
| **3: Renewal and release** | 3h successor/coverage transition; 3h release request-to-execution workflow; 2h conflict and duplicate-action handling | Renewal preserves history without double counting. Release approval remains open until execution evidence is recorded. |
| **4: Verification and presentation** | 3h critical integration/browser checks; 2h fixes; 1h UI/error/loading cleanup; 2h seed/reset instructions, rehearsal and backup recording | The complete demo runs from reset without database edits or hidden manual steps. |

These budgets assume familiarity and limited visual polish. Keep a runnable application at every gate. If Day 1 or Day 2 slips, remove dashboard decoration and optional filters first. Do not remove access isolation, evidence-based closure or renewal history to preserve an appearance of completeness. If the core still cannot fit, demonstrate submission-to-renewal and explicitly mark release as deferred rather than presenting a non-working release flow as complete.

## Critical verification

Use integration tests against PostgreSQL for transitions, then browser-check the complete journey. Prioritize these checks over a large number of trivial component tests:

1. Institution B is denied case reads, changes and PDF downloads belonging to A, including direct requests with guessed IDs.
2. Mismatch/unavailable simulation cannot silently become accepted or real bank-confirmed evidence.
3. Pending/rejected renewal leaves predecessor history intact; accepted renewal does not double count; an uncovered date produces a gap.
4. Approval without execution evidence cannot close release; the reviewing officer cannot self-approve.
5. Material changes reject stale decisions; repeated and concurrent transitions have only one valid effect.
6. Data and document references survive restart; every completed mutation has its linked audit event.

## Seed data and five-minute demonstration

Prepare two institutions and six small synthetic cases: new submission, amount mismatch, source unavailable, approaching maturity, renewal pending and release awaiting execution. Include both clean and insufficient successor documents. All monetary values and dates are test fixtures, not regulatory requirements.

Demonstrate in this order:

1. Institution A uploads an FDR with manual fields.
2. Officer compares document and declared facts; runs the clearly labeled verification simulation.
3. Approver accepts the record; dashboard shows its next action and maturity date.
4. Institution submits an insufficient renewal; show why it remains unresolved. Accept a sufficient successor and show both instruments with an unchanged INR 100,000 coverage total.
5. Request, review and approve release. Pause on `Approved - awaiting execution evidence`, then attach synthetic acknowledgment evidence and complete it.
6. Open the timeline and show Institution B's access denial.

Use prepared cases to jump between stages when presenting, but every displayed transition must actually persist. Show the as-of date so maturity examples remain understandable.

## Completion deliverables

- Runnable application, migrations, synthetic PDFs and repeatable seeded accounts/cases.
- Setup/reset instructions with a single documented local startup path.
- Passing critical transition/access checks and a rehearsed demonstration.
- Short backup recording and an explicit implemented/simulated/deferred capability list.

Success means demonstrating a correct, persistent deposit lifecycle. OCR accuracy, live bank verification, operating-cost savings, regulatory acceptance and production security remain unproven by this prototype.

## Proposal traceability

- Pages 1 and 5: separate requirements from instruments; preserve renewals and control release closure.
- Page 3: modular backend and private evidence; simplified here into one application for the deadline.
- Pages 4 and 6: preserve provenance and independent status dimensions; bank responses are simulated here.
- Pages 7 and 8: role isolation, stale-decision protection and scenario-based evaluation.

Source: [supplied solution proposal](/Users/abishekpriyanm/Downloads/AICTE_PS_26265_Solution_Proposal%20%282%29.pdf).
