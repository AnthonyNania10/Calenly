import { describe, expect, it } from "vitest";

import {
  LOCAL_STATE_KEY,
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
