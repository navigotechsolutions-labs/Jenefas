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
  const page = await browser.newPage({ viewport: { width: 320, height: 667 } }); // iPhone SE

  console.log('--- AUDITING IPHONE SE (320px x 667px) ---');

  // 1. Check Product Detail Page
  await page.goto('http://localhost:3000/product/?id=JF-TT28', { waitUntil: 'networkidle' });
  const prodNavMenuVisible = await page.locator('.nav-menu').isVisible();
  const prodNavToggleExists = await page.locator('.nav-toggle').count() > 0;
  console.log('Product Detail Header Navigation:');
  console.log(' - nav-menu visible:', prodNavMenuVisible);
  console.log(' - nav-toggle exists:', prodNavToggleExists);

  // Check Product Detail RFQ Modal height and viewport overflow
  await page.evaluate(() => { if (window.openProductRfq) window.openProductRfq(); });
  await page.waitForTimeout(100);
  const prodModalBox = await page.locator('#productRfqModal > div').boundingBox();
  console.log('Product Detail RFQ Modal Box:', prodModalBox);
  if (prodModalBox) {
    console.log(' - Modal bottom Y:', prodModalBox.y + prodModalBox.height, 'vs viewport height 667');
    console.log(' - Exceeds viewport?', (prodModalBox.y + prodModalBox.height) > 667);
  }

  // 2. Check Homepage RFQ Modal height and viewport overflow
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { if (window.openRfqModal) window.openRfqModal(); });
  await page.waitForTimeout(100);
  const homeModalBox = await page.locator('#rfqModal > div').boundingBox();
  console.log('\nHomepage RFQ Modal Box:', homeModalBox);
  if (homeModalBox) {
    console.log(' - Modal bottom Y:', homeModalBox.y + homeModalBox.height, 'vs viewport height 667');
    console.log(' - Exceeds viewport?', (homeModalBox.y + homeModalBox.height) > 667);
  }

  // 3. Check Homepage Product Card Button Layout on 320px
  await page.evaluate(() => { if (window.closeRfqModal) window.closeRfqModal(); });
  await page.waitForTimeout(100);
  const cardButtons = await page.evaluate(() => {
    const card = document.querySelector('#productGrid > div');
    if (!card) return null;
    const actions = card.querySelectorAll('a, button');
    return Array.from(actions).map(a => ({
      text: a.innerText.trim(),
      width: a.getBoundingClientRect().width,
      height: a.getBoundingClientRect().height
    }));
  });
  console.log('\nHomepage Product Card Buttons on 320px:', cardButtons);

  // 4. Check Comparison Bar and WhatsApp button overlap on 320px
  await page.click('#compare-btn-JF-TT28');
  await page.waitForTimeout(100);
  const compareBarBox = await page.locator('#compareBar').boundingBox();
  const waBtnBox = await page.locator('a[href*="wa.me"]').last().boundingBox();
  console.log('\nCompare Bar Box:', compareBarBox);
  console.log('Floating WhatsApp Button Box:', waBtnBox);

  // 5. Check 3D Demo on 320px
  await page.goto('http://localhost:3000/demos/product-28/', { waitUntil: 'networkidle' });
  const demoMetrics = await page.evaluate(() => {
    const header = document.querySelector('.site-header');
    const stageNav = document.querySelector('.stage-navigation, .guide-navigation, .step-navigation, nav');
    return {
      headerHeight: header ? header.offsetHeight : null,
      stageNavHeight: stageNav ? stageNav.offsetHeight : null,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    };
  });
  console.log('\n3D Demo Metrics on 320px:', demoMetrics);

  await browser.close();
  if (serverProc) serverProc.kill();
}

main().catch(console.error);
