import { test, expect } from '@playwright/test';
import { users } from '../../test-data/users.js';
import { apiUrl, authHeaders, loginAsApiUser } from '../../utils/api.js';

function buildEventPayload(title, eventDate) {
  return {
    title,
    description: 'Playwright API test event',
    category: 'Workshop',
    venue: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    eventDate,
    price: 250,
    totalSeats: 50,
    imageUrl: 'https://example.com/banner.jpg',
  };
}

test.describe('Event CRUD API', () => {
  test('creates, updates, reads, and deletes an event', async ({ request }) => {
    const login = await loginAsApiUser(request, users.valid);
    const headers = authHeaders(login.token);
    const eventDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const createdTitle = `Playwright API Event ${Date.now()}`;
    const updatedTitle = `${createdTitle} Updated`;

    let createdEventId;
    let deleted = false;

    try {
      const createResponse = await request.post(apiUrl('events'), {
        headers,
        data: buildEventPayload(createdTitle, eventDate),
      });

      await expect(createResponse).toBeOK();

      const created = await createResponse.json();

      expect(created).toMatchObject({
        success: true,
        message: 'Event created successfully',
      });
      expect(created.data.title).toBe(createdTitle);
      expect(created.data.availableSeats).toBe(created.data.totalSeats);

      createdEventId = created.data.id;

      const getResponse = await request.get(apiUrl(`events/${createdEventId}`), {
        headers,
      });

      await expect(getResponse).toBeOK();

      const fetched = await getResponse.json();

      expect(fetched).toMatchObject({
        success: true,
        data: {
          id: createdEventId,
          title: createdTitle,
        },
      });

      const updateResponse = await request.put(apiUrl(`events/${createdEventId}`), {
        headers,
        data: buildEventPayload(updatedTitle, eventDate),
      });

      await expect(updateResponse).toBeOK();

      const updated = await updateResponse.json();

      expect(updated).toMatchObject({
        success: true,
        message: 'Event updated successfully',
      });
      expect(updated.data).toMatchObject({
        id: createdEventId,
        title: updatedTitle,
        totalSeats: 50,
      });

      const deleteResponse = await request.delete(apiUrl(`events/${createdEventId}`), {
        headers,
      });

      await expect(deleteResponse).toBeOK();

      const deletedBody = await deleteResponse.json();

      expect(deletedBody).toMatchObject({
        success: true,
        message: 'Event deleted successfully',
      });

      deleted = true;

      const missingResponse = await request.get(apiUrl(`events/${createdEventId}`), {
        headers,
      });

      expect(missingResponse.status()).toBe(404);
    } finally {
      if (createdEventId && !deleted) {
        await request.delete(apiUrl(`events/${createdEventId}`), {
          headers,
        });
      }
    }
  });
});