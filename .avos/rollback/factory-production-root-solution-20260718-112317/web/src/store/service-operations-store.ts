"use client";

import { create } from "zustand";
import {
  ServiceRequestPriority,
  ServiceRequestStatus,
} from "@/data/service-operations";

type ServiceOperationsState = {
  query: string;
  status: ServiceRequestStatus | "all";
  priority: ServiceRequestPriority | "all";
  city: string;
  selectedRequestId: string | null;
  setQuery: (query: string) => void;
  setStatus: (status: ServiceRequestStatus | "all") => void;
  setPriority: (priority: ServiceRequestPriority | "all") => void;
  setCity: (city: string) => void;
  selectRequest: (requestId: string | null) => void;
  resetFilters: () => void;
};

export const useServiceOperationsStore =
  create<ServiceOperationsState>((set) => ({
    query: "",
    status: "all",
    priority: "all",
    city: "all",
    selectedRequestId: null,
    setQuery: (query) => set({ query }),
    setStatus: (status) => set({ status }),
    setPriority: (priority) => set({ priority }),
    setCity: (city) => set({ city }),
    selectRequest: (selectedRequestId) => set({ selectedRequestId }),
    resetFilters: () =>
      set({
        query: "",
        status: "all",
        priority: "all",
        city: "all",
      }),
  }));
