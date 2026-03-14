export class EnvConfig {
  readonly baseUrl: string;
  readonly defaultEmail: string;
  readonly defaultPassword: string;
  readonly usCountryCode: string;
  readonly euCountryCode: string;
  readonly currencyHeaderName: string;

  constructor(env: NodeJS.ProcessEnv) {
    this.baseUrl = env.E2E_BASE_URL || 'http://localhost:3002';
    this.defaultEmail = env.E2E_DEFAULT_EMAIL || 'admin@test.com';
    this.defaultPassword = env.E2E_DEFAULT_PASSWORD || 'admin';
    this.usCountryCode = env.E2E_US_COUNTRY_CODE || 'US';
    this.euCountryCode = env.E2E_EU_COUNTRY_CODE || 'DE';
    this.currencyHeaderName = env.E2E_CURRENCY_HEADER_NAME || 'x-country';
  }
}

export const envConfig = new EnvConfig(process.env);

