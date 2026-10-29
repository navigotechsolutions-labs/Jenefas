import { chromium } from '@playwright/test';
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
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

  console.log('--- TESTING PRODUCT DETAIL MOBILE NAVIGATION ---');
  await page.goto('http://localhost:3000/product/?id=JF-TT28', { waitUntil: 'networkidle' });

  // 1. Menu initially hidden
  const menu = page.locator('#product-main-menu');
  let isVisible = await menu.isVisible();
  console.log('Menu initially visible:', isVisible);

  // 2. Click toggle
  await page.click('#product-menu-toggle');
  await page.waitForTimeout(200);
  isVisible = await menu.isVisible();
  console.log('Menu visible after toggle click:', isVisible);

  // 3. Click Request a Quote inside menu
  await page.click('#product-main-menu button.nav-quote');
  await page.waitForTimeout(200);
  const rfqModalVisible = await page.locator('#productRfqModal').isVisible();
  console.log('RFQ Modal visible after clicking quote button in menu:', rfqModalVisible);

  // 4. Close RFQ modal
  await page.click('#productRfqModal button:has-text("Cancel")');
  await page.waitForTimeout(200);
  const rfqModalClosed = !(await page.locator('#productRfqModal').isVisible());
  console.log('RFQ Modal closed after cancel:', rfqModalClosed);

  await browser.close();
  if (serverProc) serverProc.kill();
}

main().catch(console.error);
