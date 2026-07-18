"use client";

import { create } from "zustand";

type CustomerValueStore = {
  query: string;
  segment: string;
  selectedCustomerId: string | null;
  highRiskOnly: boolean;
  setQuery: (value: string) => void;
  setSegment: (value: string) => void;
  selectCustomer: (value: string | null) => void;
  toggleHighRiskOnly: () => void;
  reset: () => void;
};

export const useCustomerValueRetentionStore =
  create<CustomerValueStore>((set) => ({
    query: "",
    segment: "all",
    selectedCustomerId: null,
    highRiskOnly: false,
    setQuery: (query) => set({ query }),
    setSegment: (segment) => set({ segment }),
    selectCustomer: (selectedCustomerId) => set({ selectedCustomerId }),
    toggleHighRiskOnly: () =>
      set((state) => ({ highRiskOnly: !state.highRiskOnly })),
    reset: () =>
      set({
        query: "",
        segment: "all",
        highRiskOnly: false,
      }),
  }));
