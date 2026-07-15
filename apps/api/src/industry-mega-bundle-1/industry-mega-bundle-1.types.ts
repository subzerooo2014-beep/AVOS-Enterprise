export type IndustryCode =
  | "HEALTHCARE"
  | "CONSTRUCTION"
  | "MANUFACTURING"
  | "LOGISTICS_FLEET"
  | "REAL_ESTATE";

export interface IndustryRecord {
  id: string;
  tenantId: string;
  industry: IndustryCode;
  code: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "COMPLETED";
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryMetric {
  industry: IndustryCode;
  key: string;
  value: number;
  unit: string;
  recordedAt: string;
}

export interface IndustryAiInsight {
  id: string;
  industry: IndustryCode;
  subjectId: string;
  insightType: string;
  score: number;
  recommendation: string;
  factors: string[];
  createdAt: string;
}