import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Login Test Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await expect(page.getByRole('img', { name: 'company-branding' })).toBeVisible();
  });

  test('Test Id 001: No Credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    const requiredErrors = page.getByText('Required');
    await expect(requiredErrors.nth(0)).toBeVisible();
    await expect(requiredErrors.nth(1)).toBeVisible();
  });

  test('Test Id 002: Only Username', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Required')).toBeVisible();
  });

  test('Test Id 003: Only Password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Required')).toBeVisible();
  });

  test('Test Id 004: Wrong Credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('Test Id 005: Valid Credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  });

});
