import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CurrencyCode } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
};

export const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AED: 'en-AE',
};

export const formatCurrency = (amount: number, currency: CurrencyCode = 'INR'): string => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const locale = CURRENCY_LOCALES[currency] || 'en-IN';
  const isINR = currency === 'INR';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: isINR ? 0 : 2,
    minimumFractionDigits: isINR ? 0 : 2,
  }).format(safeAmount);
};
