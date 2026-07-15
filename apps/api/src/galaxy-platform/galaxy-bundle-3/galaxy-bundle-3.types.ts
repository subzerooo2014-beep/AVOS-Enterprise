export type GalaxyBundle3Status =
  | "READY"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface GalaxyBundle3Capability {
  capability: string;
  domain: string;
}

export interface GalaxyBundle3ExecutionRequest {
  capability: string;
  tenantId: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface GalaxyBundle3ExecutionResult {
  id: string;
  capability: string;
  domain: string;
  tenantId: string;
  action: string;
  status: GalaxyBundle3Status;
  success: boolean;
  score: number;
  timestamp: string;
  output: Record<string, unknown>;
}