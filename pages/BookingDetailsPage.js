import { expect } from '@playwright/test';

export class BookingDetailsPage {
  constructor(page) {
    this.page = page;
    this.bookingReference = page.locator('main').getByText(/^W-[A-Z0-9]+$/).first();
    this.bookingStatus = page.locator('main').getByText('confirmed').first();
    this.cancelBookingButton = page.getByRole('button', { name: 'Cancel Booking' });
    this.cancelDialog = page.getByRole('dialog', { name: 'Cancel this booking?' });
    this.confirmCancelButton = page.getByRole('button', { name: 'Yes, cancel it' });
  }

  detailValue(container, label) {
    return container.getByText(label, { exact: true }).locator('xpath=following-sibling::*[1]');
  }

  async expectLoaded(eventName) {
    await expect(this.page).toHaveURL(/\/bookings\/\d+$/);
    await expect(this.bookingReference).toBeVisible();
    await expect(this.bookingStatus).toBeVisible();
    await expect(this.page.getByRole('heading', { name: eventName })).toBeVisible();
    await expect(this.cancelBookingButton).toBeVisible();
  }

  async expectBookingSummary(details, event) {
    const mainContent = this.page.getByRole('main');

    await expect(this.page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Customer Details' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Payment Summary' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: event.name })).toBeVisible();
    await expect(mainContent.getByText(event.category, { exact: true })).toBeVisible();
    await expect(mainContent.getByText(details.fullName, { exact: true })).toBeVisible();
    await expect(mainContent.getByText(details.email, { exact: true })).toBeVisible();
    await expect(mainContent.getByText(details.phone, { exact: true })).toBeVisible();
    await expect(this.detailValue(mainContent, 'Tickets')).toHaveText('1');
    await expect(this.detailValue(mainContent, 'Price per ticket')).toHaveText(event.price);
    await expect(this.detailValue(mainContent, 'Total Paid')).toHaveText(event.price);
    await expect(this.detailValue(mainContent, 'Booking ID')).toContainText(/^#\d+$/);
  }

  async cancelBooking() {
    await this.cancelBookingButton.click();
    await expect(this.cancelDialog).toBeVisible();
    await this.confirmCancelButton.click();
  }
}