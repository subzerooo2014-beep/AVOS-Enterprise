export type MemoryAiState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryAiRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryAiState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryAiStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory AI";
  status: "operational";
  capabilities: string[];
  records: number;
}