import { apiClient } from "@/lib/axios";
import { mockUser, mockUserCredentials } from "@/mocks/data";
import { useAccountStore } from "@/stores/account-store";
import { useSessionStore } from "@/stores/session-store";
import type { Transaction } from "@/types/transaction";

interface LoginPayload {
  email: string;
  password: string;
}

interface TransferPayload {
  recipientName: string;
  email: string;
  amount: number;
  description?: string;
}

interface DashboardResponse {
  balance: number;
  transactions: Transaction[];
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginMock(payload: LoginPayload) {
  void apiClient.defaults.baseURL;
  await wait(500);

  const matchesUser =
    payload.email === mockUserCredentials.email &&
    payload.password === mockUserCredentials.password;

  if (!matchesUser) {
    throw new Error("Credenciais inválidas. Use os dados do usuário mockado.");
  }

  useSessionStore.getState().login(mockUser);
  return mockUser;
}

export async function logoutMock() {
  await wait(150);
  useSessionStore.getState().logout();
  useAccountStore.getState().resetAccount();
}

export async function getDashboardData(): Promise<DashboardResponse> {
  void apiClient.defaults.baseURL;
  await wait(650);

  const { transactions, balance } = useAccountStore.getState();

  return {
    balance,
    transactions,
  };
}

export async function createTransferMock(payload: TransferPayload) {
  void apiClient.defaults.baseURL;
  await wait(500);

  const transaction = useAccountStore.getState().createTransfer(payload);

  return {
    transaction,
    balance: useAccountStore.getState().balance,
  };
}
