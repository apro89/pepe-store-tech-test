import { test, expect, envConfig } from '@fixtures/test';
import { PageFactory } from '@fixtures/PageFactory';
import { JoinNowPage } from '@pages/JoinNowPage';
import { mapCountryToCurrency } from '@config';
import {
  createJoinNowPageWithCountry,
  openJoinNowWithCountry,
} from '@helpers/currencyContext';

test.describe('Currency switching by location', () => {

  test.describe('display by location', () => {
    test('displays USD in Full access and 7 days Trial for US country code', async ({ page, joinNowPage }) => {
    const currency = mapCountryToCurrency(envConfig.usCountryCode);

    await openJoinNowWithCountry(page, joinNowPage, envConfig.usCountryCode);
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
  });

  test('currency symbol changes but price value stays the same', async ({ page, browser }) => {
    const joinNowEU = PageFactory.create(JoinNowPage, page);

    await openJoinNowWithCountry(page, joinNowEU, envConfig.euCountryCode);
    const priceValueEU = await joinNowEU.getFullAccessPriceValue();
    const trialPriceValueEU = await joinNowEU.getTrialPriceValue();

    const { context: contextUS, joinNowPage: joinNowUS } = await createJoinNowPageWithCountry(
      browser,
      envConfig.usCountryCode,
    );
    const priceValueUS = await joinNowUS.getFullAccessPriceValue();
    const trialPriceValueUS = await joinNowUS.getTrialPriceValue();
    await contextUS.close();

    expect(priceValueEU).toBe(priceValueUS);
    expect(trialPriceValueEU).toBe(trialPriceValueUS);
  });

    test.fixme('displays EUR in Full access and 7 days Trial for EU country code', async ({
      page,
      joinNowPage,
    }) => {
      const currency = mapCountryToCurrency(envConfig.euCountryCode);

      await openJoinNowWithCountry(page, joinNowPage, envConfig.euCountryCode);
      await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
      await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
    });

    test.fixme('displays EUR in Full access and 7 days Trial for non-EU (and not US) country code', async ({
      page,
      joinNowPage,
    }) => {
      const currency = mapCountryToCurrency(envConfig.nonEuCountryCode);

      await openJoinNowWithCountry(page, joinNowPage, envConfig.nonEuCountryCode);
      await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
      await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
    });

    test.fixme('displays EUR in Full access and 7 days Trial when location header is missing', async ({
      page,
      joinNowPage,
    }) => {
      const currency = mapCountryToCurrency(undefined);

      await openJoinNowWithCountry(page, joinNowPage);
      await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
      await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
    });

    test.fixme('app works and falls back to EUR when location header has unknown value (header spoofing)', async ({
      page,
      joinNowPage,
    }) => {
      const unknownCountryCode = 'UNKNOWN';
      const currency = mapCountryToCurrency(unknownCountryCode);

      await openJoinNowWithCountry(page, joinNowPage, unknownCountryCode);
      await expect(joinNowPage.getPlanPriceSymbolInFullAccess(currency.symbol)).toBeVisible();
      await expect(joinNowPage.getPlanPriceSymbolInTrial(currency.symbol)).toBeVisible();
    });

  });

  test.describe('parallel users (isolation)', () => {
    test.fixme('parallel users should not affect each other - EU user is default', async ({ browser }) => {
    const euCurrency = mapCountryToCurrency(envConfig.euCountryCode);
    const usCurrency = mapCountryToCurrency(envConfig.usCountryCode);

    const { context: contextEU, joinNowPage: joinNowEU } = await createJoinNowPageWithCountry(
      browser,
      envConfig.euCountryCode,
    );
    await expect(joinNowEU.getPlanPriceSymbolInFullAccess(euCurrency.symbol)).toBeVisible();
    await expect(joinNowEU.getPlanPriceSymbolInTrial(euCurrency.symbol)).toBeVisible();

    const { context: contextUS, joinNowPage: joinNowUS } = await createJoinNowPageWithCountry(
      browser,
      envConfig.usCountryCode,
    );
    await expect(joinNowUS.getPlanPriceSymbolInFullAccess(usCurrency.symbol)).toBeVisible();
    await expect(joinNowUS.getPlanPriceSymbolInTrial(usCurrency.symbol)).toBeVisible();
    await contextUS.close();

    const uniqueSymbolsEU = await joinNowEU.getUniqueCurrencySymbols();
    expect(uniqueSymbolsEU).toHaveLength(1);
    expect(uniqueSymbolsEU[0]).toBe(euCurrency.symbol);
    await contextEU.close();
  });

  test.fixme('parallel users should not affect each other - US user is default', async ({
    browser,
  }) => {
    const usCurrency = mapCountryToCurrency(envConfig.usCountryCode);
    const euCurrency = mapCountryToCurrency(envConfig.euCountryCode);

    const { context: contextUS, joinNowPage: joinNowUS } = await createJoinNowPageWithCountry(
      browser,
      envConfig.usCountryCode,
    );
    await expect(joinNowUS.getPlanPriceSymbolInFullAccess(usCurrency.symbol)).toBeVisible();
    await expect(joinNowUS.getPlanPriceSymbolInTrial(usCurrency.symbol)).toBeVisible();

    const { context: contextEU, joinNowPage: joinNowEU } = await createJoinNowPageWithCountry(
      browser,
      envConfig.euCountryCode,
    );
    await expect(joinNowEU.getPlanPriceSymbolInFullAccess(euCurrency.symbol)).toBeVisible();
    await expect(joinNowEU.getPlanPriceSymbolInTrial(euCurrency.symbol)).toBeVisible();
    await contextEU.close();

    const uniqueSymbolsUS = await joinNowUS.getUniqueCurrencySymbols();
    expect(uniqueSymbolsUS).toHaveLength(1);
    expect(uniqueSymbolsUS[0]).toBe(usCurrency.symbol);
    await contextUS.close();
  });

  });

  test.describe('currency consistency (no mix)', () => {
    test('currency must not mix — all price elements use the same currency (US)', async ({
    page,
    joinNowPage,
  }) => {
    await openJoinNowWithCountry(page, joinNowPage, envConfig.usCountryCode);

    const uniqueSymbols = await joinNowPage.getUniqueCurrencySymbols();
    expect(uniqueSymbols).toHaveLength(1);
    expect(uniqueSymbols[0]).toBe(mapCountryToCurrency(envConfig.usCountryCode).symbol);
  });

    test.fixme('currency must not mix — all price elements use the same currency (EUR)', async ({
      page,
      joinNowPage,
    }) => {
      await openJoinNowWithCountry(page, joinNowPage, envConfig.euCountryCode);

      const uniqueSymbols = await joinNowPage.getUniqueCurrencySymbols();
      expect(uniqueSymbols).toHaveLength(1);
      expect(uniqueSymbols[0]).toBe(mapCountryToCurrency(envConfig.euCountryCode).symbol);
    });

  });

  test.describe('currency does not change after interaction', () => {
    test('currency should not change after page interaction', async ({
    page,
    joinNowPage,
  }) => {
    const usCurrency = mapCountryToCurrency(envConfig.usCountryCode);

    await openJoinNowWithCountry(page, joinNowPage, envConfig.usCountryCode);

    // By default "Full access" is selected; both rows show USD
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(usCurrency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(usCurrency.symbol)).toBeVisible();

    // User clicks "7 days Trial" and makes it active
    await joinNowPage.selectTrialRow();

    // Currency must remain USD — system must not change it on interaction
    const uniqueSymbols = await joinNowPage.getUniqueCurrencySymbols();
    expect(uniqueSymbols).toHaveLength(1);
    expect(uniqueSymbols[0]).toBe(usCurrency.symbol);
  });

  test('currency must stay consistent during session', async ({
    page,
    joinNowPage,
    homePage,
  }) => {
    const usCurrency = mapCountryToCurrency(envConfig.usCountryCode);

    await openJoinNowWithCountry(page, joinNowPage, envConfig.usCountryCode);
    await expect(joinNowPage.getPlanPriceSymbolInFullAccess(usCurrency.symbol)).toBeVisible();
    await expect(joinNowPage.getPlanPriceSymbolInTrial(usCurrency.symbol)).toBeVisible();

    await homePage.gotoAndWait();

    await joinNowPage.gotoAndWait();
    const uniqueSymbols = await joinNowPage.getUniqueCurrencySymbols();
    expect(uniqueSymbols).toHaveLength(1);
    expect(uniqueSymbols[0]).toBe(usCurrency.symbol);
  });

  });

  // In a typical app, Join Now would be unavailable after signup (session). Here it stays accessible, so we verify currency does not change when the user returns.
  test.describe('signup does not change currency', () => {
    test('signup does not change currency (US)', async ({ browser }) => {
    const usCurrency = mapCountryToCurrency(envConfig.usCountryCode);

    const { context: contextUS, joinNowPage: joinNowUS } = await createJoinNowPageWithCountry(
      browser,
      envConfig.usCountryCode,
    );
    await expect(joinNowUS.getPlanPriceSymbolInFullAccess(usCurrency.symbol)).toBeVisible();
    await expect(joinNowUS.getPlanPriceSymbolInTrial(usCurrency.symbol)).toBeVisible();

    await joinNowUS.signUp(envConfig.defaultEmail, envConfig.defaultPassword);

    await joinNowUS.gotoAndWait();
    const uniqueSymbols = await joinNowUS.getUniqueCurrencySymbols();
    expect(uniqueSymbols).toHaveLength(1);
    expect(uniqueSymbols[0]).toBe(usCurrency.symbol);
    await contextUS.close();
  });

  test.fixme('signup does not change currency (EU)', async ({ browser }) => {
    const euCurrency = mapCountryToCurrency(envConfig.euCountryCode);

    const { context: contextEU, joinNowPage: joinNowEU } = await createJoinNowPageWithCountry(
      browser,
      envConfig.euCountryCode,
    );
    await expect(joinNowEU.getPlanPriceSymbolInFullAccess(euCurrency.symbol)).toBeVisible();
    await expect(joinNowEU.getPlanPriceSymbolInTrial(euCurrency.symbol)).toBeVisible();

    await joinNowEU.signUp(envConfig.defaultEmail, envConfig.defaultPassword);

    await joinNowEU.gotoAndWait();
    const uniqueSymbols = await joinNowEU.getUniqueCurrencySymbols();
    expect(uniqueSymbols).toHaveLength(1);
    expect(uniqueSymbols[0]).toBe(euCurrency.symbol);
    await contextEU.close();
  });

  });
});

