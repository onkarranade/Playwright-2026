import { test, expect } from '../../fixtures/test-base.js';
import { featuredEvent } from '../../test-data/events.js';
import { createBookingDetails } from '../../utils/booking.js';

function detailValue(container, label) {
  return container.getByText(label, { exact: true }).locator('xpath=following-sibling::*[1]');
}

test.describe('Booking flow', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ bookingsPage, page }) => {
    await bookingsPage.visit();
    await expect(page).toHaveURL(/\/bookings$/);
    await expect(bookingsPage.heading).toBeVisible();
    await bookingsPage.clearAllBookingsIfPresent();
  });

  test('@smoke @p0 user can book a featured event and clean up the booking', async ({
    page,
    eventsPage,
    eventDetailsPage,
    bookingsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await expect(page).toHaveURL(/\/events\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await eventDetailsPage.waitForBookingForm();

    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();
    await expect(page.getByText(booking.fullName)).toBeVisible();

    await eventDetailsPage.openMyBookings();
    await expect(page).toHaveURL(/\/bookings$/);
    await expect(bookingsPage.heading).toBeVisible();
    await expect(bookingsPage.bookingCard(featuredEvent.name)).toBeVisible();

    await bookingsPage.clearAllBookingsIfPresent();
    await expect(bookingsPage.noBookingsHeading).toBeVisible();
  });

  test('@p0 user can cancel a single booking from the booking details page', async ({
    page,
    eventsPage,
    eventDetailsPage,
    bookingsPage,
    bookingDetailsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await expect(page).toHaveURL(/\/events\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await eventDetailsPage.waitForBookingForm();

    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();
    await expect(page.getByText(booking.fullName)).toBeVisible();

    await eventDetailsPage.openMyBookings();
    await expect(page).toHaveURL(/\/bookings$/);
    await expect(bookingsPage.heading).toBeVisible();
    await expect(bookingsPage.bookingCard(featuredEvent.name)).toBeVisible();

    await bookingsPage.openBookingDetails(featuredEvent.name);
    await expect(page).toHaveURL(/\/bookings\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel Booking' })).toBeVisible();

    await bookingDetailsPage.cancelBooking();

  await expect(page).toHaveURL(/\/bookings$/);
  await expect(bookingsPage.heading).toBeVisible();
  await expect(bookingsPage.bookingCancelledToast).toBeVisible();
    await expect(bookingsPage.noBookingsHeading).toBeVisible();
  await expect(bookingsPage.bookingCard(featuredEvent.name)).toHaveCount(0);
  });

  test('@regression @p1 ticket quantity updates the total price', async ({
    page,
    eventsPage,
    eventDetailsPage,
  }) => {
    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await expect(page).toHaveURL(/\/events\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await eventDetailsPage.waitForBookingForm();

    await eventDetailsPage.increaseTicketQuantity();

    await expect(eventDetailsPage.ticketCount).toHaveText('2');
    await expect(page.getByText('$1,500 × 2 tickets')).toBeVisible();
    await expect(eventDetailsPage.totalRow).toContainText(featuredEvent.totalForTwoTickets);
  });

  test('@regression @p1 required booking fields block empty submission', async ({
    eventsPage,
    eventDetailsPage,
    page,
  }) => {
    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await expect(page).toHaveURL(/\/events\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await eventDetailsPage.waitForBookingForm();

    await eventDetailsPage.confirmBooking();

    await expect(page).toHaveURL(/\/events\/1$/);
    await expect(eventDetailsPage.confirmationHeading).toHaveCount(0);
    for (const input of [eventDetailsPage.fullNameInput, eventDetailsPage.emailInput, eventDetailsPage.phoneInput]) {
      await expect(input).toHaveJSProperty('required', true);
      const validity = await input.evaluate((element) => ({
        valid: element.validity.valid,
        valueMissing: element.validity.valueMissing,
      }));

      expect(validity).toEqual({ valid: false, valueMissing: true });
    }
  });

  test('@regression @p2 booking details show the event, customer, and payment summary', async ({
    page,
    eventsPage,
    eventDetailsPage,
    bookingsPage,
    bookingDetailsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await expect(page).toHaveURL(/\/events\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await eventDetailsPage.waitForBookingForm();

    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();
    await expect(page.getByText(booking.fullName)).toBeVisible();

    await eventDetailsPage.openMyBookings();
    await expect(bookingsPage.heading).toBeVisible();
    await bookingsPage.openBookingDetails(featuredEvent.name);
    await expect(page).toHaveURL(/\/bookings\/\d+$/);
    await bookingDetailsPage.waitForLoaded();
    const mainContent = page.getByRole('main');
    await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Customer Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Payment Summary' })).toBeVisible();
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await expect(mainContent.getByText(featuredEvent.category, { exact: true })).toBeVisible();
    await expect(mainContent.getByText(booking.fullName, { exact: true })).toBeVisible();
    await expect(mainContent.getByText(booking.email, { exact: true })).toBeVisible();
    await expect(mainContent.getByText(booking.phone, { exact: true })).toBeVisible();
    await expect(detailValue(mainContent, 'Tickets')).toHaveText('1');
    await expect(detailValue(mainContent, 'Price per ticket')).toHaveText(featuredEvent.price);
    await expect(detailValue(mainContent, 'Total Paid')).toHaveText(featuredEvent.price);
    await expect(detailValue(mainContent, 'Booking ID')).toContainText(/^#\d+$/);

    await bookingsPage.visit();
    await bookingsPage.clearAllBookingsIfPresent();
  });

  test('@regression @p2 ticket quantity respects minimum and maximum bounds', async ({
    page,
    eventsPage,
    eventDetailsPage,
  }) => {
    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await expect(page).toHaveURL(/\/events\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await eventDetailsPage.waitForBookingForm();

    await expect(eventDetailsPage.ticketCount).toHaveText('1');
    await expect(eventDetailsPage.decreaseTicketButton).toBeDisabled();
    await expect(eventDetailsPage.increaseTicketButton).toBeEnabled();
    await eventDetailsPage.setTicketQuantity(10);
    await expect(eventDetailsPage.ticketCount).toHaveText('10');
    await expect(eventDetailsPage.increaseTicketButton).toBeDisabled();
    await expect(eventDetailsPage.decreaseTicketButton).toBeEnabled();
    await expect(page.getByText('$1,500 × 10 tickets')).toBeVisible();
    await expect(eventDetailsPage.totalRow).toContainText(featuredEvent.totalForTenTickets);

    await eventDetailsPage.setTicketQuantity(1);
    await expect(eventDetailsPage.ticketCount).toHaveText('1');
    await expect(eventDetailsPage.decreaseTicketButton).toBeDisabled();
    await expect(eventDetailsPage.increaseTicketButton).toBeEnabled();
    await expect(page.getByText('$1,500 × 1 ticket')).toBeVisible();
    await expect(eventDetailsPage.totalRow).toContainText(featuredEvent.price);
  });
});