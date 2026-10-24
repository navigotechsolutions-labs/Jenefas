import {test,expect} from '@playwright/test';
test('mobile menu supports keyboard dismissal, navigation and quote entry',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const toggle=page.getByRole('button',{name:'Menu ☰'});const menu=page.locator('#main-menu');
 await expect(menu).toBeHidden();await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
 await page.keyboard.press('Escape');await expect(menu).toBeHidden();await expect(toggle).toBeFocused();
 await toggle.click();await menu.getByRole('link',{name:'Assembly Demos',exact:true}).click();
 await expect(page).toHaveURL(/#assembly-guides$/);await expect(menu).toBeHidden();
 await expect(page.locator('#assembly-guides')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await toggle.click();await menu.getByRole('button',{name:'Request a Quote'}).click();await expect(page.locator('#rfqModal')).toBeVisible();
});
test('desktop navigation and both guide return paths are discoverable',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 await expect(page.locator('#menu-toggle')).toBeHidden();await expect(page.locator('#main-menu')).toBeVisible();
 for(const code of [28,29]){
 await page.goto('/');await page.locator('#assembly-guides').getByRole('link',{name:new RegExp(`PRODUCT ${code}`,'i')}).click();
 await expect(page).toHaveURL(new RegExp(`/demos/product-${code}/$`));
 await page.getByRole('link',{name:'All assembly demos',exact:true}).click();await expect(page).toHaveURL(/#assembly-guides$/);
 }
});
