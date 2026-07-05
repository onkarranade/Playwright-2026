import { test, expect } from '@playwright/test';
import { users } from '../../test-data/users.js';
import { apiUrl, authHeaders, loginAsApiUser } from '../../utils/api.js';

test.describe('EventHub API', () => {
  test('health endpoint reports a healthy API and database', async ({ request }) => {
    const response = await request.get(apiUrl('health'));

    await expect(response).toBeOK();

    const body = await response.json();

    expect(body).toMatchObject({
      status: 'ok',
      dbStatus: 'connected',
    });
    expect(typeof body.timestamp).toBe('string');
  });

  test('config endpoint exposes public feature flags', async ({ request }) => {
    const response = await request.get(apiUrl('config'));

    await expect(response).toBeOK();

    const body = await response.json();

    expect(body).toMatchObject({
      showExploreLinks: false,
    });
  });

  test('login returns a token that can be reused for /auth/me', async ({ request }) => {
    const login = await loginAsApiUser(request, users.valid);

    expect(login).toMatchObject({
      success: true,
      user: {
        email: users.valid.email,
      },
    });
    expect(typeof login.token).toBe('string');

    const meResponse = await request.get(apiUrl('auth/me'), {
      headers: authHeaders(login.token),
    });

    await expect(meResponse).toBeOK();

    const me = await meResponse.json();

    expect(me).toMatchObject({
      success: true,
      user: {
        email: users.valid.email,
      },
    });
    expect(typeof me.user.userId).toBe('number');
  });

  test('events endpoint returns seeded events and pagination metadata', async ({ request }) => {
    const login = await loginAsApiUser(request, users.valid);

    const response = await request.get(apiUrl('events'), {
      headers: authHeaders(login.token),
    });

    await expect(response).toBeOK();

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.pagination).toMatchObject({
      page: 1,
      limit: 10,
    });
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.some((event) => event.title === 'World Tech Summit')).toBe(true);
  });
});