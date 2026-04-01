import type { CurrencyCode } from "@/types/currency";

const currencyLocales: Record<CurrencyCode, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE",
};

export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCurrency(value: number, currency: CurrencyCode = "BRL") {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: "currency",
    currency,
  }).format(value);
}

export function formatCurrencyWithCode(value: number, currency: CurrencyCode) {
  return `${currency} ${formatCurrency(value, currency)}`;
}

export function formatPercentage(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatExchangeRate(from: CurrencyCode, to: CurrencyCode, rate: number) {
  return `1 ${from} = ${rate.toFixed(4)} ${to}`;
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}
