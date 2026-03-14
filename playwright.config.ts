import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3002';
const CURRENCY_HEADER_NAME = process.env.E2E_CURRENCY_HEADER_NAME || 'x-country';
const US_COUNTRY = process.env.E2E_US_COUNTRY_CODE || 'US';
const EU_COUNTRY = process.env.E2E_EU_COUNTRY_CODE || 'DE';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'chromium-us',
      use: {
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          [CURRENCY_HEADER_NAME]: US_COUNTRY,
        },
      },
    },
  ],
});

