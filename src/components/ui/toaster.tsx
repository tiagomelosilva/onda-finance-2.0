import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className={cn(
            "rounded-2xl border p-5 shadow-fintech backdrop-blur",
            item.variant === "success" && "border-emerald-200 bg-emerald-50",
            item.variant === "destructive" && "border-rose-200 bg-rose-50",
            item.variant === "default" && "border-slate-200 bg-white",
          )}
        >
          <div className="grid gap-1">
            <p className="text-sm font-semibold text-slate-950">{item.title}</p>
            {item.description ? <p className="text-sm text-slate-600">{item.description}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
