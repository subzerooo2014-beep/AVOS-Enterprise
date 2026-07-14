export type UltraStatus = "PLANNED" | "RUNNING" | "COMPLETED" | "BLOCKED";

export interface UltraCapability {
  id: string;
  name: string;
  domain: string;
  score: number;
  enabled: boolean;
  createdAt: string;
}

export interface UltraExecution {
  id: string;
  name: string;
  steps: string[];
  status: UltraStatus;
  score: number;
  startedAt: string;
  completedAt?: string;
}