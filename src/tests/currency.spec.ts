import { test, expect, envConfig } from '@fixtures/test';
import { PageFactory } from '@fixtures/PageFactory';
import { JoinNowPage } from '@pages/JoinNowPage';
import { mapCountryToCurrency } from '@config';

test.describe('Currency switching by location', () => {

  test('displays USD in Full access and 7 days Trial for US users', async ({ page, joinNowPage }) => {
    const currency = mapCountryToCurrency(envConfig.usCountryCode);

    await page.context().setExtraHTTPHeaders({
      [envConfig.currencyHeaderName]: envConfig.usCountryCode,
    });

    await joinNowPage.gotoAndWait();
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
  });

  test('currency symbol changes but price value stays the same', async ({ page, browser }) => {
    const joinNowEU = PageFactory.create(JoinNowPage, page);

    await page.context().setExtraHTTPHeaders({
      [envConfig.currencyHeaderName]: envConfig.euCountryCode,
    });
    await joinNowEU.gotoAndWait();
    const priceValueEU = await joinNowEU.getFullAccessPriceValue();
    const trialPriceValueEU = await joinNowEU.getTrialPriceValue();

    const contextUS = await browser.newContext({
      baseURL: envConfig.baseUrl,
      extraHTTPHeaders: {
        [envConfig.currencyHeaderName]: envConfig.usCountryCode,
      },
    });
    const pageUS = await contextUS.newPage();
    const joinNowUS = PageFactory.create(JoinNowPage, pageUS);
    await joinNowUS.gotoAndWait();
    const priceValueUS = await joinNowUS.getFullAccessPriceValue();
    const trialPriceValueUS = await joinNowUS.getTrialPriceValue();
    await contextUS.close();

    expect(priceValueEU).toBe(priceValueUS);
    expect(trialPriceValueEU).toBe(trialPriceValueUS);
  });

  test('currency must not mix — all price elements use the same currency (US)', async ({
    page,
    joinNowPage,
  }) => {
    await page.context().setExtraHTTPHeaders({
      [envConfig.currencyHeaderName]: envConfig.usCountryCode,
    });

    await joinNowPage.gotoAndWait();

    const symbols = await Promise.all(
      joinNowPage.getAllPriceRows().map((row) => joinNowPage.getCurrencySymbolInRow(row)),
    );
    const uniqueSymbols = [...new Set(symbols)];

    expect(uniqueSymbols).toHaveLength(1);
    expect(uniqueSymbols[0]).toBe(mapCountryToCurrency(envConfig.usCountryCode).symbol);
  });

  test.fixme('currency must not mix — all price elements use the same currency (EUR)', async ({
    page,
    joinNowPage,
  }) => {
    await page.context().setExtraHTTPHeaders({
      [envConfig.currencyHeaderName]: envConfig.euCountryCode,
    });

    await joinNowPage.gotoAndWait();

    const symbols = await Promise.all(
      joinNowPage.getAllPriceRows().map((row) => joinNowPage.getCurrencySymbolInRow(row)),
    );
    const uniqueSymbols = [...new Set(symbols)];

    expect(uniqueSymbols).toHaveLength(1);
    expect(uniqueSymbols[0]).toBe(mapCountryToCurrency(envConfig.euCountryCode).symbol);
  });

  test.fixme('displays EUR in Full access and 7 days Trial for EU country code', async ({
    page,
    joinNowPage,
  }) => {
    const currency = mapCountryToCurrency(envConfig.euCountryCode);

    await page.context().setExtraHTTPHeaders({
      [envConfig.currencyHeaderName]: envConfig.euCountryCode,
    });

    await joinNowPage.gotoAndWait();
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
  });

  test.fixme('displays EUR in Full access and 7 days Trial for non-EU (and not US) country code', async ({
    page,
    joinNowPage,
  }) => {
    const currency = mapCountryToCurrency(envConfig.nonEuCountryCode);

    await page.context().setExtraHTTPHeaders({
      [envConfig.currencyHeaderName]: envConfig.nonEuCountryCode,
    });

    await joinNowPage.gotoAndWait();
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
  });

  test.fixme('displays EUR in Full access and 7 days Trial when location header is missing', async ({
    page,
    joinNowPage,
  }) => {
    const currency = mapCountryToCurrency(undefined);

    await page.context().setExtraHTTPHeaders({});

    await joinNowPage.gotoAndWait();
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
  });

  test.fixme('app works and falls back to EUR when location header has unknown value (header spoofing)', async ({
    page,
    joinNowPage,
  }) => {
    const unknownCountryCode = 'UNKNOWN';
    const currency = mapCountryToCurrency(unknownCountryCode);

    await page.context().setExtraHTTPHeaders({
      [envConfig.currencyHeaderName]: unknownCountryCode,
    });

    await joinNowPage.gotoAndWait();
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
  });
});

