/**
 * Currency utility functions for formatting Indian Rupee (INR - ₹)
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Formats a numeric amount as Indian Rupees (₹)
 * e.g., formatCurrency(125000) => "₹1,25,000" or "₹125,000"
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  options?: {
    decimals?: number;
    compact?: boolean;
    showSymbol?: boolean;
  }
): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return options?.showSymbol !== false ? `${CURRENCY_SYMBOL}0` : '0';
  }

  const num = Number(amount);
  const decimals = options?.decimals ?? 0;
  const showSymbol = options?.showSymbol !== false;

  if (options?.compact) {
    if (Math.abs(num) >= 10000000) {
      return `${showSymbol ? CURRENCY_SYMBOL : ''}${(num / 10000000).toFixed(decimals > 0 ? decimals : 1)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `${showSymbol ? CURRENCY_SYMBOL : ''}${(num / 100000).toFixed(decimals > 0 ? decimals : 1)} Lakh`;
    }
    if (Math.abs(num) >= 1000) {
      return `${showSymbol ? CURRENCY_SYMBOL : ''}${(num / 1000).toFixed(decimals > 0 ? decimals : 1)}k`;
    }
  }

  const formattedNum = decimals > 0
    ? num.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : num.toLocaleString('en-IN');

  return showSymbol ? `${CURRENCY_SYMBOL}${formattedNum}` : formattedNum;
}

/**
 * Formats a daily rental price
 * e.g., formatDailyRate(120) => "₹120/day" or "₹120 / day"
 */
export function formatDailyRate(rate: number | string | undefined | null, space = false): string {
  const formatted = formatCurrency(rate);
  return `${formatted}${space ? ' / day' : '/day'}`;
}
