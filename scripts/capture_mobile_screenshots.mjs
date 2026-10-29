import { chromium } from '@playwright/test';
import path from 'path';
import { spawn } from 'child_process';
import http from 'http';

function checkServer(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => resolve(true));
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function startServer() {
  const isUp = await checkServer(3000);
  if (isUp) return null;
  const proc = spawn('npx', ['serve', 'dist', '-l', '3000'], { shell: true, stdio: 'ignore' });
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await checkServer(3000)) return proc;
  }
  throw new Error('Failed to start server on port 3000');
}

async function main() {
  const serverProc = await startServer();
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const viewports = [
    { name: 'iphone_se_320', width: 320, height: 667 },
    { name: 'iphone_14_390', width: 390, height: 844 }
  ];

  const pagesToTest = [
    { name: 'home', url: 'http://localhost:3000/' },
    { name: 'product_28', url: 'http://localhost:3000/product/?id=JF-TT28' },
    { name: 'demo_28', url: 'http://localhost:3000/demos/product-28/' }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    for (const p of pagesToTest) {
      // English
      await page.goto(p.url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `scratch/mobile_${vp.name}_${p.name}_en.png`, fullPage: false });

      // Tamil
      const langBtn = page.locator('#langToggleBtn, [data-lang-btn="ta"], #siteLanguage, #productLanguage');
      if (await langBtn.count() > 0) {
        if (await page.locator('#siteLanguage').count() > 0) {
          await page.selectOption('#siteLanguage', 'ta');
        } else if (await page.locator('#productLanguage').count() > 0) {
          await page.selectOption('#productLanguage', 'ta');
        }
        await page.waitForTimeout(300);
      }
      await page.screenshot({ path: `scratch/mobile_${vp.name}_${p.name}_ta.png`, fullPage: false });

      // If home, open RFQ Modal and take screenshot
      if (p.name === 'home') {
        await page.evaluate(() => { if (window.openRfqModal) window.openRfqModal(); });
        await page.waitForTimeout(200);
        await page.screenshot({ path: `scratch/mobile_${vp.name}_rfq_modal.png`, fullPage: false });
        await page.evaluate(() => { if (window.closeRfqModal) window.closeRfqModal(); });

        // Open menu
        await page.click('#menu-toggle').catch(() => {});
        await page.waitForTimeout(200);
        await page.screenshot({ path: `scratch/mobile_${vp.name}_menu_open.png`, fullPage: false });
      }

      // If product detail, open RFQ Modal
      if (p.name === 'product_28') {
        await page.evaluate(() => { if (window.openProductRfq) window.openProductRfq(); });
        await page.waitForTimeout(200);
        await page.screenshot({ path: `scratch/mobile_${vp.name}_prod_rfq_modal.png`, fullPage: false });
      }
    }
    await context.close();
  }

  await browser.close();
  if (serverProc) serverProc.kill();
  console.log('Mobile screenshots captured successfully.');
}

main().catch(console.error);
