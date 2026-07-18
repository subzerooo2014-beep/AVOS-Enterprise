"use client";

import { create } from "zustand";

type UserRoleStore = {
  query: string;
  status: string;
  department: string;
  selectedUserId: string | null;
  mfaOnly: boolean;
  setQuery: (value: string) => void;
  setStatus: (value: string) => void;
  setDepartment: (value: string) => void;
  selectUser: (value: string | null) => void;
  toggleMfaOnly: () => void;
  reset: () => void;
};

export const useUserRoleExperienceStore = create<UserRoleStore>((set) => ({
  query: "",
  status: "all",
  department: "all",
  selectedUserId: null,
  mfaOnly: false,
  setQuery: (query) => set({ query }),
  setStatus: (status) => set({ status }),
  setDepartment: (department) => set({ department }),
  selectUser: (selectedUserId) => set({ selectedUserId }),
  toggleMfaOnly: () => set((state) => ({ mfaOnly: !state.mfaOnly })),
  reset: () =>
    set({
      query: "",
      status: "all",
      department: "all",
      mfaOnly: false,
    }),
}));
