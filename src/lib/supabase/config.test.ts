import { describe, expect, it } from "vitest";

import { getSupabasePublicConfig } from "@/lib/supabase/config";

describe("getSupabasePublicConfig", () => {
  it("returns a usable public configuration", () => {
    expect(
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }),
    ).toEqual({
      configured: true,
      url: "https://example.supabase.co",
      publishableKey: "sb_publishable_example",
    });
  });

  it("identifies each missing environment variable", () => {
    expect(getSupabasePublicConfig({})).toEqual({
      configured: false,
      missing: [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      ],
    });
  });

  it("treats an invalid URL as unconfigured", () => {
    expect(
      getSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }),
    ).toEqual({
      configured: false,
      missing: ["NEXT_PUBLIC_SUPABASE_URL"],
    });
  });
});
