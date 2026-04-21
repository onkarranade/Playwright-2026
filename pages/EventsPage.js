import { expect } from '@playwright/test';

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class EventsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search events, venues…');
    this.categoryFilter = page.getByRole('combobox').first();
    this.cityFilter = page.getByRole('combobox').nth(1);
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear filters' });
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

  async filterBy(category, city) {
    await this.categoryFilter.selectOption(category);
    await this.cityFilter.selectOption(city);
  }

  async expectFiltersApplied(category, city) {
    await expect(this.categoryFilter).toHaveValue(category);
    await expect(this.cityFilter).toHaveValue(city);
    await expect(this.page).toHaveURL(new RegExp(`city=${escapeForRegex(city)}`));
    await expect(this.clearFiltersButton).toBeVisible();
  }

  async expectCardSummary(event) {
    const card = this.eventCard(event.name);

    await expect(card).toContainText(event.category);
    await expect(card).toContainText(event.date);
    await expect(card).toContainText(event.price);
    await expect(card).toContainText(event.availability);
  }

  async openEvent(name) {
    await this.page.getByRole('link', { name }).click();
  }

  async searchFor(query) {
    await this.searchInput.fill(query);
    await expect(this.page).toHaveURL(new RegExp(`search=${escapeForRegex(query)}`));
  }
}