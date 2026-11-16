import { z } from "zod";
import { addDays, addMinutes, set, startOfDay } from "date-fns";

export const LOCAL_STATE_KEY = "opencal.local-state";
export const LOCAL_STATE_VERSION = 2;

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(100, "Keep your name under 100 characters."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Use at least 3 characters.")
    .max(30, "Use 30 characters or fewer.")
    .regex(
      /^[a-z0-9][a-z0-9_-]*$/,
      "Use lowercase letters, numbers, underscores, or hyphens.",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),
  avatarUrl: z
    .string()
    .trim()
    .max(500, "Keep the avatar URL under 500 characters.")
    .refine(
      (value) => value === "" || value.startsWith("https://"),
      "Use an https:// avatar URL.",
    ),
  bio: z.string().trim().max(280, "Keep your bio under 280 characters."),
  timezone: z.string().trim().min(1, "Choose a timezone.").max(100),
});

export const requestStatusSchema = z.enum(["pending", "accepted", "declined"]);

export const demoRequestSchema = z.object({
  id: z.string(),
  guestName: z.string(),
  title: z.string(),
  startsAt: z.string().datetime(),
  status: requestStatusSchema,
});

export const eventColorSchema = z.enum([
  "blue",
  "violet",
  "emerald",
  "amber",
  "rose",
]);

export const calendarEventSchema = z
  .object({
    id: z.string().min(1),
    title: z
      .string()
      .trim()
      .min(1, "Enter an event title.")
      .max(100, "Keep the title under 100 characters."),
    description: z
      .string()
      .trim()
      .max(500, "Keep the description under 500 characters."),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    color: eventColorSchema,
  })
  .refine((event) => new Date(event.endsAt) > new Date(event.startsAt), {
    message: "End time must be after start time.",
    path: ["endsAt"],
  });

export const localStateSchema = z.object({
  version: z.literal(LOCAL_STATE_VERSION),
  profile: profileSchema,
  requests: z.array(demoRequestSchema),
  events: z.array(calendarEventSchema),
});

export type LocalProfile = z.infer<typeof profileSchema>;
export type DemoRequest = z.infer<typeof demoRequestSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type CalendarEventInput = Omit<CalendarEvent, "id">;
export type LocalState = z.infer<typeof localStateSchema>;

export const defaultProfile: LocalProfile = {
  fullName: "Alex Morgan",
  username: "alex",
  email: "alex@example.com",
  avatarUrl: "",
  bio: "Independent designer protecting time for focused, thoughtful work.",
  timezone: "America/New_York",
};

export function createDefaultEvents(reference = new Date()): CalendarEvent[] {
  const today = startOfDay(reference);
  const at = (dayOffset: number, hour: number, minute = 0) =>
    set(addDays(today, dayOffset), {
      hours: hour,
      minutes: minute,
      seconds: 0,
      milliseconds: 0,
    });

  const createEvent = (
    id: string,
    title: string,
    description: string,
    startsAt: Date,
    duration: number,
    color: CalendarEvent["color"],
  ): CalendarEvent => ({
    id,
    title,
    description,
    startsAt: startsAt.toISOString(),
    endsAt: addMinutes(startsAt, duration).toISOString(),
    color,
  });

  return [
    createEvent(
      "event-weekly-planning",
      "Weekly planning",
      "Protect the week’s focus blocks and priorities.",
      at(0, 9, 30),
      45,
      "violet",
    ),
    createEvent(
      "event-product-critique",
      "Product critique",
      "Studio team review.",
      at(0, 11),
      60,
      "blue",
    ),
    createEvent(
      "event-client-kickoff",
      "Client kickoff",
      "Northstar Labs project kickoff.",
      at(0, 14, 30),
      45,
      "emerald",
    ),
    createEvent(
      "event-research-synthesis",
      "Research synthesis",
      "Turn interview notes into themes.",
      at(1, 10),
      60,
      "amber",
    ),
    createEvent(
      "event-mentoring",
      "Mentoring session",
      "Monthly design mentoring conversation.",
      at(3, 13, 30),
      30,
      "rose",
    ),
  ];
}

export const createDefaultState = (reference = new Date()): LocalState => ({
  version: LOCAL_STATE_VERSION,
  profile: { ...defaultProfile },
  requests: [
    {
      id: "request-design-review",
      guestName: "Maya Chen",
      title: "Portfolio design review",
      startsAt: "2026-11-18T15:00:00.000Z",
      status: "pending",
    },
    {
      id: "request-coffee",
      guestName: "Sam Rivera",
      title: "Coffee and catch-up",
      startsAt: "2026-11-20T17:30:00.000Z",
      status: "pending",
    },
  ],
  events: createDefaultEvents(reference),
});

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type LoadResult = {
  state: LocalState;
  source: "stored" | "default" | "migrated" | "recovered";
};

const legacyStateSchema = z.object({
  version: z.literal(1),
  profile: profileSchema,
  requests: z.array(demoRequestSchema),
});

export function loadLocalState(storage?: StorageLike | null): LoadResult {
  if (!storage) {
    return { state: createDefaultState(), source: "default" };
  }

  try {
    const raw = storage.getItem(LOCAL_STATE_KEY);
    if (!raw) {
      return { state: createDefaultState(), source: "default" };
    }

    const value: unknown = JSON.parse(raw);
    const parsed = localStateSchema.safeParse(value);
    if (parsed.success) {
      return { state: parsed.data, source: "stored" };
    }

    const legacy = legacyStateSchema.safeParse(value);
    if (legacy.success) {
      return {
        state: {
          ...legacy.data,
          version: LOCAL_STATE_VERSION,
          events: createDefaultEvents(),
        },
        source: "migrated",
      };
    }

    return { state: createDefaultState(), source: "recovered" };
  } catch {
    return { state: createDefaultState(), source: "recovered" };
  }
}

export function saveLocalState(
  storage: StorageLike | null | undefined,
  state: LocalState,
) {
  if (!storage) return false;

  const parsed = localStateSchema.safeParse(state);
  if (!parsed.success) return false;

  try {
    storage.setItem(LOCAL_STATE_KEY, JSON.stringify(parsed.data));
    return true;
  } catch {
    return false;
  }
}

export function resetLocalState(storage?: StorageLike | null) {
  try {
    storage?.removeItem(LOCAL_STATE_KEY);
  } catch {
    // Reset still returns deterministic defaults if storage is unavailable.
  }
  return createDefaultState();
}
