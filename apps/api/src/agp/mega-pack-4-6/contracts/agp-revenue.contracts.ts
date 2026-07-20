export interface RevenueRecord {
  id: string;
  source: string;
  productId?: string;
  customerId?: string;
  amount: number;
  currency: string;
  occurredAt: string;
  metadata: Record<string, string>;
}

export interface RevenueInsight {
  id: string;
  period: string;
  totalRevenue: number;
  averageOrderValue: number;
  transactionCount: number;
  growthRate: number;
  topSources: Array<{ source: string; revenue: number }>;
  risks: string[];
  opportunities: string[];
  generatedAt: string;
}

export interface PricingScenario {
  id: string;
  productId: string;
  currentPrice: number;
  proposedPrice: number;
  currency: string;
  estimatedDemandChange: number;
  estimatedRevenueChange: number;
  elasticity: number;
  confidence: number;
  risk: "low" | "medium" | "high";
  requiresHumanApproval: boolean;
  generatedAt: string;
}

export interface RevenueForecastPoint {
  period: string;
  predictedRevenue: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface RevenueForecast {
  id: string;
  horizon: number;
  currency: string;
  points: RevenueForecastPoint[];
  assumptions: string[];
  risks: string[];
  generatedAt: string;
}

export interface AttributionTouch {
  channel: string;
  weight: number;
  attributedRevenue: number;
}

export interface GrowthAttribution {
  id: string;
  model: "first-touch" | "last-touch" | "linear" | "position-based";
  totalRevenue: number;
  touches: AttributionTouch[];
  generatedAt: string;
}