import type { Metadata } from "next";

import { RequestsContent } from "@/components/requests-content";

export const metadata: Metadata = {
  title: "Requests",
  description: "Review local booking requests and their status.",
};

export default function RequestsPage() {
  return <RequestsContent />;
}
