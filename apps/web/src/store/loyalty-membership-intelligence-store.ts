"use client";

import { create } from "zustand";

type LoyaltyStore = {
  query: string;
  tier: string;
  status: string;
  selectedMemberId: string | null;
  upgradeReadyOnly: boolean;
  setQuery: (value: string) => void;
  setTier: (value: string) => void;
  setStatus: (value: string) => void;
  selectMember: (value: string | null) => void;
  toggleUpgradeReadyOnly: () => void;
  reset: () => void;
};

export const useLoyaltyMembershipIntelligenceStore =
  create<LoyaltyStore>((set) => ({
    query: "",
    tier: "all",
    status: "all",
    selectedMemberId: null,
    upgradeReadyOnly: false,
    setQuery: (query) => set({ query }),
    setTier: (tier) => set({ tier }),
    setStatus: (status) => set({ status }),
    selectMember: (selectedMemberId) => set({ selectedMemberId }),
    toggleUpgradeReadyOnly: () =>
      set((state) => ({ upgradeReadyOnly: !state.upgradeReadyOnly })),
    reset: () =>
      set({
        query: "",
        tier: "all",
        status: "all",
        upgradeReadyOnly: false,
      }),
  }));
