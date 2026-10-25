import { test, expect } from '@playwright/test';

async function ready(page) {
  await page.goto('/demos/product-29/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('#viewer-error')).toBeHidden();
  await expect(page.locator('#loading')).toBeHidden();
}
async function seek(page, value) {
  await page.locator('#progress').evaluate((element, progress) => {
    element.value = String(progress);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

test('desktop: controls, animation, keyboard, assets and console', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await ready(page);
  await expect(page.getByText('This preview illustrates the product structure. Final assembly steps, hardware and measurements require manufacturer confirmation.')).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop-exploded.png', fullPage: true });
  await page.locator('#next').click();
  await expect(page.locator('#progress')).toHaveValue('250', { timeout: 10000 });
  await expect(page.locator('#part-title')).toHaveText('V-shaped base');
  await page.locator('#previous').click();
  await expect(page.locator('#progress')).toHaveValue('0', { timeout: 10000 });
  await page.locator('#play').click();
  await expect(page.locator('#play')).toHaveText('Pause');
  await expect.poll(async () => Number(await page.locator('#progress').inputValue())).toBeGreaterThan(30);
  await page.locator('#play').click();
  const paused = await page.locator('#progress').inputValue();
  await page.waitForTimeout(200);
  await expect(page.locator('#progress')).toHaveValue(paused);
  await seek(page, 630);
  await expect(page.locator('#progress-value')).toHaveText('63%');
  await expect(page.locator('#part-title')).toHaveText('Lower mounting rail');
  await page.locator('#assemble').click();
  await expect(page.locator('#progress')).toHaveValue('1000', { timeout: 15000 });
  await expect(page.locator('#next')).toBeDisabled();
  await page.screenshot({ path: 'test-results/desktop-assembled.png', fullPage: true });
  await page.locator('#explode').click();
  await expect.poll(async () => Number(await page.locator('#progress').inputValue())).toBeLessThan(990);
  // Reversing mid-transition must start at the current position.
  await page.locator('#assemble').click();
  await expect(page.locator('#progress')).toHaveValue('1000', { timeout: 15000 });
  await page.locator('#play').click();
  await expect(page.locator('#play')).toHaveText('Pause');
  await page.locator('#play').click();
  await seek(page, 0);
  const canvas = page.locator('canvas');
  await page.keyboard.press('Tab');
  await canvas.focus();
  await expect(canvas).toBeFocused();
  await expect(canvas).toHaveCSS('outline-style', 'solid');
  const before = await canvas.screenshot();
  for (const key of ['ArrowLeft', 'ArrowUp', '+', '-', 'Home']) await canvas.press(key);
  await canvas.press('ArrowRight');
  const after = await canvas.screenshot();
  expect(before.equals(after)).toBe(false);
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 25, { steps: 8 });
  await page.mouse.up();
  await page.mouse.wheel(0, -300);
  await page.locator('#reset').click();
  await expect(page.locator('#progress')).toHaveValue('0');
  await page.locator('#progress').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#progress')).toHaveValue('1');
  await page.locator('#language').selectOption('ta');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('#translated-note')).toBeVisible();
  await expect(page.locator('#part-title')).toHaveText('V வடிவ அடித்தளம்');
  await page.locator('#stages button').nth(2).click();
  await expect(page.locator('#progress')).toHaveValue('500', { timeout: 12000 });
  await expect(page.locator('#part-title')).toHaveText('செங்குத்துத் தூண்');
  await page.locator('#language').selectOption('en');
  await expect(page.locator('#part-title')).toHaveText('Vertical post');
  expect(errors).toEqual([]);
});

test('mobile: Tamil, resizing, stages, touch orbit and reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await ready(page);
  await expect(page.locator('#motion-note')).toBeVisible();
  await expect(page.locator('#play')).toBeDisabled();
  for (let i = 1; i <= 4; i++) {
    await page.locator('#next').click();
    await expect(page.locator('#progress')).toHaveValue(String(i * 250));
  }
  await page.locator('#previous').click();
  await expect(page.locator('#progress')).toHaveValue('750');
  await page.locator('#explode').click();
  await expect(page.locator('#progress')).toHaveValue('0');
  await page.locator('#assemble').click();
  await expect(page.locator('#progress')).toHaveValue('1000');
  await page.locator('#stages button').first().click();
  await expect(page.locator('#progress')).toHaveValue('0');
  await page.locator('#stages button').nth(2).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#progress')).toHaveValue('500');
  await page.locator('#explode').click();
  await page.locator('#language').selectOption('ta');
  await page.screenshot({ path: 'test-results/mobile-tamil.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // Real touch events through Chromium's input protocol, including pinch.
  await page.locator('canvas').scrollIntoViewIfNeeded();
  const beforeTouch = await page.locator('canvas').screenshot();
  const canvas = await page.locator('canvas').boundingBox();
  const x = canvas.x + canvas.width / 2, y = canvas.y + canvas.height / 2;
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 50, y: y + 15 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x - 25, y }, { x: x + 25, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - 55, y }, { x: x + 55, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  expect(beforeTouch.equals(await page.locator('canvas').screenshot())).toBe(false);
  await page.locator('#reset').click();
  const timelineBox = await page.locator('.timeline').boundingBox();
  const panelBox = await page.locator('.panel').boundingBox();
  expect(timelineBox.y).toBeLessThan(panelBox.y);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-landscape.png', fullPage: true });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('#play')).toBeEnabled();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#play')).toBeDisabled();
  expect(errors).toEqual([]);
  await context.close();
});

test('WebGL unavailable: clear failure and usable translated reference', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      if (kind.startsWith('webgl')) return null;
      return original.call(this, kind, ...args);
    };
  });
  const page = await context.newPage();
  await page.goto('/demos/product-29/');
  await expect(page.locator('#viewer-error')).toContainText('could not start');
  await expect(page.locator('#assemble')).toBeDisabled();
  await page.locator('#stages button').nth(3).click();
  await expect(page.locator('#part-title')).toHaveText('Lower mounting rail');
  await page.locator('#language').selectOption('ta');
  await expect(page.locator('#viewer-error')).toContainText('3D');
  await expect(page.locator('.reference img')).toBeVisible();
  await context.close();
});
