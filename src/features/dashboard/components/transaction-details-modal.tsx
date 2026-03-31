import { Download, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { createTransactionDetailsPdf, createTransactionPdfFileName, downloadBlob } from "@/lib/pdf";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailsModal({
  transaction,
  open,
  onClose,
}: TransactionDetailsModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || !transaction) {
    return null;
  }

  const currentTransaction = transaction;
  const isExpense = currentTransaction.type === "expense";

  function handleDownloadPdf() {
    const blob = createTransactionDetailsPdf({
      recipientName: currentTransaction.recipientName,
      email: currentTransaction.email,
      typeLabel: isExpense ? "Saida" : "Entrada",
      statusLabel: currentTransaction.status === "completed" ? "Concluida" : "Processando",
      amountLabel: formatCurrency(currentTransaction.amount),
      createdAtLabel: formatDate(currentTransaction.createdAt),
      description: currentTransaction.description || "Sem descricao",
    });

    try {
      downloadBlob(
        blob,
        createTransactionPdfFileName(currentTransaction.recipientName, currentTransaction.createdAt),
      );
      toast({
        title: "PDF baixado",
        description: "O arquivo foi baixado localmente no navegador.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Falha no download",
        description:
          error instanceof Error ? error.message : "Nao foi possivel baixar o PDF localmente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        aria-label={"Fechar detalhes da transa\u00e7\u00e3o"}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-details-title"
        className="relative z-10 w-full max-w-2xl border-white/80 bg-white/95 outline-none"
      >
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle id="transaction-details-title">{"Detalhes da transa\u00e7\u00e3o"}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isExpense ? "danger" : "success"}>
                {isExpense ? "Sa\u00edda" : "Entrada"}
              </Badge>
              <Badge variant={currentTransaction.status === "completed" ? "success" : "warning"}>
                {currentTransaction.status === "completed" ? "Conclu\u00edda" : "Processando"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              className="shrink-0"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar modal">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Nome" value={currentTransaction.recipientName} />
          <DetailField label="E-mail" value={currentTransaction.email} />
          <DetailField label="Tipo" value={isExpense ? "Sa\u00edda" : "Entrada"} />
          <DetailField
            label="Status"
            value={currentTransaction.status === "completed" ? "Conclu\u00edda" : "Processando"}
          />
          <DetailField
            label="Valor"
            value={formatCurrency(currentTransaction.amount)}
            valueClassName={cn(isExpense ? "text-rose-600" : "text-emerald-600")}
          />
          <DetailField label="Data e hora" value={formatDate(currentTransaction.createdAt)} />
          <DetailField
            label={"Descri\u00e7\u00e3o"}
            value={currentTransaction.description || "Sem descri\u00e7\u00e3o"}
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}

function DetailField({
  label,
  value,
  className,
  valueClassName,
}: DetailFieldProps) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-slate-50/80 p-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={cn("mt-2 break-words text-sm font-semibold text-slate-900", valueClassName)}>
        {value}
      </p>
    </div>
  );
}
