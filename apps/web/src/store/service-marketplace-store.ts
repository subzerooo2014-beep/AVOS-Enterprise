"use client";

import { create } from "zustand";
import {
  AutomotiveService,
  ServiceCategory,
} from "@/data/services";

interface ServiceMarketplaceState {
  category: ServiceCategory | "";
  city: string;
  mobileOnly: boolean;
  instantOnly: boolean;
  selectedService: AutomotiveService | null;
  setCategory: (
    category: ServiceCategory | "",
  ) => void;
  setCity: (city: string) => void;
  setMobileOnly: (value: boolean) => void;
  setInstantOnly: (value: boolean) => void;
  selectService: (
    service: AutomotiveService | null,
  ) => void;
  reset: () => void;
}

export const useServiceMarketplaceStore =
  create<ServiceMarketplaceState>((set) => ({
    category: "",
    city: "",
    mobileOnly: false,
    instantOnly: false,
    selectedService: null,
    setCategory: (category) =>
      set({ category }),
    setCity: (city) =>
      set({ city }),
    setMobileOnly: (mobileOnly) =>
      set({ mobileOnly }),
    setInstantOnly: (instantOnly) =>
      set({ instantOnly }),
    selectService: (selectedService) =>
      set({ selectedService }),
    reset: () =>
      set({
        category: "",
        city: "",
        mobileOnly: false,
        instantOnly: false,
      }),
  }));
