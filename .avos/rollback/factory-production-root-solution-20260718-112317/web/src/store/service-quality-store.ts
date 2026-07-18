"use client";

import { create } from "zustand";
import {
  QualityCaseSeverity,
  QualityCaseStatus,
} from "@/data/service-quality";

type ServiceQualityState = {
  query: string;
  status: QualityCaseStatus | "all";
  severity: QualityCaseSeverity | "all";
  city: string;
  selectedCaseId: string | null;
  setQuery: (query: string) => void;
  setStatus: (status: QualityCaseStatus | "all") => void;
  setSeverity: (severity: QualityCaseSeverity | "all") => void;
  setCity: (city: string) => void;
  selectCase: (caseId: string | null) => void;
  resetFilters: () => void;
};

export const useServiceQualityStore = create<ServiceQualityState>((set) => ({
  query: "",
  status: "all",
  severity: "all",
  city: "all",
  selectedCaseId: null,
  setQuery: (query) => set({ query }),
  setStatus: (status) => set({ status }),
  setSeverity: (severity) => set({ severity }),
  setCity: (city) => set({ city }),
  selectCase: (selectedCaseId) => set({ selectedCaseId }),
  resetFilters: () =>
    set({
      query: "",
      status: "all",
      severity: "all",
      city: "all",
    }),
}));
