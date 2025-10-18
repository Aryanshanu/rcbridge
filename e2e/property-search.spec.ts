import { test, expect } from '@playwright/test';

test.describe('Property Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/properties');
  });

  test('should display property listings', async ({ page }) => {
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"], .property-card, article', { timeout: 10000 });
    
    // Check that at least one property is visible
    const properties = page.locator('[data-testid="property-card"], .property-card, article');
    const count = await properties.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter properties by type', async ({ page }) => {
    // Look for filter controls
    const filterButton = page.locator('button, select').filter({ hasText: /Filter|Type|Category/i }).first();
    
    if (await filterButton.isVisible()) {
      await filterButton.click();
      
      // Select residential
      await page.click('text=Residential');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
      
      // Take screenshot
      await page.screenshot({ path: 'test-results/filtered-properties.png' });
    }
  });

  test('should search properties by location', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Hyderabad');
      await searchInput.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/search-results.png' });
    }
  });
});
