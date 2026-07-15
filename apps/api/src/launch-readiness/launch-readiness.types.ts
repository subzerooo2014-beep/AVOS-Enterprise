export type PlanKey = "FREE" | "PRO" | "PREMIUM" | "ENTERPRISE";

export interface PricingPlan {
  id: string;
  key: PlanKey;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  features: string[];
  limits: Record<string, number>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: "TRIAL" | "ACTIVE" | "PAST_DUE" | "SUSPENDED" | "CANCELLED";
  billingCycle: "MONTHLY" | "ANNUAL";
  seats: number;
  amount: number;
  currency: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  subscriptionId: string;
  number: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  status: "ISSUED" | "PAID" | "VOID" | "OVERDUE";
  dueAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  key: string;
  name: string;
  category: "PRODUCT" | "TECHNICAL" | "LEGAL" | "SECURITY" | "OPERATIONS" | "COMMERCIAL" | "SUPPORT";
  required: boolean;
  completed: boolean;
  evidence?: string;
  updatedAt: string;
}

export interface TenantActivation {
  id: string;
  tenantId: string;
  environment: "SANDBOX" | "STAGING" | "PRODUCTION";
  status: "PENDING" | "READY" | "ACTIVE" | "BLOCKED";
  readinessScore: number;
  blockers: string[];
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportCase {
  id: string;
  tenantId: string;
  requesterId: string;
  subject: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  slaMinutes: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface LaunchMetric {
  id: string;
  tenantId: string;
  key: string;
  value: number;
  unit: string;
  recordedAt: string;
}