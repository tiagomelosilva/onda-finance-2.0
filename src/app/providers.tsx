import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { ToastContextProvider } from "@/components/ui/use-toast";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 20_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        {children}
        <Toaster />
      </ToastContextProvider>
    </QueryClientProvider>
  );
}
