import { PlugZap } from "lucide-react";

import { FeaturePlaceholder } from "@/components/feature-placeholder";

export default function ConnectionsPage() {
  return (
    <FeaturePlaceholder
      icon={PlugZap}
      eyebrow="No connections"
      title="Connect calendars when integrations arrive"
      description="External calendar connections require remote services and credentials. They are deliberately excluded from this local-only build."
    />
  );
}
