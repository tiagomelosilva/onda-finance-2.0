import { create } from "zustand";

import { initialAccountState } from "@/mocks/data";
import type { Transaction } from "@/types/transaction";

export interface CreateTransferInput {
  recipientName: string;
  email: string;
  amount: number;
  description?: string;
}

interface AccountState {
  balance: number;
  transactions: Transaction[];
  resetAccount: () => void;
  createTransfer: (input: CreateTransferInput) => Transaction;
}

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(
    (current, next) =>
      new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime(),
  );
}

export const useAccountStore = create<AccountState>()((set, get) => ({
  balance: initialAccountState.balance,
  transactions: sortTransactions(initialAccountState.transactions),
  resetAccount: () =>
    set({
      balance: initialAccountState.balance,
      transactions: sortTransactions(initialAccountState.transactions),
    }),
  createTransfer: (input) => {
    const { balance, transactions } = get();

    if (input.amount <= 0) {
      throw new Error("O valor precisa ser maior que zero.");
    }

    if (input.amount > balance) {
      throw new Error("Saldo insuficiente para concluir a transferência.");
    }

    const transaction: Transaction = {
      id: `trx-${Date.now()}`,
      recipientName: input.recipientName,
      email: input.email,
      amount: input.amount,
      description: input.description,
      type: "expense",
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    set({
      balance: Number((balance - input.amount).toFixed(2)),
      transactions: sortTransactions([transaction, ...transactions]),
    });

    return transaction;
  },
}));

export const selectOrderedTransactions = (state: AccountState) =>
  state.transactions;

export const selectIncomeTotal = (state: AccountState) =>
  state.transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

export const selectExpenseTotal = (state: AccountState) =>
  state.transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
