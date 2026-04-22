import { test, expect } from '../../fixtures/test-base.js';
import { users } from '../../test-data/users.js';

test.describe('Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('@smoke @p0 sign in succeeds with valid credentials', async ({ loginPage, homePage }) => {
    await loginPage.visit();
    await loginPage.expectLoaded();

    await loginPage.signIn(users.valid.email, users.valid.password);

    await homePage.expectLoaded();
    await homePage.expectSignedInUser(users.valid.email);
  });

  test('@p0 invalid credentials show an error toast', async ({ loginPage }) => {
    await loginPage.visit();

    await loginPage.signIn(users.invalid.email, users.invalid.password);

    await expect(loginPage.invalidCredentialsToast).toBeVisible();
    await expect(loginPage.invalidCredentialsToast).toHaveText('Invalid email or password');
  });

  test('@regression @p1 register link routes to the registration page', async ({ loginPage, page }) => {
    await loginPage.visit();
    await loginPage.expectLoaded();

    await loginPage.openRegister();

    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  });

  test('@regression @p2 protected routes redirect unauthenticated users to login', async ({ loginPage, page }) => {
    for (const route of ['/bookings', '/events']) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login$/);
      await loginPage.expectLoaded();
    }
  });
});

test.describe('Session management', () => {
  test('@regression @p2 logout returns the user to login', async ({ homePage, loginPage, page }) => {
    await homePage.visit();
    await homePage.expectLoaded();

    await homePage.logout();

    await expect(page).toHaveURL(/\/login$/);
    await loginPage.expectLoaded();
  });
});