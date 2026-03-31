import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

interface BalanceCardProps {
  balance: number;
  incomes: number;
  expenses: number;
}

export function BalanceCard({ balance, incomes, expenses }: BalanceCardProps) {
  return (
    <Card className="border-white/80 bg-slate-950 text-white">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <p className="text-sm font-medium text-slate-300">Saldo disponível</p>
          <CardTitle className="mt-2 text-4xl">{formatCurrency(balance)}</CardTitle>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <Wallet className="h-6 w-6 text-sky-300" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ArrowUpRight className="h-4 w-4 text-emerald-300" />
            Entradas
          </div>
          <p className="mt-2 text-xl font-bold text-emerald-300">{formatCurrency(incomes)}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ArrowDownRight className="h-4 w-4 text-rose-300" />
            Saídas
          </div>
          <p className="mt-2 text-xl font-bold text-rose-300">{formatCurrency(expenses)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
