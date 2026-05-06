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

  async waitForLoaded() {
    await this.bookingReference.waitFor({ state: 'visible' });
    await this.bookingStatus.waitFor({ state: 'visible' });
    await this.cancelBookingButton.waitFor({ state: 'visible' });
  }

  async cancelBooking() {
    await this.cancelBookingButton.click();
    await this.cancelDialog.waitFor({ state: 'visible' });
    await this.confirmCancelButton.click();
  }
}