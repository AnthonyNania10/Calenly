"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  availabilitySchema,
  calendarEventSchema,
  createDefaultState,
  loadLocalState,
  profileSchema,
  removeRequest,
  resetLocalState,
  saveLocalState,
  setRequestStatus,
  type Availability,
  type CalendarEventInput,
  type LocalProfile,
  type LocalState,
} from "@/lib/local-state";

type LocalStateContextValue = {
  state: LocalState;
  hydrated: boolean;
  recovered: boolean;
  updateProfile: (profile: LocalProfile) => boolean;
  updateRequest: (
    id: string,
    status: "pending" | "accepted" | "declined",
  ) => void;
  deleteRequest: (id: string) => void;
  updateAvailability: (availability: Availability) => boolean;
  createEvent: (event: CalendarEventInput) => boolean;
  updateEvent: (id: string, event: CalendarEventInput) => boolean;
  deleteEvent: (id: string) => void;
  reset: () => void;
};

const LocalStateContext = createContext<LocalStateContextValue | null>(null);

const browserStorage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export function LocalStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LocalState>(createDefaultState);
  const [hydrated, setHydrated] = useState(false);
  const [recovered, setRecovered] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const result = loadLocalState(browserStorage());
      setState(result.state);
      setRecovered(result.source === "recovered");
      setHydrated(true);
      if (result.source === "migrated") {
        saveLocalState(browserStorage(), result.state);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const persist = useCallback((next: LocalState) => {
    setState(next);
    saveLocalState(browserStorage(), next);
  }, []);

  const updateProfile = useCallback(
    (profile: LocalProfile) => {
      const parsed = profileSchema.safeParse(profile);
      if (!parsed.success) return false;
      persist({ ...state, profile: parsed.data });
      return true;
    },
    [persist, state],
  );

  const updateRequest = useCallback(
    (id: string, status: "pending" | "accepted" | "declined") => {
      persist(setRequestStatus(state, id, status));
    },
    [persist, state],
  );

  const deleteRequest = useCallback(
    (id: string) => {
      persist(removeRequest(state, id));
    },
    [persist, state],
  );

  const updateAvailability = useCallback(
    (availability: Availability) => {
      const parsed = availabilitySchema.safeParse(availability);
      if (!parsed.success) return false;
      persist({ ...state, availability: parsed.data });
      return true;
    },
    [persist, state],
  );

  const createEvent = useCallback(
    (event: CalendarEventInput) => {
      const parsed = calendarEventSchema.safeParse({
        ...event,
        id: crypto.randomUUID(),
      });
      if (!parsed.success) return false;
      persist({ ...state, events: [...state.events, parsed.data] });
      return true;
    },
    [persist, state],
  );

  const updateEvent = useCallback(
    (id: string, event: CalendarEventInput) => {
      const parsed = calendarEventSchema.safeParse({ ...event, id });
      if (!parsed.success) return false;
      persist({
        ...state,
        events: state.events.map((item) =>
          item.id === id ? parsed.data : item,
        ),
      });
      return true;
    },
    [persist, state],
  );

  const deleteEvent = useCallback(
    (id: string) => {
      persist({
        ...state,
        events: state.events.filter((event) => event.id !== id),
      });
    },
    [persist, state],
  );

  const reset = useCallback(() => {
    const next = resetLocalState(browserStorage());
    setState(next);
    setRecovered(false);
  }, []);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      recovered,
      updateProfile,
      updateRequest,
      deleteRequest,
      updateAvailability,
      createEvent,
      updateEvent,
      deleteEvent,
      reset,
    }),
    [
      createEvent,
      deleteEvent,
      deleteRequest,
      hydrated,
      recovered,
      reset,
      state,
      updateEvent,
      updateAvailability,
      updateProfile,
      updateRequest,
    ],
  );

  return (
    <LocalStateContext.Provider value={value}>
      {children}
    </LocalStateContext.Provider>
  );
}

export function useLocalState() {
  const value = useContext(LocalStateContext);
  if (!value) {
    throw new Error("useLocalState must be used inside LocalStateProvider.");
  }
  return value;
}
