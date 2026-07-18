"use client";

import { create } from "zustand";
import {
  ProviderRisk,
  ProviderStatus,
} from "@/data/service-provider-performance";

type ProviderPerformanceState = {
  query: string;
  city: string;
  risk: ProviderRisk | "all";
  status: ProviderStatus | "all";
  selectedProviderId: string | null;
  setQuery: (query: string) => void;
  setCity: (city: string) => void;
  setRisk: (risk: ProviderRisk | "all") => void;
  setStatus: (status: ProviderStatus | "all") => void;
  selectProvider: (providerId: string | null) => void;
  resetFilters: () => void;
};

export const useServiceProviderPerformanceStore =
  create<ProviderPerformanceState>((set) => ({
    query: "",
    city: "all",
    risk: "all",
    status: "all",
    selectedProviderId: null,
    setQuery: (query) => set({ query }),
    setCity: (city) => set({ city }),
    setRisk: (risk) => set({ risk }),
    setStatus: (status) => set({ status }),
    selectProvider: (selectedProviderId) => set({ selectedProviderId }),
    resetFilters: () =>
      set({
        query: "",
        city: "all",
        risk: "all",
        status: "all",
      }),
  }));
