import { test, expect } from '@playwright/test';
import { adminLogin, adminLogout } from './helpers/auth';

test.describe('Master Admin Login', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing sessions
    await page.context().clearCookies();
    await page.goto('/admin-login');
  });

  test('should display admin login page correctly', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.getByText('Admin Portal')).toBeVisible();
    await expect(page.getByText('Secure access for authorized administrators only')).toBeVisible();
    await expect(page.getByPlaceholder('master_admin')).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    await expect(page.getByText(/missing information|enter both/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid username', async ({ page }) => {
    await page.fill('input[type="text"]', 'invalid_user');
    await page.fill('input[type="password"]', 'Admin@2025');
    await page.click('button[type="submit"]');
    
    await expect(page.getByText(/access denied|invalid/i)).toBeVisible({ timeout: 10000 });
  });

  test('should show error for invalid password', async ({ page }) => {
    await page.fill('input[type="text"]', 'master_admin');
    await page.fill('input[type="password"]', 'wrong_password');
    await page.click('button[type="submit"]');
    
    await expect(page.getByText(/access denied|invalid/i)).toBeVisible({ timeout: 10000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await adminLogin(page, 'master_admin', 'Admin@2025');
    
    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/.*\/admin$/, { timeout: 15000 });
    
    // Should see admin dashboard content
    await expect(page.getByText(/analytics|dashboard/i)).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state during login', async ({ page }) => {
    await page.fill('input[type="text"]', 'master_admin');
    await page.fill('input[type="password"]', 'Admin@2025');
    
    // Check for loading state
    await page.click('button[type="submit"]');
    await expect(page.getByText(/verifying access/i)).toBeVisible({ timeout: 1000 });
  });

  test('should persist session after page reload', async ({ page }) => {
    await adminLogin(page, 'master_admin', 'Admin@2025');
    
    // Reload the page
    await page.reload();
    
    // Should still be on admin dashboard
    await expect(page).toHaveURL(/.*\/admin$/, { timeout: 10000 });
    await expect(page.getByText(/analytics|dashboard/i)).toBeVisible();
  });

  test('should redirect to admin dashboard if already logged in', async ({ page }) => {
    await adminLogin(page, 'master_admin', 'Admin@2025');
    
    // Try to navigate to login page again
    await page.goto('/admin-login');
    
    // Should redirect back to admin dashboard
    await expect(page).toHaveURL(/.*\/admin$/, { timeout: 10000 });
  });

  test('should logout successfully', async ({ page }) => {
    await adminLogin(page, 'master_admin', 'Admin@2025');
    
    // Logout
    await adminLogout(page);
    
    // Should redirect to admin login
    await expect(page).toHaveURL(/.*\/admin-login$/, { timeout: 10000 });
  });

  test('should not access admin dashboard without authentication', async ({ page }) => {
    await page.goto('/admin');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/admin-login$/, { timeout: 10000 });
  });
});
