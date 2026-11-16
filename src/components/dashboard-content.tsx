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
  CalendarDays,
  Check,
  Clock3,
  Link2,
  Plus,
  RotateCcw,
  Sparkles,
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

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {recovered && (
        <Alert>
          <RotateCcw />
          <AlertTitle>Local data was repaired</AlertTitle>
          <AlertDescription>
            OpenCal found unreadable browser data and safely restored the demo
            defaults.
            <Button variant="link" className="ml-1 h-auto p-0" onClick={reset}>
              Reset again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <section className="overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
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
          </div>
          <Button
            variant="secondary"
            render={<Link href="/calendar" />}
            className="w-fit"
          >
            View calendar
            <ArrowRight />
          </Button>
        </div>
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
              label: "Copy booking link",
              detail: `opencal.local/${state.profile.username}`,
              href: "/settings",
              icon: Link2,
            },
          ].map(({ label, detail, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <p className="mt-4 text-sm font-medium">{label}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {detail}
              </p>
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
                Stored only in this browser
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
