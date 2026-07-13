"use client";

import { create } from "zustand";

type ReleaseDeploymentStore = {
  query: string;
  environment: string;
  status: string;
  selectedReleaseId: string | null;
  productionOnly: boolean;
  setQuery: (value: string) => void;
  setEnvironment: (value: string) => void;
  setStatus: (value: string) => void;
  selectRelease: (value: string | null) => void;
  toggleProductionOnly: () => void;
  reset: () => void;
};

export const useReleaseDeploymentCenterStore =
  create<ReleaseDeploymentStore>((set) => ({
    query: "",
    environment: "all",
    status: "all",
    selectedReleaseId: null,
    productionOnly: false,
    setQuery: (query) => set({ query }),
    setEnvironment: (environment) => set({ environment }),
    setStatus: (status) => set({ status }),
    selectRelease: (selectedReleaseId) => set({ selectedReleaseId }),
    toggleProductionOnly: () =>
      set((state) => ({ productionOnly: !state.productionOnly })),
    reset: () =>
      set({
        query: "",
        environment: "all",
        status: "all",
        productionOnly: false,
      }),
  }));
