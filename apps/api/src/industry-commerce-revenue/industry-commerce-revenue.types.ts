export type CommerceStatus =
  | "DRAFT"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED";

export interface IndustryOffer {
  id: string;
  industryKey: string;
  tenantId: string;
  sellerId: string;
  buyerId?: string;
  entityId: string;
  amount: number;
  currency: string;
  status: CommerceStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryPricingRule {
  id: string;
  industryKey: string;
  capabilityKey: string;
  name: string;
  baseAmount: number;
  currency: string;
  commissionRate: number;
  platformFee: number;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustrySubscription {
  id: string;
  industryKey: string;
  tenantId: string;
  planCode: string;
  billingCycle: "MONTHLY" | "YEARLY";
  amount: number;
  currency: string;
  status: "ACTIVE" | "PAST_DUE" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryPayment {
  id: string;
  industryKey: string;
  tenantId: string;
  offerId?: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  provider: string;
  transactionReference?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueProtectionDecision {
  id: string;
  industryKey: string;
  tenantId: string;
  sourceType: string;
  sourceId: string;
  grossAmount: number;
  protectedRevenue: number;
  commissionAmount: number;
  platformFee: number;
  leakageDetected: boolean;
  blocked: boolean;
  reasons: string[];
  createdAt: string;
}

export interface IndustryRevenueSummary {
  industryKey: string;
  offers: number;
  subscriptions: number;
  payments: number;
  capturedRevenue: number;
  protectedRevenue: number;
  commissions: number;
  platformFees: number;
  leakageEvents: number;
  generatedAt: string;
}