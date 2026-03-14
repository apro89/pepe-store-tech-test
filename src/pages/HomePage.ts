import { BasePage } from './BasePage';
import { Locator, Page } from '@playwright/test';

export class HomePage extends BasePage {
  readonly path = '/';

  constructor(page: Page) {
    super(page);
  }

  getProductPriceLocator(pattern: RegExp): Locator {
    return this.getByText(pattern);
  }
}

