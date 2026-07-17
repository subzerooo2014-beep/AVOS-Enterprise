export type MemoryStorageState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryStorageRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryStorageState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryStorageStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Storage";
  status: "operational";
  capabilities: string[];
  records: number;
}