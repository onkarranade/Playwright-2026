import { expect } from '@playwright/test';

export class EventDetailsPage {
  constructor(page) {
    this.page = page;
    this.bookTicketsHeading = page.getByRole('heading', { name: 'Book Tickets' });
    this.increaseTicketButton = page.getByRole('button', { name: '+' });
    this.fullNameInput = page.getByLabel('Full Name*');
    this.emailInput = page.getByLabel('Email*');
    this.phoneInput = page.getByLabel('Phone Number*');
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

  async confirmBooking() {
    await this.confirmBookingButton.click();
  }

  async expectBookingConfirmed(customerName) {
    await expect(this.confirmationHeading).toBeVisible();
    await expect(this.page.getByText(customerName)).toBeVisible();
  }

  async openMyBookings() {
    await this.viewMyBookingsButton.click();
  }
}