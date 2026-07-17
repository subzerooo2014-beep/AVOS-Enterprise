export type MemoryIntelligenceState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryIntelligenceRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryIntelligenceState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryIntelligenceStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Intelligence";
  status: "operational";
  capabilities: string[];
  records: number;
}