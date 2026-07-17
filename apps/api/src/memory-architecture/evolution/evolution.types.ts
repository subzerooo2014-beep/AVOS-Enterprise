export type MemoryEvolutionState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryEvolutionRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryEvolutionState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryEvolutionStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Evolution";
  status: "operational";
  capabilities: string[];
  records: number;
}