export type ProductFinalStatus = "READY" | "RUNNING" | "COMPLETED" | "BLOCKED";

export interface ProductCapability {
  id: string;
  name: string;
  domain: string;
  ready: boolean;
  score: number;
}

export interface ProductExecutionResult {
  name: string;
  status: ProductFinalStatus;
  score: number;
  completedAt: string;
}