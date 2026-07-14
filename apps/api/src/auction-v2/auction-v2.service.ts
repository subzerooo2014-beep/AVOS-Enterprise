import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AuctionBid, AuctionRecord } from "./auction-v2.types";

@Injectable()
export class AuctionV2Service {
  private readonly auctions = new Map<string, AuctionRecord>();
  private readonly bids: AuctionBid[] = [];

  create(input: {
    vehicleId?: string;
    title?: string;
    startingPrice?: number;
    reservePrice?: number;
    durationMinutes?: number;
  }): AuctionRecord {
    const now = Date.now();
    const durationMinutes = Math.max(1, input.durationMinutes ?? 60);

    const auction: AuctionRecord = {
      id: randomUUID(),
      vehicleId: input.vehicleId?.trim() || "vehicle-demo-001",
      title: input.title?.trim() || "AVOS Live Vehicle Auction",
      startingPrice: Math.max(0, input.startingPrice ?? 100000),
      currentPrice: Math.max(0, input.startingPrice ?? 100000),
      reservePrice: Math.max(0, input.reservePrice ?? 120000),
      status: "LIVE",
      startsAt: new Date(now).toISOString(),
      endsAt: new Date(now + durationMinutes * 60_000).toISOString(),
      createdAt: new Date(now).toISOString(),
    };

    this.auctions.set(auction.id, auction);
    return auction;
  }

  placeBid(auctionId: string, bidderId: string, amount: number): AuctionBid {
    const auction = this.get(auctionId);

    if (auction.status !== "LIVE") {
      throw new Error("Auction is not live.");
    }

    if (Date.now() >= new Date(auction.endsAt).getTime()) {
      auction.status = "ENDED";
      throw new Error("Auction has ended.");
    }

    if (amount <= auction.currentPrice) {
      throw new Error("Bid must be greater than current price.");
    }

    const bid: AuctionBid = {
      id: randomUUID(),
      auctionId,
      bidderId: bidderId.trim() || "bidder-demo",
      amount,
      createdAt: new Date().toISOString(),
    };

    this.bids.push(bid);
    auction.currentPrice = amount;
    return bid;
  }

  end(auctionId: string): AuctionRecord {
    const auction = this.get(auctionId);
    const auctionBids = this.listBids(auctionId).sort((a, b) => b.amount - a.amount);
    const topBid = auctionBids[0];

    auction.status = "ENDED";

    if (topBid && topBid.amount >= auction.reservePrice) {
      auction.winnerBidId = topBid.id;
    }

    return auction;
  }

  get(id: string): AuctionRecord {
    const auction = this.auctions.get(id);
    if (!auction) {
      throw new Error(`Auction not found: ${id}`);
    }
    return auction;
  }

  list(): AuctionRecord[] {
    return [...this.auctions.values()];
  }

  listBids(auctionId: string): AuctionBid[] {
    return this.bids.filter((bid) => bid.auctionId === auctionId);
  }

  summary(auctionId: string) {
    const auction = this.get(auctionId);
    const bids = this.listBids(auctionId);
    const winner = auction.winnerBidId
      ? bids.find((bid) => bid.id === auction.winnerBidId) || null
      : null;

    return {
      auction,
      bids,
      bidCount: bids.length,
      winner,
      reserveMet: auction.currentPrice >= auction.reservePrice,
    };
  }
}