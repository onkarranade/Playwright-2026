import { test, expect } from '../../fixtures/test-base.js';
import { createAdminEventData } from '../../test-data/admin-events.js';

test.describe('Admin events', () => {
  test.describe.configure({ mode: 'serial' });

  test('@regression @p1 admin can create a custom event', async ({ adminEventsPage }) => {
    const event = createAdminEventData();

    await adminEventsPage.visit();
    await adminEventsPage.waitForLoaded();
    await adminEventsPage.deleteEventIfPresent(event.title);

    await adminEventsPage.fillNewEventForm(event);
    await adminEventsPage.addEvent();
    await adminEventsPage.waitForCreateToast();

    const row = adminEventsPage.eventRow(event.title);
    await expect(row).toBeVisible();
    await expect(row).toContainText(event.category);
    await expect(row).toContainText(event.city);
    await expect(row).toContainText(`$${event.price}`);

    await adminEventsPage.deleteEventIfPresent(event.title);
  });

  test('@regression @p1 admin can edit a custom event title', async ({ adminEventsPage }) => {
    const event = createAdminEventData();

    await adminEventsPage.visit();
    await adminEventsPage.waitForLoaded();
    await adminEventsPage.deleteEventIfPresent(event.title);
    await adminEventsPage.deleteEventIfPresent(event.updatedTitle);

    await adminEventsPage.fillNewEventForm(event);
    await adminEventsPage.addEvent();
    await adminEventsPage.waitForCreateToast();
    await expect(adminEventsPage.eventRow(event.title)).toBeVisible();

    await adminEventsPage.openEdit(event.title);
    await adminEventsPage.waitForEditMode();
    await expect(adminEventsPage.titleInput).toHaveValue(event.title);
    await adminEventsPage.updateTitle(event.updatedTitle);
    await adminEventsPage.waitForUpdateToast();

    await expect(adminEventsPage.newEventHeading).toBeVisible();
    await expect(adminEventsPage.eventRow(event.updatedTitle)).toBeVisible();
    await expect(adminEventsPage.eventRow(event.title)).toHaveCount(0);

    await adminEventsPage.deleteEventIfPresent(event.updatedTitle);
  });

  test('@regression @p1 required admin fields block empty event submission', async ({ adminEventsPage, page }) => {
    await adminEventsPage.visit();
    await adminEventsPage.waitForLoaded();

    await adminEventsPage.addEvent();

    await expect(page).toHaveURL(/\/admin\/events$/);

    for (const input of [
      adminEventsPage.titleInput,
      adminEventsPage.cityInput,
      adminEventsPage.venueInput,
      adminEventsPage.eventDateInput,
      adminEventsPage.priceInput,
      adminEventsPage.totalSeatsInput,
    ]) {
      await expect(input).toHaveJSProperty('required', true);
      const validity = await input.evaluate((element) => ({
        valid: element.validity.valid,
        valueMissing: element.validity.valueMissing,
      }));

      expect(validity).toEqual({ valid: false, valueMissing: true });
    }
  });
});