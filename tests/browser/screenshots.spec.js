import { test, expect } from '@playwright/test';
import fs from 'fs';

test('capture comprehensive review and presentation backup screenshots', async ({ page }) => {
  const backupDir = 'test-results/presentation-backup';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 1. Desktop Homepage (English)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'test-results/review-home-desktop.png', fullPage: true });
  await page.screenshot({ path: `${backupDir}/01-homepage-prototype-showcase.png`, fullPage: true });

  // 2. Desktop Homepage with Guided Finder active
  await page.locator('#guidedSurface').selectOption('tabletop');
  await page.locator('#guidedVesa').selectOption('200x200');
  await page.screenshot({ path: 'test-results/review-home-finder-active.png', fullPage: false });
  await page.screenshot({ path: `${backupDir}/02-guided-finder-tabletop-vesa.png`, fullPage: false });

  // 3. Desktop Homepage (Tamil)
  await page.locator('#siteLanguage').selectOption('ta');
  await page.screenshot({ path: 'test-results/review-home-desktop-tamil.png', fullPage: true });
  await page.locator('#siteLanguage').selectOption('en');

  // 4. Desktop Product Detail (English)
  await page.goto('/product/?id=JF-TT28');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${backupDir}/03-product-28-detail-overview.png`, fullPage: true });

  // Switch to Included tab
  await page.locator('#tab-btn-included').click();
  await page.screenshot({ path: 'test-results/review-product-detail-desktop.png', fullPage: true });
  await page.screenshot({ path: `${backupDir}/04-product-28-package-honesty.png`, fullPage: true });

  // Open RFQ modal
  await page.evaluate(() => window.openProductRfq());
  await expect(page.locator('#productRfqModal')).toBeVisible();
  await page.locator('#prodRfqName').fill('Rajan (Demo)');
  await page.locator('#prodRfqCompany').fill('Electronics Showroom');
  await page.screenshot({ path: `${backupDir}/05-product-28-rfq-whatsapp-draft.png` });
  await page.evaluate(() => window.closeProductRfq());

  // 5. Desktop Product Detail (Tamil)
  await page.locator('#productLanguage').selectOption('ta');
  await page.screenshot({ path: 'test-results/review-product-detail-tamil.png', fullPage: true });
  await page.screenshot({ path: `${backupDir}/06-product-28-tamil-detail.png`, fullPage: true });

  // 6. 3D Concept Preview - Product 28
  await page.goto('/demos/product-28/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.concept-badge')).toBeVisible();
  await page.screenshot({ path: `${backupDir}/07-product-28-3d-concept-preview.png`, fullPage: true });

  // Toggle measurements in 3D concept
  const toggleBtn = page.locator('#toggle-measurements');
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await page.screenshot({ path: `${backupDir}/08-product-28-measurements-fasteners.png`, fullPage: true });
  }

  // 7. Mobile Homepage (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'test-results/review-home-mobile-390.png', fullPage: true });
  await page.screenshot({ path: `${backupDir}/09-mobile-390-homepage.png`, fullPage: true });

  // 8. Mobile Product Detail (320px)
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/product/?id=JF-TT28');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'test-results/review-product-detail-mobile-320.png', fullPage: true });
  await page.screenshot({ path: `${backupDir}/10-mobile-320-product-detail.png`, fullPage: true });
});
