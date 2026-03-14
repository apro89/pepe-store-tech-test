import { test, expect, envConfig } from '@fixtures/test';

test.describe('Authentication flow', () => {
  test('logs in with valid credentials and reaches private area', async ({ joinNowPage, privateAreaPage }) => {
    await joinNowPage.gotoAndWait();
    await joinNowPage.signUp(envConfig.defaultEmail, envConfig.defaultPassword);
    await expect(privateAreaPage.getWelcomeText()).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ joinNowPage }) => {
    await joinNowPage.gotoAndWait();
    await joinNowPage.signUp(envConfig.defaultEmail, 'wrong-password');
    await expect(joinNowPage.getErrorAlert()).toBeVisible();
  });
});

