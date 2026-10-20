import {Page, Locator} from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly productList: Locator;
    readonly sortDropdown: Locator;
    readonly cartBadge: Locator;
    constructor(page: Page) {
        this.page = page;
        this.productList = page.locator('.inventory_item');
        this.sortDropdown = page.locator('[data-test="sort-dropdown"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]'); 
    }
    async navigateToInventoryPage(url: string = '/inventory.html'): Promise<void> {
        await this.page.goto(url);
    }
    async getProductCount(): Promise<number> {
        return await this.productList.count();
    }
    async getCartItemCount(): Promise<number> {
        const cartItem = await this.cartBadge.textContent();
        return parseInt(cartItem ?? '0', 10) || 0;
    }
}
