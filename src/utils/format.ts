import { CURRENCY_CODE, CURRENCY_LOCALE } from "@/constants/finance";

/** Rp 1.500.000 */
export function formatCurrency(value: number, options?: { signed?: boolean }) {
  const formatted = new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  const compacted = formatted.replace(/\s+/g, "");

  if (!options?.signed) return compacted;
  return `${value < 0 ? "−" : "+"}${compacted}`;
}

/** Rp 5,8 jt — compact form used inside charts and tight cards. */
export function formatCompactCurrency(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  if (abs >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
  if (abs >= 1_000) return `Rp ${Math.round(value / 1_000)}rb`;
  return `Rp ${value}`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(CURRENCY_LOCALE).format(value);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat(CURRENCY_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(new Date(`${iso}T00:00:00`));
}

export function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat(CURRENCY_LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}
