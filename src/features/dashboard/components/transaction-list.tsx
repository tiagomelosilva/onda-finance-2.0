import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/types/transaction";

import { TransactionDetailsModal } from "./transaction-details-modal";
import { TransactionItem } from "./transaction-item";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionList({ transactions, isLoading = false }: TransactionListProps) {
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>Carregando movimentações recentes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-white/80 bg-white/90">
      <CardHeader>
        <CardTitle>Transações</CardTitle>
        <CardDescription>Histórico consolidado da conta com atualização imediata após novas transferências.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/50 px-6 py-10 text-center">
            <p className="text-base font-semibold">Nenhuma transação encontrada.</p>
            <p className="mt-2 text-sm text-muted-foreground">Inicie uma nova transferência para visualizar movimentações.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onSelect={setSelectedTransaction}
              />
            ))}
          </div>
        )}
      </CardContent>
      </Card>
      <TransactionDetailsModal
        open={Boolean(selectedTransaction)}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
}
