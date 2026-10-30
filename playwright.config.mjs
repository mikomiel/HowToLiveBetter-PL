import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  retries: 0,
  timeout: 15000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:8765', browserName: 'chromium' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: 'firefox', use: { browserName: 'firefox', viewport: { width: 1280, height: 900 } } },
    { name: 'webkit', use: { browserName: 'webkit', viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: 'python3 -u -m http.server 8765 --bind 127.0.0.1',
    // Start our own server before probing HTTP. Closed loopback ports can be dropped.
    wait: { stdout: /Serving HTTP on 127\.0\.0\.1 port 8765/ },
    timeout: 10000,
  },
});
