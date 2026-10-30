# Product Requirements Document

## 1. Document status

| Item | Value |
| --- | --- |
| Product | AICTE Security Deposit and FDR Management Portal |
| Release | Four-day functional prototype |
| Date | 29 October 2026 |
| Status | Requirements baseline; Phase 0 foundation implemented, functional workflows pending |
| Capacity assumption | One developer familiar with React/TypeScript; approximately 32 focused hours |
| Technical design | [ARCHITECTURE.md](/Users/abishekpriyanm/projects/fdr/ARCHITECTURE.md) |
| Delivery sequence | [IMPLEMENTATION_PLAN.md](/Users/abishekpriyanm/projects/fdr/IMPLEMENTATION_PLAN.md) |

This PRD defines prototype requirements, not an approved regulatory procedure. Amounts, conditions, dates and verification rules described as demo policy are synthetic operational settings. The prototype neither holds funds nor executes payments.

## 2. Problem and product objective

An institution's deposit requirement can outlive an individual FDR. Tracking documents without linking their lifecycle can lose renewal history, count renewed principal twice, conceal unresolved verification and confuse release authorization with actual completion.

The prototype must demonstrate one persistent case history connecting the requirement, original FDR, submitted evidence, review decisions, successor FDR and completed discharge. An officer should be able to identify the current evidence, unresolved issue, responsible person and next action without reconstructing them from separate documents.

### Success criteria

The release is successful when a reviewer can:

1. Submit and review a synthetic FDR using separate institution, officer and approver accounts.
2. See declared facts and explicitly simulated verification evidence separately.
3. Accept a successor without losing the original record or doubling current coverage.
4. Observe a gap when no accepted instrument covers the displayed as-of date.
5. Approve release and observe that it remains incomplete until execution evidence is confirmed.
6. Reconstruct those actions from the case timeline.
7. Demonstrate that a second institution cannot retrieve the first institution's records or files.

These are acceptance targets. No performance improvement, OCR accuracy, bank integration or production-readiness results have been measured.

## 3. Users and authorization

| Role | Allowed responsibilities | Restrictions |
| --- | --- | --- |
| Institution user | View its institution's cases; submit FDRs; respond to clarification; initiate renewal/release; provide requested execution evidence | Cannot review, accept instruments, approve release or change its own institution/role |
| Scrutinizing officer | Review assigned cases; request clarification; run verification simulation; recommend acceptance/release; confirm execution evidence | Cannot approve its own recommendations or review unassigned cases |
| Approver | Decide instrument acceptance and release authorization for cases in the seeded demo office | Cannot act as scrutinizing officer or complete execution confirmation |

Seed four accounts: Institution A, Institution B, Officer and Approver. Staff belong to one demo office; each case is assigned to the Officer and belongs to that office. Institution users have one institution membership. Auditors, configuration administrators, role editing and public registration are excluded.

## 4. Scope

### Included

- INR FDRs with manually entered facts and synthetic PDF evidence.
- Pre-seeded deposit requirements and one immutable demo policy version.
- Submission, clarification, scrutiny, recommendation and approver acceptance.
- Deterministic simulated bank responses: match, mismatch and unavailable.
- Maturity visibility and derived work queues.
- Full replacement renewal, preserving predecessor/successor links.
- Full discharge request, independent approval and execution-evidence closure.
- Persistent case timeline, private file access and revision conflict handling.
- One application with role-specific actions in shared screens.

### Excluded

OCR and LLMs; real bank/AICTE connections; payments/refunds; email/SMS delivery; background reminders; configurable policy workflows; partial release; multiple simultaneous instruments covering one requirement; split/merged coverage; multiple currencies; bulk imports; exports; public registration; admin/auditor dashboards; production deployment and regulatory certification.

The original proposal is broader. These exclusions are deliberate deadline decisions and must be visible in the demonstration's capability list.

## 5. Domain definitions

| Term | Meaning |
| --- | --- |
| Case / deposit requirement | The continuing obligation associated with an institution; primary unit of the workspace |
| Instrument | An individual FDR, including a linked predecessor when it is a renewal |
| Submission version | Immutable snapshot of declared fields and the associated PDF; correction produces another version |
| Verification attempt | Evidence of comparing one submission version against a simulated source response |
| Administrative acceptance | Approver's decision to accept an instrument under the demo policy; distinct from bank confirmation |
| Coverage allocation | Time interval and amount of an accepted instrument attributed to a requirement |
| Release request | A request for full discharge, with its own scrutiny, authorization and completion evidence |
| Case revision | Incrementing concurrency token for case changes |
| Evidence revision | Incrementing token for material changes to the financial facts, source evidence or applicable requirement |
| Current coverage | Recorded accepted allocation valid on the displayed as-of date; not a statement of independently verified bank funds |

## 6. Demonstration policy

Use the version identifier `DEMO-FDR-1`. Seed each requirement with an explicit required amount, required coverage dates and INR currency. INR 100,000 is a useful fixture, not a universal AICTE requirement.

