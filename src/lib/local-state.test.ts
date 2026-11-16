import { describe, expect, it } from "vitest";

import {
  LOCAL_STATE_KEY,
  calendarEventSchema,
  createDefaultState,
  loadLocalState,
  profileSchema,
  resetLocalState,
  saveLocalState,
  type StorageLike,
} from "@/lib/local-state";

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

describe("local state persistence", () => {
  it("returns independent defaults when storage is empty", () => {
    const storage = new MemoryStorage();
    const first = loadLocalState(storage);
    const second = loadLocalState(storage);

    expect(first.source).toBe("default");
    expect(first.state).toEqual(createDefaultState());
    expect(first.state).not.toBe(second.state);
  });

  it("round-trips a valid versioned state", () => {
    const storage = new MemoryStorage();
    const state = createDefaultState();
    state.profile.fullName = "Taylor Reed";

    expect(saveLocalState(storage, state)).toBe(true);
    expect(loadLocalState(storage)).toEqual({ state, source: "stored" });
  });

  it("recovers from invalid JSON and version mismatches", () => {
    const storage = new MemoryStorage();
    storage.setItem(LOCAL_STATE_KEY, "{not json");
    expect(loadLocalState(storage).source).toBe("recovered");

    storage.setItem(
      LOCAL_STATE_KEY,
      JSON.stringify({ ...createDefaultState(), version: 99 }),
    );
    expect(loadLocalState(storage).source).toBe("recovered");
  });

  it("migrates version 1 data without losing the profile or requests", () => {
    const storage = new MemoryStorage();
    const current = createDefaultState(new Date("2026-11-16T12:00:00.000Z"));
    const legacy = {
      version: 1,
      profile: { ...current.profile, fullName: "Legacy User" },
      requests: current.requests,
    };
    storage.setItem(LOCAL_STATE_KEY, JSON.stringify(legacy));

    const result = loadLocalState(storage);

    expect(result.source).toBe("migrated");
    expect(result.state.profile.fullName).toBe("Legacy User");
    expect(result.state.requests).toEqual(legacy.requests);
    expect(result.state.events.length).toBeGreaterThan(0);
  });

  it("recovers when browser storage is unavailable", () => {
    const unavailable: StorageLike = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    };

    expect(loadLocalState(unavailable).source).toBe("recovered");
    expect(saveLocalState(unavailable, createDefaultState())).toBe(false);
    expect(resetLocalState(unavailable)).toEqual(createDefaultState());
  });

  it("removes stored state on reset", () => {
    const storage = new MemoryStorage();
    saveLocalState(storage, createDefaultState());

    expect(resetLocalState(storage)).toEqual(createDefaultState());
    expect(storage.getItem(LOCAL_STATE_KEY)).toBeNull();
  });
});

describe("profile validation", () => {
  it("normalizes usernames and email addresses", () => {
    const parsed = profileSchema.parse({
      ...createDefaultState().profile,
      username: "  Alex_Smith ",
      email: " ALEX@EXAMPLE.COM ",
    });

    expect(parsed.username).toBe("alex_smith");
    expect(parsed.email).toBe("alex@example.com");
  });

  it("rejects unsafe usernames, avatar URLs, and invalid email", () => {
    const parsed = profileSchema.safeParse({
      ...createDefaultState().profile,
      username: "../admin",
      email: "not-an-email",
      avatarUrl: "http://example.com/avatar.png",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors).toMatchObject({
        username: expect.any(Array),
        email: expect.any(Array),
        avatarUrl: expect.any(Array),
      });
    }
  });
});

describe("calendar event validation", () => {
  const validEvent = {
    id: "event-1",
    title: "Planning session",
    description: "Outline the next product slice.",
    startsAt: "2026-11-17T16:00:00.000Z",
    endsAt: "2026-11-17T16:30:00.000Z",
    color: "blue" as const,
  };

  it("accepts a complete event with a positive duration", () => {
    expect(calendarEventSchema.parse(validEvent)).toEqual(validEvent);
  });

  it("rejects an empty title and an end before the start", () => {
    const parsed = calendarEventSchema.safeParse({
      ...validEvent,
      title: "",
      endsAt: "2026-11-17T15:30:00.000Z",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors).toMatchObject({
        title: expect.any(Array),
        endsAt: expect.any(Array),
      });
    }
  });
});
