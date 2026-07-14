export type AuctionStatus = "DRAFT" | "LIVE" | "ENDED" | "CANCELLED";

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  createdAt: string;
}

export interface AuctionRecord {
  id: string;
  vehicleId: string;
  title: string;
  startingPrice: number;
  currentPrice: number;
  reservePrice: number;
  status: AuctionStatus;
  startsAt: string;
  endsAt: string;
  winnerBidId?: string;
  createdAt: string;
}