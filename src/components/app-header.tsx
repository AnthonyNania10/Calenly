import Link from "next/link";
import { CalendarDays, Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label="OpenCal home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <CalendarDays className="size-4.5" aria-hidden="true" />
          </span>
          OpenCal
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled title="Repository link pending">
            <Code2 className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Open source</span>
          </Button>
          <Button size="sm" disabled title="Available in Phase 2">
            Sign in
          </Button>
        </nav>
      </div>
    </header>
  );
}
