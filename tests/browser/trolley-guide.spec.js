import { test, expect } from '@playwright/test';
test('trolley chapters, playback, voice fallback and video mode', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/demos/trolley-guide/');
  await expect(page.locator('canvas')).toHaveCount(1);
  for(let i=0;i<7;i++) { await page.locator('#chapterList button').nth(i).click(); await expect(page.locator('#counter')).toHaveText(`${String(i+1).padStart(2,'0')} / 07`); }
  await page.locator('#ta').click(); await expect(page.locator('#title')).toContainText('டிவி');
  await page.locator('#viewVideo').click(); await expect(page.locator('#videoEmpty')).toBeVisible();
  await page.locator('#play').click(); await expect(page.locator('#view3d')).toHaveAttribute('aria-pressed','true');
  await page.locator('#seek').evaluate(el=>{el.value='41.8';el.dispatchEvent(new Event('input',{bubbles:true}))});
  await expect(page.locator('#play')).toContainText('வழிகாட்டியை இயக்கு', {timeout:5000});
  await expect(page.locator('#seek')).toHaveValue('42');
  await page.locator('#play').click(); await expect(page.locator('#counter')).toHaveText('01 / 07');
  await page.locator('#play').click(); expect(errors).toEqual([]);
});
test('trolley mobile has no horizontal overflow and chapter focus remains stable during playback', async ({page})=>{
 await page.setViewportSize({width:320,height:800}); await page.goto('/demos/trolley-guide/');
 await page.locator('#play').click(); await page.locator('#chapterList button').first().focus(); await page.waitForTimeout(250);
 await expect(page.locator('#chapterList button').first()).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
