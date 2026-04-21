import { test, expect } from '../../fixtures/test-base.js';
import { featuredEvent, nonMatchingFilteredEvent, searchMissQuery } from '../../test-data/events.js';
import { users } from '../../test-data/users.js';

test.describe('Event browsing', () => {
  test('@smoke @p0 authenticated user can browse events and open a featured event', async ({
    homePage,
    eventsPage,
    eventDetailsPage,
  }) => {
    await homePage.visit();
    await homePage.expectLoaded();
    await homePage.expectSignedInUser(users.valid.email);

    await homePage.openEvents();

    await eventsPage.expectLoaded();
    await expect(eventsPage.eventCard(featuredEvent.name)).toBeVisible();

    await eventsPage.openEvent(featuredEvent.name);
    await eventDetailsPage.expectLoaded(featuredEvent.name);
  });

  test('@p0 event search shows an empty state for unknown queries', async ({ eventsPage }) => {
    await eventsPage.visit();
    await eventsPage.expectLoaded();

    await eventsPage.searchFor(searchMissQuery);

    await expect(eventsPage.noEventsHeading).toBeVisible();
    await expect(eventsPage.noEventsDescription).toBeVisible();
  });

  test('@regression @p1 category and city filters narrow the event list', async ({ eventsPage }) => {
    await eventsPage.visit();
    await eventsPage.expectLoaded();

    await eventsPage.filterBy(featuredEvent.category, featuredEvent.city);
    await eventsPage.expectFiltersApplied(featuredEvent.category, featuredEvent.city);

    await expect(eventsPage.eventCard(featuredEvent.name)).toBeVisible();
    await expect(eventsPage.eventCard(nonMatchingFilteredEvent.name)).toHaveCount(0);
  });

  test('@regression @p1 featured event card shows key metadata', async ({ eventsPage }) => {
    await eventsPage.visit();
    await eventsPage.expectLoaded();

    await eventsPage.expectCardSummary(featuredEvent);
  });
});