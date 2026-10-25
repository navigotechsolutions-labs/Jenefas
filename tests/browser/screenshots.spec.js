import { test, expect } from '@playwright/test';

test('capture comprehensive review screenshots', async ({ page }) => {
  // 1. Desktop Homepage (English)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/review-home-desktop.png', fullPage: true });

  // 2. Desktop Homepage (Tamil)
  await page.locator('#siteLanguage').selectOption('ta');
  await page.screenshot({ path: 'test-results/review-home-desktop-tamil.png', fullPage: true });
  await page.locator('#siteLanguage').selectOption('en');

  // 3. Desktop Homepage with Guided Finder active
  await page.locator('#guidedSurface').selectOption('tabletop');
  await page.screenshot({ path: 'test-results/review-home-finder-active.png', fullPage: false });

  // 4. Desktop Product Detail (English)
  await page.goto('/product/?id=JF-TT28');
  await page.locator('#tab-btn-included').click();
  await page.screenshot({ path: 'test-results/review-product-detail-desktop.png', fullPage: true });

  // 5. Desktop Product Detail (Tamil)
  await page.locator('#productLanguage').selectOption('ta');
  await page.screenshot({ path: 'test-results/review-product-detail-tamil.png', fullPage: true });

  // 6. Mobile Homepage (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/review-home-mobile-390.png', fullPage: true });

  // 7. Mobile Product Detail (320px)
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/product/?id=JF-TT28');
  await page.screenshot({ path: 'test-results/review-product-detail-mobile-320.png', fullPage: true });
});
