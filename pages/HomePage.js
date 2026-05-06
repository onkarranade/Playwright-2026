export class HomePage {
  constructor(page) {
    this.page = page;
    this.heroSection = page.locator('main').getByText('From tech conferences to live concerts, sports events to cultural festivals');
    this.userEmail = page.getByTestId('user-email-display');
    this.browseEventsLink = page.getByRole('link', { name: 'Browse Events →' });
    this.myBookingsButton = page.getByRole('button', { name: 'My Bookings' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async visit() {
    await this.page.goto('/');
  }

  async waitForLoaded() {
    await this.heroSection.waitFor({ state: 'visible' });
    await this.browseEventsLink.waitFor({ state: 'visible' });
  }

  async openEvents() {
    await this.browseEventsLink.click();
  }

  async openBookings() {
    await this.myBookingsButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}