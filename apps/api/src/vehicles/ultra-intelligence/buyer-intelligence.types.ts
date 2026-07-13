export interface BuyerIntelligenceInput {
  buyerId: string;
  budget: number;
  preferredBrands: string[];
  preferredBodyTypes: string[];
  location?: string;
}

export interface BuyerIntelligenceResult {
  buyerId: string;
  affinityScore: number;
  intent: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
}
