export interface DealerIntelligenceInput {
  dealerId: string;
  trustScore: number;
  responseRate: number;
  fulfillmentRate: number;
  disputeRate: number;
  activeListings: number;
}

export interface DealerIntelligenceResult {
  dealerId: string;
  dealerScore: number;
  tier: "ELITE" | "VERIFIED" | "STANDARD" | "RESTRICTED";
  actions: string[];
}
