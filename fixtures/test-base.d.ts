import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from '@playwright/test';
import { expect as baseExpect } from '@playwright/test';
import type { AdminEventsPage } from '../pages/AdminEventsPage.js';
import type { BookingDetailsPage } from '../pages/BookingDetailsPage.js';
import type { BookingsPage } from '../pages/BookingsPage.js';
import type { EventDetailsPage } from '../pages/EventDetailsPage.js';
import type { EventsPage } from '../pages/EventsPage.js';
import type { HomePage } from '../pages/HomePage.js';
import type { LoginPage } from '../pages/LoginPage.js';

type TestFixtures = {
  adminEventsPage: AdminEventsPage;
  loginPage: LoginPage;
  homePage: HomePage;
  eventsPage: EventsPage;
  eventDetailsPage: EventDetailsPage;
  bookingDetailsPage: BookingDetailsPage;
  bookingsPage: BookingsPage;
};

type AllTestFixtures = PlaywrightTestArgs & PlaywrightTestOptions & TestFixtures;
type AllWorkerFixtures = PlaywrightWorkerArgs & PlaywrightWorkerOptions;

export const test: TestType<AllTestFixtures, AllWorkerFixtures>;
export const expect: typeof baseExpect;
