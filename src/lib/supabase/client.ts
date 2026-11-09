import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export function createClient() {
  const config = getSupabasePublicConfig();

  if (!config.configured) {
    return null;
  }

  return createBrowserClient<Database>(config.url, config.publishableKey);
}
