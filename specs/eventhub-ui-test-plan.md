# EventHub UI Automation Plan

## 1. Automatable UI Flows

| Flow | Why automate it | Notes |
| --- | --- | --- |
| Login | Entry point for every authenticated journey | Stable labels, deterministic success state via user email test id |
| Home to Events navigation | Confirms logged-in landing and core CTA routing | High-value smoke path |
| Event browsing and search | Core discovery workflow | Search debounces and exposes a stable empty state |
| Event details and booking | Highest business-value user journey | Use featured event for repeatable booking coverage |
| My Bookings and cleanup | Needed to validate booking result and keep data clean | Clear-all flow has a browser confirm dialog |

## 2. Prioritized Test Scenarios

### Authentication

| Priority | Scenario |
| --- | --- |
| P0 | Valid user can sign in and reach the authenticated home page |
| P0 | Invalid credentials show the "Invalid email or password" toast |
| P1 | Register link routes to the registration page |

### Events

| Priority | Scenario |
| --- | --- |
| P0 | Authenticated user can open Browse Events from home and open a featured event |
| P0 | Search with an unknown query shows the empty state |
| P1 | Filter by category and city narrows the event list correctly |
| P1 | Featured event card shows price, date, and availability |

### Booking

| Priority | Scenario |
| --- | --- |
| P0 | User can book the featured event and see it in My Bookings |
| P0 | User can clear bookings to reset test data |
| P1 | Ticket quantity updates total price correctly |
| P1 | Required booking fields prevent submission when incomplete |

## 3. Framework Design

- Keep page objects only for reusable screens: Login, Home, Events, Event Details, Bookings.
- Use one shared fixture file to inject page objects into tests.
- Use a setup project to create authenticated storage state instead of logging in inside every test.
- Keep test data in plain JavaScript modules so a solo developer can update values quickly.
- Keep helpers narrow: one auth helper, one booking-data helper.

## 4. Folder Structure

| Path | Purpose |
| --- | --- |
| /tests/setup | Authentication bootstrap that generates storage state |
| /tests/auth | Login-only coverage, intentionally unauthenticated |
| /tests/events | Authenticated browsing and search scenarios |
| /tests/booking | Booking and bookings management scenarios |
| /pages | Reusable page objects for stable screens |
| /fixtures | Custom base test that exposes page objects |
| /utils | Small shared helpers such as login and booking data generation |
| /test-data | Credentials, featured event names, and other test constants |
| playwright.config.js | Base URL, reporters, auth dependency project, browser defaults |

## 5. Page Object Examples

### LoginPage

```js
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async signIn(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

### EventsPage

```js
export class EventsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search events, venues…');
    this.noEventsHeading = page.getByRole('heading', { name: 'No events found' });
  }

  eventCard(name) {
    return this.page.locator('article').filter({
      has: this.page.getByRole('heading', { name }),
    });
  }

  async openEvent(name) {
    await this.page.getByRole('link', { name }).click();
  }
}
```

## 6. Selector Strategy

- Prefer getByRole for headings, links, and buttons.
- Prefer getByLabel for form fields.
- Use getByTestId when the app already provides a durable hook, such as the signed-in email.
- Use placeholder-based selectors only when the control has no accessible label, like the events search box.
- Avoid nth-child, CSS chains, and styling-based selectors.

## 7. Execution Strategy

```bash
npm test
npm run test:smoke
npm run test:regression
npm run test:headed
npm run auth:init
```

- Use `@smoke` for the fastest confidence checks.
- Use `@regression` for the broader local run.
- Parallel execution is enabled at the file level; keep data-mutating scenarios isolated and self-cleaning.

## 8. Implemented P1 Coverage

- Authentication: register link navigation is covered in `tests/auth/login.spec.js`.
- Events: filter narrowing and featured-card metadata are covered in `tests/events/events-browse.spec.js`.
- Booking: two-ticket total recalculation and empty-form blocking are covered in `tests/booking/booking-flow.spec.js`.