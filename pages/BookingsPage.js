export class BookingsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'My Bookings' });
    this.clearAllButton = page.getByRole('button', { name: 'Clear all bookings' });
    this.noBookingsHeading = page.getByRole('heading', { name: 'No bookings yet' });
    this.bookingCancelledToast = page.getByText('Booking cancelled successfully');
    this.browseEventsLink = page.getByRole('button', { name: 'Browse Events' });
    this.bookingCards = page.getByTestId('booking-card');
    this.cancelDialog = page.getByRole('dialog', { name: 'Cancel this booking?' });
    this.confirmCancelButton = page.getByRole('button', { name: 'Yes, cancel it' });
  }

  async visit() {
    await this.page.goto('/bookings');
  }

  bookingCard(eventName) {
    return this.page.getByTestId('booking-card').filter({
      has: this.page.getByRole('heading', { name: eventName }),
    });
  }

  async openBookingDetails(eventName) {
    await Promise.all([
      this.page.waitForURL(/\/bookings\/\d+$/),
      this.bookingCard(eventName).getByRole('button', { name: 'View Details' }).click(),
    ]);
  }

  async cancelBooking(eventName) {
    await this.bookingCard(eventName).getByRole('button', { name: 'Cancel Booking' }).click();
    await this.cancelDialog.waitFor({ state: 'visible' });
    await this.confirmCancelButton.click();
  }

  async hasNoBookings() {
    return this.noBookingsHeading.isVisible();
  }

  async clearAllBookingsIfPresent() {
    await this.heading.waitFor({ state: 'visible' });

    if (await this.hasNoBookings()) {
      return;
    }

    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    try {
      await this.clearAllButton.click({ force: true });
      await this.page.waitForFunction(() => !document.querySelector('[data-testid="booking-card"]'), null, {
        timeout: 7_000,
      });
      await this.noBookingsHeading.waitFor({ state: 'visible' });
    } catch {
      await this.cancelAllBookingsIndividually();
    }
  }

  async browseEvents() {
    await this.browseEventsLink.click();
  }

  async cancelAllBookingsIndividually() {
    while (await this.bookingCards.count()) {
      const beforeCount = await this.bookingCards.count();
      await this.bookingCards.first().getByRole('button', { name: 'Cancel Booking' }).click();
      await this.cancelDialog.waitFor({ state: 'visible' });
      await this.confirmCancelButton.click();
      await this.page.waitForFunction(
        (count) => document.querySelectorAll('[data-testid="booking-card"]').length < count,
        beforeCount,
      );
    }

    await this.noBookingsHeading.waitFor({ state: 'visible' });
  }
}
