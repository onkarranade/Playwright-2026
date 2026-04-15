import { test, expect } from '../../fixtures/test-base.js';
import { featuredEvent } from '../../test-data/events.js';
import { createBookingDetails } from '../../utils/booking.js';

test.describe('Booking flow', () => {
  test.beforeEach(async ({ bookingsPage }) => {
    await bookingsPage.visit();
    await bookingsPage.clearAllBookingsIfPresent();
  });

  test('@smoke @p0 user can book a featured event and clean up the booking', async ({
    eventsPage,
    eventDetailsPage,
    bookingsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.expectLoaded(featuredEvent.name);

    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await eventDetailsPage.expectBookingConfirmed(booking.fullName);

    await eventDetailsPage.openMyBookings();
    await bookingsPage.expectLoaded();
    await bookingsPage.expectBookingVisible(featuredEvent.name);

    await bookingsPage.clearAllBookingsIfPresent();
    await expect(bookingsPage.noBookingsHeading).toBeVisible();
  });

  test('@p0 user can cancel a single booking from the booking details page', async ({
    eventsPage,
    eventDetailsPage,
    bookingsPage,
    bookingDetailsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.expectLoaded(featuredEvent.name);

    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await eventDetailsPage.expectBookingConfirmed(booking.fullName);

    await eventDetailsPage.openMyBookings();
    await bookingsPage.expectLoaded();
    await bookingsPage.expectBookingVisible(featuredEvent.name);

    await bookingsPage.openBookingDetails(featuredEvent.name);
    await bookingDetailsPage.expectLoaded(featuredEvent.name);

    await bookingDetailsPage.cancelBooking();

    await bookingsPage.expectLoaded();
    await bookingsPage.expectBookingCancelled();
    await expect(bookingsPage.noBookingsHeading).toBeVisible();
    await bookingsPage.expectBookingNotVisible(featuredEvent.name);
  });
});