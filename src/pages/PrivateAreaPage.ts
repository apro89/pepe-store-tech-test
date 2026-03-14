import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class PrivateAreaPage extends BasePage {
  readonly path = '/wellcome';

  protected readonly welcomeText: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeText = page.getByText(/Welcome to the Magnificent Pepe Store!/i);
  }

  getWelcomeText(): Locator {
    return this.welcomeText;
  }
}

