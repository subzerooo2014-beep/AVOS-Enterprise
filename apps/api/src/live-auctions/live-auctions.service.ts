import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AuctionAnalytics,
  AuctionRecommendationRequest,
  AuctionRecord,
  AuctionStatus,
  BidRecord,
} from "./live-auctions.types";
import { LIVE_AUCTION_CAPABILITIES } from "./live-auctions.registry";

@Injectable()
export class LiveAuctionsService {
  private readonly auctions = new Map<string, AuctionRecord>();
  private readonly bids = new Map<string, BidRecord[]>();
  private readonly blockedBidders = new Set<string>();

  capabilities() {
    return {
      system: "AVOS Live Auctions & Real-Time Bidding",
      capabilities: [...LIVE_AUCTION_CAPABILITIES],
      status: "READY",
    };
  }

  createAuction(
    input: Omit<
      AuctionRecord,
      | "id"
      | "currentPrice"
      | "status"
      | "winnerBidId"
      | "createdAt"
      | "updatedAt"
    >,
  ): AuctionRecord {
    if (input.minimumIncrement <= 0) {
      throw new Error("minimumIncrement must be positive");
    }

    if (input.reservePrice < 0) {
      throw new Error("reservePrice cannot be negative");
    }

    const now = new Date().toISOString();

    const auction: AuctionRecord = {
      ...input,
      id: randomUUID(),
      currentPrice: 0,
      status: "DRAFT",
      allowedBidderIds: [...input.allowedBidderIds],
      createdAt: now,
      updatedAt: now,
    };

    this.auctions.set(auction.id, auction);
    this.bids.set(auction.id, []);

    return this.cloneAuction(auction);
  }

  scheduleAuction(id: string): AuctionRecord {
    const auction = this.requireAuction(id);
    auction.status = "SCHEDULED";
    auction.updatedAt = new Date().toISOString();
    this.auctions.set(id, auction);
    return this.cloneAuction(auction);
  }

  startAuction(id: string): AuctionRecord {
    const auction = this.requireAuction(id);
    auction.status = "LIVE";
    auction.updatedAt = new Date().toISOString();
    this.auctions.set(id, auction);
    return this.cloneAuction(auction);
  }

  placeBid(
    auctionId: string,
    bidderId: string,
    amount: number,
    proxyMaximum?: number,
  ): BidRecord {
    const auction = this.requireAuction(auctionId);

    if (auction.status !== "LIVE") {
      throw new Error("Auction is not live");
    }

    if (this.blockedBidders.has(bidderId)) {
      throw new Error("Bidder is blocked");
    }

    if (
      auction.privateAuction &&
      !auction.allowedBidderIds.includes(bidderId)
    ) {
      throw new Error("Bidder is not allowed in this private auction");
    }

    const minimumAllowed =
      auction.currentPrice === 0
        ? auction.minimumIncrement
        : auction.currentPrice + auction.minimumIncrement;

    if (amount < minimumAllowed) {
      throw new Error(`Bid must be at least ${minimumAllowed}`);
    }

    const bid: BidRecord = {
      id: randomUUID(),
      auctionId,
      bidderId,
      amount,
      automatic: proxyMaximum !== undefined,
      proxyMaximum,
      createdAt: new Date().toISOString(),
    };

    const history = this.bids.get(auctionId) ?? [];
    history.push(bid);
    this.bids.set(auctionId, history);

    auction.currentPrice = amount;
    auction.updatedAt = new Date().toISOString();

    const remainingMs =
      new Date(auction.endsAt).getTime() - Date.now();

    if (
      remainingMs > 0 &&
      remainingMs <= auction.antiSnipingSeconds * 1000
    ) {
      auction.endsAt = new Date(
        Date.now() + auction.antiSnipingSeconds * 1000,
      ).toISOString();
    }

    this.auctions.set(auctionId, auction);
    this.processProxyBids(auctionId);

    return { ...bid };
  }

  buyNow(auctionId: string, bidderId: string): AuctionRecord {
    const auction = this.requireAuction(auctionId);

    if (auction.status !== "LIVE") {
      throw new Error("Auction is not live");
    }

    if (!auction.buyNowPrice) {
      throw new Error("Buy now is not available");
    }

    const bid: BidRecord = {
      id: randomUUID(),
      auctionId,
      bidderId,
      amount: auction.buyNowPrice,
      automatic: false,
      createdAt: new Date().toISOString(),
    };

    const history = this.bids.get(auctionId) ?? [];
    history.push(bid);
    this.bids.set(auctionId, history);

    auction.currentPrice = auction.buyNowPrice;
    auction.winnerBidId = bid.id;
    auction.status = "ENDED";
    auction.updatedAt = new Date().toISOString();
    this.auctions.set(auctionId, auction);

    return this.cloneAuction(auction);
  }

