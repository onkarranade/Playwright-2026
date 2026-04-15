import { test as base, expect } from '@playwright/test';
import { BookingDetailsPage } from '../pages/BookingDetailsPage.js';
import { BookingsPage } from '../pages/BookingsPage.js';
import { EventDetailsPage } from '../pages/EventDetailsPage.js';
import { EventsPage } from '../pages/EventsPage.js';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  eventsPage: async ({ page }, use) => {
    await use(new EventsPage(page));
  },
  eventDetailsPage: async ({ page }, use) => {
    await use(new EventDetailsPage(page));
  },
  bookingDetailsPage: async ({ page }, use) => {
    await use(new BookingDetailsPage(page));
  },
  bookingsPage: async ({ page }, use) => {
    await use(new BookingsPage(page));
  },
});

export { expect };