export type AuctionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "PAUSED"
  | "ENDED"
  | "SETTLEMENT"
  | "COMPLETED"
  | "CANCELLED";

export interface AuctionRecord {
  id: string;
  vehicleId: string;
  sellerId: string;
  title: string;
  reservePrice: number;
  startingPrice: number;
  currentPrice: number;
  minimumIncrement: number;
  startsAt: string;
  endsAt: string;
  status: AuctionStatus;
  highestBidId?: string;
  winnerId?: string;
  bidIds: string[];
  participantIds: string[];
  timeline: Array<{
    status: AuctionStatus;
    note: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
