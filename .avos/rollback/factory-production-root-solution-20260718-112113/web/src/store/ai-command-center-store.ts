"use client";

import { create } from "zustand";

type AiCommandCenterStore = {
  query: string;
  priority: string;
  selectedRecommendationId: string | null;
  chatOpen: boolean;
  setQuery: (value: string) => void;
  setPriority: (value: string) => void;
  selectRecommendation: (value: string | null) => void;
  toggleChat: () => void;
  reset: () => void;
};

export const useAiCommandCenterStore = create<AiCommandCenterStore>((set) => ({
  query: "",
  priority: "all",
  selectedRecommendationId: null,
  chatOpen: false,
  setQuery: (query) => set({ query }),
  setPriority: (priority) => set({ priority }),
  selectRecommendation: (selectedRecommendationId) =>
    set({ selectedRecommendationId }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  reset: () => set({ query: "", priority: "all" }),
}));
