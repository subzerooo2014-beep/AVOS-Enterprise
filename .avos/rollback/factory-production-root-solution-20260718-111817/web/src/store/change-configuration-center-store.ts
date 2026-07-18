"use client";

import { create } from "zustand";

type ChangeConfigurationStore = {
  query: string;
  environment: string;
  status: string;
  selectedChangeId: string | null;
  highRiskOnly: boolean;
  setQuery: (value: string) => void;
  setEnvironment: (value: string) => void;
  setStatus: (value: string) => void;
  selectChange: (value: string | null) => void;
  toggleHighRiskOnly: () => void;
  reset: () => void;
};

export const useChangeConfigurationCenterStore =
  create<ChangeConfigurationStore>((set) => ({
    query: "",
    environment: "all",
    status: "all",
    selectedChangeId: null,
    highRiskOnly: false,
    setQuery: (query) => set({ query }),
    setEnvironment: (environment) => set({ environment }),
    setStatus: (status) => set({ status }),
    selectChange: (selectedChangeId) => set({ selectedChangeId }),
    toggleHighRiskOnly: () =>
      set((state) => ({ highRiskOnly: !state.highRiskOnly })),
    reset: () =>
      set({
        query: "",
        environment: "all",
        status: "all",
        highRiskOnly: false,
      }),
  }));
