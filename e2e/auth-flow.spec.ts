import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation for invalid email', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Should show error
    const errorMessage = page.locator('text=/invalid email|valid email/i');
    await expect(errorMessage.first()).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    // Look for register link
    const registerLink = page.locator('a, button').filter({ hasText: /sign up|register|create account/i }).first();
    
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await page.waitForURL('**/register');
      await expect(page).toHaveURL(/.*register/);
    }
  });

  test('should display admin login page', async ({ page }) => {
    await page.goto('/admin-login');
    
    await expect(page.locator('form')).toBeVisible();
    await page.screenshot({ path: 'test-results/admin-login.png' });
  });
});
