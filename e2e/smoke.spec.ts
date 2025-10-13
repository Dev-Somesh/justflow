import { test, expect } from '@playwright/test';

test('loads app and navigates to dashboard or login', async ({ page }) => {
  await page.goto('/');
  // Either landing or dashboard depending on sessionStorage
  await expect(page).toHaveTitle(/JustFlow|Vite|React/i);
});

test('navigates to Workflow Builder after login flag', async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('loginSuccess', 'true');
  });
  await page.goto('/');
  await page.goto('/workflows/builder');
  await expect(page.locator('text=Save Workflow')).toBeVisible();
});


