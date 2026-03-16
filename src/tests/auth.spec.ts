import { test, expect, envConfig } from '@fixtures/test';
import { goToJoinNowAndSignUp } from '@helpers/authHelpers';

test.describe('Authentication flow', () => {

  test.describe('Signup flow', () => {
    test('successful signup with valid credentials reaches private area', async ({
      joinNowPage,
      privateAreaPage,
      page,
    }) => {
      await goToJoinNowAndSignUp(joinNowPage, envConfig.defaultEmail, envConfig.defaultPassword);
      await expect(privateAreaPage.getWelcomeText()).toBeVisible();
      await expect(privateAreaPage.getLogoutButton()).toBeVisible();
      await expect(privateAreaPage.getProductCards()).toHaveCount(12);
      await page.goto('/');
      await expect(privateAreaPage.getLogoutButton()).toBeVisible();
    });

    test.fixme('after signup, joinnow page shows Logout in header when logged in', async ({
      joinNowPage,
      privateAreaPage,
      page,
    }) => {
      await goToJoinNowAndSignUp(joinNowPage, envConfig.defaultEmail, envConfig.defaultPassword);
      await page.goto(joinNowPage.path);
      await expect(privateAreaPage.getLogoutButton()).toBeVisible();
    });

    test('successful signup with 7 days Trial plan reaches private area', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.selectTrialRow();
      await joinNowPage.signUp(envConfig.defaultEmail, envConfig.defaultPassword);
      await expect(privateAreaPage.getWelcomeText()).toBeVisible();
    });

    test('shows error on invalid credentials and message text', async ({ joinNowPage }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.defaultEmail, envConfig.wrongPassword);
      await expect(joinNowPage.getErrorAlert()).toBeVisible();
      await expect(joinNowPage.getErrorAlert()).toContainText(/invalid credentials/i);
    });
  });

  test.describe('Signup validation', () => {
    test('empty email shows error or blocks signup', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.fillPassword(envConfig.defaultPassword);
      await joinNowPage.submitSignUp();

      expect(await joinNowPage.isEmailValidityValueMissing()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
      await expect(joinNowPage.getEmailInput()).toHaveAttribute('required');
    });

    test('invalid email format shows validation or error', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailFormat, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();

      await expect(joinNowPage.getEmailInput()).toHaveAttribute('type', 'email');
    });

    test('invalid email without @ blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailNoAt, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test('invalid email without domain after @ (user@.com) blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailNoDomain, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
 
    });

    test('invalid email without local part (@example.com) blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailNoLocalPart, envConfig.defaultPassword);
      
      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test.fixme('invalid email with leading/trailing spaces blocks submit', async ({
      joinNowPage,
      privateAreaPage,
      page,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailWithSpaces, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(page).toHaveURL(/\/wellcome/);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test('invalid email with double @ blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailDoubleAt, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test.fixme('invalid email without dot in domain (user@examplecom) blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailNoDotInDomain, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();

    });

    test('invalid email without TLD (user@example.) blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailNoTld, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test.fixme('invalid email with dot before @ (user.@example.com) blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailDotBeforeAt, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test('invalid email with space in domain blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailSpaceInDomain, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test('invalid email with special chars in local part blocks submit', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.invalidEmailSpecialCharsInLocalPart, envConfig.defaultPassword);

      expect(await joinNowPage.isEmailValidityTypeMismatch()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();
    });

    test('empty password shows error or blocks signup', async ({
      joinNowPage,
      privateAreaPage,
    }) => {
      await joinNowPage.gotoAndWait();
      await joinNowPage.fillEmail(envConfig.defaultEmail);
      await joinNowPage.submitSignUp();

      await expect(privateAreaPage.getWelcomeText()).not.toBeVisible();
      await expect(joinNowPage.getSignUpButton()).toBeVisible();

      expect(await joinNowPage.isPasswordValidityValueMissing()).toBe(true);
      expect(await joinNowPage.isSignUpFormValid()).toBe(false);
      await expect(joinNowPage.getPasswordInput()).toHaveAttribute('required');
    });
  });

  test.describe('Plan price consistency', () => {
    test('Full access price is greater than Trial price', async ({ joinNowPage }) => {
      await joinNowPage.gotoAndWait();
      const fullPrice = await joinNowPage.getFullAccessPriceValue();
      const trialPrice = await joinNowPage.getTrialPriceValue();
      const fullNum = parseFloat(fullPrice);
      const trialNum = parseFloat(trialPrice);
      expect(fullNum).toBeGreaterThan(trialNum);
    });
  });

  test.describe('Terms and Privacy links', () => {
    test.fixme('Terms of Service link is present and navigates away from joinnow on click', async ({
      joinNowPage,
      page,
    }) => {
      await joinNowPage.gotoAndWait();
      const termsLink = joinNowPage.getTermsOfServiceLink();
      await expect(termsLink).toBeVisible();
      await termsLink.click();
      await expect(page).not.toHaveURL(/\/joinnow/);
    });

    test.fixme('Privacy Policy link is present and navigates away from joinnow on click', async ({
      joinNowPage,
      page,
    }) => {
      await joinNowPage.gotoAndWait();
      const privacyLink = joinNowPage.getPrivacyPolicyLink();
      await expect(privacyLink).toBeVisible();
      await privacyLink.click();
      await expect(page).not.toHaveURL(/\/joinnow/);
    });
  });

  test.describe('Security and robustness', () => {
    test('XSS in email is sanitized and no script execution', async ({
      joinNowPage,
      page,
    }) => {
      let dialogOpened = false;
      page.on('dialog', () => {
        dialogOpened = true;
      });
      await joinNowPage.gotoAndWait();
      await joinNowPage.signUp(envConfig.xssEmailPayload, envConfig.defaultPassword);
      expect(dialogOpened).toBe(false);
    });

    test.fixme('very long email triggers validation or error', async ({ joinNowPage }) => {
      await joinNowPage.gotoAndWait();
      const longEmail = 'a'.repeat(256) + '@test.com';
      await joinNowPage.signUp(longEmail, envConfig.defaultPassword);
      const errorVisible = await joinNowPage.getAlertMessage().isVisible();
      expect(errorVisible).toBe(true);
    });
  });
});
