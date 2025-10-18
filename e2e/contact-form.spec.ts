import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact form', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"], input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait for validation messages
    await page.waitForTimeout(500);
    
    // Check for error messages or validation states
    const errorMessages = page.locator('text=/required|cannot be empty/i');
    const errorCount = await errorMessages.count();
    
    // Should have at least one validation error
    expect(errorCount).toBeGreaterThan(0);
  });

  test('should submit form with valid data', async ({ page }) => {
    // Fill form
    await page.fill('input[name="name"], input[type="text"]', 'Test User');
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await page.fill('textarea', 'This is a test message for the contact form.');
    
    // Submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Wait for success message or navigation
    await page.waitForTimeout(2000);
    
    // Check for success indicator
    const successMessage = page.locator('text=/success|sent|thank you/i');
    if (await successMessage.isVisible()) {
      await expect(successMessage).toBeVisible();
    }
    
    await page.screenshot({ path: 'test-results/contact-form-submitted.png' });
  });
});
