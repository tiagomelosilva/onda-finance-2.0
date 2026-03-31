export type TransactionType = "income" | "expense";
export type TransactionStatus = "completed" | "processing";

export interface Transaction {
  id: string;
  recipientName: string;
  email: string;
  amount: number;
  description?: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}
