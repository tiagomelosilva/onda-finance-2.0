import { X } from "lucide-react";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileDrawerProps {
  items: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
}

export function MobileDrawer({
  items,
  isOpen,
  onClose,
  onLogout,
}: MobileDrawerProps) {
  const location = useLocation();
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const [isVisible, setIsVisible] = React.useState(isOpen);

  React.useEffect(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    if (isOpen) {
      setShouldRender(true);
      window.requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);
    closeTimeoutRef.current = window.setTimeout(() => {
      setShouldRender(false);
    }, 220);

    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    if (isVisible) {
      document.body.style.overflow = "hidden";
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    if (isVisible) {
      drawerRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Fechar menu"
        className={cn(
          "absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-200 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={cn(
          "absolute left-0 top-0 flex h-full w-[88vw] max-w-sm flex-col border-r border-white/70 bg-white p-5 shadow-2xl outline-none transition-transform duration-200 ease-out",
          isVisible ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar navegação">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-8 flex-1 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                  isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-secondary",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={async () => {
            await onLogout();
            onClose();
          }}
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
