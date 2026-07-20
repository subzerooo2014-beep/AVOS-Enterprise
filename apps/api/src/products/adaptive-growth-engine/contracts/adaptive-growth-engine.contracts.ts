export type GrowthPlanStatus =
  | "draft"
  | "pending-approval"
  | "approved"
  | "active"
  | "paused"
  | "completed"
  | "rejected";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface ProductMarketInput {
  tenantId: string;
  productId: string;
  productName: string;
  category: string;
  stage: "idea" | "early" | "growth" | "mature";
  targetMarkets: string[];
  targetSegments: string[];
  valueProposition: string;
  currentMetrics: {
    revenue: number;
    customers: number;
    conversionRate: number;
    retentionRate: number;
    churnRate: number;
    averageOrderValue: number;
    acquisitionCost: number;
    lifetimeValue: number;
  };
  constraints?: {
    budget?: number;
    riskTolerance?: "low" | "medium" | "high";
    complianceNotes?: string[];
  };
}

export interface ProductMarketAnalysis {
  id: string;
  tenantId: string;
  productId: string;
  productScore: number;
  marketScore: number;
  growthReadinessScore: number;
  strengths: string[];
  weaknesses: string[];
  marketSignals: string[];
  risks: string[];
  recommendedFocus: string[];
  evidence: Array<{
    source: string;
    description: string;
    confidence: number;
  }>;
  generatedAt: string;
}

export interface GrowthOpportunity {
  id: string;
  tenantId: string;
  productId: string;
  title: string;
  category:
    | "acquisition"
    | "activation"
    | "retention"
    | "revenue"
    | "referral"
    | "market-expansion";
  description: string;
  expectedImpact: number;
  confidence: number;
  effort: number;
  risk: number;
  priorityScore: number;
  rationale: string[];
  status: "identified" | "shortlisted" | "approved" | "rejected";
  generatedAt: string;
}

export interface GrowthStrategy {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  objective: string;
  horizonDays: number;
  northStarMetric: string;
  targets: Record<string, number>;
  strategicPillars: Array<{
    name: string;
    objective: string;
    initiatives: string[];
    weight: number;
  }>;
  assumptions: string[];
  risks: string[];
  status: GrowthPlanStatus;
  generatedAt: string;
}

export interface CampaignPlan {
  id: string;
  tenantId: string;
  productId: string;
  strategyId: string;
  name: string;
  objective: string;
  channels: string[];
  audiences: string[];
  budget: number;
  startAt: string;
  endAt: string;
  expectedMetrics: Record<string, number>;
  status: GrowthPlanStatus;
  generatedAt: string;
}

export interface ExperimentPlan {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  hypothesis: string;
  metric: string;
  control: string;
  variants: string[];
  sampleSize: number;
  confidenceTarget: number;
  status:
    | "draft"
    | "pending-approval"
    | "approved"
    | "running"
    | "completed"
    | "stopped"
    | "rejected";
  result?: {
    winner?: string;
    lift: number;
    confidence: number;
    recommendation: string;
  };
  generatedAt: string;
}

export interface PricingRecommendation {
  id: string;
  tenantId: string;
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  expectedConversionChange: number;
  expectedRevenueChange: number;
  confidence: number;
  rationale: string[];
  status: ApprovalStatus;
  generatedAt: string;
}

export interface RevenueForecast {
  id: string;
  tenantId: string;
  productId: string;
  horizonMonths: number;
  baselineRevenue: number;
  scenarios: {
    conservative: number[];
    expected: number[];
    aggressive: number[];
  };
  assumptions: string[];
  confidence: number;
  generatedAt: string;
}

export interface GrowthRecommendation {
  id: string;
  tenantId: string;
  productId: string;
  category: string;
  title: string;
  action: string;
  expectedImpact: number;
  urgency: number;
  confidence: number;
  priorityScore: number;
  explainability: string[];
  requiresHumanApproval: boolean;
  status: ApprovalStatus;
  generatedAt: string;
}

export interface AdaptationCycle {
  id: string;
  tenantId: string;
  productId: string;
  previousState: Record<string, number>;
  currentState: Record<string, number>;
  detectedChanges: string[];
  proposedAdaptations: string[];
  recommendations: GrowthRecommendation[];
  status: "generated" | "pending-approval" | "approved" | "applied" | "rejected";
  generatedAt: string;
}

export interface HumanApprovalDecision {
  id: string;
  subjectType: string;
  subjectId: string;
  decision: "approved" | "rejected";
  decidedBy: string;
  reason?: string;
  decidedAt: string;
}

export interface AdaptiveGrowthRun {
  id: string;
  tenantId: string;
  productId: string;
  analysisId: string;
  strategyId: string;
  opportunityIds: string[];
  campaignIds: string[];
  experimentIds: string[];
  pricingRecommendationId: string;
  revenueForecastId: string;
  recommendationIds: string[];
  status: "generated" | "pending-approval" | "approved" | "active";
  generatedAt: string;
}