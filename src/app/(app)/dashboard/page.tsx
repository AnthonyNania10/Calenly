import type { Metadata } from "next";

import { DashboardContent } from "@/components/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your local OpenCal schedule and booking overview.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
