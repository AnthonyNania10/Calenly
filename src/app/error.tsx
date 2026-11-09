"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="max-w-md text-center">
        <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Something interrupted your schedule
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page could not be loaded. Try again to get back on track.
        </p>
        <Button className="mt-6" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      </section>
    </main>
  );
}
