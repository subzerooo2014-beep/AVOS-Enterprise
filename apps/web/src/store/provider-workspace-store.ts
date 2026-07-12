"use client";

import { create } from "zustand";

interface ProviderWorkspaceState {
  activeBranchId: string;
  selectedDate: string;
  setActiveBranch: (branchId: string) => void;
  setSelectedDate: (date: string) => void;
}

export const useProviderWorkspaceStore = create<ProviderWorkspaceState>((set) => ({
  activeBranchId: "all",
  selectedDate: "2026-07-13",
  setActiveBranch: (activeBranchId) => set({ activeBranchId }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
