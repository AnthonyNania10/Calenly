import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { LocalStateProvider } from "@/components/local-state-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <LocalStateProvider>
      <AppShell>{children}</AppShell>
    </LocalStateProvider>
  );
}
