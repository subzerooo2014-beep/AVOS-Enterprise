export type MemoryFederationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryFederationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryFederationState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryFederationStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Federation";
  status: "operational";
  capabilities: string[];
  records: number;
}