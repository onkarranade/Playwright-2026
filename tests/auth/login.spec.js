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
});