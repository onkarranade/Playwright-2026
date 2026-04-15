import { expect } from '@playwright/test';

export class BookingDetailsPage {
  constructor(page) {
    this.page = page;
    this.cancelBookingButton = page.getByRole('button', { name: 'Cancel Booking' });
    this.cancelDialog = page.getByRole('dialog', { name: 'Cancel this booking?' });
    this.confirmCancelButton = page.getByRole('button', { name: 'Yes, cancel it' });
  }

  async expectLoaded(eventName) {
    await expect(this.page).toHaveURL(/\/bookings\/\d+$/);
    await expect(this.page.getByRole('heading', { name: eventName })).toBeVisible();
    await expect(this.cancelBookingButton).toBeVisible();
  }

  async cancelBooking() {
    await this.cancelBookingButton.click();
    await expect(this.cancelDialog).toBeVisible();
    await this.confirmCancelButton.click();
  }
}