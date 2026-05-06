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

  async fillBookingForm(details) {
    await this.fullNameInput.fill(details.fullName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
  }

  async waitForBookingForm() {
    await this.bookTicketsHeading.waitFor({ state: 'visible' });
    await this.confirmBookingButton.waitFor({ state: 'visible' });
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

  async confirmBooking() {
    await this.confirmBookingButton.click();
  }

  async openMyBookings() {
    await this.viewMyBookingsButton.click();
  }
}