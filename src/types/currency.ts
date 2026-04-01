export const supportedCurrencies = ["BRL", "USD", "EUR"] as const;

export type CurrencyCode = (typeof supportedCurrencies)[number];

export type TransferSettlementType = "fiat" | "crypto";
export type TransferScope = "local" | "international" | "crypto";

export type CurrencyBalances = Record<CurrencyCode, number>;
