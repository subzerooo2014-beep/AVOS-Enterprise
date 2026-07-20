export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type ExperimentStatus =
  | "draft"
  | "running"
  | "completed"
  | "stopped";

export interface CampaignMetric {
  name: string;
  value: number;
  target?: number;
  unit: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  channels: string[];
  audienceIds: string[];
  budget: number;
  currency: string;
  startAt: string;
  endAt: string;
  status: CampaignStatus;
  metrics: CampaignMetric[];
  owner: string;
  requiresHumanApproval: boolean;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  order: number;
  entrants: number;
  conversions: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface FunnelSnapshot {
  id: string;
  name: string;
  campaignId?: string;
  stages: FunnelStage[];
  overallConversionRate: number;
  bottleneckStage?: string;
  generatedAt: string;
}

export interface JourneyTouchpoint {
  id: string;
  channel: string;
  action: string;
  sentiment: number;
  frictionScore: number;
  occurredAt: string;
}

export interface CustomerJourney {
  id: string;
  customerId: string;
  segment: string;
  touchpoints: JourneyTouchpoint[];
  journeyScore: number;
  churnRisk: number;
  recommendedNextAction: string;
  generatedAt: string;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  allocation: number;
  participants: number;
  conversions: number;
  conversionRate: number;
}

export interface GrowthExperiment {
  id: string;
  name: string;
  hypothesis: string;
  primaryMetric: string;
  variants: ExperimentVariant[];
  confidenceThreshold: number;
  status: ExperimentStatus;
  winnerVariantId?: string;
  requiresHumanApproval: boolean;
  approvedBy?: string;
  createdAt: string;
  completedAt?: string;
}