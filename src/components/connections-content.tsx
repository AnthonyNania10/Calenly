"use client";

import { addDays, format, set } from "date-fns";
import {
  ArrowRight,
  CalendarPlus2,
  Check,
  Clock3,
  ExternalLink,
  Link2,
  LoaderCircle,
  Send,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useState } from "react";

import { useLocalState } from "@/components/local-state-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import {
  displayNameFromUsername,
  parseCalendarLink,
} from "@/lib/calendar-links";
import {
  outgoingRequestInputSchema,
  type CalendarConnection,
  type OutgoingRequestInput,
} from "@/lib/local-state";
import { cn } from "@/lib/utils";

type SelectedCalendar = {
  username: string;
  displayName: string;
  calendarUrl: string;
};

const defaultStart = () =>
  format(
    set(addDays(new Date(), 1), {
      hours: 10,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }),
    "yyyy-MM-dd'T'HH:mm",
  );

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function ConnectionsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export function ConnectionsContent() {
  const {
    state,
    hydrated,
    sendCalendarRequest,
    cancelOutgoingRequest,
  } = useLocalState();
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [selected, setSelected] = useState<SelectedCalendar | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [startsAt, setStartsAt] = useState(defaultStart);
  const [duration, setDuration] =
    useState<OutgoingRequestInput["duration"]>(30);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  if (!hydrated) return <ConnectionsSkeleton />;

  const selectCalendar = (calendar: SelectedCalendar) => {
    setSelected(calendar);
    setLink(calendar.calendarUrl);
    setLinkError("");
    setSent(false);
  };

  const findCalendar = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = parseCalendarLink(link);
    if (!parsed) {
      setSelected(null);
      setLinkError(
        "Paste a valid OpenCal link, such as https://opencal.local/maya.",
      );
      return;
    }
    if (parsed.username === state.profile.username) {
      setSelected(null);
      setLinkError("That is your own calendar link.");
      return;
    }

    selectCalendar({
      username: parsed.username,
      displayName: displayNameFromUsername(parsed.username),
      calendarUrl: `https://opencal.local/${parsed.username}`,
    });
  };

  const submitRequest = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;

    const date = new Date(startsAt);
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      setFormError("Choose a future date and time.");
      return;
    }

    const input = {
      username: selected.username,
      title,
      message,
      startsAt: date.toISOString(),
      duration,
    };
    const parsed = outgoingRequestInputSchema.safeParse(input);
    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message ?? "Check the request and try again.",
      );
      return;
    }

    const connection: CalendarConnection = {
      ...selected,
      addedAt: new Date().toISOString(),
    };
    if (sendCalendarRequest(connection, parsed.data)) {
      setSent(true);
      setFormError("");
      setTitle("");
      setMessage("");
      setStartsAt(defaultStart());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Connections
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Request time on another calendar
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Paste someone&apos;s OpenCal link, choose a time, and prepare a request.
          This local prototype keeps the request on this device.
        </p>
      </div>

      <Card className="overflow-visible bg-primary text-primary-foreground">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={findCalendar}>
            <Label htmlFor="calendar-link" className="text-primary-foreground">
              Calendar link
            </Label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Link2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="calendar-link"
                  value={link}
                  onChange={(event) => {
                    setLink(event.target.value);
                    setLinkError("");
                    setSent(false);
                  }}
                  placeholder="https://opencal.local/maya"
                  className="h-10 bg-white pl-9 text-foreground"
                />
              </div>
              <Button type="submit" variant="secondary" className="h-10">
                Find calendar
                <ArrowRight />
              </Button>
            </div>
            {linkError && (
              <p className="mt-2 text-xs text-primary-foreground" role="alert">
                {linkError}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        {selected ? (
          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback>
                  {initials(selected.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle>{selected.displayName}</CardTitle>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  @{selected.username} · OpenCal calendar
                </p>
              </div>
              <Badge className="ml-auto" variant="secondary">
                Ready
              </Badge>
            </CardHeader>
            <CardContent>
              {sent && (
                <Alert className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-950">
                  <Check />
                  <AlertTitle>Request prepared</AlertTitle>
                  <AlertDescription>
                    It was added to your outgoing request history.
                  </AlertDescription>
                </Alert>
              )}
              {formError && (
                <Alert className="mb-5 border-destructive/30 bg-destructive/5 text-destructive">
                  <X />
                  <AlertTitle>Request needs attention</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={submitRequest} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="request-title">What would you like to discuss?</Label>
                  <Input
                    id="request-title"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setSent(false);
                    }}
                    placeholder="Project planning"
                    maxLength={100}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                  <div className="space-y-2">
                    <Label htmlFor="request-time">Preferred time</Label>
                    <Input
                      id="request-time"
                      type="datetime-local"
                      value={startsAt}
                      onChange={(event) => {
                        setStartsAt(event.target.value);
                        setSent(false);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="request-duration">Duration</Label>
                    <select
                      id="request-duration"
                      value={duration}
                      onChange={(event) =>
                        setDuration(
                          Number(
                            event.target.value,
                          ) as OutgoingRequestInput["duration"],
                        )
                      }
                      className="h-8 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {[15, 30, 45, 60].map((minutes) => (
                        <option key={minutes} value={minutes}>
                          {minutes} min
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="request-message">Message (optional)</Label>
                  <Textarea
                    id="request-message"
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      setSent(false);
                    }}
                    rows={4}
                    maxLength={500}
                    placeholder={`Share a little context with ${selected.displayName}.`}
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {message.length}/500
                  </p>
                </div>
                <Button type="submit">
                  <Send />
                  Send request
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="grid min-h-[30rem] place-items-center p-8 text-center">
              <div className="max-w-sm">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <UserRoundPlus className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">Paste a calendar link</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We&apos;ll identify the calendar owner and open a request form
                  for your preferred time.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Recent calendars</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {state.connections.length ? (
                [...state.connections]
                  .sort(
                    (left, right) =>
                      new Date(right.addedAt).getTime() -
                      new Date(left.addedAt).getTime(),
                  )
                  .map((connection) => (
                    <button
                      key={connection.username}
                      type="button"
                      onClick={() => selectCalendar(connection)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted/60",
                        selected?.username === connection.username &&
                          "border-primary/30 bg-primary/5",
                      )}
                    >
                      <Avatar>
                        <AvatarFallback>
                          {initials(connection.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {connection.displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          @{connection.username}
                        </p>
                      </div>
                      <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                    </button>
                  ))
              ) : (
                <div className="rounded-xl border border-dashed p-5 text-center">
                  <Link2 className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Calendars you request will stay here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-2xl border bg-muted/50 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <LoaderCircle className="size-4 text-primary" />
              Local delivery simulation
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Requests are persisted locally. Remote delivery will require a
              shared backend in a future phase.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Outgoing requests</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Requests prepared from this browser
            </p>
          </div>
          <Badge variant="secondary">{state.outgoingRequests.length}</Badge>
        </CardHeader>
        <CardContent>
          {state.outgoingRequests.length ? (
            <div className="divide-y rounded-xl border">
              {[...state.outgoingRequests]
                .sort(
                  (left, right) =>
                    new Date(right.createdAt).getTime() -
                    new Date(left.createdAt).getTime(),
                )
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <CalendarPlus2 className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {request.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        @{request.username} ·{" "}
                        {format(new Date(request.startsAt), "MMM d, h:mm a")} ·{" "}
                        {request.duration} min
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        request.status === "pending"
                          ? "border-amber-200 bg-amber-50 text-amber-900"
                          : "text-muted-foreground"
                      }
                    >
                      {request.status}
                    </Badge>
                    {request.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => cancelOutgoingRequest(request.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid min-h-40 place-items-center rounded-xl border border-dashed p-6 text-center">
              <div>
                <Clock3 className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">No outgoing requests</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste a calendar link above to prepare one.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
