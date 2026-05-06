# EventHub Worklog

Use this file as the solo-SDET running record for decisions, risks, bugs, flaky behavior, and next actions.

## Entry Format

| Date | Type | Area | Note | Tests/Files | Commit |
| --- | --- | --- | --- | --- | --- |

Type values:

- decision
- risk
- bug
- flaky
- todo

## Entries

| Date | Type | Area | Note | Tests/Files | Commit |
| --- | --- | --- | --- | --- | --- |
| 2026-04-20 | decision | Auth | Use Playwright setup project with persisted storage state instead of logging in inside every authenticated test. | tests/setup/auth.setup.js, playwright.config.js | d8b9ad1 - add framework and cancel-booking flow |
| 2026-04-20 | decision | Booking | Keep booking tests serial because they mutate shared booking data for the same user account. | tests/booking/booking-flow.spec.js | d8b9ad1 - add framework and cancel-booking flow |
| 2026-04-20 | decision | Selector strategy | Prefer role, label, and test id selectors. Use placeholder only where no better accessible hook exists. | pages/, tests/ | d8b9ad1 - add framework and cancel-booking flow |
| 2026-04-20 | risk | Events | Filter UI reliably reflects selected category and city, but the URL may not persist both query params consistently. Prefer asserting selected values and filtered cards over category URL assertions. | pages/EventsPage.js, tests/events/events-browse.spec.js | 00250fb - add P1 coverage and tracking docs |
| 2026-04-20 | bug | Booking | Empty booking submission relies on native HTML required validation and does not expose a custom inline app error message. | pages/EventDetailsPage.js, tests/booking/booking-flow.spec.js | 00250fb - add P1 coverage and tracking docs |
| 2026-04-21 | decision | Auth | Cover route guards with empty storage state instead of creating a separate unauthenticated fixture layer. | tests/auth/login.spec.js | c878836 - add P2 auth, events, booking coverage |
| 2026-04-21 | decision | Booking | Use label-based assertions on booking details because shared values such as price and email appear in more than one part of the page. | pages/BookingDetailsPage.js, tests/booking/booking-flow.spec.js | c878836 - add P2 auth, events, booking coverage |
| 2026-04-21 | decision | Booking | Verify ticket boundaries through disabled states at 1 and 10 instead of over-click assertions. | pages/EventDetailsPage.js, tests/booking/booking-flow.spec.js | c878836 - add P2 auth, events, booking coverage |
| 2026-04-21 | decision | Events | Cover clear-filters reset and search-plus-filter behavior as discovery flow checks instead of multiplying similar filter permutations. | pages/EventsPage.js, tests/events/events-browse.spec.js | c878836 - add P2 auth, events, booking coverage |
| 2026-04-20 | todo | Admin | Add admin create or edit coverage only after deciding how to clean up created records without destabilizing shared data. | specs/eventhub-progress-matrix.md | 00250fb - add P1 coverage and tracking docs |
| 2026-04-29 | decision | Admin | Cover admin P1 with self-cleaning custom-event tests so create and edit can run without leaving shared data behind. | pages/AdminEventsPage.js, tests/admin/admin-events.spec.js | pending |
| 2026-04-29 | decision | Admin | Match admin table rows by exact cell text because updated titles can contain the original title as a substring. | pages/AdminEventsPage.js | pending |
| 2026-04-29 | bug | Regression check | Broader Chromium run still shows unrelated failures in combined event search-plus-filter coverage and booking-details navigation; admin targeted run is green. | tests/events/events-browse.spec.js, tests/booking/booking-flow.spec.js | pending |
| 2026-05-05 | decision | Framework | Standardized on thin POM: page objects now expose locators/actions/waits only, while assertions live in test specs. | pages/, tests/ | pending |
| 2026-05-05 | decision | Execution strategy | Keep stateful suites serial at file level and run core user journeys before admin for stable local and CI runs. | tests/events/events-browse.spec.js, tests/booking/booking-flow.spec.js, tests/admin/admin-events.spec.js | pending |
| 2026-05-05 | decision | Regression health | Full Chromium regression is currently green after synchronization and thin-POM refactors. | tests/auth/login.spec.js, tests/events/events-browse.spec.js, tests/booking/booking-flow.spec.js, tests/admin/admin-events.spec.js | pending |

## Commit Linking Convention

After a related commit is created, replace `pending` with the short SHA and optional message fragment.

Examples:

- `a1b2c3d - add P1 event filters`
- `f4e5d6c - stabilize booking selectors`

Recommended rule:

- One worklog entry can map to one commit or a small commit group.
- If one commit covers multiple entries, repeat the same short SHA in each relevant row.
- If a row is still open after a commit, keep the commit reference and update the note instead of creating duplicate rows.

## Commit Message Convention

Use short area-first commit messages so the worklog and git history line up quickly.

Recommended format:

`<area>: <change>`

Examples:

- `auth: add register route coverage`
- `events: add P1 filter and card assertions`
- `booking: add required field validation coverage`
- `booking: stabilize total summary selectors`

Suggested areas:

- `auth`
- `events`
- `booking`
- `framework`
- `docs`