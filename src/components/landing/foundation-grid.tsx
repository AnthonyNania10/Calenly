import { Blocks, CalendarClock, LockKeyhole, Palette } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const foundations = [
  {
    title: "Responsive by design",
    description:
      "A calm, focused shell that feels considered from phone to desktop.",
    icon: CalendarClock,
  },
  {
    title: "Composable system",
    description:
      "Reusable tokens and primitives keep every future flow consistent.",
    icon: Blocks,
  },
  {
    title: "Environment safe",
    description:
      "Only public Supabase credentials reach the browser; privileged keys stay out.",
    icon: LockKeyhole,
  },
  {
    title: "Accessible foundation",
    description:
      "Strong contrast, semantic structure, and clear global states are built in.",
    icon: Palette,
  },
];

export function FoundationGrid() {
  return (
    <section className="border-t py-14 sm:py-20" aria-labelledby="foundation-title">
      <div className="max-w-2xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Phase 1 foundation
        </p>
        <h2
          id="foundation-title"
          className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Ready for the product to grow.
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          This first slice establishes the architecture and quality baseline.
          Accounts, calendars, and booking workflows begin in the next phases.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {foundations.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="bg-card/70 shadow-sm">
            <CardHeader>
              <div className="mb-2 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4.5" aria-hidden="true" />
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="leading-7 text-muted-foreground">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
