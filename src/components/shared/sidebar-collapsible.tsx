import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarCollapsibleProps {
  items: NavigationItem[];
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarCollapsible({
  items,
  isCollapsed,
  onToggle,
}: SidebarCollapsibleProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden border-r border-white/70 bg-white/85 backdrop-blur lg:flex lg:flex-col",
        "transition-[width] duration-200 ease-out",
        isCollapsed ? "w-[88px]" : "w-[260px]",
      )}
    >
      <div className="flex h-20 items-center justify-between border-b border-slate-200/80 px-4">
        <div className={cn("overflow-hidden", isCollapsed && "w-0 opacity-0")}>
          <Logo hideSubtitle={isCollapsed} compact={isCollapsed} />
        </div>
        {isCollapsed ? (
          <div className="mx-auto">
            <Logo hideText compact />
          </div>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          className="shrink-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <div key={item.href} className="group relative">
              <Link
                to={item.href}
                className={cn(
                  "flex h-12 items-center rounded-2xl px-3 text-sm font-semibold transition-colors",
                  isCollapsed ? "justify-center" : "gap-3",
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-secondary",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
              {isCollapsed ? (
                <div className="pointer-events-none absolute left-full top-1/2 z-40 ml-3 -translate-y-1/2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {item.label}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
