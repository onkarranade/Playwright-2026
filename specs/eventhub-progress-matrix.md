# EventHub Progress Matrix

Last updated: 2026-05-05

## Status Legend

| Status | Meaning |
| --- | --- |
| Planned | Scenario is agreed but not implemented |
| Automated | Test exists but has not been verified in the latest run |
| Passing | Test exists and passed in the latest targeted verification |
| Blocked | Automation is pending due to app or environment limitation |
| Deferred | Intentionally postponed |

## Scenario Matrix

| Feature | Priority | Scenario | Status | Automated In | Notes |
| --- | --- | --- | --- | --- | --- |
| Authentication | P0 | Valid user can sign in and reach the authenticated home page | Passing | tests/auth/login.spec.js | Verified in Chromium |
| Authentication | P0 | Invalid credentials show the invalid credentials toast | Passing | tests/auth/login.spec.js | Verified in Chromium |
| Authentication | P1 | Register link routes to the registration page | Passing | tests/auth/login.spec.js | Verified in Chromium |
| Authentication | P2 | Protected routes redirect unauthenticated users to the login page | Passing | tests/auth/login.spec.js | Verified in Chromium |
| Authentication | P2 | Logout ends the session and returns the user to login | Passing | tests/auth/login.spec.js | Verified in Chromium |
| Events | P0 | Authenticated user can open Browse Events from home and open a featured event | Passing | tests/events/events-browse.spec.js | Verified in Chromium |
| Events | P0 | Search with an unknown query shows the empty state | Passing | tests/events/events-browse.spec.js | Verified in Chromium |
| Events | P1 | Filter by category and city narrows the event list correctly | Passing | tests/events/events-browse.spec.js | Assert on selected UI state and filtered cards |
| Events | P1 | Featured event card shows price, date, and availability | Passing | tests/events/events-browse.spec.js | Uses World Tech Summit featured card |
| Events | P2 | Clear filters resets the event discovery view to default results | Passing | tests/events/events-browse.spec.js | Confirms default dropdown state and returned cards |
| Events | P2 | Search and category filters work together correctly | Passing | tests/events/events-browse.spec.js | Confirms combined query state and filtered result |
| Booking | P0 | User can book the featured event and see it in My Bookings | Passing | tests/booking/booking-flow.spec.js | Self-cleans test data |
| Booking | P0 | User can clear bookings to reset test data | Passing | tests/booking/booking-flow.spec.js | Uses browser confirm dialog handling |
| Booking | P0 | User can cancel a single booking from booking details | Passing | tests/booking/booking-flow.spec.js | Serial due to shared booking state |
| Booking | P1 | Ticket quantity updates total price correctly | Passing | tests/booking/booking-flow.spec.js | Verified with 2-ticket total |
| Booking | P1 | Required booking fields prevent submission when incomplete | Passing | tests/booking/booking-flow.spec.js | Assert native HTML validity state |
| Booking | P2 | Booking details page shows event, customer, and payment summary correctly | Passing | tests/booking/booking-flow.spec.js | Uses label-based summary assertions |
| Booking | P2 | Ticket quantity respects minimum and maximum bounds | Passing | tests/booking/booking-flow.spec.js | Confirms disabled controls at 1 and 10 |
| Admin | P1 | Admin can create a custom event | Passing | tests/admin/admin-events.spec.js | Creates custom row and deletes it in the same test |
| Admin | P1 | Admin can edit a custom event title | Passing | tests/admin/admin-events.spec.js | Uses exact row matching so updated titles do not collide with originals |
| Admin | P1 | Required admin fields block empty event submission | Passing | tests/admin/admin-events.spec.js | Assert native HTML required validation on admin form |

## Next Candidates

| Priority | Candidate | Status | Notes |
| --- | --- | --- | --- |
| P1 | Admin event delete flow | Planned | Custom dialog is stable, but delete is already used as test cleanup |
| P2 | Admin cancel-edit reset flow | Planned | Good follow-up after create/edit baseline |
| P2 | Admin duplicate or invalid input handling | Planned | Depends on which server-side validations are exposed in the UI |

## Latest Verification

| Date | Command | Result |
| --- | --- | --- |
| 2026-05-05 | `npx playwright test --project=chromium` | 21 passed |
| 2026-05-05 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium` | 18 passed |
| 2026-05-05 | `npx playwright test tests/admin/admin-events.spec.js --project=chromium` | 4 passed |
| 2026-04-29 | `npx playwright test tests/admin/admin-events.spec.js --project=chromium` | 4 passed |
| 2026-04-29 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js tests/admin/admin-events.spec.js --project=chromium` | 15 passed, 2 failed, 4 did not run; admin scenarios passed, unrelated failures remain in existing Events P2 and Booking P0/P1/P2 chain |
| 2026-04-21 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium` | 18 passed |
| 2026-04-21 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium --grep "@p2"` | 7 passed |
| 2026-04-20 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium` | 12 passed |
| 2026-04-20 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium --grep "@p1"` | 6 passed |