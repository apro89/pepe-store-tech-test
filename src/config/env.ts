export class EnvConfig {
  readonly baseUrl: string;
  readonly defaultEmail: string;
  readonly defaultPassword: string;
  readonly wrongPassword: string;
  readonly invalidEmailFormat: string;
  readonly invalidEmailNoAt: string;
  readonly invalidEmailNoDomain: string;
  readonly invalidEmailNoLocalPart: string;
  readonly invalidEmailWithSpaces: string;
  readonly invalidEmailDoubleAt: string;
  readonly invalidEmailNoDotInDomain: string;
  readonly invalidEmailNoTld: string;
  readonly invalidEmailDotBeforeAt: string;
  readonly invalidEmailSpaceInDomain: string;
  readonly invalidEmailSpecialCharsInLocalPart: string;
  readonly xssEmailPayload: string;
  readonly usCountryCode: string;
  readonly euCountryCode: string;
  readonly nonEuCountryCode: string;
  readonly currencyHeaderName: string;

  constructor(env: NodeJS.ProcessEnv) {
    this.baseUrl = env.E2E_BASE_URL || 'http://localhost:3002';
    this.defaultEmail = env.E2E_DEFAULT_EMAIL || 'admin@test.com';
    this.defaultPassword = env.E2E_DEFAULT_PASSWORD || 'admin';
    this.wrongPassword = env.E2E_WRONG_PASSWORD || 'wrong-password';
    this.invalidEmailFormat = env.E2E_INVALID_EMAIL_FORMAT || 'test';
    this.invalidEmailNoAt = env.E2E_INVALID_EMAIL_NO_AT || 'userexample.com';
    this.invalidEmailNoDomain = env.E2E_INVALID_EMAIL_NO_DOMAIN || 'user@.com';
    this.invalidEmailNoLocalPart = env.E2E_INVALID_EMAIL_NO_LOCAL_PART || '@example.com';
    this.invalidEmailWithSpaces = env.E2E_INVALID_EMAIL_WITH_SPACES || ' user@example.com ';
    this.invalidEmailDoubleAt = env.E2E_INVALID_EMAIL_DOUBLE_AT || 'user@@example.com';
    this.invalidEmailNoDotInDomain = env.E2E_INVALID_EMAIL_NO_DOT_IN_DOMAIN || 'user@examplecom';
    this.invalidEmailNoTld = env.E2E_INVALID_EMAIL_NO_TLD || 'user@example.';
    this.invalidEmailDotBeforeAt = env.E2E_INVALID_EMAIL_DOT_BEFORE_AT || 'user.@example.com';
    this.invalidEmailSpaceInDomain = env.E2E_INVALID_EMAIL_SPACE_IN_DOMAIN || 'user@exam ple.com';
    this.invalidEmailSpecialCharsInLocalPart =
      env.E2E_INVALID_EMAIL_SPECIAL_CHARS_IN_LOCAL_PART || 'user<>@example.com';
    this.xssEmailPayload = env.E2E_XSS_EMAIL_PAYLOAD || '<script>alert(1)</script>';
    this.usCountryCode = env.E2E_US_COUNTRY_CODE || 'US';
    this.euCountryCode = env.E2E_EU_COUNTRY_CODE || 'DE';
    this.nonEuCountryCode = env.E2E_NON_EU_COUNTRY_CODE || 'GB';
    this.currencyHeaderName = env.E2E_CURRENCY_HEADER_NAME || 'x-country';
  }
}

export const envConfig = new EnvConfig(process.env);

