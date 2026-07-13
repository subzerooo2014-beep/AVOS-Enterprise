export type FlowTenantContext = {
  tenantId: string;
  organizationId?: string;
  region?: string;
  dataResidency?: string;
};

export type FlowServiceLevel = {
  id: string;
  flow: string;
  targetMs: number;
  warningMs: number;
  breachMs: number;
  createdAt: string;
};

export type FlowCostRecord = {
  id: string;
  executionId: string;
  flow: string;
  units: number;
  unitCost: number;
  totalCost: number;
  currency: string;
  recordedAt: string;
};

export type FlowDataLineage = {
  id: string;
  executionId: string;
  source: string;
  target: string;
  transformation: string;
  createdAt: string;
};

export type FlowRetentionPolicy = {
  id: string;
  name: string;
  retentionDays: number;
  purgeMode: "soft" | "hard";
  appliesTo: string[];
  active: boolean;
  createdAt: string;
};
