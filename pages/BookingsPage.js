import { expect } from '@playwright/test';

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

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async expectBookingVisible(eventName) {
    await expect(this.bookingCard(eventName)).toBeVisible();
  }

  bookingCard(eventName) {
    return this.page.getByTestId('booking-card').filter({
      has: this.page.getByRole('heading', { name: eventName }),
    });
  }

  async openBookingDetails(eventName) {
    await this.bookingCard(eventName).getByRole('button', { name: 'View Details' }).click();
  }

  async expectBookingCancelled() {
    await expect(this.page).toHaveURL(/\/bookings$/);
    await expect(this.bookingCancelledToast).toBeVisible();
  }

  async expectBookingNotVisible(eventName) {
    await expect(this.bookingCard(eventName)).toHaveCount(0);
  }

  async clearAllBookingsIfPresent() {
    await this.expectLoaded();

    if (await this.noBookingsHeading.isVisible()) {
      return;
    }

    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.clearAllButton.click({ force: true });

    await expect(this.noBookingsHeading).toBeVisible();
  }
}