- Submission needs bank name, FDR reference, depositor, positive amount, currency, issue date, maturity date and one PDF.
- Issue date must be on or before maturity date. Acceptance requires that the FDR is already issued and has not matured on the decision date.
- A current-version simulated match, amount at least equal to the requirement, and a documented officer recommendation are required for acceptance.
- A mismatch or unavailable response does not qualify as a match. No manual bypass is included.
- Allocation equals the requirement amount. Any larger declared principal remains visible but is not added as excess coverage.
- Dates are interpreted in Asia/Kolkata. An FDR remains within its recorded validity through its maturity date; it is matured on the following date.
- Acceptance starts coverage on the decision date, with no backdating. Coverage ends no later than the day after maturity, a successor's acceptance date or completed release date.
- The sample approaching-maturity window is 30 calendar days, inclusive of the as-of date. It is an operational demo setting.
- Release requires an accepted instrument in the case history, no open renewal, officer recommendation, approver decision, and execution evidence confirmed by the officer. Maturity is neither approval nor completion.
- Only full discharge is supported. Completed discharge closes the requirement under this demo policy; the history remains readable.

## 7. Functional requirements

All requirements below are required for the full four-day target. Interface decoration must not displace them.

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| FR-01 | Authenticate seeded users and enforce role, institution, office and assignment scope on the server | Unauthenticated requests fail; Institution B cannot read, change or download A's case evidence; roles cannot be changed through form fields |
| FR-02 | Submit manual FDR facts against an owned pre-seeded requirement | Valid PDF and fields create a persisted instrument/submission; missing or invalid fields give actionable errors; data survives restart |
| FR-03 | Preserve PDF and submission versions privately | Document replacement/correction creates a new version; older evidence remains reachable by authorized staff; unauthenticated or cross-institution file access fails |
| FR-04 | Support clarification and independent acceptance | Officer returns or recommends; institution responds with a new submission version; approver accepts, returns or rejects with a reason; old recommendation is invalid after material changes |
| FR-05 | Simulate verification with explicit provenance | Match, mismatch and unavailable fixtures persist against the exact submission version; every rendered result says `SIMULATED`; acceptance is blocked without the current-version match |
| FR-06 | Show an actionable case list and maturity view | Display institution, reference, recorded coverage, verification state, maturity, owner and next action; support reference/institution search and maturity/action filters |
| FR-07 | Preserve renewal history and accurate coverage | Only one open successor is allowed; pending/rejected successor does not replace coverage; acceptance retains both instruments and counts only the valid allocation |
| FR-08 | Separate release authorization from execution | Approval displays `Approved - awaiting execution evidence`; closure is blocked without current evidence and officer confirmation; completed release closes current coverage |
| FR-09 | Make unresolved work explicit | Every unresolved case exposes a deterministic owner and next action; simulated mismatch/unavailability, clarification, pending approval and execution have distinct actions |
| FR-10 | Record a persistent decision history | Successful mutations commit their actor, time, revision, reason and relevant before/after/evidence references alongside business changes; no audit edit/delete UI exists |
| FR-11 | Prevent stale, duplicate and conflicting transitions | Two concurrent commands using the same revision cannot both succeed; repeated acceptance/release does not duplicate allocations or completion; renewal and release cannot be open together |
| FR-12 | Provide a reproducible demo | Reset/seed produces two institutions, four users and six scenario cases; setup and known limitations are documented; the five-minute journey runs without database intervention |

### 7.1 Submission and review behavior

Institution submits a complete snapshot rather than editing accepted financial facts in place. Officer compares its PDF and declared fields side by side. The simulation runs against that snapshot; a replacement document or corrected field makes the previous verification historical evidence only.

An officer recommendation identifies the submission version, evidence revision, applicable demo policy and reason. The approver rechecks those references when deciding. A return for clarification preserves observations; resubmission needs a fresh simulation and recommendation. Rejection is terminal for that candidate, with an explicit reason. A new eligible candidate can subsequently be submitted without deleting rejected history.

### 7.2 Renewal behavior

Institution chooses the latest accepted instrument as predecessor and uploads a new candidate. The same review route applies to initial and successor acceptance. Pending renewal does not extend the predecessor's dates.

When a successor is accepted, its allocation begins on the acceptance date and any still-running predecessor allocation ends on that date. If the predecessor already matured, retain its earlier end date so the uncovered interval remains visible. A rejected or withdrawn successor leaves the predecessor's recorded allocation unchanged.

### 7.3 Release behavior

Request -> officer scrutiny -> approver authorization -> execution evidence -> officer confirmation -> completed.

Officer can return a request for clarification or recommend it. Approver can return it for review, reject it or approve it with a reason. Institution can withdraw an unapproved request. An approved request cannot be withdrawn through the prototype; a material evidence change returns it to scrutiny and invalidates its authorization.

Institution uploads synthetic bank acknowledgment/return evidence to an approved request. Officer confirms its relevance before closure. This only records evidence of the demo discharge; it does not execute or prove a real financial transaction.

