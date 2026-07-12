"use client";

import { create } from "zustand";
import {
  AutomotiveService,
  ServiceCategory,
  ServiceSort,
} from "@/data/services";

interface ServiceMarketplaceState {
  query: string;
  category: ServiceCategory | "";
  city: string;
  mobileOnly: boolean;
  homeOnly: boolean;
  instantOnly: boolean;
  openOnly: boolean;
  minimumRating: number;
  sortBy: ServiceSort;
  selectedService: AutomotiveService | null;
  setQuery: (query: string) => void;
  setCategory: (
    category: ServiceCategory | "",
  ) => void;
  setCity: (city: string) => void;
  setMobileOnly: (value: boolean) => void;
  setHomeOnly: (value: boolean) => void;
  setInstantOnly: (value: boolean) => void;
  setOpenOnly: (value: boolean) => void;
  setMinimumRating: (value: number) => void;
  setSortBy: (value: ServiceSort) => void;
  selectService: (
    service: AutomotiveService | null,
  ) => void;
  reset: () => void;
}

export const useServiceMarketplaceStore =
  create<ServiceMarketplaceState>((set) => ({
    query: "",
    category: "",
    city: "",
    mobileOnly: false,
    homeOnly: false,
    instantOnly: false,
    openOnly: false,
    minimumRating: 0,
    sortBy: "recommended",
    selectedService: null,
    setQuery: (query) => set({ query }),
    setCategory: (category) => set({ category }),
    setCity: (city) => set({ city }),
    setMobileOnly: (mobileOnly) =>
      set({ mobileOnly }),
    setHomeOnly: (homeOnly) => set({ homeOnly }),
    setInstantOnly: (instantOnly) =>
      set({ instantOnly }),
    setOpenOnly: (openOnly) => set({ openOnly }),
    setMinimumRating: (minimumRating) =>
      set({ minimumRating }),
    setSortBy: (sortBy) => set({ sortBy }),
    selectService: (selectedService) =>
      set({ selectedService }),
    reset: () =>
      set({
        query: "",
        category: "",
        city: "",
        mobileOnly: false,
        homeOnly: false,
        instantOnly: false,
        openOnly: false,
        minimumRating: 0,
        sortBy: "recommended",
      }),
  }));
