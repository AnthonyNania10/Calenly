"use client";

import {
  addMinutes,
  addMonths,
  differenceInMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  set,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useLocalState } from "@/components/local-state-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  calendarEventSchema,
  eventColorSchema,
  type CalendarEvent,
  type CalendarEventInput,
} from "@/lib/local-state";
import { cn } from "@/lib/utils";

const eventStyles: Record<CalendarEvent["color"], string> = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const eventSurfaceStyles: Record<CalendarEvent["color"], string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-950",
  violet: "border-violet-200 bg-violet-50 text-violet-950",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-950",
  amber: "border-amber-200 bg-amber-50 text-amber-950",
  rose: "border-rose-200 bg-rose-50 text-rose-950",
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toLocalInput = (value: string | Date) =>
  format(typeof value === "string" ? new Date(value) : value, "yyyy-MM-dd'T'HH:mm");

type EventDraft = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  color: CalendarEvent["color"];
};

function createDraft(date: Date, event?: CalendarEvent): EventDraft {
  if (event) {
    return {
      title: event.title,
      description: event.description,
      startsAt: toLocalInput(event.startsAt),
      endsAt: toLocalInput(event.endsAt),
      color: event.color,
    };
  }

  const start = set(date, {
    hours: 9,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  return {
    title: "",
    description: "",
    startsAt: toLocalInput(start),
    endsAt: toLocalInput(addMinutes(start, 30)),
    color: "blue",
  };
}

function EventDialog({
  open,
  date,
  event,
  onOpenChange,
}: {
  open: boolean;
  date: Date;
  event: CalendarEvent | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { createEvent, updateEvent, deleteEvent } = useLocalState();
  const [draft, setDraft] = useState(() => createDraft(date, event ?? undefined));
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const submit = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    const startsAt = new Date(draft.startsAt);
    const endsAt = new Date(draft.endsAt);

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime())
    ) {
      setErrors({
        startsAt: Number.isNaN(startsAt.getTime())
          ? ["Choose a start date and time."]
          : undefined,
        endsAt: Number.isNaN(endsAt.getTime())
          ? ["Choose an end date and time."]
          : undefined,
      });
      return;
    }

    const input: CalendarEventInput = {
      title: draft.title,
      description: draft.description,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      color: draft.color,
    };
    const parsed = calendarEventSchema.safeParse({
      ...input,
      id: event?.id ?? "new-event",
    });

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    const saved = event
      ? updateEvent(event.id, input)
      : createEvent(input);
    if (saved) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Add event"}</DialogTitle>
          <DialogDescription>
            Events are saved to this browser and appear on your dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title" error={errors.title?.[0]}>
            <Input
              value={draft.title}
              onChange={(changeEvent) =>
                setDraft((current) => ({
                  ...current,
                  title: changeEvent.target.value,
                }))
              }
              autoFocus
            />
          </Field>
          <Field label="Description" error={errors.description?.[0]}>
            <Textarea
              value={draft.description}
              onChange={(changeEvent) =>
                setDraft((current) => ({
                  ...current,
                  description: changeEvent.target.value,
                }))
              }
              rows={3}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starts" error={errors.startsAt?.[0]}>
              <Input
                type="datetime-local"
                value={draft.startsAt}
                onChange={(changeEvent) =>
                  setDraft((current) => ({
                    ...current,
                    startsAt: changeEvent.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Ends" error={errors.endsAt?.[0]}>
              <Input
                type="datetime-local"
                value={draft.endsAt}
                onChange={(changeEvent) =>
                  setDraft((current) => ({
                    ...current,
                    endsAt: changeEvent.target.value,
                  }))
                }
              />
            </Field>
          </div>
          <Field label="Color">
            <div className="flex gap-2">
              {eventColorSchema.options.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({ ...current, color }))
                  }
                  className={cn(
                    "size-8 rounded-full border-4 border-background ring-offset-2 transition-transform hover:scale-110",
                    eventStyles[color],
                    draft.color === color && "ring-2 ring-ring",
                  )}
                  aria-label={`Use ${color}`}
                  aria-pressed={draft.color === color}
                />
              ))}
            </div>
          </Field>
          <DialogFooter className="mt-5">
            {event && (
              <Button
                type="button"
                variant="destructive"
                className="sm:mr-auto"
                onClick={() => {
                  deleteEvent(event.id);
                  onOpenChange(false);
                }}
              >
                <Trash2 />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{event ? "Save changes" : "Add event"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
      <div className="h-[42rem] animate-pulse rounded-2xl bg-muted" />
      <div className="h-96 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

export function CalendarContent() {
  const { state, hydrated } = useLocalState();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
      }),
    [month],
  );

  const sortedEvents = useMemo(
    () =>
      [...state.events].sort(
        (left, right) =>
          new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
      ),
    [state.events],
  );

  const selectedEvents = sortedEvents.filter((event) =>
    isSameDay(new Date(event.startsAt), selectedDate),
  );

  const openNewEvent = (date = selectedDate) => {
    setSelectedDate(startOfDay(date));
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const openEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(startOfDay(new Date(event.startsAt)));
    setDialogOpen(true);
  };

  if (!hydrated) return <CalendarSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Local calendar
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Protect time for what matters
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan events on this device. No account or connection required.
          </p>
        </div>
        <Button onClick={() => openNewEvent()}>
          <Plus />
          Add event
        </Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="min-w-0">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>{format(month, "MMMM yyyy")}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {state.events.length} event{state.events.length === 1 ? "" : "s"}{" "}
                stored locally
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setMonth(startOfMonth(today));
                  setSelectedDate(startOfDay(today));
                }}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMonth((current) => subMonths(current, 1))}
                aria-label="Previous month"
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMonth((current) => addMonths(current, 1))}
                aria-label="Next month"
              >
                <ChevronRight />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border">
              <div className="min-w-[44rem]">
                <div className="grid grid-cols-7 border-b bg-muted/50">
                  {weekdays.map((weekday) => (
                    <div
                      key={weekday}
                      className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {weekday}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {days.map((day) => {
                    const dayEvents = sortedEvents.filter((event) =>
                      isSameDay(new Date(event.startsAt), day),
                    );
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => setSelectedDate(startOfDay(day))}
                        onDoubleClick={() => openNewEvent(day)}
                        className={cn(
                          "min-h-28 border-r border-b p-2 text-left transition-colors hover:bg-muted/40",
                          !isSameMonth(day, month) && "bg-muted/25 text-muted-foreground",
                          isSameDay(day, selectedDate) && "bg-primary/5 ring-2 ring-inset ring-primary/25",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-7 place-items-center rounded-full text-xs font-medium",
                            isToday(day) && "bg-primary text-primary-foreground",
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        <span className="mt-2 block space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <span
                              key={event.id}
                              className={cn(
                                "block truncate rounded-md border px-1.5 py-1 text-[11px] font-medium",
                                eventSurfaceStyles[event.color],
                              )}
                            >
                              {format(new Date(event.startsAt), "h:mm")}{" "}
                              {event.title}
                            </span>
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="block px-1 text-[10px] text-muted-foreground">
                              +{dayEvents.length - 3} more
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>{format(selectedDate, "EEEE")}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </div>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => openNewEvent()}
              aria-label="Add event on selected day"
            >
              <Plus />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedEvents.length ? (
              selectedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  className="w-full rounded-xl border p-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-1 size-2.5 shrink-0 rounded-full",
                        eventStyles[event.color],
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{event.title}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="size-3" />
                        {format(new Date(event.startsAt), "h:mm a")} –{" "}
                        {format(new Date(event.endsAt), "h:mm a")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {differenceInMinutes(
                          new Date(event.endsAt),
                          new Date(event.startsAt),
                        )}{" "}
                        min
                      </p>
                    </div>
                    <Pencil className="size-3.5 text-muted-foreground" />
                  </div>
                </button>
              ))
            ) : (
              <div className="grid min-h-52 place-items-center rounded-xl border border-dashed p-6 text-center">
                <div>
                  <CalendarDays className="mx-auto size-6 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">No events this day</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add an event or select another date.
                  </p>
                  <Button className="mt-4" size="sm" onClick={() => openNewEvent()}>
                    <Plus />
                    Add event
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {dialogOpen && (
        <EventDialog
          key={`${editingEvent?.id ?? "new"}-${selectedDate.toISOString()}`}
          open={dialogOpen}
          date={selectedDate}
          event={editingEvent}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
