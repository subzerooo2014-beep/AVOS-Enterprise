export type EnterpriseForecastTrend = "RISING" | "STABLE" | "FALLING";
export type EnterpriseOptimizationStatus =
  | "PROPOSED"
  | "APPROVED"
  | "APPLIED"
  | "REJECTED";

export interface EnterpriseWorkloadSample {
  id: string;
  source: string;
  requestsPerMinute: number;
  cpuPercent: number;
  memoryPercent: number;
  errorRate: number;
  recordedAt: string;
}

export interface EnterpriseDemandForecast {
  source: string;
  horizonMinutes: number;
  predictedRequestsPerMinute: number;
  predictedCpuPercent: number;
  predictedMemoryPercent: number;
  trend: EnterpriseForecastTrend;
  confidence: number;
  generatedAt: string;
}

export interface EnterpriseCapacityPlan {
  id: string;
  source: string;
  currentUnits: number;
  recommendedUnits: number;
  utilizationTarget: number;
  reason: string;
  generatedAt: string;
}

export interface EnterpriseOptimizationRecommendation {
  id: string;
  category: "PERFORMANCE" | "COST" | "CAPACITY" | "RELIABILITY";
  title: string;
  action: string;
  expectedImpact: number;
  status: EnterpriseOptimizationStatus;
  createdAt: string;
  appliedAt?: string;
}

export interface EnterpriseOptimizationSnapshot {
  samples: number;
  forecasts: number;
  capacityPlans: number;
  recommendations: number;
  appliedRecommendations: number;
  performanceScore: number;
  costEfficiencyScore: number;
  optimizationReadiness: number;
  generatedAt: string;
}