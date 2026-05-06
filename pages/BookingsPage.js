export class BookingsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'My Bookings' });
    this.clearAllButton = page.getByRole('button', { name: 'Clear all bookings' });
    this.noBookingsHeading = page.getByRole('heading', { name: 'No bookings yet' });
    this.bookingCancelledToast = page.getByText('Booking cancelled successfully');
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

    await this.clearAllButton.click({ force: true });
    await this.noBookingsHeading.waitFor({ state: 'visible' });
  }
}