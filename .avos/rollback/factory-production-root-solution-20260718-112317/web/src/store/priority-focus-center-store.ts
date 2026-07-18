"use client";

import { create } from "zustand";

type PriorityFocusStore = {
  query: string;
  category: string;
  status: string;
  selectedPriorityId: string | null;
  criticalOnly: boolean;
  setQuery: (value: string) => void;
  setCategory: (value: string) => void;
  setStatus: (value: string) => void;
  selectPriority: (value: string | null) => void;
  toggleCriticalOnly: () => void;
  reset: () => void;
};

export const usePriorityFocusCenterStore = create<PriorityFocusStore>((set) => ({
  query: "",
  category: "all",
  status: "all",
  selectedPriorityId: null,
  criticalOnly: false,
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setStatus: (status) => set({ status }),
  selectPriority: (selectedPriorityId) => set({ selectedPriorityId }),
  toggleCriticalOnly: () =>
    set((state) => ({ criticalOnly: !state.criticalOnly })),
  reset: () =>
    set({
      query: "",
      category: "all",
      status: "all",
      criticalOnly: false,
    }),
}));
