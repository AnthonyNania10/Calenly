import { CheckCircle2, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export function SupabaseStatus() {
  const config = getSupabasePublicConfig();

  if (config.configured) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
        <div>
          <p className="font-medium">Supabase is connected</p>
          <p className="mt-1 text-sm text-emerald-800">
            The public client configuration is ready for Phase 2.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card/80 p-4 shadow-sm">
      <Settings2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">Running in foundation mode</p>
          <Badge variant="secondary">Setup needed</Badge>
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Add the public Supabase variables in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            .env.local
          </code>{" "}
          when you are ready. No credentials are required to preview this shell.
        </p>
      </div>
    </div>
  );
}
