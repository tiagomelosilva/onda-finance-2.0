import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatExchangeRate, formatPercentage } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

import { TransactionStatusBadge } from "./transaction-status-badge";

interface TransactionItemProps {
  transaction: Transaction;
  onSelect: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onSelect }: TransactionItemProps) {
  const isExpense = transaction.type === "expense";
  const sourceCurrency = transaction.sourceCurrency ?? transaction.currency;
  const destinationCurrency = transaction.destinationCurrency ?? transaction.currency;
  const sourceAmount = transaction.sourceAmount ?? transaction.amount;
  const destinationAmount = transaction.destinationAmount ?? transaction.amount;

  return (
    <button
      type="button"
      onClick={() => onSelect(transaction)}
      className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold text-slate-900">{transaction.recipientName}</p>
              {transaction.scope ? (
                <Badge variant={transaction.scope === "crypto" ? "warning" : transaction.scope === "international" ? "default" : "success"}>
                  {transaction.scope === "crypto" ? "Crypto" : transaction.scope === "international" ? "Internacional" : "Local"}
                </Badge>
              ) : null}
              {transaction.settlementType === "crypto" ? <Badge variant="warning">Via crypto</Badge> : null}
            </div>
            <p className="mt-1 truncate text-sm text-slate-600">{transaction.description || "Sem descrição"}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{formatDate(transaction.createdAt)}</p>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center justify-between gap-4 lg:w-[188px] lg:justify-end">
          <div className="shrink-0">
            <TransactionStatusBadge status={transaction.status} />
          </div>
          <p
            className={cn(
              "text-right text-base font-bold",
              isExpense ? "text-rose-600" : "text-emerald-600",
            )}
          >
            {isExpense ? "-" : "+"}
            {formatCurrency(transaction.amount, transaction.currency)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 md:grid-cols-[1.2fr,1fr,1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Conversão</p>
          <p className="mt-1 font-medium">
            {formatCurrency(sourceAmount, sourceCurrency)} → {formatCurrency(destinationAmount, destinationCurrency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Taxa aplicada</p>
          <p className="mt-1 font-medium">
            {transaction.exchangeRate
              ? formatExchangeRate(sourceCurrency, destinationCurrency, transaction.exchangeRate)
              : "1:1"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Liquidação</p>
          <p className="mt-1 font-medium">
            {transaction.feePercentage ? `${formatPercentage(transaction.feePercentage)} • ` : ""}
            {transaction.processingLabel || "Liquidação local instantânea"}
          </p>
        </div>
      </div>
    </button>
  );
}
