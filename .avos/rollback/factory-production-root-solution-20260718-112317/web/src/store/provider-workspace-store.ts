"use client";

import { create } from "zustand";

type BookingStatusFilter = "all" | "confirmed" | "waiting" | "in-progress" | "completed" | "cancelled";

interface ProviderWorkspaceState {
  activeBranchId: string;
  selectedDate: string;
  bookingStatus: BookingStatusFilter;
  bookingQuery: string;
  rescheduledBookings: Record<string, string>;
  cancelledBookings: string[];
  setActiveBranch: (branchId: string) => void;
  setSelectedDate: (date: string) => void;
  setBookingStatus: (status: BookingStatusFilter) => void;
  setBookingQuery: (query: string) => void;
  rescheduleBooking: (bookingId: string, time: string) => void;
  cancelBooking: (bookingId: string) => void;
}

export const useProviderWorkspaceStore = create<ProviderWorkspaceState>((set) => ({
  activeBranchId: "all",
  selectedDate: "2026-07-13",
  bookingStatus: "all",
  bookingQuery: "",
  rescheduledBookings: {},
  cancelledBookings: [],
  setActiveBranch: (activeBranchId) => set({ activeBranchId }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setBookingStatus: (bookingStatus) => set({ bookingStatus }),
  setBookingQuery: (bookingQuery) => set({ bookingQuery }),
  rescheduleBooking: (bookingId, time) => set((state) => ({
    rescheduledBookings: { ...state.rescheduledBookings, [bookingId]: time },
  })),
  cancelBooking: (bookingId) => set((state) => ({
    cancelledBookings: state.cancelledBookings.includes(bookingId)
      ? state.cancelledBookings
      : [...state.cancelledBookings, bookingId],
  })),
}));
