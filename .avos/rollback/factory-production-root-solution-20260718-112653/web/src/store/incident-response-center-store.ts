"use client";

import { create } from "zustand";

type IncidentResponseStore = {
  query: string;
  severity: string;
  status: string;
  selectedIncidentId: string | null;
  unresolvedOnly: boolean;
  setQuery: (value: string) => void;
  setSeverity: (value: string) => void;
  setStatus: (value: string) => void;
  selectIncident: (value: string | null) => void;
  toggleUnresolvedOnly: () => void;
  reset: () => void;
};

export const useIncidentResponseCenterStore =
  create<IncidentResponseStore>((set) => ({
    query: "",
    severity: "all",
    status: "all",
    selectedIncidentId: null,
    unresolvedOnly: false,
    setQuery: (query) => set({ query }),
    setSeverity: (severity) => set({ severity }),
    setStatus: (status) => set({ status }),
    selectIncident: (selectedIncidentId) => set({ selectedIncidentId }),
    toggleUnresolvedOnly: () =>
      set((state) => ({ unresolvedOnly: !state.unresolvedOnly })),
    reset: () =>
      set({
        query: "",
        severity: "all",
        status: "all",
        unresolvedOnly: false,
      }),
  }));
