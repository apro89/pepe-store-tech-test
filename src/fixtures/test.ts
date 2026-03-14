import { test as base, expect } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { JoinNowPage } from '@pages/JoinNowPage';
import { PrivateAreaPage } from '@pages/PrivateAreaPage';
import { PageFactory } from '@fixtures/PageFactory';
import { envConfig } from '@config/env';

type Pages = {
  homePage: HomePage;
  joinNowPage: JoinNowPage;
  privateAreaPage: PrivateAreaPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(PageFactory.create(HomePage, page));
  },
  joinNowPage: async ({ page }, use) => {
    await use(PageFactory.create(JoinNowPage, page));
  },
  privateAreaPage: async ({ page }, use) => {
    await use(PageFactory.create(PrivateAreaPage, page));
  },
});

export { expect, envConfig };

