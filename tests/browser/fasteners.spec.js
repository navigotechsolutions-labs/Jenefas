import { test, expect } from '@playwright/test';

async function ready(page, path = '/demos/product-28/') {
  await page.goto(path);
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('#viewer-error')).toBeHidden();
  await expect(page.locator('#loading')).toBeHidden();
}

test('Product 28: fastener table rendering, unconfirmed hardware labeling, selection, and location status', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await ready(page, '/demos/product-28/');

  const fastenersTable = page.locator('#fasteners-table');
  const detailCard = page.locator('#fastener-detail-card');
  const guideStatus = page.locator('.guide-status-card');

  await expect(fastenersTable).toBeVisible();
  await expect(detailCard).toBeVisible();
  await expect(guideStatus).toBeVisible();

  // Check customer-facing guide status wording
  await expect(guideStatus.locator('p')).toHaveText(
    'This model shows the product structure. Assembly details and measurements are awaiting manufacturer confirmation.'
  );

  // Check required disclaimers against invented torque and connection methods
  await expect(page.getByText('Tightening torque, wall-anchor suitability, and connection methods are never estimated and require manufacturer certification.')).toBeVisible();

  // Check table has neutral connection records labeled as unconfirmed
  const tableText = await fastenersTable.innerText();
  expect(tableText).toContain('CONN-BASE-POST');
  expect(tableText).toContain('Base-to-Post Joint (Unconfirmed)');
  expect(tableText).toContain('CONN-LOWER-RAIL');
  expect(tableText).toContain('Lower Rail Joint (Unconfirmed)');
  expect(tableText).toContain('Pending verification');

  // Ensure no assumed hardware codes (B1, W1, R1, etc.) appear in table
  expect(tableText).not.toContain('B1');
  expect(tableText).not.toContain('W1');
  expect(tableText).not.toContain('R1');
  expect(tableText).not.toContain('R2');

  // Select connection CONN-BASE-POST
  const basePostRow = page.locator('#fasteners-tbody tr', { hasText: 'CONN-BASE-POST' });
  await basePostRow.click();
  await expect(basePostRow).toHaveClass(/selected-fastener-row/);

  // Check detail card shows unconfirmed hardware notice
  await expect(page.locator('#fastener-detail-title')).toHaveText('CONN-BASE-POST: Base-to-Post Joint (Unconfirmed)');
  await expect(page.locator('#fastener-detail-stage')).toHaveText('Step 1: Base & Post Connection');

  const detailText = await detailCard.innerText();
  expect(detailText).toContain('Unconfirmed connection — hardware requiring manufacturer confirmation');
  expect(detailText).toContain('Qty');
  expect(detailText).toContain('Diameter');
  expect(detailText).toContain('Length');
  expect(detailText).toContain('Head Type');
  expect(detailText).toContain('Tool Required');
  expect(detailText).toContain('Washers / Spacers');
  expect(detailText).toContain('Pending verification');

  // Check installation location box states awaiting manufacturer confirmation
  await expect(page.locator('#fastener-location-box')).toContainText('Pending verification');
  await expect(page.locator('#fastener-location-desc')).toContainText('Awaiting manufacturer confirmation');

  // Selecting CONN-LOWER-RAIL jumps animation to Step 3 (progress = 750)
  const lowerRailRow = page.locator('#fasteners-tbody tr', { hasText: 'CONN-LOWER-RAIL' });
  await lowerRailRow.click();
  await expect(lowerRailRow).toHaveClass(/selected-fastener-row/);
  await expect(page.locator('#fastener-detail-title')).toHaveText('CONN-LOWER-RAIL: Lower Rail Joint (Unconfirmed)');
  await expect(page.locator('#fastener-detail-stage')).toHaveText('Step 3: Lower Rail Mounting');
  await expect(page.locator('#progress')).toHaveValue('750');

  // Stage synchronization: clicking Step 4 synchronizes selected fastener to Stage 4 fastener
  const step4Btn = page.locator('#stages button').nth(4);
  await step4Btn.click();
  await expect(page.locator('#fasteners-tbody tr.selected-fastener-row')).toContainText('CONN-UPPER-RAIL');

  expect(errors).toEqual([]);
});

