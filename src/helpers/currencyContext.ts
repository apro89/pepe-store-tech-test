import { Browser, BrowserContext, Page } from '@playwright/test';
import { PageFactory } from '@fixtures/PageFactory';
import { JoinNowPage } from '@pages/JoinNowPage';
import { envConfig } from '@config/env';

/**
 * Sets the country header on the current context and navigates to Join Now page.
 * Use when the test uses the default page/joinNowPage fixture.
 * @param countryCode - When undefined, no currency header is set (empty headers).
 */
export async function openJoinNowWithCountry(
  page: Page,
  joinNowPage: JoinNowPage,
  countryCode?: string,
): Promise<void> {
  await page.context().setExtraHTTPHeaders(
    countryCode !== undefined
      ? { [envConfig.currencyHeaderName]: countryCode }
      : {},
  );
  await joinNowPage.gotoAndWait();
}

/**
 * Creates a new browser context with the given country header, opens Join Now page,
 * and returns the context and JoinNowPage. Caller is responsible for closing the context.
 */
export async function createJoinNowPageWithCountry(
  browser: Browser,
  countryCode: string,
): Promise<{ context: BrowserContext; joinNowPage: JoinNowPage }> {
  const context = await browser.newContext({
    baseURL: envConfig.baseUrl,
    extraHTTPHeaders: {
      [envConfig.currencyHeaderName]: countryCode,
    },
  });
  const page = await context.newPage();
  const joinNowPage = PageFactory.create(JoinNowPage, page);
  await joinNowPage.gotoAndWait();
  return { context, joinNowPage };
}
