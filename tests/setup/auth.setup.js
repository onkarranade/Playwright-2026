import fs from 'fs';
import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { users } from '../../test-data/users.js';
import { loginViaUi } from '../../utils/auth.js';
import { AUTH_STORAGE_PATH } from '../../utils/constants.js';

setup('authenticate EventHub user', async ({ page }) => {
  fs.mkdirSync(path.dirname(AUTH_STORAGE_PATH), { recursive: true });

  await loginViaUi(page, users.valid);
  await expect(page.getByTestId('user-email-display')).toHaveText(users.valid.email);

  await page.context().storageState({ path: AUTH_STORAGE_PATH });
});