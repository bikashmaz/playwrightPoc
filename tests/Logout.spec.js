import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Logout Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page.getByRole('img', { name: 'company-branding' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

 //   await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });

  test('Logout Functionality', async ({ page }) => {

    // Open user dropdown
    await page.locator('i.oxd-userdropdown-icon').click();

    // Click Logout
    await page.locator('a.oxd-userdropdown-link', { hasText: 'Logout' }).click();

    // Verify redirected to login page
    await expect(page.locator('img[alt="company-branding"]')).toBeVisible();
  });

});