test('Product 28: bilingual Tamil language switching for guide nav and fasteners without losing selection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page, '/demos/product-28/');

  // Select CONN-TV-MOUNT first
  const tvMountRow = page.locator('#fasteners-tbody tr', { hasText: 'CONN-TV-MOUNT' });
  await tvMountRow.click();
  await expect(tvMountRow).toHaveClass(/selected-fastener-row/);

  // Switch to Tamil
  const langSelect = page.locator('#language');
  await langSelect.selectOption('ta');

  // Verify guide navigation links translated to Tamil
  const guideNav = page.locator('.guide-navigation');
  await expect(guideNav.locator('a[data-i18n="allDemos"]')).toHaveText('← அனைத்து மாதிரி வழிகாட்டிகள்');
  await expect(guideNav.locator('[aria-current="page"]')).toHaveText('தயாரிப்பு 28');
  await expect(guideNav.locator('a[data-i18n="viewProduct29"]')).toHaveText('தயாரிப்பு 29 ஐப் பார்க்கவும் →');

  // Verify guide status translated to Tamil
  const guideStatus = page.locator('.guide-status-card');
  await expect(guideStatus.locator('h2')).toHaveText('மாதிரி & சரிபார்ப்பு நிலை');
  await expect(guideStatus.locator('p')).toHaveText('இந்த மாதிரி தயாரிப்பின் கட்டமைப்பை விளக்குகிறது. பொருத்தும் விவரங்களும் அளவீடுகளும் உற்பத்தியாளரின் உறுதிப்படுத்தலுக்கு நிலுவையில் உள்ளன.');

  // Check Tamil headers in table
  const fastenersTable = page.locator('#fasteners-table');
  await expect(fastenersTable.locator('th').nth(0)).toHaveText('குறியீடு');
  await expect(fastenersTable.locator('th').nth(1)).toHaveText('இணைப்பு வகை');
  await expect(fastenersTable.locator('th').nth(2)).toHaveText('பொருத்தல் நிலை');
  await expect(fastenersTable.locator('th').nth(9)).toHaveText('நிலை');

  // Check that CONN-TV-MOUNT remains selected across language change
  const selectedRow = page.locator('#fasteners-tbody tr.selected-fastener-row');
  await expect(selectedRow).toContainText('CONN-TV-MOUNT');
  await expect(selectedRow).toContainText('தொலைக்காட்சி பொருத்தும் இணைப்பு (உறுதிப்படுத்தப்படாதது)');

  // Check detail card in Tamil
  const detailCard = page.locator('#fastener-detail-card');
  await expect(detailCard).toContainText('உறுதிப்படுத்தப்படாத இணைப்பு — வன்பொருள் உற்பத்தியாளரால் உறுதிப்படுத்தப்பட வேண்டும்');
  await expect(detailCard).toContainText('விட்டம்');
  await expect(detailCard).toContainText('நீளம்');
  await expect(detailCard).toContainText('தேவையான கருவி');
  await expect(detailCard).toContainText('பொருத்தும் இடம்');
  await expect(detailCard).toContainText('உறுதிப்படுத்தல் நிலுவையில் உள்ளது');
});

test('Product 29: fastener list, V-base linking, guide nav, and 320px/390px mobile responsiveness', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await ready(page, '/demos/product-29/');

  const fastenersTable = page.locator('#fasteners-table');
  const detailCard = page.locator('#fastener-detail-card');
  const guideStatus = page.locator('.guide-status-card');

  await expect(fastenersTable).toBeVisible();
  await expect(detailCard).toBeVisible();
  await expect(guideStatus).toBeVisible();

  // Check guide navigation on Product 29
  const guideNav = page.locator('.guide-navigation');
  await expect(guideNav.locator('a[data-i18n="allDemos"]')).toHaveText('All assembly demos');
  await expect(guideNav.locator('[aria-current="page"]')).toHaveText('Product 29');
  await expect(guideNav.locator('a[data-i18n="viewProduct28"]')).toHaveText('View Product 28 →');

  // Check V-base connection description
  const basePostRow = page.locator('#fasteners-tbody tr', { hasText: 'CONN-BASE-POST' });
  await expect(basePostRow).toContainText('V-Base-to-Post Joint (Unconfirmed)');

  // Select CONN-BASE-POST
  await basePostRow.click();
  await expect(page.locator('#fastener-detail-title')).toHaveText('CONN-BASE-POST: V-Base-to-Post Joint (Unconfirmed)');

  // Verify responsive layout at 390px (no horizontal overflow)
  let scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  let clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

  // Verify responsive layout at 320px (no horizontal overflow)
  await page.setViewportSize({ width: 320, height: 568 });
  scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

  expect(errors).toEqual([]);
});
