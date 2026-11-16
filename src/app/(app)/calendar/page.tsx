import type { Metadata } from "next";

import { CalendarContent } from "@/components/calendar-content";

export const metadata: Metadata = {
  title: "My Calendar",
  description: "Plan and manage events stored locally in this browser.",
};

export default function CalendarPage() {
  return <CalendarContent />;
}
