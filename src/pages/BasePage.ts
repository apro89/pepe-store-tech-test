import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract readonly path: string;

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Override in subclasses to wait for page-ready state after navigation. */
  protected async waitForReady(): Promise<void> {}

  async gotoAndWait(): Promise<void> {
    await this.goto();
    await this.waitForReady();
  }

  protected getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }
}

