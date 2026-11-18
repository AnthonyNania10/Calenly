import type { Metadata } from "next";

import { HomeContent } from "@/components/home-content";

export const metadata: Metadata = {
  title: "OpenCal — Your time, thoughtfully organized",
  description:
    "Plan events, set your availability, and manage scheduling requests from one focused workspace.",
};

export default function Home() {
  return <HomeContent />;
}
