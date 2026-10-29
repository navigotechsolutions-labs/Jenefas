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

  console.log('--- AUDITING TAMIL ON IPHONE SE (320px x 667px) ---');

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.selectOption('#siteLanguage', 'ta');
  await page.waitForTimeout(300);

  // Check card buttons in Tamil
  const cardButtons = await page.evaluate(() => {
    const card = document.querySelector('#productGrid > div');
    if (!card) return null;
    const actions = card.querySelectorAll('a, button');
    return Array.from(actions).map(a => ({
      text: a.innerText.trim(),
      width: Math.round(a.getBoundingClientRect().width),
      height: Math.round(a.getBoundingClientRect().height),
      scrollWidth: a.scrollWidth,
      scrollHeight: a.scrollHeight
    }));
  });
  console.log('Product Card Buttons in Tamil on 320px:', cardButtons);

  // Open RFQ Modal in Tamil
  await page.evaluate(() => { if (window.openRfqModal) window.openRfqModal(); });
  await page.waitForTimeout(200);
  const rfqBox = await page.locator('#rfqModal > div').boundingBox();
  console.log('Homepage RFQ Modal in Tamil:', rfqBox);

  // Check if inputs in RFQ Modal overlap or clip
  const rfqInputs = await page.evaluate(() => {
    const form = document.querySelector('#rfqForm');
    if (!form) return [];
    const inputs = form.querySelectorAll('input, select, textarea');
    return Array.from(inputs).map(inp => ({
      id: inp.id,
      width: Math.round(inp.getBoundingClientRect().width),
      height: Math.round(inp.getBoundingClientRect().height)
    }));
  });
  console.log('RFQ Modal inputs:', rfqInputs);

  await browser.close();
  if (serverProc) serverProc.kill();
}

main().catch(console.error);
