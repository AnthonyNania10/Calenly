import { z } from "zod";

const publicConfigSchema = z.object({
  url: z.url(),
  publishableKey: z.string().min(1),
});

export type SupabasePublicConfig =
  | {
      configured: true;
      url: string;
      publishableKey: string;
    }
  | {
      configured: false;
      missing: Array<"NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY">;
    };

type PublicEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
};

export function getSupabasePublicConfig(
  environment: PublicEnvironment = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
): SupabasePublicConfig {
  const missing: Array<
    "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  > = [];

  if (!environment.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  const parsed = publicConfigSchema.safeParse({
    url: environment.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!parsed.success) {
    if (
      environment.NEXT_PUBLIC_SUPABASE_URL &&
      !z.url().safeParse(environment.NEXT_PUBLIC_SUPABASE_URL).success
    ) {
      missing.push("NEXT_PUBLIC_SUPABASE_URL");
    }

    return { configured: false, missing: [...new Set(missing)] };
  }

  return {
    configured: true,
    url: parsed.data.url,
    publishableKey: parsed.data.publishableKey,
  };
}
