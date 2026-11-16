import type { Metadata } from "next";

import { AvailabilityContent } from "@/components/availability-content";

export const metadata: Metadata = {
  title: "My Availability",
  description: "Configure local weekly hours and booking preferences.",
};

export default function AvailabilityPage() {
  return <AvailabilityContent />;
}
