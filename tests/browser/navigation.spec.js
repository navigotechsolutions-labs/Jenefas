import { test, expect } from '@playwright/test';

test('mobile menu supports keyboard dismissal, navigation and quote entry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Menu ☰' });
  const menu = page.locator('#main-menu');

  // Verify initial closed state
  await expect(menu).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.screenshot({ path: 'test-results/nav-mobile-closed.png' });

  // 1. Menu opens
  await toggle.click();
  await expect(menu).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.screenshot({ path: 'test-results/nav-mobile-open.png' });

  // 2. Escape closes it and returns focus
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  // 3. Selecting a link closes the mobile menu
  await toggle.click();
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'Assembly Demos', exact: true }).click();
  await expect(page).toHaveURL(/#assembly-guides$/);
  await expect(menu).toBeHidden();
  await expect(page.locator('#assembly-guides')).toBeVisible();

  // 4. No horizontal overflow on mobile
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/nav-mobile-assembly-section.png' });

  // 5. Request a Quote opens the enquiry dialog
  await toggle.click();
  await expect(menu).toBeVisible();
  await menu.getByRole('button', { name: 'Request a Quote' }).click();
  await expect(menu).toBeHidden();
  await expect(page.locator('#rfqModal')).toBeVisible();
  await expect(page.locator('#rfqModal')).not.toHaveClass(/hidden/);

  // Close modal
  await page.locator('#rfqModal button[onclick="closeRfqModal()"]').first().click();
  await expect(page.locator('#rfqModal')).toHaveClass(/hidden/);
});

test('desktop navigation and both guide return paths are discoverable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  // Verify desktop header: toggle is hidden, main menu is visible
  await expect(page.locator('#menu-toggle')).toBeHidden();
  await expect(page.locator('#main-menu')).toBeVisible();
  await page.screenshot({ path: 'test-results/nav-desktop-header.png' });

  // Verify Assembly Demos link on desktop scrolls to section
  await page.locator('#main-menu').getByRole('link', { name: 'Assembly Demos', exact: true }).click();
  await expect(page).toHaveURL(/#assembly-guides$/);
  await expect(page.locator('#assembly-guides')).toBeVisible();
  await page.screenshot({ path: 'test-results/nav-desktop-assembly-guides.png' });

  // Verify Assembly Demos links to both products and both demos return to assembly section
  for (const code of [28, 29]) {
    await page.goto('/');
    const guideLink = page.locator('#assembly-guides').getByRole('link', { name: new RegExp(`PRODUCT ${code}`, 'i') });
    await expect(guideLink).toBeVisible();
    await guideLink.click();
    await expect(page).toHaveURL(new RegExp(`/demos/product-${code}/$`));

    // Check breadcrumb return link to assembly section
    const returnLink = page.getByRole('link', { name: 'All assembly demos', exact: true });
    await expect(returnLink).toBeVisible();
    await returnLink.click();
    await expect(page).toHaveURL(/#assembly-guides$/);
    await expect(page.locator('#assembly-guides')).toBeVisible();
  }

  // Verify desktop horizontal overflow check
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
