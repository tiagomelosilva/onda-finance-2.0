import { ArrowDownRight, ArrowLeftRight, ArrowUpRight, Coins, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertBalancesToCurrency } from "@/lib/exchange";
import { formatCurrency } from "@/lib/formatters";
import type { CurrencyBalances, CurrencyCode } from "@/types/currency";

interface BalanceCardProps {
  balances: CurrencyBalances;
  selectedCurrency: CurrencyCode;
  incomes: number;
  expenses: number;
  onSelectCurrency: (currency: CurrencyCode) => void;
}

const currencies: CurrencyCode[] = ["BRL", "USD", "EUR"];

export function BalanceCard({
  balances,
  selectedCurrency,
  incomes,
  expenses,
  onSelectCurrency,
}: BalanceCardProps) {
  const visibleBalance = balances[selectedCurrency];
  const consolidatedBalance = convertBalancesToCurrency(balances, selectedCurrency);

  return (
    <Card className="border-white/80 bg-slate-950 text-white">
      <CardHeader className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Saldo disponível</p>
            <CardTitle className="mt-2 text-4xl">{formatCurrency(visibleBalance, selectedCurrency)}</CardTitle>
            <p className="mt-2 text-sm text-slate-300">
              Consolidado em {selectedCurrency}: {formatCurrency(consolidatedBalance, selectedCurrency)}
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <Wallet className="h-6 w-6 text-sky-300" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {currencies.map((currency) => (
            <Button
              key={currency}
              type="button"
              size="sm"
              variant={currency === selectedCurrency ? "secondary" : "ghost"}
              className={currency === selectedCurrency ? "bg-white text-slate-950 hover:bg-white/90" : "text-white hover:bg-white/10"}
              onClick={() => onSelectCurrency(currency)}
            >
              {currency}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ArrowUpRight className="h-4 w-4 text-emerald-300" />
            Entradas convertidas
          </div>
          <p className="mt-2 text-xl font-bold text-emerald-300">{formatCurrency(incomes, selectedCurrency)}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ArrowDownRight className="h-4 w-4 text-rose-300" />
            Saídas convertidas
          </div>
          <p className="mt-2 text-xl font-bold text-rose-300">{formatCurrency(expenses, selectedCurrency)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Coins className="h-4 w-4 text-sky-300" />
            Saldo por moeda
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {currencies.map((currency) => (
              <div key={currency} className="rounded-2xl bg-white/10 p-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-sky-300" />
                  {currency}
                </div>
                <p className="mt-2 text-base font-semibold">{formatCurrency(balances[currency], currency)}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
