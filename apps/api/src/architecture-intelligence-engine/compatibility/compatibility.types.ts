export type ArchitectureCompatibilityState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureCompatibilityRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureCompatibilityState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureCompatibilityStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eC om pa ti bi li ty";
  status: "operational";
  capabilities: string[];
  records: number;
}