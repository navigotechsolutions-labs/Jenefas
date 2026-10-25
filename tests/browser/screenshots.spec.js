import { test, expect } from '@playwright/test';

test('capture comprehensive review screenshots', async ({ page }) => {
  // Desktop Homepage
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/review-home-desktop.png', fullPage: true });

  // Desktop Product Detail
  await page.goto('/product/?id=JF-TT28');
  await page.screenshot({ path: 'test-results/review-product-detail-desktop.png', fullPage: true });

  // Mobile Homepage (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/review-home-mobile-390.png', fullPage: true });

  // Mobile Product Detail (320px)
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/product/?id=JF-TT28');
  await page.screenshot({ path: 'test-results/review-product-detail-mobile-320.png', fullPage: true });
});
