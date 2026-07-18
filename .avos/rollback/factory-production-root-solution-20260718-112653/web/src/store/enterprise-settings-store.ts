"use client";

import { create } from "zustand";

type SettingsStore = {
  category: string;
  query: string;
  setCategory: (value: string) => void;
  setQuery: (value: string) => void;
  reset: () => void;
};

export const useEnterpriseSettingsStore = create<SettingsStore>((set) => ({
  category: "all",
  query: "",
  setCategory: (category) => set({ category }),
  setQuery: (query) => set({ query }),
  reset: () => set({ category: "all", query: "" }),
}));
