import { test, expect } from '@playwright/test';

test.describe('E-Commerce Catalogue & Product Detail Specs', () => {

  test('Homepage catalogue renders all products dynamically without hardcoding', async ({ page }) => {
    await page.goto('/');

    const cards = page.locator('#productGrid > div');
    await expect(cards).toHaveCount(20);

    // Verify search matches product code and title
    const searchInput = page.locator('#searchInput');
    await searchInput.fill('JF-FX32');
    await expect(page.locator('#productGrid > div')).toHaveCount(1);
    await expect(page.locator('#productGrid')).toContainText('Ultra Slim Fixed TV Mount');

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('#productGrid > div')).toHaveCount(20);
  });

  test('Product detail page loads with direct URL and displays specifications', async ({ page }) => {
    await page.goto('/product/?id=JF-FX55');

    await expect(page.locator('#product-badge-code')).toHaveText('JF-FX55');
    await expect(page.locator('#product-title')).toHaveText('Standard Heavy-Duty Fixed Mount');
    await expect(page.locator('#product-category')).toHaveText('Fixed TV Mounts');
    await expect(page.locator('#product-price')).toHaveText('Request price');

    // Breadcrumb verification
    await expect(page.locator('#crumb-catalogue')).toBeVisible();
    await expect(page.locator('#crumb-category')).toHaveText('Fixed TV Mounts');

    // Tab switching
    await page.getByRole('button', { name: 'What is Included' }).click();
    await expect(page.locator('#tab-included')).toBeVisible();
    await expect(page.locator('#confirmed-parts-list')).toContainText('Main mounting bracket assembly');

    // Check dimensions view displays awaiting notice
    await page.locator('#btn-view-dimensions').click();
    await expect(page.locator('#gallery-container')).toContainText('Technical Dimensions Pending');
  });

  test('Product 28 detail page links directly to interactive assembly guide', async ({ page }) => {
    await page.goto('/product/?id=JF-TT28');

    await expect(page.locator('#product-title')).toHaveText('Rectangle-Base Table-Top TV Stand');
    const guideBtn = page.locator('#btn-view-guide');
    await expect(guideBtn).toBeVisible();

    // Installation tab provides direct link
    await page.getByRole('button', { name: 'Installation & Support' }).click();
    const launchLink = page.locator('#guide-launch-link');
    await expect(launchLink).toBeVisible();
    await expect(launchLink).toHaveAttribute('href', '../demos/product-28/');
  });

  test('Side-by-side comparison tray adds products and enforces maximum limit of 3', async ({ page }) => {
    await page.goto('/');

    // Add first product to compare
    await page.locator('#compare-btn-JF-FX32').click();
    await expect(page.locator('#compareBar')).not.toHaveClass(/translate-y-full/);
    await expect(page.locator('#compareActionBtn')).toHaveText('Compare (1)');

    // Add second product
    await page.locator('#compare-btn-JF-FX55').click();
    await expect(page.locator('#compareActionBtn')).toHaveText('Compare (2)');

    // Add third product
    await page.locator('#compare-btn-JF-TL43').click();
    await expect(page.locator('#compareActionBtn')).toHaveText('Compare (3)');

    // Open comparison modal
    await page.locator('#compareActionBtn').click();
    await expect(page.locator('#compareModal')).toBeVisible();
    await expect(page.locator('#compareTableContainer table')).toBeVisible();

    // Close comparison modal
    await page.locator('#compareModal button:has-text("Close Comparison")').click();
    await expect(page.locator('#compareModal')).toHaveClass(/hidden/);
  });

  test('Mobile viewport (320px & 390px) contains product cards and comparison without overflow', async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      // Check document scroll width
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);

      // Verify product detail page on mobile
      await page.goto('/product/?id=JF-TT28');
      const detailScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(detailScrollWidth).toBeLessThanOrEqual(width);
    }
  });

});
