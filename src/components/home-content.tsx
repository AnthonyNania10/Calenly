import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  Clock3,
  Link2,
  MousePointerClick,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CalendarDays,
    title: "One clear calendar",
    description:
      "Plan focused work, meetings, and personal time from a calm monthly view.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: Clock3,
    title: "Availability on your terms",
    description:
      "Set weekly hours, meeting lengths, buffers, and the notice you need.",
    accent: "bg-violet-50 text-violet-600",
  },
  {
    icon: CalendarCheck2,
    title: "Requests in one place",
    description:
      "Review incoming time requests and add accepted meetings to your calendar.",
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Link2,
    title: "Simple calendar links",
    description:
      "Paste a shared OpenCal link to prepare a request for someone else’s time.",
    accent: "bg-amber-50 text-amber-600",
  },
];

const schedule = [
  {
    time: "9:30",
    title: "Weekly planning",
    detail: "45 min",
    color: "bg-violet-500",
  },
  {
    time: "11:00",
    title: "Product critique",
    detail: "Studio team",
    color: "bg-blue-500",
  },
  {
    time: "2:30",
    title: "Client kickoff",
    detail: "Northstar Labs",
    color: "bg-emerald-500",
  },
];

export function HomeContent() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <header className="relative z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
            aria-label="OpenCal home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <CalendarDays className="size-4.5" />
            </span>
            OpenCal
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#workflow" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>
          <Button render={<Link href="/dashboard" />}>
            Open dashboard
            <ArrowRight />
          </Button>
        </div>
      </header>

      <main>
        <section className="relative">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,oklch(0.88_0.08_250/.55),transparent_28rem),radial-gradient(circle_at_85%_35%,oklch(0.9_0.06_285/.45),transparent_30rem)]"
            aria-hidden="true"
          />
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
                <Sparkles className="size-3.5 text-primary" />
                A calmer way to coordinate your time
              </div>
              <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
                Meetings without the{" "}
                <span className="text-primary">back-and-forth.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-pretty text-muted-foreground">
                Plan your week, share when you&apos;re available, and keep every
                scheduling request organized in one thoughtful workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href="/dashboard" />}>
                  Start planning
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<a href="#workflow" />}
                >
                  See how it works
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {["Plan events", "Set weekly hours", "Manage requests"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="size-3" />
                      </span>
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl">
              <div
                className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="overflow-hidden rounded-3xl border bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold">Today&apos;s schedule</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Monday, November 16
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    3 events
                  </span>
                </div>
                <div className="grid sm:grid-cols-[1fr_12rem]">
                  <div className="space-y-1 p-4 sm:p-5">
                    {schedule.map((event) => (
                      <div
                        key={event.time}
                        className="grid grid-cols-[3.5rem_1fr] gap-3 rounded-xl p-3 hover:bg-muted/60"
                      >
                        <p className="text-xs font-medium text-muted-foreground">
                          {event.time}
                        </p>
                        <div className="flex gap-3">
                          <span
                            className={`mt-1.5 size-2 rounded-full ${event.color}`}
                          />
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {event.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t bg-muted/40 p-4 sm:border-t-0 sm:border-l sm:p-5">
                    <p className="text-xs font-medium text-muted-foreground">
                      This week
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      24h
                    </p>
                    <p className="text-xs text-muted-foreground">available</p>
                    <div className="mt-5 space-y-2">
                      {[
                        ["Requests", "2"],
                        ["Upcoming", "5"],
                        ["Connections", "3"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-3 -bottom-6 hidden w-56 rounded-2xl border bg-card p-4 shadow-xl sm:block">
                <p className="flex items-center gap-2 text-xs font-medium">
                  <UsersRound className="size-4 text-primary" />
                  New request
                </p>
                <p className="mt-2 text-sm font-medium">Portfolio review</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Maya · Wednesday at 10:00
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y bg-card/55 py-16 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Everything in its place
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your scheduling workspace, simplified.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Move from planning to confirmed meetings without losing sight of
                the time you want to protect.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description, accent }) => (
                <article
                  key={title}
                  className="rounded-2xl border bg-background p-5 shadow-sm"
                >
                  <span
                    className={`grid size-10 place-items-center rounded-xl ${accent}`}
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                A simple rhythm
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Decide when. Share the link. Stay in control.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                OpenCal keeps the process clear for you and everyone requesting
                your time.
              </p>
              <Button className="mt-7" render={<Link href="/dashboard" />}>
                Explore the dashboard
                <ArrowRight />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  icon: Clock3,
                  title: "Set your hours",
                  detail: "Choose the days and times that work for you.",
                },
                {
                  number: "02",
                  icon: MousePointerClick,
                  title: "Share or connect",
                  detail: "Use calendar links to coordinate a preferred time.",
                },
                {
                  number: "03",
                  icon: CalendarCheck2,
                  title: "Confirm with confidence",
                  detail: "Review requests and keep your calendar current.",
                },
              ].map(({ number, icon: Icon, title, detail }) => (
                <article key={number} className="rounded-2xl border p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-8 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-10">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Make room for your best work.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/75">
              Bring your schedule, availability, and requests together in one
              focused workspace.
            </p>
            <Button
              className="mt-7"
              variant="secondary"
              render={<Link href="/dashboard" />}
            >
              Open your dashboard
              <ArrowRight />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="font-medium text-foreground">
            OpenCal
          </Link>
          <p>Your time, thoughtfully organized.</p>
        </div>
      </footer>
    </div>
  );
}
