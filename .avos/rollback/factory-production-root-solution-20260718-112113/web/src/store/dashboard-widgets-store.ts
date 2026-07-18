"use client";

import { create } from "zustand";

type WidgetStore = {
  category: string;
  pinnedOnly: boolean;
  compactMode: boolean;
  setCategory: (category: string) => void;
  togglePinnedOnly: () => void;
  toggleCompactMode: () => void;
};

export const useDashboardWidgetsStore = create<WidgetStore>((set) => ({
  category: "all",
  pinnedOnly: false,
  compactMode: false,
  setCategory: (category) => set({ category }),
  togglePinnedOnly: () => set((state) => ({ pinnedOnly: !state.pinnedOnly })),
  toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
}));
