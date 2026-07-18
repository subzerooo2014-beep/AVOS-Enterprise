"use client";

import { create } from "zustand";
import {
  defaultVehicleFilters,
  VehicleSearchFilters,
} from "@/lib/vehicle-search";

interface VehicleSearchState {
  filters: VehicleSearchFilters;
  favorites: readonly string[];
  compared: readonly string[];
  savedSearches: readonly VehicleSearchFilters[];
  setFilter: <K extends keyof VehicleSearchFilters>(
    key: K,
    value: VehicleSearchFilters[K],
  ) => void;
  resetFilters: () => void;
  toggleFavorite: (vehicleId: string) => void;
  toggleCompare: (vehicleId: string) => void;
  saveCurrentSearch: () => void;
  clearComparison: () => void;
}

export const useVehicleSearchStore =
  create<VehicleSearchState>((set) => ({
    filters: defaultVehicleFilters,
    favorites: [],
    compared: [],
    savedSearches: [],
    setFilter: (key, value) =>
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      })),
    resetFilters: () =>
      set({
        filters: defaultVehicleFilters,
      }),
    toggleFavorite: (vehicleId) =>
      set((state) => ({
        favorites: state.favorites.includes(vehicleId)
          ? state.favorites.filter((id) => id !== vehicleId)
          : [...state.favorites, vehicleId],
      })),
    toggleCompare: (vehicleId) =>
      set((state) => {
        if (state.compared.includes(vehicleId)) {
          return {
            compared: state.compared.filter(
              (id) => id !== vehicleId,
            ),
          };
        }

        if (state.compared.length >= 3) {
          return {
            compared: [
              ...state.compared.slice(1),
              vehicleId,
            ],
          };
        }

        return {
          compared: [...state.compared, vehicleId],
        };
      }),
    saveCurrentSearch: () =>
      set((state) => ({
        savedSearches: [
          ...state.savedSearches,
          { ...state.filters },
        ],
      })),
    clearComparison: () =>
      set({
        compared: [],
      }),
  }));
