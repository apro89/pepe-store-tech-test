export type CurrencyCode = 'EUR' | 'USD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  textLabel: string;
}

export function mapCountryToCurrency(countryCode: string | undefined): CurrencyInfo {
  if (!countryCode) {
    return EUR;
  }

  const normalized = countryCode.toUpperCase();

  if (normalized === 'US' || normalized === 'USA') {
    return USD;
  }

  return EUR;
}

export const EUR: CurrencyInfo = {
  code: 'EUR',
  symbol: '€',
  textLabel: 'EUR',
};

export const USD: CurrencyInfo = {
  code: 'USD',
  symbol: '$',
  textLabel: 'USD',
};

