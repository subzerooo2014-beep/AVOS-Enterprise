export type GrowthCapability =
  | "GROWTH_BRAIN"
  | "ACQUISITION_ENGINE"
  | "RETENTION_ENGINE"
  | "REFERRAL_ENGINE"
  | "VIRAL_ENGINE"
  | "SEO_ENGINE"
  | "CONTENT_FACTORY"
  | "SOCIAL_DISTRIBUTION"
  | "INFLUENCER_HUB"
  | "ADS_OPTIMIZATION"
  | "CAMPAIGN_ORCHESTRATION"
  | "EXPERIMENTATION"
  | "AB_TESTING"
  | "CONVERSION_OPTIMIZATION"
  | "CUSTOMER_LIFECYCLE"
  | "LOYALTY_ENGINE"
  | "PERSONALIZATION"
  | "NOTIFICATION_INTELLIGENCE"
  | "REVENUE_OPTIMIZER"
  | "ADAPTIVE_PRICING"
  | "MONETIZATION_ENGINE"
  | "SUBSCRIPTION_GROWTH"
  | "UPSELL_CROSS_SELL"
  | "MARKET_EXPANSION"
  | "LOCALIZATION_ENGINE"
  | "COMPETITOR_INTELLIGENCE"
  | "DEMAND_FORECASTING"
  | "GROWTH_ANALYTICS"
  | "UNIT_ECONOMICS"
  | "GROWTH_COMMAND_CENTER";

export interface GrowthInitiative {
  id: string;
  tenantId: string;
  capability: GrowthCapability;
  code: string;
  name: string;
  owner: string;
  objective: string;
  budget: number;
  currency: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface GrowthExperiment {
  id: string;
  initiativeId: string;
  name: string;
  hypothesis: string;
  controlValue: number;
  variantValue: number;
  confidence: number;
  winner: "CONTROL" | "VARIANT" | "INCONCLUSIVE";
  status: "DRAFT" | "RUNNING" | "COMPLETED";
  createdAt: string;
  completedAt?: string;
}

export interface RevenueOpportunity {
  id: string;
  tenantId: string;
  customerId: string;
  opportunityType: "UPSELL" | "CROSS_SELL" | "RENEWAL" | "PRICING" | "EXPANSION";
  estimatedValue: number;
  currency: string;
  probability: number;
  recommendation: string;
  status: "OPEN" | "ACCEPTED" | "WON" | "LOST";
  createdAt: string;
  updatedAt: string;
}