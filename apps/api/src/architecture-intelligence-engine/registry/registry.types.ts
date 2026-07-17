export type ArchitectureRegistryState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureRegistryRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureRegistryState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureRegistryStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eR eg is tr y";
  status: "operational";
  capabilities: string[];
  records: number;
}