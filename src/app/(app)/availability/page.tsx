import { Clock3 } from "lucide-react";

import { FeaturePlaceholder } from "@/components/feature-placeholder";

export default function AvailabilityPage() {
  return (
    <FeaturePlaceholder
      icon={Clock3}
      eyebrow="No availability rules"
      title="Shape your ideal week in a future slice"
      description="Availability editing needs real calendar behavior, so this local shell provides the navigation and empty state without inventing that feature."
    />
  );
}
