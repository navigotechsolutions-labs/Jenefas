import { test, expect } from '@playwright/test';

async function ready(page, path = '/demos/product-28/') {
  await page.goto(path);
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('#viewer-error')).toBeHidden();
  await expect(page.locator('#loading')).toBeHidden();
}

test('Product 28: measurement toggle, single selection, table rendering, and pending status', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await ready(page, '/demos/product-28/');

  const toggleBtn = page.locator('#toggle-measurements');
  const selectWrapper = page.locator('#measurement-select-wrapper');
  const select = page.locator('#measurement-select');
  const table = page.locator('#measurements-table');

  await expect(toggleBtn).toBeVisible();
  await expect(toggleBtn).toHaveText('Show Dimensions');
  await expect(selectWrapper).toBeHidden();

  // Table is rendered with pending status and disclaimers
  await expect(table).toBeVisible();
  await expect(page.getByText('Animation movement is illustrative and does not represent an approved adjustment range.')).toBeVisible();
  await expect(page.getByText('Scene units express visual proportions only. Illustrative units are not converted to millimetres.')).toBeVisible();

  // Verify all rows show pending and no clamp fields exist
  const pendingBadges = page.locator('#measurements-tbody .status-badge.pending');
  const count = await pendingBadges.count();
  expect(count).toBeGreaterThan(5);

  const tableText = await table.innerText();
  expect(tableText).toContain('Measurement pending');
  expect(tableText).toContain('Overall Width');
  expect(tableText).toContain('Base Width');
  expect(tableText).toContain('Post Diameter');
  expect(tableText).not.toContain('Clamp Opening');
  expect(tableText).not.toContain('Supported Desk Thickness');
  expect(tableText).not.toContain('Throat Depth');

  // Toggle measurements ON
  await toggleBtn.click();
  await expect(toggleBtn).toHaveText('Hide Dimensions');
  await expect(selectWrapper).toBeVisible();

  // Single measurement selection in dropdown
  const options = await select.locator('option').allTextContents();
  expect(options.length).toBeGreaterThan(0);
  expect(options[0]).toContain('Overall Width');

  // Overlay badge appears for pending status without drawing invented 3D arrows
  const overlayBadge = page.locator('#measurement-overlay .measurement-overlay-badge.pending');
  await expect(overlayBadge).toBeVisible();
  await expect(overlayBadge).toContainText('Measurement pending');

  // Click on a table row to change active measurement
  const baseRow = page.locator('#measurements-tbody tr', { hasText: 'Base Width' });
  await baseRow.click();
  await expect(baseRow).toHaveClass(/selected-measurement-row/);

  // Toggle measurements OFF
  await toggleBtn.click();
  await expect(toggleBtn).toHaveText('Show Dimensions');
  await expect(selectWrapper).toBeHidden();

  expect(errors).toEqual([]);
});

test('Product 28: stage filtering shows overall dimensions when assembled and component dimensions when exploded', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page, '/demos/product-28/');

  const toggleBtn = page.locator('#toggle-measurements');
  await toggleBtn.click();
  const select = page.locator('#measurement-select');

  // Stage 0 (exploded view): overall measurements
  let options = await select.locator('option').allTextContents();
  expect(options.some(t => t.includes('Overall Width'))).toBe(true);

  // Navigate to Stage 1 (Rectangular Base)
  await page.locator('#next').click();
  await expect(page.locator('#progress')).toHaveValue('250', { timeout: 10000 });
  await expect(page.locator('#part-title')).toHaveText('Rectangular base');
  options = await select.locator('option').allTextContents();
  expect(options.some(t => t.includes('Base Width'))).toBe(true);
  expect(options.some(t => t.includes('Base Depth'))).toBe(true);
  expect(options.some(t => t.includes('Post Diameter'))).toBe(false);

  // Navigate to Stage 2 (Vertical Post)
  await page.locator('#next').click();
  await expect(page.locator('#progress')).toHaveValue('500', { timeout: 10000 });
  await expect(page.locator('#part-title')).toHaveText('Vertical post');
  options = await select.locator('option').allTextContents();
  expect(options.some(t => t.includes('Post Diameter'))).toBe(true);
  expect(options.some(t => t.includes('Post Height'))).toBe(true);
  expect(options.some(t => t.includes('Base Width'))).toBe(false);

  // Assemble completely (Stage 4)
  await page.locator('#assemble').click();
  await expect(page.locator('#progress')).toHaveValue('1000', { timeout: 15000 });
  options = await select.locator('option').allTextContents();
  expect(options.some(t => t.includes('Overall Width'))).toBe(true);
  expect(options.some(t => t.includes('Overall Height'))).toBe(true);
});

test('Product 28: bilingual Tamil language switching for measurements', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready(page, '/demos/product-28/');

  const langSelect = page.locator('#language');
  await langSelect.selectOption('ta');

  const toggleBtn = page.locator('#toggle-measurements');
  await expect(toggleBtn).toHaveText('அளவீடுகளைக் காட்டு');

  // Check table headers and pending labels in Tamil
  const table = page.locator('#measurements-table');
  await expect(table.locator('th').nth(0)).toHaveText('அளவுரு');
  await expect(table.locator('th').nth(1)).toHaveText('மதிப்பு (மிமீ)');
  await expect(table.locator('th').nth(2)).toHaveText('நிலை');
  await expect(table.locator('th').nth(3)).toHaveText('மூலம் / குறிப்பு');

  const firstBadge = page.locator('#measurements-tbody .status-badge.pending').first();
  await expect(firstBadge).toHaveText('அளவீடு நிலுவையில் உள்ளது');

  // Check disclaimer in Tamil
  await expect(page.getByText('இயங்குபட அசைவு ஒரு விளக்கக் காட்சி மட்டுமே; அங்கீகரிக்கப்பட்ட சரிசெய்தல் வரம்பைக் குறிக்கவில்லை.')).toBeVisible();

  // Toggle on in Tamil
  await toggleBtn.click();
  await expect(toggleBtn).toHaveText('அளவீடுகளை மறை');
  const overlayBadge = page.locator('#measurement-overlay .measurement-overlay-badge.pending');
  await expect(overlayBadge).toBeVisible();
  await expect(overlayBadge).toContainText('அளவீடு நிலுவையில் உள்ளது');
});

test('Product 29: measurements table, V-base fields, no clamps, and mobile layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await ready(page, '/demos/product-29/');

  const table = page.locator('#measurements-table');
  await expect(table).toBeVisible();
  const tableText = await table.innerText();

  // Has V-base fields
  expect(tableText).toContain('V-Base Front Span');
  expect(tableText).toContain('V-Base Depth');
  expect(tableText).toContain('Post Diameter');
  expect(tableText).toContain('Measurement pending');

  // No clamp fields
  expect(tableText).not.toContain('Clamp Opening');
  expect(tableText).not.toContain('Supported Desk Thickness');
  expect(tableText).not.toContain('Throat Depth');

  // Check no horizontal body overflow at 390px
  let scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  let clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

  // Check no horizontal body overflow at 320px
  await page.setViewportSize({ width: 320, height: 568 });
  scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

  expect(errors).toEqual([]);
});
