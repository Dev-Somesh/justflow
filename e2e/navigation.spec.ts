import { test, expect } from '@playwright/test';

test.describe('JustFlow App', () => {
  test('basic navigation flow', async ({ page }) => {
    // Start from home page
    await page.goto('/');
    await expect(page).toHaveTitle(/JustFlow/);

    // Check navigation to dashboard
    await page.click('text=Dashboard');
    await expect(page.url()).toContain('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Check navigation to board
    await page.click('text=Board');
    await expect(page.url()).toContain('/board');
    await expect(page.locator('h1')).toContainText('Board');

    // Check navigation to calendar
    await page.click('text=Calendar');
    await expect(page.url()).toContain('/calendar');
    await expect(page.locator('h1')).toContainText('Calendar');
  });

  test('task creation flow', async ({ page }) => {
    // Go to board page
    await page.goto('/board');

    // Click new task button
    await page.click('button:has-text("New Task")');

    // Fill task form
    await page.fill('input[name="title"]', 'Test Task');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.selectOption('select[name="status"]', 'todo');
    await page.selectOption('select[name="priority"]', 'medium');

    // Submit form
    await page.click('button:has-text("Create")');

    // Verify task was created
    await expect(page.locator('text=Test Task')).toBeVisible();
    await expect(page.locator('text=Test Description')).toBeVisible();
  });

  test('responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('button:has-text("Menu")')).toBeVisible();

    // Test mobile menu interaction
    await page.click('button:has-text("Menu")');
    await expect(page.locator('nav')).toBeVisible();
  });
});
