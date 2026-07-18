"use client";

import { create } from "zustand";

interface AuctionBid {
  auctionId: string;
  amount: number;
  createdAt: string;
}

interface AuctionState {
  bids: readonly AuctionBid[];
  autoBidLimits: Readonly<Record<string, number>>;
  placeBid: (
    auctionId: string,
    amount: number,
  ) => void;
  setAutoBid: (
    auctionId: string,
    limit: number,
  ) => void;
}

export const useAuctionStore =
  create<AuctionState>((set) => ({
    bids: [],
    autoBidLimits: {},
    placeBid: (auctionId, amount) =>
      set((state) => ({
        bids: [
          ...state.bids,
          {
            auctionId,
            amount,
            createdAt:
              new Date().toISOString(),
          },
        ],
      })),
    setAutoBid: (auctionId, limit) =>
      set((state) => ({
        autoBidLimits: {
          ...state.autoBidLimits,
          [auctionId]: limit,
        },
      })),
  }));
