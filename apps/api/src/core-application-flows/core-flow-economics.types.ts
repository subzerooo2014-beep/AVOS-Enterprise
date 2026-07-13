export type FlowBudgetStatus =
  | "draft"
  | "active"
  | "exceeded"
  | "suspended"
  | "closed";

export type FlowBudget = {
  id: string;
  flow: string;
  currency: string;
  limit: number;
  consumed: number;
  reserved: number;
  status: FlowBudgetStatus;
  createdAt: string;
};

export type FlowChargebackRecord = {
  id: string;
  executionId: string;
  flow: string;
  tenantId: string;
  organizationId?: string;
  amount: number;
  currency: string;
  category: string;
  recordedAt: string;
};

export type FlowUnitEconomics = {
  id: string;
  flow: string;
  revenue: number;
  cost: number;
  margin: number;
  marginPercent: number;
  calculatedAt: string;
};

export type FlowPricingPolicy = {
  id: string;
  flow: string;
  basePrice: number;
  unitPrice: number;
  surgeMultiplier: number;
  currency: string;
  active: boolean;
  createdAt: string;
};
