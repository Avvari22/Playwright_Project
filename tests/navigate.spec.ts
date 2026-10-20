// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { getUser } from '../fixtures/test';

test.describe('SauceDemo Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page, baseURL }) => {
    loginPage = new LoginPage(page);
    console.log('Base URL:', baseURL);    
    await loginPage.navigateToLoginPage(baseURL);
  });

  test('Login with standard user', async ({ page }) => {
    const standardUser = getUser('standard');
    console.log('Logging in with standard user:', standardUser.username);
    await loginPage.login(standardUser.username, standardUser.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Login with locked-out user shows error', async ({ page }) => {
    const lockedOutUser = getUser('lockedOut');
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });
})