import { users } from '../test-data/users.js';

export function createBookingDetails() {
  const suffix = Date.now().toString().slice(-6);

  return {
    fullName: `Playwright Booking ${suffix}`,
    email: users.valid.email,
    phone: '+91 9876543210',
  };
}

export function secondaryBookingDetails() {

  const suffix1=Date.now().toString().slice(-6);

  return {
    fullName: `Playwright Booking ${suffix1}`,
    email: `playwright.booking.${suffix1}@example.com`,
    phone: '+91 9876543210',
  };
}

