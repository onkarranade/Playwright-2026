import { test, expect } from '../../fixtures/test-base.js';
import { featuredEvent, nonMatchingFilteredEvent, searchMissQuery } from '../../test-data/events.js';
import { users } from '../../test-data/users.js';

test.describe('Event browsing', () => {
  test.describe.configure({ mode: 'serial' });

  test('@smoke @p0 authenticated user can browse events and open a featured event', async ({
    page,
    homePage,
    eventsPage,
  }) => {
    await homePage.visit();
    await homePage.waitForLoaded();
    await expect(homePage.heroSection).toBeVisible();
    await expect(homePage.browseEventsLink).toBeVisible();
    await expect(homePage.userEmail).toHaveText(users.valid.email);

    await homePage.openEvents();

    await expect(eventsPage.searchInput).toBeVisible();
    await expect(eventsPage.eventCard(featuredEvent.name)).toBeVisible();

    await eventsPage.openEvent(featuredEvent.name);
    await expect(page).toHaveURL(/\/events\/\d+$/);
    await expect(page.getByRole('heading', { name: featuredEvent.name })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Book Tickets' })).toBeVisible();
  });

  test('@p0 event search shows an empty state for unknown queries', async ({ eventsPage }) => {
    await eventsPage.visit();
    await expect(eventsPage.searchInput).toBeVisible();

    await eventsPage.searchFor(searchMissQuery);
    await eventsPage.waitForSearchQuery(searchMissQuery);

    await expect(eventsPage.noEventsHeading).toBeVisible();
    await expect(eventsPage.noEventsDescription).toBeVisible();
  });

  test('@regression @p1 category and city filters narrow the event list', async ({ eventsPage }) => {
    await eventsPage.visit();
    await expect(eventsPage.searchInput).toBeVisible();

    await eventsPage.filterBy(featuredEvent.category, featuredEvent.city);
    await eventsPage.waitForCityFilter(featuredEvent.city);
    await expect(eventsPage.categoryFilter).toHaveValue(featuredEvent.category);
    await expect(eventsPage.cityFilter).toHaveValue(featuredEvent.city);
    await expect(eventsPage.clearFiltersButton).toBeVisible();

    await expect(eventsPage.eventCard(featuredEvent.name)).toBeVisible();
    await expect(eventsPage.eventCard(nonMatchingFilteredEvent.name)).toHaveCount(0);
  });

  test('@regression @p1 featured event card shows key metadata', async ({ eventsPage }) => {
    await eventsPage.visit();
    await expect(eventsPage.searchInput).toBeVisible();

    const card = eventsPage.eventCard(featuredEvent.name);

    await expect(card).toContainText(featuredEvent.category);
    await expect(card).toContainText(featuredEvent.date);
    await expect(card).toContainText(featuredEvent.price);
    await expect(card).toContainText(featuredEvent.availability);
  });

  test('@regression @p2 clear filters resets the event discovery view', async ({ eventsPage }) => {
    await eventsPage.visit();
    await expect(eventsPage.searchInput).toBeVisible();

    await eventsPage.filterBy(featuredEvent.category, featuredEvent.city);
    await eventsPage.waitForCityFilter(featuredEvent.city);
    await expect(eventsPage.categoryFilter).toHaveValue(featuredEvent.category);
    await expect(eventsPage.cityFilter).toHaveValue(featuredEvent.city);
    await expect(eventsPage.clearFiltersButton).toBeVisible();

    await eventsPage.clearFilters();
    await expect(eventsPage.categoryFilter).toHaveValue('');
    await expect(eventsPage.cityFilter).toHaveValue('');
    await expect(eventsPage.page).toHaveURL(/\/events$/);
    await expect(eventsPage.clearFiltersButton).toHaveCount(0);

    await expect(eventsPage.eventCard(featuredEvent.name)).toBeVisible();
    await expect(eventsPage.eventCard(nonMatchingFilteredEvent.name)).toBeVisible();
  });

  test('@regression @p2 search and category filters work together', async ({ eventsPage }) => {
    await eventsPage.visit();
    await expect(eventsPage.searchInput).toBeVisible();

    await eventsPage.searchFor(featuredEvent.searchQuery);
    await eventsPage.filterBy(featuredEvent.category);
    await eventsPage.waitForSearchAndCategory(featuredEvent.searchQuery, featuredEvent.category);
    await eventsPage.waitForEventCard(featuredEvent.name);

    await expect(eventsPage.searchInput).toHaveValue(featuredEvent.searchQuery);
    await expect(eventsPage.categoryFilter).toHaveValue(featuredEvent.category);
    await expect(eventsPage.page).toHaveURL(new RegExp(`search=${featuredEvent.searchQuery}`));

    await expect(eventsPage.eventCard(featuredEvent.name)).toBeVisible();
    await expect(eventsPage.eventCard(nonMatchingFilteredEvent.name)).toHaveCount(0);
  });
});