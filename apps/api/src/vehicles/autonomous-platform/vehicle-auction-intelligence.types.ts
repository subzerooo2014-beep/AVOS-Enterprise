export interface VehicleAuctionIntelligenceInput {
  vehicleId: string;
  primaryScore: number;
  secondaryScore: number;
  riskScore: number;
}

export interface VehicleAuctionIntelligenceResult {
  vehicleId: string;
  auctionScore: number;
  status: "STRONG" | "WATCH" | "WEAK";
  recommendations: string[];
}
