import { defineConfig } from '@playwright/test'

const PORT = 3002

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry'
  },
  /* Dev server runs in Docker (VC/docker-compose.yml, port 3002).
     No webServer block needed locally. CI can override via env. */
})
