import type {
  CurrencyBalances,
  CurrencyCode,
  TransferScope,
  TransferSettlementType,
} from "@/types/currency";

const baseRatesInBrl: Record<CurrencyCode, number> = {
  BRL: 1,
  USD: 5.08,
  EUR: 5.54,
};

const currencyLabels: Record<CurrencyCode, string> = {
  BRL: "Real brasileiro",
  USD: "Dólar americano",
  EUR: "Euro",
};

interface TransferQuoteInput {
  amount: number;
  sourceCurrency: CurrencyCode;
  destinationCurrency: CurrencyCode;
  settlementType: TransferSettlementType;
}

export interface TransferQuote {
  exchangeRate: number;
  grossDestinationAmount: number;
  feePercentage: number;
  feeAmount: number;
  receivedAmount: number;
  scope: TransferScope;
  processingLabel: string;
}

export function getCurrencyLabel(currency: CurrencyCode) {
  return currencyLabels[currency];
}

export function getExchangeRate(from: CurrencyCode, to: CurrencyCode) {
  if (from === to) {
    return 1;
  }

  return Number((baseRatesInBrl[from] / baseRatesInBrl[to]).toFixed(6));
}

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode) {
  return Number((amount * getExchangeRate(from, to)).toFixed(2));
}

export function convertBalancesToCurrency(balances: CurrencyBalances, targetCurrency: CurrencyCode) {
  return (Object.entries(balances) as Array<[CurrencyCode, number]>).reduce((total, [currency, amount]) => {
    return total + convertCurrency(amount, currency, targetCurrency);
  }, 0);
}

export function getTransferQuote({
  amount,
  sourceCurrency,
  destinationCurrency,
  settlementType,
}: TransferQuoteInput): TransferQuote {
  const exchangeRate = getExchangeRate(sourceCurrency, destinationCurrency);
  const grossDestinationAmount = convertCurrency(amount, sourceCurrency, destinationCurrency);
  const scope: TransferScope =
    settlementType === "crypto"
      ? "crypto"
      : sourceCurrency === destinationCurrency
        ? "local"
        : "international";
  const feePercentage =
    settlementType === "crypto" ? 0.0065 : sourceCurrency === destinationCurrency ? 0 : 0.0125;
  const feeAmount = Number((grossDestinationAmount * feePercentage).toFixed(2));
  const receivedAmount = Number((grossDestinationAmount - feeAmount).toFixed(2));
  const processingLabel =
    settlementType === "crypto"
      ? "Rede cripto • confirmação em até 5 min"
      : sourceCurrency === destinationCurrency
        ? "Liquidação local instantânea"
        : "Liquidação internacional em até 30 min";

  return {
    exchangeRate,
    grossDestinationAmount,
    feePercentage,
    feeAmount,
    receivedAmount,
    scope,
    processingLabel,
  };
}
