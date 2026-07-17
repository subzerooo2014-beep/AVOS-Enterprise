export type ArchitectureEvolutionState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureEvolutionRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureEvolutionState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureEvolutionStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eE vo lu ti on";
  status: "operational";
  capabilities: string[];
  records: number;
}