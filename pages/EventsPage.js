function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class EventsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search events, venues…');
    this.categoryFilter = page.getByRole('combobox').first();
    this.cityFilter = page.getByRole('combobox').nth(1);
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear filters' });
    this.noEventsHeading = page.getByRole('heading', { name: 'No events found' });
    this.noEventsDescription = page.getByText("Try adjusting your filters or search terms to find what you're looking for.");
    this.upComingEventsHeading= page.getByRole('heading', { name: /Upcoming Events/i });
    this.eventList=page.locator('#event-card');
    this.addnewEventButton=page.getByRole('button', { name: 'Add New Event' })

  }

  async visit() {
    await this.page.goto('/events');
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

  async clearFilters() {
    await this.clearFiltersButton.click();
  }

  async openEvent(name) {
    await Promise.all([
      this.page.waitForURL(/\/events\/\d+$/),
      this.page.getByRole('link', { name }).click(),
    ]);
  }

  async searchFor(query) {
    await this.searchInput.fill(query);
  }

  async waitForSearchQuery(query) {
    await this.page.waitForURL(new RegExp(`search=${escapeForRegex(query)}`));
  }

  async waitForCityFilter(city) {
    await this.page.waitForURL(new RegExp(`city=${escapeForRegex(city)}`));
  }

  async waitForSearchAndCategory(query, category) {
    await this.page.waitForURL(new RegExp(`search=${escapeForRegex(query)}`));
    await this.clearFiltersButton.waitFor({ state: 'visible' });
  }

  async waitForEventCard(name) {
    await this.eventCard(name).waitFor({ state: 'visible' });
  }

  async openAddNewEventForm()
  {
    await this.addnewEventButton.click();
    //await this.page.waitForURL(/\/events\/new$/);
  }
}