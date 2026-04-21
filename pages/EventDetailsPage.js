import { expect } from '@playwright/test';

export class EventDetailsPage {
  constructor(page) {
    this.page = page;
    this.bookTicketsHeading = page.getByRole('heading', { name: 'Book Tickets' });
    this.increaseTicketButton = page.getByRole('button', { name: '+' });
    this.ticketCount = page.locator('div').filter({ has: page.getByText('Tickets') }).getByText(/^\d+$/);
    this.fullNameInput = page.getByLabel('Full Name*');
    this.emailInput = page.getByLabel('Email*');
    this.phoneInput = page.getByLabel('Phone Number*');
    this.totalRow = page.getByText('Total').locator('xpath=..');
    this.confirmBookingButton = page.getByRole('button', { name: 'Confirm Booking' });
    this.confirmationHeading = page.getByRole('heading', { name: 'Booking Confirmed! 🎉' });
    this.viewMyBookingsButton = page.getByRole('button', { name: 'View My Bookings' });
  }

  async expectLoaded(eventName) {
    await expect(this.page.getByRole('heading', { name: eventName })).toBeVisible();
    await expect(this.bookTicketsHeading).toBeVisible();
  }

  async fillBookingForm(details) {
    await this.fullNameInput.fill(details.fullName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
  }

  async increaseTicketQuantity() {
    await this.increaseTicketButton.click();
  }

  async expectTicketSummary(quantity, total) {
    await expect(this.ticketCount).toHaveText(String(quantity));
    await expect(this.page.getByText(`$1,500 × ${quantity} ticket${quantity > 1 ? 's' : ''}`)).toBeVisible();
    await expect(this.totalRow).toContainText(total);
  }

  async confirmBooking() {
    await this.confirmBookingButton.click();
  }

  async expectRequiredFieldValidation() {
    for (const input of [this.fullNameInput, this.emailInput, this.phoneInput]) {
      await expect(input).toHaveJSProperty('required', true);
      const validity = await input.evaluate((element) => ({
        valid: element.validity.valid,
        valueMissing: element.validity.valueMissing,
      }));

      expect(validity).toEqual({ valid: false, valueMissing: true });
    }
  }

  async expectBookingConfirmed(customerName) {
    await expect(this.confirmationHeading).toBeVisible();
    await expect(this.page.getByText(customerName)).toBeVisible();
  }

  async openMyBookings() {
    await this.viewMyBookingsButton.click();
  }
}