import { test, expect } from '@playwright/test';

test.describe('Master Admin Login', () => {
  test('should display admin login page', async ({ page }) => {
    await page.goto('/admin-login');
    
    await expect(page.locator('form')).toBeVisible();
    await expect(page.getByText('Admin Portal')).toBeVisible();
    await expect(page.getByPlaceholder('master_admin')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/admin-login');
    
    await page.fill('input[type="text"]', 'wrong_user');
    await page.fill('input[type="password"]', 'wrong_password');
    await page.click('button[type="submit"]');
    
    await expect(page.getByText(/access denied|invalid/i)).toBeVisible({ timeout: 10000 });
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/admin-login');
    
    await page.fill('input[type="text"]', 'master_admin');
    await page.fill('input[type="password"]', 'Admin@2025');
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard
    await page.waitForURL('**/admin', { timeout: 15000 });
    await expect(page).toHaveURL(/.*admin$/);
    
    // Should see admin dashboard content
    await expect(page.getByText(/analytics|dashboard/i)).toBeVisible({ timeout: 10000 });
  });
});
