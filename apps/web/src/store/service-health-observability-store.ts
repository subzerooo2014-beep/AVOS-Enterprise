"use client";

import { create } from "zustand";

type ServiceHealthStore = {
  query: string;
  domain: string;
  status: string;
  selectedServiceId: string | null;
  unhealthyOnly: boolean;
  setQuery: (value: string) => void;
  setDomain: (value: string) => void;
  setStatus: (value: string) => void;
  selectService: (value: string | null) => void;
  toggleUnhealthyOnly: () => void;
  reset: () => void;
};

export const useServiceHealthObservabilityStore =
  create<ServiceHealthStore>((set) => ({
    query: "",
    domain: "all",
    status: "all",
    selectedServiceId: null,
    unhealthyOnly: false,
    setQuery: (query) => set({ query }),
    setDomain: (domain) => set({ domain }),
    setStatus: (status) => set({ status }),
    selectService: (selectedServiceId) => set({ selectedServiceId }),
    toggleUnhealthyOnly: () =>
      set((state) => ({ unhealthyOnly: !state.unhealthyOnly })),
    reset: () =>
      set({
        query: "",
        domain: "all",
        status: "all",
        unhealthyOnly: false,
      }),
  }));
