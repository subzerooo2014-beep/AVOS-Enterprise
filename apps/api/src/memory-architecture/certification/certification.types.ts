export type MemoryCertificationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemoryCertificationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemoryCertificationState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryCertificationStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Certification";
  status: "operational";
  capabilities: string[];
  records: number;
}