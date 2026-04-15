import { users } from '../test-data/users.js';

export function createBookingDetails() {
  const suffix = Date.now().toString().slice(-6);

  return {
    fullName: `Playwright Booking ${suffix}`,
    email: users.valid.email,
    phone: '+91 9876543210',
  };
}