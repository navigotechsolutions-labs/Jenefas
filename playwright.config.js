import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 2,
  timeout: 90000,
  use: { baseURL: 'http://localhost:3000', browserName: 'chromium', launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } },
  webServer: { command: 'npm start', url: 'http://localhost:3000', reuseExistingServer: false, timeout: 120000 },
});
