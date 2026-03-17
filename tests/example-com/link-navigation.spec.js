// spec: example-com-test-plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');

test.describe('Link Navigation', () => {
  test('Learn more link is clickable', async ({ page }) => {
    // 1. Navigate to https://example.com
    await page.goto('https://example.com');
    
    // Verify page displays with Learn more link visible
    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    await expect(learnMoreLink).toBeVisible();

    // 2. Verify link has proper cursor styling
    await learnMoreLink.hover();
    
    // Verify Link displays pointer cursor on hover and is styled as a hyperlink
    const linkStyles = await learnMoreLink.evaluate((element) => ({
      cursor: window.getComputedStyle(element).cursor,
      textDecoration: window.getComputedStyle(element).textDecoration,
      color: window.getComputedStyle(element).color
    }));
    
    expect(linkStyles.cursor).toBe('pointer');
    expect(linkStyles.textDecoration).toContain('underline');
  });

  test('Learn more link navigates to correct URL', async ({ page }) => {
    // 1. Navigate to https://example.com
    await page.goto('https://example.com');
    
    // Verify page displays
    await expect(page).toHaveTitle('Example Domain');
    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    await expect(learnMoreLink).toBeVisible();

    // 2. Click the 'Learn more' link
    await learnMoreLink.click();
    
    // Verify Navigation occurs and new page loads
    await expect(page).toHaveURL(/iana\.org/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Link opens in same tab by default', async ({ page }) => {
    // 1. Navigate to https://example.com
    await page.goto('https://example.com');
    
    // Verify page displays
    await expect(page).toHaveTitle('Example Domain');

    // 2. Inspect the Learn more link element
    const learnMoreLink = page.getByRole('link', { name: 'Learn more' });
    
    // Verify Link does not have target='_blank' attribute
    const linkTarget = await learnMoreLink.evaluate((element) => 
      element.getAttribute('target')
    );
    
    expect(linkTarget).toBeNull();
    
    // Verify link opens in current window
    const linkHref = await learnMoreLink.getAttribute('href');
    expect(linkHref).toBe('https://iana.org/domains/example');
  });
});
