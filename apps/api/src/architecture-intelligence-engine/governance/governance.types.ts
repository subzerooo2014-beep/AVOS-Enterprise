export type ArchitectureGovernanceState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureGovernanceRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureGovernanceState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureGovernanceStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eG ov er na nc e";
  status: "operational";
  capabilities: string[];
  records: number;
}