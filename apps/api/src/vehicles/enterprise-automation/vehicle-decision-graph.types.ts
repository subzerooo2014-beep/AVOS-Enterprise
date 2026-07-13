export interface VehicleDecisionGraphInput {
  vehicleId: string;
  qualityScore: number;
  fraudRisk: "LOW" | "MEDIUM" | "HIGH";
  marketScore: number;
  buyerMatchScore: number;
  dealerScore: number;
}

export interface VehicleDecisionGraphResult {
  vehicleId: string;
  graphScore: number;
  decision: "PUBLISH" | "REVIEW" | "BLOCK";
  nodes: string[];
  reasons: string[];
}
