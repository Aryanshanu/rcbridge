import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

  test('should display mobile navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for mobile menu button (hamburger)
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]');
    await expect(menuButton.first()).toBeVisible();
  });

  test('should open mobile menu', async ({ page }) => {
    await page.goto('/');
    
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first();
    await menuButton.click();
    
    // Check that navigation items are visible
    await page.waitForTimeout(500);
    
    const navItems = page.locator('nav a, [role="navigation"] a');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(0);
    
    await page.screenshot({ path: 'test-results/mobile-menu-open.png' });
  });

  test('should be readable on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check that text is visible and not cut off
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Take full page screenshot
    await page.screenshot({ path: 'test-results/mobile-homepage.png', fullPage: true });
  });

  test('should handle property cards on mobile', async ({ page }) => {
    await page.goto('/properties');
    
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Check that property cards are visible
    const cards = page.locator('[data-testid="property-card"], .property-card, article');
    const count = await cards.count();
    
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
    }
    
    await page.screenshot({ path: 'test-results/mobile-properties.png', fullPage: true });
  });
});
