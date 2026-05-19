import path from 'path';

export const CHROME_AUTH_STORAGE_PATH = path.resolve(process.cwd(), 'playwright/.auth/chrome.json');

export const FIREFOX_AUTH_STORAGE_PATH = path.resolve(
  process.cwd(),
  'playwright/.auth/firefox.json'
);