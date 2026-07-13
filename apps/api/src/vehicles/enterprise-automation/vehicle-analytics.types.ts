export interface VehicleAnalyticsInput {
  totalListings: number;
  approvedListings: number;
  rejectedListings: number;
  averageQualityScore: number;
  averageMarketScore: number;
}

export interface VehicleAnalyticsResult {
  approvalRate: number;
  rejectionRate: number;
  healthScore: number;
  status: "HEALTHY" | "WATCH" | "CRITICAL";
}
