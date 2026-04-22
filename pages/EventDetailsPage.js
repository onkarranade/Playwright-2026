import { expect } from '@playwright/test';

export class EventDetailsPage {
  constructor(page) {
    this.page = page;
    this.bookTicketsHeading = page.getByRole('heading', { name: 'Book Tickets' });
    this.decreaseTicketButton = page.getByRole('button', { name: '−' });
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

  async setTicketQuantity(quantity) {
    const currentQuantity = Number(await this.ticketCount.textContent());
    const difference = quantity - currentQuantity;

    if (difference > 0) {
      for (let count = 0; count < difference; count += 1) {
        await this.increaseTicketButton.click();
      }
      return;
    }

    for (let count = 0; count < Math.abs(difference); count += 1) {
      await this.decreaseTicketButton.click();
    }
  }

  async expectTicketSummary(quantity, total) {
    await expect(this.ticketCount).toHaveText(String(quantity));
    await expect(this.page.getByText(`$1,500 × ${quantity} ticket${quantity > 1 ? 's' : ''}`)).toBeVisible();
    await expect(this.totalRow).toContainText(total);
  }

  async expectQuantityControlsAtMin() {
    await expect(this.ticketCount).toHaveText('1');
    await expect(this.decreaseTicketButton).toBeDisabled();
    await expect(this.increaseTicketButton).toBeEnabled();
  }

  async expectQuantityControlsAtMax() {
    await expect(this.ticketCount).toHaveText('10');
    await expect(this.increaseTicketButton).toBeDisabled();
    await expect(this.decreaseTicketButton).toBeEnabled();
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