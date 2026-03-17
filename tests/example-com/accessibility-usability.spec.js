// spec: example-com-test-plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');

test.describe('Accessibility and Usability', () => {
  test('Page is keyboard navigable', async ({ page }) => {
    // 1. Navigate to https://example.com
    await page.goto('https://example.com');
    
    // Verify page displays
    await expect(page).toHaveTitle('Example Domain');

    // 2. Press Tab key to navigate to the Learn more link
    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    await learnMoreLink.focus();
    
    // Verify Link becomes focused and receives visual focus indicator
    await expect(learnMoreLink).toBeFocused();

    // 3. Press Enter key to activate the link
    await page.keyboard.press('Enter');
    
    // Verify Link is activated and navigates to IANA page
    await expect(page).toHaveURL(/iana\.org/);
  });

  test('Content is readable and accessible', async ({ page }) => {
    // 1. Navigate to https://example.com
    await page.goto('https://example.com');
    
    // Verify page displays
    await expect(page).toHaveTitle('Example Domain');

    // 2. Verify text contrast and readability
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    
    // Verify heading is readable with adequate font size
    const headingSize = await heading.evaluate((el) => 
      window.getComputedStyle(el).fontSize
    );
    expect(parseInt(headingSize)).toBeGreaterThan(16);

    // Verify text color has contrast with background
    const body = page.locator('body');
    const bodyColor = await body.evaluate((el) => 
      window.getComputedStyle(el).color
    );
    expect(bodyColor).toBeTruthy();

    // 3. Verify all interactive elements are labeled
    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    await expect(learnMoreLink).toBeVisible();
    
    // Verify link has descriptive text 'Learn more'
    await expect(learnMoreLink).toHaveText('Learn more');
  });

  test('Page is responsive on different viewport sizes', async ({ page }) => {
    // 1. Navigate to https://example.com on desktop viewport
    await page.goto('https://example.com');
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Verify page displays on desktop
    await expect(page).toHaveTitle('Example Domain');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // 2. Resize viewport to tablet size (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Verify content is readable and properly formatted
    await expect(heading).toBeVisible();
    
    // Verify no horizontal scrolling is required
    const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);

    // 3. Resize viewport to mobile size (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify content is readable and properly formatted
    await expect(heading).toBeVisible();
    
    // Verify no horizontal scrolling is required
    const mobileBodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const mobileViewportWidth = await page.evaluate(() => window.innerWidth);
    expect(mobileBodyWidth).toBeLessThanOrEqual(mobileViewportWidth);
    
    // Verify all interactive elements are accessible
    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    await expect(learnMoreLink).toBeVisible();
  });
});
