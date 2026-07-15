export type IndustryCode =
  | "INSURANCE"
  | "RETAIL_COMMERCE"
  | "HOSPITALITY"
  | "EDUCATION"
  | "GOVERNMENT";

export interface IndustryEntity {
  id: string;
  tenantId: string;
  industry: IndustryCode;
  code: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "CLOSED";
  attributes: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryTransaction {
  id: string;
  industry: IndustryCode;
  entityId: string;
  transactionType: string;
  amount: number;
  currency: string;
  status: "PENDING" | "APPROVED" | "SETTLED" | "REJECTED";
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryAiDecision {
  id: string;
  industry: IndustryCode;
  subjectId: string;
  decisionType: string;
  score: number;
  outcome: string;
  reasons: string[];
  createdAt: string;
}