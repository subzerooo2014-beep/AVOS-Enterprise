export type MemoryAnalyticsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryAnalyticsRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryAnalyticsState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryAnalyticsStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Analytics";
  status: "operational";
  capabilities: string[];
  records: number;
}