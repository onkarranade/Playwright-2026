import { test, expect } from '@playwright/test';
import { users } from '../../test-data/users.js';
import { apiUrl, authHeaders, loginAsApiUser } from '../../utils/api.js';

function buildBookingPayload(eventId, quantity) {
  const suffix = Date.now().toString().slice(-6);

  return {
    eventId,
    customerName: `Playwright API User ${suffix}`,
    customerEmail: `playwright-${suffix}@example.com`,
    customerPhone: '+91-9876543210',
    quantity,
  };
}

test.describe('Booking CRUD API', () => {
  test('creates a booking, verifies lookup endpoints, and cancels it', async ({ request }) => {
    const login = await loginAsApiUser(request, users.valid);
    const headers = authHeaders(login.token);
    const eventId = 1;
    const quantity = 1;

    const eventBeforeResponse = await request.get(apiUrl(`events/${eventId}`), {
      headers,
    });

    await expect(eventBeforeResponse).toBeOK();

    const eventBefore = await eventBeforeResponse.json();
    const seatsBefore = eventBefore.data.availableSeats;

    let bookingId;
    let bookingRef;
    let cancelled = false;

    try {
      const createResponse = await request.post(apiUrl('bookings'), {
        headers,
        data: buildBookingPayload(eventId, quantity),
      });

      expect(createResponse.status()).toBe(201);

      const created = await createResponse.json();

      expect(created).toMatchObject({
        success: true,
        message: 'Booking confirmed!',
      });
      expect(created.data).toMatchObject({
        eventId,
        quantity,
        status: 'confirmed',
      });
      expect(typeof created.data.bookingRef).toBe('string');

      bookingId = created.data.id;
      bookingRef = created.data.bookingRef;

      const byIdResponse = await request.get(apiUrl(`bookings/${bookingId}`), {
        headers,
      });

      await expect(byIdResponse).toBeOK();

      const byId = await byIdResponse.json();

      expect(byId).toMatchObject({
        success: true,
        data: {
          id: bookingId,
          bookingRef,
          eventId,
        },
      });

      const byRefResponse = await request.get(apiUrl(`bookings/ref/${bookingRef}`), {
        headers,
      });

      await expect(byRefResponse).toBeOK();

      const byRef = await byRefResponse.json();

      expect(byRef).toMatchObject({
        success: true,
        data: {
          id: bookingId,
          bookingRef,
          eventId,
        },
      });

      const eventAfterBookingResponse = await request.get(apiUrl(`events/${eventId}`), {
        headers,
      });

      await expect(eventAfterBookingResponse).toBeOK();

      const eventAfterBooking = await eventAfterBookingResponse.json();

      expect(eventAfterBooking.data.availableSeats).toBe(seatsBefore - quantity);

      const cancelResponse = await request.delete(apiUrl(`bookings/${bookingId}`), {
        headers,
      });

      await expect(cancelResponse).toBeOK();

      const cancelledBody = await cancelResponse.json();

      expect(cancelledBody).toMatchObject({
        success: true,
        message: 'Booking cancelled',
      });

      cancelled = true;

      const eventAfterCancelResponse = await request.get(apiUrl(`events/${eventId}`), {
        headers,
      });

      await expect(eventAfterCancelResponse).toBeOK();

      const eventAfterCancel = await eventAfterCancelResponse.json();

      expect(eventAfterCancel.data.availableSeats).toBe(seatsBefore);
    } finally {
      if (bookingId && !cancelled) {
        await request.delete(apiUrl(`bookings/${bookingId}`), {
          headers,
        });
      }
    }
  });
});