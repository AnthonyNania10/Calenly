import { CalendarDays } from "lucide-react";

import { FeaturePlaceholder } from "@/components/feature-placeholder";

export default function CalendarPage() {
  return (
    <FeaturePlaceholder
      icon={CalendarDays}
      eyebrow="Empty calendar"
      title="Your calendar is ready for its first event"
      description="The local-first shell keeps this view intentionally empty. Calendar creation and editing are part of a later product slice."
    />
  );
}
