import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppShell } from "@/components/shared/app-shell";
import { LoginPage } from "@/features/auth/login-page";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { TransferPage } from "@/features/transfer/transfer-page";
import { useSessionStore } from "@/stores/session-store";

function ProtectedRoute() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  return isAuthenticated ? <AppShell /> : <Navigate to="/login" replace />;
}

function NotFoundPage() {
  return <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "transfer",
        element: <TransferPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
