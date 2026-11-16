import { CalendarCheck2 } from "lucide-react";

import { FeaturePlaceholder } from "@/components/feature-placeholder";

export default function RequestsPage() {
  return (
    <FeaturePlaceholder
      icon={CalendarCheck2}
      eyebrow="Request center"
      title="Request management is represented on the dashboard"
      description="Accept or decline the demo requests from Dashboard. A full request inbox and booking workflow remain outside this shell."
    />
  );
}
