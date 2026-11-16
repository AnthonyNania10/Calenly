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
  createDefaultState,
  loadLocalState,
  profileSchema,
  resetLocalState,
  saveLocalState,
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
      persist({
        ...state,
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, status } : request,
        ),
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
      reset,
    }),
    [hydrated, recovered, reset, state, updateProfile, updateRequest],
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
