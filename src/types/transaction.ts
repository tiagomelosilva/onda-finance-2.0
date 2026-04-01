import type { CurrencyCode, TransferScope, TransferSettlementType } from "@/types/currency";

export type TransactionType = "income" | "expense";
export type TransactionStatus = "completed" | "processing";

export interface Transaction {
  id: string;
  recipientName: string;
  email: string;
  amount: number;
  currency: CurrencyCode;
  description?: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
  sourceAmount?: number;
  sourceCurrency?: CurrencyCode;
  destinationAmount?: number;
  destinationCurrency?: CurrencyCode;
  exchangeRate?: number;
  feePercentage?: number;
  settlementType?: TransferSettlementType;
  scope?: TransferScope;
  processingLabel?: string;
}
