export type AuctionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "ENDED"
  | "CANCELLED";

export interface AuctionRecord {
  id: string;
  tenantId: string;
  industryKey: string;
  sellerId: string;
  entityId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  reservePrice: number;
  buyNowPrice?: number;
  minimumIncrement: number;
  currentPrice: number;
  currency: string;
  privateAuction: boolean;
  allowedBidderIds: string[];
  antiSnipingSeconds: number;
  status: AuctionStatus;
  winnerBidId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BidRecord {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  automatic: boolean;
  proxyMaximum?: number;
  createdAt: string;
}

export interface AuctionRecommendationRequest {
  bidderId: string;
  industryKey?: string;
  budget?: number;
  preferences?: Record<string, unknown>;
}

export interface AuctionAnalytics {
  auctions: number;
  liveAuctions: number;
  bids: number;
  uniqueBidders: number;
  grossWinningValue: number;
  generatedAt: string;
}