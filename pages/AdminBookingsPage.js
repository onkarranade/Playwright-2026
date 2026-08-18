export class AdminBookingsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Manage Bookings' });
    this.statusFilter = page.getByRole('combobox');
    this.noBookingsHeading = page.getByRole('heading', { name: 'No bookings found' });
    this.cancelDialog = page.getByRole('dialog', { name: 'Cancel this booking?' });
    this.confirmCancelButton = page.getByTestId('confirm-dialog-yes');
    this.cancelledToast = page.getByText('Booking cancelled', { exact: true });
  }

  async visit() {
    await this.page.goto('/admin/bookings');
  }

  async waitForLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }

  bookingRow(identifier) {
    return this.page.getByRole('row').filter({ has: this.page.getByText(identifier, { exact: true }) });
  }

  bookingDetailsDialog() {
    return this.page.getByRole('dialog', { name: /^Booking — /});
  }

  async viewBooking(identifier) {
    await this.bookingRow(identifier).getByRole('button', { name: 'View' }).click();
  }

  async closeBookingDetails() {
    await this.bookingDetailsDialog().getByRole('button', { name: 'Close' }).click();
  }

  async cancelBooking(identifier) {
    await this.bookingRow(identifier).getByRole('button', { name: 'Cancel', exact: true }).click();
    await this.cancelDialog.waitFor({ state: 'visible' });
    await Promise.all([
      this.cancelledToast.waitFor({ state: 'visible' }),
      this.confirmCancelButton.click(),
    ]);
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
  }
}
