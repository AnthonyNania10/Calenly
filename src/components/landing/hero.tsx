import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SupabaseStatus } from "@/components/supabase-status";

export function Hero() {
  return (
    <section className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-28">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          A clear, open way to share your time
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
          Scheduling that stays on{" "}
          <span className="text-primary">your terms.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-pretty text-muted-foreground">
          OpenCal is the modern foundation for simple availability, thoughtful
          booking, and calendars you control.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" disabled title="Available in Phase 2">
            Create your OpenCal
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground sm:px-4">
            <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
            Private by default
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="rounded-3xl border bg-card/85 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Foundation status</p>
              <p className="text-xs text-muted-foreground">OpenCal · Phase 1</p>
            </div>
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
            </span>
          </div>
          <SupabaseStatus />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ["App shell", "Ready"],
              ["Design system", "Ready"],
              ["Auth", "Next"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-muted/70 px-2 py-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
