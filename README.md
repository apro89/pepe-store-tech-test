# E2E Tests

Playwright end-to-end tests for the application (technical-test-apro89). TypeScript, Page Object Model, and shared helpers for maintainable and reusable test code.

## Requirements

- **Node.js 18+**
- Application under test running (default: `http://localhost:3002`)

## Setup

```bash
npm install
```

## Configuration

Settings are read from environment variables. Create a `.env` file in the project root or set variables in the shell.

| Variable | Description | Default |
|----------|-------------|---------|
| `E2E_BASE_URL` | Application URL | `http://localhost:3002` |
| `E2E_DEFAULT_EMAIL` | Default test user email | `admin@test.com` |
| `E2E_DEFAULT_PASSWORD` | Default test user password | `admin` |
| `E2E_US_COUNTRY_CODE` | Country code for US | `US` |
| `E2E_EU_COUNTRY_CODE` | Country code for EU | `DE` |
| `E2E_NON_EU_COUNTRY_CODE` | Non-EU country code (e.g. GB) | `GB` |
| `E2E_CURRENCY_HEADER_NAME` | HTTP header name for location/country | `x-country` |

Playwright config (`playwright.config.ts`) also loads `.env` for base URL and project-level headers.

## Running tests

```bash
# Run all tests (headless)
npm test

# Run with browser visible
npm run test:headed

# Interactive UI mode
npm run test:ui
```

Run a specific file or test:

```bash
npx playwright test currency.spec.ts
npx playwright test currency.spec.ts -g "displays USD"
```

## Project structure

```
src/
├── config/          # Env config, currency mapping
├── fixtures/        # Playwright fixtures, PageFactory
├── helpers/         # Test helpers (e.g. currency context)
├── pages/           # Page Object classes (BasePage, JoinNowPage, etc.)
└── tests/           # Spec files (currency.spec.ts, auth.spec.ts)
```

- **Page Object Model**: Each screen is a class with locators and actions; tests use page methods and keep assertions in the spec.
- **Fixtures**: `test` is extended with `homePage`, `joinNowPage`, `privateAreaPage`; pages are created via `PageFactory`.
- **Helpers**: Shared setup (e.g. `openJoinNowWithCountry`, `createJoinNowPageWithCountry`) to avoid duplication.

## Test suites

### Currency (`currency.spec.ts`)

Tests use the `x-country` HTTP header to simulate user location.

**display by location**

- displays USD in Full access and 7 days Trial for US country code — with US header, both plan rows show the dollar symbol.
- currency symbol changes but price value stays the same — when switching EU/US, numeric price values are equal; only the currency symbol ($/€) changes.
- displays EUR in Full access and 7 days Trial for EU country code *(fixme)* — with EU header, both plan rows show the euro symbol.
- displays EUR in Full access and 7 days Trial for non-EU (and not US) country code *(fixme)* — with non-EU header (e.g. GB), both plan rows show euro.
- displays EUR in Full access and 7 days Trial when location header is missing *(fixme)* — when the header is absent, the app shows euro (fallback).
- app works and falls back to EUR when location header has unknown value (header spoofing) *(fixme)* — when the header has an unknown value, the app shows euro.

**parallel users (isolation)**

- parallel users should not affect each other - EU user is default *(fixme)* — EU opens the page, then US opens; EU still sees EUR (data isolation).
- parallel users should not affect each other - US user is default *(fixme)* — US opens the page, then EU opens; US still sees USD (data isolation).

**currency consistency (no mix)**

- currency must not mix — all price elements use the same currency (US) — all price rows show the same currency (USD).
- currency must not mix — all price elements use the same currency (EUR) *(fixme)* — all price rows show the same currency (EUR).

**currency does not change after interaction**

- currency should not change after page interaction — US user opens the page, clicks "7 days Trial"; currency remains USD.
- currency must stay consistent during session — US user opens Join Now, navigates away and back; currency remains USD.

**signup does not change currency**

> **Note:** In a typical application these tests would not apply: after signup a session is created and the Join Now form/page would no longer be available to the user. In this project the Join Now page remains accessible after signup, so the tests are included to verify that currency does not change when the user returns to that page.

- signup does not change currency (US) — US user opens the page, signs up; currency remains USD after signup.
- signup does not change currency (EU) *(fixme)* — EU user opens the page, signs up; currency remains EUR after signup.

---

- **Auth** (`auth.spec.ts`): Authentication-related flows.

## Path aliases (tsconfig)

- `@config` / `@config/*` — config
- `@pages/*` — page classes
- `@fixtures/*` — fixtures
- `@helpers/*` — helpers
- `@tests/*` — tests
