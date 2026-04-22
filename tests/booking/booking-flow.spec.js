import { test, expect } from '../../fixtures/test-base.js';
import { featuredEvent } from '../../test-data/events.js';
import { createBookingDetails } from '../../utils/booking.js';

test.describe('Booking flow', () => {
  test.describe.configure({ mode: 'serial' });

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

  test('@regression @p1 ticket quantity updates the total price', async ({
    eventsPage,
    eventDetailsPage,
  }) => {
    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.expectLoaded(featuredEvent.name);

    await eventDetailsPage.increaseTicketQuantity();

    await eventDetailsPage.expectTicketSummary(2, featuredEvent.totalForTwoTickets);
  });

  test('@regression @p1 required booking fields block empty submission', async ({
    eventsPage,
    eventDetailsPage,
    page,
  }) => {
    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.expectLoaded(featuredEvent.name);

    await eventDetailsPage.confirmBooking();

    await expect(page).toHaveURL(/\/events\/1$/);
    await expect(eventDetailsPage.confirmationHeading).toHaveCount(0);
    await eventDetailsPage.expectRequiredFieldValidation();
  });

  test('@regression @p2 booking details show the event, customer, and payment summary', async ({
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
    await bookingsPage.openBookingDetails(featuredEvent.name);
    await bookingDetailsPage.expectLoaded(featuredEvent.name);
    await bookingDetailsPage.expectBookingSummary(booking, featuredEvent);

    await bookingsPage.visit();
    await bookingsPage.clearAllBookingsIfPresent();
  });

  test('@regression @p2 ticket quantity respects minimum and maximum bounds', async ({
    eventsPage,
    eventDetailsPage,
  }) => {
    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.expectLoaded(featuredEvent.name);

    await eventDetailsPage.expectQuantityControlsAtMin();
    await eventDetailsPage.setTicketQuantity(10);
    await eventDetailsPage.expectQuantityControlsAtMax();
    await eventDetailsPage.expectTicketSummary(10, featuredEvent.totalForTenTickets);

    await eventDetailsPage.setTicketQuantity(1);
    await eventDetailsPage.expectQuantityControlsAtMin();
    await eventDetailsPage.expectTicketSummary(1, featuredEvent.price);
  });
});