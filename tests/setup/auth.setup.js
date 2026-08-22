import fs from 'fs';
import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { users } from '../../test-data/users.js';
import { loginViaUi } from '../../utils/auth.js';
import { CHROME_AUTH_STORAGE_PATH, FIREFOX_AUTH_STORAGE_PATH } from '../../utils/constants.js';

const AUTH_DIR = path.resolve(process.cwd(), 'playwright/.auth');

const AUTH_PATHS = {
  setup: CHROME_AUTH_STORAGE_PATH,
  'setup-chrome': CHROME_AUTH_STORAGE_PATH,
  chromium: CHROME_AUTH_STORAGE_PATH,
  'setup-firefox': path.join(AUTH_DIR, 'firefox.json'),
  firefox: FIREFOX_AUTH_STORAGE_PATH,
};

setup('authenticate EventHub user', async ({ page }, testInfo) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  await loginViaUi(page, users.valid);

  await expect(page.getByTestId('user-email-display')).toHaveText(users.valid.email);

  const storagePath = AUTH_PATHS[testInfo.project.name];

  if (!storagePath) {
    throw new Error(`Unsupported auth setup project: ${testInfo.project.name}`);
  }

  await page.context().storageState({
    path: storagePath,
  });

  console.log(`Saved auth state to: ${storagePath}`);
});