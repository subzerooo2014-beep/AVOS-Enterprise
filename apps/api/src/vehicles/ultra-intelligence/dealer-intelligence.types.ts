export interface DealerIntelligenceInput {
  dealerId: string;
  trustScore: number;
  responseRate: number;
  fulfillmentRate: number;
  disputeRate: number;
}

export interface DealerIntelligenceResult {
  dealerId: string;
  score: number;
  tier: "ELITE" | "VERIFIED" | "STANDARD" | "RESTRICTED";
}
