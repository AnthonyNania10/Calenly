"use client";

import { format } from "date-fns";
import {
  CalendarCheck2,
  Check,
  Clock3,
  Inbox,
  RotateCcw,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

import { useLocalState } from "@/components/local-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DemoRequest } from "@/lib/local-state";
import { cn } from "@/lib/utils";

const filters: Array<{
  value: DemoRequest["status"];
  label: string;
}> = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

const statusStyles: Record<DemoRequest["status"], string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-900",
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-900",
  declined: "border-border bg-muted text-muted-foreground",
};

function RequestsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export function RequestsContent() {
  const { state, hydrated, updateRequest, deleteRequest } = useLocalState();
  const [filter, setFilter] = useState<DemoRequest["status"]>("pending");
  const visible = state.requests
    .filter((request) => request.status === filter)
    .sort(
      (left, right) =>
        new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
    );

  if (!hydrated) return <RequestsSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Request center
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Decide who gets your time
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Review booking requests. Accepted times are added to your local
            calendar automatically.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-card p-1">
          {filters.map(({ value, label }) => {
            const count = state.requests.filter(
              (request) => request.status === value,
            ).length;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors",
                  filter === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {label}
                <span
                  className={cn(
                    "grid min-w-5 place-items-center rounded-full px-1 text-[10px]",
                    filter === value ? "bg-white/20" : "bg-muted",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {filters.map(({ value, label }) => (
          <Card key={value} size="sm">
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold">
                  {
                    state.requests.filter((request) => request.status === value)
                      .length
                  }
                </p>
              </div>
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-xl border",
                  statusStyles[value],
                )}
              >
                {value === "pending" && <Clock3 className="size-4" />}
                {value === "accepted" && <Check className="size-4" />}
                {value === "declined" && <X className="size-4" />}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {visible.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((request) => (
            <Card key={request.id}>
              <CardHeader className="flex-row items-start justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="truncate">{request.title}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Requested by {request.guestName}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={statusStyles[request.status]}>
                  {request.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                  <CalendarCheck2 className="size-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(request.startsAt), "EEEE, MMMM d")}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {format(new Date(request.startsAt), "h:mm a")} · 30 minutes
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        onClick={() => updateRequest(request.id, "accepted")}
                      >
                        <Check />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateRequest(request.id, "declined")}
                      >
                        <X />
                        Decline
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => updateRequest(request.id, "pending")}
                    >
                      <RotateCcw />
                      Move to pending
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => deleteRequest(request.id)}
                    aria-label={`Delete ${request.title}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="grid min-h-80 place-items-center p-8 text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Inbox className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">No {filter} requests</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {filter === "pending"
                  ? "You are all caught up. New demo requests will appear here."
                  : `Requests you mark as ${filter} will be collected here.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
