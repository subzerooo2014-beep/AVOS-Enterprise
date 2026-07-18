"use client";

import { create } from "zustand";

type CapacityDemandStore = {
  query: string;
  status: string;
  region: string;
  selectedRecordId: string | null;
  criticalOnly: boolean;
  setQuery: (value: string) => void;
  setStatus: (value: string) => void;
  setRegion: (value: string) => void;
  selectRecord: (value: string | null) => void;
  toggleCriticalOnly: () => void;
  reset: () => void;
};

export const useCapacityDemandIntelligenceStore =
  create<CapacityDemandStore>((set) => ({
    query: "",
    status: "all",
    region: "all",
    selectedRecordId: null,
    criticalOnly: false,
    setQuery: (query) => set({ query }),
    setStatus: (status) => set({ status }),
    setRegion: (region) => set({ region }),
    selectRecord: (selectedRecordId) => set({ selectedRecordId }),
    toggleCriticalOnly: () =>
      set((state) => ({ criticalOnly: !state.criticalOnly })),
    reset: () =>
      set({
        query: "",
        status: "all",
        region: "all",
        criticalOnly: false,
      }),
  }));
