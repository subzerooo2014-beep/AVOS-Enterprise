export interface IndustryCustomerProfile {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  lifecycleStage:
    | "VISITOR"
    | "LEAD"
    | "PROSPECT"
    | "CUSTOMER"
    | "LOYAL"
    | "CHURNED";
  trustScore: number;
  lifetimeValue: number;
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryJourney {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  name: string;
  currentStep: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TrustReview {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  subjectType: string;
  subjectId: string;
  rating: number;
  comment?: string;
  verified: boolean;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  industryKey: string;
  tenantId: string;
  referrerCustomerId: string;
  referredCustomerId?: string;
  code: string;
  rewardAmount: number;
  currency: string;
  status: "CREATED" | "CONVERTED" | "REWARDED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyAccount {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  points: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  createdAt: string;
  updatedAt: string;
}

export interface GrowthCampaign {
  id: string;
  industryKey: string;
  tenantId: string;
  name: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "SOCIAL" | "IN_APP";
  audience: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  budget: number;
  currency: string;
  metrics: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationResult {
  id: string;
  industryKey: string;
  tenantId: string;
  customerId: string;
  recommendations: Array<{
    entityId: string;
    entityType: string;
    score: number;
    reason: string;
  }>;
  createdAt: string;
}