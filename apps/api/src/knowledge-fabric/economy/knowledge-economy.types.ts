export type KnowledgeAssetState = "DRAFT" | "ACTIVE" | "FROZEN" | "RETIRED";
export type RevenueEventType = "SALE" | "USAGE" | "SUBSCRIPTION" | "ROYALTY" | "ADJUSTMENT";
export type IncentiveType = "CREATION" | "CURATION" | "VALIDATION" | "REUSE" | "IMPACT";
export type SettlementState = "PENDING" | "CALCULATED" | "APPROVED" | "SETTLED" | "FAILED";

export interface KnowledgeEconomicAsset {
  id: string;
  knowledgeId: string;
  ownerId: string;
  title: string;
  unitValue: number;
  currency: string;
  scarcityScore: number;
  qualityScore: number;
  reuseScore: number;
  impactScore: number;
  state: KnowledgeAssetState;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeRevenueEvent {
  id: string;
  assetId: string;
  type: RevenueEventType;
  grossAmount: number;
  currency: string;
  sourceId: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeStakeholderShare {
  stakeholderId: string;
  role: string;
  percentage: number;
}

export interface KnowledgeSettlement {
  id: string;
  assetId: string;
  period: string;
  grossRevenue: number;
  platformFee: number;
  distributableRevenue: number;
  currency: string;
  shares: Array<KnowledgeStakeholderShare & { amount: number }>;
  state: SettlementState;
  createdAt: string;
  settledAt?: string;
}

export interface KnowledgeIncentive {
  id: string;
  stakeholderId: string;
  assetId: string;
  type: IncentiveType;
  points: number;
  reason: string;
  createdAt: string;
}