import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display main elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for header/navigation
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for main call-to-action
    const ctaButton = page.locator('button, a').filter({ hasText: /Get Started|Explore/i }).first();
    await expect(ctaButton).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/homepage.png', fullPage: true });
  });

  test('should navigate to properties page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click properties link
    await page.click('text=Properties');
    
    // Wait for navigation
    await page.waitForURL('**/properties');
    
    // Verify we're on properties page
    await expect(page).toHaveURL(/.*properties/);
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Contact');
    await page.waitForURL('**/contact');
    
    await expect(page).toHaveURL(/.*contact/);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check meta tags
    const title = await page.title();
    expect(title).toContain('RC Bridge');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(50);
  });
});
