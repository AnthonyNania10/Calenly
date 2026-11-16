"use client";

import {
  Check,
  Clock3,
  Globe2,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  availabilitySchema,
  createDefaultAvailability,
  type Availability,
} from "@/lib/local-state";
import { cn } from "@/lib/utils";

const dayLabels: Record<Availability["schedule"][number]["day"], string> = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

const minutesBetween = (start: string, end: string) => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

function AvailabilitySkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
      <div className="h-[42rem] animate-pulse rounded-2xl bg-muted" />
      <div className="h-80 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function AvailabilityEditor({
  availability,
  timezone,
  onSave,
}: {
  availability: Availability;
  timezone: string;
  onSave: (availability: Availability) => boolean;
}) {
  const [draft, setDraft] = useState(availability);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const activeWindows = draft.schedule.filter((window) => window.enabled);
  const weeklyMinutes = activeWindows.reduce(
    (total, window) =>
      total + Math.max(0, minutesBetween(window.start, window.end)),
    0,
  );

  const updateWindow = (
    day: Availability["schedule"][number]["day"],
    values: Partial<Availability["schedule"][number]>,
  ) => {
    setDraft((current) => ({
      ...current,
      schedule: current.schedule.map((window) =>
        window.day === day ? { ...window, ...values } : window,
      ),
    }));
    setMessage(null);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = availabilitySchema.safeParse(draft);
    if (!parsed.success) {
      setMessage({
        type: "error",
        text:
          parsed.error.issues[0]?.message ??
          "Check your hours and try again.",
      });
      return;
    }

    if (onSave(parsed.data)) {
      setMessage({
        type: "success",
        text: "Your availability was saved to this browser.",
      });
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle>Weekly hours</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose when people can request time with you.
            </p>
          </div>
          <Badge variant="secondary">
            {activeWindows.length} active day
            {activeWindows.length === 1 ? "" : "s"}
          </Badge>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            {message && (
              <Alert
                className={
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                    : "border-destructive/30 bg-destructive/5 text-destructive"
                }
              >
                {message.type === "success" ? <Check /> : <Clock3 />}
                <AlertTitle>
                  {message.type === "success"
                    ? "Availability saved"
                    : "Check your schedule"}
                </AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="divide-y rounded-2xl border">
              {draft.schedule.map((window) => (
                <div
                  key={window.day}
                  className="grid gap-3 p-4 sm:grid-cols-[7rem_1fr] sm:items-center"
                >
                  <button
                    type="button"
                    onClick={() =>
                      updateWindow(window.day, { enabled: !window.enabled })
                    }
                    className="flex items-center gap-3 text-left"
                    aria-pressed={window.enabled}
                  >
                    <span
                      className={cn(
                        "relative h-6 w-10 rounded-full transition-colors",
                        window.enabled ? "bg-primary" : "bg-muted-foreground/25",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform",
                          window.enabled ? "translate-x-5" : "translate-x-1",
                        )}
                      />
                    </span>
                    <span className="text-sm font-medium">
                      {dayLabels[window.day].slice(0, 3)}
                    </span>
                  </button>

                  {window.enabled ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={window.start}
                        onChange={(changeEvent) =>
                          updateWindow(window.day, {
                            start: changeEvent.target.value,
                          })
                        }
                        aria-label={`${dayLabels[window.day]} start time`}
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={window.end}
                        onChange={(changeEvent) =>
                          updateWindow(window.day, {
                            end: changeEvent.target.value,
                          })
                        }
                        aria-label={`${dayLabels[window.day]} end time`}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Unavailable</p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid gap-4 border-t pt-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="duration">Meeting duration</Label>
                <select
                  id="duration"
                  value={draft.meetingDuration}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      meetingDuration: Number(
                        event.target.value,
                      ) as Availability["meetingDuration"],
                    }))
                  }
                  className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {[15, 30, 45, 60].map((duration) => (
                    <option key={duration} value={duration}>
                      {duration} minutes
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buffer">Buffer between</Label>
                <select
                  id="buffer"
                  value={draft.bufferMinutes}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      bufferMinutes: Number(
                        event.target.value,
                      ) as Availability["bufferMinutes"],
                    }))
                  }
                  className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {[0, 5, 10, 15, 30].map((buffer) => (
                    <option key={buffer} value={buffer}>
                      {buffer === 0 ? "No buffer" : `${buffer} minutes`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice">Minimum notice</Label>
                <select
                  id="notice"
                  value={draft.minimumNoticeHours}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      minimumNoticeHours: Number(event.target.value),
                    }))
                  }
                  className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {[0, 2, 4, 12, 24, 48, 72].map((hours) => (
                    <option key={hours} value={hours}>
                      {hours === 0 ? "No minimum" : `${hours} hours`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDraft(createDefaultAvailability());
                  setMessage(null);
                }}
              >
                <RotateCcw />
                Restore recommended hours
              </Button>
              <Button type="submit">
                <Save />
                Save availability
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Schedule summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-semibold">
                {(weeklyMinutes / 60).toFixed(
                  weeklyMinutes % 60 === 0 ? 0 : 1,
                )}
                h
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                available each week
              </p>
            </div>
            <div className="space-y-2 border-t pt-4 text-sm">
              <p className="flex justify-between gap-3">
                <span className="text-muted-foreground">Meeting length</span>
                <span>{draft.meetingDuration} min</span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-muted-foreground">Buffer</span>
                <span>{draft.bufferMinutes} min</span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-muted-foreground">Notice</span>
                <span>{draft.minimumNoticeHours} hr</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Globe2 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Timezone</p>
              <p className="mt-1 break-words text-xs text-muted-foreground">
                {timezone}
              </p>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Change your timezone in Settings. All local events use the browser
              timezone for display.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">Local and private</p>
            <p className="mt-1 text-xs leading-5 text-emerald-800">
              Availability never leaves this browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AvailabilityContent() {
  const { state, hydrated, updateAvailability } = useLocalState();

  if (!hydrated) return <AvailabilitySkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          My availability
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Set the rhythm of your week
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Define bookable hours, meeting length, buffers, and minimum notice.
        </p>
      </div>
      <AvailabilityEditor
        key={JSON.stringify(state.availability)}
        availability={state.availability}
        timezone={state.profile.timezone}
        onSave={updateAvailability}
      />
    </div>
  );
}
