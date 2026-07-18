"use client";

import { create } from "zustand";

type RecoveryResilienceStore = {
  query: string;
  status: string;
  severity: string;
  selectedScenarioId: string | null;
  attentionOnly: boolean;
  setQuery: (value: string) => void;
  setStatus: (value: string) => void;
  setSeverity: (value: string) => void;
  selectScenario: (value: string | null) => void;
  toggleAttentionOnly: () => void;
  reset: () => void;
};

export const useRecoveryResilienceCenterStore =
  create<RecoveryResilienceStore>((set) => ({
    query: "",
    status: "all",
    severity: "all",
    selectedScenarioId: null,
    attentionOnly: false,
    setQuery: (query) => set({ query }),
    setStatus: (status) => set({ status }),
    setSeverity: (severity) => set({ severity }),
    selectScenario: (selectedScenarioId) => set({ selectedScenarioId }),
    toggleAttentionOnly: () =>
      set((state) => ({ attentionOnly: !state.attentionOnly })),
    reset: () =>
      set({
        query: "",
        status: "all",
        severity: "all",
        attentionOnly: false,
      }),
  }));
