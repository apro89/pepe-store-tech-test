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

  getLogoutButton(): Locator {
    return this.page.getByRole('button', { name: /logout/i });
  }

  /** Locator for all product card labels (Product 0, Product 1, …). Use .count() for total. */
  getProductCards(): Locator {
    return this.page.getByText(/^Product \d+$/);
  }
}

