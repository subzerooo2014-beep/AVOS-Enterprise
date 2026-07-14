export type FoundationStatus = "DRAFT" | "ACTIVE" | "DEGRADED" | "RETIRED";

export interface FoundationCapabilityRecord {
  id: string;
  code: string;
  name: string;
  domain: string;
  version: string;
  status: FoundationStatus;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundationAssessment {
  score: number;
  status: "BLOCK" | "REVIEW" | "APPROVE";
  findings: string[];
}
