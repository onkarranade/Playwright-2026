import { test, expect } from '@playwright/test';

// Original login tests kept for reference. They are commented out because
// we now rely on shared storage state for authenticated sessions.
// test('eventhub login', async({page})=>{
//   await page.goto('https://eventhub.rahulshettyacademy.com/login');
//   await page.locator('#email').fill('qaonkar7@mailinator.com');
//   await page.getByLabel('Password').fill('Qa@123456');
//   await page.getByRole('button', { name: 'Sign In' }).click();
//   await expect(page.getByTestId('user-email-display')).toHaveText('qaonkar7@mailinator.com');
// });
//
// test('seacrch event', async ({page})=>{
//   await page.goto('https://eventhub.rahulshettyacademy.com/login');
//   await page.locator('#email').fill('qaonkar7@mailinator.com');
//   await page.getByLabel('Password').fill('Qa@123456');
//   await page.getByRole('button', { name: 'Sign In' }).click();
//   await expect(page.getByTestId('user-email-display')).toHaveText('qaonkar7@mailinator.com');
//   await page.getByText('Browse Events →', { exact: true }).click();
// });

test('eventhub login', async ({ page }) => {
  await page.goto('https://eventhub.rahulshettyacademy.com/');
  await expect(page.getByTestId('user-email-display')).toHaveText('qaonkar7@mailinator.com');
});

test('search event', async ({ page }) => {
  await page.goto('https://eventhub.rahulshettyacademy.com/');
  await expect(page.getByTestId('user-email-display')).toHaveText('qaonkar7@mailinator.com');
  await page.getByText('Browse Events →', { exact: true }).click();
  await expect(page).toHaveURL(/.*events/);
});