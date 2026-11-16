import { z } from "zod";

export const LOCAL_STATE_KEY = "opencal.local-state";
export const LOCAL_STATE_VERSION = 1;

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

export const localStateSchema = z.object({
  version: z.literal(LOCAL_STATE_VERSION),
  profile: profileSchema,
  requests: z.array(demoRequestSchema),
});

export type LocalProfile = z.infer<typeof profileSchema>;
export type DemoRequest = z.infer<typeof demoRequestSchema>;
export type LocalState = z.infer<typeof localStateSchema>;

export const defaultProfile: LocalProfile = {
  fullName: "Alex Morgan",
  username: "alex",
  email: "alex@example.com",
  avatarUrl: "",
  bio: "Independent designer protecting time for focused, thoughtful work.",
  timezone: "America/New_York",
};

export const createDefaultState = (): LocalState => ({
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
});

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type LoadResult = {
  state: LocalState;
  source: "stored" | "default" | "recovered";
};

export function loadLocalState(storage?: StorageLike | null): LoadResult {
  if (!storage) {
    return { state: createDefaultState(), source: "default" };
  }

  try {
    const raw = storage.getItem(LOCAL_STATE_KEY);
    if (!raw) {
      return { state: createDefaultState(), source: "default" };
    }

    const parsed = localStateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return { state: createDefaultState(), source: "recovered" };
    }

    return { state: parsed.data, source: "stored" };
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
