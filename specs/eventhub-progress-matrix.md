# EventHub Progress Matrix

Last updated: 2026-04-20

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

## Next Candidates

| Priority | Candidate | Status | Notes |
| --- | --- | --- | --- |
| P1 | Admin event create flow | Planned | Needs cleanup strategy before automation |
| P1 | Admin event edit flow | Planned | Best added only after create cleanup is defined |
| P1 | Admin form validation | Planned | Low-risk admin entry point once create/edit cleanup is defined |

## Latest Verification

| Date | Command | Result |
| --- | --- | --- |
| 2026-04-21 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium` | 18 passed |
| 2026-04-21 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium --grep "@p2"` | 7 passed |
| 2026-04-20 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium` | 12 passed |
| 2026-04-20 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium --grep "@p1"` | 6 passed |