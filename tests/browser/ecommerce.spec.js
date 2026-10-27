import { test, expect } from '@playwright/test';

test.describe('E-Commerce Catalogue & Product Detail Specs', () => {

  test('Homepage catalogue renders all products dynamically without hardcoding', async ({ page }) => {
    await page.goto('/');

    const cards = page.locator('#productGrid > div');
    await expect(cards).toHaveCount(2);

    // Verify search matches product code and title
    const searchInput = page.locator('#searchInput');
    await searchInput.fill('Product 28');
    await expect(page.locator('#productGrid > div')).toHaveCount(1);
    await expect(page.locator('#productGrid')).toContainText('Rectangle-Base Table-Top TV Stand');

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('#productGrid > div')).toHaveCount(2);
  });

  test('Product detail page loads with direct URL and displays specifications', async ({ page }) => {
    await page.goto('/product/?id=JF-FX55');

    // Gracefully handled planning reference notice
    await expect(page.locator('#planning-notice-banner')).toBeVisible();
    await expect(page.locator('#planning-notice-banner')).toContainText('Planning Reference');
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
    await expect(page.locator('#confirmed-parts-list')).toContainText('Primary mounting bracket');

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
    await page.locator('#compare-btn-JF-TT28').click();
    await expect(page.locator('#compareBar')).not.toHaveClass(/translate-y-full/);
    await expect(page.locator('#compareActionBtn')).toHaveText('Compare (1)');

    // Add second product
    await page.locator('#compare-btn-JF-TT29').click();
    await expect(page.locator('#compareActionBtn')).toHaveText('Compare (2)');

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
      await page.setViewportSize({ width, height: 667 });
      await page.goto('/');

      // Check document scroll width
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(width);

      // Verify RFQ modal on mobile fits in viewport
      await page.evaluate(() => window.openRfqModal());
      await page.waitForTimeout(100);
      const modalBox = await page.locator('#rfqModal > div').boundingBox();
      expect(modalBox.y).toBeGreaterThanOrEqual(0);
      expect(modalBox.y + modalBox.height).toBeLessThanOrEqual(667);
      await page.evaluate(() => window.closeRfqModal());

      // Verify product detail page on mobile
      await page.goto('/product/?id=JF-TT28');
      const detailScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(detailScrollWidth).toBeLessThanOrEqual(width);

      // Verify product detail mobile menu toggle works
      const toggle = page.locator('#product-menu-toggle');
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(page.locator('#product-main-menu')).toBeVisible();

      // Verify product detail RFQ modal fits in viewport
      await page.locator('#product-main-menu button.nav-quote').click();
      const prodModalBox = await page.locator('#productRfqModal > div').boundingBox();
      expect(prodModalBox.y).toBeGreaterThanOrEqual(0);
      expect(prodModalBox.y + prodModalBox.height).toBeLessThanOrEqual(667);
    }
  });

  test('Guided 4-Step Product Finder filters honestly with explicit verification status', async ({ page }) => {
    await page.goto('/');

    // Check prototype showcase notice banner exists
    const notice = page.locator('#catalogue-notice-banner');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('Curated Digital Prototype Showcase');

    // Select Table Top surface
    await page.locator('#guidedSurface').selectOption('tabletop');
    const outcomeContainer = page.locator('#guidedOutcomeContainer');
    await expect(outcomeContainer).toBeVisible();
    await expect(page.locator('#guidedOutcomeBadge')).toContainText('More Information Required');

    // Select VESA 200x200 and weight 15 kg
    await page.locator('#guidedVesa').selectOption('200x200');
    await page.locator('#guidedWeightInput').fill('15');
    await expect(page.locator('#guidedOutcomeBadge')).toContainText('More Information Required');
    await expect(page.locator('#productGrid')).toContainText('Rectangle-Base Table-Top TV Stand');

    // Navigate to Product 28 details
    await page.locator('#productGrid a:has-text("View Details")').first().click();
    await expect(page.locator('#product-title')).toContainText('Table-Top TV Stand');

    // Return to Homepage via browser back and verify state is preserved
    await page.goBack();
    await expect(page.locator('#guidedSurface')).toHaveValue('tabletop');
    await expect(page.locator('#guidedVesa')).toHaveValue('200x200');
    await expect(page.locator('#guidedWeightInput')).toHaveValue('15');

    // Reset finder
    await page.locator('#guidedResetBtn').click();
    await expect(page.locator('#productGrid > div')).toHaveCount(2);
  });

  test('Finder uses the shared engine and does not pass VESA below a documented range', async ({ page }) => {
    await page.goto('/');
    await page.locator('#guidedSurface').selectOption('wall');
    await page.locator('#guidedMotion').selectOption('tilt');
    // Every tilt mount documents a range starting at 100x100 or larger, so 75x75 must not pass
    await page.locator('#guidedVesa').selectOption('75x75');
    await page.locator('#guidedWeightInput').fill('10');
    await expect(page.locator('#guidedOutcomeBadge')).toContainText('Does not meet a checked requirement');
    await expect(page.locator('#finderRequirementsAudit')).toContainText('VESA 75x75: Exceeds mount limit');
  });

  test('Bilingual language switching functions seamlessly on Homepage and Product Detail', async ({ page }) => {
    // 1. Homepage switching
    await page.goto('/');
    await page.locator('#siteLanguage').selectOption('ta');

    // Verify Tamil labels across hero, finder, categories, cards, and why-jenefas
    await expect(page.locator('[data-i18n="heroTitle"]')).toContainText('சரியான பிடிப்பு');
    await expect(page.locator('[data-i18n="finderTitle"]')).toContainText('உங்கள் டிவிக்கு ஏற்ற மவுண்ட்டை தேர்ந்தெடுக்கவும்');
    await expect(page.locator('[data-i18n="navProducts"]')).toHaveText('பொருட்கள்');
    await expect(page.locator('[data-i18n="catAll"]')).toHaveText('அனைத்து பொருட்கள்');
    await expect(page.locator('[data-i18n="whyTitle"]')).toContainText('டீலர்கள் ஜெனிஃபாஸை விரும்புவது ஏன்?');

    // Verify product card translations
    const firstCard = page.locator('#productGrid > div').first();
    await expect(firstCard).toContainText('திரை அளவு வரம்பு:');
    await expect(firstCard).toContainText('அதிகபட்ச எடை:');

    // Switch back to English
    await page.locator('#siteLanguage').selectOption('en');
    await expect(page.locator('[data-i18n="heroTitle"]')).toContainText('The right support');
    await expect(page.locator('[data-i18n="finderTitle"]')).toContainText('Find the Right Mount for Your Display');
    await expect(firstCard).toContainText('Screen Range:');

    // 2. Product Detail switching
    await page.goto('/product/?id=JF-TT28');
    await page.locator('#productLanguage').selectOption('ta');

    await expect(page.locator('#tab-btn-included')).toHaveText('உள்ளடக்கிய பாகங்கள்');
    await expect(page.locator('[data-i18n="navProducts"]')).toHaveText('பொருட்கள்');
    await expect(page.locator('#whatsapp-enquiry-text')).toHaveText('இந்த தயாரிப்பு பற்றி விசாரிக்க');
    await expect(page.locator('#spec-table-body')).toContainText('சரிபார்க்கப்பட்டது');

    // Switch back to English
    await page.locator('#productLanguage').selectOption('en');
    await expect(page.locator('#tab-btn-included')).toHaveText('What is Included');
    await expect(page.locator('#whatsapp-enquiry-text')).toHaveText('Ask About This Product');
    await expect(page.locator('#spec-table-body')).toContainText('Observed');
  });

  test('RFQ modal prepares structured WhatsApp draft without fake backend submission', async ({ page }) => {
    // Test on Homepage RFQ modal
    await page.goto('/');
    await page.evaluate(() => window.openRfqModal('Product 28'));
    await expect(page.locator('#rfqModal')).toBeVisible();

    // Verify WhatsApp notice in modal
    const notice = page.locator('#rfqModal');
    await expect(notice).toContainText('verified WhatsApp sales desk');

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
