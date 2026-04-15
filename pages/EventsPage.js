import { expect } from '@playwright/test';

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class EventsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search events, venues…');
    this.noEventsHeading = page.getByRole('heading', { name: 'No events found' });
    this.noEventsDescription = page.getByText("Try adjusting your filters or search terms to find what you're looking for.");
  }

  async visit() {
    await this.page.goto('/events');
  }

  async expectLoaded() {
    await expect(this.searchInput).toBeVisible();
  }

  eventCard(name) {
    return this.page.locator('article').filter({
      has: this.page.getByRole('heading', { name }),
    });
  }

  async openEvent(name) {
    await this.page.getByRole('link', { name }).click();
  }

  async searchFor(query) {
    await this.searchInput.fill(query);
    await expect(this.page).toHaveURL(new RegExp(`search=${escapeForRegex(query)}`));
  }
}