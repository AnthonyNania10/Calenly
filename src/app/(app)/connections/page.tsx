import type { Metadata } from "next";

import { ConnectionsContent } from "@/components/connections-content";

export const metadata: Metadata = {
  title: "Connections",
  description: "Prepare meeting requests from shared OpenCal links.",
};

export default function ConnectionsPage() {
  return <ConnectionsContent />;
}
