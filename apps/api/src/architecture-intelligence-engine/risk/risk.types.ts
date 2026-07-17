export type ArchitectureRiskState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureRiskRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureRiskState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureRiskStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eR is k";
  status: "operational";
  capabilities: string[];
  records: number;
}