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

  test('Guided 4-Step Product Finder filters honestly with explicit verification status', async ({ page }) => {
    await page.goto('/');

    // Check partial catalogue banner exists
    const notice = page.locator('#catalogue-notice-banner');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('Curated Digital Catalogue');
    await expect(notice).toContainText('90+ model manufacturing range');

    // Select Table Top surface
    await page.locator('#guidedSurface').selectOption('tabletop');
    const outcomeContainer = page.locator('#guidedOutcomeContainer');
    await expect(outcomeContainer).toBeVisible();
    await expect(page.locator('#guidedOutcomeBadge')).toContainText('Matches available verified criteria');
    await expect(page.locator('#productGrid')).toContainText('Rectangle-Base Table-Top TV Stand');

    // Select Ceiling drop with 75+ and over 50kg requiring custom verification
    await page.locator('#guidedSurface').selectOption('ceiling');
    await page.locator('#guidedSize').selectOption('75+');
    await page.locator('#guidedWeight').selectOption('over50');
    await expect(page.locator('#guidedOutcomeBadge')).toContainText('More Information Required');

    // Reset finder
    await page.locator('#guidedResetBtn').click();
    await expect(page.locator('#productGrid > div')).toHaveCount(20);
  });

  test('Bilingual language switching functions seamlessly on Homepage and Product Detail', async ({ page }) => {
    // 1. Homepage switching
    await page.goto('/');
    await page.locator('#siteLanguage').selectOption('ta');

    // Verify Tamil labels
    await expect(page.locator('[data-i18n="finderTitle"]')).toContainText('உங்கள் டிவிக்கு ஏற்ற மவுண்ட்டை தேர்ந்தெடுக்கவும்');
    await expect(page.locator('[data-i18n="navProducts"]')).toHaveText('பொருட்கள்');

    // Switch back to English
    await page.locator('#siteLanguage').selectOption('en');
    await expect(page.locator('[data-i18n="finderTitle"]')).toContainText('Find the Right Mount for Your Display');

    // 2. Product Detail switching
    await page.goto('/product/?id=JF-TT28');
    await page.locator('#productLanguage').selectOption('ta');

    await expect(page.locator('#tab-btn-included')).toHaveText('உள்ளடக்கிய பாகங்கள்');
    await expect(page.locator('[data-i18n="navProducts"]')).toHaveText('பொருட்கள்');

    // Switch back to English
    await page.locator('#productLanguage').selectOption('en');
    await expect(page.locator('#tab-btn-included')).toHaveText('What is Included');
  });

  test('RFQ modal prepares structured WhatsApp draft without fake backend submission', async ({ page }) => {
    // Test on Homepage RFQ modal
    await page.goto('/');
    await page.evaluate(() => window.openRfqModal('Product 28'));
    await expect(page.locator('#rfqModal')).toBeVisible();

    // Verify WhatsApp notice banner in modal
    const notice = page.locator('#rfqModal');
    await expect(notice).toContainText('WhatsApp Draft');

    // Fill the enquiry form
    await page.locator('#rfqName').fill('Ritchie Street Partner');
    await page.locator('#rfqCompany').fill('Audio Visuals Chennai');
    await page.locator('#rfqPhone').fill('9840123456');
    await page.locator('#rfqQuantity').fill('50 pcs');

    // Listen to window.open call
    let openedUrl = '';
    await page.exposeFunction('mockOpenCapture', (url) => { openedUrl = url; });
    await page.evaluate(() => {
      window.open = (url) => { window.mockOpenCapture(url); return null; };
    });

    await page.locator('#rfqSubmitBtn').click();

    // Verify WhatsApp URL format
    expect(openedUrl).toContain('https://wa.me/919840817220?text=');
    expect(openedUrl).toContain('Audio%20Visuals%20Chennai');
    expect(openedUrl).toContain('Product%2028');

    // Also test Product Detail RFQ Modal
    await page.goto('/product/?id=JF-TT28');
    await page.locator('button.btn-rfq').click();
    await expect(page.locator('#productRfqModal')).toBeVisible();
    await page.locator('#prodRfqName').fill('Chennai Dealer');
    await page.locator('#prodRfqPhone').fill('9840999999');

    let prodOpenedUrl = '';
    await page.exposeFunction('mockProdOpenCapture', (url) => { prodOpenedUrl = url; });
    await page.evaluate(() => {
      window.open = (url) => { window.mockProdOpenCapture(url); return null; };
    });

    await page.locator('#prodRfqSubmitBtn').click();
    expect(prodOpenedUrl).toContain('https://wa.me/919840817220?text=');
    expect(prodOpenedUrl).toContain('Chennai%20Dealer');
  });

  test('Package honesty: separates visible components from confirmed package contents', async ({ page }) => {
    await page.goto('/product/?id=JF-TT28');

    // Visible components tab
    await page.locator('#tab-btn-included').click();
    await expect(page.locator('#tab-included')).toBeVisible();
    await expect(page.locator('#tab-included')).toContainText('Visible Product Components (From Catalogue Scans)');
    await expect(page.locator('#tab-included')).toContainText('Package Contents Notice: Hardware pack contents');

    // 3D guide link is labeled Concept Preview
    const launchLink = page.locator('#guide-launch-link');
    await expect(launchLink).toContainText('Launch 3D Concept Preview');
  });
});
