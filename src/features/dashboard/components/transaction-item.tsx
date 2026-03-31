import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

import { TransactionStatusBadge } from "./transaction-status-badge";

interface TransactionItemProps {
  transaction: Transaction;
  onSelect: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onSelect }: TransactionItemProps) {
  const isExpense = transaction.type === "expense";

  return (
    <button
      type="button"
      onClick={() => onSelect(transaction)}
      className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            isExpense ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600",
          )}
        >
          {isExpense ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{transaction.recipientName}</p>
          <p className="mt-1 truncate text-sm text-slate-600">
            {transaction.description || "Sem descrição"}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>

      <div className="flex w-full shrink-0 items-center justify-between gap-4 sm:w-[168px] sm:justify-end">
        <div className="shrink-0">
          <TransactionStatusBadge status={transaction.status} />
        </div>
        <p
          className={cn(
            "w-[96px] shrink-0 text-right text-base font-bold",
            isExpense ? "text-rose-600" : "text-emerald-600",
          )}
        >
          {isExpense ? "-" : "+"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </button>
  );
}
