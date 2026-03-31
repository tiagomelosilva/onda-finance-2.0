import { LayoutDashboard, LogOut, Menu, Send, UserRound } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import * as React from "react";

import { MobileDrawer } from "@/components/shared/mobile-drawer";
import { Logo } from "@/components/shared/logo";
import { SidebarCollapsible } from "@/components/shared/sidebar-collapsible";
import { Button } from "@/components/ui/button";
import { logoutMock } from "@/mocks/api";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout-store";
import { useSessionStore } from "@/stores/session-store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transferir", href: "/transfer", icon: Send },
];

export function AppShell() {
  const navigate = useNavigate();
  const user = useSessionStore((state) => state.user);
  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed);
  const isMobileMenuOpen = useLayoutStore((state) => state.isMobileMenuOpen);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const openMobileMenu = useLayoutStore((state) => state.openMobileMenu);
  const closeMobileMenu = useLayoutStore((state) => state.closeMobileMenu);

  const handleLogout = React.useCallback(async () => {
    await logoutMock();
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent">
      <SidebarCollapsible
        items={navItems}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <MobileDrawer
        items={navItems}
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onLogout={handleLogout}
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur transition-[left] duration-200 ease-out",
          isSidebarCollapsed ? "lg:left-[88px]" : "lg:left-[260px]",
        )}
      >
        <div className="flex h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Abrir menu de navegação"
              className="lg:hidden"
              onClick={openMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden rounded-2xl bg-secondary/70 px-4 py-2 md:flex md:items-center md:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "pt-24 transition-[padding-left] duration-200 ease-out",
          isSidebarCollapsed ? "lg:pl-[120px]" : "lg:pl-[292px]",
        )}
      >
        <div className="px-4 pb-8 sm:px-6 lg:px-8">
          <main className="mx-auto max-w-7xl">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
