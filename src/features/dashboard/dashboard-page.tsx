import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/mocks/api";
import {
  selectExpenseTotal,
  selectIncomeTotal,
  selectOrderedTransactions,
  useAccountStore,
} from "@/stores/account-store";

import { BalanceCard } from "./components/balance-card";
import { TransactionList } from "./components/transaction-list";

export function DashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  const balance = useAccountStore((state) => state.balance);
  const transactions = useAccountStore(selectOrderedTransactions);
  const incomes = useAccountStore(selectIncomeTotal);
  const expenses = useAccountStore(selectExpenseTotal);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <BalanceCard balance={balance} incomes={incomes} expenses={expenses} />
        <div className="rounded-3xl border bg-white/90 p-6 shadow-fintech">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Visão geral</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Controle financeiro com fluxo direto.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A aplicação consolida o saldo global em Zustand e usa React Query para simular leitura e escrita de dados.
            O resultado é uma experiência rápida, consistente e simples de manter.
          </p>
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
