import { test, expect } from '../../fixtures/test-base.js';
import { featuredEvent } from '../../test-data/events.js';
import { createBookingDetails } from '../../utils/booking.js';

test.describe('Admin bookings', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ bookingsPage, page }) => {
    await bookingsPage.visit();
    await expect(page).toHaveURL(/\/bookings$/);
    await bookingsPage.clearAllBookingsIfPresent();
  });

  test('@regression @p1 admin can view booking details from Manage Bookings', async ({
    page,
    eventsPage,
    eventDetailsPage,
    // @ts-ignore
    adminBookingsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.waitForBookingForm();
    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();

    await adminBookingsPage.visit();
    await adminBookingsPage.waitForLoaded();
    await expect(adminBookingsPage.bookingRow(booking.fullName)).toBeVisible();

    await adminBookingsPage.viewBooking(booking.fullName);
    const dialog = adminBookingsPage.bookingDetailsDialog();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(featuredEvent.name, { exact: true })).toBeVisible();
    await expect(dialog.getByText(booking.fullName, { exact: true })).toBeVisible();
    await expect(dialog.getByText(booking.email, { exact: true })).toBeVisible();
    await expect(dialog.getByText(booking.phone, { exact: true })).toBeVisible();

    await adminBookingsPage.closeBookingDetails();
    await expect(dialog).toHaveCount(0);
  });

  test('@regression @p1 admin can cancel a booking from Manage Bookings', async ({
    page,
    eventsPage,
    eventDetailsPage,
    // @ts-ignore
    adminBookingsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.waitForBookingForm();
    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();

    await adminBookingsPage.visit();
    await adminBookingsPage.waitForLoaded();
    await expect(adminBookingsPage.bookingRow(booking.fullName)).toBeVisible();

    await adminBookingsPage.cancelBooking(booking.fullName);

    await expect(adminBookingsPage.bookingRow(booking.fullName)).toHaveCount(0);
  });

  test('@regression @p2 confirmed status filter shows matching rows', async ({
    eventsPage,
    eventDetailsPage,
    // @ts-ignore
    adminBookingsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.waitForBookingForm();
    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();

    await adminBookingsPage.visit();
    await adminBookingsPage.waitForLoaded();
    await adminBookingsPage.filterByStatus('confirmed');

    const row = adminBookingsPage.bookingRow(booking.fullName);
    await expect(row).toBeVisible();
    await expect(row).toContainText('confirmed');
    await expect(row.getByRole('button', { name: 'View' })).toBeVisible();
    await expect(row.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
  });

  test('@regression @p2 cancelled status filter shows empty state when no rows remain', async ({
    eventsPage,
    eventDetailsPage,
    // @ts-ignore
    adminBookingsPage,
  }) => {
    const booking = createBookingDetails();

    await eventsPage.visit();
    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.waitForBookingForm();
    await eventDetailsPage.fillBookingForm(booking);
    await eventDetailsPage.confirmBooking();
    await expect(eventDetailsPage.confirmationHeading).toBeVisible();

    await adminBookingsPage.visit();
    await adminBookingsPage.waitForLoaded();
    await adminBookingsPage.cancelBooking(booking.fullName);

    await adminBookingsPage.filterByStatus('cancelled');

    await expect(adminBookingsPage.statusFilter).toHaveValue('cancelled');
    await expect(adminBookingsPage.noBookingsHeading).toBeVisible();
    await expect(adminBookingsPage.bookingRow(booking.fullName)).toHaveCount(0);
  });
 
});
