// @ts-check
import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
import { FIREFOX_AUTH_STORAGE_PATH } from './utils/constants.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.EVENTHUB_BASE_URL ?? 'https://eventhub.rahulshettyacademy.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup-firefox',
      testMatch: /.*\.setup\.js/,
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'firefox',
      dependencies: ['setup-firefox'],
      testIgnore: [/.*\.setup\.js/, /.*\.api\.spec\.js/],
      use: {
        ...devices['Desktop Firefox'],
        storageState: FIREFOX_AUTH_STORAGE_PATH,
      },
    },
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.js/,
      use: {
        baseURL: process.env.EVENTHUB_API_BASE_URL ?? 'https://api.eventhub.rahulshettyacademy.com/api',
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
});