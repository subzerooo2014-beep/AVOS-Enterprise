"use client";

import { create } from "zustand";

type RevenueMarginStore = {
  query: string;
  status: string;
  pricingMode: string;
  selectedRecordId: string | null;
  opportunityOnly: boolean;
  setQuery: (value: string) => void;
  setStatus: (value: string) => void;
  setPricingMode: (value: string) => void;
  selectRecord: (value: string | null) => void;
  toggleOpportunityOnly: () => void;
  reset: () => void;
};

export const useRevenueMarginIntelligenceStore =
  create<RevenueMarginStore>((set) => ({
    query: "",
    status: "all",
    pricingMode: "all",
    selectedRecordId: null,
    opportunityOnly: false,
    setQuery: (query) => set({ query }),
    setStatus: (status) => set({ status }),
    setPricingMode: (pricingMode) => set({ pricingMode }),
    selectRecord: (selectedRecordId) => set({ selectedRecordId }),
    toggleOpportunityOnly: () =>
      set((state) => ({ opportunityOnly: !state.opportunityOnly })),
    reset: () =>
      set({
        query: "",
        status: "all",
        pricingMode: "all",
        opportunityOnly: false,
      }),
  }));
