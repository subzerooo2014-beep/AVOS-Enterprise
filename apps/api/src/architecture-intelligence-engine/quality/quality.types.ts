export type ArchitectureQualityState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureQualityRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureQualityState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureQualityStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eQ ua li ty";
  status: "operational";
  capabilities: string[];
  records: number;
}