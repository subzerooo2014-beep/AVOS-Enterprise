export type MemoryFoundationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryFoundationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryFoundationState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryFoundationStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Foundation";
  status: "operational";
  capabilities: string[];
  records: number;
}