import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class JoinNowPage extends BasePage {
  readonly path = '/joinnow';

  protected readonly emailInput: Locator;
  protected readonly passwordInput: Locator;
  protected readonly signUpButton: Locator;
  protected readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByPlaceholder('m@example.com');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signUpButton = page.getByRole('button', { name: /sign up/i });
    this.errorAlert = page.getByRole('alert').filter({ hasText: /invalid credentials/i });
  }

  protected override async waitForReady(): Promise<void> {
    await this.emailInput.waitFor();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submitSignUp(): Promise<void> {
    await this.signUpButton.click();
  }

  async signUp(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submitSignUp();
  }

  getSignUpButton(): Locator {
    return this.signUpButton;
  }

  getEmailInput(): Locator {
    return this.emailInput;
  }

  getPasswordInput(): Locator {
    return this.passwordInput;
  }

  /** Whether the email field fails browser validation due to empty required field (valueMissing). */
  async isEmailValidityValueMissing(): Promise<boolean> {
    return this.emailInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
  }

  /** Whether the email field fails browser validation due to invalid format (typeMismatch for type="email"). */
  async isEmailValidityTypeMismatch(): Promise<boolean> {
    return this.emailInput.evaluate((el) => (el as HTMLInputElement).validity.typeMismatch);
  }

  /** Whether the password field fails browser validation due to empty required field (valueMissing). */
  async isPasswordValidityValueMissing(): Promise<boolean> {
    return this.passwordInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
  }

  /** The form that contains the sign-up controls. */
  getSignUpForm(): Locator {
    return this.page.locator('form').filter({ has: this.signUpButton }).first();
  }

  /** Whether the form passes HTML5 constraint validation (checkValidity()). */
  async isSignUpFormValid(): Promise<boolean> {
    return this.getSignUpForm().evaluate((form) => (form as HTMLFormElement).checkValidity());
  }

  getErrorAlert(): Locator {
    return this.errorAlert;
  }

  /** Client-side validation message for required/empty fields (e.g. "Please fill in this field."). */
  getRequiredFieldValidationMessage(): Locator {
    return this.page.getByText(/please fill in this field/i);
  }

  /** Generic alert (role=alert). Prefer getErrorAlert() or getRequiredFieldValidationMessage() when applicable. */
  getAlertMessage(): Locator {
    return this.page.locator('[role="alert"]:not(#__next-route-announcer__)').first();
  }

  getTermsOfServiceLink(): Locator {
    return this.page.getByRole('link', { name: /terms of service/i });
  }

  getPrivacyPolicyLink(): Locator {
    return this.page.getByRole('link', { name: /privacy policy/i });
  }

  /** Row/block that contains "Full access" only (and its price). */
  getFullAccessRow(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText('Full access') })
      .filter({ hasNot: this.page.getByText('7 days Trial') })
      .first();
  }

  /** Row/block that contains "7 days Trial" only (and its price). */
  getTrialRow(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText('7 days Trial') })
      .filter({ hasNot: this.page.getByText('Full access') })
      .first();
  }

  /** Symbol ($ or €) inside the Full access row only. */
  getPlanPriceSymbolInFullAccess(symbol: string): Locator {
    return this.getFullAccessRow().getByText(symbol);
  }

  /** Symbol ($ or €) inside the 7 days Trial row only. */
  getPlanPriceSymbolInTrial(symbol: string): Locator {
    return this.getTrialRow().getByText(symbol);
  }

  /** Numeric price value (e.g. "15.95") from the Full access row. */
  async getFullAccessPriceValue(): Promise<string> {
    const text = await this.getFullAccessRow().textContent();
    const match = text?.match(/\d+\.\d+/);
    return match ? match[0] : '';
  }

  /** Numeric price value (e.g. "4.95") from the 7 days Trial row. */
  async getTrialPriceValue(): Promise<string> {
    const text = await this.getTrialRow().textContent();
    const match = text?.match(/\d+\.\d+/);
    return match ? match[0] : '';
  }

  /** All price rows (Full access and 7 days Trial). Used to assert currency does not mix. */
  getAllPriceRows(): Locator[] {
    return [this.getFullAccessRow(), this.getTrialRow()];
  }

  /** Returns the currency symbol displayed in the given price row ('$' or '€'). */
  async getCurrencySymbolInRow(row: Locator): Promise<string> {
    const hasDollar = await row.getByText('$').isVisible();
    return hasDollar ? '$' : '€';
  }

  /** Returns unique currency symbols displayed in all price rows (Full access and 7 days Trial). */
  async getUniqueCurrencySymbols(): Promise<string[]> {
    const symbols = await Promise.all(
      this.getAllPriceRows().map((row) => this.getCurrencySymbolInRow(row)),
    );
    return [...new Set(symbols)];
  }

  /** Clicks the "Full access" row to make it the active/selected plan. */
  async selectFullAccessRow(): Promise<void> {
    await this.getFullAccessRow().click();
  }

  /** Clicks the "7 days Trial" row to make it the active/selected plan. */
  async selectTrialRow(): Promise<void> {
    await this.getTrialRow().click();
  }
}

