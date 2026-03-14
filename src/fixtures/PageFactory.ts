import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

/**
 * Centralizes page object creation (Factory pattern).
 * Use in fixtures so tests never instantiate pages directly.
 */
export class PageFactory {
  static create<T extends BasePage>(PageClass: new (page: Page) => T, page: Page): T {
    return new PageClass(page);
  }
}
