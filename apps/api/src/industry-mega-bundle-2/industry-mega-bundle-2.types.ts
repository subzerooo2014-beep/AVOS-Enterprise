export type IndustryCode =
  | "AVIATION"
  | "MARITIME"
  | "AGRICULTURE"
  | "ENERGY_UTILITIES"
  | "BANKING_FINANCE";

export interface IndustryAsset {
  id: string;
  tenantId: string;
  industry: IndustryCode;
  code: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "RETIRED";
  attributes: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryOperation {
  id: string;
  industry: IndustryCode;
  assetId: string;
  operationType: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  startedAt?: string;
  completedAt?: string;
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryRisk {
  id: string;
  industry: IndustryCode;
  subjectId: string;
  riskType: string;
  score: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
  factors: string[];
  createdAt: string;
}