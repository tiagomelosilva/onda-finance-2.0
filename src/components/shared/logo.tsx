import { cn } from "@/lib/utils";

interface LogoProps {
  compact?: boolean;
  hideText?: boolean;
  hideSubtitle?: boolean;
}

export function Logo({ compact = false, hideText = false, hideSubtitle = false }: LogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={cn(
          "shrink-0 flex items-center justify-center rounded-2xl bg-slate-950 text-lg font-extrabold text-white",
          compact ? "h-10 w-10" : "h-11 w-11",
        )}
      >
        O
      </div>
      {!hideText ? (
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Onda Finance
          </p>
          {!hideSubtitle ? (
            <p className="text-sm leading-snug text-muted-foreground sm:whitespace-nowrap">
              Operações com clareza e controle
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