Block release while renewal is open and renewal while release is open. Resolve or withdraw the pending request before switching paths.

### 7.4 Dashboard behavior

Use real database results, not hardcoded counts. Show the as-of date and distinguish requirement count from overlapping work categories. Monetary totals sum valid allocations once per requirement, separately from document/instrument counts. A closed case has no next action; an uncovered open requirement shows `No accepted coverage` or `Coverage gap`.

For the prototype, derive due actions when reading data. There is no promise that notifications or background reminders are sent. Historical monetary views must be labeled as based on recorded allocations and today's knowledge, not a reconstruction of what users knew at a past time.

## 8. Interface and visual requirements

Use the supplied [DESIGN-mobbin.md](</Users/abishekpriyanm/Downloads/DESIGN-mobbin.md>) as a visual reference, with these portal-specific adaptations:

- White `#ffffff` canvas, near-black `#141414` text/actions, soft gray `#f3f3f3` panels, `#f0f0f0` fields and `#e0e0e0` dividers.
- Black pill primary buttons, quiet secondary controls and rounded cards; no decorative marketing sections.
- Compact sidebar, role/institution context bar and five shared views: login, dashboard/list, submission, case detail and embedded release panel.
- Titles 28-32px; section headings 18-20px; body/fields 16px; table text 14px. System sans-serif baseline; Saans only if usable licensed assets are supplied.
- Tabular and right-aligned amounts, explicit INR units and unambiguous formatted dates.
- Restrained semantic treatments plus text labels for mismatch, overdue and completion; never imply actual bank confirmation with a simulated result.
- Case detail places PDF and facts/actions alongside each other on desktop and stacks them on narrow screens.
- Persistent labels, visible keyboard focus, readable instructions, actionable errors and dialogs that restore focus. Color must not be the sole state indicator.
- Every simulated result retains its label in case detail, dashboards and history. Keep a clear overall synthetic-demo banner.

## 9. Quality and operating requirements

| ID | Requirement |
| --- | --- |
| NFR-01 | Business changes, allocation effects and audit events commit atomically; invalid transitions roll back |
| NFR-02 | Store money as fixed decimal values, never floating-point calculations; preserve currency |
| NFR-03 | Records, auth sessions and private files persist across normal process restarts |
| NFR-04 | Uploads are synthetic PDFs only, maximum 10 MiB; reject malformed/encrypted files and unsafe names; never serve the private storage directory publicly |
| NFR-05 | Core demo needs no bank, email, AI or other remote API at runtime |
| NFR-06 | Support current desktop browser presentation and a usable 390px-wide layout; tables may scroll within their container |
| NFR-07 | Return clear validation/conflict/access errors without leaking private document paths, unrelated institution details or secrets |
| NFR-08 | Do not claim tamper-proof audit, ongoing bank balance assurance, malware-scanning certification or production security |

## 10. Evaluation and demonstration

Seed six cases relative to the seed date: new submission, amount mismatch, source unavailable, approaching maturity, renewal pending and release awaiting execution. Include sufficient and insufficient successor PDFs. Seed Institution B's account to exercise isolation.

The demo must show submission, review, simulated verification, acceptance, an unresolved insufficient successor, accepted sufficient renewal, an unchanged INR 100,000 covered amount, release awaiting execution, evidence-based completion and historical reconstruction. Exercise the gap scenario through an additional test fixture or controlled seeded dates. Finish by proving the cross-institution denial.

Record pass/fail results for FR-01 through FR-12. Critical automated checks cover access isolation, version invalidation, coverage intervals, self-approval prevention and concurrent transitions. Browser checks cover the full journey and document retrieval. A backup recording supplements the runnable app.

## 11. Delivery and scope changes

The four-day budget is an estimate, not proof of feasibility for an unfamiliar developer. Follow the exit gates in the implementation plan. Reduce decoration and optional filtering first. If a complete release workflow still cannot fit, identify it as deferred and present submission-to-renewal as a reduced-scope demo; it does not satisfy this PRD's full acceptance criteria.

OCR may be explored only after required checks pass and only within spare time. It does not belong to the committed prototype. Integrations, background tasks, policy management and production controls require subsequent planning and domain review.

## 12. Source basis and document ownership

- [Supplied proposal](</Users/abishekpriyanm/Downloads/AICTE_PS_26265_Solution_Proposal (2).pdf>): pages 1 and 5 define continuity and closure; pages 4 and 6 distinguish claims/evidence; pages 7 and 8 identify control and evaluation needs.
- [Supplied visual reference](</Users/abishekpriyanm/Downloads/DESIGN-mobbin.md>): design inspiration, adapted for case work.
- The user set the development window to four days.
- This PRD owns product scope and acceptance. `ARCHITECTURE.md` owns technical boundaries and invariants. `IMPLEMENTATION_PLAN.md` owns delivery order and checks. `PROTOTYPE_PLAN.md` is the earlier planning brief.
