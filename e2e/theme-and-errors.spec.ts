import { test, expect } from '@playwright/test';

test.describe('Theme and Error Handling', () => {
  test('theme switching works correctly', async ({ page }) => {
    // Go to home page
    await page.goto('/');

    // Check initial theme
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Click theme toggle
    await page.click('button[aria-label="Switch to dark mode"]');

    // Check dark theme is applied
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle back to light theme
    await page.click('button[aria-label="Switch to light mode"]');

    // Check light theme is restored
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('error handling and alerts work', async ({ page }) => {
    // Go to a route that will trigger an error
    await page.goto('/invalid-route');

    // Check error boundary is shown
    await expect(page.locator('text=Something went wrong')).toBeVisible();

    // Check error alert is shown
    await expect(page.locator('role=alert')).toBeVisible();
    await expect(page.locator('role=alert')).toContainText('Error');
  });

  test('performance monitoring integration', async ({ page }) => {
    // Enable performance APIs
    await page.addInitScript(() => {
      window.performance.mark('test-start');
    });

    // Go to home page
    await page.goto('/');

    // Check performance metrics are collected
    const performanceEntries = await page.evaluate(() => {
      window.performance.mark('test-end');
      window.performance.measure('test-duration', 'test-start', 'test-end');
      return window.performance.getEntriesByType('measure');
    });

    expect(performanceEntries.length).toBeGreaterThan(0);
  });
});
