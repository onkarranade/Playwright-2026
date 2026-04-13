import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'tests/eventhub-auth.state.json');
const EMAIL = process.env.EVENTHUB_EMAIL ?? 'qaonkar7@mailinator.com';
const PASSWORD = process.env.EVENTHUB_PASSWORD ?? 'Qa@123456';

export default async () => {
  if (fs.existsSync(STORAGE_STATE_PATH)) {
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://eventhub.rahulshettyacademy.com/login');
  await page.locator('#email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForSelector('[data-testid="user-email-display"]');

  await context.storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
};
