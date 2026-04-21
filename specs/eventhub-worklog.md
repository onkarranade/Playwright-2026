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
| 2026-04-20 | decision | Auth | Use Playwright setup project with persisted storage state instead of logging in inside every authenticated test. | tests/setup/auth.setup.js, playwright.config.js | pending |
| 2026-04-20 | decision | Booking | Keep booking tests serial because they mutate shared booking data for the same user account. | tests/booking/booking-flow.spec.js | pending |
| 2026-04-20 | decision | Selector strategy | Prefer role, label, and test id selectors. Use placeholder only where no better accessible hook exists. | pages/, tests/ | pending |
| 2026-04-20 | risk | Events | Filter UI reliably reflects selected category and city, but the URL may not persist both query params consistently. Prefer asserting selected values and filtered cards over category URL assertions. | pages/EventsPage.js, tests/events/events-browse.spec.js | pending |
| 2026-04-20 | bug | Booking | Empty booking submission relies on native HTML required validation and does not expose a custom inline app error message. | pages/EventDetailsPage.js, tests/booking/booking-flow.spec.js | pending |
| 2026-04-20 | todo | Admin | Add admin create or edit coverage only after deciding how to clean up created records without destabilizing shared data. | specs/eventhub-progress-matrix.md | pending |

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