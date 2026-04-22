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
    if (category !== undefined) {
      await this.categoryFilter.selectOption(category);
    }

    if (city !== undefined) {
      await this.cityFilter.selectOption(city);
    }
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

  async clearFilters() {
    await this.clearFiltersButton.click();
  }

  async expectFiltersCleared() {
    await expect(this.categoryFilter).toHaveValue('');
    await expect(this.cityFilter).toHaveValue('');
    await expect(this.page).toHaveURL(/\/events$/);
    await expect(this.clearFiltersButton).toHaveCount(0);
  }

  async expectSearchAndFilterApplied(query, category) {
    await expect(this.searchInput).toHaveValue(query);
    await expect(this.categoryFilter).toHaveValue(category);
    await expect(this.page).toHaveURL(new RegExp(`search=${escapeForRegex(query)}`));
    await expect(this.page).toHaveURL(new RegExp(`category=${escapeForRegex(category)}`));
    await expect(this.clearFiltersButton).toBeVisible();
  }

  async openEvent(name) {
    await this.page.getByRole('link', { name }).click();
  }

  async searchFor(query) {
    await this.searchInput.fill(query);
    await expect(this.page).toHaveURL(new RegExp(`search=${escapeForRegex(query)}`));
  }
}