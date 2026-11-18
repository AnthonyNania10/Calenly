"use client";

import Link from "next/link";
import {
  differenceInMinutes,
  format,
  isAfter,
  isToday,
  startOfTomorrow,
} from "date-fns";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
  Check,
  Clock3,
  Link2,
  Plus,
  RotateCcw,
  Sparkles,
  Timer,
  UsersRound,
  UserRoundCheck,
  X,
} from "lucide-react";

import { useLocalState } from "@/components/local-state-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CalendarEvent } from "@/lib/local-state";

const eventColors: Record<CalendarEvent["color"], string> = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading dashboard">
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export function DashboardContent() {
  const { state, hydrated, recovered, updateRequest, reset } = useLocalState();
  const pending = state.requests.filter((request) => request.status === "pending");
  const todayEvents = state.events
    .filter((event) => isToday(new Date(event.startsAt)))
    .sort(
      (left, right) =>
        new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
    );
  const upcomingEvents = state.events
    .filter((event) =>
      isAfter(new Date(event.startsAt), startOfTomorrow()),
    )
    .sort(
      (left, right) =>
        new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
    )
    .slice(0, 3);
  const weeklyAvailabilityMinutes = state.availability.schedule
    .filter((window) => window.enabled)
    .reduce((total, window) => {
      const [startHour, startMinute] = window.start.split(":").map(Number);
      const [endHour, endMinute] = window.end.split(":").map(Number);
      return (
        total +
        Math.max(
          0,
          endHour * 60 + endMinute - (startHour * 60 + startMinute),
        )
      );
    }, 0);

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {recovered && (
        <Alert>
          <RotateCcw />
          <AlertTitle>Your workspace was refreshed</AlertTitle>
          <AlertDescription>
            We restored your workspace to a clean starting point.
            <Button variant="link" className="ml-1 h-auto p-0" onClick={reset}>
              Reset again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.46_0.2_255),oklch(0.38_0.16_275))] p-6 text-white shadow-xl shadow-primary/15 sm:p-8">
        <div
          className="absolute -top-24 -right-20 size-72 rounded-full border border-white/10 bg-white/5"
          aria-hidden="true"
        />
        <div
          className="absolute -right-4 -bottom-28 size-52 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <Sparkles className="size-4" />
              {format(new Date(), "EEEE, MMMM d")}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Good morning, {state.profile.fullName.split(" ")[0]}.
            </h2>
            <p className="mt-2 max-w-xl text-primary-foreground/75">
              You have {todayEvents.length} event
              {todayEvents.length === 1 ? "" : "s"} today and {pending.length} request
              {pending.length === 1 ? "" : "s"} waiting for a decision.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="secondary" render={<Link href="/calendar" />}>
                View calendar
                <ArrowRight />
              </Button>
              <Button
                render={<Link href="/availability" />}
                className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                Edit availability
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium text-white/60">Next on your day</p>
            {todayEvents[0] ? (
              <>
                <p className="mt-3 font-medium">{todayEvents[0].title}</p>
                <p className="mt-1 text-sm text-white/70">
                  {format(new Date(todayEvents[0].startsAt), "h:mm a")} –{" "}
                  {format(new Date(todayEvents[0].endsAt), "h:mm a")}
                </p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-2/3 rounded-full bg-white/70" />
                </div>
              </>
            ) : (
              <>
                <p className="mt-3 font-medium">Your day is open</p>
                <p className="mt-1 text-sm text-white/70">
                  Add an event when you&apos;re ready.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Workspace summary"
      >
        {[
          {
            label: "Today",
            value: todayEvents.length,
            detail: "scheduled events",
            icon: CalendarClock,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Weekly hours",
            value: `${Math.round(weeklyAvailabilityMinutes / 60)}h`,
            detail: "available to book",
            icon: Timer,
            color: "bg-violet-50 text-violet-600",
          },
          {
            label: "Requests",
            value: pending.length,
            detail: "awaiting review",
            icon: UserRoundCheck,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Connections",
            value: state.connections.length,
            detail: "recent calendars",
            icon: UsersRound,
            color: "bg-emerald-50 text-emerald-600",
          },
        ].map(({ label, value, detail, icon: Icon, color }) => (
          <Card key={label} className="shadow-sm">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${color}`}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {detail}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="sr-only">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Add event",
              detail: "Block your time",
              href: "/calendar",
              icon: Plus,
            },
            {
              label: "Review requests",
              detail: `${pending.length} waiting`,
              href: "/requests",
              icon: UserRoundCheck,
            },
            {
              label: "Set availability",
              detail: "Tune your week",
              href: "/availability",
              icon: Clock3,
            },
            {
              label: "Share your link",
              detail: `opencal.local/${state.profile.username}`,
              href: "/settings",
              icon: Link2,
            },
          ].map(({ label, detail, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{label}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {detail}
                </span>
              </span>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s schedule</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {todayEvents.length} event{todayEvents.length === 1 ? "" : "s"} ·{" "}
                {todayEvents.reduce(
                  (total, event) =>
                    total +
                    differenceInMinutes(
                      new Date(event.endsAt),
                      new Date(event.startsAt),
                    ),
                  0,
                )}{" "}
                min scheduled
              </p>
            </div>
            <CalendarDays className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            {todayEvents.length ? (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="grid grid-cols-[4.5rem_1fr] gap-4 rounded-xl p-3 transition-colors hover:bg-muted/60"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {format(new Date(event.startsAt), "h:mm a")}
                  </p>
                  <div className="flex gap-3">
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${eventColors[event.color]}`}
                    />
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.description || "Personal event"} ·{" "}
                        {differenceInMinutes(
                          new Date(event.endsAt),
                          new Date(event.startsAt),
                        )}{" "}
                        min
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid min-h-40 place-items-center rounded-xl border border-dashed p-6 text-center">
                <div>
                  <CalendarDays className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Your day is open</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add an event from My Calendar.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Pending requests</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose which meetings join your calendar
              </p>
            </div>
            <Badge variant="secondary">{pending.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.length ? (
              pending.map((request) => (
                <div key={request.id} className="rounded-xl border p-3">
                  <p className="text-sm font-medium">{request.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {request.guestName} ·{" "}
                    {format(new Date(request.startsAt), "MMM d, h:mm a")}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateRequest(request.id, "accepted")}
                    >
                      <Check />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRequest(request.id, "declined")}
                    >
                      <X />
                      Decline
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid min-h-40 place-items-center rounded-xl border border-dashed p-6 text-center">
                <div>
                  <Check className="mx-auto size-5 text-emerald-600" />
                  <p className="mt-2 text-sm font-medium">You&apos;re all caught up</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    New requests will appear here.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Upcoming</CardTitle>
          <Button variant="ghost" size="sm" render={<Link href="/calendar" />}>
            See all
            <ArrowRight />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {upcomingEvents.length ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-xl bg-muted/60 p-4">
                <p className="text-xs text-primary">
                  {format(new Date(event.startsAt), "EEE, MMM d · h:mm a")}
                </p>
                <p className="mt-2 text-sm font-medium">{event.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {differenceInMinutes(
                    new Date(event.endsAt),
                    new Date(event.startsAt),
                  )}{" "}
                  min
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground sm:col-span-3">
              No upcoming events yet. Add one from My Calendar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
