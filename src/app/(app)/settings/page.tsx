import type { Metadata } from "next";

import { SettingsContent } from "@/components/settings-content";
import { getTimezones } from "@/lib/timezones";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage the profile stored locally in this browser.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Local profile
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Make OpenCal yours
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Changes stay on this device and never leave your browser.
        </p>
      </div>
      <SettingsContent timezones={getTimezones()} />
    </div>
  );
}
