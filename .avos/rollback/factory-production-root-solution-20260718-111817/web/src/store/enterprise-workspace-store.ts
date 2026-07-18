"use client";

import { create } from "zustand";

type WorkspaceState = {
  query: string;
  commandOpen: boolean;
  notificationsOpen: boolean;
  activityOpen: boolean;
  favoritesOnly: boolean;
  setQuery: (value: string) => void;
  toggleCommand: () => void;
  toggleNotifications: () => void;
  toggleActivity: () => void;
  toggleFavorites: () => void;
  closePanels: () => void;
};

export const useEnterpriseWorkspaceStore = create<WorkspaceState>((set) => ({
  query: "",
  commandOpen: false,
  notificationsOpen: false,
  activityOpen: false,
  favoritesOnly: false,
  setQuery: (query) => set({ query }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen, activityOpen: false })),
  toggleActivity: () => set((s) => ({ activityOpen: !s.activityOpen, notificationsOpen: false })),
  toggleFavorites: () => set((s) => ({ favoritesOnly: !s.favoritesOnly })),
  closePanels: () => set({ commandOpen: false, notificationsOpen: false, activityOpen: false }),
}));
