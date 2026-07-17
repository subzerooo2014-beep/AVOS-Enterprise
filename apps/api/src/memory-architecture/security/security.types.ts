export type MemorySecurityState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MemorySecurityRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MemorySecurityState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemorySecurityStatus {
  system: "AVOS Memory Architecture";
  layer: "Memory Security";
  status: "operational";
  capabilities: string[];
  records: number;
}