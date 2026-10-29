import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';

// Helper to check if server is up
function checkServer(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function startServer() {
  const isUp = await checkServer(3000);
  if (isUp) return null;
  console.log('Starting serve on port 3000...');
  const proc = spawn('npx', ['serve', 'dist', '-l', '3000'], { shell: true, stdio: 'inherit' });
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await checkServer(3000)) {
      console.log('Server is ready on port 3000');
      return proc;
    }
  }
  throw new Error('Failed to start server on port 3000');
}

async function findOverflowElements(page) {
  return await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const overflowing = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1) { // 1px threshold for subpixel rounding
        overflowing.push({
          tag: el.tagName,
          id: el.id,
          className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 80) : '') : '',
          text: (el.innerText || '').slice(0, 40).replace(/\n/g, ' '),
          rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }
        });
      }
    }
    return overflowing;
  });
}

async function main() {
  const serverProc = await startServer();
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const viewports = [
    { name: 'iPhone SE (320px)', width: 320, height: 667 },
    { name: 'iPhone mini (375px)', width: 375, height: 812 },
    { name: 'iPhone 14/15 (390px)', width: 390, height: 844 },
    { name: 'Android Pixel (412px)', width: 412, height: 915 }
  ];

  const urls = [
    '/',
    '/product/?id=JF-TT28',
    '/product/?id=JF-FX55',
    '/demos/product-28/'
  ];

  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    for (const path of urls) {
      for (const lang of ['en', 'ta']) {
        const url = `http://localhost:3000${path}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        if (lang === 'ta') {
          // Check if language toggle exists and switch to Tamil
          const langBtn = page.locator('#langToggleBtn, [data-lang-btn="ta"], #btn-lang-ta');
          if (await langBtn.count() > 0) {
            await langBtn.first().click().catch(() => {});
            await page.waitForTimeout(200);
          } else {
            await page.evaluate(() => {
              if (window.setLanguage) window.setLanguage('ta');
            });
            await page.waitForTimeout(200);
          }
        }

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        const hasOverflow = scrollWidth > clientWidth;

        let overflowing = [];
        if (hasOverflow) {
          overflowing = await findOverflowElements(page);
        }

        results.push({
          viewport: vp.name,
          width: vp.width,
          path,
          lang,
          hasOverflow,
          scrollWidth,
          clientWidth,
          overflowElementsCount: overflowing.length,
          topOverflowElements: overflowing.slice(0, 3)
        });
      }
    }
    await context.close();
  }

  await browser.close();
  if (serverProc) serverProc.kill();

  console.log('\n--- AUDIT RESULTS ---');
  let failures = 0;
  for (const r of results) {
    if (r.hasOverflow) {
      failures++;
      console.error(`❌ [${r.viewport}] [${r.lang.toUpperCase()}] ${r.path} -> scrollWidth: ${r.scrollWidth}px > clientWidth: ${r.clientWidth}px`);
      console.error('   Overflowing sample:', JSON.stringify(r.topOverflowElements, null, 2));
    } else {
      console.log(`✅ [${r.viewport}] [${r.lang.toUpperCase()}] ${r.path} -> Perfect fit (${r.clientWidth}px)`);
    }
  }

  console.log(`\nSummary: ${results.length - failures} passed, ${failures} failed.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
