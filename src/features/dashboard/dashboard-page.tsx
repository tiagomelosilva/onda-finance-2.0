import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { convertCurrency } from "@/lib/exchange";
import { formatCurrency } from "@/lib/formatters";
import { getDashboardData } from "@/mocks/api";
import { selectOrderedTransactions, useAccountStore } from "@/stores/account-store";

import { BalanceCard } from "./components/balance-card";
import { TransactionList } from "./components/transaction-list";

export function DashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  const balances = useAccountStore((state) => state.balances);
  const selectedCurrency = useAccountStore((state) => state.selectedCurrency);
  const setSelectedCurrency = useAccountStore((state) => state.setSelectedCurrency);
  const transactions = useAccountStore(selectOrderedTransactions);

  const incomes = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + convertCurrency(transaction.amount, transaction.currency, selectedCurrency), 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + convertCurrency(transaction.amount, transaction.currency, selectedCurrency), 0);

  const localCount = transactions.filter((transaction) => transaction.scope === "local").length;
  const internationalCount = transactions.filter((transaction) => transaction.scope === "international").length;
  const cryptoCount = transactions.filter((transaction) => transaction.scope === "crypto").length;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <BalanceCard
          balances={balances}
          selectedCurrency={selectedCurrency}
          incomes={incomes}
          expenses={expenses}
          onSelectCurrency={setSelectedCurrency}
        />
        <div className="rounded-3xl border bg-white/90 p-6 shadow-fintech">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Visão geral</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Pagamentos globais com trilhos fiat e crypto.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A conta agora simula saldos multi-moeda, conversão cambial mockada e transferências internacionais
            sem perder a simplicidade do fluxo original.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatPill label="Local" value={`${localCount} transações`} variant="success" />
            <StatPill label="Internacional" value={`${internationalCount} transações`} />
            <StatPill label="Crypto" value={`${cryptoCount} transações`} variant="warning" />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Saldo base em BRL</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrency(balances.BRL, "BRL")}</p>
          </div>

          <Button asChild className="mt-6 w-full sm:w-auto">
            <Link to="/transfer">
              Nova transferência
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <TransactionList transactions={transactions} isLoading={dashboardQuery.isLoading} />
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning";
}

function StatPill({ label, value, variant = "default" }: StatPillProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <Badge variant={variant}>{label}</Badge>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
