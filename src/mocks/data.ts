import type { User } from "@/types/auth";
import type { Transaction } from "@/types/transaction";

export const mockUserCredentials = {
  email: "cliente@ondafinance.com",
  password: "Onda@123",
};

export const mockUser: User = {
  id: "user-1",
  name: "Tiago Melo Silva",
  email: mockUserCredentials.email,
};

export const initialBalance = 12450.9;

export const initialTransactions: Transaction[] = [
  {
    id: "trx-001",
    recipientName: "Empresa Delta",
    email: "financeiro@delta.com",
    amount: 2250.0,
    description: "Recebimento de projeto mensal",
    type: "income",
    status: "completed",
    createdAt: "2026-03-30T10:15:00.000Z",
  },
  {
    id: "trx-002",
    recipientName: "Mercado Aurora",
    email: "pagamentos@mercadoaurora.com",
    amount: 438.72,
    description: "Despesas operacionais",
    type: "expense",
    status: "completed",
    createdAt: "2026-03-28T18:40:00.000Z",
  },
  {
    id: "trx-003",
    recipientName: "Investimentos Azul",
    email: "aporte@azul.com",
    amount: 1800.0,
    description: "Resgate de aplicação",
    type: "income",
    status: "completed",
    createdAt: "2026-03-26T14:05:00.000Z",
  },
  {
    id: "trx-004",
    recipientName: "Condomínio Atlântico",
    email: "cobranca@atlantico.com",
    amount: 950.5,
    description: "Pagamento mensal",
    type: "expense",
    status: "completed",
    createdAt: "2026-03-24T11:30:00.000Z",
  },
  {
    id: "trx-005",
    recipientName: "Cliente Horizonte",
    email: "contato@horizonte.com",
    amount: 3200.0,
    description: "Entrada extraordinária",
    type: "income",
    status: "completed",
    createdAt: "2026-03-21T09:20:00.000Z",
  },
];

export const initialAccountState = {
  balance: initialBalance,
  transactions: initialTransactions,
};
