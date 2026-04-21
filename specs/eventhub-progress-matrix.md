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
| Events | P0 | Authenticated user can open Browse Events from home and open a featured event | Passing | tests/events/events-browse.spec.js | Verified in Chromium |
| Events | P0 | Search with an unknown query shows the empty state | Passing | tests/events/events-browse.spec.js | Verified in Chromium |
| Events | P1 | Filter by category and city narrows the event list correctly | Passing | tests/events/events-browse.spec.js | Assert on selected UI state and filtered cards |
| Events | P1 | Featured event card shows price, date, and availability | Passing | tests/events/events-browse.spec.js | Uses World Tech Summit featured card |
| Booking | P0 | User can book the featured event and see it in My Bookings | Passing | tests/booking/booking-flow.spec.js | Self-cleans test data |
| Booking | P0 | User can clear bookings to reset test data | Passing | tests/booking/booking-flow.spec.js | Uses browser confirm dialog handling |
| Booking | P0 | User can cancel a single booking from booking details | Passing | tests/booking/booking-flow.spec.js | Serial due to shared booking state |
| Booking | P1 | Ticket quantity updates total price correctly | Passing | tests/booking/booking-flow.spec.js | Verified with 2-ticket total |
| Booking | P1 | Required booking fields prevent submission when incomplete | Passing | tests/booking/booking-flow.spec.js | Assert native HTML validity state |

## Next Candidates

| Priority | Candidate | Status | Notes |
| --- | --- | --- | --- |
| P1 | Admin event create flow | Planned | Needs cleanup strategy before automation |
| P1 | Admin event edit flow | Planned | Best added only after create cleanup is defined |
| P1 | Booking details content assertions | Planned | Current coverage focuses on cancel flow |

## Latest Verification

| Date | Command | Result |
| --- | --- | --- |
| 2026-04-20 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium` | 12 passed |
| 2026-04-20 | `npx playwright test tests/auth/login.spec.js tests/events/events-browse.spec.js tests/booking/booking-flow.spec.js --project=chromium --grep "@p1"` | 6 passed |