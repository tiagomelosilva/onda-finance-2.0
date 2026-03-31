import { Badge } from "@/components/ui/badge";
import type { TransactionStatus } from "@/types/transaction";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

const statusMap: Record<TransactionStatus, { label: string; variant: "success" | "warning" }> = {
  completed: { label: "Concluída", variant: "success" },
  processing: { label: "Processando", variant: "warning" },
};

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  const badge = statusMap[status];
  return <Badge variant={badge.variant}>{badge.label}</Badge>;
}