  endAuction(id: string): AuctionRecord {
    const auction = this.requireAuction(id);
    const history = [...(this.bids.get(id) ?? [])].sort(
      (a, b) => b.amount - a.amount,
    );

    const highest = history[0];

    auction.status = "ENDED";
    auction.winnerBidId =
      highest && highest.amount >= auction.reservePrice
        ? highest.id
        : undefined;
    auction.updatedAt = new Date().toISOString();

    this.auctions.set(id, auction);
    return this.cloneAuction(auction);
  }

  moderateBidder(bidderId: string, blocked: boolean) {
    if (blocked) {
      this.blockedBidders.add(bidderId);
    } else {
      this.blockedBidders.delete(bidderId);
    }

    return {
      bidderId,
      blocked,
      updatedAt: new Date().toISOString(),
    };
  }

  bidHistory(auctionId: string): BidRecord[] {
    this.requireAuction(auctionId);

    return [...(this.bids.get(auctionId) ?? [])]
      .sort((a, b) => b.amount - a.amount)
      .map((bid) => ({ ...bid }));
  }

  recommend(request: AuctionRecommendationRequest): AuctionRecord[] {
    return Array.from(this.auctions.values())
      .filter((auction) =>
        ["SCHEDULED", "LIVE"].includes(auction.status),
      )
      .filter(
        (auction) =>
          !request.industryKey ||
          auction.industryKey === request.industryKey,
      )
      .filter(
        (auction) =>
          request.budget === undefined ||
          auction.currentPrice <= request.budget,
      )
      .sort((a, b) => b.currentPrice - a.currentPrice)
      .slice(0, 20)
      .map((auction) => this.cloneAuction(auction));
  }

  analytics(): AuctionAnalytics {
    const auctions = Array.from(this.auctions.values());
    const allBids = Array.from(this.bids.values()).flat();
    const winners = auctions
      .filter((auction) => auction.winnerBidId)
      .map((auction) => auction.currentPrice);

    return {
      auctions: auctions.length,
      liveAuctions: auctions.filter(
        (auction) => auction.status === "LIVE",
      ).length,
      bids: allBids.length,
      uniqueBidders: new Set(allBids.map((bid) => bid.bidderId)).size,
      grossWinningValue: Number(
        winners.reduce((sum, value) => sum + value, 0).toFixed(2),
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private processProxyBids(auctionId: string) {
    const auction = this.requireAuction(auctionId);
    const history = this.bids.get(auctionId) ?? [];

    const proxyBids = history
      .filter(
        (bid) =>
          bid.proxyMaximum !== undefined &&
          bid.proxyMaximum > auction.currentPrice,
      )
      .sort(
        (a, b) =>
          (b.proxyMaximum ?? 0) - (a.proxyMaximum ?? 0),
      );

    const winner = proxyBids[0];

    if (!winner) {
      return;
    }

    const nextAmount = Math.min(
      winner.proxyMaximum ?? auction.currentPrice,
      auction.currentPrice + auction.minimumIncrement,
    );

    if (nextAmount <= auction.currentPrice) {
      return;
    }

    const autoBid: BidRecord = {
      id: randomUUID(),
      auctionId,
      bidderId: winner.bidderId,
      amount: nextAmount,
      automatic: true,
      proxyMaximum: winner.proxyMaximum,
      createdAt: new Date().toISOString(),
    };

    history.push(autoBid);
    this.bids.set(auctionId, history);

    auction.currentPrice = nextAmount;
    auction.updatedAt = new Date().toISOString();
    this.auctions.set(auctionId, auction);
  }

  private requireAuction(id: string): AuctionRecord {
    const auction = this.auctions.get(id);

    if (!auction) {
      throw new Error(`Auction not found: ${id}`);
    }

    return auction;
  }

  private cloneAuction(auction: AuctionRecord): AuctionRecord {
    return {
      ...auction,
      allowedBidderIds: [...auction.allowedBidderIds],
    };
  }
}