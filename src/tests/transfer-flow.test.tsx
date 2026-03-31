import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { ToastContextProvider } from "@/components/ui/use-toast";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { TransferPage } from "@/features/transfer/transfer-page";
import { initialAccountState } from "@/mocks/data";
import { useAccountStore } from "@/stores/account-store";

function renderScenario() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        <MemoryRouter>
          <div className="space-y-6">
            <TransferPage />
            <DashboardPage />
          </div>
        </MemoryRouter>
        <Toaster />
      </ToastContextProvider>
    </QueryClientProvider>,
  );
}

describe("transfer flow", () => {
  beforeEach(() => {
    useAccountStore.setState({
      balance: initialAccountState.balance,
      transactions: initialAccountState.transactions,
    });
  });

  it("submits a transfer and refreshes balance, history and success toast", async () => {
    renderScenario();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nome do destinatário/i), "Mariana Costa");
    await user.type(screen.getByLabelText(/^e-mail$/i), "mariana@email.com");
    await user.clear(screen.getByLabelText(/valor/i));
    await user.type(screen.getByLabelText(/valor/i), "15050");
    await user.type(screen.getByLabelText(/descrição/i), "Pagamento de serviço");
    await user.click(screen.getByRole("button", { name: /confirmar transferência/i }));

    await waitFor(() => {
      expect(screen.getByText(/transferência concluída/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Mariana Costa")).toBeInTheDocument();
    });

    expect(screen.getAllByText("R$ 12.300,40")).toHaveLength(2);
    await waitFor(() => {
      expect(screen.getByText(/Pagamento de serviço/i)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/a transação foi adicionada ao histórico com sucesso/i),
    ).toBeInTheDocument();
  });
});
