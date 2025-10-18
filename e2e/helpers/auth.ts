import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**', { timeout: 5000 });
}

export async function logout(page: Page) {
  // Look for logout button or link
  const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out/i }).first();
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL('**/login', { timeout: 5000 });
  }
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check if user profile or logout button is visible
  const profileButton = page.locator('[data-testid="user-profile"], button[aria-label*="profile"]');
  return await profileButton.isVisible().catch(() => false);
}

export async function waitForAuth(page: Page, timeout = 10000) {
  await page.waitForFunction(
    () => {
      return localStorage.getItem('supabase.auth.token') !== null;
    },
    { timeout }
  );
}
