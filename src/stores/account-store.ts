import { create } from "zustand";

import { getTransferQuote } from "@/lib/exchange";
import { initialAccountState } from "@/mocks/data";
import type { CurrencyBalances, CurrencyCode, TransferSettlementType } from "@/types/currency";
import type { Transaction } from "@/types/transaction";

export interface CreateTransferInput {
  recipientName: string;
  email: string;
  amount: number;
  description?: string;
  sourceCurrency: CurrencyCode;
  destinationCurrency: CurrencyCode;
  settlementType: TransferSettlementType;
}

interface AccountState {
  balance: number;
  balances: CurrencyBalances;
  selectedCurrency: CurrencyCode;
  transactions: Transaction[];
  setSelectedCurrency: (currency: CurrencyCode) => void;
  resetAccount: () => void;
  createTransfer: (input: CreateTransferInput) => Transaction;
}

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(
    (current, next) => new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime(),
  );
}

export const useAccountStore = create<AccountState>()((set, get) => ({
  balance: initialAccountState.balance,
  balances: initialAccountState.balances,
  selectedCurrency: "BRL",
  transactions: sortTransactions(initialAccountState.transactions),
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  resetAccount: () =>
    set({
      balance: initialAccountState.balance,
      balances: initialAccountState.balances,
      selectedCurrency: "BRL",
      transactions: sortTransactions(initialAccountState.transactions),
    }),
  createTransfer: (input) => {
    const { balances, transactions } = get();

    if (input.amount <= 0) {
      throw new Error("O valor precisa ser maior que zero.");
    }

    if (input.amount > balances[input.sourceCurrency]) {
      throw new Error("Saldo insuficiente para concluir a transferência.");
    }

    const quote = getTransferQuote({
      amount: input.amount,
      sourceCurrency: input.sourceCurrency,
      destinationCurrency: input.destinationCurrency,
      settlementType: input.settlementType,
    });

    const transaction: Transaction = {
      id: `trx-${Date.now()}`,
      recipientName: input.recipientName,
      email: input.email,
      amount: input.amount,
      currency: input.sourceCurrency,
      description: input.description,
      type: "expense",
      status: input.settlementType === "crypto" ? "processing" : "completed",
      sourceAmount: input.amount,
      sourceCurrency: input.sourceCurrency,
      destinationAmount: quote.receivedAmount,
      destinationCurrency: input.destinationCurrency,
      exchangeRate: quote.exchangeRate,
      feePercentage: quote.feePercentage,
      settlementType: input.settlementType,
      scope: quote.scope,
      processingLabel: quote.processingLabel,
      createdAt: new Date().toISOString(),
    };

    const nextBalances: CurrencyBalances = {
      ...balances,
      [input.sourceCurrency]: Number((balances[input.sourceCurrency] - input.amount).toFixed(2)),
    };

    set({
      balance: nextBalances.BRL,
      balances: nextBalances,
      transactions: sortTransactions([transaction, ...transactions]),
    });

    return transaction;
  },
}));

export const selectOrderedTransactions = (state: AccountState) => state.transactions;
