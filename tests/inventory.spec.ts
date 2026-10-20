
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('SauceDemo inventory', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page, baseURL }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage(baseURL);
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('displays six products', async ({ page }) => {
    await expect(
      page.getByText('Products', { exact: true })
    ).toBeVisible();

    await expect(page.locator('.inventory_item'))
      .toHaveCount(6);
  });

  test('sorts products by price ascending', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]')
      .selectOption('lohi');

    const prices = await page.locator('.inventory_item_price')
      .allTextContents();

    const numericPrices = prices.map(price =>
      Number(price.replace('$', ''))
    );

    expect(numericPrices).toEqual(
      [...numericPrices].sort((a, b) => a - b)
    );
  });

  test('adds a product to the cart', async ({ page }) => {
    const backpack = page.locator('.inventory_item')
      .filter({ hasText: 'Sauce Labs Backpack' });

    await backpack.getByRole('button', {
      name: 'Add to cart'
    }).click();

    await expect(
      backpack.getByRole('button', { name: 'Remove' })
    ).toBeVisible();

    await expect(page.locator('.shopping_cart_badge'))
      .toHaveText('1');
  });

  test('removes a product from the cart', async ({ page }) => {
    const backpack = page.locator('.inventory_item')
      .filter({ hasText: 'Sauce Labs Backpack' });

    await backpack.getByRole('button', {
      name: 'Add to cart'
    }).click();

    await backpack.getByRole('button', {
      name: 'Remove'
    }).click();

    await expect(
      page.locator('.shopping_cart_badge')
    ).toHaveCount(0);

    await expect(
      backpack.getByRole('button', { name: 'Add to cart' })
    ).toBeVisible();
  });
});